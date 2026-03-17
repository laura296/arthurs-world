import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import NightSkyScene from '../../components/scenes/NightSkyScene';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playSuccess, playCelebrate } from '../../hooks/useSound';

/**
 * Spooky Sounds — tap Halloween creatures to hear fun sounds.
 * Each creature makes a unique synthesised sound via Web Audio API.
 * All sounds are gentle and fun, not scary. For a 3.5 year old.
 */

const CREATURES = [
  { id: 'owl',    emoji: '🦉', label: 'Owl',     colour: '#a16207', bg: 'from-amber-700 to-amber-900' },
  { id: 'cat',    emoji: '🐱', label: 'Cat',     colour: '#1e293b', bg: 'from-gray-700 to-gray-900' },
  { id: 'bat',    emoji: '🦇', label: 'Bat',     colour: '#6b21a8', bg: 'from-purple-700 to-purple-900' },
  { id: 'frog',   emoji: '🐸', label: 'Frog',    colour: '#15803d', bg: 'from-green-700 to-green-900' },
  { id: 'ghost',  emoji: '👻', label: 'Ghost',   colour: '#6366f1', bg: 'from-indigo-600 to-indigo-800' },
  { id: 'wolf',   emoji: '🐺', label: 'Wolf',    colour: '#475569', bg: 'from-slate-600 to-slate-800' },
  { id: 'spider', emoji: '🕷️', label: 'Spider',  colour: '#7c3aed', bg: 'from-violet-700 to-violet-900' },
  { id: 'moon',   emoji: '🌙', label: 'Moon',    colour: '#ca8a04', bg: 'from-yellow-600 to-amber-800' },
  { id: 'wind',   emoji: '🌬️', label: 'Wind',    colour: '#0891b2', bg: 'from-cyan-700 to-cyan-900' },
];

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playCreatureSound(id) {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.3, now);

  if (id === 'owl') {
    // Hoo-hoo — two descending tones
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.3);
    osc.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
    // Second hoo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    gain2.connect(ctx.destination);
    gain2.gain.setValueAtTime(0.25, now + 0.5);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(450, now + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.8);
    osc2.connect(gain2);
    osc2.start(now + 0.5);
    osc2.stop(now + 0.9);
  } else if (id === 'cat') {
    // Meow — rising then falling
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    osc.frequency.linearRampToValueAtTime(400, now + 0.5);
    osc.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (id === 'bat') {
    // High chirpy squeaks
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.15, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.08);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + i * 200, now + i * 0.12);
      osc.connect(g);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.08);
    }
  } else if (id === 'frog') {
    // Ribbit — quick low burble
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.1);
    osc.frequency.setValueAtTime(150, now + 0.2);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    osc.connect(gain);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (id === 'ghost') {
    // Wooooo — gentle wavering tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(500, now + 0.3);
    osc.frequency.linearRampToValueAtTime(350, now + 0.6);
    osc.frequency.linearRampToValueAtTime(450, now + 0.9);
    osc.connect(gain);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
    osc.start(now);
    osc.stop(now + 1);
  } else if (id === 'wolf') {
    // Howl — rising slide
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.8);
    osc.connect(gain);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
    osc.start(now);
    osc.stop(now + 0.9);
  } else if (id === 'spider') {
    // Tickly plucking
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.2, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.06);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + i * 100, now + i * 0.1);
      osc.connect(g);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.06);
    }
  } else if (id === 'moon') {
    // Ethereal chime
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.connect(gain);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc.start(now);
    osc.stop(now + 1.2);
    // Harmonic
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    g2.connect(ctx.destination);
    g2.gain.setValueAtTime(0.1, now);
    g2.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.connect(g2);
    osc2.start(now);
    osc2.stop(now + 1.5);
  } else if (id === 'wind') {
    // Whoosh — filtered noise-like effect
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.4);
    filter.frequency.linearRampToValueAtTime(300, now + 0.8);
    filter.Q.value = 2;
    osc.connect(filter);
    filter.connect(gain);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
    osc.start(now);
    osc.stop(now + 0.9);
  }
}

export default function SpookySounds() {
  const [activeId, setActiveId] = useState(null);
  const tapCount = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const handleTap = useCallback((creature, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    playCreatureSound(creature.id);
    setActiveId(creature.id);
    setTimeout(() => setActiveId(null), 600);

    burst(cx, cy, {
      colors: [creature.colour, '#facc15', '#a855f7', '#fff'],
      shapes: ['star', 'circle'],
      count: 10,
      spread: 40,
    });

    const count = ++tapCount.current;
    if (count % 9 === 0) {
      peek('excited');
      playSuccess();
    }
    if (count % 18 === 0) {
      setTimeout(() => {
        celebrate({ colors: ['#facc15', '#a855f7', '#f97316', '#c4b5fd'] });
        playCelebrate();
      }, 400);
    }
  }, [burst, peek, celebrate]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ touchAction: 'manipulation' }}>
      <NightSkyScene />

      {/* Purple Halloween overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-gray-900/30 pointer-events-none" />

      <BackButton />

      {/* Title */}
      <motion.div
        className="absolute top-16 left-0 right-0 text-center z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <h2 className="text-3xl font-heading text-purple-200 drop-shadow"
            style={{ textShadow: '0 2px 8px rgba(139, 92, 246, 0.4)' }}>
          🦇 Spooky Sounds 🎃
        </h2>
      </motion.div>

      {/* 3x3 grid of creature buttons */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="grid grid-cols-3 gap-4 p-6 max-w-sm">
          {CREATURES.map((creature, i) => (
            <motion.button
              key={creature.id}
              className={`relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center
                         bg-gradient-to-br ${creature.bg} border-2 border-white/20
                         shadow-lg cursor-pointer overflow-hidden`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.06 }}
              whileTap={{ scale: 0.9 }}
              onPointerDown={(e) => handleTap(creature, e)}
            >
              {/* Glow ring when active */}
              {activeId === creature.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ boxShadow: '0 0 0 0 rgba(250, 204, 21, 0)' }}
                  animate={{ boxShadow: '0 0 20px 4px rgba(250, 204, 21, 0.5)' }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="text-4xl">{creature.emoji}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Ground fog effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none z-[5]"
           style={{ background: 'linear-gradient(to top, rgba(139,92,246,0.15) 0%, transparent 100%)' }} />

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
