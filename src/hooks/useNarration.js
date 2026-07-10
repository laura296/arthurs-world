/**
 * Shared narration helper with smart voice selection.
 * Picks the best available TTS voice for children's story reading.
 *
 * Browser TTS is the FALLBACK narration path — stories with recorded
 * MP3s (story.audioDir) always play those instead. TTS quality varies
 * hugely per device, so voices are scored rather than taken in list
 * order: iOS Safari returns voices alphabetically, which puts Apple's
 * novelty voices ("Albert", "Bad News", "Bells"…) first among English
 * entries — a naive english[0] fallback reads bedtime stories in a
 * joke voice.
 */

// Apple novelty/effect voices — never acceptable for story reading.
const NOVELTY_VOICES = [
  'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
  'deranged', 'good news', 'jester', 'organ', 'superstar', 'trinoids',
  'whisper', 'wobble', 'zarvox', 'junior', 'ralph', 'fred', 'kathy',
  'grandma', 'grandpa', 'rocko', 'shelley', 'sandy', 'eddy', 'flo', 'reed',
];

// Known-good storytelling voices (warm, clear), best first.
const PREFERRED_VOICES = [
  'Google UK English Female',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Libby Online (Natural) - English (United Kingdom)',
  'Microsoft Maisie Online (Natural) - English (United Kingdom)',
  'Microsoft Hazel Online (Natural)',
  'Microsoft Hazel',
  'Serena',                  // iOS/macOS en-GB
  'Kate',                    // iOS/macOS en-GB
  'Martha',                  // iOS en-GB
  'Stephanie',               // iOS en-GB
  'Samantha',                // macOS/iOS en-US
  'Karen',                   // macOS/iOS Australian
  'Moira',                   // macOS/iOS Irish
  'Google US English',
  'Microsoft Zira',
  'Fiona',                   // macOS Scottish
];

function scoreVoice(v) {
  const name = v.name.toLowerCase();
  const lang = (v.lang || '').toLowerCase().replace('_', '-');

  if (!lang.startsWith('en')) return -1;
  if (NOVELTY_VOICES.some(n => name === n || name.startsWith(n + ' '))) return -1;

  let score = 0;

  // Exact match on the curated list dominates everything else.
  const rank = PREFERRED_VOICES.findIndex(p => v.name === p || v.name.startsWith(p));
  if (rank !== -1) score += 1000 - rank * 10;

  // Higher-quality variants of any voice.
  if (name.includes('enhanced') || name.includes('premium')) score += 500;
  if (name.includes('natural') || name.includes('neural')) score += 400;
  if (name.includes('siri')) score += 300;

  // Compact/legacy engines sound the most robotic.
  if (name.includes('compact') || name.includes('eloquence')) score -= 400;

  // UK family — prefer a British accent, then any English.
  if (lang.startsWith('en-gb')) score += 60;
  else if (lang.startsWith('en-au') || lang.startsWith('en-ie')) score += 30;

  return score;
}

let cachedVoice = null;

function pickVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  let best = null;
  let bestScore = 0;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) { best = v; bestScore = s; }
  }
  // Only cache once voices have actually loaded (iOS loads them async).
  if (best) cachedVoice = best;
  return best;
}

// Pre-warm voice list (Chrome/iOS load them async)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

// Keep a reference to the active utterance — some browsers garbage-collect
// it mid-speech and the audio just stops.
let activeUtterance = null;

// Narration deliberately ignores the global SFX mute: Quiet mode hides
// noisy sections but keeps storybooks, and a pre-literate child needs
// books read aloud. Recorded MP3 narration behaves the same way.
export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang; // mismatched lang forces some engines to re-pick a default voice
  } else {
    u.lang = 'en-GB';
  }
  u.rate = 0.88;
  u.pitch = 1.05;
  u.onend = () => { if (activeUtterance === u) activeUtterance = null; };
  activeUtterance = u;

  // iOS Safari can swallow an utterance queued in the same tick as cancel(),
  // and gets stuck in a paused state after interruptions — resume + defer.
  setTimeout(() => {
    if (activeUtterance !== u) return;
    if (synth.paused) synth.resume();
    synth.speak(u);
  }, 60);
}

export function stopSpeaking() {
  activeUtterance = null;
  window.speechSynthesis?.cancel();
}

// ── Shared narration <audio> element, unlocked on first user gesture ──
// iOS Safari only allows audio started from a user-gesture call stack.
// Story pages auto-narrate from effects/timers (page turn → 400ms delay
// → play()), which breaks that chain, so recorded narration opened
// SILENT on iPad. The fix: play a silent clip through one reusable
// element during the child's first tap — iOS then treats that element
// as user-approved, and later programmatic .src swaps + .play() work.

const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

let narrationEl = null;
let audioUnlocked = false;

function ensureElement() {
  if (!narrationEl && typeof window !== 'undefined' && window.Audio) {
    narrationEl = new window.Audio();
    narrationEl.preload = 'auto';
  }
  return narrationEl;
}

if (typeof window !== 'undefined') {
  const unlock = () => {
    if (audioUnlocked) return;
    const el = ensureElement();
    if (!el) return;
    el.src = SILENT_WAV;
    el.play().then(() => {
      el.pause();
      audioUnlocked = true;
      window.removeEventListener('pointerdown', unlock, true);
    }).catch(() => { /* not a real gesture yet — retry on next tap */ });
    // speechSynthesis needs its own gesture-scoped kick on iOS
    if ('speechSynthesis' in window && !window.speechSynthesis.speaking) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  };
  window.addEventListener('pointerdown', unlock, true);
}

/**
 * Play a recorded narration clip through the shared unlocked element,
 * falling back to TTS if the clip is missing or fails to play.
 */
export function playNarrationClip(src, fallbackText) {
  stopSpeaking();
  const el = ensureElement();
  if (!el || !src) {
    if (fallbackText) speakText(fallbackText);
    return;
  }
  el.pause();
  el.src = src;
  el.currentTime = 0;
  el.play().catch(() => {
    if (fallbackText) speakText(fallbackText);
  });
}

export function stopNarrationClip() {
  if (narrationEl && !narrationEl.paused) narrationEl.pause();
}
