# Ellie & the Tiny Folk — Design Document

**Date:** 2026-03-04
**Status:** Approved
**Spec:** ellie-spec-v2.docx

## Overview

Interactive storybook game for Arthur (age 2). Four chapters, each with narration + a tap-based mini-game. Built as a standalone module in Arthur's World. All illustrations generated at runtime via gpt-image-1 with character consistency via a reference sheet.

## Architecture Decision

**Standalone module** — not extending the existing StoryBook engine. Rationale: Ellie's story-then-game flow is fundamentally different from the page-flipping book pattern. Mini-games need custom game loops with progress bars, spawning entities, and full-screen tap regions. A standalone module reuses shared primitives (useCelebration, useParticleBurst, sound functions) without coupling to StoryBook's page engine.

## File Structure

```
src/
  stories/
    ellie/
      EllieStorybook.jsx      # Main orchestrator — screen flow state machine
      TitleScreen.jsx          # Title + Play button
      StoryScreen.jsx          # Narration — full-bleed AI image + text band
      GameScreen.jsx           # Wrapper — progress bar + game slot
      CelebrationScreen.jsx    # Final — folk parade, confetti, replay
      LoadingScreen.jsx        # "Drawing picture 1 of 25..."
      games/
        FindTheSpeck.jsx       # Game 1 — tap floating golden speck (6 taps)
        ShooAnimals.jsx        # Game 2 — tap animals drifting in (8 animals)
        NoiseMeter.jsx         # Game 3 — tap anywhere, fill meter (28 taps)
        PopTinyFolk.jsx        # Game 4 — tap 8 scattered folk characters
      storyData.js             # Narration text, image keys, prompts, chapter structure
  lib/
    imageGen.js                # OpenAI gpt-image-1 API calls
    imageCache.js              # IndexedDB read/write for cached PNGs
```

## Integration

- **Route:** `/games/:mode/:section/ellie-tiny-folk`
- **Game registry:** Added to `src/data/games.js` under `category: 'books'`
  - `{ id: 'ellie-tiny-folk', emoji: '🐘', title: "Ellie's Story", path: 'ellie-tiny-folk', category: 'books', bg: 'from-purple-300 to-lavender-500' }`
- **App.jsx:** New lazy-loaded route for EllieStorybook

## Screen Flow

```
LOADING → TITLE → STORY_1 → GAME_1 → STORY_2 → GAME_2 → STORY_3 → GAME_3 → STORY_4 → GAME_4 → CELEBRATION → TITLE
```

State machine: single `screenIndex` into a SCREENS array:
```js
const SCREENS = [
  { type: 'story', chapter: 0 },  // Ellie Hears Something
  { type: 'game',  chapter: 0 },  // Find the Speck
  { type: 'story', chapter: 1 },  // Ellie Protects the Flower
  { type: 'game',  chapter: 1 },  // Shoo the Animals
  { type: 'story', chapter: 2 },  // Make Some Noise!
  { type: 'game',  chapter: 2 },  // Noise Meter
  { type: 'story', chapter: 3 },  // They Hear Us!
  { type: 'game',  chapter: 3 },  // Pop the Tiny Folk
];
```

**Transitions:**
- Story → Game: Parent taps "Play" button (bottom-right of narration screen)
- Game → Next Story: Automatic on game completion (confetti + 2s delay)
- Game 4 → Celebration: Automatic with fanfare
- Celebration → Title: Replay button

## Image Generation

### API Key
Environment variable: `VITE_OPENAI_API_KEY`, baked in at build time.

### Asset List (~25 images total)

| Batch | Count | Purpose |
|-------|-------|---------|
| Character sheet | 1 | Ellie reference anchor |
| Scene images | 4 | Narration backgrounds (scene1-4.png) |
| Game backgrounds | 4 | Game backgrounds (game1-4-bg.png) |
| Animal sprites | 8 | Kangaroo, eagle, monkey, parrot, snake, lizard, frog, toucan |
| Tiny Folk sprites | 8 | Wizard, queen, baby, chef, musician, knight, painter, dancer |

### Generation Flow
1. Generate character sheet with CHARACTER_SHEET_PROMPT
2. For each scene/background, call gpt-image-1 with character sheet as reference + scene prompt
3. For each sprite, call gpt-image-1 with style anchor + "single character on clean white background"
4. Store all as blobs in IndexedDB keyed by `ellie-v{N}-{imageName}`

### Character Sheet Prompt
(From spec Section 3.2 — used exactly as written)

### Scene Prompt Structure
Each scene prompt = [Ellie anchor] + [scene context] + [style anchor]
(Full prompts in spec Section 4)

### Sprite Prompts
Each sprite follows: "[Character description]. Single character on a clean white background. No other elements. [style anchor]"

### Caching (IndexedDB)
- Database: `arthur-images`, store: `ellie-images`
- API: `getImage(key)`, `putImage(key, blob)`, `hasAllImages(version)`, `clearVersion(version)`
- Version-keyed: bumping version clears cache and triggers regeneration
- First load: ~2-3 min. Shows Ellie character sheet once generated. Progress: "Drawing picture N of 25..."

### Error Handling
- Retry once on API failure
- Friendly message: "Couldn't draw the pictures right now" + retry button
- Partial progress preserved — resume from last successful image

### Cost
~$1.50-2.50 per full generation. Free on subsequent loads.

## Mini-Game Designs

### Game 1: Find the Speck
- **Background:** game1-bg.png (AI-generated open sky)
- **Mechanic:** Glowing golden orb (CSS radial gradient + pulse animation) floats on screen. Tap → jumps to random position + playPop() + particle burst. 6 taps fills progress bar.
- **Visual:** Golden glow (box-shadow), gentle float animation (translateY keyframe)

### Game 2: Shoo the Animals
- **Background:** game2-bg.png (jungle clearing)
- **Characters:** 8 AI-generated animal sprites
- **Mechanic:** Animals drift in from random screen edges (CSS animation). Tap → spin + fly off + playWhoosh(). 8 animals spawn sequentially (~1.5s intervals). Progress dots fill.
- **Spawn logic:** setInterval pushes new animal to state. Random start edge + drift direction.

### Game 3: Noise Meter
- **Background:** game3-bg.png (night sky)
- **Mechanic:** Full-screen tap zone. Each tap → sound wave ripple from tap point + rising tone (400Hz→900Hz). Vertical meter fills. 28 taps.
- **Visual:** Meter div with animated height. Visual milestones at thresholds.

### Game 4: Pop the Tiny Folk
- **Background:** game4-bg.png (giant flower)
- **Characters:** 8 AI-generated Tiny Folk sprites
- **Mechanic:** 8 folk scattered at random positions. Tap → star burst + character spins away + playSparkle(). 8 popped = done.
- **Visual:** Gentle bob animation, glow ring underneath each character.

## Audio

All synthesised via Web Audio API (existing useSound.js):

| Event | Sound | Implementation |
|-------|-------|----------------|
| Tap (games) | Rising sine, pitch scales with progress | playTone(freq) — freq = 400 + (progress * 500) |
| Animal shooed | Low sawtooth buzz | New playShoo() — 200Hz sawtooth, 0.2s |
| Noise meter tap | Random low percussive bang | New playBang() — 120-200Hz sawtooth, short |
| Game complete | 4-note ascending arpeggio | Reuse playSuccess() |
| Final celebration | 7-note fanfare | Reuse playFanfare() |
| Narration | Web Speech API | Reuse speakFallback() — en-GB, rate 0.85 |

## Shared Primitives Reused

- `useCelebration()` — confetti + message on game/story completion
- `useParticleBurst()` — tap feedback particles
- `BackButton` — navigation back to books grid
- `playPageTurn()`, `playSuccess()`, `playFanfare()`, `playCelebrate()`
- Web Speech API narration (speakFallback pattern)

## Design Principles (from spec)

- No failure states — every tap does something
- No wrong answers, no timers
- Parent reads aloud, Arthur taps
- Character consistency via gpt-image-1 reference sheet
- Seuss-inspired style — original characters, not Seuss IP
