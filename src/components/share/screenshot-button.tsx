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
        <span className="hidden group-hover:inline">{t("screenshot")}</span>
      </button>

      {showModal && imageUrl && typeof document !== "undefined" && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6, 6, 16, 0.75)", backdropFilter: "blur(10px)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden"
            style={{
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh" , 
              background: "rgba(26, 16, 48, 0.95)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
              borderRadius: "0px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(192,132,240,0.12)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#FFD700",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                Screenshot
              </span>
              <button
                onClick={handleClose}
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(192,132,240,0.08)",
                  border: "none",
                  cursor: "pointer",
                  color: "#9999BB",
                  borderRadius: "9999px",
                  padding: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.18)";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.08)";
                  (e.currentTarget as HTMLElement).style.color = "#9999BB";
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            <div style={{ padding: "0 28px" , display:"flex" , justifyContent:"center"  , width: "100%"}}>
              <img
                src={imageUrl}
                alt="GTimer Countdown"
                style={{
                  width: "60%",
                  borderRadius: "0px",
                  display: "block",
                }}
              />
            </div>

            {/* Share buttons */}
            <div
              className="flex flex-col gap-2"
              style={{ padding: "20px 28px 24px", borderTop: "1px solid rgba(192,132,240,0.12)" }}
            >
              {/* Row 1: Download + Native Share */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 flex-1 rounded-xl py-2.5 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#C084F0",
                    background: "rgba(192,132,240,0.12)",
                    border: "1px solid rgba(192,132,240,0.3)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.3)";
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                {typeof navigator.share === "function" && (
                  <button
                    onClick={handleShareNative}
                    className="flex items-center justify-center gap-2 flex-1 rounded-xl py-2.5 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#E0E0FF",
                      background: "rgba(192,132,240,0.15)",
                      border: "1px solid rgba(192,132,240,0.3)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.15)";
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                )}
              </div>

              {/* Row 2: WhatsApp + Facebook + Instagram */}
              <div className="flex gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#25D366",
                    background: "rgba(37,211,102,0.12)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.3)";
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#1877F2",
                    background: "rgba(24,119,242,0.12)",
                    border: "1px solid rgba(24,119,242,0.3)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.3)";
                  }}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Facebook
                </button>
                <button
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#DD2A7B",
                    background: "rgba(221,42,123,0.12)",
                    border: "1px solid rgba(221,42,123,0.3)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(221,42,123,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(221,42,123,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(221,42,123,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(221,42,123,0.3)";
                  }}
                >
                  <Camera className="h-4 w-4" />
                  Instagram
                </button>
              </div>

              {/* Copied toast */}
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: "#00D4AA",
                    padding: "4px 0",
                  }}
                >
                  Image copied — paste in Instagram!
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>,
        document.body,
      )}
    </>
  );
}
