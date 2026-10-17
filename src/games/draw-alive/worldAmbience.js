/**
 * Draw Alive — quiet background soundscapes for each world, plus night
 * crickets and rain. Everything is synthesised and very soft (gain ≤ 0.06).
 */
import { getAudioContext } from '../../hooks/useSound';

const muted = () => !!window.__arthurMuted;

let noise = null;
function noiseBuffer(ctx) {
  if (noise && noise.sampleRate === ctx.sampleRate) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

/** A looping filtered noise bed (waves, wind, rain). Returns its gain node. */
function noiseBed(ctx, out, { type = 'lowpass', freq = 500, gain = 0.03, swell = 0 }) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(out);
  src.start();
  let lfo = null;
  if (swell) {
    // Slow swell, like waves rolling in
    lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = swell;
    depth.gain.value = gain * 0.8;
    lfo.connect(depth).connect(g.gain);
    lfo.start();
  }
  return () => { src.stop(); lfo?.stop(); };
}

/** A short pitched blip into `out`. */
function blip(ctx, out, freq, { type = 'sine', len = 0.1, vol = 0.03, slide = 1 } = {}) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * slide, t + len);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + len + 0.02);
}

/** Call `fn` at random intervals between min and max ms. */
function every(min, max, fn) {
  let timer;
  const tick = () => {
    if (!muted()) fn();
    timer = setTimeout(tick, min + Math.random() * (max - min));
  };
  timer = setTimeout(tick, min * Math.random());
  return () => clearTimeout(timer);
}

const chirp = (ctx, out) => () => {
  const f = 2200 + Math.random() * 1600;
  [0, 90, 180].slice(0, 1 + Math.floor(Math.random() * 3))
    .forEach(d => setTimeout(() => blip(ctx, out, f, { len: 0.07, vol: 0.025, slide: 1.25 }), d));
};

// "Twinkle Twinkle", softly, as a music box for the fair
const MUSIC_BOX = [523, 523, 784, 784, 880, 880, 784, 0, 698, 698, 659, 659, 587, 587, 523, 0];

const DAY = {
  sea: (ctx, out) => [
    noiseBed(ctx, out, { freq: 380, gain: 0.035, swell: 0.12 }),
    every(1200, 3500, () => blip(ctx, out, 500 + Math.random() * 400, { len: 0.12, vol: 0.03, slide: 2.2 })),
  ],
  jungle: (ctx, out) => [
    noiseBed(ctx, out, { freq: 900, gain: 0.012 }),
    every(700, 2200, chirp(ctx, out)),
    every(3000, 7000, () => blip(ctx, out, 900, { type: 'triangle', len: 0.35, vol: 0.02, slide: 0.6 })),
  ],
  farm: (ctx, out) => [
    noiseBed(ctx, out, { freq: 300, gain: 0.015, swell: 0.08 }),
    every(1500, 4000, chirp(ctx, out)),
  ],
  space: (ctx, out) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 110;
    osc2.frequency.value = 165.5;
    g.gain.value = 0.018;
    osc.connect(g);
    osc2.connect(g);
    g.connect(out);
    osc.start();
    osc2.start();
    return [
      () => { osc.stop(); osc2.stop(); },
      every(900, 2600, () => blip(ctx, out, 1400 + Math.random() * 1400, { len: 0.25, vol: 0.02 })),
    ];
  },
  dinosaurs: (ctx, out) => [
    noiseBed(ctx, out, { type: 'bandpass', freq: 420, gain: 0.03, swell: 0.07 }),
    every(2500, 6000, chirp(ctx, out)),
  ],
  fair: (ctx, out) => {
    let i = 0;
    return [every(420, 420, () => {
      const f = MUSIC_BOX[i++ % MUSIC_BOX.length];
      if (f) blip(ctx, out, f * 2, { type: 'triangle', len: 0.5, vol: 0.022 });
    })];
  },
};

const NIGHT = (ctx, out) => [
  // Crickets: quick high double-chirps
  every(500, 1300, () => {
    [0, 70].forEach(d => setTimeout(() => blip(ctx, out, 4200, { type: 'square', len: 0.04, vol: 0.006 }), d));
  }),
];

const RAIN = (ctx, out) => [noiseBed(ctx, out, { type: 'highpass', freq: 1800, gain: 0.04 })];

/**
 * Start the soundscape for a world. Returns a function that fades it out.
 * @param {string} worldId
 * @param {{ night?: boolean, weather?: string }} mood
 */
export function startAmbience(worldId, { night = false, weather = 'clear' } = {}) {
  if (muted()) return () => {};
  try {
    const ctx = getAudioContext();
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.2);
    out.connect(ctx.destination);

    const stops = [];
    // At night the fair's music box rests, and the sea and space keep their hush
    if (!night || worldId === 'sea' || worldId === 'space') stops.push(...(DAY[worldId]?.(ctx, out) || []));
    if (night && worldId !== 'sea' && worldId !== 'space') stops.push(...NIGHT(ctx, out));
    if (weather === 'rain') stops.push(...RAIN(ctx, out));

    return () => {
      try {
        out.gain.cancelScheduledValues(ctx.currentTime);
        out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
        out.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        setTimeout(() => { stops.forEach(s => s()); out.disconnect(); }, 700);
      } catch { /* already gone */ }
    };
  } catch {
    return () => {};
  }
}
