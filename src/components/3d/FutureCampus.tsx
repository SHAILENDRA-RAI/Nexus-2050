import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

const buildings = [
  { name: 'AI Research Tower', height: 3.5, width: 1.4, position: [-4, 0, -3] as [number, number, number], color: '#00f5ff', windows: 8 },
  { name: 'Robotics Arena', height: 4, width: 1.8, position: [0, 0, -4] as [number, number, number], color: '#a855f7', windows: 10 },
  { name: 'Startup Hub', height: 2.8, width: 1.5, position: [4, 0, -3] as [number, number, number], color: '#3b82f6', windows: 6 },
  { name: 'Innovation Center', height: 4.5, width: 2, position: [-2, 0, -6] as [number, number, number], color: '#22c55e', windows: 12 },
  { name: 'Quantum Lab', height: 3.2, width: 1.6, position: [2, 0, -6] as [number, number, number], color: '#eab308', windows: 8 },
];

export default function FutureCampus() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -4]}>
        <circleGeometry args={[10, 64]} />
        <meshBasicMaterial color="#020412" transparent opacity={0.6} />
      </mesh>

      {/* Grid lines on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -4]}>
        <circleGeometry args={[9.5, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.08} wireframe />
      </mesh>

      {/* Concentric rings */}
      {[2, 4, 6, 8].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -4]}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.15 - i * 0.02} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Buildings */}
      {buildings.map((building, idx) => (
        <HolographicBuilding key={building.name} {...building} delay={idx * 0.3} />
      ))}

      {/* Flying particles around buildings */}
      {[...Array(30)].map((_, i) => (
        <CityParticle key={i} index={i} />
      ))}

      {/* Connection beams between buildings */}
      <ConnectionBeams />

      {/* Holographic rings above city */}
      <SkyRings />
    </group>
  );
}

function HolographicBuilding({
  height,
  width,
  position,
  color,
  windows,
  delay,
}: {
  height: number;
  width: number;
  position: [number, number, number];
  color: string;
  windows: number;
  delay: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const windowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + height / 2 + Math.sin(state.clock.elapsedTime + delay) * 0.03;
    }
    if (windowRef.current) {
      windowRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.15;
      });
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
      <group ref={meshRef} position={position}>
        {/* Main building */}
        <mesh>
          <boxGeometry args={[width, height, width]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>

        {/* Wireframe */}
        <mesh>
          <boxGeometry args={[width * 1.01, height * 1.01, width * 1.01]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
        </mesh>

        {/* Vertical edges */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
          <mesh key={i} position={[x * width / 2, 0, z * width / 2]}>
            <boxGeometry args={[0.02, height * 1.02, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Horizontal floors */}
        {Array.from({ length: Math.floor(height / 0.6) }).map((_, i) => (
          <mesh key={i} position={[0, -height / 2 + i * 0.6 + 0.3, 0]}>
            <boxGeometry args={[width * 1.02, 0.01, width * 1.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        ))}

        {/* Windows */}
        <group ref={windowRef}>
          {Array.from({ length: Math.min(windows, 12) }).map((_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const windowX = -width / 3 + col * (width / 3);
            const windowY = -height / 2 + row * (height / 4) + height / 8 + 0.3;

            return (
              <mesh key={i} position={[windowX, windowY, width / 2 + 0.01]}>
                <planeGeometry args={[width / 5, height / 10]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
        </group>

        {/* Top spire */}
        <mesh position={[0, height / 2 + 0.3, 0]}>
          <coneGeometry args={[0.1, 0.6, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>

        {/* Glow */}
        <mesh scale={1.2}>
          <boxGeometry args={[width, height, width]} />
          <meshBasicMaterial color={color} transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  );
}

function CityParticle({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 30) * Math.PI * 2;
  const radius = 5 + (index % 3) * 2;
  const height = Math.sin(index) * 3 + 2;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * 0.2 + angle;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius - 4;
      ref.current.position.y = height + Math.sin(t * 2) * 1;
    }
  });

  const color = index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#3b82f6';

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function ConnectionBeams() {
  const connections: [[number, number, number], [number, number, number], string][] = [
    [[-4, 1.75, -3], [0, 2, -4], '#00f5ff'],
    [[0, 2, -4], [4, 1.4, -3], '#a855f7'],
    [[-2, 2.25, -6], [2, 1.6, -6], '#22c55e'],
    [[-4, 1.75, -3], [-2, 2.25, -6], '#3b82f6'],
    [[4, 1.4, -3], [2, 1.6, -6], '#eab308'],
  ];

  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      });
    }
  });

  return (
    <group ref={ref}>
      {connections.map(([start, end, color], idx) => {
        const distance = Math.sqrt(
          Math.pow(end[0] - start[0], 2) +
          Math.pow(end[1] - start[1], 2) +
          Math.pow(end[2] - start[2], 2)
        );
        const center: [number, number, number] = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ];
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

        return (
          <mesh key={idx} position={center} rotation={[0, 0, angle]}>
            <boxGeometry args={[distance, 0.02, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function SkyRings() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.children.forEach((child, i) => {
        child.rotation.z += 0.001 * (i + 1);
      });
    }
  });

  return (
    <group ref={ref} position={[0, 6, -4]}>
      {[3, 4, 5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 8, 64]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.15 - i * 0.03} />
        </mesh>
      ))}
    </group>
  );
}
