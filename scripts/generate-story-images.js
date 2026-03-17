#!/usr/bin/env node
/**
 * Generate story illustrations using OpenAI gpt-image-1.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-xxx node scripts/generate-story-images.js
 *   node scripts/generate-story-images.js           # uses key from env
 *   node scripts/generate-story-images.js --story tortoise-hare   # single story
 *   node scripts/generate-story-images.js --dry-run               # preview prompts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const SINGLE = process.argv.find((a, i) => process.argv[i - 1] === '--story');

if (!API_KEY && !DRY_RUN) {
  console.error('Error: OPENAI_API_KEY not set');
  process.exit(1);
}

// ── Art direction ────────────────────────────────────────────────
const STYLE = `Children's book illustration in soft 3D Pixar style. Warm golden-hour lighting, amber palette, saturated but not neon. Rounded forms with subsurface scattering feel. Purple-blue shadows, never grey or black. Safe, curious, gentle mood. Slightly luminous. No text or words in the image. Designed for a 3.5 year old child.`;

// ── Story definitions ────────────────────────────────────────────
const STORIES = [
  // ── Aesop's Fables ──
  {
    id: 'tortoise-hare',
    dir: 'public/images/tortoise-hare',
    pages: [
      'A speedy brown hare showing off, running fast through a sunny green meadow. A small gentle tortoise watches from the side.',
      'A brave little tortoise facing a tall laughing hare. A wooden signpost says RACE. Bright sunny meadow.',
      'A race starting line with a hare zooming ahead in a blur. The tortoise takes one small step. Colourful bunting.',
      'A hare sleeping peacefully under a big shady tree. Zzz bubbles. The tortoise walks slowly in the background.',
      'A determined tortoise walking steadily along a path through rolling green hills. Wildflowers along the way.',
      'A tortoise tiptoeing quietly past a sleeping hare under a tree. Finger to lips, shushing.',
      'A hare waking up in shock, eyes wide! The tortoise is near a finish line ribbon in the distance.',
      'A happy tortoise crossing a finish line with confetti and celebration! The hare arrives behind, looking surprised but friendly.',
    ],
  },
  {
    id: 'lion-mouse',
    dir: 'public/images/lion-mouse',
    pages: [
      'A magnificent golden lion sleeping peacefully in warm sunshine on the African savanna. Butterflies around.',
      'A tiny brown mouse running across a sleeping lion\'s nose. The lion opens one big eye.',
      'A big lion holding a tiny mouse gently in his paw. The mouse looks up pleadingly. Warm savanna.',
      'A lion laughing warmly, releasing a tiny mouse who scurries away happily. Savanna sunset.',
      'A sad lion trapped in a rope net in the jungle. He looks worried. Warm lighting.',
      'A tiny brave mouse running toward a trapped lion, determined to help. Forest setting.',
      'A mouse nibbling through rope net strands with tiny teeth. The lion watches hopefully.',
      'A free lion nuzzling a tiny mouse on his nose. Both smiling. Stars and hearts around them. Sunset.',
    ],
  },
  {
    id: 'boy-cried-wolf',
    dir: 'public/images/boy-cried-wolf',
    pages: [
      'A little shepherd boy sitting on a big green hill with fluffy white sheep. Peaceful countryside.',
      'A mischievous boy standing up and shouting with his hands cupped around his mouth. Sheep look startled.',
      'Friendly villagers running up a green hill with worried faces. The boy is laughing. No wolf.',
      'The same boy shouting again from the hilltop. A few villagers in the distance look annoyed.',
      'Cross villagers wagging fingers at the naughty boy on the hill. The sheep graze peacefully.',
      'A grey wolf creeping out from behind trees at the edge of a dark forest. The boy looks scared.',
      'The boy shouting desperately from the hill. The village below is quiet — nobody comes.',
      'A kind farmer chasing a wolf away with a stick. The boy hugs his sheep, looking relieved and sorry.',
    ],
  },
  {
    id: 'ant-grasshopper',
    dir: 'public/images/ant-grasshopper',
    pages: [
      'A tiny red ant carrying a big leaf on her back on a sunny summer day. Wildflowers everywhere.',
      'A green grasshopper playing a tiny fiddle and dancing on a mushroom. Sunny meadow.',
      'A grasshopper inviting an ant to play. The ant carries food. Bright summer scene.',
      'An ant stacking food — berries, seeds, acorns — inside a cosy underground home. Warm and organized.',
      'A snowy winter scene. Bare trees, snowflakes falling, cold wind blowing. Chilly atmosphere.',
      'A cold, shivering grasshopper outside in the snow, looking hungry and sad. Empty landscape.',
      'A kind ant opening her cosy warm door to a cold grasshopper. Warm light spills out. Snow outside.',
      'An ant and grasshopper sharing food together inside a warm cosy burrow. Both happy. Hearts above.',
    ],
  },
  {
    id: 'fox-grapes',
    dir: 'public/images/fox-grapes',
    pages: [
      'A handsome orange fox walking through sunny woodland. Dappled light through leaves.',
      'A fox looking up longingly at big juicy purple grapes hanging high on a vine. Mouth watering.',
      'A fox jumping up high trying to reach grapes on a tall vine. Stretching with all his might.',
      'A fox jumping again and again, different positions mid-jump. Grapes still too high.',
      'A fox making one final enormous jump with all his strength. Grapes just out of reach.',
      'A tired, grumpy fox sitting below the grape vine with his nose up in the air. Arms crossed.',
      'A fox walking away with his nose in the air. A little bluebird on the vine watches curiously.',
      'A sweet scene of the fox walking home through sunset woods. A moral moment, warm and reflective.',
    ],
  },
  {
    id: 'town-country-mouse',
    dir: 'public/images/town-country-mouse',
    pages: [
      'A cute brown mouse in a cosy hole under a big oak tree. Acorn furniture, tiny fireplace. Autumn.',
      'Two mice greeting each other — one country (simple) and one town (fancy bow tie). Oak tree.',
      'A simple meal of seeds and berries on tiny plates. Country mouse proud, town mouse unimpressed.',
      'Two tiny mice looking up at enormous city buildings. Country mouse amazed, mouth open.',
      'An incredible spread of cheese, cake and chocolate on a fancy table. Two mice feasting.',
      'A huge scary ginger cat pouncing! Two mice running in terror. Dramatic action scene.',
      'Two mice hiding in a tiny crack in a wall. The cat\'s eye peers in. Tense but safe.',
      'A happy country mouse back home in his cosy tree hole. Simple food, warm fire. Content.',
    ],
  },

  // ── Disney ──
  {
    id: 'disney/cinderella',
    dir: 'public/images/disney/cinderella',
    pages: [
      'A kind girl in simple clothes sweeping the floor while two mean stepsisters lounge on fancy chairs.',
      'A golden envelope with a royal seal. A castle in the background. Sparkles of excitement.',
      'Cinderella watching sadly from a window as a fancy carriage drives her stepsisters to the ball.',
      'A magical Fairy Godmother appearing in a burst of sparkles and blue light. Warm and kind.',
      'A pumpkin magically transforming into a gorgeous golden coach. Sparkles and magic swirls.',
      'Cinderella in a beautiful blue ballgown with glass slippers. Magical transformation scene.',
      'A prince and Cinderella dancing together in a beautiful palace ballroom. Chandeliers and roses.',
      'A clock striking midnight. Cinderella running down palace stairs, one glass slipper left behind.',
      'A prince kneeling, placing a glass slipper on Cinderella\'s foot. It fits perfectly! Joy.',
      'Cinderella and the Prince in a golden carriage, castle in background. Hearts and sparkles.',
    ],
  },
  {
    id: 'disney/snow-white',
    dir: 'public/images/disney/snow-white',
    pages: [
      'A beautiful princess with black hair, red lips, and a blue-and-yellow dress. Singing with forest birds.',
      'An evil queen looking into an ornate magic mirror on a dark castle wall. Purple and green tones.',
      'Snow White running through a dark enchanted forest. Tall twisted trees. Scary but she is brave.',
      'Snow White finding a tiny charming cottage in a forest clearing. Everything is miniature and cute.',
      'Seven adorable dwarfs marching home from a sparkling diamond mine. Each one unique and lovable.',
      'An old woman in a dark cloak offering a shiny red apple. Ominous but the apple looks delicious.',
      'Snow White asleep on a flower-covered bed. Seven sad dwarfs around her. Soft dreamy light.',
      'A brave prince on a white horse riding through an enchanted forest toward a glass coffin.',
      'A prince kissing Snow White\'s hand. She wakes up surrounded by golden light and flowers!',
      'Snow White and the Prince waving from a castle balcony. Forest animals and dwarfs celebrating below.',
    ],
  },
  {
    id: 'disney/pooh',
    dir: 'public/images/disney/pooh',
    pages: [
      'Winnie the Pooh stretching and yawning outside his tree house in the Hundred Acre Wood. Sunny morning.',
      'Pooh looking sadly into an empty honey pot, head tilted inside it. Cosy room.',
      'Pooh and tiny Piglet walking together through the Hundred Acre Wood. Autumn leaves.',
      'Tigger bouncing in energetically with huge spring-loaded bounces. Orange and black stripes.',
      'Pooh climbing a big tree toward a beehive. Bees buzzing around. Friends watching from below.',
      'Pooh covered in honey and mud, sitting in a puddle. Bees flying away. He looks sheepish.',
      'Rabbit\'s tidy burrow with shelves full of honey pots. Rabbit offering one to Pooh.',
      'Pooh stuck in Rabbit\'s round front door, too full of honey. Friends pulling his legs.',
      'Pooh flying through the air with a POP! Friends tumbling backwards. Honey pot flying.',
      'All the friends sitting together sharing honey in a sunny meadow. Pooh, Piglet, Tigger, Eeyore.',
    ],
  },
  {
    id: 'disney/captain-hook',
    dir: 'public/images/disney/captain-hook',
    pages: [
      'A grand pirate ship with red sails on a turquoise Neverland sea. Captain Hook at the helm.',
      'Captain Hook looking fierce with his hook hand. Pirate hat, red coat, curly moustache.',
      'A green crocodile in the water with a clock in its belly going tick-tock. Hook looks terrified.',
      'Peter Pan flying above a pirate ship, playfully taunting Captain Hook. Tinker Bell sparkles nearby.',
      'Captain Hook studying an old treasure map with X marks. Skull Island visible through a window.',
      'Peter Pan and Captain Hook having a playful sword fight on the ship deck. Action scene.',
      'The Lost Boys walking a plank over water. Peter Pan hiding above, ready to save them.',
      'Captain Hook falling off the ship into water near the tick-tock crocodile. Splash!',
      'Captain Hook running away in his rowboat, crocodile chasing behind. Comical chase scene.',
      'Peter Pan and the Lost Boys celebrating on the ship. Tinker Bell raining pixie dust. Sunset.',
    ],
  },

  // ── Feelings ──
  {
    id: 'feelings-monster',
    dir: 'public/images/feelings-monster',
    pages: [
      'A cute round fluffy monster with all colours muddled together — rainbow splotches. Looks confused but lovable.',
      'A bright yellow happy monster jumping for joy! Sunshine and flowers. Warm golden scene.',
      'A soft blue sad monster with a single tear. Rain outside a window. Gentle and sympathetic.',
      'A spiky red angry monster with steam coming from ears. Taking a deep breath. Calming down.',
      'A small dark purple scared monster curled up. Someone giving it a big warm hug.',
      'A peaceful green calm monster floating serenely. Gentle breeze, soft clouds, meadow.',
      'A warm pink loving monster giving a big heart-shaped hug. Cosy, surrounded by hearts.',
      'All the colour-sorted feeling monsters together in a rainbow group hug. Celebration! Stars.',
    ],
  },
  {
    id: 'when-i-feel-big',
    dir: 'public/images/when-i-feel-big',
    pages: [
      'A small brown bear cub with a HUGE colourful cloud of feelings above his head. Meadow setting.',
      'An excited bear cub bouncing with joy! Fizzy sparkles in his tummy. Yellow and orange energy.',
      'A frustrated bear cub with a toppled block tower. Stamping feet. Red-orange tones.',
      'A worried bear cub with swirly thought bubbles full of question marks. Knotty tummy feeling.',
      'A proud bear cub standing tall, chest puffed out! Gold medal or achievement. Glowing.',
      'A shy bear cub peeking from behind his mummy bear with one eye. Sweet and timid.',
      'A sleepy bear cub yawning, droopy eyes, in cosy pyjamas. Stars and moon. Bedtime.',
      'Bear cub surrounded by all his feelings as gentle coloured lights. Warm hug. All feelings welcome.',
    ],
  },
  {
    id: 'feelings-friends',
    dir: 'public/images/feelings-friends',
    pages: [
      'A circle of cute animal friends, each a different colour representing a feeling. Meadow.',
      'A happy yellow bunny hopping joyfully through a flower field. Big smile, floppy ears.',
      'A sad grey kitten looking at a lost toy ball. Single tear. Someone reaching to comfort.',
      'An angry red puppy growling over a missing bone. Learning to count to three. Calming down.',
      'A scared curled-up hedgehog. Gentle hands reaching to comfort. Soft purple tones.',
      'A silly yellow duckling walking backwards and quacking. Upside down expression. Giggles.',
      'A warm brown owl giving the cosiest cuddle. Big soft wings wrapped around. Hearts everywhere.',
      'All the feeling animals together in a group hug rainbow circle. Stars, hearts, love.',
    ],
  },
];

// ── API call (via curl for proxy compatibility) ──────────────────
function generateImage(prompt) {
  const payload = JSON.stringify({
    model: 'gpt-image-1',
    prompt: `${STYLE}\n\n${prompt}`,
    n: 1,
    size: '1536x1024',
    quality: 'high',
  });

  // Write payload to temp file to avoid shell escaping issues
  const tmpPayload = path.join(ROOT, '.tmp-prompt.json');
  fs.writeFileSync(tmpPayload, payload);

  try {
    const result = execSync(
      `curl -s --max-time 120 -X POST https://api.openai.com/v1/images/generations ` +
      `-H "Authorization: Bearer ${API_KEY}" ` +
      `-H "Content-Type: application/json" ` +
      `-d @${tmpPayload}`,
      { maxBuffer: 50 * 1024 * 1024 } // 50MB for base64 images
    ).toString();

    const data = JSON.parse(result);
    if (data.error) throw new Error(data.error.message);

    const b64 = data.data?.[0]?.b64_json;
    if (b64) return Buffer.from(b64, 'base64');

    const url = data.data?.[0]?.url;
    if (url) {
      const imgData = execSync(`curl -s --max-time 60 "${url}"`, { maxBuffer: 50 * 1024 * 1024 });
      return imgData;
    }
    throw new Error('No image data returned');
  } finally {
    try { fs.unlinkSync(tmpPayload); } catch {}
  }
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const stories = SINGLE
    ? STORIES.filter(s => s.id === SINGLE || s.id.endsWith(`/${SINGLE}`))
    : STORIES;

  if (stories.length === 0) {
    console.error(`No story found matching "${SINGLE}"`);
    process.exit(1);
  }

  const totalPages = stories.reduce((n, s) => n + s.pages.length, 0);
  console.log(`\n🎨 Generating ${totalPages} illustrations for ${stories.length} stories\n`);

  let done = 0;
  let skipped = 0;
  let errors = 0;

  for (const story of stories) {
    const dir = path.join(ROOT, story.dir);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`📖 ${story.id} (${story.pages.length} pages)`);

    for (let i = 0; i < story.pages.length; i++) {
      const pageNum = i + 1;
      const outFile = path.join(dir, `page-${pageNum}.png`);

      // Skip if already exists
      if (fs.existsSync(outFile)) {
        const stat = fs.statSync(outFile);
        if (stat.size > 1000) {
          console.log(`   ✓ page-${pageNum}.png (exists, ${(stat.size / 1024).toFixed(0)}KB)`);
          skipped++;
          done++;
          continue;
        }
      }

      if (DRY_RUN) {
        console.log(`   🔍 page-${pageNum}: ${story.pages[i].substring(0, 80)}...`);
        done++;
        continue;
      }

      // Generate with retry
      let attempts = 0;
      while (attempts < 3) {
        try {
          attempts++;
          const buf = generateImage(story.pages[i]);
          fs.writeFileSync(outFile, buf);
          console.log(`   ✨ page-${pageNum}.png (${(buf.length / 1024).toFixed(0)}KB) [${done + 1}/${totalPages}]`);
          done++;
          break;
        } catch (e) {
          if (attempts < 3) {
            console.log(`   ⏳ page-${pageNum} retry ${attempts}/3: ${e.message}`);
            execSync(`sleep ${3 * attempts}`);
          } else {
            console.error(`   ❌ page-${pageNum} FAILED: ${e.message}`);
            errors++;
            done++;
          }
        }
      }
    }
    console.log('');
  }

  console.log(`\n✅ Done! ${done - skipped - errors} generated, ${skipped} skipped, ${errors} errors\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
