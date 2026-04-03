import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playBoing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/* Colour mixing rules */
const MIXES = [
  { a: 'red',    b: 'yellow', result: 'orange',     emoji: '🟠', aHex: '#ef4444', bHex: '#facc15', rHex: '#f97316' },
  { a: 'red',    b: 'blue',   result: 'purple',     emoji: '🟣', aHex: '#ef4444', bHex: '#3b82f6', rHex: '#a855f7' },
  { a: 'blue',   b: 'yellow', result: 'green',      emoji: '🟢', aHex: '#3b82f6', bHex: '#facc15', rHex: '#22c55e' },
  { a: 'red',    b: 'white',  result: 'pink',       emoji: '🩷', aHex: '#ef4444', bHex: '#f8fafc', rHex: '#f472b6' },
  { a: 'blue',   b: 'white',  result: 'light blue', emoji: '🩵', aHex: '#3b82f6', bHex: '#f8fafc', rHex: '#7dd3fc' },
];

const PRIMARY_COLOURS = [
  { id: 'red',    hex: '#ef4444' },
  { id: 'blue',   hex: '#3b82f6' },
  { id: 'yellow', hex: '#facc15' },
  { id: 'white',  hex: '#f8fafc' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickMix(excludeResult = null) {
  const available = excludeResult
    ? MIXES.filter(m => m.result !== excludeResult)
    : MIXES;
  return shuffle(available)[0];
}

export default function ColourMixing() {
  const [mix, setMix] = useState(() => pickMix());
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('picking'); // picking | mixed
  const [mixCount, setMixCount] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const colourA = PRIMARY_COLOURS.find(c => c.id === mix.a);
  const colourB = PRIMARY_COLOURS.find(c => c.id === mix.b);

  const handleTap = useCallback((colour) => {
    if (phase !== 'picking') return;

    // Prevent picking same colour twice
    if (selected.length === 1 && selected[0].id === colour.id) {
      playBoing();
      return;
    }

    // Only allow the two target colours
    if (colour.id !== mix.a && colour.id !== mix.b) {
      playBoing();
      return;
    }

    playPop();
    const next = [...selected, colour];
    setSelected(next);

    if (next.length === 2) {
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
        setTimeout(() => { celebrate(); peek('excited'); }, 500);
      } else {
        peek('happy');
      }

      // Auto-advance
      setTimeout(() => {
        setMix(pickMix(mix.result));
        setSelected([]);
        setPhase('picking');
      }, 2500);
    }
  }, [phase, selected, mix, mixCount, burst, celebrate, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 50%, #FFE0B2 100%)' }}>
      <BackButton variant="dark" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-5 px-4">

        {/* Prompt: two small splats showing which colours to mix */}
        {phase === 'picking' && (
          <div className="flex items-center gap-3">
            <motion.div
              className="w-16 h-16 rounded-full"
              animate={{ scale: selected.some(s => s.id === mix.a) ? 0.7 : [1, 1.1, 1] }}
              transition={{ repeat: selected.some(s => s.id === mix.a) ? 0 : Infinity, duration: 1.5 }}
              style={{
                background: `radial-gradient(circle at 35% 35%, white, ${mix.aHex})`,
                boxShadow: `0 4px 15px ${mix.aHex}40`,
                opacity: selected.some(s => s.id === mix.a) ? 0.4 : 1,
              }}
            />
            <span className="text-3xl">+</span>
            <motion.div
              className="w-16 h-16 rounded-full"
              animate={{ scale: selected.some(s => s.id === mix.b) ? 0.7 : [1, 1.1, 1] }}
              transition={{ repeat: selected.some(s => s.id === mix.b) ? 0 : Infinity, duration: 1.5, delay: 0.3 }}
              style={{
                background: `radial-gradient(circle at 35% 35%, white, ${mix.bHex})`,
                boxShadow: `0 4px 15px ${mix.bHex}40`,
                opacity: selected.some(s => s.id === mix.b) ? 0.4 : 1,
              }}
            />
            <span className="text-3xl">=</span>
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-amber-300/50
                            flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
        )}

        {/* Mixing area */}
        <div className="relative w-72 h-48 flex items-center justify-center">
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

          {/* Result reveal */}
          <AnimatePresence>
            {phase === 'mixed' && (
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                <div className="w-36 h-36 rounded-full flex items-center justify-center"
                     style={{
                       background: `radial-gradient(circle at 35% 35%, white, ${mix.rHex})`,
                       boxShadow: `0 8px 40px ${mix.rHex}80`,
                     }}>
                  <span className="text-5xl">{mix.emoji}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
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

        {/* Colour palette */}
        <div className="flex gap-5 flex-wrap justify-center">
          {PRIMARY_COLOURS.map(colour => {
            const isTarget = colour.id === mix.a || colour.id === mix.b;
            const isWhite = colour.id === 'white';
            return (
              <motion.button
                key={colour.id}
                onPointerDown={() => handleTap(colour)}
                className="rounded-full active:scale-90 transition-transform"
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 100, height: 100,
                  background: isWhite
                    ? 'radial-gradient(circle at 35% 35%, #ffffff, #e2e8f0)'
                    : `radial-gradient(circle at 35% 35%, white, ${colour.hex})`,
                  boxShadow: isTarget
                    ? `0 6px 20px ${colour.hex}60, 0 0 0 4px ${colour.hex}30`
                    : `0 4px 12px rgba(0,0,0,0.1)`,
                  border: isWhite ? '4px solid #cbd5e1' : `4px solid ${colour.hex}60`,
                  touchAction: 'none',
                  opacity: isTarget ? 1 : 0.35,
                }}
              />
            );
          })}
        </div>

        {/* Progress stars */}
        {mixCount > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(mixCount, 5) }).map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
