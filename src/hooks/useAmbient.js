import { useEffect, useRef } from 'react';

/**
 * Ambient sound loop for a given section.
 * Uses Web Audio oscillators/noise — no audio files.
 * Fades in/out over 1s. Extremely subtle (gain 0.03-0.05).
 */

function isMuted() { return !!window.__arthurMuted; }

function getCtx() {
  if (!window.__ambientCtx) {
    window.__ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = window.__ambientCtx;
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function createAmbient(section) {
  const ctx = getCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const nodes = [];

  switch (section) {
    case 'games': {
      const birdGain = ctx.createGain();
      birdGain.gain.value = 0.03;
      birdGain.connect(masterGain);
      const chirpInterval = setInterval(() => {
        if (isMuted()) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 2000 + Math.random() * 2000;
        g.gain.setValueAtTime(0.02, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(g).connect(birdGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }, 1500 + Math.random() * 3000);
      const breezeBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const breezeData = breezeBuffer.getChannelData(0);
      for (let i = 0; i < breezeData.length; i++) breezeData[i] = Math.random() * 2 - 1;
      const breeze = ctx.createBufferSource();
      breeze.buffer = breezeBuffer;
      breeze.loop = true;
      const breezeFilter = ctx.createBiquadFilter();
      breezeFilter.type = 'lowpass';
      breezeFilter.frequency.value = 400;
      const breezeGain = ctx.createGain();
      breezeGain.gain.value = 0.02;
      breeze.connect(breezeFilter).connect(breezeGain).connect(masterGain);
      breeze.start();
      nodes.push({ stop: () => { clearInterval(chirpInterval); breeze.stop(); } });
      break;
    }

    case 'books': {
      const hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 80;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.025;
      hum.connect(humGain).connect(masterGain);
      hum.start();
      const crackleInterval = setInterval(() => {
        if (isMuted()) return;
        const bufSize = ctx.sampleRate * 0.01;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.015;
        src.connect(g).connect(masterGain);
        src.start();
      }, 2000 + Math.random() * 4000);
      nodes.push({ stop: () => { hum.stop(); clearInterval(crackleInterval); } });
      break;
    }

    case 'music': {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      const g = ctx.createGain();
      g.gain.value = 0.015;
      noise.connect(filter).connect(g).connect(masterGain);
      noise.start();
      nodes.push({ stop: () => noise.stop() });
      break;
    }

    case 'art': {
      const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const rainData = rainBuffer.getChannelData(0);
      for (let i = 0; i < rainData.length; i++) rainData[i] = Math.random() * 2 - 1;
      const rain = ctx.createBufferSource();
      rain.buffer = rainBuffer;
      rain.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;
      const g = ctx.createGain();
      g.gain.value = 0.02;
      rain.connect(filter).connect(g).connect(masterGain);
      rain.start();
      nodes.push({ stop: () => rain.stop() });
      break;
    }

    case 'puzzles': {
      const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const windData = windBuffer.getChannelData(0);
      for (let i = 0; i < windData.length; i++) windData[i] = Math.random() * 2 - 1;
      const wind = ctx.createBufferSource();
      wind.buffer = windBuffer;
      wind.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 250;
      const g = ctx.createGain();
      g.gain.value = 0.018;
      wind.connect(filter).connect(g).connect(masterGain);
      wind.start();
      const chimeInterval = setInterval(() => {
        if (isMuted()) return;
        const osc = ctx.createOscillator();
        const cg = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800 + Math.random() * 800;
        cg.gain.setValueAtTime(0.02, ctx.currentTime);
        cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(cg).connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }, 5000 + Math.random() * 8000);
      nodes.push({ stop: () => { wind.stop(); clearInterval(chimeInterval); } });
      break;
    }

    default:
      break;
  }

  // Fade in
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1);

  return {
    stop() {
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch {} });
        masterGain.disconnect();
      }, 1100);
    },
  };
}

/** Hook: starts ambient sound for given section, cleans up on unmount/change */
export function useAmbient(section) {
  const ambientRef = useRef(null);

  useEffect(() => {
    if (!section) return;
    const timer = setTimeout(() => {
      ambientRef.current = createAmbient(section);
    }, 500);
    return () => {
      clearTimeout(timer);
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
  }, [section]);
}
