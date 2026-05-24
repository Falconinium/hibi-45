'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Minimal canvas-based signature pad.
 *
 * Native pointer events cover mouse, touch and stylus on every modern
 * browser — no library needed. The canvas is responsive (resized on
 * mount and on window resize) and supports a Clear control.
 *
 * The component does NOT persist the drawing itself. On submit, the
 * parent form sends a `signed=1` flag along with the wall-clock at
 * which the gesture happened. The server records signed_at; the
 * pixels are forgotten.
 *
 * `onSignedChange(hasInk: boolean)` fires whenever the canvas
 * transitions between empty and inked — the parent uses it to enable
 * the submit button only after the user has actually drawn something.
 */
export function SignaturePad({
  onSignedChange,
}: {
  onSignedChange?: (hasInk: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [, force] = useState(0);

  // Resize the bitmap to match the displayed size + DPR. Re-runs on
  // window resize. Clears any existing ink because the bitmap is reset.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c.getBoundingClientRect();
      c.width = rect.width * dpr;
      c.height = rect.height * dpr;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#f5f5f5';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      hasInkRef.current = false;
      onSignedChange?.(false);
      force((n) => n + 1);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [onSignedChange]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = pos(e);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !lastRef.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;

    if (!hasInkRef.current) {
      hasInkRef.current = true;
      onSignedChange?.(true);
      force((n) => n + 1);
    }
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);
    hasInkRef.current = false;
    onSignedChange?.(false);
    force((n) => n + 1);
  };

  return (
    <div className="space-y-3">
      <div className="relative border border-line bg-charcoal/30 aspect-[3/1] touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
        {!hasInkRef.current && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif italic text-stone text-sm">
            Sign with your finger
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-stone text-xs tracking-widest uppercase">Your mark</p>
        <button
          type="button"
          onClick={clear}
          className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
