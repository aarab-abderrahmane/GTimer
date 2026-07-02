
import { useEffect, useRef, useState } from "react";
import {
  X, Globe, Clock, Palette, Bell, Volume2, Info,
  Music, Play, Pause, MapPin, ChevronDown, Search, Check,
  Repeat, Repeat1,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "@/contexts/settings-context";
import { useAudio } from "@/contexts/audio-context";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, LANGUAGE_NAMES, type Locale } from "@/lib/constants";
import { COUNTRIES, getCountryFlag } from "@/lib/countries";
import { TRACKS, type Track } from "@/lib/music";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:           "#130c28",
  surface:      "rgba(13, 8, 30, 0.75)",
  surfaceHov:   "rgba(26, 16, 48, 0.85)",
  border:       "rgba(192, 132, 240, 0.13)",
  borderHov:    "rgba(192, 132, 240, 0.30)",
  purple:       "#C084F0",
  gold:         "#FFD700",
  white:        "#FFFFFF",
  body:         "#E0E0FF",
  muted:        "#9999BB",
  teal:         "#00D4AA",
  ease:         "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

// ─── Section title ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "28px",
        marginBottom: "2px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: C.gold,
        }}
      >
        {children}
      </span>
      <span
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(255,215,0,0.22) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

// ─── Setting row ─────────────────────────────────────────────────────────────
function Row({
  children,
  noBorder,
}: {
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "13px 0",
        borderBottom: noBorder ? "none" : `1px solid ${C.border}`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Row left (icon + label) ─────────────────────────────────────────────────
function RowLeft({
  icon: Icon,
  label,
  sub,
}: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  label: string;
  sub: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "rgba(192,132,240,0.10)",
          border: `1px solid rgba(192,132,240,0.16)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: "14px", height: "14px", color: C.purple }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            color: C.body,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.muted,
            marginTop: "1px",
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: "42px",
        height: "23px",
        borderRadius: "9999px",
        background: value
          ? "linear-gradient(90deg, #8B3FCC, #C084F0)"
          : "rgba(255,255,255,0.07)",
        border: `1px solid ${value ? "rgba(192,132,240,0.45)" : "rgba(255,255,255,0.10)"}`,
        cursor: "pointer",
        transition: `all 280ms ${C.ease}`,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: value ? "21px" : "2px",
          width: "17px",
          height: "17px",
          borderRadius: "50%",
          background: value ? "#FFFFFF" : "rgba(255,255,255,0.40)",
          transition: `left 280ms ${C.ease}, background 280ms`,
          boxShadow: value ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
        }}
      />
    </button>
  );
}

// ─── Segmented control (replaces SelectPill) ─────────────────────────────────
function Segment({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: "rgba(10, 6, 22, 0.60)",
        border: `1px solid ${C.border}`,
        borderRadius: "9999px",
        padding: "3px",
        gap: "2px",
        flexShrink: 0,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "4px 13px",
              borderRadius: "9999px",
              background: active ? "rgba(192,132,240,0.20)" : "transparent",
              border: `1px solid ${active ? "rgba(192,132,240,0.32)" : "transparent"}`,
              color: active ? C.white : C.muted,
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: `all 180ms ${C.ease}`,
              whiteSpace: "nowrap",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Coming soon overlay ──────────────────────────────────────────────────────
function ComingSoonOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "rgba(19,12,40,0.60)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "0",
        }}
      >
        {/* <span
          style={{
            background: "rgba(255,215,0,0.10)",
            border: "1px solid rgba(255,215,0,0.18)",
            borderRadius: "9999px",
            padding: "2px 10px",
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: C.gold,
            whiteSpace: "nowrap",
          }}
        >
          Soon
        </span> */}
      </div>
    </div>
  );
}

// ─── Country selector ────────────────────────────────────────────────────────
function CountrySelector({
  settings,
  updateSettings,
}: {
  settings: { country: string; timezone?: string };
  updateSettings: (p: { country: string; timezone: string }) => void;
}) {
  const t = useTranslations("settings");
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = query
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()),
      )
    : COUNTRIES;

  const current = COUNTRIES.find((c) => c.code === settings.country);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        onClick={() => { setOpen((v) => !v); if (open) setQuery(""); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "30px",
          padding: "0 10px 0 8px",
          borderRadius: "9999px",
          background: open ? C.surfaceHov : C.surface,
          border: `1px solid ${open ? C.borderHov : C.border}`,
          color: C.body,
          cursor: "pointer",
          transition: `all 220ms ${C.ease}`,
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "15px", lineHeight: 1 }}>
          {getCountryFlag(settings.country)}
        </span>
        <span style={{ color: C.muted, fontSize: "12px", maxWidth: "70px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {current?.name.split(" ")[0] ?? "Select"}
        </span>
        <ChevronDown
          style={{
            width: "12px",
            height: "12px",
            color: C.muted,
            transition: `transform 220ms ${C.ease}`,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 6px)",
              zIndex: 60,
              width: "210px",
              background: "#18103a",
              border: `1px solid ${C.borderHov}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: "8px 10px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Search style={{ width: "13px", height: "13px", color: C.muted, flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                placeholder={t("searchCountries")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: C.body,
                  caretColor: C.purple,
                }}
              />
            </div>

            {/* List */}
            <div style={{ maxHeight: "200px", overflowY: "auto", scrollbarWidth: "thin" }}>
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "14px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: C.muted,
                    textAlign: "center",
                  }}
                >
                  {t("noResults")}
                </div>
              ) : (
                filtered.map((country) => {
                  const sel = country.code === settings.country;
                  return (
                    <button
                      key={country.code}
                      onClick={() => {
                        updateSettings({ country: country.code, timezone: country.timezones[0] });
                        setOpen(false);
                        setQuery("");
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 14px",
                        background: sel ? "rgba(192,132,240,0.10)" : "transparent",
                        border: "none",
                        borderBottom: `1px solid ${C.border}`,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: `background 150ms`,
                      }}
                      onMouseEnter={(e) => {
                        if (!sel) (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "16px", lineHeight: 1, flexShrink: 0 }}>
                        {country.flag}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: sel ? 600 : 400,
                          color: sel ? C.gold : C.body,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {country.name}
                      </span>
                      {sel && (
                        <Check style={{ width: "12px", height: "12px", color: C.gold, flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Language selector ────────────────────────────────────────────────────────
function LanguageSelector({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (l: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "30px",
          padding: "0 10px",
          borderRadius: "9999px",
          background: open ? C.surfaceHov : C.surface,
          border: `1px solid ${open ? C.borderHov : C.border}`,
          color: C.body,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          transition: `all 220ms ${C.ease}`,
          whiteSpace: "nowrap",
        }}
      >
        <Globe style={{ width: "12px", height: "12px", color: C.muted, flexShrink: 0 }} />
        <span>{LANGUAGE_NAMES[locale]}</span>
        <ChevronDown
          style={{
            width: "12px",
            height: "12px",
            color: C.muted,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform 220ms ${C.ease}`,
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 6px)",
              zIndex: 60,
              background: "#18103a",
              border: `1px solid ${C.borderHov}`,
              borderRadius: "12px",
              minWidth: "160px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              maxHeight: "200px", overflowY: "auto", scrollbarWidth: "thin",

            }}
          >
            {LOCALES.map((l) => {
              const sel = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => { onChange(l); setOpen(false); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: sel ? "rgba(192,132,240,0.10)" : "transparent",
                    border: "none",
                    borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: `background 150ms`,
                    
                  }}
                  onMouseEnter={(e) => {
                    if (!sel) (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: sel ? 600 : 400,
                      color: sel ? C.gold : C.body,
                    }}
                  >
                    {LANGUAGE_NAMES[l]}
                  </span>
                  {sel && (
                    <Check style={{ width: "12px", height: "12px", color: C.gold, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Music player card ────────────────────────────────────────────────────────
function MusicCard({
  isPlaying,
  currentTrack,
  toggle,
  selectTrack,
  volume,
  setVolume,
  loopMode,
  setLoopMode,
}: {
  isPlaying: boolean;
  currentTrack: Track;
  toggle: () => void;
  selectTrack: (t: Track) => void;
  volume: number;
  setVolume: (v: number) => void;
  loopMode: "one" | "all";
  setLoopMode: (m: "one" | "all") => void;
}) {
  const t = useTranslations("settings");
  return (
    <div
      style={{
        marginTop: "4px",
        background: "rgba(10, 6, 22, 0.55)",
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* Track row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 14px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Play/pause */}
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: isPlaying
              ? "linear-gradient(135deg, #8B3FCC, #C084F0)"
              : "rgba(192,132,240,0.12)",
            border: `1px solid ${isPlaying ? "rgba(192,132,240,0.45)" : C.border}`,
            color: isPlaying ? C.white : C.purple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: `all 250ms ${C.ease}`,
          }}
        >
          {isPlaying
            ? <Pause style={{ width: "14px", height: "14px" }} />
            : <Play  style={{ width: "14px", height: "14px", marginLeft: "1px" }} />}
        </button>

        {/* Loop toggle */}
        <button
          onClick={() => setLoopMode(loopMode === "one" ? "all" : "one")}
          aria-label={t(loopMode === "one" ? "loopOne" : "loopAll")}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: loopMode === "all" ? "rgba(192,132,240,0.12)" : "rgba(192,132,240,0.06)",
            border: `1px solid ${loopMode === "all" ? "rgba(192,132,240,0.30)" : "rgba(192,132,240,0.12)"}`,
            color: loopMode === "all" ? C.purple : C.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: `all 250ms ${C.ease}`,
          }}
        >
          {loopMode === "one"
            ? <Repeat1 style={{ width: "13px", height: "13px" }} />
            : <Repeat  style={{ width: "13px", height: "13px" }} />}
        </button>

        {/* Track select — custom dropdown trigger */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isPlaying ? C.purple : C.muted,
              marginBottom: "3px",
            }}
          >
            {t(isPlaying ? "nowPlaying" : "selectTrack")}
          </div>
          <select
            value={currentTrack.id}
            onChange={(e) => {
              const track = TRACKS.find((t) => t.id === Number(e.target.value));
              if (track) selectTrack(track);
            }}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              color: C.body,
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
            }}
          >
            {TRACKS.map((track) => (
              <option
                key={track.id}
                value={track.id}
                style={{ background: "#18103a", color: C.body }}
              >
                {track.title}
              </option>
            ))}
          </select>
        </div>

        {/* Playing indicator dots */}
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "16px", flexShrink: 0 }}>
            {[1, 0.6, 0.85].map((h, i) => (
              <div
                key={i}
                style={{
                  width: "3px",
                  borderRadius: "9999px",
                  background: C.purple,
                  animation: `barAnim 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  height: `${h * 16}px`,
                  opacity: 0.8,
                }}
              />
            ))}
            <style>{`
              @keyframes barAnim {
                from { transform: scaleY(0.3); }
                to   { transform: scaleY(1); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Volume row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
        }}
      >
        <Volume2 style={{ width: "13px", height: "13px", color: C.muted, flexShrink: 0 }} />
        <div style={{ flex: 1, position: "relative", height: "4px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              background: "rgba(192,132,240,0.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${volume}%`,
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #8B3FCC, #C084F0)",
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            style={{
              position: "absolute",
              inset: "-8px 0",
              width: "100%",
              opacity: 0,
              cursor: "pointer",
              margin: 0,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            color: C.muted,
            minWidth: "26px",
            textAlign: "right",
          }}
        >
          {volume}
        </span>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { settings, updateSettings } = useSettings();
  const { isPlaying, currentTrack, toggle, selectTrack, setVolume, pause, loopMode, setLoopMode } = useAudio();
  const locale   = useLocale() as Locale;
  const router   = useRouter();
  const pathname = usePathname();
  const t = useTranslations("settings");

  // decorative / coming-soon state
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [theme,         setTheme]         = useState("Dark");
  const [timeFormat,    setTimeFormat]    = useState("24h");
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleLocaleChange(newLocale: string) {
    pause();
    updateSettings({ language: newLocale as Locale });
    const segments = pathname.split("/").filter(Boolean);
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push(`/${segments.join("/")}`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(4,4,12,0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Sheet */}
          <motion.div
            key="settings-modal"
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90dvh",
                display: "flex",
                flexDirection: "column",
                background: C.bg,
                borderRadius: "20px 20px 0 0",
                border: `1px solid ${C.border}`,
                borderBottom: "none",
                pointerEvents: "all",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top ambient glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "180px",
                  background:
                    "radial-gradient(ellipse 80% 100% at 50% -20%, rgba(139,63,204,0.22) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Drag handle */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", flexShrink: 0 }}>
                <div
                  style={{
                    width: "32px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: "rgba(192,132,240,0.22)",
                  }}
                />
              </div>

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 22px 13px",
                  borderBottom: `1px solid ${C.border}`,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: C.white,
                      lineHeight: 1,
                    }}
                  >
                    {t("title")}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: C.muted,
                      marginTop: "4px",
                    }}
                  >
                    {t("subtitle")}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label={t("closeModal")}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(192,132,240,0.09)",
                    border: `1px solid rgba(192,132,240,0.16)`,
                    color: C.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: `all 200ms ${C.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(192,132,240,0.18)";
                    el.style.color = C.white;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(192,132,240,0.09)";
                    el.style.color = C.muted;
                  }}
                >
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              {/* Scrollable body */}
              <div
                style={{
                  padding: "0 22px 36px",
                  overflowY: "auto",
                  flex: 1,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(192,132,240,0.2) transparent",
                }}
              >
                {/* ── DISPLAY ──────────────────────────── */}
                <SectionTitle>{t("display")}</SectionTitle>

                <ComingSoonOverlay>
                  <Row>
                    <RowLeft icon={Palette} label={t("theme")} sub={t("appearance")} />
                    <Segment options={["Dark", "Light"]} value={theme} onChange={setTheme} />
                  </Row>
                </ComingSoonOverlay>

                <ComingSoonOverlay>
                  <Row>
                    <RowLeft icon={ZapIcon} label={t("motion")} sub={t("reduceBattery")} />
                    <Toggle value={motionEnabled} onChange={setMotionEnabled} />
                  </Row>
                </ComingSoonOverlay>

                {/* ── COUNTDOWN ────────────────────────── */}
                <SectionTitle>{t("countdown")}</SectionTitle>

                <ComingSoonOverlay>
                  <Row>
                    <RowLeft icon={Clock} label={t("timeFormat")} sub={t("hoursDisplay")} />
                    <Segment options={["12h", "24h"]} value={timeFormat} onChange={setTimeFormat} />
                  </Row>
                </ComingSoonOverlay>

                <Row>
                  <RowLeft icon={MapPin} label={t("country")} sub={t("timezoneRef")} />
                  <CountrySelector settings={settings} updateSettings={updateSettings} />
                </Row>

                {/* ── SOUND & ALERTS ───────────────────── */}
                <SectionTitle>{t("soundAlerts")}</SectionTitle>

                <Row>
                  <RowLeft icon={Volume2} label={t("sound")} sub={t("ambientAudio")} />
                  <Toggle
                    value={settings.soundEnabled}
                    onChange={(v) => updateSettings({ soundEnabled: v })}
                  />
                </Row>

                <ComingSoonOverlay>
                  <Row>
                    <RowLeft icon={Bell} label={t("releaseNotifs")} sub={t("remindLaunch")} />
                    <Toggle value={notifyEnabled} onChange={setNotifyEnabled} />
                  </Row>
                </ComingSoonOverlay>

                {/* ── LANGUAGE ─────────────────────────── */}
                <SectionTitle>{t("language")}</SectionTitle>

                <Row>
                  <RowLeft icon={Globe} label={t("language")} sub={t("interfaceLang")} />
                  <LanguageSelector locale={locale} onChange={handleLocaleChange} />
                </Row>

                {/* ── MUSIC ────────────────────────────── */}
                <SectionTitle>{t("music")}</SectionTitle>

                <MusicCard
                  isPlaying={isPlaying}
                  currentTrack={currentTrack}
                  toggle={toggle}
                  selectTrack={selectTrack}
                  volume={settings.volume}
                  setVolume={setVolume}
                  loopMode={loopMode}
                  setLoopMode={setLoopMode}
                />

                {/* ── VERSION ──────────────────────────── */}
                <div
                  style={{
                    marginTop: "28px",
                    padding: "13px 15px",
                    borderRadius: "12px",
                    background: "rgba(255,215,0,0.04)",
                    border: "1px solid rgba(255,215,0,0.10)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Info style={{ width: "14px", height: "14px", color: C.gold, flexShrink: 0 }} />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: C.body,
                        fontWeight: 500,
                      }}
                    >
                      {t("version")}
                    </div>
             
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Local Zap icon (avoids lucide naming collision) ─────────────────────────
function ZapIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
