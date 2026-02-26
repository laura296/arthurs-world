/**
 * Rich night sky with moon, stars, shooting stars, and gentle hills.
 * Used for ModePicker and quiet-themed screens.
 */
export default function NightSkyScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a2e" />
          <stop offset="50%" stopColor="#1a1a4e" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fffde8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#nightSky)" />

      {/* Moon glow */}
      <circle cx="620" cy="100" r="120" fill="url(#moonGlow)" />
      {/* Moon */}
      <circle cx="620" cy="100" r="40" fill="#fffde8" />
      <circle cx="610" cy="90" r="8" fill="#f0e8c0" opacity="0.3" />
      <circle cx="630" cy="105" r="5" fill="#f0e8c0" opacity="0.3" />
      <circle cx="615" cy="112" r="4" fill="#f0e8c0" opacity="0.2" />

      {/* Stars — different sizes */}
      {[
        [80, 50, 2.5], [160, 120, 1.5], [240, 40, 2], [320, 90, 1.5], [400, 30, 3],
        [480, 70, 1.5], [560, 140, 2], [700, 50, 2.5], [750, 130, 1.5],
        [100, 160, 1.5], [200, 180, 2], [350, 150, 1.5], [500, 160, 2],
        [50, 100, 1], [140, 200, 1], [280, 130, 1.5], [440, 110, 1],
        [530, 50, 1.5], [680, 170, 1.5], [760, 80, 1],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.5 + Math.random() * 0.5}>
          <animate attributeName="opacity" values={`${0.4 + (i % 3) * 0.2};1;${0.4 + (i % 3) * 0.2}`} dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Twinkling bright stars (4-point) */}
      {[[150, 60], [380, 45], [550, 100], [700, 160]].map(([x, y], i) => (
        <g key={`tw-${i}`} opacity="0.8">
          <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="white" strokeWidth="1.5" />
          <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="white" strokeWidth="1.5" />
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + i * 0.7}s`} repeatCount="indefinite" />
        </g>
      ))}

      {/* Shooting star */}
      <line x1="250" y1="80" x2="200" y2="110" stroke="white" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="x1" values="250;350" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y1" values="80;50" dur="4s" repeatCount="indefinite" />
        <animate attributeName="x2" values="200;300" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="110;80" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
      </line>

      {/* Distant hills */}
      <path d="M0 450 Q100 400 250 430 Q400 390 550 420 Q700 400 800 440 L800 600 L0 600 Z" fill="#0d1a0d" opacity="0.6" />
      <path d="M0 480 Q150 440 300 470 Q500 430 700 460 Q770 450 800 470 L800 600 L0 600 Z" fill="#0a150a" opacity="0.7" />

      {/* Silhouette trees */}
      <g fill="#0a120a" opacity="0.8">
        <path d="M60 450 L75 380 L90 450 Z" />
        <path d="M68 420 L75 360 L82 420 Z" />
        <rect x="72" y="450" width="6" height="20" fill="#0a120a" />

        <path d="M250 440 L270 370 L290 440 Z" />
        <path d="M258 400 L270 340 L282 400 Z" />
        <rect x="267" y="440" width="6" height="20" fill="#0a120a" />

        <path d="M550 445 L565 380 L580 445 Z" />
        <path d="M555 410 L565 355 L575 410 Z" />
        <rect x="562" y="445" width="6" height="20" fill="#0a120a" />

        <path d="M720 455 L735 395 L750 455 Z" />
        <rect x="732" y="455" width="6" height="15" fill="#0a120a" />
      </g>
    </svg>
  );
}
