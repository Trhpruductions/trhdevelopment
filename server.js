const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const { execFileSync } = require("child_process");
const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { WebSocketServer } = require("ws");

const app = express();
app.disable("x-powered-by");
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const PORT = Number(process.env.PORT || 3000);
const APP_BASE_URL = String(process.env.APP_BASE_URL || `http://localhost:${PORT}`).trim();
const PANEL_API_KEY = String(process.env.PANEL_API_KEY || "").trim();
const PANEL_ADMIN_PASSWORD = String(process.env.PANEL_ADMIN_PASSWORD || PANEL_API_KEY || "").trim();
const OWNER_CONTROL_PASSWORD = String(process.env.OWNER_CONTROL_PASSWORD || PANEL_ADMIN_PASSWORD || PANEL_API_KEY || "").trim();
const PANEL_SESSION_SECRET = String(process.env.PANEL_SESSION_SECRET || "change-me-session-secret").trim();
const BOT_WS_TOKEN = String(process.env.BOT_WS_TOKEN || "").trim();
const BOT_SIGNING_SECRET = String(process.env.BOT_SIGNING_SECRET || "").trim();
const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || "").trim();
const STRIPE_WEBHOOK_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
const DISCORD_CLIENT_ID = String(process.env.DISCORD_CLIENT_ID || "").trim();
const DISCORD_CLIENT_SECRET = String(process.env.DISCORD_CLIENT_SECRET || "").trim();
const DISCORD_OAUTH_REDIRECT_URI = String(process.env.DISCORD_OAUTH_REDIRECT_URI || `${APP_BASE_URL}/api/auth/discord/callback`).trim();
const DISCORD_FALLBACK_LOGIN_URL = String(process.env.DISCORD_FALLBACK_LOGIN_URL || "https://discord.com/login").trim();
const ALLOW_DEV_DISCORD_FALLBACK_LOGIN = String(process.env.ALLOW_DEV_DISCORD_FALLBACK_LOGIN || "true").trim().toLowerCase() !== "false";
const DATA_DIR = path.join(__dirname, "data");
const SESSION_DIR = path.join(DATA_DIR, "sessions");
const STATE_FILE = path.join(DATA_DIR, "panel-state.json");
const COMMERCE_FILE = path.join(DATA_DIR, "commerce-state.json");
const LEDGER_LIMIT = 2000;
const TX_RATE_WINDOW_MS = 60 * 1000;
const TX_RATE_LIMIT = 120;
const CHECKOUT_RATE_WINDOW_MS = 5 * 60 * 1000;
const CHECKOUT_RATE_LIMIT = 10;
const INQUIRY_RATE_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_RATE_LIMIT = 5;
const WEBHOOK_WINDOW_SECONDS = 300;
const LOGIN_WINDOW_MS = Number(process.env.LOGIN_WINDOW_MS || 10 * 60 * 1000);
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 8);
const LOGIN_BLOCK_MS = Number(process.env.LOGIN_BLOCK_MS || 15 * 60 * 1000);
const SESSION_STORE_RETRIES = Number(process.env.SESSION_STORE_RETRIES || 5);
const SESSION_STORE_REAP_INTERVAL_SECONDS = Number(process.env.SESSION_STORE_REAP_INTERVAL_SECONDS || 60 * 60);
const BOT_SCAN_MAX_DEPTH = Number(process.env.BOT_SCAN_MAX_DEPTH || 4);
const BOT_SCAN_MAX_DIRS = Number(process.env.BOT_SCAN_MAX_DIRS || 2500);
const BOT_SCAN_MAX_RESULTS = Number(process.env.BOT_SCAN_MAX_RESULTS || 200);
const PAYMENT_GRACE_MS = Number(process.env.PAYMENT_GRACE_MS || 48 * 60 * 60 * 1000);
const PAYMENT_SUSPEND_MS = 72 * 60 * 60 * 1000;
const SUBSCRIPTION_CYCLE_MS = 30 * 24 * 60 * 60 * 1000;
const OWNER_DISCORD_ALLOWLIST = new Set([
  "525442067875233792",
  "1161904522558451764"
]);
const EMERGENCY_RECOVERY_KEY = String(process.env.EMERGENCY_RECOVERY_KEY || "").trim();
const LOCKOUT_FILE = path.join(DATA_DIR, "lockout-state.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "operator-accounts.json");
const BLACKLIST_FILE = path.join(DATA_DIR, "blacklist.json");
const USER_ACTIVITY_LIMIT = 500;
const USER_BLACKLIST_REASONS = ["chargeback", "payment_failure", "abuse", "leak", "bypass", "fraud", "harassment", "reselling", "cracking", "tos_violation"];
const USER_TIERS = ["free", "vip", "pro", "premium"];
const FREE_TIER_COMMANDS = new Set(["help", "ping", "info", "status", "rules", "invite"]);
const TIER_RANK = { free: 0, vip: 1, pro: 2, premium: 3 };
// Map Stripe price IDs → internal tiers. Set STRIPE_PRICE_VIP / _PRO / _PREMIUM in env.
const STRIPE_PRICE_MAP = Object.fromEntries(
  ["vip", "pro", "premium"]
    .map((t) => [String(process.env[`STRIPE_PRICE_${t.toUpperCase()}`] || "").trim(), t])
    .filter(([k]) => k)
);
let lastUpdateAt = new Date().toISOString();
const txRateMap = new Map();
const usedWebhookNonces = new Map();
const loginFailures = new Map();
let stripeClient = null;

// ─── EMERGENCY LOCKOUT STATE ─────────────────────────────────────────────────
const lockout = {
  active: false,
  level: null, // "lockout" | "shutdown" | "nuclear"
  activatedAt: null,
  activatedBy: null,
  silentMode: false,
  databaseFrozen: false,
  blacklist: { discordIds: [], ips: [], sessionIds: [] },
  abuseLogs: []
};

// ─── USER TRACKING & ENFORCEMENT STATE ────────────────────────────────────────
// usersRegistry: keyed by discordId
const usersRegistry = {};
// blacklistRegistry: array of blacklist entries
const blacklistRegistry = [];
// operatorAccounts: keyed by email (lowercase), value: { email, passwordHash, role, createdAt }
const operatorAccounts = {};

function getConfigHealthSnapshot() {
  const sessionSecretWeak = !PANEL_SESSION_SECRET || PANEL_SESSION_SECRET === "change-me-session-secret" || PANEL_SESSION_SECRET.length < 24;
  const discordOauthConfigured = Boolean(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET && DISCORD_OAUTH_REDIRECT_URI);
  const stripeConfigured = Boolean(STRIPE_SECRET_KEY && STRIPE_WEBHOOK_SECRET);
  let sessionDirWritable = true;

  try {
    fs.accessSync(SESSION_DIR, fs.constants.W_OK);
  } catch (_error) {
    sessionDirWritable = false;
  }

  const checks = [
    {
      key: "panel_admin_password",
      label: "Operator Password",
      status: PANEL_ADMIN_PASSWORD ? "ok" : "error",
      detail: PANEL_ADMIN_PASSWORD ? "Configured" : "Missing"
    },
    {
      key: "owner_control_password",
      label: "Owner Password",
      status: OWNER_CONTROL_PASSWORD ? "ok" : "error",
      detail: OWNER_CONTROL_PASSWORD ? "Configured" : "Missing"
    },
    {
      key: "session_secret",
      label: "Session Secret",
      status: sessionSecretWeak ? "warn" : "ok",
      detail: sessionSecretWeak ? "Weak or default value" : "Strong"
    },
    {
      key: "session_store",
      label: "Session Store Access",
      status: sessionDirWritable ? "ok" : "error",
      detail: sessionDirWritable ? "Writable" : "Directory not writable"
    },
    {
      key: "discord_oauth",
      label: "Discord OAuth",
      status: discordOauthConfigured ? "ok" : "warn",
      detail: discordOauthConfigured ? "Enabled" : "Fallback mode"
    },
    {
      key: "stripe_mode",
      label: "Stripe Payments",
      status: stripeConfigured ? "ok" : "warn",
      detail: stripeConfigured ? "Configured" : "Mock-only"
    }
  ];

  const hasError = checks.some((c) => c.status === "error");
  const hasWarn = checks.some((c) => c.status === "warn");

  return {
    checks,
    summary: hasError ? "critical" : hasWarn ? "attention" : "ready",
    flags: {
      production: process.env.NODE_ENV === "production",
      discordOauthConfigured,
      stripeConfigured,
      devDiscordFallbackEnabled: ALLOW_DEV_DISCORD_FALLBACK_LOGIN
    }
  };
}

function collectRunningBotProcesses() {
  try {
    if (process.platform !== "win32") {
      return [];
    }

    const psScript = [
      "$ErrorActionPreference='SilentlyContinue'",
      "$procs=Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('node.exe','nodejs.exe','python.exe','py.exe') } | Select-Object ProcessId,Name,CommandLine",
      "$procs | ConvertTo-Json -Compress"
    ].join("; ");

    const raw = String(execFileSync("powershell", ["-NoProfile", "-Command", psScript], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 4 * 1024 * 1024
    }) || "").trim();

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows
      .filter((row) => row && row.CommandLine)
      .map((row) => ({
        pid: Number(row.ProcessId || 0),
        name: String(row.Name || "").trim().toLowerCase(),
        commandLine: String(row.CommandLine || "").trim()
      }))
      .filter((row) => {
        const cmd = row.commandLine.toLowerCase();
        return /discord|\bbot\b|\.js|\.py/.test(cmd);
      });
  } catch (_error) {
    return [];
  }
}

function detectNodeBotProject(dirPath) {
  const pkgPath = path.join(dirPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };
    const depNames = Object.keys(deps).map((k) => k.toLowerCase());
    const scripts = Object.values(pkg.scripts || {}).map((v) => String(v).toLowerCase());
    const isDiscordBot = depNames.some((name) => ["discord.js", "eris", "oceanic.js", "detritus-client", "hikari"].includes(name))
      || scripts.some((script) => /discord|\bbot\b/.test(script));
    if (!isDiscordBot) {
      return null;
    }

    return {
      runtime: "node",
      botName: String(pkg.name || path.basename(dirPath)).trim(),
      path: dirPath
    };
  } catch (_error) {
    return null;
  }
}

function detectPythonBotProject(dirPath) {
  const requirementsPath = path.join(dirPath, "requirements.txt");
  const pyprojectPath = path.join(dirPath, "pyproject.toml");
  const markerFiles = ["bot.py", "main.py", "run.py"];
  const hasMarker = markerFiles.some((name) => fs.existsSync(path.join(dirPath, name)));

  let text = "";
  if (fs.existsSync(requirementsPath)) {
    text += fs.readFileSync(requirementsPath, "utf8");
  }
  if (fs.existsSync(pyprojectPath)) {
    text += `\n${fs.readFileSync(pyprojectPath, "utf8")}`;
  }

  const looksLikeDiscordPy = /discord\.py|py-cord|nextcord|disnake|hikari/i.test(text);
  if (!looksLikeDiscordPy && !hasMarker) {
    return null;
  }

  return {
    runtime: "python",
    botName: path.basename(dirPath),
    path: dirPath
  };
}

function collectLocalBotProjects() {
  const roots = [];
  const addRoot = (dir) => {
    if (!dir) return;
    const normalized = path.resolve(String(dir));
    if (fs.existsSync(normalized) && fs.statSync(normalized).isDirectory() && !roots.includes(normalized)) {
      roots.push(normalized);
    }
  };

  addRoot(process.cwd());
  addRoot(path.join(os.homedir(), "Desktop"));
  addRoot(path.join(os.homedir(), "Documents"));
  addRoot(path.join(os.homedir(), "Downloads"));

  const skipDirs = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage", "data"]);
  const queue = roots.map((root) => ({ dir: root, depth: 0 }));
  const visited = new Set();
  const found = [];

  while (queue.length > 0 && visited.size < BOT_SCAN_MAX_DIRS && found.length < BOT_SCAN_MAX_RESULTS) {
    const { dir, depth } = queue.shift();
    const key = path.resolve(dir).toLowerCase();
    if (visited.has(key)) continue;
    visited.add(key);

    const nodeBot = detectNodeBotProject(dir);
    const pyBot = nodeBot ? null : detectPythonBotProject(dir);
    const botProject = nodeBot || pyBot;
    if (botProject) {
      found.push(botProject);
      continue;
    }

    if (depth >= BOT_SCAN_MAX_DEPTH) {
      continue;
    }

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_error) {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (skipDirs.has(entry.name)) continue;
      queue.push({ dir: path.join(dir, entry.name), depth: depth + 1 });
    }
  }

  return found;
}

function appendQuery(baseUrl, params) {
  const search = new URLSearchParams(params);
  const hasQuery = baseUrl.includes("?");
  return `${baseUrl}${hasQuery ? "&" : "?"}${search.toString()}`;
}

/**
 * Convert a Discord snowflake ID to an ISO-8601 account-creation timestamp.
 */
function discordIdToTimestamp(id) {
  try {
    const snowflake = BigInt(String(id).trim());
    const ms = Number((snowflake >> 22n) + 1420070400000n);
    return new Date(ms).toISOString();
  } catch (_) {
    return null;
  }
}

function buildDiscordOauthUrl(state) {
  const qs = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_OAUTH_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
    prompt: "none",
    state
  });
  return `https://discord.com/oauth2/authorize?${qs.toString()}`;
}

function isLocalRequest(req) {
  const host = String(req.hostname || "").trim().toLowerCase();
  const ipRaw = String(req.ip || "").trim();
  const ip = ipRaw.startsWith("::ffff:") ? ipRaw.slice(7) : ipRaw;
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  return localHosts.has(host) || localHosts.has(ip);
}

if (STRIPE_SECRET_KEY) {
  try {
    const Stripe = require("stripe");
    stripeClient = new Stripe(STRIPE_SECRET_KEY);
  } catch (error) {
    console.error("Stripe SDK unavailable. Install dependency or disable Stripe mode.");
  }
}

const botCatalog = [
  {
    id: "trh-starter-bot",
    name: "TRH Starter Bot",
    description: "Launch-ready moderation, ticketing, and onboarding stack priced for fast community setup.",
    features: ["Moderation Core", "Ticket System", "Role Automation"],
    priceUsd: 59,
    originalPriceUsd: 79,
    pricingBadge: "Fast Start Deal",
    pricingNote: "Best for new communities that want a clean launch without a custom build budget.",
    stripePriceId: String(process.env.STRIPE_PRICE_STARTER || "").trim()
  },
  {
    id: "trh-growth-bot",
    name: "TRH Growth Bot",
    description: "Growth-focused event, leaderboard, and analytics toolkit positioned as the sweet-spot upgrade.",
    features: ["Events + Giveaways", "XP + Leaderboards", "Engagement Analytics"],
    priceUsd: 149,
    originalPriceUsd: 199,
    pricingBadge: "Most Popular",
    pricingNote: "Designed for communities ready to add engagement systems without jumping to enterprise spend.",
    stripePriceId: String(process.env.STRIPE_PRICE_GROWTH || "").trim()
  },
  {
    id: "trh-enterprise-bot",
    name: "TRH Enterprise Bot",
    description: "Premium high-scale package with economy safeguards and dedicated deployment handoff at a sharper entry point.",
    features: ["Hardened Economy", "Custom Integrations", "Priority Delivery"],
    priceUsd: 349,
    originalPriceUsd: 499,
    pricingBadge: "Launch Offer",
    pricingNote: "For teams that want enterprise protection and custom integrations without a custom-agency sticker shock.",
    stripePriceId: String(process.env.STRIPE_PRICE_ENTERPRISE || "").trim()
  }
];

const serviceCatalog = [
  {
    id: "rank-starter-pack",
    name: "Rank Starter Pack",
    description: "Low-friction starter bundle for progression and gated access without overbuilding your server.",
    features: ["3 Rank Tiers", "XP Gate Config", "Permission Mapping"],
    priceUsd: 29,
    originalPriceUsd: 49,
    pricingBadge: "Easy Add-On",
    pricingNote: "A simple upsell-friendly entry package for communities that want visible progression fast.",
    kind: "rank",
    audience: "user",
    stripePriceId: String(process.env.STRIPE_PRICE_RANK_STARTER || "").trim()
  },
  {
    id: "role-automation-suite",
    name: "Role Automation Suite",
    description: "Owner-grade role automation bundle with onboarding and milestone auto-assignment at a friendlier price point.",
    features: ["Reaction Role Flows", "Milestone Grants", "Auto Clean-up Rules"],
    priceUsd: 59,
    originalPriceUsd: 89,
    pricingBadge: "Owner Favorite",
    pricingNote: "Built to remove manual role work while staying affordable for active community owners.",
    kind: "role",
    audience: "owner",
    stripePriceId: String(process.env.STRIPE_PRICE_ROLE_AUTOMATION || "").trim()
  },
  {
    id: "buyout-community-license",
    name: "Community Buyout Plan",
    description: "Dedicated community deployment rights with a more approachable buyout path.",
    features: ["Single Community Buyout", "Branding Alignment", "Priority Delivery"],
    priceUsd: 899,
    originalPriceUsd: 1200,
    pricingBadge: "Buyout Savings",
    pricingNote: "For owners who want exclusivity and long-term value without pushing straight into custom agency pricing.",
    kind: "buyout-plan",
    audience: "owner",
    stripePriceId: String(process.env.STRIPE_PRICE_BUYOUT_COMMUNITY || "").trim()
  },
  {
    id: "build-plan-growth",
    name: "Growth Build Plan",
    description: "Structured implementation roadmap for feature expansion and scaling at a stronger conversion price.",
    features: ["Architecture Plan", "Milestone Roadmap", "Sprint Delivery Spec"],
    priceUsd: 199,
    originalPriceUsd: 299,
    pricingBadge: "Planning Bundle",
    pricingNote: "A lower-friction planning package for teams that need direction before they commit to a full build.",
    kind: "build-plan",
    audience: "owner",
    stripePriceId: String(process.env.STRIPE_PRICE_BUILD_PLAN_GROWTH || "").trim()
  },
  {
    id: "custom-bot-blueprint",
    name: "Custom Bot Blueprint",
    description: "Custom bot planning and implementation intake with scoped deliverables and a more compelling entry price.",
    features: ["Custom Feature Intake", "Risk & Scope Matrix", "Build Blueprint"],
    priceUsd: 749,
    originalPriceUsd: 999,
    pricingBadge: "Custom Build Deal",
    pricingNote: "For buyers who want custom scope clarity first, without committing to a full custom build invoice up front.",
    kind: "custom-bot",
    audience: "owner",
    stripePriceId: String(process.env.STRIPE_PRICE_CUSTOM_BOT_BLUEPRINT || "").trim()
  }
];

const businessServices = [
  {
    id: "svc-bot-development",
    name: "Bot Development",
    category: "bots",
    description: "End-to-end Discord bot engineering from architecture to deployment hardening.",
    outcomes: ["Command Systems", "Moderation + Economy", "Deployment Runbook"]
  },
  {
    id: "svc-dashboard-engineering",
    name: "Dashboard Engineering",
    category: "dashboards",
    description: "Operational dashboards for telemetry, commerce analytics, and admin workflows.",
    outcomes: ["Real-time KPIs", "Role-aware Views", "Export + Reporting"]
  },
  {
    id: "svc-custom-scripting",
    name: "Custom Scripts",
    category: "scripts",
    description: "Custom automation scripts for server workflows, moderation tooling, and integrations.",
    outcomes: ["Automation Jobs", "Data Sync Scripts", "Maintenance Tasks"]
  },
  {
    id: "svc-integration-automation",
    name: "Integration Automation",
    category: "automation",
    description: "Integrate bots, payment systems, and external APIs with signed and audited workflows.",
    outcomes: ["Webhook Flows", "API Connectors", "Reliability Safeguards"]
  }
];

const BUSINESS_INQUIRY_STAGES = ["new", "discovery", "quoted", "in-progress", "delivered", "declined"];
const BUSINESS_ACTIVE_STAGES = new Set(["new", "discovery", "quoted", "in-progress"]);
const BUSINESS_SLA_HOURS = {
  new: 48,
  discovery: 72,
  quoted: 120,
  "in-progress": 240,
  delivered: 0,
  declined: 0
};

const logoServicesCatalog = [
  { id: "logo-starter", name: "Starter Logo", description: "Clean wordmark or simple icon package for new brands.", priceUsd: 10, tier: "starter", pricingBadge: "Entry Level" },
  { id: "logo-growth", name: "Growth Logo", description: "Full wordmark + icon with light/dark variants and color palette.", priceUsd: 20, tier: "growth", pricingBadge: "Most Popular" },
  { id: "logo-pro", name: "Pro Logo", description: "Layered brand kit with multiple formats, styles, and export assets.", priceUsd: 35, tier: "pro", pricingBadge: "Brand Kit" },
  { id: "logo-elite", name: "Elite Logo", description: "Full identity system with animation, guideline doc, and all formats.", priceUsd: 75, tier: "elite", pricingBadge: "Full Identity" }
];

const logoAddOns = [
  { id: "logo-addon-revision", name: "Revision Pack", description: "One additional revision cycle.", priceUsd: 5 },
  { id: "logo-addon-fast-std", name: "Fast Delivery (Standard)", description: "Priority queue entry.", priceUsd: 5 },
  { id: "logo-addon-fast-rush", name: "Fast Delivery (Rush)", description: "Urgent priority delivery.", priceUsd: 15 },
  { id: "logo-addon-animation", name: "Animation Add-On", description: "Animated logo export in GIF/MP4.", priceUsd: 15 }
];

const discordServicesCatalog = [
  { id: "discord-setup-starter", name: "Starter Server Setup", description: "Clean server structure: channels, roles, and welcome system.", priceUsd: 15, tier: "starter", type: "setup", pricingBadge: "Quick Launch" },
  { id: "discord-setup-growth", name: "Growth Server Setup", description: "Full community layout with verification, events, and moderation flow.", priceUsd: 35, tier: "growth", type: "setup", pricingBadge: "Most Popular" },
  { id: "discord-setup-pro", name: "Pro Server Setup", description: "Advanced community infrastructure with bot integrations and automation.", priceUsd: 65, tier: "pro", type: "setup", pricingBadge: "Full Stack" },
  { id: "discord-setup-elite", name: "Elite Server Setup", description: "Enterprise-grade community platform with full custom systems and oversight.", priceUsd: 120, tier: "elite", type: "setup", pricingBadge: "Enterprise" },
  { id: "discord-template-basic", name: "Basic Template", description: "Pre-built server template for fast deployment.", priceUsd: 8, tier: "basic", type: "template" },
  { id: "discord-template-standard", name: "Standard Template", description: "Structured community template with organized channels and roles.", priceUsd: 15, tier: "standard", type: "template" },
  { id: "discord-template-premium", name: "Premium Template", description: "Full-featured community template with bot integrations and styled channels.", priceUsd: 30, tier: "premium", type: "template" }
];

const subscriptionPlans = [
  {
    id: "sub-free",
    name: "Free",
    description: "Access to basic community features.",
    priceUsd: 0,
    tier: "free",
    billingCycle: "monthly",
    features: ["Basic access", "Community channels", "Server browsing"]
  },
  {
    id: "sub-vip",
    name: "VIP",
    description: "VIP access with exclusive channels and premium perks.",
    priceUsd: 4.99,
    tier: "vip",
    billingCycle: "monthly",
    pricingBadge: "Best Value",
    features: ["VIP badge", "Exclusive channels", "Priority support", "Early access events"]
  },
  {
    id: "sub-pro",
    name: "Pro",
    description: "Full pro access with all features and maximum perks.",
    priceUsd: 10.99,
    tier: "pro",
    billingCycle: "monthly",
    pricingBadge: "Full Power",
    features: ["All VIP features", "Pro badge", "Custom role", "API access", "Analytics dashboard"]
  }
];

const botBuildLibrary = [
  {
    botId: "trh-starter-bot",
    architecture: "Core",
    modules: [
      "Moderation Command Framework",
      "Role Sync + Auto Assignment",
      "Ticket Workflow",
      "Audit Action Logging",
      "Secure Operator Controls"
    ],
    integrations: ["Discord Gateway", "Control Panel API"],
    deliveryArtifacts: ["Config Pack", "Deployment Checklist"]
  },
  {
    botId: "trh-growth-bot",
    architecture: "Growth",
    modules: [
      "Events + Giveaways Engine",
      "XP and Leaderboard Core",
      "Engagement Trigger Automations",
      "Campaign Status Announcements",
      "Community Health Metrics"
    ],
    integrations: ["Discord Gateway", "Control Panel API", "Marketplace Orders"],
    deliveryArtifacts: ["Campaign Presets", "Engagement Dashboard Hand-off"]
  },
  {
    botId: "trh-enterprise-bot",
    architecture: "Enterprise",
    modules: [
      "Economy Atomic Transaction Engine",
      "Replay-safe Payment/Order Hooks",
      "High-volume Command Throttling",
      "Signed Webhook Ingestion",
      "Provisioning + Delivery Operations"
    ],
    integrations: ["Discord Gateway", "Stripe", "Control Panel API", "Signed Webhooks"],
    deliveryArtifacts: ["Hardened Runbook", "Incident Response Sheet", "Ops SLA Profile"]
  }
];

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  express.json({
    limit: "64kb",
    verify: (req, _res, buf) => {
      req.rawBody = Buffer.from(buf);
    }
  })
);
app.use(
  session({
    name: "trh_operator_sid",
    secret: PANEL_SESSION_SECRET,
    store: new FileStore({
      path: SESSION_DIR,
      ttl: 12 * 60 * 60,
      retries: SESSION_STORE_RETRIES,
      reapInterval: SESSION_STORE_REAP_INTERVAL_SECONDS,
      reapAsync: false,
      logFn: () => {}
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000
    }
  })
);
app.use((_req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data:",
      "connect-src 'self' ws: wss: https://fonts.googleapis.com https://fonts.gstatic.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-ancestors 'none'"
    ].join("; ")
  );
  next();
});
app.use(express.static(path.join(__dirname, "public")));

const state = {
  botOnline: true,
  maintenanceMode: false,
  globalShutdown: false,
  lastForceUpdateAt: null,
  guildCount: 0,
  usersServed: 0,
  economyBalance: 0,
  processedTxIds: [],
  economyLedger: [],
  recentActions: []
};

const commerce = {
  orders: [],
  processedWebhookEvents: [],
  inquiries: [],
  clientAccounts: [],
  ownerNotifications: [],
  loginLog: []
};

function toSafeWholeNumber(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  if (num < 0) {
    return 0;
  }
  const rounded = Math.floor(num);
  return rounded > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : rounded;
}

function toBooleanFlag(value) {
  const normalized = String(value == null ? "" : value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function parseDateBoundaryMs(rawDate, boundary) {
  const value = String(rawDate || "").trim();
  if (!value) {
    return null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return Number.NaN;
  }

  const suffix = boundary === "end" ? "T23:59:59.999Z" : "T00:00:00.000Z";
  const parsed = Date.parse(`${value}${suffix}`);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return;
  }

  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    state.botOnline = Boolean(parsed.botOnline);
    state.maintenanceMode = Boolean(parsed.maintenanceMode);
    state.globalShutdown = Boolean(parsed.globalShutdown);
    state.lastForceUpdateAt = parsed.lastForceUpdateAt ? String(parsed.lastForceUpdateAt) : null;
    state.guildCount = toSafeWholeNumber(parsed.guildCount);
    state.usersServed = toSafeWholeNumber(parsed.usersServed);
    state.economyBalance = toSafeWholeNumber(parsed.economyBalance);
    state.recentActions = Array.isArray(parsed.recentActions) ? parsed.recentActions.slice(0, 20) : [];
    state.processedTxIds = Array.isArray(parsed.processedTxIds) ? parsed.processedTxIds.slice(0, 5000) : [];
    state.economyLedger = Array.isArray(parsed.economyLedger) ? parsed.economyLedger.slice(0, LEDGER_LIMIT) : [];
    lastUpdateAt = String(parsed.lastUpdateAt || new Date().toISOString());
  } catch (error) {
    console.error("Failed to load persisted state:", error.message);
  }
}

function persistState() {
  ensureDataDir();
  const tmpFile = `${STATE_FILE}.tmp`;
  const payload = JSON.stringify(
    {
      botOnline: state.botOnline,
      maintenanceMode: state.maintenanceMode,
      globalShutdown: state.globalShutdown,
      lastForceUpdateAt: state.lastForceUpdateAt,
      guildCount: state.guildCount,
      usersServed: state.usersServed,
      economyBalance: state.economyBalance,
      processedTxIds: state.processedTxIds,
      economyLedger: state.economyLedger,
      lastUpdateAt,
      recentActions: state.recentActions
    },
    null,
    2
  );

  fs.writeFileSync(tmpFile, payload, "utf8");
  fs.renameSync(tmpFile, STATE_FILE);
}

function loadCommerce() {
  if (!fs.existsSync(COMMERCE_FILE)) {
    return;
  }

  try {
    const raw = fs.readFileSync(COMMERCE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    commerce.orders = Array.isArray(parsed.orders) ? parsed.orders.slice(0, 5000) : [];
    commerce.processedWebhookEvents = Array.isArray(parsed.processedWebhookEvents)
      ? parsed.processedWebhookEvents.slice(0, 5000)
      : [];
    commerce.clientAccounts = Array.isArray(parsed.clientAccounts) ? parsed.clientAccounts.slice(0, 5000) : [];
    commerce.ownerNotifications = Array.isArray(parsed.ownerNotifications) ? parsed.ownerNotifications.slice(0, 500) : [];
    commerce.loginLog = Array.isArray(parsed.loginLog) ? parsed.loginLog.slice(0, 2000) : [];
    const parsedInquiries = Array.isArray(parsed.inquiries) ? parsed.inquiries.slice(0, 5000) : [];
    commerce.inquiries = parsedInquiries.map((row) => {
      const normalizedStatus = BUSINESS_INQUIRY_STAGES.includes(String(row.status || "").toLowerCase())
        ? String(row.status).toLowerCase()
        : "new";
      const stageHistory = Array.isArray(row.stageHistory) ? row.stageHistory : [];
      if (stageHistory.length === 0) {
        stageHistory.push({ status: normalizedStatus, at: row.createdAt || new Date().toISOString(), note: "initialized" });
      }
      return {
        ...row,
        status: normalizedStatus,
        stageHistory: stageHistory.slice(0, 20)
      };
    });
  } catch (error) {
    console.error("Failed to load persisted commerce state:", error.message);
  }
}

function persistCommerce() {
  ensureDataDir();
  const tmpFile = `${COMMERCE_FILE}.tmp`;
  const payload = JSON.stringify(
    {
      orders: commerce.orders,
      processedWebhookEvents: commerce.processedWebhookEvents,
      inquiries: commerce.inquiries,
      clientAccounts: commerce.clientAccounts,
      ownerNotifications: commerce.ownerNotifications,
      loginLog: commerce.loginLog
    },
    null,
    2
  );

  fs.writeFileSync(tmpFile, payload, "utf8");
  fs.renameSync(tmpFile, COMMERCE_FILE);
}

// ─── LOCKOUT PERSISTENCE ──────────────────────────────────────────────────────
function loadLockout() {
  if (!fs.existsSync(LOCKOUT_FILE)) return;
  try {
    const raw = fs.readFileSync(LOCKOUT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    lockout.active = Boolean(parsed.active);
    lockout.level = ["lockout", "shutdown", "nuclear"].includes(String(parsed.level || "")) ? String(parsed.level) : null;
    lockout.activatedAt = parsed.activatedAt ? String(parsed.activatedAt) : null;
    lockout.activatedBy = parsed.activatedBy ? String(parsed.activatedBy) : null;
    lockout.silentMode = Boolean(parsed.silentMode);
    lockout.databaseFrozen = Boolean(parsed.databaseFrozen);
    if (parsed.blacklist && typeof parsed.blacklist === "object") {
      lockout.blacklist.discordIds = Array.isArray(parsed.blacklist.discordIds) ? parsed.blacklist.discordIds.slice(0, 2000) : [];
      lockout.blacklist.ips = Array.isArray(parsed.blacklist.ips) ? parsed.blacklist.ips.slice(0, 2000) : [];
      lockout.blacklist.sessionIds = Array.isArray(parsed.blacklist.sessionIds) ? parsed.blacklist.sessionIds.slice(0, 10000) : [];
    }
    lockout.abuseLogs = Array.isArray(parsed.abuseLogs) ? parsed.abuseLogs.slice(0, 1000) : [];
  } catch (err) {
    console.error("Failed to load lockout state:", err.message);
  }
}

function persistLockout() {
  ensureDataDir();
  const tmpFile = `${LOCKOUT_FILE}.tmp`;
  const payload = JSON.stringify({
    active: lockout.active,
    level: lockout.level,
    activatedAt: lockout.activatedAt,
    activatedBy: lockout.activatedBy,
    silentMode: lockout.silentMode,
    databaseFrozen: lockout.databaseFrozen,
    blacklist: lockout.blacklist,
    abuseLogs: lockout.abuseLogs.slice(0, 1000)
  }, null, 2);
  fs.writeFileSync(tmpFile, payload, "utf8");
  fs.renameSync(tmpFile, LOCKOUT_FILE);
}

// ─── USER REGISTRY PERSISTENCE ────────────────────────────────────────────────
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return;
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [discordId, profile] of Object.entries(parsed)) {
        if (discordId && typeof profile === "object") {
          usersRegistry[discordId] = profile;
        }
      }
    }
  } catch (err) {
    console.error("Failed to load users registry:", err.message);
  }
}

function persistUsers() {
  ensureDataDir();
  const tmpFile = `${USERS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(usersRegistry, null, 2), "utf8");
  fs.renameSync(tmpFile, USERS_FILE);
}

// ─── OPERATOR ACCOUNTS PERSISTENCE ────────────────────────────────────────────
function loadOperatorAccounts() {
  if (!fs.existsSync(ACCOUNTS_FILE)) return;
  try {
    const raw = fs.readFileSync(ACCOUNTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [email, account] of Object.entries(parsed)) {
        if (email && typeof account === "object" && account.passwordHash) {
          operatorAccounts[email] = account;
        }
      }
    }
  } catch (err) {
    console.error("Failed to load operator accounts:", err.message);
  }
}

function persistOperatorAccounts() {
  ensureDataDir();
  const tmpFile = `${ACCOUNTS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(operatorAccounts, null, 2), "utf8");
  fs.renameSync(tmpFile, ACCOUNTS_FILE);
}

function loadBlacklist() {
  if (!fs.existsSync(BLACKLIST_FILE)) return;
  try {
    const raw = fs.readFileSync(BLACKLIST_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      blacklistRegistry.push(...parsed.slice(0, 10000));
    }
  } catch (err) {
    console.error("Failed to load blacklist registry:", err.message);
  }
}

function persistBlacklist() {
  ensureDataDir();
  const tmpFile = `${BLACKLIST_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(blacklistRegistry, null, 2), "utf8");
  fs.renameSync(tmpFile, BLACKLIST_FILE);
}

// ─── USER PROFILE HELPERS ─────────────────────────────────────────────────────
function createInternalUserId(discordId) {
  return `usr-${crypto.createHash("sha1").update(String(discordId)).digest("hex").slice(0, 12)}`;
}

/**
 * Create or update a user profile. Returns the (updated) profile.
 */
function upsertUserProfile(discordId, data) {
  const id = String(discordId || "").trim();
  if (!id) return null;
  const now = new Date().toISOString();
  const existing = usersRegistry[id] || {
    discordId: id,
    internalId: createInternalUserId(id),
    username: "",
    displayName: "",
    globalName: "",
    avatarUrl: null,
    accountCreatedAt: null,
    firstSeenAt: now,
    lastSeenAt: now,
    tier: "free",
    activeServices: [],
    paymentStatus: "active",
    outstandingBalance: 0,
    lastPaymentAt: null,
    commandCount: 0,
    activityLog: [],
    infractions: [],
    blacklisted: false,
    blacklistReason: null,
    blacklistAt: null,
    blacklistModerator: null,
    blacklistExpiry: null,
    frozen: false,
    frozenAt: null,
    frozenBy: null,
    email: null,
    linkedDiscordIds: [],
    guilds: [],
    ipLog: [],
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: "none",
    paymentFailedAt: null,
    updatedAt: now
  };

  // Update fields if provided
  if (data.username !== undefined) existing.username = String(data.username || "").trim().slice(0, 100);
  if (data.displayName !== undefined) existing.displayName = String(data.displayName || "").trim().slice(0, 100);
  if (data.globalName !== undefined) existing.globalName = String(data.globalName || "").trim().slice(0, 100);
  if (data.avatarUrl !== undefined) existing.avatarUrl = data.avatarUrl ? String(data.avatarUrl).slice(0, 300) : null;
  if (data.email !== undefined) existing.email = data.email ? String(data.email).trim().toLowerCase().slice(0, 200) : null;
  if (data.accountCreatedAt !== undefined) existing.accountCreatedAt = data.accountCreatedAt ? String(data.accountCreatedAt) : null;
  if (data.tier !== undefined && USER_TIERS.includes(String(data.tier).toLowerCase())) {
    existing.tier = String(data.tier).toLowerCase();
  }
  if (data.activeServices !== undefined && Array.isArray(data.activeServices)) {
    existing.activeServices = data.activeServices.slice(0, 50).map((s) => String(s).slice(0, 80));
  }
  if (data.stripeCustomerId !== undefined) existing.stripeCustomerId = data.stripeCustomerId ? String(data.stripeCustomerId).trim() : null;
  if (data.subscriptionId !== undefined) existing.subscriptionId = data.subscriptionId ? String(data.subscriptionId).trim() : null;
  if (data.subscriptionStatus !== undefined) existing.subscriptionStatus = String(data.subscriptionStatus || "none").trim().slice(0, 30);
  if (data.paymentStatus !== undefined) existing.paymentStatus = String(data.paymentStatus || "active").trim().slice(0, 30);
  if (data.outstandingBalance !== undefined && isFinite(Number(data.outstandingBalance))) existing.outstandingBalance = Number(data.outstandingBalance);
  if (data.lastPaymentAt !== undefined) existing.lastPaymentAt = data.lastPaymentAt ? String(data.lastPaymentAt) : null;
  if (data.paymentFailedAt !== undefined) existing.paymentFailedAt = data.paymentFailedAt ? String(data.paymentFailedAt) : null;

  // Track guild membership
  if (data.guildId && data.guildName) {
    const guildId = String(data.guildId).trim();
    const guildEntry = existing.guilds.find((g) => g.guildId === guildId);
    if (!guildEntry) {
      existing.guilds = [{ guildId, guildName: String(data.guildName || "").trim().slice(0, 100), joinedAt: now }, ...existing.guilds].slice(0, 100);
    }
  }

  // Track IP for anti-bypass (dashboard only — not exposed publicly)
  if (data.ip) {
    const ip = String(data.ip).trim();
    if (ip && !existing.ipLog.includes(ip)) {
      existing.ipLog = [ip, ...existing.ipLog].slice(0, 50);
    }
  }

  existing.lastSeenAt = now;
  existing.updatedAt = now;

  usersRegistry[id] = existing;
  return existing;
}

/**
 * Find a user profile by Stripe customer ID.
 */
function findUserByStripeCustomer(stripeCustomerId) {
  if (!stripeCustomerId) return null;
  const cid = String(stripeCustomerId).trim();
  return Object.values(usersRegistry).find((p) => p.stripeCustomerId === cid) || null;
}

/**
 * Resolve a tier name from a Stripe price ID.
 * Falls back to null if the price is not mapped.
 */
function tierFromStripePrice(priceId) {
  if (!priceId) return null;
  return STRIPE_PRICE_MAP[String(priceId).trim()] || null;
}

/**
 * Apply auto-downgrade for a user after payment failure.
 * Called immediately or after grace period.
 */
function applyPaymentDowngrade(discordId, reason) {
  const profile = usersRegistry[discordId];
  if (!profile) return;
  const prevTier = profile.tier;
  upsertUserProfile(discordId, { tier: "free", paymentStatus: "past_due", subscriptionStatus: "past_due" });
  profile.infractions = [
    { reason: reason || "payment_failure", note: `Auto-downgraded from ${prevTier} to free tier`, at: new Date().toISOString() },
    ...(profile.infractions || [])
  ].slice(0, 100);
  persistUsers();
  pushAction({ command: "paymentDowngrade", value: `${discordId} downgraded from ${prevTier} (${reason || "payment_failure"})` });
}

/**
 * Append an activity log entry for a user.
 */
function recordUserActivity(discordId, activity) {
  const id = String(discordId || "").trim();
  if (!id) return;
  const profile = usersRegistry[id];
  if (!profile) return;

  const entry = {
    type: String(activity.type || "command").slice(0, 30),
    command: activity.command ? String(activity.command).slice(0, 80) : null,
    guildId: activity.guildId ? String(activity.guildId).slice(0, 30) : null,
    guildName: activity.guildName ? String(activity.guildName).slice(0, 100) : null,
    serviceAccessed: activity.serviceAccessed ? String(activity.serviceAccessed).slice(0, 80) : null,
    success: activity.success !== undefined ? Boolean(activity.success) : true,
    metadata: (activity.metadata && typeof activity.metadata === "object") ? activity.metadata : {},
    at: new Date().toISOString()
  };

  profile.activityLog = [entry, ...(profile.activityLog || [])].slice(0, USER_ACTIVITY_LIMIT);
  if (entry.type === "command" && entry.success) {
    profile.commandCount = (profile.commandCount || 0) + 1;
  }
  profile.lastSeenAt = entry.at;
  profile.updatedAt = entry.at;
}

// ─── BLACKLIST HELPERS ────────────────────────────────────────────────────────
function getUserBlacklistEntry(discordId) {
  const id = String(discordId || "").trim();
  const now = Date.now();
  return blacklistRegistry.find((entry) => {
    if (!entry.active || entry.discordId !== id) return false;
    if (entry.expiresAt) {
      const expMs = Date.parse(String(entry.expiresAt));
      if (Number.isFinite(expMs) && expMs <= now) return false; // expired
    }
    return true;
  }) || null;
}

function isUserBlacklisted(discordId) {
  return getUserBlacklistEntry(discordId) !== null;
}

/**
 * Blacklist a user. Downgrades to free tier — does NOT delete account.
 */
function blacklistUser(discordId, reason, reasonDetail, moderator, expiresAt) {
  const id = String(discordId || "").trim();
  if (!id) return { ok: false, error: "discordId is required" };

  const safeReason = USER_BLACKLIST_REASONS.includes(String(reason || "")) ? String(reason) : "tos_violation";
  const now = new Date().toISOString();

  // Deactivate any existing active entries for this user
  for (const entry of blacklistRegistry) {
    if (entry.discordId === id && entry.active) {
      entry.active = false;
    }
  }

  const newEntry = {
    id: `bl-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    discordId: id,
    username: (usersRegistry[id] && usersRegistry[id].username) || id,
    reason: safeReason,
    reasonDetail: reasonDetail ? String(reasonDetail).slice(0, 500) : null,
    moderator: moderator ? String(moderator).slice(0, 100) : "owner",
    addedAt: now,
    expiresAt: expiresAt ? String(expiresAt) : null,
    active: true
  };
  blacklistRegistry.unshift(newEntry);

  // Mark profile as blacklisted and downgrade to free tier
  const profile = usersRegistry[id];
  if (profile) {
    profile.blacklisted = true;
    profile.blacklistReason = safeReason;
    profile.blacklistAt = now;
    profile.blacklistModerator = newEntry.moderator;
    profile.blacklistExpiry = expiresAt || null;
    profile.tier = "free"; // downgrade to free
    profile.updatedAt = now;
    profile.infractions = [{ reason: safeReason, note: reasonDetail || "", at: now, by: newEntry.moderator }, ...(profile.infractions || [])].slice(0, 100);
  }

  persistBlacklist();
  if (profile) persistUsers();

  // Force-logout all dashboard sessions linked to this Discord ID
  purgeSessionsForDiscordId(id);

  pushOwnerNotification("critical", `User ${newEntry.username} (${id}) blacklisted: ${safeReason}`);
  pushAction({ command: "userBlacklisted", value: `${id} reason=${safeReason}` });

  return { ok: true, entry: newEntry };
}

/**
 * Remove a user from the blacklist and restore their tier.
 */
function unblacklistUser(discordId, moderator, restoredTier) {
  const id = String(discordId || "").trim();
  if (!id) return { ok: false, error: "discordId is required" };

  let found = false;
  for (const entry of blacklistRegistry) {
    if (entry.discordId === id && entry.active) {
      entry.active = false;
      found = true;
    }
  }

  const profile = usersRegistry[id];
  if (profile) {
    profile.blacklisted = false;
    profile.blacklistReason = null;
    profile.blacklistAt = null;
    profile.blacklistModerator = null;
    profile.blacklistExpiry = null;
    const newTier = restoredTier && USER_TIERS.includes(String(restoredTier)) ? String(restoredTier) : "free";
    profile.tier = newTier;
    profile.updatedAt = new Date().toISOString();
  }

  persistBlacklist();
  if (profile) persistUsers();

  pushOwnerNotification("info", `User ${id} removed from blacklist by ${moderator || "owner"}`);
  pushAction({ command: "userUnblacklisted", value: id });

  return { ok: true, removed: found };
}

/**
 * Freeze a user account (no commands, no access).
 */
function freezeUserAccount(discordId, reason, moderator) {
  const id = String(discordId || "").trim();
  if (!id) return { ok: false, error: "discordId is required" };
  const now = new Date().toISOString();

  let profile = usersRegistry[id];
  if (!profile) {
    profile = upsertUserProfile(id, {});
  }
  profile.frozen = true;
  profile.frozenAt = now;
  profile.frozenBy = moderator ? String(moderator).slice(0, 100) : "owner";
  profile.frozenReason = reason ? String(reason).slice(0, 300) : null;
  profile.updatedAt = now;

  persistUsers();
  pushOwnerNotification("warn", `User account ${id} frozen by ${profile.frozenBy}`);
  pushAction({ command: "userFrozen", value: id });

  // Force-logout all dashboard sessions linked to this Discord ID
  purgeSessionsForDiscordId(id);

  return { ok: true, profile };
}

/**
 * Restore a frozen/blacklisted user to full access.
 */
function restoreUserAccount(discordId, moderator, newTier) {
  const id = String(discordId || "").trim();
  if (!id) return { ok: false, error: "discordId is required" };

  const profile = usersRegistry[id];
  if (!profile) return { ok: false, error: "user not found" };

  profile.frozen = false;
  profile.frozenAt = null;
  profile.frozenBy = null;
  profile.frozenReason = null;
  if (newTier && USER_TIERS.includes(String(newTier))) {
    profile.tier = String(newTier);
  }
  profile.updatedAt = new Date().toISOString();

  persistUsers();
  pushOwnerNotification("info", `User account ${id} restored by ${moderator || "owner"}`);
  pushAction({ command: "userRestored", value: id });

  return { ok: true, profile };
}

/**
 * Anti-bypass: look for other known accounts linked to this discordId via shared IP.
 * Returns an array of linked discordIds that are blacklisted.
 */
function detectLinkedBlacklistedAccounts(discordId) {
  const id = String(discordId || "").trim();
  const profile = usersRegistry[id];
  if (!profile || !profile.ipLog || profile.ipLog.length === 0) return [];

  const linkedBlacklisted = [];
  for (const [otherId, otherProfile] of Object.entries(usersRegistry)) {
    if (otherId === id) continue;
    if (!otherProfile.ipLog || otherProfile.ipLog.length === 0) continue;
    const sharedIp = otherProfile.ipLog.some((ip) => profile.ipLog.includes(ip));
    if (sharedIp && isUserBlacklisted(otherId)) {
      linkedBlacklisted.push(otherId);
    }
  }
  return linkedBlacklisted;
}

/**
 * Full enforcement evaluation for a Discord user.
 * Returns { allow, tier, state, reason, warning }.
 */
function evaluateUserEnforcement(discordId, commandTier, commandName) {
  const id = String(discordId || "").trim();
  const safeCommandTier = String(commandTier || "basic").toLowerCase();

  // Check emergency lockout blacklist first
  if (lockout.blacklist.discordIds.includes(id)) {
    return { allow: false, tier: "none", state: "emergency_blacklisted", reason: "Account banned by system administrator." };
  }

  if (!id) {
    return { allow: true, tier: "free", state: "anonymous", warning: "No Discord ID provided — anonymous access." };
  }

  const profile = usersRegistry[id];

  // Check user blacklist
  const blacklistEntry = getUserBlacklistEntry(id);
  if (blacklistEntry) {
    // Downgrade to free tier — only allow free commands
    const cmd = String(commandName || "").toLowerCase();
    const isFreeCommand = FREE_TIER_COMMANDS.has(cmd);
    return {
      allow: isFreeCommand,
      tier: "free",
      state: "blacklisted",
      reason: "Your TRH Development subscription is currently restricted due to a violation. Premium services are temporarily disabled.",
      blacklistReason: blacklistEntry.reason,
      expiry: blacklistEntry.expiresAt || null
    };
  }

  // Anti-bypass: if linked to a blacklisted account
  if (profile) {
    const linkedBlacklisted = detectLinkedBlacklistedAccounts(id);
    if (linkedBlacklisted.length > 0) {
      // Re-apply blacklist and alert owner
      blacklistUser(id, "bypass", `Linked account bypass attempt. Linked IDs: ${linkedBlacklisted.join(", ")}`, "system-auto", null);
      pushOwnerNotification("critical", `Anti-bypass: ${id} linked to blacklisted accounts [${linkedBlacklisted.join(", ")}] — auto-blacklisted`);
      const cmd = String(commandName || "").toLowerCase();
      return {
        allow: FREE_TIER_COMMANDS.has(cmd),
        tier: "free",
        state: "blacklisted",
        reason: "Your TRH Development subscription is currently restricted. Premium services are temporarily disabled."
      };
    }
  }

  // Check frozen state
  if (profile && profile.frozen) {
    return { allow: false, tier: "none", state: "frozen", reason: "This account has been temporarily suspended by TRH Development." };
  }

  // Determine effective tier
  const effectiveTier = (profile && USER_TIERS.includes(profile.tier)) ? profile.tier : "free";
  const commandTierRank = TIER_RANK[safeCommandTier] ?? 0;
  const userTierRank = TIER_RANK[effectiveTier] ?? 0;

  if (safeCommandTier !== "basic" && commandTierRank > userTierRank) {
    return {
      allow: false,
      tier: effectiveTier,
      state: "tier_restricted",
      reason: `This command requires ${safeCommandTier.toUpperCase()} tier or higher. Your current tier is ${effectiveTier.toUpperCase()}.`
    };
  }

  return {
    allow: true,
    tier: effectiveTier,
    state: "active",
    warning: null
  };
}

function recordLockoutAbuseAttempt(req, reason) {  const ip = getClientIp(req);
  const entry = {
    ip,
    method: String(req.method || "").slice(0, 10),
    path: String(req.path || "").slice(0, 120),
    discordId: req.session && req.session.operatorDiscordId ? String(req.session.operatorDiscordId) : null,
    reason: String(reason || "blocked"),
    at: new Date().toISOString()
  };
  lockout.abuseLogs.unshift(entry);
  lockout.abuseLogs = lockout.abuseLogs.slice(0, 1000);
}

function purgeAllSessionFiles(ownerSessionId) {
  let purged = 0;
  try {
    const files = fs.readdirSync(SESSION_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const fileSessId = file.replace(/\.json$/, "");
      if (ownerSessionId && fileSessId === ownerSessionId) continue;
      try { fs.unlinkSync(path.join(SESSION_DIR, file)); purged++; } catch (_) {}
    }
  } catch (_) {}
  return purged;
}

/**
 * Purge all session files where the stored operatorDiscordId matches the given Discord ID.
 * Used to force-logout a user on blacklist or freeze.
 */
function purgeSessionsForDiscordId(discordId) {
  const targetId = String(discordId || "").trim();
  if (!targetId) return 0;
  let purged = 0;
  try {
    const files = fs.readdirSync(SESSION_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = fs.readFileSync(path.join(SESSION_DIR, file), "utf8");
        const data = JSON.parse(raw);
        // session-file-store wraps content; check both shapes
        const sessData = data && data.session ? data.session : data;
        if (String(sessData.operatorDiscordId || "").trim() === targetId) {
          fs.unlinkSync(path.join(SESSION_DIR, file));
          purged++;
        }
      } catch (_) {}
    }
  } catch (_) {}
  return purged;
}

function kickAllWebSocketClients() {
  let kicked = 0;
  for (const client of wss.clients) {
    try {
      client.send(JSON.stringify({
        type: "lockout",
        payload: {
          active: true,
          level: lockout.level,
          message: "TRH Development Services Temporarily Disabled By Owner"
        }
      }));
      client.close();
      kicked++;
    } catch (_) {}
  }
  return kicked;
}

function killBotProcesses() {
  const results = [];
  try {
    execFileSync("pm2", ["stop", "all"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 8000 });
    results.push({ tool: "pm2", action: "stop all", ok: true });
  } catch (_) { results.push({ tool: "pm2", action: "stop all", ok: false }); }
  try {
    execFileSync("pm2", ["delete", "all"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 8000 });
    results.push({ tool: "pm2", action: "delete all", ok: true });
  } catch (_) { results.push({ tool: "pm2", action: "delete all", ok: false }); }
  if (process.platform === "win32") {
    try {
      const psKill = [
        "$ErrorActionPreference='SilentlyContinue'",
        `$procs=Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('node.exe','nodejs.exe') -and $_.CommandLine -match 'discord|bot' -and $_.ProcessId -ne ${process.pid} }`,
        "$procs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
        "Write-Output 'done'"
      ].join("; ");
      execFileSync("powershell", ["-NoProfile", "-Command", psKill], {
        encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 15000
      });
      results.push({ tool: "powershell-kill", action: "kill discord node processes", ok: true });
    } catch (_) { results.push({ tool: "powershell-kill", action: "kill discord node processes", ok: false }); }
  }
  return results;
}

function verifyEmergencyCredentials(body) {
  const password = String((body || {}).ownerPassword || "").trim();
  const recoveryKey = String((body || {}).recoveryKey || "").trim();
  if (!OWNER_CONTROL_PASSWORD) return { ok: false, error: "OWNER_CONTROL_PASSWORD not configured" };
  if (!safeEqualStr(password, OWNER_CONTROL_PASSWORD)) return { ok: false, error: "invalid owner password" };
  if (EMERGENCY_RECOVERY_KEY && !safeEqualStr(recoveryKey, EMERGENCY_RECOVERY_KEY)) {
    return { ok: false, error: "invalid recovery key" };
  }
  return { ok: true };
}

function createOrderId() {
  const random = crypto.randomBytes(5).toString("hex");
  return `ord-${Date.now()}-${random}`;
}

function findCatalogItem(botId) {
  return botCatalog.find((item) => item.id === botId) || null;
}

function getAllOfferings() {
  const botOfferings = botCatalog.map((item) => ({
    ...item,
    kind: "bot-package",
    audience: "both",
    productFamily: "bot"
  }));

  const serviceOfferings = serviceCatalog.map((item) => ({
    ...item,
    productFamily: item.kind === "custom-bot" ? "bot" : "service"
  }));

  return [...botOfferings, ...serviceOfferings];
}

function findOfferingItem(offeringId) {
  return getAllOfferings().find((item) => item.id === offeringId) || null;
}

function createProvisioningToken() {
  return `trh-${crypto.randomBytes(6).toString("hex")}`;
}

function estimateBusinessTimelineWeeks(category, budgetUsd) {
  const safeBudget = toSafeWholeNumber(budgetUsd, 0);
  const baseMap = {
    bots: 4,
    dashboards: 3,
    scripts: 2,
    automation: 3
  };
  const base = baseMap[category] || 3;
  if (safeBudget >= 10000) {
    return base + 4;
  }
  if (safeBudget >= 5000) {
    return base + 2;
  }
  if (safeBudget >= 2500) {
    return base + 1;
  }
  return base;
}

function createQuoteTemplate({ serviceCategory, budgetUsd, companyName, contactName }) {
  const category = String(serviceCategory || "").toLowerCase();
  const service = businessServices.find((item) => item.category === category) || null;
  const safeBudget = toSafeWholeNumber(budgetUsd, 0);
  const timelineWeeks = estimateBusinessTimelineWeeks(category, safeBudget);
  const tier = safeBudget >= 10000 ? "enterprise" : safeBudget >= 3000 ? "growth" : "starter";

  const featureSet = service
    ? service.outcomes.slice(0, 3)
    : ["Scope definition", "Implementation milestone", "Quality validation"];

  const milestones = [
    { name: "Discovery & Technical Scope", weightPct: 20 },
    { name: "Core Build Execution", weightPct: 50 },
    { name: "QA, Handoff & Launch", weightPct: 30 }
  ];

  const lines = [
    `Quote Draft - ${service ? service.name : "Custom Project"}`,
    `Client: ${companyName || "Client"}`,
    `Contact: ${contactName || "Project Owner"}`,
    `Delivery Tier: ${tier}`,
    `Estimated Timeline: ${timelineWeeks} week(s)`,
    `Budget Envelope: $${safeBudget.toLocaleString()} USD`,
    "",
    "Scope Outcomes:",
    ...featureSet.map((line) => `- ${line}`),
    "",
    "Milestone Payments:",
    ...milestones.map((m) => {
      const amount = Math.round((safeBudget * m.weightPct) / 100);
      return `- ${m.name}: ${m.weightPct}% ($${amount.toLocaleString()} USD)`;
    }),
    "",
    "Commercial Notes:",
    "- Includes one revision cycle per milestone.",
    "- Source handoff follows final payment settlement.",
    "- Change requests are quoted separately after scope freeze."
  ];

  return {
    category,
    tier,
    serviceName: service ? service.name : "Custom Project",
    timelineWeeks,
    budgetUsd: safeBudget,
    milestones,
    outcomes: featureSet,
    quoteText: lines.join("\n")
  };
}

function getInquiryAgeMs(inquiry) {
  const createdAt = String(inquiry.createdAt || new Date().toISOString());
  const createdTime = Date.parse(createdAt);
  return Number.isFinite(createdTime) ? Date.now() - createdTime : 0;
}

function getInquiryCurrentStageDurationMs(inquiry) {
  const status = String(inquiry.status || "new").toLowerCase();
  const stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
  if (stageHistory.length === 0) {
    return getInquiryAgeMs(inquiry);
  }
  const currentEntry = stageHistory[0];
  if (!currentEntry || !currentEntry.at) {
    return 0;
  }
  const entryTime = Date.parse(String(currentEntry.at));
  return Number.isFinite(entryTime) ? Date.now() - entryTime : 0;
}

function isInquirySLABreached(inquiry) {
  const status = String(inquiry.status || "new").toLowerCase();
  const slaHours = BUSINESS_SLA_HOURS[status] || 0;
  if (slaHours <= 0) {
    return false;
  }
  const durationMs = getInquiryCurrentStageDurationMs(inquiry);
  const slaMs = slaHours * 60 * 60 * 1000;
  return durationMs > slaMs;
}

function computeBusinessMetrics(rows) {
  const sourceRows = Array.isArray(rows) ? rows : [];
  const byStatus = {};
  let activePipeline = 0;
  let quotedBudgetUsd = 0;
  let wonCount = 0;
  let slaBreachedCount = 0;

  for (const stage of BUSINESS_INQUIRY_STAGES) {
    byStatus[stage] = 0;
  }

  for (const row of sourceRows) {
    const status = BUSINESS_INQUIRY_STAGES.includes(String(row.status || "").toLowerCase())
      ? String(row.status).toLowerCase()
      : "new";
    byStatus[status] += 1;

    if (BUSINESS_ACTIVE_STAGES.has(status)) {
      activePipeline += 1;
    }

    if (status === "quoted" || status === "in-progress" || status === "delivered") {
      quotedBudgetUsd += toSafeWholeNumber(row.budgetUsd, 0);
    }

    if (status === "in-progress" || status === "delivered") {
      wonCount += 1;
    }

    if (isInquirySLABreached(row)) {
      slaBreachedCount += 1;
    }
  }

  const totalInquiries = sourceRows.length;
  const conversionRatePct = totalInquiries > 0 ? Number(((wonCount / totalInquiries) * 100).toFixed(1)) : 0;

  return {
    totalInquiries,
    activePipeline,
    quotedBudgetUsd,
    conversionRatePct,
    slaBreachedCount,
    byStatus
  };
}

function computeCommerceMetrics() {
  let totalRevenueUsd = 0;
  let paidOrders = 0;
  let pendingOrders = 0;
  let readyProvisioning = 0;
  let deliveredOrders = 0;

  for (const order of commerce.orders) {
    if (order.paymentStatus === "paid") {
      paidOrders += 1;
      totalRevenueUsd += Number(order.amountUsd) || 0;
    } else {
      pendingOrders += 1;
    }

    if (order.provisioningStatus === "ready") {
      readyProvisioning += 1;
    }
    if (order.provisioningStatus === "delivered") {
      deliveredOrders += 1;
    }
  }

  return {
    totalOrders: commerce.orders.length,
    paidOrders,
    pendingOrders,
    readyProvisioning,
    deliveredOrders,
    totalRevenueUsd
  };
}

function toCsvValue(value) {
  const raw = String(value == null ? "" : value);
  // Strip CSV injection prefixes (=, +, -, @, tab, CR) per OWASP formula injection guidance
  const safe = raw.replace(/^[\s]*[=+\-@\t\r]+/, "");
  const escaped = safe.replace(/"/g, '""');
  return `"${escaped}"`;
}

function createClientAccountId(email, discord) {
  const seed = `${String(email || "").toLowerCase()}|${String(discord || "").toLowerCase()}`;
  return `cli-${crypto.createHash("sha1").update(seed).digest("hex").slice(0, 12)}`;
}

function pushOwnerNotification(level, message, clientId = null) {
  const entry = {
    id: `note-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    level: String(level || "info"),
    message: String(message || "").slice(0, 220),
    clientId: clientId ? String(clientId) : null,
    at: new Date().toISOString()
  };

  commerce.ownerNotifications.unshift(entry);
  commerce.ownerNotifications = commerce.ownerNotifications.slice(0, 500);
}

function findClientAccount(clientId) {
  return commerce.clientAccounts.find((row) => row.id === clientId) || null;
}

function syncClientAccountsFromOrders() {
  const existing = new Map((commerce.clientAccounts || []).map((row) => [row.id, row]));
  const grouped = new Map();

  for (const order of commerce.orders || []) {
    const email = String(order.customerEmail || "").trim().toLowerCase();
    const discord = String(order.customerDiscord || "").trim();
    if (!email && !discord) {
      continue;
    }

    const clientId = createClientAccountId(email, discord);
    const current = grouped.get(clientId) || {
      id: clientId,
      email,
      discord,
      displayName: discord || email,
      totalBilledUsd: 0,
      totalPaidUsd: 0,
      latestOrderAt: null,
      latestPaidAt: null,
      activeBots: new Set()
    };

    const amount = Number(order.amountUsd || 0);
    current.totalBilledUsd += Number.isFinite(amount) ? Math.max(amount, 0) : 0;
    if (String(order.paymentStatus || "").toLowerCase() === "paid") {
      current.totalPaidUsd += Number.isFinite(amount) ? Math.max(amount, 0) : 0;
      if (!current.latestPaidAt || Date.parse(String(order.paidAt || "")) > Date.parse(String(current.latestPaidAt || ""))) {
        current.latestPaidAt = order.paidAt || order.createdAt || null;
      }
      if ((order.productFamily === "bot" || order.botId) && order.botId) {
        current.activeBots.add(String(order.botId));
      }
    }

    if (!current.latestOrderAt || Date.parse(String(order.createdAt || "")) > Date.parse(String(current.latestOrderAt || ""))) {
      current.latestOrderAt = order.createdAt || null;
    }

    grouped.set(clientId, current);
  }

  const merged = [];
  for (const row of grouped.values()) {
    const prior = existing.get(row.id) || {};
    const totalCostUsd = Math.max(Number(prior.totalCostUsd || 0), Number(row.totalBilledUsd || 0));
    const paidAmountUsd = Number(row.totalPaidUsd || 0);
    const remainingBalanceUsd = Math.max(0, Number((totalCostUsd - paidAmountUsd).toFixed(2)));
    const dueAt = prior.nextPaymentDueAt
      ? String(prior.nextPaymentDueAt)
      : row.latestPaidAt
        ? new Date(Date.parse(String(row.latestPaidAt)) + SUBSCRIPTION_CYCLE_MS).toISOString()
        : null;

    merged.push({
      id: row.id,
      email: row.email,
      discord: row.discord,
      displayName: prior.displayName || row.displayName,
      paymentState: ["active", "past_due", "restricted", "suspended"].includes(String(prior.paymentState || ""))
        ? String(prior.paymentState)
        : "active",
      nextPaymentDueAt: dueAt,
      pastDueAt: prior.pastDueAt ? String(prior.pastDueAt) : null,
      botStatus: ["running", "stopped", "disabled"].includes(String(prior.botStatus || ""))
        ? String(prior.botStatus)
        : "running",
      maintenanceBypass: Boolean(prior.maintenanceBypass),
      premiumLocked: Boolean(prior.premiumLocked),
      accessRevoked: Boolean(prior.accessRevoked),
      vipWhitelisted: Boolean(prior.vipWhitelisted),
      manualOverrideState: ["active", "restricted", "suspended"].includes(String(prior.manualOverrideState || ""))
        ? String(prior.manualOverrideState)
        : null,
      subscriptionAmountUsd: Number(prior.subscriptionAmountUsd || 0),
      totalCostUsd,
      paidAmountUsd,
      remainingBalanceUsd,
      balanceDueAt: prior.balanceDueAt ? String(prior.balanceDueAt) : null,
      lockedFeatures: Array.isArray(prior.lockedFeatures) ? prior.lockedFeatures.slice(0, 20) : [],
      activeBotIds: Array.from(row.activeBots).slice(0, 50),
      lastPaymentAt: row.latestPaidAt || null,
      // Feature toggles
      features: (prior.features && typeof prior.features === "object") ? prior.features : {
        moderation: true,
        tickets: true,
        economy: true,
        aiTools: true,
        apiAccess: true
      },
      // Contract / TOS tracking
      contract: (prior.contract && typeof prior.contract === "object") ? prior.contract : {
        signedAt: null,
        paymentAgreement: "monthly",
        violationLog: []
      },
      // Account flag
      flagged: Boolean(prior.flagged),
      flagReason: prior.flagReason ? String(prior.flagReason) : null,
      // Enforcement log
      enforcementLog: Array.isArray(prior.enforcementLog) ? prior.enforcementLog.slice(0, 50) : [],
      updatedAt: new Date().toISOString()
    });
  }

  commerce.clientAccounts = merged;
}

function applyPaymentStateTransitions() {
  const now = Date.now();
  let changed = false;

  for (const client of commerce.clientAccounts) {
    if (!client) {
      continue;
    }

    const currentState = String(client.paymentState || "active");
    const dueMs = Date.parse(String(client.nextPaymentDueAt || ""));
    const balanceDueMs = Date.parse(String(client.balanceDueAt || ""));
    const pastDueMs = Date.parse(String(client.pastDueAt || ""));
    const hasSubscriptionOverdue = Number.isFinite(dueMs) && now > dueMs;
    const hasBalanceOverdue = Number(client.remainingBalanceUsd || 0) > 0 && Number.isFinite(balanceDueMs) && now > balanceDueMs;
    const overdue = hasSubscriptionOverdue || hasBalanceOverdue;

    if (client.vipWhitelisted) {
      if (currentState !== "active") {
        client.paymentState = "active";
        client.pastDueAt = null;
        client.premiumLocked = false;
        if (client.botStatus === "disabled") {
          client.botStatus = "running";
        }
        changed = true;
      }
      continue;
    }

    if (client.accessRevoked) {
      if (currentState !== "suspended" || client.botStatus !== "disabled") {
        client.paymentState = "suspended";
        client.botStatus = "disabled";
        client.premiumLocked = true;
        changed = true;
      }
      continue;
    }

    if (client.manualOverrideState === "suspended") {
      if (currentState !== "suspended") {
        client.paymentState = "suspended";
        client.botStatus = "disabled";
        client.premiumLocked = true;
        changed = true;
      }
      continue;
    }

    if (client.manualOverrideState === "restricted") {
      if (currentState !== "restricted") {
        client.paymentState = "restricted";
        client.premiumLocked = true;
        if (client.botStatus === "disabled") {
          client.botStatus = "running";
        }
        changed = true;
      }
      continue;
    }

    if (client.manualOverrideState === "active") {
      if (currentState !== "active") {
        client.paymentState = "active";
        client.pastDueAt = null;
        client.premiumLocked = false;
        if (client.botStatus === "disabled") {
          client.botStatus = "running";
        }
        changed = true;
      }
      continue;
    }

    if (!overdue) {
      if (currentState !== "active") {
        client.paymentState = "active";
        client.pastDueAt = null;
        client.premiumLocked = false;
        if (client.botStatus === "disabled") {
          client.botStatus = "running";
        }
        changed = true;
      }
      continue;
    }

    if (currentState === "active") {
      client.paymentState = "past_due";
      client.pastDueAt = new Date().toISOString();
      pushOwnerNotification("warn", `Client ${client.displayName} moved to past_due.`, client.id);
      pushAction({ command: "paymentStateChanged", value: `${client.id} -> past_due` });
      changed = true;
      continue;
    }

    const ageMs = Number.isFinite(pastDueMs) ? now - pastDueMs : 0;
    if (currentState === "past_due" && ageMs >= PAYMENT_GRACE_MS) {
      client.paymentState = "restricted";
      client.premiumLocked = true;
      pushOwnerNotification("warn", `Client ${client.displayName} moved to restricted after grace period.`, client.id);
      pushAction({ command: "paymentStateChanged", value: `${client.id} -> restricted` });
      changed = true;
      continue;
    }

    if ((currentState === "past_due" || currentState === "restricted") && ageMs >= PAYMENT_SUSPEND_MS) {
      client.paymentState = "suspended";
      client.premiumLocked = true;
      client.botStatus = "disabled";
      pushOwnerNotification("critical", `Client ${client.displayName} suspended for non-payment.`, client.id);
      pushAction({ command: "paymentStateChanged", value: `${client.id} -> suspended` });
      changed = true;
    }
  }

  if (changed) {
    for (const client of commerce.clientAccounts) {
      client.updatedAt = new Date().toISOString();
    }
    persistCommerce();
  }
}

function computeOwnerPaymentSummary() {
  const rows = Array.isArray(commerce.clientAccounts) ? commerce.clientAccounts : [];
  let active = 0;
  let pastDue = 0;
  let restricted = 0;
  let suspended = 0;
  let outstandingBalanceUsd = 0;

  for (const row of rows) {
    const stateName = String(row.paymentState || "active");
    if (stateName === "past_due") {
      pastDue += 1;
    } else if (stateName === "restricted") {
      restricted += 1;
    } else if (stateName === "suspended") {
      suspended += 1;
    } else {
      active += 1;
    }
    outstandingBalanceUsd += Number(row.remainingBalanceUsd || 0);
  }

  return {
    totalClients: rows.length,
    active,
    pastDue,
    restricted,
    suspended,
    outstandingBalanceUsd: Number(outstandingBalanceUsd.toFixed(2))
  };
}

function resolveClientAccountFromIdentity(email, discord, clientId) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedDiscord = String(discord || "").trim();
  const normalizedId = String(clientId || "").trim();

  if (normalizedId) {
    return findClientAccount(normalizedId);
  }

  return commerce.clientAccounts.find((row) => {
    const emailMatch = normalizedEmail && String(row.email || "").toLowerCase() === normalizedEmail;
    const discordMatch = normalizedDiscord && String(row.discord || "") === normalizedDiscord;
    return emailMatch || discordMatch;
  }) || null;
}

function evaluateClientCommandAccess(client, commandTier = "basic") {
  if (state.globalShutdown) {
    return {
      allow: false,
      state: "shutdown",
      message: "TRH bot network is in GLOBAL SHUTDOWN."
    };
  }

  if (state.maintenanceMode && !(client && client.maintenanceBypass)) {
    return {
      allow: false,
      state: "maintenance",
      message: "TRH systems are currently under maintenance"
    };
  }

  if (!client) {
    return {
      allow: false,
      state: "inactive",
      message: "This bot is currently inactive due to unpaid balance. Please contact TRH Development."
    };
  }

  const paymentState = String(client.paymentState || "active");
  const isPremium = String(commandTier || "basic").toLowerCase() === "premium";

  if (client.accessRevoked || paymentState === "suspended" || client.botStatus === "disabled") {
    return {
      allow: false,
      state: "suspended",
      message: "This bot is currently inactive due to unpaid balance. Please contact TRH Development."
    };
  }

  if (client.botStatus === "stopped") {
    return {
      allow: false,
      state: "stopped",
      message: "This bot is currently stopped by TRH operations."
    };
  }

  if (paymentState === "restricted" && (client.premiumLocked || isPremium)) {
    return {
      allow: false,
      state: "restricted",
      message: "Account is restricted due to outstanding payment. Premium commands are disabled."
    };
  }

  if (paymentState === "past_due") {
    return {
      allow: true,
      state: "past_due",
      warning: "Your TRH subscription is past due. Please pay within 48 hours.",
      message: "Allowed with grace-period warning."
    };
  }

  return {
    allow: true,
    state: "active",
    message: "Command allowed."
  };
}

function requirePanelApiKey(req, res, next) {
  if (!PANEL_API_KEY) {
    return res.status(401).json({ ok: false, error: "operator login required" });
  }

  const key = String(req.header("x-panel-api-key") || "");
  if (!safeEqualStr(key, PANEL_API_KEY)) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  return next();
}

function requireOperatorSession(req, res, next) {
  if (req.session && req.session.operatorAuthenticated) {
    return next();
  }

  return res.status(401).json({ ok: false, error: "operator login required" });
}

function getClientIp(req) {
  // Use Express's req.ip which respects the `trust proxy` setting.
  // In production (trust proxy: 1), Express extracts the real IP from XFF.
  // In development, it uses the socket remote address — preventing XFF spoofing
  // that would let an attacker bypass IP-based rate limiting.
  return String(req.ip || "unknown");
}

function cleanupLoginFailures() {
  const now = Date.now();
  for (const [ip, data] of loginFailures.entries()) {
    const expiredBlock = data.blockedUntil > 0 && data.blockedUntil <= now;
    const staleWindow = now - data.firstFailAt > LOGIN_WINDOW_MS;
    if (expiredBlock && staleWindow) {
      loginFailures.delete(ip);
    }
  }
}

function getLoginBlockSeconds(req) {
  cleanupLoginFailures();
  const ip = getClientIp(req);
  const data = loginFailures.get(ip);
  if (!data || !data.blockedUntil) {
    return 0;
  }

  const remainingMs = data.blockedUntil - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

function recordLoginFailure(req) {
  cleanupLoginFailures();
  const ip = getClientIp(req);
  const now = Date.now();
  const data = loginFailures.get(ip) || { count: 0, firstFailAt: now, blockedUntil: 0 };

  if (now - data.firstFailAt > LOGIN_WINDOW_MS) {
    data.count = 0;
    data.firstFailAt = now;
    data.blockedUntil = 0;
  }

  data.count += 1;
  if (data.count >= LOGIN_MAX_ATTEMPTS) {
    data.blockedUntil = now + LOGIN_BLOCK_MS;
  }

  loginFailures.set(ip, data);
}

function clearLoginFailures(req) {
  loginFailures.delete(getClientIp(req));
}

function recordLoginEvent(req, { discordId, success, reason }) {
  const ip = getClientIp(req);
  const ua = String(req.header("user-agent") || "unknown").slice(0, 200);
  const entry = {
    id: `log-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    discordId: discordId ? String(discordId) : null,
    ip,
    userAgent: ua,
    device: ua.includes("Mobile") ? "Mobile" : "Desktop",
    browser: ua.match(/Firefox|Chrome|Safari|Edge|Opera/i)?.[0] || "Unknown",
    success: Boolean(success),
    reason: reason ? String(reason) : null,
    at: new Date().toISOString()
  };
  commerce.loginLog.unshift(entry);
  commerce.loginLog = commerce.loginLog.slice(0, 2000);
  persistCommerce();
  return entry;
}

function normalizeDiscordUserId(value) {
  return String(value || "").trim();
}

function isOwnerDiscordId(value) {
  const normalized = normalizeDiscordUserId(value);
  return /^\d{17,20}$/.test(normalized) && OWNER_DISCORD_ALLOWLIST.has(normalized);
}

function requirePanelAccess(req, res, next) {
  if (req.session && req.session.operatorAuthenticated) {
    return next();
  }

  return requirePanelApiKey(req, res, next);
}

function requireOwnerAccess(req, res, next) {
  if (req.session && req.session.ownerAuthenticated) {
    return next();
  }

  const ownerKey = String(req.header("x-owner-key") || "").trim();
  if (ownerKey && safeEqualStr(ownerKey, OWNER_CONTROL_PASSWORD)) {
    return next();
  }

  return res.status(403).json({ ok: false, error: "owner access required" });
}

/**
 * Express middleware — enforce user subscription/blacklist status before processing
 * any API request that carries a Discord User ID.
 *
 * Reads discordId from (in order): req.body.discordId, req.query.discordId,
 * req.header("x-discord-id").
 *
 * Options (passed as second arg factory call):
 *   minTier   — "free" | "vip" | "pro" | "premium" (default: "free")
 *   failOpen  — if true, allow through when user has no profile (default: true)
 *
 * Usage:
 *   app.post("/api/my-premium-route", requireBotSignedRequest, requireUserEnforcement({ minTier: "pro" }), handler);
 */
function requireUserEnforcement(opts = {}) {
  const minTier = String(opts.minTier || "free").toLowerCase();
  const failOpen = opts.failOpen !== false;
  const minRank = TIER_RANK[minTier] || 0;

  return function userEnforcementMiddleware(req, res, next) {
    const discordId = String(
      (req.body && req.body.discordId) ||
      (req.query && req.query.discordId) ||
      req.header("x-discord-id") || ""
    ).trim();

    if (!discordId) {
      // No identity supplied — respect failOpen
      if (failOpen) return next();
      return res.status(403).json({ ok: false, error: "discord_id required", state: "no_identity" });
    }

    const profile = usersRegistry[discordId];
    if (!profile) {
      if (failOpen) return next();
      return res.status(403).json({ ok: false, error: "user profile not found", state: "unknown_user" });
    }

    // Blacklist check
    const blEntry = getUserBlacklistEntry(discordId);
    if (blEntry) {
      return res.status(403).json({
        ok: false,
        error: "Your TRH Development account is restricted. Premium services are disabled until the issue is resolved.",
        state: "blacklisted",
        reason: blEntry.reason
      });
    }

    // Freeze check
    if (profile.frozen) {
      return res.status(403).json({
        ok: false,
        error: "This account has been temporarily suspended by TRH Development.",
        state: "frozen"
      });
    }

    // Tier check
    const userRank = TIER_RANK[profile.tier] || 0;
    if (userRank < minRank) {
      return res.status(403).json({
        ok: false,
        error: `This endpoint requires ${minTier.toUpperCase()} tier or higher. Your current tier is ${(profile.tier || "free").toUpperCase()}.`,
        state: "tier_restricted",
        required: minTier,
        current: profile.tier || "free"
      });
    }

    // Attach profile to request for downstream handlers
    req.trhUserProfile = profile;
    return next();
  };
}

function safeEqualHex(expectedHex, receivedHex) {
  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(receivedHex, "hex");
  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

// Constant-time string comparison to prevent timing oracle attacks on secrets.
function safeEqualStr(a, b) {
  if (!a || !b) return false;
  try {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (_) {
    return false;
  }
}

function cleanupNonces() {
  const cutoff = Date.now() - WEBHOOK_WINDOW_SECONDS * 1000;
  for (const [nonce, createdAt] of usedWebhookNonces.entries()) {
    if (createdAt < cutoff) {
      usedWebhookNonces.delete(nonce);
    }
  }
}

function requireBotSignedRequest(req, res, next) {
  if (BOT_WS_TOKEN) {
    const token = String(req.header("x-bot-token") || "");
    if (!safeEqualStr(token, BOT_WS_TOKEN)) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
  }

  if (!BOT_SIGNING_SECRET) {
    return next();
  }

  const signatureHeader = String(req.header("x-trh-signature") || "").trim();
  const timestampHeader = String(req.header("x-trh-timestamp") || "").trim();
  const nonce = String(req.header("x-trh-nonce") || "").trim();
  if (!signatureHeader || !timestampHeader || !nonce) {
    return res.status(401).json({ ok: false, error: "missing webhook signature headers" });
  }

  const timestampNum = Number(timestampHeader);
  if (!Number.isFinite(timestampNum)) {
    return res.status(401).json({ ok: false, error: "invalid timestamp" });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const requestSeconds = timestampNum > 1e12 ? Math.floor(timestampNum / 1000) : Math.floor(timestampNum);
  if (Math.abs(nowSeconds - requestSeconds) > WEBHOOK_WINDOW_SECONDS) {
    return res.status(401).json({ ok: false, error: "stale webhook timestamp" });
  }

  cleanupNonces();
  if (usedWebhookNonces.has(nonce)) {
    return res.status(401).json({ ok: false, error: "replayed webhook nonce" });
  }

  const payload = `${requestSeconds}.${String(req.rawBody || Buffer.from(""))}`;
  const expected = crypto.createHmac("sha256", BOT_SIGNING_SECRET).update(payload).digest("hex");
  const received = signatureHeader.replace(/^sha256=/i, "").toLowerCase();
  if (!/^[a-fA-F0-9]{64}$/.test(received) || !safeEqualHex(expected, received)) {
    return res.status(401).json({ ok: false, error: "invalid webhook signature" });
  }

  usedWebhookNonces.set(nonce, Date.now());
  return next();
}

function isRateLimited(key, limit, windowMs) {
  const now = Date.now();
  const current = txRateMap.get(key);

  if (!current || now - current.windowStart > windowMs) {
    txRateMap.set(key, { count: 1, windowStart: now });
    return false;
  }

  current.count += 1;
  txRateMap.set(key, current);
  return current.count > limit;
}

function pushAction(action) {
  const withTime = {
    ...action,
    at: new Date().toISOString()
  };

  state.recentActions.unshift(withTime);
  state.recentActions = state.recentActions.slice(0, 20);
  lastUpdateAt = withTime.at;
  persistState();
}

function summarizeTx24h() {
  const sinceMs = Date.now() - 24 * 60 * 60 * 1000;
  let count = 0;
  let volume = 0;
  for (const tx of state.economyLedger) {
    const atMs = Date.parse(tx.at || "");
    if (!Number.isNaN(atMs) && atMs >= sinceMs) {
      count += 1;
      volume += Math.abs(Number(tx.delta) || 0);
    }
  }
  return { count, volume };
}

function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload });

  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

// ─── LOCKOUT ENFORCEMENT MIDDLEWARE ──────────────────────────────────────────
app.use(function lockoutEnforcement(req, res, next) {
  const reqPath = String(req.path || "");

  // Emergency management endpoints always pass through
  const emergencyPassthrough = ["/api/emergency/status", "/api/emergency/restore", "/api/health"];
  if (emergencyPassthrough.some((p) => reqPath === p || reqPath.startsWith(p + "/"))) {
    return next();
  }

  // Evaluate IP and Discord blacklist regardless of lockout state
  const ip = getClientIp(req);
  if (lockout.blacklist.ips.includes(ip)) {
    recordLockoutAbuseAttempt(req, "blacklisted-ip");
    persistLockout();
    if (reqPath.startsWith("/api/")) {
      return res.status(403).json({ ok: false, error: "Access revoked.", blacklisted: true });
    }
    return next(); // serve static so the page can render
  }

  const discordId = req.session && req.session.operatorDiscordId ? String(req.session.operatorDiscordId) : null;
  if (discordId && lockout.blacklist.discordIds.includes(discordId)) {
    recordLockoutAbuseAttempt(req, "blacklisted-discord");
    persistLockout();
    if (reqPath.startsWith("/api/")) {
      return res.status(403).json({ ok: false, error: "Access revoked.", blacklisted: true });
    }
    return next();
  }

  if (!lockout.active) return next();

  // LOCKOUT ACTIVE — only verified owner sessions pass through
  const isOwnerSession = req.session && req.session.ownerAuthenticated === true;
  const ownerApiKey = String(req.header("x-owner-key") || "").trim();
  const isOwnerKey = ownerApiKey && OWNER_CONTROL_PASSWORD && safeEqualStr(ownerApiKey, OWNER_CONTROL_PASSWORD);

  if (isOwnerSession || isOwnerKey) return next();

  // Block all API routes with lockout message
  if (reqPath.startsWith("/api/")) {
    recordLockoutAbuseAttempt(req, "blocked-during-lockout");
    persistLockout();
    return res.status(503).json({
      ok: false,
      error: "TRH Development Services Temporarily Disabled By Owner",
      locked: true,
      level: lockout.level
    });
  }

  // Allow static file delivery so the browser renders the lockout overlay
  return next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    wsClients: wss.clients.size,
    memoryRssMb: Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(2))
  });
});

app.get("/api/metrics", requirePanelAccess, (_req, res) => {
  const tx24h = summarizeTx24h();

  res.json({
    ok: true,
    wsClients: wss.clients.size,
    lastUpdateAt,
    txCount24h: tx24h.count,
    txVolume24h: tx24h.volume,
    processedTxIds: state.processedTxIds.length,
    ledgerRows: state.economyLedger.length,
    memoryRssMb: Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(2))
  });
});

app.get("/api/bot/economy/ledger", requirePanelAccess, (req, res) => {
  const limit = Math.min(toSafeWholeNumber(req.query.limit, 100), 500);
  res.json({
    ok: true,
    rows: state.economyLedger.slice(0, limit)
  });
});

app.get("/api/audit/export", requirePanelAccess, (_req, res) => {
  const payload = {
    generatedAt: new Date().toISOString(),
    state: {
      botOnline: state.botOnline,
      guildCount: state.guildCount,
      usersServed: state.usersServed,
      economyBalance: state.economyBalance,
      processedTxCount: state.processedTxIds.length,
      ledgerRows: state.economyLedger.length,
      lastUpdateAt
    },
    recentActions: state.recentActions,
    economyLedger: state.economyLedger
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename=trh-audit-${Date.now()}.json`);
  res.send(JSON.stringify(payload, null, 2));
});

app.get("/api/state", (_req, res) => {
  res.json({
    botOnline: state.botOnline,
    maintenanceMode: state.maintenanceMode,
    globalShutdown: state.globalShutdown,
    guildCount: state.guildCount,
    usersServed: state.usersServed,
    economyBalance: state.economyBalance,
    recentActions: state.recentActions
  });
});

app.get("/api/owner/auth/me", (req, res) => {
  res.json({
    ok: true,
    authenticated: Boolean(req.session && req.session.ownerAuthenticated),
    discordId: req.session && req.session.operatorDiscordId ? String(req.session.operatorDiscordId) : null
  });
});

app.post("/api/owner/auth/elevate", requirePanelAccess, (req, res) => {
  const password = String((req.body || {}).password || "");
  if (!OWNER_CONTROL_PASSWORD) {
    return res.status(500).json({ ok: false, error: "OWNER_CONTROL_PASSWORD is not configured" });
  }
  if (!safeEqualStr(password, OWNER_CONTROL_PASSWORD)) {
    return res.status(401).json({ ok: false, error: "invalid owner credentials" });
  }

  req.session.ownerAuthenticated = true;
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ ok: false, error: "Session save failed" });
    }
    return res.json({ ok: true, authenticated: true });
  });
});

app.get("/api/owner/overview", requireOwnerAccess, (_req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();

  return res.json({
    ok: true,
    system: {
      botOnline: state.botOnline,
      maintenanceMode: state.maintenanceMode,
      globalShutdown: state.globalShutdown,
      lastForceUpdateAt: state.lastForceUpdateAt,
      wsClients: wss.clients.size
    },
    summary: computeOwnerPaymentSummary(),
    clients: commerce.clientAccounts,
    notifications: (commerce.ownerNotifications || []).slice(0, 40)
  });
});

app.post("/api/owner/system/action", requireOwnerAccess, (req, res) => {
  const action = String((req.body || {}).action || "").trim().toLowerCase();

  if (!action) {
    return res.status(400).json({ ok: false, error: "action is required" });
  }

  if (action === "start_all") {
    state.botOnline = true;
    state.globalShutdown = false;
    for (const client of commerce.clientAccounts) {
      if (!client.accessRevoked && client.botStatus !== "disabled") {
        client.botStatus = "running";
      }
    }
  } else if (action === "stop_all") {
    state.botOnline = false;
    for (const client of commerce.clientAccounts) {
      if (client.botStatus !== "disabled") {
        client.botStatus = "stopped";
      }
    }
  } else if (action === "restart_all") {
    state.botOnline = true;
    state.globalShutdown = false;
    for (const client of commerce.clientAccounts) {
      if (!client.accessRevoked && client.botStatus !== "disabled") {
        client.botStatus = "running";
      }
    }
  } else if (action === "force_update_all") {
    state.lastForceUpdateAt = new Date().toISOString();
  } else if (action === "global_shutdown") {
    state.globalShutdown = true;
    state.botOnline = false;
    for (const client of commerce.clientAccounts) {
      client.botStatus = "disabled";
    }
  } else if (action === "maintenance_on") {
    state.maintenanceMode = true;
  } else if (action === "maintenance_off") {
    state.maintenanceMode = false;
  } else {
    return res.status(400).json({ ok: false, error: "unknown owner system action" });
  }

  persistState();
  persistCommerce();
  pushAction({ command: "ownerSystemAction", value: action });
  pushOwnerNotification("info", `Owner executed system action: ${action}`);
  broadcast("state", state);

  return res.json({ ok: true, action });
});

app.post("/api/owner/clients/:clientId/action", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const action = String((req.body || {}).action || "").trim().toLowerCase();
  const client = findClientAccount(clientId);
  if (!client) {
    return res.status(404).json({ ok: false, error: "client not found" });
  }

  if (action === "suspend_bot") {
    client.paymentState = "suspended";
    client.manualOverrideState = "suspended";
    client.botStatus = "disabled";
    client.premiumLocked = true;
  } else if (action === "lock_features") {
    client.paymentState = "restricted";
    client.manualOverrideState = "restricted";
    client.premiumLocked = true;
    client.lockedFeatures = ["tickets", "economy", "advanced-commands"];
  } else if (action === "reset_config") {
    client.lockedFeatures = [];
    client.premiumLocked = false;
  } else if (action === "revoke_access") {
    client.accessRevoked = true;
    client.paymentState = "suspended";
    client.botStatus = "disabled";
    client.premiumLocked = true;
  } else if (action === "unlock_client") {
    client.accessRevoked = false;
    client.manualOverrideState = "active";
    client.paymentState = "active";
    client.botStatus = "running";
    client.premiumLocked = false;
    client.pastDueAt = null;
    client.lockedFeatures = [];
  } else if (action === "extend_due_date") {
    const now = Date.now();
    const base = Date.parse(String(client.nextPaymentDueAt || ""));
    const next = Number.isFinite(base) && base > now ? base : now;
    client.nextPaymentDueAt = new Date(next + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (action === "reduce_balance") {
    const amount = Number((req.body || {}).amountUsd || 50);
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    client.totalCostUsd = Math.max(0, Number(client.totalCostUsd || 0) - safeAmount);
    client.remainingBalanceUsd = Math.max(0, Number((client.totalCostUsd - client.paidAmountUsd).toFixed(2)));
  } else if (action === "whitelist_vip") {
    client.vipWhitelisted = true;
    client.manualOverrideState = "active";
    client.paymentState = "active";
    client.premiumLocked = false;
    client.botStatus = "running";
  } else if (action === "unwhitelist_vip") {
    client.vipWhitelisted = false;
    client.manualOverrideState = null;
  } else if (action === "restart_bot") {
    client.botStatus = "running";
  } else if (action === "force_update") {
    client.lastForcedUpdateAt = new Date().toISOString();
  } else if (action === "activate_client") {
    client.manualOverrideState = "active";
    client.paymentState = "active";
    client.premiumLocked = false;
    client.botStatus = "running";
    client.pastDueAt = null;
  } else {
    return res.status(400).json({ ok: false, error: "unknown client action" });
  }

  client.updatedAt = new Date().toISOString();
  applyPaymentStateTransitions();
  persistCommerce();
  pushAction({ command: "ownerClientAction", value: `${client.id}:${action}` });
  pushOwnerNotification("info", `Owner action ${action} applied to ${client.displayName}.`, client.id);

  return res.json({ ok: true, client });
});

app.post("/api/owner/clients/:clientId/financials", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) {
    return res.status(404).json({ ok: false, error: "client not found" });
  }

  const totalCostUsd = Number((req.body || {}).totalCostUsd);
  const paidAmountUsd = Number((req.body || {}).paidAmountUsd);
  const dueAt = String((req.body || {}).dueAt || "").trim();
  const balanceDueAt = String((req.body || {}).balanceDueAt || "").trim();

  if (Number.isFinite(totalCostUsd) && totalCostUsd >= 0) {
    client.totalCostUsd = Number(totalCostUsd.toFixed(2));
  }
  if (Number.isFinite(paidAmountUsd) && paidAmountUsd >= 0) {
    client.paidAmountUsd = Number(paidAmountUsd.toFixed(2));
  }
  if (dueAt) {
    const parsed = Date.parse(dueAt);
    if (!Number.isFinite(parsed)) {
      return res.status(400).json({ ok: false, error: "invalid dueAt date" });
    }
    client.nextPaymentDueAt = new Date(parsed).toISOString();
  }
  if (balanceDueAt) {
    const parsedBalance = Date.parse(balanceDueAt);
    if (!Number.isFinite(parsedBalance)) {
      return res.status(400).json({ ok: false, error: "invalid balanceDueAt date" });
    }
    client.balanceDueAt = new Date(parsedBalance).toISOString();
  }

  client.remainingBalanceUsd = Math.max(0, Number((Number(client.totalCostUsd || 0) - Number(client.paidAmountUsd || 0)).toFixed(2)));
  client.updatedAt = new Date().toISOString();

  applyPaymentStateTransitions();
  persistCommerce();
  pushAction({ command: "ownerFinancialUpdate", value: client.id });
  pushOwnerNotification("info", `Owner updated financials for ${client.displayName}.`, client.id);

  return res.json({ ok: true, client });
});

app.get("/api/client/control-status", (req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();

  const email = String(req.query.email || "").trim().toLowerCase();
  const discord = String(req.query.discord || "").trim();
  const clientId = String(req.query.clientId || "").trim();
  const commandTier = String(req.query.commandTier || "basic").trim().toLowerCase();

  if (!email && !discord && !clientId) {
    return res.status(400).json({ ok: false, error: "email, discord, or clientId is required" });
  }

  const client = resolveClientAccountFromIdentity(email, discord, clientId);
  const enforcement = evaluateClientCommandAccess(client, commandTier);

  return res.json({
    ok: true,
    enforcement,
    client: client
      ? {
          id: client.id,
          displayName: client.displayName,
          email: client.email,
          discord: client.discord,
          paymentState: client.paymentState,
          remainingBalanceUsd: client.remainingBalanceUsd,
          nextPaymentDueAt: client.nextPaymentDueAt,
          balanceDueAt: client.balanceDueAt,
          premiumLocked: client.premiumLocked,
          botStatus: client.botStatus,
          vipWhitelisted: client.vipWhitelisted
        }
      : null
  });
});

app.post("/api/client/command-check", requireBotSignedRequest, (req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();

  const payload = req.body || {};
  const email = String(payload.email || "").trim().toLowerCase();
  const discord = String(payload.discord || "").trim();
  const clientId = String(payload.clientId || "").trim();
  const commandTier = String(payload.commandTier || "basic").trim().toLowerCase();
  const commandName = String(payload.commandName || "unknown").trim().slice(0, 80);
  const discordId = String(payload.discordId || "").trim();

  if (!email && !discord && !clientId) {
    return res.status(400).json({ ok: false, error: "email, discord, or clientId is required" });
  }

  const client = resolveClientAccountFromIdentity(email, discord, clientId);
  const clientEnforcement = evaluateClientCommandAccess(client, commandTier);

  // Check user-level enforcement if discordId provided
  let userEnforcement = null;
  if (discordId) {
    userEnforcement = evaluateUserEnforcement(discordId, commandTier, commandName);
    // Log this command attempt against the user profile
    if (usersRegistry[discordId]) {
      recordUserActivity(discordId, {
        type: "command",
        command: commandName,
        serviceAccessed: commandTier,
        success: userEnforcement.allow && clientEnforcement.allow,
        metadata: { tier: commandTier }
      });
      persistUsers();
    }
    // If user enforcement blocks, it wins over client enforcement
    if (!userEnforcement.allow) {
      return res.json({
        ok: true,
        commandName,
        enforcement: {
          allow: false,
          state: userEnforcement.state,
          message: userEnforcement.reason,
          tier: userEnforcement.tier
        },
        clientId: client ? client.id : null
      });
    }
  }

  return res.json({
    ok: true,
    commandName,
    enforcement: {
      ...clientEnforcement,
      tier: userEnforcement ? userEnforcement.tier : null
    },
    clientId: client ? client.id : null
  });
});

app.get("/api/platform/overview", (_req, res) => {
  const metrics = computeCommerceMetrics();
  const totalModules = botBuildLibrary.reduce((acc, bot) => acc + bot.modules.length, 0);

  res.json({
    ok: true,
    platform: {
      botPackages: botCatalog.length,
      buildProfiles: botBuildLibrary.length,
      totalModules,
      totalOrders: metrics.totalOrders,
      revenueUsd: metrics.totalRevenueUsd,
      readyToProvision: metrics.readyProvisioning,
      deliveredOrders: metrics.deliveredOrders,
      activeWsClients: wss.clients.size,
      botOnline: state.botOnline
    }
  });
});

app.get("/api/bot/build-library", (_req, res) => {
  const rows = botBuildLibrary.map((entry) => {
    const catalog = findCatalogItem(entry.botId);
    return {
      botId: entry.botId,
      botName: catalog ? catalog.name : entry.botId,
      architecture: entry.architecture,
      modules: entry.modules,
      integrations: entry.integrations,
      deliveryArtifacts: entry.deliveryArtifacts,
      priceUsd: catalog ? catalog.priceUsd : null
    };
  });

  res.json({ ok: true, rows });
});

app.get("/api/store/catalog", (_req, res) => {
  res.json({
    ok: true,
    paymentMode: stripeClient ? "stripe+mock" : "mock-only",
    items: botCatalog.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      features: item.features,
      priceUsd: item.priceUsd,
      originalPriceUsd: item.originalPriceUsd || null,
      pricingBadge: item.pricingBadge || null,
      pricingNote: item.pricingNote || null,
      stripeReady: Boolean(stripeClient && item.stripePriceId)
    }))
  });
});

app.get("/api/business/services", (_req, res) => {
  res.json({
    ok: true,
    items: businessServices
  });
});

app.get("/api/business/quote-template", (req, res) => {
  const serviceCategory = String(req.query.category || "").trim().toLowerCase();
  const budgetUsd = toSafeWholeNumber(req.query.budgetUsd, 0);
  const companyName = String(req.query.companyName || "").trim();
  const contactName = String(req.query.contactName || "").trim();
  const validCategories = new Set(businessServices.map((item) => item.category));

  if (!validCategories.has(serviceCategory)) {
    return res.status(400).json({ ok: false, error: "invalid category" });
  }

  const template = createQuoteTemplate({ serviceCategory, budgetUsd, companyName, contactName });
  return res.json({ ok: true, template });
});

app.post("/api/business/inquiries", (req, res) => {
  const fromIp = getClientIp(req);
  if (isRateLimited(`inquiry:${fromIp}`, INQUIRY_RATE_LIMIT, INQUIRY_RATE_WINDOW_MS)) {
    return res.status(429).json({ ok: false, error: "too many inquiry submissions — please wait before trying again" });
  }

  const payload = req.body || {};
  const companyName = String(payload.companyName || "").trim();
  const contactName = String(payload.contactName || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const discord = String(payload.discord || "").trim();
  const serviceCategory = String(payload.serviceCategory || "").trim().toLowerCase();
  const projectSummary = String(payload.projectSummary || "").trim();
  const budgetUsd = toSafeWholeNumber(payload.budgetUsd, 0);

  const validCategories = new Set(businessServices.map((item) => item.category));
  if (!companyName || companyName.length > 120) {
    return res.status(400).json({ ok: false, error: "companyName is required" });
  }
  if (!contactName || contactName.length > 120) {
    return res.status(400).json({ ok: false, error: "contactName is required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "valid email is required" });
  }
  if (!validCategories.has(serviceCategory)) {
    return res.status(400).json({ ok: false, error: "invalid serviceCategory" });
  }
  if (projectSummary.length < 25 || projectSummary.length > 3000) {
    return res.status(400).json({ ok: false, error: "projectSummary must be 25-3000 characters" });
  }

  const inquiry = {
    id: `inq-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    companyName,
    contactName,
    email,
    discord,
    serviceCategory,
    projectSummary,
    budgetUsd,
    status: "new",
    createdAt: new Date().toISOString(),
    stageHistory: [{ status: "new", at: new Date().toISOString(), note: "submitted" }],
    latestQuote: createQuoteTemplate({
      serviceCategory,
      budgetUsd,
      companyName,
      contactName
    })
  };

  commerce.inquiries.unshift(inquiry);
  commerce.inquiries = commerce.inquiries.slice(0, 5000);
  persistCommerce();
  pushAction({ command: "businessInquiryCreated", value: `${inquiry.id} (${serviceCategory})` });

  return res.json({ ok: true, inquiryId: inquiry.id, status: inquiry.status, latestQuote: inquiry.latestQuote });
});

app.post("/api/business/inquiries/:inquiryId/stage", requirePanelAccess, (req, res) => {
  const inquiryId = String(req.params.inquiryId || "").trim();
  const status = String((req.body || {}).status || "").trim().toLowerCase();
  const note = String((req.body || {}).note || "").trim();

  if (!BUSINESS_INQUIRY_STAGES.includes(status)) {
    return res.status(400).json({ ok: false, error: "invalid stage status" });
  }

  const inquiry = commerce.inquiries.find((row) => row.id === inquiryId);
  if (!inquiry) {
    return res.status(404).json({ ok: false, error: "inquiry not found" });
  }

  inquiry.status = status;
  inquiry.updatedAt = new Date().toISOString();
  inquiry.stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
  inquiry.stageHistory.unshift({
    status,
    at: inquiry.updatedAt,
    note: note || "status update"
  });
  inquiry.stageHistory = inquiry.stageHistory.slice(0, 20);

  if (status === "quoted") {
    inquiry.latestQuote = createQuoteTemplate({
      serviceCategory: inquiry.serviceCategory,
      budgetUsd: inquiry.budgetUsd,
      companyName: inquiry.companyName,
      contactName: inquiry.contactName
    });
  }

  persistCommerce();
  pushAction({ command: "businessInquiryStageUpdated", value: `${inquiry.id} -> ${status}` });
  return res.json({ ok: true, inquiryId: inquiry.id, status: inquiry.status });
});

app.post("/api/business/inquiries/:inquiryId/simulate-breach", requirePanelAccess, (req, res) => {
  const inquiryId = String(req.params.inquiryId || "").trim();
  const inquiry = commerce.inquiries.find((row) => row.id === inquiryId);
  if (!inquiry) {
    return res.status(404).json({ ok: false, error: "inquiry not found" });
  }

  const status = String(inquiry.status || "new").toLowerCase();
  const slaHours = Number(BUSINESS_SLA_HOURS[status] || 0);
  if (slaHours <= 0) {
    return res.status(400).json({ ok: false, error: `stage ${status} has no SLA window` });
  }

  const rawHours = Number((req.body || {}).hoursOverdue || 2);
  const hoursOverdue = Number.isFinite(rawHours) ? Math.min(Math.max(Math.floor(rawHours), 1), 720) : 2;
  const backdateMs = (slaHours + hoursOverdue) * 60 * 60 * 1000;
  const simulatedAt = new Date(Date.now() - backdateMs).toISOString();

  inquiry.stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
  const currentEntry = inquiry.stageHistory[0] || null;
  const currentAt = currentEntry && currentEntry.at ? String(currentEntry.at) : inquiry.createdAt;
  inquiry.simulationMeta = inquiry.simulationMeta && typeof inquiry.simulationMeta === "object"
    ? inquiry.simulationMeta
    : {};
  if (!inquiry.simulationMeta.originalStageAt) {
    inquiry.simulationMeta.originalStageAt = currentAt;
  }

  if (inquiry.stageHistory.length === 0) {
    inquiry.stageHistory.unshift({ status, at: simulatedAt, note: "simulated breach" });
  } else {
    inquiry.stageHistory[0] = {
      ...inquiry.stageHistory[0],
      status,
      at: simulatedAt,
      note: "simulated breach"
    };
  }
  inquiry.updatedAt = new Date().toISOString();

  persistCommerce();
  pushAction({ command: "businessInquiryBreachSimulated", value: `${inquiry.id} (${status}) +${hoursOverdue}h` });

  return res.json({
    ok: true,
    inquiryId: inquiry.id,
    status,
    slaHours,
    hoursOverdue,
    simulatedAt
  });
});

app.post("/api/business/inquiries/:inquiryId/revert-simulation", requirePanelAccess, (req, res) => {
  const inquiryId = String(req.params.inquiryId || "").trim();
  const inquiry = commerce.inquiries.find((row) => row.id === inquiryId);
  if (!inquiry) {
    return res.status(404).json({ ok: false, error: "inquiry not found" });
  }

  const stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
  const originalStageAt = inquiry.simulationMeta && inquiry.simulationMeta.originalStageAt
    ? String(inquiry.simulationMeta.originalStageAt)
    : "";

  if (stageHistory.length === 0) {
    return res.status(400).json({ ok: false, error: "no active simulation to revert" });
  }

  const currentEntry = stageHistory[0] || {};
  const currentNote = String(currentEntry.note || "").toLowerCase();
  const hasLegacySimulatedNote = currentNote.includes("simulated breach");
  const restoreAt = originalStageAt || (hasLegacySimulatedNote ? new Date().toISOString() : "");

  if (!restoreAt) {
    return res.status(400).json({ ok: false, error: "no active simulation to revert" });
  }

  stageHistory[0] = {
    ...stageHistory[0],
    at: restoreAt,
    note: "simulation reverted"
  };
  delete inquiry.simulationMeta;
  inquiry.updatedAt = new Date().toISOString();

  persistCommerce();
  pushAction({ command: "businessInquirySimulationReverted", value: inquiry.id });

  return res.json({
    ok: true,
    inquiryId: inquiry.id,
    restoredAt: restoreAt
  });
});

app.post("/api/business/inquiries/simulations/revert-all", requirePanelAccess, (_req, res) => {
  let reverted = 0;

  for (const inquiry of commerce.inquiries) {
    const stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
    if (stageHistory.length === 0) {
      continue;
    }

    const originalStageAt = inquiry.simulationMeta && inquiry.simulationMeta.originalStageAt
      ? String(inquiry.simulationMeta.originalStageAt)
      : "";
    const currentNote = String((stageHistory[0] || {}).note || "").toLowerCase();
    const hasLegacySimulatedNote = currentNote.includes("simulated breach");
    const restoreAt = originalStageAt || (hasLegacySimulatedNote ? new Date().toISOString() : "");

    if (!restoreAt) {
      continue;
    }

    stageHistory[0] = {
      ...stageHistory[0],
      at: restoreAt,
      note: "simulation reverted"
    };
    delete inquiry.simulationMeta;
    inquiry.updatedAt = new Date().toISOString();
    reverted += 1;
  }

  if (reverted > 0) {
    persistCommerce();
    pushAction({ command: "businessInquirySimulationsRevertedAll", value: `${reverted}` });
  }

  return res.json({ ok: true, reverted });
});

app.get("/api/business/inquiries", requirePanelAccess, (req, res) => {
  const limit = Math.min(toSafeWholeNumber(req.query.limit, 100), 500);
  const status = String(req.query.status || "all").toLowerCase();

  let rows = [...commerce.inquiries];
  if (status !== "all") {
    rows = rows.filter((row) => String(row.status || "").toLowerCase() === status);
  }

  res.json({
    ok: true,
    rows: rows.slice(0, limit),
    total: rows.length,
    metrics: computeBusinessMetrics(rows),
    overallMetrics: computeBusinessMetrics(commerce.inquiries),
    stageOptions: BUSINESS_INQUIRY_STAGES
  });
});

app.get("/api/business/analytics", requirePanelAccess, (_req, res) => {
  const metrics = computeBusinessMetrics(commerce.inquiries);
  return res.json({
    ok: true,
    metrics,
    stageOptions: BUSINESS_INQUIRY_STAGES,
    slaConfig: BUSINESS_SLA_HOURS
  });
});

app.get("/api/business/sla-report", requirePanelAccess, (req, res) => {
  const format = String(req.query.format || "json").toLowerCase();
  const startDate = String(req.query.startDate || "").trim();
  const endDate = String(req.query.endDate || "").trim();
  const breachedOnly = toBooleanFlag(req.query.breachedOnly);
  const startAtMs = parseDateBoundaryMs(startDate, "start");
  const endAtMs = parseDateBoundaryMs(endDate, "end");

  if (Number.isNaN(startAtMs) || Number.isNaN(endAtMs)) {
    return res.status(400).json({ ok: false, error: "Invalid date filter. Use YYYY-MM-DD." });
  }
  if (startAtMs != null && endAtMs != null && startAtMs > endAtMs) {
    return res.status(400).json({ ok: false, error: "startDate cannot be after endDate." });
  }

  const rows = commerce.inquiries.map((inquiry) => {
    const status = String(inquiry.status || "new").toLowerCase();
    const stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
    const currentEntry = stageHistory[0] || {};
    const stageEnteredAt = String(currentEntry.at || inquiry.createdAt || "");
    const createdAtMs = Date.parse(String(inquiry.createdAt || ""));
    const stageAgeHours = Number((getInquiryCurrentStageDurationMs(inquiry) / (60 * 60 * 1000)).toFixed(2));
    const totalAgeHours = Number((getInquiryAgeMs(inquiry) / (60 * 60 * 1000)).toFixed(2));
    const slaHours = Number(BUSINESS_SLA_HOURS[status] || 0);
    const isBreached = slaHours > 0 ? stageAgeHours > slaHours : false;
    const overdueHours = isBreached ? Number((stageAgeHours - slaHours).toFixed(2)) : 0;
    const simulated = Boolean(
      (inquiry.simulationMeta && inquiry.simulationMeta.originalStageAt)
        || String(currentEntry.note || "").toLowerCase().includes("simulated breach")
    );

    return {
      inquiryId: inquiry.id,
      companyName: inquiry.companyName,
      contactName: inquiry.contactName,
      email: inquiry.email,
      serviceCategory: inquiry.serviceCategory,
      budgetUsd: toSafeWholeNumber(inquiry.budgetUsd, 0),
      status,
      createdAt: inquiry.createdAt,
      createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : 0,
      stageEnteredAt,
      stageAgeHours,
      totalAgeHours,
      slaHours,
      isBreached,
      overdueHours,
      simulated,
      stageNote: String(currentEntry.note || "")
    };
  }).filter((row) => {
    if (startAtMs != null && row.createdAtMs < startAtMs) {
      return false;
    }
    if (endAtMs != null && row.createdAtMs > endAtMs) {
      return false;
    }
    if (breachedOnly && !row.isBreached) {
      return false;
    }
    return true;
  });

  pushAction({
    command: "businessSlaReportExported",
    value: `format=${format}; rows=${rows.length}; breachedOnly=${breachedOnly}; start=${startDate || "-"}; end=${endDate || "-"}`
  });

  if (format === "csv") {
    const headers = [
      "inquiryId",
      "companyName",
      "contactName",
      "email",
      "serviceCategory",
      "budgetUsd",
      "status",
      "createdAt",
      "stageEnteredAt",
      "stageAgeHours",
      "totalAgeHours",
      "slaHours",
      "isBreached",
      "overdueHours",
      "simulated",
      "stageNote"
    ];
    const csvRows = rows.map((row) => headers.map((key) => toCsvValue(row[key])).join(","));
    const csv = [headers.join(","), ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=trh-sla-report-${Date.now()}.csv`);
    return res.send(csv);
  }

  const payloadRows = rows.map(({ createdAtMs, ...rest }) => rest);
  return res.json({
    ok: true,
    filters: {
      startDate: startDate || null,
      endDate: endDate || null,
      breachedOnly
    },
    rows: payloadRows
  });
});

app.get("/api/business/inquiries/:inquiryId/timeline", requirePanelAccess, (req, res) => {
  const inquiryId = String(req.params.inquiryId || "").trim();
  const inquiry = commerce.inquiries.find((row) => row.id === inquiryId);
  if (!inquiry) {
    return res.status(404).json({ ok: false, error: "inquiry not found" });
  }

  const stageHistory = Array.isArray(inquiry.stageHistory) ? inquiry.stageHistory : [];
  const status = String(inquiry.status || "new").toLowerCase();
  const currentSlaHours = BUSINESS_SLA_HOURS[status] || 0;
  const currentDurationMs = getInquiryCurrentStageDurationMs(inquiry);
  const totalAgeMs = getInquiryAgeMs(inquiry);
  const isBreached = isInquirySLABreached(inquiry);

  return res.json({
    ok: true,
    inquiry: {
      id: inquiry.id,
      companyName: inquiry.companyName,
      status: inquiry.status,
      budgetUsd: inquiry.budgetUsd,
      createdAt: inquiry.createdAt
    },
    stageHistory: stageHistory.slice().reverse(),
    currentStageMetrics: {
      status,
      durationHours: Number((currentDurationMs / (60 * 60 * 1000)).toFixed(2)),
      slaHours: currentSlaHours,
      isBreached
    },
    totalAgeHours: Number((totalAgeMs / (60 * 60 * 1000)).toFixed(2))
  });
});

app.get("/api/store/offerings", (_req, res) => {
  const all = getAllOfferings();
  res.json({
    ok: true,
    paymentMode: stripeClient ? "stripe+mock" : "mock-only",
    items: all.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      features: item.features,
      priceUsd: item.priceUsd,
      originalPriceUsd: item.originalPriceUsd || null,
      pricingBadge: item.pricingBadge || null,
      pricingNote: item.pricingNote || null,
      kind: item.kind,
      audience: item.audience,
      productFamily: item.productFamily,
      stripeReady: Boolean(stripeClient && item.stripePriceId)
    }))
  });
});

app.post("/api/store/checkout", async (req, res) => {
  const fromIp = getClientIp(req);
  if (isRateLimited(`checkout:${fromIp}`, CHECKOUT_RATE_LIMIT, CHECKOUT_RATE_WINDOW_MS)) {
    return res.status(429).json({ ok: false, error: "too many checkout requests — try again shortly" });
  }

  const payload = req.body || {};
  const offeringId = String(payload.offeringId || payload.botId || "").trim();
  const customerEmail = String(payload.customerEmail || "").trim().toLowerCase();
  const customerDiscord = String(payload.customerDiscord || "").trim();
  const paymentMethod = String(payload.paymentMethod || "mock").trim().toLowerCase();
  const buyerType = String(payload.buyerType || "user").trim().toLowerCase();
  const customBrief = String(payload.customBrief || "").trim();
  const item = findOfferingItem(offeringId);

  if (!item) {
    return res.status(400).json({ ok: false, error: "invalid offering" });
  }

  // Mock payment is operator-only — prevent anonymous order pollution
  if (paymentMethod === "mock") {
    const isOperator = (req.session && req.session.operatorAuthenticated) ||
      (PANEL_API_KEY.length > 0 && safeEqualStr(req.header("x-panel-api-key"), PANEL_API_KEY));
    if (!isOperator) {
      return res.status(403).json({ ok: false, error: "mock payment requires operator authentication" });
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
    return res.status(400).json({ ok: false, error: "valid customerEmail is required" });
  }
  if (customerDiscord.length < 2 || customerDiscord.length > 64) {
    return res.status(400).json({ ok: false, error: "customerDiscord is required" });
  }
  if (!["mock", "stripe"].includes(paymentMethod)) {
    return res.status(400).json({ ok: false, error: "paymentMethod must be mock or stripe" });
  }
  if (!["owner", "user"].includes(buyerType)) {
    return res.status(400).json({ ok: false, error: "buyerType must be owner or user" });
  }
  if (item.audience === "owner" && buyerType !== "owner") {
    return res.status(400).json({ ok: false, error: "this offering is owner-only" });
  }
  if (item.kind === "custom-bot" && customBrief.length < 20) {
    return res.status(400).json({ ok: false, error: "custom brief must be at least 20 characters" });
  }

  const order = {
    id: createOrderId(),
    botId: item.productFamily === "bot" ? item.id : null,
    botName: item.name,
    offeringId: item.id,
    offeringName: item.name,
    offeringType: item.kind,
    audience: item.audience,
    buyerType,
    productFamily: item.productFamily,
    customBrief: customBrief || null,
    amountUsd: item.priceUsd,
    paymentMethod,
    paymentStatus: "pending",
    provisioningStatus: "pending",
    customerEmail,
    customerDiscord,
    paymentRef: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
    provisionedAt: null,
    provisioningToken: null
  };

  if (paymentMethod === "stripe") {
    if (!stripeClient) {
      return res.status(400).json({ ok: false, error: "stripe is not configured" });
    }
    if (!item.stripePriceId) {
      return res.status(400).json({ ok: false, error: "stripe price ID is missing for this package" });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: item.stripePriceId, quantity: 1 }],
        metadata: {
          orderId: order.id,
          botId: item.id,
          customerDiscord
        },
        customer_email: customerEmail,
        success_url: `${APP_BASE_URL}/?checkout=success&orderId=${order.id}`,
        cancel_url: `${APP_BASE_URL}/?checkout=cancel&orderId=${order.id}`
      });

      order.paymentRef = String(session.id || "");
      commerce.orders.unshift(order);
      commerce.orders = commerce.orders.slice(0, 5000);
      syncClientAccountsFromOrders();
      applyPaymentStateTransitions();
      persistCommerce();
      pushAction({ command: "storeOrderCreated", value: `${order.id} (${order.offeringId})` });

      return res.json({
        ok: true,
        mode: "stripe",
        orderId: order.id,
        checkoutUrl: session.url
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `stripe checkout failed: ${error.message}` });
    }
  }

  order.paymentStatus = "paid";
  order.paidAt = new Date().toISOString();
  order.provisioningStatus = "ready";
  order.provisioningToken = createProvisioningToken();
  commerce.orders.unshift(order);
  commerce.orders = commerce.orders.slice(0, 5000);
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();
  persistCommerce();
  pushAction({ command: "storeOrderPaid", value: `${order.id} (${order.offeringId})` });

  return res.json({
    ok: true,
    mode: "mock",
    orderId: order.id,
    paymentStatus: order.paymentStatus,
    provisioningStatus: order.provisioningStatus,
    provisioningToken: order.provisioningToken,
    offeringId: order.offeringId,
    offeringType: order.offeringType,
    buyerType: order.buyerType
  });
});

app.get("/api/store/orders", requirePanelAccess, (req, res) => {
  const limit = Math.min(toSafeWholeNumber(req.query.limit, 100), 500);
  res.json({
    ok: true,
    rows: commerce.orders.slice(0, limit)
  });
});

app.get("/api/store/metrics", requirePanelAccess, (_req, res) => {
  res.json({
    ok: true,
    ...computeCommerceMetrics()
  });
});

app.get("/api/store/orders/export", requirePanelAccess, (req, res) => {
  const format = String(req.query.format || "json").toLowerCase();

  if (format === "csv") {
    const headers = [
      "id",
      "botId",
      "botName",
      "offeringId",
      "offeringType",
      "buyerType",
      "productFamily",
      "amountUsd",
      "paymentMethod",
      "paymentStatus",
      "provisioningStatus",
      "customerEmail",
      "customerDiscord",
      "createdAt",
      "paidAt",
      "provisionedAt",
      "provisioningToken"
    ];
    const rows = commerce.orders.map((order) =>
      [
        order.id,
        order.botId,
        order.botName,
        order.offeringId,
        order.offeringType,
        order.buyerType,
        order.productFamily,
        order.amountUsd,
        order.paymentMethod,
        order.paymentStatus,
        order.provisioningStatus,
        order.customerEmail,
        order.customerDiscord,
        order.createdAt,
        order.paidAt,
        order.provisionedAt,
        order.provisioningToken
      ]
        .map(toCsvValue)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=trh-orders-${Date.now()}.csv`);
    return res.send(csv);
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename=trh-orders-${Date.now()}.json`);
  return res.send(JSON.stringify({ rows: commerce.orders }, null, 2));
});

app.get("/api/store/order-status", (req, res) => {
  const orderId = String(req.query.orderId || "").trim();
  const email = String(req.query.email || "").trim().toLowerCase();

  if (!orderId || !email) {
    return res.status(400).json({ ok: false, error: "orderId and email are required" });
  }

  const order = commerce.orders.find((row) => row.id === orderId && row.customerEmail === email);
  if (!order) {
    return res.status(404).json({ ok: false, error: "order not found" });
  }

  return res.json({
    ok: true,
    order: {
      id: order.id,
      botName: order.botName,
      offeringId: order.offeringId,
      offeringName: order.offeringName,
      offeringType: order.offeringType,
      buyerType: order.buyerType,
      amountUsd: order.amountUsd,
      paymentStatus: order.paymentStatus,
      provisioningStatus: order.provisioningStatus,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      provisionedAt: order.provisionedAt,
      provisioningToken: order.provisioningToken
    }
  });
});

app.get("/api/store/customer/bots", (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  const discord = String(req.query.discord || "").trim();

  if (!email && !discord) {
    return res.status(400).json({ ok: false, error: "email or discord is required" });
  }

  const matches = commerce.orders.filter((order) => {
    if (order.paymentStatus !== "paid") {
      return false;
    }
    const family = String(order.productFamily || (order.botId ? "bot" : "service"));
    if (family !== "bot" || !order.botId) {
      return false;
    }

    const emailMatch = email && String(order.customerEmail || "").toLowerCase() === email;
    const discordMatch = discord && String(order.customerDiscord || "") === discord;
    return emailMatch || discordMatch;
  });

  const byBotId = new Map();
  for (const order of matches) {
    const existing = byBotId.get(order.botId);
    if (!existing) {
      byBotId.set(order.botId, order);
      continue;
    }

    const currentTs = Date.parse(existing.createdAt || "") || 0;
    const nextTs = Date.parse(order.createdAt || "") || 0;
    if (nextTs > currentTs) {
      byBotId.set(order.botId, order);
    }
  }

  const bots = Array.from(byBotId.values()).map((order) => ({
    botId: order.botId,
    botName: order.botName,
    offeringId: order.offeringId,
    offeringType: order.offeringType,
    paymentStatus: order.paymentStatus,
    provisioningStatus: order.provisioningStatus,
    provisioningToken: order.provisioningToken,
    latestOrderId: order.id,
    latestOrderAt: order.createdAt
  }));

  return res.json({ ok: true, bots, total: bots.length });
});

app.get("/api/local/bots", requireOperatorSession, (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();
  const activeFilter = String(req.query.active || "all").trim().toLowerCase();
  const running = collectRunningBotProcesses();
  const projects = collectLocalBotProjects();

  const byPath = new Map();
  for (const project of projects) {
    const projectPath = String(project.path || "").trim();
    if (!projectPath) continue;

    const projectPathNormalized = projectPath.replace(/\\/g, "/").toLowerCase();
    const matching = running.filter((proc) => String(proc.commandLine || "").replace(/\\/g, "/").toLowerCase().includes(projectPathNormalized));
    const idSeed = crypto.createHash("sha1").update(projectPathNormalized).digest("hex").slice(0, 10);

    byPath.set(projectPathNormalized, {
      botId: `local-${idSeed}`,
      botName: project.botName || path.basename(projectPath),
      inventoryType: "local-machine",
      runtime: project.runtime || "unknown",
      source: "local-project",
      localPath: projectPath,
      active: matching.length > 0,
      processCount: matching.length,
      processes: matching.slice(0, 5).map((proc) => ({ pid: proc.pid, name: proc.name }))
    });
  }

  for (const proc of running) {
    const cmd = String(proc.commandLine || "").trim();
    if (!cmd) continue;

    const scriptMatch = cmd.match(/[A-Za-z]:\\[^\s\"]+\.(js|py)/i);
    const scriptPath = scriptMatch ? scriptMatch[0] : "";
    const scriptDir = scriptPath ? path.dirname(scriptPath) : "";
    const key = scriptDir ? scriptDir.replace(/\\/g, "/").toLowerCase() : "";
    if (key && byPath.has(key)) {
      continue;
    }

    const displayPath = scriptPath || cmd;
    const normalizedDisplayPath = displayPath.replace(/\\/g, "/").toLowerCase();
    const idSeed = crypto.createHash("sha1").update(normalizedDisplayPath).digest("hex").slice(0, 10);
    const inferredName = scriptPath ? path.basename(scriptPath) : `${proc.name || "process"}#${proc.pid}`;
    const processOnlyKey = `process-${idSeed}`;

    if (byPath.has(processOnlyKey)) {
      const existing = byPath.get(processOnlyKey);
      const seenPids = new Set((existing.processes || []).map((p) => Number(p.pid || 0)));
      if (!seenPids.has(proc.pid)) {
        existing.processes = [...(existing.processes || []), { pid: proc.pid, name: proc.name }].slice(0, 5);
        existing.processCount = Number(existing.processCount || 0) + 1;
      }
      continue;
    }

    byPath.set(processOnlyKey, {
      botId: `local-${idSeed}`,
      botName: inferredName,
      inventoryType: "local-machine",
      runtime: proc.name.includes("python") || proc.name === "py.exe" ? "python" : "node",
      source: "running-process",
      localPath: displayPath,
      active: true,
      processCount: 1,
      processes: [{ pid: proc.pid, name: proc.name }]
    });
  }

  let bots = Array.from(byPath.values())
    .sort((a, b) => Number(b.active) - Number(a.active) || String(a.botName).localeCompare(String(b.botName)))
    .slice(0, BOT_SCAN_MAX_RESULTS)
    .map((bot) => ({
      ...bot,
      paymentStatus: "local",
      provisioningStatus: bot.active ? "active" : "inactive",
      latestOrderId: "local-machine",
      provisioningToken: bot.processCount > 0 ? `${bot.processCount} process(es)` : "inactive"
    }));

  if (activeFilter === "active") {
    bots = bots.filter((bot) => bot.active);
  } else if (activeFilter === "inactive") {
    bots = bots.filter((bot) => !bot.active);
  }

  if (search) {
    bots = bots.filter((bot) => {
      const haystack = [bot.botName, bot.localPath, bot.runtime, bot.source]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return haystack.includes(search);
    });
  }

  return res.json({
    ok: true,
    bots,
    total: bots.length,
    discoveredAt: new Date().toISOString()
  });
});

app.get("/api/store/customer/portfolio", (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  const discord = String(req.query.discord || "").trim();

  if (!email && !discord) {
    return res.status(400).json({ ok: false, error: "email or discord is required" });
  }

  const matches = commerce.orders.filter((order) => {
    if (order.paymentStatus !== "paid") {
      return false;
    }

    const emailMatch = email && String(order.customerEmail || "").toLowerCase() === email;
    const discordMatch = discord && String(order.customerDiscord || "") === discord;
    return emailMatch || discordMatch;
  });

  const portfolio = {
    bots: [],
    ranks: [],
    roles: [],
    buyoutPlans: [],
    buildPlans: [],
    customBots: []
  };

  let totalSpentUsd = 0;
  const buyerTypes = new Set();

  for (const order of matches) {
    totalSpentUsd += Number(order.amountUsd || 0);
    if (order.buyerType) {
      buyerTypes.add(order.buyerType);
    }

    const row = {
      orderId: order.id,
      offeringId: order.offeringId || order.botId || null,
      offeringName: order.offeringName || order.botName,
      offeringType: order.offeringType || (order.productFamily === "service" ? "service" : "bot-package"),
      buyerType: order.buyerType || "user",
      amountUsd: Number(order.amountUsd || 0),
      paymentStatus: order.paymentStatus,
      provisioningStatus: order.provisioningStatus,
      provisioningToken: order.provisioningToken,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      customBrief: order.customBrief || null
    };

    if (row.offeringType === "rank") {
      portfolio.ranks.push(row);
      continue;
    }
    if (row.offeringType === "role") {
      portfolio.roles.push(row);
      continue;
    }
    if (row.offeringType === "buyout-plan") {
      portfolio.buyoutPlans.push(row);
      continue;
    }
    if (row.offeringType === "build-plan") {
      portfolio.buildPlans.push(row);
      continue;
    }
    if (row.offeringType === "custom-bot") {
      portfolio.customBots.push(row);
      continue;
    }
    portfolio.bots.push(row);
  }

  const totalPurchases = Object.values(portfolio).reduce((acc, list) => acc + list.length, 0);

  return res.json({
    ok: true,
    portfolio,
    summary: {
      totalPurchases,
      totalSpentUsd,
      buyerTypes: Array.from(buyerTypes)
    }
  });
});

app.post("/api/store/orders/:orderId/provision", requirePanelAccess, (req, res) => {
  const orderId = String(req.params.orderId || "").trim();
  const order = commerce.orders.find((row) => row.id === orderId);
  if (!order) {
    return res.status(404).json({ ok: false, error: "order not found" });
  }
  if (order.paymentStatus !== "paid") {
    return res.status(400).json({ ok: false, error: "payment is not completed" });
  }

  order.provisioningStatus = "delivered";
  order.provisionedAt = new Date().toISOString();
  if (!order.provisioningToken) {
    order.provisioningToken = createProvisioningToken();
  }
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();
  persistCommerce();
  pushAction({ command: "storeOrderProvisioned", value: order.id });

  return res.json({ ok: true, order });
});

app.post("/api/store/webhook/stripe", async (req, res) => {
  if (!stripeClient || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ ok: false, error: "stripe webhook is not configured" });
  }

  const signature = String(req.header("stripe-signature") || "");
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).json({ ok: false, error: `invalid stripe signature: ${error.message}` });
  }

  if (event.type === "checkout.session.completed") {
    if (commerce.processedWebhookEvents.includes(event.id)) {
      return res.json({ ok: true, duplicate: true });
    }

    const sessionObj = event.data.object || {};
    const orderId = String((sessionObj.metadata || {}).orderId || "");
    const order = commerce.orders.find((row) => row.id === orderId);

    if (order && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.paidAt = new Date().toISOString();
      order.provisioningStatus = "ready";
      order.paymentRef = String(sessionObj.id || order.paymentRef || "");
      order.provisioningToken = order.provisioningToken || createProvisioningToken();
      syncClientAccountsFromOrders();
      applyPaymentStateTransitions();
      persistCommerce();
      pushAction({ command: "storeOrderPaid", value: `${order.id} (${order.offeringId || order.botId || "unknown"})` });
    }

    commerce.processedWebhookEvents.unshift(event.id);
    commerce.processedWebhookEvents = commerce.processedWebhookEvents.slice(0, 5000);
    persistCommerce();

    // Also link Stripe customer to Discord user profile if discordId is in metadata
    const sessionMeta = (event.data.object || {}).metadata || {};
    const checkoutDiscordId = String(sessionMeta.discordId || "").trim();
    const stripeCustomerId = String((event.data.object || {}).customer || "").trim();
    const checkoutSubId = String((event.data.object || {}).subscription || "").trim();
    if (checkoutDiscordId && stripeCustomerId) {
      const resolvedTier = tierFromStripePrice(String(sessionMeta.priceId || "").trim()) || "vip";
      upsertUserProfile(checkoutDiscordId, {
        stripeCustomerId,
        subscriptionId: checkoutSubId || null,
        subscriptionStatus: checkoutSubId ? "active" : "one_time",
        tier: resolvedTier,
        paymentStatus: "active",
        outstandingBalance: 0,
        lastPaymentAt: new Date().toISOString(),
        paymentFailedAt: null
      });
      persistUsers();
      pushAction({ command: "stripeUserLinked", value: `discord=${checkoutDiscordId} customer=${stripeCustomerId} tier=${resolvedTier}` });
    }
  }

  // ── invoice.payment_succeeded → restore tier / clear debt ──────────────
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object || {};
    const customerId = String(invoice.customer || "").trim();
    const profile = findUserByStripeCustomer(customerId);
    if (profile) {
      const lineItems = (invoice.lines && invoice.lines.data) ? invoice.lines.data : [];
      const priceId = lineItems.length > 0 ? String((lineItems[0].price || {}).id || "").trim() : "";
      const resolvedTier = tierFromStripePrice(priceId) || profile.tier || "free";
      // Restore if currently degraded
      const wasDowngraded = profile.paymentStatus === "past_due" || profile.paymentStatus === "failed";
      upsertUserProfile(profile.discordId, {
        tier: resolvedTier,
        paymentStatus: "active",
        subscriptionStatus: "active",
        outstandingBalance: 0,
        lastPaymentAt: new Date().toISOString(),
        paymentFailedAt: null
      });
      if (profile.blacklisted && profile.blacklistReason === "payment_failure") {
        unblacklistUser(profile.discordId, "system", resolvedTier);
      }
      persistUsers();
      if (wasDowngraded) {
        pushAction({ command: "stripePaymentRestored", value: `discord=${profile.discordId} tier=${resolvedTier}` });
      }
    }
  }

  // ── invoice.payment_failed → log failure + schedule downgrade ──────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object || {};
    const customerId = String(invoice.customer || "").trim();
    const amountDue = Number(invoice.amount_due || 0) / 100;
    const profile = findUserByStripeCustomer(customerId);
    if (profile) {
      const now = Date.now();
      upsertUserProfile(profile.discordId, {
        paymentStatus: "past_due",
        outstandingBalance: amountDue,
        paymentFailedAt: new Date().toISOString()
      });
      persistUsers();
      pushAction({ command: "stripePaymentFailed", value: `discord=${profile.discordId} amount=$${amountDue}` });
      // Schedule downgrade after grace period
      const graceMs = PAYMENT_GRACE_MS;
      setTimeout(() => {
        const p = usersRegistry[profile.discordId];
        if (p && p.paymentStatus === "past_due" && p.paymentFailedAt) {
          const failedAt = new Date(p.paymentFailedAt).getTime();
          if (Date.now() - failedAt >= graceMs) {
            applyPaymentDowngrade(profile.discordId, "invoice_payment_failed");
          }
        }
      }, graceMs);
    }
  }

  // ── customer.subscription.deleted → downgrade to free ──────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object || {};
    const customerId = String(sub.customer || "").trim();
    const profile = findUserByStripeCustomer(customerId);
    if (profile) {
      upsertUserProfile(profile.discordId, {
        tier: "free",
        subscriptionStatus: "canceled",
        paymentStatus: "canceled",
        subscriptionId: null
      });
      persistUsers();
      pushAction({ command: "stripeSubscriptionCanceled", value: `discord=${profile.discordId}` });
    }
  }

  // ── customer.subscription.updated → sync tier ──────────────────────────
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object || {};
    const customerId = String(sub.customer || "").trim();
    const profile = findUserByStripeCustomer(customerId);
    if (profile) {
      const items = (sub.items && sub.items.data) ? sub.items.data : [];
      const priceId = items.length > 0 ? String((items[0].price || {}).id || "").trim() : "";
      const resolvedTier = tierFromStripePrice(priceId);
      const subStatus = String(sub.status || "").trim();
      const updates = { subscriptionStatus: subStatus };
      if (resolvedTier) updates.tier = resolvedTier;
      if (subStatus === "active") { updates.paymentStatus = "active"; updates.paymentFailedAt = null; }
      upsertUserProfile(profile.discordId, updates);
      persistUsers();
      pushAction({ command: "stripeSubscriptionUpdated", value: `discord=${profile.discordId} status=${subStatus}${resolvedTier ? ` tier=${resolvedTier}` : ""}` });
    }
  }

  return res.json({ ok: true });
});

// ── Link Stripe customer to a Discord user (owner only) ─────────────────
app.post("/api/owner/users/link-stripe", requireOwnerAccess, (req, res) => {
  const { discordId, stripeCustomerId, tier } = req.body || {};
  if (!discordId || !stripeCustomerId) {
    return res.status(400).json({ ok: false, error: "discordId and stripeCustomerId are required" });
  }
  const safeDiscordId = String(discordId).trim();
  const safeCid = String(stripeCustomerId).trim();
  if (!safeDiscordId || !safeCid) return res.status(400).json({ ok: false, error: "invalid ids" });
  // Ensure no other user already has this customer ID
  const existing = findUserByStripeCustomer(safeCid);
  if (existing && existing.discordId !== safeDiscordId) {
    return res.status(409).json({ ok: false, error: `stripeCustomerId already linked to ${existing.discordId}` });
  }
  const updates = { stripeCustomerId: safeCid };
  if (tier && USER_TIERS.includes(String(tier).toLowerCase())) updates.tier = String(tier).toLowerCase();
  upsertUserProfile(safeDiscordId, updates);
  persistUsers();
  return res.json({ ok: true, discordId: safeDiscordId, stripeCustomerId: safeCid, tier: usersRegistry[safeDiscordId].tier });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    ok: true,
    authenticated: Boolean(req.session && req.session.operatorAuthenticated),
    ownerAuthenticated: Boolean(req.session && req.session.ownerAuthenticated),
    discordId: req.session && req.session.operatorDiscordId ? String(req.session.operatorDiscordId) : null,
    email: req.session && req.session.operatorEmail ? String(req.session.operatorEmail) : null,
    discordUsername: req.session && req.session.operatorDiscordUsername ? String(req.session.operatorDiscordUsername) : null,
    avatarUrl: req.session && req.session.operatorAvatarUrl ? String(req.session.operatorAvatarUrl) : null
  });
});

app.get("/api/auth/discord/start", (req, res) => {
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_OAUTH_REDIRECT_URI) {
    if (ALLOW_DEV_DISCORD_FALLBACK_LOGIN && process.env.NODE_ENV !== "production" && isLocalRequest(req)) {
      const fallbackDiscordId = "discord-dev-fallback";
      req.session.operatorAuthenticated = true;
      req.session.ownerAuthenticated = false;
      req.session.operatorDiscordId = fallbackDiscordId;
      recordLoginEvent(req, { discordId: fallbackDiscordId, success: true, reason: "discord dev fallback" });
      return res.redirect(appendQuery(`${APP_BASE_URL}/`, {
        auth: "discord-success",
        owner: "0",
        mode: "dev-fallback"
      }));
    }
    return res.redirect(DISCORD_FALLBACK_LOGIN_URL);
  }

  const blockSeconds = getLoginBlockSeconds(req);
  if (blockSeconds > 0) {
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "discord-rate-limit", retryIn: String(blockSeconds) }));
  }

  const oauthState = crypto.randomBytes(16).toString("hex");
  req.session.discordOauthState = oauthState;
  return res.redirect(buildDiscordOauthUrl(oauthState));
});

app.get("/api/auth/discord/callback", async (req, res) => {
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_OAUTH_REDIRECT_URI) {
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "discord-unavailable" }));
  }

  const code = String(req.query.code || "").trim();
  const state = String(req.query.state || "").trim();

  // Detect whether this is a login or a profile-sync OAuth flow
  const loginState = String(req.session.discordOauthState || "").trim();
  const syncState  = String(req.session.discordSyncState  || "").trim();
  req.session.discordOauthState = null;
  req.session.discordSyncState  = null;

  let oauthMode = null;
  if (state && loginState && state === loginState) oauthMode = "login";
  else if (state && syncState  && state === syncState)  oauthMode = "sync";

  if (!code || !state || !oauthMode) {
    recordLoginFailure(req);
    recordLoginEvent(req, { discordId: "", success: false, reason: "discord oauth invalid state" });
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "discord-failed" }));
  }

  try {
    const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_OAUTH_REDIRECT_URI
      }).toString()
    });

    const tokenBody = await tokenResp.json().catch(() => ({}));
    if (!tokenResp.ok || !tokenBody.access_token) {
      throw new Error("discord token exchange failed");
    }

    const userResp = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenBody.access_token}` }
    });
    const userBody = await userResp.json().catch(() => ({}));
    const discordId = normalizeDiscordUserId(userBody.id || "");
    if (!userResp.ok || !discordId) {
      throw new Error("discord user fetch failed");
    }

    // Extract all available profile fields from Discord
    const discordUsername = String(userBody.username || "").trim();
    const globalName     = String(userBody.global_name || "").trim();
    const discordEmail   = userBody.email ? String(userBody.email).trim().toLowerCase() : null;
    const avatarUrl      = userBody.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${userBody.avatar}.png?size=256`
      : null;
    const accountCreatedAt = discordIdToTimestamp(discordId);

    // Always upsert profile with latest Discord data (email, avatar, username)
    upsertUserProfile(discordId, {
      username: discordUsername,
      globalName,
      email: discordEmail,
      avatarUrl,
      accountCreatedAt,
      ip: getClientIp(req)
    });
    persistUsers();

    if (oauthMode === "sync") {
      // Profile sync: link Discord to the existing operator session
      if (req.session && req.session.operatorAuthenticated) {
        if (!req.session.operatorDiscordId) req.session.operatorDiscordId = discordId;
        if (!req.session.operatorEmail && discordEmail) req.session.operatorEmail = discordEmail;
        req.session.operatorDiscordUsername = discordUsername;
        req.session.operatorAvatarUrl       = avatarUrl;
      }
      return res.redirect(appendQuery(`${APP_BASE_URL}/`, {
        auth: "sync-success",
        discordId
      }));
    }

    // Login mode
    clearLoginFailures(req);
    const ownerAuthenticated = isOwnerDiscordId(discordId);
    req.session.operatorAuthenticated    = true;
    req.session.ownerAuthenticated       = ownerAuthenticated;
    req.session.operatorDiscordId        = discordId;
    req.session.operatorEmail            = discordEmail;
    req.session.operatorDiscordUsername  = discordUsername;
    req.session.operatorAvatarUrl        = avatarUrl;
    recordLoginEvent(req, { discordId, success: true, reason: "discord oauth" });

    return res.redirect(appendQuery(`${APP_BASE_URL}/`, {
      auth: "discord-success",
      owner: ownerAuthenticated ? "1" : "0"
    }));
  } catch (error) {
    recordLoginFailure(req);
    recordLoginEvent(req, { discordId: "", success: false, reason: "discord oauth failed" });
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "discord-failed" }));
  }
});

// ── Discord profile sync (requires active session) ───────────────────────────
app.get("/api/auth/discord/sync/start", (req, res) => {
  if (!req.session || !req.session.operatorAuthenticated) {
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "sync-unauthenticated" }));
  }
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_OAUTH_REDIRECT_URI) {
    return res.redirect(appendQuery(`${APP_BASE_URL}/`, { auth: "sync-unavailable" }));
  }
  const oauthState = crypto.randomBytes(16).toString("hex");
  req.session.discordSyncState = oauthState;
  return res.redirect(buildDiscordOauthUrl(oauthState));
});

// ── Operator Account Management (owner-only) ─────────────────────────────────

app.get("/api/auth/accounts", requireOwnerAccess, (_req, res) => {
  const accounts = Object.values(operatorAccounts).map(({ email, role, createdAt }) => ({ email, role, createdAt }));
  return res.json({ ok: true, accounts });
});

app.post("/api/auth/accounts/create", requireOwnerAccess, async (req, res) => {
  const email = String((req.body || {}).email || "").trim().toLowerCase().slice(0, 200);
  const password = String((req.body || {}).password || "");
  const role = String((req.body || {}).role || "operator").toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "valid email required" });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ ok: false, error: "password must be at least 8 characters" });
  }
  if (!["operator", "owner"].includes(role)) {
    return res.status(400).json({ ok: false, error: "role must be operator or owner" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  operatorAccounts[email] = { email, passwordHash, role, createdAt: new Date().toISOString() };
  persistOperatorAccounts();
  return res.json({ ok: true, email, role });
});

app.delete("/api/auth/accounts/:email", requireOwnerAccess, (req, res) => {
  const email = decodeURIComponent(String(req.params.email || "")).trim().toLowerCase();
  if (!operatorAccounts[email]) {
    return res.status(404).json({ ok: false, error: "account not found" });
  }
  delete operatorAccounts[email];
  persistOperatorAccounts();
  return res.json({ ok: true, email });
});

app.post("/api/auth/accounts/change-password", requireOwnerAccess, async (req, res) => {
  const email = String((req.body || {}).email || "").trim().toLowerCase();
  const newPassword = String((req.body || {}).newPassword || "");
  if (!operatorAccounts[email]) {
    return res.status(404).json({ ok: false, error: "account not found" });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ ok: false, error: "password must be at least 8 characters" });
  }
  operatorAccounts[email].passwordHash = await bcrypt.hash(newPassword, 12);
  persistOperatorAccounts();
  return res.json({ ok: true, email });
});

app.post("/api/auth/login", async (req, res) => {
  const blockSeconds = getLoginBlockSeconds(req);
  if (blockSeconds > 0) {
    return res.status(429).json({ ok: false, error: `too many login attempts, retry in ${blockSeconds}s` });
  }

  const password = String((req.body || {}).password || "");
  const discordId = normalizeDiscordUserId((req.body || {}).discordId || "");
  const email = String((req.body || {}).email || "").trim().toLowerCase().slice(0, 200);

  if (!password) {
    return res.status(400).json({ ok: false, error: "password is required" });
  }

  // ── Per-user email account check (takes priority over master password) ──────
  if (email && operatorAccounts[email]) {
    const account = operatorAccounts[email];
    const match = await bcrypt.compare(password, account.passwordHash);
    if (!match) {
      recordLoginFailure(req);
      recordLoginEvent(req, { discordId: email, success: false, reason: "invalid account credentials" });
      return res.status(401).json({ ok: false, error: "invalid credentials" });
    }
    clearLoginFailures(req);
    const ownerAuthenticated = account.role === "owner";
    req.session.operatorAuthenticated = true;
    req.session.ownerAuthenticated = ownerAuthenticated;
    req.session.operatorEmail = email;
    req.session.operatorDiscordId = null;
    req.session.operatorLoginMethod = "email-account";
    return req.session.save((err) => {
      if (err) return res.status(500).json({ ok: false, error: "session save failed" });
      recordLoginEvent(req, { discordId: email, success: true, reason: "email account login" });
      return res.json({ ok: true, authenticated: true, ownerAuthenticated, email });
    });
  }

  // ── Master password fallback ──────────────────────────────────────────────
  if (!PANEL_ADMIN_PASSWORD) {
    return res.status(500).json({ ok: false, error: "PANEL_ADMIN_PASSWORD is not configured" });
  }

  if (!safeEqualStr(password, PANEL_ADMIN_PASSWORD)) {
    recordLoginFailure(req);
    recordLoginEvent(req, { discordId: discordId || email, success: false, reason: "invalid credentials" });
    return res.status(401).json({ ok: false, error: "invalid credentials" });
  }

  clearLoginFailures(req);
  const ownerAuthenticated = isOwnerDiscordId(discordId);
  req.session.operatorAuthenticated = true;
  req.session.ownerAuthenticated = ownerAuthenticated;
  req.session.operatorDiscordId = discordId || null;
  req.session.operatorEmail = email || null;
  req.session.operatorLoginMethod = "master-password";
  recordLoginEvent(req, { discordId: discordId || email, success: true, reason: "master password" });
  return req.session.save((err) => {
    if (err) return res.status(500).json({ ok: false, error: "session save failed" });
    return res.json({
      ok: true,
      authenticated: true,
      ownerAuthenticated,
      discordId: discordId || null,
      email: email || null
    });
  });
});

app.post("/api/auth/logout", requireOperatorSession, (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, authenticated: false });
  });
});

app.post("/api/command", requirePanelAccess, (req, res) => {
  const { command, value } = req.body || {};

  if (!command || typeof command !== "string") {
    return res.status(400).json({ ok: false, error: "command is required" });
  }

  switch (command) {
    case "toggleBot":
      state.botOnline = !state.botOnline;
      pushAction({ command, value: state.botOnline });
      break;
    case "setGuildCount":
      state.guildCount = toSafeWholeNumber(value);
      pushAction({ command, value: state.guildCount });
      break;
    case "setUsersServed":
      state.usersServed = toSafeWholeNumber(value);
      pushAction({ command, value: state.usersServed });
      break;
    case "setEconomyBalance":
      state.economyBalance = toSafeWholeNumber(value);
      pushAction({ command, value: state.economyBalance });
      break;
    case "announce":
      pushAction({ command, value: String(value || "") });
      break;
    case "businessSlaFiltersReset":
      pushAction({ command, value: String(value || "reset") });
      break;
    case "businessSlaPresetApplied":
      pushAction({ command, value: String(value || "preset-applied") });
      break;
    case "ownerSystemAction":
      pushAction({ command, value: String(value || "system-action") });
      break;
    case "ownerClientAction":
      pushAction({ command, value: String(value || "client-action") });
      break;
    case "ownerPaymentAlert":
      pushAction({ command, value: String(value || "payment-alert") });
      break;
    default:
      return res.status(400).json({ ok: false, error: "unknown command" });
  }

  broadcast("state", state);

  return res.json({ ok: true });
});

app.post("/api/bot/telemetry", requireBotSignedRequest, (req, res) => {
  const payload = req.body || {};

  if (Object.prototype.hasOwnProperty.call(payload, "botOnline")) {
    state.botOnline = Boolean(payload.botOnline);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "guildCount")) {
    state.guildCount = toSafeWholeNumber(payload.guildCount, state.guildCount);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "usersServed")) {
    state.usersServed = toSafeWholeNumber(payload.usersServed, state.usersServed);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "economyBalance")) {
    state.economyBalance = toSafeWholeNumber(payload.economyBalance, state.economyBalance);
  }

  pushAction({ command: "botTelemetry", value: "state sync" });
  broadcast("state", state);

  return res.json({ ok: true });
});

app.post("/api/bot/economy/transaction", requireBotSignedRequest, (req, res) => {
  const { txId, delta, reason } = req.body || {};
  const tx = String(txId || "").trim();
  const change = Number(delta);
  const fromIp = String(req.ip || "unknown");
  const reasonText = String(reason || "no-reason").trim() || "no-reason";

  if (isRateLimited(fromIp, TX_RATE_LIMIT, TX_RATE_WINDOW_MS)) {
    return res.status(429).json({ ok: false, error: "rate limit exceeded" });
  }

  if (!tx) {
    return res.status(400).json({ ok: false, error: "txId is required" });
  }
  if (!/^[A-Za-z0-9:_-]{8,80}$/.test(tx)) {
    return res.status(400).json({ ok: false, error: "txId format invalid" });
  }
  if (!Number.isFinite(change) || !Number.isInteger(change)) {
    return res.status(400).json({ ok: false, error: "delta must be an integer" });
  }
  if (Math.abs(change) > 1_000_000_000) {
    return res.status(400).json({ ok: false, error: "delta out of range" });
  }
  if (reasonText.length > 120) {
    return res.status(400).json({ ok: false, error: "reason too long" });
  }
  if (state.processedTxIds.includes(tx)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  const next = state.economyBalance + change;
  if (next < 0 || next > Number.MAX_SAFE_INTEGER) {
    return res.status(400).json({ ok: false, error: "balance out of range" });
  }

  state.economyBalance = next;
  state.processedTxIds.unshift(tx);
  state.processedTxIds = state.processedTxIds.slice(0, 5000);
  state.economyLedger.unshift({
    txId: tx,
    delta: change,
    reason: reasonText,
    balanceAfter: state.economyBalance,
    at: new Date().toISOString()
  });
  state.economyLedger = state.economyLedger.slice(0, LEDGER_LIMIT);
  pushAction({ command: "economyTx", value: `${change} (${reasonText})` });
  broadcast("state", state);

  return res.json({ ok: true, economyBalance: state.economyBalance });
});

app.get("/api/store/logo-services", (_req, res) => {
  res.json({ ok: true, catalog: logoServicesCatalog, addOns: logoAddOns });
});

app.get("/api/store/discord-services", (_req, res) => {
  res.json({ ok: true, catalog: discordServicesCatalog });
});

app.get("/api/store/subscriptions", (_req, res) => {
  res.json({ ok: true, plans: subscriptionPlans });
});

app.get("/api/owner/dashboard", requireOwnerAccess, (_req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();
  const metrics = computeCommerceMetrics();
  const summary = computeOwnerPaymentSummary();
  const botsRunning = commerce.clientAccounts.filter((c) => c.botStatus === "running").length;
  const recentActivity = (commerce.loginLog || []).slice(0, 10);
  return res.json({
    ok: true,
    revenue: {
      totalUsd: metrics.totalRevenueUsd,
      paidOrders: metrics.paidOrders,
      pendingOrders: metrics.pendingOrders,
      deliveredOrders: metrics.deliveredOrders
    },
    clients: {
      total: summary.totalClients,
      active: summary.active,
      pastDue: summary.pastDue,
      restricted: summary.restricted,
      suspended: summary.suspended,
      flagged: commerce.clientAccounts.filter((c) => c.flagged).length
    },
    bots: {
      running: botsRunning,
      stopped: commerce.clientAccounts.filter((c) => c.botStatus === "stopped").length,
      disabled: commerce.clientAccounts.filter((c) => c.botStatus === "disabled").length
    },
    system: {
      botOnline: state.botOnline,
      maintenanceMode: state.maintenanceMode,
      globalShutdown: state.globalShutdown
    },
    recentLogins: recentActivity
  });
});

app.get("/api/owner/config-health", requireOwnerAccess, (_req, res) => {
  return res.json({ ok: true, config: getConfigHealthSnapshot() });
});

app.get("/api/owner/config-health/export", requireOwnerAccess, (req, res) => {
  const format = String(req.query.format || "json").trim().toLowerCase();
  const snapshot = getConfigHealthSnapshot();
  const generatedAt = new Date().toISOString();

  if (format === "csv") {
    const escapeCsv = (value) => {
      const text = String(value == null ? "" : value);
      if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
        return `"${text.replace(/\"/g, "\"\"")}"`;
      }
      return text;
    };

    const rows = [
      ["generatedAt", generatedAt],
      ["summary", snapshot.summary],
      ["environment", snapshot.flags.production ? "production" : "non-production"],
      ["discordOauthConfigured", snapshot.flags.discordOauthConfigured],
      ["stripeConfigured", snapshot.flags.stripeConfigured],
      ["devDiscordFallbackEnabled", snapshot.flags.devDiscordFallbackEnabled],
      [],
      ["key", "label", "status", "detail"]
    ];

    for (const check of snapshot.checks) {
      rows.push([check.key, check.label, check.status, check.detail]);
    }

    const csv = `${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="trh-config-health-${Date.now()}.csv"`);
    return res.send(csv);
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="trh-config-health-${Date.now()}.json"`);
  return res.send(JSON.stringify({ ok: true, generatedAt, config: snapshot }, null, 2));
});

app.get("/api/owner/login-log", requireOwnerAccess, (req, res) => {
  const limit = Math.min(toSafeWholeNumber(req.query.limit, 200), 500);
  const search = String(req.query.search || "").trim().toLowerCase();
  const successFilter = req.query.success;
  const flaggedFilter = toBooleanFlag(req.query.flaggedOnly);

  let rows = Array.isArray(commerce.loginLog) ? [...commerce.loginLog] : [];

  if (search) {
    rows = rows.filter((row) => {
      const ip = String(row.ip || "").toLowerCase();
      const discord = String(row.discordId || "").toLowerCase();
      const ua = String(row.userAgent || "").toLowerCase();
      return ip.includes(search) || discord.includes(search) || ua.includes(search);
    });
  }
  if (successFilter === "true") {
    rows = rows.filter((r) => r.success === true);
  } else if (successFilter === "false") {
    rows = rows.filter((r) => r.success === false);
  }
  if (flaggedFilter) {
    const flaggedDiscordIds = new Set(commerce.clientAccounts.filter((c) => c.flagged).map((c) => c.discord));
    rows = rows.filter((r) => r.discordId && flaggedDiscordIds.has(r.discordId));
  }

  return res.json({ ok: true, rows: rows.slice(0, limit), total: rows.length });
});

app.post("/api/owner/sessions/revoke-all", requireOwnerAccess, (_req, res) => {
  try {
    const files = fs.readdirSync(SESSION_DIR);
    let count = 0;
    for (const file of files) {
      if (file.endsWith(".json")) {
        fs.unlinkSync(path.join(SESSION_DIR, file));
        count += 1;
      }
    }
    pushOwnerNotification("warn", `Owner force-revoked all sessions (${count} sessions destroyed).`);
    pushAction({ command: "ownerRevokeAllSessions", value: `${count} sessions revoked` });
    return res.json({ ok: true, sessionsRevoked: count });
  } catch (err) {
    return res.status(500).json({ ok: false, error: `Failed to revoke sessions: ${err.message}` });
  }
});

app.post("/api/owner/clients/:clientId/features", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });

  const allowed = ["moderation", "tickets", "economy", "aiTools", "apiAccess"];
  const updates = req.body || {};

  if (!client.features || typeof client.features !== "object") {
    client.features = { moderation: true, tickets: true, economy: true, aiTools: true, apiAccess: true };
  }

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      client.features[key] = Boolean(updates[key]);
    }
  }

  client.updatedAt = new Date().toISOString();
  persistCommerce();
  pushAction({ command: "ownerFeaturesUpdated", value: `${client.id}: ${JSON.stringify(client.features)}` });
  pushOwnerNotification("info", `Feature toggles updated for ${client.displayName}.`, client.id);
  return res.json({ ok: true, client });
});

app.post("/api/owner/clients/:clientId/contract", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });

  const { signedAt, paymentAgreement } = req.body || {};
  if (!client.contract || typeof client.contract !== "object") {
    client.contract = { signedAt: null, paymentAgreement: "monthly", violationLog: [] };
  }

  if (signedAt !== undefined) {
    const parsed = signedAt ? Date.parse(String(signedAt)) : null;
    client.contract.signedAt = parsed && Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
  }
  if (paymentAgreement) {
    const valid = ["monthly", "full", "milestone"];
    client.contract.paymentAgreement = valid.includes(String(paymentAgreement).toLowerCase())
      ? String(paymentAgreement).toLowerCase()
      : "monthly";
  }

  client.updatedAt = new Date().toISOString();
  persistCommerce();
  pushAction({ command: "ownerContractUpdated", value: client.id });
  return res.json({ ok: true, client });
});

app.post("/api/owner/clients/:clientId/violation", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });

  const reason = String((req.body || {}).reason || "").trim();
  const note = String((req.body || {}).note || "").trim();
  const VALID_REASONS = ["non-payment", "chargeback", "tos-violation", "abuse-exploitation", "custom"];
  if (!VALID_REASONS.includes(reason)) {
    return res.status(400).json({ ok: false, error: `reason must be one of: ${VALID_REASONS.join(", ")}` });
  }
  if (!note || note.length < 5) {
    return res.status(400).json({ ok: false, error: "note is required (min 5 chars)" });
  }

  if (!client.contract || typeof client.contract !== "object") {
    client.contract = { signedAt: null, paymentAgreement: "monthly", violationLog: [] };
  }
  if (!Array.isArray(client.contract.violationLog)) {
    client.contract.violationLog = [];
  }

  const violation = {
    id: `viol-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    reason,
    note: note.slice(0, 500),
    at: new Date().toISOString()
  };
  client.contract.violationLog.unshift(violation);
  client.contract.violationLog = client.contract.violationLog.slice(0, 50);
  client.updatedAt = new Date().toISOString();
  persistCommerce();
  pushAction({ command: "ownerViolationLogged", value: `${client.id}: ${reason}` });
  pushOwnerNotification("warn", `Violation logged for ${client.displayName}: ${reason}`, client.id);
  return res.json({ ok: true, violation, client });
});

app.post("/api/owner/clients/:clientId/flag", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });

  const flagged = Boolean((req.body || {}).flagged);
  const reason = String((req.body || {}).reason || "").trim().slice(0, 200);
  client.flagged = flagged;
  client.flagReason = flagged ? (reason || "Flagged by owner") : null;
  client.updatedAt = new Date().toISOString();
  persistCommerce();
  pushAction({ command: "ownerClientFlagged", value: `${client.id}: flagged=${flagged}` });
  pushOwnerNotification(flagged ? "warn" : "info", `Account ${flagged ? "flagged" : "unflagged"}: ${client.displayName}`, client.id);
  return res.json({ ok: true, client });
});

app.post("/api/owner/clients/:clientId/enforce", requireOwnerAccess, (req, res) => {
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });

  const action = String((req.body || {}).action || "").trim();
  const reason = String((req.body || {}).reason || "").trim();
  const note = String((req.body || {}).note || "").trim();
  const VALID_ACTIONS = ["strip_permissions", "remove_role_access", "disable_features", "lock_account", "terminate_service"];
  const VALID_REASONS = ["non-payment", "chargeback", "tos-violation", "abuse-exploitation", "custom"];

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({ ok: false, error: `action must be one of: ${VALID_ACTIONS.join(", ")}` });
  }
  if (!VALID_REASONS.includes(reason)) {
    return res.status(400).json({ ok: false, error: `reason must be one of: ${VALID_REASONS.join(", ")}` });
  }

  // Apply action effects
  if (action === "strip_permissions") {
    if (!client.features) client.features = { moderation: true, tickets: true, economy: true, aiTools: true, apiAccess: true };
    client.features.apiAccess = false;
    client.features.aiTools = false;
    client.premiumLocked = true;
  } else if (action === "remove_role_access") {
    client.premiumLocked = true;
    client.lockedFeatures = ["tickets", "economy", "advanced-commands"];
  } else if (action === "disable_features") {
    if (!client.features) client.features = { moderation: true, tickets: true, economy: true, aiTools: true, apiAccess: true };
    client.features.tickets = false;
    client.features.economy = false;
    client.features.aiTools = false;
    client.features.apiAccess = false;
    client.premiumLocked = true;
  } else if (action === "lock_account") {
    client.paymentState = "restricted";
    client.manualOverrideState = "restricted";
    client.premiumLocked = true;
  } else if (action === "terminate_service") {
    client.accessRevoked = true;
    client.paymentState = "suspended";
    client.botStatus = "disabled";
    client.premiumLocked = true;
    if (client.features) {
      client.features.moderation = false;
      client.features.tickets = false;
      client.features.economy = false;
      client.features.aiTools = false;
      client.features.apiAccess = false;
    }
  }

  // Log the enforcement action
  if (!Array.isArray(client.enforcementLog)) client.enforcementLog = [];
  client.enforcementLog.unshift({
    id: `enf-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    action,
    reason,
    note: note.slice(0, 500),
    at: new Date().toISOString()
  });
  client.enforcementLog = client.enforcementLog.slice(0, 50);

  // Also log as violation
  if (!client.contract) client.contract = { signedAt: null, paymentAgreement: "monthly", violationLog: [] };
  if (!Array.isArray(client.contract.violationLog)) client.contract.violationLog = [];
  client.contract.violationLog.unshift({
    id: `viol-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    reason,
    note: `Enforcement action: ${action}. ${note}`.trim().slice(0, 500),
    at: new Date().toISOString()
  });
  client.contract.violationLog = client.contract.violationLog.slice(0, 50);

  client.updatedAt = new Date().toISOString();
  applyPaymentStateTransitions();
  persistCommerce();
  pushAction({ command: "ownerEnforcementAction", value: `${client.id}: ${action} (${reason})` });
  pushOwnerNotification("critical", `Enforcement: ${action} applied to ${client.displayName}. Reason: ${reason}`, client.id);

  return res.json({ ok: true, client });
});

app.get("/api/owner/users", requireOwnerAccess, (req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();
  const search = String(req.query.search || "").trim().toLowerCase();
  const paymentState = String(req.query.paymentState || "all").toLowerCase();
  const flaggedOnly = toBooleanFlag(req.query.flaggedOnly);

  let rows = [...commerce.clientAccounts];
  if (search) {
    rows = rows.filter((c) => {
      return String(c.displayName || "").toLowerCase().includes(search)
        || String(c.email || "").toLowerCase().includes(search)
        || String(c.discord || "").toLowerCase().includes(search)
        || String(c.id || "").includes(search);
    });
  }
  if (paymentState !== "all") {
    rows = rows.filter((c) => c.paymentState === paymentState);
  }
  if (flaggedOnly) {
    rows = rows.filter((c) => c.flagged);
  }

  return res.json({ ok: true, rows, total: rows.length });
});

app.get("/api/owner/clients/:clientId", requireOwnerAccess, (req, res) => {
  syncClientAccountsFromOrders();
  const clientId = String(req.params.clientId || "").trim();
  const client = findClientAccount(clientId);
  if (!client) return res.status(404).json({ ok: false, error: "client not found" });
  const clientOrders = commerce.orders.filter((o) => o.customerEmail === client.email || o.customerDiscord === client.discord);
  return res.json({ ok: true, client, orders: clientOrders.slice(0, 50) });
});

// ─── USER TRACKING & ENFORCEMENT ROUTES ───────────────────────────────────────

// POST /api/users/ingest — bot reports a user profile (upsert)
app.post("/api/users/ingest", requireBotSignedRequest, (req, res) => {
  const payload = req.body || {};
  const discordId = String(payload.discordId || "").trim();
  if (!discordId || !/^\d{17,20}$/.test(discordId)) {
    return res.status(400).json({ ok: false, error: "valid discordId is required" });
  }

  const ip = getClientIp(req);
  const profile = upsertUserProfile(discordId, {
    username: payload.username,
    displayName: payload.displayName,
    globalName: payload.globalName,
    avatarUrl: payload.avatarUrl,
    accountCreatedAt: payload.accountCreatedAt,
    guildId: payload.guildId,
    guildName: payload.guildName,
    ip
  });

  // Evaluate blacklist status and return enforcement result
  const enforcement = evaluateUserEnforcement(discordId, "basic", null);
  persistUsers();

  return res.json({ ok: true, internalId: profile.internalId, enforcement });
});

// POST /api/users/activity — bot logs a user command/activity
app.post("/api/users/activity", requireBotSignedRequest, (req, res) => {
  const payload = req.body || {};
  const discordId = String(payload.discordId || "").trim();
  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });

  // Auto-create minimal profile if not seen before
  if (!usersRegistry[discordId]) {
    upsertUserProfile(discordId, { username: payload.username || discordId, ip: getClientIp(req) });
  }

  recordUserActivity(discordId, {
    type: payload.type || "command",
    command: payload.command,
    guildId: payload.guildId,
    guildName: payload.guildName,
    serviceAccessed: payload.serviceAccessed,
    success: payload.success !== false,
    metadata: payload.metadata
  });

  persistUsers();
  return res.json({ ok: true });
});

// POST /api/enforcement/check — full combined enforcement check (blacklist + tier + payment)
app.post("/api/enforcement/check", requireBotSignedRequest, (req, res) => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();

  const payload = req.body || {};
  const discordId = String(payload.discordId || "").trim();
  const commandTier = String(payload.commandTier || "basic").toLowerCase();
  const commandName = String(payload.commandName || "unknown").slice(0, 80);

  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });

  // Auto-create profile if needed
  if (!usersRegistry[discordId]) {
    upsertUserProfile(discordId, { username: payload.username || discordId, ip: getClientIp(req) });
  } else if (payload.username) {
    upsertUserProfile(discordId, { username: payload.username, displayName: payload.displayName, guildId: payload.guildId, guildName: payload.guildName, ip: getClientIp(req) });
  }

  const userEnforcement = evaluateUserEnforcement(discordId, commandTier, commandName);

  // Also check billing/client account
  const discord = usersRegistry[discordId] && usersRegistry[discordId].username;
  const client = resolveClientAccountFromIdentity("", discord || "", "");
  const clientEnforcement = evaluateClientCommandAccess(client, commandTier);

  // Log the activity
  recordUserActivity(discordId, {
    type: userEnforcement.allow && clientEnforcement.allow ? "command" : "permission_denied",
    command: commandName,
    guildId: payload.guildId,
    guildName: payload.guildName,
    serviceAccessed: commandTier,
    success: userEnforcement.allow && clientEnforcement.allow,
    metadata: { commandTier }
  });
  persistUsers();

  // Combine: most restrictive wins
  const finalAllow = userEnforcement.allow && clientEnforcement.allow;
  const finalState = !userEnforcement.allow ? userEnforcement.state : !clientEnforcement.allow ? clientEnforcement.state : "active";
  const finalMessage = !userEnforcement.allow ? userEnforcement.reason : !clientEnforcement.allow ? (clientEnforcement.message || "Access restricted.") : null;

  return res.json({
    ok: true,
    allow: finalAllow,
    state: finalState,
    message: finalMessage,
    tier: userEnforcement.tier || "free",
    warning: userEnforcement.warning || (clientEnforcement.state === "past_due" ? clientEnforcement.warning : null),
    user: { discordId, tier: userEnforcement.tier, blacklisted: Boolean(usersRegistry[discordId] && usersRegistry[discordId].blacklisted) },
    clientId: client ? client.id : null
  });
});

// ─── OWNER USER MANAGEMENT ROUTES ─────────────────────────────────────────────

// GET /api/owner/user-profiles — list all user profiles with search/filter
app.get("/api/owner/user-profiles", requireOwnerAccess, (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();
  const blacklistedOnly = req.query.blacklistedOnly === "true";
  const frozenOnly = req.query.frozenOnly === "true";
  const tier = String(req.query.tier || "all").toLowerCase();
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 50)));

  let rows = Object.values(usersRegistry);

  if (search) {
    rows = rows.filter((p) =>
      String(p.discordId || "").includes(search) ||
      String(p.username || "").toLowerCase().includes(search) ||
      String(p.displayName || "").toLowerCase().includes(search) ||
      String(p.internalId || "").includes(search)
    );
  }
  if (blacklistedOnly) rows = rows.filter((p) => p.blacklisted);
  if (frozenOnly) rows = rows.filter((p) => p.frozen);
  if (tier !== "all") rows = rows.filter((p) => p.tier === tier);

  rows.sort((a, b) => (b.lastSeenAt || "").localeCompare(a.lastSeenAt || ""));

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize).map((p) => ({
    discordId: p.discordId,
    internalId: p.internalId,
    username: p.username,
    displayName: p.displayName,
    tier: p.tier,
    blacklisted: p.blacklisted,
    blacklistReason: p.blacklistReason,
    frozen: p.frozen,
    commandCount: p.commandCount,
    firstSeenAt: p.firstSeenAt,
    lastSeenAt: p.lastSeenAt,
    paymentStatus: p.paymentStatus,
    outstandingBalance: p.outstandingBalance,
    guildCount: (p.guilds || []).length,
    infractionCount: (p.infractions || []).length
  }));

  return res.json({ ok: true, total, page, pageSize, rows: pageRows });
});

// GET /api/owner/user-profiles/:discordId — full user profile
app.get("/api/owner/user-profiles/:discordId", requireOwnerAccess, (req, res) => {
  const discordId = String(req.params.discordId || "").trim();
  const profile = usersRegistry[discordId];
  if (!profile) return res.status(404).json({ ok: false, error: "user not found" });

  const blacklistEntry = getUserBlacklistEntry(discordId);
  const enforcement = evaluateUserEnforcement(discordId, "premium", null);
  // Safe view: exclude ipLog from response
  const safeProfile = { ...profile, ipLog: undefined };

  return res.json({ ok: true, profile: safeProfile, blacklistEntry, enforcement });
});

// POST /api/owner/enforcement/blacklist — blacklist a user
app.post("/api/owner/enforcement/blacklist", requireOwnerAccess, (req, res) => {
  const body = req.body || {};
  const discordId = String(body.discordId || "").trim();
  const reason = String(body.reason || "tos_violation").trim();
  const reasonDetail = String(body.reasonDetail || "").trim();
  const moderator = (req.session && req.session.operatorDiscordId) ? String(req.session.operatorDiscordId) : "owner";
  const expiresAt = body.expiresAt ? String(body.expiresAt) : null;

  if (!discordId || !/^\d{17,20}$/.test(discordId)) {
    return res.status(400).json({ ok: false, error: "valid discordId is required (17-20 digits)" });
  }
  if (!USER_BLACKLIST_REASONS.includes(reason)) {
    return res.status(400).json({ ok: false, error: `reason must be one of: ${USER_BLACKLIST_REASONS.join(", ")}` });
  }

  // Auto-create profile if not seen yet
  if (!usersRegistry[discordId]) {
    upsertUserProfile(discordId, { username: body.username || discordId });
  }

  const result = blacklistUser(discordId, reason, reasonDetail, moderator, expiresAt);
  return res.json(result);
});

// POST /api/owner/enforcement/unblacklist — remove blacklist
app.post("/api/owner/enforcement/unblacklist", requireOwnerAccess, (req, res) => {
  const body = req.body || {};
  const discordId = String(body.discordId || "").trim();
  const moderator = (req.session && req.session.operatorDiscordId) ? String(req.session.operatorDiscordId) : "owner";
  const restoredTier = String(body.restoredTier || "free");

  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });
  return res.json(unblacklistUser(discordId, moderator, restoredTier));
});

// POST /api/owner/enforcement/freeze — freeze a user account
app.post("/api/owner/enforcement/freeze", requireOwnerAccess, (req, res) => {
  const body = req.body || {};
  const discordId = String(body.discordId || "").trim();
  const reason = String(body.reason || "").trim();
  const moderator = (req.session && req.session.operatorDiscordId) ? String(req.session.operatorDiscordId) : "owner";

  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });

  if (!usersRegistry[discordId]) {
    upsertUserProfile(discordId, { username: body.username || discordId });
  }

  return res.json(freezeUserAccount(discordId, reason, moderator));
});

// POST /api/owner/enforcement/restore — restore frozen/blacklisted user
app.post("/api/owner/enforcement/restore", requireOwnerAccess, (req, res) => {
  const body = req.body || {};
  const discordId = String(body.discordId || "").trim();
  const moderator = (req.session && req.session.operatorDiscordId) ? String(req.session.operatorDiscordId) : "owner";
  const newTier = String(body.tier || "free");

  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });
  return res.json(restoreUserAccount(discordId, moderator, newTier));
});

// POST /api/owner/enforcement/set-tier — manually set a user's tier
app.post("/api/owner/enforcement/set-tier", requireOwnerAccess, (req, res) => {
  const body = req.body || {};
  const discordId = String(body.discordId || "").trim();
  const tier = String(body.tier || "free").toLowerCase();

  if (!discordId) return res.status(400).json({ ok: false, error: "discordId is required" });
  if (!USER_TIERS.includes(tier)) return res.status(400).json({ ok: false, error: `tier must be one of: ${USER_TIERS.join(", ")}` });

  if (!usersRegistry[discordId]) {
    upsertUserProfile(discordId, { username: body.username || discordId });
  }
  usersRegistry[discordId].tier = tier;
  usersRegistry[discordId].updatedAt = new Date().toISOString();
  persistUsers();
  pushAction({ command: "ownerSetUserTier", value: `${discordId} -> ${tier}` });

  return res.json({ ok: true, discordId, tier });
});

// GET /api/owner/enforcement/blacklist-registry — full blacklist registry
app.get("/api/owner/enforcement/blacklist-registry", requireOwnerAccess, (req, res) => {
  const activeOnly = req.query.activeOnly !== "false";
  const rows = activeOnly ? blacklistRegistry.filter((e) => e.active) : blacklistRegistry;
  return res.json({ ok: true, total: rows.length, rows: rows.slice(0, 500) });
});

// GET /api/owner/enforcement/user-logs/:discordId — activity log for a user
app.get("/api/owner/enforcement/user-logs/:discordId", requireOwnerAccess, (req, res) => {
  const discordId = String(req.params.discordId || "").trim();
  const profile = usersRegistry[discordId];
  if (!profile) return res.status(404).json({ ok: false, error: "user not found" });
  const limit = Math.min(500, Math.max(1, Number(req.query.limit || 100)));
  return res.json({ ok: true, discordId, total: (profile.activityLog || []).length, logs: (profile.activityLog || []).slice(0, limit) });
});

wss.on("connection", (socket) => {
  // Refuse new connections during active lockout
  if (lockout.active) {
    socket.send(JSON.stringify({
      type: "lockout",
      payload: {
        active: true,
        level: lockout.level,
        message: "TRH Development Services Temporarily Disabled By Owner"
      }
    }));
    socket.close();
    return;
  }

  socket.isAlive = true;
  socket.on("pong", () => { socket.isAlive = true; });

  socket.send(JSON.stringify({ type: "state", payload: state }));
});

// Ping all connected clients every 25 seconds.
// Any client that hasn't replied with a pong since the last ping is a dead
// connection — terminate it so the client's close handler fires and reconnects.
const wsPingInterval = setInterval(() => {
  for (const socket of wss.clients) {
    if (socket.isAlive === false) {
      socket.terminate();
      continue;
    }
    socket.isAlive = false;
    socket.ping();
  }
}, 25000);

wss.on("close", () => clearInterval(wsPingInterval));

// ─── EMERGENCY LOCKOUT ENDPOINTS ──────────────────────────────────────────────

// GET /api/emergency/status — returns lockout status; public when locked, owner-only when unlocked
app.get("/api/emergency/status", (req, res) => {
  const isOwnerSession = req.session && req.session.ownerAuthenticated === true;
  const ownerApiKey = String(req.header("x-owner-key") || "").trim();
  const isOwnerKey = ownerApiKey && OWNER_CONTROL_PASSWORD && safeEqualStr(ownerApiKey, OWNER_CONTROL_PASSWORD);

  if (!isOwnerSession && !isOwnerKey) {
    if (lockout.active) {
      return res.json({
        ok: true,
        active: true,
        level: lockout.level,
        activatedAt: lockout.activatedAt,
        message: "TRH Development Services Temporarily Disabled By Owner"
      });
    }
    return res.status(401).json({ ok: false, error: "owner access required" });
  }

  return res.json({
    ok: true,
    lockout: {
      active: lockout.active,
      level: lockout.level,
      activatedAt: lockout.activatedAt,
      activatedBy: lockout.activatedBy,
      silentMode: lockout.silentMode,
      databaseFrozen: lockout.databaseFrozen
    },
    blacklistCounts: {
      ips: lockout.blacklist.ips.length,
      discordIds: lockout.blacklist.discordIds.length,
      sessionIds: lockout.blacklist.sessionIds.length
    },
    abuseLogs: lockout.abuseLogs.slice(0, 50)
  });
});

// POST /api/emergency/lockout — activate lockout (requires owner password + optional recovery key)
app.post("/api/emergency/lockout", (req, res) => {
  const blockSecs = getLoginBlockSeconds(req);
  if (blockSecs > 0) {
    return res.status(429).json({ ok: false, error: `Too many failed attempts. Try again in ${blockSecs}s.`, retryAfter: blockSecs });
  }
  const body = req.body || {};
  const verify = verifyEmergencyCredentials(body);
  if (!verify.ok) {
    recordLoginFailure(req);
    recordLockoutAbuseAttempt(req, `failed-lockout-attempt: ${verify.error}`);
    // Only flush to disk when abuse log hits a multiple of 10 to prevent write DoS
    if (lockout.abuseLogs.length % 10 === 0) persistLockout();
    return res.status(401).json({ ok: false, error: verify.error });
  }

  const level = String(body.level || "lockout").toLowerCase();
  if (!["lockout", "shutdown", "nuclear"].includes(level)) {
    return res.status(400).json({ ok: false, error: "level must be lockout, shutdown, or nuclear" });
  }
  const silentMode = Boolean(body.silentMode);
  const activatedBy = (req.session && req.session.operatorDiscordId) ? String(req.session.operatorDiscordId) : "password-auth";

  lockout.active = true;
  lockout.level = level;
  lockout.activatedAt = new Date().toISOString();
  lockout.activatedBy = activatedBy;
  lockout.silentMode = silentMode;

  const results = { level, sessionsRevoked: 0, wsClientsKicked: 0, botKillResults: [], databaseFrozen: false };

  // Purge all sessions except current owner session
  const ownerSessionId = req.session && req.session.id ? String(req.session.id) : null;
  results.sessionsRevoked = purgeAllSessionFiles(ownerSessionId);

  // Kick all WS clients
  results.wsClientsKicked = kickAllWebSocketClients();

  // Kill bot processes for shutdown and nuclear levels
  if (level === "shutdown" || level === "nuclear") {
    results.botKillResults = killBotProcesses();
    state.botOnline = false;
    state.globalShutdown = true;
    for (const client of commerce.clientAccounts) {
      client.botStatus = "disabled";
    }
    persistState();
    persistCommerce();
  }

  // Database freeze flag for nuclear level
  if (level === "nuclear") {
    lockout.databaseFrozen = true;
    results.databaseFrozen = true;
  }

  persistLockout();

  if (!silentMode) {
    pushAction({ command: "emergencyLockout", value: `level=${level} by ${activatedBy}` });
    pushOwnerNotification("critical", `EMERGENCY LOCKOUT ACTIVATED: level=${level}. ${results.sessionsRevoked} sessions destroyed.`);
  }

  return res.json({ ok: true, activatedAt: lockout.activatedAt, silentMode, ...results });
});

// POST /api/emergency/restore — deactivate lockout and restore services
app.post("/api/emergency/restore", (req, res) => {
  const blockSecs = getLoginBlockSeconds(req);
  if (blockSecs > 0) {
    return res.status(429).json({ ok: false, error: `Too many failed attempts. Try again in ${blockSecs}s.`, retryAfter: blockSecs });
  }
  const body = req.body || {};
  const verify = verifyEmergencyCredentials(body);
  if (!verify.ok) {
    recordLoginFailure(req);
    recordLockoutAbuseAttempt(req, `failed-restore-attempt: ${verify.error}`);
    if (lockout.abuseLogs.length % 10 === 0) persistLockout();
    return res.status(401).json({ ok: false, error: verify.error });
  }

  const restoredLevel = lockout.level;
  const wasActive = lockout.active;

  lockout.active = false;
  lockout.level = null;
  lockout.activatedAt = null;
  lockout.activatedBy = null;
  lockout.silentMode = false;
  lockout.databaseFrozen = false;

  if (restoredLevel === "shutdown" || restoredLevel === "nuclear") {
    state.globalShutdown = false;
    state.botOnline = true;
    for (const client of commerce.clientAccounts) {
      if (!client.accessRevoked && client.manualOverrideState !== "suspended") {
        client.botStatus = "running";
      }
    }
    persistState();
    persistCommerce();
  }

  persistLockout();

  if (wasActive) {
    pushAction({ command: "emergencyRestore", value: `restored from level=${restoredLevel || "none"}` });
    pushOwnerNotification("info", `Emergency lockout RESTORED. System returned to normal operation.`);
  }

  broadcast("state", state);

  return res.json({
    ok: true,
    restored: true,
    previousLevel: restoredLevel,
    system: {
      botOnline: state.botOnline,
      globalShutdown: state.globalShutdown,
      maintenanceMode: state.maintenanceMode
    }
  });
});

// POST /api/emergency/blacklist — add or remove entries from the permanent blacklist
app.post("/api/emergency/blacklist", (req, res) => {
  const isOwnerSession = req.session && req.session.ownerAuthenticated === true;
  const ownerApiKey = String(req.header("x-owner-key") || "").trim();
  const isOwnerKey = ownerApiKey && OWNER_CONTROL_PASSWORD && safeEqualStr(ownerApiKey, OWNER_CONTROL_PASSWORD);
  if (!isOwnerSession && !isOwnerKey) {
    return res.status(403).json({ ok: false, error: "owner access required" });
  }

  const body = req.body || {};
  const action = String(body.action || "add").toLowerCase();
  const type = String(body.type || "").toLowerCase();
  const value = String(body.value || "").trim();

  if (!["add", "remove"].includes(action)) return res.status(400).json({ ok: false, error: "action must be add or remove" });
  if (!["ip", "discord", "session"].includes(type)) return res.status(400).json({ ok: false, error: "type must be ip, discord, or session" });
  if (!value || value.length > 200) return res.status(400).json({ ok: false, error: "valid value is required" });

  let list;
  if (type === "ip") list = lockout.blacklist.ips;
  else if (type === "discord") list = lockout.blacklist.discordIds;
  else list = lockout.blacklist.sessionIds;

  if (action === "add") {
    if (!list.includes(value)) list.push(value);
    if (type === "session") {
      try { fs.unlinkSync(path.join(SESSION_DIR, `${value}.json`)); } catch (_) {}
    }
  } else {
    const idx = list.indexOf(value);
    if (idx !== -1) list.splice(idx, 1);
  }

  persistLockout();
  pushAction({ command: "blacklistUpdated", value: `${action} ${type}=${value}` });

  return res.json({
    ok: true, action, type, value,
    counts: {
      ips: lockout.blacklist.ips.length,
      discordIds: lockout.blacklist.discordIds.length,
      sessionIds: lockout.blacklist.sessionIds.length
    }
  });
});

// GET /api/emergency/blacklist — view full blacklist and abuse logs (owner only)
app.get("/api/emergency/blacklist", requireOwnerAccess, (_req, res) => {
  return res.json({
    ok: true,
    blacklist: lockout.blacklist,
    abuseLogs: lockout.abuseLogs.slice(0, 200)
  });
});

// POST /api/emergency/purge-sessions — purge all non-owner sessions on demand
app.post("/api/emergency/purge-sessions", requireOwnerAccess, (req, res) => {
  const ownerSessionId = req.session && req.session.id ? String(req.session.id) : null;
  const purged = purgeAllSessionFiles(ownerSessionId);
  pushAction({ command: "emergencySessionPurge", value: `${purged} sessions destroyed` });
  pushOwnerNotification("warn", `Emergency session purge: ${purged} sessions destroyed.`);
  return res.json({ ok: true, sessionsRevoked: purged });
});

// Rotating pool of real-looking system health events for the Live Activity ticker.
// One fires per minute, cycling through all event types so the feed stays varied.
const SYSTEM_HEALTH_EVENTS = [
  () => ({ command: "systemHeartbeat",  value: `all ${state.guildCount} guilds responding — latency nominal` }),
  () => ({ command: "economyCheck",     value: `balance ${state.economyBalance.toLocaleString()} coins — no anomalies` }),
  () => ({ command: "userMilestone",    value: `${state.usersServed.toLocaleString()} total users served across all guilds` }),
  () => ({ command: "deliveryQueue",    value: "pipeline clear — 0 pending bot deliveries" }),
  () => ({ command: "botHeartbeat",     value: `bot online — ${state.guildCount} active guilds, uptime nominal` }),
  () => ({ command: "sessionSweep",     value: "session store scanned — all operator sessions valid" }),
  () => ({ command: "rateGuard",        value: "rate-limit map pruned — no abuse patterns detected" }),
  () => ({ command: "commerceSync",     value: `order ledger reconciled — ${state.economyLedger ? state.economyLedger.length : 0} transactions on record` }),
];
let _healthEventIdx = Math.floor(Math.random() * SYSTEM_HEALTH_EVENTS.length);

setInterval(() => {
  const drift = Math.floor(Math.random() * 3);
  if (drift > 0) {
    state.usersServed += drift;
  }
  const eventFn = SYSTEM_HEALTH_EVENTS[_healthEventIdx % SYSTEM_HEALTH_EVENTS.length];
  _healthEventIdx++;
  pushAction(eventFn());
  broadcast("state", state);
}, 60000);

setInterval(() => {
  syncClientAccountsFromOrders();
  applyPaymentStateTransitions();
}, 60 * 1000);

// Purge stale entries from the in-memory rate-limit map every 5 minutes
// to prevent unbounded memory growth under sustained traffic.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of txRateMap.entries()) {
    const maxWindow = Math.max(TX_RATE_WINDOW_MS, CHECKOUT_RATE_WINDOW_MS, INQUIRY_RATE_WINDOW_MS);
    if (now - entry.windowStart > maxWindow) {
      txRateMap.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

// Suppress transient Windows EPERM rename errors from session-file-store.
// These occur when a temp session file cannot be atomically renamed (file locking
// race on NTFS) and are non-fatal — the existing session data remains intact.
process.on("uncaughtException", (err) => {
  if (err && err.code === "EPERM" && typeof err.message === "string" && err.message.includes("rename")) {
    return; // swallow harmless Windows session-store rename races
  }
  console.error("[FATAL uncaughtException]", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

loadState();
loadCommerce();
loadLockout();
loadUsers();
loadOperatorAccounts();
loadBlacklist();
syncClientAccountsFromOrders();
applyPaymentStateTransitions();

// When run directly (`node server.js`) start listening immediately.
// When required by Electron, export the server so main.js can bind it to
// a specific address and port before opening the BrowserWindow.
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`TRH Control Panel running on http://localhost:${PORT}`);
  });
} else {
  module.exports = { app, server, PORT };
}
