"use client";

import { useEffect, useRef } from "react";
import { SOUND_EFFECTS } from "@/lib/music";
import { useSettings } from "@/contexts/settings-context";

export function useTickSound() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!settings.soundEnabled) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(SOUND_EFFECTS.tick);
      audioRef.current.volume = 0.3;
    }
  }, [settings.soundEnabled]);

  const play = () => {
    if (!settings.soundEnabled || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  return play;
}
