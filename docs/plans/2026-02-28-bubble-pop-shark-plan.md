# BubblePop Shark + Bad Bubbles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fun silly shark that eats bubbles and spiky bad bubbles that deduct points to BubblePop.

**Architecture:** Two new features layered into the existing BubblePop animation loop. Shark is state-managed like fish (spawn periodically, move in rAF loop, collision-detect against bubbles). Spiky bubbles are a new bubble type in `makeBubble` with distinct visuals and negative scoring.

**Tech Stack:** React, Tailwind CSS, Web Audio API (synth sounds), existing Shark SVG component.

---

### Task 1: Add `playChomp` and `playBuzz` sounds

**Files:**
- Modify: `src/hooks/useSound.js:228` (after the `playDrumroll` function, before sticker sounds)

**Step 1: Add playChomp — a funny gulp sound**

Add after `playDrumroll()` (line ~246):

```js
/** Chomp — funny shark gulp sound */
export function playChomp() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}
```

**Step 2: Add playBuzz — a descending wrong/negative sound**

Add right after `playChomp`:

```js
/** Buzz — descending wrong answer sound */
export function playBuzz() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}
```

**Step 3: Verify**

Run dev server, open BubblePop, check console for import errors.

**Step 4: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat(bubble-pop): add playChomp and playBuzz synth sounds"
```

---

### Task 2: Add spiky bubble type to `makeBubble`

**Files:**
- Modify: `src/games/BubblePop.jsx:10-30` (the `makeBubble` function)

**Step 1: Update spawn probabilities**

Change `makeBubble` to include spiky type. New probabilities:
- rainbow: >0.92 (8%) — unchanged
- golden: >0.82 (10%) — unchanged
- spiky: >0.70 (12%) — NEW
- normal: remaining (70%)

```js
function makeBubble(id, w, h) {
  const size = 50 + Math.random() * 50;
  const rand = Math.random();
  let type = 'normal';
  if (rand > 0.92) type = 'rainbow';
  else if (rand > 0.82) type = 'golden';
  else if (rand > 0.70) type = 'spiky';

  return {
    id,
    kind: 'bubble',
    x: size / 2 + Math.random() * (w - size),
    y: h + size,
    size: type === 'spiky' ? 45 + Math.random() * 35 : size,
    speed: type === 'spiky' ? 0.3 + Math.random() * 1.0 : 0.5 + Math.random() * 1.5,
    color: type === 'normal' ? COLORS[Math.floor(Math.random() * COLORS.length)] : null,
    wobblePhase: Math.random() * Math.PI * 2,
    type,
    spawnTime: Date.now(),
  };
}
```

Note: spiky bubbles are slightly smaller and slower so they're on screen longer — giving Arthur more chance to see and avoid them.

**Step 2: Verify**

No visual change yet (spiky bubbles will render as invisible until we add the component). Check console for errors.

**Step 3: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): add spiky bubble type to spawn logic"
```

---

### Task 3: Add `SpikyBubbleElement` visual component

**Files:**
- Modify: `src/games/BubblePop.jsx` — add spiky rendering inside `BubbleElement`

**Step 1: Add spiky case to BubbleElement**

Add a new `if` block at the top of `BubbleElement` (before the rainbow check at line 50):

```jsx
if (b.type === 'spiky') {
  const wobble = Math.sin(Date.now() * 0.005 + b.wobblePhase) * 3;
  return (
    <div
      onPointerDown={(e) => onPop(e, b)}
      className="absolute cursor-pointer active:scale-0 transition-transform duration-100"
      style={{
        left: b.x - b.size / 2,
        top: b.y - b.size / 2,
        width: b.size,
        height: b.size,
      }}
    >
      {/* Spiky shape using CSS clip-path */}
      <div
        className="w-full h-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #9333ea, #581c87)',
          clipPath: 'polygon(50% 0%, 63% 18%, 82% 8%, 78% 30%, 100% 35%, 85% 50%, 98% 68%, 78% 70%, 82% 92%, 63% 80%, 50% 100%, 37% 80%, 18% 92%, 22% 70%, 2% 68%, 15% 50%, 0% 35%, 22% 30%, 18% 8%, 37% 18%)',
          boxShadow: `0 0 ${b.size / 3}px #7c3aed80`,
          transform: `rotate(${wobble}deg)`,
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-white/80 drop-shadow"
              style={{ fontSize: b.size * 0.35 }}>
          &#10007;
        </span>
      </div>
    </div>
  );
}
```

**Step 2: Verify visually**

Open BubblePop — spiky purple star-shaped bubbles should appear ~12% of the time. They should float up and wobble.

**Step 3: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): add spiky bubble visual with purple clip-path star"
```

---

### Task 4: Handle spiky bubble popping with -1 score

**Files:**
- Modify: `src/games/BubblePop.jsx` — update `popBubble` callback and imports

**Step 1: Update imports**

Change line 4:
```js
import { playPop, playSuccess, playBoing, playTone, playBuzz } from '../hooks/useSound';
```

**Step 2: Update popBubble handler**

Replace the `popBubble` callback to handle spiky type:

```js
const popBubble = useCallback((e, bubble) => {
  e.preventDefault();
  const points = bubble.type === 'rainbow' ? 3
    : bubble.type === 'golden' ? 2
    : bubble.type === 'spiky' ? -1
    : 1;

  if (bubble.type === 'rainbow') {
    playSuccess();
  } else if (bubble.type === 'golden') {
    playBoing();
  } else if (bubble.type === 'spiky') {
    playBuzz();
  } else {
    playPop();
  }

  const effectId = nextEffectId.current++;
  setEffects(prev => [...prev, {
    id: effectId,
    x: bubble.x,
    y: bubble.y,
    color: bubble.type === 'spiky' ? '#7c3aed' : bubble.color,
    type: bubble.type,
  }]);
  setPopups(prev => [...prev, { id: effectId, x: bubble.x, y: bubble.y - 30, points }]);

  setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  setScore(s => {
    const next = Math.max(0, s + points);
    if (next % 10 === 0 && points === 1) playSuccess();
    return next;
  });
}, []);
```

**Step 3: Update ScorePopup to show negative in red**

Replace the `ScorePopup` component:

```jsx
function ScorePopup({ x, y, points }) {
  const isNegative = points < 0;
  return (
    <div
      className={`absolute pointer-events-none z-50 font-heading text-2xl drop-shadow-lg animate-bounce ${
        isNegative ? 'text-red-400' : 'text-sun'
      }`}
      style={{ left: x, top: y - 20 }}
    >
      {isNegative ? points : `+${points}`}
    </div>
  );
}
```

**Step 4: Update PopEffect for spiky type**

Inside the `PopEffect` component, add a spiky case before the particle array:

```jsx
{type === 'spiky' && (
  <span className="text-2xl">💥</span>
)}
```

**Step 5: Verify**

Pop a spiky bubble — should show "-1" in red, play buzz sound, score should decrease (but not below 0).

**Step 6: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): spiky bubbles deduct points with buzz sound and red popup"
```

---

### Task 5: Add shark state and spawning

**Files:**
- Modify: `src/games/BubblePop.jsx` — add shark state, spawn timer, import Shark + playChomp

**Step 1: Add imports**

Update the import from useSound (line 4) to also include `playChomp`:
```js
import { playPop, playSuccess, playBoing, playTone, playBuzz, playChomp } from '../hooks/useSound';
```

Add the Shark SVG import after line 3:
```js
import Shark from '../components/animals/Shark';
```

**Step 2: Add shark state**

Inside the `BubblePop` component, after the existing state declarations (around line 179):

```js
const [shark, setShark] = useState(null);
const sharkEatCount = useRef(0);
```

**Step 3: Add makeShark helper**

Add after the `makeFish` function (around line 47):

```js
function makeShark(w, h) {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -180 : w + 180,
    y: 80 + Math.random() * (h - 300),
    speed: (0.6 + Math.random() * 0.4) * (fromLeft ? 1 : -1),
    wobblePhase: Math.random() * Math.PI * 2,
    eatenCount: 0,
    maxEat: 2 + Math.floor(Math.random() * 2), // 2-3 bubbles per pass
  };
}
```

**Step 4: Add shark spawn timer**

After the fish spawn `useEffect` (around line 206):

```js
// Spawn shark periodically
useEffect(() => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const spawnShark = () => {
    setShark(prev => {
      if (prev) return prev; // only one at a time
      sharkEatCount.current = 0;
      return makeShark(w, h);
    });
  };
  // First shark after 10s, then every 8-12s
  const firstTimer = setTimeout(spawnShark, 10000);
  const interval = setInterval(spawnShark, 8000 + Math.random() * 4000);
  return () => { clearTimeout(firstTimer); clearInterval(interval); };
}, []);
```

**Step 5: Verify**

Shark state should exist but no visual yet. Console should be error-free.

**Step 6: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): add shark state, makeShark helper, and spawn timer"
```

---

### Task 6: Add shark to animation loop with bubble collision

**Files:**
- Modify: `src/games/BubblePop.jsx` — update the rAF animation loop

**Step 1: Add shark movement and collision inside the animation loop**

After the fish movement block (around line 243), add shark update:

```js
// Move shark and check for bubble eating
setShark(prev => {
  if (!prev) return null;
  const w = window.innerWidth;
  const newX = prev.x + prev.speed;
  const newY = prev.y + Math.sin(Date.now() * 0.002 + prev.wobblePhase) * 0.6;

  // Off screen? Remove
  if (prev.speed > 0 && newX > w + 200) return null;
  if (prev.speed < 0 && newX < -200) return null;

  return { ...prev, x: newX, y: newY };
});
```

**Step 2: Add shark-bubble collision detection**

This needs to run inside the animation loop but interact with both shark and bubble state. Add a separate effect for collision checking — after the animation loop useEffect:

```js
// Shark eats nearby bubbles
useEffect(() => {
  if (!shark) return;
  const CHOMP_RADIUS = 80;

  setBubbles(prev => {
    if (sharkEatCount.current >= (shark.maxEat || 3)) return prev;

    let ate = false;
    const remaining = prev.filter(b => {
      if (ate) return true; // only eat one per frame-batch
      if (b.type === 'spiky') return true; // shark avoids spiky bubbles!
      const dx = b.x - shark.x;
      const dy = b.y - shark.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CHOMP_RADIUS) {
        ate = true;
        sharkEatCount.current++;
        playChomp();

        // Add chomp effect
        const effectId = nextEffectId.current++;
        setEffects(prev => [...prev, {
          id: effectId,
          x: b.x,
          y: b.y,
          color: b.color || '#5a8aaf',
          type: 'chomp',
        }]);

        return false; // remove this bubble
      }
      return true;
    });
    return remaining;
  });
}, [shark?.x, shark?.y]);
```

**Step 3: Add chomp effect rendering in PopEffect**

Add a chomp case inside `PopEffect`:

```jsx
{type === 'chomp' && (
  <span className="text-3xl">😋</span>
)}
```

**Step 4: Verify**

Shark should eat bubbles when swimming near them. Should see chomp emoji effect and hear the chomp sound.

**Step 5: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): shark swims through animation loop and eats bubbles"
```

---

### Task 7: Add SharkElement visual and render in JSX

**Files:**
- Modify: `src/games/BubblePop.jsx` — add shark rendering component and JSX

**Step 1: Add SharkElement component**

Add after the `FishElement` component (around line 132):

```jsx
function SharkElement({ shark }) {
  const flipped = shark.speed < 0;
  return (
    <div
      className="absolute pointer-events-none transition-transform"
      style={{
        left: shark.x - 80,
        top: shark.y - 80,
        zIndex: 20,
        transform: flipped ? 'scaleX(-1)' : undefined,
      }}
    >
      <Shark size={160} />
    </div>
  );
}
```

**Step 2: Add shark to JSX render**

In the return statement, add after the fish map (around line 322):

```jsx
{/* Shark */}
{shark && <SharkElement shark={shark} />}
```

**Step 3: Verify visually**

The cute shark should swim across the screen every 8-12 seconds, eat 2-3 bubbles along the way, then disappear off the other side.

**Step 4: Commit**

```bash
git add src/games/BubblePop.jsx
git commit -m "feat(bubble-pop): render shark SVG swimming across the screen"
```

---

### Task 8: Polish and final integration

**Files:**
- Modify: `src/games/BubblePop.jsx` — minor polish

**Step 1: Ensure shark avoids eating rainbow/golden preferentially**

The collision already eats any non-spiky bubble. This is fine — the silly shark doesn't discriminate. No change needed.

**Step 2: Add subtle CSS animation to shark**

Update SharkElement to add a gentle bob:

```jsx
function SharkElement({ shark }) {
  const flipped = shark.speed < 0;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: shark.x - 80,
        top: shark.y - 80,
        zIndex: 20,
        transform: `${flipped ? 'scaleX(-1)' : ''} translateY(${Math.sin(Date.now() * 0.003) * 4}px)`,
      }}
    >
      <Shark size={160} />
    </div>
  );
}
```

**Step 3: Full play-through verification**

Test all these scenarios:
- Normal bubbles pop for +1
- Golden bubbles pop for +2
- Rainbow bubbles pop for +3
- Spiky bubbles pop for -1 (red text, buzz sound)
- Score never goes below 0
- Shark appears every 8-12 seconds
- Shark eats 2-3 bubbles per pass (not spiky ones)
- Shark chomp shows effect and plays sound
- Fish still work for +5
- No console errors

**Step 4: Final commit**

```bash
git add src/games/BubblePop.jsx src/hooks/useSound.js
git commit -m "feat(bubble-pop): polish shark animation and complete integration"
```
