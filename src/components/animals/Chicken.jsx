export default function Chicken({ size = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={className}
    >
      {/* Ground shadow */}
      <ellipse cx="110" cy="205" rx="58" ry="10" fill="#3e2c1a" opacity="0.18" />

      {/* Tail feathers — warm layered plumes */}
      <path
        d="M52 112 Q28 78 42 48 Q50 58 54 80 Q48 64 58 44 Q62 60 60 82 Q58 58 68 40 Q68 62 64 86"
        fill="#d2652a"
      />
      <path
        d="M56 110 Q36 82 48 54 Q54 66 56 84 Q52 70 62 52 Q64 68 62 88"
        fill="#e8824a"
        opacity="0.85"
      />
      <path
        d="M60 108 Q44 86 54 62 Q58 74 58 88"
        fill="#f2a05e"
        opacity="0.7"
      />

      {/* Body — big soft blobby shape */}
      <path
        d="M66 108 Q58 124 60 148 Q64 172 90 180 Q110 186 130 180 Q156 172 160 148 Q162 124 154 108 Q144 92 110 88 Q76 92 66 108Z"
        fill="#fef0d4"
      />

      {/* Body shading layer — warm undertone */}
      <path
        d="M72 130 Q68 150 78 170 Q92 182 110 184 Q128 182 142 170 Q152 150 148 130 Q140 118 110 114 Q80 118 72 130Z"
        fill="#f5ddb0"
        opacity="0.55"
      />

      {/* Body belly highlight */}
      <path
        d="M88 135 Q86 150 94 164 Q106 172 118 166 Q126 154 124 138 Q118 126 106 124 Q92 126 88 135Z"
        fill="#fffbf0"
        opacity="0.45"
      />

      {/* Left wing — blobby organic */}
      <path
        d="M64 118 Q46 112 40 130 Q38 148 50 158 Q62 164 72 154 Q78 140 74 124Z"
        fill="#f5ddb0"
      />
      <path
        d="M62 124 Q50 120 46 134 Q46 148 54 154 Q62 158 68 150 Q72 140 68 128Z"
        fill="#ecdcb8"
        opacity="0.6"
      />

      {/* Right wing — blobby organic */}
      <path
        d="M156 118 Q174 112 180 130 Q182 148 170 158 Q158 164 148 154 Q142 140 146 124Z"
        fill="#f5ddb0"
      />
      <path
        d="M158 124 Q170 120 174 134 Q174 148 166 154 Q158 158 152 150 Q148 140 152 128Z"
        fill="#ecdcb8"
        opacity="0.6"
      />

      {/* Legs — thick wobbly */}
      <path
        d="M92 176 Q90 186 88 196 Q86 200 90 200 Q94 200 92 196"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M128 176 Q130 186 132 196 Q134 200 130 200 Q126 200 128 196"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left foot — three wobbly toes */}
      <path
        d="M78 204 Q84 198 90 200 Q86 198 90 192"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90 200 Q96 204 100 200"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Right foot — three wobbly toes */}
      <path
        d="M120 204 Q126 198 130 200 Q126 198 130 192"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130 200 Q136 204 142 200"
        fill="none"
        stroke="#e88a2e"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Head — oversized blobby circle */}
      <path
        d="M68 68 Q64 42 82 28 Q100 18 120 24 Q140 32 148 52 Q152 72 142 86 Q130 96 110 98 Q86 96 74 86 Q66 78 68 68Z"
        fill="#fef0d4"
      />

      {/* Head shading — warm depth */}
      <path
        d="M78 72 Q76 56 88 44 Q100 36 116 40 Q130 46 136 60 Q138 74 130 82 Q120 88 108 88 Q90 86 82 78Z"
        fill="#f5ddb0"
        opacity="0.35"
      />

      {/* Comb — organic red wobbly crest */}
      <path
        d="M86 34 Q84 18 92 10 Q96 6 98 16 Q100 8 106 4 Q110 8 110 18 Q114 6 120 8 Q124 14 120 26 Q116 32 112 34 Q100 38 92 36Z"
        fill="#cc2b2b"
      />
      <path
        d="M90 30 Q88 20 94 14 Q98 12 98 20 Q100 14 106 10 Q108 14 108 22 Q112 12 116 14 Q118 18 116 28 Q110 32 102 32 Q94 32 90 30Z"
        fill="#e04040"
        opacity="0.7"
      />

      {/* Left eye — big expressive with sparkle */}
      <ellipse cx="92" cy="58" rx="10" ry="11" fill="#ffffff" />
      <ellipse cx="92" cy="60" rx="7.5" ry="8.5" fill="#2a1a0e" />
      <ellipse cx="89" cy="56" rx="3" ry="3.5" fill="#ffffff" />
      <circle cx="95" cy="63" r="1.5" fill="#ffffff" opacity="0.7" />
      <ellipse cx="92" cy="60" rx="3" ry="3" fill="#4a2a10" opacity="0.3" />

      {/* Right eye — big expressive with sparkle */}
      <ellipse cx="128" cy="58" rx="10" ry="11" fill="#ffffff" />
      <ellipse cx="128" cy="60" rx="7.5" ry="8.5" fill="#2a1a0e" />
      <ellipse cx="125" cy="56" rx="3" ry="3.5" fill="#ffffff" />
      <circle cx="131" cy="63" r="1.5" fill="#ffffff" opacity="0.7" />
      <ellipse cx="128" cy="60" rx="3" ry="3" fill="#4a2a10" opacity="0.3" />

      {/* Beak — chunky orange wedge */}
      <path
        d="M102 70 Q106 66 110 64 Q114 66 118 70 Q114 80 110 84 Q106 80 102 70Z"
        fill="#f0922e"
      />
      {/* Beak dividing line */}
      <path
        d="M103 71 Q110 74 117 71"
        fill="none"
        stroke="#d07820"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Beak highlight */}
      <path
        d="M106 68 Q108 66 112 68"
        fill="#faba60"
        opacity="0.5"
      />

      {/* Wattle — soft red dangle */}
      <path
        d="M106 82 Q104 88 106 94 Q110 98 114 94 Q116 88 114 82"
        fill="#cc2b2b"
        opacity="0.85"
      />
      <path
        d="M108 84 Q108 88 110 92 Q112 88 112 84"
        fill="#e04040"
        opacity="0.4"
      />

      {/* Left cheek blush */}
      <circle cx="76" cy="68" r="8" fill="#f0a08a" opacity="0.4" />
      <circle cx="76" cy="68" r="5" fill="#e8886e" opacity="0.25" />

      {/* Right cheek blush */}
      <circle cx="144" cy="68" r="8" fill="#f0a08a" opacity="0.4" />
      <circle cx="144" cy="68" r="5" fill="#e8886e" opacity="0.25" />

      {/* Tiny eyebrow hints for expression */}
      <path
        d="M82 46 Q88 42 96 44"
        fill="none"
        stroke="#c4a070"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M138 46 Q132 42 124 44"
        fill="none"
        stroke="#c4a070"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
