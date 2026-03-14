import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playSuccess, playBoing, playPop, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── shape + colour data ── */

const COLORS = [
  { name: 'Red',    fill: '#ef4444', glow: '#fca5a5' },
  { name: 'Blue',   fill: '#3b82f6', glow: '#93c5fd' },
  { name: 'Green',  fill: '#22c55e', glow: '#86efac' },
  { name: 'Yellow', fill: '#eab308', glow: '#fde68a' },
  { name: 'Purple', fill: '#a855f7', glow: '#d8b4fe' },
  { name: 'Orange', fill: '#f97316', glow: '#fdba74' },
  { name: 'Pink',   fill: '#ec4899', glow: '#f9a8d4' },
  { name: 'Cyan',   fill: '#06b6d4', glow: '#67e8f9' },
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

/* ── SVG shape renderer — soft 3D toy-like ── */

function ShapeSVG({ shape, color, size = 80, outline = false }) {
  const id = `sh-${shape.name}-${color.name}`.replace(/\s/g, '');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="60%" stopColor={color.fill} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-s`}>
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color.fill} floodOpacity="0.3" />
        </filter>
      </defs>
      <g
        fill={outline ? 'none' : color.fill}
        stroke={outline ? color.fill : color.fill}
        strokeWidth={outline ? 3 : 1.5}
        strokeLinejoin="round"
        strokeDasharray={outline ? '6 4' : 'none'}
        filter={outline ? 'none' : `url(#${id}-s)`}
        opacity={outline ? 0.5 : 1}
      >
        {shape.path(size)}
      </g>
      {/* highlight sheen */}
      {!outline && (
        <g fill={`url(#${id}-g)`} stroke="none">
          {shape.path(size)}
        </g>
      )}
    </svg>
  );
}

/* ── Playroom Background Scene ── */

function PlayroomScene({ round }) {
  const palettes = [
    { wall: '#FFF5E6', floor: '#E8D5B8', trim: '#D4A865', shelf: '#C4A265' },
    { wall: '#EDE9FE', floor: '#D5CAE8', trim: '#A78BCA', shelf: '#8B7AAA' },
    { wall: '#ECFDF5', floor: '#C8E8D8', trim: '#6BAA88', shelf: '#5A8A6A' },
    { wall: '#FFF1F2', floor: '#E8CDD0', trim: '#CA8B95', shelf: '#AA7A82' },
  ];
  const p = palettes[Math.min(round, palettes.length - 1)];

  const decorShapes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: 8 + (i * 13) % 90,
      y: 15 + (i * 17) % 40,
      size: 18 + (i % 3) * 8,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: i * 0.3,
      rotation: (i * 37) % 360,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden transition-colors duration-1000">
      {/* Wall */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${p.wall} 0%, ${p.wall} 65%, ${p.floor} 65%, ${p.floor} 100%)` }} />

      {/* Wall texture — subtle stripes */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 48px, ${p.trim} 48px, ${p.trim} 50px)`,
      }} />

      {/* Baseboard */}
      <div className="absolute left-0 right-0" style={{ bottom: '35%', height: '12px', background: p.trim, boxShadow: `0 2px 4px ${p.trim}40` }} />

      {/* Floor planks */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: '35%', opacity: 0.06 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{
            top: `${i * 12.5}%`, height: '1px', background: p.trim,
          }} />
        ))}
      </div>

      {/* Wooden shelf — top */}
      <div className="absolute left-[8%] right-[8%]" style={{
        top: '8%', height: '10px', background: `linear-gradient(180deg, ${p.shelf}, ${p.trim})`,
        borderRadius: '2px', boxShadow: `0 3px 6px ${p.trim}30`,
      }} />
      {/* Shelf brackets */}
      {[12, 88].map(x => (
        <svg key={x} className="absolute" style={{ left: `${x}%`, top: '8%', transform: 'translateX(-50%)' }}
          width="16" height="20" viewBox="0 0 16 20">
          <path d="M2 0 L2 16 Q2 20 8 20 L14 20 L14 18 L8 18 Q4 18 4 14 L4 0Z" fill={p.shelf} />
        </svg>
      ))}

      {/* Floating decoration shapes on the wall */}
      {decorShapes.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${d.x}%`, top: `${d.y}%`,
            opacity: 0.12,
            transform: `rotate(${d.rotation}deg)`,
            animation: `seed-float ${4 + d.delay}s ease-in-out ${d.delay}s infinite`,
          }}
        >
          <svg width={d.size} height={d.size} viewBox={`0 0 ${d.size} ${d.size}`}>
            <g fill={d.color.fill} stroke="none">{d.shape.path(d.size)}</g>
          </svg>
        </div>
      ))}

      {/* Bunting / pennant banner */}
      <svg className="absolute left-0 right-0" style={{ top: '2%' }} height="40" viewBox="0 0 800 40" preserveAspectRatio="none">
        <path d="M0 8 Q400 -5 800 8" stroke={p.trim} strokeWidth="2" fill="none" opacity="0.4" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 30 + i * 62;
          const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'];
          return (
            <polygon key={i} points={`${x - 10},8 ${x + 10},8 ${x},30`}
              fill={colors[i % colors.length]} opacity="0.3" />
          );
        })}
      </svg>

      {/* Toy blocks on shelf */}
      {[15, 30, 70, 82].map((x, i) => {
        const c = COLORS[(i * 3) % COLORS.length];
        const w = 14 + (i % 2) * 4;
        return (
          <div key={`block-${i}`} className="absolute" style={{
            left: `${x}%`, top: 'calc(8% - 8px)',
            width: `${w}px`, height: `${w}px`,
            background: c.fill,
            borderRadius: '3px',
            transform: `translateY(-100%) rotate(${(i * 7) % 15 - 7}deg)`,
            boxShadow: `0 1px 3px ${c.fill}40`,
            opacity: 0.7,
          }} />
        );
      })}

      {/* Teddy bear on shelf */}
      <div className="absolute" style={{ left: '48%', top: 'calc(8% - 4px)', transform: 'translateY(-100%)' }}>
        <svg width="28" height="32" viewBox="0 0 28 32">
          <circle cx="14" cy="16" r="10" fill="#C4922A" />
          <circle cx="14" cy="16" r="6" fill="#D4A853" />
          <circle cx="14" cy="10" r="8" fill="#C4922A" />
          <circle cx="7" cy="5" r="4" fill="#C4922A" /><circle cx="7" cy="5" r="2" fill="#D4A853" />
          <circle cx="21" cy="5" r="4" fill="#C4922A" /><circle cx="21" cy="5" r="2" fill="#D4A853" />
          <circle cx="11" cy="9" r="1.5" fill="#3a2a15" />
          <circle cx="17" cy="9" r="1.5" fill="#3a2a15" />
          <ellipse cx="14" cy="12" rx="2" ry="1.5" fill="#6B4E3D" />
          <path d="M12 13 Q14 15 16 13" stroke="#6B4E3D" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* Soft rug on the floor */}
      <div className="absolute left-[10%] right-[10%] rounded-[50%]" style={{
        bottom: '2%', height: '28%',
        background: `radial-gradient(ellipse, ${p.trim}15 0%, transparent 70%)`,
      }} />
    </div>
  );
}

/* ── Hazel the Hedgehog mascot (matching game host) ── */

function HazelGuide({ state, score }) {
  const isHappy = state === 'correct';
  const isThinking = state === 'wrong';
  const isIntro = state === 'intro';
  const isDancing = state === 'dancing';

  // Hazel gets bouncier as score increases
  const excitement = Math.min(score / 80, 1);

  return (
    <div
      className="absolute z-20 pointer-events-none select-none"
      style={{
        left: '4%', bottom: '30%',
        animation: isDancing
          ? 'hazel-dance 0.6s ease-in-out 3'
          : isHappy
            ? 'hazel-celebrate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : isThinking
              ? 'wiggle 0.4s ease-in-out'
              : isIntro
                ? 'hazel-wave 1.2s ease-in-out'
                : `seed-float ${3 - excitement}s ease-in-out infinite`,
        transformOrigin: 'bottom center',
      }}
    >
      <svg width="70" height="84" viewBox="0 0 70 84">
        {/* Body — spiky */}
        <ellipse cx="35" cy="48" rx="24" ry="20" fill="#8B6914" />
        {/* Spines — they perk up when happy */}
        {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180;
          const x1 = 35 + 20 * Math.cos(rad);
          const y1 = 48 + 16 * Math.sin(rad);
          const spineLen = isHappy || isDancing ? 32 : 28;
          const x2 = 35 + spineLen * Math.cos(rad);
          const y2 = 48 + (spineLen - 4) * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isHappy ? '#8B6914' : '#6B4E3D'}
              strokeWidth="2.5" strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}
        {/* Belly */}
        <ellipse cx="35" cy="55" rx="16" ry="12" fill="#D4A853" />
        {/* Arms */}
        {isHappy || isDancing ? (
          <>
            {/* Arms up celebrating */}
            <ellipse cx="14" cy="42" rx="5" ry="7" fill="#C4922A" transform="rotate(-30 14 42)" />
            <ellipse cx="56" cy="42" rx="5" ry="7" fill="#C4922A" transform="rotate(30 56 42)" />
            {/* Paw pads */}
            <circle cx="11" cy="37" r="3.5" fill="#D4A853" />
            <circle cx="59" cy="37" r="3.5" fill="#D4A853" />
          </>
        ) : isIntro ? (
          <>
            {/* One arm waving */}
            <ellipse cx="14" cy="50" rx="5" ry="7" fill="#C4922A" transform="rotate(-10 14 50)" />
            <ellipse cx="56" cy="40" rx="5" ry="7" fill="#C4922A" transform="rotate(40 56 40)">
              <animateTransform attributeName="transform" type="rotate"
                values="40 56 40;20 56 40;40 56 40" dur="0.6s" repeatCount="2" />
            </ellipse>
            <circle cx="59" cy="35" r="3.5" fill="#D4A853">
              <animate attributeName="cy" values="35;32;35" dur="0.6s" repeatCount="2" />
            </circle>
          </>
        ) : (
          <>
            {/* Arms resting */}
            <ellipse cx="14" cy="52" rx="5" ry="7" fill="#C4922A" transform="rotate(-10 14 52)" />
            <ellipse cx="56" cy="52" rx="5" ry="7" fill="#C4922A" transform="rotate(10 56 52)" />
          </>
        )}
        {/* Face */}
        <circle cx="35" cy="34" r="16" fill="#D4A853" />
        {/* Ears */}
        <circle cx="21" cy="24" r="5.5" fill="#C4922A" /><circle cx="21" cy="24" r="3.5" fill="#E8C97A" />
        <circle cx="49" cy="24" r="5.5" fill="#C4922A" /><circle cx="49" cy="24" r="3.5" fill="#E8C97A" />
        {/* Eyes */}
        {isHappy || isDancing ? (
          <>
            <path d="M28 32 Q31 28 34 32" stroke="#3a2a15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M36 32 Q39 28 42 32" stroke="#3a2a15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : isThinking ? (
          <>
            <circle cx="31" cy="31" r="3" fill="#3a2a15" />
            <circle cx="39" cy="31" r="3" fill="#3a2a15" />
            <circle cx="30" cy="30" r="1" fill="white" />
            <circle cx="38" cy="30" r="1" fill="white" />
            {/* Sweat drop */}
            <ellipse cx="48" cy="26" rx="2" ry="3" fill="#87CEEB" opacity="0.6">
              <animate attributeName="cy" values="26;29;26" dur="0.5s" repeatCount="1" />
            </ellipse>
          </>
        ) : (
          <>
            <circle cx="31" cy="31" r="3" fill="#3a2a15" />
            <circle cx="39" cy="31" r="3" fill="#3a2a15" />
            <circle cx="30" cy="30" r="1" fill="white" />
            <circle cx="38" cy="30" r="1" fill="white" />
            {/* Blink animation */}
            <rect x="28" y="29" width="6" height="4" fill="#D4A853" opacity="0">
              <animate attributeName="opacity" values="0;0;0;1;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="4s" repeatCount="indefinite" />
            </rect>
            <rect x="36" y="29" width="6" height="4" fill="#D4A853" opacity="0">
              <animate attributeName="opacity" values="0;0;0;1;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="4s" repeatCount="indefinite" />
            </rect>
          </>
        )}
        {/* Nose */}
        <ellipse cx="35" cy="37" rx="3.5" ry="3" fill="#3a2a15" />
        {/* Nose shine */}
        <ellipse cx="34" cy="36" rx="1.5" ry="1" fill="white" opacity="0.3" />
        {/* Cheeks — extra rosy when happy */}
        <circle cx="25" cy="37" r="3.5" fill="#F48FB1" opacity={isHappy ? 0.6 : 0.35} style={{ transition: 'opacity 0.3s' }} />
        <circle cx="45" cy="37" r="3.5" fill="#F48FB1" opacity={isHappy ? 0.6 : 0.35} style={{ transition: 'opacity 0.3s' }} />
        {/* Mouth */}
        {isHappy || isDancing
          ? <path d="M30 40 Q35 46 40 40" stroke="#6B4E3D" strokeWidth="1.5" fill="none" />
          : isThinking
            ? <ellipse cx="35" cy="41" rx="2.5" ry="2" fill="#6B4E3D" opacity="0.5" />
            : <path d="M32 40 Q35 43 38 40" stroke="#6B4E3D" strokeWidth="1.2" fill="none" />
        }
        {/* Feet */}
        <ellipse cx="25" cy="70" rx="6" ry="3.5" fill="#8B6914" />
        <ellipse cx="45" cy="70" rx="6" ry="3.5" fill="#8B6914" />
        {/* Toe pads */}
        <circle cx="22" cy="69" r="1.5" fill="#D4A853" opacity="0.5" />
        <circle cx="25" cy="70.5" r="1.5" fill="#D4A853" opacity="0.5" />
        <circle cx="42" cy="69" r="1.5" fill="#D4A853" opacity="0.5" />
        <circle cx="45" cy="70.5" r="1.5" fill="#D4A853" opacity="0.5" />
      </svg>

      {/* Sparkles around Hazel when celebrating */}
      {(isHappy || isDancing) && (
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="absolute" style={{
              left: `${10 + i * 18}px`, top: `${5 + (i % 2) * 20}px`,
              animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <polygon points="6,0 7.5,4 12,4.5 8.5,7.5 9.5,12 6,9.5 2.5,12 3.5,7.5 0,4.5 4.5,4" fill="#fbbf24" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── golden shape — special rare variant ── */

function GoldenShapeSVG({ shape, size = 80 }) {
  const id = `golden-${shape.name}`.replace(/\s/g, '');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="30%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#fff7cc" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g fill={`url(#${id}-g)`} stroke="#d97706" strokeWidth="2"
        strokeLinejoin="round" filter={`url(#${id}-glow)`}>
        {shape.path(size)}
      </g>
      {/* shimmer highlight */}
      <g fill="white" stroke="none" opacity="0.3">
        {shape.path(size * 0.6)}
      </g>
    </svg>
  );
}

/* ── visual-only modes (no reading required) ── */
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
    const wrongShapes = availShapes.filter(s => s.name !== correctShape.name);
    const distractors = pickRandom(wrongShapes, config.options - 1);
    options = shuffle([correctShape, ...distractors]).map(s => ({
      id: s.name,
      shape: s,
      colour: correctColour,
      isCorrect: s.name === correctShape.name,
    }));
  } else if (mode === 'match-colour') {
    const wrongColours = availColours.filter(c => c.name !== correctColour.name);
    const distractors = pickRandom(wrongColours, config.options - 1);
    options = shuffle([correctColour, ...distractors]).map(c => ({
      id: c.name,
      shape: correctShape,
      colour: c,
      isCorrect: c.name === correctColour.name,
    }));
  } else {
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
  const [phase, setPhase] = useState('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scorePopup, setScorePopup] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [targetPulse, setTargetPulse] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [hintIdx, setHintIdx] = useState(-1);
  const [guideState, setGuideState] = useState('intro');
  const [isGolden, setIsGolden] = useState(false);

  const modeIdx = useRef(0);
  const hintTimer = useRef(null);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  const [question, setQuestion] = useState(() =>
    generateQuestion(0, MODES[0])
  );

  // intro auto-dismiss
  useEffect(() => {
    if (phase !== 'intro') return;
    const t = setTimeout(() => {
      setPhase('playing');
      setGuideState('idle');
    }, 2200);
    return () => clearTimeout(t);
  }, [phase]);

  // hint sparkle
  useEffect(() => {
    if (phase !== 'playing') {
      setHintIdx(-1);
      return;
    }
    setHintIdx(-1);
    hintTimer.current = setTimeout(() => {
      const correctI = question.options.findIndex(o => o.isCorrect);
      setHintIdx(correctI);
    }, 4000);
    return () => clearTimeout(hintTimer.current);
  }, [phase, questionKey, question.options]);

  const nextQuestion = useCallback(() => {
    const nextQ = questionNum + 1;

    if (nextQ >= config.questionsPerRound) {
      setPhase('round-end');
      setGuideState('dancing');
      playFanfare();
      celebrate({ duration: 3000 });
      peek('excited');

      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS.length) {
          setPhase('won');
          setGuideState('dancing');
          celebrate({ duration: 5000 });
          return;
        }
        modeIdx.current = (modeIdx.current + 1) % MODES.length;
        setRound(nextRound);
        setQuestionNum(0);
        setQuestion(generateQuestion(nextRound, MODES[modeIdx.current]));
        setQuestionKey(k => k + 1);
        setPhase('playing');
        setGuideState('idle');
        setIsGolden(false);
      }, 3200);
    } else {
      modeIdx.current = (modeIdx.current + 1) % MODES.length;
      setQuestionNum(nextQ);
      setQuestion(generateQuestion(round, MODES[modeIdx.current]));
      setQuestionKey(k => k + 1);
      setPhase('playing');
      setGuideState('idle');
      // ~15% chance of golden shape (surprise delight)
      setIsGolden(Math.random() < 0.15);
    }
  }, [questionNum, round, config.questionsPerRound, celebrate, peek]);

  const pickOption = useCallback((option) => {
    if (phase !== 'playing') return;
    clearTimeout(hintTimer.current);
    setHintIdx(-1);

    if (option.isCorrect) {
      playPop();
      setCorrectId(option.id);
      setPhase('correct');

      const newStreak = streak + 1;
      setStreak(newStreak);
      const goldenBonus = isGolden ? 15 : 0;
      const streakBonus = newStreak >= 3 ? 5 : 0;
      const gained = 10 + streakBonus + goldenBonus;
      const newScore = score + gained;
      setScore(newScore);

      // Hazel dances on golden or streak milestones, otherwise just happy
      if (isGolden || newStreak >= 5) {
        setGuideState('dancing');
      } else {
        setGuideState('correct');
      }

      setScorePopup(isGolden ? `+${gained} ✨` : `+${gained}`);
      setTimeout(() => setScorePopup(null), 1000);

      if (streakBonus > 0) playCollectPing();
      if (Math.floor(newScore / 50) > Math.floor(score / 50)) {
        setTimeout(() => peek('excited'), 400);
      }

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      burst(cx, cy, {
        count: isGolden ? 24 : 14,
        spread: isGolden ? 120 : 80,
        colors: isGolden
          ? ['#fbbf24', '#fde68a', '#f59e0b', '#fff7cc', '#d97706']
          : [question.correctColour.fill, question.correctColour.glow || '#facc15', '#facc15', '#38bdf8'],
        shapes: isGolden ? ['star', 'diamond', 'star'] : ['star', 'circle', 'heart'],
      });

      if (isGolden) {
        playFanfare();
      } else {
        playSuccess();
      }

      setTimeout(() => {
        setCorrectId(null);
        setWrongId(null);
        setIsGolden(false);
        nextQuestion();
      }, isGolden ? 1600 : 1200);
    } else {
      playBoing();
      setWrongId(option.id);
      setStreak(0);
      setPhase('wrong');
      setGuideState('wrong');

      setTargetPulse(true);
      setTimeout(() => setTargetPulse(false), 600);

      setTimeout(() => {
        setWrongId(null);
        setPhase('playing');
        setGuideState('idle');
      }, 600);
    }
  }, [phase, streak, score, question, nextQuestion, peek, burst]);

  const resetGame = useCallback(() => {
    modeIdx.current = 0;
    setRound(0);
    setQuestionNum(0);
    setScore(0);
    setStreak(0);
    setIsGolden(false);
    setPhase('intro');
    setGuideState('intro');
    setQuestion(generateQuestion(0, MODES[0]));
    setQuestionKey(k => k + 1);
  }, []);

  const totalQuestions = config.questionsPerRound;
  const { correctShape, correctColour, options } = question;

  // bigger option sizes
  const optSize = options.length <= 3 ? 110 : options.length === 4 ? 96 : 84;
  const svgSize = options.length <= 3 ? 80 : options.length === 4 ? 68 : 58;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Themed playroom background */}
      <PlayroomScene round={round} />

      <BackButton />

      {/* Hazel the Hedgehog guide */}
      <HazelGuide state={guideState} score={score} />

      {/* score */}
      <div className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-amber-200/60 flex items-center gap-1.5">
        <svg width={24} height={24} viewBox="0 0 22 22">
          <polygon
            points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
            fill="#eab308" stroke="#ca8a04" strokeWidth={1}
          />
        </svg>
        <span className="text-xl font-heading text-amber-800">{score}</span>
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

      {/* round transition overlay */}
      {phase === 'round-end' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex gap-3 animate-bounce-in">
            {[0, 1, 2].map(i => (
              <svg key={i} width={52} height={52} viewBox="0 0 22 22" style={{ animationDelay: `${i * 150}ms` }} className="animate-spin-slow drop-shadow-lg">
                <polygon
                  points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                  fill="#eab308" stroke="#ca8a04" strokeWidth={1}
                />
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* ── intro overlay ── */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl border-4 border-amber-200/60 flex flex-col items-center gap-3"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            <div className="flex gap-2">
              {SHAPES.slice(0, 4).map((s, i) => (
                <div key={s.name} style={{ animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.3 + i * 0.12}s both` }}>
                  <ShapeSVG shape={s} color={COLORS[i]} size={44} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── target shape — centred with outline cutout on a "card" ── */}
      <div className="absolute top-[12%] left-0 right-0 flex flex-col items-center z-10 px-4">
        <div
          key={`target-${questionKey}`}
          className={`backdrop-blur-sm rounded-3xl px-10 py-6 shadow-2xl border-4 flex flex-col items-center gap-1 transition-all duration-300 ${
            isGolden
              ? 'bg-amber-50/95 border-amber-400'
              : targetPulse
                ? 'bg-white/90 border-orange-400 scale-110'
                : 'bg-white/90 border-amber-200/60 scale-100'
          }`}
          style={{
            animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            boxShadow: isGolden
              ? '0 0 30px rgba(251,191,36,0.4), 0 8px 32px rgba(251,191,36,0.2), 0 4px 12px rgba(0,0,0,0.08)'
              : `0 8px 32px ${correctColour.fill}20, 0 4px 12px rgba(0,0,0,0.08)`,
          }}
        >
          {isGolden ? (
            <div style={{ animation: 'hint-glow 1.5s ease-in-out infinite' }}>
              <GoldenShapeSVG shape={correctShape} size={130} />
            </div>
          ) : (
            <ShapeSVG shape={correctShape} color={correctColour} size={130} />
          )}
        </div>

        {/* bouncing arrow */}
        <div className="mt-3 animate-bounce text-amber-400 text-3xl leading-none select-none" aria-hidden>
          <svg width={36} height={24} viewBox="0 0 32 20" fill="none">
            <path d="M4 4 L16 16 L28 4" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── answer options — on a wooden "tray" ── */}
      {(phase === 'playing' || phase === 'wrong' || phase === 'correct') && (
        <div className="absolute bottom-20 left-0 right-0 z-20 px-4">
          {/* Wooden tray */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute -inset-4 -bottom-3 rounded-3xl" style={{
              background: 'linear-gradient(180deg, #D4A865 0%, #C4A265 50%, #B89255 100%)',
              boxShadow: '0 4px 12px rgba(107, 78, 61, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
            }} />
            <div className="relative flex gap-4 items-center justify-center flex-wrap py-3 px-2">
              {options.map((opt, i) => {
                const isWrong = wrongId === opt.id;
                const isRight = correctId === opt.id;
                const isHinted = hintIdx === i;

                return (
                  <button
                    key={`${opt.id}-${i}-${questionKey}`}
                    onClick={() => pickOption(opt)}
                    className={`rounded-3xl shadow-lg flex items-center justify-center
                      transition-all duration-200 border-4
                      ${isWrong
                        ? 'animate-wiggle bg-red-100 border-red-400 scale-90'
                        : isRight
                          ? 'bg-green-100 border-green-400 scale-115'
                          : isHinted
                            ? 'bg-white border-amber-300 shadow-amber-200/50 shadow-xl'
                            : 'bg-white/95 border-white/70 active:scale-90 hover:bg-white hover:shadow-xl'
                      }`}
                    style={{
                      width: optSize,
                      height: optSize,
                      animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                      ...(isHinted && !isWrong && !isRight ? {
                        animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both, hint-glow 1.2s ease-in-out infinite`,
                      } : {}),
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
        </div>
      )}

      {/* progress dots */}
      <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center z-20 px-8 flex-wrap">
        {Array.from({ length: totalQuestions }, (_, i) => (
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

      {/* win screen */}
      {phase === 'won' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-200/90 to-orange-300/90 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl px-10 py-8 shadow-2xl border-4 border-amber-200/60 flex flex-col items-center gap-5 max-w-sm"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          >
            {/* shapes parade */}
            <div className="flex gap-2">
              {SHAPES.slice(0, 6).map((s, i) => (
                <div key={s.name} style={{ animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
                  <ShapeSVG shape={s} color={COLORS[i]} size={40} />
                </div>
              ))}
            </div>
            {/* stars */}
            <div className="flex gap-2">
              {[0,1,2].map(i => (
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
            {/* score */}
            <div className="flex items-center gap-2" style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both' }}>
              <svg width={28} height={28} viewBox="0 0 22 22">
                <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8" fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
              </svg>
              <span className="text-3xl font-heading text-amber-800">{score}</span>
            </div>
            <button
              onClick={resetGame}
              className="bg-amber-400 text-white font-heading text-xl px-10 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2 border-2 border-amber-500/30"
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
