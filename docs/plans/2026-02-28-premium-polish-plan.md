# Premium Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate Arthur's World from functional prototype to premium-feeling toddler app with spring animations, per-section visual identity, Arthur Bear mascot, celebration system, enriched sounds, ambient audio, and DALL-E illustrated cards.

**Architecture:** A `SectionContext` provides the current section's theme (palette, sounds, particles) to all children via React context, read from URL params. New shared components (`ParticleBurst`, `CelebrationOverlay`, `ArthurBear`, `ArthurPeek`) are composed into existing game pages. Sound enrichment happens in `useSound.js` with new functions. SVG backgrounds are per-section components. No new dependencies.

**Tech Stack:** React 18, Tailwind CSS 3, Web Audio API, SVG, CSS animations, DALL-E 3 API (Node script)

---

## Task 1: Section Theme Context & Data

**Files:**
- Create: `src/contexts/SectionContext.jsx`
- Create: `src/data/sectionThemes.js`

**Step 1: Create section themes data**

Create `src/data/sectionThemes.js` — the single source of truth for all section-specific theming:

```js
/**
 * Section theme definitions.
 * Each section has: palette, particle config, tap sound ID, and ambient config.
 */
export const SECTION_THEMES = {
  games: {
    id: 'games',
    label: 'Games',
    palette: {
      primary: '#38bdf8',    // sky blue
      secondary: '#22c55e',  // grass green
      accent: '#facc15',     // sunshine yellow
      bg: 'from-sky-400 to-blue-500',
      cardBg: 'from-sky-400/20 to-blue-500/20',
    },
    particles: { shapes: ['star', 'circle'], colors: ['#38bdf8', '#22c55e', '#facc15'] },
    tapSound: 'boing',
    ambient: 'birds',
    animationVibe: 'bouncy', // bouncy | gentle | rhythmic | painterly | smooth
  },
  puzzles: {
    id: 'puzzles',
    label: 'Puzzles',
    palette: {
      primary: '#2dd4bf',    // teal
      secondary: '#f87171',  // coral
      accent: '#c4b5fd',     // lavender
      bg: 'from-teal-400 to-cyan-600',
      cardBg: 'from-teal-400/20 to-cyan-600/20',
    },
    particles: { shapes: ['circle', 'diamond'], colors: ['#2dd4bf', '#f87171', '#c4b5fd'] },
    tapSound: 'click',
    ambient: 'wind',
    animationVibe: 'smooth',
  },
  art: {
    id: 'art',
    label: 'Art',
    palette: {
      primary: '#ec4899',    // pink
      secondary: '#f59e0b',  // amber
      accent: '#8b5cf6',     // purple
      bg: 'from-pink-400 to-rose-500',
      cardBg: 'from-pink-400/20 to-rose-500/20',
    },
    particles: { shapes: ['circle', 'heart'], colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#22c55e'] },
    tapSound: 'splat',
    ambient: 'rain',
    animationVibe: 'painterly',
  },
  books: {
    id: 'books',
    label: 'Books',
    palette: {
      primary: '#f59e0b',    // amber
      secondary: '#92400e',  // warm brown
      accent: '#fef3c7',     // cream
      bg: 'from-amber-400 to-orange-500',
      cardBg: 'from-amber-400/20 to-orange-500/20',
    },
    particles: { shapes: ['star', 'heart'], colors: ['#f59e0b', '#fef3c7', '#fbbf24'] },
    tapSound: 'page',
    ambient: 'cozy',
    animationVibe: 'gentle',
  },
  music: {
    id: 'music',
    label: 'Music',
    palette: {
      primary: '#8b5cf6',    // purple
      secondary: '#facc15',  // gold
      accent: '#dc2626',     // deep red
      bg: 'from-purple-500 to-violet-700',
      cardBg: 'from-purple-500/20 to-violet-700/20',
    },
    particles: { shapes: ['star', 'circle'], colors: ['#8b5cf6', '#facc15', '#dc2626'] },
    tapSound: 'tick',
    ambient: 'crowd',
    animationVibe: 'rhythmic',
  },
  videos: {
    id: 'videos',
    label: 'Videos',
    palette: {
      primary: '#ef4444',
      secondary: '#ffffff',
      accent: '#1e293b',
      bg: 'from-red-500 to-red-700',
      cardBg: 'from-red-500/20 to-red-700/20',
    },
    particles: { shapes: ['star'], colors: ['#ef4444', '#ffffff'] },
    tapSound: 'boing',
    ambient: null,
    animationVibe: 'bouncy',
  },
};

/** Get theme for a section, with fallback */
export function getTheme(section) {
  return SECTION_THEMES[section] || SECTION_THEMES.games;
}
```

**Step 2: Create SectionContext**

Create `src/contexts/SectionContext.jsx`:

```jsx
import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getTheme } from '../data/sectionThemes';

const SectionContext = createContext(null);

export function SectionProvider({ children }) {
  const { section } = useParams();
  const theme = useMemo(() => getTheme(section), [section]);

  return (
    <SectionContext.Provider value={theme}>
      {children}
    </SectionContext.Provider>
  );
}

/** Use current section theme. Returns null when outside a section route. */
export function useSection() {
  return useContext(SectionContext);
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS (new files, no imports yet)

**Step 4: Commit**

```bash
git add src/contexts/SectionContext.jsx src/data/sectionThemes.js
git commit -m "feat: add section theme context and theme data"
```

---

## Task 2: Spring Animation CSS Foundation

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Step 1: Add spring animation keyframes and utilities to index.css**

Add to `src/index.css` after the existing `.no-scrollbar` rule:

```css
/* ── Spring Physics ── */

/* Spring-in: scale from 0 with overshoot */
@keyframes springIn {
  0% { transform: scale(0) translateY(20px); opacity: 0; }
  60% { transform: scale(1.08) translateY(-4px); opacity: 1; }
  80% { transform: scale(0.96) translateY(2px); }
  100% { transform: scale(1) translateY(0); }
}

/* Tap feedback: quick press then spring back */
@keyframes springTap {
  0% { transform: scale(1); }
  40% { transform: scale(0.92); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Gentle float-in (books/art calm sections) */
@keyframes gentleIn {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Rhythmic pulse-in (music section) */
@keyframes rhythmicIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.06); opacity: 1; }
  70% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

/* Slide-in from side (puzzles smooth section) */
@keyframes smoothIn {
  0% { transform: translateX(-20px); opacity: 0; }
  60% { transform: translateX(4px); opacity: 1; }
  100% { transform: translateX(0); }
}

/* Confetti fall */
@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(calc(100vh + 40px)) rotate(720deg); opacity: 0.7; }
}

/* Arthur peek-in from corner */
@keyframes peekIn {
  0% { transform: translateY(100%) scale(0.5); opacity: 0; }
  50% { transform: translateY(-10%) scale(1.1); opacity: 1; }
  70% { transform: translateY(5%) scale(0.95); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes peekOut {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(100%) scale(0.5); opacity: 0; }
}

/* Radiating rings (music pad glow) */
@keyframes radiateRing {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Celebration text bounce */
@keyframes celebrationText {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
  80% { transform: scale(0.95) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Tap ripple */
.tap-ripple {
  @apply relative overflow-hidden;
}
.tap-ripple::after {
  content: '';
  @apply absolute inset-0 pointer-events-none rounded-[inherit];
  background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255,255,255,0.4) 0%, transparent 60%);
  transform: scale(0);
  opacity: 0;
}
.tap-ripple:active::after {
  animation: rippleExpand 0.4s ease-out;
}
@keyframes rippleExpand {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}
```

**Step 2: Add new animations to tailwind.config.js**

Add these entries to `animation` inside `theme.extend`:

```js
// Premium polish animations
'spring-in': 'springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
'spring-tap': 'springTap 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
'gentle-in': 'gentleIn 0.6s ease-out both',
'rhythmic-in': 'rhythmicIn 0.5s ease-out both',
'smooth-in': 'smoothIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
'confetti-fall': 'confettiFall 2.5s ease-in forwards',
'peek-in': 'peekIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
'peek-out': 'peekOut 0.3s ease-in both',
'radiate-ring': 'radiateRing 0.8s ease-out forwards',
'celebration-text': 'celebrationText 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
```

And add the corresponding keyframes to the `keyframes` object:

```js
springIn: {
  '0%': { transform: 'scale(0) translateY(20px)', opacity: '0' },
  '60%': { transform: 'scale(1.08) translateY(-4px)', opacity: '1' },
  '80%': { transform: 'scale(0.96) translateY(2px)' },
  '100%': { transform: 'scale(1) translateY(0)' },
},
springTap: {
  '0%': { transform: 'scale(1)' },
  '40%': { transform: 'scale(0.92)' },
  '70%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
},
gentleIn: {
  '0%': { opacity: '0', transform: 'translateY(15px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' },
},
rhythmicIn: {
  '0%': { transform: 'scale(0.8)', opacity: '0' },
  '50%': { transform: 'scale(1.06)', opacity: '1' },
  '70%': { transform: 'scale(0.98)' },
  '100%': { transform: 'scale(1)' },
},
smoothIn: {
  '0%': { transform: 'translateX(-20px)', opacity: '0' },
  '60%': { transform: 'translateX(4px)', opacity: '1' },
  '100%': { transform: 'translateX(0)' },
},
confettiFall: {
  '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
  '100%': { transform: 'translateY(calc(100vh + 40px)) rotate(720deg)', opacity: '0.7' },
},
peekIn: {
  '0%': { transform: 'translateY(100%) scale(0.5)', opacity: '0' },
  '50%': { transform: 'translateY(-10%) scale(1.1)', opacity: '1' },
  '70%': { transform: 'translateY(5%) scale(0.95)' },
  '100%': { transform: 'translateY(0) scale(1)' },
},
peekOut: {
  '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
  '100%': { transform: 'translateY(100%) scale(0.5)', opacity: '0' },
},
radiateRing: {
  '0%': { transform: 'scale(1)', opacity: '0.6' },
  '100%': { transform: 'scale(2.5)', opacity: '0' },
},
celebrationText: {
  '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
  '60%': { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
  '80%': { transform: 'scale(0.95) rotate(-1deg)' },
  '100%': { transform: 'scale(1) rotate(0deg)' },
},
```

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/index.css tailwind.config.js
git commit -m "feat: add spring physics and celebration CSS animations"
```

---

## Task 3: Arthur Bear SVG Mascot

**Files:**
- Create: `src/components/ArthurBear.jsx`

**Step 1: Create the Arthur Bear SVG component**

Create `src/components/ArthurBear.jsx` — a friendly bear cub with 4 expression states:

```jsx
/**
 * Arthur Bear — the app mascot.
 * SVG bear cub with expression states: happy, excited, sleepy, curious.
 *
 * Props:
 *   expression: 'happy' | 'excited' | 'sleepy' | 'curious'
 *   size: number (width/height in px, default 120)
 *   className: additional CSS classes
 *   mode: 'full' (head + body) | 'face' (head only, default)
 */
export default function ArthurBear({ expression = 'happy', size = 120, className = '', mode = 'face' }) {
  const viewBox = mode === 'full' ? '0 0 200 280' : '0 0 200 200';

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={mode === 'full' ? size * 1.4 : size}
      className={className}
      aria-label="Arthur Bear"
    >
      {/* ── Head ── */}
      <g>
        {/* Ears */}
        <circle cx="55" cy="45" r="30" fill="#8B6914" />
        <circle cx="55" cy="45" r="18" fill="#D4A853" />
        <circle cx="145" cy="45" r="30" fill="#8B6914" />
        <circle cx="145" cy="45" r="18" fill="#D4A853" />

        {/* Head shape */}
        <ellipse cx="100" cy="105" rx="75" ry="70" fill="#C4922A" />

        {/* Face lighter area */}
        <ellipse cx="100" cy="120" rx="50" ry="45" fill="#D4A853" />

        {/* Eyes */}
        <Eyes expression={expression} />

        {/* Nose */}
        <ellipse cx="100" cy="120" rx="12" ry="9" fill="#5C3D10" />
        <ellipse cx="97" cy="118" rx="4" ry="3" fill="#8B6914" opacity="0.5" />

        {/* Mouth */}
        <Mouth expression={expression} />

        {/* Rosy cheeks */}
        <circle cx="60" cy="128" r="14" fill="#F9A8B8" opacity="0.5" />
        <circle cx="140" cy="128" r="14" fill="#F9A8B8" opacity="0.5" />
      </g>

      {/* ── Body (full mode only) ── */}
      {mode === 'full' && (
        <g>
          {/* Body */}
          <ellipse cx="100" cy="230" rx="55" ry="50" fill="#C4922A" />
          {/* Belly */}
          <ellipse cx="100" cy="235" rx="35" ry="32" fill="#D4A853" />
          {/* Arms */}
          <ellipse cx="40" cy="215" rx="20" ry="28" fill="#C4922A" transform="rotate(-15 40 215)" />
          <ellipse cx="160" cy="215" rx="20" ry="28" fill="#C4922A" transform="rotate(15 160 215)" />
          {/* Feet */}
          <ellipse cx="72" cy="270" rx="22" ry="14" fill="#8B6914" />
          <ellipse cx="128" cy="270" rx="22" ry="14" fill="#8B6914" />
        </g>
      )}
    </svg>
  );
}

function Eyes({ expression }) {
  switch (expression) {
    case 'excited':
      return (
        <>
          {/* Wide sparkly eyes */}
          <circle cx="75" cy="100" r="12" fill="#5C3D10" />
          <circle cx="125" cy="100" r="12" fill="#5C3D10" />
          <circle cx="79" cy="96" r="4" fill="white" />
          <circle cx="129" cy="96" r="4" fill="white" />
          <circle cx="73" cy="103" r="2" fill="white" />
          <circle cx="123" cy="103" r="2" fill="white" />
        </>
      );
    case 'sleepy':
      return (
        <>
          {/* Half-closed eyes */}
          <ellipse cx="75" cy="102" rx="10" ry="5" fill="#5C3D10" />
          <ellipse cx="125" cy="102" rx="10" ry="5" fill="#5C3D10" />
          <line x1="65" y1="98" x2="85" y2="98" stroke="#5C3D10" strokeWidth="2" strokeLinecap="round" />
          <line x1="115" y1="98" x2="135" y2="98" stroke="#5C3D10" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'curious':
      return (
        <>
          {/* One eyebrow raised, tilted look */}
          <circle cx="75" cy="100" r="9" fill="#5C3D10" />
          <circle cx="125" cy="97" r="10" fill="#5C3D10" />
          <circle cx="78" cy="97" r="3" fill="white" />
          <circle cx="128" cy="94" r="3.5" fill="white" />
          {/* Raised eyebrow */}
          <path d="M115 82 Q125 76 135 82" stroke="#5C3D10" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    default: // happy
      return (
        <>
          <circle cx="75" cy="100" r="9" fill="#5C3D10" />
          <circle cx="125" cy="100" r="9" fill="#5C3D10" />
          <circle cx="78" cy="97" r="3" fill="white" />
          <circle cx="128" cy="97" r="3" fill="white" />
        </>
      );
  }
}

function Mouth({ expression }) {
  switch (expression) {
    case 'excited':
      return (
        <>
          {/* Big open smile */}
          <ellipse cx="100" cy="140" rx="16" ry="10" fill="#5C3D10" />
          <ellipse cx="100" cy="136" rx="14" ry="5" fill="#C4922A" />
        </>
      );
    case 'sleepy':
      return (
        /* Small peaceful smile */
        <path d="M90 138 Q100 144 110 138" stroke="#5C3D10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
    case 'curious':
      return (
        /* Small 'o' mouth */
        <ellipse cx="100" cy="140" rx="7" ry="6" fill="#5C3D10" />
      );
    default: // happy
      return (
        <path d="M85 136 Q100 150 115 136" stroke="#5C3D10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
  }
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/components/ArthurBear.jsx
git commit -m "feat: add Arthur Bear SVG mascot with 4 expressions"
```

---

## Task 4: Particle Burst Component

**Files:**
- Create: `src/components/ParticleBurst.jsx`

**Step 1: Create ParticleBurst**

Create `src/components/ParticleBurst.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react';

/**
 * Lightweight particle emitter.
 * Emits SVG shapes from a point, animated via CSS.
 *
 * Usage:
 *   const { burst, ParticleLayer } = useParticleBurst();
 *   burst(x, y, { colors, shapes, count });
 *   return <><ParticleLayer /><rest of UI /></>;
 */

const SHAPE_PATHS = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01z',
  circle: null, // rendered as <circle>
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z',
  diamond: 'M12 2L22 12L12 22L2 12z',
};

let burstIdCounter = 0;

export function useParticleBurst() {
  const [bursts, setBursts] = useState([]);

  const burst = useCallback((x, y, options = {}) => {
    const {
      count = 10,
      colors = ['#facc15', '#38bdf8', '#ec4899'],
      shapes = ['star', 'circle'],
      spread = 80,
      duration = 600,
    } = options;

    const id = ++burstIdCounter;
    const particles = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = spread * (0.5 + Math.random() * 0.5);
      return {
        id: `${id}-${i}`,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 8 + Math.random() * 10,
        rotation: Math.random() * 360,
        delay: Math.random() * 100,
      };
    });

    setBursts(prev => [...prev, { id, x, y, particles, duration }]);

    // Auto-cleanup
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id));
    }, duration + 200);
  }, []);

  const ParticleLayer = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {bursts.map(b => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {b.particles.map(p => (
            <div
              key={p.id}
              className="absolute"
              style={{
                animation: `particleFly ${b.duration}ms ease-out ${p.delay}ms forwards`,
                '--particle-tx': `${p.tx}px`,
                '--particle-ty': `${p.ty}px`,
                '--particle-rot': `${p.rotation}deg`,
              }}
            >
              {p.shape === 'circle' ? (
                <svg width={p.size} height={p.size} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill={p.color} />
                </svg>
              ) : (
                <svg width={p.size} height={p.size} viewBox="0 0 24 24" style={{ transform: `rotate(${p.rotation}deg)` }}>
                  <path d={SHAPE_PATHS[p.shape]} fill={p.color} />
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ), [bursts]);

  return { burst, ParticleLayer };
}
```

**Step 2: Add particle animation to index.css**

Add to `src/index.css`:

```css
/* Particle fly-out */
@keyframes particleFly {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--particle-tx), var(--particle-ty)) scale(0); opacity: 0; }
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/components/ParticleBurst.jsx src/index.css
git commit -m "feat: add reusable ParticleBurst component with hook"
```

---

## Task 5: Arthur Peek Component (Mini-Win Reaction)

**Files:**
- Create: `src/components/ArthurPeek.jsx`

**Step 1: Create ArthurPeek**

Create `src/components/ArthurPeek.jsx`:

```jsx
import { useState, useCallback } from 'react';
import ArthurBear from './ArthurBear';

/**
 * Arthur Peek — shows Arthur's face briefly for mini-win celebrations.
 *
 * Usage:
 *   const { peek, ArthurPeekLayer } = useArthurPeek();
 *   peek('excited');  // shows Arthur with excited expression for 0.8s
 *   return <><ArthurPeekLayer /><rest /></>;
 */

let peekIdCounter = 0;

export function useArthurPeek() {
  const [peeks, setPeeks] = useState([]);

  const peek = useCallback((expression = 'excited', position = 'bottom-right') => {
    const id = ++peekIdCounter;
    setPeeks(prev => [...prev, { id, expression, position, phase: 'in' }]);

    // Start exit after 0.6s
    setTimeout(() => {
      setPeeks(prev => prev.map(p => p.id === id ? { ...p, phase: 'out' } : p));
    }, 600);

    // Remove after exit animation
    setTimeout(() => {
      setPeeks(prev => prev.filter(p => p.id !== id));
    }, 1000);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const ArthurPeekLayer = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-[90]">
      {peeks.map(p => (
        <div
          key={p.id}
          className={`absolute ${positionClasses[p.position] || positionClasses['bottom-right']}
                     ${p.phase === 'in' ? 'animate-peek-in' : 'animate-peek-out'}`}
        >
          <ArthurBear expression={p.expression} size={80} mode="face" />
        </div>
      ))}
    </div>
  ), [peeks]);

  return { peek, ArthurPeekLayer };
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/components/ArthurPeek.jsx
git commit -m "feat: add ArthurPeek mini-win reaction component"
```

---

## Task 6: Celebration Overlay Component

**Files:**
- Create: `src/components/CelebrationOverlay.jsx`

**Step 1: Create CelebrationOverlay**

Create `src/components/CelebrationOverlay.jsx`:

```jsx
import { useState, useCallback, useEffect } from 'react';
import ArthurBear from './ArthurBear';
import { playCelebrate } from '../hooks/useSound';

/**
 * Full-screen celebration overlay with confetti + Arthur Bear dancing.
 *
 * Usage:
 *   const { celebrate, CelebrationLayer } = useCelebration();
 *   celebrate({ message: 'Well done!', colors: ['#facc15', '#38bdf8'] });
 *   return <><CelebrationLayer /><game /></>;
 */

const MESSAGES = ['Well done!', 'Amazing!', 'Hooray!', 'Brilliant!', 'Yay!'];

let celebrationId = 0;

export function useCelebration() {
  const [active, setActive] = useState(null);

  const celebrate = useCallback((options = {}) => {
    const {
      message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      colors = ['#facc15', '#38bdf8', '#ec4899', '#22c55e'],
      duration = 3500,
    } = options;

    const id = ++celebrationId;
    playCelebrate();
    setActive({ id, message, colors, duration });

    setTimeout(() => {
      setActive(prev => prev?.id === id ? null : prev);
    }, duration);
  }, []);

  const dismiss = useCallback(() => setActive(null), []);

  const CelebrationLayer = useCallback(() => {
    if (!active) return null;

    const confetti = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: active.colors[i % active.colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 1.5,
      width: 6 + Math.random() * 8,
      height: 10 + Math.random() * 14,
      rotation: Math.random() * 360,
    }));

    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
        onClick={dismiss}
      >
        {/* Dim overlay */}
        <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.3s_ease-out]" />

        {/* Confetti */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          >
            <div
              style={{
                width: c.width,
                height: c.height,
                backgroundColor: c.color,
                borderRadius: 2,
                transform: `rotate(${c.rotation}deg)`,
              }}
            />
          </div>
        ))}

        {/* Message */}
        <h1
          className="relative z-10 text-5xl font-heading text-sun drop-shadow-lg
                     animate-celebration-text mb-8"
          style={{ animationDelay: '0.3s' }}
        >
          {active.message}
        </h1>

        {/* Arthur dancing */}
        <div className="relative z-10 animate-peek-in" style={{ animationDelay: '0.2s' }}>
          <div className="animate-dance">
            <ArthurBear expression="excited" size={160} mode="full" />
          </div>
        </div>

        {/* Stars behind Arthur */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute z-[5] animate-confetti-fall text-2xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${0.5 + Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    );
  }, [active, dismiss]);

  return { celebrate, CelebrationLayer };
}
```

**Step 2: Add fadeIn keyframe to index.css** (if not present):

Add to `src/index.css`:

```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS (playCelebrate doesn't exist yet — will be added in Task 8)

**Step 4: Commit**

```bash
git add src/components/CelebrationOverlay.jsx src/index.css
git commit -m "feat: add CelebrationOverlay with confetti and Arthur Bear"
```

---

## Task 7: Section Background Components

**Files:**
- Create: `src/components/backgrounds/GamesBackground.jsx`
- Create: `src/components/backgrounds/PuzzlesBackground.jsx`
- Create: `src/components/backgrounds/ArtBackground.jsx`
- Create: `src/components/backgrounds/BooksBackground.jsx`
- Create: `src/components/backgrounds/MusicBackground.jsx`
- Create: `src/components/backgrounds/SectionBackground.jsx`

**Step 1: Create GamesBackground (animated sky with clouds)**

Create `src/components/backgrounds/GamesBackground.jsx`:

```jsx
/** Sky with puffy clouds and rolling hills. Clouds drift gently. */
export default function GamesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="gamesSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="600" fill="url(#gamesSky)" />

        {/* Sun */}
        <circle cx="680" cy="80" r="50" fill="#facc15" opacity="0.9">
          <animate attributeName="r" values="50;53;50" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="680" cy="80" r="70" fill="#facc15" opacity="0.15">
          <animate attributeName="r" values="70;80;70" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Clouds — drift right */}
        <g opacity="0.9">
          <g>
            <ellipse cx="120" cy="100" rx="60" ry="25" fill="white" />
            <ellipse cx="90" cy="90" rx="35" ry="20" fill="white" />
            <ellipse cx="155" cy="92" rx="30" ry="18" fill="white" />
            <animateTransform attributeName="transform" type="translate" values="0,0;100,0;0,0" dur="30s" repeatCount="indefinite" />
          </g>
          <g>
            <ellipse cx="450" cy="60" rx="70" ry="28" fill="white" />
            <ellipse cx="415" cy="50" rx="40" ry="22" fill="white" />
            <ellipse cx="490" cy="52" rx="35" ry="20" fill="white" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-80,0;0,0" dur="35s" repeatCount="indefinite" />
          </g>
          <g>
            <ellipse cx="700" cy="140" rx="50" ry="22" fill="white" opacity="0.7" />
            <ellipse cx="675" cy="132" rx="30" ry="16" fill="white" opacity="0.7" />
            <animateTransform attributeName="transform" type="translate" values="0,0;60,0;0,0" dur="25s" repeatCount="indefinite" />
          </g>
        </g>

        {/* Rolling hills */}
        <path d="M0 480 Q150 420 300 460 Q500 410 650 440 Q770 420 800 450 L800 600 L0 600 Z" fill="#86efac" />
        <path d="M0 510 Q200 470 400 500 Q550 460 700 490 Q780 480 800 500 L800 600 L0 600 Z" fill="#4ade80" />
        <path d="M0 540 Q100 520 250 540 Q400 510 600 530 Q750 520 800 540 L800 600 L0 600 Z" fill="#22c55e" />
      </svg>
    </div>
  );
}
```

**Step 2: Create PuzzlesBackground (geometric CSS pattern)**

Create `src/components/backgrounds/PuzzlesBackground.jsx`:

```jsx
/** Geometric pattern with soft pastels. Subtle rotation. */
export default function PuzzlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-teal-900 to-cyan-950">
      {/* Subtle geometric grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(150deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(30deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf),
            linear-gradient(150deg, #2dd4bf 12%, transparent 12.5%, transparent 87%, #2dd4bf 87.5%, #2dd4bf)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
        }}
      />
      {/* Floating shapes */}
      {[
        { x: '10%', y: '20%', size: 40, color: '#2dd4bf', delay: 0 },
        { x: '70%', y: '15%', size: 30, color: '#f87171', delay: 1 },
        { x: '85%', y: '60%', size: 35, color: '#c4b5fd', delay: 2 },
        { x: '25%', y: '70%', size: 28, color: '#2dd4bf', delay: 0.5 },
        { x: '55%', y: '40%', size: 32, color: '#f87171', delay: 1.5 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-lg opacity-15 animate-float"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            animationDelay: `${s.delay}s`,
            transform: `rotate(${45 * i}deg)`,
          }}
        />
      ))}
    </div>
  );
}
```

**Step 3: Create ArtBackground (paint splashes)**

Create `src/components/backgrounds/ArtBackground.jsx`:

```jsx
/** Paint splashes and easel vibes. Calm — static with occasional subtle drip. */
export default function ArtBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-rose-950 to-pink-950">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        {/* Paint splotches */}
        <circle cx="150" cy="120" r="80" fill="#ec4899" opacity="0.15" />
        <circle cx="650" cy="100" r="100" fill="#8b5cf6" opacity="0.12" />
        <circle cx="400" cy="450" r="120" fill="#f59e0b" opacity="0.1" />
        <circle cx="100" cy="400" r="70" fill="#22c55e" opacity="0.12" />
        <circle cx="700" cy="350" r="90" fill="#38bdf8" opacity="0.1" />

        {/* Paint drip — subtle */}
        <rect x="300" y="0" width="8" height="60" rx="4" fill="#ec4899" opacity="0.2">
          <animate attributeName="height" values="0;60;60" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.15" dur="8s" repeatCount="indefinite" />
        </rect>
        <rect x="550" y="0" width="6" height="45" rx="3" fill="#8b5cf6" opacity="0.15">
          <animate attributeName="height" values="0;45;45" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.15;0.1" dur="12s" repeatCount="indefinite" />
        </rect>

        {/* Brush strokes */}
        <path d="M50 550 Q200 520 350 540 Q500 525 650 545 Q730 535 800 550" stroke="#ec4899" strokeWidth="20" fill="none" opacity="0.08" strokeLinecap="round" />
        <path d="M0 570 Q150 545 300 565 Q500 540 700 560 Q770 555 800 570" stroke="#f59e0b" strokeWidth="15" fill="none" opacity="0.06" strokeLinecap="round" />
      </svg>
    </div>
  );
}
```

**Step 4: Create BooksBackground (cozy library)**

Create `src/components/backgrounds/BooksBackground.jsx`:

```jsx
/** Cozy library with warm lamp. Lamp glow flickers subtly. */
export default function BooksBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="booksBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="600" fill="url(#booksBg)" />

        {/* Lamp glow (flickers) */}
        <circle cx="400" cy="150" r="250" fill="url(#lampGlow)">
          <animate attributeName="r" values="250;260;245;255;250" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Bookshelf background */}
        {/* Shelf boards */}
        <rect x="50" y="150" width="700" height="8" fill="#92400e" rx="2" />
        <rect x="50" y="300" width="700" height="8" fill="#92400e" rx="2" />
        <rect x="50" y="450" width="700" height="8" fill="#92400e" rx="2" />

        {/* Books on shelves (row 1) */}
        {[
          { x: 60, w: 20, h: 90, color: '#dc2626' },
          { x: 85, w: 18, h: 85, color: '#2563eb' },
          { x: 108, w: 22, h: 95, color: '#16a34a' },
          { x: 135, w: 16, h: 80, color: '#9333ea' },
          { x: 156, w: 24, h: 92, color: '#ea580c' },
          { x: 185, w: 19, h: 88, color: '#0891b2' },
          { x: 330, w: 21, h: 90, color: '#be123c' },
          { x: 356, w: 17, h: 82, color: '#4f46e5' },
          { x: 378, w: 23, h: 94, color: '#15803d' },
        ].map((book, i) => (
          <rect key={i} x={book.x} y={150 - book.h} width={book.w} height={book.h} fill={book.color} opacity="0.3" rx="2" />
        ))}

        {/* Floor */}
        <rect x="0" y="500" width="800" height="100" fill="#3f1e04" />
        <rect x="0" y="498" width="800" height="6" fill="#5c2d0a" />
      </svg>
    </div>
  );
}
```

**Step 5: Create MusicBackground (stage with spotlights)**

Create `src/components/backgrounds/MusicBackground.jsx`:

```jsx
/** Concert stage with spotlights. Spotlights sweep gently. */
export default function MusicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="musicBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <radialGradient id="spot1" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="spot2" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="600" fill="url(#musicBg)" />

        {/* Stage floor */}
        <rect x="0" y="480" width="800" height="120" fill="#1e1b4b" />
        <path d="M0 480 L50 470 L750 470 L800 480 Z" fill="#312e81" />

        {/* Curtain folds (sides) */}
        <path d="M0 0 Q30 100 15 200 Q35 300 20 400 Q30 500 0 600 L0 0" fill="#7f1d1d" opacity="0.5" />
        <path d="M800 0 Q770 100 785 200 Q765 300 780 400 Q770 500 800 600 L800 0" fill="#7f1d1d" opacity="0.5" />

        {/* Spotlights */}
        <ellipse cx="250" cy="300" rx="200" ry="300" fill="url(#spot1)">
          <animateTransform attributeName="transform" type="translate" values="0,0;30,0;-20,0;0,0" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="550" cy="300" rx="200" ry="300" fill="url(#spot2)">
          <animateTransform attributeName="transform" type="translate" values="0,0;-25,0;15,0;0,0" dur="10s" repeatCount="indefinite" />
        </ellipse>

        {/* Stage lights (top) */}
        {[100, 250, 400, 550, 700].map((x, i) => (
          <g key={i}>
            <rect x={x - 8} y="0" width="16" height="20" fill="#1e1b4b" />
            <circle cx={x} cy="22" r="6" fill={i % 2 === 0 ? '#facc15' : '#8b5cf6'} opacity="0.8">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
```

**Step 6: Create SectionBackground router**

Create `src/components/backgrounds/SectionBackground.jsx`:

```jsx
import GamesBackground from './GamesBackground';
import PuzzlesBackground from './PuzzlesBackground';
import ArtBackground from './ArtBackground';
import BooksBackground from './BooksBackground';
import MusicBackground from './MusicBackground';

const BACKGROUNDS = {
  games: GamesBackground,
  puzzles: PuzzlesBackground,
  art: ArtBackground,
  books: BooksBackground,
  music: MusicBackground,
};

/** Renders the appropriate background for the given section.
 *  Falls back to a plain dark background if section has no custom bg. */
export default function SectionBackground({ section }) {
  const Bg = BACKGROUNDS[section];
  if (!Bg) return <div className="absolute inset-0 bg-night" />;
  return <Bg />;
}
```

**Step 7: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 8: Commit**

```bash
git add src/components/backgrounds/
git commit -m "feat: add per-section SVG backgrounds (games, puzzles, art, books, music)"
```

---

## Task 8: Enriched Sound System

**Files:**
- Modify: `src/hooks/useSound.js`

**Step 1: Add new sound functions**

Add these functions to `src/hooks/useSound.js` after the existing `playStickerSound` function:

```js
// ── Premium Polish Sounds ──

/** Enriched tap — layered sine + triangle with pitch randomisation */
export function playRichTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const baseFreq = 580 + (Math.random() - 0.5) * 40; // randomise ±20Hz

  // Layer 1: sine
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = baseFreq;
  gain1.gain.setValueAtTime(0.2, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.1);

  // Layer 2: triangle (brightness)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = baseFreq * 1.5;
  gain2.gain.setValueAtTime(0.1, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.08);
}

/** Navigate whoosh — soft filtered noise sweep */
export function playNavigate() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.25);
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.3);
}

/** Celebration jingle — ascending arpeggio with shimmer (1.5s) */
export function playCelebrate() {
  if (globalMuted) return;
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6

  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.15;
    // Main note
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);

    // Shimmer (detuned)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2.01; // octave + slight detune
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.06, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.45);
  });

  // Final chord (hold)
  setTimeout(() => {
    [1047, 1319, 1568].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    });
  }, 750);
}

/** Gentle error — descending two-note (non-punishing) */
export function playError() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

// ── Section-Specific Tap Sounds ──

/** Games: bouncy boing (enriched) */
export function playGamesTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(280 + Math.random() * 40, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Books: soft page-turn */
export function playBooksTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  // Noise burst (paper rustle)
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.12);
  // Gentle tone
  const osc = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 800;
  g2.gain.setValueAtTime(0.08, ctx.currentTime);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(g2).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

/** Art: paint splat */
export function playArtTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.1);
}

/** Music: percussive tick */
export function playMusicTap() {
  playTone(1200, 0.04, 'square');
}

/** Puzzles: satisfying click */
export function playPuzzlesTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 1800;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
  // Resonance tail
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 900;
  g2.gain.setValueAtTime(0.1, ctx.currentTime + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc2.connect(g2).connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.02);
  osc2.stop(ctx.currentTime + 0.12);
}

/** Play the tap sound for a given section */
export function playSectionTap(section) {
  const tapMap = {
    games: playGamesTap,
    books: playBooksTap,
    art: playArtTap,
    music: playMusicTap,
    puzzles: playPuzzlesTap,
  };
  (tapMap[section] || playRichTap)();
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat: add enriched tap, celebrate, navigate, section-specific sounds"
```

---

## Task 9: Ambient Sound System

**Files:**
- Create: `src/hooks/useAmbient.js`

**Step 1: Create ambient sound hook**

Create `src/hooks/useAmbient.js`:

```js
import { useEffect, useRef } from 'react';

/**
 * Ambient sound loop for a given section.
 * Uses Web Audio oscillators/noise — no audio files.
 * Fades in/out over 1s. Extremely subtle (gain 0.03-0.05).
 * Respects globalMuted from useSound.js.
 */

let globalMuted = false;

// Import mute state from useSound
export function syncMuteState(muted) {
  globalMuted = muted;
}

function getCtx() {
  if (!window.__ambientCtx) {
    window.__ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = window.__ambientCtx;
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function createAmbient(section) {
  const ctx = getCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0; // start silent, fade in
  masterGain.connect(ctx.destination);

  const nodes = [];

  switch (section) {
    case 'games': {
      // Birds chirping — random sine blips
      const birdGain = ctx.createGain();
      birdGain.gain.value = 0.03;
      birdGain.connect(masterGain);

      const chirpInterval = setInterval(() => {
        if (globalMuted) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 2000 + Math.random() * 2000;
        g.gain.setValueAtTime(0.02, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(g).connect(birdGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }, 1500 + Math.random() * 3000);

      // Breeze — low-pass filtered noise
      const breezeBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const breezeData = breezeBuffer.getChannelData(0);
      for (let i = 0; i < breezeData.length; i++) breezeData[i] = Math.random() * 2 - 1;
      const breeze = ctx.createBufferSource();
      breeze.buffer = breezeBuffer;
      breeze.loop = true;
      const breezeFilter = ctx.createBiquadFilter();
      breezeFilter.type = 'lowpass';
      breezeFilter.frequency.value = 400;
      const breezeGain = ctx.createGain();
      breezeGain.gain.value = 0.02;
      breeze.connect(breezeFilter).connect(breezeGain).connect(masterGain);
      breeze.start();

      nodes.push({ stop: () => { clearInterval(chirpInterval); breeze.stop(); } });
      break;
    }

    case 'books': {
      // Warm hum
      const hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 80;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.025;
      hum.connect(humGain).connect(masterGain);
      hum.start();

      // Crackle — random clicks
      const crackleInterval = setInterval(() => {
        if (globalMuted) return;
        const bufSize = ctx.sampleRate * 0.01;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.015;
        src.connect(g).connect(masterGain);
        src.start();
      }, 2000 + Math.random() * 4000);

      nodes.push({ stop: () => { hum.stop(); clearInterval(crackleInterval); } });
      break;
    }

    case 'music': {
      // Faint reverb ambience — very low noise
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      const g = ctx.createGain();
      g.gain.value = 0.015;
      noise.connect(filter).connect(g).connect(masterGain);
      noise.start();

      nodes.push({ stop: () => noise.stop() });
      break;
    }

    case 'art': {
      // Soft rain — filtered noise bursts
      const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const rainData = rainBuffer.getChannelData(0);
      for (let i = 0; i < rainData.length; i++) rainData[i] = Math.random() * 2 - 1;
      const rain = ctx.createBufferSource();
      rain.buffer = rainBuffer;
      rain.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;
      const g = ctx.createGain();
      g.gain.value = 0.02;
      rain.connect(filter).connect(g).connect(masterGain);
      rain.start();

      nodes.push({ stop: () => rain.stop() });
      break;
    }

    case 'puzzles': {
      // Gentle wind
      const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const windData = windBuffer.getChannelData(0);
      for (let i = 0; i < windData.length; i++) windData[i] = Math.random() * 2 - 1;
      const wind = ctx.createBufferSource();
      wind.buffer = windBuffer;
      wind.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 250;
      const g = ctx.createGain();
      g.gain.value = 0.018;
      wind.connect(filter).connect(g).connect(masterGain);
      wind.start();

      // Sparse chimes
      const chimeInterval = setInterval(() => {
        if (globalMuted) return;
        const osc = ctx.createOscillator();
        const cg = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800 + Math.random() * 800;
        cg.gain.setValueAtTime(0.02, ctx.currentTime);
        cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(cg).connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }, 5000 + Math.random() * 8000);

      nodes.push({ stop: () => { wind.stop(); clearInterval(chimeInterval); } });
      break;
    }

    default:
      break;
  }

  // Fade in
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1);

  return {
    stop() {
      // Fade out
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch {} });
        masterGain.disconnect();
      }, 1100);
    },
  };
}

/** Hook: starts ambient sound for given section, cleans up on unmount/change */
export function useAmbient(section) {
  const ambientRef = useRef(null);

  useEffect(() => {
    if (!section) return;

    // Small delay so AudioContext has been unlocked by user interaction
    const timer = setTimeout(() => {
      ambientRef.current = createAmbient(section);
    }, 500);

    return () => {
      clearTimeout(timer);
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
  }, [section]);
}
```

**Step 2: Wire mute sync**

In `src/hooks/useSound.js`, add to the `setGlobalMute` function:

```js
import { syncMuteState } from './useAmbient'; // add to imports

export function setGlobalMute(muted) {
  globalMuted = muted;
  syncMuteState(muted); // sync to ambient system
}
```

Note: This creates a circular import risk. Instead, use an event-based approach — have `useAmbient.js` import `globalMuted` check inline, or read a shared module variable. The simplest approach: `useAmbient.js` checks `window.__arthurMuted` and `setGlobalMute` sets it:

In `useSound.js`:
```js
export function setGlobalMute(muted) {
  globalMuted = muted;
  window.__arthurMuted = muted;
}
```

In `useAmbient.js`, replace `let globalMuted = false;` and `syncMuteState` with:
```js
// Read mute state from global (set by useSound.js)
function isMuted() { return !!window.__arthurMuted; }
```

And replace all `if (globalMuted) return;` with `if (isMuted()) return;`.

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/hooks/useAmbient.js src/hooks/useSound.js
git commit -m "feat: add ambient sound system with per-section soundscapes"
```

---

## Task 10: Wire SectionContext into App.jsx

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/BackButton.jsx`

**Step 1: Add SectionProvider to routes**

Modify `src/App.jsx`:
- Import `SectionProvider` from `src/contexts/SectionContext.jsx`
- Wrap all routes under `/games/:mode/:section/*` with `<SectionProvider>`
- Replace the `<Loading>` component with an Arthur Bear loading screen

The `<SectionProvider>` should wrap routes that have `:section` in the path. Since each game route is under `/games/:mode/:section/:path`, wrap at the `MuteByMode` level for those routes.

Add a wrapper component:

```jsx
function SectionRoute({ children }) {
  return (
    <MuteByMode>
      <SectionProvider>
        {children}
      </SectionProvider>
    </MuteByMode>
  );
}
```

Use `<SectionRoute>` for all game routes under `/games/:mode/:section/*`.

Replace Loading component with Arthur Bear:

```jsx
import ArthurBear from './components/ArthurBear';

function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
      <div className="animate-dance">
        <ArthurBear expression="happy" size={100} mode="full" />
      </div>
      <span className="text-lg font-heading text-sun/60 animate-pulse">Loading...</span>
    </div>
  );
}
```

**Step 2: Update BackButton with SVG arrow**

Modify `src/components/BackButton.jsx` to use an SVG arrow instead of emoji:

```jsx
import { useNavigate } from 'react-router-dom';
import { playTap } from '../hooks/useSound';
import { useSection } from '../contexts/SectionContext';

export default function BackButton() {
  const navigate = useNavigate();
  const theme = useSection();
  const accentColor = theme?.palette?.primary || '#ffffff';

  return (
    <button
      onClick={() => { playTap(); navigate(-1); }}
      className="fixed top-4 left-4 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                 flex items-center justify-center active:scale-90 transition-transform tap-ripple"
      aria-label="Go back"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 19l-7-7 7-7" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/App.jsx src/components/BackButton.jsx
git commit -m "feat: wire SectionContext into routes, Arthur loading screen, SVG back button"
```

---

## Task 11: Update SectionPicker with Backgrounds and Spring Animations

**Files:**
- Modify: `src/pages/SectionPicker.jsx`

**Step 1: Apply section backgrounds and spring-in animations**

Modify `src/pages/SectionPicker.jsx`:
- Replace `Starfield` with the NightSkyScene (or a custom background)
- Replace `animate-bounce-in` with `animate-spring-in` on cards
- Add `tap-ripple` class to card buttons
- Use `playNavigate()` on card click instead of `playBoing()`
- Add section-specific colour accent on each card

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import NightSkyScene from '../components/scenes/NightSkyScene';
import { playNavigate } from '../hooks/useSound';

const sections = [
  { id: 'games',   emoji: '🎮', label: 'Games',   bg: 'from-sky to-blue-600',           border: 'border-sky' },
  { id: 'puzzles', emoji: '🧩', label: 'Puzzles', bg: 'from-teal-400 to-cyan-600',      border: 'border-teal-400' },
  { id: 'art',     emoji: '🎨', label: 'Art',     bg: 'from-candy to-pink-700',          border: 'border-candy' },
  { id: 'books',   emoji: '📚', label: 'Books',   bg: 'from-amber-400 to-orange-500',    border: 'border-amber-400' },
  { id: 'music',   emoji: '🎵', label: 'Music',   bg: 'from-purple-500 to-violet-700',   border: 'border-purple-500' },
  { id: 'videos',  emoji: '📺', label: 'Videos',  bg: 'from-red-500 to-red-700',         border: 'border-red-500' },
];

export default function SectionPicker() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const modeLabel = mode === 'quiet' ? '🌙 Quiet' : mode === 'noisy' ? '🔥 Noisy' : '🌟 All';

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <NightSkyScene />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          {modeLabel}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { playNavigate(); navigate(`/games/${mode}/${s.id}`); }}
              className={`game-card tap-ripple bg-gradient-to-br ${s.bg} p-6 flex flex-col items-center
                         gap-3 min-h-[130px] animate-spring-in border-2 ${s.border} border-opacity-30`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-6xl">{s.emoji}</span>
              <span className="text-xl font-heading text-white drop-shadow">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/pages/SectionPicker.jsx
git commit -m "feat: upgrade SectionPicker with spring animations and tap ripple"
```

---

## Task 12: Update GameGrid with Section Backgrounds and Ambient

**Files:**
- Modify: `src/pages/GameGrid.jsx`

**Step 1: Apply section background and ambient sound**

Modify `src/pages/GameGrid.jsx`:
- Replace `Starfield` with `SectionBackground`
- Add `useAmbient(section)` hook
- Replace `animate-bounce-in` with section-specific entrance animation
- Add `tap-ripple` class to cards
- Use `playSectionTap(section)` instead of `playBoing()`

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';
import SectionBackground from '../components/backgrounds/SectionBackground';
import { useAmbient } from '../hooks/useAmbient';
import { playSectionTap } from '../hooks/useSound';
import { useSection } from '../contexts/SectionContext';

const sectionMeta = {
  games:   { emoji: '🎮', label: 'Games' },
  puzzles: { emoji: '🧩', label: 'Puzzles' },
  art:     { emoji: '🎨', label: 'Art' },
  books:   { emoji: '📚', label: 'Books' },
  music:   { emoji: '🎵', label: 'Music' },
  videos:  { emoji: '📺', label: 'Videos' },
};

const ENTRANCE_ANIM = {
  bouncy: 'animate-spring-in',
  gentle: 'animate-gentle-in',
  rhythmic: 'animate-rhythmic-in',
  painterly: 'animate-spring-in',
  smooth: 'animate-smooth-in',
};

export default function GameGrid() {
  const { mode, section } = useParams();
  const navigate = useNavigate();
  const theme = useSection();

  useAmbient(section);

  const filtered = games.filter(g => g.category === section);
  const meta = sectionMeta[section] || { emoji: '', label: section };
  const entranceClass = ENTRANCE_ANIM[theme?.animationVibe] || 'animate-spring-in';

  return (
    <div className="relative w-full h-full overflow-y-auto no-scrollbar">
      <SectionBackground section={section} />
      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          {meta.emoji} {meta.label}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {filtered.map((game, i) => (
            <button
              key={game.id}
              onClick={() => {
                playSectionTap(section);
                if (game.external) {
                  window.open(game.external, '_blank');
                } else {
                  navigate(`/games/${mode}/${section}/${game.path}`);
                }
              }}
              className={`game-card tap-ripple overflow-hidden bg-gradient-to-br ${game.bg} flex flex-col items-center
                         justify-center gap-2 min-h-[120px] ${entranceClass}
                         ${game.cover ? 'p-0' : 'p-5'}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {game.cover ? (
                <div className="relative w-full h-full min-h-[160px]">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-sm font-heading text-white drop-shadow leading-tight">
                      {game.title}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-5xl">{game.emoji}</span>
                  <span className="text-lg font-heading text-white drop-shadow">{game.title}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/pages/GameGrid.jsx
git commit -m "feat: upgrade GameGrid with section backgrounds, ambient sound, themed animations"
```

---

## Task 13: Update ModePicker with Arthur Bear

**Files:**
- Modify: `src/pages/ModePicker.jsx`

**Step 1: Add Arthur Bear to home screen**

Modify `src/pages/ModePicker.jsx`:
- Add Arthur Bear peeking up from below the title
- Replace `animate-bounce-in` with `animate-spring-in`
- Add `tap-ripple` to buttons
- Use `playNavigate()` on button click

```jsx
import { useNavigate } from 'react-router-dom';
import { playNavigate } from '../hooks/useSound';
import NightSkyScene from '../components/scenes/NightSkyScene';
import ArthurBear from '../components/ArthurBear';

const modes = [
  { id: 'quiet', emoji: '🌙', label: 'Quiet', bg: 'from-navy to-blue-900', to: '/games/quiet' },
  { id: 'noisy', emoji: '🔥', label: 'Noisy', bg: 'from-red-600 to-ember', to: '/games/noisy' },
  { id: 'all',   emoji: '🌟', label: 'All',   bg: 'from-purple-600 to-indigo-800', to: '/games/all' },
];

export default function ModePicker() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6">
      <NightSkyScene />

      {/* Title with Arthur Bear */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-heading text-sun drop-shadow-lg animate-float">
          Arthur's World
        </h1>
        <div className="mt-2 animate-peek-in" style={{ animationDelay: '0.5s' }}>
          <div className="animate-float" style={{ animationDelay: '1s' }}>
            <ArthurBear expression="happy" size={80} mode="face" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
        {modes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { playNavigate(); navigate(m.to); }}
            className={`game-card tap-ripple bg-gradient-to-br ${m.bg} p-8 flex flex-col items-center gap-3
                       animate-spring-in`}
            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
          >
            <span className="text-7xl">{m.emoji}</span>
            <span className="text-2xl font-heading text-white drop-shadow">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/pages/ModePicker.jsx
git commit -m "feat: add Arthur Bear to home screen, spring animations, navigate sound"
```

---

## Task 14: Add Celebrations to MemoryMatch

**Files:**
- Modify: `src/games/MemoryMatch.jsx`

**Step 1: Integrate ParticleBurst, ArthurPeek, and CelebrationOverlay**

Read `src/games/MemoryMatch.jsx` first to understand current structure, then modify:

- Import `useParticleBurst`, `useArthurPeek`, `useCelebration`
- On pair match: fire particle burst at card position + Arthur peek (excited)
- On game complete (won=true): fire celebration overlay instead of plain modal
- Replace `playBoing` on mismatch with `playError`
- Replace `playTap` on flip with `playSectionTap('puzzles')`

Key changes:
```jsx
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { playSectionTap, playSuccess, playError } from '../hooks/useSound';
import { useSection } from '../contexts/SectionContext';

// Inside component:
const { burst, ParticleLayer } = useParticleBurst();
const { peek, ArthurPeekLayer } = useArthurPeek();
const { celebrate, CelebrationLayer } = useCelebration();
const theme = useSection();

// On match found:
burst(cardX, cardY, {
  colors: theme?.particles?.colors,
  shapes: theme?.particles?.shapes,
});
peek('excited');
playSuccess();

// On game won:
celebrate({
  message: 'Amazing!',
  colors: theme?.particles?.colors,
});

// Render layers:
return (
  <>
    <ParticleLayer />
    <ArthurPeekLayer />
    <CelebrationLayer />
    {/* existing game UI */}
  </>
);
```

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Visually verify in browser**

Navigate to: Noisy > Puzzles > Memory > play through a game
Expected: particle bursts on matches, Arthur peek, celebration on completion

**Step 4: Commit**

```bash
git add src/games/MemoryMatch.jsx
git commit -m "feat: add celebrations to MemoryMatch (particles, Arthur peek, overlay)"
```

---

## Task 15: Add Celebrations to BubblePop

**Files:**
- Modify: `src/games/BubblePop.jsx`

**Step 1: Add mini-win celebrations**

Read `src/games/BubblePop.jsx` first, then add:
- Particle burst at each bubble pop position
- Arthur peek every 10 points (on `playSuccess()` milestone)
- Use section-themed particles

BubblePop is endless so no big-win celebration needed — just enriched mini-wins.

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat: add particle bursts and Arthur peek to BubblePop"
```

---

## Task 16: Add Celebrations to Remaining Games

**Files:**
- Modify: `src/games/FeedAnimals.jsx`
- Modify: `src/games/PopCritters.jsx`
- Modify: `src/games/Colouring.jsx`
- Modify: `src/games/MusicPad.jsx`

**Step 1: FeedAnimals**

- Particle burst on correct answer
- Arthur peek on correct answer (excited)
- Celebration overlay when all 6 animals fed (replace the star rain with CelebrationOverlay)

**Step 2: PopCritters**

- Particle burst on each critter pop
- Arthur peek every 5 points

**Step 3: Colouring**

- Add a "Show Arthur!" button — when tapped, Arthur peek (excited) + playSuccess()
- No game-completion celebration (open-ended)

**Step 4: MusicPad**

- Add radiating ring animation on pad press (CSS `animate-radiate-ring`)
- No Arthur peek on every tap (would be annoying) — just visual glow

**Step 5: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 6: Commit**

```bash
git add src/games/FeedAnimals.jsx src/games/PopCritters.jsx src/games/Colouring.jsx src/games/MusicPad.jsx
git commit -m "feat: add celebrations to FeedAnimals, PopCritters, Colouring, MusicPad"
```

---

## Task 17: Add Completion Callback to StoryBook

**Files:**
- Modify: `src/components/StoryBook.jsx`
- Modify: story files that use StoryBook (e.g. `src/stories/ThreeLittlePigs.jsx`)

**Step 1: Add onComplete prop to StoryBook**

In `src/components/StoryBook.jsx`:
- Add `onComplete` prop
- When reaching the final page, call `onComplete()` if provided
- This lets parent components trigger celebrations

**Step 2: Wire celebrations in one story file as template**

In one story file (e.g. `src/stories/ThreeLittlePigs.jsx`):
- Import `useCelebration`
- Pass `onComplete={() => celebrate({ message: 'The End!' })}` to StoryBook
- Other story files follow the same pattern

**Step 3: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/components/StoryBook.jsx src/stories/ThreeLittlePigs.jsx
git commit -m "feat: add onComplete callback to StoryBook, wire celebration in ThreeLittlePigs"
```

---

## Task 18: Wire Celebrations in All Story Files

**Files:**
- Modify: all files in `src/stories/*.jsx` (14 files)

**Step 1: Add celebration overlay to each story**

For each story file:
- Import `useCelebration` from `../components/CelebrationOverlay`
- Add `const { celebrate, CelebrationLayer } = useCelebration()`
- Pass `onComplete={() => celebrate({ message: 'The End!' })}` to StoryBook
- Render `<CelebrationLayer />` alongside StoryBook

This is repetitive but each file is small — a few lines added per file.

**Step 2: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/stories/
git commit -m "feat: add completion celebrations to all storybooks"
```

---

## Task 19: DALL-E Asset Generation Script

**Files:**
- Create: `scripts/generate-polish-assets.mjs`

**Step 1: Create the generation script**

Create `scripts/generate-polish-assets.mjs` — generates:
- 6 SectionPicker hero cards (saved to `public/images/sections/`)
- ~8 GameGrid card illustrations (saved to `public/images/cards/`)
- 1 Arthur Bear reference (saved to `public/images/arthur/`)

Use the same Bluey-style prompt prefix from `scripts/generate-scene-assets.mjs`.

Structure:
```js
const SECTION_PROMPTS = {
  games: 'A colourful outdoor playground with slides, swings, bouncy balls...',
  puzzles: 'Colourful geometric puzzle pieces, jigsaw shapes...',
  art: 'An artist easel with paintbrushes, splashy rainbow colours...',
  books: 'A cozy reading nook with bookshelf, warm glowing lamp...',
  music: 'A colourful concert stage with piano, drums, guitar...',
  videos: 'A fun TV screen showing cartoon characters...',
};

const GAME_PROMPTS = {
  'bubble-pop': 'Underwater scene with colourful bubbles floating up...',
  'feed-animals': 'Happy farm animals at feeding time, hay and carrots...',
  'pop-critters': 'Cute cartoon critters popping out of holes...',
  'memory-match': 'Face-down playing cards with stars on the back...',
  'colouring': 'Blank canvas with rainbow colour palette and brushes...',
  'music-pad': 'Colourful piano keys and musical instruments...',
  'build-a-scene': 'Stickers being placed on a magical scene background...',
};
```

All images: 1024x1024, standard quality, Bluey art style.

**Step 2: Run the script**

Run: `node scripts/generate-polish-assets.mjs`
Expected: ~15 images generated in `public/images/sections/` and `public/images/cards/`

**Step 3: Commit**

```bash
git add scripts/generate-polish-assets.mjs public/images/sections/ public/images/cards/ public/images/arthur/
git commit -m "feat: generate DALL-E section and game card illustrations"
```

---

## Task 20: Wire DALL-E Card Images into UI

**Files:**
- Modify: `src/pages/SectionPicker.jsx` — use section hero images as card backgrounds
- Modify: `src/data/games.js` — add `cover` field to non-book games

**Step 1: Update SectionPicker cards with images**

For each section card in SectionPicker, use the DALL-E hero image as background:
- Card shows the illustration with a frosted glass title bar at bottom
- Same pattern as book cover cards in GameGrid

**Step 2: Update games.js with card covers**

Add `cover` field to each non-book game entry:
```js
{ id: 'bubble-pop', ..., cover: '/arthurs-world/images/cards/bubble-pop.png' },
{ id: 'feed-animals', ..., cover: '/arthurs-world/images/cards/feed-animals.png' },
// etc.
```

**Step 3: Update GameGrid to use cover pattern for all cards**

In GameGrid, all cards now use the cover image pattern (image + frosted glass title bar). The emoji+gradient is the fallback only when no cover exists.

**Step 4: Verify build**

Run: `npm run build`
Expected: SUCCESS

**Step 5: Visually verify in browser**

Navigate through all sections. Every card should show illustrated artwork.

**Step 6: Commit**

```bash
git add src/pages/SectionPicker.jsx src/data/games.js src/pages/GameGrid.jsx
git commit -m "feat: wire DALL-E card illustrations into SectionPicker and GameGrid"
```

---

## Task 21: Final Polish Pass

**Files:**
- Modify: `src/games/BuildAScene.jsx` — ensure celebrations work with section context
- Modify: `src/games/FarmBook.jsx` — add celebration on final page

**Step 1: BuildAScene polish**

BuildAScene already has its own celebration system (AnimateMode). Add Arthur peek when placing stickers and when finding secret stickers.

**Step 2: FarmBook celebration**

FarmBook uses inline JSX (not StoryBook component). Add celebration overlay on reaching the final page.

**Step 3: Full build verification**

Run: `npm run build`
Expected: SUCCESS with zero errors

**Step 4: Commit**

```bash
git add src/games/BuildAScene.jsx src/games/FarmBook.jsx
git commit -m "feat: final polish pass — celebrations in BuildAScene and FarmBook"
```

---

## Task 22: Visual Verification & Bug Fixes

**Step 1: Start dev server and test every screen**

Run: dev server via launch.json

Test checklist:
- [ ] Home screen: Arthur Bear visible, spring animations, navigate sound
- [ ] SectionPicker: section cards with spring-in, tap ripple, navigate sound
- [ ] GameGrid (each section): section background, ambient sound, themed entry animation
- [ ] MemoryMatch: particle burst on match, Arthur peek, celebration overlay on win
- [ ] BubblePop: particle burst on pop, Arthur peek at milestones
- [ ] FeedAnimals: particle burst + Arthur on correct, celebration on all-fed
- [ ] PopCritters: particle burst on pop, Arthur peek at milestones
- [ ] Colouring: "Show Arthur" button works
- [ ] MusicPad: radiating rings on pad press
- [ ] BuildAScene: Arthur peek on sticker place
- [ ] StoryBooks: celebration on final page
- [ ] FarmBook: celebration on final page
- [ ] Back button: SVG arrow, themed colour
- [ ] Loading screen: Arthur Bear dancing
- [ ] Quiet mode: all sounds muted including ambient
- [ ] Noisy/All mode: sounds + ambient playing

**Step 2: Fix any bugs found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: visual verification bug fixes for premium polish"
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | Section Theme Context | `sectionThemes.js`, `SectionContext.jsx` |
| 2 | Spring CSS Foundation | `index.css`, `tailwind.config.js` |
| 3 | Arthur Bear SVG | `ArthurBear.jsx` |
| 4 | Particle Burst | `ParticleBurst.jsx` |
| 5 | Arthur Peek | `ArthurPeek.jsx` |
| 6 | Celebration Overlay | `CelebrationOverlay.jsx` |
| 7 | Section Backgrounds | 6 files in `backgrounds/` |
| 8 | Enriched Sounds | `useSound.js` |
| 9 | Ambient Sounds | `useAmbient.js` |
| 10 | Wire into App | `App.jsx`, `BackButton.jsx` |
| 11 | SectionPicker upgrade | `SectionPicker.jsx` |
| 12 | GameGrid upgrade | `GameGrid.jsx` |
| 13 | ModePicker upgrade | `ModePicker.jsx` |
| 14 | MemoryMatch celebrations | `MemoryMatch.jsx` |
| 15 | BubblePop celebrations | `BubblePop.jsx` |
| 16 | Other game celebrations | 4 game files |
| 17 | StoryBook completion | `StoryBook.jsx` |
| 18 | All story celebrations | 14 story files |
| 19 | DALL-E asset generation | `generate-polish-assets.mjs` |
| 20 | Wire card images | `SectionPicker.jsx`, `games.js`, `GameGrid.jsx` |
| 21 | Final polish | `BuildAScene.jsx`, `FarmBook.jsx` |
| 22 | Verification & fixes | All |

**Total: 22 tasks, ~40+ files touched/created**
