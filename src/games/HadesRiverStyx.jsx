import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz, playSparkle } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';

const IMG = '/arthurs-world/images/disney/hades';
const GHOST_COLORS = ['#a78bfa', '#818cf8', '#6366f1', '#c084fc'];
const SKULL_COLORS = ['#e2e8f0', '#cbd5e1', '#94a3b8', '#d4d4d8'];
const FLAME_COLORS = ['#60a5fa', '#818cf8', '#3b82f6', '#6366f1'];

const CREATURES = [
  { type: 'ghost',    img: `${IMG}/ghost.png`,    points: 1, speed: [0.8, 1.6], size: [55, 75], drift: 25, glow: '#a78bfa' },
  { type: 'skeleton', img: `${IMG}/skeleton.png`, points: 2, speed: [0.6, 1.2], size: [50, 65], drift: 12, glow: '#94a3b8' },
  { type: 'bat',      img: `${IMG}/bat.png`,      points: 1, speed: [1.2, 2.0], size: [45, 60], drift: 35, glow: '#7c3aed' },
  { type: 'flame',    img: `${IMG}/flame.png`,     points: 3, speed: [0.5, 1.0], size: [55, 75], drift: 8,  glow: '#60a5fa' },
  { type: 'cerberus', img: `${IMG}/cerberus.png`, points: -1, speed: [1.0, 1.5], size: [60, 75], drift: 10, glow: '#ef4444' },
];

let nextId = 0;

function spawnCreature(w, h) {
  const template = CREATURES[Math.floor(Math.random() * CREATURES.length)];
  const size = template.size[0] + Math.random() * (template.size[1] - template.size[0]);
  const speed = template.speed[0] + Math.random() * (template.speed[1] - template.speed[0]);

  const edge = Math.random();
  let x, y, vx, vy;
  if (edge < 0.35) {
    x = -size; y = 80 + Math.random() * (h - 200); vx = speed; vy = (Math.random() - 0.5) * 0.5;
  } else if (edge < 0.7) {
    x = w + size; y = 80 + Math.random() * (h - 200); vx = -speed; vy = (Math.random() - 0.5) * 0.5;
  } else {
    x = 60 + Math.random() * (w - 120); y = -size; vx = (Math.random() - 0.5) * 0.8; vy = speed;
  }

  return {
    id: nextId++, ...template, x, y, vx, vy, size,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmp: template.drift,
    caught: false, opacity: 1, scale: 1,
  };
}

function CreatureEl({ creature, onCatch }) {
  const wobble = Math.sin(Date.now() * 0.003 + creature.wobblePhase) * creature.wobbleAmp;
  const floatY = creature.type === 'ghost'
    ? Math.sin(Date.now() * 0.005 + creature.wobblePhase) * 8 : 0;

  return (
    <div
      onPointerDown={(e) => !creature.caught && onCatch(e, creature)}
      className="absolute cursor-pointer select-none active:scale-125 transition-transform duration-100"
      style={{
        left: creature.x + wobble - creature.size / 2,
        top: creature.y + floatY - creature.size / 2,
        width: creature.size, height: creature.size,
        opacity: creature.opacity,
        transform: `scale(${creature.scale})`,
        filter: `drop-shadow(0 0 10px ${creature.glow}88)`,
      }}
    >
      <img src={creature.img} alt={creature.type}
           className="w-full h-full object-contain pointer-events-none" draggable={false} />
    </div>
  );
}

export default function HadesRiverStyx() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [creatures, setCreatures] = useState([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [level, setLevel] = useState(1);
  const [dims, setDims] = useState({ w: 400, h: 600 });
  const [gameOver, setGameOver] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();

  const MAX_MISSED = 8;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const spawnRate = Math.max(600, 1400 - level * 120);
    const timer = setInterval(() => {
      setCreatures(prev => {
        if (prev.length >= 10 + level * 2) return prev;
        return [...prev, spawnCreature(dims.w, dims.h)];
      });
    }, spawnRate);
    return () => clearInterval(timer);
  }, [dims.w, dims.h, level, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      setCreatures(prev => {
        const updated = [];
        let lostCount = 0;
        for (const c of prev) {
          if (c.caught) {
            const newOp = c.opacity - 0.05;
            if (newOp > 0) updated.push({ ...c, opacity: newOp, scale: c.scale + 0.03 });
            continue;
          }
          const newX = c.x + c.vx;
          const newY = c.y + c.vy;
          if (newX < -100 || newX > dims.w + 100 || newY > dims.h + 100 || newY < -100) {
            if (c.type !== 'cerberus') lostCount++;
          } else {
            updated.push({ ...c, x: newX, y: newY });
          }
        }
        if (lostCount > 0) {
          setMissed(m => {
            const nm = m + lostCount;
            if (nm >= MAX_MISSED) setGameOver(true);
            return nm;
          });
        }
        return updated;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [dims, gameOver]);

  useEffect(() => {
    const newLevel = Math.floor(caught / 12) + 1;
    if (newLevel > level && newLevel <= 10) {
      setLevel(newLevel);
      setShowLevelUp(true);
      playSuccess();
      setTimeout(() => setShowLevelUp(false), 1800);
    }
  }, [caught, level]);

  const handleCatch = useCallback((e, creature) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? e.clientX - rect.left : 0;
    const cy = rect ? e.clientY - rect.top : 0;

    if (creature.type === 'cerberus') {
      playBuzz();
      setMissed(m => { const nm = m + 2; if (nm >= MAX_MISSED) setGameOver(true); return nm; });
      if (rect) burst(cx, cy, { colors: ['#ef4444', '#b91c1c'], count: 8 });
    } else {
      setScore(s => s + creature.points);
      setCaught(c => c + 1);
      playPop();
      if (creature.type === 'flame') playSparkle();
      const colors = creature.type === 'ghost' ? GHOST_COLORS
        : creature.type === 'flame' ? FLAME_COLORS : SKULL_COLORS;
      if (rect) burst(cx, cy, { colors, count: 10 });
    }
    setCreatures(prev => prev.map(c => c.id === creature.id ? { ...c, caught: true } : c));
  }, [burst]);

  const handleRestart = useCallback(() => {
    setScore(0); setCaught(0); setMissed(0); setLevel(1);
    setCreatures([]); setGameOver(false); nextId = 0;
  }, []);

  const missedRatio = missed / MAX_MISSED;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden touch-none select-none">
      {/* Background — generated image with CSS gradient fallback */}
      <img src={`${IMG}/bg.png`} alt="" className="absolute inset-0 w-full h-full object-cover z-0"
           onError={(e) => { e.target.style.display = 'none'; }} />
      <div className="absolute inset-0 z-[-1]"
           style={{ background: 'linear-gradient(to bottom, #1a0533, #2d1b69, #1e1b4b, #0a0a1a)' }} />

      {/* River Styx animated water */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to bottom, transparent, #1e1b4b44 30%, #312e8188 60%, #4338caaa)' }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute w-full h-2 rounded-full opacity-20"
               style={{
                 bottom: `${i * 12 + 5}%`,
                 background: 'linear-gradient(90deg, transparent, #818cf8, #6366f1, transparent)',
                 animation: `river-flow ${3 + i * 0.5}s linear infinite`,
                 animationDelay: `${i * -0.7}s`,
               }} />
        ))}
      </div>

      {/* Floating mist */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
             style={{
               width: `${30 + Math.random() * 60}px`, height: `${30 + Math.random() * 60}px`,
               left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
               background: `radial-gradient(circle, ${i % 3 === 0 ? '#7c3aed15' : '#6366f110'}, transparent)`,
               animation: `float-mist ${8 + Math.random() * 8}s ease-in-out infinite`,
               animationDelay: `${Math.random() * -10}s`,
             }} />
      ))}

      {/* Hades character decoration */}
      <div className="absolute bottom-2 right-2 z-10 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none opacity-60">
        <img src={`${IMG}/hades-character.png`} alt="" className="w-full h-full object-contain" />
      </div>

      <BackButton />
      <ParticleLayer />

      {/* HUD */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className="bg-purple-900/70 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 border border-purple-500/30">
          <img src={`${IMG}/flame.png`} alt="" className="w-7 h-7 object-contain" />
          <span className="text-xl font-heading text-purple-200">{score}</span>
        </div>
        <div className="bg-indigo-900/70 backdrop-blur rounded-2xl px-3 py-2 border border-indigo-500/30">
          <span className="text-sm font-heading text-indigo-300">Lv{level}</span>
        </div>
      </div>

      <div className="absolute top-4 left-16 z-20">
        <span className="text-lg font-heading text-purple-300 drop-shadow-lg"
              style={{ textShadow: '0 0 12px #7c3aed88' }}>River Styx</span>
      </div>

      {/* Escaped meter */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-gray-900/60 backdrop-blur rounded-full h-4 overflow-hidden border border-purple-500/30">
          <div className="h-full rounded-full transition-all duration-300"
               style={{
                 width: `${missedRatio * 100}%`,
                 background: missedRatio > 0.7
                   ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                   : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
               }} />
        </div>
        <div className="text-center mt-1">
          <span className="text-xs font-heading text-purple-400/60">{missed}/{MAX_MISSED} escaped</span>
        </div>
      </div>

      {score === 0 && !gameOver && (
        <div className="absolute bottom-24 left-0 right-0 z-20 text-center animate-pulse">
          <span className="text-purple-300/60 text-sm font-heading">
            Catch the ghosts & skeletons! Avoid Cerberus!
          </span>
        </div>
      )}

      {!gameOver && creatures.map(c => <CreatureEl key={c.id} creature={c} onCatch={handleCatch} />)}

      {showLevelUp && (
        <div className="absolute top-1/3 left-0 right-0 z-30 text-center animate-bounce">
          <div className="inline-block bg-purple-900/90 backdrop-blur-sm border-2 border-purple-400/50 rounded-2xl px-8 py-4">
            <span className="text-3xl font-heading text-purple-200" style={{ textShadow: '0 0 20px #a78bfa' }}>
              Level {level}!
            </span>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-purple-900 to-indigo-950 rounded-3xl p-8 text-center shadow-2xl max-w-xs mx-4 animate-spring-in border border-purple-500/30">
            <img src={`${IMG}/hades-character.png`} alt="" className="w-20 h-20 mx-auto mb-3 object-contain" />
            <h2 className="text-2xl font-heading text-purple-200 mb-2" style={{ textShadow: '0 0 15px #a78bfa' }}>
              The Dead Rise!
            </h2>
            <p className="text-purple-300/80 mb-1">Souls captured</p>
            <p className="text-4xl font-heading text-purple-300 mb-1">{score}</p>
            <p className="text-sm text-purple-400/60 mb-4">Level {level} reached</p>
            <button onClick={handleRestart}
              className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-heading text-lg
                         px-8 py-3 rounded-full shadow-lg transition-all border border-purple-400/30"
              style={{ boxShadow: '0 0 20px #7c3aed44' }}>
              Try Again!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes river-flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes float-mist {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          25% { transform: translate(20px, -15px) scale(1.1); opacity: 0.25; }
          50% { transform: translate(-10px, -25px) scale(0.95); opacity: 0.1; }
          75% { transform: translate(15px, -10px) scale(1.05); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
