import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playAnimalSound } from '../hooks/useAnimalSounds';
import { playCelebrate, playSuccess, playBoing, playPop } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* ── All animals available ── */
const ALL_ANIMALS = [
  { id: 'cow',       emoji: '🐄', name: 'Cow',       sound: 'cow',     bg: '#22c55e' },
  { id: 'sheep',     emoji: '🐑', name: 'Sheep',     sound: 'sheep',   bg: '#f5f5f4' },
  { id: 'pig',       emoji: '🐷', name: 'Pig',       sound: 'pig',     bg: '#f9a8d4' },
  { id: 'horse',     emoji: '🐴', name: 'Horse',     sound: 'horse',   bg: '#92400e' },
  { id: 'rooster',   emoji: '🐓', name: 'Rooster',   sound: 'rooster', bg: '#ef4444' },
  { id: 'hen',       emoji: '🐔', name: 'Hen',       sound: 'hen',     bg: '#f97316' },
  { id: 'dog',       emoji: '🐶', name: 'Dog',       sound: 'dog',     bg: '#a16207' },
  { id: 'cat',       emoji: '🐱', name: 'Cat',       sound: 'cat',     bg: '#f59e0b' },
  { id: 'duck',      emoji: '🦆', name: 'Duck',      sound: 'duck',    bg: '#22d3ee' },
  { id: 'frog',      emoji: '🐸', name: 'Frog',      sound: 'frog',    bg: '#16a34a' },
  { id: 'lion',      emoji: '🦁', name: 'Lion',      sound: 'lion',    bg: '#d97706' },
  { id: 'elephant',  emoji: '🐘', name: 'Elephant',  sound: 'elephant',bg: '#6b7280' },
];

/* ── Level definitions ── */
const LEVELS = [
  // Explore levels: tap to discover sounds
  { id: 1, label: '🐄', mode: 'explore', animals: ['cow','sheep','pig'], questions: 0, title: 'Farm Friends' },
  { id: 2, label: '🐴', mode: 'explore', animals: ['horse','rooster','hen'], questions: 0, title: 'More Farm' },
  // Quiz levels: hear sound → pick animal
  { id: 3, label: '❓', mode: 'quiz', animals: ['cow','sheep','pig'], options: 3, questions: 5, title: 'Who Said That?' },
  { id: 4, label: '❓', mode: 'quiz', animals: ['horse','rooster','hen'], options: 3, questions: 5, title: 'Who Said That?' },
  { id: 5, label: '🐶', mode: 'explore', animals: ['dog','cat','duck'], questions: 0, title: 'Pet Pals' },
  { id: 6, label: '❓', mode: 'quiz', animals: ['cow','sheep','pig','horse','rooster','hen'], options: 4, questions: 6, title: 'Farm Quiz' },
  { id: 7, label: '🐸', mode: 'explore', animals: ['frog','lion','elephant'], questions: 0, title: 'Wild Animals' },
  { id: 8, label: '❓', mode: 'quiz', animals: ['dog','cat','duck','frog','lion','elephant'], options: 4, questions: 6, title: 'Wild Quiz' },
  { id: 9, label: '🔊', mode: 'reverse', animals: ['cow','sheep','pig','horse','dog','cat'], options: 3, questions: 6, title: 'Match the Animal' },
  { id: 10, label: '🏆', mode: 'quiz', animals: ALL_ANIMALS.map(a=>a.id), options: 4, questions: 8, title: 'All Animals!' },
];

const LEVEL_LABELS = LEVELS.map(l => l.label);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getAnimal(id) {
  return ALL_ANIMALS.find(a => a.id === id);
}

/* ── Farm Background ── */
function FarmScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 40%, #4ade80 40%, #22c55e 100%)' }}>
      <div className="absolute top-8 right-16 w-20 h-8 bg-white rounded-full opacity-60" />
      <div className="absolute top-14 right-28 w-14 h-5 bg-white rounded-full opacity-40" />
      <div className="absolute top-6 left-20 w-16 h-6 bg-white rounded-full opacity-50" />
      <div className="absolute top-4 right-4 w-16 h-16 rounded-full z-10"
        style={{
          background: 'radial-gradient(circle, #facc15 30%, #f97316 100%)',
          boxShadow: '0 0 40px #facc1580, 0 0 80px #facc1540',
        }} />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-700/30" />
    </div>
  );
}

/* ── Explore mode: tap to hear ── */
function ExploreLevel({ level, onComplete, onBack }) {
  const [activeId, setActiveId] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());
  const [showComplete, setShowComplete] = useState(false);
  const timeoutRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const animals = level.animals.map(getAnimal).filter(Boolean);

  const tapAnimal = useCallback((animal, e) => {
    playAnimalSound(animal.sound);
    setActiveId(animal.id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveId(null), 500);

    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6, spread: 35, colors: ['#facc15', '#22c55e', '#38bdf8'], shapes: ['star', 'heart'],
      });
    }

    setDiscovered(prev => {
      const next = new Set(prev);
      next.add(animal.id);
      if (next.size === animals.length && prev.size < animals.length) {
        // All discovered!
        setTimeout(() => {
          playCelebrate();
          celebrate({ duration: 2500 });
          peek('excited');
          setShowComplete(true);
        }, 600);
      } else if (next.size > prev.size) {
        playSuccess();
        peek('happy');
      }
      return next;
    });
  }, [animals, burst, celebrate, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <FarmScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl drop-shadow-sm">🐾 {level.title}</h2>
        <p className="text-amber-800/60 text-sm font-heading mt-1">Tap each animal to hear!</p>
      </div>

      {/* Discovery progress */}
      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        {discovered.size}/{animals.length} 🐾
      </div>

      {/* Animal grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
          {animals.map((animal, i) => {
            const isActive = activeId === animal.id;
            const isDiscovered = discovered.has(animal.id);
            return (
              <button key={animal.id} onPointerDown={(e) => tapAnimal(animal, e)}
                className="rounded-3xl flex flex-col items-center justify-center gap-1 p-3
                           cursor-pointer border-4 transition-all relative overflow-hidden"
                style={{
                  backgroundColor: '#fff',
                  borderColor: isActive ? '#f59e0b' : isDiscovered ? '#22c55e' : '#e5e7eb',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isActive
                    ? '0 0 30px rgba(245,158,11,0.4), 0 8px 25px rgba(0,0,0,0.15)'
                    : isDiscovered
                      ? '0 0 15px rgba(34,197,94,0.3), 0 4px 12px rgba(0,0,0,0.1)'
                      : '0 4px 12px rgba(0,0,0,0.1)',
                  touchAction: 'none', aspectRatio: '1',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
                }}>
                <span className="text-5xl sm:text-6xl"
                  style={{ animation: isActive ? 'animal-bounce 0.5s ease-out' : 'none', display: 'block' }}>
                  {animal.emoji}
                </span>
                {isDiscovered && <span className="absolute top-1 right-1 text-lg">✅</span>}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl border-4 border-amber-400"
                    style={{ animation: 'sound-ripple 0.6s ease-out forwards' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete overlay */}
      {showComplete && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            <div className="flex gap-1">
              {animals.map((a, i) => (
                <span key={a.id} className="text-3xl"
                  style={{ animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
                  {a.emoji}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <svg key={i} width={36} height={36} viewBox="0 0 22 22">
                  <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                    fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
                </svg>
              ))}
            </div>
            <button onPointerDown={() => onComplete(3)}
              className="bg-amber-400 text-white font-heading text-xl px-8 py-3 rounded-2xl shadow-lg
                         active:scale-95 transition-transform">
              ▶️
            </button>
          </div>
        </div>
      )}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Quiz mode: hear sound → pick correct animal ── */
function QuizLevel({ level, onComplete, onBack }) {
  const animals = level.animals.map(getAnimal).filter(Boolean);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState(() => generateQuestions(animals, level.options, level.questions));
  const [phase, setPhase] = useState('listen'); // listen | choosing | correct | wrong
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const currentQ = questions[questionIdx];

  // Auto-play sound on new question
  useEffect(() => {
    if (!currentQ) return;
    const t = setTimeout(() => {
      playAnimalSound(currentQ.correct.sound);
      setPhase('choosing');
    }, 500);
    return () => clearTimeout(t);
  }, [questionIdx, currentQ]);

  const replaySound = useCallback(() => {
    if (currentQ) playAnimalSound(currentQ.correct.sound);
  }, [currentQ]);

  const pickAnimal = useCallback((animal) => {
    if (phase !== 'choosing') return;

    if (animal.id === currentQ.correct.id) {
      playPop();
      playSuccess();
      setSelectedId(animal.id);
      setPhase('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);

      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 12, spread: 60,
        colors: ['#facc15', '#22c55e', '#38bdf8'],
        shapes: ['star', 'heart'],
      });

      if (streak + 1 >= 3) peek('excited');
      else peek('happy');

      setTimeout(() => {
        setSelectedId(null);
        if (questionIdx + 1 >= questions.length) {
          // Level complete!
          const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          setTimeout(() => onComplete(starsEarned), 3200);
        } else {
          setQuestionIdx(q => q + 1);
          setPhase('listen');
        }
      }, 1000);
    } else {
      playBoing();
      setSelectedId(animal.id);
      setPhase('wrong');
      setMistakes(m => m + 1);
      setStreak(0);

      setTimeout(() => {
        setSelectedId(null);
        setPhase('choosing');
      }, 600);
    }
  }, [phase, currentQ, questionIdx, questions.length, streak, mistakes, burst, peek, celebrate, onComplete]);

  if (!currentQ) return null;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <FarmScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Score */}
      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        ⭐ {score}
        {streak >= 3 && <span className="ml-1 animate-bounce">🔥{streak}</span>}
      </div>

      {/* Question prompt */}
      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl drop-shadow-sm">🔊 Who said that?</h2>
      </div>

      {/* Replay sound button */}
      <div className="relative z-10 flex justify-center mb-4">
        <button onPointerDown={replaySound}
          className="w-20 h-20 rounded-full bg-amber-400 shadow-lg flex items-center justify-center
                     active:scale-90 transition-transform border-4 border-amber-500/30"
          style={{ animation: phase === 'listen' ? 'hint-glow 1s ease-in-out infinite' : 'none' }}>
          <span className="text-3xl">🔊</span>
        </button>
      </div>

      {/* Animal options */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className={`grid gap-3 w-full max-w-lg ${currentQ.options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {currentQ.options.map((animal, i) => {
            const isSelected = selectedId === animal.id;
            const isCorrectAnswer = animal.id === currentQ.correct.id;
            let borderColor = '#e5e7eb';
            if (isSelected && phase === 'correct') borderColor = '#22c55e';
            if (isSelected && phase === 'wrong') borderColor = '#ef4444';

            return (
              <button key={animal.id} onPointerDown={() => pickAnimal(animal)}
                className={`rounded-3xl flex flex-col items-center justify-center gap-1 p-3
                  cursor-pointer border-4 transition-all relative
                  ${isSelected && phase === 'wrong' ? 'animate-wiggle' : ''}
                  ${isSelected && phase === 'correct' ? 'scale-110' : 'active:scale-95'}`}
                style={{
                  backgroundColor: '#fff',
                  borderColor,
                  boxShadow: isSelected
                    ? `0 0 20px ${borderColor}60`
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  touchAction: 'none', aspectRatio: '1',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
                }}>
                <span className="text-5xl sm:text-6xl">{animal.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < questionIdx ? 'bg-amber-400' : i === questionIdx ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Reverse quiz mode: see animal → hear options → pick matching sound ── */
function ReverseQuizLevel({ level, onComplete, onBack }) {
  const animals = level.animals.map(getAnimal).filter(Boolean);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState(() => generateQuestions(animals, level.options, level.questions));
  const [phase, setPhase] = useState('showing'); // showing | choosing | correct | wrong
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const currentQ = questions[questionIdx];

  useEffect(() => {
    if (!currentQ) return;
    const t = setTimeout(() => setPhase('choosing'), 800);
    return () => clearTimeout(t);
  }, [questionIdx, currentQ]);

  const pickSound = useCallback((animal) => {
    if (phase !== 'choosing') return;
    playAnimalSound(animal.sound);
    setPlayingId(animal.id);

    setTimeout(() => {
      if (animal.id === currentQ.correct.id) {
        playSuccess();
        setPhase('correct');
        setScore(s => s + 10);
        burst(window.innerWidth / 2, window.innerHeight / 2, {
          count: 10, spread: 50, colors: ['#facc15', '#22c55e'], shapes: ['star'],
        });
        peek('happy');

        setTimeout(() => {
          setPlayingId(null);
          if (questionIdx + 1 >= questions.length) {
            const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
            celebrate({ duration: 3000 });
            setTimeout(() => onComplete(starsEarned), 3200);
          } else {
            setQuestionIdx(q => q + 1);
            setPhase('showing');
          }
        }, 800);
      } else {
        playBoing();
        setPhase('wrong');
        setMistakes(m => m + 1);
        setTimeout(() => {
          setPlayingId(null);
          setPhase('choosing');
        }, 600);
      }
    }, 400);
  }, [phase, currentQ, questionIdx, questions.length, mistakes, burst, peek, celebrate, onComplete]);

  if (!currentQ) return null;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <FarmScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        ⭐ {score}
      </div>

      {/* Show the target animal */}
      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-amber-900 text-lg drop-shadow-sm">Which sound is this?</h2>
        <div className="mt-4" style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <span className="text-8xl">{currentQ.correct.emoji}</span>
        </div>
      </div>

      {/* Sound buttons */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className="flex gap-4">
          {currentQ.options.map((animal, i) => {
            const isPlaying = playingId === animal.id;
            return (
              <button key={animal.id} onPointerDown={() => pickSound(animal)}
                className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center
                  border-4 transition-all cursor-pointer
                  ${isPlaying && phase === 'correct' ? 'bg-green-100 border-green-400 scale-110' : ''}
                  ${isPlaying && phase === 'wrong' ? 'bg-red-100 border-red-400 animate-wiggle' : ''}
                  ${!isPlaying ? 'bg-white border-amber-200 active:scale-90' : ''}`}
                style={{
                  touchAction: 'none',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                }}>
                <span className="text-2xl">🔊</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < questionIdx ? 'bg-amber-400' : i === questionIdx ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

function generateQuestions(animals, optionCount, count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const correct = animals[Math.floor(Math.random() * animals.length)];
    const wrong = shuffle(animals.filter(a => a.id !== correct.id)).slice(0, optionCount - 1);
    const options = shuffle([correct, ...wrong]);
    questions.push({ correct, options });
  }
  return questions;
}

/* ── Main export ── */
export default function AnimalSounds() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('animal-sounds', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    if (currentLevel >= totalLevels) {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🐾 Animal Sounds"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #87CEEB 0%, #22c55e 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const level = LEVELS[currentLevel - 1];

  if (level.mode === 'explore') {
    return <ExploreLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (level.mode === 'reverse') {
    return <ReverseQuizLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }
  return <QuizLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
}
