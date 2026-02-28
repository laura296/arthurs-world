/**
 * Hand-illustrated Rabbit SVG — tall ears with pink inner gradient,
 * soft grey-brown fur, big alert eyes, twitchy nose, buck teeth,
 * whiskers, rosy cheeks. Ear wiggle + nose twitch animations.
 * Storybook illustration style.
 */
export default function Rabbit({ className = '' }) {
  return (
    <svg viewBox="0 0 80 90" className={className}>
      <defs>
        <radialGradient id="rabbit-fur" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#B8A898" />
          <stop offset="100%" stopColor="#9A8878" />
        </radialGradient>
        <linearGradient id="rabbit-ear-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0C0CC" />
          <stop offset="100%" stopColor="#E8A0B0" />
        </linearGradient>
        <radialGradient id="rabbit-nose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D4788E" />
        </radialGradient>
      </defs>

      {/* Left ear — with wiggle */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3,30,30;3,30,30;-3,30,30"
          dur="3s"
          repeatCount="indefinite"
        />
        <ellipse cx="30" cy="16" rx="8" ry="20" fill="url(#rabbit-fur)" stroke="#7A6858" strokeWidth="1.5" />
        <ellipse cx="30" cy="16" rx="5" ry="15" fill="url(#rabbit-ear-inner)" />
      </g>

      {/* Right ear — opposite wiggle timing */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="3,50,30;-3,50,30;3,50,30"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <ellipse cx="50" cy="16" rx="8" ry="20" fill="url(#rabbit-fur)" stroke="#7A6858" strokeWidth="1.5" />
        <ellipse cx="50" cy="16" rx="5" ry="15" fill="url(#rabbit-ear-inner)" />
      </g>

      {/* Body */}
      <ellipse cx="40" cy="72" rx="22" ry="18" fill="url(#rabbit-fur)" stroke="#7A6858" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="40" cy="50" rx="24" ry="20" fill="url(#rabbit-fur)" stroke="#7A6858" strokeWidth="2" />

      {/* White muzzle area */}
      <ellipse cx="40" cy="56" rx="14" ry="10" fill="#F0E8E0" />

      {/* Eyes — big and alert */}
      <ellipse cx="31" cy="47" rx="5" ry="6" fill="#2D1B0E">
        <animate attributeName="ry" values="6;0.5;6" dur="5s" repeatCount="indefinite" keyTimes="0;0.03;0.06" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="3s" />
      </ellipse>
      <circle cx="33" cy="45" r="2" fill="white" />
      <circle cx="30" cy="48" r="0.8" fill="white" opacity="0.5" />

      <ellipse cx="49" cy="47" rx="5" ry="6" fill="#2D1B0E">
        <animate attributeName="ry" values="6;0.5;6" dur="5s" repeatCount="indefinite" keyTimes="0;0.03;0.06" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="3s" />
      </ellipse>
      <circle cx="51" cy="45" r="2" fill="white" />
      <circle cx="48" cy="48" r="0.8" fill="white" opacity="0.5" />

      {/* Nose — with twitch animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-1;0,0;0,1;0,0"
          dur="0.8s"
          repeatCount="indefinite"
        />
        <ellipse cx="40" cy="55" rx="3.5" ry="2.5" fill="url(#rabbit-nose)" />
      </g>

      {/* Buck teeth */}
      <rect x="37" y="57" width="3" height="4" rx="1" fill="white" stroke="#CCBBAA" strokeWidth="0.5" />
      <rect x="40.5" y="57" width="3" height="4" rx="1" fill="white" stroke="#CCBBAA" strokeWidth="0.5" />

      {/* Whiskers */}
      <g stroke="#9A8878" strokeWidth="0.8" strokeLinecap="round">
        {/* Left whiskers */}
        <line x1="28" y1="53" x2="12" y2="50" />
        <line x1="28" y1="55" x2="10" y2="55" />
        <line x1="28" y1="57" x2="12" y2="60" />
        {/* Right whiskers */}
        <line x1="52" y1="53" x2="68" y2="50" />
        <line x1="52" y1="55" x2="70" y2="55" />
        <line x1="52" y1="57" x2="68" y2="60" />
      </g>

      {/* Rosy cheeks */}
      <circle cx="23" cy="54" r="4" fill="#E8A0B0" opacity="0.25" />
      <circle cx="57" cy="54" r="4" fill="#E8A0B0" opacity="0.25" />

      {/* Front paws */}
      <ellipse cx="28" cy="82" rx="7" ry="4" fill="#B8A898" stroke="#7A6858" strokeWidth="1.5" />
      <ellipse cx="52" cy="82" rx="7" ry="4" fill="#B8A898" stroke="#7A6858" strokeWidth="1.5" />
    </svg>
  );
}
