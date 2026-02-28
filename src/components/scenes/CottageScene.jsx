/**
 * Cozy cottage in a meadow — rolling hills, wildflowers, garden fence,
 * stone path, animated chimney smoke, fluttering butterflies, swaying flowers.
 * Warm storybook palette inspired by Julia Donaldson / Gruffalo illustrations.
 */
export default function CottageScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        {/* Warm sunny sky */}
        <linearGradient id="cottageSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ba8d9" />
          <stop offset="60%" stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#d4ecfa" />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="cottageSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffe082" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffe082" stopOpacity="0" />
        </radialGradient>

        {/* Cottage wall texture gradient */}
        <linearGradient id="cottageWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#e8d5a8" />
        </linearGradient>

        {/* Roof gradient */}
        <linearGradient id="cottageRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5e3c" />
          <stop offset="100%" stopColor="#6d4228" />
        </linearGradient>

        {/* Door gradient */}
        <linearGradient id="cottageDoor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0522d" />
          <stop offset="100%" stopColor="#7a3b1e" />
        </linearGradient>

        {/* Stone path gradient */}
        <linearGradient id="stonePath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8a88a" />
          <stop offset="100%" stopColor="#9e8e70" />
        </linearGradient>

        {/* Smoke particle */}
        <radialGradient id="smokeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d0d0d0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c0c0c0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#cottageSky)" />

      {/* Sun with warm glow */}
      <circle cx="680" cy="90" r="140" fill="url(#cottageSunGlow)" />
      <circle cx="680" cy="90" r="42" fill="#ffe566" opacity="0.95" />
      <circle cx="680" cy="90" r="36" fill="#ffed8a" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
        <line
          key={`ray-${angle}`}
          x1={680 + Math.cos(angle * Math.PI / 180) * 48}
          y1={90 + Math.sin(angle * Math.PI / 180) * 48}
          x2={680 + Math.cos(angle * Math.PI / 180) * 62}
          y2={90 + Math.sin(angle * Math.PI / 180) * 62}
          stroke="#ffe566"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}

      {/* Fluffy clouds */}
      <g opacity="0.9">
        <ellipse cx="120" cy="75" rx="55" ry="22" fill="white" />
        <ellipse cx="155" cy="68" rx="42" ry="20" fill="white" />
        <ellipse cx="90" cy="72" rx="38" ry="18" fill="white" />
        <ellipse cx="130" cy="62" rx="30" ry="16" fill="#fafafa" />
      </g>
      <g opacity="0.7">
        <ellipse cx="400" cy="55" rx="50" ry="18" fill="white" />
        <ellipse cx="435" cy="50" rx="38" ry="16" fill="white" />
        <ellipse cx="375" cy="52" rx="32" ry="15" fill="white" />
      </g>
      <g opacity="0.5">
        <ellipse cx="560" cy="110" rx="42" ry="15" fill="white" />
        <ellipse cx="590" cy="106" rx="30" ry="13" fill="white" />
        <ellipse cx="540" cy="108" rx="26" ry="12" fill="white" />
      </g>

      {/* Distant rolling hills */}
      <path d="M0 320 Q80 270 180 310 Q300 250 440 300 Q560 260 700 290 Q760 275 800 310 L800 600 L0 600 Z" fill="#7ec87e" />
      <path d="M0 350 Q120 310 250 340 Q380 295 520 330 Q650 300 800 340 L800 600 L0 600 Z" fill="#5eb85e" />

      {/* Distant trees on far hills */}
      <g fill="#4a9e4a" opacity="0.7">
        <ellipse cx="80" cy="310" rx="18" ry="22" />
        <ellipse cx="110" cy="305" rx="15" ry="20" />
        <ellipse cx="95" cy="300" rx="14" ry="18" />
        <ellipse cx="680" cy="295" rx="16" ry="20" />
        <ellipse cx="710" cy="290" rx="18" ry="22" />
        <ellipse cx="695" cy="285" rx="14" ry="17" />
        <ellipse cx="760" cy="300" rx="12" ry="16" />
      </g>

      {/* Mid-ground hill */}
      <path d="M0 400 Q100 360 220 385 Q380 350 520 375 Q660 350 800 390 L800 600 L0 600 Z" fill="#4da64d" />

      {/* Wildflowers on mid-ground hill */}
      {[
        [40, 390, '#e74c8b', 3.5], [70, 385, '#f5d742', 3], [110, 378, '#e74c8b', 2.5],
        [160, 372, '#9b59b6', 3], [200, 380, '#f5d742', 3.5], [620, 368, '#e74c8b', 3],
        [660, 372, '#f5d742', 2.5], [700, 365, '#9b59b6', 3], [740, 375, '#e74c8b', 3.5],
        [770, 380, '#f5d742', 3],
      ].map(([x, y, color, r], i) => (
        <g key={`wf-${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#3a7a3a" strokeWidth="1.5" />
          <circle cx={x} cy={y} r={r} fill={color} opacity="0.85">
            <animate
              attributeName="cy"
              values={`${y};${y - 2};${y}`}
              dur={`${2.5 + (i % 4) * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Garden fence */}
      <g>
        {/* Fence posts */}
        {[260, 295, 330, 365, 400, 435, 470, 505, 540].map(x => (
          <g key={`fp-${x}`}>
            <rect x={x - 3} y="400" width="6" height="45" rx="1" fill="#c8a058" />
            {/* Pointed top */}
            <polygon points={`${x - 3},400 ${x},393 ${x + 3},400`} fill="#c8a058" />
          </g>
        ))}
        {/* Fence rails */}
        <rect x="257" y="410" width="290" height="5" rx="2" fill="#d4aa60" />
        <rect x="257" y="428" width="290" height="5" rx="2" fill="#d4aa60" />
      </g>

      {/* Garden flowers along the fence */}
      {[
        [270, 398, '#ff6b8a', 4], [285, 395, '#ffcc33', 3.5], [305, 397, '#ff88aa', 3],
        [340, 394, '#ff6b8a', 4], [358, 396, '#9b6bdf', 3.5], [385, 393, '#ffcc33', 4],
        [410, 398, '#ff88aa', 3], [440, 394, '#ff6b8a', 3.5], [465, 396, '#ffcc33', 4],
        [490, 393, '#9b6bdf', 3], [515, 397, '#ff6b8a', 3.5], [535, 395, '#ffcc33', 3],
      ].map(([x, y, color, r], i) => (
        <g key={`gf-${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 8} stroke="#3a8a3a" strokeWidth="1" />
          {/* Petal flower pattern */}
          <circle cx={x} cy={y} r={r} fill={color} opacity="0.9">
            <animate
              attributeName="r"
              values={`${r};${r + 0.5};${r}`}
              dur={`${3 + (i % 5) * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={x} cy={y} r={r * 0.4} fill="#fff5cc" opacity="0.8" />
        </g>
      ))}

      {/* Foreground grass */}
      <path d="M0 445 Q100 430 200 440 Q350 420 500 435 Q650 425 800 445 L800 600 L0 600 Z" fill="#3d9b3d" />

      {/* Stone path leading to cottage door */}
      <g>
        <path d="M395 480 Q392 500 388 530 Q385 555 382 580 Q380 595 378 600" fill="none" stroke="#c4b496" strokeWidth="52" strokeLinecap="round" opacity="0.4" />
        {/* Individual stones */}
        {[
          [382, 490, 18, 10, -5], [398, 492, 16, 9, 8],
          [378, 510, 17, 10, -3], [396, 513, 15, 9, 6],
          [375, 532, 18, 10, -7], [393, 534, 16, 9, 4],
          [372, 554, 17, 10, -4], [390, 556, 15, 9, 7],
          [370, 576, 18, 10, -6], [388, 578, 16, 9, 3],
          [368, 596, 17, 10, -2], [386, 598, 15, 9, 5],
        ].map(([cx, cy, rx, ry, rot], i) => (
          <ellipse
            key={`st-${i}`}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${rot} ${cx} ${cy})`}
            fill={i % 3 === 0 ? '#b8a88a' : i % 3 === 1 ? '#c4b496' : '#a89878'}
            stroke="#9e8e70"
            strokeWidth="0.8"
          />
        ))}
      </g>

      {/* Cottage */}
      <g transform="translate(320, 290)">
        {/* Cottage shadow */}
        <ellipse cx="75" cy="160" rx="95" ry="12" fill="#2d6a2d" opacity="0.25" />

        {/* Main cottage body */}
        <rect x="10" y="55" width="130" height="105" rx="3" fill="url(#cottageWall)" />
        {/* Stone texture details on walls */}
        <rect x="15" y="60" width="18" height="12" rx="2" fill="#e0d098" opacity="0.5" />
        <rect x="38" y="62" width="20" height="10" rx="2" fill="#dcc890" opacity="0.4" />
        <rect x="15" y="78" width="22" height="11" rx="2" fill="#dcc890" opacity="0.4" />
        <rect x="42" y="76" width="16" height="12" rx="2" fill="#e0d098" opacity="0.5" />
        <rect x="95" y="60" width="18" height="12" rx="2" fill="#e0d098" opacity="0.5" />
        <rect x="115" y="62" width="20" height="10" rx="2" fill="#dcc890" opacity="0.4" />
        <rect x="95" y="78" width="22" height="11" rx="2" fill="#dcc890" opacity="0.4" />
        <rect x="120" y="76" width="16" height="12" rx="2" fill="#e0d098" opacity="0.5" />

        {/* Thatched roof */}
        <path d="M-5 58 L75 0 L155 58 Z" fill="url(#cottageRoof)" />
        {/* Roof texture lines */}
        <g stroke="#7a4a2a" strokeWidth="1" opacity="0.3">
          <line x1="10" y1="50" x2="75" y2="12" />
          <line x1="140" y1="50" x2="75" y2="12" />
          <line x1="20" y1="48" x2="130" y2="48" />
          <line x1="30" y1="40" x2="120" y2="40" />
          <line x1="42" y1="32" x2="108" y2="32" />
          <line x1="52" y1="24" x2="98" y2="24" />
        </g>
        {/* Roof overhang shadow */}
        <path d="M-5 58 L155 58 L150 63 L0 63 Z" fill="#6d4228" opacity="0.3" />

        {/* Chimney */}
        <rect x="100" y="8" width="22" height="50" rx="2" fill="#a07050" />
        <rect x="97" y="5" width="28" height="8" rx="2" fill="#8b6040" />
        {/* Chimney bricks */}
        <g stroke="#8b6040" strokeWidth="0.5" opacity="0.5">
          <line x1="100" y1="20" x2="122" y2="20" />
          <line x1="100" y1="30" x2="122" y2="30" />
          <line x1="100" y1="40" x2="122" y2="40" />
          <line x1="111" y1="13" x2="111" y2="20" />
          <line x1="108" y1="20" x2="108" y2="30" />
          <line x1="114" y1="30" x2="114" y2="40" />
          <line x1="108" y1="40" x2="108" y2="50" />
        </g>

        {/* Chimney smoke — animated puffs rising */}
        <g opacity="0.5">
          <circle cx="111" cy="-10" r="6" fill="url(#smokeGrad)">
            <animate attributeName="cy" values="0;-40;-80" dur="4s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;8;12" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.35;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="-5" r="5" fill="url(#smokeGrad)">
            <animate attributeName="cy" values="0;-35;-70" dur="3.5s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="cx" values="115;120;126" dur="3.5s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;7;11" dur="3.5s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.3;0" dur="3.5s" begin="1.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="108" cy="-5" r="5" fill="url(#smokeGrad)">
            <animate attributeName="cy" values="0;-45;-90" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
            <animate attributeName="cx" values="108;104;98" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;7.5;12" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.3;0" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Front door */}
        <rect x="55" y="105" width="38" height="55" rx="3" fill="url(#cottageDoor)" />
        {/* Door arch top */}
        <path d="M55 108 Q74 88 93 108" fill="#8b4020" />
        {/* Door panels */}
        <rect x="60" y="112" width="12" height="18" rx="1.5" fill="#8b4020" opacity="0.6" />
        <rect x="76" y="112" width="12" height="18" rx="1.5" fill="#8b4020" opacity="0.6" />
        <rect x="60" y="135" width="12" height="18" rx="1.5" fill="#8b4020" opacity="0.6" />
        <rect x="76" y="135" width="12" height="18" rx="1.5" fill="#8b4020" opacity="0.6" />
        {/* Door knob */}
        <circle cx="87" cy="135" r="2.5" fill="#d4a642" />
        <circle cx="87" cy="135" r="1.5" fill="#e8be52" />

        {/* Door step */}
        <rect x="50" y="157" width="48" height="6" rx="2" fill="#b8a88a" />

        {/* Left window */}
        <rect x="20" y="80" width="28" height="28" rx="2" fill="#6db8d4" stroke="#7a5a3a" strokeWidth="2" />
        <line x1="34" y1="80" x2="34" y2="108" stroke="#7a5a3a" strokeWidth="1.5" />
        <line x1="20" y1="94" x2="48" y2="94" stroke="#7a5a3a" strokeWidth="1.5" />
        {/* Warm glow inside window */}
        <rect x="21" y="81" width="12" height="12" rx="1" fill="#fff4c4" opacity="0.25" />
        {/* Window box with flowers */}
        <rect x="17" y="108" width="34" height="6" rx="1.5" fill="#7a5a3a" />
        <circle cx="23" cy="106" r="3" fill="#ff6b8a" />
        <circle cx="31" cy="104" r="3.5" fill="#ffcc33" />
        <circle cx="39" cy="106" r="3" fill="#ff88aa" />
        <circle cx="27" cy="105" r="2.5" fill="#ff88aa" />
        <circle cx="35" cy="106" r="2.5" fill="#ff6b8a" />

        {/* Right window */}
        <rect x="100" y="80" width="28" height="28" rx="2" fill="#6db8d4" stroke="#7a5a3a" strokeWidth="2" />
        <line x1="114" y1="80" x2="114" y2="108" stroke="#7a5a3a" strokeWidth="1.5" />
        <line x1="100" y1="94" x2="128" y2="94" stroke="#7a5a3a" strokeWidth="1.5" />
        {/* Warm glow inside window */}
        <rect x="101" y="81" width="12" height="12" rx="1" fill="#fff4c4" opacity="0.25" />
        {/* Window box with flowers */}
        <rect x="97" y="108" width="34" height="6" rx="1.5" fill="#7a5a3a" />
        <circle cx="103" cy="106" r="3" fill="#ffcc33" />
        <circle cx="111" cy="104" r="3.5" fill="#ff6b8a" />
        <circle cx="119" cy="106" r="3" fill="#9b6bdf" />
        <circle cx="107" cy="105" r="2.5" fill="#ff88aa" />
        <circle cx="115" cy="106" r="2.5" fill="#ffcc33" />
      </g>

      {/* Bushes around the cottage */}
      <g>
        <ellipse cx="310" cy="448" rx="20" ry="14" fill="#3a8a3a" />
        <ellipse cx="325" cy="445" rx="16" ry="12" fill="#4a9a4a" />
        <ellipse cx="298" cy="446" rx="14" ry="11" fill="#3a8a3a" />
        <ellipse cx="490" cy="448" rx="20" ry="14" fill="#3a8a3a" />
        <ellipse cx="505" cy="445" rx="16" ry="12" fill="#4a9a4a" />
        <ellipse cx="478" cy="446" rx="14" ry="11" fill="#3a8a3a" />
      </g>

      {/* Left side tree */}
      <g transform="translate(140, 320)">
        <rect x="18" y="60" width="14" height="55" rx="3" fill="#7a5a3a" />
        {/* Branch */}
        <line x1="25" y1="75" x2="8" y2="60" stroke="#7a5a3a" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="85" x2="42" y2="70" stroke="#7a5a3a" strokeWidth="4" strokeLinecap="round" />
        {/* Foliage */}
        <ellipse cx="25" cy="40" rx="32" ry="28" fill="#3d8a3d" />
        <ellipse cx="10" cy="50" rx="22" ry="20" fill="#4a9a4a" />
        <ellipse cx="40" cy="48" rx="22" ry="20" fill="#4a9a4a" />
        <ellipse cx="25" cy="28" rx="24" ry="22" fill="#5aaa5a" />
        {/* Apples on tree */}
        <circle cx="12" cy="45" r="3.5" fill="#e84040" />
        <circle cx="38" cy="42" r="3" fill="#e84040" />
        <circle cx="25" cy="55" r="3.5" fill="#e84040" />
      </g>

      {/* Right side tree */}
      <g transform="translate(560, 330)">
        <rect x="15" y="50" width="12" height="48" rx="3" fill="#7a5a3a" />
        <line x1="21" y1="65" x2="6" y2="52" stroke="#7a5a3a" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="21" cy="32" rx="28" ry="25" fill="#3d8a3d" />
        <ellipse cx="8" cy="42" rx="18" ry="17" fill="#4a9a4a" />
        <ellipse cx="34" cy="40" rx="18" ry="17" fill="#4a9a4a" />
        <ellipse cx="21" cy="22" rx="20" ry="18" fill="#5aaa5a" />
      </g>

      {/* Foreground grass tufts */}
      <g fill="#2d8a2d" opacity="0.5">
        {[
          [30, 465], [55, 460], [120, 458], [200, 462], [250, 456],
          [550, 458], [600, 462], [650, 456], [720, 460], [760, 465],
        ].map(([x, y], i) => (
          <g key={`gt-${i}`}>
            <path d={`M${x} ${y + 8} Q${x + 2} ${y - 5} ${x + 5} ${y + 8}`}>
              <animate
                attributeName="d"
                values={`M${x} ${y + 8} Q${x + 2} ${y - 5} ${x + 5} ${y + 8};M${x} ${y + 8} Q${x + 4} ${y - 4} ${x + 5} ${y + 8};M${x} ${y + 8} Q${x + 2} ${y - 5} ${x + 5} ${y + 8}`}
                dur={`${2 + (i % 3) * 0.8}s`}
                repeatCount="indefinite"
              />
            </path>
            <path d={`M${x + 3} ${y + 8} Q${x + 5} ${y - 8} ${x + 8} ${y + 8}`}>
              <animate
                attributeName="d"
                values={`M${x + 3} ${y + 8} Q${x + 5} ${y - 8} ${x + 8} ${y + 8};M${x + 3} ${y + 8} Q${x + 7} ${y - 7} ${x + 8} ${y + 8};M${x + 3} ${y + 8} Q${x + 5} ${y - 8} ${x + 8} ${y + 8}`}
                dur={`${2.5 + (i % 4) * 0.6}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}
      </g>

      {/* Foreground wildflowers with swaying animation */}
      {[
        [25, 475, '#ff6b8a', 4.5], [60, 470, '#ffcc33', 4], [100, 478, '#9b6bdf', 3.5],
        [140, 472, '#ff88aa', 4], [210, 468, '#ffcc33', 3.5], [240, 476, '#ff6b8a', 4],
        [560, 470, '#9b6bdf', 4], [610, 476, '#ffcc33', 3.5], [650, 468, '#ff6b8a', 4.5],
        [700, 474, '#ff88aa', 4], [740, 470, '#ffcc33', 3.5], [775, 476, '#9b6bdf', 4],
      ].map(([x, y, color, r], i) => (
        <g key={`ff-${i}`}>
          {/* Stem with sway */}
          <line x1={x} y1={y} x2={x} y2={y + 14} stroke="#3a8a3a" strokeWidth="1.5">
            <animate
              attributeName="x1"
              values={`${x};${x + 2};${x}`}
              dur={`${2.5 + (i % 3) * 0.7}s`}
              repeatCount="indefinite"
            />
          </line>
          {/* Leaf */}
          <ellipse cx={x + 4} cy={y + 8} rx="4" ry="2" fill="#4a9a4a" opacity="0.7"
            transform={`rotate(-30 ${x + 4} ${y + 8})`}
          />
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse
              key={`p-${i}-${j}`}
              cx={x + Math.cos(angle * Math.PI / 180) * (r * 0.7)}
              cy={y + Math.sin(angle * Math.PI / 180) * (r * 0.7)}
              rx={r * 0.55}
              ry={r * 0.35}
              fill={color}
              opacity="0.85"
              transform={`rotate(${angle} ${x + Math.cos(angle * Math.PI / 180) * (r * 0.7)} ${y + Math.sin(angle * Math.PI / 180) * (r * 0.7)})`}
            >
              <animate
                attributeName="opacity"
                values="0.85;0.95;0.85"
                dur={`${3 + (i % 4) * 0.5}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          ))}
          {/* Center */}
          <circle cx={x} cy={y} r={r * 0.35} fill="#fff5cc" />
        </g>
      ))}

      {/* Butterflies — animated fluttering */}
      {[
        [180, 260, '#ff88cc', '#ffaadd', 5],
        [500, 230, '#88bbff', '#aaccff', 4.5],
        [650, 310, '#ffaa55', '#ffcc88', 5],
        [100, 340, '#cc88ff', '#ddaaff', 4],
      ].map(([startX, startY, wingColor1, wingColor2, size], i) => (
        <g key={`bf-${i}`} opacity="0.85">
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${12 + i * 3},${-8 - i * 2}; ${25 + i * 4},${2}; ${12 + i * 3},${-6 - i}; 0,0`}
            dur={`${8 + i * 2}s`}
            repeatCount="indefinite"
          />
          {/* Left wing */}
          <ellipse cx={startX - size * 0.7} cy={startY - size * 0.3} rx={size} ry={size * 0.65} fill={wingColor1}
            transform={`rotate(-20 ${startX - size * 0.7} ${startY - size * 0.3})`}
          >
            <animate
              attributeName="ry"
              values={`${size * 0.65};${size * 0.2};${size * 0.65}`}
              dur={`${0.6 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Right wing */}
          <ellipse cx={startX + size * 0.7} cy={startY - size * 0.3} rx={size} ry={size * 0.65} fill={wingColor1}
            transform={`rotate(20 ${startX + size * 0.7} ${startY - size * 0.3})`}
          >
            <animate
              attributeName="ry"
              values={`${size * 0.65};${size * 0.2};${size * 0.65}`}
              dur={`${0.6 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Lower wings */}
          <ellipse cx={startX - size * 0.5} cy={startY + size * 0.2} rx={size * 0.7} ry={size * 0.45} fill={wingColor2}
            transform={`rotate(-10 ${startX - size * 0.5} ${startY + size * 0.2})`}
          >
            <animate
              attributeName="ry"
              values={`${size * 0.45};${size * 0.15};${size * 0.45}`}
              dur={`${0.6 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx={startX + size * 0.5} cy={startY + size * 0.2} rx={size * 0.7} ry={size * 0.45} fill={wingColor2}
            transform={`rotate(10 ${startX + size * 0.5} ${startY + size * 0.2})`}
          >
            <animate
              attributeName="ry"
              values={`${size * 0.45};${size * 0.15};${size * 0.45}`}
              dur={`${0.6 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Body */}
          <ellipse cx={startX} cy={startY} rx={size * 0.15} ry={size * 0.5} fill="#4a3520" />
          {/* Antennae */}
          <line x1={startX - 1} y1={startY - size * 0.5} x2={startX - size * 0.5} y2={startY - size} stroke="#4a3520" strokeWidth="0.8" />
          <line x1={startX + 1} y1={startY - size * 0.5} x2={startX + size * 0.5} y2={startY - size} stroke="#4a3520" strokeWidth="0.8" />
          <circle cx={startX - size * 0.5} cy={startY - size} r="1" fill="#4a3520" />
          <circle cx={startX + size * 0.5} cy={startY - size} r="1" fill="#4a3520" />
        </g>
      ))}

      {/* Foreground grass strip */}
      <path d="M0 490 Q200 480 400 488 Q600 478 800 490 L800 600 L0 600 Z" fill="#338833" />
      <path d="M0 510 Q150 500 350 508 Q550 498 800 510 L800 600 L0 600 Z" fill="#2d7a2d" />

      {/* Daisy cluster in foreground */}
      {[
        [50, 505, 5], [80, 510, 4], [130, 502, 5.5], [680, 508, 5],
        [720, 504, 4.5], [760, 512, 5],
      ].map(([x, y, r], i) => (
        <g key={`dy-${i}`}>
          <line x1={x} y1={y + r} x2={x} y2={y + r + 12} stroke="#2d7a2d" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <ellipse
              key={`dp-${i}-${j}`}
              cx={x + Math.cos(angle * Math.PI / 180) * r * 0.6}
              cy={y + Math.sin(angle * Math.PI / 180) * r * 0.6}
              rx={r * 0.45}
              ry={r * 0.2}
              fill="white"
              transform={`rotate(${angle} ${x + Math.cos(angle * Math.PI / 180) * r * 0.6} ${y + Math.sin(angle * Math.PI / 180) * r * 0.6})`}
            />
          ))}
          <circle cx={x} cy={y} r={r * 0.3} fill="#ffdd44" />
        </g>
      ))}
    </svg>
  );
}
