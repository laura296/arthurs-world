/**
 * Meadow scene background — sunny rolling hills, wildflowers, babbling brook,
 * bees, birds, and drifting clouds. Rich storybook style (Gruffalo / Donaldson).
 * Used behind meadow-themed games and stories.
 */
export default function MeadowScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        {/* Sky gradient — warm summer blue fading to pale horizon */}
        <linearGradient id="meadow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="60%" stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#d4eeff" />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="meadow-sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff7cc" />
          <stop offset="50%" stopColor="#ffe066" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
        </radialGradient>

        {/* Brook water shimmer gradient */}
        <linearGradient id="meadow-brook" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5ba8c8" />
          <stop offset="30%" stopColor="#7dc4dd" />
          <stop offset="50%" stopColor="#9dd8ec" />
          <stop offset="70%" stopColor="#7dc4dd" />
          <stop offset="100%" stopColor="#5ba8c8" />
        </linearGradient>

        {/* Grass texture gradient for far hills */}
        <linearGradient id="meadow-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6eba6e" />
          <stop offset="100%" stopColor="#5aa55a" />
        </linearGradient>

        {/* Grass texture gradient for mid hills */}
        <linearGradient id="meadow-hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4da64d" />
          <stop offset="100%" stopColor="#3d9b3d" />
        </linearGradient>

        {/* Grass texture gradient for near ground */}
        <linearGradient id="meadow-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d9b3d" />
          <stop offset="100%" stopColor="#2d8a2d" />
        </linearGradient>

        {/* Cloud drifting animation */}
        <animateTransform
          xlinkHref="#meadow-cloud-1"
          attributeName="transform"
          type="translate"
          values="0,0;40,0;0,0"
          dur="45s"
          repeatCount="indefinite"
        />
        <animateTransform
          xlinkHref="#meadow-cloud-2"
          attributeName="transform"
          type="translate"
          values="0,0;-30,0;0,0"
          dur="55s"
          repeatCount="indefinite"
        />
        <animateTransform
          xlinkHref="#meadow-cloud-3"
          attributeName="transform"
          type="translate"
          values="0,0;25,0;0,0"
          dur="38s"
          repeatCount="indefinite"
        />

        {/* Bee flight paths */}
        <path id="meadow-bee-path-1" d="M100,420 C150,380 200,440 260,400 C320,360 340,420 400,390" fill="none" />
        <path id="meadow-bee-path-2" d="M500,440 C530,400 580,450 620,410 C660,380 700,430 740,400" fill="none" />
        <path id="meadow-bee-path-3" d="M250,460 C280,430 310,470 360,440 C400,410 430,450 480,430" fill="none" />
      </defs>

      {/* ====== SKY ====== */}
      <rect width="800" height="600" fill="url(#meadow-sky)" />

      {/* ====== SUN with warm glow and rays ====== */}
      <circle cx="650" cy="95" r="120" fill="url(#meadow-sun-glow)" />
      <circle cx="650" cy="95" r="48" fill="#ffe066" opacity="0.95">
        <animate attributeName="r" values="48;50;48" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Warm inner */}
      <circle cx="650" cy="95" r="36" fill="#ffcc33" opacity="0.5" />

      {/* Sun rays — thick storybook style */}
      <g stroke="#ffe066" strokeLinecap="round" opacity="0.5">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1={650 + Math.cos((angle * Math.PI) / 180) * 56}
            y1={95 + Math.sin((angle * Math.PI) / 180) * 56}
            x2={650 + Math.cos((angle * Math.PI) / 180) * 76}
            y2={95 + Math.sin((angle * Math.PI) / 180) * 76}
            strokeWidth={angle % 60 === 0 ? 5 : 3}
          >
            <animate
              attributeName="opacity"
              values={angle % 60 === 0 ? '0.5;0.8;0.5' : '0.4;0.6;0.4'}
              dur={`${3 + (angle % 7)}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </g>

      {/* ====== CLOUDS — puffy storybook clusters ====== */}
      {/* Cloud 1 — large left */}
      <g id="meadow-cloud-1" opacity="0.85">
        <ellipse cx="130" cy="80" rx="65" ry="26" fill="white" />
        <ellipse cx="170" cy="72" rx="50" ry="24" fill="white" />
        <ellipse cx="100" cy="76" rx="42" ry="20" fill="white" />
        <ellipse cx="150" cy="88" rx="55" ry="18" fill="#f0f8ff" />
      </g>

      {/* Cloud 2 — medium center */}
      <g id="meadow-cloud-2" opacity="0.7">
        <ellipse cx="420" cy="55" rx="48" ry="18" fill="white" />
        <ellipse cx="450" cy="50" rx="38" ry="16" fill="white" />
        <ellipse cx="395" cy="52" rx="32" ry="14" fill="white" />
        <ellipse cx="430" cy="60" rx="40" ry="12" fill="#f0f8ff" />
      </g>

      {/* Cloud 3 — small right */}
      <g id="meadow-cloud-3" opacity="0.6">
        <ellipse cx="320" cy="130" rx="36" ry="14" fill="white" />
        <ellipse cx="345" cy="126" rx="28" ry="12" fill="white" />
        <ellipse cx="300" cy="128" rx="24" ry="11" fill="white" />
      </g>

      {/* ====== BIRDS — simple V shapes in the sky ====== */}
      <g stroke="#445566" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M180,140 Q186,134 192,140 Q198,134 204,140">
          <animateTransform attributeName="transform" type="translate" values="0,0;8,-4;16,0" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M260,100 Q265,95 270,100 Q275,95 280,100">
          <animateTransform attributeName="transform" type="translate" values="0,0;-6,-3;-12,0;-6,3;0,0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M500,160 Q504,155 508,160 Q512,155 516,160">
          <animateTransform attributeName="transform" type="translate" values="0,0;10,-2;20,0" dur="7s" repeatCount="indefinite" />
        </path>
        {/* Smaller distant bird */}
        <path d="M370,80 Q373,77 376,80 Q379,77 382,80" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="translate" values="0,0;5,-2;10,0;5,2;0,0" dur="9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ====== FAR ROLLING HILLS ====== */}
      <path
        d="M0,330 Q80,280 160,320 Q260,260 380,310 Q480,270 560,300 Q680,260 800,320 L800,600 L0,600 Z"
        fill="url(#meadow-hill-far)"
      />
      {/* Hill texture — subtle darker patches */}
      <path d="M100,310 Q140,290 180,310 Q200,300 220,315" fill="none" stroke="#5aa55a" strokeWidth="12" opacity="0.3" strokeLinecap="round" />
      <path d="M400,295 Q450,275 500,295 Q530,280 560,298" fill="none" stroke="#5aa55a" strokeWidth="10" opacity="0.25" strokeLinecap="round" />

      {/* Distant tree clusters on far hills */}
      {/* Tree group left */}
      <g>
        <ellipse cx="160" cy="300" rx="18" ry="24" fill="#3d8a3d" />
        <ellipse cx="145" cy="306" rx="14" ry="20" fill="#4a9a4a" />
        <ellipse cx="178" cy="304" rx="12" ry="18" fill="#4a9a4a" />
        <rect x="157" y="318" width="6" height="14" rx="2" fill="#6b4226" />
      </g>
      {/* Tree group right */}
      <g>
        <ellipse cx="620" cy="280" rx="16" ry="22" fill="#3d8a3d" />
        <ellipse cx="640" cy="284" rx="14" ry="18" fill="#4a9a4a" />
        <rect x="618" y="296" width="5" height="12" rx="2" fill="#6b4226" />
      </g>

      {/* ====== MID ROLLING HILLS ====== */}
      <path
        d="M0,390 Q60,355 140,380 Q240,340 360,375 Q460,345 560,370 Q680,340 800,380 L800,600 L0,600 Z"
        fill="url(#meadow-hill-mid)"
      />
      {/* Mid hill texture */}
      <path d="M50,380 Q90,365 130,380" fill="none" stroke="#3d8a3d" strokeWidth="8" opacity="0.2" strokeLinecap="round" />
      <path d="M300,365 Q360,348 420,368" fill="none" stroke="#3d8a3d" strokeWidth="8" opacity="0.2" strokeLinecap="round" />

      {/* ====== BABBLING BROOK — winding through the meadow ====== */}
      {/* Brook bed (darker underneath) */}
      <path
        d="M-10,440 Q60,425 120,445 Q200,420 280,440 Q350,425 420,442 Q500,420 580,438 Q660,425 740,445 Q790,435 810,440"
        fill="none"
        stroke="#4a90a8"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Brook water surface */}
      <path
        d="M-10,440 Q60,425 120,445 Q200,420 280,440 Q350,425 420,442 Q500,420 580,438 Q660,425 740,445 Q790,435 810,440"
        fill="none"
        stroke="url(#meadow-brook)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Brook highlight ripples */}
      <path
        d="M-10,438 Q60,423 120,443 Q200,418 280,438 Q350,423 420,440 Q500,418 580,436 Q660,423 740,443 Q790,433 810,438"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      >
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Sparkle dots on the brook */}
      {[80, 180, 300, 410, 530, 650, 730].map((x, i) => (
        <circle key={`sparkle-${x}`} cx={x} cy={438 + (i % 2 === 0 ? -4 : 2)} r="1.5" fill="white" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${2 + (i * 0.4)}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ====== STEPPING STONES in the brook ====== */}
      <ellipse cx="160" cy="442" rx="14" ry="7" fill="#8a8a7a" />
      <ellipse cx="160" cy="441" rx="12" ry="5.5" fill="#a0a090" />
      <ellipse cx="240" cy="436" rx="12" ry="6" fill="#8a8a7a" />
      <ellipse cx="240" cy="435" rx="10" ry="5" fill="#a0a090" />
      <ellipse cx="320" cy="440" rx="13" ry="6.5" fill="#8a8a7a" />
      <ellipse cx="320" cy="439" rx="11" ry="5.5" fill="#a0a090" />
      <ellipse cx="460" cy="437" rx="11" ry="5.5" fill="#8a8a7a" />
      <ellipse cx="460" cy="436" rx="9" ry="4.5" fill="#a0a090" />
      <ellipse cx="580" cy="436" rx="13" ry="6" fill="#8a8a7a" />
      <ellipse cx="580" cy="435" rx="11" ry="5" fill="#a0a090" />

      {/* ====== NEAR GROUND — lush foreground grass ====== */}
      <path
        d="M0,460 Q80,448 160,458 Q280,440 400,455 Q520,442 640,456 Q740,445 800,460 L800,600 L0,600 Z"
        fill="url(#meadow-ground)"
      />

      {/* ====== LAYERED GRASS TUFTS — multiple shades for depth ====== */}
      {/* Dark grass tufts */}
      <g fill="#2d7a2d" opacity="0.7">
        <path d="M30,470 Q34,454 38,470" />
        <path d="M35,470 Q40,450 45,470" />
        <path d="M40,470 Q44,456 48,470" />
        <path d="M150,465 Q154,448 158,465" />
        <path d="M155,465 Q160,445 165,465" />
        <path d="M310,468 Q314,452 318,468" />
        <path d="M315,468 Q320,448 325,468" />
        <path d="M460,464 Q464,447 468,464" />
        <path d="M465,464 Q470,444 475,464" />
        <path d="M600,466 Q604,450 608,466" />
        <path d="M605,466 Q610,446 615,466" />
        <path d="M730,468 Q734,452 738,468" />
        <path d="M735,468 Q740,448 745,468" />
      </g>
      {/* Light grass tufts */}
      <g fill="#4ab84a" opacity="0.5">
        <path d="M80,472 Q84,458 88,472" />
        <path d="M85,472 Q90,455 95,472" />
        <path d="M220,468 Q225,452 230,468" />
        <path d="M380,470 Q384,454 388,470" />
        <path d="M385,470 Q390,450 395,470" />
        <path d="M540,467 Q544,452 548,467" />
        <path d="M680,470 Q684,454 688,470" />
        <path d="M685,470 Q690,452 695,470" />
        <path d="M770,472 Q774,458 778,472" />
      </g>

      {/* ====== WILDFLOWERS — scattered across the meadow ====== */}

      {/* --- DAISIES (white petals, yellow center) --- */}
      {[
        { x: 70, y: 478 },
        { x: 200, y: 472 },
        { x: 440, y: 476 },
        { x: 620, y: 470 },
        { x: 760, y: 480 },
        { x: 340, y: 482 },
      ].map(({ x, y }, i) => (
        <g key={`daisy-${i}`}>
          {/* Stem */}
          <line x1={x} y1={y + 4} x2={x} y2={y + 14} stroke="#3d8a3d" strokeWidth="1.5" />
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={`dp-${i}-${angle}`}
              cx={x + Math.cos((angle * Math.PI) / 180) * 4}
              cy={y + Math.sin((angle * Math.PI) / 180) * 4}
              rx="2.5"
              ry="1.2"
              fill="white"
              transform={`rotate(${angle}, ${x + Math.cos((angle * Math.PI) / 180) * 4}, ${y + Math.sin((angle * Math.PI) / 180) * 4})`}
            />
          ))}
          {/* Center */}
          <circle cx={x} cy={y} r="2.2" fill="#f5c842" />
        </g>
      ))}

      {/* --- POPPIES (red petals, dark center) --- */}
      {[
        { x: 130, y: 480 },
        { x: 290, y: 474 },
        { x: 510, y: 478 },
        { x: 680, y: 474 },
        { x: 390, y: 470 },
      ].map(({ x, y }, i) => (
        <g key={`poppy-${i}`}>
          {/* Stem */}
          <line x1={x} y1={y + 4} x2={x + 1} y2={y + 16} stroke="#3d7a3d" strokeWidth="1.5" />
          {/* Petals */}
          <ellipse cx={x - 3} cy={y - 1} rx="4" ry="3.5" fill="#e63946" />
          <ellipse cx={x + 3} cy={y - 1} rx="4" ry="3.5" fill="#d62839" />
          <ellipse cx={x} cy={y - 3} rx="3.5" ry="4" fill="#e63946" />
          <ellipse cx={x} cy={y + 1} rx="3" ry="2.5" fill="#d62839" />
          {/* Center */}
          <circle cx={x} cy={y} r="2" fill="#2d2d2d" />
          <circle cx={x} cy={y} r="1" fill="#444" />
        </g>
      ))}

      {/* --- BLUEBELLS (small drooping bells) --- */}
      {[
        { x: 100, y: 484 },
        { x: 250, y: 476 },
        { x: 490, y: 480 },
        { x: 560, y: 475 },
        { x: 710, y: 478 },
      ].map(({ x, y }, i) => (
        <g key={`bluebell-${i}`}>
          {/* Stem — slight curve */}
          <path d={`M${x},${y + 14} Q${x - 1},${y + 6} ${x - 2},${y}`} fill="none" stroke="#3d8a3d" strokeWidth="1.2" />
          {/* Bell 1 */}
          <ellipse cx={x - 3} cy={y + 1} rx="2.5" ry="3.5" fill="#6688cc" />
          <ellipse cx={x - 3} cy={y + 3} rx="2" ry="1" fill="#5577bb" />
          {/* Bell 2 */}
          <ellipse cx={x - 5} cy={y + 4} rx="2.2" ry="3" fill="#7799dd" />
          <ellipse cx={x - 5} cy={y + 6} rx="1.8" ry="0.8" fill="#6688cc" />
          {/* Bell 3 */}
          <ellipse cx={x - 1} cy={y + 5} rx="2" ry="2.8" fill="#6688cc" />
          <ellipse cx={x - 1} cy={y + 7} rx="1.6" ry="0.7" fill="#5577bb" />
        </g>
      ))}

      {/* --- BUTTERCUPS (tiny golden yellow) --- */}
      {[
        { x: 55, y: 486 },
        { x: 175, y: 476 },
        { x: 360, y: 480 },
        { x: 585, y: 473 },
        { x: 650, y: 482 },
        { x: 740, y: 476 },
      ].map(({ x, y }, i) => (
        <g key={`buttercup-${i}`}>
          <line x1={x} y1={y + 2} x2={x} y2={y + 10} stroke="#3d8a3d" strokeWidth="1" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={`bc-${i}-${angle}`}
              cx={x + Math.cos((angle * Math.PI) / 180) * 2.5}
              cy={y + Math.sin((angle * Math.PI) / 180) * 2.5}
              rx="2"
              ry="1.2"
              fill="#ffd700"
              transform={`rotate(${angle}, ${x + Math.cos((angle * Math.PI) / 180) * 2.5}, ${y + Math.sin((angle * Math.PI) / 180) * 2.5})`}
            />
          ))}
          <circle cx={x} cy={y} r="1.5" fill="#ffaa00" />
        </g>
      ))}

      {/* ====== BEES — animated along gentle paths ====== */}
      {/* Bee 1 */}
      <g>
        <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
          <mpath xlinkHref="#meadow-bee-path-1" />
        </animateMotion>
        {/* Body */}
        <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#f5c842" />
        {/* Stripes */}
        <line x1="-2" y1="-3.5" x2="-2" y2="3.5" stroke="#2d2d2d" strokeWidth="1.5" />
        <line x1="1" y1="-3.5" x2="1" y2="3.5" stroke="#2d2d2d" strokeWidth="1.5" />
        {/* Wings */}
        <ellipse cx="-1" cy="-4" rx="3.5" ry="2" fill="white" opacity="0.7">
          <animate attributeName="ry" values="2;1.2;2" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="2" cy="-4" rx="3" ry="1.8" fill="white" opacity="0.6">
          <animate attributeName="ry" values="1.8;1;1.8" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Bee 2 */}
      <g>
        <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
          <mpath xlinkHref="#meadow-bee-path-2" />
        </animateMotion>
        <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="#f5c842" />
        <line x1="-1.5" y1="-3" x2="-1.5" y2="3" stroke="#2d2d2d" strokeWidth="1.3" />
        <line x1="1" y1="-3" x2="1" y2="3" stroke="#2d2d2d" strokeWidth="1.3" />
        <ellipse cx="-1" cy="-3.5" rx="3" ry="1.8" fill="white" opacity="0.7">
          <animate attributeName="ry" values="1.8;1;1.8" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="1.5" cy="-3.5" rx="2.8" ry="1.6" fill="white" opacity="0.6">
          <animate attributeName="ry" values="1.6;0.8;1.6" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Bee 3 — smaller, slower */}
      <g>
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
          <mpath xlinkHref="#meadow-bee-path-3" />
        </animateMotion>
        <ellipse cx="0" cy="0" rx="3.8" ry="2.5" fill="#f5c842" />
        <line x1="-1.2" y1="-2.5" x2="-1.2" y2="2.5" stroke="#2d2d2d" strokeWidth="1.2" />
        <line x1="0.8" y1="-2.5" x2="0.8" y2="2.5" stroke="#2d2d2d" strokeWidth="1.2" />
        <ellipse cx="-0.5" cy="-3" rx="2.8" ry="1.5" fill="white" opacity="0.7">
          <animate attributeName="ry" values="1.5;0.8;1.5" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="1.5" cy="-3" rx="2.5" ry="1.3" fill="white" opacity="0.6">
          <animate attributeName="ry" values="1.3;0.6;1.3" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ====== FOREGROUND GRASS BLADES — closest layer for depth ====== */}
      <g fill="#267a26" opacity="0.6">
        <path d="M10,500 Q16,478 22,500" />
        <path d="M17,500 Q24,474 31,500" />
        <path d="M110,496 Q116,474 122,496" />
        <path d="M260,498 Q266,476 272,498" />
        <path d="M265,498 Q272,472 279,498" />
        <path d="M420,496 Q426,474 432,496" />
        <path d="M550,498 Q556,476 562,498" />
        <path d="M555,498 Q562,474 569,498" />
        <path d="M700,496 Q706,476 712,496" />
        <path d="M780,498 Q786,480 792,498" />
      </g>

      {/* ====== EXTRA FOREGROUND FLOWERS — close up, slightly larger ====== */}
      {/* Big daisy left foreground */}
      <g>
        <line x1="50" y1="505" x2="48" y2="520" stroke="#3d8a3d" strokeWidth="2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={`fg-daisy-${angle}`}
            cx={50 + Math.cos((angle * Math.PI) / 180) * 6}
            cy={505 + Math.sin((angle * Math.PI) / 180) * 6}
            rx="3.5"
            ry="1.8"
            fill="white"
            transform={`rotate(${angle}, ${50 + Math.cos((angle * Math.PI) / 180) * 6}, ${505 + Math.sin((angle * Math.PI) / 180) * 6})`}
          />
        ))}
        <circle cx="50" cy="505" r="3.5" fill="#f5c842" />
      </g>

      {/* Big poppy right foreground */}
      <g>
        <line x1="750" y1="508" x2="752" y2="524" stroke="#3d7a3d" strokeWidth="2" />
        <ellipse cx="746" cy="506" rx="6" ry="5" fill="#e63946" />
        <ellipse cx="754" cy="506" rx="6" ry="5" fill="#d62839" />
        <ellipse cx="750" cy="502" rx="5" ry="6" fill="#e63946" />
        <ellipse cx="750" cy="510" rx="4.5" ry="3.5" fill="#d62839" />
        <circle cx="750" cy="507" r="3" fill="#2d2d2d" />
        <circle cx="750" cy="507" r="1.5" fill="#555" />
      </g>

      {/* ====== BUTTERFLY — small, gentle float ====== */}
      <g opacity="0.85">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="300,380;320,370;340,375;360,365;340,370;320,375;300,380"
          dur="12s"
          repeatCount="indefinite"
        />
        {/* Left wing */}
        <ellipse cx="-3" cy="-2" rx="5" ry="4" fill="#e87fbf" opacity="0.8">
          <animate attributeName="rx" values="5;3;5" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Right wing */}
        <ellipse cx="3" cy="-2" rx="5" ry="4" fill="#d06faf" opacity="0.8">
          <animate attributeName="rx" values="5;3;5" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Body */}
        <ellipse cx="0" cy="0" rx="1" ry="4" fill="#553355" />
      </g>
    </svg>
  );
}
