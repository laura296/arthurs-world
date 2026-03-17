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
 */

const GAME_W = 100; // vw units
const GAME_H = 100; // vh units
const WITCH_X = 18;  // witch stays at 18% from left
const WITCH_SIZE = 14; // vmin
const OBSTACLE_SPEED = 0.6; // vw per frame (~60fps)
const STAR_SPEED = 0.5;
const SPAWN_INTERVAL = 1800; // ms between obstacles
const STAR_INTERVAL = 2800;

const OBSTACLES = [
  { type: 'tree', emoji: '🌲', w: 10, h: 18 },
  { type: 'bat', emoji: '🦇', w: 10, h: 10 },
  { type: 'cloud', emoji: '☁️', w: 14, h: 10 },
  { type: 'pumpkin', emoji: '🎃', w: 10, h: 10 },
  { type: 'owl', emoji: '🦉', w: 9, h: 10 },
];

let nextId = 0;

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function WitchSVG({ wobble }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 12px rgba(100,50,150,0.4))' }}>
      {/* Broom handle */}
      <rect x="10" y="72" width="80" height="5" rx="2.5" fill="#8B6914" />
      {/* Broom bristles */}
      <path d="M5,68 Q0,75 5,82 L18,75 Z" fill="#D4A017" />
      <path d="M8,66 Q2,75 8,84 L20,75 Z" fill="#C4960F" />
      {/* Body / robe */}
      <ellipse cx="62" cy="68" rx="18" ry="22" fill="#7B2D8E" />
      <ellipse cx="62" cy="68" rx="18" ry="22" fill="url(#robe-grad)" />
      {/* Head */}
      <circle cx="62" cy="42" r="16" fill="#FDDCB5" />
      {/* Hat */}
      <path d="M40,44 L62,6 L84,44 Z" fill="#2D1B4E" />
      <ellipse cx="62" cy="44" rx="26" ry="6" fill="#3D2B5E" />
      {/* Hat band */}
      <rect x="48" y="40" width="28" height="5" rx="2" fill="#F5B041" />
      {/* Hat star */}
      <text x="60" y="30" textAnchor="middle" fontSize="8" fill="#F5B041">⭐</text>
      {/* Eyes */}
      <circle cx="55" cy="40" r="3" fill="#1e293b" />
      <circle cx="69" cy="40" r="3" fill="#1e293b" />
      <circle cx="56" cy="39" r="1.2" fill="white" />
      <circle cx="70" cy="39" r="1.2" fill="white" />
      {/* Happy mouth */}
      <path d={wobble
        ? "M56,50 Q62,54 68,50" // surprised o-face when wobbling
        : "M55,48 Q62,56 69,48"  // big smile
      } fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="50" cy="46" r="4" fill="#fda4af" opacity="0.35" />
      <circle cx="74" cy="46" r="4" fill="#fda4af" opacity="0.35" />
      {/* Cape / scarf trail */}
      <path d="M44,60 Q30,55 20,62 Q28,65 44,66" fill="#9B59B6" opacity="0.7" />
      <defs>
        <radialGradient id="robe-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7B2D8E" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function StarCollectable({ star, onCollect }) {
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
        fontSize: '5vmin',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      ⭐
    </motion.div>
  );
}

export default function WitchFlight() {
  const [witchY, setWitchY] = useState(45); // % from top
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

  // Touch / pointer handling — drag to move witch up and down
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

  // Spawn obstacles
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

  // Spawn stars
  const spawnStar = useCallback(() => {
    const st = {
      id: ++nextId,
      x: 105,
      y: randomBetween(10, 75),
    };
    starsRef.current = [...starsRef.current, st];
    setStars([...starsRef.current]);
  }, []);

  // Collision check (simple box overlap)
  const checkCollision = useCallback((witchTop, obsList, starList) => {
    const wLeft = WITCH_X - 2;
    const wRight = WITCH_X + WITCH_SIZE - 2;
    const wTop = witchTop;
    const wBottom = witchTop + WITCH_SIZE;

    // Check obstacles
    for (const ob of obsList) {
      if (ob.hit) continue;
      const oLeft = ob.x;
      const oRight = ob.x + ob.w;
      const oTop = ob.y;
      const oBottom = ob.y + ob.h;
      // Generous hitbox — shrink by 30% for forgiveness
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

    // Check stars
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

        // Sparkle at star position
        setSparkles(prev => [...prev, { id: nextId++, x: st.x, y: st.y }]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== st.id)), 600);

        // Milestones
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

  // Game loop
  useEffect(() => {
    if (!started) return;

    let running = true;

    function tick() {
      if (!running) return;

      // Move obstacles
      obstaclesRef.current = obstaclesRef.current
        .map(ob => ({ ...ob, x: ob.x - OBSTACLE_SPEED }))
        .filter(ob => ob.x > -20);
      setObstacles([...obstaclesRef.current]);

      // Move stars
      starsRef.current = starsRef.current
        .map(st => ({ ...st, x: st.x - STAR_SPEED }))
        .filter(st => st.x > -10 && !st.collected);
      setStars([...starsRef.current]);

      // Distance counter
      distanceRef.current += 0.05;
      setDistance(Math.floor(distanceRef.current));

      // Collision
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

  // Whoosh sound periodically while flying
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
      </div>

      {/* Twinkling stars background */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{
          left: `${5 + (i * 37 + i * i * 13) % 90}%`,
          top: `${3 + (i * 23 + i * 7) % 45}%`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          opacity: 0.4 + (i % 4) * 0.15,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${1.5 + (i % 3) * 0.5}s`,
        }} />
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

        {/* Obstacles */}
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
                fontSize: `${Math.min(ob.w, ob.h) * 0.7}vmin`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 5,
                transition: 'opacity 0.2s',
              }}
            >
              {ob.emoji}
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

      {/* Score display */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full z-30"
        style={{ background: 'rgba(45,27,78,0.7)', backdropFilter: 'blur(8px)' }}>
        <span className="text-2xl">⭐</span>
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
            <div className="text-5xl mb-3">🧙‍♀️✨</div>
            <div className="text-3xl font-heading text-amber-300">Tap to Fly!</div>
          </motion.div>
        </motion.div>
      )}

      {ArthurPeekComponent}
      {CelebrationComponent}
    </div>
  );
}
