import { useRef, useEffect, useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playPop, playPoof, playWhoosh, playSparkle } from '../hooks/useSound';

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#ffffff', '#1e293b',
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
  // face
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  const ey = cy - r * 0.25, gap = r * 0.3, er = r * 0.12;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - gap, ey, er, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + gap, ey, er, 0, Math.PI * 2); ctx.fill();
  // pupils
  ctx.fillStyle = '#1e293b';
  const pr = er * 0.55;
  ctx.beginPath(); ctx.arc(cx - gap, ey, pr, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + gap, ey, pr, 0, Math.PI * 2); ctx.fill();
  // smile
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

/* ── main component (Free Art — blank canvas with drawing tools) ── */

export default function Colouring() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const hueRef = useRef(0);
  const historyRef = useRef([]);

  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [tool, setTool] = useState('brush');
  const [canUndo, setCanUndo] = useState(false);

  const isStamp = tool === 'star' || tool === 'circle' || tool === 'smiley';

  /* ── canvas resize ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.parentElement.clientWidth;
      const h = c.parentElement.clientHeight;
      const tmp = document.createElement('canvas');
      tmp.width = c.width;
      tmp.height = c.height;
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
      return;
    }

    drawing.current = true;
    lastPos.current = pos;
  }, [getPos, pushHistory, isStamp, tool, brushSize, color]);

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

  const save = useCallback(() => {
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
    playSparkle();
  }, []);

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      <BackButton />

      {/* Canvas area */}
      <div className="flex-1 relative">
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

      {/* ── Toolbar ── */}
      <div className="bg-gray-100 border-t border-gray-200">
        {/* Row 1: Colour palette + rainbow */}
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 overflow-x-auto no-scrollbar">
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('brush'); playTap(); }}
              className={`w-10 h-10 rounded-full flex-shrink-0 border-4 transition-transform
                ${color === c && tool === 'brush'
                  ? 'border-gray-800 scale-110'
                  : c === '#ffffff' ? 'border-gray-300' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          {/* Rainbow brush */}
          <button
            onClick={() => { setTool('rainbow'); playTap(); }}
            className={`w-10 h-10 rounded-full flex-shrink-0 border-4 transition-transform
              ${tool === 'rainbow' ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            style={{
              background: 'conic-gradient(#ef4444,#f97316,#facc15,#22c55e,#38bdf8,#8b5cf6,#ec4899,#ef4444)',
            }}
          />
        </div>

        {/* Row 2: Tools */}
        <div className="flex items-center gap-1.5 px-3 pt-1 pb-2 overflow-x-auto no-scrollbar">
          {/* Brush sizes */}
          {[8, 16, 28].map(s => (
            <button
              key={s}
              onClick={() => { setBrushSize(s); playTap(); }}
              className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
                bg-gray-200 border-4 transition-transform
                ${brushSize === s ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            >
              <div className="rounded-full bg-gray-800" style={{ width: s, height: s }} />
            </button>
          ))}

          <div className="w-px h-8 bg-gray-300 mx-0.5 flex-shrink-0" />

          {/* Eraser */}
          <button
            onClick={() => { setTool('eraser'); playTap(); }}
            className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
              text-xl transition-transform border-4
              ${tool === 'eraser' ? 'border-gray-800 scale-110 bg-pink-100' : 'border-transparent bg-gray-200'}`}
          >
            🧹
          </button>

          <div className="w-px h-8 bg-gray-300 mx-0.5 flex-shrink-0" />

          {/* Stamps */}
          {[
            { id: 'star', label: '⭐' },
            { id: 'circle', label: '🔵' },
            { id: 'smiley', label: '😊' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => { setTool(s.id); playTap(); }}
              className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
                text-xl transition-transform border-4
                ${tool === s.id ? 'border-gray-800 scale-110 bg-yellow-100' : 'border-transparent bg-gray-200'}`}
            >
              {s.label}
            </button>
          ))}

          <div className="w-px h-8 bg-gray-300 mx-0.5 flex-shrink-0" />

          {/* Undo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
              text-xl transition-transform bg-gray-200
              ${canUndo ? 'active:scale-90' : 'opacity-30'}`}
          >
            ↩️
          </button>

          {/* Save */}
          <button
            onClick={save}
            className="w-11 h-11 rounded-2xl flex-shrink-0 bg-green-100 flex items-center justify-center
              text-xl active:scale-90 transition-transform"
          >
            💾
          </button>

          {/* Clear */}
          <button
            onClick={clear}
            className="w-11 h-11 rounded-2xl flex-shrink-0 bg-red-100 flex items-center justify-center
              text-xl active:scale-90 transition-transform"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
