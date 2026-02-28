# Pop Critters Garden Redesign

## Summary

Transform the existing PopCritters game from a basic emoji whack-a-mole into a beautiful garden-themed game where woodland creatures pop out of dirt holes. New GardenScene SVG background, hand-drawn SVG animal illustrations, CSS-animated rise/sink mechanics, and 3 difficulty levels that combine speed-based timing with character-based variety.

## Current State (problems)

PopCritters is a minimal whack-a-mole game:
- **Cheap emoji animals** on brown circles in a grid — no illustration quality
- No scene background (just a brown gradient)
- Spawns every 1.2s, auto-hides after 2.5s (too fast for a toddler)
- No difficulty selection
- No rise/sink animation (animals just appear/disappear)

## Art Direction: NO EMOJI

All animals are **hand-illustrated SVG components** in the project's storybook style (soft colours, rounded shapes, gentle outlines, rosy cheeks — like the bees/butterfly in MeadowScene). Each animal is a detailed SVG `<g>` group with:
- Soft fur/skin gradients (radialGradient, linearGradient)
- Big expressive eyes with highlights
- Rounded, friendly proportions
- Subtle stroke outlines (2-3px, warm dark tone)
- Animated details (blinking eyes, twitching whiskers, wiggling ears)

This matches the quality bar of UnderwaterScene fish, MeadowScene bees, and the storybook overhaul character style. Zero emoji anywhere in the game.

## Design

### Theme: Woodland Garden

Animals emerge from dirt burrow holes in a lush English-style garden. The visual style matches the project's existing storybook illustration approach (SVG scenes like MeadowScene, UnderwaterScene, etc.).

### GardenScene Background (new SVG component)

Layers from back to front:
1. **Sky** - Warm blue gradient with puffy drifting clouds
2. **Sun** - Top-right, cheerful with animated rays
3. **Far background** - Rolling green hills, distant garden shed silhouette, wooden fence line
4. **Midground** - Flower beds (sunflowers, tulips) on left and right sides, winding garden path
5. **Foreground grass** - Rich green with grass tufts and wildflowers
6. **Dirt holes** - 9 oval holes arranged in a 3x3 grid, integrated into the grass with dirt mound rims
7. **Ambient details** - Bees, a butterfly, small birds (animated like MeadowScene)

### Woodland Creatures (6 SVG animal components)

| Animal     | Difficulty | Visible Time | Behavior                          | Points |
|------------|-----------|-------------|-----------------------------------|--------|
| Mole       | Easy      | 4-5s        | Peeks up slowly, blinks           | 1      |
| Hedgehog   | Easy      | 4-5s        | Curls slightly when tapped        | 1      |
| Rabbit     | Medium    | 2.5-3s      | Ears appear first, then head      | 1      |
| Mouse      | Medium    | 2.5-3s      | Quick head, whiskers twitch       | 1      |
| Fox        | Hard      | 1.5-2s      | Can move to adjacent hole         | 2      |
| Owl        | Hard      | 1.5-2s      | Quick peek from tree stump hole   | 1      |

Each animal is a hand-illustrated SVG group (see Art Direction above) with:
- Rise animation via CSS `transform: translateY()` transition
- Unique idle animation (mole blinks, rabbit ears wiggle, mouse whiskers twitch, hedgehog quills ruffle, fox tail swishes, owl head tilts)
- Tapped reaction: animal does a happy squish animation + sinks back into hole. Use `ParticleBurst` + `ArthurPeek` from Premium Polish design when available.

### Difficulty System

Three levels presented as garden sign buttons before the game starts:

| Setting          | Gentle Garden | Busy Garden  | Wild Garden  |
|------------------|--------------|-------------|-------------|
| Animals          | mole, hedgehog | + rabbit, mouse | + fox, owl |
| Visible time     | 4-5s         | 2.5-3s      | 1.5-2s      |
| Spawn interval   | 2.5s         | 1.8s        | 1.2s        |
| Max visible      | 2            | 3           | 4           |
| Rise speed       | 0.6s         | 0.4s        | 0.3s        |
| Fox moves?       | N/A          | N/A         | Yes         |

### Game Flow

```
[Difficulty Picker] -> [Endless game with score] -> (BackButton to exit)
```

- No timer - endless session (toddler-friendly, matches rest of app)
- Score counter top-right (existing pattern: star badge)
- Every 5 points plays success sound
- Reuses existing sounds: playPop, playBoing, playSuccess

### Component Architecture

```
PopCritters.jsx (main game - rewritten)
+-- GardenScene.jsx (new SVG background with holes)
+-- DifficultyPicker.jsx (new - garden sign buttons)
+-- AnimalSprite.jsx (new - renders correct animal SVG with animations)
+-- ScoreBadge (existing pattern - top-right star counter)
+-- BackButton (existing component)
```

### Key Implementation Details

- Holes positioned with CSS `absolute` + percentage-based coordinates to overlay on the SVG
- Animals use `transition: transform 0.4s ease-out` for smooth rise/sink
- Each hole has a dirt "lip" SVG layer rendered ON TOP of the animal to create the illusion of emerging from the ground (z-index layering)
- Fox movement: when fox is visible, it can slide to an adjacent empty hole before hiding
- `clipPath` or overflow:hidden on each hole container to mask the animal below ground level

### Approach Chosen

Full SVG Scene + CSS Animations (Approach 1). This matches the project's storybook style, keeps everything in React/SVG, and uses CSS transitions for smooth animation without requestAnimationFrame.

### Files to Create/Modify

- `src/games/PopCritters.jsx` - rewrite game logic with difficulty system
- `src/components/scenes/GardenScene.jsx` - new garden background SVG
- `src/games/pop-critters/DifficultyPicker.jsx` - difficulty selection screen
- `src/games/pop-critters/AnimalSprite.jsx` - animal SVG renderer with animations
- `src/games/pop-critters/animals/` - individual animal SVG components (Mole, Hedgehog, Rabbit, Mouse, Fox, Owl)

## Compatibility with Other Designs

### Premium Polish (2026-02-28)
- **Mini-win celebrations**: Our tap reactions should use `ParticleBurst` + `ArthurPeek` from Premium Polish (when built) rather than custom effects
- **Completion trigger**: Premium Polish assumes "all critters popped" ends a round. Our game is now endless — use milestone celebrations at every 10 points instead (confetti burst + Arthur dance)
- **Section palette**: Garden colours (greens, browns, earth tones) fit within the Games section palette (sky blue, grass green, yellow)
- **Sounds**: Use `playCelebrate()` from Premium Polish for milestone moments when available

### Storybook Overhaul, Memory Match
- No overlap. Separate games/components. No shared files.
