export interface Track {
  id: number;
  title: string;
  src: string;
}

export const TRACKS: Track[] = [
  { id: 1, title: "Vice City Dream", src: "/audio/track-02.mp3" },
];

export const SOUND_EFFECTS = {
  celebration: "/audio/celebration.mp3",
} as const;
