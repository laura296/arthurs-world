import { useNavigate } from 'react-router-dom';
import { playRichTap } from '../hooks/useSound';

export default function BackButton({ variant } = {}) {
  const navigate = useNavigate();
  const isDark = variant === 'dark';

  return (
    <button
      onClick={() => { playRichTap(); navigate(-1); }}
      className={`fixed top-3 left-3 z-50 w-20 h-20 rounded-full backdrop-blur-sm
                 shadow-lg flex items-center justify-center active:scale-90 transition-transform tap-ripple
                 ${isDark
                   ? 'bg-amber-800/40 border-2 border-amber-900/30'
                   : 'bg-white/30 border-2 border-white/40'}`}
      aria-label="Go back"
    >
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none"
           stroke={isDark ? '#5B3A1A' : 'white'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
