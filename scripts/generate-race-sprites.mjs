#!/usr/bin/env node
/**
 * Generate character sprites for the Tortoise & Hare Race game.
 *
 * Usage:
 *   node scripts/generate-race-sprites.mjs
 *
 * Environment:
 *   VITE_OPENAI_API_KEY — your OpenAI API key (required, from .env)
 *
 * Generates PNG character sprites with transparent backgrounds and saves
 * them to public/assets/characters/tortoise-hare-race/
 */

import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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
  console.error('ERROR: Set VITE_OPENAI_API_KEY in .env');
  process.exit(1);
}

const OUT_DIR = join(ROOT, 'public', 'assets', 'characters', 'tortoise-hare-race');

// ─── Art style ───────────────────────────────────────────────────
const STYLE = `Children's picture book character sprite on a PURE WHITE background (#FFFFFF). The character should be the ONLY element — no ground, no grass, no scenery, no shadows on the ground. Style: warm gouache illustration with visible brush texture, thick soft brown outlines (not black), rounded chunky proportions. Colour palette: warm amber (#F5B041), golden yellow (#FACC15), forest green (#6B8E5A), soft cream (#FDF5E6), warm brown (#C4A265), rosy pink (#F48FB1). The character has a large head (1/3 of body), big expressive eyes with white highlights, rosy cheek circles. Overall feel: Pixar-meets-watercolour — soft, friendly, touchable. Square format. No text.`;

// ─── Sprites to generate ─────────────────────────────────────────
const SPRITES = [
  {
    name: 'tortoise-walking',
    prompt: `${STYLE} A cute cartoon tortoise walking to the right, seen from the side. Green domed shell with hexagonal pattern details and a lighter green highlight on top. Four stubby green legs mid-stride. Friendly face with a big smile, large dark eyes with white sparkle, rosy cheeks. Short stubby tail behind. The tortoise looks determined and happy. Whole body visible, centered in frame.`,
  },
  {
    name: 'hare-sleeping',
    prompt: `${STYLE} A cute cartoon hare/rabbit curled up sleeping peacefully, seen from the side. Golden-brown fur with a cream-coloured belly. Long floppy ears drooped down. Eyes closed with gentle curved lines. Small pink nose. Fluffy white cotton-ball tail. Legs tucked underneath. A few tiny "Z" letters floating above to show sleeping. Peaceful and cozy expression. Whole body visible, centered in frame.`,
  },
  {
    name: 'hare-running',
    prompt: `${STYLE} A cute cartoon hare/rabbit sprinting fast to the right, seen from the side. Golden-brown fur with cream belly visible. Long ears streaming back behind from speed. Wide happy grin. Bright excited eyes. Back legs extended far behind, front legs reaching forward — classic running pose. Small motion lines behind for speed. Fluffy white tail bouncing. Energetic and joyful. Whole body visible, centered in frame.`,
  },
  {
    name: 'hare-panic',
    prompt: `${STYLE} A cute cartoon hare/rabbit looking shocked and panicked, seen from the side facing right. Golden-brown fur, cream belly. Long ears standing straight up in alarm. Huge wide eyes (bigger than normal), tiny pupils, sweat drops. Mouth open in a surprised "O" shape. Body leaning forward ready to run. One paw raised. Small exclamation marks near head. Worried but still cute, not scary. Whole body visible, centered in frame.`,
  },
  {
    name: 'tortoise-winner',
    prompt: `${STYLE} A cute cartoon tortoise standing proudly with a big golden trophy/cup held up high. Green domed shell, four stubby legs. Huge beaming smile, eyes squeezed with joy, rosy cheeks glowing. Small golden confetti stars around. The tortoise looks triumphant and incredibly happy. Side view facing right. Whole body visible, centered in frame.`,
  },
  {
    name: 'intro-scene',
    prompt: `Children's picture book illustration in warm golden-hour gouache style. A cute cartoon tortoise and a cute cartoon hare standing at a race starting line in a sunny countryside meadow. The tortoise (left) is small with a green shell, big smile, looking determined. The hare (right) is taller with golden-brown fur, long ears, looking cocky and confident with arms crossed. Between them is a simple "START" banner. Rolling green hills, warm amber sky, wildflowers. Thick soft brown outlines, visible brush texture. Warm palette: amber, golden yellow, forest green, cream. No text except "START" on the banner. Landscape format 3:2.`,
    size: '1536x1024',
  },
];

// ─── API call ────────────────────────────────────────────────────

async function generateImage(prompt, size = '1024x1024') {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size,
      quality: 'high',
      background: 'transparent',
    }),
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

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR, { recursive: true });
    console.log(`Created ${OUT_DIR}`);
  }

  for (const sprite of SPRITES) {
    const outPath = join(OUT_DIR, `${sprite.name}.png`);
    if (existsSync(outPath)) {
      console.log(`SKIP ${sprite.name} (already exists)`);
      continue;
    }

    console.log(`Generating ${sprite.name}...`);
    try {
      const buf = await generateImage(sprite.prompt, sprite.size || '1024x1024');
      await writeFile(outPath, buf);
      console.log(`  ✓ Saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ✗ Failed ${sprite.name}: ${e.message}`);
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\nDone! Images saved to public/assets/characters/tortoise-hare-race/');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
