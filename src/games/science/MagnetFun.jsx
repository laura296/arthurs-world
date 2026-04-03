import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playBoing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useCelebration } from '../../components/CelebrationOverlay';

/*
  Magnet game — tap the magnet, then tap objects to see if they stick!
  Magnetic items zoom to the magnet. Non-magnetic items wobble and stay.
*/
const ITEMS = [
  // Magnetic
  { id: 'key',      emoji: '🔑', magnetic: true },
  { id: 'paperclip',emoji: '📎', magnetic: true },
  { id: 'scissors', emoji: '✂️', magnetic: true },
  { id: 'nail',     emoji: '🪛', magnetic: true },
  { id: 'coin',     emoji: '🪙', magnetic: true },
  { id: 'bell',     emoji: '🔔', magnetic: true },
  // Not magnetic
  { id: 'apple',    emoji: '🍎', magnetic: false },
  { id: 'teddy',    emoji: '🧸', magnetic: false },
  { id: 'rubber',   emoji: '🪀', magnetic: false },
  { id: 'ball',     emoji: '⚽', magnetic: false },
  { id: 'sock',     emoji: '🧦', magnetic: false },
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
  // 2 magnetic + 2 non-magnetic
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
  const { celebrate, CelebrationLayer } = useCelebration();

  const allTested = testedIds.size >= items.length;

  const handleTap = useCallback((item) => {
    if (testedIds.has(item.id)) return;

    const newTested = new Set(testedIds);
    newTested.add(item.id);
    setTestedIds(newTested);

    if (item.magnetic) {
      // Sticks to magnet!
      playSparkle();
      playSuccess();
      setStuckItems(prev => [...prev, item]);
      burst(window.innerWidth / 2, window.innerHeight * 0.25, {
        count: 10, spread: 60,
        colors: ['#ef4444', '#6b7280', '#facc15'],
        shapes: ['star', 'circle'],
      });
    } else {
      // Doesn't stick — wobble
      playBoing();
      setWobbleId(item.id);
      setTimeout(() => setWobbleId(null), 500);
    }

    // Check if all tested
    if (newTested.size >= items.length) {
      setTimeout(() => {
        celebrate();
      }, 800);
    }
  }, [testedIds, items, burst, celebrate]);

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

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4">
        {/* Magnet */}
        <div className="relative">
          <motion.div
            className="text-8xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            🧲
          </motion.div>

          {/* Items stuck to magnet */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <AnimatePresence>
              {stuckItems.map((item, i) => (
                <motion.span
                  key={item.id}
                  className="text-3xl"
                  initial={{ scale: 0, y: 80 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Items to test */}
        <div className="flex gap-5 flex-wrap justify-center max-w-md">
          {items.map((item, i) => {
            const tested = testedIds.has(item.id);
            const stuck = stuckItems.some(s => s.id === item.id);
            if (stuck) return null; // Moved to magnet

            return (
              <motion.button
                key={item.id}
                onPointerDown={() => handleTap(item)}
                className={`w-24 h-24 rounded-3xl flex items-center justify-center
                           border-4 active:scale-90 transition-all
                           ${tested && !item.magnetic
                             ? 'bg-gray-100 border-gray-300 opacity-50'
                             : 'bg-white/80 border-amber-200/60 shadow-lg'}
                           ${wobbleId === item.id ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: i * 0.1 }}
                style={{ touchAction: 'none' }}
                disabled={tested}
              >
                <span className="text-5xl">{item.emoji}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tested non-magnetic items shown greyed out with ❌ */}
        {testedIds.size > 0 && (
          <div className="flex gap-2">
            {items.filter(i => testedIds.has(i.id) && !i.magnetic).map(item => (
              <span key={item.id} className="text-2xl opacity-40">{item.emoji}</span>
            ))}
          </div>
        )}

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
      <CelebrationLayer />
    </div>
  );
}
