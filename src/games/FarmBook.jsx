import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playSuccess } from '../hooks/useSound';
import { useCelebration } from '../components/CelebrationOverlay';
import { useParticleBurst } from '../components/ParticleBurst';

const PAGES = [
  { bg: 'from-sky to-blue-300', emoji: '🌅', scene: '🏠🌾🌻', caption: 'Good morning, farm!' },
  { bg: 'from-green-400 to-leaf', emoji: '🐄', scene: '🐄🐄🌿', caption: 'The cows say moo!' },
  { bg: 'from-amber-300 to-yellow-500', emoji: '🐔', scene: '🐔🐣🥚', caption: 'Chickens lay eggs!' },
  { bg: 'from-pink-300 to-pink-500', emoji: '🐷', scene: '🐷🐷💦', caption: 'Pigs love mud!' },
  { bg: 'from-green-300 to-emerald-500', emoji: '🐑', scene: '🐑🐑☁️', caption: 'Fluffy sheep!' },
  { bg: 'from-blue-300 to-sky', emoji: '🐴', scene: '🐴🏇💨', caption: 'Horses run fast!' },
  { bg: 'from-orange-300 to-amber-500', emoji: '🌽', scene: '🌽🥕🍅', caption: 'Harvest time!' },
  { bg: 'from-indigo-400 to-purple-700', emoji: '🌙', scene: '🌙⭐🏠', caption: 'Goodnight, farm!' },
];

export default function FarmBook() {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);
  const celebratedRef = useRef(false);
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();

  const current = PAGES[page];
  const isLast = page === PAGES.length - 1;
  const isFirst = page === 0;

  useEffect(() => {
    if (isLast && !celebratedRef.current) {
      celebratedRef.current = true;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 60;
      burst(cx, cy, { count: 12, spread: 80, colors: ['#facc15', '#22c55e', '#38bdf8'], shapes: ['star', 'heart'] });
      setTimeout(() => celebrate({ message: 'The End! 🎉' }), 400);
    }
  }, [isLast, celebrate, burst]);

  const turn = useCallback((dir) => {
    if (turning) return;
    const next = page + dir;
    if (next < 0 || next >= PAGES.length) return;

    playTap();
    setTurning(true);
    setTimeout(() => {
      setPage(next);
      setTurning(false);
      if (next === PAGES.length - 1) playSuccess();
    }, 300);
  }, [page, turning]);

  return (
    <div className={`relative w-full h-full bg-gradient-to-b ${current.bg} flex flex-col items-center
                    justify-center overflow-hidden transition-all duration-500`}>
      <BackButton />

      {/* Page number */}
      <div className="fixed top-4 right-4 z-50 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2
                      text-lg font-heading text-white">
        {page + 1} / {PAGES.length}
      </div>

      {/* Scene */}
      <div className={`flex flex-col items-center gap-6 transition-all duration-300
                      ${turning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="text-8xl animate-float">{current.emoji}</div>
        <div className="text-6xl tracking-wider">{current.scene}</div>
        <p className="text-2xl font-heading text-white drop-shadow-lg text-center px-6 mt-4">
          {current.caption}
        </p>
      </div>

      {/* Navigation arrows */}
      <div className="fixed bottom-8 flex gap-16">
        {!isFirst && (
          <button
            onClick={() => turn(-1)}
            className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center
                       justify-center text-4xl active:scale-90 transition-transform"
          >
            ◀️
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => turn(1)}
            className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center
                       justify-center text-4xl active:scale-90 transition-transform"
          >
            ▶️
          </button>
        )}
        {isLast && (
          <button
            onClick={() => { setPage(0); celebratedRef.current = false; playTap(); }}
            className="w-20 h-20 rounded-full bg-sun/60 backdrop-blur-sm flex items-center
                       justify-center text-4xl active:scale-90 transition-transform animate-bounce"
          >
            🔄
          </button>
        )}
      </div>

      <CelebrationLayer />
      <ParticleLayer />
    </div>
  );
}
