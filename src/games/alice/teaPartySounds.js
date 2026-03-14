/**
 * Mad Hatter's Tea Party — custom Web Audio sounds.
 * Follows the same pattern as src/hooks/useSound.js (no audio files).
 */

const audioCtxRef = { current: null };
let globalMuted = false;

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = audioCtxRef.current;
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Sync with global mute state */
function isMuted() {
  return globalMuted || window.__arthurMuted;
}

export function setTeaPartyMute(muted) {
  globalMuted = muted;
}

// ── Ceramic clink — porcelain placement sound ────────────────────────

/**
 * Short bright resonant clink. Pitch multiplier controls "material":
 *   cups=1.2, saucers=1.0, cakes=0.7, spoons=1.5
 */
export function playCeramicClink(pitchMul = 1.0) {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  const baseFreq = 2200 * pitchMul;

  // Resonant sine — the "ring"
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = baseFreq;
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.18);

  // Noise transient — the "click"
  const bufLen = ctx.sampleRate * 0.03;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = baseFreq * 1.5;
  bp.Q.value = 3;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.12, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  noise.connect(bp).connect(ng).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.05);
}

// ── Ceramic slide — dragging sound ───────────────────────────────────

export function playCeramicSlide() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  const bufLen = ctx.sampleRate * 0.15;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  filter.Q.value = 1.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.04, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.15);
}

// ── Tea pouring — warm filtered noise with rising pitch ──────────────

export function playTeaPour(cupIndex = 0, totalCups = 5) {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  const duration = 0.6;

  // Liquid noise
  const bufLen = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    const env = Math.sin((i / bufLen) * Math.PI); // swell shape
    data[i] = (Math.random() * 2 - 1) * env * 0.4;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(400, t);
  lp.frequency.linearRampToValueAtTime(1200, t + duration);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.linearRampToValueAtTime(0.12, t + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  noise.connect(lp).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + duration + 0.05);

  // Pentatonic note — C5 D5 E5 G5 A5 mapped to cup index
  const pentatonic = [523, 587, 659, 784, 880];
  const freq = pentatonic[cupIndex % pentatonic.length];
  const noteDelay = duration * 0.7;
  const osc = ctx.createOscillator();
  const og = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  og.gain.setValueAtTime(0, t + noteDelay);
  og.gain.linearRampToValueAtTime(0.2, t + noteDelay + 0.05);
  og.gain.exponentialRampToValueAtTime(0.001, t + noteDelay + 0.4);
  osc.connect(og).connect(ctx.destination);
  osc.start(t + noteDelay);
  osc.stop(t + noteDelay + 0.45);
}

// ── Pattern completion chord — major triad sustained ─────────────────

export function playPatternChord() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  // C major triad: C5 E5 G5
  [523, 659, 784].forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.55);

    // Shimmer layer
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2.003;
    g2.gain.setValueAtTime(0.04, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    osc2.connect(g2).connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 1.25);
  });
}

// ── Hatter celebration — staccato burst + upward glissando ───────────

export function playHatterCelebrate() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Staccato burst — scattered piano-like keys
  const notes = [523, 659, 784, 880, 1047, 1175];
  notes.forEach((freq, i) => {
    const delay = i * 0.06 + Math.random() * 0.03;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + delay);
    osc.stop(t + delay + 0.12);
  });

  // Upward glissando (hat jump)
  const glissStart = 0.4;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t + glissStart);
  osc.frequency.exponentialRampToValueAtTime(1600, t + glissStart + 0.3);
  gain.gain.setValueAtTime(0.12, t + glissStart);
  gain.gain.exponentialRampToValueAtTime(0.001, t + glissStart + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t + glissStart);
  osc.stop(t + glissStart + 0.4);
}

// ── Music box note — celeste/glockenspiel tone for ambient ───────────

export function playMusicBoxNote(freq = 880) {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Fundamental — bright sine
  const osc1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = freq;
  g1.gain.setValueAtTime(0, t);
  g1.gain.linearRampToValueAtTime(0.1, t + 0.002);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  osc1.connect(g1).connect(ctx.destination);
  osc1.start(t);
  osc1.stop(t + 0.85);

  // Overtone — metallic shimmer at 3×
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 3;
  g2.gain.setValueAtTime(0, t);
  g2.gain.linearRampToValueAtTime(0.03, t + 0.001);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc2.connect(g2).connect(ctx.destination);
  osc2.start(t);
  osc2.stop(t + 0.45);
}

// ── Ambient music box loop ───────────────────────────────────────────

let ambientInterval = null;

/**
 * Start a gentle music-box ambient loop.
 * Major pentatonic with occasional chromatic quirk, ~85 BPM.
 */
export function startAmbient() {
  stopAmbient();
  // C major pentatonic: C5 D5 E5 G5 A5, plus chromatic quirks
  const scale = [523, 587, 659, 784, 880, 1047];
  const quirks = [554, 740, 831]; // C#5, F#5, G#5 — "mad" notes
  let beatIdx = 0;
  const bpm = 85;
  const interval = (60 / bpm) * 1000;

  ambientInterval = setInterval(() => {
    if (isMuted()) return;
    // Every 8th beat, play a chromatic quirk
    const isQuirk = beatIdx % 8 === 7;
    const pool = isQuirk ? quirks : scale;
    const freq = pool[Math.floor(Math.random() * pool.length)];
    playMusicBoxNote(freq);
    beatIdx++;
  }, interval);
}

export function stopAmbient() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
}
