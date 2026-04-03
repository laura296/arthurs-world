import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playFanfare } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useCelebration } from '../../components/CelebrationOverlay';

/*
  Growth stages — each needs sun + water to advance.
  Visual: seed → sprout → stem → leaves → flower
*/
const STAGES = [
  { id: 'seed',   height: 0,   emoji: '🫘', plant: null },
  { id: 'sprout', height: 30,  emoji: '🌱', plant: '🌱' },
  { id: 'stem',   height: 80,  emoji: '🌿', plant: '🌿' },
  { id: 'leaves', height: 130, emoji: '🪴', plant: '🪴' },
  { id: 'flower', height: 180, emoji: '🌻', plant: '🌻' },
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
  const { celebrate, CelebrationLayer } = useCelebration();

  const isComplete = stage >= STAGES.length - 1;

  const handleSun = useCallback(() => {
    if (isComplete || growing || hasSun) return;
    playPop();
    setHasSun(true);
    burst(window.innerWidth * 0.3, window.innerHeight * 0.3, {
      count: 8, spread: 50,
      colors: ['#facc15', '#fde68a', '#f59e0b'],
      shapes: ['star'],
    });

    // If already has water, grow!
    if (hasWater) grow();
  }, [isComplete, growing, hasSun, hasWater]);

  const handleWater = useCallback(() => {
    if (isComplete || growing || hasWater) return;
    playPop();
    setHasWater(true);
    burst(window.innerWidth * 0.7, window.innerHeight * 0.3, {
      count: 8, spread: 50,
      colors: ['#38bdf8', '#7dd3fc', '#bae6fd'],
      shapes: ['circle'],
    });

    // If already has sun, grow!
    if (hasSun) grow();
  }, [isComplete, growing, hasWater, hasSun]);

  const grow = useCallback(() => {
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
        setGardenCount(g => g + 1);
      } else {
        playSuccess();
      }
    }, 800);
  }, [stage, celebrate]);

  // Need both sun AND water — check after each tap
  const checkGrow = useCallback((newSun, newWater) => {
    if (newSun && newWater) {
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
          setGardenCount(g => g + 1);
        } else {
          playSuccess();
        }
      }, 800);
    }
  }, [stage, celebrate]);

  const handleSunTap = useCallback(() => {
    if (isComplete || growing || hasSun) return;
    playPop();
    setHasSun(true);
    burst(window.innerWidth * 0.3, window.innerHeight * 0.3, {
      count: 8, spread: 50, colors: ['#facc15', '#fde68a', '#f59e0b'], shapes: ['star'],
    });
    checkGrow(true, hasWater);
  }, [isComplete, growing, hasSun, hasWater, burst, checkGrow]);

  const handleWaterTap = useCallback(() => {
    if (isComplete || growing || hasWater) return;
    playPop();
    setHasWater(true);
    burst(window.innerWidth * 0.7, window.innerHeight * 0.3, {
      count: 8, spread: 50, colors: ['#38bdf8', '#7dd3fc', '#bae6fd'], shapes: ['circle'],
    });
    checkGrow(hasSun, true);
  }, [isComplete, growing, hasWater, hasSun, burst, checkGrow]);

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
         style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 50%, #7BC47F 50%, #4ade80 100%)' }}>
      <BackButton />

      {/* Sky decorations */}
      <div className="absolute top-8 left-12 w-16 h-6 bg-white/60 rounded-full" />
      <div className="absolute top-14 left-28 w-10 h-4 bg-white/40 rounded-full" />

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-4">
        {/* Sun and water buttons */}
        <div className="flex gap-12">
          <motion.button
            onPointerDown={handleSunTap}
            className="rounded-full active:scale-90 transition-transform"
            animate={hasSun ? { scale: 1.2, boxShadow: '0 0 40px #facc1580' } : {}}
            style={{
              width: 100, height: 100,
              background: 'radial-gradient(circle at 40% 40%, #fef3c7, #facc15, #f59e0b)',
              boxShadow: '0 4px 20px rgba(250,204,21,0.4)',
              touchAction: 'none',
              opacity: hasSun ? 0.5 : 1,
            }}
          >
            <span className="text-5xl">☀️</span>
          </motion.button>

          <motion.button
            onPointerDown={handleWaterTap}
            className="rounded-full active:scale-90 transition-transform"
            animate={hasWater ? { scale: 1.2, boxShadow: '0 0 40px #38bdf880' } : {}}
            style={{
              width: 100, height: 100,
              background: 'radial-gradient(circle at 40% 40%, #e0f2fe, #38bdf8, #0284c7)',
              boxShadow: '0 4px 20px rgba(56,189,248,0.4)',
              touchAction: 'none',
              opacity: hasWater ? 0.5 : 1,
            }}
          >
            <span className="text-5xl">💧</span>
          </motion.button>
        </div>

        {/* Plant growing area */}
        <div className="relative flex flex-col items-center" style={{ minHeight: 240 }}>
          {/* Pot */}
          <div className="absolute bottom-0 w-28 h-16 rounded-b-3xl"
               style={{
                 background: 'linear-gradient(180deg, #C2703A, #A0522D)',
                 boxShadow: '0 4px 12px rgba(160,82,45,0.4)',
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
              <span style={{ fontSize: stage === 0 ? '3rem' : `${3 + stage * 1.5}rem` }}>
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

        {/* Progress dots — visual stage indicator */}
        <div className="flex gap-3">
          {STAGES.map((s, i) => (
            <div key={s.id}
                 className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                   i <= stage ? 'scale-110' : 'opacity-30 scale-75'
                 }`}>
              <span className="text-xl">{i <= stage ? s.emoji : '·'}</span>
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
              <span key={i} className="text-xl">{FLOWERS[i % FLOWERS.length]}</span>
            ))}
          </div>
        )}
      </div>

      <ParticleLayer />
      <CelebrationLayer />
    </div>
  );
}
