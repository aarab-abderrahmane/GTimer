"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Play, Pause, ChevronDown } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { TRACKS } from "@/lib/music";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const { isPlaying, currentTrack, toggle, selectTrack } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className={cn(
          "flex items-center gap-[var(--spacing-sm)] rounded-[var(--radius-pill)] px-[var(--spacing-md)] py-[var(--spacing-xs)] backdrop-blur-[6.25px] transition-all",
          isPlaying
            ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
            : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)]",
        )}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <Music className="h-3 w-3" />
      </button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-[var(--spacing-xs)] inline-flex items-center gap-[2px] rounded-[var(--radius-pill)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-caption)] text-[var(--color-content-secondary)] backdrop-blur-[6.25px] transition-colors hover:text-[var(--color-content)]"
      >
        <span className="max-w-[80px] truncate">{currentTrack.title}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-[var(--spacing-sm)] w-56 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-[12px]"
          >
            {TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  selectTrack(track);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--text-body)] transition-colors",
                  track.id === currentTrack.id
                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-alt)]",
                )}
              >
                <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-border-subtle)]">
                  {String(track.id).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate">{track.title}</span>
                {track.id === currentTrack.id && isPlaying && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
