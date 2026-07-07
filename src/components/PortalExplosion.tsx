import { motion } from 'framer-motion';

export default function PortalExplosion() {
  return (
    <motion.div
      className="fixed inset-0 z-[500] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* White flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5 }}
      />

      {/* Radial explosion */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.8) 0%, transparent 70%)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 3, 5] }}
        transition={{ duration: 1.5 }}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2] }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="w-[200vmax] h-[200vmax] rounded-full border-4 border-cyan/50"
          style={{
            boxShadow: '0 0 100px #00f5ff, inset 0 0 100px rgba(0, 245, 255, 0.3)',
          }}
        />
      </motion.div>

      {/* Particles explosion */}
      {[...Array(50)].map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        const size = 4 + Math.random() * 8;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              background: i % 2 === 0 ? '#00f5ff' : '#a855f7',
              boxShadow: `0 0 ${size * 2}px ${i % 2 === 0 ? '#00f5ff' : '#a855f7'}`,
            }}
            initial={{ x: '-50%', y: '-50%', scale: 0 }}
            animate={{
              x: `calc(-50% + ${Math.cos(angle) * distance}px)`,
              y: `calc(-50% + ${Math.sin(angle) * distance}px)`,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Energy rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            borderColor: ring % 2 === 0 ? '#00f5ff' : '#a855f7',
            width: 100 * ring,
            height: 100 * ring,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 1, delay: ring * 0.1 }}
        />
      ))}

      {/* Center text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 1.5 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black text-white"
          style={{
            textShadow: '0 0 50px #00f5ff, 0 0 100px #00f5ff',
          }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          ACTIVATED
        </motion.h1>
      </motion.div>

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.1) 2px, rgba(0, 245, 255, 0.1) 4px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2 }}
      />

      {/* Screen shake effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -5, 5, -5, 5, 0],
          y: [0, 5, -5, 5, -5, 0],
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, transparent 30%, rgba(0, 245, 255, 0.3) 100%)',
          }}
        />
      </motion.div>

      {/* Success message */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-cyan font-mono text-lg tracking-widest">
          WELCOME TO THE FUTURE
        </p>
      </motion.div>
    </motion.div>
  );
}
