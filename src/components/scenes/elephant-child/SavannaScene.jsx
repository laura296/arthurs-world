const palettes = {
  morning: {
    sky: ['#64b5f6', '#bbdefb', '#fff9c4'],
    sun: '#ffe082',
    sunY: 60,
    grass: ['#66bb6a', '#81c784', '#a5d6a7'],
    ground: '#e8d5a0',
  },
  afternoon: {
    sky: ['#42a5f5', '#90caf9', '#ffe0b2'],
    sun: '#ffcc80',
    sunY: 40,
    grass: ['#4caf50', '#66bb6a', '#81c784'],
    ground: '#e0c890',
  },
  'golden-hour': {
    sky: ['#ff8a65', '#ffcc80', '#fff59d'],
    sun: '#ffd54f',
    sunY: 120,
    grass: ['#558b2f', '#689f38', '#7cb342'],
    ground: '#d4b878',
  },
};

export default function SavannaScene({
  variant = 'home',
  timeOfDay = 'morning',
  characters = [],
  transforms = {},
  className = '',
}) {
  const p = palettes[timeOfDay] || palettes.morning;
  const isCelebration = variant === 'celebration';
  const isGathering = variant === 'gathering';

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="sav-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="60%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id="sav-grass1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.grass[0]} />
          <stop offset="100%" stopColor={p.grass[1]} />
        </linearGradient>
        <linearGradient id="sav-grass2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.grass[1]} />
          <stop offset="100%" stopColor={p.grass[2]} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#sav-sky)" />

      {/* Sun with rays */}
      <g>
        <circle cx="650" cy={p.sunY} r="45" fill={p.sun} opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="4s" repeatCount="indefinite" />
        </circle>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <line
            key={angle}
            x1={650 + Math.cos(angle * Math.PI / 180) * 50}
            y1={p.sunY + Math.sin(angle * Math.PI / 180) * 50}
            x2={650 + Math.cos(angle * Math.PI / 180) * 70}
            y2={p.sunY + Math.sin(angle * Math.PI / 180) * 70}
            stroke={p.sun}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          >
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" begin={`${angle / 90}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>

      {/* Clouds */}
      <g opacity="0.7">
        <g>
          <ellipse cx="200" cy="80" rx="60" ry="22" fill="white" />
          <ellipse cx="170" cy="75" rx="35" ry="18" fill="white" />
          <ellipse cx="235" cy="78" rx="30" ry="16" fill="white" />
          <animateTransform attributeName="transform" type="translate" values="0,0;40,0;0,0" dur="30s" repeatCount="indefinite" />
        </g>
        <g>
          <ellipse cx="550" cy="60" rx="50" ry="18" fill="white" />
          <ellipse cx="520" cy="55" rx="30" ry="14" fill="white" />
          <animateTransform attributeName="transform" type="translate" values="0,0;-30,0;0,0" dur="25s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Birds — V shapes in distance */}
      <g stroke="#5a6a7a" strokeWidth="1.5" fill="none" opacity="0.4">
        <path d="M300 100 L306 95 L312 100" />
        <path d="M320 110 L325 106 L330 110" />
        <path d="M500 80 L506 75 L512 80" />
      </g>

      {/* Distant hills — layer 1 */}
      <path d="M0 340 C100 290, 200 310, 350 300 C500 290, 650 310, 800 330 L800 420 L0 420Z" fill={p.grass[0]} opacity="0.5" />

      {/* Mid hills — layer 2 */}
      <path d="M0 380 C120 340, 250 360, 400 350 C550 340, 680 360, 800 370 L800 480 L0 480Z" fill={p.grass[1]} opacity="0.7" />

      {/* Acacia trees */}
      {(isGathering ? [120, 680] : [180]).map((tx, i) => (
        <g key={i}>
          {/* Trunk */}
          <path d={`M${tx} 380 L${tx - 3} 310 L${tx + 3} 310 L${tx} 380Z`} fill="#8d6e4a" />
          <path d={`M${tx - 2} 340 L${tx - 25} 320`} fill="none" stroke="#8d6e4a" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${tx + 2} 345 L${tx + 22} 325`} fill="none" stroke="#8d6e4a" strokeWidth="3" strokeLinecap="round" />
          {/* Flat canopy */}
          <ellipse cx={tx} cy="298" rx="55" ry="18" fill={p.grass[0]} />
          <ellipse cx={tx} cy="296" rx="48" ry="14" fill={p.grass[1]} opacity="0.7" />
        </g>
      ))}

      {/* Extra gathering tree */}
      {isGathering && (
        <g>
          <path d="M400 400 L397 340 L403 340 L400 400Z" fill="#8d6e4a" />
          <ellipse cx="400" cy="330" rx="45" ry="16" fill={p.grass[0]} />
        </g>
      )}

      {/* Foreground ground — layer 3 */}
      <path d="M0 430 C150 410, 300 420, 450 415 C600 410, 700 420, 800 425 L800 600 L0 600Z" fill={p.grass[2]} />

      {/* Sandy ground patch */}
      <ellipse cx="400" cy="520" rx="200" ry="40" fill={p.ground} opacity="0.4" />

      {/* Wildflowers */}
      {[
        { x: 100, y: 460, c: '#f48fb1' }, { x: 150, y: 470, c: '#ce93d8' },
        { x: 280, y: 450, c: '#fff176' }, { x: 350, y: 465, c: '#f48fb1' },
        { x: 500, y: 455, c: '#ce93d8' }, { x: 620, y: 468, c: '#fff176' },
        { x: 700, y: 458, c: '#f48fb1' },
      ].map((f, i) => (
        <g key={i}>
          <line x1={f.x} y1={f.y} x2={f.x} y2={f.y + 12} stroke="#66bb6a" strokeWidth="1.5" />
          <circle cx={f.x} cy={f.y} r="4" fill={f.c} />
          <circle cx={f.x} cy={f.y} r="1.5" fill="#fff59d" />
        </g>
      ))}

      {/* Animated grass tufts */}
      {[80, 200, 340, 480, 600, 720].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 440 Q${x + 3} 425 ${x - 4} 415`} fill="none" stroke={p.grass[1]} strokeWidth="2.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${x} 440;3 ${x} 440;0 ${x} 440;-2 ${x} 440;0 ${x} 440`} dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </path>
          <path d={`M${x + 6} 442 Q${x + 10} 428 ${x + 14} 418`} fill="none" stroke={p.grass[0]} strokeWidth="2" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${x + 6} 442;-3 ${x + 6} 442;0 ${x + 6} 442;2 ${x + 6} 442;0 ${x + 6} 442`} dur="2.8s" begin={`${i * 0.3 + 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Butterflies */}
      <g>
        <g>
          <path d="M0 0 L-5 -6 L0 -3 L5 -6Z" fill="#f48fb1" opacity="0.8" />
          <animateMotion path="M300,380 C320,360 350,370 340,390 C330,410 310,400 300,380" dur="6s" repeatCount="indefinite" />
        </g>
        <g>
          <path d="M0 0 L-4 -5 L0 -2 L4 -5Z" fill="#ce93d8" opacity="0.7" />
          <animateMotion path="M550,400 C570,380 590,395 580,410 C570,425 540,415 550,400" dur="7s" begin="2s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Celebration sparkles */}
      {isCelebration && (
        <g>
          {/* Rainbow arc */}
          <path d="M100 300 Q400 80 700 300" fill="none" stroke="#ef5350" strokeWidth="4" opacity="0.3" />
          <path d="M100 306 Q400 86 700 306" fill="none" stroke="#ff9800" strokeWidth="4" opacity="0.3" />
          <path d="M100 312 Q400 92 700 312" fill="none" stroke="#ffeb3b" strokeWidth="4" opacity="0.3" />
          <path d="M100 318 Q400 98 700 318" fill="none" stroke="#4caf50" strokeWidth="4" opacity="0.3" />
          <path d="M100 324 Q400 104 700 324" fill="none" stroke="#2196f3" strokeWidth="4" opacity="0.3" />
          <path d="M100 330 Q400 110 700 330" fill="none" stroke="#9c27b0" strokeWidth="4" opacity="0.3" />

          {/* Sparkle dots */}
          {[150, 250, 400, 550, 650].map((x, i) => (
            <circle key={i} cx={x} cy={350 + i * 10} r="3" fill="#facc15" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Characters rendered via foreignObject */}
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
