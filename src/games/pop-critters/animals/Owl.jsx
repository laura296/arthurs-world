/**
 * Hand-illustrated Owl SVG — round face with facial disc, VERY big round eyes
 * (biggest of all animals) with amber/yellow iris and large black pupil,
 * small curved beak, feathered ear tufts, brown/tawny feather pattern,
 * head tilt animation, blink animation. Storybook illustration style.
 */
export default function Owl({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="owl-body" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5340" />
        </radialGradient>
        <radialGradient id="owl-face-disc" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8D8C0" />
          <stop offset="60%" stopColor="#D0C0A0" />
          <stop offset="100%" stopColor="#B8A888" />
        </radialGradient>
        <radialGradient id="owl-iris" cx="0.4" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#F0C040" />
          <stop offset="60%" stopColor="#D4A020" />
          <stop offset="100%" stopColor="#B88810" />
        </radialGradient>
      </defs>

      {/* Head tilt animation wrapper */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0,40,40;-8,40,40;0,40,40;8,40,40;0,40,40"
          dur="5s"
          repeatCount="indefinite"
        />

        {/* Ear tufts — feathered pointed shapes */}
        {/* Left tuft */}
        <g>
          <path d="M18,18 L12,2 L16,16 L14,4 L20,18" fill="#6B5340" />
          <path d="M16,16 L14,6 L18,14" fill="#8B7355" opacity="0.7" />
        </g>
        {/* Right tuft */}
        <g>
          <path d="M58,18 L64,2 L60,16 L62,4 L56,18" fill="#6B5340" />
          <path d="M60,16 L62,6 L58,14" fill="#8B7355" opacity="0.7" />
        </g>

        {/* Body — with feather texture (overlapping ellipses) */}
        <ellipse cx="40" cy="62" rx="24" ry="18" fill="url(#owl-body)" stroke="#4A3828" strokeWidth="2" />
        {/* Feather scale pattern on body */}
        <g fill="#7A6348" opacity="0.4">
          <ellipse cx="30" cy="58" rx="6" ry="4" />
          <ellipse cx="40" cy="56" rx="6" ry="4" />
          <ellipse cx="50" cy="58" rx="6" ry="4" />
          <ellipse cx="35" cy="64" rx="6" ry="4" />
          <ellipse cx="45" cy="64" rx="6" ry="4" />
          <ellipse cx="32" cy="70" rx="5" ry="3.5" />
          <ellipse cx="40" cy="70" rx="5" ry="3.5" />
          <ellipse cx="48" cy="70" rx="5" ry="3.5" />
        </g>

        {/* Lighter breast feathers */}
        <ellipse cx="40" cy="66" rx="12" ry="10" fill="#D0C0A0" opacity="0.5" />

        {/* Head */}
        <ellipse cx="40" cy="36" rx="24" ry="22" fill="url(#owl-body)" stroke="#4A3828" strokeWidth="2" />

        {/* Facial disc — lighter concentric circles around eyes */}
        <ellipse cx="40" cy="36" rx="20" ry="18" fill="url(#owl-face-disc)" />

        {/* Eye sockets — darker rings */}
        <circle cx="30" cy="34" r="10" fill="#B8A888" />
        <circle cx="50" cy="34" r="10" fill="#B8A888" />

        {/* VERY big eyes — biggest of all animals */}
        {/* Left eye */}
        <circle cx="30" cy="34" r="9" fill="white" stroke="#4A3828" strokeWidth="1.5" />
        <circle cx="30" cy="34" r="7" fill="url(#owl-iris)" />
        <circle cx="30" cy="34" r="4.5" fill="#1A1010">
          <animate attributeName="r" values="4.5;4.5;0.5;0.5;4.5" dur="6s" repeatCount="indefinite" keyTimes="0;0.45;0.48;0.52;0.55" />
        </circle>
        <circle cx="32" cy="32" r="2.5" fill="white" /> {/* big highlight */}
        <circle cx="28" cy="36" r="1" fill="white" opacity="0.5" /> {/* small highlight */}

        {/* Right eye */}
        <circle cx="50" cy="34" r="9" fill="white" stroke="#4A3828" strokeWidth="1.5" />
        <circle cx="50" cy="34" r="7" fill="url(#owl-iris)" />
        <circle cx="50" cy="34" r="4.5" fill="#1A1010">
          <animate attributeName="r" values="4.5;4.5;0.5;0.5;4.5" dur="6s" repeatCount="indefinite" keyTimes="0;0.45;0.48;0.52;0.55" />
        </circle>
        <circle cx="52" cy="32" r="2.5" fill="white" />
        <circle cx="48" cy="36" r="1" fill="white" opacity="0.5" />

        {/* Small curved beak */}
        <path d="M37,42 Q40,48 43,42 Q40,44 37,42 Z" fill="#D4A020" stroke="#B88810" strokeWidth="0.8" />

        {/* Rosy cheeks */}
        <circle cx="20" cy="40" r="3" fill="#E8A0B0" opacity="0.2" />
        <circle cx="60" cy="40" r="3" fill="#E8A0B0" opacity="0.2" />

        {/* Wings — slightly visible on sides */}
        <path d="M16,50 Q10,55 14,65 Q16,60 18,55" fill="#6B5340" stroke="#4A3828" strokeWidth="1" />
        <path d="M64,50 Q70,55 66,65 Q64,60 62,55" fill="#6B5340" stroke="#4A3828" strokeWidth="1" />

        {/* Tiny feet */}
        <g fill="#D4A020" stroke="#B88810" strokeWidth="0.8">
          <path d="M32,76 L28,80 M32,76 L32,80 M32,76 L36,80" />
          <path d="M48,76 L44,80 M48,76 L48,80 M48,76 L52,80" />
        </g>
      </g>
    </svg>
  );
}
