import { playRichTap } from '../../hooks/useSound';

/** Same frosted back button as BackButton, but steps back inside the game. */
export default function RoundBack({ onBack }) {
  return (
    <button
      onClick={() => { playRichTap(); onBack(); }}
      className="fixed top-3 left-3 z-50 w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm
                 border-2 border-white/40 shadow-lg
                 flex items-center justify-center active:scale-90 transition-transform"
      aria-label="Go back"
    >
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
