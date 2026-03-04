#!/usr/bin/env node
/**
 * Generate Premium Polish card illustrations using OpenAI DALL-E 3 API.
 *
 * Usage:
 *   node scripts/generate-polish-assets.mjs
 *   node scripts/generate-polish-assets.mjs --sections-only    # Section hero cards only
 *   node scripts/generate-polish-assets.mjs --games-only       # Game card covers only
 *
 * Environment:
 *   OPENAI_API_KEY — your OpenAI API key (required)
 *
 * Output:
 *   public/images/sections/{sectionId}.png   — section hero cards (1024x1024)
 *   public/images/cards/{gameId}.png         — game card covers (1024x1024)
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SECTIONS_DIR = join(ROOT, 'public', 'images', 'sections');
const CARDS_DIR = join(ROOT, 'public', 'images', 'cards');

// ─── Art style ───────────────────────────────────────────────────

const STYLE = `Children's animated TV show illustration in the style of Bluey (Australian cartoon). STRICT VISUAL RULES: Soft watercolour-style textures with visible brush strokes and paper grain. Warm, bright, saturated colours. Simple shapes — no overly detailed rendering. Hand-illustrated quality with soft edges. Gentle gradients within large shapes. Dreamy, inviting atmosphere. Slightly desaturated shadows in cool blue-violet tones. Golden warm highlights. No text or UI. Square format 1:1.`;

// ─── Section hero card prompts ──────────────────────────────────

const SECTION_PROMPTS = {
  games: 'A colourful outdoor playground with slides, swings, and bouncy balls. A grassy park with bright sunshine, rainbow kites in the sky, and happy colourful decorations. Fun, energetic, inviting. No characters.',
  puzzles: 'Colourful geometric puzzle pieces, jigsaw shapes, tangrams, and pattern blocks arranged artfully on a soft teal background. Shiny, satisfying, brain-teasing feel. No characters.',
  art: 'An artist easel with paintbrushes, splashy rainbow colours dripping, paint palette, crayons, and colourful splatter marks on a warm cream background. Creative, messy, joyful. No characters.',
  books: 'A cosy reading nook with a small bookshelf full of colourful books, a warm glowing lamp, a soft cushion, and fairy lights. Warm amber tones, inviting and peaceful. No characters.',
  music: 'A colourful concert stage with a piano, drums, guitar, tambourine, and xylophone. Musical notes floating in the air, stage lights in rainbow colours. Fun, rhythmic, exciting. No characters.',
  videos: 'A fun vintage TV screen showing colourful abstract shapes and stars, with popcorn and a cosy blanket nearby. Warm, nostalgic, entertainment feel. No characters.',
};

// ─── Game card cover prompts ────────────────────────────────────

const GAME_PROMPTS = {
  'bubble-pop': 'A magical underwater scene with dozens of colourful translucent bubbles floating upward — pink, blue, green, gold bubbles of all sizes. Shimmering light rays through turquoise water. Beautiful, mesmerising, and fun.',
  'feed-animals': 'A happy farm scene at feeding time. A red barn in the background, green fields, and a wooden trough overflowing with hay, carrots, apples. Sunshine and butterflies. Warm, inviting, and wholesome. No animals visible.',
  'pop-critters': 'Cute cartoon burrow holes in the ground with colourful mushrooms, flowers, and grass. Some holes have tiny sparkle effects. Warm earthy brown ground with bright green grass. Playful whack-a-mole feel. No animals visible.',
  'memory-match': 'Face-down playing cards arranged in a grid pattern with golden stars and swirl patterns on their backs. Soft purple background with sparkles and magic dust. Mystery and excitement.',
  'colouring': 'A blank white canvas on an easel with a rainbow-coloured palette below and cheerful paintbrushes standing in a jar. Paint splatters in rainbow colours around the edges. Creative and inviting.',
  'music-pad': 'Colourful piano keys arranged in a playful pattern with musical notes, stars, and sound waves emanating from them. Bright purple and gold background. Musical, rhythmic, exciting.',
  'build-a-scene': 'A magical empty landscape with floating colourful stickers nearby — stars, animals, trees, clouds — ready to be placed. Sparkle effects and a dreamy background. Creative and imaginative.',
};

// ─── API call ───────────────────────────────────────────────────

async function generateImage(prompt, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log(`  Generating: ${outputPath}`);
  const fullPrompt = `${STYLE}\n\n${prompt}`;

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DALL-E API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const b64 = data.data[0].b64_json;
  const buffer = Buffer.from(b64, 'base64');

  const dir = dirname(outputPath);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(outputPath, buffer);
  console.log(`  ✓ Saved: ${outputPath}`);
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const sectionsOnly = args.includes('--sections-only');
  const gamesOnly = args.includes('--games-only');
  const doSections = !gamesOnly;
  const doGames = !sectionsOnly;

  console.log('=== Premium Polish Asset Generation ===\n');

  if (doSections) {
    console.log('Section hero cards:');
    for (const [id, prompt] of Object.entries(SECTION_PROMPTS)) {
      const out = join(SECTIONS_DIR, `${id}.png`);
      if (existsSync(out)) {
        console.log(`  ⏭ Skipping ${id} (already exists)`);
        continue;
      }
      await generateImage(prompt, out);
      // Rate limit courtesy pause
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log();
  }

  if (doGames) {
    console.log('Game card covers:');
    for (const [id, prompt] of Object.entries(GAME_PROMPTS)) {
      const out = join(CARDS_DIR, `${id}.png`);
      if (existsSync(out)) {
        console.log(`  ⏭ Skipping ${id} (already exists)`);
        continue;
      }
      await generateImage(prompt, out);
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log();
  }

  console.log('Done! Generated images are ready in public/images/');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
