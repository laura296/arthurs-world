import { useNavigate } from 'react-router-dom';
import { useRef, useContext, useState, lazy, Suspense } from 'react';
import { playNavigate } from '../hooks/useSound';
import GoldenHourScene from '../components/scenes/GoldenHourScene';
import ArthurBear from '../components/ArthurBear';
import { SessionTimerContext } from '../App';

const OfflineDownloader = lazy(() => import('../components/OfflineDownloader'));

const modes = [
  { id: 'quiet', emoji: '🌙', label: 'Quiet', bg: 'from-indigo-400/80 to-blue-800/80', to: '/games/quiet' },
  { id: 'noisy', emoji: '🔥', label: 'Noisy', bg: 'from-aw-amber/80 to-orange-600/80', to: '/games/noisy' },
  { id: 'all',   emoji: '🌟', label: 'All',   bg: 'from-aw-gold/80 to-amber-600/80', to: '/games/all' },
];

export default function ModePicker() {
  const navigate = useNavigate();
  const sessionTimer = useContext(SessionTimerContext);
  const longPressRef = useRef(null);
  const [showDownloader, setShowDownloader] = useState(false);

  // Long-press ArthurBear (3s) opens parent timer picker
  const handleBearDown = () => {
    longPressRef.current = setTimeout(() => {
      sessionTimer?.openPicker();
    }, 3000);
  };
  const handleBearUp = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6 bg-aw-warm">
      <GoldenHourScene />

      {/* Download for offline button — top right, for parents */}
      <button
        onClick={() => setShowDownloader(true)}
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full
                   bg-white/20 backdrop-blur-sm border border-white/30
                   flex items-center justify-center shadow-aw
                   active:scale-90 transition-transform"
        aria-label="Download for offline"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>

      {/* Offline download overlay */}
      {showDownloader && (
        <Suspense fallback={null}>
          <OfflineDownloader onClose={() => setShowDownloader(false)} />
        </Suspense>
      )}

      <div className="relative z-10 flex flex-col items-center gap-2 animate-spring-in">
        <div onPointerDown={handleBearDown} onPointerUp={handleBearUp} onPointerCancel={handleBearUp}>
          <ArthurBear expression="excited" size={80} />
        </div>
        <h1 className="text-5xl font-heading text-amber-900 drop-shadow-lg animate-float"
            style={{ textShadow: '0 2px 8px rgba(245, 176, 65, 0.4)' }}>
          Arthur's World
        </h1>
      </div>

      <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
        {modes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { playNavigate(); navigate(m.to); }}
            className={`game-card tap-ripple bg-gradient-to-br ${m.bg} backdrop-blur-sm
                       p-8 flex flex-col items-center gap-3 border border-white/20
                       shadow-aw-lg animate-spring-in`}
            style={{ animationDelay: `${0.15 + i * 0.1}s`, animationFillMode: 'backwards' }}
          >
            <span className="text-7xl">{m.emoji}</span>
            <span className="text-2xl font-heading text-white drop-shadow">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
