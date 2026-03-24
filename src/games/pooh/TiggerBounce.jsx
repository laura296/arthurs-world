import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import { playBoing, playPop, playSuccess, playSparkle, playFanfare, playCollectPing } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/* ══════════════════════════════════════════════
   TIGGER'S BOUNCE
   Tigger auto-bounces. Tap left/right to steer.
   Collect stars and honey, avoid puddles.
   Bouncy, springy, joyful.
   ══════════════════════════════════════════════ */

const STAR_COLORS = ['#fbbf24', '#f59e0b', '#fde68a'];

const KF = `
@keyframes tigger-land { 0% { transform: scaleY(1) scaleX(1); } 30% { transform: scaleY(0.7) scaleX(1.3); } 60% { transform: scaleY(1.15) scaleX(0.9); } 100% { transform: scaleY(1) scaleX(1); } }
@keyframes tigger-air { 0% { transform: rotate(0); } 25% { transform: rotate(8deg); } 75% { transform: rotate(-8deg); } 100% { transform: rotate(0); } }
@keyframes star-float { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-6px) rotate(15deg); } }
@keyframes puddle-ripple { 0% { transform: scaleX(1); } 50% { transform: scaleX(1.05); } 100% { transform: scaleX(1); } }
@keyframes splash { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2) translateY(-20px); opacity: 0; } }
@keyframes bounce-number { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-40px) scale(1.3); opacity: 0; } }
`;

/* ── SVG: Tigger (bouncing) ── */
function TiggerSprite({ phase: bouncePhase, facing }) {
  const scaleX = facing === 'left' ? -1 : 1;
  return (
    <svg width="70" height={bouncePhase === 'air' ? 120 : 75} viewBox={bouncePhase === 'air' ? '0 0 70 120' : '0 0 70 75'}
      style={{
        transform: `scaleX(${scaleX})`,
        animation: bouncePhase === 'air' ? 'tigger-air 0.4s ease-in-out' : bouncePhase === 'land' ? 'tigger-land 0.3s ease-out' : undefined,
      }}>
      {/* Tail */}
      <path d="M56 48 Q68 40 62 30 Q58 22 64 16" fill="none" stroke="#e8943a" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 44 Q64 38 61 32" fill="none" stroke="#3d2414" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Body */}
      <ellipse cx="35" cy="48" rx="18" ry="20" fill="#f0a030" />
      <ellipse cx="35" cy="48" rx="18" ry="20" fill="none" stroke="#c47820" strokeWidth="1" />
      {/* Belly */}
      <ellipse cx="35" cy="50" rx="11" ry="13" fill="#fcd88a" />
      {/* Stripes */}
      <path d="M20 40 Q26 38 32 40" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 40 Q44 38 50 40" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 48 Q24 46 30 48" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 48 Q46 46 51 48" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 56 Q26 54 32 56" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 56 Q44 54 50 56" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
      {/* Head */}
      <circle cx="35" cy="22" r="15" fill="#f0a030" stroke="#c47820" strokeWidth="1" />
      {/* Ears */}
      <ellipse cx="23" cy="10" rx="5" ry="7" fill="#f0a030" stroke="#c47820" strokeWidth="0.8" />
      <ellipse cx="23" cy="10" rx="2.5" ry="4" fill="#fcd88a" />
      <ellipse cx="47" cy="10" rx="5" ry="7" fill="#f0a030" stroke="#c47820" strokeWidth="0.8" />
      <ellipse cx="47" cy="10" rx="2.5" ry="4" fill="#fcd88a" />
      {/* Face */}
      <ellipse cx="35" cy="26" rx="8" ry="6" fill="#fcd88a" />
      {/* Eyes — big and excited */}
      <circle cx="29" cy="20" r="3" fill="#3d2414" />
      <circle cx="30" cy="19" r="1" fill="white" />
      <circle cx="41" cy="20" r="3" fill="#3d2414" />
      <circle cx="42" cy="19" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="35" cy="24" rx="3" ry="2" fill="#3d2414" />
      {/* Big grin */}
      <path d="M27 28 Q35 36 43 28" fill="none" stroke="#3d2414" strokeWidth="1.5" strokeLinecap="round" />
      {/* Spring legs — dramatically extended in air, squashed flat on land */}
      {bouncePhase === 'air' ? (
        <>
          {/* Left spring — fully stretched with 4 wide coils */}
          <path d="M26 66 Q18 72 34 78 Q46 84 20 90 Q10 96 34 102 Q42 106 26 112" fill="none" stroke="#c47820" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right spring — fully stretched with 4 wide coils */}
          <path d="M44 66 Q52 72 36 78 Q24 84 50 90 Q60 96 36 102 Q28 106 44 112" fill="none" stroke="#c47820" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left spring — pancake-flat compressed */}
          <path d="M26 66 Q22 66.5 30 67 Q36 67.5 24 68 Q20 68.3 30 68.6 Q36 68.9 26 69" fill="none" stroke="#c47820" strokeWidth="4" strokeLinecap="round" />
          {/* Right spring — pancake-flat compressed */}
          <path d="M44 66 Q48 66.5 40 67 Q34 67.5 46 68 Q50 68.3 40 68.6 Q34 68.9 44 69" fill="none" stroke="#c47820" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {/* Feet — way down in air, tucked tight on land */}
      <ellipse cx="30" cy={bouncePhase === 'air' ? 115 : 71} rx={bouncePhase === 'air' ? 6 : 8} ry={bouncePhase === 'air' ? 3 : 2.5} fill="#f0a030" stroke="#c47820" strokeWidth="0.8" />
      <ellipse cx="40" cy={bouncePhase === 'air' ? 115 : 71} rx={bouncePhase === 'air' ? 6 : 8} ry={bouncePhase === 'air' ? 3 : 2.5} fill="#f0a030" stroke="#c47820" strokeWidth="0.8" />
    </svg>
  );
}

/* ── SVG: Star collectible ── */
function StarItem({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ animation: 'star-float 1.5s ease-in-out infinite' }}>
      <polygon points="14,2 17,10 26,10 19,15 21.5,24 14,19 6.5,24 9,15 2,10 11,10"
        fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <polygon points="14,6 16,11 21,11 17,14 18.5,20 14,17 9.5,20 11,14 7,11 12,11"
        fill="#fde68a" opacity="0.6" />
    </svg>
  );
}

/* ── SVG: Honey jar ── */
function HoneyJar({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ animation: 'star-float 2s ease-in-out infinite' }}>
      <path d="M7 8 Q7 4 14 4 Q21 4 21 8 L22 22 Q22 26 14 26 Q6 26 5 22Z"
        fill="#d4943a" stroke="#8B6E4E" strokeWidth="0.8" />
      <ellipse cx="14" cy="15" rx="5" ry="4" fill="#f59e0b" opacity="0.6" />
      <ellipse cx="14" cy="7" rx="6" ry="2" fill="#f59e0b" opacity="0.7" />
    </svg>
  );
}

/* ── SVG: Puddle (avoid) ── */
function PuddleSVG({ w }) {
  return (
    <svg width={w} height={w * 0.35} viewBox="0 0 60 20" style={{ animation: 'puddle-ripple 2s ease-in-out infinite' }}>
      <ellipse cx="30" cy="12" rx="28" ry="8" fill="#6ba3c8" opacity="0.6" />
      <ellipse cx="30" cy="11" rx="22" ry="5" fill="#87CEEB" opacity="0.4" />
      <ellipse cx="26" cy="10" rx="10" ry="3" fill="#a8d8f0" opacity="0.3" />
    </svg>
  );
}

/* ── SVG: Bee (avoid) ── */
function BeeSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30"
      style={{ animation: 'star-float 0.6s ease-in-out infinite' }}>
      {/* Wings */}
      <ellipse cx="10" cy="10" rx="6" ry="3.5" fill="rgba(200,220,255,0.5)" />
      <ellipse cx="20" cy="10" rx="6" ry="3.5" fill="rgba(200,220,255,0.5)" />
      {/* Body */}
      <ellipse cx="15" cy="17" rx="7" ry="9" fill="#fbbf24" stroke="#6b4c2a" strokeWidth="0.8" />
      {/* Stripes */}
      <rect x="9" y="14" width="12" height="2" rx="1" fill="#3d2414" />
      <rect x="9.5" y="19" width="11" height="2" rx="1" fill="#3d2414" />
      {/* Eyes */}
      <circle cx="12" cy="12" r="1.5" fill="white" />
      <circle cx="18" cy="12" r="1.5" fill="white" />
      <circle cx="12.3" cy="12.3" r="0.7" fill="#3d2414" />
      <circle cx="18.3" cy="12.3" r="0.7" fill="#3d2414" />
      {/* Stinger */}
      <path d="M15 26 L15 29" stroke="#6b4c2a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ── Score popup ── */
function ScorePopup({ x, y, pts }) {
  return (
    <div className="absolute pointer-events-none z-20 font-heading text-amber-300 text-xl drop-shadow-lg"
      style={{ left: x - 12, top: y - 20, animation: 'bounce-number 0.8s ease-out forwards' }}>
      +{pts}
    </div>
  );
}

/* ── Ground with grass ── */
function Ground({ groundY }) {
  return (
    <div className="absolute left-0 right-0 pointer-events-none" style={{ top: groundY }}>
      <svg className="w-full" height="80" preserveAspectRatio="none" viewBox="0 0 400 80">
        <rect x="0" y="20" width="400" height="60" fill="#5a8c3c" />
        <path d="M0 20 Q50 10 100 20 Q150 30 200 18 Q250 8 300 22 Q350 30 400 16 L400 80 L0 80Z"
          fill="#6b9e4c" />
        <path d="M0 30 Q60 20 120 30 Q180 38 240 26 Q300 18 360 32 Q380 36 400 28 L400 80 L0 80Z"
          fill="#5a8c3c" opacity="0.7" />
        {/* Grass blades */}
        {Array.from({ length: 20 }).map((_, i) => (
          <path key={i} d={`M${i * 20 + 5} 20 Q${i * 20 + 8} 10 ${i * 20 + 11} 20`}
            fill="none" stroke="#78b45c" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        ))}
      </svg>
    </div>
  );
}

/* ── Spawn a collectible/obstacle ── */
function spawnItem(id, w, groundY, score) {
  const beeChance = Math.min(0.15 + score * 0.003, 0.25);
  const rand = Math.random();
  let type;
  if (rand > 0.92) type = 'honey';
  else if (rand > (1 - beeChance)) type = 'bee';
  else if (rand > 0.65) type = 'puddle';
  else type = 'star';

  const isGround = type === 'puddle';
  const yMin = isGround ? groundY - 10 : groundY - 200;
  const yMax = isGround ? groundY - 10 : groundY - 60;

  return {
    id,
    type,
    x: 40 + Math.random() * (w - 80),
    y: isGround ? yMin : yMin + Math.random() * (yMax - yMin),
    size: type === 'puddle' ? 60 + Math.random() * 20 : type === 'honey' ? 32 : type === 'bee' ? 34 : 28,
    collected: false,
  };
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function TiggerBounce() {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('intro');
  const [dims, setDims] = useState({ w: 400, h: 700 });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bounces, setBounces] = useState(0);
  const [tiggerX, setTiggerX] = useState(200);
  const [tiggerY, setTiggerY] = useState(0);
  const [tiggerVY, setTiggerVY] = useState(0);
  const [facing, setFacing] = useState('right');
  const [bouncePhase, setBouncePhase] = useState('air');
  const [items, setItems] = useState([]);
  const [popups, setPopups] = useState([]);
  const [splashAt, setSplashAt] = useState(null);
  const nextIdRef = useRef(0);
  const bouncesRef = useRef(0);
  const scoreRef = useRef(0);
  const tiggerXRef = useRef(200);
  const tiggerYRef = useRef(0);
  const vxRef = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const groundY = dims.h * 0.72;

  // Inject keyframes
  useEffect(() => {
    const id = 'tigger-bounce-kf';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = KF;
      document.head.appendChild(s);
    }
  }, []);

  // Measure
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Tap to steer left/right — velocity-based smooth slide
  const handleTap = useCallback((e) => {
    if (phase !== 'playing') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const tapX = e.clientX - rect.left;
    const mid = dims.w / 2;
    const dir = tapX < mid ? 'left' : 'right';
    setFacing(dir);
    vxRef.current = dir === 'left' ? -8 : 8;
  }, [phase, dims.w]);

  // Auto-bounce physics — uses refs for bounces/score to avoid restarting the rAF loop
  useEffect(() => {
    if (phase !== 'playing') return;
    let running = true;
    let vy = -10;
    let ty = groundY - 80;
    let lastTime = performance.now();

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 16, 3); // cap at 3 frames
      lastTime = now;

      vy += 0.55 * dt; // gravity
      ty += vy * dt;

      // Apply horizontal velocity (smooth steering)
      const vx = vxRef.current;
      if (Math.abs(vx) > 0.1) {
        const newX = Math.max(35, Math.min(dims.w - 35, tiggerXRef.current + vx * dt));
        tiggerXRef.current = newX;
        setTiggerX(newX);
        vxRef.current *= 0.92; // decay
      } else if (vxRef.current !== 0) {
        vxRef.current = 0;
      }

      // Hit ground — bounce!
      if (ty >= groundY - 80) {
        ty = groundY - 80;
        vy = -(9 + Math.min(bouncesRef.current * 0.1, 3)); // bounce velocity
        setBouncePhase('land');
        playBoing();
        bouncesRef.current += 1;
        setBounces(bouncesRef.current);
        setTimeout(() => setBouncePhase('air'), 150);

        // Spawn new items periodically
        if (bouncesRef.current % 2 === 0) {
          setItems(prev => {
            if (prev.filter(i => !i.collected).length < 6) {
              const newItems = [];
              const count = 2 + Math.floor(Math.random() * 2);
              for (let i = 0; i < count; i++) {
                newItems.push(spawnItem(nextIdRef.current++, dims.w, groundY, scoreRef.current));
              }
              return [...prev.filter(i => !i.collected), ...newItems];
            }
            return prev;
          });
        }
      }

      tiggerYRef.current = ty;
      setTiggerY(ty);
      setTiggerVY(vy);
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(id); };
  }, [phase, groundY, dims.w]);

  // Collision detection — uses refs for tiggerX/tiggerY to avoid interval churn
  useEffect(() => {
    if (phase !== 'playing') return;
    const checkInterval = setInterval(() => {
      const tx = tiggerXRef.current;
      const ty = tiggerYRef.current;
      setItems(prev => {
        let changed = false;
        const updated = prev.map(item => {
          if (item.collected) return item;
          const dx = item.x - tx;
          const dy = item.y - ty;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hitDist = item.type === 'puddle' ? 40 : 35;

          if (dist < hitDist) {
            changed = true;
            if (item.type === 'puddle') {
              // Splash! Lose streak
              setSplashAt({ x: item.x, y: item.y, t: Date.now() });
              setStreak(0);
              playPop();
              setTimeout(() => setSplashAt(null), 600);
              return { ...item, collected: true };
            }
            if (item.type === 'bee') {
              // Ouch! Lose streak
              setStreak(0);
              playPop();
              burst(item.x, item.y, { colors: ['#ef4444', '#f97316'] });
              return { ...item, collected: true };
            }
            // Star or honey — collect!
            const pts = item.type === 'honey' ? 3 : 1;
            scoreRef.current += pts;
            setScore(scoreRef.current);
            if (scoreRef.current % 15 === 0 && scoreRef.current > 0) {
              playFanfare();
              peek('excited');
              celebrate();
            }
            setStreak(s => {
              const ns = s + 1;
              if (ns >= 5) playSparkle();
              return ns;
            });
            setPopups(p => [...p, { id: Date.now(), x: item.x, y: item.y, pts }]);
            playCollectPing();
            burst(item.x, item.y, { colors: STAR_COLORS });
            return { ...item, collected: true };
          }
          return item;
        });
        return changed ? updated : prev;
      });
    }, 50);
    return () => clearInterval(checkInterval);
  }, [phase, burst, peek, celebrate]);

  // Clean up popups
  useEffect(() => {
    if (popups.length === 0) return;
    const t = setTimeout(() => setPopups(p => p.slice(1)), 900);
    return () => clearTimeout(t);
  }, [popups]);

  // Game ends after 30 bounces
  useEffect(() => {
    if (phase === 'playing' && bounces >= 30) {
      setPhase('gameOver');
      if (score >= 20) {
        playFanfare();
        celebrate();
      } else {
        playSuccess();
      }
    }
  }, [bounces, phase, score, celebrate]);

  const handleStart = useCallback(() => {
    setScore(0);
    setStreak(0);
    setBounces(0);
    scoreRef.current = 0;
    bouncesRef.current = 0;
    tiggerXRef.current = dims.w / 2;
    tiggerYRef.current = groundY - 80;
    vxRef.current = 0;
    setTiggerX(dims.w / 2);
    setTiggerY(groundY - 80);
    setItems([]);
    setPopups([]);
    nextIdRef.current = 0;
    // Spawn initial items
    const initial = [];
    for (let i = 0; i < 4; i++) {
      initial.push(spawnItem(nextIdRef.current++, dims.w, groundY, 0));
    }
    setItems(initial);
    setPhase('playing');
    playBoing();
  }, [dims.w, groundY]);

  // Star rating
  const starCount = score >= 25 ? 3 : score >= 12 ? 2 : 1;

  // Trees background
  const trees = useMemo(() => [
    { x: 5, h: 140, opacity: 0.2 },
    { x: 25, h: 160, opacity: 0.15 },
    { x: 60, h: 150, opacity: 0.18 },
    { x: 82, h: 135, opacity: 0.2 },
  ], []);

  return (
    <div ref={containerRef} onPointerDown={handleTap}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #a8d8f0 40%, #c8e8c0 65%, #a0c878 85%, #78a850 100%)' }}>
      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      {/* Trees */}
      {trees.map((t, i) => (
        <svg key={i} className="absolute pointer-events-none" style={{ bottom: dims.h - groundY, left: `${t.x}%`, opacity: t.opacity }}
          width="60" height={t.h} viewBox="0 0 60 160">
          <rect x="24" y="60" width="12" height="100" rx="3" fill="#5c3a1e" />
          <ellipse cx="30" cy="40" rx="28" ry="38" fill="#4a7c4a" />
          <ellipse cx="26" cy="32" rx="18" ry="24" fill="#5a8c5a" opacity="0.6" />
        </svg>
      ))}

      {/* Ground */}
      <Ground groundY={groundY} />

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div style={{ animation: 'tigger-air 1s ease-in-out infinite' }}>
            <TiggerSprite phase="air" facing="right" />
          </div>
          {/* Visual arrows showing left/right tap */}
          <div className="flex items-center gap-8 mt-4 mb-6">
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'star-float 1.5s ease-in-out infinite' }}>
              <circle cx="22" cy="22" r="20" fill="#f59e0b" opacity="0.3" />
              <path d="M26 14 L16 22 L26 30" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <StarItem size={32} />
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'star-float 1.5s ease-in-out infinite reverse' }}>
              <circle cx="22" cy="22" r="20" fill="#f59e0b" opacity="0.3" />
              <path d="M18 14 L28 22 L18 30" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button onClick={handleStart}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-heading text-xl
                       px-12 py-5 rounded-full shadow-xl transition-all border-2 border-orange-600
                       w-24 h-24 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="14,8 32,20 14,32" fill="white" />
            </svg>
          </button>
        </div>
      )}

      {/* ── HUD ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">
          <div className="bg-amber-800/50 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 22 22">
              <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8" fill="#fbbf24" />
            </svg>
            <span className="text-lg font-heading text-white">{score}</span>
          </div>
          {streak >= 3 && (
            <div className="bg-red-600/60 backdrop-blur-sm rounded-2xl px-2 py-1 animate-pulse">
              <span className="text-sm font-heading text-white">{streak}x</span>
            </div>
          )}
          {/* Visual bounce counter — paw prints that fill up */}
          <div className="bg-orange-800/40 backdrop-blur-sm rounded-xl px-2 py-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="10" height="10" viewBox="0 0 12 12"
                style={{ opacity: i < Math.ceil((30 - bounces) / 6) ? 1 : 0.2 }}>
                <circle cx="6" cy="8" r="3" fill="#fbbf24" />
                <circle cx="3" cy="4" r="1.5" fill="#fbbf24" />
                <circle cx="9" cy="4" r="1.5" fill="#fbbf24" />
                <circle cx="6" cy="3" r="1.5" fill="#fbbf24" />
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* ── ITEMS ── */}
      {phase === 'playing' && items.filter(i => !i.collected).map(item => (
        <div key={item.id} className="absolute pointer-events-none" style={{ left: item.x - item.size / 2, top: item.y - item.size / 2 }}>
          {item.type === 'star' && <StarItem size={item.size} />}
          {item.type === 'honey' && <HoneyJar size={item.size} />}
          {item.type === 'puddle' && <PuddleSVG w={item.size} />}
          {item.type === 'bee' && <BeeSVG size={item.size} />}
        </div>
      ))}

      {/* ── SCORE POPUPS ── */}
      {popups.map(p => <ScorePopup key={p.id} x={p.x} y={p.y} pts={p.pts} />)}

      {/* ── SPLASH ── */}
      {splashAt && (
        <div className="absolute pointer-events-none z-15" style={{ left: splashAt.x - 30, top: splashAt.y - 10 }}>
          <svg width="60" height="40" viewBox="0 0 60 40" style={{ animation: 'splash 0.6s ease-out forwards' }}>
            <ellipse cx="30" cy="30" rx="20" ry="6" fill="#87CEEB" opacity="0.5" />
            <path d="M15 25 Q10 15 18 20 M30 20 Q30 8 30 20 M45 25 Q50 15 42 20" fill="none" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* ── TIGGER ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <div className="absolute z-10 pointer-events-none"
          style={{ left: tiggerX - 35, top: tiggerY }}>
          <TiggerSprite phase={bouncePhase} facing={facing} />
        </div>
      )}

      {/* ── HINT — visual arrows, no text ── */}
      {phase === 'playing' && bounces < 4 && (
        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-between px-8 pointer-events-none">
          <svg width="50" height="50" viewBox="0 0 50 50" className="animate-pulse" style={{ opacity: 0.4 }}>
            <circle cx="25" cy="25" r="22" fill="#f59e0b" opacity="0.25" />
            <path d="M30 15 L18 25 L30 35" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="50" height="50" viewBox="0 0 50 50" className="animate-pulse" style={{ opacity: 0.4 }}>
            <circle cx="25" cy="25" r="22" fill="#f59e0b" opacity="0.25" />
            <path d="M20 15 L32 25 L20 35" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === 'gameOver' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="bg-amber-50 rounded-3xl p-6 text-center shadow-2xl max-w-xs mx-4 border-2 border-orange-300"
            style={{ animation: 'tigger-land 0.5s ease-out' }}>
            <div className="mb-2">
              <TiggerSprite phase="land" facing="right" />
            </div>
            {/* Star rating — visual only */}
            <div className="flex gap-3 justify-center my-3">
              {[1, 2, 3].map(s => (
                <svg key={s} width={36} height={36} viewBox="0 0 22 22"
                  style={{
                    opacity: s <= starCount ? 1 : 0.2,
                    animation: s <= starCount ? `tigger-land 0.4s ease-out ${s * 0.2}s backwards` : 'none',
                  }}>
                  <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                    fill={s <= starCount ? '#fbbf24' : '#d1d5db'} stroke={s <= starCount ? '#d97706' : '#9ca3af'} strokeWidth="1" />
                </svg>
              ))}
            </div>
            {/* Score with honey icon */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 22 22">
                <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              </svg>
              <span className="text-4xl font-heading text-orange-600">{score}</span>
            </div>
            <button onClick={handleStart}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-heading text-lg
                         w-20 h-20 rounded-full shadow-lg transition-all border-2 border-orange-600
                         flex items-center justify-center mx-auto">
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path d="M12 4 A8 8 0 1 1 4 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 4 L8 1 M12 4 L8 7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
