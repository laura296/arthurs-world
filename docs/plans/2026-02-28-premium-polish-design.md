# Premium Polish Design: Arthur's World

## Goal
Elevate Arthur's World from "basics are there" to feeling high-quality like Angry Birds. Every interaction should feel satisfying, every screen should have personality, and the app should reward the child at every opportunity.

## Design Decisions
- **No page transitions** between routes (instant navigation, avoids sluggishness)
- **No new dependencies** — pure CSS animations + Web Audio + SVG
- **DALL-E + SVG/CSS mix** — DALL-E for hero images and game cards, SVG/CSS for UI elements, backgrounds, particles
- **Section-adaptive personality** — each section has its own vibe (bouncy Games, dreamy Books, bold Music, calm Art, clean Puzzles)
- **Arthur Bear mascot** — SVG bear cub that appears at key moments for personality and reward

---

## 1. Animation & Juice System

### Spring-physics taps
Replace all `bounce-in` / `ease-in-out` with spring curves:
- Every button: fast scale-down (0.92) then spring overshoot (1.05 -> 1.0)
- CSS `cubic-bezier(0.34, 1.56, 0.64, 1)` for overshoot feel
- Staggered element entrance with spring physics (translate + fade + scale)

### Particle system — `<ParticleBurst>`
Lightweight component emitting 8-15 SVG shapes from a point:
- Shapes: stars, circles, hearts (vary by section)
- Triggered on: button taps, game completions, sticker placements, discoveries
- Section-coloured particles
- CSS animations only, auto-cleanup after animation ends

### Tap ripple
Every interactive element gets a radial ripple on touch:
- CSS `::after` pseudo-element with `pointer-events: none`
- Radial gradient that expands and fades over 300ms

---

## 2. Per-Section Visual Identity

### Section themes

| Section   | Background              | Palette                    | Animation Vibe        | Ambient Sound              |
|-----------|-------------------------|----------------------------|-----------------------|----------------------------|
| Games     | Sky, puffy clouds, hills (SVG) | Sky blue, grass green, yellow | Bouncy, springy      | Birds chirping, breeze     |
| Puzzles   | Geometric pattern (CSS)  | Teal, coral, lavender      | Smooth, satisfying    | Gentle wind, sparse chimes |
| Art       | Paint splashes, easel (SVG) | Rainbow, warm pinks        | Painterly, expressive | Soft rain patter           |
| Books     | Cozy library, lamp (SVG) | Amber, warm brown, cream   | Gentle float, fade    | Warm hum, fireplace crackle |
| Music     | Stage, spotlights (SVG)  | Purple, gold, deep red     | Rhythmic, pulsing     | Faint crowd murmur, reverb |

### Background animation by vibe
- **Games & Music** (energetic): animated clouds drifting, spotlights sweeping
- **Books & Art** (calm): static or very subtle (lamp glow flicker, slow paint drip)
- **Puzzles** (focus): subtle geometric pattern rotation

### Card illustrations
- SectionPicker: 6 DALL-E hero illustrations (Bluey style, 512x512)
- GameGrid: ~8 DALL-E game card illustrations (each game gets a cover)
- Books: already have page-1.png covers
- All cards use frosted glass title bar at bottom (extend existing book cover pattern)

### UI elements
- BackButton: SVG arrow icon, themed to section palette
- Loading screen: Arthur Bear bouncing/spinning (replaces bouncing star emoji)

---

## 3. Sound Design System

### Enriched UI sounds
- `playTap()` — layered sine + triangle with micro-reverb, pitch randomisation (+/- 20Hz)
- `playNavigate()` — NEW: soft whoosh (filtered noise sweep)
- `playCelebrate()` — NEW: ascending arpeggio with harmonics + shimmer, 1.5s
- `playError()` — NEW: gentle descending two-note (non-punishing)

### Section-specific tap sounds
- Games: bouncy boing (enriched current)
- Books: soft page-turn (filtered noise + gentle tone)
- Music: percussive tick (existing instrument system)
- Art: paint splat (noise burst + low-pass)
- Puzzles: satisfying click (sharp square wave + resonance)

### Ambient backgrounds (all synthesised, no audio files)
- Fade in/out over 1s when entering/leaving section
- Very subtle gain (~0.03-0.05)
- Loop seamlessly using oscillator/noise nodes
- Respect `globalMuted`

### Ambient details
- Games: birds (filtered oscillators, random timing), breeze (low-pass noise)
- Books: warm hum, occasional crackle, gentle clock tick
- Music: faint crowd murmur, reverb ambience
- Art: soft rain patter, occasional wind
- Puzzles: gentle wind, sparse chime tones at random long intervals

---

## 4. Arthur Bear Mascot

### Design
SVG bear cub: round head, small round ears, dot eyes, button nose, rosy cheeks, warm brown fur. Simple enough to animate with CSS transforms.

### Expressions (SVG swaps)
- Happy (default)
- Excited (celebrations — wider eyes, open mouth)
- Sleepy (quiet mode — half-closed eyes)
- Curious (puzzles — tilted head)

### Appearance modes
1. **Peek** — just face, pops in from edge/corner for 0.8s (mini-wins)
2. **Dance** — full body, bounces and waves (big wins / game completion)
3. **Idle** — gentle float/sway in home screen title

### Where Arthur appears
- Home screen: peeks up from bottom of title, waves on load
- Mini-wins: face pops in corner with expression (0.8s)
- Big wins: full celebration overlay with dancing Arthur
- Loading: bouncing/spinning Arthur
- Back button: tiny Arthur face replaces plain arrow

---

## 5. Celebration System

### Mini-wins (during gameplay, ~0.8s)
- Memory Match pair: star burst + Arthur peek (happy face, corner)
- Bubble Pop: sparkle particles + Arthur face in bubble's spot (wide eyes)
- Feed Animals: animal wiggle + Arthur peek (thumbs-up expression)
- Pop Critters: spin + confetti puff + Arthur peek
- Sticker placed: stars radiate from drop point + ding
- Music Pad key: pad glows with radiating rings

### Big wins (game completion, 3-4s)
1. Screen slightly dims (overlay)
2. Arthur Bear bounces in from below (dance mode)
3. Confetti rain (section-coloured, 30-50 rectangles with rotation)
4. `playCelebrate()` jingle
5. "Well done!" / "Amazing!" text bounces in
6. Stars rain behind Arthur
7. Auto-dismiss after 3-4s, tap to dismiss early

### Completion triggers
- Bubble Pop: all bubbles popped in round
- Memory Match: all pairs found
- Pop Critters: all critters popped
- Feed Animals: all animals fed
- Storybooks: reaching last page
- Colouring: optional "Show Arthur!" button (open-ended)
- Build-a-Scene: existing animate mode
- Music Pad: none (open-ended)

---

## 6. DALL-E Asset Generation

### Images needed (~15 total)
- 6 SectionPicker hero cards (512x512)
- ~8 GameGrid card illustrations (512x512)
- 1 Arthur Bear reference (for SVG recreation)

### Art style
Same Bluey-style prompt prefix as Build-a-Scene stickers.

### Section card subjects
- Games: colourful playground (slides, swings, balls)
- Puzzles: geometric shapes, puzzle pieces
- Art: easel with paintbrushes, splashy colours
- Books: cozy reading nook, bookshelf, warm lamp
- Music: colourful stage with instruments
- Videos: TV screen with fun characters

### Game card subjects
- Bubble Pop: underwater bubbles scene
- Feed Animals: happy farm animals at feeding time
- Pop Critters: cute critters popping out of holes
- Memory Match: face-down cards with stars
- Colouring: blank canvas with rainbow palette
- Music Pad: colourful piano keys / instruments
- Build-a-Scene: stickers being placed on a scene

---

## 7. Game Chrome

### Section-coloured headers
Each game screen gets a thin header bar in its section's primary colour. Contains:
- Back button (Arthur face or section-coloured arrow)
- Game title in `font-heading`
- Section colour as accent

### Themed interaction feedback
All games inherit their section's:
- Particle colours
- Tap sound variant
- Celebration style

---

## Architecture

### New components
- `src/components/ParticleBurst.jsx` — reusable particle emitter
- `src/components/CelebrationOverlay.jsx` — full-screen celebration with Arthur
- `src/components/ArthurBear.jsx` — SVG mascot with expression states
- `src/components/ArthurPeek.jsx` — mini-win Arthur face popup
- `src/components/TapRipple.jsx` — ripple effect wrapper (or CSS utility)
- `src/components/backgrounds/` — per-section SVG backgrounds (5 files)

### Modified files
- `src/hooks/useSound.js` — enriched sounds, new functions, ambient system
- `src/pages/ModePicker.jsx` — Arthur Bear in title, spring animations
- `src/pages/SectionPicker.jsx` — DALL-E card images, section-themed
- `src/pages/GameGrid.jsx` — DALL-E game cards, section background
- `src/components/BackButton.jsx` — SVG icon, section theming
- `src/App.jsx` — section context provider, loading screen
- `src/index.css` — spring keyframes, ripple utility, new animations
- `tailwind.config.js` — section colour palettes, new animation curves
- All game files — add celebration triggers and section theming

### New context
- `SectionContext` — provides current section's theme (palette, sounds, particles) to all children
- Read from URL params, no extra state management needed

### No new dependencies
Everything built with: React 18, Tailwind CSS, Web Audio API, SVG, CSS animations.
