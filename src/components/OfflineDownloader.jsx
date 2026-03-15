import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArthurBear from './ArthurBear';
import { playSuccess, playCelebrate } from '../hooks/useSound';

const CACHE_NAME = 'aw-offline-assets';
const MANIFEST_URL = import.meta.env.BASE_URL + 'asset-manifest.json';
const CONCURRENT = 4; // parallel downloads
const STORAGE_KEY = 'aw-offline-downloaded';

/**
 * Full-screen offline download overlay.
 * Shows Arthur Bear with a progress ring while downloading all assets.
 * Fully visual — no reading required.
 */
export default function OfflineDownloader({ onClose }) {
  const [state, setState] = useState('idle'); // idle | downloading | done | error
  const [progress, setProgress] = useState(0); // 0–1
  const [downloaded, setDownloaded] = useState(0);
  const [total, setTotal] = useState(0);
  const cancelRef = useRef(false);

  const startDownload = useCallback(async () => {
    setState('downloading');
    cancelRef.current = false;

    try {
      // Fetch the manifest (with cache-bust to get latest)
      const res = await fetch(MANIFEST_URL + '?t=' + Date.now());
      if (!res.ok) throw new Error('Manifest fetch failed');
      const manifest = await res.json();

      const assets = manifest.assets;
      setTotal(assets.length);

      const cache = await caches.open(CACHE_NAME);

      // Check which assets are already cached
      const uncached = [];
      for (const asset of assets) {
        const existing = await cache.match(asset.url);
        if (!existing) uncached.push(asset);
      }

      // If everything is cached, we're done
      const alreadyCached = assets.length - uncached.length;
      setDownloaded(alreadyCached);
      setProgress(alreadyCached / assets.length);

      if (uncached.length === 0) {
        setState('done');
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        try { playCelebrate(); } catch {}
        return;
      }

      // Download in batches
      let completed = alreadyCached;
      let i = 0;

      async function downloadNext() {
        while (i < uncached.length) {
          if (cancelRef.current) return;
          const asset = uncached[i++];
          try {
            const response = await fetch(asset.url);
            if (response.ok) {
              await cache.put(asset.url, response);
            }
          } catch {
            // Skip failed assets — they'll be retried next time
          }
          completed++;
          setDownloaded(completed);
          setProgress(completed / assets.length);
        }
      }

      // Run CONCURRENT parallel download workers
      const workers = Array.from({ length: CONCURRENT }, () => downloadNext());
      await Promise.all(workers);

      if (!cancelRef.current) {
        setState('done');
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        try { playCelebrate(); } catch {}
      }
    } catch (err) {
      console.error('Offline download error:', err);
      setState('error');
    }
  }, []);

  // Auto-start on mount
  useEffect(() => {
    startDownload();
    return () => { cancelRef.current = true; };
  }, [startDownload]);

  const pct = Math.round(progress * 100);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  const expression = state === 'done' ? 'excited' :
                     state === 'error' ? 'sleepy' :
                     progress > 0.5 ? 'happy' : 'curious';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-night/95 backdrop-blur-sm"
    >
      {/* Progress ring with Arthur Bear inside */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(250,204,21,0.15)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="#facc15"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>

        {/* Arthur Bear */}
        <ArthurBear
          expression={expression}
          size={90}
          className={state === 'downloading' ? 'animate-float' : ''}
        />

        {/* Done checkmark overlay */}
        {state === 'done' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-12 h-12 bg-leaf rounded-full
                       flex items-center justify-center shadow-lg"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Star progress dots — visual count without text */}
      <div className="flex gap-1.5 mt-6">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: progress >= (i + 1) / 10 ? 1 : 0.5,
              opacity: progress >= (i + 1) / 10 ? 1 : 0.3,
            }}
            className="w-4 h-4"
          >
            <svg viewBox="0 0 20 20" fill={progress >= (i + 1) / 10 ? '#facc15' : '#334155'}>
              <path d="M10 0l2.4 7.2H20l-6 4.8 2.4 7.2L10 14.4 3.6 19.2 6 12 0 7.2h7.6z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Percentage — small, for parents */}
      <p className="text-sun/50 text-sm font-body mt-3 tabular-nums">
        {downloaded} / {total}
      </p>

      {/* Action buttons */}
      <div className="mt-8 flex gap-4">
        {state === 'done' ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="px-10 py-4 bg-sun text-night text-lg font-heading rounded-full
                       shadow-xl active:scale-95 transition-transform"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        ) : state === 'error' ? (
          <>
            <button
              onClick={() => { setState('idle'); startDownload(); }}
              className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                         shadow-xl active:scale-95 transition-transform"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" className="inline-block">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/10 text-white text-lg font-heading rounded-full
                         shadow-xl active:scale-95 transition-transform"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" className="inline-block">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={() => { cancelRef.current = true; onClose(); }}
            className="px-8 py-3 bg-white/10 text-white/60 text-sm font-body rounded-full
                       active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" className="inline-block">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Returns the date of the last successful download, or null */
export function getLastDownloadDate() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? new Date(stored) : null;
}
