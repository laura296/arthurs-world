import { NATURAL_NOTES } from './noteData';

// Rainbow spectrum — each bar a different colour
const BAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#38bdf8', '#6366f1', '#a855f7', '#ec4899',
];

// Bar widths: longest on left (low) to shortest on right (high), as % of max
const BAR_WIDTHS = [100, 92, 84, 76, 68, 60, 52, 44];

export default function XylophoneLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex items-center justify-center px-3 py-4 rounded-2xl"
         style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)' }}>
      {/* Xylophone frame */}
      <div className="relative flex gap-1.5 items-end h-full w-full max-w-lg px-2">
        {/* Support rails (two horizontal bars behind the keys) */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: '20%' }}>
          <div className="mx-4 h-2 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-inner" />
        </div>
        <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: '55%' }}>
          <div className="mx-8 h-2 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-inner" />
        </div>

        {/* Bars — arranged left (large/low) to right (small/high) */}
        {NATURAL_NOTES.map((noteObj, i) => {
          const isActive = active === noteObj.note;
          const barHeight = BAR_WIDTHS[i]; // reuse width values as height %
          const color = BAR_COLORS[i];

          return (
            <button
              key={noteObj.note}
              onPointerDown={(e) => onTap(noteObj, e)}
              className="flex-1 flex flex-col items-center justify-end select-none touch-none outline-none"
              style={{ height: '100%' }}
            >
              {/* The bar */}
              <div
                className="w-full rounded-lg flex items-center justify-center transition-all duration-100"
                style={{
                  height: `${barHeight}%`,
                  background: `
                    linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, transparent 50%, rgba(255,255,255,0.1) 70%, transparent 100%),
                    linear-gradient(180deg, ${color}dd 0%, ${color} 40%, ${color}bb 100%)
                  `,
                  boxShadow: isActive
                    ? `0 0 16px ${color}80, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)`
                    : `0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* Mounting screw dots */}
                <div className="absolute top-2 w-2 h-2 rounded-full bg-gray-500/40 border border-white/20" />
                <div className="absolute bottom-2 w-2 h-2 rounded-full bg-gray-500/40 border border-white/20" />

                {/* Note label */}
                <span
                  className="text-white font-heading text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {noteObj.note}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
