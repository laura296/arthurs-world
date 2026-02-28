# Storybook Illustration & Interaction Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform The Elephant's Child from sepia emoji-book into a bright, tactile, watercolour-style interactive storybook with page-curl transitions and lift-the-flap interactions.

**Architecture:** Hybrid scene templates (reusable SVG backgrounds with character/mood/lighting props) + new StoryBook interaction types (flap-reveal, character-speak, scene-transform, peek-a-boo, collect) + CSS 3D page-curl transitions + paper texture overlay. Prototype one story (Elephant's Child, 10 pages), validate approach, then template to remaining 11 Just So stories.

**Tech Stack:** React + SVG (hand-drawn watercolour-style paths), CSS 3D transforms (page curl), Web Audio API (existing useSound.js pattern), Tailwind CSS (animations/keyframes).

**Design doc:** `docs/plans/2026-02-28-storybook-overhaul-design.md`

---

## Task 1: New Sound Effects for Tactile Interactions

Add new synthesised sounds to the existing `useSound.js` pattern. These support the tactile book feel.

**Files:**
- Modify: `src/hooks/useSound.js` (add 4 new sound functions after line 111)

**Step 1: Add paper/tactile sounds**

Add these functions after the existing `playSnap` function at line 111:

```javascript
/** Paper flap opening — soft thwp */
export function playFlap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.1);
}

/** Page turn — paper rustling */
export function playPageTurn() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.35);
}

/** Collect ping — satisfying ascending note */
export function playCollectPing() {
  playTone(1200, 0.1, 'sine');
  setTimeout(() => playTone(1600, 0.08, 'sine'), 50);
}

/** Splash — water interaction */
export function playSplash() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.25);
}
```

**Step 2: Update import in StoryBook.jsx**

Update the import at `src/components/StoryBook.jsx:3-6` to include new sounds:

```javascript
import {
  playTap, playSuccess, playBoing, playPop,
  playSparkle, playWhoosh, playPoof, playSnap,
  playFlap, playPageTurn, playCollectPing, playSplash,
} from '../hooks/useSound';
```

**Step 3: Verify sounds work**

Run: `npm run dev`
Open browser console, test: `import('/src/hooks/useSound.js').then(m => m.playFlap())`
Expected: soft paper thwp sound plays.

**Step 4: Commit**

```bash
git add src/hooks/useSound.js src/components/StoryBook.jsx
git commit -m "feat: add paper flap, page turn, collect, and splash sounds"
```

---

## Task 2: Tailwind Animations for Tactile & Page Curl

Add keyframes and animation utilities for page-curl, flap-lift, spring-bounce, speech-bubble, and press-in.

**Files:**
- Modify: `tailwind.config.js` — add new keyframes and animation entries in `theme.extend`

**Step 1: Add new animations**

Add these entries inside `theme.extend.animation` (after line 40):

```javascript
// Storybook tactile animations
'press-in': 'pressIn 0.1s ease-out',
'flap-open': 'flapOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
'flap-close': 'flapClose 0.3s ease-in forwards',
'speech-pop': 'speechPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
'spring-snap': 'springSnap 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
'collect-fly': 'collectFly 0.6s ease-in forwards',
'peek-reveal': 'peekReveal 0.4s ease-out',
'page-curl-out': 'pageCurlOut 0.6s ease-in-out forwards',
'page-curl-in': 'pageCurlIn 0.6s ease-in-out forwards',
'screen-shake': 'screenShake 0.4s ease-in-out',
```

Add these entries inside `theme.extend.keyframes` (after line 132):

```javascript
// Storybook tactile keyframes
pressIn: {
  '0%': { transform: 'scale(1)' },
  '100%': { transform: 'scale(0.95)' },
},
flapOpen: {
  '0%': { transform: 'perspective(600px) rotateX(0deg)', transformOrigin: 'top center' },
  '100%': { transform: 'perspective(600px) rotateX(-160deg)', transformOrigin: 'top center' },
},
flapClose: {
  '0%': { transform: 'perspective(600px) rotateX(-160deg)', transformOrigin: 'top center' },
  '100%': { transform: 'perspective(600px) rotateX(0deg)', transformOrigin: 'top center' },
},
speechPop: {
  '0%': { transform: 'scale(0) translateY(10px)', opacity: '0' },
  '60%': { transform: 'scale(1.1) translateY(-5px)', opacity: '1' },
  '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
},
springSnap: {
  '0%': { transform: 'scale(1)' },
  '30%': { transform: 'scale(1.15)' },
  '50%': { transform: 'scale(0.95)' },
  '70%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
},
collectFly: {
  '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
  '50%': { transform: 'translate(var(--fly-x), var(--fly-y)) scale(0.6)', opacity: '0.8' },
  '100%': { transform: 'translate(var(--fly-x), var(--fly-y)) scale(0.3)', opacity: '0' },
},
peekReveal: {
  '0%': { transform: 'scale(0.5) translateY(20px)', opacity: '0' },
  '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
},
pageCurlOut: {
  '0%': { transform: 'perspective(1200px) rotateY(0deg)', transformOrigin: 'left center' },
  '100%': { transform: 'perspective(1200px) rotateY(-90deg)', transformOrigin: 'left center' },
},
pageCurlIn: {
  '0%': { transform: 'perspective(1200px) rotateY(90deg)', transformOrigin: 'right center' },
  '100%': { transform: 'perspective(1200px) rotateY(0deg)', transformOrigin: 'right center' },
},
screenShake: {
  '0%, 100%': { transform: 'translate(0, 0)' },
  '10%': { transform: 'translate(-6px, -3px)' },
  '20%': { transform: 'translate(5px, 4px)' },
  '30%': { transform: 'translate(-4px, 2px)' },
  '40%': { transform: 'translate(3px, -5px)' },
  '50%': { transform: 'translate(-3px, 3px)' },
  '60%': { transform: 'translate(4px, -2px)' },
  '70%': { transform: 'translate(-2px, 4px)' },
  '80%': { transform: 'translate(2px, -3px)' },
  '90%': { transform: 'translate(-1px, 2px)' },
},
```

**Step 2: Verify Tailwind picks up new classes**

Run: `npm run dev`
Expected: dev server starts without errors. CSS classes available.

**Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add page-curl, flap, speech-bubble, and tactile animation keyframes"
```

---

## Task 3: Page-Curl Transition & Paper Texture in StoryBook Engine

Replace the fade/scale page transition with a 3D page-curl effect and add paper texture overlay.

**Files:**
- Modify: `src/components/StoryBook.jsx` — rewrite `turnPage`, page transition rendering, add paper texture

**Step 1: Add page-curl state and paper texture**

Replace the existing `turning` state and `turnPage` function (lines 448, 476-486) with a more sophisticated page-curl system. Also add a paper texture SVG filter and haptic feedback.

In the state declarations area (around line 448), replace:
```javascript
const [turning, setTurning] = useState(false);
```
with:
```javascript
const [turning, setTurning] = useState(false);
const [turnDir, setTurnDir] = useState(1); // 1 = forward, -1 = back
```

Replace the `turnPage` function (lines 476-486) with:
```javascript
const turnPage = useCallback((dir) => {
  if (turning) return;
  const next = page + dir;
  if (next < 0 || next >= story.pages.length) return;
  playPageTurn();
  setTurnDir(dir);
  setTurning(true);
  // Haptic feedback on mobile
  if (navigator.vibrate) navigator.vibrate(10);
  setTimeout(() => {
    setPage(next);
    setTurning(false);
  }, 600);
}, [page, turning, story.pages.length]);
```

**Step 2: Replace page transition rendering**

Replace the page content wrapper (lines 531-552) — the div with transition classes — with:

```jsx
{/* Page content with page-curl transition */}
<div
  className={`absolute inset-0 ${
    turning
      ? turnDir > 0 ? 'animate-page-curl-out' : 'animate-page-curl-out'
      : ''
  }`}
  style={{
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
  }}
>
  {/* Drop zone indicators */}
  {dropZones.map(dz => (
    <DropZone key={dz.id} zone={dz.zone} active />
  ))}

  {/* Interactive elements */}
  {(current.elements || []).map(el => (
    <InteractiveElement
      key={el.id}
      el={el}
      interactions={current.interactions || []}
      pageState={pageState}
      setPageState={setPageState}
      containerRef={containerRef}
    />
  ))}
</div>
```

**Step 3: Add paper texture overlay**

Add this SVG filter definition and overlay just inside the main container div (after line 513), before the background layer:

```jsx
{/* Paper texture overlay — subtle grain for tactile feel */}
<svg className="absolute inset-0 w-full h-full pointer-events-none z-[60]" style={{ mixBlendMode: 'multiply', opacity: 0.04 }}>
  <defs>
    <filter id="paper-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </defs>
  <rect width="100%" height="100%" filter="url(#paper-grain)" fill="#f5e6d0" />
</svg>
```

**Step 4: Add press-in tactile feedback to InteractiveElement**

In the `InteractiveElement` component, update the button's `onPointerDown` to add press-in effect. Add after the existing `onPointerDown` handler (around line 297):

Add a new state for press feedback:
```javascript
const [pressed, setPressed] = useState(false);
```

Update the button's className to include press state:
```javascript
${pressed && !isDraggable ? 'scale-95' : ''}
```

Add onPointerDown/Up handlers for non-draggable elements to show press-in:
```javascript
// In the button element, add:
onPointerDown={(e) => {
  if (isDraggable) {
    onPointerDown(e);
  } else {
    setPressed(true);
    if (navigator.vibrate) navigator.vibrate(8);
  }
}}
onPointerUp={() => { if (!isDraggable) setPressed(false); }}
onPointerLeave={() => { if (!isDraggable) setPressed(false); }}
```

**Step 5: Add raised shadow hint for interactive elements**

Update the InteractiveElement button's style to include a soft shadow when interactive:

```javascript
boxShadow: isInteractive ? '0 3px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)' : undefined,
```

**Step 6: Verify page-curl works**

Run: `npm run dev`
Navigate to any existing story. Press next arrow.
Expected: Page curls away with 3D perspective transform + paper rustling sound + haptic vibration on mobile.

**Step 7: Commit**

```bash
git add src/components/StoryBook.jsx
git commit -m "feat: add page-curl transition, paper texture overlay, and tactile press-in feedback"
```

---

## Task 4: New Interaction Types — Flap Reveal & Character Speak

Add the `flap-reveal` and `character-speak` interaction types to the StoryBook engine. These are the core new interaction patterns.

**Files:**
- Modify: `src/components/StoryBook.jsx` — add FlapReveal component, SpeechBubble component, and new interaction handlers

**Step 1: Create FlapReveal sub-component**

Add this new component after the `SparkleParticles` component (after line 103):

```jsx
// ─── Flap reveal — paper lift animation ─────────────────────────
function FlapReveal({ flapContent, revealContent, isOpen, onToggle }) {
  return (
    <div className="relative cursor-pointer" onClick={onToggle} style={{ perspective: '600px' }}>
      {/* Hidden content underneath */}
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {revealContent}
      </div>
      {/* Flap on top */}
      <div
        className={`absolute inset-0 ${isOpen ? 'animate-flap-open' : 'animate-flap-close'}`}
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          filter: isOpen ? undefined : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
        }}
      >
        {flapContent}
      </div>
    </div>
  );
}
```

**Step 2: Create SpeechBubble sub-component**

Add after the FlapReveal component:

```jsx
// ─── Speech bubble — bouncy pop-in ──────────────────────────────
function SpeechBubble({ text, visible }) {
  if (!visible) return null;
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-speech-pop">
      <div className="bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-amber-200/60
                      relative max-w-[180px] text-center">
        <p className="text-base font-body text-gray-800 leading-snug">{text}</p>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4
                        bg-white border-r-2 border-b-2 border-amber-200/60
                        rotate-45 -mb-1" />
      </div>
    </div>
  );
}
```

**Step 3: Add flap-reveal and character-speak to handleTap**

In the `handleTap` switch statement (inside InteractiveElement), add new cases before the `default:` case:

```javascript
case 'flap-reveal': {
  playFlap();
  if (navigator.vibrate) navigator.vibrate(10);
  setPageState(prev => ({
    ...prev,
    [el.id]: { ...prev[el.id], flapOpen: !(prev[el.id]?.flapOpen) },
  }));
  break;
}
case 'character-speak': {
  playBoing();
  speak(inter.data.say);
  setPageState(prev => ({
    ...prev,
    [el.id]: {
      ...prev[el.id],
      speaking: true,
      speechText: inter.data.say,
      animating: true,
    },
  }));
  setTimeout(() => {
    setPageState(prev => ({
      ...prev,
      [el.id]: { ...prev[el.id], animating: false },
    }));
  }, 600);
  // Hide speech bubble after 3 seconds
  setTimeout(() => {
    setPageState(prev => ({
      ...prev,
      [el.id]: { ...prev[el.id], speaking: false },
    }));
  }, 3000);
  break;
}
```

**Step 4: Render speech bubble in InteractiveElement**

In the InteractiveElement's return JSX (inside the button), add the SpeechBubble after SparkleParticles:

```jsx
<SpeechBubble text={state.speechText} visible={state.speaking} />
```

**Step 5: Update type documentation**

Update the JSDoc comment at the top of StoryBook.jsx to include new types:
```
'flap-reveal' | 'character-speak' | 'scene-transform' | 'peek-a-boo' | 'collect'
```

**Step 6: Verify new interactions work**

Run: `npm run dev`
Temporarily add a test element to any story with `type: 'character-speak'` and `data: { say: 'Hello!' }`.
Expected: Speech bubble pops up with bouncy animation + voice plays.

**Step 7: Commit**

```bash
git add src/components/StoryBook.jsx
git commit -m "feat: add flap-reveal and character-speak interaction types with speech bubbles"
```

---

## Task 5: New Interaction Types — Scene Transform, Peek-a-boo, Collect

Add the remaining 3 new interaction types.

**Files:**
- Modify: `src/components/StoryBook.jsx`

**Step 1: Add scene-transform, peek-a-boo, and collect handlers**

Add these cases to the handleTap switch in InteractiveElement:

```javascript
case 'scene-transform': {
  playSplash();
  setPageState(prev => ({
    ...prev,
    [el.id]: { ...prev[el.id], transformed: true },
    _sceneTransform: {
      ...(prev._sceneTransform || {}),
      [inter.data.transformId || el.id]: inter.data.value || true,
    },
  }));
  break;
}
case 'peek-a-boo': {
  playPop();
  setPageState(prev => ({
    ...prev,
    [el.id]: { ...prev[el.id], peeked: true },
  }));
  break;
}
case 'collect': {
  playCollectPing();
  const target = inter.data.target;
  const collectKey = `_collect_${target}`;
  const count = (pageState[collectKey]?.count || 0) + 1;
  const max = inter.data.max || 3;
  if (count >= max) {
    setTimeout(() => playSuccess(), 200);
  }
  setPageState(prev => ({
    ...prev,
    [el.id]: { ...prev[el.id], collected: true, collecting: true },
    [collectKey]: { count: Math.min(count, max) },
  }));
  // Fly animation then hide
  setTimeout(() => {
    setPageState(prev => ({
      ...prev,
      [el.id]: { ...prev[el.id], collecting: false, hidden: true },
    }));
  }, 600);
  break;
}
```

**Step 2: Add peek-a-boo rendering**

In the InteractiveElement render, add peek animation class:
```javascript
// In the animClass building block, add:
else if (state.peeked && !state.peekDone) animClass = 'animate-peek-reveal';
```

Add a timeout to mark peek as done (prevents re-animation):
```javascript
// In the peek-a-boo case, after setting peeked:
setTimeout(() => {
  setPageState(prev => ({
    ...prev,
    [el.id]: { ...prev[el.id], peekDone: true },
  }));
}, 400);
```

**Step 3: Add collect fly animation**

In the InteractiveElement render, add fly class for collecting items:
```javascript
else if (state.collecting) animClass = 'animate-collect-fly';
```

**Step 4: Pass scene transforms to scene component**

In the main StoryBook component, pass `_sceneTransform` state to the scene component. Replace the scene rendering line (around line 523):

```jsx
{current.scene && !current.image && (
  typeof current.scene.type === 'function'
    ? React.cloneElement(current.scene, { transforms: pageState._sceneTransform || {} })
    : current.scene
)}
```

Add `import React from 'react';` at the top if not already imported (React is needed for cloneElement but may already be in scope since JSX uses it).

**Step 5: Commit**

```bash
git add src/components/StoryBook.jsx
git commit -m "feat: add scene-transform, peek-a-boo, and collect interaction types"
```

---

## Task 6: SVG Characters — BabyElephant & MamaElephant

Create the first two SVG character components in watercolour storybook style. Follow the existing Pig.jsx pattern but with expression/pose props.

**Files:**
- Create: `src/components/animals/elephant-child/BabyElephant.jsx`
- Create: `src/components/animals/elephant-child/MamaElephant.jsx`

**Step 1: Create BabyElephant.jsx**

Style guide (matching Pig.jsx pattern):
- 220x220 viewBox, accepts `size` and `className` props
- Soft watercolour fills with gradient depth (NOT flat)
- Big round head, expressive eyes with sparkle highlights, blush cheeks
- Body colours: warm grey-blue (#8ba8b8 base, #a0bbc8 highlight, #7a97a7 shadow)
- Props: `noseLength` ('short' | 'long'), `expression` ('curious' | 'scared' | 'surprised' | 'happy' | 'proud')
- Nose length affects trunk path: short = stubby round nose, long = curving trunk
- Expression affects: eye shape (wide/squinty), mouth curve, eyebrow angle, ear position
- Include: ground shadow ellipse, rounded body, 4 chunky legs, floppy ears, tail tuft

Create `src/components/animals/elephant-child/BabyElephant.jsx` with the full SVG component. This is a creative SVG illustration task — use organic Bezier curves for a hand-painted feel. Reference the Pig.jsx structure (shadow → body → head → features) but with elephant proportions.

Key SVG elements:
- `<defs>` with gradients for body, belly highlight
- Ground shadow `<ellipse>`
- Body: large round `<path>` with soft curves
- Belly highlight: lighter inner `<ellipse>`
- 4 chunky legs with rounded feet
- Head: large circle with big forehead
- Ears: large floppy ear shapes (bigger than pig ears, elephant-style)
- Eyes: big round with dark pupil, white sparkle, blush underneath
- Trunk: key element — Bezier `<path>` whose control points change based on `noseLength`
- Tail: short `<path>` with tuft at end
- Blush cheeks: `<circle>` with low opacity pink

**Step 2: Create MamaElephant.jsx**

Same style but:
- Larger proportions (taller, wider stance)
- Always has long trunk
- Props: `expression` ('loving' | 'waving')
- Simpler — fewer expression variants than baby
- Slightly muted colours compared to baby (greyish-blue tones)

**Step 3: Verify rendering**

Temporarily render `<BabyElephant size={200} expression="curious" noseLength="short" />` in any page.
Expected: Cute watercolour baby elephant displays correctly.

**Step 4: Commit**

```bash
git add src/components/animals/elephant-child/
git commit -m "feat: add BabyElephant and MamaElephant SVG character components"
```

---

## Task 7: SVG Characters — Crocodile & Hippo

**Files:**
- Create: `src/components/animals/elephant-child/Crocodile.jsx`
- Create: `src/components/animals/elephant-child/Hippo.jsx`

**Step 1: Create Crocodile.jsx**

Style guide:
- 220x220 viewBox (or wider 280x180 for horizontal body)
- Colours: rich green (#5a8a5a base, #4a7a4a shadow, #7aaa7a belly)
- Props: `expression` ('sneaky' | 'biting' | 'fleeing'), `visibility` ('eyes-only' | 'half' | 'full')
- `visibility` controls how much is shown: 'eyes-only' = just two eyes and bumpy forehead above water line, 'half' = head and shoulders, 'full' = whole body
- Key features: bumpy back ridges, long snout with teeth, yellow-green eyes with slit pupils, short stubby legs
- Sneaky expression: half-closed eyes, slight grin
- Biting expression: wide open mouth, visible teeth
- Fleeing expression: small body, motion lines, scared eyes

**Step 2: Create Hippo.jsx**

Style guide:
- 220x220 viewBox
- Colours: warm purple-grey (#9a8a9a base, #b0a0b0 belly, #8a7a8a shadow)
- Props: `expression` ('friendly' | 'pointing')
- Big round body, small ears, wide mouth, stubby legs
- 'pointing' expression: one arm/leg extended toward right side

**Step 3: Verify both render correctly**

**Step 4: Commit**

```bash
git add src/components/animals/elephant-child/
git commit -m "feat: add Crocodile and Hippo SVG character components with expression variants"
```

---

## Task 8: SVG Scene — SavannaScene

Create the first environment scene with character integration.

**Files:**
- Create: `src/components/scenes/elephant-child/SavannaScene.jsx`

**Step 1: Build SavannaScene**

Structure (follow MeadowScene.jsx pattern):
- 800x600 SVG with `preserveAspectRatio="xMidYMax slice"`
- Accept props: `variant` ('home' | 'gathering' | 'celebration'), `timeOfDay` ('morning' | 'afternoon' | 'golden-hour'), `characters` (array of character config objects), `transforms` (from scene-transform interactions)

**Colour palette by timeOfDay:**
- morning: sky `#64b5f6` → `#bbdefb` → `#fff9c4`, warm golden light, green grass
- afternoon: sky `#42a5f5` → `#90caf9` → `#ffe0b2`, pink-tinged, amber light
- golden-hour: sky `#ff8a65` → `#ffcc80` → `#fff59d`, rich warm glow, deep green grass

**Environment elements:**
- Rolling hills (3 layers) with grass texture
- 2-3 acacia trees (flat-top African style) with warm brown trunks
- Scattered wildflowers (bright pinks, yellows, purples)
- Animated grass tufts (swaying, 2.5s loop)
- Drifting clouds (2-3, slow translate animation)
- Birds in distance (V-shapes)
- Butterflies (1-2, curved flight paths)
- Sun with rays (positioned based on timeOfDay)

**Variant differences:**
- 'home': warm, cosy. More flowers, fewer trees.
- 'gathering': wider composition, space for multiple characters. More trees framing edges.
- 'celebration': extra sparkle particles overlay, rainbow arc in sky, warm golden tint on everything.

**Character rendering:**
- `characters` prop is array like: `[{ component: BabyElephant, x: 50, y: 60, size: 120, props: { expression: 'curious', noseLength: 'short' } }]`
- Render each character as `<foreignObject>` inside the SVG at the specified position
- Characters sit ON the nearest ground layer based on y position

**Animations (built-in SVG animate):**
- Grass tufts: `<animateTransform type="rotate">`
- Clouds: `<animateTransform type="translate">`
- Butterflies: `<animateMotion path="...">` with wing flap
- Sun rays: `<animate attributeName="opacity">`

**Step 2: Verify SavannaScene renders**

Render `<SavannaScene variant="home" timeOfDay="morning" characters={[]} />` in a test.
Expected: Golden grassland with acacia trees, swaying grass, drifting clouds.

**Step 3: Commit**

```bash
git add src/components/scenes/elephant-child/
git commit -m "feat: add SavannaScene with variant/timeOfDay/character props"
```

---

## Task 9: SVG Scene — RiverbankScene

The most complex scene — used for 4 pages with dramatic mood shifts.

**Files:**
- Create: `src/components/scenes/elephant-child/RiverbankScene.jsx`

**Step 1: Build RiverbankScene**

Props: `mood` ('peaceful' | 'tense' | 'dramatic' | 'action'), `waterLevel` ('calm' | 'splashing'), `characters`, `transforms`

**Colour palette by mood:**
- peaceful: sky `#81d4fa` → `#b3e5fc`, water `#4fc3f7` → `#29b6f6`, lush greens `#66bb6a`
- tense: sky `#4db6ac` → `#80cbc4`, water `#00897b` → `#00695c`, deep greens `#2e7d32`, shadows
- dramatic: sky `#ff7043` → `#ff8a65`, water `#455a64` → `#37474f`, dark with red-orange splashes
- action: sky `#ef5350` → `#ff8a65`, water churning with splash effects, bright impact highlights

**Environment elements:**
- Flowing river (wide blue band across middle, gradient fills)
- Animated water ripples (`<animate>` on ripple paths)
- Reeds on riverbanks (swaying, green/brown)
- Lily pads (2-3, green ovals with subtle pink flower)
- Dragonflies (tiny, darting flight paths)
- Overhanging tropical plants (large leaves framing top)
- Riverbank (sandy brown on both sides)
- Background: distant tropical trees

**Mood-specific elements:**
- peaceful: dragonflies active, sparkle dots on water, bright sky
- tense: dragonflies gone, shadows deepen, water darkens
- dramatic: splash particles, impact stars SVG, screen tint shifts warmer
- action: water splashing (animated splash shapes), effort lines, dynamic composition

**waterLevel effects:**
- calm: smooth water path with gentle ripple animation
- splashing: additional splash droplet shapes animating up from water surface

**Step 2: Verify all 4 mood variants render distinctly**

**Step 3: Commit**

```bash
git add src/components/scenes/elephant-child/RiverbankScene.jsx
git commit -m "feat: add RiverbankScene with mood-responsive colour shifts and water animations"
```

---

## Task 10: SVG Scenes — WaterholeScene & ClearingScene

**Files:**
- Create: `src/components/scenes/elephant-child/WaterholeScene.jsx`
- Create: `src/components/scenes/elephant-child/ClearingScene.jsx`

**Step 1: Build WaterholeScene**

Simpler scene — one page only (page 3, departure).

- Shady waterhole/pool surrounded by overhanging trees
- Dappled light patches (animated opacity)
- Still water with reflection hints
- Dusty path leading away to the right (toward adventure)
- Warm afternoon light (amber tones)
- Accepts `characters` and `transforms` props

**Step 2: Build ClearingScene**

Magical forest clearing for discovery/joy (pages 8-9).

Props: `mood` ('wonder' | 'discovery' | 'magical')

- Sunlight streaming through tree canopy (god-rays effect via gradient)
- Small waterfall on one side
- Abundant wildflowers (bright pinks, purples, yellows)
- Butterflies, sparkle particles
- mood 'wonder': bright, surprised lighting. Blue sky visible.
- mood 'discovery': dappled golden light, rich greens, magical shimmer
- mood 'magical': extra sparkle particles, rainbow light refractions

**Step 3: Verify both render**

**Step 4: Commit**

```bash
git add src/components/scenes/elephant-child/
git commit -m "feat: add WaterholeScene and ClearingScene for Elephant's Child story"
```

---

## Task 11: Rewrite ElephantChild.jsx — Pages 1-5

Replace the old emoji + sepia-image story data with new SVG scenes and interactions.

**Files:**
- Modify: `src/stories/ElephantChild.jsx` — complete rewrite

**Step 1: Update imports**

Replace the current imports with:
```javascript
import React from 'react';
import StoryBook from '../components/StoryBook';
import SavannaScene from '../components/scenes/elephant-child/SavannaScene';
import WaterholeScene from '../components/scenes/elephant-child/WaterholeScene';
import RiverbankScene from '../components/scenes/elephant-child/RiverbankScene';
import ClearingScene from '../components/scenes/elephant-child/ClearingScene';
```

**Step 2: Write pages 1-5**

Each page uses the new scene components with specific props, and new interaction types. Remove all `image:` properties. Replace emoji `content` with meaningful labels or SVG component references.

Key design per page (from design doc):
- Page 1: SavannaScene(home, morning) — baby elephant curious, butterfly flap-reveal
- Page 2: SavannaScene(gathering, afternoon) — animals gathered, character-speak for each
- Page 3: WaterholeScene — hippo departure, footprint scene-transform
- Page 4: RiverbankScene(peaceful) — crocodile peek-a-boo, reed flap-reveal
- Page 5: RiverbankScene(tense) — whisper speech, scene darkening transform

Use the new interaction types:
- `character-speak` instead of `tap-sound`
- `flap-reveal` for hidden animals under bushes/reeds
- `peek-a-boo` for crocodile emerging from water
- `scene-transform` for footprints appearing, scene darkening

**Step 3: Commit**

```bash
git add src/stories/ElephantChild.jsx
git commit -m "feat: rewrite Elephant's Child pages 1-5 with watercolour scenes and new interactions"
```

---

## Task 12: Rewrite ElephantChild.jsx — Pages 6-10

**Files:**
- Modify: `src/stories/ElephantChild.jsx` — add pages 6-10

**Step 1: Write pages 6-10**

Key design per page:
- Page 6: RiverbankScene(dramatic) — SNAP! screen-shake, splash scene-transform
- Page 7: RiverbankScene(action) — tug-of-war, nose stretch counting mechanic
- Page 8: ClearingScene(wonder) — POP! relief, trunk wobble, croc fleeing
- Page 9: ClearingScene(discovery) — collect fruit, tap water fountain, hug flower
- Page 10: SavannaScene(celebration, golden-hour) — all elephants dance, sparkles

Use interactions:
- Page 6: `scene-transform` for screen shake + splash, `character-speak` for "Let go!"
- Page 7: `tap-count` enhanced for visible nose stretching
- Page 8: spring-snap animation on trunk, `character-speak`
- Page 9: `collect` (drag fruit to elephant), `scene-transform` (water fountain), `tap-sparkle`
- Page 10: `character-speak` for "The End!", `tap-sparkle` celebration, `tap-animate` for dancing

**Step 2: Verify the complete 10-page story works end-to-end**

Run: `npm run dev`
Navigate to The Elephant's Child story.
Expected:
- 10 unique page illustrations (no repeated visuals)
- Page curl transitions between pages
- Tap characters → speech bubbles pop up with voice
- Flap reveals work (tap bush → lifts revealing hidden animal)
- Scene transforms work (tap water → ripples spread)
- Collect mechanics work (drag fruit → flies to elephant)
- Paper texture visible throughout
- Sounds play appropriately

**Step 3: Commit**

```bash
git add src/stories/ElephantChild.jsx
git commit -m "feat: complete Elephant's Child rewrite with all 10 pages, new interactions, and watercolour scenes"
```

---

## Task 13: Final Polish & Review

**Files:**
- All modified files

**Step 1: Test on mobile viewport**

Resize browser to mobile dimensions (375x812).
Check:
- Scenes scale correctly
- Touch interactions work (flap, drag, speech)
- Page curl looks good on small screen
- Text is readable
- No overflow issues

**Step 2: Test all interaction types end-to-end**

Walk through all 10 pages testing every interactive element.
Verify: sounds play, animations complete, state resets between pages.

**Step 3: Test navigation edge cases**

- Rapid page turning (shouldn't break)
- First page: no back arrow
- Last page: restart button works
- Swipe gestures work both directions

**Step 4: Clean up any unused imports or dead code**

Remove any unused interaction type handlers if we're no longer using them in this story (but keep them — other stories still use emoji-based interactions).

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Elephant's Child storybook overhaul — watercolour scenes, tactile interactions, page curl"
```

---

## Summary of All Files Changed

**New files (12):**
- `src/components/scenes/elephant-child/SavannaScene.jsx`
- `src/components/scenes/elephant-child/WaterholeScene.jsx`
- `src/components/scenes/elephant-child/RiverbankScene.jsx`
- `src/components/scenes/elephant-child/ClearingScene.jsx`
- `src/components/animals/elephant-child/BabyElephant.jsx`
- `src/components/animals/elephant-child/MamaElephant.jsx`
- `src/components/animals/elephant-child/Crocodile.jsx`
- `src/components/animals/elephant-child/Hippo.jsx`

**Modified files (4):**
- `src/hooks/useSound.js` — 4 new sound functions
- `src/components/StoryBook.jsx` — page curl, paper texture, 5 new interaction types, tactile feedback
- `src/stories/ElephantChild.jsx` — complete rewrite with new scenes/interactions
- `tailwind.config.js` — new keyframes and animations

**Unchanged:**
- All other story files (they still work with the existing emoji system)
- All existing scene components
- All existing animal components
