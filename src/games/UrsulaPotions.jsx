import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playSparkle, playSuccess, playBuzz, playBoing, playPop, playPoof } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const IMG = '/arthurs-world/images/disney/ursula';
const POTION_COLORS = ['#a78bfa', '#7c3aed', '#6d28d9', '#4c1d95'];
const SILLY_COLORS = ['#f472b6', '#fb923c', '#a3e635', '#22d3ee'];

// Ingredient colors — determines how the cauldron changes when each is added
const ING_COLOR = {
  shell: '#c084fc', wave: '#38bdf8', music: '#f9a8d4', mushroom: '#4ade80',
  squid: '#6366f1', star: '#fbbf24', bubble: '#67e8f9', seaweed: '#22c55e',
  crystal: '#a855f7', lightning: '#eab308', wind: '#94a3b8', moon: '#e2e8f0',
  crab: '#f97316', rose: '#fb7185',
};

const ING_EMOJI = {
  shell: '🐚', wave: '🌊', music: '🎵', mushroom: '🍄',
  squid: '🦑', star: '⭐', bubble: '🫧', seaweed: '🌿',
  crystal: '🔮', lightning: '⚡', wind: '💨', moon: '🌙',
  crab: '🦀', rose: '🌹',
};

const ING_IMG = {
  shell: `${IMG}/ing-shell.png`, wave: `${IMG}/ing-wave.png`, music: `${IMG}/ing-music.png`,
  mushroom: `${IMG}/ing-mushroom.png`, squid: `${IMG}/ing-squid.png`, star: `${IMG}/ing-star.png`,
  bubble: `${IMG}/ing-bubble.png`, seaweed: `${IMG}/ing-seaweed.png`, crystal: `${IMG}/ing-crystal.png`,
  lightning: `${IMG}/ing-lightning.png`, wind: `${IMG}/ing-wind.png`, moon: `${IMG}/ing-moon.png`,
  crab: `${IMG}/ing-crab.png`, rose: `${IMG}/ing-rose.png`,
};

const ING_LABELS = {
  shell: 'Magic Shell', wave: 'Ocean Wave', music: 'Song Note', mushroom: 'Sea Shroom',
  squid: 'Baby Squid', star: 'Sea Star', bubble: 'Enchanted Bubble', seaweed: 'Glow Weed',
  crystal: 'Sea Crystal', lightning: 'Storm Bolt', wind: 'Wind Spirit', moon: 'Moon Charm',
  crab: 'Tiny Crab', rose: 'Sea Rose',
};

const RECIPES = [
  {
    name: 'Singing Splash',
    desc: 'Make a magical singing potion!',
    ingredients: ['shell', 'wave', 'music'],
    pool: ['shell', 'wave', 'music', 'mushroom', 'squid', 'star'],
    successMsg: 'The potion sings! A beautiful melody fills the room! 🎵',
    sillyResults: [
      { msg: 'Oops! The potion makes frog noises! 🐸' },
      { msg: 'The cauldron starts singing opera! 🎶' },
      { msg: 'Bubbles everywhere! The potion burps! 🫧' },
    ],
  },
  {
    name: 'Tentacle Tonic',
    desc: 'Grow eight wiggly tentacles!',
    ingredients: ['squid', 'bubble', 'seaweed'],
    pool: ['squid', 'bubble', 'seaweed', 'shell', 'crystal', 'lightning'],
    successMsg: 'Wobbly tentacles sprout from the cauldron! Wiggle wiggle! 🐙',
    sillyResults: [
      { msg: 'You grew a silly moustache instead! 🥸' },
      { msg: 'The cauldron grew chicken legs! 🐔' },
      { msg: 'Everything turned to jelly! 🍮' },
    ],
  },
  {
    name: 'Storm Brew',
    desc: 'Create a magical sea storm!',
    ingredients: ['lightning', 'wave', 'wind'],
    pool: ['lightning', 'wave', 'wind', 'moon', 'shell', 'crab'],
    successMsg: 'Thunder and lightning! The sea swirls with magic! ⚡',
    sillyResults: [
      { msg: "It's raining rubber ducks! 🦆" },
      { msg: 'The cauldron made a rainbow instead! 🌈' },
      { msg: 'All the fish started dancing! 🐟' },
    ],
  },
  {
    name: 'Giant Potion',
    desc: 'Grow ENORMOUS like Ursula!',
    ingredients: ['mushroom', 'star', 'crystal'],
    pool: ['mushroom', 'star', 'crystal', 'seaweed', 'rose', 'bubble'],
    successMsg: 'BIGGER! BIGGER! The cauldron is HUGE now! 🏔️',
    sillyResults: [
      { msg: 'Everything got tiny instead! 🐜' },
      { msg: 'Your nose grew really long! 🤥' },
      { msg: 'The cauldron turned into a teapot! 🫖' },
    ],
  },
  {
    name: 'Beauty Spell',
    desc: 'The most beautiful creature in the sea!',
    ingredients: ['crystal', 'moon', 'rose'],
    pool: ['crystal', 'moon', 'rose', 'squid', 'lightning', 'mushroom'],
    successMsg: 'Sparkle! Shimmer! Everything is beautiful! ✨',
    sillyResults: [
      { msg: 'The cauldron grew a big red clown nose! 🤡' },
      { msg: 'Everything smells like old seaweed! 🤢' },
      { msg: 'The potion made silly faces! 😜' },
    ],
  },
];

/** Fallback image with emoji */
function FallbackImg({ src, alt, emoji, className = '', style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <span className={`select-none ${className}`} style={{ fontSize: '2.5rem', lineHeight: 1, ...style }} role="img" aria-label={alt}>{emoji}</span>;
  }
  return <img src={src} alt={alt} className={className} style={style} draggable={false}
              onError={() => setFailed(true)} />;
}

/** Mix colors together for cauldron liquid */
function mixColors(colors) {
  if (!colors.length) return '#7c3aed';
  if (colors.length === 1) return colors[0];
  // Simple averaging
  let r = 0, g = 0, b = 0;
  for (const hex of colors) {
    const n = parseInt(hex.slice(1), 16);
    r += (n >> 16) & 255;
    g += (n >> 8) & 255;
    b += n & 255;
  }
  const l = colors.length;
  return `#${((1 << 24) + (Math.round(r/l) << 16) + (Math.round(g/l) << 8) + Math.round(b/l)).toString(16).slice(1)}`;
}

/** Animated smoke wisps rising from cauldron */
function SmokeWisps({ color, intensity }) {
  const wisps = useMemo(() =>
    Array.from({ length: intensity }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      size: 20 + Math.random() * 30,
      delay: Math.random() * 3,
      dur: 2.5 + Math.random() * 2,
      drift: -15 + Math.random() * 30,
    })), [intensity]);

  return wisps.map(w => (
    <div key={w.id} className="absolute pointer-events-none rounded-full"
         style={{
           left: `${w.x}%`, bottom: '55%',
           width: `${w.size}px`, height: `${w.size}px`,
           background: `radial-gradient(circle, ${color}66, ${color}22, transparent)`,
           animation: `smoke-rise ${w.dur}s ease-out infinite`,
           animationDelay: `${w.delay}s`,
           '--drift': `${w.drift}px`,
         }} />
  ));
}

/** Bubbling liquid surface */
function CauldronBubbles({ color, count }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50,
      size: 6 + Math.random() * 14,
      delay: Math.random() * 2,
      dur: 1 + Math.random() * 1.5,
    })), [count]);

  return bubbles.map(b => (
    <div key={b.id} className="absolute pointer-events-none rounded-full"
         style={{
           left: `${b.x}%`, bottom: '35%',
           width: `${b.size}px`, height: `${b.size}px`,
           background: `radial-gradient(circle, ${color}bb, ${color}44)`,
           animation: `bubble-pop ${b.dur}s ease-out infinite`,
           animationDelay: `${b.delay}s`,
         }} />
  ));
}

/** Shelf ingredient — draggable */
function ShelfIngredient({ ingredientKey, onDragStart, disabled, added }) {
  const handlePointerDown = useCallback((e) => {
    if (disabled || added) return;
    e.preventDefault();
    onDragStart(ingredientKey, e);
  }, [ingredientKey, onDragStart, disabled, added]);

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`
        flex flex-col items-center gap-0.5 transition-all duration-300
        ${added ? 'opacity-20 scale-75' : disabled ? 'opacity-40' : 'cursor-grab active:cursor-grabbing hover:scale-110'}
      `}>
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-purple-900/60 border border-purple-500/30
                       flex items-center justify-center shadow-md
                       ${!added && !disabled ? 'hover:bg-purple-800/60 hover:border-purple-400/50 hover:shadow-purple-500/20' : ''}`}>
        <FallbackImg src={ING_IMG[ingredientKey]} alt={ING_LABELS[ingredientKey]} emoji={ING_EMOJI[ingredientKey]}
             className="w-10 h-10 sm:w-11 sm:h-11 object-contain" style={{ fontSize: '1.8rem' }} />
      </div>
      <span className="text-[8px] sm:text-[9px] text-purple-400/60 font-heading text-center leading-tight max-w-14 truncate">
        {ING_LABELS[ingredientKey]}
      </span>
    </div>
  );
}

export default function UrsulaPotions() {
  const containerRef = useRef(null);
  const cauldronRef = useRef(null);
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [added, setAdded] = useState([]); // ingredients in cauldron
  const [phase, setPhase] = useState('picking'); // picking | brewing | result
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [totalBrewed, setTotalBrewed] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  // Dragging state
  const [dragging, setDragging] = useState(null); // { key, x, y }

  const recipe = RECIPES[recipeIdx];

  // Cauldron color based on added ingredients
  const cauldronColor = useMemo(() => {
    if (!added.length) return '#7c3aed';
    return mixColors(added.map(k => ING_COLOR[k]));
  }, [added]);

  const isOverCauldron = useCallback((x, y) => {
    const el = cauldronRef.current;
    const container = containerRef.current;
    if (!el || !container) return false;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const px = x + cr.left;
    const py = y + cr.top;
    const pad = 30;
    return px >= er.left - pad && px <= er.right + pad && py >= er.top - pad && py <= er.bottom + pad;
  }, []);

  // Drop ingredient into cauldron
  const dropIngredient = useCallback((key) => {
    if (added.includes(key) || added.length >= 3) return;
    playPop();

    // Burst colored particles at cauldron
    const rect = containerRef.current?.getBoundingClientRect();
    const cr = cauldronRef.current?.getBoundingClientRect();
    if (rect && cr) {
      const cx = (cr.left + cr.right) / 2 - rect.left;
      const cy = cr.top - rect.top + 20;
      burst(cx, cy, { colors: [ING_COLOR[key], '#a78bfa', '#ffffff'], count: 10, spread: 50 });
    }

    const newAdded = [...added, key];
    setAdded(newAdded);

    // Auto-brew when 3 ingredients added
    if (newAdded.length >= 3) {
      setTimeout(() => brew(newAdded), 600);
    }
  }, [added, burst]);

  const brew = useCallback((ingredients) => {
    setPhase('brewing');
    const correct = recipe.ingredients.every(i => ingredients.includes(i));

    setTimeout(() => {
      if (correct) {
        playSuccess();
        playSparkle();
        peek('excited');
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) burst(rect.width / 2, rect.height * 0.35, { colors: POTION_COLORS, count: 30, spread: 100 });
        setScore(s => s + 1);
        setResult({ success: true, msg: recipe.successMsg });
      } else {
        playBoing();
        peek('happy');
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 600);
        const silly = recipe.sillyResults[Math.floor(Math.random() * recipe.sillyResults.length)];
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) burst(rect.width / 2, rect.height * 0.35, { colors: SILLY_COLORS, count: 25, spread: 80 });
        setResult({ success: false, msg: silly.msg });
      }
      setPhase('result');
      setTotalBrewed(t => t + 1);
    }, 2000);
  }, [recipe, burst, peek]);

  const handleNext = useCallback(() => {
    setAdded([]);
    setResult(null);
    setPhase('picking');
    setRecipeIdx(prev => (prev + 1) % RECIPES.length);
  }, []);

  // ── Drag handlers ──
  const handleDragStart = useCallback((key, e) => {
    if (phase !== 'picking' || added.includes(key) || added.length >= 3) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [phase, added]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging(prev => ({ ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }));
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    if (isOverCauldron(dragging.x, dragging.y)) {
      dropIngredient(dragging.key);
    }
    setDragging(null);
  }, [dragging, isOverCauldron, dropIngredient]);

  const smokeIntensity = phase === 'brewing' ? 12 : 3 + added.length * 3;
  const bubbleCount = phase === 'brewing' ? 15 : 4 + added.length * 3;

  return (
    <div ref={containerRef}
         className={`relative w-full h-full overflow-hidden touch-none select-none ${shakeScreen ? 'animate-shake' : ''}`}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerLeave={handlePointerUp}
         style={{ touchAction: 'none' }}>
      {/* Background */}
      <img src={`${IMG}/bg.png`} alt="" className="absolute inset-0 w-full h-full object-cover z-0"
           onError={(e) => { e.target.style.display = 'none'; }} />
      <div className="absolute inset-0 z-[-1]"
           style={{ background: 'linear-gradient(to bottom, #1a0533, #2d0a4e, #1e1b4b, #0f172a)' }} />

      {/* Underwater particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
             style={{
               width: `${4 + Math.random() * 8}px`, height: `${4 + Math.random() * 8}px`,
               left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
               background: 'radial-gradient(circle, #a78bfa33, transparent)',
               animation: `float-up ${4 + Math.random() * 6}s linear infinite`,
               animationDelay: `${Math.random() * -8}s`,
             }} />
      ))}

      <BackButton />
      <ParticleLayer />
      <ArthurPeekLayer />

      {/* Score */}
      <div className="absolute top-4 right-4 z-20 bg-purple-900/70 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 border border-purple-500/30">
        <span className="text-base font-heading text-purple-300">🧪</span>
        <span className="text-xl font-heading text-purple-200">{score}/{totalBrewed}</span>
      </div>

      <div className="absolute top-4 left-16 z-20">
        <span className="text-lg font-heading text-purple-300 drop-shadow-lg"
              style={{ textShadow: '0 0 12px #7c3aed88' }}>Ursula's Potions</span>
      </div>

      {/* Recipe card */}
      <div className="absolute top-14 left-4 right-4 z-10 flex justify-center">
        <div className="bg-purple-950/70 backdrop-blur-sm rounded-2xl px-5 py-2.5 text-center border border-purple-500/20 max-w-sm">
          <h3 className="text-base font-heading text-purple-200">{recipe.name}</h3>
          <p className="text-xs text-purple-300/70">{recipe.desc}</p>
          {phase === 'picking' && (
            <p className="text-[10px] text-purple-400/50 mt-0.5">
              Drag {3 - added.length} ingredient{3 - added.length !== 1 ? 's' : ''} to the cauldron!
            </p>
          )}
        </div>
      </div>

      {/* ── Cauldron area ── */}
      <div ref={cauldronRef} className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: '30%' }}>
        <div className={`relative w-32 h-32 sm:w-40 sm:h-40 transition-all duration-700
                        ${phase === 'brewing' ? 'scale-110' : ''}`}
             style={{
               filter: phase === 'brewing'
                 ? `drop-shadow(0 0 40px ${cauldronColor}) drop-shadow(0 0 80px ${cauldronColor})`
                 : `drop-shadow(0 0 12px ${cauldronColor}66)`,
             }}>
          {/* Cauldron image */}
          <FallbackImg src={`${IMG}/cauldron.png`} alt="Cauldron" emoji="🪣"
               className="w-full h-full object-contain relative z-10" />

          {/* Liquid glow inside cauldron */}
          <div className="absolute left-[20%] right-[20%] top-[25%] bottom-[35%] rounded-[50%] z-[9] transition-all duration-700"
               style={{
                 background: `radial-gradient(ellipse, ${cauldronColor}cc, ${cauldronColor}44, transparent)`,
                 boxShadow: `0 0 20px ${cauldronColor}88, inset 0 0 15px ${cauldronColor}66`,
               }} />

          {/* Smoke */}
          <SmokeWisps color={cauldronColor} intensity={smokeIntensity} />

          {/* Bubbles */}
          <CauldronBubbles color={cauldronColor} count={bubbleCount} />
        </div>

        {/* Ingredients added indicators (floating above cauldron) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-3">
          {added.map((key, i) => (
            <div key={key} className="animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: `${ING_COLOR[key]}44`, boxShadow: `0 0 8px ${ING_COLOR[key]}66` }}>
                <FallbackImg src={ING_IMG[key]} alt="" emoji={ING_EMOJI[key]}
                     className="w-6 h-6 object-contain" style={{ fontSize: '1.2rem' }} />
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - added.length }).map((_, i) => (
            <div key={`empty-${i}`} className="w-8 h-8 rounded-full border border-dashed border-purple-500/30" />
          ))}
        </div>

        {/* Drop zone highlight when dragging */}
        {dragging && (
          <div className="absolute inset-[-20px] rounded-full border-2 border-dashed border-purple-400/50 animate-pulse z-[1]"
               style={{ boxShadow: `0 0 30px ${cauldronColor}44` }} />
        )}
      </div>

      {/* ── Ingredient Shelves ── */}
      {phase === 'picking' && (
        <div className="absolute bottom-4 left-2 right-2 z-20">
          {/* Shelf background */}
          <div className="bg-purple-950/60 backdrop-blur-sm rounded-2xl p-3 border border-purple-700/30">
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {recipe.pool.map(key => (
                <ShelfIngredient key={key} ingredientKey={key}
                  onDragStart={handleDragStart}
                  disabled={added.length >= 3}
                  added={added.includes(key)} />
              ))}
            </div>
            {/* Shelf line decoration */}
            <div className="mt-2 h-[2px] bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />
          </div>
        </div>
      )}

      {/* ── Dragging ghost ── */}
      {dragging && (
        <div className="absolute z-50 pointer-events-none"
             style={{ left: dragging.x, top: dragging.y, transform: 'translate(-50%, -50%)' }}>
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center"
               style={{
                 background: `${ING_COLOR[dragging.key]}33`,
                 boxShadow: `0 0 20px ${ING_COLOR[dragging.key]}66, 0 8px 24px rgba(0,0,0,0.4)`,
               }}>
            <FallbackImg src={ING_IMG[dragging.key]} alt="" emoji={ING_EMOJI[dragging.key]}
                 className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-xl" style={{ fontSize: '2.5rem' }} />
          </div>
          {/* Trailing sparkles */}
          <div className="absolute inset-0 animate-ping opacity-30 rounded-2xl"
               style={{ background: ING_COLOR[dragging.key], animationDuration: '0.8s' }} />
        </div>
      )}

      {/* ── Brewing animation ── */}
      {phase === 'brewing' && (
        <div className="absolute bottom-24 left-0 right-0 z-20 text-center">
          <div className="animate-pulse">
            <span className="text-2xl font-heading text-purple-300" style={{ textShadow: `0 0 30px ${cauldronColor}` }}>
              Brewing... 🧪
            </span>
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {phase === 'result' && result && (
        <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center">
          <div className={`rounded-3xl p-5 text-center max-w-sm mx-4 animate-spring-in border backdrop-blur-sm
            ${result.success
              ? 'bg-gradient-to-b from-purple-900/90 to-indigo-950/90 border-purple-400/40'
              : 'bg-gradient-to-b from-pink-900/90 to-purple-950/90 border-pink-400/40'}`}>
            <p className={`text-base font-heading mb-3 ${result.success ? 'text-purple-200' : 'text-pink-200'}`}>
              {result.msg}
            </p>
            {!result.success && (
              <div className="mb-3 flex justify-center items-center gap-2">
                <span className="text-[10px] text-purple-400/60">Needed:</span>
                {recipe.ingredients.map(k => (
                  <div key={k} className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background: `${ING_COLOR[k]}33` }}>
                    <FallbackImg src={ING_IMG[k]} alt="" emoji={ING_EMOJI[k]}
                         className="w-5 h-5 object-contain" style={{ fontSize: '1rem' }} />
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleNext}
              className={`font-heading text-base px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer
                ${result.success
                  ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30'
                  : 'bg-pink-600 hover:bg-pink-500 text-white border border-pink-400/30'}`}>
              {result.success ? 'Next Potion!' : 'Try Another!'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes smoke-rise {
          0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-80px) translateX(var(--drift, 0px)) scale(1.5); opacity: 0; }
        }
        @keyframes bubble-pop {
          0% { transform: translateY(0) scale(0.3); opacity: 0.8; }
          70% { opacity: 0.6; }
          100% { transform: translateY(-50px) scale(1); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.3; } 90% { opacity: 0.3; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px) rotate(-1deg); }
          75% { transform: translateX(6px) rotate(1deg); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out 2; }
      `}</style>
    </div>
  );
}
