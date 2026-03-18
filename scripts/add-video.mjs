#!/usr/bin/env node
/**
 * Add a YouTube video to Arthur's World with Claude AI content screening.
 *
 * Usage:
 *   node scripts/add-video.mjs <youtube-url> [--skip-download] [--force]
 *
 * Requires:
 *   - ANTHROPIC_API_KEY env var (for content screening)
 *   - yt-dlp (python -m yt_dlp) for downloading
 *
 * Flow:
 *   1. Fetch video metadata from YouTube via yt-dlp --dump-json
 *   2. Send metadata to Claude for age-appropriateness screening
 *   3. If approved (or --force), download video + thumbnail
 *   4. Add entry to data/video-registry.json
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'video-registry.json');
const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');

// ── Colour palettes for auto-assignment ──
const PALETTES = [
  { bg: 'from-yellow-400 to-orange-500', color: '#f59e0b' },
  { bg: 'from-red-400 to-rose-600', color: '#f87171' },
  { bg: 'from-sky-300 to-blue-600', color: '#38bdf8' },
  { bg: 'from-green-400 to-emerald-600', color: '#4ade80' },
  { bg: 'from-cyan-400 to-blue-500', color: '#22d3ee' },
  { bg: 'from-amber-400 to-yellow-600', color: '#fbbf24' },
  { bg: 'from-indigo-400 to-purple-600', color: '#818cf8' },
  { bg: 'from-pink-400 to-rose-600', color: '#f472b6' },
  { bg: 'from-fuchsia-400 to-pink-600', color: '#e879f9' },
  { bg: 'from-violet-400 to-purple-600', color: '#a78bfa' },
  { bg: 'from-lime-400 to-green-600', color: '#a3e635' },
  { bg: 'from-emerald-400 to-teal-600', color: '#34d399' },
  { bg: 'from-teal-400 to-cyan-600', color: '#2dd4bf' },
  { bg: 'from-rose-400 to-red-600', color: '#fb7185' },
];

// ── Helpers ──

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

/** Fetch video metadata via yt-dlp --dump-json */
function fetchYouTubeMetadata(url) {
  console.log('Fetching YouTube metadata...');
  const raw = execFileSync('python', [
    '-m', 'yt_dlp',
    '--js-runtimes', 'node',
    '--remote-components', 'ejs:github',
    '--dump-json',
    '--no-playlist',
    '--no-warnings',
    url,
  ], { timeout: 60000, maxBuffer: 10 * 1024 * 1024 });

  return JSON.parse(raw.toString());
}

/** Call Claude API to screen video content for age-appropriateness */
async function screenWithClaude(metadata) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY not set. Cannot screen video.');
    console.error('Set it with: export ANTHROPIC_API_KEY=your-key');
    process.exit(1);
  }

  const prompt = `You are a child safety content screener for a children's app used by a 3.5-year-old child called Arthur.

Analyse this YouTube video metadata and determine if it is safe and age-appropriate for a toddler (~3.5 years old).

The video MUST be rejected if it contains ANY of the following:
- Violence, fighting, weapons, or people/characters being hurt
- Scary content — monsters, horror, jump scares, dark/threatening imagery
- Death, killing, or graphic injury
- Bullying, cruelty, or mean behaviour
- Sexual content or innuendo
- Swearing, profanity, or adult language
- Drug or alcohol references
- Intense conflict, war, or disaster themes
- Content designed to frighten or disturb children
- Manipulative or exploitative content targeting children

The video SHOULD be approved if it features:
- Nursery rhymes, sing-alongs, lullabies
- Educational content (colours, shapes, numbers, letters, animals)
- Gentle stories with positive themes
- Dance/movement songs
- Disney/Pixar age-appropriate songs
- Nature/animal content that is gentle and curious

VIDEO METADATA:
- Title: ${metadata.title}
- Channel: ${metadata.channel || metadata.uploader || 'Unknown'}
- Description: ${(metadata.description || '').slice(0, 2000)}
- Tags: ${(metadata.tags || []).join(', ')}
- Categories: ${(metadata.categories || []).join(', ')}
- Duration: ${metadata.duration}s
- Age limit: ${metadata.age_limit || 0}
- Is for kids: ${metadata.is_kids_content !== undefined ? metadata.is_kids_content : 'unknown'}
${metadata.subtitles || metadata.automatic_captions ? '- Has captions available: yes' : ''}

Respond with EXACTLY this JSON format (no markdown, no extra text):
{"verdict": "approved" or "rejected", "reason": "one sentence explanation", "concerns": ["list", "of", "specific", "concerns"] or []}`;

  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`Claude API error: ${response.error.message}`));
            return;
          }
          const text = response.content[0].text;
          resolve(JSON.parse(text));
        } catch (e) {
          reject(new Error(`Failed to parse Claude response: ${e.message}\nRaw: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Download video + thumbnail using yt-dlp */
function downloadVideo(url, id) {
  const videoPath = path.join(VIDEOS_DIR, `${id}.mp4`);
  const thumbPath = path.join(VIDEOS_DIR, `${id}.webp`);

  fs.mkdirSync(VIDEOS_DIR, { recursive: true });

  if (fs.existsSync(videoPath)) {
    console.log('  Video already downloaded, skipping.');
  } else {
    console.log('  Downloading video (360p MP4)...');
    execFileSync('python', [
      '-m', 'yt_dlp',
      '--js-runtimes', 'node',
      '--remote-components', 'ejs:github',
      '-f', '18',
      '-o', videoPath,
      '--no-playlist',
      '--no-warnings',
      url,
    ], { stdio: 'inherit', timeout: 300000 });
    console.log('  Video downloaded.');
  }

  if (!fs.existsSync(thumbPath)) {
    console.log('  Downloading thumbnail...');
    try {
      execFileSync('python', [
        '-m', 'yt_dlp',
        '--js-runtimes', 'node',
        '--remote-components', 'ejs:github',
        '--write-thumbnail',
        '--skip-download',
        '-o', path.join(VIDEOS_DIR, id),
        '--no-playlist',
        '--no-warnings',
        url,
      ], { stdio: 'inherit', timeout: 60000 });
      console.log('  Thumbnail saved.');
    } catch (e) {
      console.log(`  Thumbnail failed (non-critical): ${e.message}`);
    }
  }
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter(a => a.startsWith('--'));
  const positional = args.filter(a => !a.startsWith('--'));

  const skipDownload = flags.includes('--skip-download');
  const force = flags.includes('--force');

  if (positional.length === 0) {
    console.log(`
Usage: node scripts/add-video.mjs <youtube-url> [options]

Options:
  --skip-download   Screen only, don't download the video
  --force           Download even if screening rejects the video

Environment:
  ANTHROPIC_API_KEY  Required for content screening

Example:
  export ANTHROPIC_API_KEY=sk-ant-...
  node scripts/add-video.mjs "https://www.youtube.com/watch?v=ABC123"
`);
    process.exit(0);
  }

  const url = positional[0];

  // Validate URL
  if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
    console.error('ERROR: Please provide a valid YouTube URL.');
    process.exit(1);
  }

  // 1. Fetch metadata
  let metadata;
  try {
    metadata = fetchYouTubeMetadata(url);
  } catch (e) {
    console.error(`Failed to fetch video metadata: ${e.message}`);
    process.exit(1);
  }

  const id = slugify(metadata.title);
  console.log(`\nVideo: "${metadata.title}"`);
  console.log(`Channel: ${metadata.channel || metadata.uploader || 'Unknown'}`);
  console.log(`Duration: ${Math.floor(metadata.duration / 60)}m ${metadata.duration % 60}s`);
  console.log(`ID: ${id}`);

  // Check if already in registry
  const registry = loadRegistry();
  const existing = registry.videos.find(v => v.youtubeUrl === url || v.id === id);
  if (existing) {
    console.log(`\nThis video is already in the registry as "${existing.id}" (status: ${existing.status}).`);
    if (!force) {
      console.log('Use --force to re-screen and re-add.');
      process.exit(0);
    }
  }

  // 2. Screen with Claude
  console.log('\nScreening content with Claude AI...');
  let screening;
  try {
    screening = await screenWithClaude(metadata);
  } catch (e) {
    console.error(`Screening failed: ${e.message}`);
    process.exit(1);
  }

  const approved = screening.verdict === 'approved';
  console.log(`\nVerdict: ${approved ? 'APPROVED' : 'REJECTED'}`);
  console.log(`Reason: ${screening.reason}`);
  if (screening.concerns && screening.concerns.length > 0) {
    console.log(`Concerns: ${screening.concerns.join(', ')}`);
  }

  if (!approved && !force) {
    console.log('\nVideo rejected. Not downloading.');
    console.log('Use --force to download anyway (it will be saved with "rejected" status).');

    // Still save to registry as rejected so parent can see it was reviewed
    if (!existing) {
      const palette = PALETTES[registry.videos.length % PALETTES.length];
      registry.videos.push({
        id,
        title: metadata.title,
        youtubeUrl: url,
        bg: palette.bg,
        color: palette.color,
        status: 'rejected',
        addedAt: new Date().toISOString(),
        screening: {
          verdict: 'rejected',
          reason: screening.reason,
          concerns: screening.concerns || [],
          screenedAt: new Date().toISOString(),
        },
      });
      saveRegistry(registry);
      console.log('Saved to registry as rejected (visible in admin page).');
    }
    process.exit(0);
  }

  // 3. Download
  if (!skipDownload) {
    downloadVideo(url, id);
  }

  // 4. Update registry
  const palette = PALETTES[registry.videos.length % PALETTES.length];
  const entry = {
    id,
    title: metadata.title,
    youtubeUrl: url,
    bg: palette.bg,
    color: palette.color,
    status: approved ? 'approved' : 'rejected',
    addedAt: new Date().toISOString(),
    screening: {
      verdict: screening.verdict,
      reason: screening.reason,
      concerns: screening.concerns || [],
      screenedAt: new Date().toISOString(),
    },
  };

  if (existing) {
    const idx = registry.videos.findIndex(v => v.id === existing.id);
    registry.videos[idx] = { ...existing, ...entry, id: existing.id };
  } else {
    registry.videos.push(entry);
  }

  saveRegistry(registry);
  console.log(`\nSaved to registry. Status: ${entry.status}`);

  if (!skipDownload) {
    console.log(`Video available at: /arthurs-world/videos/${id}.mp4`);
  }

  console.log('\nDone!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
