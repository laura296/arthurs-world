import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import GardenScene from '../components/scenes/GardenScene';
import DifficultyPicker from './pop-critters/DifficultyPicker';
import GameHole from './pop-critters/GameHole';
import { DIFFICULTIES, ANIMAL_POINTS, GRID } from './pop-critters/difficultyConfig';
import { playPop, playSuccess, playBoing } from '../hooks/useSound';

let nextId = 0;

function randomAnimal(difficulty) {
  const pool = difficulty.animals;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomVisibleTime(difficulty) {
  const { min, max } = difficulty.visibleTime;
  return min + Math.random() * (max - min);
}

export default function PopCritters() {
  const [phase, setPhase] = useState('pick'); // 'pick' | 'playing'
  const [diffKey, setDiffKey] = useState(null);
  const [critters, setCritters] = useState([]); // [{ id, type, holeIndex, visible, tapped, spawnTime }]
  const [score, setScore] = useState(0);
  const timersRef = useRef([]);

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

        // Pick a free hole
        const usedHoles = new Set(prev.filter(c => c.visible).map(c => c.holeIndex));
        const freeHoles = Array.from({ length: GRID.total }, (_, i) => i).filter(i => !usedHoles.has(i));
        if (freeHoles.length === 0) return prev;

        const holeIndex = freeHoles[Math.floor(Math.random() * freeHoles.length)];
        const id = ++nextId;
        const type = randomAnimal(difficulty);
        const visTime = randomVisibleTime(difficulty);

        // Schedule auto-hide
        const timer = setTimeout(() => {
          setCritters(p => p.map(c => c.id === id ? { ...c, visible: false } : c));
        }, visTime + difficulty.riseSpeed); // add rise time
        timersRef.current.push(timer);

        // Fox movement — in Wild mode, fox slides to an adjacent hole after ~1s
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

    spawn(); // spawn first immediately
    const iv = setInterval(spawn, difficulty.spawnInterval);
    return () => clearInterval(iv);
  }, [phase, difficulty]);

  const tap = useCallback((critterId) => {
    setCritters(prev => {
      const critter = prev.find(c => c.id === critterId);
      if (!critter || critter.tapped || !critter.visible) return prev;

      playPop();
      const points = ANIMAL_POINTS[critter.type] || 1;
      // Use functional setScore to avoid stale closure
      setScore(s => {
        const next = s + points;
        if (next % 5 === 0) playSuccess();
        return next;
      });

      return prev.map(c =>
        c.id === critterId ? { ...c, tapped: true, visible: false } : c
      );
    });
  }, []);

  const startGame = useCallback((key) => {
    setDiffKey(key);
    setScore(0);
    setCritters([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('playing');
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

      {/* Score badge */}
      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                      text-2xl font-heading text-sun">
        {score}
      </div>

      {/* Game grid — 3x3 holes overlaid on the scene */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div
          className="grid gap-3 sm:gap-5"
          style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)` }}
        >
          {Array.from({ length: GRID.total }, (_, i) => {
            const critter = critters.find(c => c.holeIndex === i && c.visible);
            return (
              <GameHole
                key={i}
                critter={critter || null}
                riseSpeed={difficulty.riseSpeed}
                onTap={tap}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
