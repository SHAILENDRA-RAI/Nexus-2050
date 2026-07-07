import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Scene3D from './3d/Scene3D';
import LoadingScreen from './LoadingScreen';
import CustomCursor from './CustomCursor';
import AmbientEffects from './AmbientEffects';
import FloatingNav from './FloatingNav';
import HUDTransition from './HUDTransition';
import AchievementPopup from './AchievementPopup';
import PlanetModal from './PlanetModal';
import PortalExplosion from './PortalExplosion';
import type { PlanetData } from './3d/InnovationPlanets';

export default function MainExperience() {
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [showTransition, setShowTransition] = useState(false);
  const [transitionText, setTransitionText] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showPortalExplosion, setShowPortalExplosion] = useState(false);
  const [portalActivated, setPortalActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const smoothMouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const smoothMouseY = useSpring(0, { stiffness: 100, damping: 20 });

  const handleLoadingComplete = useCallback(() => {
    setActivating(true);
    setTimeout(() => setActivated(true), 1500);
    setTimeout(() => {
      setLoading(false);
      setActivating(false);
      addAchievement('NEXUS INITIALIZED');
    }, 2000);
  }, []);

  const addAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  // Track mouse for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      smoothMouseX.set(x);
      smoothMouseY.set(y);
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [smoothMouseX, smoothMouseY]);

  // Track active section based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress: number) => {
      const sections = ['hero', 'innovation', 'campus', 'ai', 'timeline', 'portal'];
      const index = Math.min(Math.floor(progress * 6), 5);
      const newSection = sections[index];

      if (newSection !== activeSection) {
        setActiveSection(newSection);

        // Trigger section-specific achievements
        if (newSection === 'innovation' && !achievements.includes('GALAXY DISCOVERED')) {
          addAchievement('GALAXY DISCOVERED');
        } else if (newSection === 'ai' && !achievements.includes('AI CORE ONLINE')) {
          addAchievement('AI CORE ONLINE');
        } else if (newSection === 'portal' && !achievements.includes('PORTAL LOCATED')) {
          addAchievement('PORTAL LOCATED');
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeSection, achievements]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Show transition
      const transitionMessages: Record<string, string> = {
        innovation: 'ACCESSING GALAXY SYSTEM...',
        campus: 'INITIALIZING CAMPUS...',
        ai: 'ACTIVATING AI CORE...',
        timeline: 'ENTERING TIME TUNNEL...',
        portal: 'OPENING FUTURE PORTAL...',
        hero: 'RETURNING TO ORIGIN...',
      };

      if (sectionId !== activeSection && transitionMessages[sectionId]) {
        setTransitionText(transitionMessages[sectionId]);
        setShowTransition(true);

        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => setShowTransition(false), 800);
        }, 400);
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSection]);

  // Handle portal activation
  const handlePortalActivate = useCallback(() => {
    setShowPortalExplosion(true);
    setTimeout(() => {
      setPortalActivated(true);
      addAchievement('FUTURE ACTIVATED');
    }, 2000);
    setTimeout(() => setShowPortalExplosion(false), 3000);
  }, []);

  // Handle planet selection
  const handlePlanetSelect = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
    addAchievement(`${planet.icon} SCANNED`);
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: activated ? 'auto' : '100vh' }}>
      <CustomCursor />

      {/* Achievement popups */}
      {achievements.map((achievement, index) => (
        <AchievementPopup key={achievement} achievement={achievement} index={index} />
      ))}

      {/* HUD Transition */}
      <AnimatePresence>
        {showTransition && <HUDTransition text={transitionText} />}
      </AnimatePresence>

      {/* Portal explosion effect */}
      <AnimatePresence>
        {showPortalExplosion && <PortalExplosion />}
      </AnimatePresence>

      {/* Loading screen */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={handleLoadingComplete} activating={activating} />
        )}
      </AnimatePresence>

      {/* Activation transition */}
      <AnimatePresence>
        {activating && !loading && (
          <motion.div
            className="fixed inset-0 z-[900] bg-dark pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full blur-4xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,245,255,0.5) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: 1 }}
                />
                <motion.h1
                  className="text-6xl md:text-8xl font-bold text-cyan"
                  style={{ textShadow: '0 0 40px #00f5ff, 0 0 80px #00f5ff' }}
                >
                  ACTIVATED
                </motion.h1>
              </div>
            </motion.div>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-8 bg-gradient-to-b from-cyan to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20%',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: '140vh', opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {activated && !loading && (
        <>
          {/* Floating Navigation */}
          <FloatingNav
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onPortalActivate={handlePortalActivate}
            portalActivated={portalActivated}
          />

          {/* Ambient effects */}
          <AmbientEffects mousePosition={mousePosition} />

          {/* 3D Scene */}
          <Scene3DMonitor
            scrollProgress={scrollProgress}
            onPlanetHover={setHoveredPlanet}
            onPlanetSelect={handlePlanetSelect}
            mousePosition={mousePosition}
          />

          {/* Planet Modal */}
          <AnimatePresence>
            {selectedPlanet && (
              <PlanetModal
                planet={selectedPlanet}
                onClose={() => setSelectedPlanet(null)}
              />
            )}
          </AnimatePresence>

          {/* UI Content Sections */}
          <div className="content-overlay">
            <HeroSection
              mousePosition={mousePosition}
              onBeginExploration={() => scrollToSection('innovation')}
            />
            <InnovationSection
              hoveredPlanet={hoveredPlanet}
              onPlanetSelect={handlePlanetSelect}
            />
            <CampusSection />
            <AISection />
            <TimelineSection />
            <PortalSection
              mousePosition={mousePosition}
              onActivate={handlePortalActivate}
              portalActivated={portalActivated}
            />
          </div>

          {/* Scroll indicator */}
          <ScrollIndicator scrollProgress={scrollProgress} />
        </>
      )}
    </div>
  );
}

function Scene3DMonitor({
  scrollProgress,
  onPlanetHover,
  onPlanetSelect,
  mousePosition,
}: {
  scrollProgress: any;
  onPlanetHover: (planet: PlanetData | null) => void;
  onPlanetSelect: (planet: PlanetData) => void;
  mousePosition: { x: number; y: number };
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (v: number) => setProgress(v));
    return () => unsubscribe();
  }, [scrollProgress]);

  return (
    <Scene3D
      scrollProgress={progress}
      onPlanetHover={onPlanetHover}
      onPlanetSelect={onPlanetSelect}
      mousePosition={mousePosition}
    />
  );
}

function HeroSection({ mousePosition, onBeginExploration }: { mousePosition: { x: number; y: number }; onBeginExploration: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section" id="hero" ref={containerRef}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(0,245,255,0.1) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        className="text-center z-10 px-4 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span className="text-cyan font-mono text-sm tracking-wider">SYSTEM ONLINE</span>
        </motion.div>

        <motion.p
          className="text-cyan/80 font-mono tracking-[0.4em] uppercase mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Techfest IIT Bombay Presents
        </motion.p>

        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-wider"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 100 }}
        >
          <span className="block gradient-text">NEXUS</span>
          <motion.span
            className="block text-4xl md:text-5xl lg:text-6xl mt-2 font-light tracking-[0.3em] text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            2050
          </motion.span>
        </motion.h1>

        <motion.div
          className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-cyan to-transparent mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        />

        <motion.p
          className="text-xl md:text-3xl text-white/60 max-w-xl mx-auto mb-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Journey Beyond Innovation
        </motion.p>

        <motion.button
          className="cyber-button group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBeginExploration}
        >
          <span className="relative z-10 flex items-center gap-2">
            Begin Exploration
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <motion.div
            className="absolute inset-0 bg-cyan/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-cyan/50 text-xs font-mono tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-6 h-10 border-2 border-cyan/40 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-cyan rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function InnovationSection({ hoveredPlanet, onPlanetSelect }: { hoveredPlanet: PlanetData | null; onPlanetSelect: (planet: PlanetData) => void }) {
  return (
    <section className="section" id="innovation">
      <motion.div
        className="text-center z-10 mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan/30 text-cyan/70 text-xs font-mono tracking-widest"
        >
          SECTION 01
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Innovation</span>
          <span className="text-white/80 block md:inline md:ml-4">Galaxy</span>
        </h2>

        <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
          Navigate through the pillars of tomorrow.
          <span className="block mt-2 text-cyan/60 text-sm font-mono">Click on planets to explore each domain</span>
        </p>
      </motion.div>

      {/* Hover info panel */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            className="planet-panel glass-strong active"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${hoveredPlanet.color}20, transparent)`,
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div className="hud-corner hud-corner-tl" style={{ borderColor: hoveredPlanet.color }} />
            <div className="hud-corner hud-corner-tr" style={{ borderColor: hoveredPlanet.color }} />
            <div className="hud-corner hud-corner-bl" style={{ borderColor: hoveredPlanet.color }} />
            <div className="hud-corner hud-corner-br" style={{ borderColor: hoveredPlanet.color }} />

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredPlanet.color, boxShadow: `0 0 10px ${hoveredPlanet.color}` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-mono tracking-wider" style={{ color: hoveredPlanet.color }}>
                SYSTEM DETECTED
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-4" style={{ color: hoveredPlanet.color }}>
              {hoveredPlanet.name}
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              {hoveredPlanet.info}
            </p>

            <motion.button
              className="w-full text-sm px-4 py-3 rounded-lg glass flex items-center justify-center gap-2"
              style={{ color: hoveredPlanet.color, borderColor: `${hoveredPlanet.color}40` }}
              whileHover={{ scale: 1.02, backgroundColor: `${hoveredPlanet.color}10` }}
              onClick={() => onPlanetSelect(hoveredPlanet)}
            >
              Explore System
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CampusSection() {
  const buildings = [
    { name: 'AI Research Tower', icon: 'AI', color: '#00f5ff', desc: 'Neural network development' },
    { name: 'Robotics Arena', icon: 'RB', color: '#a855f7', desc: 'Humanoid robot testing' },
    { name: 'Startup Launch Hub', icon: 'ST', color: '#3b82f6', desc: 'Innovation incubation' },
    { name: 'Innovation Center', icon: 'IC', color: '#22c55e', desc: 'Research facilities' },
    { name: 'Space Lab', icon: 'SL', color: '#eab308', desc: 'Orbital systems design' },
  ];

  return (
    <section className="section" id="campus">
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1 rounded-full border border-purple/30 text-purple/70 text-xs font-mono tracking-widest"
        >
          SECTION 02
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-white/80">Future</span>
          <span className="gradient-text ml-4">Campus</span>
        </h2>

        <p className="text-white/50 max-w-2xl mx-auto text-lg mb-16 leading-relaxed">
          A holographic vision of tomorrow's research facilities.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {buildings.map((building, idx) => (
            <motion.div
              key={building.name}
              className="glass px-8 py-6 rounded-xl relative overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${building.color}10, transparent)`,
                }}
              />
              <div
                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-xl font-bold"
                style={{
                  backgroundColor: `${building.color}20`,
                  color: building.color,
                  borderColor: `${building.color}40`,
                  border: '1px solid',
                }}
              >
                {building.icon}
              </div>
              <p className="text-white/80 font-medium relative z-10">{building.name}</p>
              <p className="text-white/40 text-xs mt-1">{building.desc}</p>
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-2" style={{ backgroundColor: building.color }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AISection() {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    'Welcome, Innovator.',
    'Future systems online.',
    'Exploring human evolution...',
    'Quantum cores synchronized.',
    'Neural pathways active.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section" id="ai">
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan/30 text-cyan/70 text-xs font-mono tracking-widest"
        >
          SECTION 03
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">AI Companion</span>
        </h2>

        <motion.p
          className="text-white/50 max-w-2xl mx-auto text-lg mb-8 leading-relaxed"
        >
          Your digital guide through the nexus. Move your cursor to interact.
        </motion.p>

        <motion.div
          className="mt-8 glass-strong p-8 rounded-xl inline-block relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Animated scan line */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent, rgba(0,245,255,0.05), transparent)',
              backgroundSize: '100% 4px',
            }}
            animate={{ y: [-20, 20] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-4 h-4 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ boxShadow: '0 0 10px #22c55e' }}
              />
              <div className="text-left">
                <span className="text-cyan font-mono text-sm block">AI STATUS</span>
                <span className="text-green-400 text-xs">ONLINE</span>
              </div>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div className="text-left">
              <span className="text-white/60 font-mono text-xs block">MESSAGE</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={messageIndex}
                  className="text-cyan font-mono text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {messages[messageIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="text-cyan/50 text-sm font-mono mt-6"
        >
          Move your cursor to interact with the 3D companion
        </motion.p>
      </motion.div>
    </section>
  );
}

function TimelineSection() {
  const timelineData = [
    { year: '1998', title: 'Techfest Begins', desc: 'The first edition marks the birth of innovation culture' },
    { year: '2005', title: 'Digital Era', desc: 'Embracing technology transformation across industries' },
    { year: '2015', title: 'Smart Evolution', desc: 'AI and automation reshape human possibilities' },
    { year: '2026', title: '30th Edition', desc: 'Three decades of pioneering innovation excellence' },
    { year: '2035', title: 'AI Revolution', desc: 'Artificial intelligence becomes integral to human life' },
    { year: '2050', title: 'Future Era', desc: 'The next frontier of human-machine synergy' },
  ];

  return (
    <section className="section" id="timeline">
      <motion.div
        className="text-center z-10 w-full max-w-6xl mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1 rounded-full border border-purple/30 text-purple/70 text-xs font-mono tracking-widest"
        >
          SECTION 04
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold mb-16">
          <span className="text-white/80">Timeline</span>
          <span className="gradient-text ml-4">Tunnel</span>
        </h2>

        <div className="relative">
          {/* Animated central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            <div className="h-full bg-gradient-to-b from-cyan via-purple to-cyan opacity-30" />
            <motion.div
              className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyan to-transparent"
              animate={{ y: [0, 100, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ opacity: 0.5 }}
            />
          </div>

          {timelineData.map((item, idx) => (
            <motion.div
              key={item.year}
              className={`relative flex items-center gap-8 mb-20 ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <div className={`flex-1 ${idx % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                <motion.span
                  className="text-6xl md:text-8xl font-black"
                  style={{
                    WebkitTextStroke: '1px rgba(0, 245, 255, 0.3)',
                    color: 'transparent',
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {item.year}
                </motion.span>
                <h4 className="text-xl md:text-2xl font-semibold text-white mt-2">{item.title}</h4>
                <p className="text-white/50 mt-2">{item.desc}</p>
              </div>

              {/* Center node */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className="w-5 h-5 rounded-full bg-dark border-2 border-cyan"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(0, 245, 255, 0.4)',
                      '0 0 0 15px rgba(0, 245, 255, 0)',
                      '0 0 0 0 rgba(0, 245, 255, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function PortalSection({
  mousePosition,
  onActivate,
  portalActivated,
}: {
  mousePosition: { x: number; y: number };
  onActivate: () => void;
  portalActivated: boolean;
}) {
  return (
    <section className="section" id="portal">
      <motion.div
        className="text-center z-10 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan/30 text-cyan/70 text-xs font-mono tracking-widest"
        >
          FINAL DESTINATION
        </motion.div>

        <motion.h2
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 relative"
          animate={{
            textShadow: [
              '0 0 20px rgba(0, 245, 255, 0.3)',
              '0 0 40px rgba(168, 85, 247, 0.4)',
              '0 0 20px rgba(0, 245, 255, 0.3)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="gradient-text">THE FUTURE</span>
          <br />
          <span className="text-white/90">STARTS HERE</span>
        </motion.h2>

        <motion.p
          className="text-white/50 text-xl mb-12 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {portalActivated
            ? 'Welcome to the future. The portal is now active.'
            : 'Step through the portal. Join the next chapter of human innovation at Techfest NEXUS 2050.'}
        </motion.p>

        <motion.button
          className="cyber-button text-lg px-12 py-5 relative overflow-hidden group"
          whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(0, 245, 255, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onActivate}
          disabled={portalActivated}
          style={{ opacity: portalActivated ? 0.6 : 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative z-10 flex items-center gap-3">
            {portalActivated ? 'FUTURE ACTIVATED' : 'ACTIVATE FUTURE'}
            {!portalActivated && (
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </span>
        </motion.button>

        {/* Footer */}
        <motion.div
          className="mt-24 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/30 text-sm font-mono">
            Techfest IIT Bombay &copy; 2026
          </p>
          <p className="text-cyan/40 text-xs font-mono mt-2">
            NEXUS 2050 // INNOVATION SYSTEMS ACTIVE
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ScrollIndicator({ scrollProgress }: { scrollProgress: any }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress?.on?.('change', (v: number) => setProgress(v));
    return () => unsubscribe?.();
  }, [scrollProgress]);

  return (
    <motion.div
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3 }}
    >
      <span className="text-cyan/50 text-xs font-mono mb-2" style={{ writingMode: 'vertical-rl' }}>
        EXPLORE
      </span>
      <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="w-full rounded-full"
          style={{
            background: 'linear-gradient(to bottom, #00f5ff, #a855f7)',
            height: `${progress * 100}%`,
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan"
          style={{
            top: `${progress * 100}%`,
            boxShadow: '0 0 10px #00f5ff',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <span className="text-cyan font-mono text-xs mt-2">
        {Math.round(progress * 100)}%
      </span>
    </motion.div>
  );
}
