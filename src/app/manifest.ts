import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - GTA VI Countdown`,
    short_name: SITE_NAME,
    description: "The most beautiful GTA VI countdown experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#111117",
    theme_color: "#111117",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
