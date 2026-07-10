import { useState, useRef, useCallback } from 'react';
import allAssets from '../data/assetManifest';

/**
 * "Download All" button with progress bar.
 * Fetches image and audio assets so the service worker caches them for
 * offline use. Videos are excluded: they're ~111MB of the payload and
 * iPad Safari's Cache Storage quota is small enough that including them
 * risks evicting story narration (QuotaExceededError territory).
 */

const offlineAssets = allAssets.filter(url => !url.endsWith('.mp4'));

export default function DownloadAll() {
  const [state, setState] = useState('idle'); // idle | downloading | done | error
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const abortRef = useRef(null);

  const handleDownload = useCallback(async () => {
    if (state === 'downloading') {
      // Cancel
      abortRef.current?.abort();
      setState('idle');
      return;
    }

    setState('downloading');
    setProgress(0);
    setTotal(offlineAssets.length);

    const controller = new AbortController();
    abortRef.current = controller;

    let attempted = 0;
    let failed = 0;

    // Download in batches of 6 to avoid overwhelming the connection
    const batchSize = 6;
    for (let i = 0; i < offlineAssets.length; i += batchSize) {
      if (controller.signal.aborted) break;

      const batch = offlineAssets.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(url =>
          fetch(url, { signal: controller.signal })
            .then(r => { if (!r.ok) throw new Error(r.status); })
            .catch(() => { failed++; })
        )
      );

      attempted += batch.length;
      setProgress(attempted);
    }

    if (!controller.signal.aborted) {
      // Only claim "ready for offline" when everything actually cached
      setState(failed > 0 ? 'error' : 'done');
    }
  }, [state]);

  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;

  if (state === 'done') {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 animate-spring-in">
        <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 border border-green-400/30">
          <span className="text-2xl">✅</span>
          <span className="text-base font-heading text-green-800">Ready for offline!</span>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <button
        onClick={handleDownload}
        className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 border border-red-400/30"
      >
        <span className="text-2xl">⚠️</span>
        <span className="text-base font-heading text-red-800">Some failed — tap to retry</span>
      </button>
    );
  }

  if (state === 'downloading') {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30"
        >
          <span className="text-xl animate-spin">⏳</span>
          <span className="text-base font-heading text-amber-900">{pct}% — tap to cancel</span>
        </button>
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-aw-gold to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-body text-amber-800/60">{progress} / {total} files</span>
      </div>
    );
  }

  // idle
  return (
    <button
      onClick={handleDownload}
      className="w-full max-w-sm mx-auto flex items-center justify-center gap-3
                 bg-white/30 backdrop-blur-sm rounded-full px-5 py-3
                 border border-white/30 shadow-aw active:scale-95 transition-transform
                 animate-spring-in"
      style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
    >
      <span className="text-3xl">📥</span>
      <span className="text-lg font-heading text-amber-900">Download for offline</span>
    </button>
  );
}
