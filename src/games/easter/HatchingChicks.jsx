import { useState, useCallback, useRef } from 'react';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate } from '../../hooks/useSound';

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
          count: 4,
          spread: 25,
          colors: [egg.color, '#fef3c7'],
          shapes: ['circle'],
        });
        return { ...egg, taps: newTaps };
      }

      // Hatch!
      playPop();
      playSparkle();
      burst(cx, cy, {
        count: 16,
        spread: 60,
        colors: ['#fde68a', '#fcd34d', '#fef3c7', egg.color],
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
          celebrate({ message: 'Hooray!', colors: ['#fde68a', '#86efac', '#f9a8d4'] });
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
         style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fffbeb 40%, #e0f2fe 100%)' }}>
      <BackButton />

      {/* Floating petals */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute text-2xl pointer-events-none opacity-60"
             style={{
               left: `${10 + i * 16}%`,
               animation: `petal-fall ${6 + i * 1.5}s ${i * 0.8}s ease-in-out infinite`,
               top: '-30px',
             }}>
          {['🌸', '🌼', '🌷', '✿', '🌻', '💐'][i]}
        </div>
      ))}

      {/* Score badge */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm
                      rounded-full px-5 py-2 border-2 border-amber-300/60 shadow-lg">
        <span className="text-2xl">🐥</span>
        <span className="text-2xl font-heading text-amber-700">{chickCount}</span>
      </div>

      {/* Title */}
      <div className="absolute top-20 left-0 right-0 text-center z-10">
        <h2 className="text-3xl font-heading text-amber-700 drop-shadow animate-spring-in"
            style={{ textShadow: '0 2px 8px rgba(217, 119, 6, 0.2)' }}>
          🐣 Hatching Chicks
        </h2>
      </div>

      {/* Nest */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-10">
        <NestSVG />
      </div>

      {/* Eggs / Chicks */}
      {eggs.map((egg) => {
        const pos = SLOT_POSITIONS[egg.slot];
        const wobbleClass = egg.taps === 1 ? 'animate-[wiggle_0.3s_ease-in-out]'
          : egg.taps === 2 ? 'animate-[wiggle_0.2s_ease-in-out_2]' : '';

        return (
          <div
            key={egg.id}
            className={`absolute z-20 cursor-pointer transition-all duration-300 ${wobbleClass}`}
            style={{
              left: pos.x,
              top: pos.y,
              width: '18vw',
              maxWidth: '80px',
              height: '22vw',
              maxHeight: '100px',
              transform: `translate(-50%, -50%) ${egg.leaving ? 'translateX(120vw)' : ''}`,
              transition: egg.leaving ? 'all 1s ease-in' : 'all 0.3s ease',
              opacity: egg.leaving ? 0 : 1,
            }}
            onPointerDown={(e) => !egg.hatched && tapEgg(egg.id, e)}
          >
            {egg.chick ? (
              <div style={{ animation: 'springIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <ChickSVG />
              </div>
            ) : (
              <EggSVG color={egg.color} taps={egg.taps} />
            )}
          </div>
        );
      })}

      {/* Grass foreground */}
      <div className="absolute bottom-0 left-0 right-0 h-[12%] z-30 pointer-events-none"
           style={{ background: 'linear-gradient(to top, #4ade80 0%, #4ade8060 60%, transparent 100%)' }} />

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
