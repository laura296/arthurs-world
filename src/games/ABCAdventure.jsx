import { useState, useCallback, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playPop, playSuccess, playBoing, playFanfare, playTone, playSparkle, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* ── Letter data with phonics and picture associations ── */
const ALPHABET = [
  { letter: 'A', sound: 'ah',  emoji: '🍎', word: 'Apple',      freq: 220 },
  { letter: 'B', sound: 'buh', emoji: '🐻', word: 'Bear',       freq: 247 },
  { letter: 'C', sound: 'kuh', emoji: '🐱', word: 'Cat',        freq: 262 },
  { letter: 'D', sound: 'duh', emoji: '🐶', word: 'Dog',        freq: 294 },
  { letter: 'E', sound: 'eh',  emoji: '🐘', word: 'Elephant',   freq: 330 },
  { letter: 'F', sound: 'fuh', emoji: '🐸', word: 'Frog',       freq: 349 },
  { letter: 'G', sound: 'guh', emoji: '🦒', word: 'Giraffe',    freq: 392 },
  { letter: 'H', sound: 'huh', emoji: '🐴', word: 'Horse',      freq: 440 },
  { letter: 'I', sound: 'ih',  emoji: '🍦', word: 'Ice cream',  freq: 494 },
  { letter: 'J', sound: 'juh', emoji: '🧃', word: 'Juice',      freq: 523 },
  { letter: 'K', sound: 'kuh', emoji: '🪁', word: 'Kite',       freq: 262 },
  { letter: 'L', sound: 'luh', emoji: '🦁', word: 'Lion',       freq: 294 },
  { letter: 'M', sound: 'muh', emoji: '🐵', word: 'Monkey',     freq: 330 },
  { letter: 'N', sound: 'nuh', emoji: '🥜', word: 'Nut',        freq: 349 },
  { letter: 'O', sound: 'oh',  emoji: '🐙', word: 'Octopus',    freq: 392 },
  { letter: 'P', sound: 'puh', emoji: '🐷', word: 'Pig',        freq: 440 },
  { letter: 'Q', sound: 'kwuh',emoji: '👑', word: 'Queen',      freq: 494 },
  { letter: 'R', sound: 'ruh', emoji: '🐰', word: 'Rabbit',     freq: 523 },
  { letter: 'S', sound: 'sss', emoji: '🐍', word: 'Snake',      freq: 262 },
  { letter: 'T', sound: 'tuh', emoji: '🐢', word: 'Turtle',     freq: 294 },
  { letter: 'U', sound: 'uh',  emoji: '☂️', word: 'Umbrella',   freq: 330 },
  { letter: 'V', sound: 'vuh', emoji: '🌋', word: 'Volcano',    freq: 349 },
  { letter: 'W', sound: 'wuh', emoji: '🐋', word: 'Whale',      freq: 392 },
  { letter: 'X', sound: 'ks',  emoji: '🎸', word: 'Xylophone',  freq: 440 },
  { letter: 'Y', sound: 'yuh', emoji: '🪀', word: 'Yo-yo',      freq: 494 },
  { letter: 'Z', sound: 'zzz', emoji: '🦓', word: 'Zebra',      freq: 523 },
];

/* ── Level definitions ── */
const LEVELS = [
  // Explore levels — tap letters to hear sounds and see pictures
  { id: 1,  label: '🍎', mode: 'explore',    letters: 'ABCDE',   title: 'A B C D E' },
  { id: 2,  label: '🐸', mode: 'explore',    letters: 'FGHIJ',   title: 'F G H I J' },
  // Quiz: match letter to picture
  { id: 3,  label: '❓', mode: 'match-pic',  letters: 'ABCDE',   options: 3, questions: 5, title: 'Match A-E' },
  { id: 4,  label: '🦁', mode: 'explore',    letters: 'KLMNO',   title: 'K L M N O' },
  { id: 5,  label: '❓', mode: 'match-pic',  letters: 'FGHIJ',   options: 3, questions: 5, title: 'Match F-J' },
  // Quiz: match picture to letter
  { id: 6,  label: '🔤', mode: 'match-letter', letters: 'ABCDEFGHIJ', options: 4, questions: 6, title: 'Find the Letter' },
  { id: 7,  label: '🐷', mode: 'explore',    letters: 'PQRST',   title: 'P Q R S T' },
  { id: 8,  label: '❓', mode: 'match-pic',  letters: 'KLMNOPQRST', options: 4, questions: 6, title: 'Match K-T' },
  { id: 9,  label: '🦓', mode: 'explore',    letters: 'UVWXYZ',  title: 'U V W X Y Z' },
  { id: 10, label: '❓', mode: 'match-pic',  letters: 'UVWXYZ',  options: 3, questions: 6, title: 'Match U-Z' },
  // Ordering: tap letters in ABC order
  { id: 11, label: '🔠', mode: 'order',      letters: 'ABCDEFGHIJ', title: 'ABC Order' },
  // Master quiz: all letters
  { id: 12, label: '🏆', mode: 'match-letter', letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', options: 4, questions: 8, title: 'All Letters!' },
];

const LEVEL_LABELS = LEVELS.map(l => l.label);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getLetterData(ch) {
  return ALPHABET.find(a => a.letter === ch);
}

function getLettersForLevel(level) {
  return level.letters.split('').map(getLetterData).filter(Boolean);
}

/* ── Play letter sound using Web Audio synthesis ── */
function playLetterSound(letterData) {
  // Play a distinct tone for each letter
  playTone(letterData.freq, 0.25, 'triangle');
  // Follow with a short "sparkle" for delight
  setTimeout(() => playSparkle(), 150);
}

/* ── Colourful classroom background ── */
function ClassroomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF8F0 55%, #E8D5B8 55%, #E8D5B8 100%)' }}>
      {/* Chalkboard */}
      <div className="absolute top-[6%] left-[10%] right-[10%] h-[38%] rounded-xl border-8"
        style={{
          background: 'linear-gradient(135deg, #2d5016 0%, #1a3a0a 100%)',
          borderColor: '#C4A265',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 2px 10px rgba(0,0,0,0.3)',
        }}>
        {/* Chalk letters floating on board */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-20">
          {'ABCDE'.split('').map((ch, i) => (
            <span key={ch} className="text-4xl text-white/60 font-heading"
              style={{ transform: `rotate(${(i - 2) * 5}deg)` }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Shelf under chalkboard */}
      <div className="absolute left-[10%] right-[10%]" style={{ top: '44%', height: '8px' }}>
        <div style={{ background: 'linear-gradient(180deg, #C4A265, #A08040)', borderRadius: '2px',
                      height: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
      </div>

      {/* Alphabet border along top */}
      <div className="absolute top-1 left-0 right-0 flex justify-center gap-0.5 opacity-30 overflow-hidden">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => (
          <span key={ch} className="text-xs font-heading"
            style={{ color: `hsl(${i * 14}, 60%, 50%)` }}>{ch}</span>
        ))}
      </div>

      {/* Floor planks */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: '45%', opacity: 0.05 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="absolute left-0 right-0"
            style={{ top: `${i * 16.6}%`, height: '1px', background: '#A08040' }} />
        ))}
      </div>
    </div>
  );
}

/* ── Letter card component ── */
function LetterCard({ letterData, isActive, isDiscovered, onTap, delay = 0 }) {
  const colours = {
    A: '#ef4444', B: '#f97316', C: '#facc15', D: '#22c55e', E: '#3b82f6',
    F: '#8b5cf6', G: '#ec4899', H: '#14b8a6', I: '#ef4444', J: '#f97316',
    K: '#facc15', L: '#22c55e', M: '#3b82f6', N: '#8b5cf6', O: '#ec4899',
    P: '#14b8a6', Q: '#ef4444', R: '#f97316', S: '#facc15', T: '#22c55e',
    U: '#3b82f6', V: '#8b5cf6', W: '#ec4899', X: '#14b8a6', Y: '#ef4444',
    Z: '#f97316',
  };
  const colour = colours[letterData.letter] || '#6b7280';

  return (
    <button onPointerDown={onTap}
      className="rounded-3xl flex flex-col items-center justify-center gap-1 p-2 border-4
                 cursor-pointer transition-all relative overflow-hidden"
      style={{
        backgroundColor: isActive ? `${colour}15` : '#fff',
        borderColor: isActive ? colour : isDiscovered ? '#22c55e' : '#e5e7eb',
        transform: isActive ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isActive
          ? `0 0 30px ${colour}40, 0 8px 25px rgba(0,0,0,0.15)`
          : '0 4px 12px rgba(0,0,0,0.1)',
        touchAction: 'none',
        aspectRatio: '0.85',
        animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
      }}>
      {/* Big letter */}
      <span className="text-4xl sm:text-5xl font-heading drop-shadow-sm" style={{ color: colour }}>
        {letterData.letter}
      </span>
      {/* Picture */}
      <span className="text-2xl sm:text-3xl">{letterData.emoji}</span>
      {/* Discovered check */}
      {isDiscovered && <span className="absolute top-1 right-1 text-sm">✅</span>}
      {/* Active ripple */}
      {isActive && (
        <div className="absolute inset-0 rounded-3xl border-4"
          style={{ borderColor: colour, animation: 'sound-ripple 0.6s ease-out forwards' }} />
      )}
    </button>
  );
}

/* ── Explore mode: tap letters to discover sounds and pictures ── */
function ExploreLevel({ level, onComplete, onBack }) {
  const letters = getLettersForLevel(level);
  const [activeId, setActiveId] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());
  const [showComplete, setShowComplete] = useState(false);
  const [showBig, setShowBig] = useState(null); // letterData for big display
  const timeoutRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tapLetter = useCallback((letterData, e) => {
    playLetterSound(letterData);
    setActiveId(letterData.letter);
    setShowBig(letterData);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { setActiveId(null); setShowBig(null); }, 1500);

    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6, spread: 35, colors: ['#facc15', '#ec4899', '#38bdf8'], shapes: ['star', 'heart'],
      });
    }

    setDiscovered(prev => {
      const next = new Set(prev);
      next.add(letterData.letter);
      if (next.size === letters.length && prev.size < letters.length) {
        setTimeout(() => {
          playFanfare();
          celebrate({ duration: 2500 });
          peek('excited');
          setShowComplete(true);
        }, 600);
      } else if (next.size > prev.size) {
        playSuccess();
        peek('happy');
      }
      return next;
    });
  }, [letters, burst, celebrate, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <ClassroomScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl drop-shadow-sm">🔤 {level.title}</h2>
        <p className="text-amber-800/60 text-sm font-heading mt-1">Tap each letter!</p>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        {discovered.size}/{letters.length} 🔤
      </div>

      {/* Big display when letter is tapped */}
      {showBig && (
        <div className="absolute top-[8%] left-[12%] right-[12%] z-30 flex items-center justify-center gap-4 pointer-events-none"
          style={{ animation: 'pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <div className="bg-white/95 rounded-3xl px-6 py-4 shadow-2xl border-4 border-amber-200 flex items-center gap-4">
            <span className="text-6xl font-heading text-amber-800">{showBig.letter}</span>
            <span className="text-xl text-amber-600">→</span>
            <span className="text-5xl">{showBig.emoji}</span>
          </div>
        </div>
      )}

      {/* Letter grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className={`grid gap-3 w-full max-w-lg ${letters.length <= 5 ? 'grid-cols-3' : 'grid-cols-3'}`}>
          {letters.map((ld, i) => (
            <LetterCard key={ld.letter} letterData={ld}
              isActive={activeId === ld.letter}
              isDiscovered={discovered.has(ld.letter)}
              onTap={(e) => tapLetter(ld, e)}
              delay={i * 0.08} />
          ))}
        </div>
      </div>

      {showComplete && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            <div className="flex gap-1">
              {letters.map((ld, i) => (
                <span key={ld.letter} className="text-3xl font-heading"
                  style={{ color: `hsl(${i * 50}, 60%, 50%)`,
                    animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
                  {ld.letter}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <svg key={i} width={36} height={36} viewBox="0 0 22 22">
                  <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                    fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
                </svg>
              ))}
            </div>
            <button onPointerDown={() => onComplete(3)}
              className="bg-amber-400 text-white font-heading text-xl px-8 py-3 rounded-2xl shadow-lg
                         active:scale-95 transition-transform">
              ▶️
            </button>
          </div>
        </div>
      )}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Match-pic mode: see a letter, pick the matching picture ── */
function MatchPicLevel({ level, onComplete, onBack }) {
  const letters = getLettersForLevel(level);
  const [questions] = useState(() => {
    return Array.from({ length: level.questions }, () => {
      const correct = letters[Math.floor(Math.random() * letters.length)];
      const wrong = shuffle(letters.filter(l => l.letter !== correct.letter)).slice(0, level.options - 1);
      return { correct, options: shuffle([correct, ...wrong]) };
    });
  });
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const currentQ = questions[qIdx];

  // Play letter sound on new question
  useEffect(() => {
    if (!currentQ || phase !== 'playing') return;
    const t = setTimeout(() => playLetterSound(currentQ.correct), 400);
    return () => clearTimeout(t);
  }, [qIdx, phase]);

  const pickOption = useCallback((ld) => {
    if (phase !== 'playing') return;

    if (ld.letter === currentQ.correct.letter) {
      playPop();
      playSuccess();
      setSelectedId(ld.letter);
      setPhase('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);

      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 10, spread: 50, colors: ['#facc15', '#22c55e', '#38bdf8'], shapes: ['star', 'heart'],
      });
      if (streak + 1 >= 3) peek('excited'); else peek('happy');

      setTimeout(() => {
        setSelectedId(null);
        if (qIdx + 1 >= questions.length) {
          const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          setTimeout(() => onComplete(starsEarned), 3200);
        } else {
          setQIdx(q => q + 1);
          setPhase('playing');
        }
      }, 1000);
    } else {
      playBoing();
      setSelectedId(ld.letter);
      setPhase('wrong');
      setMistakes(m => m + 1);
      setStreak(0);
      setTimeout(() => { setSelectedId(null); setPhase('playing'); }, 600);
    }
  }, [phase, currentQ, qIdx, questions.length, streak, mistakes, burst, peek, celebrate, onComplete]);

  if (!currentQ) return null;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <ClassroomScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        ⭐ {score} {streak >= 3 && <span className="animate-bounce inline-block">🔥{streak}</span>}
      </div>

      {/* Show the letter */}
      <div className="relative z-10 pt-16 text-center">
        <p className="font-heading text-amber-800/60 text-sm mb-2">Which picture is...</p>
        <div className="inline-block bg-white/95 rounded-3xl px-8 py-4 shadow-2xl border-4 border-amber-200"
          style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <span className="text-7xl font-heading text-amber-800">{currentQ.correct.letter}</span>
        </div>
        {/* Replay sound */}
        <button onPointerDown={() => playLetterSound(currentQ.correct)}
          className="ml-3 inline-block bg-amber-400/30 rounded-full w-14 h-14 text-xl active:scale-90 transition-transform align-middle">
          🔊
        </button>
      </div>

      {/* Picture options */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className={`grid gap-3 w-full max-w-lg ${currentQ.options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {currentQ.options.map((ld, i) => {
            const isSelected = selectedId === ld.letter;
            let borderColor = '#e5e7eb';
            if (isSelected && phase === 'correct') borderColor = '#22c55e';
            if (isSelected && phase === 'wrong') borderColor = '#ef4444';

            return (
              <button key={ld.letter} onPointerDown={() => pickOption(ld)}
                className={`rounded-3xl flex flex-col items-center justify-center gap-2 p-4
                  cursor-pointer border-4 transition-all
                  ${isSelected && phase === 'wrong' ? 'animate-wiggle' : ''}
                  ${isSelected && phase === 'correct' ? 'scale-110' : 'active:scale-95'}`}
                style={{
                  backgroundColor: '#fff', borderColor,
                  boxShadow: isSelected ? `0 0 20px ${borderColor}60` : '0 4px 12px rgba(0,0,0,0.1)',
                  touchAction: 'none', aspectRatio: '1',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
                }}>
                <span className="text-5xl sm:text-6xl">{ld.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < qIdx ? 'bg-amber-400' : i === qIdx ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Match-letter mode: see a picture, pick the matching letter ── */
function MatchLetterLevel({ level, onComplete, onBack }) {
  const letters = getLettersForLevel(level);
  const [questions] = useState(() => {
    return Array.from({ length: level.questions }, () => {
      const correct = letters[Math.floor(Math.random() * letters.length)];
      const wrong = shuffle(letters.filter(l => l.letter !== correct.letter)).slice(0, level.options - 1);
      return { correct, options: shuffle([correct, ...wrong]) };
    });
  });
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const currentQ = questions[qIdx];

  const pickOption = useCallback((ld) => {
    if (phase !== 'playing') return;
    playLetterSound(ld);

    if (ld.letter === currentQ.correct.letter) {
      playSuccess();
      setSelectedId(ld.letter);
      setPhase('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);

      burst(window.innerWidth / 2, window.innerHeight / 2, {
        count: 10, spread: 50, colors: ['#facc15', '#22c55e', '#ec4899'], shapes: ['star', 'heart'],
      });
      if (streak + 1 >= 3) peek('excited'); else peek('happy');

      setTimeout(() => {
        setSelectedId(null);
        if (qIdx + 1 >= questions.length) {
          const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
          celebrate({ duration: 3000 });
          setTimeout(() => onComplete(starsEarned), 3200);
        } else {
          setQIdx(q => q + 1);
          setPhase('playing');
        }
      }, 1000);
    } else {
      playBoing();
      setSelectedId(ld.letter);
      setPhase('wrong');
      setMistakes(m => m + 1);
      setStreak(0);
      setTimeout(() => { setSelectedId(null); setPhase('playing'); }, 600);
    }
  }, [phase, currentQ, qIdx, questions.length, streak, mistakes, burst, peek, celebrate, onComplete]);

  if (!currentQ) return null;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <ClassroomScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1
                      font-heading text-amber-800 text-sm border border-white/40">
        ⭐ {score} {streak >= 3 && <span className="animate-bounce inline-block">🔥{streak}</span>}
      </div>

      {/* Show the picture */}
      <div className="relative z-10 pt-16 text-center">
        <p className="font-heading text-amber-800/60 text-sm mb-2">Which letter starts...</p>
        <div className="inline-block bg-white/95 rounded-3xl px-8 py-4 shadow-2xl border-4 border-amber-200"
          style={{ animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <span className="text-7xl">{currentQ.correct.emoji}</span>
        </div>
      </div>

      {/* Letter options */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className="flex gap-3 flex-wrap justify-center">
          {currentQ.options.map((ld, i) => {
            const isSelected = selectedId === ld.letter;
            const colours = {
              A: '#ef4444', B: '#f97316', C: '#facc15', D: '#22c55e', E: '#3b82f6',
              F: '#8b5cf6', G: '#ec4899', H: '#14b8a6', I: '#ef4444', J: '#f97316',
              K: '#facc15', L: '#22c55e', M: '#3b82f6', N: '#8b5cf6', O: '#ec4899',
              P: '#14b8a6', Q: '#ef4444', R: '#f97316', S: '#facc15', T: '#22c55e',
              U: '#3b82f6', V: '#8b5cf6', W: '#ec4899', X: '#14b8a6', Y: '#ef4444', Z: '#f97316',
            };
            const colour = colours[ld.letter] || '#6b7280';
            let borderColor = colour + '60';
            if (isSelected && phase === 'correct') borderColor = '#22c55e';
            if (isSelected && phase === 'wrong') borderColor = '#ef4444';

            return (
              <button key={ld.letter} onPointerDown={() => pickOption(ld)}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center
                  cursor-pointer border-4 transition-all
                  ${isSelected && phase === 'wrong' ? 'animate-wiggle' : ''}
                  ${isSelected && phase === 'correct' ? 'scale-110' : 'active:scale-95'}`}
                style={{
                  backgroundColor: isSelected && phase === 'correct' ? '#dcfce7' : '#fff',
                  borderColor,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  touchAction: 'none',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                }}>
                <span className="text-4xl font-heading" style={{ color: colour }}>{ld.letter}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex gap-2 justify-center z-20">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < qIdx ? 'bg-amber-400' : i === qIdx ? 'bg-white scale-125 border-2 border-amber-300' : 'bg-amber-900/20'
          }`} />
        ))}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Order mode: tap letters in ABC order ── */
function OrderLevel({ level, onComplete, onBack }) {
  const letters = getLettersForLevel(level);
  const [nextIdx, setNextIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const shuffledLetters = useState(() => shuffle(letters))[0];
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const tapLetter = useCallback((ld) => {
    if (ld.letter === letters[nextIdx].letter) {
      playPop();
      playLetterSound(ld);
      setCompleted(prev => [...prev, ld.letter]);
      setNextIdx(n => n + 1);

      burst(window.innerWidth / 2, window.innerHeight * 0.3, {
        count: 6, spread: 30, colors: ['#facc15', '#22c55e'], shapes: ['star'],
      });

      if (nextIdx + 1 >= letters.length) {
        playFanfare();
        const starsEarned = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
        celebrate({ duration: 3000 });
        peek('excited');
        setTimeout(() => onComplete(starsEarned), 3200);
      } else {
        peek('happy');
      }
    } else {
      playBoing();
      setWrongId(ld.letter);
      setMistakes(m => m + 1);
      setTimeout(() => setWrongId(null), 400);
    }
  }, [nextIdx, letters, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <ClassroomScene />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 pt-16 pb-2 text-center">
        <h2 className="font-heading text-amber-900 text-xl">🔠 Tap in ABC order!</h2>
      </div>

      {/* Completed letters display */}
      <div className="relative z-10 flex justify-center gap-1 px-4 mb-4">
        {letters.map((ld, i) => (
          <div key={ld.letter}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg border-2 transition-all ${
              completed.includes(ld.letter)
                ? 'bg-green-100 border-green-400 text-green-700'
                : i === nextIdx
                  ? 'bg-amber-50 border-amber-400 text-amber-400 animate-pulse'
                  : 'bg-white/50 border-gray-200 text-gray-300'
            }`}>
            {completed.includes(ld.letter) ? ld.letter : '?'}
          </div>
        ))}
      </div>

      {/* Shuffled letter buttons */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4">
        <div className="flex gap-2 flex-wrap justify-center max-w-lg">
          {shuffledLetters.map((ld, i) => {
            const isDone = completed.includes(ld.letter);
            const isWrong = wrongId === ld.letter;
            const colours = {
              A: '#ef4444', B: '#f97316', C: '#facc15', D: '#22c55e', E: '#3b82f6',
              F: '#8b5cf6', G: '#ec4899', H: '#14b8a6', I: '#ef4444', J: '#f97316',
              K: '#facc15', L: '#22c55e', M: '#3b82f6', N: '#8b5cf6', O: '#ec4899',
              P: '#14b8a6', Q: '#ef4444', R: '#f97316', S: '#facc15', T: '#22c55e',
              U: '#3b82f6', V: '#8b5cf6', W: '#ec4899', X: '#14b8a6', Y: '#ef4444', Z: '#f97316',
            };
            const colour = colours[ld.letter] || '#6b7280';

            return (
              <button key={ld.letter} onPointerDown={() => !isDone && tapLetter(ld)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all
                  ${isDone ? 'opacity-30 scale-90' : 'active:scale-90 cursor-pointer'}
                  ${isWrong ? 'animate-wiggle border-red-400' : ''}`}
                style={{
                  backgroundColor: isDone ? '#e5e7eb' : '#fff',
                  borderColor: isDone ? '#d1d5db' : isWrong ? '#ef4444' : colour + '60',
                  touchAction: 'none',
                  animation: `pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s both`,
                }}>
                <span className="text-3xl font-heading" style={{ color: isDone ? '#9ca3af' : colour }}>
                  {ld.letter}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Main export with level selection ── */
export default function ABCAdventure() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('abc-adventure', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    if (currentLevel < totalLevels) {
      setLevel(currentLevel + 1);
    } else {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, setLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🔤 ABC Adventure"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #FFF8F0 0%, #fde68a 50%, #FFF8F0 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const level = LEVELS[currentLevel - 1];

  if (level.mode === 'explore') {
    return <ExploreLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (level.mode === 'match-pic') {
    return <MatchPicLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (level.mode === 'match-letter') {
    return <MatchLetterLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }
  if (level.mode === 'order') {
    return <OrderLevel key={currentLevel} level={level} onComplete={handleComplete} onBack={backToLevels} />;
  }

  return null;
}
