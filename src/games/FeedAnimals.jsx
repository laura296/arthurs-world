import { useState, useCallback, useEffect } from 'react';
import BackButton from '../components/BackButton';
import FarmScene from '../components/scenes/FarmScene';
import { Cow, Pig, Chicken, Horse, Sheep, Goat } from '../components/animals';
import { playSuccess, playBoing, playPop, playTap } from '../hooks/useSound';

const ALL_FOODS = ['🌾', '🍎', '🌽', '🥕', '🌿', '🥬', '🍌', '🧀', '🥦', '🍓'];

const ANIMAL_COMPONENTS = { Cow, Pig, Chicken, Horse, Sheep, Goat };

const ANIMALS = [
  { component: 'Cow',     food: '🌾', sound: 'Moo!'   },
  { component: 'Pig',     food: '🍎', sound: 'Oink!'  },
  { component: 'Chicken', food: '🌽', sound: 'Cluck!' },
  { component: 'Horse',   food: '🥕', sound: 'Neigh!' },
  { component: 'Sheep',   food: '🌿', sound: 'Baa!'   },
  { component: 'Goat',    food: '🥬', sound: 'Meh!'   },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getFoodChoices(correctFood) {
  const wrong = ALL_FOODS.filter(f => f !== correctFood);
  const picked = shuffle(wrong).slice(0, 2);
  return shuffle([correctFood, ...picked]);
}

export default function FeedAnimals() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('choosing');
  const [choices, setChoices] = useState(() => getFoodChoices(ANIMALS[0].food));
  const [wrongPick, setWrongPick] = useState(null);
  const [animalWobble, setAnimalWobble] = useState(false);
  const [stars, setStars] = useState([]);
  const [chomps, setChomps] = useState(0);

  const animal = ANIMALS[currentIdx];
  const AnimalSVG = ANIMAL_COMPONENTS[animal.component];

  useEffect(() => {
    setChoices(getFoodChoices(ANIMALS[currentIdx].food));
  }, [currentIdx]);

  const tapAnimal = useCallback(() => {
    playBoing();
    setAnimalWobble(true);
    setTimeout(() => setAnimalWobble(false), 500);
  }, []);

  const pickFood = useCallback((food) => {
    if (phase !== 'choosing') return;

    if (food === animal.food) {
      playPop();
      setPhase('eating');
      setChomps(0);

      let c = 0;
      const chompInterval = setInterval(() => {
        c++;
        setChomps(c);
        playTap();
        if (c >= 3) {
          clearInterval(chompInterval);
          setPhase('celebrating');
          playSuccess();

          const newStars = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            emoji: ['⭐', '✨', '🌟', '💫', '🎉'][Math.floor(Math.random() * 5)],
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            size: 20 + Math.random() * 24,
          }));
          setStars(newStars);

          setTimeout(() => {
            setStars([]);
            setPhase('choosing');
            setWrongPick(null);
            setCurrentIdx(i => (i + 1) % ANIMALS.length);
          }, 2200);
        }
      }, 300);
    } else {
      playBoing();
      setWrongPick(food);
      setPhase('wrong');
      setTimeout(() => {
        setWrongPick(null);
        setPhase('choosing');
      }, 600);
    }
  }, [phase, animal.food]);

  const animalSize = phase === 'eating' ? 200 : phase === 'celebrating' ? 180 : 160;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Farm background */}
      <FarmScene />

      <BackButton />

      {/* Falling celebration stars */}
      {stars.map(s => (
        <span
          key={s.id}
          className="absolute pointer-events-none z-30"
          style={{
            left: `${s.left}%`,
            top: -40,
            fontSize: s.size,
            animation: `starFall 1.8s ${s.delay}s ease-in forwards`,
          }}
        >
          {s.emoji}
        </span>
      ))}

      {/* Animal area — positioned above the grass */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
           style={{ paddingBottom: '20%' }}>
        {/* Animal */}
        <button
          onClick={tapAnimal}
          className="transition-transform duration-300 drop-shadow-xl"
          style={{
            transform: animalWobble
              ? 'rotate(-8deg) scale(1.1)'
              : phase === 'eating'
                ? chomps % 2 === 0 ? 'scale(1.05) rotate(3deg)' : 'scale(0.95) rotate(-3deg)'
                : phase === 'celebrating'
                  ? 'scale(1.15)'
                  : '',
          }}
        >
          <AnimalSVG size={animalSize} />
        </button>

        {/* Eating indicator */}
        {phase === 'eating' && (
          <div className="text-4xl animate-bounce mt-2 drop-shadow-lg">
            {animal.food} {'😋'.repeat(Math.min(chomps, 3))}
          </div>
        )}

        {/* Celebration text */}
        {phase === 'celebrating' && (
          <div className="text-4xl font-heading text-white drop-shadow-lg animate-bounce-in mt-2 text-center">
            <div className="text-5xl mb-1">🎉</div>
            {animal.sound}
          </div>
        )}
      </div>

      {/* Food choices — positioned at bottom over grass */}
      {(phase === 'choosing' || phase === 'wrong') && (
        <div className="absolute bottom-24 left-0 right-0 flex gap-4 items-center justify-center z-20">
          {choices.map((food, i) => (
            <button
              key={food + '-' + i}
              onClick={() => pickFood(food)}
              className={`w-24 h-24 rounded-3xl bg-white/70 backdrop-blur-sm shadow-lg
                         flex items-center justify-center text-5xl
                         transition-all duration-200 border-4 border-white/50
                         ${wrongPick === food
                           ? 'animate-wiggle bg-red-300/70 scale-90 border-red-400'
                           : 'active:scale-90 hover:bg-white/90'
                         }`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationFillMode: 'backwards',
              }}
            >
              {wrongPick === food ? '❌' : food}
            </button>
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-3 justify-center z-20">
        {ANIMALS.map((a, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full transition-all duration-300 shadow-md ${
              i < currentIdx
                ? 'bg-sun scale-100'
                : i === currentIdx
                  ? 'bg-white scale-125 shadow-lg shadow-white/50'
                  : 'bg-white/40 scale-100'
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes starFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(calc(100vh + 50px)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
