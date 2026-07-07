import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FuturisticEarthProps {
  mousePosition: { x: number; y: number };
}

export default function FuturisticEarth({ mousePosition }: FuturisticEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbitsRef = useRef<THREE.Group>(null);
  const dataStreamsRef = useRef<THREE.Group>(null);

  // Create cyber grid texture
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark base
    ctx.fillStyle = '#020412';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw hexagonal grid
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
    ctx.lineWidth = 0.5;

    const hexSize = 25;
    const hexHeight = hexSize * Math.sqrt(3);

    for (let row = 0; row < 512 / hexHeight + 1; row++) {
      for (let col = 0; col < 1024 / (hexSize * 1.5) + 1; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexHeight + (col % 2 ? hexHeight / 2 : 0);

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + hexSize * Math.cos(angle);
          const hy = y + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Draw glowing nodes
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.6)');
      gradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.2)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add some connections
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 30; i++) {
      const x1 = Math.random() * 1024;
      const y1 = Math.random() * 512;
      const x2 = x1 + (Math.random() - 0.5) * 200;
      const y2 = y1 + (Math.random() - 0.5) * 100;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;

      // React to mouse
      earthRef.current.rotation.x = mousePosition.y * 0.1;
    }

    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.001;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (orbitsRef.current) {
      orbitsRef.current.rotation.y += 0.001;
      orbitsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }

    if (dataStreamsRef.current) {
      dataStreamsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.rotation.z += 0.01 + i * 0.002;
      });
    }
  });

  return (
    <group>
      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.05} />
      </mesh>

      {/* Main Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial map={gridTexture} transparent opacity={0.95} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* Atmospheric rings */}
      <mesh>
        <ringGeometry args={[2.4, 2.45, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.55, 2.58, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbit rings */}
      <group ref={orbitsRef}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <torusGeometry args={[3, 0.015, 16, 100]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
          <torusGeometry args={[3.4, 0.012, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 6, Math.PI / 8]}>
          <torusGeometry args={[3.8, 0.01, 16, 100]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Data streams */}
      <group ref={dataStreamsRef}>
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]} rotation={[0, 0, angle]}>
            <torusGeometry args={[0.5 + i * 0.1, 0.008, 8, 32]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00f5ff' : '#a855f7'} transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Satellites */}
      {[...Array(8)].map((_, i) => (
        <Satellite key={i} index={i} />
      ))}

      {/* Energy beams from poles */}
      <EnergyBeam position={[0, 2.5, 0]} rotation={[0, 0, 0]} />
      <EnergyBeam position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]} />
    </group>
  );
}

function Satellite({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const angle = (index / 8) * Math.PI * 2;
  const radius = 3.2 + (index % 3) * 0.3;
  const speed = 0.008 + index * 0.001;
  const tilt = (index % 4) * Math.PI / 8;
  const yOffset = (index % 3 - 1) * 0.5;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + angle;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = yOffset + Math.sin(t * 2) * 0.2;
      ref.current.rotation.y = t;
    }
  });

  const color = index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#3b82f6';

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      {/* Satellite body */}
      <mesh>
        <octahedronGeometry args={[0.06, 0]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Trail */}
      <mesh>
        <coneGeometry args={[0.03, 0.3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function EnergyBeam({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <coneGeometry args={[0.3, 1.5, 8]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}
