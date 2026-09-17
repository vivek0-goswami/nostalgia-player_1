export namespace YT {
  export enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  export interface PlayerEvent {
    data: PlayerState;
    target: Player;
  }

  export interface PlayerError {
    data: number;
    target: Player;
  }

  export interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerEvent) => void;
      onError?: (event: PlayerError) => void;
    };
    playerVars?: {
      autoplay?: number;
      controls?: number;
      modestbranding?: number;
      rel?: number;
      fs?: number;
      iv_load_policy?: number;
      disablekb?: number;
      [key: string]: any;
    };
  }

  export interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    loadVideoById(videoId: string): void;
    cueVideoById(videoId: string): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
  }

  export interface IframeAPI {
    loaded: number;
    Player: new (element: string | HTMLElement, options: PlayerOptions) => Player;
    PlayerState: typeof PlayerState;
  }
}

declare global {
  interface Window {
    YT?: YT.IframeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}
