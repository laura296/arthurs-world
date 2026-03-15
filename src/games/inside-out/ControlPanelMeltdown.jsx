import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { Joy, MemoryOrb } from './Characters';
import { EMOTION_COLORS, recordWin } from './insideOutData';
import { playConsoleBeep, playPhaseTransition, playComboHit, playCountdownTick } from './insideOutSounds';
import {
  useScreenShake,
  useCombo,
  useDialogue,
  useNumberPop,
  usePowerUps,
  useIntroCountdown,
  GameJuiceStyles,
} from './useGameJuice';

const EMOTIONS = [
  { name: 'joy', color: EMOTION_COLORS.joy, icon: '☀' },
  { name: 'sadness', color: EMOTION_COLORS.sadness, icon: '💧' },
  { name: 'anger', color: EMOTION_COLORS.anger, icon: '🔶' },
  { name: 'fear', color: EMOTION_COLORS.fear, icon: '⬧' },
  { name: 'disgust', color: EMOTION_COLORS.disgust, icon: '✦' },
];

function makeButton(id) {
  const target = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  let current = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  while (current.name === target.name) {
    current = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  }
  return { id, targetIdx: EMOTIONS.indexOf(target), currentIdx: EMOTIONS.indexOf(current), fixed: false };
}

function makeGrid(count) {
  return Array.from({ length: count }, (_, i) => makeButton(i));
}

// ── Grid geometry helpers for wire connections ──
function getGridPositions(count, cols = 3) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({ row: Math.floor(i / cols), col: i % cols });
  }
  return positions;
}

function getAdjacentPairs(count, cols = 3) {
  const positions = getGridPositions(count, cols);
  const pairs = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const a = positions[i];
      const b = positions[j];
      const dr = Math.abs(a.row - b.row);
      const dc = Math.abs(a.col - b.col);
      if ((dr === 0 && dc === 1) || (dr === 1 && dc === 0)) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}

// ── SVG Console Button with LED light ──
function GameButton({ btn, onTap, size = 72 }) {
  const current = EMOTIONS[btn.currentIdx];
  const target = EMOTIONS[btn.targetIdx];

  return (
    <button
      onPointerDown={onTap}
      disabled={btn.fixed}
      className={`relative transition-all duration-200 ${btn.fixed ? 'scale-90 opacity-50' : 'active:scale-90'}`}
    >
      <svg viewBox="0 0 100 110" width={size} height={size * 1.1}>
        <defs>
          <linearGradient id={`gbtn-${btn.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={btn.fixed ? '#22c55e' : current.color} />
            <stop offset="100%" stopColor={btn.fixed ? '#16a34a' : `${current.color}88`} />
          </linearGradient>
          <filter id="btnDrop"><feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="black" floodOpacity="0.4" /></filter>
        </defs>
        {/* Button housing */}
        <rect x="8" y="15" width="84" height="85" rx="16" fill="#1e1b4b" />
        {/* Button face */}
        <rect x="8" y="10" width="84" height="82" rx="16" fill={`url(#gbtn-${btn.id})`} filter="url(#btnDrop)" />
        {/* Center icon */}
        <text x="50" y="48" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold">
          {btn.fixed ? '✓' : current.icon}
        </text>
        {/* Target indicator */}
        {!btn.fixed && (
          <g>
            <rect x="28" y="60" width="44" height="20" rx="10" fill="#00000044" />
            <circle cx="40" cy="70" r="6" fill={target.color} />
            <text x="58" y="74" textAnchor="middle" fontSize="9" fill="white" opacity="0.7">goal</text>
          </g>
        )}
        {/* Fixed checkmark glow */}
        {btn.fixed && (
          <circle cx="50" cy="42" r="25" fill="#22c55e" opacity="0.15">
            <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </button>
  );
}

// ── Semicircle Arc Gauge ──
function ArcGauge({ value, size = 160 }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const cx = size / 2;
  const cy = size * 0.7;
  const r = size * 0.38;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweep = startAngle - (startAngle - endAngle) * (clampedValue / 100);

  const bgX1 = cx + r * Math.cos(startAngle);
  const bgY1 = cy + r * Math.sin(startAngle);
  const bgX2 = cx + r * Math.cos(endAngle);
  const bgY2 = cy + r * Math.sin(endAngle);

  const valX = cx + r * Math.cos(sweep);
  const valY = cy + r * Math.sin(sweep);

  const strokeW = size * 0.08;
  const gaugeColor = clampedValue > 75 ? '#ef4444' : clampedValue > 40 ? '#f59e0b' : '#22c55e';

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${size} ${size * 0.65}`} width={size} height={size * 0.65}>
      <defs>
        <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="arc-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background arc */}
      <path
        d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`}
        fill="none" stroke="#ffffff10" strokeWidth={strokeW} strokeLinecap="round"
      />

      {/* Value arc */}
      {clampedValue > 0 && (
        <path
          d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 ${clampedValue > 50 ? 1 : 0} 1 ${valX} ${valY}`}
          fill="none" stroke={gaugeColor} strokeWidth={strokeW} strokeLinecap="round"
          filter={clampedValue > 60 ? 'url(#arc-glow)' : undefined}
          style={{ transition: 'all 0.2s ease-out' }}
        />
      )}

      {/* Tick marks */}
      {ticks.map(t => {
        const angle = startAngle - (startAngle - endAngle) * (t / 100);
        const innerR = r - strokeW * 0.8;
        const outerR = r + strokeW * 0.8;
        return (
          <line key={t}
            x1={cx + innerR * Math.cos(angle)} y1={cy + innerR * Math.sin(angle)}
            x2={cx + outerR * Math.cos(angle)} y2={cy + outerR * Math.sin(angle)}
            stroke="#ffffff30" strokeWidth="1.5"
          />
        );
      })}

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={valX} y2={valY}
        stroke="white" strokeWidth="2" strokeLinecap="round"
        style={{ transition: 'all 0.2s ease-out', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}
      />
      <circle cx={cx} cy={cy} r="4" fill="#1e1b4b" stroke="white" strokeWidth="1.5" />

      {/* Center label */}
      <text x={cx} y={cy + size * 0.14} textAnchor="middle" fontSize={size * 0.09} fill={gaugeColor}
            fontFamily="monospace" fontWeight="bold">
        {Math.round(clampedValue)}%
      </text>
      <text x={cx} y={cy + size * 0.22} textAnchor="middle" fontSize={size * 0.055} fill="#ffffff30"
            style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        System Load
      </text>

      {/* Warning indicators */}
      {clampedValue > 40 && (
        <circle cx={cx - size * 0.25} cy={cy + size * 0.12} r="3" fill="#f59e0b" />
      )}
      {clampedValue > 70 && (
        <circle cx={cx + size * 0.25} cy={cy + size * 0.12} r="3" fill="#ef4444">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

// ── Wire connections between grid buttons ──
function WireConnections({ buttons, cols = 3 }) {
  const pairs = getAdjacentPairs(buttons.length, cols);
  const cellW = 86;
  const cellH = 82;
  const rows = Math.ceil(buttons.length / cols);
  const w = cols * cellW;
  const h = rows * cellH;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}
         preserveAspectRatio="xMidYMid meet" style={{ opacity: 0.6 }}>
      <defs>
        <filter id="wire-glow-filter">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {pairs.map(([a, b], idx) => {
        const ax = (a % cols) * cellW + cellW / 2;
        const ay = Math.floor(a / cols) * cellH + cellH / 2;
        const bx = (b % cols) * cellW + cellW / 2;
        const by = Math.floor(b / cols) * cellH + cellH / 2;
        const bothFixed = buttons[a].fixed && buttons[b].fixed;
        const eitherFixed = buttons[a].fixed || buttons[b].fixed;
        const wireColor = bothFixed ? '#22c55e' : eitherFixed ? '#facc1588' : '#ffffff20';
        return (
          <line key={idx}
            x1={ax} y1={ay} x2={bx} y2={by}
            stroke={wireColor} strokeWidth="1.5" strokeLinecap="round"
            filter={bothFixed ? 'url(#wire-glow-filter)' : undefined}
            style={{ animation: bothFixed ? 'none' : `wire-pulse ${2 + idx * 0.3}s ease-in-out infinite` }}
          />
        );
      })}
    </svg>
  );
}

// ── Round Transition Overlay ──
function RoundTransition({ round, onDone }) {
  useEffect(() => {
    playPhaseTransition();
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-none">
      <div style={{ animation: 'roundBannerIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
        <h2 className="text-4xl font-heading text-white text-center drop-shadow-lg">
          Round {round}!
        </h2>
        <p className="text-white/50 text-sm text-center mt-1">
          {round === 2 ? '8 buttons — faster creep!' : '10 buttons — final push!'}
        </p>
      </div>
    </div>
  );
}

// ── Dialogue Milestone Triggers ──
const MILESTONES = {
  firstFix: false,
  fiveFixes: false,
  halfOverload: false,
  highOverload: false,
  round2: false,
  round3: false,
};

export default function ControlPanelMeltdown() {
  const navigate = useNavigate();
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { shake, ShakeWrapper } = useScreenShake();
  const { combo: juiceCombo, addCombo, resetCombo, ComboDisplay } = useCombo();
  const { say, DialogueBubble } = useDialogue();
  const { pop, NumberLayer } = useNumberPop();
  const { activePower, spawnPower, collectPower, PowerUpDisplay } = usePowerUps();
  const { startCountdown, CountdownOverlay, isCountingDown } = useIntroCountdown();

  const [phase, setPhase] = useState('intro');
  const [subPhase, setSubPhase] = useState(null); // 'round-transition'
  const [buttons, setButtons] = useState(() => makeGrid(6));
  const [overload, setOverload] = useState(0);
  const [score, setScore] = useState(0);
  const [localCombo, setLocalCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);
  const [joyMood, setJoyMood] = useState('happy');
  const [totalFixes, setTotalFixes] = useState(0);
  const [failFlash, setFailFlash] = useState(false);
  const [winStarsRevealed, setWinStarsRevealed] = useState(0);
  const [orbDropped, setOrbDropped] = useState(false);
  const containerRef = useRef(null);
  const milestonesRef = useRef({ ...MILESTONES });
  const powerTimerRef = useRef(null);
  const overloadShakeRef = useRef(null);

  // ── Intro sequence ──
  useEffect(() => {
    if (phase !== 'intro') return;
    startCountdown(() => {
      setPhase('playing');
      playConsoleBeep();
    }, "Joy needs your help! Fix the Control Panel!");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'playing' || subPhase === 'round-transition') return;
    if (activePower?.id === 'time-freeze') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('fail');
          playBuzz();
          setFailFlash(true);
          return 0;
        }
        if (prev === 10) playCountdownTick();
        if (prev <= 5) playCountdownTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, subPhase, activePower]);

  // ── Overload creep ──
  useEffect(() => {
    if (phase !== 'playing' || subPhase === 'round-transition') return;
    if (activePower?.id === 'shield') return;
    const t = setInterval(() => {
      setOverload((prev) => {
        const next = prev + 0.4 + round * 0.15;
        if (next >= 100) {
          setPhase('fail');
          playBuzz();
          setFailFlash(true);
          return 100;
        }
        setJoyMood(next > 60 ? 'worried' : 'happy');
        return next;
      });
    }, 200);
    return () => clearInterval(t);
  }, [phase, round, subPhase, activePower]);

  // ── Screen shake when overload > 75% ──
  useEffect(() => {
    if (phase !== 'playing') return;
    if (overload > 75) {
      if (!overloadShakeRef.current) {
        overloadShakeRef.current = setInterval(() => {
          shake(overload > 90 ? 'heavy' : 'medium');
        }, 400);
      }
    } else {
      if (overloadShakeRef.current) {
        clearInterval(overloadShakeRef.current);
        overloadShakeRef.current = null;
      }
    }
    return () => {
      if (overloadShakeRef.current) {
        clearInterval(overloadShakeRef.current);
        overloadShakeRef.current = null;
      }
    };
  }, [phase, overload > 75, overload > 90, shake]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Power-up spawn every ~15 seconds ──
  useEffect(() => {
    if (phase !== 'playing') return;
    powerTimerRef.current = setInterval(() => {
      spawnPower();
    }, 15000);
    // First power-up after 12 seconds
    const firstSpawn = setTimeout(() => spawnPower(), 12000);
    return () => {
      clearInterval(powerTimerRef.current);
      clearTimeout(firstSpawn);
    };
  }, [phase, spawnPower]);

  // ── Dialogue milestones ──
  useEffect(() => {
    const m = milestonesRef.current;
    if (!m.halfOverload && overload > 50 && phase === 'playing') {
      m.halfOverload = true;
      say('joy', 'warn');
    }
    if (!m.highOverload && overload > 80 && phase === 'playing') {
      m.highOverload = true;
      say('anxiety', 'warn');
    }
  }, [overload, phase, say]);

  // ── Win celebration: stagger stars + orb ──
  useEffect(() => {
    if (phase !== 'success') return;
    const stars = score >= 200 ? 3 : score >= 100 ? 2 : 1;
    for (let i = 1; i <= stars; i++) {
      setTimeout(() => {
        setWinStarsRevealed(i);
        playPop();
      }, 600 + i * 400);
    }
    setTimeout(() => {
      setOrbDropped(true);
      playBoing();
    }, 600 + stars * 400 + 600);
    say('joy', 'celebrate');
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fail flash timeout ──
  useEffect(() => {
    if (!failFlash) return;
    const t = setTimeout(() => setFailFlash(false), 600);
    return () => clearTimeout(t);
  }, [failFlash]);

  const handleTap = useCallback((idx) => {
    if (phase !== 'playing' || subPhase === 'round-transition') return;
    playPop();
    playConsoleBeep();

    setButtons((prev) => {
      const next = [...prev];
      const btn = { ...next[idx] };
      if (btn.fixed) return prev;

      // Multi-fix power-up: skip directly to target
      if (activePower?.id === 'multi-fix') {
        btn.currentIdx = btn.targetIdx;
      } else {
        btn.currentIdx = (btn.currentIdx + 1) % EMOTIONS.length;
      }

      if (btn.currentIdx === btn.targetIdx) {
        btn.fixed = true;
        playBoing();
        const el = containerRef.current?.querySelector(`[data-btn="${idx}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          burst({ x: cx, y: cy, colors: [EMOTIONS[btn.targetIdx].color, '#fff'] });

          // Number pop
          const pts = 10 + localCombo * 5;
          pop(cx - 10, cy - 30, pts, EMOTIONS[btn.targetIdx].color);
        }

        addCombo();
        setLocalCombo((c) => c + 1);
        setScore((s) => s + 10 + localCombo * 5);
        setOverload((o) => Math.max(0, o - 15));

        // Milestone dialogues
        setTotalFixes(f => {
          const nf = f + 1;
          const m = milestonesRef.current;
          if (!m.firstFix && nf === 1) { m.firstFix = true; say('joy', 'encourage'); }
          if (!m.fiveFixes && nf === 5) { m.fiveFixes = true; say('joy', 'encourage'); }
          return nf;
        });
      }

      next[idx] = btn;

      if (next.every((b) => b.fixed)) {
        if (round >= 3) {
          setTimeout(() => {
            setPhase('success');
            playSuccess();
            peek('excited');
          }, 300);
        } else {
          // Round transition
          setTimeout(() => {
            const nextRound = round + 1;
            setSubPhase('round-transition');
            setRound(nextRound);
            peek('happy');

            // Milestone dialogue for round transition
            const m = milestonesRef.current;
            if (!m.round2 && nextRound === 2) { m.round2 = true; say('joy', 'encourage'); }
            if (!m.round3 && nextRound === 3) { m.round3 = true; say('anger', 'encourage'); }
          }, 400);
        }
      }
      return next;
    });
  }, [phase, subPhase, localCombo, round, burst, addCombo, pop, say, activePower, peek]);

  const handleRoundTransitionDone = useCallback(() => {
    setButtons(makeGrid(4 + round * 2));
    setOverload((o) => Math.max(0, o - 20));
    setSubPhase(null);
    resetCombo();
    setLocalCombo(0);
  }, [round, resetCombo]);

  const handleWinDone = () => {
    const stars = score >= 200 ? 3 : score >= 100 ? 2 : 1;
    recordWin('control-room', stars);
    navigate(-1);
  };

  const handleRestart = () => {
    setPhase('intro');
    setSubPhase(null);
    setButtons(makeGrid(6));
    setOverload(0);
    setScore(0);
    setLocalCombo(0);
    setTimeLeft(30);
    setRound(1);
    setTotalFixes(0);
    setJoyMood('happy');
    setFailFlash(false);
    setWinStarsRevealed(0);
    setOrbDropped(false);
    milestonesRef.current = { ...MILESTONES };
    resetCombo();
    setTimeout(() => {
      startCountdown(() => {
        setPhase('playing');
        playConsoleBeep();
      }, "Let's try again!");
    }, 100);
  };

  const cols = 3;
  const isPlaying = phase === 'playing';
  const starCount = score >= 200 ? 3 : score >= 100 ? 2 : 1;

  return (
    <ShakeWrapper className="relative w-full h-full overflow-hidden select-none"
         style={{ background: 'linear-gradient(180deg, #1e1b4b, #0f0a2a)' }}>
      <div ref={containerRef} className="w-full h-full">
        <GameJuiceStyles />
        <style>{`
          @keyframes overload-flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.12; } }
          @keyframes console-hum { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
          @keyframes wire-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          @keyframes roundBannerIn {
            0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
            50% { transform: scale(1.15) rotate(2deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes failFlashAnim {
            0% { opacity: 0.7; }
            100% { opacity: 0; }
          }
          @keyframes starReveal {
            0% { transform: scale(0) rotate(-45deg); opacity: 0; }
            60% { transform: scale(1.4) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes orbDrop {
            0% { transform: translateY(-80px) scale(0.5); opacity: 0; }
            60% { transform: translateY(10px) scale(1.1); opacity: 1; }
            80% { transform: translateY(-5px) scale(0.95); }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes failPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes introJoySlide {
            0% { transform: translateX(-100px); opacity: 0; }
            60% { transform: translateX(10px); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes timerUrgent {
            0%, 100% { color: #ef4444; }
            50% { color: #ffffff; }
          }
        `}</style>

        {/* Overload flash overlay */}
        {overload > 65 && isPlaying && (
          <div className="absolute inset-0 bg-red-500 pointer-events-none z-30"
               style={{ animation: `overload-flash ${overload > 85 ? '0.25s' : '0.7s'} ease-in-out infinite` }} />
        )}

        {/* Fail red flash */}
        {failFlash && (
          <div className="absolute inset-0 bg-red-600 pointer-events-none z-40"
               style={{ animation: 'failFlashAnim 0.6s ease-out forwards' }} />
        )}

        {/* Console wire decorations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#facc15" strokeWidth="0.5"
                style={{ animation: 'wire-pulse 3s ease-in-out infinite' }} />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#3b82f6" strokeWidth="0.5"
                style={{ animation: 'wire-pulse 3s ease-in-out infinite', animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#22c55e" strokeWidth="0.3"
                style={{ animation: 'wire-pulse 4s ease-in-out infinite', animationDelay: '0.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#7c3aed" strokeWidth="0.3"
                style={{ animation: 'wire-pulse 4s ease-in-out infinite', animationDelay: '1.5s' }} />
        </svg>

        <BackButton />
        <ParticleLayer />
        <ArthurPeekLayer />
        <NumberLayer />
        <ComboDisplay />
        <DialogueBubble />
        <PowerUpDisplay />
        <CountdownOverlay />

        <div className="relative z-10 p-4 pt-14">
          {/* Header with Joy */}
          {(isPlaying || subPhase === 'round-transition') && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div style={phase === 'intro' ? { animation: 'introJoySlide 0.6s ease-out' } : undefined}>
                    <Joy size={36} expression={joyMood} glow={overload < 40} />
                  </div>
                  <div>
                    <h2 className="text-white font-heading text-base leading-tight">Control Panel</h2>
                    <p className="text-white/30 text-[10px]">Round {round}/3</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-mono ${timeLeft <= 5 ? 'text-lg font-bold' : 'text-white/50'}`}
                        style={timeLeft <= 5 ? { animation: 'timerUrgent 0.5s ease-in-out infinite' } : undefined}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Arc Gauge */}
              <div className="flex justify-center mb-1">
                <ArcGauge value={overload} size={180} />
              </div>

              {/* Score bar */}
              <div className="flex items-center justify-center gap-4 mb-3 text-xs">
                <span className="text-white/40 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="#facc15">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {score}
                </span>
                <span className="text-white/40 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="#f97316">
                    <path d="M12 23c-3.5 0-8-2.6-8-8.3C4 9.1 10 2 12 0c2 2 8 9.1 8 14.7 0 5.7-4.5 8.3-8 8.3z" />
                  </svg>
                  x{localCombo}
                </span>
                {activePower && (
                  <span className="text-white/60 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background: `${activePower.color}33`, border: `1px solid ${activePower.color}66` }}>
                    {activePower.icon} {activePower.name}
                  </span>
                )}
              </div>

              {/* Button grid with wire connections */}
              {subPhase !== 'round-transition' && (
                <div className="relative max-w-[260px] mx-auto">
                  <WireConnections buttons={buttons} cols={cols} />
                  <div className="grid grid-cols-3 gap-2 relative z-10"
                       style={{ animation: 'console-hum 3s ease-in-out infinite' }}>
                    {buttons.map((btn, i) => (
                      <div key={`${round}-${btn.id}`} data-btn={i}
                           style={{ animation: `numberFloat 0.3s ease-out reverse`, animationFillMode: 'backwards', animationDelay: `${i * 0.05}s` }}>
                        <GameButton btn={btn} onTap={() => handleTap(i)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Round transition overlay */}
              {subPhase === 'round-transition' && (
                <RoundTransition round={round} onDone={handleRoundTransitionDone} />
              )}
            </>
          )}

          {/* Success screen */}
          {phase === 'success' && (
            <div className="flex flex-col items-center justify-center gap-4 mt-8 animate-spring-in">
              <Joy size={100} expression="happy" glow animate />
              <h2 className="text-2xl font-heading text-white">Console Fixed!</h2>
              <p className="text-white/50 text-sm">Joy is back in control!</p>

              {/* Stars animate in one by one */}
              <div className="flex gap-2 mt-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} style={s <= winStarsRevealed ? {
                    animation: 'starReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                  } : { opacity: 0 }}>
                    <svg viewBox="0 0 24 24" width="32" height="32"
                         fill={s <= starCount ? '#facc15' : '#ffffff15'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ))}
              </div>

              <p className="text-white/30 text-xs">Score: {score}</p>

              {/* Memory orb floats down */}
              <div className="mt-1" style={orbDropped ? {
                animation: 'orbDrop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              } : { opacity: 0 }}>
                <MemoryOrb color={EMOTION_COLORS.joy} size={50} pulse />
              </div>

              <button onClick={handleWinDone}
                className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-900 font-heading text-base active:scale-95 transition-transform"
                style={orbDropped ? { animation: 'starReveal 0.4s ease-out forwards' } : { opacity: 0, pointerEvents: 'none' }}>
                Collect Memory Orb!
              </button>
            </div>
          )}

          {/* Fail screen */}
          {phase === 'fail' && (
            <div className="flex flex-col items-center justify-center gap-4 mt-8 animate-spring-in">
              <div style={{ animation: 'failPulse 1s ease-in-out infinite' }}>
                <Joy size={80} expression="worried" glow={false} />
              </div>
              <h2 className="text-xl font-heading text-red-400"
                  style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                System Overload!
              </h2>
              <p className="text-white/50 text-sm text-center">
                The console melted down...<br />
                {score > 0 ? `You scored ${score} points!` : 'Try again!'}
              </p>

              {/* Show what was achieved */}
              {totalFixes > 0 && (
                <p className="text-white/30 text-xs">
                  Fixed {totalFixes} button{totalFixes !== 1 ? 's' : ''} across {round} round{round !== 1 ? 's' : ''}
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={handleRestart}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-900 font-heading active:scale-95 transition-transform">
                  Try Again
                </button>
                <button onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-full bg-white/10 text-white font-heading active:scale-95 transition-transform">
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ShakeWrapper>
  );
}
