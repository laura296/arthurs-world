/**
 * Draw Alive — record a short sound for a creature, and play it back.
 * Recordings are stored as data URLs alongside the creature.
 */

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
  const recorder = new window.MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : undefined);
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

  const done = new Promise(resolve => { recorder.onstop = resolve; });
  recorder.start();
  setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), ms);
  await done;
  stream.getTracks().forEach(t => t.stop());

  const blob = new Blob(chunks, { type: recorder.mimeType || type || 'audio/webm' });
  if (!blob.size) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Play a recording, unless the app is in quiet mode. */
export function playVoice(url) {
  if (!url || window.__arthurMuted) return;
  try {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  } catch { /* unsupported format: stay quiet */ }
}
