#!/usr/bin/env node
/**
 * Generate Build-a-Scene assets using OpenAI DALL-E 3 API.
 *
 * Usage:
 *   node scripts/generate-scene-assets.mjs
 *   node scripts/generate-scene-assets.mjs --scene space       # One scene only
 *   node scripts/generate-scene-assets.mjs --bg-only           # Backgrounds only
 *   node scripts/generate-scene-assets.mjs --stickers-only     # Stickers only
 *
 * Environment:
 *   OPENAI_API_KEY — your OpenAI API key (required)
 *
 * Output:
 *   public/images/scenes/{sceneId}/bg.png           — scene backgrounds (1792x1024)
 *   public/images/scenes/{sceneId}/stickers/{id}.png — stickers (1024x1024)
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCENES_DIR = join(ROOT, 'public', 'images', 'scenes');

// ─── Art style ───────────────────────────────────────────────────

const STYLE_BG = `Children's animated TV show background in the style of Bluey (Australian cartoon). STRICT VISUAL RULES: Soft watercolour-style textures with visible brush strokes and paper grain. Warm, bright, saturated colours. Simple shapes — no overly detailed rendering. Backgrounds have a painterly, hand-illustrated quality with soft edges. Gentle gradients within large shapes. Dreamy, inviting atmosphere. Slightly desaturated shadows in cool blue-violet tones. Golden warm highlights. No characters — just the environment. No text or UI. Landscape format 16:9.`;

const STYLE_STICKER = `Single character/object illustration in the style of Bluey (Australian animated TV show). STRICT VISUAL RULES: Centred on a plain solid white background (#FFFFFF) with NO other elements, shadows, or ground. The subject fills most of the frame. Soft watercolour textures with visible brush grain. Thick rounded outlines in a slightly darker shade of the object's colour (not black). Friendly, chunky proportions — big heads, round shapes, simple features. Bright saturated colours. Large expressive eyes with white highlights. Minimal detail — stylised and appealing for toddlers. The subject should look like a sticker or felt cut-out: clean silhouette edges, no background elements at all. Square format.`;

// ─── Scene background prompts ────────────────────────────────────

const BG_PROMPTS = {
  space: 'A vast outer space scene. Deep indigo-purple sky filled with twinkling stars, distant colourful nebulae in pink and blue, a crescent moon in the corner, and distant planets. Feels magical and endless. A rocket launch pad or space station platform at the bottom gives a "ground" to place things on.',

  sea: 'An underwater ocean scene. Crystal clear turquoise water with light rays streaming down from the surface above. Sandy ocean floor at the bottom with small rocks and shells. Coral reef elements on the sides. Seaweed gently waving. Bubbles rising. Fish-free — just the beautiful empty underwater world waiting for sea creatures.',

  jungle: 'A lush tropical jungle scene. Dense green canopy above with shafts of golden sunlight breaking through. Thick tree trunks on either side framing the scene. Jungle floor with ferns, moss, and fallen leaves. A small stream or pool of water in the middle distance. Colourful tropical flowers. Vines hanging down. Warm and humid atmosphere.',

  farm: 'A sunny farm landscape. Rolling green fields under a bright blue sky with fluffy white clouds. A red barn in the background, wooden fence in the foreground, a dirt path winding through. Green grass, wildflowers, a pond in the distance. Golden hay bales. Warm, sunny, and inviting countryside.',

  dinosaurs: 'A prehistoric landscape. Volcanic mountains in the background with one gently smoking. Lush prehistoric vegetation — giant ferns, cycads, and tall primitive trees. A wide river or swamp area. Dramatic orange-amber sky suggesting a primordial world. Rocks and boulders scattered on rocky ground. No dinosaurs — just the empty prehistoric world.',

  'theme-park': 'A colourful theme park / fairground scene. Bright striped tents and stalls along the sides. A Ferris wheel silhouette in the background. String lights and bunting across the top. Paved ground with confetti scattered. Blue sky with cotton-candy pink clouds. Exciting, festive, magical atmosphere. No people — just the empty park waiting for fun.',
};

// ─── Sticker label → DALL-E prompt mapping ───────────────────────
// We generate a descriptive prompt for each sticker based on its label
// and scene context. The style prefix handles the art direction.

function stickerPrompt(sticker, sceneId) {
  const { id, label } = sticker;

  // Scene-specific context hints
  const contexts = {
    space: 'space/sci-fi themed',
    sea: 'underwater/ocean themed',
    jungle: 'tropical jungle themed',
    farm: 'farm/countryside themed',
    dinosaurs: 'prehistoric/dinosaur themed',
    themePark: 'fairground/theme park themed',
  };
  const ctx = contexts[sceneId] || '';

  // Special handling for stickers that need more description
  const overrides = {
    // Space
    'rocket': 'A bright red and white cartoon rocket ship with round windows, flames coming from the bottom',
    'astronaut': 'A friendly astronaut in a white spacesuit with a round helmet, waving hello',
    'alien': 'A cute friendly green alien with big eyes, antennae, and a happy smile',
    'ufo': 'A classic silver flying saucer UFO with colourful lights around the rim',
    'space-dog': 'A cute dog wearing a little space helmet and spacesuit, floating',
    'robot': 'A friendly boxy robot with antenna, round eyes, and waving arms',
    'space-cat-helmet': 'A fluffy cat wearing an astronaut helmet, looking surprised and cute',
    'alien-riding-rocket': 'A small green alien riding on top of a rocket, holding on with glee',
    'sleepy-planet': 'A round planet with a sleepy cartoon face, closed eyes, and a nightcap',
    'astronaut-thumbs-up': 'An astronaut in a spacesuit giving an enthusiastic thumbs up',
    'robot-dancing': 'A cute robot doing a happy dance with arms up and one leg raised',
    'ufo-disco': 'A flying saucer with disco lights and a mirror ball underneath',

    // Sea
    'clownfish': 'A bright orange and white clownfish (like Nemo) with big eyes',
    'great-white': 'A friendly cartoon great white shark with a big toothy grin',
    'octopus': 'A purple cartoon octopus with eight curly tentacles and big googly eyes',
    'jellyfish': 'A translucent pink jellyfish with flowing tentacles, glowing softly',
    'seahorse': 'A cute orange seahorse with a curly tail',
    'blue-whale': 'A large friendly blue whale with a gentle smile and water spout',
    'narwhal-sunglasses': 'A narwhal wearing cool sunglasses, looking stylish',
    'crab-balloons': 'A red crab holding colourful balloons in its claws',
    'mermaid-waving': 'A friendly mermaid with flowing hair, waving hello',
    'baby-octopus-teacup': 'A tiny baby octopus sitting in a teacup, looking adorable',
    'shark-party-hat': 'A shark wearing a colourful party hat with a big grin',
    'seahorse-bow-tie': 'A seahorse wearing a little bow tie, looking dapper',

    // Jungle
    'lion': 'A majestic cartoon lion with a fluffy golden mane, sitting proudly',
    'tiger': 'An orange and black striped tiger walking with a friendly expression',
    'elephant': 'A grey cartoon elephant with big floppy ears and a curled trunk',
    'gorilla': 'A strong but gentle-looking gorilla sitting and beating his chest',
    'monkey': 'A cheeky brown monkey swinging with one arm, holding a banana',
    'parrot': 'A colourful tropical parrot with red, blue, and green feathers',
    'sloth-hammock': 'A sleepy sloth lying in a tiny hammock, eyes half-closed',
    'frog-umbrella': 'A green frog holding a tiny red umbrella',
    'parrot-party-hat': 'A colourful parrot wearing a sparkly party hat',
    'explorer-map': 'A cartoon explorer child with a pith helmet, holding a treasure map and magnifying glass',
    'monkey-banana': 'A monkey happily eating a banana with a big grin',
    'tiger-flower-crown': 'A tiger wearing a pretty crown of tropical flowers',

    // Farm
    'cow': 'A friendly black and white dairy cow with a bell around its neck',
    'pig': 'A round pink pig with a curly tail and a happy muddy snout',
    'sheep': 'A fluffy white sheep with a woolly coat and a gentle face',
    'horse': 'A brown horse with a flowing mane and tail, looking noble',
    'chicken': 'A brown and white chicken with a red comb, clucking',
    'chick': 'A tiny fluffy yellow baby chick, round and adorable',
    'pig-mud-bath': 'A happy pig splashing in a mud bath with mud on its nose',
    'sheep-jumper': 'A sheep wearing a hand-knitted woolly jumper, looking cozy',
    'cow-flowers': 'A cow with a crown of daisies and wildflowers on its head',
    'farmer-dancing': 'A cartoon farmer in dungarees doing a silly happy dance',
    'chicken-boots': 'A chicken strutting in tiny red wellington boots',
    'horse-top-hat': 'A horse wearing a fancy top hat and looking distinguished',

    // Dinosaurs
    't-rex': 'A cute cartoon T-Rex with tiny arms, big teeth, and a friendly expression',
    'triceratops': 'A sturdy blue-grey triceratops with three horns and a frill',
    'brachiosaurus': 'A tall green brachiosaurus with a very long neck, looking gentle',
    'stegosaurus': 'An orange stegosaurus with big plates along its back',
    'pterodactyl': 'A flying pterodactyl with wide leathery wings spread out',
    'ankylosaurus': 'A heavily armoured ankylosaurus with a club tail',
    'baby-t-rex-egg': 'A baby T-Rex hatching out of a cracked egg, looking surprised',
    'triceratops-bow-tie': 'A triceratops wearing a polka-dot bow tie',
    'pterodactyl-fish': 'A pterodactyl flying while carrying a fish in its beak',
    'caveman-riding-dino': 'A cartoon caveman riding on the back of a friendly dinosaur',
    'stegosaurus-sunglasses': 'A stegosaurus wearing cool star-shaped sunglasses',
    'volcano-party-hat': 'A cartoon volcano wearing a party hat with confetti erupting',

    // Theme Park
    'balloon-red': 'A single bright red balloon on a white string',
    'candy-floss': 'A big pink cloud of candy floss / cotton candy on a stick',
    'ice-cream-cone': 'A colourful ice cream cone with three scoops: pink, brown, and white',
    'carousel-horse': 'A decorative carousel horse, painted gold and white, on a pole',
    'roller-coaster-car': 'A bright red roller coaster car with seats, going fast',
    'clown': 'A friendly happy clown with a red nose, rainbow wig, and big shoes',
    'clown-unicycle': 'A clown riding a unicycle while juggling colourful balls',
    'bear-winning-goldfish': 'A teddy bear carrying a goldfish in a bag, looking proud',
    'magician-rabbit': 'A magician pulling a surprised white rabbit out of a top hat',
    'acrobat-ball': 'A circus acrobat balancing on a large colourful ball',
    'balloon-animal-dog': 'A balloon animal shaped like a dog, made of twisted balloons',
    'ice-cream-face': 'An ice cream cone with a cute cartoon face, smiling',
  };

  if (overrides[id]) {
    return overrides[id];
  }

  // Generic prompt from label + context
  return `A cute cartoon ${label.toLowerCase()}, ${ctx}`;
}

// ─── OpenAI DALL-E 3 API ─────────────────────────────────────────

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/images/generations';

async function generateImage(prompt, size = '1024x1024') {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality: size === '1792x1024' ? 'hd' : 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

// ─── Scene data (extracted from sceneData.js for script use) ─────

const SCENE_IDS = ['space', 'sea', 'jungle', 'farm', 'dinosaurs', 'themePark'];

// We read sticker data inline to avoid ESM import issues with the React source
// Each scene's stickers are defined by: [id, label, tier]
const STICKER_DATA = {
  space: [
    ['rocket','Rocket','hero'],['astronaut','Astronaut','hero'],['alien','Alien (friendly)','hero'],
    ['ufo','UFO','hero'],['space-dog','Space dog (Laika-style)','hero'],['robot','Robot','hero'],
    ['earth','Earth','standard'],['moon','Moon','standard'],['saturn','Saturn','standard'],
    ['comet','Comet','standard'],['shooting-star','Shooting star','standard'],['satellite','Satellite','standard'],
    ['telescope','Telescope','standard'],['meteor','Meteor','standard'],['space-suit','Space suit (empty)','standard'],
    ['black-hole','Black hole','standard'],['constellation','Constellation','standard'],['space-station','Space station','standard'],
    ['sun','Sun (cartoon)','standard'],['nebula-cloud','Nebula cloud','standard'],['baby-alien','Baby alien','standard'],
    ['lunar-lander','Lunar lander','standard'],['asteroid','Asteroid','standard'],['galaxy-swirl','Galaxy swirl','standard'],
    ['astronaut-helmet','Astronaut helmet','standard'],['planet-with-face','Planet with face','standard'],
    ['toy-rocket','Rocket (small/toy)','standard'],['star-cluster','Star cluster','standard'],
    ['spacewalk-astronaut','Spacewalk astronaut','standard'],['mars','Mars','standard'],
    ['space-cat-helmet','Space cat in a helmet','secret'],['alien-riding-rocket','Alien riding a rocket','secret'],
    ['sleepy-planet','Planet with a sleepy face','secret'],['astronaut-thumbs-up','Astronaut doing a thumbs up','secret'],
    ['robot-dancing','Robot dancing','secret'],['ufo-disco','UFO with disco lights','secret'],
  ],
  sea: [
    ['clownfish','Clownfish','hero'],['great-white','Great white shark','hero'],['octopus','Octopus','hero'],
    ['jellyfish','Jellyfish','hero'],['seahorse','Seahorse','hero'],['blue-whale','Blue whale','hero'],
    ['sea-turtle','Sea turtle','standard'],['crab','Crab','standard'],['lobster','Lobster','standard'],
    ['starfish','Starfish','standard'],['pufferfish','Pufferfish','standard'],['manta-ray','Manta ray','standard'],
    ['dolphin','Dolphin','standard'],['anglerfish','Anglerfish','standard'],['narwhal','Narwhal','standard'],
    ['clam-pearl','Clam with pearl','standard'],['treasure-chest','Treasure chest','standard'],['anchor','Anchor','standard'],
    ['submarine','Submarine','standard'],['diver','Diver','standard'],['pirate-ship','Pirate ship (small)','standard'],
    ['mermaid','Mermaid','standard'],['sea-snail','Sea snail','standard'],['hermit-crab','Hermit crab','standard'],
    ['coral-reef','Coral reef','standard'],['seaweed','Seaweed','standard'],['swordfish','Swordfish','standard'],
    ['sea-urchin','Sea urchin','standard'],['shipwreck','Shipwreck','standard'],['bubble-trail','Bubble trail','standard'],
    ['narwhal-sunglasses','Narwhal with sunglasses','secret'],['crab-balloons','Crab holding balloons','secret'],
    ['mermaid-waving','Mermaid waving','secret'],['baby-octopus-teacup','Baby octopus in a teacup','secret'],
    ['shark-party-hat','Shark with a party hat','secret'],['seahorse-bow-tie','Seahorse wearing a bow tie','secret'],
  ],
  jungle: [
    ['lion','Lion','hero'],['tiger','Tiger','hero'],['elephant','Elephant','hero'],
    ['gorilla','Gorilla','hero'],['monkey','Monkey','hero'],['parrot','Parrot','hero'],
    ['toucan','Toucan','standard'],['frog','Frog','standard'],['chameleon','Chameleon','standard'],
    ['snake','Snake','standard'],['crocodile','Crocodile','standard'],['hippo','Hippo','standard'],
    ['giraffe','Giraffe','standard'],['jaguar','Jaguar','standard'],['sloth','Sloth','standard'],
    ['flamingo','Flamingo','standard'],['macaw','Macaw','standard'],['lemur','Lemur','standard'],
    ['mandrill','Mandrill','standard'],['butterfly','Butterfly','standard'],['tropical-flower','Tropical flower','standard'],
    ['giant-mushroom','Giant mushroom','standard'],['waterfall','Waterfall','standard'],['vine','Vine','standard'],
    ['explorer','Explorer','standard'],['tribal-drum','Tribal drum','standard'],['ancient-ruin','Ancient ruin stone','standard'],
    ['tree-frog','Tree frog (tiny)','standard'],['firefly','Firefly','standard'],['piranha','Piranha','standard'],
    ['sloth-hammock','Sloth in a hammock','secret'],['frog-umbrella','Frog with a tiny umbrella','secret'],
    ['parrot-party-hat','Parrot wearing a party hat','secret'],['explorer-map','Explorer with a map and magnifying glass','secret'],
    ['monkey-banana','Monkey eating a banana','secret'],['tiger-flower-crown','Tiger with a flower crown','secret'],
  ],
  farm: [
    ['cow','Cow','hero'],['pig','Pig','hero'],['sheep','Sheep','hero'],
    ['horse','Horse','hero'],['chicken','Chicken','hero'],['chick','Chick (baby)','hero'],
    ['duck','Duck','standard'],['duckling','Duckling','standard'],['goat','Goat','standard'],
    ['rabbit','Rabbit','standard'],['sheepdog','Dog (sheepdog)','standard'],['barn-cat','Cat (barn)','standard'],
    ['donkey','Donkey','standard'],['rooster','Rooster','standard'],['turkey','Turkey','standard'],
    ['tractor','Tractor','standard'],['wheelbarrow','Wheelbarrow','standard'],['hay-bale','Hay bale','standard'],
    ['watering-can','Watering can','standard'],['sunflower','Sunflower','standard'],['apple-tree','Apple tree','standard'],
    ['scarecrow','Scarecrow','standard'],['farmer-male','Farmer (male)','standard'],['farmer-female','Farmer (female)','standard'],
    ['windmill','Windmill','standard'],['barn-owl','Barn owl','standard'],['hedgehog','Hedgehog','standard'],
    ['fox','Fox','standard'],['beehive','Beehive','standard'],['vegetable-basket','Vegetable basket','standard'],
    ['pig-mud-bath','Pig in a mud bath','secret'],['sheep-jumper','Sheep wearing a jumper','secret'],
    ['cow-flowers','Cow with flowers on its head','secret'],['farmer-dancing','Farmer doing a silly dance','secret'],
    ['chicken-boots','Chicken wearing boots','secret'],['horse-top-hat','Horse with a top hat','secret'],
  ],
  dinosaurs: [
    ['t-rex','T-Rex','hero'],['triceratops','Triceratops','hero'],['brachiosaurus','Brachiosaurus','hero'],
    ['stegosaurus','Stegosaurus','hero'],['pterodactyl','Pterodactyl','hero'],['ankylosaurus','Ankylosaurus','hero'],
    ['diplodocus','Diplodocus','standard'],['spinosaurus','Spinosaurus','standard'],['velociraptor','Velociraptor','standard'],
    ['pachycephalosaurus','Pachycephalosaurus','standard'],['baby-t-rex','Baby T-Rex','standard'],
    ['dino-egg-cracking','Dino egg (cracking)','standard'],['dino-egg-unhatched','Dino egg (unhatched)','standard'],
    ['baby-dino-hatching','Baby dino (hatching)','standard'],['caveman','Caveman (friendly)','standard'],
    ['cavewoman','Cavewoman','standard'],['cave','Cave','standard'],['volcano','Volcano','standard'],
    ['ancient-fern','Ancient fern (big)','standard'],['fossil-rock','Fossil in rock','standard'],
    ['giant-dragonfly','Dragonfly (giant)','standard'],['mammoth','Mammoth','standard'],
    ['sabre-tooth','Sabre-tooth tiger','standard'],['meteor-incoming','Meteor (incoming)','standard'],
    ['tar-pit-bubbles','Tar pit bubbles','standard'],['dino-footprint','Dino footprint','standard'],
    ['prehistoric-fish','Prehistoric fish','standard'],['giant-beetle','Giant beetle','standard'],
    ['dinosaur-skull','Dinosaur skull','standard'],['dino-nest','Dino nest (eggs)','standard'],
    ['baby-t-rex-egg','Baby T-Rex in an egg','secret'],['triceratops-bow-tie','Triceratops with a bow tie','secret'],
    ['pterodactyl-fish','Pterodactyl carrying a fish','secret'],['caveman-riding-dino','Caveman riding a dino','secret'],
    ['stegosaurus-sunglasses','Stegosaurus with sunglasses','secret'],['volcano-party-hat','Volcano wearing a party hat','secret'],
  ],
  themePark: [
    ['balloon-red','Balloon (red)','hero'],['candy-floss','Candy floss','hero'],['ice-cream-cone','Ice cream cone','hero'],
    ['carousel-horse','Carousel horse','hero'],['roller-coaster-car','Roller coaster car','hero'],['clown','Clown (friendly)','hero'],
    ['balloon-bunch','Balloon (bunch)','standard'],['popcorn-box','Popcorn box','standard'],['hot-dog','Hot dog','standard'],
    ['toffee-apple','Toffee apple','standard'],['bumper-car','Bumper car','standard'],['magician','Magician','standard'],
    ['juggler','Juggler','standard'],['tightrope-walker','Tightrope walker','standard'],['goldfish-bag','Goldfish in bag','standard'],
    ['teddy-bear-prize','Teddy bear prize','standard'],['rubber-duck','Rubber duck','standard'],['dart-board','Dart board','standard'],
    ['strongman-bell','Strongman bell','standard'],['ticket-booth','Ticket booth','standard'],['ferris-wheel','Ferris wheel (small)','standard'],
    ['merry-go-round','Merry-go-round','standard'],['confetti-cannon','Confetti cannon','standard'],['star-banner','Star banner','standard'],
    ['firework-burst','Firework (burst)','standard'],['party-hat','Party hat','standard'],['fairy-lights','Fairy lights string','standard'],
    ['ghost-train-car','Ghost train car','standard'],['funhouse-mirror','Mirror (funhouse)','standard'],['acrobat','Acrobat','standard'],
    ['clown-unicycle','Clown riding a unicycle','secret'],['bear-winning-goldfish','Bear winning a goldfish','secret'],
    ['magician-rabbit','Magician pulling a rabbit from a hat','secret'],['acrobat-ball','Acrobat balancing on a ball','secret'],
    ['balloon-animal-dog','Balloon animal dog','secret'],['ice-cream-face','Ice cream with a face','secret'],
  ],
};

// Map themePark → theme-park for directory names
function sceneDirName(sceneId) {
  return sceneId === 'themePark' ? 'theme-park' : sceneId;
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('Set OPENAI_API_KEY environment variable first.');
    process.exit(1);
  }

  // Parse CLI args
  const args = process.argv.slice(2);
  const sceneFilter = args.find(a => a.startsWith('--scene='))?.split('=')[1] || null;
  const bgOnly = args.includes('--bg-only');
  const stickersOnly = args.includes('--stickers-only');

  const scenes = sceneFilter
    ? SCENE_IDS.filter(s => s === sceneFilter || sceneDirName(s) === sceneFilter)
    : SCENE_IDS;

  if (scenes.length === 0) {
    console.error(`Unknown scene: ${sceneFilter}`);
    console.error(`Available: ${SCENE_IDS.join(', ')}`);
    process.exit(1);
  }

  // Count totals
  let totalBgs = stickersOnly ? 0 : scenes.length;
  let totalStickers = bgOnly ? 0 : scenes.reduce((sum, s) => sum + STICKER_DATA[s].length, 0);
  const total = totalBgs + totalStickers;

  console.log('🎭 Generating Build-a-Scene assets with DALL-E 3...');
  console.log(`   Scenes: ${scenes.map(sceneDirName).join(', ')}`);
  console.log(`   Backgrounds: ${totalBgs} (1792x1024 HD)`);
  console.log(`   Stickers: ${totalStickers} (1024x1024)`);
  console.log(`   Total: ${total} images`);
  console.log(`   Estimated time: ~${Math.ceil(total * 15 / 60)} minutes`);
  console.log('');

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const sceneId of scenes) {
    const dir = sceneDirName(sceneId);
    const sceneDir = join(SCENES_DIR, dir);
    const stickerDir = join(sceneDir, 'stickers');
    await mkdir(sceneDir, { recursive: true });
    await mkdir(stickerDir, { recursive: true });

    // ── Background ──
    if (!stickersOnly) {
      const bgPath = join(sceneDir, 'bg.png');
      if (existsSync(bgPath)) {
        console.log(`🖼️  ${dir}/bg.png — already exists, skipping`);
        skipped++;
      } else {
        const bgPrompt = `${STYLE_BG}\n\n${BG_PROMPTS[dir] || BG_PROMPTS[sceneId]}`;
        console.log(`🖼️  ${dir}/bg.png — generating...`);
        try {
          const image = await generateImage(bgPrompt, '1792x1024');
          await writeFile(bgPath, image);
          generated++;
          console.log(`   ✅ saved`);
          await delay(12000);
        } catch (err) {
          console.error(`   ❌ failed: ${err.message}`);
          failed++;
          await delay(5000);
        }
      }
    }

    // ── Stickers ──
    if (!bgOnly) {
      const stickers = STICKER_DATA[sceneId];
      console.log(`\n🎨 ${dir} stickers (${stickers.length}):`);

      for (const [id, label, tier] of stickers) {
        const stickerPath = join(stickerDir, `${id}.png`);
        if (existsSync(stickerPath)) {
          console.log(`   ⏭️  ${id} — exists`);
          skipped++;
          continue;
        }

        const prompt = `${STYLE_STICKER}\n\n${stickerPrompt({ id, label }, sceneId)}`;
        console.log(`   🖌️  ${id} (${tier}) — "${label}"`);

        try {
          const image = await generateImage(prompt, '1024x1024');
          await writeFile(stickerPath, image);
          generated++;
          await delay(12000);
        } catch (err) {
          console.error(`   ❌ ${id} failed: ${err.message}`);
          failed++;
          await delay(5000);
        }
      }
    }

    console.log('');
  }

  console.log('━'.repeat(50));
  console.log(`✅ Done! Generated: ${generated} | Skipped: ${skipped} | Failed: ${failed}`);
  console.log(`   Location: public/images/scenes/`);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

main();
