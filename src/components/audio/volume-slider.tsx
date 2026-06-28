"use client";

import { Volume2, Volume1, VolumeX } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { useSettings } from "@/contexts/settings-context";

export function VolumeSlider() {
  const { setVolume } = useAudio();
  const { settings } = useSettings();
  const { volume } = settings;

  const Icon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-[var(--spacing-sm)]">
      <Icon className="h-4 w-4 text-[var(--color-content-secondary)]" />
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-[var(--color-border-subtle)] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
        aria-label="Volume"
      />
    </div>
  );
}
