import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const HONEY_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];
const POOH_QUOTES = [
  'Oh bother, I need more!',
  'Think think think...',
  'A little more honey, please!',
  'How sweet!',
  'Rumbly in my tumbly!',
  'What a wonderful day!',
  'Honey makes everything better!',
];

// ── SVG Ink-Style Tree ──
function InkTree({ x, height = 160, flip = false }) {
  return (
    <svg
      className="absolute bottom-0 select-none pointer-events-none"
      style={{ left: `${x}%`, transform: flip ? 'scaleX(-1)' : undefined }}
      width="80" height={height} viewBox="0 0 80 160"
    >
      <rect x="35" y="80" width="10" height="80" fill="#5c3a1e" rx="3" opacity="0.6" />
      <ellipse cx="40" cy="55" rx="35" ry="45" fill="#3d6b3d" opacity="0.35" />
      <ellipse cx="35" cy="45" rx="25" ry="30" fill="#4a7c4a" opacity="0.3" />
      <ellipse cx="48" cy="60" rx="20" ry="25" fill="#2d5a2d" opacity="0.25" />
    </svg>
  );
}

// ── SVG Pooh Bear (bigger, more detailed Shepard-style) ──
function PoohBear({ reaction, honeyLevel }) {
  const fillPct = Math.min(honeyLevel / 30, 1);
  const expr = reaction === 'sting' ? 'sting' : reaction === 'catch' ? 'catch' : 'happy';
  return (
    <div
      className="select-none"
      style={{
        animation: reaction === 'catch'
          ? 'pooh-wiggle 0.4s ease-in-out'
          : reaction === 'sting'
          ? 'pooh-shake 0.3s ease-in-out'
          : 'pooh-idle 3s ease-in-out infinite',
      }}
    >
      <svg width="140" height="180" viewBox="0 0 140 180">
        {/* Body */}
        <ellipse cx="70" cy="100" rx="42" ry="44" fill="#e8c97a" />
        <ellipse cx="70" cy="100" rx="42" ry="44" fill="none" stroke="#c4943a" strokeWidth="1.5" />
        {/* Tummy highlight */}
        <ellipse cx="70" cy="96" rx="28" ry="30" fill="#f0d68a" opacity="0.4" />
        {/* Red shirt */}
        <path d="M32 85 Q32 120 70 124 Q108 120 108 85 Q96 74 70 72 Q44 74 32 85Z"
          fill="#c0392b" stroke="#962d22" strokeWidth="1.2" />
        <path d="M48 76 Q70 82 92 76" fill="none" stroke="#962d22" strokeWidth="0.8" opacity="0.5" />
        <path d="M42 90 Q52 94 62 91" fill="none" stroke="#d4534a" strokeWidth="1.2" opacity="0.3" />
        {/* Head */}
        <circle cx="70" cy="42" r="30" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.5" />
        {/* Forehead highlight */}
        <ellipse cx="70" cy="32" rx="16" ry="10" fill="#f0d68a" opacity="0.5" />
        {/* Ears */}
        <circle cx="44" cy="18" r="12" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        <circle cx="44" cy="18" r="6" fill="#d4a54a" />
        <circle cx="96" cy="18" r="12" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        <circle cx="96" cy="18" r="6" fill="#d4a54a" />
        {/* Eyes */}
        {expr === 'sting' ? (
          <>
            <path d="M56 38 Q62 42 68 38" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M72 38 Q78 42 84 38" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="60" cy="40" r="4.5" fill="#3d2414" />
            <circle cx="61.5" cy="38.5" r="1.5" fill="white" />
            <circle cx="80" cy="40" r="4.5" fill="#3d2414" />
            <circle cx="81.5" cy="38.5" r="1.5" fill="white" />
            {expr === 'catch' && (
              <>
                <ellipse cx="60" cy="40" rx="5" ry="5.5" fill="#3d2414" />
                <circle cx="61.5" cy="38" r="1.8" fill="white" />
                <ellipse cx="80" cy="40" rx="5" ry="5.5" fill="#3d2414" />
                <circle cx="81.5" cy="38" r="1.8" fill="white" />
              </>
            )}
          </>
        )}
        {/* Nose */}
        <ellipse cx="70" cy="50" rx="4.5" ry="3" fill="#3d2414" />
        <ellipse cx="69" cy="49" rx="1.2" ry="0.8" fill="#6B4C2A" opacity="0.5" />
        {/* Mouth */}
        {expr === 'catch' ? (
          <path d="M60 55 Q70 66 80 55" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
        ) : expr === 'sting' ? (
          <circle cx="70" cy="58" r="4" fill="#3d2414" />
        ) : (
          <path d="M62 54 Q70 62 78 54" fill="none" stroke="#3d2414" strokeWidth="1.8" strokeLinecap="round" />
        )}
        {/* Cheek blush */}
        <ellipse cx="50" cy="50" rx="5" ry="3.5" fill="#f0a060" opacity="0.25" />
        <ellipse cx="90" cy="50" rx="5" ry="3.5" fill="#f0a060" opacity="0.25" />
        {/* Arms */}
        <path d="M32 90 Q16 104 22 124" fill="none" stroke="#c4943a" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="22" cy="124" r="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        <path d="M108 90 Q124 104 118 124" fill="none" stroke="#c4943a" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="118" cy="124" r="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        {/* Legs */}
        <ellipse cx="54" cy="142" rx="14" ry="9" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        <ellipse cx="86" cy="142" rx="14" ry="9" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        {/* Feet */}
        <ellipse cx="50" cy="150" rx="12" ry="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="0.8" />
        <ellipse cx="90" cy="150" rx="12" ry="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="0.8" />
        {/* Honey pot */}
        <g transform="translate(48, 152)">
          <path d="M6 6 Q6 0 20 0 Q34 0 34 6 L36 26 Q36 32 20 32 Q4 32 2 26Z"
            fill="#b87333" stroke="#6b4c2a" strokeWidth="1" />
          <rect x="8" y="3" width="24" height="22" rx="3" fill="#c4873b" opacity="0.5" />
          <ellipse cx="20" cy="4" rx="12" ry="3" fill="#d4943a" />
          {/* Honey fill level */}
          <rect x="8" y={25 - fillPct * 18} width="24" height={fillPct * 18} rx="2"
            fill="#f59e0b" opacity="0.85" />
          {fillPct > 0.3 && <ellipse cx="20" cy="2" rx="8" ry="2" fill="#f59e0b" opacity="0.6" />}
        </g>
      </svg>
    </div>
  );
}

// ── SVG Honey Pot (falling item) ──
function HoneyPotItem({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M10 12 Q10 6 20 6 Q30 6 30 12 L32 32 Q32 38 20 38 Q8 38 8 32Z"
        fill="#d4943a" stroke="#6b4c2a" strokeWidth="1.2" />
      <rect x="12" y="8" width="16" height="22" rx="2" fill="#e8a848" opacity="0.5" />
      <ellipse cx="20" cy="8" rx="10" ry="3" fill="#f59e0b" opacity="0.9" />
      <text x="20" y="24" textAnchor="middle" fontSize="7" fill="#5c3a1e" fontWeight="bold" fontFamily="serif">HUNNY</text>
    </svg>
  );
}

// ── SVG Golden Honeycomb ──
function HoneycombItem({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: 'drop-shadow(0 0 6px #fbbf24)' }}>
      {/* Hexagon shape */}
      <polygon points="20,4 34,12 34,28 20,36 6,28 6,12"
        fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="20,10 28,15 28,25 20,30 12,25 12,15"
        fill="#fde68a" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="20" y="23" textAnchor="middle" fontSize="10" fill="#92400e">&#9733;</text>
    </svg>
  );
}

// ── SVG Bee ──
function BeeItem({ size }) {
  const wingPhase = Date.now() * 0.02;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Wings */}
      <ellipse cx="14" cy="14" rx="8" ry="5"
        fill="rgba(200,220,255,0.6)" stroke="#8cb4d9" strokeWidth="0.5"
        transform={`rotate(${Math.sin(wingPhase) * 20}, 14, 14)`} />
      <ellipse cx="26" cy="14" rx="8" ry="5"
        fill="rgba(200,220,255,0.6)" stroke="#8cb4d9" strokeWidth="0.5"
        transform={`rotate(${-Math.sin(wingPhase) * 20}, 26, 14)`} />
      {/* Body */}
      <ellipse cx="20" cy="22" rx="10" ry="12" fill="#fbbf24" stroke="#6b4c2a" strokeWidth="1.2" />
      {/* Stripes */}
      <rect x="11" y="18" width="18" height="3" rx="1" fill="#2c1810" />
      <rect x="12" y="24" width="16" height="3" rx="1" fill="#2c1810" />
      <rect x="13" y="30" width="14" height="2" rx="1" fill="#2c1810" />
      {/* Eyes */}
      <circle cx="16" cy="16" r="2" fill="white" />
      <circle cx="24" cy="16" r="2" fill="white" />
      <circle cx="16.5" cy="16.5" r="1" fill="#2c1810" />
      <circle cx="24.5" cy="16.5" r="1" fill="#2c1810" />
      {/* Stinger */}
      <path d="M20 34 L20 38" stroke="#6b4c2a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── SVG Piglet (rare bonus) ──
function PigletItem({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Body */}
      <ellipse cx="20" cy="24" rx="14" ry="12" fill="#f9a8c9" stroke="#c4628e" strokeWidth="1.2" />
      {/* Shirt stripes */}
      <rect x="10" y="20" width="20" height="2" rx="1" fill="#d16d9e" opacity="0.5" />
      <rect x="11" y="26" width="18" height="2" rx="1" fill="#d16d9e" opacity="0.5" />
      {/* Head */}
      <circle cx="20" cy="14" r="10" fill="#f9a8c9" stroke="#c4628e" strokeWidth="1.2" />
      {/* Ears */}
      <ellipse cx="12" cy="6" rx="4" ry="5" fill="#f9a8c9" stroke="#c4628e" strokeWidth="1" />
      <ellipse cx="28" cy="6" rx="4" ry="5" fill="#f9a8c9" stroke="#c4628e" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="16" cy="13" r="1.5" fill="#2c1810" />
      <circle cx="24" cy="13" r="1.5" fill="#2c1810" />
      {/* Snout */}
      <ellipse cx="20" cy="17" rx="4" ry="2.5" fill="#f0829e" />
      <circle cx="18.5" cy="17" r="0.8" fill="#c4628e" />
      <circle cx="21.5" cy="17" r="0.8" fill="#c4628e" />
      {/* Heart */}
      <text x="20" y="35" textAnchor="middle" fontSize="8" fill="#e74c6f">&#10084;</text>
    </svg>
  );
}

// ── Falling Drop Element ──
function HoneyDropEl({ drop, onCatch }) {
  const wobble = Math.sin(Date.now() * drop.wobbleSpeed + drop.wobblePhase) * 15;
  const rotation = drop.type === 'bee' ? Math.sin(Date.now() * 0.01) * 15 : 0;

  return (
    <div
      onPointerDown={(e) => onCatch(e, drop)}
      className="absolute cursor-pointer active:scale-110 transition-transform duration-75 select-none"
      style={{
        left: drop.x + wobble - drop.size / 2,
        top: drop.y - drop.size / 2,
        width: drop.size,
        height: drop.size,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {drop.type === 'honey' && <HoneyPotItem size={drop.size} />}
      {drop.type === 'golden-honey' && <HoneycombItem size={drop.size} />}
      {drop.type === 'bee' && <BeeItem size={drop.size} />}
      {drop.type === 'piglet' && <PigletItem size={drop.size} />}
    </div>
  );
}

// ── Floating Quote Bubble ──
function QuoteBubble({ text, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 animate-float-up pointer-events-none">
      <div className="bg-amber-50/90 border-2 border-amber-400 rounded-2xl px-4 py-2 shadow-lg max-w-[200px]">
        <p className="text-amber-800 text-xs font-heading text-center leading-tight">{text}</p>
      </div>
    </div>
  );
}

// ── Star Rating ──
function StarRating({ score }) {
  const stars = score >= 26 ? 3 : score >= 11 ? 2 : 1;
  return (
    <div className="flex gap-2 justify-center my-2">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className="text-3xl"
          style={{
            opacity: s <= stars ? 1 : 0.2,
            animation: s <= stars ? `star-pop 0.5s ease-out ${0.3 + s * 0.2}s both` : 'none',
            display: 'inline-block',
          }}
        >
          &#11088;
        </span>
      ))}
    </div>
  );
}

// ── Grass SVG ──
function GrassGround() {
  return (
    <svg className="absolute bottom-0 left-0 w-full pointer-events-none select-none" height="40" preserveAspectRatio="none" viewBox="0 0 400 40">
      <path d="M0 15 Q50 5 100 15 Q150 25 200 12 Q250 5 300 18 Q350 25 400 10 L400 40 L0 40Z"
        fill="#5a8c3c" opacity="0.5" />
      <path d="M0 22 Q60 12 120 22 Q180 30 240 18 Q300 10 360 24 Q380 28 400 20 L400 40 L0 40Z"
        fill="#4a7c30" opacity="0.4" />
    </svg>
  );
}

// ── Drop spawner with progressive difficulty ──
function makeHoneyDrop(id, w, score) {
  const difficultyMult = 1 + Math.min(score / 50, 0.8);
  const beeChance = Math.min(0.22 + score * 0.003, 0.35);

  const rand = Math.random();
  let type = 'honey';
  if (rand > 0.97) type = 'piglet';
  else if (rand > 0.9) type = 'golden-honey';
  else if (rand > (1 - beeChance)) type = 'bee';

  const baseSpeed = type === 'bee' ? 1.5 : 1;
  const speedRange = type === 'bee' ? 1 : 1.5;

  return {
    id,
    type,
    x: 30 + Math.random() * (w - 60),
    y: -50,
    size: type === 'bee' ? 42 : type === 'piglet' ? 44 : 36 + Math.random() * 20,
    speed: (baseSpeed + Math.random() * speedRange) * difficultyMult,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.02,
  };
}

// ── Keyframes (injected once) ──
const KEYFRAMES = `
@keyframes pooh-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes pooh-wiggle { 0% { transform: rotate(0); } 25% { transform: rotate(-8deg) scale(1.05); } 75% { transform: rotate(8deg) scale(1.05); } 100% { transform: rotate(0); } }
@keyframes pooh-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
@keyframes float-up { 0% { opacity: 0; transform: translate(-50%, 0) scale(0.8); } 15% { opacity: 1; transform: translate(-50%, -10px) scale(1); } 85% { opacity: 1; transform: translate(-50%, -30px); } 100% { opacity: 0; transform: translate(-50%, -50px) scale(0.9); } }
@keyframes star-pop { 0% { transform: scale(0) rotate(-30deg); } 60% { transform: scale(1.3) rotate(10deg); } 100% { transform: scale(1) rotate(0); } }
@keyframes countdown-pop { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes intro-fade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
`;

export default function HoneyHunt() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const nextIdRef = useRef(0);
  const scoreRef = useRef(0);

  const [phase, setPhase] = useState('intro'); // intro | countdown | playing | gameOver
  const [countdown, setCountdown] = useState(3);
  const [drops, setDrops] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [dims, setDims] = useState({ w: 400, h: 600 });
  const [reaction, setReaction] = useState(null); // 'catch' | 'sting' | null
  const [quote, setQuote] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const lastQuoteMilestone = useRef(0);

  // Keep scoreRef in sync
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Inject keyframes
  useEffect(() => {
    const id = 'honey-hunt-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);

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

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      setPhase('playing');
      return;
    }
    playBoing();
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Spawn drops
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setDrops((prev) => {
        if (prev.length >= 12) return prev;
        return [...prev, makeHoneyDrop(nextIdRef.current++, dims.w, scoreRef.current)];
      });
    }, Math.max(500, 800 - scoreRef.current * 3));
    return () => clearInterval(interval);
  }, [dims.w, phase]);

  // Animate drops falling
  useEffect(() => {
    if (phase !== 'playing') return;
    let running = true;
    const animate = () => {
      if (!running) return;
      setDrops((prev) => {
        const updated = [];
        let lostLife = false;
        for (const d of prev) {
          const newY = d.y + d.speed;
          if (newY > dims.h + 50) {
            if (d.type !== 'bee') lostLife = true;
          } else {
            updated.push({ ...d, y: newY });
          }
        }
        if (lostLife) {
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) setPhase('gameOver');
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
  }, [dims.h, phase]);

  // Pooh reaction timeout
  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => setReaction(null), 400);
    return () => clearTimeout(t);
  }, [reaction]);

  const handleCatch = useCallback((e, drop) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();

    if (drop.type === 'bee') {
      playBuzz();
      setReaction('sting');
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) setPhase('gameOver');
        return Math.max(0, newLives);
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: ['#ef4444', '#f97316'] });
    } else if (drop.type === 'piglet') {
      playSuccess();
      setReaction('catch');
      setScore((s) => s + 5);
      setLives((l) => Math.min(l + 1, 5));
      peek('excited');
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: ['#f9a8c9', '#f472b6', '#ec4899'] });
    } else {
      const points = drop.type === 'golden-honey' ? 3 : 1;
      playPop();
      setReaction('catch');
      setScore((s) => {
        const newScore = s + points;
        // Quote milestone every 10 points
        const milestone = Math.floor(newScore / 10);
        if (milestone > lastQuoteMilestone.current) {
          lastQuoteMilestone.current = milestone;
          playSuccess();
          peek('happy');
          setQuote(POOH_QUOTES[milestone % POOH_QUOTES.length]);
        }
        return newScore;
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: HONEY_COLORS });
    }

    setDrops((prev) => prev.filter((d) => d.id !== drop.id));
  }, [burst, peek]);

  const handleStart = useCallback(() => {
    setPhase('countdown');
    setCountdown(3);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setLives(5);
    setDrops([]);
    setPhase('countdown');
    setCountdown(3);
    nextIdRef.current = 0;
    lastQuoteMilestone.current = 0;
    scoreRef.current = 0;
  }, []);

  // Stable tree positions
  const trees = useMemo(() => [
    { x: 2, h: 150, flip: false },
    { x: 18, h: 170, flip: true },
    { x: 38, h: 140, flip: false },
    { x: 55, h: 165, flip: true },
    { x: 72, h: 155, flip: false },
    { x: 88, h: 145, flip: true },
  ], []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #b8dff0 25%, #d4e8b8 50%, #a8c97a 70%, #7ab648 100%)',
      }}
    >
      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />

      {/* Soft clouds */}
      <div className="absolute top-[8%] left-[10%] w-20 h-8 bg-white/30 rounded-full blur-sm" />
      <div className="absolute top-[5%] right-[15%] w-16 h-6 bg-white/25 rounded-full blur-sm" />
      <div className="absolute top-[12%] left-[55%] w-24 h-8 bg-white/20 rounded-full blur-sm" />

      {/* Ink trees */}
      {trees.map((t, i) => (
        <InkTree key={i} x={t.x} height={t.h} flip={t.flip} />
      ))}

      {/* Grass */}
      <GrassGround />

      {/* ── INTRO SCREEN ── */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div
            className="text-center"
            style={{ animation: 'intro-fade 0.6s ease-out both' }}
          >
            <div className="mb-4">
              <PoohBear reaction={null} honeyLevel={0} />
            </div>
            <h1 className="text-3xl font-heading text-amber-900 mb-2 drop-shadow-sm">Honey Hunt</h1>
            <p className="text-amber-800/80 text-sm mb-1 font-heading">Catch the honey pots!</p>
            <p className="text-amber-800/60 text-xs mb-6">Avoid the bees! Tap Piglet for a bonus!</p>
            <button
              onClick={handleStart}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading text-xl
                         px-10 py-4 rounded-full shadow-xl transition-all border-2 border-amber-600"
            >
              Play!
            </button>
          </div>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <span
            key={countdown}
            className="text-8xl font-heading text-amber-800 drop-shadow-lg"
            style={{ animation: 'countdown-pop 0.6s ease-out both' }}
          >
            {countdown > 0 ? countdown : 'Go!'}
          </span>
        </div>
      )}

      {/* ── HUD (playing + gameOver) ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <>
          {/* Score & Lives */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <div className="bg-amber-800/60 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 40 40">
                <path d="M10 12 Q10 6 20 6 Q30 6 30 12 L32 32 Q32 38 20 38 Q8 38 8 32Z" fill="#f59e0b" />
              </svg>
              <span className="text-lg font-heading text-white">{score}</span>
            </div>
            <div className="bg-red-800/60 backdrop-blur-sm rounded-2xl px-2 py-1.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-sm" style={{ opacity: i < lives ? 1 : 0.15 }}>
                  &#10084;&#65039;
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="absolute top-4 left-14 z-20">
            <span className="text-base font-heading text-amber-900/80 drop-shadow-sm">Honey Hunt</span>
          </div>
        </>
      )}

      {/* ── GAME OBJECTS ── */}
      {phase === 'playing' && drops.map((d) => (
        <HoneyDropEl key={d.id} drop={d} onCatch={handleCatch} />
      ))}

      {/* ── POOH CHARACTER ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <PoohBear reaction={reaction} honeyLevel={score} />
        </div>
      )}

      {/* ── QUOTE BUBBLE ── */}
      {quote && phase === 'playing' && (
        <QuoteBubble key={quote + lastQuoteMilestone.current} text={quote} onDone={() => setQuote(null)} />
      )}

      {/* ── HINT ── */}
      {phase === 'playing' && score === 0 && (
        <div className="absolute bottom-28 left-0 right-0 z-20 text-center animate-pulse">
          <span className="text-amber-900/50 text-xs font-heading">
            Catch the honey! Avoid the bees!
          </span>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === 'gameOver' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            className="bg-amber-50 rounded-3xl p-6 text-center shadow-2xl max-w-xs mx-4 border-2 border-amber-300"
            style={{ animation: 'countdown-pop 0.5s ease-out both' }}
          >
            <h2 className="text-2xl font-heading text-amber-800 mb-1">Oh Bother!</h2>
            <StarRating score={score} />
            <p className="text-amber-700 text-sm mb-0.5">You collected</p>
            <p className="text-4xl font-heading text-amber-600 mb-3">{score}</p>
            <p className="text-amber-600/70 text-xs mb-4 italic">
              {score >= 26 ? 'A wonderful haul of honey!' : score >= 11 ? 'Not bad for a bear of little brain!' : 'Oh bother, try again!'}
            </p>
            <button
              onClick={handleRestart}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading text-lg
                         px-8 py-3 rounded-full shadow-lg transition-all border-2 border-amber-600"
            >
              Try Again!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
