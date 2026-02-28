import { useState, useEffect } from 'react';
import { SIDEKICKS, stickerPath } from './cardData';

export default function Sidekick({ theme, event }) {
  const [animClass, setAnimClass] = useState('');
  const sidekick = SIDEKICKS[theme];

  useEffect(() => {
    if (!event) return;

    const anims = {
      flip: 'animate-pop',
      match: 'animate-sidekick-jump',
      noMatch: 'animate-wiggle',
      secret: 'animate-dance',
      win: 'animate-dance',
      idle: 'animate-wiggle',
    };

    setAnimClass(anims[event] || '');
    const timer = setTimeout(() => setAnimClass(''), 1000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!sidekick) return null;

  return (
    <div className={`w-16 h-16 ${animClass} transition-all`}>
      <img
        src={stickerPath(theme, sidekick.id)}
        alt={sidekick.label}
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </div>
  );
}
