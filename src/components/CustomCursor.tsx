import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trailPositions, setTrailPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null);
  const targetPositionRef = useRef({ x: 0, y: 0 });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check if device supports hover (desktop)
  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    setIsVisible(hasHover);
  }, []);

  useEffect(() => {
    let idCounter = 0;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      // Magnetic effect for buttons and interactive elements
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 100) {
          const strength = (100 - dist) / 100;
          targetX = e.clientX - distX * strength * 0.3;
          targetY = e.clientY - distY * strength * 0.3;
        }
      }

      cursorX.set(targetX);
      cursorY.set(targetY);

      // Add trail particles based on movement
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 5) {
        idCounter++;
        const newTrail = { x: e.clientX, y: e.clientY, id: idCounter };
        setTrailPositions(prev => [...prev.slice(-20), newTrail]);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [data-cursor]');
      if (interactive) {
        setIsHovering(true);
        setMagneticTarget(interactive as HTMLElement);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [data-cursor]');
      if (interactive) {
        setIsHovering(false);
        setMagneticTarget(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, magneticTarget]);

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailPositions(prev => prev.slice(-20));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Don't render custom cursor on touch devices
  if (!isVisible) return null;

  return (
    <>
      {/* Trail particles */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={pos.id}
          className="fixed pointer-events-none z-[9998] rounded-full"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.4 }}
          style={{
            left: pos.x,
            top: pos.y,
            width: isHovering ? 10 : 6,
            height: isHovering ? 10 : 6,
            background: isHovering
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 245, 255, 0.6) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          width: isHovering ? 60 : isClicking ? 24 : 40,
          height: isHovering ? 60 : isClicking ? 24 : 40,
          border: `2px solid ${isHovering ? '#a855f7' : '#00f5ff'}`,
          backgroundColor: isClicking ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
          transform: 'translate(-50%, -50%)',
          boxShadow: isHovering
            ? '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)'
            : '0 0 15px rgba(0, 245, 255, 0.3)',
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          width: isHovering ? 20 : isClicking ? 6 : 10,
          height: isHovering ? 20 : isClicking ? 6 : 10,
          background: `radial-gradient(circle, ${isHovering ? '#a855f7' : '#00f5ff'} 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: isHovering ? '0 0 20px #a855f7' : '0 0 15px #00f5ff',
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Scanning arc when hovering */}
      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-[9998] rounded-full border border-purple/30"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            width: 80,
            height: 80,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </>
  );
}
