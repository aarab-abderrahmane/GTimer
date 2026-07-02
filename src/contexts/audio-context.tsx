"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useSettings } from "./settings-context";
import { TRACKS, type Track } from "@/lib/music";
import { useToast } from "@/components/toast/toast";

interface AudioContextValue {
  isPlaying: boolean;
  currentTrack: Track;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  selectTrack: (track: Track) => void;
  setVolume: (v: number) => void;
  loopMode: "one" | "all";
  setLoopMode: (mode: "one" | "all") => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings();
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { show } = useToast();

  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  const loopModeRef = useRef(settings.loopMode);
  loopModeRef.current = settings.loopMode;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const initAudio = useCallback(
    (track: Track) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(track.src);
      audio.volume = settings.volume / 100;

      audio.addEventListener("ended", () => {
        if (loopModeRef.current === "one") {
          audio.play();
        } else {
          const tracks = TRACKS;
          const idx = tracks.findIndex((t) => t.id === currentTrackRef.current.id);
          const next = tracks[(idx + 1) % tracks.length];
          setCurrentTrack(next);
          initAudio(next);
          if (isPlayingRef.current) {
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {
              setIsPlaying(false);
            });
          }
        }
      });

      audio.addEventListener("error", () => {
        show(`Failed to load track: ${track.title}`, "error");
      });

      audioRef.current = audio;
    },
    [settings.volume, show],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume / 100;
    }
  }, [settings.volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) {
      initAudio(currentTrack);
    }
    audioRef.current?.play().then(() => {
      setIsPlaying(true);
      if (!settings.musicEnabled) {
        updateSettings({ musicEnabled: true });
      }
    }).catch((err) => {
      setIsPlaying(false);
      if (err.name === "NotAllowedError") {
        show("Autoplay blocked. Tap play to start music.", "info");
      } else {
        show("Music playback failed", "error");
      }
    });
  }, [currentTrack, initAudio, show, settings.musicEnabled, updateSettings]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const selectTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);
      try {
        initAudio(track);
        if (isPlaying) {
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
          });
        }
      } catch {
        show("Failed to load track", "error");
      }
    },
    [isPlaying, initAudio, show],
  );

  const setVolume = useCallback(
    (v: number) => {
      updateSettings({ volume: v });
    },
    [updateSettings],
  );

  const setLoopMode = useCallback(
    (mode: "one" | "all") => {
      updateSettings({ loopMode: mode });
    },
    [updateSettings],
  );

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        currentTrack,
        play,
        pause,
        toggle,
        selectTrack,
        setVolume,
        loopMode: settings.loopMode,
        setLoopMode,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
