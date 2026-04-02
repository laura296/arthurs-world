import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import games from '../data/games';
import BackButton from '../components/BackButton';

const BASE = '/arthurs-world';

/**
 * Collects every image path referenced across the app.
 * Groups them by category for easy scanning.
 */
function collectAllImages() {
  const groups = [];

  // Section hero images
  const sectionHeroes = [
    { id: 'games',  emoji: '🎮', label: 'Games',  src: `${BASE}/images/sections/games.png` },
    { id: 'art',    emoji: '🎨', label: 'Art',    src: `${BASE}/images/sections/art.png` },
    { id: 'books',  emoji: '📚', label: 'Books',  src: `${BASE}/images/sections/books.png` },
    { id: 'music',  emoji: '🎵', label: 'Music',  src: `${BASE}/images/sections/music.png` },
    { id: 'videos', emoji: '📺', label: 'Videos', src: `${BASE}/images/sections/videos.png` },
  ];
  groups.push({ title: 'Section Heroes', emoji: '🏠', items: sectionHeroes });

  // Game card covers
  const cardCovers = games
    .filter(g => g.cover)
    .map(g => ({ id: g.id, emoji: g.emoji, label: g.title, src: g.cover }));
  groups.push({ title: 'Card Covers', emoji: '🃏', items: cardCovers });

  // Story page images (books with known page-based images)
  const storyBooks = [
    'farm-book', 'three-pigs', 'goldilocks', 'red-riding',
    'whale-throat', 'camel-hump', 'rhino-skin', 'leopard-spots',
    'elephant-child', 'old-man-kangaroo', 'armadillos', 'first-letter',
    'alphabet-made', 'crab-sea', 'cat-walked', 'butterfly-stamped',
  ];
  const storyItems = [];
  for (const bookId of storyBooks) {
    const game = games.find(g => g.id === bookId);
    const emoji = game?.emoji || '📖';
    for (let p = 1; p <= 10; p++) {
      storyItems.push({
        id: `${bookId}/page-${p}`,
        emoji,
        label: `${game?.title || bookId} p${p}`,
        src: `${BASE}/images/${bookId}/page-${p}.png`,
      });
    }
  }
  groups.push({ title: 'Story Pages', emoji: '📖', items: storyItems });

  // Feelings & Aesop books (page images)
  const otherBooks = [
    'feelings-monster', 'when-i-feel-big', 'feelings-friends',
    'tortoise-hare', 'lion-mouse', 'boy-cried-wolf',
    'ant-grasshopper', 'fox-grapes', 'town-country-mouse',
  ];
  const otherItems = [];
  for (const bookId of otherBooks) {
    const game = games.find(g => g.id === bookId);
    const emoji = game?.emoji || '📖';
    for (let p = 1; p <= 10; p++) {
      otherItems.push({
        id: `${bookId}/page-${p}`,
        emoji,
        label: `${game?.title || bookId} p${p}`,
        src: `${BASE}/images/${bookId}/page-${p}.png`,
      });
    }
  }
  groups.push({ title: 'Feelings & Fables Pages', emoji: '💛', items: otherItems });

  // Disney story pages
  const disneyBooks = [
    { dir: 'cinderella', id: 'cinderella' },
    { dir: 'snow-white', id: 'snow-white' },
    { dir: 'pooh', id: 'winnie-the-pooh' },
    { dir: 'captain-hook', id: 'captain-hook' },
  ];
  const disneyItems = [];
  for (const d of disneyBooks) {
    const game = games.find(g => g.id === d.id);
    const emoji = game?.emoji || '✨';
    for (let p = 1; p <= 10; p++) {
      disneyItems.push({
        id: `disney/${d.dir}/page-${p}`,
        emoji,
        label: `${game?.title || d.id} p${p}`,
        src: `${BASE}/images/disney/${d.dir}/page-${p}.png`,
      });
    }
  }
  groups.push({ title: 'Disney Story Pages', emoji: '✨', items: disneyItems });

  return groups;
}

/** Check if an image URL loads successfully */
function checkImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Status badge component */
function StatusDot({ status }) {
  if (status === 'loading') {
    return (
      <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
    );
  }
  if (status === 'ok') {
    return <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />;
  }
  return <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />;
}

export default function MissingImages() {
  const navigate = useNavigate();
  const [groups] = useState(() => collectAllImages());
  const [statuses, setStatuses] = useState({}); // { src: 'loading' | 'ok' | 'missing' }
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'missing' | 'ok'

  const startScan = useCallback(async () => {
    setScanning(true);

    // Initialize all as loading
    const allItems = groups.flatMap(g => g.items);
    const initial = {};
    for (const item of allItems) initial[item.src] = 'loading';
    setStatuses(initial);

    // Check in batches of 10
    const BATCH = 10;
    for (let i = 0; i < allItems.length; i += BATCH) {
      const batch = allItems.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map(async (item) => {
          const ok = await checkImage(item.src);
          return { src: item.src, status: ok ? 'ok' : 'missing' };
        })
      );
      setStatuses(prev => {
        const next = { ...prev };
        for (const r of results) next[r.src] = r.status;
        return next;
      });
    }

    setScanning(false);
  }, [groups]);

  // Auto-start scan on mount
  useEffect(() => { startScan(); }, [startScan]);

  // Compute summary stats
  const allItems = groups.flatMap(g => g.items);
  const okCount = allItems.filter(i => statuses[i.src] === 'ok').length;
  const missingCount = allItems.filter(i => statuses[i.src] === 'missing').length;
  const loadingCount = allItems.filter(i => statuses[i.src] === 'loading').length;
  const total = allItems.length;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto no-scrollbar">
      <BackButton />

      <div className="relative z-10 p-6 pt-20 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <h1 className="text-3xl font-heading text-amber-300 text-center mb-2">
          🖼️ Image Status
        </h1>
        <p className="text-center text-slate-400 text-sm font-body mb-6">
          Checking all referenced images in the app
        </p>

        {/* Summary bar */}
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-2xl px-4 py-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-green-300 font-heading text-lg">{okCount}</span>
            <span className="text-slate-400 text-sm">found</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-2xl px-4 py-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-red-300 font-heading text-lg">{missingCount}</span>
            <span className="text-slate-400 text-sm">missing</span>
          </div>
          {loadingCount > 0 && (
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-2xl px-4 py-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-heading text-lg">{loadingCount}</span>
              <span className="text-slate-400 text-sm">checking</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-700 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${total ? ((okCount + missingCount) / total) * 100 : 0}%`,
              background: missingCount > 0
                ? `linear-gradient(90deg, #22c55e ${okCount / (okCount + missingCount) * 100}%, #ef4444 0%)`
                : '#22c55e',
            }}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: 'all', label: `All (${total})` },
            { key: 'missing', label: `Missing (${missingCount})` },
            { key: 'ok', label: `Found (${okCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl font-heading text-sm transition-all
                ${filter === f.key
                  ? 'bg-amber-500 text-slate-900 shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        {groups.map(group => {
          const filtered = group.items.filter(item => {
            if (filter === 'all') return true;
            return statuses[item.src] === filter;
          });
          if (filtered.length === 0) return null;

          const groupMissing = group.items.filter(i => statuses[i.src] === 'missing').length;
          const groupOk = group.items.filter(i => statuses[i.src] === 'ok').length;

          return (
            <div key={group.title} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{group.emoji}</span>
                <h2 className="text-xl font-heading text-amber-200">{group.title}</h2>
                <span className="text-sm text-slate-500 font-body">
                  {groupOk}/{group.items.length}
                </span>
                {groupMissing > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-body">
                    {groupMissing} missing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {filtered.map(item => {
                  const status = statuses[item.src] || 'loading';
                  const isMissing = status === 'missing';

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all
                        ${isMissing
                          ? 'bg-red-500/10 border border-red-500/20'
                          : status === 'ok'
                            ? 'bg-green-500/10 border border-green-500/10'
                            : 'bg-slate-700/30 border border-slate-600/20'}`}
                    >
                      {/* Thumbnail or emoji fallback */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-700/50">
                        {status === 'ok' ? (
                          <img src={item.src} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{item.emoji}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <StatusDot status={status} />
                          <span className="text-sm font-heading text-slate-200 truncate">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {item.src.replace(BASE, '')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Rescan button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={startScan}
            disabled={scanning}
            className="px-6 py-3 rounded-2xl font-heading text-lg
                       bg-amber-500 text-slate-900 shadow-lg
                       hover:bg-amber-400 active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanning ? '⏳ Scanning...' : '🔄 Rescan'}
          </button>
        </div>
      </div>
    </div>
  );
}
