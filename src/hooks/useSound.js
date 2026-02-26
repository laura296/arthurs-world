import { useCallback, useRef } from 'react';

const audioCtxRef = { current: null };

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

/** Musical note (for music pad) */
export function playNote(freq, duration = 0.5) {
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

/** Hook: returns muted state + toggle, and sound functions that respect mute */
export function useSound() {
  const muted = useRef(false);

  const wrap = useCallback((fn) => (...args) => {
    if (!muted.current) fn(...args);
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
