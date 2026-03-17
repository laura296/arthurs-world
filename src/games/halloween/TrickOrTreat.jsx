import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightSkyScene from '../../components/scenes/NightSkyScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Trick or Treat — tap on friendly doors to collect candy.
 * Each door opens with a surprise treat and fun animation.
 * Endlessly replayable, celebration every 10 treats.
 */

const CANDY_TYPES = ['🍬', '🍭', '🍫', '🧁', '🍪', '🍩', '🎂', '⭐'];
const DOOR_COLOURS = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

const HOUSE_POSITIONS = [
  { x: 15, y: 38 },
  { x: 45, y: 35 },
  { x: 75, y: 38 },
  { x: 30, y: 58 },
  { x: 60, y: 55 },
];

let houseId = 0;

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeHouse(posIndex) {
  return {
    id: ++houseId,
    posIndex,
    doorColour: randomItem(DOOR_COLOURS),
    candy: randomItem(CANDY_TYPES),
    opened: false,
    roofHue: Math.random() * 30 - 15, // slight colour variation
  };
}

function makeInitial() {
  return HOUSE_POSITIONS.map((_, i) => makeHouse(i));
}

/** SVG house with a tappable door */
function HouseSVG({ doorColour, opened, roofHue }) {
  return (
    <svg width={110} height={120} viewBox="0 0 110 120" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
      {/* Wall */}
      <rect x="15" y="45" width="80" height="75" rx="3" fill="#fef3c7" />
      <rect x="15" y="45" width="80" height="75" rx="3" fill="#fde68a" opacity="0.3" />

      {/* Roof */}
      <path d="M5,48 L55,8 L105,48 Z" fill={`hsl(${20 + roofHue}, 70%, 35%)`} />
      <path d="M10,48 L55,12 L100,48 Z" fill={`hsl(${20 + roofHue}, 60%, 42%)`} opacity="0.6" />

      {/* Window — left */}
      <rect x="22" y="55" width="20" height="18" rx="2" fill="#334155" />
      <rect x="22" y="55" width="20" height="18" rx="2" fill="#facc15" opacity={opened ? '0.7' : '0.15'} />
      <line x1="32" y1="55" x2="32" y2="73" stroke="#fef3c7" strokeWidth="1.5" />
      <line x1="22" y1="64" x2="42" y2="64" stroke="#fef3c7" strokeWidth="1.5" />

      {/* Window — right */}
      <rect x="68" y="55" width="20" height="18" rx="2" fill="#334155" />
      <rect x="68" y="55" width="20" height="18" rx="2" fill="#facc15" opacity={opened ? '0.7' : '0.15'} />
      <line x1="78" y1="55" x2="78" y2="73" stroke="#fef3c7" strokeWidth="1.5" />
      <line x1="68" y1="64" x2="88" y2="64" stroke="#fef3c7" strokeWidth="1.5" />

      {/* Door */}
      <rect x="40" y="80" width="30" height="40" rx="2" fill={doorColour} />
      {opened ? (
        <>
          {/* Open door — shifted perspective */}
          <rect x="40" y="80" width="30" height="40" rx="2" fill="#1e293b" />
          <rect x="40" y="80" width="10" height="40" rx="1" fill={doorColour} opacity="0.7" />
          {/* Light spilling out */}
          <rect x="50" y="82" width="18" height="36" fill="#facc15" opacity="0.3" />
        </>
      ) : (
        <>
          {/* Door knob */}
          <circle cx="63" cy="100" r="3" fill="#facc15" />
          <circle cx="63" cy="100" r="1.5" fill="#fde68a" />
        </>
      )}

      {/* Porch light */}
      <circle cx="55" cy="78" r="4" fill={opened ? '#facc15' : '#64748b'} opacity="0.8" />
      {opened && <circle cx="55" cy="78" r="8" fill="#facc15" opacity="0.2" />}
    </svg>
  );
}

export default function TrickOrTreat() {
  const [houses, setHouses] = useState(() => makeInitial());
  const [score, setScore] = useState(0);
  const [treats, setTreats] = useState([]);
  const scoreRef = useRef(0);
  const treatIdRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const handleTapHouse = useCallback((house, e) => {
    if (house.opened) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    playBoing();

    // Open the door
    setHouses(prev => prev.map(h =>
      h.id === house.id ? { ...h, opened: true } : h
    ));

    setTimeout(() => {
      playPop();
      playCollectPing();
      playSparkle();

      burst(cx, cy, {
        colors: ['#facc15', '#f97316', '#a855f7', '#ec4899', '#fff'],
        shapes: ['star', 'circle', 'heart'],
        count: 18,
        spread: 55,
      });

      // Show treat floating up
      const treatId = ++treatIdRef.current;
      setTreats(prev => [...prev, { id: treatId, emoji: house.candy, x: cx, y: cy }]);
      setTimeout(() => {
        setTreats(prev => prev.filter(t => t.id !== treatId));
      }, 1200);

      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      if (newScore % 5 === 0 && newScore % 10 !== 0) {
        peek('excited');
        playSuccess();
      }

      if (newScore % 10 === 0) {
        setTimeout(() => {
          celebrate({ colors: ['#facc15', '#f97316', '#a855f7', '#ec4899'] });
          playCelebrate();
        }, 400);
      }

      // Reset house with new candy
      setTimeout(() => {
        setHouses(prev => prev.map(h =>
          h.id === house.id ? makeHouse(house.posIndex) : h
        ));
      }, 2000);
    }, 400);
  }, [burst, peek, celebrate]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ touchAction: 'manipulation' }}>
      <NightSkyScene />

      {/* Halloween overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 via-transparent to-orange-950/30 pointer-events-none" />

      {/* Street / ground */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: '65%' }}>
        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <rect y="0" width="800" height="200" fill="#1e293b" />
          <rect y="20" width="800" height="180" fill="#334155" opacity="0.4" />
          {/* Path */}
          <rect x="200" y="0" width="400" height="200" fill="#475569" opacity="0.3" rx="8" />
        </svg>
      </div>

      {/* Spooky but cute decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {['5%', '25%', '55%', '85%'].map((x, i) => (
          <motion.div
            key={i}
            className="absolute text-lg opacity-30"
            style={{ left: x, bottom: `${8 + i * 3}%` }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            {['🎃', '🦇', '🕸️', '🎃'][i]}
          </motion.div>
        ))}
      </div>

      <BackButton />

      {/* Score — candy bag */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-violet-500/30">
        <span className="text-3xl">🍬</span>
        <span className="text-2xl font-heading text-amber-400 font-bold">{score}</span>
      </div>

      {/* Houses */}
      {houses.map(house => {
        const pos = HOUSE_POSITIONS[house.posIndex];
        return (
          <motion.div
            key={house.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onPointerDown={(e) => handleTapHouse(house, e)}
            whileTap={{ scale: 0.95 }}
          >
            <HouseSVG doorColour={house.doorColour} opened={house.opened} roofHue={house.roofHue} />
          </motion.div>
        );
      })}

      {/* Floating treat reveals */}
      <AnimatePresence>
        {treats.map(treat => (
          <motion.div
            key={treat.id}
            className="fixed z-40 pointer-events-none text-6xl"
            style={{ left: treat.x, top: treat.y, transform: 'translate(-50%, -50%)' }}
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
            {treat.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Walking character hint */}
      <motion.div
        className="absolute z-5 text-4xl pointer-events-none"
        style={{ bottom: '12%', left: '15%' }}
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        🧒
      </motion.div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
