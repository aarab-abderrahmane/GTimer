"use client";

import { useState, useEffect, useRef } from "react";
import { RELEASE_DATE } from "@/lib/constants";

export interface CountdownTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  total: number;
  isReleased: boolean;
}

function getTimeRemaining(target: Date): CountdownTime {
  const now = Date.now();
  const total = target.getTime() - now;

  if (total <= 0) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      total: 0,
      isReleased: true,
    };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  const milliseconds = total % 1000;

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total,
    isReleased: false,
  };
}

export function useCountdown() {
  const [time, setTime] = useState<CountdownTime>(() =>
    getTimeRemaining(RELEASE_DATE),
  );
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    function tick(timestamp: number) {
      if (timestamp - lastUpdateRef.current >= 16) {
        lastUpdateRef.current = timestamp;
        setTime(getTimeRemaining(RELEASE_DATE));
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return time;
}
