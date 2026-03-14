#!/usr/bin/env node
/**
 * Generate character sprites for the Tortoise & Hare Race game.
 *
 * Usage:
 *   node scripts/generate-race-sprites.mjs           # skip existing
 *   node scripts/generate-race-sprites.mjs --force    # regenerate all
 *
 * Environment:
 *   VITE_OPENAI_API_KEY — your OpenAI API key (from .env or .env.local)
 *
 * Generates PNG sprites, then converts to optimised WebP (512×512 chars, 2048w scenes).
 */

import sharp from 'sharp';
import { writeFile, mkdir, stat } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FORCE = process.argv.includes('--force');

// Read .env / .env.local manually (no dotenv dependency)
for (const f of ['.env', '.env.local']) {
  const p = join(ROOT, f);
  if (existsSync(p)) {
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.trim().match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
      if (m) process.env[m[1]] = m[2].trim();
    }
  }
}

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error('ERROR: Set VITE_OPENAI_API_KEY in .env or .env.local');
  process.exit(1);
}

const OUT_DIR = join(ROOT, 'public', 'assets', 'characters', 'tortoise-hare-race');

// ─── Art Direction ──────────────────────────────────────────────────
// Consistent style block ensures all characters look like they belong together.
// Key traits: gouache texture, warm palette, thick brown outlines, oversized heads.

const CHAR_STYLE = [
  'Children\'s picture book character on a PURE TRANSPARENT background.',
  'NOTHING else in the image — no ground, no grass, no shadows, no scenery, no props except what is specified.',
  'Art style: soft gouache painting with gentle visible brush strokes. Thick rounded brown outlines (never black). Smooth cel-shaded colour fills with subtle warm gradients.',
  'Proportions: large round head (40% of total height), small rounded body, stubby limbs.',
  'Eyes: large, round, dark brown with two white highlight dots (big + small). Thick curved brow lines above.',
  'Cheeks: soft rosy-pink circular blush spots.',
  'Colour palette: forest green (#5A7A4A), warm amber (#D4A843), golden cream (#F5E6D0), rosy pink (#E8A0A0), warm brown (#6B4E3D), sky blue (#8AAEC4).',
  'Feel: Pixar-meets-watercolour. Soft, friendly, safe, glowing. Suitable for a 3-year-old.',
  'Square format 1:1. Character centered with space around edges. No text anywhere.',
].join(' ');

const SCENE_STYLE = [
  'Children\'s picture book illustration in warm golden-hour gouache style.',
  'Thick soft brown outlines, gentle visible brush strokes, smooth colour fills.',
  'Colour palette: warm amber (#D4A843), golden yellow (#E8D070), forest green (#5A7A4A), soft cream (#F5E6D0), sky blue (#8AAEC4), rosy pink (#E8A0A0).',
  'Warm glowing light from the right. Soft purple-blue shadows, never grey or black.',
  'Feel: magical, safe, inviting. Like a treasured storybook illustration.',
].join(' ');

// ─── Sprites to generate ────────────────────────────────────────────
const SPRITES = [
  {
    name: 'tortoise-walking',
    prompt: `${CHAR_STYLE} A cute cartoon TORTOISE walking to the RIGHT in side-profile view. Olive-green domed shell with a simple hexagonal pattern in lighter green. Shell has a warm amber edge/rim. Four short stubby olive-green legs — the two visible legs are in a walking pose (one forward, one back). Head is round with a slight beak-like mouth area. Big warm smile showing determination. Small round ears or head bumps. Short stubby tail visible behind. The tortoise is compact and adorable — looks like a plush toy come to life.`,
  },
  {
    name: 'hare-sleeping',
    prompt: `${CHAR_STYLE} A cute cartoon HARE curled up sleeping on its side, facing RIGHT. Golden-brown fur with soft amber highlights. Cream-coloured tummy and inner ears. Two long floppy ears drooped down and resting on the ground. Eyes CLOSED — shown as gentle curved smile-lines. Small pink triangle nose. Tiny peaceful smile. Fluffy white cotton-ball tail. Front paws tucked under chin. Back legs curled up. Two or three small blue "Z" letters floating above the head. The pose is round and cozy, like a sleeping cat.`,
  },
  {
    name: 'hare-running',
    prompt: `${CHAR_STYLE} A cute cartoon HARE sprinting fast to the RIGHT in a dynamic running pose. Golden-brown fur with cream tummy. Two long ears streaming straight back from speed. BIG wide joyful grin — mouth open, teeth showing. Bright excited eyes — wide open, sparkling. Front legs reaching forward, back legs extended far behind (classic cartoon sprint). Three small speed lines trailing behind the body. Fluffy white tail bouncing up. The whole pose conveys speed and excitement. The hare looks like it's having the time of its life.`,
  },
  {
    name: 'hare-panic',
    prompt: `${CHAR_STYLE} A cute cartoon HARE looking comically PANICKED, facing RIGHT. Golden-brown fur, cream tummy. Two long ears standing STRAIGHT UP in alarm — stiff and pointed. Eyes are HUGE and round (bigger than normal) with tiny dot pupils. Mouth is a big round surprised "O" shape. Two small sweat drops near the forehead. Body leaning forward urgently. One front paw raised. The expression is worried and funny — like a cartoon character who just realised they overslept. Still cute and non-scary, played for comedy.`,
  },
  {
    name: 'tortoise-winner',
    prompt: `${CHAR_STYLE} A cute cartoon TORTOISE celebrating a victory, facing RIGHT. Same olive-green shell with hexagonal pattern. The tortoise is standing on back legs, front legs raised high holding a GOLDEN TROPHY CUP above its head. Eyes squeezed shut with pure joy (happy curved lines). Enormous beaming smile. Rosy cheeks extra bright. A few small golden star sparkles around the trophy. A tiny gold medal ribbon around the neck. The pose radiates pure triumph and happiness — the proudest little tortoise ever.`,
  },
  {
    name: 'intro-scene',
    prompt: `${SCENE_STYLE} Wide landscape illustration: a sunny countryside meadow with a race starting line. On the LEFT, a small cute cartoon tortoise with a green dome shell, stubby legs, big determined smile — looking ready. On the RIGHT, a taller cute cartoon hare with golden-brown fur, long ears, standing with arms crossed and a cocky smirk. Between them, a simple red-and-white "START" banner on two wooden poles. The path ahead stretches into rolling green hills. Warm amber sky with a few fluffy clouds. Wildflowers (yellow, pink, blue) dot the grass. A white picket fence in the background. Landscape format. No text except "START" on the banner.`,
    size: '1536x1024',
    isScene: true,
  },
  {
    name: 'race-background',
    prompt: `${SCENE_STYLE} Wide panoramic countryside background for a side-scrolling race game. NO characters or animals. Rolling green hills with varying heights. A brown dirt path runs horizontally across the lower third. Scattered wildflowers in yellow, pink, and white. A few round-canopy trees in the middle distance. A simple white picket fence running along parts of the path. Warm amber sky fills the top half with soft clouds. Distant blue-purple mountains on the horizon. Small butterflies and birds as tiny dots in the sky. Everything bathed in warm golden sunlight. Landscape format 3:2.`,
    size: '1536x1024',
    isScene: true,
  },
];

// ─── API call ────────────────────────────────────────────────────────
async function generateImage(prompt, size = '1024x1024', transparent = true) {
  const body = {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size,
    quality: 'high',
  };
  if (transparent) body.background = 'transparent';

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const b64 = data.data[0].b64_json;
  if (!b64) throw new Error('No b64_json in response');
  return Buffer.from(b64, 'base64');
}

// ─── Convert PNG to optimised WebP ──────────────────────────────────
async function toWebP(pngPath, webpPath, isScene = false) {
  let pipeline = sharp(pngPath);
  const meta = await pipeline.metadata();

  if (isScene) {
    if (meta.width > 2048) {
      pipeline = pipeline.resize(2048, null, { fit: 'inside', withoutEnlargement: true });
    }
  } else {
    if (meta.width > 512 || meta.height > 512) {
      pipeline = pipeline.resize(512, 512, { fit: 'inside', withoutEnlargement: true });
    }
  }

  await pipeline.webp({ quality: 80, effort: 6 }).toFile(webpPath);
  const origSize = (await stat(pngPath)).size;
  const newSize = (await stat(webpPath)).size;
  console.log(`  → WebP: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`);
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR, { recursive: true });
    console.log(`Created ${OUT_DIR}`);
  }

  for (const sprite of SPRITES) {
    const pngPath = join(OUT_DIR, `${sprite.name}.png`);
    const webpPath = join(OUT_DIR, `${sprite.name}.webp`);

    if (!FORCE && existsSync(webpPath)) {
      console.log(`SKIP ${sprite.name} (webp exists, use --force to regenerate)`);
      continue;
    }

    console.log(`Generating ${sprite.name}...`);
    try {
      const transparent = !sprite.isScene || sprite.name !== 'race-background';
      const buf = await generateImage(sprite.prompt, sprite.size || '1024x1024', transparent);
      await writeFile(pngPath, buf);
      console.log(`  ✓ PNG saved (${(buf.length / 1024).toFixed(0)} KB)`);

      await toWebP(pngPath, webpPath, !!sprite.isScene);
    } catch (e) {
      console.error(`  ✗ Failed ${sprite.name}: ${e.message}`);
    }

    // Rate limit courtesy
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\nDone! WebP images saved to public/assets/characters/tortoise-hare-race/');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
