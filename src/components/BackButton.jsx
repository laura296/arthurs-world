import { useNavigate } from 'react-router-dom';
import { playTap } from '../hooks/useSound';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => { playTap(); navigate(-1); }}
      className="fixed top-4 left-4 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                 flex items-center justify-center text-3xl active:scale-90 transition-transform"
      aria-label="Go back"
    >
      ◀️
    </button>
  );
}
