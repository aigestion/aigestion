
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useEcosystem } from '../providers/EcosystemProvider';

const NeuralNetwork = () => {
  const { profile } = useEcosystem();
  const count = 100;
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        temp[i * 3] = (Math.random() - 0.5) * 10;
        temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
        temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={profile.primaryColor}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const QuantumCanvas: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <NeuralNetwork />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[2, 1, -2]}>
                        <sphereGeometry args={[0.5, 32, 32]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} wireframe />
                    </mesh>
                </Float>
            </Canvas>
        </div>
    );
};

export default QuantumCanvas;
