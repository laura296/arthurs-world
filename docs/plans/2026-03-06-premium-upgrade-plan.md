# Premium App Store Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring Arthur's World to app-store-ready quality by generating all missing assets, adding error resilience, and polishing PWA presentation.

**Architecture:** One-time Node.js generation scripts produce static PNG assets that replace runtime OpenAI API calls. Error boundaries catch crashes in any game/story. PWA metadata is completed for iOS and Android home screen presentation.

**Tech Stack:** Node.js (generation scripts), React (error boundary), SVG (app icon), Vite PWA plugin (manifest config)

---

### Task 1: Create Image Generation Script for Ellie Story Assets

**Files:**
- Create: `scripts/generate-ellie-images.mjs`

**Step 1: Create the generation script**

```javascript
// scripts/generate-ellie-images.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'ellie');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set VITE_OPENAI_API_KEY in .env.local');
  process.exit(1);
}

// ── Style anchors ──
const STYLE_ANCHOR = "Whimsical mid-century American children's picture book style. Bold black ink outlines. Flat saturated colours. No gradients. Wobbly imperfect curved lines. Impossible tall wiggly trees. Striped or patterned sky. Expressive cartoon faces. No text. No letters. No words.";
const ELLIE_ANCHOR = 'Ellie the lavender-purple elephant with large round kind eyes, a warm smile, a gently upward-curling trunk, rounded chubby body, large ears with pink inner ear, and a small tuft of hair on her head.';

const CHARACTER_SHEET_PROMPT = "A single character design sheet of an original cartoon elephant character named Ellie. She is lavender-purple with slightly darker purple outlines. Large round kind eyes with long eyelashes and a warm expression. Rounded chubby body proportions — she is gentle and soft-looking, not fierce. Her trunk curls upward at the tip in a friendly way. Large round ears with a soft pink inner ear. Short stubby legs. A small tuft of light hair on the top of her head. She stands facing three-quarters toward the viewer, smiling warmly. Clean white background. The art style is a mid-century American children's picture book: bold black ink outlines, flat saturated colours, no gradients, slightly wobbly imperfect lines, expressive and charming. No text. No words. No labels.";

const SCENE_PROMPTS = [
  `${ELLIE_ANCHOR} stands in a magical jungle, looking surprised and delighted. She holds a large glowing pink flower in her curled trunk. A tiny golden speck of light floats in the air right in front of her eye. Tall wobbly striped trees and enormous round leaves surround her. Warm morning sky with horizontal orange and yellow stripes. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} protectively cradles a glowing pink flower against her chest, looking brave and determined. Surrounding her are grumpy cartoon animals: a kangaroo with arms crossed and a scowl, a bossy eagle with ruffled feathers, a cheeky monkey pointing and laughing. Sunset orange and red striped sky. Tall wobbly jungle trees. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} stands with one large ear tilted forward, straining to listen, her eyes closed in concentration. In the foreground, microscopic tiny colourful people stand on a giant pink flower petal, shouting upward with arms waving and mouths wide open. Curvy sound wave lines radiate upward. Deep purple and indigo striped sky with large cartoon stars. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} smiling with closed eyes and rosy cheeks, holding a pink flower aloft in joy. Tiny colourful people — a wizard in a tall hat, a queen with a crown, a baby, a chef, a musician — dance and wave on the flower petals around her. Warm golden sunrise sky with yellow and cream stripes. Confetti and stars fill the air. ${STYLE_ANCHOR}`,
];

const GAME_BG_PROMPTS = [
  `A wide open blue sky with horizontal white cloud stripes and fluffy impossible cloud shapes. At the bottom, rolling bright green hills with tiny wobbly trees. A single small glowing golden speck of light floats in the centre of the blue sky. Lots of open space. No characters. ${STYLE_ANCHOR}`,
  `A sunny jungle clearing with a large glowing pink flower on a long stem in the centre. Soft green ground with round hills. Blue and white striped sky. Tall wiggly colourful trees at the edges with plenty of open space between them. No characters — space for animals to appear from the edges. ${STYLE_ANCHOR}`,
  `A deep purple night sky filled with large cartoon stars and swirling sound wave lines radiating across the entire scene. A large lavender elephant ear at the right edge, straining forward to listen. A tiny glowing flower in the lower centre. Magical glowing atmosphere. No full characters — just the ear at edge. ${STYLE_ANCHOR}`,
  `A giant magical pink flower fills the lower two-thirds of the scene against a bright happy green background with blue and yellow striped sky. The flower has many large open petals, each with a tiny glowing doorway or hiding spot in it. Joyful celebratory atmosphere. Floating stars and sparkles. No characters — space in the petals for the Tiny Folk to appear. ${STYLE_ANCHOR}`,
];

const ANIMAL_NAMES = ['kangaroo', 'eagle', 'monkey', 'parrot', 'snake', 'lizard', 'frog', 'toucan'];
const ANIMAL_SPRITE_PROMPTS = [
  `A grumpy cartoon kangaroo with arms crossed and a scowl, looking bossy and sceptical. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A bossy cartoon eagle with ruffled feathers, puffed-up chest, and an annoyed expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A cheeky cartoon monkey pointing and laughing, mischievous expression, swinging tail. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon parrot with a big beak, squawking with wings spread, looking indignant. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A silly cartoon snake coiled up with a smirk, tongue sticking out playfully. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A small cartoon lizard with big eyes, looking curious and a bit sneaky, bright green with spots. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A round cartoon frog with big bulging eyes and a wide grin, sitting on its haunches. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon toucan with an enormous bright beak, looking proud and silly. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

const FOLK_NAMES = ['wizard', 'queen', 'baby', 'chef', 'musician', 'knight', 'painter', 'dancer'];
const FOLK_SPRITE_PROMPTS = [
  `A tiny cartoon wizard in a tall pointy hat with stars, holding a magic wand, cheerful expression, long robe. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon queen with a golden crown, flowing robe, waving regally with a warm smile. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon baby with a nappy, big round eyes, giggling with arms up, rosy cheeks. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon chef with a tall white hat, holding a wooden spoon, jolly round face. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon musician playing a trumpet, cheeks puffed out, musical notes around. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon knight in shining armour with a small shield and sword, friendly face visible through helmet. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon painter with a beret, holding a paintbrush and palette, splashes of colour on apron. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon dancer in a flowing dress, mid-twirl with arms outstretched, joyful expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── API Helpers ──

async function apiCall(url, body, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      console.log(`  Retry in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function generateImage(prompt, size = '1536x1024') {
  const data = await apiCall('https://api.openai.com/v1/images/generations', {
    model: 'gpt-image-1', prompt, n: 1, size, quality: 'high',
  });
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  if (data.data[0].url) {
    const res = await fetch(data.data[0].url);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error('No image data');
}

async function generateWithReference(refPath, prompt, size = '1536x1024') {
  const refBuffer = fs.readFileSync(refPath);
  const blob = new Blob([refBuffer], { type: 'image/png' });
  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('image[]', blob, 'reference.png');
  formData.append('prompt', prompt);
  formData.append('size', size);
  formData.append('quality', 'high');

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/edits', {
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
      if (b64) return Buffer.from(b64, 'base64');
      if (data.data[0].url) {
        const r = await fetch(data.data[0].url);
        return Buffer.from(await r.arrayBuffer());
      }
      throw new Error('No image data');
    } catch (e) {
      if (attempt === 1) throw e;
      console.log(`  Retry in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

function save(filename, buffer) {
  const out = path.join(OUT_DIR, filename);
  fs.writeFileSync(out, buffer);
  console.log(`  ✓ Saved ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

function exists(filename) {
  return fs.existsSync(path.join(OUT_DIR, filename));
}

// ── Main ──

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  const total = 1 + 4 + 4 + 8 + 8; // 25 images
  const log = (msg) => { done++; console.log(`[${done}/${total}] ${msg}`); };

  // 1. Character sheet
  if (!exists('character-sheet.png')) {
    log('Generating character sheet...');
    const buf = await generateImage(CHARACTER_SHEET_PROMPT, '1024x1024');
    save('character-sheet.png', buf);
  } else { log('character-sheet.png already exists, skipping'); }
  const charSheetPath = path.join(OUT_DIR, 'character-sheet.png');

  // 2. Scene images (with character reference)
  for (let i = 0; i < SCENE_PROMPTS.length; i++) {
    const fname = `scene-${i + 1}.png`;
    if (!exists(fname)) {
      log(`Generating scene ${i + 1}...`);
      const buf = await generateWithReference(charSheetPath, SCENE_PROMPTS[i]);
      save(fname, buf);
    } else { log(`${fname} already exists, skipping`); }
  }

  // 3. Game backgrounds (no reference)
  for (let i = 0; i < GAME_BG_PROMPTS.length; i++) {
    const fname = `game-bg-${i + 1}.png`;
    if (!exists(fname)) {
      log(`Generating game background ${i + 1}...`);
      const buf = await generateImage(GAME_BG_PROMPTS[i]);
      save(fname, buf);
    } else { log(`${fname} already exists, skipping`); }
  }

  // 4. Animal sprites (1024x1024 square)
  for (let i = 0; i < ANIMAL_SPRITE_PROMPTS.length; i++) {
    const fname = `animal-${ANIMAL_NAMES[i]}.png`;
    if (!exists(fname)) {
      log(`Generating animal: ${ANIMAL_NAMES[i]}...`);
      const buf = await generateImage(ANIMAL_SPRITE_PROMPTS[i], '1024x1024');
      save(fname, buf);
    } else { log(`${fname} already exists, skipping`); }
  }

  // 5. Tiny Folk sprites (1024x1024 square)
  for (let i = 0; i < FOLK_SPRITE_PROMPTS.length; i++) {
    const fname = `folk-${FOLK_NAMES[i]}.png`;
    if (!exists(fname)) {
      log(`Generating folk: ${FOLK_NAMES[i]}...`);
      const buf = await generateImage(FOLK_SPRITE_PROMPTS[i], '1024x1024');
      save(fname, buf);
    } else { log(`${fname} already exists, skipping`); }
  }

  console.log(`\n✅ All ${total} Ellie images generated in public/images/ellie/`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
```

**Step 2: Run the script**

Load .env.local and run:
```bash
export $(grep -v '^#' .env.local | xargs) && node scripts/generate-ellie-images.mjs
```

Expected: 25 PNG files in `public/images/ellie/`. Takes ~10-15 minutes (sequential API calls).

**Step 3: Verify files exist**

```bash
ls public/images/ellie/ | wc -l
```
Expected: 25 files

**Step 4: Commit generated assets**

```bash
git add scripts/generate-ellie-images.mjs public/images/ellie/
git commit -m "feat(ellie): generate all 25 story images via OpenAI"
```

---

### Task 2: Create Card Cover Image Generation Script

**Files:**
- Create: `scripts/generate-card-covers.mjs`

**Step 1: Create the script**

```javascript
// scripts/generate-card-covers.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'cards');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Whimsical mid-century children's picture book illustration. Bold black ink outlines. Flat saturated colours. No gradients. Slightly wobbly charming lines. No text. No words. No letters.";

const CARDS = [
  {
    name: 'bubble-pop',
    prompt: `A joyful underwater scene with dozens of shimmering colourful bubbles (blue, purple, pink, gold) floating upward against a deep ocean blue background. A few cute smiling fish peek between the bubbles. Rays of light filter down from above. ${STYLE}`,
  },
  {
    name: 'feed-animals',
    prompt: `A cheerful cartoon farm scene with a red barn. Happy farm animals gathered together: a spotted cow, a pink pig, a white sheep, and a brown horse. Bright green grass and a sunny blue sky with puffy clouds. A wooden food trough in the foreground. ${STYLE}`,
  },
  {
    name: 'pop-critters',
    prompt: `A grassy meadow with several round holes in the ground. Cute woodland creatures — a fox, hedgehog, rabbit, mouse, owl — peeking their heads out of the holes with mischievous expressions. Flowers and mushrooms dot the grass. Warm sunset sky. ${STYLE}`,
  },
  {
    name: 'build-a-scene',
    prompt: `A magical blank canvas or stage with a spotlight, surrounded by floating colourful stickers: a dinosaur, a rocket ship, a tree, a star, a rainbow, a house. The stickers look like they're ready to be placed. Sparkles and magic dust. Purple and blue theatrical curtains on the sides. ${STYLE}`,
  },
  {
    name: 'memory-match',
    prompt: `A grid of face-down playing cards with star patterns on their backs, in cheerful colours (purple, teal, gold). Two cards are flipped over showing a happy sun and a smiling moon. Sparkles surround the matched pair. Dark navy background with scattered tiny stars. ${STYLE}`,
  },
  {
    name: 'colouring',
    prompt: `A large blank canvas on an easel with a few colourful paint splashes (red, blue, yellow, green, purple). Scattered around it are fat crayons, paintbrushes, and a rainbow palette. Colourful paint drips and splatters everywhere. Clean white background. ${STYLE}`,
  },
  {
    name: 'music-pad',
    prompt: `A collection of colourful musical instruments arranged playfully: a rainbow piano keyboard curving upward, wooden xylophone bars, a golden harp, and round drums. Musical notes float in the air in different colours. Deep purple starry background. ${STYLE}`,
  },
];

async function generateImage(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1024x1024', quality: 'high' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  if (data.data[0].url) {
    const r = await fetch(data.data[0].url);
    return Buffer.from(await r.arrayBuffer());
  }
  throw new Error('No image data');
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < CARDS.length; i++) {
    const { name, prompt } = CARDS[i];
    const outPath = path.join(OUT_DIR, `${name}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${CARDS.length}] ${name}.png exists, skipping`);
      continue;
    }
    console.log(`[${i + 1}/${CARDS.length}] Generating ${name}...`);
    const buf = await generateImage(prompt);
    fs.writeFileSync(outPath, buf);
    console.log(`  ✓ ${name}.png (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  console.log(`\n✅ All ${CARDS.length} card covers generated in public/images/cards/`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
```

**Step 2: Run the script**

```bash
export $(grep -v '^#' .env.local | xargs) && node scripts/generate-card-covers.mjs
```

Expected: 7 PNG files in `public/images/cards/`

**Step 3: Commit**

```bash
git add scripts/generate-card-covers.mjs public/images/cards/
git commit -m "feat: generate 7 game card cover images"
```

---

### Task 3: Rewrite Ellie Story to Use Static Assets

**Files:**
- Modify: `src/stories/ellie/LoadingScreen.jsx` (full rewrite)
- Modify: `src/stories/ellie/StoryScreen.jsx:20-24` (change image loading)
- Modify: `src/stories/ellie/GameScreen.jsx:15-19` (change image loading)
- Modify: `src/stories/ellie/TitleScreen.jsx:9-13` (change image loading)
- Modify: `src/stories/ellie/CelebrationScreen.jsx:13-24` (change image loading)
- Modify: `src/stories/ellie/games/ShooAnimals.jsx:33-42` (change sprite loading)
- Modify: `src/stories/ellie/games/PopTinyFolk.jsx:32-47` (change sprite loading)
- Modify: `src/stories/ellie/storyData.js` (add static path helpers)

**Step 1: Add static asset path helpers to storyData.js**

Add at the bottom of `src/stories/ellie/storyData.js`:

```javascript
// ── Static asset paths (pre-generated images in public/images/ellie/) ──
const BASE = '/arthurs-world/images/ellie';

export const STATIC_ASSETS = {
  characterSheet: `${BASE}/character-sheet.png`,
  scene: (i) => `${BASE}/scene-${i}.png`,
  gameBg: (i) => `${BASE}/game-bg-${i}.png`,
  animal: (name) => `${BASE}/animal-${name}.png`,
  folk: (name) => `${BASE}/folk-${name}.png`,
};
```

**Step 2: Rewrite LoadingScreen.jsx to preload static images**

Replace entire `src/stories/ellie/LoadingScreen.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react';
import { STATIC_ASSETS, ANIMAL_NAMES, FOLK_NAMES } from './storyData';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const running = useRef(false);

  const allSrcs = [
    STATIC_ASSETS.characterSheet,
    ...Array.from({ length: 4 }, (_, i) => STATIC_ASSETS.scene(i + 1)),
    ...Array.from({ length: 4 }, (_, i) => STATIC_ASSETS.gameBg(i + 1)),
    ...ANIMAL_NAMES.map(n => STATIC_ASSETS.animal(n)),
    ...FOLK_NAMES.map(n => STATIC_ASSETS.folk(n)),
  ];
  const total = allSrcs.length;

  useEffect(() => {
    if (running.current) return;
    running.current = true;

    let loaded = 0;
    allSrcs.forEach(src => {
      preloadImage(src).then(() => {
        loaded++;
        setProgress(loaded);
        if (loaded >= total) onComplete();
      });
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      <img
        src={STATIC_ASSETS.characterSheet}
        alt="Ellie"
        className="w-48 h-auto rounded-2xl shadow-xl border-2 border-sun/30 animate-ellie-fade-in"
      />

      <h2 className="text-2xl font-heading text-sun text-center">
        Getting ready...
      </h2>

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
    </div>
  );
}
```

**Step 3: Update TitleScreen.jsx to use static path**

In `src/stories/ellie/TitleScreen.jsx`, replace the useState/useEffect image loading (lines 1-13) with:

```jsx
import { STATIC_ASSETS } from './storyData';
import { playTone } from '../../hooks/useSound';

export default function TitleScreen({ onStart }) {
  const heroUrl = STATIC_ASSETS.characterSheet;
```

Remove the `useState`, `useEffect`, `getImage`, `blobToUrl` imports and the effect.

**Step 4: Update StoryScreen.jsx to use static path**

In `src/stories/ellie/StoryScreen.jsx`, replace the useState/useEffect image loading with:

```jsx
import { CHAPTERS, STATIC_ASSETS } from './storyData';
// Remove: getImage, blobToUrl imports

export default function StoryScreen({ chapter, onAdvance }) {
  const data = CHAPTERS[chapter];
  const bgUrl = STATIC_ASSETS.scene(chapter + 1);
```

Remove the `useState`, `useEffect` for bgUrl, and the `getImage`/`blobToUrl` imports.

**Step 5: Update GameScreen.jsx to use static path**

In `src/stories/ellie/GameScreen.jsx`, replace image loading with:

```jsx
import { CHAPTERS, STATIC_ASSETS } from './storyData';
// Remove: getImage, blobToUrl imports

export default function GameScreen({ chapter, GameComponent, onComplete }) {
  const data = CHAPTERS[chapter];
  const bgUrl = STATIC_ASSETS.gameBg(chapter + 1);
```

Remove useState/useEffect for bgUrl.

**Step 6: Update CelebrationScreen.jsx to use static paths**

Replace image loading with:

```jsx
import { STATIC_ASSETS, FOLK_NAMES } from './storyData';
// Remove: getImage, blobToUrl, VERSION imports

export default function CelebrationScreen({ onReplay }) {
  const heroUrl = STATIC_ASSETS.scene(4);
  const folkUrls = FOLK_NAMES.map(name => STATIC_ASSETS.folk(name));
```

Remove useState/useEffect for heroUrl and folkUrls.

**Step 7: Update ShooAnimals.jsx to use static paths**

Replace sprite loading with:

```jsx
import { ANIMAL_NAMES, STATIC_ASSETS } from '../storyData';
// Remove: getImage, blobToUrl, VERSION imports

export default function ShooAnimals({ onComplete, burst }) {
  // Replace spriteUrls state + useEffect with:
  const spriteUrls = Object.fromEntries(
    ANIMAL_NAMES.map(name => [name, STATIC_ASSETS.animal(name)])
  );
```

Remove the useState/useEffect for spriteUrls.

**Step 8: Update PopTinyFolk.jsx to use static paths**

Replace sprite loading with:

```jsx
import { FOLK_NAMES, STATIC_ASSETS } from '../storyData';
// Remove: getImage, blobToUrl, VERSION imports

// In the useEffect, replace image loading:
useEffect(() => {
  const positions = randomPositions();
  setFolk(FOLK_NAMES.map((name, i) => ({
    id: i,
    name,
    x: positions[i].x,
    y: positions[i].y,
    url: STATIC_ASSETS.folk(name),
    popped: false,
  })));
}, []);
```

**Step 9: Build and verify**

```bash
npm run build
```

Expected: Clean build, no import errors.

**Step 10: Commit**

```bash
git add src/stories/ellie/
git commit -m "refactor(ellie): use pre-generated static images instead of runtime API"
```

---

### Task 4: Create Premium PWA App Icon

**Files:**
- Modify: `public/icon-192.svg` (replace content)
- Modify: `public/icon-512.svg` (replace content)
- Create: `public/icon-maskable.svg`
- Modify: `vite.config.js:18-21` (add maskable icon to manifest)
- Modify: `index.html:10-11` (update icon links)

**Step 1: Replace icon-192.svg with Arthur Bear face**

Replace `public/icon-192.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="192" height="192" rx="38" fill="url(#bg)"/>
  <!-- Stars -->
  <circle cx="30" cy="25" r="2" fill="#facc15" opacity="0.6"/>
  <circle cx="162" cy="20" r="1.5" fill="#facc15" opacity="0.5"/>
  <circle cx="155" cy="50" r="1" fill="#facc15" opacity="0.4"/>
  <circle cx="40" cy="55" r="1.5" fill="#facc15" opacity="0.5"/>
  <circle cx="25" cy="165" r="1" fill="#facc15" opacity="0.3"/>
  <circle cx="165" cy="170" r="1.5" fill="#facc15" opacity="0.4"/>
  <!-- Bear - positioned center -->
  <g transform="translate(96, 100) scale(0.85)">
    <!-- Ears -->
    <circle cx="-45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="-45" cy="-55" r="14" fill="#D4A853"/>
    <circle cx="45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="45" cy="-55" r="14" fill="#D4A853"/>
    <!-- Head -->
    <ellipse cx="0" cy="0" rx="60" ry="56" fill="#C4922A"/>
    <!-- Face -->
    <ellipse cx="0" cy="12" rx="40" ry="36" fill="#D4A853"/>
    <!-- Eyes -->
    <circle cx="-20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="-17" cy="-7" r="2.5" fill="white"/>
    <circle cx="23" cy="-7" r="2.5" fill="white"/>
    <!-- Nose -->
    <ellipse cx="0" cy="16" rx="10" ry="7" fill="#5C3D10"/>
    <ellipse cx="-2" cy="14" rx="3" ry="2" fill="#8B6914" opacity="0.5"/>
    <!-- Mouth - happy -->
    <path d="M-12 28 Q0 40 12 28" stroke="#5C3D10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Cheeks -->
    <circle cx="-32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
    <circle cx="32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
  </g>
  <!-- Title shimmer at bottom -->
  <text x="96" y="175" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#facc15" opacity="0.8">Arthur's World</text>
</svg>
```

**Step 2: Replace icon-512.svg with same design, scaled up**

Replace `public/icon-512.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- Stars -->
  <circle cx="70" cy="60" r="4" fill="#facc15" opacity="0.6"/>
  <circle cx="440" cy="50" r="3" fill="#facc15" opacity="0.5"/>
  <circle cx="420" cy="130" r="2.5" fill="#facc15" opacity="0.4"/>
  <circle cx="90" cy="140" r="3" fill="#facc15" opacity="0.5"/>
  <circle cx="60" cy="440" r="2.5" fill="#facc15" opacity="0.3"/>
  <circle cx="450" cy="450" r="3" fill="#facc15" opacity="0.4"/>
  <circle cx="256" cy="40" r="2" fill="#facc15" opacity="0.3"/>
  <circle cx="50" cy="260" r="2" fill="#facc15" opacity="0.3"/>
  <circle cx="462" cy="280" r="2" fill="#facc15" opacity="0.3"/>
  <!-- Bear -->
  <g transform="translate(256, 255) scale(2.2)">
    <circle cx="-45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="-45" cy="-55" r="14" fill="#D4A853"/>
    <circle cx="45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="45" cy="-55" r="14" fill="#D4A853"/>
    <ellipse cx="0" cy="0" rx="60" ry="56" fill="#C4922A"/>
    <ellipse cx="0" cy="12" rx="40" ry="36" fill="#D4A853"/>
    <circle cx="-20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="-17" cy="-7" r="2.5" fill="white"/>
    <circle cx="23" cy="-7" r="2.5" fill="white"/>
    <ellipse cx="0" cy="16" rx="10" ry="7" fill="#5C3D10"/>
    <ellipse cx="-2" cy="14" rx="3" ry="2" fill="#8B6914" opacity="0.5"/>
    <path d="M-12 28 Q0 40 12 28" stroke="#5C3D10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="-32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
    <circle cx="32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
  </g>
  <text x="256" y="470" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="36" fill="#facc15" opacity="0.8">Arthur's World</text>
</svg>
```

**Step 3: Create maskable icon variant**

Create `public/icon-maskable.svg` — same bear but more padding (safe zone is inner 80%):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f172a"/>
  <g transform="translate(256, 240) scale(1.8)">
    <circle cx="-45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="-45" cy="-55" r="14" fill="#D4A853"/>
    <circle cx="45" cy="-55" r="24" fill="#8B6914"/>
    <circle cx="45" cy="-55" r="14" fill="#D4A853"/>
    <ellipse cx="0" cy="0" rx="60" ry="56" fill="#C4922A"/>
    <ellipse cx="0" cy="12" rx="40" ry="36" fill="#D4A853"/>
    <circle cx="-20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="20" cy="-4" r="7" fill="#5C3D10"/>
    <circle cx="-17" cy="-7" r="2.5" fill="white"/>
    <circle cx="23" cy="-7" r="2.5" fill="white"/>
    <ellipse cx="0" cy="16" rx="10" ry="7" fill="#5C3D10"/>
    <ellipse cx="-2" cy="14" rx="3" ry="2" fill="#8B6914" opacity="0.5"/>
    <path d="M-12 28 Q0 40 12 28" stroke="#5C3D10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="-32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
    <circle cx="32" cy="24" r="11" fill="#F9A8B8" opacity="0.5"/>
  </g>
</svg>
```

**Step 4: Update vite.config.js manifest icons**

In `vite.config.js`, replace the icons array (lines 19-22):

```javascript
icons: [
  { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
  { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
  { src: 'icon-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
],
```

**Step 5: Commit**

```bash
git add public/icon-192.svg public/icon-512.svg public/icon-maskable.svg vite.config.js
git commit -m "feat: premium Arthur Bear PWA app icon with maskable variant"
```

---

### Task 5: Add React Error Boundary

**Files:**
- Create: `src/components/GameErrorBoundary.jsx`
- Modify: `src/App.jsx` (wrap routes)

**Step 1: Create the error boundary component**

```jsx
// src/components/GameErrorBoundary.jsx
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import ArthurBear from './ArthurBear';

function FallbackUI() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      <ArthurBear expression="sleepy" size={120} className="animate-float" />
      <h2 className="text-2xl font-heading text-sun text-center">
        Oops! Something went wrong
      </h2>
      <p className="text-base font-body text-white/60 text-center max-w-xs">
        Don't worry — let's go back and try again!
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                   shadow-xl active:scale-95 transition-transform"
      >
        Go Back
      </button>
    </div>
  );
}

export default class GameErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Game error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Step 2: Wrap lazy routes in App.jsx**

In `src/App.jsx`, import and wrap each game/story route element:

```jsx
import GameErrorBoundary from './components/GameErrorBoundary';
```

Then wrap each route's element, e.g. change:
```jsx
<Route path="/games/:mode/:section/bubble-pop" element={<MuteByMode><SectionProvider><BubblePop /></SectionProvider></MuteByMode>} />
```
to:
```jsx
<Route path="/games/:mode/:section/bubble-pop" element={<MuteByMode><SectionProvider><GameErrorBoundary><BubblePop /></GameErrorBoundary></SectionProvider></MuteByMode>} />
```

Apply to ALL game/story routes (lines 67-90).

**Step 3: Build and verify**

```bash
npm run build
```
Expected: Clean build.

**Step 4: Commit**

```bash
git add src/components/GameErrorBoundary.jsx src/App.jsx
git commit -m "feat: add error boundaries to all game/story routes"
```

---

### Task 6: PWA Meta Polish

**Files:**
- Modify: `vite.config.js:13-14` (improve manifest description)
- Modify: `index.html` (already has apple meta tags — verify)

**Step 1: Update manifest description**

In `vite.config.js`, replace the description:

```javascript
description: 'Interactive games, stories, and music for toddlers. Tap, play, and explore!',
```

**Step 2: Update .gitignore to allow ellie and card PNGs**

In `.gitignore`, update the PNG rules to allow the new asset directories:

```
*.png
!public/*.png
!public/images/ellie/*.png
!public/images/cards/*.png
```

**Step 3: Verify index.html already has apple meta tags**

Confirm `index.html` already has (it does from our earlier read):
- `apple-mobile-web-app-capable`: yes (line 6)
- `apple-mobile-web-app-status-bar-style`: black-translucent (line 7)
- `theme-color`: #0f172a (line 8)

No changes needed to index.html.

**Step 4: Build, verify, commit**

```bash
npm run build
```

```bash
git add vite.config.js .gitignore
git commit -m "chore: polish PWA manifest and allow generated PNGs in git"
```

---

### Task 7: Final Build Verification

**Step 1: Clean build**

```bash
rm -rf dist && npm run build
```

Expected: Clean build, no warnings, all assets precached.

**Step 2: Verify all new assets are in dist**

```bash
ls dist/images/ellie/ | wc -l   # should be 25
ls dist/images/cards/ | wc -l   # should be 7
ls dist/icon-*.svg               # should show 3 SVGs
```

**Step 3: Run preview server and spot-check**

```bash
npm run preview
```

Visit: `http://localhost:4173/arthurs-world/`
- Home screen: Arthur Bear icon visible
- GameGrid: Card cover images load
- Ellie story: All scenes and games render with static images

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: premium app store upgrade — all assets, error boundaries, polished PWA"
```
