import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playBuzz, playSparkle, playFanfare } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/* ══════════════════════════════════════════════
   POOH'S BALLOON FLOAT
   Tap to float Pooh up on balloons, catch honey,
   avoid bees. Gentle, dreamy, forgiving.
   ══════════════════════════════════════════════ */

const BALLOON_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6'];
const HONEY_COLORS = ['#fbbf24', '#f59e0b', '#d97706'];

/* ── Keyframes ── */
const KF = `
@keyframes pooh-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
@keyframes cloud-drift { 0% { transform: translateX(0); } 100% { transform: translateX(-120%); } }
@keyframes bee-wobble { 0%,100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-4px) rotate(5deg); } 75% { transform: translateY(4px) rotate(-5deg); } }
@keyframes balloon-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes honey-spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
@keyframes star-burst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
`;

/* ── SVG: Pooh holding balloons ── */
function FloatingPooh({ balloonCount, reaction }) {
  const balloons = useMemo(() =>
    BALLOON_COLORS.slice(0, Math.max(1, balloonCount)).map((color, i) => ({
      color,
      x: 30 + (i - (balloonCount - 1) / 2) * 14,
      stringLen: 20 + Math.random() * 8,
    })),
    [balloonCount]
  );

  return (
    <svg width="100" height="140" viewBox="0 0 100 140"
      style={{ animation: 'pooh-float 2.5s ease-in-out infinite' }}>
      {/* Balloon strings */}
      {balloons.map((b, i) => (
        <line key={`s${i}`} x1={b.x + 7} y1={90 - b.stringLen} x2={50} y2={100}
          stroke="#8B6E4E" strokeWidth="0.8" opacity="0.6" />
      ))}
      {/* Balloons */}
      {balloons.map((b, i) => (
        <g key={`b${i}`} style={{ animation: `balloon-sway ${1.5 + i * 0.3}s ease-in-out infinite`, transformOrigin: `${b.x + 7}px ${90 - b.stringLen}px` }}>
          <ellipse cx={b.x + 7} cy={90 - b.stringLen - 16} rx="11" ry="14" fill={b.color} opacity="0.85" />
          <ellipse cx={b.x + 7} cy={90 - b.stringLen - 16} rx="11" ry="14" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <ellipse cx={b.x + 3} cy={90 - b.stringLen - 20} rx="3" ry="4" fill="white" opacity="0.3" />
          <path d={`M${b.x + 4} ${90 - b.stringLen - 2} Q${b.x + 7} ${90 - b.stringLen + 1} ${b.x + 10} ${90 - b.stringLen - 2}`}
            fill={b.color} opacity="0.7" />
        </g>
      ))}
      {/* Pooh body */}
      <g transform="translate(22, 88)">
        {/* Arms reaching up for strings */}
        <path d="M8 8 Q4 -2 12 -6" fill="none" stroke="#c4943a" strokeWidth="3" strokeLinecap="round" />
        <path d="M48 8 Q52 -2 44 -6" fill="none" stroke="#c4943a" strokeWidth="3" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="28" cy="20" rx="18" ry="18" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        {/* Red shirt */}
        <path d="M12 12 Q12 30 28 32 Q44 30 44 12 Q38 8 28 7 Q18 8 12 12Z"
          fill="#c0392b" stroke="#962d22" strokeWidth="0.8" />
        {/* Head */}
        <circle cx="28" cy="-2" r="14" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
        {/* Ears */}
        <circle cx="16" cy="-12" r="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        <circle cx="16" cy="-12" r="3" fill="#d4a54a" />
        <circle cx="40" cy="-12" r="6" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
        <circle cx="40" cy="-12" r="3" fill="#d4a54a" />
        {/* Eyes */}
        {reaction === 'sting' ? (
          <>
            <text x="23" y="0" fontSize="5" fill="#3d2414" textAnchor="middle">X</text>
            <text x="33" y="0" fontSize="5" fill="#3d2414" textAnchor="middle">X</text>
          </>
        ) : (
          <>
            <circle cx="23" cy="-3" r="2.5" fill="#3d2414" />
            <circle cx="24" cy="-4" r="0.8" fill="white" />
            <circle cx="33" cy="-3" r="2.5" fill="#3d2414" />
            <circle cx="34" cy="-4" r="0.8" fill="white" />
          </>
        )}
        {/* Nose */}
        <ellipse cx="28" cy="3" rx="3" ry="2" fill="#3d2414" />
        {/* Mouth */}
        {reaction === 'catch' ? (
          <path d="M22 7 Q28 14 34 7" fill="none" stroke="#3d2414" strokeWidth="1.5" strokeLinecap="round" />
        ) : reaction === 'sting' ? (
          <circle cx="28" cy="8" r="2.5" fill="#3d2414" />
        ) : (
          <path d="M24 6 Q28 10 32 6" fill="none" stroke="#3d2414" strokeWidth="1.2" strokeLinecap="round" />
        )}
        {/* Legs dangling */}
        <ellipse cx="20" cy="36" rx="7" ry="5" fill="#e8c97a" stroke="#c4943a" strokeWidth="0.8" />
        <ellipse cx="36" cy="36" rx="7" ry="5" fill="#e8c97a" stroke="#c4943a" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/* ── SVG: Honey pot collectible ── */
function HoneyPot({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <path d="M8 10 Q8 4 18 4 Q28 4 28 10 L30 28 Q30 34 18 34 Q6 34 4 28Z"
        fill="#d4943a" stroke="#8B6E4E" strokeWidth="1" />
      <rect x="10" y="7" width="16" height="18" rx="2" fill="#e8a848" opacity="0.5" />
      <ellipse cx="18" cy="7" rx="8" ry="3" fill="#f59e0b" opacity="0.8" />
      <ellipse cx="18" cy="18" rx="6" ry="5" fill="#f59e0b" opacity="0.6" />
    </svg>
  );
}

/* ── SVG: Golden honeycomb (bonus) ── */
function GoldenHoneycomb({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }}>
      <polygon points="18,3 31,10 31,24 18,31 5,24 5,10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
      <polygon points="18,9 25,13 25,21 18,25 11,21 11,13" fill="#fde68a" stroke="#f59e0b" strokeWidth="0.5" />
      <svg x="11" y="10" width="14" height="14" viewBox="0 0 20 20">
        <polygon points="10,1 12.5,7.5 19,7.5 13.5,12 15.5,18.5 10,14 4.5,18.5 6.5,12 1,7.5 7.5,7.5"
          fill="#d97706" opacity="0.6" />
      </svg>
    </svg>
  );
}

/* ── SVG: Bee (avoid!) ── */
function BeeSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ animation: 'bee-wobble 0.8s ease-in-out infinite' }}>
      {/* Wings */}
      <ellipse cx="12" cy="12" rx="7" ry="4" fill="rgba(200,220,255,0.6)" stroke="#8cb4d9" strokeWidth="0.4" />
      <ellipse cx="24" cy="12" rx="7" ry="4" fill="rgba(200,220,255,0.6)" stroke="#8cb4d9" strokeWidth="0.4" />
      {/* Body */}
      <ellipse cx="18" cy="20" rx="9" ry="11" fill="#fbbf24" stroke="#6b4c2a" strokeWidth="1" />
      {/* Stripes */}
      <rect x="10" y="16" width="16" height="2.5" rx="1" fill="#3d2414" />
      <rect x="10.5" y="22" width="15" height="2.5" rx="1" fill="#3d2414" />
      <rect x="11" y="28" width="14" height="2" rx="1" fill="#3d2414" />
      {/* Eyes */}
      <circle cx="14" cy="14" r="2" fill="white" />
      <circle cx="22" cy="14" r="2" fill="white" />
      <circle cx="14.5" cy="14.5" r="1" fill="#3d2414" />
      <circle cx="22.5" cy="14.5" r="1" fill="#3d2414" />
      {/* Stinger */}
      <path d="M18 31 L18 35" stroke="#6b4c2a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Cloud decoration ── */
function CloudLayer() {
  const clouds = useMemo(() => [
    { w: 100, h: 30, y: '8%', dur: 35, delay: 0, opacity: 0.25 },
    { w: 80, h: 24, y: '15%', dur: 28, delay: -10, opacity: 0.2 },
    { w: 120, h: 35, y: '25%', dur: 40, delay: -20, opacity: 0.15 },
    { w: 70, h: 22, y: '35%', dur: 32, delay: -5, opacity: 0.2 },
    { w: 90, h: 28, y: '50%', dur: 38, delay: -15, opacity: 0.12 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c, i) => (
        <div key={i} className="absolute" style={{ top: c.y, right: `-${c.w + 20}px`, animation: `cloud-drift ${c.dur}s linear ${c.delay}s infinite`, width: `calc(100% + ${c.w * 2}px)` }}>
          <div className="bg-white rounded-full blur-sm" style={{ width: c.w, height: c.h, opacity: c.opacity }} />
        </div>
      ))}
    </div>
  );
}

/* ── Collectible item element ── */
function CollectibleEl({ item, onCatch }) {
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); onCatch(e, item); }}
      className="absolute cursor-pointer active:scale-110 transition-transform duration-75 select-none"
      style={{ left: item.x - item.size / 2, top: item.y - item.size / 2, width: item.size, height: item.size }}
    >
      {item.type === 'honey' && <HoneyPot size={item.size} />}
      {item.type === 'golden' && <GoldenHoneycomb size={item.size} />}
      {item.type === 'bee' && <BeeSVG size={item.size} />}
    </div>
  );
}

/* ── Star rating ── */
function StarRow({ score }) {
  const stars = score >= 25 ? 3 : score >= 12 ? 2 : 1;
  return (
    <div className="flex gap-2 justify-center my-2">
      {[1, 2, 3].map(s => (
        <svg key={s} width={28} height={28} viewBox="0 0 22 22"
          style={{ opacity: s <= stars ? 1 : 0.2, animation: s <= stars ? `star-burst 0.5s ease-out ${0.2 + s * 0.15}s backwards` : 'none' }}>
          <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
            fill={s <= stars ? '#fbbf24' : '#d1d5db'} stroke={s <= stars ? '#d97706' : '#9ca3af'} strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

/* ── Spawn a collectible ── */
function makeItem(id, w, h, score) {
  const rand = Math.random();
  const type = rand > 0.88 ? 'golden' : rand > (0.7 - Math.min(score * 0.005, 0.15)) ? 'bee' : 'honey';
  return {
    id,
    type,
    x: 40 + Math.random() * (w - 80),
    y: -40,
    size: type === 'bee' ? 38 : 34 + Math.random() * 10,
    speed: (0.6 + Math.random() * 0.8) * (1 + Math.min(score / 60, 0.6)),
    wobblePhase: Math.random() * Math.PI * 2,
  };
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function PoohBalloonFloat() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const nextIdRef = useRef(0);
  const scoreRef = useRef(0);
  const poohYRef = useRef(0);

  const [phase, setPhase] = useState('intro');
  const [countdown, setCountdown] = useState(3);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState(3);
  const [dims, setDims] = useState({ w: 400, h: 700 });
  const [poohY, setPoohY] = useState(0);
  const [reaction, setReaction] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { poohYRef.current = poohY; }, [poohY]);

  // Inject keyframes
  useEffect(() => {
    const id = 'pooh-balloon-kf';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = KF;
      document.head.appendChild(style);
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

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { setPhase('playing'); return; }
    playBoing();
    const t = setTimeout(() => setCountdown(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Gravity — Pooh slowly sinks, tap to float up
  useEffect(() => {
    if (phase !== 'playing') return;
    let running = true;
    const gravity = () => {
      if (!running) return;
      setPoohY(y => {
        const newY = y + 0.8; // gentle sink
        return Math.min(newY, dims.h * 0.65);
      });
      requestAnimationFrame(gravity);
    };
    const id = requestAnimationFrame(gravity);
    return () => { running = false; cancelAnimationFrame(id); };
  }, [phase, dims.h]);

  // Tap handler — float up
  const handleTap = useCallback(() => {
    if (phase !== 'playing') return;
    playPop();
    setPoohY(y => Math.max(y - 50, -dims.h * 0.1));
  }, [phase, dims.h]);

  // Spawn items scrolling down
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setItems(prev => {
        if (prev.length >= 8) return prev;
        return [...prev, makeItem(nextIdRef.current++, dims.w, dims.h, scoreRef.current)];
      });
    }, Math.max(600, 1200 - scoreRef.current * 8));
    return () => clearInterval(interval);
  }, [dims.w, dims.h, phase]);

  // Animate items falling
  useEffect(() => {
    if (phase !== 'playing') return;
    let running = true;
    const animate = () => {
      if (!running) return;
      setItems(prev => {
        const updated = [];
        for (const item of prev) {
          const wobbleX = Math.sin(Date.now() * 0.003 + item.wobblePhase) * 12;
          const newY = item.y + item.speed;
          if (newY > dims.h + 60) {
            // Missed honey = lose balloon
            if (item.type !== 'bee') {
              setBalloons(b => {
                const newB = b - 1;
                if (newB <= 0) setPhase('gameOver');
                return Math.max(0, newB);
              });
            }
          } else {
            // Collision with Pooh
            const poohCX = dims.w / 2;
            const poohCY = dims.h * 0.55 + poohYRef.current;
            const dx = (item.x + wobbleX) - poohCX;
            const dy = newY - poohCY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 55) {
              // Auto-catch!
              if (item.type === 'bee') {
                playBuzz();
                setReaction('sting');
                setBalloons(b => {
                  const newB = b - 1;
                  if (newB <= 0) setPhase('gameOver');
                  return Math.max(0, newB);
                });
              } else {
                const pts = item.type === 'golden' ? 3 : 1;
                playSparkle();
                setReaction('catch');
                setScore(s => {
                  const ns = s + pts;
                  if (ns % 10 === 0 && ns > 0) {
                    playFanfare();
                    setBalloons(b => Math.min(b + 1, 6));
                    peek('excited');
                    celebrate();
                  }
                  return ns;
                });
              }
              continue; // remove item
            }
            updated.push({ ...item, y: newY, x: item.x + wobbleX * 0.02 });
          }
        }
        return updated;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [dims, phase, burst, peek, celebrate]);

  // Reaction timeout
  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => setReaction(null), 500);
    return () => clearTimeout(t);
  }, [reaction]);

  const handleCatch = useCallback((e, item) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (item.type === 'bee') {
      playBuzz();
      setReaction('sting');
      setBalloons(b => {
        const newB = b - 1;
        if (newB <= 0) setPhase('gameOver');
        return Math.max(0, newB);
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: ['#ef4444', '#f97316'] });
    } else {
      const pts = item.type === 'golden' ? 3 : 1;
      playSparkle();
      setReaction('catch');
      setScore(s => {
        const ns = s + pts;
        if (ns % 10 === 0 && ns > 0) {
          playFanfare();
          setBalloons(b => Math.min(b + 1, 6));
          peek('excited');
          celebrate();
        }
        return ns;
      });
      if (rect) burst(e.clientX - rect.left, e.clientY - rect.top, { colors: HONEY_COLORS });
    }
    setItems(prev => prev.filter(i => i.id !== item.id));
  }, [burst, peek, celebrate]);

  const handleStart = useCallback(() => {
    setPhase('countdown');
    setCountdown(3);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setBalloons(3);
    setItems([]);
    setPoohY(0);
    setPhase('countdown');
    setCountdown(3);
    nextIdRef.current = 0;
    scoreRef.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handleTap}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #b8e0f0 30%, #c8e8c0 60%, #a0c878 80%, #78a850 100%)' }}
    >
      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
      <CloudLayer />

      {/* Tree trunks in background */}
      <svg className="absolute bottom-0 left-[10%] pointer-events-none opacity-30" width="60" height="200" viewBox="0 0 60 200">
        <rect x="22" y="0" width="16" height="200" fill="#5c3a1e" rx="4" />
        <ellipse cx="30" cy="20" rx="28" ry="35" fill="#3d6b3d" opacity="0.6" />
      </svg>
      <svg className="absolute bottom-0 right-[8%] pointer-events-none opacity-25" width="50" height="180" viewBox="0 0 50 180">
        <rect x="18" y="0" width="14" height="180" fill="#5c3a1e" rx="3" />
        <ellipse cx="25" cy="15" rx="22" ry="30" fill="#4a7c4a" opacity="0.5" />
      </svg>

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div className="text-center" style={{ animation: 'pooh-float 3s ease-in-out infinite' }}>
            <FloatingPooh balloonCount={3} reaction={null} />
          </div>
          <h1 className="text-3xl font-heading text-amber-900 mb-2 drop-shadow-sm mt-4">
            Balloon Float
          </h1>
          <p className="text-amber-800/70 text-sm mb-1 font-heading">Tap to float up!</p>
          <p className="text-amber-800/50 text-xs mb-6">Catch honey, dodge bees!</p>
          <button onClick={handleStart}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading text-xl
                       px-10 py-4 rounded-full shadow-xl transition-all border-2 border-amber-600">
            Play!
          </button>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <span key={countdown}
            className="text-8xl font-heading text-amber-800 drop-shadow-lg"
            style={{ animation: 'star-burst 0.6s ease-out reverse both' }}>
            {countdown > 0 ? countdown : 'Go!'}
          </span>
        </div>
      )}

      {/* ── HUD ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <div className="bg-amber-800/50 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 36 36">
              <path d="M8 10 Q8 4 18 4 Q28 4 28 10 L30 28 Q30 34 18 34 Q6 34 4 28Z" fill="#f59e0b" />
            </svg>
            <span className="text-lg font-heading text-white">{score}</span>
          </div>
          <div className="bg-blue-800/50 backdrop-blur-sm rounded-2xl px-2 py-1.5 flex items-center gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <svg key={i} width="14" height="18" viewBox="0 0 14 18" style={{ opacity: i < balloons ? 1 : 0.15 }}>
                <ellipse cx="7" cy="8" rx="5.5" ry="7" fill={BALLOON_COLORS[i] || '#ef4444'} />
                <line x1="7" y1="15" x2="7" y2="18" stroke="#8B6E4E" strokeWidth="0.6" />
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* ── GAME OBJECTS ── */}
      {phase === 'playing' && items.map(item => (
        <CollectibleEl key={item.id} item={item} onCatch={handleCatch} />
      ))}

      {/* ── POOH ── */}
      {(phase === 'playing' || phase === 'gameOver') && (
        <div className="absolute z-10 pointer-events-none"
          style={{ left: '50%', top: `${55 + (poohY / dims.h) * 100}%`, transform: 'translate(-50%, -50%)' }}>
          <FloatingPooh balloonCount={balloons} reaction={reaction} />
        </div>
      )}

      {/* ── HINT ── */}
      {phase === 'playing' && score === 0 && (
        <div className="absolute bottom-20 left-0 right-0 z-20 text-center animate-pulse">
          <span className="text-amber-900/40 text-xs font-heading">Tap anywhere to float up!</span>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === 'gameOver' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="bg-amber-50 rounded-3xl p-6 text-center shadow-2xl max-w-xs mx-4 border-2 border-amber-300"
            style={{ animation: 'pooh-float 3s ease-in-out infinite' }}>
            <h2 className="text-2xl font-heading text-amber-800 mb-1">Oh Bother!</h2>
            <StarRow score={score} />
            <p className="text-amber-700 text-sm mb-0.5">Honey collected</p>
            <p className="text-4xl font-heading text-amber-600 mb-3">{score}</p>
            <p className="text-amber-600/60 text-xs mb-4 italic">
              {score >= 25 ? 'A smackerel of the finest honey!' : score >= 12 ? 'Not bad for a bear of little brain!' : 'Oh bother, try again!'}
            </p>
            <button onClick={handleRestart}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading text-lg
                         px-8 py-3 rounded-full shadow-lg transition-all border-2 border-amber-600">
              Try Again!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
