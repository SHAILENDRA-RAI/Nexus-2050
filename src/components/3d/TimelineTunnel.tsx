import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const timelineData = [
  { year: '1998', title: 'Techfest Begins', description: 'The first edition marks the birth of innovation' },
  { year: '2005', title: 'Digital Era', description: 'Embracing technology transformation' },
  { year: '2015', title: 'Smart Evolution', description: 'AI and automation reshape possibilities' },
  { year: '2026', title: '30th Edition', description: 'Three decades of innovation excellence' },
  { year: '2035', title: 'AI Revolution', description: 'Artificial intelligence becomes integral' },
  { year: '2050', title: 'Future Era', description: 'The next frontier of human potential' },
];

interface TimelineTunnelProps {
  scrollProgress: number;
}

export default function TimelineTunnel({ scrollProgress }: TimelineTunnelProps) {
  const tunnelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = state.clock.elapsedTime * 0.08;
      tunnelRef.current.position.z = 30 + scrollProgress * -15;
    }
  });

  return (
    <group ref={tunnelRef}>
      {/* Tunnel rings */}
      {timelineData.map((item, index) => (
        <TimelineRing key={item.year} position={[0, 0, index * 5 - 12]} data={item} index={index} active={scrollProgress > (index / timelineData.length)} />
      ))}

      {/* Flowing particles */}
      {[...Array(60)].map((_, i) => (
        <TunnelParticle key={i} index={i} total={60} />
      ))}

      {/* Side rails */}
      <TunnelRails />

      {/* Central energy column */}
      <EnergyColumn scrollProgress={scrollProgress} />
    </group>
  );
}

function TimelineRing({
  position,
  data,
  index,
  active,
}: {
  position: [number, number, number];
  data: { year: string; title: string };
  index: number;
  active: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = -state.clock.elapsedTime * 0.1 + index * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.02;

      // Scale pulse when active
      const targetScale = active ? 1.15 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Increase glow when active
      ref.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const targetOpacity = active ? (i === 0 ? 0.9 : 0.3) : (i === 0 ? 0.5 : 0.15);
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      });
    }
  });

  const color = index % 2 === 0 ? '#00f5ff' : '#a855f7';

  return (
    <group ref={ref} position={position}>
      {/* Main ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.04, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Outer glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.7, 0.08, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* Data nodes on ring */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5]}>
          <sphereGeometry args={[active ? 0.08 : 0.05, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Timeline marker */}
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[active ? 0.18 : 0.12, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {active && (
        <mesh position={[0, 3.2, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.25} />
        </mesh>
      )}

      {/* Connection beams to next ring */}
      {index < timelineData.length - 1 && (
        <mesh position={[0, 0, 2.5]}>
          <cylinderGeometry args={[0.01, 0.01, 5, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

function TunnelParticle({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.8 + Math.random() * 1.2;
  const speed = 0.03 + Math.random() * 0.04;
  const offsetZ = index * 0.8;
  const yOffset = (Math.random() - 0.5) * 2;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(angle + t) * radius;
      ref.current.position.z = Math.sin(angle + t) * radius;
      ref.current.position.y = yOffset + Math.sin(t * 2) * 0.5;
      ref.current.position.y = ((offsetZ + state.clock.elapsedTime * 2) % 30) - 15;

      // Pulse opacity
      const mat = (ref.current.material as THREE.MeshBasicMaterial);
      mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.3;
    }
  });

  const color = index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#3b82f6';

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function TunnelRails() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.05;
      });
    }
  });

  return (
    <group ref={ref}>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]}>
          <boxGeometry args={[0.02, 0.02, 35]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyColumn({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + scrollProgress * 0.1;
      ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 30, 16, 1, true]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}
