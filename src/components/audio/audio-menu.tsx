"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Play, Pause, ChevronDown, Volume2, Volume1, VolumeX } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { useSettings } from "@/contexts/settings-context";
import { TRACKS } from "@/lib/music";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function AudioMenu() {
  const { isPlaying, currentTrack, selectTrack, setVolume } = useAudio();
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("settings");

  const VolumeIcon = settings.volume === 0 ? VolumeX : settings.volume < 50 ? Volume1 : Volume2;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-300 backdrop-blur-md"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: isPlaying ? "#C084F0" : "#E0E0FF",
          background: isPlaying ? "rgba(192,132,240,0.15)" : "rgba(26,16,48,0.6)",
          border: isPlaying ? "1px solid rgba(192,132,240,0.4)" : "1px solid rgba(192,132,240,0.2)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isPlaying) {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.5)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }
        }}
        onMouseLeave={(e) => {
          if (!isPlaying) {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.2)";
            (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
          }
        }}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5 shrink-0" /> : <Play className="h-3.5 w-3.5 shrink-0" />}
        <Music className="h-3 w-3 shrink-0" />
        <span
          style={{
            maxWidth: "72px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            color: "#9999BB"
          }}
        >
          {currentTrack.title}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-300 text-[#9999BB]",
            isOpen && "rotate-180"
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
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 overflow-hidden"
            style={{
              marginTop: "8px",
              width: "280px",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Volume Control */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10" style={{ borderColor: "rgba(192,132,240,0.12)" }}>
              <VolumeIcon className="h-4 w-4 shrink-0 text-[#9999BB]" />
              <input
                type="range"
                min={0}
                max={100}
                value={settings.volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1 cursor-pointer appearance-none rounded-full bg-[rgba(192,132,240,0.2)] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C084F0]"
                aria-label="Volume"
              />
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ borderColor: "rgba(192,132,240,0.12)" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9999BB" }}>
                {t("sound")}
              </span>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className="relative transition-all duration-300"
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "50px",
                  background: settings.soundEnabled ? "#C084F0" : "rgba(42, 26, 64, 0.9)",
                  border: "1px solid rgba(192,132,240,0.3)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "1px",
                    left: settings.soundEnabled ? "17px" : "1px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    transition: "left 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </button>
            </div>

            {/* Track List */}
            <div className="overflow-y-auto max-h-48" style={{ scrollbarWidth: 'thin' }}>
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    selectTrack(track);
                  }}
                  className="flex w-full items-center gap-3 text-left transition-all duration-200"
                  style={{
                    padding: "10px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: track.id === currentTrack.id ? 600 : 300,
                    color: track.id === currentTrack.id ? "#FFD700" : "#E0E0FF",
                    background: track.id === currentTrack.id ? "rgba(192,132,240,0.1)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(192,132,240,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    if (track.id !== currentTrack.id) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.07)";
                      (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (track.id !== currentTrack.id) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                    }
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(192,132,240,0.5)", flexShrink: 0 }}>
                    {String(track.id).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate">{track.title}</span>
                  {track.id === currentTrack.id && isPlaying && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C084F0", flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
