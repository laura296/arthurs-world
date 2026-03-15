import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import UnderwaterScene from '../components/scenes/UnderwaterScene';
import Shark from '../components/animals/Shark';
import SeaCreature, { FISH_VARIANT_NAMES, VARIANT_COLORS } from '../components/animals/SeaCreatures';
import { playPop, playSuccess, playBoing, playTone, playChomp } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const COLORS = ['#38bdf8', '#facc15', '#ec4899', '#22c55e', '#a78bfa', '#fb923c'];

// Bubble types: normal, golden (2x points), rainbow (3x + sparkle)
function makeBubble(id, w, h) {
  const size = 50 + Math.random() * 50;
  const rand = Math.random();
  let type = 'normal';
  if (rand > 0.92) type = 'rainbow';
  else if (rand > 0.80) type = 'golden';

  return {
    id,
    kind: 'bubble',
    x: size / 2 + Math.random() * (w - size),
    y: h + size,
    size,
    speed: 0.5 + Math.random() * 1.5,
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
    tapCount: 0,
    wiggling: false,
    spinning: false,
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
    tapCount: 0,
    popping: false,
  };
}

function BubbleElement({ b, onPop }) {
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
  const scale = fish.spinning ? 1.5 : fish.wiggling ? 1.2 : 1;
  const rotate = fish.spinning ? 720 : fish.wiggling ? 'var(--wiggle)' : 0;
  return (
    <button
      onPointerDown={(e) => onTap(e, fish)}
      className={`absolute cursor-pointer ${fish.tapped ? 'opacity-0' : ''} ${fish.wiggling && !fish.spinning ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
      style={{
        left: fish.x - fish.size / 2,
        top: fish.y - fish.size / 2,
        width: fish.size,
        height: fish.size,
        transform: `${flipped ? 'scaleX(-1)' : ''} scale(${scale}) ${fish.spinning ? 'rotate(720deg) translateY(-60px)' : ''}`,
        transition: fish.spinning ? 'transform 0.5s ease-in, opacity 0.5s ease-in' : fish.wiggling ? 'transform 0.2s ease' : 'transform 0.1s',
        filter: `drop-shadow(0 0 ${fish.wiggling ? 12 : 8}px ${fish.color}${fish.wiggling ? '' : '80'})`,
        zIndex: 15,
        opacity: fish.tapped ? 0 : 1,
      }}
    >
      <SeaCreature variant={fish.variant} size={fish.size} />
      {fish.wiggling && !fish.spinning && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg animate-bounce">❗</span>
      )}
    </button>
  );
}

function SharkElement({ shark: s, onTap }) {
  const flipped = s.speed < 0;
  // Each tap inflates the shark; on 3rd tap it pops
  const scale = 1 + (s.tapCount || 0) * 0.4;
  return (
    <div
      onPointerDown={onTap}
      className={`absolute cursor-pointer transition-transform duration-200 ${s.popping ? 'animate-ping opacity-0' : ''}`}
      style={{
        left: s.x - 80,
        top: s.y - 80,
        zIndex: 20,
        transform: `${flipped ? 'scaleX(-1)' : ''} scale(${scale}) translateY(${Math.sin(Date.now() * 0.003) * 4}px)`,
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

const GOAL = 50;

function ProgressBar({ score }) {
  const pct = Math.min(score / GOAL, 1) * 100;
  const milestones = [0.25, 0.5, 0.75, 1];

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1"
         style={{ height: '60vh' }}>
      {/* Goal icon */}
      <div className={`text-2xl transition-transform duration-300 ${pct >= 100 ? 'scale-125 animate-bounce' : ''}`}>
        🏆
      </div>

      {/* Bar track */}
      <div className="relative w-5 flex-1 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30">
        {/* Fill — grows from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ease-out"
          style={{
            height: `${pct}%`,
            background: pct >= 100
              ? 'linear-gradient(to top, #facc15, #f59e0b, #fbbf24)'
              : 'linear-gradient(to top, #38bdf8, #818cf8, #c084fc)',
            boxShadow: pct >= 100
              ? '0 0 12px #facc1580'
              : '0 0 8px #818cf880',
          }}
        />

        {/* Milestone markers */}
        {milestones.map(m => (
          <div
            key={m}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ bottom: `${m * 100}%`, transform: 'translateY(50%)' }}
          >
            <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
              score >= GOAL * m
                ? 'bg-sun border-sun shadow-[0_0_6px_#facc15]'
                : 'bg-white/30 border-white/40'
            }`} />
          </div>
        ))}
      </div>

      {/* Score label */}
      <div className="text-xs font-heading text-white/80 mt-1">
        {Math.min(score, GOAL)}/{GOAL}
      </div>
    </div>
  );
}

function WinConfetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 8 + Math.random() * 12,
    color: ['#facc15', '#ec4899', '#38bdf8', '#22c55e', '#a78bfa', '#fb923c'][i % 6],
    shape: i % 3 === 0 ? '⭐' : i % 3 === 1 ? '🫧' : '✨',
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[101]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: -20,
            fontSize: p.size,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  );
}

function WinScreen({ score, onPlayAgain, burst }) {
  useEffect(() => {
    // Big celebration bursts
    const w = window.innerWidth;
    const h = window.innerHeight;
    burst(w / 2, h / 2 - 50, {
      count: 20, spread: 100,
      colors: ['#facc15', '#ec4899', '#38bdf8', '#22c55e', '#a78bfa'],
      shapes: ['star', 'heart', 'circle'],
    });
    setTimeout(() => {
      burst(w * 0.3, h * 0.4, { count: 12, spread: 60, colors: ['#facc15', '#fb923c'], shapes: ['star'] });
      burst(w * 0.7, h * 0.4, { count: 12, spread: 60, colors: ['#ec4899', '#a78bfa'], shapes: ['heart'] });
    }, 400);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-ocean/80 backdrop-blur-md animate-fadeIn">
      <WinConfetti />
      {/* Radiating rings */}
      <div className="absolute" style={{ top: '30%' }}>
        {[0, 0.3, 0.6].map((d, i) => (
          <div key={i} className="absolute w-32 h-32 rounded-full border-4 border-sun/40 -translate-x-1/2 -translate-y-1/2"
               style={{ animation: `radiateRing 2s ${d}s ease-out infinite` }} />
        ))}
      </div>
      <div className="text-7xl mb-4" style={{ animation: 'celebrationText 0.6s ease-out both' }}>🏆</div>
      <h2 className="font-heading text-5xl text-sun mb-3 drop-shadow-lg"
          style={{ animation: 'celebrationText 0.6s 0.2s ease-out both' }}>
        You did it!
      </h2>
      <div className="flex gap-2 items-center mb-2" style={{ animation: 'gentleIn 0.5s 0.5s ease-out both' }}>
        {['⭐', '🌟', '⭐'].map((s, i) => (
          <span key={i} className="text-3xl" style={{ animation: `celebrateStar 1s ${0.8 + i * 0.2}s ease-out infinite` }}>{s}</span>
        ))}
      </div>
      <p className="text-2xl text-white/90 font-heading mb-1"
         style={{ animation: 'gentleIn 0.5s 0.6s ease-out both' }}>
        {score} points!
      </p>
      <p className="text-white/60 mb-8 text-base" style={{ animation: 'gentleIn 0.5s 0.8s ease-out both' }}>
        Amazing bubble popper! 🎉
      </p>
      <button
        onPointerDown={onPlayAgain}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white
                   font-heading text-2xl shadow-lg active:scale-95 transition-transform"
        style={{ animation: 'springIn 0.5s 1s ease-out both' }}
      >
        Play Again 🫧
      </button>
    </div>
  );
}

// Score popup that floats up
function ScorePopup({ x, y, points }) {
  return (
    <div
      className="absolute pointer-events-none z-50 font-heading text-2xl drop-shadow-lg animate-bounce text-sun"
      style={{ left: x, top: y - 20 }}
    >
      +{points}
    </div>
  );
}

export default function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [fish, setFish] = useState([]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
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
    } else {
      playPop();
    }

    const effectId = nextEffectId.current++;
    setEffects(prev => [...prev, {
      id: effectId,
      x: bubble.x,
      y: bubble.y,
      color: bubble.color,
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
      // Win condition
      if (next >= GOAL && s < GOAL) {
        playSuccess();
        peek('excited');
        setTimeout(() => setWon(true), 600);
      }
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setWon(false);
    lastMilestone.current = 0;
    setBubbles([]);
    setFish([]);
    setShark(null);
    setEffects([]);
    setPopups([]);
    // Re-seed bubbles
    const w = window.innerWidth;
    const h = window.innerHeight;
    const initial = Array.from({ length: 8 }, () => {
      const b = makeBubble(nextId.current++, w, h);
      b.y = Math.random() * h;
      return b;
    });
    setBubbles(initial);
  }, []);

  const tapShark = useCallback((e) => {
    e.preventDefault();
    setShark(prev => {
      if (!prev || prev.popping) return prev;
      const newTaps = (prev.tapCount || 0) + 1;
      if (newTaps >= 3) {
        // Pop! Play sound, show burst, award points
        playPop();
        playSuccess();
        burst(prev.x, prev.y, {
          count: 16, spread: 80,
          colors: ['#38bdf8', '#64748b', '#94a3b8', '#e2e8f0'],
          shapes: ['star', 'circle'],
        });
        const effectId = nextEffectId.current++;
        setEffects(p => [...p, { id: effectId, x: prev.x, y: prev.y, color: '#64748b', type: 'spiky' }]);
        setPopups(p => [...p, { id: effectId, x: prev.x, y: prev.y - 30, points: 10 }]);
        setScore(s => s + 10);
        // Mark popping, then remove after animation
        setTimeout(() => setShark(null), 400);
        return { ...prev, tapCount: newTaps, popping: true, speed: 0 };
      }
      // Inflate — play boing, freeze in place
      playBoing();
      return { ...prev, tapCount: newTaps, speed: 0 };
    });
  }, []);

  const tapFish = useCallback((e, f) => {
    e.preventDefault();
    const taps = (f.tapCount || 0) + 1;

    if (taps === 1) {
      // First tap: fish stops and wiggles, waiting for second tap
      playBoing();
      playTone(523, 0.15);
      setFish(prev => prev.map(fi =>
        fi.id === f.id ? { ...fi, tapCount: 1, wiggling: true, speed: 0 } : fi
      ));
      // Small reward for catching it
      const effectId = nextEffectId.current++;
      setPopups(prev => [...prev, { id: effectId, x: f.x, y: f.y - 30, points: 2 }]);
      setScore(s => s + 2);
    } else {
      // Second tap: fish spins and zooms off — big reward!
      playSuccess();
      playTone(659, 0.15);
      burst(f.x, f.y, { count: 12, spread: 50, colors: [f.color, '#facc15', '#ec4899'], shapes: ['star', 'heart'] });

      const effectId = nextEffectId.current++;
      setEffects(prev => [...prev, { id: effectId, x: f.x, y: f.y, color: f.color, type: 'fish' }]);
      setPopups(prev => [...prev, { id: effectId, x: f.x, y: f.y - 30, points: 8 }]);

      setFish(prev => prev.map(fi =>
        fi.id === f.id ? { ...fi, tapCount: 2, spinning: true } : fi
      ));
      setScore(s => s + 8);
      // Remove after spin animation
      setTimeout(() => {
        setFish(prev => prev.map(fi =>
          fi.id === f.id ? { ...fi, tapped: true } : fi
        ));
      }, 500);
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <UnderwaterScene />
      <BackButton />

      {/* Progress bar */}
      <ProgressBar score={score} />

      {/* Shark */}
      {shark && <SharkElement shark={shark} onTap={tapShark} />}

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

      {/* Win screen */}
      {won && <WinScreen score={score} onPlayAgain={resetGame} burst={burst} />}
    </div>
  );
}
