import { useParams, useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';
import SectionBackground from '../components/backgrounds/SectionBackground';
import TiltCard from '../components/TiltCard';
import { playSectionTap } from '../hooks/useSound';
import { useAmbient } from '../hooks/useAmbient';
import { SECTION_THEMES } from '../data/sectionThemes';

const sectionMeta = {
  games:   { emoji: '🎮', label: 'Games' },
  art:     { emoji: '🎨', label: 'Art' },
  books:   { emoji: '📚', label: 'Books' },
  music:   { emoji: '🎵', label: 'Music' },
  videos:  { emoji: '📺', label: 'Videos' },
};

/** Map section animationVibe to a Tailwind animation class */
const vibeAnimation = {
  bouncy: 'animate-spring-in',
  smooth: 'animate-smooth-in',
  painterly: 'animate-gentle-in',
  gentle: 'animate-gentle-in',
  rhythmic: 'animate-rhythmic-in',
};

/** Group games by their `group` field, preserving insertion order */
function groupGames(filtered) {
  const hasGroups = filtered.some(g => g.group);
  if (!hasGroups) return [{ group: null, items: filtered }];

  const groups = [];
  const seen = new Set();
  for (const game of filtered) {
    const key = game.group || '__ungrouped';
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ group: key === '__ungrouped' ? null : key, items: [] });
    }
    groups.find(g => (g.group || '__ungrouped') === key).items.push(game);
  }
  return groups;
}

export default function GameGrid() {
  const { mode, section } = useParams();
  const navigate = useNavigate();

  useAmbient(section);

  const filtered = games.filter(g => g.category === section);
  const meta = sectionMeta[section] || { emoji: '', label: section };
  const theme = SECTION_THEMES[section];
  const anim = vibeAnimation[theme?.animationVibe] || 'animate-spring-in';
  const groups = groupGames(filtered);
  const hasMultipleGroups = groups.length > 1;

  let globalIdx = 0;

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <SectionBackground section={section} />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className={`text-3xl font-heading text-sun text-center mb-6 drop-shadow ${anim}`}>
          {meta.emoji} {meta.label}
        </h2>

        <div className="max-w-md mx-auto pb-8">
          {groups.map((grp, gi) => {
            const startIdx = globalIdx;
            return (
              <div key={gi}>
                {/* Group header — only when section has multiple groups */}
                {hasMultipleGroups && grp.group && (
                  <div className={`flex items-center gap-2 mb-3 ${gi > 0 ? 'mt-6' : ''} ${anim}`}
                    style={{ animationDelay: `${startIdx * 0.06}s`, animationFillMode: 'backwards' }}
                  >
                    <div className="h-px flex-1 bg-white/15" />
                    <span className="text-sm font-heading text-white/60 px-2">{grp.group}</span>
                    <div className="h-px flex-1 bg-white/15" />
                  </div>
                )}

                {/* Cards grid */}
                <div className="grid grid-cols-2 gap-4">
                  {grp.items.map((game) => {
                    const idx = globalIdx++;
                    return (
                      <TiltCard
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
                                   justify-center gap-2 min-h-[120px] ${anim} rounded-3xl
                                   ${game.cover ? 'p-0' : 'p-5'}`}
                        style={{
                          animationDelay: `${idx * 0.06}s`,
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
                      </TiltCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
