import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

/**
 * Developer/parent diagnostic screen — checks which story and game images
 * exist vs which are expected.  Accessible at /missing-images.
 */

const BASE = '/arthurs-world/images';

// All expected image sets: { label, emoji, images: [path, ...] }
const IMAGE_SETS = [
  // ── Fairy Tales (10 pages each) ──
  ...['three-pigs', 'goldilocks', 'red-riding'].map(id => ({
    label: id.replace(/-/g, ' '),
    emoji: { 'three-pigs': '🐷', goldilocks: '🐻', 'red-riding': '🧒' }[id],
    group: 'Fairy Tales',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  // ── Just So Stories (10 pages each) ──
  ...['whale-throat', 'camel-hump', 'rhino-skin', 'leopard-spots', 'elephant-child',
      'old-man-kangaroo', 'armadillos', 'first-letter', 'alphabet-made', 'crab-sea',
      'cat-walked', 'butterfly-stamped'].map(id => ({
    label: id.replace(/-/g, ' '),
    emoji: {
      'whale-throat': '🐋', 'camel-hump': '🐫', 'rhino-skin': '🦏',
      'leopard-spots': '🐆', 'elephant-child': '🐘', 'old-man-kangaroo': '🦘',
      armadillos: '🦔', 'first-letter': '✏️', 'alphabet-made': '🔤',
      'crab-sea': '🦀', 'cat-walked': '🐈', 'butterfly-stamped': '🦋',
    }[id],
    group: 'Just So Stories',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  // ── Aesop's Fables (8 pages each) ──
  ...['tortoise-hare', 'lion-mouse', 'boy-cried-wolf', 'ant-grasshopper',
      'fox-grapes', 'town-country-mouse'].map(id => ({
    label: id.replace(/-/g, ' '),
    emoji: {
      'tortoise-hare': '🐢', 'lion-mouse': '🦁', 'boy-cried-wolf': '🐺',
      'ant-grasshopper': '🐜', 'fox-grapes': '🦊', 'town-country-mouse': '🐭',
    }[id],
    group: "Aesop's Fables",
    images: Array.from({ length: 8 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  // ── Disney Stories (10 pages each) ──
  ...['cinderella', 'snow-white', 'captain-hook'].map(id => ({
    label: id.replace(/-/g, ' '),
    emoji: { cinderella: '👠', 'snow-white': '🍎', 'captain-hook': '🏴‍☠️' }[id],
    group: 'Disney',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/disney/${id}/page-${i + 1}.png`),
  })),
  {
    label: 'winnie the pooh',
    emoji: '🍯',
    group: 'Disney',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/disney/pooh/page-${i + 1}.png`),
  },

  // ── Farm Book (8 pages) ──
  {
    label: 'goodnight farm',
    emoji: '🌙',
    group: 'Other Books',
    images: Array.from({ length: 8 }, (_, i) => `${BASE}/farm-book/page-${i + 1}.png`),
  },

  // ── Game card covers ──
  {
    label: 'card covers',
    emoji: '🃏',
    group: 'Game Cards',
    images: [
      `${BASE}/cards/bubble-pop.png`,
      `${BASE}/cards/feed-animals.png`,
      `${BASE}/cards/pop-critters.png`,
      `${BASE}/cards/build-a-scene.png`,
      `${BASE}/cards/memory-match.png`,
      `${BASE}/cards/music-pad.png`,
      `${BASE}/cards/colouring.png`,
    ],
  },
];

/** Try to load a single image; resolve true/false */
function checkImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function MissingImages() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);   // null = checking, Map<src, bool>
  const [filter, setFilter] = useState('all');     // 'all' | 'missing' | 'ok'

  const runChecks = useCallback(async () => {
    setResults(null);
    const allPaths = IMAGE_SETS.flatMap(s => s.images);
    const checks = await Promise.all(allPaths.map(async (src) => [src, await checkImage(src)]));
    setResults(new Map(checks));
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  // Compute stats
  const totalImages = IMAGE_SETS.reduce((n, s) => n + s.images.length, 0);
  const loadedCount = results ? [...results.values()].filter(Boolean).length : 0;
  const missingCount = results ? totalImages - loadedCount : 0;

  // Group sets by their group field
  const groups = [];
  const seenGroups = new Set();
  for (const set of IMAGE_SETS) {
    if (!seenGroups.has(set.group)) {
      seenGroups.add(set.group);
      groups.push({ name: set.group, sets: [] });
    }
    groups.find(g => g.name === set.group).sets.push(set);
  }

  return (
    <div className="relative w-full h-full bg-aw-warm overflow-y-auto no-scrollbar">
      <BackButton onClick={() => navigate('/')} />

      <div className="relative z-10 p-6 pt-20 max-w-lg mx-auto pb-24">
        {/* Header */}
        <h1 className="text-2xl font-heading text-amber-900 text-center mb-2">
          Image Status
        </h1>

        {/* Summary bar */}
        {results ? (
          <div className="mb-6">
            {/* Progress bar */}
            <div className="h-4 rounded-full bg-amber-100 overflow-hidden shadow-inner mb-2">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(loadedCount / totalImages) * 100}%`,
                  background: missingCount === 0
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
                }}
              />
            </div>
            <div className="flex justify-between text-sm font-heading text-amber-800">
              <span>{loadedCount}/{totalImages} found</span>
              <span className={missingCount > 0 ? 'text-red-600' : 'text-green-700'}>
                {missingCount > 0 ? `${missingCount} missing` : 'All good!'}
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mt-4 justify-center">
              {[
                { key: 'all', label: 'All' },
                { key: 'missing', label: `Missing (${missingCount})` },
                { key: 'ok', label: `Found (${loadedCount})` },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-heading transition-all
                    ${filter === f.key
                      ? 'bg-amber-600 text-white shadow-md scale-105'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <div className="inline-block w-8 h-8 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
            <p className="text-sm font-heading text-amber-700 mt-2">Checking images...</p>
          </div>
        )}

        {/* Image sets */}
        {results && groups.map(group => {
          // Apply filter: skip groups with no visible sets
          const visibleSets = group.sets.filter(set => {
            if (filter === 'all') return true;
            const setOk = set.images.every(src => results.get(src));
            const setMissing = set.images.some(src => !results.get(src));
            return filter === 'missing' ? setMissing : setOk;
          });
          if (visibleSets.length === 0) return null;

          return (
            <div key={group.name} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-amber-300/50" />
                <span className="text-xs font-heading text-amber-600 px-2 uppercase tracking-wider">
                  {group.name}
                </span>
                <div className="h-px flex-1 bg-amber-300/50" />
              </div>

              <div className="space-y-3">
                {visibleSets.map(set => {
                  const found = set.images.filter(src => results.get(src)).length;
                  const total = set.images.length;
                  const allOk = found === total;
                  const noneMissing = found === 0;

                  return (
                    <div
                      key={set.label}
                      className={`rounded-2xl p-4 border transition-colors ${
                        allOk
                          ? 'bg-green-50 border-green-200'
                          : noneMissing
                            ? 'bg-red-50 border-red-200'
                            : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      {/* Set header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{set.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-heading text-amber-900 capitalize">
                            {set.label}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${(found / total) * 100}%`,
                                  background: allOk ? '#22c55e' : '#f59e0b',
                                }}
                              />
                            </div>
                            <span className={`text-xs font-heading whitespace-nowrap ${
                              allOk ? 'text-green-700' : 'text-amber-700'
                            }`}>
                              {found}/{total}
                            </span>
                          </div>
                        </div>
                        <span className="text-lg">
                          {allOk ? '✅' : noneMissing ? '❌' : '⚠️'}
                        </span>
                      </div>

                      {/* Individual page dots */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {set.images.map((src, i) => {
                          const ok = results.get(src);
                          const filename = src.split('/').pop();
                          return (
                            <div
                              key={src}
                              title={filename}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                ${ok
                                  ? 'bg-green-400/80 text-green-900'
                                  : 'bg-red-300/80 text-red-900 animate-pulse'
                                }`}
                            >
                              {i + 1}
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
        })}

        {/* Refresh button */}
        {results && (
          <div className="text-center mt-6">
            <button
              onClick={runChecks}
              className="px-6 py-3 rounded-full bg-amber-500 text-white font-heading text-sm
                         shadow-lg active:scale-95 transition-transform"
            >
              Re-check Images
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
