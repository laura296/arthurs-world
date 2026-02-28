export default function BabyElephant({
  size = 160,
  className = '',
  noseLength = 'short',
  expression = 'curious',
}) {
  const isLong = noseLength === 'long';

  // Expression-driven attributes
  const expr = {
    curious:   { eyeW: 14, eyeH: 16, mouthD: 'M96 114 C104 120, 116 120, 124 114', browL: 'M76 52 C82 46, 98 46, 104 50', browR: 'M116 50 C122 46, 138 46, 144 52', earAngle: 0 },
    scared:    { eyeW: 16, eyeH: 18, mouthD: 'M100 116 C107 112, 113 112, 120 116', browL: 'M78 48 C84 52, 98 52, 104 48', browR: 'M116 48 C122 52, 136 52, 142 48', earAngle: -5 },
    surprised: { eyeW: 16, eyeH: 18, mouthD: 'M104 116 C107 122, 113 122, 116 116', browL: 'M76 46 C82 40, 98 40, 104 46', browR: 'M116 46 C122 40, 138 40, 144 46', earAngle: 5 },
    happy:     { eyeW: 12, eyeH: 10, mouthD: 'M94 114 C104 124, 116 124, 126 114', browL: 'M78 50 C84 46, 98 46, 104 50', browR: 'M116 50 C122 46, 136 46, 142 50', earAngle: 3 },
    proud:     { eyeW: 13, eyeH: 12, mouthD: 'M96 114 C104 122, 116 122, 124 114', browL: 'M76 48 C82 44, 98 44, 104 48', browR: 'M116 48 C122 44, 138 44, 144 48', earAngle: 5 },
  }[expression] || expr?.curious;

  // Trunk paths — short: stubby round; long: curving S
  const trunkD = isLong
    ? 'M110 90 C112 100, 118 115, 126 130 C132 140, 128 155, 118 160 C112 163, 106 158, 108 150'
    : 'M110 90 C112 98, 116 108, 118 114 C120 118, 118 122, 114 120';

  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      <defs>
        <radialGradient id="be-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a0bbc8" />
          <stop offset="100%" stopColor="#8ba8b8" />
        </radialGradient>
        <radialGradient id="be-belly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b8ced8" />
          <stop offset="100%" stopColor="#a0bbc8" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="110" cy="210" rx="55" ry="7" fill="#5a6a6a" opacity="0.18" />

      {/* Tail */}
      <path d="M50 120 C38 114, 34 106, 36 100" fill="none" stroke="#8ba8b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="98" r="4" fill="#7a97a7" />

      {/* Body — big round */}
      <path
        d="M56 130 C52 98, 74 78, 110 76 C146 78, 168 98, 164 130 C162 162, 146 176, 110 178 C74 176, 58 162, 56 130Z"
        fill="url(#be-body)"
        stroke="#7a97a7" strokeWidth="1.2"
      />

      {/* Belly highlight */}
      <ellipse cx="110" cy="148" rx="34" ry="22" fill="url(#be-belly)" opacity="0.55" />

      {/* Legs — chunky with rounded feet */}
      <path d="M76 166 C74 178, 72 192, 70 202 L84 204 C83 194, 82 180, 82 170Z" fill="#8ba8b8" stroke="#7a97a7" strokeWidth="1" />
      <path d="M94 170 C93 182, 92 194, 91 204 L105 206 C104 196, 103 184, 102 172Z" fill="#8ba8b8" stroke="#7a97a7" strokeWidth="1" />
      <path d="M118 170 C117 182, 116 194, 115 204 L129 206 C128 196, 127 184, 126 172Z" fill="#96b2c0" stroke="#7a97a7" strokeWidth="1" />
      <path d="M140 166 C139 178, 138 192, 136 202 L150 204 C149 194, 148 180, 146 170Z" fill="#96b2c0" stroke="#7a97a7" strokeWidth="1" />

      {/* Feet — rounded pads */}
      <ellipse cx="77" cy="204" rx="10" ry="5" fill="#7a97a7" />
      <ellipse cx="98" cy="206" rx="10" ry="5" fill="#7a97a7" />
      <ellipse cx="122" cy="206" rx="10" ry="5" fill="#7a97a7" />
      <ellipse cx="143" cy="204" rx="10" ry="5" fill="#7a97a7" />

      {/* Head — large circle */}
      <circle cx="110" cy="62" r="44" fill="#8ba8b8" stroke="#7a97a7" strokeWidth="1.2" />
      <circle cx="110" cy="58" r="38" fill="#96b2c0" opacity="0.4" />

      {/* Ears — big floppy elephant ears */}
      <g transform={`rotate(${expr.earAngle} 72 52)`}>
        <path d="M72 38 C46 12, 26 22, 32 48 C36 62, 52 68, 68 56Z" fill="#8ba8b8" stroke="#7a97a7" strokeWidth="1" />
        <path d="M64 40 C48 22, 38 28, 42 46 C44 54, 54 58, 62 50Z" fill="#c4a0a8" opacity="0.5" />
      </g>
      <g transform={`rotate(${-expr.earAngle} 148 52)`}>
        <path d="M148 38 C174 12, 194 22, 188 48 C184 62, 168 68, 152 56Z" fill="#8ba8b8" stroke="#7a97a7" strokeWidth="1" />
        <path d="M156 40 C172 22, 182 28, 178 46 C176 54, 166 58, 158 50Z" fill="#c4a0a8" opacity="0.5" />
      </g>

      {/* Eyes — big round sparkly */}
      <ellipse cx="92" cy="58" rx={expr.eyeW} ry={expr.eyeH} fill="white" stroke="#8a9aa8" strokeWidth="1" />
      <ellipse cx="128" cy="58" rx={expr.eyeW} ry={expr.eyeH} fill="white" stroke="#8a9aa8" strokeWidth="1" />
      <circle cx="94" cy="60" r="8" fill="#3a2828" />
      <circle cx="130" cy="60" r="8" fill="#3a2828" />
      <circle cx="95" cy="58" r="4.5" fill="#1a0808" />
      <circle cx="131" cy="58" r="4.5" fill="#1a0808" />
      {/* Sparkle highlights */}
      <circle cx="98" cy="54" r="3.5" fill="white" />
      <circle cx="134" cy="54" r="3.5" fill="white" />
      <circle cx="92" cy="62" r="1.8" fill="white" opacity="0.6" />
      <circle cx="128" cy="62" r="1.8" fill="white" opacity="0.6" />

      {/* Eyebrows */}
      <path d={expr.browL} fill="none" stroke="#7a8a98" strokeWidth="2" strokeLinecap="round" />
      <path d={expr.browR} fill="none" stroke="#7a8a98" strokeWidth="2" strokeLinecap="round" />

      {/* Trunk — key feature! */}
      <path
        d={trunkD}
        fill="none"
        stroke="#8ba8b8"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={trunkD}
        fill="none"
        stroke="#96b2c0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mouth — below trunk */}
      <path d={expr.mouthD} fill="none" stroke="#7a8a98" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheek blush */}
      <circle cx="68" cy="68" r="10" fill="#d4a0a8" opacity="0.3" />
      <circle cx="152" cy="68" r="10" fill="#d4a0a8" opacity="0.3" />
    </svg>
  );
}
