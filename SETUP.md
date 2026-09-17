# Nostalgia Player Setup

## Background Images

Add your background images to `public/bg/`:

- **`public/bg/scene-wide.png`** — Landscape orientation (16:9 aspect ratio recommended)
- **`public/bg/scene-tall.png`** — Portrait orientation (9:16 aspect ratio, separately composed, not a crop)

The CSS automatically swaps between them based on viewport orientation:
- Desktop: uses `scene-wide.png`
- Mobile (portrait): uses `scene-tall.png`

## Project Structure

```
app/
├── components/
│   ├── Clock.tsx                 # Asia/Kolkata time with blinking colon
│   ├── YouTubePlayer.tsx         # YouTube IFrame API integration + React context
│   ├── SeekBar.tsx               # Draggable seek bar with pointer events
│   ├── TransportControls.tsx     # Play/Pause/Next/Prev buttons
│   ├── Vinyl.tsx                 # Spinning album art with CSS animation
│   ├── DesktopPlayer.tsx         # Horizontal glass pill (hidden on mobile)
│   ├── MobilePlayer.tsx          # Stacked card layout (hidden on desktop)
│   └── PlaylistSelector.tsx      # Playlist buttons
├── globals.css                   # Tailwind v4 with @theme tokens
├── layout.tsx                    # Viewport config + Analytics
└── page.tsx                      # Main server component

lib/
└── playlists.ts                  # Track data with YouTube video IDs
```

## Playlists

Edit `lib/playlists.ts` to add/remove tracks. Each track is a one-line addition:

```typescript
{
  id: "unique-id",
  title: "Track Title",
  artist: "Artist Name",
  film: "Film Name",
  year: 1942,
  duration: 195,  // in seconds
  videoId: "YouTube_Video_ID",  // from youtube.com/watch?v=<ID>
}
```

## Important Notes

### YouTube Videos
- **Only include songs you have the right to use**, or that stream from the rights holder's own YouTube upload with embedding enabled.
- The player displays the YouTube iframe visibly in the artwork slot (not hidden). This complies with YouTube's Developer Policies and allows viewers to see the Skip Ad button.
- Embedding restrictions are enforced — if a video has embedding disabled or is deleted, it will error and skip to the next track automatically.

### Component Architecture
- All sub-components are defined at **module scope** (not inside parent components) to prevent React remounting the subtree on each render, which would restart the vinyl CSS animation.
- The `YouTubePlayerProvider` wraps the app and exposes `usePlayer()` hook for playback state and controls.

### Mobile Safeguards
- The play button is never gated behind a `canplay` event (iOS Safari won't fire it before a user gesture).
- Seek bar uses `onPointerDown` (not `onClick`) to enable smooth dragging.
- `touch-none` class prevents page scrolling while seeking.

## Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Deployment

The project includes Vercel Analytics and Speed Insights. Deploy to Vercel or any Node.js host:

```bash
npm run build
npm start
```

## Customization

- **Glass effect**: Adjust `backdrop-blur-3xl`, `backdrop-saturate-[1.7]`, and gradient opacity in `app/globals.css`
- **Vinyl spin speed**: Change `8s` in `app/globals.css` animation definition
- **Color scheme**: Update theme colors in `@theme` block in `app/globals.css`
- **Typography**: Adjust font sizes in player components (15px title, 12.5px artist on desktop, etc.)
