import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorldPicker from './draw-alive/WorldPicker';
import LiveWorld from './draw-alive/LiveWorld';
import DrawPad from './draw-alive/DrawPad';
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
 */
export default function DrawAlive() {
  const [screen, setScreen] = useState('pick');
  const [worldId, setWorldId] = useState(null);
  const [creatures, setCreatures] = useState([]);
  const [newcomerId, setNewcomerId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const world = worldId ? getWorld(worldId) : null;

  const openWorld = useCallback((id) => {
    playTap();
    setWorldId(id);
    setCreatures(loadCreatures(id));
    setNewcomerId(null);
    setScreen('world');
  }, []);

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
          {screen === 'pick' && <WorldPicker onPick={openWorld} />}
          {screen === 'world' && world && (
            <LiveWorld
              world={world}
              creatures={creatures}
              newcomerId={newcomerId}
              onBorn={handleBorn}
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
      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
