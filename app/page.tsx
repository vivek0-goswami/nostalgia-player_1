import { YouTubePlayerProvider } from "./components/YouTubePlayer";
import { DesktopPlayer } from "./components/DesktopPlayer";
import { MobilePlayer } from "./components/MobilePlayer";
import { Clock } from "./components/Clock";
import { PlaylistSelector } from "./components/PlaylistSelector";

export default function Home() {
  return (
    <YouTubePlayerProvider>
      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
        {/* Fixed background */}
        <div
          className="hero-bg fixed -z-20 inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/bg/scene-wide.png)",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
        </div>

        {/* Grain overlay */}
        <svg
          className="fixed -z-10 inset-0 w-full h-full pointer-events-none"
          style={{
            mixBlendMode: "overlay",
            opacity: 0.3,
          }}
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* Top row: Clock | Playlist Selector */}
        <div className="fixed top-0 left-0 right-0 z-10 flex items-start justify-between p-4 sm:p-6 pointer-events-none">
          <div className="pointer-events-auto">
            <Clock />
          </div>
          <div className="pointer-events-auto">
            <PlaylistSelector />
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center z-10 px-4">
          {/* Desktop Player */}
          <div className="hidden sm:flex">
            <DesktopPlayer />
          </div>

          {/* Mobile Player */}
          <div className="sm:hidden w-full max-w-sm">
            <MobilePlayer />
          </div>
        </div>

        {/* Bottom spacer for safe area */}
        <div
          className="h-4 w-full"
          style={{
            marginBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        />
      </main>
    </YouTubePlayerProvider>
  );
}
