import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import NightSkyScene from '../components/scenes/NightSkyScene';
import { playNavigate } from '../hooks/useSound';
import { SECTION_THEMES } from '../data/sectionThemes';

const sections = [
  { id: 'games',   emoji: '🎮', label: 'Games',   hero: '/arthurs-world/images/sections/games.png' },
  { id: 'puzzles', emoji: '🧩', label: 'Puzzles', hero: '/arthurs-world/images/sections/puzzles.png' },
  { id: 'art',     emoji: '🎨', label: 'Art',     hero: '/arthurs-world/images/sections/art.png' },
  { id: 'books',   emoji: '📚', label: 'Books',   hero: '/arthurs-world/images/sections/books.png' },
  { id: 'music',   emoji: '🎵', label: 'Music',   hero: '/arthurs-world/images/sections/music.png' },
  { id: 'videos',  emoji: '📺', label: 'Videos',  hero: '/arthurs-world/images/sections/videos.png' },
];

export default function SectionPicker() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const modeLabel = mode === 'quiet' ? '🌙 Quiet' : mode === 'noisy' ? '🔥 Noisy' : '🌟 All';

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <NightSkyScene />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow animate-spring-in">
          {modeLabel}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {sections.map((s, i) => {
            const theme = SECTION_THEMES[s.id];
            const accent = theme?.palette?.primary || '#fff';
            return (
              <button
                key={s.id}
                onClick={() => { playNavigate(); navigate(`/games/${mode}/${s.id}`); }}
                className={`game-card tap-ripple overflow-hidden bg-gradient-to-br ${theme?.palette?.bg || 'from-gray-600 to-gray-800'}
                           flex flex-col items-center justify-center min-h-[150px] animate-spring-in p-0`}
                style={{
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: 'backwards',
                  borderBottom: `3px solid ${accent}`,
                }}
              >
                {/* Hero image with frosted glass title — falls back to emoji+gradient */}
                <div className="relative w-full h-full min-h-[150px] flex flex-col items-center justify-center">
                  <img
                    src={s.hero}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Emoji fallback (visible when image fails to load) */}
                  <span className="relative z-[1] text-6xl">{s.emoji}</span>
                  {/* Frosted title bar */}
                  <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5">
                    <span className="text-lg font-heading text-white drop-shadow">{s.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
