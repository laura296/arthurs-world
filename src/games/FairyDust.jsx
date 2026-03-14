import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playSparkle, playSuccess, playPop, playFanfare, playCollectPing, playBoing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ══════════════════════════════════════════════
   SPARKLE TRAIL (kept from original)
   ══════════════════════════════════════════════ */

const SPARKLE_COLORS = ['#f0abfc', '#fbbf24', '#60a5fa', '#34d399', '#c084fc', '#f472b6'];

function makeSparkle(x, y) {
  return {
    id: Date.now() + Math.random(),
    x, y,
    size: 6 + Math.random() * 14,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    opacity: 1,
    rotation: Math.random() * 360,
    shape: ['★', '♥', '◆', '●'][Math.floor(Math.random() * 4)],
    vx: (Math.random() - 0.5) * 2,
    vy: -1 - Math.random() * 2,
    life: 1,
  };
}

function SparkleParticle({ s }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: s.x, top: s.y,
        fontSize: s.size, color: s.color, opacity: s.opacity,
        transform: `rotate(${s.rotation}deg) scale(${s.life})`,
        textShadow: `0 0 ${s.size / 2}px ${s.color}`,
      }}
    >
      {s.shape}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PLANT IMAGE RENDERER
   Falls back to inline SVG if WebP not found
   ══════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL || '/';

function PlantImage({ name, fallback, color }) {
  const [useImg, setUseImg] = useState(true);
  if (useImg) {
    return (
      <img
        src={`${BASE}assets/plants/${name}.webp`}
        alt=""
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
        onError={() => setUseImg(false)}
      />
    );
  }
  return fallback(color);
}

/* ══════════════════════════════════════════════
   PLANT DEFINITIONS
   ══════════════════════════════════════════════ */

const PLANTS = [
  // ── common plants ──
  { name: 'tulip', rare: false, color: '#ef4444', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="50" x2="30" y2="88" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="22" cy="70" rx="10" ry="5" fill="#4ade80" opacity="0.7" />
      <path d="M30 20 Q15 35 18 50 Q24 55 30 50 Q36 55 42 50 Q45 35 30 20Z" fill={c} />
      <path d="M30 20 Q24 30 26 42 Q28 45 30 42 Q32 45 34 42 Q36 30 30 20Z" fill="white" opacity="0.25" />
    </svg>
  )},
  { name: 'daisy', rare: false, color: '#fbbf24', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="45" x2="30" y2="88" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="20" cy="72" rx="10" ry="5" fill="#4ade80" opacity="0.7" />
      {[0,45,90,135,180,225,270,315].map(a => (
        <ellipse key={a} cx="30" cy="22" rx="5" ry="12" fill="white" transform={`rotate(${a} 30 32)`} />
      ))}
      <circle cx="30" cy="32" r="8" fill={c} />
    </svg>
  )},
  { name: 'sunflower', rare: false, color: '#f97316', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="45" x2="30" y2="88" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="22" cy="68" rx="12" ry="6" fill="#4ade80" opacity="0.7" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
        <ellipse key={a} cx="30" cy="18" rx="5" ry="11" fill={c} transform={`rotate(${a} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="9" fill="#78350f" />
      <circle cx="30" cy="30" r="6" fill="#92400e" />
    </svg>
  )},
  { name: 'mushroom', rare: false, color: '#ef4444', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <rect x="22" y="50" width="16" height="35" rx="6" fill="#fde68a" />
      <ellipse cx="30" cy="50" rx="25" ry="22" fill={c} />
      <circle cx="22" cy="42" r="4" fill="white" opacity="0.7" />
      <circle cx="36" cy="38" r="3" fill="white" opacity="0.7" />
      <circle cx="28" cy="52" r="2.5" fill="white" opacity="0.5" />
    </svg>
  )},
  { name: 'rose', rare: false, color: '#ec4899', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="48" x2="30" y2="88" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="38" cy="65" rx="8" ry="4" fill="#4ade80" opacity="0.7" />
      <circle cx="30" cy="32" r="16" fill={c} />
      <path d="M30 20 Q22 28 26 36 Q28 38 30 36 Q32 38 34 36 Q38 28 30 20Z" fill="white" opacity="0.15" />
      <circle cx="30" cy="32" r="8" fill={c} opacity="0.8" />
    </svg>
  )},
  { name: 'bluebell', rare: false, color: '#818cf8', render: (c) => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <path d="M30 30 Q28 60 30 88" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${i * 3 - 3}, ${i * 14})`}>
          <path d={`M${26 + i * 2} ${24 + i * 4} Q${20} ${30 + i * 4} ${24} ${38 + i * 4} Q${28} ${40 + i * 4} ${32} ${38 + i * 4} Q${36} ${30 + i * 4} ${30 - i * 2} ${24 + i * 4}Z`} fill={c} />
        </g>
      ))}
    </svg>
  )},
  { name: 'fern', rare: false, color: '#22c55e', render: () => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="20" x2="30" y2="88" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <ellipse cx={20} cy={28 + i * 10} rx="10" ry="4" fill="#22c55e" opacity={0.8 - i * 0.05} transform={`rotate(-15 20 ${28 + i * 10})`} />
          <ellipse cx={40} cy={28 + i * 10} rx="10" ry="4" fill="#22c55e" opacity={0.8 - i * 0.05} transform={`rotate(15 40 ${28 + i * 10})`} />
        </g>
      ))}
    </svg>
  )},

  // ── RARE magical plants ──
  { name: 'rainbow-flower', rare: true, color: '#ec4899', render: () => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <line x1="30" y1="45" x2="30" y2="88" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4'];
        return <ellipse key={a} cx="30" cy="20" rx="6" ry="13" fill={colors[i]} transform={`rotate(${a} 30 32)`} opacity="0.85" />;
      })}
      <circle cx="30" cy="32" r="7" fill="#fbbf24" />
      <circle cx="30" cy="32" r="4" fill="white" opacity="0.5" />
    </svg>
  )},
  { name: 'crystal-mushroom', rare: true, color: '#67e8f9', render: () => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <rect x="22" y="52" width="16" height="33" rx="6" fill="#cffafe" />
      <ellipse cx="30" cy="52" rx="24" ry="20" fill="#67e8f9" opacity="0.7" />
      <ellipse cx="30" cy="52" rx="24" ry="20" fill="url(#crystalShine)" />
      {/* crystal facets */}
      <polygon points="22,38 26,48 18,48" fill="white" opacity="0.4" />
      <polygon points="34,35 38,46 30,46" fill="white" opacity="0.3" />
      <polygon points="40,40 43,48 37,48" fill="white" opacity="0.25" />
      <defs>
        <radialGradient id="crystalShine" cx="40%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )},
  { name: 'glow-tree', rare: true, color: '#a78bfa', render: () => (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <rect x="24" y="55" width="12" height="33" rx="3" fill="#7c3aed" />
      <ellipse cx="30" cy="36" rx="24" ry="28" fill="#a78bfa" opacity="0.8" />
      <ellipse cx="30" cy="30" rx="18" ry="20" fill="#c4b5fd" opacity="0.5" />
      {/* glowing orbs in the tree */}
      {[[20,30],[38,26],[28,40],[14,38],[42,36]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fbbf24" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )},
];

const COMMON_PLANTS = PLANTS.filter(p => !p.rare);
const RARE_PLANTS = PLANTS.filter(p => p.rare);

/* ══════════════════════════════════════════════
   FLOATING SEEDS
   ══════════════════════════════════════════════ */

const SEED_TYPES = [
  { emoji: '🌱', label: 'seed' },
  { emoji: '💧', label: 'raindrop' },
  { emoji: '🦋', label: 'butterfly' },
  { emoji: '✨', label: 'sparkle' },
  { emoji: '🌟', label: 'star' },
  { emoji: '🍃', label: 'leaf' },
  { emoji: '🔮', label: 'mystery', rare: true }, // mystery seed = guaranteed rare
];

function makeSeed(w, h) {
  // 15% chance of mystery seed
  const isMystery = Math.random() < 0.15;
  const seedType = isMystery
    ? SEED_TYPES[SEED_TYPES.length - 1]
    : SEED_TYPES[Math.floor(Math.random() * (SEED_TYPES.length - 1))];

  return {
    id: Date.now() + Math.random(),
    ...seedType,
    x: 60 + Math.random() * (w - 120),
    y: 30 + Math.random() * (h * 0.35),
    size: 38 + Math.random() * 18,
    animDelay: Math.random() * 2,
    tapped: false,
  };
}

/* ══════════════════════════════════════════════
   AMBIENT LIFE — fireflies & butterflies
   ══════════════════════════════════════════════ */

function Fireflies({ count = 12 }) {
  const flies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 60,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#fbbf24' : '#f0abfc',
    })),
  [count]);

  return flies.map(f => (
    <div
      key={f.id}
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${f.x}%`, top: `${f.y}%`,
        width: f.size, height: f.size,
        background: f.color,
        boxShadow: `0 0 ${f.size * 2}px ${f.color}`,
        animation: `seed-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="w-full h-full rounded-full" style={{
        animation: `hint-glow ${f.dur * 0.8}s ease-in-out ${f.delay}s infinite`,
      }} />
    </div>
  ));
}

function GardenButterfly({ x, delay }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`, bottom: '20%',
        animation: `seed-float 3s ease-in-out ${delay}s infinite`,
        fontSize: 18,
        opacity: 0.7,
      }}
    >
      🦋
    </div>
  );
}

/* ══════════════════════════════════════════════
   GARDEN PLANT (alive + tappable)
   ══════════════════════════════════════════════ */

function GardenPlant({ plant, slotW, slotIdx, onTap }) {
  const [bouncing, setBouncing] = useState(false);
  const swayDelay = useMemo(() => Math.random() * 2, []);

  const handleTap = useCallback(() => {
    if (bouncing) return;
    setBouncing(true);
    playBoing();
    onTap?.();
    setTimeout(() => setBouncing(false), 500);
  }, [bouncing, onTap]);

  return (
    <div
      className="absolute bottom-10 cursor-pointer"
      onClick={handleTap}
      style={{
        left: slotIdx * slotW + slotW * 0.1,
        width: slotW * 0.8,
        height: slotW * 1.2,
        animation: `bloom-grow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
        transformOrigin: 'bottom center',
      }}
    >
      <div style={{
        animation: bouncing
          ? 'springTap 0.4s ease-out'
          : `seed-float ${3 + swayDelay}s ease-in-out ${swayDelay}s infinite`,
        transformOrigin: 'bottom center',
        width: '100%', height: '100%',
      }}>
        <PlantImage name={plant.name} fallback={plant.render} color={plant.color} />
        {/* rare glow effect */}
        {plant.rare && (
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            background: `radial-gradient(circle, ${plant.color}40 0%, transparent 70%)`,
            animation: `hint-glow 2s ease-in-out infinite`,
          }} />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SOIL MOUND
   ══════════════════════════════════════════════ */

function SoilSlot({ planted, slotX, slotW }) {
  return (
    <g>
      <ellipse cx={slotX + slotW / 2} cy={0} rx={slotW / 2 - 2} ry={12} fill="#78350f" />
      <ellipse cx={slotX + slotW / 2} cy={-2} rx={slotW / 2 - 4} ry={8} fill="#92400e" />
      <line x1={slotX + slotW * 0.3} y1={-8} x2={slotX + slotW * 0.25} y2={-18} stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      <line x1={slotX + slotW * 0.7} y1={-8} x2={slotX + slotW * 0.75} y2={-16} stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      {planted === 'sprouting' && (
        <g style={{ animation: 'bloom-grow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <line x1={slotX + slotW / 2} y1={-10} x2={slotX + slotW / 2} y2={-30} stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx={slotX + slotW / 2 - 5} cy={-22} rx="5" ry="3" fill="#4ade80" opacity="0.7" />
        </g>
      )}
    </g>
  );
}

/* ══════════════════════════════════════════════
   ROUND CONFIG
   ══════════════════════════════════════════════ */

const ROUNDS = [
  { slots: 5, commonTypes: 4 },
  { slots: 6, commonTypes: 5 },
  { slots: 7, commonTypes: 7 },
];

/* ══════════════════════════════════════════════
   MAIN GAME
   ══════════════════════════════════════════════ */

export default function FairyDust() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const [dims, setDims] = useState({ w: 600, h: 400 });
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [seeds, setSeeds] = useState([]);
  const [garden, setGarden] = useState([]);
  const [flyingSeed, setFlyingSeed] = useState(null);

  const config = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  // measure
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) =>
      setDims({ w: e.contentRect.width, h: e.contentRect.height })
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // init garden
  useEffect(() => {
    setGarden(Array.from({ length: config.slots }, () => null));
    setSeeds([]);
    if (phase === 'round-end') return; // don't reset phase during transition
    setPhase('playing');
  }, [round, config.slots]);

  // spawn seeds
  useEffect(() => {
    if (phase !== 'playing') return;
    const initial = Array.from({ length: 3 }, () => makeSeed(dims.w, dims.h));
    setSeeds(initial);
    const iv = setInterval(() => {
      setSeeds(prev => {
        if (prev.filter(s => !s.tapped).length >= 5) return prev;
        return [...prev, makeSeed(dims.w, dims.h)];
      });
    }, 2200);
    return () => clearInterval(iv);
  }, [phase, dims.w, dims.h, round]);

  // sparkle physics
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      setSparkles(prev =>
        prev.map(s => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, life: s.life - 0.02, opacity: s.life, rotation: s.rotation + 3 }))
            .filter(s => s.life > 0)
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, []);

  const handlePointerMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    setSparkles(prev => [
      ...prev.slice(-100),
      ...Array.from({ length: 2 }, () => makeSparkle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20)),
    ]);
  }, []);

  // pick a plant for a seed
  const choosePlant = useCallback((seed) => {
    if (seed.rare) {
      // mystery seed → guaranteed rare plant
      return PLANTS.indexOf(RARE_PLANTS[Math.floor(Math.random() * RARE_PLANTS.length)]);
    }
    // 20% chance of rare on normal seeds
    if (Math.random() < 0.2) {
      return PLANTS.indexOf(RARE_PLANTS[Math.floor(Math.random() * RARE_PLANTS.length)]);
    }
    const commons = COMMON_PLANTS.slice(0, config.commonTypes);
    const chosen = commons[Math.floor(Math.random() * commons.length)];
    return PLANTS.indexOf(chosen);
  }, [config.commonTypes]);

  const handleSeedTap = useCallback((e, seed) => {
    e.stopPropagation();
    if (phase !== 'playing' || seed.tapped) return;

    const nextEmpty = garden.findIndex(g => g === null);
    if (nextEmpty === -1) return;

    // tap burst
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const bx = e.clientX - rect.left, by = e.clientY - rect.top;
      burst(bx, by, {
        count: seed.rare ? 16 : 8,
        colors: seed.rare ? ['#a78bfa', '#fbbf24', '#f0abfc', '#67e8f9'] : SPARKLE_COLORS,
        shapes: ['star', 'circle', 'heart'],
        spread: seed.rare ? 80 : 50,
      });
    }

    playSparkle();
    setSeeds(prev => prev.map(s => s.id === seed.id ? { ...s, tapped: true } : s));

    const plantIdx = choosePlant(seed);
    const plant = PLANTS[plantIdx];
    const slotW = dims.w / config.slots;
    const targetX = nextEmpty * slotW + slotW / 2;
    const targetY = dims.h - 60;

    // fly seed to garden
    setFlyingSeed({ fromX: seed.x, fromY: seed.y, toX: targetX, toY: targetY, emoji: seed.emoji, rare: seed.rare });

    // sprout
    setTimeout(() => {
      setFlyingSeed(null);
      setGarden(prev => {
        const g = [...prev];
        g[nextEmpty] = { plantIdx, state: 'sprouting' };
        return g;
      });
      playPop();
    }, 450);

    // bloom
    setTimeout(() => {
      setGarden(prev => {
        const g = [...prev];
        if (g[nextEmpty]) g[nextEmpty] = { ...g[nextEmpty], state: 'bloomed' };
        return g;
      });

      // extra celebration for rare
      if (plant.rare) {
        playSuccess();
        burst(targetX, targetY - 40, {
          count: 20,
          colors: ['#fbbf24', '#a78bfa', '#ec4899', '#67e8f9'],
          shapes: ['star', 'heart', 'diamond'],
          spread: 90,
        });
        peek('excited');
      } else {
        playCollectPing();
        burst(targetX, targetY - 40, {
          count: 10,
          colors: [plant.color, '#fbbf24', '#f0abfc'],
          shapes: ['star', 'heart'],
          spread: 60,
        });
      }

      setSeeds(prev => prev.filter(s => s.id !== seed.id));

      // check garden completion
      setTimeout(() => {
        setGarden(prev => {
          const filled = prev.filter(g => g !== null).length;
          if (filled >= config.slots) {
            if (round >= ROUNDS.length - 1) {
              setPhase('won');
              playFanfare();
              celebrate({ duration: 5000 });
              peek('excited');
            } else {
              setPhase('round-end');
              playSuccess();
              peek('excited');
              celebrate({ duration: 3000 });
              setTimeout(() => setRound(r => r + 1), 3500);
            }
          }
          return prev;
        });
      }, 250);
    }, 950);
  }, [phase, garden, config, dims, round, burst, celebrate, peek, choosePlant]);

  // tap a bloomed plant → bounce + particles
  const handlePlantTap = useCallback((slotIdx) => {
    const slot = garden[slotIdx];
    if (!slot || slot.state !== 'bloomed') return;
    const plant = PLANTS[slot.plantIdx];
    const slotW = dims.w / config.slots;
    const cx = slotIdx * slotW + slotW / 2;
    const cy = dims.h - 80;
    burst(cx, cy, {
      count: 6,
      colors: [plant.color, '#fbbf24'],
      shapes: ['star', 'circle'],
      spread: 40,
    });
  }, [garden, dims, config.slots, burst]);

  const resetGame = useCallback(() => {
    setRound(0);
    setGarden(Array.from({ length: ROUNDS[0].slots }, () => null));
    setSeeds([]);
    setPhase('playing');
  }, []);

  const filledCount = garden.filter(g => g !== null).length;
  const slotW = dims.w / config.slots;

  // ambient butterflies once garden has plants
  const gardenButterflies = useMemo(() => {
    if (filledCount < 2) return [];
    return Array.from({ length: Math.min(filledCount - 1, 3) }, (_, i) => ({
      x: 20 + i * 25 + Math.random() * 10,
      delay: i * 1.2,
    }));
  }, [filledCount]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{
        background: 'linear-gradient(to bottom, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #1a2e05 85%, #1a2e05 100%)',
        cursor: 'url("data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27><text y=%2724%27 font-size=%2724%27>🪄</text></svg>") 4 28, auto',
      }}
      onPointerMove={handlePointerMove}
    >
      <BackButton />
      <ParticleLayer />

      {/* twinkling stars */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={`s-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 1 + Math.random() * 3, height: 1 + Math.random() * 3,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 55}%`,
            background: 'white',
            opacity: 0.3 + Math.random() * 0.5,
            animation: `hint-glow ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
          }}
        />
      ))}

      {/* fireflies */}
      <Fireflies count={filledCount >= 3 ? 10 : 5} />

      {/* garden butterflies (appear as garden grows) */}
      {gardenButterflies.map((b, i) => (
        <GardenButterfly key={i} x={b.x} delay={b.delay} />
      ))}

      {/* progress dots */}
      <div className="absolute top-4 right-4 z-30 bg-purple-900/60 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-1.5">
        {Array.from({ length: config.slots }, (_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-500 ${
              i < filledCount ? 'bg-pink-400 shadow-sm shadow-pink-400/50' : 'bg-white/20'
            }`}
            style={{ width: 10, height: 10 }}
          />
        ))}
      </div>

      {/* round indicator */}
      <div className="absolute top-4 left-16 z-30 flex gap-1.5">
        {ROUNDS.map((_, i) => (
          <div key={i} className={`transition-all duration-300 ${i <= round ? 'opacity-100' : 'opacity-30 scale-75'}`}>
            <svg width={18} height={18} viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="4" fill={i <= round ? '#f0abfc' : '#6b21a8'} />
              {[0, 60, 120, 180, 240, 300].map(a => (
                <circle key={a}
                  cx={10 + 6 * Math.cos(a * Math.PI / 180)}
                  cy={10 + 6 * Math.sin(a * Math.PI / 180)}
                  r="3" fill={i <= round ? '#c084fc' : '#4c1d95'}
                />
              ))}
            </svg>
          </div>
        ))}
      </div>

      {/* floating seeds */}
      {seeds.filter(s => !s.tapped).map(seed => (
        <div
          key={seed.id}
          onPointerDown={(e) => handleSeedTap(e, seed)}
          className="absolute cursor-pointer"
          style={{
            left: seed.x - seed.size / 2,
            top: seed.y - seed.size / 2,
            fontSize: seed.size,
            animation: `seed-float 2.5s ease-in-out ${seed.animDelay}s infinite, pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
            filter: seed.rare
              ? 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.8))'
              : 'drop-shadow(0 0 8px rgba(240, 171, 252, 0.5))',
          }}
        >
          {seed.emoji}
        </div>
      ))}

      {/* flying seed */}
      {flyingSeed && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: flyingSeed.fromX,
            top: flyingSeed.fromY,
            fontSize: 30,
            transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: `translate(${flyingSeed.toX - flyingSeed.fromX}px, ${flyingSeed.toY - flyingSeed.fromY}px) scale(0.4) rotate(360deg)`,
            opacity: 0.7,
            filter: flyingSeed.rare ? 'drop-shadow(0 0 12px #a78bfa)' : 'none',
          }}
        >
          {flyingSeed.emoji}
        </div>
      )}

      {/* garden bed */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: dims.h * 0.35 }}>
        {/* grass */}
        <div className="absolute bottom-12 left-0 right-0 h-10 bg-gradient-to-t from-green-900/90 to-green-800/30 rounded-t-[50%]" />
        <div className="absolute bottom-8 left-0 right-0 h-6 bg-gradient-to-t from-green-950/70 to-transparent" />

        {/* soil SVG */}
        <svg
          className="absolute bottom-4 left-0 right-0"
          width={dims.w} height={dims.h * 0.3}
          viewBox={`0 0 ${dims.w} ${dims.h * 0.3}`}
          style={{ overflow: 'visible' }}
        >
          <g transform={`translate(0, ${dims.h * 0.3 - 20})`}>
            {Array.from({ length: config.slots }, (_, i) => (
              <SoilSlot key={i} planted={garden[i]?.state} slotX={i * slotW} slotW={slotW} />
            ))}
          </g>
        </svg>

        {/* bloomed plants — alive & tappable */}
        {garden.map((slot, i) => {
          if (!slot || slot.state !== 'bloomed') return null;
          return (
            <GardenPlant
              key={`plant-${i}-${round}`}
              plant={PLANTS[slot.plantIdx]}
              slotW={slotW}
              slotIdx={i}
              onTap={() => handlePlantTap(i)}
            />
          );
        })}
      </div>

      {/* sparkle trail */}
      {sparkles.map(s => <SparkleParticle key={s.id} s={s} />)}

      {/* round complete overlay */}
      {phase === 'round-end' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex gap-3" style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            {[0, 1, 2].map(i => (
              <svg key={i} width={44} height={44} viewBox="0 0 20 20" className="animate-spin-slow drop-shadow-lg"
                style={{ animationDelay: `${i * 0.15}s` }}>
                <circle cx="10" cy="10" r="4" fill="#fbbf24" />
                {[0, 60, 120, 180, 240, 300].map(a => (
                  <circle key={a} cx={10 + 6 * Math.cos(a * Math.PI / 180)} cy={10 + 6 * Math.sin(a * Math.PI / 180)} r="3" fill="#f0abfc" />
                ))}
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* win screen */}
      {phase === 'won' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/80 to-indigo-900/80 backdrop-blur-sm">
          <div className="bg-white/90 rounded-3xl px-8 py-6 shadow-2xl border-4 border-purple-200/60 flex flex-col items-center gap-4 max-w-xs"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            <div className="flex gap-1">
              {[...COMMON_PLANTS.slice(0, 3), ...RARE_PLANTS.slice(0, 2)].map((p, i) => (
                <div key={p.name} className="w-10 h-14" style={{ animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
                  <PlantImage name={p.name} fallback={p.render} color={p.color} />
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <svg key={i} width={36} height={36} viewBox="0 0 22 22"
                  style={{ animation: `pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + i * 0.15}s both` }}>
                  <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8" fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
                </svg>
              ))}
            </div>
            <button onClick={resetGame}
              className="bg-purple-500 text-white font-heading text-xl px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition-transform"
              style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both' }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M12 4V1L8 5l4 4V6a6 6 0 110 12 6 6 0 01-6-6H4a8 8 0 108-8z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
