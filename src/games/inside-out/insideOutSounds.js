import { playTone } from '../../hooks/useSound';

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

function isMuted() {
  return globalMuted || window.__arthurMuted;
}

/** Sci-fi console button beep */
export function playConsoleBeep() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

/** Ascending sparkle for power-up collection */
export function playPowerUp() {
  if (isMuted()) return;
  [880, 1100, 1320, 1560, 1760].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.1, 'sine'), i * 50);
  });
}

/** Escalating combo hit — pitch rises with combo level */
export function playComboHit(level = 1) {
  if (isMuted()) return;
  const baseFreq = 600 + Math.min(level, 10) * 80;
  playTone(baseFreq, 0.08, 'sine');
  setTimeout(() => playTone(baseFreq * 1.25, 0.06, 'triangle'), 40);
}

/** Steam hiss — filtered noise burst */
export function playSteamHiss() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.3);
}

/** Brief alarm chime */
export function playAlarmChime() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  [1000, 800, 1000].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    const start = t + i * 0.08;
    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.08);
  });
}

/** Whoosh + chime for phase/level transitions */
export function playPhaseTransition() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Whoosh sweep
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, t);
  filter.frequency.exponentialRampToValueAtTime(2000, t + 0.15);
  filter.frequency.exponentialRampToValueAtTime(400, t + 0.3);
  filter.Q.value = 1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.35);
  // Chime
  setTimeout(() => {
    [784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'sine'), i * 80);
    });
  }, 200);
}

/** Dramatic low rumble + ascending notes for boss intro */
export function playBossIntro() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Low rumble
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(60, t);
  osc.frequency.linearRampToValueAtTime(80, t + 1);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 1.3);
  // Ascending power notes
  [220, 330, 440, 660].forEach((freq, i) => {
    const start = t + 0.6 + i * 0.15;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.15, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start(start);
    o.stop(start + 0.35);
  });
}

/** Ice/freeze crystallization sound */
export function playFreeze() {
  if (isMuted()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  [2400, 2000, 1600].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = t + i * 0.05;
    gain.gain.setValueAtTime(0.1, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  });
}

/** Countdown tick */
export function playCountdownTick() {
  if (isMuted()) return;
  playTone(900, 0.05, 'square');
}

/** Victory fanfare */
export function playVictoryFanfare() {
  if (isMuted()) return;
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047, 1319, 1568];
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.12;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc2.type = 'triangle';
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 1.002;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.65);
    osc2.stop(t + 0.65);
  });
}
