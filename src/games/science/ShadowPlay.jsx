import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { playPop, playSparkle, playSuccess, playBoing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useCelebration } from '../../components/CelebrationOverlay';

/*
  Shadow animals — child sees a shadow silhouette and taps the matching animal.
  Simple 1-of-3 choice. The shadow is just the emoji rendered in dark with a blur.
*/
const ANIMALS = [
  { id: 'cat',      emoji: '🐱' },
  { id: 'dog',      emoji: '🐶' },
  { id: 'rabbit',   emoji: '🐰' },
  { id: 'bear',     emoji: '🐻' },
  { id: 'elephant', emoji: '🐘' },
  { id: 'penguin',  emoji: '🐧' },
  { id: 'frog',     emoji: '🐸' },
  { id: 'owl',      emoji: '🦉' },
  { id: 'duck',     emoji: '🦆' },
  { id: 'mouse',    emoji: '🐭' },
  { id: 'pig',      emoji: '🐷' },
  { id: 'lion',     emoji: '🦁' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(exclude = null) {
  const available = exclude
    ? ANIMALS.filter(a => a.id !== exclude)
    : ANIMALS;
  const shuffled = shuffle(available);
  const correct = shuffled[0];
  const wrong = shuffled.slice(1, 3);
  return {
    correct,
    choices: shuffle([correct, ...wrong]),
  };
}

export default function ShadowPlay() {
  const [round, setRound] = useState(() => pickRound());
  const [phase, setPhase] = useState('guessing'); // guessing | correct | wrong
  const [score, setScore] = useState(0);
  const [wobbleId, setWobbleId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { celebrate, CelebrationLayer } = useCelebration();

  const handleTap = useCallback((animal) => {
    if (phase !== 'guessing') return;

    if (animal.id === round.correct.id) {
      playPop();
      playSparkle();
      setPhase('correct');

      const newScore = score + 1;
      setScore(newScore);

      burst(window.innerWidth / 2, window.innerHeight * 0.3, {
        count: 14, spread: 80,
        colors: ['#facc15', '#22c55e', '#38bdf8'],
        shapes: ['star', 'heart'],
      });

      if (newScore % 5 === 0) {
        setTimeout(() => celebrate(), 400);
      }

      // Auto-advance
      setTimeout(() => {
        setRound(pickRound(round.correct.id));
        setPhase('guessing');
      }, 1800);
    } else {
      playBoing();
      setWobbleId(animal.id);
      setTimeout(() => setWobbleId(null), 500);
    }
  }, [phase, round, score, burst, celebrate]);

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
      <BackButton />

      {/* Torch glow effect */}
      <div className="absolute pointer-events-none"
           style={{
             left: '50%', top: '25%',
             transform: 'translate(-50%, -50%)',
             width: 300, height: 300,
             background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
           }} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-4">
        {/* Shadow area */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Torch */}
          <div className="absolute -top-8 -right-4 text-3xl" style={{ transform: 'rotate(30deg)' }}>
            🔦
          </div>

          {/* Shadow silhouette */}
          <AnimatePresence mode="wait">
            <motion.div
              key={round.correct.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring' }}
              className="flex items-center justify-center"
            >
              {phase === 'correct' ? (
                /* Reveal the actual animal */
                <motion.span
                  className="text-9xl"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {round.correct.emoji}
                </motion.span>
              ) : (
                /* Dark shadow version */
                <span className="text-9xl"
                      style={{
                        filter: 'brightness(0) drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                        opacity: 0.85,
                      }}>
                  {round.correct.emoji}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animal choices */}
        <div className="flex gap-6">
          <AnimatePresence mode="popLayout">
            {round.choices.map((animal, i) => (
              <motion.button
                key={animal.id}
                onPointerDown={() => handleTap(animal)}
                className={`w-28 h-28 rounded-3xl flex items-center justify-center
                           bg-white/10 border-4 backdrop-blur-sm
                           active:scale-90 transition-transform
                           ${phase === 'correct' && animal.id === round.correct.id
                             ? 'border-green-400 bg-green-400/20'
                             : wobbleId === animal.id
                               ? 'border-red-400 animate-[wiggle_0.3s_ease-in-out]'
                               : 'border-white/20'}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', delay: i * 0.1 }}
                style={{ touchAction: 'none' }}
              >
                <span className="text-5xl">{animal.emoji}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Score stars */}
        {score > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(score, 5) }).map((_, i) => (
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
