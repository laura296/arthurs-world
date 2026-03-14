import { useNavigate } from 'react-router-dom';
import { playNavigate } from '../hooks/useSound';
import GoldenHourScene from '../components/scenes/GoldenHourScene';
import ArthurBear from '../components/ArthurBear';

const modes = [
  { id: 'quiet', emoji: '🌙', label: 'Quiet', bg: 'from-indigo-400/80 to-blue-800/80', to: '/games/quiet' },
  { id: 'noisy', emoji: '🔥', label: 'Noisy', bg: 'from-aw-amber/80 to-orange-600/80', to: '/games/noisy' },
  { id: 'all',   emoji: '🌟', label: 'All',   bg: 'from-aw-gold/80 to-amber-600/80', to: '/games/all' },
];

export default function ModePicker() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6 bg-aw-warm">
      <GoldenHourScene />

      <div className="relative z-10 flex flex-col items-center gap-2 animate-spring-in">
        <ArthurBear expression="excited" size={80} />
        <h1 className="text-5xl font-heading text-amber-900 drop-shadow-lg animate-float"
            style={{ textShadow: '0 2px 8px rgba(245, 176, 65, 0.4)' }}>
          Arthur's World
        </h1>
      </div>

      <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
        {modes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { playNavigate(); navigate(m.to); }}
            className={`game-card tap-ripple bg-gradient-to-br ${m.bg} backdrop-blur-sm
                       p-8 flex flex-col items-center gap-3 border border-white/20
                       shadow-aw-lg animate-spring-in`}
            style={{ animationDelay: `${0.15 + i * 0.1}s`, animationFillMode: 'backwards' }}
          >
            <span className="text-7xl">{m.emoji}</span>
            <span className="text-2xl font-heading text-white drop-shadow">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
