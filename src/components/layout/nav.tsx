"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AudioMenu } from "@/components/audio/audio-menu";

const LocalizationMenu = dynamic(
  () => import("@/components/localization/localization-menu").then((m) => ({ default: m.LocalizationMenu })),
  { ssr: false },
);

const links = [
  { href: "", label: "home" },
  { href: "/extension", label: "extension" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between"
      style={{
        padding: "16px 32px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        background: "linear-gradient(to bottom, rgba(6,6,16,0.6) 0%, transparent 100%)",
      }}
    >
      {/* Brand mark */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          textDecoration: "none",
          lineHeight: 1,
        }}
      >
        G<span style={{ color: "#C084F0" }}>TIMER</span>
      </Link>

      {/* Center Controls */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <LocalizationMenu />
        <AudioMenu />
      </div>

      {/* Nav links */}
      <div className="flex items-center" style={{ gap: "32px", position: "relative", zIndex: 10 }}>
        {links.map(({ href, label }) => {
          const isActive =
            href === ""
              ? pathname === `/${href}` || pathname === `/${href}/`
              : pathname.includes(href);
          return (
            <Link
              key={href}
              href={href || "/"}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive ? "#FFD700" : "#E0E0FF",
                opacity: isActive ? 1 : 0.75,
                transition: "color 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                  (e.currentTarget as HTMLElement).style.opacity = "0.75";
                }
              }}
            >
              {t(label)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
