import { useNavigate } from 'react-router-dom';
import { playNavigate } from '../hooks/useSound';
import NightSkyScene from '../components/scenes/NightSkyScene';
import ArthurBear from '../components/ArthurBear';

const modes = [
  { id: 'quiet', emoji: '🌙', label: 'Quiet', bg: 'from-navy to-blue-900', to: '/games/quiet' },
  { id: 'noisy', emoji: '🔥', label: 'Noisy', bg: 'from-red-600 to-ember', to: '/games/noisy' },
  { id: 'all',   emoji: '🌟', label: 'All',   bg: 'from-purple-600 to-indigo-800', to: '/games/all' },
];

export default function ModePicker() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6">
      <NightSkyScene />

      <div className="relative z-10 flex flex-col items-center gap-2 animate-spring-in">
        <ArthurBear expression="excited" size={80} />
        <h1 className="text-5xl font-heading text-sun drop-shadow-lg animate-float">
          Arthur's World
        </h1>
      </div>

      <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
        {modes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { playNavigate(); navigate(m.to); }}
            className={`game-card tap-ripple bg-gradient-to-br ${m.bg} p-8 flex flex-col items-center gap-3
                       animate-spring-in`}
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
