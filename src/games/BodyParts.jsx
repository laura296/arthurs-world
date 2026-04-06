import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playSparkle } from '../hooks/useSound';
import { useCelebration } from '../components/CelebrationOverlay';

/**
 * Body Parts — tap parts of Arthur Bear's body to learn their names.
 * Big visual labels with sounds. Perfect for ~3.5 year old.
 */

const BODY_PARTS = [
  // Head area
  { id: 'head',   emoji: '🧠', label: 'Head',   x: 50, y: 8,  w: 18, h: 10, freq: 523, colour: '#f59e0b' },
  { id: 'eyes',   emoji: '👀', label: 'Eyes',   x: 50, y: 17, w: 20, h: 6,  freq: 587, colour: '#3b82f6' },
  { id: 'nose',   emoji: '👃', label: 'Nose',   x: 50, y: 24, w: 10, h: 6,  freq: 659, colour: '#f97316' },
  { id: 'mouth',  emoji: '👄', label: 'Mouth',  x: 50, y: 31, w: 14, h: 6,  freq: 698, colour: '#ef4444' },
  { id: 'ears',   emoji: '👂', label: 'Ears',   x: 26, y: 14, w: 10, h: 8,  freq: 440, colour: '#a855f7' },
  // Body
  { id: 'tummy',  emoji: '🫃', label: 'Tummy',  x: 50, y: 48, w: 24, h: 14, freq: 330, colour: '#22c55e' },
  { id: 'hands',  emoji: '🤲', label: 'Hands',  x: 22, y: 52, w: 14, h: 10, freq: 784, colour: '#ec4899' },
  { id: 'arms',   emoji: '💪', label: 'Arms',   x: 78, y: 42, w: 14, h: 12, freq: 494, colour: '#06b6d4' },
  { id: 'legs',   emoji: '🦵', label: 'Legs',   x: 42, y: 70, w: 14, h: 16, freq: 262, colour: '#8b5cf6' },
  { id: 'feet',   emoji: '🦶', label: 'Feet',   x: 58, y: 82, w: 14, h: 10, freq: 880, colour: '#f43f5e' },
];

/** Simple synth to say body part with a musical note */
function playBodySound(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    // Play a cheerful two-note sound
    [freq, freq * 1.25].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  } catch (e) { /* silent fail */ }
}

/** SVG bear body - simple, chunky, tappable zones */
function BearBody({ onPartTap, tappedParts, activePart }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[65vh]">
      {/* Body */}
      <ellipse cx="50" cy="52" rx="22" ry="26" fill="#c4956a" />
      {/* Tummy patch */}
      <ellipse cx="50" cy="54" rx="14" ry="16" fill="#deb887" />
      {/* Head */}
      <circle cx="50" cy="20" r="16" fill="#c4956a" />
      {/* Ears */}
      <circle cx="36" cy="8" r="7" fill="#c4956a" />
      <circle cx="36" cy="8" r="4" fill="#deb887" />
      <circle cx="64" cy="8" r="7" fill="#c4956a" />
      <circle cx="64" cy="8" r="4" fill="#deb887" />
      {/* Eyes */}
      <circle cx="44" cy="18" r="3" fill="#1e293b" />
      <circle cx="56" cy="18" r="3" fill="#1e293b" />
      <circle cx="45" cy="17" r="1" fill="white" />
      <circle cx="57" cy="17" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="24" rx="3" ry="2.5" fill="#1e293b" />
      {/* Mouth */}
      <path d="M46 27 Q50 31 54 27" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
      {/* Arms */}
      <ellipse cx="26" cy="48" rx="7" ry="12" fill="#c4956a" transform="rotate(-15 26 48)" />
      <ellipse cx="74" cy="48" rx="7" ry="12" fill="#c4956a" transform="rotate(15 74 48)" />
      {/* Hands */}
      <circle cx="22" cy="58" r="5" fill="#deb887" />
      <circle cx="78" cy="58" r="5" fill="#deb887" />
      {/* Legs */}
      <ellipse cx="40" cy="76" rx="8" ry="12" fill="#c4956a" />
      <ellipse cx="60" cy="76" rx="8" ry="12" fill="#c4956a" />
      {/* Feet */}
      <ellipse cx="38" cy="88" rx="9" ry="5" fill="#deb887" />
      <ellipse cx="62" cy="88" rx="9" ry="5" fill="#deb887" />

      {/* Tappable hotspot zones */}
      {BODY_PARTS.map(part => {
        const isTapped = tappedParts.has(part.id);
        const isActive = activePart === part.id;
        return (
          <g key={part.id} onClick={() => onPartTap(part)}>
            <rect
              x={part.x - part.w / 2}
              y={part.y - part.h / 2}
              width={part.w}
              height={part.h}
              rx={3}
              fill={isActive ? part.colour + '40' : 'transparent'}
              stroke={isTapped ? part.colour : 'transparent'}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isTapped ? '' : '2 2'}
              className="cursor-pointer"
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function BodyParts() {
  const [tappedParts, setTappedParts] = useState(new Set());
  const [activePart, setActivePart] = useState(null);
  const [showLabel, setShowLabel] = useState(null);
  const { celebrate, overlay } = useCelebration();

  const handlePartTap = useCallback((part) => {
    playPop();
    playBodySound(part.freq);
    setActivePart(part.id);
    setShowLabel(part);

    const newTapped = new Set(tappedParts);
    newTapped.add(part.id);
    setTappedParts(newTapped);

    if (newTapped.size >= BODY_PARTS.length && tappedParts.size < BODY_PARTS.length) {
      setTimeout(() => {
        playSparkle();
        celebrate();
      }, 800);
    } else if (!tappedParts.has(part.id)) {
      setTimeout(() => playSuccess(), 300);
    }

    // Clear active after a moment
    setTimeout(() => {
      setActivePart(null);
      setShowLabel(null);
    }, 1500);
  }, [tappedParts, celebrate]);

  const reset = useCallback(() => {
    setTappedParts(new Set());
    setActivePart(null);
    setShowLabel(null);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-200 to-emerald-100">
      <BackButton />
      {overlay}

      <div className="relative z-10 flex flex-col items-center h-full pt-16 pb-6 px-4">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🧸</span>
          <div className="flex gap-1">
            {BODY_PARTS.map(part => (
              <motion.div
                key={part.id}
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: tappedParts.has(part.id) ? part.colour : '#e2e8f0' }}
                animate={tappedParts.has(part.id) ? { scale: [1, 1.3, 1] } : {}}
              />
            ))}
          </div>
        </div>

        {/* Bear with tappable zones */}
        <div className="flex-1 w-full max-w-xs relative">
          <BearBody
            onPartTap={handlePartTap}
            tappedParts={tappedParts}
            activePart={activePart}
          />

          {/* Floating label */}
          <AnimatePresence>
            {showLabel && (
              <motion.div
                key={showLabel.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                className="absolute left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
                style={{
                  background: showLabel.colour,
                  top: `${Math.min(showLabel.y + 5, 60)}%`,
                }}
              >
                <span className="text-3xl">{showLabel.emoji}</span>
                <span className="text-2xl font-heading text-white drop-shadow-lg">
                  {showLabel.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm font-heading text-sky-700/50">
            {tappedParts.size === 0
              ? 'Tap the bear!'
              : tappedParts.size >= BODY_PARTS.length
                ? 'You found them all!'
                : `${tappedParts.size}/${BODY_PARTS.length} found`}
          </p>
          {tappedParts.size > 0 && (
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded-xl bg-white/50 text-sky-700 font-heading text-xs"
            >
              Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
