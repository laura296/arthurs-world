import { THEMES, SIDEKICKS, stickerPath, loadProgress, getLevelForTheme } from './cardData';
import Starfield from '../../components/Starfield';
import { playBoing } from '../../hooks/useSound';

const themeList = Object.values(THEMES);

export default function ThemePicker({ onSelectTheme }) {
  const progress = loadProgress();

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />

      <div className="relative z-10 p-6 pt-12">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          Pick a board!
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {themeList.map((theme, i) => {
            const level = getLevelForTheme(theme.id, progress);
            const sidekick = SIDEKICKS[theme.id];
            return (
              <button
                key={theme.id}
                onClick={() => { playBoing(); onSelectTheme(theme.id); }}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${theme.bg} flex flex-col
                           items-center justify-end min-h-[140px] animate-bounce-in relative
                           active:scale-95 transition-transform shadow-lg`}
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
              >
                {/* Background preview */}
                <img
                  src={theme.bgImage}
                  alt={theme.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Sidekick in corner */}
                {sidekick && (
                  <img
                    src={stickerPath(theme.id, sidekick.id)}
                    alt={sidekick.label}
                    className="absolute top-2 right-2 w-10 h-10 object-contain animate-float drop-shadow-lg"
                  />
                )}
                {/* Label overlay */}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="text-lg font-heading text-white drop-shadow flex items-center justify-center gap-2">
                    {theme.emoji} {theme.label}
                  </span>
                  <span className="text-xs text-white/60 font-body">{level.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
