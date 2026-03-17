import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightSkyScene from '../../components/scenes/NightSkyScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing } from '../../hooks/useSound';

/**
 * Ghost Peekaboo — friendly ghosts peek out from hiding spots.
 * Tap them before they hide again! All ghosts are cute and silly,
 * never scary. Endlessly replayable with increasing speed.
 */

const GHOST_FACES = ['happy', 'silly', 'shy', 'giggly'];
const GHOST_COLOURS = ['#e2e8f0', '#ddd6fe', '#bfdbfe', '#fce7f3', '#d9f99d'];

const HIDING_SPOTS = [
  { x: 10, y: 45, type: 'tree' },
  { x: 30, y: 50, type: 'bush' },
  { x: 50, y: 42, type: 'gravestone' },
  { x: 70, y: 48, type: 'tree' },
  { x: 88, y: 44, type: 'bush' },
  { x: 20, y: 62, type: 'bush' },
  { x: 42, y: 65, type: 'gravestone' },
  { x: 62, y: 60, type: 'tree' },
  { x: 80, y: 63, type: 'bush' },
];

let ghostId = 0;

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeGhost(spotIndex) {
  return {
    id: ++ghostId,
    spotIndex,
    colour: randomItem(GHOST_COLOURS),
    face: randomItem(GHOST_FACES),
    peeking: false,
    caught: false,
  };
}

/** SVG friendly ghost */
function GhostSVG({ colour, face }) {
  return (
    <svg width={65} height={75} viewBox="0 0 65 75" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}>
      {/* Body */}
      <path d="M10,35 Q10,5 32.5,5 Q55,5 55,35 L55,60 Q50,52 45,60 Q40,52 35,60 Q30,52 25,60 Q20,52 15,60 L10,60 Z"
            fill={colour} opacity="0.9" />
      {/* Cheeks */}
      <circle cx="18" cy="38" r="5" fill="#fda4af" opacity="0.3" />
      <circle cx="47" cy="38" r="5" fill="#fda4af" opacity="0.3" />

      {/* Eyes */}
      {face === 'happy' && (
        <>
          <ellipse cx="22" cy="30" rx="5" ry="6" fill="#1e293b" />
          <ellipse cx="43" cy="30" rx="5" ry="6" fill="#1e293b" />
          <circle cx="24" cy="28" r="2" fill="white" />
          <circle cx="45" cy="28" r="2" fill="white" />
        </>
      )}
      {face === 'silly' && (
        <>
          <circle cx="22" cy="30" r="5" fill="#1e293b" />
          <circle cx="43" cy="30" r="5" fill="#1e293b" />
          <circle cx="24" cy="28" r="2" fill="white" />
          <circle cx="45" cy="28" r="2" fill="white" />
        </>
      )}
      {face === 'shy' && (
        <>
          <path d="M18,30 Q22,26 26,30" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M39,30 Q43,26 47,30" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {face === 'giggly' && (
        <>
          <path d="M18,28 Q22,32 26,28" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M39,28 Q43,32 47,28" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      {face === 'happy' && <path d="M26,42 Q32.5,50 39,42" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />}
      {face === 'silly' && <ellipse cx="32.5" cy="44" rx="6" ry="4" fill="#1e293b" />}
      {face === 'shy' && <circle cx="32.5" cy="44" r="3" fill="#fda4af" opacity="0.6" />}
      {face === 'giggly' && <path d="M24,40 Q32.5,52 41,40" fill="#1e293b" />}
    </svg>
  );
}

/** Hiding-spot decorations */
function HidingSpot({ type }) {
  if (type === 'tree') {
    return (
      <svg width={80} height={90} viewBox="0 0 80 90">
        <rect x="35" y="50" width="10" height="40" fill="#3d2b1a" rx="2" />
        <ellipse cx="40" cy="40" rx="35" ry="35" fill="#1a3a1a" />
        <ellipse cx="30" cy="35" rx="8" ry="10" fill="#22461e" opacity="0.6" />
      </svg>
    );
  }
  if (type === 'bush') {
    return (
      <svg width={80} height={55} viewBox="0 0 80 55">
        <ellipse cx="40" cy="35" rx="38" ry="20" fill="#1a3a1a" />
        <ellipse cx="25" cy="30" rx="20" ry="18" fill="#1e4620" />
        <ellipse cx="55" cy="32" rx="22" ry="16" fill="#1a3a1a" />
      </svg>
    );
  }
  // gravestone — friendly rounded shape
  return (
    <svg width={50} height={65} viewBox="0 0 50 65">
      <path d="M8,65 L8,20 Q8,5 25,5 Q42,5 42,20 L42,65 Z" fill="#64748b" />
      <path d="M12,65 L12,22 Q12,10 25,10 Q38,10 38,22 L38,65 Z" fill="#94a3b8" opacity="0.4" />
    </svg>
  );
}

export default function GhostPeekaboo() {
  const [ghosts, setGhosts] = useState(() =>
    HIDING_SPOTS.map((_, i) => makeGhost(i))
  );
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [peekInterval, setPeekInterval] = useState(2500);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  // Randomly make ghosts peek out
  useEffect(() => {
    const timer = setInterval(() => {
      setGhosts(prev => {
        const hidden = prev.filter(g => !g.peeking && !g.caught);
        if (hidden.length === 0) return prev;
        const pick = hidden[Math.floor(Math.random() * hidden.length)];
        return prev.map(g => g.id === pick.id ? { ...g, peeking: true } : g);
      });
    }, peekInterval);
    return () => clearInterval(timer);
  }, [peekInterval]);

  // Auto-hide ghosts after peeking
  useEffect(() => {
    const timer = setInterval(() => {
      setGhosts(prev => prev.map(g => {
        if (g.peeking && !g.caught) return { ...g, peeking: false };
        return g;
      }));
    }, peekInterval + 1500);
    return () => clearInterval(timer);
  }, [peekInterval]);

  const handleTapGhost = useCallback((ghost, e) => {
    if (!ghost.peeking || ghost.caught) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    playPop();
    playSparkle();
    playCollectPing();

    burst(cx, cy, {
      colors: [ghost.colour, '#facc15', '#a855f7', '#fff', '#c4b5fd'],
      shapes: ['star', 'circle', 'heart'],
      count: 16,
      spread: 55,
    });

    setGhosts(prev => prev.map(g =>
      g.id === ghost.id ? { ...g, caught: true } : g
    ));

    const newScore = scoreRef.current + 1;
    scoreRef.current = newScore;
    setScore(newScore);

    // Speed up slightly every 8 catches
    if (newScore % 8 === 0) {
      setPeekInterval(prev => Math.max(1200, prev - 200));
    }

    if (newScore % 5 === 0 && newScore % 10 !== 0) {
      peek('excited');
      playSuccess();
    }

    if (newScore % 10 === 0) {
      setTimeout(() => {
        celebrate({ colors: ['#c4b5fd', '#facc15', '#a855f7', '#e2e8f0'] });
        playCelebrate();
      }, 400);
    }

    // Respawn ghost
    setTimeout(() => {
      setGhosts(prev => prev.map(g =>
        g.id === ghost.id ? makeGhost(ghost.spotIndex) : g
      ));
    }, 2000);
  }, [burst, peek, celebrate]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ touchAction: 'manipulation' }}>
      <NightSkyScene />

      {/* Purple-ish Halloween tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-indigo-900/30 pointer-events-none" />

      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: '55%' }}>
        <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <path d="M0,30 Q200,0 400,25 Q600,5 800,30 L800,300 L0,300 Z" fill="#1a2a1a" />
          <path d="M0,50 Q250,25 500,45 Q700,30 800,55 L800,300 L0,300 Z" fill="#0f1a0f" opacity="0.7" />
        </svg>
      </div>

      <BackButton />

      {/* Score */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-500/30">
        <span className="text-3xl">👻</span>
        <span className="text-2xl font-heading text-purple-300 font-bold">{score}</span>
      </div>

      {/* Hiding spots + ghosts */}
      {HIDING_SPOTS.map((spot, i) => {
        const ghost = ghosts[i];
        return (
          <div
            key={i}
            className="absolute z-10"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Ghost (peeks above the hiding spot) */}
            <AnimatePresence>
              {ghost && ghost.peeking && !ghost.caught && (
                <motion.div
                  className="absolute cursor-pointer z-20"
                  style={{ bottom: '60%', left: '50%', transform: 'translateX(-50%)' }}
                  initial={{ y: 30, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 30, opacity: 0, scale: 0.3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  onPointerDown={(e) => handleTapGhost(ghost, e)}
                  whileTap={{ scale: 1.2 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <GhostSVG colour={ghost.colour} face={ghost.face} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Caught sparkle burst */}
            <AnimatePresence>
              {ghost && ghost.caught && (
                <motion.div
                  className="absolute z-20 text-4xl pointer-events-none"
                  style={{ bottom: '60%', left: '50%', transform: 'translateX(-50%)' }}
                  initial={{ scale: 1.5, opacity: 1 }}
                  animate={{ scale: 0, opacity: 0, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hiding spot decoration */}
            <HidingSpot type={spot.type} />
          </div>
        );
      })}

      {/* Floating pumpkin lanterns in background */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {['8%', '35%', '65%', '88%'].map((x, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-30"
            style={{ left: x, top: `${20 + i * 5}%` }}
            animate={{ y: [0, -10, 0], x: [0, 5, -5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          >
            🎃
          </motion.div>
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
