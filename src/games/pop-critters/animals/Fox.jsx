/**
 * Hand-illustrated Fox SVG — pointy ears with dark tips and cream inner,
 * orange-red fur gradient, white muzzle/chest, slightly narrower sly eyes
 * (still friendly), dark nose, bushy tail with white tip that swishes.
 * Storybook illustration style.
 */
export default function Fox({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="fox-fur" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#D4622B" />
          <stop offset="100%" stopColor="#B84A1B" />
        </radialGradient>
        <linearGradient id="fox-ear-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0E0D0" />
          <stop offset="100%" stopColor="#E0C8B0" />
        </linearGradient>
        <radialGradient id="fox-chest" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#F0E0D0" />
        </radialGradient>
      </defs>

      {/* Bushy tail — visible on right side, with swish animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-8,60,55;8,60,55;-8,60,55"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M55,55 Q72,40 74,25 Q76,15 70,20 Q64,25 62,35 Q60,45 55,55"
              fill="#D4622B" stroke="#8B3A10" strokeWidth="1" />
        {/* White tail tip */}
        <path d="M72,25 Q76,15 70,20 Q66,23 70,27 Z" fill="white" />
      </g>

      {/* Pointed ears */}
      {/* Left ear */}
      <polygon points="18,30 10,6 30,24" fill="#D4622B" stroke="#8B3A10" strokeWidth="1.5" />
      <polygon points="20,28 14,12 28,24" fill="url(#fox-ear-inner)" />
      {/* Dark ear tip */}
      <polygon points="10,6 13,14 8,12" fill="#3D2010" />

      {/* Right ear */}
      <polygon points="58,30 66,6 46,24" fill="#D4622B" stroke="#8B3A10" strokeWidth="1.5" />
      <polygon points="56,28 62,12 48,24" fill="url(#fox-ear-inner)" />
      {/* Dark ear tip */}
      <polygon points="66,6 63,14 68,12" fill="#3D2010" />

      {/* Body */}
      <ellipse cx="38" cy="62" rx="22" ry="16" fill="url(#fox-fur)" stroke="#8B3A10" strokeWidth="2" />

      {/* White chest */}
      <ellipse cx="38" cy="64" rx="14" ry="10" fill="url(#fox-chest)" />

      {/* Head — slightly angular/diamond-ish */}
      <ellipse cx="38" cy="40" rx="22" ry="18" fill="url(#fox-fur)" stroke="#8B3A10" strokeWidth="2" />

      {/* White muzzle */}
      <ellipse cx="38" cy="48" rx="14" ry="10" fill="url(#fox-chest)" />

      {/* Cheek fur tufts — slightly angular */}
      <path d="M16,42 Q12,38 16,36" fill="#D4622B" stroke="#8B3A10" strokeWidth="1" />
      <path d="M60,42 Q64,38 60,36" fill="#D4622B" stroke="#8B3A10" strokeWidth="1" />

      {/* Eyes — narrower, slightly sly but still friendly */}
      <ellipse cx="29" cy="38" rx="4.5" ry="4" fill="#2D1B0E">
        <animate attributeName="ry" values="4;0.5;4" dur="5s" repeatCount="indefinite" keyTimes="0;0.03;0.06" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2.5s" />
      </ellipse>
      {/* Amber iris hints */}
      <ellipse cx="29" cy="38" rx="3" ry="2.5" fill="#8B5E2B" opacity="0.4" />
      <circle cx="31" cy="36.5" r="1.5" fill="white" />

      <ellipse cx="47" cy="38" rx="4.5" ry="4" fill="#2D1B0E">
        <animate attributeName="ry" values="4;0.5;4" dur="5s" repeatCount="indefinite" keyTimes="0;0.03;0.06" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2.5s" />
      </ellipse>
      <ellipse cx="47" cy="38" rx="3" ry="2.5" fill="#8B5E2B" opacity="0.4" />
      <circle cx="49" cy="36.5" r="1.5" fill="white" />

      {/* Dark nose */}
      <ellipse cx="38" cy="47" rx="3.5" ry="2.5" fill="#2D1B0E" />
      {/* Nose highlight */}
      <ellipse cx="37" cy="46" rx="1.5" ry="1" fill="#555" opacity="0.4" />

      {/* Mouth — slight smirk */}
      <path d="M34,49 Q38,52 42,49" fill="none" stroke="#8B3A10" strokeWidth="1" strokeLinecap="round" />

      {/* Rosy cheeks (more subtle) */}
      <circle cx="22" cy="44" r="3" fill="#E8A0B0" opacity="0.18" />
      <circle cx="54" cy="44" r="3" fill="#E8A0B0" opacity="0.18" />

      {/* Front paws */}
      <ellipse cx="26" cy="72" rx="6" ry="3.5" fill="#D4622B" stroke="#8B3A10" strokeWidth="1.5" />
      <ellipse cx="50" cy="72" rx="6" ry="3.5" fill="#D4622B" stroke="#8B3A10" strokeWidth="1.5" />
    </svg>
  );
}
