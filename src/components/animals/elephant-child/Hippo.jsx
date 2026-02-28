export default function Hippo({
  size = 160,
  className = '',
  expression = 'friendly',
}) {
  const isPointing = expression === 'pointing';

  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className={className}>
      <defs>
        <radialGradient id="hi-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#b0a0b0" />
          <stop offset="100%" stopColor="#9a8a9a" />
        </radialGradient>
        <radialGradient id="hi-belly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b4c4" />
          <stop offset="100%" stopColor="#b0a0b0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="110" cy="210" rx="58" ry="7" fill="#5a4a5a" opacity="0.18" />

      {/* Tail — short stubby */}
      <path d="M48 122 C36 118, 30 112, 32 108" fill="none" stroke="#9a8a9a" strokeWidth="5" strokeLinecap="round" />

      {/* Body — very round, barrel-shaped */}
      <path
        d="M48 132 C44 96, 68 76, 110 74 C152 76, 176 96, 172 132 C170 168, 152 182, 110 184 C68 182, 50 168, 48 132Z"
        fill="url(#hi-body)"
        stroke="#8a7a8a" strokeWidth="1.2"
      />

      {/* Belly highlight */}
      <ellipse cx="110" cy="152" rx="38" ry="24" fill="url(#hi-belly)" opacity="0.5" />

      {/* Legs — stubby and thick */}
      <path d="M72 172 C70 184, 68 196, 66 204 L82 206 C81 198, 80 186, 80 176Z" fill="#9a8a9a" stroke="#8a7a8a" strokeWidth="1" />
      <path d="M96 176 C95 188, 94 198, 93 206 L109 208 C108 200, 107 190, 106 180Z" fill="#9a8a9a" stroke="#8a7a8a" strokeWidth="1" />
      <path d="M116 176 C115 188, 114 198, 113 206 L129 208 C128 200, 127 190, 126 180Z" fill="#a496a4" stroke="#8a7a8a" strokeWidth="1" />
      {/* Right front leg — extended if pointing */}
      {isPointing ? (
        <path d="M146 168 C158 160, 170 156, 180 154 L184 166 C174 166, 162 170, 152 176Z" fill="#a496a4" stroke="#8a7a8a" strokeWidth="1" />
      ) : (
        <path d="M146 172 C145 184, 144 196, 142 204 L158 206 C157 198, 156 186, 154 176Z" fill="#a496a4" stroke="#8a7a8a" strokeWidth="1" />
      )}

      {/* Feet */}
      <ellipse cx="74" cy="206" rx="11" ry="5" fill="#8a7a8a" />
      <ellipse cx="101" cy="208" rx="11" ry="5" fill="#8a7a8a" />
      <ellipse cx="121" cy="208" rx="11" ry="5" fill="#8a7a8a" />
      {!isPointing && <ellipse cx="150" cy="206" rx="11" ry="5" fill="#8a7a8a" />}

      {/* Head — very large, round */}
      <circle cx="110" cy="58" r="46" fill="#9a8a9a" stroke="#8a7a8a" strokeWidth="1.2" />
      <circle cx="110" cy="54" r="38" fill="#a496a4" opacity="0.35" />

      {/* Ears — small, round, on top */}
      <ellipse cx="76" cy="24" rx="10" ry="12" fill="#9a8a9a" stroke="#8a7a8a" strokeWidth="1" />
      <ellipse cx="76" cy="24" rx="6" ry="8" fill="#b89898" opacity="0.4" />
      <ellipse cx="144" cy="24" rx="10" ry="12" fill="#9a8a9a" stroke="#8a7a8a" strokeWidth="1" />
      <ellipse cx="144" cy="24" rx="6" ry="8" fill="#b89898" opacity="0.4" />

      {/* Nostrils — on top of snout, hippo-style */}
      <ellipse cx="100" cy="44" rx="5" ry="4" fill="#7a6a7a" />
      <ellipse cx="120" cy="44" rx="5" ry="4" fill="#7a6a7a" />

      {/* Eyes — small for head size, wide apart */}
      <ellipse cx="88" cy="48" rx="10" ry="12" fill="white" stroke="#7a7a8a" strokeWidth="1" />
      <ellipse cx="132" cy="48" rx="10" ry="12" fill="white" stroke="#7a7a8a" strokeWidth="1" />
      <circle cx="90" cy="50" r="6" fill="#3a2828" />
      <circle cx="134" cy="50" r="6" fill="#3a2828" />
      <circle cx="91" cy="48" r="3.5" fill="#1a0808" />
      <circle cx="135" cy="48" r="3.5" fill="#1a0808" />
      {/* Sparkle highlights */}
      <circle cx="93" cy="45" r="3" fill="white" />
      <circle cx="137" cy="45" r="3" fill="white" />

      {/* Eyebrows */}
      <path d="M76 38 C82 34, 96 34, 102 38" fill="none" stroke="#7a6a7a" strokeWidth="2" strokeLinecap="round" />
      <path d="M118 38 C124 34, 140 34, 146 38" fill="none" stroke="#7a6a7a" strokeWidth="2" strokeLinecap="round" />

      {/* Mouth — BIG wide hippo smile */}
      <path
        d="M78 76 C90 88, 130 88, 142 76"
        fill="none" stroke="#7a6a7a" strokeWidth="3" strokeLinecap="round"
      />
      {/* Teeth — two big front teeth */}
      <rect x="102" y="76" width="6" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="0.5" />
      <rect x="112" y="76" width="6" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="0.5" />

      {/* Cheek blush */}
      <circle cx="68" cy="62" r="11" fill="#c8949c" opacity="0.3" />
      <circle cx="152" cy="62" r="11" fill="#c8949c" opacity="0.3" />
    </svg>
  );
}
