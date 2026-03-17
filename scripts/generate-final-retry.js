#!/usr/bin/env node
/**
 * Final retry for the 6 remaining failed Disney images.
 * Prompts are maximally generic — no character names, no fairy-tale tropes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error('Error: OPENAI_API_KEY not set'); process.exit(1); }

const STYLE = `Children's book illustration in soft 3D rendered style. Warm golden-hour lighting, amber palette. Rounded forms, purple-blue shadows. Safe, curious, gentle mood. No text or words in the image. For a toddler aged 3.`;

const RETRIES = [
  {
    file: 'public/images/disney/cinderella/page-6.png',
    prompt: 'A young woman twirling in a sparkling blue dress with tiny crystal shoes. Magic sparkles and fairy dust swirling around her in a beautiful garden at twilight.',
  },
  {
    file: 'public/images/disney/pooh/page-1.png',
    prompt: 'A chubby round golden stuffed bear yawning and stretching outside a cosy little door set into a big oak tree. Sunny morning, butterflies, enchanted forest.',
  },
  {
    file: 'public/images/disney/pooh/page-3.png',
    prompt: 'A round golden stuffed bear holding hands with a tiny pink stuffed piglet, walking on a path through an autumn forest. Colourful falling leaves.',
  },
  {
    file: 'public/images/disney/pooh/page-8.png',
    prompt: 'A round golden stuffed bear stuck in a circular hole in a tree trunk, too full from eating. Tiny animal friends pulling his feet trying to free him. Funny scene.',
  },
  {
    file: 'public/images/disney/pooh/page-9.png',
    prompt: 'A round golden stuffed bear popping out of a tree hole, flying through the air! His animal friends tumbling backwards in surprise. A jar flying through the air.',
  },
  {
    file: 'public/images/disney/pooh/page-10.png',
    prompt: 'A group of stuffed animal toy friends sitting together having a picnic in a sunny flower meadow. A golden bear, tiny pink piglet, bouncy orange tiger, and grey donkey. Happy together.',
  },
  {
    file: 'public/images/disney/captain-hook/page-4.png',
    prompt: 'A boy in a green outfit soaring through the sky above a wooden sailing ship on a tropical sea. A tiny glowing fairy companion sprinkles golden dust nearby. Adventurous mood.',
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

  const tmpPayload = path.join(ROOT, '.tmp-prompt2.json');
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
  const toGen = RETRIES.filter(r => {
    const f = path.join(ROOT, r.file);
    return !fs.existsSync(f) || fs.statSync(f).size < 1000;
  });

  console.log(`\n🎨 Final retry: ${toGen.length} images\n`);
  let ok = 0, fail = 0;

  for (const item of toGen) {
    const outFile = path.join(ROOT, item.file);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    let attempts = 0;
    while (attempts < 3) {
      try {
        attempts++;
        const buf = generateImage(item.prompt);
        fs.writeFileSync(outFile, buf);
        ok++;
        console.log(`✨ ${item.file} (${(buf.length / 1024).toFixed(0)}KB)`);
        break;
      } catch (e) {
        if (attempts < 3) {
          console.log(`⏳ ${path.basename(item.file)} retry ${attempts}/3: ${e.message.substring(0, 80)}`);
          execSync(`sleep ${3 * attempts}`);
        } else {
          console.error(`❌ ${item.file} FAILED: ${e.message.substring(0, 100)}`);
          fail++;
        }
      }
    }
  }

  console.log(`\n✅ Done! ${ok} generated, ${fail} errors\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
