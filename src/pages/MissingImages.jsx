import { useState, useEffect, useCallback, useRef } from 'react';
import games from '../data/games';
import BackButton from '../components/BackButton';
import { generateImage, hasApiKey } from '../lib/imageGen';
import { getImagePrompt, hasPrompt } from '../data/imagePrompts';

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
    // Aesop = 8 pages, Feelings = 8 pages
    for (let p = 1; p <= 8; p++) {
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

/** Download a blob as a file */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Derive a filename from image src, e.g. /images/sections/games.png → sections__games.png */
function srcToFilename(src) {
  return src
    .replace(/^\/arthurs-world\/images\//, '')
    .replace(/\//g, '__');
}

/** Status badge component */
function StatusDot({ status }) {
  if (status === 'loading') return <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />;
  if (status === 'ok') return <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />;
  if (status === 'generating') return <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.5)]" />;
  if (status === 'generated') return <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />;
  if (status === 'error') return <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />;
  return <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />;
}

export default function MissingImages() {
  const [groups] = useState(() => collectAllImages());
  // statuses: 'loading' | 'ok' | 'missing' | 'generating' | 'generated' | 'error'
  const [statuses, setStatuses] = useState({});
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState('all');
  // generation state
  const [generating, setGenerating] = useState(false);
  const [genQueue, setGenQueue] = useState([]);
  const [genProgress, setGenProgress] = useState({ done: 0, total: 0 });
  const [genErrors, setGenErrors] = useState({});
  // store generated blobs for preview + download
  const [generatedBlobs, setGeneratedBlobs] = useState({});
  const abortRef = useRef(false);
  const apiReady = hasApiKey();

  const startScan = useCallback(async () => {
    setScanning(true);
    const allItems = groups.flatMap(g => g.items);
    const initial = {};
    for (const item of allItems) initial[item.src] = 'loading';
    setStatuses(prev => {
      // Preserve generated/blob statuses
      const next = { ...initial };
      for (const [k, v] of Object.entries(prev)) {
        if (v === 'generated' || v === 'generating') next[k] = v;
      }
      return next;
    });

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
        for (const r of results) {
          // Don't overwrite generated status
          if (next[r.src] === 'generated' || next[r.src] === 'generating') continue;
          next[r.src] = r.status;
        }
        return next;
      });
    }
    setScanning(false);
  }, [groups]);

  useEffect(() => { startScan(); }, [startScan]);

  /** Generate a single image */
  const generateOne = useCallback(async (item) => {
    const promptData = getImagePrompt(item.src);
    if (!promptData) return;

    setStatuses(prev => ({ ...prev, [item.src]: 'generating' }));
    try {
      const blob = await generateImage(promptData.prompt);
      setGeneratedBlobs(prev => ({ ...prev, [item.src]: blob }));
      setStatuses(prev => ({ ...prev, [item.src]: 'generated' }));
      // Auto-download
      downloadBlob(blob, srcToFilename(item.src));
    } catch (err) {
      setStatuses(prev => ({ ...prev, [item.src]: 'error' }));
      setGenErrors(prev => ({ ...prev, [item.src]: err.message }));
    }
  }, []);

  /** Generate all missing images that have prompts */
  const generateAllMissing = useCallback(async () => {
    abortRef.current = false;
    setGenerating(true);
    const allItems = groups.flatMap(g => g.items);
    const queue = allItems.filter(i =>
      statuses[i.src] === 'missing' && hasPrompt(i.src)
    );
    setGenQueue(queue.map(i => i.src));
    setGenProgress({ done: 0, total: queue.length });

    for (let i = 0; i < queue.length; i++) {
      if (abortRef.current) break;
      const item = queue[i];
      await generateOne(item);
      setGenProgress({ done: i + 1, total: queue.length });
    }

    setGenerating(false);
  }, [groups, statuses, generateOne]);

  /** Generate all missing in a specific group */
  const generateGroup = useCallback(async (group) => {
    abortRef.current = false;
    setGenerating(true);
    const queue = group.items.filter(i =>
      statuses[i.src] === 'missing' && hasPrompt(i.src)
    );
    setGenProgress({ done: 0, total: queue.length });

    for (let i = 0; i < queue.length; i++) {
      if (abortRef.current) break;
      await generateOne(queue[i]);
      setGenProgress({ done: i + 1, total: queue.length });
    }

    setGenerating(false);
  }, [statuses, generateOne]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
  }, []);

  /** Download all generated images as individual files */
  const downloadAll = useCallback(() => {
    for (const [src, blob] of Object.entries(generatedBlobs)) {
      downloadBlob(blob, srcToFilename(src));
    }
  }, [generatedBlobs]);

  // Stats
  const allItems = groups.flatMap(g => g.items);
  const okCount = allItems.filter(i => statuses[i.src] === 'ok').length;
  const missingCount = allItems.filter(i => statuses[i.src] === 'missing').length;
  const generatingCount = allItems.filter(i => statuses[i.src] === 'generating').length;
  const generatedCount = allItems.filter(i => statuses[i.src] === 'generated').length;
  const errorCount = allItems.filter(i => statuses[i.src] === 'error').length;
  const loadingCount = allItems.filter(i => statuses[i.src] === 'loading').length;
  const total = allItems.length;
  const canGenerate = missingCount > 0 && apiReady;
  const missingWithPrompts = allItems.filter(i => statuses[i.src] === 'missing' && hasPrompt(i.src)).length;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto no-scrollbar">
      <BackButton />

      <div className="relative z-10 p-6 pt-20 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <h1 className="text-3xl font-heading text-amber-300 text-center mb-2">
          Image Studio
        </h1>
        <p className="text-center text-slate-400 text-sm font-body mb-4">
          Scan, generate and download missing images
        </p>

        {/* API key warning */}
        {!apiReady && (
          <div className="mb-4 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
            <p className="text-orange-300 text-sm font-body">
              Set <code className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">VITE_OPENAI_API_KEY</code> in
              your <code className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">.env</code> to enable generation
            </p>
          </div>
        )}

        {/* Summary bar */}
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-700/50 rounded-2xl px-3 py-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-green-300 font-heading">{okCount}</span>
            <span className="text-slate-500 text-xs">found</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-700/50 rounded-2xl px-3 py-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-red-300 font-heading">{missingCount}</span>
            <span className="text-slate-500 text-xs">missing</span>
          </div>
          {generatedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-700/50 rounded-2xl px-3 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-cyan-300 font-heading">{generatedCount}</span>
              <span className="text-slate-500 text-xs">generated</span>
            </div>
          )}
          {generatingCount > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-700/50 rounded-2xl px-3 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 font-heading">{generatingCount}</span>
              <span className="text-slate-500 text-xs">in progress</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-700/50 rounded-2xl px-3 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-orange-300 font-heading">{errorCount}</span>
              <span className="text-slate-500 text-xs">errors</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-700 rounded-full mb-4 overflow-hidden">
          {(() => {
            const checked = okCount + missingCount + generatedCount + errorCount;
            const pct = total ? (checked / total) * 100 : 0;
            return (
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, #22c55e ${total ? (okCount + generatedCount) / checked * 100 : 0}%, #ef4444 0%)`,
                }}
              />
            );
          })()}
        </div>

        {/* Generation progress */}
        {generating && (
          <div className="mb-4 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-violet-300 text-sm font-heading">
                Generating {genProgress.done}/{genProgress.total}...
              </span>
              <button
                onClick={stopGenerating}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-heading hover:bg-red-500/30"
              >
                Stop
              </button>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-300"
                style={{ width: `${genProgress.total ? (genProgress.done / genProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <button
            onClick={startScan}
            disabled={scanning || generating}
            className="px-4 py-2 rounded-xl font-heading text-sm
                       bg-slate-600 text-slate-200 shadow
                       hover:bg-slate-500 active:scale-95 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {scanning ? 'Scanning...' : 'Rescan'}
          </button>

          {canGenerate && (
            <button
              onClick={generateAllMissing}
              disabled={generating || missingWithPrompts === 0}
              className="px-4 py-2 rounded-xl font-heading text-sm
                         bg-violet-600 text-white shadow-lg
                         hover:bg-violet-500 active:scale-95 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : `Generate All (${missingWithPrompts})`}
            </button>
          )}

          {generatedCount > 0 && (
            <button
              onClick={downloadAll}
              className="px-4 py-2 rounded-xl font-heading text-sm
                         bg-cyan-600 text-white shadow-lg
                         hover:bg-cyan-500 active:scale-95 transition-all"
            >
              Re-download ({generatedCount})
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {[
            { key: 'all', label: `All (${total})` },
            { key: 'missing', label: `Missing (${missingCount})` },
            { key: 'generated', label: `Generated (${generatedCount})` },
            { key: 'ok', label: `Found (${okCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl font-heading text-xs transition-all
                ${filter === f.key
                  ? 'bg-amber-500 text-slate-900 shadow-lg'
                  : 'bg-slate-700/50 text-slate-300'}`}
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
          const groupGenerated = group.items.filter(i => statuses[i.src] === 'generated').length;
          const groupCanGenerate = group.items.filter(i =>
            statuses[i.src] === 'missing' && hasPrompt(i.src)
          ).length;

          return (
            <div key={group.title} className="mb-8">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-2xl">{group.emoji}</span>
                <h2 className="text-lg font-heading text-amber-200">{group.title}</h2>
                <span className="text-xs text-slate-500 font-body">
                  {groupOk + groupGenerated}/{group.items.length}
                </span>
                {groupMissing > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-body">
                    {groupMissing} missing
                  </span>
                )}
                {groupCanGenerate > 0 && apiReady && !generating && (
                  <button
                    onClick={() => generateGroup(group)}
                    className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-heading
                               hover:bg-violet-500/30 transition-all"
                  >
                    Generate ({groupCanGenerate})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {filtered.map(item => {
                  const status = statuses[item.src] || 'loading';
                  const isMissing = status === 'missing';
                  const isGenerated = status === 'generated';
                  const isGenerating = status === 'generating';
                  const isError = status === 'error';
                  const blob = generatedBlobs[item.src];
                  const blobUrl = blob ? URL.createObjectURL(blob) : null;
                  const canGen = isMissing && hasPrompt(item.src) && apiReady;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all
                        ${isMissing ? 'bg-red-500/10 border border-red-500/20'
                        : isGenerated ? 'bg-cyan-500/10 border border-cyan-500/20'
                        : isGenerating ? 'bg-violet-500/10 border border-violet-500/20'
                        : isError ? 'bg-orange-500/10 border border-orange-500/20'
                        : status === 'ok' ? 'bg-green-500/10 border border-green-500/10'
                        : 'bg-slate-700/30 border border-slate-600/20'}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-700/50">
                        {status === 'ok' ? (
                          <img src={item.src} alt="" className="w-full h-full object-cover" />
                        ) : blobUrl ? (
                          <img src={blobUrl} alt="" className="w-full h-full object-cover" />
                        ) : isGenerating ? (
                          <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-2xl">{item.emoji}</span>
                        )}
                      </div>

                      {/* Info */}
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
                        {isError && genErrors[item.src] && (
                          <p className="text-[10px] text-orange-400 truncate mt-0.5">
                            {genErrors[item.src]}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        {canGen && !generating && (
                          <button
                            onClick={() => generateOne(item)}
                            className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300
                                       flex items-center justify-center text-lg
                                       hover:bg-violet-500/30 active:scale-90 transition-all"
                            title="Generate"
                          >
                            ✨
                          </button>
                        )}
                        {isError && apiReady && !generating && (
                          <button
                            onClick={() => generateOne(item)}
                            className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300
                                       flex items-center justify-center text-lg
                                       hover:bg-orange-500/30 active:scale-90 transition-all"
                            title="Retry"
                          >
                            🔄
                          </button>
                        )}
                        {blob && (
                          <button
                            onClick={() => downloadBlob(blob, srcToFilename(item.src))}
                            className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300
                                       flex items-center justify-center text-lg
                                       hover:bg-cyan-500/30 active:scale-90 transition-all"
                            title="Download"
                          >
                            💾
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
