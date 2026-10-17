import { motion } from 'framer-motion';
import BackButton from '../../components/BackButton';
import GoldenHourScene from '../../components/scenes/GoldenHourScene';
import TemplateArt from './TemplateArt';
import { WORLDS, TEMPLATES } from './worlds';
import { loadCreatures } from './sprite';

const SAMPLE_FILL = { sea: '#fdba74', space: '#fde68a', jungle: '#f9a8d4', farm: '#fbcfe8', dinosaurs: '#86efac' };

/**
 * Pick which world to draw for. Each card shows the painted world, a
 * sample creature, and peeks of the creatures already living there.
 *
 * Props:
 *   onPick — (worldId) => void
 */
export default function WorldPicker({ onPick }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <GoldenHourScene />
      <BackButton />

      <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-5 px-24 py-6">
        {WORLDS.map((world, i) => {
          const residents = loadCreatures(world.id).slice(-3);
          const sample = TEMPLATES[world.templates[0]];
          return (
            <motion.button
              key={world.id}
              onClick={() => onPick(world.id)}
              aria-label={world.id}
              className="relative w-[26vw] max-w-[360px] min-w-[220px] aspect-[16/10] rounded-[2rem] overflow-hidden
                         border-[6px] border-white/80 shadow-aw-lg"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.07 }}
              whileTap={{ scale: 0.93 }}
            >
              <img src={world.bg} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
              <TemplateArt template={sample} fill={SAMPLE_FILL[world.id]}
                           className="absolute right-[4%] top-[6%] w-[42%] h-auto drop-shadow-xl animate-float" />
              {residents.length > 0 && (
                <div className="absolute left-3 bottom-2 flex items-end gap-1">
                  {residents.map(c => (
                    <img key={c.id} src={c.src} alt="" draggable={false}
                         className="h-14 w-auto max-w-[5.5rem] object-contain drop-shadow-lg" />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
