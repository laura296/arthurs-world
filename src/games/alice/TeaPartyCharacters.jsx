/**
 * SVG characters for the Mad Hatter's Tea Party.
 * Watercolour-inspired style — warm, slightly chaotic, cosy.
 *
 * Props for each:
 *   reaction — 'idle' | 'tap-hint' | 'wave-item' | 'celebrate' | 'wrong'
 *   className — additional wrapper classes
 */

// ── Mad Hatter ───────────────────────────────────────────────────────

export function MadHatter({ reaction = 'idle', className = '' }) {
  const isCelebrate = reaction === 'celebrate';
  const isWrong = reaction === 'wrong';
  const isTapHint = reaction === 'tap-hint';
  const isWaveItem = reaction === 'wave-item';

  return (
    <div
      className={`select-none ${className}`}
      style={{
        animation: isCelebrate
          ? 'hatter-bounce 0.5s ease-in-out 2'
          : isWrong
          ? 'hatter-tilt 0.4s ease-in-out'
          : 'hatter-idle 3s ease-in-out infinite',
      }}
    >
      <svg width="120" height="180" viewBox="0 0 120 180">
        {/* Hat — bounces off head when celebrating */}
        <g
          style={{
            transformOrigin: '60px 20px',
            animation: isCelebrate ? 'hat-jump 0.6s ease-out' : undefined,
          }}
        >
          {/* Hat brim */}
          <ellipse cx="60" cy="62" rx="32" ry="6" fill="#5D4037" opacity="0.8" />
          {/* Hat body */}
          <rect x="38" y="12" width="44" height="52" rx="4" fill="#6D4C41" />
          {/* Hat band */}
          <rect x="38" y="48" width="44" height="8" rx="2" fill="#F5B041" />
          {/* Hat top */}
          <rect x="40" y="10" width="40" height="6" rx="3" fill="#5D4037" />
          {/* 10/6 price tag */}
          <rect x="78" y="36" width="18" height="12" rx="2" fill="#FDF5E6" stroke="#D4A574" strokeWidth="0.5" />
          <text x="87" y="45" textAnchor="middle" fontSize="6" fill="#8B6914" fontWeight="bold" fontFamily="serif">10/6</text>
        </g>

        {/* Hair — wild tufts */}
        <path d="M32 68 Q28 55 35 50" fill="none" stroke="#C97B3A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M88 68 Q92 55 85 50" fill="none" stroke="#C97B3A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 72 Q24 65 30 58" fill="none" stroke="#D4944A" strokeWidth="2" strokeLinecap="round" />
        <path d="M90 72 Q96 65 90 58" fill="none" stroke="#D4944A" strokeWidth="2" strokeLinecap="round" />

        {/* Face */}
        <ellipse cx="60" cy="80" rx="24" ry="20" fill="#F5D5B8" />
        {/* Cheeks */}
        <circle cx="42" cy="84" r="5" fill="#F1948A" opacity="0.3" />
        <circle cx="78" cy="84" r="5" fill="#F1948A" opacity="0.3" />

        {/* Eyes — change with reaction */}
        {isWrong ? (
          <>
            {/* Puzzled squint */}
            <path d="M48 76 Q52 74 56 76" fill="none" stroke="#4A2C0A" strokeWidth="1.5" />
            <path d="M64 76 Q68 74 72 76" fill="none" stroke="#4A2C0A" strokeWidth="1.5" />
          </>
        ) : (
          <>
            {/* Normal eyes — wide and expressive */}
            <ellipse cx="50" cy="76" rx="4" ry="4.5" fill="white" />
            <circle cx={isCelebrate ? 51 : 50} cy="76" r="2.5" fill="#4A2C0A" />
            <circle cx={isCelebrate ? 51.5 : 50.5} cy="75" r="0.8" fill="white" />
            <ellipse cx="70" cy="76" rx="4" ry="4.5" fill="white" />
            <circle cx={isCelebrate ? 71 : 70} cy="76" r="2.5" fill="#4A2C0A" />
            <circle cx={isCelebrate ? 71.5 : 70.5} cy="75" r="0.8" fill="white" />
          </>
        )}

        {/* Eyebrows — very expressive */}
        {isCelebrate ? (
          <>
            <path d="M44 69 Q50 64 56 69" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
            <path d="M64 69 Q70 64 76 69" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : isWrong ? (
          <>
            <path d="M44 72 Q50 70 56 74" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M64 74 Q70 70 76 72" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M44 71 Q50 68 56 71" fill="none" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M64 71 Q70 68 76 71" fill="none" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="60" cy="83" rx="3" ry="2.5" fill="#E8B898" />

        {/* Mouth */}
        {isCelebrate ? (
          <path d="M50 90 Q60 100 70 90" fill="#C0392B" stroke="#4A2C0A" strokeWidth="1" />
        ) : isWrong ? (
          <circle cx="60" cy="91" r="3" fill="none" stroke="#4A2C0A" strokeWidth="1.2" />
        ) : (
          <path d="M50 89 Q60 96 70 89" fill="none" stroke="#4A2C0A" strokeWidth="1.2" strokeLinecap="round" />
        )}

        {/* Bowtie — oversized */}
        <g transform="translate(60, 105)">
          <path d="M0 0 L-16 -8 L-16 8 Z" fill="#C0392B" />
          <path d="M0 0 L16 -8 L16 8 Z" fill="#E74C3C" />
          <circle cx="0" cy="0" r="3" fill="#F5B041" />
        </g>

        {/* Body — jacket */}
        <path d="M36 108 L30 165 L90 165 L84 108 Q60 100 36 108Z" fill="#6D4C41" />
        <line x1="60" y1="108" x2="60" y2="165" stroke="#5D4037" strokeWidth="1" />
        {/* Jacket buttons */}
        <circle cx="60" cy="120" r="2" fill="#F5B041" />
        <circle cx="60" cy="135" r="2" fill="#F5B041" />
        <circle cx="60" cy="150" r="2" fill="#F5B041" />

        {/* Arms */}
        {isTapHint ? (
          // Right arm pointing forward
          <path d="M84 115 Q100 110 105 100" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
        ) : isWaveItem ? (
          // Right arm waving up
          <path d="M84 115 Q100 95 95 80" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round"
            style={{ animation: 'hatter-wave 0.6s ease-in-out infinite' }} />
        ) : isCelebrate ? (
          // Both arms up
          <>
            <path d="M36 115 Q15 95 20 75" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
            <path d="M84 115 Q105 95 100 75" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
          </>
        ) : (
          // Default resting arms
          <>
            <path d="M36 115 Q22 130 28 150" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
            <path d="M84 115 Q98 130 92 150" fill="none" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
          </>
        )}

        {/* Hands */}
        <circle cx={isTapHint ? 105 : isWaveItem ? 95 : isCelebrate ? 20 : 28} cy={isTapHint ? 100 : isWaveItem ? 80 : isCelebrate ? 75 : 150} r="5" fill="#F5D5B8" />
        <circle cx={isCelebrate ? 100 : 92} cy={isCelebrate ? 75 : 150} r="5" fill="#F5D5B8" />
      </svg>
    </div>
  );
}

// ── March Hare ───────────────────────────────────────────────────────

export function MarchHare({ reaction = 'idle', className = '' }) {
  const isAwake = reaction === 'celebrate' || reaction === 'wake';
  const isShake = reaction === 'wrong';

  return (
    <div
      className={`select-none ${className}`}
      style={{
        animation: isAwake
          ? 'hare-jolt 0.4s ease-out'
          : isShake
          ? 'hare-shake 0.4s ease-in-out'
          : 'hare-doze 4s ease-in-out infinite',
      }}
    >
      <svg width="80" height="130" viewBox="0 0 80 130">
        {/* Ears — long, floppy */}
        <path d="M28 45 Q22 10 30 5 Q35 2 35 30" fill="#D4A574" stroke="#8B6914" strokeWidth="1" />
        <path d="M32 35 Q28 15 33 8" fill="#F1948A" opacity="0.3" />
        <path d="M52 45 Q58 10 50 5 Q45 2 45 30" fill="#D4A574" stroke="#8B6914" strokeWidth="1" />
        <path d="M48 35 Q52 15 47 8" fill="#F1948A" opacity="0.3" />

        {/* Head */}
        <ellipse cx="40" cy="56" rx="18" ry="16" fill="#D4A574" />
        {/* Cheeks */}
        <circle cx="26" cy="60" r="4" fill="#F1948A" opacity="0.25" />
        <circle cx="54" cy="60" r="4" fill="#F1948A" opacity="0.25" />

        {/* Eyes */}
        {isAwake ? (
          <>
            <ellipse cx="33" cy="54" rx="3.5" ry="4" fill="white" />
            <circle cx="33" cy="54" r="2" fill="#4A2C0A" />
            <ellipse cx="47" cy="54" rx="3.5" ry="4" fill="white" />
            <circle cx="47" cy="54" r="2" fill="#4A2C0A" />
          </>
        ) : (
          <>
            {/* Sleepy half-closed eyes */}
            <path d="M30 54 Q33 52 36 54" fill="none" stroke="#4A2C0A" strokeWidth="1.5" />
            <path d="M44 54 Q47 52 50 54" fill="none" stroke="#4A2C0A" strokeWidth="1.5" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="40" cy="60" rx="3" ry="2" fill="#C97B3A" />
        {/* Whiskers */}
        <line x1="20" y1="58" x2="30" y2="60" stroke="#8B6914" strokeWidth="0.5" opacity="0.4" />
        <line x1="20" y1="62" x2="30" y2="62" stroke="#8B6914" strokeWidth="0.5" opacity="0.4" />
        <line x1="50" y1="60" x2="60" y2="58" stroke="#8B6914" strokeWidth="0.5" opacity="0.4" />
        <line x1="50" y1="62" x2="60" y2="62" stroke="#8B6914" strokeWidth="0.5" opacity="0.4" />

        {/* Mouth */}
        {isAwake ? (
          <path d="M36 65 Q40 69 44 65" fill="none" stroke="#4A2C0A" strokeWidth="1" strokeLinecap="round" />
        ) : (
          <path d="M37 64 Q40 66 43 64" fill="none" stroke="#4A2C0A" strokeWidth="0.8" strokeLinecap="round" />
        )}

        {/* Body */}
        <ellipse cx="40" cy="90" rx="20" ry="22" fill="#C4A265" />
        {/* Waistcoat */}
        <path d="M28 78 L25 108 L55 108 L52 78 Q40 74 28 78Z" fill="#5B9BD5" opacity="0.6" />

        {/* Arms */}
        {isShake ? (
          <>
            <path d="M22 85 Q10 80 15 70" fill="none" stroke="#C4A265" strokeWidth="5" strokeLinecap="round"
              style={{ animation: 'hare-shake 0.3s ease-in-out 2' }} />
          </>
        ) : (
          <path d="M22 85 Q12 95 18 108" fill="none" stroke="#C4A265" strokeWidth="5" strokeLinecap="round" />
        )}
        <path d="M58 85 Q68 95 62 108" fill="none" stroke="#C4A265" strokeWidth="5" strokeLinecap="round" />

        {/* Feet */}
        <ellipse cx="30" cy="115" rx="10" ry="5" fill="#C4A265" />
        <ellipse cx="50" cy="115" rx="10" ry="5" fill="#C4A265" />
      </svg>
    </div>
  );
}

// ── Dormouse (in teapot) ─────────────────────────────────────────────

export function Dormouse({ reaction = 'idle', className = '' }) {
  const isAwake = reaction === 'celebrate';

  return (
    <div className={`select-none ${className}`}>
      <svg width="70" height="60" viewBox="0 0 70 60">
        {/* Teapot body */}
        <ellipse cx="35" cy="38" rx="28" ry="18" fill="#D4A574" />
        <ellipse cx="35" cy="38" rx="28" ry="18" fill="none" stroke="#8B6914" strokeWidth="1" />
        {/* Teapot lid (raised to show dormouse) */}
        <ellipse cx="35" cy="22" rx="14" ry="4" fill="#C4A265" stroke="#8B6914" strokeWidth="0.8" />
        {/* Lid knob */}
        <circle cx="35" cy="19" r="3" fill="#8B6914" />
        {/* Spout */}
        <path d="M63 36 Q72 30 68 24" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
        {/* Handle */}
        <path d="M7 30 Q-2 38 7 46" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />

        {/* Dormouse head peeking over rim */}
        <ellipse cx="35" cy="26" rx="10" ry="7" fill="#BFA57A" />
        {/* Ears */}
        <circle cx="27" cy="21" r="4" fill="#BFA57A" stroke="#8B6914" strokeWidth="0.5" />
        <circle cx="27" cy="21" r="2" fill="#F1948A" opacity="0.3" />
        <circle cx="43" cy="21" r="4" fill="#BFA57A" stroke="#8B6914" strokeWidth="0.5" />
        <circle cx="43" cy="21" r="2" fill="#F1948A" opacity="0.3" />

        {/* Eyes */}
        {isAwake ? (
          <>
            {/* One eye open, one eye closed */}
            <circle cx="32" cy="25" r="1.5" fill="#4A2C0A" />
            <path d="M37 25 Q39 24 41 25" fill="none" stroke="#4A2C0A" strokeWidth="1" />
          </>
        ) : (
          <>
            {/* Both eyes closed — sleeping */}
            <path d="M29 25 Q32 24 35 25" fill="none" stroke="#4A2C0A" strokeWidth="1" />
            <path d="M37 25 Q39 24 41 25" fill="none" stroke="#4A2C0A" strokeWidth="1" />
          </>
        )}

        {/* Nose */}
        <circle cx="35" cy="28" r="1.2" fill="#C97B3A" />

        {/* Zzz when sleeping */}
        {!isAwake && (
          <g opacity="0.5" style={{ animation: 'dormouse-zzz 2s ease-in-out infinite' }}>
            <text x="48" y="16" fontSize="8" fill="#8B6914" fontWeight="bold" fontFamily="serif">z</text>
            <text x="54" y="10" fontSize="6" fill="#8B6914" fontWeight="bold" fontFamily="serif">z</text>
            <text x="58" y="6" fontSize="5" fill="#8B6914" fontWeight="bold" fontFamily="serif">z</text>
          </g>
        )}
      </svg>
    </div>
  );
}
