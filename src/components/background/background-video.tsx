"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast/toast";

interface BackgroundVideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

export function BackgroundVideo({ src, poster, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    if (!videoRef.current || !src) return;
    setHasError(false);
    setIsLoaded(false);
    videoRef.current.load();
  }, [src]);

  const bgStyle = poster
    ? {
        backgroundImage: `url(${poster})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  return (
    <div
      className={cn("fixed inset-0 -z-20", className)}
      style={bgStyle}
    >
      {src && !hasError && (
        <video
          ref={videoRef}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            show("Background video failed to load", "error");
          }}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-1000",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
