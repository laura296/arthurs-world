import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playAnimalSound } from '../hooks/useAnimalSounds';
import { playCelebrate, playSuccess } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const ANIMALS = [
  { id: 'cow',     emoji: '🐄', name: 'Cow',     sound: 'cow',     bg: '#22c55e' },
  { id: 'sheep',   emoji: '🐑', name: 'Sheep',   sound: 'sheep',   bg: '#f5f5f4' },
  { id: 'pig',     emoji: '🐷', name: 'Pig',     sound: 'pig',     bg: '#f9a8d4' },
  { id: 'horse',   emoji: '🐴', name: 'Horse',   sound: 'horse',   bg: '#92400e' },
  { id: 'rooster', emoji: '🐓', name: 'Rooster', sound: 'rooster', bg: '#ef4444' },
  { id: 'hen',     emoji: '🐔', name: 'Hen',     sound: 'hen',     bg: '#f97316' },
];

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex gap-2 mb-4">
        {ANIMALS.map((a, i) => (
          <span key={a.id} className="text-4xl"
            style={{ animation: `pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms both` }}>
            {a.emoji}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        🐾 Animal Sounds
      </h2>
      <p className="text-lg font-heading text-amber-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Tap to hear them!
      </p>
    </div>
  );
}

/**
 * AnimalSounds — tap farm animals to hear their sounds.
 * Big colourful animal cards on a farm-themed background.
 * Each tap makes the animal bounce and plays its synthesised sound.
 */
export default function AnimalSounds() {
  const [activeId, setActiveId] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const timeoutRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const tapAnimal = useCallback((animal, e) => {
    playAnimalSound(animal.sound);
    setActiveId(animal.id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveId(null), 500);

    // Particle burst
    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6,
        spread: 35,
        colors: ['#facc15', '#22c55e', '#38bdf8'],
        shapes: ['star', 'heart'],
      });
    }

    setTapCount(n => {
      const next = n + 1;
      if (next % 12 === 0) {
        playCelebrate();
        peek('excited');
      } else if (next % 6 === 0) {
        playSuccess();
        peek('happy');
      }
      return next;
    });
  }, [burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 40%, #4ade80 40%, #22c55e 100%)' }}>
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* Sky decorations */}
      <div className="absolute top-8 right-16 w-20 h-8 bg-white rounded-full opacity-60" />
      <div className="absolute top-14 right-28 w-14 h-5 bg-white rounded-full opacity-40" />
      <div className="absolute top-6 left-20 w-16 h-6 bg-white rounded-full opacity-50" />

      {/* Sun */}
      <div className="absolute top-4 right-4 w-16 h-16 rounded-full z-10"
           style={{
             background: 'radial-gradient(circle, #facc15 30%, #f97316 100%)',
             boxShadow: '0 0 40px #facc1580, 0 0 80px #facc1540',
           }} />

      {/* Title */}
      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl drop-shadow-sm">🐾 Animal Sounds</h2>
      </div>

      {/* Tap counter */}
      {tapCount > 0 && (
        <div className="absolute top-4 left-16 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                        font-heading text-amber-800 text-sm border border-white/40">
          🐾 {tapCount}
        </div>
      )}

      {/* Animal grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
          {ANIMALS.map((animal, i) => {
            const isActive = activeId === animal.id;
            return (
              <button
                key={animal.id}
                onPointerDown={(e) => tapAnimal(animal, e)}
                className="rounded-3xl flex flex-col items-center justify-center gap-1 p-3
                           cursor-pointer border-4 transition-all relative overflow-hidden"
                style={{
                  backgroundColor: '#fff',
                  borderColor: isActive ? '#f59e0b' : '#e5e7eb',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isActive
                    ? '0 0 30px rgba(245,158,11,0.4), 0 8px 25px rgba(0,0,0,0.15)'
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  touchAction: 'none',
                  aspectRatio: '1',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
                }}
              >
                <span className="text-5xl sm:text-6xl"
                      style={{
                        animation: isActive ? 'animal-bounce 0.5s ease-out' : 'none',
                        display: 'block',
                      }}>
                  {animal.emoji}
                </span>
                <span className="font-heading text-amber-800 text-xs sm:text-sm mt-1">{animal.name}</span>

                {/* Sound wave ripple on tap */}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl border-4 border-amber-400"
                       style={{
                         animation: 'sound-ripple 0.6s ease-out forwards',
                       }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fence at the bottom */}
      <div className="relative z-10 h-8 flex items-end px-2">
        <div className="w-full flex justify-between">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-2 h-6 bg-amber-700 rounded-t" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-amber-700 rounded" />
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-amber-700 rounded" />
      </div>

      {/* Grass tufts */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-700/30" />

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
