/**
 * SVG open mouth with individually addressable teeth.
 * Each tooth transitions from yellowish to white as it gets cleaned.
 * Shows friendly cartoon-style lips, gums, and tongue.
 */

function Tooth({ x, y, progress, isTarget }) {
  // Interpolate from yellow (#fef3c7) to white (#ffffff)
  const r = Math.round(254 + (255 - 254) * progress);
  const g = Math.round(243 + (255 - 243) * progress);
  const b = Math.round(199 + (255 - 199) * progress);
  const fill = `rgb(${r},${g},${b})`;
  const clean = progress >= 1;

  return (
    <g>
      {/* Target glow */}
      {isTarget && !clean && (
        <circle cx={x} cy={y} r="22" fill="none" stroke="#facc15" strokeWidth="2" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="20;24;20" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Tooth body */}
      <rect x={x - 14} y={y - 16} width="28" height="32" rx="8" fill={fill}
            stroke={clean ? '#93c5fd' : '#e5e0c8'} strokeWidth="1.5" />
      {/* Highlight */}
      <rect x={x - 8} y={y - 12} width="8" height="14" rx="4" fill="#fff" opacity={0.2 + progress * 0.3} />
      {/* Sparkles when clean */}
      {clean && (
        <>
          <text x={x} y={y + 2} textAnchor="middle" fontSize="16" dominantBaseline="central">✨</text>
          <circle cx={x + 10} cy={y - 10} r="3" fill="#facc15" opacity="0.7">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </g>
  );
}

export default function MouthSVG({ teeth, brushCounts, brushNeeded, targetIdx }) {
  const topTeeth = teeth.filter(t => t.row === 'top');
  const bottomTeeth = teeth.filter(t => t.row === 'bottom');
  const topCount = topTeeth.length;
  const bottomCount = bottomTeeth.length;

  // Position teeth along arcs
  const getTopPos = (i) => ({ x: 60 + i * (180 / (topCount - 1 || 1)), y: 55 });
  const getBottomPos = (i) => ({ x: 60 + i * (180 / (bottomCount - 1 || 1)), y: 145 });

  return (
    <svg viewBox="0 0 300 210" width="100%" style={{ maxWidth: 320 }}>
      <defs>
        <radialGradient id="lip-g" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id="gum-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f472b6" />
        </radialGradient>
      </defs>

      {/* Outer lip shape */}
      <ellipse cx="150" cy="105" rx="135" ry="100" fill="url(#lip-g)" />

      {/* Inner mouth (dark) */}
      <ellipse cx="150" cy="105" rx="110" ry="75" fill="#1c1917" />

      {/* Top gum */}
      <path d="M50 60 Q80 30 150 28 Q220 30 250 60 Q240 70 150 68 Q60 70 50 60Z" fill="url(#gum-g)" />

      {/* Bottom gum */}
      <path d="M50 150 Q80 180 150 182 Q220 180 250 150 Q240 140 150 142 Q60 140 50 150Z" fill="url(#gum-g)" />

      {/* Top teeth */}
      {topTeeth.map((tooth, i) => {
        const pos = getTopPos(i);
        const progress = Math.min((brushCounts[tooth.id] || 0) / brushNeeded, 1);
        return (
          <Tooth key={tooth.id} x={pos.x} y={pos.y}
                 progress={progress}
                 isTarget={teeth.indexOf(tooth) === targetIdx} />
        );
      })}

      {/* Bottom teeth */}
      {bottomTeeth.map((tooth, i) => {
        const pos = getBottomPos(i);
        const progress = Math.min((brushCounts[tooth.id] || 0) / brushNeeded, 1);
        return (
          <Tooth key={tooth.id} x={pos.x} y={pos.y}
                 progress={progress}
                 isTarget={teeth.indexOf(tooth) === targetIdx} />
        );
      })}

      {/* Tongue */}
      <ellipse cx="150" cy="135" rx="40" ry="20" fill="#f472b6" opacity="0.7" />

      {/* Lip shine */}
      <ellipse cx="120" cy="50" rx="30" ry="8" fill="#fff" opacity="0.15" />
    </svg>
  );
}

/** Get the screen-space position of a tooth for targeting */
export function getToothRect(teeth, idx, containerRect) {
  if (!containerRect) return null;
  const tooth = teeth[idx];
  if (!tooth) return null;

  const topTeeth = teeth.filter(t => t.row === 'top');
  const bottomTeeth = teeth.filter(t => t.row === 'bottom');
  const topCount = topTeeth.length;
  const bottomCount = bottomTeeth.length;

  const svgW = Math.min(containerRect.width, 320);
  const svgH = svgW * (210 / 300);
  const scaleX = svgW / 300;
  const scaleY = svgH / 210;
  const offsetX = containerRect.left + (containerRect.width - svgW) / 2;
  const offsetY = containerRect.top;

  let x, y;
  if (tooth.row === 'top') {
    const i = topTeeth.indexOf(tooth);
    x = 60 + i * (180 / (topCount - 1 || 1));
    y = 55;
  } else {
    const i = bottomTeeth.indexOf(tooth);
    x = 60 + i * (180 / (bottomCount - 1 || 1));
    y = 145;
  }

  return {
    cx: offsetX + x * scaleX,
    cy: offsetY + y * scaleY,
    r: 20 * scaleX,
  };
}
