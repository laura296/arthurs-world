import { useState, useCallback } from 'react';
import { playPop, playTone } from '../../../hooks/useSound';

const TARGET_TAPS = 6;

function randomPos() {
  return {
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 60,
  };
}

export default function FindTheSpeck({ onComplete, burst }) {
  const [pos, setPos] = useState(randomPos);
  const [taps, setTaps] = useState(0);

  const handleTap = useCallback((e) => {
    e.stopPropagation();
    const next = taps + 1;
    const freq = 400 + (next / TARGET_TAPS) * 500;
    playTone(freq, 0.15, 'sine');
    playPop();

    // Particle burst at speck location
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 8,
      spread: 50,
      colors: ['#facc15', '#fbbf24', '#f59e0b'],
      shapes: ['star', 'circle'],
    });

    setTaps(next);

    if (next >= TARGET_TAPS) {
      onComplete();
    } else {
      setPos(randomPos());
    }
  }, [taps, onComplete, burst]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_TAPS }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i < taps ? 'bg-sun scale-110 shadow-lg shadow-yellow-400/50' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* The golden speck */}
      <button
        onClick={handleTap}
        className="absolute w-16 h-16 rounded-full animate-ellie-float
                   active:scale-90 transition-transform z-20"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #facc15 0%, #f59e0b 40%, transparent 70%)',
          boxShadow: '0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #f59e0b',
        }}
      />

      {/* Hint text */}
      {taps === 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap the golden speck!
          </span>
        </div>
      )}
    </div>
  );
}
