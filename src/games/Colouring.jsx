import { useRef, useEffect, useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playTap } from '../hooks/useSound';

const PALETTE = [
  '#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8',
  '#8b5cf6', '#ec4899', '#ffffff', '#1e293b',
];

export default function Colouring() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(12);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      // Save current drawing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      // Restore drawing
      ctx.drawImage(tempCanvas, 0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  const startDraw = useCallback((e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
  }, [getPos]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    const prev = lastPos.current;

    ctx.save();
    ctx.resetTransform();
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
    lastPos.current = pos;
  }, [color, brushSize, getPos]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      <BackButton />

      {/* Canvas area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={stopDraw}
          onPointerLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-gray-100 overflow-x-auto no-scrollbar">
        {PALETTE.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); playTap(); }}
            className={`w-12 h-12 rounded-full flex-shrink-0 border-4 transition-transform
                       ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}

        {/* Brush sizes */}
        <div className="w-px h-10 bg-gray-300 mx-1" />
        {[8, 16, 28].map(s => (
          <button
            key={s}
            onClick={() => { setBrushSize(s); playTap(); }}
            className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center
                       bg-gray-200 border-4 transition-transform
                       ${brushSize === s ? 'border-gray-800 scale-110' : 'border-transparent'}`}
          >
            <div className="rounded-full bg-gray-800" style={{ width: s, height: s }} />
          </button>
        ))}

        {/* Clear */}
        <div className="w-px h-10 bg-gray-300 mx-1" />
        <button
          onClick={() => { clear(); playTap(); }}
          className="w-12 h-12 rounded-full flex-shrink-0 bg-red-100 flex items-center justify-center
                     text-2xl active:scale-90 transition-transform"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
