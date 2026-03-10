import { memo } from 'react';

/**
 * SVG Cartoon Dalmatian Puppy - ONE consistent character across all PuppyWash steps.
 *
 * Props:
 *   state      'muddy' | 'soapy' | 'wet' | 'clean' | 'fluffy' | 'sleeping'
 *   accessory  'collar' | 'bow' | 'bandana' | null
 *   animation  'idle' | 'wiggle' | 'bounce' | 'happy'
 *   showInBath  boolean
 *   className   Tailwind sizing classes
 *   style       inline styles
 */
function DalmatianPuppy({
  state = 'clean',
  accessory = null,
  animation = 'idle',
  showInBath = false,
  className = '',
  style = {},
}) {
  const isMuddy   = state === 'muddy';
  const isSoapy   = state === 'soapy';
  const isWet     = state === 'wet';
  const isFluffy  = state === 'fluffy';
  const isSleeping = state === 'sleeping';
  const showTongue = isFluffy || animation === 'happy';

  const animClass = {
    idle:   'dp-breathe',
    wiggle: 'dp-wiggle',
    bounce: 'dp-bounce',
    happy:  'dp-happy',
  }[animation] || 'dp-breathe';

  /* Fluffy state puffs the outline slightly */
  const bodyRx = isFluffy ? 52 : 48;
  const bodyRy = isFluffy ? 56 : 52;
  const headR  = isFluffy ? 52 : 48;

  return (
    <div className={`relative inline-block ${className}`} style={style}>
      <svg
        viewBox="0 0 200 280"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animClass}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="dp-fur" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fefefe" />
            <stop offset="100%" stopColor="#f5f0e8" />
          </radialGradient>
          <radialGradient id="dp-belly" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fffbf0" />
            <stop offset="100%" stopColor="#f5f0e8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dp-nose" cx="40%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
          <radialGradient id="dp-mud" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <linearGradient id="dp-tub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="dp-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
          </linearGradient>
          <filter id="dp-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ══ BATH TUB (back) ══ */}
        {showInBath && (
          <g>
            <ellipse cx="100" cy="192" rx="90" ry="18" fill="#f472b6" />
            <path d="M 12 192 Q 12 272, 100 278 Q 188 272, 188 192" fill="url(#dp-tub)" />
            <ellipse cx="100" cy="202" rx="82" ry="14" fill="url(#dp-water)" />
          </g>
        )}

        {/* ══ TAIL (behind body, animated wag) ══ */}
        <g className="dp-tail" style={{ transformOrigin: '148px 185px' }}>
          <path d="M 148 185 C 162 170, 175 152, 170 132"
                fill="none" stroke="url(#dp-fur)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 148 185 C 162 170, 175 152, 170 132"
                fill="none" stroke="#e0d8cc" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="168" cy="140" r="5" fill="#222" />
          {isMuddy && <circle cx="166" cy="148" r="6" fill="url(#dp-mud)" opacity="0.7" />}
        </g>

        {/* ══ BODY ══ */}
        <g filter={isFluffy ? 'url(#dp-glow)' : undefined}>
          <ellipse cx="100" cy="185" rx={bodyRx} ry={bodyRy}
                   fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
          <ellipse cx="100" cy="195" rx="30" ry="35" fill="url(#dp-belly)" />
          {/* Spots */}
          <circle cx="72"  cy="168" r="9"   fill="#222" />
          <circle cx="130" cy="178" r="7"   fill="#222" />
          <circle cx="95"  cy="205" r="6"   fill="#222" />
          <circle cx="120" cy="158" r="8"   fill="#222" />
          <circle cx="78"  cy="198" r="5"   fill="#222" />
          <circle cx="112" cy="212" r="4"   fill="#222" />
        </g>

        {/* ══ MUD on body ══ */}
        {isMuddy && (
          <g opacity="0.75">
            <ellipse cx="85"  cy="170" rx="18" ry="12" fill="url(#dp-mud)" transform="rotate(-10 85 170)" />
            <ellipse cx="120" cy="185" rx="15" ry="10" fill="url(#dp-mud)" transform="rotate(15 120 185)" />
            <ellipse cx="95"  cy="210" rx="12" ry="8"  fill="url(#dp-mud)" transform="rotate(-5 95 210)" />
            <ellipse cx="110" cy="160" rx="10" ry="7"  fill="url(#dp-mud)" transform="rotate(20 110 160)" />
            {/* Dripping mud */}
            <ellipse cx="75"  cy="222" rx="4" ry="8" fill="#92400e" opacity="0.6" />
            <ellipse cx="125" cy="226" rx="3" ry="6" fill="#92400e" opacity="0.5" />
          </g>
        )}

        {/* ══ NECK ACCESSORIES ══ */}
        {accessory === 'collar' && (
          <g>
            <ellipse cx="100" cy="138" rx="38" ry="8" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            <circle cx="100" cy="148" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
            <text x="100" y="151" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">&#9829;</text>
          </g>
        )}
        {accessory === 'bandana' && (
          <g>
            <path d="M 65 130 L 100 162 L 135 130 Q 100 124, 65 130Z"
                  fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="100" cy="132" r="5" fill="#f59e0b" />
          </g>
        )}

        {/* ══ HEAD ══ */}
        <g>
          {/* Left ear (black, floppy) */}
          <path d="M 68 62 C 48 42, 22 55, 28 85 C 32 108, 52 112, 62 92"
                fill="#222" stroke="#111" strokeWidth="0.5" />
          <path d="M 63 70 C 50 55, 35 62, 38 82 C 40 96, 50 100, 58 88"
                fill="#f9a8d4" opacity="0.35" />

          {/* Right ear (white with spot) */}
          <path d="M 132 62 C 152 42, 178 55, 172 85 C 168 108, 148 112, 138 92"
                fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
          <path d="M 137 70 C 150 55, 165 62, 162 82 C 160 96, 150 100, 142 88"
                fill="#f9a8d4" opacity="0.25" />
          <circle cx="155" cy="78" r="8" fill="#222" />

          {/* Head */}
          <circle cx="100" cy="85" r={headR}
                  fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />

          {/* Head spots */}
          <circle cx="75"  cy="58" r="7"   fill="#222" />
          <circle cx="118" cy="52" r="5"   fill="#222" />
          <circle cx="88"  cy="47" r="4"   fill="#222" />
          <circle cx="126" cy="70" r="3.5" fill="#222" />

          {/* ── FACE ── */}

          {/* Eyebrows */}
          {isMuddy ? (
            <>
              <path d="M 68 64 Q 78 60, 88 67" stroke="#333" strokeWidth="2" fill="none" />
              <path d="M 112 67 Q 122 60, 132 64" stroke="#333" strokeWidth="2" fill="none" />
            </>
          ) : (
            <>
              <path d="M 66 63 Q 78 57, 88 63" stroke="#333" strokeWidth="2" fill="none" />
              <path d="M 112 63 Q 122 57, 134 63" stroke="#333" strokeWidth="2" fill="none" />
            </>
          )}

          {/* Eyes */}
          {isFluffy || animation === 'happy' ? (
            /* Happy squint ^_^ */
            <>
              <path d="M 68 80 Q 80 70, 92 80" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 108 80 Q 120 70, 132 80" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : isSleeping ? (
            /* Peaceful closed eyes */
            <>
              <path d="M 68 80 Q 80 84, 92 80" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 108 80 Q 120 84, 132 80" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : (
            /* Normal open eyes */
            <>
              <ellipse cx="80"  cy="78" rx="12" ry={isWet ? 15 : 13} fill="white" stroke="#ddd" strokeWidth="0.5" />
              <ellipse cx={isMuddy ? 80 : 82} cy="80" rx="7" ry={isWet ? 9 : 8} fill="#222" />
              <circle cx="77" cy="76" r="3" fill="white" opacity="0.9" />
              <circle cx="84" cy="83" r="1.5" fill="white" opacity="0.5" />

              <ellipse cx="120" cy="78" rx="12" ry={isWet ? 15 : 13} fill="white" stroke="#ddd" strokeWidth="0.5" />
              <ellipse cx={isMuddy ? 120 : 122} cy="80" rx="7" ry={isWet ? 9 : 8} fill="#222" />
              <circle cx="117" cy="76" r="3" fill="white" opacity="0.9" />
              <circle cx="124" cy="83" r="1.5" fill="white" opacity="0.5" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="100" cy="98" rx="8" ry="6" fill="url(#dp-nose)" />
          <ellipse cx="97" cy="96" rx="3" ry="2" fill="#444" opacity="0.25" />

          {/* Mouth */}
          {isMuddy ? (
            <path d="M 90 108 Q 100 104, 110 108" stroke="#555" strokeWidth="1.5" fill="none" />
          ) : isWet ? (
            <ellipse cx="100" cy="110" rx="5" ry="6" fill="#f9a8d4" stroke="#555" strokeWidth="1" />
          ) : isSleeping ? (
            <path d="M 93 108 Q 100 112, 107 108" stroke="#555" strokeWidth="1.2" fill="none" />
          ) : (
            <>
              <path d="M 88 106 Q 100 118, 112 106" stroke="#555" strokeWidth="1.5" fill="none" />
              {showTongue && (
                <ellipse cx="100" cy="114" rx="6" ry="7" fill="#f9a8d4" stroke="#e879a0" strokeWidth="0.5" />
              )}
            </>
          )}

          {/* Cheek blush */}
          <circle cx="66"  cy="95" r="8" fill="#fda4af" opacity="0.25" />
          <circle cx="134" cy="95" r="8" fill="#fda4af" opacity="0.25" />

          {/* Mud on face */}
          {isMuddy && (
            <g opacity="0.6">
              <ellipse cx="80"  cy="95" rx="12" ry="8" fill="url(#dp-mud)" transform="rotate(-15 80 95)" />
              <ellipse cx="115" cy="70" rx="10" ry="6" fill="url(#dp-mud)" transform="rotate(10 115 70)" />
              <ellipse cx="100" cy="60" rx="8"  ry="5" fill="url(#dp-mud)" />
            </g>
          )}

          {/* Sleeping Zzz */}
          {isSleeping && (
            <g>
              <text x="140" y="50" fontSize="14" fill="#93c5fd" opacity="0.7" fontWeight="bold">
                z
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0;5,-8;0,0" dur="2s" repeatCount="indefinite" />
              </text>
              <text x="152" y="38" fontSize="11" fill="#93c5fd" opacity="0.5" fontWeight="bold">
                z
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0;4,-6;0,0" dur="2.5s" repeatCount="indefinite" />
              </text>
              <text x="160" y="28" fontSize="9" fill="#93c5fd" opacity="0.3" fontWeight="bold">
                z
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0;3,-5;0,0" dur="3s" repeatCount="indefinite" />
              </text>
            </g>
          )}
        </g>

        {/* ══ BOW on head ══ */}
        {accessory === 'bow' && (
          <g>
            <path d="M 100 38 C 85 26, 68 30, 76 42 C 80 48, 92 44, 100 38"
                  fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5" />
            <path d="M 100 38 C 115 26, 132 30, 124 42 C 120 48, 108 44, 100 38"
                  fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5" />
            <circle cx="100" cy="38" r="4" fill="#3b82f6" />
            <path d="M 96 42 L 88 54" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <path d="M 104 42 L 112 54" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ══ SOAP BUBBLES ══ */}
        {isSoapy && (
          <g>
            {[
              { cx: 70,  cy: 160, r: 8  },
              { cx: 85,  cy: 148, r: 6  },
              { cx: 130, cy: 165, r: 7  },
              { cx: 115, cy: 153, r: 5  },
              { cx: 90,  cy: 178, r: 9  },
              { cx: 125, cy: 182, r: 6  },
              /* Foam cap on head */
              { cx: 78,  cy: 42, r: 10 },
              { cx: 95,  cy: 36, r: 12 },
              { cx: 112, cy: 38, r: 11 },
              { cx: 126, cy: 46, r: 9  },
              { cx: 100, cy: 30, r: 8  },
              { cx: 86,  cy: 44, r: 7  },
              { cx: 108, cy: 33, r: 6  },
            ].map((b, i) => (
              <circle key={i} cx={b.cx} cy={b.cy} r={b.r}
                      fill="white" opacity="0.75" stroke="rgba(147,197,253,0.4)" strokeWidth="0.5">
                <animate attributeName="r" values={`${b.r};${b.r + 1.5};${b.r}`}
                         dur={`${1.5 + i * 0.15}s`} repeatCount="indefinite" />
              </circle>
            ))}
            {/* Highlights */}
            <circle cx="93" cy="34" r="3" fill="white" opacity="0.85" />
            <circle cx="113" cy="36" r="2.5" fill="white" opacity="0.85" />
          </g>
        )}

        {/* ══ WATER DRIPS ══ */}
        {isWet && (
          <g>
            {[
              { x: 70,  y: 55,  d: 0   },
              { x: 92,  y: 48,  d: 0.3 },
              { x: 115, y: 50,  d: 0.6 },
              { x: 132, y: 60,  d: 0.9 },
              { x: 78,  y: 148, d: 0.2 },
              { x: 122, y: 152, d: 0.5 },
              { x: 95,  y: 205, d: 0.8 },
              { x: 112, y: 198, d: 1.1 },
            ].map((drop, i) => (
              <path key={i}
                    d={`M ${drop.x} ${drop.y} Q ${drop.x + 1} ${drop.y + 6}, ${drop.x} ${drop.y + 12}`}
                    stroke="#93c5fd" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" begin={`${drop.d}s`} repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0;0,15;0,0" dur="1.5s" begin={`${drop.d}s`} repeatCount="indefinite" />
              </path>
            ))}
          </g>
        )}

        {/* ══ SPARKLES (fluffy state) ══ */}
        {isFluffy && (
          <g>
            {[
              { x: 48,  y: 48,  d: 0,   s: 8 },
              { x: 152, y: 58,  d: 0.5, s: 6 },
              { x: 42,  y: 148, d: 1,   s: 7 },
              { x: 160, y: 138, d: 0.3, s: 5 },
              { x: 100, y: 22,  d: 0.8, s: 9 },
              { x: 58,  y: 100, d: 1.2, s: 5 },
              { x: 148, y: 108, d: 0.6, s: 6 },
            ].map((sp, i) => (
              <g key={i} transform={`translate(${sp.x}, ${sp.y})`}>
                <path
                  d={`M 0 ${-sp.s} L ${sp.s * 0.3} ${-sp.s * 0.3} L ${sp.s} 0 L ${sp.s * 0.3} ${sp.s * 0.3} L 0 ${sp.s} L ${-sp.s * 0.3} ${sp.s * 0.3} L ${-sp.s} 0 L ${-sp.s * 0.3} ${-sp.s * 0.3} Z`}
                  fill="#fbbf24" opacity="0.8">
                  <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.8s" begin={`${sp.d}s`} repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate" values="0;45;0" dur="2.5s" begin={`${sp.d}s`} repeatCount="indefinite" />
                </path>
              </g>
            ))}
          </g>
        )}

        {/* ══ PAWS (when NOT in bath) ══ */}
        {!showInBath && (
          <g>
            <ellipse cx="72"  cy="232" rx="18" ry="10" fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
            <ellipse cx="128" cy="232" rx="18" ry="10" fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
            {/* Paw pads */}
            {[66, 72, 78, 122, 128, 134].map((x, i) => (
              <circle key={i} cx={x} cy={i < 3 ? 234 : 234} r="2.5" fill="#fda4af" opacity="0.55" />
            ))}
            {/* Mud on paws */}
            {isMuddy && (
              <>
                <ellipse cx="72"  cy="235" rx="16" ry="8" fill="url(#dp-mud)" opacity="0.5" />
                <ellipse cx="128" cy="235" rx="16" ry="8" fill="url(#dp-mud)" opacity="0.5" />
              </>
            )}
          </g>
        )}

        {/* ══ BATH TUB (front wall, covers lower body) ══ */}
        {showInBath && (
          <g>
            <path d="M 15 196 Q 15 268, 100 274 Q 185 268, 185 196"
                  fill="url(#dp-tub)" stroke="#db2777" strokeWidth="1.5" />
            <ellipse cx="100" cy="196" rx="88" ry="12" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1" />
            {/* Faucet */}
            <rect x="166" y="176" width="7" height="18" rx="3" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="0.5" />
            <path d="M 166 176 Q 158 166, 155 176" stroke="#d4d4d8" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Paws resting on tub rim */}
            <ellipse cx="72"  cy="198" rx="14" ry="8" fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
            <ellipse cx="128" cy="198" rx="14" ry="8" fill="url(#dp-fur)" stroke="#e0d8cc" strokeWidth="1" />
            {[67, 72, 77, 123, 128, 133].map((x, i) => (
              <circle key={i} cx={x} cy={200} r="2" fill="#fda4af" opacity="0.45" />
            ))}
            {/* Surface bubbles (soapy) */}
            {isSoapy && [
              { cx: 38, cy: 200, r: 6 }, { cx: 55, cy: 196, r: 5 },
              { cx: 75, cy: 198, r: 7 }, { cx: 95, cy: 195, r: 5 },
              { cx: 115, cy: 198, r: 6 }, { cx: 135, cy: 196, r: 5 },
              { cx: 152, cy: 200, r: 7 }, { cx: 162, cy: 195, r: 4 },
            ].map((b, i) => (
              <circle key={`sb${i}`} cx={b.cx} cy={b.cy} r={b.r}
                      fill="white" opacity="0.6" stroke="rgba(147,197,253,0.3)" strokeWidth="0.5">
                <animate attributeName="cy" values={`${b.cy};${b.cy - 2};${b.cy}`}
                         dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}
      </svg>

      {/* CSS Animations scoped with dp- prefix */}
      <style>{`
        .dp-breathe { animation: dp-breathe 3s ease-in-out infinite; }
        .dp-wiggle  { animation: dp-wiggle 0.3s ease-in-out infinite; }
        .dp-bounce  { animation: dp-bounce 0.8s ease-in-out infinite; }
        .dp-happy   { animation: dp-happy 0.5s ease-in-out infinite; }
        .dp-tail    { animation: dp-tail 0.6s ease-in-out infinite; }
        @keyframes dp-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012); }
        }
        @keyframes dp-wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes dp-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes dp-happy {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          25% { transform: translateY(-6px) rotate(1.5deg); }
          50% { transform: translateY(0) rotate(-1.5deg); }
          75% { transform: translateY(-6px) rotate(1.5deg); }
        }
        @keyframes dp-tail {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
      `}</style>
    </div>
  );
}

export default memo(DalmatianPuppy);
