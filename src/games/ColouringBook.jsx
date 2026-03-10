import { useRef, useEffect, useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playPop, playPoof, playWhoosh, playSparkle } from '../hooks/useSound';

/* ── Coloring pages ── */
const IMG = '/arthurs-world/images/colouring';

const PAGES = [
  { id: 'lilo',           name: 'Lilo & Stitch',  emoji: '🌺', src: `${IMG}/lilo.png` },
  { id: 'mickey-surfing', name: 'Mickey Surfing',  emoji: '🏄', src: `${IMG}/mickey-surfing.png` },
  { id: 'spongebob',      name: 'SpongeBob',       emoji: '🧽', src: `${IMG}/spongebob.png` },
  { id: 'woody',          name: 'Woody & Buzz',    emoji: '🤠', src: `${IMG}/woody.png` },
];

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#f5f5f4', '#1e293b',
];

const MAX_UNDO = 20;

/* ── Page picker grid ── */
function PagePicker({ onSelect }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #ddd6fe 100%)' }}>
      <h2 className="text-2xl sm:text-3xl font-heading text-amber-900 mb-1">Colouring Book</h2>
      <p className="text-sm text-amber-700/70 font-heading mb-5">Pick a picture to colour in!</p>
      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => { playPop(); onSelect(page); }}
            className="bg-white rounded-3xl p-3 shadow-lg border-2 border-amber-200/50
                       hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img src={page.src} alt={page.name} className="w-full h-full object-contain" draggable={false} />
            </div>
            <span className="font-heading text-amber-800 text-sm">{page.emoji} {page.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main colouring canvas ── */
export default function ColouringBook() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const historyRef = useRef([]);

  const [page, setPage] = useState(null);
  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [isEraser, setIsEraser] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

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
  }, [page]);

  /* ── helpers ── */
  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  const pushHistory = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height);
    historyRef.current.push(data);
    if (historyRef.current.length > MAX_UNDO) historyRef.current.shift();
    setCanUndo(true);
  }, []);

  /* ── drawing ── */
  const startDraw = useCallback((e) => {
    e.preventDefault();
    pushHistory();
    drawing.current = true;
    lastPos.current = getPos(e);
  }, [getPos, pushHistory]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const pos = getPos(e);
    const prev = lastPos.current;

    ctx.save();
    ctx.resetTransform();
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
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
  }, [color, brushSize, getPos, isEraser]);

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
    /* Composite: white bg → coloring page image → user drawing */
    const tmp = document.createElement('canvas');
    tmp.width = c.width;
    tmp.height = c.height;
    const tctx = tmp.getContext('2d');
    tctx.fillStyle = '#fff';
    tctx.fillRect(0, 0, tmp.width, tmp.height);
    /* Draw the background page image if present */
    if (page) {
      const bgImg = document.getElementById('colouring-bg-img');
      if (bgImg) {
        const dpr = window.devicePixelRatio || 1;
        const cw = c.width / dpr;
        const ch = c.height / dpr;
        /* Replicate object-contain positioning */
        const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasAspect = cw / ch;
        let dw, dh, dx, dy;
        if (imgAspect > canvasAspect) {
          dw = cw; dh = cw / imgAspect; dx = 0; dy = (ch - dh) / 2;
        } else {
          dh = ch; dw = ch * imgAspect; dy = 0; dx = (cw - dw) / 2;
        }
        tctx.drawImage(bgImg, dx * dpr, dy * dpr, dw * dpr, dh * dpr);
      }
    }
    tctx.drawImage(c, 0, 0);
    tmp.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `colouring-${page?.id || 'art'}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
    playSparkle();
  }, [page]);

  const goBack = useCallback(() => {
    setPage(null);
    historyRef.current = [];
    setCanUndo(false);
  }, []);

  /* ── No page selected → show picker ── */
  if (!page) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <BackButton />
        <PagePicker onSelect={setPage} />
      </div>
    );
  }

  /* ── Colouring mode ── */
  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      <BackButton />

      {/* Canvas area */}
      <div className="flex-1 relative">
        {/* Background coloring page image */}
        <img
          id="colouring-bg-img"
          src={page.src}
          alt={page.name}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90"
          draggable={false}
        />
        {/* Drawing canvas on top */}
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

      {/* Change page button */}
      <button
        onClick={() => { playTap(); goBack(); }}
        className="absolute top-14 right-3 z-10 w-11 h-11 rounded-2xl bg-white/90
                   shadow-lg flex items-center justify-center text-xl active:scale-90 transition-transform"
        title="Change page"
      >
        🖼️
      </button>

      {/* ── Toolbar ── */}
      <div className="bg-gray-100 border-t border-gray-200">
        {/* Row 1: Colour palette */}
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 overflow-x-auto no-scrollbar">
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); playTap(); }}
              className={`w-10 h-10 rounded-full flex-shrink-0 border-4 transition-transform
                ${color === c && !isEraser
                  ? 'border-gray-800 scale-110'
                  : c === '#f5f5f4' ? 'border-gray-300' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Row 2: Tools */}
        <div className="flex items-center gap-1.5 px-3 pt-1 pb-2 overflow-x-auto no-scrollbar">
          {/* Brush sizes */}
          {[6, 12, 24].map(s => (
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
            onClick={() => { setIsEraser(e => !e); playTap(); }}
            className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
              text-xl transition-transform border-4
              ${isEraser ? 'border-gray-800 scale-110 bg-pink-100' : 'border-transparent bg-gray-200'}`}
          >
            🧹
          </button>

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
