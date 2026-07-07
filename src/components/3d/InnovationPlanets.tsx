import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';

interface PlanetData {
  name: string;
  color: string;
  size: number;
  position: [number, number, number];
  info: string;
  icon: string;
  shape: 'sphere' | 'octahedron' | 'icosahedron' | 'dodecahedron' | 'torus' | 'torusKnot';
}

const planets: PlanetData[] = [
  {
    name: 'Artificial Intelligence',
    color: '#00f5ff',
    size: 0.55,
    position: [-4, 1.5, 1],
    info: 'Neural networks, deep learning, and cognitive systems that reshape human potential. The brain of tomorrow.',
    icon: 'AI',
    shape: 'sphere',
  },
  {
    name: 'Robotics',
    color: '#a855f7',
    size: 0.5,
    position: [-2.8, -1, 0],
    info: 'Autonomous machines that enhance human capabilities and explore unknown frontiers.',
    icon: 'RB',
    shape: 'octahedron',
  },
  {
    name: 'Space Tech',
    color: '#3b82f6',
    size: 0.6,
    position: [0, 2.2, 0.5],
    info: 'Interstellar exploration, orbital habitats, and the new space economy.',
    icon: 'ST',
    shape: 'icosahedron',
  },
  {
    name: 'Cyber Security',
    color: '#22c55e',
    size: 0.48,
    position: [2.8, -0.5, 1],
    info: 'Quantum encryption and neural firewalls protecting the digital frontier.',
    icon: 'CS',
    shape: 'dodecahedron',
  },
  {
    name: 'Quantum Computing',
    color: '#eab308',
    size: 0.52,
    position: [4.2, 1, 0],
    info: 'Processing power beyond classical limits, solving the unsolvable.',
    icon: 'QC',
    shape: 'torusKnot',
  },
  {
    name: 'Bio Engineering',
    color: '#ec4899',
    size: 0.5,
    position: [1.5, 0, -0.5],
    info: 'Gene editing, synthetic biology, and personalized medicine innovations.',
    icon: 'BE',
    shape: 'torus',
  },
];

interface InnovationPlanetsProps {
  onPlanetHover: (planet: PlanetData | null) => void;
  onPlanetSelect: (planet: PlanetData) => void;
  scrollProgress: number;
}

export default function InnovationPlanets({ onPlanetHover, onPlanetSelect, scrollProgress }: InnovationPlanetsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 0.3 + state.clock.elapsedTime * 0.03;
      groupRef.current.position.z = -scrollProgress * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central energy field */}
      <CentralEnergyField />

      {/* Connection lines between planets */}
      <ConnectionLines />

      {/* Planets */}
      {planets.map((planet, index) => (
        <Planet
          key={planet.name}
          data={planet}
          onHover={onPlanetHover}
          onSelect={onPlanetSelect}
          delay={index * 0.5}
        />
      ))}
    </group>
  );
}

function CentralEnergyField() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += 0.01;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[6, 64]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.Group>(null);

  const connections: [[number, number, number], [number, number, number]][] = [
    [planets[0].position, planets[1].position],
    [planets[1].position, planets[2].position],
    [planets[2].position, planets[3].position],
    [planets[3].position, planets[4].position],
    [planets[4].position, planets[5].position],
    [planets[5].position, planets[0].position],
    [planets[0].position, planets[2].position],
    [planets[3].position, planets[5].position],
  ];

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      });
    }
  });

  return (
    <group ref={ref}>
      {connections.map(([start, end], idx) => {
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
            <boxGeometry args={[distance, 0.01, 0.01]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

function Planet({
  data,
  onHover,
  onSelect,
  delay,
}: {
  data: PlanetData;
  onHover: (hovered: boolean) => void;
  onSelect: (planet: PlanetData) => void;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getGeometry = () => {
    switch (data.shape) {
      case 'octahedron':
        return <octahedronGeometry args={[data.size, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[data.size, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[data.size, 0]} />;
      case 'torus':
        return <torusGeometry args={[data.size * 0.8, data.size * 0.3, 16, 32]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[data.size * 0.6, data.size * 0.2, 64, 8]} />;
      default:
        return <sphereGeometry args={[data.size, 32, 32]} />;
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + delay) * 0.15;

      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }

    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.4 : 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      const ringScale = hovered ? 1.5 : 1.2;
      ringRef.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, 1), 0.1);
    }
  });

  const handlePointerEnter = () => {
    setHovered(true);
    onHover(true);
    document.body.style.cursor = 'none';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    onHover(false);
    document.body.style.cursor = 'default';
  };

  const handleClick = () => {
    onSelect(data);
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={data.position}>
        {/* Main shape */}
        <mesh
          ref={meshRef}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {getGeometry()}
          <meshBasicMaterial color={data.color} transparent opacity={0.85} />
        </mesh>

        {/* Wireframe overlay */}
        <mesh>
          {getGeometry()}
          <meshBasicMaterial color={data.color} wireframe transparent opacity={0.25} />
        </mesh>

        {/* Glow effect */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[data.size, 16, 16]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.15} side={THREE.BackSide} />
        </mesh>

        {/* Orbital ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size * 1.4, data.size * 1.45, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>

        {/* Second ring */}
        <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <ringGeometry args={[data.size * 1.6, data.size * 1.62, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* Pulse effect when hovered */}
        {hovered && (
          <mesh scale={2}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.1} side={THREE.BackSide} />
          </mesh>
        )}

        {/* Click indicator */}
        {hovered && (
          <mesh position={[0, -data.size - 0.3, 0]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshBasicMaterial color={data.color} />
          </mesh>
        )}

        {/* Label */}
        <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
          <Text
            position={[0, data.size + 0.6, 0]}
            fontSize={0.18}
            color={data.color}
            anchorX="center"
            anchorY="middle"
          >
            {data.icon}
          </Text>
        </Float>
      </group>
    </Float>
  );
}

export type { PlanetData };
