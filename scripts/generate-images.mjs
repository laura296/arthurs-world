#!/usr/bin/env node
/**
 * Unattended image generation script for all missing story pages.
 * Uses OpenAI gpt-image-1 API. Run with: node scripts/generate-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

// Load API key from .env
const envPath = path.join(ROOT, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const API_KEY = envContent.match(/VITE_OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) { console.error('No API key found in .env'); process.exit(1); }

const API_URL = 'https://api.openai.com/v1/images/generations';

const STYLE = `Whimsical children's picture-book illustration. Soft watercolour style with warm golden-hour lighting. Rounded friendly forms, gentle saturated colours, amber and golden tones. Safe, curious, gentle mood. No text, no letters, no words anywhere in the image. Designed for a 3-year-old child.`;

const STORIES = {
  'ant-grasshopper': [
    "A little ant carrying food on a sunny summer day, walking along a path near her cosy ant hill, bright green grass and flowers",
    "A happy grasshopper singing and dancing in sunshine with musical notes around him, green meadow",
    "The grasshopper talking to the busy ant, grasshopper relaxed and playful, ant carrying a berry",
    "The ant storing berries and seeds inside her cosy underground home, jars of food on shelves",
    "A snowy winter scene, cold wind blowing, bare trees, snowflakes falling, grey sky",
    "The grasshopper shivering in the cold snow, looking hungry and sad, no food around",
    "The kind ant opening her door to the cold grasshopper, warm light from inside, food visible",
    "The ant and grasshopper sharing food together inside the cosy warm home, both smiling happily",
  ],
  'boy-cried-wolf': [
    "A little shepherd boy sitting on a green hill with fluffy white sheep, peaceful countryside",
    "The boy shouting with hands cupped around mouth, sheep in background, mischievous grin",
    "Villagers running up a hill looking worried, the boy laughing, sheep grazing peacefully",
    "The boy shouting again from the hilltop, waving arms dramatically",
    "Angry villagers shaking their heads and walking away from the boy on the hill",
    "A sneaky grey wolf creeping out from dark forest trees, the boy looking terrified",
    "The boy crying for help on the hilltop, wolf approaching sheep, empty village below",
    "A kind farmer chasing the wolf away, the boy looking relieved and sorry",
  ],
  'fox-grapes': [
    "A hungry orange fox walking through a sunny forest, looking around for food",
    "The fox gazing up at beautiful big purple grapes hanging high on a vine, drooling",
    "The fox jumping up high trying to reach the grapes, stretching his paws up",
    "The fox jumping again with more effort, grapes still too high, determined expression",
    "The fox making one huge leap with all his might, grapes just out of reach",
    "The fox walking away with nose in the air looking grumpy, grapes behind him",
    "A little bird on a branch watching the fox walk away, amused expression",
    "The fox walking into the distance through the forest, purple grapes glowing on the vine",
  ],
  'lion-mouse': [
    "A big golden lion sleeping peacefully in warm sunshine under a tree in the savanna",
    "A tiny brown mouse running across the lion's nose, the lion waking up surprised",
    "The lion holding the tiny mouse in his big paw, the mouse looking up pleadingly",
    "The lion laughing and letting the tiny mouse go free, mouse scurrying away happily",
    "The lion tangled in a big rope net in the forest, looking sad and trapped",
    "The tiny mouse running towards the trapped lion with a determined face",
    "The mouse nibbling through the rope net with her tiny teeth, strands breaking",
    "The lion free and happy, the tiny mouse sitting on his paw, both smiling as friends",
  ],
  'tortoise-hare': [
    "A boastful hare running super fast showing off, dust clouds behind, forest animals watching",
    "A small tortoise challenging the hare to a race, the hare laughing, woodland setting",
    "Race starting — hare zooming ahead in a blur, tortoise taking first slow step",
    "The hare sleeping under a shady tree, snoring with Zzz letters, peaceful countryside",
    "The tortoise walking steadily along the race path, determined face, one step at a time",
    "The tortoise tiptoeing past the sleeping hare, quiet and careful",
    "The hare waking up shocked, seeing the tortoise near the finish line ribbon ahead",
    "The tortoise crossing the finish line first, woodland animals cheering, celebratory scene",
  ],
  'town-country-mouse': [
    "A little brown mouse in a cosy hole under a big oak tree, countryside with flowers",
    "Two mice greeting each other — a country mouse and a fancy town mouse with a little hat",
    "Country mouse serving simple seeds and berries on a leaf plate, town mouse looking disappointed",
    "Two small mice gazing up at big city buildings and bright lights, looking amazed",
    "Two mice in a fancy house eating cheese, cake and chocolate on a big table",
    "A big scary cat jumping out, two tiny mice running away terrified",
    "Two mice hiding in a tiny crack in the wall, the cat's eye peering in",
    "The country mouse happily back home in his cosy hole, simple food, peaceful and safe",
  ],
  'feelings-monster': [
    "A cute fluffy monster with all different colours muddled together — red, blue, yellow, green, purple — looking confused",
    "A bright yellow happy monster jumping with joy, sunshine and rainbows around, warm scene",
    "A blue sad monster with rain drops, looking down gently, soft comforting scene",
    "A red angry monster with steam, then taking a deep calming breath, two-part feeling",
    "A small dark purple scared monster looking nervous, then getting a warm hug",
    "A soft green calm monster floating peacefully like a gentle breeze, serene scene",
    "A pink monster surrounded by hearts, giving warm cuddles, loving gentle scene",
    "All the coloured feeling monsters together in a row — yellow, blue, red, purple, green, pink — all smiling",
  ],
  'feelings-friends': [
    "A group of cute animal friends — bunny, kitten, puppy, hedgehog, duckling, owl — all together waving",
    "A happy bunny hopping joyfully through a meadow with flowers, big smile",
    "A sad little kitten looking for a lost toy, tearful eyes, needing a cuddle",
    "A grumpy puppy growling over a missing bone, learning to count to three to calm down",
    "A scared hedgehog curled up tight in a ball, gentle encouraging scene",
    "A silly duckling walking backwards and quacking, being wonderfully goofy and fun",
    "A wise owl giving warm cuddles with big soft wings, hearts floating around",
    "All the animal friends gathered together in a circle, hugging and smiling, warm group scene",
  ],
  'when-i-feel-big': [
    "A small cute brown bear cub with very big colourful feelings swirling around him",
    "Little Bear bouncing excitedly with fizzy sparkles in his tummy, happy energetic scene",
    "Little Bear frustrated with a fallen-down block tower, wanting to stamp his feet",
    "Little Bear looking worried with swirly thoughts above his head, knotty tummy feeling",
    "Little Bear standing proud with puffed-up chest, having done something by himself, gold star",
    "Little Bear peeking shyly from behind his mummy bear, one eye showing",
    "Little Bear yawning sleepily with droopy eyes, cosy bedtime scene, moonlight",
    "Little Bear surrounded by all his feelings like colourful friends, being hugged and loved",
  ],
  'captain-hook': [
    "Captain Hook on his pirate ship in Neverland, skull and crossbones flag, stormy sea",
    "Captain Hook looking fearsome with his hook hand, but scared of something",
    "A green crocodile with a ticking clock in its belly, tick-tock sound waves, Captain Hook terrified",
    "Peter Pan flying over the pirate ship, playing tricks, green outfit, mischievous grin",
    "Captain Hook holding a treasure map with X marks the spot, Skull Island in background",
    "Peter Pan and Captain Hook having a sword fight on the ship deck, exciting action scene",
    "The Lost Boys on a plank over the sea, Peter Pan swooping in to save them",
    "Captain Hook falling off the ship into the water, the crocodile waiting below with open mouth",
    "Captain Hook running away across the water, crocodile chasing him, tick-tock sounds",
    "Peter Pan and the Lost Boys celebrating in Neverland, happy tropical island party scene",
  ],
  'cinderella': [
    "A kind girl in a simple dress cleaning the floor while her mean stepsisters boss her around",
    "A golden royal invitation arriving at the door, sparkles, fancy palace in the distance",
    "Cinderella sad and alone by the fireplace while stepsisters leave in fancy dresses",
    "A magical Fairy Godmother appearing in sparkles and light, waving a magic wand",
    "A pumpkin transforming into a beautiful golden carriage with magic sparkles",
    "Cinderella in a gorgeous sparkling ball gown with glass slippers, magical transformation",
    "Cinderella and the Prince dancing together in a beautiful palace ballroom, chandeliers",
    "Cinderella running down palace steps at midnight, losing a glass slipper, clock striking twelve",
    "The Prince holding a glass slipper, trying it on Cinderella's foot, perfect fit",
    "Cinderella and the Prince together at the palace, happily ever after, surrounded by flowers",
  ],
  'snow-white': [
    "Beautiful Snow White with black hair and red lips in a forest with friendly woodland animals",
    "The Evil Queen looking into her ornate magic mirror on the wall, dark castle",
    "Snow White running through a dark scary forest with tall twisted trees",
    "Snow White finding a tiny cute cottage in a woodland clearing, flowers around the door",
    "Seven cheerful little dwarfs with different coloured hats working in a sparkly diamond mine",
    "The Evil Queen disguised as an old woman offering a shiny red apple",
    "Snow White asleep on a bed of flowers, the seven dwarfs gathered around her sadly",
    "A brave prince on a white horse riding through the enchanted forest",
    "The Prince kissing Snow White's hand, magical sparkles as she wakes up, golden light",
    "Snow White, the Prince, and all seven dwarfs celebrating together in the forest, happily ever after",
  ],
  'pooh': [
    "Winnie the Pooh — a cute round yellow bear in a red shirt — waking up in his tree house, stretching",
    "Pooh looking sadly into an empty honey pot, upside down, dripping the last drop",
    "Pooh visiting his tiny friend Piglet at Piglet's little house, both smiling",
    "Tigger bouncing in energetically — an orange stripy bouncy tiger — spring in his tail",
    "Pooh climbing up a big tree with a beehive, bees buzzing around, honey dripping",
    "Pooh falling into a mud puddle with bees chasing him, funny splashy scene",
    "Pooh and friends at Rabbit's tidy house, Rabbit showing shelves full of honey pots",
    "Pooh stuck in Rabbit's round front door, too full of honey, bottom sticking out",
    "Everyone pulling Pooh — POP — he flies out of the doorway through the air",
    "Pooh and all his friends — Piglet, Tigger, Rabbit, Eeyore — sharing honey together under a tree",
  ],
};

// Count total
let total = 0;
let generated = 0;
let skipped = 0;
let failed = 0;
for (const pages of Object.values(STORIES)) total += pages.length;
console.log(`\n🎨 Generating ${total} story images...\n`);

async function generateImage(prompt, outputPath) {
  const fullPrompt = `${prompt}\n\nStyle: ${STYLE}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: fullPrompt,
          n: 1,
          size: '1536x1024',
          quality: 'medium',
        }),
      });

      if (res.status === 429) {
        const wait = Math.pow(2, attempt + 1) * 5000;
        console.log(`  ⏳ Rate limited, waiting ${wait/1000}s...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const b64 = data.data[0].b64_json;
      if (b64) {
        fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
        return true;
      }
      const url = data.data[0].url;
      if (url) {
        const imgRes = await fetch(url);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(outputPath, buf);
        return true;
      }
      throw new Error('No image data in response');
    } catch (e) {
      if (attempt === 2) throw e;
      const wait = Math.pow(2, attempt + 1) * 2000;
      console.log(`  ⚠️  Retry ${attempt + 1}: ${e.message}. Waiting ${wait/1000}s...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

async function run() {
  for (const [storyId, pages] of Object.entries(STORIES)) {
    const dir = path.join(IMAGES_DIR, storyId);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`📖 ${storyId} (${pages.length} pages)`);

    for (let i = 0; i < pages.length; i++) {
      const pageNum = i + 1;
      const outputPath = path.join(dir, `page-${pageNum}.png`);

      if (fs.existsSync(outputPath)) {
        const stat = fs.statSync(outputPath);
        if (stat.size > 1000) {
          skipped++;
          console.log(`  ✅ page-${pageNum}.png already exists (${(stat.size/1024).toFixed(0)}KB)`);
          continue;
        }
      }

      try {
        console.log(`  🖌️  Generating page-${pageNum}... (${generated + skipped + failed + 1}/${total})`);
        await generateImage(pages[i], outputPath);
        generated++;
        console.log(`  ✅ page-${pageNum}.png saved`);
        // Small delay between requests to be nice to the API
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        failed++;
        console.error(`  ❌ page-${pageNum} FAILED: ${e.message}`);
      }
    }
  }

  console.log(`\n✨ Done! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}\n`);
}

run().catch(e => { console.error('Fatal error:', e); process.exit(1); });
