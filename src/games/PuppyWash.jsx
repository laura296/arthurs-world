import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import {
  playPop, playSuccess, playSparkle, playBoing, playPoof,
  playTone, playCelebrate, playNavigate,
} from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import PuppyImage from './puppy-wash/PuppyImage';

const HEART_COLORS = ['#f472b6', '#ec4899', '#f9a8d4', '#fda4af', '#fb7185'];
const BUBBLE_COLORS = ['#bfdbfe', '#93c5fd', '#ddd6fe', '#e9d5ff', '#fbcfe8'];
const SPARKLE_COLORS = ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a'];
const BALL_COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];

// ── Puppy data ─────────────────────────────────────────────────────
const PUPPIES = [
  {
    id: 'bean', breed: 'terrier', name: 'Bean',
    emoji: '🐕', label: "Let's play tug!",
    activity: 'tug',
    storyPages: [
      { text: 'Bean the Irish Terrier found his favourite rope toy!', emoji: '🧸' },
      { text: 'He picked it up and gave it a big shake!', emoji: '💪' },
      { text: '"Grrr! Play tug with me!" says Bean.', emoji: '🐾' },
      { text: 'Grab the rope and pull! Bean loves it!', emoji: '🎉' },
    ],
  },
  {
    id: 'patch', breed: 'dalmatian', name: 'Patch',
    emoji: '🐾', label: 'Needs a bath!',
    activity: 'wash',
    storyPages: [
      { text: 'One sunny morning, little Patch went out to play...', emoji: '☀️' },
      { text: 'Splash! Squelch! Patch found the BIGGEST mud puddle!', emoji: '💦' },
      { text: 'Oh no! Now Patch is covered in mud from nose to tail!', emoji: '🐾' },
      { text: "Don't worry — YOU can help! Let's give Patch a bath!", emoji: '🛁' },
    ],
  },
  {
    id: 'sunny', breed: 'golden', name: 'Sunny',
    emoji: '🌟', label: 'Wants to play fetch!',
    activity: 'fetch',
    storyPages: [
      { text: 'Sunny the golden puppy loves the park!', emoji: '🌳' },
      { text: 'She found a shiny red ball in the grass!', emoji: '🔴' },
      { text: '"Throw it! Throw it!" Sunny wags her tail.', emoji: '🐕' },
      { text: 'Tap the ball to throw it for Sunny!', emoji: '⚾' },
    ],
  },
];

const ACCESSORIES = [
  { id: 'collar', label: 'Red Collar',     emoji: '❤️' },
  { id: 'bow',    label: 'Blue Bow',       emoji: '🎀' },
  { id: 'bandana',label: 'Yellow Bandana', emoji: '🧣' },
];

// ── Story Intro ──────────────────────────────────────────────────────
function StoryIntro({ puppy, onFinish }) {
  const [page, setPage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const { burst, ParticleLayer } = useParticleBurst();
  const ref = useRef(null);
  const pages = puppy.storyPages;

  const handleTap = useCallback(() => {
    playPop();
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      burst(rect.width / 2, rect.height * 0.4, { colors: HEART_COLORS, count: 8, spread: 60 });
    }
    if (page < pages.length - 1) {
      setFadeIn(false);
      setTimeout(() => { setPage(p => Math.min(p + 1, pages.length - 1)); setFadeIn(true); }, 300);
    } else {
      onFinish();
    }
  }, [page, pages, onFinish, burst]);

  const s = pages[page];
  const puppyState = puppy.activity === 'wash' ? (page <= 1 ? 'clean' : 'muddy') : 'excited';

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 cursor-pointer"
         onClick={handleTap}>
      <ParticleLayer />
      <div className={`mb-4 transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <PuppyImage breed={puppy.breed} state={puppyState}
          animation={page <= 1 ? 'idle' : 'happy'}
          className="w-48 h-48 sm:w-64 sm:h-64" />
      </div>
      <div className={`max-w-sm text-center transition-all duration-500 bg-white/80 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl border border-white/40 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-lg sm:text-xl font-heading text-amber-900 leading-relaxed">
          <span className="text-3xl mr-2">{s.emoji}</span>
          {s.text}
        </p>
      </div>
      <p className="absolute bottom-8 text-sm text-white font-heading animate-pulse drop-shadow-lg"
         style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        {page < pages.length - 1 ? 'Tap to continue...' : 'Tap to start!'}
      </p>
      <div className="absolute bottom-16 flex gap-2">
        {pages.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all shadow-sm ${i === page ? 'bg-white scale-125' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}

// ── Floating Bubbles ─────────────────────────────────────────────────
function FloatingBubbles({ count, active }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 16 + Math.random() * 36,
      delay: Math.random() * 3,
      dur: 3 + Math.random() * 4,
      drift: -20 + Math.random() * 40,
    })), [count]);

  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden">
      {bubbles.map(b => (
        <div key={b.id} className="absolute rounded-full"
             style={{
               left: `${b.x}%`, bottom: '-5%',
               width: `${b.size}px`, height: `${b.size}px`,
               background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(147,197,253,0.25) 40%, transparent 70%)',
               boxShadow: 'inset -2px -3px 6px rgba(147,197,253,0.15), 0 0 3px rgba(255,255,255,0.2)',
               border: '1px solid rgba(255,255,255,0.25)',
               animation: `bubble-float ${b.dur}s ease-out infinite`,
               animationDelay: `${b.delay}s`,
               '--drift': `${b.drift}px`,
             }} />
      ))}
    </div>
  );
}

// ── Select Screen ───────────────────────────────────────────────────
function SelectScreen({ onSelect }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl px-6 py-3 mb-6 shadow-xl border border-white/40 text-center">
        <h2 className="text-xl sm:text-2xl font-heading text-amber-900">
          Choose a Puppy!
        </h2>
        <p className="text-sm text-amber-700 font-heading mt-1">Each one wants something different</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {PUPPIES.map(puppy => (
          <button key={puppy.id} onClick={() => { playNavigate(); onSelect(puppy); }}
            className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl p-4 border-2 border-white/30
                       hover:bg-white/80 hover:scale-105 active:scale-95 transition-all
                       flex flex-col items-center gap-2 shadow-xl cursor-pointer">
            <PuppyImage breed={puppy.breed}
              state={puppy.activity === 'wash' ? 'muddy' : 'excited'}
              animation="idle"
              className="w-24 h-24 sm:w-28 sm:h-28" />
            <span className="font-heading text-amber-900 text-base">{puppy.name}</span>
            <span className="text-xs text-amber-700/60">{puppy.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── WASH ACTIVITY STEPS ──────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

function SoapPumpStep({ puppy, onComplete }) {
  const [pumps, setPumps] = useState(0);
  const [pumping, setPumping] = useState(false);
  const [done, setDone] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();
  const containerRef = useRef(null);
  const TARGET = 5;

  useEffect(() => {
    if (pumps >= TARGET && !done) {
      setDone(true);
      playSparkle();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(rect.width / 2, rect.height * 0.35, { colors: BUBBLE_COLORS, count: 30, spread: 120 });
      }
      setTimeout(onComplete, 1800);
    }
  }, [pumps, done, onComplete, burst]);

  const handlePump = useCallback(() => {
    if (done || pumping) return;
    setPumping(true);
    playPop();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      burst(rect.width * 0.65, rect.height * 0.45, { colors: BUBBLE_COLORS, count: 8, spread: 50 });
    }
    setPumps(p => p + 1);
    setTimeout(() => setPumping(false), 400);
  }, [done, pumping, burst]);

  const pumpRatio = pumps / TARGET;
  // Crossfade: muddy at 0, soapy at 1
  const puppyState = pumpRatio < 0.5 ? 'muddy' : 'soapy';

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <ParticleLayer />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? '✨ So clean!' : 'Tap the soap! 🧴'}
        </p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '10%' }}>
        <PuppyImage breed={puppy.breed} state={puppyState} showInBath
          animation={pumping ? 'wiggle' : 'idle'}
          className="w-56 h-56 sm:w-72 sm:h-72" />
      </div>

      {/* Soap bottle */}
      <div className="absolute z-20" style={{ right: '4%', bottom: '18%' }}>
        <button onClick={handlePump}
          className={`relative cursor-pointer transition-transform duration-200 ${!done ? 'hover:scale-110 active:scale-90' : 'opacity-60'}`}
          disabled={done}>
          <div className={`transition-transform duration-150 text-6xl ${pumping ? 'scale-90 translate-y-1' : ''}`}>
            🧴
          </div>
          {!done && pumps === 0 && (
            <div className="absolute inset-0 rounded-3xl animate-pulse"
                 style={{ boxShadow: '0 0 20px 8px rgba(236,72,153,0.3)' }} />
          )}
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3
                      bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30">
        {Array.from({ length: TARGET }).map((_, i) => (
          <span key={i} className={`text-2xl transition-all duration-500 ${i < pumps ? 'scale-110 drop-shadow-md' : 'opacity-25 scale-75 grayscale'}`}>
            🐾
          </span>
        ))}
      </div>

      <FloatingBubbles count={done ? 40 : pumps * 5} active={pumps > 0} />
    </div>
  );
}

// Rub step — used for scrub, dry, brush, belly rubs
function RubStep({ puppy, config, onComplete }) {
  const containerRef = useRef(null);
  const puppyRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [touching, setTouching] = useState(false);
  const [done, setDone] = useState(false);
  const lastBurstTime = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();

  const target = config.target;
  const ratio = progress / target;

  useEffect(() => {
    if (progress >= target && !done) {
      setDone(true);
      playSuccess();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(rect.width / 2, rect.height * 0.3, { colors: config.particles, count: 20, spread: 80 });
      }
      setTimeout(onComplete, 1000);
    }
  }, [progress, target, done, onComplete, burst, config.particles]);

  const isOverPuppy = useCallback((clientX, clientY) => {
    const el = puppyRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const pad = 40;
    return clientX >= r.left - pad && clientX <= r.right + pad && clientY >= r.top - pad && clientY <= r.bottom + pad;
  }, []);

  const handlePointerDown = useCallback(() => {
    if (done) return;
    setTouching(true);
  }, [done]);

  const handlePointerMove = useCallback((e) => {
    if (!touching || done) return;
    e.preventDefault();
    if (isOverPuppy(e.clientX, e.clientY)) {
      const now = Date.now();
      if (now - lastBurstTime.current > 300) {
        lastBurstTime.current = now;
        playPop();
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          burst(e.clientX - rect.left, e.clientY - rect.top, { colors: config.particles, count: 6, spread: 50 });
        }
        setProgress(p => Math.min(p + 1, target));
      }
    }
  }, [touching, done, isOverPuppy, burst, config.particles, target]);

  const handlePointerUp = useCallback(() => {
    setTouching(false);
  }, []);

  // Determine puppy state based on step
  const puppyState = typeof config.puppyState === 'function' ? config.puppyState(ratio) : config.puppyState;

  return (
    <div ref={containerRef} className="absolute inset-0 z-10"
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerLeave={handlePointerUp}
         style={{ touchAction: 'none' }}>
      <ParticleLayer />

      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? '✨ All done!' : config.voice}
        </p>
      </div>

      <div ref={puppyRef}
           className={`absolute left-1/2 -translate-x-1/2 z-[5] transition-transform duration-200
                       ${done ? 'animate-bounce' : ''}`}
           style={{ top: '10%' }}>
        <PuppyImage breed={puppy.breed} state={puppyState}
          animation={touching ? 'wiggle' : 'idle'}
          showInBath={config.showInBath}
          className="w-56 h-56 sm:w-72 sm:h-72" />
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/30 flex items-center gap-3">
          <span className="text-3xl">{config.toolEmoji}</span>
          <div>
            <p className="font-heading text-amber-900 text-sm">{config.title}</p>
            <p className="text-xs text-amber-700/60">Rub your finger over {puppy.name}!</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20
                      bg-white/60 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-white/30">
        {Array.from({ length: target }, (_, i) => (
          <span key={i} className={`text-xl transition-all duration-300 ${i < progress ? 'scale-125' : 'opacity-25 scale-75'}`}>
            {i < progress ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── FETCH ACTIVITY STEPS ─────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

function FetchStep({ puppy, onComplete }) {
  const [throws, setThrows] = useState(0);
  const [ballState, setBallState] = useState('ready'); // ready, flying, returning
  const [done, setDone] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();
  const containerRef = useRef(null);
  const TARGET = 4;

  useEffect(() => {
    if (throws >= TARGET && !done) {
      setDone(true);
      playSparkle();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(rect.width / 2, rect.height * 0.3, { colors: SPARKLE_COLORS, count: 25, spread: 100 });
      }
      setTimeout(onComplete, 1500);
    }
  }, [throws, done, onComplete, burst]);

  const handleThrow = useCallback(() => {
    if (done || ballState !== 'ready') return;
    playBoing();
    setBallState('flying');
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      burst(rect.width / 2, rect.height * 0.7, { colors: BALL_COLORS, count: 6, spread: 40 });
    }
    // Ball flies, puppy chases
    setTimeout(() => {
      playPop();
      setBallState('returning');
      if (rect) {
        burst(rect.width / 2, rect.height * 0.3, { colors: HEART_COLORS, count: 8, spread: 50 });
      }
    }, 1200);
    // Puppy brings it back
    setTimeout(() => {
      playSuccess();
      setBallState('ready');
      setThrows(t => t + 1);
    }, 2200);
  }, [done, ballState, burst]);

  const puppyAnim = ballState === 'flying' ? 'bounce' : ballState === 'returning' ? 'happy' : 'idle';

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <ParticleLayer />

      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? `✨ ${puppy.name} loved that!` : ballState === 'flying' ? `${puppy.name} is running!` : ballState === 'returning' ? 'Good catch!' : 'Tap the ball to throw!'}
        </p>
      </div>

      {/* Puppy */}
      <div className={`absolute left-1/2 -translate-x-1/2 z-[5] transition-all duration-700
                       ${ballState === 'flying' ? 'translate-x-[30%] scale-90' : ballState === 'returning' ? '-translate-x-1/2 scale-100' : '-translate-x-1/2'}`}
           style={{ top: '8%' }}>
        <PuppyImage breed={puppy.breed}
          state={ballState === 'returning' ? 'excited' : 'clean'}
          animation={puppyAnim}
          className="w-52 h-52 sm:w-68 sm:h-68" />
      </div>

      {/* Ball */}
      {ballState === 'ready' && !done && (
        <div className="absolute z-20" style={{ left: '50%', bottom: '22%', transform: 'translateX(-50%)' }}>
          <button onClick={handleThrow}
            className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
            <div className="w-20 h-20 rounded-full bg-red-500 shadow-xl flex items-center justify-center
                           border-4 border-red-400 relative">
              <div className="absolute inset-0 rounded-full"
                   style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
              <span className="text-white font-bold text-sm font-heading drop-shadow">THROW!</span>
            </div>
            {throws === 0 && (
              <div className="absolute inset-0 rounded-full animate-pulse"
                   style={{ boxShadow: '0 0 20px 8px rgba(239,68,68,0.3)' }} />
            )}
          </button>
        </div>
      )}

      {/* Flying ball animation */}
      {ballState === 'flying' && (
        <div className="absolute z-20 fetch-ball-fly" style={{ left: '50%', bottom: '25%' }}>
          <div className="w-12 h-12 rounded-full bg-red-500 shadow-lg border-2 border-red-400">
            <div className="absolute inset-0 rounded-full"
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3
                      bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30">
        {Array.from({ length: TARGET }).map((_, i) => (
          <span key={i} className={`text-2xl transition-all duration-500 ${i < throws ? 'scale-110' : 'opacity-25 scale-75 grayscale'}`}>
            {i < throws ? '⚾' : '⚪'}
          </span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── TUG ACTIVITY STEPS ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

function TugStep({ puppy, onComplete }) {
  const containerRef = useRef(null);
  const [tugs, setTugs] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [done, setDone] = useState(false);
  const lastTugTime = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const TARGET = 8;

  useEffect(() => {
    if (tugs >= TARGET && !done) {
      setDone(true);
      playCelebrate();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(rect.width / 2, rect.height * 0.3, { colors: SPARKLE_COLORS, count: 25, spread: 100 });
      }
      setTimeout(onComplete, 1500);
    }
  }, [tugs, done, onComplete, burst]);

  const handlePointerDown = useCallback(() => {
    if (done) return;
    setPulling(true);
  }, [done]);

  const handlePointerMove = useCallback((e) => {
    if (!pulling || done) return;
    e.preventDefault();
    const now = Date.now();
    if (now - lastTugTime.current > 350) {
      lastTugTime.current = now;
      playPop();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(e.clientX - rect.left, e.clientY - rect.top, { colors: HEART_COLORS, count: 4, spread: 30 });
      }
      setTugs(t => Math.min(t + 1, TARGET));
    }
  }, [pulling, done, burst]);

  const handlePointerUp = useCallback(() => {
    setPulling(false);
  }, []);

  const ratio = tugs / TARGET;

  return (
    <div ref={containerRef} className="absolute inset-0 z-10"
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerLeave={handlePointerUp}
         style={{ touchAction: 'none' }}>
      <ParticleLayer />

      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? `✨ ${puppy.name} wins!` : pulling ? 'Pull! Pull! 💪' : 'Swipe to play tug!'}
        </p>
      </div>

      {/* Puppy holding rope */}
      <div className={`absolute z-[5] transition-all duration-200 ${pulling ? 'translate-x-2' : ''}`}
           style={{ left: '50%', top: '8%', transform: `translateX(-50%) ${pulling ? 'translateX(8px)' : ''}` }}>
        <PuppyImage breed={puppy.breed}
          state={done ? 'excited' : 'clean'}
          animation={pulling ? 'wiggle' : done ? 'happy' : 'idle'}
          className="w-52 h-52 sm:w-68 sm:h-68" />
      </div>

      {/* Rope visual extending to player area */}
      <div className="absolute z-[4] pointer-events-none" style={{ left: '15%', top: '58%', width: '70%' }}>
        <svg viewBox="0 0 200 40" className="w-full" style={{ overflow: 'visible' }}>
          <path d={`M 180 20 Q 120 ${pulling ? 10 : 25}, 40 ${pulling ? 15 : 30} Q 20 ${pulling ? 18 : 35}, 0 ${pulling ? 20 : 38}`}
                stroke="#d4960a" strokeWidth="8" fill="none" strokeLinecap="round"
                className={pulling ? 'tug-pull' : ''} />
          <path d={`M 180 20 Q 120 ${pulling ? 10 : 25}, 40 ${pulling ? 15 : 30} Q 20 ${pulling ? 18 : 35}, 0 ${pulling ? 20 : 38}`}
                stroke="#e8b830" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 8"
                className={pulling ? 'tug-pull' : ''} />
        </svg>
      </div>

      {/* Pull instruction */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/30 flex items-center gap-3">
          <span className="text-3xl">🪢</span>
          <div>
            <p className="font-heading text-amber-900 text-sm">Tug of War!</p>
            <p className="text-xs text-amber-700/60">Swipe back and forth!</p>
          </div>
        </div>
      </div>

      {/* Tug strength meter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                      bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30">
        <div className="flex gap-1 items-center">
          {Array.from({ length: TARGET }, (_, i) => (
            <div key={i} className={`h-5 rounded-full transition-all duration-300 ${i < tugs ? 'bg-amber-400 w-5' : 'bg-gray-200 w-3'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── SHARED STEPS ─────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

function ChoiceScreen({ puppy, items, title, subtitle, onChoose }) {
  const [chosen, setChosen] = useState(null);

  const handleChoose = useCallback((item) => {
    playSparkle();
    setChosen(item.id);
    setTimeout(() => onChoose(item), 800);
  }, [onChoose]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      {/* Show puppy above choices */}
      <div className="mb-2">
        <PuppyImage breed={puppy.breed} state="fluffy" animation="idle"
          className="w-32 h-32 sm:w-44 sm:h-44" />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl px-6 py-3 mb-4 shadow-xl border border-white/40 text-center">
        <h2 className="text-xl sm:text-2xl font-heading text-amber-900">{title}</h2>
        <p className="text-sm text-amber-700 font-heading mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {items.map(item => (
          <button key={item.id} onClick={() => !chosen && handleChoose(item)}
            className={`bg-white/60 backdrop-blur-md rounded-3xl p-4 border-2 shadow-xl
                       flex flex-col items-center gap-2 transition-all cursor-pointer
                       w-28 sm:w-32
                       ${chosen === item.id
                         ? 'border-pink-400 scale-110 bg-pink-50/80 shadow-pink-200'
                         : chosen
                         ? 'border-white/20 opacity-40 scale-90'
                         : 'border-white/30 hover:bg-white/80 hover:scale-105 active:scale-95'
                       }`}>
            <span className="text-4xl">{item.emoji}</span>
            <span className="font-heading text-amber-900 text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CelebrateScreen({ puppy, accessory, onFinish }) {
  const { burst, ParticleLayer } = useParticleBurst();
  const ref = useRef(null);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    playCelebrate();
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      burst(rect.width / 2, rect.height * 0.3, { colors: HEART_COLORS, count: 25, spread: 120 });
      setTimeout(() => burst(rect.width * 0.25, rect.height * 0.35, { colors: SPARKLE_COLORS, count: 15, spread: 70 }), 400);
      setTimeout(() => burst(rect.width * 0.75, rect.height * 0.35, { colors: SPARKLE_COLORS, count: 15, spread: 70 }), 600);
    }
    setTimeout(() => setShowBadge(true), 1200);
  }, [burst]);

  const activityBadge = {
    wash: { text: 'Bath Time Hero', emoji: '🛁' },
    fetch: { text: 'Super Thrower', emoji: '⚾' },
    tug: { text: 'Tug Champion', emoji: '💪' },
  }[puppy.activity] || { text: 'Kind Helper', emoji: '💖' };

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      <ParticleLayer />
      <div className="relative mb-4" style={{ animation: 'celebrate-bounce 1.5s ease-in-out infinite' }}>
        <PuppyImage breed={puppy.breed} state="excited"
          animation="happy"
          className="w-44 h-44 sm:w-56 sm:h-56" />
        {[...Array(6)].map((_, i) => (
          <span key={i} className="absolute text-2xl animate-float-up pointer-events-none"
                style={{
                  left: `${15 + i * 14}%`, top: `${5 + Math.random() * 20}%`,
                  animationDelay: `${i * 0.3}s`, animationDuration: `${1.5 + Math.random()}s`,
                }}>❤️</span>
        ))}
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-3xl px-6 py-3 mb-3 shadow-xl border border-white/40 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading text-amber-900">{puppy.name} Is Happy!</h2>
        <p className="text-base text-amber-700 font-heading mt-1">You were so kind and gentle</p>
      </div>
      {showBadge && (
        <div className="animate-spring-in mb-4">
          <div className="bg-gradient-to-b from-amber-50 to-pink-50 rounded-2xl px-6 py-3 border-2 border-amber-200/50 shadow-xl flex items-center gap-3">
            <span className="text-4xl">{activityBadge.emoji}</span>
            <div>
              <p className="font-heading text-amber-900 text-sm">{activityBadge.text}</p>
              <p className="text-xs text-amber-700/60">You earned a badge!</p>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => { playNavigate(); onFinish(); }}
        className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-heading text-base
                   px-8 py-3 rounded-full shadow-xl transition-all border border-amber-400/50">
        Play Again! 🐾
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── MAIN GAME ────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

export default function PuppyWash() {
  const containerRef = useRef(null);
  const [step, setStep] = useState('select');
  const [puppy, setPuppy] = useState(null);
  const [accessory, setAccessory] = useState(null);

  const advanceTo = useCallback((next) => {
    setStep(next);
  }, []);

  const handlePuppySelect = useCallback((p) => {
    setPuppy(p);
    setStep('story');
  }, []);

  const handleDressChoice = useCallback((item) => {
    setAccessory(item);
    setStep('celebrate');
  }, []);

  const handleFinish = useCallback(() => {
    setPuppy(null);
    setAccessory(null);
    setStep('select');
  }, []);

  // Background gradient per activity
  const bgGradient = !puppy ? 'linear-gradient(to bottom, #fef3c7, #fde68a, #fecdd3)'
    : puppy.activity === 'wash' ? 'linear-gradient(to bottom, #e0f2fe, #bae6fd, #fecdd3)'
    : puppy.activity === 'fetch' ? 'linear-gradient(to bottom, #d9f99d, #bef264, #fef3c7)'
    : 'linear-gradient(to bottom, #fef3c7, #fde68a, #fed7aa)';

  return (
    <div ref={containerRef}
         className="relative w-full h-full overflow-hidden touch-none select-none">
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{ background: bgGradient }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-[2]"
           style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.06) 0%, transparent 60%)' }} />

      <BackButton />

      {/* Select puppy */}
      {step === 'select' && <SelectScreen onSelect={handlePuppySelect} />}

      {/* Story intro */}
      {step === 'story' && puppy && (
        <StoryIntro puppy={puppy}
          onFinish={() => advanceTo(puppy.activity === 'wash' ? 'soap' : puppy.activity)} />
      )}

      {/* ── WASH ACTIVITY ── */}
      {step === 'soap' && puppy && (
        <SoapPumpStep key="soap" puppy={puppy} onComplete={() => advanceTo('scrub')} />
      )}
      {step === 'scrub' && puppy && (
        <RubStep key="scrub" puppy={puppy}
          config={{
            title: 'Scrub Scrub', voice: 'Rub the mud off gently!',
            toolEmoji: '🧽', target: 5, particles: BUBBLE_COLORS,
            puppyState: (r) => r < 0.5 ? 'soapy' : 'wet',
            showInBath: true,
          }}
          onComplete={() => advanceTo('dry')} />
      )}
      {step === 'dry' && puppy && (
        <RubStep key="dry" puppy={puppy}
          config={{
            title: 'Dry Off', voice: `Rub the towel over ${puppy?.name}!`,
            toolEmoji: '🧣', target: 5, particles: HEART_COLORS,
            puppyState: (r) => r < 0.5 ? 'wet' : 'clean',
            showInBath: false,
          }}
          onComplete={() => advanceTo('brush')} />
      )}
      {step === 'brush' && puppy && (
        <RubStep key="brush" puppy={puppy}
          config={{
            title: 'Brush Softly', voice: 'Stroke to make fur soft and shiny!',
            toolEmoji: '✨', target: 5, particles: SPARKLE_COLORS,
            puppyState: (r) => r < 0.5 ? 'clean' : 'fluffy',
            showInBath: false,
          }}
          onComplete={() => advanceTo('dress')} />
      )}
      {step === 'dress' && puppy && (
        <ChoiceScreen puppy={puppy} items={ACCESSORIES}
          title="Pick Something Nice"
          subtitle={`Choose something pretty for ${puppy?.name}!`}
          onChoose={handleDressChoice} />
      )}

      {/* ── FETCH ACTIVITY ── */}
      {step === 'fetch' && puppy && (
        <FetchStep key="fetch" puppy={puppy}
          onComplete={() => advanceTo('belly-rub')} />
      )}

      {/* ── TUG ACTIVITY ── */}
      {step === 'tug' && puppy && (
        <TugStep key="tug" puppy={puppy}
          onComplete={() => advanceTo('belly-rub')} />
      )}

      {/* ── SHARED: Belly rubs after play activities ── */}
      {step === 'belly-rub' && puppy && (
        <RubStep key="belly" puppy={puppy}
          config={{
            title: 'Belly Rubs!', voice: `${puppy?.name} wants belly rubs!`,
            toolEmoji: '🤗', target: 5, particles: HEART_COLORS,
            puppyState: 'excited',
            showInBath: false,
          }}
          onComplete={() => advanceTo(puppy.activity === 'wash' ? 'dress' : 'celebrate')} />
      )}

      {/* ── CELEBRATE ── */}
      {step === 'celebrate' && puppy && (
        <CelebrateScreen puppy={puppy} accessory={accessory}
          onFinish={handleFinish} />
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        .animate-float-up { animation: float-up 2s ease-out forwards; }

        @keyframes bubble-float {
          0% { transform: translateY(0) translateX(0) scale(0.3); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translateY(-110vh) translateX(var(--drift, 0px)) scale(1); opacity: 0; }
        }

        @keyframes celebrate-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-2deg); }
          75% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes fetch-ball-fly {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          50% { transform: translate(30%, -200%) scale(0.7); opacity: 0.8; }
          100% { transform: translate(80%, -50%) scale(0.5); opacity: 0; }
        }
        .fetch-ball-fly { animation: fetch-ball-fly 1.2s ease-out forwards; }

        .tug-pull {
          animation: tug-shake 0.15s ease-in-out infinite;
        }
        @keyframes tug-shake {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        .animate-spring-in {
          animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes spring-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
