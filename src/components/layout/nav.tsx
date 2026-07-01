"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AudioMenu } from "@/components/audio/audio-menu";
import { SettingsModal } from "@/components/settings/settings-modal";

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
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between"
        style={{
          padding: "16px clamp(12px, 3vw, 32px)",
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
            fontSize: "clamp(18px, 3vw, 22px)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            textDecoration: "none",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          G<span style={{ color: "#C084F0" }}>TIMER</span>
        </Link>

        {/* Center Controls — hidden on mobile */}
        <div
          className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          style={{ zIndex: 10 }}
        >
          <LocalizationMenu />
          <AudioMenu />
        </div>

        {/* Desktop Nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center" style={{ gap: "32px", position: "relative", zIndex: 10 }}>
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

        {/* Mobile buttons — visible only on mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(26,16,48,0.6)",
              border: "1px solid rgba(192,132,240,0.2)",
              color: "#E0E0FF",
              cursor: "pointer",
            }}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsSlideoutOpen(true)}
            className="flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(26,16,48,0.6)",
              border: "1px solid rgba(192,132,240,0.2)",
              color: "#E0E0FF",
              cursor: "pointer",
            }}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Slide-out mobile nav */}
      <SlideoutNav isOpen={isSlideoutOpen} onClose={() => setIsSlideoutOpen(false)} />

      {/* Settings modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SlideoutNav
// ─────────────────────────────────────────────────────────────────────────────

interface SlideoutNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Each nav item
interface NavItem {
  href: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/",          labelKey: "home"      },
  { href: "/extension", labelKey: "extension" },
  { href: "/privacy",   labelKey: "privacy"   },
  { href: "/terms",     labelKey: "terms"     },
];

export function SlideoutNav({ isOpen, onClose }: SlideoutNavProps) {
  const t        = useTranslations("nav");
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 48,
              background: "rgba(4, 4, 12, 0.55)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />

          {/* ── Panel ───────────────────────────────────────────────── */}
          <motion.div
            key="panel"
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 49,
              width: "min(82vw, 420px)",
              display: "flex",
              flexDirection: "column",
              background: "#130c28",
              borderLeft: "1px solid rgba(192,132,240,0.12)",
            }}
          >
            {/* Left-edge glow strip */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "1px",
                bottom: 0,
                background:
                  "linear-gradient(to bottom, transparent, rgba(192,132,240,0.45) 30%, rgba(192,132,240,0.45) 70%, transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Ambient background glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 90% 50% at 80% 20%, rgba(139,63,204,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* ── Header ─────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px 20px 28px",
                borderBottom: "1px solid rgba(192,132,240,0.10)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Logo + title */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <img
                  src="/icons/icon-192x192.png"
                  alt="GTimer"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      lineHeight: 1,
                    }}
                  >
                    G<span style={{ color: "#C084F0" }}>Timer</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 400,
                      letterSpacing: "0.08em",
                      color: "#9999BB",
                      marginTop: "3px",
                      textTransform: "uppercase",
                    }}
                  >
                    GTA VI Countdown
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(192,132,240,0.12)",
                  border: "1px solid rgba(192,132,240,0.22)",
                  color: "#C084F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(192,132,240,0.24)";
                  el.style.borderColor = "rgba(192,132,240,0.5)";
                  el.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(192,132,240,0.12)";
                  el.style.borderColor = "rgba(192,132,240,0.22)";
                  el.style.color = "#C084F0";
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {/* ── Nav items ──────────────────────────────────────── */}
            <nav
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px 0 0",
                position: "relative",
              }}
            >
              {NAV_ITEMS.map(({ href, labelKey }, i) => {
                const isActive =
                  href === "/"
                    ? pathname === "/" || pathname === ""
                    : pathname.startsWith(href);

                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.055,
                      duration: 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "15px 28px",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(192,132,240,0.06)",
                        transition: "background 220ms ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(192,132,240,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "20%",
                            bottom: "20%",
                            width: "3px",
                            borderRadius: "0 2px 2px 0",
                            background:
                              "linear-gradient(to bottom, #FFD700, #F5B800)",
                          }}
                        />
                      )}

                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(26px, 6vw, 32px)",
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          lineHeight: 1,
                          color: isActive ? "#FFD700" : "#C084F0",
                          transition: "color 200ms",
                        }}
                      >
                        {t(labelKey) ?? labelKey}
                      </span>

                    </Link>
                  </motion.div>
                );
              })}
            </nav>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}