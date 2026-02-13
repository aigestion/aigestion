import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseWebWorkerOptions {
  readonly workerUrl: string;
  readonly timeout?: number;
  readonly onError?: (error: Error) => void;
  readonly onSuccess?: (result: any) => void;
}

export interface WorkerTask<T = any> {
  readonly id: string;
  readonly type: string;
  readonly data: T;
  readonly priority?: 'low' | 'medium' | 'high';
}

export interface WorkerResult<T = any> {
  readonly id: string;
  readonly result: T;
  readonly error?: string;
  readonly executionTime: number;
}

export function useWebWorker<T = any>(options: UseWebWorkerOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingTasksRef = useRef<
    Map<
      string,
      {
        resolve: (value: WorkerResult<T>) => void;
        reject: (error: Error) => void;
        timeout?: NodeJS.Timeout;
      }
    >
  >(new Map());

  // Initialize worker
  useEffect(() => {
    try {
      const worker = new Worker(options.workerUrl, { type: 'module' });
      workerRef.current = worker;

      worker.addEventListener('message', handleWorkerMessage);
      worker.addEventListener('error', handleWorkerError);

      setIsReady(true);
      setError(null);

      return () => {
        worker.removeEventListener('message', handleWorkerMessage);
        worker.removeEventListener('error', handleWorkerError);
        worker.terminate();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize worker');
      setError(error);
      options.onError?.(error);
    }
  }, [options.workerUrl]);

  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerResult<T>>) => {
      const result = event.data;
      const pending = pendingTasksRef.current.get(result.id);

      if (pending) {
        pendingTasksRef.current.delete(result.id);

        if (pending.timeout) {
          clearTimeout(pending.timeout);
        }

        if (result.error) {
          const error = new Error(result.error);
          pending.reject(error);
          setError(error);
          options.onError?.(error);
        } else {
          pending.resolve(result);
          options.onSuccess?.(result.result);
          setError(null);
        }
      }
    },
    [options.onError, options.onSuccess]
  );

  const handleWorkerError = useCallback(
    (event: ErrorEvent) => {
      const error = new Error(event.message);
      setError(error);
      options.onError?.(error);

      // Reject all pending tasks
      pendingTasksRef.current.forEach(pending => {
        if (pending.timeout) {
          clearTimeout(pending.timeout);
        }
        pending.reject(error);
      });
      pendingTasksRef.current.clear();
    },
    [options.onError]
  );

  const executeTask = useCallback(
    async (task: WorkerTask<T>): Promise<WorkerResult<T>> => {
      if (!workerRef.current || !isReady) {
        throw new Error('Worker is not ready');
      }

      setIsLoading(true);
      setError(null);

      return new Promise<WorkerResult<T>>((resolve, reject) => {
        // Set up timeout if specified
        let timeout: NodeJS.Timeout | undefined;
        if (options.timeout) {
          timeout = setTimeout(() => {
            pendingTasksRef.current.delete(task.id);
            reject(new Error(`Worker task timed out after ${options.timeout}ms`));
          }, options.timeout);
        }

        // Store pending task
        pendingTasksRef.current.set(task.id, { resolve, reject, timeout });

        // Send task to worker
        workerRef.current!.postMessage(task);
      });
    },
    [isReady, options.timeout]
  );

  const executeTaskWithRetry = useCallback(
    async (task: WorkerTask<T>, maxRetries: number = 3): Promise<WorkerResult<T>> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await executeTask(task);
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');

          if (attempt < maxRetries) {
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      throw lastError;
    },
    [executeTask]
  );

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsReady(false);
    }
  }, []);

  const clearPendingTasks = useCallback(() => {
    pendingTasksRef.current.forEach(pending => {
      if (pending.timeout) {
        clearTimeout(pending.timeout);
      }
      pending.reject(new Error('Task cancelled'));
    });
    pendingTasksRef.current.clear();
  }, []);

  return {
    isReady,
    isLoading,
    error,
    executeTask,
    executeTaskWithRetry,
    terminate,
    clearPendingTasks,
  };
}

// Hook for specific worker types
export function useAnalyticsWorker() {
  return useWebWorker({
    workerUrl: '/workers/performance.worker.js',
    timeout: 30000,
  });
}

export function useRenderingWorker() {
  return useWebWorker({
    workerUrl: '/workers/performance.worker.js',
    timeout: 60000,
  });
}

export function useDataProcessingWorker() {
  return useWebWorker({
    workerUrl: '/workers/performance.worker.js',
    timeout: 45000,
  });
}

// Hook for managing multiple concurrent tasks
export function useWorkerPool<T = any>(options: {
  readonly workerUrl: string;
  readonly poolSize?: number;
  readonly taskTimeout?: number;
}) {
  const { workerUrl, poolSize = 4, taskTimeout = 30000 } = options;
  const workers = useRef<Array<Worker | null>>([]);
  const availableWorkers = useRef<number[]>([]);
  const taskQueue = useRef<
    Array<{
      task: WorkerTask<T>;
      resolve: (result: WorkerResult<T>) => void;
      reject: (error: Error) => void;
    }>
  >([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize worker pool
  useEffect(() => {
    const initWorkers = async () => {
      for (let i = 0; i < poolSize; i++) {
        try {
          const worker = new Worker(workerUrl, { type: 'module' });
          workers.current[i] = worker;
          availableWorkers.current.push(i);

          worker.addEventListener('message', (event: MessageEvent<WorkerResult<T>>) => {
            const result = event.data;
            const taskIndex = taskQueue.current.findIndex(t => t.task.id === result.id);

            if (taskIndex !== -1) {
              const task = taskQueue.current[taskIndex];
              taskQueue.current.splice(taskIndex, 1);
              availableWorkers.current.push(i);

              if (result.error) {
                task.reject(new Error(result.error));
              } else {
                task.resolve(result);
              }
            }
          });
        } catch (error) {
          console.error(`Failed to initialize worker ${i}:`, error);
        }
      }

      setIsReady(true);
    };

    initWorkers();

    return () => {
      workers.current.forEach(worker => worker?.terminate());
    };
  }, [workerUrl, poolSize]);

  const executeTask = useCallback(async (task: WorkerTask<T>): Promise<WorkerResult<T>> => {
    return new Promise<WorkerResult<T>>((resolve, reject) => {
      taskQueue.current.push({ task, resolve, reject });
      processQueue();
    });
  }, []);

  const processQueue = useCallback(() => {
    while (availableWorkers.current.length > 0 && taskQueue.current.length > 0) {
      const workerIndex = availableWorkers.current.pop()!;
      const task = taskQueue.current.shift()!;
      const worker = workers.current[workerIndex];

      if (worker) {
        worker.postMessage(task.task);

        // Set timeout
        setTimeout(() => {
          task.reject(new Error('Task timed out'));
          availableWorkers.current.push(workerIndex);
        }, taskTimeout);
      }
    }
  }, [taskTimeout]);

  return {
    isReady,
    executeTask,
    activeWorkers: poolSize - availableWorkers.current.length,
    queuedTasks: taskQueue.current.length,
  };
}
