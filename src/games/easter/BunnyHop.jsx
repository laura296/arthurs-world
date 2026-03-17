import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GardenScene from '../../components/scenes/GardenScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Bunny Hop — tap anywhere to make a bunny hop across a spring meadow
 * collecting Easter eggs. Spring creatures pop up for fun.
 * No fail states, endlessly replayable. Celebration every 10 eggs,
 * Arthur peek every 5.
 */

const PASTEL_COLOURS = [
  '#f9a8d4', '#c4b5fd', '#86efac', '#fde68a', '#93c5fd',
  '#fca5a5', '#a5f3fc', '#d9f99d',
];

const CREATURES = ['🐥', '🦋', '🐑', '🌸', '🐞'];

const GROUND_Y = 72; // % from top — bunny + eggs sit here

let eggIdCounter = 0;
let creatureIdCounter = 0;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function makeEgg(xMin = 10, xMax = 92) {
  return {
    id: ++eggIdCounter,
    x: randomBetween(xMin, xMax),
    colour: PASTEL_COLOURS[Math.floor(Math.random() * PASTEL_COLOURS.length)],
    bobDelay: Math.random() * 2,
    collected: false,
  };
}

function scatterEggs(count = 7) {
  const eggs = [];
  const spacing = 80 / count;
  for (let i = 0; i < count; i++) {
    eggs.push(makeEgg(8 + i * spacing, 8 + (i + 1) * spacing));
  }
  return eggs;
}

/* ---------- Inline SVG Bunny ---------- */
function Bunny({ squash }) {
  return (
    <svg viewBox="0 0 80 100" className="w-20 h-24 drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
      {/* Left ear */}
      <ellipse cx="26" cy="18" rx="10" ry="26" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      <ellipse cx="26" cy="18" rx="6" ry="20" fill="#fbb6ce" />
      {/* Right ear */}
      <ellipse cx="54" cy="18" rx="10" ry="26" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      <ellipse cx="54" cy="18" rx="6" ry="20" fill="#fbb6ce" />
      {/* Body */}
      <ellipse cx="40" cy="72" rx="22" ry="20" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      {/* Head */}
      <circle cx="40" cy="48" r="20" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="33" cy="45" r="3" fill="#333" />
      <circle cx="47" cy="45" r="3" fill="#333" />
      <circle cx="34" cy="44" r="1" fill="white" />
      <circle cx="48" cy="44" r="1" fill="white" />
      {/* Nose */}
      <polygon points="40,50 37,54 43,54" fill="#fbb6ce" />
      {/* Whiskers */}
      <line x1="20" y1="50" x2="33" y2="52" stroke="#ccc" strokeWidth="0.8" />
      <line x1="20" y1="54" x2="33" y2="53" stroke="#ccc" strokeWidth="0.8" />
      <line x1="47" y1="52" x2="60" y2="50" stroke="#ccc" strokeWidth="0.8" />
      <line x1="47" y1="53" x2="60" y2="54" stroke="#ccc" strokeWidth="0.8" />
      {/* Cheeks */}
      <circle cx="28" cy="52" r="4" fill="#fce4ec" opacity="0.7" />
      <circle cx="52" cy="52" r="4" fill="#fce4ec" opacity="0.7" />
      {/* Tail */}
      <circle cx="58" cy="78" r="6" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      {/* Feet */}
      <ellipse cx="28" cy="90" rx="10" ry="5" fill="white" stroke="#e5e5e5" strokeWidth="1" />
      <ellipse cx="52" cy="90" rx="10" ry="5" fill="white" stroke="#e5e5e5" strokeWidth="1" />
    </svg>
  );
}

/* ---------- Easter Egg SVG ---------- */
function EasterEgg({ colour, size = 40 }) {
  const darker = colour + '99';
  return (
    <svg viewBox="0 0 40 52" width={size} height={size * 1.3} className="drop-shadow-md">
      <ellipse cx="20" cy="28" rx="16" ry="22" fill={colour} />
      <ellipse cx="20" cy="28" rx="16" ry="22" fill="url(#egg-sheen)" />
      {/* Stripe decorations */}
      <ellipse cx="20" cy="20" rx="12" ry="3" fill={darker} opacity="0.4" />
      <ellipse cx="20" cy="32" rx="14" ry="3" fill={darker} opacity="0.3" />
      {/* Shine */}
      <ellipse cx="14" cy="18" rx="4" ry="6" fill="white" opacity="0.35" />
      <defs>
        <radialGradient id="egg-sheen" cx="0.35" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function BunnyHop() {
  const [bunnyX, setBunnyX] = useState(8);
  const [bunnyY, setBunnyY] = useState(0); // Y offset from ground (negative = up)
  const [isHopping, setIsHopping] = useState(false);
  const [eggs, setEggs] = useState(() => scatterEggs(7));
  const [score, setScore] = useState(0);
  const [creatures, setCreatures] = useState([]);
  const [squash, setSquash] = useState(false);
  const hopCount = useRef(0);
  const scoreRef = useRef(0);

  const { burst, Bursts } = useParticleBurst();
  const { peek, Peeks } = useArthurPeek();
  const { celebrate, Overlay } = useCelebration();

  // Collect nearby eggs after landing
  const collectNearbyEggs = useCallback((landX) => {
    let collected = 0;
    setEggs(prev => prev.map(egg => {
      if (egg.collected) return egg;
      const dist = Math.abs(egg.x - landX);
      if (dist < 10) {
        collected++;
        // Particle burst at egg position
        const rect = document.getElementById(`egg-${egg.id}`);
        if (rect) {
          const box = rect.getBoundingClientRect();
          burst(box.left + box.width / 2, box.top + box.height / 2, egg.colour);
        }
        playCollectPing();
        return { ...egg, collected: true };
      }
      return egg;
    }));

    if (collected > 0) {
      const newScore = scoreRef.current + collected;
      scoreRef.current = newScore;
      setScore(newScore);

      if (newScore > 0 && newScore % 10 === 0) {
        setTimeout(() => {
          playCelebrate();
          celebrate();
        }, 300);
      } else if (newScore > 0 && newScore % 5 === 0) {
        setTimeout(() => {
          playSuccess();
          peek('excited');
        }, 200);
      }
    }
  }, [burst, celebrate, peek]);

  // Maybe spawn a spring creature
  const maybeSpawnCreature = useCallback(() => {
    if (Math.random() > 0.4) return; // 40% chance
    const creature = {
      id: ++creatureIdCounter,
      emoji: CREATURES[Math.floor(Math.random() * CREATURES.length)],
      x: randomBetween(10, 85),
      y: randomBetween(30, 60),
    };
    setCreatures(prev => [...prev, creature]);
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setCreatures(prev => prev.filter(c => c.id !== creature.id));
    }, 4000);
  }, []);

  // Handle bunny hop
  const handleHop = useCallback(() => {
    if (isHopping) return;
    setIsHopping(true);
    playBoing();
    hopCount.current++;

    // Squash before hop
    setSquash(true);
    setTimeout(() => setSquash(false), 100);

    const hopDistance = randomBetween(10, 18);
    let newX = bunnyX + hopDistance;

    // Wrap around if past right edge
    if (newX > 88) {
      newX = 8;
      // Scatter new eggs when wrapping
      setEggs(scatterEggs(7));
    }

    setBunnyX(newX);

    // Arc animation: go up then come down
    setBunnyY(-25);
    setTimeout(() => {
      setBunnyY(0);
      setIsHopping(false);
      collectNearbyEggs(newX);
      maybeSpawnCreature();
    }, 450);
  }, [isHopping, bunnyX, collectNearbyEggs, maybeSpawnCreature]);

  // Tap a creature for fun
  const handleCreatureTap = useCallback((e, creature) => {
    e.stopPropagation();
    playSparkle();
    const box = e.currentTarget.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, '#fde68a');
    setCreatures(prev => prev.filter(c => c.id !== creature.id));
  }, [burst]);

  return (
    <div className="fixed inset-0 overflow-hidden" onClick={handleHop}>
      {/* Background */}
      <GardenScene />

      {/* Ground overlay — grassy strip */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ top: `${GROUND_Y + 6}%` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-green-600/40 to-transparent" />
      </div>

      {/* Eggs */}
      <AnimatePresence>
        {eggs.filter(e => !e.collected).map(egg => (
          <motion.div
            key={egg.id}
            id={`egg-${egg.id}`}
            className="absolute"
            style={{
              left: `${egg.x}%`,
              top: `${GROUND_Y}%`,
              transform: 'translateX(-50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -4, 0],
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, delay: egg.bobDelay, ease: 'easeInOut' },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
            }}
          >
            <EasterEgg colour={egg.colour} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bunny */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `${bunnyX}%`,
          top: `${GROUND_Y - 8}%`,
          transform: 'translateX(-50%)',
        }}
        animate={{
          left: `${bunnyX}%`,
          y: bunnyY,
          scaleY: squash ? 0.7 : 1,
          scaleX: squash ? 1.2 : 1,
        }}
        transition={{
          left: { type: 'spring', stiffness: 120, damping: 14 },
          y: { type: 'spring', stiffness: 200, damping: 12 },
          scaleY: { duration: 0.1 },
          scaleX: { duration: 0.1 },
        }}
      >
        <Bunny squash={squash} />
      </motion.div>

      {/* Spring creatures */}
      <AnimatePresence>
        {creatures.map(c => (
          <motion.button
            key={c.id}
            className="absolute z-10 text-4xl cursor-pointer"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            onClick={(e) => handleCreatureTap(e, c)}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: 1,
              y: [0, -8, 0],
            }}
            exit={{ scale: 0, opacity: 0, y: -30 }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
            whileTap={{ scale: 1.4 }}
          >
            {c.emoji}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Egg score — top right */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <span className="text-2xl">🥚</span>
        <motion.span
          key={score}
          className="text-2xl font-heading font-bold text-amber-600"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {score}
        </motion.span>
      </div>

      {/* Tap hint — fades away after first hop */}
      {hopCount.current === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
            <span className="text-3xl">👆</span>
            <span className="text-3xl">🐰</span>
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
