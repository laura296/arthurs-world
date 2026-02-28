import { SCENES } from './sceneData';
import Starfield from '../../components/Starfield';
import { playBoing } from '../../hooks/useSound';

const sceneList = Object.values(SCENES);

export default function ScenePicker({ onSelectScene }) {
  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />

      <div className="relative z-10 p-6 pt-12">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          Pick your world!
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {sceneList.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => { playBoing(); onSelectScene(scene.id); }}
              className={`game-card overflow-hidden bg-gradient-to-br ${scene.bg} flex flex-col
                         items-center justify-end min-h-[140px] animate-bounce-in p-0`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
            >
              {/* Scene background preview */}
              <img
                src={scene.bgImage}
                alt={scene.label}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Label overlay */}
              <div className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                <span className="text-lg font-heading text-white drop-shadow flex items-center justify-center gap-2">
                  {scene.emoji} {scene.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
