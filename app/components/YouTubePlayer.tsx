"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Track } from "@/lib/playlists";
import { YT } from "@/app/types/youtube";

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
}

interface PlayerContextType {
  state: PlayerState;
  currentTrack: Track | null;
  playlist: Track[];
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylist: (tracks: Track[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within YouTubePlayerProvider");
  return ctx;
}

export function YouTubePlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    error: null,
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlist, setPlaylistState] = useState<Track[]>([]);

  // FIX: Keep a ref that always has the LATEST playlist and index.
  // The YouTube player's event callbacks are registered once at
  // construction time, so they close over whatever `playlist` and
  // `currentTrackIndex` were AT THAT MOMENT (usually empty/0).
  // Reading from a ref instead of the closed-over state guarantees
  // the "onEnded" / "onError" handlers always see current data.
  const playlistRef = useRef<Track[]>([]);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // Initialize YouTube API
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.YT?.loaded === 1) {
      initializePlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializePlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;
    if (!window.YT) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: "100%",
      width: "100%",
      videoId: "",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayerReady = useCallback(() => {
    // Player ready
  }, []);

  // FIX: This callback now has an EMPTY dependency array. It is
  // created exactly once, registered exactly once with the player,
  // and never goes stale — because instead of closing over
  // `playlist`/`currentTrackIndex` directly, it reads them from the
  // always-up-to-date refs declared above.
  const onPlayerStateChange = useCallback((event: YT.PlayerEvent) => {
    if (!window.YT) return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      setState((prev) => ({ ...prev, isPlaying: true }));
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else if (event.data === window.YT.PlayerState.ENDED) {
      const list = playlistRef.current;
      const current = currentTrackIndexRef.current;
      const next = current + 1;
      if (next < list.length) {
        setCurrentTrackIndex(next);
      } else {
        // End of playlist reached; stop "playing" state
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  }, []);

  const onPlayerError = useCallback((event: YT.PlayerError) => {
    const errorCodes: { [key: number]: string } = {
      2: "Invalid parameter",
      5: "HTML5 player error",
      100: "Video not found",
      101: "Video embedding not allowed",
      150: "Video embedding not allowed (same as 101)",
    };
    const errorMsg = errorCodes[event.data] || "Unknown error";
    setState((prev) => ({ ...prev, error: errorMsg }));

    // Skip to next track on error — also reads from refs, so this
    // works correctly even for playlists selected after mount.
    const list = playlistRef.current;
    const current = currentTrackIndexRef.current;
    const next = current + 1;
    if (next < list.length) {
      setCurrentTrackIndex(next);
    }
  }, []);

  // Load the current track into the player and auto-play it.
  // This effect re-runs whenever the track index OR the playlist
  // itself changes (e.g. user picks a different playlist).
  useEffect(() => {
    if (!playerRef.current || playlist.length === 0) return;

    const track = playlist[currentTrackIndex];
    if (track) {
      playerRef.current.loadVideoById(track.videoId);
      setState((prev) => ({
        ...prev,
        currentTime: 0,
        duration: track.duration,
        error: null,
      }));
    }
  }, [currentTrackIndex, playlist]);

  // Update current time
  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && state.isPlaying) {
        const current = playerRef.current.getCurrentTime();
        setState((prev) => ({ ...prev, currentTime: current }));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const next = prev + 1;
      return next < playlistRef.current.length ? next : prev;
    });
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const setPlaylist = useCallback((tracks: Track[], startIndex = 0) => {
    setPlaylistState(tracks);
    setCurrentTrackIndex(startIndex);
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const currentTrack = playlist[currentTrackIndex] || null;

  return (
    <>
      <div ref={containerRef} className="hidden" />
      <PlayerContext.Provider
        value={{
          state,
          currentTrack,
          playlist,
          play,
          pause,
          seek,
          nextTrack,
          prevTrack,
          setPlaylist,
        }}
      >
        {children}
      </PlayerContext.Provider>
    </>
  );
}
