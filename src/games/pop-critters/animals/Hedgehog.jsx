/**
 * Hand-illustrated Hedgehog SVG — rounded body with quill spikes,
 * lighter belly, big kind eyes, pink nose, rosy cheeks, tiny feet.
 * Quill ruffle animation. Storybook illustration style.
 */
export default function Hedgehog({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="hog-body" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#A0785A" />
          <stop offset="100%" stopColor="#7A5A3A" />
        </radialGradient>
        <radialGradient id="hog-belly" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8D5B8" />
          <stop offset="100%" stopColor="#D4C0A0" />
        </radialGradient>
        <radialGradient id="hog-nose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D4788E" />
        </radialGradient>
      </defs>

      {/* Quills — fan of pointed shapes on the back/top */}
      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1,1;1.02,0.98;1,1"
          dur="3s"
          repeatCount="indefinite"
          additive="sum"
        />
        {/* Outer quill layer (darker) */}
        <path d="M14,38 L8,18 L18,32 L10,10 L22,28 L18,4 L28,26 L26,2 L34,24 L34,0 L40,24 L42,0 L46,24 L50,2 L52,26 L56,4 L56,28 L62,10 L60,32 L66,18 L64,38"
              fill="#5C4033" stroke="#4a3728" strokeWidth="0.5" />
        {/* Inner quill layer (lighter tips) */}
        <path d="M18,36 L14,22 L22,32 L18,12 L28,30 L26,8 L34,28 L34,6 L40,28 L42,6 L46,28 L50,8 L52,30 L56,12 L56,32 L60,22 L60,36"
              fill="#8B6F47" opacity="0.6" />
      </g>

      {/* Body */}
      <ellipse cx="40" cy="52" rx="26" ry="22" fill="url(#hog-body)" stroke="#4a3728" strokeWidth="2" />

      {/* Belly (lighter front) */}
      <ellipse cx="40" cy="55" rx="16" ry="14" fill="url(#hog-belly)" />

      {/* Face — rounded forehead area */}
      <ellipse cx="40" cy="42" rx="20" ry="16" fill="url(#hog-body)" stroke="#4a3728" strokeWidth="1.5" />

      {/* Eyes — big, kind, with blink animation */}
      <ellipse cx="32" cy="42" rx="4.5" ry="5" fill="#2D1B0E">
        <animate attributeName="ry" values="5;0.5;5" dur="4.5s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="1.5s" />
      </ellipse>
      <circle cx="34" cy="40" r="1.5" fill="white" />

      <ellipse cx="48" cy="42" rx="4.5" ry="5" fill="#2D1B0E">
        <animate attributeName="ry" values="5;0.5;5" dur="4.5s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="1.5s" />
      </ellipse>
      <circle cx="50" cy="40" r="1.5" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="49" rx="4" ry="3" fill="url(#hog-nose)" />

      {/* Rosy cheeks */}
      <circle cx="25" cy="47" r="3.5" fill="#E8A0B0" opacity="0.3" />
      <circle cx="55" cy="47" r="3.5" fill="#E8A0B0" opacity="0.3" />

      {/* Mouth — tiny smile */}
      <path d="M37,52 Q40,55 43,52" fill="none" stroke="#4a3728" strokeWidth="1" strokeLinecap="round" />

      {/* Tiny feet */}
      <ellipse cx="28" cy="70" rx="6" ry="3.5" fill="#7A5A3A" stroke="#4a3728" strokeWidth="1" />
      <ellipse cx="52" cy="70" rx="6" ry="3.5" fill="#7A5A3A" stroke="#4a3728" strokeWidth="1" />
      {/* Tiny toe lines */}
      <g stroke="#4a3728" strokeWidth="0.8" strokeLinecap="round">
        <line x1="24" y1="70" x2="23" y2="72" />
        <line x1="27" y1="71" x2="26" y2="73" />
        <line x1="30" y1="71" x2="30" y2="73" />
        <line x1="49" y1="71" x2="49" y2="73" />
        <line x1="52" y1="71" x2="53" y2="73" />
        <line x1="55" y1="70" x2="56" y2="72" />
      </g>
    </svg>
  );
}
