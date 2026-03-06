import { useState, useCallback, useRef } from 'react';
import { playBang, playTone } from '../../../hooks/useSound';

const TARGET_TAPS = 28;
const MILESTONES = [
  { at: 0.2,  label: '📣' },
  { at: 0.4,  label: '🔊' },
  { at: 0.6,  label: '📢' },
  { at: 0.8,  label: '🗣️' },
  { at: 1.0,  label: '🎉' },
];

export default function NoiseMeter({ onComplete }) {
  const [taps, setTaps] = useState(0);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
  const completed = useRef(false);

  const progress = taps / TARGET_TAPS;

  const handleTap = useCallback((e) => {
    if (completed.current) return;

    const next = taps + 1;
    const freq = 400 + (next / TARGET_TAPS) * 500;
    playBang();
    playTone(freq, 0.1, 'sine');

    // Add ripple at tap position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    setTaps(next);

    if (next >= TARGET_TAPS) {
      completed.current = true;
      onComplete();
    }
  }, [taps, onComplete]);

  return (
    <div
      className="w-full h-full relative cursor-pointer active:bg-white/5"
      onClick={handleTap}
    >
      {/* Ripple animations */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute w-8 h-8 rounded-full border-2 border-sun/60 animate-ellie-ripple pointer-events-none z-20"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}

      {/* Vertical meter — left side */}
      <div className="absolute left-6 top-20 bottom-24 w-10 z-20">
        {/* Track */}
        <div className="w-full h-full bg-white/10 rounded-full overflow-hidden relative">
          {/* Fill */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 via-pink-500 to-sun
                        rounded-full transition-all duration-200"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {/* Milestone markers */}
        {MILESTONES.map(m => (
          <div
            key={m.at}
            className={`absolute left-12 text-2xl transition-all duration-300 ${
              progress >= m.at ? 'scale-125 opacity-100' : 'scale-75 opacity-30'
            }`}
            style={{ bottom: `${m.at * 100}%`, transform: 'translateY(50%)' }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Center encouragement text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <p className={`text-3xl font-heading text-white/60 animate-ellie-meter-pulse ${
          progress > 0.8 ? 'text-sun' : ''
        }`}>
          {progress === 0 ? 'TAP!' :
           progress < 0.3 ? 'Louder!' :
           progress < 0.6 ? 'LOUDER!' :
           progress < 0.9 ? 'LOUDER!!' :
           'LOUDER!!!'}
        </p>
      </div>

      {/* Hint */}
      {taps === 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap anywhere — make some noise!
          </span>
        </div>
      )}
    </div>
  );
}
