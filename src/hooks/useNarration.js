/**
 * Shared narration helper with smart voice selection.
 * Picks the best available TTS voice for children's story reading.
 */

// Preferred voices ranked by quality for storytelling (warm, clear, female)
const PREFERRED_VOICES = [
  'Google UK English Female',
  'Microsoft Hazel Online (Natural)',
  'Microsoft Hazel',
  'Samantha',                // macOS/iOS
  'Karen',                   // macOS Australian
  'Google US English',
  'Microsoft Zira',
  'Fiona',                   // macOS Scottish
];

let cachedVoice = null;

function pickVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  // Try preferred voices first
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name);
    if (v) { cachedVoice = v; return v; }
  }
  // Fallback: any English female-sounding voice
  const english = voices.filter(v => v.lang.startsWith('en'));
  if (english.length) {
    cachedVoice = english[0];
    return english[0];
  }
  return null;
}

// Pre-warm voice list (Chrome loads them async)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.rate = 0.88;
  u.pitch = 1.05;
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
