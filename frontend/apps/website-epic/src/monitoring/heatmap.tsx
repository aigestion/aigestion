import { useEffect, useState, useCallback, useRef } from 'react';

export interface HeatmapPoint {
  readonly x: number;
  readonly y: number;
  readonly timestamp: number;
  readonly type: 'click' | 'move' | 'scroll' | 'hover';
  readonly element?: string;
  readonly value?: number;
  readonly sessionId: string;
  readonly userId?: string;
}

export interface HeatmapConfig {
  readonly endpoint?: string;
  readonly apiKey?: string;
  readonly userId?: string;
  readonly enableClickTracking?: boolean;
  readonly enableMoveTracking?: boolean;
  readonly enableScrollTracking?: boolean;
  readonly enableHoverTracking?: boolean;
  readonly sampleRate?: number;
  readonly throttleMs?: number;
  readonly maxPoints?: number;
  readonly debugMode?: boolean;
  readonly ignoreElements?: string[];
}

export interface HeatmapSession {
  readonly id: string;
  readonly userId?: string;
  readonly startTime: number;
  readonly endTime?: number;
  readonly duration?: number;
  readonly url: string;
  readonly referrer: string;
  readonly userAgent: string;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly points: HeatmapPoint[];
  readonly metadata?: Record<string, any>;
}

export function useHeatmap(config: HeatmapConfig = {}) {
  const {
    endpoint = '/api/heatmap',
    apiKey,
    userId,
    enableClickTracking = true,
    enableMoveTracking = false,
    enableScrollTracking = true,
    enableHoverTracking = false,
    sampleRate = 0.1,
    throttleMs = 100,
    maxPoints = 1000,
    debugMode = false,
    ignoreElements = ['script', 'style', 'link', 'meta'],
  } = config;

  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [session, setSession] = useState<HeatmapSession | null>(null);

  const sessionId = useRef(generateSessionId());
  const lastMoveTime = useRef(0);
  const lastScrollTime = useRef(0);
  const lastHoverTime = useRef(0);

  // Generate unique session ID
  function generateSessionId(): string {
    return 'heatmap_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Throttle function
  function throttle<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Check if element should be ignored
  function shouldIgnoreElement(element: Element): boolean {
    if (!element) return true;
    
    const tagName = element.tagName.toLowerCase();
    if (ignoreElements.includes(tagName)) return true;
    
    // Check if element or its parents have data-no-heatmap attribute
    let current = element;
    while (current && current !== document.body) {
      if (current.hasAttribute('data-no-heatmap')) return true;
      current = current.parentElement;
    }
    
    return false;
  }

  // Get element selector for tracking
  function getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ').join('.')}`;
    if (element.tagName) return element.tagName.toLowerCase();
    return 'unknown';
  }

  // Add point to heatmap
  const addPoint = useCallback((
    x: number,
    y: number,
    type: HeatmapPoint['type'],
    element?: string,
    value?: number
  ) => {
    if (Math.random() > sampleRate) return;

    const point: HeatmapPoint = {
      x,
      y,
      timestamp: Date.now(),
      type,
      element,
      value,
      sessionId: sessionId.current,
      userId,
    };

    setPoints(prev => {
      const updated = [...prev, point];
      return updated.slice(-maxPoints);
    });

    if (debugMode) {
      console.log('Heatmap point added:', point);
    }
  }, [sampleRate, maxPoints, debugMode, userId]);

  // Handle click events
  const handleClick = useCallback((event: MouseEvent) => {
    if (!enableClickTracking || shouldIgnoreElement(event.target as Element)) return;

    const element = event.target as Element;
    const selector = getElementSelector(element);
    
    addPoint(event.clientX, event.clientY, 'click', selector);
  }, [enableClickTracking, addPoint]);

  // Handle mouse move events
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enableMoveTracking || shouldIgnoreElement(event.target as Element)) return;

    const now = Date.now();
    if (now - lastMoveTime.current < throttleMs) return;
    lastMoveTime.current = now;

    const element = event.target as Element;
    const selector = getElementSelector(element);
    
    addPoint(event.clientX, event.clientY, 'move', selector);
  }, [enableMoveTracking, throttleMs, addPoint]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!enableScrollTracking) return;

    const now = Date.now();
    if (now - lastScrollTime.current < throttleMs) return;
    lastScrollTime.current = now;

    const scrollX = globalThis.scrollX;
    const scrollY = globalThis.scrollY;
    
    addPoint(scrollX, scrollY, 'scroll');
  }, [enableScrollTracking, throttleMs, addPoint]);

  // Handle hover events
  const handleMouseOver = useCallback((event: MouseEvent) => {
    if (!enableHoverTracking || shouldIgnoreElement(event.target as Element)) return;

    const now = Date.now();
    if (now - lastHoverTime.current < throttleMs) return;
    lastHoverTime.current = now;

    const element = event.target as Element;
    const selector = getElementSelector(element);
    
    addPoint(event.clientX, event.clientY, 'hover', selector);
  }, [enableHoverTracking, throttleMs, addPoint]);

  // Create session
  const createSession = useCallback(() => {
    const newSession: HeatmapSession = {
      id: sessionId.current,
      userId,
      startTime: Date.now(),
      url: globalThis.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
      },
      points: [],
    };

    setSession(newSession);
    return newSession;
  }, [userId]);

  // End session
  const endSession = useCallback(() => {
    if (!session) return;

    const endedSession = {
      ...session,
      endTime: Date.now(),
      duration: Date.now() - session.startTime,
      points: [...points],
    };

    setSession(endedSession);
    return endedSession;
  }, [session, points]);

  // Send session to server
  const sendSession = useCallback(async (sessionData: HeatmapSession) => {
    if (!endpoint) return;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        },
        body: JSON.stringify(sessionData),
      });

      if (debugMode) {
        console.log('Heatmap session sent:', sessionData);
      }
    } catch (err) {
      if (debugMode) {
        console.error('Heatmap: Failed to send session', err);
      }
    }
  }, [endpoint, apiKey, debugMode]);

  // Start recording
  const startRecording = useCallback(() => {
    if (isRecording) return;

    const newSession = createSession();
    setIsRecording(true);

    if (debugMode) {
      console.log('Heatmap recording started:', newSession.id);
    }
  }, [isRecording, createSession, debugMode]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    const endedSession = endSession();
    setIsRecording(false);

    if (endedSession) {
      await sendSession(endedSession);
    }

    if (debugMode) {
      console.log('Heatmap recording stopped:', endedSession?.id);
    }
  }, [isRecording, endSession, sendSession, debugMode]);

  // Clear points
  const clearPoints = useCallback(() => {
    setPoints([]);
  }, []);

  // Get heatmap data
  const getHeatmapData = useCallback(() => {
    return {
      points,
      session,
      isRecording,
      sessionId: sessionId.current,
    };
  }, [points, session, isRecording]);

  // Setup event listeners
  useEffect(() => {
    if (isRecording) {
      const throttledMouseMove = throttle(handleMouseMove, throttleMs);
      const throttledScroll = throttle(handleScroll, throttleMs);
      const throttledMouseOver = throttle(handleMouseOver, throttleMs);

      globalThis.addEventListener('click', handleClick);
      globalThis.addEventListener('mousemove', throttledMouseMove);
      globalThis.addEventListener('scroll', throttledScroll, { passive: true });
      globalThis.addEventListener('mouseover', throttledMouseOver);

      return () => {
        globalThis.removeEventListener('click', handleClick);
        globalThis.removeEventListener('mousemove', throttledMouseMove);
        globalThis.removeEventListener('scroll', throttledScroll);
        globalThis.removeEventListener('mouseover', throttledMouseOver);
      };
    }
  }, [
    isRecording,
    handleClick,
    handleMouseMove,
    handleScroll,
    handleMouseOver,
    throttleMs,
  ]);

  // Auto-start recording on mount
  useEffect(() => {
    startRecording();

    // Auto-stop recording on unmount
    return () => {
      stopRecording();
    };
  }, []);

  // Auto-send session periodically
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const currentSession = endSession();
      if (currentSession && currentSession.points.length > 0) {
        sendSession(currentSession);
      }
    }, 30000); // Send every 30 seconds

    return () => clearInterval(interval);
  }, [isRecording, endSession, sendSession]);

  return {
    points,
    session,
    isRecording,
    startRecording,
    stopRecording,
    clearPoints,
    getHeatmapData,
    sessionId: sessionId.current,
  };
}

// Heatmap Visualization Component
export function HeatmapVisualization({
  points,
  width = 800,
  height = 600,
  radius = 20,
  opacity = 0.5,
}: {
  readonly points: HeatmapPoint[];
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create gradient for heatmap
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, `rgba(255, 0, 0, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 0, ${opacity * 0.5})`);
    gradient.addColorStop(1, `rgba(0, 255, 0, 0)`);

    // Draw points
    points.forEach(point => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    });
  }, [points, width, height, radius, opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 dark:border-gray-700 rounded"
    />
  );
}

// Heatmap Dashboard Component
export function HeatmapDashboard() {
  const { points, session, isRecording, startRecording, stopRecording, clearPoints } = useHeatmap({
    enableMoveTracking: true,
    enableHoverTracking: true,
    debugMode: true,
  });

  const getPointStats = useCallback(() => {
    const stats = {
      total: points.length,
      clicks: points.filter(p => p.type === 'click').length,
      moves: points.filter(p => p.type === 'move').length,
      scrolls: points.filter(p => p.type === 'scroll').length,
      hovers: points.filter(p => p.type === 'hover').length,
      duration: session ? (session.endTime || Date.now()) - session.startTime : 0,
    };

    return stats;
  }, [points, session]);

  const stats = getPointStats();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Heatmap Analytics
        </h2>
        <div className="flex gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded transition-colors ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRecording ? 'Stop' : 'Start'} Recording
          </button>
          <button
            onClick={clearPoints}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Points
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.clicks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Clicks
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.moves}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Moves
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.hovers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hovers
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.floor(stats.duration / 1000)}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Duration
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Heatmap Visualization
        </h3>
        <div className="overflow-auto">
          <HeatmapVisualization
            points={points}
            width={800}
            height={400}
            radius={15}
            opacity={0.6}
          />
        </div>
      </div>

      {/* Session Info */}
      {session && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Session Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Session ID:
              </span>{' '}
              <span className="text-gray-900 dark:text-white">
                {session.id}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                URL:
              </span>{' '}
              <span className="text-gray-900 dark:text-white truncate">
                {session.url}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Viewport:
              </span>{' '}
              <span className="text-gray-900 dark:text-white">
                {session.viewport.width}x{session.viewport.height}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                User Agent:
              </span>{' '}
              <span className="text-gray-900 dark:text-white truncate">
                {session.userAgent.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
