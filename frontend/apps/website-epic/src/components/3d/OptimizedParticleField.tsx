import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThreeDispose } from '../../hooks/useThreeDispose';
import { useAnimationWorker } from '../../hooks/useWebWorkerEnhanced';

interface OptimizedParticleFieldProps {
  count?: number;
  radius?: number;
  color?: THREE.Color;
  speed?: number;
  useWorker?: boolean;
}

/**
 * Componente de partículas optimizado con Web Workers y dispose automático
 */
export const OptimizedParticleField: React.FC<OptimizedParticleFieldProps> = ({
  count = 1000,
  radius = 5,
  color = new THREE.Color(0x00ffff),
  speed = 1,
  useWorker: enableWorker = true,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { addGeometry, addMaterial } = useThreeDispose();

  // Web Worker para cálculos complejos
  const { isReady: workerReady, calculateParticles } = useAnimationWorker();
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      opacity: number;
    }>
  >([]);

  // Crear geometría y materiales optimizados
  const { geometry, material, positions, colors } = useMemo(() => {
    // Geometría instanced para rendimiento
    const geometry = new THREE.SphereGeometry(0.05, 6, 4);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
    });

    // Arrays para instanced mesh
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Inicializar posiciones y colores
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const particleColor = new THREE.Color().setHSL(
        (i / count) * 0.1 + 0.5, // Hue variation
        0.8, // Saturation
        0.6 // Lightness
      );

      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }

    // Registrar para dispose
    addGeometry(geometry);
    addMaterial(material);

    return { geometry, material, positions, colors };
  }, [count, radius, color, addGeometry, addMaterial]);

  // Calcular partículas con Web Worker si está disponible
  useEffect(() => {
    if (enableWorker && workerReady) {
      const config = {
        count,
        bounds: { width: radius * 2, height: radius * 2 },
        time: 0,
        settings: {
          speed,
          spread: radius,
          gravity: 0.1,
          wind: 0.05,
        },
      };

      calculateParticles(config).then(setParticles).catch(console.error);
    }
  }, [enableWorker, workerReady, count, radius, speed, calculateParticles]);

  // Animation loop optimizado
  useFrame(state => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (enableWorker && particles[i]) {
        // Usar datos del Web Worker
        dummy.position.set(particles[i].x, particles[i].y, particles[i].z);
        dummy.scale.setScalar(particles[i].size);
      } else {
        // Fallback: cálculo local simplificado
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Movimiento orbital simple
        const angle = time * speed * 0.1 + i * 0.01;
        const radius = Math.sqrt(x * x + y * y + z * z);

        dummy.position.set(
          x * Math.cos(angle) - z * Math.sin(angle),
          y + Math.sin(time * speed + i) * 0.1,
          x * Math.sin(angle) + z * Math.cos(angle)
        );

        dummy.scale.setScalar(0.5 + Math.sin(time * speed + i) * 0.3);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />;
};

/**
 * Campo de partículas con física avanzada
 */
export const PhysicsParticleField: React.FC<{
  count?: number;
  useGravity?: boolean;
  collision?: boolean;
}> = ({ count = 500, useGravity = true, collision = false }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { addGeometry, addMaterial } = useThreeDispose();
  const { calculatePhysics } = useAnimationWorker();

  const [physicsObjects, setPhysicsObjects] = useState<
    Array<{
      id: string;
      position: { x: number; y: number; z: number };
      velocity: { x: number; y: number; z: number };
      mass: number;
    }>
  >([]);

  // Inicializar objetos de física
  useEffect(() => {
    const objects = Array.from({ length: count }, (_, i) => ({
      id: `particle-${i}`,
      position: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 5,
        z: (Math.random() - 0.5) * 10,
      },
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.2,
        z: (Math.random() - 0.5) * 0.1,
      },
      mass: 0.1 + Math.random() * 0.2,
    }));

    setPhysicsObjects(objects);
  }, [count]);

  // Simulación de física con Web Worker
  useEffect(() => {
    if (!calculatePhysics) return;

    const forces = [
      {
        type: 'gravity' as const,
        strength: useGravity ? 9.81 : 0,
        direction: { x: 0, y: -1, z: 0 },
      },
      {
        type: 'wind' as const,
        strength: 0.5,
        direction: { x: 1, y: 0, z: 0.5 },
      },
    ];

    const interval = setInterval(() => {
      calculatePhysics({
        objects: physicsObjects,
        deltaTime: 0.016, // 60 FPS
        forces,
      })
        .then(setPhysicsObjects)
        .catch(console.error);
    }, 16);

    return () => clearInterval(interval);
  }, [calculatePhysics, physicsObjects, useGravity]);

  // Geometría y materiales
  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.02, 4, 3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.9,
    });

    addGeometry(geometry);
    addMaterial(material);

    return { geometry, material };
  }, [addGeometry, addMaterial]);

  // Actualizar posiciones basadas en física
  useFrame(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    physicsObjects.forEach((obj, i) => {
      dummy.position.set(obj.position.x, obj.position.y, obj.position.z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />;
};
