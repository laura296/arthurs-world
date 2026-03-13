import { useState, useCallback, useRef, useEffect } from 'react';
import { playComboHit } from './insideOutSounds';

// ─── Screen Shake ────────────────────────────────────────
export function useScreenShake() {
  const [shakeStyle, setShakeStyle] = useState({});
  const frameRef = useRef(null);

  const shake = useCallback((intensity = 'medium') => {
    const levels = { light: [2, 200], medium: [5, 400], heavy: [8, 600] };
    const [px, ms] = levels[intensity] || levels.medium;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      if (elapsed > ms) {
        setShakeStyle({});
        return;
      }
      const decay = 1 - elapsed / ms;
      const dx = (Math.random() - 0.5) * 2 * px * decay;
      const dy = (Math.random() - 0.5) * 2 * px * decay;
      setShakeStyle({ transform: `translate(${dx}px, ${dy}px)` });
      frameRef.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const ShakeWrapper = useCallback(({ children, className = '', style = {} }) => (
    <div className={className} style={{ ...style, ...shakeStyle }}>
      {children}
    </div>
  ), [shakeStyle]);

  return { shake, ShakeWrapper, shakeStyle };
}

// ─── Combo Display ───────────────────────────────────────
export function useCombo() {
  const [combo, setCombo] = useState(0);
  const [display, setDisplay] = useState(null);
  const timerRef = useRef(null);

  const addCombo = useCallback(() => {
    setCombo(prev => {
      const next = prev + 1;
      if (next >= 2) {
        playComboHit(next);
        setDisplay({ count: next, key: Date.now() });
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setDisplay(null), 1500);
      }
      return next;
    });
  }, []);

  const resetCombo = useCallback(() => {
    setCombo(0);
    setDisplay(null);
  }, []);

  const comboColor = combo >= 8 ? '#ef4444' : combo >= 5 ? '#f97316' : combo >= 3 ? '#facc15' : '#ffffff';

  const ComboDisplay = useCallback(() => {
    if (!display) return null;
    return (
      <div key={display.key} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
           style={{ animation: 'comboPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
        <span className="text-3xl font-heading drop-shadow-lg" style={{ color: comboColor }}>
          x{display.count}!
        </span>
      </div>
    );
  }, [display, comboColor]);

  return { combo, addCombo, resetCombo, ComboDisplay };
}

// ─── Character Dialogue ──────────────────────────────────
const QUIP_BANKS = {
  joy: {
    encourage: ["You're doing great!", "Keep it up!", "Amazing!", "Woohoo!", "That's the spirit!"],
    warn: ["Watch out!", "Careful now!", "Oh no, hurry!", "We can do this!"],
    celebrate: ["We did it!", "Incredible!", "Best day ever!", "YAAAAY!"],
  },
  anger: {
    encourage: ["Not bad, kid.", "Now we're cooking!", "YEAH!", "That's what I'm talking about!"],
    warn: ["IT'S TOO HOT!", "DO SOMETHING!", "This is bad!", "COOL IT DOWN!"],
    celebrate: ["Fine. Good job.", "About time!", "FINALLY!"],
  },
  anxiety: {
    encourage: ["Okay, this is going okay...", "Maybe we'll be fine?", "That helped!"],
    warn: ["OH NO OH NO!", "IT'S FILLING UP!", "They keep coming!", "I CAN'T LOOK!"],
    celebrate: ["We... we survived?!", "I can breathe again!", "That was terrifying!"],
  },
  sadness: {
    encourage: ["That was nice...", "You're being so helpful...", "Oh... thank you."],
    warn: ["I don't think this is going well...", "Everything is falling apart..."],
    celebrate: ["That was... beautiful...", "I'm so happy I could cry..."],
  },
};

export function useDialogue() {
  const [bubble, setBubble] = useState(null);
  const timerRef = useRef(null);

  const say = useCallback((characterId, category = 'encourage', duration = 2500) => {
    const bank = QUIP_BANKS[characterId]?.[category];
    if (!bank) return;
    const text = bank[Math.floor(Math.random() * bank.length)];
    setBubble({ text, character: characterId, key: Date.now() });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setBubble(null), duration);
  }, []);

  const DialogueBubble = useCallback(() => {
    if (!bubble) return null;
    return (
      <div key={bubble.key} className="fixed top-28 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
           style={{ animation: 'dialogueFadeIn 0.3s ease-out' }}>
        <div className="bg-white/95 rounded-2xl px-4 py-2 shadow-lg max-w-[240px]">
          <p className="text-sm font-body text-gray-800 text-center leading-snug">{bubble.text}</p>
        </div>
        <div className="w-3 h-3 bg-white/95 rotate-45 mx-auto -mt-1.5" />
      </div>
    );
  }, [bubble]);

  return { say, DialogueBubble };
}

// ─── Number Pops ─────────────────────────────────────────
let popId = 0;
export function useNumberPop() {
  const [pops, setPops] = useState([]);

  const pop = useCallback((x, y, value, color = '#facc15') => {
    const id = ++popId;
    setPops(prev => [...prev, { id, x, y, value, color }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== id)), 800);
  }, []);

  const NumberLayer = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pops.map(p => (
        <div key={p.id} className="absolute font-heading text-lg"
             style={{
               left: p.x, top: p.y, color: p.color,
               animation: 'numberFloat 0.8s ease-out forwards',
               textShadow: '0 2px 4px rgba(0,0,0,0.5)',
             }}>
          +{p.value}
        </div>
      ))}
    </div>
  ), [pops]);

  return { pop, NumberLayer };
}

// ─── Power-Ups ───────────────────────────────────────────
const POWER_TYPES = [
  { id: 'time-freeze', name: 'Time Freeze', icon: '⏸', color: '#38bdf8', duration: 3000 },
  { id: 'multi-fix', name: 'Multi-Fix', icon: '🔧', color: '#facc15', duration: 0 },
  { id: 'shield', name: 'Shield', icon: '🛡', color: '#22c55e', duration: 5000 },
];

export function usePowerUps() {
  const [available, setAvailable] = useState(null);
  const [active, setActive] = useState(null);

  const spawnPower = useCallback(() => {
    const type = POWER_TYPES[Math.floor(Math.random() * POWER_TYPES.length)];
    setAvailable({ ...type, key: Date.now() });
    // Auto-despawn after 5 seconds if not collected
    setTimeout(() => setAvailable(prev => prev?.key === type.key ? null : prev), 5000);
  }, []);

  const collectPower = useCallback(() => {
    if (!available) return null;
    const power = available;
    setAvailable(null);
    setActive(power);
    if (power.duration > 0) {
      setTimeout(() => setActive(null), power.duration);
    } else {
      setTimeout(() => setActive(null), 100);
    }
    return power;
  }, [available]);

  const PowerUpDisplay = useCallback(() => {
    if (!available) return null;
    return (
      <button
        onClick={collectPower}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{
          background: `radial-gradient(circle, ${available.color}44, ${available.color}22)`,
          border: `2px solid ${available.color}`,
          animation: 'powerUpBob 1s ease-in-out infinite',
        }}
      >
        {available.icon}
      </button>
    );
  }, [available, collectPower]);

  return { activePower: active, spawnPower, collectPower, PowerUpDisplay };
}

// ─── Intro Countdown ─────────────────────────────────────
export function useIntroCountdown() {
  const [count, setCount] = useState(null);
  const [introText, setIntroText] = useState(null);

  const startCountdown = useCallback((onDone, message = null) => {
    if (message) {
      setIntroText(message);
      setTimeout(() => setIntroText(null), 1500);
    }
    const delay = message ? 1500 : 0;
    setTimeout(() => {
      setCount(3);
      setTimeout(() => setCount(2), 700);
      setTimeout(() => setCount(1), 1400);
      setTimeout(() => { setCount('GO!'); }, 2100);
      setTimeout(() => { setCount(null); onDone(); }, 2600);
    }, delay);
  }, []);

  const CountdownOverlay = useCallback(() => {
    if (!count && !introText) return null;
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 pointer-events-none">
        {introText && (
          <p className="text-white font-heading text-lg text-center px-8 animate-spring-in">{introText}</p>
        )}
        {count && !introText && (
          <span key={count} className="text-6xl font-heading text-white drop-shadow-lg"
                style={{ animation: 'countdownPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            {count}
          </span>
        )}
      </div>
    );
  }, [count, introText]);

  return { startCountdown, CountdownOverlay, isCountingDown: count !== null || introText !== null };
}

// ─── CSS (inject once) ───────────────────────────────────
export function GameJuiceStyles() {
  return (
    <style>{`
      @keyframes comboPopIn {
        0% { transform: translate(-50%, 0) scale(0.3); opacity: 0; }
        60% { transform: translate(-50%, 0) scale(1.3); opacity: 1; }
        100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
      }
      @keyframes dialogueFadeIn {
        0% { opacity: 0; transform: translate(-50%, 10px); }
        100% { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes numberFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0.6); opacity: 0; }
      }
      @keyframes powerUpBob {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.1); }
      }
      @keyframes countdownPop {
        0% { transform: scale(2.5); opacity: 0; }
        40% { transform: scale(0.9); opacity: 1; }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  );
}
