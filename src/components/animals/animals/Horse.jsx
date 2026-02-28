export default function Horse({ size = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={className}
    >
      {/* Ground shadow */}
      <ellipse cx="110" cy="205" rx="70" ry="10" fill="#00000018" />

      {/* Swishy tail */}
      <path
        d="M38 108 Q22 95 18 110 Q12 128 24 138 Q14 146 22 156 Q16 162 26 166"
        fill="none"
        stroke="#5c3a1e"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 108 Q28 100 30 115 Q26 130 34 138 Q28 148 34 155"
        fill="none"
        stroke="#6b4426"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Back legs */}
      <path
        d="M72 148 Q70 165 68 180 Q66 190 72 194"
        fill="none"
        stroke="#b5733a"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M94 150 Q92 168 90 182 Q88 192 94 196"
        fill="none"
        stroke="#b5733a"
        strokeWidth="17"
        strokeLinecap="round"
      />

      {/* Back hooves */}
      <ellipse cx="72" cy="197" rx="12" ry="7" fill="#3d2510" />
      <ellipse cx="94" cy="199" rx="11" ry="7" fill="#3d2510" />

      {/* Front legs */}
      <path
        d="M128 150 Q130 168 130 182 Q130 192 134 196"
        fill="none"
        stroke="#c08040"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <path
        d="M148 148 Q150 166 150 180 Q150 190 154 194"
        fill="none"
        stroke="#c08040"
        strokeWidth="18"
        strokeLinecap="round"
      />

      {/* Front hooves */}
      <ellipse cx="134" cy="199" rx="11" ry="7" fill="#3d2510" />
      <ellipse cx="154" cy="197" rx="12" ry="7" fill="#3d2510" />

      {/* Body - blobby organic shape */}
      <path
        d="M48 120
           Q42 100 60 92
           Q80 82 110 80
           Q140 78 160 88
           Q176 96 174 118
           Q172 140 158 152
           Q140 162 110 164
           Q80 166 62 155
           Q44 144 48 120Z"
        fill="#c08040"
      />

      {/* Body shading layer for depth */}
      <path
        d="M55 130
           Q50 112 68 100
           Q86 90 110 88
           Q134 86 152 94
           Q168 102 166 122
           Q164 138 155 148
           Q140 158 110 160
           Q82 162 62 150
           Q50 142 55 130Z"
        fill="#a86c30"
        opacity="0.3"
      />

      {/* Belly highlight */}
      <path
        d="M78 132
           Q82 142 110 145
           Q138 142 142 132
           Q140 150 110 154
           Q80 150 78 132Z"
        fill="#d4944c"
        opacity="0.5"
      />

      {/* Neck - thick organic curve */}
      <path
        d="M148 98
           Q158 78 156 58
           Q154 42 146 36
           Q138 82 130 96Z"
        fill="#c08040"
      />
      <path
        d="M136 96
           Q142 76 140 56
           Q138 42 134 38"
        fill="none"
        stroke="#a86c30"
        strokeWidth="3"
        opacity="0.3"
      />

      {/* Head - big friendly blobby shape */}
      <path
        d="M112 28
           Q110 16 122 12
           Q136 8 152 12
           Q168 16 176 30
           Q182 42 178 56
           Q174 68 162 72
           Q148 76 134 72
           Q118 68 114 54
           Q110 42 112 28Z"
        fill="#c08040"
      />

      {/* Head shading */}
      <path
        d="M118 50
           Q116 38 124 28
           Q134 18 148 18
           Q160 20 166 30
           Q170 40 168 52
           Q166 62 158 66
           Q148 70 138 66
           Q126 62 120 52Z"
        fill="#a86c30"
        opacity="0.15"
      />

      {/* Soft muzzle/nose area */}
      <path
        d="M158 50
           Q164 42 174 44
           Q184 46 186 56
           Q188 66 182 72
           Q174 76 166 72
           Q158 66 158 50Z"
        fill="#d8a060"
      />
      <path
        d="M160 54
           Q166 48 172 50
           Q178 52 180 58
           Q182 64 178 68
           Q172 72 168 68
           Q162 64 160 54Z"
        fill="#e0b878"
        opacity="0.5"
      />

      {/* Nostrils */}
      <ellipse cx="176" cy="58" rx="3.5" ry="4.5" fill="#7a4a28" transform="rotate(10 176 58)" />
      <ellipse cx="170" cy="62" rx="3" ry="4" fill="#7a4a28" transform="rotate(-5 170 62)" />

      {/* Gentle mouth curve */}
      <path
        d="M168 68 Q174 72 182 70"
        fill="none"
        stroke="#9a6438"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rosy cheek blush */}
      <ellipse cx="152" cy="58" rx="10" ry="7" fill="#e07858" opacity="0.25" />

      {/* Ears - big expressive floppy */}
      <path
        d="M120 18 Q112 2 106 6 Q100 10 108 22"
        fill="#c08040"
        stroke="#c08040"
        strokeWidth="2"
      />
      <path
        d="M114 16 Q110 8 108 10 Q104 14 110 20"
        fill="#e0a068"
      />
      <path
        d="M144 14 Q148 -4 156 2 Q162 8 154 18"
        fill="#c08040"
        stroke="#c08040"
        strokeWidth="2"
      />
      <path
        d="M148 12 Q150 2 154 6 Q156 10 152 16"
        fill="#e0a068"
      />

      {/* Big expressive eyes */}
      {/* Left eye white */}
      <ellipse cx="130" cy="36" rx="10" ry="11" fill="white" />
      {/* Left eye iris */}
      <ellipse cx="132" cy="37" rx="7" ry="8" fill="#3d2510" />
      {/* Left eye pupil */}
      <ellipse cx="133" cy="38" rx="4" ry="5" fill="#1a0e06" />
      {/* Left eye sparkle highlights */}
      <circle cx="135" cy="34" r="3" fill="white" opacity="0.95" />
      <circle cx="130" cy="40" r="1.5" fill="white" opacity="0.7" />

      {/* Right eye white */}
      <ellipse cx="154" cy="34" rx="9" ry="10" fill="white" />
      {/* Right eye iris */}
      <ellipse cx="155" cy="35" rx="6.5" ry="7.5" fill="#3d2510" />
      {/* Right eye pupil */}
      <ellipse cx="156" cy="36" rx="3.5" ry="4.5" fill="#1a0e06" />
      {/* Right eye sparkle highlights */}
      <circle cx="158" cy="32" r="2.8" fill="white" opacity="0.95" />
      <circle cx="153" cy="38" r="1.3" fill="white" opacity="0.7" />

      {/* Gentle eyebrows */}
      <path
        d="M120 24 Q128 20 138 23"
        fill="none"
        stroke="#6b4426"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M148 22 Q156 18 164 22"
        fill="none"
        stroke="#6b4426"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Flowing dark brown mane - thick wavy strokes */}
      <path
        d="M118 14 Q108 22 112 34 Q104 40 110 52 Q102 58 108 68 Q100 74 106 84 Q98 88 104 96"
        fill="none"
        stroke="#5c3a1e"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M122 16 Q114 26 118 36 Q112 44 116 54 Q108 60 114 70 Q106 78 112 86 Q106 92 110 98"
        fill="none"
        stroke="#6b4426"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M126 18 Q120 28 122 38 Q118 46 120 54 Q114 62 118 72 Q112 80 116 88"
        fill="none"
        stroke="#7a5030"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Forelock tuft between ears */}
      <path
        d="M130 12 Q126 6 132 4 Q138 2 136 10"
        fill="#5c3a1e"
      />
      <path
        d="M134 10 Q130 2 138 0 Q144 -1 140 8"
        fill="#6b4426"
      />
    </svg>
  );
}
