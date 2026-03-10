// scripts/generate-card-covers.mjs
// One-time script to generate 7 game card cover illustrations
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
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
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
    } catch (e) {
      if (attempt === 1) throw e;
      console.log(`  Retry in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
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
