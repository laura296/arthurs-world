#!/usr/bin/env node
/**
 * Scans public/ and writes public/asset-manifest.json
 * Used by the OfflineDownloader to prefetch all assets for offline use.
 * Run: node scripts/generate-asset-manifest.mjs
 * Also runs automatically as part of `npm run build`.
 */
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative, extname } from 'path';

const PUBLIC = new URL('../public', import.meta.url).pathname;
const BASE = '/arthurs-world/';

// Extensions to include in the manifest
const CACHEABLE = new Set([
  '.png', '.webp', '.jpg', '.jpeg', '.gif',  // images
  '.mp3',                                      // audio
  '.mp4',                                      // video
  '.json',                                     // lottie/data
]);

// Files/dirs to skip
const SKIP = new Set(['asset-manifest.json', '.gitkeep', 'icons']);

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      const ext = extname(entry).toLowerCase();
      if (CACHEABLE.has(ext)) {
        results.push({
          url: BASE + relative(PUBLIC, full),
          size: stat.size,
          type: ext.slice(1), // 'png', 'mp3', etc.
        });
      }
    }
  }
  return results;
}

const assets = walk(PUBLIC);

// Sort by type then path for readability
assets.sort((a, b) => a.type.localeCompare(b.type) || a.url.localeCompare(b.url));

const manifest = {
  generated: new Date().toISOString(),
  totalAssets: assets.length,
  totalBytes: assets.reduce((sum, a) => sum + a.size, 0),
  assets,
};

const outPath = join(PUBLIC, 'asset-manifest.json');
writeFileSync(outPath, JSON.stringify(manifest));
console.log(`Asset manifest: ${assets.length} files, ${(manifest.totalBytes / 1024 / 1024).toFixed(1)}MB → ${outPath}`);
