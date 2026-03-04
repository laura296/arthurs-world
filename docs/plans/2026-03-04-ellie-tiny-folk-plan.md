# Ellie & the Tiny Folk Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 4-chapter interactive storybook game with AI-generated illustrations and tap-based mini-games.

**Architecture:** Standalone module under `src/stories/ellie/`. Screen flow state machine orchestrates linear progression: Loading → Title → (Story → Game) x4 → Celebration. AI images generated via gpt-image-1 at runtime, cached in IndexedDB. Reuses existing shared primitives (useCelebration, useParticleBurst, sound functions).

**Tech Stack:** React 18, Vite, Tailwind CSS, Web Audio API, OpenAI gpt-image-1, IndexedDB

**Design doc:** `docs/plans/2026-03-04-ellie-tiny-folk-design.md`

---

### Task 1: IndexedDB Image Cache

**Files:**
- Create: `src/lib/imageCache.js`

**Step 1: Create the image cache module**

This provides `getImage`, `putImage`, `hasAllImages`, `clearVersion` — all async. Uses a single IndexedDB database `arthur-images` with one object store `ellie-images`.

```js
// src/lib/imageCache.js

const DB_NAME = 'arthur-images';
const STORE_NAME = 'ellie-images';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putImage(key, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getImage(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function hasAllImages(keys) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    let found = 0;
    keys.forEach(key => {
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result) found++;
        if (found === keys.length) resolve(true);
      };
    });
    tx.oncomplete = () => resolve(found === keys.length);
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearVersion(prefix) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        if (typeof cursor.key === 'string' && cursor.key.startsWith(prefix)) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Convert a cached blob to an object URL for use in <img> tags */
export function blobToUrl(blob) {
  return blob ? URL.createObjectURL(blob) : null;
}
```

**Step 2: Verify module loads**

Run: `npm run dev`
Open browser console, import the module, confirm no errors.

**Step 3: Commit**

```bash
git add src/lib/imageCache.js
git commit -m "feat(ellie): add IndexedDB image cache module"
```

---

### Task 2: Story Data — Prompts, Narration, Chapter Structure

**Files:**
- Create: `src/stories/ellie/storyData.js`

**Step 1: Create the story data file**

This contains ALL prompts from the spec (character sheet, 8 scene prompts, 16 sprite prompts), narration text, and the screen flow sequence.

```js
// src/stories/ellie/storyData.js

export const VERSION = 'ellie-v1';

// ── Style anchors (from spec Section 4) ──

export const STYLE_ANCHOR = 'Whimsical mid-century American children\'s picture book style. Bold black ink outlines. Flat saturated colours. No gradients. Wobbly imperfect curved lines. Impossible tall wiggly trees. Striped or patterned sky. Expressive cartoon faces. No text. No letters. No words.';

export const ELLIE_ANCHOR = 'Ellie the lavender-purple elephant with large round kind eyes, a warm smile, a gently upward-curling trunk, rounded chubby body, large ears with pink inner ear, and a small tuft of hair on her head.';

// ── Character Sheet Prompt (spec Section 3.2 — exact) ──

export const CHARACTER_SHEET_PROMPT = 'A single character design sheet of an original cartoon elephant character named Ellie. She is lavender-purple with slightly darker purple outlines. Large round kind eyes with long eyelashes and a warm expression. Rounded chubby body proportions — she is gentle and soft-looking, not fierce. Her trunk curls upward at the tip in a friendly way. Large round ears with a soft pink inner ear. Short stubby legs. A small tuft of light hair on the top of her head. She stands facing three-quarters toward the viewer, smiling warmly. Clean white background. The art style is a mid-century American children\'s picture book: bold black ink outlines, flat saturated colours, no gradients, slightly wobbly imperfect lines, expressive and charming. No text. No words. No labels.';

// ── Scene Prompts (spec Section 4) ──

export const SCENE_PROMPTS = [
  // Scene 1 — Ellie Hears the Speck
  `${ELLIE_ANCHOR} stands in a magical jungle, looking surprised and delighted. She holds a large glowing pink flower in her curled trunk. A tiny golden speck of light floats in the air right in front of her eye. Tall wobbly striped trees and enormous round leaves surround her. Warm morning sky with horizontal orange and yellow stripes. ${STYLE_ANCHOR}`,
  // Scene 2 — The Animals Want the Flower
  `${ELLIE_ANCHOR} protectively cradles a glowing pink flower against her chest, looking brave and determined. Surrounding her are grumpy cartoon animals: a kangaroo with arms crossed and a scowl, a bossy eagle with ruffled feathers, a cheeky monkey pointing and laughing. Sunset orange and red striped sky. Tall wobbly jungle trees. ${STYLE_ANCHOR}`,
  // Scene 3 — Make Noise!
  `${ELLIE_ANCHOR} stands with one large ear tilted forward, straining to listen, her eyes closed in concentration. In the foreground, microscopic tiny colourful people stand on a giant pink flower petal, shouting upward with arms waving and mouths wide open. Curvy sound wave lines radiate upward. Deep purple and indigo striped sky with large cartoon stars. ${STYLE_ANCHOR}`,
  // Scene 4 — They Hear Us!
  `${ELLIE_ANCHOR} smiling with closed eyes and rosy cheeks, holding a pink flower aloft in joy. Tiny colourful people — a wizard in a tall hat, a queen with a crown, a baby, a chef, a musician — dance and wave on the flower petals around her. Warm golden sunrise sky with yellow and cream stripes. Confetti and stars fill the air. ${STYLE_ANCHOR}`,
];

// ── Game Background Prompts (spec Section 4) ──

export const GAME_BG_PROMPTS = [
  // Game 1 Background — Open Sky
  `A wide open blue sky with horizontal white cloud stripes and fluffy impossible cloud shapes. At the bottom, rolling bright green hills with tiny wobbly trees. A single small glowing golden speck of light floats in the centre of the blue sky. Lots of open space. No characters. ${STYLE_ANCHOR}`,
  // Game 2 Background — Jungle Clearing
  `A sunny jungle clearing with a large glowing pink flower on a long stem in the centre. Soft green ground with round hills. Blue and white striped sky. Tall wiggly colourful trees at the edges with plenty of open space between them. No characters — space for animals to appear from the edges. ${STYLE_ANCHOR}`,
  // Game 3 Background — Night Sky
  `A deep purple night sky filled with large cartoon stars and swirling sound wave lines radiating across the entire scene. A large lavender elephant ear at the right edge, straining forward to listen. A tiny glowing flower in the lower centre. Magical glowing atmosphere. No full characters — just the ear at edge. ${STYLE_ANCHOR}`,
  // Game 4 Background — The Giant Flower
  `A giant magical pink flower fills the lower two-thirds of the scene against a bright happy green background with blue and yellow striped sky. The flower has many large open petals, each with a tiny glowing doorway or hiding spot in it. Joyful celebratory atmosphere. Floating stars and sparkles. No characters — space in the petals for the Tiny Folk to appear. ${STYLE_ANCHOR}`,
];

// ── Animal Sprite Prompts (for Game 2: Shoo the Animals) ──

export const ANIMAL_NAMES = ['kangaroo', 'eagle', 'monkey', 'parrot', 'snake', 'lizard', 'frog', 'toucan'];

export const ANIMAL_SPRITE_PROMPTS = [
  `A grumpy cartoon kangaroo with arms crossed and a scowl, looking bossy and sceptical. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A bossy cartoon eagle with ruffled feathers, puffed-up chest, and an annoyed expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A cheeky cartoon monkey pointing and laughing, mischievous expression, swinging tail. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon parrot with a big beak, squawking with wings spread, looking indignant. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A silly cartoon snake coiled up with a smirk, tongue sticking out playfully. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A small cartoon lizard with big eyes, looking curious and a bit sneaky, bright green with spots. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A round cartoon frog with big bulging eyes and a wide grin, sitting on its haunches. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon toucan with an enormous bright beak, looking proud and silly. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── Tiny Folk Sprite Prompts (for Game 4: Pop the Tiny Folk) ──

export const FOLK_NAMES = ['wizard', 'queen', 'baby', 'chef', 'musician', 'knight', 'painter', 'dancer'];

export const FOLK_SPRITE_PROMPTS = [
  `A tiny cartoon wizard in a tall pointy hat with stars, holding a magic wand, cheerful expression, long robe. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon queen with a golden crown, flowing robe, waving regally with a warm smile. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon baby with a nappy, big round eyes, giggling with arms up, rosy cheeks. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon chef with a tall white hat, holding a wooden spoon, jolly round face. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon musician playing a trumpet, cheeks puffed out, musical notes around. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon knight in shining armour with a small shield and sword, friendly face visible through helmet. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon painter with a beret, holding a paintbrush and palette, splashes of colour on apron. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon dancer in a flowing dress, mid-twirl with arms outstretched, joyful expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── Narration Text (spec Section 2) ──

export const CHAPTERS = [
  {
    title: 'Ellie Hears Something',
    narration: '"On a warm sunny morning, Ellie the Elephant was splashing in the jungle pool — when she heard something tiny. A little voice, on a little speck, floating past on the breeze..."',
    sceneKey: `${VERSION}-scene-1`,
    gameBgKey: `${VERSION}-game-bg-1`,
    gameTitle: 'Find the Speck',
  },
  {
    title: 'Ellie Protects the Flower',
    narration: '"I hear you!" said Ellie, catching the speck on a flower. "I\'ll keep you safe!" But the other animals didn\'t believe her — and they wanted to take the flower away! "Shoo!" said Ellie. "Leave my friends alone!"',
    sceneKey: `${VERSION}-scene-2`,
    gameBgKey: `${VERSION}-game-bg-2`,
    gameTitle: 'Shoo the Animals',
  },
  {
    title: 'Make Some Noise!',
    narration: '"The animals still didn\'t believe! "Unless we make enough noise," said the tiniest one, "no one will know we\'re here! Everyone — make the BIGGEST noise you can!""',
    sceneKey: `${VERSION}-scene-3`,
    gameBgKey: `${VERSION}-game-bg-3`,
    gameTitle: 'Noise Meter',
  },
  {
    title: 'They Hear Us!',
    narration: '"And Ellie heard them all! The Tiny Folk came dancing out — waving and spinning and singing hello! "A person\'s a person, no matter how small," smiled Ellie. "I hear every one of you!""',
    sceneKey: `${VERSION}-scene-4`,
    gameBgKey: `${VERSION}-game-bg-4`,
    gameTitle: 'Pop the Tiny Folk',
  },
];

// ── Screen Sequence ──

export const SCREENS = [
  { type: 'story', chapter: 0 },
  { type: 'game',  chapter: 0 },
  { type: 'story', chapter: 1 },
  { type: 'game',  chapter: 1 },
  { type: 'story', chapter: 2 },
  { type: 'game',  chapter: 2 },
  { type: 'story', chapter: 3 },
  { type: 'game',  chapter: 3 },
];

// ── All image keys (for cache checks) ──

export function getAllImageKeys() {
  const keys = [`${VERSION}-character-sheet`];
  for (let i = 1; i <= 4; i++) {
    keys.push(`${VERSION}-scene-${i}`);
    keys.push(`${VERSION}-game-bg-${i}`);
  }
  ANIMAL_NAMES.forEach(name => keys.push(`${VERSION}-animal-${name}`));
  FOLK_NAMES.forEach(name => keys.push(`${VERSION}-folk-${name}`));
  return keys;
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/storyData.js
git commit -m "feat(ellie): add story data with prompts and chapter structure"
```

---

### Task 3: Image Generation Module

**Files:**
- Create: `src/lib/imageGen.js`
- Create: `.env.local` (not committed — add to .gitignore if not already)

**Step 1: Create .env.local with the API key**

```
VITE_OPENAI_API_KEY=your-key-here
```

**Step 2: Create the image generation module**

This calls OpenAI gpt-image-1 for character sheet, scenes (with reference), and sprites. Returns blobs. Has retry logic.

```js
// src/lib/imageGen.js

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/images';

async function apiCall(url, body, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/** Generate a single image and return as Blob */
export async function generateImage(prompt) {
  const data = await apiCall(`${API_URL}/generations`, {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1536x1024',
    quality: 'high',
  });
  // gpt-image-1 returns b64_json by default
  const b64 = data.data[0].b64_json;
  if (b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'image/png' });
  }
  // Fallback: if URL returned, fetch it
  const url = data.data[0].url;
  if (url) {
    const imgRes = await fetch(url);
    return await imgRes.blob();
  }
  throw new Error('No image data in response');
}

/** Generate an image using a reference image (for character consistency) */
export async function generateWithReference(referenceBlob, prompt) {
  // gpt-image-1 images.edit accepts multipart/form-data with image reference
  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('image[]', referenceBlob, 'reference.png');
  formData.append('prompt', prompt);
  formData.append('size', '1536x1024');
  formData.append('quality', 'high');

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch(`${API_URL}/edits`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const b64 = data.data[0].b64_json;
      if (b64) {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: 'image/png' });
      }
      const url = data.data[0].url;
      if (url) {
        const imgRes = await fetch(url);
        return await imgRes.blob();
      }
      throw new Error('No image data in response');
    } catch (e) {
      if (attempt === 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/** Check if the API key is configured */
export function hasApiKey() {
  return !!API_KEY;
}
```

**Step 3: Commit**

```bash
git add src/lib/imageGen.js
git commit -m "feat(ellie): add OpenAI gpt-image-1 generation module"
```

> **Note:** Do NOT commit `.env.local`. Add it to `.gitignore` if needed.

---

### Task 4: New Sound Functions

**Files:**
- Modify: `src/hooks/useSound.js`

**Step 1: Add playShoo and playBang after the existing playSplash function**

Add these two functions after line 189 (after `playSplash`), before the `playNote` function:

```js
/** Shoo — low sawtooth buzz for shooing animals away */
export function playShoo() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 200;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Bang — random low percussive hit for noise meter */
export function playBang() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 120 + Math.random() * 80;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}
```

**Step 2: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat(ellie): add playShoo and playBang sound functions"
```

---

### Task 5: Tailwind Animations for Ellie

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Add Ellie-specific animations and keyframes**

Add to the `animation` object (after the existing premium polish section, around line 78):

```js
// Ellie storybook animations
'ellie-float': 'ellieFloat 3s ease-in-out infinite',
'ellie-glow': 'ellieGlow 2s ease-in-out infinite',
'ellie-drift-in': 'ellieDriftIn 2s ease-out forwards',
'ellie-shoo-away': 'ellieShooAway 0.6s ease-in forwards',
'ellie-bob': 'ellieBob 2s ease-in-out infinite',
'ellie-ripple': 'ellieRipple 0.6s ease-out forwards',
'ellie-meter-pulse': 'ellieMeterPulse 0.3s ease-out',
'ellie-spin-away': 'ellieSpinAway 0.5s ease-in forwards',
'ellie-fade-in': 'ellieFadeIn 0.8s ease-out',
```

Add to the `keyframes` object:

```js
// Ellie storybook keyframes
ellieFloat: {
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-12px)' },
},
ellieGlow: {
  '0%, 100%': { boxShadow: '0 0 15px #facc15, 0 0 30px #facc15' },
  '50%': { boxShadow: '0 0 25px #facc15, 0 0 50px #facc15, 0 0 70px #facc15' },
},
ellieDriftIn: {
  '0%': { transform: 'translate(var(--drift-x), var(--drift-y)) scale(0.8)', opacity: '0' },
  '100%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
},
ellieShooAway: {
  '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
  '50%': { transform: 'rotate(180deg) scale(1.2)', opacity: '0.8' },
  '100%': { transform: 'rotate(360deg) scale(0) translateY(-100px)', opacity: '0' },
},
ellieBob: {
  '0%, 100%': { transform: 'translateY(0) scale(1)' },
  '50%': { transform: 'translateY(-8px) scale(1.03)' },
},
ellieRipple: {
  '0%': { transform: 'scale(0.3)', opacity: '0.8', borderWidth: '4px' },
  '100%': { transform: 'scale(3)', opacity: '0', borderWidth: '1px' },
},
ellieMeterPulse: {
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
},
ellieSpinAway: {
  '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
  '100%': { transform: 'rotate(720deg) scale(0)', opacity: '0' },
},
ellieFadeIn: {
  '0%': { opacity: '0', transform: 'translateY(20px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' },
},
```

**Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(ellie): add Tailwind animations for storybook games"
```

---

### Task 6: Loading Screen

**Files:**
- Create: `src/stories/ellie/LoadingScreen.jsx`

**Step 1: Create the loading screen component**

Shows progress as images generate. Displays the character sheet once it's done (image 1 of 25). Friendly error message with retry.

```jsx
// src/stories/ellie/LoadingScreen.jsx
import { useState, useEffect, useRef } from 'react';
import { generateImage, generateWithReference, hasApiKey } from '../../lib/imageGen';
import { putImage, getImage, hasAllImages, blobToUrl } from '../../lib/imageCache';
import {
  VERSION, CHARACTER_SHEET_PROMPT, SCENE_PROMPTS, GAME_BG_PROMPTS,
  ANIMAL_NAMES, ANIMAL_SPRITE_PROMPTS, FOLK_NAMES, FOLK_SPRITE_PROMPTS,
  getAllImageKeys,
} from './storyData';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [charSheetUrl, setCharSheetUrl] = useState(null);
  const running = useRef(false);

  async function generate() {
    if (running.current) return;
    running.current = true;
    setError(null);

    try {
      const allKeys = getAllImageKeys();
      setTotal(allKeys.length);

      // Check if already cached
      const cached = await hasAllImages(allKeys);
      if (cached) {
        setProgress(allKeys.length);
        onComplete();
        return;
      }

      let completed = 0;
      const update = () => { completed++; setProgress(completed); };

      // 1. Character sheet
      const csKey = `${VERSION}-character-sheet`;
      let charSheet = await getImage(csKey);
      if (!charSheet) {
        charSheet = await generateImage(CHARACTER_SHEET_PROMPT);
        await putImage(csKey, charSheet);
      }
      update();
      setCharSheetUrl(blobToUrl(charSheet));

      // 2. Scene images (with reference)
      for (let i = 0; i < SCENE_PROMPTS.length; i++) {
        const key = `${VERSION}-scene-${i + 1}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateWithReference(charSheet, SCENE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 3. Game backgrounds (no reference needed — no Ellie in them)
      for (let i = 0; i < GAME_BG_PROMPTS.length; i++) {
        const key = `${VERSION}-game-bg-${i + 1}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(GAME_BG_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 4. Animal sprites
      for (let i = 0; i < ANIMAL_SPRITE_PROMPTS.length; i++) {
        const key = `${VERSION}-animal-${ANIMAL_NAMES[i]}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(ANIMAL_SPRITE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 5. Tiny Folk sprites
      for (let i = 0; i < FOLK_SPRITE_PROMPTS.length; i++) {
        const key = `${VERSION}-folk-${FOLK_NAMES[i]}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(FOLK_SPRITE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      onComplete();
    } catch (e) {
      setError(e.message);
      running.current = false;
    }
  }

  useEffect(() => { generate(); }, []);

  if (!hasApiKey()) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4 p-8">
        <span className="text-6xl">🐘</span>
        <p className="text-xl font-heading text-sun text-center">
          Ellie needs a drawing key!
        </p>
        <p className="text-sm font-body text-white/60 text-center max-w-xs">
          Set VITE_OPENAI_API_KEY in your .env.local file and restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      {/* Character sheet preview (once generated) */}
      {charSheetUrl && (
        <img
          src={charSheetUrl}
          alt="Ellie"
          className="w-48 h-auto rounded-2xl shadow-xl border-2 border-sun/30 animate-ellie-fade-in"
        />
      )}

      {!charSheetUrl && (
        <span className="text-7xl animate-float">🐘</span>
      )}

      <h2 className="text-2xl font-heading text-sun text-center">
        Drawing the pictures...
      </h2>

      {/* Progress bar */}
      {total > 0 && (
        <div className="w-64 max-w-full">
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-sun rounded-full transition-all duration-500"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <p className="text-sm font-body text-white/60 text-center mt-2">
            {progress} of {total}
          </p>
        </div>
      )}

      {/* Progress dots */}
      {total > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < progress ? 'bg-sun scale-100' : 'bg-white/20 scale-75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center">
          <p className="text-lg font-body text-red-300 mb-3">
            Couldn't draw the pictures right now
          </p>
          <p className="text-sm font-body text-white/50 mb-4 max-w-xs">
            {error}
          </p>
          <button
            onClick={() => { running.current = false; generate(); }}
            className="px-6 py-3 bg-sun text-night font-heading rounded-full shadow-lg
                       active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/LoadingScreen.jsx
git commit -m "feat(ellie): add loading screen with image generation progress"
```

---

### Task 7: Title Screen

**Files:**
- Create: `src/stories/ellie/TitleScreen.jsx`

**Step 1: Create the title screen**

Simple: Ellie title, character sheet image as hero, "Play" button.

```jsx
// src/stories/ellie/TitleScreen.jsx
import { useState, useEffect } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { VERSION } from './storyData';
import { playTone } from '../../hooks/useSound';

export default function TitleScreen({ onStart }) {
  const [heroUrl, setHeroUrl] = useState(null);

  useEffect(() => {
    getImage(`${VERSION}-character-sheet`).then(blob => {
      if (blob) setHeroUrl(blobToUrl(blob));
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-night gap-6 p-8">
      {/* Stars */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle text-yellow-200"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            fontSize: `${8 + Math.random() * 12}px`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        >
          *
        </div>
      ))}

      {/* Hero image */}
      {heroUrl ? (
        <img
          src={heroUrl}
          alt="Ellie the Elephant"
          className="w-56 h-auto rounded-3xl shadow-2xl border-3 border-sun/30 animate-ellie-fade-in"
        />
      ) : (
        <span className="text-8xl animate-float">🐘</span>
      )}

      {/* Title */}
      <div className="text-center animate-ellie-fade-in" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-4xl font-heading text-sun drop-shadow-lg">
          Ellie & the Tiny Folk
        </h1>
        <p className="text-lg font-body text-purple-200/70 mt-1">
          An interactive story
        </p>
      </div>

      {/* Play button */}
      <button
        onClick={() => { playTone(523, 0.2, 'triangle'); onStart(); }}
        className="mt-4 px-10 py-4 bg-sun text-night text-2xl font-heading rounded-full
                   shadow-xl shadow-yellow-400/30 active:scale-95 transition-transform
                   animate-bounce"
        style={{ animationDelay: '0.6s' }}
      >
        Play
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/TitleScreen.jsx
git commit -m "feat(ellie): add title screen with hero image"
```

---

### Task 8: Story Screen

**Files:**
- Create: `src/stories/ellie/StoryScreen.jsx`

**Step 1: Create the story narration screen**

Full-bleed AI image background. Gold-bordered text band at bottom. Play button to advance to game. Auto-narration via Web Speech API.

```jsx
// src/stories/ellie/StoryScreen.jsx
import { useState, useEffect } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { CHAPTERS } from './storyData';
import { playPageTurn } from '../../hooks/useSound';

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.1;
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

export default function StoryScreen({ chapter, onAdvance }) {
  const [bgUrl, setBgUrl] = useState(null);
  const data = CHAPTERS[chapter];

  useEffect(() => {
    getImage(data.sceneKey).then(blob => {
      if (blob) setBgUrl(blobToUrl(blob));
    });
  }, [data.sceneKey]);

  // Auto-narrate on mount
  useEffect(() => {
    const timer = setTimeout(() => speakText(data.narration), 600);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [data.narration]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Full-bleed background image */}
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-ellie-fade-in"
          draggable={false}
        />
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-indigo-900" />
      )}

      {/* Chapter title */}
      <div className="absolute top-6 left-0 right-0 z-20 text-center">
        <span className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-1.5
                         text-sm font-heading text-sun/90">
          Chapter {chapter + 1}: {data.title}
        </span>
      </div>

      {/* Narration text band */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="mx-4 mb-20 bg-white/85 backdrop-blur-md rounded-3xl p-5 shadow-xl
                        border-2 border-amber-300/60 pointer-events-auto animate-ellie-fade-in"
             style={{ animationDelay: '0.4s' }}>
          <p className="text-xl font-body text-gray-800 leading-relaxed text-center">
            {data.narration}
          </p>
          {/* Read aloud button */}
          <button
            onClick={() => speakText(data.narration)}
            className="absolute -top-4 right-4 w-10 h-10 rounded-full bg-sun shadow-lg
                       flex items-center justify-center text-xl active:scale-90 transition-transform"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Play game button */}
      <div className="absolute bottom-4 right-6 z-30">
        <button
          onClick={() => { playPageTurn(); onAdvance(); }}
          className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                     shadow-xl active:scale-95 transition-transform animate-bounce"
        >
          Play! ▶
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/StoryScreen.jsx
git commit -m "feat(ellie): add story narration screen with AI background"
```

---

### Task 9: Game Screen Wrapper

**Files:**
- Create: `src/stories/ellie/GameScreen.jsx`

**Step 1: Create the game wrapper component**

Provides: background image, progress indicator (dots), completion trigger. Renders the game component in a slot.

```jsx
// src/stories/ellie/GameScreen.jsx
import { useState, useEffect, useCallback } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { CHAPTERS } from './storyData';
import { useCelebration } from '../../components/CelebrationOverlay';
import { useParticleBurst } from '../../components/ParticleBurst';
import { playSuccess } from '../../hooks/useSound';

export default function GameScreen({ chapter, GameComponent, onComplete }) {
  const [bgUrl, setBgUrl] = useState(null);
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();
  const [done, setDone] = useState(false);
  const data = CHAPTERS[chapter];

  useEffect(() => {
    getImage(data.gameBgKey).then(blob => {
      if (blob) setBgUrl(blobToUrl(blob));
    });
  }, [data.gameBgKey]);

  const handleComplete = useCallback(() => {
    if (done) return;
    setDone(true);
    playSuccess();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    burst(cx, cy, {
      count: 16,
      spread: 100,
      colors: ['#facc15', '#ec4899', '#38bdf8', '#a78bfa'],
      shapes: ['star', 'heart', 'circle'],
    });
    celebrate({ message: 'Well done!' });
    setTimeout(() => onComplete(), 3500);
  }, [done, burst, celebrate, onComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-800 to-purple-900" />
      )}

      {/* Game title */}
      <div className="absolute top-4 left-0 right-0 z-20 text-center">
        <span className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-1.5
                         text-sm font-heading text-sun/90">
          {data.gameTitle}
        </span>
      </div>

      {/* Game component */}
      <div className="absolute inset-0 z-10">
        <GameComponent onComplete={handleComplete} burst={burst} />
      </div>

      <CelebrationLayer />
      <ParticleLayer />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/GameScreen.jsx
git commit -m "feat(ellie): add game screen wrapper with progress and celebration"
```

---

### Task 10: Game 1 — Find the Speck

**Files:**
- Create: `src/stories/ellie/games/FindTheSpeck.jsx`

**Step 1: Create the Find the Speck game**

Golden orb floats on screen. Tap = jump to new position. 6 taps to complete.

```jsx
// src/stories/ellie/games/FindTheSpeck.jsx
import { useState, useCallback } from 'react';
import { playPop, playTone } from '../../../hooks/useSound';

const TARGET_TAPS = 6;

function randomPos() {
  return {
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 60,
  };
}

export default function FindTheSpeck({ onComplete, burst }) {
  const [pos, setPos] = useState(randomPos);
  const [taps, setTaps] = useState(0);

  const handleTap = useCallback((e) => {
    e.stopPropagation();
    const next = taps + 1;
    const freq = 400 + (next / TARGET_TAPS) * 500;
    playTone(freq, 0.15, 'sine');
    playPop();

    // Particle burst at speck location
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 8,
      spread: 50,
      colors: ['#facc15', '#fbbf24', '#f59e0b'],
      shapes: ['star', 'circle'],
    });

    setTaps(next);

    if (next >= TARGET_TAPS) {
      onComplete();
    } else {
      setPos(randomPos());
    }
  }, [taps, onComplete, burst]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_TAPS }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i < taps ? 'bg-sun scale-110 shadow-lg shadow-yellow-400/50' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* The golden speck */}
      <button
        onClick={handleTap}
        className="absolute w-16 h-16 rounded-full animate-ellie-float
                   active:scale-90 transition-transform z-20"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #facc15 0%, #f59e0b 40%, transparent 70%)',
          boxShadow: '0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #f59e0b',
        }}
      />

      {/* Hint text */}
      {taps === 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap the golden speck!
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/games/FindTheSpeck.jsx
git commit -m "feat(ellie): add Find the Speck mini-game"
```

---

### Task 11: Game 2 — Shoo the Animals

**Files:**
- Create: `src/stories/ellie/games/ShooAnimals.jsx`

**Step 1: Create the Shoo Animals game**

AI-generated animal sprites drift in from edges. Tap to shoo (spin + vanish). 8 animals.

```jsx
// src/stories/ellie/games/ShooAnimals.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { getImage, blobToUrl } from '../../../lib/imageCache';
import { VERSION, ANIMAL_NAMES } from '../storyData';
import { playShoo, playTone } from '../../../hooks/useSound';

const TARGET_SHOOS = 8;
const SPAWN_INTERVAL = 1500;

const EDGES = ['left', 'right', 'top', 'bottom'];

function randomEdge() {
  const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
  let x, y;
  switch (edge) {
    case 'left':   x = -10; y = 20 + Math.random() * 50; break;
    case 'right':  x = 100; y = 20 + Math.random() * 50; break;
    case 'top':    x = 15 + Math.random() * 70; y = -10; break;
    case 'bottom': x = 15 + Math.random() * 70; y = 100; break;
  }
  // Target position (where the animal drifts toward)
  const targetX = 20 + Math.random() * 60;
  const targetY = 25 + Math.random() * 40;
  return { startX: x, startY: y, targetX, targetY };
}

export default function ShooAnimals({ onComplete, burst }) {
  const [animals, setAnimals] = useState([]);
  const [shooed, setShooed] = useState(0);
  const [spriteUrls, setSpriteUrls] = useState({});
  const spawnCount = useRef(0);
  const completed = useRef(false);

  // Load all animal sprite URLs
  useEffect(() => {
    const urls = {};
    Promise.all(
      ANIMAL_NAMES.map(async name => {
        const blob = await getImage(`${VERSION}-animal-${name}`);
        if (blob) urls[name] = blobToUrl(blob);
      })
    ).then(() => setSpriteUrls(urls));
  }, []);

  // Spawn animals on interval
  useEffect(() => {
    if (completed.current) return;
    const interval = setInterval(() => {
      if (spawnCount.current >= TARGET_SHOOS) {
        clearInterval(interval);
        return;
      }
      const idx = spawnCount.current;
      const name = ANIMAL_NAMES[idx % ANIMAL_NAMES.length];
      const pos = randomEdge();
      setAnimals(prev => [...prev, {
        id: idx,
        name,
        ...pos,
        shooed: false,
      }]);
      spawnCount.current++;
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [spriteUrls]);

  const handleShoo = useCallback((id) => {
    playShoo();
    const freq = 400 + ((shooed + 1) / TARGET_SHOOS) * 500;
    playTone(freq, 0.12, 'sine');

    setAnimals(prev => prev.map(a => a.id === id ? { ...a, shooed: true } : a));

    const next = shooed + 1;
    setShooed(next);

    if (next >= TARGET_SHOOS && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [shooed, onComplete]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_SHOOS }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < shooed ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Animals */}
      {animals.map(animal => (
        <button
          key={animal.id}
          onClick={() => !animal.shooed && handleShoo(animal.id)}
          className={`absolute w-20 h-20 rounded-2xl overflow-hidden z-20
                     transition-all duration-[2000ms] ease-out
                     ${animal.shooed ? 'animate-ellie-shoo-away pointer-events-none' : 'active:scale-90'}`}
          style={{
            left: animal.shooed ? undefined : `${animal.targetX}%`,
            top: animal.shooed ? undefined : `${animal.targetY}%`,
            transform: 'translate(-50%, -50%)',
            '--drift-x': `${animal.startX - animal.targetX}vw`,
            '--drift-y': `${animal.startY - animal.targetY}vh`,
          }}
        >
          {spriteUrls[animal.name] ? (
            <img
              src={spriteUrls[animal.name]}
              alt={animal.name}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-4xl">🐾</span>
          )}
        </button>
      ))}

      {/* Hint */}
      {shooed === 0 && animals.length > 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Shoo the animals away!
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/games/ShooAnimals.jsx
git commit -m "feat(ellie): add Shoo the Animals mini-game"
```

---

### Task 12: Game 3 — Noise Meter

**Files:**
- Create: `src/stories/ellie/games/NoiseMeter.jsx`

**Step 1: Create the Noise Meter game**

Full-screen tap zone. Each tap creates ripple + rising tone. Vertical meter fills. 28 taps.

```jsx
// src/stories/ellie/games/NoiseMeter.jsx
import { useState, useCallback, useRef } from 'react';
import { playBang, playTone } from '../../../hooks/useSound';

const TARGET_TAPS = 28;
const MILESTONES = [
  { at: 0.2,  label: '📣' },
  { at: 0.4,  label: '🔊' },
  { at: 0.6,  label: '📢' },
  { at: 0.8,  label: '🗣️' },
  { at: 1.0,  label: '🎉' },
];

export default function NoiseMeter({ onComplete }) {
  const [taps, setTaps] = useState(0);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
  const completed = useRef(false);

  const progress = taps / TARGET_TAPS;

  const handleTap = useCallback((e) => {
    if (completed.current) return;

    const next = taps + 1;
    const freq = 400 + (next / TARGET_TAPS) * 500;
    playBang();
    playTone(freq, 0.1, 'sine');

    // Add ripple at tap position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    setTaps(next);

    if (next >= TARGET_TAPS) {
      completed.current = true;
      onComplete();
    }
  }, [taps, onComplete]);

  return (
    <div
      className="w-full h-full relative cursor-pointer active:bg-white/5"
      onClick={handleTap}
    >
      {/* Ripple animations */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute w-8 h-8 rounded-full border-2 border-sun/60 animate-ellie-ripple pointer-events-none z-20"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}

      {/* Vertical meter — left side */}
      <div className="absolute left-6 top-20 bottom-24 w-10 z-20">
        {/* Track */}
        <div className="w-full h-full bg-white/10 rounded-full overflow-hidden relative">
          {/* Fill */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 via-pink-500 to-sun
                        rounded-full transition-all duration-200"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {/* Milestone markers */}
        {MILESTONES.map(m => (
          <div
            key={m.at}
            className={`absolute left-12 text-2xl transition-all duration-300 ${
              progress >= m.at ? 'scale-125 opacity-100' : 'scale-75 opacity-30'
            }`}
            style={{ bottom: `${m.at * 100}%`, transform: 'translateY(50%)' }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Center encouragement text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <p className={`text-3xl font-heading text-white/60 animate-ellie-meter-pulse ${
          progress > 0.8 ? 'text-sun' : ''
        }`}>
          {progress === 0 ? 'TAP!' :
           progress < 0.3 ? 'Louder!' :
           progress < 0.6 ? 'LOUDER!' :
           progress < 0.9 ? 'LOUDER!!' :
           'LOUDER!!!'}
        </p>
      </div>

      {/* Hint */}
      {taps === 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap anywhere — make some noise!
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/games/NoiseMeter.jsx
git commit -m "feat(ellie): add Noise Meter mini-game"
```

---

### Task 13: Game 4 — Pop the Tiny Folk

**Files:**
- Create: `src/stories/ellie/games/PopTinyFolk.jsx`

**Step 1: Create the Pop Tiny Folk game**

8 AI-generated Tiny Folk scattered at random positions. Tap each to pop (star burst + spin away).

```jsx
// src/stories/ellie/games/PopTinyFolk.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { getImage, blobToUrl } from '../../../lib/imageCache';
import { VERSION, FOLK_NAMES } from '../storyData';
import { playSparkle, playTone } from '../../../hooks/useSound';

const TARGET_POPS = 8;

function randomPositions() {
  // Generate 8 non-overlapping positions
  const positions = [];
  for (let i = 0; i < TARGET_POPS; i++) {
    let x, y, attempts = 0;
    do {
      x = 12 + Math.random() * 76;
      y = 18 + Math.random() * 55;
      attempts++;
    } while (
      attempts < 20 &&
      positions.some(p => Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 14)
    );
    positions.push({ x, y });
  }
  return positions;
}

export default function PopTinyFolk({ onComplete, burst }) {
  const [folk, setFolk] = useState([]);
  const [popped, setPopped] = useState(0);
  const completed = useRef(false);

  // Initialize folk with positions and sprite URLs
  useEffect(() => {
    const positions = randomPositions();
    Promise.all(
      FOLK_NAMES.map(async (name, i) => {
        const blob = await getImage(`${VERSION}-folk-${name}`);
        return {
          id: i,
          name,
          x: positions[i].x,
          y: positions[i].y,
          url: blob ? blobToUrl(blob) : null,
          popped: false,
        };
      })
    ).then(setFolk);
  }, []);

  const handlePop = useCallback((id) => {
    playSparkle();
    const next = popped + 1;
    const freq = 400 + (next / TARGET_POPS) * 500;
    playTone(freq, 0.12, 'sine');

    setFolk(prev => prev.map(f => f.id === id ? { ...f, popped: true } : f));
    setPopped(next);

    if (next >= TARGET_POPS && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [popped, onComplete]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_POPS }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < popped ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Tiny Folk characters */}
      {folk.map(f => (
        <button
          key={f.id}
          onClick={() => !f.popped && handlePop(f.id)}
          className={`absolute w-20 h-20 z-20 rounded-2xl overflow-hidden
                     ${f.popped ? 'animate-ellie-spin-away pointer-events-none' : 'animate-ellie-bob active:scale-90'}
                     transition-transform`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${f.id * 0.15}s`,
          }}
        >
          {/* Glow ring */}
          {!f.popped && (
            <div className="absolute inset-0 rounded-2xl animate-ellie-glow opacity-30 pointer-events-none"
                 style={{ boxShadow: '0 0 15px #a78bfa, 0 0 30px #a78bfa' }} />
          )}
          {f.url ? (
            <img
              src={f.url}
              alt={f.name}
              className="w-full h-full object-contain relative z-10"
              draggable={false}
            />
          ) : (
            <span className="text-4xl relative z-10">✨</span>
          )}
        </button>
      ))}

      {/* Hint */}
      {popped === 0 && folk.length > 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap the Tiny Folk!
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/games/PopTinyFolk.jsx
git commit -m "feat(ellie): add Pop the Tiny Folk mini-game"
```

---

### Task 14: Celebration Screen

**Files:**
- Create: `src/stories/ellie/CelebrationScreen.jsx`

**Step 1: Create the final celebration screen**

Folk parade, confetti, fanfare, Ellie hero image, replay button.

```jsx
// src/stories/ellie/CelebrationScreen.jsx
import { useState, useEffect } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { VERSION, FOLK_NAMES } from './storyData';
import { playFanfare } from '../../hooks/useSound';
import { useCelebration } from '../../components/CelebrationOverlay';

export default function CelebrationScreen({ onReplay }) {
  const [heroUrl, setHeroUrl] = useState(null);
  const [folkUrls, setFolkUrls] = useState([]);
  const { celebrate, CelebrationLayer } = useCelebration();

  useEffect(() => {
    // Load scene 4 as the celebration backdrop
    getImage(`${VERSION}-scene-4`).then(blob => {
      if (blob) setHeroUrl(blobToUrl(blob));
    });

    // Load Tiny Folk sprites for the parade
    Promise.all(
      FOLK_NAMES.map(async name => {
        const blob = await getImage(`${VERSION}-folk-${name}`);
        return blob ? blobToUrl(blob) : null;
      })
    ).then(urls => setFolkUrls(urls.filter(Boolean)));

    // Play fanfare and celebrate
    playFanfare();
    setTimeout(() => {
      celebrate({ message: 'The End!', duration: 5000 });
    }, 800);
  }, [celebrate]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      {heroUrl ? (
        <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-300 via-yellow-200 to-orange-300" />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Folk parade at bottom */}
      <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-3 overflow-hidden">
        {folkUrls.map((url, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl overflow-hidden animate-parade-enter shadow-lg"
            style={{ animationDelay: `${0.5 + i * 0.2}s` }}
          >
            <img src={url} alt="" className="w-full h-full object-contain" draggable={false} />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 gap-4">
        <h1 className="text-5xl font-heading text-sun drop-shadow-xl animate-celebration-text">
          The End!
        </h1>
        <p className="text-xl font-body text-white drop-shadow-lg animate-ellie-fade-in"
           style={{ animationDelay: '1s' }}>
          A person's a person, no matter how small.
        </p>
      </div>

      {/* Replay button */}
      <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center">
        <button
          onClick={onReplay}
          className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                     shadow-xl active:scale-95 transition-transform animate-bounce"
          style={{ animationDelay: '2s' }}
        >
          Play Again 🔄
        </button>
      </div>

      <CelebrationLayer />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/CelebrationScreen.jsx
git commit -m "feat(ellie): add celebration screen with folk parade"
```

---

### Task 15: Main Orchestrator

**Files:**
- Create: `src/stories/ellie/EllieStorybook.jsx`

**Step 1: Create the orchestrator state machine**

Manages the full screen flow: Loading → Title → (Story → Game) x4 → Celebration.

```jsx
// src/stories/ellie/EllieStorybook.jsx
import { useState, useCallback } from 'react';
import BackButton from '../../components/BackButton';
import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';
import StoryScreen from './StoryScreen';
import GameScreen from './GameScreen';
import CelebrationScreen from './CelebrationScreen';
import FindTheSpeck from './games/FindTheSpeck';
import ShooAnimals from './games/ShooAnimals';
import NoiseMeter from './games/NoiseMeter';
import PopTinyFolk from './games/PopTinyFolk';
import { SCREENS } from './storyData';

const GAME_COMPONENTS = [FindTheSpeck, ShooAnimals, NoiseMeter, PopTinyFolk];

export default function EllieStorybook() {
  // 'loading' | 'title' | 'playing' | 'celebration'
  const [phase, setPhase] = useState('loading');
  const [screenIndex, setScreenIndex] = useState(0);

  const handleLoadComplete = useCallback(() => setPhase('title'), []);
  const handleStart = useCallback(() => {
    setScreenIndex(0);
    setPhase('playing');
  }, []);

  const handleAdvance = useCallback(() => {
    const next = screenIndex + 1;
    if (next >= SCREENS.length) {
      setPhase('celebration');
    } else {
      setScreenIndex(next);
    }
  }, [screenIndex]);

  const handleReplay = useCallback(() => {
    setScreenIndex(0);
    setPhase('title');
  }, []);

  const current = SCREENS[screenIndex];

  return (
    <div className="w-full h-full relative overflow-hidden bg-night">
      <BackButton />

      {phase === 'loading' && (
        <LoadingScreen onComplete={handleLoadComplete} />
      )}

      {phase === 'title' && (
        <TitleScreen onStart={handleStart} />
      )}

      {phase === 'playing' && current.type === 'story' && (
        <StoryScreen
          key={`story-${current.chapter}`}
          chapter={current.chapter}
          onAdvance={handleAdvance}
        />
      )}

      {phase === 'playing' && current.type === 'game' && (
        <GameScreen
          key={`game-${current.chapter}`}
          chapter={current.chapter}
          GameComponent={GAME_COMPONENTS[current.chapter]}
          onComplete={handleAdvance}
        />
      )}

      {phase === 'celebration' && (
        <CelebrationScreen onReplay={handleReplay} />
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/stories/ellie/EllieStorybook.jsx
git commit -m "feat(ellie): add main orchestrator state machine"
```

---

### Task 16: Integration — Route, Registry, App

**Files:**
- Modify: `src/data/games.js:27` (add entry before existing books)
- Modify: `src/App.jsx:33-34` (add lazy import + route)

**Step 1: Add game registry entry**

In `src/data/games.js`, add this entry at the top of the Books section (before `farm-book` at line 27):

```js
  { id: 'ellie-tiny-folk', emoji: '🐘', title: "Ellie's Story", path: 'ellie-tiny-folk', category: 'books', bg: 'from-purple-300 to-pink-400' },
```

**Step 2: Add lazy import to App.jsx**

After line 33 (the `BuildAScene` import), add:

```js
const EllieStorybook = lazy(() => import('./stories/ellie/EllieStorybook'));
```

**Step 3: Add route to App.jsx**

After line 88 (the `build-a-scene` route), add:

```jsx
        <Route path="/games/:mode/:section/ellie-tiny-folk" element={<MuteByMode><SectionProvider><EllieStorybook /></SectionProvider></MuteByMode>} />
```

**Step 4: Verify it builds**

Run: `npm run dev`

Navigate to the books section. Confirm the "Ellie's Story" tile appears with the elephant emoji. Tap it — should show the loading screen (will fail gracefully if no API key set).

**Step 5: Commit**

```bash
git add src/data/games.js src/App.jsx
git commit -m "feat(ellie): integrate storybook into routing and game registry"
```

---

### Task 17: Verify Full Flow

**Step 1: Set API key in .env.local**

```
VITE_OPENAI_API_KEY=sk-...
```

**Step 2: Restart dev server**

Run: `npm run dev`

**Step 3: Full flow test**

1. Navigate: Books → Ellie's Story
2. Loading screen should generate 25 images with progress
3. Title screen shows Ellie character sheet
4. Tap Play → Story 1 narration (auto-reads aloud)
5. Tap Play → Game 1 (Find the Speck) — tap speck 6 times
6. Auto-advance to Story 2 → Game 2 (Shoo Animals) — tap 8 animals
7. Story 3 → Game 3 (Noise Meter) — tap 28 times
8. Story 4 → Game 4 (Pop Tiny Folk) — tap 8 folk
9. Celebration screen with parade, confetti, replay

**Step 4: Verify caching**

Refresh the page. Navigate back to Ellie's Story — should skip loading (all images cached in IndexedDB). Same Ellie every time.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(ellie): complete Ellie & the Tiny Folk interactive storybook"
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | IndexedDB cache | `src/lib/imageCache.js` |
| 2 | Story data & prompts | `src/stories/ellie/storyData.js` |
| 3 | Image generation | `src/lib/imageGen.js` |
| 4 | Sound functions | `src/hooks/useSound.js` (modify) |
| 5 | Tailwind animations | `tailwind.config.js` (modify) |
| 6 | Loading screen | `src/stories/ellie/LoadingScreen.jsx` |
| 7 | Title screen | `src/stories/ellie/TitleScreen.jsx` |
| 8 | Story screen | `src/stories/ellie/StoryScreen.jsx` |
| 9 | Game wrapper | `src/stories/ellie/GameScreen.jsx` |
| 10 | Find the Speck | `src/stories/ellie/games/FindTheSpeck.jsx` |
| 11 | Shoo the Animals | `src/stories/ellie/games/ShooAnimals.jsx` |
| 12 | Noise Meter | `src/stories/ellie/games/NoiseMeter.jsx` |
| 13 | Pop the Tiny Folk | `src/stories/ellie/games/PopTinyFolk.jsx` |
| 14 | Celebration screen | `src/stories/ellie/CelebrationScreen.jsx` |
| 15 | Orchestrator | `src/stories/ellie/EllieStorybook.jsx` |
| 16 | Integration | `src/data/games.js`, `src/App.jsx` (modify) |
| 17 | Full flow verification | Manual test |
