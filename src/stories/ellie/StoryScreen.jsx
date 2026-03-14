import { useEffect, useRef } from 'react';
import { CHAPTERS, STATIC_ASSETS } from './storyData';
import { playPageTurn } from '../../hooks/useSound';
import { speakText, stopSpeaking } from '../../hooks/useNarration';

const AUDIO_DIR = '/arthurs-world/audio/ellie-tiny-folk';

/** Play MP3 narration with TTS fallback */
function playNarration(chapter, text, audioRef) {
  stopSpeaking();
  if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  const src = `${AUDIO_DIR}/page-${chapter + 1}.mp3`;
  const audio = new Audio(src);
  audioRef.current = audio;
  audio.play().catch(() => {
    audioRef.current = null;
    speakText(text);
  });
}

export default function StoryScreen({ chapter, onAdvance }) {
  const data = CHAPTERS[chapter];
  const bgUrl = STATIC_ASSETS.scene(chapter + 1);
  const audioRef = useRef(null);

  // Auto-narrate on mount
  useEffect(() => {
    const timer = setTimeout(() => playNarration(chapter, data.narration, audioRef), 600);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, [chapter, data.narration]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-ellie-fade-in"
        draggable={false}
      />

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
            onClick={() => playNarration(chapter, data.narration, audioRef)}
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
