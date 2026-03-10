import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playSparkle, playSuccess, playBoing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';

const SPARKLE_COLORS = ['#f0abfc', '#fbbf24', '#60a5fa', '#34d399', '#c084fc', '#f472b6'];
const WAND_SHAPES = ['star', 'heart', 'diamond', 'circle'];

function makeSparkle(x, y) {
  const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
  const size = 6 + Math.random() * 14;
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    size,
    color,
    opacity: 1,
    rotation: Math.random() * 360,
    shape: WAND_SHAPES[Math.floor(Math.random() * WAND_SHAPES.length)],
    vx: (Math.random() - 0.5) * 2,
    vy: -1 - Math.random() * 2,
    life: 1,
  };
}

function SparkleParticle({ s }) {
  const shapeEl = {
    star: '★',
    heart: '♥',
    diamond: '◆',
    circle: '●',
  }[s.shape];

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: s.x,
        top: s.y,
        fontSize: s.size,
        color: s.color,
        opacity: s.opacity,
        transform: `rotate(${s.rotation}deg) scale(${s.life})`,
        textShadow: `0 0 ${s.size / 2}px ${s.color}`,
        transition: 'none',
      }}
    >
      {shapeEl}
    </div>
  );
}

/** Targets that appear for the child to tap with the wand */
function makeTarget(w, h) {
  const shapes = ['🦋', '🌟', '🐸', '🎀', '🌸', '🦄', '👑', '🪄', '💎', '🌙'];
  return {
    id: Date.now() + Math.random(),
    emoji: shapes[Math.floor(Math.random() * shapes.length)],
    x: 40 + Math.random() * (w - 80),
    y: 80 + Math.random() * (h - 200),
    size: 50 + Math.random() * 20,
    opacity: 1,
    scale: 0,
    popping: false,
  };
}

export default function FairyDust() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [dims, setDims] = useState({ w: 400, h: 600 });
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

  // Spawn targets
  useEffect(() => {
    const initial = Array.from({ length: 5 }, () => makeTarget(dims.w, dims.h));
    // Stagger entrance
    initial.forEach((t, i) => {
      setTimeout(() => {
        setTargets((prev) => [...prev, { ...t, scale: 1 }]);
      }, i * 300);
    });

    const interval = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 8) return prev;
        const t = makeTarget(dims.w, dims.h);
        return [...prev, { ...t, scale: 1 }];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [dims.w, dims.h]);

  // Animate sparkles
  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      setSparkles((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            life: s.life - 0.02,
            opacity: s.life,
            rotation: s.rotation + 3,
          }))
          .filter((s) => s.life > 0)
      );
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Draw sparkle trail on pointer move
  const handlePointerMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Add 2-3 sparkles per move event
    const newSparkles = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () =>
      makeSparkle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20)
    );
    setSparkles((prev) => [...prev.slice(-120), ...newSparkles]);
  }, []);

  const handleTargetTap = useCallback((e, target) => {
    e.stopPropagation();
    playSparkle();
    setScore((s) => s + 1);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      burst(e.clientX - rect.left, e.clientY - rect.top, { colors: SPARKLE_COLORS });
    }

    // Remove target with animation
    setTargets((prev) =>
      prev.map((t) => (t.id === target.id ? { ...t, popping: true, scale: 1.5, opacity: 0 } : t))
    );
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
    }, 400);

    if ((score + 1) % 10 === 0) {
      playSuccess();
    }
  }, [score, burst]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{
        background: 'linear-gradient(to bottom, #1e1b4b, #312e81, #4c1d95)',
        cursor: 'url("data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27><text y=%2724%27 font-size=%2724%27>🪄</text></svg>") 4 28, auto',
      }}
      onPointerMove={handlePointerMove}
    >
      <BackButton />
      <ParticleLayer />

      {/* Twinkling background stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'white',
            opacity: 0.3 + Math.random() * 0.5,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Score */}
      <div className="absolute top-4 right-4 z-20 bg-purple-900/60 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <span className="text-xl font-heading text-white">{score}</span>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-16 z-20">
        <span className="text-lg font-heading text-purple-200 drop-shadow">Fairy Dust</span>
      </div>

      {/* Hint */}
      {score === 0 && (
        <div className="absolute bottom-24 left-0 right-0 z-20 text-center animate-pulse">
          <span className="text-white/60 text-sm font-heading">
            Wave your wand & tap the magic things! 🪄
          </span>
        </div>
      )}

      {/* Targets */}
      {targets.map((t) => (
        <div
          key={t.id}
          onPointerDown={(e) => !t.popping && handleTargetTap(e, t)}
          className="absolute cursor-pointer transition-all duration-300"
          style={{
            left: t.x - t.size / 2,
            top: t.y - t.size / 2,
            fontSize: t.size,
            transform: `scale(${t.scale})`,
            opacity: t.opacity,
            filter: 'drop-shadow(0 0 8px rgba(240, 171, 252, 0.6))',
          }}
        >
          {t.emoji}
        </div>
      ))}

      {/* Sparkle trail */}
      {sparkles.map((s) => (
        <SparkleParticle key={s.id} s={s} />
      ))}
    </div>
  );
}
