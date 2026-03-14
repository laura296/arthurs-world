import { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

/**
 * Rive character wrapper with state machine integration.
 *
 * Props:
 *   src: path to .riv file (e.g., '/assets/spritesheets/arthur-emotions.riv')
 *   stateMachine: name of the state machine (default 'emotions')
 *   inputName: name of the numeric input to drive (default 'currentEmotion')
 *   inputValue: numeric value to set (maps to emotion states in the .riv file)
 *   width: render width (default 300)
 *   height: render height (default 300)
 *   className: additional CSS classes
 *   autoplay: auto-play on mount (default true)
 */
export default function RiveCharacter({
  src,
  stateMachine = 'emotions',
  inputName = 'currentEmotion',
  inputValue = 0,
  width = 300,
  height = 300,
  className = '',
  autoplay = true,
}) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay,
  });

  const input = useStateMachineInput(rive, stateMachine, inputName);

  useEffect(() => {
    if (input) {
      input.value = inputValue;
    }
  }, [input, inputValue]);

  return (
    <RiveComponent
      className={className}
      style={{ width, height }}
    />
  );
}
