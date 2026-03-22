/**
 * Pooh Bear — Winnie the Pooh character SVG component.
 * Warm, soft E.H. Shepard-inspired illustration style.
 *
 * Props:
 *   expression: 'happy' | 'excited' | 'thinking' | 'hungry' | 'sleepy'
 *   size: number (width in px, default 160)
 *   className: additional CSS classes
 *   mode: 'full' (head + body) | 'face' (head only, default 'full')
 *   showHoneyPot: boolean (show honey pot, default false)
 *   honeyLevel: 0-1 (fill level of honey pot)
 */
export default function PoohBear({
  expression = 'happy',
  size = 160,
  className = '',
  mode = 'full',
  showHoneyPot = false,
  honeyLevel = 0,
}) {
  const h = mode === 'full' ? size * 1.35 : size;
  const vb = mode === 'full' ? '0 0 160 216' : '0 0 160 100';

  return (
    <svg
      width={size}
      height={h}
      viewBox={vb}
      className={`select-none ${className}`}
      aria-label="Pooh Bear"
    >
      {mode === 'full' && <PoohBody expression={expression} showHoneyPot={showHoneyPot} honeyLevel={honeyLevel} />}
      <PoohHead expression={expression} yOffset={mode === 'full' ? 0 : -10} />
    </svg>
  );
}

/* ── Head ── */
function PoohHead({ expression, yOffset = 0 }) {
  const ey = expression === 'sleepy' ? 'sleepy' : expression === 'thinking' ? 'thinking' : 'open';
  const mouth = expression === 'excited' ? 'big-smile'
    : expression === 'hungry' ? 'open-mouth'
    : expression === 'thinking' ? 'ponder'
    : expression === 'sleepy' ? 'gentle'
    : 'smile';

  return (
    <g transform={`translate(0, ${yOffset})`}>
      {/* Head shape */}
      <ellipse cx="80" cy="52" rx="38" ry="36" fill="#e8c97a" />
      <ellipse cx="80" cy="52" rx="38" ry="36" fill="none" stroke="#c4943a" strokeWidth="1.5" />

      {/* Ears */}
      <circle cx="47" cy="24" r="14" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.5" />
      <circle cx="47" cy="24" r="7" fill="#d4a54a" />
      <circle cx="113" cy="24" r="14" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.5" />
      <circle cx="113" cy="24" r="7" fill="#d4a54a" />

      {/* Forehead highlight */}
      <ellipse cx="80" cy="38" rx="20" ry="12" fill="#f0d68a" opacity="0.5" />

      {/* Eyes */}
      {ey === 'sleepy' ? (
        <>
          <path d="M66 48 Q72 52 78 48" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M82 48 Q88 52 94 48" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : ey === 'thinking' ? (
        <>
          <circle cx="70" cy="48" r="4" fill="#3d2414" />
          <circle cx="71" cy="47" r="1.2" fill="white" />
          <circle cx="90" cy="46" r="4" fill="#3d2414" />
          <circle cx="91" cy="45" r="1.2" fill="white" />
        </>
      ) : (
        <>
          <circle cx="70" cy="48" r="4.5" fill="#3d2414" />
          <circle cx="71.5" cy="46.5" r="1.5" fill="white" />
          <circle cx="90" cy="48" r="4.5" fill="#3d2414" />
          <circle cx="91.5" cy="46.5" r="1.5" fill="white" />
          {expression === 'excited' && (
            <>
              <ellipse cx="70" cy="48" rx="5" ry="5.5" fill="#3d2414" />
              <circle cx="71.5" cy="46" r="1.8" fill="white" />
              <ellipse cx="90" cy="48" rx="5" ry="5.5" fill="#3d2414" />
              <circle cx="91.5" cy="46" r="1.8" fill="white" />
            </>
          )}
        </>
      )}

      {/* Eyebrows */}
      {expression === 'thinking' && (
        <>
          <path d="M64 40 Q70 36 78 39" fill="none" stroke="#8B6E4E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M82 38 Q90 35 96 39" fill="none" stroke="#8B6E4E" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {expression === 'hungry' && (
        <>
          <path d="M62 41 Q70 38 78 41" fill="none" stroke="#8B6E4E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M82 41 Q90 38 98 41" fill="none" stroke="#8B6E4E" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="80" cy="60" rx="5" ry="3.5" fill="#3d2414" />
      <ellipse cx="79" cy="59" rx="1.5" ry="1" fill="#6B4C2A" opacity="0.6" />

      {/* Mouth */}
      {mouth === 'big-smile' ? (
        <path d="M68 66 Q80 78 92 66" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      ) : mouth === 'open-mouth' ? (
        <>
          <ellipse cx="80" cy="70" rx="7" ry="5" fill="#3d2414" />
          <ellipse cx="80" cy="68" rx="5" ry="2.5" fill="#c0392b" />
        </>
      ) : mouth === 'ponder' ? (
        <path d="M74 67 Q78 65 82 67 Q86 70 82 72" fill="none" stroke="#3d2414" strokeWidth="1.8" strokeLinecap="round" />
      ) : mouth === 'gentle' ? (
        <path d="M74 66 Q80 70 86 66" fill="none" stroke="#3d2414" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M70 65 Q80 74 90 65" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Cheek blush */}
      <ellipse cx="58" cy="58" rx="6" ry="4" fill="#f0a060" opacity="0.25" />
      <ellipse cx="102" cy="58" rx="6" ry="4" fill="#f0a060" opacity="0.25" />
    </g>
  );
}

/* ── Body ── */
function PoohBody({ expression, showHoneyPot, honeyLevel }) {
  const armPose = expression === 'hungry' ? 'reaching' : expression === 'excited' ? 'up' : 'relaxed';

  return (
    <g>
      {/* Tummy */}
      <ellipse cx="80" cy="130" rx="42" ry="44" fill="#e8c97a" />
      <ellipse cx="80" cy="130" rx="42" ry="44" fill="none" stroke="#c4943a" strokeWidth="1.5" />

      {/* Tummy highlight */}
      <ellipse cx="80" cy="125" rx="28" ry="30" fill="#f0d68a" opacity="0.4" />

      {/* Red shirt */}
      <path d="M42 108 Q42 145 80 150 Q118 145 118 108 Q105 95 80 93 Q55 95 42 108Z"
        fill="#c0392b" />
      <path d="M42 108 Q42 145 80 150 Q118 145 118 108 Q105 95 80 93 Q55 95 42 108Z"
        fill="none" stroke="#962d22" strokeWidth="1.2" />
      {/* Shirt neckline */}
      <path d="M60 97 Q80 103 100 97" fill="none" stroke="#962d22" strokeWidth="1" opacity="0.6" />
      {/* Shirt highlight */}
      <path d="M55 110 Q65 115 75 112" fill="none" stroke="#d4534a" strokeWidth="1.5" opacity="0.4" />

      {/* Arms */}
      {armPose === 'up' ? (
        <>
          <path d="M42 112 Q22 90 30 72" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="30" cy="72" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
          <path d="M118 112 Q138 90 130 72" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="130" cy="72" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        </>
      ) : armPose === 'reaching' ? (
        <>
          <path d="M42 115 Q18 120 14 140" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="14" cy="140" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
          <path d="M118 115 Q142 120 146 140" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="146" cy="140" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <path d="M42 115 Q24 130 28 155" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="28" cy="155" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
          <path d="M118 115 Q136 130 132 155" fill="none" stroke="#c4943a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="132" cy="155" r="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        </>
      )}

      {/* Legs */}
      <ellipse cx="62" cy="174" rx="16" ry="10" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
      <ellipse cx="98" cy="174" rx="16" ry="10" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />

      {/* Feet */}
      <ellipse cx="58" cy="184" rx="14" ry="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
      <ellipse cx="102" cy="184" rx="14" ry="7" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />

      {/* Honey pot */}
      {showHoneyPot && (
        <g transform="translate(60, 186)">
          <path d="M8 8 Q8 2 20 2 Q32 2 32 8 L34 28 Q34 34 20 34 Q6 34 4 28Z"
            fill="#b87333" stroke="#6b4c2a" strokeWidth="1.2" />
          <rect x="10" y="5" width="20" height="20" rx="3" fill="#c4873b" opacity="0.5" />
          <ellipse cx="20" cy="5" rx="10" ry="3" fill="#d4943a" />
          {/* Honey fill */}
          <rect x="10" y={25 - honeyLevel * 18} width="20" height={Math.max(0, honeyLevel * 18)} rx="2"
            fill="#f59e0b" opacity="0.85" />
          {/* Drip */}
          {honeyLevel > 0.3 && (
            <ellipse cx="20" cy="3" rx="6" ry="2" fill="#f59e0b" opacity="0.7" />
          )}
        </g>
      )}
    </g>
  );
}
