import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

const EGG_COLORS = ['#fde68a', '#f9a8d4', '#93c5fd', '#86efac', '#c4b5fd'];

const SLOT_POSITIONS = [
  { x: '18%', y: '58%' },
  { x: '38%', y: '55%' },
  { x: '58%', y: '56%' },
  { x: '78%', y: '58%' },
];

let nextId = 0;
function makeEgg(slotIdx) {
  return {
    id: ++nextId,
    slot: slotIdx,
    color: EGG_COLORS[Math.floor(Math.random() * EGG_COLORS.length)],
    taps: 0,
    hatched: false,
    chick: false,
    leaving: false,
  };
}

function EggSVG({ color, taps }) {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
      <defs>
        <radialGradient id="egg-sheen" cx="0.35" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="55" rx="30" ry="38" fill={color} />
      <ellipse cx="40" cy="55" rx="30" ry="38" fill="url(#egg-sheen)" />
      <circle cx="30" cy="45" r="4" fill="white" opacity="0.4" />
      <circle cx="50" cy="50" r="3" fill="white" opacity="0.3" />
      <circle cx="35" cy="65" r="3.5" fill="white" opacity="0.35" />
      <circle cx="48" cy="40" r="2.5" fill="white" opacity="0.3" />
      {taps >= 1 && (
        <path d="M32,42 L40,50 L36,58" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {taps >= 2 && (
        <>
          <path d="M45,38 L40,48 L48,55" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30,55 L38,58 L34,66" fill="none" stroke="#78716c" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function ChickSVG() {
  return (
    <svg viewBox="0 0 70 80" className="w-full h-full">
      <ellipse cx="35" cy="50" rx="22" ry="24" fill="#fde68a" />
      <circle cx="35" cy="28" r="16" fill="#fde68a" />
      <circle cx="29" cy="26" r="2.5" fill="#1e293b" />
      <circle cx="41" cy="26" r="2.5" fill="#1e293b" />
      <circle cx="30" cy="25" r="1" fill="white" />
      <circle cx="42" cy="25" r="1" fill="white" />
      <polygon points="35,30 31,34 39,34" fill="#fb923c" />
      <ellipse cx="15" cy="48" rx="8" ry="12" fill="#fcd34d" transform="rotate(-15,15,48)" />
      <ellipse cx="55" cy="48" rx="8" ry="12" fill="#fcd34d" transform="rotate(15,55,48)" />
      <path d="M28,72 L24,78 M28,72 L28,78 M28,72 L32,78" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M42,72 L38,78 M42,72 L42,78 M42,72 L46,78" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="23" cy="31" r="4" fill="#fca5a5" opacity="0.4" />
      <circle cx="47" cy="31" r="4" fill="#fca5a5" opacity="0.4" />
    </svg>
  );
}

function NestSVG() {
  return (
    <svg viewBox="0 0 500 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="250" cy="100" rx="230" ry="70" fill="#92400e" />
      <ellipse cx="250" cy="90" rx="210" ry="55" fill="#a16207" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={i}
          d={`M${60 + i * 55},${75 + (i % 2) * 15} Q${90 + i * 55},${65 + (i % 3) * 10} ${120 + i * 55},${80 + (i % 2) * 12}`}
          fill="none" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" opacity="0.6"
        />
      ))}
      <ellipse cx="250" cy="85" rx="190" ry="42" fill="#d97706" opacity="0.5" />
      <path d="M40,100 Q120,140 250,145 Q380,140 460,100" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Floating spring petals */
function FloatingPetals() {
  const petals = ['🌸', '🌼', '🌷', '✿', '🌻', '💐', '🌸', '🌼'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-50"
          style={{ left: `${8 + i * 12}%`, top: -30 }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, Math.sin(i * 1.3) * 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10 + i * 2,
            delay: i * 1.2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function HatchingChicks() {
  const [eggs, setEggs] = useState(() =>
    SLOT_POSITIONS.map((_, i) => makeEgg(i))
  );
  const [chickCount, setChickCount] = useState(0);
  const chickCountRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tapEgg = useCallback((eggId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    setEggs(prev => prev.map(egg => {
      if (egg.id !== eggId || egg.hatched) return egg;

      const newTaps = egg.taps + 1;

      if (newTaps < 3) {
        playBoing();
        burst(cx, cy, {
          count: 6 + newTaps * 2,
          spread: 25 + newTaps * 10,
          colors: [egg.color, '#fef3c7', '#fde68a'],
          shapes: ['circle', 'star'],
        });
        return { ...egg, taps: newTaps };
      }

      // Hatch!
      playPop();
      playSparkle();
      playCollectPing();
      burst(cx, cy, {
        count: 20,
        spread: 65,
        colors: ['#fde68a', '#fcd34d', '#fef3c7', egg.color, '#facc15'],
        shapes: ['star', 'circle', 'heart'],
      });

      const next = chickCountRef.current + 1;
      chickCountRef.current = next;
      setChickCount(next);

      if (next % 3 === 0) {
        peek(next % 6 === 0 ? 'excited' : 'happy');
        playSuccess();
      }
      if (next % 6 === 0) {
        setTimeout(() => {
          celebrate({ message: 'Hooray!', colors: ['#fde68a', '#86efac', '#f9a8d4', '#c4b5fd'] });
          playCelebrate();
        }, 500);
      }

      setTimeout(() => {
        setEggs(p => p.map(eg =>
          eg.id === eggId ? { ...eg, leaving: true } : eg
        ));
      }, 2000);

      setTimeout(() => {
        setEggs(p => p.map(eg =>
          eg.id === eggId ? makeEgg(egg.slot) : eg
        ));
      }, 3000);

      return { ...egg, taps: 3, hatched: true, chick: true };
    }));
  }, [burst, peek, celebrate]);

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #fef3c7 35%, #fffbeb 60%, #d9f99d 100%)' }}>
      <BackButton />

      {/* Background scene — rolling hills + sun */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice">
        {/* Sun */}
        <circle cx="650" cy="80" r="100" fill="#ffe066" opacity="0.15" />
        <circle cx="650" cy="80" r="45" fill="#ffe066" opacity="0.4">
          <animate attributeName="r" values="45;48;45" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Far hills */}
        <path d="M0,380 Q100,340 200,370 Q350,310 500,360 Q650,320 800,370 L800,600 L0,600 Z"
              fill="#86efac" opacity="0.5" />
        <path d="M0,420 Q150,380 300,410 Q500,370 700,400 Q750,395 800,420 L800,600 L0,600 Z"
              fill="#4ade80" opacity="0.4" />
        {/* Grass texture */}
        <g fill="#22c55e" opacity="0.4">
          {[50, 150, 280, 400, 520, 650, 750].map((x, i) => (
            <g key={i}>
              <path d={`M${x},${430 + (i % 3) * 5} Q${x + 4},${410 + (i % 3) * 5} ${x + 8},${430 + (i % 3) * 5}`} />
              <path d={`M${x + 6},${432 + (i % 3) * 5} Q${x + 11},${414 + (i % 3) * 5} ${x + 16},${432 + (i % 3) * 5}`} />
            </g>
          ))}
        </g>
      </svg>

      <FloatingPetals />

      {/* Score badge */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm
                      rounded-full px-5 py-2 border-2 border-amber-300/60 shadow-lg">
        <span className="text-2xl">🐥</span>
        <motion.span
          key={chickCount}
          className="text-2xl font-heading text-amber-700"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {chickCount}
        </motion.span>
      </div>

      {/* Title */}
      <motion.div
        className="absolute top-20 left-0 right-0 text-center z-10"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <h2 className="text-3xl font-heading text-amber-700 drop-shadow"
            style={{ textShadow: '0 2px 8px rgba(217, 119, 6, 0.2)' }}>
          🐣 Hatching Chicks
        </h2>
      </motion.div>

      {/* Nest */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-10">
        <NestSVG />
      </div>

      {/* Eggs / Chicks */}
      <AnimatePresence>
        {eggs.map((egg) => {
          const pos = SLOT_POSITIONS[egg.slot];

          return (
            <motion.div
              key={egg.id}
              className="absolute z-20 cursor-pointer"
              style={{
                left: pos.x,
                top: pos.y,
                width: '18vw',
                maxWidth: '80px',
                height: '22vw',
                maxHeight: '100px',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: egg.leaving ? 0.5 : 1,
                opacity: egg.leaving ? 0 : 1,
                x: egg.leaving ? 300 : 0,
                y: egg.leaving ? -50 : 0,
                rotate: egg.taps === 1 ? [0, -8, 8, -5, 5, 0] : egg.taps === 2 ? [0, -12, 12, -8, 8, -4, 0] : 0,
              }}
              transition={
                egg.leaving
                  ? { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
                  : egg.taps > 0 && egg.taps < 3
                    ? { rotate: { duration: 0.3, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 300, damping: 20 } }
                    : { type: 'spring', stiffness: 300, damping: 20 }
              }
              onPointerDown={(e) => !egg.hatched && tapEgg(egg.id, e)}
            >
              {egg.chick ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <ChickSVG />
                </motion.div>
              ) : (
                <EggSVG color={egg.color} taps={egg.taps} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Grass foreground */}
      <div className="absolute bottom-0 left-0 right-0 h-[12%] z-30 pointer-events-none"
           style={{ background: 'linear-gradient(to top, #4ade80 0%, #4ade8060 60%, transparent 100%)' }} />

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
