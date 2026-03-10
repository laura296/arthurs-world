/**
 * Web Audio animal sound synthesiser.
 *
 * Each function creates a short, recognisable animal vocalisation
 * using oscillators and filtered noise — no audio files needed.
 *
 * Usage:
 *   import { playAnimalSound } from './useAnimalSounds';
 *   playAnimalSound('rooster');
 */

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Rooster ───────────────────────────────────────────────────────
// Classic "er-er-er-ERRR!" — four ascending sawtooth sweeps
function rooster() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.25;
  master.connect(c.destination);

  const notes = [
    { start: 800, end: 1200, dur: 0.12, gap: 0.06 },
    { start: 900, end: 1400, dur: 0.12, gap: 0.06 },
    { start: 1000, end: 1600, dur: 0.15, gap: 0.06 },
    { start: 1100, end: 1800, dur: 0.45, gap: 0 },
  ];

  let t = c.currentTime + 0.01;
  notes.forEach(n => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(n.start, t);
    osc.frequency.linearRampToValueAtTime(n.end, t + n.dur * 0.7);
    osc.frequency.linearRampToValueAtTime(n.end * 0.85, t + n.dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.02);
    g.gain.setValueAtTime(0.3, t + n.dur * 0.8);
    g.gain.linearRampToValueAtTime(0, t + n.dur);

    // Add a formant filter for throat quality
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 1200;
    filt.Q.value = 2;

    osc.connect(filt).connect(g).connect(master);
    osc.start(t);
    osc.stop(t + n.dur + 0.01);
    t += n.dur + n.gap;
  });
}

// ── Hen ───────────────────────────────────────────────────────────
// Quick staccato "bawk bawk" — short filtered noise bursts
function hen() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.2;
  master.connect(c.destination);

  const clucks = [0, 0.18, 0.36];
  clucks.forEach(offset => {
    const t = c.currentTime + offset;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(350, t + 0.08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.01);
    g.gain.linearRampToValueAtTime(0, t + 0.1);

    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 500;
    filt.Q.value = 3;

    osc.connect(filt).connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.12);
  });
}

// ── Pig ───────────────────────────────────────────────────────────
// "Oink oink" — low sine with FM modulation for nasal quality
function pig() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.25;
  master.connect(c.destination);

  const oinks = [0, 0.35];
  oinks.forEach(offset => {
    const t = c.currentTime + offset;

    // Modulator for nasal wobble
    const mod = c.createOscillator();
    const modGain = c.createGain();
    mod.type = 'sine';
    mod.frequency.value = 25;
    modGain.gain.value = 80;
    mod.connect(modGain);

    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(250, t + 0.08);
    osc.frequency.linearRampToValueAtTime(140, t + 0.25);
    modGain.connect(osc.frequency);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.03);
    g.gain.setValueAtTime(0.3, t + 0.15);
    g.gain.linearRampToValueAtTime(0, t + 0.28);

    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.3);
    mod.start(t);
    mod.stop(t + 0.3);
  });
}

// ── Horse ─────────────────────────────────────────────────────────
// "Neigh!" — rising then falling whinny with vibrato
function horse() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.22;
  master.connect(c.destination);
  const t = c.currentTime;

  // Vibrato LFO
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 8;
  lfoGain.gain.value = 40;
  lfo.connect(lfoGain);

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.linearRampToValueAtTime(900, t + 0.25);
  osc.frequency.linearRampToValueAtTime(600, t + 0.5);
  osc.frequency.linearRampToValueAtTime(350, t + 0.8);
  lfoGain.connect(osc.frequency);

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.05);
  g.gain.setValueAtTime(0.25, t + 0.5);
  g.gain.linearRampToValueAtTime(0, t + 0.85);

  const filt = c.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = 700;
  filt.Q.value = 1.5;

  osc.connect(filt).connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.9);
  lfo.start(t);
  lfo.stop(t + 0.9);
}

// ── Cow ───────────────────────────────────────────────────────────
// "Moo" — sustained low tone with gentle vibrato
function cow() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.2;
  master.connect(c.destination);
  const t = c.currentTime;

  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 4;
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.linearRampToValueAtTime(150, t + 0.3);
  osc.frequency.setValueAtTime(140, t + 0.8);
  osc.frequency.linearRampToValueAtTime(110, t + 1.2);
  lfoGain.connect(osc.frequency);

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.08);
  g.gain.setValueAtTime(0.25, t + 0.8);
  g.gain.linearRampToValueAtTime(0, t + 1.2);

  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 1.3);
  lfo.start(t);
  lfo.stop(t + 1.3);
}

// ── Sheep ─────────────────────────────────────────────────────────
// "Baa" — medium pitch with heavy vibrato and nasal quality
function sheep() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.2;
  master.connect(c.destination);
  const t = c.currentTime;

  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 6;
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain);

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.linearRampToValueAtTime(350, t + 0.15);
  osc.frequency.setValueAtTime(320, t + 0.5);
  osc.frequency.linearRampToValueAtTime(250, t + 0.75);
  lfoGain.connect(osc.frequency);

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.04);
  g.gain.setValueAtTime(0.25, t + 0.5);
  g.gain.linearRampToValueAtTime(0, t + 0.8);

  const filt = c.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = 400;
  filt.Q.value = 2;

  osc.connect(filt).connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.85);
  lfo.start(t);
  lfo.stop(t + 0.85);
}

// ── Splash ────────────────────────────────────────────────────────
// Water splash — noise burst with lowpass sweep
function splash() {
  const c = getCtx();
  const master = c.createGain();
  master.gain.value = 0.2;
  master.connect(c.destination);
  const t = c.currentTime;

  const buf = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = buf;
  const filt = c.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.setValueAtTime(3000, t);
  filt.frequency.exponentialRampToValueAtTime(200, t + 0.35);

  const g = c.createGain();
  g.gain.setValueAtTime(0.4, t);
  g.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

  src.connect(filt).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.4);
}

// ── Registry ──────────────────────────────────────────────────────

const SOUNDS = {
  rooster,
  hen,
  pig,
  horse,
  cow,
  sheep,
  splash,
};

/**
 * Play a named animal sound.
 * @param {string} name — one of: rooster, hen, pig, horse, cow, sheep, splash
 * @returns {boolean} true if sound was found and played
 */
export function playAnimalSound(name) {
  const fn = SOUNDS[name];
  if (fn) {
    try { fn(); } catch { /* audio context not available */ }
    return true;
  }
  return false;
}

export default SOUNDS;
