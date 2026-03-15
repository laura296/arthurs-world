import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playDrum, playCelebrate, playSuccess } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

/* 3×3 grid of drum pads with different pitches and colours */
const PADS = [
  { id: 'kick',    freq: 80,   colour: '#ef4444', label: '💥', name: 'Kick' },
  { id: 'snare',   freq: 200,  colour: '#f97316', label: '🥁', name: 'Snare' },
  { id: 'hihat',   freq: 800,  colour: '#facc15', label: '🔔', name: 'Hi-Hat' },
  { id: 'tom-lo',  freq: 120,  colour: '#22c55e', label: '🟢', name: 'Lo Tom' },
  { id: 'clap',    freq: 400,  colour: '#38bdf8', label: '👏', name: 'Clap' },
  { id: 'tom-hi',  freq: 300,  colour: '#8b5cf6', label: '🟣', name: 'Hi Tom' },
  { id: 'crash',   freq: 1200, colour: '#ec4899', label: '✨', name: 'Crash' },
  { id: 'rim',     freq: 600,  colour: '#f59e0b', label: '🪵', name: 'Rim' },
  { id: 'cowbell', freq: 500,  colour: '#14b8a6', label: '🐄', name: 'Cowbell' },
];

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['💥', '🥁', '🔔', '👏', '✨'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex gap-3 mb-4">
        {emojis.map((e, i) => (
          <span key={i} className="text-4xl"
            style={{ animation: `pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms both` }}>
            {e}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🥁 Drum Pad
      </h2>
      <p className="text-lg font-heading text-red-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Tap the pads to play!
      </p>
    </div>
  );
}

/**
 * DrumPad — 3×3 grid of drum pads that flash and pulse when tapped.
 * Each pad makes a different percussion sound using the drum synth at different frequencies.
 */
export default function DrumPad() {
  const [activeId, setActiveId] = useState(null);
  const [hitCount, setHitCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const timeoutRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const tapPad = useCallback((pad, e) => {
    playDrum(pad.freq);
    setActiveId(pad.id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveId(null), 150);

    // Particle burst at tap location
    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6,
        spread: 30,
        colors: [pad.colour, '#facc15', '#fff'],
        shapes: ['circle', 'star'],
      });
    }

    setHitCount(n => {
      const next = n + 1;
      if (next % 20 === 0) {
        playCelebrate();
        peek('excited');
      } else if (next % 10 === 0) {
        playSuccess();
        peek('happy');
      }
      return next;
    });
  }, [burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 40%, #7f1d1d 100%)' }}>
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* Stage spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
           style={{
             width: '140%',
             height: '50%',
             background: 'conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(239,68,68,0.06) 45%, rgba(239,68,68,0.12) 50%, rgba(239,68,68,0.06) 55%, transparent 70%)',
           }} />

      {/* Title */}
      <h2 className="font-heading text-white/80 text-lg mb-3 z-10">🥁 Drum Pad</h2>

      {/* Hit counter */}
      {hitCount > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1
                        font-heading text-white text-sm border border-white/10">
          🥁 {hitCount}
        </div>
      )}

      {/* 3×3 pad grid */}
      <div className="relative z-10 grid grid-cols-3 gap-3 p-4 w-full max-w-md"
           style={{ aspectRatio: '1' }}>
        {PADS.map(pad => {
          const isActive = activeId === pad.id;
          return (
            <button
              key={pad.id}
              onPointerDown={(e) => tapPad(pad, e)}
              className="rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden
                         transition-transform cursor-pointer border-2"
              style={{
                backgroundColor: pad.colour,
                borderColor: isActive ? '#fff' : `${pad.colour}80`,
                transform: isActive ? 'scale(0.92)' : 'scale(1)',
                boxShadow: isActive
                  ? `0 0 40px ${pad.colour}80, inset 0 0 20px rgba(255,255,255,0.3)`
                  : `0 4px 15px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.15)`,
                touchAction: 'none',
              }}
            >
              {/* Shine */}
              <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl"
                   style={{
                     background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
                   }} />
              <span className="text-3xl sm:text-4xl relative z-10">{pad.label}</span>
              <span className="text-xs font-heading text-white/70 relative z-10">{pad.name}</span>

              {/* Hit flash */}
              {isActive && (
                <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"
                     style={{ animationDuration: '0.3s', animationIterationCount: 1 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Stage floor glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 z-0"
           style={{ background: 'linear-gradient(to top, rgba(239,68,68,0.08) 0%, transparent 100%)' }} />

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
