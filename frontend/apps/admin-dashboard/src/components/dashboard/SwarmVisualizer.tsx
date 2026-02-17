import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const AgentNode = ({ position, label, color, active }: { position: [number, number, number], label: string, color: string, active: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;

      // Pulse effect if active
      if (active) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
            color={active ? '#22c55e' : color}
            emissive={active ? '#22c55e' : color}
            emissiveIntensity={active ? 2 : 0.5}
            wireframe
        />
      </mesh>
       <mesh>
        <dodecahedronGeometry args={[0.78, 0]} />
         <meshStandardMaterial color="black" transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

// Connection lines between nodes
const Connection = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial color="#475569" transparent opacity={0.3} />
        </line>
    );
};

const SwarmScene = () => {
    // Agent Positions
    const overlordPos: [number, number, number] = [0, 1.5, 0];
    const architectPos: [number, number, number] = [-2.5, -1, 0];
    const builderPos: [number, number, number] = [-1, -1, 1.5];
    const criticPos: [number, number, number] = [1, -1, 1.5];
    const mechanicPos: [number, number, number] = [2.5, -1, 0];

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Central Node */}
            <AgentNode position={overlordPos} label="OVERLORD" color="#8b5cf6" active={true} />

            {/* Sub-Agents */}
            <AgentNode position={architectPos} label="ARCHITECT" color="#3b82f6" active={false} />
            <AgentNode position={builderPos} label="BUILDER" color="#eab308" active={false} />
            <AgentNode position={criticPos} label="CRITIC" color="#ef4444" active={false} />
            <AgentNode position={mechanicPos} label="MECHANIC" color="#10b981" active={false} />

            {/* Connections */}
            <Connection start={overlordPos} end={architectPos} />
            <Connection start={overlordPos} end={builderPos} />
            <Connection start={overlordPos} end={criticPos} />
            <Connection start={overlordPos} end={mechanicPos} />

            {/* Neural Web Background */}
             <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={100}
                        array={new Float32Array(300).map(() => (Math.random() - 0.5) * 10)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.05} color="#64748b" transparent opacity={0.4} />
            </points>


            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </>
    );
};

export const SwarmVisualizer = () => {
  return (
    <div className="w-full h-[300px] bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-mono text-slate-400">ACTIVE SWARM TOPOLOGY</h3>
        </div>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <SwarmScene />
      </Canvas>
    </div>
  );
};
