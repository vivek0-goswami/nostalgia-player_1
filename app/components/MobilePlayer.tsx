"use client";

import { usePlayer } from "./YouTubePlayer";
import { Vinyl } from "./Vinyl";
import { SeekBar } from "./SeekBar";
import { TransportControls } from "./TransportControls";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MobilePlayer() {
  const {
    state,
    currentTrack,
    play,
    pause,
    seek,
    nextTrack,
    prevTrack,
  } = usePlayer();

  return (
    <div className="glass rounded-[26px] p-4 w-full max-w-sm">
      {/* Row 1: Vinyl + Title/Artist */}
      <div className="flex gap-3 mb-4">
        <Vinyl track={currentTrack} isPlaying={state.isPlaying} size={64} />
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h2 className="text-sm font-semibold text-white truncate">
            {currentTrack?.title || "No track selected"}
          </h2>
          <p className="text-xs text-white/70 truncate">
            {currentTrack?.artist || "Select a playlist to begin"}
          </p>
        </div>
      </div>

      {/* Row 2: Seek bar */}
      <div className="mb-4">
        <SeekBar
          current={state.currentTime}
          duration={state.duration}
          onSeek={seek}
        />
      </div>

      {/* Row 3: Time + Transport */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/50 font-tabular-nums">
          {formatTime(state.currentTime)} / {formatTime(state.duration)}
        </div>

        <TransportControls
          isPlaying={state.isPlaying}
          onPlay={play}
          onPause={pause}
          onNext={nextTrack}
          onPrev={prevTrack}
          layout="mobile"
        />
      </div>
    </div>
  );
}
