#!/usr/bin/env node
/**
 * Convert all PNGs in public/images/ to WebP using sharp.
 * Deletes originals after successful conversion.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

let converted = 0;
let skipped = 0;
let savedBytes = 0;

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (entry.name.endsWith('.png') && entry.name !== '.gitkeep') {
      const webpPath = fullPath.replace(/\.png$/, '.webp');
      if (fs.existsSync(webpPath)) {
        skipped++;
        continue;
      }
      try {
        const origSize = fs.statSync(fullPath).size;
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(webpPath);
        const newSize = fs.statSync(webpPath).size;
        savedBytes += origSize - newSize;
        // Delete original PNG
        fs.unlinkSync(fullPath);
        converted++;
        if (converted % 20 === 0) {
          console.log(`  ${converted} files converted... (saved ${(savedBytes / 1024 / 1024).toFixed(0)}MB so far)`);
        }
      } catch (e) {
        console.error(`  ❌ Failed: ${fullPath}: ${e.message}`);
      }
    }
  }
}

async function main() {
  console.log('🖼️  Converting PNGs to WebP...\n');
  await convertDir(IMAGES_DIR);
  console.log(`\n✅ Done! Converted: ${converted}, Skipped: ${skipped}`);
  console.log(`💾 Saved: ${(savedBytes / 1024 / 1024).toFixed(0)}MB`);
}

main().catch(e => { console.error(e); process.exit(1); });
