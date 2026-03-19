import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import TiltCard from '../components/TiltCard';
import { shows, getShowEpisodes } from '../data/videoData';
import { playNavigate } from '../hooks/useSound';

/**
 * Episode grid for a specific TV show.
 * Arthur taps a thumbnail to watch that episode.
 */
export default function ShowEpisodes() {
  const { mode, showId } = useParams();
  const navigate = useNavigate();

  const show = shows.find(s => s.id === showId);
  const episodes = getShowEpisodes(showId);

  const handleEpisodeTap = (episodeId) => {
    playNavigate();
    navigate(`/games/${mode}/tv-shows/video/${episodeId}`);
  };

  if (!show) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
        <span className="text-xl font-heading text-sun">Show not found</span>
        <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full bg-sun text-night font-heading">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)' }}>
      <BackButton />

      {/* Show title header */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-4 mb-4 px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${show.bg} flex items-center justify-center shadow-lg`}
        />
        <h1 className="text-2xl font-heading text-white drop-shadow-lg">
          {show.title}
        </h1>
      </motion.div>

      {/* Episodes grid — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {episodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-white/60 text-center font-heading text-lg">No episodes yet</p>
            <p className="text-white/40 text-center text-sm max-w-xs">
              Add episodes with the add-show-episodes script
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: Math.min(i * 0.06, 0.6),
                }}
              >
                <TiltCard
                  onClick={() => handleEpisodeTap(ep.id)}
                  className="relative rounded-2xl overflow-hidden shadow-lg aspect-video"
                >
                  {/* Thumbnail or gradient fallback */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${ep.bg}`} />
                  <img
                    src={ep.thumb}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title at bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-2">
                    <p className="text-white text-xs font-heading leading-tight drop-shadow line-clamp-2">
                      {ep.title}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
