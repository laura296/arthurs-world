import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { generateImage, hasApiKey } from '../lib/imageGen';

/**
 * Developer/parent diagnostic screen — checks which story/game images
 * exist and can generate missing ones via the OpenAI API.
 * Accessible at /#/missing-images.
 */

const BASE = '/arthurs-world/images';

// ── Style prefixes per story group ──────────────────────────────────
const STYLE = {
  aesop: 'Warm, friendly children\'s book illustration in a soft watercolour storybook style. Rounded characters with big expressive eyes, gentle pastel colours with golden-hour lighting. Scene for a 3-year-old child. Landscape format. No text or words.',
  disney: 'Magical children\'s storybook illustration in a warm, whimsical Disney-inspired style. Soft 3D rendered feel with golden lighting, rich saturated colours, and gentle rounded forms. Scene for a 3-year-old child. Landscape format. No text or words.',
  fairytale: 'Charming children\'s picture book illustration with bold colours, thick friendly outlines, and warm golden-hour lighting. Rounded touchable forms. Scene for a 3-year-old child. Landscape format. No text or words.',
};

// ── Page text for stories that need generation ──────────────────────
const STORY_PAGES = {
  'tortoise-hare': {
    style: STYLE.aesop,
    pages: [
      'A speedy hare showing off how fast he can run, countryside setting with rolling green hills',
      'A small determined tortoise challenging a laughing hare to a race, other animals watching',
      'The hare zooming ahead on a path while the tortoise walks slowly behind, race starting line',
      'The hare sleeping lazily under a shady tree, peaceful summer afternoon',
      'The tortoise walking steadily along the path, determined expression, sunny day',
      'The tortoise tiptoeing past the sleeping hare, quiet countryside',
      'The hare waking up surprised, seeing the tortoise near the finish line ahead',
      'The tortoise crossing the finish line first, celebrating, the hare looking shocked behind',
    ],
  },
  'lion-mouse': {
    style: STYLE.aesop,
    pages: [
      'A big friendly lion napping in warm sunshine on the African savanna',
      'A tiny mouse running across a sleepy lion\'s nose, the lion waking up surprised',
      'A big lion holding a tiny scared mouse gently in his paw',
      'The lion laughing and letting the tiny mouse go free, savanna background',
      'A lion trapped in a big rope net, roaring for help, forest edge',
      'A tiny brave mouse running towards a trapped lion to help',
      'The mouse nibbling through rope net with tiny teeth, the lion watching hopefully',
      'The lion free and happy, the tiny mouse sitting proudly on his head, friends together',
    ],
  },
  'boy-cried-wolf': {
    style: STYLE.aesop,
    pages: [
      'A young shepherd boy sitting on a green hill watching fluffy sheep, bored expression',
      'The boy standing on the hill shouting with hands cupped around mouth, sheep around him',
      'Villagers running up the hill with pitchforks, the boy laughing, no wolf in sight',
      'The boy on the hill shouting again, looking mischievous',
      'Angry villagers shaking their fingers at the naughty boy on the hill',
      'A real wolf creeping out of a dark forest towards the sheep, the boy looking terrified',
      'The boy crying for help on the hill, no one coming, wolf approaching sheep',
      'A kind farmer chasing a wolf away, the relieved boy hugging his sheep',
    ],
  },
  'ant-grasshopper': {
    style: STYLE.aesop,
    pages: [
      'A small ant carrying a big leaf of food on a sunny summer day, meadow with flowers',
      'A grasshopper playing a tiny fiddle and dancing in a sunny meadow, carefree',
      'The grasshopper talking to the busy ant, flowers and sunshine, summer meadow',
      'The ant storing berries and seeds in a cosy underground home, organized pantry',
      'A snowy winter landscape, cold wind blowing, bare trees',
      'A cold hungry grasshopper shivering in the snow outside',
      'The kind ant opening her warm door to the cold grasshopper, cosy interior with food',
      'The ant and grasshopper sharing food together in a warm cosy burrow, friends',
    ],
  },
  'fox-grapes': {
    style: STYLE.aesop,
    pages: [
      'A reddish-orange fox walking through sunny woodland, looking hungry',
      'A fox looking up at big juicy purple grapes hanging high on a vine, eyes wide',
      'A fox jumping high trying to reach grapes on a tall vine, stretching',
      'A fox jumping again and again, getting tired, grapes still too high',
      'A fox making one final big jump, straining, grapes just out of reach',
      'A grumpy fox walking away with nose in the air, grapes visible behind',
      'A fox strutting away, a little bird on a branch watching him',
      'The fox walking away alone, the vine of grapes in the background, moral scene',
    ],
  },
  'town-country-mouse': {
    style: STYLE.aesop,
    pages: [
      'A cute country mouse in a cosy burrow under an oak tree, warm and simple',
      'Two mice cousins greeting each other - one fancy town mouse, one simple country mouse',
      'Country mouse serving simple seeds and berries on a leaf plate, town mouse looking unimpressed',
      'Two tiny mice arriving in a big city with tall buildings, country mouse amazed',
      'An elaborate feast of cheese, cake, and chocolate on a grand table, mice eyes wide',
      'A big scary cat pouncing at two terrified mice running away from a table',
      'Two mice hiding in a tiny crack in the wall, scared, cat\'s eye peering in',
      'Happy country mouse back in his simple cosy burrow under the oak tree, peaceful',
    ],
  },
  'cinderella': {
    style: STYLE.disney,
    dir: 'disney/cinderella',
    pages: [
      'Kind Cinderella in ragged clothes sweeping the floor while mean stepsisters watch, grand house',
      'A royal invitation letter with a golden seal, sparkles, grand palace in background',
      'Cinderella alone and sad by the fireplace while her stepsisters leave in fancy dresses',
      'A magical fairy godmother appearing in sparkles and light, wand raised, Cinderella amazed',
      'A pumpkin transforming into a beautiful golden coach with magical sparkles',
      'Cinderella in a beautiful blue ball gown with glass slippers, magical transformation',
      'Cinderella and the Prince dancing together in a grand ballroom, chandelier above',
      'Cinderella running down palace steps at midnight, losing a glass slipper, clock striking 12',
      'The Prince kneeling, fitting a glass slipper on Cinderella\'s foot, it fits perfectly',
      'Cinderella and the Prince at their wedding, happily ever after, castle background',
    ],
  },
  'snow-white': {
    style: STYLE.disney,
    dir: 'disney/snow-white',
    pages: [
      'Beautiful Snow White with black hair and red lips in a castle garden, singing to birds',
      'An evil queen looking into an ornate magic mirror on the wall, dark castle room',
      'Snow White running through a dark scary forest, tall twisted trees',
      'Snow White discovering a tiny adorable cottage in a forest clearing, flowers around it',
      'Seven cute little dwarfs marching home from a diamond mine with pickaxes, singing',
      'An old woman (evil queen disguised) offering a shiny red apple, sinister',
      'Snow White asleep in a glass coffin, seven sad dwarfs gathered around, forest flowers',
      'A handsome prince on a white horse riding through the forest',
      'The Prince kissing sleeping Snow White, magical sparkles, spell breaking',
      'Snow White and the Prince waving from a castle balcony, dwarfs and forest animals cheering',
    ],
  },
  'pooh': {
    style: STYLE.disney,
    dir: 'disney/pooh',
    pages: [
      'Winnie the Pooh, a round yellow bear in a red shirt, waking up in his cosy tree house',
      'Pooh holding an empty honey pot upside down, sad face, honey dripping',
      'Pooh visiting tiny Piglet at his small house, Piglet wearing a striped shirt',
      'Tigger bouncing energetically, orange and black stripes, spring in his tail',
      'Pooh climbing a tall tree towards a beehive, bees buzzing around',
      'Pooh falling into a mud puddle with bees chasing him, splash',
      'Pooh and friends at Rabbit\'s tidy burrow, lots of honey pots on shelves',
      'Pooh stuck in Rabbit\'s round front door, half in half out, friends pulling',
      'Pooh popping out of the doorway and flying through the air, friends tumbling',
      'Pooh and all his friends sharing honey together under a tree, Hundred Acre Wood',
    ],
  },
  'captain-hook': {
    style: STYLE.disney,
    dir: 'disney/captain-hook',
    pages: [
      'Captain Hook on his pirate ship in Neverland, skull and crossbones flag, tropical sea',
      'Captain Hook looking scared, hook hand raised, dramatic pirate outfit',
      'A green crocodile with a ticking clock in its belly, swimming near a pirate ship',
      'Peter Pan flying over a pirate ship, green outfit, mischievous grin',
      'Captain Hook examining a treasure map with X marks the spot, excited expression',
      'Peter Pan and Captain Hook sword fighting on the deck of the pirate ship',
      'Lost Boys walking the plank on a pirate ship, Peter Pan sneaking up behind',
      'Captain Hook falling into the sea with the crocodile waiting below, splash',
      'Captain Hook running away on the beach, crocodile chasing him, tick tock',
      'Peter Pan and the Lost Boys celebrating on the pirate ship, Neverland sunset',
    ],
  },
};

// ── Image sets for status checking ──────────────────────────────────
const IMAGE_SETS = [
  ...['three-pigs', 'goldilocks', 'red-riding'].map(id => ({
    id, label: id.replace(/-/g, ' '),
    emoji: { 'three-pigs': '🐷', goldilocks: '🐻', 'red-riding': '🧒' }[id],
    group: 'Fairy Tales',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  ...['whale-throat', 'camel-hump', 'rhino-skin', 'leopard-spots', 'elephant-child',
      'old-man-kangaroo', 'armadillos', 'first-letter', 'alphabet-made', 'crab-sea',
      'cat-walked', 'butterfly-stamped'].map(id => ({
    id, label: id.replace(/-/g, ' '),
    emoji: {
      'whale-throat': '🐋', 'camel-hump': '🐫', 'rhino-skin': '🦏',
      'leopard-spots': '🐆', 'elephant-child': '🐘', 'old-man-kangaroo': '🦘',
      armadillos: '🦔', 'first-letter': '✏️', 'alphabet-made': '🔤',
      'crab-sea': '🦀', 'cat-walked': '🐈', 'butterfly-stamped': '🦋',
    }[id],
    group: 'Just So Stories',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  ...['tortoise-hare', 'lion-mouse', 'boy-cried-wolf', 'ant-grasshopper',
      'fox-grapes', 'town-country-mouse'].map(id => ({
    id, label: id.replace(/-/g, ' '),
    emoji: {
      'tortoise-hare': '🐢', 'lion-mouse': '🦁', 'boy-cried-wolf': '🐺',
      'ant-grasshopper': '🐜', 'fox-grapes': '🦊', 'town-country-mouse': '🐭',
    }[id],
    group: "Aesop's Fables",
    images: Array.from({ length: 8 }, (_, i) => `${BASE}/${id}/page-${i + 1}.png`),
  })),

  ...['cinderella', 'snow-white', 'captain-hook'].map(id => ({
    id, label: id.replace(/-/g, ' '),
    emoji: { cinderella: '👠', 'snow-white': '🍎', 'captain-hook': '🏴‍☠️' }[id],
    group: 'Disney',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/disney/${id}/page-${i + 1}.png`),
  })),
  {
    id: 'pooh', label: 'winnie the pooh', emoji: '🍯', group: 'Disney',
    images: Array.from({ length: 10 }, (_, i) => `${BASE}/disney/pooh/page-${i + 1}.png`),
  },

  {
    id: 'farm-book', label: 'goodnight farm', emoji: '🌙', group: 'Other Books',
    images: Array.from({ length: 8 }, (_, i) => `${BASE}/farm-book/page-${i + 1}.png`),
  },

  {
    id: 'cards', label: 'card covers', emoji: '🃏', group: 'Game Cards',
    images: [
      `${BASE}/cards/bubble-pop.png`, `${BASE}/cards/feed-animals.png`,
      `${BASE}/cards/pop-critters.png`, `${BASE}/cards/build-a-scene.png`,
      `${BASE}/cards/memory-match.png`, `${BASE}/cards/music-pad.png`,
      `${BASE}/cards/colouring.png`,
    ],
  },
];

function checkImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Trigger browser download of a blob */
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

export default function MissingImages() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(null); // { storyId, pageIdx, total }
  const [genError, setGenError] = useState(null);
  const [genPreview, setGenPreview] = useState(null); // { src (object URL), label }
  const abortRef = useRef(false);
  const apiReady = hasApiKey();

  const runChecks = useCallback(async () => {
    setResults(null);
    const allPaths = IMAGE_SETS.flatMap(s => s.images);
    const checks = await Promise.all(allPaths.map(async (src) => [src, await checkImage(src)]));
    setResults(new Map(checks));
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  const totalImages = IMAGE_SETS.reduce((n, s) => n + s.images.length, 0);
  const loadedCount = results ? [...results.values()].filter(Boolean).length : 0;
  const missingCount = results ? totalImages - loadedCount : 0;

  // Generate all missing images for a story
  const generateStory = useCallback(async (storyId) => {
    const storyData = STORY_PAGES[storyId];
    if (!storyData) return;

    const set = IMAGE_SETS.find(s => s.id === storyId);
    if (!set) return;

    // Find which pages are missing
    const missingPages = [];
    set.images.forEach((src, i) => {
      if (results && !results.get(src)) {
        missingPages.push(i);
      }
    });

    if (missingPages.length === 0) return;

    abortRef.current = false;
    setGenError(null);
    setGenPreview(null);

    for (let mi = 0; mi < missingPages.length; mi++) {
      if (abortRef.current) break;

      const pageIdx = missingPages[mi];
      const pageDesc = storyData.pages[pageIdx];
      if (!pageDesc) continue;

      setGenerating({ storyId, pageIdx, current: mi + 1, total: missingPages.length });

      const prompt = `${storyData.style}\n\nScene: ${pageDesc}`;

      try {
        const blob = await generateImage(prompt);
        const dir = storyData.dir || storyId;
        const filename = `page-${pageIdx + 1}.png`;
        downloadBlob(blob, filename);

        // Show preview
        const previewUrl = URL.createObjectURL(blob);
        setGenPreview({ src: previewUrl, label: `${set.label} page ${pageIdx + 1}`, dir });

        // Mark as done in results
        setResults(prev => {
          const next = new Map(prev);
          next.set(set.images[pageIdx], true);
          return next;
        });
      } catch (err) {
        setGenError(`${set.label} page ${pageIdx + 1}: ${err.message}`);
        break;
      }
    }

    setGenerating(null);
  }, [results]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
  }, []);

  // Group sets
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
        <h1 className="text-2xl font-heading text-amber-900 text-center mb-2">
          Image Status
        </h1>

        {/* API key status */}
        {!apiReady && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-xs font-heading text-red-700">
              No API key — set VITE_OPENAI_API_KEY to enable generation
            </p>
          </div>
        )}

        {/* Generation progress */}
        {generating && (
          <div className="mb-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-heading text-indigo-900">
                  Generating page {generating.pageIdx + 1}...
                </p>
                <p className="text-xs text-indigo-600">
                  {generating.current} of {generating.total} missing
                </p>
              </div>
              <button
                onClick={stopGenerating}
                className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-heading"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Generation error */}
        {genError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-xs font-heading text-red-700">{genError}</p>
            <button onClick={() => setGenError(null)}
                    className="text-xs text-red-500 underline mt-1">dismiss</button>
          </div>
        )}

        {/* Preview of last generated image */}
        {genPreview && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-green-200 shadow-md">
            <img src={genPreview.src} alt="" className="w-full h-40 object-cover" />
            <div className="p-2 bg-green-50 text-center">
              <p className="text-xs font-heading text-green-800 capitalize">{genPreview.label}</p>
              <p className="text-[10px] text-green-600 mt-0.5">
                Save to: public/images/{genPreview.dir}/
              </p>
            </div>
          </div>
        )}

        {/* Summary bar */}
        {results ? (
          <div className="mb-6">
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
                  const noneFound = found === 0;
                  const canGenerate = apiReady && !generating && STORY_PAGES[set.id] && !allOk;
                  const isGenerating = generating?.storyId === set.id;

                  return (
                    <div
                      key={set.label}
                      className={`rounded-2xl p-4 border transition-colors ${
                        allOk
                          ? 'bg-green-50 border-green-200'
                          : noneFound
                            ? 'bg-red-50 border-red-200'
                            : 'bg-amber-50 border-amber-200'
                      }`}
                    >
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

                        {/* Generate button or status icon */}
                        {canGenerate ? (
                          <button
                            onClick={() => generateStory(set.id)}
                            className="px-3 py-1.5 rounded-full bg-indigo-500 text-white text-xs
                                       font-heading shadow-md active:scale-95 transition-transform
                                       whitespace-nowrap"
                          >
                            Generate {total - found}
                          </button>
                        ) : isGenerating ? (
                          <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                        ) : (
                          <span className="text-lg">
                            {allOk ? '✅' : noneFound ? '❌' : '⚠️'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {set.images.map((src, i) => {
                          const ok = results.get(src);
                          return (
                            <div
                              key={src}
                              title={src.split('/').pop()}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                ${ok
                                  ? 'bg-green-400/80 text-green-900'
                                  : isGenerating && generating.pageIdx === i
                                    ? 'bg-indigo-400/80 text-white animate-pulse'
                                    : 'bg-red-300/80 text-red-900'
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

        {/* Bottom buttons */}
        {results && (
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={runChecks}
              className="px-6 py-3 rounded-full bg-amber-500 text-white font-heading text-sm
                         shadow-lg active:scale-95 transition-transform"
            >
              Re-check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
