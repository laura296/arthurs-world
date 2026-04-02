import { useEffect, useState } from 'react';
import { playFanfare } from '../../hooks/useSound';
import Sidekick from './Sidekick';

// Generate random confetti pieces
function makeConfetti(count = 30) {
  const colors = ['#facc15', '#ef4444', '#22c55e', '#38bdf8', '#ec4899', '#a855f7'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    duration: 1.5 + Math.random(),
  }));
}

export default function WinCelebration({ theme, nextLevel, onPlayAgain, onLevelUp, onNewTheme }) {
  const [confetti] = useState(() => makeConfetti());
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    playFanfare();
    const timer = setTimeout(() => setShowButtons(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60">
      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            borderRadius: c.size > 10 ? '50%' : '2px',
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      {/* Star */}
      <div className="text-7xl animate-bounce mb-2">&#11088;</div>

      {/* Sidekick celebrating */}
      <Sidekick theme={theme} event="win" />

      <div className="text-5xl mt-4 animate-bounce-in">🎉</div>

      {/* Buttons — emoji only */}
      {showButtons && (
        <div className="flex flex-col items-center gap-3 mt-6 animate-bounce-in">
          {nextLevel && (
            <button
              onClick={onLevelUp}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full
                         flex items-center justify-center shadow-lg active:scale-90 transition-transform
                         ring-2 ring-yellow-300/50 animate-pulse"
            >
              <span className="text-3xl">⬆️</span>
            </button>
          )}
          <div className="flex gap-4">
            <button
              onClick={onPlayAgain}
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full
                         flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <span className="text-2xl">🔄</span>
            </button>
            <button
              onClick={onNewTheme}
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full
                         flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <span className="text-2xl">🃏</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
