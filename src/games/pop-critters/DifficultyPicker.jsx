import { DIFFICULTIES } from './difficultyConfig';
import GardenScene from '../../components/scenes/GardenScene';

/**
 * Pre-game difficulty picker — 3 large buttons styled as wooden garden signs.
 * GardenScene provides immersive background behind the picker.
 */
export default function DifficultyPicker({ onSelect }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8">
        {/* Title — emoji only */}
        <span className="text-6xl drop-shadow-lg">🐿️</span>
        <div className="flex gap-6">
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="w-28 h-28 rounded-3xl flex items-center justify-center
                         bg-gradient-to-b from-amber-200 to-amber-400
                         border-4 border-amber-600 shadow-lg
                         active:scale-90 transition-transform"
            >
              <span className="text-5xl">{diff.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
