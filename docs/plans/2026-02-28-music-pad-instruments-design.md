# Music Pad — Instrument Visual Redesign

**Date**: 2026-02-28
**Status**: Approved

## Summary

Transform the MusicPad from generic colored rectangles into visually distinct instrument layouts. When a user selects piano, they see piano keys; harp shows strings; drums show circular drum heads; xylophone shows graduated bars.

## Approach

CSS-Only (Approach A) — pure Tailwind/CSS shapes. No images, no SVGs. Matches existing app aesthetic, loads instantly, scales perfectly.

## Instrument Picker (Top Bar)

Replace emoji pills with mini CSS illustrations:
- **Piano**: 3 tiny white keys + 2 black keys silhouette
- **Harp**: Small triangular frame with 4-5 vertical lines (strings)
- **Drums**: Two small circles (drum heads) with crossed sticks
- **Xylophone**: 4 tiny horizontal bars graduated in width

Active state keeps the glow ring + scale. Text labels remain below.

## Piano Play Area

- 8 white keys span full width, bottom ~60% of screen
- 5 black keys (C#, D#, F#, G#, A#) in standard positions between white keys
- White keys: tall rounded-bottom rectangles, note label at bottom
- Black keys: shorter, narrower, overlaid on top
- Tap: key presses down (translateY + slight scale), glow, particle burst
- Background: deep brown/burgundy stage color
- Total: 13 playable notes (8 naturals + 5 sharps)

## Harp Play Area

- Background: deep midnight blue
- 8 vertical strings (thin divs, ~3px) spaced across screen
- Graduated length: longest on left, shortest on right
- Color gradient: gold to silver
- Tap: string wobbles side-to-side, glows, ripple from touch point
- Note labels at bottom of each string

## Drums Play Area

- Background: dark wood stage (CSS gradient)
- 8 circular drum pads in kit arrangement:
  - Top row: 3 smaller circles (hi-hat, cymbals, ride)
  - Middle row: 3 medium circles (snare, toms)
  - Bottom row: 2 larger circles (bass, floor tom)
- Concentric ring pattern (radial gradient) for drum head look
- Tap: drum depresses (scale), ring ripple expands, particles pop

## Xylophone Play Area

- Background: warm cream/wood tone
- 8 horizontal bars stacked vertically, graduated width (widest bottom)
- Rainbow spectrum colors matching current pad colors
- Wood grain texture via CSS linear gradient stripes
- Small grey circles at bar ends (mounting points)
- Tap: bar bounces (translateY), brightness flash, note label pulses

## Technical Notes

- Each instrument layout is a separate component within MusicPad
- Shared: note data, sound system, particle burst system
- New sharps/flats added for piano only (5 additional notes)
- Animations use existing keyframes + new instrument-specific ones
- All layouts are touch-optimized with large tap targets
