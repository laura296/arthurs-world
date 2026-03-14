import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import GardenScene from '../components/scenes/GardenScene';
import DifficultyPicker from './pop-critters/DifficultyPicker';
import GameHole from './pop-critters/GameHole';
import { DIFFICULTIES, ANIMAL_POINTS, GRID } from './pop-critters/difficultyConfig';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

let nextId = 0;

function randomAnimal(difficulty) {
  const pool = difficulty.animals;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomVisibleTime(difficulty) {
  const { min, max } = difficulty.visibleTime;
  return min + Math.random() * (max - min);
}

/* ── Streak flame badge ── */
function StreakBadge({ streak }) {
  if (streak < 3) return null;
  const scale = Math.min(1 + (streak - 3) * 0.08, 1.6);
  return (
    <div
      className="fixed top-16 right-4 z-50 flex items-center gap-1 bg-orange-600/60 backdrop-blur-sm
                 rounded-full px-4 py-1.5 border-2 border-orange-400/40 shadow-lg
                 transition-all duration-300"
      style={{ transform: `scale(${scale})` }}
    >
      <span className="text-xl animate-bounce" style={{ animationDuration: '0.5s' }}>🔥</span>
      <span className="text-lg font-heading text-orange-100">{streak}x</span>
    </div>
  );
}

/* ── Score badge with star icon and pop animation ── */
function ScoreBadge({ score, justScored }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 bg-amber-900/50 backdrop-blur-sm
                  rounded-full px-5 py-2 border-2 border-amber-500/40 shadow-lg shadow-amber-900/30
                  transition-transform duration-200
                  ${justScored ? 'scale-110' : 'scale-100'}`}
    >
      <span className="text-xl">⭐</span>
      <span className="text-2xl font-heading text-sun">{score}</span>
    </div>
  );
}

/* ── Dirt poof particles when critter ducks ── */
function DirtPoof({ x, y }) {
  return (
    <div className="fixed pointer-events-none z-[80]" style={{ left: x - 20, top: y - 10 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI + Math.random() * 0.5;
        const dist = 8 + Math.random() * 12;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-700/60"
            style={{
              animation: 'petal-fall 0.5s ease-out forwards',
              animationDelay: `${i * 30}ms`,
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ difficulty, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['🐿️', '🦔', '🐰', '🐭'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex gap-4 mb-6">
        {emojis.map((e, i) => (
          <span
            key={i}
            className="text-5xl"
            style={{
              animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
              animationDelay: `${i * 150}ms`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg animate-pulse">
        {difficulty.emoji} {difficulty.label}
      </h2>
      <p className="text-lg font-heading text-amber-200 mt-2 opacity-80">
        Tap the critters!
      </p>
    </div>
  );
}

export default function PopCritters() {
  const [phase, setPhase] = useState('pick'); // 'pick' | 'intro' | 'playing'
  const [diffKey, setDiffKey] = useState(null);
  const [critters, setCritters] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [justScored, setJustScored] = useState(false);
  const [poofs, setPoofs] = useState([]);
  const timersRef = useRef([]);
  const scoreRef = useRef(0); // track score for milestone checks outside React batching

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const difficulty = diffKey ? DIFFICULTIES[diffKey] : null;

  // Clean up all timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Spawn loop
  useEffect(() => {
    if (phase !== 'playing' || !difficulty) return;

    const spawn = () => {
      setCritters(prev => {
        const visibleCount = prev.filter(c => c.visible && !c.tapped).length;
        if (visibleCount >= difficulty.maxVisible) return prev;

        const usedHoles = new Set(prev.filter(c => c.visible).map(c => c.holeIndex));
        const freeHoles = Array.from({ length: GRID.total }, (_, i) => i).filter(i => !usedHoles.has(i));
        if (freeHoles.length === 0) return prev;

        const holeIndex = freeHoles[Math.floor(Math.random() * freeHoles.length)];
        const id = ++nextId;
        const type = randomAnimal(difficulty);
        const visTime = randomVisibleTime(difficulty);

        // Schedule auto-hide with dirt poof
        const timer = setTimeout(() => {
          setCritters(p => {
            const c = p.find(cr => cr.id === id && cr.visible && !cr.tapped);
            if (c) {
              // Reset streak on miss
              setStreak(0);
            }
            return p.map(cr => cr.id === id ? { ...cr, visible: false } : cr);
          });
        }, visTime + difficulty.riseSpeed);
        timersRef.current.push(timer);

        // Fox movement
        if (type === 'fox' && difficulty.foxMoves) {
          const moveTimer = setTimeout(() => {
            setCritters(p => {
              const fox = p.find(c => c.id === id && c.visible && !c.tapped);
              if (!fox) return p;

              const { cols } = GRID;
              const row = Math.floor(fox.holeIndex / cols);
              const col = fox.holeIndex % cols;
              const adjacent = [];
              if (col > 0) adjacent.push(fox.holeIndex - 1);
              if (col < cols - 1) adjacent.push(fox.holeIndex + 1);
              if (row > 0) adjacent.push(fox.holeIndex - cols);
              if (row < GRID.rows - 1) adjacent.push(fox.holeIndex + cols);

              const usedHolesNow = new Set(p.filter(c => c.visible && c.id !== id).map(c => c.holeIndex));
              const freeAdjacent = adjacent.filter(h => !usedHolesNow.has(h));
              if (freeAdjacent.length === 0) return p;

              const newHole = freeAdjacent[Math.floor(Math.random() * freeAdjacent.length)];
              return p.map(c => c.id === id ? { ...c, holeIndex: newHole } : c);
            });
          }, 800 + Math.random() * 400);
          timersRef.current.push(moveTimer);
        }

        return [...prev.filter(c => c.visible || Date.now() - c.spawnTime < 2000), {
          id, type, holeIndex, visible: true, tapped: false, spawnTime: Date.now(),
        }];
      });
    };

    spawn();
    const iv = setInterval(spawn, difficulty.spawnInterval);
    return () => clearInterval(iv);
  }, [phase, difficulty]);

  const tap = useCallback((critterId, e) => {
    setCritters(prev => {
      const critter = prev.find(c => c.id === critterId);
      if (!critter || critter.tapped || !critter.visible) return prev;

      playPop();
      const points = ANIMAL_POINTS[critter.type] || 1;

      // Particle burst at tap position
      if (e?.clientX) {
        const colors = critter.type === 'fox'
          ? ['#f97316', '#ef4444', '#fbbf24']
          : ['#facc15', '#22c55e', '#38bdf8', '#ec4899'];
        burst(e.clientX, e.clientY, {
          count: 8 + points * 3,
          spread: 40,
          colors,
          shapes: ['star', 'circle', 'diamond'],
        });
      }

      // Update streak
      setStreak(s => {
        const next = s + 1;
        if (next === 5) playSparkle();
        if (next === 10) playFanfare();
        return next;
      });

      // Score with milestone checks
      setScore(s => {
        const next = s + points;
        scoreRef.current = next;

        // Score pop animation
        setJustScored(true);
        setTimeout(() => setJustScored(false), 200);

        // Milestone: ArthurPeek every 5 points
        if (next % 5 === 0) {
          playSuccess();
          peek(next % 10 === 0 ? 'excited' : 'happy');
        }

        // Big celebration every 15 points
        if (next % 15 === 0) {
          setTimeout(() => {
            celebrate({
              message: next >= 30 ? 'Amazing!' : 'Hooray!',
              colors: ['#facc15', '#22c55e', '#38bdf8', '#ec4899'],
            });
          }, 300);
        }

        return next;
      });

      return prev.map(c =>
        c.id === critterId ? { ...c, tapped: true, visible: false } : c
      );
    });
  }, [burst, peek, celebrate]);

  const startGame = useCallback((key) => {
    setDiffKey(key);
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    setCritters([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('intro');
    playBoing();
  }, []);

  if (phase === 'pick') {
    return (
      <>
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <BackButton />

      {/* Intro overlay */}
      {phase === 'intro' && difficulty && (
        <IntroOverlay
          difficulty={difficulty}
          onDone={() => setPhase('playing')}
        />
      )}

      {/* Score badge */}
      <ScoreBadge score={score} justScored={justScored} />

      {/* Streak badge */}
      <StreakBadge streak={streak} />

      {/* Difficulty label */}
      <div className="fixed top-4 left-16 z-50 bg-amber-900/40 backdrop-blur-sm rounded-full px-4 py-2
                      text-lg font-heading text-amber-200 border-2 border-amber-600/30">
        {difficulty?.emoji} {difficulty?.label}
      </div>

      {/* Game grid */}
      <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-12 md:items-center md:pb-0 md:pt-20">
        <div
          className="grid gap-2 sm:gap-4 md:gap-5"
          style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)` }}
        >
          {Array.from({ length: GRID.total }, (_, i) => {
            const critter = critters.find(c => c.holeIndex === i && c.visible);
            return (
              <GameHole
                key={i}
                critter={critter || null}
                riseSpeed={difficulty?.riseSpeed || 400}
                onTap={tap}
              />
            );
          })}
        </div>
      </div>

      {/* Dirt poofs */}
      {poofs.map(p => <DirtPoof key={p.id} x={p.x} y={p.y} />)}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
