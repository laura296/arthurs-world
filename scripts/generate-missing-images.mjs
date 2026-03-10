#!/usr/bin/env node
// scripts/generate-missing-images.mjs
// Generates page illustrations for the 4 books missing cover images:
// alphabet-made, crab-sea, cat-walked, butterfly-stamped
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Whimsical mid-century children's picture book illustration. Bold black ink outlines. Flat saturated colours. No gradients. Slightly wobbly charming lines. Warm and friendly. No text. No words. No letters. No numbers.";

const BOOKS = {
  'alphabet-made': [
    {
      name: 'page-1',
      prompt: `A prehistoric cave-girl (young, cheerful, wearing animal-skin dress) and her father (big, friendly, wearing animal skin) sitting by a river. The girl holds up a flat piece of bark excitedly, pointing at marks she's scratched on it. A warm campfire nearby. Green jungle in background. ${STYLE}`,
    },
    { name: 'page-2', prompt: `A young cave-girl in animal skins enthusiastically telling her father "Let's make shapes for sounds!" They sit together surrounded by flat pieces of bark with scratchy drawings. Prehistoric jungle clearing. ${STYLE}` },
    { name: 'page-3', prompt: `A young cave-girl opening her mouth wide saying "AAAH" while her father draws a big triangular mouth shape on bark with charcoal. A large primitive letter A shape visible. Warm firelight. ${STYLE}` },
    { name: 'page-4', prompt: `A cave-girl pressing her lips together making a "Buh" sound. Her father draws two bumps on bark — a primitive letter B. They both look delighted. Prehistoric setting. ${STYLE}` },
    { name: 'page-5', prompt: `A cave-girl hissing like a snake "Sssss" while her father draws a wiggly snake shape on bark — the letter S. A small friendly snake nearby for inspiration. Jungle setting. ${STYLE}` },
    { name: 'page-6', prompt: `Father and daughter surrounded by many pieces of bark, each with a different letter shape. The girl makes a round "Ooooh" mouth. A round O shape on bark. Campfire lighting. ${STYLE}` },
    { name: 'page-7', prompt: `Lots of bark pieces laid out in a row showing primitive alphabet letters A through G. The cave-girl and father proudly surveying their work. Colourful prehistoric jungle. ${STYLE}` },
    { name: 'page-8', prompt: `A cave-girl excitedly pointing at bark pieces spelling T-A-F-F-Y (her name). Her father beams with pride. Warm golden light. ${STYLE}` },
    { name: 'page-9', prompt: `A group of prehistoric children gathered around the cave-girl as she teaches them letters on bark pieces. They all look fascinated and excited. Bright sunny jungle. ${STYLE}` },
    { name: 'page-10', prompt: `A joyful celebration scene — many prehistoric people holding bark letters, dancing and cheering. Children and adults together. Beautiful sunset over a prehistoric landscape. ${STYLE}` },
  ],
  'crab-sea': [
    {
      name: 'page-1',
      prompt: `A magical wise old magician in flowing robes standing on a cliff overlooking a vast turquoise ocean. He waves his hands creating the world — animals of all kinds playing on the beach below. Bright magical sparks. ${STYLE}`,
    },
    { name: 'page-2', prompt: `A charming menagerie of animals playing on a sunny beach — an elephant, a cow, a giraffe, all happily doing elephant things, cow things. Everyone looks joyful. Turquoise sea in background. ${STYLE}` },
    { name: 'page-3', prompt: `A VERY large, cheerful orange crab splashing happily in shallow ocean water. Big waves splashing around him. He looks playful and mischievous. Sparkling blue sea. ${STYLE}` },
    { name: 'page-4', prompt: `A massive orange crab walking INTO the ocean — the water rises dramatically high around him like a wave. Palm trees on shore bend in the spray. Dramatic but fun. ${STYLE}` },
    { name: 'page-5', prompt: `The big crab walking OUT of the ocean — the water drops down low, revealing sandy seabed and shells. Then walking back in — water rises again. Up and down motion. ${STYLE}` },
    { name: 'page-6', prompt: `A wise old magician on a cliff looking confused and annoyed at the ocean going up and down. He shakes his fist at the waves. A young girl beside him points at the crab. ${STYLE}` },
    { name: 'page-7', prompt: `A young girl in a simple dress pointing at the big orange crab in the water, telling the wise magician. The magician looks surprised. Bright sunny beach. ${STYLE}` },
    { name: 'page-8', prompt: `The wise magician pointing his staff at the big crab — magical sparkles shrinking the crab down to tiny size! The crab looks surprised. Ocean splashing. ${STYLE}` },
    { name: 'page-9', prompt: `A tiny cute orange crab on a sandy beach, still happily splashing in and out of small waves. The ocean gently rises and falls with each little splash. Peaceful sunset. ${STYLE}` },
    { name: 'page-10', prompt: `A beautiful ocean scene at sunset with gentle tides rising and falling. A tiny happy crab visible at the water's edge. The moon is rising. Peaceful and magical. ${STYLE}` },
  ],
  'cat-walked': [
    {
      name: 'page-1',
      prompt: `A proud, independent tabby cat with bright green eyes walking alone through a wild moonlit forest. All around him, wild animals (wolves, horses, cows) watch from the shadows. The cat has its tail held high. ${STYLE}`,
    },
    { name: 'page-2', prompt: `A prehistoric woman tending a warm cozy fire inside a cave home. A friendly dog sitting beside her, wagging its tail. The cave is decorated with simple drawings. Warm firelight. ${STYLE}` },
    { name: 'page-3', prompt: `A happy dog guarding the entrance of a cozy cave home while a woman gives him a bone. The dog looks loyal and proud. Warm orange cave interior. ${STYLE}` },
    { name: 'page-4', prompt: `A beautiful horse carrying bundles for a woman. The horse gets sweet hay as a reward. A cave home in background. Sunny green meadow. ${STYLE}` },
    { name: 'page-5', prompt: `A gentle spotted cow being milked by a woman near a cave home. A cozy barn in background. The cow looks content. Green meadow. ${STYLE}` },
    { name: 'page-6', prompt: `A proud tabby cat sitting on a high tree branch, looking down at all the tame animals in the cave below. The cat's expression says "I don't need anyone!" Moonlit night. ${STYLE}` },
    { name: 'page-7', prompt: `A tabby cat creeping into a cave home where a baby lies in a cradle. The cat is purring softly and the baby is smiling. Warm gentle firelight. Tender scene. ${STYLE}` },
    { name: 'page-8', prompt: `A woman welcoming a cat to sit by the warm fire. The cat purrs while a baby sleeps peacefully nearby. A tiny mouse visible in the corner. Cozy cave home. ${STYLE}` },
    { name: 'page-9', prompt: `A cat sitting contentedly by a warm fire with a family — woman, baby, dog. But the cat looks toward the open cave entrance with a glint in its eye. Warm and wild. ${STYLE}` },
    { name: 'page-10', prompt: `A tabby cat walking alone under a vast starry night sky, tail held high, heading into the wild forest. Behind him the warm glow of a cave home. Independent and free. ${STYLE}` },
  ],
  'butterfly-stamped': [
    {
      name: 'page-1',
      prompt: `A magnificent King Solomon sitting on a golden throne in a beautiful palace garden. Colourful butterflies flutter around him. He looks wise and kind. Palm trees and flowers everywhere. ${STYLE}`,
    },
    { name: 'page-2', prompt: `A beautiful large blue and gold butterfly talking to a smaller pink butterfly (his wife) in a flower garden. The blue butterfly looks proud and puffed up. The wife looks unimpressed. ${STYLE}` },
    { name: 'page-3', prompt: `A proud blue butterfly standing on a leaf, puffing out his chest, stamping his tiny foot dramatically. His wife butterfly watches skeptically. A grand palace in the background. ${STYLE}` },
    { name: 'page-4', prompt: `A pink butterfly (wife) laughing at the blue butterfly. She looks amused and disbelieving. Flower garden setting with the palace visible behind. ${STYLE}` },
    { name: 'page-5', prompt: `A worried blue butterfly flying to King Solomon's palace, looking nervous. The grand palace with golden columns. Beautiful garden. ${STYLE}` },
    { name: 'page-6', prompt: `Kind King Solomon bending down to talk to a tiny blue butterfly on his finger. The king smiles warmly. Palace interior with sunlight streaming through windows. ${STYLE}` },
    { name: 'page-7', prompt: `A blue butterfly stamping his tiny foot while behind him King Solomon secretly waves his magic staff. The palace shimmers and shakes dramatically! The wife butterfly watches amazed. ${STYLE}` },
    { name: 'page-8', prompt: `The pink butterfly wife looking absolutely amazed with wide eyes and open mouth. The palace is shimmering with magical sparkles around it. The blue butterfly looks proud. ${STYLE}` },
    { name: 'page-9', prompt: `A blue butterfly looking sheepish and humble, sitting on a flower. His wife butterfly beside him. They look loving and kind together. Soft sunset garden. ${STYLE}` },
    { name: 'page-10', prompt: `A beautiful scene of many colourful butterflies flying over a magical garden with King Solomon's palace in the background. Golden sunset. Sparkles and flowers. ${STYLE}` },
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

  console.log(`Generating images for ${slugs.length} books (${total} pages)\n`);
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
      console.log(`  ✓ ${page.name}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }

  console.log(`\n✅ Done! All images generated.`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
