"use client";

import { usePlayer } from "./YouTubePlayer";
import { playlists } from "@/lib/playlists";

export function PlaylistSelector() {
  const { setPlaylist } = usePlayer();

  const handleSelectPlaylist = (playlistKey: keyof typeof playlists) => {
    const playlist = playlists[playlistKey];
    setPlaylist(playlist.tracks, 0);
  };

  return (
    <div className="flex gap-2 text-xs text-white/60">
      {Object.entries(playlists).map(([key, playlist]) => (
        <button
          key={key}
          onClick={() => handleSelectPlaylist(key as keyof typeof playlists)}
          className="px-3 py-1 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-95"
        >
          {playlist.name}
        </button>
      ))}
    </div>
  );
}
