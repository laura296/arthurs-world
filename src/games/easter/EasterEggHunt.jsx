import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GardenScene from '../../components/scenes/GardenScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Easter Egg Hunt — tap colourful eggs hidden around a spring meadow.
 * Each egg wobbles, cracks open, and reveals a surprise inside.
 * Endlessly replayable; celebration every 10 eggs, Arthur peek every 5.
 */

const PASTEL_COLOURS = [
  { fill: '#f9a8d4', stroke: '#f472b6', name: 'pink' },
  { fill: '#c4b5fd', stroke: '#a78bfa', name: 'lavender' },
  { fill: '#86efac', stroke: '#4ade80', name: 'mint' },
  { fill: '#fde68a', stroke: '#fbbf24', name: 'yellow' },
  { fill: '#93c5fd', stroke: '#60a5fa', name: 'blue' },
];

const PATTERNS = ['spots', 'stripes', 'zigzag'];

const SURPRISES = ['🐥', '🐰', '⭐', '🌸', '🍫', '🎀'];

const EGG_POSITIONS = [
  { x: 8, y: 55 }, { x: 25, y: 62 }, { x: 45, y: 50 },
  { x: 65, y: 58 }, { x: 82, y: 52 }, { x: 15, y: 72 },
  { x: 55, y: 70 }, { x: 75, y: 68 },
];

let eggIdCounter = 0;

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeEgg(posIndex) {
  const pos = EGG_POSITIONS[posIndex];
  const jitterX = (Math.random() - 0.5) * 6;
  const jitterY = (Math.random() - 0.5) * 4;
  return {
    id: ++eggIdCounter,
    posIndex,
    x: pos.x + jitterX,
    y: pos.y + jitterY,
    colour: randomItem(PASTEL_COLOURS),
    pattern: randomItem(PATTERNS),
    surprise: randomItem(SURPRISES),
    bobDelay: Math.random() * 2,
    state: 'idle', // idle | wobble | crack | gone
  };
}

function makeInitialEggs() {
  return EGG_POSITIONS.map((_, i) => makeEgg(i));
}

/** Inline SVG egg with pattern overlay */
function EggShape({ colour, pattern, size = 70 }) {
  const w = size * 0.7;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 50 70" className="drop-shadow-lg">
      <defs>
        <clipPath id={`egg-clip-${colour.name}-${pattern}`}>
          <ellipse cx="25" cy="38" rx="22" ry="30" />
        </clipPath>
      </defs>
      {/* Shadow */}
      <ellipse cx="25" cy="65" rx="18" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* Egg body */}
      <ellipse cx="25" cy="38" rx="22" ry="30" fill={colour.fill} stroke={colour.stroke} strokeWidth="1.5" />
      {/* Pattern overlay */}
      <g clipPath={`url(#egg-clip-${colour.name}-${pattern})`} opacity="0.4">
        {pattern === 'spots' && (
          <>
            <circle cx="15" cy="28" r="4" fill={colour.stroke} />
            <circle cx="33" cy="32" r="3.5" fill={colour.stroke} />
            <circle cx="22" cy="45" r="4" fill={colour.stroke} />
            <circle cx="30" cy="50" r="3" fill={colour.stroke} />
            <circle cx="18" cy="55" r="3.5" fill={colour.stroke} />
          </>
        )}
        {pattern === 'stripes' && (
          <>
            <rect x="0" y="22" width="50" height="4" fill={colour.stroke} />
            <rect x="0" y="34" width="50" height="4" fill={colour.stroke} />
            <rect x="0" y="46" width="50" height="4" fill={colour.stroke} />
          </>
        )}
        {pattern === 'zigzag' && (
          <polyline
            points="3,25 12,18 22,25 32,18 42,25 47,20"
            fill="none"
            stroke={colour.stroke}
            strokeWidth="3"
          />
        )}
      </g>
      {/* Shine highlight */}
      <ellipse cx="18" cy="26" rx="6" ry="10" fill="white" opacity="0.3" />
    </svg>
  );
}

/** Cracked shell halves */
function CrackedEgg({ colour }) {
  return (
    <div className="flex gap-1">
      <svg width="25" height="40" viewBox="0 0 25 40">
        <path d="M23,38 Q3,38 3,18 Q3,2 15,2 L25,20 Z" fill={colour.fill} stroke={colour.stroke} strokeWidth="1" />
      </svg>
      <svg width="25" height="40" viewBox="0 0 25 40">
        <path d="M2,38 Q22,38 22,18 Q22,2 10,2 L0,20 Z" fill={colour.fill} stroke={colour.stroke} strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function EasterEggHunt() {
  const [eggs, setEggs] = useState(makeInitialEggs);
  const [score, setScore] = useState(0);
  const [reveals, setReveals] = useState([]);
  const scoreRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const revealIdRef = useRef(0);

  const handleTapEgg = useCallback((egg, e) => {
    if (egg.state !== 'idle') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Start wobble
    playBoing();
    setEggs(prev => prev.map(eg =>
      eg.id === egg.id ? { ...eg, state: 'wobble' } : eg
    ));

    // After wobble, crack open
    setTimeout(() => {
      playPop();
      playSparkle();
      burst(cx, cy, {
        colors: [egg.colour.fill, egg.colour.stroke, '#facc15', '#fff'],
        shapes: ['star', 'circle'],
        count: 12,
      });

      setEggs(prev => prev.map(eg =>
        eg.id === egg.id ? { ...eg, state: 'crack' } : eg
      ));

      // Show surprise
      const revealId = ++revealIdRef.current;
      setReveals(prev => [...prev, {
        id: revealId,
        emoji: egg.surprise,
        x: cx,
        y: cy,
      }]);

      // Remove reveal after animation
      setTimeout(() => {
        setReveals(prev => prev.filter(r => r.id !== revealId));
      }, 1200);

      // Update score
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
      playCollectPing();

      // Arthur peek every 5
      if (newScore % 5 === 0 && newScore % 10 !== 0) {
        peek('excited');
        playSuccess();
      }

      // Celebration every 10
      if (newScore % 10 === 0) {
        setTimeout(() => {
          celebrate({ colors: ['#facc15', '#f9a8d4', '#86efac', '#c4b5fd'] });
          playCelebrate();
        }, 400);
      }

      // Remove egg and respawn
      setTimeout(() => {
        setEggs(prev => {
          const without = prev.filter(eg => eg.id !== egg.id);
          return [...without, makeEgg(egg.posIndex)];
        });
      }, 800);
    }, 500);
  }, [burst, peek, celebrate]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ touchAction: 'manipulation' }}>
      {/* Background */}
      <GardenScene />

      {/* Semi-transparent spring overlay for lighter feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/20 via-transparent to-green-200/20 pointer-events-none" />

      {/* Back button */}
      <BackButton />

      {/* Score badge */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <span className="text-3xl">🥚</span>
        <span className="text-2xl font-heading text-aw-amber font-bold">{score}</span>
      </div>

      {/* Eggs */}
      <AnimatePresence>
        {eggs.map(egg => (
          <motion.div
            key={egg.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${egg.x}%`,
              top: `${egg.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onPointerDown={(e) => handleTapEgg(egg, e)}
          >
            {egg.state === 'idle' && (
              <div
                className="animate-bounce-gentle"
                style={{ animationDelay: `${egg.bobDelay}s` }}
              >
                <EggShape colour={egg.colour} pattern={egg.pattern} />
              </div>
            )}

            {egg.state === 'wobble' && (
              <div className="animate-egg-wobble">
                <EggShape colour={egg.colour} pattern={egg.pattern} />
              </div>
            )}

            {egg.state === 'crack' && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CrackedEgg colour={egg.colour} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Surprise reveals */}
      <AnimatePresence>
        {reveals.map(reveal => (
          <motion.div
            key={reveal.id}
            className="fixed z-40 pointer-events-none text-6xl"
            style={{ left: reveal.x, top: reveal.y, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1.4, y: -80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 12,
              opacity: { duration: 1, ease: 'easeOut' },
            }}
          >
            {reveal.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative grass tufts near eggs */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        {[10, 28, 48, 68, 80].map((x, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ left: `${x}%`, bottom: `${22 + (i % 3) * 4}%` }}
            width="60" height="40" viewBox="0 0 60 40"
          >
            <path d="M10,40 Q15,10 20,40" fill="#4ade80" opacity="0.7" />
            <path d="M25,40 Q30,5 35,40" fill="#22c55e" opacity="0.8" />
            <path d="M38,40 Q43,12 48,40" fill="#4ade80" opacity="0.7" />
          </svg>
        ))}
      </div>

      {/* Particle + overlay layers */}
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      {/* Inline keyframes for egg animations */}
      <style>{`
        @keyframes egg-wobble {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-12deg); }
          30% { transform: rotate(10deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(6deg); }
          75% { transform: rotate(-3deg); }
          90% { transform: rotate(1deg); }
        }
        .animate-egg-wobble {
          animation: egg-wobble 0.5s ease-in-out;
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
