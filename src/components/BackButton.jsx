import { useNavigate, useLocation } from 'react-router-dom';
import { playRichTap } from '../hooks/useSound';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    playRichTap();
    // If there's browser history, use it
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback: navigate to parent path segment, or home
      const segments = location.pathname.split('/').filter(Boolean);
      if (segments.length > 1) {
        navigate('/' + segments.slice(0, -1).join('/'));
      } else {
        navigate('/');
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-3 left-3 z-50 w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm
                 border-2 border-white/40 shadow-lg
                 flex items-center justify-center active:scale-90 transition-transform tap-ripple"
      aria-label="Go back"
    >
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
