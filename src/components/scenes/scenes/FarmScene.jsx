/**
 * Farm scene background — sky, clouds, rolling hills, fence, barn, sun.
 * Used behind FeedAnimals and other farm-themed games.
 */
export default function FarmScene({ variant = 'day', className = '' }) {
  const isDusk = variant === 'dusk';
  const isNight = variant === 'night';

  const skyFrom = isNight ? '#1a1a3e' : isDusk ? '#ff8855' : '#87ceeb';
  const skyTo = isNight ? '#0f172a' : isDusk ? '#ff6b88' : '#e0f0ff';
  const sunColor = isNight ? '#f0e68c' : isDusk ? '#ff6b35' : '#ffe066';
  const hillFar = isNight ? '#1a3d1a' : isDusk ? '#3d6b3d' : '#6eba6e';
  const hillNear = isNight ? '#0d2e0d' : isDusk ? '#2d5a2d' : '#4da64d';
  const grass = isNight ? '#0a2a0a' : isDusk ? '#2a5a2a' : '#3d9b3d';

  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyFrom} />
          <stop offset="100%" stopColor={skyTo} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)" />

      {/* Sun/Moon */}
      <circle cx="650" cy="100" r={isNight ? 35 : 50} fill={sunColor} opacity="0.9" />
      {isNight && <circle cx="640" cy="92" r="30" fill="#1a1a3e" />}
      {!isNight && (
        <>
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
              key={angle}
              x1={650 + Math.cos(angle * Math.PI / 180) * 58}
              y1={100 + Math.sin(angle * Math.PI / 180) * 58}
              x2={650 + Math.cos(angle * Math.PI / 180) * 72}
              y2={100 + Math.sin(angle * Math.PI / 180) * 72}
              stroke={sunColor}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
        </>
      )}

      {/* Clouds */}
      <g opacity="0.8">
        <ellipse cx="150" cy="80" rx="60" ry="22" fill="white" />
        <ellipse cx="190" cy="75" rx="45" ry="20" fill="white" />
        <ellipse cx="120" cy="78" rx="40" ry="18" fill="white" />
      </g>
      <g opacity="0.6">
        <ellipse cx="450" cy="120" rx="55" ry="18" fill="white" />
        <ellipse cx="490" cy="116" rx="40" ry="16" fill="white" />
        <ellipse cx="420" cy="118" rx="35" ry="15" fill="white" />
      </g>
      <g opacity="0.5">
        <ellipse cx="300" cy="60" rx="40" ry="14" fill="white" />
        <ellipse cx="330" cy="57" rx="30" ry="12" fill="white" />
      </g>

      {/* Far hills */}
      <path d={`M0 350 Q100 280 200 340 Q350 260 500 330 Q650 270 800 350 L800 600 L0 600 Z`} fill={hillFar} />

      {/* Barn */}
      <g transform="translate(580, 260)">
        {/* Barn body */}
        <rect x="0" y="30" width="90" height="65" rx="3" fill="#c0392b" />
        {/* Barn roof */}
        <path d="M-8 30 L45 -10 L98 30 Z" fill="#8b2020" />
        {/* Barn door */}
        <rect x="30" y="55" width="30" height="40" rx="15" fill="#8b2020" />
        {/* Barn cross */}
        <line x1="20" y1="45" x2="70" y2="80" stroke="#a03030" strokeWidth="3" />
        <line x1="70" y1="45" x2="20" y2="80" stroke="#a03030" strokeWidth="3" />
        {/* Hay loft */}
        <rect x="33" y="12" width="24" height="16" rx="3" fill="#4a2a10" />
      </g>

      {/* Near hills */}
      <path d={`M0 400 Q150 350 300 390 Q500 340 650 380 Q750 360 800 400 L800 600 L0 600 Z`} fill={hillNear} />

      {/* Fence */}
      <g>
        {[80, 150, 220, 290, 360, 430].map(x => (
          <rect key={x} x={x} y="410" width="6" height="50" rx="2" fill="#c8a870" />
        ))}
        <rect x="75" y="420" width="370" height="5" rx="2" fill="#c8a870" />
        <rect x="75" y="438" width="370" height="5" rx="2" fill="#c8a870" />
      </g>

      {/* Grass foreground */}
      <path d={`M0 460 Q100 440 200 455 Q400 430 600 450 Q700 440 800 460 L800 600 L0 600 Z`} fill={grass} />

      {/* Grass tufts */}
      <g fill="#2d8a2d" opacity="0.6">
        <path d="M50 480 Q55 465 60 480" />
        <path d="M55 480 Q60 460 65 480" />
        <path d="M200 470 Q205 455 210 470" />
        <path d="M350 475 Q355 458 360 475" />
        <path d="M355 475 Q360 455 365 475" />
        <path d="M500 472 Q505 456 510 472" />
        <path d="M650 478 Q655 462 660 478" />
        <path d="M700 476 Q705 460 710 476" />
      </g>

      {/* Flowers */}
      <g>
        <circle cx="120" cy="490" r="4" fill="#ff6b8a" />
        <circle cx="280" cy="485" r="3.5" fill="#ffdd44" />
        <circle cx="420" cy="492" r="4" fill="#ff88aa" />
        <circle cx="580" cy="488" r="3" fill="#aa88ff" />
        <circle cx="720" cy="490" r="4" fill="#ffdd44" />
      </g>
    </svg>
  );
}
