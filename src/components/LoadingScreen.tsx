import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  activating?: boolean;
}

const bootMessages = [
  'INITIALIZING NEXUS 2050...',
  'CONNECTING FUTURE SYSTEMS...',
  'LOADING QUANTUM CORES...',
  'ESTABLISHING NEURAL LINK...',
  'SYNCING INNOVATION NODES...',
  'ACTIVATING HOLOGRAPHIC INTERFACE...',
  'REALITY MATRIX ONLINE...',
  'SYSTEM READY.',
];

export default function LoadingScreen({ onComplete, activating }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 12 + 4;
      });
    }, 120);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && currentMessage >= bootMessages.length - 1 && !activating) {
      onComplete();
    }
  }, [progress, currentMessage, onComplete, activating]);

  return (
    <AnimatePresence>
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 245, 255, 0.1) 0%, transparent 60%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated logo */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 w-32 h-32 -m-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="0.5"
                  strokeDasharray="5,3"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Inner ring */}
            <motion.div
              className="absolute inset-0 w-28 h-28 -m-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="1"
                  strokeDasharray="8,4"
                  opacity="0.3"
                />
              </svg>
            </motion.div>

            {/* Center element */}
            <motion.div
              className="w-24 h-24 relative"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(0, 245, 255, 0.3)',
                  '0 0 50px rgba(168, 85, 247, 0.4)',
                  '0 0 30px rgba(0, 245, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 to-purple/20 rounded-xl transform rotate-45" />
              <div className="absolute inset-2 bg-dark rounded-lg transform rotate-45 border border-cyan/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-3xl"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⬡
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

          {/* Logo text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-black tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{
                textShadow: [
                  '0 0 40px rgba(0, 245, 255, 0.3)',
                  '0 0 60px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(0, 245, 255, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              NEXUS 2050
            </motion.h1>

            <motion.div
              className="h-0.5 w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-cyan to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Boot messages */}
          <div className="mt-10 h-40 overflow-hidden font-mono">
            <div className="space-y-1">
              {bootMessages.slice(0, currentMessage + 1).map((msg, idx) => (
                <motion.p
                  key={msg}
                  className={`text-xs md:text-sm tracking-wider first:mt-0 ${
                    idx === currentMessage ? 'text-cyan' : 'text-cyan/40'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: idx === currentMessage ? 1 : 0.4, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-purple/50 mr-2">{'>'}</span>
                  {msg}
                  {idx === currentMessage && (
                    <motion.span
                      className="inline-block ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  )}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-72 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00f5ff, #a855f7, #00f5ff)',
                backgroundSize: '200% 100%',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-purple mt-[-4px]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            className="mt-3 font-mono text-cyan text-sm tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.min(Math.round(progress), 100).toString().padStart(3, '0')}%
          </motion.p>

          {/* Status indicators */}
          <motion.div
            className="flex items-center gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {['CPU', 'MEM', 'NET'].map((item, idx) => (
              <div key={item} className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.2 }}
                />
                <span className="text-cyan/50 text-xs font-mono">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Corner HUD elements */}
        <motion.div
          className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-purple/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-purple/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
