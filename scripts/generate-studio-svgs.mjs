/**
 * Generates matching “dark studio” product SVGs (same lighting, same palette).
 * Run: node scripts/generate-studio-svgs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/products/studio");

const studioBg = `
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="0.78" fx="50%" fy="42%">
      <stop offset="0%" stop-color="#1c212c"/>
      <stop offset="55%" stop-color="#0e1016"/>
      <stop offset="100%" stop-color="#060708"/>
    </radialGradient>
    <linearGradient id="bezel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d4654"/>
      <stop offset="100%" stop-color="#1e232c"/>
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a3140"/>
      <stop offset="100%" stop-color="#12151c"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#353c48"/>
      <stop offset="100%" stop-color="#1a1f28"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>`;

function tvBody(scale = 1) {
  const w = 320 * scale;
  const h = 185 * scale;
  const x = 400 - w / 2;
  const y = 220 - h / 2;
  return `
  <g filter="url(#soft)">
    <rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="10" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#bezel)"/>
    <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 22}" rx="3" fill="url(#glass)"/>
    <rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 30}" rx="2" fill="rgba(0,0,0,0.35)"/>
    <path d="M ${400 - 55 * scale} ${y + h} L ${400 + 55 * scale} ${y + h} L ${400 + 42 * scale} ${y + h + 28 * scale} L ${400 - 42 * scale} ${y + h + 28 * scale} Z" fill="#14161c"/>
    <rect x="${400 - 38 * scale}" y="${y + h + 28 * scale}" width="${76 * scale}" height="${6 * scale}" rx="2" fill="#0c0e12"/>
  </g>`;
}

function soundbarBody(wide = 1) {
  const bw = 340 * wide;
  const bh = 48 * wide;
  const x = 400 - bw / 2;
  const y = 268;
  return `
  <g filter="url(#soft)">
    <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="url(#bar)"/>
    <rect x="${x + 8}" y="${y + 10}" width="${bw - 16}" height="8" rx="2" fill="rgba(0,0,0,0.25)"/>
    <circle cx="${400 - 100 * wide}" cy="${y + bh / 2}" r="4" fill="rgba(255,255,255,0.08)"/>
    <circle cx="${400 + 100 * wide}" cy="${y + bh / 2}" r="4" fill="rgba(255,255,255,0.08)"/>
    <ellipse cx="400" cy="${y + bh + 55}" rx="90" ry="14" fill="rgba(0,0,0,0.35)"/>
  </g>`;
}

function accessoryHdmi() {
  return `
  <g filter="url(#soft)">
    <rect x="280" y="200" width="240" height="160" rx="8" fill="#161a22" stroke="rgba(255,255,255,0.06)"/>
    <path d="M 340 280 L 460 280 L 455 320 L 345 320 Z" fill="#252b36" stroke="rgba(255,255,255,0.08)"/>
    <rect x="380" y="240" width="40" height="24" rx="3" fill="#1e2430"/>
    <path d="M 400 264 L 400 300" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="400" cy="330" r="28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  </g>`;
}

function accessoryMount() {
  return `
  <g filter="url(#soft)">
    <rect x="260" y="180" width="280" height="200" rx="6" fill="#141820" stroke="rgba(255,255,255,0.06)"/>
    <rect x="320" y="220" width="160" height="100" rx="4" fill="#1c222c"/>
    <circle cx="360" cy="270" r="12" fill="none" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="440" cy="270" r="12" fill="none" stroke="rgba(255,255,255,0.1)"/>
    <rect x="395" y="320" width="10" height="80" fill="#252b36"/>
  </g>`;
}

const specs = {
  "tv-aurora-oled-65": () => tvBody(1),
  "tv-horizon-qled-75": () => tvBody(1.08),
  "tv-aurora-oled-55": () => tvBody(0.88),
  "tv-pulse-led-55": () => tvBody(0.92),
  "tv-pulse-led-50": () => tvBody(0.82),
  "tv-aurora-oled-77": () => tvBody(1.12),
  "sb-nova-atmos-500": () => soundbarBody(1.05),
  "sb-echo-compact-210": () => soundbarBody(0.92),
  "sb-pulse-bar-mini": () => soundbarBody(0.78),
  "acc-hdmi-ultra-3m": () => accessoryHdmi(),
  "acc-wall-mount-tilt": () => accessoryMount(),
};

function wrap(id, inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="t">
  <title id="t">Product — ${id}</title>
  ${studioBg}
  ${inner}
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const [id, fn] of Object.entries(specs)) {
  fs.writeFileSync(path.join(outDir, `${id}.svg`), wrap(id, fn()), "utf8");
}
console.log(`Wrote ${Object.keys(specs).length} SVGs to public/products/studio/`);
