const botOnlineEl = document.getElementById("botOnline");
const guildCountEl = document.getElementById("guildCount");
const usersServedEl = document.getElementById("usersServed");
const economyBalanceEl = document.getElementById("economyBalance");
const recentActionsEl = document.getElementById("recentActions");
const wsClientsEl = document.getElementById("wsClients");
const memoryRssMbEl = document.getElementById("memoryRssMb");
const txCount24hEl = document.getElementById("txCount24h");
const txVolume24hEl = document.getElementById("txVolume24h");
const lastUpdateAtEl = document.getElementById("lastUpdateAt");
const ledgerRowsEl = document.getElementById("ledgerRows");
const statusLineEl = document.getElementById("statusLine");
const authCardEl = document.getElementById("authCard");
const authBadgeEl = document.getElementById("authBadge");
const operatorChipEl = document.getElementById("operatorChip");
const operatorAvatarEl = document.getElementById("operatorAvatar");
const operatorLabelEl = document.getElementById("operatorLabel");
const ownerAccessCardEl = document.getElementById("ownerAccessCard");
const ownerPasswordInputEl = document.getElementById("ownerPasswordInput");
const ownerLoginBtn = document.getElementById("ownerLoginBtn");
const ownerRefreshBtn = document.getElementById("ownerRefreshBtn");
const ownerPanelEl = document.getElementById("ownerPanel");
const ownerStatusLineEl = document.getElementById("ownerStatusLine");
const ownerSystemStatusEl = document.getElementById("ownerSystemStatus");
const ownerTotalClientsEl = document.getElementById("ownerTotalClients");
const ownerPastDueEl = document.getElementById("ownerPastDue");
const ownerRestrictedEl = document.getElementById("ownerRestricted");
const ownerSuspendedEl = document.getElementById("ownerSuspended");
const ownerOutstandingUsdEl = document.getElementById("ownerOutstandingUsd");
const ownerStartAllBtn = document.getElementById("ownerStartAllBtn");
const ownerStopAllBtn = document.getElementById("ownerStopAllBtn");
const ownerRestartAllBtn = document.getElementById("ownerRestartAllBtn");
const ownerForceUpdateAllBtn = document.getElementById("ownerForceUpdateAllBtn");
const ownerMaintenanceOnBtn = document.getElementById("ownerMaintenanceOnBtn");
const ownerMaintenanceOffBtn = document.getElementById("ownerMaintenanceOffBtn");
const ownerGlobalShutdownBtn = document.getElementById("ownerGlobalShutdownBtn");
const ownerClientRowsEl = document.getElementById("ownerClientRows");
const ownerNotificationsEl = document.getElementById("ownerNotifications");
const settingsExportConfigJsonBtn = document.getElementById("settingsExportConfigJsonBtn");
const settingsExportConfigCsvBtn = document.getElementById("settingsExportConfigCsvBtn");
const settingsConfigExportStatusEl = document.getElementById("settingsConfigExportStatus");
const paymentModeBadgeEl = document.getElementById("paymentModeBadge");
const storeCatalogEl = document.getElementById("storeCatalog");
const offeringCatalogEl = document.getElementById("offeringCatalog");
const offeringTabAllEl = document.getElementById("offeringTabAll");
const offeringTabUsersEl = document.getElementById("offeringTabUsers");
const offeringTabOwnersEl = document.getElementById("offeringTabOwners");
const purchaseBotIdEl = document.getElementById("purchaseBotId");
const purchaseBuyerTypeEl = document.getElementById("purchaseBuyerType");
const purchaseEmailEl = document.getElementById("purchaseEmail");
const purchaseDiscordEl = document.getElementById("purchaseDiscord");
const purchaseCustomBriefEl = document.getElementById("purchaseCustomBrief");
const purchasePaymentMethodEl = document.getElementById("purchasePaymentMethod");
const purchaseBtn = document.getElementById("purchaseBtn");
const purchaseStatusEl = document.getElementById("purchaseStatus");
const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");
const exportOrdersBtn = document.getElementById("exportOrdersBtn");
const orderRowsEl = document.getElementById("orderRows");
const orderFilterPaymentEl = document.getElementById("orderFilterPayment");
const orderFilterProvisioningEl = document.getElementById("orderFilterProvisioning");
const orderSortSelectEl = document.getElementById("orderSortSelect");
const orderSearchInputEl = document.getElementById("orderSearchInput");
const clearOrderFiltersBtn = document.getElementById("clearOrderFiltersBtn");
const orderFilterSummaryEl = document.getElementById("orderFilterSummary");
const commerceTotalOrdersEl = document.getElementById("commerceTotalOrders");
const commerceRevenueUsdEl = document.getElementById("commerceRevenueUsd");
const commerceReadyProvisioningEl = document.getElementById("commerceReadyProvisioning");
const commerceDeliveredOrdersEl = document.getElementById("commerceDeliveredOrders");
const lookupOrderIdEl = document.getElementById("lookupOrderId");
const lookupEmailEl = document.getElementById("lookupEmail");
const lookupOrderBtn = document.getElementById("lookupOrderBtn");
const lookupStatusEl = document.getElementById("lookupStatus");
const myBotsEmailEl = document.getElementById("myBotsEmail");
const myBotsDiscordEl = document.getElementById("myBotsDiscord");
const loadMyBotsBtn = document.getElementById("loadMyBotsBtn");
const myBotsSearchEl = document.getElementById("myBotsSearch");
const myBotsActiveFilterEl = document.getElementById("myBotsActiveFilter");
const refreshLocalBotsBtn = document.getElementById("refreshLocalBotsBtn");
const myBotsStatusEl = document.getElementById("myBotsStatus");
const myBotsListEl = document.getElementById("myBotsList");
const portfolioStatusEl = document.getElementById("portfolioStatus");
const portfolioSummaryEl = document.getElementById("portfolioSummary");
const portfolioListEl = document.getElementById("portfolioList");
const buildLibraryRowsEl = document.getElementById("buildLibraryRows");
const screenTabsEl = document.getElementById("screenTabs");
const botScreenButtonsEl = document.getElementById("botScreenButtons");
const botScreensMountEl = document.getElementById("botScreensMount");
const overviewBotPackagesEl = document.getElementById("overviewBotPackages");
const overviewTotalModulesEl = document.getElementById("overviewTotalModules");
const overviewTotalOrdersEl = document.getElementById("overviewTotalOrders");
const overviewRevenueUsdEl = document.getElementById("overviewRevenueUsd");
const overviewReadyToProvisionEl = document.getElementById("overviewReadyToProvision");
const overviewDeliveredOrdersEl = document.getElementById("overviewDeliveredOrders");
const themeSelectEl = document.getElementById("themeSelect");
const themeCycleBtn = document.getElementById("themeCycleBtn");
const homeBuildMapEl = document.getElementById("homeBuildMap");
const opsDeckRingEl = document.getElementById("opsDeckRing");
const opsDeckMetricEl = document.getElementById("opsDeckMetric");
const opsDeckDetailEl = document.getElementById("opsDeckDetail");
const commerceDeckRingEl = document.getElementById("commerceDeckRing");
const commerceDeckMetricEl = document.getElementById("commerceDeckMetric");
const commerceDeckDetailEl = document.getElementById("commerceDeckDetail");
const deliveryDeckRingEl = document.getElementById("deliveryDeckRing");
const deliveryDeckMetricEl = document.getElementById("deliveryDeckMetric");
const deliveryDeckDetailEl = document.getElementById("deliveryDeckDetail");
const loadingGateEl = document.getElementById("loadingGate");
const activityTickerTrackEl = document.getElementById("activityTickerTrack");
const wsStatusEl = document.getElementById("wsStatus");
const economyAnomalyStripEl = document.getElementById("economyAnomalyStrip");
const economyAnomalyTextEl = document.getElementById("economyAnomalyText");
const uiDensitySelectEl = document.getElementById("uiDensitySelect");
const reducedMotionToggleEl = document.getElementById("reducedMotionToggle");
const compactLogsToggleEl = document.getElementById("compactLogsToggle");
const businessServiceGridEl = document.getElementById("businessServiceGrid");
const businessCompanyNameEl = document.getElementById("businessCompanyName");
const businessContactNameEl = document.getElementById("businessContactName");
const businessEmailEl = document.getElementById("businessEmail");
const businessDiscordEl = document.getElementById("businessDiscord");
const businessServiceCategoryEl = document.getElementById("businessServiceCategory");
const businessBudgetUsdEl = document.getElementById("businessBudgetUsd");
const businessProjectSummaryEl = document.getElementById("businessProjectSummary");
const businessProjectSummaryCountEl = document.getElementById("businessProjectSummaryCount");
const submitBusinessInquiryBtn = document.getElementById("submitBusinessInquiryBtn");
const generateBusinessQuoteBtn = document.getElementById("generateBusinessQuoteBtn");
const refreshBusinessInquiriesBtn = document.getElementById("refreshBusinessInquiriesBtn");
const businessInquiryStatusEl = document.getElementById("businessInquiryStatus");
const businessQuotePreviewEl = document.getElementById("businessQuotePreview");
const businessInquiryFilterEl = document.getElementById("businessInquiryFilter");
const businessInquirySortEl = document.getElementById("businessInquirySort");
const businessSlaExportStartEl = document.getElementById("businessSlaExportStart");
const businessSlaExportEndEl = document.getElementById("businessSlaExportEnd");
const businessSlaExportBreachedOnlyEl = document.getElementById("businessSlaExportBreachedOnly");
const businessSlaAutoExportEl = document.getElementById("businessSlaAutoExport");
const businessSlaPresetTodayBtn = document.getElementById("businessSlaPresetToday");
const businessSlaPreset7dBtn = document.getElementById("businessSlaPreset7d");
const businessSlaPreset30dBtn = document.getElementById("businessSlaPreset30d");
const businessSlaExportClearBtn = document.getElementById("businessSlaExportClearBtn");
const businessSlaExportBtn = document.getElementById("businessSlaExportBtn");
const businessInquiryRowsEl = document.getElementById("businessInquiryRows");
const businessPipelineBoardEl = document.getElementById("businessPipelineBoard");
const pipelineCountNewEl = document.getElementById("pipelineCountNew");
const pipelineCountDiscoveryEl = document.getElementById("pipelineCountDiscovery");
const pipelineCountQuotedEl = document.getElementById("pipelineCountQuoted");
const pipelineCountInProgressEl = document.getElementById("pipelineCountInProgress");
const pipelineCountDeliveredEl = document.getElementById("pipelineCountDelivered");
const pipelineCountDeclinedEl = document.getElementById("pipelineCountDeclined");
const businessKpiTotalInquiriesEl = document.getElementById("businessKpiTotalInquiries");
const businessKpiConversionRateEl = document.getElementById("businessKpiConversionRate");
const businessKpiQuotedBudgetEl = document.getElementById("businessKpiQuotedBudget");
const businessKpiActivePipelineEl = document.getElementById("businessKpiActivePipeline");
const businessKpiSLABreachedEl = document.getElementById("businessKpiSLABreached");
const businessSlaStripEl = document.getElementById("businessSlaStrip");
const businessSlaStripTextEl = document.getElementById("businessSlaStripText");
const businessSlaStripFilterBtn = document.getElementById("businessSlaStripFilterBtn");
const businessSlaStripExportBtn = document.getElementById("businessSlaStripExportBtn");
const businessSlaStripRevertAllBtn = document.getElementById("businessSlaStripRevertAllBtn");
const timelineModal = document.getElementById("timelineModal");
const timelineCloseBtn = document.getElementById("timelineCloseBtn");
const timelineCompanyName = document.getElementById("timelineCompanyName");
const timelineStatus = document.getElementById("timelineStatus");
const timelineAge = document.getElementById("timelineAge");
const timelineSLAMetrics = document.getElementById("timelineSLAMetrics");
const timelineStageList = document.getElementById("timelineStageList");

// ─── EMERGENCY SCREEN ELEMENTS ────────────────────────────────────────────────
const emergencyLockoutBannerEl = document.getElementById("emergencyLockoutBanner");
const emergencyBannerTextEl = document.getElementById("emergencyBannerText");
const emergencyBannerLevelEl = document.getElementById("emergencyBannerLevel");
const emergencyBannerSinceEl = document.getElementById("emergencyBannerSince");
const emergencyOwnerPasswordEl = document.getElementById("emergencyOwnerPasswordInput");
const emergencyRecoveryKeyEl = document.getElementById("emergencyRecoveryKeyInput");
const emergencySilentModeEl = document.getElementById("emergencySilentModeToggle");
const emergencyLockoutBtn = document.getElementById("emergencyLockoutBtn");
const emergencyShutdownBtn = document.getElementById("emergencyShutdownBtn");
const emergencyNuclearBtn = document.getElementById("emergencyNuclearBtn");
const emergencyActionStatusEl = document.getElementById("emergencyActionStatus");
const emergencyRestoreBtn = document.getElementById("emergencyRestoreBtn");
const emergencyRestoreStatusEl = document.getElementById("emergencyRestoreStatus");
const emergencyStatusDisplayEl = document.getElementById("emergencyStatusDisplay");
const emergencyRefreshStatusBtn = document.getElementById("emergencyRefreshStatusBtn");
const emergencyPurgeSessionsBtn = document.getElementById("emergencyPurgeSessionsBtn");
const emergencySessionStatusEl = document.getElementById("emergencySessionStatus");
const emergencyBlacklistTypeEl = document.getElementById("emergencyBlacklistType");
const emergencyBlacklistValueEl = document.getElementById("emergencyBlacklistValue");
const emergencyBlacklistAddBtn = document.getElementById("emergencyBlacklistAddBtn");
const emergencyBlacklistRemoveBtn = document.getElementById("emergencyBlacklistRemoveBtn");
const emergencyBlacklistStatusEl = document.getElementById("emergencyBlacklistStatus");
const emergencyBlacklistDisplayEl = document.getElementById("emergencyBlacklistDisplay");
const emergencyBlacklistIpCountEl = document.getElementById("emergencyBlacklistIpCount");
const emergencyBlacklistDiscordCountEl = document.getElementById("emergencyBlacklistDiscordCount");
const emergencyBlacklistSessionCountEl = document.getElementById("emergencyBlacklistSessionCount");
const emergencyBlacklistIpListEl = document.getElementById("emergencyBlacklistIpList");
const emergencyBlacklistDiscordListEl = document.getElementById("emergencyBlacklistDiscordList");
const emergencyBlacklistSessionListEl = document.getElementById("emergencyBlacklistSessionList");
const emergencyLoadBlacklistBtn = document.getElementById("emergencyLoadBlacklistBtn");
const emergencyAbuseLogListEl = document.getElementById("emergencyAbuseLogList");
const emergencyLoadAbuseLogBtn = document.getElementById("emergencyLoadAbuseLogBtn");

const toggleBotBtn = document.getElementById("toggleBotBtn");
const saveStatsBtn = document.getElementById("saveStatsBtn");
const announceBtn = document.getElementById("announceBtn");
const refreshMetricsBtn = document.getElementById("refreshMetricsBtn");
const exportAuditBtn = document.getElementById("exportAuditBtn");
const loginBtn = document.getElementById("loginBtn");
const discordLoginBtn = document.getElementById("discordLoginBtn");
const discordSyncBtn = document.getElementById("discordSyncBtn");
const discordSyncRow = document.getElementById("discordSyncRow");
const authTabEmail = document.getElementById("authTabEmail");
const authTabDiscordId = document.getElementById("authTabDiscordId");
const logoutBtn = document.getElementById("logoutBtn");

const guildCountInput = document.getElementById("guildCountInput");
const usersServedInput = document.getElementById("usersServedInput");
const economyBalanceInput = document.getElementById("economyBalanceInput");
const announcementInput = document.getElementById("announcementInput");
const operatorPasswordInput = document.getElementById("operatorPasswordInput");
const operatorDiscordIdInput = document.getElementById("operatorDiscordIdInput");
const operatorEmailInput = document.getElementById("operatorEmailInput");

// Auth login method tab switching — Email ↔ Discord ID
if (authTabEmail instanceof HTMLElement && authTabDiscordId instanceof HTMLElement) {
  authTabEmail.addEventListener("click", () => {
    authTabEmail.classList.add("active");
    authTabDiscordId.classList.remove("active");
    if (operatorEmailInput instanceof HTMLElement) operatorEmailInput.classList.remove("auth-input-hidden");
    if (operatorDiscordIdInput instanceof HTMLElement) operatorDiscordIdInput.classList.add("auth-input-hidden");
  });
  authTabDiscordId.addEventListener("click", () => {
    authTabDiscordId.classList.add("active");
    authTabEmail.classList.remove("active");
    if (operatorDiscordIdInput instanceof HTMLElement) operatorDiscordIdInput.classList.remove("auth-input-hidden");
    if (operatorEmailInput instanceof HTMLElement) operatorEmailInput.classList.add("auth-input-hidden");
  });
}

let isAuthenticated = false;
let isOwnerAuthenticated = false;
// Emergency lockout state (mirrored from server)
let systemLockoutActive = false;
let systemLockoutLevel = null;
let localMachineBots = [];
let isLocalMachineBotsMode = false;
let catalogItems = [];
let offeringItems = [];
let offeringAudienceFilter = "all";
let buildLibraryRows = [];
let businessServices = [];
let businessInquiries = [];
let businessPipelineRows = [];
let businessInquirySortMode = "breach-first";
let businessStageOptions = ["new", "discovery", "quoted", "in-progress", "delivered", "declined"];
let businessSlaConfig = {
  new: 48,
  discovery: 72,
  quoted: 120,
  "in-progress": 240,
  delivered: 0,
  declined: 0
};
let allOrders = [];
let ownerClients = [];
let lastLedgerRows = [];
let lastEconomyBalance = 0;
// Short-lived cache for /api/owner/overview so Payments/Services/Enforcement
// tabs share a single fetch instead of each firing independently.
let ownerOverviewCache = null;
let ownerOverviewCacheAt = 0;
const OWNER_OVERVIEW_CACHE_TTL_MS = 8000;
const themes = ["ops-neon", "tactical-copper", "executive-blue"];
const BEST_THEME = "executive-blue";
const DECK_METER_CIRCUMFERENCE = 2 * Math.PI * 28;
const SCREEN_TRANSITION_MS = 420;
const counterAnimationFrames = new WeakMap();
const kpiSparkHistory = new WeakMap();
const kpiSparkPath = new WeakMap();
const UI_PREFS_KEY = "trh_ui_prefs";
const NAV_LAST_SCREEN_KEY = "trh_last_screen";
const defaultUiPrefs = {
  density: "comfortable",
  reducedMotion: false,
  compactLogs: false
};
const BOT_IMAGE_BY_ID = {
  "trh-starter-bot": "/assets/bots/starter.svg",
  "trh-growth-bot": "/assets/bots/growth.svg",
  "trh-enterprise-bot": "/assets/bots/enterprise.svg",
  "retreats-bot": "/assets/bots/retreats-bot.svg",
  "longpine-bot": "/assets/bots/longpine-bot.svg",
  "maddo-gaming-bot": "/assets/bots/maddo-gaming-bot.svg",
  "trh-development-bot": "/assets/bots/trh-development-bot.svg",
  "vexora-bot": "/assets/bots/vexora-bot.svg",
  "midnight-pine-bot": "/assets/bots/midnight-pine-bot.svg",
  "shadows-of-ruin-bot": "/assets/bots/shadows-of-ruin-bot.svg",
  "logo-starter": "/assets/tiers/logo-starter.svg",
  "logo-growth": "/assets/tiers/logo-growth.svg",
  "logo-pro": "/assets/tiers/logo-pro.svg",
  "logo-elite": "/assets/tiers/logo-elite.svg",
  "discord-setup-starter": "/assets/tiers/discord-setup-starter.svg",
  "discord-setup-growth": "/assets/tiers/discord-setup-growth.svg",
  "discord-setup-pro": "/assets/tiers/discord-setup-pro.svg",
  "discord-setup-elite": "/assets/tiers/discord-setup-elite.svg",
  "discord-template-basic": "/assets/tiers/discord-template-basic.svg",
  "discord-template-standard": "/assets/tiers/discord-template-standard.svg",
  "discord-template-premium": "/assets/tiers/discord-template-premium.svg",
  "sub-free": "/assets/tiers/sub-free.svg",
  "sub-vip": "/assets/tiers/sub-vip.svg",
  "sub-pro": "/assets/tiers/sub-pro.svg"
};
const CATALOG_IMAGE_BY_KIND = {
  rank: "/assets/catalog/rank.svg",
  role: "/assets/catalog/role.svg",
  "buyout-plan": "/assets/catalog/buyout.svg",
  "build-plan": "/assets/catalog/build-plan.svg",
  "custom-bot": "/assets/catalog/custom-bot.svg"
};
const CATALOG_IMAGE_BY_TYPE = {
  setup: "/assets/catalog/discord-setup.svg",
  template: "/assets/catalog/discord-template.svg"
};
const BUSINESS_IMAGE_BY_CATEGORY = {
  bots: "/assets/business/bots.svg",
  dashboards: "/assets/business/dashboards.svg",
  scripts: "/assets/business/scripts.svg",
  automation: "/assets/business/automation.svg"
};
const LOCAL_MACHINE_BOT_IMAGE = "/assets/bots/local-machine.svg";
const BOT_IMAGE_FALLBACK_SRC = "/assets/trh-logo.svg";
const SAFE_IMAGE_PROTOCOLS = new Set(["http:", "https:"]);
let imageFallbackGuardInstalled = false;
let uiPrefs = { ...defaultUiPrefs };
let activeScreenId = null;
let screenTransitionTimer = null;
let navJumpSelectEl = null;

function isTypingTarget(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  return element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.isContentEditable;
}

function hideLoadingGate() {
  if (!loadingGateEl) {
    return;
  }
  loadingGateEl.classList.add("hidden");
}

function statusClassFromPrefix(prefix, value) {
  const raw = String(value || "pending").toLowerCase();
  const normalized = raw.replace(/[^a-z0-9_-]/g, "-");
  return `${prefix}-${normalized}`;
}

function formatStatusChip(label, value, prefix) {
  const safe = String(value || "pending");
  return `<span class="status-chip ${statusClassFromPrefix(prefix, safe)}">${label}: ${safe}</span>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveMappedImageUrl(itemId, itemKind, itemType, itemCategory, isLocalMachine) {
  if (isLocalMachine) {
    return LOCAL_MACHINE_BOT_IMAGE;
  }

  if (itemId && BOT_IMAGE_BY_ID[itemId]) {
    return BOT_IMAGE_BY_ID[itemId];
  }

  if (itemKind && CATALOG_IMAGE_BY_KIND[itemKind]) {
    return CATALOG_IMAGE_BY_KIND[itemKind];
  }

  if (itemType && CATALOG_IMAGE_BY_TYPE[itemType]) {
    return CATALOG_IMAGE_BY_TYPE[itemType];
  }

  if (itemId.startsWith("logo-")) {
    return "/assets/catalog/logo-service.svg";
  }

  if (itemId.startsWith("sub-")) {
    return "/assets/catalog/subscription.svg";
  }

  if (itemCategory && BUSINESS_IMAGE_BY_CATEGORY[itemCategory]) {
    return BUSINESS_IMAGE_BY_CATEGORY[itemCategory];
  }

  return "";
}

function sanitizeImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    if (!SAFE_IMAGE_PROTOCOLS.has(parsed.protocol)) {
      return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
}

function resolveBotImageUrl(item) {
  const itemId = String((item && item.id) || (item && item.botId) || "").trim().toLowerCase();
  const itemKind = String((item && item.kind) || "").trim().toLowerCase();
  const itemType = String((item && item.type) || "").trim().toLowerCase();
  const itemCategory = String((item && item.category) || "").trim().toLowerCase();
  const isLocalMachine = String(item && item.inventoryType || "").toLowerCase() === "local-machine";

  const mapped = resolveMappedImageUrl(itemId, itemKind, itemType, itemCategory, isLocalMachine);
  if (mapped) {
    return mapped;
  }

  const candidate =
    (item && item.imageUrl) ||
    (item && item.image) ||
    (item && item.thumbnailUrl) ||
    (item && item.thumbnail) ||
    "";
  const safe = sanitizeImageUrl(candidate);
  return safe || BOT_IMAGE_FALLBACK_SRC;
}

function classifyImageSource(item) {
  const resolved = String(resolveBotImageUrl(item) || "").trim();
  if (!resolved || resolved === BOT_IMAGE_FALLBACK_SRC) {
    return "fallback";
  }
  if (/^https?:\/\//i.test(resolved)) {
    return "external";
  }
  return "mapped";
}

function buildBotImageMarkup(item, altText, extraClass = "") {
  const imageUrl = escapeHtml(resolveBotImageUrl(item));
  const alt = escapeHtml(altText || "TRH bot package");
  const className = ["bot-card-image", extraClass].filter(Boolean).join(" ");
  const fallbackSrc = escapeHtml(BOT_IMAGE_FALLBACK_SRC);
  return `<img class="${className}" src="${imageUrl}" alt="${alt}" loading="lazy" decoding="async" data-fallback-src="${fallbackSrc}" />`;
}

function installImageFallbackGuard() {
  if (imageFallbackGuardInstalled) {
    return;
  }
  imageFallbackGuardInstalled = true;

  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) {
        return;
      }
      if (!target.classList.contains("bot-card-image")) {
        return;
      }

      const fallbackSrc = String(target.getAttribute("data-fallback-src") || BOT_IMAGE_FALLBACK_SRC).trim();
      const currentSrc = String(target.getAttribute("src") || "").trim();
      if (!fallbackSrc || currentSrc === fallbackSrc) {
        return;
      }

      target.setAttribute("src", fallbackSrc);
    },
    true
  );
}

function formatDurationFromHours(hours) {
  const safeHours = Number.isFinite(hours) && hours >= 0 ? Math.floor(hours) : 0;
  if (safeHours < 24) {
    return `${safeHours}h`;
  }
  return `${Math.floor(safeHours / 24)}d ${safeHours % 24}h`;
}

function getInquiryAgingMeta(row) {
  const createdAtMs = Date.parse(String(row.createdAt || ""));
  const createdAtSafe = Number.isFinite(createdAtMs) ? createdAtMs : Date.now();
  const stageHistory = Array.isArray(row.stageHistory) ? row.stageHistory : [];
  const stageAtMs = stageHistory.length > 0 ? Date.parse(String(stageHistory[0].at || "")) : createdAtSafe;
  const stageAtSafe = Number.isFinite(stageAtMs) ? stageAtMs : createdAtSafe;
  const now = Date.now();

  const totalAgeHours = Math.max(0, Math.floor((now - createdAtSafe) / (1000 * 60 * 60)));
  const stageAgeHours = Math.max(0, Math.floor((now - stageAtSafe) / (1000 * 60 * 60)));
  const status = String(row.status || "new").toLowerCase();
  const slaHours = Number(businessSlaConfig[status] || 0);
  const isBreached = slaHours > 0 && stageAgeHours > slaHours;
  const remainingHours = slaHours > 0 ? slaHours - stageAgeHours : null;

  return {
    status,
    totalAgeHours,
    stageAgeHours,
    slaHours,
    isBreached,
    remainingHours
  };
}

function isInquirySimulated(row) {
  if (row && row.simulationMeta && row.simulationMeta.originalStageAt) {
    return true;
  }
  const firstEntry = Array.isArray(row.stageHistory) && row.stageHistory.length > 0 ? row.stageHistory[0] : null;
  const note = String((firstEntry || {}).note || "").toLowerCase();
  return note.includes("simulated breach");
}

function comparePipelineRowsInStage(a, b) {
  const aMeta = getInquiryAgingMeta(a);
  const bMeta = getInquiryAgingMeta(b);

  if (aMeta.isBreached !== bMeta.isBreached) {
    return aMeta.isBreached ? -1 : 1;
  }

  if (aMeta.stageAgeHours !== bMeta.stageAgeHours) {
    return bMeta.stageAgeHours - aMeta.stageAgeHours;
  }

  return getBusinessRowTimestamp(a) - getBusinessRowTimestamp(b);
}

function getBusinessRowTimestamp(row) {
  const t = Date.parse(String(row.createdAt || row.updatedAt || ""));
  return Number.isFinite(t) ? t : 0;
}

function compareBusinessRows(a, b) {
  const aMeta = getInquiryAgingMeta(a);
  const bMeta = getInquiryAgingMeta(b);

  if (businessInquirySortMode === "oldest") {
    return getBusinessRowTimestamp(a) - getBusinessRowTimestamp(b);
  }

  if (businessInquirySortMode === "newest") {
    return getBusinessRowTimestamp(b) - getBusinessRowTimestamp(a);
  }

  if (businessInquirySortMode === "budget-high") {
    return Number(b.budgetUsd || 0) - Number(a.budgetUsd || 0);
  }

  if (aMeta.isBreached !== bMeta.isBreached) {
    return aMeta.isBreached ? -1 : 1;
  }
  if (aMeta.stageAgeHours !== bMeta.stageAgeHours) {
    return bMeta.stageAgeHours - aMeta.stageAgeHours;
  }
  return getBusinessRowTimestamp(a) - getBusinessRowTimestamp(b);
}

function refreshBusinessAgingVisuals() {
  if (!isAuthenticated) {
    return;
  }
  if (businessInquiries.length > 0) {
    renderBusinessInquiries(businessInquiries);
  }
  if (businessPipelineRows.length > 0) {
    renderBusinessPipelineBoard(businessPipelineRows);
  }
}

const ACTIVITY_LABELS = {
  systemHeartbeat:      "❤ HEARTBEAT",
  economyCheck:         "💰 ECONOMY",
  userMilestone:        "👥 USERS",
  deliveryQueue:        "📦 DELIVERY",
  botHeartbeat:         "🤖 BOT",
  sessionSweep:         "🔐 SESSIONS",
  rateGuard:            "🛡 RATE GUARD",
  commerceSync:         "🛒 COMMERCE",
  paymentStateChanged:  "💳 PAYMENT",
  paymentDowngrade:     "⚠ DOWNGRADE",
  userBlacklisted:      "🚫 BLACKLIST",
  userUnblacklisted:    "✓ RESTORED",
  userFrozen:           "❄ FROZEN",
  userRestored:         "✓ UNFROZEN",
  emergencySessionPurge:"⚠ PURGE",
  botTelemetry:         "📡 TELEMETRY",
  ownerUnlocked:        "🔑 OWNER UNLOCK",
};

function updateActivityTicker(actions) {
  if (!(activityTickerTrackEl instanceof HTMLElement)) {
    return;
  }

  const live = (actions || []).filter((a) => a.command !== "autoTelemetry");

  if (live.length === 0) {
    activityTickerTrackEl.textContent = "▸  TRH Control Panel — all systems operational  ◂";
    return;
  }

  const chunks = live.slice(0, 10).map((action) => {
    const time = action.at ? new Date(action.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";
    const label = ACTIVITY_LABELS[action.command] || action.command.replace(/([A-Z])/g, " $1").toUpperCase().trim();
    return `[${time}]  ${label}  —  ${action.value}`;
  });
  activityTickerTrackEl.textContent = `▸  ${chunks.join("   ◆   ")}  ◂`;
}

function setupRevealAnimations() {
  if (document.body.classList.contains("reduced-motion")) {
    const reducedTargets = document.querySelectorAll(".card, .kpi, .market-item, .order-row, .hero-banner");
    reducedTargets.forEach((el) => {
      el.classList.add("reveal-target");
      el.classList.add("revealed");
    });
    return;
  }

  const targets = document.querySelectorAll(".card, .kpi, .market-item, .order-row, .hero-banner");
  targets.forEach((el) => el.classList.add("reveal-target"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

function ensureKpiSparkline(strongEl) {
  if (!(strongEl instanceof HTMLElement)) {
    return null;
  }

  const container = strongEl.closest(".kpi");
  if (!container) {
    return null;
  }

  let path = kpiSparkPath.get(strongEl);
  if (path) {
    return path;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("kpi-trend");
  svg.setAttribute("viewBox", "0 0 100 26");
  svg.setAttribute("preserveAspectRatio", "none");

  path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.appendChild(path);
  container.appendChild(svg);
  kpiSparkPath.set(strongEl, path);
  return path;
}

function updateKpiSparkline(strongEl, value) {
  const path = ensureKpiSparkline(strongEl);
  if (!path) {
    return;
  }

  const history = kpiSparkHistory.get(strongEl) || [];
  history.push(Number(value) || 0);
  while (history.length > 18) {
    history.shift();
  }
  kpiSparkHistory.set(strongEl, history);

  if (history.length === 1) {
    path.setAttribute("d", "M 0 13 L 100 13");
    return;
  }

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const points = history.map((entry, index) => {
    const x = (index / (history.length - 1)) * 100;
    const y = 22 - ((entry - min) / range) * 18;
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  path.setAttribute("d", `M ${points.join(" L ")}`);
}

function getTierClass(botId) {
  if (botId === "trh-starter-bot") {
    return "tier-starter";
  }
  if (botId === "trh-growth-bot") {
    return "tier-growth";
  }
  if (botId === "trh-enterprise-bot") {
    return "tier-enterprise";
  }

  return "";
}

function getTierLabel(botId) {
  if (botId === "trh-starter-bot") {
    return "Starter Tier";
  }
  if (botId === "trh-growth-bot") {
    return "Growth Tier";
  }
  if (botId === "trh-enterprise-bot") {
    return "Enterprise Tier";
  }

  return "TRH Package";
}

function setDeckMeter(ringEl, metricEl, detailEl, ratio, metricText, detailText) {
  if (!(ringEl instanceof SVGElement) || !(metricEl instanceof HTMLElement) || !(detailEl instanceof HTMLElement)) {
    return;
  }

  const clamped = Math.max(0, Math.min(1, Number(ratio) || 0));
  ringEl.style.strokeDasharray = `${DECK_METER_CIRCUMFERENCE}`;
  ringEl.style.strokeDashoffset = `${DECK_METER_CIRCUMFERENCE * (1 - clamped)}`;
  metricEl.textContent = metricText;
  detailEl.textContent = detailText;
}

function renderDeckTelemetry(platform = {}) {
  const botPackages = Number(platform.botPackages || catalogItems.length || 0);
  const totalOrders = Number(platform.totalOrders || 0);
  const totalModules = Number(platform.totalModules || 0);
  const readyToProvision = Number(platform.readyToProvision || 0);
  const deliveredOrders = Number(platform.deliveredOrders || 0);
  const revenueUsd = Number(platform.revenueUsd || 0);

  setDeckMeter(
    opsDeckRingEl,
    opsDeckMetricEl,
    opsDeckDetailEl,
    botPackages / Math.max(6, catalogItems.length || 1),
    botPackages.toLocaleString(),
    `${readyToProvision.toLocaleString()} ready, ${deliveredOrders.toLocaleString()} delivered`
  );
  setDeckMeter(
    commerceDeckRingEl,
    commerceDeckMetricEl,
    commerceDeckDetailEl,
    totalOrders / Math.max(12, botPackages * 4 || 1),
    totalOrders.toLocaleString(),
    `$${revenueUsd.toLocaleString()} revenue tracked`
  );
  setDeckMeter(
    deliveryDeckRingEl,
    deliveryDeckMetricEl,
    deliveryDeckDetailEl,
    totalModules / Math.max(18, botPackages * 8 || 1),
    totalModules.toLocaleString(),
    `${buildLibraryRows.length.toLocaleString()} package blueprints loaded`
  );
}

function animateCounter(el, targetNumber) {
  if (!el) {
    return;
  }

  const target = Number(targetNumber) || 0;
  const previous = Number(el.dataset.counterValue || 0);

  if (counterAnimationFrames.has(el)) {
    cancelAnimationFrame(counterAnimationFrames.get(el));
  }

  if (previous === target) {
    el.textContent = target.toLocaleString();
    el.dataset.counterValue = String(target);
    updateKpiSparkline(el, target);
    counterAnimationFrames.delete(el);
    return;
  }

  updateKpiSparkline(el, target);

  const duration = 360;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(previous + (target - previous) * eased);
    el.textContent = value.toLocaleString();

    if (progress < 1) {
      const raf = requestAnimationFrame(step);
      counterAnimationFrames.set(el, raf);
      return;
    }

    el.dataset.counterValue = String(target);
    counterAnimationFrames.delete(el);
  };

  const raf = requestAnimationFrame(step);
  counterAnimationFrames.set(el, raf);
}

function render(state) {
  botOnlineEl.textContent = state.botOnline ? "ONLINE" : "OFFLINE";
  botOnlineEl.className = state.botOnline ? "value online" : "value offline";

  animateCounter(guildCountEl, Number(state.guildCount || 0));
  animateCounter(usersServedEl, Number(state.usersServed || 0));
  animateCounter(economyBalanceEl, Number(state.economyBalance || 0));
  lastEconomyBalance = Number(state.economyBalance || 0);

  guildCountInput.value = Number(state.guildCount || 0);
  usersServedInput.value = Number(state.usersServed || 0);
  economyBalanceInput.value = Number(state.economyBalance || 0);

  recentActionsEl.innerHTML = "";
  const displayActions = (state.recentActions || []).filter((a) => a.command !== "autoTelemetry");
  for (const action of displayActions) {
    const item = document.createElement("li");
    const label = ACTIVITY_LABELS[action.command] || action.command.replace(/([A-Z])/g, " $1").toUpperCase().trim();
    item.textContent = `[${new Date(action.at).toLocaleTimeString()}]  ${label}  —  ${action.value}`;
    recentActionsEl.appendChild(item);
  }

  updateActivityTicker(state.recentActions || []);
}

function renderMetrics(metrics) {
  animateCounter(wsClientsEl, Number(metrics.wsClients || 0));
  animateCounter(memoryRssMbEl, Number(metrics.memoryRssMb || 0));
  animateCounter(txCount24hEl, Number(metrics.txCount24h || 0));
  animateCounter(txVolume24hEl, Number(metrics.txVolume24h || 0));
  lastUpdateAtEl.textContent = `Last update: ${metrics.lastUpdateAt ? new Date(metrics.lastUpdateAt).toLocaleString() : "-"}`;
}

function renderLedger(rows) {
  lastLedgerRows = rows || [];
  ledgerRowsEl.innerHTML = "";
  for (const row of rows || []) {
    const item = document.createElement("li");
    item.textContent = `[${new Date(row.at).toLocaleTimeString()}] ${row.txId} | ${row.delta} | ${row.reason} | bal=${row.balanceAfter}`;
    ledgerRowsEl.appendChild(item);
  }

  if (!rows || rows.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No economy transactions recorded yet.";
    ledgerRowsEl.appendChild(empty);
  }
}

function evaluateEconomyAnomaly() {
  if (!isAuthenticated) {
    economyAnomalyStripEl.hidden = true;
    return;
  }

  const notes = [];
  const hasNegativeBalance = (lastLedgerRows || []).some((row) => Number(row.balanceAfter) < 0);
  if (hasNegativeBalance) {
    notes.push("negative balance detected in ledger");
  }

  const hasLargeTx = (lastLedgerRows || []).some((row) => Math.abs(Number(row.delta || 0)) > 1000000);
  if (hasLargeTx) {
    notes.push("abnormally large transaction delta");
  }

  const txIds = new Set();
  let duplicateTx = false;
  for (const row of lastLedgerRows || []) {
    if (txIds.has(row.txId)) {
      duplicateTx = true;
      break;
    }
    txIds.add(row.txId);
  }
  if (duplicateTx) {
    notes.push("duplicate transaction IDs in recent ledger");
  }

  const highVolume = Number(txVolume24hEl.dataset.counterValue || 0);
  if (lastEconomyBalance > 0 && highVolume > lastEconomyBalance * 4) {
    notes.push("24h transaction volume exceeds expected balance threshold");
  }

  if (notes.length === 0) {
    economyAnomalyStripEl.hidden = true;
    return;
  }

  economyAnomalyTextEl.textContent = notes.join(" | ");
  economyAnomalyStripEl.hidden = false;
}

function setStatus(message, kind = "ok") {
  statusLineEl.textContent = message;
  statusLineEl.className = `status-line ${kind}`;
}

function consumeAuthQueryFeedback() {
  const params = new URLSearchParams(window.location.search || "");
  const auth = String(params.get("auth") || "").trim();
  if (!auth) {
    return false;
  }

  if (auth === "discord-success") {
    const owner = params.get("owner") === "1";
    const mode = String(params.get("mode") || "").trim().toLowerCase();
    if (mode === "dev-fallback") {
      setStatus("Discord dev fallback login enabled. Operator control surface unlocked.");
    } else {
      setStatus(owner
        ? "Discord login successful. Owner access unlocked from allowlisted Discord ID."
        : "Discord login successful. Operator control surface unlocked.");
    }
  } else if (auth === "discord-unavailable") {
    setStatus("Discord login is not configured on this server.", "error");
  } else if (auth === "discord-rate-limit") {
    const retryIn = String(params.get("retryIn") || "").trim();
    setStatus(`Too many login attempts. Retry in ${retryIn || "a few"} seconds.`, "error");
  } else if (auth === "discord-failed") {
    setStatus("Discord login failed. Please try again.", "error");
  } else if (auth === "sync-success") {
    const did = String(params.get("discordId") || "").trim();
    setStatus(did ? `Discord profile synced (ID: ${did}). Your Discord ID and email are now linked to this session.` : "Discord profile synced successfully.");
    params.delete("discordId");
  } else if (auth === "sync-unavailable" || auth === "sync-unauthenticated") {
    setStatus("Discord sync is not available. Ensure Discord OAuth is configured and you are logged in.", "error");
  } else if (auth === "sync-failed") {
    setStatus("Discord profile sync failed. Please try again.", "error");
  }

  params.delete("auth");
  params.delete("owner");
  params.delete("retryIn");
  params.delete("mode");
  params.delete("discordId");
  const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", next);
  return true;
}

function setPurchaseStatus(message, kind = "ok") {
  purchaseStatusEl.textContent = message;
  purchaseStatusEl.className = `status-line ${kind}`;
}

function setBusinessInquiryStatus(message, kind = "ok") {
  businessInquiryStatusEl.textContent = message;
  businessInquiryStatusEl.className = `status-line ${kind}`;
}

function setBusinessQuotePreview(text) {
  businessQuotePreviewEl.textContent = text;
}

function getFilteredLocalMachineBots() {
  const search = myBotsSearchEl instanceof HTMLInputElement ? myBotsSearchEl.value.trim().toLowerCase() : "";
  const activeFilter = myBotsActiveFilterEl instanceof HTMLSelectElement ? myBotsActiveFilterEl.value : "all";
  let rows = Array.isArray(localMachineBots) ? [...localMachineBots] : [];

  if (activeFilter === "active") {
    rows = rows.filter((bot) => Boolean(bot.active));
  } else if (activeFilter === "inactive") {
    rows = rows.filter((bot) => !bot.active);
  }

  if (search) {
    rows = rows.filter((bot) => {
      const haystack = [bot.botName, bot.localPath, bot.runtime, bot.source].map((v) => String(v || "").toLowerCase()).join(" ");
      return haystack.includes(search);
    });
  }

  return rows;
}

function applyLocalMachineBotFilters() {
  if (!isLocalMachineBotsMode) {
    return;
  }

  const filtered = getFilteredLocalMachineBots();
  renderMyBots(filtered);
  setMyBotsStatus(`Loaded ${filtered.length} local bot(s) on this PC (filtered from ${localMachineBots.length}).`);
}

async function loadLocalMachineBots() {
  const localRes = await fetch("/api/local/bots", { credentials: "same-origin" });
  const localBody = await localRes.json().catch(() => ({ ok: false, error: "Local bot discovery failed" }));
  if (!localRes.ok || !localBody.ok) {
    throw new Error(localBody.error || "Local bot discovery failed");
  }

  localMachineBots = Array.isArray(localBody.bots) ? localBody.bots : [];
  isLocalMachineBotsMode = true;
  portfolioSummaryEl.innerHTML = "";
  portfolioListEl.innerHTML = "";
  setPortfolioStatus("Local machine mode: purchase portfolio hidden.");
  applyLocalMachineBotFilters();
}

function setSettingsConfigExportStatus(message, kind = "ok") {
  if (!(settingsConfigExportStatusEl instanceof HTMLElement)) {
    return;
  }
  settingsConfigExportStatusEl.textContent = message;
  settingsConfigExportStatusEl.className = `status-line meta-line ${kind}`;
}

async function exportOwnerConfigHealth(format) {
  const normalized = String(format || "json").toLowerCase() === "csv" ? "csv" : "json";
  const response = await fetch(`/api/owner/config-health/export?format=${encodeURIComponent(normalized)}`, {
    credentials: "same-origin"
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ ok: false, error: "Config export failed" }));
    throw new Error(body.error || "Config export failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trh-config-health-${Date.now()}.${normalized}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatUsd(value) {
  return `$${Number(value || 0).toLocaleString()} USD`;
}

function buildPricingMarkup(item, label = "Launch Price") {
  const currentPrice = Number(item.priceUsd || 0);
  const originalPrice = Number(item.originalPriceUsd || 0);
  const hasOriginalPrice = originalPrice > currentPrice;
  const savings = hasOriginalPrice ? originalPrice - currentPrice : 0;

  return `
    <div class="price-stack">
      ${item.pricingBadge ? `<span class="price-badge">${item.pricingBadge}</span>` : ""}
      <div class="price-line">
        <span class="price-label">${label}</span>
        <strong class="market-price">${formatUsd(currentPrice)}</strong>
      </div>
      ${hasOriginalPrice ? `<p class="price-compare">Was ${formatUsd(originalPrice)}. Save ${formatUsd(savings)}.</p>` : ""}
      ${item.pricingNote ? `<p class="price-note">${item.pricingNote}</p>` : ""}
    </div>
  `;
}

function getScreenOrder() {
  return Array.from(document.querySelectorAll("#screenTabs .tab-btn"))
    .map((tab) => tab.dataset.screen)
    .filter(Boolean);
}

function getScreenLabel(screenId) {
  const tab = document.querySelector(`#screenTabs .tab-btn[data-screen="${screenId}"]`);
  if (tab instanceof HTMLElement) {
    return String(tab.textContent || screenId).trim();
  }
  return screenId;
}

function refreshNavigationAssistOptions() {
  if (!(navJumpSelectEl instanceof HTMLSelectElement)) {
    return;
  }

  const order = getScreenOrder();
  const options = order
    .map((screenId) => `<option value="${escapeHtml(screenId)}">${escapeHtml(getScreenLabel(screenId))}</option>`)
    .join("");

  navJumpSelectEl.innerHTML = options;
  if (activeScreenId && order.includes(activeScreenId)) {
    navJumpSelectEl.value = activeScreenId;
  }
}

function moveScreen(delta) {
  const order = getScreenOrder();
  if (order.length === 0) {
    return;
  }
  const current = Math.max(0, order.indexOf(activeScreenId));
  const next = (current + delta + order.length) % order.length;
  setActiveScreen(order[next]);
}

function getInitialScreenId() {
  const saved = String(localStorage.getItem(NAV_LAST_SCREEN_KEY) || "").trim();
  if (saved && getScreenOrder().includes(saved)) {
    return saved;
  }
  return "homeScreen";
}

function initNavigationAssist() {
  const actions = document.querySelector(".topbar-actions");
  if (!(actions instanceof HTMLElement)) {
    return;
  }

  if (document.getElementById("navAssist")) {
    navJumpSelectEl = document.getElementById("navJumpSelect");
    refreshNavigationAssistOptions();
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "navAssist";
  wrapper.className = "nav-assist";
  wrapper.innerHTML = `
    <button id="navPrevBtn" type="button" class="button ghost tiny" title="Previous screen (Alt+Left)">Prev</button>
    <select id="navJumpSelect" aria-label="Jump to screen"></select>
    <button id="navNextBtn" type="button" class="button ghost tiny" title="Next screen (Alt+Right)">Next</button>
  `;

  const searchWrap = actions.querySelector(".topbar-search-wrap");
  if (searchWrap) {
    actions.insertBefore(wrapper, searchWrap);
  } else {
    actions.prepend(wrapper);
  }

  const prevBtn = document.getElementById("navPrevBtn");
  navJumpSelectEl = document.getElementById("navJumpSelect");
  const nextBtn = document.getElementById("navNextBtn");

  if (prevBtn instanceof HTMLButtonElement) {
    prevBtn.addEventListener("click", () => moveScreen(-1));
  }
  if (nextBtn instanceof HTMLButtonElement) {
    nextBtn.addEventListener("click", () => moveScreen(1));
  }
  if (navJumpSelectEl instanceof HTMLSelectElement) {
    navJumpSelectEl.addEventListener("change", () => {
      const target = String(navJumpSelectEl.value || "").trim();
      if (target) {
        setActiveScreen(target);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    const activeEl = document.activeElement;

    if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === "k") {
      const searchInput = document.getElementById("globalSearchInput");
      if (searchInput instanceof HTMLInputElement) {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      return;
    }

    if (isTypingTarget(activeEl)) {
      return;
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveScreen(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveScreen(1);
        return;
      }

      const num = Number(event.key);
      if (Number.isInteger(num) && num >= 1 && num <= 9) {
        const order = getScreenOrder();
        const target = order[num - 1];
        if (target) {
          event.preventDefault();
          setActiveScreen(target);
        }
      }
    }
  });

  refreshNavigationAssistOptions();
}

function setActiveScreen(screenId) {
  const targetSection = document.getElementById(screenId);
  if (!(targetSection instanceof HTMLElement)) {
    return;
  }

  const reducedMotion = document.body.classList.contains("reduced-motion");
  const order = getScreenOrder();
  const currentIndex = order.indexOf(activeScreenId);
  const nextIndex = order.indexOf(screenId);
  const direction = currentIndex >= 0 && nextIndex >= 0 && nextIndex < currentIndex ? "backward" : "forward";

  document.body.dataset.screen = screenId;
  document.body.dataset.screenDirection = direction;

  if (screenTransitionTimer) {
    clearTimeout(screenTransitionTimer);
    screenTransitionTimer = null;
  }

  document.body.classList.remove("screen-transitioning");

  const sections = document.querySelectorAll(".screen");
  sections.forEach((section) => {
    const isTarget = section.id === screenId;
    section.dataset.motionDirection = direction;
    section.classList.toggle("active", isTarget);
    section.classList.remove("screen-enter", "screen-stage");

    if (isTarget && !reducedMotion) {
      section.classList.add("screen-stage");
      requestAnimationFrame(() => {
        section.classList.add("screen-enter");
      });
    }
  });

  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.screen === screenId);
    if (tab instanceof HTMLElement) {
      if (tab.dataset.screen === screenId) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    }
  });

  if (!reducedMotion) {
    requestAnimationFrame(() => {
      document.body.classList.add("screen-transitioning");
    });
    screenTransitionTimer = window.setTimeout(() => {
      document.body.classList.remove("screen-transitioning");
      screenTransitionTimer = null;
    }, SCREEN_TRANSITION_MS);
  }

  activeScreenId = screenId;
  localStorage.setItem(NAV_LAST_SCREEN_KEY, screenId);
  if (navJumpSelectEl instanceof HTMLSelectElement) {
    navJumpSelectEl.value = screenId;
  }
  setupRevealAnimations();
}

function setLookupStatus(message, kind = "ok") {
  lookupStatusEl.textContent = message;
  lookupStatusEl.className = `status-line ${kind}`;
}

function setMyBotsStatus(message, kind = "ok") {
  myBotsStatusEl.textContent = message;
  myBotsStatusEl.className = `status-line ${kind}`;
}

function setPortfolioStatus(message, kind = "ok") {
  portfolioStatusEl.textContent = message;
  portfolioStatusEl.className = `status-line ${kind}`;
}

function setOwnerStatus(message, kind = "ok") {
  if (ownerStatusLineEl instanceof HTMLElement) {
    ownerStatusLineEl.textContent = message;
    ownerStatusLineEl.className = `status-line ${kind}`;
  }
}

function setOwnerSystemStatus(message, kind = "ok") {
  if (ownerSystemStatusEl instanceof HTMLElement) {
    ownerSystemStatusEl.textContent = message;
    ownerSystemStatusEl.className = `status-line ${kind}`;
  }
}

function toDateInputFromIso(value) {
  const ts = Date.parse(String(value || ""));
  if (!Number.isFinite(ts)) {
    return "";
  }
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function setOwnerAuthState(enabled) {
  isOwnerAuthenticated = Boolean(enabled);
  if (ownerPanelEl instanceof HTMLElement) {
    ownerPanelEl.hidden = !isOwnerAuthenticated;
  }
  if (ownerAccessCardEl instanceof HTMLElement) {
    ownerAccessCardEl.hidden = isOwnerAuthenticated || !isAuthenticated;
  }
  if (isOwnerAuthenticated) {
    setTimeout(() => {
      loadOwnerDashboard().catch(console.error);
      loadOwnerUsers().catch(console.error);
      loadNewPricingCatalogs().catch(console.error);
    }, 50);
  }
}

function applyTheme(theme) {
  const selected = BEST_THEME;
  document.body.dataset.theme = selected;
  themeSelectEl.value = selected;
}

function setAuthState(authenticated) {
  isAuthenticated = authenticated;
  authCardEl.hidden = authenticated;
  logoutBtn.hidden = !authenticated;
  authBadgeEl.textContent = authenticated ? "AUTHENTICATED" : "LOCKED";
  authBadgeEl.className = authenticated ? "auth-badge ready" : "auth-badge";
  // Show Discord sync row only when logged in
  if (discordSyncRow instanceof HTMLElement) discordSyncRow.hidden = !authenticated;
  // Hide operator chip on logout
  if (!authenticated && operatorChipEl instanceof HTMLElement) {
    operatorChipEl.hidden = true;
    if (operatorLabelEl instanceof HTMLElement) {
      operatorLabelEl.textContent = "";
      operatorLabelEl.title = "";
    }
    if (operatorAvatarEl instanceof HTMLImageElement) {
      operatorAvatarEl.src = "";
      operatorAvatarEl.hidden = true;
      operatorAvatarEl.alt = "";
    }
    authBadgeEl.title = "Not signed in";
  }

  const disabled = !authenticated;
  toggleBotBtn.disabled = disabled;
  saveStatsBtn.disabled = disabled;
  announceBtn.disabled = disabled;
  refreshMetricsBtn.disabled = disabled;
  exportAuditBtn.disabled = disabled;
  refreshOrdersBtn.disabled = disabled;
  exportOrdersBtn.disabled = disabled;
  if (disabled) {
    economyAnomalyStripEl.hidden = true;
    setOwnerAuthState(false);
  } else {
    if (ownerAccessCardEl instanceof HTMLElement) {
      ownerAccessCardEl.hidden = false;
    }
  }
}

async function checkOwnerAuth() {
  if (!isAuthenticated) {
    setOwnerAuthState(false);
    return;
  }

  const response = await fetch("/api/owner/auth/me", { credentials: "same-origin" });
  const body = await response.json().catch(() => ({ authenticated: false }));
  setOwnerAuthState(Boolean(body.authenticated));
}

async function elevateOwnerAccess(password) {
  const response = await fetch("/api/owner/auth/elevate", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Owner unlock failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Owner unlock failed");
  }
  setOwnerAuthState(true);
}

async function loadOwnerOverview() {
  if (!isOwnerAuthenticated) {
    return;
  }
  return loadOwnerOverviewCompat();
}
async function loadOwnerOverviewCompat() {
  if (!isOwnerAuthenticated) return;
  await Promise.all([
    loadOwnerDashboard().catch(console.error),
    loadOwnerUsers().catch(console.error)
  ]);
}

async function sendOwnerSystemAction(action) {
  const response = await fetch("/api/owner/system/action", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Owner system action failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Owner system action failed");
  }
  return body;
}

async function sendOwnerClientAction(clientId, action, payload = {}) {
  const response = await fetch(`/api/owner/clients/${encodeURIComponent(clientId)}/action`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Owner client action failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Owner client action failed");
  }
  return body;
}

async function saveOwnerClientFinancials(clientId, payload) {
  const response = await fetch(`/api/owner/clients/${encodeURIComponent(clientId)}/financials`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Financial update failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Financial update failed");
  }
  return body;
}

function loadUiPreferences() {
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY);
    if (!raw) {
      uiPrefs = { ...defaultUiPrefs };
      return;
    }
    const parsed = JSON.parse(raw);
    uiPrefs = {
      density: parsed.density === "compact" ? "compact" : "comfortable",
      reducedMotion: Boolean(parsed.reducedMotion),
      compactLogs: Boolean(parsed.compactLogs)
    };
  } catch {
    uiPrefs = { ...defaultUiPrefs };
  }
}

function saveUiPreferences() {
  localStorage.setItem(UI_PREFS_KEY, JSON.stringify(uiPrefs));
}

function applyUiPreferences() {
  document.body.dataset.density = uiPrefs.density;
  document.body.classList.toggle("reduced-motion", uiPrefs.reducedMotion);
  document.body.classList.toggle("compact-logs", uiPrefs.compactLogs);

  uiDensitySelectEl.value = uiPrefs.density;
  reducedMotionToggleEl.checked = uiPrefs.reducedMotion;
  compactLogsToggleEl.checked = uiPrefs.compactLogs;
}

function renderCatalog(catalog) {
  catalogItems = catalog || [];
  storeCatalogEl.innerHTML = "";

  for (const item of catalogItems) {
    const card = document.createElement("article");
    card.className = `market-item ${getTierClass(item.id)}`;
    card.innerHTML = `
      ${buildBotImageMarkup(item, `${escapeHtml(item.name || "TRH bot")} package image`)}
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${buildPricingMarkup(item, "Starter Offer")}
      <ul class="feature-list">${(item.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      <button class="button tiny choose-bot-market" data-bot-id="${escapeHtml(item.id)}">See Package Value</button>
    `;
    storeCatalogEl.appendChild(card);
  }

  renderBotScreens();
}

function renderOfferings(items) {
  if (items) {
    offeringItems = items;
  }

  const visible = offeringItems.filter((item) => {
    if (offeringAudienceFilter === "all") {
      return true;
    }
    if (offeringAudienceFilter === "user") {
      return item.audience === "user" || item.audience === "both";
    }
    if (offeringAudienceFilter === "owner") {
      return item.audience === "owner" || item.audience === "both";
    }
    return true;
  });

  offeringCatalogEl.innerHTML = "";
  purchaseBotIdEl.innerHTML = "";

  offeringTabAllEl.classList.toggle("active", offeringAudienceFilter === "all");
  offeringTabUsersEl.classList.toggle("active", offeringAudienceFilter === "user");
  offeringTabOwnersEl.classList.toggle("active", offeringAudienceFilter === "owner");

  for (const item of visible) {
    const card = document.createElement("article");
    card.className = `market-item ${getTierClass(item.id)}`;
    card.innerHTML = `
      ${buildBotImageMarkup(item, `${escapeHtml(item.name || "TRH service")} image`)}
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <p class="order-meta">Type: ${escapeHtml(item.kind)} | Audience: ${escapeHtml(item.audience)}</p>
      ${buildPricingMarkup(item, "Current Offer")}
      <ul class="feature-list">${(item.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      <button class="button tiny choose-offering" data-offering-id="${escapeHtml(item.id)}">Claim This Offer</button>
    `;
    offeringCatalogEl.appendChild(card);

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${formatUsd(item.priceUsd || 0)}`;
    purchaseBotIdEl.appendChild(option);
  }
}

function renderBotScreens() {
  botScreenButtonsEl.innerHTML = "";
  botScreensMountEl.innerHTML = "";
  const buildLibraryById = new Map(buildLibraryRows.map((row) => [row.botId, row]));

  for (const item of catalogItems) {
    const screenId = `botScreen-${item.id}`;
    const tierClass = getTierClass(item.id);
    const tierLabel = getTierLabel(item.id);
    const profile = buildLibraryById.get(item.id);
    const modules = profile?.modules || [];
    const integrations = profile?.integrations || [];
    const deliveryArtifacts = profile?.deliveryArtifacts || [];
    const architecture = profile?.architecture || "Blueprint profile pending";

    const tabBtn = document.createElement("button");
    tabBtn.className = "tab-btn";
    tabBtn.dataset.screen = screenId;
    tabBtn.textContent = item.name;
    botScreenButtonsEl.appendChild(tabBtn);

    const section = document.createElement("section");
    section.id = screenId;
    section.className = `card screen bot-showcase ${tierClass}`;
    section.innerHTML = `
      <div class="bot-screen-shell">
        <section class="bot-hero-panel">
          <div class="bot-hero-image-wrap">
            ${buildBotImageMarkup(item, `${item.name || "TRH bot"} hero image`, "bot-hero-image")}
          </div>
          <div class="bot-hero-copy">
            <div class="hero-meta-row">
              <span class="hero-chip">${escapeHtml(tierLabel)}</span>
              <span class="hero-chip">${escapeHtml(architecture)}</span>
              <span class="hero-chip">${modules.length} Modules</span>
            </div>
            <h2>${escapeHtml(item.name)}</h2>
            <p>${escapeHtml(item.description)}</p>
            ${buildPricingMarkup(item, "Package Price")}
          </div>
          <div class="bot-summary-grid">
            <article class="bot-summary-card">
              <span>Feature Stack</span>
              <strong>${(item.features || []).length}</strong>
              <small>commercial package features</small>
            </article>
            <article class="bot-summary-card">
              <span>Integrations</span>
              <strong>${integrations.length}</strong>
              <small>connected services and hooks</small>
            </article>
            <article class="bot-summary-card">
              <span>Artifacts</span>
              <strong>${deliveryArtifacts.length}</strong>
              <small>handoff items ready to deliver</small>
            </article>
          </div>
        </section>
        <section class="bot-spec-grid">
          <article class="bot-spec-card">
            <h3>Package Features</h3>
            <ul class="feature-list">${(item.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
          </article>
          <article class="bot-spec-card">
            <h3>Build Modules</h3>
            <ul class="feature-list">${modules.length ? modules.map((module) => `<li>${escapeHtml(module)}</li>`).join("") : "<li>Module blueprint pending library sync</li>"}</ul>
          </article>
          <article class="bot-spec-card">
            <h3>Integrations</h3>
            <ul class="feature-list">${integrations.length ? integrations.map((integration) => `<li>${escapeHtml(integration)}</li>`).join("") : "<li>Integration profile pending</li>"}</ul>
          </article>
          <article class="bot-spec-card">
            <h3>Delivery Artifacts</h3>
            <ul class="feature-list">${deliveryArtifacts.length ? deliveryArtifacts.map((artifact) => `<li>${escapeHtml(artifact)}</li>`).join("") : "<li>Delivery artifact checklist pending</li>"}</ul>
          </article>
        </section>
        <section class="bot-cta-bar">
          <div>
            <span class="bot-cta-label">TRH Package Profile</span>
            <strong>${escapeHtml(tierLabel)} ready for purchase or marketplace handoff.</strong>
          </div>
          <div class="actions">
            <button class="button choose-bot" data-bot-id="${escapeHtml(item.id)}">Buy This Bot</button>
            <button class="button ghost choose-bot-market" data-bot-id="${escapeHtml(item.id)}">Open In Marketplace</button>
          </div>
        </section>
      </div>
    `;
    botScreensMountEl.appendChild(section);
  }

  setupRevealAnimations();
  refreshNavigationAssistOptions();
}

function renderMyBots(bots) {
  myBotsListEl.innerHTML = "";

  for (const bot of bots || []) {
    const card = document.createElement("article");
    const isLocalMachine = bot && bot.inventoryType === "local-machine";
    card.className = `market-item ${isLocalMachine ? "" : getTierClass(bot.botId)}`;
    if (isLocalMachine) {
      const runtime = escapeHtml(String(bot.runtime || "unknown").toUpperCase());
      const source = escapeHtml(String(bot.source || "local").replace(/-/g, " "));
      const localPath = escapeHtml(String(bot.localPath || "—"));
      const processCount = Number(bot.processCount || 0);
      const localImageSource = {
        id: bot.botId,
        inventoryType: bot.inventoryType,
        imageUrl: bot.imageUrl || bot.image || bot.thumbnailUrl || bot.thumbnail
      };
      card.innerHTML = `
        ${buildBotImageMarkup(localImageSource, `${bot.botName || "Local Bot"} image`)}
        <h3>${escapeHtml(bot.botName || "Local Bot")}</h3>
        <p>Local ID: ${escapeHtml(bot.botId || "local")}</p>
        <p class="order-meta">${formatStatusChip("Runtime", runtime, "prov")} ${formatStatusChip("Status", bot.active ? "active" : "inactive", "prov")}</p>
        <p class="order-meta">Source: ${source} | Processes: ${processCount}</p>
        <p class="order-meta">Path: ${localPath}</p>
      `;
    } else {
      const imageSource = {
        id: bot.botId,
        imageUrl: bot.imageUrl || bot.image || bot.thumbnailUrl || bot.thumbnail
      };
      card.innerHTML = `
        ${buildBotImageMarkup(imageSource, `${escapeHtml(bot.botName || "TRH bot")} owned package image`)}
        <h3>${escapeHtml(bot.botName)}</h3>
        <p>Package ID: ${escapeHtml(bot.botId)}</p>
        <p class="order-meta">${formatStatusChip("Payment", bot.paymentStatus, "payment")} ${formatStatusChip("Provisioning", bot.provisioningStatus, "prov")}</p>
        <p class="order-meta">Latest Order: ${escapeHtml(bot.latestOrderId)}</p>
        <p class="order-meta">Token: ${escapeHtml(bot.provisioningToken || "pending")}</p>
      `;
    }
    myBotsListEl.appendChild(card);
  }

  if (!bots || bots.length === 0) {
    const empty = document.createElement("article");
    empty.className = "market-item";
    empty.innerHTML = "<h3>No bots found</h3><p>No paid bot packages match that identity yet.</p>";
    myBotsListEl.appendChild(empty);
  }
}

function renderCustomerPortfolio(body) {
  const portfolio = (body || {}).portfolio || {};
  const summary = (body || {}).summary || {};
  const sections = [
    { key: "ranks", title: "Ranks" },
    { key: "roles", title: "Roles" },
    { key: "buyoutPlans", title: "Buyout Plans" },
    { key: "buildPlans", title: "Build Plans" },
    { key: "customBots", title: "Custom Bot Plans" }
  ];

  portfolioSummaryEl.innerHTML = `
    <div class="kpi"><span>Total Purchases</span><strong>${Number(summary.totalPurchases || 0).toLocaleString()}</strong></div>
    <div class="kpi"><span>Total Spent USD</span><strong>${Number(summary.totalSpentUsd || 0).toLocaleString()}</strong></div>
    <div class="kpi"><span>Buyer Types</span><strong>${(summary.buyerTypes || []).join(", ") || "n/a"}</strong></div>
  `;

  portfolioListEl.innerHTML = "";

  for (const section of sections) {
    const rows = portfolio[section.key] || [];
    if (rows.length === 0) {
      continue;
    }

    for (const row of rows) {
      const card = document.createElement("article");
      card.className = "market-item";
      const rowImageSource = {
        kind: section.key === "ranks"
          ? "rank"
          : section.key === "roles"
            ? "role"
            : section.key === "buyoutPlans"
              ? "buyout-plan"
              : section.key === "buildPlans"
                ? "build-plan"
                : "custom-bot"
      };
      card.innerHTML = `
        ${buildBotImageMarkup(rowImageSource, `${section.title} purchase image`)}
        <h3>${escapeHtml(section.title)}: ${escapeHtml(row.offeringName)}</h3>
        <p class="order-meta">Order: ${escapeHtml(row.orderId)} | Buyer: ${escapeHtml(row.buyerType)}</p>
        <p class="market-price">$${Number(row.amountUsd || 0).toLocaleString()} USD</p>
        <p class="order-meta">${formatStatusChip("Payment", row.paymentStatus, "payment")} ${formatStatusChip("Provisioning", row.provisioningStatus, "prov")}</p>
        ${row.customBrief ? `<p class="order-meta">Brief: ${escapeHtml(row.customBrief)}</p>` : ""}
      `;
      portfolioListEl.appendChild(card);
    }
  }

  if (!portfolioListEl.children.length) {
    const empty = document.createElement("article");
    empty.className = "market-item";
    empty.innerHTML = "<h3>No non-bot purchases</h3><p>No paid ranks, roles, or plans found for this identity yet.</p>";
    portfolioListEl.appendChild(empty);
  }
}

function renderOverview(data) {
  const platform = (data || {}).platform || {};
  animateCounter(overviewBotPackagesEl, Number(platform.botPackages || 0));
  animateCounter(overviewTotalModulesEl, Number(platform.totalModules || 0));
  animateCounter(overviewTotalOrdersEl, Number(platform.totalOrders || 0));
  animateCounter(overviewRevenueUsdEl, Number(platform.revenueUsd || 0));
  animateCounter(overviewReadyToProvisionEl, Number(platform.readyToProvision || 0));
  animateCounter(overviewDeliveredOrdersEl, Number(platform.deliveredOrders || 0));
  renderDeckTelemetry(platform);

  // Seed Orders screen KPIs from public platform data so they aren't blank
  // when the operator hasn't logged in yet. Auth'd loadCommerceMetrics() will
  // overwrite these with precise values after login.
  if (!isAuthenticated) {
    animateCounter(commerceTotalOrdersEl, Number(platform.totalOrders || 0));
    animateCounter(commerceRevenueUsdEl, Number(platform.revenueUsd || 0));
    animateCounter(commerceReadyProvisioningEl, Number(platform.readyToProvision || 0));
    animateCounter(commerceDeliveredOrdersEl, Number(platform.deliveredOrders || 0));
    if (orderFilterSummaryEl) {
      orderFilterSummaryEl.textContent = `Summary only — log in to view and manage orders.`;
    }
  }
}

function renderBuildLibrary(rows) {
  buildLibraryRows = rows || [];
  buildLibraryRowsEl.innerHTML = "";

  for (const row of rows || []) {
    const card = document.createElement("article");
    card.className = `market-item module-cluster ${getTierClass(row.botId)}`;
    card.innerHTML = `
      ${buildBotImageMarkup({ botId: row.botId }, `${escapeHtml(row.botName || "TRH bot")} library image`)}
      <h3>${escapeHtml(row.botName)}</h3>
      <p class="order-meta">Architecture: ${escapeHtml(row.architecture)}</p>
      <p class="market-price">$${Number(row.priceUsd || 0).toLocaleString()} USD</p>
      <h4>Modules</h4>
      <ul class="feature-list">${(row.modules || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
      <h4>Integrations</h4>
      <ul class="feature-list">${(row.integrations || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
      <h4>Delivery Artifacts</h4>
      <ul class="feature-list">${(row.deliveryArtifacts || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
    `;
    buildLibraryRowsEl.appendChild(card);
  }

  renderBotScreens();
  renderHomeBuildMap();
  renderDeckTelemetry({
    botPackages: catalogItems.length,
    totalModules: buildLibraryRows.reduce((sum, row) => sum + Number((row.modules || []).length || 0), 0)
  });
}

function renderBusinessServices(items) {
  businessServices = items || [];
  businessServiceGridEl.innerHTML = "";
  businessServiceCategoryEl.innerHTML = "";

  for (const service of businessServices) {
    const card = document.createElement("article");
    card.className = "market-item";
    card.innerHTML = `
      ${buildBotImageMarkup({ category: service.category }, `${escapeHtml(service.name || "Service")} image`)}
      <h3>${escapeHtml(service.name)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <p class="order-meta">Category: ${escapeHtml(service.category)}</p>
      <ul class="feature-list">${(service.outcomes || []).map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul>
    `;
    businessServiceGridEl.appendChild(card);

    const option = document.createElement("option");
    option.value = service.category;
    option.textContent = service.name;
    businessServiceCategoryEl.appendChild(option);
  }
}

function renderBusinessInquiries(rows) {
  const sourceRows = Array.isArray(rows) ? rows : [];
  businessInquiries = [...sourceRows].sort(compareBusinessRows);
  businessInquiryRowsEl.innerHTML = "";

  for (const row of businessInquiries) {
    const aging = getInquiryAgingMeta(row);
    const totalAgingText = formatDurationFromHours(aging.totalAgeHours);
    const stageAgingText = formatDurationFromHours(aging.stageAgeHours);
    const ageLineClass = aging.isBreached ? "order-meta business-age-line warning" : "order-meta business-age-line";
    const simulated = isInquirySimulated(row);
    const simulatedTag = simulated ? '<span class="sim-tag">SIM</span>' : "";

    const item = document.createElement("li");
    item.className = "business-inquiry-row";
    item.style.cursor = isAuthenticated ? "pointer" : "default";
    item.innerHTML = `
      <strong>${escapeHtml(row.id)} | ${escapeHtml(row.companyName)} ${simulatedTag}</strong>
      <span class="order-meta">${escapeHtml(row.contactName)} | ${escapeHtml(row.email)} | ${escapeHtml(row.serviceCategory)} | budget=$${Number(row.budgetUsd || 0).toLocaleString()}</span>
      <span class="order-meta">${formatStatusChip("Status", row.status || "new", "prov")}</span>
      <span class="order-meta">${escapeHtml(row.projectSummary)}</span>
      <span class="${ageLineClass}">Age: ${totalAgingText} total | ${stageAgingText} in stage${aging.isBreached ? ` | SLA ${aging.slaHours}h breached` : ""}</span>
    `;

    if (isAuthenticated) {
      item.addEventListener("click", (e) => {
        if (e.target.tagName !== "SELECT" && e.target.tagName !== "BUTTON") {
          openInquiryTimeline(row.id);
        }
      });

      const actions = document.createElement("div");
      actions.className = "business-row-actions";

      const stageSelect = document.createElement("select");
      stageSelect.className = "business-stage-select";
      stageSelect.dataset.inquiryId = row.id;
      for (const stage of businessStageOptions) {
        const option = document.createElement("option");
        option.value = stage;
        option.textContent = stage;
        if (stage === (row.status || "new")) {
          option.selected = true;
        }
        stageSelect.appendChild(option);
      }

      const saveBtn = document.createElement("button");
      saveBtn.className = "button tiny ghost business-stage-save";
      saveBtn.dataset.inquiryId = row.id;
      saveBtn.textContent = "Update Stage";

      const simulateBtn = document.createElement("button");
      simulateBtn.className = "button tiny business-breach-sim";
      simulateBtn.dataset.inquiryId = row.id;
      simulateBtn.textContent = "Sim Breach";

      const revertBtn = document.createElement("button");
      revertBtn.className = "button tiny ghost business-breach-revert";
      revertBtn.dataset.inquiryId = row.id;
      revertBtn.textContent = "Revert Sim";

      actions.appendChild(stageSelect);
      actions.appendChild(saveBtn);
      actions.appendChild(simulateBtn);
      actions.appendChild(revertBtn);
      item.appendChild(actions);
    }

    businessInquiryRowsEl.appendChild(item);
  }

  if (businessInquiries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No inquiries yet.";
    businessInquiryRowsEl.appendChild(empty);
  }
}

function renderBusinessMetrics(metrics) {
  const safe = metrics || {};
  animateCounter(businessKpiTotalInquiriesEl, Number(safe.totalInquiries || 0));
  businessKpiConversionRateEl.textContent = `${Number(safe.conversionRatePct || 0).toFixed(1)}%`;
  animateCounter(businessKpiQuotedBudgetEl, Number(safe.quotedBudgetUsd || 0));
  animateCounter(businessKpiActivePipelineEl, Number(safe.activePipeline || 0));
  const breached = Number(safe.slaBreachedCount || 0);
  animateCounter(businessKpiSLABreachedEl, breached);
  setDeckMeter(
    commerceDeckRingEl,
    commerceDeckMetricEl,
    commerceDeckDetailEl,
    Number(safe.activePipeline || 0) / Math.max(6, Number(safe.totalInquiries || 0) || 1),
    Number(safe.activePipeline || 0).toLocaleString(),
    `${Number(safe.totalInquiries || 0).toLocaleString()} inquiries in pipeline memory`
  );

  if (businessSlaStripEl instanceof HTMLElement && businessSlaStripTextEl instanceof HTMLElement) {
    if (breached > 0) {
      businessSlaStripEl.removeAttribute("hidden");
      businessSlaStripEl.classList.add("danger");
      businessSlaStripTextEl.textContent = `${breached} inquiry(s) exceeded SLA response windows.`;
    } else {
      businessSlaStripEl.setAttribute("hidden", "");
      businessSlaStripEl.classList.remove("danger");
      businessSlaStripTextEl.textContent = "No SLA breaches detected.";
    }
  }
}

function renderBusinessPipelineBoard(rows) {
  const sourceRows = Array.isArray(rows) ? rows : [];
  businessPipelineRows = [...sourceRows].sort(compareBusinessRows);

  const stages = ["new", "discovery", "quoted", "in-progress", "delivered", "declined"];
  const countMap = {
    new: 0,
    discovery: 0,
    quoted: 0,
    "in-progress": 0,
    delivered: 0,
    declined: 0
  };

  const rowsByStage = {
    new: [],
    discovery: [],
    quoted: [],
    "in-progress": [],
    delivered: [],
    declined: []
  };

  for (const stage of stages) {
    const list = businessPipelineBoardEl.querySelector(`.pipeline-list[data-stage="${stage}"]`);
    if (list instanceof HTMLElement) {
      list.innerHTML = "";
    }
  }

  for (const row of businessPipelineRows) {
    const stage = stages.includes(String(row.status || "").toLowerCase()) ? String(row.status).toLowerCase() : "new";
    rowsByStage[stage].push(row);
  }

  for (const stage of stages) {
    rowsByStage[stage].sort(comparePipelineRowsInStage);
  }

  for (const stage of stages) {
    for (const row of rowsByStage[stage]) {
    const list = businessPipelineBoardEl.querySelector(`.pipeline-list[data-stage="${stage}"]`);
    if (!(list instanceof HTMLElement)) {
      continue;
    }

    countMap[stage] += 1;
    const card = document.createElement("li");
    card.className = "pipeline-card";
    card.draggable = isAuthenticated;
    card.dataset.inquiryId = row.id;
    card.dataset.stage = stage;
    
    const aging = getInquiryAgingMeta(row);
    const simulated = isInquirySimulated(row);
    const isBreached = aging.isBreached;
    const agingClass = isBreached ? "warning" : "";
    const agingText = `${formatDurationFromHours(aging.stageAgeHours)} in stage`;
    let slaBadgeClass = "sla-countdown";
    let slaCountdownText = "No SLA";

    if (aging.slaHours > 0 && aging.remainingHours !== null) {
      if (aging.remainingHours >= 0) {
        slaCountdownText = `SLA ${formatDurationFromHours(aging.remainingHours)} left`;
      } else {
        slaCountdownText = `SLA overdue ${formatDurationFromHours(Math.abs(aging.remainingHours))}`;
        slaBadgeClass = "sla-countdown breached";
      }
    }
    
    card.innerHTML = `
      <strong>${escapeHtml(row.companyName)}${simulated ? ' <span class="sim-tag">SIM</span>' : ""}</strong>
      <span>${escapeHtml(row.contactName)}</span>
      <span>${escapeHtml(row.serviceCategory)} | $${Number(row.budgetUsd || 0).toLocaleString()}</span>
      <span>${escapeHtml(row.id)}</span>
      <div class="pipeline-aging ${agingClass}">${agingText}</div>
      <div class="${slaBadgeClass}">${slaCountdownText}</div>
    `;
    
    if (isAuthenticated) {
      card.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        openInquiryTimeline(row.id);
      });
    }
    list.appendChild(card);
    }
  }

  pipelineCountNewEl.textContent = String(countMap.new);
  pipelineCountDiscoveryEl.textContent = String(countMap.discovery);
  pipelineCountQuotedEl.textContent = String(countMap.quoted);
  pipelineCountInProgressEl.textContent = String(countMap["in-progress"]);
  pipelineCountDeliveredEl.textContent = String(countMap.delivered);
  pipelineCountDeclinedEl.textContent = String(countMap.declined);

  for (const stage of stages) {
    const list = businessPipelineBoardEl.querySelector(`.pipeline-list[data-stage="${stage}"]`);
    if (!(list instanceof HTMLElement) || list.children.length > 0) {
      continue;
    }
    const empty = document.createElement("li");
    empty.className = "pipeline-empty";
    empty.textContent = "No inquiries";
    list.appendChild(empty);
  }
}

async function openInquiryTimeline(inquiryId) {
  if (!(timelineModal instanceof HTMLElement)) {
    return;
  }

  const inquiry = businessInquiries.find(row => row.id === inquiryId);
  if (!inquiry) {
    console.error("Inquiry not found:", inquiryId);
    return;
  }

  // Calculate total age
  const createdAt = Date.parse(inquiry.createdAt || "");
  const totalAgeMs = Date.now() - createdAt;
  const totalAgeHours = Math.floor(totalAgeMs / (1000 * 60 * 60));
  const totalAgeDays = Math.floor(totalAgeHours / 24);
  const totalAgeDisplay = totalAgeDays > 0 
    ? `${totalAgeDays}d ${totalAgeHours % 24}h`
    : `${totalAgeHours}h`;

  // Populate modal header
  timelineCompanyName.textContent = inquiry.companyName || "Unknown";
  timelineStatus.textContent = `Status: ${inquiry.status || "unknown"}`;
  timelineAge.textContent = `Total Age: ${totalAgeDisplay}`;

  // Load timeline data from backend
  try {
    const response = await fetch(`/api/business/inquiries/${inquiryId}/timeline`, { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error("Unable to load inquiry timeline");
    }

    const body = await response.json();
    const stageHistory = body.stageHistory || [];
    const metrics = body.currentStageMetrics || {};

    // Display SLA metrics
    if (metrics.isBreached) {
      timelineSLAMetrics.textContent = `SLA BREACHED - In ${metrics.status} for ${metrics.durationHours} hours (SLA: ${metrics.slaHours}h)`;
      timelineSLAMetrics.classList.add("breached");
    } else if (metrics.slaHours > 0) {
      const remaining = metrics.slaHours - metrics.durationHours;
      timelineSLAMetrics.textContent = `SLA on track - ${remaining.toFixed(1)}h remaining in ${metrics.status} stage`;
      timelineSLAMetrics.classList.remove("breached");
    } else {
      timelineSLAMetrics.textContent = `No SLA for ${metrics.status} stage`;
      timelineSLAMetrics.classList.remove("breached");
    }

    // Populate stage transitions
    timelineStageList.innerHTML = "";
    if (stageHistory.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No timeline events recorded yet.";
      timelineStageList.appendChild(empty);
    }

    for (const entry of stageHistory) {
      const li = document.createElement("li");
      const atTime = new Date(entry.at).toLocaleString();
      const stageName = (entry.status || entry.stage || "unknown").toUpperCase();
      li.textContent = `${stageName} — ${atTime}${entry.note ? ` — ${entry.note}` : ""}`;
      timelineStageList.appendChild(li);
    }

    // Show modal
    timelineModal.removeAttribute("hidden");
  } catch (err) {
    console.error("Failed to load timeline:", err);
    timelineSLAMetrics.textContent = `Error loading timeline: ${err.message}`;
    timelineSLAMetrics.classList.add("breached");
    timelineStageList.innerHTML = "";
    const failed = document.createElement("li");
    failed.textContent = "Timeline request failed. Try again.";
    timelineStageList.appendChild(failed);
    timelineModal.removeAttribute("hidden");
  }
}

function closeInquiryTimeline() {
  if (timelineModal instanceof HTMLElement) {
    timelineModal.setAttribute("hidden", "");
  }
}

function renderHomeBuildMap() {
  homeBuildMapEl.innerHTML = "";

  const byId = new Map(buildLibraryRows.map((row) => [row.botId, row]));
  for (const item of catalogItems) {
    const lib = byId.get(item.id);
    const card = document.createElement("article");
    card.className = `market-item ${getTierClass(item.id)}`;
    card.innerHTML = `
      ${buildBotImageMarkup(item, `${escapeHtml(item.name || "TRH bot")} map image`)}
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <p class="order-meta">Architecture: ${lib ? escapeHtml(lib.architecture) : "Profile pending"}</p>
      <p class="order-meta">Modules: ${lib ? (lib.modules || []).length : 0} | Integrations: ${lib ? (lib.integrations || []).length : 0}</p>
      <p class="market-price">$${Number(item.priceUsd || 0).toLocaleString()} USD</p>
    `;
    homeBuildMapEl.appendChild(card);
  }
}

function renderOrders(rows) {
  allOrders = rows || [];
  renderOrdersWithFilters();
}

function getOrderTimestamp(row) {
  const raw = row.createdAt || row.updatedAt || row.paidAt || row.at;
  const value = Date.parse(raw || "");
  return Number.isFinite(value) ? value : 0;
}

function getOrderAmount(row) {
  return Number(row.priceUsd || row.totalUsd || row.amountUsd || 0);
}

function renderOrdersWithFilters() {
  orderRowsEl.innerHTML = "";
  let rows = [...allOrders];

  const paymentFilter = orderFilterPaymentEl.value;
  const provisioningFilter = orderFilterProvisioningEl.value;
  const search = orderSearchInputEl.value.trim().toLowerCase();
  const sortBy = orderSortSelectEl.value;

  if (paymentFilter !== "all") {
    rows = rows.filter((row) => String(row.paymentStatus || "").toLowerCase() === paymentFilter);
  }
  if (provisioningFilter !== "all") {
    rows = rows.filter((row) => String(row.provisioningStatus || "").toLowerCase() === provisioningFilter);
  }
  if (search) {
    rows = rows.filter((row) => {
      const blob = `${row.id || ""} ${row.botName || ""} ${row.customerEmail || ""} ${row.customerDiscord || ""}`.toLowerCase();
      return blob.includes(search);
    });
  }

  rows.sort((a, b) => {
    if (sortBy === "oldest") {
      return getOrderTimestamp(a) - getOrderTimestamp(b);
    }
    if (sortBy === "amount-high") {
      return getOrderAmount(b) - getOrderAmount(a);
    }
    if (sortBy === "amount-low") {
      return getOrderAmount(a) - getOrderAmount(b);
    }
    return getOrderTimestamp(b) - getOrderTimestamp(a);
  });

  orderFilterSummaryEl.textContent = !isAuthenticated
    ? "Login required."
    : `Showing ${rows.length} of ${allOrders.length} order(s).`;

  for (const row of rows) {
    const item = document.createElement("li");
    item.className = "order-row";
    const orderDate = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—";
    const orderTime = row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    const amountLabel = `$${Number(row.amountUsd || 0).toLocaleString()} USD`;
    const typeLabel = row.offeringType || row.productFamily || "—";
    item.innerHTML = `
      <strong>${escapeHtml(row.id)} | ${escapeHtml(row.botName || "—")}</strong>
      <span class="order-meta">${escapeHtml(row.customerEmail || "—")} | ${escapeHtml(row.customerDiscord || "—")}</span>
      <span class="order-meta">${formatStatusChip("Payment", row.paymentStatus, "payment")} ${formatStatusChip("Provisioning", row.provisioningStatus, "prov")} &nbsp;<span class="order-type-chip">${escapeHtml(typeLabel)}</span></span>
      <span class="order-meta order-amount-date"><strong class="order-amount">${amountLabel}</strong> &nbsp;·&nbsp; <span class="order-date">${orderDate}${orderTime ? " " + orderTime : ""}</span>${row.provisioningToken && row.provisioningStatus !== "pending" ? ` &nbsp;·&nbsp; <span class="order-token">Token: ${escapeHtml(row.provisioningToken)}</span>` : ""}</span>
    `;

    if (isAuthenticated && row.paymentStatus === "paid" && row.provisioningStatus !== "delivered") {
      const button = document.createElement("button");
      button.className = "button tiny";
      button.textContent = "Mark Provisioned";
      button.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/store/orders/${encodeURIComponent(row.id)}/provision`, {
            method: "POST",
            credentials: "same-origin"
          });
          if (!response.ok) {
            const body = await response.json().catch(() => ({ error: "Provision failed" }));
            throw new Error(body.error || "Provision failed");
          }

          await loadOrders();
          setStatus(`Provisioned ${row.id}.`);
        } catch (error) {
          setStatus(error.message, "error");
        }
      });
      item.appendChild(button);
    }

    orderRowsEl.appendChild(item);
  }

  if (rows.length === 0) {
    const empty = document.createElement("li");
    if (!isAuthenticated) {
      empty.textContent = "Operator login required to view orders.";
    } else if (allOrders.length === 0) {
      empty.textContent = "No orders yet.";
    } else {
      empty.textContent = "No orders match the current filters.";
    }
    orderRowsEl.appendChild(empty);
  }
}

function renderCommerceMetrics(metrics) {
  animateCounter(commerceTotalOrdersEl, Number(metrics.totalOrders || 0));
  animateCounter(commerceRevenueUsdEl, Number(metrics.totalRevenueUsd || 0));
  animateCounter(commerceReadyProvisioningEl, Number(metrics.readyProvisioning || 0));
  animateCounter(commerceDeliveredOrdersEl, Number(metrics.deliveredOrders || 0));
  evaluateEconomyAnomaly();
}

async function checkAuth() {
  const response = await fetch("/api/auth/me", {
    credentials: "same-origin"
  });
  const body = await response.json();
  setAuthState(Boolean(body.authenticated));

  // Surface operator identity in topbar chip
  if (body && body.authenticated) {
    const label =
      String(body.discordUsername || "").trim() ||
      String(body.email || "").trim() ||
      String(body.discordId || "").trim() ||
      "Operator";
    const roleLabel = body.ownerAuthenticated ? "Owner" : "Operator";
    if (operatorLabelEl instanceof HTMLElement) {
      operatorLabelEl.textContent = `${label} (${roleLabel})`;
      operatorLabelEl.title = `${label} (${roleLabel})`;
    }
    if (operatorAvatarEl instanceof HTMLImageElement && body.avatarUrl) {
      operatorAvatarEl.src = body.avatarUrl;
      operatorAvatarEl.hidden = false;
      operatorAvatarEl.alt = `${label} avatar`;
    } else if (operatorAvatarEl instanceof HTMLImageElement) {
      operatorAvatarEl.hidden = true;
      operatorAvatarEl.alt = "";
    }
    if (operatorChipEl instanceof HTMLElement) operatorChipEl.hidden = false;
    authBadgeEl.title = `Signed in as ${label} (${roleLabel})`;
  } else {
    if (operatorChipEl instanceof HTMLElement) operatorChipEl.hidden = true;
  }

  if (body && body.authenticated && body.ownerAuthenticated) {
    setOwnerAuthState(true);
    setOwnerStatus("Owner access restored from active session.");
  }
}

(function initRefreshButton() {
  const btn = document.getElementById("refreshDashboardBtn");
  if (!(btn instanceof HTMLButtonElement)) return;
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "↻ Refreshing…";
    try {
      await loadOpsData();
    } catch (e) {
      // silently ignore — loadOpsData already surfaces errors
    } finally {
      btn.disabled = false;
      btn.textContent = "↻ Refresh";
    }
  });
})();

async function loadOpsData() {
  const [metricsRes, ledgerRes] = await Promise.all([
    fetch("/api/metrics", { credentials: "same-origin" }),
    fetch("/api/bot/economy/ledger?limit=20", { credentials: "same-origin" })
  ]);

  if (!metricsRes.ok || !ledgerRes.ok) {
    throw new Error("Unable to load operational metrics. Operator login required.");
  }

  const metrics = await metricsRes.json();
  const ledger = await ledgerRes.json();
  renderMetrics(metrics);
  renderLedger(ledger.rows || []);
  evaluateEconomyAnomaly();
  if (isOwnerAuthenticated) {
    await loadOwnerOverview();
  }
}

async function loadStoreCatalog() {
  const response = await fetch("/api/store/catalog");
  if (!response.ok) {
    throw new Error("Unable to load store catalog.");
  }

  const body = await response.json();
  paymentModeBadgeEl.textContent = `Payment mode: ${body.paymentMode}`;
  renderCatalog(body.items || []);
  renderHomeBuildMap();
}

async function loadOfferings() {
  const response = await fetch("/api/store/offerings");
  if (!response.ok) {
    throw new Error("Unable to load offerings.");
  }

  const body = await response.json();
  renderOfferings(body.items || []);
}

async function loadPlatformOverview() {
  const response = await fetch("/api/platform/overview");
  if (!response.ok) {
    throw new Error("Unable to load platform overview.");
  }

  const body = await response.json();
  renderOverview(body);
}

async function loadBuildLibrary() {
  const response = await fetch("/api/bot/build-library");
  if (!response.ok) {
    throw new Error("Unable to load build library.");
  }

  const body = await response.json();
  renderBuildLibrary(body.rows || []);
}

async function loadBusinessServices() {
  const response = await fetch("/api/business/services");
  if (!response.ok) {
    throw new Error("Unable to load business services.");
  }

  const body = await response.json();
  renderBusinessServices(body.items || []);
}

async function loadBusinessInquiries() {
  if (!isAuthenticated) {
    renderBusinessInquiries([]);
    renderBusinessMetrics({});
    return;
  }

  const params = new URLSearchParams({ limit: "50" });
  const status = businessInquiryFilterEl.value;
  if (status && status !== "all") {
    params.set("status", status);
  }

  const response = await fetch(`/api/business/inquiries?${params.toString()}`, { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Unable to load business inquiries.");
  }

  const body = await response.json();
  if (Array.isArray(body.stageOptions)) {
    businessStageOptions = body.stageOptions;
  }
  renderBusinessMetrics(body.overallMetrics || body.metrics || {});
  renderBusinessInquiries(body.rows || []);
}

async function loadBusinessPipelineBoard() {
  if (!isAuthenticated) {
    renderBusinessPipelineBoard([]);
    return;
  }

  const response = await fetch("/api/business/inquiries?limit=250&status=all", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Unable to load pipeline board.");
  }

  const body = await response.json();
  renderBusinessPipelineBoard(body.rows || []);
}

async function loadBusinessAnalytics() {
  if (!isAuthenticated) {
    renderBusinessMetrics({});
    return;
  }

  const response = await fetch("/api/business/analytics", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Unable to load business analytics.");
  }

  const body = await response.json();
  if (Array.isArray(body.stageOptions)) {
    businessStageOptions = body.stageOptions;
  }
  if (body.slaConfig && typeof body.slaConfig === "object") {
    businessSlaConfig = {
      ...businessSlaConfig,
      ...body.slaConfig
    };
  }
  renderBusinessMetrics(body.metrics || {});
}

async function requestBusinessQuoteTemplate() {
  const params = new URLSearchParams({
    category: businessServiceCategoryEl.value || "",
    budgetUsd: String(Number(businessBudgetUsdEl.value || 0)),
    companyName: businessCompanyNameEl.value.trim(),
    contactName: businessContactNameEl.value.trim()
  });

  const response = await fetch(`/api/business/quote-template?${params.toString()}`);
  const body = await response.json().catch(() => ({ ok: false, error: "Quote generation failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Quote generation failed");
  }

  return body.template || {};
}

async function updateBusinessInquiryStage(inquiryId, status) {
  const response = await fetch(`/api/business/inquiries/${encodeURIComponent(inquiryId)}/stage`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Stage update failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Stage update failed");
  }
  return body;
}

async function simulateBusinessInquiryBreach(inquiryId, hoursOverdue = 2) {
  const response = await fetch(`/api/business/inquiries/${encodeURIComponent(inquiryId)}/simulate-breach`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hoursOverdue })
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Breach simulation failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Breach simulation failed");
  }
  return body;
}

async function revertBusinessInquirySimulation(inquiryId) {
  const response = await fetch(`/api/business/inquiries/${encodeURIComponent(inquiryId)}/revert-simulation`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" }
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Simulation revert failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Simulation revert failed");
  }
  return body;
}

async function revertAllBusinessInquirySimulations() {
  const response = await fetch("/api/business/inquiries/simulations/revert-all", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" }
  });
  const body = await response.json().catch(() => ({ ok: false, error: "Bulk simulation revert failed" }));
  if (!response.ok || !body.ok) {
    throw new Error(body.error || "Bulk simulation revert failed");
  }
  return body;
}

async function exportBusinessSlaReportCsv() {
  const query = new URLSearchParams({ format: "csv" });
  const startDate = businessSlaExportStartEl instanceof HTMLInputElement ? businessSlaExportStartEl.value.trim() : "";
  const endDate = businessSlaExportEndEl instanceof HTMLInputElement ? businessSlaExportEndEl.value.trim() : "";
  const breachedOnly = businessSlaExportBreachedOnlyEl instanceof HTMLInputElement
    ? businessSlaExportBreachedOnlyEl.checked
    : false;

  if (startDate) {
    query.set("startDate", startDate);
  }
  if (endDate) {
    query.set("endDate", endDate);
  }
  if (breachedOnly) {
    query.set("breachedOnly", "1");
  }

  const response = await fetch(`/api/business/sla-report?${query.toString()}`, { credentials: "same-origin" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "SLA report export failed" }));
    throw new Error(body.error || "SLA report export failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trh-sla-report-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function applyBusinessSlaExportPreset(daysBack) {
  if (!(businessSlaExportStartEl instanceof HTMLInputElement) || !(businessSlaExportEndEl instanceof HTMLInputElement)) {
    return;
  }

  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(end);
  start.setDate(start.getDate() - Math.max(daysBack, 0));

  businessSlaExportStartEl.value = toDateInputValue(start);
  businessSlaExportEndEl.value = toDateInputValue(end);
}

function clearBusinessSlaExportFilters() {
  if (businessSlaExportStartEl instanceof HTMLInputElement) {
    businessSlaExportStartEl.value = "";
  }
  if (businessSlaExportEndEl instanceof HTMLInputElement) {
    businessSlaExportEndEl.value = "";
  }
  if (businessSlaExportBreachedOnlyEl instanceof HTMLInputElement) {
    businessSlaExportBreachedOnlyEl.checked = false;
  }
}

async function handleBusinessSlaPresetClick(daysBack, label) {
  applyBusinessSlaExportPreset(daysBack);
  const autoExport = businessSlaAutoExportEl instanceof HTMLInputElement ? businessSlaAutoExportEl.checked : false;
  const breachedOnly = businessSlaExportBreachedOnlyEl instanceof HTMLInputElement
    ? businessSlaExportBreachedOnlyEl.checked
    : false;
  const start = businessSlaExportStartEl instanceof HTMLInputElement ? businessSlaExportStartEl.value : "";
  const end = businessSlaExportEndEl instanceof HTMLInputElement ? businessSlaExportEndEl.value : "";

  if (isAuthenticated) {
    try {
      await sendCommand(
        "businessSlaPresetApplied",
        `preset=${label}; start=${start || "-"}; end=${end || "-"}; breachedOnly=${breachedOnly}; autoExport=${autoExport}`
      );
    } catch (_error) {
      // Ignore audit command failures in client UX path.
    }
  }

  if (autoExport) {
    await exportBusinessSlaReportCsv();
    setBusinessInquiryStatus(`SLA window set to ${label} and exported as CSV.`);
    return;
  }

  setBusinessInquiryStatus(`SLA export window set to ${label}.`);
}

async function loadOrders() {
  if (!isAuthenticated) {
    renderOrders([]);
    return;
  }

  const response = await fetch("/api/store/orders?limit=30", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Unable to load orders. Operator login required.");
  }

  const body = await response.json();
  renderOrders(body.rows || []);
}

async function loadCommerceMetrics() {
  if (!isAuthenticated) {
    renderCommerceMetrics({});
    return;
  }

  const response = await fetch("/api/store/metrics", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Unable to load commerce metrics.");
  }

  const body = await response.json();
  renderCommerceMetrics(body);
}

async function sendCommand(command, value) {
  const response = await fetch("/api/command", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ command, value })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || "Unknown error");
  }

  return response.json();
}

toggleBotBtn.addEventListener("click", async () => {
  try {
    await sendCommand("toggleBot");
    setStatus("Bot toggle command accepted.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

saveStatsBtn.addEventListener("click", async () => {
  try {
    await sendCommand("setGuildCount", Number(guildCountInput.value || 0));
    await sendCommand("setUsersServed", Number(usersServedInput.value || 0));
    await sendCommand("setEconomyBalance", Number(economyBalanceInput.value || 0));
    setStatus("Metrics pushed to control backend.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

announceBtn.addEventListener("click", async () => {
  const message = announcementInput.value.trim();
  if (!message) {
    return;
  }

  try {
    await sendCommand("announce", message);
    announcementInput.value = "";
    setStatus("Announcement logged.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

refreshMetricsBtn.addEventListener("click", async () => {
  try {
    await loadOpsData();
    setStatus("Operational metrics refreshed.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

exportAuditBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/audit/export", { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error("Unable to export audit. Operator login required.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trh-audit-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Audit export downloaded.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

loginBtn.addEventListener("click", async () => {
  const password = operatorPasswordInput.value;
  const usingEmail = authTabEmail instanceof HTMLElement && authTabEmail.classList.contains("active");
  const email = usingEmail && operatorEmailInput instanceof HTMLInputElement ? operatorEmailInput.value.trim() : "";
  const discordId = !usingEmail && operatorDiscordIdInput instanceof HTMLInputElement ? operatorDiscordIdInput.value.trim() : "";
  if (!password) {
    setStatus("Enter operator password first.", "error");
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...(usingEmail ? { email } : { discordId }) })
    });
    const body = await response.json().catch(() => ({ ok: false, error: "Login failed." }));
    if (!response.ok) {
      throw new Error(body.error || "Login failed.");
    }

    operatorPasswordInput.value = "";
    if (usingEmail && operatorEmailInput instanceof HTMLInputElement) {
      operatorEmailInput.value = "";
    } else if (!usingEmail && operatorDiscordIdInput instanceof HTMLInputElement) {
      operatorDiscordIdInput.value = discordId;
    }
    await checkAuth();
    await checkOwnerAuth();
    await loadOpsData();
    await loadOrders();
    await loadBusinessAnalytics();
    await loadBusinessInquiries();
    setStatus(body.ownerAuthenticated ? "Owner authenticated. Full app access unlocked." : "Operator authenticated. Control surface unlocked.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

if (discordSyncBtn instanceof HTMLElement) {
  discordSyncBtn.addEventListener("click", () => {
    setStatus("Redirecting to Discord for profile sync...");
    window.location.href = "/api/auth/discord/sync/start";
  });
}

if (discordLoginBtn instanceof HTMLElement) {
  discordLoginBtn.addEventListener("click", () => {
    setStatus("Redirecting to Discord sign-in...");
    window.location.href = "/api/auth/discord/start";
  });
}

logoutBtn.addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } finally {
    setAuthState(false);
    setOwnerAuthState(false);
    if (operatorDiscordIdInput instanceof HTMLInputElement) {
      operatorDiscordIdInput.value = "";
    }
    renderOrders([]);
    setStatus("Logged out. Operator lock restored.");
  }
});

if (ownerLoginBtn instanceof HTMLElement) {
  ownerLoginBtn.addEventListener("click", async () => {
    const password = ownerPasswordInputEl instanceof HTMLInputElement ? ownerPasswordInputEl.value.trim() : "";
    if (!password) {
      setOwnerStatus("Enter owner password first.", "error");
      return;
    }

    try {
      await elevateOwnerAccess(password);
      if (ownerPasswordInputEl instanceof HTMLInputElement) {
        ownerPasswordInputEl.value = "";
      }
      await loadOwnerOverview();
      setOwnerStatus("Owner controls unlocked.");
    } catch (error) {
      setOwnerStatus(error.message, "error");
    }
  });
}

function bindOwnerSystemAction(button, action, successMessage) {
  if (!(button instanceof HTMLElement)) {
    return;
  }

  button.addEventListener("click", async () => {
    try {
      await sendOwnerSystemAction(action);
      await loadOwnerOverview();
      setOwnerSystemStatus(successMessage);
    } catch (error) {
      setOwnerSystemStatus(error.message, "error");
    }
  });
}

bindOwnerSystemAction(ownerStartAllBtn, "start_all", "All bots started.");
bindOwnerSystemAction(ownerStopAllBtn, "stop_all", "All bots stopped.");
bindOwnerSystemAction(ownerRestartAllBtn, "restart_all", "All bot instances restarted.");
bindOwnerSystemAction(ownerForceUpdateAllBtn, "force_update_all", "Force update triggered.");
bindOwnerSystemAction(ownerMaintenanceOnBtn, "maintenance_on", "Maintenance mode enabled.");
bindOwnerSystemAction(ownerMaintenanceOffBtn, "maintenance_off", "Maintenance mode disabled.");
bindOwnerSystemAction(ownerGlobalShutdownBtn, "global_shutdown", "GLOBAL SHUTDOWN executed.");

purchaseBtn.addEventListener("click", async () => {
  const offeringId = purchaseBotIdEl.value;
  const buyerType = purchaseBuyerTypeEl.value;
  const customerEmail = purchaseEmailEl.value.trim();
  const customerDiscord = purchaseDiscordEl.value.trim();
  const customBrief = purchaseCustomBriefEl.value.trim();
  const paymentMethod = purchasePaymentMethodEl.value;

  if (!offeringId || !customerEmail || !customerDiscord) {
    setPurchaseStatus("Offering, email, and Discord handle are required.", "error");
    return;
  }

  try {
    const response = await fetch("/api/store/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offeringId, buyerType, customerEmail, customerDiscord, paymentMethod, customBrief })
    });
    const body = await response.json().catch(() => ({ ok: false, error: "Checkout failed" }));

    if (!response.ok || !body.ok) {
      throw new Error(body.error || "Checkout failed");
    }

    if (body.mode === "stripe" && body.checkoutUrl) {
      setPurchaseStatus(`Checkout created (${body.orderId}). Redirecting to Stripe...`);
      window.location.href = body.checkoutUrl;
      return;
    }

    setPurchaseStatus(`Order ${body.orderId} paid in mock mode. Provision token: ${body.provisioningToken}`);
    await loadOrders().catch(() => {});
  } catch (error) {
    setPurchaseStatus(error.message, "error");
  }
});

refreshOrdersBtn.addEventListener("click", async () => {
  try {
    await loadOrders();
    await loadCommerceMetrics();
    setStatus("Orders refreshed.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

orderFilterPaymentEl.addEventListener("change", () => {
  renderOrdersWithFilters();
});

orderFilterProvisioningEl.addEventListener("change", () => {
  renderOrdersWithFilters();
});

orderSortSelectEl.addEventListener("change", () => {
  renderOrdersWithFilters();
});

orderSearchInputEl.addEventListener("input", () => {
  renderOrdersWithFilters();
});

clearOrderFiltersBtn.addEventListener("click", () => {
  orderFilterPaymentEl.value = "all";
  orderFilterProvisioningEl.value = "all";
  orderSortSelectEl.value = "newest";
  orderSearchInputEl.value = "";
  renderOrdersWithFilters();
});

uiDensitySelectEl.addEventListener("change", () => {
  uiPrefs.density = uiDensitySelectEl.value === "compact" ? "compact" : "comfortable";
  applyUiPreferences();
  saveUiPreferences();
});

reducedMotionToggleEl.addEventListener("change", () => {
  uiPrefs.reducedMotion = Boolean(reducedMotionToggleEl.checked);
  applyUiPreferences();
  saveUiPreferences();
  setupRevealAnimations();
});

compactLogsToggleEl.addEventListener("change", () => {
  uiPrefs.compactLogs = Boolean(compactLogsToggleEl.checked);
  applyUiPreferences();
  saveUiPreferences();
});

submitBusinessInquiryBtn.addEventListener("click", async () => {
  const companyName = businessCompanyNameEl instanceof HTMLInputElement ? businessCompanyNameEl.value.trim() : "";
  const contactName = businessContactNameEl instanceof HTMLInputElement ? businessContactNameEl.value.trim() : "";
  const email = businessEmailEl instanceof HTMLInputElement ? businessEmailEl.value.trim() : "";
  const discord = businessDiscordEl instanceof HTMLInputElement ? businessDiscordEl.value.trim() : "";
  const serviceCategory = businessServiceCategoryEl instanceof HTMLSelectElement ? businessServiceCategoryEl.value : "";
  const budgetUsd = Number(businessBudgetUsdEl instanceof HTMLInputElement ? businessBudgetUsdEl.value || 0 : 0);
  const projectSummary = businessProjectSummaryEl instanceof HTMLTextAreaElement ? businessProjectSummaryEl.value.trim() : "";

  // Client-side validation — mirrors server rules for fast feedback
  if (!companyName || companyName.length > 120) {
    setBusinessInquiryStatus("Company name is required (max 120 characters).", "error");
    businessCompanyNameEl?.focus();
    return;
  }
  if (!contactName || contactName.length > 120) {
    setBusinessInquiryStatus("Contact name is required (max 120 characters).", "error");
    businessContactNameEl?.focus();
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setBusinessInquiryStatus("A valid email address is required.", "error");
    businessEmailEl?.focus();
    return;
  }
  if (!serviceCategory) {
    setBusinessInquiryStatus("Please select a service category.", "error");
    businessServiceCategoryEl?.focus();
    return;
  }
  if (projectSummary.length < 25 || projectSummary.length > 3000) {
    setBusinessInquiryStatus(`Project summary must be 25–3000 characters (currently ${projectSummary.length}).`, "error");
    businessProjectSummaryEl?.focus();
    return;
  }

  const payload = { companyName, contactName, email, discord, serviceCategory, budgetUsd, projectSummary };

  submitBusinessInquiryBtn.disabled = true;
  submitBusinessInquiryBtn.textContent = "Submitting…";
  try {
    const response = await fetch("/api/business/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({ ok: false, error: "Inquiry submission failed" }));
    if (!response.ok || !body.ok) {
      throw new Error(body.error || "Inquiry submission failed");
    }

    setBusinessInquiryStatus(`Inquiry ${body.inquiryId} submitted successfully.`);
    businessProjectSummaryEl.value = "";
    if (body.latestQuote && body.latestQuote.quoteText) {
      setBusinessQuotePreview(body.latestQuote.quoteText);
    }
    await loadBusinessInquiries().catch(() => {});
    await loadBusinessPipelineBoard().catch(() => {});
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  } finally {
    submitBusinessInquiryBtn.disabled = false;
    submitBusinessInquiryBtn.textContent = "Submit Inquiry";
  }
});

if (businessProjectSummaryEl instanceof HTMLTextAreaElement && businessProjectSummaryCountEl instanceof HTMLElement) {
  const updateCount = () => {
    const len = businessProjectSummaryEl.value.length;
    businessProjectSummaryCountEl.textContent = `${len} / 3000`;
    businessProjectSummaryCountEl.classList.toggle("char-count-warn", len > 2800 || (len > 0 && len < 25));
    businessProjectSummaryCountEl.classList.toggle("char-count-ok", len >= 25 && len <= 3000);
  };
  businessProjectSummaryEl.addEventListener("input", updateCount);
  updateCount();
}

generateBusinessQuoteBtn.addEventListener("click", async () => {
  try {
    const template = await requestBusinessQuoteTemplate();
    setBusinessQuotePreview(String(template.quoteText || "No quote output."));
    setBusinessInquiryStatus("Quote draft generated from selected service category.");
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  }
});

refreshBusinessInquiriesBtn.addEventListener("click", async () => {
  try {
    await loadBusinessAnalytics();
    await loadBusinessInquiries();
    await loadBusinessPipelineBoard();
    setBusinessInquiryStatus("Business inquiry pipeline refreshed.");
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  }
});

businessInquiryFilterEl.addEventListener("change", async () => {
  try {
    await loadBusinessInquiries();
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  }
});

if (businessInquirySortEl instanceof HTMLSelectElement) {
  businessInquirySortEl.addEventListener("change", () => {
    businessInquirySortMode = businessInquirySortEl.value || "breach-first";
    refreshBusinessAgingVisuals();
  });
}

businessInquiryRowsEl.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const isStageSave = target.classList.contains("business-stage-save");
  const isSimulateBreach = target.classList.contains("business-breach-sim");
  const isRevertSimulation = target.classList.contains("business-breach-revert");
  if (!isStageSave && !isSimulateBreach && !isRevertSimulation) {
    return;
  }

  if (!isAuthenticated) {
    setBusinessInquiryStatus("Operator login required for stage updates.", "error");
    return;
  }

  const inquiryId = target.dataset.inquiryId;
  if (!inquiryId) {
    return;
  }

  if (isSimulateBreach) {
    try {
      const payload = await simulateBusinessInquiryBreach(inquiryId, 2);
      await loadBusinessAnalytics();
      await loadBusinessInquiries();
      await loadBusinessPipelineBoard();
      setBusinessInquiryStatus(`Simulated SLA breach for ${inquiryId} (+${payload.hoursOverdue}h).`);
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
    return;
  }

  if (isRevertSimulation) {
    try {
      await revertBusinessInquirySimulation(inquiryId);
      await loadBusinessAnalytics();
      await loadBusinessInquiries();
      await loadBusinessPipelineBoard();
      setBusinessInquiryStatus(`Reverted SLA simulation for ${inquiryId}.`);
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
    return;
  }

  const select = businessInquiryRowsEl.querySelector(`select.business-stage-select[data-inquiry-id="${inquiryId}"]`);
  const status = select instanceof HTMLSelectElement ? select.value : "";
  if (!status) {
    return;
  }

  try {
    await updateBusinessInquiryStage(inquiryId, status);
    await loadBusinessAnalytics();
    await loadBusinessInquiries();
    await loadBusinessPipelineBoard();
    setBusinessInquiryStatus(`Inquiry ${inquiryId} moved to ${status}.`);
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  }
});

businessPipelineBoardEl.addEventListener("dragstart", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("pipeline-card") || !isAuthenticated) {
    return;
  }

  target.classList.add("dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify({
      inquiryId: target.dataset.inquiryId,
      fromStage: target.dataset.stage
    }));
  }
});

businessPipelineBoardEl.addEventListener("dragend", () => {
  const dragging = businessPipelineBoardEl.querySelector(".pipeline-card.dragging");
  if (dragging instanceof HTMLElement) {
    dragging.classList.remove("dragging");
  }
  const columns = businessPipelineBoardEl.querySelectorAll(".pipeline-column.drop-target");
  columns.forEach((el) => el.classList.remove("drop-target"));
});

businessPipelineBoardEl.addEventListener("dragover", (event) => {
  if (!isAuthenticated) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const list = target.closest(".pipeline-list");
  if (list instanceof HTMLElement) {
    event.preventDefault();
    const column = list.closest(".pipeline-column");
    if (column instanceof HTMLElement) {
      const columns = businessPipelineBoardEl.querySelectorAll(".pipeline-column.drop-target");
      columns.forEach((el) => {
        if (el !== column) {
          el.classList.remove("drop-target");
        }
      });
      column.classList.add("drop-target");
    }
  }
});

businessPipelineBoardEl.addEventListener("drop", async (event) => {
  if (!isAuthenticated) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const list = target.closest(".pipeline-list");
  if (!(list instanceof HTMLElement)) {
    return;
  }
  event.preventDefault();

  const toStage = String(list.dataset.stage || "").toLowerCase();
  const payloadRaw = event.dataTransfer ? event.dataTransfer.getData("text/plain") : "";
  if (!payloadRaw) {
    return;
  }

  try {
    const payload = JSON.parse(payloadRaw);
    const inquiryId = String((payload || {}).inquiryId || "");
    const fromStage = String((payload || {}).fromStage || "").toLowerCase();
    if (!inquiryId || !toStage || fromStage === toStage) {
      return;
    }

    await updateBusinessInquiryStage(inquiryId, toStage);
    await loadBusinessAnalytics();
    await loadBusinessInquiries();
    await loadBusinessPipelineBoard();
    setBusinessInquiryStatus(`Inquiry ${inquiryId} moved from ${fromStage} to ${toStage}.`);
  } catch (error) {
    setBusinessInquiryStatus(error.message, "error");
  }
});

if (timelineCloseBtn instanceof HTMLElement) {
  timelineCloseBtn.addEventListener("click", () => {
    closeInquiryTimeline();
  });
}

if (timelineModal instanceof HTMLElement) {
  timelineModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("modal-overlay")) {
      closeInquiryTimeline();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && timelineModal instanceof HTMLElement && !timelineModal.hasAttribute("hidden")) {
    closeInquiryTimeline();
  }
});

if (businessSlaStripFilterBtn instanceof HTMLElement && businessInquiryFilterEl instanceof HTMLSelectElement) {
  businessSlaStripFilterBtn.addEventListener("click", async () => {
    try {
      businessInquiryFilterEl.value = "all";
      await loadBusinessInquiries();
      const breachedId = businessInquiries.find((row) => getInquiryAgingMeta(row).isBreached)?.id;
      if (breachedId) {
        const node = businessInquiryRowsEl.querySelector(`.business-stage-save[data-inquiry-id="${breachedId}"]`);
        const row = node ? node.closest("li") : null;
        if (row instanceof HTMLElement) {
          row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaStripRevertAllBtn instanceof HTMLElement) {
  businessSlaStripRevertAllBtn.addEventListener("click", async () => {
    try {
      const payload = await revertAllBusinessInquirySimulations();
      await loadBusinessAnalytics();
      await loadBusinessInquiries();
      await loadBusinessPipelineBoard();
      setBusinessInquiryStatus(`Reverted simulation on ${payload.reverted} inquiry(s).`);
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaStripExportBtn instanceof HTMLElement) {
  businessSlaStripExportBtn.addEventListener("click", async () => {
    try {
      await exportBusinessSlaReportCsv();
      setBusinessInquiryStatus("SLA report exported as CSV.");
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaExportBtn instanceof HTMLElement) {
  businessSlaExportBtn.addEventListener("click", async () => {
    try {
      await exportBusinessSlaReportCsv();
      setBusinessInquiryStatus("SLA report exported as CSV.");
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaPresetTodayBtn instanceof HTMLElement) {
  businessSlaPresetTodayBtn.addEventListener("click", async () => {
    try {
      await handleBusinessSlaPresetClick(0, "today");
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaPreset7dBtn instanceof HTMLElement) {
  businessSlaPreset7dBtn.addEventListener("click", async () => {
    try {
      await handleBusinessSlaPresetClick(6, "last-7d");
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaPreset30dBtn instanceof HTMLElement) {
  businessSlaPreset30dBtn.addEventListener("click", async () => {
    try {
      await handleBusinessSlaPresetClick(29, "last-30d");
    } catch (error) {
      setBusinessInquiryStatus(error.message, "error");
    }
  });
}

if (businessSlaExportClearBtn instanceof HTMLElement) {
  businessSlaExportClearBtn.addEventListener("click", async () => {
    clearBusinessSlaExportFilters();
    setBusinessInquiryStatus("SLA export filters cleared.");

    if (isAuthenticated) {
      try {
        await sendCommand("businessSlaFiltersReset", "start=-; end=-; breachedOnly=false");
      } catch (_error) {
        // Do not block local reset if audit log command fails.
      }
    }
  });
}

exportOrdersBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/store/orders/export?format=csv", { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error("Order export failed.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trh-orders-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Orders exported as CSV.");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

lookupOrderBtn.addEventListener("click", async () => {
  const orderId = lookupOrderIdEl.value.trim();
  const email = lookupEmailEl.value.trim();

  if (!orderId || !email) {
    setLookupStatus("Order ID and email are required.", "error");
    return;
  }

  try {
    const params = new URLSearchParams({ orderId, email });
    const response = await fetch(`/api/store/order-status?${params.toString()}`);
    const body = await response.json().catch(() => ({ ok: false, error: "Lookup failed" }));
    if (!response.ok || !body.ok) {
      throw new Error(body.error || "Lookup failed");
    }

    const order = body.order;
    setLookupStatus(
      `Order ${order.id}: payment=${order.paymentStatus}, provisioning=${order.provisioningStatus}, token=${order.provisioningToken || "pending"}`
    );
  } catch (error) {
    setLookupStatus(error.message, "error");
  }
});

loadMyBotsBtn.addEventListener("click", async () => {
  const email = myBotsEmailEl.value.trim();
  const discord = myBotsDiscordEl.value.trim();

  try {
    if (!email && !discord) {
      await loadLocalMachineBots();
      return;
    }

    isLocalMachineBotsMode = false;
    localMachineBots = [];

    const params = new URLSearchParams();
    if (email) {
      params.set("email", email);
    }
    if (discord) {
      params.set("discord", discord);
    }

    const [botsRes, portfolioRes, controlRes] = await Promise.all([
      fetch(`/api/store/customer/bots?${params.toString()}`),
      fetch(`/api/store/customer/portfolio?${params.toString()}`),
      fetch(`/api/client/control-status?${params.toString()}`)
    ]);

    const botsBody = await botsRes.json().catch(() => ({ ok: false, error: "Bot lookup failed" }));
    const portfolioBody = await portfolioRes.json().catch(() => ({ ok: false, error: "Portfolio lookup failed" }));
    const controlBody = await controlRes.json().catch(() => ({ ok: false, error: "Control status failed" }));
    if (!botsRes.ok || !botsBody.ok) {
      throw new Error(botsBody.error || "Bot lookup failed");
    }
    if (!portfolioRes.ok || !portfolioBody.ok) {
      throw new Error(portfolioBody.error || "Portfolio lookup failed");
    }

    renderMyBots(botsBody.bots || []);
    renderCustomerPortfolio(portfolioBody);
    const clientStatus = controlBody && controlBody.client
      ? `Status=${controlBody.client.paymentState}, Remaining=$${Number(controlBody.client.remainingBalanceUsd || 0).toLocaleString()}, Next Due=${controlBody.client.nextPaymentDueAt ? new Date(controlBody.client.nextPaymentDueAt).toLocaleDateString() : "-"}`
      : "No payment profile found.";
    setMyBotsStatus(`Loaded ${Number(botsBody.total || 0)} bot(s). ${clientStatus}`);
    setPortfolioStatus(`Loaded ${Number((portfolioBody.summary || {}).totalPurchases || 0)} paid purchase(s).`);
  } catch (error) {
    setMyBotsStatus(error.message, "error");
    setPortfolioStatus(error.message, "error");
  }
});

if (myBotsSearchEl instanceof HTMLInputElement) {
  myBotsSearchEl.addEventListener("input", () => {
    applyLocalMachineBotFilters();
  });
}

if (myBotsActiveFilterEl instanceof HTMLSelectElement) {
  myBotsActiveFilterEl.addEventListener("change", () => {
    applyLocalMachineBotFilters();
  });
}

if (refreshLocalBotsBtn instanceof HTMLElement) {
  refreshLocalBotsBtn.addEventListener("click", async () => {
    try {
      await loadLocalMachineBots();
      setMyBotsStatus(`Local scan refreshed. ${getFilteredLocalMachineBots().length} bot(s) visible.`);
    } catch (error) {
      setMyBotsStatus(error.message, "error");
    }
  });
}

screenTabsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("tab-btn") && target.dataset.screen) {
    setActiveScreen(target.dataset.screen);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("quick-nav") && target.dataset.screen) {
    setActiveScreen(target.dataset.screen);
  }
});

// Team bot card navigation
document.addEventListener("click", (event) => {
  const card = event.target instanceof HTMLElement
    ? event.target.closest("[data-nav-screen]")
    : null;
  if (card instanceof HTMLElement && card.dataset.navScreen) {
    setActiveScreen(card.dataset.navScreen);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target instanceof HTMLElement
    ? event.target.closest("[data-nav-screen]")
    : null;
  if (card instanceof HTMLElement && card.dataset.navScreen) {
    event.preventDefault();
    setActiveScreen(card.dataset.navScreen);
  }
});

storeCatalogEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("choose-bot-market")) {
    const botId = target.dataset.botId;
    if (botId) {
      setActiveScreen(`botScreen-${botId}`);
    }
  }
});

offeringCatalogEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("choose-offering")) {
    const offeringId = target.dataset.offeringId;
    if (offeringId) {
      purchaseBotIdEl.value = offeringId;
      const selected = offeringItems.find((item) => item.id === offeringId);
      if (selected && selected.audience === "owner") {
        purchaseBuyerTypeEl.value = "owner";
      }
      setPurchaseStatus(`Checkout preset for ${offeringId}. Enter buyer details to continue.`);
    }
  }
});

offeringTabAllEl.addEventListener("click", () => {
  offeringAudienceFilter = "all";
  renderOfferings();
});

offeringTabUsersEl.addEventListener("click", () => {
  offeringAudienceFilter = "user";
  renderOfferings();
});

offeringTabOwnersEl.addEventListener("click", () => {
  offeringAudienceFilter = "owner";
  renderOfferings();
});

if (settingsExportConfigJsonBtn instanceof HTMLElement) {
  settingsExportConfigJsonBtn.addEventListener("click", async () => {
    try {
      await exportOwnerConfigHealth("json");
      setSettingsConfigExportStatus("Configuration readiness report exported as JSON.");
    } catch (error) {
      setSettingsConfigExportStatus(error.message, "error");
    }
  });
}

if (settingsExportConfigCsvBtn instanceof HTMLElement) {
  settingsExportConfigCsvBtn.addEventListener("click", async () => {
    try {
      await exportOwnerConfigHealth("csv");
      setSettingsConfigExportStatus("Configuration readiness report exported as CSV.");
    } catch (error) {
      setSettingsConfigExportStatus(error.message, "error");
    }
  });
}

botScreensMountEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const botId = target.dataset.botId;
  if (!botId) {
    return;
  }

  if (target.classList.contains("choose-bot")) {
    purchaseBotIdEl.value = botId;
    setActiveScreen("marketScreen");
    setPurchaseStatus(`Checkout preset for ${botId}. Enter customer info to continue.`);
  }

  if (target.classList.contains("choose-bot-market")) {
    purchaseBotIdEl.value = botId;
    setActiveScreen("marketScreen");
  }
});

themeSelectEl.addEventListener("change", () => {
  applyTheme(BEST_THEME);
});

themeCycleBtn.addEventListener("click", () => {
  applyTheme(BEST_THEME);
});

(async () => {
  loadUiPreferences();
  applyUiPreferences();
  applyTheme(BEST_THEME);
  initNavigationAssist();
  themeSelectEl.disabled = true;
  themeCycleBtn.disabled = true;
  themeCycleBtn.title = "Theme is locked to Executive Blue";
  setActiveScreen(getInitialScreenId());
  setupRevealAnimations();
  installImageFallbackGuard();
  await checkAuth();
  await checkOwnerAuth();
  await loadPlatformOverview();
  await loadStoreCatalog();
  await loadOfferings();
  await loadBuildLibrary();
  await loadBusinessServices();
  await loadNewPricingCatalogs().catch(() => {});
  if (businessInquirySortEl instanceof HTMLSelectElement) {
    businessInquirySortMode = businessInquirySortEl.value || "breach-first";
  }
  setBusinessQuotePreview("Generate a quote draft to preview category pricing tiers and milestone structure.");

  const initial = await fetch("/api/state");
  const state = await initial.json();
  render(state);
  refreshNavigationAssistOptions();

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  let wsRetryDelay = 1500;
  let wsRetryTimer = null;

  function connectWs() {
    const socket = new WebSocket(`${protocol}://${location.host}/ws`);

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "state") {
          render(message.payload);
          if (isAuthenticated) {
            loadOpsData().catch(() => {});
            if (isOwnerAuthenticated) {
              loadOwnerOverview().catch(() => {});
            }
          }
        } else if (message.type === "lockout") {
          const p = message.payload || {};
          systemLockoutActive = Boolean(p.active);
          systemLockoutLevel = p.level || null;
          renderLockoutOverlay(p);
        }
      } catch (_) { /* malformed frame — ignore */ }
    });

    socket.addEventListener("open", () => {
      wsRetryDelay = 1500; // reset backoff on successful connect
      if (wsStatusEl instanceof HTMLElement) {
        wsStatusEl.title = "Live — receiving real-time updates";
        wsStatusEl.dataset.wsState = "open";
      }
    });

    socket.addEventListener("close", () => {
      if (wsStatusEl instanceof HTMLElement) wsStatusEl.dataset.wsState = "closed";
      if (wsRetryTimer) clearTimeout(wsRetryTimer);
      wsRetryTimer = setTimeout(connectWs, wsRetryDelay);
      wsRetryDelay = Math.min(wsRetryDelay * 2, 30000); // cap at 30 s
    });

    socket.addEventListener("error", () => {
      socket.close();
    });

    return socket;
  }

  let _activeSocket = connectWs();

  // Re-connect immediately when the tab becomes visible again after being hidden.
  // The WS connection may have been killed while the tab was backgrounded.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (_activeSocket.readyState === WebSocket.CLOSED ||
          _activeSocket.readyState === WebSocket.CLOSING) {
        if (wsRetryTimer) clearTimeout(wsRetryTimer);
        wsRetryDelay = 1500;
        _activeSocket = connectWs();
      }
    }
  });

  if (isAuthenticated) {
    await loadOpsData();
    await loadOrders();
    await loadCommerceMetrics();
    await loadBusinessAnalytics();
    await loadBusinessInquiries();
    await loadBusinessPipelineBoard();
    setStatus("Control panel live and synchronized.");
  } else {
    setStatus("Operator login required to unlock command and audit controls.", "error");
    renderBusinessMetrics({});
    renderBusinessInquiries([]);
    renderBusinessPipelineBoard([]);
  }

  consumeAuthQueryFeedback();

  hideLoadingGate();

  setInterval(() => {
    if (isAuthenticated) {
      loadOpsData().catch(() => {});
      loadOrders().catch(() => {});
      loadCommerceMetrics().catch(() => {});
      loadBusinessAnalytics().catch(() => {});
      loadBusinessInquiries().catch(() => {});
      loadBusinessPipelineBoard().catch(() => {});
    }
    loadPlatformOverview().catch(() => {});
  }, 15000);

  setInterval(() => {
    refreshBusinessAgingVisuals();
  }, 60000);
})();

setTimeout(() => {
  hideLoadingGate();
}, 5000);

// =============================================================
// EMERGENCY LOCKOUT SYSTEM
// =============================================================

let lockoutOverlayEl = null;

function renderLockoutOverlay(info) {
  systemLockoutActive = Boolean((info || {}).active);
  systemLockoutLevel = (info || {}).level || null;

  // Update persistent banner in emergency screen
  if (emergencyLockoutBannerEl instanceof HTMLElement) {
    emergencyLockoutBannerEl.hidden = !systemLockoutActive;
    if (systemLockoutActive) {
      if (emergencyBannerLevelEl) emergencyBannerLevelEl.textContent = String(systemLockoutLevel || "lockout").toUpperCase();
      if (emergencyBannerSinceEl) emergencyBannerSinceEl.textContent = (info || {}).activatedAt
        ? `Since: ${new Date(info.activatedAt).toLocaleString()}`
        : "";
    }
  }

  // Create full-screen overlay if lockout is active and overlay not already visible
  if (systemLockoutActive && !lockoutOverlayEl) {
    lockoutOverlayEl = document.createElement("div");
    lockoutOverlayEl.id = "emergencyLockoutOverlay";
    lockoutOverlayEl.className = "lockout-overlay";
    const levelLabel = String(systemLockoutLevel || "lockout").toUpperCase();
    lockoutOverlayEl.innerHTML = `
      <div class="lockout-overlay-inner">
        <div class="lockout-overlay-icon">&#x1F6A8;</div>
        <h1 class="lockout-overlay-title">SYSTEM LOCKED</h1>
        <p class="lockout-overlay-level">${escapeHtml(levelLabel)} LOCKOUT ACTIVE</p>
        <p class="lockout-overlay-msg">TRH Development Services Temporarily Disabled By Owner</p>
        <p class="lockout-overlay-sub">Contact the system owner to restore access.</p>
      </div>
    `;
    document.body.appendChild(lockoutOverlayEl);
  } else if (!systemLockoutActive && lockoutOverlayEl) {
    lockoutOverlayEl.remove();
    lockoutOverlayEl = null;
  }
}

function setEmergencyActionStatus(message, kind = "ok") {
  if (emergencyActionStatusEl instanceof HTMLElement) {
    emergencyActionStatusEl.textContent = message;
    emergencyActionStatusEl.className = `status-line meta-line ${kind}`;
  }
}

function setEmergencyRestoreStatus(message, kind = "ok") {
  if (emergencyRestoreStatusEl instanceof HTMLElement) {
    emergencyRestoreStatusEl.textContent = message;
    emergencyRestoreStatusEl.className = `status-line meta-line ${kind}`;
  }
}

function setEmergencySessionStatus(message, kind = "ok") {
  if (emergencySessionStatusEl instanceof HTMLElement) {
    emergencySessionStatusEl.textContent = message;
    emergencySessionStatusEl.className = `status-line meta-line ${kind}`;
  }
}

function setEmergencyBlacklistStatus(message, kind = "ok") {
  if (emergencyBlacklistStatusEl instanceof HTMLElement) {
    emergencyBlacklistStatusEl.textContent = message;
    emergencyBlacklistStatusEl.className = `status-line meta-line ${kind}`;
  }
}

function getEmergencyCredentials() {
  return {
    ownerPassword: emergencyOwnerPasswordEl instanceof HTMLInputElement ? emergencyOwnerPasswordEl.value.trim() : "",
    recoveryKey: emergencyRecoveryKeyEl instanceof HTMLInputElement ? emergencyRecoveryKeyEl.value.trim() : "",
    silentMode: emergencySilentModeEl instanceof HTMLInputElement ? emergencySilentModeEl.checked : false
  };
}

function clearEmergencyPasswords() {
  if (emergencyOwnerPasswordEl instanceof HTMLInputElement) emergencyOwnerPasswordEl.value = "";
  if (emergencyRecoveryKeyEl instanceof HTMLInputElement) emergencyRecoveryKeyEl.value = "";
}

async function loadEmergencyStatus() {
  try {
    const res = await fetch("/api/emergency/status", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({ ok: false }));
    if (!(emergencyStatusDisplayEl instanceof HTMLElement)) return;

    if (!body.ok && res.status === 401) {
      emergencyStatusDisplayEl.innerHTML = `<span class="emergency-status-label">Requires owner authentication to view full status.</span>`;
      return;
    }

    if (body.active !== undefined && !body.lockout) {
      // Public lockout-active response
      emergencyStatusDisplayEl.innerHTML = `
        <div class="emergency-status-row">
          <span class="emergency-status-badge active">&#x1F534; LOCKED</span>
          <span>Level: <strong>${escapeHtml(body.level || "unknown")}</strong></span>
          <span>Since: ${body.activatedAt ? new Date(body.activatedAt).toLocaleString() : "—"}</span>
        </div>
      `;
      renderLockoutOverlay({ active: true, level: body.level, activatedAt: body.activatedAt });
      return;
    }

    if (body.lockout) {
      const lk = body.lockout;
      const bl = body.blacklistCounts || {};
      const isActive = lk.active;

      systemLockoutActive = isActive;
      systemLockoutLevel = lk.level || null;

      emergencyStatusDisplayEl.innerHTML = `
        <div class="emergency-status-row">
          <span class="emergency-status-badge ${isActive ? "active" : "inactive"}">${isActive ? "&#x1F534; LOCKED" : "&#x2705; NORMAL"}</span>
          <span>Level: <strong>${escapeHtml(lk.level || "—")}</strong></span>
          <span>Since: ${lk.activatedAt ? new Date(lk.activatedAt).toLocaleString() : "—"}</span>
          <span>By: ${escapeHtml(lk.activatedBy || "—")}</span>
          <span>Silent: ${lk.silentMode ? "Yes" : "No"}</span>
          <span>DB Frozen: ${lk.databaseFrozen ? "<strong class='emergency-danger-text'>Yes</strong>" : "No"}</span>
        </div>
        <div class="emergency-blacklist-counts">
          Blacklist: ${bl.ips || 0} IPs &bull; ${bl.discordIds || 0} Discord IDs &bull; ${bl.sessionIds || 0} Sessions
        </div>
      `;

      if (emergencyLockoutBannerEl instanceof HTMLElement) {
        emergencyLockoutBannerEl.hidden = !isActive;
        if (isActive && emergencyBannerLevelEl) emergencyBannerLevelEl.textContent = String(lk.level || "").toUpperCase();
        if (isActive && emergencyBannerSinceEl) emergencyBannerSinceEl.textContent = lk.activatedAt ? `Since: ${new Date(lk.activatedAt).toLocaleString()}` : "";
      }
    }
  } catch (err) {
    if (emergencyStatusDisplayEl instanceof HTMLElement) {
      emergencyStatusDisplayEl.textContent = `Error: ${err.message}`;
    }
  }
}

async function sendEmergencyLockout(level) {
  const creds = getEmergencyCredentials();
  if (!creds.ownerPassword) {
    setEmergencyActionStatus("Enter owner password first.", "error");
    return;
  }

  const confirmation = confirm(`CONFIRM: Activate ${String(level).toUpperCase()} lockout?\n\nThis will immediately block all non-owner access and purge sessions.${level === "shutdown" ? "\n\nBot processes will be terminated." : ""}${level === "nuclear" ? "\n\nAll bots will be killed and database writes frozen." : ""}`);
  if (!confirmation) return;

  try {
    const res = await fetch("/api/emergency/lockout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerPassword: creds.ownerPassword, recoveryKey: creds.recoveryKey, level, silentMode: creds.silentMode })
    });
    const body = await res.json().catch(() => ({ ok: false, error: "Lockout request failed" }));
    if (!res.ok || !body.ok) throw new Error(body.error || "Lockout activation failed");

    clearEmergencyPasswords();
    systemLockoutActive = true;
    systemLockoutLevel = level;
    setEmergencyActionStatus(`LOCKED at level=${level}. Sessions revoked: ${body.sessionsRevoked}. WS kicked: ${body.wsClientsKicked}.`);
    await loadEmergencyStatus();
  } catch (err) {
    setEmergencyActionStatus(err.message, "error");
  }
}

async function sendEmergencyRestore() {
  const creds = getEmergencyCredentials();
  if (!creds.ownerPassword) {
    setEmergencyRestoreStatus("Enter owner password first.", "error");
    return;
  }

  const confirmation = confirm("CONFIRM: Restore system from lockout?\n\nAll services will be re-enabled and access restored.");
  if (!confirmation) return;

  try {
    const res = await fetch("/api/emergency/restore", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerPassword: creds.ownerPassword, recoveryKey: creds.recoveryKey })
    });
    const body = await res.json().catch(() => ({ ok: false, error: "Restore request failed" }));
    if (!res.ok || !body.ok) throw new Error(body.error || "System restore failed");

    clearEmergencyPasswords();
    systemLockoutActive = false;
    systemLockoutLevel = null;
    if (lockoutOverlayEl) { lockoutOverlayEl.remove(); lockoutOverlayEl = null; }
    if (emergencyLockoutBannerEl instanceof HTMLElement) emergencyLockoutBannerEl.hidden = true;
    setEmergencyRestoreStatus(`System restored. Previous level: ${body.previousLevel || "none"}. Bot online: ${body.system && body.system.botOnline ? "Yes" : "No"}.`);
    await loadEmergencyStatus();
  } catch (err) {
    setEmergencyRestoreStatus(err.message, "error");
  }
}

async function sendEmergencyPurgeSessions() {
  const confirmation = confirm("CONFIRM: Purge ALL active operator sessions?\n\nAll logged-in operators will be immediately logged out.");
  if (!confirmation) return;

  try {
    const res = await fetch("/api/emergency/purge-sessions", {
      method: "POST",
      credentials: "same-origin"
    });
    const body = await res.json().catch(() => ({ ok: false, error: "Purge failed" }));
    if (!res.ok || !body.ok) throw new Error(body.error || "Session purge failed");
    setEmergencySessionStatus(`Purged ${body.sessionsRevoked} session(s).`);
  } catch (err) {
    setEmergencySessionStatus(err.message, "error");
  }
}

async function sendEmergencyBlacklistUpdate(action) {
  const type = emergencyBlacklistTypeEl instanceof HTMLSelectElement ? emergencyBlacklistTypeEl.value : "ip";
  const value = emergencyBlacklistValueEl instanceof HTMLInputElement ? emergencyBlacklistValueEl.value.trim() : "";
  if (!value) {
    setEmergencyBlacklistStatus("Enter a value to blacklist.", "error");
    return;
  }

  try {
    const res = await fetch("/api/emergency/blacklist", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, type, value })
    });
    const body = await res.json().catch(() => ({ ok: false, error: "Blacklist update failed" }));
    if (!res.ok || !body.ok) throw new Error(body.error || "Blacklist update failed");

    if (emergencyBlacklistValueEl instanceof HTMLInputElement) emergencyBlacklistValueEl.value = "";
    setEmergencyBlacklistStatus(`${action === "add" ? "Added" : "Removed"} ${type}=${value}. IPs: ${body.counts.ips}, Discord: ${body.counts.discordIds}, Sessions: ${body.counts.sessionIds}.`);
  } catch (err) {
    setEmergencyBlacklistStatus(err.message, "error");
  }
}

async function loadEmergencyBlacklist() {
  try {
    const res = await fetch("/api/emergency/blacklist", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({ ok: false }));
    if (!res.ok || !body.ok) throw new Error(body.error || "Blacklist load failed");

    const bl = body.blacklist || {};
    if (emergencyBlacklistIpCountEl) emergencyBlacklistIpCountEl.textContent = (bl.ips || []).length;
    if (emergencyBlacklistDiscordCountEl) emergencyBlacklistDiscordCountEl.textContent = (bl.discordIds || []).length;
    if (emergencyBlacklistSessionCountEl) emergencyBlacklistSessionCountEl.textContent = (bl.sessionIds || []).length;

    const render = (listEl, items) => {
      if (!(listEl instanceof HTMLElement)) return;
      listEl.innerHTML = "";
      for (const item of (items || [])) {
        const li = document.createElement("li");
        li.className = "emergency-blacklist-item";
        li.textContent = item;
        listEl.appendChild(li);
      }
      if (!items || items.length === 0) {
        const li = document.createElement("li");
        li.textContent = "None";
        listEl.appendChild(li);
      }
    };

    render(emergencyBlacklistIpListEl, bl.ips);
    render(emergencyBlacklistDiscordListEl, bl.discordIds);
    render(emergencyBlacklistSessionListEl, bl.sessionIds);
    if (emergencyBlacklistDisplayEl instanceof HTMLElement) emergencyBlacklistDisplayEl.hidden = false;

    // Also render abuse log
    if (emergencyAbuseLogListEl instanceof HTMLElement) {
      emergencyAbuseLogListEl.innerHTML = "";
      for (const entry of (body.abuseLogs || [])) {
        const li = document.createElement("li");
        li.className = "emergency-abuse-entry";
        const ts = entry.at ? new Date(entry.at).toLocaleString() : "—";
        li.textContent = `[${ts}] ${entry.ip || "—"} | ${entry.method || "GET"} ${entry.path || "—"} | ${entry.reason || "—"}${entry.discordId ? ` | Discord: ${entry.discordId}` : ""}`;
        emergencyAbuseLogListEl.appendChild(li);
      }
      if (!body.abuseLogs || body.abuseLogs.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No abuse log entries yet.";
        emergencyAbuseLogListEl.appendChild(li);
      }
    }
  } catch (err) {
    setEmergencyBlacklistStatus(err.message, "error");
  }
}

// Wire up emergency button events
if (emergencyLockoutBtn instanceof HTMLElement) {
  emergencyLockoutBtn.addEventListener("click", () => sendEmergencyLockout("lockout").catch(console.error));
}
if (emergencyShutdownBtn instanceof HTMLElement) {
  emergencyShutdownBtn.addEventListener("click", () => sendEmergencyLockout("shutdown").catch(console.error));
}
if (emergencyNuclearBtn instanceof HTMLElement) {
  emergencyNuclearBtn.addEventListener("click", () => sendEmergencyLockout("nuclear").catch(console.error));
}
if (emergencyRestoreBtn instanceof HTMLElement) {
  emergencyRestoreBtn.addEventListener("click", () => sendEmergencyRestore().catch(console.error));
}
if (emergencyRefreshStatusBtn instanceof HTMLElement) {
  emergencyRefreshStatusBtn.addEventListener("click", () => loadEmergencyStatus().catch(console.error));
}
if (emergencyPurgeSessionsBtn instanceof HTMLElement) {
  emergencyPurgeSessionsBtn.addEventListener("click", () => sendEmergencyPurgeSessions().catch(console.error));
}
if (emergencyBlacklistAddBtn instanceof HTMLElement) {
  emergencyBlacklistAddBtn.addEventListener("click", () => sendEmergencyBlacklistUpdate("add").catch(console.error));
}
if (emergencyBlacklistRemoveBtn instanceof HTMLElement) {
  emergencyBlacklistRemoveBtn.addEventListener("click", () => sendEmergencyBlacklistUpdate("remove").catch(console.error));
}
if (emergencyLoadBlacklistBtn instanceof HTMLElement) {
  emergencyLoadBlacklistBtn.addEventListener("click", () => loadEmergencyBlacklist().catch(console.error));
}
if (emergencyLoadAbuseLogBtn instanceof HTMLElement) {
  emergencyLoadAbuseLogBtn.addEventListener("click", () => loadEmergencyBlacklist().catch(console.error));
}

// Load emergency status when the Emergency tab is activated
screenTabsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.screen === "emergencyScreen") {
    loadEmergencyStatus().catch(console.error);
  }
  if (target instanceof HTMLElement && target.dataset.screen === "usersScreen") {
    loadUsersPage(1).catch(console.error);
  }
}, true); // capture phase fires before the main screenTabs listener

// =============================================================
// USERS TRACKING & ENFORCEMENT PANEL
// =============================================================

const usersOwnerPasswordEl = document.getElementById("usersOwnerPassword");
const usersRefreshBtn = document.getElementById("usersRefreshBtn");
const usersSearchInput = document.getElementById("usersSearchInput");
const usersTierFilter = document.getElementById("usersTierFilter");
const usersBlacklistedOnly = document.getElementById("usersBlacklistedOnly");
const usersFrozenOnly = document.getElementById("usersFrozenOnly");
const usersSearchBtn = document.getElementById("usersSearchBtn");
const usersSearchStatus = document.getElementById("usersSearchStatus");
const usersTable = document.getElementById("usersTable");
const usersTableBody = document.getElementById("usersTableBody");
const usersPagination = document.getElementById("usersPagination");
const usersPrevBtn = document.getElementById("usersPrevBtn");
const usersNextBtn = document.getElementById("usersNextBtn");
const usersPageLabel = document.getElementById("usersPageLabel");
const usersDetailSection = document.getElementById("usersDetailSection");
const usersDetailContent = document.getElementById("usersDetailContent");
const usersDetailCloseBtn = document.getElementById("usersDetailCloseBtn");
const usersDetailBlacklistBtn = document.getElementById("usersDetailBlacklistBtn");
const usersDetailUnblacklistBtn = document.getElementById("usersDetailUnblacklistBtn");
const usersDetailFreezeBtn = document.getElementById("usersDetailFreezeBtn");
const usersDetailRestoreBtn = document.getElementById("usersDetailRestoreBtn");
const usersDetailStatus = document.getElementById("usersDetailStatus");
const usersCmdDiscordId = document.getElementById("usersCmdDiscordId");
const usersCmdReason = document.getElementById("usersCmdReason");
const usersCmdDetail = document.getElementById("usersCmdDetail");
const usersCmdTier = document.getElementById("usersCmdTier");
const usersCmdBlacklistBtn = document.getElementById("usersCmdBlacklistBtn");
const usersCmdUnblacklistBtn = document.getElementById("usersCmdUnblacklistBtn");
const usersCmdFreezeBtn = document.getElementById("usersCmdFreezeBtn");
const usersCmdRestoreBtn = document.getElementById("usersCmdRestoreBtn");
const usersCmdSetTierBtn = document.getElementById("usersCmdSetTierBtn");
const usersCmdStatus = document.getElementById("usersCmdStatus");
const usersLoadBlacklistBtn = document.getElementById("usersLoadBlacklistBtn");
const usersBlacklistList = document.getElementById("usersBlacklistList");
const usersBlacklistStatus = document.getElementById("usersBlacklistStatus");
const usersLogDiscordId = document.getElementById("usersLogDiscordId");
const usersLoadLogBtn = document.getElementById("usersLoadLogBtn");
const usersLogList = document.getElementById("usersLogList");
const usersLogStatus = document.getElementById("usersLogStatus");

let usersCurrentPage = 1;
let usersTotalPages = 1;
let usersDetailDiscordId = null;

function getUsersOwnerPassword() {
  return usersOwnerPasswordEl instanceof HTMLElement ? usersOwnerPasswordEl.value.trim() : "";
}

function setUsersStatus(el, msg, isError) {
  if (!(el instanceof HTMLElement)) return;
  el.textContent = msg;
  el.style.color = isError ? "var(--color-red, #e74c3c)" : "var(--color-muted, #888)";
}

function getUserStatusBadge(profile) {
  if (profile.blacklisted) return `<span class="users-badge users-badge-blacklisted">Blacklisted</span>`;
  if (profile.frozen) return `<span class="users-badge users-badge-frozen">Frozen</span>`;
  return `<span class="users-badge users-badge-active">Active</span>`;
}

function getTierBadge(tier) {
  const classes = { free: "users-tier-free", vip: "users-tier-vip", pro: "users-tier-pro", premium: "users-tier-premium" };
  return `<span class="users-tier-badge ${classes[tier] || "users-tier-free"}">${escapeHtml(String(tier || "free").toUpperCase())}</span>`;
}

async function loadUsersPage(page) {
  const pwd = getUsersOwnerPassword();
  if (!pwd) {
    setUsersStatus(usersSearchStatus, "Enter your owner password above to search the user registry.", false);
    return;
  }
  setUsersStatus(usersSearchStatus, "Loading...", false);

  const search = usersSearchInput instanceof HTMLElement ? usersSearchInput.value.trim() : "";
  const tier = usersTierFilter instanceof HTMLElement ? usersTierFilter.value : "all";
  const blacklisted = usersBlacklistedOnly instanceof HTMLElement ? usersBlacklistedOnly.checked : false;
  const frozen = usersFrozenOnly instanceof HTMLElement ? usersFrozenOnly.checked : false;

  const params = new URLSearchParams({ page, pageSize: 50, tier });
  if (search) params.set("search", search);
  if (blacklisted) params.set("blacklistedOnly", "true");
  if (frozen) params.set("frozenOnly", "true");

  try {
    const response = await fetch(`/api/owner/user-profiles?${params}`, {
      headers: { "x-owner-key": pwd },
      credentials: "same-origin"
    });
    const body = await response.json().catch(() => ({}));
    if (!body.ok) {
      setUsersStatus(usersSearchStatus, body.error || "Failed to load users.", true);
      return;
    }

    const rows = Array.isArray(body.rows) ? body.rows : [];
    usersCurrentPage = page;
    usersTotalPages = Math.max(1, Math.ceil((body.total || 0) / 50));

    if (usersTableBody instanceof HTMLElement) usersTableBody.innerHTML = "";
    if (rows.length === 0) {
      setUsersStatus(usersSearchStatus, `No users found. Total in registry: ${body.total || 0}`, false);
      if (usersTable instanceof HTMLElement) usersTable.hidden = true;
      if (usersPagination instanceof HTMLElement) usersPagination.hidden = true;
      return;
    }

    setUsersStatus(usersSearchStatus, `Showing ${rows.length} of ${body.total} users`, false);
    if (usersTable instanceof HTMLElement) usersTable.hidden = false;

    for (const profile of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><code class="users-id-code">${escapeHtml(profile.discordId)}</code></td>
        <td>${escapeHtml(profile.username || profile.displayName || "—")}</td>
        <td>${getTierBadge(profile.tier)}</td>
        <td>${getUserStatusBadge(profile)}</td>
        <td>${Number(profile.commandCount || 0).toLocaleString()}</td>
        <td class="users-date">${profile.lastSeenAt ? new Date(profile.lastSeenAt).toLocaleDateString() : "Never"}</td>
        <td><button class="button tiny ghost users-view-btn" data-discord-id="${escapeHtml(profile.discordId)}">View</button></td>
      `;
      if (usersTableBody instanceof HTMLElement) usersTableBody.appendChild(tr);
    }

    if (usersPagination instanceof HTMLElement) usersPagination.hidden = usersTotalPages <= 1;
    if (usersPageLabel instanceof HTMLElement) usersPageLabel.textContent = `Page ${usersCurrentPage} / ${usersTotalPages}`;
    if (usersPrevBtn instanceof HTMLElement) usersPrevBtn.disabled = usersCurrentPage <= 1;
    if (usersNextBtn instanceof HTMLElement) usersNextBtn.disabled = usersCurrentPage >= usersTotalPages;

  } catch (err) {
    setUsersStatus(usersSearchStatus, `Error: ${err.message}`, true);
  }
}

async function loadUserDetail(discordId) {
  const pwd = getUsersOwnerPassword();
  if (!pwd) { setUsersStatus(usersDetailStatus, "Owner password required.", true); return; }

  try {
    const response = await fetch(`/api/owner/user-profiles/${encodeURIComponent(discordId)}`, {
      headers: { "x-owner-key": pwd },
      credentials: "same-origin"
    });
    const body = await response.json().catch(() => ({}));
    if (!body.ok) { setUsersStatus(usersDetailStatus, body.error || "Failed to load profile.", true); return; }

    usersDetailDiscordId = discordId;
    const p = body.profile;
    const bl = body.blacklistEntry;

    if (usersDetailContent instanceof HTMLElement) {
      usersDetailContent.innerHTML = `
        <div class="users-profile-grid">
          <div class="users-profile-field"><span class="users-field-label">Discord ID</span><code>${escapeHtml(p.discordId)}</code></div>
          <div class="users-profile-field"><span class="users-field-label">Username</span>${escapeHtml(p.username || "—")}</div>
          <div class="users-profile-field"><span class="users-field-label">Display Name</span>${escapeHtml(p.displayName || "—")}</div>
          <div class="users-profile-field"><span class="users-field-label">Tier</span>${getTierBadge(p.tier)}</div>
          <div class="users-profile-field"><span class="users-field-label">Status</span>${getUserStatusBadge(p)}</div>
          <div class="users-profile-field"><span class="users-field-label">Commands</span>${Number(p.commandCount || 0).toLocaleString()}</div>
          <div class="users-profile-field"><span class="users-field-label">First Seen</span>${p.firstSeenAt ? new Date(p.firstSeenAt).toLocaleString() : "—"}</div>
          <div class="users-profile-field"><span class="users-field-label">Last Seen</span>${p.lastSeenAt ? new Date(p.lastSeenAt).toLocaleString() : "—"}</div>
          <div class="users-profile-field"><span class="users-field-label">Account Created</span>${p.accountCreatedAt ? new Date(p.accountCreatedAt).toLocaleString() : "—"}</div>
          <div class="users-profile-field"><span class="users-field-label">Guilds Tracked</span>${(p.guilds || []).length}</div>
          <div class="users-profile-field"><span class="users-field-label">Infractions</span>${(p.infractions || []).length}</div>
          ${bl ? `<div class="users-profile-field users-profile-field--warn"><span class="users-field-label">Blacklist Reason</span>${escapeHtml(bl.reason)}</div>
          <div class="users-profile-field users-profile-field--warn"><span class="users-field-label">Blacklisted By</span>${escapeHtml(bl.moderator)}</div>
          <div class="users-profile-field users-profile-field--warn"><span class="users-field-label">Blacklisted At</span>${new Date(bl.addedAt).toLocaleString()}</div>
          ${bl.reasonDetail ? `<div class="users-profile-field users-profile-field--warn"><span class="users-field-label">Detail</span>${escapeHtml(bl.reasonDetail)}</div>` : ""}` : ""}
          ${p.frozen ? `<div class="users-profile-field users-profile-field--warn"><span class="users-field-label">Frozen By</span>${escapeHtml(p.frozenBy || "owner")}</div>` : ""}
          ${(p.infractions || []).length > 0 ? `
          <div class="users-profile-field users-profile-field--full"><span class="users-field-label">Recent Infractions</span>
            <ul class="users-infraction-list">${(p.infractions || []).slice(0, 5).map((inf) => `<li>${escapeHtml(inf.reason)} — ${escapeHtml(inf.note || "")} <span class="users-date">${inf.at ? new Date(inf.at).toLocaleDateString() : ""}</span></li>`).join("")}</ul>
          </div>` : ""}
        </div>
      `;
    }

    if (usersDetailSection instanceof HTMLElement) usersDetailSection.hidden = false;
    setUsersStatus(usersDetailStatus, "", false);

  } catch (err) {
    setUsersStatus(usersDetailStatus, `Error: ${err.message}`, true);
  }
}

async function usersEnforcementAction(action, discordId, extras) {
  const pwd = getUsersOwnerPassword();
  if (!pwd) { return { ok: false, error: "Owner password required." }; }

  const endpoints = {
    blacklist: "/api/owner/enforcement/blacklist",
    unblacklist: "/api/owner/enforcement/unblacklist",
    freeze: "/api/owner/enforcement/freeze",
    restore: "/api/owner/enforcement/restore",
    "set-tier": "/api/owner/enforcement/set-tier"
  };
  const url = endpoints[action];
  if (!url) return { ok: false, error: "Unknown action." };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-owner-key": pwd },
    credentials: "same-origin",
    body: JSON.stringify({ discordId, ...extras })
  });
  return await response.json().catch(() => ({ ok: false, error: "invalid response" }));
}

async function runUsersCmdAction(action) {
  const discordId = usersCmdDiscordId instanceof HTMLElement ? usersCmdDiscordId.value.trim() : "";
  if (!discordId) { setUsersStatus(usersCmdStatus, "Enter a Discord User ID.", true); return; }

  const extras = {};
  if (action === "blacklist") {
    extras.reason = usersCmdReason instanceof HTMLElement ? usersCmdReason.value : "tos_violation";
    extras.reasonDetail = usersCmdDetail instanceof HTMLElement ? usersCmdDetail.value.trim() : "";
    if (!window.confirm(`Blacklist Discord ID ${discordId} for reason: ${extras.reason}? They will be downgraded to free tier.`)) return;
  }
  if (action === "unblacklist") {
    extras.restoredTier = "free";
    if (!window.confirm(`Remove blacklist from Discord ID ${discordId}? This will restore free tier access.`)) return;
  }
  if (action === "freeze") {
    extras.reason = usersCmdDetail instanceof HTMLElement ? usersCmdDetail.value.trim() : "";
    if (!window.confirm(`Freeze account ${discordId}? All commands will be blocked.`)) return;
  }
  if (action === "restore") {
    if (!window.confirm(`Restore full access to account ${discordId}?`)) return;
  }
  if (action === "set-tier") {
    extras.tier = usersCmdTier instanceof HTMLElement ? usersCmdTier.value : "free";
    if (!window.confirm(`Set tier for ${discordId} to ${extras.tier}?`)) return;
  }

  setUsersStatus(usersCmdStatus, "Processing…", false);
  try {
    const result = await usersEnforcementAction(action, discordId, extras);
    if (result.ok) {
      setUsersStatus(usersCmdStatus, `Done. ${action} applied to ${discordId}.`, false);
      loadUsersPage(usersCurrentPage).catch(console.error);
    } else {
      setUsersStatus(usersCmdStatus, result.error || "Action failed.", true);
    }
  } catch (err) {
    setUsersStatus(usersCmdStatus, `Error: ${err.message}`, true);
  }
}

async function loadUsersBlacklist() {
  const pwd = getUsersOwnerPassword();
  if (!pwd) { setUsersStatus(usersBlacklistStatus, "Owner password required.", true); return; }

  setUsersStatus(usersBlacklistStatus, "Loading…", false);
  try {
    const response = await fetch("/api/owner/enforcement/blacklist-registry?activeOnly=true", {
      headers: { "x-owner-key": pwd },
      credentials: "same-origin"
    });
    const body = await response.json().catch(() => ({}));
    if (!body.ok) { setUsersStatus(usersBlacklistStatus, body.error || "Failed.", true); return; }

    if (usersBlacklistList instanceof HTMLElement) {
      if ((body.rows || []).length === 0) {
        usersBlacklistList.innerHTML = "<li class='users-log-empty'>No active blacklist entries.</li>";
      } else {
        usersBlacklistList.innerHTML = (body.rows || []).map((entry) => `
          <li class="users-blacklist-entry">
            <code class="users-id-code">${escapeHtml(entry.discordId)}</code>
            <span class="users-badge users-badge-blacklisted">${escapeHtml(entry.reason)}</span>
            <span class="users-bl-username">${escapeHtml(entry.username || "—")}</span>
            <span class="users-bl-meta">by ${escapeHtml(entry.moderator)} on ${new Date(entry.addedAt).toLocaleDateString()}</span>
            ${entry.reasonDetail ? `<span class="users-bl-detail">${escapeHtml(entry.reasonDetail)}</span>` : ""}
            ${entry.expiresAt ? `<span class="users-bl-meta">expires ${new Date(entry.expiresAt).toLocaleDateString()}</span>` : `<span class="users-bl-meta">permanent</span>`}
          </li>
        `).join("");
      }
    }
    setUsersStatus(usersBlacklistStatus, `${(body.rows || []).length} active entries`, false);
  } catch (err) {
    setUsersStatus(usersBlacklistStatus, `Error: ${err.message}`, true);
  }
}

async function loadUserActivityLog() {
  const pwd = getUsersOwnerPassword();
  const discordId = usersLogDiscordId instanceof HTMLElement ? usersLogDiscordId.value.trim() : "";
  if (!pwd) { setUsersStatus(usersLogStatus, "Owner password required.", true); return; }
  if (!discordId) { setUsersStatus(usersLogStatus, "Enter a Discord User ID.", true); return; }

  setUsersStatus(usersLogStatus, "Loading…", false);
  try {
    const response = await fetch(`/api/owner/enforcement/user-logs/${encodeURIComponent(discordId)}?limit=100`, {
      headers: { "x-owner-key": pwd },
      credentials: "same-origin"
    });
    const body = await response.json().catch(() => ({}));
    if (!body.ok) { setUsersStatus(usersLogStatus, body.error || "Failed.", true); return; }

    const logs = Array.isArray(body.logs) ? body.logs : [];
    if (usersLogList instanceof HTMLElement) {
      if (logs.length === 0) {
        usersLogList.innerHTML = "<li class='users-log-empty'>No activity logged for this user.</li>";
      } else {
        usersLogList.innerHTML = logs.map((log) => `
          <li class="users-log-entry ${log.success === false ? "users-log-failed" : ""}">
            <span class="users-log-type">${escapeHtml(log.type || "command")}</span>
            ${log.command ? `<span class="users-log-cmd">/${escapeHtml(log.command)}</span>` : ""}
            ${log.guildName ? `<span class="users-log-guild">${escapeHtml(log.guildName)}</span>` : ""}
            ${log.serviceAccessed ? `<span class="users-log-service">${escapeHtml(log.serviceAccessed)}</span>` : ""}
            <span class="users-date">${log.at ? new Date(log.at).toLocaleString() : "—"}</span>
            ${log.success === false ? `<span class="users-badge users-badge-blacklisted">denied</span>` : ""}
          </li>
        `).join("");
      }
    }
    setUsersStatus(usersLogStatus, `${logs.length} of ${body.total} log entries`, false);
  } catch (err) {
    setUsersStatus(usersLogStatus, `Error: ${err.message}`, true);
  }
}

// Event: table row "View" button
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains("users-view-btn") && target.dataset.discordId) {
    loadUserDetail(target.dataset.discordId).catch(console.error);
  }
});

// Event: detail panel action buttons
if (usersDetailBlacklistBtn instanceof HTMLElement) {
  usersDetailBlacklistBtn.addEventListener("click", async () => {
    if (!usersDetailDiscordId) return;
    const reason = window.prompt("Blacklist reason (e.g. chargeback, abuse, fraud):", "tos_violation");
    if (!reason) return;
    setUsersStatus(usersDetailStatus, "Processing…", false);
    const result = await usersEnforcementAction("blacklist", usersDetailDiscordId, { reason, reasonDetail: "" });
    setUsersStatus(usersDetailStatus, result.ok ? "User blacklisted (free tier)." : (result.error || "Failed."), !result.ok);
    if (result.ok) loadUserDetail(usersDetailDiscordId).catch(console.error);
  });
}
if (usersDetailUnblacklistBtn instanceof HTMLElement) {
  usersDetailUnblacklistBtn.addEventListener("click", async () => {
    if (!usersDetailDiscordId) return;
    if (!window.confirm(`Remove blacklist from ${usersDetailDiscordId}?`)) return;
    setUsersStatus(usersDetailStatus, "Processing…", false);
    const result = await usersEnforcementAction("unblacklist", usersDetailDiscordId, { restoredTier: "free" });
    setUsersStatus(usersDetailStatus, result.ok ? "Blacklist removed." : (result.error || "Failed."), !result.ok);
    if (result.ok) loadUserDetail(usersDetailDiscordId).catch(console.error);
  });
}
if (usersDetailFreezeBtn instanceof HTMLElement) {
  usersDetailFreezeBtn.addEventListener("click", async () => {
    if (!usersDetailDiscordId) return;
    const reason = window.prompt("Freeze reason:", "Suspended pending review");
    if (!reason) return;
    setUsersStatus(usersDetailStatus, "Processing…", false);
    const result = await usersEnforcementAction("freeze", usersDetailDiscordId, { reason });
    setUsersStatus(usersDetailStatus, result.ok ? "Account frozen." : (result.error || "Failed."), !result.ok);
    if (result.ok) loadUserDetail(usersDetailDiscordId).catch(console.error);
  });
}
if (usersDetailRestoreBtn instanceof HTMLElement) {
  usersDetailRestoreBtn.addEventListener("click", async () => {
    if (!usersDetailDiscordId) return;
    if (!window.confirm(`Restore full access to ${usersDetailDiscordId}?`)) return;
    setUsersStatus(usersDetailStatus, "Processing…", false);
    const result = await usersEnforcementAction("restore", usersDetailDiscordId, {});
    setUsersStatus(usersDetailStatus, result.ok ? "Account restored." : (result.error || "Failed."), !result.ok);
    if (result.ok) loadUserDetail(usersDetailDiscordId).catch(console.error);
  });
}
if (usersDetailCloseBtn instanceof HTMLElement) {
  usersDetailCloseBtn.addEventListener("click", () => {
    if (usersDetailSection instanceof HTMLElement) usersDetailSection.hidden = true;
    usersDetailDiscordId = null;
  });
}

// Event: command panel buttons
if (usersSearchBtn instanceof HTMLElement) {
  usersSearchBtn.addEventListener("click", () => loadUsersPage(1).catch(console.error));
}
if (usersRefreshBtn instanceof HTMLElement) {
  usersRefreshBtn.addEventListener("click", () => loadUsersPage(usersCurrentPage).catch(console.error));
}
if (usersPrevBtn instanceof HTMLElement) {
  usersPrevBtn.addEventListener("click", () => loadUsersPage(Math.max(1, usersCurrentPage - 1)).catch(console.error));
}
if (usersNextBtn instanceof HTMLElement) {
  usersNextBtn.addEventListener("click", () => loadUsersPage(Math.min(usersTotalPages, usersCurrentPage + 1)).catch(console.error));
}
if (usersCmdBlacklistBtn instanceof HTMLElement) {
  usersCmdBlacklistBtn.addEventListener("click", () => runUsersCmdAction("blacklist").catch(console.error));
}
if (usersCmdUnblacklistBtn instanceof HTMLElement) {
  usersCmdUnblacklistBtn.addEventListener("click", () => runUsersCmdAction("unblacklist").catch(console.error));
}
if (usersCmdFreezeBtn instanceof HTMLElement) {
  usersCmdFreezeBtn.addEventListener("click", () => runUsersCmdAction("freeze").catch(console.error));
}
if (usersCmdRestoreBtn instanceof HTMLElement) {
  usersCmdRestoreBtn.addEventListener("click", () => runUsersCmdAction("restore").catch(console.error));
}
if (usersCmdSetTierBtn instanceof HTMLElement) {
  usersCmdSetTierBtn.addEventListener("click", () => runUsersCmdAction("set-tier").catch(console.error));
}
if (usersLoadBlacklistBtn instanceof HTMLElement) {
  usersLoadBlacklistBtn.addEventListener("click", () => loadUsersBlacklist().catch(console.error));
}
if (usersLoadLogBtn instanceof HTMLElement) {
  usersLoadLogBtn.addEventListener("click", () => loadUserActivityLog().catch(console.error));
}

// =============================================================
// OWNER PANEL — ENHANCED MULTI-SCREEN SYSTEM
// =============================================================

// --- Owner Sub-Navigation ---
let activeOwnerScreenId = "ownerDashboard";

function setActiveOwnerScreen(screenId) {
  document.querySelectorAll(".owner-screen").forEach((s) => {
    s.classList.toggle("active", s.id === screenId);
  });
  document.querySelectorAll(".owner-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.ownerScreen === screenId);
  });
  activeOwnerScreenId = screenId;
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains("owner-nav-btn") && target.dataset.ownerScreen) {
    const screen = target.dataset.ownerScreen;
    setActiveOwnerScreen(screen);
    if (screen === "ownerLogs") loadLoginLog().catch(console.error);
    if (screen === "ownerUsers") loadOwnerUsers().catch(console.error);
    if (screen === "ownerPayments") loadOwnerPayments().catch(console.error);
    if (screen === "ownerServices") loadOwnerServices().catch(console.error);
    if (screen === "ownerEnforcement") loadOwnerEnforcement().catch(console.error);
    if (screen === "ownerSettings") loadOwnerSettings().catch(console.error);
  }
});

// --- Owner Dashboard ---
async function loadOwnerDashboard() {
  try {
    const response = await fetch("/api/owner/dashboard", { credentials: "same-origin" });
    if (!response.ok) return;
    const body = await response.json().catch(() => ({ ok: false }));
    if (!body.ok) return;

    const $ = (id) => document.getElementById(id);
    const dashRevenue = $("ownerDashRevenue");
    const totalClients = $("ownerTotalClients");
    const activeClients = $("ownerActiveClients");
    const pastDue = $("ownerPastDue");
    const restricted = $("ownerRestricted");
    const suspended = $("ownerSuspended");
    const botsRunning = $("ownerBotsRunning");
    const botsStopped = $("ownerBotsStopped");
    const botsDisabled = $("ownerBotsDisabled");
    const flaggedCount = $("ownerFlaggedCount");
    const outstandingUsd = $("ownerOutstandingUsd");
    const dashPaidOrders = $("ownerDashPaidOrders");
    const recentLoginsEl = $("ownerDashRecentLogins");

    if (dashRevenue) dashRevenue.textContent = `$${Number(body.revenue?.totalUsd || 0).toLocaleString()}`;
    if (totalClients) animateCounter(totalClients, Number(body.clients?.total || 0));
    if (activeClients) animateCounter(activeClients, Number(body.clients?.active || 0));
    if (pastDue) animateCounter(pastDue, Number(body.clients?.pastDue || 0));
    if (restricted) animateCounter(restricted, Number(body.clients?.restricted || 0));
    if (suspended) animateCounter(suspended, Number(body.clients?.suspended || 0));
    if (botsRunning) animateCounter(botsRunning, Number(body.bots?.running || 0));
    if (botsStopped) animateCounter(botsStopped, Number(body.bots?.stopped || 0));
    if (botsDisabled) animateCounter(botsDisabled, Number(body.bots?.disabled || 0));
    if (flaggedCount) animateCounter(flaggedCount, Number(body.clients?.flagged || 0));
    if (outstandingUsd) outstandingUsd.textContent = `$${Number(body.revenue?.outstandingBalanceUsd || 0).toLocaleString()}`;
    if (dashPaidOrders) animateCounter(dashPaidOrders, Number(body.revenue?.paidOrders || 0));

    if (recentLoginsEl && Array.isArray(body.recentLogins)) {
      recentLoginsEl.innerHTML = "";
      if (body.recentLogins.length === 0) {
        recentLoginsEl.innerHTML = "<li>No recent login activity.</li>";
      } else {
        for (const log of body.recentLogins) {
          const li = document.createElement("li");
          const ts = log.at ? new Date(log.at).toLocaleString() : "—";
          li.className = log.success ? "" : "login-failed-item";
          li.textContent = `[${ts}] ${log.discordId || "—"} from ${log.ip || "—"} (${log.browser || "?"} / ${log.device || "?"}) — ${log.success ? "✓ SUCCESS" : "✗ FAILED"}`;
          recentLoginsEl.appendChild(li);
        }
      }
    }
  } catch (err) {
    console.error("loadOwnerDashboard:", err.message);
  }
}

// --- Login Log ---
async function loadLoginLog() {
  const tableBody = document.getElementById("loginLogTableBody");
  const searchInput = document.getElementById("loginLogSearch");
  const successFilter = document.getElementById("loginLogSuccessFilter");
  const flaggedFilter = document.getElementById("loginLogFlaggedFilter");
  const statusEl = document.getElementById("loginLogStatus");
  if (!tableBody) return;

  const params = new URLSearchParams({ limit: "200" });
  if (searchInput instanceof HTMLInputElement && searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (successFilter instanceof HTMLSelectElement && successFilter.value !== "all") params.set("success", successFilter.value);
  if (flaggedFilter instanceof HTMLInputElement && flaggedFilter.checked) params.set("flaggedOnly", "1");

  try {
    const response = await fetch(`/api/owner/login-log?${params.toString()}`, { credentials: "same-origin" });
    const body = await response.json().catch(() => ({ ok: false, rows: [] }));
    tableBody.innerHTML = "";

    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;opacity:.6;">No login events recorded yet.</td></tr>`;
      if (statusEl) statusEl.textContent = "0 events found.";
      return;
    }

    for (const row of body.rows) {
      const tr = document.createElement("tr");
      const ts = row.at ? new Date(row.at).toLocaleString() : "—";
      tr.innerHTML = `
        <td>${escapeHtml(row.discordId || "—")}</td>
        <td>${escapeHtml(row.ip || "—")}</td>
        <td>${escapeHtml(row.device || "—")}</td>
        <td>${escapeHtml(row.browser || "—")}</td>
        <td>${ts}</td>
        <td><span class="login-status-chip ${row.success ? "login-ok" : "login-fail"}">${row.success ? "SUCCESS" : "FAILED"}</span></td>
        <td><button class="button tiny ghost flag-login-user" data-discord-id="${escapeHtml(row.discordId || "")}">Flag</button></td>
      `;
      tableBody.appendChild(tr);
    }
    if (statusEl) statusEl.textContent = `Showing ${body.rows.length} of ${body.total || body.rows.length} login events.`;
  } catch (err) {
    if (statusEl) statusEl.textContent = `Error loading log: ${err.message}`;
  }
}

// --- Owner Users ---
async function loadOwnerUsers() {
  const listEl = document.getElementById("ownerClientRows");
  if (!listEl) return;

  const searchInput = document.getElementById("ownerUserSearch");
  const stateFilter = document.getElementById("ownerUserStateFilter");
  const flaggedOnly = document.getElementById("ownerUserFlaggedOnly");

  const params = new URLSearchParams();
  if (searchInput instanceof HTMLInputElement && searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (stateFilter instanceof HTMLSelectElement && stateFilter.value !== "all") params.set("paymentState", stateFilter.value);
  if (flaggedOnly instanceof HTMLInputElement && flaggedOnly.checked) params.set("flaggedOnly", "1");

  try {
    const response = await fetch(`/api/owner/users?${params.toString()}`, { credentials: "same-origin" });
    const body = await response.json().catch(() => ({ ok: false, rows: [] }));
    if (!body.ok) return;
    renderOwnerUserList(body.rows || [], listEl);
  } catch (err) {
    console.error("loadOwnerUsers:", err.message);
  }
}

function renderOwnerUserList(clients, container) {
  if (!(container instanceof HTMLElement)) return;
  container.innerHTML = "";
  ownerClients = clients;

  // Keep enforcement client select in sync
  const enfSelect = document.getElementById("enfClientSelect");
  if (enfSelect instanceof HTMLSelectElement) {
    enfSelect.innerHTML = `<option value="">— Select Client —</option>`;
    for (const c of clients) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.displayName} (${c.paymentState || "active"})`;
      enfSelect.appendChild(opt);
    }
  }

  if (clients.length === 0) {
    container.innerHTML = `<li class="owner-user-empty">No client accounts found.</li>`;
    return;
  }

  for (const client of clients) {
    const li = document.createElement("li");
    li.className = `owner-user-row${client.flagged ? " flagged-row" : ""}`;
    const payClass = `pay-${(client.paymentState || "active").replace(/_/g, "-")}`;
    const botClass = `bot-${client.botStatus || "running"}`;
    li.innerHTML = `
      <div class="owner-user-header">
        <strong class="owner-user-name">${escapeHtml(client.displayName)}</strong>
        <span class="owner-state-badge ${payClass}">${client.paymentState || "active"}</span>
        <span class="owner-state-badge ${botClass}">Bot: ${client.botStatus || "running"}</span>
        ${client.flagged ? `<span class="owner-flag-badge">⚑ FLAGGED</span>` : ""}
      </div>
      <div class="owner-user-meta">
        <span>${escapeHtml(client.email || "—")}</span>
        <span>${escapeHtml(client.discord || "—")}</span>
        <span style="opacity:.6">ID: ${escapeHtml(client.id)}</span>
      </div>
      <div class="owner-user-finance">
        <span>Total: $${Number(client.totalCostUsd || 0).toLocaleString()}</span>
        <span>Paid: $${Number(client.paidAmountUsd || 0).toLocaleString()}</span>
        <span class="${Number(client.remainingBalanceUsd || 0) > 0 ? "balance-owed" : ""}">Owed: $${Number(client.remainingBalanceUsd || 0).toLocaleString()}</span>
        <span>Next Due: ${client.nextPaymentDueAt ? new Date(client.nextPaymentDueAt).toLocaleDateString() : "—"}</span>
      </div>
      <div class="owner-row-quick-actions">
        <select class="owner-client-action" data-client-id="${escapeHtml(client.id)}">
          <option value="suspend_bot">Suspend Bot</option>
          <option value="lock_features">Lock Features</option>
          <option value="reset_config">Reset Config</option>
          <option value="revoke_access">Revoke Access</option>
          <option value="unlock_client">Unlock Client</option>
          <option value="extend_due_date">Extend Due +7d</option>
          <option value="reduce_balance">Reduce Balance</option>
          <option value="whitelist_vip">Whitelist VIP</option>
          <option value="unwhitelist_vip">Remove VIP</option>
          <option value="restart_bot">Restart Bot</option>
          <option value="activate_client">Activate Client</option>
        </select>
        <button class="button tiny owner-apply-action" data-client-id="${escapeHtml(client.id)}">Apply</button>
        <button class="button tiny ghost owner-flag-toggle" data-client-id="${escapeHtml(client.id)}" data-flagged="${client.flagged ? "1" : "0"}">${client.flagged ? "Unflag" : "Flag"}</button>
      </div>
    `;
    container.appendChild(li);
  }
}

// --- Owner Payments ---
async function fetchOwnerOverviewCached() {
  const now = Date.now();
  if (ownerOverviewCache && now - ownerOverviewCacheAt < OWNER_OVERVIEW_CACHE_TTL_MS) {
    return ownerOverviewCache;
  }
  const response = await fetch("/api/owner/overview", { credentials: "same-origin" });
  const body = await response.json().catch(() => ({ ok: false }));
  if (body.ok) {
    ownerOverviewCache = body;
    ownerOverviewCacheAt = now;
  }
  return body;
}

async function loadOwnerPayments() {
  const payRowsEl = document.getElementById("ownerPaymentRows");
  if (!payRowsEl) return;

  try {
    const body = await fetchOwnerOverviewCached();
    if (!body.ok) return;

    const summary = body.summary || {};
    const $ = (id) => document.getElementById(id);
    const payTotalEl = $("ownerPayTotalClients");
    const payPastDueEl = $("ownerPayPastDue");
    const payRestrictedEl = $("ownerPayRestricted");
    const paySuspendedEl = $("ownerPaySuspended");
    const payOutstandingEl = $("ownerPayOutstanding");

    if (payTotalEl) animateCounter(payTotalEl, Number(summary.totalClients || 0));
    if (payPastDueEl) animateCounter(payPastDueEl, Number(summary.pastDue || 0));
    if (payRestrictedEl) animateCounter(payRestrictedEl, Number(summary.restricted || 0));
    if (paySuspendedEl) animateCounter(paySuspendedEl, Number(summary.suspended || 0));
    if (payOutstandingEl) payOutstandingEl.textContent = `$${Number(summary.outstandingBalanceUsd || 0).toLocaleString()}`;

    payRowsEl.innerHTML = "";
    const clients = body.clients || [];
    if (clients.length === 0) {
      payRowsEl.innerHTML = `<li class="owner-user-empty">No client accounts yet.</li>`;
      return;
    }
    for (const client of clients) {
      const li = document.createElement("li");
      li.className = "owner-user-row";
      li.innerHTML = `
        <div class="owner-user-header">
          <strong>${escapeHtml(client.displayName)}</strong>
          <span class="owner-state-badge pay-${(client.paymentState || "active").replace(/_/g, "-")}">${client.paymentState || "active"}</span>
        </div>
        <div class="owner-user-finance">
          <span>Total: $${Number(client.totalCostUsd || 0).toLocaleString()}</span>
          <span>Paid: $${Number(client.paidAmountUsd || 0).toLocaleString()}</span>
          <span class="${Number(client.remainingBalanceUsd || 0) > 0 ? "balance-owed" : ""}">Owed: $${Number(client.remainingBalanceUsd || 0).toLocaleString()}</span>
        </div>
        <div class="owner-pay-inputs">
          <label>Total Cost<input class="owner-financial total" data-client-id="${escapeHtml(client.id)}" type="number" min="0" step="1" value="${Number(client.totalCostUsd || 0)}" placeholder="Total Cost" /></label>
          <label>Paid<input class="owner-financial paid" data-client-id="${escapeHtml(client.id)}" type="number" min="0" step="1" value="${Number(client.paidAmountUsd || 0)}" placeholder="Paid" /></label>
          <label>Next Due<input class="owner-financial due" data-client-id="${escapeHtml(client.id)}" type="date" value="${toDateInputFromIso(client.nextPaymentDueAt)}" /></label>
          <label>Balance Due<input class="owner-financial balance-due" data-client-id="${escapeHtml(client.id)}" type="date" value="${toDateInputFromIso(client.balanceDueAt)}" /></label>
          <button class="button tiny owner-save-financial" data-client-id="${escapeHtml(client.id)}">Save</button>
          <button class="button tiny ghost owner-apply-action" data-client-id="${escapeHtml(client.id)}" data-action="extend_due_date">+7d Due</button>
        </div>
      `;
      payRowsEl.appendChild(li);
    }
  } catch (err) {
    console.error("loadOwnerPayments:", err.message);
  }
}

// --- Owner Services ---
async function loadOwnerServices() {
  const serviceRowsEl = document.getElementById("ownerServiceRows");
  if (!serviceRowsEl) return;

  try {
    const body = await fetchOwnerOverviewCached();
    if (!body.ok) return;

    serviceRowsEl.innerHTML = "";
    const clients = body.clients || [];
    if (clients.length === 0) {
      serviceRowsEl.innerHTML = `<li class="owner-user-empty">No clients with managed services.</li>`;
      return;
    }
    for (const client of clients) {
      const feats = client.features || { moderation: true, tickets: true, economy: true, aiTools: true, apiAccess: true };
      const li = document.createElement("li");
      li.className = "owner-user-row";
      const featKeys = ["moderation", "tickets", "economy", "aiTools", "apiAccess"];
      li.innerHTML = `
        <div class="owner-user-header">
          <strong>${escapeHtml(client.displayName)}</strong>
          <span class="owner-state-badge bot-${client.botStatus || "running"}">Bot: ${client.botStatus || "running"}</span>
        </div>
        <div class="feature-toggles">
          ${featKeys.map((feat) => `
            <label class="feature-toggle-label">
              <input type="checkbox" class="feat-toggle" data-client-id="${escapeHtml(client.id)}" data-feature="${feat}" ${feats[feat] !== false ? "checked" : ""} />
              <span>${feat}</span>
            </label>
          `).join("")}
        </div>
        <div class="owner-row-quick-actions">
          <button class="button tiny owner-save-features" data-client-id="${escapeHtml(client.id)}">Save Features</button>
          <button class="button tiny ghost owner-apply-action" data-client-id="${escapeHtml(client.id)}" data-action="restart_bot">Restart Bot</button>
          <button class="button tiny ghost owner-apply-action" data-client-id="${escapeHtml(client.id)}" data-action="suspend_bot">Suspend</button>
          <button class="button tiny ghost owner-apply-action" data-client-id="${escapeHtml(client.id)}" data-action="unlock_client">Unlock</button>
        </div>
      `;
      serviceRowsEl.appendChild(li);
    }
  } catch (err) {
    console.error("loadOwnerServices:", err.message);
  }
}

// --- Owner Enforcement ---
async function loadOwnerEnforcement() {
  const logEl = document.getElementById("ownerEnforcementLog");
  if (!logEl) return;

  try {
    const body = await fetchOwnerOverviewCached();
    if (!body.ok) return;

    logEl.innerHTML = "";
    let hasAny = false;
    for (const client of (body.clients || [])) {
      for (const entry of (client.enforcementLog || [])) {
        hasAny = true;
        const li = document.createElement("li");
        li.className = "log-entry";
        const ts = entry.at ? new Date(entry.at).toLocaleString() : "—";
        li.textContent = `[${ts}] ${client.displayName} — ${entry.action} (${entry.reason})${entry.note ? ": " + entry.note : ""}`;
        logEl.appendChild(li);
      }
    }
    if (!hasAny) {
      const li = document.createElement("li");
      li.textContent = "No enforcement actions logged yet.";
      logEl.appendChild(li);
    }
  } catch (err) {
    console.error("loadOwnerEnforcement:", err.message);
  }
}

// --- Owner Settings ---
async function loadOwnerSettings() {
  try {
    const [logoRes, discordRes, subRes, catalogRes, configRes] = await Promise.all([
      fetch("/api/store/logo-services"),
      fetch("/api/store/discord-services"),
      fetch("/api/store/subscriptions"),
      fetch("/api/store/catalog"),
      fetch("/api/owner/config-health", { credentials: "same-origin" })
    ]);
    const logoBody = await logoRes.json().catch(() => ({ catalog: [] }));
    const discordBody = await discordRes.json().catch(() => ({ catalog: [] }));
    const subBody = await subRes.json().catch(() => ({ plans: [] }));
    const catalogBody = await catalogRes.json().catch(() => ({ items: [], paymentMode: "unknown" }));
    const configBody = await configRes.json().catch(() => ({ ok: false, config: null }));

    const logoEl = document.getElementById("settingsLogoCatalog");
    const discordEl = document.getElementById("settingsDiscordCatalog");
    const subEl = document.getElementById("settingsSubPlans");
    const botEl = document.getElementById("settingsBotCatalog");
    const payModeEl = document.getElementById("settingsPaymentMode");
    const configSummaryEl = document.getElementById("settingsConfigSummary");
    const configListEl = document.getElementById("settingsConfigHealth");
    const imageHealthSummaryEl = document.getElementById("settingsImageHealthSummary");
    const imageHealthEl = document.getElementById("settingsImageHealth");

    if (logoEl) logoEl.innerHTML = (logoBody.catalog || []).map((item) =>
      `<li><strong>${escapeHtml(item.name)}</strong> — $${Number(item.priceUsd || 0)} <span class="tier-chip">${escapeHtml(item.tier || "")}</span></li>`
    ).join("") || "<li>No logo catalog.</li>";

    if (discordEl) discordEl.innerHTML = (discordBody.catalog || []).map((item) =>
      `<li><strong>${escapeHtml(item.name)}</strong> — $${Number(item.priceUsd || 0)} <span class="tier-chip">${escapeHtml(item.type || "")} / ${escapeHtml(item.tier || "")}</span></li>`
    ).join("") || "<li>No discord catalog.</li>";

    if (subEl) subEl.innerHTML = (subBody.plans || []).map((item) =>
      `<li><strong>${escapeHtml(item.name)}</strong> — $${Number(item.priceUsd || 0).toFixed(2)}/mo <span class="tier-chip">${escapeHtml(item.tier || "")}</span></li>`
    ).join("") || "<li>No subscription plans.</li>";

    if (botEl) botEl.innerHTML = (catalogBody.items || []).map((item) =>
      `<li><strong>${escapeHtml(item.name)}</strong> — $${Number(item.priceUsd || 0)} <span class="tier-chip">${escapeHtml(item.pricingBadge || "")}</span></li>`
    ).join("") || "<li>No bot catalog.</li>";

    if (payModeEl) payModeEl.textContent = catalogBody.paymentMode || "unknown";

    if (configSummaryEl) {
      const summary = (((configBody || {}).config || {}).summary || "unknown").toLowerCase();
      const summaryText = summary === "ready"
        ? "All critical configuration checks passed."
        : summary === "attention"
          ? "Configuration needs attention before full production hardening."
          : summary === "critical"
            ? "Critical configuration issues detected. Resolve before production rollout."
            : "Configuration health unavailable.";
      configSummaryEl.textContent = summaryText;
    }

    if (configListEl) {
      const checks = (((configBody || {}).config || {}).checks || []);
      configListEl.innerHTML = checks.map((check) => {
        const status = String(check.status || "warn").toLowerCase();
        const chipClass = status === "ok" ? "cfg-chip-ok" : status === "error" ? "cfg-chip-error" : "cfg-chip-warn";
        const label = status === "ok" ? "OK" : status === "error" ? "ERROR" : "WARN";
        return `<li><strong>${escapeHtml(check.label || check.key || "Check")}</strong> — ${escapeHtml(check.detail || "")}
          <span class="tier-chip ${chipClass}">${label}</span></li>`;
      }).join("") || "<li>No configuration checks returned.</li>";
    }

    if (imageHealthEl && imageHealthSummaryEl) {
      const catalogs = [
        { name: "Bot Marketplace", items: catalogBody.items || [] },
        { name: "Logo Services", items: logoBody.catalog || [] },
        { name: "Discord Services", items: discordBody.catalog || [] },
        { name: "Subscriptions", items: subBody.plans || [] }
      ];

      let totalMapped = 0;
      let totalExternal = 0;
      let totalFallback = 0;

      imageHealthEl.innerHTML = catalogs.map((catalog) => {
        let mapped = 0;
        let external = 0;
        let fallback = 0;

        for (const item of catalog.items) {
          const source = classifyImageSource(item);
          if (source === "mapped") mapped += 1;
          else if (source === "external") external += 1;
          else fallback += 1;
        }

        totalMapped += mapped;
        totalExternal += external;
        totalFallback += fallback;

        return `<li><strong>${escapeHtml(catalog.name)}</strong> — Mapped: ${mapped}, External: ${external}, Fallback: ${fallback}</li>`;
      }).join("") || "<li>No catalog image rows to evaluate.</li>";

      imageHealthSummaryEl.textContent = `Image coverage: mapped ${totalMapped}, external ${totalExternal}, fallback ${totalFallback}.`;
    }
  } catch (err) {
    console.error("loadOwnerSettings:", err.message);
  }
}

// --- New Marketplace Pricing Catalogs ---
async function loadNewPricingCatalogs() {
  try {
    const [logoRes, discordRes, subRes] = await Promise.all([
      fetch("/api/store/logo-services"),
      fetch("/api/store/discord-services"),
      fetch("/api/store/subscriptions")
    ]);
    const logoBody = await logoRes.json().catch(() => ({ catalog: [], addOns: [] }));
    const discordBody = await discordRes.json().catch(() => ({ catalog: [] }));
    const subBody = await subRes.json().catch(() => ({ plans: [] }));

    // Logo service grid
    const logoGrid = document.getElementById("logoServiceGrid");
    if (logoGrid) {
      logoGrid.innerHTML = "";
      for (const item of (logoBody.catalog || [])) {
        const card = document.createElement("article");
        card.className = `market-item logo-tier-${item.tier || "starter"}`;
        card.innerHTML = `
          ${buildBotImageMarkup(item, `${item.name || "Logo service"} image`)}
          ${item.pricingBadge ? `<span class="price-badge">${escapeHtml(item.pricingBadge)}</span>` : ""}
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p class="market-price">$${Number(item.priceUsd || 0)} USD</p>
          <span class="tier-chip">${escapeHtml(item.tier || "")}</span>
        `;
        logoGrid.appendChild(card);
      }
    }

    // Logo add-ons
    const addOnsGrid = document.getElementById("logoAddOnsGrid");
    if (addOnsGrid) {
      addOnsGrid.innerHTML = "";
      for (const addon of (logoBody.addOns || [])) {
        const chip = document.createElement("span");
        chip.className = "addon-chip";
        const price = addon.priceUsd ? `$${addon.priceUsd}` : addon.priceUsdMin ? `$${addon.priceUsdMin}+` : "";
        chip.textContent = `${addon.name}${price ? " — " + price : ""}`;
        addOnsGrid.appendChild(chip);
      }
    }

    // Discord setup grid
    const setupGrid = document.getElementById("discordSetupGrid");
    if (setupGrid) {
      setupGrid.innerHTML = "";
      for (const item of (discordBody.catalog || []).filter((i) => i.type === "setup")) {
        const card = document.createElement("article");
        card.className = `market-item discord-tier-${item.tier || "starter"}`;
        card.innerHTML = `
          ${buildBotImageMarkup(item, `${item.name || "Discord setup"} image`)}
          ${item.pricingBadge ? `<span class="price-badge">${escapeHtml(item.pricingBadge)}</span>` : ""}
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p class="market-price">$${Number(item.priceUsd || 0)} USD</p>
        `;
        setupGrid.appendChild(card);
      }
    }

    // Discord template grid
    const templateGrid = document.getElementById("discordTemplateGrid");
    if (templateGrid) {
      templateGrid.innerHTML = "";
      for (const item of (discordBody.catalog || []).filter((i) => i.type === "template")) {
        const card = document.createElement("article");
        card.className = "market-item";
        card.innerHTML = `
          ${buildBotImageMarkup(item, `${item.name || "Discord template"} image`)}
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p class="market-price">$${Number(item.priceUsd || 0)} USD</p>
        `;
        templateGrid.appendChild(card);
      }
    }

    // Subscription plan grid
    const subGrid = document.getElementById("subscriptionPlanGrid");
    if (subGrid) {
      subGrid.innerHTML = "";
      for (const plan of (subBody.plans || [])) {
        const card = document.createElement("article");
        card.className = `market-item sub-tier-${plan.tier || "free"}`;
        card.innerHTML = `
          ${buildBotImageMarkup(plan, `${plan.name || "Subscription"} image`)}
          ${plan.pricingBadge ? `<span class="price-badge">${escapeHtml(plan.pricingBadge)}</span>` : ""}
          <h3>${escapeHtml(plan.name)}</h3>
          <p>${escapeHtml(plan.description)}</p>
          <p class="market-price">${Number(plan.priceUsd || 0) === 0 ? "Free" : `$${Number(plan.priceUsd || 0).toFixed(2)}/mo`}</p>
          <ul class="feature-list">${(plan.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        `;
        subGrid.appendChild(card);
      }
    }
  } catch (err) {
    console.error("loadNewPricingCatalogs:", err.message);
  }
}

// --- Enforcement Form ---
const _enfApplyBtn = document.getElementById("enfApplyBtn");
const _enfStatusLine = document.getElementById("enfStatusLine");
if (_enfApplyBtn instanceof HTMLElement) {
  _enfApplyBtn.addEventListener("click", async () => {
    const clientSelect = document.getElementById("enfClientSelect");
    const actionSelect = document.getElementById("enfActionSelect");
    const reasonSelect = document.getElementById("enfReasonSelect");
    const noteInput = document.getElementById("enfNoteInput");
    const clientId = clientSelect instanceof HTMLSelectElement ? clientSelect.value : "";
    const action = actionSelect instanceof HTMLSelectElement ? actionSelect.value : "";
    const reason = reasonSelect instanceof HTMLSelectElement ? reasonSelect.value : "";
    const note = noteInput instanceof HTMLTextAreaElement ? noteInput.value.trim() : (noteInput instanceof HTMLInputElement ? noteInput.value.trim() : "");

    const setEnfStatus = (msg, type) => {
      if (_enfStatusLine) {
        _enfStatusLine.textContent = msg;
        _enfStatusLine.className = type === "error" ? "status-line error" : "status-line";
      }
    };

    if (!clientId) { setEnfStatus("Select a client.", "error"); return; }
    if (!action) { setEnfStatus("Select an enforcement action.", "error"); return; }
    if (!reason) { setEnfStatus("Select a reason (required).", "error"); return; }

    try {
      const response = await fetch(`/api/owner/clients/${encodeURIComponent(clientId)}/enforce`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, note })
      });
      const body = await response.json().catch(() => ({ ok: false, error: "Enforcement failed" }));
      if (!body.ok) throw new Error(body.error || "Enforcement failed");
      if (noteInput instanceof HTMLElement) noteInput.value = "";
      setEnfStatus(`Action "${action}" applied for reason "${reason}". Logged permanently.`);
      ownerOverviewCache = null;
      await loadOwnerEnforcement().catch(() => {});
      await loadOwnerUsers().catch(() => {});
      await loadOwnerDashboard().catch(() => {});
    } catch (err) {
      setEnfStatus(err.message, "error");
    }
  });
}

// --- Force Logout All Sessions ---
const _ownerForceLogoutBtn = document.getElementById("ownerForceLogoutAllBtn");
if (_ownerForceLogoutBtn instanceof HTMLElement) {
  _ownerForceLogoutBtn.addEventListener("click", async () => {
    if (!confirm("Revoke ALL active sessions? Everyone will be logged out including you.")) return;
    try {
      const response = await fetch("/api/owner/sessions/revoke-all", {
        method: "POST",
        credentials: "same-origin"
      });
      const body = await response.json().catch(() => ({ ok: false }));
      if (!body.ok) throw new Error("Session revoke failed");
      alert(`${body.sessionsRevoked} session(s) revoked. Reloading...`);
      window.location.reload();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });
}

// --- Login Log Filter Bindings ---
(() => {
  const loginLogRefreshBtn2 = document.getElementById("loginLogRefreshBtn");
  const loginLogSearch2 = document.getElementById("loginLogSearch");
  const loginLogSuccessFilter2 = document.getElementById("loginLogSuccessFilter");
  const loginLogFlaggedFilter2 = document.getElementById("loginLogFlaggedFilter");
  if (loginLogRefreshBtn2) loginLogRefreshBtn2.addEventListener("click", () => loadLoginLog().catch(console.error));
  if (loginLogSearch2) loginLogSearch2.addEventListener("input", () => loadLoginLog().catch(console.error));
  if (loginLogSuccessFilter2) loginLogSuccessFilter2.addEventListener("change", () => loadLoginLog().catch(console.error));
  if (loginLogFlaggedFilter2) loginLogFlaggedFilter2.addEventListener("change", () => loadLoginLog().catch(console.error));
})();

// --- Owner Users Filter Bindings ---
(() => {
  const ownerUserSearch2 = document.getElementById("ownerUserSearch");
  const ownerUserStateFilter2 = document.getElementById("ownerUserStateFilter");
  const ownerUserFlaggedOnly2 = document.getElementById("ownerUserFlaggedOnly");
  const ownerUsersRefreshBtn2 = document.getElementById("ownerUsersRefreshBtn");
  if (ownerUserSearch2) ownerUserSearch2.addEventListener("input", () => loadOwnerUsers().catch(console.error));
  if (ownerUserStateFilter2) ownerUserStateFilter2.addEventListener("change", () => loadOwnerUsers().catch(console.error));
  if (ownerUserFlaggedOnly2) ownerUserFlaggedOnly2.addEventListener("change", () => loadOwnerUsers().catch(console.error));
  if (ownerUsersRefreshBtn2) ownerUsersRefreshBtn2.addEventListener("click", () => loadOwnerUsers().catch(console.error));
})();

// --- Owner Panel Delegated Events ---
document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  // Quick action apply button (Users + Payments + Services tabs)
  if (target.classList.contains("owner-apply-action")) {
    const clientId = String(target.dataset.clientId || "");
    const actionFromData = target.dataset.action || "";
    const select = document.querySelector(`select.owner-client-action[data-client-id="${CSS.escape(clientId)}"]`);
    const action = actionFromData || (select instanceof HTMLSelectElement ? select.value : "");
    if (!clientId || !action) return;
    try {
      await sendOwnerClientAction(clientId, action, action === "reduce_balance" ? { amountUsd: 50 } : {});
      setOwnerSystemStatus(`Action "${action}" applied to ${clientId}.`);
      ownerOverviewCache = null;
      await loadOwnerUsers().catch(() => {});
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
    return;
  }

  // Save financials
  if (target.classList.contains("owner-save-financial")) {
    const clientId = String(target.dataset.clientId || "");
    if (!clientId) return;
    const row = target.closest("li");
    const totalInput = row?.querySelector("input.owner-financial.total");
    const paidInput = row?.querySelector("input.owner-financial.paid");
    const dueInput = row?.querySelector("input.owner-financial.due");
    const balanceDueInput = row?.querySelector("input.owner-financial.balance-due");
    const payload = {
      totalCostUsd: totalInput instanceof HTMLInputElement ? Number(totalInput.value || 0) : 0,
      paidAmountUsd: paidInput instanceof HTMLInputElement ? Number(paidInput.value || 0) : 0,
      dueAt: dueInput instanceof HTMLInputElement ? dueInput.value : "",
      balanceDueAt: balanceDueInput instanceof HTMLInputElement ? balanceDueInput.value : ""
    };
    try {
      await saveOwnerClientFinancials(clientId, payload);
      ownerOverviewCache = null;
      await loadOwnerPayments().catch(() => {});
      setOwnerSystemStatus(`Financials saved for ${clientId}.`);
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
    return;
  }

  // Save feature toggles
  if (target.classList.contains("owner-save-features")) {
    const clientId = String(target.dataset.clientId || "");
    if (!clientId) return;
    const row = target.closest("li");
    const toggles = row?.querySelectorAll("input.feat-toggle");
    const features = {};
    toggles?.forEach((tog) => {
      if (tog instanceof HTMLInputElement && tog.dataset.feature) {
        features[tog.dataset.feature] = tog.checked;
      }
    });
    try {
      const response = await fetch(`/api/owner/clients/${encodeURIComponent(clientId)}/features`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features)
      });
      const body = await response.json().catch(() => ({ ok: false }));
      if (!body.ok) throw new Error("Feature update failed");
      ownerOverviewCache = null;
      setOwnerSystemStatus(`Features updated for ${clientId}.`);
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
    return;
  }

  // Flag / unflag account
  if (target.classList.contains("owner-flag-toggle")) {
    const clientId = String(target.dataset.clientId || "");
    const isFlagged = target.dataset.flagged === "1";
    if (!clientId) return;
    try {
      const response = await fetch(`/api/owner/clients/${encodeURIComponent(clientId)}/flag`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged: !isFlagged, reason: isFlagged ? "" : "Flagged by owner" })
      });
      const body = await response.json().catch(() => ({ ok: false }));
      if (!body.ok) throw new Error("Flag update failed");
      setOwnerSystemStatus(`Account ${!isFlagged ? "flagged" : "unflagged"}: ${clientId}.`);
      await loadOwnerUsers().catch(() => {});
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
    return;
  }

  // Flag from login log
  if (target.classList.contains("flag-login-user")) {
    const discordId = String(target.dataset.discordId || "");
    if (!discordId) return;
    const client = ownerClients.find((c) => c.discord === discordId || c.discordId === discordId);
    if (!client) {
      setOwnerSystemStatus(`No client found for Discord ID ${discordId}.`, "error");
      return;
    }
    try {
      const response = await fetch(`/api/owner/clients/${encodeURIComponent(client.id)}/flag`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged: true, reason: "Flagged from login log" })
      });
      const body = await response.json().catch(() => ({ ok: false }));
      if (!body.ok) throw new Error("Flag failed");
      setOwnerSystemStatus(`Account flagged for Discord ID ${discordId}.`);
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
    return;
  }
});

// Wire owner refresh to also reload all panel data
if (ownerRefreshBtn instanceof HTMLElement) {
  ownerRefreshBtn.addEventListener("click", async () => {
    try {
      await loadOwnerDashboard();
      if (activeOwnerScreenId === "ownerUsers") await loadOwnerUsers().catch(() => {});
      if (activeOwnerScreenId === "ownerPayments") await loadOwnerPayments().catch(() => {});
      if (activeOwnerScreenId === "ownerServices") await loadOwnerServices().catch(() => {});
      if (activeOwnerScreenId === "ownerEnforcement") await loadOwnerEnforcement().catch(() => {});
      if (activeOwnerScreenId === "ownerLogs") await loadLoginLog().catch(() => {});
      if (activeOwnerScreenId === "ownerSettings") await loadOwnerSettings().catch(() => {});
    } catch (err) {
      setOwnerSystemStatus(err.message, "error");
    }
  });
}


/* ---------------------------------------------------------------------------
  TRH PANEL v3.0 - NEW SYSTEMS
   Announcement rotator | Changelog modal | Notifications | Uptime | Analytics | Search
   --------------------------------------------------------------------------- */

// --- UPTIME COUNTER --------------------------------------------------------
(function initUptimeCounter() {
  const startTime = Date.now();
  const el = document.getElementById("heroUptimeCounter");
  if (!el) return;
  function updateUptime() {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) el.textContent = `${h}h ${m}m ${sec}s`;
    else if (m > 0) el.textContent = `${m}m ${sec}s`;
    else el.textContent = `${sec}s`;
  }
  updateUptime();
  setInterval(updateUptime, 1000);
})();

// --- ANNOUNCEMENT ROTATOR --------------------------------------------------
(function initAnnouncements() {
  const announcements = [
    {
      icon: "\u2605",
      text: "<strong>Welcome to the NEW TRH Development Control Panel.</strong> Explore the upgraded system, live bot controls, owner tools, security management, and real-time updates."
    },
    {
      icon: "\u25C6",
      text: "<strong>7 Active TRH Bots</strong> are now tracked in the Control Panel. Click any bot card on the Home screen to navigate to its control screen."
    },
    {
      icon: "\u25A3",
      text: "<strong>Analytics Dashboard</strong> is live. Track bot packages, revenue, delivery rates, and system health from the Home screen."
    },
    {
      icon: "\u25B6",
      text: "<strong>3 Bot Packages Available:</strong> TRH Starter ($59), TRH Growth ($149), and TRH Enterprise ($349). Open the Marketplace to get started."
    },
    {
      icon: "\u2731",
      text: "<strong>Security Hardened.</strong> Emergency lockout, session management, and login audit are all active and monitored in real-time."
    }
  ];

  let currentAnn = 0;
  let annTimer = null;

  const annText = document.getElementById("annText");
  const annIcon = document.getElementById("annIcon");
  const annDots = document.getElementById("annDots");
  const annPrev = document.getElementById("annPrevBtn");
  const annNext = document.getElementById("annNextBtn");

  if (!annText || !annDots) return;

  function buildDots() {
    annDots.innerHTML = "";
    announcements.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "ann-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => showAnn(i));
      annDots.appendChild(d);
    });
  }

  function showAnn(idx) {
    currentAnn = (idx + announcements.length) % announcements.length;
    const a = announcements[currentAnn];
    annIcon.textContent = a.icon;
    annText.innerHTML = a.text;
    // update dots
    annDots.querySelectorAll(".ann-dot").forEach((d, i) => {
      d.classList.toggle("active", i === currentAnn);
    });
    // reset auto-rotate
    clearInterval(annTimer);
    annTimer = setInterval(() => showAnn(currentAnn + 1), 6000);
  }

  buildDots();
  showAnn(0);

  if (annPrev) annPrev.addEventListener("click", () => showAnn(currentAnn - 1));
  if (annNext) annNext.addEventListener("click", () => showAnn(currentAnn + 1));
})();

// --- CHANGELOG MODAL ------------------------------------------------------
(function initChangelog() {
  const STORAGE_KEY = "trh-changelog-seen-v3";
  const modal = document.getElementById("changelogModal");
  const closeBtn = document.getElementById("changelogCloseBtn");
  const markReadBtn = document.getElementById("changelogMarkReadBtn");
  const dontShowChk = document.getElementById("changelogDontShow");
  const heroBtn = document.getElementById("changelogHeroBtn");
  const sidebarBtn = document.getElementById("sidebarChangelogBtn");

  if (!modal) return;

  function openChangelog() {
    modal.classList.remove("hidden");
    modal.removeAttribute("hidden");
  }

  function closeChangelog() {
    modal.classList.add("hidden");
    if (dontShowChk && dontShowChk.checked) {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }

  // Show on first load if not dismissed
  if (!localStorage.getItem(STORAGE_KEY)) {
    setTimeout(openChangelog, 1200);
  }

  // Overlay click closes
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeChangelog();
  });

  if (closeBtn)    closeBtn.addEventListener("click", closeChangelog);
  if (markReadBtn) markReadBtn.addEventListener("click", closeChangelog);
  if (heroBtn)     heroBtn.addEventListener("click", openChangelog);
  if (sidebarBtn)  sidebarBtn.addEventListener("click", openChangelog);

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeChangelog();
  });
})();

// --- NOTIFICATION SYSTEM --------------------------------------------------
const _notifQueue = [];
let _notifCount = 0;

function addNotification(icon, title, timeLabel) {
  const badge = document.getElementById("notifBadge");
  const list = document.getElementById("notifList");
  if (!badge || !list) return;

  _notifCount++;
  _notifQueue.unshift({ icon, title, timeLabel: timeLabel || "Just now" });

  // Update badge
  badge.textContent = _notifCount;
  badge.hidden = false;

  // Rebuild list
  const items = _notifQueue.slice(0, 20).map(n => `
    <div class="notif-item">
      <span class="notif-icon">${n.icon}</span>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-time">${n.timeLabel}</div>
      </div>
    </div>
  `).join("");
  list.innerHTML = items || '<p class="notif-empty">No notifications.</p>';
}

(function initNotifications() {
  const bell = document.getElementById("notifBell");
  const dropdown = document.getElementById("notifDropdown");
  const clearBtn = document.getElementById("notifClearBtn");

  if (!bell || !dropdown) return;

  let open = false;

  function toggleDropdown() {
    open = !open;
    dropdown.hidden = !open;
  }

  function closeDropdown() {
    open = false;
    dropdown.hidden = true;
  }

  bell.addEventListener("click", (e) => { e.stopPropagation(); toggleDropdown(); });
  bell.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") toggleDropdown(); });

  document.addEventListener("click", (e) => {
    if (open && !dropdown.contains(e.target) && e.target !== bell) closeDropdown();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      _notifQueue.length = 0;
      _notifCount = 0;
      const badge = document.getElementById("notifBadge");
      if (badge) badge.hidden = true;
      const list = document.getElementById("notifList");
      if (list) list.innerHTML = '<p class="notif-empty">No notifications yet.</p>';
    });
  }

  // Seed initial system notifications
  setTimeout(() => {
    addNotification("\u2713", "TRH Panel v3.0 loaded successfully", "Just now");
    addNotification("\u25C6", "7 bot integrations active", "Just now");
  }, 2000);
})();

// --- HERO BOT STATUS CHIP UPDATE ------------------------------------------
(function updateHeroBotStatus() {
  const labelEl = document.getElementById("heroBotStatusLabel");
  const chipEl  = document.getElementById("heroBotStatus");
  if (!labelEl || !chipEl) return;

  // Poll the existing botOnline element's text content as a signal
  function syncStatus() {
    const onlineEl = document.getElementById("botOnline");
    if (!onlineEl) return;
    const text = onlineEl.textContent.trim().toLowerCase();
    if (text === "online" || text === "true") {
      labelEl.textContent = "All Bots Online";
      chipEl.className = "trh-status-chip online";
    } else if (text === "offline" || text === "false") {
      labelEl.textContent = "Bot Offline";
      chipEl.className = "trh-status-chip";
      chipEl.style.background = "rgba(255,23,68,0.1)";
      chipEl.style.borderColor = "rgba(255,23,68,0.4)";
      chipEl.style.color = "#ff6b6b";
    } else {
      labelEl.textContent = "Checking...";
    }
  }
  syncStatus();
  setInterval(syncStatus, 5000);
})();

// --- ANALYTICS POPULATION -------------------------------------------------
function buildSparkbars(containerId, values) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values, 1);
  el.innerHTML = values.map(v => {
    const pct = Math.round((v / max) * 100);
    return `<div class="sparkbar" style="height:${pct}%;"></div>`;
  }).join("");
}

function buildActivityHeatmap(containerId, levels) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = levels.map(l => `<div class="activity-cell" data-level="${l}"></div>`).join("");
}

async function populateAnalytics() {
  try {
    const res = await fetch("/api/platform/overview");
    const data = res.ok ? await res.json() : {};

    const orders      = data.totalOrders        || 0;
    const revenue     = data.revenueUsd          || 0;
    const delivered   = data.deliveredOrders     || 0;
    const pkgs        = data.totalBotPackages    || 3;

    // Cards
    const analPkg  = document.getElementById("analyticsPackages");
    const analRev  = document.getElementById("analyticsRevenue");
    const analDel  = document.getElementById("analyticsDelivery");
    const analHealth = document.getElementById("analyticsHealth");
    const analRevDelta = document.getElementById("analyticsRevDelta");

    if (analPkg)  analPkg.textContent  = pkgs;
    if (analRev)  analRev.textContent  = `$${revenue.toFixed ? revenue.toFixed(0) : revenue}`;
    if (analRevDelta && orders > 0) analRevDelta.textContent = `? ${orders} orders`;

    const delivPct = orders > 0 ? Math.round((delivered / orders) * 100) : 100;
    if (analDel) analDel.textContent = `${delivPct}%`;

    const healthy = delivPct >= 80;
    if (analHealth) {
      analHealth.textContent  = healthy ? "NOMINAL" : "WARN";
      analHealth.style.color  = healthy ? "var(--neon-green)" : "var(--neon-amber)";
    }

    // Sparkbars (simulated history based on live values)
    buildSparkbars("sparkbarPackages", [1, 1, 2, 2, 3, 3, 3, pkgs]);
    buildSparkbars("sparkbarRevenue",  [0, 59, 149, 208, 267, 349, 386, revenue > 0 ? revenue : 386]);
    buildSparkbars("sparkbarDelivery", [80, 85, 90, 90, 95, 95, 100, delivPct]);

    // Activity heatmap (simulate hourly activity)
    const levels = Array.from({ length: 24 }, (_, i) => {
      if (i >= 0  && i < 6)  return Math.floor(Math.random() * 2);
      if (i >= 6  && i < 12) return 2 + Math.floor(Math.random() * 2);
      if (i >= 12 && i < 18) return 3 + Math.floor(Math.random() * 2);
      return 1 + Math.floor(Math.random() * 2);
    }).map(l => Math.min(l, 4));
    buildActivityHeatmap("activityHeatmap", levels);

  } catch (e) {
    console.warn("[Analytics] Load error:", e);
  }
}

// Run analytics on load and every 30 seconds
populateAnalytics();
setInterval(populateAnalytics, 30000);

// --- GLOBAL SEARCH --------------------------------------------------------
(function initGlobalSearch() {
  const input = document.getElementById("globalSearchInput");
  if (!input) return;
  if (input instanceof HTMLInputElement) {
    input.placeholder = "Jump to screen... (Enter, Ctrl+K, Alt+1..9)";
    input.title = "Jump quickly: Enter to search, Ctrl+K to focus, Alt+Left/Right to cycle, Alt+1..9 for direct screens.";
  }

  const screenMap = [
    { terms: ["home", "overview", "dashboard", "main"],        screen: "homeScreen" },
    { terms: ["business", "suite", "sla", "clients", "delivery"], screen: "businessScreen" },
    { terms: ["control", "center", "bot", "telemetry", "ops"], screen: "controlScreen" },
    { terms: ["market", "marketplace", "shop", "buy", "purchase", "starter", "growth", "enterprise"], screen: "marketScreen" },
    { terms: ["orders", "order", "provision", "checkout"],     screen: "ordersScreen" },
    { terms: ["my bots", "mybots", "bots"],                    screen: "myBotsScreen" },
    { terms: ["build", "library", "module", "modules"],        screen: "buildLibraryScreen" },
    { terms: ["emergency", "lockout", "shutdown", "nuclear"],  screen: "emergencyScreen" },
    { terms: ["users", "user", "sessions", "security", "login"], screen: "usersScreen" }
  ];

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.trim().toLowerCase();
    if (!q) return;

    for (const entry of screenMap) {
      if (entry.terms.some(t => q.includes(t) || t.includes(q))) {
        if (typeof setActiveScreen === "function") {
          setActiveScreen(entry.screen);
          input.value = "";
          input.blur();
          return;
        }
        // Fallback: click the tab
        const btn = document.querySelector(`.tab-btn[data-screen="${entry.screen}"]`);
        if (btn) { btn.click(); input.value = ""; input.blur(); return; }
      }
    }
    // No match - add a notification
    addNotification("\u26A0", `No screen found for: "${q}"`);
    input.value = "";
  });
})();

// --- HERO QUICK-NAV BUTTONS -----------------------------------------------
document.querySelectorAll(".trh-hero-btn[data-screen]").forEach(btn => {
  btn.addEventListener("click", () => {
    const screen = btn.getAttribute("data-screen");
    if (screen && typeof setActiveScreen === "function") setActiveScreen(screen);
    else {
      const tab = document.querySelector(`.tab-btn[data-screen="${screen}"]`);
      if (tab) tab.click();
    }
  });
});

// --- SIDEBAR LIVE STATUS UPDATE -------------------------------------------
(function updateSidebarStatus() {
  const el = document.getElementById("sidebarLiveText");
  if (!el) return;
  function sync() {
    const onlineEl = document.getElementById("botOnline");
    if (!onlineEl) return;
    const isOnline = onlineEl.textContent.trim().toLowerCase() === "online" ||
                     onlineEl.textContent.trim().toLowerCase() === "true";
    el.textContent = isOnline ? "System Online" : "Bot Offline - Check Control";
  }
  sync();
  setInterval(sync, 6000);
})();
