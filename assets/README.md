# Arthur's World — Asset Directory

## Naming Convention

All filenames: **kebab-case**, format `[subject]-[variant]-[size].webp`

### Characters
```
characters/
  arthur-happy-512.webp
  arthur-sad-512.webp
  arthur-excited-512.webp
  arthur-sleepy-512.webp
  arthur-full-happy-512.webp      # full body variant
  pip-perched-512.webp
  hazel-smile-512.webp
```

### Backgrounds
```
backgrounds/
  forest-clearing-happy-2732.webp
  forest-clearing-sad-2732.webp
  farm-establishing-2732.webp
  playroom-xylophone-2732.webp
  sky-bubbles-2732.webp
  meadow-feeding-2732.webp
  toybox-matching-2732.webp
```

### Items
```
items/
  shape-circle-red-256.webp
  shape-star-yellow-256.webp
  food-apple-256.webp
  food-carrot-256.webp
```

### UI
```
ui/
  button-wood-256.webp
  star-gold-256.webp
  card-back-256.webp
```

### Animations
```
animations/
  celebration-confetti.json        # Lottie
  sparkle-burst.json               # Lottie
  fireflies-ambient.json           # Lottie
```

### Spritesheets
```
spritesheets/
  arthur-idle.riv                  # Rive state machine
  arthur-emotions.riv              # Rive state machine
  arthur-celebrate.riv             # Rive state machine
```

## Format & Size Targets

| Type        | Source       | Serve        | Format        |
|-------------|-------------|--------------|---------------|
| Characters  | 1024x1024   | 512x512 @2x | WebP 80%      |
| Backgrounds | 2732x2048   | native       | WebP 80%      |
| Items / UI  | 256x256     | 128x128 @2x | WebP 80%      |
| Animations  | —           | —            | .json / .riv  |

## GPU Memory Budget

- 1024x1024 RGBA = 4MB in GPU memory
- Max ~25 unique 1024x1024 textures per module
- iPad Safari kills tabs above ~300MB total
