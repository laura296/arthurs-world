import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import ArthurBear from '../../components/ArthurBear';
import { playPop, playSuccess, playSparkle, playFanfare, playBoing, playTone, playScrub } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import MouthSVG, { getToothRect } from './MouthSVG';

/* ── Tooth data ── */
const TEETH = [
  { id: 'top-left',     row: 'top',    col: 0 },
  { id: 'top-front',    row: 'top',    col: 1 },
  { id: 'top-right',    row: 'top',    col: 2 },
  { id: 'bottom-left',  row: 'bottom', col: 0 },
  { id: 'bottom-front', row: 'bottom', col: 1 },
  { id: 'bottom-right', row: 'bottom', col: 2 },
];

/* ── Round configs ── */
const ROUNDS = [
  { teethCount: 4, brushNeeded: 4 },   // top row only + 1 bottom
  { teethCount: 6, brushNeeded: 5 },   // all teeth
  { teethCount: 6, brushNeeded: 6 },   // all teeth, more strokes
];

const SCRUB_DISTANCE = 25; // pixels of movement = 1 brush stroke

/* ── Bathroom background ── */
function BathroomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)' }} />
      {/* Mirror */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-36 h-28 rounded-[50%] overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
                 border: '5px solid #D4A853', boxShadow: 'inset 0 0 30px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.1)' }}>
        <div className="absolute top-3 right-6 w-6 h-12 bg-white/30 rounded-full rotate-[-20deg]" />
      </div>
      {/* Shelf */}
      <div className="absolute top-[36%] right-[6%] w-22 h-3 rounded-lg bg-amber-200"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <div className="absolute -top-6 left-2 w-5 h-7 rounded-t-lg bg-sky-400" style={{ border: '2px solid #0ea5e9' }}>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-sm" />
        </div>
        <div className="absolute -top-5 right-2 w-5 h-5 rounded-b-lg bg-pink-300" style={{ border: '2px solid #f472b6' }} />
      </div>
      {/* Sink */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-44 h-22 rounded-b-[50%]"
        style={{ background: 'linear-gradient(180deg, #f8fafc, #e2e8f0)', border: '4px solid #cbd5e1',
                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-7">
          <div className="w-4 h-6 bg-gray-400 rounded-t-full mx-auto" />
          <div className="w-10 h-2 bg-gray-300 rounded-full -ml-1" />
        </div>
      </div>
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[8%]"
        style={{ background: 'linear-gradient(180deg, #94a3b8, #64748b)' }} />
      {/* Dripping tap */}
      <motion.div
        className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-300/60"
        animate={{ y: [0, 15], opacity: [0.8, 0], scale: [1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeIn' }}
      />
    </div>
  );
}

/* ── SVG Toothbrush that follows pointer ── */
function Toothbrush({ x, y, active }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[60]"
      animate={{ left: x - 16, top: y - 48, rotate: active ? [-8, 8] : -30, scale: active ? 1.05 : 1 }}
      transition={active
        ? { rotate: { duration: 0.15, repeat: Infinity, repeatType: 'reverse' }, scale: { duration: 0.1 } }
        : { type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }
      }
    >
      <svg viewBox="0 0 32 80" width="32" height="80">
        <defs>
          <linearGradient id="brush-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        {/* Handle */}
        <rect x="10" y="24" width="12" height="52" rx="5" fill="url(#brush-g)" />
        {/* Grip bumps */}
        {[34, 40, 46].map(y => (
          <rect key={y} x="12" y={y} width="8" height="2" rx="1" fill="#0284c7" opacity="0.3" />
        ))}
        {/* Bristle head */}
        <rect x="6" y="4" width="20" height="22" rx="4" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="1" />
        {/* Bristle rows */}
        {[8, 12, 16, 20].map(y => (
          <g key={y}>
            {[10, 14, 18, 22].map(x => (
              <rect key={x} x={x} y={y} width="2" height="3" rx="0.5" fill="#fff" />
            ))}
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ── Foam bubbles ── */
function FoamBubble({ x, y }) {
  const size = 6 + Math.random() * 8;
  const dx = (Math.random() - 0.5) * 30;
  return (
    <motion.div
      className="fixed pointer-events-none z-[55] rounded-full"
      style={{ width: size, height: size, background: 'radial-gradient(circle at 35% 35%, #fff, #bae6fd)',
               border: '1px solid rgba(147,197,253,0.4)' }}
      initial={{ left: x - size/2, top: y - size/2, scale: 0, opacity: 1 }}
      animate={{ top: y - size/2 - 50, left: x - size/2 + dx, scale: [0, 1.3, 0.9], opacity: [1, 0.8, 0] }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
        <ArthurBear expression="curious" size={100} />
      </motion.div>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
        className="mt-3">
        <svg viewBox="0 0 32 80" width="48" height="120">
          <rect x="10" y="24" width="12" height="52" rx="5" fill="#38bdf8" />
          <rect x="6" y="4" width="20" height="22" rx="4" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="1" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ── Main component ── */
export default function SparkleTeeth() {
  const [showIntro, setShowIntro] = useState(true);
  const [round, setRound] = useState(0);
  const cfg = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const activeTeeth = TEETH.slice(0, cfg.teethCount);

  const [brushCounts, setBrushCounts] = useState(() =>
    Object.fromEntries(TEETH.map(t => [t.id, 0]))
  );
  const [targetIdx, setTargetIdx] = useState(0);
  const [brushPos, setBrushPos] = useState({ x: -100, y: -100 });
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [foamBubbles, setFoamBubbles] = useState([]);
  const [scrubAccum, setScrubAccum] = useState(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const scrubTimerRef = useRef(null);
  const mouthRef = useRef(null);
  const foamIdRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const cleanCount = activeTeeth.filter(t => brushCounts[t.id] >= cfg.brushNeeded).length;
  const isComplete = cleanCount === activeTeeth.length;
  const currentTarget = activeTeeth[targetIdx];

  // Reset on round change
  useEffect(() => {
    setBrushCounts(Object.fromEntries(TEETH.map(t => [t.id, 0])));
    setTargetIdx(0);
    setScrubAccum(0);
  }, [round]);

  // Clean up foam bubbles
  useEffect(() => {
    if (foamBubbles.length > 20) {
      setFoamBubbles(prev => prev.slice(-15));
    }
  }, [foamBubbles.length]);

  const isOverTooth = useCallback((x, y) => {
    if (!mouthRef.current || !currentTarget) return false;
    const rect = mouthRef.current.getBoundingClientRect();
    const toothPos = getToothRect(activeTeeth, targetIdx, rect);
    if (!toothPos) return false;
    const dist = Math.hypot(x - toothPos.cx, y - toothPos.cy);
    return dist < toothPos.r + 25; // generous hit area
  }, [activeTeeth, targetIdx, currentTarget]);

  const processBrushStroke = useCallback(() => {
    if (!currentTarget || isComplete) return;

    setBrushCounts(prev => {
      const newCount = (prev[currentTarget.id] || 0) + 1;
      const updated = { ...prev, [currentTarget.id]: newCount };

      if (newCount >= cfg.brushNeeded) {
        // Tooth clean!
        const tones = [523, 587, 659, 698, 784, 880];
        playTone(tones[Math.min(targetIdx, tones.length - 1)], 0.15);
        playSparkle();

        const rect = mouthRef.current?.getBoundingClientRect();
        const toothPos = getToothRect(activeTeeth, targetIdx, rect);
        if (toothPos) {
          burst(toothPos.cx, toothPos.cy, { count: 12, colors: ['#facc15', '#38bdf8', '#fff'], spread: 50 });
        }

        const nextIdx = targetIdx + 1;
        if (nextIdx >= activeTeeth.length) {
          setTimeout(() => {
            playFanfare();
            celebrate();
            peek('excited');
          }, 400);
        } else {
          setTargetIdx(nextIdx);
          playSuccess();
          peek('happy');
        }
      } else {
        playScrub();
      }

      return updated;
    });
    setScrubAccum(0);
  }, [currentTarget, isComplete, cfg.brushNeeded, activeTeeth, targetIdx, burst, celebrate, peek]);

  const handlePointerDown = useCallback((e) => {
    if (isComplete) return;
    const x = e.clientX, y = e.clientY;
    setBrushPos({ x, y });
    lastPointerRef.current = { x, y };
    setIsScrubbing(true);
    setScrubAccum(0);

    // If tapping on target tooth, count as one brush stroke
    if (isOverTooth(x, y)) {
      processBrushStroke();
      // Spawn foam
      setFoamBubbles(prev => [...prev, { id: foamIdRef.current++, x, y }]);
    }
  }, [isComplete, isOverTooth, processBrushStroke]);

  const handlePointerMove = useCallback((e) => {
    if (!isScrubbing || isComplete) return;
    const x = e.clientX, y = e.clientY;
    setBrushPos({ x, y });

    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;
    const dist = Math.hypot(dx, dy);
    lastPointerRef.current = { x, y };

    if (isOverTooth(x, y) && dist > 3) {
      setScrubAccum(prev => {
        const newAccum = prev + dist;
        if (newAccum >= SCRUB_DISTANCE) {
          processBrushStroke();
          // Spawn foam bubble
          setFoamBubbles(prev => [...prev, { id: foamIdRef.current++, x, y }]);
          return 0;
        }
        return newAccum;
      });
    }
  }, [isScrubbing, isComplete, isOverTooth, processBrushStroke]);

  const handlePointerUp = useCallback(() => {
    setIsScrubbing(false);
  }, []);

  const handleNextRound = useCallback(() => setRound(r => r + 1), []);
  const handlePlayAgain = useCallback(() => setRound(0), []);

  const expression = isComplete ? 'excited' : cleanCount > activeTeeth.length / 2 ? 'happy' : 'curious';

  return (
    <div className="relative w-full h-full overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <BathroomScene />
      <BackButton />

      <AnimatePresence>
        {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-14 px-4 pointer-events-none">
        {/* Arthur */}
        <div className="relative flex flex-col items-center pointer-events-none">
          <ArthurBear expression={expression} size={80} />
          {/* Progress arc */}
          {!isComplete && cleanCount > 0 && (
            <div className="flex gap-1 mt-1">
              {activeTeeth.map((t, i) => (
                <motion.div key={t.id}
                  className={`w-3 h-3 rounded-full ${i < cleanCount ? 'bg-sky-400' : 'bg-sky-200/40'}`}
                  animate={i < cleanCount ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={i < cleanCount ? { boxShadow: '0 0 6px #38bdf8' } : {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mouth */}
        <div ref={mouthRef} className="w-full max-w-sm pointer-events-auto">
          <MouthSVG
            teeth={activeTeeth}
            brushCounts={brushCounts}
            brushNeeded={cfg.brushNeeded}
            targetIdx={targetIdx}
          />
        </div>

        {/* Round indicator */}
        <div className="flex gap-1">
          {ROUNDS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300
              ${i <= round ? 'bg-sky-400 scale-110' : 'bg-sky-200/30'}`}
              style={i <= round ? { boxShadow: '0 0 4px #38bdf8' } : {}}
            />
          ))}
        </div>

        {/* Completion */}
        {isComplete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 pointer-events-auto">
            <div className="flex gap-2">
              {[1,2,3].map(s => (
                <motion.div key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.3 + s * 0.15 }}>
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="#facc15">
                    <path d="M10 0l2.4 7.2H20l-6 4.8 2.4 7.2L10 14.4 3.6 19.2 6 12 0 7.2h7.6z" />
                  </svg>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {round < ROUNDS.length - 1 && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                  onClick={handleNextRound}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-xl">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M5 3l14 9-14 9V3z" /></svg>
                </motion.button>
              )}
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.65 }}
                onClick={handlePlayAgain}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-300 to-cyan-500 flex items-center justify-center shadow-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toothbrush follows pointer */}
      {isScrubbing && !isComplete && (
        <Toothbrush x={brushPos.x} y={brushPos.y} active={isOverTooth(brushPos.x, brushPos.y)} />
      )}

      {/* Foam bubbles */}
      <AnimatePresence>
        {foamBubbles.map(b => (
          <FoamBubble key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
