import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  InstancedMesh, 
  DynamicDrawUsage, 
  StaticDrawUsage,
  Sphere, 
  Box, 
  Plane 
} from '@react-three/drei';
import * as THREE from 'three';

// LOD Manager for level of detail optimization
interface LODLevel {
  readonly distance: number;
  readonly object: THREE.Object3D;
}

function useLOD(levels: LODLevel[], camera: THREE.Camera) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const objectRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (!objectRef.current) return;

    const distance = camera.position.distanceTo(objectRef.current.position);
    let levelIndex = 0;

    for (let i = 0; i < levels.length; i++) {
      if (distance <= levels[i].distance) {
        levelIndex = i;
        break;
      }
    }

    if (levelIndex !== currentLevel) {
      setCurrentLevel(levelIndex);
    }
  });

  return { currentLevel, objectRef };
}

// Instanced geometry for performance
function InstancedObjects({ 
  count, 
  positions, 
  colors 
}: {
  readonly count: number;
  readonly positions: Float32Array;
  readonly colors: Float32Array;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled
    >
      <sphereGeometry args={[0.1, 8, 6]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
}

// Frustum culling component
function FrustumCulledObject({ 
  children, 
  position 
}: { 
  readonly children: React.ReactNode;
  readonly position: [number, number, number];
}) {
  const { camera } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  const objectRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!objectRef.current || !camera) return;

    // Simple frustum culling check
    const distance = camera.position.distanceTo(new THREE.Vector3(...position));
    const maxDistance = 50; // Adjust based on your scene
    setIsVisible(distance <= maxDistance);
  });

  if (!isVisible) return null;

  return (
    <group ref={objectRef} position={position}>
      {children}
    </group>
  );
}

// Optimized particle system
function OptimizedParticles({ count = 1000 }: { readonly count?: number }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    return { positions, colors };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  );
}

// Main optimized scene component
interface OptimizedThreeSceneProps {
  readonly enableLOD?: boolean;
  readonly enableInstancing?: boolean;
  readonly enableFrustumCulling?: boolean;
  readonly particleCount?: number;
  readonly onPerformanceUpdate?: (stats: PerformanceStats) => void;
}

interface PerformanceStats {
  readonly fps: number;
  readonly drawCalls: number;
  readonly triangles: number;
  readonly memory: number;
}

export function OptimizedThreeScene({
  enableLOD = true,
  enableInstancing = true,
  enableFrustumCulling = true,
  particleCount = 1000,
  onPerformanceUpdate,
}: OptimizedThreeSceneProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    memory: 0,
  });

  const sceneRef = useRef<THREE.Scene>();

  // Performance monitoring
  useFrame((state) => {
    if (onPerformanceUpdate) {
      const renderer = state.gl;
      const memory = (renderer as any).info.memory;
      
      const newStats: PerformanceStats = {
        fps: Math.round(1000 / state.clock.getDelta()),
        drawCalls: (renderer as any).info.render.calls,
        triangles: (renderer as any).info.render.triangles,
        memory: memory ? memory.geometries : 0,
      };

      setStats(newStats);
      onPerformanceUpdate(newStats);
    }
  });

  // Generate instance data
  const instanceData = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    return { positions, colors };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        dpr={[1, 2]} // Dynamic pixel ratio for performance
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Optimized particles */}
        <OptimizedParticles count={particleCount} />

        {/* Instanced objects for better performance */}
        {enableInstancing && (
          <InstancedObjects
            count={500}
            positions={instanceData.positions}
            colors={instanceData.colors}
          />
        )}

        {/* Frustum culled objects */}
        {enableFrustumCulling && (
          <>
            <FrustumCulledObject position={[5, 0, 0]}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="orange" />
              </Box>
            </FrustumCulledObject>
            
            <FrustumCulledObject position={[-5, 0, 0]}>
              <Sphere args={[0.5, 16, 16]}>
                <meshStandardMaterial color="blue" />
              </Sphere>
            </FrustumCulledObject>
          </>
        )}

        {/* LOD objects */}
        {enableLOD && (
          <FrustumCulledObject position={[0, 5, 0]}>
            <Box args={[2, 2, 2]}>
              <meshStandardMaterial color="green" />
            </Box>
          </FrustumCulledObject>
        )}

        {/* Ground plane with optimization */}
        <Plane 
          args={[100, 100]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -5, 0]}
        >
          <meshBasicMaterial color="#1a1a1a" />
        </Plane>
      </Canvas>

      {/* Performance stats overlay */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs font-mono">
        <div>FPS: {stats.fps}</div>
        <div>Draw Calls: {stats.drawCalls}</div>
        <div>Triangles: {stats.triangles}</div>
        <div>Memory: {stats.memory}MB</div>
      </div>
    </div>
  );
}

// Hook for Three.js performance optimization
export function useThreeOptimization() {
  const { gl, scene, camera } = useThree();

  const optimizeScene = useCallback(() => {
    // Enable frustum culling
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.frustumCulled = true;
      }
    });

    // Optimize material settings
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        const material = object.material as THREE.Material;
        material.transparent = false; // Disable transparency if not needed
        material.depthWrite = true;
        material.depthTest = true;
      }
    });

    // Optimize geometry
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry) {
        object.geometry.computeBoundingSphere();
        object.geometry.computeBoundingBox();
      }
    });
  }, [scene]);

  const enableShadowOptimizations = useCallback(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Optimize shadow camera
    scene.traverse((object) => {
      if (object instanceof THREE.Light && object.castShadow) {
        if (object instanceof THREE.DirectionalLight) {
          object.shadow.camera.near = 0.1;
          object.shadow.camera.far = 50;
          object.shadow.camera.left = -10;
          object.shadow.camera.right = 10;
          object.shadow.camera.top = 10;
          object.shadow.camera.bottom = -10;
          object.shadow.mapSize.width = 1024;
          object.shadow.mapSize.height = 1024;
        }
      }
    });
  }, [scene, gl]);

  return {
    optimizeScene,
    enableShadowOptimizations,
  };
}
