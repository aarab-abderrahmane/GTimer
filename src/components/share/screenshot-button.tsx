"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Download, MessageCircle, ThumbsUp, Share2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { renderScreenshot, type ScreenshotData } from "@/lib/render-screenshot";

interface ScreenshotButtonProps {
  data: ScreenshotData;
}

const SHARE_TEXT = "🕹️ GTA VI is coming! Check out the countdown:";

function openUrl(url: string) {
  window.open(url, "_blank", "noopener");
}

export function ScreenshotButton({ data }: ScreenshotButtonProps) {
  const t = useTranslations("share");
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blobCache, setBlobCache] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCapture = useCallback(async () => {
    setLoading(true);
    try {
      const blob = await renderScreenshot(data);
      const url = URL.createObjectURL(blob);
      setBlobCache(blob);
      setImageUrl(url);
      setShowModal(true);
      setLoading(false);
    } catch (err) {
      console.error("screenshot capture failed", err);
      setLoading(false);
    }
  }, [data]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "gtimer-countdown.png";
    a.click();
  }, [imageUrl]);

  const handleShareNative = useCallback(async () => {
    if (!blobCache) return;
    try {
      const file = new File([blobCache], "gtimer-countdown.png", {
        type: "image/png",
      });
      await navigator.share({ files: [file], title: "GTA VI Countdown", text: SHARE_TEXT });
    } catch {}
  }, [blobCache]);

  const handleShareWhatsApp = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}`;
    openUrl(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`);
  }, []);

  const handleShareFacebook = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}`;
    openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }, []);

  const handleShareInstagram = useCallback(async () => {
    if (!blobCache) return;
    // On mobile, try native share which includes Instagram
    if (typeof navigator.share === "function") {
      try {
        const file = new File([blobCache], "gtimer-countdown.png", {
          type: "image/png",
        });
        await navigator.share({ files: [file], title: "GTA VI Countdown" });
        return;
      } catch {}
    }
    // Fallback: copy image to clipboard
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blobCache }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Last resort: copy the text link
      const url = `${window.location.origin}${window.location.pathname}`;
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [blobCache]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setBlobCache(null);
    setCopied(false);
  }, [imageUrl]);

  return (
    <>
      <button
        onClick={handleCapture}
        disabled={loading}
        aria-label={t("screenshot")}
        className="group flex items-center gap-2 transition-all px-3  duration-300"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#E0E0FF",
          opacity: loading ? 0.5 : 0.7,
          background: "none",
          border: "none",
          cursor: loading ? "default" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!loading)
            (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          if (!loading)
            (e.currentTarget as HTMLElement).style.opacity = "0.7";
        }}
      >
        <Camera className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />
        <span className="hidden sm:group-hover:inline">{t("screenshot")}</span>
      </button>

      {showModal && imageUrl && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(4,4,12,0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={handleClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="flex flex-col overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                background: "#130c28",
                borderRadius: "20px",
                border: "1px solid rgba(192,132,240,0.13)",
                pointerEvents: "all",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "180px",
                  background: "radial-gradient(ellipse 80% 100% at 50% -20%, rgba(139,63,204,0.22) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Header */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: "14px 22px 13px",
                  borderBottom: "1px solid rgba(192,132,240,0.13)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      lineHeight: 1,
                    }}
                  >
                    {t("shareImage")}
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "#9999BB",
                      marginTop: "4px",
                    }}
                  >
                    {t("createCard")}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(192,132,240,0.09)",
                    border: "1px solid rgba(192,132,240,0.16)",
                    cursor: "pointer",
                    color: "#9999BB",
                    transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.18)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.09)";
                    (e.currentTarget as HTMLElement).style.color = "#9999BB";
                  }}
                >
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 28px" }}>
                {/* Section: Preview */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "28px",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#FFD700",
                    }}
                  >
                    Preview
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(255,215,0,0.22) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Image preview frame with gold corner brackets */}
                <div
                  style={{
                    background: "rgba(13,8,30,0.75)",
                    borderRadius: "12px",
                    border: "1px solid rgba(192,132,240,0.13)",
                    position: "relative",
                    display: "flex",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                    lineHeight: 0,
                  }}
                >
                  {/* Gold corner brackets */}
                  <span style={{ position: "absolute", top: "-1px", left: "-1px", width: "16px", height: "16px", borderTop: "2px solid #FFD700", borderLeft: "2px solid #FFD700", borderTopLeftRadius: "12px" }} />
                  <span style={{ position: "absolute", top: "-1px", right: "-1px", width: "16px", height: "16px", borderTop: "2px solid #FFD700", borderRight: "2px solid #FFD700", borderTopRightRadius: "12px" }} />
                  <span style={{ position: "absolute", bottom: "-1px", left: "-1px", width: "16px", height: "16px", borderBottom: "2px solid #FFD700", borderLeft: "2px solid #FFD700", borderBottomLeftRadius: "12px" }} />
                  <span style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "16px", height: "16px", borderBottom: "2px solid #FFD700", borderRight: "2px solid #FFD700", borderBottomRightRadius: "12px" }} />

                  <img
                    src={imageUrl}
                    alt="GTimer Countdown"
                    style={{
                      width: "100%",
                      display: "block",
                      borderRadius: "12px",
                    }}
                  />
                </div>

                {/* Section: Share */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "28px",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#FFD700",
                    }}
                  >
                    Share
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(255,215,0,0.22) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Download — Primary CTA */}
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full py-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#FFD700",
                    background: "rgba(13,8,30,0.75)",
                    border: "1px solid rgba(192,132,240,0.13)",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    boxShadow: "0 0 24px rgba(139,63,204,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.30)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(139,63,204,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.13)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(139,63,204,0.15)";
                  }}
                >
                  <Download className="h-4 w-4" />
                  {t("download")}
                </button>

                {/* Platform row */}
                <div className="flex justify-center gap-2 sm:gap-1.5" style={{ marginTop: "12px" }}>
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto sm:flex-1 rounded-full sm:py-2.5 sm:gap-1.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#25D366",
                      background: "rgba(37,211,102,0.12)",
                      border: "1px solid rgba(37,211,102,0.25)",
                      cursor: "pointer",
                      transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.25)";
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareFacebook}
                    className="flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto sm:flex-1 rounded-full sm:py-2.5 sm:gap-1.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#1877F2",
                      background: "rgba(24,119,242,0.12)",
                      border: "1px solid rgba(24,119,242,0.25)",
                      cursor: "pointer",
                      transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.25)";
                    }}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                  <button
                    onClick={handleShareInstagram}
                    className="flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto sm:flex-1 rounded-full sm:py-2.5 sm:gap-1.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#DD2A7B",
                      background: "rgba(221,42,123,0.12)",
                      border: "1px solid rgba(221,42,123,0.25)",
                      cursor: "pointer",
                      transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(221,42,123,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(221,42,123,0.25)";
                    }}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">Instagram</span>
                  </button>
                </div>

                {/* Native Share */}
                {typeof navigator.share === "function" && (
                  <button
                    onClick={handleShareNative}
                    className="flex items-center justify-center gap-2 w-full rounded-full py-2.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#C084F0",
                      background: "rgba(13,8,30,0.75)",
                      border: "1px solid rgba(192,132,240,0.13)",
                      cursor: "pointer",
                      marginTop: "12px",
                      transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.12)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(13,8,30,0.75)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.13)";
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    {t("shareButton")}
                  </button>
                )}

                {/* Copied toast */}
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: "center",
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#FFD700",
                      padding: "10px 0 0",
                    }}
                  >
                    {t("copiedImage")}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
