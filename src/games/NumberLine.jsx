import { useState, useCallback, useEffect } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playPop, playSuccess, playBoing, playFanfare, playTone, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* ── Level definitions ── */
const LEVELS = [
  // Tap numbers in order
  { id: 1,  label: '1️⃣', mode: 'sequence', range: [1, 5],  title: 'Count 1 to 5' },
  { id: 2,  label: '2️⃣', mode: 'sequence', range: [1, 10], title: 'Count 1 to 10' },
  // Find the missing number
  { id: 3,  label: '❓', mode: 'missing',  range: [1, 5],  questions: 4, title: 'Missing Number' },
  { id: 4,  label: '❓', mode: 'missing',  range: [1, 10], questions: 5, title: 'Missing Number' },
  // What comes next?
  { id: 5,  label: '▶️', mode: 'next',     range: [1, 5],  questions: 4, title: 'What Comes Next?' },
  { id: 6,  label: '▶️', mode: 'next',     range: [1, 10], questions: 5, title: 'What Comes Next?' },
  // Counting by 2s
  { id: 7,  label: '2️⃣', mode: 'skip',    step: 2, range: [2, 10], title: 'Count by 2s' },
  // What comes before?
  { id: 8,  label: '◀️', mode: 'before',   range: [1, 10], questions: 5, title: 'What Comes Before?' },
  // Bigger and smaller
  { id: 9,  label: '📏', mode: 'bigger',   range: [1, 10], questions: 5, title: 'Which Is Bigger?' },
  // Count backwards
  { id: 10, label: '🔄', mode: 'backward', range: [1, 10], title: 'Count Backwards' },
  // Count by 5s
  { id: 11, label: '5️⃣', mode: 'skip',    step: 5, range: [5, 30], title: 'Count by 5s' },
  // Master level
  { id: 12, label: '🏆', mode: 'missing',  range: [1, 20], questions: 8, title: 'Number Master!' },
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

/* ── Background ── */
function NumberScene() {
  return (
    <div className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)' }}>
      {/* Number clouds */}
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} className="absolute opacity-10 font-heading text-7xl text-blue-900"
          style={{
            left: `${10 + n * 18}%`, top: `${5 + (n % 3) * 8}%`,
            animation: `seed-float ${4 + n}s ease-in-out ${n * 0.5}s infinite`,
          }}>{n}</div>
      ))}
    </div>
  );
}

/* ── Number button ── */
function NumBtn({ num, state, onTap, delay = 0, size = 'normal' }) {
  const colors = ['', '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
                  '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];
  const color = colors[num % 11] || colors[num % 10 || 1];
  const w = size === 'large' ? 80 : 64;

  return (
    <button onPointerDown={() => onTap(num)}
      className={`rounded-2xl flex items-center justify-center border-4 transition-all cursor-pointer
        ${state === 'correct' ? 'scale-110 border-green-400 ring-4 ring-green-300/50' : ''}
        ${state === 'wrong' ? 'scale-90 border-red-400 animate-wiggle' : ''}
        ${state === 'done' ? 'opacity-30 scale-90' : ''}
        ${!state ? 'active:scale-90 border-white/60' : ''}`}
      style={{
        width: w, height: w,
        background: state === 'correct' ? 'linear-gradient(135deg, #86efac, #22c55e)'
          : state === 'wrong' ? 'linear-gradient(135deg, #fca5a5, #ef4444)'
          : state === 'done' ? '#e5e7eb'
          : `linear-gradient(135deg, ${color}dd, ${color})`,
        boxShadow: state === 'done' ? 'none' : `0 4px 12px ${color}40, inset 0 2px 4px rgba(255,255,255,0.25)`,
        touchAction: 'none',
        animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
      }}>
      <span className="text-2xl font-heading text-white drop-shadow-md">
        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : num}
      </span>
    </button>
  );
}

/* ── Sequence level: tap numbers in order ── */
function SequenceLevel({ level, onComplete, onBack }) {
  const [start, end] = level.range;
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const [shuffled] = useState(() => shuffle(numbers));
  const [nextExpected, setNextExpected] = useState(start);
  const [completed, setCompleted] = useState([]);
  const [wrongNum, setWrongNum] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tap = useCallback((num) => {
    if (completed.includes(num)) return;
    if (num === nextExpected) {
      playPop();
      playTone(220 + num * 30, 0.15);
      setCompleted(prev => [...prev, num]);
      setNextExpected(n => n + 1);
      burst(window.innerWidth / 2, window.innerHeight * 0.3, {
        count: 5, spread: 25, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
      if (num === end) {
        playFanfare();
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        celebrate({ duration: 3000 });
        peek('excited');
        setTimeout(() => onComplete(stars), 3200);
      } else {
        peek('happy');
      }
    } else {
      playBoing();
      setWrongNum(num);
      setMistakes(m => m + 1);
      setTimeout(() => setWrongNum(null), 400);
    }
  }, [nextExpected, end, completed, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <NumberScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-blue-900 text-xl">{level.title}</h2>
        <p className="text-blue-800/60 text-sm font-heading mt-1">Tap {start}, {start + 1}, {start + 2}...</p>
      </div>

      {/* Number line display */}
      <div className="relative z-10 flex justify-center gap-1 px-4 mt-4 flex-wrap">
        {numbers.map(n => (
          <div key={n} className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg border-2 transition-all ${
            completed.includes(n) ? 'bg-green-100 border-green-400 text-green-700'
              : n === nextExpected ? 'bg-amber-50 border-amber-400 text-amber-400 animate-pulse'
              : 'bg-white/50 border-gray-200 text-gray-300'
          }`}>
            {completed.includes(n) ? n : '?'}
          </div>
        ))}
      </div>

      {/* Shuffled buttons */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="flex gap-2 flex-wrap justify-center max-w-lg">
          {shuffled.map((num, i) => (
            <NumBtn key={num} num={num} delay={i * 0.05}
              state={completed.includes(num) ? 'done' : wrongNum === num ? 'wrong' : null}
              onTap={tap} />
          ))}
        </div>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Missing number level ── */
function MissingLevel({ level, onComplete, onBack }) {
  const [start, end] = level.range;
  const [questions] = useState(() => {
    return Array.from({ length: level.questions }, () => {
      const rangeSize = end - start + 1;
      const seqStart = start + Math.floor(Math.random() * Math.max(1, rangeSize - 4));
      const seqEnd = Math.min(seqStart + 4, end);
      const seq = Array.from({ length: seqEnd - seqStart + 1 }, (_, i) => seqStart + i);
      const missingIdx = 1 + Math.floor(Math.random() * (seq.length - 2)); // don't hide first/last
      const missing = seq[missingIdx];
      const wrong = shuffle(Array.from({ length: rangeSize }, (_, i) => start + i)
        .filter(n => n !== missing && !seq.includes(n) || (n !== missing && seq.includes(n))))
        .filter(n => n !== missing).slice(0, 2);
      return { seq, missingIdx, missing, options: shuffle([missing, ...wrong]) };
    });
  });

  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedNum, setSelectedNum] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const q = questions[qIdx];

  const tap = useCallback((num) => {
    if (phase !== 'playing') return;
    setSelectedNum(num);

    if (num === q.missing) {
      playPop();
      playSuccess();
      setPhase('correct');
      setScore(s => s + 10);
      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 10, spread: 50, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
      peek('happy');

      setTimeout(() => {
        setSelectedNum(null);
        if (qIdx + 1 >= questions.length) {
          const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          peek('excited');
          setTimeout(() => onComplete(stars), 3200);
        } else {
          setQIdx(i => i + 1);
          setPhase('playing');
        }
      }, 1000);
    } else {
      playBoing();
      setPhase('wrong');
      setMistakes(m => m + 1);
      setTimeout(() => { setSelectedNum(null); setPhase('playing'); }, 500);
    }
  }, [phase, q, qIdx, questions.length, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <NumberScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-blue-800 text-sm border border-white/40">⭐ {score}</div>

      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-blue-900 text-xl">❓ {level.title}</h2>
        <p className="text-blue-800/60 text-sm font-heading mt-1">Find the missing number!</p>
      </div>

      {/* Number sequence with gap */}
      <div className="relative z-10 flex justify-center gap-2 px-4 mt-6">
        {q.seq.map((n, i) => (
          <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-heading text-2xl border-4 transition-all
            ${i === q.missingIdx
              ? 'bg-amber-50 border-amber-400 border-dashed text-amber-400 animate-pulse'
              : 'bg-white border-blue-200 text-blue-800'
            }`}
            style={{ animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
            {i === q.missingIdx ? '?' : n}
          </div>
        ))}
      </div>

      {/* Answer options */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="flex gap-4">
          {q.options.map((num, i) => {
            let state = null;
            if (selectedNum === num && phase === 'correct') state = 'correct';
            if (selectedNum === num && phase === 'wrong') state = 'wrong';
            return <NumBtn key={num} num={num} state={state} onTap={tap} delay={i * 0.1} size="large" />;
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < qIdx ? 'bg-blue-400' : i === qIdx ? 'bg-white scale-125 border-2 border-blue-300' : 'bg-blue-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── What comes next / before ── */
function NextBeforeLevel({ level, onComplete, onBack }) {
  const [start, end] = level.range;
  const isBefore = level.mode === 'before';
  const [questions] = useState(() => {
    return Array.from({ length: level.questions }, () => {
      const num = (isBefore ? start + 1 : start) + Math.floor(Math.random() * (end - start - (isBefore ? 1 : 1)));
      const answer = isBefore ? num - 1 : num + 1;
      const wrong = shuffle(Array.from({ length: end - start + 1 }, (_, i) => start + i)
        .filter(n => n !== answer)).slice(0, 2);
      return { num, answer, options: shuffle([answer, ...wrong]) };
    });
  });

  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedNum, setSelectedNum] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const q = questions[qIdx];

  const tap = useCallback((num) => {
    if (phase !== 'playing') return;
    setSelectedNum(num);

    if (num === q.answer) {
      playPop(); playSuccess();
      setPhase('correct');
      setScore(s => s + 10);
      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 8, spread: 40, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
      peek('happy');

      setTimeout(() => {
        setSelectedNum(null);
        if (qIdx + 1 >= questions.length) {
          const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          peek('excited');
          setTimeout(() => onComplete(stars), 3200);
        } else { setQIdx(i => i + 1); setPhase('playing'); }
      }, 1000);
    } else {
      playBoing();
      setPhase('wrong');
      setMistakes(m => m + 1);
      setTimeout(() => { setSelectedNum(null); setPhase('playing'); }, 500);
    }
  }, [phase, q, qIdx, questions.length, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <NumberScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-blue-800 text-sm border border-white/40">⭐ {score}</div>

      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-blue-900 text-xl">{level.title}</h2>
      </div>

      {/* Show the number with arrow */}
      <div className="relative z-10 flex justify-center items-center gap-3 mt-6">
        {isBefore && (
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-4 border-amber-400 border-dashed
                          flex items-center justify-center animate-pulse">
            <span className="text-2xl font-heading text-amber-400">?</span>
          </div>
        )}
        {isBefore && <span className="text-2xl text-blue-400">→</span>}
        <div className="w-20 h-20 rounded-2xl bg-white border-4 border-blue-400 flex items-center justify-center shadow-lg"
          style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <span className="text-4xl font-heading text-blue-800">{q.num}</span>
        </div>
        {!isBefore && <span className="text-2xl text-blue-400">→</span>}
        {!isBefore && (
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-4 border-amber-400 border-dashed
                          flex items-center justify-center animate-pulse">
            <span className="text-2xl font-heading text-amber-400">?</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="flex gap-4">
          {q.options.map((num, i) => {
            let state = null;
            if (selectedNum === num && phase === 'correct') state = 'correct';
            if (selectedNum === num && phase === 'wrong') state = 'wrong';
            return <NumBtn key={num} num={num} state={state} onTap={tap} delay={i * 0.1} size="large" />;
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < qIdx ? 'bg-blue-400' : i === qIdx ? 'bg-white scale-125 border-2 border-blue-300' : 'bg-blue-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Skip counting (2s, 5s) ── */
function SkipCountLevel({ level, onComplete, onBack }) {
  const [start, end] = level.range;
  const step = level.step;
  const numbers = [];
  for (let n = start; n <= end; n += step) numbers.push(n);
  const [shuffled] = useState(() => shuffle(numbers));
  const [nextIdx, setNextIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [wrongNum, setWrongNum] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tap = useCallback((num) => {
    if (completed.includes(num)) return;
    if (num === numbers[nextIdx]) {
      playPop(); playTone(220 + num * 20, 0.15);
      setCompleted(prev => [...prev, num]);
      setNextIdx(n => n + 1);
      burst(window.innerWidth / 2, window.innerHeight * 0.3, {
        count: 5, spread: 25, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });
      if (nextIdx + 1 >= numbers.length) {
        playFanfare();
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        celebrate({ duration: 3000 }); peek('excited');
        setTimeout(() => onComplete(stars), 3200);
      } else { peek('happy'); }
    } else {
      playBoing(); setWrongNum(num); setMistakes(m => m + 1);
      setTimeout(() => setWrongNum(null), 400);
    }
  }, [nextIdx, numbers, completed, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <NumberScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-blue-900 text-xl">{level.title}</h2>
        <p className="text-blue-800/60 text-sm font-heading mt-1">Tap {start}, {start + step}, {start + step * 2}...</p>
      </div>

      <div className="relative z-10 flex justify-center gap-1 px-4 mt-4 flex-wrap">
        {numbers.map(n => (
          <div key={n} className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading text-lg border-2 transition-all ${
            completed.includes(n) ? 'bg-green-100 border-green-400 text-green-700'
              : n === numbers[nextIdx] ? 'bg-amber-50 border-amber-400 text-amber-400 animate-pulse'
              : 'bg-white/50 border-gray-200 text-gray-300'
          }`}>{completed.includes(n) ? n : '?'}</div>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="flex gap-2 flex-wrap justify-center max-w-lg">
          {shuffled.map((num, i) => (
            <NumBtn key={num} num={num} delay={i * 0.05}
              state={completed.includes(num) ? 'done' : wrongNum === num ? 'wrong' : null}
              onTap={tap} />
          ))}
        </div>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Bigger/smaller comparison ── */
function BiggerLevel({ level, onComplete, onBack }) {
  const [start, end] = level.range;
  const [questions] = useState(() => {
    return Array.from({ length: level.questions }, () => {
      const a = start + Math.floor(Math.random() * (end - start));
      let b = start + Math.floor(Math.random() * (end - start + 1));
      while (b === a) b = start + Math.floor(Math.random() * (end - start + 1));
      return { a, b, answer: Math.max(a, b) };
    });
  });

  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedNum, setSelectedNum] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const q = questions[qIdx];

  const tap = useCallback((num) => {
    if (phase !== 'playing') return;
    setSelectedNum(num);
    if (num === q.answer) {
      playPop(); playSuccess(); setPhase('correct'); setScore(s => s + 10);
      burst(window.innerWidth / 2, window.innerHeight / 2, { count: 8, spread: 40, colors: ['#facc15', '#22c55e'], shapes: ['star'] });
      peek('happy');
      setTimeout(() => {
        setSelectedNum(null);
        if (qIdx + 1 >= questions.length) {
          const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 }); peek('excited');
          setTimeout(() => onComplete(stars), 3200);
        } else { setQIdx(i => i + 1); setPhase('playing'); }
      }, 1000);
    } else {
      playBoing(); setPhase('wrong'); setMistakes(m => m + 1);
      setTimeout(() => { setSelectedNum(null); setPhase('playing'); }, 500);
    }
  }, [phase, q, qIdx, questions.length, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <NumberScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-blue-800 text-sm border border-white/40">⭐ {score}</div>

      <div className="relative z-10 pt-16 text-center">
        <h2 className="font-heading text-blue-900 text-xl">📏 Which is BIGGER?</h2>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center gap-6 px-4">
        {[q.a, q.b].map((num, i) => {
          let state = null;
          if (selectedNum === num && phase === 'correct') state = 'correct';
          if (selectedNum === num && phase === 'wrong') state = 'wrong';
          return <NumBtn key={`${qIdx}-${i}`} num={num} state={state} onTap={tap} delay={i * 0.15} size="large" />;
        })}
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < qIdx ? 'bg-blue-400' : i === qIdx ? 'bg-white scale-125 border-2 border-blue-300' : 'bg-blue-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Main export with level selection ── */
export default function NumberLine() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('number-line', LEVELS.length);

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
        title="🔢 Number Line"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const level = LEVELS[currentLevel - 1];

  switch (level.mode) {
    case 'sequence':
    case 'backward':
      return <SequenceLevel key={currentLevel} level={{
        ...level,
        range: level.mode === 'backward' ? [level.range[1], level.range[0]] : level.range,
      }} onComplete={handleComplete} onBack={backToLevels} />;
    case 'missing':
      return <MissingLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
    case 'next':
    case 'before':
      return <NextBeforeLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
    case 'skip':
      return <SkipCountLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
    case 'bigger':
      return <BiggerLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
    default:
      return null;
  }
}
