import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AchievementPopupProps {
  achievement: string;
  index: number;
}

export default function AchievementPopup({ achievement, index }: AchievementPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-[300] glass-strong rounded-lg overflow-hidden"
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 }}
      style={{ marginBottom: index * 80 }}
    >
      {/* Glowing top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />

      <div className="flex items-center gap-3 px-5 py-3">
        {/* Achievement icon */}
        <motion.div
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center border border-cyan/30"
          animate={{
            boxShadow: [
              '0 0 10px rgba(0, 245, 255, 0.3)',
              '0 0 20px rgba(0, 245, 255, 0.5)',
              '0 0 10px rgba(0, 245, 255, 0.3)',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <motion.span
            className="text-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ⬡
          </motion.span>
        </motion.div>

        <div>
          <p className="text-cyan/60 text-xs font-mono tracking-wider">ACHIEVEMENT UNLOCKED</p>
          <p className="text-white font-semibold">{achievement}</p>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-cyan via-purple to-cyan"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
      />
    </motion.div>
  );
}
