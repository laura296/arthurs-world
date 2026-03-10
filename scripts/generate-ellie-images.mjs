// scripts/generate-ellie-images.mjs
// One-time script to generate all 25 Ellie story images via OpenAI gpt-image-1
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'ellie');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set VITE_OPENAI_API_KEY in .env.local');
  process.exit(1);
}

// ── Style anchors ──
const STYLE_ANCHOR = "Whimsical mid-century American children's picture book style. Bold black ink outlines. Flat saturated colours. No gradients. Wobbly imperfect curved lines. Impossible tall wiggly trees. Striped or patterned sky. Expressive cartoon faces. No text. No letters. No words.";
const ELLIE_ANCHOR = 'Ellie the lavender-purple elephant with large round kind eyes, a warm smile, a gently upward-curling trunk, rounded chubby body, large ears with pink inner ear, and a small tuft of hair on her head.';

const CHARACTER_SHEET_PROMPT = "A single character design sheet of an original cartoon elephant character named Ellie. She is lavender-purple with slightly darker purple outlines. Large round kind eyes with long eyelashes and a warm expression. Rounded chubby body proportions — she is gentle and soft-looking, not fierce. Her trunk curls upward at the tip in a friendly way. Large round ears with a soft pink inner ear. Short stubby legs. A small tuft of light hair on the top of her head. She stands facing three-quarters toward the viewer, smiling warmly. Clean white background. The art style is a mid-century American children's picture book: bold black ink outlines, flat saturated colours, no gradients, slightly wobbly imperfect lines, expressive and charming. No text. No words. No labels.";

const SCENE_PROMPTS = [
  `${ELLIE_ANCHOR} stands in a magical jungle, looking surprised and delighted. She holds a large glowing pink flower in her curled trunk. A tiny golden speck of light floats in the air right in front of her eye. Tall wobbly striped trees and enormous round leaves surround her. Warm morning sky with horizontal orange and yellow stripes. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} protectively cradles a glowing pink flower against her chest, looking brave and determined. Surrounding her are grumpy cartoon animals: a kangaroo with arms crossed and a scowl, a bossy eagle with ruffled feathers, a cheeky monkey pointing and laughing. Sunset orange and red striped sky. Tall wobbly jungle trees. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} stands with one large ear tilted forward, straining to listen, her eyes closed in concentration. In the foreground, microscopic tiny colourful people stand on a giant pink flower petal, shouting upward with arms waving and mouths wide open. Curvy sound wave lines radiate upward. Deep purple and indigo striped sky with large cartoon stars. ${STYLE_ANCHOR}`,
  `${ELLIE_ANCHOR} smiling with closed eyes and rosy cheeks, holding a pink flower aloft in joy. Tiny colourful people — a wizard in a tall hat, a queen with a crown, a baby, a chef, a musician — dance and wave on the flower petals around her. Warm golden sunrise sky with yellow and cream stripes. Confetti and stars fill the air. ${STYLE_ANCHOR}`,
];

const GAME_BG_PROMPTS = [
  `A wide open blue sky with horizontal white cloud stripes and fluffy impossible cloud shapes. At the bottom, rolling bright green hills with tiny wobbly trees. A single small glowing golden speck of light floats in the centre of the blue sky. Lots of open space. No characters. ${STYLE_ANCHOR}`,
  `A sunny jungle clearing with a large glowing pink flower on a long stem in the centre. Soft green ground with round hills. Blue and white striped sky. Tall wiggly colourful trees at the edges with plenty of open space between them. No characters — space for animals to appear from the edges. ${STYLE_ANCHOR}`,
  `A deep purple night sky filled with large cartoon stars and swirling sound wave lines radiating across the entire scene. A large lavender elephant ear at the right edge, straining forward to listen. A tiny glowing flower in the lower centre. Magical glowing atmosphere. No full characters — just the ear at edge. ${STYLE_ANCHOR}`,
  `A giant magical pink flower fills the lower two-thirds of the scene against a bright happy green background with blue and yellow striped sky. The flower has many large open petals, each with a tiny glowing doorway or hiding spot in it. Joyful celebratory atmosphere. Floating stars and sparkles. No characters — space in the petals for the Tiny Folk to appear. ${STYLE_ANCHOR}`,
];

const ANIMAL_NAMES = ['kangaroo', 'eagle', 'monkey', 'parrot', 'snake', 'lizard', 'frog', 'toucan'];
const ANIMAL_SPRITE_PROMPTS = [
  `A grumpy cartoon kangaroo with arms crossed and a scowl, looking bossy and sceptical. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A bossy cartoon eagle with ruffled feathers, puffed-up chest, and an annoyed expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A cheeky cartoon monkey pointing and laughing, mischievous expression, swinging tail. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon parrot with a big beak, squawking with wings spread, looking indignant. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A silly cartoon snake coiled up with a smirk, tongue sticking out playfully. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A small cartoon lizard with big eyes, looking curious and a bit sneaky, bright green with spots. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A round cartoon frog with big bulging eyes and a wide grin, sitting on its haunches. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon toucan with an enormous bright beak, looking proud and silly. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

const FOLK_NAMES = ['wizard', 'queen', 'baby', 'chef', 'musician', 'knight', 'painter', 'dancer'];
const FOLK_SPRITE_PROMPTS = [
  `A tiny cartoon wizard in a tall pointy hat with stars, holding a magic wand, cheerful expression, long robe. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon queen with a golden crown, flowing robe, waving regally with a warm smile. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon baby with a nappy, big round eyes, giggling with arms up, rosy cheeks. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon chef with a tall white hat, holding a wooden spoon, jolly round face. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon musician playing a trumpet, cheeks puffed out, musical notes around. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon knight in shining armour with a small shield and sword, friendly face visible through helmet. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon painter with a beret, holding a paintbrush and palette, splashes of colour on apron. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon dancer in a flowing dress, mid-twirl with arms outstretched, joyful expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── API Helpers ──

async function apiCall(url, body, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      console.log(`  Retry in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function generateImage(prompt, size = '1536x1024') {
  const data = await apiCall('https://api.openai.com/v1/images/generations', {
    model: 'gpt-image-1', prompt, n: 1, size, quality: 'high',
  });
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  if (data.data[0].url) {
    const res = await fetch(data.data[0].url);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error('No image data');
}

async function generateWithReference(refPath, prompt, size = '1536x1024') {
  const refBuffer = fs.readFileSync(refPath);
  const blob = new Blob([refBuffer], { type: 'image/png' });
  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('image[]', blob, 'reference.png');
  formData.append('prompt', prompt);
  formData.append('size', size);
  formData.append('quality', 'high');

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: formData,
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

function save(filename, buffer) {
  const out = path.join(OUT_DIR, filename);
  fs.writeFileSync(out, buffer);
  console.log(`  ✓ Saved ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

function exists(filename) {
  return fs.existsSync(path.join(OUT_DIR, filename));
}

// ── Main ──

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  const total = 1 + 4 + 4 + 8 + 8;
  const log = (msg) => { done++; console.log(`[${done}/${total}] ${msg}`); };

  // 1. Character sheet
  if (!exists('character-sheet.png')) {
    log('Generating character sheet...');
    const buf = await generateImage(CHARACTER_SHEET_PROMPT, '1024x1024');
    save('character-sheet.png', buf);
  } else { log('character-sheet.png exists, skipping'); }
  const charSheetPath = path.join(OUT_DIR, 'character-sheet.png');

  // 2. Scene images (with character reference)
  for (let i = 0; i < SCENE_PROMPTS.length; i++) {
    const fname = `scene-${i + 1}.png`;
    if (!exists(fname)) {
      log(`Generating scene ${i + 1}...`);
      const buf = await generateWithReference(charSheetPath, SCENE_PROMPTS[i]);
      save(fname, buf);
    } else { log(`${fname} exists, skipping`); }
  }

  // 3. Game backgrounds (no reference)
  for (let i = 0; i < GAME_BG_PROMPTS.length; i++) {
    const fname = `game-bg-${i + 1}.png`;
    if (!exists(fname)) {
      log(`Generating game background ${i + 1}...`);
      const buf = await generateImage(GAME_BG_PROMPTS[i]);
      save(fname, buf);
    } else { log(`${fname} exists, skipping`); }
  }

  // 4. Animal sprites (1024x1024 square)
  for (let i = 0; i < ANIMAL_SPRITE_PROMPTS.length; i++) {
    const fname = `animal-${ANIMAL_NAMES[i]}.png`;
    if (!exists(fname)) {
      log(`Generating animal: ${ANIMAL_NAMES[i]}...`);
      const buf = await generateImage(ANIMAL_SPRITE_PROMPTS[i], '1024x1024');
      save(fname, buf);
    } else { log(`${fname} exists, skipping`); }
  }

  // 5. Tiny Folk sprites (1024x1024 square)
  for (let i = 0; i < FOLK_SPRITE_PROMPTS.length; i++) {
    const fname = `folk-${FOLK_NAMES[i]}.png`;
    if (!exists(fname)) {
      log(`Generating folk: ${FOLK_NAMES[i]}...`);
      const buf = await generateImage(FOLK_SPRITE_PROMPTS[i], '1024x1024');
      save(fname, buf);
    } else { log(`${fname} exists, skipping`); }
  }

  console.log(`\n✅ All ${total} Ellie images generated in public/images/ellie/`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
