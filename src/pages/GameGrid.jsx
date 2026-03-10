import { useParams, useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';
import SectionBackground from '../components/backgrounds/SectionBackground';
import { playSectionTap } from '../hooks/useSound';
import { useAmbient } from '../hooks/useAmbient';
import { SECTION_THEMES } from '../data/sectionThemes';

const sectionMeta = {
  games:   { emoji: '🎮', label: 'Games' },
  puzzles: { emoji: '🧩', label: 'Puzzles' },
  art:     { emoji: '🎨', label: 'Art' },
  books:   { emoji: '📚', label: 'Books' },
  music:   { emoji: '🎵', label: 'Music' },
  videos:  { emoji: '📺', label: 'Videos' },
  'disney-princesses': { emoji: '👸', label: 'Princesses' },
  'disney-villains':   { emoji: '🦹', label: 'Villains' },
  'disney-pooh':       { emoji: '🍯', label: 'Pooh' },
  'disney-dalmatians': { emoji: '🐾', label: 'Puppies' },
};

/** Map section animationVibe to a Tailwind animation class */
const vibeAnimation = {
  bouncy: 'animate-spring-in',
  smooth: 'animate-smooth-in',
  painterly: 'animate-gentle-in',
  gentle: 'animate-gentle-in',
  rhythmic: 'animate-rhythmic-in',
};

export default function GameGrid() {
  const { mode, section } = useParams();
  const navigate = useNavigate();

  useAmbient(section);

  const filtered = games.filter(g => g.category === section);
  const meta = sectionMeta[section] || { emoji: '', label: section };
  const theme = SECTION_THEMES[section];
  const anim = vibeAnimation[theme?.animationVibe] || 'animate-spring-in';

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <SectionBackground section={section} />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className={`text-3xl font-heading text-sun text-center mb-6 drop-shadow ${anim}`}>
          {meta.emoji} {meta.label}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {filtered.map((game, i) => (
            <button
              key={game.id}
              onClick={() => {
                playSectionTap(section);
                if (game.external) {
                  window.open(game.external, '_blank');
                } else {
                  navigate(`/games/${mode}/${section}/${game.path}`);
                }
              }}
              className={`game-card tap-ripple overflow-hidden bg-gradient-to-br ${game.bg} flex flex-col items-center
                         justify-center gap-2 min-h-[120px] ${anim}
                         ${game.cover ? 'p-0' : 'p-5'}`}
              style={{
                animationDelay: `${i * 0.06}s`,
                animationFillMode: 'backwards',
                borderBottom: `3px solid ${theme?.palette?.primary || '#fff'}`,
              }}
            >
              {game.cover ? (
                <div className="relative w-full h-full min-h-[160px] flex flex-col items-center justify-center">
                  <img
                    src={game.cover}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Title overlay on cover image */}
                  <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-sm font-heading text-white drop-shadow leading-tight">
                      {game.title}
                    </span>
                  </div>
                </div>
              ) : (
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
