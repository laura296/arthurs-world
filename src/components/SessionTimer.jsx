import { useState, useEffect, useRef, useCallback } from 'react';
import ArthurBear from './ArthurBear';

/**
 * SessionTimer — parent-controlled screen time manager.
 *
 * Activation: Parent long-presses the Arthur Bear icon on ModePicker (3s).
 * A visual moon/sun arc shows remaining time (no numbers — pre-literate).
 * Wind-down: Arthur yawns, screen dims gently, then locks with a "Time to rest!" overlay.
 *
 * Props:
 *   durationMinutes: number (default 20)
 *   enabled: boolean
 *   onTimeUp: () => void
 */

const TIMER_PRESETS = [10, 15, 20, 30, 45]; // minutes

/* ── Timer picker (parent-facing, appears on long-press) ── */
function TimerPicker({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs mx-4 animate-spring-in"
           onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-heading text-amber-800 text-center mb-1">
          ⏰ Play Timer
        </h3>
        <p className="text-sm text-amber-600/70 text-center mb-4">
          Arthur will say goodnight when time is up
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TIMER_PRESETS.map(m => (
            <button key={m} onClick={() => onSelect(m)}
              className="bg-amber-50 hover:bg-amber-100 active:scale-95 rounded-2xl py-3 px-2
                         font-heading text-amber-800 text-lg transition-all border-2 border-amber-200">
              {m}m
            </button>
          ))}
          <button onClick={() => onSelect(0)}
            className="bg-gray-50 hover:bg-gray-100 active:scale-95 rounded-2xl py-3 px-2
                       font-heading text-gray-500 text-sm transition-all border-2 border-gray-200">
            Off
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Wind-down overlay (Arthur yawning) ── */
function WindDownOverlay({ phase, onDismiss }) {
  if (phase === 'none') return null;

  const isWarning = phase === 'warning';
  const isLocked = phase === 'locked';

  return (
    <div className={`fixed inset-0 z-[190] flex flex-col items-center justify-center transition-all duration-[2000ms]
                     ${isLocked ? 'bg-indigo-950/90' : 'bg-indigo-950/40'}`}
         style={{ pointerEvents: isLocked ? 'auto' : 'none' }}>
      {/* Dim gradient */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-[3000ms]"
           style={{
             background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.15), rgba(15,23,42,0.9))',
             opacity: isLocked ? 1 : 0.4,
           }} />

      {/* Stars appear as it gets "darker" */}
      {isLocked && Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-white rounded-full"
             style={{
               left: `${10 + Math.random() * 80}%`,
               top: `${5 + Math.random() * 50}%`,
               opacity: 0.3 + Math.random() * 0.5,
               animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
             }} />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-4"
           style={{ animation: 'pop-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <ArthurBear expression="sleepy" size={isLocked ? 140 : 100}
                    className="transition-all duration-1000" />

        {isWarning && (
          <p className="text-xl font-heading text-indigo-200 text-center animate-pulse">
            🌙 Nearly bedtime...
          </p>
        )}

        {isLocked && (
          <>
            <p className="text-2xl font-heading text-indigo-100 text-center">
              🌙 Time to rest!
            </p>
            <p className="text-sm text-indigo-300/70 text-center">
              Arthur is sleepy now
            </p>
            {/* Parent unlock — small, unobtrusive */}
            <button onClick={onDismiss}
              className="mt-4 text-xs text-indigo-400/40 underline active:text-indigo-300 transition-colors">
              Continue playing
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Compact timer indicator (top-right arc) ── */
function TimerIndicator({ progress, minutesLeft }) {
  if (progress <= 0) return null;
  const remaining = 1 - progress; // 1 = full, 0 = done
  const urgency = remaining < 0.15;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="relative w-10 h-10">
        {/* Arc background */}
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.1"
                  strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none"
                  stroke={urgency ? '#f59e0b' : '#818cf8'}
                  strokeOpacity="0.6" strokeWidth="3"
                  strokeDasharray={`${remaining * 94.2} 94.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000" />
        </svg>
        {/* Moon/sun icon */}
        <span className="absolute inset-0 flex items-center justify-center text-sm">
          {remaining > 0.5 ? '☀️' : '🌙'}
        </span>
      </div>
    </div>
  );
}

/* ── Main export: SessionTimer manager ── */
export function useSessionTimer() {
  const [enabled, setEnabled] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [windDown, setWindDown] = useState('none'); // 'none' | 'warning' | 'locked'
  const [showPicker, setShowPicker] = useState(false);
  const startRef = useRef(null);
  const intervalRef = useRef(null);

  const startTimer = useCallback((minutes) => {
    if (minutes <= 0) {
      setEnabled(false);
      setDurationMs(0);
      setElapsed(0);
      setWindDown('none');
      setShowPicker(false);
      return;
    }
    setDurationMs(minutes * 60 * 1000);
    setElapsed(0);
    setWindDown('none');
    setEnabled(true);
    startRef.current = Date.now();
    setShowPicker(false);
  }, []);

  // Tick
  useEffect(() => {
    if (!enabled || !durationMs) return;
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const e = now - startRef.current;
      setElapsed(e);

      const remaining = 1 - (e / durationMs);
      if (remaining <= 0) {
        setWindDown('locked');
        clearInterval(intervalRef.current);
      } else if (remaining <= 0.1) {
        setWindDown('warning');
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [enabled, durationMs]);

  const progress = durationMs > 0 ? Math.min(elapsed / durationMs, 1) : 0;
  const minutesLeft = Math.max(0, Math.ceil((durationMs - elapsed) / 60000));

  const dismiss = useCallback(() => {
    // Parent dismisses — add 5 more minutes
    setDurationMs(d => d + 5 * 60 * 1000);
    setWindDown('none');
  }, []);

  const openPicker = useCallback(() => setShowPicker(true), []);
  const closePicker = useCallback(() => setShowPicker(false), []);

  function SessionTimerUI() {
    return (
      <>
        {enabled && <TimerIndicator progress={progress} minutesLeft={minutesLeft} />}
        <WindDownOverlay phase={windDown} onDismiss={dismiss} />
        {showPicker && <TimerPicker onSelect={startTimer} onClose={closePicker} />}
      </>
    );
  }

  return {
    openPicker,
    SessionTimerUI,
    timerActive: enabled,
  };
}
