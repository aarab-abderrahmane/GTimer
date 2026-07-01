const { writeFileSync } = require("fs");
const path = require("path");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#1a1040"/>
      <stop offset="100%" stop-color="#0d0d1e"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="280" font-family="Arial,Helvetica,sans-serif" font-size="120" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">G<tspan fill="#C084F0">Timer</tspan></text>
  <text x="600" y="340" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="300" fill="#8888BB" text-anchor="middle" letter-spacing="4" text-transform="uppercase">GTA VI Countdown</text>
  <text x="600" y="580" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="400" fill="rgba(255,255,255,0.15)" text-anchor="middle" letter-spacing="3" text-transform="uppercase">gtimer.app</text>
</svg>`;

writeFileSync(path.join(__dirname, "..", "public", "og-image.png"), svg);
console.log("OG image created as SVG at public/og-image.png");
