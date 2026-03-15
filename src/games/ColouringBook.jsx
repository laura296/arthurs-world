import { useRef, useEffect, useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playTap, playPop, playPoof, playWhoosh, playSparkle, playCelebrate } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

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
  '#8b5cf6', '#ec4899', '#92400e', '#fdba74', '#f5f5f4', '#1e293b',
];

const MAX_UNDO = 20;

/* ── Art studio background ── */
function ArtStudioBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Warm wooden desk gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #d4a574 0%, #c4956a 25%, #b8845c 50%, #a87448 75%, #986840 100%)' }} />
      {/* Wood grain lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px"
          style={{
            top: `${12 + i * 12}%`,
            background: `linear-gradient(90deg, transparent 0%, rgba(120,70,30,0.15) ${20 + i * 5}%, rgba(120,70,30,0.08) ${60 + i * 3}%, transparent 100%)`,
            transform: `rotate(${(i % 2 === 0 ? -0.3 : 0.2)}deg)`,
          }} />
      ))}
      {/* Scattered crayon decorations (top corners) */}
      <div className="absolute top-3 right-20 w-16 h-3 rounded-full bg-red-400/30 rotate-[25deg]" />
      <div className="absolute top-8 right-16 w-14 h-2.5 rounded-full bg-blue-400/25 rotate-[-15deg]" />
      <div className="absolute bottom-4 left-20 w-12 h-2.5 rounded-full bg-green-400/20 rotate-[10deg]" />
      {/* Warm vignette */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(80,40,10,0.3) 100%)' }} />
    </div>
  );
}

/* ── Page picker ── */
function PagePicker({ onSelect }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 overflow-hidden">
      <ArtStudioBg />

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-heading text-white mb-4 drop-shadow-lg"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
          🎨 Colouring Book 🖍️
        </h2>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl"
             style={{ maxHeight: '78vh' }}>
          {PAGES.map((page, i) => (
            <button
              key={page.id}
              onClick={() => { playPop(); onSelect(page); }}
              className="bg-white rounded-3xl p-2.5 shadow-xl border-2 border-amber-200/50
                         hover:scale-[1.03] active:scale-95 transition-all flex flex-col items-center gap-1.5 cursor-pointer"
              style={{
                animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                animationDelay: `${i * 120}ms`,
              }}
            >
              <div className="w-full flex-1 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 min-h-0">
                <img src={page.src} alt={page.name}
                     className="w-full h-full object-contain"
                     draggable={false} />
              </div>
              <span className="font-heading text-amber-800 text-sm sm:text-base">{page.emoji} {page.name}</span>
            </button>
          ))}
        </div>
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
  const strokeCountRef = useRef(0);

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

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
    strokeCountRef.current++;

    // Milestone celebrations while colouring
    const count = strokeCountRef.current;
    if (count === 15) peek('happy');
    if (count === 40) peek('excited');
  }, [getPos, pushHistory, peek]);

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
      ctx.globalAlpha = 0.7;
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

  const save = useCallback((e) => {
    const c = canvasRef.current;
    /* Composite: white bg → coloring page image → user drawing */
    const tmp = document.createElement('canvas');
    tmp.width = c.width;
    tmp.height = c.height;
    const tctx = tmp.getContext('2d');
    tctx.fillStyle = '#fff';
    tctx.fillRect(0, 0, tmp.width, tmp.height);
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
  }, [page, burst, peek]);

  const goBack = useCallback(() => {
    setPage(null);
    historyRef.current = [];
    setCanUndo(false);
    strokeCountRef.current = 0;
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
  const TB = 'w-13 h-13';

  return (
    <div className="relative w-full h-full overflow-hidden flex">
      <ArtStudioBg />
      <BackButton />

      {/* ── Left sidebar: colour palette ── */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-1 px-1 z-10
                      bg-amber-900/30 backdrop-blur-sm rounded-r-2xl border-r border-amber-700/20">
        <div className="grid grid-cols-2 gap-1">
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); playTap(); }}
              className={`w-9 h-9 rounded-full border-[3px] transition-all shadow-md
                ${color === c && !isEraser
                  ? 'border-gray-800 scale-125 shadow-lg ring-2 ring-white z-10'
                  : c === '#f5f5f4' ? 'border-gray-300' : 'border-white/60'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* ── Centre: image + canvas ── */}
      <div className="relative flex-1 flex items-center justify-center z-10">
        <div
          ref={containerRef}
          className="relative max-w-full shadow-2xl rounded-xl overflow-hidden bg-white
                     ring-2 ring-amber-700/20"
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
      <div className="relative flex flex-col items-center justify-center gap-1.5 py-2 px-1.5 overflow-y-auto no-scrollbar z-10
                      bg-amber-900/30 backdrop-blur-sm rounded-l-2xl border-l border-amber-700/20">
        {/* Brush sizes */}
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

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
