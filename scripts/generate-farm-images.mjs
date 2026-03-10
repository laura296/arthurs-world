// scripts/generate-farm-images.mjs
// Generates bedtime farm story illustrations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'farm-book');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Whimsical mid-century children's picture book illustration. Bold black ink outlines. Flat saturated colours. No gradients. Slightly wobbly charming lines. Warm and friendly. No text. No words. No letters. No numbers.";

const PAGES = [
  {
    name: 'page-1',
    prompt: `A warm orange and pink sunset over a charming red barn. A friendly farmer in overalls and a straw hat stands by a wooden gate, stretching and yawning. Rolling green hills. The sky is streaked with horizontal bands of orange, pink, and purple. A few sleepy animals visible in the background. ${STYLE}`,
  },
  {
    name: 'page-2',
    prompt: `ONE proud rooster standing tall on a wooden fence post, crowing at a beautiful orange sunset. The rooster is large, bold black and red with a magnificent tail. The sun is half-set behind rolling hills. The fence stretches across the scene. Warm golden light. ${STYLE}`,
  },
  {
    name: 'page-3',
    prompt: `TWO horses walking side by side into a cozy wooden stable. The left horse is chestnut brown, the right horse is black with a white star on its forehead. The stable door is wide open with warm yellow light inside. Hay bales visible inside the stable. Dusky pink sky. The two horses are clearly separated left and right in the composition. ${STYLE}`,
  },
  {
    name: 'page-4',
    prompt: `THREE little pink piglets curled up together in golden straw inside a wooden pig sty. One piglet on the left, one in the middle, one on the right — evenly spaced. A big mama pig watches lovingly from behind. The sty has a cute wooden fence. Soft warm evening light. ${STYLE}`,
  },
  {
    name: 'page-5',
    prompt: `FOUR spotted dairy cows walking in a line into a big red barn. The barn doors are wide open. One black-and-white cow, one brown cow, one tan cow, one reddish cow — arranged left to right across the scene. Green meadow, dusky sky. The four cows are evenly spaced across the full width of the composition. ${STYLE}`,
  },
  {
    name: 'page-6',
    prompt: `FIVE fluffy white sheep lying down on a green hillside at dusk. The sheep are arranged across the hill from left to right, evenly spaced. Some have their eyes closed. A crook (shepherd's staff) leans against a stone wall. Soft purple and pink dusk sky. The five sheep are clearly countable and spread across the full width. ${STYLE}`,
  },
  {
    name: 'page-7',
    prompt: `A plump brown mother hen sitting in a nest of golden straw with four fluffy yellow baby chicks snuggled under her wings. Two chicks peek out on each side. The nest is inside a cozy wooden chicken coop. A warm lamp glows above. Soft warm lighting. Peaceful and tender scene. ${STYLE}`,
  },
  {
    name: 'page-8',
    prompt: `A peaceful nighttime farm scene viewed from outside. The red barn with warm glowing windows. A crescent moon and many twinkling stars in a deep dark blue sky. Fireflies glow softly. Through the barn windows and doors, sleeping animals are visible — a cow, a horse, a pig, a sheep. Everything is still and quiet. A small owl sits on the barn roof. ${STYLE}`,
  },
];

async function generateImage(prompt) {
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1536x1024', quality: 'high' }),
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < PAGES.length; i++) {
    const { name, prompt } = PAGES[i];
    const outPath = path.join(OUT_DIR, `${name}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${PAGES.length}] ${name}.png exists, skipping`);
      continue;
    }
    console.log(`[${i + 1}/${PAGES.length}] Generating ${name}...`);
    const buf = await generateImage(prompt);
    fs.writeFileSync(outPath, buf);
    console.log(`  ✓ ${name}.png (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  console.log(`\n✅ All ${PAGES.length} farm book images generated in public/images/farm-book/`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
