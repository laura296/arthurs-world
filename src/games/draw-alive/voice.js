/**
 * Draw Alive — record a short sound for a creature, and play it back.
 * Recordings are stored as data URLs alongside the creature.
 */

import { getAudioContext } from '../../hooks/useSound';

export const VOICE_MS = 3000;

export function canRecord() {
  return typeof window !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof window.MediaRecorder !== 'undefined';
}

/** Record for `ms` milliseconds. Resolves to a data URL, or rejects if the mic is unavailable. */
export async function recordVoice(ms = VOICE_MS) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']
    .find(t => window.MediaRecorder.isTypeSupported?.(t));
  const chunks = [];
  let mime = type;
  try {
    const recorder = new window.MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : undefined);
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const done = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start();
    setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), ms);
    await done;
    mime = recorder.mimeType || type;
  } finally {
    stream.getTracks().forEach(t => t.stop()); // never leave the microphone on
  }

  const blob = new Blob(chunks, { type: mime || 'audio/webm' });
  if (!blob.size) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const decoded = new Map();

/**
 * Play a recording, unless the app is in quiet mode. Goes through the
 * shared AudioContext (already unlocked by a tap), because iPad Safari
 * blocks <audio> playback that doesn't start inside a tap.
 */
export async function playVoice(url) {
  if (!url || window.__arthurMuted) return;
  try {
    const ctx = getAudioContext();
    let buffer = decoded.get(url);
    if (!buffer) {
      const bytes = atob(url.slice(url.indexOf(',') + 1));
      const data = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) data[i] = bytes.charCodeAt(i);
      buffer = await new Promise((resolve, reject) => ctx.decodeAudioData(data.buffer, resolve, reject));
      if (decoded.size > 30) decoded.clear();
      decoded.set(url, buffer);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start();
  } catch {
    try { await new Audio(url).play(); } catch { /* can't play this one: stay quiet */ }
  }
}
