import BackButton from './BackButton';
import { playPop, playSuccess } from '../hooks/useSound';

/**
 * LevelSelect — child-friendly level picker grid with stars.
 * No text required — uses numbers, stars, and lock icons.
 *
 * @param {string} title — emoji + title (e.g. "🫧 Bubble Pop")
 * @param {number} totalLevels — total number of levels
 * @param {number} highestUnlocked — highest level the player can access
 * @param {Object} stars — { [levelNum]: 0-3 } stars per level
 * @param {Function} onSelect — called with level number when tapped
 * @param {string} bg — Tailwind gradient or color for background
 * @param {Array} levelLabels — optional array of emoji/labels per level
 */
export default function LevelSelect({ title, totalLevels, highestUnlocked, stars, onSelect, bg, levelLabels }) {
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  const handleTap = (lvl) => {
    if (lvl <= highestUnlocked) {
      playPop();
      onSelect(lvl);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: bg || 'linear-gradient(180deg, #87CEEB 0%, #38bdf8 100%)' }}>
      <BackButton />

      {/* Title — shows emoji portion, strips text for pre-literate children */}
      <div className="relative z-10 pt-16 pb-4 text-center">
        <div className="text-4xl drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          {title}
        </div>
      </div>

      {/* Level grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="grid grid-cols-4 gap-3 w-full max-w-md">
          {levels.map((lvl, i) => {
            const unlocked = lvl <= highestUnlocked;
            const starCount = stars[lvl] || 0;
            const label = levelLabels?.[i] || null;

            return (
              <button
                key={lvl}
                onPointerDown={() => handleTap(lvl)}
                className={`relative rounded-2xl flex flex-col items-center justify-center gap-1 py-3
                  transition-all duration-200 border-4
                  ${unlocked
                    ? 'bg-white/90 border-white/60 active:scale-95 cursor-pointer shadow-lg'
                    : 'bg-white/20 border-white/10 cursor-default'
                  }`}
                style={{
                  aspectRatio: '1',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s both`,
                  touchAction: 'none',
                }}
              >
                {unlocked ? (
                  <>
                    {label ? (
                      <span className="text-2xl">{label}</span>
                    ) : (
                      <span className="text-2xl font-heading text-amber-800">{lvl}</span>
                    )}
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <svg key={s} width={14} height={14} viewBox="0 0 22 22">
                          <polygon
                            points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                            fill={s <= starCount ? '#eab308' : '#d1d5db'}
                            stroke={s <= starCount ? '#ca8a04' : '#9ca3af'}
                            strokeWidth={1}
                          />
                        </svg>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-2xl opacity-40">🔒</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
