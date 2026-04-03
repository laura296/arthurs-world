import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playBoing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useCelebration } from '../../components/CelebrationOverlay';

/* Colour mixing rules */
const MIXES = [
  { a: 'red',    b: 'yellow', result: 'orange',  emoji: '🟠', aHex: '#ef4444', bHex: '#facc15', rHex: '#f97316' },
  { a: 'red',    b: 'blue',   result: 'purple',  emoji: '🟣', aHex: '#ef4444', bHex: '#3b82f6', rHex: '#a855f7' },
  { a: 'blue',   b: 'yellow', result: 'green',   emoji: '🟢', aHex: '#3b82f6', bHex: '#facc15', rHex: '#22c55e' },
  { a: 'red',    b: 'white',  result: 'pink',    emoji: '🩷', aHex: '#ef4444', bHex: '#f8fafc', rHex: '#f472b6' },
  { a: 'blue',   b: 'white',  result: 'light blue', emoji: '🩵', aHex: '#3b82f6', bHex: '#f8fafc', rHex: '#7dd3fc' },
];

const PRIMARY_COLOURS = [
  { id: 'red',    hex: '#ef4444', emoji: '🔴' },
  { id: 'blue',   hex: '#3b82f6', emoji: '🔵' },
  { id: 'yellow', hex: '#facc15', emoji: '🟡' },
  { id: 'white',  hex: '#f8fafc', emoji: '⚪' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(exclude = []) {
  const available = MIXES.filter(m => !exclude.includes(m.result));
  const mix = available.length > 0 ? shuffle(available)[0] : shuffle(MIXES)[0];
  return mix;
}

export default function ColourMixing() {
  const [round, setRound] = useState(() => pickRound());
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('picking'); // picking | mixed | celebrate
  const [mixCount, setMixCount] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { celebrate, CelebrationLayer } = useCelebration();

  const handleTap = useCallback((colour) => {
    if (phase !== 'picking') return;
    if (selected.length >= 2) return;

    playPop();
    const next = [...selected, colour];
    setSelected(next);

    if (next.length === 2) {
      // Check if this pair makes a valid mix
      const mix = MIXES.find(m =>
        (m.a === next[0].id && m.b === next[1].id) ||
        (m.b === next[0].id && m.a === next[1].id)
      );

      if (mix) {
        setPhase('mixed');
        playSparkle();
        playSuccess();
        burst(window.innerWidth / 2, window.innerHeight / 2, {
          count: 18, spread: 90,
          colors: [mix.rHex, mix.aHex, mix.bHex, '#facc15'],
          shapes: ['star', 'circle'],
        });

        const newCount = mixCount + 1;
        setMixCount(newCount);

        if (newCount % 3 === 0) {
          setTimeout(() => celebrate(), 500);
        }

        // Auto-advance after showing result
        setTimeout(() => {
          setRound(pickRound([mix.result]));
          setSelected([]);
          setPhase('picking');
        }, 2500);
      } else {
        // No valid mix — gentle reset
        playBoing();
        setTimeout(() => setSelected([]), 600);
      }
    }
  }, [phase, selected, mixCount, burst, celebrate]);

  const handleReset = useCallback(() => {
    setSelected([]);
  }, []);

  // Find the current mix result for display
  const currentMix = selected.length === 2
    ? MIXES.find(m =>
        (m.a === selected[0].id && m.b === selected[1].id) ||
        (m.b === selected[0].id && m.a === selected[1].id)
      )
    : null;

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 50%, #FFE0B2 100%)' }}>
      <BackButton variant="dark" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4">
        {/* Mixing area */}
        <div className="relative w-72 h-48 flex items-center justify-center">
          {/* Selected paint splats */}
          <AnimatePresence>
            {selected[0] && (
              <motion.div
                key={`a-${selected[0].id}`}
                className="absolute rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: phase === 'mixed' ? 0 : -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  width: 120, height: 120,
                  background: `radial-gradient(circle at 35% 35%, white, ${selected[0].hex})`,
                  boxShadow: `0 8px 30px ${selected[0].hex}60`,
                }}
              />
            )}
            {selected[1] && (
              <motion.div
                key={`b-${selected[1].id}`}
                className="absolute rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: phase === 'mixed' ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  width: 120, height: 120,
                  background: `radial-gradient(circle at 35% 35%, white, ${selected[1].hex})`,
                  boxShadow: `0 8px 30px ${selected[1].hex}60`,
                  mixBlendMode: phase === 'mixed' ? 'multiply' : 'normal',
                }}
              />
            )}
          </AnimatePresence>

          {/* Result colour reveal */}
          <AnimatePresence>
            {phase === 'mixed' && currentMix && (
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                <div className="w-36 h-36 rounded-full flex items-center justify-center"
                     style={{
                       background: `radial-gradient(circle at 35% 35%, white, ${currentMix.rHex})`,
                       boxShadow: `0 8px 40px ${currentMix.rHex}80`,
                     }}>
                  <span className="text-5xl">{currentMix.emoji}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state hint */}
          {selected.length === 0 && (
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🎨
            </motion.div>
          )}
        </div>

        {/* Colour palette — big splat buttons */}
        <div className="flex gap-5 flex-wrap justify-center">
          {PRIMARY_COLOURS.map(colour => (
            <motion.button
              key={colour.id}
              onPointerDown={() => handleTap(colour)}
              className="rounded-full active:scale-90 transition-transform"
              whileTap={{ scale: 0.85 }}
              style={{
                width: 100, height: 100,
                background: `radial-gradient(circle at 35% 35%, white, ${colour.hex})`,
                boxShadow: `0 6px 20px ${colour.hex}40`,
                border: `4px solid ${colour.hex}60`,
                touchAction: 'none',
              }}
            />
          ))}
        </div>

        {/* Progress — stars for each mix */}
        {mixCount > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(mixCount, 5) }).map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
        )}
      </div>

      <ParticleLayer />
      <CelebrationLayer />
    </div>
  );
}
