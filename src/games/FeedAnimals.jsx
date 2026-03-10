import { useState, useCallback, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import FarmScene from '../components/scenes/FarmScene';
import { Cow, Pig, Chicken, Horse, Sheep, Goat } from '../components/animals';
import Rabbit from './pop-critters/animals/Rabbit';
import Mouse from './pop-critters/animals/Mouse';
import Hedgehog from './pop-critters/animals/Hedgehog';
import Owl from './pop-critters/animals/Owl';
import Fox from './pop-critters/animals/Fox';
import Mole from './pop-critters/animals/Mole';
import { playSuccess, playBoing, playPop, playTap, playSparkle, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── all foods (used to generate wrong choices) ── */
const ALL_FOODS = ['🌾', '🍎', '🌽', '🥕', '🌿', '🥬', '🍌', '🧀', '🥦', '🍓', '🍄', '🐛', '🫐', '🪱'];

/* ── animal definitions ── */

// Farm animals use a numeric `size` prop
const FARM_ANIMALS = [
  { id: 'cow',     component: Cow,     food: '🌾', sound: 'Moo!',     type: 'farm' },
  { id: 'pig',     component: Pig,     food: '🍎', sound: 'Oink!',    type: 'farm' },
  { id: 'chicken', component: Chicken, food: '🌽', sound: 'Cluck!',   type: 'farm' },
  { id: 'horse',   component: Horse,   food: '🥕', sound: 'Neigh!',   type: 'farm' },
  { id: 'sheep',   component: Sheep,   food: '🌿', sound: 'Baa!',     type: 'farm' },
  { id: 'goat',    component: Goat,    food: '🥬', sound: 'Meh!',     type: 'farm' },
];

// Woodland animals use CSS className for sizing
const WOODLAND_ANIMALS = [
  { id: 'rabbit',   component: Rabbit,   food: '🍓', sound: 'Munch!',    type: 'woodland' },
  { id: 'mouse',    component: Mouse,    food: '🧀', sound: 'Squeak!',   type: 'woodland' },
  { id: 'hedgehog', component: Hedgehog, food: '🍄', sound: 'Snuffle!',  type: 'woodland' },
  { id: 'owl',      component: Owl,      food: '🐛', sound: 'Hoot!',     type: 'woodland' },
  { id: 'fox',      component: Fox,      food: '🫐', sound: 'Yip!',      type: 'woodland' },
  { id: 'mole',     component: Mole,     food: '🪱', sound: 'Dig dig!',  type: 'woodland' },
];

/* ── round configs ── */
const ROUNDS = [
  { animals: FARM_ANIMALS, choices: 3 },
  { animals: [...FARM_ANIMALS, ...WOODLAND_ANIMALS.slice(0, 2)], choices: 3 },
  { animals: [...FARM_ANIMALS, ...WOODLAND_ANIMALS.slice(0, 4)], choices: 4 },
  { animals: [...FARM_ANIMALS, ...WOODLAND_ANIMALS], choices: 5 },
];

/* ── helpers ── */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getFoodChoices(correctFood, count) {
  const wrong = ALL_FOODS.filter(f => f !== correctFood);
  const picked = shuffle(wrong).slice(0, count - 1);
  return shuffle([correctFood, ...picked]);
}

/* ── animal renderer (adapts farm vs woodland sizing) ── */
function AnimalDisplay({ animal, size }) {
  const Component = animal.component;
  if (animal.type === 'farm') {
    return <Component size={size} />;
  }
  // woodland animals use className
  return (
    <div style={{ width: size, height: size }}>
      <Component className="w-full h-full" />
    </div>
  );
}

/* ── main component ── */

export default function FeedAnimals() {
  const [round, setRound] = useState(0);
  const [roundAnimals, setRoundAnimals] = useState(() => shuffle(ROUNDS[0].animals));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('choosing');    // choosing | wrong | eating | celebrating | intro | round-end
  const [choices, setChoices] = useState(() => getFoodChoices(ROUNDS[0].animals[0]?.food, 3));
  const [wrongPick, setWrongPick] = useState(null);
  const [animalWobble, setAnimalWobble] = useState(false);
  const [stars, setStars] = useState([]);
  const [chomps, setChomps] = useState(0);

  // score & streak
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scorePopup, setScorePopup] = useState(null);

  // track which woodland animals have been introduced
  const seenWoodlandRef = useRef(new Set());

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const roundConfig = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const animal = roundAnimals[currentIdx];
  const choiceCount = roundConfig.choices;

  // set up food choices when animal changes
  useEffect(() => {
    if (animal && (phase === 'choosing' || phase === 'intro')) {
      setChoices(getFoodChoices(animal.food, choiceCount));
    }
  }, [currentIdx, round]);

  // check if this is a new woodland animal → show intro
  useEffect(() => {
    if (!animal) return;
    if (animal.type === 'woodland' && !seenWoodlandRef.current.has(animal.id)) {
      seenWoodlandRef.current.add(animal.id);
      setPhase('intro');
      playSparkle();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 50;
      burst(cx, cy, { count: 10, spread: 60, colors: ['#a78bfa', '#facc15', '#38bdf8'], shapes: ['star', 'diamond'] });
      setTimeout(() => setPhase('choosing'), 1800);
    }
  }, [currentIdx, round]);

  const tapAnimal = useCallback(() => {
    if (phase === 'intro' || phase === 'round-end') return;
    playBoing();
    setAnimalWobble(true);
    setTimeout(() => setAnimalWobble(false), 500);
  }, [phase]);

  const showScorePopup = useCallback((points) => {
    setScorePopup(points);
    setTimeout(() => setScorePopup(null), 800);
  }, []);

  const advanceToNext = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= roundAnimals.length) {
      // round complete
      setPhase('round-end');
      playFanfare();
      const roundNum = round + 1;
      celebrate({ message: `Round ${roundNum} done! 🎉`, duration: 3500 });

      setTimeout(() => {
        const nextRound = round + 1;
        const nextConfig = ROUNDS[Math.min(nextRound, ROUNDS.length - 1)];
        setRound(nextRound);
        const shuffled = shuffle(nextConfig.animals);
        setRoundAnimals(shuffled);
        setCurrentIdx(0);
        setChoices(getFoodChoices(shuffled[0].food, nextConfig.choices));
        setPhase('choosing');
      }, 3800);
    } else {
      setCurrentIdx(nextIdx);
      setPhase('choosing');
    }
  }, [currentIdx, roundAnimals.length, round, celebrate]);

  const pickFood = useCallback((food) => {
    if (phase !== 'choosing') return;

    if (food === animal.food) {
      playPop();
      setPhase('eating');
      setChomps(0);

      // score
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 5 : 0;
      const gained = 10 + bonus;
      const newScore = score + gained;
      setScore(newScore);
      showScorePopup(gained);
      if (bonus > 0) playCollectPing();

      // milestone peek every 50 points
      if (Math.floor(newScore / 50) > Math.floor(score / 50)) {
        setTimeout(() => peek('excited'), 600);
      }

      let c = 0;
      const chompInterval = setInterval(() => {
        c++;
        setChomps(c);
        playTap();
        if (c >= 3) {
          clearInterval(chompInterval);
          setPhase('celebrating');
          playSuccess();
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2 - 50;
          burst(cx, cy, { count: 14, spread: 80, colors: ['#facc15', '#22c55e', '#38bdf8'], shapes: ['star', 'heart'] });

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
            setWrongPick(null);
            advanceToNext();
          }, 2200);
        }
      }, 300);
    } else {
      playBoing();
      setWrongPick(food);
      setPhase('wrong');
      setStreak(0);
      setTimeout(() => {
        setWrongPick(null);
        setPhase('choosing');
      }, 600);
    }
  }, [phase, animal, streak, score, advanceToNext, showScorePopup, peek, burst]);

  const animalSize = phase === 'eating' ? 200 : phase === 'celebrating' ? 180 : phase === 'intro' ? 190 : 160;

  if (!animal) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <FarmScene />
      <BackButton />

      {/* ── Round badge (top-left) ── */}
      <div className="absolute top-4 left-16 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50">
        <span className="text-lg font-heading text-amber-800">
          Round {round + 1}
        </span>
      </div>

      {/* ── Score badge (top-right) ── */}
      <div className="absolute top-4 right-4 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50 flex items-center gap-2">
        <span className="text-lg font-heading text-amber-800">
          ⭐ {score}
        </span>
        {streak >= 3 && (
          <span className="text-lg animate-bounce">
            🔥{streak}
          </span>
        )}
      </div>

      {/* ── Score popup ── */}
      {scorePopup && (
        <div className="absolute top-16 right-6 z-40 text-2xl font-heading text-green-600 drop-shadow-lg animate-bounce-in">
          +{scorePopup}!
        </div>
      )}

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

      {/* ── Animal area ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
           style={{ paddingBottom: '20%' }}>

        {/* New animal intro speech bubble */}
        {phase === 'intro' && (
          <div className="mb-4 bg-white/90 rounded-3xl px-6 py-3 shadow-lg border-2 border-purple-200 animate-bounce-in">
            <span className="text-2xl font-heading text-purple-700">
              Hi! I'm {animal.id.charAt(0).toUpperCase() + animal.id.slice(1)}! 🌟
            </span>
          </div>
        )}

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
                  : phase === 'intro'
                    ? 'scale(1.1)'
                    : '',
          }}
        >
          <AnimalDisplay animal={animal} size={animalSize} />
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

      {/* ── Food choices ── */}
      {(phase === 'choosing' || phase === 'wrong') && (
        <div className="absolute bottom-24 left-0 right-0 flex gap-3 items-center justify-center z-20 px-4">
          {choices.map((food, i) => (
            <button
              key={food + '-' + i}
              onClick={() => pickFood(food)}
              className={`rounded-3xl bg-white/70 backdrop-blur-sm shadow-lg
                         flex items-center justify-center
                         transition-all duration-200 border-4 border-white/50
                         ${wrongPick === food
                           ? 'animate-wiggle bg-red-300/70 scale-90 border-red-400'
                           : 'active:scale-90 hover:bg-white/90'
                         }`}
              style={{
                width: choiceCount <= 3 ? 96 : choiceCount === 4 ? 80 : 72,
                height: choiceCount <= 3 ? 96 : choiceCount === 4 ? 80 : 72,
                fontSize: choiceCount <= 3 ? '3rem' : choiceCount === 4 ? '2.5rem' : '2.2rem',
                animationDelay: `${i * 0.1}s`,
                animationFillMode: 'backwards',
              }}
            >
              {wrongPick === food ? '❌' : food}
            </button>
          ))}
        </div>
      )}

      {/* ── Progress dots ── */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20 px-8 flex-wrap">
        {roundAnimals.map((a, i) => (
          <div
            key={a.id + '-' + i}
            className={`rounded-full transition-all duration-300 shadow-md ${
              i < currentIdx
                ? 'bg-sun scale-100'
                : i === currentIdx
                  ? 'bg-white scale-125 shadow-lg shadow-white/50'
                  : 'bg-white/40 scale-100'
            }`}
            style={{
              width: roundAnimals.length > 8 ? 14 : 20,
              height: roundAnimals.length > 8 ? 14 : 20,
            }}
          />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      <style>{`
        @keyframes starFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(calc(100vh + 50px)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
