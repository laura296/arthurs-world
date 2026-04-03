#!/usr/bin/env node
/**
 * Generate all missing images using OpenAI's gpt-image-1 model.
 * Reads prompts from src/data/imagePrompts.js pattern and saves PNGs
 * directly to public/images/.
 *
 * Usage: OPENAI_API_KEY=sk-... node scripts/generate-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY or VITE_OPENAI_API_KEY');
  process.exit(1);
}

const STYLE_PREFIX =
  'Pixar-quality soft 3D rendered illustration for a children\'s storybook. ' +
  'Warm golden-hour lighting, rounded forms, subsurface scattering feel. ' +
  'Safe, curious, gentle mood. Saturated warm amber palette, shadows lean purple/blue never grey. ' +
  'No text, no words, no letters, no UI elements.';

// All prompts: key = relative path under /images/, value = scene description
const ALL_PROMPTS = {
  // Section Heroes
  'sections/games.png': 'A magical playroom filled with soft toys, colourful building blocks, and a friendly bear cub peeking through a toy castle. Warm amber light streams through a window.',
  'sections/art.png': 'A cosy art studio with paintbrushes in jars, splashes of rainbow paint, an easel with a half-finished painting of a rainbow. Crayons and paper scattered on a wooden table.',
  'sections/books.png': 'A magical library nook with a comfy armchair, stacked storybooks with glowing pages, fairy lights, and a friendly owl perched on a bookshelf. Warm candlelight glow.',
  'sections/music.png': 'A whimsical music room with a tiny piano, colourful xylophone, floating musical notes made of gold light, tambourines, and a friendly robin singing on a branch.',
  'sections/videos.png': 'A cosy den with soft cushions arranged in front of a glowing screen showing colourful shapes. Popcorn bowl, fairy lights, warm amber glow from the screen.',

  // Tortoise & Hare
  'tortoise-hare/page-1.png': 'A speedy brown hare showing off, running in circles around woodland animals. Green meadow, blue sky, forest edge.',
  'tortoise-hare/page-2.png': 'A small green tortoise looking up confidently at a laughing hare. Other woodland animals watching. Sunny meadow.',
  'tortoise-hare/page-3.png': 'A race starting line with a hare zooming ahead in a blur and a tortoise taking his first slow step. Cheering woodland animals on the sidelines.',
  'tortoise-hare/page-4.png': 'A hare sleeping peacefully under a shady tree, snoring with a smile. Dappled sunlight, butterflies, peaceful meadow.',
  'tortoise-hare/page-5.png': 'A determined tortoise walking steadily along a country path, one step at a time. Rolling green hills, warm sunshine.',
  'tortoise-hare/page-6.png': 'A tortoise tiptoeing carefully past a sleeping hare under a tree. Finger-to-lips gesture, quiet peaceful scene.',
  'tortoise-hare/page-7.png': 'A panicked hare waking up and seeing the tortoise near the finish line ribbon in the distance. Shocked expression.',
  'tortoise-hare/page-8.png': 'A happy tortoise crossing a finish line with a gold ribbon, woodland animals cheering. Confetti, celebration, blue sky.',

  // Lion & Mouse
  'lion-mouse/page-1.png': 'A great golden lion sleeping peacefully in warm sunshine on the African savanna. Tall grass, acacia tree.',
  'lion-mouse/page-2.png': 'A tiny brown mouse accidentally running across a sleeping lion\'s nose. The lion\'s eyes popping open in surprise.',
  'lion-mouse/page-3.png': 'A big lion holding a tiny mouse gently in his paw. The mouse is pleading with big eyes. Savanna background.',
  'lion-mouse/page-4.png': 'A lion laughing heartily while a tiny mouse walks away proudly. Warm savanna, golden light.',
  'lion-mouse/page-5.png': 'A sad lion tangled in a thick rope net, trapped. Dark moody scene with hunters\' torches in the distance.',
  'lion-mouse/page-6.png': 'A tiny brave mouse running toward a trapped lion in a net, determined expression. Dramatic lighting.',
  'lion-mouse/page-7.png': 'Close-up of a tiny mouse nibbling through thick ropes of a net with sharp teeth. Focused, determined.',
  'lion-mouse/page-8.png': 'A freed lion nuzzling a tiny mouse sitting on his paw. Both smiling. Warm golden sunset, savanna.',

  // Boy Cried Wolf
  'boy-cried-wolf/page-1.png': 'A little shepherd boy sitting on a big green hill with fluffy white sheep grazing peacefully. Blue sky, wildflowers.',
  'boy-cried-wolf/page-2.png': 'A bored shepherd boy with a mischievous grin, cupping his hands around his mouth to shout. Sheep grazing behind him.',
  'boy-cried-wolf/page-3.png': 'Villagers running up a green hill with pitchforks and tools, looking worried. The boy laughing. No wolf anywhere.',
  'boy-cried-wolf/page-4.png': 'The same shepherd boy shouting again from the hilltop, looking cheeky. Sheep looking unimpressed.',
  'boy-cried-wolf/page-5.png': 'Angry villagers shaking their fists at a giggling boy on a hill. Red faces, crossed arms. Sunny day.',
  'boy-cried-wolf/page-6.png': 'A scary grey wolf creeping out of a dark forest edge toward sheep on a hill. The boy looking terrified.',
  'boy-cried-wolf/page-7.png': 'A scared boy shouting desperately from a hilltop. The village below is ignoring him. Wolf approaching sheep.',
  'boy-cried-wolf/page-8.png': 'A kind farmer chasing a wolf away with a stick. The relieved boy hugging a sheep. Warm sunset.',

  // Ant & Grasshopper
  'ant-grasshopper/page-1.png': 'A tiny ant carrying a big grain of wheat on a hot summer day. Bright sunshine, wildflowers, green grass.',
  'ant-grasshopper/page-2.png': 'A happy green grasshopper singing and dancing on a leaf, playing a tiny fiddle. Bright summer meadow.',
  'ant-grasshopper/page-3.png': 'A grasshopper leaning casually on a flower, talking to a busy ant carrying food. Summer meadow.',
  'ant-grasshopper/page-4.png': 'An ant\'s cosy underground home filled with neatly stacked seeds, berries and grain. Warm interior light.',
  'ant-grasshopper/page-5.png': 'A snowy winter landscape. Bare trees, snowflakes falling, cold blue light. Wind blowing.',
  'ant-grasshopper/page-6.png': 'A shivering, sad grasshopper in the snow, hugging himself. Empty stomach, cold blue tones.',
  'ant-grasshopper/page-7.png': 'A kind ant opening her cosy warm door to a shivering grasshopper. Warm light spilling out into the snow.',
  'ant-grasshopper/page-8.png': 'An ant and grasshopper sharing food together at a tiny table inside a warm cosy burrow. Happy ending.',

  // Fox & Grapes
  'fox-grapes/page-1.png': 'A hungry orange fox walking through a sunny woodland path. Dappled light, green leaves, curious expression.',
  'fox-grapes/page-2.png': 'A fox looking up wide-eyed at big juicy purple grapes hanging high on a vine above. Mouth watering.',
  'fox-grapes/page-3.png': 'A fox jumping high into the air trying to reach purple grapes on a tall vine. Dynamic pose, stretching.',
  'fox-grapes/page-4.png': 'A fox jumping again and again, each time missing the grapes. Multiple jump poses, getting frustrated.',
  'fox-grapes/page-5.png': 'A fox making one final enormous leap with all his might toward the grapes. Maximum stretch, dramatic.',
  'fox-grapes/page-6.png': 'A tired, grumpy fox sitting on the ground looking up at the grapes with a scowl. Arms crossed.',
  'fox-grapes/page-7.png': 'A fox walking away with his nose in the air, looking snooty. A little blue bird watching from a branch.',
  'fox-grapes/page-8.png': 'A little blue bird eating a grape happily on the vine. The fox small in the distance walking away. Moral moment.',

  // Town & Country Mouse
  'town-country-mouse/page-1.png': 'A cute brown mouse in a cosy underground home beneath a big oak tree. Simple furniture, acorn cups, warm.',
  'town-country-mouse/page-2.png': 'Two mice cousins greeting each other — one in a country hat, one in a city bowtie. Under the oak tree.',
  'town-country-mouse/page-3.png': 'Country mouse serving seeds and berries on a tiny leaf plate. Town mouse looking unimpressed. Simple burrow.',
  'town-country-mouse/page-4.png': 'Two tiny mice looking up in awe at enormous city buildings and bright lights. Night scene, dramatic scale.',
  'town-country-mouse/page-5.png': 'Two mice on a huge dining table with giant cheese wheels, cakes and chocolate. Eyes wide with amazement.',
  'town-country-mouse/page-6.png': 'A big scary ginger cat leaping toward two terrified mice on a table. Dramatic, scary but cartoonish.',
  'town-country-mouse/page-7.png': 'Two mice hiding in a tiny crack in a wall, peeking out with big scared eyes. Cat\'s paw visible outside.',
  'town-country-mouse/page-8.png': 'A happy country mouse back in his cosy burrow under the oak tree, snuggling into bed. Peaceful, safe.',

  // Feelings Monster
  'feelings-monster/page-1.png': 'A cute round fluffy monster with all colours of the rainbow swirled together — muddled and confused. Big googly eyes.',
  'feelings-monster/page-2.png': 'A bright YELLOW fluffy monster jumping joyfully. Sunshine beams, sparkles, happy flowers blooming around him.',
  'feelings-monster/page-3.png': 'A BLUE fluffy monster sitting in gentle rain, one tear rolling down. Soft, empathetic, not scary. Rainclouds.',
  'feelings-monster/page-4.png': 'A RED fluffy monster with steam coming from his ears, fists clenched. Then taking a deep breath, calming down.',
  'feelings-monster/page-5.png': 'A small BLACK fluffy monster curled up in a dark corner, looking nervous. A gentle warm light approaching.',
  'feelings-monster/page-6.png': 'A soft GREEN fluffy monster floating peacefully on a cloud. Gentle breeze, leaves drifting, serene sky.',
  'feelings-monster/page-7.png': 'A warm PINK fluffy monster giving a big hug. Hearts floating around, warm rosy glow, cosy.',
  'feelings-monster/page-8.png': 'All the coloured monsters together in a group — yellow, blue, red, black, green, pink — sorted and happy. Rainbow.',

  // When I Feel Big
  'when-i-feel-big/page-1.png': 'A small cute brown bear cub sitting alone, looking overwhelmed. Swirling colourful feelings visible as auras around him.',
  'when-i-feel-big/page-2.png': 'A bear cub bouncing with excitement, fizzy sparkles in his tummy area. Bright, energetic, yellow sparkles.',
  'when-i-feel-big/page-3.png': 'A frustrated bear cub looking at a toppled tower of building blocks. Furrowed brow, stamping one foot.',
  'when-i-feel-big/page-4.png': 'A worried bear cub with thought bubbles full of question marks and "what if" swirls. Knotty tummy visual.',
  'when-i-feel-big/page-5.png': 'A proud bear cub puffing out his chest with a big smile, arms on hips. Gold star glow, accomplished feeling.',
  'when-i-feel-big/page-6.png': 'A shy bear cub hiding behind a bigger mama bear, peeking out with one eye. Gentle, sweet, soft light.',
  'when-i-feel-big/page-7.png': 'A sleepy bear cub with droopy eyes doing a big yawn. Stars and moons, bedtime colours, cosy pajamas.',
  'when-i-feel-big/page-8.png': 'A bear cub surrounded by soft glowing orbs of different colours representing all feelings. Warm, accepting, loved.',

  // Feelings Friends
  'feelings-friends/page-1.png': 'A group of cute baby animals — bunny, kitten, puppy, hedgehog, duckling, owl — sitting together in a meadow circle.',
  'feelings-friends/page-2.png': 'A happy white bunny hopping joyfully through a flower meadow. Daisies, butterflies, bright sunshine.',
  'feelings-friends/page-3.png': 'A sad grey kitten with big teary eyes looking for a lost toy mouse. Soft, empathetic mood.',
  'feelings-friends/page-4.png': 'An angry brown puppy growling with furrowed brows. A stolen bone nearby. Counting bubbles: 1, 2, 3.',
  'feelings-friends/page-5.png': 'A scared hedgehog curled into a ball in a dark corner. A gentle light approaching. Protective, comforting.',
  'feelings-friends/page-6.png': 'A silly yellow duckling walking backwards with feet in the air, quacking. Other animals giggling. Playful.',
  'feelings-friends/page-7.png': 'A warm brown owl with wings spread wide giving a big feathery hug. Hearts, warmth, cosy nest.',
  'feelings-friends/page-8.png': 'All the animal friends together in a warm group cuddle — bunny, kitten, puppy, hedgehog, duckling, owl. Rainbow above.',

  // Cinderella
  'disney/cinderella/page-1.png': 'A kind young girl in a simple dress sweeping a grand hallway while two mean stepsisters watch. Classic fairy tale manor.',
  'disney/cinderella/page-2.png': 'A golden envelope with a royal seal being opened. A sparkling palace visible through a window in the distance.',
  'disney/cinderella/page-3.png': 'The stepsisters leaving in a fancy carriage while Cinderella watches sadly from a window. Night sky, stars.',
  'disney/cinderella/page-4.png': 'A beautiful fairy godmother appearing in a burst of sparkles and light. Magic wand, kind smile, glowing.',
  'disney/cinderella/page-5.png': 'A large orange pumpkin magically transforming into a golden ornate coach. Sparkles, magic swirls, mice watching.',
  'disney/cinderella/page-6.png': 'Cinderella in a stunning blue ball gown with sparkling glass slippers. Magical transformation moment, sparkles.',
  'disney/cinderella/page-7.png': 'A prince and Cinderella dancing together in a grand ballroom. Chandeliers, golden light, other guests watching.',
  'disney/cinderella/page-8.png': 'Cinderella running down palace steps at midnight, a clock tower showing 12. One glass slipper left on the steps.',
  'disney/cinderella/page-9.png': 'A prince kneeling, fitting a glass slipper onto Cinderella\'s foot. Perfect fit, both smiling. Hopeful scene.',
  'disney/cinderella/page-10.png': 'Cinderella and the Prince in a wedding scene at the palace. Fireworks, celebration, happily ever after.',

  // Snow White
  'disney/snow-white/page-1.png': 'A beautiful princess with black hair and a blue-and-yellow dress in a castle garden. Birds and deer around her.',
  'disney/snow-white/page-2.png': 'An evil queen in a dark crown standing before a glowing ornate magic mirror on a wall. Dark castle interior.',
  'disney/snow-white/page-3.png': 'A frightened girl running through a dark scary forest. Gnarled trees, shadows, but golden light ahead.',
  'disney/snow-white/page-4.png': 'A tiny adorable cottage in a forest clearing. Tiny door, tiny windows, flower boxes. Charming and miniature.',
  'disney/snow-white/page-5.png': 'Seven small cheerful dwarfs marching home from a sparkling diamond mine, carrying picks and lanterns. Singing.',
  'disney/snow-white/page-6.png': 'An old woman in a dark cloak offering a shiny red apple. Sinister but cartoonish. Forest cottage doorstep.',
  'disney/snow-white/page-7.png': 'Snow White asleep on a bed of flowers, the seven dwarfs crying around her. Soft, sad, gentle light.',
  'disney/snow-white/page-8.png': 'A brave prince on a white horse riding through a dark enchanted forest toward a glowing cottage.',
  'disney/snow-white/page-9.png': 'A prince leaning over sleeping Snow White, a magical golden glow as she wakes up. Spell breaking, joyful.',
  'disney/snow-white/page-10.png': 'Snow White and the Prince riding away on a white horse. The seven dwarfs waving. Castle on a hill, rainbow.',

  // Winnie the Pooh
  'disney/pooh/page-1.png': 'A small yellow bear in a red shirt waking up and stretching in a cosy treehouse bedroom. Hundred Acre Wood.',
  'disney/pooh/page-2.png': 'A sad yellow bear looking into an empty honey pot, turning it upside down. Not a single drop. Treehouse.',
  'disney/pooh/page-3.png': 'A small yellow bear visiting a very tiny pink piglet outside a tiny house with a "TRESPASSERS WILL" sign.',
  'disney/pooh/page-4.png': 'A bouncy orange tiger with black stripes bouncing in energetically. Spring-loaded tail, huge grin. Forest path.',
  'disney/pooh/page-5.png': 'A yellow bear, pink piglet, and tiger looking up at a tall tree buzzing with bees. Honey dripping.',
  'disney/pooh/page-6.png': 'A yellow bear falling from a tree into a mud puddle, bees chasing him. Splashy, funny, cartoonish.',
  'disney/pooh/page-7.png': 'A fussy orange rabbit opening his door to friends. His house is neat and tidy with lots of honey jars.',
  'disney/pooh/page-8.png': 'A round yellow bear stuck in a rabbit\'s round front door, legs dangling outside. Comically stuck. Honey on face.',
  'disney/pooh/page-9.png': 'All the animals pulling the bear out of the door — POP! The bear flying through the air. Dramatic, funny.',
  'disney/pooh/page-10.png': 'All the Hundred Acre Wood friends sitting together sharing honey from a big pot. Warm sunset, friendship.',

  // Captain Hook
  'disney/captain-hook/page-1.png': 'A dramatic pirate ship with black sails sailing through turquoise Neverland waters. Skull flag, dramatic clouds.',
  'disney/captain-hook/page-2.png': 'A theatrical pirate captain with a big hat, red coat, and a hook for a hand. Dramatic pose on his ship.',
  'disney/captain-hook/page-3.png': 'A green crocodile in the water with a clock visible in its belly — tick tock. The captain hiding in terror.',
  'disney/captain-hook/page-4.png': 'A boy in green flying over a pirate ship, casting a shadow. Mischievous grin, fairy dust trail. Neverland sky.',
  'disney/captain-hook/page-5.png': 'A pirate captain excitedly unrolling an old treasure map with an X marked on Skull Island. Treasure gleam.',
  'disney/captain-hook/page-6.png': 'A boy in green and a pirate captain having a dramatic sword fight on the deck of a ship. Action-packed.',
  'disney/captain-hook/page-7.png': 'Children walking a plank on a pirate ship over sparkling water. A flying boy secretly hovering above, ready to save them.',
  'disney/captain-hook/page-8.png': 'A pirate captain falling off his ship into the water. A crocodile waiting with an open mouth. Comedic.',
  'disney/captain-hook/page-9.png': 'A pirate captain running across the water being chased by a clock-ticking crocodile. Comedic chase scene.',
  'disney/captain-hook/page-10.png': 'A boy in green and his friends celebrating on the pirate ship. Flying, laughing, Neverland sunset.',
};

async function generateImage(prompt, size = '1024x1024') {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size,
      quality: 'medium',
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API ${res.status}`);
  }
  const data = await res.json();
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  if (data.data[0].url) {
    const imgRes = await fetch(data.data[0].url);
    return Buffer.from(await imgRes.arrayBuffer());
  }
  throw new Error('No image data');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const entries = Object.entries(ALL_PROMPTS);

  // Filter to only missing images
  const missing = entries.filter(([key]) => {
    const diskPath = path.join(PUBLIC, 'images', key);
    return !fs.existsSync(diskPath);
  });

  console.log(`Found ${missing.length} missing images out of ${entries.length} total\n`);
  if (missing.length === 0) {
    console.log('All images exist! Nothing to generate.');
    return;
  }

  let done = 0, errors = 0;

  for (const [key, desc] of missing) {
    const outPath = path.join(PUBLIC, 'images', key);
    const outDir = path.dirname(outPath);
    const isSection = key.startsWith('sections/');
    const size = isSection ? '1536x1024' : '1024x1024';
    const prompt = `${STYLE_PREFIX} ${desc}`;

    // Ensure directory exists
    fs.mkdirSync(outDir, { recursive: true });

    const label = `[${done + 1}/${missing.length}] ${key}`;
    process.stdout.write(`${label} ... `);

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const buf = await generateImage(prompt, size);
        fs.writeFileSync(outPath, buf);
        done++;
        console.log(`OK (${(buf.length / 1024).toFixed(0)}KB)`);
        break;
      } catch (err) {
        if (attempt < 2) {
          const wait = (attempt + 1) * 3;
          console.log(`retry in ${wait}s (${err.message})`);
          await sleep(wait * 1000);
        } else {
          errors++;
          console.log(`FAILED: ${err.message}`);
        }
      }
    }

    // Rate limit: small delay between requests
    await sleep(500);
  }

  console.log(`\nDone! Generated: ${done}, Errors: ${errors}`);
}

main().catch(e => { console.error(e); process.exit(1); });
