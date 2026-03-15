/**
 * SVG Lunchbox component with open/close lid animation.
 * Shows compartments that fill with food items.
 */
import { FOOD_SVGS } from './FoodSVGs';

export default function LunchboxSVG({ items, slots, lidClosed, wiggle }) {
  return (
    <div className={`relative ${wiggle ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}>
      <svg viewBox="0 0 320 140" width="100%" style={{ maxWidth: 320 }}>
        <defs>
          <linearGradient id="box-g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="lid-g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="box-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#991b1b" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="160" cy="135" rx="140" ry="6" fill="#000" opacity="0.06" />

        {/* Box body */}
        <rect x="20" y="50" width="280" height="80" rx="12" fill="url(#box-g)" filter="url(#box-shadow)" />

        {/* Inner highlight */}
        <rect x="24" y="54" width="272" height="72" rx="10" fill="#fca5a5" opacity="0.15" />

        {/* Compartment dividers + slots */}
        {Array.from({ length: slots }).map((_, i) => {
          const slotW = 260 / slots;
          const sx = 30 + i * slotW;
          const food = items[i];
          const FoodSVG = food ? FOOD_SVGS[food.id] : null;
          return (
            <g key={i}>
              {/* Dashed slot outline */}
              {!food && (
                <rect x={sx + 4} y={60} width={slotW - 8} height={56} rx="6"
                      fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.25" />
              )}
              {/* Food item in slot */}
              {FoodSVG && (
                <foreignObject x={sx + 2} y={58} width={slotW - 4} height={58}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 44, height: 44 }}>
                      <FoodSVG />
                    </div>
                  </div>
                </foreignObject>
              )}
              {/* Divider */}
              {i < slots - 1 && (
                <line x1={sx + slotW} y1={60} x2={sx + slotW} y2={120} stroke="#b91c1c" strokeWidth="1" opacity="0.3" />
              )}
            </g>
          );
        })}

        {/* Clasps */}
        <rect x="60" y="46" width="16" height="12" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <rect x="244" y="46" width="16" height="12" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

        {/* Handle */}
        <path d="M130 50 Q130 36 160 36 Q190 36 190 50" fill="none" stroke="#b91c1c" strokeWidth="5" strokeLinecap="round" />

        {/* Lid (animates closed) */}
        <g style={{
          transformOrigin: '160px 50px',
          transform: lidClosed ? 'rotateX(0deg)' : 'rotateX(-75deg)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: lidClosed ? 1 : 0.3,
        }}>
          <rect x="18" y="24" width="284" height="30" rx="10" fill="url(#lid-g)" />
          <rect x="22" y="28" width="276" height="22" rx="8" fill="#fca5a5" opacity="0.1" />
        </g>
      </svg>
    </div>
  );
}
