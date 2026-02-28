export default function WaterholeScene({
  characters = [],
  transforms = {},
  className = '',
}) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="wh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="60%" stopColor="#90caf9" />
          <stop offset="100%" stopColor="#ffe0b2" />
        </linearGradient>
        <linearGradient id="wh-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4db6ac" />
          <stop offset="100%" stopColor="#26a69a" />
        </linearGradient>
        <radialGradient id="wh-dapple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff9c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky — warm afternoon */}
      <rect width="800" height="600" fill="url(#wh-sky)" />

      {/* Overhanging trees — shady canopy */}
      <g>
        <path d="M0 0 C40 60, 100 120, 60 200 C30 140, -20 80, 0 0Z" fill="#2e7d32" opacity="0.8" />
        <path d="M80 0 C120 80, 160 140, 110 220 C80 160, 50 80, 80 0Z" fill="#388e3c" opacity="0.7" />
        <path d="M640 0 C600 80, 580 140, 630 220 C660 160, 680 80, 640 0Z" fill="#2e7d32" opacity="0.8" />
        <path d="M740 0 C700 60, 680 120, 720 200 C750 140, 780 80, 740 0Z" fill="#388e3c" opacity="0.7" />
        <path d="M800 0 C770 50, 760 100, 780 160 C800 110, 810 60, 800 0Z" fill="#2e7d32" opacity="0.7" />
      </g>

      {/* Tree trunks */}
      <path d="M30 200 L25 320 L40 320 L35 200Z" fill="#6d4c2a" />
      <path d="M100 220 L95 340 L110 340 L105 220Z" fill="#5d3c1a" />
      <path d="M660 220 L655 340 L670 340 L665 220Z" fill="#6d4c2a" />
      <path d="M750 200 L745 320 L760 320 L755 200Z" fill="#5d3c1a" />

      {/* Ground — warm earthy */}
      <path d="M0 340 C200 320, 400 330, 600 320 C700 316, 800 330, 800 340 L800 600 L0 600Z" fill="#c8a870" />
      <path d="M0 360 C200 345, 400 350, 600 345 C700 340, 800 350, 800 360 L800 600 L0 600Z" fill="#d4b880" opacity="0.7" />

      {/* Waterhole — shady pool */}
      <ellipse cx="350" cy="420" rx="180" ry="80" fill="url(#wh-water)" />
      <ellipse cx="350" cy="415" rx="160" ry="65" fill="#4fc3f7" opacity="0.3" />

      {/* Reflection hints */}
      <ellipse cx="320" cy="410" rx="30" ry="4" fill="white" opacity="0.12" />
      <ellipse cx="380" cy="430" rx="25" ry="3" fill="white" opacity="0.1" />

      {/* Still water ripples — very gentle */}
      <ellipse cx="350" cy="420" rx="100" ry="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="rx" values="100;120;100" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* Dappled light patches */}
      {[
        { x: 200, y: 280 }, { x: 400, y: 300 }, { x: 550, y: 290 },
        { x: 150, y: 400 }, { x: 500, y: 380 }, { x: 350, y: 360 },
      ].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={25 + i * 5} fill="url(#wh-dapple)">
          <animate attributeName="opacity" values="1;0.5;1" dur={`${3 + i * 0.5}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Dusty path leading right — toward adventure */}
      <path d="M550 450 C600 440, 680 430, 800 420" fill="none" stroke="#b89860" strokeWidth="30" strokeLinecap="round" opacity="0.4" />
      <path d="M560 448 C610 438, 690 430, 800 422" fill="none" stroke="#c8a870" strokeWidth="20" strokeLinecap="round" opacity="0.3" />

      {/* Footprint trail on path — transforms can add more */}
      {transforms.footprints && (
        <g opacity="0.3">
          {[580, 620, 660, 700, 740].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy={445 - i * 3} rx="4" ry="6" fill="#8a7848" transform={`rotate(${-10 + i * 2} ${x} ${445 - i * 3})`} />
              <ellipse cx={x + 12} cy={443 - i * 3} rx="4" ry="6" fill="#8a7848" transform={`rotate(${-10 + i * 2} ${x + 12} ${443 - i * 3})`} />
            </g>
          ))}
        </g>
      )}

      {/* Grass patches around waterhole */}
      {[180, 280, 420, 520].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 380 Q${x + 2} 365 ${x - 3} 355`} fill="none" stroke="#66bb6a" strokeWidth="2.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${x} 380;2 ${x} 380;0 ${x} 380;-1 ${x} 380;0 ${x} 380`} dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Characters */}
      {characters.map((char, i) => {
        const Comp = char.component;
        return (
          <foreignObject key={i} x={char.x} y={char.y} width={char.size} height={char.size}>
            <div xmlns="http://www.w3.org/1999/xhtml">
              <Comp size={char.size} {...(char.props || {})} />
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}
