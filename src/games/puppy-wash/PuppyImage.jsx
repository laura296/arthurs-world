import { memo, useState, useMemo } from 'react';

/**
 * PNG-based puppy renderer with CSS state overlays.
 *
 * Uses a single high-quality AI-generated PNG per breed as the base,
 * then applies visual effects via CSS filters + overlay elements for
 * different states (muddy, soapy, wet, fluffy, etc).
 *
 * Props:
 *   breed      'terrier' | 'dalmatian' | 'golden'
 *   state      'muddy' | 'soapy' | 'wet' | 'clean' | 'fluffy' | 'sleeping' | 'excited'
 *   animation  'idle' | 'wiggle' | 'bounce' | 'happy'
 *   showInBath  boolean
 *   className   Tailwind sizing classes
 */

const IMG = '/arthurs-world/images/disney/puppy-wash';

const BREED_IMG = {
  terrier:   `${IMG}/bean.png`,
  dalmatian: `${IMG}/patch.png`,
  golden:    `${IMG}/sunny.png`,
};

// Fallback emoji if PNG not loaded yet
const BREED_EMOJI = {
  terrier: '🐕', dalmatian: '🐾', golden: '🐶',
};

function PuppyImage({
  breed = 'dalmatian',
  state = 'clean',
  animation = 'idle',
  showInBath = false,
  className = '',
  style = {},
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const src = BREED_IMG[breed] || BREED_IMG.dalmatian;

  const isMuddy = state === 'muddy';
  const isSoapy = state === 'soapy';
  const isWet = state === 'wet';
  const isFluffy = state === 'fluffy';
  const isSleeping = state === 'sleeping';
  const isExcited = state === 'excited';

  const animClass = {
    idle: 'pi-breathe',
    wiggle: 'pi-wiggle',
    bounce: 'pi-bounce',
    happy: 'pi-happy',
  }[animation] || 'pi-breathe';

  // CSS filter per state
  const stateFilter = isMuddy
    ? 'sepia(0.6) saturate(1.2) brightness(0.75)'
    : isWet
    ? 'brightness(0.9) saturate(1.1)'
    : isSleeping
    ? 'brightness(0.85) saturate(0.8)'
    : isFluffy
    ? 'brightness(1.08) contrast(1.05)'
    : isExcited
    ? 'brightness(1.05) saturate(1.15)'
    : 'none';

  // Generate random mud splotch positions (stable per component instance)
  const mudSplotches = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: 15 + ((i * 37 + 13) % 70),
      y: 10 + ((i * 29 + 7) % 75),
      size: 12 + (i % 3) * 8,
      rotation: (i * 47) % 360,
    })), []);

  const soapBubbles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: 10 + ((i * 31 + 11) % 80),
      y: 5 + ((i * 23 + 5) % 85),
      size: 8 + (i % 4) * 6,
      delay: (i * 0.2) % 2,
    })), []);

  const waterDrops = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      x: 20 + ((i * 43 + 9) % 60),
      y: 8 + ((i * 37 + 15) % 40),
      delay: i * 0.25,
    })), []);

  return (
    <div className={`relative ${animClass} ${className}`} style={style}>
      {/* Bath tub behind puppy */}
      {showInBath && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[55%] z-0 pointer-events-none">
          <svg viewBox="0 0 200 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="pi-tub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="pi-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="30" rx="95" ry="16" fill="#f472b6" />
            <path d="M 8 30 Q 8 95, 100 100 Q 192 95, 192 30" fill="url(#pi-tub)" stroke="#db2777" strokeWidth="1.5" />
            <ellipse cx="100" cy="38" rx="88" ry="12" fill="url(#pi-water)" />
            <ellipse cx="100" cy="32" rx="92" ry="10" fill="#f9a8d4" stroke="#ec4899" strokeWidth="0.5" />
            {/* Faucet */}
            <rect x="172" y="12" width="6" height="16" rx="3" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="0.5" />
            <path d="M 172 12 Q 165 4, 162 12" stroke="#d4d4d8" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Base puppy image */}
      <div className="relative z-10">
        {!imgError ? (
          <img
            src={src}
            alt={breed}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-contain drop-shadow-xl transition-all duration-300 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{ filter: stateFilter }}
          />
        ) : (
          /* Emoji fallback */
          <span className="flex items-center justify-center w-full h-full text-8xl select-none">
            {BREED_EMOJI[breed]}
          </span>
        )}

        {/* ── MUD OVERLAY ── */}
        {isMuddy && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {mudSplotches.map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.size}%`,
                  height: `${s.size * 0.7}%`,
                  background: 'radial-gradient(ellipse, rgba(120,53,15,0.7) 0%, rgba(146,64,14,0.4) 60%, transparent 100%)',
                  transform: `rotate(${s.rotation}deg)`,
                }}
              />
            ))}
            {/* Mud drips */}
            <div className="absolute bottom-[10%] left-[25%] w-[6%] h-[12%] rounded-full bg-amber-900/40" />
            <div className="absolute bottom-[8%] right-[30%] w-[4%] h-[10%] rounded-full bg-amber-900/30" />
          </div>
        )}

        {/* ── SOAP BUBBLES OVERLAY ── */}
        {isSoapy && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {soapBubbles.map((b, i) => (
              <div
                key={i}
                className="absolute rounded-full pi-bubble-wobble"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}%`,
                  height: `${b.size}%`,
                  background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(186,230,253,0.4) 50%, transparent 100%)',
                  boxShadow: 'inset -1px -2px 3px rgba(147,197,253,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  animationDelay: `${b.delay}s`,
                }}
              />
            ))}
            {/* Foam cap on head area */}
            <div className="absolute top-[2%] left-[20%] w-[60%] h-[20%] rounded-full opacity-80"
                 style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.3) 70%, transparent 100%)' }} />
          </div>
        )}

        {/* ── WATER DRIPS OVERLAY ── */}
        {isWet && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {waterDrops.map((d, i) => (
              <div
                key={i}
                className="absolute pi-drip"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: '3%',
                  height: '8%',
                  background: 'linear-gradient(to bottom, rgba(147,197,253,0.6), rgba(96,165,250,0.3))',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
            {/* Wet sheen */}
            <div className="absolute inset-0 rounded-full opacity-15"
                 style={{ background: 'linear-gradient(135deg, rgba(147,197,253,0.4) 0%, transparent 50%)' }} />
          </div>
        )}

        {/* ── SPARKLES (fluffy / excited) ── */}
        {(isFluffy || isExcited) && (
          <div className="absolute inset-[-15%] pointer-events-none z-20">
            {[
              { x: 5, y: 10, d: 0, s: 14 }, { x: 82, y: 15, d: 0.5, s: 10 },
              { x: 2, y: 55, d: 1, s: 12 }, { x: 88, y: 50, d: 0.3, s: 9 },
              { x: 45, y: 0, d: 0.8, s: 16 }, { x: 15, y: 35, d: 1.2, s: 8 },
              { x: 75, y: 38, d: 0.6, s: 11 },
            ].map((sp, i) => (
              <div
                key={i}
                className="absolute pi-sparkle"
                style={{
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  width: `${sp.s}px`,
                  height: `${sp.s}px`,
                  animationDelay: `${sp.d}s`,
                }}
              >
                <svg viewBox="0 0 20 20" className="w-full h-full">
                  <path d="M 10 0 L 12 8 L 20 10 L 12 12 L 10 20 L 8 12 L 0 10 L 8 8 Z"
                        fill="#fbbf24" />
                </svg>
              </div>
            ))}
          </div>
        )}

        {/* ── SLEEPING ZZZ ── */}
        {isSleeping && (
          <div className="absolute top-[-5%] right-[-10%] pointer-events-none z-20">
            <span className="absolute text-lg font-bold text-blue-300 pi-zzz" style={{ animationDelay: '0s' }}>z</span>
            <span className="absolute top-[-12px] left-[10px] text-sm font-bold text-blue-300 pi-zzz" style={{ animationDelay: '0.4s' }}>z</span>
            <span className="absolute top-[-22px] left-[18px] text-xs font-bold text-blue-300 pi-zzz" style={{ animationDelay: '0.8s' }}>z</span>
          </div>
        )}
      </div>

      {/* Bath tub front wall (covers lower body) */}
      {showInBath && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[40%] z-20 pointer-events-none">
          <svg viewBox="0 0 200 80" className="w-full h-full" style={{ overflow: 'visible' }}>
            <path d="M 10 8 Q 10 75, 100 80 Q 190 75, 190 8"
                  fill="url(#pi-tub)" stroke="#db2777" strokeWidth="1.5" />
            <ellipse cx="100" cy="10" rx="92" ry="10" fill="#f9a8d4" stroke="#ec4899" strokeWidth="0.5" />
          </svg>
        </div>
      )}

      <style>{`
        .pi-breathe { animation: pi-breathe 3s ease-in-out infinite; }
        .pi-wiggle  { animation: pi-wiggle 0.3s ease-in-out infinite; }
        .pi-bounce  { animation: pi-bounce 0.8s ease-in-out infinite; }
        .pi-happy   { animation: pi-happy 0.5s ease-in-out infinite; }

        @keyframes pi-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.015) translateY(-2px); }
        }
        @keyframes pi-wiggle {
          0%, 100% { transform: rotate(-2deg) scale(1.01); }
          50% { transform: rotate(2deg) scale(1.03); }
        }
        @keyframes pi-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pi-happy {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          25% { transform: translateY(-8px) rotate(1.5deg); }
          50% { transform: translateY(0) rotate(-1.5deg); }
          75% { transform: translateY(-8px) rotate(1.5deg); }
        }

        .pi-bubble-wobble {
          animation: pi-bubble-wobble 2s ease-in-out infinite;
        }
        @keyframes pi-bubble-wobble {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(2px, -2px); }
          66% { transform: scale(0.95) translate(-1px, 1px); }
        }

        .pi-drip {
          animation: pi-drip 1.5s ease-in infinite;
        }
        @keyframes pi-drip {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(30px); opacity: 0; }
        }

        .pi-sparkle {
          animation: pi-sparkle 1.8s ease-in-out infinite;
        }
        @keyframes pi-sparkle {
          0%, 100% { transform: scale(0.3) rotate(0deg); opacity: 0.2; }
          50% { transform: scale(1) rotate(45deg); opacity: 0.9; }
        }

        .pi-zzz {
          animation: pi-zzz 2.5s ease-in-out infinite;
        }
        @keyframes pi-zzz {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          50% { transform: translate(5px, -10px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

export default memo(PuppyImage);
