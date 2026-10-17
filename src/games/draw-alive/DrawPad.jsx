import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import RoundBack from './RoundBack';
import TemplateArt, { templateMaskUrl } from './TemplateArt';
import { buildSprite, grainCanvas, OUTLINE } from './sprite';
import { canRecord, recordVoice, playVoice, VOICE_MS } from './voice';
import { buildWalls, floodRegion, paintRegion, paintStyle } from './fill';
import HintHand from './HintHand';
import { ACCESSORIES, accessoryCanvas, accessoryUrl } from './accessories';
import { TEMPLATES, VIEWBOX } from './worlds';
import { playTap, playPop, playPoof, playWhoosh, playSparkle, playSplash } from '../../hooks/useSound';

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#14b8a6', '#38bdf8',
  '#6366f1', '#a855f7', '#ec4899', '#92400e', '#1e293b', '#ffffff',
];
const RAINBOW = 'conic-gradient(#ef4444,#f97316,#facc15,#22c55e,#38bdf8,#8b5cf6,#ec4899,#ef4444)';
const MAX_UNDO = 8;
const MAX_PX = 1280; // canvas resolution cap, keeps undo memory small on iPad

/** Swatch preview for each special paint, in the current colour. */
const EFFECTS = [
  { id: 'rainbow', look: () => ({ background: RAINBOW }) },
  { id: 'dots', look: c => ({ backgroundColor: c, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 22%, transparent 26%)', backgroundSize: '14px 14px' }) },
  { id: 'stripes', look: c => ({ backgroundColor: c, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.65) 0 5px, transparent 5px 11px)' }) },
  { id: 'glitter', look: c => ({ backgroundColor: c, backgroundImage: 'radial-gradient(circle at 30% 35%, #fff 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, #fef08a 0 2px, transparent 3px), radial-gradient(circle at 45% 75%, #fff 0 1.5px, transparent 2.5px), radial-gradient(circle at 65% 25%, #fbcfe8 0 1.5px, transparent 2.5px)' }) },
];

const SIZES = [1, 1.3, 0.75];

/** Where an accessory sits by default, worked out from the creature's eyes (paper units). */
function defaultSpot(acc, template) {
  const spot = rawSpot(acc, template);
  // Keep it fully on the paper
  const lo = VIEWBOX.x + spot.size / 2, hi = VIEWBOX.x + VIEWBOX.size - spot.size / 2;
  return { ...spot, x: Math.min(hi, Math.max(lo, spot.x)), y: Math.min(hi, Math.max(lo, spot.y)) };
}

function rawSpot(acc, template) {
  const eyes = template?.eyes || [{ x: 100, y: 70, r: 10 }];
  const ex = eyes.reduce((s, e) => s + e.x, 0) / eyes.length;
  const ey = eyes.reduce((s, e) => s + e.y, 0) / eyes.length;
  const span = Math.max(...eyes.map(e => e.x + e.r)) - Math.min(...eyes.map(e => e.x - e.r));
  switch (acc.place) {
    case 'top': return { x: ex, y: ey - 34, size: 64 };
    case 'eyes': return { x: ex, y: ey, size: Math.max(44, span * 2.2) };
    case 'face': return { x: ex, y: ey + 22, size: 46 };
    case 'neck': return { x: ex, y: ey + 46, size: 44 };
    default: return { x: ex + 24, y: ey - 22, size: 40 };
  }
}

const btn = 'w-12 h-12 rounded-2xl shadow-md flex items-center justify-center active:scale-90 transition-transform';

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
  const pendingFill = useRef(null);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);
  const sendRef = useRef(null);
  const paperRef = useRef(null);
  const [activity, setActivity] = useState(0);
  const [panel, setPanel] = useState('paint');
  const [dressing, setDressing] = useState([]);
  const dragAcc = useRef(null);
  const hue = useRef(0);
  const history = useRef([]);

  const [templateId, setTemplateId] = useState(world.templates[0]);
  const [color, setColor] = useState(PALETTE[0]);
  const [effect, setEffect] = useState('plain');
  const [tool, setTool] = useState('fill');
  const [thick, setThick] = useState(true);
  const walls = useRef({ key: null, map: null });
  const [hasInk, setHasInk] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [sending, setSending] = useState(null);
  const [paperSize, setPaperSize] = useState(0);
  const [voice, setVoice] = useState(null);
  const [recording, setRecording] = useState(false);
  const [micOk, setMicOk] = useState(canRecord);
  const [grainUrl] = useState(() => grainCanvas().toDataURL());

  const template = templateId ? TEMPLATES[templateId] : null;
  const ready = !!template || hasInk || dressing.length > 0;

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
    const px = Math.round(Math.min(MAX_PX, paperSize * (window.devicePixelRatio || 1)));
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
      image: c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height),
      hasInk,
    });
    if (history.current.length > MAX_UNDO) history.current.shift();
    setCanUndo(true);
  }, [hasInk]);

  const wipe = useCallback(() => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    history.current = [];
    setCanUndo(false);
    setHasInk(false);
  }, []);

  /* ── Drawing ── */
  const point = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const k = c.width / rect.width;
    return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
  };

  const patternScale = () => canvasRef.current.width / 640;

  const strokeTo = (from, to) => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = c.width * 0.06;
      ctx.strokeStyle = '#000';
    } else {
      ctx.lineWidth = c.width * (thick ? 0.045 : 0.016);
      if (effect === 'rainbow') {
        hue.current = (hue.current + 4) % 360;
        ctx.strokeStyle = `hsl(${hue.current}, 90%, 55%)`;
      } else {
        ctx.strokeStyle = paintStyle(ctx, color, effect, patternScale());
      }
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
    ctx.restore();
  };

  /* Magic bucket: fill just the area that was tapped */
  const fillAt = (p, e) => {
    const c = canvasRef.current;
    const W = c.width, H = c.height;
    const x = Math.max(0, Math.min(W - 1, Math.floor(p.x)));
    const y = Math.max(0, Math.min(H - 1, Math.floor(p.y)));
    let wallMap = null;
    if (template) {
      const key = `${template.id}|${W}`;
      if (walls.current.key !== key) walls.current = { key, map: buildWalls(template, W) };
      wallMap = walls.current.map;
    }
    // A tap right on a line still counts: use the nearest spot beside it
    let sx = x, sy = y;
    if (wallMap && wallMap[y * W + x]) {
      const reach = Math.ceil(W / 220 * 5);
      let best = Infinity;
      for (let dy = -reach; dy <= reach; dy += 2) {
        for (let dx = -reach; dx <= reach; dx += 2) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H || wallMap[ny * W + nx]) continue;
          const d = dx * dx + dy * dy;
          if (d < best) { best = d; sx = nx; sy = ny; }
        }
      }
    }
    const ctx = c.getContext('2d', { willReadFrequently: true });
    // On a template the lines decide the areas, so re-colouring stripes or rainbow fills the whole area
    const region = floodRegion(ctx.getImageData(0, 0, W, H).data, wallMap, W, H, sx, sy, template ? Infinity : 46);
    // On blank paper, only fill shapes Arthur has closed in, not the whole page
    if (!region || (!template && region.touchesEdge)) {
      playTap();
      return;
    }
    snapshot();
    const k = patternScale();
    paintRegion(c, region, (t, r) => paintStyle(t, color, effect, k, r), Math.ceil(W / 220 * 0.45) + 1, !template);
    if (!hasInk) setHasInk(true);
    playSplash();
    burst?.(e.clientX, e.clientY, {
      count: 8, spread: 45,
      colors: effect === 'rainbow' ? ['#ef4444', '#facc15', '#22c55e', '#38bdf8'] : [color, '#ffffff', '#fde047'],
      shapes: effect === 'glitter' ? ['star', 'diamond'] : ['circle', 'star'],
    });
  };

  const onDown = (e) => {
    if (drawing.current || sending) return;
    e.preventDefault();
    setActivity(a => a + 1);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (tool === 'fill') {
      if (pendingFill.current) return; // one finger at a time
      // A tap fills; a drag draws instead, so nothing he tries is wasted
      pendingFill.current = { id: e.pointerId, start: point(e), clientX: e.clientX, clientY: e.clientY };
      return;
    }
    snapshot();
    const p = point(e);
    drawing.current = { id: e.pointerId, last: p };
    strokeTo(p, p);
    if (!hasInk) setHasInk(true);
  };

  const onMove = (e) => {
    const pend = pendingFill.current;
    if (pend && pend.id === e.pointerId) {
      const p = point(e);
      const c = canvasRef.current;
      if (Math.hypot(p.x - pend.start.x, p.y - pend.start.y) > c.width * 0.02) {
        pendingFill.current = null;
        snapshot();
        drawing.current = { id: e.pointerId, last: pend.start };
        strokeTo(pend.start, p);
        drawing.current.last = p;
        if (!hasInk) setHasInk(true);
      }
      return;
    }
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
    const pend = pendingFill.current;
    if (pend && pend.id === e.pointerId) {
      pendingFill.current = null;
      if (e.type === 'pointerup') fillAt(pend.start, pend);
    }
    if (drawing.current?.id === e.pointerId) drawing.current = null;
  };

  /* ── Tools ── */
  const pickColour = (c) => {
    setColor(c);
    if (effect === 'rainbow') setEffect('plain');
    if (tool === 'eraser') setTool('brush');
    playTap();
  };

  const pickEffect = (id) => {
    setEffect(effect === id ? 'plain' : id);
    if (tool === 'eraser') setTool('brush');
    playSparkle();
  };

  const pickTool = (next, isThick) => {
    setTool(next);
    if (isThick !== undefined) setThick(isThick);
    playTap();
  };

  const undo = () => {
    const prev = history.current.pop();
    if (!prev) return;
    canvasRef.current.getContext('2d').putImageData(prev.image, 0, 0);
    setHasInk(prev.hasInk);
    setCanUndo(history.current.length > 0);
    playPoof();
  };

  const clear = () => {
    wipe();
    setDressing([]);
    dragAcc.current = null;
    playWhoosh();
  };

  const chooseTemplate = (id) => {
    if (id === templateId) return;
    wipe();
    setDressing([]);
    dragAcc.current = null;
    setTemplateId(id);
    setTool(id ? 'fill' : 'brush');
    playPop();
  };

  const send = () => {
    if (!ready || sending) return;
    const sprite = buildSprite(canvasRef.current, template, '#ffffff', dressing.map(d => ({
      canvas: accessoryCanvas(d.id, 256), x: d.x, y: d.y, size: d.size * SIZES[d.step], place: d.place,
    })));
    if (!sprite) {
      setHasInk(false); // everything was rubbed out
      playTap();
      return;
    }
    if (voice) sprite.voice = voice;
    playWhoosh();
    playSparkle();
    const rect = areaRef.current.getBoundingClientRect();
    burst?.(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 18, spread: paperSize * 0.45, colors: ['#facc15', '#ffffff', world.tint, '#ec4899'],
      shapes: ['star', 'diamond', 'circle'], spin: true,
    });
    setSending(sprite);
  };

  /* Arthur records a sound for his creature: tap, speak for 3 seconds */
  const record = async () => {
    if (recording) return;
    setRecording(true);
    try {
      const url = await recordVoice();
      if (url && mounted.current) {
        setVoice(url);
        playVoice(url);
      }
    } catch {
      if (mounted.current) setMicOk(false); // no microphone, or permission refused
    }
    if (mounted.current) setRecording(false);
  };

  /* Dress-up: add an accessory, drag it into place, tap it to change size, drag it off to take it away */
  const addAccessory = (acc) => {
    const spot = defaultSpot(acc, template);
    setDressing(prev => [...prev, { key: `${acc.id}-${Date.now()}`, id: acc.id, place: acc.place, step: 0, ...spot }]);
    setActivity(a => a + 1);
    playSparkle();
  };

  const toUnits = (e) => {
    const r = paperRef.current.getBoundingClientRect();
    return {
      x: VIEWBOX.x + ((e.clientX - r.left) / r.width) * VIEWBOX.size,
      y: VIEWBOX.y + ((e.clientY - r.top) / r.height) * VIEWBOX.size,
      inside: e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom,
    };
  };

  const grabAccessory = (key, e) => {
    // Ignore a second finger, unless the first one's accessory has gone
    if (dragAcc.current && dressing.some(d => d.key === dragAcc.current.key)) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const item = dressing.find(d => d.key === key);
    const p = toUnits(e);
    dragAcc.current = { key, pointerId: e.pointerId, dx: item.x - p.x, dy: item.y - p.y, x0: e.clientX, y0: e.clientY, moved: false };
  };

  const moveAccessory = (e) => {
    const g = dragAcc.current;
    if (!g || g.pointerId !== e.pointerId) return;
    if (!g.moved && Math.hypot(e.clientX - g.x0, e.clientY - g.y0) > 8) g.moved = true;
    if (!g.moved) return;
    const p = toUnits(e);
    setDressing(prev => prev.map(d => (d.key === g.key ? { ...d, x: p.x + g.dx, y: p.y + g.dy } : d)));
  };

  const dropAccessory = (e) => {
    const g = dragAcc.current;
    if (!g || g.pointerId !== e.pointerId) return;
    dragAcc.current = null;
    if (!g.moved) {
      setDressing(prev => prev.map(d => (d.key === g.key ? { ...d, step: (d.step + 1) % SIZES.length } : d)));
      playPop();
    } else if (!toUnits(e).inside) {
      setDressing(prev => prev.filter(d => d.key !== g.key));
      playPoof();
    }
    setActivity(a => a + 1);
  };

  const choices = [...world.templates, null];

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* The world waits behind the paper */}
      <img src={world.bg} alt="" draggable={false}
           className="absolute inset-0 w-full h-full object-cover scale-110"
           style={{ filter: 'blur(14px) brightness(0.8) saturate(1.1)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-purple-950/30" />

      <RoundBack onBack={sending ? () => {} : onBack} />

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
            ref={sendRef}
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
            ref={paperRef}
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
              <TemplateArt template={template} layer="fill" fill="#ffffff"
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
            {dressing.map(d => {
              const size = d.size * SIZES[d.step];
              return (
                <motion.img key={d.key} src={accessoryUrl(d.id)} alt="" draggable={false}
                  className="absolute cursor-grab"
                  style={{
                    left: `${((d.x - size / 2 - VIEWBOX.x) / VIEWBOX.size) * 100}%`,
                    top: `${((d.y - size / 2 - VIEWBOX.y) / VIEWBOX.size) * 100}%`,
                    width: `${(size / VIEWBOX.size) * 100}%`,
                    touchAction: 'none',
                    filter: 'drop-shadow(0 4px 6px rgba(76, 29, 149, 0.3))',
                  }}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  onPointerDown={e => grabAccessory(d.key, e)}
                  onPointerMove={moveAccessory}
                  onPointerUp={dropAccessory}
                  onPointerCancel={dropAccessory} />
              );
            })}
          </motion.div>
        </div>

        {/* ── Right: colours and tools ── */}
        <div className="self-center flex flex-col items-center justify-center gap-3 flex-shrink-0 py-3 px-2 rounded-3xl
                        bg-white/25 backdrop-blur-md border-2 border-white/40">
          {panel === 'dress' ? (
            <>
              {/* Dress-up: tap one to put it on */}
              <div className="grid grid-cols-3 gap-2">
                {ACCESSORIES.map(acc => (
                  <button key={acc.id} onClick={() => addAccessory(acc)} aria-label={acc.id}
                    className="w-16 h-16 rounded-2xl bg-white/90 shadow-md flex items-center justify-center active:scale-90 transition-transform">
                    <img src={accessoryUrl(acc.id)} alt="" draggable={false} className="w-12 h-12 pointer-events-none" />
                  </button>
                ))}
              </div>
              <button onClick={() => { setPanel('paint'); playTap(); }} aria-label="colours"
                className="w-16 h-16 rounded-full shadow-md flex items-center justify-center active:scale-90"
                style={{ background: RAINBOW, border: '4px solid white' }} />
            </>
          ) : (
          <>
          {/* Colours */}
          <div className="grid grid-cols-4 gap-2">
            {PALETTE.map(c => {
              const active = color === c && effect !== 'rainbow' && tool !== 'eraser';
              return (
                <button key={c} onClick={() => pickColour(c)} aria-label="colour"
                  className={`w-12 h-12 rounded-full shadow-md transition-transform active:scale-90
                    ${active ? 'scale-110 ring-4 ring-white' : 'border-2 border-white/70'}`}
                  style={{ backgroundColor: c }} />
              );
            })}
          </div>

          {/* Special paints in the current colour */}
          <div className="grid grid-cols-4 gap-2">
            {EFFECTS.map(fx => (
              <button key={fx.id} onClick={() => pickEffect(fx.id)} aria-label={fx.id}
                className={`w-12 h-12 rounded-full shadow-md transition-transform active:scale-90
                  ${effect === fx.id ? 'scale-110 ring-4 ring-white' : 'border-2 border-white/70'}`}
                style={fx.look(color)} />
            ))}
          </div>

          <div className="w-full h-px bg-white/50" />

          {/* Crayon (thin, thick), magic bucket, eraser */}
          <div className="grid grid-cols-4 gap-2">
            {[true, false].map(isThick => (
              <button key={isThick ? 'thick' : 'thin'} onClick={() => pickTool('brush', isThick)}
                aria-label={isThick ? 'thick crayon' : 'thin crayon'}
                className={`${btn} ${tool === 'brush' && thick === isThick ? 'bg-amber-100 ring-4 ring-white' : 'bg-white/90'}`}>
                <span className="rounded-full" style={{ width: isThick ? 26 : 10, height: isThick ? 26 : 10, background: effect === 'rainbow' ? RAINBOW : color, border: `2px solid ${OUTLINE}` }} />
              </button>
            ))}
            <button onClick={() => pickTool('fill')} aria-label="fill"
              className={`${btn} text-2xl ${tool === 'fill' ? 'bg-amber-100 ring-4 ring-white' : 'bg-white/90'}`}>
              🪣
            </button>
            <button onClick={() => pickTool('eraser')} aria-label="eraser"
              className={`${btn} ${tool === 'eraser' ? 'bg-pink-100 ring-4 ring-white' : 'bg-white/90'}`}>
              <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
                <g transform="rotate(-35 12 12)">
                  <rect x="4" y="7" width="16" height="10" rx="2.5" fill="#f9a8d4" stroke={OUTLINE} strokeWidth="1.5" />
                  <rect x="4" y="7" width="6" height="10" rx="2" fill="#93c5fd" stroke={OUTLINE} strokeWidth="1.5" />
                </g>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button onClick={undo} disabled={!canUndo} aria-label="undo"
              className={`${btn} bg-white/90 text-2xl ${canUndo ? '' : 'opacity-40'}`}>
              ↩️
            </button>
            <button onClick={clear} aria-label="clear" className={`${btn} bg-white/90 text-2xl`}>
              🧽
            </button>
            <button onClick={() => { setPanel('dress'); playSparkle(); }} aria-label="dress up"
              className={`${btn} bg-white/90 col-span-2 w-auto`}>
              <img src={accessoryUrl('crown')} alt="" draggable={false} className="w-10 h-10 pointer-events-none" />
              <img src={accessoryUrl('sunglasses')} alt="" draggable={false} className="w-9 h-9 -ml-1 pointer-events-none" />
            </button>
          </div>
          </>
          )}

          {micOk && (
            <>
              <div className="w-16 h-px bg-white/50" />
              <div className="flex items-center gap-2">
                <button onClick={record} aria-label="record a sound"
                  className={`relative w-16 h-16 rounded-full shadow-md flex items-center justify-center active:scale-90
                    ${recording ? 'bg-red-500' : 'bg-white/90'}`}>
                  {recording && (
                    <>
                      <span className="absolute inset-0 rounded-full border-4 border-red-400"
                            style={{ animation: 'radiateRing 1s ease-out infinite' }} />
                      <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
                        <motion.circle cx="32" cy="32" r="29" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: VOICE_MS / 1000, ease: 'linear' }} />
                      </svg>
                    </>
                  )}
                  <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
                    <rect x="8.5" y="3" width="7" height="12" rx="3.5" fill={recording ? '#fff' : '#ef4444'} stroke={OUTLINE} strokeWidth="1.2" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none"
                          stroke={recording ? '#fff' : OUTLINE} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                {voice && !recording && (
                  <button onClick={() => playVoice(voice)} aria-label="play the sound"
                    className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center text-2xl active:scale-90">
                    🔊
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hints: tap the picture to colour it; then send it into the world */}
      {!sending && (
        <HintHand
          activity={`${activity}-${templateId}-${hasInk}`}
          down={hasInk}
          idleMs={hasInk ? 8000 : 2500}
          at={hasInk ? () => {
            const r = sendRef.current?.getBoundingClientRect();
            return r ? { x: r.left + r.width / 2, y: r.top - 6 } : null;
          } : template ? () => {
            const r = paperRef.current?.getBoundingClientRect();
            return r ? { x: r.left + r.width * 0.5, y: r.top + r.height * 0.52 } : null;
          } : null}
        />
      )}
    </div>
  );
}
