import { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOffline';

/**
 * Shows a small visual indicator when the device is offline.
 * Fades in/out gently — no text (Arthur is pre-literate).
 * Shows a cloud with a line through it when offline, airplane when offline for >2s.
 */
export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Briefly show a "reconnected" indicator then hide
      setShowReconnected(true);
      const t = setTimeout(() => {
        setVisible(false);
        setShowReconnected(false);
        setWasOffline(false);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [isOnline, wasOffline]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
      style={{ animation: 'gentleIn 0.5s ease-out' }}
    >
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        backdrop-blur-md shadow-lg
        transition-colors duration-500
        ${showReconnected
          ? 'bg-leaf/80 shadow-leaf/20'
          : 'bg-night/80 shadow-black/20 border border-sun/20'}
      `}>
        {showReconnected ? (
          /* Checkmark — back online */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.3" />
            <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          /* Airplane icon — offline / cruise mode */
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               className="animate-float">
            <path
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill="#facc15"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
