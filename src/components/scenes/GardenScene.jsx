/**
 * Garden scene background — sunny garden with rolling hills, wooden fence,
 * garden shed, flower beds (sunflowers + tulips), winding garden path,
 * dirt holes for critters, bees, butterfly, and drifting clouds.
 * Rich storybook style (Gruffalo / Donaldson) matching MeadowScene quality.
 * Used as background for Pop Critters garden game.
 */
export default function GardenScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        {/* Sky gradient — warm summer blue fading to pale horizon */}
        <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="60%" stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#d4eeff" />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="garden-sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff7cc" />
          <stop offset="50%" stopColor="#ffe066" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
        </radialGradient>

        {/* Far hill gradient */}
        <linearGradient id="garden-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6eba6e" />
          <stop offset="100%" stopColor="#5aa55a" />
        </linearGradient>

        {/* Mid hill gradient */}
        <linearGradient id="garden-hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4da64d" />
          <stop offset="100%" stopColor="#3d9b3d" />
        </linearGradient>

        {/* Foreground grass */}
        <linearGradient id="garden-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d9b3d" />
          <stop offset="100%" stopColor="#2d8a2d" />
        </linearGradient>

        {/* Garden path */}
        <linearGradient id="garden-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4B896" />
          <stop offset="100%" stopColor="#C0A480" />
        </linearGradient>

        {/* Dirt hole */}
        <radialGradient id="garden-hole" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#2A1808" />
          <stop offset="100%" stopColor="#4A3220" />
        </radialGradient>

        {/* Fence wood */}
        <linearGradient id="garden-fence" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4A070" />
          <stop offset="50%" stopColor="#B08A58" />
          <stop offset="100%" stopColor="#9A7448" />
        </linearGradient>

        {/* Shed wall */}
        <linearGradient id="garden-shed-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6040" />
          <stop offset="100%" stopColor="#6B4830" />
        </linearGradient>

        {/* Shed roof */}
        <linearGradient id="garden-shed-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A04040" />
          <stop offset="100%" stopColor="#803030" />
        </linearGradient>

        {/* Cloud drift animations */}
        <animateTransform
          xlinkHref="#garden-cloud-1"
          attributeName="transform"
          type="translate"
          values="0,0;40,0;0,0"
          dur="45s"
          repeatCount="indefinite"
        />
        <animateTransform
          xlinkHref="#garden-cloud-2"
          attributeName="transform"
          type="translate"
          values="0,0;-30,0;0,0"
          dur="55s"
          repeatCount="indefinite"
        />
        <animateTransform
          xlinkHref="#garden-cloud-3"
          attributeName="transform"
          type="translate"
          values="0,0;25,0;0,0"
          dur="38s"
          repeatCount="indefinite"
        />

        {/* Bee flight paths */}
        <path id="garden-bee-path-1" d="M100,380 C160,350 220,400 300,370 C360,340 400,380 460,360" fill="none" />
        <path id="garden-bee-path-2" d="M500,350 C540,320 600,370 660,340 C700,310 740,360 780,340" fill="none" />
      </defs>

      {/* ====== SKY ====== */}
      <rect width="800" height="600" fill="url(#garden-sky)" />

      {/* ====== SUN with warm glow and rays ====== */}
      <circle cx="680" cy="85" r="120" fill="url(#garden-sun-glow)" />
      <circle cx="680" cy="85" r="48" fill="#ffe066" opacity="0.95">
        <animate attributeName="r" values="48;50;48" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="85" r="36" fill="#ffcc33" opacity="0.5" />

      {/* Sun rays */}
      <g stroke="#ffe066" strokeLinecap="round" opacity="0.5">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1={680 + Math.cos((angle * Math.PI) / 180) * 56}
            y1={85 + Math.sin((angle * Math.PI) / 180) * 56}
            x2={680 + Math.cos((angle * Math.PI) / 180) * 76}
            y2={85 + Math.sin((angle * Math.PI) / 180) * 76}
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

      {/* ====== CLOUDS ====== */}
      <g id="garden-cloud-1" opacity="0.85">
        <ellipse cx="120" cy="75" rx="65" ry="26" fill="white" />
        <ellipse cx="160" cy="67" rx="50" ry="24" fill="white" />
        <ellipse cx="90" cy="71" rx="42" ry="20" fill="white" />
        <ellipse cx="140" cy="83" rx="55" ry="18" fill="#f0f8ff" />
      </g>
      <g id="garden-cloud-2" opacity="0.7">
        <ellipse cx="400" cy="50" rx="48" ry="18" fill="white" />
        <ellipse cx="430" cy="45" rx="38" ry="16" fill="white" />
        <ellipse cx="375" cy="48" rx="32" ry="14" fill="white" />
        <ellipse cx="410" cy="55" rx="40" ry="12" fill="#f0f8ff" />
      </g>
      <g id="garden-cloud-3" opacity="0.6">
        <ellipse cx="300" cy="120" rx="36" ry="14" fill="white" />
        <ellipse cx="325" cy="116" rx="28" ry="12" fill="white" />
        <ellipse cx="280" cy="118" rx="24" ry="11" fill="white" />
      </g>

      {/* ====== BIRDS ====== */}
      <g stroke="#445566" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M170,130 Q176,124 182,130 Q188,124 194,130">
          <animateTransform attributeName="transform" type="translate" values="0,0;8,-4;16,0" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M250,95 Q255,90 260,95 Q265,90 270,95">
          <animateTransform attributeName="transform" type="translate" values="0,0;-6,-3;-12,0;-6,3;0,0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M520,140 Q524,135 528,140 Q532,135 536,140">
          <animateTransform attributeName="transform" type="translate" values="0,0;10,-2;20,0" dur="7s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ====== FAR ROLLING HILLS ====== */}
      <path
        d="M0,310 Q80,270 180,300 Q280,240 400,290 Q500,250 580,280 Q700,240 800,300 L800,600 L0,600 Z"
        fill="url(#garden-hill-far)"
      />
      {/* Hill texture — subtle darker patches */}
      <path d="M100,290 Q140,270 180,295" fill="none" stroke="#5aa55a" strokeWidth="12" opacity="0.3" strokeLinecap="round" />
      <path d="M420,275 Q470,255 520,280" fill="none" stroke="#5aa55a" strokeWidth="10" opacity="0.25" strokeLinecap="round" />

      {/* Distant tree clusters */}
      <g>
        <ellipse cx="140" cy="280" rx="18" ry="24" fill="#3d8a3d" />
        <ellipse cx="125" cy="286" rx="14" ry="20" fill="#4a9a4a" />
        <ellipse cx="158" cy="284" rx="12" ry="18" fill="#4a9a4a" />
        <rect x="137" y="298" width="6" height="14" rx="2" fill="#6b4226" />
      </g>
      <g>
        <ellipse cx="500" cy="260" rx="16" ry="22" fill="#3d8a3d" />
        <ellipse cx="520" cy="264" rx="14" ry="18" fill="#4a9a4a" />
        <rect x="498" y="276" width="5" height="12" rx="2" fill="#6b4226" />
      </g>

      {/* ====== GARDEN SHED — on far right hill ====== */}
      <g>
        {/* Wall */}
        <rect x="680" y="260" width="60" height="50" rx="2" fill="url(#garden-shed-wall)" stroke="#4A3020" strokeWidth="1.5" />
        {/* Roof */}
        <polygon points="670,260 710,232 750,260" fill="url(#garden-shed-roof)" stroke="#602020" strokeWidth="1.5" />
        {/* Door */}
        <rect x="700" y="282" width="18" height="28" rx="2" fill="#4A3020" />
        <circle cx="714" cy="298" r="1.5" fill="#C4A070" /> {/* doorknob */}
        {/* Window */}
        <rect x="686" y="274" width="10" height="10" rx="1" fill="#87ceeb" stroke="#4A3020" strokeWidth="1" />
        <line x1="691" y1="274" x2="691" y2="284" stroke="#4A3020" strokeWidth="0.8" />
        <line x1="686" y1="279" x2="696" y2="279" stroke="#4A3020" strokeWidth="0.8" />
      </g>

      {/* ====== MID HILLS ====== */}
      <path
        d="M0,370 Q60,340 150,360 Q260,320 380,355 Q480,330 580,350 Q700,320 800,360 L800,600 L0,600 Z"
        fill="url(#garden-hill-mid)"
      />

      {/* ====== WOODEN FENCE — runs across midground ====== */}
      <g>
        {/* Horizontal rails */}
        <rect x="0" y="340" width="300" height="4" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        <rect x="0" y="354" width="300" height="4" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        <rect x="520" y="330" width="280" height="4" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        <rect x="520" y="344" width="280" height="4" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        {/* Vertical pickets — left section */}
        {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x) => (
          <rect key={`fl-${x}`} x={x} y="330" width="5" height="34" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        ))}
        {/* Picket points */}
        {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x) => (
          <polygon key={`fp-${x}`} points={`${x},330 ${x + 2.5},324 ${x + 5},330`} fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        ))}
        {/* Vertical pickets — right section */}
        {[530, 560, 590, 620, 650, 680, 710, 740, 770].map((x) => (
          <rect key={`fr-${x}`} x={x} y="320" width="5" height="34" rx="1" fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        ))}
        {[530, 560, 590, 620, 650, 680, 710, 740, 770].map((x) => (
          <polygon key={`frp-${x}`} points={`${x},320 ${x + 2.5},314 ${x + 5},320`} fill="url(#garden-fence)" stroke="#8A6438" strokeWidth="0.5" />
        ))}
      </g>

      {/* ====== FLOWER BEDS — left side (sunflowers + tulips) ====== */}
      {/* Sunflowers — tall stems with yellow petals + brown centre */}
      {[
        { x: 40, y: 380, h: 60 },
        { x: 70, y: 370, h: 70 },
        { x: 100, y: 375, h: 65 },
        { x: 55, y: 385, h: 50 },
      ].map(({ x, y, h }, i) => (
        <g key={`sunflower-${i}`}>
          {/* Stem */}
          <line x1={x} y1={y} x2={x} y2={y + h} stroke="#3d8a3d" strokeWidth="3" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx={x - 8} cy={y + h * 0.5} rx="8" ry="4" fill="#4da64d" transform={`rotate(-20,${x - 8},${y + h * 0.5})`} />
          <ellipse cx={x + 8} cy={y + h * 0.6} rx="7" ry="3.5" fill="#4da64d" transform={`rotate(20,${x + 8},${y + h * 0.6})`} />
          {/* Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <ellipse
              key={`sp-${i}-${angle}`}
              cx={x + Math.cos((angle * Math.PI) / 180) * 10}
              cy={y + Math.sin((angle * Math.PI) / 180) * 10}
              rx="5"
              ry="3"
              fill="#ffd700"
              transform={`rotate(${angle},${x + Math.cos((angle * Math.PI) / 180) * 10},${y + Math.sin((angle * Math.PI) / 180) * 10})`}
            />
          ))}
          {/* Brown centre */}
          <circle cx={x} cy={y} r="7" fill="#6B4226" />
          <circle cx={x} cy={y} r="5" fill="#8B5A2A" />
          {/* Seeds pattern */}
          <circle cx={x - 1.5} cy={y - 1.5} r="0.8" fill="#4A3020" />
          <circle cx={x + 1.5} cy={y - 1} r="0.8" fill="#4A3020" />
          <circle cx={x} cy={y + 1.5} r="0.8" fill="#4A3020" />
        </g>
      ))}

      {/* Tulips — left side */}
      {[
        { x: 20, y: 420, color: '#e63946' },
        { x: 35, y: 415, color: '#ec4899' },
        { x: 48, y: 425, color: '#e63946' },
        { x: 85, y: 418, color: '#f59e0b' },
        { x: 115, y: 422, color: '#ec4899' },
      ].map(({ x, y, color }, i) => (
        <g key={`tulip-l-${i}`}>
          <line x1={x} y1={y + 4} x2={x} y2={y + 18} stroke="#3d8a3d" strokeWidth="2" strokeLinecap="round" />
          <path d={`M${x - 5},${y + 4} Q${x},${y - 6} ${x + 5},${y + 4} Q${x},${y + 2} ${x - 5},${y + 4}`} fill={color} />
          <ellipse cx={x - 4} cy={y + 12} rx="5" ry="2.5" fill="#4da64d" transform={`rotate(-15,${x - 4},${y + 12})`} />
        </g>
      ))}

      {/* ====== FLOWER BEDS — right side ====== */}
      {/* Tulips — right side */}
      {[
        { x: 700, y: 375, color: '#8b5cf6' },
        { x: 720, y: 380, color: '#e63946' },
        { x: 740, y: 372, color: '#f59e0b' },
        { x: 760, y: 378, color: '#ec4899' },
        { x: 780, y: 382, color: '#8b5cf6' },
      ].map(({ x, y, color }, i) => (
        <g key={`tulip-r-${i}`}>
          <line x1={x} y1={y + 4} x2={x} y2={y + 18} stroke="#3d8a3d" strokeWidth="2" strokeLinecap="round" />
          <path d={`M${x - 5},${y + 4} Q${x},${y - 6} ${x + 5},${y + 4} Q${x},${y + 2} ${x - 5},${y + 4}`} fill={color} />
          <ellipse cx={x + 4} cy={y + 12} rx="5" ry="2.5" fill="#4da64d" transform={`rotate(15,${x + 4},${y + 12})`} />
        </g>
      ))}

      {/* Sunflower — right side accent */}
      <g>
        <line x1="755" y1="362" x2="755" y2="395" stroke="#3d8a3d" strokeWidth="3" strokeLinecap="round" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={`sr-${angle}`}
            cx={755 + Math.cos((angle * Math.PI) / 180) * 8}
            cy={362 + Math.sin((angle * Math.PI) / 180) * 8}
            rx="4"
            ry="2.5"
            fill="#ffd700"
            transform={`rotate(${angle},${755 + Math.cos((angle * Math.PI) / 180) * 8},${362 + Math.sin((angle * Math.PI) / 180) * 8})`}
          />
        ))}
        <circle cx="755" cy="362" r="5.5" fill="#6B4226" />
        <circle cx="755" cy="362" r="4" fill="#8B5A2A" />
      </g>

      {/* ====== GARDEN PATH — winding through the middle ====== */}
      <path
        d="M350,370 Q370,390 400,395 Q440,400 450,420 Q460,445 430,460 Q400,475 380,500 Q360,530 370,600"
        fill="none"
        stroke="url(#garden-path)"
        strokeWidth="40"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Path edges — slightly darker */}
      <path
        d="M350,370 Q370,390 400,395 Q440,400 450,420 Q460,445 430,460 Q400,475 380,500 Q360,530 370,600"
        fill="none"
        stroke="#A08060"
        strokeWidth="42"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Path gravel dots */}
      {[
        { x: 365, y: 382 }, { x: 385, y: 390 }, { x: 410, y: 398 },
        { x: 435, y: 410 }, { x: 448, y: 428 }, { x: 445, y: 445 },
        { x: 425, y: 462 }, { x: 400, y: 478 }, { x: 385, y: 495 },
        { x: 375, y: 520 }, { x: 370, y: 545 },
      ].map(({ x, y }, i) => (
        <circle key={`gravel-${i}`} cx={x} cy={y} r={1 + (i % 2)} fill="#B8A080" opacity="0.5" />
      ))}

      {/* ====== FOREGROUND GRASS ====== */}
      <path
        d="M0,430 Q80,420 180,428 Q300,415 400,425 Q520,412 640,424 Q740,416 800,430 L800,600 L0,600 Z"
        fill="url(#garden-ground)"
      />

      {/* ====== LAYERED GRASS TUFTS ====== */}
      <g fill="#2d7a2d" opacity="0.7">
        <path d="M30,440 Q34,424 38,440" />
        <path d="M35,440 Q40,420 45,440" />
        <path d="M150,435 Q154,418 158,435" />
        <path d="M155,435 Q160,415 165,435" />
        <path d="M310,438 Q314,422 318,438" />
        <path d="M600,436 Q604,420 608,436" />
        <path d="M605,436 Q610,416 615,436" />
        <path d="M730,438 Q734,422 738,438" />
        <path d="M735,438 Q740,418 745,438" />
      </g>
      <g fill="#4ab84a" opacity="0.5">
        <path d="M80,442 Q84,428 88,442" />
        <path d="M85,442 Q90,425 95,442" />
        <path d="M220,438 Q225,422 230,438" />
        <path d="M540,437 Q544,422 548,437" />
        <path d="M680,440 Q684,424 688,440" />
        <path d="M685,440 Q690,422 695,440" />
        <path d="M770,442 Q774,428 778,442" />
      </g>

      {/* ====== WILDFLOWERS — scattered in the foreground ====== */}
      {/* Daisies */}
      {[
        { x: 170, y: 450 },
        { x: 480, y: 445 },
        { x: 630, y: 448 },
        { x: 260, y: 452 },
      ].map(({ x, y }, i) => (
        <g key={`daisy-${i}`}>
          <line x1={x} y1={y + 4} x2={x} y2={y + 14} stroke="#3d8a3d" strokeWidth="1.5" />
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
          <circle cx={x} cy={y} r="2.2" fill="#f5c842" />
        </g>
      ))}

      {/* Buttercups */}
      {[
        { x: 140, y: 456 },
        { x: 340, y: 448 },
        { x: 560, y: 452 },
        { x: 710, y: 450 },
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
      <g>
        <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
          <mpath xlinkHref="#garden-bee-path-1" />
        </animateMotion>
        <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#f5c842" />
        <line x1="-2" y1="-3.5" x2="-2" y2="3.5" stroke="#2d2d2d" strokeWidth="1.5" />
        <line x1="1" y1="-3.5" x2="1" y2="3.5" stroke="#2d2d2d" strokeWidth="1.5" />
        <ellipse cx="-1" cy="-4" rx="3.5" ry="2" fill="white" opacity="0.7">
          <animate attributeName="ry" values="2;1.2;2" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="2" cy="-4" rx="3" ry="1.8" fill="white" opacity="0.6">
          <animate attributeName="ry" values="1.8;1;1.8" dur="0.15s" repeatCount="indefinite" />
        </ellipse>
      </g>
      <g>
        <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
          <mpath xlinkHref="#garden-bee-path-2" />
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

      {/* ====== BUTTERFLY — gentle float ====== */}
      <g opacity="0.85">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="200,380;220,370;240,375;260,365;240,370;220,375;200,380"
          dur="14s"
          repeatCount="indefinite"
        />
        <ellipse cx="-3" cy="-2" rx="5" ry="4" fill="#8b5cf6" opacity="0.8">
          <animate attributeName="rx" values="5;3;5" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="3" cy="-2" rx="5" ry="4" fill="#7c3aed" opacity="0.8">
          <animate attributeName="rx" values="5;3;5" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="0" cy="0" rx="1" ry="4" fill="#3b1f6e" />
      </g>

      {/* ====== FOREGROUND GRASS BLADES ====== */}
      <g fill="#267a26" opacity="0.6">
        <path d="M10,470 Q16,448 22,470" />
        <path d="M17,470 Q24,444 31,470" />
        <path d="M110,466 Q116,444 122,466" />
        <path d="M260,468 Q266,446 272,468" />
        <path d="M550,468 Q556,446 562,468" />
        <path d="M555,468 Q562,444 569,468" />
        <path d="M700,466 Q706,446 712,466" />
        <path d="M780,468 Q786,450 792,468" />
      </g>

      {/* ====== EXTRA FOREGROUND FLOWERS ====== */}
      {/* Big daisy left */}
      <g>
        <line x1="45" y1="478" x2="43" y2="494" stroke="#3d8a3d" strokeWidth="2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={`fg-daisy-${angle}`}
            cx={45 + Math.cos((angle * Math.PI) / 180) * 6}
            cy={478 + Math.sin((angle * Math.PI) / 180) * 6}
            rx="3.5"
            ry="1.8"
            fill="white"
            transform={`rotate(${angle}, ${45 + Math.cos((angle * Math.PI) / 180) * 6}, ${478 + Math.sin((angle * Math.PI) / 180) * 6})`}
          />
        ))}
        <circle cx="45" cy="478" r="3.5" fill="#f5c842" />
      </g>

      {/* Big poppy right */}
      <g>
        <line x1="760" y1="475" x2="762" y2="492" stroke="#3d7a3d" strokeWidth="2" />
        <ellipse cx="756" cy="473" rx="6" ry="5" fill="#e63946" />
        <ellipse cx="764" cy="473" rx="6" ry="5" fill="#d62839" />
        <ellipse cx="760" cy="469" rx="5" ry="6" fill="#e63946" />
        <ellipse cx="760" cy="477" rx="4.5" ry="3.5" fill="#d62839" />
        <circle cx="760" cy="474" r="3" fill="#2d2d2d" />
        <circle cx="760" cy="474" r="1.5" fill="#555" />
      </g>
    </svg>
  );
}
