import { useParams, useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';
import Starfield from '../components/Starfield';
import { playBoing } from '../hooks/useSound';

const sectionMeta = {
  games:   { emoji: '🎮', label: 'Games' },
  puzzles: { emoji: '🧩', label: 'Puzzles' },
  art:     { emoji: '🎨', label: 'Art' },
  books:   { emoji: '📚', label: 'Books' },
  music:   { emoji: '🎵', label: 'Music' },
  videos:  { emoji: '📺', label: 'Videos' },
};

export default function GameGrid() {
  const { mode, section } = useParams();
  const navigate = useNavigate();

  const filtered = games.filter(g => g.category === section);
  const meta = sectionMeta[section] || { emoji: '', label: section };

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          {meta.emoji} {meta.label}
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
                  navigate(`/games/${mode}/${section}/${game.path}`);
                }
              }}
              className={`game-card overflow-hidden bg-gradient-to-br ${game.bg} flex flex-col items-center
                         justify-center gap-2 min-h-[120px] animate-bounce-in
                         ${game.cover ? 'p-0' : 'p-5'}`}
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
            >
              {game.cover ? (
                /* Book cover card */
                <div className="relative w-full h-full min-h-[160px]">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-sm font-heading text-white drop-shadow leading-tight">
                      {game.title}
                    </span>
                  </div>
                </div>
              ) : (
                /* Standard emoji card */
                <>
                  <span className="text-5xl">{game.emoji}</span>
                  <span className="text-lg font-heading text-white drop-shadow">{game.title}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
