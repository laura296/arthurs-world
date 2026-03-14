#!/usr/bin/env node
/**
 * Generate all ArthurBear expression sprites.
 *
 * Usage:
 *   node scripts/generate-arthur-bear.mjs           # skip existing
 *   node scripts/generate-arthur-bear.mjs --force    # regenerate all
 */

import sharp from 'sharp';
import { writeFile, mkdir, stat } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FORCE = process.argv.includes('--force');

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
if (!API_KEY) { console.error('ERROR: Set VITE_OPENAI_API_KEY in .env or .env.local'); process.exit(1); }

const OUT_DIR = join(ROOT, 'public', 'assets', 'characters', 'arthur-bear');

async function generate(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1024x1024', quality: 'high', background: 'transparent' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, 'base64');
}

async function toWebP(pngPath, webpPath) {
  let pipeline = sharp(pngPath);
  const meta = await pipeline.metadata();
  if (meta.width > 512 || meta.height > 512) {
    pipeline = pipeline.resize(512, 512, { fit: 'inside', withoutEnlargement: true });
  }
  await pipeline.webp({ quality: 80, effort: 6 }).toFile(webpPath);
  const origSize = (await stat(pngPath)).size;
  const newSize = (await stat(webpPath)).size;
  console.log(`  → WebP: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`);
}

// ─── Character Design Brief ─────────────────────────────────────────
// "Arthur" = Bramble from the style guide. Round bear cub, soft brown fur.
// All sprites must be visually consistent — same face shape, same ear size, same fur colour.

const BEAR = [
  'A cute cartoon BEAR CUB character on a PURE TRANSPARENT background.',
  'NOTHING else in the image — no ground, no grass, no shadows, no scenery.',
  'STRICT CHARACTER DESIGN (must be identical across all images):',
  '- Round chunky body like a teddy bear plush toy',
  '- Soft warm brown fur (#C4922A) with lighter golden-cream belly patch and inner ears (#D4A853)',
  '- Small round dark brown button nose',
  '- Round teddy-bear ears — semicircles on top of head, lighter inside',
  '- Rosy pink circular blush on each cheek',
  '- Short stubby arms and legs with round paw pads',
  'Art style: warm gouache painting with gentle visible brush strokes. Thick rounded brown outlines (never black). Smooth soft colour fills with warm gradients.',
  'Feel: Pixar-meets-watercolour — soft, friendly, safe, glowing.',
  'Character centered in frame with breathing room on all sides. Square format. No text.',
].join(' ');

const SPRITES = [
  {
    name: 'happy-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body, just the bear's round face and ears FILLING the frame. Expression: HAPPY. Large warm dark brown eyes with TWO white sparkle highlights each (one big, one small). Gentle closed-mouth smile (soft upward curve). Looking directly at viewer. Ears perked up. Face is perfectly round and fills ~80% of the frame.`,
  },
  {
    name: 'excited-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body, just the bear's round face and ears FILLING the frame. Expression: EXCITED and overjoyed. Eyes squeezed into happy upward crescent shapes — eyebrows raised high. Big wide open-mouth smile showing tongue. Cheeks extra rosy. Three small golden star sparkles floating near the face. Ears pointing up straight. Face fills ~80% of the frame.`,
  },
  {
    name: 'sleepy-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body, just the bear's round face and ears FILLING the frame. Expression: SLEEPY and drowsy. Eyes half-closed with heavy droopy eyelids — only bottom half of iris visible. Small gentle yawn with open mouth (round O shape). Ears slightly drooped and tilted outward. Two tiny blue "z" letters floating above one ear. Peaceful and drowsy. Face fills ~80% of the frame.`,
  },
  {
    name: 'curious-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body, just the bear's round face and ears FILLING the frame. Expression: CURIOUS and wondering. One eyebrow slightly raised higher than the other. Eyes wide open and bright, looking slightly to one side. Small round "o" shaped mouth. One ear tilted/cocked to the side. A tiny question-mark sparkle near the tilted ear. Face fills ~80% of the frame.`,
  },
  {
    name: 'excited-full',
    prompt: `${BEAR} FULL BODY visible — head, torso, arms, legs all showing. Expression: CELEBRATING with joy. Eyes squeezed into happy crescents. Big wide smile with tongue visible. Both arms RAISED UP HIGH above head in triumph. Body slightly bouncing/airborne — feet off the ground line. Five small golden star sparkles scattered around. Whole body centred from head to toes.`,
  },
  {
    name: 'happy-full',
    prompt: `${BEAR} FULL BODY visible — head, torso, arms, legs all showing. Expression: FRIENDLY and welcoming. Large warm dark eyes with white sparkles. Gentle happy smile. One paw raised in a little wave, the other at the side. Standing upright with slightly pigeon-toed feet (cute pose). Whole body centred from head to toes.`,
  },
];

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
      const buf = await generate(sprite.prompt);
      await writeFile(pngPath, buf);
      console.log(`  ✓ PNG saved (${(buf.length / 1024).toFixed(0)} KB)`);
      await toWebP(pngPath, webpPath);
    } catch (e) {
      console.error(`  ✗ FAIL: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('\nDone!');
}

main().catch(e => { console.error(e); process.exit(1); });
