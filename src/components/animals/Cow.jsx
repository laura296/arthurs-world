export default function Cow({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Body */}
      <ellipse cx="100" cy="125" rx="65" ry="45" fill="#f5f5f5" />
      {/* Spots */}
      <ellipse cx="75" cy="115" rx="18" ry="14" fill="#4a4a4a" />
      <ellipse cx="120" cy="130" rx="15" ry="12" fill="#4a4a4a" />
      <ellipse cx="105" cy="108" rx="10" ry="8" fill="#4a4a4a" />
      {/* Head */}
      <ellipse cx="100" cy="65" rx="35" ry="30" fill="#f5f5f5" />
      {/* Inner ears */}
      <ellipse cx="68" cy="42" rx="12" ry="8" fill="#f5f5f5" transform="rotate(-20 68 42)" />
      <ellipse cx="132" cy="42" rx="12" ry="8" fill="#f5f5f5" transform="rotate(20 132 42)" />
      <ellipse cx="68" cy="42" rx="8" ry="5" fill="#ffb6c1" transform="rotate(-20 68 42)" />
      <ellipse cx="132" cy="42" rx="8" ry="5" fill="#ffb6c1" transform="rotate(20 132 42)" />
      {/* Horns */}
      <path d="M72 38 Q65 22 58 28" fill="none" stroke="#f0d060" strokeWidth="4" strokeLinecap="round" />
      <path d="M128 38 Q135 22 142 28" fill="none" stroke="#f0d060" strokeWidth="4" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="85" cy="58" r="6" fill="#2d2d2d" />
      <circle cx="115" cy="58" r="6" fill="#2d2d2d" />
      <circle cx="87" cy="56" r="2" fill="white" />
      <circle cx="117" cy="56" r="2" fill="white" />
      {/* Snout */}
      <ellipse cx="100" cy="78" rx="18" ry="12" fill="#ffb6c1" />
      <circle cx="94" cy="78" r="3" fill="#e88" />
      <circle cx="106" cy="78" r="3" fill="#e88" />
      {/* Mouth */}
      <path d="M92 84 Q100 90 108 84" fill="none" stroke="#c66" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <rect x="60" y="155" width="14" height="30" rx="6" fill="#f5f5f5" />
      <rect x="82" y="158" width="14" height="30" rx="6" fill="#f5f5f5" />
      <rect x="105" y="158" width="14" height="30" rx="6" fill="#f5f5f5" />
      <rect x="127" y="155" width="14" height="30" rx="6" fill="#f5f5f5" />
      {/* Hooves */}
      <rect x="58" y="180" width="18" height="8" rx="4" fill="#4a4a4a" />
      <rect x="80" y="183" width="18" height="8" rx="4" fill="#4a4a4a" />
      <rect x="103" y="183" width="18" height="8" rx="4" fill="#4a4a4a" />
      <rect x="125" y="180" width="18" height="8" rx="4" fill="#4a4a4a" />
      {/* Tail */}
      <path d="M35 120 Q25 100 30 85" fill="none" stroke="#f5f5f5" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="30" cy="83" rx="5" ry="6" fill="#4a4a4a" />
      {/* Bell */}
      <circle cx="100" cy="98" r="6" fill="#f0d060" />
      <circle cx="100" cy="101" r="2" fill="#c8a030" />
    </svg>
  );
}
