"use client";

import { Track } from "@/lib/playlists";
import { CSSProperties } from "react";

interface VinylProps {
  track: Track | null;
  isPlaying: boolean;
  size?: number;
}

export function Vinyl({ track, isPlaying, size = 80 }: VinylProps) {
  const spinStyle: CSSProperties = {
    animation: "spin-vinyl 8s linear infinite",
    animationPlayState: isPlaying ? "running" : "paused",
  };

  const defaultThumbnail = `https://img.youtube.com/vi/${track?.videoId}/sddefault.jpg`;

  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden bg-black/30"
      style={{
        width: size,
        height: size,
        ...spinStyle,
      }}
    >
      {/* Vinyl disc */}
      {track ? (
        <img
          src={defaultThumbnail}
          alt={track.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if thumbnail doesn't load
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.videoId}/default.jpg`;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
      )}

      {/* Center spindle hole */}
      <div className="absolute inset-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
    </div>
  );
}
