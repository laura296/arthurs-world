import { NATURAL_NOTES } from './noteData';

// Each drum maps to a NATURAL_NOTES entry by idx
// [highlight, base] color pairs for radial gradient drum heads
const DRUM_KIT = [
  // Top row — smaller hi-hats / cymbals (w-20 h-20)
  { idx: 0, label: 'Hi-Hat',  size: 'w-20 h-20', row: 0, colors: ['#fbbf24', '#a16207'] },  // gold
  { idx: 1, label: 'Crash',   size: 'w-20 h-20', row: 0, colors: ['#fb923c', '#9a3412'] },  // orange
  { idx: 2, label: 'Ride',    size: 'w-20 h-20', row: 0, colors: ['#ca8a04', '#713f12'] },  // dark gold

  // Middle row — mid-size toms + snare (w-24 h-24)
  { idx: 3, label: 'Tom 1',   size: 'w-24 h-24', row: 1, colors: ['#f87171', '#991b1b'] },  // red
  { idx: 4, label: 'Snare',   size: 'w-24 h-24', row: 1, colors: ['#e5e7eb', '#6b7280'] },  // white/silver
  { idx: 5, label: 'Tom 2',   size: 'w-24 h-24', row: 1, colors: ['#60a5fa', '#1e3a8a'] },  // blue

  // Bottom row — large bass + floor (w-28 h-28)
  { idx: 6, label: 'Bass',    size: 'w-28 h-28', row: 2, colors: ['#a78bfa', '#581c87'] },  // purple
  { idx: 7, label: 'Floor',   size: 'w-28 h-28', row: 2, colors: ['#4ade80', '#14532d'] },  // green
];

// Group drums into rows for layout
const rows = [
  DRUM_KIT.filter(d => d.row === 0),
  DRUM_KIT.filter(d => d.row === 1),
  DRUM_KIT.filter(d => d.row === 2),
];

export default function DrumsLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-stone-800 to-stone-950 rounded-2xl p-4">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-3">
          {row.map((drum) => {
            const noteObj = NATURAL_NOTES[drum.idx];
            const isActive = active === noteObj.note;
            const [highlight, base] = drum.colors;

            return (
              <button
                key={drum.label}
                onPointerDown={(e) => onTap(noteObj, e)}
                className={`${drum.size} rounded-full flex items-center justify-center
                  transition-all duration-150 select-none cursor-pointer
                  border-2 border-white/10
                  ${isActive ? 'scale-90 brightness-125' : 'hover:scale-105'}`}
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${highlight}, ${base})`,
                  boxShadow: isActive
                    ? `0 0 20px 6px ${highlight}80, 0 0 40px 10px ${highlight}40`
                    : `0 4px 12px rgba(0,0,0,0.4), inset 0 1px 2px ${highlight}30`,
                }}
              >
                <span
                  className="text-white/70 font-heading select-none pointer-events-none"
                  style={{ fontSize: '10px' }}
                >
                  {drum.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
