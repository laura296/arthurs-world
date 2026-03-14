import { useState } from 'react';
import Lottie from 'lottie-react';

/**
 * Play-once Lottie effect that unmounts after completion.
 *
 * Props:
 *   animationData: Lottie JSON data (imported or fetched)
 *   loop: boolean (default false — play once and unmount)
 *   speed: playback speed multiplier (default 1)
 *   className: positioned container classes (default: fixed fullscreen)
 *   onComplete: callback when animation finishes
 *   style: additional inline styles
 */
export default function LottieEffect({
  animationData,
  loop = false,
  speed = 1,
  className = 'fixed inset-0 z-[300] pointer-events-none',
  onComplete,
  style,
}) {
  const [visible, setVisible] = useState(true);

  if (!visible || !animationData) return null;

  return (
    <div className={className} style={style}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay
        style={{ width: '100%', height: '100%' }}
        onComplete={() => {
          if (!loop) setVisible(false);
          onComplete?.();
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
      />
    </div>
  );
}
