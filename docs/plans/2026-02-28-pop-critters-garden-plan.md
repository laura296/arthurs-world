# Pop Critters Garden Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform PopCritters from a basic emoji whack-a-mole into a beautiful garden-themed game with hand-illustrated SVG woodland creatures, a GardenScene background, CSS rise/sink animations, and 3 difficulty levels.

**Architecture:** Orchestrator pattern (like BuildAScene) — `PopCritters.jsx` manages game state and phases (pick-difficulty → playing). Sub-components in `src/games/pop-critters/` handle UI. A new `GardenScene.jsx` SVG scene provides the background. Six animal SVG components provide the illustrated creatures. Game holes use CSS `overflow: hidden` + `translateY` for the peek-out-of-ground illusion.

**Tech Stack:** React 18, Tailwind CSS, SVG (hand-illustrated), CSS transitions/animations, Web Audio API (existing `useSound.js`)

**Design doc:** `docs/plans/2026-02-28-pop-critters-garden-redesign.md`

**Art direction:** ZERO EMOJI. All animals are hand-illustrated SVG `<g>` groups with gradients, big eyes, rounded shapes, rosy cheeks, animated details. Match the quality of MeadowScene bees/butterfly.

---

## Task 1: Difficulty Config Data

Create the difficulty configuration as a standalone data file. This is pure data with no UI — other tasks depend on it.

**Files:**
- Create: `src/games/pop-critters/difficultyConfig.js`

**Step 1: Create the config file**

```js
// src/games/pop-critters/difficultyConfig.js

export const DIFFICULTIES = {
  gentle: {
    label: 'Gentle Garden',
    emoji: '🌱',
    animals: ['mole', 'hedgehog'],
    visibleTime: { min: 4000, max: 5000 },
    spawnInterval: 2500,
    maxVisible: 2,
    riseSpeed: 600,    // ms
    foxMoves: false,
  },
  busy: {
    label: 'Busy Garden',
    emoji: '🌻',
    animals: ['mole', 'hedgehog', 'rabbit', 'mouse'],
    visibleTime: { min: 2500, max: 3000 },
    spawnInterval: 1800,
    maxVisible: 3,
    riseSpeed: 400,
    foxMoves: false,
  },
  wild: {
    label: 'Wild Garden',
    emoji: '🦊',
    animals: ['mole', 'hedgehog', 'rabbit', 'mouse', 'fox', 'owl'],
    visibleTime: { min: 1500, max: 2000 },
    spawnInterval: 1200,
    maxVisible: 4,
    riseSpeed: 300,
    foxMoves: true,
  },
};

export const ANIMAL_POINTS = {
  mole: 1,
  hedgehog: 1,
  rabbit: 1,
  mouse: 1,
  fox: 2,
  owl: 1,
};

export const GRID = { cols: 3, rows: 3, total: 9 };
```

**Step 2: Verify it imports cleanly**

Run: `cd C:\Users\Shadow\Arthur && npx vite build --mode development 2>&1 | head -5`
Expected: No import errors (file isn't imported yet, but syntax should be valid)

**Step 3: Commit**

```bash
git add src/games/pop-critters/difficultyConfig.js
git commit -m "feat(pop-critters): add difficulty config data"
```

---

## Task 2: Mole SVG Component

The first animal illustration. This sets the quality bar for all others. Hand-illustrated SVG — soft brown gradients, big round eyes with highlights, pink nose, tiny paws, rosy cheeks. Animated blink.

**Files:**
- Create: `src/games/pop-critters/animals/Mole.jsx`

**Reference:** Study `src/components/scenes/MeadowScene.jsx` lines 377-425 (the bee illustrations) for the SVG style — ellipses for body parts, gradients for colour, `<animate>` for motion.

**Step 1: Create the Mole SVG component**

The mole should be roughly 80x80 SVG viewBox, oriented so the top half is visible when peeking out of a hole. Include:
- Round head with soft brown `radialGradient` (dark chocolate centre → warm brown edge)
- Two small round ears on top
- Big round eyes (dark iris with white highlight dot) — include a blink animation using `<animate>` on the eye height
- Small pink triangular nose
- Rosy cheek circles (soft pink, low opacity)
- Two small front paws at bottom (these peek over the hole rim)
- Subtle dark outline stroke (2px, `#4a3728`)

```jsx
// src/games/pop-critters/animals/Mole.jsx
export default function Mole({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="mole-fur" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#8B6F47" />
          <stop offset="100%" stopColor="#6B4F2F" />
        </radialGradient>
        <radialGradient id="mole-nose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#D4788E" />
        </radialGradient>
      </defs>

      {/* Body (bottom half, hidden by hole rim) */}
      <ellipse cx="40" cy="65" rx="22" ry="18" fill="url(#mole-fur)" stroke="#4a3728" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="40" cy="38" rx="26" ry="24" fill="url(#mole-fur)" stroke="#4a3728" strokeWidth="2" />

      {/* Ears */}
      <ellipse cx="20" cy="20" rx="8" ry="7" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="5" ry="4.5" fill="#D4A876" />
      <ellipse cx="60" cy="20" rx="8" ry="7" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="60" cy="20" rx="5" ry="4.5" fill="#D4A876" />

      {/* Eyes — with blink animation */}
      <ellipse cx="30" cy="36" rx="5" ry="5.5" fill="#2D1B0E">
        <animate attributeName="ry" values="5.5;0.5;5.5" dur="4s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2s" />
      </ellipse>
      <circle cx="32" cy="34" r="1.5" fill="white" /> {/* highlight */}

      <ellipse cx="50" cy="36" rx="5" ry="5.5" fill="#2D1B0E">
        <animate attributeName="ry" values="5.5;0.5;5.5" dur="4s" repeatCount="indefinite" keyTimes="0;0.04;0.08" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline" begin="2s" />
      </ellipse>
      <circle cx="52" cy="34" r="1.5" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="45" rx="5" ry="3.5" fill="url(#mole-nose)" />

      {/* Rosy cheeks */}
      <circle cx="24" cy="42" r="4" fill="#E8A0B0" opacity="0.3" />
      <circle cx="56" cy="42" r="4" fill="#E8A0B0" opacity="0.3" />

      {/* Front paws */}
      <ellipse cx="28" cy="60" rx="7" ry="4" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="52" cy="60" rx="7" ry="4" fill="#8B6F47" stroke="#4a3728" strokeWidth="1.5" />
      {/* Tiny claws */}
      <g stroke="#4a3728" strokeWidth="1" strokeLinecap="round">
        <line x1="23" y1="59" x2="21" y2="62" />
        <line x1="26" y1="60" x2="24" y2="63" />
        <line x1="29" y1="60" x2="28" y2="63" />
        <line x1="49" y1="60" x2="48" y2="63" />
        <line x1="52" y1="60" x2="53" y2="63" />
        <line x1="55" y1="59" x2="57" y2="62" />
      </g>
    </svg>
  );
}
```

**Step 2: Visually verify**

Import temporarily into a test page or the existing PopCritters to see it renders. Run dev server:

Run: `cd C:\Users\Shadow\Arthur && npm run dev`

Check in browser that the mole looks like a storybook illustration — soft, rounded, warm.

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Mole.jsx
git commit -m "feat(pop-critters): add hand-illustrated Mole SVG"
```

---

## Task 3: Hedgehog SVG Component

Second easy-mode animal. Rounded body covered in quills (pointed triangles on the back), big kind eyes, pink nose, tiny feet. Quill ruffle animation.

**Files:**
- Create: `src/games/pop-critters/animals/Hedgehog.jsx`

**Step 1: Create the Hedgehog SVG**

Same viewBox (80x80), same style as Mole. Key features:
- Round brown body with a lighter belly
- Fan of pointed quill shapes on the back/top (use a `<path>` with zigzag peaks)
- Big round dark eyes with highlights + blink animation
- Small pink nose, rosy cheeks
- Tiny dark feet at bottom
- Quills have a subtle `<animate>` that makes them slightly ruffle (scale pulse on the quill group)

```jsx
// src/games/pop-critters/animals/Hedgehog.jsx
export default function Hedgehog({ className = '' }) {
  // ... SVG implementation following Mole pattern
  // Use radialGradient for body (#A0785A -> #7A5A3A)
  // Quill colours: #5C4033 with lighter tips #8B6F47
  // Quill ruffle: <animateTransform type="scale" values="1,1;1.02,0.98;1,1" dur="3s" />
}
```

Build this with the same level of detail as the Mole — gradients, highlights, animations.

**Step 2: Visually verify** alongside Mole — consistent style and proportions.

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Hedgehog.jsx
git commit -m "feat(pop-critters): add hand-illustrated Hedgehog SVG"
```

---

## Task 4: Rabbit SVG Component

Medium-difficulty. Tall ears that appear first, then the head rises. Pink inner ears, buck teeth, twitchy nose.

**Files:**
- Create: `src/games/pop-critters/animals/Rabbit.jsx`

**Step 1: Create the Rabbit SVG**

Key features:
- Tall ears (the top ~30% of the viewBox) with pink inner gradient
- Round head, soft grey-brown fur gradient
- Big round eyes (slightly larger than mole — rabbits are alert)
- Small pink nose with `<animate>` twitch (oscillating translateY ±1px, fast)
- Two buck teeth below nose
- Whiskers (thin lines, 3 per side)
- Rosy cheeks
- Front paws visible at bottom

Ear wiggle animation: `<animateTransform>` on ear group, slight rotate ±3deg, alternating timing per ear.

**Step 2: Visually verify**

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Rabbit.jsx
git commit -m "feat(pop-critters): add hand-illustrated Rabbit SVG"
```

---

## Task 5: Mouse SVG Component

Medium-difficulty. Small, round, quick. Big round ears, long whiskers that twitch, thin tail.

**Files:**
- Create: `src/games/pop-critters/animals/Mouse.jsx`

**Step 1: Create the Mouse SVG**

Key features:
- Round body, light grey fur gradient
- Very large round ears (proportionally biggest ears of all animals)
- Small dark eyes with big highlights (cute, wide-eyed look)
- Tiny pink nose
- Long whiskers (3 per side) with `<animate>` twitch — rotate ±5deg on whisker group, duration 0.8s
- Thin curling tail visible behind body
- Rosy cheeks, tiny pink paws

**Step 2: Visually verify**

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Mouse.jsx
git commit -m "feat(pop-critters): add hand-illustrated Mouse SVG"
```

---

## Task 6: Fox SVG Component

Hard-difficulty. Pointy ears, orange-red fur, white chest/muzzle, sly eyes, bushy tail that swishes.

**Files:**
- Create: `src/games/pop-critters/animals/Fox.jsx`

**Step 1: Create the Fox SVG**

Key features:
- Pointed triangular ears with dark tips and cream inner
- Orange-red fur gradient (warm #D4622B → #B84A1B)
- White muzzle/chest area
- Slightly narrower, more angular eyes than the others (sly look) — still friendly, not scary
- Dark nose
- Bushy tail visible on one side with white tip — `<animate>` swish (rotate ±8deg, 2s)
- Rosy cheeks (more subtle than other animals)

**Step 2: Visually verify**

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Fox.jsx
git commit -m "feat(pop-critters): add hand-illustrated Fox SVG"
```

---

## Task 7: Owl SVG Component

Hard-difficulty. Round face, big front-facing eyes, feathered ear tufts, head-tilt animation.

**Files:**
- Create: `src/games/pop-critters/animals/Owl.jsx`

**Step 1: Create the Owl SVG**

Key features:
- Round face with facial disc (lighter concentric circles around eyes)
- VERY big round eyes (biggest of all animals) — amber/yellow iris with large black pupil
- Small curved beak
- Feathered ear tufts (pointed feather shapes on top)
- Brown/tawny feather pattern (use overlapping ellipses with varying brown tones)
- Head tilt animation: `<animateTransform type="rotate" values="0;-8;0;8;0" dur="5s" />`
- Blink animation on eyes

**Step 2: Visually verify**

**Step 3: Commit**

```bash
git add src/games/pop-critters/animals/Owl.jsx
git commit -m "feat(pop-critters): add hand-illustrated Owl SVG"
```

---

## Task 8: AnimalSprite Renderer

A component that takes an animal type string and renders the correct SVG component with rise/sink CSS transitions.

**Files:**
- Create: `src/games/pop-critters/AnimalSprite.jsx`

**Step 1: Create the AnimalSprite component**

```jsx
// src/games/pop-critters/AnimalSprite.jsx
import Mole from './animals/Mole';
import Hedgehog from './animals/Hedgehog';
import Rabbit from './animals/Rabbit';
import Mouse from './animals/Mouse';
import Fox from './animals/Fox';
import Owl from './animals/Owl';

const ANIMALS = { mole: Mole, hedgehog: Hedgehog, rabbit: Rabbit, mouse: Mouse, fox: Fox, owl: Owl };

/**
 * Renders the correct animal SVG with rise/sink animation.
 * @param {string} type - animal key ('mole', 'hedgehog', etc.)
 * @param {boolean} visible - whether the animal is currently up
 * @param {number} riseSpeed - transition duration in ms
 * @param {function} onTap - called when animal is tapped
 * @param {boolean} tapped - whether this animal was just tapped (triggers squish)
 */
export default function AnimalSprite({ type, visible, riseSpeed = 400, onTap, tapped }) {
  const Animal = ANIMALS[type];
  if (!Animal) return null;

  return (
    <div
      className="absolute inset-0 flex items-end justify-center pointer-events-none"
      style={{
        transform: visible ? 'translateY(0%)' : 'translateY(100%)',
        transition: `transform ${riseSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      <button
        onClick={onTap}
        disabled={!visible}
        className={`pointer-events-auto active:scale-90 transition-transform w-full h-full ${
          tapped ? 'animate-pop' : ''
        }`}
      >
        <Animal className="w-full h-full" />
      </button>
    </div>
  );
}
```

**Step 2: Verify file builds**

Run: `cd C:\Users\Shadow\Arthur && npx vite build 2>&1 | tail -3`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/games/pop-critters/AnimalSprite.jsx
git commit -m "feat(pop-critters): add AnimalSprite renderer with rise/sink transitions"
```

---

## Task 9: GardenScene SVG Background

The big one — a full illustrated garden scene. Follow the same structure as `MeadowScene.jsx` (which is 492 lines).

**Files:**
- Create: `src/components/scenes/GardenScene.jsx`

**Reference:** `src/components/scenes/MeadowScene.jsx` for exact SVG structure, gradient patterns, animation techniques, cloud styles, bee flight paths.

**Step 1: Create GardenScene**

ViewBox: `0 0 800 600` (same as MeadowScene). Layers:

1. **Sky** — reuse MeadowScene's sky gradient approach (warm blue → pale horizon)
2. **Sun** — top-right with rays (copy MeadowScene pattern, adjust position)
3. **Clouds** — 2-3 puffy clouds with drift animation (MeadowScene pattern)
4. **Birds** — 2-3 V-shapes with gentle flight animation
5. **Far hills** — rolling green hills with `<path>` curves (softer greens)
6. **Garden shed** — simple silhouette on far right hill (rectangle + triangle roof, warm brown)
7. **Wooden fence** — runs across the midground, simple picket fence shapes (vertical rectangles + horizontal rail)
8. **Flower beds** — left and right side, sunflowers (tall stem + yellow petals + brown centre) and tulips (coloured cups on stems)
9. **Garden path** — winding light-brown path through the middle (sandy/gravel colour)
10. **Foreground grass** — rich green with tufts (same technique as MeadowScene)
11. **Dirt holes** — 9 oval holes in a 3x3 grid area. Each hole is:
    - Dark brown oval (`#4A3220`) for the hole opening
    - Lighter brown dirt rim ellipse on top (`#6B5242`)
    - Small grass tufts around the rim edges
12. **Ambient bees** — 1-2 bees on flight paths (copy MeadowScene bee pattern)
13. **Butterfly** — gentle float animation (copy MeadowScene pattern, different colour)

The 9 holes should be positioned in the centre-lower area of the scene, roughly evenly spaced. They need `id` attributes so the game can position animal overlays on top.

**Important:** The scene is a *background* only — the actual animal sprites are HTML elements positioned over the holes with CSS. The scene provides the visual context.

**Step 2: Visually verify**

Run dev server and render GardenScene alone to check it looks like a lush garden.

**Step 3: Commit**

```bash
git add src/components/scenes/GardenScene.jsx
git commit -m "feat(pop-critters): add GardenScene SVG background"
```

---

## Task 10: DifficultyPicker Component

The pre-game screen where the child picks Gentle/Busy/Wild. Styled as wooden garden signs.

**Files:**
- Create: `src/games/pop-critters/DifficultyPicker.jsx`

**Step 1: Create the DifficultyPicker**

Three large buttons styled as wooden garden signs (think wooden planks with painted text). Each shows:
- The difficulty label ("Gentle Garden", "Busy Garden", "Wild Garden")
- A small decorative icon (the emoji from config is fine here since it's UI chrome, not a game character)
- Warm wood-colour background with rounded corners and subtle wood-grain feel (CSS gradient)

Use the GardenScene as background behind the picker for immersion.

```jsx
// src/games/pop-critters/DifficultyPicker.jsx
import { DIFFICULTIES } from './difficultyConfig';
import GardenScene from '../../components/scenes/GardenScene';

export default function DifficultyPicker({ onSelect }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-4xl font-heading text-white drop-shadow-lg">
          Pick Your Garden
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="px-6 py-5 rounded-2xl text-2xl font-heading text-amber-900
                         bg-gradient-to-b from-amber-200 to-amber-400
                         border-4 border-amber-600 shadow-lg
                         active:scale-95 transition-transform"
            >
              {diff.emoji} {diff.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Visually verify** — buttons should look like wooden signs on a garden background

**Step 3: Commit**

```bash
git add src/games/pop-critters/DifficultyPicker.jsx
git commit -m "feat(pop-critters): add DifficultyPicker with garden sign buttons"
```

---

## Task 11: Game Hole Component

A reusable component for a single dirt hole that holds an animal sprite. Uses overflow:hidden to mask the animal below the hole rim.

**Files:**
- Create: `src/games/pop-critters/GameHole.jsx`

**Step 1: Create GameHole**

```jsx
// src/games/pop-critters/GameHole.jsx
import AnimalSprite from './AnimalSprite';

/**
 * A single burrow hole. Contains the animal sprite with overflow:hidden
 * so the animal is hidden below ground until it rises.
 * The dirt rim SVG sits ON TOP of the animal (z-index) to create the
 * illusion of emerging from the ground.
 *
 * @param {object} critter - { id, type, visible, tapped } or null
 * @param {number} riseSpeed - ms
 * @param {function} onTap - fn(critterId)
 */
export default function GameHole({ critter, riseSpeed, onTap }) {
  return (
    <div className="relative w-24 h-28 sm:w-28 sm:h-32">
      {/* Animal container — clipped to hole area */}
      <div className="absolute inset-x-0 bottom-2 h-3/4 overflow-hidden rounded-b-full">
        {critter && (
          <AnimalSprite
            type={critter.type}
            visible={critter.visible}
            riseSpeed={riseSpeed}
            tapped={critter.tapped}
            onTap={() => onTap(critter.id)}
          />
        )}
      </div>

      {/* Dirt rim — sits on top of the animal */}
      <svg viewBox="0 0 100 30" className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-10">
        {/* Hole opening */}
        <ellipse cx="50" cy="18" rx="45" ry="12" fill="#3D2817" />
        {/* Dirt rim */}
        <ellipse cx="50" cy="15" rx="48" ry="10" fill="#6B5242" />
        <ellipse cx="50" cy="14" rx="46" ry="8" fill="#7A6352" />
        {/* Grass tufts on rim */}
        <path d="M8,14 Q10,6 12,14" fill="#3d9b3d" />
        <path d="M12,14 Q15,4 18,14" fill="#4ab84a" />
        <path d="M82,14 Q85,4 88,14" fill="#3d9b3d" />
        <path d="M86,14 Q89,6 92,14" fill="#4ab84a" />
      </svg>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/pop-critters/GameHole.jsx
git commit -m "feat(pop-critters): add GameHole with dirt rim and overflow masking"
```

---

## Task 12: Add Tailwind Keyframes

Add the new animations needed for the game to `tailwind.config.js`.

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Add new keyframes and animations**

Add to the `animation` object:
```js
'critter-rise': 'critterRise 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
'critter-sink': 'critterSink 0.4s ease-in',
'critter-squish': 'critterSquish 0.3s ease-out',
'hole-highlight': 'holeHighlight 0.5s ease-out',
```

Add to the `keyframes` object:
```js
critterRise: {
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0%)' },
},
critterSink: {
  '0%': { transform: 'translateY(0%)' },
  '100%': { transform: 'translateY(100%)' },
},
critterSquish: {
  '0%': { transform: 'scale(1, 1)' },
  '50%': { transform: 'scale(1.15, 0.85)' },
  '100%': { transform: 'scale(1, 1)' },
},
holeHighlight: {
  '0%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0.6)' },
  '100%': { boxShadow: '0 0 20px 10px rgba(250, 204, 21, 0)' },
},
```

**Step 2: Verify build**

Run: `cd C:\Users\Shadow\Arthur && npx vite build 2>&1 | tail -3`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(pop-critters): add critter rise/sink/squish keyframes"
```

---

## Task 13: Rewrite PopCritters Orchestrator

The main game component. Manages phases (pick-difficulty → playing), spawning logic, score, and renders the game board.

**Files:**
- Modify: `src/games/PopCritters.jsx` (full rewrite)

**Step 1: Rewrite PopCritters.jsx**

```jsx
// src/games/PopCritters.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import GardenScene from '../components/scenes/GardenScene';
import DifficultyPicker from './pop-critters/DifficultyPicker';
import GameHole from './pop-critters/GameHole';
import { DIFFICULTIES, ANIMAL_POINTS, GRID } from './pop-critters/difficultyConfig';
import { playPop, playSuccess, playBoing } from '../hooks/useSound';

let nextId = 0;

function randomAnimal(difficulty) {
  const pool = difficulty.animals;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomVisibleTime(difficulty) {
  const { min, max } = difficulty.visibleTime;
  return min + Math.random() * (max - min);
}

export default function PopCritters() {
  const [phase, setPhase] = useState('pick'); // 'pick' | 'playing'
  const [diffKey, setDiffKey] = useState(null);
  const [critters, setCritters] = useState([]); // [{ id, type, holeIndex, visible, tapped, spawnTime }]
  const [score, setScore] = useState(0);
  const timersRef = useRef([]);

  const difficulty = diffKey ? DIFFICULTIES[diffKey] : null;

  // Clean up all timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Spawn loop
  useEffect(() => {
    if (phase !== 'playing' || !difficulty) return;

    const spawn = () => {
      setCritters(prev => {
        const visibleCount = prev.filter(c => c.visible && !c.tapped).length;
        if (visibleCount >= difficulty.maxVisible) return prev;

        // Pick a free hole
        const usedHoles = new Set(prev.filter(c => c.visible).map(c => c.holeIndex));
        const freeHoles = Array.from({ length: GRID.total }, (_, i) => i).filter(i => !usedHoles.has(i));
        if (freeHoles.length === 0) return prev;

        const holeIndex = freeHoles[Math.floor(Math.random() * freeHoles.length)];
        const id = ++nextId;
        const type = randomAnimal(difficulty);
        const visTime = randomVisibleTime(difficulty);

        // Schedule auto-hide
        const timer = setTimeout(() => {
          setCritters(p => p.map(c => c.id === id ? { ...c, visible: false } : c));
        }, visTime + difficulty.riseSpeed); // add rise time
        timersRef.current.push(timer);

        return [...prev.filter(c => c.visible || Date.now() - c.spawnTime < 2000), {
          id, type, holeIndex, visible: true, tapped: false, spawnTime: Date.now(),
        }];
      });
    };

    spawn(); // spawn first immediately
    const iv = setInterval(spawn, difficulty.spawnInterval);
    return () => clearInterval(iv);
  }, [phase, difficulty]);

  const tap = useCallback((critterId) => {
    setCritters(prev => {
      const critter = prev.find(c => c.id === critterId);
      if (!critter || critter.tapped || !critter.visible) return prev;

      playPop();
      return prev.map(c =>
        c.id === critterId ? { ...c, tapped: true, visible: false } : c
      );
    });
    setScore(s => {
      const critter = critters.find(c => c.id === critterId);
      const points = critter ? (ANIMAL_POINTS[critter.type] || 1) : 1;
      const next = s + points;
      if (next % 5 === 0) playSuccess();
      return next;
    });
  }, [critters]);

  const startGame = useCallback((key) => {
    setDiffKey(key);
    setScore(0);
    setCritters([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('playing');
    playBoing();
  }, []);

  if (phase === 'pick') {
    return (
      <>
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GardenScene />
      <BackButton />

      {/* Score badge */}
      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                      text-2xl font-heading text-sun">
        ⭐ {score}
      </div>

      {/* Game grid — 3x3 holes overlaid on the scene */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div
          className="grid gap-3 sm:gap-5"
          style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)` }}
        >
          {Array.from({ length: GRID.total }, (_, i) => {
            const critter = critters.find(c => c.holeIndex === i && c.visible);
            return (
              <GameHole
                key={i}
                critter={critter || null}
                riseSpeed={difficulty.riseSpeed}
                onTap={tap}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Run the dev server and play-test all 3 difficulties**

Run: `cd C:\Users\Shadow\Arthur && npm run dev`

Verify:
- Difficulty picker shows with garden background
- Each difficulty spawns animals at the correct pace
- Tapping an animal plays sound and adds score
- Animals rise smoothly and sink after their visible time
- Score increments, success sound every 5 points
- Back button works

**Step 3: Commit**

```bash
git add src/games/PopCritters.jsx
git commit -m "feat(pop-critters): rewrite orchestrator with difficulty system and garden scene"
```

---

## Task 14: Fox Movement (Wild Mode)

In Wild difficulty, the fox can slide to an adjacent empty hole before hiding. This is a special behavior that makes fox harder to tap.

**Files:**
- Modify: `src/games/PopCritters.jsx` (add fox move logic to spawn effect)

**Step 1: Add fox movement logic**

After a fox spawns in Wild mode, schedule a secondary move after ~1s:
- Find an adjacent free hole (±1 column, ±1 row, only cardinal directions)
- Slide the fox to that hole (update `holeIndex`, the CSS transition handles the visual movement)
- Only move once per spawn

Add to the spawn effect, after creating a fox critter:

```js
if (type === 'fox' && difficulty.foxMoves) {
  const moveTimer = setTimeout(() => {
    setCritters(p => {
      const fox = p.find(c => c.id === id && c.visible && !c.tapped);
      if (!fox) return p;

      const { cols } = GRID;
      const row = Math.floor(fox.holeIndex / cols);
      const col = fox.holeIndex % cols;
      const adjacent = [];
      if (col > 0) adjacent.push(fox.holeIndex - 1);
      if (col < cols - 1) adjacent.push(fox.holeIndex + 1);
      if (row > 0) adjacent.push(fox.holeIndex - cols);
      if (row < GRID.rows - 1) adjacent.push(fox.holeIndex + cols);

      const usedHoles = new Set(p.filter(c => c.visible && c.id !== id).map(c => c.holeIndex));
      const freeAdjacent = adjacent.filter(h => !usedHoles.has(h));
      if (freeAdjacent.length === 0) return p;

      const newHole = freeAdjacent[Math.floor(Math.random() * freeAdjacent.length)];
      return p.map(c => c.id === id ? { ...c, holeIndex: newHole } : c);
    });
  }, 800 + Math.random() * 400);
  timersRef.current.push(moveTimer);
}
```

**Step 2: Play-test Wild mode** — verify fox moves to adjacent hole after appearing

**Step 3: Commit**

```bash
git add src/games/PopCritters.jsx
git commit -m "feat(pop-critters): add fox movement in Wild difficulty"
```

---

## Task 15: Final Polish & Build Verification

Final pass: visual polish, responsive sizing, build check.

**Files:**
- Modify: `src/games/PopCritters.jsx` (minor tweaks)
- Modify: `src/games/pop-critters/GameHole.jsx` (responsive sizing)

**Step 1: Responsive hole sizing**

Make sure holes scale well on iPad (the target device). Use `aspect-square` or viewport-relative sizing. Test at 1024x768 (iPad) and 375x667 (phone).

**Step 2: Full production build**

Run: `cd C:\Users\Shadow\Arthur && npm run build`
Expected: Build succeeds, no warnings

**Step 3: Play-test all 3 difficulties end to end**

Check:
- [ ] Gentle: 2 slow animals, plenty of time to tap
- [ ] Busy: 3 medium animals, moderate pace
- [ ] Wild: 4 fast animals, fox moves between holes
- [ ] Score works correctly (fox = 2 points)
- [ ] Sounds play (pop on tap, success every 5 points, boing on game start)
- [ ] Back button returns to game grid
- [ ] Animals look like storybook illustrations, not emoji
- [ ] Garden scene is lush and atmospheric
- [ ] Rise/sink animations are smooth

**Step 4: Commit**

```bash
git add -A
git commit -m "feat(pop-critters): polish and responsive sizing"
```

---

## Summary of Files

| File | Action | Task |
|------|--------|------|
| `src/games/pop-critters/difficultyConfig.js` | Create | 1 |
| `src/games/pop-critters/animals/Mole.jsx` | Create | 2 |
| `src/games/pop-critters/animals/Hedgehog.jsx` | Create | 3 |
| `src/games/pop-critters/animals/Rabbit.jsx` | Create | 4 |
| `src/games/pop-critters/animals/Mouse.jsx` | Create | 5 |
| `src/games/pop-critters/animals/Fox.jsx` | Create | 6 |
| `src/games/pop-critters/animals/Owl.jsx` | Create | 7 |
| `src/games/pop-critters/AnimalSprite.jsx` | Create | 8 |
| `src/components/scenes/GardenScene.jsx` | Create | 9 |
| `src/games/pop-critters/DifficultyPicker.jsx` | Create | 10 |
| `src/games/pop-critters/GameHole.jsx` | Create | 11 |
| `tailwind.config.js` | Modify | 12 |
| `src/games/PopCritters.jsx` | Rewrite | 13-14 |

**Total: 13 files, 15 tasks**
