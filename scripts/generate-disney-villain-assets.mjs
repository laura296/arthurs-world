#!/usr/bin/env node
// scripts/generate-disney-villain-assets.mjs
// Generates all image assets for Hades River Styx and Ursula Potions games
// Usage: node scripts/generate-disney-villain-assets.mjs [--force]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'disney');
const FORCE = process.argv.includes('--force');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Whimsical Disney-style children's illustration. Rich saturated colours. Painterly digital art. Soft lighting. Magical atmosphere. Child-friendly. No text. No words. No letters. No numbers.";

const ASSETS = {
  // ── Hades River Styx ──
  'hades/bg': `A dark magical underworld river scene — the River Styx. Deep purple and indigo twilight sky with swirling magical mist. A glowing ethereal green-blue river winding through dark rocky cliffs. Ghostly wisps of light floating above the water. Ancient Greek columns partially submerged. Eerie but beautiful, not scary — suitable for young children. Magical fireflies and spirit orbs glowing in purple and blue. ${STYLE}`,

  'hades/ghost': `A cute friendly cartoon ghost floating in the air, round and chubby with big cheerful eyes. Translucent white-blue-purple glow. Wispy tail. Adorable expression — playful not scary. Transparent background. ${STYLE}`,

  'hades/skeleton': `A cute cartoon skeleton character dancing happily. Small and round, not scary at all. Big happy eye sockets with glowing blue lights inside. Doing a silly dance pose. White bones with a soft purple glow. Child-friendly. Transparent background. ${STYLE}`,

  'hades/bat': `An adorable cartoon bat with big purple eyes and tiny fangs showing in a smile. Small rounded wings spread wide. Dark purple fur with lighter purple belly. Cute and cuddly looking. Transparent background. ${STYLE}`,

  'hades/flame': `A magical glowing spirit flame — a ball of beautiful blue and purple fire with a cute face visible in the flames. Warm and magical, not menacing. Ethereal wisps trailing behind it. Transparent background. ${STYLE}`,

  'hades/cerberus': `An adorable cartoon three-headed puppy (baby Cerberus). Three cute puppy heads with floppy ears, each with a different silly expression. Small dark body with a glowing red collar. Chubby paws. Adorable not scary. Transparent background. ${STYLE}`,

  'hades/hades-character': `Hades from Greek mythology reimagined as a friendly cartoon character for children. Blue skin, fiery blue hair that flickers upward like a flame. Wearing a dark flowing robe with purple and blue accents. Friendly grin, not menacing. Tall and lanky. Cool and stylish. ${STYLE}`,

  // ── Ursula Potions ──
  'ursula/bg': `Ursula the sea witch's underwater lair — a dark magical grotto deep under the ocean. Glowing purple and magenta bioluminescent plants. A large ornate cauldron in the center bubbling with purple magical liquid. Shelves of potion bottles glowing in different colours. Tentacle-shaped coral formations. Beautiful and magical, slightly spooky but child-friendly. Deep ocean blues and purples. ${STYLE}`,

  'ursula/cauldron': `A large ornate magical cauldron bubbling with glowing purple potion. Intricate sea-themed decorations on the cauldron — shells, tentacles, coral. Purple and magenta magical bubbles rising from the top. Ethereal purple glow emanating from inside. Beautiful metallic dark iron with golden accents. Transparent background. ${STYLE}`,

  'ursula/ursula-character': `Ursula the sea witch reimagined as a friendly cartoon character for young children. Purple skin, white voluminous hair. Wearing a black dress with purple tentacles visible below. Holding a glowing magical shell. Big expressive eyes, mischievous but friendly smile. Chubby and fun looking. ${STYLE}`,

  // Potion ingredients (each on transparent/simple bg)
  'ursula/ing-shell': `A beautiful magical glowing seashell — iridescent pink and purple spiral shell with magical sparkles around it. Precious and enchanted looking. Simple background. ${STYLE}`,

  'ursula/ing-wave': `A swirling ball of magical ocean water — a perfect sphere of deep blue water with white foam and tiny fish visible inside. Glowing with blue magical energy. Simple background. ${STYLE}`,

  'ursula/ing-music': `A magical floating music note made of golden light — a treble clef surrounded by sparkles and tiny stars. Ethereal and glowing. Musical magic. Simple background. ${STYLE}`,

  'ursula/ing-mushroom': `A magical glowing mushroom — bioluminescent deep-sea mushroom with a purple cap dotted with glowing blue spots. Ethereal underwater fungus. Simple background. ${STYLE}`,

  'ursula/ing-squid': `A cute tiny cartoon squid — baby squid with big adorable eyes, small tentacles, purple-pink colour. Holding a tiny bottle. Friendly and sweet. Simple background. ${STYLE}`,

  'ursula/ing-star': `A magical golden starfish with five perfect points — glowing with warm golden light and sparkles. Enchanted sea star radiating magic. Simple background. ${STYLE}`,

  'ursula/ing-bubble': `A large iridescent magical bubble — rainbow reflections on the surface, tiny sparkles inside. Perfect sphere floating with a soft glow. Enchanted and beautiful. Simple background. ${STYLE}`,

  'ursula/ing-seaweed': `Magical glowing seaweed — emerald green underwater plant with bioluminescent tips that glow blue-green. Flowing gracefully as if in current. Enchanted. Simple background. ${STYLE}`,

  'ursula/ing-crystal': `A beautiful magical crystal gem — deep purple amethyst with facets reflecting purple and blue light. Floating and glowing with inner magical energy. Simple background. ${STYLE}`,

  'ursula/ing-lightning': `A magical ball of captured lightning — a sphere of crackling blue-white electrical energy with purple sparks. Powerful and beautiful. Simple background. ${STYLE}`,

  'ursula/ing-wind': `A swirling magical wind spirit — a cute whirlwind of silver and white air currents forming a spiral shape. Sparkles caught in the wind. Simple background. ${STYLE}`,

  'ursula/ing-moon': `A glowing crescent moon charm — silvery white crescent with a dreamy face, surrounded by tiny stars and magical silver sparkles. Enchanted nighttime magic. Simple background. ${STYLE}`,

  'ursula/ing-crab': `A cute cartoon crab — small red-orange crab with big friendly eyes and raised claws, wearing a tiny crown. Adorable sea creature. Simple background. ${STYLE}`,

  'ursula/ing-rose': `A magical glowing sea rose — an underwater flower with deep red petals that glow pink at the edges. Bioluminescent and enchanted. Tiny sparkles. Simple background. ${STYLE}`,

  // Silly result images
  'ursula/silly-frog': `A very surprised cartoon frog with its mouth wide open making a funny noise. Big bulging eyes, green and yellow. Underwater magical setting. Hilarious expression. ${STYLE}`,

  'ursula/silly-duck': `Many rubber ducks raining down from above in an underwater magical scene. Yellow rubber ducks falling everywhere. Silly and absurd. Cartoon style. ${STYLE}`,

  'ursula/silly-clown': `A magical cauldron wearing a big red clown nose. The cauldron looks embarrassed. Purple bubbles coming from the top. Silly and funny. ${STYLE}`,

  'ursula/silly-rainbow': `A beautiful rainbow bursting out of a magical cauldron instead of the expected dark magic. Sparkles and flowers everywhere. Bright happy colours in an otherwise dark underwater lair. Funny contrast. ${STYLE}`,

  // Potion result bottles
  'ursula/potion-voice': `A beautiful magical potion bottle shaped like a seashell, filled with swirling purple and pink liquid. A tiny musical note floats inside. Glowing ethereally. ${STYLE}`,

  'ursula/potion-tentacle': `A magical potion bottle with tiny tentacles growing out of the cork. The purple liquid inside is bubbling. Octopus-themed bottle. Funny and magical. ${STYLE}`,

  'ursula/potion-storm': `A magical potion bottle with a tiny thunderstorm happening inside — miniature lightning bolts and swirling clouds in blue liquid. Dramatic and beautiful. ${STYLE}`,

  'ursula/potion-giant': `A magical potion bottle that appears to be growing larger — the glass is stretching and expanding. Glowing golden liquid inside. Magical size-changing energy radiating outward. ${STYLE}`,

  'ursula/potion-beauty': `A gorgeous ornate crystal potion bottle filled with shimmering pink and diamond-like liquid. Sparkles and tiny gems floating around it. The most beautiful potion ever made. ${STYLE}`,
};

async function generateImage(prompt, size = '1024x1024') {
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size, quality: 'high' }),
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
  const entries = Object.entries(ASSETS);
  console.log(`Generating ${entries.length} Disney villain game assets\n`);
  let done = 0;

  for (const [key, prompt] of entries) {
    const outPath = path.join(IMG_DIR, `${key}.png`);
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });

    if (!FORCE && fs.existsSync(outPath)) {
      console.log(`[${++done}/${entries.length}] ${key}.png exists, skipping`);
      continue;
    }

    // Use wider aspect for backgrounds
    const size = key.endsWith('/bg') ? '1536x1024' : '1024x1024';
    console.log(`[${++done}/${entries.length}] ${key} (${size})...`);
    try {
      const buf = await generateImage(prompt, size);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ ${key}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ✗ FAILED: ${e.message}`);
    }
  }

  console.log(`\n✅ Done! All villain game assets generated.`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
