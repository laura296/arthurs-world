import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playBoing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/*
  Items are visually grouped:
  - Magnetic: metallic-looking items (silver/grey border glow)
  - Non-magnetic: organic/soft items (no glow)
  This teaches the child the visual pattern before they understand the concept.
*/
const ITEMS = [
  // Magnetic — metallic things
  { id: 'key',      emoji: '🔑', magnetic: true },
  { id: 'paperclip',emoji: '📎', magnetic: true },
  { id: 'scissors', emoji: '✂️', magnetic: true },
  { id: 'coin',     emoji: '🪙', magnetic: true },
  { id: 'bell',     emoji: '🔔', magnetic: true },
  { id: 'wrench',   emoji: '🔧', magnetic: true },
  // Non-magnetic — soft/organic things
  { id: 'apple',    emoji: '🍎', magnetic: false },
  { id: 'teddy',    emoji: '🧸', magnetic: false },
  { id: 'ball',     emoji: '⚽', magnetic: false },
  { id: 'flower',   emoji: '🌸', magnetic: false },
  { id: 'feather',  emoji: '🪶', magnetic: false },
  { id: 'leaf',     emoji: '🍃', magnetic: false },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound() {
  const magnetic = shuffle(ITEMS.filter(i => i.magnetic)).slice(0, 2);
  const nonMagnetic = shuffle(ITEMS.filter(i => !i.magnetic)).slice(0, 2);
  return shuffle([...magnetic, ...nonMagnetic]);
}

export default function MagnetFun() {
  const [items, setItems] = useState(() => pickRound());
  const [stuckItems, setStuckItems] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const [testedIds, setTestedIds] = useState(new Set());
  const [roundNum, setRoundNum] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const allTested = testedIds.size >= items.length;

  const handleTap = useCallback((item) => {
    if (testedIds.has(item.id)) return;

    const newTested = new Set(testedIds);
    newTested.add(item.id);
    setTestedIds(newTested);

    if (item.magnetic) {
      playSparkle();
      playSuccess();
      setStuckItems(prev => [...prev, item]);
      burst(window.innerWidth / 2, window.innerHeight * 0.2, {
        count: 10, spread: 60,
        colors: ['#ef4444', '#6b7280', '#facc15'],
        shapes: ['star', 'circle'],
      });
      peek('happy');
    } else {
      playBoing();
      setWobbleId(item.id);
      setTimeout(() => setWobbleId(null), 500);
    }

    if (newTested.size >= items.length) {
      setTimeout(() => { celebrate(); peek('excited'); }, 800);
    }
  }, [testedIds, items, burst, celebrate, peek]);

  const handleNextRound = useCallback(() => {
    setItems(pickRound());
    setStuckItems([]);
    setTestedIds(new Set());
    setWobbleId(null);
    setRoundNum(r => r + 1);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' }}>
      <BackButton variant="dark" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-4">
        {/* Magnet with stuck items */}
        <div className="relative flex flex-col items-center">
          <motion.div
            className="text-8xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            🧲
          </motion.div>

          {/* Items stuck to magnet */}
          <div className="flex gap-2 mt-1 min-h-[48px]">
            <AnimatePresence>
              {stuckItems.map(item => (
                <motion.span
                  key={item.id}
                  className="text-4xl"
                  initial={{ scale: 0, y: 60 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Items to test — bigger buttons with visual metallic/soft cue */}
        <div className="flex gap-5 flex-wrap justify-center max-w-md">
          {items.map((item, i) => {
            const tested = testedIds.has(item.id);
            const stuck = stuckItems.some(s => s.id === item.id);
            if (stuck) return null;

            return (
              <motion.button
                key={item.id}
                onPointerDown={() => handleTap(item)}
                className={`rounded-3xl flex items-center justify-center
                           border-4 active:scale-90 transition-all
                           ${tested
                             ? 'bg-gray-100 border-gray-300 opacity-40'
                             : item.magnetic
                               ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 shadow-lg'
                               : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-md'}
                           ${wobbleId === item.id ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: i * 0.1 }}
                style={{
                  touchAction: 'none',
                  width: 110, height: 110,
                  boxShadow: !tested && item.magnetic
                    ? '0 4px 16px rgba(107,114,128,0.3), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : undefined,
                }}
                disabled={tested}
              >
                <span className="text-5xl">{item.emoji}</span>
                {/* Subtle metallic sparkle on magnetic items */}
                {item.magnetic && !tested && (
                  <span className="absolute top-1 right-1 text-sm opacity-60">✨</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Next round */}
        {allTested && (
          <motion.button
            onPointerDown={handleNextRound}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-sky-400 to-blue-500
                       flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1 }}
          >
            <span className="text-3xl">🔄</span>
          </motion.button>
        )}

        {/* Round stars */}
        {roundNum > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(roundNum, 5) }).map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
