import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import GoldenHourScene from '../components/scenes/GoldenHourScene';
import TiltCard from '../components/TiltCard';
import { playNavigate } from '../hooks/useSound';
import { SECTION_THEMES } from '../data/sectionThemes';
import games from '../data/games';

const sections = [
  { id: 'games',   emoji: '🎮', label: 'Games',   hero: '/arthurs-world/images/sections/games.png',   grad: ['#E8A838', '#D4842A'] },
  { id: 'art',     emoji: '🎨', label: 'Art',     hero: '/arthurs-world/images/sections/art.png',     grad: ['#E88D6D', '#D4623A'] },
  { id: 'books',   emoji: '📚', label: 'Books',   hero: '/arthurs-world/images/sections/books.png',   grad: ['#D4A853', '#B8862A'] },
  { id: 'music',   emoji: '🎵', label: 'Music',   hero: '/arthurs-world/images/sections/music.png',   grad: ['#C49265', '#A06840'] },
  { id: 'videos',  emoji: '📺', label: 'Videos',  hero: '/arthurs-world/images/sections/videos.png',  grad: ['#E67E22', '#C0592B'] },
];

export default function SectionPicker() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const modeLabel = mode === 'quiet' ? '🌙 Quiet' : mode === 'noisy' ? '🔥 Noisy' : '🌟 All';

  return (
    <div className="relative w-full h-full bg-aw-warm overflow-y-auto no-scrollbar">
      <GoldenHourScene />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-amber-900 text-center mb-6 drop-shadow animate-spring-in"
            style={{ textShadow: '0 2px 8px rgba(245, 176, 65, 0.3)' }}>
          {modeLabel}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {sections.map((s, i) => {
            const theme = SECTION_THEMES[s.id];
            const accent = theme?.palette?.primary || '#F5B041';
            return (
              <TiltCard
                key={s.id}
                onClick={() => { playNavigate(); navigate(`/games/${mode}/${s.id}`); }}
                className="game-card tap-ripple overflow-hidden
                           flex flex-col items-center justify-center min-h-[150px] animate-spring-in p-0 rounded-3xl"
                style={{
                  background: `linear-gradient(to bottom right, ${s.grad[0]}, ${s.grad[1]})`,
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: 'backwards',
                  borderBottom: `3px solid ${accent}`,
                  boxShadow: '0 4px 12px rgba(120, 80, 40, 0.2)',
                }}
              >
                {/* Hero image with frosted glass title — falls back to emoji+gradient */}
                <div className="relative w-full h-full min-h-[150px] flex flex-col items-center justify-center">
                  {/* Emoji fallback (visible when image fails to load) */}
                  <span className="text-6xl z-[1]">{s.emoji}</span>
                  <img
                    src={s.hero}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Frosted title bar — large emoji + subtle label for parents */}
                  <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/50 to-transparent px-3 py-2 backdrop-blur-[2px] flex items-center gap-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-lg font-heading text-aw-cream drop-shadow">{s.label}</span>
                    <span className="text-xs font-heading text-aw-cream/50 bg-black/20 rounded-full px-2 py-0.5 ml-auto">
                      {games.filter(g => g.category === s.id).length}
                    </span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
