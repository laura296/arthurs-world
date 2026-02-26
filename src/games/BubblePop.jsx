import { useState, useEffect, useCallback } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess } from '../hooks/useSound';

const COLORS = ['#38bdf8', '#facc15', '#ec4899', '#22c55e', '#a78bfa', '#fb923c'];

function makeBubble(id, w, h) {
  const size = 50 + Math.random() * 50;
  return {
    id,
    x: size / 2 + Math.random() * (w - size),
    y: h + size,
    size,
    speed: 0.5 + Math.random() * 1.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobblePhase: Math.random() * Math.PI * 2,
  };
}

export default function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(0);

  // Spawn bubbles
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const initial = Array.from({ length: 8 }, (_, i) => {
      const b = makeBubble(i, w, h);
      b.y = Math.random() * h;
      return b;
    });
    setBubbles(initial);
    setNextId(8);
  }, []);

  // Animation loop
  useEffect(() => {
    let raf;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setBubbles(prev => {
        let id = nextId;
        const updated = prev
          .map(b => ({
            ...b,
            y: b.y - b.speed,
            x: b.x + Math.sin(Date.now() * 0.002 + b.wobblePhase) * 0.5,
          }))
          .filter(b => b.y + b.size > 0);

        // Respawn
        while (updated.length < 8) {
          updated.push(makeBubble(id++, w, h));
        }
        if (id !== nextId) setNextId(id);
        return updated;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [nextId]);

  const pop = useCallback((e, bubbleId) => {
    e.preventDefault();
    playPop();
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setScore(s => {
      const next = s + 1;
      if (next % 10 === 0) playSuccess();
      return next;
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-night overflow-hidden">
      <BackButton />

      {/* Score */}
      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                      text-2xl font-heading text-sun">
        ⭐ {score}
      </div>

      {/* Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          onPointerDown={(e) => pop(e, b.id)}
          className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100"
          style={{
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 35% 35%, white, ${b.color})`,
            boxShadow: `0 0 ${b.size / 3}px ${b.color}80`,
          }}
        />
      ))}
    </div>
  );
}
