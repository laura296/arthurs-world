# Build-a-Scene — Technical Design

## Overview

A felt-board sticker placement activity for Arthur's World. Arthur picks a scene (Space, Sea, Jungle, Farm, Dinosaurs, Theme Park), drags stickers onto it, then taps "Make it Magic!" to animate everything. Bluey-style DALL-E 3 art throughout.

## Decisions

- **Architecture**: Single-page component with internal state (Option A)
- **Assets**: All DALL-E 3 generated (216 stickers + 6 backgrounds)
- **Parent view**: Deferred to v2
- **Animation**: Full per-sticker unique animations + scene-level effects
- **Secret stickers**: 6 per scene (36 total), only via Surprise Me button

## File Structure

```
src/games/BuildAScene.jsx              — Main component (orchestrator)
src/games/build-a-scene/
  ScenePicker.jsx                      — 6 scene cards (2x3 grid)
  StickerTray.jsx                      — Bottom drawer: 12 stickers + Surprise Me + reshuffle
  SceneCanvas.jsx                      — Full-screen drag/drop placement area
  AnimateMode.jsx                      — Animation controller + sparkle transition
  sceneData.js                         — Scene configs, sticker definitions, animation mappings

scripts/generate-scene-assets.mjs      — DALL-E 3 asset generation script

public/images/scenes/{scene}/bg.png              — 6 backgrounds (2048x1536)
public/images/scenes/{scene}/stickers/{id}.png   — 36 stickers per scene (400x400, transparent bg)
public/audio/scenes/                             — ElevenLabs voice lines + ambient loops
```

## State Shape

```javascript
{
  currentScene: null | 'space' | 'sea' | 'jungle' | 'farm' | 'dinosaurs' | 'theme-park',
  trayStickers: [/* 12 sticker objects — current tray selection */],
  placedStickers: [{
    uid: 'uuid',            // unique instance ID
    stickerId: 'rocket',    // references sceneData definition
    x: 45, y: 30,           // percentage position (0-100)
    zIndex: 1,              // layering order
  }],
  undoStack: [/* last 5 placements, for undo */],
  isAnimating: false,
  discoveredSecrets: Set([/* persisted to localStorage */]),
}
```

## Sticker Tiers (per scene)

| Tier     | Count | How obtained                                    |
|----------|-------|-------------------------------------------------|
| Hero     | 6     | Weighted to always appear in tray (2+ guaranteed) |
| Standard | 24    | Random fill to reach 12 total in tray           |
| Secret   | 6     | Only via Surprise Me button (1-in-4 chance)     |
| **Total**| **36**| **216 stickers across 6 scenes**                |

Tray selection rules:
- Always include 2+ hero stickers
- Always include 5+ animals/living characters
- Fill remaining randomly from standard pool
- Result: 12 stickers per tray load

## Scene Picker

- 2x3 grid of chunky rounded cards (matches SectionPicker style)
- Each card shows mini preview of DALL-E background
- Voice line: "Pick your world, Arthur!"
- Tap → playBoing → fade transition to canvas

## Canvas & Placement

- Full-screen DALL-E background (object-cover)
- Tap tray sticker → appears center-screen → Arthur drags to position
- Percentage-based positioning (responsive)
- Soft magnetic snap: within 15px of another sticker's edge → nudge to sit cleanly
- Drop on top of another → offset slightly so both visible
- Last placed = highest z-index
- Long press (500ms) on placed sticker → remove with peel animation + playPoof
- Undo button: top corner, removes last placed, up to 5 levels
- No pinch/zoom/rotate — position only

## Animate Mode

### Trigger
Big glowing "Make it Magic!" button (wand icon, pulsing) in corner.

### Sequence
1. Drumroll sound (1-2s) + sparkle dust sweep across screen
2. Sticker tray slides away, undo hides
3. Every placed sticker starts its unique looping CSS animation
4. Scene background effects activate
5. Tapping individual stickers plays their sound
6. Tap anywhere or "Stop" button → instant return to edit mode

### Animation Types (CSS keyframes)
- `walk` — slow left-right drift + slight bob
- `float` — gentle vertical hover
- `swim` — horizontal wiggle with slight rotation
- `fly` — gentle arc motion
- `bounce` — vertical hop
- `wobble` — tilt side to side
- `spin` — slow rotation
- `pulse` — scale breathe
- `scuttle` — quick side-to-side (crabs)
- `flap` — vertical bob with faster rhythm (birds)

### Scene-Level Effects
- Space: stars twinkle (opacity pulse overlay)
- Sea: slow wave distortion + bubble particles
- Jungle: leaf sway overlay + floating dust
- Farm: clouds drift across top
- Dinosaurs: volcano smoke + sky flicker
- Theme Park: lights twinkle + bunting sway

### Per-Sticker Sounds
- Farm animals → animal sounds (Web Audio synthesis)
- Sea creatures → bubble/splash
- Space → whoosh/bleep
- Jungle → roar/squawk
- Dinosaurs → roar (scaled by size)
- Theme Park → pop/crunch/sting
- Fallback → playPop

## Surprise Me

- Pulls from remaining pool (no duplicates with current tray)
- 1-in-4 chance of secret sticker
- Secret reveal: gold star badge, longer animation, special sound, voice line "Ooooh, a secret one!"
- Regular reveal: normal placement with playSparkle

## Persistence

- **Auto-save** to localStorage on scene exit/app close
- On re-open: "Keep building?" (big YES) or "Start fresh?"
- **Secret sticker tracking**: discoveredSecrets persisted to localStorage
- **Save button**: Capture canvas as PNG screenshot → download to device

## DALL-E 3 Asset Generation

### Master Style Prompt
"Bluey Australian animated TV show art style, bold black outlines, bright flat colours, simple cheerful shapes, clean white background, chunky friendly character design, no gradients, no shading, 2D cartoon illustration, children's TV aesthetic, expressive and warm"

### Backgrounds
- Size: 2048x1536 (iPad landscape)
- Prompt: `[Master style], full scene background of [theme], felt fabric texture overlay, no characters or animals, scene only, wide establishing shot`

### Stickers
- Size: 400x400 with transparent background (DALL-E 3 doesn't do true transparency — will need post-processing to remove white bg)
- Prompt: `[Master style], single [object/animal], centred, transparent background, no scene behind it, facing slightly right, friendly expression`
- Generate all stickers per scene in one batch for consistency

## Sounds to Add

- `playThud()` — soft felt-on-felt placement sound
- `playDrumroll()` — 1-2s anticipation build
- Per-sticker sounds — Web Audio synthesis or pre-generated files
- Ambient scene loops — sourced royalty-free or generated
- ElevenLabs voice lines: scene picker, first sticker, magic moment, post-animation

## Route

`/games/:mode/:section/build-a-scene` — registered in App.jsx, added to games.js as category: 'games'
