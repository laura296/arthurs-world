import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightSkyScene from '../../components/scenes/NightSkyScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Pumpkin Patch — tap pumpkins in a moonlit field to give them
 * friendly glowing jack-o-lantern faces. Endlessly replayable.
 * Celebration every 10, Arthur peek every 5. NOT scary — all faces are happy/silly.
 */

const FACE_TYPES = ['happy', 'silly', 'wink', 'surprised'];

const PUMPKIN_COLOURS = [
  { fill: '#f97316', stroke: '#ea580c', highlight: '#fdba74' },
  { fill: '#fb923c', stroke: '#f97316', highlight: '#fed7aa' },
  { fill: '#ef4444', stroke: '#dc2626', highlight: '#fca5a5' },
  { fill: '#f59e0b', stroke: '#d97706', highlight: '#fde68a' },
];

const PUMPKIN_POSITIONS = [
  { x: 12, y: 68 }, { x: 30, y: 72 }, { x: 50, y: 66 },
  { x: 68, y: 70 }, { x: 85, y: 67 }, { x: 20, y: 80 },
  { x: 42, y: 78 }, { x: 60, y: 82 }, { x: 78, y: 76 },
  { x: 8, y: 76 }, { x: 92, y: 74 }, { x: 35, y: 62 },
];

let pumpkinId = 0;

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makePumpkin(posIndex) {
  const pos = PUMPKIN_POSITIONS[posIndex];
  return {
    id: ++pumpkinId,
    posIndex,
    x: pos.x + (Math.random() - 0.5) * 4,
    y: pos.y + (Math.random() - 0.5) * 3,
    colour: randomItem(PUMPKIN_COLOURS),
    face: randomItem(FACE_TYPES),
    size: 55 + Math.random() * 20,
    bobDelay: Math.random() * 2,
    lit: false,
  };
}

function makeInitial(count = 8) {
  return PUMPKIN_POSITIONS.slice(0, count).map((_, i) => makePumpkin(i));
}

/** SVG pumpkin — unlit or lit with a friendly face */
function PumpkinSVG({ colour, face, lit, size = 70 }) {
  const w = size;
  const h = size * 0.85;
  return (
    <svg width={w} height={h} viewBox="0 0 80 68" style={{ filter: lit ? 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.6))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
      {/* Stem */}
      <rect x="36" y="2" width="8" height="12" rx="3" fill="#65a30d" />
      <path d="M40,6 Q50,0 48,8" fill="none" stroke="#4d7c0f" strokeWidth="1.5" />

      {/* Pumpkin body — three overlapping ellipses for ribbed look */}
      <ellipse cx="40" cy="42" rx="32" ry="24" fill={colour.fill} />
      <ellipse cx="28" cy="42" rx="18" ry="22" fill={colour.fill} stroke={colour.stroke} strokeWidth="0.5" opacity="0.7" />
      <ellipse cx="52" cy="42" rx="18" ry="22" fill={colour.fill} stroke={colour.stroke} strokeWidth="0.5" opacity="0.7" />

      {/* Ribs */}
      <ellipse cx="40" cy="42" rx="32" ry="24" fill="none" stroke={colour.stroke} strokeWidth="1" />
      <path d="M40,18 L40,66" fill="none" stroke={colour.stroke} strokeWidth="0.5" opacity="0.3" />
      <path d="M24,20 Q24,42 24,64" fill="none" stroke={colour.stroke} strokeWidth="0.5" opacity="0.2" />
      <path d="M56,20 Q56,42 56,64" fill="none" stroke={colour.stroke} strokeWidth="0.5" opacity="0.2" />

      {/* Highlight */}
      <ellipse cx="30" cy="34" rx="8" ry="12" fill={colour.highlight} opacity="0.3" />

      {/* Face — only when lit */}
      {lit && (
        <g fill="#facc15" opacity="0.95">
          {/* Eyes */}
          {face === 'happy' && (
            <>
              <polygon points="28,34 32,28 36,34" />
              <polygon points="44,34 48,28 52,34" />
            </>
          )}
          {face === 'silly' && (
            <>
              <circle cx="30" cy="32" r="4" />
              <circle cx="50" cy="32" r="4" />
            </>
          )}
          {face === 'wink' && (
            <>
              <polygon points="28,34 32,28 36,34" />
              <path d="M44,32 Q48,28 52,32" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {face === 'surprised' && (
            <>
              <circle cx="30" cy="31" r="4" />
              <circle cx="50" cy="31" r="4" />
            </>
          )}
          {/* Nose */}
          <polygon points="40,38 37,42 43,42" />
          {/* Mouth */}
          {face === 'happy' && <path d="M28,48 Q34,55 40,48 Q46,55 52,48" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />}
          {face === 'silly' && <path d="M30,48 Q40,56 50,48" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />}
          {face === 'wink' && <path d="M32,48 Q40,54 48,48" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />}
          {face === 'surprised' && <ellipse cx="40" cy="50" rx="6" ry="5" />}
        </g>
      )}

      {/* Inner glow when lit */}
      {lit && <ellipse cx="40" cy="42" rx="28" ry="20" fill="#facc15" opacity="0.1" />}
    </svg>
  );
}

export default function PumpkinPatch() {
  const [pumpkins, setPumpkins] = useState(() => makeInitial(8));
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const handleTap = useCallback((pumpkin, e) => {
    if (pumpkin.lit) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Light it up!
    playBoing();
    setPumpkins(prev => prev.map(p =>
      p.id === pumpkin.id ? { ...p, lit: true } : p
    ));

    setTimeout(() => {
      playSparkle();
      playCollectPing();
      burst(cx, cy, {
        colors: ['#facc15', '#f97316', '#fde68a', '#a855f7', '#fff'],
        shapes: ['star', 'circle'],
        count: 16,
        spread: 50,
      });

      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      if (newScore % 5 === 0 && newScore % 10 !== 0) {
        peek('excited');
        playSuccess();
      }

      if (newScore % 10 === 0) {
        setTimeout(() => {
          celebrate({ colors: ['#facc15', '#f97316', '#a855f7', '#fde68a'] });
          playCelebrate();
        }, 400);
      }

      // Respawn after glow period
      setTimeout(() => {
        setPumpkins(prev => prev.map(p =>
          p.id === pumpkin.id ? makePumpkin(pumpkin.posIndex) : p
        ));
      }, 2500);
    }, 300);
  }, [burst, peek, celebrate]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ touchAction: 'manipulation' }}>
      <NightSkyScene />

      {/* Halloween tint overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-orange-900/20 pointer-events-none" />

      {/* Ground — dark grassy field */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: '55%' }}>
        <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <path d="M0,40 Q100,10 200,30 Q350,0 500,25 Q650,5 800,35 L800,300 L0,300 Z"
                fill="#1a3a1a" />
          <path d="M0,60 Q150,35 300,50 Q500,30 700,55 Q770,45 800,60 L800,300 L0,300 Z"
                fill="#0f2a0f" opacity="0.8" />
        </svg>
      </div>

      {/* Floating bats in background */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {[
          { x: '10%', delay: 0 },
          { x: '45%', delay: 2 },
          { x: '75%', delay: 4 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-40"
            style={{
              left: b.x,
              top: '15%',
              animation: `bat-float ${6 + i * 2}s ${b.delay}s ease-in-out infinite alternate`,
            }}
          >
            🦇
          </div>
        ))}
      </div>

      <BackButton />

      {/* Score */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-orange-500/30">
        <span className="text-3xl">🎃</span>
        <span className="text-2xl font-heading text-orange-400 font-bold">{score}</span>
      </div>

      {/* Pumpkins */}
      <AnimatePresence>
        {pumpkins.map(pumpkin => (
          <motion.div
            key={pumpkin.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${pumpkin.x}%`,
              top: `${pumpkin.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onPointerDown={(e) => handleTap(pumpkin, e)}
          >
            <motion.div
              animate={pumpkin.lit
                ? { scale: [1, 1.15, 1.05], rotate: [0, -5, 5, 0] }
                : { y: [0, -4, 0] }
              }
              transition={pumpkin.lit
                ? { duration: 0.4, ease: 'easeOut' }
                : { duration: 2.5, repeat: Infinity, delay: pumpkin.bobDelay, ease: 'easeInOut' }
              }
            >
              <PumpkinSVG colour={pumpkin.colour} face={pumpkin.face} lit={pumpkin.lit} size={pumpkin.size} />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      <style>{`
        @keyframes bat-float {
          0% { transform: translate(0, 0) scaleX(1); }
          25% { transform: translate(30px, -15px) scaleX(-1); }
          50% { transform: translate(60px, 5px) scaleX(1); }
          75% { transform: translate(30px, -10px) scaleX(-1); }
          100% { transform: translate(0, 0) scaleX(1); }
        }
      `}</style>
    </div>
  );
}
