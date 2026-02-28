# Arthur's Memory Match — Technical Design

Based on Laura Billyard's design document (2026-02-27).

## Decisions

- **Audio:** Web Audio API synthesis only. Architecture ready for ElevenLabs voice lines later.
- **Art:** Reuse BuildAScene sticker PNGs as card fronts. Card backs are CSS-only patterns. Board backgrounds reuse existing scene `bg.png`. Sidekick characters use existing stickers.
- **Persistence:** localStorage for difficulty progression per theme and secret card discoveries. No parent view UI yet — auto-progression only.
- **Architecture:** Orchestrator pattern matching BuildAScene — one top-level component with sub-components in `memory-match/`.

## Component Architecture

```
src/games/MemoryMatch.jsx              -> Orchestrator (state, phase transitions)
src/games/memory-match/
  cardData.js                          -> 20 characters x 6 themes + 3 secrets each
  ThemePicker.jsx                      -> 2x3 grid of themed board cards
  CardParade.jsx                       -> Pre-game character introduction
  GameBoard.jsx                        -> Card grid + peek button + sidekick area
  Card.jsx                             -> Individual card with 3D flip animation
  Sidekick.jsx                         -> Animated board companion
  WinCelebration.jsx                   -> Board-complete celebration overlay
```

### Game Flow

```
ThemePicker -> CardParade -> GameBoard -> WinCelebration -> ThemePicker or replay
```

## State Shape

```js
// Orchestrator state
{
  phase: 'pick-theme' | 'parade' | 'playing' | 'won',
  theme: null | 'space' | 'sea' | 'jungle' | 'farm' | 'dinosaurs' | 'theme-park',
  difficulty: { gridCols, gridRows, pairs },  // derived from saved level
  cards: [{ id, characterId, flipped, matched, isSecret }],
  selected: [],           // 0-2 card IDs currently face-up
  locked: false,          // prevents taps during flip-back animation
  peekActive: false,      // peek mode showing all cards
  matchCount: 0,          // matches in current game
  flipCount: 0,           // total flips in current game
}
```

### localStorage Keys

```js
// Progression per theme
'memory-match-progress': {
  space: { level: 'tiny', completions: 3 },
  sea: { level: 'little', completions: 12 },
  jungle: { level: 'tiny', completions: 0 },
  farm: { level: 'growing', completions: 15 },
  dinosaurs: { level: 'tiny', completions: 1 },
  'theme-park': { level: 'tiny', completions: 0 }
}

// Discovered secret cards
'memory-match-secrets': {
  space: ['space-cat-helmet', 'alien-riding-rocket'],
  sea: [],
  // ...
}
```

## Difficulty Progression

| Level | Grid | Pairs | Cards | Unlock After |
|-------|------|-------|-------|-------------|
| Tiny | 2x2 | 2 | 4 | Default |
| Little | 2x3 | 3 | 6 | 5 completions |
| Growing | 3x4 | 6 | 12 | 10 completions |
| Big | 4x4 | 8 | 16 | 15 completions |
| Champion | 4x5 | 10 | 20 | 20 completions |

Progress tracked per theme independently. Level auto-advances when threshold is met.

## Asset Mapping

### Card Fronts (reuse existing sticker PNGs)

Each theme maps Laura's 20 characters to existing sticker filenames:

**Space:** rocket, astronaut, alien, ufo, moon, earth, saturn, comet, space-dog, robot, shooting-star, satellite, space-cat-helmet (secret reused as regular), baby-alien, meteor, sun, lunar-lander, spacewalk-astronaut, telescope, space-station

**Sea:** clownfish, great-white (shark), octopus, jellyfish, seahorse, blue-whale (whale), sea-turtle, crab, lobster, starfish, pufferfish, dolphin, narwhal, mermaid, diver, submarine, clam-pearl (clam), anglerfish, manta-ray, (penguin -> substitute seahorse-bow-tie or skip)

**Jungle:** lion, tiger, elephant, monkey, parrot, toucan, frog, chameleon, snake, crocodile, hippo, giraffe, sloth, flamingo, lemur, butterfly, explorer, gorilla, macaw, firefly

**Farm:** cow, pig, sheep, horse, chicken, duck, sheepdog (dog), barn-cat (cat), goat, rabbit, donkey, rooster, tractor, scarecrow, farmer-male (farmer), windmill, barn-owl, hedgehog, fox, chick

**Dinosaurs:** t-rex, triceratops, brachiosaurus, stegosaurus, pterodactyl, ankylosaurus, diplodocus, velociraptor, spinosaurus, baby-t-rex, dino-egg-unhatched (dino egg), caveman, mammoth, sabre-tooth, giant-dragonfly (dragonfly), fossil-rock (fossil), meteor-incoming (meteor), baby-dino-hatching (baby dino), pachycephalosaurus, dino-nest

**Theme Park:** balloon-bunch (balloon), candy-floss, ice-cream-cone (ice cream), carousel-horse, clown, magician, popcorn-box (popcorn), bumper-car, goldfish-bag, teddy-bear-prize (teddy bear), juggler, acrobat, roller-coaster-car, ferris-wheel, confetti-cannon, toffee-apple, rubber-duck, strongman-bell, party-hat, firework-burst (firework)

### Secret Cards (3 per theme, existing stickers)

| Theme | Secret 1 | Secret 2 | Secret 3 |
|-------|----------|----------|----------|
| Space | space-cat-helmet | alien-riding-rocket | astronaut-thumbs-up |
| Sea | narwhal-sunglasses | baby-octopus-teacup | mermaid-waving |
| Jungle | sloth-hammock | frog-umbrella | parrot-party-hat |
| Farm | pig-mud-bath | sheep-jumper | cow-flowers |
| Dinosaurs | caveman-riding-dino | triceratops-bow-tie | baby-t-rex-egg |
| Theme Park | clown-unicycle | magician-rabbit | bear-winning-goldfish |

### Card Backs (CSS-only patterns)

| Theme | Pattern | Colors |
|-------|---------|--------|
| Space | Dot constellation pattern via radial-gradient | Navy + white dots |
| Sea | Wave pattern via repeating-linear-gradient | Ocean blue + shells |
| Jungle | Leaf/chevron pattern | Deep green |
| Farm | Gingham check via linear-gradient | Warm cream + red |
| Dinosaurs | Fossil bone print dots | Earthy amber |
| Theme Park | Vertical stripes + confetti dots | Red/white + colored dots |

### Board Backgrounds

Reuse `public/images/scenes/{theme}/bg.png` (2048x1536 DALL-E 3 backgrounds).

### Sidekick Characters (existing stickers)

| Theme | Sidekick | Sticker File |
|-------|----------|-------------|
| Space | Friendly robot | robot.png |
| Sea | Little crab | crab.png |
| Jungle | Small monkey | monkey.png |
| Farm | Baby chick | chick.png |
| Dinosaurs | Baby T-Rex | baby-t-rex.png |
| Theme Park | Friendly clown | clown.png |

## Card Parade

After theme selection, before dealing cards:

1. Board background visible behind
2. Each selected character bounces in from right (parade-enter animation)
3. Pauses center-screen for 1.5s, plays `playStickerSound(characterId)`
4. Tapping the character replays sound + scale bounce
5. Exits to left (parade-exit animation)
6. Only shows characters selected for this session (N = pairs count)
7. Small skip button in corner
8. Ends with cards dealing onto the board

## Peek Mode

- Eye icon button, always visible in corner
- Tap -> all cards flip face-up for 3 seconds
- `playSparkle()` on activate
- Cards flip back with 50ms stagger left-to-right (wave effect)
- Unlimited uses, no penalty
- Duration stays 3s at all grid sizes (naturally harder on bigger grids)

## Core Gameplay

1. Tap card -> 3D CSS Y-axis flip (0.3s), `playTap()`
2. If 1st card -> stays up, wait for 2nd
3. If 2nd card:
   - **Match:** Both stay face-up, starburst animation, `playSuccess()`, sidekick jumps
   - **No match:** Both flip back after 1.5s, `playBoing()`, sidekick sympathetic shrug
4. If secret pair matched -> gold shimmer sweep + `playSparkle()` + `playSuccess()` + sidekick biggest reaction + log to localStorage
5. All pairs matched -> WinCelebration phase

## Sidekick Reactions

| Event | Reaction |
|-------|----------|
| Card flipped | Lean in, eyes wide (scale + tilt) |
| No match | Gentle head shake (wiggle animation) |
| Match | Jump + spin (bounce + spin360) |
| Secret match | Full celebration (bounce + spin + scale) |
| Board complete | Dance animation + confetti |
| Idle 10+ seconds | Gentle wave (wiggle) |

## Win Celebration

- All matched cards animate simultaneously (their idle animations)
- Starburst confetti overlay
- `playFanfare()` — new ascending arpeggio (3-4s)
- Sidekick full dance
- "Play Again?" and "New Theme" buttons after celebration

## Sound Design

| Event | Sound Function | Notes |
|-------|---------------|-------|
| Card flip | `playTap()` | Existing |
| Character reveal | `playStickerSound(id)` | Existing |
| No match | `playBoing()` | Existing, gentle |
| Match | `playSuccess()` | Existing |
| Secret match | `playSparkle()` + `playSuccess()` | Existing |
| Peek activate | `playSparkle()` | Existing |
| Board complete | New `playFanfare()` | 3-4s celebratory arpeggio |
| Theme select | `playBoing()` | Existing |
| Card deal | `playSnap()` staggered | Existing |

### New Sound: playFanfare()

Rich ascending arpeggio using multiple sine oscillators with harmonics. C-E-G-C'-E'-G' over 3 seconds with reverb-like decay.

## New Tailwind Keyframes

- `card-flip` — 3D rotateY(0 -> 180deg), 0.3s
- `card-unflip` — 3D rotateY(180deg -> 0), 0.3s
- `starburst` — scale(0) -> scale(1.5) + opacity(1 -> 0), 0.5s
- `parade-enter` — translateX(100vw) -> translateX(0) with bounce easing
- `parade-exit` — translateX(0) -> translateX(-100vw)
- `peek-reveal` — rotateY(180deg -> 0) for front face
- `gold-shimmer` — background-position sweep, 0.8s
- `deal-card` — scale(0) -> scale(1) with bounce, staggered via animation-delay
- `sidekick-jump` — translateY bounce + scale
- `confetti-fall` — translateY(-100%) -> translateY(100vh) + rotate, randomized

## Routing Integration

- Register in `src/data/games.js` with `id: 'memory-match'`
- Replace existing simple MemoryMatch route in App.jsx
- Lazy-loaded: `const MemoryMatch = lazy(() => import('./games/MemoryMatch'))`
- Path: `/games/:mode/:section/memory-match`
