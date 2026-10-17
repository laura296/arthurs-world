import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorldPicker from './draw-alive/WorldPicker';
import LiveWorld from './draw-alive/LiveWorld';
import DrawPad from './draw-alive/DrawPad';
import Parade from './draw-alive/Parade';
import { getWorld } from './draw-alive/worlds';
import { loadCreatures, saveCreatures } from './draw-alive/sprite';
import { playTap, playPop } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

/**
 * Draw Alive — colour in a creature (or draw your own) and send it into a
 * painted world. It is born there (hatching from an egg, popping out of a
 * bubble…) and then swims, flies, flutters or walks about, and eats the
 * food Arthur taps into the world.
 * Creatures are remembered per world, so the worlds fill up over time.
 *
 * Screens: pick a world → the live world → the drawing paper → back to the world.
 * The picker also opens a parade of every creature from every world.
 */
export default function DrawAlive() {
  const [screen, setScreen] = useState('pick');
  const [worldId, setWorldId] = useState(null);
  const [creatures, setCreatures] = useState([]);
  const [newcomerId, setNewcomerId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const world = worldId ? getWorld(worldId) : null;

  /* Each meal is remembered: well-fed creatures grow a little.
     Saved a moment later rather than on every bite, and flushed on leaving. */
  const fedDirty = useRef(false);
  const latest = useRef(null);
  latest.current = { worldId, creatures };
  const flushFed = useCallback(() => {
    if (!fedDirty.current) return;
    fedDirty.current = false;
    const { worldId: id, creatures: list } = latest.current;
    if (id) saveCreatures(id, list);
  }, []);
  const handleFed = useCallback((id) => {
    setCreatures(prev => prev.map(c => (c.id === id ? { ...c, fed: (c.fed || 0) + 1 } : c)));
    if (!fedDirty.current) {
      fedDirty.current = true;
      setTimeout(flushFed, 1500);
    }
  }, [flushFed]);
  useEffect(() => flushFed, [flushFed]);

  const openWorld = useCallback((id) => {
    flushFed();
    playTap();
    setWorldId(id);
    setCreatures(loadCreatures(id));
    setNewcomerId(null);
    setScreen('world');
  }, [flushFed]);

  const arrive = useCallback((sprite) => {
    const born = Date.now();
    const creature = {
      id: `c-${born}`,
      born,
      ...sprite,
      motion: sprite.motion || world.freeMotion,
      birth: sprite.birth || world.freeBirth,
    };
    setCreatures(saveCreatures(world.id, [...creatures, creature]));
    setNewcomerId(creature.id);
    setScreen('world');
  }, [world, creatures]);


  const handleBorn = useCallback(() => {
    peek('excited');
    setNewcomerId(null);
  }, [peek]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-aw-warm">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: screen === 'world' ? 0.35 : 0.25 }}
        >
          {screen === 'pick' && <WorldPicker onPick={openWorld} onParade={() => { playPop(); setScreen('parade'); }} />}
          {screen === 'parade' && <Parade onBack={() => setScreen('pick')} />}
          {screen === 'world' && world && (
            <LiveWorld
              world={world}
              creatures={creatures}
              newcomerId={newcomerId}
              onBorn={handleBorn}
              onFed={handleFed}
              burst={burst}
              onDraw={() => { playPop(); setScreen('draw'); }}
              onBack={() => setScreen('pick')}
            />
          )}
          {screen === 'draw' && world && (
            <DrawPad world={world} onSend={arrive} onBack={() => setScreen('world')} burst={burst} />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Called as functions so new bursts don't restart the ones already flying */}
      {ParticleLayer()}
      {ArthurPeekLayer()}
    </div>
  );
}
