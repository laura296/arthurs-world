import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import UnderwaterScene from '../components/scenes/UnderwaterScene';
import Shark from '../components/animals/Shark';
import SeaCreature, { FISH_VARIANT_NAMES, VARIANT_COLORS } from '../components/animals/SeaCreatures';
import { playPop, playSuccess, playBoing, playTone, playBuzz, playChomp } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const COLORS = ['#38bdf8', '#facc15', '#ec4899', '#22c55e', '#a78bfa', '#fb923c'];

// Bubble types: normal, golden (2x points), rainbow (3x + sparkle)
function makeBubble(id, w, h) {
  const size = 50 + Math.random() * 50;
  const rand = Math.random();
  let type = 'normal';
  if (rand > 0.92) type = 'rainbow';
  else if (rand > 0.82) type = 'golden';
  else if (rand > 0.70) type = 'spiky';

  return {
    id,
    kind: 'bubble',
    x: size / 2 + Math.random() * (w - size),
    y: h + size,
    size: type === 'spiky' ? 45 + Math.random() * 35 : size,
    speed: type === 'spiky' ? 0.3 + Math.random() * 1.0 : 0.5 + Math.random() * 1.5,
    color: type === 'normal' ? COLORS[Math.floor(Math.random() * COLORS.length)] : null,
    wobblePhase: Math.random() * Math.PI * 2,
    type,
    spawnTime: Date.now(),
  };
}

function makeFish(id, w, h) {
  const size = 50 + Math.random() * 30;
  const fromLeft = Math.random() > 0.5;
  const variant = FISH_VARIANT_NAMES[Math.floor(Math.random() * FISH_VARIANT_NAMES.length)];
  return {
    id,
    kind: 'fish',
    x: fromLeft ? -size : w + size,
    y: 100 + Math.random() * (h - 250),
    size,
    speed: (0.8 + Math.random() * 1.2) * (fromLeft ? 1 : -1),
    variant,
    color: VARIANT_COLORS[variant],
    wobblePhase: Math.random() * Math.PI * 2,
    tapped: false,
  };
}

function makeShark(w, h) {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -180 : w + 180,
    y: 80 + Math.random() * (h - 300),
    speed: (0.6 + Math.random() * 0.4) * (fromLeft ? 1 : -1),
    wobblePhase: Math.random() * Math.PI * 2,
    eatenCount: 0,
    maxEat: 2 + Math.floor(Math.random() * 2),
  };
}

function BubbleElement({ b, onPop }) {
  if (b.type === 'spiky') {
    const wobble = Math.sin(Date.now() * 0.005 + b.wobblePhase) * 5;
    return (
      <div
        onPointerDown={(e) => onPop(e, b)}
        className="absolute cursor-pointer active:scale-0 transition-transform duration-100"
        style={{
          left: b.x - b.size / 2,
          top: b.y - b.size / 2,
          width: b.size,
          height: b.size,
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #9333ea, #581c87)',
            clipPath: 'polygon(50% 0%, 63% 18%, 82% 8%, 78% 30%, 100% 35%, 85% 50%, 98% 68%, 78% 70%, 82% 92%, 63% 80%, 50% 100%, 37% 80%, 18% 92%, 22% 70%, 2% 68%, 15% 50%, 0% 35%, 22% 30%, 18% 8%, 37% 18%)',
            boxShadow: `0 0 ${b.size / 3}px #7c3aed80`,
            transform: `rotate(${wobble}deg)`,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-white/80 drop-shadow"
                style={{ fontSize: b.size * 0.35 }}>
            &#10007;
          </span>
        </div>
      </div>
    );
  }

  if (b.type === 'rainbow') {
    const hue = (Date.now() * 0.15 + b.id * 60) % 360;
    return (
      <div
        onPointerDown={(e) => onPop(e, b)}
        className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100 animate-pulse"
        style={{
          left: b.x - b.size / 2,
          top: b.y - b.size / 2,
          width: b.size,
          height: b.size,
          background: `radial-gradient(circle at 35% 35%, white, hsl(${hue}, 80%, 60%))`,
          boxShadow: `0 0 ${b.size / 2}px hsl(${hue}, 80%, 60%), 0 0 ${b.size}px hsl(${hue}, 80%, 60%)50`,
          border: '2px solid rgba(255,255,255,0.6)',
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-lg"
              style={{ fontSize: b.size * 0.4 }}>
          ⭐
        </span>
      </div>
    );
  }

  if (b.type === 'golden') {
    return (
      <div
        onPointerDown={(e) => onPop(e, b)}
        className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100"
        style={{
          left: b.x - b.size / 2,
          top: b.y - b.size / 2,
          width: b.size,
          height: b.size,
          background: 'radial-gradient(circle at 35% 35%, #fffbe6, #fbbf24, #d97706)',
          boxShadow: `0 0 ${b.size / 2}px #fbbf2480, 0 0 ${b.size / 3}px #fbbf24`,
          border: '2px solid rgba(255,215,0,0.7)',
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center drop-shadow"
              style={{ fontSize: b.size * 0.35 }}>
          ✨
        </span>
      </div>
    );
  }

  // Normal bubble
  return (
    <div
      onPointerDown={(e) => onPop(e, b)}
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
  );
}

function FishElement({ fish, onTap }) {
  const flipped = fish.speed < 0;
  return (
    <button
      onPointerDown={(e) => onTap(e, fish)}
      className={`absolute cursor-pointer transition-all duration-200 ${fish.tapped ? 'scale-150 opacity-0' : 'active:scale-90'}`}
      style={{
        left: fish.x - fish.size / 2,
        top: fish.y - fish.size / 2,
        width: fish.size,
        height: fish.size,
        transform: flipped ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 0 8px ${fish.color}80)`,
        zIndex: 15,
      }}
    >
      <SeaCreature variant={fish.variant} size={fish.size} />
    </button>
  );
}

function SharkElement({ shark: s }) {
  const flipped = s.speed < 0;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: s.x - 80,
        top: s.y - 80,
        zIndex: 20,
        transform: `${flipped ? 'scaleX(-1)' : ''} translateY(${Math.sin(Date.now() * 0.003) * 4}px)`,
      }}
    >
      <Shark size={160} />
    </div>
  );
}

// Pop effect — little burst particles
function PopEffect({ x, y, color, type }) {
  return (
    <div className="absolute pointer-events-none z-50 animate-ping" style={{ left: x, top: y }}>
      {type === 'rainbow' && (
        <span className="text-3xl">🌟</span>
      )}
      {type === 'golden' && (
        <span className="text-2xl">✨</span>
      )}
      {type === 'fish' && (
        <span className="text-2xl">💫</span>
      )}
      {type === 'spiky' && (
        <span className="text-2xl">💥</span>
      )}
      {type === 'chomp' && (
        <span className="text-3xl">😋</span>
      )}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            backgroundColor: type === 'rainbow' ? `hsl(${i * 60}, 80%, 60%)` : (color || '#fff'),
            transform: `translate(${Math.cos(i * 60 * Math.PI / 180) * 20}px, ${Math.sin(i * 60 * Math.PI / 180) * 20}px)`,
          }}
        />
      ))}
    </div>
  );
}

// Score popup that floats up
function ScorePopup({ x, y, points }) {
  const isNegative = points < 0;
  return (
    <div
      className={`absolute pointer-events-none z-50 font-heading text-2xl drop-shadow-lg animate-bounce ${
        isNegative ? 'text-red-400' : 'text-sun'
      }`}
      style={{ left: x, top: y - 20 }}
    >
      {isNegative ? points : `+${points}`}
    </div>
  );
}

export default function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [fish, setFish] = useState([]);
  const [score, setScore] = useState(0);
  const [effects, setEffects] = useState([]);
  const [popups, setPopups] = useState([]);
  const nextId = useRef(0);
  const nextFishId = useRef(0);
  const nextEffectId = useRef(0);
  const [shark, setShark] = useState(null);
  const sharkEatCount = useRef(0);
  const lastMilestone = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  // Spawn initial bubbles
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const initial = Array.from({ length: 8 }, () => {
      const b = makeBubble(nextId.current++, w, h);
      b.y = Math.random() * h;
      return b;
    });
    setBubbles(initial);
  }, []);

  // Spawn fish periodically
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const interval = setInterval(() => {
      setFish(prev => {
        if (prev.length >= 4) return prev;
        return [...prev, makeFish(nextFishId.current++, w, h)];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Spawn shark periodically
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const spawnShark = () => {
      setShark(prev => {
        if (prev) return prev;
        sharkEatCount.current = 0;
        return makeShark(w, h);
      });
    };
    const firstTimer = setTimeout(spawnShark, 10000);
    const interval = setInterval(spawnShark, 8000 + Math.random() * 4000);
    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, []);

  // Animation loop
  useEffect(() => {
    let raf;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Move bubbles
      setBubbles(prev => {
        const updated = prev
          .map(b => ({
            ...b,
            y: b.y - b.speed,
            x: b.x + Math.sin(Date.now() * 0.002 + b.wobblePhase) * 0.5,
          }))
          .filter(b => b.y + b.size > 0);

        // Respawn to maintain count
        while (updated.length < 8) {
          updated.push(makeBubble(nextId.current++, w, h));
        }
        return updated;
      });

      // Move fish
      setFish(prev =>
        prev
          .map(f => ({
            ...f,
            x: f.x + f.speed,
            y: f.y + Math.sin(Date.now() * 0.003 + f.wobblePhase) * 0.4,
          }))
          .filter(f => {
            if (f.tapped) return false;
            return f.speed > 0 ? f.x - f.size < w + 50 : f.x + f.size > -50;
          })
      );

      // Move shark
      setShark(prev => {
        if (!prev) return null;
        const newX = prev.x + prev.speed;
        const newY = prev.y + Math.sin(Date.now() * 0.002 + prev.wobblePhase) * 0.6;
        if (prev.speed > 0 && newX > w + 200) return null;
        if (prev.speed < 0 && newX < -200) return null;
        return { ...prev, x: newX, y: newY };
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Shark eats nearby bubbles
  useEffect(() => {
    if (!shark) return;
    const CHOMP_RADIUS = 80;
    setBubbles(prev => {
      if (sharkEatCount.current >= (shark.maxEat || 3)) return prev;
      let ate = false;
      const remaining = prev.filter(b => {
        if (ate) return true;
        if (b.type === 'spiky') return true;
        const dx = b.x - shark.x;
        const dy = b.y - shark.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CHOMP_RADIUS) {
          ate = true;
          sharkEatCount.current++;
          playChomp();
          const effectId = nextEffectId.current++;
          setEffects(p => [...p, { id: effectId, x: b.x, y: b.y, color: b.color || '#5a8aaf', type: 'chomp' }]);
          return false;
        }
        return true;
      });
      return remaining;
    });
  }, [shark?.x, shark?.y]);

  // Clean up effects
  useEffect(() => {
    if (effects.length === 0) return;
    const timer = setTimeout(() => setEffects([]), 600);
    return () => clearTimeout(timer);
  }, [effects]);

  useEffect(() => {
    if (popups.length === 0) return;
    const timer = setTimeout(() => setPopups([]), 800);
    return () => clearTimeout(timer);
  }, [popups]);

  const popBubble = useCallback((e, bubble) => {
    e.preventDefault();
    const points = bubble.type === 'rainbow' ? 3
      : bubble.type === 'golden' ? 2
      : bubble.type === 'spiky' ? -1
      : 1;

    if (bubble.type === 'rainbow') {
      playSuccess();
      burst(bubble.x, bubble.y, {
        count: 14, spread: 70,
        colors: ['#facc15', '#ec4899', '#38bdf8', '#22c55e', '#a78bfa'],
        shapes: ['star', 'circle', 'heart'],
      });
    } else if (bubble.type === 'golden') {
      playBoing();
      burst(bubble.x, bubble.y, {
        count: 10, spread: 55,
        colors: ['#fbbf24', '#fef3c7', '#f59e0b'],
        shapes: ['star', 'circle'],
      });
    } else if (bubble.type === 'spiky') {
      playBuzz();
    } else {
      playPop();
    }

    const effectId = nextEffectId.current++;
    setEffects(prev => [...prev, {
      id: effectId,
      x: bubble.x,
      y: bubble.y,
      color: bubble.type === 'spiky' ? '#7c3aed' : bubble.color,
      type: bubble.type,
    }]);
    setPopups(prev => [...prev, { id: effectId, x: bubble.x, y: bubble.y - 30, points }]);

    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    setScore(s => {
      const next = Math.max(0, s + points);
      // Milestone every 25 points
      const milestone = Math.floor(next / 25);
      if (milestone > lastMilestone.current && next > 0) {
        lastMilestone.current = milestone;
        playSuccess();
        peek('excited');
      }
      return next;
    });
  }, []);

  const tapFish = useCallback((e, f) => {
    e.preventDefault();
    playBoing();
    playTone(523, 0.15);
    burst(f.x, f.y, { count: 8, spread: 40, colors: [f.color, '#facc15'], shapes: ['star'] });

    const effectId = nextEffectId.current++;
    setEffects(prev => [...prev, { id: effectId, x: f.x, y: f.y, color: f.color, type: 'fish' }]);
    setPopups(prev => [...prev, { id: effectId, x: f.x, y: f.y - 30, points: 5 }]);

    setFish(prev => prev.map(fi => fi.id === f.id ? { ...fi, tapped: true } : fi));
    setScore(s => s + 5);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <UnderwaterScene />
      <BackButton />

      {/* Score */}
      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                      text-2xl font-heading text-sun">
        ⭐ {score}
      </div>

      {/* Shark */}
      {shark && <SharkElement shark={shark} />}

      {/* Fish */}
      {fish.map(f => (
        <FishElement key={f.id} fish={f} onTap={tapFish} />
      ))}

      {/* Bubbles */}
      {bubbles.map(b => (
        <BubbleElement key={b.id} b={b} onPop={popBubble} />
      ))}

      {/* Pop effects */}
      {effects.map(eff => (
        <PopEffect key={eff.id} x={eff.x} y={eff.y} color={eff.color} type={eff.type} />
      ))}

      {/* Score popups */}
      {popups.map(p => (
        <ScorePopup key={p.id} x={p.x} y={p.y} points={p.points} />
      ))}

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
