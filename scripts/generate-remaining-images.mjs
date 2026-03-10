#!/usr/bin/env node
// scripts/generate-remaining-images.mjs
// Generates the 11 missing page illustrations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Whimsical mid-century children's picture book illustration. Bold black ink outlines. Flat saturated colours. No gradients. Slightly wobbly charming lines. Warm and friendly. No text. No words. No letters. No numbers.";

const BOOKS = {
  'camel-hump': [
    {
      name: 'page-7',
      prompt: `A magical desert genie (glowing purple, floating in the air) confronting a stubborn camel who refuses to work. The camel looks grumpy and defiant, saying HUMPH. The genie looks frustrated, arms crossed. Sandy desert with a scorpion nearby. ${STYLE}`,
    },
    {
      name: 'page-8',
      prompt: `A magical POOF moment! A desert genie waves his hands casting purple magic sparkles at a camel. A big round hump is growing on the camel's back! The camel looks shocked and surprised. Magical sparkle effects everywhere. Desert setting. ${STYLE}`,
    },
  ],
  'elephant-child': [
    {
      name: 'page-6',
      prompt: `A dramatic scene at a river! A large green crocodile has SNAPPED its jaws on a baby elephant's short nose! The elephant looks scared and is pulling backwards. Big splash of water around them. Reeds and jungle plants on the riverbank. ${STYLE}`,
    },
  ],
  'first-letter': [
    {
      name: 'page-2',
      prompt: `A prehistoric cave-man father looking sad, holding a broken fishing spear in two pieces by a river. His young daughter (wearing animal-skin dress) looks worried beside him. Fish jumping in the river. Green jungle background. ${STYLE}`,
    },
    {
      name: 'page-5',
      prompt: `A young cave-girl in animal skins handing a piece of bark with a scratchy drawing on it to a confused-looking stranger (a tall man from another tribe). By a river with jungle background. A bird watches from a tree. ${STYLE}`,
    },
    {
      name: 'page-6',
      prompt: `A confused prehistoric stranger holding a piece of bark with a drawing upside down, scratching his head with question marks floating around him. He looks very puzzled. Jungle clearing setting. ${STYLE}`,
    },
    {
      name: 'page-7',
      prompt: `A large crowd of prehistoric people all gathered together looking confused and excited. Men, women and children in animal skins, all talking at once. A jungle village in the background. Lively and chaotic scene. ${STYLE}`,
    },
    {
      name: 'page-8',
      prompt: `A prehistoric mother laughing warmly while her young daughter (cave-girl) looks embarrassed but happy. Villagers around them are laughing too. A silly drawing on bark visible. Warm sunny jungle clearing. ${STYLE}`,
    },
    {
      name: 'page-9',
      prompt: `A determined young cave-girl sitting cross-legged, carefully drawing improved pictures on pieces of bark. She looks focused and proud. Stars and a rainbow in the sky above her. Bright sunny jungle setting. ${STYLE}`,
    },
    {
      name: 'page-10',
      prompt: `A joyful celebration! A prehistoric family — father, mother, and young daughter — together holding up pieces of bark with letters on them. Everyone smiling and cheering. Beautiful golden sunset over jungle. Hearts and sparkles. ${STYLE}`,
    },
  ],
  'red-riding': [
    {
      name: 'page-5',
      prompt: `A silly grey wolf running very fast through a green forest, kicking up dust behind him. He has a sneaky grin on his face. Paw prints trailing behind him. Trees and bushes blur past. Bright green forest. ${STYLE}`,
    },
  ],
};

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
  const slugs = Object.keys(BOOKS);
  let total = 0;
  for (const slug of slugs) total += BOOKS[slug].length;

  console.log(`Generating ${total} missing images for ${slugs.length} books\n`);
  let done = 0;

  for (const slug of slugs) {
    const dir = path.join(IMG_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });

    for (const page of BOOKS[slug]) {
      const outPath = path.join(dir, `${page.name}.png`);
      if (fs.existsSync(outPath)) {
        console.log(`[${++done}/${total}] ${slug}/${page.name}.png exists, skipping`);
        continue;
      }
      console.log(`[${++done}/${total}] ${slug}/${page.name}...`);
      const buf = await generateImage(page.prompt);
      fs.writeFileSync(outPath, buf);
      console.log(`  Done ${page.name}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }

  console.log(`\nDone! All missing images generated.`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
