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

/** Image with emoji fallback */
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
      <div className={`mb-6 transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <FallbackImg src={page <= 1 ? `${IMG}/puppy-happy.png` : `${IMG}/puppy-muddy.png`}
             alt="Puppy" emoji={page <= 1 ? '🐶' : '😟'}
             className="w-44 h-44 sm:w-56 sm:h-56 object-contain drop-shadow-lg" />
      </div>
      <div className={`max-w-md text-center transition-all duration-500 bg-white/70 backdrop-blur rounded-2xl px-5 py-3 shadow-lg ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-lg sm:text-xl font-heading text-amber-900 leading-relaxed">
          <span className="text-3xl mr-2">{s.emoji}</span>
          {s.text}
        </p>
      </div>
      <p className="absolute bottom-8 text-sm text-white font-heading animate-pulse drop-shadow-md">
        {page < STORY_PAGES.length - 1 ? 'Tap to continue...' : 'Tap to start helping!'}
      </p>
      <div className="absolute bottom-16 flex gap-2">
        {STORY_PAGES.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-amber-500 scale-125' : 'bg-amber-300/40'}`} />
        ))}
      </div>
    </div>
  );
}

// ── Floating Bubbles (persistent decoration during/after wash) ─────
function FloatingBubbles({ count, active }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 12 + Math.random() * 28,
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
               background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(147,197,253,0.3), transparent)`,
               border: '1px solid rgba(255,255,255,0.3)',
               animation: `bubble-float ${b.dur}s ease-out infinite`,
               animationDelay: `${b.delay}s`,
               '--drift': `${b.drift}px`,
             }} />
      ))}
    </div>
  );
}

// ── Soap Pump Step ──────────────────────────────────────────────────
// Static soap bottle on the right. Tap the pump top to squirt soap down.
// After 5 pumps, bubbles fill the screen and step completes.
function SoapPumpStep({ onComplete }) {
  const [pumps, setPumps] = useState(0);
  const [pumping, setPumping] = useState(false);
  const [squirts, setSquirts] = useState([]); // falling soap drops
  const [done, setDone] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();
  const containerRef = useRef(null);
  const TARGET = 5;

  useEffect(() => {
    if (pumps >= TARGET && !done) {
      setDone(true);
      playSparkle();
      // Big bubble explosion
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        burst(rect.width / 2, rect.height * 0.4, { colors: BUBBLE_COLORS, count: 25, spread: 100 });
      }
      setTimeout(onComplete, 1500);
    }
  }, [pumps, done, onComplete, burst]);

  const handlePump = useCallback(() => {
    if (done || pumping) return;
    setPumping(true);
    playPop();

    // Add a squirt drop
    setSquirts(prev => [...prev, { id: Date.now(), x: 68 + Math.random() * 4 }]);

    // Bubble burst at nozzle area
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      burst(rect.width * 0.70, rect.height * 0.42, { colors: BUBBLE_COLORS, count: 6, spread: 30 });
    }

    setPumps(p => p + 1);
    setTimeout(() => setPumping(false), 400);
  }, [done, pumping, burst]);

  // Clean up old squirts
  useEffect(() => {
    if (squirts.length > 10) {
      setSquirts(prev => prev.slice(-8));
    }
  }, [squirts]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <ParticleLayer />

      {/* Title */}
      <div className="absolute top-4 left-16 right-16 z-20 text-center bg-white/70 backdrop-blur rounded-2xl px-4 py-2 shadow-lg">
        <h2 className="text-lg font-heading text-amber-900">Bath Time!</h2>
        <p className="text-xs text-amber-700 font-heading">Press the soap to wash puppy!</p>
      </div>

      {/* Muddy puppy on the left — gets progressively covered in foam */}
      <div className="absolute z-[5]" style={{ left: '10%', top: '25%' }}>
        {/* Muddy puppy fades out as soapy puppy fades in */}
        <div className="relative w-40 h-40 sm:w-52 sm:h-52">
          <FallbackImg src={`${IMG}/puppy-muddy.png`} alt="Puppy" emoji="🐶"
               className="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-opacity duration-500"
               style={{ opacity: 1 - (pumps / TARGET) * 0.7 }} />
          <FallbackImg src={`${IMG}/puppy-soapy.png`} alt="" emoji=""
               className="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-opacity duration-500"
               style={{ opacity: (pumps / TARGET) * 0.9 }} />
          {/* Foam layer — grows with each pump */}
          {pumps > 0 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                 style={{ opacity: Math.min(pumps / TARGET, 0.8) }}>
              {/* Big foam blobs */}
              {Array.from({ length: pumps * 4 }, (_, i) => (
                <div key={i} className="absolute rounded-full animate-pulse"
                     style={{
                       width: `${14 + (i % 3) * 10}px`,
                       height: `${14 + (i % 3) * 10}px`,
                       background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(186,230,253,0.5))',
                       left: `${5 + (i * 17) % 85}%`,
                       top: `${10 + (i * 23) % 75}%`,
                       animationDelay: `${(i * 0.2) % 1}s`,
                     }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Soap bottle on the right — static, tap the top to pump */}
      <div className="absolute z-20" style={{ right: '8%', top: '28%' }}>
        {/* Pump top (tappable) */}
        <button onClick={handlePump}
          className={`relative cursor-pointer active:scale-95 transition-transform ${!done ? 'hover:scale-105' : ''}`}
          disabled={done}>
          <div className={`transition-transform duration-150 ${pumping ? 'translate-y-2' : ''}`}>
            {/* Pump nozzle */}
            <div className="w-6 h-8 mx-auto bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg shadow-md" />
            {/* Pump head (the pressable bit) */}
            <div className="w-14 h-5 mx-auto bg-gradient-to-b from-pink-300 to-pink-400 rounded-full shadow-md
                            border border-pink-200/50 flex items-center justify-center">
              <span className="text-[8px] font-heading text-pink-700">PUSH</span>
            </div>
          </div>
          {/* Bottle body */}
          <div className="w-16 h-24 sm:w-20 sm:h-28 mx-auto mt-[-2px]">
            <FallbackImg src={`${IMG}/soap-bottle.png`} alt="Soap" emoji="🧴"
                 className="w-full h-full object-contain drop-shadow-lg" />
          </div>
        </button>

        {/* Soap squirt drops falling from nozzle */}
        {squirts.map(s => (
          <div key={s.id} className="absolute pointer-events-none animate-soap-squirt"
               style={{ left: '30%', top: '45%' }}>
            <div className="w-3 h-4 rounded-full bg-gradient-to-b from-pink-200 to-pink-300 opacity-80" />
          </div>
        ))}
      </div>

      {/* Pump counter — filling meter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {Array.from({ length: TARGET }).map((_, i) => (
            <div key={i}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                         ${i < pumps
                           ? 'bg-blue-200/80 border-blue-300 scale-110 shadow-md shadow-blue-200/50'
                           : 'bg-white/20 border-white/30 scale-90'}`}>
              {i < pumps ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/80 to-blue-200/60"
                     style={{ border: '1px solid rgba(255,255,255,0.5)' }} />
              ) : null}
            </div>
          ))}
        </div>
        <span className="text-xs font-heading text-white drop-shadow-md">
          {done ? 'So many bubbles!' : `Pump ${pumps}/${TARGET}`}
        </span>
      </div>

      {/* Bubble flood when done */}
      <FloatingBubbles count={done ? 30 : pumps * 4} active={pumps > 0} />
    </div>
  );
}

// ── Rub/Swipe Step (scrub, dry, brush) ──────────────────────────────
// Swipe/rub finger over the puppy to scrub/dry/brush it
function RubStep({ config, onComplete }) {
  const containerRef = useRef(null);
  const puppyRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [touching, setTouching] = useState(false);
  const [done, setDone] = useState(false);
  const lastBurstTime = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();

  const target = config.target;

  useEffect(() => {
    if (progress >= target && !done) {
      setDone(true);
      playSuccess();
      setTimeout(onComplete, 800);
    }
  }, [progress, target, done, onComplete]);

  const isOverPuppy = useCallback((clientX, clientY) => {
    const el = puppyRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const pad = 30;
    return clientX >= r.left - pad && clientX <= r.right + pad && clientY >= r.top - pad && clientY <= r.bottom + pad;
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (done) return;
    setTouching(true);
  }, [done]);

  const handlePointerMove = useCallback((e) => {
    if (!touching || done) return;
    e.preventDefault();
    if (isOverPuppy(e.clientX, e.clientY)) {
      const now = Date.now();
      if (now - lastBurstTime.current > 350) {
        lastBurstTime.current = now;
        playPop();
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          burst(e.clientX - rect.left, e.clientY - rect.top, { colors: config.particles, count: 5, spread: 40 });
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
      <div className="absolute top-4 left-16 right-16 z-20 text-center bg-white/70 backdrop-blur rounded-2xl px-4 py-2 shadow-lg">
        <h2 className="text-lg font-heading text-amber-900">{config.title}</h2>
        <p className="text-xs text-amber-700 font-heading">{config.voice}</p>
      </div>

      {/* Puppy — crossfades from startImg to endImg as progress increases */}
      <div ref={puppyRef}
           className={`absolute left-1/2 -translate-x-1/2 z-[5] transition-transform duration-200
                       ${touching ? 'scale-105' : ''} ${done ? 'animate-bounce' : ''}`}
           style={{ top: '18%' }}>
        <div className="relative w-44 h-44 sm:w-56 sm:h-56">
          {config.startImg && (
            <FallbackImg src={config.startImg} alt="Puppy" emoji={config.puppyEmoji}
                 className="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-opacity duration-300"
                 style={{ opacity: 1 - progress / target }} />
          )}
          <FallbackImg src={config.puppyImg} alt="Puppy" emoji={config.puppyEmoji}
               className="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-opacity duration-300"
               style={{ opacity: config.startImg ? progress / target : 1 }} />
        </div>
      </div>

      {/* Tool display */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/50 backdrop-blur rounded-2xl p-3 flex items-center gap-2 shadow-md">
          <FallbackImg src={config.toolImg} alt="" emoji={config.toolEmoji}
               className="w-10 h-10 object-contain" style={{ fontSize: '2rem' }} />
          <span className="text-xs font-heading text-amber-700/70">Rub puppy gently!</span>
        </div>
      </div>

      {/* Progress hearts */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {Array.from({ length: target }, (_, i) => (
          <span key={i} className={`text-xl transition-all duration-300 ${i < progress ? 'scale-125' : 'opacity-30 scale-75'}`}>
            {i < progress ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Gentle touch guard ──────────────────────────────────────────────
function useGentleTouch() {
  const taps = useRef([]);
  const [showGentle, setShowGentle] = useState(false);

  const recordTap = useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < 800), now];
    if (taps.current.length >= 4) {
      setShowGentle(true);
      taps.current = [];
      setTimeout(() => setShowGentle(false), 2000);
      return true;
    }
    return false;
  }, []);

  return { showGentle, recordTap };
}

// ── Select Screen ───────────────────────────────────────────────────
function SelectScreen({ onSelect }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 opacity-40 pointer-events-none">
        <FallbackImg src={`${IMG}/pongo.png`} alt="" emoji="🐕‍🦺" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" style={{ fontSize: '2.5rem' }} />
        <FallbackImg src={`${IMG}/perdita.png`} alt="" emoji="🐕" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" style={{ fontSize: '2.5rem' }} />
      </div>

      <div className="bg-white/70 backdrop-blur rounded-2xl px-6 py-3 mb-4 shadow-lg text-center">
        <h2 className="text-xl sm:text-2xl font-heading text-amber-900">
          Which puppy needs help?
        </h2>
        <p className="text-sm text-amber-700 font-heading">Let's help a puppy!</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {PUPPIES.map(puppy => (
          <button key={puppy.id} onClick={() => { playNavigate(); onSelect(puppy); }}
            className="flex-1 bg-white/60 backdrop-blur rounded-3xl p-4 border-2 border-amber-200/50
                       hover:bg-white/80 hover:scale-105 active:scale-95 transition-all
                       flex flex-col items-center gap-2 shadow-lg cursor-pointer">
            <FallbackImg src={puppy.img} alt={puppy.name} emoji={puppy.emoji} className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
            <span className="font-heading text-amber-800 text-base">{puppy.name}</span>
            <span className="text-xs text-amber-600/60">{puppy.label}</span>
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
      <div className="bg-white/70 backdrop-blur rounded-2xl px-6 py-3 mb-4 shadow-lg text-center">
        <h2 className="text-xl sm:text-2xl font-heading text-amber-900">{title}</h2>
        <p className="text-sm text-amber-700 font-heading">{subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {items.map(item => (
          <button key={item.id} onClick={() => !chosen && handleChoose(item)}
            className={`bg-white/60 backdrop-blur rounded-3xl p-4 border-2 shadow-lg
                       flex flex-col items-center gap-2 transition-all cursor-pointer
                       w-28 sm:w-32
                       ${chosen === item.id
                         ? 'border-pink-400 scale-110 bg-pink-50/80 shadow-pink-200'
                         : chosen
                         ? 'border-amber-200/30 opacity-40 scale-90'
                         : 'border-amber-200/50 hover:bg-white/80 hover:scale-105 active:scale-95'
                       }`}>
            <FallbackImg src={item.img} alt={item.label} emoji={item.emoji} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            <span className="font-heading text-amber-800 text-sm">{item.label}</span>
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
      burst(rect.width / 2, rect.height * 0.35, { colors: HEART_COLORS, count: 20, spread: 100 });
      setTimeout(() => burst(rect.width * 0.3, rect.height * 0.4, { colors: SPARKLE_COLORS, count: 12, spread: 60 }), 400);
      setTimeout(() => burst(rect.width * 0.7, rect.height * 0.4, { colors: SPARKLE_COLORS, count: 12, spread: 60 }), 600);
    }
    setTimeout(() => setShowBadge(true), 1200);
  }, [burst]);

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
      <ParticleLayer />
      <div className="relative mb-4 animate-bounce" style={{ animationDuration: '1.5s' }}>
        <FallbackImg src={`${IMG}/puppy-happy.png`} alt="Happy puppy" emoji="🎉"
             className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-lg" />
        {[...Array(5)].map((_, i) => (
          <span key={i} className="absolute text-2xl animate-float-up"
                style={{
                  left: `${20 + i * 15}%`, top: `${10 + Math.random() * 20}%`,
                  animationDelay: `${i * 0.3}s`, animationDuration: `${1.5 + Math.random()}s`,
                }}>❤️</span>
        ))}
      </div>
      <div className="bg-white/70 backdrop-blur rounded-2xl px-6 py-3 mb-2 shadow-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-heading text-amber-900">You Were Kind!</h2>
        <p className="text-base text-amber-700 font-heading">Puppy feels happy and safe!</p>
      </div>
      {showBadge && (
        <div className="animate-spring-in mb-4">
          <div className="bg-gradient-to-b from-amber-50 to-pink-50 rounded-2xl px-6 py-3 border-2 border-amber-300/50 shadow-lg flex items-center gap-3">
            <FallbackImg src={`${IMG}/heart-badge.png`} alt="Kind Helper" emoji="💖" className="w-12 h-12 object-contain" />
            <div>
              <p className="font-heading text-amber-800 text-sm">Kind Helper Heart</p>
              <p className="text-xs text-amber-600/60">You earned a badge!</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => { playNavigate(); onFinish('room'); }}
          className="bg-pink-500 hover:bg-pink-400 active:scale-95 text-white font-heading text-base
                     px-6 py-3 rounded-full shadow-lg transition-all">
          Puppy Room 🏠
        </button>
        <button onClick={() => { playNavigate(); onFinish('again'); }}
          className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-heading text-base
                     px-6 py-3 rounded-full shadow-lg transition-all">
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
            className="bg-white/70 backdrop-blur rounded-full px-4 py-2 font-heading text-amber-800
                       text-sm hover:bg-white/90 active:scale-95 transition-all shadow">
            ← Back
          </button>
          <h2 className="font-heading text-xl text-amber-900 bg-white/70 backdrop-blur rounded-full px-4 py-1 shadow">Puppy Room</h2>
          <div className="w-16" />
        </div>
        {puppies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-amber-700/60 font-heading text-center">Help some puppies and they'll appear here!</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-wrap justify-center gap-4 overflow-auto">
            {puppies.map((p, i) => (
              <button key={i} onClick={() => playBoing()}
                className="bg-white/50 rounded-3xl p-3 flex flex-col items-center gap-1
                           hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer w-28">
                <FallbackImg src={`${IMG}/puppy-sleeping.png`} alt="" emoji="😴"
                     className="w-20 h-20 object-contain" />
                <span className="text-xs font-heading text-amber-800">{p.name}</span>
                <span className="text-[10px] text-amber-600/50">{p.accessory}</span>
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

      {/* Warm Disney glow */}
      <div className="absolute inset-0 pointer-events-none z-[2]"
           style={{ background: 'radial-gradient(ellipse at center 40%, #fbbf2408 0%, transparent 70%)' }} />

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
          <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '10%' }}>
            <FallbackImg src={`${IMG}/puppy-fluffy.png`} alt="Fluffy puppy" emoji="🐩"
                 className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg" />
          </div>
          <ChoiceScreen items={ACCESSORIES} title="Pick Something Nice"
                        subtitle="Choose something pretty for puppy!" onChoose={handleDressChoice} />
        </>
      )}

      {/* Care choice screen */}
      {step === 'care' && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top: '8%' }}>
            <FallbackImg src={`${IMG}/puppy-happy.png`} alt="Happy puppy" emoji="🥰"
                 className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-lg" />
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
        @keyframes soap-squirt {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(80px) scale(0.5); opacity: 0; }
        }
        .animate-soap-squirt { animation: soap-squirt 0.6s ease-in forwards; }
      `}</style>
    </div>
  );
}
