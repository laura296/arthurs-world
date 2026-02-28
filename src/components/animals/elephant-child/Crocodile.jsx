export default function Crocodile({
  size = 160,
  className = '',
  expression = 'sneaky',
  visibility = 'full',
}) {
  const isEyesOnly = visibility === 'eyes-only';
  const isHalf = visibility === 'half';

  // Expression-driven attributes
  const eyeH = expression === 'biting' ? 10 : expression === 'fleeing' ? 12 : 7;
  const mouthOpen = expression === 'biting';
  const scaredEyes = expression === 'fleeing';

  return (
    <svg viewBox="0 0 280 180" width={size} height={size * (180 / 280)} className={className}>
      <defs>
        <radialGradient id="cr-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7aaa7a" />
          <stop offset="100%" stopColor="#5a8a5a" />
        </radialGradient>
      </defs>

      {/* Water line — shows when partially submerged */}
      {(isEyesOnly || isHalf) && (
        <rect x="0" y="70" width="280" height="110" fill="#4fc3f7" opacity="0.3" rx="4" />
      )}

      {/* Full body — only shown when visibility is 'full' */}
      {!isEyesOnly && !isHalf && (
        <g>
          {/* Ground shadow */}
          <ellipse cx="140" cy="168" rx="80" ry="6" fill="#3a5a3a" opacity="0.15" />

          {/* Tail */}
          <path d="M240 100 C260 95, 272 88, 276 78 C278 72, 274 68, 268 72 C262 78, 254 88, 240 94Z" fill="#5a8a5a" stroke="#4a7a4a" strokeWidth="1" />

          {/* Body — long and low */}
          <path
            d="M40 90 C38 78, 60 62, 140 60 C220 62, 250 78, 248 90 C250 112, 230 128, 140 130 C50 128, 38 112, 40 90Z"
            fill="url(#cr-body)" stroke="#4a7a4a" strokeWidth="1.2"
          />

          {/* Back ridges — bumpy */}
          {[60, 85, 110, 135, 160, 185, 210].map((x, i) => (
            <path key={i} d={`M${x} ${62 - i % 2 * 2} L${x + 6} 56 L${x + 12} ${62 - i % 2 * 2}`} fill="#4a7a4a" />
          ))}

          {/* Belly */}
          <ellipse cx="140" cy="105" rx="60" ry="18" fill="#8aba8a" opacity="0.5" />

          {/* Legs — short stubby */}
          <path d="M72 122 C70 134, 66 146, 62 154 L76 156 C76 148, 76 138, 78 128Z" fill="#5a8a5a" stroke="#4a7a4a" strokeWidth="1" />
          <path d="M106 126 C104 138, 102 148, 100 156 L114 158 C113 150, 112 140, 112 130Z" fill="#5a8a5a" stroke="#4a7a4a" strokeWidth="1" />
          <path d="M170 126 C168 138, 166 148, 164 156 L178 158 C177 150, 176 140, 176 130Z" fill="#6a9a6a" stroke="#4a7a4a" strokeWidth="1" />
          <path d="M208 122 C206 134, 204 146, 200 154 L214 156 C213 148, 212 138, 212 128Z" fill="#6a9a6a" stroke="#4a7a4a" strokeWidth="1" />

          {/* Motion lines if fleeing */}
          {expression === 'fleeing' && (
            <g stroke="#5a8a5a" strokeWidth="2" strokeLinecap="round" opacity="0.5">
              <line x1="260" y1="75" x2="275" y2="72" />
              <line x1="258" y1="90" x2="276" y2="90" />
              <line x1="260" y1="105" x2="275" y2="108" />
            </g>
          )}
        </g>
      )}

      {/* Half body — head + front */}
      {isHalf && (
        <g>
          <path
            d="M20 76 C20 62, 60 52, 120 50 C160 52, 180 60, 180 76 C180 90, 160 96, 120 98 C60 96, 20 90, 20 76Z"
            fill="url(#cr-body)" stroke="#4a7a4a" strokeWidth="1"
          />
          {[40, 65, 90, 115, 140, 160].map((x, i) => (
            <path key={i} d={`M${x} ${52 - i % 2 * 2} L${x + 5} 46 L${x + 10} ${52 - i % 2 * 2}`} fill="#4a7a4a" />
          ))}
        </g>
      )}

      {/* Head / snout — always visible */}
      <g>
        {/* Snout */}
        <path
          d="M10 66 C8 56, 30 42, 80 40 C110 40, 120 48, 120 60 C120 72, 100 78, 80 78 C30 78, 8 76, 10 66Z"
          fill="#5a8a5a" stroke="#4a7a4a" strokeWidth="1.2"
        />

        {/* Nostrils */}
        <circle cx="20" cy="55" r="3" fill="#3a6a3a" />
        <circle cx="30" cy="53" r="3" fill="#3a6a3a" />

        {/* Teeth — visible when biting */}
        {mouthOpen && (
          <g>
            <path d="M10 68 L120 68" fill="none" stroke="#4a7a4a" strokeWidth="1" />
            {[20, 35, 50, 65, 80, 95, 108].map((x, i) => (
              <path key={i} d={`M${x} 68 L${x + 4} 78 L${x + 8} 68`} fill="white" stroke="#ddd" strokeWidth="0.5" />
            ))}
            {[25, 42, 58, 74, 90, 104].map((x, i) => (
              <path key={i} d={`M${x} 66 L${x + 3} 58 L${x + 6} 66`} fill="white" stroke="#ddd" strokeWidth="0.5" />
            ))}
          </g>
        )}

        {/* Eyes — yellow-green with slit pupils */}
        <ellipse cx="82" cy={isEyesOnly ? 62 : 50} rx="12" ry={eyeH} fill="#c8d840" stroke="#5a7a3a" strokeWidth="1.2" />
        <ellipse cx="104" cy={isEyesOnly ? 62 : 50} rx="12" ry={eyeH} fill="#c8d840" stroke="#5a7a3a" strokeWidth="1.2" />
        {/* Slit pupils — narrow vertical */}
        <ellipse cx="82" cy={isEyesOnly ? 62 : 50} rx={scaredEyes ? 4 : 2} ry={eyeH - 2} fill="#1a2a0a" />
        <ellipse cx="104" cy={isEyesOnly ? 62 : 50} rx={scaredEyes ? 4 : 2} ry={eyeH - 2} fill="#1a2a0a" />
        {/* Eye highlight */}
        <circle cx="85" cy={isEyesOnly ? 58 : 46} r="2.5" fill="white" opacity="0.7" />
        <circle cx="107" cy={isEyesOnly ? 58 : 46} r="2.5" fill="white" opacity="0.7" />

        {/* Bumpy forehead — always visible */}
        <circle cx="90" cy={isEyesOnly ? 52 : 38} r="5" fill="#4a7a4a" opacity="0.3" />
        <circle cx="100" cy={isEyesOnly ? 50 : 36} r="4" fill="#4a7a4a" opacity="0.25" />
        <circle cx="80" cy={isEyesOnly ? 54 : 40} r="3.5" fill="#4a7a4a" opacity="0.2" />

        {/* Sneaky grin when sneaky */}
        {expression === 'sneaky' && (
          <path d="M30 70 C50 76, 80 78, 110 72" fill="none" stroke="#3a5a3a" strokeWidth="2" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
