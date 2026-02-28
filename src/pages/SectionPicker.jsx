import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Starfield from '../components/Starfield';
import { playBoing } from '../hooks/useSound';

const sections = [
  { id: 'games',   emoji: '🎮', label: 'Games',   bg: 'from-sky to-blue-600' },
  { id: 'puzzles', emoji: '🧩', label: 'Puzzles', bg: 'from-teal-400 to-cyan-600' },
  { id: 'art',     emoji: '🎨', label: 'Art',     bg: 'from-candy to-pink-700' },
  { id: 'books',   emoji: '📚', label: 'Books',   bg: 'from-amber-400 to-orange-500' },
  { id: 'music',   emoji: '🎵', label: 'Music',   bg: 'from-purple-500 to-violet-700' },
  { id: 'videos',  emoji: '📺', label: 'Videos',  bg: 'from-red-500 to-red-700' },
];

export default function SectionPicker() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const modeLabel = mode === 'quiet' ? '🌙 Quiet' : mode === 'noisy' ? '🔥 Noisy' : '🌟 All';

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          {modeLabel}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { playBoing(); navigate(`/games/${mode}/${s.id}`); }}
              className={`game-card bg-gradient-to-br ${s.bg} p-6 flex flex-col items-center
                         gap-3 min-h-[130px] animate-bounce-in`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <span className="text-6xl">{s.emoji}</span>
              <span className="text-xl font-heading text-white drop-shadow">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
