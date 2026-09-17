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
  }, []);

  const onPlayerReady = useCallback(() => {
    // Player ready
  }, []);

  const onPlayerStateChange = useCallback(
    (event: YT.PlayerEvent) => {
      const player = playerRef.current;
      if (!player || !window.YT) return;

      if (event.data === window.YT.PlayerState.PLAYING) {
        setState((prev) => ({ ...prev, isPlaying: true }));
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        setState((prev) => ({ ...prev, isPlaying: false }));
      } else if (event.data === window.YT.PlayerState.ENDED) {
        // Move to next track
        setCurrentTrackIndex((prev) => {
          const next = prev + 1;
          if (next < playlist.length) {
            return next;
          }
          return prev;
        });
      }
    },
    [playlist.length]
  );

  const onPlayerError = useCallback(
    (event: YT.PlayerError) => {
      const errorCodes: { [key: number]: string } = {
        2: "Invalid parameter",
        5: "HTML5 player error",
        100: "Video not found",
        101: "Video embedding not allowed",
        150: "Video embedding not allowed (same as 101)",
      };
      const errorMsg = errorCodes[event.data] || "Unknown error";
      setState((prev) => ({ ...prev, error: errorMsg }));

      // Skip to next track on error
      setCurrentTrackIndex((prev) => {
        const next = prev + 1;
        if (next < playlist.length) {
          return next;
        }
        return prev;
      });
    },
    [playlist.length]
  );

  // Update player when currentTrackIndex changes
  useEffect(() => {
    if (!playerRef.current || playlist.length === 0) return;

    const track = playlist[currentTrackIndex];
    if (track) {
      playerRef.current.loadVideoById(track.videoId);
      setState((prev) => ({
        ...prev,
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
      return next < playlist.length ? next : prev;
    });
  }, [playlist.length]);

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
