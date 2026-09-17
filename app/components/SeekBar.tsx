"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface SeekBarProps {
  current: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function SeekBar({ current, duration, onSeek }: SeekBarProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percent = duration > 0 ? (current / duration) * 100 : 0;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!railRef.current) return;
      setIsDragging(true);

      const rect = railRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const time = (x / rect.width) * duration;
      onSeek(time);
    },
    [duration, onSeek]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!railRef.current) return;

      const rect = railRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const time = (x / rect.width) * duration;
      onSeek(time);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, duration, onSeek]);

  return (
    <div
      ref={railRef}
      onPointerDown={handlePointerDown}
      className="touch-none relative h-6 w-full cursor-pointer"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={current}
      tabIndex={0}
    >
      {/* Rail background */}
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-white/15 rounded-full" />

      {/* Filled portion */}
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-white/80 to-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
        style={{ width: `${percent}%` }}
      />

      {/* Knob - visible on hover or while dragging */}
      <div
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${percent}%`, marginLeft: "-6px" }}
      />
    </div>
  );
}
