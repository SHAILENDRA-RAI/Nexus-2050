import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AmbientEffectsProps {
  mousePosition?: { x: number; y: number };
}

export default function AmbientEffects({ mousePosition = { x: 0, y: 0 } }: AmbientEffectsProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep space gradient with mouse parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-dark via-[#050520] to-dark opacity-80"
        style={{
          x: mousePosition.x * 10,
          y: mousePosition.y * 10,
        }}
      />

      {/* Radial glow center */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${50 + mousePosition.x * 20}% ${30 + mousePosition.y * 10}%, rgba(0, 245, 255, 0.05) 0%, transparent 50%)`,
        }}
      />

      {/* Purple nebula */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${70 + mousePosition.x * 10}% ${60 + mousePosition.y * 10}%, rgba(168, 85, 247, 0.03) 0%, transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 3 === 0
              ? 'radial-gradient(circle, rgba(0, 245, 255, 0.6) 0%, transparent 70%)'
              : particle.id % 3 === 1
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        transition={{ stiffness: 100, damping: 20 }}
      />

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner HUD elements */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="absolute top-8 left-8 w-20 h-px bg-gradient-to-r from-cyan/40 to-transparent" />
        <div className="absolute top-8 left-8 w-px h-20 bg-gradient-to-b from-cyan/40 to-transparent" />
        <div className="absolute top-12 left-12 w-8 h-px bg-cyan/20" />
        <div className="absolute top-12 left-12 w-px h-8 bg-cyan/20" />
      </motion.div>

      <motion.div
        className="absolute top-0 right-0 w-40 h-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <div className="absolute top-8 right-8 w-20 h-px bg-gradient-to-l from-purple/40 to-transparent" />
        <div className="absolute top-8 right-8 w-px h-20 bg-gradient-to-b from-purple/40 to-transparent" />
        <div className="absolute top-12 right-12 w-8 h-px bg-purple/20" />
        <div className="absolute top-12 right-12 w-px h-8 bg-purple/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-40 h-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <div className="absolute bottom-8 left-8 w-20 h-px bg-gradient-to-r from-cyan/40 to-transparent" />
        <div className="absolute bottom-8 left-8 w-px h-20 bg-gradient-to-t from-cyan/40 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 3 }}
      >
        <div className="absolute bottom-8 right-8 w-20 h-px bg-gradient-to-l from-purple/40 to-transparent" />
        <div className="absolute bottom-8 right-8 w-px h-20 bg-gradient-to-t from-purple/40 to-transparent" />
      </motion.div>

      {/* Side accent lines */}
      <motion.div
        className="absolute left-4 top-1/4 bottom-1/4 w-px"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.1), transparent)',
          x: mousePosition.x * 5,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-4 top-1/4 bottom-1/4 w-px"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.1), transparent)',
          x: mousePosition.x * 5,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />

      {/* Data streams */}
      <motion.div
        className="absolute left-1/4 top-0 bottom-0 w-px opacity-20"
        style={{
          background: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, rgba(0, 245, 255, 0.3) 10px, rgba(0, 245, 255, 0.3) 11px)',
        }}
        animate={{ y: [0, 11, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute right-1/4 top-0 bottom-0 w-px opacity-20"
        style={{
          background: 'repeating-linear-gradient(to bottom, transparent, transparent 15px, rgba(168, 85, 247, 0.3) 15px, rgba(168, 85, 247, 0.3) 16px)',
        }}
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
