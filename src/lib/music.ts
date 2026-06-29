export interface Track {
  id: number;
  title: string;
  src: string;
}

export const TRACKS: Track[] = [
  { id: 1, title: "Vice City Dream", src: "/audio/track-02.mp3" },
  { id: 2, title: "Synthwave Nights", src: "/audio/track-02.mp3" },
  { id: 3, title: "Neon Coastline", src: "/audio/track-02.mp3" },
  { id: 4, title: "Ocean Drive", src: "/audio/track-02.mp3" },
  { id: 5, title: "Midnight Rain", src: "/audio/track-02.mp3" },
];

export const SOUND_EFFECTS = {
  tick: "/audio/tick.mp3",
  celebration: "/audio/celebration.mp3",
} as const;
