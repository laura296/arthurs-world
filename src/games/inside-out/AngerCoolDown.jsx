import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { Anger, MemoryOrb, Pipe } from './Characters';
import { EMOTION_COLORS, recordWin } from './insideOutData';
import { playSteamHiss, playPhaseTransition, playComboHit } from './insideOutSounds';
import {
  useScreenShake,
  useCombo,
  useDialogue,
  useNumberPop,
  usePowerUps,
  useIntroCountdown,
  GameJuiceStyles,
} from './useGameJuice';

const PIPE_COUNT = 5;
const GAME_DURATION = 60;
const OVERHEAT_LIMIT = 100;

function makePipe(id) {
  return { id, heat: 15 + Math.random() * 20, heatRate: 0.2 + Math.random() * 0.25 };
}

// ─── Reactor Room SVG Background ───────────────────────
function ReactorBackground({ angerLevel }) {
  const dangerPulse = angerLevel > 70;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rb-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0f0a1a" />
        </linearGradient>
        <linearGradient id="rb-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2a3e" />
          <stop offset="30%" stopColor="#3a3a52" />
          <stop offset="70%" stopColor="#3a3a52" />
          <stop offset="100%" stopColor="#2a2a3e" />
        </linearGradient>
        <linearGradient id="rb-rivet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
        <pattern id="rb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="none" stroke="#ffffff06" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Main wall */}
      <rect width="400" height="700" fill="url(#rb-wall)" />
      <rect width="400" height="700" fill="url(#rb-grid)" />

      {/* Metallic wall panels */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="10" y={10 + i * 230} width="380" height="220" rx="4" fill="url(#rb-metal)" opacity="0.3" stroke="#ffffff08" strokeWidth="1" />
          {/* Panel rivets */}
          {[20, 370].map(rx => [20 + i * 230, 220 + i * 230].map(ry => (
            <circle key={`${rx}-${ry}`} cx={rx} cy={ry} r="3" fill="url(#rb-rivet)" opacity="0.6" />
          )))}
        </g>
      ))}

      {/* Decorative trim — top (soft amber instead of hazard stripes) */}
      <g opacity="0.2">
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={`h-${i}`} x={i * 40 - 10} y="0" width="20" height="4" fill="#818cf8" rx="2" transform={`skewX(-20)`} />
        ))}
      </g>

      {/* Decorative trim — bottom */}
      <g opacity="0.15">
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={`hb-${i}`} x={i * 40 - 10} y="694" width="20" height="4" fill="#818cf8" rx="2" transform={`skewX(-20)`} />
        ))}
      </g>

      {/* Industrial pipes decoration */}
      <rect x="0" y="0" width="6" height="700" fill="#333" opacity="0.4" />
      <rect x="394" y="0" width="6" height="700" fill="#333" opacity="0.4" />
      <rect x="0" y="80" width="400" height="3" fill="#444" opacity="0.2" />
      <rect x="0" y="690" width="400" height="3" fill="#444" opacity="0.2" />

      {/* Steam vents */}
      {dangerPulse && (
        <>
          <circle cx="30" cy="200" r="4" fill="#ef444440">
            <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="370" cy="450" r="4" fill="#ef444440">
            <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Glow from reactor core */}
      <ellipse cx="200" cy="400" rx="180" ry="120"
        fill={angerLevel > 70 ? '#ef4444' : angerLevel > 45 ? '#f97316' : '#3b82f6'}
        opacity={angerLevel > 70 ? 0.08 : 0.04}>
        {dangerPulse && (
          <animate attributeName="opacity" values="0.04;0.12;0.04" dur="0.6s" repeatCount="indefinite" />
        )}
      </ellipse>
    </svg>
  );
}

// ─── Anger dialogue lines ──────────────────────────────
const ANGER_QUIPS = {
  intro: "Help me cool down the reactor!",
  coolGood: ["Nice job!", "That feels better!", "Ahh, much cooler!"],
  heatWarn: ["Getting warm!", "A bit toasty!", "Keep tapping!", "Almost too warm!"],
  combo: ["Great teamwork!", "YEAH! Keep going!", "That's what I call COOL!"],
  powerUp: ["Ooh, ice power!", "That's refreshing!", "Ice ice baby!"],
  win: ["We did it together!", "You're a great helper!", "High five!"],
};

export default function AngerCoolDown() {
  const navigate = useNavigate();
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { shake, ShakeWrapper, shakeStyle } = useScreenShake();
  const { combo, addCombo, resetCombo, ComboDisplay } = useCombo();
  const { say, DialogueBubble } = useDialogue();
  const { pop, NumberLayer } = useNumberPop();
  const { activePower, spawnPower, collectPower, PowerUpDisplay } = usePowerUps();
  const { startCountdown, CountdownOverlay, isCountingDown } = useIntroCountdown();

  const [phase, setPhase] = useState('intro');
  const [pipes, setPipes] = useState(() => Array.from({ length: PIPE_COUNT }, (_, i) => makePipe(i)));
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [taps, setTaps] = useState(0);
  const [angerLevel, setAngerLevel] = useState(50);
  const [iceBlastActive, setIceBlastActive] = useState(false);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const lastTickRef = useRef(Date.now());
  const lastComboTapRef = useRef(0);
  const lastDialogueRef = useRef(0);
  const lastPowerSpawnRef = useRef(0);
  const shakeIntervalRef = useRef(null);

  // ─── Intro sequence ──────────────────────────────────
  useEffect(() => {
    if (phase !== 'intro') return;
    playPhaseTransition();
    startCountdown(() => {
      setPhase('playing');
      lastTickRef.current = Date.now();
    }, ANGER_QUIPS.intro);
  }, [phase, startCountdown]);

  // ─── Continuous screen shake when heat is high ───────
  useEffect(() => {
    if (phase !== 'playing') {
      if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
      return;
    }
    shakeIntervalRef.current = setInterval(() => {
      if (angerLevel > 80) {
        shake('light');
      }
    }, 1000);
    return () => clearInterval(shakeIntervalRef.current);
  }, [phase, angerLevel, shake]);

  // ─── Game loop ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    let active = true;
    const tick = () => {
      if (!active) return;
      const now = Date.now();
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setPipes((prev) => {
        const next = prev.map((p) => {
          const rateMultiplier = iceBlastActive ? 0 : 1;
          let newHeat = p.heat + p.heatRate * dt * 60 * rateMultiplier;
          // Soft cap: if heat reaches max, it bounces back a little instead of failing
          if (newHeat >= OVERHEAT_LIMIT) {
            newHeat = OVERHEAT_LIMIT - 5;
          }
          return { ...p, heat: newHeat };
        });
        const avg = next.reduce((sum, p) => sum + p.heat, 0) / next.length;
        setAngerLevel(avg);

        // Contextual dialogue based on heat — gentle nudge
        if (avg > 75 && now - lastDialogueRef.current > 8000) {
          lastDialogueRef.current = now;
          say('anger', 'warn');
        }

        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = Date.now();
    frameRef.current = requestAnimationFrame(tick);
    return () => { active = false; if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [phase, iceBlastActive, shake, say]);

  // ─── Timer ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('success');
          playSuccess();
          peek('excited');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, peek]);

  // ─── Power-up spawning ───────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastPowerSpawnRef.current > 12000 && Math.random() < 0.4) {
        lastPowerSpawnRef.current = now;
        spawnPower();
        say('anger', 'encourage');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [phase, spawnPower, say]);

  // ─── Handle power-up activation ──────────────────────
  useEffect(() => {
    if (!activePower) return;
    if (activePower.id === 'multi-fix' || activePower.id === 'shield') {
      // Ice Blast — cool all pipes
      setIceBlastActive(true);
      playSteamHiss();
      shake('medium');
      setPipes(prev => prev.map(p => ({ ...p, heat: Math.max(5, p.heat - 30) })));
      setScore(s => s + 25);
      const quip = ANGER_QUIPS.powerUp[Math.floor(Math.random() * ANGER_QUIPS.powerUp.length)];
      say('anger', 'encourage');
      burst({ x: window.innerWidth / 2, y: window.innerHeight / 2, colors: ['#38bdf8', '#93c5fd', '#dbeafe', '#e0f2fe'] });
      setTimeout(() => setIceBlastActive(false), 3000);
    } else if (activePower.id === 'time-freeze') {
      // Brief freeze — already handled by the hook duration
      playSteamHiss();
      say('anger', 'encourage');
    }
  }, [activePower, shake, burst, say]);

  // ─── Tap handler with combo + number pops ────────────
  const handleTap = useCallback((idx, e) => {
    if (phase !== 'playing') return;
    playPop();
    playSteamHiss();
    setTaps((t) => t + 1);

    const now = Date.now();
    const rect = e?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top : window.innerHeight / 2;

    // Combo tracking
    if (now - lastComboTapRef.current < 1200) {
      addCombo();
    } else {
      resetCombo();
      addCombo();
    }
    lastComboTapRef.current = now;

    // Particle burst
    if (rect) burst({ x: cx, y: cy, colors: ['#3b82f6', '#93c5fd', '#dbeafe', '#38bdf8'] });

    setPipes((prev) => {
      const next = [...prev];
      const p = { ...next[idx] };
      const coolAmount = 15 + Math.random() * 10 + (combo >= 3 ? combo * 2 : 0);
      p.heat = Math.max(0, p.heat - coolAmount);
      next[idx] = p;

      const baseScore = 3 + (p.heat < 30 ? 5 : 0);
      const comboBonus = combo >= 3 ? combo : 0;
      const totalScore = baseScore + comboBonus;

      setScore((s) => s + totalScore);
      pop(cx, cy - 10, totalScore, combo >= 3 ? '#facc15' : '#3b82f6');

      // Combo dialogue
      if (combo > 0 && combo % 5 === 0) {
        say('anger', 'encourage');
        peek('happy');
      }

      return next;
    });

    shake('light');
  }, [phase, burst, combo, addCombo, resetCombo, pop, shake, say, peek]);

  // ─── Win/Fail handlers ───────────────────────────────
  const handleWinDone = () => {
    const stars = score >= 200 ? 3 : score >= 120 ? 2 : 1;
    recordWin('anger-reactor', stars);
    navigate(-1);
  };

  const handleRetry = () => {
    setPhase('intro');
    setPipes(Array.from({ length: PIPE_COUNT }, (_, i) => makePipe(i)));
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setTaps(0);
    setAngerLevel(50);
    resetCombo();
  };

  // ─── Derived state ──────────────────────────────────
  const angerExpression = angerLevel > 75 ? 'angry' : angerLevel > 50 ? 'angry' : 'cool';
  const flameIntensity = angerLevel > 55;
  const angerFlameScale = Math.min(1.5, 0.6 + (angerLevel / 100));
  const timerUrgent = timeLeft <= 10;
  const stars = score >= 200 ? 3 : score >= 120 ? 2 : 1;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none"
         style={{ background: '#0a0720' }}>
      <GameJuiceStyles />
      <style>{`
        @keyframes heat-glow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.15; } }
        @keyframes reactor-hum { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1px); } }
        @keyframes anger-stomp {
          0% { transform: translateY(-200px) scale(0.5); opacity: 0; }
          40% { transform: translateY(10px) scale(1.1); opacity: 1; }
          55% { transform: translateY(-5px) scale(0.95); }
          70% { transform: translateY(3px) scale(1.02); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          25% { transform: scaleY(1.15) scaleX(0.9); }
          50% { transform: scaleY(0.9) scaleX(1.1); }
          75% { transform: scaleY(1.1) scaleX(0.95); }
        }
        @keyframes ice-blast-pulse {
          0% { box-shadow: inset 0 0 30px #38bdf8; }
          50% { box-shadow: inset 0 0 60px #38bdf8; }
          100% { box-shadow: inset 0 0 30px #38bdf8; }
        }
        @keyframes win-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes star-spin {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.3); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes fail-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-2deg); }
          40% { transform: translateX(8px) rotate(2deg); }
          60% { transform: translateX(-6px) rotate(-1deg); }
          80% { transform: translateX(6px) rotate(1deg); }
        }
        @keyframes timer-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); color: #ef4444; }
        }
        @keyframes orb-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px #ef4444); }
          50% { filter: drop-shadow(0 0 20px #ef4444); }
        }
      `}</style>

      {/* Reactor room background */}
      <ReactorBackground angerLevel={angerLevel} />

      {/* Heat overlay */}
      {angerLevel > 60 && phase === 'playing' && (
        <div className="absolute inset-0 pointer-events-none z-30"
             style={{
               background: `radial-gradient(ellipse at center, #ef444420, transparent 70%)`,
               animation: `heat-glow ${angerLevel > 80 ? '0.4s' : '1s'} ease-in-out infinite`,
             }} />
      )}

      {/* Ice blast overlay */}
      {iceBlastActive && (
        <div className="absolute inset-0 pointer-events-none z-30"
             style={{
               background: 'radial-gradient(ellipse at center, #38bdf820, transparent 70%)',
               animation: 'ice-blast-pulse 0.5s ease-in-out infinite',
             }} />
      )}

      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />
      <NumberLayer />
      <ComboDisplay />
      <DialogueBubble />
      <PowerUpDisplay />
      <CountdownOverlay />

      <ShakeWrapper className="relative z-10 p-4 pt-14" style={{}}>
        {/* ─── Header with reactive Anger character ────── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div style={{
              transform: `scale(${angerFlameScale})`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.3s ease',
              animation: flameIntensity ? 'flame-flicker 0.3s ease-in-out infinite' : 'none',
            }}>
              <Anger size={44} expression={angerExpression} flameOn={flameIntensity} />
            </div>
            <div>
              <h2 className="text-white font-heading text-base leading-tight">Cool Down!</h2>
              <p className="text-white/30 text-[10px]">Tap the pipes to help!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {combo >= 3 && (
              <span className="text-xs font-heading px-2 py-0.5 rounded-full"
                    style={{
                      color: combo >= 8 ? '#ef4444' : combo >= 5 ? '#f97316' : '#facc15',
                      background: combo >= 8 ? '#ef444420' : combo >= 5 ? '#f9731620' : '#facc1520',
                      border: `1px solid ${combo >= 8 ? '#ef444440' : combo >= 5 ? '#f9731640' : '#facc1540'}`,
                    }}>
                x{combo}
              </span>
            )}
            <span className="text-sm font-mono"
                  style={{
                    color: timerUrgent ? '#ef4444' : '#ffffff80',
                    animation: timerUrgent ? 'timer-pulse 0.5s ease-in-out infinite' : 'none',
                    fontWeight: timerUrgent ? 'bold' : 'normal',
                  }}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* ─── Reactor core gauge ──────────────────────── */}
        <div className="rounded-lg p-2 mb-3" style={{ background: '#0a071a', border: '1px solid #ffffff10' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Reactor Core</span>
            <span className="text-[10px] font-mono ml-auto font-bold"
                  style={{ color: angerLevel > 70 ? '#ef4444' : angerLevel > 45 ? '#f97316' : '#22c55e' }}>
              {Math.round(angerLevel)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
            <div className="h-full rounded-full transition-all duration-300"
                 style={{
                   width: `${angerLevel}%`,
                   background: `linear-gradient(to right, #3b82f6, ${angerLevel > 70 ? '#ef4444' : angerLevel > 45 ? '#f97316' : '#22c55e'})`,
                 }} />
            {/* Danger zone marker */}
            <div className="absolute top-0 h-full w-px bg-red-500/40" style={{ left: '70%' }} />
            <div className="absolute top-0 h-full w-px bg-red-500/60" style={{ left: '90%' }} />
          </div>
        </div>

        {/* ─── Score row ───────────────────────────────── */}
        <div className="flex items-center gap-3 mb-3 text-xs">
          <span className="text-white/40 flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#facc15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {score}
          </span>
          <span className="text-white/40">{taps} taps</span>
          {iceBlastActive && (
            <span className="text-sky-400 text-[10px] font-heading animate-pulse ml-auto">ICE BLAST!</span>
          )}
        </div>

        {/* ─── Pipes ───────────────────────────────────── */}
        {phase === 'playing' && (
          <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
            {pipes.map((pipe, i) => (
              <div key={pipe.id}
                   onClick={(e) => handleTap(i, e)}
                   className="cursor-pointer active:scale-[0.97] transition-transform duration-100"
                   style={{
                     animation: pipe.heat > 85 ? 'reactor-hum 0.1s ease-in-out infinite' : 'none',
                   }}>
                <Pipe heat={pipe.heat} width={300} height={36} />
              </div>
            ))}
          </div>
        )}

        {/* ─── Tip ─────────────────────────────────────── */}
        {phase === 'playing' && taps < 5 && (
          <p className="text-center text-white/20 text-xs mt-4 animate-pulse">
            Tap pipes to cool them down!
          </p>
        )}

        {/* ─── Success screen ──────────────────────────── */}
        {phase === 'success' && (
          <div className="flex flex-col items-center justify-center gap-4 mt-6">
            {/* Anger doing a cool-down celebration */}
            <div style={{ animation: 'win-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
              <Anger size={100} expression="cool" flameOn={false} />
            </div>

            <h2 className="text-2xl font-heading text-white"
                style={{ animation: 'win-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' }}>
              Cooled Down!
            </h2>

            <p className="text-white/50 text-sm"
               style={{ animation: 'win-bounce 0.6s ease-out 0.4s both' }}>
              {score >= 200 ? '"You\'re amazing!" - Anger'
                : score >= 120 ? '"Great teamwork!" - Anger'
                : '"We did it together!" - Anger'}
            </p>

            {/* Stars with spin animation */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ animation: `star-spin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + s * 0.2}s both` }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" fill={score >= s * 70 ? '#facc15' : '#ffffff15'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Score breakdown */}
            <div className="bg-white/5 rounded-xl px-4 py-2 text-center"
                 style={{ animation: 'win-bounce 0.6s ease-out 1.2s both' }}>
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-white font-heading text-xl">{score}</p>
              <p className="text-white/30 text-[10px]">{taps} taps | {stars} star{stars !== 1 ? 's' : ''}</p>
            </div>

            {/* Memory Orb with glow */}
            <div style={{ animation: 'orb-glow-pulse 1.5s ease-in-out infinite' }}>
              <MemoryOrb color={EMOTION_COLORS.anger} size={55} pulse />
            </div>

            <button onClick={handleWinDone}
              className="mt-1 px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-heading active:scale-95 transition-transform shadow-lg shadow-red-500/25"
              style={{ animation: 'win-bounce 0.6s ease-out 1.5s both' }}>
              Collect Memory Orb!
            </button>
          </div>
        )}

        {/* ─── Fail screen — softened to "good try" ───── */}
        {phase === 'fail' && (
          <div className="flex flex-col items-center justify-center gap-4 mt-6">
            <div style={{ animation: 'win-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
              <Anger size={90} expression="cool" flameOn={false} />
            </div>

            <h2 className="text-xl font-heading text-orange-300"
                style={{ animation: 'win-bounce 0.6s ease-out 0.2s both' }}>
              Good Try!
            </h2>

            <p className="text-white/50 text-sm text-center">
              The reactor got a bit warm — let's try again!
            </p>

            <div className="bg-white/5 rounded-xl px-4 py-2 text-center">
              <p className="text-white/30 text-[10px]">
                You scored {score} points with {taps} taps
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={handleRetry}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-heading active:scale-95 transition-transform shadow-lg shadow-orange-500/25">
                Play Again!
              </button>
              <button onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-full bg-white/10 text-white font-heading active:scale-95 transition-transform">
                Back
              </button>
            </div>
          </div>
        )}
      </ShakeWrapper>
    </div>
  );
}
