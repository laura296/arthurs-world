import { useState, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playSuccess, playBoing, playPop, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── shape + colour data ── */

const COLORS = [
  { name: 'Red',    fill: '#ef4444' },
  { name: 'Blue',   fill: '#3b82f6' },
  { name: 'Green',  fill: '#22c55e' },
  { name: 'Yellow', fill: '#eab308' },
  { name: 'Purple', fill: '#a855f7' },
  { name: 'Orange', fill: '#f97316' },
  { name: 'Pink',   fill: '#ec4899' },
  { name: 'Cyan',   fill: '#06b6d4' },
];

const SHAPES = [
  { name: 'Circle',   path: (s) => <circle cx={s/2} cy={s/2} r={s/2 - 4} /> },
  { name: 'Square',   path: (s) => <rect x={4} y={4} width={s - 8} height={s - 8} rx={6} /> },
  { name: 'Triangle', path: (s) => <polygon points={`${s/2},4 ${s - 4},${s - 4} 4,${s - 4}`} /> },
  { name: 'Star',     path: (s) => {
    const cx = s / 2, cy = s / 2, r1 = s / 2 - 4, r2 = r1 * 0.4;
    const pts = Array.from({ length: 10 }, (_, i) => {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    return <polygon points={pts} />;
  }},
  { name: 'Diamond',  path: (s) => <polygon points={`${s/2},4 ${s - 4},${s/2} ${s/2},${s - 4} 4,${s/2}`} /> },
  { name: 'Heart',    path: (s) => {
    const w = s - 8, cx = s / 2;
    return <path d={`M ${cx} ${s - 8} C ${cx - w * 0.6} ${s * 0.55} ${4} ${s * 0.2} ${cx} ${s * 0.35} C ${s - 4} ${s * 0.2} ${cx + w * 0.6} ${s * 0.55} ${cx} ${s - 8} Z`} />;
  }},
  { name: 'Pentagon', path: (s) => {
    const cx = s / 2, cy = s / 2, r = s / 2 - 4;
    const pts = Array.from({ length: 5 }, (_, i) => {
      const angle = (2 * Math.PI / 5) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    return <polygon points={pts} />;
  }},
  { name: 'Hexagon', path: (s) => {
    const cx = s / 2, cy = s / 2, r = s / 2 - 4;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    return <polygon points={pts} />;
  }},
];

/* ── SVG shape renderer ── */

function ShapeSVG({ shape, color, size = 80, outline = false }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g
        fill={outline ? 'none' : color.fill}
        stroke={color.fill}
        strokeWidth={outline ? 3 : 2}
        strokeLinejoin="round"
        strokeDasharray={outline ? '6 4' : 'none'}
      >
        {shape.path(size)}
      </g>
    </svg>
  );
}

/* ── visual-only modes (no reading required) ── */
// 'match-shape'  : target is coloured shape → options are SAME colour, different shapes → find same shape
// 'match-colour' : target is coloured shape → options are SAME shape, different colours → find same colour
// 'match-both'   : target is coloured shape → options are different shapes AND colours → find exact match

const MODES = ['match-shape', 'match-colour', 'match-both'];

/* ── difficulty progression ── */
const ROUNDS = [
  { shapes: 4, colours: 4, options: 3, questionsPerRound: 5 },
  { shapes: 5, colours: 5, options: 3, questionsPerRound: 6 },
  { shapes: 6, colours: 6, options: 4, questionsPerRound: 7 },
  { shapes: 8, colours: 8, options: 4, questionsPerRound: 8 },
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

function pickRandom(arr, count) {
  return shuffle(arr).slice(0, count);
}

function generateQuestion(round, mode) {
  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const availShapes = SHAPES.slice(0, config.shapes);
  const availColours = COLORS.slice(0, config.colours);

  const correctShape = availShapes[Math.floor(Math.random() * availShapes.length)];
  const correctColour = availColours[Math.floor(Math.random() * availColours.length)];

  let options;

  if (mode === 'match-shape') {
    // all options same colour, different shapes — find the matching shape
    const wrongShapes = availShapes.filter(s => s.name !== correctShape.name);
    const distractors = pickRandom(wrongShapes, config.options - 1);
    options = shuffle([correctShape, ...distractors]).map(s => ({
      id: s.name,
      shape: s,
      colour: correctColour,
      isCorrect: s.name === correctShape.name,
    }));
  } else if (mode === 'match-colour') {
    // all options same shape, different colours — find the matching colour
    const wrongColours = availColours.filter(c => c.name !== correctColour.name);
    const distractors = pickRandom(wrongColours, config.options - 1);
    options = shuffle([correctColour, ...distractors]).map(c => ({
      id: c.name,
      shape: correctShape,
      colour: c,
      isCorrect: c.name === correctColour.name,
    }));
  } else {
    // match-both: different shapes AND colours — find the exact combo
    const wrongCombos = [];
    for (const s of availShapes) {
      for (const c of availColours) {
        if (s.name !== correctShape.name || c.name !== correctColour.name) {
          wrongCombos.push({ shape: s, colour: c });
        }
      }
    }
    const distractors = pickRandom(wrongCombos, config.options - 1);
    options = shuffle([
      { shape: correctShape, colour: correctColour },
      ...distractors,
    ]).map(combo => ({
      id: combo.shape.name + '-' + combo.colour.name,
      shape: combo.shape,
      colour: combo.colour,
      isCorrect: combo.shape.name === correctShape.name && combo.colour.name === correctColour.name,
    }));
  }

  return { correctShape, correctColour, mode, options };
}

/* ── main component ── */

export default function ShapeMatch() {
  const [round, setRound] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [phase, setPhase] = useState('playing'); // playing | wrong | correct | round-end | won
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scorePopup, setScorePopup] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [targetPulse, setTargetPulse] = useState(false);

  const modeIdx = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  const [question, setQuestion] = useState(() =>
    generateQuestion(0, MODES[0])
  );

  const nextQuestion = useCallback(() => {
    const nextQ = questionNum + 1;

    if (nextQ >= config.questionsPerRound) {
      setPhase('round-end');
      playFanfare();
      celebrate({ duration: 3000 });

      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS.length) {
          setPhase('won');
          celebrate({ duration: 5000 });
          return;
        }
        modeIdx.current = (modeIdx.current + 1) % MODES.length;
        setRound(nextRound);
        setQuestionNum(0);
        setQuestion(generateQuestion(nextRound, MODES[modeIdx.current]));
        setPhase('playing');
      }, 3200);
    } else {
      modeIdx.current = (modeIdx.current + 1) % MODES.length;
      setQuestionNum(nextQ);
      setQuestion(generateQuestion(round, MODES[modeIdx.current]));
      setPhase('playing');
    }
  }, [questionNum, round, config.questionsPerRound, celebrate]);

  const pickOption = useCallback((option) => {
    if (phase !== 'playing') return;

    if (option.isCorrect) {
      playPop();
      setCorrectId(option.id);
      setPhase('correct');

      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 5 : 0;
      const gained = 10 + bonus;
      const newScore = score + gained;
      setScore(newScore);

      setScorePopup(gained);
      setTimeout(() => setScorePopup(null), 800);

      if (bonus > 0) playCollectPing();
      if (Math.floor(newScore / 50) > Math.floor(score / 50)) {
        setTimeout(() => peek('excited'), 400);
      }

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      burst(cx, cy, {
        count: 12,
        spread: 70,
        colors: [question.correctColour.fill, '#facc15', '#38bdf8'],
        shapes: ['star', 'circle'],
      });

      playSuccess();

      setTimeout(() => {
        setCorrectId(null);
        setWrongId(null);
        nextQuestion();
      }, 1200);
    } else {
      playBoing();
      setWrongId(option.id);
      setStreak(0);
      setPhase('wrong');

      // pulse the target to remind kid what to match
      setTargetPulse(true);
      setTimeout(() => setTargetPulse(false), 600);

      setTimeout(() => {
        setWrongId(null);
        setPhase('playing');
      }, 600);
    }
  }, [phase, streak, score, question, nextQuestion, peek, burst]);

  const resetGame = useCallback(() => {
    modeIdx.current = 0;
    setRound(0);
    setQuestionNum(0);
    setScore(0);
    setStreak(0);
    setPhase('playing');
    setQuestion(generateQuestion(0, MODES[0]));
  }, []);

  const totalQuestions = config.questionsPerRound;
  const { correctShape, correctColour, mode, options } = question;

  // size options based on count
  const optSize = options.length <= 3 ? 96 : options.length === 4 ? 84 : 74;
  const svgSize = options.length <= 3 ? 70 : options.length === 4 ? 60 : 50;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-teal-200 via-cyan-100 to-sky-200">
      {/* subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <BackButton />

      {/* score — just a star counter, no text */}
      <div className="absolute top-4 right-4 z-30 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50 flex items-center gap-1">
        <svg width={22} height={22} viewBox="0 0 22 22">
          <polygon
            points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
            fill="#eab308" stroke="#ca8a04" strokeWidth={1}
          />
        </svg>
        <span className="text-lg font-heading text-teal-800">{score}</span>
        {streak >= 3 && (
          <span className="text-lg font-heading text-orange-500 animate-bounce">
            x{streak}
          </span>
        )}
      </div>

      {/* score popup */}
      {scorePopup && (
        <div className="absolute top-16 right-6 z-40 text-2xl font-heading text-green-600 drop-shadow-lg animate-bounce-in">
          +{scorePopup}
        </div>
      )}

      {/* ── target shape (what to match) ── */}
      <div className="absolute top-16 left-0 right-0 flex flex-col items-center z-10 px-4">
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-xl border-4 flex flex-col items-center gap-2 transition-all duration-300 ${
          targetPulse
            ? 'border-orange-400 scale-105'
            : 'border-white/60 scale-100'
        }`}>
          {/* arrow pointing down — visual cue: "find this one below" */}
          <ShapeSVG shape={correctShape} color={correctColour} size={100} />

          {/* mode hint icon: shape outline, colour swatch, or equals sign */}
          <div className="flex items-center gap-2 mt-1">
            {mode === 'match-shape' && (
              <>
                {/* dashed outline hint: match the shape */}
                <ShapeSVG shape={correctShape} color={{ fill: '#94a3b8' }} size={28} outline />
                <span className="text-slate-400 text-lg">=</span>
                <span className="text-slate-400 text-lg">?</span>
              </>
            )}
            {mode === 'match-colour' && (
              <>
                {/* colour swatch hint: match the colour */}
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: correctColour.fill }} />
                <span className="text-slate-400 text-lg">=</span>
                <span className="text-slate-400 text-lg">?</span>
              </>
            )}
            {mode === 'match-both' && (
              <>
                {/* both: shape outline + colour swatch */}
                <ShapeSVG shape={correctShape} color={{ fill: '#94a3b8' }} size={24} outline />
                <span className="text-slate-400 text-sm">+</span>
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: correctColour.fill }} />
                <span className="text-slate-400 text-lg">=</span>
                <span className="text-slate-400 text-lg">?</span>
              </>
            )}
          </div>
        </div>

        {/* bouncing arrow pointing down to options */}
        <div className="mt-2 animate-bounce text-teal-400 text-3xl leading-none select-none" aria-hidden>
          <svg width={32} height={20} viewBox="0 0 32 20" fill="none">
            <path d="M4 4 L16 16 L28 4" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── answer options ── */}
      {(phase === 'playing' || phase === 'wrong' || phase === 'correct') && (
        <div className="absolute bottom-24 left-0 right-0 z-20 px-4">
          <div className="flex gap-3 items-center justify-center flex-wrap">
            {options.map((opt, i) => {
              const isWrong = wrongId === opt.id;
              const isRight = correctId === opt.id;

              return (
                <button
                  key={opt.id + '-' + i}
                  onClick={() => pickOption(opt)}
                  className={`rounded-3xl shadow-lg flex items-center justify-center
                    transition-all duration-200 border-4
                    ${isWrong
                      ? 'animate-wiggle bg-red-200/80 border-red-400 scale-90'
                      : isRight
                        ? 'bg-green-200/80 border-green-400 scale-110'
                        : 'bg-white/70 backdrop-blur-sm border-white/50 active:scale-90 hover:bg-white/90'
                    }`}
                  style={{
                    width: optSize,
                    height: optSize,
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  {isWrong
                    ? <svg width={svgSize * 0.6} height={svgSize * 0.6} viewBox="0 0 24 24">
                        <path d="M6 6L18 18M18 6L6 18" stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
                      </svg>
                    : <ShapeSVG shape={opt.shape} color={opt.colour} size={svgSize} />
                  }
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── progress dots ── */}
      <div className="absolute bottom-5 left-0 right-0 flex gap-2 justify-center z-20 px-8 flex-wrap">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 shadow-md ${
              i < questionNum
                ? 'bg-teal-400 scale-100'
                : i === questionNum
                  ? 'bg-white scale-125 shadow-lg shadow-white/50'
                  : 'bg-white/40 scale-100'
            }`}
            style={{ width: 14, height: 14 }}
          />
        ))}
      </div>

      {/* ── win screen ── */}
      {phase === 'won' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-teal-400/90 to-cyan-500/90 backdrop-blur-sm">
          <div className="bg-white/90 rounded-3xl px-8 py-6 shadow-2xl border-4 border-white/60 flex flex-col items-center gap-4 max-w-xs">
            <div className="flex gap-2">
              {SHAPES.slice(0, 5).map((s, i) => (
                <ShapeSVG key={s.name} shape={s} color={COLORS[i]} size={36} />
              ))}
            </div>
            {/* star row instead of text */}
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <svg key={i} width={36} height={36} viewBox="0 0 22 22">
                  <polygon
                    points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                    fill="#eab308" stroke="#ca8a04" strokeWidth={1}
                  />
                </svg>
              ))}
            </div>
            <button
              onClick={resetGame}
              className="bg-teal-500 text-white font-heading text-xl px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2"
            >
              {/* replay icon */}
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
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
