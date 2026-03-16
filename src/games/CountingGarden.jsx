import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* ── Object sets that appear for counting ── */
const OBJECT_SETS = [
  { emoji: '🌸', name: 'flowers',      bg: '#fce7f3' },
  { emoji: '⭐', name: 'stars',        bg: '#fef9c3' },
  { emoji: '🦋', name: 'butterflies',  bg: '#ede9fe' },
  { emoji: '🐞', name: 'ladybugs',     bg: '#fee2e2' },
  { emoji: '🍎', name: 'apples',       bg: '#dcfce7' },
  { emoji: '🐟', name: 'fish',         bg: '#e0f2fe' },
  { emoji: '🌈', name: 'rainbows',     bg: '#fae8ff' },
  { emoji: '🎈', name: 'balloons',     bg: '#fff1f2' },
  { emoji: '🐣', name: 'chicks',       bg: '#fefce8' },
  { emoji: '🍓', name: 'strawberries', bg: '#fef2f2' },
  { emoji: '🐝', name: 'bees',         bg: '#fef3c7' },
  { emoji: '🌻', name: 'sunflowers',   bg: '#fefce8' },
  { emoji: '🐛', name: 'caterpillars', bg: '#d1fae5' },
  { emoji: '🍄', name: 'mushrooms',    bg: '#fce7f3' },
];

/* ── Level definitions — 8 levels with progressive difficulty ── */
const LEVELS = [
  { id: 1, label: '1️⃣',  maxCount: 3,  options: 3, questions: 4, title: 'Count to 3' },
  { id: 2, label: '2️⃣',  maxCount: 4,  options: 3, questions: 5, title: 'Count to 4' },
  { id: 3, label: '3️⃣',  maxCount: 5,  options: 4, questions: 5, title: 'Count to 5' },
  { id: 4, label: '4️⃣',  maxCount: 6,  options: 4, questions: 6, title: 'Count to 6' },
  { id: 5, label: '5️⃣',  maxCount: 7,  options: 5, questions: 6, title: 'Count to 7' },
  { id: 6, label: '6️⃣',  maxCount: 8,  options: 5, questions: 7, title: 'Count to 8' },
  { id: 7, label: '7️⃣',  maxCount: 9,  options: 5, questions: 7, title: 'Count to 9' },
  { id: 8, label: '🏆',  maxCount: 10, options: 6, questions: 8, title: 'Count to 10!' },
];

const LEVEL_LABELS = LEVELS.map(l => l.label);

/* ── kept for internal compatibility ── */
const ROUNDS = LEVELS;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(round, levelOverride) {
  const config = levelOverride || ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const correctCount = 1 + Math.floor(Math.random() * config.maxCount);
  const objectSet = OBJECT_SETS[Math.floor(Math.random() * OBJECT_SETS.length)];

  // Generate number options — always include correct answer
  const wrongNumbers = [];
  for (let n = 1; n <= config.maxCount + 1; n++) {
    if (n !== correctCount) wrongNumbers.push(n);
  }
  const options = shuffle([
    correctCount,
    ...shuffle(wrongNumbers).slice(0, config.options - 1),
  ]);

  // Generate scattered positions for objects
  const positions = [];
  for (let i = 0; i < correctCount; i++) {
    let x, y, attempts = 0;
    do {
      x = 15 + Math.random() * 70;
      y = 10 + Math.random() * 60;
      attempts++;
    } while (
      attempts < 20 &&
      positions.some(p => Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 14)
    );
    positions.push({
      x, y,
      rotation: (Math.random() - 0.5) * 30,
      scale: 0.9 + Math.random() * 0.3,
      delay: i * 0.12,
    });
  }

  return { correctCount, objectSet, options, positions };
}

/* ── Garden background scene ── */
function GardenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #b3e0f2 40%, #d4f0d4 70%, #8fbc8f 100%)' }} />

      {/* Sun */}
      <div className="absolute top-6 right-8 w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fff7cc 20%, #fbbf24 60%, transparent 100%)',
          boxShadow: '0 0 40px #fbbf2440',
        }} />

      {/* Clouds */}
      {[
        { left: '10%', top: '8%', w: 80, opacity: 0.6 },
        { left: '55%', top: '12%', w: 60, opacity: 0.5 },
        { left: '80%', top: '18%', w: 50, opacity: 0.4 },
      ].map((c, i) => (
        <div key={i} className="absolute" style={{ left: c.left, top: c.top, opacity: c.opacity }}>
          <svg width={c.w} height={c.w * 0.5} viewBox="0 0 100 50">
            <ellipse cx="50" cy="35" rx="45" ry="15" fill="white" />
            <ellipse cx="35" cy="25" rx="20" ry="18" fill="white" />
            <ellipse cx="60" cy="22" rx="25" ry="20" fill="white" />
          </svg>
        </div>
      ))}

      {/* Rolling hills */}
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height: '25%' }}>
        <path d="M0 80 Q60 30 120 70 Q200 20 280 60 Q350 30 400 50 L400 120 L0 120 Z" fill="#6B8E5A" />
        <path d="M0 95 Q80 60 160 85 Q240 55 320 80 Q380 60 400 70 L400 120 L0 120 Z" fill="#5a7d4a" />
      </svg>

      {/* Grass tufts */}
      <div className="absolute bottom-0 left-0 right-0 h-8"
        style={{ background: 'linear-gradient(to top, #4a6d3a, transparent)' }} />

      {/* Flowers on hills */}
      {[12, 28, 45, 62, 78, 88].map((x, i) => (
        <div key={i} className="absolute" style={{
          left: `${x}%`, bottom: `${18 + (i % 3) * 3}%`,
          fontSize: 14 + (i % 2) * 4,
          opacity: 0.5,
          animation: `seed-float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
        }}>
          {['🌻', '🌷', '🌼'][i % 3]}
        </div>
      ))}

      {/* Fence */}
      <svg className="absolute bottom-[22%] left-0 right-0" viewBox="0 0 400 30" preserveAspectRatio="none" style={{ height: '6%', opacity: 0.3 }}>
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i}>
            <rect x={i * 26 + 2} y="8" width="4" height="22" rx="1" fill="#C4A265" />
            <polygon points={`${i * 26 + 4},0 ${i * 26},8 ${i * 26 + 8},8`} fill="#C4A265" />
          </g>
        ))}
        <rect x="0" y="14" width="400" height="3" rx="1" fill="#C4A265" />
        <rect x="0" y="24" width="400" height="3" rx="1" fill="#C4A265" />
      </svg>
    </div>
  );
}

/* ── Counting objects display ── */
function CountingArea({ question, questionKey }) {
  const { objectSet, positions } = question;

  return (
    <div className="relative w-full h-full">
      {/* Soft backdrop card */}
      <div className="absolute inset-4 rounded-3xl border-4 border-white/30"
        style={{
          background: `${objectSet.bg}90`,
          backdropFilter: 'blur(4px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      />

      {/* Objects */}
      {positions.map((pos, i) => (
        <div
          key={`${questionKey}-${i}`}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
            fontSize: '3.2rem',
            animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${pos.delay}s both`,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          }}
        >
          {objectSet.emoji}
        </div>
      ))}
    </div>
  );
}

/* ── Number button ── */
function NumberButton({ number, onTap, state, delay }) {
  const colors = [
    '', // 0 unused
    '#ef4444', '#f97316', '#facc15', '#22c55e',
    '#38bdf8', '#8b5cf6', '#ec4899', '#14b8a6',
  ];
  const color = colors[number] || '#6b7280';

  return (
    <button
      onPointerDown={() => onTap(number)}
      className={`rounded-3xl flex items-center justify-center
        transition-all duration-200 border-4 cursor-pointer relative overflow-hidden
        ${state === 'correct'
          ? 'scale-115 border-green-400 ring-4 ring-green-300/50'
          : state === 'wrong'
            ? 'scale-90 border-red-400 animate-wiggle'
            : 'active:scale-90 border-white/60'
        }`}
      style={{
        width: 80,
        height: 80,
        background: state === 'correct'
          ? `linear-gradient(135deg, #86efac, #22c55e)`
          : state === 'wrong'
            ? `linear-gradient(135deg, #fca5a5, #ef4444)`
            : `linear-gradient(135deg, ${color}dd, ${color})`,
        boxShadow: state === 'correct'
          ? `0 0 20px #22c55e80`
          : `0 4px 12px ${color}40, inset 0 2px 4px rgba(255,255,255,0.25)`,
        animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
        touchAction: 'none',
      }}
    >
      {/* Shine */}
      <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)' }} />

      {state === 'wrong' ? (
        <span className="text-3xl text-white relative z-10">✗</span>
      ) : state === 'correct' ? (
        <span className="text-3xl relative z-10">✓</span>
      ) : (
        <span className="text-4xl font-heading text-white drop-shadow-md relative z-10">
          {number}
        </span>
      )}
    </button>
  );
}

/* ── Arthur Bear counting guide ── */
function CountingBear({ mood }) {
  const bobSpeed = mood === 'ecstatic' ? '0.5s' : mood === 'happy' ? '0.8s' : '1.2s';

  return (
    <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
      <div style={{
        animation: `bear-dance ${bobSpeed} ease-in-out infinite alternate`,
        transformOrigin: 'bottom center',
      }}>
        <svg viewBox="0 0 70 80" width="56" height="64">
          {/* Ears */}
          <circle cx="18" cy="10" r="10" fill="#8B6F47" />
          <circle cx="52" cy="10" r="10" fill="#8B6F47" />
          <circle cx="18" cy="10" r="6" fill="#D4A574" />
          <circle cx="52" cy="10" r="6" fill="#D4A574" />
          {/* Head */}
          <ellipse cx="35" cy="24" rx="19" ry="17" fill="#B8956A" />
          {/* Eyes */}
          {mood === 'ecstatic' ? (
            <>
              <path d="M26,21 L28,19 L30,21 L28,23 Z" fill="#2C1810" />
              <path d="M40,21 L42,19 L44,21 L42,23 Z" fill="#2C1810" />
            </>
          ) : (
            <>
              <ellipse cx="28" cy="22" rx="2.5" ry={mood === 'happy' ? 2 : 2.5} fill="#2C1810" />
              <ellipse cx="42" cy="22" rx="2.5" ry={mood === 'happy' ? 2 : 2.5} fill="#2C1810" />
              <circle cx="29" cy="21" r="0.8" fill="white" opacity="0.8" />
              <circle cx="43" cy="21" r="0.8" fill="white" opacity="0.8" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="35" cy="27" rx="4" ry="2.5" fill="#5C3A1E" />
          {/* Mouth */}
          <path d={mood === 'ecstatic' ? 'M30,30 Q35,36 40,30' : mood === 'happy' ? 'M31,30 Q35,34 39,30' : 'M32,30 Q35,33 38,30'}
            fill="none" stroke="#5C3A1E" strokeWidth="1.2" strokeLinecap="round" />
          {/* Cheeks */}
          {mood !== 'curious' && (
            <>
              <circle cx="22" cy="27" r="3.5" fill="#E8967C" opacity={mood === 'ecstatic' ? 0.5 : 0.25} />
              <circle cx="48" cy="27" r="3.5" fill="#E8967C" opacity={mood === 'ecstatic' ? 0.5 : 0.25} />
            </>
          )}
          {/* Body */}
          <ellipse cx="35" cy="54" rx="17" ry="19" fill="#A0845C" />
          <ellipse cx="35" cy="52" rx="12" ry="14" fill="#C4A574" />
          {/* Arms */}
          <ellipse cx="13" cy="50" rx="6" ry="10" fill="#A0845C"
            style={mood !== 'curious' ? { animation: `bear-wave ${bobSpeed} ease-in-out infinite alternate` } : undefined} />
          <ellipse cx="57" cy="50" rx="6" ry="10" fill="#A0845C"
            style={mood !== 'curious' ? { animation: `bear-wave ${bobSpeed} ease-in-out infinite alternate-reverse` } : undefined} />
          {/* Feet */}
          <ellipse cx="26" cy="72" rx="7" ry="4" fill="#8B6F47" />
          <ellipse cx="44" cy="72" rx="7" ry="4" fill="#8B6F47" />
        </svg>
      </div>
    </div>
  );
}

/* ── Single level component ── */
function CountingLevel({ levelConfig, onComplete, onBack }) {
  const [questionNum, setQuestionNum] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(0, levelConfig));
  const [phase, setPhase] = useState('counting');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongNumber, setWrongNumber] = useState(null);
  const [correctNumber, setCorrectNumber] = useState(null);
  const [bearMood, setBearMood] = useState('curious');

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  useEffect(() => {
    if (streak >= 5) setBearMood('ecstatic');
    else if (streak >= 2) setBearMood('happy');
    else setBearMood('curious');
  }, [streak]);

  const nextQuestion = useCallback(() => {
    const nextQ = questionNum + 1;

    if (nextQ >= levelConfig.questions) {
      // Level complete!
      setPhase('won');
      playFanfare();
      const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      celebrate({ duration: 3500 });
      peek('excited');
      setTimeout(() => onComplete(starsEarned), 3700);
    } else {
      setQuestionNum(nextQ);
      setQuestion(generateQuestion(0, levelConfig));
      setQuestionKey(k => k + 1);
      setPhase('counting');
    }
  }, [questionNum, levelConfig, mistakes, celebrate, peek, onComplete]);

  const tapNumber = useCallback((number) => {
    if (phase !== 'counting') return;

    if (number === question.correctCount) {
      playPop();
      setCorrectNumber(number);
      setPhase('correct');

      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 5 : 0;
      setScore(s => s + 10 + bonus);
      if (bonus > 0) playCollectPing();

      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 12 + number * 2, spread: 70,
        colors: ['#facc15', '#22c55e', '#38bdf8', '#ec4899'],
        shapes: ['star', 'circle', 'heart'],
      });
      playSuccess();

      if (newStreak === 3) peek('happy');
      if (newStreak === 5 || newStreak === 10) peek('excited');

      setTimeout(() => {
        setCorrectNumber(null);
        setWrongNumber(null);
        nextQuestion();
      }, 1200);
    } else {
      playBoing();
      setWrongNumber(number);
      setStreak(0);
      setMistakes(m => m + 1);
      setPhase('wrong');

      setTimeout(() => {
        setWrongNumber(null);
        setPhase('counting');
      }, 600);
    }
  }, [phase, question, streak, nextQuestion, burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />

      {/* Back to levels */}
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Score badge */}
      <div className="absolute top-4 right-4 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-white/50 flex items-center gap-2">
        <span className="text-lg font-heading text-amber-800">⭐ {score}</span>
        {streak >= 3 && <span className="text-lg animate-bounce">🔥{streak}</span>}
      </div>

      {/* Level badge */}
      <div className="absolute top-4 left-20 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-white/50">
        <span className="text-lg font-heading text-amber-800">
          {levelConfig.label} {levelConfig.title}
        </span>
      </div>

      <CountingBear mood={bearMood} />

      <div className="absolute top-20 left-4 right-4 z-10" style={{ height: '50%' }}>
        <CountingArea question={question} questionKey={questionKey} />
      </div>

      <div className="absolute z-20 left-0 right-0 flex justify-center" style={{ top: '68%' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-lg border-2 border-amber-200/60">
          <span className="text-xl font-heading text-amber-800">
            How many {question.objectSet.emoji}?
          </span>
        </div>
      </div>

      {(phase === 'counting' || phase === 'wrong' || phase === 'correct') && (
        <div className="absolute bottom-20 left-0 right-0 z-20 flex gap-3 items-center justify-center px-4 flex-wrap">
          {question.options.map((num, i) => (
            <NumberButton key={`${questionKey}-${num}`} number={num} onTap={tapNumber}
              state={correctNumber === num ? 'correct' : wrongNumber === num ? 'wrong' : null}
              delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20 px-8 flex-wrap">
        {Array.from({ length: levelConfig.questions }, (_, i) => (
          <div key={i}
            className={`rounded-full transition-all duration-300 ${
              i < questionNum ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                : i === questionNum ? 'bg-white scale-130 shadow-lg shadow-white/60 border-2 border-amber-300'
                : 'bg-amber-900/20'
            }`}
            style={{ width: 14, height: 14 }} />
        ))}
      </div>

      {/* Won overlay */}
      {phase === 'won' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex gap-3">
            {[0, 1, 2].map(i => (
              <svg key={i} width={52} height={52} viewBox="0 0 22 22"
                style={{ animationDelay: `${i * 150}ms` }} className="animate-spin-slow drop-shadow-lg">
                <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                  fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
              </svg>
            ))}
          </div>
        </div>
      )}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Main export with level selection ── */
export default function CountingGarden() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('counting-garden', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    if (currentLevel < totalLevels) {
      setLevel(currentLevel + 1);
    } else {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, setLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🌸 Counting Garden"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #87CEEB 0%, #4ade80 60%, #22c55e 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const levelConfig = LEVELS[currentLevel - 1];
  return (
    <CountingLevel
      key={currentLevel}
      levelConfig={levelConfig}
      onComplete={handleComplete}
      onBack={backToLevels}
    />
  );
}
