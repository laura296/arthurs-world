export default function Goat({ size = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={className}
    >
      {/* ============ GROUND SHADOW ============ */}
      <ellipse cx="110" cy="205" rx="68" ry="10" fill="#c8b8a4" opacity="0.35" />

      {/* ============ BODY ============ */}
      {/* Main body - big blobby organic shape */}
      <path
        d="M60 125 Q48 108 56 92 Q64 78 90 74
           Q110 70 132 74 Q158 78 166 92
           Q174 108 162 125 Q158 148 145 158
           Q125 168 110 168 Q95 168 77 158
           Q64 148 60 125Z"
        fill="#e8d8c4"
      />
      {/* Body shading layer */}
      <path
        d="M68 130 Q60 115 66 100 Q72 88 92 82
           Q105 78 110 78 Q100 90 96 108
           Q92 130 96 152 Q88 148 80 140
           Q70 132 68 130Z"
        fill="#d0c0a8"
        opacity="0.45"
      />
      {/* Belly highlight */}
      <path
        d="M88 120 Q95 105 112 102 Q130 105 136 120
           Q140 138 130 155 Q120 162 110 162
           Q100 162 92 155 Q82 138 88 120Z"
        fill="#f2e8dc"
        opacity="0.55"
      />

      {/* ============ TAIL ============ */}
      <path
        d="M60 108 Q48 98 44 86 Q42 78 48 74"
        fill="none"
        stroke="#e8d8c4"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M48 78 Q44 70 48 66 Q52 62 54 66"
        fill="none"
        stroke="#d0c0a8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Tail tuft */}
      <path
        d="M46 68 Q40 60 44 56 Q48 54 50 58"
        fill="none"
        stroke="#d0c0a8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* ============ LEGS ============ */}
      {/* Back left leg */}
      <path
        d="M72 152 Q70 164 68 176 Q66 186 68 192
           Q72 196 78 196 Q82 192 80 186
           Q82 176 82 164 Q82 156 80 152Z"
        fill="#e8d8c4"
      />
      {/* Back right leg */}
      <path
        d="M134 152 Q136 164 138 176 Q140 186 138 192
           Q134 196 128 196 Q124 192 126 186
           Q124 176 124 164 Q124 156 126 152Z"
        fill="#e8d8c4"
      />
      {/* Front left leg */}
      <path
        d="M86 155 Q84 168 83 180 Q82 188 84 194
           Q88 198 94 198 Q98 194 96 188
           Q97 180 98 168 Q98 158 96 155Z"
        fill="#e8d8c4"
      />
      {/* Front right leg */}
      <path
        d="M118 155 Q120 168 121 180 Q122 188 120 194
           Q116 198 110 198 Q106 194 108 188
           Q107 180 106 168 Q106 158 108 155Z"
        fill="#e8d8c4"
      />

      {/* ============ HOOVES ============ */}
      <path
        d="M64 190 Q66 198 72 200 Q78 200 82 198 Q84 192 80 190Z"
        fill="#5a4a38"
      />
      <path
        d="M142 190 Q140 198 134 200 Q128 200 124 198 Q122 192 126 190Z"
        fill="#5a4a38"
      />
      <path
        d="M80 192 Q82 200 88 202 Q94 202 98 200 Q100 194 96 192Z"
        fill="#5a4a38"
      />
      <path
        d="M124 192 Q122 200 116 202 Q110 202 106 200 Q104 194 108 192Z"
        fill="#5a4a38"
      />

      {/* ============ HEAD ============ */}
      {/* Big friendly head - organic blobby shape */}
      <path
        d="M72 52 Q68 32 78 20 Q88 12 110 10
           Q132 12 142 20 Q152 32 148 52
           Q150 68 144 78 Q134 90 110 92
           Q86 90 76 78 Q70 68 72 52Z"
        fill="#e8d8c4"
      />
      {/* Head shading */}
      <path
        d="M76 55 Q74 38 82 26 Q88 18 98 15
           Q90 22 85 35 Q80 50 82 65
           Q84 75 88 82 Q82 78 78 70
           Q74 62 76 55Z"
        fill="#d0c0a8"
        opacity="0.4"
      />

      {/* ============ HORNS ============ */}
      {/* Left horn */}
      <path
        d="M84 22 Q76 8 68 4 Q60 2 56 8 Q54 14 58 18 Q64 16 72 22"
        fill="#b0a08a"
      />
      <path
        d="M82 22 Q76 12 70 8 Q64 6 60 10 Q62 12 68 14 Q74 18 80 24"
        fill="#c4b8a4"
        opacity="0.6"
      />
      {/* Right horn */}
      <path
        d="M136 22 Q144 8 152 4 Q160 2 164 8 Q166 14 162 18 Q156 16 148 22"
        fill="#b0a08a"
      />
      <path
        d="M138 22 Q144 12 150 8 Q156 6 160 10 Q158 12 152 14 Q146 18 140 24"
        fill="#c4b8a4"
        opacity="0.6"
      />

      {/* ============ EARS ============ */}
      {/* Left ear - floppy sideways */}
      <path
        d="M74 42 Q58 34 46 38 Q38 42 40 50
           Q42 56 50 56 Q60 54 72 48Z"
        fill="#e8d8c4"
      />
      {/* Left ear pink inside */}
      <path
        d="M70 44 Q58 38 50 42 Q44 46 46 50
           Q48 54 54 52 Q62 50 68 46Z"
        fill="#e8a8a0"
        opacity="0.6"
      />
      {/* Right ear - floppy sideways */}
      <path
        d="M146 42 Q162 34 174 38 Q182 42 180 50
           Q178 56 170 56 Q160 54 148 48Z"
        fill="#e8d8c4"
      />
      {/* Right ear pink inside */}
      <path
        d="M150 44 Q162 38 170 42 Q176 46 174 50
           Q172 54 166 52 Q158 50 152 46Z"
        fill="#e8a8a0"
        opacity="0.6"
      />

      {/* ============ FACE ============ */}
      {/* Muzzle / nose area - big soft bump */}
      <path
        d="M90 64 Q88 72 92 80 Q100 88 110 88
           Q120 88 128 80 Q132 72 130 64
           Q128 58 110 56 Q92 58 90 64Z"
        fill="#dcceb8"
      />
      {/* Muzzle highlight */}
      <path
        d="M96 68 Q96 74 100 78 Q106 82 110 82
           Q114 82 118 80 Q106 76 102 70 Q100 66 96 68Z"
        fill="#ece0d0"
        opacity="0.5"
      />

      {/* ============ EYES ============ */}
      {/* Left eye white */}
      <ellipse cx="94" cy="46" rx="10" ry="11" fill="white" />
      {/* Left eye iris */}
      <ellipse cx="95" cy="47" rx="7" ry="8" fill="#8a7a52" />
      {/* Left pupil - horizontal rectangular (goat!) */}
      <rect x="89" y="44.5" width="12" height="5" rx="2" fill="#1a1a1a" />
      {/* Left eye top shadow */}
      <path
        d="M85 40 Q90 37 100 38 Q104 39 103 42 Q98 40 92 40Z"
        fill="#d0c0a8"
        opacity="0.5"
      />
      {/* Left eye sparkle highlights */}
      <ellipse cx="90" cy="42" rx="2.5" ry="2" fill="white" opacity="0.9" />
      <circle cx="98" cy="50" r="1.2" fill="white" opacity="0.7" />

      {/* Right eye white */}
      <ellipse cx="126" cy="46" rx="10" ry="11" fill="white" />
      {/* Right eye iris */}
      <ellipse cx="125" cy="47" rx="7" ry="8" fill="#8a7a52" />
      {/* Right pupil - horizontal rectangular (goat!) */}
      <rect x="119" y="44.5" width="12" height="5" rx="2" fill="#1a1a1a" />
      {/* Right eye top shadow */}
      <path
        d="M117 40 Q122 37 132 38 Q136 39 135 42 Q130 40 124 40Z"
        fill="#d0c0a8"
        opacity="0.5"
      />
      {/* Right eye sparkle highlights */}
      <ellipse cx="122" cy="42" rx="2.5" ry="2" fill="white" opacity="0.9" />
      <circle cx="130" cy="50" r="1.2" fill="white" opacity="0.7" />

      {/* ============ NOSE ============ */}
      {/* Left nostril */}
      <ellipse cx="104" cy="74" rx="3.5" ry="2.8" fill="#b89880" />
      {/* Right nostril */}
      <ellipse cx="116" cy="74" rx="3.5" ry="2.8" fill="#b89880" />
      {/* Nostril highlights */}
      <ellipse cx="103" cy="73" rx="1.5" ry="1" fill="#c8a898" opacity="0.5" />
      <ellipse cx="115" cy="73" rx="1.5" ry="1" fill="#c8a898" opacity="0.5" />

      {/* ============ MOUTH ============ */}
      <path
        d="M100 80 Q104 84 110 84 Q116 84 120 80"
        fill="none"
        stroke="#b89880"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Little smile line */}
      <path
        d="M110 84 Q110 86 110 87"
        fill="none"
        stroke="#b89880"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ============ ROSY CHEEKS ============ */}
      <ellipse cx="82" cy="58" rx="8" ry="5" fill="#e8a098" opacity="0.3" />
      <ellipse cx="138" cy="58" rx="8" ry="5" fill="#e8a098" opacity="0.3" />

      {/* ============ BEARD ============ */}
      {/* Wispy beard strokes */}
      <path
        d="M102 88 Q98 100 94 112 Q92 118 90 122"
        fill="none"
        stroke="#d0c0a8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M108 90 Q106 104 104 116 Q102 122 100 128"
        fill="none"
        stroke="#c8b8a0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M114 90 Q114 102 112 114 Q110 120 108 124"
        fill="none"
        stroke="#d0c0a8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M118 88 Q120 98 118 108 Q116 114 114 118"
        fill="none"
        stroke="#c8b8a0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Beard tuft ends */}
      <path
        d="M90 122 Q86 128 84 132"
        fill="none"
        stroke="#d0c0a8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M100 128 Q98 134 96 138"
        fill="none"
        stroke="#c8b8a0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
