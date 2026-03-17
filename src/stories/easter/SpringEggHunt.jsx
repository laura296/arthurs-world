import { useState, useCallback } from 'react';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { playPop, playSuccess, playSparkle, playPageTurn } from '../../hooks/useSound';

const PAGES = [
  {
    bg: 'linear-gradient(180deg, #bfdbfe 0%, #d9f99d 60%, #86efac 100%)',
    text: "Little Rabbit Rosie woke up with the sun,\n\"Today is Egg Hunt Day \u2014 oh what fun!\"",
    eggColor: null,
  },
  {
    bg: 'linear-gradient(180deg, #93c5fd 0%, #86efac 50%, #4ade80 100%)',
    text: "She hopped to the garden where the tulips grow tall,\nand found a PINK egg hiding under a wall!",
    eggColor: '#f9a8d4',
  },
  {
    bg: 'linear-gradient(180deg, #7dd3fc 0%, #67e8f9 40%, #86efac 100%)',
    text: "By the pond where the froggy sits on his pad,\nshe spotted a BLUE egg \u2014 \"That makes me glad!\"",
    eggColor: '#93c5fd',
  },
  {
    bg: 'linear-gradient(180deg, #86efac 0%, #a3e635 40%, #65a30d 100%)',
    text: "Under the oak where the squirrel hides his nuts,\na GOLDEN egg sat in the mossy tree ruts.",
    eggColor: '#fde68a',
  },
  {
    bg: 'linear-gradient(180deg, #d9f99d 0%, #a16207 60%, #92400e 100%)',
    text: "Down by her burrow, tucked under the ground,\na PURPLE egg waited, all shiny and round!",
    eggColor: '#c4b5fd',
  },
  {
    bg: 'linear-gradient(180deg, #bfdbfe 0%, #86efac 50%, #fde68a 100%)',
    text: "In the meadow she twirled and she spun with delight,\na GREEN egg was gleaming so sparkly and bright!",
    eggColor: '#86efac',
  },
  {
    bg: 'linear-gradient(180deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
    text: "Five pretty eggs, all colours of spring!\nRosie hopped home while the bluebirds sing.",
    eggColor: null,
  },
  {
    bg: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 40%, #f9a8d4 100%)',
    text: "She shared every egg with her family so dear.\n\"Happy Easter to all \u2014 the best time of year!\"",
    eggColor: null,
  },
];

function RabbitSVG({ size = 60 }) {
  return (
    <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
      <ellipse cx="22" cy="12" rx="7" ry="18" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <ellipse cx="22" cy="12" rx="4" ry="14" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="38" cy="10" rx="7" ry="18" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <ellipse cx="38" cy="10" rx="4" ry="14" fill="#fca5a5" opacity="0.5" />
      <circle cx="30" cy="35" r="16" fill="white" />
      <circle cx="24" cy="33" r="2.5" fill="#1e293b" />
      <circle cx="36" cy="33" r="2.5" fill="#1e293b" />
      <circle cx="25" cy="32" r="1" fill="white" />
      <circle cx="37" cy="32" r="1" fill="white" />
      <ellipse cx="30" cy="38" rx="2.5" ry="2" fill="#fca5a5" />
      <line x1="14" y1="37" x2="24" y2="38" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="14" y1="40" x2="24" y2="39" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="36" y1="38" x2="46" y2="37" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="36" y1="39" x2="46" y2="40" stroke="#d1d5db" strokeWidth="0.8" />
      <ellipse cx="30" cy="58" rx="14" ry="16" fill="white" />
      <circle cx="44" cy="62" r="5" fill="white" />
      <ellipse cx="22" cy="72" rx="6" ry="3" fill="white" stroke="#e5e7eb" strokeWidth="0.8" />
      <ellipse cx="38" cy="72" rx="6" ry="3" fill="white" stroke="#e5e7eb" strokeWidth="0.8" />
      <circle cx="20" cy="38" r="4" fill="#fca5a5" opacity="0.3" />
      <circle cx="40" cy="38" r="4" fill="#fca5a5" opacity="0.3" />
    </svg>
  );
}

function EggIcon({ color, size = 30 }) {
  return (
    <svg viewBox="0 0 30 40" width={size} height={size * 1.33}>
      <ellipse cx="15" cy="22" rx="12" ry="16" fill={color} />
      <ellipse cx="12" cy="18" rx="4" ry="6" fill="white" opacity="0.3" />
    </svg>
  );
}

function SceneSVG({ pageIdx, found, onFind }) {
  const page = PAGES[pageIdx];

  if (pageIdx === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[15%] right-[20%] cursor-pointer"
             onPointerDown={() => onFind()}
             style={{ animation: found ? 'celebrationText 0.6s ease-out both' : '' }}>
          <div className="w-24 h-24 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50"
               style={{ animation: 'pulse 2s ease-in-out infinite', boxShadow: found ? '0 0 60px #fde68a' : '0 0 30px #fde68a80' }} />
        </div>
        <div className="absolute bottom-[30%]">
          <RabbitSVG size={80} />
        </div>
      </div>
    );
  }

  if (pageIdx >= 1 && pageIdx <= 5) {
    return (
      <div className="absolute inset-0">
        <div className="absolute bottom-[25%] left-[15%]" style={{ animation: 'gentleIn 0.5s ease-out both' }}>
          <RabbitSVG size={60} />
        </div>
        <div
          className="absolute cursor-pointer"
          style={{ bottom: '28%', right: '20%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onPointerDown={() => !found && onFind()}
        >
          {found ? (
            <div style={{ animation: 'springIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <EggIcon color={page.eggColor} size={50} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm border-2 border-dashed border-white/50
                            flex items-center justify-center animate-pulse text-3xl">
              ❓
            </div>
          )}
        </div>
      </div>
    );
  }

  if (pageIdx === 6) {
    const allEggColors = ['#f9a8d4', '#93c5fd', '#fde68a', '#c4b5fd', '#86efac'];
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute bottom-[30%] cursor-pointer" onPointerDown={() => onFind()}>
          <div className="relative">
            <span className="text-7xl" style={{ animation: found ? 'celebrationText 0.6s ease-out both' : '' }}>🧺</span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
              {allEggColors.map((c, i) => (
                <div key={i} style={{ animation: `springIn 0.4s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both` }}>
                  <EggIcon color={c} size={22} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[15%]">
          <RabbitSVG size={60} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="cursor-pointer" onPointerDown={() => onFind()}>
        <div className="flex gap-4 items-end" style={{ animation: 'gentleIn 0.5s ease-out both' }}>
          <RabbitSVG size={50} />
          <RabbitSVG size={40} />
          <RabbitSVG size={60} />
          <RabbitSVG size={35} />
        </div>
      </div>
      {found && (
        <div className="absolute top-[20%] text-6xl" style={{ animation: 'celebrationText 0.6s ease-out both' }}>
          🎉
        </div>
      )}
    </div>
  );
}

export default function SpringEggHunt() {
  const [page, setPage] = useState(0);
  const [found, setFound] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();

  const goNext = useCallback(() => {
    if (page < PAGES.length - 1) {
      playPageTurn();
      setPage(p => p + 1);
      setFound(false);
    }
  }, [page]);

  const goPrev = useCallback(() => {
    if (page > 0) {
      playPageTurn();
      setPage(p => p - 1);
      setFound(false);
    }
  }, [page]);

  const handleFind = useCallback(() => {
    if (found) return;
    setFound(true);
    playPop();
    playSparkle();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const pg = PAGES[page];

    burst(cx, cy, {
      count: 12,
      spread: 50,
      colors: pg.eggColor
        ? [pg.eggColor, '#fde68a', '#f9a8d4']
        : ['#fde68a', '#f9a8d4', '#86efac', '#c4b5fd'],
      shapes: ['star', 'circle', 'heart'],
    });

    if (page === PAGES.length - 1) {
      playSuccess();
    }
  }, [found, page, burst]);

  const currentPage = PAGES[page];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: currentPage.bg }}>
      <BackButton />

      <SceneSVG pageIdx={page} found={found} onFind={handleFind} />

      {/* Story text */}
      <div className="absolute bottom-[18%] left-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border border-white/60 max-w-lg mx-auto">
          <p className="text-lg font-body text-amber-900 text-center leading-relaxed whitespace-pre-line">
            {currentPage.text}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-between px-6">
        <button
          onPointerDown={goPrev}
          className={`w-16 h-16 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center
                     border-2 border-white/40 shadow-lg active:scale-90 transition-transform
                     ${page === 0 ? 'opacity-30 pointer-events-none' : ''}`}
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#78350f" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-2">
          {PAGES.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === page ? 'bg-amber-600 scale-125' : 'bg-amber-300/60'
            }`} />
          ))}
        </div>

        <button
          onPointerDown={goNext}
          className={`w-16 h-16 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center
                     border-2 border-white/40 shadow-lg active:scale-90 transition-transform
                     ${page === PAGES.length - 1 ? 'opacity-30 pointer-events-none' : ''}`}
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#78350f" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ParticleLayer />
    </div>
  );
}
