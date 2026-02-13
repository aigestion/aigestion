import { useEffect, useRef, useState, useCallback } from 'react';

export interface GestureConfig {
  readonly threshold?: number;
  readonly timeout?: number;
  readonly preventDefault?: boolean;
  readonly capture?: boolean;
}

export interface GestureEvent {
  readonly type: 'swipe' | 'pinch' | 'rotate' | 'tap' | 'longpress' | 'doubletap' | 'pan';
  readonly direction?: 'up' | 'down' | 'left' | 'right';
  readonly distance?: number;
  readonly velocity?: number;
  readonly scale?: number;
  readonly rotation?: number;
  readonly duration?: number;
  readonly timestamp: number;
  readonly touches: number;
}

export interface GestureHandlers {
  readonly onSwipe?: (event: GestureEvent) => void;
  readonly onPinch?: (event: GestureEvent) => void;
  readonly onRotate?: (event: GestureEvent) => void;
  readonly onTap?: (event: GestureEvent) => void;
  readonly onLongPress?: (event: GestureEvent) => void;
  readonly onDoubleTap?: (event: GestureEvent) => void;
  readonly onPan?: (event: GestureEvent) => void;
}

export function useGestureRecognition(
  elementRef: React.RefObject<HTMLElement>,
  handlers: GestureHandlers,
  config: GestureConfig = {}
) {
  const { threshold = 10, timeout = 500, preventDefault = true, capture = false } = config;

  const [isGesturing, setIsGesturing] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);

  const gestureStateRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    initialDistance: 0,
    initialAngle: 0,
    longPressTimer: null as NodeJS.Timeout | null,
    isActive: false,
  });

  const createGestureEvent = useCallback(
    (type: GestureEvent['type'], additionalData: Partial<GestureEvent> = {}): GestureEvent => {
      const state = gestureStateRef.current;
      const duration = Date.now() - state.startTime;
      const distance = Math.sqrt(
        Math.pow(state.currentX - state.startX, 2) + Math.pow(state.currentY - state.startY, 2)
      );

      return {
        type,
        timestamp: Date.now(),
        touches: 1,
        duration,
        distance,
        velocity: (distance / duration) * 1000,
        ...additionalData,
      };
    },
    []
  );

  const getSwipeDirection = useCallback(
    (deltaX: number, deltaY: number): GestureEvent['direction'] => {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        return deltaX > 0 ? 'right' : 'left';
      } else {
        return deltaY > 0 ? 'down' : 'up';
      }
    },
    []
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (preventDefault) {
        event.preventDefault();
      }

      const touch = event.touches[0];
      const state = gestureStateRef.current;

      state.startX = touch.clientX;
      state.startY = touch.clientY;
      state.currentX = touch.clientX;
      state.currentY = touch.clientY;
      state.startTime = Date.now();
      state.isActive = true;

      // Set up long press timer
      if (handlers.onLongPress) {
        state.longPressTimer = setTimeout(() => {
          if (state.isActive) {
            const gestureEvent = createGestureEvent('longpress');
            handlers.onLongPress?.(gestureEvent);
            setIsGesturing(false);
            setCurrentGesture('longpress');
          }
        }, timeout);
      }

      setIsGesturing(true);
      setCurrentGesture(null);
    },
    [preventDefault, handlers.onLongPress, timeout, createGestureEvent]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!gestureStateRef.current.isActive) return;

      if (preventDefault) {
        event.preventDefault();
      }

      const touch = event.touches[0];
      const state = gestureStateRef.current;

      state.currentX = touch.clientX;
      state.currentY = touch.clientY;

      // Clear long press timer on move
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
        state.longPressTimer = null;
      }

      // Handle pinch gesture
      if (event.touches.length === 2 && handlers.onPinch) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (state.initialDistance === 0) {
          state.initialDistance = currentDistance;
        } else {
          const scale = currentDistance / state.initialDistance;
          const gestureEvent = createGestureEvent('pinch', { scale, touches: 2 });
          handlers.onPinch?.(gestureEvent);
          setCurrentGesture('pinch');
        }
      }

      // Handle rotate gesture
      if (event.touches.length === 2 && handlers.onRotate) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentAngle =
          (Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180) /
          Math.PI;

        if (state.initialAngle === 0) {
          state.initialAngle = currentAngle;
        } else {
          const rotation = currentAngle - state.initialAngle;
          const gestureEvent = createGestureEvent('rotate', { rotation, touches: 2 });
          handlers.onRotate?.(gestureEvent);
          setCurrentGesture('rotate');
        }
      }

      // Handle pan gesture
      if (handlers.onPan) {
        const deltaX = state.currentX - state.startX;
        const deltaY = state.currentY - state.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > threshold) {
          const direction = getSwipeDirection(deltaX, deltaY);
          const gestureEvent = createGestureEvent('pan', { direction, distance });
          handlers.onPan?.(gestureEvent);
          setCurrentGesture('pan');
        }
      }
    },
    [preventDefault, handlers, threshold, createGestureEvent, getSwipeDirection]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!gestureStateRef.current.isActive) return;

      if (preventDefault) {
        event.preventDefault();
      }

      const state = gestureStateRef.current;
      const deltaX = state.currentX - state.startX;
      const deltaY = state.currentY - state.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - state.startTime;

      // Clear long press timer
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
        state.longPressTimer = null;
      }

      // Handle swipe gesture
      if (handlers.onSwipe && distance > threshold) {
        const direction = getSwipeDirection(deltaX, deltaY);
        const velocity = (distance / duration) * 1000;
        const gestureEvent = createGestureEvent('swipe', { direction, distance, velocity });
        handlers.onSwipe?.(gestureEvent);
        setCurrentGesture('swipe');
      }
      // Handle tap gesture
      else if (handlers.onTap && distance < threshold && duration < timeout) {
        const now = Date.now();
        const timeSinceLastTap = now - state.lastTapTime;

        if (timeSinceLastTap < 300 && handlers.onDoubleTap) {
          // Double tap detected
          state.tapCount = 0;
          const gestureEvent = createGestureEvent('doubletap');
          handlers.onDoubleTap?.(gestureEvent);
          setCurrentGesture('doubletap');
        } else {
          // Single tap
          state.tapCount = 1;
          state.lastTapTime = now;

          setTimeout(() => {
            if (state.tapCount === 1) {
              const gestureEvent = createGestureEvent('tap');
              handlers.onTap?.(gestureEvent);
              setCurrentGesture('tap');
              state.tapCount = 0;
            }
          }, 300);
        }
      }

      // Reset state
      state.isActive = false;
      state.initialDistance = 0;
      state.initialAngle = 0;
      setIsGesturing(false);
    },
    [preventDefault, handlers, threshold, timeout, createGestureEvent, getSwipeDirection]
  );

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (preventDefault) {
        event.preventDefault();
      }

      const state = gestureStateRef.current;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.currentX = event.clientX;
      state.currentY = event.clientY;
      state.startTime = Date.now();
      state.isActive = true;

      setIsGesturing(true);
      setCurrentGesture(null);
    },
    [preventDefault]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!gestureStateRef.current.isActive) return;

      if (preventDefault) {
        event.preventDefault();
      }

      const state = gestureStateRef.current;
      state.currentX = event.clientX;
      state.currentY = event.clientY;

      // Handle pan gesture for mouse
      if (handlers.onPan) {
        const deltaX = state.currentX - state.startX;
        const deltaY = state.currentY - state.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > threshold) {
          const direction = getSwipeDirection(deltaX, deltaY);
          const gestureEvent = createGestureEvent('pan', { direction, distance });
          handlers.onPan?.(gestureEvent);
          setCurrentGesture('pan');
        }
      }
    },
    [preventDefault, handlers, threshold, createGestureEvent, getSwipeDirection]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (!gestureStateRef.current.isActive) return;

      if (preventDefault) {
        event.preventDefault();
      }

      const state = gestureStateRef.current;
      const deltaX = state.currentX - state.startX;
      const deltaY = state.currentY - state.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - state.startTime;

      // Handle swipe gesture for mouse
      if (handlers.onSwipe && distance > threshold) {
        const direction = getSwipeDirection(deltaX, deltaY);
        const velocity = (distance / duration) * 1000;
        const gestureEvent = createGestureEvent('swipe', { direction, distance, velocity });
        handlers.onSwipe?.(gestureEvent);
        setCurrentGesture('swipe');
      }
      // Handle tap gesture for mouse
      else if (handlers.onTap && distance < threshold && duration < timeout) {
        const gestureEvent = createGestureEvent('tap');
        handlers.onTap?.(gestureEvent);
        setCurrentGesture('tap');
      }

      state.isActive = false;
      setIsGesturing(false);
    },
    [preventDefault, handlers, threshold, timeout, createGestureEvent, getSwipeDirection]
  );

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { capture, passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { capture, passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { capture, passive: !preventDefault });

    // Mouse events for desktop
    element.addEventListener('mousedown', handleMouseDown, { capture });
    element.addEventListener('mousemove', handleMouseMove, { capture });
    element.addEventListener('mouseup', handleMouseUp, { capture });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);

      // Clear any pending timers
      const state = gestureStateRef.current;
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }
    };
  }, [
    elementRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    capture,
    preventDefault,
  ]);

  return {
    isGesturing,
    currentGesture,
    reset: () => {
      const state = gestureStateRef.current;
      state.isActive = false;
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }
      setIsGesturing(false);
      setCurrentGesture(null);
    },
  };
}

// Hook for swipe navigation
export function useSwipeNavigation(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  config?: GestureConfig
) {
  const elementRef = useRef<HTMLElement>(null);

  const handlers: GestureHandlers = {
    onSwipe: event => {
      switch (event.direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    },
  };

  const gesture = useGestureRecognition(elementRef, handlers, config);

  return { elementRef, ...gesture };
}

// Hook for pinch-to-zoom
export function usePinchZoom(onZoom?: (scale: number) => void, config?: GestureConfig) {
  const elementRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  const handlers: GestureHandlers = {
    onPinch: event => {
      if (event.scale) {
        setScale(event.scale);
        onZoom?.(event.scale);
      }
    },
  };

  const gesture = useGestureRecognition(elementRef, handlers, config);

  return { elementRef, scale, ...gesture };
}

// Hook for rotation gestures
export function useRotation(onRotate?: (rotation: number) => void, config?: GestureConfig) {
  const elementRef = useRef<HTMLElement>(null);
  const [rotation, setRotation] = useState(0);

  const handlers: GestureHandlers = {
    onRotate: event => {
      if (event.rotation !== undefined) {
        setRotation(event.rotation);
        onRotate?.(event.rotation);
      }
    },
  };

  const gesture = useGestureRecognition(elementRef, handlers, config);

  return { elementRef, rotation, ...gesture };
}
