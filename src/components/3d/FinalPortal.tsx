import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

interface FinalPortalProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

export default function FinalPortal({ mousePosition, scrollProgress }: FinalPortalProps) {
  const portalRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const energyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 0.15;

      // Scale based on scroll and hover
      const baseScale = 1 + scrollProgress * 0.5;
      const hoverScale = 1 + (Math.abs(mousePosition.x) + Math.abs(mousePosition.y)) * 0.1;
      portalRef.current.scale.setScalar(baseScale * hoverScale);
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z = -state.clock.elapsedTime * 0.2;
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.z = state.clock.elapsedTime * (0.2 + i * 0.1);
      });
    }

    if (energyRef.current) {
      energyRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.15;
      });
    }
  });

  return (
    <group ref={portalRef}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>

      {/* Main portal ring */}
      <mesh>
        <torusGeometry args={[3, 0.2, 32, 100]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.9} />
      </mesh>

      {/* Inner rings */}
      <group ref={ringsRef}>
        <mesh>
          <torusGeometry args={[2.5, 0.08, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.7} />
        </mesh>
        <mesh>
          <torusGeometry args={[2, 0.05, 16, 48]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.5, 0.04, 8, 32]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
        </mesh>
        <mesh>
          <torusGeometry args={[1, 0.03, 8, 24]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Portal center effect */}
      <PortalCenter mousePosition={mousePosition} scrollProgress={scrollProgress} />

      {/* Energy field */}
      <group ref={energyRef}>
        <mesh>
          <circleGeometry args={[2.8, 64]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <circleGeometry args={[2, 48]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating particles around portal */}
      {[...Array(25)].map((_, i) => (
        <PortalParticle key={i} index={i} total={25} />
      ))}

      {/* Radial beams */}
      {Array.from({ length: 12 }).map((_, i) => (
        <RadialBeam key={i} angle={(i / 12) * Math.PI * 2} index={i} />
      ))}

      {/* Energy wisps */}
      {[...Array(8)].map((_, i) => (
        <EnergyWisp key={i} index={i} />
      ))}

      {/* Portal symbols */}
      <PortalSymbols />
    </group>
  );
}

function PortalCenter({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }; scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;

      // React to mouse
      ref.current.rotation.x = mousePosition.y * 0.15;
      ref.current.rotation.y = mousePosition.x * 0.15;

      // Pulse with scroll
      const scale = 1 + scrollProgress * 0.3;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[2.8, 64]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PortalParticle({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.5 + (index % 4) * 0.2;
  const speed = 0.25 + (index % 5) * 0.08;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + angle;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius;
      ref.current.position.z = Math.sin(t * 2) * 0.3;

      const scale = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
      ref.current.scale.setScalar(scale);

      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3;
    }
  });

  const color = index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#3b82f6';

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

function RadialBeam({ angle, index }: { angle: number; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const length = 4 + index * 0.08;

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4 + angle) * 0.4;
      ref.current.scale.y = scale;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(state.clock.elapsedTime * 2 + angle) * 0.1;
    }
  });

  const color = index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#3b82f6';

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.1}>
      <mesh ref={ref} position={[Math.cos(angle) * length, Math.sin(angle) * length, 0]} rotation={[0, 0, angle]} scale={[0.02, 0.6, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </Float>
  );
}

function EnergyWisp({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 8) * Math.PI * 2;
  const radius = 4.5;
  const speed = 0.15 + index * 0.02;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + angle;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius;
      ref.current.position.z = Math.cos(t * 3) * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
    </mesh>
  );
}

function PortalSymbols() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
      ref.current.children.forEach((child, i) => {
        child.rotation.z = -state.clock.elapsedTime * 0.1;
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.08;
      });
    }
  });

  const symbolPositions: [number, number, number][] = [
    [Math.cos(Math.PI / 4) * 3.7, Math.sin(Math.PI / 4) * 3.7, 0.1],
    [Math.cos(3 * Math.PI / 4) * 3.7, Math.sin(3 * Math.PI / 4) * 3.7, 0.1],
    [Math.cos(5 * Math.PI / 4) * 3.7, Math.sin(5 * Math.PI / 4) * 3.7, 0.1],
    [Math.cos(7 * Math.PI / 4) * 3.7, Math.sin(7 * Math.PI / 4) * 3.7, 0.1],
  ];

  return (
    <group ref={ref}>
      {symbolPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} wireframe />
        </mesh>
      ))}
    </group>
  );
}
