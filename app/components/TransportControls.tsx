"use client";

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  layout?: "desktop" | "mobile";
}

export function TransportControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  layout = "desktop",
}: TransportControlsProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  if (layout === "mobile") {
    return (
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          onClick={onPrev}
          className="active:scale-95 transition-transform"
          aria-label="Previous track"
        >
          <PrevIcon />
        </button>

        <button
          onClick={handlePlayPause}
          className="h-13 w-13 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 ring-1 ring-white/25 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] active:scale-95 transition-transform flex items-center justify-center"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseIconLarge /> : <PlayIconLarge />}
        </button>

        <button
          onClick={onNext}
          className="active:scale-95 transition-transform"
          aria-label="Next track"
        >
          <NextIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        aria-label="Previous track"
      >
        <PrevIcon size={16} />
      </button>

      <button
        onClick={handlePlayPause}
        className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <PauseIcon size={16} />
        ) : (
          <PlayIcon size={16} />
        )}
      </button>

      <button
        onClick={onNext}
        className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        aria-label="Next track"
      >
        <NextIcon size={16} />
      </button>
    </div>
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PlayIconLarge() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function PauseIconLarge() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="white">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function PrevIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function NextIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M16 18h2V6h-2v12zm-11-7l8.5-6v12z" />
    </svg>
  );
}
