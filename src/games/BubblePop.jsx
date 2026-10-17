import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import UnderwaterScene from '../components/scenes/UnderwaterScene';
import Shark from '../components/animals/Shark';
import SeaCreature, { FISH_VARIANT_NAMES, VARIANT_COLORS } from '../components/animals/SeaCreatures';
import { playPop, playSuccess, playBoing, playTone, playChomp, playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useLevelProgression } from '../hooks/useLevelProgression';

const COLORS = ['#38bdf8', '#facc15', '#ec4899', '#22c55e', '#a78bfa', '#fb923c'];

/* ── Level definitions: each level teaches something ── */
const LEVELS = [
  { id: 1, label: '🔢', name: 'Numbers 1-5',    type: 'numbers', items: ['1','2','3','4','5'], goal: 30, speed: 0.6, bubbleCount: 6, sharkChance: 0 },
  { id: 2, label: '🔢', name: 'Numbers 1-10',   type: 'numbers', items: ['1','2','3','4','5','6','7','8','9','10'], goal: 40, speed: 0.7, bubbleCount: 7, sharkChance: 0 },
  { id: 3, label: '🔤', name: 'Letters A-F',     type: 'letters', items: ['A','B','C','D','E','F'], goal: 30, speed: 0.6, bubbleCount: 6, sharkChance: 0 },
  { id: 4, label: '🔤', name: 'Letters G-L',     type: 'letters', items: ['G','H','I','J','K','L'], goal: 35, speed: 0.7, bubbleCount: 7, sharkChance: 0 },
  { id: 5, label: '🎨', name: 'Colours',         type: 'colours', items: ['🔴','🟠','🟡','🟢','🔵','🟣'], targetColours: ['#ef4444','#f97316','#facc15','#22c55e','#3b82f6','#a855f7'], goal: 35, speed: 0.7, bubbleCount: 7, sharkChance: 0 },
  { id: 6, label: '⭐', name: 'Shapes',          type: 'shapes', items: ['⭐','❤️','🔷','🔶','⬟','●'], goal: 35, speed: 0.8, bubbleCount: 7, sharkChance: 0.02 },
  { id: 7, label: '🔤', name: 'Letters M-R',     type: 'letters', items: ['M','N','O','P','Q','R'], goal: 40, speed: 0.8, bubbleCount: 8, sharkChance: 0.02 },
  { id: 8, label: '🔤', name: 'Letters S-Z',     type: 'letters', items: ['S','T','U','V','W','X','Y','Z'], goal: 45, speed: 0.9, bubbleCount: 8, sharkChance: 0.03 },
  { id: 9, label: '🐾', name: 'Animals',         type: 'animals', items: ['🐶','🐱','🐰','🐻','🐸','🐵','🐷','🦁'], goal: 45, speed: 0.9, bubbleCount: 8, sharkChance: 0.03 },
  { id: 10, label: '🍎', name: 'Fruit',          type: 'fruit', items: ['🍎','🍊','🍋','🍇','🍓','🍌','🫐','🍑'], goal: 45, speed: 0.9, bubbleCount: 8, sharkChance: 0.03 },
  { id: 11, label: '🔢', name: 'Count to 20',    type: 'sequence', items: Array.from({length:20},(_,i)=>String(i+1)), goal: 50, speed: 1.0, bubbleCount: 10, sharkChance: 0.04 },
  { id: 12, label: '🏆', name: 'All Together!',  type: 'mixed', items: ['A','B','C','1','2','3','🍎','🐶','⭐','❤️'], goal: 60, speed: 1.1, bubbleCount: 10, sharkChance: 0.05 },
];

const LEVEL_LABELS = LEVELS.map(l => l.label);

/* ── Bubble factory with learning content ── */
function makeBubble(id, w, h, level) {
  const size = 55 + Math.random() * 45;
  const rand = Math.random();
  let type = 'normal';
  if (rand > 0.92) type = 'rainbow';
  else if (rand > 0.80) type = 'golden';

  // Pick content from level items
  const content = level.items[Math.floor(Math.random() * level.items.length)];

  // For sequence levels, sometimes show the "target" number
  let isTarget = false;
  if (level.type === 'sequence' && rand > 0.6) {
    isTarget = true;
  }

  // Colour for colour-type levels
  let bubbleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  if (level.type === 'colours' && level.targetColours) {
    const idx = level.items.indexOf(content);
    if (idx >= 0) bubbleColor = level.targetColours[idx];
  }

  return {
    id,
    kind: 'bubble',
    x: size / 2 + Math.random() * (w - size),
    y: h + size,
    size,
    speed: 0.4 + Math.random() * level.speed,
    color: type === 'normal' ? bubbleColor : null,
    wobblePhase: Math.random() * Math.PI * 2,
    type,
    content,
    isTarget,
    spawnTime: Date.now(),
  };
}

function makeFish(id, w, h) {
  const size = 50 + Math.random() * 30;
  const fromLeft = Math.random() > 0.5;
  const variant = FISH_VARIANT_NAMES[Math.floor(Math.random() * FISH_VARIANT_NAMES.length)];
  return {
    id, kind: 'fish',
    x: fromLeft ? -size : w + size,
    y: 100 + Math.random() * (h - 250),
    size, speed: (0.8 + Math.random() * 1.2) * (fromLeft ? 1 : -1),
    variant, color: VARIANT_COLORS[variant],
    wobblePhase: Math.random() * Math.PI * 2,
    tapped: false, tapCount: 0, wiggling: false, spinning: false,
  };
}

function makeShark(w, h) {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -180 : w + 180,
    y: 80 + Math.random() * (h - 300),
    speed: (0.6 + Math.random() * 0.4) * (fromLeft ? 1 : -1),
    wobblePhase: Math.random() * Math.PI * 2,
    eatenCount: 0, maxEat: 2 + Math.floor(Math.random() * 2),
    tapCount: 0, popping: false,
  };
}

/* ── Bubble element with learning content ── */
function BubbleElement({ b, onPop }) {
  const contentStyle = {
    fontSize: b.size * (b.content && b.content.length > 1 ? 0.3 : 0.4),
    lineHeight: 1,
  };

  if (b.type === 'rainbow') {
    const hue = (Date.now() * 0.15 + b.id * 60) % 360;
    return (
      <div onPointerDown={(e) => onPop(e, b)}
        className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100 animate-pulse"
        style={{
          left: b.x - b.size / 2, top: b.y - b.size / 2, width: b.size, height: b.size,
          background: `radial-gradient(circle at 35% 35%, white, hsl(${hue}, 80%, 60%))`,
          boxShadow: `0 0 ${b.size / 2}px hsl(${hue}, 80%, 60%), 0 0 ${b.size}px hsl(${hue}, 80%, 60%)50`,
          border: '2px solid rgba(255,255,255,0.6)',
        }}>
        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-lg font-heading"
              style={contentStyle}>
          {b.content}
        </span>
      </div>
    );
  }

  if (b.type === 'golden') {
    return (
      <div onPointerDown={(e) => onPop(e, b)}
        className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100"
        style={{
          left: b.x - b.size / 2, top: b.y - b.size / 2, width: b.size, height: b.size,
          background: 'radial-gradient(circle at 35% 35%, #fffbe6, #fbbf24, #d97706)',
          boxShadow: `0 0 ${b.size / 2}px #fbbf2480, 0 0 ${b.size / 3}px #fbbf24`,
          border: '2px solid rgba(255,215,0,0.7)',
        }}>
        <span className="absolute inset-0 flex items-center justify-center drop-shadow font-heading"
              style={contentStyle}>
          {b.content}
        </span>
      </div>
    );
  }

  return (
    <div onPointerDown={(e) => onPop(e, b)}
      className="absolute rounded-full cursor-pointer active:scale-0 transition-transform duration-100"
      style={{
        left: b.x - b.size / 2, top: b.y - b.size / 2, width: b.size, height: b.size,
        background: `radial-gradient(circle at 35% 35%, white, ${b.color})`,
        boxShadow: `0 0 ${b.size / 3}px ${b.color}80`,
      }}>
      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow font-heading"
            style={contentStyle}>
        {b.content}
      </span>
    </div>
  );
}

function FishElement({ fish, onTap }) {
  const flipped = fish.speed < 0;
  const scale = fish.spinning ? 1.5 : fish.wiggling ? 1.2 : 1;
  return (
    <button
      onPointerDown={(e) => onTap(e, fish)}
      className={`absolute cursor-pointer ${fish.tapped ? 'opacity-0' : ''} ${fish.wiggling && !fish.spinning ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
      style={{
        left: fish.x - fish.size / 2, top: fish.y - fish.size / 2, width: fish.size, height: fish.size,
        transform: `${flipped ? 'scaleX(-1)' : ''} scale(${scale}) ${fish.spinning ? 'rotate(720deg) translateY(-60px)' : ''}`,
        transition: fish.spinning ? 'transform 0.5s ease-in, opacity 0.5s ease-in' : fish.wiggling ? 'transform 0.2s ease' : 'transform 0.1s',
        filter: `drop-shadow(0 0 ${fish.wiggling ? 12 : 8}px ${fish.color}${fish.wiggling ? '' : '80'})`,
        zIndex: 15, opacity: fish.tapped ? 0 : 1,
      }}>
      <SeaCreature variant={fish.variant} size={fish.size} />
      {fish.wiggling && !fish.spinning && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg animate-bounce">❗</span>
      )}
    </button>
  );
}

function SharkElement({ shark: s, onTap }) {
  const flipped = s.speed < 0;
  const scale = 1 + (s.tapCount || 0) * 0.4;
  return (
    <div onPointerDown={onTap}
      className={`absolute cursor-pointer transition-transform duration-200 ${s.popping ? 'animate-ping opacity-0' : ''}`}
      style={{
        left: s.x - 80, top: s.y - 80, zIndex: 20,
        transform: `${flipped ? 'scaleX(-1)' : ''} scale(${scale}) translateY(${Math.sin(Date.now() * 0.003) * 4}px)`,
      }}>
      <Shark size={160} />
    </div>
  );
}

function PopEffect({ x, y, color, type }) {
  return (
    <div className="absolute pointer-events-none z-50 animate-ping" style={{ left: x, top: y }}>
      {type === 'rainbow' && <span className="text-3xl">🌟</span>}
      {type === 'golden' && <span className="text-2xl">✨</span>}
      {type === 'fish' && <span className="text-2xl">💫</span>}
      {type === 'spiky' && <span className="text-2xl">💥</span>}
      {type === 'chomp' && <span className="text-3xl">😋</span>}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            backgroundColor: type === 'rainbow' ? `hsl(${i * 60}, 80%, 60%)` : (color || '#fff'),
            transform: `translate(${Math.cos(i * 60 * Math.PI / 180) * 20}px, ${Math.sin(i * 60 * Math.PI / 180) * 20}px)`,
          }} />
      ))}
    </div>
  );
}

function ProgressBar({ score, goal }) {
  const pct = Math.min(score / goal, 1) * 100;
  const milestones = [0.25, 0.5, 0.75, 1];

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1"
         style={{ height: '60vh' }}>
      <div className={`text-2xl transition-transform duration-300 ${pct >= 100 ? 'scale-125 animate-bounce' : ''}`}>🏆</div>
      <div className="relative w-5 flex-1 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30">
        <div className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ease-out"
          style={{
            height: `${pct}%`,
            background: pct >= 100
              ? 'linear-gradient(to top, #facc15, #f59e0b, #fbbf24)'
              : 'linear-gradient(to top, #38bdf8, #818cf8, #c084fc)',
            boxShadow: pct >= 100 ? '0 0 12px #facc1580' : '0 0 8px #818cf880',
          }} />
        {milestones.map(m => (
          <div key={m} className="absolute left-0 right-0 flex items-center justify-center"
            style={{ bottom: `${m * 100}%`, transform: 'translateY(50%)' }}>
            <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
              score >= goal * m ? 'bg-sun border-sun shadow-[0_0_6px_#facc15]' : 'bg-white/30 border-white/40'
            }`} />
          </div>
        ))}
      </div>
      <div className="text-xs font-heading text-white/80 mt-1">{Math.min(score, goal)}/{goal}</div>
    </div>
  );
}

function WinConfetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 1.5,
    size: 8 + Math.random() * 12,
    color: ['#facc15', '#ec4899', '#38bdf8', '#22c55e', '#a78bfa', '#fb923c'][i % 6],
    shape: i % 3 === 0 ? '⭐' : i % 3 === 1 ? '🫧' : '✨',
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[101]">
      {pieces.map(p => (
        <div key={p.id} className="absolute"
          style={{ left: `${p.left}%`, top: -20, fontSize: p.size,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both` }}>
          {p.shape}
        </div>
      ))}
    </div>
  );
}

function WinScreen({ score, onPlayAgain, onNextLevel, hasNextLevel, starsEarned, burst }) {
  useEffect(() => {
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

      {/* Stars earned */}
      <div className="flex gap-2 items-center mb-2" style={{ animation: 'gentleIn 0.5s 0.5s ease-out both' }}>
        {[1, 2, 3].map((s, i) => (
          <svg key={i} width={44} height={44} viewBox="0 0 22 22"
            style={{ animation: `celebrateStar 1s ${0.8 + i * 0.2}s ease-out infinite` }}>
            <polygon
              points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
              fill={s <= starsEarned ? '#eab308' : '#4a5568'}
              stroke={s <= starsEarned ? '#ca8a04' : '#2d3748'}
              strokeWidth={1}
            />
          </svg>
        ))}
      </div>

      <p className="text-2xl text-white/90 font-heading mb-1"
         style={{ animation: 'gentleIn 0.5s 0.6s ease-out both' }}>
        {score} points!
      </p>

      <div className="flex gap-3 mt-4" style={{ animation: 'springIn 0.5s 1s ease-out both' }}>
        <button onPointerDown={onPlayAgain}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white
                     font-heading text-xl shadow-lg active:scale-95 transition-transform">
          🔄
        </button>
        {hasNextLevel && (
          <button onPointerDown={onNextLevel}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white
                       font-heading text-xl shadow-lg active:scale-95 transition-transform">
            ▶️
          </button>
        )}
      </div>
    </div>
  );
}

function ScorePopup({ x, y, points }) {
  return (
    <div className="absolute pointer-events-none z-50 font-heading text-2xl drop-shadow-lg animate-bounce text-sun"
      style={{ left: x, top: y - 20 }}>
      +{points}
    </div>
  );
}

/* ── Game level component ── */
function BubblePopLevel({ level, onComplete, onBack }) {
  const [bubbles, setBubbles] = useState([]);
  const [fish, setFish] = useState([]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [effects, setEffects] = useState([]);
  const [popups, setPopups] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const nextId = useRef(0);
  const nextFishId = useRef(0);
  const nextEffectId = useRef(0);
  const [shark, setShark] = useState(null);
  const sharkEatCount = useRef(0);
  const lastMilestone = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const GOAL = level.goal;

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const initial = Array.from({ length: level.bubbleCount }, () => {
      const b = makeBubble(nextId.current++, w, h, level);
      b.y = Math.random() * h;
      return b;
    });
    setBubbles(initial);
  }, [level]);

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

  // Spawn shark based on level config
  useEffect(() => {
    if (level.sharkChance <= 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const spawnShark = () => {
      if (Math.random() > level.sharkChance * 10) return;
      setShark(prev => {
        if (prev) return prev;
        sharkEatCount.current = 0;
        return makeShark(w, h);
      });
    };
    const firstTimer = setTimeout(spawnShark, 10000);
    const interval = setInterval(spawnShark, 8000 + Math.random() * 4000);
    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, [level]);

  // Animation loop
  useEffect(() => {
    let raf;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      setBubbles(prev => {
        const updated = prev
          .map(b => ({
            ...b,
            y: b.y - b.speed,
            x: b.x + Math.sin(Date.now() * 0.002 + b.wobblePhase) * 0.5,
          }))
          .filter(b => b.y + b.size > 0);
        while (updated.length < level.bubbleCount) {
          updated.push(makeBubble(nextId.current++, w, h, level));
        }
        return updated;
      });

      setFish(prev =>
        prev.map(f => ({
          ...f,
          x: f.x + f.speed,
          y: f.y + Math.sin(Date.now() * 0.003 + f.wobblePhase) * 0.4,
        })).filter(f => {
          if (f.tapped) return false;
          return f.speed > 0 ? f.x - f.size < w + 50 : f.x + f.size > -50;
        })
      );

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
  }, [level]);

  // Shark eats bubbles
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
        if (Math.sqrt(dx * dx + dy * dy) < CHOMP_RADIUS) {
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
    const points = bubble.type === 'rainbow' ? 3 : bubble.type === 'golden' ? 2 : 1;

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
    setEffects(prev => [...prev, { id: effectId, x: bubble.x, y: bubble.y, color: bubble.color, type: bubble.type }]);
    setPopups(prev => [...prev, { id: effectId, x: bubble.x, y: bubble.y - 30, points }]);
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    setScore(s => {
      const next = Math.max(0, s + points);
      const milestone = Math.floor(next / 25);
      if (milestone > lastMilestone.current && next > 0) {
        lastMilestone.current = milestone;
        playSuccess();
        peek('excited');
      }
      if (next >= GOAL && s < GOAL) {
        playSuccess();
        peek('excited');
        setTimeout(() => setWon(true), 600);
      }
      return next;
    });
  }, [GOAL, burst, peek]);

  const handlePlayAgain = useCallback(() => {
    setScore(0);
    setWon(false);
    setMistakes(0);
    lastMilestone.current = 0;
    setBubbles([]);
    setFish([]);
    setShark(null);
    setEffects([]);
    setPopups([]);
    const w = window.innerWidth;
    const h = window.innerHeight;
    setBubbles(Array.from({ length: level.bubbleCount }, () => {
      const b = makeBubble(nextId.current++, w, h, level);
      b.y = Math.random() * h;
      return b;
    }));
  }, [level]);

  const starsEarned = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;

  const handleWin = useCallback(() => {
    onComplete(starsEarned);
  }, [onComplete, starsEarned]);

  const tapShark = useCallback((e) => {
    e.preventDefault();
    setShark(prev => {
      if (!prev || prev.popping) return prev;
      const newTaps = (prev.tapCount || 0) + 1;
      if (newTaps >= 3) {
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
        setTimeout(() => setShark(null), 400);
        return { ...prev, tapCount: newTaps, popping: true, speed: 0 };
      }
      playBoing();
      return { ...prev, tapCount: newTaps, speed: 0 };
    });
  }, [burst]);

  const tapFish = useCallback((e, f) => {
    e.preventDefault();
    const taps = (f.tapCount || 0) + 1;
    if (taps === 1) {
      playBoing();
      playTone(523, 0.15);
      setFish(prev => prev.map(fi =>
        fi.id === f.id ? { ...fi, tapCount: 1, wiggling: true, speed: 0 } : fi
      ));
      const effectId = nextEffectId.current++;
      setPopups(prev => [...prev, { id: effectId, x: f.x, y: f.y - 30, points: 2 }]);
      setScore(s => s + 2);
    } else {
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
      setTimeout(() => {
        setFish(prev => prev.map(fi =>
          fi.id === f.id ? { ...fi, tapped: true } : fi
        ));
      }, 500);
    }
  }, [burst]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <UnderwaterScene />

      {/* Back to level select */}
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Level indicator */}
      <div className="fixed top-4 left-20 z-50 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-white text-sm border border-white/20">
        {level.label} Level {level.id}
      </div>

      <ProgressBar score={score} goal={GOAL} />
      {shark && <SharkElement shark={shark} onTap={tapShark} />}
      {fish.map(f => <FishElement key={f.id} fish={f} onTap={tapFish} />)}
      {bubbles.map(b => <BubbleElement key={b.id} b={b} onPop={popBubble} />)}
      {effects.map(eff => <PopEffect key={eff.id} x={eff.x} y={eff.y} color={eff.color} type={eff.type} />)}
      {popups.map(p => <ScorePopup key={p.id} x={p.x} y={p.y} points={p.points} />)}

      <ParticleLayer />
      <ArthurPeekLayer />

      {won && <WinScreen score={score} onPlayAgain={handlePlayAgain} onNextLevel={handleWin}
                         hasNextLevel={level.id < LEVELS.length} starsEarned={starsEarned} burst={burst} />}
    </div>
  );
}

/* ── Main export with level selection ── */
export default function BubblePop() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('bubble-pop', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    // completeLevel handles advancing to next level internally;
    // if this was the last level, go back to level select
    if (currentLevel >= totalLevels) {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🫧 Bubble Pop"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const level = LEVELS[currentLevel - 1];
  return (
    <BubblePopLevel
      key={currentLevel}
      level={level}
      onComplete={handleComplete}
      onBack={backToLevels}
    />
  );
}
