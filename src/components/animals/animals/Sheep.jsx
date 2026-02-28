export default function Sheep({ size = 160, className = '' }) {
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      <defs>
        {/* Soft body shading gradient */}
        <radialGradient id="sheepBodyShade" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f5f0e8" />
          <stop offset="70%" stopColor="#e8e0d4" />
          <stop offset="100%" stopColor="#d8cfc2" />
        </radialGradient>
        {/* Warm highlight for top wool */}
        <radialGradient id="sheepWoolHighlight" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#f9f5ef" />
          <stop offset="100%" stopColor="#f0ece4" />
        </radialGradient>
        {/* Eye sparkle gradient */}
        <radialGradient id="sheepEyeShine" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#5a4a3a" />
          <stop offset="100%" stopColor="#2a1e14" />
        </radialGradient>
        {/* Cheek blush */}
        <radialGradient id="sheepBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8888a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8888a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="110" cy="200" rx="60" ry="8" fill="#c8bfb0" opacity="0.35" />

      {/* === LEGS (behind body) === */}
      {/* Back left leg */}
      <path
        d="M78 148 C76 158, 72 172, 70 182 Q68 190, 74 190 L82 190 Q88 190, 86 182 C84 174, 82 160, 82 148"
        fill="#4a3a2a"
      />
      {/* Back right leg */}
      <path
        d="M138 148 C140 158, 144 172, 146 182 Q148 190, 142 190 L134 190 Q128 190, 130 182 C132 174, 134 160, 134 148"
        fill="#4a3a2a"
      />
      {/* Front left leg */}
      <path
        d="M90 152 C88 162, 86 174, 84 184 Q82 192, 88 192 L96 192 Q102 192, 100 184 C98 176, 96 164, 96 152"
        fill="#3e2e1e"
      />
      {/* Front right leg */}
      <path
        d="M124 152 C126 162, 128 174, 130 184 Q132 192, 126 192 L118 192 Q112 192, 114 184 C116 176, 118 164, 118 152"
        fill="#3e2e1e"
      />

      {/* Hooves - rounded chunky blobs */}
      <ellipse cx="76" cy="191" rx="10" ry="5" fill="#2a1e14" />
      <ellipse cx="138" cy="191" rx="10" ry="5" fill="#2a1e14" />
      <ellipse cx="92" cy="193" rx="10" ry="5" fill="#2a1e14" />
      <ellipse cx="122" cy="193" rx="10" ry="5" fill="#2a1e14" />

      {/* === BODY - overlapping fluffy cloud circles === */}
      {/* Bottom body layer (darker for depth) */}
      <ellipse cx="110" cy="140" rx="52" ry="32" fill="#e8e0d4" />

      {/* Organic blobby body shapes */}
      <path
        d="M58 125 Q55 110, 68 105 Q78 100, 85 108 Q90 96, 105 95 Q118 94, 125 105 Q132 96, 145 100 Q158 106, 160 120 Q165 132, 158 142 Q150 155, 130 158 Q115 162, 100 160 Q80 158, 68 148 Q56 140, 58 125Z"
        fill="url(#sheepBodyShade)"
      />

      {/* Fluffy cloud bumps - top layer */}
      <circle cx="72" cy="118" r="20" fill="#f0ece4" />
      <circle cx="92" cy="105" r="22" fill="#f5f0e8" />
      <circle cx="115" cy="102" r="24" fill="#f5f0e8" />
      <circle cx="138" cy="108" r="21" fill="#f0ece4" />
      <circle cx="150" cy="122" r="18" fill="#e8e0d4" />
      <circle cx="60" cy="130" r="16" fill="#e8e0d4" />

      {/* Mid wool highlights */}
      <circle cx="100" cy="110" r="23" fill="#f5f0e8" opacity="0.7" />
      <circle cx="125" cy="115" r="20" fill="#f0ece4" opacity="0.6" />
      <circle cx="80" cy="128" r="18" fill="#f5f0e8" opacity="0.5" />

      {/* Top body highlight for volume */}
      <circle cx="105" cy="100" r="18" fill="#f9f5ef" opacity="0.5" />

      {/* Bottom wool tufts overlapping legs */}
      <circle cx="82" cy="148" r="14" fill="#f0ece4" />
      <circle cx="100" cy="152" r="15" fill="#e8e0d4" />
      <circle cx="120" cy="152" r="15" fill="#e8e0d4" />
      <circle cx="138" cy="148" r="14" fill="#f0ece4" />

      {/* === HEAD === */}
      {/* Dark face - organic blobby shape */}
      <path
        d="M110 52 Q130 52, 132 72 Q134 88, 120 95 Q110 100, 100 95 Q86 88, 88 72 Q86 52, 110 52Z"
        fill="#4a3a2a"
      />

      {/* Ears - outer dark */}
      <path
        d="M84 62 Q68 50, 62 58 Q56 66, 70 72 Q78 76, 86 70Z"
        fill="#4a3a2a"
      />
      <path
        d="M136 62 Q152 50, 158 58 Q164 66, 150 72 Q142 76, 134 70Z"
        fill="#4a3a2a"
      />

      {/* Ears - pink inner */}
      <path
        d="M82 64 Q70 55, 66 60 Q61 66, 72 70 Q78 72, 83 68Z"
        fill="#d4888a"
        opacity="0.7"
      />
      <path
        d="M138 64 Q150 55, 154 60 Q159 66, 148 70 Q142 72, 137 68Z"
        fill="#d4888a"
        opacity="0.7"
      />

      {/* === FLUFFY WOOL CROWN === */}
      <circle cx="96" cy="48" r="12" fill="url(#sheepWoolHighlight)" />
      <circle cx="110" cy="44" r="14" fill="#f5f0e8" />
      <circle cx="124" cy="48" r="12" fill="url(#sheepWoolHighlight)" />
      <circle cx="102" cy="42" r="10" fill="#f0ece4" />
      <circle cx="118" cy="42" r="10" fill="#f0ece4" />
      <circle cx="110" cy="38" r="9" fill="#f9f5ef" />
      {/* Extra fluff tufts */}
      <circle cx="92" cy="52" r="8" fill="#f0ece4" opacity="0.8" />
      <circle cx="128" cy="52" r="8" fill="#f0ece4" opacity="0.8" />

      {/* === FACE DETAILS === */}

      {/* Rosy cheek blush on dark face */}
      <circle cx="92" cy="82" r="8" fill="url(#sheepBlush)" />
      <circle cx="128" cy="82" r="8" fill="url(#sheepBlush)" />

      {/* === EYES - big soulful expressive === */}
      {/* Eye whites */}
      <ellipse cx="100" cy="72" rx="8" ry="9" fill="#faf8f4" />
      <ellipse cx="120" cy="72" rx="8" ry="9" fill="#faf8f4" />

      {/* Irises - large and dark */}
      <circle cx="101" cy="73" r="6" fill="url(#sheepEyeShine)" />
      <circle cx="119" cy="73" r="6" fill="url(#sheepEyeShine)" />

      {/* Pupils */}
      <circle cx="102" cy="74" r="3.5" fill="#1a0e08" />
      <circle cx="118" cy="74" r="3.5" fill="#1a0e08" />

      {/* Big sparkle highlights (primary) */}
      <circle cx="104" cy="70" r="2.2" fill="white" opacity="0.95" />
      <circle cx="122" cy="70" r="2.2" fill="white" opacity="0.95" />

      {/* Secondary sparkle (smaller, offset) */}
      <circle cx="99" cy="76" r="1.2" fill="white" opacity="0.7" />
      <circle cx="117" cy="76" r="1.2" fill="white" opacity="0.7" />

      {/* Tiny tertiary sparkle */}
      <circle cx="105" cy="72" r="0.7" fill="white" opacity="0.5" />
      <circle cx="123" cy="72" r="0.7" fill="white" opacity="0.5" />

      {/* === NOSE === */}
      <path
        d="M107 85 Q110 82, 113 85 Q111 90, 110 90 Q109 90, 107 85Z"
        fill="#2a1e14"
      />
      {/* Nose highlight */}
      <ellipse cx="109" cy="85" rx="1.5" ry="1" fill="#5a4a3a" opacity="0.4" />

      {/* === GENTLE SMILE === */}
      <path
        d="M104 91 Q107 95, 110 94 Q113 95, 116 91"
        fill="none"
        stroke="#5a4030"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
