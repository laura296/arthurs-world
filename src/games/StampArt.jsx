import { useRef, useCallback, useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playTap, playWhoosh, playBoing, playCelebrate, playSuccess } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const STAMPS = [
  { emoji: '⭐', label: 'Star' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '🌸', label: 'Flower' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🐶', label: 'Dog' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🐠', label: 'Fish' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🍎', label: 'Apple' },
  { emoji: '🚀', label: 'Rocket' },
];

const SIZES = [
  { label: 'S', px: 36 },
  { label: 'M', px: 56 },
  { label: 'L', px: 80 },
];

const BACKGROUNDS = [
  { id: 'white', bg: '#ffffff', label: '⬜' },
  { id: 'sky',   bg: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)', label: '🌤️' },
  { id: 'night', bg: 'linear-gradient(180deg, #1a1a3e 0%, #2d1b69 100%)', label: '🌙' },
  { id: 'sea',   bg: 'linear-gradient(180deg, #38bdf8 0%, #0369a1 100%)', label: '🌊' },
];

/* ── Scrapbook background ── */
function ScrapbookBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #f0e6d6 0%, #e6d8c4 25%, #d8c8b0 50%, #cbb8a0 75%, #bea890 100%)' }} />
      {/* Cork-board texture dots */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="absolute rounded-full bg-amber-800/5"
          style={{
            width: 2 + (i % 3) * 1.5,
            height: 2 + (i % 3) * 1.5,
            left: `${5 + (i * 17) % 90}%`,
            top: `${8 + (i * 23) % 85}%`,
          }} />
      ))}
      {/* Decorative tape strips */}
      <div className="absolute top-2 left-12 w-12 h-4 bg-yellow-300/15 rotate-[-5deg] rounded-sm" />
      <div className="absolute bottom-3 right-16 w-10 h-3.5 bg-pink-300/15 rotate-[8deg] rounded-sm" />
      {/* Vignette */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(100,70,30,0.2) 100%)' }} />
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['⭐', '❤️', '🦋', '🌈', '🦄'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex gap-3 mb-5">
        {emojis.map((e, i) => (
          <span
            key={i}
            className="text-4xl"
            style={{
              animation: 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
              animationDelay: `${i * 100}ms`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🎨 Stamp Art
      </h2>
      <p className="text-lg font-heading text-amber-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Tap to place stamps!
      </p>
    </div>
  );
}

/**
 * StampArt — tap to place fun emoji stamps on a canvas.
 * Each stamp gets a random slight rotation for a playful, scrapbook feel.
 */
export default function StampArt() {
  const [stampIdx, setStampIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [bgIdx, setBgIdx] = useState(0);
  const [randomMode, setRandomMode] = useState(false);
  const [stamps, setStamps] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef(null);
  const nextId = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const handleTap = useCallback((e) => {
    if (showIntro) return;
    const rect = containerRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const rotation = (Math.random() - 0.5) * 30;

    // Random mode picks a random stamp each tap
    const idx = randomMode
      ? Math.floor(Math.random() * STAMPS.length)
      : stampIdx;

    setStamps(prev => {
      const next = [...prev, {
        id: nextId.current++,
        x, y,
        emoji: STAMPS[idx].emoji,
        size: SIZES[sizeIdx].px,
        rotation,
      }];
      if (next.length > 0 && next.length % 20 === 0) {
        playCelebrate();
        peek('excited');
      } else if (next.length > 0 && next.length % 10 === 0) {
        playSuccess();
        peek('happy');
      }
      return next;
    });

    // Particle burst at tap location
    if (e?.clientX != null) {
      const t2 = e.touches ? e.touches[0] : e;
      burst(t2.clientX, t2.clientY, {
        count: 6,
        spread: 30,
        colors: ['#facc15', '#ec4899', '#38bdf8'],
        shapes: ['star', 'heart'],
      });
    }

    playBoing();
  }, [stampIdx, sizeIdx, randomMode, burst, peek, showIntro]);

  const clear = useCallback(() => {
    setStamps([]);
    playWhoosh();
  }, []);

  const undo = useCallback(() => {
    setStamps(prev => prev.slice(0, -1));
    playTap();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex">
      <ScrapbookBg />
      <BackButton />

      {/* Intro overlay */}
      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* ── Left sidebar: stamp picker ── */}
      <div className="relative flex flex-col items-center pt-16 pb-1 px-1 overflow-y-auto no-scrollbar z-10
                      bg-amber-800/15 backdrop-blur-sm rounded-r-2xl border-r border-amber-700/10">
        <div className="grid grid-cols-2 gap-1">
          {STAMPS.map((s, i) => (
            <button
              key={s.emoji}
              onClick={() => { setStampIdx(i); setRandomMode(false); playTap(); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center
                text-xl transition-all shadow-md
                ${stampIdx === i && !randomMode
                  ? 'bg-amber-200 border-[3px] border-gray-800 scale-115 shadow-lg z-10'
                  : 'bg-white/90 border-[3px] border-white/60'}`}
            >
              {s.emoji}
            </button>
          ))}
          {/* Random mode */}
          <button
            onClick={() => { setRandomMode(r => !r); playPop(); }}
            className={`w-10 h-10 col-span-2 rounded-xl flex items-center justify-center
              text-sm font-heading transition-all shadow-md border-[3px]
              ${randomMode
                ? 'bg-amber-200 border-gray-800 scale-110 shadow-lg z-10'
                : 'bg-white/90 border-white/60'}`}
          >
            🎲
          </button>
        </div>
      </div>

      {/* ── Centre: stamp canvas ── */}
      <div className="relative flex-1 flex items-center justify-center p-2 z-10">
        <div
          ref={containerRef}
          className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden cursor-pointer
                     ring-2 ring-amber-700/15"
          style={{
            touchAction: 'none',
            background: BACKGROUNDS[bgIdx].bg,
          }}
          onPointerDown={handleTap}
        >
          {stamps.map(s => (
            <div
              key={s.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: s.x - s.size / 2,
                top: s.y - s.size / 2,
                width: s.size,
                height: s.size,
                fontSize: s.size * 0.75,
                lineHeight: `${s.size}px`,
                textAlign: 'center',
                transform: `rotate(${s.rotation}deg)`,
                animation: 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {s.emoji}
            </div>
          ))}

          {/* Empty state hint */}
          {stamps.length === 0 && !showIntro && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <span className="text-6xl animate-bounce">
                {randomMode ? '🎲' : STAMPS[stampIdx].emoji}
              </span>
            </div>
          )}

          {/* Stamp counter */}
          {stamps.length > 0 && (
            <div className="absolute top-2 right-3 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                            font-heading text-amber-800 text-sm pointer-events-none
                            border border-amber-200/30 shadow-sm">
              🎨 {stamps.length}
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar: sizes, backgrounds, tools ── */}
      <div className="relative flex flex-col items-center justify-center gap-1 py-2 px-1.5 z-10
                      bg-amber-800/15 backdrop-blur-sm rounded-l-2xl border-l border-amber-700/10">
        {/* Stamp sizes */}
        {SIZES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => { setSizeIdx(i); playTap(); }}
            className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center
              bg-white/90 border-4 transition-all shadow-md
              ${sizeIdx === i ? 'border-gray-800 scale-115 shadow-lg' : 'border-white/60'}`}
          >
            <span style={{ fontSize: s.px * 0.35 }}>
              {randomMode ? '🎲' : STAMPS[stampIdx].emoji}
            </span>
          </button>
        ))}

        <div className="w-8 h-px bg-green-300/40 flex-shrink-0" />

        {/* Background picker */}
        {BACKGROUNDS.map((b, i) => (
          <button
            key={b.id}
            onClick={() => { setBgIdx(i); playTap(); }}
            className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center
              text-lg transition-all shadow-md border-4
              ${bgIdx === i ? 'border-gray-800 scale-115 shadow-lg' : 'border-white/60'}`}
            style={{ background: b.bg }}
          >
            {b.label}
          </button>
        ))}

        <div className="w-8 h-px bg-green-300/40 flex-shrink-0" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={stamps.length === 0}
          className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center
            text-xl transition-all bg-white/90 shadow-md border-4 border-white/60
            ${stamps.length > 0 ? 'active:scale-90' : 'opacity-30'}`}
        >
          ↩️
        </button>

        {/* Clear */}
        <button
          onClick={clear}
          disabled={stamps.length === 0}
          className={`w-12 h-12 rounded-2xl flex-shrink-0 bg-red-200/90 flex items-center justify-center
            text-xl transition-all shadow-md border-4 border-white/60
            ${stamps.length > 0 ? 'active:scale-90' : 'opacity-30'}`}
        >
          🗑️
        </button>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
