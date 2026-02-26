import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing } from '../hooks/useSound';

const CRITTERS = ['🐹', '🐰', '🐸', '🦊', '🐻', '🐼', '🐨', '🐯'];

function randomCritter(id, cols, rows) {
  return {
    id,
    emoji: CRITTERS[Math.floor(Math.random() * CRITTERS.length)],
    col: Math.floor(Math.random() * cols),
    row: Math.floor(Math.random() * rows),
    visible: true,
    popping: false,
  };
}

export default function PopCritters() {
  const [critters, setCritters] = useState([]);
  const [score, setScore] = useState(0);
  const nextId = useRef(0);
  const cols = 3;
  const rows = 4;

  // Spawn critters periodically
  useEffect(() => {
    const spawn = () => {
      const c = randomCritter(nextId.current++, cols, rows);
      setCritters(prev => [...prev.filter(cr => cr.visible), c].slice(-6));
    };
    spawn();
    const iv = setInterval(spawn, 1200);
    return () => clearInterval(iv);
  }, []);

  // Auto-hide after 2.5s
  useEffect(() => {
    const iv = setInterval(() => {
      setCritters(prev => prev.map(c =>
        Date.now() - (c.spawnTime || 0) > 2500 ? { ...c, visible: false } : c
      ));
    }, 500);
    return () => clearInterval(iv);
  }, []);

  const tap = useCallback((critterId) => {
    playPop();
    setCritters(prev => prev.map(c =>
      c.id === critterId ? { ...c, visible: false, popping: true } : c
    ));
    setScore(s => {
      const next = s + 1;
      if (next % 5 === 0) playSuccess();
      return next;
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-amber-600 to-orange-900 overflow-hidden">
      <BackButton />

      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                      text-2xl font-heading text-sun">
        ⭐ {score}
      </div>

      {/* Grid of holes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="grid gap-4 p-6"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {Array.from({ length: cols * rows }, (_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const critter = critters.find(c => c.col === col && c.row === row && c.visible);

            return (
              <div
                key={i}
                className="w-24 h-24 rounded-full bg-amber-900/50 flex items-center justify-center relative"
              >
                {critter && (
                  <button
                    onClick={() => tap(critter.id)}
                    className="text-5xl animate-bounce-in active:scale-75 transition-transform"
                  >
                    {critter.emoji}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
