export default function GamesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="gamesSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#gamesSky)" />
        <circle cx="680" cy="80" r="50" fill="#facc15" opacity="0.9">
          <animate attributeName="r" values="50;53;50" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="680" cy="80" r="70" fill="#facc15" opacity="0.15">
          <animate attributeName="r" values="70;80;70" dur="4s" repeatCount="indefinite" />
        </circle>
        <g opacity="0.9">
          <g>
            <ellipse cx="120" cy="100" rx="60" ry="25" fill="white" />
            <ellipse cx="90" cy="90" rx="35" ry="20" fill="white" />
            <ellipse cx="155" cy="92" rx="30" ry="18" fill="white" />
            <animateTransform attributeName="transform" type="translate" values="0,0;100,0;0,0" dur="30s" repeatCount="indefinite" />
          </g>
          <g>
            <ellipse cx="450" cy="60" rx="70" ry="28" fill="white" />
            <ellipse cx="415" cy="50" rx="40" ry="22" fill="white" />
            <ellipse cx="490" cy="52" rx="35" ry="20" fill="white" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-80,0;0,0" dur="35s" repeatCount="indefinite" />
          </g>
          <g>
            <ellipse cx="700" cy="140" rx="50" ry="22" fill="white" opacity="0.7" />
            <ellipse cx="675" cy="132" rx="30" ry="16" fill="white" opacity="0.7" />
            <animateTransform attributeName="transform" type="translate" values="0,0;60,0;0,0" dur="25s" repeatCount="indefinite" />
          </g>
        </g>
        <path d="M0 480 Q150 420 300 460 Q500 410 650 440 Q770 420 800 450 L800 600 L0 600 Z" fill="#86efac" />
        <path d="M0 510 Q200 470 400 500 Q550 460 700 490 Q780 480 800 500 L800 600 L0 600 Z" fill="#4ade80" />
        <path d="M0 540 Q100 520 250 540 Q400 510 600 530 Q750 520 800 540 L800 600 L0 600 Z" fill="#22c55e" />
      </svg>
    </div>
  );
}
