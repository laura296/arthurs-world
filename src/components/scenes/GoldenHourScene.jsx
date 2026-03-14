/**
 * Warm golden-hour background scene.
 * Soft amber sky, rolling hills, gentle sun glow, floating fireflies.
 * Used for the main entry screen and warm-themed pages.
 */
export default function GoldenHourScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="goldenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="40%" stopColor="#F5D6A8" />
          <stop offset="70%" stopColor="#F5B041" />
          <stop offset="100%" stopColor="#E67E22" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#F5B041" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE8" />
          <stop offset="60%" stopColor="#F5D6A8" />
          <stop offset="100%" stopColor="#F5B041" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B8E5A" />
          <stop offset="100%" stopColor="#4A6B3A" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DA368" />
          <stop offset="100%" stopColor="#5A7D48" />
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8BB876" />
          <stop offset="100%" stopColor="#6B9E5A" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#goldenSky)" />

      {/* Sun glow */}
      <circle cx="400" cy="360" r="250" fill="url(#sunGlow)" />

      {/* Sun */}
      <circle cx="400" cy="380" r="50" fill="url(#sunCore)" />

      {/* Soft clouds */}
      {[
        { x: 120, y: 80, s: 1 },
        { x: 350, y: 50, s: 1.3 },
        { x: 600, y: 90, s: 0.9 },
        { x: 700, y: 140, s: 0.7 },
      ].map((c, i) => (
        <g key={i} opacity="0.5" transform={`translate(${c.x}, ${c.y}) scale(${c.s})`}>
          <ellipse cx="0" cy="0" rx="50" ry="18" fill="white" />
          <ellipse cx="25" cy="-8" rx="35" ry="14" fill="white" />
          <ellipse cx="-20" cy="-5" rx="30" ry="12" fill="white" />
          <animate attributeName="opacity" values="0.35;0.55;0.35" dur={`${6 + i * 2}s`} repeatCount="indefinite" />
        </g>
      ))}

      {/* Far hills */}
      <path d="M0 420 Q100 380 200 400 Q350 360 500 390 Q650 370 800 410 L800 600 L0 600 Z" fill="url(#hillFar)" opacity="0.7" />

      {/* Middle hills */}
      <path d="M0 460 Q150 420 300 450 Q450 410 600 440 Q720 430 800 460 L800 600 L0 600 Z" fill="url(#hillNear)" opacity="0.8" />

      {/* Front hill */}
      <path d="M0 500 Q200 470 400 490 Q600 475 800 510 L800 600 L0 600 Z" fill="url(#hillFront)" />

      {/* Small trees on middle hill */}
      {[
        [100, 455], [180, 445], [350, 435], [520, 442], [650, 438], [740, 450],
      ].map(([x, y], i) => (
        <g key={`tree-${i}`} opacity={0.6 + (i % 3) * 0.1}>
          <ellipse cx={x} cy={y - 18} rx={8 + (i % 3) * 2} ry={14 + (i % 3) * 3} fill="#4A6B3A" />
          <rect x={x - 2} y={y - 6} width="4" height="10" fill="#8B6914" />
        </g>
      ))}

      {/* Fireflies */}
      {[
        [150, 430, 0], [300, 410, 0.5], [450, 420, 1], [580, 415, 1.5],
        [200, 470, 2], [400, 460, 2.5], [650, 445, 0.8], [100, 490, 1.8],
      ].map(([x, y, delay], i) => (
        <circle key={`ff-${i}`} cx={x} cy={y} r="2" fill="#F5D6A8">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;2.5;1.5" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Warm light haze near ground */}
      <rect x="0" y="480" width="800" height="120" fill="#F5B041" opacity="0.08" />
    </svg>
  );
}
