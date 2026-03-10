#!/usr/bin/env node
// scripts/download-videos.mjs
// Downloads YouTube videos for offline playback using yt-dlp (via python module).
// Uses execFileSync with array arguments to avoid shell injection.
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'videos');

const VIDEOS = [
  { id: 'baby-shark',        url: 'https://www.youtube.com/watch?v=XqZsoesa55w', title: 'Baby Shark' },
  { id: 'wheels-on-bus',     url: 'https://www.youtube.com/watch?v=e_04ZrNroTo', title: 'Wheels on the Bus' },
  { id: 'let-it-go',         url: 'https://www.youtube.com/watch?v=L0MK7qz13bU', title: 'Let It Go' },
  { id: 'old-macdonald',     url: 'https://www.youtube.com/watch?v=_6HzoUcx3eo', title: 'Old MacDonald' },
  { id: 'bath-song',         url: 'https://www.youtube.com/watch?v=WRVsOCh907o', title: 'Bath Song' },
  { id: 'head-shoulders',     url: 'https://www.youtube.com/watch?v=RuqvGiZi0qg', title: 'Head Shoulders Knees & Toes' },
  { id: 'twinkle-star',       url: 'https://www.youtube.com/watch?v=yCjJyiqpAuU', title: 'Twinkle Twinkle Little Star' },
  { id: 'itsy-bitsy-spider',  url: 'https://www.youtube.com/watch?v=bne3Ix_tJL8', title: 'Itsy Bitsy Spider' },
  { id: 'if-youre-happy',     url: 'https://www.youtube.com/watch?v=M6LoRZsHMSs', title: "If You're Happy" },
  { id: 'five-little-ducks',  url: 'https://www.youtube.com/watch?v=pZw9veQ76fo', title: 'Five Little Ducks' },
  { id: 'yes-yes-vegetables', url: 'https://www.youtube.com/watch?v=RE5tvaveVak', title: 'Yes Yes Vegetables' },
  { id: 'dinosaur-dance',    url: 'https://www.youtube.com/watch?v=qSkVgH-4PKw', title: 'Dinosaur Dance' },
  { id: 'youre-welcome',     url: 'https://www.youtube.com/watch?v=79DijItQXMM', title: "You're Welcome" },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

let done = 0;
for (const video of VIDEOS) {
  const videoPath = path.join(OUT_DIR, `${video.id}.mp4`);
  const thumbPath = path.join(OUT_DIR, `${video.id}.webp`);

  if (fs.existsSync(videoPath)) {
    console.log(`[${++done}/${VIDEOS.length}] ${video.title} — already downloaded, skipping`);
    continue;
  }

  console.log(`[${++done}/${VIDEOS.length}] Downloading: ${video.title}...`);

  try {
    // Download video as direct mp4 via HTTPS (format 18 = 360p mp4).
    // HLS/m3u8 formats produce MPEG-TS without ffmpeg, so we use format 18 which
    // is a pre-muxed mp4 served over HTTPS — plays directly in browsers.
    // --js-runtimes node + --remote-components ejs:github needed for YouTube signature solving
    execFileSync('python', [
      '-m', 'yt_dlp',
      '--js-runtimes', 'node',
      '--remote-components', 'ejs:github',
      '-f', '18',
      '-o', videoPath,
      '--no-playlist',
      '--no-warnings',
      video.url,
    ], { stdio: 'inherit', timeout: 300000 });

    console.log(`  ✓ Video saved`);
  } catch (e) {
    console.error(`  ✗ Video download failed: ${e.message}`);
    continue;
  }

  // Download thumbnail
  try {
    execFileSync('python', [
      '-m', 'yt_dlp',
      '--js-runtimes', 'node',
      '--remote-components', 'ejs:github',
      '--write-thumbnail',
      '--skip-download',
      '-o', path.join(OUT_DIR, video.id),
      '--no-playlist',
      '--no-warnings',
      video.url,
    ], { stdio: 'inherit', timeout: 60000 });
    console.log(`  ✓ Thumbnail saved`);
  } catch (e) {
    console.log(`  ⚠ Thumbnail failed (non-critical): ${e.message}`);
  }
}

console.log(`\n✅ Done! ${VIDEOS.length} videos processed.`);
