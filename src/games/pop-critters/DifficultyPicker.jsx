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
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-4xl font-heading text-white drop-shadow-lg">
          Pick Your Garden
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="px-6 py-5 rounded-2xl text-2xl font-heading text-amber-900
                         bg-gradient-to-b from-amber-200 to-amber-400
                         border-4 border-amber-600 shadow-lg
                         active:scale-95 transition-transform
                         hover:from-amber-100 hover:to-amber-300"
            >
              {diff.emoji} {diff.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
