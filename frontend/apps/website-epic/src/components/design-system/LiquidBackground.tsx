import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const LiquidBlob = ({ pulse }: { pulse: 'nominal' | 'warning' | 'critical' }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Speed and distortion factor based on system pulse
  const speed = pulse === 'critical' ? 5 : pulse === 'warning' ? 3 : 1.5;
  const factor = pulse === 'critical' ? 0.8 : pulse === 'warning' ? 0.5 : 0.3;
  const color = pulse === 'critical' ? '#EF4444' : pulse === 'warning' ? '#F59E0B' : '#06B6D4';

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2);
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={factor}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
        />
      </Sphere>
    </Float>
  );
};

export const LiquidBackground: React.FC<{
  pulse: 'nominal' | 'warning' | 'critical';
  className?: string;
}> = ({ pulse, className }) => {
  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${className}`}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <spotLight
          position={[-10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          color={pulse === 'critical' ? '#ff0000' : '#00ffff'}
        />
        <LiquidBlob pulse={pulse} />
      </Canvas>

      {/* Liquid Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/60 mix-blend-multiply" />
    </div>
  );
};
