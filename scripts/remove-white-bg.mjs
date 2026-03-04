#!/usr/bin/env node
/**
 * Remove white backgrounds from DALL-E 3 sticker PNGs.
 * Makes white/near-white pixels transparent using sharp.
 *
 * Usage: node scripts/remove-white-bg.mjs [--scene=space]
 */

import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join } from 'path';

const SCENES_DIR = 'public/images/scenes';
const WHITE_THRESHOLD = 240; // RGB values above this → transparent
const EDGE_FEATHER = 8;      // pixels of alpha feathering at edges

const sceneFilter = process.argv.find(a => a.startsWith('--scene='))?.split('=')[1];

async function getStickers(sceneDir) {
  const stickerDir = join(sceneDir, 'stickers');
  try {
    const files = await readdir(stickerDir);
    return files.filter(f => f.endsWith('.png')).map(f => join(stickerDir, f));
  } catch {
    return [];
  }
}

async function removeWhiteBg(filePath) {
  const image = sharp(filePath);
  await image.metadata(); // validates image is readable

  // Get raw pixel data (ensure RGBA)
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const w = info.width;
  const h = info.height;

  // Pass 1: Mark white/near-white pixels as transparent
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      pixels[i + 3] = 0; // fully transparent
    }
  }

  // Pass 2: Feather edges — blend alpha near the boundary between
  // transparent and opaque regions for smoother edges
  const alphaMap = Buffer.alloc(pixels.length / 4);
  for (let i = 0; i < pixels.length; i += 4) {
    alphaMap[i / 4] = pixels[i + 3];
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (pixels[idx + 3] === 0) continue; // already transparent

      // Check distance to nearest transparent pixel
      let minDist = EDGE_FEATHER + 1;
      for (let dy = -EDGE_FEATHER; dy <= EDGE_FEATHER && minDist > 1; dy++) {
        for (let dx = -EDGE_FEATHER; dx <= EDGE_FEATHER && minDist > 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
            // Edge of image counts as transparent
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) minDist = dist;
            continue;
          }
          if (alphaMap[ny * w + nx] === 0) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) minDist = dist;
          }
        }
      }

      if (minDist <= EDGE_FEATHER) {
        // Fade alpha based on distance to transparent region
        const fade = Math.min(1, minDist / EDGE_FEATHER);
        pixels[idx + 3] = Math.round(pixels[idx + 3] * fade);
      }
    }
  }

  // Write back
  await sharp(pixels, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(filePath + '.tmp');

  // Replace original
  await rename(filePath + '.tmp', filePath);
}

async function main() {
  const scenes = await readdir(SCENES_DIR);
  let total = 0;
  let processed = 0;
  let failed = 0;

  for (const scene of scenes) {
    if (sceneFilter && scene !== sceneFilter) continue;
    const sceneDir = join(SCENES_DIR, scene);
    const s = await stat(sceneDir);
    if (!s.isDirectory()) continue;

    const stickers = await getStickers(sceneDir);
    if (stickers.length === 0) continue;

    console.log(`\n🎨 ${scene} (${stickers.length} stickers)`);

    for (const stickerPath of stickers) {
      total++;
      const name = stickerPath.split(/[\\/]/).pop();
      process.stdout.write(`   ${name}...`);
      try {
        await removeWhiteBg(stickerPath);
        processed++;
        console.log(' ✅');
      } catch (err) {
        failed++;
        console.log(` ❌ ${err.message}`);
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Done! Processed: ${processed} | Failed: ${failed} | Total: ${total}`);
}

main().catch(console.error);
