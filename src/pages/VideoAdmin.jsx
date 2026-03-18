import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registry from '../../data/video-registry.json';

const STATUS_COLOURS = {
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40', label: 'Approved' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', label: 'Rejected' },
  hidden:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40', label: 'Hidden' },
  pending:  { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', label: 'Pending' },
};

/**
 * Parent-only admin page for managing Arthur's video library.
 * Shows all videos (approved, rejected, hidden) with screening verdicts.
 * Access: hidden route, reached by long-pressing the settings area.
 */
export default function VideoAdmin() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const videos = registry.videos;
  const filtered = filter === 'all' ? videos : videos.filter(v => v.status === filter);

  const counts = {
    all: videos.length,
    approved: videos.filter(v => v.status === 'approved').length,
    rejected: videos.filter(v => v.status === 'rejected').length,
    hidden: videos.filter(v => v.status === 'hidden').length,
    pending: videos.filter(v => v.status === 'pending').length,
  };

  return (
    <div className="min-h-full bg-gray-950 text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-heading text-white/90">Video Library</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {['all', 'approved', 'rejected', 'hidden', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-heading whitespace-nowrap transition-all
                ${filter === f
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {/* CLI instructions */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <p className="text-sm text-white/60 font-body leading-relaxed">
            Add videos from your terminal:
          </p>
          <code className="block mt-2 text-xs text-amber-400/80 bg-black/30 rounded-lg p-3 font-mono overflow-x-auto">
            node scripts/add-video.mjs &quot;https://youtube.com/watch?v=...&quot;
          </code>
          <p className="text-xs text-white/40 mt-2 font-body">
            Videos are screened by Claude AI before being added. Manage with:
            <code className="text-amber-400/60"> node scripts/manage-videos.mjs help</code>
          </p>
        </div>

        {/* Video list */}
        <div className="space-y-3">
          {filtered.map(video => {
            const status = STATUS_COLOURS[video.status] || STATUS_COLOURS.pending;
            return (
              <div
                key={video.id}
                className={`rounded-2xl border ${status.border} overflow-hidden bg-white/5`}
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                    <img
                      src={`/arthurs-world/videos/${video.id}.webp`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-heading text-white/90 truncate">
                        {video.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-heading ${status.bg} ${status.text} flex-shrink-0`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 font-mono truncate">
                      {video.id}
                    </p>
                  </div>
                </div>

                {/* Screening verdict */}
                {video.screening && (
                  <div className="px-3 pb-3">
                    <div className="bg-black/20 rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={status.text}>
                          {video.screening.verdict === 'approved'
                            ? <path d="M20 6L9 17l-5-5" />
                            : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                          }
                        </svg>
                        <span className={`text-xs font-heading ${status.text}`}>
                          AI Screening: {video.screening.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 font-body leading-relaxed">
                        {video.screening.reason}
                      </p>
                      {video.screening.concerns && video.screening.concerns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {video.screening.concerns.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-red-500/20 text-red-400/80">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions hint */}
                <div className="px-3 pb-3 flex gap-2">
                  {video.status !== 'approved' && (
                    <span className="text-xs text-white/30 font-body">
                      To approve: <code className="text-amber-400/50">manage-videos.mjs approve {video.id}</code>
                    </span>
                  )}
                  {video.status === 'approved' && (
                    <span className="text-xs text-white/30 font-body">
                      To hide: <code className="text-amber-400/50">manage-videos.mjs hide {video.id}</code>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30 font-heading">
            No {filter} videos
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 mb-8 text-center text-xs text-white/30 font-body">
          {counts.approved} approved / {counts.all} total videos in library
        </div>
      </div>
    </div>
  );
}
