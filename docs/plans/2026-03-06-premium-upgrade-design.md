# Arthur's World — Premium App Store Upgrade Design

## Goal
Bring Arthur's World from 7.5/10 to app-store-ready quality by fixing asset gaps, removing runtime API dependencies, adding resilience, and polishing the PWA presentation.

## Workstreams

### 1. Ellie Story: Pre-Generated Static Assets
Generate all 25 images via OpenAI gpt-image-1 using a one-time Node script:
- 1 character sheet
- 4 scene illustrations (1536x1024)
- 4 game backgrounds (1536x1024)
- 8 animal sprites (white bg, for compositing)
- 8 tiny folk sprites (white bg, for compositing)

Save to `public/images/ellie/`. Rewrite `LoadingScreen.jsx` to preload static images (no API calls). Remove `hasApiKey()` gate. Keep `imageCache.js` and `imageGen.js` for future use but make Ellie fully static.

### 2. Game Card Cover Images (7 missing)
Generate illustrated thumbnails (512x512) for:
- bubble-pop, feed-animals, pop-critters, build-a-scene
- memory-match, colouring, music-pad

Save to `public/images/cards/`. The GameGrid already references these paths.

### 3. Premium PWA App Icon
Replace placeholder star SVGs with Arthur Bear face icon:
- `icon-192.svg` — Bear face on night-blue rounded-rect background
- `icon-512.svg` — Same, larger
- `apple-touch-icon.png` — 180x180 raster for iOS home screen
- Maskable variant for Android adaptive icons

### 4. React Error Boundaries
Create `GameErrorBoundary` component:
- Catches render errors in game/story components
- Shows Arthur Bear (sad expression) + friendly message
- "Try Again" button navigates back to game grid
- Wrap each lazy-loaded route in App.jsx

### 5. PWA & Meta Polish
- Add `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style` meta tags
- Add apple-touch-icon link in index.html
- Update manifest description to be more descriptive
- Add maskable icon to manifest
- Ensure theme_color consistency across manifest + meta tags

## Out of Scope
- Accessibility (ARIA labels) — separate effort
- Performance monitoring/telemetry
- New games or stories
