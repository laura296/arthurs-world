import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playSuccess, playBoing } from '../hooks/useSound';

const EMOJIS = ['🐶', '🐱', '🐸', '🦁', '🐵', '🐷'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCards() {
  const pairs = EMOJIS.slice(0, 6);
  return shuffle([...pairs, ...pairs].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  })));
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(makeCards);
  const [selected, setSelected] = useState([]);
  const [won, setWon] = useState(false);
  const locked = useRef(false);

  const handleTap = useCallback((cardId) => {
    if (locked.current) return;

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched) return prev;

      playTap();
      const updated = prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
      const flippedNow = updated.filter(c => c.flipped && !c.matched);

      if (flippedNow.length === 2) {
        locked.current = true;
        const [a, b] = flippedNow;

        if (a.emoji === b.emoji) {
          // Match!
          setTimeout(() => {
            playSuccess();
            setCards(p => {
              const next = p.map(c =>
                c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
              );
              if (next.every(c => c.matched)) {
                setWon(true);
              }
              return next;
            });
            setSelected([]);
            locked.current = false;
          }, 400);
        } else {
          // No match — flip back
          setTimeout(() => {
            playBoing();
            setCards(p => p.map(c =>
              c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
            ));
            setSelected([]);
            locked.current = false;
          }, 800);
        }
      }

      return updated;
    });
  }, []);

  const restart = useCallback(() => {
    setCards(makeCards());
    setSelected([]);
    setWon(false);
    locked.current = false;
    playBoing();
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-teal-600 to-cyan-900 flex flex-col items-center overflow-hidden">
      <BackButton />

      {won && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50">
          <div className="text-6xl animate-bounce mb-4">🎉</div>
          <button
            onClick={restart}
            className="bg-sun text-night font-heading text-2xl px-8 py-4 rounded-full
                       animate-bounce-in active:scale-90 transition-transform"
          >
            🔄 Again!
          </button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleTap(card.id)}
              className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl
                         transition-all duration-300 ${
                           card.matched
                             ? 'bg-sun/30 scale-90'
                             : card.flipped
                               ? 'bg-white shadow-lg scale-105'
                               : 'bg-white/20 backdrop-blur-sm active:scale-95'
                         }`}
            >
              {card.flipped || card.matched ? card.emoji : '❓'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
