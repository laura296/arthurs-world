import { useState, useCallback } from 'react';
import BackButton from '../components/BackButton';
import { playSuccess, playBoing } from '../hooks/useSound';

const ANIMALS = [
  { emoji: '🐄', name: 'Cow',     food: '🌾', sound: 'Moo!' },
  { emoji: '🐷', name: 'Pig',     food: '🍎', sound: 'Oink!' },
  { emoji: '🐔', name: 'Chicken', food: '🌽', sound: 'Cluck!' },
  { emoji: '🐴', name: 'Horse',   food: '🥕', sound: 'Neigh!' },
  { emoji: '🐑', name: 'Sheep',   food: '🌿', sound: 'Baa!' },
  { emoji: '🐐', name: 'Goat',    food: '🥬', sound: 'Meh!' },
];

export default function FeedAnimals() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fed, setFed] = useState(false);
  const [sparkles, setSparkles] = useState(false);

  const animal = ANIMALS[currentIdx];

  const feed = useCallback(() => {
    if (fed) return;
    playSuccess();
    setFed(true);
    setSparkles(true);
    setTimeout(() => {
      setSparkles(false);
      setFed(false);
      setCurrentIdx(i => (i + 1) % ANIMALS.length);
    }, 1500);
  }, [fed]);

  const tapAnimal = useCallback(() => {
    playBoing();
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-leaf to-green-900 flex flex-col items-center justify-center overflow-hidden">
      <BackButton />

      {/* Animal */}
      <button
        onClick={tapAnimal}
        className={`text-[120px] leading-none transition-transform duration-300 ${fed ? 'scale-110' : 'animate-float'}`}
      >
        {animal.emoji}
      </button>

      {/* Happy face when fed */}
      {fed && (
        <div className="text-3xl font-heading text-sun animate-bounce-in mt-2">
          😋 {animal.sound}
        </div>
      )}

      {/* Sparkles */}
      {sparkles && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {['⭐', '✨', '🌟', '💫', '⭐'].map((s, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-ping"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Food button */}
      {!fed && (
        <button
          onClick={feed}
          className="mt-10 w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm
                     flex items-center justify-center text-6xl
                     animate-bounce-in active:scale-90 transition-transform"
        >
          {animal.food}
        </button>
      )}

      {/* Progress dots */}
      <div className="fixed bottom-8 flex gap-3">
        {ANIMALS.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors ${
              i <= currentIdx ? 'bg-sun' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
