/**
 * Underwater scene for BubblePop — deep blue water, seaweed, coral, fish silhouettes.
 */
export default function UnderwaterScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0077be" />
          <stop offset="50%" stopColor="#005a8e" />
          <stop offset="100%" stopColor="#003458" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="url(#water)" />

      {/* Light rays from surface */}
      <g opacity="0.08">
        <polygon points="150,0 200,600 100,600" fill="white" />
        <polygon points="350,0 420,600 300,600" fill="white" />
        <polygon points="550,0 640,600 500,600" fill="white" />
        <polygon points="700,0 780,600 680,600" fill="white" />
      </g>

      {/* Sandy bottom */}
      <path d="M0 520 Q100 510 200 525 Q400 505 600 520 Q700 510 800 530 L800 600 L0 600 Z" fill="#c2a060" />
      <path d="M0 540 Q200 530 400 540 Q600 528 800 545 L800 600 L0 600 Z" fill="#d4b878" />

      {/* Seaweed */}
      <g>
        <path d="M80 600 Q75 540 85 500 Q78 460 88 430" fill="none" stroke="#2d8a4a" strokeWidth="8" strokeLinecap="round">
          <animate attributeName="d" values="M80 600 Q75 540 85 500 Q78 460 88 430;M80 600 Q85 540 75 500 Q82 460 78 430;M80 600 Q75 540 85 500 Q78 460 88 430" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M95 600 Q90 550 98 520 Q92 490 100 460" fill="none" stroke="#3d9a5a" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="d" values="M95 600 Q90 550 98 520 Q92 490 100 460;M95 600 Q100 550 92 520 Q98 490 94 460;M95 600 Q90 550 98 520 Q92 490 100 460" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M650 600 Q645 530 655 490 Q648 450 658 420" fill="none" stroke="#2d8a4a" strokeWidth="7" strokeLinecap="round">
          <animate attributeName="d" values="M650 600 Q645 530 655 490 Q648 450 658 420;M650 600 Q655 530 645 490 Q652 450 648 420;M650 600 Q645 530 655 490 Q648 450 658 420" dur="4.5s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M380 600 Q375 560 385 535 Q378 510 388 485" fill="none" stroke="#3daa6a" strokeWidth="5" strokeLinecap="round">
          <animate attributeName="d" values="M380 600 Q375 560 385 535 Q378 510 388 485;M380 600 Q385 560 375 535 Q382 510 378 485;M380 600 Q375 560 385 535 Q378 510 388 485" dur="3.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Coral */}
      <g transform="translate(200, 510)">
        <ellipse cx="0" cy="0" rx="25" ry="15" fill="#ff6b8a" />
        <ellipse cx="20" cy="-8" rx="18" ry="12" fill="#ff8888" />
        <ellipse cx="-15" cy="-5" rx="15" ry="10" fill="#ff5577" />
        <circle cx="5" cy="-18" r="10" fill="#ff7799" />
      </g>
      <g transform="translate(550, 520)">
        <ellipse cx="0" cy="0" rx="20" ry="12" fill="#ffaa44" />
        <ellipse cx="15" cy="-6" rx="15" ry="10" fill="#ffbb55" />
        <ellipse cx="-10" cy="-4" rx="12" ry="8" fill="#ff9933" />
      </g>

      {/* Small fish silhouettes in background */}
      <g opacity="0.15" fill="white">
        <path d="M500 200 Q510 190 520 200 Q510 210 500 200 L490 200" />
        <path d="M300 300 Q310 290 320 300 Q310 310 300 300 L290 300" />
        <path d="M600 350 Q610 340 620 350 Q610 360 600 350 L590 350" />
        <path d="M150 250 Q160 240 170 250 Q160 260 150 250 L140 250" />
      </g>

      {/* Floating particles */}
      {[
        [100, 200, 2], [250, 300, 1.5], [400, 150, 2], [550, 280, 1.5],
        [680, 180, 2], [180, 400, 1.5], [450, 380, 1.5], [720, 350, 2],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity="0.15">
          <animate attributeName="cy" values={`${y};${y - 40};${y}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
