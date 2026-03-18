import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ArthurBear from '@shared/components/ArthurBear';
import GameErrorBoundary from '@shared/components/GameErrorBoundary';
import PageTransition from '@shared/components/PageTransition';

// Home
const HomeGrid = lazy(() => import('./pages/HomeGrid'));

// Fairy Tales
const FarmBook = lazy(() => import('@shared/games/FarmBook'));
const ThreeLittlePigs = lazy(() => import('@shared/stories/ThreeLittlePigs'));
const Goldilocks = lazy(() => import('@shared/stories/Goldilocks'));
const RedRidingHood = lazy(() => import('@shared/stories/RedRidingHood'));
const EllieStorybook = lazy(() => import('@shared/stories/ellie/EllieStorybook'));

// Kipling — Just So Stories
const WhaleThroat = lazy(() => import('@shared/stories/WhaleThroat'));
const CamelHump = lazy(() => import('@shared/stories/CamelHump'));
const RhinoSkin = lazy(() => import('@shared/stories/RhinoSkin'));
const LeopardSpots = lazy(() => import('@shared/stories/LeopardSpots'));
const ElephantChild = lazy(() => import('@shared/stories/ElephantChild'));
const OldManKangaroo = lazy(() => import('@shared/stories/OldManKangaroo'));
const Armadillos = lazy(() => import('@shared/stories/Armadillos'));
const FirstLetter = lazy(() => import('@shared/stories/FirstLetter'));
const AlphabetMade = lazy(() => import('@shared/stories/AlphabetMade'));
const CrabSea = lazy(() => import('@shared/stories/CrabSea'));
const CatWalked = lazy(() => import('@shared/stories/CatWalked'));
const ButterflyStamped = lazy(() => import('@shared/stories/ButterflyStamped'));

// Feelings
const FeelingsMonster = lazy(() => import('@shared/stories/feelings/FeelingsMonster'));
const WhenIFeelBig = lazy(() => import('@shared/stories/feelings/WhenIFeelBig'));
const MyFeelingsFriends = lazy(() => import('@shared/stories/feelings/MyFeelingsFriends'));

// Aesop's Fables
const TortoiseAndHare = lazy(() => import('@shared/stories/aesop/TortoiseAndHare'));
const LionAndMouse = lazy(() => import('@shared/stories/aesop/LionAndMouse'));
const BoyWhoCriedWolf = lazy(() => import('@shared/stories/aesop/BoyWhoCriedWolf'));
const AntAndGrasshopper = lazy(() => import('@shared/stories/aesop/AntAndGrasshopper'));
const FoxAndGrapes = lazy(() => import('@shared/stories/aesop/FoxAndGrapes'));
const TownMouseCountryMouse = lazy(() => import('@shared/stories/aesop/TownMouseCountryMouse'));

// Disney Stories
const Cinderella = lazy(() => import('@shared/stories/disney/Cinderella'));
const SnowWhite = lazy(() => import('@shared/stories/disney/SnowWhite'));
const CaptainHook = lazy(() => import('@shared/stories/disney/CaptainHook'));
const WinnieThePooh = lazy(() => import('@shared/stories/disney/WinnieThePooh'));

// Easter Story
const SpringEggHunt = lazy(() => import('@shared/stories/easter/SpringEggHunt'));

// ── Loading Screen ──
const LOADING_MESSAGES = ['Opening the book...', 'Turning pages...', 'Almost ready...'];

function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-aw-warm gap-4">
      <ArthurBear expression="happy" size={80} className="animate-float" />
      <span className="text-xl font-heading text-amber-800/80">{LOADING_MESSAGES[msgIdx]}</span>
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

      {/* Fairy Tales */}
      <Route path="/farm-book" element={<W><FarmBook /></W>} />
      <Route path="/three-pigs" element={<W><ThreeLittlePigs /></W>} />
      <Route path="/goldilocks" element={<W><Goldilocks /></W>} />
      <Route path="/red-riding" element={<W><RedRidingHood /></W>} />
      <Route path="/ellie-tiny-folk" element={<W><EllieStorybook /></W>} />

      {/* Kipling */}
      <Route path="/whale-throat" element={<W><WhaleThroat /></W>} />
      <Route path="/camel-hump" element={<W><CamelHump /></W>} />
      <Route path="/rhino-skin" element={<W><RhinoSkin /></W>} />
      <Route path="/leopard-spots" element={<W><LeopardSpots /></W>} />
      <Route path="/elephant-child" element={<W><ElephantChild /></W>} />
      <Route path="/old-man-kangaroo" element={<W><OldManKangaroo /></W>} />
      <Route path="/armadillos" element={<W><Armadillos /></W>} />
      <Route path="/first-letter" element={<W><FirstLetter /></W>} />
      <Route path="/alphabet-made" element={<W><AlphabetMade /></W>} />
      <Route path="/crab-sea" element={<W><CrabSea /></W>} />
      <Route path="/cat-walked" element={<W><CatWalked /></W>} />
      <Route path="/butterfly-stamped" element={<W><ButterflyStamped /></W>} />

      {/* Feelings */}
      <Route path="/feelings-monster" element={<W><FeelingsMonster /></W>} />
      <Route path="/when-i-feel-big" element={<W><WhenIFeelBig /></W>} />
      <Route path="/feelings-friends" element={<W><MyFeelingsFriends /></W>} />

      {/* Aesop */}
      <Route path="/tortoise-hare" element={<W><TortoiseAndHare /></W>} />
      <Route path="/lion-mouse" element={<W><LionAndMouse /></W>} />
      <Route path="/boy-cried-wolf" element={<W><BoyWhoCriedWolf /></W>} />
      <Route path="/ant-grasshopper" element={<W><AntAndGrasshopper /></W>} />
      <Route path="/fox-grapes" element={<W><FoxAndGrapes /></W>} />
      <Route path="/town-country-mouse" element={<W><TownMouseCountryMouse /></W>} />

      {/* Disney */}
      <Route path="/cinderella" element={<W><Cinderella /></W>} />
      <Route path="/snow-white" element={<W><SnowWhite /></W>} />
      <Route path="/captain-hook" element={<W><CaptainHook /></W>} />
      <Route path="/winnie-the-pooh" element={<W><WinnieThePooh /></W>} />

      {/* Easter */}
      <Route path="/spring-egg-hunt" element={<W><SpringEggHunt /></W>} />

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
