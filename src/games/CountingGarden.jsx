import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

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
];

/* ── Difficulty rounds ── */
const ROUNDS = [
  { maxCount: 3, options: 3, questions: 4 },   // Round 1: count 1-3
  { maxCount: 4, options: 4, questions: 5 },   // Round 2: count 1-4
  { maxCount: 5, options: 4, questions: 5 },   // Round 3: count 1-5
  { maxCount: 6, options: 5, questions: 6 },   // Round 4: count 1-6
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(round) {
  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];
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

/* ── Main component ── */
export default function CountingGarden() {
  const [round, setRound] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(0));
  const [phase, setPhase] = useState('counting'); // counting | correct | wrong | round-end | won
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongNumber, setWrongNumber] = useState(null);
  const [correctNumber, setCorrectNumber] = useState(null);
  const [bearMood, setBearMood] = useState('curious');

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  // Update bear mood based on streak
  useEffect(() => {
    if (streak >= 5) setBearMood('ecstatic');
    else if (streak >= 2) setBearMood('happy');
    else setBearMood('curious');
  }, [streak]);

  const nextQuestion = useCallback(() => {
    const nextQ = questionNum + 1;

    if (nextQ >= config.questions) {
      // Round complete
      setPhase('round-end');
      playFanfare();
      celebrate({ duration: 3000 });
      peek('excited');

      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS.length) {
          setPhase('won');
          celebrate({ duration: 5000 });
          return;
        }
        setRound(nextRound);
        setQuestionNum(0);
        setQuestion(generateQuestion(nextRound));
        setQuestionKey(k => k + 1);
        setPhase('counting');
      }, 3200);
    } else {
      setQuestionNum(nextQ);
      setQuestion(generateQuestion(round));
      setQuestionKey(k => k + 1);
      setPhase('counting');
    }
  }, [questionNum, round, config.questions, celebrate, peek]);

  const tapNumber = useCallback((number) => {
    if (phase !== 'counting') return;

    if (number === question.correctCount) {
      // Correct!
      playPop();
      setCorrectNumber(number);
      setPhase('correct');

      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 5 : 0;
      const gained = 10 + bonus;
      setScore(s => s + gained);
      if (bonus > 0) playCollectPing();

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      burst(cx, cy, {
        count: 12 + number * 2,
        spread: 70,
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
      // Wrong
      playBoing();
      setWrongNumber(number);
      setStreak(0);
      setPhase('wrong');

      setTimeout(() => {
        setWrongNumber(null);
        setPhase('counting');
      }, 600);
    }
  }, [phase, question, streak, nextQuestion, burst, peek]);

  const resetGame = useCallback(() => {
    setRound(0);
    setQuestionNum(0);
    setScore(0);
    setStreak(0);
    setPhase('counting');
    setQuestion(generateQuestion(0));
    setQuestionKey(k => k + 1);
    setBearMood('curious');
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <BackButton />

      {/* Score badge */}
      <div className="absolute top-4 right-4 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-white/50 flex items-center gap-2">
        <span className="text-lg font-heading text-amber-800">⭐ {score}</span>
        {streak >= 3 && (
          <span className="text-lg animate-bounce">🔥{streak}</span>
        )}
      </div>

      {/* Round badge */}
      <div className="absolute top-4 left-16 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-white/50">
        <span className="text-lg font-heading text-amber-800">
          Round {round + 1}
        </span>
      </div>

      {/* Bear mascot */}
      <CountingBear mood={bearMood} />

      {/* Counting area — centre of screen */}
      <div className="absolute top-20 left-4 right-4 z-10" style={{ height: '50%' }}>
        <CountingArea question={question} questionKey={questionKey} />
      </div>

      {/* "How many?" prompt */}
      <div className="absolute z-20 left-0 right-0 flex justify-center"
        style={{ top: '68%' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-lg border-2 border-amber-200/60">
          <span className="text-xl font-heading text-amber-800">
            How many {question.objectSet.emoji}?
          </span>
        </div>
      </div>

      {/* Number buttons */}
      {(phase === 'counting' || phase === 'wrong' || phase === 'correct') && (
        <div className="absolute bottom-20 left-0 right-0 z-20 flex gap-3 items-center justify-center px-4">
          {question.options.map((num, i) => (
            <NumberButton
              key={`${questionKey}-${num}`}
              number={num}
              onTap={tapNumber}
              state={
                correctNumber === num ? 'correct'
                : wrongNumber === num ? 'wrong'
                : null
              }
              delay={i * 0.08}
            />
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20 px-8 flex-wrap">
        {Array.from({ length: config.questions }, (_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < questionNum
                ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                : i === questionNum
                  ? 'bg-white scale-130 shadow-lg shadow-white/60 border-2 border-amber-300'
                  : 'bg-amber-900/20'
            }`}
            style={{ width: 14, height: 14 }}
          />
        ))}
      </div>

      {/* Round complete overlay */}
      {phase === 'round-end' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex gap-3">
            {[0, 1, 2].map(i => (
              <svg key={i} width={52} height={52} viewBox="0 0 22 22"
                style={{ animationDelay: `${i * 150}ms` }}
                className="animate-spin-slow drop-shadow-lg"
              >
                <polygon
                  points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                  fill="#eab308" stroke="#ca8a04" strokeWidth={1}
                />
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* Win screen */}
      {phase === 'won' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center
                        bg-gradient-to-b from-amber-200/90 to-green-300/90 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl px-10 py-8 shadow-2xl border-4 border-amber-200/60
                          flex flex-col items-center gap-5 max-w-sm"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          >
            {/* Number parade */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n, i) => (
                <div key={n} className="w-10 h-10 rounded-xl flex items-center justify-center font-heading text-white text-lg"
                  style={{
                    background: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8'][i],
                    animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                  }}
                >
                  {n}
                </div>
              ))}
            </div>

            {/* Stars */}
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <svg key={i} width={44} height={44} viewBox="0 0 22 22"
                  style={{ animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + i * 0.15}s both` }}
                >
                  <polygon
                    points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                    fill="#eab308" stroke="#ca8a04" strokeWidth={1}
                  />
                </svg>
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-2"
              style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both' }}
            >
              <span className="text-xl">⭐</span>
              <span className="text-3xl font-heading text-amber-800">{score}</span>
            </div>

            {/* Play again */}
            <button
              onClick={resetGame}
              className="bg-amber-400 text-white font-heading text-xl px-10 py-4 rounded-2xl shadow-lg
                         active:scale-95 transition-transform flex items-center gap-2 border-2 border-amber-500/30"
              style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both' }}
            >
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path d="M12 4V1L8 5l4 4V6a6 6 0 110 12 6 6 0 01-6-6H4a8 8 0 108-8z" fill="white" />
              </svg>
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
