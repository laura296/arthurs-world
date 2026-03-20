import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playBoing, playPop, playSuccess, playSparkle, playCelebrate } from '../../hooks/useSound';

/**
 * Balloon Keep-Up — tap balloons to keep them floating.
 * Gentle, chill game. No fail state — balloons just drift back up when tapped.
 * New balloons appear over time. Celebration every 15 taps.
 */

const BALLOON_COLOURS = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#f9a8d4',
];

let balloonId = 0;

function makeBalloon(w, h) {
  const colour = BALLOON_COLOURS[Math.floor(Math.random() * BALLOON_COLOURS.length)];
  const size = 60 + Math.random() * 30;
  return {
    id: ++balloonId,
    x: 10 + Math.random() * 80, // % from left
    y: 20 + Math.random() * 50, // % from top
    colour,
    size,
    fallSpeed: 0.02 + Math.random() * 0.03, // % per frame
    wobblePhase: Math.random() * Math.PI * 2,
    popped: false,
  };
}

/* ---- Inline SVG Balloon ---- */
function BalloonSVG({ colour, size }) {
  const lighter = colour + 'cc';
  return (
    <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
      {/* String */}
      <path d="M30 62 Q28 70 30 78 Q32 70 30 62" stroke="#999" strokeWidth="1" fill="none" />
      {/* Balloon body */}
      <ellipse cx="30" cy="32" rx="24" ry="30" fill={colour} />
      {/* Knot */}
      <polygon points="27,60 30,64 33,60" fill={colour} />
      {/* Shine highlight */}
      <ellipse cx="20" cy="22" rx="7" ry="10" fill="white" opacity="0.35" />
      <ellipse cx="18" cy="18" rx="3" ry="5" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function BalloonKeepUp() {
  const [balloons, setBalloons] = useState(() => {
    return Array.from({ length: 5 }, () => makeBalloon(100, 100));
  });
  const [taps, setTaps] = useState(0);
  const tapsRef = useRef(0);
  const rafRef = useRef(null);

  const { burst, Bursts } = useParticleBurst();
  const { peek, Peeks } = useArthurPeek();
  const { celebrate, Overlay } = useCelebration();

  // Slowly add balloons over time (max 8)
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length >= 8) return prev;
        return [...prev, makeBalloon(100, 100)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Gravity — balloons drift down slowly
  useEffect(() => {
    const animate = () => {
      setBalloons(prev => prev.map(b => {
        if (b.popped) return b;
        let newY = b.y + b.fallSpeed;
        // If balloon goes below screen, reset it to top
        if (newY > 95) {
          newY = -10;
          return { ...b, y: newY, x: 10 + Math.random() * 80 };
        }
        // Gentle wobble
        const wobble = Math.sin(Date.now() * 0.001 + b.wobblePhase) * 0.08;
        return { ...b, y: newY, x: b.x + wobble };
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleTap = useCallback((e, balloon) => {
    e.stopPropagation();
    playBoing();

    // Bounce it up
    setBalloons(prev => prev.map(b => {
      if (b.id !== balloon.id) return b;
      const bounceUp = 15 + Math.random() * 15;
      const newY = Math.max(-5, b.y - bounceUp);
      // Slight random horizontal drift
      const newX = Math.min(90, Math.max(10, b.x + (Math.random() - 0.5) * 15));
      return { ...b, y: newY, x: newX };
    }));

    // Particle burst at tap point
    const box = e.currentTarget.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, {
      colors: [balloon.colour, '#facc15', '#fff'],
      count: 8,
      spread: 35,
      shapes: ['star', 'circle'],
    });

    tapsRef.current++;
    setTaps(tapsRef.current);

    if (tapsRef.current > 0 && tapsRef.current % 15 === 0) {
      setTimeout(() => {
        playCelebrate();
        celebrate({ colors: ['#ef4444', '#facc15', '#38bdf8', '#22c55e', '#ec4899'] });
      }, 200);
    } else if (tapsRef.current > 0 && tapsRef.current % 5 === 0) {
      setTimeout(() => {
        playSuccess();
        peek('excited');
      }, 100);
    }
  }, [burst, celebrate, peek]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      {/* Fluffy clouds */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="150" cy="80" rx="100" ry="40" fill="white" opacity="0.6" />
        <ellipse cx="200" cy="70" rx="80" ry="35" fill="white" opacity="0.7" />
        <ellipse cx="600" cy="120" rx="120" ry="45" fill="white" opacity="0.5" />
        <ellipse cx="650" cy="110" rx="90" ry="35" fill="white" opacity="0.6" />
        <ellipse cx="400" cy="180" rx="80" ry="30" fill="white" opacity="0.4" />
      </svg>

      {/* Sun */}
      <div className="absolute top-6 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 shadow-lg"
           style={{ boxShadow: '0 0 40px rgba(250,204,21,0.4), 0 0 80px rgba(250,204,21,0.2)' }} />

      {/* Balloons */}
      <AnimatePresence>
        {balloons.map(b => (
          <motion.button
            key={b.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
            }}
            onPointerDown={(e) => handleTap(e, b)}
            whileTap={{ scale: 1.2 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <BalloonSVG colour={b.colour} size={b.size} />
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Score */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <svg viewBox="0 0 60 80" width={24} height={32}>
          <ellipse cx="30" cy="32" rx="24" ry="30" fill="#ef4444" />
          <ellipse cx="20" cy="22" rx="7" ry="10" fill="white" opacity="0.35" />
        </svg>
        <motion.span
          key={taps}
          className="text-2xl font-heading font-bold text-sky-600"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {taps}
        </motion.span>
      </div>

      {/* Tap hint on first load */}
      {taps === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
            <span className="text-3xl">👆</span>
            <svg viewBox="0 0 60 80" width={32} height={42}>
              <ellipse cx="30" cy="32" rx="24" ry="30" fill="#ef4444" />
              <ellipse cx="20" cy="22" rx="7" ry="10" fill="white" opacity="0.35" />
            </svg>
          </div>
        </motion.div>
      )}

      <BackButton />
      <Bursts />
      <Peeks />
      <Overlay />
    </div>
  );
}
