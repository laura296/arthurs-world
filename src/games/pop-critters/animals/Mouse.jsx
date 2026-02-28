/**
 * Hand-illustrated Mouse SVG — small round body, light grey fur,
 * very large round ears (proportionally biggest), small dark eyes
 * with big highlights, tiny pink nose, long twitchy whiskers,
 * thin curling tail, rosy cheeks, tiny pink paws.
 * Storybook illustration style.
 */
export default function Mouse({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="mouse-fur" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#C0B8B0" />
          <stop offset="100%" stopColor="#A09890" />
        </radialGradient>
        <radialGradient id="mouse-ear" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F0C0CC" />
          <stop offset="60%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D08898" />
        </radialGradient>
        <radialGradient id="mouse-nose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D4788E" />
        </radialGradient>
      </defs>

      {/* Tail — thin curling line visible behind body */}
      <path d="M58,55 Q68,48 72,38 Q76,28 70,22 Q66,18 62,22"
            fill="none" stroke="#D0A8A0" strokeWidth="2" strokeLinecap="round" />

      {/* Big round ears — proportionally largest of all animals */}
      {/* Left ear */}
      <ellipse cx="18" cy="22" rx="14" ry="13" fill="#C0B8B0" stroke="#8A8280" strokeWidth="1.5" />
      <ellipse cx="18" cy="22" rx="10" ry="9" fill="url(#mouse-ear)" />

      {/* Right ear */}
      <ellipse cx="58" cy="22" rx="14" ry="13" fill="#C0B8B0" stroke="#8A8280" strokeWidth="1.5" />
      <ellipse cx="58" cy="22" rx="10" ry="9" fill="url(#mouse-ear)" />

      {/* Body */}
      <ellipse cx="38" cy="58" rx="20" ry="16" fill="url(#mouse-fur)" stroke="#8A8280" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="38" cy="40" rx="22" ry="20" fill="url(#mouse-fur)" stroke="#8A8280" strokeWidth="2" />

      {/* White belly/chin area */}
      <ellipse cx="38" cy="46" rx="12" ry="8" fill="#E8E0D8" />

      {/* Eyes — small dark with big highlights (cute, wide-eyed) */}
      <ellipse cx="30" cy="38" rx="4" ry="4.5" fill="#1A1010">
        <animate attributeName="ry" values="4.5;0.4;4.5" dur="3.5s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="1s" />
      </ellipse>
      <circle cx="32" cy="36" r="1.8" fill="white" />
      <circle cx="29" cy="39" r="0.8" fill="white" opacity="0.5" />

      <ellipse cx="46" cy="38" rx="4" ry="4.5" fill="#1A1010">
        <animate attributeName="ry" values="4.5;0.4;4.5" dur="3.5s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="1s" />
      </ellipse>
      <circle cx="48" cy="36" r="1.8" fill="white" />
      <circle cx="45" cy="39" r="0.8" fill="white" opacity="0.5" />

      {/* Nose — tiny pink */}
      <ellipse cx="38" cy="46" rx="3" ry="2" fill="url(#mouse-nose)" />

      {/* Whiskers — long, with twitch animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3,38,46;3,38,46;-3,38,46"
          dur="0.8s"
          repeatCount="indefinite"
        />
        <g stroke="#A09890" strokeWidth="0.7" strokeLinecap="round">
          {/* Left whiskers */}
          <line x1="28" y1="44" x2="6" y2="40" />
          <line x1="28" y1="46" x2="4" y2="46" />
          <line x1="28" y1="48" x2="6" y2="52" />
          {/* Right whiskers */}
          <line x1="48" y1="44" x2="70" y2="40" />
          <line x1="48" y1="46" x2="72" y2="46" />
          <line x1="48" y1="48" x2="70" y2="52" />
        </g>
      </g>

      {/* Rosy cheeks */}
      <circle cx="22" cy="44" r="3.5" fill="#E8A0B0" opacity="0.25" />
      <circle cx="54" cy="44" r="3.5" fill="#E8A0B0" opacity="0.25" />

      {/* Mouth */}
      <path d="M35,48 Q38,51 41,48" fill="none" stroke="#8A8280" strokeWidth="0.8" strokeLinecap="round" />

      {/* Tiny pink paws */}
      <ellipse cx="26" cy="68" rx="5" ry="3" fill="#E8C8C0" stroke="#C0A8A0" strokeWidth="1" />
      <ellipse cx="50" cy="68" rx="5" ry="3" fill="#E8C8C0" stroke="#C0A8A0" strokeWidth="1" />
    </svg>
  );
}
