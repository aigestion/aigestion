import { useEffect, useRef, useState } from 'react';

/**
 * 🌌 useDataProcessor Hook (Nivel Dios)
 * Hook specialized in background data processing using Web Workers.
 */
export const useDataProcessor = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(
      new URL('../workers/data-processor.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { type, data, error } = event.data;
      setIsProcessing(false);

      if (type === 'ERROR') {
        setError(error);
      } else {
        setLastResult(data);
        setError(null);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processData = (type: string, data: any, options?: any) => {
    if (!workerRef.current) return;
    setIsProcessing(true);
    workerRef.current.postMessage({ type, data, options });
  };

  return { processData, isProcessing, lastResult, error };
};
