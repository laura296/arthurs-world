export default function Goat({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Body */}
      <ellipse cx="100" cy="118" rx="55" ry="40" fill="#e8dcd0" />
      {/* Belly */}
      <ellipse cx="100" cy="128" rx="35" ry="24" fill="#f0e8e0" />
      {/* Head */}
      <ellipse cx="100" cy="55" rx="26" ry="28" fill="#e8dcd0" />
      {/* Horns */}
      <path d="M82 32 Q72 10 65 20" fill="none" stroke="#c8b898" strokeWidth="5" strokeLinecap="round" />
      <path d="M118 32 Q128 10 135 20" fill="none" stroke="#c8b898" strokeWidth="5" strokeLinecap="round" />
      {/* Ears */}
      <path d="M74 48 Q60 42 62 52 Q64 58 74 55" fill="#e8dcd0" />
      <path d="M126 48 Q140 42 138 52 Q136 58 126 55" fill="#e8dcd0" />
      <path d="M74 50 Q64 46 65 52 Q66 56 74 54" fill="#e8a090" />
      <path d="M126 50 Q136 46 135 52 Q134 56 126 54" fill="#e8a090" />
      {/* Eyes */}
      <circle cx="88" cy="50" r="5" fill="white" />
      <circle cx="112" cy="50" r="5" fill="white" />
      {/* Goat has rectangular pupils! */}
      <rect x="86" y="48" width="6" height="4" rx="1" fill="#2d2d2d" />
      <rect x="110" y="48" width="6" height="4" rx="1" fill="#2d2d2d" />
      {/* Nose */}
      <ellipse cx="100" cy="65" rx="8" ry="5" fill="#d0b8a8" />
      <circle cx="96" cy="64" r="2" fill="#b89880" />
      <circle cx="104" cy="64" r="2" fill="#b89880" />
      {/* Beard */}
      <path d="M95 74 Q92 90 88 98" fill="none" stroke="#c8b898" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 76 Q98 92 96 100" fill="none" stroke="#d0c0a8" strokeWidth="3" strokeLinecap="round" />
      <path d="M105 74 Q104 88 102 96" fill="none" stroke="#c8b898" strokeWidth="3" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M94 70 Q100 74 106 70" fill="none" stroke="#b89880" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <rect x="62" y="150" width="13" height="32" rx="6" fill="#e8dcd0" />
      <rect x="82" y="153" width="13" height="32" rx="6" fill="#e8dcd0" />
      <rect x="106" y="153" width="13" height="32" rx="6" fill="#e8dcd0" />
      <rect x="128" y="150" width="13" height="32" rx="6" fill="#e8dcd0" />
      {/* Hooves */}
      <rect x="60" y="178" width="17" height="8" rx="3" fill="#6a5a48" />
      <rect x="80" y="181" width="17" height="8" rx="3" fill="#6a5a48" />
      <rect x="104" y="181" width="17" height="8" rx="3" fill="#6a5a48" />
      <rect x="126" y="178" width="17" height="8" rx="3" fill="#6a5a48" />
      {/* Tail */}
      <path d="M45 108 Q35 100 38 90" fill="none" stroke="#e8dcd0" strokeWidth="5" strokeLinecap="round" />
      <path d="M38 90 Q36 84 40 82" fill="none" stroke="#d0c0a8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
