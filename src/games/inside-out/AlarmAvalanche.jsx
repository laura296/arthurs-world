import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { Anxiety, MemoryOrb, AlarmBubble } from './Characters';
import { EMOTION_COLORS, recordWin } from './insideOutData';
import { playAlarmChime, playPhaseTransition } from './insideOutSounds';
import {
  useScreenShake, useCombo, useDialogue, useNumberPop,
  usePowerUps, useIntroCountdown, GameJuiceStyles,
} from './useGameJuice';

const ALARM_TYPES = [
  { emotion: 'joy', color: EMOTION_COLORS.joy },
  { emotion: 'sadness', color: EMOTION_COLORS.sadness },
  { emotion: 'anger', color: EMOTION_COLORS.anger },
  { emotion: 'fear', color: EMOTION_COLORS.fear },
  { emotion: 'disgust', color: EMOTION_COLORS.disgust },
];

const MAX_CAPACITY = 12;
const GAME_DURATION = 35;
let nextAlarmId = 0;

function makeAlarm(w, h) {
  const type = ALARM_TYPES[Math.floor(Math.random() * ALARM_TYPES.length)];
  return {
    id: nextAlarmId++,
    ...type,
    x: 40 + Math.random() * (w - 80),
    y: h + 20,
    targetY: 90 + Math.random() * (h - 220),
    size: 52 + Math.random() * 18,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    displayX: 0,
    vx: 0,
    vy: 0,
  };
}

// ─── Dome Background ─────────────────────────────────────
function DomeBackground({ intensity }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Hexagonal glass ceiling hint */}
      <svg className="absolute top-0 left-0 right-0 h-[40%] opacity-10" viewBox="0 0 400 200" preserveAspectRatio="xMidYMin slice">
        <defs>
          <linearGradient id="dome-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" /><stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Dome arch */}
        <path d="M0,200 Q200,-40 400,200" fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.3" />
        <path d="M20,200 Q200,-20 380,200" fill="none" stroke="#0d9488" strokeWidth="0.5" opacity="0.2" />
        {/* Hexagon panels */}
        {[
          [100,60],[150,40],[200,30],[250,40],[300,60],
          [75,100],[125,80],[175,65],[225,65],[275,80],[325,100],
          [100,140],[175,110],[225,110],[300,140],
        ].map(([cx, cy], i) => (
          <polygon key={i}
            points={Array.from({length:6}).map((_,j) => {
              const a = Math.PI/3 * j - Math.PI/6;
              return `${cx + 22*Math.cos(a)},${cy + 22*Math.sin(a)}`;
            }).join(' ')}
            fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.15" />
        ))}
      </svg>

      {/* Teal ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-60"
           style={{
             background: 'radial-gradient(ellipse, #14b8a608, transparent 70%)',
             animation: 'ioGlowPulse 4s ease-in-out infinite',
           }} />

      {/* Side panels — control screens */}
      <svg className="absolute bottom-0 left-0 w-[15%] h-[60%] opacity-15" viewBox="0 0 60 300">
        {[50,100,150,200,250].map((y,i) => (
          <g key={i}>
            <rect x="10" y={y} width="40" height="25" rx="3" fill="#0d9488" opacity="0.3" />
            <line x1="15" y1={y+8} x2="45" y2={y+8} stroke="#14b8a6" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="x2" values="25;45;35;45" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
            </line>
          </g>
        ))}
      </svg>
      <svg className="absolute bottom-0 right-0 w-[15%] h-[60%] opacity-15" viewBox="0 0 60 300" style={{transform:'scaleX(-1)'}}>
        {[50,100,150,200,250].map((y,i) => (
          <g key={i}>
            <rect x="10" y={y} width="40" height="25" rx="3" fill="#0d9488" opacity="0.3" />
            <line x1="15" y1={y+12} x2="45" y2={y+12} stroke="#14b8a6" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="x2" values="30;45;25;45" dur={`${2.5+i*0.2}s`} repeatCount="indefinite" />
            </line>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AlarmAvalanche() {
  const navigate = useNavigate();
  const { burst, ParticleLayer } = useParticleBurst();
  const { shake, ShakeWrapper } = useScreenShake();
  const { combo, addCombo, resetCombo, ComboDisplay } = useCombo();
  const { say, DialogueBubble } = useDialogue();
  const { pop, NumberLayer } = useNumberPop();
  const { activePower, spawnPower, collectPower, PowerUpDisplay } = usePowerUps();
  const { startCountdown, CountdownOverlay, isCountingDown } = useIntroCountdown();

  const [phase, setPhase] = useState('intro');
  const [alarms, setAlarms] = useState([]);
  const [score, setScore] = useState(0);
  const [popped, setPopped] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [dims, setDims] = useState({ w: 400, h: 600 });
  const [chainBonus, setChainBonus] = useState(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const lastPopTimeRef = useRef(0);
  const popChainRef = useRef(0);
  const powerTimerRef = useRef(null);
  const dialogueTimerRef = useRef(null);

  // Start intro
  useEffect(() => {
    startCountdown(() => setPhase('playing'), "They keep coming! Pop them!");
  }, []);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Spawn alarms
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setAlarms(prev => {
        if (prev.length >= MAX_CAPACITY) { setPhase('fail'); playBuzz(); return prev; }
        playAlarmChime();
        return [...prev, makeAlarm(dims.w, dims.h)];
      });
    }, 1200 - Math.min(500, popped * 15));
    return () => clearInterval(interval);
  }, [phase, dims, popped]);

  // Animate bubbles with simple physics
  useEffect(() => {
    if (phase !== 'playing') return;
    let active = true;
    const tick = () => {
      if (!active) return;
      setAlarms(prev => {
        const next = prev.map(a => {
          const dy = (a.targetY - a.y) * 0.05;
          // Gravity pull toward bottom
          const gravity = 0.02;
          const wobbleX = Math.sin(Date.now() * a.wobbleSpeed + a.wobblePhase) * 14;
          return {
            ...a,
            y: a.y + dy + gravity,
            displayX: a.x + wobbleX + (a.vx || 0),
            vx: (a.vx || 0) * 0.95,
          };
        });
        setCapacity(next.length);
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { active = false; if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setPhase('success'); playSuccess(); playPhaseTransition(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Power-up spawns
  useEffect(() => {
    if (phase !== 'playing') return;
    powerTimerRef.current = setInterval(() => spawnPower(), 18000);
    return () => clearInterval(powerTimerRef.current);
  }, [phase, spawnPower]);

  // Anxiety dialogue
  useEffect(() => {
    if (phase !== 'playing') return;
    dialogueTimerRef.current = setTimeout(() => {
      if (capacity > 8) say('anxiety', 'warn');
      else if (popped > 15) say('anxiety', 'encourage');
    }, 8000);
    return () => clearTimeout(dialogueTimerRef.current);
  }, [phase, capacity, popped, say]);

  // Screen shake at high capacity
  useEffect(() => {
    if (phase === 'playing' && capacity >= MAX_CAPACITY - 3) {
      shake('medium');
    }
  }, [capacity, phase, shake]);

  // Power-up: Calm Wave — pop all of one random color
  useEffect(() => {
    if (!activePower) return;
    if (activePower.id === 'multi-fix') {
      const randomType = ALARM_TYPES[Math.floor(Math.random() * ALARM_TYPES.length)];
      setAlarms(prev => {
        const toPop = prev.filter(a => a.emotion === randomType.emotion);
        toPop.forEach(a => {
          burst({ x: a.displayX || a.x, y: a.y, colors: [a.color, '#fff'] });
        });
        setScore(s => s + toPop.length * 15);
        setPopped(p => p + toPop.length);
        return prev.filter(a => a.emotion !== randomType.emotion);
      });
    }
    if (activePower.id === 'time-freeze') {
      // Handled by pausing spawn/timer via activePower check
    }
  }, [activePower, burst]);

  const handlePop = useCallback((alarm, e) => {
    if (phase !== 'playing') return;
    playPop();

    const now = Date.now();
    if (now - lastPopTimeRef.current < 1000) {
      popChainRef.current++;
    } else {
      popChainRef.current = 1;
    }
    lastPopTimeRef.current = now;

    // Chain bonus
    if (popChainRef.current >= 3) {
      const bonus = popChainRef.current * 5;
      setChainBonus({ count: popChainRef.current, key: now });
      setScore(s => s + bonus);
      setTimeout(() => setChainBonus(null), 1200);
    }

    addCombo();
    const points = 10 + combo * 3;
    setPopped(p => p + 1);
    setScore(s => s + points);

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    burst({ x: cx, y: cy, colors: [alarm.color, '#fff', alarm.color + '88'] });
    pop(cx, cy, points, alarm.color);

    // Push nearby bubbles away
    setAlarms(prev => prev
      .filter(a => a.id !== alarm.id)
      .map(a => {
        const dx = (a.displayX || a.x) - alarm.x;
        const dy = a.y - alarm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          return { ...a, vx: (a.vx || 0) + (dx / dist) * 3 };
        }
        return a;
      })
    );
  }, [phase, burst, pop, combo, addCombo]);

  const handleWinDone = () => {
    const stars = score >= 250 ? 3 : score >= 150 ? 2 : 1;
    recordWin('anxiety-dome', stars);
    navigate(-1);
  };

  const capacityPct = (capacity / MAX_CAPACITY) * 100;
  const anxietyMood = capacity > 8 ? 'panic' : 'nervous';

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none"
         style={{ background: 'linear-gradient(180deg, #0d3d3d, #0a2a2a, #0a0720)' }}>
      <style>{`
        @keyframes alarm-float-in {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes chain-bonus-pop {
          0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -20px) scale(1.3); opacity: 1; }
          100% { transform: translate(-50%, -40px) scale(1); opacity: 0; }
        }
      `}</style>
      <GameJuiceStyles />

      <DomeBackground intensity={capacityPct} />

      {/* Warning border at high capacity */}
      {capacity >= MAX_CAPACITY - 3 && phase === 'playing' && (
        <div className="absolute inset-0 pointer-events-none z-30 rounded-lg"
             style={{
               border: '3px solid #ef444455',
               boxShadow: 'inset 0 0 40px #ef444415',
               animation: 'ioGlowPulse 0.5s ease-in-out infinite',
             }} />
      )}

      <BackButton />
      <ParticleLayer />
      <ComboDisplay />
      <DialogueBubble />
      <NumberLayer />
      <PowerUpDisplay />
      <CountdownOverlay />

      {/* Chain bonus display */}
      {chainBonus && (
        <div key={chainBonus.key}
             className="fixed top-36 left-1/2 z-50 pointer-events-none"
             style={{ animation: 'chain-bonus-pop 1.2s ease-out forwards' }}>
          <span className="text-xl font-heading text-cyan-300 drop-shadow-lg">
            Chain x{chainBonus.count}!
          </span>
        </div>
      )}

      <ShakeWrapper className="relative w-full h-full">
        {/* HUD */}
        <div className="relative z-20 p-4 pt-14">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Anxiety size={44} expression={anxietyMood} sparks={capacity > 6} animate={capacity > 8} />
              <div>
                <h2 className="text-white font-heading text-base leading-tight">Alarm Avalanche</h2>
                <p className="text-white/25 text-[10px]">Pop before they pile up!</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/50 text-sm font-mono">{timeLeft}s</span>
            </div>
          </div>

          {/* Capacity gauge */}
          <div className="rounded-lg p-2 mb-2" style={{ background: '#0a071a99', border: '1px solid #ffffff0a' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] text-white/25 uppercase tracking-widest">Alarm Level</span>
              <span className="text-[10px] font-mono ml-auto"
                    style={{ color: capacityPct > 75 ? '#ef4444' : capacityPct > 50 ? '#f97316' : '#14b8a6' }}>
                {capacity}/{MAX_CAPACITY}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300 relative"
                   style={{
                     width: `${capacityPct}%`,
                     background: `linear-gradient(to right, #14b8a6, ${capacityPct > 75 ? '#ef4444' : capacityPct > 50 ? '#f97316' : '#14b8a6'})`,
                   }}>
                <div className="absolute inset-0 rounded-full"
                     style={{
                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                       backgroundSize: '200% 100%',
                       animation: 'goldShimmer 1.5s ease-in-out infinite',
                     }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/35 mb-2">
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {score}
            </span>
            <span>{popped} popped</span>
            {combo >= 2 && <span className="text-cyan-400">x{combo} combo</span>}
          </div>
        </div>

        {/* Alarm bubbles */}
        {phase === 'playing' && alarms.map(alarm => (
          <div key={alarm.id}
               className="absolute z-10"
               style={{
                 left: (alarm.displayX || alarm.x) - alarm.size / 2,
                 top: alarm.y - alarm.size / 2,
                 animation: 'alarm-float-in 0.4s ease-out',
               }}>
            <AlarmBubble emotion={alarm.emotion} color={alarm.color} size={alarm.size}
                         onPop={(e) => handlePop(alarm, e)} />
          </div>
        ))}
      </ShakeWrapper>

      {/* Success */}
      {phase === 'success' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 animate-spring-in"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
          <Anxiety size={90} expression="nervous" sparks={false} />
          <h2 className="text-2xl font-heading text-white">Alarms Sorted!</h2>
          <p className="text-white/40 text-sm">Anxiety's dome is calm again!</p>
          <div className="flex gap-2 mt-1">
            {[1, 2, 3].map((s, i) => (
              <svg key={s} viewBox="0 0 24 24" width="30" height="30"
                   fill={score >= s * 80 ? '#facc15' : '#ffffff12'}
                   className="animate-spring-in"
                   style={{ animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: 'backwards' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-white/25 text-xs">Score: {score} | Popped: {popped}</p>
          <div className="animate-spring-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
            <MemoryOrb color={EMOTION_COLORS.anxiety} size={55} pulse />
          </div>
          <button onClick={handleWinDone}
            className="mt-1 px-8 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-indigo-900 font-heading active:scale-95 transition-transform shadow-lg shadow-teal-500/20">
            Collect Memory Orb!
          </button>
        </div>
      )}

      {/* Fail */}
      {phase === 'fail' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 animate-spring-in"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
          <Anxiety size={80} expression="panic" sparks animate />
          <h2 className="text-xl font-heading text-red-400">Overwhelmed!</h2>
          <p className="text-white/40 text-sm text-center">Too many alarms!<br/>Score: {score}</p>
          <div className="flex gap-3 mt-2">
            <button onClick={() => {
                setPhase('intro'); setAlarms([]); setScore(0);
                setPopped(0); setCapacity(0); setTimeLeft(GAME_DURATION); nextAlarmId = 0;
                resetCombo();
                startCountdown(() => setPhase('playing'), "Let's try again!");
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-indigo-900 font-heading active:scale-95 transition-transform">
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
  );
}
