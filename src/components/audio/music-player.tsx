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
    <div className="relative flex items-center gap-1">
      {/* Play/Pause pill */}
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300 backdrop-blur-md"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: isPlaying ? "#C084F0" : "#E0E0FF",
          background: isPlaying
            ? "rgba(192,132,240,0.15)"
            : "rgba(26,16,48,0.6)",
          border: isPlaying
            ? "1px solid rgba(192,132,240,0.4)"
            : "1px solid rgba(192,132,240,0.2)",
          cursor: "pointer",
        }}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        <Music className="h-3 w-3" />
      </button>

      {/* Track selector pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-full px-3 py-1.5 transition-all duration-300 backdrop-blur-md"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.03em",
          color: "#9999BB",
          background: "rgba(26,16,48,0.6)",
          border: "1px solid rgba(192,132,240,0.2)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#9999BB";
        }}
      >
        <span
          style={{
            maxWidth: "72px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {currentTrack.title}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-300",
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
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute start-0 top-full z-50 overflow-hidden"
            style={{
              marginTop: "8px",
              width: "224px",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            {TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  selectTrack(track);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 text-start transition-all duration-200"
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: track.id === currentTrack.id ? 600 : 300,
                  color:
                    track.id === currentTrack.id ? "#FFD700" : "#E0E0FF",
                  background:
                    track.id === currentTrack.id
                      ? "rgba(192,132,240,0.1)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(192,132,240,0.06)",
                }}
                onMouseEnter={(e) => {
                  if (track.id !== currentTrack.id) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(192,132,240,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (track.id !== currentTrack.id) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                  }
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "rgba(192,132,240,0.5)",
                    flexShrink: 0,
                  }}
                >
                  {String(track.id).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate">{track.title}</span>
                {track.id === currentTrack.id && isPlaying && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#C084F0",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
