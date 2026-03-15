import { useRef, useCallback, useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playTap, playWhoosh, playSparkle, playCelebrate, playSuccess } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const COLOURS = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#92400e', '#fdba74', '#f5f5f4', '#1e293b',
];

const RAINBOW = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#8b5cf6', '#ec4899'];

const SIZES = [
  { label: 'S', r: 24 },
  { label: 'M', r: 40 },
  { label: 'L', r: 64 },
];

/* ── Craft table background ── */
function CraftTableBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #c9daf0 0%, #b8cce6 25%, #a8bcd8 50%, #d4c4b0 75%, #c4b4a0 100%)' }} />
      {/* Subtle paper texture lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px"
          style={{
            top: `${20 + i * 15}%`,
            background: `linear-gradient(90deg, transparent 0%, rgba(100,120,150,0.08) ${30 + i * 5}%, transparent 100%)`,
          }} />
      ))}
      {/* Paint splatters */}
      <div className="absolute top-6 left-16 w-4 h-4 rounded-full bg-red-300/15" />
      <div className="absolute top-10 right-20 w-3 h-3 rounded-full bg-blue-300/15" />
      <div className="absolute bottom-8 right-28 w-5 h-5 rounded-full bg-green-300/12" />
      <div className="absolute bottom-12 left-28 w-3.5 h-3.5 rounded-full bg-yellow-300/15" />
      {/* Vignette */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(80,60,40,0.2) 100%)' }} />
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const dots = ['#ef4444', '#facc15', '#22c55e', '#38bdf8', '#ec4899'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex gap-3 mb-5">
        {dots.map((c, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full shadow-lg"
            style={{
              backgroundColor: c,
              animation: 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🎨 Dot Art
      </h2>
      <p className="text-lg font-heading text-amber-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Tap to paint dots!
      </p>
    </div>
  );
}

/**
 * DotArt — tap to stamp big colourful dots like Do-a-Dot markers.
 * Includes rainbow mode, splatter particles, and celebration every 10 dots.
 */
export default function DotArt() {
  const [colour, setColour] = useState(COLOURS[0]);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [rainbow, setRainbow] = useState(false);
  const [dots, setDots] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef(null);
  const nextId = useRef(0);
  const rainbowIdx = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const handleTap = useCallback((e) => {
    if (showIntro) return;
    const rect = containerRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const r = SIZES[sizeIdx].r;

    // Pick colour — rainbow cycles through hues
    const dotColour = rainbow
      ? RAINBOW[rainbowIdx.current++ % RAINBOW.length]
      : colour;

    // Main dot + 3-5 tiny splatter satellites
    const splatCount = 2 + Math.floor(Math.random() * 3);
    const splats = Array.from({ length: splatCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = r * (0.8 + Math.random() * 0.6);
      return {
        id: nextId.current++,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        r: r * (0.08 + Math.random() * 0.15),
        colour: dotColour,
        isSplat: true,
      };
    });

    const newDots = [
      ...splats,
      { id: nextId.current++, x, y, r, colour: dotColour, isSplat: false },
    ];

    setDots(prev => {
      const next = [...prev, ...newDots];
      // Celebrate every 10 main dots
      const mainCount = next.filter(d => !d.isSplat).length;
      if (mainCount > 0 && mainCount % 20 === 0) {
        playCelebrate();
        peek('excited');
      } else if (mainCount > 0 && mainCount % 10 === 0) {
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
        colors: [dotColour, '#facc15', '#fff'],
        shapes: ['circle', 'star'],
      });
    }

    playPop();
  }, [colour, sizeIdx, rainbow, burst, peek, showIntro]);

  const clear = useCallback(() => {
    setDots([]);
    playWhoosh();
  }, []);

  const undo = useCallback(() => {
    // Remove last main dot + its splats (they were added together)
    setDots(prev => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (!prev[i].isSplat) {
          let start = i;
          while (start > 0 && prev[start - 1].isSplat) start--;
          return [...prev.slice(0, start), ...prev.slice(i + 1)];
        }
      }
      return prev;
    });
    playTap();
  }, []);

  const mainCount = dots.filter(d => !d.isSplat).length;

  return (
    <div className="relative w-full h-full overflow-hidden flex">
      <CraftTableBg />
      <BackButton />

      {/* Intro overlay */}
      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* ── Left sidebar: colours ── */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-1 px-1 z-10
                      bg-white/25 backdrop-blur-sm rounded-r-2xl border-r border-white/15">
        <div className="grid grid-cols-2 gap-1">
          {COLOURS.map(c => (
            <button
              key={c}
              onClick={() => { setColour(c); setRainbow(false); playTap(); }}
              className={`w-9 h-9 rounded-full border-[3px] transition-all shadow-md
                ${colour === c && !rainbow
                  ? 'border-gray-800 scale-125 shadow-lg ring-2 ring-white z-10'
                  : c === '#f5f5f4' ? 'border-gray-300' : 'border-white/60'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          {/* Rainbow mode button */}
          <button
            onClick={() => { setRainbow(r => !r); playSparkle(); }}
            className={`w-9 h-9 col-span-2 rounded-full border-[3px] transition-all shadow-md
              ${rainbow
                ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-white z-10'
                : 'border-white/60'}`}
            style={{
              background: 'conic-gradient(#ef4444, #f97316, #facc15, #22c55e, #38bdf8, #8b5cf6, #ec4899, #ef4444)',
            }}
          />
        </div>
      </div>

      {/* ── Centre: dot canvas ── */}
      <div className="relative flex-1 flex items-center justify-center p-2 z-10">
        <div
          ref={containerRef}
          className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer
                     ring-2 ring-amber-700/15"
          style={{ touchAction: 'none' }}
          onPointerDown={handleTap}
        >
          {dots.map(dot => (
            <div
              key={dot.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: dot.x - dot.r,
                top: dot.y - dot.r,
                width: dot.r * 2,
                height: dot.r * 2,
                backgroundColor: dot.colour,
                opacity: dot.isSplat ? 0.7 : 0.85,
                animation: dot.isSplat
                  ? 'dotPop 0.2s ease-out'
                  : 'dotPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          ))}

          {/* Preview hint when empty */}
          {dots.length === 0 && !showIntro && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="rounded-full animate-pulse"
                   style={{
                     width: SIZES[sizeIdx].r * 2,
                     height: SIZES[sizeIdx].r * 2,
                     backgroundColor: rainbow ? '#facc15' : colour,
                   }} />
            </div>
          )}

          {/* Dot counter */}
          {mainCount > 0 && (
            <div className="absolute top-2 right-3 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                            font-heading text-amber-800 text-sm pointer-events-none
                            border border-amber-200/30 shadow-sm">
              🎨 {mainCount}
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar: sizes + tools ── */}
      <div className="relative flex flex-col items-center justify-center gap-2 py-2 px-1.5 z-10
                      bg-white/25 backdrop-blur-sm rounded-l-2xl border-l border-white/15">
        {SIZES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => { setSizeIdx(i); playTap(); }}
            className={`w-13 h-13 rounded-2xl flex-shrink-0 flex items-center justify-center
              bg-white/90 border-[5px] transition-all shadow-md
              ${sizeIdx === i ? 'border-gray-800 scale-115 shadow-lg' : 'border-white/60'}`}
          >
            <div className="rounded-full"
                 style={{
                   width: s.r * 0.6,
                   height: s.r * 0.6,
                   backgroundColor: rainbow ? undefined : colour,
                   background: rainbow
                     ? 'conic-gradient(#ef4444, #f97316, #facc15, #22c55e, #38bdf8, #8b5cf6, #ec4899, #ef4444)'
                     : undefined,
                 }} />
          </button>
        ))}

        <div className="w-8 h-px bg-blue-300/40 flex-shrink-0" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={mainCount === 0}
          className={`w-13 h-13 rounded-2xl flex-shrink-0 flex items-center justify-center
            text-xl transition-all bg-white/90 shadow-md border-[5px] border-white/60
            ${mainCount > 0 ? 'active:scale-90' : 'opacity-30'}`}
        >
          ↩️
        </button>

        {/* Clear */}
        <button
          onClick={clear}
          disabled={mainCount === 0}
          className={`w-13 h-13 rounded-2xl flex-shrink-0 bg-red-200/90 flex items-center justify-center
            text-xl transition-all shadow-md border-[5px] border-white/60
            ${mainCount > 0 ? 'active:scale-90' : 'opacity-30'}`}
        >
          🗑️
        </button>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
