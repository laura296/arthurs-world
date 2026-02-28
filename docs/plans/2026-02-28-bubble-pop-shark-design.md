# BubblePop: Shark + Bad Bubbles Enhancement

**Date:** 2026-02-28
**Status:** Approved

## Overview

Enhance BubblePop with two new features:
1. A shark that periodically swims across the screen eating bubbles (fun & silly tone)
2. "Spiky" bad bubbles that deduct points if popped

## Shark Behavior

- Spawns every **8-12 seconds** (randomized interval), swims from one side to the other
- Uses the existing `Shark.jsx` SVG component, flipped based on swim direction
- Swims in a gentle sine-wave path (like fish but bigger, slower amplitude)
- **Collision:** When shark center is within ~80px of a bubble center, the bubble is "eaten" — removed with a chomp animation
- Eats **up to 2-3 bubbles** per pass (not all of them)
- Sound: a funny synth "chomp" sound when eating a bubble
- Only one shark on screen at a time
- Tone: fun & silly — a spectacle, not a threat

## Bad Bubbles (Spiky)

- New bubble type `'spiky'` in `makeBubble` — ~12% spawn chance
- Visual: dark purple/red, jagged CSS border, small "X" icon inside
- Float up like normal bubbles but wobble more aggressively
- Tapping gives **-1 point** (score floor at 0, never negative)
- Sound: a descending "buzz" / "wrong" tone
- Pop effect: red/dark particles with "-1" popup instead of "+1"

## Approach

All shark + spiky logic lives in the main `BubblePop.jsx` animation loop (Approach A), following the same pattern already used for fish. One loop, one source of truth.

## Files Changed

- `src/games/BubblePop.jsx` — shark state, spiky bubble type, collision logic, new visuals
- `src/hooks/useSound.js` — add `playChomp()` and `playBuzz()` synth sounds

## Scoring Summary

| Type | Points |
|------|--------|
| Normal bubble | +1 |
| Golden bubble | +2 |
| Rainbow bubble | +3 |
| Fish tap | +5 |
| **Spiky bubble** | **-1** |
| Shark eats bubble | 0 (no score change, just removes bubble) |

Score minimum: 0 (never goes negative)
