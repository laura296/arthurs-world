import { useState, useCallback, useEffect } from 'react';
import BackButton from '../components/BackButton';
import ArthurBear from '../components/ArthurBear';
import { playPop, playSuccess, playBoing, playFanfare, playSparkle } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── Food items ── */
const HEALTHY_FOODS = [
  { id: 'apple',      emoji: '🍎', label: 'Apple',      color: '#ef4444', healthy: true },
  { id: 'banana',     emoji: '🍌', label: 'Banana',     color: '#eab308', healthy: true },
  { id: 'carrot',     emoji: '🥕', label: 'Carrot',     color: '#f97316', healthy: true },
  { id: 'broccoli',   emoji: '🥦', label: 'Broccoli',   color: '#22c55e', healthy: true },
  { id: 'strawberry', emoji: '🍓', label: 'Strawberry', color: '#f43f5e', healthy: true },
  { id: 'grapes',     emoji: '🍇', label: 'Grapes',     color: '#8b5cf6', healthy: true },
  { id: 'orange',     emoji: '🍊', label: 'Orange',     color: '#f97316', healthy: true },
  { id: 'peas',       emoji: '🫛', label: 'Peas',       color: '#16a34a', healthy: true },
  { id: 'corn',       emoji: '🌽', label: 'Corn',       color: '#eab308', healthy: true },
  { id: 'watermelon', emoji: '🍉', label: 'Watermelon', color: '#ef4444', healthy: true },
];

const TREAT_FOODS = [
  { id: 'cookie',    emoji: '🍪', label: 'Cookie',    color: '#d97706', healthy: false },
  { id: 'cake',      emoji: '🍰', label: 'Cake',      color: '#ec4899', healthy: false },
  { id: 'candy',     emoji: '🍬', label: 'Candy',     color: '#a855f7', healthy: false },
  { id: 'icecream',  emoji: '🍦', label: 'Ice Cream', color: '#f9a8d4', healthy: false },
];

const LUNCHBOX_SIZE = 5; // items needed to fill the lunchbox

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFoods() {
  // Pick 5 random healthy + 3 random treats = 8 choices
  const healthy = shuffle(HEALTHY_FOODS).slice(0, 5);
  const treats = shuffle(TREAT_FOODS).slice(0, 3);
  return shuffle([...healthy, ...treats]);
}

/* ── Kitchen background ── */
function KitchenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wall */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 60%, #FFE0B2 100%)' }} />

      {/* Window */}
      <div className="absolute top-[6%] right-[8%] w-20 h-24 rounded-t-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #B8E6FF 80%)',
          border: '4px solid #C4A265',
        }}>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-yellow-300"
          style={{ boxShadow: '0 0 15px #facc15' }} />
      </div>

      {/* Counter top */}
      <div className="absolute bottom-[20%] left-0 right-0 h-3"
        style={{ background: 'linear-gradient(180deg, #D4A853, #C49245)' }} />

      {/* Cabinet */}
      <div className="absolute top-[15%] left-[5%] w-14 h-[35%] rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #D4A853, #B8862A)',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
        }}>
        <div className="absolute top-1/3 right-1.5 w-1.5 h-3 bg-amber-300 rounded-full" />
        <div className="absolute top-2/3 right-1.5 w-1.5 h-3 bg-amber-300 rounded-full" />
      </div>

      {/* Fridge */}
      <div className="absolute top-[10%] right-[5%] w-14 h-[40%] rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
        }}>
        <div className="absolute top-1/4 left-1.5 w-1.5 h-5 bg-gray-400 rounded-full" />
      </div>

      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%]"
        style={{ background: 'linear-gradient(180deg, #D4A865 0%, #C49255 100%)' }} />
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['🍎', '🥕', '🥦', '🍌', '🍇'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex gap-2 mb-4">
        {emojis.map((e, i) => (
          <span key={i} className="text-3xl"
            style={{ animation: `pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms both` }}>
            {e}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🥗 Arthur's Lunchbox
      </h2>
      <p className="text-lg font-heading text-green-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Pack a healthy lunch!
      </p>
    </div>
  );
}

/* ── Food item button ── */
function FoodItem({ food, onTap, packed, wobble }) {
  return (
    <button
      onPointerDown={() => !packed && onTap(food)}
      className={`relative flex flex-col items-center justify-center rounded-2xl p-2 transition-all
                  ${packed ? 'opacity-30 scale-90' : 'active:scale-90 cursor-pointer'}
                  ${wobble ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}`}
      style={{
        background: packed
          ? '#e5e7eb'
          : food.healthy
            ? `linear-gradient(135deg, ${food.color}25, ${food.color}10)`
            : `linear-gradient(135deg, ${food.color}15, ${food.color}08)`,
        border: `3px solid ${packed ? '#d1d5db' : food.healthy ? `${food.color}60` : `${food.color}30`}`,
        boxShadow: packed ? 'none'
          : food.healthy
            ? `0 4px 12px ${food.color}20, 0 0 0 2px ${food.color}15`
            : `0 2px 6px ${food.color}10`,
        touchAction: 'none',
        minWidth: 72,
        minHeight: 72,
      }}
      disabled={packed}
    >
      <span className="text-3xl">{food.emoji}</span>
      {packed && <span className="absolute top-0.5 right-0.5 text-sm">✅</span>}
      {/* Subtle golden glow on healthy foods */}
      {food.healthy && !packed && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
             style={{
               background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)',
             }} />
      )}
    </button>
  );
}

/* ── Lunchbox display ── */
function Lunchbox({ items }) {
  return (
    <div className="relative w-64 h-24 rounded-2xl overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #ef4444, #dc2626)',
           border: '4px solid #b91c1c',
           boxShadow: '0 6px 20px rgba(185,28,28,0.3), inset 0 2px 8px rgba(255,255,255,0.2)',
         }}>
      {/* Lunchbox lid line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-800/30" />

      {/* Handle */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-full"
           style={{ background: 'linear-gradient(to bottom, #991b1b, #b91c1c)', border: '2px solid #7f1d1d' }} />

      {/* Slots */}
      <div className="flex items-center justify-center gap-2 h-full px-3">
        {Array.from({ length: LUNCHBOX_SIZE }).map((_, i) => (
          <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{
                 background: items[i] ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                 border: `2px dashed ${items[i] ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
               }}>
            {items[i] ? (
              <span className="text-2xl"
                    style={{ animation: `pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both` }}>
                {items[i].emoji}
              </span>
            ) : (
              <span className="text-lg opacity-20">?</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArthursLunchbox() {
  const [showIntro, setShowIntro] = useState(true);
  const [foods] = useState(() => pickFoods());
  const [packedItems, setPackedItems] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const isComplete = packedItems.length >= LUNCHBOX_SIZE;

  const handleTap = useCallback((food) => {
    if (isComplete) return;

    if (food.healthy) {
      // Good choice!
      playPop();
      playSparkle();
      setPackedItems(prev => [...prev, food]);
      setWobbleId(null);

      const newCount = packedItems.length + 1;
      if (newCount >= LUNCHBOX_SIZE) {
        setTimeout(() => {
          playFanfare();
          celebrate();
          peek('excited');
        }, 400);
      } else if (newCount === 3) {
        playSuccess();
        peek('happy');
      }
    } else {
      // Treat food — gentle nudge
      playBoing();
      setWobbleId(food.id);
      setTimeout(() => setWobbleId(null), 500);
    }
  }, [isComplete, packedItems.length, celebrate, peek]);

  const handlePlayAgain = useCallback(() => {
    setPackedItems([]);
    setWobbleId(null);
  }, []);

  const expression = isComplete ? 'excited' : packedItems.length > 2 ? 'happy' : 'curious';

  return (
    <div className="relative w-full h-full overflow-hidden">
      <KitchenScene />
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-4">
        {/* Title */}
        <h2 className="font-heading text-amber-800/80 text-lg">
          🥗 Arthur's Lunchbox
        </h2>

        {/* Arthur + speech */}
        <div className="relative flex flex-col items-center">
          <ArthurBear expression={expression} size={100} />
          {packedItems.length === 0 && (
            <div className="absolute -top-2 right-0 bg-white rounded-xl px-3 py-1.5 shadow-lg
                            text-sm font-heading text-green-700 animate-bounce"
                 style={{ animation: 'pop-in 0.5s ease-out 1s both' }}>
              I'm hungry!
            </div>
          )}
        </div>

        {/* Lunchbox */}
        <Lunchbox items={packedItems} />

        {/* Hint */}
        {!isComplete && packedItems.length > 0 && (
          <p className="text-sm font-heading text-green-700/60 animate-pulse">
            {packedItems.length === 1 ? '🍎 More fruit & veg!' :
             packedItems.length === 3 ? '🥦 Nearly full!' :
             packedItems.length === 4 ? '🥕 One more!' :
             '🍌 Keep going!'}
          </p>
        )}

        {/* Food choices */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
          {foods.map(food => (
            <FoodItem
              key={food.id}
              food={food}
              onTap={handleTap}
              packed={packedItems.some(p => p.id === food.id)}
              wobble={wobbleId === food.id}
            />
          ))}
        </div>

        {/* Play again */}
        {isComplete && (
          <button onClick={handlePlayAgain}
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500
                       text-white font-heading text-lg active:scale-95 transition-transform shadow-lg"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
            Pack Again! 🥗
          </button>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
