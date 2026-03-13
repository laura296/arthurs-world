import { useCallback, useRef, useState } from 'react';

const MAX_TILT = 8; // degrees

/**
 * 3D-tilt card with shine overlay and depth shadows.
 * Drop-in replacement for <button> on hub/grid screens.
 *
 * Props: onClick, className, style, children, disabled, tiltScale (default 1.03)
 */
export default function TiltCard({
  children,
  onClick,
  className = '',
  style = {},
  disabled = false,
  tiltScale = 1.03,
  ...rest
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const rafRef = useRef(null);

  const updateTilt = useCallback((clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);  // -1 to 1
    const dy = (clientY - cy) / (rect.height / 2);  // -1 to 1

    // Rotate around opposite axis: pointer right → rotateY positive
    const rotY = dx * MAX_TILT;
    const rotX = -dy * MAX_TILT;

    // Shine position as percentage
    const shineX = ((clientX - rect.left) / rect.width) * 100;
    const shineY = ((clientY - rect.top) / rect.height) * 100;

    // Shadow shifts opposite to tilt
    const shadowX = -dx * 8;
    const shadowY = -dy * 8;

    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${tiltScale})`;
    el.style.boxShadow = `${shadowX}px ${shadowY}px 24px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)`;
    el.style.setProperty('--shine-x', `${shineX}%`);
    el.style.setProperty('--shine-y', `${shineY}%`);
  }, [tiltScale]);

  const resetTilt = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transform = '';
    el.style.boxShadow = '';
    setActive(false);
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (disabled) return;
    setActive(true);
    updateTilt(e.clientX, e.clientY);
  }, [disabled, updateTilt]);

  const handlePointerMove = useCallback((e) => {
    if (!active || disabled) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateTilt(e.clientX, e.clientY);
    });
  }, [active, disabled, updateTilt]);

  const handlePointerUp = useCallback(() => {
    resetTilt();
  }, [resetTilt]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`tilt-card ${active ? 'tilt-active' : ''} ${className}`}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...rest}
    >
      <div className="tilt-card-inner">
        {children}
        <div className="tilt-card-shine" />
      </div>
    </button>
  );
}
