import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import { useWebWorkerEnhanced } from '../../hooks/useWebWorkerEnhanced';
import { ErrorBoundaryEnhanced } from '../ErrorBoundaryEnhanced';
import { SkeletonLoader } from '../ui/SkeletonLoader';

/**
 * Componente de prueba para Web Workers con cálculos intensivos
 */
const WorkerTestComponent = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Web Worker para cálculos complejos
  const { 
    isReady: workerReady, 
    calculateParticles, 
    calculatePhysics,
    processData,
    calculateFourier 
  } = useWebWorkerEnhanced();

  const testParticleCalculation = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const config = {
        count: 10000,
        bounds: { width: 100, height: 100 },
        time: Date.now(),
        settings: {
          speed: 2.0,
          spread: 50,
          gravity: 0.1,
          wind: 0.05,
        },
      };

      const startTime = performance.now();
      const result = await calculateParticles(config);
      const endTime = performance.now();

      setResults(prev => [...prev, {
        test: 'Particles',
        count: config.count,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(`Particle calculation failed: ${err}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const testPhysicsCalculation = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const objects = Array.from({ length: 1000 }, (_, i) => ({
        id: `obj-${i}`,
        position: {
          x: (Math.random() - 0.5) * 50,
          y: Math.random() * 25,
          z: (Math.random() - 0.5) * 50,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: Math.random() * 4,
          z: (Math.random() - 0.5) * 2,
        },
        mass: 0.1 + Math.random() * 2,
      }));

      const forces = [
        {
          type: 'gravity' as const,
          strength: 9.81,
          direction: { x: 0, y: -1, z: 0 },
        },
        {
          type: 'wind' as const,
          strength: 2.0,
          direction: { x: 1, y: 0, z: 0.5 },
        },
      ];

      const startTime = performance.now();
      const result = await calculatePhysics({
        objects,
        deltaTime: 0.016,
        forces,
      });
      const endTime = performance.now();

      setResults(prev => [...prev, {
        test: 'Physics',
        count: objects.length,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(`Physics calculation failed: ${err}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const testDataProcessing = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // Generar dataset grande
      const dataset = Array.from({ length: 50000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        category: `cat-${i % 10}`,
        timestamp: Date.now() + i * 1000,
      }));

      const startTime = performance.now();
      const result = await processData(dataset, {
        operations: ['filter', 'sort', 'aggregate'],
        filters: { category: 'cat-5' },
        sortBy: 'value',
        aggregations: ['sum', 'avg', 'min', 'max'],
      });
      const endTime = performance.now();

      setResults(prev => [...prev, {
        test: 'Data Processing',
        count: dataset.length,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(`Data processing failed: ${err}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const testFourierTransform = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // Generar señal compleja
      const signal = Array.from({ length: 2048 }, (_, i) => 
        Math.sin(2 * Math.PI * i / 100) + 
        0.5 * Math.sin(2 * Math.PI * i / 50) + 
        0.25 * Math.sin(2 * Math.PI * i / 25)
      );

      const startTime = performance.now();
      const result = await calculateFourier(signal);
      const endTime = performance.now();

      setResults(prev => [...prev, {
        test: 'Fourier Transform',
        count: signal.length,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(`Fourier transform failed: ${err}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg max-w-md">
      <h3 className="text-lg font-bold mb-4">Web Worker Tests</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testParticleCalculation}
          disabled={!workerReady || isCalculating}
          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 rounded text-sm"
        >
          {isCalculating ? 'Calculating...' : 'Test Particles (10k)'}
        </button>
        
        <button
          onClick={testPhysicsCalculation}
          disabled={!workerReady || isCalculating}
          className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded text-sm"
        >
          {isCalculating ? 'Calculating...' : 'Test Physics (1k objects)'}
        </button>
        
        <button
          onClick={testDataProcessing}
          disabled={!workerReady || isCalculating}
          className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 rounded text-sm"
        >
          {isCalculating ? 'Calculating...' : 'Test Data Processing (50k)'}
        </button>
        
        <button
          onClick={testFourierTransform}
          disabled={!workerReady || isCalculating}
          className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 rounded text-sm"
        >
          {isCalculating ? 'Calculating...' : 'Test Fourier Transform (2k)'}
        </button>
        
        <button
          onClick={clearResults}
          className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-sm"
        >
          Clear Results
        </button>
      </div>

      <div className="mb-2 text-sm">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
          workerReady ? 'bg-green-500' : 'bg-red-500'
        }`} />
        Worker: {workerReady ? 'Ready' : 'Not Ready'}
      </div>

      {error && (
        <div className="mb-2 p-2 bg-red-500/20 border border-red-500 rounded text-sm">
          Error: {error}
        </div>
      )}

      <div className="max-h-40 overflow-y-auto text-xs">
        {results.map((result, i) => (
          <div key={i} className="mb-1 p-1 bg-white/10 rounded">
            <div className="font-semibold">{result.test}</div>
            <div>Count: {result.count}</div>
            <div>Duration: {result.duration.toFixed(2)}ms</div>
            <div className="text-gray-400">{result.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Escena 3D simple para pruebas de Web Workers
 */
const TestScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Geometría simple para pruebas */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <mesh position={[3, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      
      <mesh position={[-3, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="magenta" />
      </mesh>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stats />
    </>
  );
};

/**
 * Componente principal de prueba de Web Workers
 */
export const WebWorkerTestScene = () => {
  return (
    <ErrorBoundaryEnhanced
      onError={(error, errorInfo) => {
        console.error('Web Worker Test Scene Error:', error, errorInfo);
      }}
    >
      <div className="w-full h-screen relative">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <TestScene />
          </Suspense>
        </Canvas>
        
        <WorkerTestComponent />
      </div>
    </ErrorBoundaryEnhanced>
  );
};

export default WebWorkerTestScene;
