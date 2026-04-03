import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playFanfare } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/* 4 growth stages — shorter session */
const STAGES = [
  { id: 'seed',   emoji: '🫘', plant: null },
  { id: 'sprout', emoji: '🌱', plant: '🌱' },
  { id: 'leaves', emoji: '🪴', plant: '🪴' },
  { id: 'flower', emoji: '🌻', plant: '🌻' },
];

const FLOWERS = ['🌻', '🌸', '🌺', '🌷', '🌹', '💐'];

export default function GrowAPlant() {
  const [stage, setStage] = useState(0);
  const [hasSun, setHasSun] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [growing, setGrowing] = useState(false);
  const [flowerEmoji, setFlowerEmoji] = useState(() => FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
  const [gardenCount, setGardenCount] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const isComplete = stage >= STAGES.length - 1;

  const tryGrow = useCallback((newSun, newWater) => {
    if (!(newSun && newWater)) return;
    setGrowing(true);
    playSparkle();
    setTimeout(() => {
      const nextStage = stage + 1;
      setStage(nextStage);
      setHasSun(false);
      setHasWater(false);
      setGrowing(false);

      if (nextStage >= STAGES.length - 1) {
        playFanfare();
        celebrate();
        peek('excited');
        setGardenCount(g => g + 1);
      } else {
        playSuccess();
        peek('happy');
      }
    }, 800);
  }, [stage, celebrate, peek]);

  const handleSunTap = useCallback(() => {
    if (isComplete || growing || hasSun) return;
    playPop();
    setHasSun(true);
    burst(window.innerWidth * 0.3, window.innerHeight * 0.25, {
      count: 8, spread: 50, colors: ['#facc15', '#fde68a', '#f59e0b'], shapes: ['star'],
    });
    tryGrow(true, hasWater);
  }, [isComplete, growing, hasSun, hasWater, burst, tryGrow]);

  const handleWaterTap = useCallback(() => {
    if (isComplete || growing || hasWater) return;
    playPop();
    setHasWater(true);
    burst(window.innerWidth * 0.7, window.innerHeight * 0.25, {
      count: 8, spread: 50, colors: ['#38bdf8', '#7dd3fc', '#bae6fd'], shapes: ['circle'],
    });
    tryGrow(hasSun, true);
  }, [isComplete, growing, hasWater, hasSun, burst, tryGrow]);

  const handlePlayAgain = useCallback(() => {
    setStage(0);
    setHasSun(false);
    setHasWater(false);
    setGrowing(false);
    setFlowerEmoji(FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
  }, []);

  const currentPlant = STAGES[stage];

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 55%, #7BC47F 55%, #4ade80 100%)' }}>
      <BackButton />

      {/* Clouds */}
      <div className="absolute top-8 left-12 w-16 h-6 bg-white/60 rounded-full" />
      <div className="absolute top-14 left-28 w-10 h-4 bg-white/40 rounded-full" />

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-14 px-4">
        {/* Sun and water buttons with "need both" indicator */}
        <div className="flex items-center gap-6">
          <motion.button
            onPointerDown={handleSunTap}
            className="rounded-full active:scale-90 transition-transform"
            style={{
              width: 110, height: 110,
              background: 'radial-gradient(circle at 40% 40%, #fef3c7, #facc15, #f59e0b)',
              boxShadow: hasSun ? '0 0 30px #facc1580' : '0 4px 20px rgba(250,204,21,0.4)',
              touchAction: 'none',
            }}
          >
            <span className="text-5xl">{hasSun ? '✅' : '☀️'}</span>
          </motion.button>

          {/* Visual "need both" indicator between buttons */}
          <div className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-full border-3 transition-all duration-300 ${
              hasSun ? 'bg-amber-400 border-amber-500 scale-110' : 'bg-white/30 border-amber-300/50'
            }`} />
            <span className="text-lg">+</span>
            <div className={`w-6 h-6 rounded-full border-3 transition-all duration-300 ${
              hasWater ? 'bg-sky-400 border-sky-500 scale-110' : 'bg-white/30 border-sky-300/50'
            }`} />
          </div>

          <motion.button
            onPointerDown={handleWaterTap}
            className="rounded-full active:scale-90 transition-transform"
            style={{
              width: 110, height: 110,
              background: 'radial-gradient(circle at 40% 40%, #e0f2fe, #38bdf8, #0284c7)',
              boxShadow: hasWater ? '0 0 30px #38bdf880' : '0 4px 20px rgba(56,189,248,0.4)',
              touchAction: 'none',
            }}
          >
            <span className="text-5xl">{hasWater ? '✅' : '💧'}</span>
          </motion.button>
        </div>

        {/* Plant growing area */}
        <div className="relative flex flex-col items-center" style={{ minHeight: 220 }}>
          {/* Pot */}
          <div className="absolute bottom-0 w-32 h-18 rounded-b-3xl"
               style={{
                 background: 'linear-gradient(180deg, #C2703A, #A0522D)',
                 boxShadow: '0 4px 12px rgba(160,82,45,0.4)',
                 width: 128, height: 64,
               }}>
            <div className="absolute top-0 left-0 right-0 h-4 rounded-t-lg bg-amber-700" />
          </div>

          {/* Plant */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              className="absolute bottom-16 flex items-end justify-center"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <span style={{ fontSize: stage === 0 ? '3.5rem' : `${3.5 + stage * 2}rem` }}>
                {stage === STAGES.length - 1 ? flowerEmoji : currentPlant.plant || '🫘'}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Growing sparkle */}
          {growing && (
            <motion.div
              className="absolute bottom-20 text-4xl"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -40 }}
              transition={{ duration: 0.8 }}
            >
              ✨
            </motion.div>
          )}
        </div>

        {/* Progress — emoji stages */}
        <div className="flex gap-4">
          {STAGES.map((s, i) => (
            <div key={s.id}
                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                   i <= stage ? 'scale-110' : 'opacity-25 scale-75'
                 }`}>
              <span className="text-2xl">{i <= stage ? s.emoji : '·'}</span>
            </div>
          ))}
        </div>

        {/* Play again */}
        {isComplete && (
          <motion.button
            onPointerDown={handlePlayAgain}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500
                       flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1 }}
          >
            <span className="text-3xl">🔄</span>
          </motion.button>
        )}

        {/* Garden count */}
        {gardenCount > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(gardenCount, 5) }).map((_, i) => (
              <span key={i} className="text-2xl">{FLOWERS[i % FLOWERS.length]}</span>
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
