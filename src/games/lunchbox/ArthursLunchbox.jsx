import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import ArthurBear from '../../components/ArthurBear';
import { playPop, playSnap, playSuccess, playBoing, playFanfare, playSparkle, playCollectPing, playTone, playTummyRumble, playLidSnap } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { FOOD_SVGS } from './FoodSVGs';
import LunchboxSVG from './LunchboxSVG';

/* ── Food data ── */
const HEALTHY = [
  { id: 'apple',      color: '#ef4444', healthy: true },
  { id: 'banana',     color: '#eab308', healthy: true },
  { id: 'carrot',     color: '#f97316', healthy: true },
  { id: 'broccoli',   color: '#22c55e', healthy: true },
  { id: 'strawberry', color: '#f43f5e', healthy: true },
  { id: 'grapes',     color: '#8b5cf6', healthy: true },
  { id: 'orange',     color: '#f97316', healthy: true },
  { id: 'peas',       color: '#16a34a', healthy: true },
  { id: 'corn',       color: '#eab308', healthy: true },
  { id: 'watermelon', color: '#ef4444', healthy: true },
];
const TREATS = [
  { id: 'cookie',   color: '#d97706', healthy: false },
  { id: 'cake',     color: '#ec4899', healthy: false },
  { id: 'candy',    color: '#a855f7', healthy: false },
  { id: 'icecream', color: '#f9a8d4', healthy: false },
];

/* ── Round configs ── */
const ROUNDS = [
  { healthyCount: 4, treatCount: 2, slots: 3 },
  { healthyCount: 5, treatCount: 3, slots: 5 },
  { healthyCount: 6, treatCount: 4, slots: 5 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFoods(round) {
  const cfg = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const h = shuffle(HEALTHY).slice(0, cfg.healthyCount);
  const t = shuffle(TREATS).slice(0, cfg.treatCount);
  return { foods: shuffle([...h, ...t]), slots: cfg.slots };
}

/* ── Kitchen background ── */
function KitchenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 60%, #FFE0B2 100%)' }} />
      {/* Window with sunbeam */}
      <div className="absolute top-[6%] right-[8%] w-24 h-28 rounded-t-lg overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8E6FF 80%)', border: '4px solid #C4A265' }}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-300"
          style={{ boxShadow: '0 0 20px #facc15' }} />
        {/* Curtains */}
        <div className="absolute left-0 top-0 w-4 h-full" style={{ background: 'linear-gradient(90deg, #E88D6D, #D4623A)' }} />
        <div className="absolute right-0 top-0 w-4 h-full" style={{ background: 'linear-gradient(270deg, #E88D6D, #D4623A)' }} />
      </div>
      {/* Sunbeam */}
      <div className="absolute top-[34%] right-[4%] w-32 h-48 opacity-[0.06]"
        style={{ background: 'linear-gradient(200deg, #facc15 0%, transparent 100%)', transform: 'skewX(-10deg)' }} />
      {/* Cabinet */}
      <div className="absolute top-[12%] left-[4%] w-16 h-[38%] rounded-lg"
        style={{ background: 'linear-gradient(180deg, #D4A853, #B8862A)', boxShadow: '2px 2px 8px rgba(0,0,0,0.15)' }}>
        <div className="absolute top-1/3 right-2 w-1.5 h-3 bg-amber-300 rounded-full" />
        <div className="absolute top-2/3 right-2 w-1.5 h-3 bg-amber-300 rounded-full" />
      </div>
      {/* Fridge */}
      <div className="absolute top-[8%] right-[4%] w-14 h-[42%] rounded-lg hidden sm:block"
        style={{ background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)', boxShadow: '2px 2px 8px rgba(0,0,0,0.15)' }}>
        <div className="absolute top-1/4 left-2 w-1.5 h-5 bg-gray-400 rounded-full" />
      </div>
      {/* Counter */}
      <div className="absolute bottom-[22%] left-0 right-0 h-3"
        style={{ background: 'linear-gradient(180deg, #D4A853, #C49245)' }} />
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[22%]"
        style={{ background: 'linear-gradient(180deg, #D4A865 0%, #C49255 100%)' }} />
      {/* Floating dust motes */}
      {[0,1,2].map(i => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/40"
          style={{
            left: `${20 + i * 25}%`, top: `${15 + i * 12}%`,
            animation: `float ${3 + i}s ease-in-out ${i * 0.8}s infinite`,
          }} />
      ))}
    </div>
  );
}

/* ── Intro overlay — fully visual ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    playTummyRumble();
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
        <ArthurBear expression="curious" size={100} />
      </motion.div>
      {/* Animated food parade */}
      <div className="flex gap-2 mt-4">
        {['apple','carrot','broccoli','banana','grapes'].map((id, i) => {
          const FoodSVG = FOOD_SVGS[id];
          return (
            <motion.div key={id} className="w-10 h-10"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 + i * 0.1 }}>
              <FoodSVG />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Draggable food item ── */
function DraggableFood({ food, packed, onDragEnd, onTap, treatBounce, index }) {
  const FoodSVG = FOOD_SVGS[food.id];
  const dragRef = useRef({ startX: 0, startY: 0, dragging: false });
  const elRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e) => {
    if (packed) return;
    e.preventDefault();
    e.target.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: false };
    setIsDragging(true);
  }, [packed]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || packed) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.dragging = true;
    setPos({ x: dx, y: dy });
  }, [isDragging, packed]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragRef.current.dragging) {
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        onDragEnd(food, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } else {
      onTap(food);
    }
    setPos({ x: 0, y: 0 });
  }, [isDragging, food, onDragEnd, onTap]);

  if (packed) return <div className="w-[72px] h-[72px]" />;

  return (
    <motion.div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      animate={{
        x: isDragging ? pos.x : treatBounce ? [0, -8, 8, -4, 4, 0] : 0,
        y: isDragging ? pos.y : 0,
        scale: isDragging ? 1.2 : 1,
        rotate: treatBounce ? [0, 8, -8, 4, -4, 0] : 0,
      }}
      transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
      className="relative touch-none select-none"
      style={{
        zIndex: isDragging ? 50 : 1,
        filter: isDragging ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' : 'none',
      }}
    >
      <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center p-1.5"
        style={{
          background: food.healthy
            ? `linear-gradient(135deg, ${food.color}20, ${food.color}08)`
            : `linear-gradient(135deg, ${food.color}10, ${food.color}05)`,
          border: `3px solid ${food.healthy ? `${food.color}50` : `${food.color}20`}`,
          boxShadow: food.healthy ? `0 4px 12px ${food.color}15, 0 0 0 2px ${food.color}08` : `0 2px 6px ${food.color}08`,
        }}
      >
        <FoodSVG />
      </div>
      {/* Golden aura on healthy foods */}
      {food.healthy && (
        <motion.div
          className="absolute inset-[-4px] rounded-2xl pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)' }}
        />
      )}
    </motion.div>
  );
}

/* ── Flying food animation (tap fallback) ── */
function FlyingFood({ food, from, to, onDone }) {
  const FoodSVG = FOOD_SVGS[food.id];
  useEffect(() => {
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed z-[60] w-12 h-12 pointer-events-none"
      initial={{ left: from.x - 24, top: from.y - 24, scale: 1 }}
      animate={{
        left: to.x - 24,
        top: to.y - 24,
        scale: 0.7,
      }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <FoodSVG />
    </motion.div>
  );
}

/* ── Main component ── */
export default function ArthursLunchbox() {
  const [showIntro, setShowIntro] = useState(true);
  const [round, setRound] = useState(0);
  const [{ foods, slots }, setFoodState] = useState(() => pickFoods(0));
  const [packedItems, setPackedItems] = useState([]);
  const [treatBounceId, setTreatBounceId] = useState(null);
  const [boxWiggle, setBoxWiggle] = useState(false);
  const [lidClosed, setLidClosed] = useState(false);
  const [flyingFood, setFlyingFood] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const boxRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const isComplete = packedItems.length >= slots;

  // Get lunchbox position for drop detection
  const getBoxRect = useCallback(() => {
    if (!boxRef.current) return null;
    return boxRef.current.getBoundingClientRect();
  }, []);

  // Ascending tone per packed item
  const playPackTone = useCallback((count) => {
    const tones = [523, 587, 659, 698, 784];
    playTone(tones[Math.min(count, tones.length - 1)], 0.15);
  }, []);

  const packFood = useCallback((food, x, y) => {
    if (isComplete) return;

    if (food.healthy) {
      playSnap();
      playCollectPing();
      playPackTone(packedItems.length);
      setPackedItems(prev => [...prev, food]);
      setBoxWiggle(true);
      setTimeout(() => setBoxWiggle(false), 400);
      burst(x, y, { count: 8, colors: ['#facc15', food.color, '#fff'], spread: 50 });

      const newCount = packedItems.length + 1;
      if (newCount >= slots) {
        setTimeout(() => {
          playLidSnap();
          setLidClosed(true);
        }, 300);
        setTimeout(() => {
          playFanfare();
          celebrate();
          peek('excited');
        }, 700);
      } else if (newCount === Math.ceil(slots / 2)) {
        playSuccess();
        peek('happy');
      }
    } else {
      // Treat — bounce back
      playBoing();
      setTreatBounceId(food.id);
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => setTreatBounceId(null), 500);
    }
  }, [isComplete, packedItems.length, slots, burst, celebrate, peek, playPackTone]);

  const handleDragEnd = useCallback((food, x, y) => {
    const boxRect = getBoxRect();
    if (boxRect && y > boxRect.top - 30 && y < boxRect.bottom + 30 && x > boxRect.left - 20 && x < boxRect.right + 20) {
      packFood(food, x, y);
    } else {
      // Dropped outside — return silently
      playPop();
    }
  }, [getBoxRect, packFood]);

  const handleTap = useCallback((food) => {
    if (isComplete) return;
    if (!food.healthy) {
      playBoing();
      setTreatBounceId(food.id);
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => setTreatBounceId(null), 500);
      return;
    }
    // Tap fallback — fly food to box
    const boxRect = getBoxRect();
    if (!boxRect) return;
    playPop();
    setFlyingFood({
      food,
      from: { x: window.innerWidth / 2, y: window.innerHeight * 0.75 },
      to: { x: boxRect.left + boxRect.width / 2, y: boxRect.top + boxRect.height / 2 },
    });
  }, [isComplete, getBoxRect]);

  const handleFlyDone = useCallback(() => {
    if (!flyingFood) return;
    const boxRect = getBoxRect();
    packFood(flyingFood.food, boxRect ? boxRect.left + boxRect.width / 2 : 160, boxRect ? boxRect.top : 200);
    setFlyingFood(null);
  }, [flyingFood, packFood, getBoxRect]);

  const handleNextRound = useCallback(() => {
    const next = round + 1;
    setRound(next);
    setFoodState(pickFoods(next));
    setPackedItems([]);
    setLidClosed(false);
    setWrongAttempts(0);
  }, [round]);

  const handlePlayAgain = useCallback(() => {
    setRound(0);
    setFoodState(pickFoods(0));
    setPackedItems([]);
    setLidClosed(false);
    setWrongAttempts(0);
  }, []);

  const expression = isComplete ? 'excited' : packedItems.length > Math.ceil(slots / 2) ? 'happy' : 'curious';

  // Star rating
  const stars = wrongAttempts === 0 ? 3 : wrongAttempts <= 2 ? 2 : 1;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <KitchenScene />
      <BackButton />

      <AnimatePresence>
        {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-14 px-4">
        {/* Arthur + visual cue */}
        <div className="relative flex flex-col items-center">
          <ArthurBear expression={expression} size={80} />
          {/* Empty slots glow indicator */}
          {!isComplete && packedItems.length > 0 && (
            <div className="flex gap-1 mt-1">
              {Array.from({ length: slots }).map((_, i) => (
                <motion.div key={i}
                  className={`w-3 h-3 rounded-full ${i < packedItems.length ? 'bg-sun' : 'bg-amber-200/40'}`}
                  animate={i < packedItems.length ? { scale: [1, 1.2, 1] } : { opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={i < packedItems.length ? { boxShadow: '0 0 6px #facc15' } : {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lunchbox */}
        <div ref={boxRef}>
          <LunchboxSVG items={packedItems} slots={slots} lidClosed={lidClosed} wiggle={boxWiggle} />
        </div>

        {/* Round indicator */}
        <div className="flex gap-1">
          {ROUNDS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300
              ${i <= round ? 'bg-sun scale-110' : 'bg-amber-200/30'}`}
              style={i <= round ? { boxShadow: '0 0 4px #facc15' } : {}}
            />
          ))}
        </div>

        {/* Food choices — scattered layout */}
        {!isComplete && (
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            {foods.map((food, i) => (
              <div key={food.id} className="flex justify-center">
                <DraggableFood
                  food={food}
                  index={i}
                  packed={packedItems.some(p => p.id === food.id) || flyingFood?.food.id === food.id}
                  onDragEnd={handleDragEnd}
                  onTap={handleTap}
                  treatBounce={treatBounceId === food.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Completion — stars + next/replay */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Stars */}
            <div className="flex gap-2">
              {[1,2,3].map(s => (
                <motion.div key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: s <= stars ? 1 : 0.5, rotate: 0, opacity: s <= stars ? 1 : 0.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.3 + s * 0.15 }}
                >
                  <svg width="32" height="32" viewBox="0 0 20 20" fill={s <= stars ? '#facc15' : '#94a3b8'}>
                    <path d="M10 0l2.4 7.2H20l-6 4.8 2.4 7.2L10 14.4 3.6 19.2 6 12 0 7.2h7.6z" />
                  </svg>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              {/* Next round */}
              {round < ROUNDS.length - 1 && (
                <motion.button
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                  onClick={handleNextRound}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-sun to-amber-500
                             flex items-center justify-center shadow-xl"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1c1917">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </motion.button>
              )}
              {/* Play again */}
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.65 }}
                onClick={handlePlayAgain}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500
                           flex items-center justify-center shadow-xl"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Flying food (tap fallback) */}
      <AnimatePresence>
        {flyingFood && <FlyingFood {...flyingFood} onDone={handleFlyDone} />}
      </AnimatePresence>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
