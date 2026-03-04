import { useState, useCallback } from 'react';
import ArthurBear from './ArthurBear';

/**
 * Arthur Peek — shows Arthur's face briefly for mini-win celebrations.
 *
 * Usage:
 *   const { peek, ArthurPeekLayer } = useArthurPeek();
 *   peek('excited');
 *   return <><ArthurPeekLayer /><rest /></>;
 */

let peekIdCounter = 0;

export function useArthurPeek() {
  const [peeks, setPeeks] = useState([]);

  const peek = useCallback((expression = 'excited', position = 'bottom-right') => {
    const id = ++peekIdCounter;
    setPeeks(prev => [...prev, { id, expression, position, phase: 'in' }]);

    setTimeout(() => {
      setPeeks(prev => prev.map(p => p.id === id ? { ...p, phase: 'out' } : p));
    }, 600);

    setTimeout(() => {
      setPeeks(prev => prev.filter(p => p.id !== id));
    }, 1000);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const ArthurPeekLayer = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-[90]">
      {peeks.map(p => (
        <div
          key={p.id}
          className={`absolute ${positionClasses[p.position] || positionClasses['bottom-right']}
                     ${p.phase === 'in' ? 'animate-peek-in' : 'animate-peek-out'}`}
        >
          <ArthurBear expression={p.expression} size={80} mode="face" />
        </div>
      ))}
    </div>
  ), [peeks]);

  return { peek, ArthurPeekLayer };
}
