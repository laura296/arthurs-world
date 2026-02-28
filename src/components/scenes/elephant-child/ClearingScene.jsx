const moods = {
  wonder: {
    sky: ['#64b5f6', '#bbdefb'],
    canopy: ['#388e3c', '#2e7d32'],
    floor: ['#81c784', '#a5d6a7'],
    light: '#fff9c4',
    lightOpacity: 0.2,
  },
  discovery: {
    sky: ['#ffcc80', '#ffe0b2'],
    canopy: ['#33691e', '#2e7d32'],
    floor: ['#66bb6a', '#81c784'],
    light: '#ffd54f',
    lightOpacity: 0.3,
  },
  magical: {
    sky: ['#ce93d8', '#f48fb1'],
    canopy: ['#1b5e20', '#2e7d32'],
    floor: ['#66bb6a', '#a5d6a7'],
    light: '#e1bee7',
    lightOpacity: 0.25,
  },
};

export default function ClearingScene({
  mood = 'wonder',
  characters = [],
  transforms = {},
  className = '',
}) {
  const m = moods[mood] || moods.wonder;
  const isMagical = mood === 'magical';

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="cl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={m.sky[0]} />
          <stop offset="100%" stopColor={m.sky[1]} />
        </linearGradient>
        <radialGradient id="cl-godray" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={m.light} stopOpacity={m.lightOpacity} />
          <stop offset="100%" stopColor={m.light} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky — visible through canopy gaps */}
      <rect width="800" height="600" fill="url(#cl-sky)" />

      {/* Dense tree canopy — surrounding frame */}
      <g>
        {/* Left wall of trees */}
        <path d="M0 0 L0 600 L150 600 C120 500, 80 400, 60 300 C40 200, 60 100, 0 0Z" fill={m.canopy[0]} />
        <path d="M0 0 C50 50, 80 120, 100 200 C120 280, 100 380, 120 500 L100 600 L0 600Z" fill={m.canopy[1]} opacity="0.7" />

        {/* Right wall of trees */}
        <path d="M800 0 L800 600 L650 600 C680 500, 720 400, 740 300 C760 200, 740 100, 800 0Z" fill={m.canopy[0]} />
        <path d="M800 0 C750 50, 720 120, 700 200 C680 280, 700 380, 680 500 L700 600 L800 600Z" fill={m.canopy[1]} opacity="0.7" />

        {/* Top canopy */}
        <path d="M0 0 L800 0 L800 80 C650 120, 500 100, 400 90 C300 100, 150 120, 0 80Z" fill={m.canopy[0]} />
        <path d="M100 0 C200 60, 350 80, 400 70 C450 80, 600 60, 700 0Z" fill={m.canopy[1]} opacity="0.5" />
      </g>

      {/* God-rays — sunlight streaming through gaps */}
      <g>
        <rect x="300" y="0" width="200" height="500" fill="url(#cl-godray)" />
        <polygon points="350,0 380,400 420,400 450,0" fill={m.light} opacity={m.lightOpacity * 0.5} />
        <polygon points="420,0 440,380 470,380 500,0" fill={m.light} opacity={m.lightOpacity * 0.4} />
      </g>

      {/* Forest floor */}
      <path d="M120 400 C200 380, 400 370, 600 380 C680 385, 720 390, 680 400 L800 600 L0 600Z" fill={m.floor[0]} />
      <path d="M150 420 C250 405, 400 400, 550 408 C650 412, 700 420, 650 430 L800 600 L0 600Z" fill={m.floor[1]} opacity="0.7" />

      {/* Moss and leaf litter */}
      <ellipse cx="300" cy="460" rx="100" ry="30" fill="#4caf50" opacity="0.2" />
      <ellipse cx="500" cy="470" rx="80" ry="25" fill="#81c784" opacity="0.15" />

      {/* Small waterfall on left */}
      <g>
        <path d="M160 300 L160 380" fill="none" stroke="#81d4fa" strokeWidth="8" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M156 300 L156 380" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.2s" repeatCount="indefinite" />
        </path>
        {/* Splash pool at base */}
        <ellipse cx="160" cy="390" rx="20" ry="8" fill="#4fc3f7" opacity="0.4" />
        {/* Splash droplets */}
        <circle cx="150" cy="385" r="2" fill="white" opacity="0.3">
          <animate attributeName="cy" values="385;375;385" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="170" cy="383" r="2" fill="white" opacity="0.3">
          <animate attributeName="cy" values="383;372;383" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        {/* Rocks */}
        <ellipse cx="148" cy="394" rx="10" ry="6" fill="#8a8a78" />
        <ellipse cx="172" cy="392" rx="8" ry="5" fill="#7a7a68" />
      </g>

      {/* Wildflowers — abundant */}
      {[
        { x: 220, y: 430, c: '#f48fb1' }, { x: 260, y: 440, c: '#ce93d8' },
        { x: 320, y: 435, c: '#fff176' }, { x: 380, y: 442, c: '#f48fb1' },
        { x: 420, y: 428, c: '#ba68c8' }, { x: 470, y: 438, c: '#fff176' },
        { x: 520, y: 432, c: '#f48fb1' }, { x: 560, y: 444, c: '#ce93d8' },
        { x: 300, y: 460, c: '#fff176' }, { x: 450, y: 455, c: '#f48fb1' },
        { x: 350, y: 470, c: '#ba68c8' },
      ].map((f, i) => (
        <g key={i}>
          <line x1={f.x} y1={f.y} x2={f.x} y2={f.y + 10} stroke="#66bb6a" strokeWidth="1.5" />
          <circle cx={f.x} cy={f.y} r="4" fill={f.c} />
          <circle cx={f.x} cy={f.y} r="1.5" fill="#fff59d" />
        </g>
      ))}

      {/* Butterflies */}
      <g>
        <g>
          <path d="M0 0 L-5 -6 L0 -3 L5 -6Z" fill="#f48fb1" opacity="0.8" />
          <animateMotion path="M350,350 C380,320 420,340 400,370 C380,390 340,380 350,350" dur="5s" repeatCount="indefinite" />
        </g>
        <g>
          <path d="M0 0 L-4 -5 L0 -2 L4 -5Z" fill="#ce93d8" opacity="0.7" />
          <animateMotion path="M450,360 C480,340 500,355 490,375 C475,390 440,380 450,360" dur="6s" begin="1.5s" repeatCount="indefinite" />
        </g>
        <g>
          <path d="M0 0 L-4 -5 L0 -2 L4 -5Z" fill="#81d4fa" opacity="0.6" />
          <animateMotion path="M300,380 C320,360 340,370 330,390 C320,400 290,395 300,380" dur="7s" begin="3s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Sparkle particles — magical mood extra */}
      {isMagical && (
        <g>
          {[
            { x: 300, y: 200 }, { x: 400, y: 180 }, { x: 500, y: 210 },
            { x: 350, y: 300 }, { x: 450, y: 280 },
            { x: 250, y: 350 }, { x: 550, y: 340 },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="3" fill="#facc15" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur={`${1.5 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="3;4;3" dur={`${1.5 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Rainbow light refractions */}
          <g opacity="0.15">
            <rect x="360" y="100" width="8" height="80" fill="#ef5350" rx="4" transform="rotate(5 364 140)" />
            <rect x="370" y="105" width="8" height="75" fill="#ff9800" rx="4" transform="rotate(5 374 142)" />
            <rect x="380" y="110" width="8" height="70" fill="#ffeb3b" rx="4" transform="rotate(5 384 145)" />
            <rect x="390" y="105" width="8" height="75" fill="#4caf50" rx="4" transform="rotate(5 394 142)" />
            <rect x="400" y="100" width="8" height="80" fill="#2196f3" rx="4" transform="rotate(5 404 140)" />
            <rect x="410" y="105" width="8" height="75" fill="#9c27b0" rx="4" transform="rotate(5 414 142)" />
          </g>
        </g>
      )}

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
