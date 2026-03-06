import { useState, useEffect, useCallback, useRef } from 'react';
import { getImage, blobToUrl } from '../../../lib/imageCache';
import { VERSION, ANIMAL_NAMES } from '../storyData';
import { playShoo, playTone } from '../../../hooks/useSound';

const TARGET_SHOOS = 8;
const SPAWN_INTERVAL = 1500;

const EDGES = ['left', 'right', 'top', 'bottom'];

function randomEdge() {
  const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
  let x, y;
  switch (edge) {
    case 'left':   x = -10; y = 20 + Math.random() * 50; break;
    case 'right':  x = 100; y = 20 + Math.random() * 50; break;
    case 'top':    x = 15 + Math.random() * 70; y = -10; break;
    case 'bottom': x = 15 + Math.random() * 70; y = 100; break;
  }
  // Target position (where the animal drifts toward)
  const targetX = 20 + Math.random() * 60;
  const targetY = 25 + Math.random() * 40;
  return { startX: x, startY: y, targetX, targetY };
}

export default function ShooAnimals({ onComplete, burst }) {
  const [animals, setAnimals] = useState([]);
  const [shooed, setShooed] = useState(0);
  const [spriteUrls, setSpriteUrls] = useState({});
  const spawnCount = useRef(0);
  const completed = useRef(false);

  // Load all animal sprite URLs
  useEffect(() => {
    const urls = {};
    Promise.all(
      ANIMAL_NAMES.map(async name => {
        const blob = await getImage(`${VERSION}-animal-${name}`);
        if (blob) urls[name] = blobToUrl(blob);
      })
    ).then(() => setSpriteUrls(urls));
  }, []);

  // Spawn animals on interval
  useEffect(() => {
    if (completed.current) return;
    const interval = setInterval(() => {
      if (spawnCount.current >= TARGET_SHOOS) {
        clearInterval(interval);
        return;
      }
      const idx = spawnCount.current;
      const name = ANIMAL_NAMES[idx % ANIMAL_NAMES.length];
      const pos = randomEdge();
      setAnimals(prev => [...prev, {
        id: idx,
        name,
        ...pos,
        shooed: false,
      }]);
      spawnCount.current++;
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [spriteUrls]);

  const handleShoo = useCallback((id) => {
    playShoo();
    const freq = 400 + ((shooed + 1) / TARGET_SHOOS) * 500;
    playTone(freq, 0.12, 'sine');

    setAnimals(prev => prev.map(a => a.id === id ? { ...a, shooed: true } : a));

    const next = shooed + 1;
    setShooed(next);

    if (next >= TARGET_SHOOS && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [shooed, onComplete]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_SHOOS }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < shooed ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Animals */}
      {animals.map(animal => (
        <button
          key={animal.id}
          onClick={() => !animal.shooed && handleShoo(animal.id)}
          className={`absolute w-20 h-20 rounded-2xl overflow-hidden z-20
                     transition-all duration-[2000ms] ease-out
                     ${animal.shooed ? 'animate-ellie-shoo-away pointer-events-none' : 'active:scale-90'}`}
          style={{
            left: animal.shooed ? undefined : `${animal.targetX}%`,
            top: animal.shooed ? undefined : `${animal.targetY}%`,
            transform: 'translate(-50%, -50%)',
            '--drift-x': `${animal.startX - animal.targetX}vw`,
            '--drift-y': `${animal.startY - animal.targetY}vh`,
          }}
        >
          {spriteUrls[animal.name] ? (
            <img
              src={spriteUrls[animal.name]}
              alt={animal.name}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-4xl">🐾</span>
          )}
        </button>
      ))}

      {/* Hint */}
      {shooed === 0 && animals.length > 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Shoo the animals away!
          </span>
        </div>
      )}
    </div>
  );
}
