export interface Track {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: number;
  videoId: string;
}

export const classicScores: Track[] = [
  {
    id: "as-time-goes-by",
    title: "As Time Goes By",
    artist: "Dooley Wilson",
    film: "Casablanca",
    year: 1942,
    duration: 195,
    videoId: "lJIrF4YjHzQ",
  },
];

export const goldenAge: Track[] = [
  {
    id: "over-the-rainbow",
    title: "Over the Rainbow",
    artist: "Judy Garland",
    film: "The Wizard of Oz",
    year: 1939,
    duration: 245,
    videoId: "PSZxmZmBHSo",
  },
];

export const epicAdventures: Track[] = [
  {
    id: "moonlight-sonata",
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    film: "Classical",
    year: 1801,
    duration: 300,
    videoId: "4Tr0otuiaMU",
  },
];

export const indianMusic: Track[] = [
  {
    id: "musafir-cafe-darmiyaan",
    title: "Musafir Cafe: Darmiyaan (Unplugged)",
    artist: "Rekha Bhardwaj, Raghav, Amrita",
    film: "Musafir Series",
    year: 2024,
    duration: 180,
    videoId: "2pVM8Fs9qRI",
  },
  {
    id: "jab-tu-sajan",
    title: "Jab Tu Sajan",
    artist: "Rochak Kohli, Mohit Chauhan, Gurpreet",
    film: "Aap Jaisa Koi",
    year: 2024,
    duration: 240,
    videoId: "68gBaJ3RWxQ",
  },
  {
    id: "chori-chori",
    title: "Chori Chori",
    artist: "Amit Trivedi",
    film: "Grahan (Hotstar Specials)",
    year: 2020,
    duration: 210,
    videoId: "HnGpaCOEE5I",
  },
  {
    id: "ek-dil-ek-jaan",
    title: "Ek Dil Ek Jaan",
    artist: "Deepika Padukone, Shahid Kapoor",
    film: "Padmaavat",
    year: 2018,
    duration: 230,
    videoId: "c64I9HNpiOY",
  },
  {
    id: "parvati-full-song",
    title: "Parvati (Full Song)",
    artist: "Sadhu Tiwari, Shobhinaw Satyaa",
    film: "Jab Zid Pe Aa Gayi Parvati",
    year: 2024,
    duration: 200,
    videoId: "rjfxLq3OQ0w",
  },
  {
    id: "shiv-kailash-live",
    title: "Shiv Kailash (Live in Mumbai)",
    artist: "Rishab Rikhiram Sharma",
    film: "Sitar for Mental Health",
    year: 2023,
    duration: 240,
    videoId: "Onb6_bRJ0Bw",
  },
  {
    id: "dooron-dooron-live",
    title: "Dooron Dooron (Live)",
    artist: "Paresh Pahuja",
    film: "The Voice Notes Concert",
    year: 2023,
    duration: 220,
    videoId: "9T-Zbxg9X_4",
  },
];

export const playlists = {
  "noir-classics": {
    name: "Film Noir Classics",
    tracks: classicScores,
  },
  "golden-age": {
    name: "Golden Age Hollywood",
    tracks: goldenAge,
  },
  "epic-adventures": {
    name: "Epic Adventures",
    tracks: epicAdventures,
  },
  "indian-music": {
    name: "🎵 Indian Music",
    tracks: indianMusic,
  },
};  