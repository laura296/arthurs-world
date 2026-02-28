/**
 * Hand-illustrated Mole SVG — soft brown fur, big round eyes with highlights,
 * pink nose, rosy cheeks, tiny clawed paws. Blink animation on eyes.
 * Storybook illustration style matching MeadowScene bees/butterfly.
 */
export default function Mole({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="mole-fur" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#8B6F47" />
          <stop offset="100%" stopColor="#6B4F2F" />
        </radialGradient>
        <radialGradient id="mole-nose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D4788E" />
        </radialGradient>
        <radialGradient id="mole-ear-inner" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#D4A876" />
          <stop offset="100%" stopColor="#C49466" />
        </radialGradient>
      </defs>

      {/* Body (bottom half, hidden by hole rim) */}
      <ellipse cx="40" cy="65" rx="22" ry="18" fill="url(#mole-fur)" stroke="#4a3728" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="40" cy="38" rx="26" ry="24" fill="url(#mole-fur)" stroke="#4a3728" strokeWidth="2" />

      {/* Ears */}
      <ellipse cx="20" cy="20" rx="8" ry="7" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="5" ry="4.5" fill="url(#mole-ear-inner)" />
      <ellipse cx="60" cy="20" rx="8" ry="7" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="60" cy="20" rx="5" ry="4.5" fill="url(#mole-ear-inner)" />

      {/* Eyes — with blink animation */}
      <ellipse cx="30" cy="36" rx="5" ry="5.5" fill="#2D1B0E">
        <animate attributeName="ry" values="5.5;0.5;5.5" dur="4s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2s" />
      </ellipse>
      <circle cx="32" cy="34" r="1.5" fill="white" /> {/* highlight */}

      <ellipse cx="50" cy="36" rx="5" ry="5.5" fill="#2D1B0E">
        <animate attributeName="ry" values="5.5;0.5;5.5" dur="4s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2s" />
      </ellipse>
      <circle cx="52" cy="34" r="1.5" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="45" rx="5" ry="3.5" fill="url(#mole-nose)" />

      {/* Rosy cheeks */}
      <circle cx="24" cy="42" r="4" fill="#E8A0B0" opacity="0.3" />
      <circle cx="56" cy="42" r="4" fill="#E8A0B0" opacity="0.3" />

      {/* Mouth — small friendly smile */}
      <path d="M36,49 Q40,52 44,49" fill="none" stroke="#4a3728" strokeWidth="1" strokeLinecap="round" />

      {/* Front paws */}
      <ellipse cx="28" cy="60" rx="7" ry="4" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="52" cy="60" rx="7" ry="4" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      {/* Tiny claws */}
      <g stroke="#4a3728" strokeWidth="1" strokeLinecap="round">
        <line x1="23" y1="59" x2="21" y2="62" />
        <line x1="26" y1="60" x2="24" y2="63" />
        <line x1="29" y1="60" x2="28" y2="63" />
        <line x1="49" y1="60" x2="48" y2="63" />
        <line x1="52" y1="60" x2="53" y2="63" />
        <line x1="55" y1="59" x2="57" y2="62" />
      </g>
    </svg>
  );
}
