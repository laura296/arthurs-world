#!/usr/bin/env node
/**
 * Bulk-add YouTube videos to a TV show category.
 *
 * Usage:
 *   node scripts/add-show-episodes.mjs <show-id> <youtube-url> [youtube-url...]
 *   node scripts/add-show-episodes.mjs peppa-pig urls.txt
 *   node scripts/add-show-episodes.mjs --search <show-id> <query> [--count 10]
 *
 * Modes:
 *   1. Direct URLs:  Pass YouTube URLs as arguments
 *   2. File:         Pass a .txt file with one URL per line
 *   3. Search:       Use --search to find episodes on YouTube
 *
 * Requires:
 *   - yt-dlp (python3 -m yt_dlp) for metadata + download
 *   - ANTHROPIC_API_KEY env var for content screening (optional with --skip-screen)
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'video-registry.json');
const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');

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

/** Extract video ID from various YouTube URL formats */
function extractVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/** Fetch video metadata via yt-dlp */
function fetchMetadata(url) {
  const raw = execFileSync('python3', [
    '-m', 'yt_dlp',
    '--dump-json',
    '--no-playlist',
    '--no-warnings',
    url,
  ], { timeout: 60000, maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(raw.toString());
}

/** Search YouTube for videos matching a query */
function searchYouTube(query, count = 15) {
  console.log(`\nSearching YouTube for: "${query}" (top ${count})...\n`);
  const raw = execFileSync('python3', [
    '-m', 'yt_dlp',
    `ytsearch${count}:${query}`,
    '--dump-json',
    '--no-download',
    '--no-warnings',
    '--flat-playlist',
  ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });

  // yt-dlp outputs one JSON object per line
  return raw.toString().trim().split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

/** Screen with Claude AI */
async function screenWithClaude(metadata) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { verdict: 'approved', reason: 'Screening skipped (no API key)', concerns: [] };

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
- Well-known children's TV show episodes (Peppa Pig, Morphle, Spidey and His Amazing Friends, etc.)
- Disney/Pixar age-appropriate songs
- Nature/animal content that is gentle and curious

VIDEO METADATA:
- Title: ${metadata.title}
- Channel: ${metadata.channel || metadata.uploader || 'Unknown'}
- Description: ${(metadata.description || '').slice(0, 2000)}
- Tags: ${(metadata.tags || []).join(', ')}
- Duration: ${metadata.duration}s
- Age limit: ${metadata.age_limit || 0}
- Is for kids: ${metadata.is_kids_content !== undefined ? metadata.is_kids_content : 'unknown'}

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
          if (response.error) { reject(new Error(response.error.message)); return; }
          resolve(JSON.parse(response.content[0].text));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Download video + thumbnail */
function downloadVideo(url, id) {
  const videoPath = path.join(VIDEOS_DIR, `${id}.mp4`);
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });

  if (fs.existsSync(videoPath)) {
    console.log(`    Already downloaded, skipping.`);
    return;
  }

  console.log(`    Downloading video (360p)...`);
  execFileSync('python3', [
    '-m', 'yt_dlp',
    '-f', '18',
    '-o', videoPath,
    '--no-playlist',
    '--no-warnings',
    url,
  ], { stdio: 'inherit', timeout: 300000 });

  // Thumbnail
  try {
    execFileSync('python3', [
      '-m', 'yt_dlp',
      '--write-thumbnail',
      '--skip-download',
      '-o', path.join(VIDEOS_DIR, id),
      '--no-playlist',
      '--no-warnings',
      url,
    ], { stdio: 'inherit', timeout: 60000 });
  } catch {
    console.log(`    Thumbnail failed (non-critical)`);
  }
}

/** Interactive prompt */
function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter(a => a.startsWith('--'));
  const positional = args.filter(a => !a.startsWith('--'));

  const skipScreen = flags.includes('--skip-screen');
  const skipDownload = flags.includes('--skip-download');
  const searchMode = flags.includes('--search');
  const countIdx = flags.indexOf('--count');
  const searchCount = countIdx >= 0 ? parseInt(flags[countIdx + 1]) || 15 : 15;

  if (positional.length < 2 && !searchMode) {
    console.log(`
Add YouTube videos to a TV show in Arthur's World.

Usage:
  node scripts/add-show-episodes.mjs <show-id> <url> [url...]
  node scripts/add-show-episodes.mjs <show-id> urls.txt
  node scripts/add-show-episodes.mjs --search <show-id> "<query>" [--count 15]

Show IDs: peppa-pig, morphle, spidey

Options:
  --search          Search YouTube instead of providing URLs
  --count N         Number of search results (default: 15)
  --skip-screen     Skip Claude AI content screening
  --skip-download   Add to registry without downloading

Examples:
  node scripts/add-show-episodes.mjs peppa-pig "https://youtube.com/watch?v=ABC" "https://youtube.com/watch?v=DEF"
  node scripts/add-show-episodes.mjs --search morphle "my magic pet morphle full episode" --count 10
  node scripts/add-show-episodes.mjs spidey spidey-urls.txt
`);
    process.exit(0);
  }

  const showId = positional[0];
  const registry = loadRegistry();

  // Validate show exists
  const show = registry.shows?.find(s => s.id === showId);
  if (!show) {
    console.error(`Show "${showId}" not found. Available: ${(registry.shows || []).map(s => s.id).join(', ')}`);
    process.exit(1);
  }

  let urls = [];

  if (searchMode) {
    // Search mode — find videos on YouTube
    const query = positional.slice(1).join(' ') || `${show.title} full episode for kids`;
    const results = searchYouTube(query, searchCount);

    console.log(`Found ${results.length} results:\n`);
    results.forEach((r, i) => {
      const dur = r.duration ? `${Math.floor(r.duration / 60)}m${r.duration % 60}s` : '?';
      const already = registry.videos.some(v => v.youtubeUrl?.includes(r.id));
      const tag = already ? ' [ALREADY ADDED]' : '';
      console.log(`  ${(i + 1).toString().padStart(2)}. ${r.title} (${dur}) — ${r.channel || r.uploader || '?'}${tag}`);
      console.log(`      https://www.youtube.com/watch?v=${r.id}`);
    });

    const answer = await ask('\nEnter numbers to add (e.g., "1,3,5,7-10" or "all"): ');

    if (answer.toLowerCase() === 'all') {
      urls = results.map(r => `https://www.youtube.com/watch?v=${r.id}`);
    } else {
      const indices = new Set();
      for (const part of answer.split(',').map(s => s.trim())) {
        if (part.includes('-')) {
          const [a, b] = part.split('-').map(Number);
          for (let i = a; i <= b; i++) indices.add(i);
        } else {
          indices.add(parseInt(part));
        }
      }
      urls = [...indices]
        .filter(i => i >= 1 && i <= results.length)
        .sort((a, b) => a - b)
        .map(i => `https://www.youtube.com/watch?v=${results[i - 1].id}`);
    }
  } else {
    // URL or file mode
    const urlArg = positional[1];
    if (urlArg.endsWith('.txt') && fs.existsSync(urlArg)) {
      urls = fs.readFileSync(urlArg, 'utf-8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));
    } else {
      urls = positional.slice(1);
    }
  }

  // Normalise YouTube Kids URLs to standard YouTube URLs
  urls = urls.map(u => {
    const vid = extractVideoId(u);
    return vid ? `https://www.youtube.com/watch?v=${vid}` : u;
  });

  console.log(`\nProcessing ${urls.length} videos for "${show.title}"...\n`);

  let added = 0;
  let skipped = 0;
  let rejected = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const vid = extractVideoId(url);
    console.log(`[${i + 1}/${urls.length}] ${url}`);

    // Check if already exists
    const existing = registry.videos.find(v => v.youtubeUrl === url || (vid && v.youtubeUrl?.includes(vid)));
    if (existing) {
      console.log(`  Skipped — already in registry as "${existing.id}"\n`);
      skipped++;
      continue;
    }

    // Fetch metadata
    let metadata;
    try {
      metadata = fetchMetadata(url);
    } catch (e) {
      console.error(`  Failed to fetch metadata: ${e.message}\n`);
      continue;
    }

    const id = `${showId}-${slugify(metadata.title)}`;
    const dur = `${Math.floor(metadata.duration / 60)}m${metadata.duration % 60}s`;
    console.log(`  Title: ${metadata.title} (${dur})`);
    console.log(`  Channel: ${metadata.channel || metadata.uploader || '?'}`);
    console.log(`  ID: ${id}`);

    // Screen
    let screening = { verdict: 'approved', reason: 'Screening skipped', concerns: [] };
    if (!skipScreen) {
      try {
        console.log(`  Screening with Claude...`);
        screening = await screenWithClaude(metadata);
        console.log(`  Verdict: ${screening.verdict} — ${screening.reason}`);
      } catch (e) {
        console.log(`  Screening failed: ${e.message} — marking as pending`);
        screening = { verdict: 'pending', reason: `Screening error: ${e.message}`, concerns: [] };
      }
    }

    if (screening.verdict === 'rejected') {
      console.log(`  REJECTED — not adding.\n`);
      rejected++;
      continue;
    }

    // Download
    if (!skipDownload) {
      try {
        downloadVideo(url, id);
      } catch (e) {
        console.error(`  Download failed: ${e.message}`);
      }
    }

    // Add to registry
    const palette = PALETTES[(registry.videos.length + added) % PALETTES.length];
    registry.videos.push({
      id,
      title: metadata.title,
      youtubeUrl: url,
      show: showId,
      bg: palette.bg,
      color: palette.color,
      status: screening.verdict === 'approved' ? 'approved' : 'pending',
      addedAt: new Date().toISOString(),
      screening: {
        verdict: screening.verdict,
        reason: screening.reason,
        concerns: screening.concerns || [],
        screenedAt: new Date().toISOString(),
      },
    });

    saveRegistry(registry);
    added++;
    console.log(`  Added to registry.\n`);
  }

  console.log(`\nDone! Added: ${added} | Skipped: ${skipped} | Rejected: ${rejected}`);
  console.log(`Total videos in registry: ${registry.videos.length}`);

  if (added > 0) {
    console.log(`\nRun "node scripts/manage-videos.mjs sync" to update the app.`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
