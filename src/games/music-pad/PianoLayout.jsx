import { NATURAL_NOTES, SHARP_NOTES } from './noteData';

export default function PianoLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-950 to-stone-900 p-3 pb-0">
      {/* Piano keyboard container */}
      <div className="relative flex-1 flex gap-[3px]">
        {/* White keys */}
        {NATURAL_NOTES.map((n) => {
          const isActive = active === n.note;
          return (
            <button
              key={n.note}
              onPointerDown={(e) => onTap(n, e)}
              className={`flex-1 relative flex flex-col items-center justify-end pb-4
                         rounded-b-xl bg-gradient-to-b from-white to-gray-100
                         border border-gray-200 shadow-md
                         transition-all duration-100 select-none
                         ${isActive
                           ? 'translate-y-1 brightness-90 shadow-sm'
                           : 'hover:brightness-95'}`}
            >
              {/* Colored accent bar at bottom of key */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-3 rounded-b-xl bg-gradient-to-r ${n.color}`}
              />
              {/* Note label */}
              <span className="relative z-10 text-sm font-heading font-bold text-gray-600 mb-1">
                {n.note}
              </span>
            </button>
          );
        })}

        {/* Black keys overlaid on top */}
        {SHARP_NOTES.map((n) => {
          const isActive = active === n.note;
          // Position: each white key is (100% / 8) wide.
          // Black key sits between position and position+1, centered on the gap.
          const keyWidth = 100 / 8; // 12.5%
          const left = (n.position + 1) * keyWidth; // right edge of the white key at `position`

          return (
            <button
              key={n.note}
              onPointerDown={(e) => {
                e.stopPropagation();
                onTap(n, e);
              }}
              className={`absolute top-0 z-10 flex items-end justify-center pb-3
                         rounded-b-lg bg-gradient-to-b from-gray-800 to-gray-950
                         border border-gray-700 shadow-lg
                         transition-all duration-100 select-none
                         ${isActive
                           ? 'translate-y-1 brightness-125 shadow-sm'
                           : 'hover:brightness-110'}`}
              style={{
                left: `${left - (keyWidth * 0.65) / 2}%`,
                width: `${keyWidth * 0.65}%`,
                height: '60%',
              }}
            >
              <span className="text-[10px] font-heading font-bold text-gray-400">
                {n.note}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
