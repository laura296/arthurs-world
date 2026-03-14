#!/usr/bin/env node
/**
 * Generate all ArthurBear expression sprites to replace the SVG component.
 */

import { writeFile as writeFileAsync, mkdir as mkdirAsync } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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
if (!API_KEY) { console.error('No API key'); process.exit(1); }

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

// Consistent character description
const BEAR = `A cute cartoon bear cub character named Arthur. STRICT CHARACTER DESIGN that must be consistent across all images: Round chunky proportions. Soft warm brown fur (#C4922A) with lighter golden-brown belly patch and inner ears (#D4A853). Small round dark brown nose. Round teddy-bear ears with lighter inner colour. Rosy pink cheek circles. Short stubby limbs. Style: warm gouache children's book illustration with visible brush texture, thick soft brown outlines (not black). On a PURE WHITE background (#FFFFFF). No ground, no grass, no scenery, no shadows. Character centered in frame.`;

const SPRITES = [
  {
    name: 'happy-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body visible, just the bear's round face and ears filling the frame. Expression: HAPPY. Large warm dark eyes with white sparkle highlights. Gentle happy closed-mouth smile (curved line). Looking directly at viewer. The face should fill most of the square frame.`,
  },
  {
    name: 'excited-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body visible, just the bear's round face and ears filling the frame. Expression: EXCITED. Eyes squeezed into happy upward crescents, tiny sparkles near eyes. Big wide open smile showing excitement. Rosy cheeks extra pink. Small golden stars near the face. Looking directly at viewer. The face should fill most of the square frame.`,
  },
  {
    name: 'sleepy-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body visible, just the bear's round face and ears filling the frame. Expression: SLEEPY. Eyes half-closed with droopy eyelids. Small gentle yawning mouth or sleepy smile. A tiny "z" floating near one ear. Ears slightly drooped. Looking peaceful and drowsy. The face should fill most of the square frame.`,
  },
  {
    name: 'curious-face',
    prompt: `${BEAR} HEAD AND FACE ONLY — no body visible, just the bear's round face and ears filling the frame. Expression: CURIOUS. One eyebrow slightly raised. Eyes wide and bright, looking slightly to the side. Small "o" shaped mouth. One ear tilted slightly. The face should fill most of the square frame.`,
  },
  {
    name: 'excited-full',
    prompt: `${BEAR} FULL BODY visible — head and entire body with arms and legs. Expression: EXCITED and celebrating. Eyes squeezed into happy crescents. Big wide open smile. Arms raised up in the air in celebration. Slightly jumping/airborne with joy. Small golden stars and sparkles around him. Whole body visible from head to feet, centered in frame.`,
  },
  {
    name: 'happy-full',
    prompt: `${BEAR} FULL BODY visible — head and entire body with arms and legs. Expression: HAPPY and friendly. Large warm dark eyes with white sparkle highlights. Gentle happy smile. Arms relaxed at sides or one paw waving gently. Standing upright. Whole body visible from head to feet, centered in frame.`,
  },
];

async function main() {
  if (!existsSync(OUT_DIR)) {
    await mkdirAsync(OUT_DIR, { recursive: true });
    console.log(`Created ${OUT_DIR}`);
  }

  for (const sprite of SPRITES) {
    const outPath = join(OUT_DIR, `${sprite.name}.png`);
    if (existsSync(outPath)) { console.log(`SKIP ${sprite.name}`); continue; }

    console.log(`Generating ${sprite.name}...`);
    try {
      const buf = await generate(sprite.prompt);
      await writeFileAsync(outPath, buf);
      console.log(`  OK (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  FAIL: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
