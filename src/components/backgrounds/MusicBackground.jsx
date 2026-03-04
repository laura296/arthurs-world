export default function MusicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="musicBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <radialGradient id="spot1" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="spot2" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#musicBg)" />
        <rect x="0" y="480" width="800" height="120" fill="#1e1b4b" />
        <path d="M0 480 L50 470 L750 470 L800 480 Z" fill="#312e81" />
        <path d="M0 0 Q30 100 15 200 Q35 300 20 400 Q30 500 0 600 L0 0" fill="#7f1d1d" opacity="0.5" />
        <path d="M800 0 Q770 100 785 200 Q765 300 780 400 Q770 500 800 600 L800 0" fill="#7f1d1d" opacity="0.5" />
        <ellipse cx="250" cy="300" rx="200" ry="300" fill="url(#spot1)">
          <animateTransform attributeName="transform" type="translate" values="0,0;30,0;-20,0;0,0" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="550" cy="300" rx="200" ry="300" fill="url(#spot2)">
          <animateTransform attributeName="transform" type="translate" values="0,0;-25,0;15,0;0,0" dur="10s" repeatCount="indefinite" />
        </ellipse>
        {[100, 250, 400, 550, 700].map((x, i) => (
          <g key={i}>
            <rect x={x - 8} y="0" width="16" height="20" fill="#1e1b4b" />
            <circle cx={x} cy="22" r="6" fill={i % 2 === 0 ? '#facc15' : '#8b5cf6'} opacity="0.8">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
