import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playCollectPing, playTone } from '../hooks/useSound';
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

/* ── Level definitions — 12 levels with progressive difficulty ── */
const LEVELS = [
  // Touch-to-count: tap each object one-by-one to learn counting
  { id: 1,  label: '👆', mode: 'touch', maxCount: 3, questions: 3, title: 'Tap to Count' },
  { id: 2,  label: '👆', mode: 'touch', maxCount: 5, questions: 4, title: 'Tap to Count' },
  // Pick the right number
  { id: 3,  label: '1️⃣', mode: 'pick', maxCount: 3, options: 3, questions: 4, title: 'Count to 3' },
  { id: 4,  label: '2️⃣', mode: 'pick', maxCount: 4, options: 3, questions: 5, title: 'Count to 4' },
  { id: 5,  label: '3️⃣', mode: 'pick', maxCount: 5, options: 4, questions: 5, title: 'Count to 5' },
  // More or less comparison
  { id: 6,  label: '⚖️', mode: 'compare', maxCount: 5, questions: 5, title: 'More or Less?' },
  // Pick the right number — harder
  { id: 7,  label: '4️⃣', mode: 'pick', maxCount: 6, options: 4, questions: 6, title: 'Count to 6' },
  { id: 8,  label: '5️⃣', mode: 'pick', maxCount: 7, options: 5, questions: 6, title: 'Count to 7' },
  // Number ordering
  { id: 9,  label: '🔢', mode: 'order', maxCount: 5, questions: 4, title: 'Number Order' },
  { id: 10, label: '6️⃣', mode: 'pick', maxCount: 8, options: 5, questions: 7, title: 'Count to 8' },
  { id: 11, label: '⚖️', mode: 'compare', maxCount: 10, questions: 6, title: 'Big Numbers!' },
  { id: 12, label: '🏆', mode: 'pick', maxCount: 10, options: 6, questions: 8, title: 'Count to 10!' },
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

/* ── Touch-to-count level: tap each object to count them ── */
function TouchCountLevel({ levelConfig, onComplete, onBack }) {
  const [questionNum, setQuestionNum] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(0, levelConfig));
  const [questionKey, setQuestionKey] = useState(0);
  const [tappedCount, setTappedCount] = useState(0);
  const [tappedSet, setTappedSet] = useState(new Set());
  const [phase, setPhase] = useState('tapping'); // tapping | correct | won
  const [mistakes, setMistakes] = useState(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tapObject = useCallback((idx, e) => {
    if (phase !== 'tapping' || tappedSet.has(idx)) return;
    playPop();
    playTone(220 + tappedCount * 80, 0.15);

    const next = new Set(tappedSet);
    next.add(idx);
    setTappedSet(next);
    setTappedCount(next.size);

    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 4, spread: 25, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
    }

    if (next.size === question.correctCount) {
      // All counted!
      playSuccess();
      setPhase('correct');
      peek('happy');

      setTimeout(() => {
        const nextQ = questionNum + 1;
        if (nextQ >= levelConfig.questions) {
          setPhase('won');
          playFanfare();
          const starsEarned = mistakes === 0 ? 3 : 2;
          celebrate({ duration: 3000 });
          peek('excited');
          setTimeout(() => onComplete(starsEarned), 3200);
        } else {
          setQuestionNum(nextQ);
          setQuestion(generateQuestion(0, levelConfig));
          setQuestionKey(k => k + 1);
          setTappedCount(0);
          setTappedSet(new Set());
          setPhase('tapping');
        }
      }, 1200);
    }
  }, [phase, tappedSet, tappedCount, question, questionNum, levelConfig, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Big count display */}
      <div className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-3
                      shadow-lg border-4 border-amber-200/60">
        <span className="text-4xl font-heading text-amber-800"
          style={{ animation: tappedCount > 0 ? 'pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none' }}
          key={tappedCount}>
          {tappedCount}
        </span>
      </div>

      <div className="absolute top-4 left-20 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-white/50">
        <span className="text-lg font-heading text-amber-800">👆 Tap each one!</span>
      </div>

      <CountingBear mood={tappedCount > 0 ? 'happy' : 'curious'} />

      {/* Tappable objects */}
      <div className="absolute top-20 left-4 right-4 z-10" style={{ height: '55%' }}>
        <div className="relative w-full h-full">
          <div className="absolute inset-4 rounded-3xl border-4 border-white/30"
            style={{ background: `${question.objectSet.bg}90`, backdropFilter: 'blur(4px)' }} />
          {question.positions.map((pos, i) => (
            <button
              key={`${questionKey}-${i}`}
              onPointerDown={(e) => tapObject(i, e)}
              className={`absolute select-none transition-all duration-200 ${
                tappedSet.has(i) ? 'scale-125 opacity-60' : 'cursor-pointer active:scale-90'
              }`}
              style={{
                left: `${pos.x}%`, top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${tappedSet.has(i) ? 1.2 : pos.scale})`,
                fontSize: '3.2rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${pos.delay}s both`,
                touchAction: 'none',
              }}>
              {question.objectSet.emoji}
              {tappedSet.has(i) && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-white rounded-full w-6 h-6
                                 text-xs font-heading flex items-center justify-center shadow"
                  style={{ animation: 'pop-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
                  {Array.from(tappedSet).indexOf(i) + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {Array.from({ length: levelConfig.questions }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < questionNum ? 'bg-amber-400' : i === questionNum ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Compare level: which group has more/less? ── */
function CompareLevel({ levelConfig, onComplete, onBack }) {
  const [questionNum, setQuestionNum] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedSide, setSelectedSide] = useState(null);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  // Generate a comparison question
  const [questions] = useState(() => {
    return Array.from({ length: levelConfig.questions }, () => {
      const obj1 = OBJECT_SETS[Math.floor(Math.random() * OBJECT_SETS.length)];
      let obj2 = OBJECT_SETS[Math.floor(Math.random() * OBJECT_SETS.length)];
      while (obj2.emoji === obj1.emoji) obj2 = OBJECT_SETS[Math.floor(Math.random() * OBJECT_SETS.length)];
      const count1 = 1 + Math.floor(Math.random() * levelConfig.maxCount);
      let count2 = 1 + Math.floor(Math.random() * levelConfig.maxCount);
      while (count2 === count1) count2 = 1 + Math.floor(Math.random() * levelConfig.maxCount);
      const askMore = Math.random() > 0.5;
      return { obj1, obj2, count1, count2, askMore };
    });
  });

  const q = questions[questionNum];
  const correctSide = q.askMore
    ? (q.count1 > q.count2 ? 'left' : 'right')
    : (q.count1 < q.count2 ? 'left' : 'right');

  const tapSide = useCallback((side) => {
    if (phase !== 'playing') return;
    setSelectedSide(side);

    if (side === correctSide) {
      playPop();
      playSuccess();
      setPhase('correct');
      setScore(s => s + 10);
      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 10, spread: 50, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
      peek('happy');

      setTimeout(() => {
        setSelectedSide(null);
        if (questionNum + 1 >= levelConfig.questions) {
          const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          peek('excited');
          setTimeout(() => onComplete(starsEarned), 3200);
        } else {
          setQuestionNum(n => n + 1);
          setPhase('playing');
        }
      }, 1000);
    } else {
      playBoing();
      setPhase('wrong');
      setMistakes(m => m + 1);
      setTimeout(() => { setSelectedSide(null); setPhase('playing'); }, 600);
    }
  }, [phase, correctSide, questionNum, levelConfig.questions, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50">
        <span className="text-lg font-heading text-amber-800">⭐ {score}</span>
      </div>

      {/* Question prompt */}
      <div className="absolute top-16 left-0 right-0 flex justify-center z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-lg border-2 border-amber-200/60">
          <span className="text-xl font-heading text-amber-800">
            Which has {q.askMore ? '✨ MORE' : '🤏 LESS'}?
          </span>
        </div>
      </div>

      {/* Two groups side by side */}
      <div className="absolute top-28 left-0 right-0 bottom-20 z-10 flex gap-4 px-4 items-center">
        {['left', 'right'].map((side) => {
          const count = side === 'left' ? q.count1 : q.count2;
          const obj = side === 'left' ? q.obj1 : q.obj2;
          const isSelected = selectedSide === side;
          let borderColor = 'white';
          if (isSelected && phase === 'correct') borderColor = '#22c55e';
          if (isSelected && phase === 'wrong') borderColor = '#ef4444';

          return (
            <button key={side} onPointerDown={() => tapSide(side)}
              className={`flex-1 rounded-3xl p-4 border-4 transition-all cursor-pointer
                ${isSelected && phase === 'wrong' ? 'animate-wiggle' : ''}
                ${isSelected && phase === 'correct' ? 'scale-105' : 'active:scale-95'}`}
              style={{
                backgroundColor: `${obj.bg}cc`, borderColor,
                boxShadow: isSelected ? `0 0 20px ${borderColor}60` : '0 4px 12px rgba(0,0,0,0.1)',
                height: '70%', touchAction: 'none',
              }}>
              <div className="flex flex-wrap gap-1 justify-center items-center h-full">
                {Array.from({ length: count }, (_, i) => (
                  <span key={i} className="text-3xl" style={{
                    animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                  }}>{obj.emoji}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < questionNum ? 'bg-amber-400' : i === questionNum ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Order level: tap numbers in order (1, 2, 3...) ── */
function NumberOrderLevel({ levelConfig, onComplete, onBack }) {
  const targetCount = levelConfig.maxCount;
  const numbers = Array.from({ length: targetCount }, (_, i) => i + 1);
  const [shuffled] = useState(() => {
    const a = [...numbers];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
  const [nextExpected, setNextExpected] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [wrongNum, setWrongNum] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tapNumber = useCallback((num) => {
    if (num === nextExpected) {
      playPop();
      playTone(220 + num * 40, 0.15);
      setCompleted(prev => [...prev, num]);
      setNextExpected(n => n + 1);

      burst(window.innerWidth / 2, window.innerHeight * 0.3, {
        count: 6, spread: 30, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });

      if (num === targetCount) {
        playFanfare();
        const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        celebrate({ duration: 3000 });
        peek('excited');
        setTimeout(() => onComplete(starsEarned), 3200);
      } else {
        peek('happy');
      }
    } else {
      playBoing();
      setWrongNum(num);
      setMistakes(m => m + 1);
      setTimeout(() => setWrongNum(null), 400);
    }
  }, [nextExpected, targetCount, mistakes, burst, peek, celebrate, onComplete]);

  const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl">🔢 Tap 1, 2, 3...</h2>
      </div>

      {/* Completed sequence display */}
      <div className="relative z-10 flex justify-center gap-1 px-4 mb-4">
        {numbers.map((n) => (
          <div key={n}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg border-2 transition-all ${
              completed.includes(n)
                ? 'bg-green-100 border-green-400 text-green-700'
                : n === nextExpected
                  ? 'bg-amber-50 border-amber-400 text-amber-400 animate-pulse'
                  : 'bg-white/50 border-gray-200 text-gray-300'
            }`}>
            {completed.includes(n) ? n : '?'}
          </div>
        ))}
      </div>

      {/* Shuffled number buttons */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="flex gap-3 flex-wrap justify-center max-w-lg">
          {shuffled.map((num, i) => {
            const isDone = completed.includes(num);
            const isWrong = wrongNum === num;
            const color = colors[(num - 1) % colors.length];

            return (
              <button key={num} onPointerDown={() => !isDone && tapNumber(num)}
                className={`rounded-3xl flex items-center justify-center border-4 transition-all
                  ${isDone ? 'opacity-30 scale-90' : 'active:scale-90 cursor-pointer'}
                  ${isWrong ? 'animate-wiggle' : ''}`}
                style={{
                  width: 72, height: 72,
                  background: isDone ? '#e5e7eb' : `linear-gradient(135deg, ${color}dd, ${color})`,
                  borderColor: isDone ? '#d1d5db' : isWrong ? '#ef4444' : 'rgba(255,255,255,0.6)',
                  boxShadow: isDone ? 'none' : `0 4px 12px ${color}40`,
                  touchAction: 'none',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s both`,
                }}>
                <span className="text-3xl font-heading" style={{ color: isDone ? '#9ca3af' : 'white' }}>
                  {num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Pick-the-number level (original counting mode) ── */
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
  const mode = levelConfig.mode || 'pick';

  if (mode === 'touch') {
    return <TouchCountLevel key={currentLevel} levelConfig={levelConfig} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (mode === 'compare') {
    return <CompareLevel key={currentLevel} levelConfig={levelConfig} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (mode === 'order') {
    return <NumberOrderLevel key={currentLevel} levelConfig={levelConfig} onComplete={handleComplete} onBack={backToLevels} />;
  }
  return <CountingLevel key={currentLevel} levelConfig={levelConfig} onComplete={handleComplete} onBack={backToLevels} />;
}
