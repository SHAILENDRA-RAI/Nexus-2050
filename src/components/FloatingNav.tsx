import { motion } from 'framer-motion';

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onPortalActivate: () => void;
  portalActivated: boolean;
}

export default function FloatingNav({ activeSection, onNavigate, onPortalActivate, portalActivated }: FloatingNavProps) {
  const navItems = [
    { id: 'hero', label: 'NEXUS', icon: '⬡' },
    { id: 'innovation', label: 'GALAXY', icon: '◎' },
    { id: 'campus', label: 'CAMPUS', icon: '⌬' },
    { id: 'ai', label: 'AI', icon: '◉' },
    { id: 'timeline', label: 'TUNNEL', icon: '⟡' },
    { id: 'portal', label: 'PORTAL', icon: '◈' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.5, duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('hero')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 border border-cyan/30 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-cyan text-lg">⬡</span>
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)' }}
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-cyan font-bold text-lg tracking-wider">NEXUS</span>
            <span className="text-white/60 text-lg ml-1">2050</span>
          </div>
        </motion.div>

        {/* Center navigation - desktop */}
        <div className="hidden md:flex items-center gap-1 glass px-2 py-2 rounded-full">
          {navItems.slice(1).map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
                activeSection === item.id
                  ? 'text-cyan'
                  : 'text-white/50 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan/20"
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/5">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-green-400 text-xs font-mono">ONLINE</span>
          </div>

          {/* Enter button */}
          <motion.button
            className="cyber-button py-2 px-4 text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (activeSection === 'portal' && !portalActivated) {
                onPortalActivate();
              } else {
                onNavigate('portal');
              }
            }}
          >
            {portalActivated ? 'ACTIVE' : 'ENTER'}
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan via-purple to-cyan"
        initial={{ width: 0 }}
        animate={{ width: activeSection !== 'hero' ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  );
}
