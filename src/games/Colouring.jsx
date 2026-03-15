import { useRef, useEffect, useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playPop, playPoof, playWhoosh, playSparkle, playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#92400e', '#fdba74', '#f5f5f4', '#1e293b',
];

const BACKGROUNDS = [
  { id: 'white', bg: '#ffffff', label: '⬜' },
  { id: 'cream', bg: '#FDF5E6', label: '📜' },
  { id: 'sky',   bg: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)', label: '🌤️' },
  { id: 'night', bg: 'linear-gradient(180deg, #1a1a3e 0%, #2d1b69 100%)', label: '🌙' },
];

const MAX_UNDO = 20;

/* ── stamp drawing helpers ───────────────────── */

function drawStar(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  const inner = r * 0.4;
  let rot = -Math.PI / 2;
  const step = Math.PI / 5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function drawCircleStamp(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawSmiley(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  const ey = cy - r * 0.25, gap = r * 0.3, er = r * 0.12;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - gap, ey, er, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + gap, ey, er, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1e293b';
  const pr = er * 0.55;
  ctx.beginPath(); ctx.arc(cx - gap, ey, pr, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + gap, ey, pr, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = r * 0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.05, r * 0.45, 0.3, Math.PI - 0.3);
  ctx.stroke();
}

function placeStamp(canvas, stamp, x, y, size, color) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.save();
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  if (stamp === 'star') drawStar(ctx, x, y, size, color);
  if (stamp === 'circle') drawCircleStamp(ctx, x, y, size, color);
  if (stamp === 'smiley') drawSmiley(ctx, x, y, size, color);
  ctx.restore();
}

/* ── Art studio background ── */
function ArtStudioBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #e8d5c4 0%, #d4bfae 25%, #c4a898 50%, #b89888 75%, #a88878 100%)' }} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px"
          style={{
            top: `${15 + i * 14}%`,
            background: `linear-gradient(90deg, transparent 0%, rgba(140,90,50,0.1) ${25 + i * 4}%, rgba(140,90,50,0.06) ${55 + i * 3}%, transparent 100%)`,
          }} />
      ))}
      <div className="absolute top-4 right-24 w-14 h-2.5 rounded-full bg-pink-400/20 rotate-[20deg]" />
      <div className="absolute bottom-5 left-24 w-16 h-3 rounded-full bg-yellow-400/20 rotate-[-12deg]" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(100,60,20,0.25) 100%)' }} />
    </div>
  );
}

/* ── main component (Free Art — blank canvas with drawing tools) ── */

export default function Colouring() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const hueRef = useRef(0);
  const historyRef = useRef([]);
  const strokeCountRef = useRef(0);

  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(16);
  const [tool, setTool] = useState('brush');
  const [canUndo, setCanUndo] = useState(false);
  const [bgIdx, setBgIdx] = useState(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const isStamp = tool === 'star' || tool === 'circle' || tool === 'smiley';

  /* ── canvas resize ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.parentElement.clientWidth;
      const h = c.parentElement.clientHeight;
      if (!w || !h) return;
      const tmp = document.createElement('canvas');
      tmp.width = c.width || 1;
      tmp.height = c.height || 1;
      tmp.getContext('2d').drawImage(c, 0, 0);
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      const ctx = c.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.drawImage(tmp, 0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ── helpers ── */
  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  const pushHistory = useCallback(() => {
    const c = canvasRef.current;
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height);
    historyRef.current.push(data);
    if (historyRef.current.length > MAX_UNDO) historyRef.current.shift();
    setCanUndo(true);
  }, []);

  /* ── drawing ── */
  const startDraw = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    pushHistory();

    if (isStamp) {
      placeStamp(canvasRef.current, tool, pos.x, pos.y, brushSize * 2, color);
      playPop();

      // Particle burst on stamp placement
      if (e?.clientX != null) {
        const t = e.touches ? e.touches[0] : e;
        burst(t.clientX, t.clientY, {
          count: 5, spread: 25,
          colors: [color, '#facc15', '#fff'],
          shapes: ['star', 'circle'],
        });
      }
      return;
    }

    drawing.current = true;
    lastPos.current = pos;
    strokeCountRef.current++;

    const count = strokeCountRef.current;
    if (count === 15) peek('happy');
    if (count === 40) peek('excited');
  }, [getPos, pushHistory, isStamp, tool, brushSize, color, burst, peek]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current || isStamp) return;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const pos = getPos(e);
    const prev = lastPos.current;

    ctx.save();
    ctx.resetTransform();
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = brushSize * 2;
    } else if (tool === 'rainbow') {
      hueRef.current = (hueRef.current + 3) % 360;
      ctx.strokeStyle = `hsl(${hueRef.current}, 90%, 55%)`;
      ctx.lineWidth = brushSize;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
    lastPos.current = pos;
  }, [color, brushSize, getPos, tool, isStamp]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  /* ── actions ── */
  const undo = useCallback(() => {
    const c = canvasRef.current;
    const data = historyRef.current.pop();
    if (data) {
      c.getContext('2d').putImageData(data, 0, 0);
      playPoof();
    }
    setCanUndo(historyRef.current.length > 0);
  }, []);

  const clear = useCallback(() => {
    pushHistory();
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    playWhoosh();
  }, [pushHistory]);

  const save = useCallback((e) => {
    const c = canvasRef.current;
    const tmp = document.createElement('canvas');
    tmp.width = c.width;
    tmp.height = c.height;
    const tctx = tmp.getContext('2d');
    tctx.fillStyle = '#fff';
    tctx.fillRect(0, 0, tmp.width, tmp.height);
    tctx.drawImage(c, 0, 0);
    tmp.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'arthur-drawing.png';
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');

    // Celebration on save!
    playCelebrate();
    peek('excited');
    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 14,
        spread: 50,
        colors: ['#facc15', '#22c55e', '#38bdf8', '#ec4899', '#8b5cf6'],
        shapes: ['star', 'circle', 'diamond'],
      });
    }
  }, [burst, peek]);

  const TB = 'w-12 h-12';

  return (
    <div className="relative w-full h-full overflow-hidden flex">
      <ArtStudioBg />
      <BackButton />

      {/* ── Left sidebar: colour palette ── */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-1 px-1 z-10
                      bg-amber-900/25 backdrop-blur-sm rounded-r-2xl border-r border-amber-700/15">
        <div className="grid grid-cols-2 gap-1">
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); if (tool === 'eraser' || tool === 'rainbow') setTool('brush'); playTap(); }}
              className={`w-9 h-9 rounded-full border-[3px] transition-all shadow-md
                ${color === c && tool === 'brush'
                  ? 'border-gray-800 scale-125 shadow-lg ring-2 ring-white z-10'
                  : c === '#f5f5f4' ? 'border-gray-300' : 'border-white/60'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          {/* Rainbow brush */}
          <button
            onClick={() => { setTool('rainbow'); playSparkle(); }}
            className={`w-9 h-9 col-span-2 rounded-full border-[3px] transition-all shadow-md
              ${tool === 'rainbow'
                ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-white z-10'
                : 'border-white/60'}`}
            style={{
              background: 'conic-gradient(#ef4444,#f97316,#facc15,#22c55e,#38bdf8,#8b5cf6,#ec4899,#ef4444)',
            }}
          />
        </div>
      </div>

      {/* ── Centre: canvas ── */}
      <div className="relative flex-1 flex items-center justify-center p-2 z-10">
        <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden ring-2 ring-amber-700/20"
             style={{ background: BACKGROUNDS[bgIdx].bg }}>
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ touchAction: 'none' }}
            onPointerDown={startDraw}
            onPointerMove={draw}
            onPointerUp={stopDraw}
            onPointerLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
      </div>

      {/* ── Right sidebar: tools ── */}
      <div className="relative flex flex-col items-center justify-center gap-1 py-2 px-1.5 overflow-y-auto no-scrollbar z-10
                      bg-amber-900/25 backdrop-blur-sm rounded-l-2xl border-l border-amber-700/15">
        {/* Brush sizes */}
        {[8, 16, 28].map(s => (
          <button
            key={s}
            onClick={() => { setBrushSize(s); if (isStamp || tool === 'eraser') setTool('brush'); playTap(); }}
            className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
              bg-white/90 border-4 transition-all shadow-md
              ${brushSize === s && !isStamp && tool !== 'eraser' && tool !== 'rainbow'
                ? 'border-gray-800 scale-115 shadow-lg' : 'border-white/60'}`}
          >
            <div className="rounded-full"
                 style={{
                   width: s * 0.8,
                   height: s * 0.8,
                   backgroundColor: tool === 'rainbow' ? undefined : color,
                   background: tool === 'rainbow'
                     ? 'conic-gradient(#ef4444,#f97316,#facc15,#22c55e,#38bdf8,#8b5cf6,#ec4899,#ef4444)'
                     : undefined,
                 }} />
          </button>
        ))}

        <div className="w-8 h-px bg-amber-300/40 flex-shrink-0" />

        {/* Stamps */}
        {[
          { id: 'star', label: '⭐' },
          { id: 'circle', label: '🔵' },
          { id: 'smiley', label: '😊' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => { setTool(s.id); playTap(); }}
            className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
              text-lg transition-all shadow-md border-4
              ${tool === s.id ? 'border-gray-800 scale-115 bg-amber-100 shadow-lg' : 'border-white/60 bg-white/90'}`}
          >
            {s.label}
          </button>
        ))}

        <div className="w-8 h-px bg-amber-300/40 flex-shrink-0" />

        {/* Eraser */}
        <button
          onClick={() => { setTool(tool === 'eraser' ? 'brush' : 'eraser'); playTap(); }}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-lg transition-all shadow-md border-4
            ${tool === 'eraser' ? 'border-gray-800 scale-115 bg-pink-200 shadow-lg' : 'border-white/60 bg-white/90'}`}
        >
          🧹
        </button>

        {/* Background */}
        <button
          onClick={() => { setBgIdx(i => (i + 1) % BACKGROUNDS.length); playTap(); }}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-lg transition-all shadow-md border-4 border-white/60`}
          style={{ background: BACKGROUNDS[bgIdx].bg }}
        >
          {BACKGROUNDS[(bgIdx + 1) % BACKGROUNDS.length].label}
        </button>

        <div className="w-8 h-px bg-amber-300/40 flex-shrink-0" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-lg transition-all bg-white/90 shadow-md border-4 border-white/60
            ${canUndo ? 'active:scale-90' : 'opacity-30'}`}
        >
          ↩️
        </button>

        {/* Save */}
        <button
          onClick={save}
          className={`${TB} rounded-2xl flex-shrink-0 bg-green-200/90 flex items-center justify-center
            text-lg active:scale-90 transition-all shadow-md border-4 border-white/60`}
        >
          💾
        </button>

        {/* Clear */}
        <button
          onClick={clear}
          className={`${TB} rounded-2xl flex-shrink-0 bg-red-200/90 flex items-center justify-center
            text-lg active:scale-90 transition-all shadow-md border-4 border-white/60`}
        >
          🗑️
        </button>
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
