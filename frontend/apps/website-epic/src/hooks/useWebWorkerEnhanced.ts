import { useEffect, useRef, useState, useCallback } from 'react';

interface WebWorkerMessage {
  type: string;
  data: any;
  id?: string;
}

interface WebWorkerResponse {
  type: string;
  data: any;
  id?: string;
}

/**
 * Hook para gestionar Web Workers para cálculos complejos
 * Offload heavy computations from main thread
 */
export function useWebWorker<T = any>(
  workerScript: string | URL,
  options: {
    onMessage?: (data: T) => void;
    onError?: (error: Error) => void;
    autoTerminate?: boolean;
  } = {}
) {
  const { onMessage, onError, autoTerminate = true } = options;
  
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const messageQueueRef = useRef<Map<string, (data: any) => void>>(new Map());
  const messageIdRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(workerScript);
      
      workerRef.current.onmessage = (event: MessageEvent<WebWorkerResponse>) => {
        const { type, data, id } = event.data;
        
        if (type === 'result' && id) {
          const resolver = messageQueueRef.current.get(id);
          if (resolver) {
            resolver(data);
            messageQueueRef.current.delete(id);
          }
        } else if (type === 'error' && id) {
          const resolver = messageQueueRef.current.get(id);
          if (resolver) {
            const error = new Error(data.message || 'Worker error');
            resolver({ error });
            messageQueueRef.current.delete(id);
          }
        } else if (onMessage && !id) {
          // Handle unsolicited messages
          onMessage(data as T);
        }
      };
      
      workerRef.current.onerror = (event) => {
        const error = new Error(`Worker error: ${event.message}`);
        setError(error);
        onError?.(error);
      };
      
      setIsReady(true);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize worker');
      setError(error);
      onError?.(error);
    }

    // Cleanup
    return () => {
      if (workerRef.current && autoTerminate) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [workerScript, onMessage, onError, autoTerminate]);

  // Send message to worker
  const postMessage = useCallback(<R = any>(type: string, data: any): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isReady) {
        reject(new Error('Worker not ready'));
        return;
      }

      const id = `msg-${messageIdRef.current++}`;
      const message: WebWorkerMessage = { type, data, id };

      messageQueueRef.current.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message || 'Worker operation failed'));
        } else {
          resolve(response);
        }
      });

      workerRef.current!.postMessage(message);
      setIsProcessing(true);
    });
  }, [isReady]);

  // Terminate worker manually
  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    isReady,
    isProcessing,
    error,
    postMessage,
    terminate,
  };
}

/**
 * Hook específico para animaciones con Web Worker
 */
export function useAnimationWorker() {
  const { isReady, postMessage, error } = useWebWorker('/src/workers/animation.worker.js', {
    onError: (err) => console.error('Animation worker error:', err),
  });

  const calculateParticles = useCallback(async (config: any) => {
    return postMessage('calculate_particles', config);
  }, [postMessage]);

  const calculatePhysics = useCallback(async (config: any) => {
    return postMessage('calculate_physics', config);
  }, [postMessage]);

  const calculateInterpolation = useCallback(async (config: any) => {
    return postMessage('calculate_interpolation', config);
  }, [postMessage]);

  const calculateFourier = useCallback(async (config: any) => {
    return postMessage('math_fourier', config);
  }, [postMessage]);

  const calculateFractal = useCallback(async (config: any) => {
    return postMessage('math_fractal', config);
  }, [postMessage]);

  const calculateNoise = useCallback(async (config: any) => {
    return postMessage('math_noise', config);
  }, [postMessage]);

  return {
    isReady,
    error,
    calculateParticles,
    calculatePhysics,
    calculateInterpolation,
    calculateFourier,
    calculateFractal,
    calculateNoise,
  };
}

/**
 * Hook para procesamiento de datos con Web Worker
 */
export function useDataWorker() {
  const { isReady, postMessage, error } = useWebWorker('/src/workers/data.worker.js', {
    onError: (err) => console.error('Data worker error:', err),
  });

  const processData = useCallback(async (data: any[], operation: string) => {
    return postMessage('process_data', { data, operation });
  }, [postMessage]);

  const filterData = useCallback(async (data: any[], filters: any) => {
    return postMessage('filter_data', { data, filters });
  }, [postMessage]);

  const aggregateData = useCallback(async (data: any[], groupBy: string, aggregations: any) => {
    return postMessage('aggregate_data', { data, groupBy, aggregations });
  }, [postMessage]);

  return {
    isReady,
    error,
    processData,
    filterData,
    aggregateData,
  };
}

/**
 * Hook para Web Workers con timeout y cancelación
 */
export function useWebWorkerWithTimeout<T = any>(
  workerScript: string | URL,
  timeout: number = 5000
) {
  const { isReady, postMessage, terminate } = useWebWorker<T>(workerScript);
  const [timedOut, setTimedOut] = useState(false);

  const postMessageWithTimeout = useCallback(<R = any>(type: string, data: any): Promise<R> => {
    setTimedOut(false);
    
    return Promise.race([
      postMessage<R>(type, data),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          setTimedOut(true);
          reject(new Error(`Worker operation timed out after ${timeout}ms`));
        }, timeout);
      })
    ]);
  }, [postMessage, timeout]);

  return {
    isReady,
    timedOut,
    postMessage: postMessageWithTimeout,
    terminate,
  };
}

/**
 * Hook para pool de Web Workers
 */
export function useWorkerPool(workerScript: string | URL, poolSize: number = 4) {
  const workersRef = useRef<Worker[]>([]);
  const availableWorkersRef = useRef<number[]>([]);
  const busyWorkersRef = useRef<Set<number>>(new Set());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize worker pool
    const workers: Worker[] = [];
    const available: number[] = [];

    for (let i = 0; i < poolSize; i++) {
      try {
        const worker = new Worker(workerScript);
        workers.push(worker);
        available.push(i);
      } catch (error) {
        console.error(`Failed to initialize worker ${i}:`, error);
      }
    }

    workersRef.current = workers;
    availableWorkersRef.current = available;
    setIsReady(true);

    return () => {
      // Terminate all workers
      workers.forEach(worker => worker.terminate());
    };
  }, [workerScript, poolSize]);

  const getAvailableWorker = useCallback(() => {
    const available = availableWorkersRef.current;
    if (available.length === 0) return null;

    const workerId = available.shift()!;
    busyWorkersRef.current.add(workerId);
    return workerId;
  }, []);

  const releaseWorker = useCallback((workerId: number) => {
    busyWorkersRef.current.delete(workerId);
    availableWorkersRef.current.push(workerId);
  }, []);

  const postMessage = useCallback(<R = any>(type: string, data: any): Promise<R> => {
    return new Promise((resolve, reject) => {
      const workerId = getAvailableWorker();
      if (workerId === null) {
        reject(new Error('No available workers in pool'));
        return;
      }

      const worker = workersRef.current[workerId];
      const messageId = `pool-${Date.now()}-${Math.random()}`;

      const handleMessage = (event: MessageEvent) => {
        if (event.data.id === messageId) {
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
          releaseWorker(workerId);

          if (event.data.type === 'error') {
            reject(new Error(event.data.data.message));
          } else {
            resolve(event.data.data);
          }
        }
      };

      const handleError = (error: ErrorEvent) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        releaseWorker(workerId);
        reject(new Error(error.message));
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);
      worker.postMessage({ type, data, id: messageId });
    });
  }, [getAvailableWorker, releaseWorker]);

  return {
    isReady,
    poolSize: workersRef.current.length,
    busyWorkers: busyWorkersRef.current.size,
    postMessage,
  };
}
