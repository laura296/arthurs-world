import { useParams, useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';
import Starfield from '../components/Starfield';
import { playBoing } from '../hooks/useSound';

export default function GameGrid() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const filtered = games.filter(g => g.mode === mode || g.mode === 'both');

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          {mode === 'quiet' ? '🌙 Quiet Games' : '🔥 Noisy Games'}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {filtered.map((game, i) => (
            <button
              key={game.id}
              onClick={() => {
                playBoing();
                if (game.external) {
                  window.open(game.external, '_blank');
                } else {
                  navigate(`/games/${mode}/${game.path}`);
                }
              }}
              className={`game-card bg-gradient-to-br ${game.bg} p-5 flex flex-col items-center
                         gap-2 min-h-[120px] animate-bounce-in`}
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
            >
              <span className="text-5xl">{game.emoji}</span>
              <span className="text-lg font-heading text-white drop-shadow">{game.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
