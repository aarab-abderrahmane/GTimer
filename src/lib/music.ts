export interface Track {
  id: number;
  title: string;
  src: string;
}

export const TRACKS: Track[] = [
  { id: 1, title: "Vice City Dream 1", src: "https://github.com/aabderahman190-oss/gtimer_video/releases/download/v2.0/track-01.mp3" },
  { id: 2, title: "Vice City Dream 2", src: "https://github.com/aabderahman190-oss/gtimer_video/releases/download/v2.0/track-02.mp3" },
  { id: 3, title: "Love Is A Long Road", src: "https://github.com/aabderahman190-oss/gtimer_video/releases/download/v2.0/Love_Is_A_Long_Road.mp3" },
  { id: 4, title: "Love Is A Long Road 2", src: "https://github.com/aabderahman190-oss/gtimer_video/releases/download/v2.0/Love_Is_A_Long_Road2.mp3" },
  { id: 5, title: "Miami Vibe", src: "https://github.com/aabderahman190-oss/gtimer_video/releases/download/v2.0/Miami_Vibe.mp3" },


];

export const SOUND_EFFECTS = {
  celebration: "/audio/celebration.mp3",
} as const;
