import { useCallback, useRef } from 'react';

const audioCtxRef = { current: null };

/** Global mute flag — set by MuteByMode wrapper in App.jsx */
let globalMuted = false;
export function setGlobalMute(muted) { globalMuted = muted; window.__arthurMuted = muted; }

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = audioCtxRef.current;
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Play a quick synthesised tone */
export function playTone(freq = 440, duration = 0.15, type = 'sine') {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/** Happy ascending chime */
export function playSuccess() {
  [523, 659, 784].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, 'sine'), i * 100);
  });
}

/** Pop sound */
export function playPop() {
  playTone(800, 0.08, 'sine');
}

/** Boing / bounce */
export function playBoing() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Gentle tap sound */
export function playTap() {
  playTone(600, 0.06, 'triangle');
}

/** Sparkle / magic chime — ascending arpeggiated notes */
export function playSparkle() {
  [880, 1100, 1320, 1760].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.12, 'sine'), i * 60);
  });
}

/** Whoosh — for spin, fly, hide animations */
export function playWhoosh() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/** Poof — soft disappear sound */
export function playPoof() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Snap — satisfying drop-into-place sound */
export function playSnap() {
  playTone(1200, 0.05, 'square');
  setTimeout(() => playTone(800, 0.08, 'sine'), 50);
}

/** Paper flap opening — soft thwp */
export function playFlap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.1);
}

/** Page turn — paper rustling */
export function playPageTurn() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.35);
}

/** Collect ping — satisfying ascending note */
export function playCollectPing() {
  playTone(1200, 0.1, 'sine');
  setTimeout(() => playTone(1600, 0.08, 'sine'), 50);
}

/** Splash — water interaction */
export function playSplash() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.25);
}

/** Musical note (for music pad) — basic tone, used as fallback */
export function playNote(freq, duration = 0.5) {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// ── Instrument-specific play functions for MusicPad ──

/** Piano — sine wave, gentle attack, 0.4s sustain */
export function playPiano(freq) {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  // Slight attack then decay
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}

/** Harp — triangle wave with shimmer detune, long sustain */
export function playHarp(freq) {
  if (globalMuted) return;
  const ctx = getCtx();
  // Two slightly detuned oscillators for shimmer
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = 'triangle';
  osc2.type = 'triangle';
  osc1.frequency.value = freq;
  osc2.frequency.value = freq * 1.003; // slight detune for chorus
  // Pluck envelope — instant attack, long decay
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc2.start();
  osc1.stop(ctx.currentTime + 1.3);
  osc2.stop(ctx.currentTime + 1.3);
}

/** Drums — noise burst through bandpass filter */
export function playDrum(freq) {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = freq * 1.5; // use note freq to vary drum pitch
  bandpass.Q.value = 1.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  noise.connect(bandpass).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.2);
}

/** Xylophone — square wave, bright & short with harmonics */
export function playXylophone(freq) {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  // Sharp attack, quick decay — bright and clicky
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// ── Build-a-Scene sounds ──

/** Thud — soft felt-on-felt placement sound */
export function playThud() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

/** Chomp — funny shark gulp sound */
export function playChomp() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Buzz — descending wrong answer sound */
export function playBuzz() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

/** Drumroll — anticipation build for animate mode (1.5s) */
export function playDrumroll() {
  if (globalMuted) return;
  const ctx = getCtx();
  for (let i = 0; i < 20; i++) {
    const t = ctx.currentTime + (i * 0.075);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 200 + (i * 15);
    gain.gain.setValueAtTime(0.05 + (i * 0.015), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  }
}

/** Sticker-specific sounds for Build-a-Scene animate mode */
export function playStickerSound(soundId) {
  if (globalMuted) return;
  const sounds = {
    moo:     () => { playTone(150, 0.4, 'sawtooth'); setTimeout(() => playTone(130, 0.5, 'sawtooth'), 400); },
    oink:    () => { playTone(400, 0.1, 'square'); setTimeout(() => playTone(350, 0.15, 'square'), 120); },
    baa:     () => { playTone(300, 0.3, 'sawtooth'); },
    cluck:   () => { [500, 450, 500].forEach((f, i) => setTimeout(() => playTone(f, 0.05, 'square'), i * 60)); },
    neigh:   () => { playTone(500, 0.1, 'sawtooth'); setTimeout(() => playTone(600, 0.2, 'sawtooth'), 100); },
    roar:    () => { playTone(100, 0.5, 'sawtooth'); },
    squawk:  () => { playTone(800, 0.08, 'square'); setTimeout(() => playTone(900, 0.1, 'square'), 100); },
    splash:  () => playPoof(),
    bubble:  () => playPop(),
    whoosh:  () => playWhoosh(),
    bleep:   () => playTone(880, 0.1, 'square'),
    crunch:  () => playSnap(),
    sting:   () => playSparkle(),
    ribbit:  () => { playTone(200, 0.05, 'square'); setTimeout(() => playTone(350, 0.08, 'square'), 80); },
    trumpet: () => { [300, 400, 500].forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'sawtooth'), i * 100)); },
    hiss:    () => playTone(2000, 0.3, 'sawtooth'),
    pop:     () => playPop(),
  };
  const fn = sounds[soundId] || sounds.pop;
  fn();
}

// ── Memory Match sounds ──

/** Fanfare — celebratory ascending arpeggio for board completion */
export function playFanfare() {
  if (globalMuted) return;
  const ctx = getCtx();
  const notes = [262, 330, 392, 523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.15;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc2.type = 'triangle';
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 1.002;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.55);
    osc2.stop(t + 0.55);
  });
}

// ── Premium Polish Sounds ──

/** Enriched tap — layered sine + triangle with pitch randomisation */
export function playRichTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const baseFreq = 580 + (Math.random() - 0.5) * 40;
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = baseFreq;
  gain1.gain.setValueAtTime(0.2, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.1);
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = baseFreq * 1.5;
  gain2.gain.setValueAtTime(0.1, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.08);
}

/** Navigate whoosh — soft filtered noise sweep */
export function playNavigate() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.25);
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.3);
}

/** Celebration jingle — ascending arpeggio with shimmer */
export function playCelebrate() {
  if (globalMuted) return;
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.15;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2.01;
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.06, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.45);
  });
  setTimeout(() => {
    const ctx2 = getCtx();
    [1047, 1319, 1568].forEach(freq => {
      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx2.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.8);
      osc.connect(gain).connect(ctx2.destination);
      osc.start();
      osc.stop(ctx2.currentTime + 0.85);
    });
  }, 750);
}

/** Gentle error — descending two-note (non-punishing) */
export function playError() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

// ── Section-Specific Tap Sounds ──

export function playGamesTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(280 + Math.random() * 40, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

export function playBooksTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.12);
  const osc = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 800;
  g2.gain.setValueAtTime(0.08, ctx.currentTime);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(g2).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

export function playArtTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.1);
}

export function playMusicTap() {
  playTone(1200, 0.04, 'square');
}

export function playPuzzlesTap() {
  if (globalMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 1800;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 900;
  g2.gain.setValueAtTime(0.1, ctx.currentTime + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc2.connect(g2).connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.02);
  osc2.stop(ctx.currentTime + 0.12);
}

/** Play the tap sound for a given section */
export function playSectionTap(section) {
  const tapMap = {
    games: playGamesTap,
    books: playBooksTap,
    art: playArtTap,
    music: playMusicTap,
    puzzles: playPuzzlesTap,
  };
  (tapMap[section] || playRichTap)();
}

/** Hook: returns muted state + toggle, and sound functions that respect mute */
export function useSound() {
  const muted = useRef(false);

  const wrap = useCallback((fn) => (...args) => {
    if (!muted.current && !globalMuted) fn(...args);
  }, []);

  return {
    muted,
    toggleMute: () => { muted.current = !muted.current; },
    playTone: wrap(playTone),
    playSuccess: wrap(playSuccess),
    playPop: wrap(playPop),
    playBoing: wrap(playBoing),
    playTap: wrap(playTap),
    playNote: wrap(playNote),
  };
}
