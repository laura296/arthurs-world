import { useNavigate } from 'react-router-dom';
import games from '../data/games';
import ArthurBear from '@shared/components/ArthurBear';
import TiltCard from '@shared/components/TiltCard';
import GoldenHourScene from '@shared/components/scenes/GoldenHourScene';
import { playNavigate } from '@shared/hooks/useSound';
import MuteToggle from '../components/MuteToggle';

/** Group games by their `group` field, preserving insertion order */
function groupGames(items) {
  const groups = [];
  const seen = new Set();
  for (const game of items) {
    const key = game.group || '__ungrouped';
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ group: key === '__ungrouped' ? null : key, items: [] });
    }
    groups.find(g => (g.group || '__ungrouped') === key).items.push(game);
  }
  return groups;
}

export default function HomeGrid() {
  const navigate = useNavigate();
  const groups = groupGames(games);
  let globalIdx = 0;

  return (
    <div className="relative w-full h-full bg-aw-warm overflow-y-auto no-scrollbar">
      <GoldenHourScene />
      <MuteToggle />

      <div className="relative z-10 p-6 pt-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6 animate-spring-in">
          <ArthurBear expression="happy" size={64} />
          <h1 className="text-4xl font-heading text-amber-900 drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(245, 176, 65, 0.4)' }}>
            Arthur's Books
          </h1>
        </div>

        {/* Content grid with groups */}
        <div className="max-w-md mx-auto pb-8">
          {groups.map((grp, gi) => {
            const startIdx = globalIdx;
            return (
              <div key={gi}>
                {grp.group && (
                  <div className="flex items-center gap-2 mb-3 mt-6 animate-spring-in"
                    style={{ animationDelay: `${startIdx * 0.06}s`, animationFillMode: 'backwards' }}
                  >
                    <div className="h-px flex-1 bg-amber-900/15" />
                    <span className="text-sm font-heading text-amber-900/60 px-2">{grp.group}</span>
                    <div className="h-px flex-1 bg-amber-900/15" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {grp.items.map((game) => {
                    const idx = globalIdx++;
                    return (
                      <TiltCard
                        key={game.id}
                        onClick={() => {
                          playNavigate();
                          navigate(`/${game.path}`);
                        }}
                        className={`game-card tap-ripple overflow-hidden bg-gradient-to-br ${game.bg} flex flex-col items-center
                                   justify-center gap-2 min-h-[120px] animate-spring-in rounded-3xl
                                   ${game.cover ? 'p-0' : 'p-5'}`}
                        style={{
                          animationDelay: `${idx * 0.06}s`,
                          animationFillMode: 'backwards',
                          borderBottom: '3px solid rgba(245, 176, 65, 0.5)',
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
