import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import ArthurBear from '../components/ArthurBear';
import { playPop, playSuccess, playBoing, playFanfare, playSparkle } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── Food items ── */
const HEALTHY_FOODS = [
  { id: 'apple',      emoji: '🍎', color: '#ef4444', healthy: true },
  { id: 'banana',     emoji: '🍌', color: '#eab308', healthy: true },
  { id: 'carrot',     emoji: '🥕', color: '#f97316', healthy: true },
  { id: 'broccoli',   emoji: '🥦', color: '#22c55e', healthy: true },
  { id: 'strawberry', emoji: '🍓', color: '#f43f5e', healthy: true },
  { id: 'grapes',     emoji: '🍇', color: '#8b5cf6', healthy: true },
  { id: 'orange',     emoji: '🍊', color: '#f97316', healthy: true },
  { id: 'corn',       emoji: '🌽', color: '#eab308', healthy: true },
  { id: 'watermelon', emoji: '🍉', color: '#ef4444', healthy: true },
];

const TREAT_FOODS = [
  { id: 'cookie',    emoji: '🍪', color: '#d97706', healthy: false },
  { id: 'cake',      emoji: '🍰', color: '#ec4899', healthy: false },
  { id: 'candy',     emoji: '🍬', color: '#a855f7', healthy: false },
  { id: 'icecream',  emoji: '🍦', color: '#f9a8d4', healthy: false },
];

const LUNCHBOX_SIZE = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick a round of choices: 2 healthy + 1 treat, shuffled */
function pickRound(exclude = []) {
  const excludeIds = new Set(exclude.map(f => f.id));
  const available = HEALTHY_FOODS.filter(f => !excludeIds.has(f.id));
  const healthy = shuffle(available).slice(0, 2);
  const treat = shuffle(TREAT_FOODS)[0];
  return shuffle([...healthy, treat]);
}

/* ── Kitchen background ── */
function KitchenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 60%, #FFE0B2 100%)' }} />
      <div className="absolute top-[6%] right-[8%] w-20 h-24 rounded-t-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #B8E6FF 80%)',
          border: '4px solid #C4A265',
        }}>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-yellow-300"
          style={{ boxShadow: '0 0 15px #facc15' }} />
      </div>
      <div className="absolute bottom-[20%] left-0 right-0 h-3"
        style={{ background: 'linear-gradient(180deg, #D4A853, #C49245)' }} />
      <div className="absolute top-[15%] left-[5%] w-14 h-[35%] rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #D4A853, #B8862A)',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
        }}>
        <div className="absolute top-1/3 right-1.5 w-1.5 h-3 bg-amber-300 rounded-full" />
        <div className="absolute top-2/3 right-1.5 w-1.5 h-3 bg-amber-300 rounded-full" />
      </div>
      <div className="absolute top-[10%] right-[5%] w-14 h-[40%] rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
        }}>
        <div className="absolute top-1/4 left-1.5 w-1.5 h-5 bg-gray-400 rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[20%]"
        style={{ background: 'linear-gradient(180deg, #D4A865 0%, #C49255 100%)' }} />
    </div>
  );
}

/* ── Food item button ── */
function FoodItem({ food, onTap, wobble }) {
  const isHealthy = food.healthy;
  return (
    <motion.button
      onPointerDown={() => onTap(food)}
      className="relative flex flex-col items-center justify-center rounded-3xl transition-all
                 active:scale-90 cursor-pointer"
      animate={wobble ? { rotate: [0, -12, 12, -8, 8, 0], x: [0, -4, 4, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
      style={{
        background: isHealthy
          ? `linear-gradient(135deg, ${food.color}30, ${food.color}15)`
          : `linear-gradient(135deg, #9ca3af20, #9ca3af10)`,
        border: isHealthy
          ? `4px solid ${food.color}80`
          : '4px solid #d1d5db80',
        boxShadow: isHealthy
          ? `0 4px 16px ${food.color}30, 0 0 0 3px rgba(34,197,94,0.2)`
          : '0 2px 6px rgba(0,0,0,0.06)',
        touchAction: 'none',
        width: 110,
        height: 110,
      }}
    >
      <span className="text-6xl">{food.emoji}</span>
      {/* Green sparkle ring on healthy foods */}
      {isHealthy && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
             style={{
               background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
               boxShadow: 'inset 0 0 12px rgba(34,197,94,0.15)',
             }} />
      )}
      {/* Subtle star on healthy foods */}
      {isHealthy && (
        <span className="absolute -top-1 -right-1 text-lg"
              style={{ filter: 'drop-shadow(0 0 4px rgba(250,204,21,0.6))' }}>
          ⭐
        </span>
      )}
      {/* Grey overlay on treats */}
      {!isHealthy && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
             style={{ background: '#9ca3af' }} />
      )}
    </motion.button>
  );
}

/* ── Lunchbox display ── */
function Lunchbox({ items }) {
  return (
    <div className="relative w-80 h-28 rounded-3xl overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #ef4444, #dc2626)',
           border: '5px solid #b91c1c',
           boxShadow: '0 8px 24px rgba(185,28,28,0.3), inset 0 2px 8px rgba(255,255,255,0.2)',
         }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-800/30" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-t-full"
           style={{ background: 'linear-gradient(to bottom, #991b1b, #b91c1c)', border: '2px solid #7f1d1d' }} />

      <div className="flex items-center justify-center gap-4 h-full px-4">
        {Array.from({ length: LUNCHBOX_SIZE }).map((_, i) => (
          <div key={i} className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{
                 background: items[i] ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                 border: `3px dashed ${items[i] ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
               }}>
            <AnimatePresence>
              {items[i] ? (
                <motion.span
                  key={items[i].id}
                  className="text-4xl"
                  initial={{ scale: 0, y: 40 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  {items[i].emoji}
                </motion.span>
              ) : (
                <span className="text-2xl opacity-30">?</span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Flying food animation ── */
function FlyingFood({ emoji, onDone }) {
  return (
    <motion.div
      className="fixed z-[200] text-6xl pointer-events-none"
      initial={{ scale: 1.2, opacity: 1, y: 0 }}
      animate={{ scale: 0.6, opacity: 0.8, y: -120 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      onAnimationComplete={onDone}
      style={{ left: '50%', top: '55%', transform: 'translateX(-50%)' }}
    >
      {emoji}
    </motion.div>
  );
}

export default function ArthursLunchbox() {
  const [packedItems, setPackedItems] = useState([]);
  const [choices, setChoices] = useState(() => pickRound());
  const [wobbleId, setWobbleId] = useState(null);
  const [flyingEmoji, setFlyingEmoji] = useState(null);
  const [arthurMood, setArthurMood] = useState('happy');
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const isComplete = packedItems.length >= LUNCHBOX_SIZE;

  const handleTap = useCallback((food) => {
    if (isComplete) return;

    if (food.healthy) {
      playPop();
      playSparkle();
      setFlyingEmoji(food.emoji);
      setArthurMood('excited');

      // Small delay so flying animation plays before item lands
      setTimeout(() => {
        setPackedItems(prev => {
          const next = [...prev, food];
          if (next.length >= LUNCHBOX_SIZE) {
            setTimeout(() => {
              playFanfare();
              celebrate();
              peek('excited');
            }, 300);
          } else {
            playSuccess();
          }
          return next;
        });
        // Pick new choices for next round
        setChoices(prev => pickRound([...packedItems, food]));
        setFlyingEmoji(null);
      }, 450);

      setTimeout(() => setArthurMood('happy'), 1200);
    } else {
      // Treat — gentle shake + Arthur shakes head
      playBoing();
      setWobbleId(food.id);
      setArthurMood('curious');
      setTimeout(() => {
        setWobbleId(null);
        setArthurMood('happy');
      }, 600);
    }
  }, [isComplete, packedItems, celebrate, peek]);

  const handlePlayAgain = useCallback(() => {
    setPackedItems([]);
    setChoices(pickRound());
    setWobbleId(null);
    setFlyingEmoji(null);
    setArthurMood('happy');
  }, []);

  const expression = isComplete ? 'excited' : arthurMood;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <KitchenScene />
      <BackButton variant="dark" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-5 h-full px-4">
        {/* Arthur — visual guide instead of text */}
        <div className="relative flex flex-col items-center">
          <ArthurBear expression={expression} size={90} />
          {/* Visual-only speech: emoji bubble, no text */}
          {packedItems.length === 0 && !isComplete && (
            <motion.div
              className="absolute -top-1 -right-2 bg-white rounded-full w-10 h-10
                         flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}>
              <span className="text-xl">🍎</span>
            </motion.div>
          )}
        </div>

        {/* Lunchbox — progress is visual (slots filling up) */}
        <Lunchbox items={packedItems} />

        {/* Food choices — only 3 at a time */}
        {!isComplete && (
          <div className="flex gap-5 justify-center">
            <AnimatePresence mode="popLayout">
              {choices.map(food => (
                <motion.div
                  key={food.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <FoodItem
                    food={food}
                    onTap={handleTap}
                    wobble={wobbleId === food.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Play again — big, visual, no reading needed */}
        {isComplete && (
          <motion.button
            onClick={handlePlayAgain}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500
                       text-white font-heading text-2xl active:scale-95 transition-transform shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}>
            🔄 🥗
          </motion.button>
        )}
      </div>

      {/* Flying food animation */}
      <AnimatePresence>
        {flyingEmoji && <FlyingFood emoji={flyingEmoji} onDone={() => setFlyingEmoji(null)} />}
      </AnimatePresence>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
