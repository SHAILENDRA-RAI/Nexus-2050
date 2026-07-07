import { motion } from 'framer-motion';
import type { PlanetData } from './3d/InnovationPlanets';

interface PlanetModalProps {
  planet: PlanetData;
  onClose: () => void;
}

export default function PlanetModal({ planet, onClose }: PlanetModalProps) {
  const applications = [
    'Advanced neural architectures',
    'Real-time decision systems',
    'Autonomous operations',
    'Human-AI collaboration',
  ];

  const stats = [
    { label: 'GROWTH RATE', value: '+247%' },
    { label: 'RESEARCH NODES', value: '1,847' },
    { label: 'IMPACT SCORE', value: '98.7' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl glass-strong rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${planet.color}30, transparent)`,
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Hud corners */}
        <div className="hud-corner hud-corner-tl" style={{ borderColor: planet.color, width: 32, height: 32 }} />
        <div className="hud-corner hud-corner-tr" style={{ borderColor: planet.color, width: 32, height: 32 }} />
        <div className="hud-corner hud-corner-bl" style={{ borderColor: planet.color, width: 32, height: 32 }} />
        <div className="hud-corner hud-corner-br" style={{ borderColor: planet.color, width: 32, height: 32 }} />

        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: `${planet.color}20`,
                  color: planet.color,
                  border: `2px solid ${planet.color}40`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${planet.color}30`,
                    `0 0 40px ${planet.color}50`,
                    `0 0 20px ${planet.color}30`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {planet.icon}
              </motion.div>

              <div>
                <motion.div
                  className="flex items-center gap-2 mb-1"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span
                    className="text-xs font-mono tracking-widest"
                    style={{ color: planet.color }}
                  >
                    TECHNOLOGY DOMAIN
                  </span>
                </motion.div>
                <h2 className="text-2xl font-bold text-white">{planet.name}</h2>
              </div>
            </div>

            <motion.button
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-lg p-3 text-center"
              >
                <p className="text-white/40 text-xs font-mono mb-1">{stat.label}</p>
                <p
                  className="text-xl font-bold"
                  style={{ color: planet.color }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3
              className="text-sm font-mono tracking-wider mb-3"
              style={{ color: planet.color }}
            >
              SYSTEM DESCRIPTION
            </h3>
            <p className="text-white/70 leading-relaxed">{planet.info}</p>
          </div>

          {/* Applications */}
          <div className="mb-6">
            <h3
              className="text-sm font-mono tracking-wider mb-3"
              style={{ color: planet.color }}
            >
              FUTURE APPLICATIONS
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {applications.map((app, i) => (
                <motion.div
                  key={app}
                  className="glass px-4 py-2 rounded-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="text-white/70 text-sm">{app}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <motion.button
            className="flex-1 py-3 rounded-lg font-semibold"
            style={{
              backgroundColor: `${planet.color}20`,
              color: planet.color,
              border: `1px solid ${planet.color}40`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Close Scanner
          </motion.button>
          <motion.button
            className="flex-1 py-3 rounded-lg glass font-semibold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Deep Dive
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
