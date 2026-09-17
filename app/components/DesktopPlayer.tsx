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

export function DesktopPlayer() {
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
    <div className="glass rounded-full p-3 pr-5 flex items-center gap-4 max-w-xl w-full">
      {/* Vinyl */}
      <Vinyl track={currentTrack} isPlaying={state.isPlaying} size={80} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title and Artist */}
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-white truncate">
            {currentTrack?.title || "No track selected"}
          </h2>
          <p className="text-[12.5px] text-white/70 truncate">
            {currentTrack?.artist || "Select a playlist to begin"}
          </p>
        </div>

        {/* Seek bar */}
        <div className="mt-2">
          <SeekBar
            current={state.currentTime}
            duration={state.duration}
            onSeek={seek}
          />
        </div>

        {/* Time display */}
        <div className="text-[10.5px] text-white/50 font-tabular-nums mt-1">
          {formatTime(state.currentTime)} / {formatTime(state.duration)}
        </div>
      </div>

      {/* Transport controls */}
      <TransportControls
        isPlaying={state.isPlaying}
        onPlay={play}
        onPause={pause}
        onNext={nextTrack}
        onPrev={prevTrack}
        layout="desktop"
      />
    </div>
  );
}
