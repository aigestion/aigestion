import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Stars,
  Float,
  Environment,
} from '@react-three/drei';
import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

const ServerCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <MeshDistortMaterial
          color={hovered ? '#8a2be2' : '#00f5ff'}
          attach="material"
          distort={0.6}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

export const NeuralServer: React.FC = () => {
  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Environment preset="city" />

        <ServerCore />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* UI Overlay for the 3D element */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[10px] font-mono text-nexus-cyan animate-pulse">
          INTERACTIVE_CORE // DRAG_TO_ROTATE
        </p>
      </div>
    </div>
  );
};
