import { NATURAL_NOTES } from './noteData';

// Rainbow spectrum colors for each bar (index-matched to NATURAL_NOTES)
const BAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-green-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

// Graduated widths: widest (100%) at top for lowest note, narrowest (~51%) at bottom
const BAR_WIDTHS = [100, 93, 86, 79, 72, 65, 58, 51];

export default function XylophoneLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl">
      {NATURAL_NOTES.map((noteObj, i) => {
        const isActive = active === noteObj.note;

        return (
          <button
            key={noteObj.note}
            onPointerDown={(e) => onTap(noteObj, e)}
            className={`relative h-10 rounded-lg flex items-center justify-center
                       transition-all duration-150 select-none touch-none
                       ${BAR_COLORS[i]}
                       ${isActive
                         ? '-translate-y-1 brightness-125 shadow-lg shadow-black/30'
                         : 'shadow-md shadow-black/15'
                       }`}
            style={{
              width: `${BAR_WIDTHS[i]}%`,
              // Subtle wood grain overlay
              backgroundImage:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, transparent 40%, rgba(255,255,255,0.1) 60%, transparent 80%)',
            }}
          >
            {/* Left mounting circle */}
            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400 border border-gray-500/50" />

            {/* Note label */}
            <span className="text-white font-heading text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              {noteObj.note}
            </span>

            {/* Right mounting circle */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400 border border-gray-500/50" />
          </button>
        );
      })}
    </div>
  );
}
