import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playError } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';

/* ══════════════════════════════════════════════
   EEYORE'S TAIL PIN
   Drag the tail with its pink bow to the right
   spot on Eeyore. Gentle, forgiving, no fail states.
   Each round Eeyore faces a different direction.
   ══════════════════════════════════════════════ */

const KF = `
@keyframes eeyore-sway { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
@keyframes tail-wiggle { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
@keyframes sparkle-pop { 0% { transform: scale(0) rotate(0); opacity: 1; } 100% { transform: scale(1.5) rotate(180deg); opacity: 0; } }
@keyframes float-gentle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes bow-bounce { 0% { transform: scale(1); } 30% { transform: scale(1.3); } 60% { transform: scale(0.9); } 100% { transform: scale(1); } }
@keyframes glow-pulse { 0%,100% { filter: drop-shadow(0 0 4px rgba(240,160,184,0.4)); } 50% { filter: drop-shadow(0 0 12px rgba(240,160,184,0.8)); } }
`;

/* ── Big Eeyore SVG (facing direction controlled by scaleX) ── */
function BigEeyore({ facing, mood, showTarget }) {
  const scaleX = facing === 'left' ? -1 : 1;
  return (
    <svg width="200" height="220" viewBox="0 0 200 220"
      style={{
        transform: `scaleX(${scaleX})`,
        animation: 'eeyore-sway 4s ease-in-out infinite',
        transformOrigin: 'center bottom',
      }}>
      {/* Body */}
      <ellipse cx="100" cy="120" rx="58" ry="50" fill="#8898b0" />
      <ellipse cx="100" cy="120" rx="58" ry="50" fill="none" stroke="#6878a0" strokeWidth="1.5" />
      {/* Belly */}
      <ellipse cx="100" cy="124" rx="38" ry="34" fill="#a0b0c8" opacity="0.5" />
      {/* Head */}
      <ellipse cx="100" cy="60" rx="36" ry="32" fill="#8898b0" stroke="#6878a0" strokeWidth="1.5" />
      {/* Mane tuft */}
      <path d="M84 32 Q88 20 100 28 Q112 20 116 32" fill="#5a6888" stroke="#4a5878" strokeWidth="1" />
      {/* Ears (droopy) */}
      <path d="M68 48 Q50 36 44 52" fill="#8898b0" stroke="#6878a0" strokeWidth="2" strokeLinecap="round" />
      <path d="M132 48 Q150 36 156 52" fill="#8898b0" stroke="#6878a0" strokeWidth="2" strokeLinecap="round" />
      {/* Ear insides */}
      <path d="M64 48 Q52 40 48 50" fill="none" stroke="#a0b0c8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M136 48 Q148 40 152 50" fill="none" stroke="#a0b0c8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M86 56 Q90 52 94 56" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
          <path d="M106 56 Q110 52 114 56" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="90" cy="56" r="4" fill="#3d2414" />
          <circle cx="91" cy="55" r="1.5" fill="white" />
          <circle cx="110" cy="56" r="4" fill="#3d2414" />
          <circle cx="111" cy="55" r="1.5" fill="white" />
          {/* Droopy eyebrows */}
          <path d="M82 48 Q90 46 98 50" fill="none" stroke="#5a6888" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 50 Q110 46 118 48" fill="none" stroke="#5a6888" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {/* Nose */}
      <ellipse cx="100" cy="70" rx="7" ry="5" fill="#5a6888" />
      {/* Mouth */}
      {mood === 'happy' ? (
        <path d="M90 78 Q100 86 110 78" fill="none" stroke="#5a6888" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M92 80 Q100 82 108 80" fill="none" stroke="#5a6888" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {/* Legs */}
      <rect x="64" y="164" width="14" height="30" rx="7" fill="#8898b0" stroke="#6878a0" strokeWidth="1" />
      <rect x="122" y="164" width="14" height="30" rx="7" fill="#8898b0" stroke="#6878a0" strokeWidth="1" />
      {/* Hooves */}
      <ellipse cx="71" cy="194" rx="9" ry="4" fill="#6878a0" />
      <ellipse cx="129" cy="194" rx="9" ry="4" fill="#6878a0" />
      {/* Tail target zone (pulsing circle when showing hint) */}
      {showTarget && (
        <circle cx="38" cy="120" r="18" fill="#f0a0b8" opacity="0.25"
          style={{ animation: 'glow-pulse 1.5s ease-in-out infinite' }} />
      )}
    </svg>
  );
}

/* ── Tail with bow (draggable) ── */
function TailSVG({ size = 60, pinned }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56"
      style={{ animation: pinned ? 'bow-bounce 0.5s ease-out' : 'tail-wiggle 1.2s ease-in-out infinite' }}>
      {/* Tail rope/string */}
      <path d="M20 40 Q14 34 18 26 Q22 18 16 12 Q12 6 18 2" fill="none" stroke="#8898b0" strokeWidth="4" strokeLinecap="round" />
      {/* Bow at top */}
      <ellipse cx="12" cy="2" rx="7" ry="5" fill="#f0a0b8" stroke="#d4789a" strokeWidth="0.8" />
      <ellipse cx="26" cy="2" rx="7" ry="5" fill="#f0a0b8" stroke="#d4789a" strokeWidth="0.8" />
      <circle cx="18" cy="2" r="3" fill="#d4789a" />
      {/* Bow ribbons */}
      <path d="M14 7 Q10 14 12 18" fill="none" stroke="#f0a0b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 7 Q26 14 24 18" fill="none" stroke="#f0a0b8" strokeWidth="2" strokeLinecap="round" />
      {/* Tail end (fluffy) */}
      <circle cx="20" cy="44" r="7" fill="#8898b0" stroke="#6878a0" strokeWidth="0.8" />
      <circle cx="16" cy="48" r="4" fill="#a0b0c8" opacity="0.5" />
      <circle cx="24" cy="48" r="4" fill="#a0b0c8" opacity="0.5" />
    </svg>
  );
}

/* ── Sparkle burst effect ── */
function SparkleEffect({ x, y }) {
  return (
    <div className="absolute pointer-events-none z-30" style={{ left: x - 30, top: y - 30 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <div key={i} className="absolute" style={{
            left: 30 + Math.cos(angle) * 20,
            top: 30 + Math.sin(angle) * 20,
            animation: `sparkle-pop 0.6s ease-out ${i * 0.05}s forwards`,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill="#fbbf24" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ── Flowers decoration ── */
function Flowers() {
  const flowers = useMemo(() => [
    { x: '8%', color: '#fbbf24', size: 16 },
    { x: '22%', color: '#f0a0b8', size: 14 },
    { x: '45%', color: '#fbbf24', size: 12 },
    { x: '65%', color: '#f0a0b8', size: 15 },
    { x: '78%', color: '#fbbf24', size: 13 },
    { x: '90%', color: '#f0a0b8', size: 14 },
  ], []);

  return (
    <>
      {flowers.map((f, i) => (
        <svg key={i} className="absolute pointer-events-none" style={{ bottom: 6, left: f.x }}
          width={f.size} height={f.size * 1.5} viewBox="0 0 16 24">
          <line x1="8" y1="12" x2="8" y2="24" stroke="#5a8c3c" strokeWidth="1.5" />
          <circle cx="8" cy="10" r="5" fill={f.color} opacity="0.7" />
          <circle cx="8" cy="10" r="2.5" fill="#fde68a" />
        </svg>
      ))}
    </>
  );
}

/* ── Compute tail target position based on Eeyore's facing ── */
function getTailTarget(facing, eeyoreCenter) {
  // Tail goes on the back — when facing right, tail target is on the left
  const offsetX = facing === 'right' ? -62 : 62;
  return {
    x: eeyoreCenter.x + offsetX,
    y: eeyoreCenter.y + 10,
  };
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function EeyoreTailPin() {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('intro'); // intro | playing | pinned | celebration
  const [dims, setDims] = useState({ w: 400, h: 700 });
  const [round, setRound] = useState(0);
  const [totalPins, setTotalPins] = useState(0);
  const [facing, setFacing] = useState('right');
  const [tailPos, setTailPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [sparkleAt, setSparkleAt] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  // Eeyore center position
  const eeyoreCenter = useMemo(() => ({
    x: dims.w / 2,
    y: dims.h * 0.42,
  }), [dims]);

  const tailTarget = useMemo(() => getTailTarget(facing, eeyoreCenter), [facing, eeyoreCenter]);

  // Inject keyframes
  useEffect(() => {
    const id = 'eeyore-tail-kf';
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

  // Start game
  const handleStart = useCallback(() => {
    const facings = ['right', 'left'];
    const newFacing = facings[round % facings.length];
    setFacing(newFacing);
    setPinned(false);
    setSparkleAt(null);
    setShowHint(false);
    // Place tail at a random starting position (bottom area)
    setTailPos({
      x: 60 + Math.random() * (dims.w - 120),
      y: dims.h * 0.75 + Math.random() * (dims.h * 0.1),
    });
    setPhase('playing');
  }, [dims, round]);

  // Show hint after 5 seconds of inactivity
  useEffect(() => {
    if (phase !== 'playing' || pinned) return;
    const t = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(t);
  }, [phase, pinned, round]);

  // Drag handling
  const handlePointerDown = useCallback((e) => {
    if (phase !== 'playing' || pinned) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Check if touching the tail (generous hit area)
    const dx = px - tailPos.x;
    const dy = py - tailPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 60) {
      setDragging(true);
      setShowHint(false);
      dragOffset.current = { dx: tailPos.x - px, dy: tailPos.y - py };
      playPop();
    }
  }, [phase, pinned, tailPos]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setTailPos({
      x: px + dragOffset.current.dx,
      y: py + dragOffset.current.dy,
    });
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);

    // Check distance to target — very forgiving
    const dx = tailPos.x - tailTarget.x;
    const dy = tailPos.y - tailTarget.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 60) {
      // Snap to correct position
      setTailPos({ x: tailTarget.x, y: tailTarget.y });
      setPinned(true);
      setSparkleAt({ x: tailTarget.x, y: tailTarget.y });
      setTotalPins(p => p + 1);
      playFanfare();
      burst(tailTarget.x, tailTarget.y, { colors: ['#f0a0b8', '#fbbf24', '#87CEEB', '#a0b0c8'] });
      peek('excited');

      // Celebrate every 3 successful pins
      if ((totalPins + 1) % 3 === 0) {
        celebrate();
      }

      // Move to next round after a moment
      setTimeout(() => {
        setPhase('celebration');
      }, 1200);
    } else {
      // Gentle "try again" feedback — bounce tail back slightly
      playBoing();
    }
  }, [dragging, tailPos, tailTarget, totalPins, burst, peek, celebrate]);

  const handleNextRound = useCallback(() => {
    setRound(r => r + 1);
    handleStart();
  }, [handleStart]);

  // Star rating based on total pins
  const starCount = totalPins >= 5 ? 3 : totalPins >= 3 ? 2 : 1;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{ background: 'linear-gradient(180deg, #c8d8e8 0%, #a0b8d0 25%, #88b0a0 50%, #78a870 70%, #5a8c3c 100%)' }}
    >
      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      {/* Rolling hills */}
      <svg className="absolute bottom-0 left-0 right-0 pointer-events-none" height="120" preserveAspectRatio="none" viewBox="0 0 400 120">
        <path d="M0 40 Q100 10 200 45 Q300 80 400 30 L400 120 L0 120Z" fill="#6b9e4c" />
        <path d="M0 60 Q80 40 160 60 Q240 80 320 50 Q360 40 400 55 L400 120 L0 120Z" fill="#5a8c3c" opacity="0.8" />
        <path d="M0 80 Q100 70 200 85 Q300 75 400 80 L400 120 L0 120Z" fill="#4a7c2c" opacity="0.6" />
      </svg>

      <Flowers />

      {/* Gloomy clouds (gentle, not scary) */}
      <svg className="absolute top-[5%] left-[10%] pointer-events-none opacity-20" width="140" height="50" viewBox="0 0 140 50">
        <ellipse cx="70" cy="30" rx="65" ry="18" fill="#8898b0" />
        <ellipse cx="50" cy="24" rx="40" ry="14" fill="#a0b0c8" />
        <ellipse cx="95" cy="26" rx="35" ry="12" fill="#8898b0" />
      </svg>
      <svg className="absolute top-[12%] right-[15%] pointer-events-none opacity-15" width="100" height="40" viewBox="0 0 100 40">
        <ellipse cx="50" cy="22" rx="45" ry="14" fill="#8898b0" />
        <ellipse cx="35" cy="18" rx="30" ry="10" fill="#a0b0c8" />
      </svg>

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div style={{ animation: 'float-gentle 3s ease-in-out infinite' }}>
            <BigEeyore facing="right" mood="sad" showTarget={false} />
          </div>
          {/* Tail shown separately — visual cue */}
          <div className="mt-2" style={{ animation: 'tail-wiggle 1.5s ease-in-out infinite' }}>
            <TailSVG size={50} pinned={false} />
          </div>
          <button onClick={handleStart}
            className="mt-6 bg-blue-400 hover:bg-blue-500 active:scale-95 text-white font-heading text-xl
                       w-24 h-24 rounded-full shadow-xl transition-all border-2 border-blue-500
                       flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="14,8 32,20 14,32" fill="white" />
            </svg>
          </button>
        </div>
      )}

      {/* ── EEYORE (gameplay) ── */}
      {(phase === 'playing' || phase === 'celebration') && (
        <div className="absolute pointer-events-none"
          style={{
            left: eeyoreCenter.x - 100,
            top: eeyoreCenter.y - 110,
          }}>
          <BigEeyore facing={facing} mood={pinned ? 'happy' : 'sad'} showTarget={!pinned && showHint} />
        </div>
      )}

      {/* ── DRAGGABLE TAIL ── */}
      {(phase === 'playing' || phase === 'celebration') && (
        <div
          className={`absolute z-20 ${dragging ? 'scale-110' : ''} transition-transform duration-75`}
          style={{
            left: tailPos.x - 30,
            top: tailPos.y - 42,
            cursor: pinned ? 'default' : 'grab',
            animation: !pinned && !dragging ? 'glow-pulse 2s ease-in-out infinite' : undefined,
          }}
        >
          <TailSVG size={60} pinned={pinned} />
        </div>
      )}

      {/* ── SPARKLE on pin ── */}
      {sparkleAt && <SparkleEffect x={sparkleAt.x} y={sparkleAt.y} />}

      {/* ── HUD: pin count ── */}
      {(phase === 'playing' || phase === 'celebration') && totalPins > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-blue-800/40 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
            {/* Bow icon */}
            <svg width="16" height="16" viewBox="0 0 16 16">
              <ellipse cx="5" cy="8" rx="4" ry="3" fill="#f0a0b8" />
              <ellipse cx="11" cy="8" rx="4" ry="3" fill="#f0a0b8" />
              <circle cx="8" cy="8" r="2" fill="#d4789a" />
            </svg>
            <span className="text-lg font-heading text-white">{totalPins}</span>
          </div>
        </div>
      )}

      {/* ── HINT: animated hand pointing at Eeyore's back ── */}
      {phase === 'playing' && showHint && !pinned && !dragging && (
        <div className="absolute z-25 pointer-events-none" style={{
          left: tailTarget.x - 15,
          top: tailTarget.y + 30,
          animation: 'float-gentle 1.5s ease-in-out infinite',
        }}>
          <svg width="30" height="30" viewBox="0 0 30 30" opacity="0.5">
            <path d="M15 28 L15 16 L8 22 M15 16 L22 22" fill="none" stroke="#5a6888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="12" r="4" fill="#5a6888" opacity="0.3" />
          </svg>
        </div>
      )}

      {/* ── CELEBRATION / NEXT ROUND ── */}
      {phase === 'celebration' && (
        <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center">
          <button onClick={handleNextRound}
            className="bg-blue-400 hover:bg-blue-500 active:scale-95 text-white font-heading
                       w-20 h-20 rounded-full shadow-xl transition-all border-2 border-blue-500
                       flex items-center justify-center"
            style={{ animation: 'float-gentle 1.5s ease-in-out infinite' }}>
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path d="M5 12 L19 12 M13 6 L19 12 L13 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
