import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';

const HONEY_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

function makeHoneyDrop(id, w) {
  const rand = Math.random();
  let type = 'honey';
  if (rand > 0.9) type = 'golden-honey';
  else if (rand > 0.78) type = 'bee';

  return {
    id,
    type,
    x: 30 + Math.random() * (w - 60),
    y: -50,
    size: type === 'bee' ? 40 : 35 + Math.random() * 25,
    speed: type === 'bee' ? 1.5 + Math.random() * 1 : 1 + Math.random() * 1.5,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.02,
    rotation: 0,
  };
}

function HoneyDropEl({ drop, onCatch }) {
  const emoji = {
    honey: '🍯',
    'golden-honey': '⭐',
    bee: '🐝',
  }[drop.type];

  const wobble = Math.sin(Date.now() * drop.wobbleSpeed + drop.wobblePhase) * 15;

  return (
    <div
      onPointerDown={(e) => onCatch(e, drop)}
      className="absolute cursor-pointer active:scale-125 transition-transform duration-100 select-none"
      style={{
        left: drop.x + wobble - drop.size / 2,
        top: drop.y - drop.size / 2,
        fontSize: drop.size,
        transform: `rotate(${drop.type === 'bee' ? Math.sin(Date.now() * 0.01) * 15 : 0}deg)`,
        filter: drop.type === 'golden-honey' ? 'drop-shadow(0 0 8px #fbbf24)' : 'none',
      }}
    >
      {emoji}
    </div>
  );
}

export default function HoneyHunt() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const nextIdRef = useRef(0);
  const [drops, setDrops] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [dims, setDims] = useState({ w: 400, h: 600 });
  const [gameOver, setGameOver] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Spawn drops
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDrops((prev) => {
        if (prev.length >= 12) return prev;
        const drop = makeHoneyDrop(nextIdRef.current++, dims.w);
        return [...prev, drop];
      });
    }, 800);
    return () => clearInterval(interval);
  }, [dims.w, gameOver]);

  // Animate drops falling
  useEffect(() => {
    if (gameOver) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      setDrops((prev) => {
        const updated = [];
        let lostLife = false;
        for (const d of prev) {
          const newY = d.y + d.speed;
          if (newY > dims.h + 50) {
            // Missed a honey drop (but bees leaving is fine)
            if (d.type !== 'bee') {
              lostLife = true;
            }
          } else {
            updated.push({ ...d, y: newY });
          }
        }
        if (lostLife) {
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) setGameOver(true);
            return Math.max(0, newLives);
          });
        }
        return updated;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [dims.h, gameOver]);

  const handleCatch = useCallback((e, drop) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();

    if (drop.type === 'bee') {
      // Bees are bad! Lose a life
      playBuzz();
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return Math.max(0, newLives);
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: ['#ef4444', '#f97316'] });
    } else {
      const points = drop.type === 'golden-honey' ? 3 : 1;
      playPop();
      setScore((s) => {
        const newScore = s + points;
        if (newScore % 10 === 0) playSuccess();
        return newScore;
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: HONEY_COLORS });
    }

    setDrops((prev) => prev.filter((d) => d.id !== drop.id));
  }, [burst]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setLives(5);
    setDrops([]);
    setGameOver(false);
    nextIdRef.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{
        background: 'linear-gradient(to bottom, #86efac, #22c55e, #15803d, #166534)',
      }}
    >
      <BackButton />
      <ParticleLayer />

      {/* Trees background */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 text-green-800/30 select-none"
          style={{
            left: `${i * 18 + Math.random() * 10}%`,
            fontSize: `${80 + Math.random() * 40}px`,
          }}
        >
          🌳
        </div>
      ))}

      {/* Score & Lives */}
      <div className="absolute top-4 right-4 z-20 flex gap-3">
        <div className="bg-amber-800/60 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🍯</span>
          <span className="text-xl font-heading text-white">{score}</span>
        </div>
        <div className="bg-red-800/60 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-16 z-20">
        <span className="text-lg font-heading text-amber-900 drop-shadow">Honey Hunt</span>
      </div>

      {/* Pooh at the bottom with pot */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-6xl select-none animate-float">
        🧸
      </div>

      {/* Hint */}
      {score === 0 && !gameOver && (
        <div className="absolute bottom-20 left-0 right-0 z-20 text-center animate-pulse">
          <span className="text-amber-900/60 text-sm font-heading">
            Catch the honey! 🍯 Avoid the bees! 🐝
          </span>
        </div>
      )}

      {/* Drops */}
      {!gameOver &&
        drops.map((d) => (
          <HoneyDropEl key={d.id} drop={d} onCatch={handleCatch} />
        ))}

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-amber-100 rounded-3xl p-8 text-center shadow-2xl max-w-xs mx-4 animate-spring-in">
            <div className="text-5xl mb-3">🍯</div>
            <h2 className="text-2xl font-heading text-amber-800 mb-2">Oh Bother!</h2>
            <p className="text-amber-700 mb-1">You collected</p>
            <p className="text-4xl font-heading text-amber-600 mb-4">{score} honey</p>
            <button
              onClick={handleRestart}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading text-lg
                         px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Try Again! 🐻
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
