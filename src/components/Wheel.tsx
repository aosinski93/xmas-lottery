// WheelOfFortune.tsx — TypeScript React 17 component
// Converted from the previous JS version.

import React, { useRef, useEffect, useState } from 'react';

export interface WheelSegment {
  label: string;
  value?: any;
  color?: string;
}

interface WheelOfFortuneProps {
  segments?: WheelSegment[];
  size?: number;
  duration?: number;
  onFinish?: (segment: WheelSegment) => void;
  spinVelocity?: number;
  winningIndex?: number | null;
  disableWhileSpinning?: boolean;
}

export default function WheelOfFortune({
  segments = [{ label: 'A' }, { label: 'B' }, { label: 'C' }, { label: 'D' }],
  size = 400,
  duration = 5000,
  onFinish = () => {},
  spinVelocity = 0.35,
  winningIndex = null,
  disableWhileSpinning = true,
}: WheelOfFortuneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [angle, setAngle] = useState(0); // radians
  const [isSpinning, setIsSpinning] = useState(false);

  const segCount = Math.max(2, segments.length);
  const segAngle = (Math.PI * 2) / segCount;

  // draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = Math.min(cx, cy) - 4;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < segCount; i++) {
      const start = i * segAngle + angle;
      const end = start + segAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = segments[i].color || (i % 2 ? '#f3f4f6' : '#ef4444');
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#11182722';
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      const textAngle = start + segAngle / 2;
      ctx.rotate(textAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#111827';
      ctx.font = Math.max(12, radius * 0.08) + 'px sans-serif';
      ctx.fillText(segments[i].label, radius - 10, 4);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 6, 8);
    ctx.lineTo(cx - 6, 8);
    ctx.lineTo(cx, 28);
    ctx.closePath();
    ctx.fillStyle = '#111827';
    ctx.fill();
  }, [angle, segments, size]);

  const norm = (a: number) => {
    const two = Math.PI * 2;
    a = a % two;
    if (a < 0) a += two;
    return a;
  };

  const spin = (
    opts: { winningIndex?: number | null; duration?: number } = {}
  ) => {
    if (isSpinning && disableWhileSpinning) return;

    const winIdx =
      typeof opts.winningIndex === 'number' ? opts.winningIndex : winningIndex;

    setIsSpinning(true);

    const startAngle = angle;
    const extraTurns = 4 + Math.random() * 3;

    let targetAngle: number;
    if (typeof winIdx === 'number' && winIdx >= 0 && winIdx < segCount) {
      const pointerAngle = -Math.PI / 2;
      const segmentCenter = winIdx * segAngle + segAngle / 2;
      targetAngle = pointerAngle - segmentCenter + extraTurns * Math.PI * 2;
    } else {
      targetAngle =
        Math.random() * Math.PI * 2 + extraTurns * Math.PI * 2 - Math.PI / 2;
    }

    const durationMs = opts.duration || duration;
    const startTs = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (ts: number) => {
      const p = Math.min(1, (ts - startTs) / durationMs);
      const eased = easeOutCubic(p);
      const curr = startAngle + (targetAngle - startAngle) * eased;
      setAngle(curr);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setIsSpinning(false);
        const finalNorm = norm(curr + Math.PI / 2);
        let idx = segCount - Math.floor(finalNorm / segAngle) - 1;
        idx = idx % segCount;
        if (idx < 0) idx += segCount;
        onFinish(segments[idx]);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 z-10">
      <div style={{ width: size }} className="relative">
        <canvas ref={canvasRef} className="rounded-full shadow-lg" />
      </div>

      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded shadow ${
            isSpinning
              ? 'opacity-60 cursor-not-allowed'
              : 'bg-green-600 text-white'
          }`}
          onClick={() => {
            const idx = Math.floor(Math.random() * segCount);
            spin({ winningIndex: idx });
          }}
          disabled={isSpinning && disableWhileSpinning}
        >
          Zakręć
        </button>
      </div>

      <div className="text-sm text-gray-600">
        {isSpinning ? 'Spinning...' : 'Ready'}
      </div>
    </div>
  );
}
