import { useState, useCallback, useRef, useEffect } from 'react';
import Card from './Card';
import Sidekick from './Sidekick';
import { playTap, playSuccess, playBoing, playSparkle, playStickerSound } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';

export default function GameBoard({ theme, cards: initialCards, level, onWin, onBack }) {
  const [cards, setCards] = useState(initialCards);
  const [sidekickEvent, setSidekickEvent] = useState(null);
  const [peekActive, setPeekActive] = useState(false);
  const locked = useRef(false);
  const idleTimer = useRef(null);
  const sidekickTimer = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  // Reset idle timer on any interaction
  const resetIdle = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setSidekickEvent('idle');
    }, 10000);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => {
      clearTimeout(idleTimer.current);
      clearTimeout(sidekickTimer.current);
    };
  }, [resetIdle]);

  // Helper to trigger sidekick event with auto-clear
  const triggerSidekick = useCallback((event) => {
    clearTimeout(sidekickTimer.current);
    setSidekickEvent(event);
    sidekickTimer.current = setTimeout(() => setSidekickEvent(null), 1200);
  }, []);

  const handleCardTap = useCallback((cardId) => {
    if (locked.current || peekActive) return;
    resetIdle();

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched) return prev;

      playTap();
      playStickerSound(card.sound);
      triggerSidekick('flip');

      const updated = prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
      const flippedNow = updated.filter(c => c.flipped && !c.matched);

      if (flippedNow.length === 2) {
        locked.current = true;
        const [a, b] = flippedNow;

        if (a.characterId === b.characterId) {
          // Match!
          setTimeout(() => {
            // Particle burst at approximate card positions
            const gridEl = document.querySelector('[data-memory-grid]');
            if (gridEl) {
              const rect = gridEl.getBoundingClientRect();
              const cols = level.cols;
              const aIdx = initialCards.findIndex(c => c.id === a.id);
              const bIdx = initialCards.findIndex(c => c.id === b.id);
              const cellW = rect.width / cols;
              const cellH = rect.height / Math.ceil(initialCards.length / cols);
              const ax = rect.left + (aIdx % cols) * cellW + cellW / 2;
              const ay = rect.top + Math.floor(aIdx / cols) * cellH + cellH / 2;
              const bx = rect.left + (bIdx % cols) * cellW + cellW / 2;
              const by = rect.top + Math.floor(bIdx / cols) * cellH + cellH / 2;
              burst(ax, ay, { count: 8, spread: 50 });
              burst(bx, by, { count: 8, spread: 50 });
            }
            peek(a.isSecret ? 'excited' : 'happy');

            if (a.isSecret) {
              playSparkle();
              setTimeout(() => playSuccess(), 200);
              triggerSidekick('secret');
            } else {
              playSuccess();
              triggerSidekick('match');
            }
            setCards(p => {
              const next = p.map(c =>
                c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
              );
              if (next.every(c => c.matched)) {
                // Collect any secret IDs from matched cards
                const secretIds = next.filter(c => c.isSecret).map(c => c.characterId);
                const unique = [...new Set(secretIds)];
                setTimeout(() => onWin(unique), 800);
              }
              return next;
            });
            locked.current = false;
          }, 400);
        } else {
          // No match — flip back after 1.5s
          setTimeout(() => {
            playBoing();
            triggerSidekick('noMatch');
            setCards(p => p.map(c =>
              c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
            ));
            locked.current = false;
          }, 1500);
        }
      }

      return updated;
    });
  }, [peekActive, onWin, resetIdle, triggerSidekick]);

  // Peek mode — show all cards for 3 seconds
  const handlePeek = useCallback(() => {
    if (locked.current || peekActive) return;
    locked.current = true;
    setPeekActive(true);
    playSparkle();

    // Show all unmatched cards
    setCards(prev => prev.map(c => c.matched ? c : { ...c, flipped: true }));

    // Flip back after 3 seconds with stagger
    setTimeout(() => {
      const unmatched = cards.filter(c => !c.matched);
      unmatched.forEach((c, i) => {
        setTimeout(() => {
          setCards(p => p.map(card =>
            card.id === c.id && !card.matched ? { ...card, flipped: false } : card
          ));
        }, i * 50);
      });

      // Unlock after all cards have flipped back
      const totalDelay = unmatched.length * 50 + 300;
      setTimeout(() => {
        setPeekActive(false);
        locked.current = false;
      }, totalDelay);
    }, 3000);
  }, [peekActive, cards]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={`/arthurs-world/images/scenes/${theme}/bg.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Top bar: back + peek */}
      <div className="relative z-20 flex items-center justify-between p-3">
        <button
          onClick={onBack}
          className="w-11 h-11 bg-night/60 backdrop-blur-sm rounded-full flex items-center
                     justify-center text-xl active:scale-90 transition-transform"
        >
          <span className="rotate-180">&#10140;</span>
        </button>

        <button
          onClick={handlePeek}
          className={`w-11 h-11 bg-night/60 backdrop-blur-sm rounded-full flex items-center
                     justify-center text-xl active:scale-90 transition-transform
                     ${peekActive ? 'ring-2 ring-sun' : ''}`}
          title="Peek"
        >
          &#128065;
        </button>
      </div>

      {/* Card grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-3">
        <div
          data-memory-grid
          className="grid gap-2 w-full max-w-lg"
          style={{
            gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
          }}
        >
          {cards.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              theme={theme}
              onClick={() => handleCardTap(card.id)}
              dealDelay={i * 80}
            />
          ))}
        </div>
      </div>

      {/* Sidekick */}
      <div className="absolute bottom-4 left-4 z-20">
        <Sidekick theme={theme} event={sidekickEvent} />
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
