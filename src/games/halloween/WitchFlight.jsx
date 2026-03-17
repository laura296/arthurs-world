import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playWhoosh, playSuccess, playBoing, playSparkle, playCelebrate, playCollectPing, playPop } from '../../hooks/useSound';

/**
 * Witch Flight — a side-scrolling dodge game.
 * A friendly witch flies forward on her broomstick.
 * Touch and drag up/down to steer her past obstacles (trees, bats, clouds).
 * Very forgiving — bumps cause a wobble + giggle, no game-over.
 * Stars to collect for bonus sparkles.
 * All visuals are proper SVG illustrations — no emoji.
 */

const WITCH_X = 18;
const WITCH_SIZE = 14;
const OBSTACLE_SPEED = 0.6;
const STAR_SPEED = 0.5;
const SPAWN_INTERVAL = 1800;
const STAR_INTERVAL = 2800;

const OBSTACLES = [
  { type: 'tree', w: 10, h: 18 },
  { type: 'bat', w: 10, h: 10 },
  { type: 'cloud', w: 14, h: 10 },
  { type: 'pumpkin', w: 10, h: 10 },
  { type: 'owl', w: 9, h: 10 },
];

let nextId = 0;

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/* ─── SVG Obstacle Illustrations ─── */

function TreeSVG() {
  return (
    <svg viewBox="0 0 80 140" style={{ width: '100%', height: '100%' }}>
      {/* Trunk */}
      <rect x="32" y="90" width="16" height="50" rx="4" fill="#5D3A1A" />
      <rect x="34" y="92" width="5" height="44" rx="2" fill="#6B4423" opacity="0.5" />
      {/* Foliage layers */}
      <ellipse cx="40" cy="80" rx="32" ry="22" fill="#1B4332" />
      <ellipse cx="40" cy="60" rx="26" ry="20" fill="#2D6A4F" />
      <ellipse cx="40" cy="42" rx="20" ry="18" fill="#40916C" />
      <ellipse cx="40" cy="28" rx="14" ry="14" fill="#52B788" />
      {/* Highlight */}
      <ellipse cx="34" cy="38" rx="8" ry="10" fill="#95D5B2" opacity="0.3" />
    </svg>
  );
}

function BatSVG() {
  return (
    <svg viewBox="0 0 100 70" style={{ width: '100%', height: '100%' }}>
      {/* Body */}
      <ellipse cx="50" cy="38" rx="12" ry="14" fill="#2C1810" />
      <ellipse cx="50" cy="36" rx="10" ry="11" fill="#3D2419" />
      {/* Left wing */}
      <path d="M38,32 Q20,15 8,28 Q15,30 22,25 Q18,38 10,42 Q20,38 30,35 Q28,42 24,48 Q32,42 38,38" fill="#2C1810" />
      <path d="M38,33 Q22,18 12,30 Q18,30 24,26 Q20,38 14,42 Q22,39 30,36" fill="#3D2419" opacity="0.6" />
      {/* Right wing */}
      <path d="M62,32 Q80,15 92,28 Q85,30 78,25 Q82,38 90,42 Q80,38 70,35 Q72,42 76,48 Q68,42 62,38" fill="#2C1810" />
      <path d="M62,33 Q78,18 88,30 Q82,30 76,26 Q80,38 86,42 Q78,39 70,36" fill="#3D2419" opacity="0.6" />
      {/* Ears */}
      <path d="M42,26 L38,16 L46,24 Z" fill="#2C1810" />
      <path d="M58,26 L62,16 L54,24 Z" fill="#2C1810" />
      {/* Eyes */}
      <circle cx="44" cy="34" r="4" fill="#F5B041" />
      <circle cx="56" cy="34" r="4" fill="#F5B041" />
      <circle cx="44" cy="34" r="2" fill="#1a1a1a" />
      <circle cx="56" cy="34" r="2" fill="#1a1a1a" />
      {/* Little fangs */}
      <path d="M46,44 L48,48 L50,44" fill="white" opacity="0.8" />
      <path d="M50,44 L52,48 L54,44" fill="white" opacity="0.8" />
    </svg>
  );
}

function CloudSVG() {
  return (
    <svg viewBox="0 0 140 80" style={{ width: '100%', height: '100%' }}>
      {/* Shadow */}
      <ellipse cx="72" cy="58" rx="52" ry="14" fill="rgba(100,80,140,0.15)" />
      {/* Main cloud body */}
      <ellipse cx="56" cy="46" rx="36" ry="20" fill="#C8B8D8" />
      <ellipse cx="84" cy="42" rx="28" ry="18" fill="#D4C6E2" />
      <ellipse cx="40" cy="40" rx="24" ry="16" fill="#BCA8D0" />
      <ellipse cx="70" cy="36" rx="30" ry="18" fill="#DDD0EA" />
      {/* Highlight puffs */}
      <ellipse cx="60" cy="32" rx="20" ry="12" fill="#EAE0F4" opacity="0.6" />
      <ellipse cx="80" cy="34" rx="14" ry="10" fill="#F0E8F8" opacity="0.4" />
    </svg>
  );
}

function PumpkinSVG() {
  return (
    <svg viewBox="0 0 90 90" style={{ width: '100%', height: '100%' }}>
      {/* Stem */}
      <path d="M42,22 Q44,10 48,22" fill="#5D7A3A" strokeWidth="2" stroke="#4A6230" />
      {/* Main body segments */}
      <ellipse cx="45" cy="52" rx="34" ry="30" fill="#E67E22" />
      <ellipse cx="30" cy="52" rx="20" ry="28" fill="#F39C12" opacity="0.7" />
      <ellipse cx="60" cy="52" rx="20" ry="28" fill="#D35400" opacity="0.5" />
      <ellipse cx="45" cy="52" rx="14" ry="28" fill="#F5B041" opacity="0.4" />
      {/* Highlight */}
      <ellipse cx="34" cy="42" rx="10" ry="12" fill="#F9C74F" opacity="0.3" />
      {/* Face — carved, friendly */}
      <path d="M30,48 L36,42 L42,48" fill="none" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48,48 L54,42 L60,48" fill="none" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M32,60 Q45,72 58,60" fill="none" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Inner glow */}
      <path d="M32,60 Q45,70 58,60" fill="#F5B041" opacity="0.3" />
    </svg>
  );
}

function OwlSVG() {
  return (
    <svg viewBox="0 0 80 90" style={{ width: '100%', height: '100%' }}>
      {/* Body */}
      <ellipse cx="40" cy="56" rx="24" ry="28" fill="#6B4423" />
      <ellipse cx="40" cy="58" rx="20" ry="24" fill="#7D5A35" />
      {/* Belly */}
      <ellipse cx="40" cy="62" rx="14" ry="18" fill="#C4A265" opacity="0.4" />
      {/* Wing tufts */}
      <path d="M16,50 Q10,40 14,30 Q18,38 20,44" fill="#5D3A1A" />
      <path d="M64,50 Q70,40 66,30 Q62,38 60,44" fill="#5D3A1A" />
      {/* Head */}
      <ellipse cx="40" cy="32" rx="20" ry="18" fill="#7D5A35" />
      {/* Ear tufts */}
      <path d="M24,20 L22,8 L30,18 Z" fill="#6B4423" />
      <path d="M56,20 L58,8 L50,18 Z" fill="#6B4423" />
      {/* Eye discs */}
      <circle cx="32" cy="30" r="10" fill="#C4A265" />
      <circle cx="48" cy="30" r="10" fill="#C4A265" />
      {/* Eyes */}
      <circle cx="32" cy="30" r="6" fill="#F5B041" />
      <circle cx="48" cy="30" r="6" fill="#F5B041" />
      <circle cx="32" cy="30" r="3.5" fill="#1a1a1a" />
      <circle cx="48" cy="30" r="3.5" fill="#1a1a1a" />
      <circle cx="33.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="49.5" cy="28.5" r="1.5" fill="white" />
      {/* Beak */}
      <path d="M37,36 L40,42 L43,36 Z" fill="#D4A017" />
      {/* Feet */}
      <path d="M30,82 L26,88 M30,82 L30,88 M30,82 L34,88" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50,82 L46,88 M50,82 L50,88 M50,82 L54,88" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ObstacleSVG({ type }) {
  switch (type) {
    case 'tree': return <TreeSVG />;
    case 'bat': return <BatSVG />;
    case 'cloud': return <CloudSVG />;
    case 'pumpkin': return <PumpkinSVG />;
    case 'owl': return <OwlSVG />;
    default: return null;
  }
}

/* ─── Golden Star SVG ─── */

function GoldenStarSVG() {
  return (
    <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E79F" />
          <stop offset="50%" stopColor="#F5B041" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="25" cy="25" r="24" fill="url(#star-glow)" />
      {/* Star shape */}
      <path d="M25,4 L30.5,18.5 L46,18.5 L33.5,28 L38,43 L25,33.5 L12,43 L16.5,28 L4,18.5 L19.5,18.5 Z"
        fill="url(#star-gold)" stroke="#D4A017" strokeWidth="1" />
      {/* Highlight */}
      <path d="M25,8 L28,18 L22,18 Z" fill="#FFF8DC" opacity="0.5" />
    </svg>
  );
}

/* ─── Score Star (smaller, for HUD) ─── */

function ScoreStarSVG() {
  return (
    <svg viewBox="0 0 30 30" style={{ width: '2rem', height: '2rem' }}>
      <defs>
        <linearGradient id="score-star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E79F" />
          <stop offset="50%" stopColor="#F5B041" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>
      <path d="M15,2 L18.5,11 L28,11 L20.5,17 L23,26.5 L15,20.5 L7,26.5 L9.5,17 L2,11 L11.5,11 Z"
        fill="url(#score-star-gold)" stroke="#D4A017" strokeWidth="0.8" />
    </svg>
  );
}

/* ─── Witch SVG ─── */

function WitchSVG({ wobble }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 12px rgba(100,50,150,0.4))' }}>
      {/* Broom handle */}
      <rect x="10" y="72" width="80" height="5" rx="2.5" fill="#8B6914" />
      <rect x="12" y="73" width="75" height="2" rx="1" fill="#A07D1A" opacity="0.5" />
      {/* Broom bristles */}
      <path d="M5,68 Q0,75 5,82 L18,75 Z" fill="#D4A017" />
      <path d="M8,66 Q2,75 8,84 L20,75 Z" fill="#C4960F" />
      <path d="M3,70 L16,75 M4,72 L15,76 M3,78 L16,75 M4,80 L15,74" stroke="#B8890D" strokeWidth="0.8" opacity="0.5" />
      {/* Body / robe */}
      <ellipse cx="62" cy="68" rx="18" ry="22" fill="#7B2D8E" />
      <ellipse cx="62" cy="68" rx="18" ry="22" fill="url(#robe-grad)" />
      {/* Robe detail */}
      <path d="M52,58 Q62,52 72,58" fill="none" stroke="#9B59B6" strokeWidth="1.5" opacity="0.4" />
      {/* Head */}
      <circle cx="62" cy="42" r="16" fill="#FDDCB5" />
      <circle cx="60" cy="40" r="14" fill="#FDE8CC" opacity="0.3" />
      {/* Hat */}
      <path d="M40,44 L62,6 L84,44 Z" fill="#2D1B4E" />
      <path d="M52,44 L62,12 L72,44 Z" fill="#3D2B5E" opacity="0.4" />
      <ellipse cx="62" cy="44" rx="26" ry="6" fill="#3D2B5E" />
      {/* Hat band */}
      <rect x="48" y="40" width="28" height="5" rx="2" fill="#F5B041" />
      {/* Hat buckle */}
      <rect x="57" y="39" width="10" height="7" rx="1.5" fill="none" stroke="#D4A017" strokeWidth="1.5" />
      <rect x="60" y="40" width="4" height="5" rx="1" fill="#F5B041" />
      {/* Eyes */}
      <circle cx="55" cy="40" r="3" fill="#1e293b" />
      <circle cx="69" cy="40" r="3" fill="#1e293b" />
      <circle cx="56" cy="39" r="1.2" fill="white" />
      <circle cx="70" cy="39" r="1.2" fill="white" />
      {/* Happy mouth */}
      <path d={wobble
        ? "M56,50 Q62,54 68,50"
        : "M55,48 Q62,56 69,48"
      } fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="50" cy="46" r="4" fill="#fda4af" opacity="0.35" />
      <circle cx="74" cy="46" r="4" fill="#fda4af" opacity="0.35" />
      {/* Cape / scarf trail */}
      <path d="M44,60 Q30,55 20,62 Q28,65 44,66" fill="#9B59B6" opacity="0.7" />
      <path d="M44,62 Q32,58 24,64" fill="none" stroke="#A96BC5" strokeWidth="1" opacity="0.4" />
      <defs>
        <radialGradient id="robe-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7B2D8E" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Star Collectable ─── */

function StarCollectable({ star }) {
  return (
    <motion.div
      key={star.id}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      style={{
        position: 'absolute',
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: '6vmin',
        height: '6vmin',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <GoldenStarSVG />
    </motion.div>
  );
}

export default function WitchFlight() {
  const [witchY, setWitchY] = useState(45);
  const [obstacles, setObstacles] = useState([]);
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [wobble, setWobble] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [started, setStarted] = useState(false);
  const [milestone, setMilestone] = useState(0);

  const witchYRef = useRef(45);
  const obstaclesRef = useRef([]);
  const starsRef = useRef([]);
  const frameRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const starTimerRef = useRef(null);
  const gameAreaRef = useRef(null);
  const touchStartRef = useRef(null);
  const scoreRef = useRef(0);
  const distanceRef = useRef(0);
  const wobbleTimeoutRef = useRef(null);

  const { peek: arthurPeek, ArthurPeekComponent } = useArthurPeek();
  const { celebrate, CelebrationComponent } = useCelebration();

  const handlePointerDown = useCallback((e) => {
    if (!started) {
      setStarted(true);
      return;
    }
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    touchStartRef.current = { startY: e.clientY, witchStartY: witchYRef.current };
    witchYRef.current = Math.max(5, Math.min(85, y - 7));
    setWitchY(witchYRef.current);
  }, [started]);

  const handlePointerMove = useCallback((e) => {
    if (!started) return;
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    witchYRef.current = Math.max(5, Math.min(85, y - 7));
    setWitchY(witchYRef.current);
  }, [started]);

  const spawnObstacle = useCallback(() => {
    const template = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
    const ob = {
      ...template,
      id: ++nextId,
      x: 105,
      y: randomBetween(5, 80),
    };
    obstaclesRef.current = [...obstaclesRef.current, ob];
    setObstacles([...obstaclesRef.current]);
  }, []);

  const spawnStar = useCallback(() => {
    const st = {
      id: ++nextId,
      x: 105,
      y: randomBetween(10, 75),
    };
    starsRef.current = [...starsRef.current, st];
    setStars([...starsRef.current]);
  }, []);

  const checkCollision = useCallback((witchTop, obsList, starList) => {
    const wLeft = WITCH_X - 2;
    const wRight = WITCH_X + WITCH_SIZE - 2;
    const wTop = witchTop;
    const wBottom = witchTop + WITCH_SIZE;

    for (const ob of obsList) {
      if (ob.hit) continue;
      const oLeft = ob.x;
      const oRight = ob.x + ob.w;
      const oTop = ob.y;
      const oBottom = ob.y + ob.h;
      const shrink = 0.3;
      const sw = (oRight - oLeft) * shrink;
      const sh = (oBottom - oTop) * shrink;
      if (wRight > oLeft + sw && wLeft < oRight - sw &&
          wBottom > oTop + sh && wTop < oBottom - sh) {
        ob.hit = true;
        playBoing();
        setWobble(true);
        if (wobbleTimeoutRef.current) clearTimeout(wobbleTimeoutRef.current);
        wobbleTimeoutRef.current = setTimeout(() => setWobble(false), 500);
      }
    }

    for (const st of starList) {
      if (st.collected) continue;
      const sLeft = st.x;
      const sRight = st.x + 6;
      const sTop = st.y;
      const sBottom = st.y + 6;
      if (wRight > sLeft && wLeft < sRight && wBottom > sTop && wTop < sBottom) {
        st.collected = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
        playCollectPing();

        setSparkles(prev => [...prev, { id: nextId++, x: st.x, y: st.y }]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== st.id)), 600);

        if (scoreRef.current % 5 === 0) {
          playSparkle();
          arthurPeek('excited');
        }
        if (scoreRef.current % 10 === 0 && scoreRef.current > milestone) {
          setMilestone(scoreRef.current);
          playCelebrate();
          celebrate();
        }
      }
    }
  }, [arthurPeek, celebrate, milestone]);

  useEffect(() => {
    if (!started) return;

    let running = true;

    function tick() {
      if (!running) return;

      obstaclesRef.current = obstaclesRef.current
        .map(ob => ({ ...ob, x: ob.x - OBSTACLE_SPEED }))
        .filter(ob => ob.x > -20);
      setObstacles([...obstaclesRef.current]);

      starsRef.current = starsRef.current
        .map(st => ({ ...st, x: st.x - STAR_SPEED }))
        .filter(st => st.x > -10 && !st.collected);
      setStars([...starsRef.current]);

      distanceRef.current += 0.05;
      setDistance(Math.floor(distanceRef.current));

      checkCollision(witchYRef.current, obstaclesRef.current, starsRef.current);

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    spawnTimerRef.current = setInterval(spawnObstacle, SPAWN_INTERVAL);
    starTimerRef.current = setInterval(spawnStar, STAR_INTERVAL);

    return () => {
      running = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (starTimerRef.current) clearInterval(starTimerRef.current);
    };
  }, [started, spawnObstacle, spawnStar, checkCollision]);

  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => playWhoosh(), 4000);
    return () => clearInterval(iv);
  }, [started]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none', background: 'linear-gradient(to bottom, #1a1040 0%, #2d1b69 30%, #4a2c8a 60%, #1a1040 100%)' }}
    >
      <BackButton />

      {/* Moon */}
      <div className="absolute" style={{ top: '6%', right: '10%', width: '12vmin', height: '12vmin' }}>
        <div className="w-full h-full rounded-full" style={{
          background: 'radial-gradient(circle at 40% 40%, #FFF8DC, #F5DEB3, #DAA520)',
          boxShadow: '0 0 40px rgba(255,248,220,0.5), 0 0 80px rgba(255,248,220,0.2)',
        }} />
        {/* Moon craters */}
        <div className="absolute rounded-full" style={{
          top: '30%', left: '25%', width: '18%', height: '18%',
          background: 'rgba(180,160,100,0.2)', borderRadius: '50%',
        }} />
        <div className="absolute rounded-full" style={{
          top: '55%', left: '50%', width: '12%', height: '12%',
          background: 'rgba(180,160,100,0.15)', borderRadius: '50%',
        }} />
      </div>

      {/* Twinkling stars background — rendered as tiny SVG diamonds */}
      {[...Array(20)].map((_, i) => (
        <svg key={i} className="absolute animate-pulse" style={{
          left: `${5 + (i * 37 + i * i * 13) % 90}%`,
          top: `${3 + (i * 23 + i * 7) % 45}%`,
          width: `${6 + (i % 3) * 3}px`,
          height: `${6 + (i % 3) * 3}px`,
          opacity: 0.4 + (i % 4) * 0.15,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${1.5 + (i % 3) * 0.5}s`,
        }} viewBox="0 0 10 10">
          <path d="M5,0 L6,4 L10,5 L6,6 L5,10 L4,6 L0,5 L4,4 Z" fill="#FFF8DC" />
        </svg>
      ))}

      {/* Ground silhouette */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '15%' }}>
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,80 Q100,30 200,70 Q300,40 400,65 Q500,25 600,60 Q700,40 800,55 Q900,30 1000,70 L1000,150 L0,150 Z"
            fill="#0a0a1a" />
          {/* Trees silhouettes */}
          <path d="M80,80 L95,30 L110,80 Z" fill="#0d0d20" />
          <path d="M250,65 L265,20 L280,65 Z" fill="#0d0d20" />
          <path d="M450,60 L470,10 L490,60 Z" fill="#0d0d20" />
          <path d="M680,55 L695,15 L710,55 Z" fill="#0d0d20" />
          <path d="M880,60 L898,18 L916,60 Z" fill="#0d0d20" />
          {/* Bushes */}
          <ellipse cx="160" cy="78" rx="25" ry="12" fill="#0d0d20" />
          <ellipse cx="380" cy="68" rx="20" ry="10" fill="#0d0d20" />
          <ellipse cx="580" cy="62" rx="22" ry="11" fill="#0d0d20" />
          <ellipse cx="800" cy="58" rx="18" ry="9" fill="#0d0d20" />
        </svg>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="absolute inset-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{ touchAction: 'none' }}
      >
        {/* Witch */}
        <motion.div
          animate={{
            top: `${witchY}%`,
            rotate: wobble ? [0, -15, 15, -10, 5, 0] : 0,
            scale: wobble ? [1, 0.9, 1.1, 1] : 1,
          }}
          transition={{
            top: { type: 'spring', stiffness: 200, damping: 20 },
            rotate: { duration: 0.5 },
            scale: { duration: 0.4 },
          }}
          style={{
            position: 'absolute',
            left: `${WITCH_X}%`,
            width: `${WITCH_SIZE}vmin`,
            height: `${WITCH_SIZE}vmin`,
            zIndex: 20,
          }}
        >
          <WitchSVG wobble={wobble} />
          {/* Trail sparkles */}
          {started && (
            <div className="absolute" style={{ right: '60%', top: '50%' }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  animate={{
                    x: [0, -20 - i * 15],
                    opacity: [0.8, 0],
                    scale: [1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeOut',
                  }}
                  style={{
                    width: `${4 - i}px`,
                    height: `${4 - i}px`,
                    background: ['#F5B041', '#E8DAEF', '#F9E79F'][i],
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Obstacles — illustrated SVGs */}
        <AnimatePresence>
          {obstacles.map(ob => (
            <motion.div
              key={ob.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: ob.hit ? 0.3 : 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                left: `${ob.x}%`,
                top: `${ob.y}%`,
                width: `${ob.w}vmin`,
                height: `${ob.h}vmin`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 5,
                transition: 'opacity 0.2s',
              }}
            >
              <ObstacleSVG type={ob.type} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Collectible stars */}
        <AnimatePresence>
          {stars.map(st => (
            <StarCollectable key={st.id} star={st} />
          ))}
        </AnimatePresence>

        {/* Collection sparkles */}
        <AnimatePresence>
          {sparkles.map(sp => (
            <motion.div
              key={sp.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                left: `${sp.x}%`,
                top: `${sp.y}%`,
                width: '6vmin',
                height: '6vmin',
                pointerEvents: 'none',
                zIndex: 30,
              }}
            >
              <div className="w-full h-full rounded-full" style={{
                background: 'radial-gradient(circle, #F5B041, transparent)',
              }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Score display — illustrated star */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full z-30"
        style={{ background: 'rgba(45,27,78,0.7)', backdropFilter: 'blur(8px)' }}>
        <ScoreStarSVG />
        <span className="text-2xl font-bold text-amber-300 font-heading">{score}</span>
      </div>

      {/* Start screen */}
      {!started && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ background: 'rgba(15,8,40,0.6)' }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mb-8"
          >
            <div style={{ width: '30vmin', height: '30vmin' }}>
              <WitchSVG wobble={false} />
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="px-10 py-6 rounded-3xl text-center"
            style={{ background: 'rgba(75,40,130,0.8)', backdropFilter: 'blur(8px)' }}
          >
            {/* Illustrated sparkle icons instead of emoji */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg viewBox="0 0 30 30" width="36" height="36">
                <path d="M15,2 L17.5,11 L27,13 L17.5,15 L15,24 L12.5,15 L3,13 L12.5,11 Z" fill="#F5B041" />
                <path d="M15,5 L16.5,11.5 L13.5,11.5 Z" fill="#FFF8DC" opacity="0.5" />
              </svg>
              <div style={{ width: '14vmin', height: '14vmin' }}>
                <WitchSVG wobble={false} />
              </div>
              <svg viewBox="0 0 30 30" width="36" height="36">
                <path d="M15,2 L17.5,11 L27,13 L17.5,15 L15,24 L12.5,15 L3,13 L12.5,11 Z" fill="#F5B041" />
                <path d="M15,5 L16.5,11.5 L13.5,11.5 Z" fill="#FFF8DC" opacity="0.5" />
              </svg>
            </div>
            <div className="text-3xl font-heading text-amber-300">Tap to Fly!</div>
          </motion.div>
        </motion.div>
      )}

      {ArthurPeekComponent}
      {CelebrationComponent}
    </div>
  );
}
