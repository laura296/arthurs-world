#!/usr/bin/env node
// scripts/generate-puppy-wash-assets.mjs
// Generates all image assets for the Puppy Wash Day: Kind Helper game
// Disney 101 Dalmatians visual style
// Usage: node scripts/generate-puppy-wash-assets.mjs [--force]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'disney', 'puppy-wash');
const FORCE = process.argv.includes('--force');

const API_KEY = process.env.VITE_OPENAI_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENAI_API_KEY'); process.exit(1); }

const STYLE = "Disney 101 Dalmatians animated film style. Warm golden lighting. Soft round shapes. Rich saturated colours. Beautiful painterly digital art. Adorable child-friendly illustration. No text. No words. No letters. No numbers.";

const ASSETS = {
  // ── Backgrounds ──
  'bg-bath': `A warm cozy dog grooming room — golden sunlight streaming through a window. A cute pink bathtub in the centre. Soap bubbles floating in the air. Fluffy towels on a shelf. Dog shampoo bottles. Warm wooden floor with a cheerful rug. Friendly and inviting like a Disney movie set. Pastel pink, warm cream, soft gold tones. ${STYLE}`,

  'bg-room': `A cozy puppy nursery room — warm and magical. Soft cushioned dog beds with blankets. Fairy lights twinkling. Toys scattered around. A window showing a starry night. Warm glowing lamp. Dog bone decorations on the wall. Peaceful bedtime atmosphere. Cream, soft lavender, warm gold lighting. ${STYLE}`,

  // ── Dalmatian puppies in different states ──
  'puppy-muddy': `An adorable dalmatian puppy covered in brown mud splatters. Big sad puppy eyes looking up at the viewer. Black and white spots barely visible under the mud. Ears drooping. Sitting in a small puddle. The puppy looks like it needs help — not scared, just messy and a little sad. Full body view. Simple clean background. ${STYLE}`,

  'puppy-soapy': `An adorable dalmatian puppy covered in white fluffy soap bubbles sitting in a pink bathtub. Eyes peeking out through the bubbles. Happy expression emerging — starting to enjoy the bath. Iridescent rainbow bubbles floating around. Cute rubber duck nearby. Full body view. Simple clean background. ${STYLE}`,

  'puppy-wet': `An adorable dalmatian puppy freshly washed — soaking wet with big droopy ears. Clean white and black spotted fur glistening with water droplets. Big round eyes. Cute expression — clean but a bit cold and shivery. Standing on a fluffy towel. Full body view. Simple clean background. ${STYLE}`,

  'puppy-fluffy': `An adorable dalmatian puppy perfectly dry and fluffy after grooming. Pristine white fur with beautiful black spots. Bright happy eyes. Ears perked up. Fur is soft and puffy. The puppy looks comfortable and content. Sitting proudly. Full body view. Simple clean background. ${STYLE}`,

  'puppy-happy': `An adorable dalmatian puppy jumping with pure joy and excitement. Tail wagging wildly. Tongue out. Bright sparkling eyes. Wearing a cute red collar with a heart-shaped tag. Tiny hearts floating around. The happiest puppy in the world. Full body view. Warm golden glow. Simple clean background. ${STYLE}`,

  'puppy-sleeping': `An adorable dalmatian puppy curled up sleeping peacefully on a soft cushioned dog bed with a tiny blanket. Eyes gently closed. Peaceful smile. Little paws tucked in. Warm golden lamplight. Tiny z's floating above. Peaceful and cozy. Full body view. ${STYLE}`,

  // ── Puppy moods (for select screen) ──
  'puppy-sleepy': `An adorable sleepy dalmatian puppy with half-closed drowsy eyes. Yawning cutely. Spots barely visible under some light dust. Sitting on the floor looking tired and in need of a warm bath. Cute floppy ears. Full body view. Simple clean background. ${STYLE}`,

  'puppy-shy': `An adorable shy dalmatian puppy hiding partially behind a curtain, peeking out with big uncertain eyes. A few mud marks on the fur. Tail tucked. Looking timid but sweet. Needs gentle help. Full body view. Simple clean background. ${STYLE}`,

  // ── Parent dogs ──
  'pongo': `Pongo the adult dalmatian from 101 Dalmatians — handsome, tall, proud father dog. Black and white spotted. Wearing a simple red collar. Standing with a warm encouraging expression. Friendly and protective. Full body side view. Simple clean background. ${STYLE}`,

  'perdita': `Perdita the adult dalmatian from 101 Dalmatians — beautiful, graceful mother dog. Elegant black and white spotted fur. Wearing a simple blue collar. Warm gentle expression. Loving and caring. Full body side view. Simple clean background. ${STYLE}`,

  // ── Tools ──
  'soap-bottle': `A cute cartoon dog shampoo bottle — round and friendly shaped. Pink bottle with a paw print label. Some bubbles floating from the top. Shiny and appealing to children. Simple clean background. ${STYLE}`,

  'towel': `A soft fluffy folded towel — warm cream colour with tiny paw print patterns. Thick and cozy looking. Soft and inviting. Simple clean background. ${STYLE}`,

  'brush': `A cute dog grooming brush — rounded friendly shape with soft pink handle. Golden bristles. Small and child-sized. Sparkles around it suggesting magic. Simple clean background. ${STYLE}`,

  // ── Accessories ──
  'collar-red': `A beautiful red dog collar with a golden heart-shaped name tag. Shiny and new. Cute buckle. Sparkles around it. Simple clean background. ${STYLE}`,

  'bow-blue': `A cute blue satin bow for a puppy — large and fluffy with ribbon tails. Sparkly and pretty. Perfect for a dalmatian. Simple clean background. ${STYLE}`,

  'bandana-yellow': `A cheerful yellow bandana with tiny white polka dots — folded in a triangle ready to tie around a puppy's neck. Bright and sunny. Simple clean background. ${STYLE}`,

  // ── Care choice items ──
  'treat-bone': `A delicious-looking cartoon dog biscuit bone treat — golden brown, perfectly baked. Small sparkles around it. Appetizing and cute. Simple clean background. ${STYLE}`,

  'water-bowl': `A cute dog water bowl — blue ceramic with a paw print on the side. Fresh clean water inside with a slight sparkle. Inviting. Simple clean background. ${STYLE}`,

  'toy-ball': `A cute bouncy red rubber ball with a yellow star pattern — shiny and new. A fun dog toy. Slightly bouncing with motion lines. Simple clean background. ${STYLE}`,

  'blanket-soft': `A soft cozy small dog blanket — pastel lavender with white paw print pattern. Fluffy and warm looking. Folded gently. Simple clean background. ${STYLE}`,

  // ── Reward badges ──
  'heart-badge': `A beautiful golden heart-shaped badge with the word KIND written in sparkly letters inside. Glowing warmly. Magical sparkles around it. Like a Disney achievement medal. Simple clean background. ${STYLE}`,

  'paw-badge': `A cute golden paw print badge — like a gold medal with a paw shape. Sparkles and a tiny crown on top. Achievement badge for gentle helpers. Warm golden glow. Simple clean background. ${STYLE}`,
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
  console.log(`Generating ${entries.length} Puppy Wash Day assets\n`);
  let done = 0;

  for (const [key, prompt] of entries) {
    const outPath = path.join(IMG_DIR, `${key}.png`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    if (!FORCE && fs.existsSync(outPath)) {
      console.log(`[${++done}/${entries.length}] ${key}.png exists, skipping`);
      continue;
    }

    const size = key.startsWith('bg-') ? '1536x1024' : '1024x1024';
    console.log(`[${++done}/${entries.length}] ${key} (${size})...`);
    try {
      const buf = await generateImage(prompt, size);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ ${key}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ✗ FAILED: ${e.message}`);
    }
  }

  console.log(`\n✅ Done! All Puppy Wash Day assets generated.`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
