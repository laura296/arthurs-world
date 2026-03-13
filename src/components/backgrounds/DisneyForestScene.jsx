/**
 * Enchanted forest scene with castle silhouette, layered hills,
 * glowing fireflies, and ambient sparkle motes.
 * Follows the NightSkyScene.jsx pattern (pure SVG, no JS animation).
 */
export default function DisneyForestScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 800 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Sky gradient — deep emerald to midnight */}
          <linearGradient id="df-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#042f2e" />
            <stop offset="35%" stopColor="#064e3b" />
            <stop offset="70%" stopColor="#0c3524" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="df-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>

          {/* Firefly glow */}
          <radialGradient id="df-firefly-warm">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="df-firefly-green">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="df-firefly-purple">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#c084fc" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </radialGradient>

          {/* Castle window glow */}
          <radialGradient id="df-win-glow">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </radialGradient>

          {/* Hill gradients */}
          <linearGradient id="df-hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a3022" />
            <stop offset="100%" stopColor="#061a12" />
          </linearGradient>
          <linearGradient id="df-hill-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#072318" />
            <stop offset="100%" stopColor="#04140d" />
          </linearGradient>
          <linearGradient id="df-hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#041a10" />
            <stop offset="100%" stopColor="#020d08" />
          </linearGradient>

          {/* Mist */}
          <linearGradient id="df-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Sky ── */}
        <rect width="800" height="900" fill="url(#df-sky)" />

        {/* ── Stars ── */}
        {[
          [60, 40, 1.5], [140, 80, 1], [220, 30, 2], [310, 60, 1], [400, 20, 1.5],
          [470, 55, 1], [540, 35, 2], [620, 70, 1.5], [700, 25, 1], [760, 50, 1.5],
          [90, 110, 1], [260, 100, 1.5], [380, 90, 1], [500, 110, 1], [660, 95, 1],
          [170, 140, 1], [440, 130, 1], [580, 140, 1.5], [730, 120, 1],
        ].map(([x, y, r], i) => (
          <circle key={`s${i}`} cx={x} cy={y} r={r} fill="white" opacity="0.4">
            <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.15};${0.6 + (i % 2) * 0.3};${0.2 + (i % 3) * 0.15}`}
                     dur={`${2.5 + (i % 5) * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── Twinkling stars (cross-shaped) ── */}
        {[[120, 45], [350, 25], [580, 60], [720, 35]].map(([x, y], i) => (
          <g key={`tw${i}`}>
            <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="white" strokeWidth="1" />
            <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="white" strokeWidth="1" />
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.8 + i * 0.5}s`} repeatCount="indefinite" />
          </g>
        ))}

        {/* ── Moon ── */}
        <circle cx="650" cy="80" r="90" fill="url(#df-moon-glow)" />
        <circle cx="650" cy="80" r="28" fill="#fef3c7" opacity="0.7" />
        <circle cx="644" cy="74" r="5" fill="#fde68a" opacity="0.3" />
        <circle cx="656" cy="84" r="3" fill="#fde68a" opacity="0.2" />

        {/* ── Shooting star ── */}
        <line x1="200" y1="60" x2="170" y2="80" stroke="white" strokeWidth="1.5" opacity="0">
          <animate attributeName="x1" values="200;380" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y1" values="60;30" dur="5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="170;350" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="80;50" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;0.7;0" dur="5s" repeatCount="indefinite" />
        </line>

        {/* ── Castle Silhouette ── */}
        <g opacity="0.85">
          {/* Main castle body */}
          <rect x="330" y="220" width="140" height="160" fill="#05150e" />

          {/* Center tower (tallest) */}
          <rect x="374" y="140" width="52" height="240" fill="#05150e" />
          <polygon points="374,140 400,100 426,140" fill="#05150e" />
          {/* Center spire */}
          <rect x="396" y="88" width="8" height="20" fill="#05150e" />
          {/* Pennant */}
          <polygon points="404,88 420,95 404,102" fill="#34d399" opacity="0.5">
            <animate attributeName="points" values="404,88 420,95 404,102;404,88 418,97 404,102;404,88 420,95 404,102"
                     dur="3s" repeatCount="indefinite" />
          </polygon>

          {/* Left tower */}
          <rect x="330" y="180" width="36" height="200" fill="#05150e" />
          <polygon points="330,180 348,150 366,180" fill="#05150e" />
          <rect x="344" y="140" width="8" height="16" fill="#05150e" />
          <polygon points="352,140 366,146 352,152" fill="#fbbf24" opacity="0.4">
            <animate attributeName="points" values="352,140 366,146 352,152;352,140 364,148 352,152;352,140 366,146 352,152"
                     dur="2.8s" repeatCount="indefinite" />
          </polygon>

          {/* Right tower */}
          <rect x="434" y="190" width="36" height="190" fill="#05150e" />
          <polygon points="434,190 452,162 470,190" fill="#05150e" />
          <rect x="448" y="152" width="8" height="16" fill="#05150e" />
          <polygon points="456,152 470,158 456,164" fill="#c084fc" opacity="0.4">
            <animate attributeName="points" values="456,152 470,158 456,164;456,152 468,160 456,164;456,152 470,158 456,164"
                     dur="3.2s" repeatCount="indefinite" />
          </polygon>

          {/* Far left turret */}
          <rect x="310" y="240" width="24" height="140" fill="#05150e" />
          <polygon points="310,240 322,218 334,240" fill="#05150e" />

          {/* Far right turret */}
          <rect x="466" y="250" width="24" height="130" fill="#05150e" />
          <polygon points="466,250 478,228 490,250" fill="#05150e" />

          {/* Battlements */}
          {[330, 342, 354, 418, 430, 442, 454].map((x, i) => (
            <rect key={`bat${i}`} x={x} y="216" width="8" height="10" fill="#05150e" />
          ))}

          {/* Castle windows — warm glow */}
          {[
            [388, 170, 10, 14], [410, 170, 10, 14],
            [344, 220, 8, 10], [350, 245, 8, 10],
            [448, 225, 8, 10], [454, 250, 8, 10],
            [380, 260, 8, 10], [395, 260, 8, 10], [410, 260, 8, 10],
          ].map(([x, y, w, h], i) => (
            <g key={`win${i}`}>
              <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx="3" fill="url(#df-win-glow)" />
              <rect x={x} y={y} width={w} height={h} rx="2" fill="#fef08a" opacity="0.6">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur={`${2.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
              </rect>
            </g>
          ))}

          {/* Gate arch */}
          <path d="M386,380 L386,340 Q400,318 414,340 L414,380" fill="#0a0a0a" />
          <rect x="387" y="342" width="26" height="38" rx="13" fill="#fef08a" opacity="0.08" />
        </g>

        {/* ── Far hills with tree silhouettes ── */}
        <path d="M0,420 Q80,380 180,400 Q280,370 400,390 Q520,360 650,385 Q740,370 800,395 L800,900 L0,900 Z"
              fill="url(#df-hill-far)" opacity="0.7" />
        {/* Tree silhouettes on far hill */}
        <g fill="#061a12" opacity="0.6">
          <polygon points="100,395 110,360 120,395" />
          <polygon points="106,370 110,340 114,370" />
          <polygon points="260,380 272,345 284,380" />
          <polygon points="266,355 272,325 278,355" />
          <polygon points="560,378 570,348 580,378" />
          <polygon points="690,385 700,355 710,385" />
        </g>

        {/* ── Mid hills ── */}
        <path d="M0,500 Q100,460 220,480 Q340,450 480,475 Q600,455 720,470 Q780,465 800,480 L800,900 L0,900 Z"
              fill="url(#df-hill-mid)" opacity="0.8" />
        {/* Tree silhouettes on mid hill */}
        <g fill="#04140d" opacity="0.8">
          <polygon points="50,476 65,430 80,476" />
          <polygon points="56,448 65,415 74,448" />
          <rect x="62" y="476" width="6" height="12" />
          <polygon points="180,470 195,428 210,470" />
          <polygon points="186,440 195,410 204,440" />
          <rect x="192" y="470" width="6" height="12" />
          <polygon points="380,465 395,420 410,465" />
          <polygon points="386,435 395,405 404,435" />
          <rect x="392" y="465" width="6" height="10" />
          <polygon points="620,465 633,425 646,465" />
          <polygon points="626,440 633,410 640,440" />
          <rect x="630" y="465" width="6" height="12" />
          <polygon points="760,470 772,435 784,470" />
          <rect x="769" y="470" width="6" height="10" />
        </g>

        {/* ── Near hills (darkest) ── */}
        <path d="M0,580 Q120,540 250,560 Q380,530 520,555 Q650,535 800,560 L800,900 L0,900 Z"
              fill="url(#df-hill-near)" opacity="0.9" />
        {/* Near trees */}
        <g fill="#020d08" opacity="0.9">
          <polygon points="30,558 50,500 70,558" />
          <polygon points="38,520 50,480 62,520" />
          <rect x="47" y="558" width="7" height="18" />
          <polygon points="150,550 170,495 190,550" />
          <polygon points="158,515 170,475 182,515" />
          <rect x="167" y="550" width="7" height="16" />
          <polygon points="320,548 340,490 360,548" />
          <polygon points="328,510 340,472 352,510" />
          <rect x="337" y="548" width="7" height="16" />
          <polygon points="500,552 518,498 536,552" />
          <polygon points="507,518 518,480 529,518" />
          <rect x="515" y="552" width="7" height="14" />
          <polygon points="680,555 698,505 716,555" />
          <polygon points="687,522 698,486 709,522" />
          <rect x="695" y="555" width="7" height="16" />
        </g>

        {/* ── Mist layer ── */}
        <rect x="0" y="500" width="800" height="200" fill="url(#df-mist)" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
        </rect>

        {/* ── Fireflies ── */}
        {[
          { cx: 120, cy: 340, glow: 'df-firefly-warm', r: 12, dx: 30, dy: 15, dur: 5 },
          { cx: 260, cy: 310, glow: 'df-firefly-green', r: 10, dx: -25, dy: 20, dur: 6 },
          { cx: 520, cy: 320, glow: 'df-firefly-warm', r: 14, dx: 20, dy: -18, dur: 4.5 },
          { cx: 680, cy: 350, glow: 'df-firefly-purple', r: 11, dx: -15, dy: 25, dur: 7 },
          { cx: 80, cy: 460, glow: 'df-firefly-green', r: 9, dx: 35, dy: -10, dur: 5.5 },
          { cx: 350, cy: 430, glow: 'df-firefly-warm', r: 13, dx: -20, dy: -15, dur: 6.5 },
          { cx: 580, cy: 450, glow: 'df-firefly-purple', r: 10, dx: 25, dy: 12, dur: 5 },
          { cx: 740, cy: 440, glow: 'df-firefly-warm', r: 11, dx: -30, dy: -20, dur: 7.5 },
          { cx: 200, cy: 500, glow: 'df-firefly-green', r: 12, dx: 18, dy: -22, dur: 4 },
          { cx: 440, cy: 510, glow: 'df-firefly-warm', r: 10, dx: -22, dy: 15, dur: 6 },
          { cx: 620, cy: 520, glow: 'df-firefly-purple', r: 9, dx: 15, dy: -12, dur: 5 },
          { cx: 160, cy: 550, glow: 'df-firefly-warm', r: 11, dx: -18, dy: -16, dur: 7 },
          { cx: 490, cy: 560, glow: 'df-firefly-green', r: 13, dx: 28, dy: 10, dur: 4.5 },
          { cx: 700, cy: 540, glow: 'df-firefly-warm', r: 10, dx: -12, dy: -20, dur: 6.5 },
        ].map((f, i) => (
          <g key={`ff${i}`}>
            {/* Glow halo */}
            <circle cx={f.cx} cy={f.cy} r={f.r} fill={`url(#${f.glow})`}>
              <animate attributeName="cx" values={`${f.cx};${f.cx + f.dx};${f.cx}`} dur={`${f.dur}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${f.cy};${f.cy + f.dy};${f.cy}`} dur={`${f.dur}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${f.dur * 0.6}s`} repeatCount="indefinite" />
            </circle>
            {/* Bright core */}
            <circle cx={f.cx} cy={f.cy} r={2} fill="white" opacity="0.8">
              <animate attributeName="cx" values={`${f.cx};${f.cx + f.dx};${f.cx}`} dur={`${f.dur}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${f.cy};${f.cy + f.dy};${f.cy}`} dur={`${f.dur}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${f.dur * 0.6}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Ambient sparkle motes ── */}
        {[
          [60, 280, 1.2, 3], [180, 350, 1, 4.5], [300, 290, 1.5, 3.5],
          [420, 360, 1, 5], [550, 300, 1.3, 4], [670, 370, 1, 3.8],
          [100, 420, 1.2, 4.2], [340, 470, 1, 5.5], [600, 480, 1.5, 3],
          [750, 400, 1, 4.8],
        ].map(([x, y, r, dur], i) => (
          <circle key={`sp${i}`} cx={x} cy={y} r={r} fill="white" opacity="0">
            <animate attributeName="opacity" values="0;0.6;0" dur={`${dur}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
