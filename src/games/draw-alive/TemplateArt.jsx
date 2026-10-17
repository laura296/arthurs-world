import { useId } from 'react';
import { VIEWBOX } from './worlds';
import { OUTLINE } from './sprite';

/**
 * Colour-in outline of a creature template.
 *
 * Props:
 *   template  — TEMPLATES entry
 *   layer     — 'fill' (body only) | 'lines' (outline, details, eyes) | 'all'
 *   fill      — body colour for 'fill' / 'all'
 *   className
 */
export default function TemplateArt({ template, layer = 'all', fill = '#ffffff', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const maskId = `da-mask-${uid}`;
  const clipId = `da-clip-${uid}`;
  const { x, y, size } = VIEWBOX;
  const parts = template.parts.map((d, i) => <path key={i} d={d} />);
  const showFill = layer !== 'lines';
  const showLines = layer !== 'fill';

  return (
    <svg viewBox={`${x} ${y} ${size} ${size}`} className={className} aria-hidden="true">
      {showLines && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={x} y={y} width={size} height={size}>
            <rect x={x} y={y} width={size} height={size} fill="white" />
            <g fill="black">{parts}</g>
          </mask>
          <clipPath id={clipId}>{parts}</clipPath>
        </defs>
      )}
      {showFill && <g fill={fill}>{parts}</g>}
      {showLines && (
        <>
          <g fill="none" stroke={OUTLINE} strokeWidth="10" strokeLinejoin="round" mask={`url(#${maskId})`}>
            {parts}
          </g>
          <g fill="none" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"
             clipPath={`url(#${clipId})`}>
            {template.details.map((d, i) => <path key={i} d={d} />)}
          </g>
          {template.eyes.map((e, i) => (
            <g key={i}>
              <circle cx={e.x} cy={e.y} r={e.r} fill="#fff" stroke={OUTLINE} strokeWidth="2" />
              <circle cx={e.x + e.r * 0.15} cy={e.y + e.r * 0.1} r={e.r * 0.55} fill="#1e1b2e" />
              <circle cx={e.x - e.r * 0.05} cy={e.y - e.r * 0.15} r={e.r * 0.2} fill="#fff" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

/** SVG markup of the body shape, for use as a CSS mask image. */
export function templateMaskUrl(template) {
  const { x, y, size } = VIEWBOX;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${size} ${size}" preserveAspectRatio="none">${
    template.parts.map(d => `<path d="${d}" fill="black"/>`).join('')
  }</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
