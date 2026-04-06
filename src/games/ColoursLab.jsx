import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playSparkle, playBoing } from '../hooks/useSound';
import { useCelebration } from '../components/CelebrationOverlay';

/**
 * Colours Lab — mix primary colours to discover new ones.
 * Tap two colour pots to mix them. A ~3.5 year old can learn:
 * red+yellow=orange, red+blue=purple, blue+yellow=green, etc.
 */

const PRIMARY_COLOURS = [
  { id: 'red',    fill: '#ef4444', emoji: '🔴', label: 'Red' },
  { id: 'yellow', fill: '#eab308', emoji: '🟡', label: 'Yellow' },
  { id: 'blue',   fill: '#3b82f6', emoji: '🔵', label: 'Blue' },
  { id: 'white',  fill: '#f1f5f9', emoji: '⚪', label: 'White' },
];

const MIX_RESULTS = {
  'red+yellow':   { fill: '#f97316', emoji: '🟠', label: 'Orange!' },
  'red+blue':     { fill: '#a855f7', emoji: '🟣', label: 'Purple!' },
  'blue+yellow':  { fill: '#22c55e', emoji: '🟢', label: 'Green!' },
  'red+white':    { fill: '#f9a8d4', emoji: '🩷', label: 'Pink!' },
  'blue+white':   { fill: '#7dd3fc', emoji: '🩵', label: 'Light Blue!' },
  'yellow+white': { fill: '#fef08a', emoji: '💛', label: 'Cream!' },
  'red+red':      { fill: '#dc2626', emoji: '🔴', label: 'Red!' },
  'blue+blue':    { fill: '#2563eb', emoji: '🔵', label: 'Blue!' },
  'yellow+yellow':{ fill: '#ca8a04', emoji: '🟡', label: 'Yellow!' },
  'white+white':  { fill: '#ffffff', emoji: '⚪', label: 'White!' },
};

function getMixResult(a, b) {
  const key1 = `${a}+${b}`;
  const key2 = `${b}+${a}`;
  return MIX_RESULTS[key1] || MIX_RESULTS[key2] || { fill: '#6b7280', emoji: '🤔', label: 'Hmm!' };
}

/** Animated paint splash */
function PaintSplash({ colour, x, y }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x - 20, top: y - 20, background: colour }}
      initial={{ width: 40, height: 40, opacity: 0.8 }}
      animate={{ width: 100, height: 100, opacity: 0, x: -30, y: -30 }}
      transition={{ duration: 0.6 }}
    />
  );
}

export default function ColoursLab() {
  const [selected, setSelected] = useState([]); // up to 2 selected colour ids
  const [mixResult, setMixResult] = useState(null);
  const [splashes, setSplashes] = useState([]);
  const [discoveries, setDiscoveries] = useState(new Set());
  const { celebrate, overlay } = useCelebration();

  const totalMixes = 6; // red+yellow, red+blue, blue+yellow, red+white, blue+white, yellow+white

  const handleColourTap = useCallback((colour) => {
    playPop();

    if (selected.length === 0) {
      setSelected([colour.id]);
      setMixResult(null);
    } else if (selected.length === 1) {
      const newSelected = [...selected, colour.id];
      setSelected(newSelected);

      // Mix!
      const result = getMixResult(newSelected[0], newSelected[1]);
      setMixResult(result);
      playBoing();

      // Track unique discoveries
      const key = [newSelected[0], newSelected[1]].sort().join('+');
      if (!discoveries.has(key) && newSelected[0] !== newSelected[1]) {
        const newDisc = new Set(discoveries);
        newDisc.add(key);
        setDiscoveries(newDisc);

        if (newDisc.size >= totalMixes) {
          setTimeout(() => {
            playSparkle();
            celebrate();
          }, 800);
        } else {
          setTimeout(() => playSuccess(), 400);
        }
      }

      // Add splash
      setSplashes(prev => [...prev, { id: Date.now(), colour: result.fill }]);

      // Reset after showing result
      setTimeout(() => {
        setSelected([]);
      }, 1500);
    }
  }, [selected, discoveries, celebrate]);

  const resetLab = useCallback(() => {
    setSelected([]);
    setMixResult(null);
    setSplashes([]);
    setDiscoveries(new Set());
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-100 to-orange-100">
      <BackButton />
      {overlay}

      {/* Splashes behind everything */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {splashes.slice(-10).map(s => (
          <PaintSplash key={s.id} colour={s.colour}
            x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400)}
            y={Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center h-full pt-20 pb-8 px-4">
        {/* Title area with discovery counter */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎨</span>
          <div className="flex gap-1">
            {Array.from({ length: totalMixes }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-4 h-4 rounded-full ${i < discoveries.size ? 'bg-amber-400' : 'bg-amber-200'}`}
                animate={i < discoveries.size ? { scale: [1, 1.3, 1] } : {}}
              />
            ))}
          </div>
        </div>

        {/* Mixing bowl */}
        <motion.div
          className="w-48 h-48 rounded-full flex items-center justify-center mb-8 shadow-xl border-4 border-white/50"
          style={{
            background: mixResult
              ? mixResult.fill
              : selected.length === 1
                ? PRIMARY_COLOURS.find(c => c.id === selected[0])?.fill + '40'
                : 'rgba(255,255,255,0.5)',
          }}
          animate={mixResult ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {mixResult ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-6xl">{mixResult.emoji}</span>
                <span className="text-lg font-heading text-white drop-shadow-lg mt-1">
                  {mixResult.label}
                </span>
              </motion.div>
            ) : selected.length === 1 ? (
              <motion.span
                key="waiting"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-5xl"
              >
                {PRIMARY_COLOURS.find(c => c.id === selected[0])?.emoji}
              </motion.span>
            ) : (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl"
              >
                🧪
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instruction */}
        <p className="text-lg font-heading text-amber-800/60 mb-6 text-center">
          {selected.length === 0
            ? 'Tap a colour!'
            : selected.length === 1
              ? 'Now tap another!'
              : ''}
        </p>

        {/* Colour pots */}
        <div className="flex gap-5 flex-wrap justify-center">
          {PRIMARY_COLOURS.map((colour) => {
            const isSelected = selected.includes(colour.id);
            return (
              <motion.button
                key={colour.id}
                onClick={() => handleColourTap(colour)}
                className="w-20 h-20 rounded-full shadow-lg border-4 flex items-center justify-center"
                style={{
                  background: colour.fill,
                  borderColor: isSelected ? '#facc15' : 'rgba(255,255,255,0.5)',
                }}
                whileTap={{ scale: 0.85 }}
                animate={isSelected ? { scale: 1.15, y: -8 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <span className="text-3xl drop-shadow">{colour.emoji}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Discovery gallery */}
        {discoveries.size > 0 && (
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            {Array.from(discoveries).map(key => {
              const [a, b] = key.split('+');
              const result = getMixResult(a, b);
              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 rounded-full shadow-md flex items-center justify-center"
                  style={{ background: result.fill }}
                >
                  <span className="text-xl">{result.emoji}</span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Reset */}
        {discoveries.size > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetLab}
            className="mt-4 px-4 py-2 rounded-xl bg-white/50 text-amber-700 font-heading text-sm"
          >
            Start Again
          </motion.button>
        )}
      </div>
    </div>
  );
}
