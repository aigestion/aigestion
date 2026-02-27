import {
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sphere,
  Stars,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useThreeDispose } from '../../hooks/useThreeDispose';

const ServerCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { addMaterial } = useThreeDispose();

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <Sphere
          ref={meshRef}
          args={[1, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <MeshDistortMaterial
            color={hovered ? '#BD00FF' : '#00f5ff'}
            attach="material"
            distort={0.6}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            emissive={hovered ? '#BD00FF' : '#00f0ff'}
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Glowing Neural Cage */}
        <Sphere args={[1.05, 32, 32]}>
          <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.1} />
        </Sphere>

        {/* Outer Pulse Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#BD00FF" transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

export const NeuralServer: React.FC = React.memo(() => {
  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Environment preset="sunset" />

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
});

NeuralServer.displayName = 'NeuralServer';
