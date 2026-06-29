"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/contexts/settings-context";

export function useTickSound() {
  const { settings } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(settings.soundEnabled);
  const volumeRef = useRef(settings.volume);

  useEffect(() => {
    soundEnabledRef.current = settings.soundEnabled;
  }, [settings.soundEnabled]);

  useEffect(() => {
    volumeRef.current = settings.volume;
  }, [settings.volume]);

  const play = () => {
    if (!soundEnabledRef.current) return;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 440;
    const vol = volumeRef.current / 100;
    gain.gain.setValueAtTime(0.2 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  };

  return play;
}

export function useTick2Sound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  return play;
}
