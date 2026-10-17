import { getAudioContext } from '../../hooks/useSound';

// Synthesised creature voices for Draw Alive. Every sound is short, cute and
// built from Web Audio primitives only — no audio files.

const MAX_GAIN = 0.3;
let noiseBuffer = null;

/**
 * Schedule an AudioParam over [t0, t0 + dur].
 * `value` is a number (constant) or an array of [fraction, value] points.
 */
function automate(param, value, t0, dur) {
  if (!Array.isArray(value)) {
    param.setValueAtTime(value, t0);
    return;
  }
  value.forEach(([frac, v], i) => {
    const t = t0 + frac * dur;
    if (i === 0) param.setValueAtTime(v, t);
    else param.exponentialRampToValueAtTime(Math.max(v, 0.0001), t);
  });
}

/** Attack/decay gain envelope, clamped to MAX_GAIN */
function envelope(ctx, t0, dur, peak, attack) {
  const g = ctx.createGain();
  const p = Math.min(peak, MAX_GAIN);
  const a = Math.min(attack, dur * 0.5);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(p, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  return g;
}

/** Optional biquad filter; returns the node to connect into (or null) */
function makeFilter(ctx, filter, t0, dur) {
  if (!filter) return null;
  const f = ctx.createBiquadFilter();
  f.type = filter.type || 'lowpass';
  f.Q.value = filter.Q ?? 1;
  automate(f.frequency, filter.freq, t0, dur);
  return f;
}

/**
 * One oscillator voice.
 * freq: number or [[fraction, hz], ...]; vibrato: { rate, depth }.
 */
function tone(ctx, {
  type = 'sine', freq = 440, at = 0, dur = 0.2, gain = 0.2, attack = 0.01,
  filter, vibrato,
}) {
  const t0 = ctx.currentTime + 0.01 + at;
  const osc = ctx.createOscillator();
  osc.type = type;
  automate(osc.frequency, freq, t0, dur);

  let lfo = null;
  if (vibrato) {
    lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = vibrato.rate;
    depth.gain.value = vibrato.depth;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + dur + 0.05);
  }

  const env = envelope(ctx, t0, dur, gain, attack);
  const f = makeFilter(ctx, filter, t0, dur);
  if (f) osc.connect(f).connect(env);
  else osc.connect(env);
  env.connect(ctx.destination);

  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Filtered white-noise burst (breath, whoosh, growl texture) */
function noiseBurst(ctx, {
  at = 0, dur = 0.3, gain = 0.1, attack = 0.02, filter = { type: 'bandpass', freq: 1000, Q: 1 },
}) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const len = Math.floor(ctx.sampleRate * 1.0);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  const t0 = ctx.currentTime + 0.01 + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const env = envelope(ctx, t0, dur, gain, attack);
  const f = makeFilter(ctx, filter, t0, dur);
  src.connect(f).connect(env).connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/** Friendly, short, mid-pitched "rawr" — playful, never scary */
function rawr(ctx, base, dur = 0.42) {
  tone(ctx, {
    type: 'sawtooth', dur, gain: 0.17, attack: 0.04,
    freq: [[0, base * 0.85], [0.35, base * 1.3], [1, base * 0.75]],
    filter: { type: 'lowpass', Q: 3, freq: [[0, 700], [0.35, 1800], [1, 600]] },
    vibrato: { rate: 26, depth: base * 0.05 },
  });
  noiseBurst(ctx, {
    dur: dur * 0.9, gain: 0.07, attack: 0.04,
    filter: { type: 'bandpass', Q: 2, freq: [[0, 900], [0.35, 1500], [1, 700]] },
  });
}

const SOUNDS = {
  cow(ctx) {
    tone(ctx, {
      type: 'sawtooth', dur: 0.95, gain: 0.2, attack: 0.15,
      freq: [[0, 140], [0.3, 132], [1, 104]],
      filter: { type: 'lowpass', Q: 2, freq: [[0, 300], [0.3, 900], [1, 380]] },
      vibrato: { rate: 5, depth: 3 },
    });
  },

  pig(ctx) {
    [0, 0.22].forEach((at) => {
      tone(ctx, {
        type: 'square', at, dur: 0.15, gain: 0.14, attack: 0.01,
        freq: [[0, 440], [1, 210]],
        filter: { type: 'bandpass', freq: 900, Q: 4 },
      });
    });
  },

  hen(ctx) {
    [[0, 620], [0.13, 600]].forEach(([at, f]) => {
      tone(ctx, {
        type: 'triangle', at, dur: 0.08, gain: 0.2,
        freq: [[0, f], [1, f * 0.75]],
      });
    });
    tone(ctx, {
      type: 'square', at: 0.28, dur: 0.32, gain: 0.12, attack: 0.02,
      freq: [[0, 700], [0.3, 980], [1, 640]],
      filter: { type: 'bandpass', freq: 1300, Q: 2 },
    });
  },

  lion(ctx) { rawr(ctx, 220, 0.45); },
  dino(ctx) { rawr(ctx, 175, 0.5); },
  stego(ctx) { rawr(ctx, 270, 0.35); },

  ptero(ctx) {
    [0, 0.2].forEach((at) => {
      tone(ctx, {
        type: 'square', at, dur: 0.15, gain: 0.08,
        freq: [[0, 1400], [0.3, 1900], [1, 1500]],
        filter: { type: 'lowpass', freq: 3200, Q: 1 },
      });
    });
  },

  parrot(ctx) {
    tone(ctx, { at: 0, dur: 0.25, gain: 0.2, attack: 0.02, freq: [[0, 900], [1, 1800]] });
    tone(ctx, { at: 0.3, dur: 0.32, gain: 0.2, attack: 0.02, freq: [[0, 1700], [1, 880]] });
  },

  fish(ctx) {
    [[0, 800], [0.12, 650], [0.26, 750]].forEach(([at, f]) => {
      tone(ctx, { at, dur: 0.09, gain: 0.25, freq: [[0, f], [1, f * 0.35]] });
    });
  },

  jellyfish(ctx) {
    tone(ctx, {
      dur: 0.6, gain: 0.22, attack: 0.05,
      freq: [[0, 300], [0.5, 560], [1, 340]],
      vibrato: { rate: 8, depth: 25 },
    });
  },

  turtle(ctx) {
    [[0, 0.35, 196], [0.38, 0.5, 175]].forEach(([at, dur, f]) => {
      tone(ctx, {
        type: 'triangle', at, dur, gain: 0.2, attack: 0.08,
        freq: f,
        filter: { type: 'lowpass', freq: 600, Q: 1 },
        vibrato: { rate: 4, depth: 2 },
      });
    });
  },

  rocket(ctx) {
    noiseBurst(ctx, {
      dur: 0.5, gain: 0.16, attack: 0.12,
      filter: { type: 'bandpass', Q: 1.5, freq: [[0, 300], [1, 3000]] },
    });
    tone(ctx, { type: 'square', at: 0.5, dur: 0.1, gain: 0.08, freq: 880 });
    tone(ctx, { type: 'square', at: 0.64, dur: 0.12, gain: 0.08, freq: 660 });
  },

  ufo(ctx) {
    tone(ctx, {
      dur: 0.9, gain: 0.18, attack: 0.06,
      freq: [[0, 500], [1, 700]],
      vibrato: { rate: 6, depth: 120 },
    });
  },

  alien(ctx) {
    const notes = [523, 659, 784, 880, 1047, 1175];
    [0, 0.11, 0.22].forEach((at) => {
      const f = notes[Math.floor(Math.random() * notes.length)];
      tone(ctx, {
        type: 'square', at, dur: 0.09, gain: 0.09,
        freq: [[0, f], [1, f * (Math.random() < 0.5 ? 0.8 : 1.25)]],
        filter: { type: 'lowpass', freq: 2500, Q: 1 },
      });
    });
  },

  butterfly(ctx) {
    [1319, 1568, 1976, 2637].forEach((f, i) => {
      tone(ctx, { at: i * 0.06, dur: 0.25, gain: 0.07, freq: f });
    });
  },

  balloon(ctx) {
    tone(ctx, {
      dur: 0.45, gain: 0.18, attack: 0.03,
      freq: [[0, 600], [1, 1300]],
      vibrato: { rate: 18, depth: 40 },
    });
    tone(ctx, {
      type: 'triangle', dur: 0.45, gain: 0.06, attack: 0.03,
      freq: [[0, 606], [1, 1313]],
    });
  },

  teddy(ctx) {
    [0, 0.22].forEach((at) => {
      tone(ctx, {
        at, dur: 0.14, gain: 0.18, attack: 0.01,
        freq: [[0, 1200], [0.4, 1700], [1, 1400]],
        vibrato: { rate: 30, depth: 30 },
      });
    });
  },

  icecream(ctx) {
    [[0, 0.35, 330, 392], [0.4, 0.4, 392, 523]].forEach(([at, dur, a, b]) => {
      tone(ctx, {
        at, dur, gain: 0.18, attack: 0.06,
        freq: [[0, a], [1, b]],
        filter: { type: 'lowpass', freq: 1200, Q: 1 },
      });
      tone(ctx, { type: 'triangle', at, dur, gain: 0.06, attack: 0.06, freq: [[0, a * 2], [1, b * 2]] });
    });
  },
};

/** Fallback voices for free drawings, chosen by how the creature moves */
const MOTION_SOUNDS = {
  swim: SOUNDS.fish,
  float: SOUNDS.jellyfish,
  rocket: SOUNDS.rocket,
  hover(ctx) {
    tone(ctx, {
      dur: 0.6, gain: 0.18, attack: 0.05,
      freq: [[0, 520], [1, 640]],
      vibrato: { rate: 7, depth: 90 },
    });
  },
  flutter: SOUNDS.butterfly,
  fly(ctx) {
    [0, 0.1, 0.2].forEach((at) => {
      tone(ctx, { at, dur: 0.07, gain: 0.16, freq: [[0, 2000], [1, 2800]] });
    });
  },
  walk(ctx) {
    [[0, 180, 520, 360], [0.28, 240, 680, 480]].forEach(([at, a, b, c]) => {
      tone(ctx, {
        at, dur: 0.25, gain: 0.2, attack: 0.01,
        freq: [[0, a], [0.3, b], [1, c]],
        vibrato: { rate: 14, depth: 30 },
      });
    });
  },
};

/**
 * Play a creature's own synthesised voice.
 * @param {string} [kind] - template creature id (e.g. 'cow', 'rocket'); undefined for free drawings
 * @param {string} [motion] - movement style used as a fallback ('swim', 'float', 'fly', 'rocket', 'hover', 'flutter', 'walk')
 */
export function playCreatureSound(kind, motion) {
  try {
    if (typeof window !== 'undefined' && window.__arthurMuted) return;
    const play = SOUNDS[kind] || MOTION_SOUNDS[motion] || MOTION_SOUNDS.walk;
    const ctx = getAudioContext();
    play(ctx);
  } catch {
    // Audio must never break the game
  }
}
