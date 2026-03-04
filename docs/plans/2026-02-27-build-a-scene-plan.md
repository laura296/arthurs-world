# Build-a-Scene Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a felt-board sticker placement activity where Arthur picks a scene, drags stickers onto it, then taps "Make it Magic!" to animate everything.

**Architecture:** Single-page component (BuildAScene.jsx) orchestrating 4 sub-components (ScenePicker, StickerTray, SceneCanvas, AnimateMode). All state local via useState. DALL-E 3 assets generated at build time. Persistent state via localStorage.

**Tech Stack:** React 18, Tailwind CSS, Web Audio API, Vite, DALL-E 3 API, html2canvas (for save)

---

### Task 1: Scene Data & Sticker Definitions

**Files:**
- Create: `src/games/build-a-scene/sceneData.js`

**Step 1: Create the scene data file**

Define all 6 scenes with their 36 stickers each (6 hero, 24 standard, 6 secret). Each sticker needs: `id`, `label`, `tier` (hero/standard/secret), `category` (animal/character/vehicle/object/plant/food), `animate` (animation type + config), `sound` (sound function name).

Reference the design doc sticker tables at `docs/plans/2026-02-27-build-a-scene-design.md`. The user's original design document (pasted in conversation) has the complete sticker list for all 6 scenes with animate behaviours.

Structure:
```javascript
export const SCENES = {
  space: {
    id: 'space',
    label: 'Space',
    emoji: '🚀',
    bg: 'from-indigo-900 to-purple-950',
    bgImage: '/arthurs-world/images/scenes/space/bg.png',
    ambientNotes: 'Deep soft hum, cosmic tones, twinkle',
    stickers: [
      { id: 'rocket', label: 'Rocket', tier: 'hero', category: 'vehicle',
        animate: { type: 'float', duration: '3s', distance: '15px' },
        sound: 'whoosh' },
      // ... all 36 stickers
    ],
  },
  // ... all 6 scenes
};

export const SNAP_THRESHOLD = 15; // px — magnetic snap distance
export const TRAY_SIZE = 12;
export const HERO_MIN = 2;
export const ANIMAL_MIN = 5;
export const SECRET_CHANCE = 0.25; // 1-in-4 for Surprise Me

// Helper: build a random tray for a scene
export function buildTray(sceneId) { ... }

// Helper: get a surprise sticker (not in current tray)
export function getSurprise(sceneId, currentTrayIds, discoveredSecrets) { ... }
```

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`
Expected: Build passes (file is just data, no JSX)

**Step 3: Commit**

```bash
git add src/games/build-a-scene/sceneData.js
git commit -m "feat(build-a-scene): add scene data with 216 sticker definitions"
```

---

### Task 2: New Sound Functions

**Files:**
- Modify: `src/hooks/useSound.js`

**Step 1: Add playThud and playDrumroll**

```javascript
/** Thud — soft felt-on-felt placement sound */
export function playThud() {
  if (globalMuted) return;
  const ctx = getCtx();
  // Low-frequency thump with quick decay
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

/** Drumroll — anticipation build for animate mode (1.5s) */
export function playDrumroll() {
  if (globalMuted) return;
  const ctx = getCtx();
  // Series of rapid taps with rising pitch and volume
  for (let i = 0; i < 20; i++) {
    const t = ctx.currentTime + (i * 0.075);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 200 + (i * 15); // Rising pitch
    gain.gain.setValueAtTime(0.05 + (i * 0.015), t); // Rising volume
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  }
}

/** Sticker-specific sounds for Build-a-Scene animate mode */
export function playStickerSound(soundId) {
  if (globalMuted) return;
  const sounds = {
    moo:     () => { playTone(150, 0.4, 'sawtooth'); setTimeout(() => playTone(130, 0.5, 'sawtooth'), 400); },
    oink:    () => { playTone(400, 0.1, 'square'); setTimeout(() => playTone(350, 0.15, 'square'), 120); },
    baa:     () => { playTone(300, 0.3, 'sawtooth'); },
    cluck:   () => { [500, 450, 500].forEach((f, i) => setTimeout(() => playTone(f, 0.05, 'square'), i * 60)); },
    neigh:   () => { playTone(500, 0.1, 'sawtooth'); setTimeout(() => playTone(600, 0.2, 'sawtooth'), 100); },
    roar:    () => { playTone(100, 0.5, 'sawtooth'); },
    squawk:  () => { playTone(800, 0.08, 'square'); setTimeout(() => playTone(900, 0.1, 'square'), 100); },
    splash:  () => playPoof(),
    bubble:  () => playPop(),
    whoosh:  () => playWhoosh(),
    bleep:   () => playTone(880, 0.1, 'square'),
    crunch:  () => playSnap(),
    sting:   () => playSparkle(),
    ribbit:  () => { playTone(200, 0.05, 'square'); setTimeout(() => playTone(350, 0.08, 'square'), 80); },
    trumpet: () => { [300, 400, 500].forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'sawtooth'), i * 100)); },
    hiss:    () => playTone(2000, 0.3, 'sawtooth'),
    pop:     () => playPop(),
  };
  const fn = sounds[soundId] || sounds.pop;
  fn();
}
```

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`
Expected: Build passes

**Step 3: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat(build-a-scene): add thud, drumroll, and sticker sound functions"
```

---

### Task 3: Scene Picker Component

**Files:**
- Create: `src/games/build-a-scene/ScenePicker.jsx`

**Step 1: Build the scene picker**

A 2x3 grid of chunky rounded cards. Each card shows the scene's background image as a thumbnail with the scene name overlaid. Matches the style of SectionPicker.jsx (same grid layout, bounce-in animations, gradient cards).

Props: `onSelectScene(sceneId)` callback.

Reference: `src/pages/SectionPicker.jsx` for layout pattern.

Key details:
- Cards should use the DALL-E background as thumbnail (with fallback gradient if image not loaded)
- Bouncing entrance animations with staggered delays
- playBoing on tap
- Scene name + emoji overlay at bottom of card

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add src/games/build-a-scene/ScenePicker.jsx
git commit -m "feat(build-a-scene): add scene picker component"
```

---

### Task 4: Scene Canvas Component

**Files:**
- Create: `src/games/build-a-scene/SceneCanvas.jsx`

**Step 1: Build the canvas with drag/drop placement**

Full-screen component that shows the DALL-E scene background and renders placed stickers as absolute-positioned images. Handles pointer events for dragging stickers.

Props:
- `scene` — current scene config from sceneData
- `placedStickers` — array of placed sticker instances
- `onStickerPlace(stickerId, x, y)` — called when sticker dropped
- `onStickerRemove(uid)` — called on long press
- `onStickerTap(stickerId)` — called in animate mode to play sound
- `isAnimating` — boolean, when true stickers animate
- `dragSticker` — the sticker currently being dragged from tray (or null)

Key implementation:
- Background: `<img>` with `object-cover`, full viewport
- Placed stickers: absolute positioned divs with `left: x%`, `top: y%`, `transform: translate(-50%, -50%)`
- Sticker images: `<img>` tags loading from `/arthurs-world/images/scenes/{scene}/stickers/{id}.png`
- Drag: onPointerDown starts tracking, onPointerMove updates position, onPointerUp finalizes placement
- Long press detection: setTimeout(500ms) on pointerDown, clear on pointerMove (if moved > 10px)
- Magnetic snap: check distance to all placed stickers, nudge if within SNAP_THRESHOLD
- If dropped on top of another sticker, offset by 20px right and 10px down
- z-index: increment counter on each placement

Reference: `src/components/StoryBook.jsx` lines handling drag-to-target for pointer event patterns.

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add src/games/build-a-scene/SceneCanvas.jsx
git commit -m "feat(build-a-scene): add scene canvas with drag/drop placement"
```

---

### Task 5: Sticker Tray Component

**Files:**
- Create: `src/games/build-a-scene/StickerTray.jsx`

**Step 1: Build the sticker tray**

Bottom-anchored horizontal scrollable row of 12 sticker thumbnails + Surprise Me button + Reshuffle button.

Props:
- `trayStickers` — array of 12 sticker objects
- `onStickerSelect(sticker)` — called when tapping a sticker to place it
- `onSurprise()` — called when tapping Surprise Me
- `onReshuffle()` — called when tapping New Stickers
- `isAnimating` — when true, tray slides off-screen

Key implementation:
- Fixed bottom bar, ~100px tall, semi-transparent dark bg with backdrop-blur
- Horizontal scroll: `overflow-x-auto`, `flex`, `gap-2`, `no-scrollbar`
- Each sticker: 70x70px rounded card with the sticker PNG as thumbnail
- Surprise Me button: gold star icon, pulsing gently, positioned at right end
- Reshuffle button: small refresh icon above the tray
- Animate out: `transition-transform duration-300`, translate-y-full when isAnimating
- Secret sticker reveal: gold star badge overlay + longer bounce-in animation

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add src/games/build-a-scene/StickerTray.jsx
git commit -m "feat(build-a-scene): add sticker tray with surprise me"
```

---

### Task 6: Animate Mode Controller

**Files:**
- Create: `src/games/build-a-scene/AnimateMode.jsx`

**Step 1: Build the animate mode controller**

Handles the "Make it Magic!" button, the sparkle transition, and the animate/stop toggle.

This is mostly a UI overlay component:
- "Make it Magic!" button: fixed position, bottom-right corner (above tray), wand icon, pulsing glow animation, hidden during animate mode
- "Stop" button: appears during animate mode in same position, red, stop-sign icon
- Sparkle transition: when entering animate mode, render a full-screen overlay with ~30 sparkle particles that sweep left-to-right over 1.5s, then fade out

Props:
- `isAnimating` — current state
- `onStartAnimate()` — triggers the magic
- `onStopAnimate()` — returns to edit mode
- `placedCount` — number of placed stickers (disable button if 0)

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add src/games/build-a-scene/AnimateMode.jsx
git commit -m "feat(build-a-scene): add animate mode controller with sparkle transition"
```

---

### Task 7: Animation CSS Keyframes

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Add Build-a-Scene animation keyframes**

Add these to the existing `extend.keyframes` and `extend.animation` sections:

```javascript
// Keyframes
'scene-walk':    { '0%, 100%': { transform: 'translateX(0) translateY(0)' }, '50%': { transform: 'translateX(var(--walk-dist, 30px)) translateY(-5px)' } },
'scene-swim':    { '0%, 100%': { transform: 'translateX(0) rotate(0deg)' }, '50%': { transform: 'translateX(20px) rotate(3deg)' } },
'scene-fly':     { '0%, 100%': { transform: 'translateX(0) translateY(0)' }, '25%': { transform: 'translateX(15px) translateY(-20px)' }, '75%': { transform: 'translateX(-15px) translateY(-10px)' } },
'scene-bounce':  { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
'scene-scuttle': { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(8px)' }, '75%': { transform: 'translateX(-8px)' } },
'scene-flap':    { '0%, 100%': { transform: 'translateY(0) scaleY(1)' }, '50%': { transform: 'translateY(-10px) scaleY(0.95)' } },
'scene-pulse':   { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
'sparkle-sweep': { '0%': { transform: 'translateX(-100vw)', opacity: 1 }, '80%': { opacity: 1 }, '100%': { transform: 'translateX(100vw)', opacity: 0 } },
'magic-glow':    { '0%, 100%': { boxShadow: '0 0 10px #facc15, 0 0 20px #facc15' }, '50%': { boxShadow: '0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #facc15' } },

// Animations
'scene-walk':    'scene-walk 3s ease-in-out infinite',
'scene-swim':    'scene-swim 4s ease-in-out infinite',
'scene-fly':     'scene-fly 5s ease-in-out infinite',
'scene-bounce':  'scene-bounce 1.5s ease-in-out infinite',
'scene-scuttle': 'scene-scuttle 0.8s ease-in-out infinite',
'scene-flap':    'scene-flap 0.6s ease-in-out infinite',
'scene-pulse':   'scene-pulse 2s ease-in-out infinite',
'sparkle-sweep': 'sparkle-sweep 1.5s ease-out forwards',
'magic-glow':    'magic-glow 2s ease-in-out infinite',
```

Note: `scene-walk`, `scene-float` (reuse existing `float`), `scene-spin` (reuse existing `spin360`), and `scene-wobble` (reuse existing `wiggle`) can share existing keyframes where possible.

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(build-a-scene): add sticker animation keyframes"
```

---

### Task 8: Main Orchestrator Component

**Files:**
- Create: `src/games/BuildAScene.jsx`

**Step 1: Build the orchestrator**

This is the top-level component that manages all state and renders sub-components.

State management:
- `currentScene` — null (show picker) or scene ID (show canvas)
- `trayStickers` — built via `buildTray()` from sceneData
- `placedStickers` — array of { uid, stickerId, x, y, zIndex }
- `undoStack` — last 5 placements (for undo)
- `isAnimating` — toggle
- `discoveredSecrets` — Set, loaded from localStorage on mount
- `dragSticker` — sticker being dragged from tray (or null)
- `nextZ` — counter for z-index layering

Key logic:
- On mount: check localStorage for saved state, show "Keep building?" / "Start fresh?" if exists
- `handlePlace(stickerId, x, y)`: add to placedStickers, push to undoStack (cap at 5), increment nextZ, playThud
- `handleUndo()`: pop undoStack, remove from placedStickers, playPoof
- `handleRemove(uid)`: remove from placedStickers, playPoof
- `handleSurprise()`: call getSurprise(), check if secret (1-in-4), add to tray, play appropriate sound
- `handleReshuffle()`: call buildTray(), set new trayStickers (doesn't affect placed)
- `handleStartAnimate()`: playDrumroll, after 1.5s delay set isAnimating=true
- `handleStopAnimate()`: set isAnimating=false immediately
- `handleSave()`: use html2canvas to capture canvas as PNG, trigger download
- Auto-save: useEffect with beforeunload event to save state to localStorage
- On scene change: auto-save current scene, load saved state for new scene (or fresh)

Render:
```jsx
if (!currentScene) return <ScenePicker onSelectScene={setScene} />;
return (
  <div className="relative w-full h-full overflow-hidden">
    <BackButton onClick={handleBackToScenes} />
    <SceneCanvas ... />
    <StickerTray ... />
    <AnimateMode ... />
    {/* Undo button */}
    {/* Save button */}
  </div>
);
```

**Step 2: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 3: Commit**

```bash
git add src/games/BuildAScene.jsx
git commit -m "feat(build-a-scene): add main orchestrator component"
```

---

### Task 9: Wire Into App

**Files:**
- Modify: `src/data/games.js` — add build-a-scene entry
- Modify: `src/App.jsx` — add lazy import + route

**Step 1: Add to game registry**

In `src/data/games.js`, add to the Games section:
```javascript
{ id: 'build-a-scene', emoji: '🎭', title: 'Build a Scene', path: 'build-a-scene', category: 'games', bg: 'from-amber-400 to-orange-600' },
```

**Step 2: Add route to App.jsx**

Add lazy import:
```javascript
const BuildAScene = lazy(() => import('./games/BuildAScene'));
```

Add route:
```jsx
<Route path="/games/:mode/:section/build-a-scene" element={<MuteByMode><BuildAScene /></MuteByMode>} />
```

**Step 3: Verify build**

Run: `node node_modules/vite/bin/vite.js build`

**Step 4: Visual verification**

Start dev server, navigate to Games section, verify Build a Scene card appears, tap it, verify scene picker renders.

**Step 5: Commit**

```bash
git add src/data/games.js src/App.jsx
git commit -m "feat(build-a-scene): wire into app routing and game registry"
```

---

### Task 10: DALL-E 3 Asset Generation Script

**Files:**
- Create: `scripts/generate-scene-assets.mjs`

**Step 1: Write the generation script**

Similar structure to `scripts/generate-illustrations.mjs`. Two phases:

**Phase 1: Backgrounds** (6 images, 2048x1536 — use 1792x1024 which is DALL-E 3's max landscape, then we'll use CSS to cover)

Master style prompt from design doc. Each background:
```
[Master style], full scene background of [theme description], felt fabric texture overlay, no characters or animals, scene only, wide establishing shot
```

**Phase 2: Stickers** (216 images, 1024x1024 — DALL-E 3 square for stickers)

```
[Master style], single [sticker label], centred, plain white background, no scene behind it, facing slightly right, friendly expression, isolated on white
```

Note: DALL-E 3 can't do true transparent backgrounds. Stickers generate on white. Post-processing step needed to remove white bg (can use sharp/jimp in the script or manual editing).

Skip-if-exists logic (same as illustrations script). 12-second delay between API calls.

Output:
- `public/images/scenes/{sceneId}/bg.png`
- `public/images/scenes/{sceneId}/stickers/{stickerId}.png`

**Step 2: Verify script runs (dry run first few)**

Run: `OPENAI_API_KEY=... node scripts/generate-scene-assets.mjs`
Expected: First image generates, saves to correct path

**Step 3: Commit**

```bash
git add scripts/generate-scene-assets.mjs
git commit -m "feat(build-a-scene): add DALL-E 3 asset generation script"
```

---

### Task 11: Generate All Assets

**Step 1: Run the generation script**

Run in background with long timeout:
```bash
OPENAI_API_KEY=... node scripts/generate-scene-assets.mjs
```

This generates 222 images (6 backgrounds + 216 stickers). At ~25s per image = ~90 minutes.
Script has skip-if-exists, so can be restarted safely if it times out.

**Step 2: Post-process stickers (remove white backgrounds)**

Write a small post-processing script or use sharp to convert white backgrounds to transparent:
```bash
node scripts/remove-white-bg.mjs
```

**Step 3: Verify all assets exist**

```bash
for dir in public/images/scenes/*/; do
  scene=$(basename "$dir")
  bg=$(ls "$dir"bg.png 2>/dev/null | wc -l)
  stickers=$(ls "$dir"stickers/*.png 2>/dev/null | wc -l)
  echo "$scene: bg=$bg stickers=$stickers/36"
done
```

**Step 4: Commit assets**

```bash
git add public/images/scenes/
git commit -m "feat(build-a-scene): add DALL-E 3 generated scene assets"
```

---

### Task 12: ElevenLabs Voice Lines

**Files:**
- Modify: `scripts/generate-narration.mjs` or create new `scripts/generate-scene-audio.mjs`

**Step 1: Generate voice lines**

Lines needed:
- Scene picker: "Where shall we play today?", "Pick your world, Arthur!"
- First sticker: "Ooh, great choice!", "Look at that!", "You're doing it!"
- Magic button: "Ooooh, here we go...", "Ready? Let's make it magic!", "One... two... three... MAGIC!"
- Post-animate: "WOW! Look what you made!", "Amazing, Arthur!", "That's brilliant!"
- Secret reveal: "Ooooh, a secret one!"
- Save: "Let's save your masterpiece!"

Use Charlotte voice, eleven_turbo_v2_5 model (same as storybooks).

Output to `public/audio/scenes/` as individual MP3 files.

**Step 2: Commit**

```bash
git add public/audio/scenes/
git commit -m "feat(build-a-scene): add ElevenLabs voice lines"
```

---

### Task 13: Final Build & Visual Verification

**Step 1: Full build**

Run: `node node_modules/vite/bin/vite.js build`
Expected: Build passes, precache entries increase significantly (222 new images)

**Step 2: Visual verification via dev server**

- Start dev server
- Navigate: Home → All → Games → Build a Scene
- Verify scene picker shows 6 scenes with background thumbnails
- Tap a scene → verify canvas loads with background image
- Tap sticker in tray → verify it appears on canvas
- Drag sticker → verify position updates
- Long press sticker → verify removal
- Tap undo → verify last sticker removed
- Tap Surprise Me → verify new sticker appears
- Tap Make it Magic → verify drumroll, sparkle sweep, animations start
- Tap Stop → verify return to edit mode
- Tap Save → verify PNG downloads

**Step 3: Commit everything**

```bash
git add -A
git commit -m "feat(build-a-scene): complete Build-a-Scene activity"
```
