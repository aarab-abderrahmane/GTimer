export interface Track {
  id: number;
  title: string;
  src: string;
}

export const TRACKS: Track[] = [
    { id: 1, title: "Vice City Dream 1", src: "/audio/track-01.mp3" },

  { id: 2, title: "Vice City Dream 2", src: "/audio/track-02.mp3" },
];

export const SOUND_EFFECTS = {
  celebration: "/audio/celebration.mp3",
} as const;
