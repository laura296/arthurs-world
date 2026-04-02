import { useState, useCallback, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import ArthurBear from '../components/ArthurBear';
import { playPop, playSuccess, playSparkle, playFanfare, playBoing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── Tooth sections to brush ── */
const TEETH = [
  { id: 'top-left',     label: '↖️', row: 'top',    col: 0, color: '#fef9c3' },
  { id: 'top-front',    label: '⬆️', row: 'top',    col: 1, color: '#fef9c3' },
  { id: 'top-right',    label: '↗️', row: 'top',    col: 2, color: '#fef9c3' },
  { id: 'bottom-left',  label: '↙️', row: 'bottom', col: 0, color: '#fef9c3' },
  { id: 'bottom-front', label: '⬇️', row: 'bottom', col: 1, color: '#fef9c3' },
  { id: 'bottom-right', label: '↘️', row: 'bottom', col: 2, color: '#fef9c3' },
];

const BRUSH_NEEDED = 5; // taps per tooth section to clean it

/* ── Bathroom background ── */
function BathroomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Tiles */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)' }} />

      {/* Mirror */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-32 h-24 rounded-[50%] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
          border: '5px solid #D4A853',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.1)',
        }}>
        {/* Mirror shine */}
        <div className="absolute top-2 right-4 w-6 h-10 bg-white/40 rounded-full rotate-[-20deg]" />
      </div>

      {/* Shelf */}
      <div className="absolute top-[35%] right-[8%] w-20 h-3 rounded-lg bg-amber-200"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        {/* Toothpaste tube */}
        <div className="absolute -top-5 left-2 w-5 h-6 rounded-t-lg bg-sky-400"
          style={{ border: '2px solid #0ea5e9' }}>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-sm" />
        </div>
        {/* Cup */}
        <div className="absolute -top-4 right-2 w-5 h-5 rounded-b-lg bg-pink-300"
          style={{ border: '2px solid #f472b6' }} />
      </div>

      {/* Sink */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-40 h-20 rounded-b-[50%]"
        style={{
          background: 'linear-gradient(180deg, #f8fafc, #e2e8f0)',
          border: '4px solid #cbd5e1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
        {/* Tap */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6">
          <div className="w-3 h-5 bg-gray-400 rounded-t-full mx-auto" />
          <div className="w-8 h-2 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Floor tiles */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%]"
        style={{ background: 'linear-gradient(180deg, #94a3b8, #64748b)' }} />
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <span className="text-6xl mb-4"
        style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        🪥
      </span>
      <span className="text-6xl"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}>
        🪥
      </span>
    </div>
  );
}

/* ── Single tooth button ── */
function ToothButton({ tooth, brushCount, onBrush }) {
  const clean = brushCount >= BRUSH_NEEDED;
  const progress = Math.min(brushCount / BRUSH_NEEDED, 1);

  return (
    <button
      onPointerDown={() => !clean && onBrush(tooth)}
      className={`relative flex items-center justify-center rounded-2xl transition-all
                  ${clean ? 'scale-95' : 'active:scale-90 cursor-pointer'}`}
      style={{
        width: 90, height: 90,
        background: clean
          ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)'
          : `linear-gradient(135deg, ${tooth.color}, #fefce8)`,
        border: `3px solid ${clean ? '#60a5fa' : '#fbbf24'}`,
        boxShadow: clean
          ? '0 0 20px rgba(96,165,250,0.4), inset 0 0 10px rgba(255,255,255,0.5)'
          : '0 4px 12px rgba(0,0,0,0.1)',
        touchAction: 'none',
      }}
      disabled={clean}
    >
      {/* Tooth emoji */}
      <span className="text-3xl">{clean ? '✨' : '🦷'}</span>

      {/* Progress ring */}
      {!clean && brushCount > 0 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#60a5fa" strokeWidth="3"
                  strokeDasharray={`${progress * 213} 213`}
                  strokeLinecap="round" transform="rotate(-90 40 40)" opacity="0.6" />
        </svg>
      )}

      {/* Sparkle on clean */}
      {clean && (
        <span className="absolute -top-1 -right-1 text-lg"
              style={{ animation: 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          ⭐
        </span>
      )}
    </button>
  );
}

/* ── Arthur's mouth showing teeth state ── */
function ArthurMouth({ cleanCount, total }) {
  const ratio = cleanCount / total;
  const expression = ratio === 1 ? 'excited' : ratio > 0.5 ? 'happy' : 'curious';

  return (
    <div className="relative flex flex-col items-center">
      <ArthurBear expression={expression} size={110} />

      {/* Toothbrush hovering near Arthur */}
      <div className="absolute -right-4 top-8 text-3xl"
           style={{ animation: 'float 2s ease-in-out infinite', transform: 'rotate(-30deg)' }}>
        🪥
      </div>

      {/* Visual hint — toothbrush emoji, no text */}
      {cleanCount === 0 && (
        <div className="absolute -top-1 left-0 bg-white rounded-full w-9 h-9
                        flex items-center justify-center shadow-lg animate-bounce"
             style={{ animation: 'pop-in 0.5s ease-out 1s both' }}>
          <span className="text-xl">👇</span>
        </div>
      )}

      {cleanCount > 0 && cleanCount < total && (
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300
                          ${i < cleanCount ? 'bg-sky-400 scale-110' : 'bg-gray-200'}`}
                 style={i < cleanCount ? { boxShadow: '0 0 6px #38bdf8' } : {}} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SparkleTeeth() {
  const [showIntro, setShowIntro] = useState(true);
  const [brushCounts, setBrushCounts] = useState(() =>
    Object.fromEntries(TEETH.map(t => [t.id, 0]))
  );
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const cleanCount = TEETH.filter(t => brushCounts[t.id] >= BRUSH_NEEDED).length;
  const isComplete = cleanCount === TEETH.length;

  const handleBrush = useCallback((tooth) => {
    // Any tooth can be brushed — no strict ordering
    setBrushCounts(prev => {
      const newCount = (prev[tooth.id] || 0) + 1;
      const updated = { ...prev, [tooth.id]: newCount };

      if (newCount >= BRUSH_NEEDED) {
        // This tooth is clean!
        playSparkle();
        playSuccess();

        // Check if all done
        const newCleanCount = TEETH.filter(t => updated[t.id] >= BRUSH_NEEDED).length;
        if (newCleanCount >= TEETH.length) {
          setTimeout(() => {
            playFanfare();
            celebrate();
            peek('excited');
          }, 400);
        } else {
          peek('happy');
        }
      } else {
        playPop();
      }

      return updated;
    });
  }, [celebrate, peek]);

  const handlePlayAgain = useCallback(() => {
    setBrushCounts(Object.fromEntries(TEETH.map(t => [t.id, 0])));
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <BathroomScene />
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-4">
        {/* Title — emoji only */}
        <div className="text-3xl">🪥</div>

        {/* Arthur */}
        <ArthurMouth cleanCount={cleanCount} total={TEETH.length} />

        {/* Visual progress — no text */}
        {!isComplete && cleanCount > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: TEETH.length }).map((_, i) => (
              <span key={i} className="text-xl">
                {i < cleanCount ? '✨' : '🦷'}
              </span>
            ))}
          </div>
        )}

        {/* Teeth grid — top row and bottom row */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {/* Visual label — emoji only */}
          {isComplete && (
            <div className="text-center text-3xl animate-bounce">✨</div>
          )}

          {/* Top row */}
          <div className="flex justify-center gap-3">
            {TEETH.filter(t => t.row === 'top').map(tooth => (
              <ToothButton
                key={tooth.id}
                tooth={tooth}
                brushCount={brushCounts[tooth.id]}
                onBrush={handleBrush}
              />
            ))}
          </div>

          {/* Mouth divider */}
          <div className="flex items-center gap-2 px-4">
            <div className="flex-1 h-1 rounded-full bg-pink-200" />
            <span className="text-xl">👄</span>
            <div className="flex-1 h-1 rounded-full bg-pink-200" />
          </div>

          {/* Bottom row */}
          <div className="flex justify-center gap-3">
            {TEETH.filter(t => t.row === 'bottom').map(tooth => (
              <ToothButton
                key={tooth.id}
                tooth={tooth}
                brushCount={brushCounts[tooth.id]}
                onBrush={handleBrush}
              />
            ))}
          </div>
        </div>

        {/* Play again */}
        {isComplete && (
          <button onClick={handlePlayAgain}
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-500
                       text-white font-heading text-lg active:scale-95 transition-transform shadow-lg"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
            🔄 🪥
          </button>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
