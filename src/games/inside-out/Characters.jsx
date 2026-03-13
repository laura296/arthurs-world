// Inside Out Character SVG Illustrations — Premium Pixar-Quality
// Rich multi-layer gradients, detailed features, idle animations

// ─── JOY ─────────────────────────────────────────────────
export function Joy({ size = 120, expression = 'happy', glow = true, animate = false }) {
  const s = size;
  const uid = 'joy' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 200 280" width={s} height={s * 1.4}
         className={animate ? 'animate-io-joy-bounce' : ''}>
      <defs>
        <radialGradient id={`${uid}-glow`}><stop offset="0%" stopColor="#facc15" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" /><stop offset="40%" stopColor="#fde047" /><stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" /><stop offset="50%" stopColor="white" stopOpacity="0" /><stop offset="100%" stopColor="#92400e" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={`${uid}-cheek`}><stop offset="0%" stopColor="#fb923c" stopOpacity="0.45" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <linearGradient id={`${uid}-hair1`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" /></linearGradient>
        <linearGradient id={`${uid}-hair2`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="60%" stopColor="#1e40af" /><stop offset="100%" stopColor="#1e3a5f" /></radialGradient>
        <radialGradient id={`${uid}-face`} cx="45%" cy="40%"><stop offset="0%" stopColor="#fef9c3" /><stop offset="100%" stopColor="#fde047" /></radialGradient>
        <filter id={`${uid}-glow-f`}><feGaussianBlur stdDeviation="6" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Glow aura */}
      {glow && (
        <ellipse cx="100" cy="160" rx="90" ry="125" fill={`url(#${uid}-glow)`} opacity="0.25">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="85;95;85" dur="3s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Star-shaped hair decoration */}
      <g transform="translate(100,42)">
        <polygon points="0,-42 9,-16 36,-22 16,-3 24,24 0,11 -24,24 -16,-3 -36,-22 -9,-16" fill={`url(#${uid}-hair1)`}>
          <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite" />
        </polygon>
        <polygon points="0,-36 7,-14 29,-18 13,-3 19,18 0,9 -19,18 -13,-3 -29,-18 -7,-14" fill={`url(#${uid}-hair2)`} />
        {/* Star sparkle */}
        <circle cx="0" cy="-30" r="3" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Hair - blue flowing strands */}
      <path d="M52,95 Q46,48 68,32 Q82,22 100,27 Q118,22 132,32 Q154,48 148,95 Z" fill={`url(#${uid}-hair1)`} />
      <path d="M58,90 Q54,52 72,38 Q86,28 100,33 Q114,28 128,38 Q146,52 142,90 Z" fill={`url(#${uid}-hair2)`} />
      {/* Hair highlight strand */}
      <path d="M75,42 Q80,55 78,75" fill="none" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <path d="M120,40 Q125,55 122,72" fill="none" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Body - golden dress with depth */}
      <ellipse cx="100" cy="185" rx="44" ry="68" fill={`url(#${uid}-body)`}>
        <animate attributeName="ry" values="68;69;68" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="100" cy="185" rx="44" ry="68" fill={`url(#${uid}-body-hi)`} />

      {/* Dress sparkle details - scattered */}
      {[[82,162],[118,168],[90,188],[110,195],[78,210],[122,202],[95,220],[105,175],[88,148],[115,152]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1 + Math.random()} fill="white" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
        </circle>
      ))}

      {/* Face */}
      <ellipse cx="100" cy="105" rx="40" ry="37" fill={`url(#${uid}-face)`} />

      {/* Eyes - large, sparkly, detailed */}
      {/* Left eye */}
      <ellipse cx="82" cy="100" rx="12" ry="14" fill="white" />
      <ellipse cx="82" cy="100" rx="12" ry="14" fill="white" stroke="#eab30833" strokeWidth="1" />
      <ellipse cx="84" cy="99" rx="7" ry="8" fill={`url(#${uid}-iris)`} />
      <circle cx="84" cy="99" r="4" fill="#0c1e4a" />
      <circle cx="87" cy="96" r="2.5" fill="white" />
      <circle cx="81" cy="102" r="1.2" fill="white" opacity="0.6" />
      {/* Left eyelashes */}
      <line x1="72" y1="90" x2="70" y2="86" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="76" y1="88" x2="75" y2="84" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="87" x2="80" y2="83" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />

      {/* Right eye */}
      <ellipse cx="118" cy="100" rx="12" ry="14" fill="white" />
      <ellipse cx="118" cy="100" rx="12" ry="14" fill="white" stroke="#eab30833" strokeWidth="1" />
      <ellipse cx="120" cy="99" rx="7" ry="8" fill={`url(#${uid}-iris)`} />
      <circle cx="120" cy="99" r="4" fill="#0c1e4a" />
      <circle cx="123" cy="96" r="2.5" fill="white" />
      <circle cx="117" cy="102" r="1.2" fill="white" opacity="0.6" />
      {/* Right eyelashes */}
      <line x1="128" y1="90" x2="130" y2="86" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="124" y1="88" x2="125" y2="84" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="120" y1="87" x2="120" y2="83" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />

      {/* Nose - subtle */}
      <path d="M98,108 Q100,111 102,108" fill="none" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Cheeks - warm glow */}
      <ellipse cx="68" cy="112" rx="10" ry="6" fill={`url(#${uid}-cheek)`} />
      <ellipse cx="132" cy="112" rx="10" ry="6" fill={`url(#${uid}-cheek)`} />

      {/* Mouth */}
      {expression === 'happy' && (
        <g>
          <path d="M78,116 Q100,138 122,116" fill="#fbbf24" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <path d="M83,118 Q100,130 117,118" fill="white" opacity="0.9" />
        </g>
      )}
      {expression === 'worried' && (
        <ellipse cx="100" cy="119" rx="9" ry="6" fill="#92400e" />
      )}
      {expression === 'excited' && (
        <g>
          <path d="M76,114 Q100,142 124,114" fill="#fbbf24" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <path d="M82,117 Q100,134 118,117" fill="white" opacity="0.9" />
        </g>
      )}
      {expression === 'determined' && (
        <path d="M84,118 Q100,126 116,118" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Arms with hands */}
      <path d="M56,168 Q38,152 32,136" fill="none" stroke="#eab308" strokeWidth="9" strokeLinecap="round" />
      <circle cx="30" cy="134" r="6" fill="#fde047" />
      <path d="M144,168 Q162,152 168,136" fill="none" stroke="#eab308" strokeWidth="9" strokeLinecap="round" />
      <circle cx="170" cy="134" r="6" fill="#fde047" />

      {/* Legs */}
      <path d="M84,248 L79,272" stroke="#eab308" strokeWidth="8" strokeLinecap="round" />
      <path d="M116,248 L121,272" stroke="#eab308" strokeWidth="8" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="77" cy="274" rx="10" ry="4" fill="#ca8a04" />
      <ellipse cx="123" cy="274" rx="10" ry="4" fill="#ca8a04" />

      {/* Floating sparkles around Joy */}
      {glow && [
        [45, 70, 1.8], [155, 80, 1.5], [40, 140, 2], [160, 130, 1.2],
        [55, 210, 1.6], [145, 220, 1.4], [35, 180, 1], [165, 170, 1.8]
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#facc15">
          <animate attributeName="opacity" values="0;0.8;0" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
        </circle>
      ))}
    </svg>
  );
}

// ─── SADNESS ─────────────────────────────────────────────
export function Sadness({ size = 120, expression = 'sad', animate = false }) {
  const s = size;
  const uid = 'sad' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 200 260" width={s} height={s * 1.3}
         className={animate ? 'animate-io-sadness-sway' : ''}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" /><stop offset="50%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" /><stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="45%" cy="40%"><stop offset="0%" stopColor="#bfdbfe" /><stop offset="100%" stopColor="#93c5fd" /></radialGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="60%" stopColor="#1e3a5f" /><stop offset="100%" stopColor="#0f172a" /></radialGradient>
      </defs>

      {/* Body - round, cozy sweater */}
      <ellipse cx="100" cy="178" rx="52" ry="62" fill={`url(#${uid}-body)`}>
        <animate attributeName="rx" values="52;53;52" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="100" cy="178" rx="52" ry="62" fill={`url(#${uid}-body-hi)`} />
      {/* Sweater texture lines */}
      {[155,165,175,185,195].map((y,i) => (
        <line key={i} x1={58+i*2} y1={y} x2={142-i*2} y2={y} stroke="#3b82f6" strokeWidth="0.8" opacity="0.2" />
      ))}
      {/* Turtleneck */}
      <rect x="70" y="128" width="60" height="22" rx="11" fill="#3b82f6" />
      <rect x="72" y="130" width="56" height="18" rx="9" fill="#60a5fa" opacity="0.4" />

      {/* Head - round, droopy */}
      <circle cx="100" cy="100" r="44" fill={`url(#${uid}-face)`} />
      {/* Hair */}
      <path d="M56,95 Q54,52 100,48 Q146,52 144,95" fill="#2563eb" />
      <path d="M60,90 Q60,58 100,54 Q140,58 140,90" fill="#3b82f6" />
      {/* Hair highlight */}
      <path d="M85,56 Q90,65 88,78" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Glasses - thick round frames */}
      <circle cx="82" cy="102" r="16" fill="none" stroke="#1e3a5f" strokeWidth="3" />
      <circle cx="118" cy="102" r="16" fill="none" stroke="#1e3a5f" strokeWidth="3" />
      <line x1="98" y1="102" x2="102" y2="102" stroke="#1e3a5f" strokeWidth="2.5" />
      <line x1="66" y1="100" x2="58" y2="97" stroke="#1e3a5f" strokeWidth="2" />
      <line x1="134" y1="100" x2="142" y2="97" stroke="#1e3a5f" strokeWidth="2" />
      {/* Lens glare */}
      <ellipse cx="76" cy="96" rx="4" ry="3" fill="white" opacity="0.15" transform="rotate(-20 76 96)" />
      <ellipse cx="112" cy="96" rx="4" ry="3" fill="white" opacity="0.15" transform="rotate(-20 112 96)" />

      {/* Eyes behind glasses — droopy */}
      <ellipse cx="82" cy="104" rx="8" ry="9" fill="white" />
      <ellipse cx="118" cy="104" rx="8" ry="9" fill="white" />
      <ellipse cx="83" cy="106" rx="5" ry="5.5" fill={`url(#${uid}-iris)`} />
      <ellipse cx="119" cy="106" rx="5" ry="5.5" fill={`url(#${uid}-iris)`} />
      <circle cx="85" cy="104" r="1.8" fill="white" />
      <circle cx="121" cy="104" r="1.8" fill="white" />
      {/* Droopy eyelids */}
      <path d="M74,98 Q82,95 90,98" fill={`url(#${uid}-face)`} stroke={`url(#${uid}-face)`} strokeWidth="1" />
      <path d="M110,98 Q118,95 126,98" fill={`url(#${uid}-face)`} stroke={`url(#${uid}-face)`} strokeWidth="1" />

      {/* Mouth */}
      {expression === 'sad' && (
        <path d="M84,124 Q100,116 116,124" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'neutral' && (
        <line x1="87" y1="121" x2="113" y2="121" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'crying' && (
        <g>
          <path d="M84,124 Q100,116 116,124" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tear drops */}
          <ellipse cx="72" cy="118" rx="3" ry="5" fill="#93c5fd" opacity="0.7">
            <animate attributeName="cy" values="118;135;118" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="128" cy="120" rx="2.5" ry="4" fill="#93c5fd" opacity="0.6">
            <animate attributeName="cy" values="120;138;120" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          </ellipse>
        </g>
      )}

      {/* Arms */}
      <path d="M48,168 Q32,158 28,145" fill="none" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
      <circle cx="26" cy="143" r="5.5" fill="#93c5fd" />
      <path d="M152,168 Q168,158 172,145" fill="none" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
      <circle cx="174" cy="143" r="5.5" fill="#93c5fd" />

      {/* Legs */}
      <path d="M80,234 L76,254" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
      <path d="M120,234 L124,254" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

// ─── ANGER ───────────────────────────────────────────────
export function Anger({ size = 120, expression = 'angry', flameOn = true, animate = false }) {
  const s = size;
  const uid = 'ang' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 200 260" width={s} height={s * 1.3}
         className={animate ? 'animate-io-anger-shake' : ''}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fca5a5" /><stop offset="30%" stopColor="#ef4444" /><stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" /><stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id={`${uid}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" /><stop offset="30%" stopColor="#f97316" /><stop offset="60%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id={`${uid}-flame2`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" /><stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="50%" cy="40%"><stop offset="0%" stopColor="#fecaca" /><stop offset="100%" stopColor="#fca5a5" /></radialGradient>
      </defs>

      {/* Fire on head — multi-layer animated flames */}
      {flameOn && (
        <g>
          {/* Outer flame */}
          <path d="M65,68 Q70,15 88,32 Q92,5 105,28 Q112,0 122,35 Q138,18 132,68" fill={`url(#${uid}-flame)`} opacity="0.85">
            <animate attributeName="d"
              values="M65,68 Q70,15 88,32 Q92,5 105,28 Q112,0 122,35 Q138,18 132,68;M65,68 Q73,20 86,35 Q94,8 107,30 Q110,3 124,33 Q135,22 132,68;M65,68 Q70,15 88,32 Q92,5 105,28 Q112,0 122,35 Q138,18 132,68"
              dur="0.5s" repeatCount="indefinite" />
          </path>
          {/* Inner flame */}
          <path d="M75,68 Q78,30 93,38 Q96,18 107,35 Q118,25 125,68" fill={`url(#${uid}-flame2)`} opacity="0.7">
            <animate attributeName="d"
              values="M75,68 Q78,30 93,38 Q96,18 107,35 Q118,25 125,68;M75,68 Q80,35 91,40 Q98,22 109,37 Q116,28 125,68;M75,68 Q78,30 93,38 Q96,18 107,35 Q118,25 125,68"
              dur="0.4s" repeatCount="indefinite" />
          </path>
          {/* Embers */}
          {[[80,30],[105,20],[120,35],[90,15]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#fbbf24" opacity="0.6">
              <animate attributeName="cy" values={`${y};${y-25};${y}`} dur={`${0.8+i*0.2}s`} repeatCount="indefinite" begin={`${i*0.2}s`} />
              <animate attributeName="opacity" values="0.8;0;0.8" dur={`${0.8+i*0.2}s`} repeatCount="indefinite" begin={`${i*0.2}s`} />
            </circle>
          ))}
        </g>
      )}

      {/* Body - brick-shaped, solid */}
      <rect x="52" y="65" width="96" height="115" rx="14" fill={`url(#${uid}-body)`} />
      <rect x="52" y="65" width="96" height="115" rx="14" fill={`url(#${uid}-body-hi)`} />
      {/* Brick texture lines */}
      <line x1="56" y1="100" x2="144" y2="100" stroke="#b91c1c" strokeWidth="0.8" opacity="0.3" />
      <line x1="56" y1="130" x2="144" y2="130" stroke="#b91c1c" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="100" x2="100" y2="130" stroke="#b91c1c" strokeWidth="0.8" opacity="0.2" />
      <line x1="75" y1="130" x2="75" y2="160" stroke="#b91c1c" strokeWidth="0.8" opacity="0.2" />
      <line x1="125" y1="130" x2="125" y2="160" stroke="#b91c1c" strokeWidth="0.8" opacity="0.2" />

      {/* Face area */}
      <rect x="58" y="70" width="84" height="62" rx="10" fill={`url(#${uid}-face)`} />

      {/* Angry eyebrows — thick, angled */}
      <path d="M68,82 L90,90" stroke="#7f1d1d" strokeWidth="5" strokeLinecap="round" />
      <path d="M132,82 L110,90" stroke="#7f1d1d" strokeWidth="5" strokeLinecap="round" />

      {/* Eyes - small, intense, fiery */}
      <ellipse cx="83" cy="97" rx="8" ry="7" fill="white" />
      <ellipse cx="117" cy="97" rx="8" ry="7" fill="white" />
      <circle cx="85" cy="97" r="4.5" fill="#1c1917" />
      <circle cx="119" cy="97" r="4.5" fill="#1c1917" />
      <circle cx="87" cy="95" r="1.5" fill="white" />
      <circle cx="121" cy="95" r="1.5" fill="white" />
      {/* Veins when angry */}
      {expression === 'angry' && (
        <g opacity="0.3" stroke="#ef4444" strokeWidth="0.8">
          <path d="M70,76 L75,80 L72,85" fill="none" />
          <path d="M130,76 L125,80 L128,85" fill="none" />
        </g>
      )}

      {/* Mouth */}
      {expression === 'angry' && (
        <g>
          <path d="M78,116 L88,112 L100,118 L112,112 L122,116" fill="none" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
          {/* Teeth peeking */}
          <rect x="90" y="112" width="5" height="4" rx="1" fill="white" opacity="0.7" />
          <rect x="98" y="113" width="5" height="4" rx="1" fill="white" opacity="0.7" />
          <rect x="106" y="112" width="5" height="4" rx="1" fill="white" opacity="0.7" />
        </g>
      )}
      {expression === 'cool' && (
        <path d="M82,116 Q100,108 118,116" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'erupting' && (
        <g>
          <path d="M75,113 Q100,125 125,113" fill="#7f1d1d" stroke="#7f1d1d" strokeWidth="2" />
          <rect x="85" y="110" width="6" height="5" rx="1" fill="white" />
          <rect x="94" y="111" width="6" height="5" rx="1" fill="white" />
          <rect x="103" y="110" width="6" height="5" rx="1" fill="white" />
          <rect x="112" y="111" width="5" height="4" rx="1" fill="white" />
        </g>
      )}

      {/* Tie with stripes */}
      <polygon points="100,132 91,146 100,162 109,146" fill="#7f1d1d" />
      <line x1="94" y1="140" x2="106" y2="140" stroke="#991b1b" strokeWidth="1" opacity="0.4" />
      <line x1="93" y1="148" x2="107" y2="148" stroke="#991b1b" strokeWidth="1" opacity="0.4" />

      {/* Arms - stubby but strong */}
      <path d="M52,100 Q34,94 26,82" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
      <circle cx="24" cy="80" r="6" fill="#ef4444" />
      <path d="M148,100 Q166,94 174,82" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
      <circle cx="176" cy="80" r="6" fill="#ef4444" />

      {/* Legs */}
      <rect x="70" y="180" width="18" height="32" rx="7" fill="#dc2626" />
      <rect x="112" y="180" width="18" height="32" rx="7" fill="#dc2626" />
      {/* Shoes */}
      <ellipse cx="79" cy="215" rx="16" ry="7" fill="#7f1d1d" />
      <ellipse cx="121" cy="215" rx="16" ry="7" fill="#7f1d1d" />
    </svg>
  );
}

// ─── FEAR ────────────────────────────────────────────────
export function Fear({ size = 120, expression = 'scared', animate = false }) {
  const s = size;
  const uid = 'fear' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 160 300" width={s * 0.8} height={s * 1.5}
         className={animate ? 'animate-io-fear-tremble' : ''}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" /><stop offset="40%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" /><stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="45%" cy="38%"><stop offset="0%" stopColor="#e9d5ff" /><stop offset="100%" stopColor="#c4b5fd" /></radialGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%"><stop offset="0%" stopColor="#c084fc" /><stop offset="60%" stopColor="#4c1d95" /><stop offset="100%" stopColor="#1e1b4b" /></radialGradient>
      </defs>

      {/* Body - tall and thin, nervous */}
      <ellipse cx="80" cy="188" rx="30" ry="72" fill={`url(#${uid}-body)`}>
        <animate attributeName="rx" values="30;31;30" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="80" cy="188" rx="30" ry="72" fill={`url(#${uid}-body-hi)`} />

      {/* Head - tall oval */}
      <ellipse cx="80" cy="80" rx="32" ry="44" fill={`url(#${uid}-face)`} />

      {/* Single hair curl */}
      <path d="M80,36 Q88,12 76,16 Q62,22 68,36" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="d" values="M80,36 Q88,12 76,16 Q62,22 68,36;M80,36 Q86,14 74,18 Q64,24 70,36;M80,36 Q88,12 76,16 Q62,22 68,36" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Eyes - HUGE, terrified */}
      <ellipse cx="66" cy="78" rx="14" ry="16" fill="white" />
      <ellipse cx="94" cy="78" rx="14" ry="16" fill="white" />
      <ellipse cx="68" cy="80" rx="6" ry="7" fill={`url(#${uid}-iris)`} />
      <ellipse cx="96" cy="80" rx="6" ry="7" fill={`url(#${uid}-iris)`} />
      <circle cx="68" cy="80" r="3" fill="#1e1b4b" />
      <circle cx="96" cy="80" r="3" fill="#1e1b4b" />
      {/* Highlights */}
      <circle cx="72" cy="76" r="2" fill="white" />
      <circle cx="100" cy="76" r="2" fill="white" />
      <circle cx="65" cy="83" r="1" fill="white" opacity="0.5" />
      <circle cx="93" cy="83" r="1" fill="white" opacity="0.5" />

      {/* Eyebrows - raised VERY high */}
      <path d="M52,56 Q66,46 80,54" fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80,54 Q94,46 108,56" fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M78,92 Q80,96 82,92" fill="none" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

      {/* Mouth */}
      {expression === 'scared' && (
        <ellipse cx="80" cy="105" rx="7" ry="9" fill="#4c1d95" />
      )}
      {expression === 'nervous' && (
        <path d="M72,103 Q76,100 80,103 Q84,106 88,103" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Bow tie */}
      <polygon points="80,126 68,118 68,134" fill="#ddd6fe" />
      <polygon points="80,126 92,118 92,134" fill="#ddd6fe" />
      <circle cx="80" cy="126" r="4" fill="#7c3aed" />

      {/* Arms - thin, held up nervously */}
      <path d="M50,168 Q32,145 38,125" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
      <circle cx="37" cy="123" r="4" fill="#c4b5fd" />
      <path d="M110,168 Q128,145 122,125" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
      <circle cx="123" cy="123" r="4" fill="#c4b5fd" />

      {/* Legs - very thin */}
      <path d="M70,255 L67,290" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
      <path d="M90,255 L93,290" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// ─── DISGUST ─────────────────────────────────────────────
export function Disgust({ size = 120, expression = 'unimpressed', animate = false }) {
  const s = size;
  const uid = 'disg' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 200 270" width={s} height={s * 1.35}
         className={animate ? 'animate-io-breathe' : ''}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" /><stop offset="40%" stopColor="#4ade80" /><stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" /><stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="45%" cy="38%"><stop offset="0%" stopColor="#dcfce7" /><stop offset="100%" stopColor="#86efac" /></radialGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%"><stop offset="0%" stopColor="#86efac" /><stop offset="60%" stopColor="#14532d" /><stop offset="100%" stopColor="#052e16" /></radialGradient>
      </defs>

      {/* Body - slim, fashionable */}
      <ellipse cx="100" cy="188" rx="40" ry="60" fill={`url(#${uid}-body)`} />
      <ellipse cx="100" cy="188" rx="40" ry="60" fill={`url(#${uid}-body-hi)`} />

      {/* Head */}
      <ellipse cx="100" cy="95" rx="37" ry="40" fill={`url(#${uid}-face)`} />

      {/* Hair - styled, flowing with volume */}
      <path d="M63,88 Q56,46 78,40 Q92,36 100,42 Q108,36 122,40 Q144,46 137,88" fill="#16a34a" />
      <path d="M67,84 Q62,52 82,45 Q94,42 100,46 Q106,42 118,45 Q138,52 133,84" fill="#22c55e" />
      {/* Hair flip */}
      <path d="M137,78 Q148,68 144,55" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
      <path d="M138,76 Q146,68 143,58" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      {/* Hair highlight */}
      <path d="M88,48 Q92,58 90,72" fill="none" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Eyelashes - glamorous */}
      <line x1="71" y1="80" x2="67" y2="75" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="78" x2="73" y2="73" stroke="#14532d" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="81" y1="77" x2="80" y2="72" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="119" y1="77" x2="120" y2="72" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="124" y1="78" x2="127" y2="73" stroke="#14532d" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="129" y1="80" x2="133" y2="75" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />

      {/* Eyes - half-lidded, sassy, detailed */}
      <ellipse cx="84" cy="92" rx="10" ry="8" fill="white" />
      <ellipse cx="116" cy="92" rx="10" ry="8" fill="white" />
      <ellipse cx="84" cy="93" rx="5" ry="6" fill={`url(#${uid}-iris)`} />
      <ellipse cx="116" cy="93" rx="5" ry="6" fill={`url(#${uid}-iris)`} />
      <circle cx="86" cy="91" r="1.8" fill="white" />
      <circle cx="118" cy="91" r="1.8" fill="white" />
      {/* Half-lids */}
      <path d="M74,87 Q84,83 94,87" fill={`url(#${uid}-face)`} />
      <path d="M106,87 Q116,83 126,87" fill={`url(#${uid}-face)`} />

      {/* Nose */}
      <path d="M98,102 Q100,105 102,102" fill="none" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

      {/* Mouth */}
      {expression === 'unimpressed' && (
        <path d="M88,114 Q100,110 112,114" fill="none" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'disgusted' && (
        <g>
          <path d="M86,113 Q100,108 114,113" fill="none" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M94,116 Q100,114 106,116" fill="none" stroke="#14532d" strokeWidth="1.5" opacity="0.5" />
        </g>
      )}

      {/* Scarf */}
      <path d="M63,132 Q100,148 137,132" fill="#15803d" />
      <path d="M63,132 Q100,145 137,132" fill="#16a34a" opacity="0.5" />
      <path d="M127,134 L132,158 L122,155" fill="#15803d" />

      {/* Arms */}
      <path d="M60,175 Q42,162 38,145" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
      <circle cx="36" cy="143" r="5" fill="#4ade80" />
      <path d="M140,175 Q158,162 162,145" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
      <circle cx="164" cy="143" r="5" fill="#4ade80" />

      {/* Legs */}
      <path d="M84,242 L80,264" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" />
      <path d="M116,242 L120,264" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" />
      {/* Stylish shoes */}
      <ellipse cx="78" cy="267" rx="13" ry="5" fill="#15803d" />
      <ellipse cx="122" cy="267" rx="13" ry="5" fill="#15803d" />
      <path d="M66,267 L72,264" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M134,267 L128,264" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── ANXIETY ─────────────────────────────────────────────
export function Anxiety({ size = 120, expression = 'nervous', sparks = true, animate = false }) {
  const s = size;
  const uid = 'anx' + Math.random().toString(36).slice(2, 6);
  return (
    <svg viewBox="0 0 200 280" width={s} height={s * 1.4}
         className={animate ? 'animate-io-anxiety-jitter' : ''}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99f6e4" /><stop offset="40%" stopColor="#5eead4" /><stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={`${uid}-body-hi`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" /><stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="45%" cy="38%"><stop offset="0%" stopColor="#ccfbf1" /><stop offset="100%" stopColor="#99f6e4" /></radialGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%"><stop offset="0%" stopColor="#5eead4" /><stop offset="60%" stopColor="#134e4a" /><stop offset="100%" stopColor="#042f2e" /></radialGradient>
      </defs>

      {/* Nervous energy sparks — orbiting, erratic */}
      {sparks && (
        <g>
          {[[42,75,0],[158,82,0.3],[38,130,0.6],[162,125,0.9],[50,55,1.2],[150,60,1.5],[35,100,0.15],[165,105,0.45]].map(([x,y,d],i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x + (x > 100 ? 12 : -12)} y2={y - 10}
                    stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="opacity" values="0;1;0" dur={`${0.6 + i * 0.1}s`} repeatCount="indefinite" begin={`${d}s`} />
              </line>
              <circle cx={x + (x > 100 ? 14 : -14)} cy={y - 12} r="1.5" fill="#fbbf24">
                <animate attributeName="opacity" values="0;0.8;0" dur={`${0.6 + i * 0.1}s`} repeatCount="indefinite" begin={`${d}s`} />
              </circle>
            </g>
          ))}
        </g>
      )}

      {/* Body - teal, slightly hunched */}
      <ellipse cx="100" cy="188" rx="42" ry="62" fill={`url(#${uid}-body)`}>
        <animate attributeName="ry" values="62;63;62" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="100" cy="188" rx="42" ry="62" fill={`url(#${uid}-body-hi)`} />
      {/* Static texture overlay */}
      {Array.from({length: 8}).map((_, i) => (
        <line key={i} x1={65 + i*3} y1={155 + i*8} x2={135 - i*3} y2={158 + i*8}
              stroke="#0d9488" strokeWidth="0.5" opacity="0.15" />
      ))}

      {/* Head */}
      <ellipse cx="100" cy="92" rx="40" ry="42" fill={`url(#${uid}-face)`} />

      {/* Messy hair - wild, spiky, animated */}
      <path d="M60,87 Q52,40 72,36 Q78,24 88,34 Q93,18 103,34 Q112,22 118,36 Q138,40 142,87" fill="#0d9488" />
      <path d="M64,82 Q58,46 76,40 Q82,30 90,38 Q96,24 106,38 Q114,28 120,40 Q136,46 136,82" fill="#14b8a6" />
      {/* Wild strand tips */}
      <path d="M66,65 Q56,48 62,38" fill="none" stroke="#0d9488" strokeWidth="5" strokeLinecap="round">
        <animate attributeName="d" values="M66,65 Q56,48 62,38;M66,65 Q58,50 64,40;M66,65 Q56,48 62,38" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M134,65 Q144,48 138,38" fill="none" stroke="#0d9488" strokeWidth="5" strokeLinecap="round">
        <animate attributeName="d" values="M134,65 Q144,48 138,38;M134,65 Q142,50 136,40;M134,65 Q144,48 138,38" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Hair highlight */}
      <path d="M92,32 Q96,42 94,56" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

      {/* Eyes - wide, jittery, panicked */}
      <ellipse cx="82" cy="90" rx="14" ry="16" fill="white" />
      <ellipse cx="118" cy="90" rx="14" ry="16" fill="white" />
      {/* Darting pupils */}
      <ellipse cx="84" cy="90" rx="5" ry="5.5" fill={`url(#${uid}-iris)`}>
        <animate attributeName="cx" values="82;86;84;80;84;86;82" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="120" cy="90" rx="5" ry="5.5" fill={`url(#${uid}-iris)`}>
        <animate attributeName="cx" values="118;122;120;116;120;122;118" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="84" cy="90" r="2.5" fill="#042f2e">
        <animate attributeName="cx" values="82;86;84;80;84;86;82" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="90" r="2.5" fill="#042f2e">
        <animate attributeName="cx" values="118;122;120;116;120;122;118" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Eye highlights */}
      <circle cx="87" cy="87" r="2" fill="white" />
      <circle cx="123" cy="87" r="2" fill="white" />
      {/* Eye bags */}
      <path d="M72,100 Q82,104 92,100" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.25" />
      <path d="M108,100 Q118,104 128,100" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.25" />

      {/* Eyebrows - raised, worried */}
      <path d="M68,72 Q82,63 96,72" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
      <path d="M104,72 Q118,63 132,72" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />

      {/* Mouth */}
      {expression === 'nervous' && (
        <path d="M80,114 Q86,110 92,114 Q98,118 104,114 Q110,110 116,114" fill="none" stroke="#134e4a" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {expression === 'panic' && (
        <g>
          <ellipse cx="100" cy="115" rx="12" ry="14" fill="#134e4a" />
          <rect x="92" y="108" width="4" height="5" rx="1" fill="white" opacity="0.6" />
          <rect x="98" y="107" width="4" height="5" rx="1" fill="white" opacity="0.6" />
          <rect x="104" y="108" width="4" height="5" rx="1" fill="white" opacity="0.6" />
        </g>
      )}

      {/* Arms - fidgeting */}
      <path d="M58,172 Q38,155 42,132" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" />
      <circle cx="41" cy="130" r="5" fill="#5eead4" />
      <path d="M142,172 Q162,155 158,132" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" />
      <circle cx="159" cy="130" r="5" fill="#5eead4" />

      {/* Legs */}
      <path d="M80,244 L76,270" stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" />
      <path d="M120,244 L124,270" stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

// ─── MEMORY ORB ──────────────────────────────────────────
export function MemoryOrb({ color = '#facc15', size = 60, glow = true, label, pulse = false }) {
  const s = size;
  const uid = 'orb' + color.replace('#', '');
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <defs>
        <radialGradient id={`${uid}-g`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="25%" stopColor={color} stopOpacity="0.9" />
          <stop offset="70%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={`${uid}-inner`} cx="55%" cy="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id={`${uid}-gf`}><feGaussianBlur stdDeviation="4" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Outer glow */}
      {glow && <circle cx="50" cy="50" r="44" fill={color} opacity="0.15" filter={`url(#${uid}-gf)`}>
        {pulse && <animate attributeName="r" values="40;48;40" dur="2s" repeatCount="indefinite" />}
        {pulse && <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />}
      </circle>}
      {/* Main sphere */}
      <circle cx="50" cy="50" r="36" fill={`url(#${uid}-g)`} />
      {/* Internal swirl */}
      <circle cx="55" cy="55" r="20" fill={`url(#${uid}-inner)`}>
        <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite" />
      </circle>
      {/* Glass highlight */}
      <ellipse cx="40" cy="38" rx="14" ry="9" fill="white" opacity="0.45" transform="rotate(-20 40 38)" />
      {/* Secondary highlight */}
      <ellipse cx="58" cy="62" rx="6" ry="4" fill="white" opacity="0.12" transform="rotate(15 58 62)" />
      {/* Surface shimmer */}
      <circle cx="35" cy="55" r="2" fill="white" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="6s" repeatCount="indefinite" />
      </circle>
      {label && (
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" opacity="0.9">{label}</text>
      )}
    </svg>
  );
}

// ─── CONSOLE BUTTON ──────────────────────────────────────
export function ConsoleButton({ color = '#facc15', size = 70, active = false, label, onClick }) {
  const uid = 'cb' + color.replace('#', '');
  return (
    <button onClick={onClick}
      className={`relative transition-all duration-150 ${active ? 'scale-95' : 'active:scale-90'}`}
      style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor={`${color}88`} />
          </linearGradient>
          <linearGradient id={`${uid}-hi`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" /><stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id={`${uid}-sh`}><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="black" floodOpacity="0.35" /></filter>
        </defs>
        {/* Button base */}
        <rect x="8" y="18" width="84" height="72" rx="14" fill="#0f0a2a" />
        {/* Button top */}
        <rect x="8" y="10" width="84" height="72" rx="14" fill={`url(#${uid}-bg)`} filter={`url(#${uid}-sh)`} />
        <rect x="8" y="10" width="84" height="72" rx="14" fill={`url(#${uid}-hi)`} />
        {/* Light indicator */}
        <circle cx="50" cy="36" r="14" fill={active ? '#fff' : `${color}33`} opacity={active ? 0.95 : 0.4}>
          {active && <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />}
          {active && <animate attributeName="r" values="12;15;12" dur="0.8s" repeatCount="indefinite" />}
        </circle>
        {/* Inner light glow */}
        {active && <circle cx="50" cy="36" r="20" fill={color} opacity="0.15">
          <animate attributeName="r" values="16;22;16" dur="0.8s" repeatCount="indefinite" />
        </circle>}
        {label && (
          <text x="50" y="64" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{label}</text>
        )}
      </svg>
    </button>
  );
}

// ─── PIPE ────────────────────────────────────────────────
export function Pipe({ heat = 50, width = 280, height = 40, onClick }) {
  const heatColor = heat > 80 ? '#ef4444' : heat > 60 ? '#f97316' : heat > 40 ? '#eab308' : heat > 20 ? '#22c55e' : '#3b82f6';
  const bubbleCount = Math.floor(heat / 18);
  const uid = 'pipe' + Math.round(heat) + Math.random().toString(36).slice(2,4);

  return (
    <button onClick={onClick} className="active:scale-[0.97] transition-transform" style={{ width, height: height + 16 }}>
      <svg viewBox={`0 0 ${width} ${height + 16}`} width={width} height={height + 16}>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset={`${Math.max(2, heat)}%`} stopColor={heatColor} />
            <stop offset={`${Math.max(2, heat)}%`} stopColor="#374151" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="40%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {/* Steam when hot */}
        {heat > 60 && Array.from({length: 3}).map((_, i) => (
          <ellipse key={i} cx={80 + i * 60} cy={4} rx={6 + heat * 0.05} ry={3} fill="white" opacity="0">
            <animate attributeName="cy" values="8;-15;-30" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="opacity" values="0;0.25;0" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="rx" values="4;10;16" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </ellipse>
        ))}
        {/* Pipe body */}
        <rect x="35" y="10" width={width - 70} height={height - 4} rx={height / 4} fill={`url(#${uid}-fill)`} />
        <rect x="35" y="10" width={width - 70} height={height - 4} rx={height / 4} fill={`url(#${uid}-sheen)`} />
        {/* End caps with rivets */}
        <rect x="8" y="7" width="34" height={height} rx="7" fill="#6b7280" />
        <rect x="8" y="7" width="34" height={height / 2} rx="7" fill="#9ca3af" opacity="0.2" />
        <circle cx="18" cy="15" r="2.5" fill="#4b5563" /><circle cx="32" cy="15" r="2.5" fill="#4b5563" />
        <circle cx="18" cy={height - 2} r="2.5" fill="#4b5563" /><circle cx="32" cy={height - 2} r="2.5" fill="#4b5563" />
        <rect x={width - 42} y="7" width="34" height={height} rx="7" fill="#6b7280" />
        <rect x={width - 42} y="7" width="34" height={height / 2} rx="7" fill="#9ca3af" opacity="0.2" />
        <circle cx={width - 32} cy="15" r="2.5" fill="#4b5563" /><circle cx={width - 18} cy="15" r="2.5" fill="#4b5563" />
        <circle cx={width - 32} cy={height - 2} r="2.5" fill="#4b5563" /><circle cx={width - 18} cy={height - 2} r="2.5" fill="#4b5563" />
        {/* Vent holes along top */}
        {[0,1,2,3].map(i => (
          <rect key={i} x={80 + i * 40} y="8" width="8" height="3" rx="1" fill="#1f2937" opacity="0.4" />
        ))}
        {/* Heat bubbles */}
        {Array.from({ length: bubbleCount }).map((_, i) => (
          <circle key={i} cx={55 + i * 38} cy={height / 2 + 6} r={3 + Math.random() * 4}
                  fill={heatColor} opacity={0.35 + Math.random() * 0.3}>
            <animate attributeName="cy" values={`${height / 2 + 6};${height / 2 - 4};${height / 2 + 6}`}
                     dur={`${0.4 + Math.random() * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.08}s`} />
          </circle>
        ))}
        {/* Temperature text */}
        <text x={width / 2} y={height / 2 + 10} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" opacity="0.85">
          {Math.round(heat)}°
        </text>
        {/* Heat shimmer above pipe */}
        {heat > 70 && (
          <path d={`M50,6 Q${width/4},2 ${width/2},6 Q${width*3/4},10 ${width-50},6`}
                fill="none" stroke="white" strokeWidth="0.5" opacity="0.1">
            <animate attributeName="d"
              values={`M50,6 Q${width/4},2 ${width/2},6 Q${width*3/4},10 ${width-50},6;M50,6 Q${width/4},10 ${width/2},6 Q${width*3/4},2 ${width-50},6;M50,6 Q${width/4},2 ${width/2},6 Q${width*3/4},10 ${width-50},6`}
              dur="1s" repeatCount="indefinite" />
          </path>
        )}
      </svg>
    </button>
  );
}

// ─── ALARM BUBBLE ────────────────────────────────────────
export function AlarmBubble({ emotion, color, size = 60, onPop }) {
  const uid = 'ab' + (color || '#fff').replace('#', '');
  const faces = {
    joy: { eyes: '◡ ◡', mouth: '‿' },
    sadness: { eyes: 'T T', mouth: '﹏' },
    anger: { eyes: '╬ ╬', mouth: '▃' },
    fear: { eyes: '⊙ ⊙', mouth: 'O' },
    disgust: { eyes: '¬ ¬', mouth: '‸' },
  };

  return (
    <button onPointerDown={onPop} className="active:scale-75 transition-transform duration-100"
            style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id={`${uid}-bg`} cx="35%" cy="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="40%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </radialGradient>
          <filter id={`${uid}-gl`}><feGaussianBlur stdDeviation="3" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* Outer glow ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2">
          <animate attributeName="r" values="44;48;44" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Main bubble */}
        <circle cx="50" cy="50" r="40" fill={`url(#${uid}-bg)`} filter={`url(#${uid}-gl)`}
                stroke={color} strokeWidth="1.5" strokeOpacity="0.4">
          <animate attributeName="r" values="39;41;39" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Glass highlight */}
        <ellipse cx="38" cy="36" rx="16" ry="10" fill="white" opacity="0.35" transform="rotate(-18 38 36)" />
        {/* Secondary glass */}
        <ellipse cx="62" cy="64" rx="6" ry="4" fill="white" opacity="0.1" />
        {/* Emotion face icon */}
        <text x="50" y="56" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" opacity="0.9">!</text>
      </svg>
    </button>
  );
}
