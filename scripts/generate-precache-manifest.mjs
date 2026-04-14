#!/usr/bin/env node
/**
 * Post-build: writes `public/precache-manifest.json` with same-origin URLs to precache in `public/sw.js`.
 * Run via `npm run postbuild` (after `next build`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "public", "precache-manifest.json");

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else acc.push(p);
  }
  return acc;
}

/** URL path under site root; encodes each segment (spaces in filenames). */
function publicFileToUrl(absFile, publicRoot) {
  const rel = path.relative(publicRoot, absFile).split(path.sep).join("/");
  if (!rel || rel.startsWith("..")) return null;
  return `/${rel.split("/").map(encodeURIComponent).join("/")}`;
}

function main() {
  const urls = new Set();

  for (const p of ["/", "/search", "/search?view=ai", "/chat"]) {
    urls.add(p);
  }

  const productsPath = path.join(root, "src", "data", "products.ts");
  if (fs.existsSync(productsPath)) {
    const text = fs.readFileSync(productsPath, "utf8");
    for (const m of text.matchAll(/^\s+id:\s*"([^"]+)"/gm)) {
      urls.add(`/product/${m[1]}`);
    }
  }

  const nextStatic = path.join(root, ".next", "static");
  if (fs.existsSync(nextStatic)) {
    for (const f of walkFiles(nextStatic)) {
      const rel = path.relative(nextStatic, f).split(path.sep).join("/");
      if (rel) urls.add(`/_next/static/${rel}`);
    }
  } else {
    console.warn("[precache] .next/static missing — run `next build` first. Manifest will skip build chunks.");
  }

  const publicRoot = path.join(root, "public");
  if (fs.existsSync(publicRoot)) {
    for (const f of walkFiles(publicRoot)) {
      const base = path.basename(f);
      if (base === "precache-manifest.json") continue;
      const u = publicFileToUrl(f, publicRoot);
      if (u) urls.add(u);
    }
  }

  const sorted = [...urls].sort();
  const payload = {
    generatedAt: new Date().toISOString(),
    urlCount: sorted.length,
    urls: sorted,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 0), "utf8");
  console.log(`[precache] wrote ${sorted.length} URLs → public/precache-manifest.json`);
}

main();
