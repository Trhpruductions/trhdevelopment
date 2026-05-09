const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const filesToScan = [
  path.join(repoRoot, "public", "app.js"),
  path.join(repoRoot, "public", "index.html")
];

const assetRefPattern = /(["'`])\s*(\/assets\/[A-Za-z0-9_./-]+\.(?:svg|png|jpg|jpeg|webp|gif))\s*\1/g;
const referencedAssets = new Set();

for (const filePath of filesToScan) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing source file for asset scan: ${filePath}`);
    process.exitCode = 1;
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const match of content.matchAll(assetRefPattern)) {
    referencedAssets.add(match[2]);
  }
}

const missingAssets = [];
for (const assetPath of referencedAssets) {
  const absoluteAssetPath = path.join(repoRoot, "public", assetPath.replace(/^\/assets\//, "assets/"));
  if (!fs.existsSync(absoluteAssetPath)) {
    missingAssets.push({ assetPath, absoluteAssetPath });
  }
}

if (missingAssets.length > 0) {
  console.error("Asset verification failed. Missing files:");
  for (const row of missingAssets) {
    console.error(`- ${row.assetPath} -> ${row.absoluteAssetPath}`);
  }
  process.exit(1);
}

console.log(`Asset verification passed. Checked ${referencedAssets.size} referenced asset path(s).`);
