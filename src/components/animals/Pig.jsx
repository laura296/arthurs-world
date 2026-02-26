export default function Pig({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      {/* Body */}
      <ellipse cx="100" cy="120" rx="60" ry="48" fill="#ffb6c1" />
      {/* Belly */}
      <ellipse cx="100" cy="132" rx="40" ry="28" fill="#ffc8d4" />
      {/* Head */}
      <circle cx="100" cy="62" r="35" fill="#ffb6c1" />
      {/* Ears */}
      <path d="M70 38 Q60 15 50 30 Q55 42 70 42" fill="#ff9fb0" />
      <path d="M130 38 Q140 15 150 30 Q145 42 130 42" fill="#ff9fb0" />
      {/* Eyes */}
      <circle cx="85" cy="55" r="7" fill="white" />
      <circle cx="115" cy="55" r="7" fill="white" />
      <circle cx="87" cy="56" r="4" fill="#2d2d2d" />
      <circle cx="117" cy="56" r="4" fill="#2d2d2d" />
      <circle cx="88" cy="54" r="1.5" fill="white" />
      <circle cx="118" cy="54" r="1.5" fill="white" />
      {/* Snout */}
      <ellipse cx="100" cy="75" rx="20" ry="14" fill="#ff9fb0" />
      <ellipse cx="93" cy="75" rx="4" ry="5" fill="#e87090" />
      <ellipse cx="107" cy="75" rx="4" ry="5" fill="#e87090" />
      {/* Cheeks */}
      <circle cx="72" cy="68" r="8" fill="#ff8ea0" opacity="0.5" />
      <circle cx="128" cy="68" r="8" fill="#ff8ea0" opacity="0.5" />
      {/* Mouth */}
      <path d="M92 82 Q100 88 108 82" fill="none" stroke="#d06080" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <rect x="60" y="155" width="16" height="28" rx="8" fill="#ffb6c1" />
      <rect x="82" y="158" width="16" height="28" rx="8" fill="#ffb6c1" />
      <rect x="102" y="158" width="16" height="28" rx="8" fill="#ffb6c1" />
      <rect x="124" y="155" width="16" height="28" rx="8" fill="#ffb6c1" />
      {/* Hooves */}
      <ellipse cx="68" cy="183" rx="9" ry="5" fill="#e8909a" />
      <ellipse cx="90" cy="186" rx="9" ry="5" fill="#e8909a" />
      <ellipse cx="110" cy="186" rx="9" ry="5" fill="#e8909a" />
      <ellipse cx="132" cy="183" rx="9" ry="5" fill="#e8909a" />
      {/* Tail (curly) */}
      <path d="M38 110 Q28 100 32 90 Q38 82 34 72" fill="none" stroke="#ffb6c1" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
