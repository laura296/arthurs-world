import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A friendly pointing hand that taps a spot, so a child who can't read
 * knows what to try next. It only appears after a quiet moment.
 *
 * Props:
 *   at       — () => { x, y } in viewport pixels, or null for no hint
 *   down     — true to point down at something below the finger
 *   idleMs   — how long nothing must happen before the hand appears
 *   activity — any value that changes whenever the child does something
 */
export default function HintHand({ at, down = false, idleMs = 3000, activity }) {
  const [spot, setSpot] = useState(null);
  const atRef = useRef(at);
  atRef.current = at;

  useEffect(() => {
    setSpot(null);
    if (!at) return undefined;
    const timer = setTimeout(() => setSpot(atRef.current?.() || null), idleMs);
    return () => clearTimeout(timer);
  }, [activity, idleMs, !!at]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {spot && (
        <motion.div
          key={`${spot.x}-${spot.y}`}
          className="fixed z-[85] pointer-events-none select-none"
          style={{ left: spot.x, top: spot.y, fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 6px 8px rgba(76, 29, 149, 0.35))' }}
          initial={{ opacity: 0, scale: 0.5, x: '-30%', y: down ? '-110%' : '10%' }}
          animate={{
            opacity: 1, scale: [1, 0.88, 1],
            y: down ? ['-110%', '-90%', '-110%'] : ['10%', '-10%', '10%'],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ opacity: { duration: 0.3 }, scale: { duration: 1, repeat: Infinity }, y: { duration: 1, repeat: Infinity } }}
        >
          {down ? '👇' : '👆'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
