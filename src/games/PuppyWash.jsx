import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import {
  playPop, playSuccess, playSparkle, playBoing, playPoof,
  playTone, playCelebrate, playNavigate,
} from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';

const IMG = '/arthurs-world/images/disney/puppy-wash';
const HEART_COLORS = ['#f472b6', '#ec4899', '#f9a8d4', '#fda4af', '#fb7185'];
const BUBBLE_COLORS = ['#bfdbfe', '#93c5fd', '#ddd6fe', '#e9d5ff', '#fbcfe8'];
const SPARKLE_COLORS = ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a'];
const MUD_COLORS = ['#92400e', '#78350f', '#a16207', '#854d0e'];

// ── Soft-edge scene image ────────────────────────────────────────────
// Blends character images into the background by fading their edges
// This is the single biggest quality improvement — no more "sticker" look
function SceneImg({ src, alt, emoji, className = '', style = {}, soft = true }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <span className={`select-none ${className}`} style={{ fontSize: '4rem', lineHeight: 1, ...style }} role="img" aria-label={alt}>{emoji}</span>;
  }
  return (
    <img src={src} alt={alt} className={className} draggable={false}
         onError={() => setFailed(true)}
         style={{
           ...style,
           ...(soft ? { maskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, black 55%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, black 55%, transparent 90%)' } : {}),
         }} />
  );
}

/** Simple image with emoji fallback (for UI items, not scene characters) */
function FallbackImg({ src, alt, emoji, className = '', style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <span className={`select-none ${className}`} style={{ fontSize: '4rem', lineHeight: 1, ...style }} role="img" aria-label={alt}>{emoji}</span>;
  }
  return <img src={src} alt={alt} className={className} style={style} draggable={false}
              onError={() => setFailed(true)} />;
}

// ── Data ─────────────────────────────────────────────────────────────
const PUPPIES = [
  { id: 'muddy',  name: 'Muddy Pup',  img: `${IMG}/puppy-muddy.png`,  emoji: '🐶', label: 'Needs a bath!' },
  { id: 'sleepy', name: 'Sleepy Pup', img: `${IMG}/puppy-sleepy.png`, emoji: '😴', label: 'Feeling sleepy' },
  { id: 'shy',    name: 'Shy Pup',    img: `${IMG}/puppy-shy.png`,    emoji: '🙈', label: 'A bit shy' },
];

const ACCESSORIES = [
  { id: 'collar', label: 'Red Collar',      img: `${IMG}/collar-red.png`,      emoji: '❤️' },
  { id: 'bow',    label: 'Blue Bow',        img: `${IMG}/bow-blue.png`,        emoji: '🎀' },
  { id: 'bandana',label: 'Yellow Bandana',  img: `${IMG}/bandana-yellow.png`,  emoji: '🧣' },
];

const CARE_ITEMS = [
  { id: 'treat',   label: 'Treat',   img: `${IMG}/treat-bone.png`,   emoji: '🦴' },
  { id: 'water',   label: 'Water',   img: `${IMG}/water-bowl.png`,   emoji: '💧' },
  { id: 'toy',     label: 'Toy',     img: `${IMG}/toy-ball.png`,     emoji: '🎾' },
  { id: 'blanket', label: 'Blanket', img: `${IMG}/blanket-soft.png`, emoji: '🛏️' },
];

const STEPS = ['story', 'select', 'wash', 'scrub', 'dry', 'brush', 'dress', 'care', 'celebrate', 'room'];

// ── Story Intro ──────────────────────────────────────────────────────
const STORY_PAGES = [
  { text: 'One sunny morning, a little dalmatian puppy went out to play...', emoji: '☀️' },
  { text: 'Splash! Squelch! The puppy found the BIGGEST mud puddle!',       emoji: '💦' },
  { text: 'Oh no! Now puppy is covered in mud from nose to tail!',          emoji: '🐾' },
  { text: "Don't worry — YOU can help! Let's give puppy a bath!",           emoji: '🛁' },
];

function StoryIntro({ onFinish }) {
  const [page, setPage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const { burst, ParticleLayer } = useParticleBurst();
  const ref = useRef(null);

  const handleTap = useCallback(() => {
    playPop();
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const colors = page < 2 ? MUD_COLORS : page === 2 ? HEART_COLORS : BUBBLE_COLORS;
      burst(rect.width / 2, rect.height * 0.4, { colors, count: 8, spread: 60 });
    }
    if (page < STORY_PAGES.length - 1) {
      setFadeIn(false);
      setTimeout(() => { setPage(p => Math.min(p + 1, STORY_PAGES.length - 1)); setFadeIn(true); }, 300);
    } else {
      onFinish();
    }
  }, [page, onFinish, burst]);

  const s = STORY_PAGES[page];

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 cursor-pointer"
         onClick={handleTap}>
      <ParticleLayer />
      {/* Big centered puppy — blended into scene */}
      <div className={`mb-4 transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <SceneImg src={page <= 1 ? `${IMG}/puppy-happy.png` : `${IMG}/puppy-muddy.png`}
             alt="Puppy" emoji={page <= 1 ? '🐶' : '😟'}
             className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-xl puppy-breathe" />
      </div>
      <div className={`max-w-sm text-center transition-all duration-500 bg-white/80 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl border border-white/40 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-lg sm:text-xl font-heading text-amber-900 leading-relaxed">
          <span className="text-3xl mr-2">{s.emoji}</span>
          {s.text}
        </p>
      </div>
      <p className="absolute bottom-8 text-sm text-white font-heading animate-pulse drop-shadow-lg"
         style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        {page < STORY_PAGES.length - 1 ? 'Tap to continue...' : 'Tap to start helping!'}
      </p>
      <div className="absolute bottom-16 flex gap-2">
        {STORY_PAGES.map((_, i) => (
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
               background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(147,197,253,0.25) 40%, transparent 70%)`,
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

// ── Soap Pump Step ──────────────────────────────────────────────────
// The whole soap bottle is tappable. Puppy sits big and centered in the bath.
// Foam builds up dramatically, puppy progressively gets cleaner.
function SoapPumpStep({ onComplete }) {
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
        setTimeout(() => burst(rect.width * 0.3, rect.height * 0.5, { colors: BUBBLE_COLORS, count: 15, spread: 60 }), 200);
        setTimeout(() => burst(rect.width * 0.7, rect.height * 0.5, { colors: BUBBLE_COLORS, count: 15, spread: 60 }), 400);
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
      // Burst from near the soap bottle toward the puppy
      burst(rect.width * 0.65, rect.height * 0.45, { colors: BUBBLE_COLORS, count: 8, spread: 50 });
    }
    setPumps(p => p + 1);
    setTimeout(() => setPumping(false), 400);
  }, [done, pumping, burst]);

  const pumpRatio = pumps / TARGET;

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <ParticleLayer />

      {/* Title — minimal, top center */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? '✨ So clean!' : 'Tap the soap! 🧴'}
        </p>
      </div>

      {/* ── Puppy — BIG and centered, sitting in the bath ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '12%' }}>
        <div className="relative">
          {/* Muddy → soapy crossfade */}
          <SceneImg src={`${IMG}/puppy-muddy.png`} alt="Puppy" emoji="🐶"
               className={`w-60 h-60 sm:w-80 sm:h-80 object-contain drop-shadow-xl transition-opacity duration-700 ${pumping ? 'puppy-wiggle' : 'puppy-breathe'}`}
               style={{ opacity: 1 - pumpRatio * 0.85 }} />
          <SceneImg src={`${IMG}/puppy-soapy.png`} alt="" emoji=""
               className={`absolute inset-0 w-60 h-60 sm:w-80 sm:h-80 object-contain drop-shadow-xl transition-opacity duration-700 ${pumping ? 'puppy-wiggle' : 'puppy-breathe'}`}
               style={{ opacity: pumpRatio * 0.95 }} />

          {/* Foam accumulation — big soft blobs that build up */}
          {pumps > 0 && (
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: Math.min(pumpRatio * 1.2, 1) }}>
              {Array.from({ length: pumps * 5 }, (_, i) => {
                const size = 18 + (i % 4) * 12;
                return (
                  <div key={i} className="absolute rounded-full bubble-wobble"
                       style={{
                         width: `${size}px`, height: `${size}px`,
                         background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(186,230,253,0.4) 60%, transparent)',
                         boxShadow: 'inset -1px -2px 4px rgba(147,197,253,0.2)',
                         left: `${8 + (i * 13 + i * i * 7) % 80}%`,
                         top: `${15 + (i * 17 + i * i * 3) % 65}%`,
                         animationDelay: `${(i * 0.15) % 2}s`,
                       }} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Soap bottle — right side, big and tappable ── */}
      <div className="absolute z-20" style={{ right: '4%', bottom: '18%' }}>
        <button onClick={handlePump}
          className={`relative cursor-pointer transition-transform duration-200 ${!done ? 'hover:scale-110 active:scale-90' : 'opacity-60'}`}
          disabled={done}>
          <div className={`transition-transform duration-150 ${pumping ? 'scale-90 translate-y-1' : ''}`}>
            <FallbackImg src={`${IMG}/soap-bottle.png`} alt="Soap" emoji="🧴"
                 className="w-24 h-32 sm:w-28 sm:h-36 object-contain drop-shadow-xl" />
          </div>
          {/* Tap hint glow */}
          {!done && pumps === 0 && (
            <div className="absolute inset-0 rounded-3xl animate-pulse"
                 style={{ boxShadow: '0 0 20px 8px rgba(236,72,153,0.3)' }} />
          )}
        </button>
      </div>

      {/* ── Progress — paw prints filling up ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3
                      bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30">
        {Array.from({ length: TARGET }).map((_, i) => (
          <span key={i} className={`text-2xl transition-all duration-500 ${i < pumps ? 'scale-110 drop-shadow-md' : 'opacity-25 scale-75 grayscale'}`}>
            {i < pumps ? '🐾' : '🐾'}
          </span>
        ))}
      </div>

      {/* Bubble flood when done */}
      <FloatingBubbles count={done ? 40 : pumps * 5} active={pumps > 0} />
    </div>
  );
}

// ── Rub/Swipe Step (scrub, dry, brush) ──────────────────────────────
// Big centered puppy. Rub finger over it. Progressive crossfade from
// startImg → puppyImg as progress increases. Puppy wiggles when touched.
function RubStep({ config, onComplete }) {
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

  return (
    <div ref={containerRef} className="absolute inset-0 z-10"
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerLeave={handlePointerUp}
         style={{ touchAction: 'none' }}>
      <ParticleLayer />

      {/* Title */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
        <p className="text-sm font-heading text-amber-900">
          {done ? '✨ All done!' : config.voice}
        </p>
      </div>

      {/* ── Big centered puppy — crossfading ── */}
      <div ref={puppyRef}
           className={`absolute left-1/2 -translate-x-1/2 z-[5] transition-transform duration-200
                       ${done ? 'animate-bounce' : ''}`}
           style={{ top: '10%' }}>
        <div className="relative">
          {config.startImg && (
            <SceneImg src={config.startImg} alt="Puppy" emoji={config.puppyEmoji}
                 className={`w-60 h-60 sm:w-80 sm:h-80 object-contain drop-shadow-xl transition-opacity duration-500 ${touching ? 'puppy-wiggle' : 'puppy-breathe'}`}
                 style={{ opacity: 1 - ratio }} />
          )}
          <SceneImg src={config.puppyImg} alt="Puppy" emoji={config.puppyEmoji}
               className={`${config.startImg ? 'absolute inset-0' : ''} w-60 h-60 sm:w-80 sm:h-80 object-contain drop-shadow-xl transition-opacity duration-500 ${touching ? 'puppy-wiggle' : 'puppy-breathe'}`}
               style={{ opacity: config.startImg ? ratio : 1 }} />
        </div>
      </div>

      {/* Tool + instruction — bottom area */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/30 flex items-center gap-3">
          <FallbackImg src={config.toolImg} alt="" emoji={config.toolEmoji}
               className="w-12 h-12 object-contain" style={{ fontSize: '2.5rem' }} />
          <div>
            <p className="font-heading text-amber-900 text-sm">{config.title}</p>
            <p className="text-xs text-amber-700/60">Rub your finger over puppy!</p>
          </div>
        </div>
      </div>

      {/* Progress bar — hearts */}
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

// ── Select Screen ───────────────────────────────────────────────────
function SelectScreen({ onSelect }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      {/* Parent dogs watching from above */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 opacity-30 pointer-events-none">
        <SceneImg src={`${IMG}/pongo.png`} alt="" emoji="🐕‍🦺" className="w-16 h-16 sm:w-24 sm:h-24 object-contain" style={{ fontSize: '2.5rem' }} />
        <SceneImg src={`${IMG}/perdita.png`} alt="" emoji="🐕" className="w-16 h-16 sm:w-24 sm:h-24 object-contain" style={{ fontSize: '2.5rem' }} />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl px-6 py-3 mb-4 shadow-xl border border-white/40 text-center">
        <h2 className="text-xl sm:text-2xl font-heading text-amber-900">
          Which puppy needs help?
        </h2>
        <p className="text-sm text-amber-700 font-heading mt-1">Choose a puppy to care for</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {PUPPIES.map(puppy => (
          <button key={puppy.id} onClick={() => { playNavigate(); onSelect(puppy); }}
            className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl p-4 border-2 border-white/30
                       hover:bg-white/80 hover:scale-105 active:scale-95 transition-all
                       flex flex-col items-center gap-2 shadow-xl cursor-pointer">
            <SceneImg src={puppy.img} alt={puppy.name} emoji={puppy.emoji}
                 className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
            <span className="font-heading text-amber-900 text-base">{puppy.name}</span>
            <span className="text-xs text-amber-700/60">{puppy.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Choice Screen (dress / care) ────────────────────────────────────
function ChoiceScreen({ items, title, subtitle, onChoose }) {
  const [chosen, setChosen] = useState(null);

  const handleChoose = useCallback((item) => {
    playSparkle();
    setChosen(item.id);
    setTimeout(() => onChoose(item), 800);
  }, [onChoose]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
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
            <SceneImg src={item.img} alt={item.label} emoji={item.emoji}
                 className="w-18 h-18 sm:w-22 sm:h-22 object-contain" soft={false} />
            <span className="font-heading text-amber-900 text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Celebrate Screen ────────────────────────────────────────────────
function CelebrateScreen({ puppy, accessory, careItem, onFinish }) {
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

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      <ParticleLayer />
      <div className="relative mb-4" style={{ animation: 'celebrate-bounce 1.5s ease-in-out infinite' }}>
        <SceneImg src={`${IMG}/puppy-happy.png`} alt="Happy puppy" emoji="🎉"
             className="w-52 h-52 sm:w-64 sm:h-64 object-contain drop-shadow-xl" />
        {[...Array(6)].map((_, i) => (
          <span key={i} className="absolute text-2xl animate-float-up pointer-events-none"
                style={{
                  left: `${15 + i * 14}%`, top: `${5 + Math.random() * 20}%`,
                  animationDelay: `${i * 0.3}s`, animationDuration: `${1.5 + Math.random()}s`,
                }}>❤️</span>
        ))}
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-3xl px-6 py-3 mb-3 shadow-xl border border-white/40 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading text-amber-900">You Were Kind!</h2>
        <p className="text-base text-amber-700 font-heading mt-1">Puppy feels happy and safe</p>
      </div>
      {showBadge && (
        <div className="animate-spring-in mb-4">
          <div className="bg-gradient-to-b from-amber-50 to-pink-50 rounded-2xl px-6 py-3 border-2 border-amber-200/50 shadow-xl flex items-center gap-3">
            <FallbackImg src={`${IMG}/heart-badge.png`} alt="Kind Helper" emoji="💖" className="w-14 h-14 object-contain" />
            <div>
              <p className="font-heading text-amber-900 text-sm">Kind Helper Heart</p>
              <p className="text-xs text-amber-700/60">You earned a badge!</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => { playNavigate(); onFinish('room'); }}
          className="bg-pink-500 hover:bg-pink-400 active:scale-95 text-white font-heading text-base
                     px-6 py-3 rounded-full shadow-xl transition-all border border-pink-400/50">
          Puppy Room 🏠
        </button>
        <button onClick={() => { playNavigate(); onFinish('again'); }}
          className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-heading text-base
                     px-6 py-3 rounded-full shadow-xl transition-all border border-amber-400/50">
          Help Another! 🐾
        </button>
      </div>
    </div>
  );
}

// ── Puppy Room ──────────────────────────────────────────────────────
function PuppyRoom({ puppies, onBack }) {
  return (
    <div className="absolute inset-0 z-10">
      <img src={`${IMG}/bg-room.png`} alt="" className="absolute inset-0 w-full h-full object-cover"
           onError={(e) => { e.target.style.display = 'none'; }} />
      <div className="absolute inset-0 z-[-1]"
           style={{ background: 'linear-gradient(to bottom, #fef3c7, #fde68a, #f5d0fe)' }} />
      <div className="relative z-10 p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => { playNavigate(); onBack(); }}
            className="bg-white/80 backdrop-blur-md rounded-full px-4 py-2 font-heading text-amber-900
                       text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg border border-white/40">
            ← Back
          </button>
          <h2 className="font-heading text-xl text-amber-900 bg-white/80 backdrop-blur-md rounded-full px-5 py-1.5 shadow-lg border border-white/40">
            Puppy Room
          </h2>
          <div className="w-16" />
        </div>
        {puppies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl px-8 py-6 shadow-xl border border-white/30 text-center">
              <p className="text-amber-700 font-heading text-lg">Help some puppies and</p>
              <p className="text-amber-700 font-heading text-lg">they'll appear here!</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-wrap justify-center gap-4 overflow-auto">
            {puppies.map((p, i) => (
              <button key={i} onClick={() => playBoing()}
                className="bg-white/60 backdrop-blur-md rounded-3xl p-3 flex flex-col items-center gap-1
                           hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer w-28 border border-white/30">
                <SceneImg src={`${IMG}/puppy-sleeping.png`} alt="" emoji="😴"
                     className="w-22 h-22 object-contain" />
                <span className="text-xs font-heading text-amber-900">{p.name}</span>
                <span className="text-[10px] text-amber-700/50">{p.accessory}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Game ───────────────────────────────────────────────────────
export default function PuppyWash() {
  const containerRef = useRef(null);
  const [step, setStep] = useState('story');
  const [puppy, setPuppy] = useState(null);
  const [accessory, setAccessory] = useState(null);
  const [careItem, setCareItem] = useState(null);
  const [savedPuppies, setSavedPuppies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('puppyWashRoom') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('puppyWashRoom', JSON.stringify(savedPuppies));
  }, [savedPuppies]);

  const advanceStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      playSuccess();
      setStep(STEPS[idx + 1]);
    }
  }, [step]);

  const handlePuppySelect = useCallback((p) => {
    setPuppy(p);
    setStep('wash');
  }, []);

  const handleDressChoice = useCallback((item) => {
    setAccessory(item);
    advanceStep();
  }, [advanceStep]);

  const handleCareChoice = useCallback((item) => {
    setCareItem(item);
    advanceStep();
  }, [advanceStep]);

  const handleCelebrateFinish = useCallback((action) => {
    setSavedPuppies(prev => [...prev, {
      name: puppy?.name || 'Puppy',
      accessory: accessory?.label || '',
      care: careItem?.label || '',
      date: Date.now(),
    }]);
    if (action === 'room') {
      setStep('room');
    } else {
      setPuppy(null); setAccessory(null); setCareItem(null);
      setStep('story');
    }
  }, [puppy, accessory, careItem]);

  // Step configs for rub steps — startImg crossfades into puppyImg
  const rubConfigs = {
    scrub: { title: 'Scrub Scrub',  voice: 'Rub the mud off gently!',           toolImg: null,              toolEmoji: '🧽', target: 5, particles: BUBBLE_COLORS,  startImg: `${IMG}/puppy-muddy.png`, puppyImg: `${IMG}/puppy-soapy.png`, puppyEmoji: '🧽' },
    dry:   { title: 'Dry Off',      voice: 'Rub the towel over puppy!',          toolImg: `${IMG}/towel.png`,toolEmoji: '🧣', target: 5, particles: HEART_COLORS,   startImg: `${IMG}/puppy-wet.png`,   puppyImg: `${IMG}/puppy-fluffy.png`,puppyEmoji: '🐕' },
    brush: { title: 'Brush Softly', voice: 'Stroke to make fur soft and shiny!', toolImg: `${IMG}/brush.png`,toolEmoji: '✨', target: 5, particles: SPARKLE_COLORS, puppyImg: `${IMG}/puppy-fluffy.png`,puppyEmoji: '✨' },
  };

  return (
    <div ref={containerRef}
         className="relative w-full h-full overflow-hidden touch-none select-none">
      {/* Background */}
      {step === 'room' ? null : (
        <>
          <img src={`${IMG}/bg-bath.png`} alt="" className="absolute inset-0 w-full h-full object-cover z-0"
               onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="absolute inset-0 z-[-1]"
               style={{ background: 'linear-gradient(to bottom, #fef3c7, #fde68a, #fecdd3)' }} />
        </>
      )}

      {/* Warm ambient glow — Disney "magic hour" feel */}
      <div className="absolute inset-0 pointer-events-none z-[2]"
           style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.06) 0%, transparent 60%)' }} />

      <BackButton />

      {/* Story intro */}
      {step === 'story' && <StoryIntro onFinish={() => setStep('select')} />}

      {/* Select screen */}
      {step === 'select' && <SelectScreen onSelect={handlePuppySelect} />}

      {/* Wash: Soap pump mechanic */}
      {step === 'wash' && <SoapPumpStep key="wash" onComplete={advanceStep} />}

      {/* Scrub / Dry / Brush: Rub-the-puppy mechanic */}
      {['scrub', 'dry', 'brush'].includes(step) && rubConfigs[step] && (
        <RubStep key={step} config={rubConfigs[step]} onComplete={advanceStep} />
      )}

      {/* Dress screen */}
      {step === 'dress' && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '6%' }}>
            <SceneImg src={`${IMG}/puppy-fluffy.png`} alt="Fluffy puppy" emoji="🐩"
                 className="w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-xl puppy-breathe" />
          </div>
          <ChoiceScreen items={ACCESSORIES} title="Pick Something Nice"
                        subtitle="Choose something pretty for puppy!" onChoose={handleDressChoice} />
        </>
      )}

      {/* Care choice screen */}
      {step === 'care' && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '5%' }}>
            <SceneImg src={`${IMG}/puppy-happy.png`} alt="Happy puppy" emoji="🥰"
                 className="w-36 h-36 sm:w-48 sm:h-48 object-contain drop-shadow-xl puppy-breathe" />
          </div>
          <ChoiceScreen items={CARE_ITEMS} title="Choose Something Kind"
                        subtitle="What would make puppy feel loved?" onChoose={handleCareChoice} />
        </>
      )}

      {/* Celebrate */}
      {step === 'celebrate' && (
        <CelebrateScreen puppy={puppy} accessory={accessory} careItem={careItem}
                         onFinish={handleCelebrateFinish} />
      )}

      {/* Puppy Room */}
      {step === 'room' && (
        <PuppyRoom puppies={savedPuppies} onBack={() => setStep('select')} />
      )}

      {/* CSS animations — character personality */}
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

        /* Puppy breathes gently when idle */
        .puppy-breathe {
          animation: puppy-breathe 3s ease-in-out infinite;
        }
        @keyframes puppy-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-3px); }
        }

        /* Puppy wiggles when being washed/rubbed */
        .puppy-wiggle {
          animation: puppy-wiggle 0.3s ease-in-out infinite;
        }
        @keyframes puppy-wiggle {
          0%, 100% { transform: rotate(0deg) scale(1.02); }
          25% { transform: rotate(-2deg) scale(1.04); }
          75% { transform: rotate(2deg) scale(1.04); }
        }

        /* Foam blobs wobble gently */
        .bubble-wobble {
          animation: bubble-wobble 2s ease-in-out infinite;
        }
        @keyframes bubble-wobble {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(2px, -2px); }
          66% { transform: scale(0.95) translate(-1px, 1px); }
        }
      `}</style>
    </div>
  );
}
