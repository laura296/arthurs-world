# Inside Out: Headquarters Hero — Build Plan

## What We're Building

The MVP of the Inside Out game inside Arthur's app, following the existing Disney subsection pattern.

## Architecture

### Entry Point
- Add `disney-insideout` subsection to DisneyHub.jsx
- Add `disney-insideout` theme to sectionThemes.js
- Add game entries to games.js
- Add routes to App.jsx

### File Structure
```
src/games/inside-out/
  InsideOutHub.jsx          — HQ map (the hub screen with rooms)
  ControlPanelMeltdown.jsx  — Mini-game 1: tap/drag/swipe console repair
  AngerCoolDown.jsx         — Mini-game 2: swipe ice onto hot pipes
  AlarmAvalanche.jsx        — Mini-game 3: sort real vs false alarms
  ChainReactionCrisis.jsx   — Boss event: multi-room speed sprint
  insideOutData.js          — Room data, progression, rewards, state management
```

### Data Files
```
src/data/games.js           — Add 5 entries (hub + 4 games) under disney-insideout
src/data/sectionThemes.js   — Add disney-insideout theme
```

### Routing
```
/games/:mode/disney         → DisneyHub (already exists, add card)
/games/:mode/disney-insideout → GameGrid (shows the games)
/games/:mode/:section/inside-out-hub → InsideOutHub (HQ map)
/games/:mode/:section/control-panel-meltdown → ControlPanelMeltdown
/games/:mode/:section/anger-cool-down → AngerCoolDown
/games/:mode/:section/alarm-avalanche → AlarmAvalanche
/games/:mode/:section/chain-reaction-crisis → ChainReactionCrisis
```

## Build Order

### Phase 1 — Wiring (register the game in the app)
1. Add disney-insideout theme to sectionThemes.js
2. Add game entries to games.js
3. Add Inside Out subsection card to DisneyHub.jsx
4. Add lazy imports and routes to App.jsx
5. Create insideOutData.js (rooms, progression, localStorage persistence)

### Phase 2 — Hub Screen (InsideOutHub.jsx)
The Headquarters Map — an isometric/top-down view showing 4 rooms:
- Control Room (yellow glow)
- Anger Reactor (red glow)
- Anxiety Dome (teal glow)
- Memory Vault (purple/rainbow glow)

Features:
- Rooms show alert badges when emergency is active
- Tapping a room navigates to its mini-game
- Restoration level shown visually per room
- Memory orb counter and star counter at top
- Chain reaction lines between rooms
- Daily alert indicator
- Arthur character in center

Persistence: localStorage for stars, orbs, restoration levels, streak.

### Phase 3 — Mini-Game 1: Control Panel Meltdown
- Tap flashing buttons to cycle to correct color
- Drag levers to target positions
- Swipe screens to clear static
- Overload bar timer at top
- Joy helper character reactions
- Star rating on success (1-3 stars)
- Particle bursts on correct actions
- Sound effects: playPop, playSuccess, playSparkle, playBuzz

### Phase 4 — Mini-Game 2: Anger Cool-Down Rush
- Temperature gauge climbing on right side
- Hot pipes glow red — swipe ice patches onto them
- Tap steam vents to release pressure
- Ice patches regenerate at bottom
- Anger character reactions
- Escalating difficulty (more pipes heat up)
- Sound effects: playSplash (cooling), playBoom (steam release)

### Phase 5 — Mini-Game 3: Alarm Avalanche
- Floating notification bubbles in dome
- Swipe false alarms to dismiss (orange wobbly border)
- Tap real emergencies to resolve (teal steady border)
- Capacity bar fills as bubbles accumulate
- Anxiety character reactions
- Spawning speed increases
- Sound effects: playPop (dismiss), playSuccess (resolve)

### Phase 6 — Boss: Chain Reaction Crisis
- Shows HQ cross-section with chain path
- 3 rooms in sequence, 15-second micro-challenge each
- Simplified versions of the 3 mini-games
- Cinematic transitions between rooms
- Biggest celebration on win
- Sound effects: playFanfare, playCelebrate, playDrumroll

### Phase 7 — Progression & Polish
- Wire up restoration star system
- Wire up memory orb collection
- Wire up room restoration visual changes
- Wire up daily alert rotation
- Wire up streak system
- Add chain reaction triggers between rooms
- Add success/failure screens with emotion reactions

## MVP Scope (What to Build)

### Include
- HQ Hub map with 4 rooms
- 3 core mini-games + 1 boss event
- Star + orb collection (localStorage)
- Room restoration (5 visual levels per room)
- Daily alert system
- Streak counter
- Chain reactions between rooms
- Success/failure screens with character reactions
- Sound effects (all synthesized, no audio files needed)
- Particle effects for feedback

### Cut for Later
- Dream Studio, Fear Maze, Embarrassment Hideout, Mixed Feelings Lab
- Hero Tools (Calm Pulse, Freeze Burst, etc.)
- Cosmetic personalization
- Sticker album
- Character unlock ceremonies
- Profile/welcome screen
- Parent settings area

## Patterns to Follow

### Game Component Pattern
```jsx
import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { playSuccess, playPop, playSparkle } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';

export default function GameName() {
  const containerRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const [phase, setPhase] = useState('playing'); // playing | success | failure

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden"
         onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <BackButton />
      {/* game content */}
      <ParticleLayer />
    </div>
  );
}
```

### Persistence Pattern
```js
const STORAGE_KEY = 'inside-out-progress';
function loadProgress() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaults; } catch { return defaults; } }
function saveProgress(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} }
```

### Sound Pattern
All sounds are synthesized via useSound.js — no audio files needed.
Map game actions to existing sounds:
- Correct tap → playSuccess / playPop
- Wrong tap → playBuzz / playBoing
- Big win → playCelebrate / playFanfare
- Cooling → playSplash
- Alert dismiss → playPop
- Alert resolve → playSparkle
- Chain reaction → playDrumroll

## Estimated File Count
- 1 data file (insideOutData.js)
- 1 hub file (InsideOutHub.jsx)
- 3 mini-game files
- 1 boss event file
- Edits to: games.js, sectionThemes.js, DisneyHub.jsx, App.jsx

Total: ~6 new files + 4 file edits
