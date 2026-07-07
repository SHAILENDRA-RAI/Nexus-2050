import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarsProps {
  count?: number;
}

export default function Stars({ count = 4000 }: StarsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const brightStarsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random sphere distribution
      const radius = 40 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color variation
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.6) {
        color = new THREE.Color('#00f5ff');
      } else if (colorChoice < 0.85) {
        color = new THREE.Color('#a855f7');
      } else {
        color = new THREE.Color('#ffffff');
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    return { positions, colors, sizes };
  }, [count]);

  // Bright stars
  const brightStarsPosition = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00008;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }

    if (brightStarsRef.current) {
      brightStarsRef.current.rotation.y += 0.00008;
    }
  });

  return (
    <group>
      {/* Main star field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlesPosition.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particlesPosition.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bright stars */}
      <points ref={brightStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={brightStarsPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Distant nebula effect */}
      <mesh>
        <sphereGeometry args={[80, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[85, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.015} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
