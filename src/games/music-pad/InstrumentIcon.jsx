/**
 * InstrumentIcon -- tiny CSS-only icons for the instrument picker bar.
 * No SVG, no images -- pure divs + Tailwind / inline styles.
 */
export default function InstrumentIcon({ id }) {
  switch (id) {
    case 'piano':
      return <PianoIcon />;
    case 'harp':
      return <HarpIcon />;
    case 'drums':
      return <DrumsIcon />;
    case 'xylophone':
      return <XylophoneIcon />;
    default:
      return null;
  }
}

/* ── Piano: 5 keys, indices 1 & 3 are black ── */
function PianoIcon() {
  const keys = [false, true, false, true, false]; // true = black key
  return (
    <div className="flex items-end gap-[1px]" style={{ width: 40, height: 28 }}>
      {keys.map((isBlack, i) => (
        <div
          key={i}
          className={`rounded-b-sm ${
            isBlack ? 'bg-gray-800 z-10' : 'bg-white'
          }`}
          style={{
            flex: isBlack ? '0 0 5px' : '1 1 0',
            height: isBlack ? '60%' : '100%',
            marginLeft: isBlack ? -2 : 0,
            marginRight: isBlack ? -2 : 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Harp: frame + graduated strings ── */
function HarpIcon() {
  const stringHeights = ['90%', '75%', '60%', '45%'];
  return (
    <div className="relative" style={{ width: 40, height: 28 }}>
      {/* Left vertical bar */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-amber-600 rounded-sm"
        style={{ width: 2 }}
      />
      {/* Bottom horizontal bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-amber-600 rounded-sm"
        style={{ height: 2 }}
      />
      {/* Strings */}
      {stringHeights.map((h, i) => (
        <div
          key={i}
          className="absolute bottom-[2px] bg-amber-400 rounded-full"
          style={{
            width: 1.5,
            height: h,
            left: 8 + i * 8,
          }}
        />
      ))}
    </div>
  );
}

/* ── Drums: big circle, small circle, crossed sticks ── */
function DrumsIcon() {
  return (
    <div className="relative" style={{ width: 40, height: 28 }}>
      {/* Large drum body */}
      <div
        className="absolute bg-gray-300 border-2 border-gray-500 rounded-full"
        style={{
          width: 20,
          height: 20,
          left: 6,
          top: 6,
        }}
      />
      {/* Small drum / tom */}
      <div
        className="absolute bg-red-400 border border-red-600 rounded-full"
        style={{
          width: 12,
          height: 12,
          right: 4,
          top: 0,
        }}
      />
      {/* Stick 1 */}
      <div
        className="absolute bg-amber-700 rounded-full"
        style={{
          width: 1.5,
          height: 20,
          left: 22,
          top: 6,
          transform: 'rotate(-35deg)',
          transformOrigin: 'bottom center',
        }}
      />
      {/* Stick 2 */}
      <div
        className="absolute bg-amber-700 rounded-full"
        style={{
          width: 1.5,
          height: 20,
          left: 28,
          top: 6,
          transform: 'rotate(35deg)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
}

/* ── Xylophone: 4 graduated bars ── */
function XylophoneIcon() {
  const bars = [
    { width: '100%', color: '#f87171' }, // red
    { width: '85%',  color: '#facc15' }, // yellow
    { width: '70%',  color: '#38bdf8' }, // blue
    { width: '55%',  color: '#a78bfa' }, // purple
  ];
  return (
    <div
      className="flex flex-col items-center justify-center gap-[2px]"
      style={{ width: 40, height: 28 }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: bar.width,
            height: 3,
            backgroundColor: bar.color,
          }}
        />
      ))}
    </div>
  );
}
