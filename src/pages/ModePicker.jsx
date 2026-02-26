import { useNavigate } from 'react-router-dom';
import { playBoing } from '../hooks/useSound';
import NightSkyScene from '../components/scenes/NightSkyScene';

const modes = [
  { id: 'quiet', emoji: '🌙', label: 'Quiet', bg: 'from-navy to-blue-900', to: '/games/quiet' },
  { id: 'noisy', emoji: '🔥', label: 'Noisy', bg: 'from-red-600 to-ember', to: '/games/noisy' },
];

export default function ModePicker() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6">
      <NightSkyScene />

      <h1 className="relative z-10 text-5xl font-heading text-sun drop-shadow-lg animate-float">
        🌟 Arthur's World 🌟
      </h1>

      <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
        {modes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { playBoing(); navigate(m.to); }}
            className={`game-card bg-gradient-to-br ${m.bg} p-8 flex flex-col items-center gap-3
                       animate-bounce-in`}
            style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'backwards' }}
          >
            <span className="text-7xl">{m.emoji}</span>
            <span className="text-2xl font-heading text-white drop-shadow">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
