import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { Joy, Anger, Anxiety, Sadness, Fear, Disgust, MemoryOrb } from './Characters';
import { EMOTION_COLORS, ROOMS, recordWin, loadProgress, saveProgress } from './insideOutData';
import {
  playBossIntro, playPhaseTransition, playComboHit, playConsoleBeep,
  playVictoryFanfare, playCountdownTick, playAlarmChime,
} from './insideOutSounds';
import {
  useScreenShake, useCombo, useDialogue, useNumberPop,
  usePowerUps, useIntroCountdown, GameJuiceStyles,
} from './useGameJuice';

// ─── Challenges ────────────────────────────────────────
const CHALLENGES = [
  { roomId: 'control-room', title: 'Fix the Console!', type: 'tap-match', color: EMOTION_COLORS.joy, target: 5, Char: Joy, charId: 'joy' },
  { roomId: 'anger-reactor', title: 'Cool the Reactor!', type: 'tap-cool', color: EMOTION_COLORS.anger, target: 10, Char: Anger, charId: 'anger' },
  { roomId: 'anxiety-dome', title: 'Pop the Alarms!', type: 'tap-pop', color: EMOTION_COLORS.anxiety, target: 8, Char: Anxiety, charId: 'anxiety' },
];

// ─── Crisis Background ────────────────────────────────
function CrisisBackground({ phase, challengeIdx }) {
  const danger = phase === 'challenge' || phase === 'transition';
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2d1b4e 0%, #1a0a2e 40%, #0a0520 100%)',
      }} />

      {/* Alert strobe bands */}
      {danger && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1" style={{
            background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
            animation: 'crisisStrobe 1.5s ease-in-out infinite',
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{
            background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
            animation: 'crisisStrobe 1.5s ease-in-out infinite 0.75s',
          }} />
        </>
      )}

      {/* Headquarters silhouette */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-10" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice">
        <rect x="50" y="40" width="300" height="80" rx="20" fill="#7c3aed" />
        <rect x="80" y="20" width="240" height="100" rx="15" fill="#6d28d9" />
        <circle cx="200" cy="50" r="25" fill="#8b5cf6" opacity="0.5" />
        {/* Windows */}
        {[110, 160, 210, 260].map(x => (
          <rect key={x} x={x} y="55" width="20" height="15" rx="3" fill="#a78bfa" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </svg>

      {/* Floating emergency particles */}
      {danger && Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{
          left: `${10 + Math.random() * 80}%`,
          background: i % 2 === 0 ? '#ef4444' : '#f59e0b',
          opacity: 0.4,
          animation: `crisisFloat ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
        }} />
      ))}

      {/* Room color accent overlay */}
      {phase === 'challenge' && (
        <div className="absolute inset-0 transition-colors duration-500" style={{
          background: `radial-gradient(ellipse at 50% 80%, ${CHALLENGES[challengeIdx]?.color}15, transparent 60%)`,
        }} />
      )}
    </div>
  );
}

// ─── Tap-Match Challenge (Control Room) ────────────────
function TapMatchChallenge({ target, onComplete, burst, shake, addCombo, resetCombo, pop, say }) {
  const [buttons, setButtons] = useState(() =>
    Array.from({ length: target }, (_, i) => {
      const t = Math.floor(Math.random() * 5);
      let c = Math.floor(Math.random() * 5);
      while (c === t) c = (c + 1) % 5;
      return { id: i, targetIdx: t, currentIdx: c, fixed: false };
    })
  );
  const fixedCount = useRef(0);

  const icons = ['\u2600', '\uD83D\uDCA7', '\uD83D\uDD36', '\u2B27', '\u2726'];
  const colors = [EMOTION_COLORS.joy, EMOTION_COLORS.sadness, EMOTION_COLORS.anger, EMOTION_COLORS.fear, EMOTION_COLORS.disgust];

  const handleTap = (idx, e) => {
    playConsoleBeep();
    const rect = e.currentTarget.getBoundingClientRect();
    setButtons(prev => {
      const next = [...prev];
      const btn = { ...next[idx] };
      if (btn.fixed) return prev;
      btn.currentIdx = (btn.currentIdx + 1) % 5;
      if (btn.currentIdx === btn.targetIdx) {
        btn.fixed = true;
        fixedCount.current++;
        playBoing();
        addCombo();
        pop(rect.left + rect.width / 2, rect.top, 50, EMOTION_COLORS.joy);
        burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, colors: [EMOTION_COLORS.joy, '#fff'] });
        shake('light');
        if (fixedCount.current === 2) say('joy', 'encourage');
      }
      next[idx] = btn;
      if (next.every(b => b.fixed)) {
        say('joy', 'celebrate');
        setTimeout(onComplete, 300);
      }
      return next;
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3 max-w-[220px] mx-auto">
      {buttons.map((btn, i) => (
        <button key={btn.id} onPointerDown={e => handleTap(i, e)} disabled={btn.fixed}
          className={`h-16 rounded-xl flex items-center justify-center gap-2 active:scale-90 transition-all
            ${btn.fixed ? 'opacity-30 scale-95' : 'hover:scale-105'}`}
          style={{
            background: btn.fixed
              ? 'linear-gradient(135deg, #22c55e22, #16a34a22)'
              : `linear-gradient(135deg, ${colors[btn.currentIdx]}22, ${colors[btn.currentIdx]}11)`,
            border: `2px solid ${btn.fixed ? '#22c55e88' : colors[btn.currentIdx]}66`,
            boxShadow: btn.fixed ? 'inset 0 0 10px #22c55e22' : `inset 0 0 10px ${colors[btn.currentIdx]}11`,
          }}>
          {btn.fixed ? (
            <span className="text-green-400 text-xl">✓</span>
          ) : (
            <>
              <span className="text-lg">{icons[btn.currentIdx]}</span>
              <span className="text-white/20 text-xs">→</span>
              <span className="text-sm opacity-50">{icons[btn.targetIdx]}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Tap-Cool Challenge (Anger Reactor) ────────────────
function TapCoolChallenge({ target, onComplete, burst, shake, addCombo, pop, say }) {
  const [taps, setTaps] = useState(0);
  const heat = Math.max(0, 90 - (taps / target) * 90);
  const heatColor = heat > 60 ? '#ef4444' : heat > 30 ? '#f59e0b' : '#3b82f6';

  const handleTap = e => {
    playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, colors: ['#3b82f6', '#93c5fd'] });
    pop(rect.left + rect.width / 2, rect.top, 10, '#3b82f6');
    addCombo();
    shake(heat > 60 ? 'medium' : 'light');
    setTaps(t => {
      const n = t + 1;
      if (n === Math.floor(target / 2)) say('anger', 'encourage');
      if (n >= target) {
        say('anger', 'celebrate');
        setTimeout(onComplete, 300);
      }
      return n;
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Heat gauge */}
      <div className="w-52 h-4 rounded-full overflow-hidden" style={{
        background: '#ffffff08', border: '1px solid #ffffff10',
      }}>
        <div className="h-full rounded-full transition-all duration-300" style={{
          width: `${heat}%`,
          background: `linear-gradient(90deg, ${heatColor}88, ${heatColor})`,
          boxShadow: `0 0 8px ${heatColor}66`,
        }} />
      </div>
      <span className="text-white/30 text-xs">{Math.round(heat)}% heat</span>

      {/* Tap target */}
      <button onPointerDown={handleTap}
        className="w-24 h-24 rounded-full flex items-center justify-center active:scale-90 transition-transform"
        style={{
          background: `radial-gradient(circle, ${heatColor}44, ${heatColor}11)`,
          border: `3px solid ${heatColor}88`,
          boxShadow: `0 0 30px ${heatColor}33, inset 0 0 15px ${heatColor}22`,
        }}>
        <Anger size={56} expression={heat > 50 ? 'angry' : 'cool'} flameOn={heat > 30} />
      </button>
      <span className="text-white/30 text-xs font-mono">{taps}/{target} taps</span>
    </div>
  );
}

// ─── Tap-Pop Challenge (Anxiety Dome) ──────────────────
function TapPopChallenge({ target, onComplete, burst, shake, addCombo, pop, say }) {
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: target }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 5 + Math.random() * 75,
      size: 44 + Math.random() * 16,
      color: Object.values(EMOTION_COLORS)[i % 6],
      alive: true,
    }))
  );
  const [popped, setPopped] = useState(0);

  const handlePop = (b, e) => {
    if (!b.alive) return;
    playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    burst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, colors: [b.color, '#fff'] });
    pop(rect.left + rect.width / 2, rect.top, 15, b.color);
    addCombo();
    shake('light');
    setBubbles(prev => prev.map(x => x.id === b.id ? { ...x, alive: false } : x));
    setPopped(p => {
      const n = p + 1;
      if (n === 3) say('anxiety', 'encourage');
      if (n >= target) {
        say('anxiety', 'celebrate');
        setTimeout(onComplete, 300);
      }
      return n;
    });
  };

  return (
    <div className="relative w-full h-44">
      {bubbles.filter(b => b.alive).map(b => (
        <div key={b.id} onPointerDown={e => handlePop(b, e)}
          className="absolute cursor-pointer active:scale-75 transition-transform"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.size, height: b.size,
            transform: 'translate(-50%, -50%)',
            animation: `crisisBubbleBob ${2 + Math.random()}s ease-in-out infinite ${Math.random()}s`,
          }}>
          <svg viewBox="0 0 100 100" width={b.size} height={b.size}>
            <defs>
              <radialGradient id={`cb${b.id}`} cx="40%" cy="35%">
                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor={b.color} stopOpacity="0.15" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill={`url(#cb${b.id})`} stroke={b.color} strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="50" cy="50" r="36" fill={`${b.color}44`} />
            <ellipse cx="38" cy="35" rx="12" ry="8" fill="white" opacity="0.2" transform="rotate(-20 38 35)" />
            <text x="50" y="58" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" opacity="0.7">!</text>
          </svg>
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 text-center text-white/25 text-xs">{popped}/{target} popped</div>
    </div>
  );
}

// ─── Main Boss Event ──────────────────────────────────
export default function ChainReactionCrisis() {
  const navigate = useNavigate();
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { shake, ShakeWrapper } = useScreenShake();
  const { combo, addCombo, resetCombo, ComboDisplay } = useCombo();
  const { say, DialogueBubble } = useDialogue();
  const { pop, NumberLayer } = useNumberPop();
  const { activePower, spawnPower, collectPower, PowerUpDisplay } = usePowerUps();
  const { startCountdown, CountdownOverlay, isCountingDown } = useIntroCountdown();

  const [phase, setPhase] = useState('cinematic'); // cinematic → intro → challenge → transition → success/fail
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);
  const [score, setScore] = useState(0);
  const [starsRevealed, setStarsRevealed] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [charReveal, setCharReveal] = useState(0); // 0-3 for cinematic character reveals
  const startTimeRef = useRef(null);

  // ── Cinematic Intro Sequence ──
  useEffect(() => {
    if (phase !== 'cinematic') return;
    playBossIntro();
    const timers = [
      setTimeout(() => shake('heavy'), 500),
      setTimeout(() => { setCharReveal(1); playAlarmChime(); }, 1200),
      setTimeout(() => { setCharReveal(2); shake('medium'); }, 2200),
      setTimeout(() => { setCharReveal(3); }, 3200),
      setTimeout(() => { setShowTitle(true); shake('heavy'); }, 4000),
      setTimeout(() => { setPhase('intro'); }, 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, shake]);

  // ── Start game after intro countdown ──
  useEffect(() => {
    if (phase !== 'intro') return;
    startCountdown(() => {
      setPhase('challenge');
      startTimeRef.current = Date.now();
    }, 'All rooms need help at once!');
  }, [phase, startCountdown]);

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'challenge' && phase !== 'transition') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase('fail');
          playBuzz();
          shake('heavy');
          return 0;
        }
        if (prev <= 10) playCountdownTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, shake]);

  // ── Challenge Complete ──
  const handleChallengeComplete = useCallback(() => {
    playPhaseTransition();
    setScore(s => s + 100 + combo * 25);
    shake('medium');
    resetCombo();

    // Burst celebration particles
    burst({ x: window.innerWidth / 2, y: window.innerHeight / 2, colors: [CHALLENGES[challengeIdx]?.color, '#fff', '#22c55e'] });

    if (challengeIdx >= CHALLENGES.length - 1) {
      setTotalTime(Math.round((Date.now() - startTimeRef.current) / 1000));
      setTimeout(() => {
        setPhase('success');
        playVictoryFanfare();
        shake('heavy');
        peek('excited');
      }, 600);
    } else {
      setPhase('transition');
      peek('happy');
      setTimeout(() => {
        setChallengeIdx(i => i + 1);
        resetCombo();
        setPhase('challenge');
      }, 2000);
    }
  }, [challengeIdx, combo, burst, shake, resetCombo, peek]);

  // ── Stars reveal animation ──
  useEffect(() => {
    if (phase !== 'success') return;
    const earnedStars = totalTime < 25 ? 3 : totalTime < 45 ? 2 : 1;
    const timers = [0, 1, 2].map((i) =>
      setTimeout(() => {
        if (i < earnedStars) {
          setStarsRevealed(i + 1);
          playBoing();
          shake('light');
        }
      }, 800 + i * 500)
    );
    // Celebration particles
    const pt = setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          burst({
            x: 80 + Math.random() * (window.innerWidth - 160),
            y: 100 + Math.random() * 200,
            colors: [EMOTION_COLORS.joy, EMOTION_COLORS.anger, EMOTION_COLORS.anxiety, '#fff'],
          });
        }, i * 400);
      }
    }, 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(pt); };
  }, [phase, totalTime, burst, shake]);

  const handleWinDone = () => {
    const stars = totalTime < 25 ? 3 : totalTime < 45 ? 2 : 1;
    CHALLENGES.forEach(c => recordWin(c.roomId, stars));
    const p = loadProgress();
    p.bossCompleted = true;
    saveProgress(p);
    navigate(-1);
  };

  const current = CHALLENGES[challengeIdx];
  const earnedStars = totalTime < 25 ? 3 : totalTime < 45 ? 2 : 1;

  return (
    <ShakeWrapper className="relative w-full h-full overflow-hidden select-none">
      <GameJuiceStyles />
      <style>{`
        @keyframes crisisStrobe {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes crisisFloat {
          0%, 100% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
        @keyframes crisisBubbleBob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -55%) scale(1.05); }
        }
        @keyframes roomSlideIn {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes roomSlideOut {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes titleSlam {
          0% { transform: scale(3); opacity: 0; }
          60% { transform: scale(0.9); opacity: 1; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes charDramaticEnter {
          0% { transform: translateY(80px) scale(0.3); opacity: 0; }
          60% { transform: translateY(-10px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes redAlertPulse {
          0%, 100% { background: radial-gradient(circle, #ef444400, #ef444400); }
          50% { background: radial-gradient(circle, #ef444422, #ef444400 70%); }
        }
        @keyframes stabilizedCheck {
          0% { transform: scale(0) rotate(-90deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes victoryGlow {
          0%, 100% { text-shadow: 0 0 20px #facc1566; }
          50% { text-shadow: 0 0 40px #facc15aa, 0 0 60px #f59e0b44; }
        }
        @keyframes starBounceIn {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.4) rotate(15deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes orbAssemble {
          0% { transform: translateY(60px) scale(0); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes crisisVignette {
          0%, 100% { box-shadow: inset 0 0 80px #ef444433; }
          50% { box-shadow: inset 0 0 120px #ef444455; }
        }
      `}</style>

      <CrisisBackground phase={phase} challengeIdx={challengeIdx} />
      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />
      <ComboDisplay />
      <DialogueBubble />
      <NumberLayer />
      <PowerUpDisplay />
      <CountdownOverlay />

      {/* Danger vignette during gameplay */}
      {(phase === 'challenge' || phase === 'transition') && timeLeft < 20 && (
        <div className="absolute inset-0 pointer-events-none z-30" style={{
          animation: 'crisisVignette 1s ease-in-out infinite',
        }} />
      )}

      {/* ── CINEMATIC INTRO ── */}
      {phase === 'cinematic' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center">
          {/* Red alert pulse overlay */}
          <div className="absolute inset-0" style={{
            animation: 'redAlertPulse 1s ease-in-out infinite',
          }} />

          {/* Character reveals */}
          <div className="flex gap-6 mb-8">
            {[
              { Char: Joy, size: 64, delay: 0, show: charReveal >= 1 },
              { Char: Anger, size: 60, delay: 0.15, show: charReveal >= 2 },
              { Char: Anxiety, size: 58, delay: 0.3, show: charReveal >= 3 },
            ].map(({ Char, size, show }, i) => (
              <div key={i} style={{
                opacity: show ? 1 : 0,
                animation: show ? `charDramaticEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : 'none',
              }}>
                <Char size={size} />
              </div>
            ))}
          </div>

          {/* Title slam */}
          {showTitle && (
            <div style={{ animation: 'titleSlam 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
              <h1 className="text-3xl font-heading text-center px-4" style={{
                background: 'linear-gradient(180deg, #fff, #ef4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.5))',
              }}>
                CHAIN REACTION CRISIS
              </h1>
              <p className="text-red-300/60 text-sm text-center mt-2 animate-pulse">
                HEADQUARTERS EMERGENCY
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── PROGRESS DOTS ── */}
      {(phase === 'challenge' || phase === 'transition') && (
        <div className="relative z-10 flex justify-center gap-5 pt-14 mb-3">
          {CHALLENGES.map((c, i) => {
            const room = ROOMS.find(r => r.id === c.roomId);
            const isComplete = i < challengeIdx;
            const isCurrent = i === challengeIdx && phase === 'challenge';
            return (
              <div key={c.roomId} className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCurrent ? 'ring-2 ring-white/40 scale-110' : ''}`}
                  style={{
                    background: isComplete
                      ? 'linear-gradient(135deg, #22c55e33, #16a34a22)'
                      : isCurrent
                        ? `radial-gradient(circle, ${c.color}33, ${c.color}11)`
                        : '#ffffff06',
                    border: `2px solid ${isComplete ? '#22c55e88' : isCurrent ? `${c.color}88` : '#ffffff10'}`,
                    boxShadow: isCurrent ? `0 0 15px ${c.color}33` : 'none',
                  }}>
                  {isComplete ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#22c55e" style={{
                      animation: 'stabilizedCheck 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <c.Char size={30} />
                  )}
                </div>
                <span className={`text-[9px] ${isComplete ? 'text-green-400/50' : isCurrent ? 'text-white/50' : 'text-white/20'}`}>
                  {room?.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TIMER BAR ── */}
      {(phase === 'challenge' || phase === 'transition') && (
        <div className="relative z-10 mx-4 mb-4">
          <div className="h-3 rounded-full overflow-hidden" style={{
            background: '#ffffff08', border: '1px solid #ffffff10',
          }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{
              width: `${(timeLeft / 75) * 100}%`,
              background: timeLeft > 40 ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                : timeLeft > 20 ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                : 'linear-gradient(90deg, #ef4444, #dc2626)',
              boxShadow: timeLeft <= 20 ? '0 0 10px #ef444466' : 'none',
            }} />
          </div>
          <div className="flex justify-between items-center text-xs mt-1.5">
            <span className="flex items-center gap-1.5 text-white/40">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-heading">{score}</span>
            </span>
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white/40'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      )}

      {/* ── CHALLENGE PHASE ── */}
      {phase === 'challenge' && current && (
        <div className="relative z-10 px-4" style={{ animation: 'roomSlideIn 0.5s ease-out' }}>
          {/* Room header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <current.Char size={36} />
            <div>
              <h3 className="text-base font-heading text-white">{current.title}</h3>
              <p className="text-white/25 text-[10px]">Room {challengeIdx + 1} of {CHALLENGES.length}</p>
            </div>
          </div>

          {/* Challenge container */}
          <div className="rounded-2xl p-4" style={{
            background: `linear-gradient(135deg, ${current.color}08, #ffffff04)`,
            border: `2px solid ${current.color}20`,
            boxShadow: `0 0 30px ${current.color}08, inset 0 0 20px ${current.color}05`,
          }}>
            {current.type === 'tap-match' && (
              <TapMatchChallenge target={current.target} onComplete={handleChallengeComplete}
                burst={burst} shake={shake} addCombo={addCombo} resetCombo={resetCombo} pop={pop} say={say} />
            )}
            {current.type === 'tap-cool' && (
              <TapCoolChallenge target={current.target} onComplete={handleChallengeComplete}
                burst={burst} shake={shake} addCombo={addCombo} pop={pop} say={say} />
            )}
            {current.type === 'tap-pop' && (
              <TapPopChallenge target={current.target} onComplete={handleChallengeComplete}
                burst={burst} shake={shake} addCombo={addCombo} pop={pop} say={say} />
            )}
          </div>
        </div>
      )}

      {/* ── TRANSITION PHASE ── */}
      {phase === 'transition' && (
        <div className="flex flex-col items-center justify-center gap-4 mt-16">
          <div style={{ animation: 'stabilizedCheck 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="#22c55e">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h3 className="text-xl font-heading text-green-400" style={{
            textShadow: '0 0 20px #22c55e44',
          }}>Room Stabilized!</h3>
          <p className="text-white/30 text-sm">Moving to next emergency...</p>

          {/* Room mini-preview */}
          {challengeIdx + 1 < CHALLENGES.length && (
            <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl" style={{
              background: `${CHALLENGES[challengeIdx + 1].color}11`,
              border: `1px solid ${CHALLENGES[challengeIdx + 1].color}22`,
            }}>
              {(() => { const Next = CHALLENGES[challengeIdx + 1].Char; return <Next size={28} />; })()}
              <span className="text-white/40 text-xs">{CHALLENGES[challengeIdx + 1].title}</span>
            </div>
          )}
        </div>
      )}

      {/* ── SUCCESS ── */}
      {phase === 'success' && (
        <div className="flex flex-col items-center justify-center gap-4 mt-6 px-4" style={{
          animation: 'roomSlideIn 0.6s ease-out',
        }}>
          {/* All characters celebrating */}
          <div className="flex items-end gap-2">
            {[
              { Char: Joy, size: 50, props: { expression: 'excited', glow: true } },
              { Char: Anger, size: 46, props: { expression: 'cool', flameOn: false } },
              { Char: Anxiety, size: 44, props: { expression: 'nervous', sparks: false } },
            ].map(({ Char, size, props }, i) => (
              <div key={i} style={{
                animation: `charDramaticEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s both`,
              }}>
                <Char size={size} {...props} />
              </div>
            ))}
          </div>

          {/* Victory title */}
          <h2 className="text-2xl font-heading text-center" style={{
            background: 'linear-gradient(180deg, #facc15, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'victoryGlow 2s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.3))',
          }}>
            HEADQUARTERS SAVED!
          </h2>

          <p className="text-white/40 text-sm text-center">
            All rooms are stable! The crisis is over!
          </p>

          {/* Stars */}
          <div className="flex gap-3 my-2">
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                animation: starsRevealed >= s ? `starBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : 'none',
                opacity: starsRevealed >= s ? 1 : 0.15,
              }}>
                <svg viewBox="0 0 24 24" width="36" height="36"
                  fill={starsRevealed >= s && earnedStars >= s ? '#facc15' : '#ffffff15'}
                  style={{ filter: starsRevealed >= s && earnedStars >= s ? 'drop-shadow(0 2px 6px #facc1566)' : 'none' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-white/30 text-xs">
            <span>Time: {totalTime}s</span>
            <span>Score: {score}</span>
          </div>

          {/* Memory orbs assemble */}
          <div className="flex gap-3 my-2">
            {[EMOTION_COLORS.joy, EMOTION_COLORS.anger, EMOTION_COLORS.anxiety].map((color, i) => (
              <div key={i} style={{
                animation: `orbAssemble 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.5 + i * 0.3}s both`,
              }}>
                <MemoryOrb color={color} size={38} pulse />
              </div>
            ))}
          </div>

          {/* Victory button */}
          <button onClick={handleWinDone}
            className="mt-2 px-10 py-3.5 rounded-full font-heading text-lg active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #facc15, #f59e0b)',
              color: '#1e1b4b',
              boxShadow: '0 4px 20px #facc1533, inset 0 1px 0 #fde68a',
            }}>
            Claim Victory!
          </button>
        </div>
      )}

      {/* ── FAIL ── */}
      {phase === 'fail' && (
        <div className="flex flex-col items-center justify-center gap-4 mt-10 px-4" style={{
          animation: 'roomSlideIn 0.5s ease-out',
        }}>
          <Joy size={72} expression="worried" glow={false} />

          <h2 className="text-2xl font-heading text-red-400" style={{
            textShadow: '0 0 20px #ef444444',
          }}>Time's Up!</h2>

          <p className="text-white/40 text-sm text-center">
            The chain reaction overwhelmed Headquarters!
          </p>

          <div className="text-white/20 text-xs">
            Rooms cleared: {challengeIdx}/{CHALLENGES.length}
          </div>

          <div className="flex gap-3 mt-3">
            <button onClick={() => {
              setPhase('cinematic');
              setChallengeIdx(0);
              setTimeLeft(75);
              setScore(0);
              setTotalTime(0);
              setStarsRevealed(0);
              setShowTitle(false);
              setCharReveal(0);
              resetCombo();
            }}
              className="px-8 py-3 rounded-full font-heading active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                boxShadow: '0 4px 15px #7c3aed33',
              }}>
              Try Again
            </button>
            <button onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full bg-white/10 text-white/60 font-heading active:scale-95 transition-transform">
              Back
            </button>
          </div>
        </div>
      )}
    </ShakeWrapper>
  );
}
