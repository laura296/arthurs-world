import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playBoing, playSuccess, playSparkle, playCelebrate, playPop, playTone } from '../../hooks/useSound';

/**
 * Dance Along — a character shows dance moves, Arthur taps along to the beat.
 * Big colourful buttons pulse in rhythm. Tap any to trigger a dance move
 * with fun animation and sounds. No fail state — just joyful movement.
 * Celebration every 12 moves.
 */

const DANCE_MOVES = [
  { id: 'jump',  label: 'Jump',  colour: '#ef4444', icon: 'jump',  freq: 400 },
  { id: 'spin',  label: 'Spin',  colour: '#facc15', icon: 'spin',  freq: 500 },
  { id: 'wave',  label: 'Wave',  colour: '#22c55e', icon: 'wave',  freq: 600 },
  { id: 'stomp', label: 'Stomp', colour: '#38bdf8', icon: 'stomp', freq: 350 },
  { id: 'wiggle', label: 'Wiggle', colour: '#ec4899', icon: 'wiggle', freq: 550 },
  { id: 'clap', label: 'Clap', colour: '#8b5cf6', icon: 'clap', freq: 700 },
];

/* ---- Dance character SVG ---- */
function DanceBear({ move }) {
  // Different poses based on current move
  const armAngleL = move === 'wave' ? -60 : move === 'clap' ? -40 : move === 'jump' ? -50 : -20;
  const armAngleR = move === 'wave' ? -60 : move === 'clap' ? -40 : move === 'jump' ? -50 : -20;
  const legSpread = move === 'stomp' ? 8 : move === 'wiggle' ? 6 : 0;

  return (
    <svg viewBox="0 0 120 160" className="w-32 h-40 drop-shadow-lg">
      {/* Body */}
      <ellipse cx="60" cy="100" rx="28" ry="30" fill="#C4884D" />
      <ellipse cx="60" cy="100" rx="22" ry="24" fill="#D4A06A" />
      {/* Head */}
      <circle cx="60" cy="50" r="28" fill="#C4884D" />
      {/* Ears */}
      <circle cx="36" cy="28" r="11" fill="#C4884D" />
      <circle cx="36" cy="28" r="7" fill="#D4A06A" />
      <circle cx="84" cy="28" r="11" fill="#C4884D" />
      <circle cx="84" cy="28" r="7" fill="#D4A06A" />
      {/* Face */}
      <ellipse cx="60" cy="56" rx="15" ry="11" fill="#E8C49A" />
      {/* Eyes — happy/excited */}
      <path d="M48 46 Q52 42 56 46" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M64 46 Q68 42 72 46" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="54" rx="5" ry="3.5" fill="#8B5E3C" />
      {/* Big smile */}
      <path d="M48 60 Q60 72 72 60" stroke="#8B5E3C" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="40" cy="56" r="5" fill="#F5B88A" opacity="0.5" />
      <circle cx="80" cy="56" r="5" fill="#F5B88A" opacity="0.5" />
      {/* Left arm */}
      <ellipse cx="28" cy="88" rx="8" ry="14" fill="#C4884D"
               transform={`rotate(${armAngleL},28,88)`} />
      {/* Right arm */}
      <ellipse cx="92" cy="88" rx="8" ry="14" fill="#C4884D"
               transform={`rotate(${armAngleR},92,88)`} />
      {/* Left leg */}
      <ellipse cx={48 - legSpread} cy="132" rx="12" ry="8" fill="#C4884D" />
      {/* Right leg */}
      <ellipse cx={72 + legSpread} cy="132" rx="12" ry="8" fill="#C4884D" />
    </svg>
  );
}

/* ---- Move icon SVGs ---- */
function MoveIcon({ icon, size = 40 }) {
  switch (icon) {
    case 'jump':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M20 30 L20 15 M14 22 L20 15 L26 22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'spin':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M20 8 A12 12 0 1 1 8 20" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M20 8 L16 14 M20 8 L26 10" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'wave':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M10 30 Q15 20 20 25 Q25 30 30 15" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="12" r="3" fill="white" />
        </svg>
      );
    case 'stomp':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M20 10 L20 25 M14 18 L20 25 L26 18" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          <line x1="10" y1="32" x2="30" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'wiggle':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M8 20 Q14 10 20 20 Q26 30 32 20" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'clap':
      return (
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M12 25 L18 15 M28 25 L22 15" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="12" r="4" fill="white" opacity="0.6" />
          {/* Sparkle lines */}
          <line x1="14" y1="8" x2="12" y2="4" stroke="white" strokeWidth="1.5" />
          <line x1="26" y1="8" x2="28" y2="4" stroke="white" strokeWidth="1.5" />
          <line x1="20" y1="6" x2="20" y2="2" stroke="white" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DanceAlong() {
  const [currentMove, setCurrentMove] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [characterAnim, setCharacterAnim] = useState('idle');
  const moveCountRef = useRef(0);

  const { burst, Bursts } = useParticleBurst();
  const { peek, Peeks } = useArthurPeek();
  const { celebrate, Overlay } = useCelebration();

  // Gentle pulse animation for buttons (mimics a beat)
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % DANCE_MOVES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleMove = useCallback((e, move) => {
    e.stopPropagation();

    // Play a musical tone based on the move
    playTone(move.freq, 0.2, 'sine');
    playBoing();

    setCurrentMove(move.id);
    setCharacterAnim(move.id);

    // Particle burst from the button
    const box = e.currentTarget.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, {
      colors: [move.colour, '#fff', '#facc15'],
      count: 12,
      spread: 50,
      shapes: ['star', 'circle', 'heart'],
    });

    moveCountRef.current++;
    setMoveCount(moveCountRef.current);

    if (moveCountRef.current > 0 && moveCountRef.current % 12 === 0) {
      setTimeout(() => {
        playCelebrate();
        celebrate({ colors: DANCE_MOVES.map(m => m.colour) });
      }, 300);
    } else if (moveCountRef.current > 0 && moveCountRef.current % 6 === 0) {
      setTimeout(() => {
        playSuccess();
        peek('excited');
      }, 200);
    }

    // Reset character animation after a moment
    setTimeout(() => {
      setCharacterAnim('idle');
      setCurrentMove(null);
    }, 700);
  }, [burst, celebrate, peek]);

  // Character animation variants
  const characterVariants = {
    idle: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    jump: { y: -40, rotate: 0, scaleX: 1, scaleY: 1.1 },
    spin: { y: -10, rotate: 360, scaleX: 1, scaleY: 1 },
    wave: { y: 0, rotate: 5, scaleX: 1, scaleY: 1 },
    stomp: { y: 10, rotate: 0, scaleX: 1.1, scaleY: 0.85 },
    wiggle: { y: 0, rotate: 0, scaleX: 1.15, scaleY: 0.9 },
    clap: { y: -5, rotate: 0, scaleX: 0.95, scaleY: 1.05 },
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400">
      {/* Disco lights / party background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Rotating glow */}
        <motion.div
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05), transparent, rgba(255,255,255,0.05), transparent)',
          }}
        />
      </div>

      {/* Dance floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] z-0">
        <div className="w-full h-full bg-gradient-to-t from-purple-900/60 to-transparent" />
        {/* Floor tiles effect */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <rect key={i} x={i * 50} y={0} width={50} height={100}
                  fill={i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'} />
          ))}
        </svg>
      </div>

      {/* Character */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ bottom: '30%' }}>
        <motion.div
          animate={characterVariants[characterAnim]}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 12,
            rotate: { duration: 0.5 },
          }}
        >
          <DanceBear move={currentMove || 'idle'} />
        </motion.div>

        {/* Move label flash */}
        <AnimatePresence>
          {currentMove && (
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 font-heading text-2xl text-white drop-shadow-lg whitespace-nowrap"
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {DANCE_MOVES.find(m => m.id === currentMove)?.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dance move buttons — arranged in an arc at the bottom */}
      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center gap-3 px-4">
        {DANCE_MOVES.map((move, i) => (
          <motion.button
            key={move.id}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 active:scale-90"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${move.colour}cc, ${move.colour})`,
              boxShadow: `0 0 ${pulsePhase === i ? 20 : 8}px ${move.colour}80`,
              touchAction: 'none',
            }}
            onPointerDown={(e) => handleMove(e, move)}
            animate={{
              scale: pulsePhase === i ? 1.15 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <MoveIcon icon={move.icon} size={32} />
          </motion.button>
        ))}
      </div>

      {/* Score */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
        <svg viewBox="0 0 24 24" width={24} height={24}>
          <path d="M12 2 Q8 6 4 6 Q4 14 12 22 Q20 14 20 6 Q16 6 12 2Z" fill="#ec4899" />
        </svg>
        <motion.span
          key={moveCount}
          className="text-2xl font-heading font-bold text-white"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {moveCount}
        </motion.span>
      </div>

      {/* Tap hint */}
      {moveCount === 0 && (
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          animate={{ opacity: [1, 0.4, 1], y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 flex items-center gap-3">
            <span className="text-3xl">👆</span>
            <span className="text-2xl font-heading text-white">Tap to dance!</span>
          </div>
        </motion.div>
      )}

      <BackButton />
      <Bursts />
      <Peeks />
      <Overlay />
    </div>
  );
}
