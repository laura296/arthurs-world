export default function MamaElephant({
  size = 200,
  className = '',
  expression = 'loving',
}) {
  const isWaving = expression === 'waving';

  return (
    <svg viewBox="0 0 260 260" width={size} height={size} className={className}>
      <defs>
        <radialGradient id="me-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#94a8b4" />
          <stop offset="100%" stopColor="#7e929e" />
        </radialGradient>
        <radialGradient id="me-belly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#acbec8" />
          <stop offset="100%" stopColor="#94a8b4" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="130" cy="248" rx="65" ry="8" fill="#4a5a5a" opacity="0.18" />

      {/* Tail */}
      <path d="M52 140 C38 132, 32 122, 36 114" fill="none" stroke="#7e929e" strokeWidth="5" strokeLinecap="round" />
      <circle cx="36" cy="112" r="5" fill="#6e828e" />

      {/* Body — larger, wider stance */}
      <path
        d="M56 152 C50 112, 78 86, 130 84 C182 86, 210 112, 204 152 C200 192, 180 210, 130 212 C80 210, 60 192, 56 152Z"
        fill="url(#me-body)"
        stroke="#6e828e" strokeWidth="1.5"
      />

      {/* Belly highlight */}
      <ellipse cx="130" cy="176" rx="40" ry="26" fill="url(#me-belly)" opacity="0.5" />

      {/* Legs — sturdier */}
      <path d="M82 198 C80 212, 78 228, 76 238 L92 240 C91 230, 90 214, 90 204Z" fill="#7e929e" stroke="#6e828e" strokeWidth="1" />
      <path d="M106 202 C105 216, 104 230, 103 240 L119 242 C118 232, 117 218, 116 206Z" fill="#7e929e" stroke="#6e828e" strokeWidth="1" />
      <path d="M142 202 C141 216, 140 230, 139 240 L155 242 C154 232, 153 218, 150 206Z" fill="#8a9ea8" stroke="#6e828e" strokeWidth="1" />
      {/* Right front leg — raised if waving */}
      {isWaving ? (
        <path d="M168 196 C176 184, 186 178, 192 174 L198 186 C192 188, 182 194, 176 202Z" fill="#8a9ea8" stroke="#6e828e" strokeWidth="1" />
      ) : (
        <path d="M168 198 C167 212, 166 228, 164 238 L180 240 C179 230, 178 214, 176 204Z" fill="#8a9ea8" stroke="#6e828e" strokeWidth="1" />
      )}

      {/* Feet */}
      <ellipse cx="84" cy="240" rx="11" ry="5.5" fill="#6e828e" />
      <ellipse cx="111" cy="242" rx="11" ry="5.5" fill="#6e828e" />
      <ellipse cx="147" cy="242" rx="11" ry="5.5" fill="#6e828e" />
      {!isWaving && <ellipse cx="172" cy="240" rx="11" ry="5.5" fill="#6e828e" />}

      {/* Head — large */}
      <circle cx="130" cy="68" r="50" fill="#7e929e" stroke="#6e828e" strokeWidth="1.2" />
      <circle cx="130" cy="64" r="42" fill="#8a9ea8" opacity="0.35" />

      {/* Ears — large floppy */}
      <path d="M86 42 C52 8, 24 22, 34 56 C38 74, 60 80, 80 66Z" fill="#7e929e" stroke="#6e828e" strokeWidth="1" />
      <path d="M76 44 C56 18, 40 28, 46 54 C48 64, 62 68, 72 58Z" fill="#b0949c" opacity="0.45" />
      <path d="M174 42 C208 8, 236 22, 226 56 C222 74, 200 80, 180 66Z" fill="#7e929e" stroke="#6e828e" strokeWidth="1" />
      <path d="M184 44 C204 18, 220 28, 214 54 C212 64, 198 68, 188 58Z" fill="#b0949c" opacity="0.45" />

      {/* Eyes — gentle, slightly narrower */}
      <ellipse cx="112" cy="62" rx="12" ry="14" fill="white" stroke="#7a8a98" strokeWidth="1" />
      <ellipse cx="148" cy="62" rx="12" ry="14" fill="white" stroke="#7a8a98" strokeWidth="1" />
      <circle cx="114" cy="64" r="7" fill="#3a2828" />
      <circle cx="150" cy="64" r="7" fill="#3a2828" />
      <circle cx="115" cy="62" r="4" fill="#1a0808" />
      <circle cx="151" cy="62" r="4" fill="#1a0808" />
      <circle cx="117" cy="58" r="3" fill="white" />
      <circle cx="153" cy="58" r="3" fill="white" />

      {/* Eyebrows — gentle */}
      <path d="M98 50 C104 46, 120 46, 126 50" fill="none" stroke="#6a7a88" strokeWidth="2" strokeLinecap="round" />
      <path d="M134 50 C140 46, 156 46, 162 50" fill="none" stroke="#6a7a88" strokeWidth="2" strokeLinecap="round" />

      {/* Trunk — always long, graceful S-curve */}
      <path
        d="M130 86 C134 100, 142 120, 148 140 C154 155, 148 170, 138 175 C130 178, 122 172, 126 164"
        fill="none" stroke="#7e929e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M130 86 C134 100, 142 120, 148 140 C154 155, 148 170, 138 175 C130 178, 122 172, 126 164"
        fill="none" stroke="#8a9ea8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Mouth — warm smile */}
      <path
        d={expression === 'loving'
          ? 'M114 120 C122 128, 138 128, 146 120'
          : 'M116 118 C124 126, 136 126, 144 118'}
        fill="none" stroke="#6a7a88" strokeWidth="2.5" strokeLinecap="round"
      />

      {/* Cheek blush */}
      <circle cx="86" cy="72" r="11" fill="#c4949c" opacity="0.25" />
      <circle cx="174" cy="72" r="11" fill="#c4949c" opacity="0.25" />

      {/* Small crown/flower on head — mama detail */}
      <circle cx="130" cy="22" r="6" fill="#facc15" opacity="0.7" />
      <circle cx="122" cy="26" r="4" fill="#f472b6" opacity="0.6" />
      <circle cx="138" cy="26" r="4" fill="#f472b6" opacity="0.6" />
    </svg>
  );
}
