import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playXylophone, playCelebrate, playSuccess } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

/* Rainbow xylophone bars — C major scale, two octaves down to keep it warm */
const BARS = [
  { note: 'C',  freq: 261.63, colour: '#ef4444', label: '🔴' },
  { note: 'D',  freq: 293.66, colour: '#f97316', label: '🟠' },
  { note: 'E',  freq: 329.63, colour: '#facc15', label: '🟡' },
  { note: 'F',  freq: 349.23, colour: '#22c55e', label: '🟢' },
  { note: 'G',  freq: 392.00, colour: '#38bdf8', label: '🔵' },
  { note: 'A',  freq: 440.00, colour: '#8b5cf6', label: '🟣' },
  { note: 'B',  freq: 493.88, colour: '#ec4899', label: '💗' },
  { note: 'C2', freq: 523.25, colour: '#f43f5e', label: '❤️' },
];

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#8b5cf6', '#ec4899'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex gap-1.5 mb-4 items-end">
        {colors.map((c, i) => (
          <div key={i} className="rounded-md"
            style={{
              width: 20, height: 36 - i * 3,
              backgroundColor: c,
              animation: `pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms both`,
            }} />
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🎵 Xylophone
      </h2>
      <p className="text-lg font-heading text-purple-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Tap the bars to play!
      </p>
    </div>
  );
}

/**
 * Xylophone — big rainbow bars that play notes when tapped.
 * Bars get progressively shorter (high = short, like a real xylophone).
 * Visual feedback: bar glows and bounces on tap, musical notes float up.
 */
export default function Xylophone() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [noteCount, setNoteCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [floatingNotes, setFloatingNotes] = useState([]);
  const nextNoteId = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const tapBar = useCallback((bar, idx, e) => {
    playXylophone(bar.freq);
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 200);

    // Particle burst
    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6,
        spread: 35,
        colors: [bar.colour, '#facc15', '#fff'],
        shapes: ['circle', 'star'],
      });
    }

    setNoteCount(n => {
      const next = n + 1;
      if (next % 16 === 0) {
        playCelebrate();
        peek('excited');
      } else if (next % 8 === 0) {
        playSuccess();
        peek('happy');
      }
      return next;
    });

    // Floating musical note particle
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (rect) {
      const id = nextNoteId.current++;
      setFloatingNotes(prev => [...prev.slice(-12), {
        id,
        x: rect.left + rect.width / 2,
        y: rect.top,
        colour: bar.colour,
      }]);
      setTimeout(() => {
        setFloatingNotes(prev => prev.filter(n => n.id !== id));
      }, 1500);
    }
  }, [burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(180deg, #1a1035 0%, #2d1b69 40%, #0f0a1f 100%)' }}>
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* Stage spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
           style={{
             width: '140%',
             height: '50%',
             background: 'conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(139,92,246,0.06) 45%, rgba(139,92,246,0.12) 50%, rgba(139,92,246,0.06) 55%, transparent 70%)',
           }} />

      {/* Title */}
      <h2 className="font-heading text-white/80 text-lg mb-2 z-10">🎵 Xylophone</h2>

      {/* Note counter */}
      {noteCount > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1
                        font-heading text-white text-sm border border-white/10">
          ♪ {noteCount}
        </div>
      )}

      {/* Xylophone frame */}
      <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-2 px-4 w-full max-w-2xl"
           style={{ height: '65vh' }}>
        {BARS.map((bar, i) => {
          const isActive = activeIdx === i;
          // Bars get shorter as pitch increases (left=longest, right=shortest)
          const heightPct = 100 - (i * 7);

          return (
            <button
              key={bar.note}
              onPointerDown={(e) => tapBar(bar, i, e)}
              className="flex-1 rounded-t-2xl rounded-b-lg relative overflow-hidden transition-all
                         shadow-lg border-2 border-white/10 cursor-pointer"
              style={{
                height: `${heightPct}%`,
                backgroundColor: bar.colour,
                transform: isActive ? 'scaleY(0.95)' : 'scaleY(1)',
                transformOrigin: 'bottom',
                filter: isActive ? 'brightness(1.3)' : 'brightness(1)',
                boxShadow: isActive
                  ? `0 0 30px ${bar.colour}80, 0 0 60px ${bar.colour}40, inset 0 2px 20px rgba(255,255,255,0.3)`
                  : `0 4px 12px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.15)`,
                touchAction: 'none',
              }}
            >
              {/* Shine highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl"
                   style={{
                     background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
                   }} />

              {/* Mallet strike mark (3 subtle lines) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 flex flex-col gap-1.5 opacity-20">
                <div className="h-0.5 bg-white rounded-full" />
                <div className="h-0.5 bg-white rounded-full mx-1" />
                <div className="h-0.5 bg-white rounded-full mx-2" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Xylophone frame base */}
      <div className="relative z-10 w-full max-w-2xl mx-4 h-3 bg-amber-800 rounded-b-xl shadow-xl"
           style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 -1px 3px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-amber-600 rounded-t-sm" />
      </div>

      {/* Floating musical notes */}
      {floatingNotes.map(n => (
        <div
          key={n.id}
          className="fixed pointer-events-none text-2xl z-30"
          style={{
            left: n.x - 12,
            top: n.y,
            color: n.colour,
            animation: 'float-note 1.5s ease-out forwards',
            textShadow: `0 0 10px ${n.colour}`,
          }}
        >
          {['♪', '♫', '♬'][n.id % 3]}
        </div>
      ))}

      {/* Stage floor reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 z-0"
           style={{ background: 'linear-gradient(to top, rgba(139,92,246,0.1) 0%, transparent 100%)' }} />

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
