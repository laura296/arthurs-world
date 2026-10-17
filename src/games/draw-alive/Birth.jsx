import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { OUTLINE } from './sprite';
import {
  playTap, playSnap, playPop, playSplash, playSparkle, playWhoosh, playFlap, playThud,
} from '../../hooks/useSound';

/** Seconds until the creature appears, per birth type. */
export const REVEAL = { egg: 1.75, cocoon: 1.65, bubble: 1.5, portal: 1.25, flower: 1.45, puddle: 1.35 };
const LINGER = 0.9;

/** Sounds along each birth's timeline: [seconds, sound]. */
const CUES = {
  egg: [[0.42, playThud], [0.75, playTap], [1.05, playTap], [1.3, playSnap], [1.6, playSnap]],
  cocoon: [[0.2, playFlap], [0.9, playTap], [1.4, playSnap]],
  bubble: [[0.1, playSplash], [1.45, playPop]],
  portal: [[0.05, playSparkle], [0.6, playSparkle], [1.15, playWhoosh]],
  flower: [[0.1, playSparkle], [1.0, playPop]],
  puddle: [[0.05, playSplash], [0.6, playPop], [0.95, playPop], [1.25, playSplash]],
};

/* ── Egg and cocoon: a shell that cracks along a zigzag and splits ── */

const SHELLS = {
  egg: {
    view: '0 0 100 120',
    path: 'M50 4 C 80 4 96 50 96 78 C 96 104 76 118 50 118 C 24 118 4 104 4 78 C 4 50 20 4 50 4 Z',
    crack: 'M4 64 L16 54 L28 66 L40 54 L52 66 L64 54 L76 66 L88 54 L96 62',
    top: '0,0 100,0 100,62 88,54 76,66 64,54 52,66 40,54 28,66 16,54 4,64 0,64',
    bottom: '0,64 4,64 16,54 28,66 40,54 52,66 64,54 76,66 88,54 100,62 100,120 0,120',
    fill: '#FFF6E0',
  },
  cocoon: {
    view: '0 0 100 120',
    path: 'M50 6 C 72 6 84 36 84 64 C 84 96 68 116 50 116 C 32 116 16 96 16 64 C 16 36 28 6 50 6 Z',
    crack: 'M16 62 L26 54 L36 64 L46 54 L56 64 L66 54 L76 64 L84 58',
    top: '0,0 100,0 100,58 84,58 76,64 66,54 56,64 46,54 36,64 26,54 16,62 0,62',
    bottom: '0,62 16,62 26,54 36,64 46,54 56,64 66,54 76,64 84,58 100,58 100,120 0,120',
    fill: '#B5C97A',
  },
};

function ShellArt({ kind, tint, half, id }) {
  const s = SHELLS[kind];
  const clip = `${id}-${half}`;
  return (
    <svg viewBox={s.view} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={clip}><polygon points={half === 'top' ? s.top : s.bottom} /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d={s.path} fill={s.fill} stroke={OUTLINE} strokeWidth="4" />
        {kind === 'egg' ? (
          <g fill={tint} opacity="0.75">
            <circle cx="34" cy="34" r="6" /><circle cx="64" cy="26" r="4" /><circle cx="70" cy="50" r="7" />
            <circle cx="28" cy="80" r="7" /><circle cx="58" cy="92" r="5" /><circle cx="78" cy="84" r="4" />
          </g>
        ) : (
          <g fill="none" stroke="#7c8a3e" strokeWidth="3" strokeLinecap="round" opacity="0.7">
            <path d="M24 40 Q 50 48 76 40" /><path d="M18 76 Q 50 86 82 76" /><path d="M22 98 Q 50 106 78 98" />
          </g>
        )}
        <ellipse cx="36" cy="30" rx="8" ry="14" fill="#fff" opacity="0.45" />
      </g>
    </svg>
  );
}

function Shell({ kind, size, tint }) {
  const id = `shell-${kind}`;
  const reveal = REVEAL[kind];
  const total = reveal + LINGER;
  const at = (s) => s / total;
  const w = size * (kind === 'egg' ? 0.72 : 0.5);
  const h = w * 1.2;
  const hang = kind === 'cocoon';

  return (
    <motion.div
      className="absolute"
      style={{ left: -w / 2, top: -h / 2, width: w, height: h, transformOrigin: hang ? '50% 0%' : '50% 100%' }}
      initial={hang ? { scale: 0 } : { y: -size * 3 }}
      animate={hang
        ? { scale: 1, rotate: [0, 10, -10, 8, -8, 12, -12, 0] }
        : { y: 0, rotate: [0, 0, -12, 12, 0, 0, -16, 16, -10, 0] }}
      transition={hang
        ? { scale: { type: 'spring', stiffness: 200, damping: 14 }, rotate: { duration: reveal, ease: 'easeInOut' } }
        : { y: { type: 'spring', stiffness: 260, damping: 13 }, rotate: { duration: reveal, times: [0, 0.38, 0.45, 0.52, 0.58, 0.66, 0.74, 0.82, 0.9, 1] } }}
    >
      {/* Glow building up inside */}
      <motion.div className="absolute inset-[-30%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(253,224,71,0) 65%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.6, 1, 0] }}
        transition={{ duration: total, times: [0, at(0.9), at(reveal - 0.2), at(reveal), at(reveal + 0.4)] }} />

      {/* Bottom half stays put, then fades */}
      <motion.div className="absolute inset-0"
        animate={{ opacity: [1, 1, 0], y: [0, 0, 6] }}
        transition={{ duration: total, times: [0, at(reveal + 0.35), 1] }}>
        <ShellArt kind={kind} tint={tint} half="bottom" id={id} />
      </motion.div>

      {/* Top half pops off */}
      <motion.div className="absolute inset-0"
        animate={{ x: [0, 0, -w * 0.9], y: [0, 0, -h * 1.1], rotate: [0, 0, -75], opacity: [1, 1, 0] }}
        transition={{ duration: total, times: [0, at(reveal), 1], ease: 'easeOut' }}>
        <ShellArt kind={kind} tint={tint} half="top" id={id} />
      </motion.div>

      {/* Cracks appear while it wobbles */}
      <svg viewBox={SHELLS[kind].view} className="absolute inset-0 w-full h-full" aria-hidden="true">
        <motion.path d={SHELLS[kind].crack} fill="none" stroke={OUTLINE} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: [0, 0, 0.45, 0.45, 1, 1], opacity: [1, 1, 1, 1, 1, 0] }}
          transition={{ duration: total, times: [0, at(1.2), at(1.3), at(1.5), at(1.6), at(reveal)] }} />
      </svg>
    </motion.div>
  );
}

/* ── Sea: a big bubble rises from the sand with the creature inside ── */
function Bubble({ size, src, rise }) {
  const reveal = REVEAL.bubble;
  const total = reveal + LINGER;
  const d = size * 1.15;
  const popAt = reveal / total;
  return (
    <motion.div className="absolute rounded-full"
      style={{
        left: -d / 2, top: -d / 2, width: d, height: d,
        background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.12) 28%, rgba(186,230,253,0.18) 62%, rgba(255,255,255,0.55) 100%)',
        boxShadow: 'inset 0 0 18px rgba(255,255,255,0.7), 0 0 20px rgba(186,230,253,0.5)',
      }}
      initial={{ y: rise, scale: 0.3 }}
      animate={{
        y: [rise, rise * 0.5, 0, 0],
        scale: [0.3, 1, 1, 1.35],
        opacity: [1, 1, 1, 0],
      }}
      transition={{ duration: total, times: [0, popAt * 0.45, popAt, Math.min(1, popAt + 0.12)], ease: 'easeOut' }}>
      <motion.img src={src} alt="" draggable={false}
        className="absolute inset-[15%] w-[70%] h-[70%] object-contain"
        animate={{ rotate: [-6, 6, -6], opacity: [1, 1, 0] }}
        transition={{ rotate: { duration: 1.2, repeat: Infinity }, opacity: { duration: total, times: [0, popAt - 0.02, popAt] } }} />
    </motion.div>
  );
}

/* ── Space: a swirling star portal opens and the creature shoots out ── */
function Portal({ size }) {
  const reveal = REVEAL.portal;
  const total = reveal + LINGER;
  const d = size * 1.5;
  const r = reveal / total;
  return (
    <>
      <motion.div className="absolute rounded-full"
        style={{
          left: -d / 2, top: -d / 2, width: d, height: d,
          background: 'conic-gradient(from 0deg, #a855f7, #38bdf8, #fde047, #ec4899, #a855f7)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 46%, black 48%, black 62%, transparent 64%)',
          maskImage: 'radial-gradient(circle, transparent 46%, black 48%, black 62%, transparent 64%)',
          filter: 'blur(1px) drop-shadow(0 0 12px rgba(168,85,247,0.9))',
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: [0, 1, 1.1, 0], rotate: 900 }}
        transition={{ scale: { duration: total, times: [0, r * 0.45, r, 1] }, rotate: { duration: total, ease: 'linear' } }} />
      <motion.div className="absolute rounded-full"
        style={{
          left: -d * 0.35, top: -d * 0.35, width: d * 0.7, height: d * 0.7,
          background: 'radial-gradient(circle, #ffffff 0%, #fde68a 30%, rgba(168,85,247,0.6) 60%, rgba(168,85,247,0) 72%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.6, 1.3, 0], opacity: [0, 0.7, 1, 0] }}
        transition={{ duration: total, times: [0, r * 0.6, r, Math.min(1, r + 0.25)] }} />
    </>
  );
}

/* ── Jungle: a flower grows, opens, and the creature pops out ── */
function Flower({ size, tint }) {
  const reveal = REVEAL.flower;
  const total = reveal + LINGER;
  const r = reveal / total;
  const petal = size * 0.32;
  const stem = size * 0.55;
  const colours = ['#f9a8d4', '#fbcfe8', '#f472b6'];
  return (
    <motion.div className="absolute"
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: total, times: [0, r + 0.15, 1] }}>
      <motion.div className="absolute rounded-full"
        style={{ left: -5, top: 0, width: 10, height: stem, background: '#4d7c0f', transformOrigin: '50% 100%' }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * 360;
        return (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              left: -petal / 2, top: -petal, width: petal, height: petal * 1.6,
              background: colours[i % 3], border: `3px solid ${OUTLINE}`, transformOrigin: '50% 100%',
            }}
            initial={{ rotate: a, scale: 0 }}
            animate={{ rotate: a, scale: [0, 0.45, 0.45, 1.05, 1], y: [0, 0, 0, -petal * 0.15, 0] }}
            transition={{ duration: reveal, times: [0, 0.4, 0.68, 0.9, 1] }} />
        );
      })}
      <motion.div className="absolute rounded-full"
        style={{ left: -petal * 0.4, top: -petal * 0.4, width: petal * 0.8, height: petal * 0.8, background: tint, border: `3px solid ${OUTLINE}` }}
        initial={{ scale: 0 }} animate={{ scale: [0, 0.6, 0.6, 1] }}
        transition={{ duration: reveal, times: [0, 0.4, 0.7, 1] }} />
    </motion.div>
  );
}

/* ── Farm: a mud puddle bubbles and the creature splashes up ── */
function Puddle({ size }) {
  const reveal = REVEAL.puddle;
  const total = reveal + LINGER;
  const r = reveal / total;
  const w = size * 1.1;
  return (
    <motion.div className="absolute"
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: total, times: [0, r + 0.2, 1] }}>
      <motion.div className="absolute rounded-[50%]"
        style={{
          left: -w / 2, top: -w * 0.14, width: w, height: w * 0.28,
          background: 'radial-gradient(ellipse at 45% 40%, #a16207 0%, #78350f 70%)',
          border: `3px solid ${OUTLINE}`,
        }}
        initial={{ scaleX: 0, scaleY: 0 }} animate={{ scaleX: 1, scaleY: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 15 }} />
      {[[-0.22, 0.45], [0.08, 0.75], [0.25, 1.0]].map(([dx, t], i) => (
        <motion.div key={i} className="absolute rounded-full border-2"
          style={{ left: dx * w - 8, top: -10, width: 16, height: 16, background: '#92400e', borderColor: OUTLINE }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 0, 1, 1.3, 0], y: [0, 0, -6, -10, -12] }}
          transition={{ duration: reveal, times: [0, t / reveal, (t + 0.15) / reveal, (t + 0.25) / reveal, (t + 0.3) / reveal] }} />
      ))}
    </motion.div>
  );
}

/**
 * The moment a new creature arrives in its world.
 *
 * Props:
 *   type     — egg | cocoon | bubble | portal | flower | puddle
 *   x, y     — where the creature will appear (stage pixels)
 *   size     — the creature's longest side in pixels
 *   src      — creature image (shown inside the bubble)
 *   tint     — world accent, used for egg speckles and flower centre
 *   rise     — bubble only: how far below the reveal point it starts
 *   onDone   — called once the leftovers have faded
 */
export default function Birth({ type, x, y, size, src, tint, rise = 0, onDone }) {
  useEffect(() => {
    const timers = (CUES[type] || []).map(([s, play]) => setTimeout(play, s * 1000));
    timers.push(setTimeout(onDone, (REVEAL[type] + LINGER) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [type, onDone]);

  const anchor = type === 'puddle' ? y + size * 0.38 : y;

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: anchor, zIndex: 900 }}>
      {type === 'cocoon' && (
        <motion.div className="absolute"
          style={{ left: -1, top: -anchor, width: 2, height: anchor - size * 0.3, background: 'rgba(255,255,255,0.75)', transformOrigin: '50% 0%' }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1, opacity: [1, 1, 0] }}
          transition={{ scaleY: { duration: 0.4 }, opacity: { duration: REVEAL.cocoon + LINGER, times: [0, 0.8, 1] } }} />
      )}
      {(type === 'egg' || type === 'cocoon') && <Shell kind={type} size={size} tint={tint} />}
      {type === 'bubble' && <Bubble size={size} src={src} rise={rise} />}
      {type === 'portal' && <Portal size={size} />}
      {type === 'flower' && <Flower size={size} tint={tint} />}
      {type === 'puddle' && <Puddle size={size} />}
    </div>
  );
}
