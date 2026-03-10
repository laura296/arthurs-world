import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { playNavigate } from '../hooks/useSound';
import { SECTION_THEMES } from '../data/sectionThemes';

const subsections = [
  {
    id: 'disney-princesses',
    emoji: '👸',
    label: 'Princesses',
    hero: '/arthurs-world/images/sections/disney-princesses.png',
    grad: ['#f0abfc', '#a855f7'],
  },
  {
    id: 'disney-villains',
    emoji: '🦹',
    label: 'Villains',
    hero: '/arthurs-world/images/sections/disney-villains.png',
    grad: ['#a855f7', '#1f2937'],
  },
  {
    id: 'disney-pooh',
    emoji: '🍯',
    label: 'Pooh',
    hero: '/arthurs-world/images/sections/disney-pooh.png',
    grad: ['#fbbf24', '#f59e0b'],
  },
  {
    id: 'disney-dalmatians',
    emoji: '🐾',
    label: 'Puppies',
    hero: '/arthurs-world/images/disney/puppy-wash/puppy-happy.png',
    grad: ['#fecdd3', '#f9a8d4'],
  },
];

export default function DisneyHub() {
  const { mode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-y-auto no-scrollbar"
         style={{ background: 'linear-gradient(to bottom, #065f46, #134e4a, #1a1a2e)' }}>
      {/* Firefly particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['#fbbf24', '#34d399', '#c084fc', '#60a5fa'][i % 4]
              }, transparent)`,
              boxShadow: `0 0 ${6 + Math.random() * 8}px ${
                ['#fbbf24', '#34d399', '#c084fc', '#60a5fa'][i % 4]
              }`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-center mb-2 drop-shadow animate-spring-in"
            style={{ color: '#fbbf24' }}>
          🏰 Disney World
        </h2>
        <p className="text-center text-white/60 text-sm mb-6 animate-spring-in"
           style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          Choose your adventure!
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto pb-8">
          {subsections.map((s, i) => {
            const theme = SECTION_THEMES[s.id];
            const accent = theme?.palette?.primary || '#fff';
            return (
              <button
                key={s.id}
                onClick={() => {
                  playNavigate();
                  navigate(`/games/${mode}/${s.id}`);
                }}
                className="game-card tap-ripple overflow-hidden flex items-center min-h-[120px] animate-spring-in p-0"
                style={{
                  background: `linear-gradient(to right, ${s.grad[0]}, ${s.grad[1]})`,
                  animationDelay: `${i * 0.12}s`,
                  animationFillMode: 'backwards',
                  borderBottom: `3px solid ${accent}`,
                }}
              >
                {/* Hero image with fallback */}
                <div className="relative w-full h-full min-h-[120px] flex items-center">
                  <span className="text-5xl z-[1] ml-4">{s.emoji}</span>
                  <img
                    src={s.hero}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Frosted title overlay */}
                  <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/20">
                    <span className="text-2xl font-heading text-white drop-shadow-lg">{s.label}</span>
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
