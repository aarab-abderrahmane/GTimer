"use client";

import { useEffect, useRef } from "react";
import { SOUND_EFFECTS } from "@/lib/music";
import { useSettings } from "@/contexts/settings-context";

export function useTickSound() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(settings.soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = settings.soundEnabled;
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (settings.soundEnabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio(SOUND_EFFECTS.tick);
        audioRef.current.volume = 0.3;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [settings.soundEnabled]);

  const play = () => {
    if (!soundEnabledRef.current || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  return play;
}
