import { useRef, useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videos from '../data/videoData';
import BackButton from '../components/BackButton';
import { playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

/**
 * Toddler-friendly video player with big touch controls.
 * Plays local mp4 files downloaded by scripts/download-videos.mjs.
 */
export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const video = videos.find(v => v.id === videoId);

  // Auto-hide controls after 3s of playback
  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    scheduleHide();
    return () => clearTimeout(hideTimer.current);
  }, [playing, scheduleHide]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const handleTap = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setShowControls(true);
    playCelebrate();
    peek('excited');
    // Celebration burst from centre of screen
    const w = window.innerWidth;
    const h = window.innerHeight;
    burst(w / 2, h / 2, { count: 20, spread: 100, colors: ['#facc15', '#ec4899', '#38bdf8', '#22c55e'], shapes: ['star', 'heart'] });
  }, [peek, burst]);

  if (!video) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
        <span className="text-xl font-heading text-sun">Video not found</span>
        <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full bg-sun text-night font-heading">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      <BackButton />

      {/* Video element */}
      <div
        className="flex-1 relative flex items-center justify-center"
        onClick={handleTap}
      >
        <video
          ref={videoRef}
          src={video.src}
          poster={video.thumb}
          className="w-full h-full object-contain"
          playsInline
          onEnded={handleEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Big centre play/pause button */}
        {showControls && (
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                         ${playing ? 'bg-black/40' : 'bg-white/30 backdrop-blur-sm'}`}
            >
              {playing ? (
                /* Pause icon — two bars */
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                /* Play icon — triangle */
                <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Title bar at bottom */}
      <div
        className="relative z-10 flex items-center justify-center py-3 px-4"
        style={{ background: `linear-gradient(135deg, ${video.color}40, ${video.color}20)` }}
      >
        <span className="text-lg font-heading text-white drop-shadow">
          {video.title}
        </span>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
