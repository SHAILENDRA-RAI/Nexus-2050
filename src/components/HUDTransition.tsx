import { motion } from 'framer-motion';

interface HUDTransitionProps {
  text: string;
}

export default function HUDTransition({ text }: HUDTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background overlay */}
      <motion.div
        className="absolute inset-0 bg-dark/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.03) 2px, rgba(0, 245, 255, 0.03) 4px)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 100 }}
        transition={{ duration: 0.5, repeat: 2 }}
      />

      {/* Horizontal scan */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent"
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Glowing lines traveling across */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
          style={{ top: `${30 + i * 20}%`, left: 0, right: 0 }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        />
      ))}

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow background */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
          />

          <div className="relative flex items-center gap-4">
            {/* Loading spinner */}
            <motion.div
              className="w-8 h-8 border-2 border-cyan/30 border-t-cyan rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            />

            <motion.span
              className="text-cyan font-mono text-lg md:text-xl tracking-[0.3em]"
              style={{ textShadow: '0 0 20px rgba(0, 245, 255, 0.8)' }}
            >
              {text}
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Corner brackets */}
      {[
        { top: 0, left: 0, border: 'border-l-2 border-t-2' },
        { top: 0, right: 0, border: 'border-r-2 border-t-2' },
        { bottom: 0, left: 0, border: 'border-l-2 border-b-2' },
        { bottom: 0, right: 0, border: 'border-r-2 border-b-2' },
      ].map((corner, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 border-cyan/50 ${corner.border}`}
          style={corner}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
        />
      ))}

      {/* Data streams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-20 bg-gradient-to-b from-cyan to-transparent"
          style={{ left: `${20 + i * 15}%`, top: 0 }}
          animate={{ y: ['0%', '100vh'] }}
          transition={{ duration: 0.5 + i * 0.1, ease: 'linear' }}
        />
      ))}
    </motion.div>
  );
}
