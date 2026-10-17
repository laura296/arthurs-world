import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import RoundBack from './RoundBack';
import TemplateArt, { templateMaskUrl } from './TemplateArt';
import { TEMPLATES } from './worlds';
import { buildSprite, grainCanvas } from './sprite';
import { playTap, playPop, playPoof, playWhoosh, playSparkle } from '../../hooks/useSound';

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#14b8a6', '#38bdf8',
  '#6366f1', '#a855f7', '#ec4899', '#92400e', '#1e293b',
];
const RAINBOW = 'conic-gradient(#ef4444,#f97316,#facc15,#22c55e,#38bdf8,#8b5cf6,#ec4899,#ef4444)';
const MAX_UNDO = 15;

/**
 * Drawing paper for Draw Alive. Colour in a creature (or draw your own),
 * then send it off into the world.
 *
 * Props:
 *   world   — WORLDS entry the creature will live in
 *   onSend  — (sprite) => void, called once the paper has flown away
 *   onBack  — () => void
 *   burst   — particle burst from useParticleBurst
 */
export default function DrawPad({ world, onSend, onBack, burst }) {
  const areaRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(null);
  const hue = useRef(0);
  const history = useRef([]);

  const [templateId, setTemplateId] = useState(world.templates[0]);
  const [color, setColor] = useState(PALETTE[0]);
  const [rainbow, setRainbow] = useState(false);
  const [base, setBase] = useState('#ffffff');
  const [hasInk, setHasInk] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [sending, setSending] = useState(null);
  const [paperSize, setPaperSize] = useState(0);
  const [grainUrl] = useState(() => grainCanvas().toDataURL());

  const template = templateId ? TEMPLATES[templateId] : null;
  const ready = !!template || hasInk;

  /* Paper is the largest square that fits the middle column */
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const measure = () => setPaperSize(Math.floor(Math.min(area.clientWidth, area.clientHeight)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(area);
    return () => ro.disconnect();
  }, []);

  /* Keep the canvas matched to the paper, preserving what's drawn */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !paperSize) return;
    const px = Math.round(paperSize * (window.devicePixelRatio || 1));
    if (c.width === px) return;
    const keep = document.createElement('canvas');
    keep.width = c.width || 1;
    keep.height = c.height || 1;
    keep.getContext('2d').drawImage(c, 0, 0);
    c.width = px;
    c.height = px;
    c.getContext('2d').drawImage(keep, 0, 0, px, px);
    history.current = [];
    setCanUndo(false);
  }, [paperSize]);

  const snapshot = useCallback(() => {
    const c = canvasRef.current;
    history.current.push({
      image: c.getContext('2d').getImageData(0, 0, c.width, c.height),
      base,
      hasInk,
    });
    if (history.current.length > MAX_UNDO) history.current.shift();
    setCanUndo(true);
  }, [base, hasInk]);

  const wipe = useCallback(() => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    history.current = [];
    setCanUndo(false);
    setHasInk(false);
    setBase('#ffffff');
  }, []);

  /* ── Drawing ── */
  const point = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const k = c.width / rect.width;
    return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
  };

  const strokeTo = (from, to) => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = c.width * 0.045;
    if (rainbow) {
      hue.current = (hue.current + 4) % 360;
      ctx.strokeStyle = `hsl(${hue.current}, 90%, 55%)`;
    } else {
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
  };

  const onDown = (e) => {
    if (drawing.current || sending) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    snapshot();
    const p = point(e);
    drawing.current = { id: e.pointerId, last: p };
    strokeTo(p, p);
    if (!hasInk) setHasInk(true);
  };

  const onMove = (e) => {
    const d = drawing.current;
    if (!d || d.id !== e.pointerId) return;
    e.preventDefault();
    const events = e.nativeEvent.getCoalescedEvents?.() || [e.nativeEvent];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const p = point(ev);
      strokeTo(d.last, p);
      d.last = p;
    }
  };

  const onUp = (e) => {
    if (drawing.current?.id === e.pointerId) drawing.current = null;
  };

  /* ── Tools ── */
  const pickColour = (c) => {
    setColor(c);
    setRainbow(false);
    playTap();
  };

  const bucket = () => {
    snapshot();
    setBase(rainbow ? `hsl(${Math.floor(Math.random() * 360)}, 85%, 70%)` : color);
    playSparkle();
  };

  const undo = () => {
    const prev = history.current.pop();
    if (!prev) return;
    canvasRef.current.getContext('2d').putImageData(prev.image, 0, 0);
    setBase(prev.base);
    setHasInk(prev.hasInk);
    setCanUndo(history.current.length > 0);
    playPoof();
  };

  const clear = () => {
    wipe();
    playWhoosh();
  };

  const chooseTemplate = (id) => {
    if (id === templateId) return;
    wipe();
    setTemplateId(id);
    playPop();
  };

  const send = () => {
    if (!ready || sending) return;
    const sprite = buildSprite(canvasRef.current, template, base);
    if (!sprite) return;
    playWhoosh();
    playSparkle();
    const rect = areaRef.current.getBoundingClientRect();
    burst?.(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 18, spread: paperSize * 0.45, colors: ['#facc15', '#ffffff', world.tint, '#ec4899'],
      shapes: ['star', 'diamond', 'circle'], spin: true,
    });
    setSending(sprite);
  };

  const choices = [...world.templates, null];

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* The world waits behind the paper */}
      <img src={world.bg} alt="" draggable={false}
           className="absolute inset-0 w-full h-full object-cover scale-110"
           style={{ filter: 'blur(14px) brightness(0.8) saturate(1.1)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-purple-950/30" />

      <RoundBack onBack={onBack} />

      <div className="absolute inset-0 flex items-stretch gap-3 px-3 py-3">
        {/* ── Left: what to draw + send ── */}
        <div className="flex flex-col items-center justify-between pt-24 pb-1 w-28 flex-shrink-0">
          <div className="flex flex-col gap-3">
            {choices.map(id => {
              const active = id === templateId;
              return (
                <button key={id || 'blank'}
                  onClick={() => chooseTemplate(id)}
                  aria-label={id || 'blank paper'}
                  className={`w-24 h-24 rounded-3xl bg-[#FFFDF7] shadow-aw flex items-center justify-center
                    border-4 transition-all active:scale-90
                    ${active ? 'border-aw-gold scale-105 ring-4 ring-white/70' : 'border-white/70 opacity-90'}`}>
                  {id ? (
                    <TemplateArt template={TEMPLATES[id]} className="w-20 h-20" />
                  ) : (
                    <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
                      <path d="M12 52 C 22 22, 32 62, 42 34 S 60 20, 68 46" fill="none"
                            stroke="url(#da-rainbow)" strokeWidth="8" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="da-rainbow" x1="0" x2="1">
                          <stop offset="0" stopColor="#ef4444" /><stop offset="0.3" stopColor="#facc15" />
                          <stop offset="0.6" stopColor="#22c55e" /><stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Send into the world */}
          <motion.button
            onClick={send}
            aria-label="Send into the world"
            animate={ready ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={ready ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
            className={`relative w-28 h-28 rounded-full overflow-hidden border-[6px] border-white shadow-aw-lg
              transition-opacity ${ready ? 'opacity-100' : 'opacity-40'}`}
          >
            <img src={world.bg} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-14 h-14 drop-shadow-lg" aria-hidden="true">
              <path d="M5 12h12M12 6l6 6-6 6" fill="none" stroke="white" strokeWidth="3.2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {/* ── Centre: the paper ── */}
        <div ref={areaRef} className="flex-1 min-w-0 flex items-center justify-center">
          <motion.div
            className="relative flex-shrink-0 rounded-[2rem] overflow-hidden"
            style={{
              width: paperSize,
              height: paperSize,
              background: 'radial-gradient(circle at 30% 20%, #fffefb 0%, #fdf8ee 60%, #f6eedd 100%)',
              boxShadow: '0 20px 50px rgba(76, 29, 149, 0.35), 0 0 0 6px rgba(255,255,255,0.6)',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={sending
              ? { scale: 0.15, opacity: 0, y: -260, rotate: 14 }
              : { scale: 1, opacity: 1, y: 0, rotate: 0 }}
            transition={sending
              ? { duration: 0.6, ease: [0.5, 0, 0.75, 0] }
              : { type: 'spring', stiffness: 260, damping: 22 }}
            onAnimationComplete={() => { if (sending) onSend(sending); }}
          >
            {template && (
              <TemplateArt template={template} layer="fill" fill={base}
                           className="absolute inset-0 w-full h-full pointer-events-none" />
            )}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{
                touchAction: 'none',
                ...(template ? {
                  WebkitMaskImage: templateMaskUrl(template),
                  maskImage: templateMaskUrl(template),
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                } : {}),
              }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
            {/* Paper grain over the colouring, for a crayon feel */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ backgroundImage: `url(${grainUrl})`, mixBlendMode: 'multiply', opacity: 0.55 }} />
            {template && (
              <TemplateArt template={template} layer="lines"
                           className="absolute inset-0 w-full h-full pointer-events-none" />
            )}
          </motion.div>
        </div>

        {/* ── Right: colours and tools ── */}
        <div className="self-center flex flex-col items-center justify-center gap-3 flex-shrink-0 py-3 px-2 rounded-3xl
                        bg-white/25 backdrop-blur-md border-2 border-white/40">
          <div className="grid grid-cols-2 gap-2">
            {PALETTE.map(c => {
              const active = !rainbow && color === c;
              return (
                <button key={c} onClick={() => pickColour(c)} aria-label="colour"
                  className={`w-12 h-12 rounded-full shadow-md transition-transform active:scale-90
                    ${active ? 'scale-110 ring-4 ring-white' : 'border-2 border-white/70'}`}
                  style={{ backgroundColor: c }} />
              );
            })}
            <button onClick={() => { setRainbow(true); playSparkle(); }} aria-label="rainbow"
              className={`w-12 h-12 rounded-full shadow-md transition-transform active:scale-90
                ${rainbow ? 'scale-110 ring-4 ring-white' : 'border-2 border-white/70'}`}
              style={{ background: RAINBOW }} />
          </div>

          <div className="w-16 h-px bg-white/50" />

          <div className="grid grid-cols-2 gap-2">
            {template && (
              <button onClick={bucket} aria-label="fill"
                className="w-12 h-12 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-2xl active:scale-90">
                🪣
              </button>
            )}
            <button onClick={undo} disabled={!canUndo} aria-label="undo"
              className={`w-12 h-12 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-2xl
                ${canUndo ? 'active:scale-90' : 'opacity-40'}`}>
              ↩️
            </button>
            <button onClick={clear} aria-label="clear"
              className="w-12 h-12 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-2xl active:scale-90">
              🧽
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
