#!/usr/bin/env node
/**
 * Generate remaining story illustrations — feelings stories + rephrased Disney prompts.
 * Disney prompts have been rewritten to remove all trademarked character names.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error('Error: OPENAI_API_KEY not set'); process.exit(1); }

const STYLE = `Children's book illustration in soft 3D Pixar style. Warm golden-hour lighting, amber palette, saturated but not neon. Rounded forms with subsurface scattering feel. Purple-blue shadows, never grey or black. Safe, curious, gentle mood. Slightly luminous. No text or words in the image. Designed for a 3.5 year old child.`;

const STORIES = [
  // ── Feelings (should work fine — no copyrighted characters) ──
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

  // ── Disney — rephrased without character names ──
  {
    id: 'disney/cinderella',
    dir: 'public/images/disney/cinderella',
    // pages 1-5 and 10 already exist; only generate 6-9
    pages: [
      null, null, null, null, null, // skip 1-5
      'A young woman in a magnificent sparkling blue ball gown with crystal shoes, magical transformation with sparkles and fairy dust swirling around her.',
      'A young couple dancing together in a grand golden palace ballroom with crystal chandeliers and rose petals falling.',
      'A grand clock tower striking midnight with golden clock hands. A young woman running down marble palace stairs, leaving behind one crystal shoe on the steps.',
      'A kind nobleman kneeling down, placing a delicate crystal slipper on a young woman\'s foot. Perfect fit! Golden light and joy.',
      null, // skip 10
    ],
  },
  {
    id: 'disney/snow-white',
    dir: 'public/images/disney/snow-white',
    pages: [
      'A kind young princess with dark hair singing in a sunlit castle garden. Bluebirds and woodland creatures gather around her. Flowers blooming.',
      'A vain queen gazing into an ornate gilded mirror on a dark castle wall. Mysterious purple and green magical glow emanating from the mirror.',
      'A brave young girl running through a dark enchanted forest with tall twisted ancient trees. Fireflies light the way. She looks determined.',
      'A charming tiny woodland cottage in a sunny forest clearing. Everything is adorably miniature — tiny door, tiny windows, flower boxes. Mushrooms and wildflowers.',
      null, null, null, null, // 5-8 exist
      'A handsome young man gently holding the hand of a sleeping princess on a flower-covered bed. Golden magical light spreads as she awakens. Woodland creatures celebrate.',
      'A joyful celebration on a castle balcony overlooking a green kingdom. A princess and prince waving. Woodland animals and small folk celebrating below. Sunset.',
    ],
  },
  {
    id: 'disney/pooh',
    dir: 'public/images/disney/pooh',
    pages: [
      'A chubby golden teddy bear stretching and yawning outside his cosy tree house home on a sunny morning. Enchanted woodland setting with butterflies.',
      'A round golden teddy bear looking sadly into an empty honey pot, his head tilted inside it. Cosy wooden room with tiny furniture.',
      'A golden teddy bear and a tiny shy piglet walking together through an enchanted autumn woodland. Colourful falling leaves.',
      'An energetic orange and black striped tiger bouncing joyfully through a forest clearing with enormous springy bounces.',
      'A golden teddy bear climbing a big oak tree toward a beehive. Friendly bees buzzing. Animal friends watching from below in a sunny clearing.',
      'A golden teddy bear sitting in a mud puddle, covered in sticky honey. Bees flying away. He looks sheepishly happy.',
      'A tidy underground burrow home with shelves full of golden honey pots. A neat rabbit offering one pot to a round golden bear.',
      'A round golden teddy bear stuck in a circular doorway of a burrow, too full from eating. Friends pulling his legs to help.',
      'A golden teddy bear popping out of a round doorway with a POP, flying through the air! Friends tumbling backwards. A honey pot soaring.',
      'A group of woodland friends sharing honey together in a sunny flower meadow. A bear, tiny piglet, bouncy tiger, and gloomy donkey all happy together.',
    ],
  },
  {
    id: 'disney/captain-hook',
    dir: 'public/images/disney/captain-hook',
    pages: [
      'A grand wooden pirate ship with billowing red sails on a sparkling turquoise tropical sea. A pirate captain stands proudly at the helm.',
      'A dramatic pirate captain with a curly black moustache, a large feathered hat, a red coat, and a gleaming hook hand instead of one hand.',
      'A green crocodile swimming in tropical waters with a ticking clock visible in its belly. A frightened pirate captain peeking over the ship railing.',
      'A flying boy in green soaring above a pirate ship deck, playfully taunting pirates below. A tiny glowing fairy sprinkles golden dust nearby.',
      'A pirate captain studying an old weathered treasure map with X marks. A mysterious skull-shaped island visible through the cabin window.',
      'A boy in green and a pirate captain having a playful sword duel on a ship deck. Action and adventure! Both smiling.',
      'Brave children walking a wooden plank over sparkling tropical water. A flying boy hiding above the mast, ready to swoop in for a rescue.',
      'A pirate captain splashing into turquoise water from his ship, a green crocodile nearby. Comical splash and surprise!',
      'A pirate captain rowing away frantically in a small wooden rowboat. A green crocodile swimming behind, ticking happily. Comical chase at sunset.',
      'A group of adventurous children celebrating on a pirate ship deck. A tiny glowing fairy raining golden sparkly dust. Beautiful tropical sunset.',
    ],
  },
];

function generateImage(prompt) {
  const payload = JSON.stringify({
    model: 'gpt-image-1',
    prompt: `${STYLE}\n\n${prompt}`,
    n: 1,
    size: '1536x1024',
    quality: 'high',
  });

  const tmpPayload = path.join(ROOT, '.tmp-prompt.json');
  fs.writeFileSync(tmpPayload, payload);

  try {
    const result = execSync(
      `curl -s --max-time 120 -X POST https://api.openai.com/v1/images/generations ` +
      `-H "Authorization: Bearer ${API_KEY}" ` +
      `-H "Content-Type: application/json" ` +
      `-d @${tmpPayload}`,
      { maxBuffer: 50 * 1024 * 1024 }
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

async function main() {
  let totalToGenerate = 0;
  for (const story of STORIES) {
    for (let i = 0; i < story.pages.length; i++) {
      if (story.pages[i] === null) continue;
      const outFile = path.join(ROOT, story.dir, `page-${i + 1}.png`);
      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) continue;
      totalToGenerate++;
    }
  }

  console.log(`\n🎨 Generating ${totalToGenerate} remaining illustrations\n`);
  let done = 0;
  let errors = 0;

  for (const story of STORIES) {
    const dir = path.join(ROOT, story.dir);
    fs.mkdirSync(dir, { recursive: true });

    const pagesToGen = [];
    for (let i = 0; i < story.pages.length; i++) {
      if (story.pages[i] === null) continue;
      const outFile = path.join(dir, `page-${i + 1}.png`);
      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        console.log(`   ✓ page-${i + 1}.png (exists)`);
        continue;
      }
      pagesToGen.push(i);
    }

    if (pagesToGen.length === 0) {
      console.log(`📖 ${story.id} — all pages exist, skipping`);
      continue;
    }

    console.log(`📖 ${story.id} (${pagesToGen.length} pages to generate)`);

    for (const i of pagesToGen) {
      const pageNum = i + 1;
      const outFile = path.join(dir, `page-${pageNum}.png`);

      let attempts = 0;
      while (attempts < 3) {
        try {
          attempts++;
          const buf = generateImage(story.pages[i]);
          fs.writeFileSync(outFile, buf);
          done++;
          console.log(`   ✨ page-${pageNum}.png (${(buf.length / 1024).toFixed(0)}KB) [${done}/${totalToGenerate}]`);
          break;
        } catch (e) {
          if (attempts < 3) {
            console.log(`   ⏳ page-${pageNum} retry ${attempts}/3: ${e.message.substring(0, 80)}`);
            execSync(`sleep ${3 * attempts}`);
          } else {
            console.error(`   ❌ page-${pageNum} FAILED: ${e.message.substring(0, 100)}`);
            errors++;
            done++;
          }
        }
      }
    }
    console.log('');
  }

  console.log(`\n✅ Done! ${done - errors} generated, ${errors} errors\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
