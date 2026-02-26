export default function Chicken({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Body */}
      <ellipse cx="100" cy="120" rx="50" ry="42" fill="#fff5e0" />
      {/* Wing */}
      <ellipse cx="65" cy="118" rx="22" ry="28" fill="#ffe4b0" transform="rotate(-10 65 118)" />
      <ellipse cx="135" cy="118" rx="22" ry="28" fill="#ffe4b0" transform="rotate(10 135 118)" />
      {/* Tail feathers */}
      <path d="M45 100 Q30 75 40 60" fill="none" stroke="#ff8c42" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 105 Q32 82 38 65" fill="none" stroke="#e87040" strokeWidth="5" strokeLinecap="round" />
      <path d="M55 108 Q38 88 45 72" fill="none" stroke="#ff9e5c" strokeWidth="5" strokeLinecap="round" />
      {/* Head */}
      <circle cx="100" cy="60" r="28" fill="#fff5e0" />
      {/* Comb */}
      <path d="M88 35 Q92 20 98 35 Q102 22 108 35 Q112 24 116 38" fill="#e83030" />
      {/* Eyes */}
      <circle cx="88" cy="55" r="5" fill="#2d2d2d" />
      <circle cx="112" cy="55" r="5" fill="#2d2d2d" />
      <circle cx="89" cy="53" r="1.8" fill="white" />
      <circle cx="113" cy="53" r="1.8" fill="white" />
      {/* Beak */}
      <path d="M95 65 L100 75 L105 65 Z" fill="#ff9030" />
      <line x1="95" y1="65" x2="105" y2="65" stroke="#e07828" strokeWidth="1.5" />
      {/* Wattle */}
      <ellipse cx="100" cy="78" rx="5" ry="7" fill="#e83030" />
      {/* Cheeks */}
      <circle cx="78" cy="62" r="6" fill="#ffccaa" opacity="0.5" />
      <circle cx="122" cy="62" r="6" fill="#ffccaa" opacity="0.5" />
      {/* Legs */}
      <line x1="85" y1="160" x2="85" y2="180" stroke="#ff9030" strokeWidth="5" strokeLinecap="round" />
      <line x1="115" y1="160" x2="115" y2="180" stroke="#ff9030" strokeWidth="5" strokeLinecap="round" />
      {/* Feet */}
      <path d="M75 180 L85 175 L95 180" fill="none" stroke="#ff9030" strokeWidth="4" strokeLinecap="round" />
      <path d="M85 180 L85 185" stroke="#ff9030" strokeWidth="3" strokeLinecap="round" />
      <path d="M105 180 L115 175 L125 180" fill="none" stroke="#ff9030" strokeWidth="4" strokeLinecap="round" />
      <path d="M115 180 L115 185" stroke="#ff9030" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
