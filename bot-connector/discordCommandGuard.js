const { TrhLockoutError } = require("./trhControlPanelClient");

function getIdentityFromInteraction(interaction) {
  const user = interaction && interaction.user ? interaction.user : null;
  const member = interaction && interaction.member ? interaction.member : null;

  const email = member && member.email ? String(member.email).trim().toLowerCase() : "";
  const username = user && user.username ? String(user.username).trim() : "";
  const discriminator = user && user.discriminator ? String(user.discriminator).trim() : "0";
  const discord = username ? `${username}#${discriminator}` : "";
  const discordId = user && user.id ? String(user.id) : "";
  const displayName = (user && user.displayName) ? String(user.displayName) : username;
  const globalName = (user && user.globalName) ? String(user.globalName) : username;
  const avatarUrl = (user && user.displayAvatarURL) ? user.displayAvatarURL({ size: 128 }) : null;
  const guildId = interaction && interaction.guildId ? String(interaction.guildId) : null;
  const guildName = interaction && interaction.guild && interaction.guild.name ? String(interaction.guild.name) : null;
  // Estimate Discord account creation date from snowflake (Discord epoch: 2015-01-01)
  let accountCreatedAt = null;
  if (discordId) {
    const snowflake = BigInt(discordId);
    const createdMs = Number((snowflake >> 22n) + 1420070400000n);
    if (createdMs > 0) accountCreatedAt = new Date(createdMs).toISOString();
  }

  return {
    email,
    discord,
    discordId,
    username,
    displayName,
    globalName,
    avatarUrl,
    guildId,
    guildName,
    accountCreatedAt
  };
}

function buildClientIdHint(identity) {
  const email = String(identity && identity.email ? identity.email : "").trim().toLowerCase();
  const discord = String(identity && identity.discord ? identity.discord : "").trim().toLowerCase();
  if (!email && !discord) {
    return "";
  }

  return `${email}|${discord}`;
}

function createEnforcementMessage(enforcement) {
  if (!enforcement) {
    return "Command blocked by TRH enforcement.";
  }

  if (enforcement.state === "lockout" || enforcement.locked) {
    return "TRH Development bot services are temporarily offline. Please try again later.";
  }

  if (enforcement.state === "blacklisted" || enforcement.state === "emergency_blacklisted") {
    return enforcement.message || "Your TRH Development subscription is currently restricted due to a violation. Premium services are temporarily disabled.";
  }

  if (enforcement.state === "frozen") {
    return "This account has been temporarily suspended by TRH Development.";
  }

  if (enforcement.state === "tier_restricted") {
    return enforcement.message || "Your TRH Development subscription is currently restricted due to an unpaid balance. Premium services are temporarily disabled until payment is completed.";
  }

  if (enforcement.state === "maintenance") {
    return "TRH systems are currently under maintenance";
  }

  if (enforcement.state === "suspended") {
    return "This bot is currently inactive due to unpaid balance. Please contact TRH Development.";
  }

  if (enforcement.state === "restricted") {
    return "Account restricted: premium commands are currently disabled due to unpaid balance.";
  }

  if (enforcement.state === "error") {
    return enforcement.message || "Unable to verify command access right now. Please try again shortly.";
  }

  return String(enforcement.message || "Command blocked by TRH enforcement.");
}

/**
 * Safely reply or follow-up to a Discord interaction without crashing.
 */
async function safeReply(interaction, content) {
  if (!interaction || typeof interaction.reply !== "function") return;
  const payload = { content, ephemeral: true };
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  } catch (_) {}
}

/**
 * Guard a Discord interaction against TRH panel enforcement rules.
 *
 * Automatically:
 *   1. Ingests the user profile into the panel
 *   2. Calls the full enforcement check (blacklist + tier + payment)
 *   3. Logs the command attempt
 *   4. Replies with an ephemeral message if access is denied
 *   5. Optionally triggers Discord role sync on enforcement state changes
 *
 * @param {object} interaction  - Discord.js interaction object
 * @param {object} panelClient  - TrhControlPanelClient instance
 * @param {object} options
 * @param {string} options.commandTier     - "basic" | "vip" | "pro" | "premium"
 * @param {string} options.clientId        - optional explicit billing client ID
 * @param {"open"|"closed"} options.failMode - behaviour when panel is unreachable (default: "open")
 * @param {boolean} options.skipIngest     - set true to skip user profile upsert (performance opt)
 * @param {import('./roleSyncManager').RoleSyncManager} [options.roleSync] - optional role sync manager
 */
async function enforceCommand(interaction, panelClient, options = {}) {
  const tier = String(options.commandTier || "basic").toLowerCase();
  const commandName = interaction && interaction.commandName ? String(interaction.commandName) : "unknown";
  const identity = getIdentityFromInteraction(interaction);
  const failMode = String(options.failMode || "open").toLowerCase();
  const roleSync = options.roleSync || null;

  // Ingest user profile (fire-and-forget; errors silently swallowed)
  if (!options.skipIngest && identity.discordId) {
    panelClient.ingestUser({
      discordId: identity.discordId,
      username: identity.username,
      displayName: identity.displayName,
      globalName: identity.globalName,
      avatarUrl: identity.avatarUrl,
      accountCreatedAt: identity.accountCreatedAt,
      guildId: identity.guildId,
      guildName: identity.guildName
    }).catch(() => {});
  }

  // Use the full enforcement check endpoint
  let result;
  try {
    result = await panelClient.checkEnforcement({
      discordId: identity.discordId,
      username: identity.username,
      commandName,
      commandTier: tier,
      guildId: identity.guildId,
      guildName: identity.guildName,
      failMode
    });
  } catch (err) {
    if (err instanceof TrhLockoutError || err.locked) {
      await safeReply(interaction, "TRH Development bot services are temporarily offline. Please try again later.");
      return { allow: false, warning: null, enforcement: { state: "lockout", locked: true, level: err.level } };
    }
    if (failMode === "closed") {
      await safeReply(interaction, "Unable to verify command access right now. Please try again shortly.");
      return { allow: false, warning: null, enforcement: { state: "error", error: err.message } };
    }
    return { allow: true, warning: "Panel unreachable — command allowed in degraded mode.", enforcement: null };
  }

  if (result.allow) {
    return { allow: true, warning: result.warning || null, enforcement: result };
  }

  // Trigger role sync on enforcement state changes (fire-and-forget)
  if (roleSync && identity.discordId) {
    const state = result.state;
    if (state === "blacklisted" || state === "emergency_blacklisted") {
      roleSync.applyBlacklist(identity.discordId, "Enforcement check — blacklisted").catch(() => {});
    } else if (state === "frozen") {
      roleSync.applyFreeze(identity.discordId, "Enforcement check — frozen").catch(() => {});
    } else if (state === "tier_restricted") {
      roleSync.applyPaymentDowngrade(identity.discordId, "Enforcement check — payment downgrade").catch(() => {});
    }
  }

  const message = createEnforcementMessage(result);
  await safeReply(interaction, message);

  return { allow: false, warning: null, enforcement: result };
}

/**
 * Create a reusable guard pre-bound to a specific panelClient and default options.
 */
function createLockoutGuard(panelClient, defaultOptions = {}) {
  return async function guard(interaction, overrideOptions = {}) {
    return enforceCommand(interaction, panelClient, { ...defaultOptions, ...overrideOptions });
  };
}

module.exports = {
  enforceCommand,
  createLockoutGuard,
  getIdentityFromInteraction,
  createEnforcementMessage,
  RoleSyncManager: require("./roleSyncManager").RoleSyncManager
};

