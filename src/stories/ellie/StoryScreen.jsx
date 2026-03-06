import { useState, useEffect } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { CHAPTERS } from './storyData';
import { playPageTurn } from '../../hooks/useSound';

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.1;
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

export default function StoryScreen({ chapter, onAdvance }) {
  const [bgUrl, setBgUrl] = useState(null);
  const data = CHAPTERS[chapter];

  useEffect(() => {
    getImage(data.sceneKey).then(blob => {
      if (blob) setBgUrl(blobToUrl(blob));
    });
  }, [data.sceneKey]);

  // Auto-narrate on mount
  useEffect(() => {
    const timer = setTimeout(() => speakText(data.narration), 600);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [data.narration]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Full-bleed background image */}
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-ellie-fade-in"
          draggable={false}
        />
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-indigo-900" />
      )}

      {/* Chapter title */}
      <div className="absolute top-6 left-0 right-0 z-20 text-center">
        <span className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-1.5
                         text-sm font-heading text-sun/90">
          Chapter {chapter + 1}: {data.title}
        </span>
      </div>

      {/* Narration text band */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="mx-4 mb-20 bg-white/85 backdrop-blur-md rounded-3xl p-5 shadow-xl
                        border-2 border-amber-300/60 pointer-events-auto animate-ellie-fade-in"
             style={{ animationDelay: '0.4s' }}>
          <p className="text-xl font-body text-gray-800 leading-relaxed text-center">
            {data.narration}
          </p>
          {/* Read aloud button */}
          <button
            onClick={() => speakText(data.narration)}
            className="absolute -top-4 right-4 w-10 h-10 rounded-full bg-sun shadow-lg
                       flex items-center justify-center text-xl active:scale-90 transition-transform"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Play game button */}
      <div className="absolute bottom-4 right-6 z-30">
        <button
          onClick={() => { playPageTurn(); onAdvance(); }}
          className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                     shadow-xl active:scale-95 transition-transform animate-bounce"
        >
          Play! ▶
        </button>
      </div>
    </div>
  );
}
