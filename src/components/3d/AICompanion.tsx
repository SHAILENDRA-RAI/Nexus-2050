import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

interface AICompanionProps {
  mousePosition: { x: number; y: number };
}

export default function AICompanion({ mousePosition }: AICompanionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const hudRingsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;

      // Slight rotation based on mouse
      groupRef.current.rotation.y = mousePosition.x * 0.4;
      groupRef.current.rotation.x = mousePosition.y * 0.15;
    }

    // Eyes track mouse
    if (eyeLeftRef.current && eyeRightRef.current) {
      const eyeOffset = 0.06;
      eyeLeftRef.current.position.x = -0.22 + mousePosition.x * eyeOffset;
      eyeLeftRef.current.position.y = 0.12 + mousePosition.y * eyeOffset;
      eyeRightRef.current.position.x = 0.22 + mousePosition.x * eyeOffset;
      eyeRightRef.current.position.y = 0.12 + mousePosition.y * eyeOffset;
    }

    // HUD rings rotate
    if (hudRingsRef.current) {
      hudRingsRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      hudRingsRef.current.children.forEach((child, i) => {
        child.rotation.z = state.clock.elapsedTime * (0.3 + i * 0.1);
      });
    }

    // Core pulse
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={groupRef} position={[3, -0.5, 3.5]}>
        {/* Main head */}
        <mesh>
          <boxGeometry args={[0.9, 0.7, 0.6]} />
          <meshBasicMaterial color="#0a0a1a" transparent opacity={0.95} />
        </mesh>

        {/* Head wireframe */}
        <mesh>
          <boxGeometry args={[0.92, 0.72, 0.62]} />
          <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Face plate */}
        <mesh position={[0, 0, 0.25]}>
          <boxGeometry args={[0.7, 0.5, 0.1]} />
          <meshBasicMaterial color="#050510" transparent opacity={0.8} />
        </mesh>

        {/* Eye sockets */}
        <mesh position={[-0.22, 0.12, 0.31]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0.22, 0.12, 0.31]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
        </mesh>

        {/* Eyes - follow mouse */}
        <mesh ref={eyeLeftRef} position={[-0.22, 0.12, 0.38]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.22, 0.12, 0.38]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>

        {/* Eye pupils */}
        <mesh position={[-0.22, 0.12, 0.45]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.22, 0.12, 0.45]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
        <mesh ref={coreRef} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
        {/* Antenna glow */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>

        {/* Chest light */}
        <mesh position={[0, -0.1, 0.31]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>
        <GlowPulse position={[0, -0.1, 0.32]} color="#a855f7" />

        {/* HUD rings around head */}
        <group ref={hudRingsRef} position={[0, 0, -0.15]}>
          <mesh>
            <torusGeometry args={[0.7, 0.01, 8, 32]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.8, 0.008, 8, 32]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.9, 0.006, 8, 32]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
          </mesh>
        </group>

        {/* Side panels */}
        <mesh position={[-0.48, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.4]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} />
        </mesh>
        <mesh position={[0.48, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.4]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} />
        </mesh>

        {/* Data lines on face */}
        {[-0.1, 0, 0.1].map((y, i) => (
          <mesh key={i} position={[0, y, 0.31]}>
            <planeGeometry args={[0.5, 0.02]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} />
          </mesh>
        ))}

        {/* Outer glow */}
        <mesh scale={1.3}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  );
}

function GlowPulse({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      ref.current.scale.set(scale, scale, 1);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <circleGeometry args={[0.06, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}
