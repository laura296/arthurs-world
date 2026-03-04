/**
 * Arthur Bear — the app mascot.
 * SVG bear cub with expression states: happy, excited, sleepy, curious.
 *
 * Props:
 *   expression: 'happy' | 'excited' | 'sleepy' | 'curious'
 *   size: number (width/height in px, default 120)
 *   className: additional CSS classes
 *   mode: 'full' (head + body) | 'face' (head only, default)
 */
export default function ArthurBear({ expression = 'happy', size = 120, className = '', mode = 'face' }) {
  const viewBox = mode === 'full' ? '0 0 200 280' : '0 0 200 200';

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={mode === 'full' ? size * 1.4 : size}
      className={className}
      aria-label="Arthur Bear"
    >
      {/* Head */}
      <g>
        {/* Ears */}
        <circle cx="55" cy="45" r="30" fill="#8B6914" />
        <circle cx="55" cy="45" r="18" fill="#D4A853" />
        <circle cx="145" cy="45" r="30" fill="#8B6914" />
        <circle cx="145" cy="45" r="18" fill="#D4A853" />

        {/* Head shape */}
        <ellipse cx="100" cy="105" rx="75" ry="70" fill="#C4922A" />

        {/* Face lighter area */}
        <ellipse cx="100" cy="120" rx="50" ry="45" fill="#D4A853" />

        {/* Eyes */}
        <Eyes expression={expression} />

        {/* Nose */}
        <ellipse cx="100" cy="120" rx="12" ry="9" fill="#5C3D10" />
        <ellipse cx="97" cy="118" rx="4" ry="3" fill="#8B6914" opacity="0.5" />

        {/* Mouth */}
        <Mouth expression={expression} />

        {/* Rosy cheeks */}
        <circle cx="60" cy="128" r="14" fill="#F9A8B8" opacity="0.5" />
        <circle cx="140" cy="128" r="14" fill="#F9A8B8" opacity="0.5" />
      </g>

      {/* Body (full mode only) */}
      {mode === 'full' && (
        <g>
          <ellipse cx="100" cy="230" rx="55" ry="50" fill="#C4922A" />
          <ellipse cx="100" cy="235" rx="35" ry="32" fill="#D4A853" />
          <ellipse cx="40" cy="215" rx="20" ry="28" fill="#C4922A" transform="rotate(-15 40 215)" />
          <ellipse cx="160" cy="215" rx="20" ry="28" fill="#C4922A" transform="rotate(15 160 215)" />
          <ellipse cx="72" cy="270" rx="22" ry="14" fill="#8B6914" />
          <ellipse cx="128" cy="270" rx="22" ry="14" fill="#8B6914" />
        </g>
      )}
    </svg>
  );
}

function Eyes({ expression }) {
  switch (expression) {
    case 'excited':
      return (
        <>
          <circle cx="75" cy="100" r="12" fill="#5C3D10" />
          <circle cx="125" cy="100" r="12" fill="#5C3D10" />
          <circle cx="79" cy="96" r="4" fill="white" />
          <circle cx="129" cy="96" r="4" fill="white" />
          <circle cx="73" cy="103" r="2" fill="white" />
          <circle cx="123" cy="103" r="2" fill="white" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <ellipse cx="75" cy="102" rx="10" ry="5" fill="#5C3D10" />
          <ellipse cx="125" cy="102" rx="10" ry="5" fill="#5C3D10" />
          <line x1="65" y1="98" x2="85" y2="98" stroke="#5C3D10" strokeWidth="2" strokeLinecap="round" />
          <line x1="115" y1="98" x2="135" y2="98" stroke="#5C3D10" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'curious':
      return (
        <>
          <circle cx="75" cy="100" r="9" fill="#5C3D10" />
          <circle cx="125" cy="97" r="10" fill="#5C3D10" />
          <circle cx="78" cy="97" r="3" fill="white" />
          <circle cx="128" cy="94" r="3.5" fill="white" />
          <path d="M115 82 Q125 76 135 82" stroke="#5C3D10" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    default: // happy
      return (
        <>
          <circle cx="75" cy="100" r="9" fill="#5C3D10" />
          <circle cx="125" cy="100" r="9" fill="#5C3D10" />
          <circle cx="78" cy="97" r="3" fill="white" />
          <circle cx="128" cy="97" r="3" fill="white" />
        </>
      );
  }
}

function Mouth({ expression }) {
  switch (expression) {
    case 'excited':
      return (
        <>
          <ellipse cx="100" cy="140" rx="16" ry="10" fill="#5C3D10" />
          <ellipse cx="100" cy="136" rx="14" ry="5" fill="#C4922A" />
        </>
      );
    case 'sleepy':
      return (
        <path d="M90 138 Q100 144 110 138" stroke="#5C3D10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
    case 'curious':
      return (
        <ellipse cx="100" cy="140" rx="7" ry="6" fill="#5C3D10" />
      );
    default: // happy
      return (
        <path d="M85 136 Q100 150 115 136" stroke="#5C3D10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
  }
}
