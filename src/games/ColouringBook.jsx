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

/* ── Page picker ── */
function PagePicker({ onSelect }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #ddd6fe 100%)' }}>
      <h2 className="text-2xl sm:text-3xl font-heading text-amber-900 mb-3">Colouring Book</h2>

      {/* Horizontal scroll of large cards */}
      <div className="flex gap-5 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory w-full"
           style={{ maxHeight: '75vh' }}>
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => { playPop(); onSelect(page); }}
            className="snap-center flex-shrink-0 bg-white rounded-3xl p-3 shadow-xl border-2 border-amber-200/50
                       hover:scale-[1.03] active:scale-95 transition-all flex flex-col items-center gap-2 cursor-pointer"
            style={{ width: 'min(45vw, 280px)' }}
          >
            <div className="w-full flex-1 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img src={page.src} alt={page.name} className="w-full h-full object-contain" draggable={false} />
            </div>
            <span className="font-heading text-amber-800 text-base">{page.emoji} {page.name}</span>
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
  const [imgSize, setImgSize] = useState(null);
  const containerRef = useRef(null);

  /* ── Load image dimensions ── */
  useEffect(() => {
    if (!page) { setImgSize(null); return; }
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = page.src;
  }, [page]);

  /* ── canvas resize to match fitted container ── */
  useEffect(() => {
    const c = canvasRef.current;
    const container = containerRef.current;
    if (!c || !container) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;  // container not laid out yet
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
  }, [page, imgSize]);

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
    /* Draw the background page image — container matches aspect ratio, just fill */
    if (page) {
      const bgImg = document.getElementById('colouring-bg-img');
      if (bgImg) tctx.drawImage(bgImg, 0, 0, tmp.width, tmp.height);
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
  const TB = 'w-13 h-13';  // 52px touch targets

  return (
    <div className="relative w-full h-full overflow-hidden flex"
         style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #ddd6fe 100%)' }}>
      <BackButton />

      {/* ── Left sidebar: colour palette ── */}
      <div className="flex flex-col items-center justify-center gap-1 py-2 px-1 overflow-y-auto no-scrollbar z-10">
        {PALETTE.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setIsEraser(false); playTap(); }}
            className={`${TB} rounded-full flex-shrink-0 border-[5px] transition-all shadow-md
              ${color === c && !isEraser
                ? 'border-gray-800 scale-115 shadow-lg'
                : c === '#f5f5f4' ? 'border-gray-300' : 'border-white/60'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* ── Centre: image + canvas ── */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative max-w-full shadow-2xl rounded-xl overflow-hidden bg-white"
          style={imgSize
            ? { aspectRatio: `${imgSize.w} / ${imgSize.h}`, height: 'calc(100% - 16px)' }
            : { width: '100%', height: 'calc(100% - 16px)' }}
        >
          <img
            id="colouring-bg-img"
            src={page.src}
            alt={page.name}
            className="absolute inset-0 w-full h-full pointer-events-none"
            draggable={false}
          />
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
      <div className="flex flex-col items-center justify-center gap-1 py-2 px-1 overflow-y-auto no-scrollbar z-10">
        {/* Brush sizes — show selected colour on the dot */}
        {[6, 14, 26].map(s => (
          <button
            key={s}
            onClick={() => { setBrushSize(s); setIsEraser(false); playTap(); }}
            className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
              bg-white/90 border-[5px] transition-all shadow-md
              ${brushSize === s && !isEraser ? 'border-gray-800 scale-115 shadow-lg' : 'border-white/60'}`}
          >
            <div className="rounded-full" style={{ width: s, height: s, backgroundColor: color }} />
          </button>
        ))}

        <div className="w-8 h-px bg-amber-300/40 flex-shrink-0" />

        {/* Eraser */}
        <button
          onClick={() => { setIsEraser(e => !e); playTap(); }}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-xl transition-all border-[5px] shadow-md
            ${isEraser ? 'border-gray-800 scale-115 bg-pink-200 shadow-lg' : 'border-white/60 bg-white/90'}`}
        >
          🧹
        </button>

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-xl transition-all bg-white/90 shadow-md border-[5px] border-white/60
            ${canUndo ? 'active:scale-90' : 'opacity-30'}`}
        >
          ↩️
        </button>

        <div className="w-8 h-px bg-amber-300/40 flex-shrink-0" />

        {/* Change page */}
        <button
          onClick={() => { playTap(); goBack(); }}
          className={`${TB} rounded-2xl flex-shrink-0 flex items-center justify-center
            text-xl transition-all bg-amber-100/90 shadow-md border-[5px] border-white/60
            active:scale-90`}
        >
          🖼️
        </button>

        {/* Save */}
        <button
          onClick={save}
          className={`${TB} rounded-2xl flex-shrink-0 bg-green-200/90 flex items-center justify-center
            text-xl active:scale-90 transition-all shadow-md border-[5px] border-white/60`}
        >
          💾
        </button>

        {/* Clear */}
        <button
          onClick={clear}
          className={`${TB} rounded-2xl flex-shrink-0 bg-red-200/90 flex items-center justify-center
            text-xl active:scale-90 transition-all shadow-md border-[5px] border-white/60`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
