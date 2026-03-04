import { useNavigate } from 'react-router-dom';
import { playRichTap } from '../hooks/useSound';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => { playRichTap(); navigate(-1); }}
      className="fixed top-4 left-4 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                 flex items-center justify-center active:scale-90 transition-transform tap-ripple"
      aria-label="Go back"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
