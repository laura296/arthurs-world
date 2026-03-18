import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ArthurBear from '@shared/components/ArthurBear';
import GameErrorBoundary from '@shared/components/GameErrorBoundary';
import PageTransition from '@shared/components/PageTransition';

// Home
const HomeGrid = lazy(() => import('./pages/HomeGrid'));

// Action Games
const BubblePop = lazy(() => import('@shared/games/BubblePop'));
const FeedAnimals = lazy(() => import('@shared/games/FeedAnimals'));
const PopCritters = lazy(() => import('@shared/games/PopCritters'));
const BuildAScene = lazy(() => import('@shared/games/BuildAScene'));
const StackBricks = lazy(() => import('@shared/games/StackBricks'));
const OddOnePicks = lazy(() => import('@shared/games/OddOnePicks'));

// Puzzles
const MemoryMatch = lazy(() => import('@shared/games/MemoryMatch'));
const ShapeMatch = lazy(() => import('@shared/games/ShapeMatch'));
const CountingGarden = lazy(() => import('@shared/games/CountingGarden'));
const ColourSort = lazy(() => import('@shared/games/ColourSort'));
const ABCAdventure = lazy(() => import('@shared/games/ABCAdventure'));
const NumberLine = lazy(() => import('@shared/games/NumberLine'));

// Art
const ColouringBook = lazy(() => import('@shared/games/ColouringBook'));
const Colouring = lazy(() => import('@shared/games/Colouring'));
const DotArt = lazy(() => import('@shared/games/DotArt'));
const StampArt = lazy(() => import('@shared/games/StampArt'));

// Disney Adventures
const FairyDust = lazy(() => import('@shared/games/FairyDust'));
const HadesRiverStyx = lazy(() => import('@shared/games/HadesRiverStyx'));
const UrsulaPotions = lazy(() => import('@shared/games/UrsulaPotions'));
const HoneyHunt = lazy(() => import('@shared/games/HoneyHunt'));
const InsideOutHub = lazy(() => import('@shared/games/inside-out/InsideOutHub'));
const ControlPanelMeltdown = lazy(() => import('@shared/games/inside-out/ControlPanelMeltdown'));
const AngerCoolDown = lazy(() => import('@shared/games/inside-out/AngerCoolDown'));
const AlarmAvalanche = lazy(() => import('@shared/games/inside-out/AlarmAvalanche'));
const ChainReactionCrisis = lazy(() => import('@shared/games/inside-out/ChainReactionCrisis'));
const PuppyWash = lazy(() => import('@shared/games/PuppyWash'));
const TortoiseHareRace = lazy(() => import('@shared/games/TortoiseHareRace'));
const MadHatterTeaParty = lazy(() => import('@shared/games/alice/MadHatterTeaParty'));

// Self-Care
const MorningRoutine = lazy(() => import('@shared/games/MorningRoutine'));
const SparkleTeeth = lazy(() => import('@shared/games/SparkleTeeth'));
const ArthursLunchbox = lazy(() => import('@shared/games/ArthursLunchbox'));

// Halloween
const PumpkinPatch = lazy(() => import('@shared/games/halloween/PumpkinPatch'));
const GhostPeekaboo = lazy(() => import('@shared/games/halloween/GhostPeekaboo'));
const TrickOrTreat = lazy(() => import('@shared/games/halloween/TrickOrTreat'));
const SpookySounds = lazy(() => import('@shared/games/halloween/SpookySounds'));
const WitchFlight = lazy(() => import('@shared/games/halloween/WitchFlight'));

// Easter
const EasterEggHunt = lazy(() => import('@shared/games/easter/EasterEggHunt'));
const PaintEasterEggs = lazy(() => import('@shared/games/easter/PaintEasterEggs'));
const BunnyHop = lazy(() => import('@shared/games/easter/BunnyHop'));
const HatchingChicks = lazy(() => import('@shared/games/easter/HatchingChicks'));

// ── Loading Screen ──
const LOADING_MESSAGES = ['Getting ready...', 'Loading fun...', 'Almost there...'];

function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
      <ArthurBear expression="excited" size={80} className="animate-float" />
      <span className="text-xl font-heading text-sun/80">{LOADING_MESSAGES[msgIdx]}</span>
    </div>
  );
}

// ── Route wrappers ──
const E = ({ children }) => <GameErrorBoundary>{children}</GameErrorBoundary>;
const P = ({ children }) => <PageTransition>{children}</PageTransition>;
const W = ({ children }) => <E><P>{children}</P></E>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<P><HomeGrid /></P>} />

      {/* Action */}
      <Route path="/bubble-pop" element={<W><BubblePop /></W>} />
      <Route path="/feed-animals" element={<W><FeedAnimals /></W>} />
      <Route path="/pop-critters" element={<W><PopCritters /></W>} />
      <Route path="/build-a-scene" element={<W><BuildAScene /></W>} />
      <Route path="/stack-bricks" element={<W><StackBricks /></W>} />
      <Route path="/odd-one-picks" element={<W><OddOnePicks /></W>} />

      {/* Puzzles */}
      <Route path="/memory-match" element={<W><MemoryMatch /></W>} />
      <Route path="/shape-match" element={<W><ShapeMatch /></W>} />
      <Route path="/counting-garden" element={<W><CountingGarden /></W>} />
      <Route path="/colour-sort" element={<W><ColourSort /></W>} />
      <Route path="/abc-adventure" element={<W><ABCAdventure /></W>} />
      <Route path="/number-line" element={<W><NumberLine /></W>} />

      {/* Art */}
      <Route path="/colouring-book" element={<W><ColouringBook /></W>} />
      <Route path="/free-art" element={<W><Colouring /></W>} />
      <Route path="/dot-art" element={<W><DotArt /></W>} />
      <Route path="/stamp-art" element={<W><StampArt /></W>} />

      {/* Disney Adventures */}
      <Route path="/fairy-dust" element={<W><FairyDust /></W>} />
      <Route path="/hades-river-styx" element={<W><HadesRiverStyx /></W>} />
      <Route path="/ursula-potions" element={<W><UrsulaPotions /></W>} />
      <Route path="/honey-hunt" element={<W><HoneyHunt /></W>} />
      <Route path="/inside-out-hub" element={<W><InsideOutHub /></W>} />
      <Route path="/control-panel-meltdown" element={<W><ControlPanelMeltdown /></W>} />
      <Route path="/anger-cool-down" element={<W><AngerCoolDown /></W>} />
      <Route path="/alarm-avalanche" element={<W><AlarmAvalanche /></W>} />
      <Route path="/chain-reaction-crisis" element={<W><ChainReactionCrisis /></W>} />
      <Route path="/puppy-wash" element={<W><PuppyWash /></W>} />
      <Route path="/tortoise-hare-race" element={<W><TortoiseHareRace /></W>} />
      <Route path="/mad-hatter-tea-party" element={<W><MadHatterTeaParty /></W>} />

      {/* Self-Care */}
      <Route path="/morning-routine" element={<W><MorningRoutine /></W>} />
      <Route path="/sparkle-teeth" element={<W><SparkleTeeth /></W>} />
      <Route path="/arthurs-lunchbox" element={<W><ArthursLunchbox /></W>} />

      {/* Halloween */}
      <Route path="/pumpkin-patch" element={<W><PumpkinPatch /></W>} />
      <Route path="/ghost-peekaboo" element={<W><GhostPeekaboo /></W>} />
      <Route path="/trick-or-treat" element={<W><TrickOrTreat /></W>} />
      <Route path="/spooky-sounds" element={<W><SpookySounds /></W>} />
      <Route path="/witch-flight" element={<W><WitchFlight /></W>} />

      {/* Easter */}
      <Route path="/easter-egg-hunt" element={<W><EasterEggHunt /></W>} />
      <Route path="/paint-easter-eggs" element={<W><PaintEasterEggs /></W>} />
      <Route path="/bunny-hop" element={<W><BunnyHop /></W>} />
      <Route path="/hatching-chicks" element={<W><HatchingChicks /></W>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}
