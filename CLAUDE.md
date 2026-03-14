# Arthur's World

A children's iPad PWA for a child aged ~3.5. Arthur is pre-literate — no text-heavy interfaces, no reading required. Everything is visual, tactile, and audio-driven.

## Tech Stack

- **React 18** + **Vite** (base: `/arthurs-world/`)
- **Tailwind CSS 3** with extensive custom config
- **Framer Motion** for animations (spring physics preferred)
- **Web Audio API** via `src/hooks/useSound.js` (no Tone.js yet — all audio is synthesised)
- **PWA** via vite-plugin-pwa with Workbox caching
- **Deployed** to GitHub Pages (HashRouter)

## Project Structure

```
src/
  App.jsx              # All routes (54+), lazy-loaded with Suspense
  index.css            # Tailwind layers + all @keyframes
  pages/               # Hub/navigation (ModePicker, SectionPicker, GameGrid, DisneyHub)
  games/               # Interactive games (BubblePop, FeedAnimals, PopCritters, etc.)
  stories/             # Storybooks (fairy tales, Kipling, Disney, Ellie)
  components/          # Shared UI (ArthurBear, BackButton, PageTransition, etc.)
    animals/           # SVG animal components
    backgrounds/       # Section background components
    scenes/            # Story scene components
  contexts/            # SectionContext (provides theme per route)
  hooks/               # useSound, useAmbient, useAnimalSounds, useNarration, useCanvas
  data/                # games.js (85+ items), sectionThemes.js, colouringPages.js, videoData.js
  lib/                 # imageGen.js, imageCache.js

public/
  audio/               # MP3 narration organised by story (10-15 files each)
  images/              # Generated story/card images
  videos/              # Video thumbnails (WebP)
  icons/               # PWA icons
```

### Target Asset Directory (being built out)

```
public/assets/
  characters/          # Character renders (WebP, 512×512 @2x)
  backgrounds/         # Scene backgrounds (WebP, 2732×2048 for iPad Pro)
  items/               # Game items — shapes, food, etc. (WebP, 128×128 @2x)
  ui/                  # Buttons, stars, card backs (WebP, 128×128 @2x)
  animations/          # Lottie JSON, Rive .riv files
```

## Visual Direction

**Target**: Pixar-quality soft 3D rendered assets with warm golden-hour lighting. NOT CSS shapes, NOT photorealistic. The sweet spot where things feel touchable and alive.

- Warm amber palette, saturated but not neon
- Golden hour lighting as default; shadows lean purple/blue, never grey/black
- Rounded forms, subsurface scattering feel
- Safe, curious, gentle mood — everything slightly luminous

**Current state**: Most visuals are CSS gradients + inline SVG (e.g., ArthurBear is an SVG component with expression states). These will progressively migrate to Midjourney-generated WebP assets.

### Characters

- **ArthurBear** (`src/components/ArthurBear.jsx`): The primary mascot. SVG bear cub with expressions: happy, excited, sleepy, curious. Modes: `face` (head only) and `full` (head + body). Equivalent to "Bramble" in the style guide — round bear cub, soft brown fur, golden highlights, amber eyes.
- **Pip the Robin**: Secondary character (storybooks, encouragement). Not yet implemented.
- **Hazel the Hedgehog**: Tertiary character (matching game host). Not yet implemented.

### Colour Tokens

**Current Tailwind tokens** (in `tailwind.config.js`):
- `night: #0f172a` — dark navy background
- `ember: #ef4444` — red
- `navy: #1e3a5f` — deep blue
- `sun: #facc15` — yellow/gold
- `leaf: #22c55e` — green
- `sky: #38bdf8` — cyan
- `candy: #ec4899` — pink

**Warm palette** (CSS vars in `:root` + Tailwind `aw-*` tokens — active on ModePicker + SectionPicker):
```css
--aw-bg-warm: #FFF8F0;    /* Tailwind: bg-aw-warm */
--aw-gold: #F5B041;        /* Tailwind: text-aw-gold, bg-aw-gold */
--aw-amber: #E67E22;       /* Tailwind: bg-aw-amber */
--aw-forest: #6B8E5A;      /* Tailwind: bg-aw-forest */
--aw-sky: #87CEEB;          /* Tailwind: bg-aw-sky */
--aw-wood: #C4A265;         /* Tailwind: bg-aw-wood */
--aw-cream: #FDF5E6;        /* Tailwind: text-aw-cream */
--aw-shadow: rgba(120, 80, 40, 0.15);  /* Tailwind: shadow-aw, shadow-aw-lg */
```

## Section Theme System

Defined in `src/data/sectionThemes.js`. Seven main sections + Disney sub-sections (12 total themes).

Each theme provides:
- `palette`: primary, secondary, accent, bg (Tailwind gradient), cardBg
- `particles`: shapes and colours for particle effects
- `tapSound`: section-specific tap sound ID
- `ambient`: background ambient sound
- `animationVibe`: bouncy | smooth | gentle | painterly | rhythmic

Access via `useSection()` hook from `SectionContext`.

## Navigation Flow

```
/ → ModePicker (Quiet / Noisy / All)
  → /games/:mode → SectionPicker (7 sections)
    → /games/:mode/:section → GameGrid (items for that section)
      → /games/:mode/:section/:gameId → Individual game/story
```

Special routes:
- `/games/:mode/disney` → DisneyHub
- `/games/:mode/:section/inside-out-hub` → Inside Out sub-hub
- `/games/:mode/:section/video/:videoId` → VideoPlayer

## Game Registry

All content lives in `src/data/games.js` — array of objects:
```js
{ id, emoji, title, path, category, bg, cover? }
```
Categories: `games`, `puzzles`, `art`, `books`, `music`, `videos`, `disney-*`

When adding new content: add an entry to games.js, create the component, add a lazy import + Route in App.jsx.

## Coding Conventions

### Component Patterns

- **Functional components only**, no class components
- **Default exports** for page/game components
- **Named exports** for hooks and utilities (e.g., `export function useSound()`)
- **Lazy loading**: Every route-level component is `lazy(() => import(...))` in App.jsx
- **JSDoc comments** on component files describing props
- **Inline SVG** for characters and decorative elements (migrating to WebP assets)

### File Naming

- Components: `PascalCase.jsx` (e.g., `ArthurBear.jsx`, `BubblePop.jsx`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useSound.js`)
- Data files: `camelCase.js` (e.g., `sectionThemes.js`, `games.js`)
- Sub-modules get their own directory: `games/inside-out/`, `games/memory-match/`, `stories/ellie/`
- Audio: `public/audio/{story-id}/page-{n}.mp3`
- Images: `public/images/{story-id}/page-{n}.png`

### Styling

- **Tailwind utility classes** as the primary styling approach
- **Custom keyframes** defined in `src/index.css`, registered in `tailwind.config.js` animation extend
- **No CSS modules**, no styled-components
- Gradients via Tailwind's `from-X to-Y` classes (stored in game registry `bg` field)
- Large tap targets: buttons are typically `w-20 h-20` minimum (44pt+ for child fingers)
- `touch-action: manipulation` set globally to prevent double-tap zoom

### Animation

- **Framer Motion** for component-level animations: page transitions, interactive elements
- **Tailwind keyframes** for CSS animations: entrance effects, particles, celebrations
- **Spring physics** preferred: cubic-bezier(0.34, 1.56, 0.64, 1) is the standard spring curve
- `PageTransition` component wraps route content (variants: default, magical, slide)
- `useCelebration()` hook for full-screen reward overlays with confetti + ArthurBear
- `ParticleBurst` component for per-section particle effects

### Audio

- All audio is **Web Audio API synthesised** — no audio file dependencies for sound effects
- `src/hooks/useSound.js` exports individual functions: `playPop()`, `playBoing()`, `playSuccess()`, `playCelebrate()`, etc.
- Global mute via `setGlobalMute()` — respects Quiet mode from ModePicker
- Section-specific tap sounds: `playSectionTap(section)`
- Instrument sounds: `playPiano()`, `playHarp()`, `playDrum()`, `playXylophone()`
- Sticker sounds: `playStickerSound(soundId)` with 16 variants
- Narration: MP3 files in `public/audio/` played via `useNarration()` hook

### Performance — iPad Constraints

- **GPU memory budget**: Keep under 100MB uncompressed textures per module
  - 1024×1024 RGBA = 4MB GPU memory
  - Max ~25 unique 1024×1024 textures per module
  - iPad Safari kills tabs silently above ~300MB total
- **Image formats**: WebP at 80% quality for production assets (60-70% smaller than PNG)
- **Resolution targets**:
  - Characters/items: 1024×1024 source → serve 512×512 @2x
  - Backgrounds: 2732×2048 (iPad Pro native)
  - UI elements: 256×256 source → serve 128×128 @2x
- **Lazy loading**: Only preload assets for the current module
- **Workbox cache limit**: 8MB per file max

### Content Rules

- **No scary content** — everything safe, curious, gentle
- **No text-heavy UI** — Arthur is pre-literate (~3.5 years old)
- **Large touch targets** — minimum 44pt, prefer 60pt+ for primary actions
- **Forgiving interactions** — no fail states that feel punishing; error sounds are gentle descending tones
- **Celebration on success** — every correct action gets audio + visual feedback
- **Back button always visible** — fixed top-left, 80×80px frosted glass circle

## Animation Libraries (Installed)

- **Rive** (`@rive-app/react-canvas`): For character animation state machines. Wrapper: `src/components/animations/RiveCharacter.jsx`
- **Lottie** (`lottie-react`): For decorative effects. Wrapper: `src/components/animations/LottieEffect.jsx`
- Gold stars celebration Lottie: `public/assets/animations/gold-stars-celebration.json` — wired into `useCelebration()`
- These complement the existing Framer Motion + CSS keyframe system

### Warm Scene Components

- `GoldenHourScene` (`src/components/scenes/GoldenHourScene.jsx`): SVG golden-hour background with amber sky, rolling green hills, fireflies. Used on ModePicker and SectionPicker.
- `NightSkyScene` remains for quiet/night-themed contexts

## Fonts

- **Headings**: Fredoka One (Google Fonts) — `font-heading`
- **Body**: Baloo 2 wght 400/600/800 (Google Fonts) — `font-body`
- Loaded via `<link>` in `index.html`
