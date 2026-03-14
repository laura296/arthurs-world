#!/usr/bin/env node
/**
 * Generate celebratory ArthurBear + race background images.
 */

import { writeFile, mkdir, readFileSync } from 'fs';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile as writeFileAsync, mkdir as mkdirAsync } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Read .env.local
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

async function generate(prompt, size = '1024x1024', bg = 'transparent') {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size, quality: 'high', background: bg }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, 'base64');
}

const IMAGES = [
  {
    path: 'public/assets/characters/arthur-bear-excited.png',
    size: '1024x1024',
    bg: 'transparent',
    prompt: `Children's picture book character on a PURE WHITE background. A cute cartoon bear cub celebrating joyfully. STRICT CHARACTER DESIGN: Round chunky body proportions, big head (1/3 of body height). Soft warm brown fur (#C4922A) with lighter golden-brown belly and inner ears (#D4A853). Large sparkling dark eyes with big white highlights showing pure excitement — eyes squeezed into happy crescents. Big wide open smile. Round rosy pink cheek circles. Small dark round nose. Round teddy-bear ears. Short stubby arms raised up in celebration, paws up in the air. Short stubby legs. The bear is jumping for joy, slightly airborne. Small golden stars and sparkles around him. Style: warm gouache illustration with visible brush texture, thick soft brown outlines (not black). The bear looks soft, cuddly, and absolutely thrilled. Whole body visible, centered in frame. No ground, no scenery, just the character.`,
  },
  {
    path: 'public/assets/characters/tortoise-hare-race/race-background.png',
    size: '1536x1024',
    bg: 'opaque',
    prompt: `Children's picture book landscape illustration, wide panoramic view. A sunny English countryside scene for a race. SCENE: Rolling green hills under a warm golden-amber sky with wispy clouds. A winding dirt path crosses from left to right through meadows. Scattered wildflowers (buttercups, daisies, poppies) dot the hillsides. A few rounded oak trees with thick brown trunks and blobby green canopies. Low stone walls criss-cross the hills. A warm golden sun low in the sky casting long amber shadows. Distant purple-blue hills on the horizon. Style: warm gouache on kraft paper, visible brush texture, thick soft brown outlines. Colour palette: forest green (#6B8E5A), warm amber (#F5B041), golden yellow (#FACC15), kraft/cream (#C4A882), sky blue (#8AAEC4), earth brown (#6B4E3D). The overall feel is warm, pastoral, inviting — like a classic children's book illustration. NO characters, NO text, NO UI elements. Landscape format 3:2.`,
  },
];

async function main() {
  for (const img of IMAGES) {
    const outPath = join(ROOT, img.path);
    const dir = dirname(outPath);
    if (!existsSync(dir)) await mkdirAsync(dir, { recursive: true });
    if (existsSync(outPath)) { console.log(`SKIP ${img.path}`); continue; }

    console.log(`Generating ${img.path}...`);
    try {
      const buf = await generate(img.prompt, img.size, img.bg);
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
