"use strict";
/**
 * Renders public/assets/trh-logo.svg → electron/icon.png (512×512)
 *                                     → electron/icon.ico (multi-size Windows icon)
 * Run with: node scripts/generate-icons.js
 */

const path = require("path");
const fs   = require("fs");

const SVG_PATH  = path.join(__dirname, "../public/assets/trh-logo.svg");
const ICON_DIR  = path.join(__dirname, "../electron");
const BUILD_DIR = path.join(__dirname, "../build");

async function main() {
  const { Resvg }  = require("@resvg/resvg-js");
  const pngToIco   = require("png-to-ico");

  fs.mkdirSync(ICON_DIR,  { recursive: true });
  fs.mkdirSync(BUILD_DIR, { recursive: true });

  const svgData = fs.readFileSync(SVG_PATH, "utf8");

  // ── 512×512 PNG ────────────────────────────────────────────────────────────
  const resvg     = new Resvg(svgData, { fitTo: { mode: "width", value: 512 } });
  const rendered  = resvg.render();
  const pngBuffer = rendered.asPng();

  const pngOut = path.join(ICON_DIR, "icon.png");
  fs.writeFileSync(pngOut, pngBuffer);
  fs.writeFileSync(path.join(BUILD_DIR, "icon.png"), pngBuffer);
  console.log("[icons] PNG written →", pngOut);

  // ── Windows ICO (16, 32, 48, 64, 128, 256 embedded) ──────────────────────
  // png-to-ico accepts an array of PNG buffers and picks sizes automatically
  const sizes   = [16, 32, 48, 64, 128, 256];
  const pngBufs = sizes.map((sz) => {
    const r = new Resvg(svgData, { fitTo: { mode: "width", value: sz } });
    return r.render().asPng();
  });

  const icoBuffer = await pngToIco(pngBufs);
  const icoOut = path.join(ICON_DIR, "icon.ico");
  fs.writeFileSync(icoOut, icoBuffer);
  fs.writeFileSync(path.join(BUILD_DIR, "icon.ico"), icoBuffer);
  console.log("[icons] ICO written →", icoOut);
}

main().catch((err) => {
  console.error("[icons] FAILED:", err.message);
  process.exit(1);
});
