import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playBoing, playSuccess, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Trampoline Jump — tap to bounce a character higher and higher.
 * Collect stars as you go up. No fail state — character always
 * comes back down to bounce again. Celebration every 10 stars.
 */

const STAR_COLOURS = ['#facc15', '#fbbf24', '#f59e0b'];

let starId = 0;
function makeStars(height) {
  // Create stars at various heights
  const stars = [];
  for (let i = 0; i < 8; i++) {
    stars.push({
      id: ++starId,
      x: 15 + Math.random() * 70, // % from left
      y: 20 + i * 8,              // distributed vertically (lower = further up in game space)
      collected: false,
      colour: STAR_COLOURS[Math.floor(Math.random() * STAR_COLOURS.length)],
      size: 28 + Math.random() * 16,
    });
  }
  return stars;
}

/* ---- SVG Character (round bear cub) ---- */
function JumpBear({ squash }) {
  return (
    <svg viewBox="0 0 80 90" className="w-20 h-22 drop-shadow-lg">
      {/* Body */}
      <ellipse cx="40" cy="62" rx="22" ry="20" fill="#C4884D" />
      <ellipse cx="40" cy="62" rx="18" ry="16" fill="#D4A06A" />
      {/* Head */}
      <circle cx="40" cy="35" r="22" fill="#C4884D" />
      {/* Ears */}
      <circle cx="22" cy="18" r="9" fill="#C4884D" />
      <circle cx="22" cy="18" r="5" fill="#D4A06A" />
      <circle cx="58" cy="18" r="9" fill="#C4884D" />
      <circle cx="58" cy="18" r="5" fill="#D4A06A" />
      {/* Face */}
      <ellipse cx="40" cy="40" rx="12" ry="9" fill="#E8C49A" />
      {/* Eyes */}
      <circle cx="32" cy="32" r="3.5" fill="#333" />
      <circle cx="48" cy="32" r="3.5" fill="#333" />
      <circle cx="33" cy="31" r="1.2" fill="white" />
      <circle cx="49" cy="31" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="38" rx="4" ry="3" fill="#8B5E3C" />
      {/* Mouth */}
      <path d="M36 42 Q40 46 44 42" stroke="#8B5E3C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="26" cy="38" r="4" fill="#F5B88A" opacity="0.5" />
      <circle cx="54" cy="38" r="4" fill="#F5B88A" opacity="0.5" />
      {/* Arms — up when jumping */}
      <ellipse cx="16" cy="52" rx="6" ry="10" fill="#C4884D" transform="rotate(-20,16,52)" />
      <ellipse cx="64" cy="52" rx="6" ry="10" fill="#C4884D" transform="rotate(20,64,52)" />
      {/* Feet */}
      <ellipse cx="28" cy="80" rx="10" ry="6" fill="#C4884D" />
      <ellipse cx="52" cy="80" rx="10" ry="6" fill="#C4884D" />
    </svg>
  );
}

/* ---- Star SVG ---- */
function StarSVG({ colour, size }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <polygon
        points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
        fill={colour}
        stroke="#ca8a04"
        strokeWidth="0.5"
      />
      <polygon
        points="12,5 14,10 19,10 15,13 16.5,18 12,15 7.5,18 9,13 5,10 10,10"
        fill="white"
        opacity="0.25"
      />
    </svg>
  );
}

/* ---- Trampoline SVG ---- */
function Trampoline() {
  return (
    <svg viewBox="0 0 200 60" className="w-48 h-14">
      {/* Legs */}
      <line x1="30" y1="20" x2="15" y2="58" stroke="#666" strokeWidth="4" strokeLinecap="round" />
      <line x1="170" y1="20" x2="185" y2="58" stroke="#666" strokeWidth="4" strokeLinecap="round" />
      {/* Frame */}
      <ellipse cx="100" cy="20" rx="75" ry="8" fill="none" stroke="#555" strokeWidth="4" />
      {/* Bounce surface */}
      <ellipse cx="100" cy="18" rx="70" ry="6" fill="#3b82f6" opacity="0.8" />
      <ellipse cx="100" cy="16" rx="60" ry="3" fill="#60a5fa" opacity="0.5" />
      {/* Springs */}
      {[40, 60, 80, 100, 120, 140, 160].map(x => (
        <path key={x} d={`M${x} 26 Q${x-3} 32 ${x} 38 Q${x+3} 44 ${x} 50`}
              stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      ))}
    </svg>
  );
}

export default function TrampolineJump() {
  const [bounceHeight, setBounceHeight] = useState(0); // 0 = on trampoline, higher = more up
  const [isJumping, setIsJumping] = useState(false);
  const [stars, setStars] = useState(() => makeStars(100));
  const [score, setScore] = useState(0);
  const [squash, setSquash] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const scoreRef = useRef(0);

  const { burst, Bursts } = useParticleBurst();
  const { peek, Peeks } = useArthurPeek();
  const { celebrate, Overlay } = useCelebration();

  // Collect stars near the character's current height
  const collectStars = useCallback((height) => {
    let collected = 0;
    setStars(prev => prev.map(s => {
      if (s.collected) return s;
      // Star is collectible if bear is near its height
      const heightMatch = Math.abs((80 - height) - s.y) < 12;
      const xMatch = Math.abs(50 - s.x) < 20; // bear is centered at ~50%
      if (heightMatch && xMatch) {
        collected++;
        playCollectPing();
        return { ...s, collected: true };
      }
      return s;
    }));

    if (collected > 0) {
      const newScore = scoreRef.current + collected;
      scoreRef.current = newScore;
      setScore(newScore);

      // Burst at center where bear is
      burst(window.innerWidth / 2, window.innerHeight * 0.4, {
        colors: ['#facc15', '#fbbf24', '#fff'],
        count: 10,
        spread: 40,
        shapes: ['star'],
      });

      if (newScore > 0 && newScore % 10 === 0) {
        setTimeout(() => {
          playCelebrate();
          celebrate({ colors: ['#facc15', '#f59e0b', '#fbbf24', '#ec4899'] });
        }, 300);
      } else if (newScore > 0 && newScore % 5 === 0) {
        setTimeout(() => {
          playSuccess();
          peek('excited');
        }, 200);
      }
    }
  }, [burst, celebrate, peek]);

  const handleJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    playBoing();

    // Squash effect before jump
    setSquash(true);
    setTimeout(() => setSquash(false), 120);

    const jumpHeight = 40 + Math.random() * 25; // % of screen to jump up
    setJumpCount(c => c + 1);
    setBounceHeight(jumpHeight);

    // Collect stars at peak
    setTimeout(() => {
      collectStars(jumpHeight);
    }, 400);

    // Come back down
    setTimeout(() => {
      setBounceHeight(0);
      setIsJumping(false);

      // If all stars collected, spawn new batch
      setStars(prev => {
        const remaining = prev.filter(s => !s.collected);
        if (remaining.length <= 1) {
          playSparkle();
          return makeStars(100);
        }
        return prev;
      });
    }, 900);
  }, [isJumping, collectStars]);

  const TRAMPOLINE_Y = 78; // % from top

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-600"
         onClick={handleJump}>
      {/* Starfield background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 60}%`}
            r={1 + Math.random() * 1.5}
            fill="white"
            opacity={0.3 + Math.random() * 0.5}
          />
        ))}
      </svg>

      {/* Moon */}
      <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200"
           style={{ boxShadow: '0 0 30px rgba(250,250,200,0.4)' }} />

      {/* Stars to collect */}
      <AnimatePresence>
        {stars.filter(s => !s.collected).map(s => (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none z-10"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <StarSVG colour={s.colour} size={s.size} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Trampoline */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20"
           style={{ top: `${TRAMPOLINE_Y}%` }}>
        <Trampoline />
      </div>

      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 z-10"
           style={{ top: `${TRAMPOLINE_Y + 6}%`, background: 'linear-gradient(to bottom, #22c55e, #16a34a)' }} />

      {/* Character */}
      <motion.div
        className="absolute left-1/2 z-30"
        style={{ transform: 'translateX(-50%)' }}
        animate={{
          top: `${TRAMPOLINE_Y - 12 - bounceHeight * 0.6}%`,
          scaleY: squash ? 0.6 : 1,
          scaleX: squash ? 1.3 : 1,
        }}
        transition={{
          top: { type: 'spring', stiffness: 150, damping: 14 },
          scaleY: { duration: 0.1 },
          scaleX: { duration: 0.1 },
        }}
      >
        <JumpBear squash={squash} />
      </motion.div>

      {/* Score */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
        <StarSVG colour="#facc15" size={24} />
        <motion.span
          key={score}
          className="text-2xl font-heading font-bold text-yellow-300"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {score}
        </motion.span>
      </div>

      {/* Tap hint */}
      {jumpCount === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 flex items-center gap-3">
            <span className="text-3xl">👆</span>
            <span className="text-3xl font-heading text-white">Tap!</span>
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
