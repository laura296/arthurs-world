import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playSparkle, playError, playBoing, playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/**
 * OddOnePicks — "Picks" game for Arthur's World.
 *
 * Show 4 emoji items in a 2×2 grid. Three belong together, one is the odd one out.
 * Tap the odd item to advance. 10 rounds per session with progressive difficulty,
 * celebration tiers, streak tracking, and gentle error handling.
 */

/* ═══════════════════════════════════════════════════════════════
   ROUND DATABASE — 30+ rounds across 3 difficulty tiers
   ═══════════════════════════════════════════════════════════════ */

const EASY_ROUNDS = [
  { items: ['🐶', '🐱', '🐰', '🍎'], oddIndex: 3, hint: 'animals' },
  { items: ['🚗', '🚌', '🚂', '🌸'], oddIndex: 3, hint: 'vehicles' },
  { items: ['🍎', '🍊', '🍌', '🐸'], oddIndex: 3, hint: 'fruits' },
  { items: ['⚽', '🏀', '🎾', '🦋'], oddIndex: 3, hint: 'balls' },
  { items: ['🌺', '🌻', '🌷', '🐟'], oddIndex: 3, hint: 'flowers' },
  { items: ['🐄', '🐷', '🐔', '🎸'], oddIndex: 3, hint: 'farm' },
  { items: ['🍕', '🍔', '🌮', '🌈'], oddIndex: 3, hint: 'food' },
  { items: ['🐘', '🦁', '🦒', '🧁'], oddIndex: 3, hint: 'zoo' },
  { items: ['🎹', '🥁', '🎸', '🐝'], oddIndex: 3, hint: 'music' },
  { items: ['🖍️', '✏️', '🖌️', '🐕'], oddIndex: 3, hint: 'art' },
];

const MEDIUM_ROUNDS = [
  { items: ['🐕', '🐈', '🐇', '🦅'], oddIndex: 3, hint: 'pets' },
  { items: ['🐄', '🐷', '🐑', '🐊'], oddIndex: 3, hint: 'farm' },
  { items: ['🚗', '🚕', '🏎️', '✈️'], oddIndex: 3, hint: 'roads' },
  { items: ['🍎', '🍓', '🍒', '🍋'], oddIndex: 3, hint: 'red' },
  { items: ['🌳', '🌲', '🌴', '🌊'], oddIndex: 3, hint: 'trees' },
  { items: ['👟', '🥾', '👞', '🎩'], oddIndex: 3, hint: 'shoes' },
  { items: ['🏠', '🏰', '⛺', '🚢'], oddIndex: 3, hint: 'buildings' },
  { items: ['☀️', '⭐', '🌙', '🌧️'], oddIndex: 3, hint: 'sky' },
  { items: ['🐶', '🐺', '🦊', '🐸'], oddIndex: 3, hint: 'canines' },
  { items: ['🧊', '❄️', '⛄', '🔥'], oddIndex: 3, hint: 'cold' },
];

const HARD_ROUNDS = [
  { items: ['🦅', '🦜', '🐦', '🐧'], oddIndex: 3, hint: 'fly' },
  { items: ['🐘', '🦛', '🦏', '🐁'], oddIndex: 3, hint: 'big' },
  { items: ['🐢', '🐍', '🦎', '🐰'], oddIndex: 3, hint: 'reptiles' },
  { items: ['🍎', '🍓', '🌹', '🍊'], oddIndex: 3, hint: 'red' },
  { items: ['🐋', '🐬', '🐠', '🐕'], oddIndex: 3, hint: 'water' },
  { items: ['🦁', '🐯', '🐆', '🐄'], oddIndex: 3, hint: 'wild cats' },
  { items: ['🚂', '🚌', '🚗', '⛵'], oddIndex: 3, hint: 'wheels' },
  { items: ['🍕', '🍔', '🌮', '🍰'], oddIndex: 3, hint: 'savoury' },
  { items: ['🌺', '🌸', '🌻', '🍄'], oddIndex: 3, hint: 'flowers' },
  { items: ['⚽', '🏀', '🏐', '🏈'], oddIndex: 3, hint: 'round' },
];

const TOTAL_ROUNDS = 10;
const BEST_SCORE_KEY = 'arthurs-world-odd-one-picks-best';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

/** Fisher-Yates shuffle (returns new array) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick n random items from pool without repeats */
function pickRandom(pool, n) {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, n);
}

/** Build a 10-round session with progressive difficulty */
function buildSession() {
  const easy = pickRandom(EASY_ROUNDS, 3);
  const medium = pickRandom(MEDIUM_ROUNDS, 3);
  const hard = pickRandom(HARD_ROUNDS, 4);
  return [...easy, ...medium, ...hard];
}

/** Shuffle odd-item position within the 4 items, return { items, oddIndex } */
function shuffleOddPosition(round) {
  const original = round.items;
  const oddItem = original[round.oddIndex];
  const others = original.filter((_, i) => i !== round.oddIndex);
  const newOddIndex = Math.floor(Math.random() * 4);
  const result = [];
  let otherIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === newOddIndex) {
      result.push(oddItem);
    } else {
      result.push(others[otherIdx++]);
    }
  }
  return { items: result, oddIndex: newOddIndex, hint: round.hint };
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Row of 10 progress dots — gold star when completed, pulsing ring on current */
function ProgressBar({ current, results }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
        const done = i < current;
        const active = i === current;
        const perfect = results[i] === true;
        return (
          <div
            key={i}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center
              transition-all duration-500
              ${done
                ? perfect
                  ? 'bg-amber-400 shadow-md shadow-amber-400/50 scale-110'
                  : 'bg-amber-300/60 shadow-sm'
                : active
                  ? 'bg-white/40 border-2 border-amber-400 animate-pulse shadow-md shadow-amber-300/40'
                  : 'bg-white/15 border border-white/20'
              }
            `}
            style={done ? {
              animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              animationDelay: '0ms',
            } : undefined}
          >
            {done && (
              <span className="text-sm leading-none">
                {perfect ? '⭐' : '·'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Streak flame badge — appears at 3+ first-try streak */
function StreakBadge({ streak }) {
  if (streak < 3) return null;
  const scale = Math.min(1 + (streak - 3) * 0.08, 1.6);
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-orange-600/60 backdrop-blur-sm
                 rounded-full px-4 py-1.5 border-2 border-orange-400/40 shadow-lg
                 transition-all duration-300"
      style={{ transform: `scale(${scale})`, animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      <span className="text-xl animate-bounce" style={{ animationDuration: '0.5s' }}>🔥</span>
      <span className="text-lg font-heading text-orange-100">{streak}x</span>
    </div>
  );
}

/** Single emoji card in the 2×2 grid */
function ItemCard({ emoji, index, state, onTap, hinting, entranceDelay }) {
  const cardRef = useRef(null);

  const handleTap = useCallback((e) => {
    if (state !== 'idle' && state !== 'wrong') return;
    const rect = e.currentTarget.getBoundingClientRect();
    onTap(index, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [index, onTap, state]);

  // State-dependent classes
  let stateClasses = '';
  let stateStyle = {};

  switch (state) {
    case 'correct':
      stateClasses = 'ring-4 ring-amber-400 shadow-xl shadow-amber-400/50';
      stateStyle = { transform: 'scale(1.15)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' };
      break;
    case 'wrong':
      stateClasses = 'animate-wiggle border-red-300/60';
      break;
    case 'match-glow':
      stateClasses = 'ring-2 ring-green-400/60 shadow-lg shadow-green-400/30';
      break;
    default:
      stateClasses = 'active:scale-95';
      break;
  }

  return (
    <button
      ref={cardRef}
      onClick={handleTap}
      className={`
        relative w-full aspect-square rounded-3xl
        bg-white/90 border-4 border-white/60
        shadow-lg shadow-amber-900/10
        flex items-center justify-center
        transition-all duration-200
        ${stateClasses}
        ${hinting ? 'ring-2 ring-amber-300/70 animate-pulse' : ''}
      `}
      style={{
        animation: state === 'idle' || state === 'wrong'
          ? `cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${entranceDelay}ms both`
          : undefined,
        ...stateStyle,
      }}
    >
      <span
        className="select-none"
        style={{ fontSize: 'min(20vw, 80px)', lineHeight: 1 }}
      >
        {emoji}
      </span>

      {/* Gold ring on correct card after reveal */}
      {state === 'correct' && (
        <div
          className="absolute inset-0 rounded-3xl border-4 border-amber-400/80"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      )}
    </button>
  );
}

/** Intro overlay — large emoji + bounce-in */
function IntroOverlay({ onStart }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6"
      onClick={onStart}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-200/90 to-orange-100/90 backdrop-blur-sm" />
      <div
        className="relative z-10 text-8xl"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        🔍
      </div>
      <div
        className="relative z-10 text-6xl font-heading text-amber-700 drop-shadow-md"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' }}
      >
        Picks!
      </div>
      <div
        className="relative z-10 mt-8 w-28 h-28 rounded-full bg-amber-400 shadow-xl shadow-amber-500/40
                   flex items-center justify-center active:scale-90 transition-transform
                   border-4 border-amber-300/60"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both' }}
      >
        <span className="text-5xl">▶️</span>
      </div>
    </div>
  );
}

/** End-of-game score card overlay */
function ScoreOverlay({ perfectCount, bestScore, onReplay }) {
  const isNewBest = perfectCount > bestScore;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-200/95 to-orange-100/95 backdrop-blur-md" />

      {/* Stars row */}
      <div
        className="relative z-10 flex gap-2"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {Array.from({ length: Math.min(perfectCount, 10) }, (_, i) => (
          <span
            key={i}
            className="text-4xl"
            style={{
              animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animationDelay: `${300 + i * 120}ms`,
              animationFillMode: 'both',
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Score number */}
      <div
        className="relative z-10 mt-2"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' }}
      >
        <span className="text-8xl font-heading text-amber-600 drop-shadow-lg">
          {perfectCount}
        </span>
        <span className="text-4xl font-heading text-amber-500 ml-1">/10</span>
      </div>

      {/* New best badge */}
      {isNewBest && (
        <div
          className="relative z-10 bg-amber-400/80 rounded-full px-6 py-2 border-2 border-amber-300/60 shadow-lg"
          style={{ animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both' }}
        >
          <span className="text-2xl font-heading text-white drop-shadow">✨ New Best! ✨</span>
        </div>
      )}

      {/* Replay button */}
      <button
        onClick={onReplay}
        className="relative z-10 mt-6 w-28 h-28 rounded-full bg-amber-400 shadow-xl shadow-amber-500/40
                   flex items-center justify-center active:scale-90 transition-transform
                   border-4 border-amber-300/60"
        style={{ animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both' }}
      >
        <span className="text-5xl">🔄</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GAME COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function OddOnePicks() {
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  // Game state
  const [phase, setPhase] = useState('intro'); // intro | playing | correct | complete
  const [session, setSession] = useState(() => buildSession().map(shuffleOddPosition));
  const [roundIndex, setRoundIndex] = useState(0);
  const [cardStates, setCardStates] = useState([null, null, null, null]); // null | 'idle' | 'correct' | 'wrong' | 'match-glow'
  const [wrongCount, setWrongCount] = useState(0);
  const [results, setResults] = useState([]); // true = first-try, false = needed retries
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem(BEST_SCORE_KEY)) || 0; } catch { return 0; }
  });

  const advanceTimerRef = useRef(null);
  const currentRound = session[roundIndex] || session[0];

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Reset cards to idle when round changes in playing phase
  useEffect(() => {
    if (phase === 'playing') {
      setCardStates(['idle', 'idle', 'idle', 'idle']);
      setWrongCount(0);
    }
  }, [roundIndex, phase]);

  /** Start the game from intro */
  const startGame = useCallback(() => {
    playBoing();
    setPhase('playing');
    setRoundIndex(0);
    setResults([]);
    setStreak(0);
    setSession(buildSession().map(shuffleOddPosition));
    setCardStates(['idle', 'idle', 'idle', 'idle']);
    setWrongCount(0);
  }, []);

  /** Handle tapping a card */
  const handleCardTap = useCallback((index, position) => {
    if (phase !== 'playing') return;
    playPop();

    const isOdd = index === currentRound.oddIndex;

    if (isOdd) {
      // ── CORRECT! ──
      const firstTry = wrongCount === 0;

      // Update card states: odd = correct, others = match-glow
      setCardStates(prev => prev.map((_, i) => i === index ? 'correct' : 'match-glow'));
      setPhase('correct');

      // Particle burst from the tapped card
      burst(position.x, position.y, {
        count: 16,
        colors: ['#facc15', '#f59e0b', '#fbbf24', '#fff'],
        shapes: ['star', 'circle'],
        spread: 100,
        duration: 800,
      });

      if (firstTry) {
        playSparkle();
        setStreak(s => s + 1);
        setResults(prev => [...prev, true]);
      } else {
        playSuccess();
        setStreak(0);
        setResults(prev => [...prev, false]);
      }

      // Arthur peek every 3rd correct in a row
      const newStreak = firstTry ? streak + 1 : 0;
      if (newStreak > 0 && newStreak % 3 === 0) {
        peek('excited');
      }

      // Auto-advance after delay
      advanceTimerRef.current = setTimeout(() => {
        const nextRound = roundIndex + 1;
        if (nextRound >= TOTAL_ROUNDS) {
          // Game complete — compute score and save best
          const finalResults = [...results, firstTry];
          const perfectCount = finalResults.filter(Boolean).length;
          const prevBest = bestScore;
          if (perfectCount > prevBest) {
            setBestScore(perfectCount);
            try { localStorage.setItem(BEST_SCORE_KEY, String(perfectCount)); } catch {}
          }
          celebrate();
          setTimeout(() => setPhase('complete'), 200);
        } else {
          playBoing();
          setRoundIndex(nextRound);
          setPhase('playing');
        }
      }, 1800);

    } else {
      // ── WRONG ──
      playError();
      setCardStates(prev => prev.map((s, i) => i === index ? 'wrong' : s));
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      // Reset the wrong card back to idle after shake animation
      setTimeout(() => {
        setCardStates(prev => prev.map((s, i) => i === index && s === 'wrong' ? 'idle' : s));
      }, 450);
    }
  }, [phase, currentRound, wrongCount, roundIndex, results, streak, bestScore, burst, peek, celebrate]);

  /** Whether to show a hint glow on the odd item */
  const hintingIndex = wrongCount >= 2 ? currentRound.oddIndex : -1;

  /** Replay after game-over */
  const handleReplay = useCallback(() => {
    playBoing();
    setPhase('intro');
  }, []);

  /** Compute final score for ScoreOverlay */
  const perfectCount = useMemo(() => results.filter(Boolean).length, [results]);

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(170deg, #FFF5E6 0%, #FFE8CC 40%, #FFDAB3 70%, #FFD0A0 100%)',
        }}
      />

      {/* Soft decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F5B041 0%, transparent 70%)', top: '-5%', right: '-8%' }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #87CEEB 0%, transparent 70%)', bottom: '10%', left: '-5%' }}
        />
        <div
          className="absolute w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', top: '30%', left: '80%' }}
        />
      </div>

      {/* Back button */}
      <BackButton />

      {/* Streak badge */}
      <StreakBadge streak={streak} />

      {/* Progress bar — visible during playing & correct phases */}
      {(phase === 'playing' || phase === 'correct') && (
        <div className="fixed top-4 left-0 right-0 z-40 flex justify-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-full px-4 py-1 border border-white/30 shadow-md">
            <ProgressBar current={roundIndex} results={results} />
          </div>
        </div>
      )}

      {/* Round counter badge */}
      {(phase === 'playing' || phase === 'correct') && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-40
                     bg-amber-500/70 backdrop-blur-sm rounded-full px-5 py-1
                     border border-amber-400/40 shadow-md"
        >
          <span className="text-lg font-heading text-white drop-shadow">
            {roundIndex + 1} / {TOTAL_ROUNDS}
          </span>
        </div>
      )}

      {/* ── Main 2×2 Grid ── */}
      {(phase === 'playing' || phase === 'correct') && (
        <div className="absolute inset-0 flex items-center justify-center pt-16 pb-8 px-6">
          <div
            className="grid grid-cols-2 gap-4 w-full max-w-md"
            style={{ maxHeight: '75vh' }}
          >
            {currentRound.items.map((emoji, i) => (
              <ItemCard
                key={`${roundIndex}-${i}`}
                emoji={emoji}
                index={i}
                state={cardStates[i] || 'idle'}
                onTap={handleCardTap}
                hinting={hintingIndex === i}
                entranceDelay={i * 100}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── INTRO OVERLAY ── */}
      {phase === 'intro' && <IntroOverlay onStart={startGame} />}

      {/* ── COMPLETE OVERLAY ── */}
      {phase === 'complete' && (
        <ScoreOverlay
          perfectCount={perfectCount}
          bestScore={bestScore}
          onReplay={handleReplay}
        />
      )}

      {/* Overlay layers */}
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      {/* ── Inline keyframes for card entrance ── */}
      <style>{`
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-8deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.08) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
