import { useState } from 'react';
import { setGlobalMute } from '@shared/hooks/useSound';

/**
 * Simple mute toggle — replaces the old ModePicker quiet/noisy mode.
 * Fixed top-right, small enough not to distract Arthur.
 */
export default function MuteToggle() {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setGlobalMute(next);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-3 z-50 w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm
                 border-2 border-white/40 shadow-lg
                 flex items-center justify-center active:scale-90 transition-transform"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={muted ? '#ef4444' : '#f59e0b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {muted ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={muted ? '#ef4444' : '#f59e0b'} />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#f59e0b" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
}
