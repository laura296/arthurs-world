import { useState, useCallback } from 'react';
import ArthurBear from './ArthurBear';
import { playCelebrate } from '../hooks/useSound';

/**
 * Full-screen celebration overlay with confetti + Arthur Bear dancing.
 *
 * Usage:
 *   const { celebrate, CelebrationLayer } = useCelebration();
 *   celebrate({ message: 'Well done!', colors: ['#facc15', '#38bdf8'] });
 *   return <><CelebrationLayer /><game /></>;
 */

const MESSAGES = ['Well done!', 'Amazing!', 'Hooray!', 'Brilliant!', 'Yay!'];

let celebrationId = 0;

export function useCelebration() {
  const [active, setActive] = useState(null);

  const celebrate = useCallback((options = {}) => {
    const {
      message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      colors = ['#facc15', '#38bdf8', '#ec4899', '#22c55e'],
      duration = 3500,
    } = options;

    const id = ++celebrationId;
    playCelebrate();
    setActive({ id, message, colors, duration });

    setTimeout(() => {
      setActive(prev => prev?.id === id ? null : prev);
    }, duration);
  }, []);

  const dismiss = useCallback(() => setActive(null), []);

  const CelebrationLayer = useCallback(() => {
    if (!active) return null;

    const confetti = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: active.colors[i % active.colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 1.5,
      width: 6 + Math.random() * 8,
      height: 10 + Math.random() * 14,
      rotation: Math.random() * 360,
    }));

    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
        onClick={dismiss}
      >
        {/* Dim overlay */}
        <div className="absolute inset-0 bg-black/40" style={{ animation: 'fadeIn 0.3s ease-out' }} />

        {/* Confetti */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          >
            <div
              style={{
                width: c.width,
                height: c.height,
                backgroundColor: c.color,
                borderRadius: 2,
                transform: `rotate(${c.rotation}deg)`,
              }}
            />
          </div>
        ))}

        {/* Message */}
        <h1
          className="relative z-10 text-5xl font-heading text-sun drop-shadow-lg animate-celebration-text mb-8"
          style={{ animationDelay: '0.3s' }}
        >
          {active.message}
        </h1>

        {/* Arthur dancing */}
        <div className="relative z-10 animate-peek-in" style={{ animationDelay: '0.2s' }}>
          <div className="animate-dance">
            <ArthurBear expression="excited" size={160} mode="full" />
          </div>
        </div>

        {/* Stars behind Arthur */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute z-[5] animate-confetti-fall text-2xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${0.5 + Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    );
  }, [active, dismiss]);

  return { celebrate, CelebrationLayer };
}
