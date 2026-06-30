export interface ScreenshotData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  timezone: string;
  timezoneOffset: string;
  countryFlag: string;
  logoUrl: string; // أضفنا رابط أو مسار صورة الشعار هنا
}

// ─── Canvas dimensions — 4:5 Instagram portrait ───────────────────────────
const W = 1080;
const H = 1350;

// ─── Font stacks ───────────────────────────────────────────────────────────
const FONT_DISPLAY = '"Barlow Condensed", "Arial Narrow", "Helvetica Neue", sans-serif';
const FONT_BODY    = '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Palette (GTimer app design tokens) ─────────────────────────────────────
const C = {
  bgDeep:      "#060610",
  bgPrimary:   "#0d0d1e",
  bgElevated:  "#1a1030",
  textPrimary: "#FFFFFF",
  textBody:    "#E0E0FF",
  textCaption: "#9999BB",
  lavender:    "#C084F0",
  gold:        "#FFD700",
  pink:        "#FF6B9D",
  border:      "rgba(192, 132, 240, 0.2)",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/** رسم النص مع تباعد بين الأحرف */
function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: CanvasTextAlign = "center",
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total  = widths.reduce((a, b) => a + b, 0) + (chars.length - 1) * spacing;
  let sx = x;
  if (align === "center") sx = x - total / 2;
  if (align === "right")  sx = x - total;
  let cx = sx;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cx, y);
    cx += widths[i] + spacing;
  }
}

/** خط أفقي رفيع للتزيين */
function drawRule(
  ctx: CanvasRenderingContext2D,
  y: number,
  x1: number,
  x2: number,
  color: string,
) {
  const grad = ctx.createLinearGradient(x1, y, x2, y);
  grad.addColorStop(0,    "transparent");
  grad.addColorStop(0.5,  color);
  grad.addColorStop(1,    "transparent");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

/** رسم مستطيل بحواف دائرية */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** دالة مساعدة لتحميل الصورة كـ Promise */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─── Main render ───────────────────────────────────────────────────────────
export function renderScreenshot(data: ScreenshotData): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("Canvas context unavailable")); return; }


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 1 — Background (الخلفية)
    // ══════════════════════════════════════════════════════════════════════

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,    C.bgDeep);
    bg.addColorStop(0.5,  C.bgPrimary);
    bg.addColorStop(1,    C.bgElevated);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const lavenderGlow = ctx.createRadialGradient(W/2, H/3, 100, W/2, H/3, 700);
    lavenderGlow.addColorStop(0, "rgba(192, 132, 240, 0.12)");
    lavenderGlow.addColorStop(1, "transparent");
    ctx.fillStyle = lavenderGlow;
    ctx.fillRect(0, 0, W, H);


    // ══════════════════════════════════════════════════════════════════════
    // Premium Border
    // ══════════════════════════════════════════════════════════════════════

    ctx.save();

    const border = 28;

    roundRect(ctx, border, border, W - border * 2, H - border * 2, 34);

    const borderGradient = ctx.createLinearGradient(0, 0, W, H);
    borderGradient.addColorStop(0, "rgba(192, 132, 240, 0.85)");
    borderGradient.addColorStop(0.5, "rgba(255, 107, 157, 0.55)");
    borderGradient.addColorStop(1, "rgba(192, 132, 240, 0.85)");

    ctx.lineWidth = 4;
    ctx.strokeStyle = borderGradient;
    ctx.shadowColor = "rgba(192, 132, 240, 0.35)";
    ctx.shadowBlur = 20;
    ctx.stroke();

    ctx.restore();


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 2 — Top Text & Logo Image (صورة الشعار المجمعة)
    // ══════════════════════════════════════════════════════════════════════

    ctx.save();
    ctx.fillStyle    = C.textCaption;
    ctx.font         = `600 13px ${FONT_BODY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    drawSpaced(ctx, "THE NEXT CHAPTER BEGINS", W / 2, 80, 5, "center");
    ctx.restore();

    // تحميل ورسم صورة الشعار الجاهزة
    try {
      const logoImg = await loadImage(data.logoUrl);
      
      const maxLogoW = 550; // عرض الشعار في التصميم (يمكنك تكبيره أو تصغيره)
      const scale = maxLogoW / logoImg.width;
      const logoW = maxLogoW;
      const logoH = logoImg.height * scale;
      
      const logoX = (W - logoW) / 2;
      const logoY = 120; // موقع الشعار من الأعلى

      ctx.save();
      // إضافة ظل خفيف للصورة ليعطيها عمقاً وجمالية
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;
      
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      ctx.restore();
      
    } catch (error) {
      console.warn("Could not load logo image", error);
    }


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 3 — Date Area (التاريخ)
    // ══════════════════════════════════════════════════════════════════════

    const dateY = 610;

    ctx.save();
    ctx.fillStyle    = C.gold;
    ctx.font         = `600 18px ${FONT_BODY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "alphabetic";
    drawSpaced(ctx, "COMING", W / 2, dateY, 6, "center");
    ctx.restore();

    ctx.save();
    ctx.fillStyle    = C.textPrimary;
    ctx.font         = `800 52px ${FONT_DISPLAY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "top";
    ctx.fillText("19 NOVEMBER 2026", W / 2, dateY + 22);
    ctx.restore();


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 4 — Countdown Numbers (أرقام العد التنازلي)
    // ══════════════════════════════════════════════════════════════════════

    const timeY = 740;
    
    ctx.save();
    ctx.fillStyle    = C.lavender;
    ctx.font         = `600 15px ${FONT_BODY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    drawSpaced(ctx, "TIME LEFT UNTIL LAUNCH", W / 2, timeY, 4, "center");
    ctx.restore();

    drawRule(ctx, timeY, 150, 320, C.border);
    drawRule(ctx, timeY, W - 320, W - 150, C.border);

    const units = [
      { value: String(data.days),    label: "DAYS"  },
      { value: String(data.hours),   label: "HOURS" },
      { value: String(data.minutes), label: "MINS"  },
      { value: String(data.seconds), label: "SECS"  },
    ];

    const numY = 880;
    const spacing = 220;
    const startX = (W - (spacing * 3)) / 2;

    for (let i = 0; i < units.length; i++) {
      const cx = startX + (i * spacing);
      
      ctx.save();
      ctx.fillStyle    = C.lavender;
      ctx.font         = `800 120px ${FONT_DISPLAY}`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(units[i].value.padStart(2, "0"), cx, numY);
      ctx.restore();

      ctx.save();
      ctx.fillStyle    = C.textCaption;
      ctx.font         = `600 16px ${FONT_BODY}`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "top";
      ctx.fillText(units[i].label, cx, numY + 20);
      ctx.restore();

      if (i < units.length - 1) {
        ctx.save();
        ctx.fillStyle    = C.lavender;
        ctx.font         = `800 60px ${FONT_DISPLAY}`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(":", cx + (spacing / 2), numY - 30);
        ctx.restore();
      }
    }


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 5 — Timezone Box (صندوق المنطقة الزمنية)
    // ══════════════════════════════════════════════════════════════════════

    const boxW = 600;
    const boxH = 90;
    const boxX = (W - boxW) / 2;
    const boxY = 1015;

    drawRule(ctx, boxY, boxX, boxX + boxW, C.border);

    ctx.save();
    ctx.fillStyle    = C.textBody;
    ctx.font         = `600 20px ${FONT_BODY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${data.countryFlag}   ${data.timezone} (${data.timezoneOffset})`, W / 2, boxY + 35);
    ctx.restore();

    ctx.save();
    ctx.fillStyle    = C.textCaption;
    ctx.font         = `400 14px ${FONT_BODY}`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Your countdown is based on this local time", W / 2, boxY + 65);
    ctx.restore();


    // ══════════════════════════════════════════════════════════════════════
    //  LAYER 6 — Footer (تذييل الصورة)
    // ══════════════════════════════════════════════════════════════════════

    const footY = 1248;

    drawRule(ctx, footY - 55, 120, W - 120, "rgba(255,255,255,.06)");


    // LEFT ---------------------------------------------------

    ctx.save();
    ctx.fillStyle = C.textPrimary;
    ctx.font = `800 34px ${FONT_DISPLAY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("GTimer", 120, footY);
    ctx.restore();


    // CENTER WEBSITE -----------------------------------------

    ctx.save();

    roundRect(ctx, W / 2 - 95, footY - 23, 190, 46, 23);

    ctx.fillStyle = "rgba(26, 16, 48, 0.85)";
    ctx.fill();

    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = C.pink;
    ctx.font = `700 18px ${FONT_BODY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("gtimer.app", W / 2, footY + 1);

    ctx.restore();


    // RIGHT --------------------------------------------------

    ctx.save();
    ctx.fillStyle = C.pink;
    ctx.font = `800 24px ${FONT_DISPLAY}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("YOUR GTA VI", W - 120, footY - 15);
    ctx.fillText("COUNTDOWN", W - 120, footY + 15);
    ctx.restore();


    // ══════════════════════════════════════════════════════════════════════
    //  EXPORT (التصدير)
    // ══════════════════════════════════════════════════════════════════════

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      },
      "image/png",
    );
  });
}