import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

export const DanielaOrb = ({ size = 1, color = "#00F0FF", speed = 1, distort = 0.4 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader adjustment via useFrame
  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2 * speed;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3 * speed;

      // Dynamic scaling for "breathing" effect
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed * 2}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.5}
        />
        {/* Inner Glow Layer */}
        <Sphere args={[size * 0.8, 32, 32]}>
          <meshBasicMaterial color="#BD00FF" transparent opacity={0.3} />
        </Sphere>
      </Sphere>

      {/* HUD Orbitals */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 1.5, 0.005, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[size * 1.3, 0.003, 16, 100]} />
        <meshBasicMaterial color="#BD00FF" transparent opacity={0.1} />
      </mesh>
    </Float>
  );
};
