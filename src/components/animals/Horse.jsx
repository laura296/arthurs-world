export default function Horse({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Body */}
      <ellipse cx="105" cy="115" rx="55" ry="38" fill="#c8874a" />
      {/* Belly highlight */}
      <ellipse cx="105" cy="125" rx="35" ry="22" fill="#d8a060" />
      {/* Neck */}
      <path d="M130 95 Q140 60 130 40" fill="#c8874a" stroke="#c8874a" strokeWidth="30" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="140" cy="42" rx="30" ry="22" fill="#c8874a" transform="rotate(10 140 42)" />
      {/* Muzzle */}
      <ellipse cx="158" cy="50" rx="14" ry="10" fill="#d8a060" />
      {/* Nostril */}
      <circle cx="164" cy="48" r="2.5" fill="#a06838" />
      {/* Eye */}
      <circle cx="142" cy="36" r="5" fill="#2d2d2d" />
      <circle cx="143" cy="35" r="1.8" fill="white" />
      {/* Ears */}
      <path d="M128 22 Q125 8 120 18" fill="#c8874a" stroke="#c8874a" strokeWidth="3" />
      <path d="M138 20 Q140 6 145 16" fill="#c8874a" stroke="#c8874a" strokeWidth="3" />
      {/* Inner ear */}
      <path d="M128 22 Q126 12 123 18" fill="#e8a070" />
      <path d="M138 20 Q139 10 142 17" fill="#e8a070" />
      {/* Mane */}
      <path d="M125 25 Q115 30 120 42 Q112 48 118 58 Q110 62 116 72 Q108 76 115 85" fill="none" stroke="#8b5e3c" strokeWidth="8" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M155 55 Q162 58 168 55" fill="none" stroke="#a06838" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <rect x="62" y="145" width="14" height="36" rx="6" fill="#c8874a" />
      <rect x="82" y="148" width="14" height="36" rx="6" fill="#c8874a" />
      <rect x="110" y="148" width="14" height="36" rx="6" fill="#c8874a" />
      <rect x="132" y="145" width="14" height="36" rx="6" fill="#c8874a" />
      {/* Hooves */}
      <rect x="60" y="178" width="18" height="10" rx="4" fill="#4a3520" />
      <rect x="80" y="181" width="18" height="10" rx="4" fill="#4a3520" />
      <rect x="108" y="181" width="18" height="10" rx="4" fill="#4a3520" />
      <rect x="130" y="178" width="18" height="10" rx="4" fill="#4a3520" />
      {/* Tail */}
      <path d="M50 105 Q30 95 25 108 Q20 120 30 125" fill="none" stroke="#8b5e3c" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
