const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "public", "app.js");
const serverJsPath = path.join(repoRoot, "server.js");

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function extractObjectKeys(source, constName) {
  const re = new RegExp(`const\\s+${constName}\\s*=\\s*\\{([\\s\\S]*?)\\};`);
  const match = source.match(re);
  if (!match) {
    return new Set();
  }

  const body = match[1];
  const keys = new Set();

  for (const m of body.matchAll(/"([^"]+)"\s*:/g)) {
    keys.add(String(m[1]).trim());
  }

  for (const m of body.matchAll(/\n\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/g)) {
    keys.add(String(m[1]).trim());
  }

  return keys;
}

function extractArrayBlock(source, constName) {
  const re = new RegExp(`const\\s+${constName}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
  const match = source.match(re);
  return match ? match[1] : "";
}

function extractValues(block, fieldName) {
  const values = new Set();
  const re = new RegExp(`${fieldName}\\s*:\\s*"([^"]+)"`, "g");
  for (const m of block.matchAll(re)) {
    values.add(String(m[1]).trim());
  }
  return values;
}

function diffMissing(requiredSet, providedSet) {
  return [...requiredSet].filter((v) => !providedSet.has(v)).sort();
}

function main() {
  const appJs = read(appJsPath);
  const serverJs = read(serverJsPath);

  const botImageByIdKeys = extractObjectKeys(appJs, "BOT_IMAGE_BY_ID");
  const catalogImageByKindKeys = extractObjectKeys(appJs, "CATALOG_IMAGE_BY_KIND");
  const businessImageByCategoryKeys = extractObjectKeys(appJs, "BUSINESS_IMAGE_BY_CATEGORY");

  const botCatalogBlock = extractArrayBlock(serverJs, "botCatalog");
  const logoCatalogBlock = extractArrayBlock(serverJs, "logoServicesCatalog");
  const discordCatalogBlock = extractArrayBlock(serverJs, "discordServicesCatalog");
  const subPlansBlock = extractArrayBlock(serverJs, "subscriptionPlans");
  const serviceCatalogBlock = extractArrayBlock(serverJs, "serviceCatalog");
  const businessServicesBlock = extractArrayBlock(serverJs, "businessServices");

  const requiredImageIds = new Set([
    ...extractValues(botCatalogBlock, "id"),
    ...extractValues(logoCatalogBlock, "id"),
    ...extractValues(discordCatalogBlock, "id"),
    ...extractValues(subPlansBlock, "id")
  ]);

  const requiredKinds = extractValues(serviceCatalogBlock, "kind");
  const requiredCategories = extractValues(businessServicesBlock, "category");

  const missingIds = diffMissing(requiredImageIds, botImageByIdKeys);
  const missingKinds = diffMissing(requiredKinds, catalogImageByKindKeys);
  const missingCategories = diffMissing(requiredCategories, businessImageByCategoryKeys);

  const failures = [];
  if (missingIds.length > 0) {
    failures.push(`Missing BOT_IMAGE_BY_ID mappings: ${missingIds.join(", ")}`);
  }
  if (missingKinds.length > 0) {
    failures.push(`Missing CATALOG_IMAGE_BY_KIND mappings: ${missingKinds.join(", ")}`);
  }
  if (missingCategories.length > 0) {
    failures.push(`Missing BUSINESS_IMAGE_BY_CATEGORY mappings: ${missingCategories.join(", ")}`);
  }

  if (failures.length > 0) {
    console.error("Image coverage verification failed:");
    for (const f of failures) {
      console.error(`- ${f}`);
    }
    process.exit(1);
  }

  console.log(
    `Image coverage verification passed. Checked ${requiredImageIds.size} ID(s), ${requiredKinds.size} kind(s), ${requiredCategories.size} category(s).`
  );
}

main();
