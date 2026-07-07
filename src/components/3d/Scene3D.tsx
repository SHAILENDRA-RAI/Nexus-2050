import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Stars from './Stars';
import FuturisticEarth from './FuturisticEarth';
import InnovationPlanets, { PlanetData } from './InnovationPlanets';
import FutureCampus from './FutureCampus';
import AICompanion from './AICompanion';
import TimelineTunnel from './TimelineTunnel';
import FinalPortal from './FinalPortal';

interface Scene3DProps {
  scrollProgress: number;
  onPlanetHover: (planet: PlanetData | null) => void;
  onPlanetSelect: (planet: PlanetData) => void;
  mousePosition: { x: number; y: number };
}

export default function Scene3D({ scrollProgress, onPlanetHover, onPlanetSelect, mousePosition }: Scene3DProps) {
  return (
    <div className="canvas-container">
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          alpha: false,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <Suspense fallback={null}>
          <SceneContent
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
            onPlanetHover={onPlanetHover}
            onPlanetSelect={onPlanetSelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContent({
  scrollProgress,
  mousePosition,
  onPlanetHover,
  onPlanetSelect,
}: {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  onPlanetHover: (planet: PlanetData | null) => void;
  onPlanetSelect: (planet: PlanetData) => void;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Smooth camera movement based on scroll
  useFrame(() => {
    const targetZ = 10 - scrollProgress * 55;
    const targetY = Math.sin(scrollProgress * Math.PI * 2) * 2 + mousePosition.y * 0.5;
    const targetX = mousePosition.x * 0.5;

    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.x += (targetX - camera.position.x) * 0.05;

    camera.rotation.x = mousePosition.y * 0.02;
    camera.rotation.y = -mousePosition.x * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Environment */}
      <color attach="background" args={['#030014']} />
      <fog attach="fog" args={['#030014', 20, 100]} />

      {/* Stars - always visible */}
      <Stars count={4000} />

      {/* Section 1: Hero - Earth (0-18% scroll) */}
      <group visible={scrollProgress < 0.2} position={[0, 0, 0]}>
        <FuturisticEarth mousePosition={mousePosition} />
      </group>

      {/* Section 2: Innovation Planets (18-42% scroll) */}
      {scrollProgress >= 0.15 && scrollProgress < 0.45 && (
        <group position={[0, 0, 5]}>
          <InnovationPlanets
            onPlanetHover={onPlanetHover}
            onPlanetSelect={onPlanetSelect}
            scrollProgress={(scrollProgress - 0.15) / 0.3}
          />
        </group>
      )}

      {/* Section 3: Future Campus (40-58% scroll) */}
      {scrollProgress >= 0.38 && scrollProgress < 0.6 && (
        <group position={[0, -1, 12]}>
          <FutureCampus />
        </group>
      )}

      {/* Section 4: AI Companion (55-72% scroll) */}
      {scrollProgress >= 0.52 && scrollProgress < 0.75 && (
        <AICompanion mousePosition={mousePosition} />
      )}

      {/* Section 5: Timeline Tunnel (65-88% scroll) */}
      {scrollProgress >= 0.62 && scrollProgress < 0.9 && (
        <TimelineTunnel scrollProgress={(scrollProgress - 0.62) / 0.28} />
      )}

      {/* Section 6: Final Portal (82-100% scroll) */}
      {scrollProgress >= 0.8 && (
        <group position={[0, 0, 48]}>
          <FinalPortal mousePosition={mousePosition} scrollProgress={(scrollProgress - 0.8) / 0.2} />
        </group>
      )}

      {/* Ambient particles along the entire path */}
      <AmbientParticles />
    </group>
  );
}

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const particles = (() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = Math.random() * 70 - 10;

      const color = new THREE.Color().lerpColors(
        new THREE.Color('#00f5ff'),
        new THREE.Color('#a855f7'),
        Math.random()
      );
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.1 + 0.02;
    }

    return { positions, colors, sizes };
  })();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={800} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={800} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
