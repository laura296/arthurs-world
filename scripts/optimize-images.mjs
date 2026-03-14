#!/usr/bin/env node
/**
 * Convert all generated PNG character sprites to optimised WebP.
 *
 * - Characters: resize to 512×512, WebP quality 80
 * - Backgrounds/scenes: resize to max 2048px wide, WebP quality 80
 * - Outputs alongside PNGs so code can switch to .webp references
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DIRS = [
  'public/assets/characters/tortoise-hare-race',
  'public/assets/characters/arthur-bear',
  'public/assets/characters',  // for the loose arthur-bear-excited.png
];

const BACKGROUND_NAMES = ['race-background', 'intro-scene'];
const CHAR_SIZE = 512;
const BG_WIDTH = 2048;
const QUALITY = 80;

async function convertFile(filePath) {
  const name = basename(filePath, extname(filePath));
  const outPath = filePath.replace(/\.png$/, '.webp');
  const isBg = BACKGROUND_NAMES.includes(name);

  let pipeline = sharp(filePath);
  const meta = await pipeline.metadata();

  if (isBg) {
    // Backgrounds: resize to max width, maintain aspect ratio
    if (meta.width > BG_WIDTH) {
      pipeline = pipeline.resize(BG_WIDTH, null, { fit: 'inside', withoutEnlargement: true });
    }
  } else {
    // Characters: resize to 512×512 max, maintain aspect ratio
    if (meta.width > CHAR_SIZE || meta.height > CHAR_SIZE) {
      pipeline = pipeline.resize(CHAR_SIZE, CHAR_SIZE, { fit: 'inside', withoutEnlargement: true });
    }
  }

  await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(outPath);

  const origSize = (await stat(filePath)).size;
  const newSize = (await stat(outPath)).size;
  const reduction = ((1 - newSize / origSize) * 100).toFixed(0);

  console.log(
    `  ${name}: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${reduction}% smaller)`
  );
}

async function main() {
  console.log('Converting PNGs to optimised WebP...\n');

  for (const dir of DIRS) {
    const fullDir = join(ROOT, dir);
    let files;
    try {
      files = await readdir(fullDir);
    } catch {
      continue;
    }

    const pngs = files.filter(f => f.endsWith('.png') && f !== '.gitkeep');
    if (pngs.length === 0) continue;

    console.log(`${dir}/`);
    for (const png of pngs) {
      await convertFile(join(fullDir, png));
    }
    console.log();
  }

  console.log('Done! Update code references from .png to .webp');
}

main().catch(e => { console.error(e); process.exit(1); });
