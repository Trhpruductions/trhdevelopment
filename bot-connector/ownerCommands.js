/**
 * TRH Development — Owner Enforcement Slash Commands
 *
 * Registers and handles Discord slash commands that map directly to the
 * Control Panel enforcement API:
 *   /blacklist  /unblacklist  /freeze  /restore  /settier  /userinfo
 *
 * Usage in your bot's entry point:
 *
 *   const { registerOwnerCommands, handleOwnerCommand } = require('./bot-connector/ownerCommands');
 *
 *   // Register commands once on startup (guild-scoped = instant update):
 *   await registerOwnerCommands({
 *     token: process.env.DISCORD_BOT_TOKEN,
 *     clientId: process.env.DISCORD_CLIENT_ID,
 *     guildId: process.env.OWNER_GUILD_ID   // omit for global (up to 1h propagation)
 *   });
 *
 *   // In your interactionCreate listener:
 *   client.on('interactionCreate', async (interaction) => {
 *     if (await handleOwnerCommand(interaction, panelClient, { ownerDiscordIds: ['YOUR_ID'] })) return;
 *     // ...rest of your command handling
 *   });
 */

"use strict";

// ── Constants ────────────────────────────────────────────────────────────────

const OWNER_COMMAND_NAMES = new Set([
  "blacklist", "unblacklist", "freeze", "restore", "settier", "userinfo"
]);

const BLACKLIST_REASON_CHOICES = [
  { name: "Chargeback",             value: "chargeback" },
  { name: "Payment Failure",        value: "payment_failure" },
  { name: "Abuse",                  value: "abuse" },
  { name: "Bot Leak",               value: "leak" },
  { name: "Bypass Attempt",         value: "bypass" },
  { name: "Fraud",                  value: "fraud" },
  { name: "Harassment",             value: "harassment" },
  { name: "Unauthorized Reselling", value: "reselling" },
  { name: "Cracking Attempt",       value: "cracking" },
  { name: "TOS Violation",          value: "tos_violation" }
];

const TIER_CHOICES = [
  { name: "Free",    value: "free" },
  { name: "VIP",     value: "vip" },
  { name: "Pro",     value: "pro" },
  { name: "Premium", value: "premium" }
];

// ── Command Definitions (Discord REST payload format) ────────────────────────

const OWNER_COMMAND_DEFINITIONS = [
  {
    name: "blacklist",
    description: "[OWNER] Blacklist a user — downgrades to free tier and locks premium access",
    options: [
      {
        type: 3, // STRING
        name: "user_id",
        description: "Discord User ID to blacklist",
        required: true
      },
      {
        type: 3, // STRING
        name: "reason",
        description: "Blacklist reason",
        required: true,
        choices: BLACKLIST_REASON_CHOICES
      },
      {
        type: 3, // STRING
        name: "detail",
        description: "Additional detail (evidence, notes)",
        required: false
      },
      {
        type: 3, // STRING
        name: "expires",
        description: "Optional expiry date (ISO format, e.g. 2026-12-31)",
        required: false
      }
    ]
  },
  {
    name: "unblacklist",
    description: "[OWNER] Remove a blacklist entry and restore access",
    options: [
      {
        type: 3,
        name: "user_id",
        description: "Discord User ID to unblacklist",
        required: true
      },
      {
        type: 3,
        name: "restored_tier",
        description: "Tier to restore the user to",
        required: false,
        choices: TIER_CHOICES
      }
    ]
  },
  {
    name: "freeze",
    description: "[OWNER] Freeze an account — all commands blocked until restored",
    options: [
      {
        type: 3,
        name: "user_id",
        description: "Discord User ID to freeze",
        required: true
      },
      {
        type: 3,
        name: "reason",
        description: "Reason for freeze (shown in logs)",
        required: false
      }
    ]
  },
  {
    name: "restore",
    description: "[OWNER] Restore a frozen or downgraded account",
    options: [
      {
        type: 3,
        name: "user_id",
        description: "Discord User ID to restore",
        required: true
      },
      {
        type: 3,
        name: "tier",
        description: "Tier to restore the user to (default: free)",
        required: false,
        choices: TIER_CHOICES
      }
    ]
  },
  {
    name: "settier",
    description: "[OWNER] Manually set a user's subscription tier",
    options: [
      {
        type: 3,
        name: "user_id",
        description: "Discord User ID",
        required: true
      },
      {
        type: 3,
        name: "tier",
        description: "Target tier",
        required: true,
        choices: TIER_CHOICES
      }
    ]
  },
  {
    name: "userinfo",
    description: "[OWNER] View full profile, tier, and enforcement status for a user",
    options: [
      {
        type: 3,
        name: "user_id",
        description: "Discord User ID to look up",
        required: true
      }
    ]
  }
];

// ── Command Registration ──────────────────────────────────────────────────────

/**
 * Register owner commands via Discord REST API.
 * Guild-scoped commands update instantly; global commands take up to 1 hour.
 *
 * @param {{ token: string, clientId: string, guildId?: string }} options
 */
async function registerOwnerCommands({ token, clientId, guildId } = {}) {
  if (!token || !clientId) throw new Error("registerOwnerCommands: token and clientId are required");

  const route = guildId
    ? `https://discord.com/api/v10/applications/${clientId}/guilds/${guildId}/commands`
    : `https://discord.com/api/v10/applications/${clientId}/commands`;

  const response = await fetch(route, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(OWNER_COMMAND_DEFINITIONS)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Discord command registration failed (${response.status}): ${body}`);
  }

  const registered = await response.json();
  return registered;
}

// ── Embed Builders ────────────────────────────────────────────────────────────

function buildSuccessEmbed(title, description, fields) {
  return {
    color: 0x2ecc71,
    title: `✅ ${title}`,
    description,
    fields: (fields || []).map((f) => ({ name: f.name, value: String(f.value), inline: f.inline !== false })),
    timestamp: new Date().toISOString(),
    footer: { text: "TRH Development — Enforcement System" }
  };
}

function buildErrorEmbed(title, description) {
  return {
    color: 0xe74c3c,
    title: `❌ ${title}`,
    description,
    timestamp: new Date().toISOString(),
    footer: { text: "TRH Development — Enforcement System" }
  };
}

function buildProfileEmbed(profile, blacklistEntry) {
  const tierColors = { free: 0x888888, vip: 0x3498db, pro: 0x9b59b6, premium: 0xf1c40f };
  const tierColor = tierColors[profile.tier] || 0x888888;

  let statusLine = "🟢 Active";
  if (profile.blacklisted) statusLine = "🔴 Blacklisted";
  else if (profile.frozen) statusLine = "🔵 Frozen";

  const fields = [
    { name: "Discord ID", value: `\`${profile.discordId}\``, inline: true },
    { name: "Username", value: profile.username || "—", inline: true },
    { name: "Tier", value: (profile.tier || "free").toUpperCase(), inline: true },
    { name: "Status", value: statusLine, inline: true },
    { name: "Payment", value: profile.paymentStatus || "active", inline: true },
    { name: "Subscription", value: profile.subscriptionStatus || "none", inline: true },
    { name: "Commands Used", value: String(profile.commandCount || 0), inline: true },
    { name: "Infractions", value: String((profile.infractions || []).length), inline: true },
    { name: "First Seen", value: profile.firstSeenAt ? new Date(profile.firstSeenAt).toLocaleDateString() : "—", inline: true },
    { name: "Last Seen", value: profile.lastSeenAt ? new Date(profile.lastSeenAt).toLocaleDateString() : "—", inline: true }
  ];

  if (profile.outstandingBalance > 0) {
    fields.push({ name: "⚠️ Outstanding Balance", value: `$${profile.outstandingBalance.toFixed(2)}`, inline: true });
  }

  if (blacklistEntry) {
    fields.push({ name: "Blacklist Reason", value: blacklistEntry.reason, inline: true });
    fields.push({ name: "Blacklisted By", value: blacklistEntry.moderator || "system", inline: true });
    fields.push({ name: "Blacklisted At", value: new Date(blacklistEntry.addedAt).toLocaleDateString(), inline: true });
    if (blacklistEntry.reasonDetail) {
      fields.push({ name: "Detail", value: blacklistEntry.reasonDetail, inline: false });
    }
  }

  return {
    color: tierColor,
    title: `👤 User Profile — ${profile.username || profile.discordId}`,
    fields,
    timestamp: new Date().toISOString(),
    footer: { text: "TRH Development — Enforcement System" }
  };
}

// ── Access Guard ──────────────────────────────────────────────────────────────

function isOwnerUser(userId, ownerDiscordIds) {
  if (!ownerDiscordIds || ownerDiscordIds.length === 0) return false;
  return ownerDiscordIds.map((id) => String(id).trim()).includes(String(userId || "").trim());
}

// ── Main Handler ──────────────────────────────────────────────────────────────

/**
 * Handle an owner enforcement command. Call this in your interactionCreate listener.
 * Returns true if the interaction was an owner command (handled or denied), false otherwise.
 *
 * @param {import('discord.js').Interaction} interaction
 * @param {import('./trhControlPanelClient').TrhControlPanelClient} panelClient
 * @param {{ ownerDiscordIds: string[], ownerRoleIds?: string[], allowedGuildIds?: string[], roleSync?: import('./roleSyncManager').RoleSyncManager }} options
 * @returns {Promise<boolean>}
 */
async function handleOwnerCommand(interaction, panelClient, options) {
  if (!interaction.isChatInputCommand()) return false;
  if (!OWNER_COMMAND_NAMES.has(interaction.commandName)) return false;

  const { ownerDiscordIds = [], ownerRoleIds = [], allowedGuildIds = [], roleSync = null } = options || {};
  const userId = interaction.user ? interaction.user.id : null;

  // Guild restriction
  if (allowedGuildIds.length > 0 && (!interaction.guildId || !allowedGuildIds.includes(interaction.guildId))) {
    await safeReply(interaction, {
      embeds: [buildErrorEmbed("Unauthorized", "These commands are not available in this server.")],
      ephemeral: true
    });
    return true;
  }

  // Owner identity check (by user ID or role)
  const memberRoles = interaction.member && interaction.member.roles
    ? (interaction.member.roles.cache || new Map())
    : new Map();
  const hasOwnerRole = ownerRoleIds.some((rid) => memberRoles.has(rid));
  if (!isOwnerUser(userId, ownerDiscordIds) && !hasOwnerRole) {
    await safeReply(interaction, {
      embeds: [buildErrorEmbed("Access Denied", "You do not have permission to use owner enforcement commands.")],
      ephemeral: true
    });
    return true;
  }

  await interaction.deferReply({ ephemeral: true }).catch(() => {});

  try {
    switch (interaction.commandName) {
      case "blacklist": return await handleBlacklist(interaction, panelClient, userId, roleSync);
      case "unblacklist": return await handleUnblacklist(interaction, panelClient, userId, roleSync);
      case "freeze": return await handleFreeze(interaction, panelClient, userId, roleSync);
      case "restore": return await handleRestore(interaction, panelClient, userId, roleSync);
      case "settier": return await handleSetTier(interaction, panelClient, roleSync);
      case "userinfo": return await handleUserInfo(interaction, panelClient);
      default: return false;
    }
  } catch (err) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Command Error", `Unexpected error: ${err.message}`)],
      ephemeral: true
    });
    return true;
  }
}

// ── Individual Command Handlers ───────────────────────────────────────────────

async function handleBlacklist(interaction, panelClient, moderatorId, roleSync) {
  const targetId = interaction.options.getString("user_id", true).trim();
  const reason = interaction.options.getString("reason", true);
  const detail = interaction.options.getString("detail") || "";
  const expiresRaw = interaction.options.getString("expires") || "";
  const expiresAt = expiresRaw ? new Date(expiresRaw).toISOString() : null;

  const result = await panelClient.ownerAction("blacklist", {
    discordId: targetId, reason, reasonDetail: detail, expiresAt
  });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Blacklist Failed", result.error || "Unknown error")],
      ephemeral: true
    });
    return true;
  }

  // Sync Discord roles — downgrade to free + add restricted role
  if (roleSync) {
    roleSync.applyBlacklist(targetId, `Blacklisted: ${reason}`).catch((err) =>
      console.warn(`[TRH RoleSync] blacklist sync failed for ${targetId}: ${err.message}`)
    );
  }

  await safeFollowUp(interaction, {
    embeds: [buildSuccessEmbed("User Blacklisted", `<@${targetId}> has been blacklisted and downgraded to **free tier**.`, [
      { name: "User ID",  value: `\`${targetId}\`` },
      { name: "Reason",   value: reason },
      { name: "Detail",   value: detail || "—" },
      { name: "Expires",  value: expiresAt ? new Date(expiresAt).toLocaleDateString() : "Never (permanent)" },
      { name: "By",       value: `<@${moderatorId}>` }
    ])],
    ephemeral: true
  });
  return true;
}

async function handleUnblacklist(interaction, panelClient, moderatorId, roleSync) {
  const targetId = interaction.options.getString("user_id", true).trim();
  const restoredTier = interaction.options.getString("restored_tier") || "free";

  const result = await panelClient.ownerAction("unblacklist", { discordId: targetId, restoredTier });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Unblacklist Failed", result.error || "Unknown error")],
      ephemeral: true
    });
    return true;
  }

  if (roleSync) {
    roleSync.applyRestore(targetId, restoredTier, "Blacklist removed").catch((err) =>
      console.warn(`[TRH RoleSync] unblacklist sync failed for ${targetId}: ${err.message}`)
    );
  }

  await safeFollowUp(interaction, {
    embeds: [buildSuccessEmbed("Blacklist Removed", `<@${targetId}> has been unblacklisted. Tier restored to **${restoredTier}**.`, [
      { name: "User ID",       value: `\`${targetId}\`` },
      { name: "Restored Tier", value: restoredTier.toUpperCase() },
      { name: "By",            value: `<@${moderatorId}>` }
    ])],
    ephemeral: true
  });
  return true;
}

async function handleFreeze(interaction, panelClient, moderatorId, roleSync) {
  const targetId = interaction.options.getString("user_id", true).trim();
  const reason = interaction.options.getString("reason") || "Suspended pending review";

  const result = await panelClient.ownerAction("freeze", { discordId: targetId, reason });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Freeze Failed", result.error || "Unknown error")],
      ephemeral: true
    });
    return true;
  }

  if (roleSync) {
    roleSync.applyFreeze(targetId, reason).catch((err) =>
      console.warn(`[TRH RoleSync] freeze sync failed for ${targetId}: ${err.message}`)
    );
  }

  await safeFollowUp(interaction, {
    embeds: [buildSuccessEmbed("Account Frozen", `<@${targetId}>'s account has been frozen. All commands are blocked.`, [
      { name: "User ID", value: `\`${targetId}\`` },
      { name: "Reason",  value: reason },
      { name: "By",      value: `<@${moderatorId}>` }
    ])],
    ephemeral: true
  });
  return true;
}

async function handleRestore(interaction, panelClient, moderatorId, roleSync) {
  const targetId = interaction.options.getString("user_id", true).trim();
  const tier = interaction.options.getString("tier") || "free";

  const result = await panelClient.ownerAction("restore", { discordId: targetId, newTier: tier });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Restore Failed", result.error || "Unknown error")],
      ephemeral: true
    });
    return true;
  }

  if (roleSync) {
    roleSync.applyRestore(targetId, tier, "Account restored by owner").catch((err) =>
      console.warn(`[TRH RoleSync] restore sync failed for ${targetId}: ${err.message}`)
    );
  }

  await safeFollowUp(interaction, {
    embeds: [buildSuccessEmbed("Account Restored", `<@${targetId}>'s account has been fully restored.`, [
      { name: "User ID",       value: `\`${targetId}\`` },
      { name: "Restored Tier", value: tier.toUpperCase() },
      { name: "By",            value: `<@${moderatorId}>` }
    ])],
    ephemeral: true
  });
  return true;
}

async function handleSetTier(interaction, panelClient, roleSync) {
  const targetId = interaction.options.getString("user_id", true).trim();
  const tier = interaction.options.getString("tier", true);

  const result = await panelClient.ownerAction("set-tier", { discordId: targetId, tier });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("Set Tier Failed", result.error || "Unknown error")],
      ephemeral: true
    });
    return true;
  }

  if (roleSync) {
    roleSync.applyTier(targetId, tier, `Tier manually set to ${tier}`).catch((err) =>
      console.warn(`[TRH RoleSync] settier sync failed for ${targetId}: ${err.message}`)
    );
  }

  await safeFollowUp(interaction, {
    embeds: [buildSuccessEmbed("Tier Updated", `<@${targetId}>'s subscription tier has been set to **${tier.toUpperCase()}**.`, [
      { name: "User ID", value: `\`${targetId}\`` },
      { name: "New Tier", value: tier.toUpperCase() }
    ])],
    ephemeral: true
  });
  return true;
}

async function handleUserInfo(interaction, panelClient) {
  const targetId = interaction.options.getString("user_id", true).trim();

  const result = await panelClient.ownerAction("get-profile", { discordId: targetId });

  if (!result.ok) {
    await safeFollowUp(interaction, {
      embeds: [buildErrorEmbed("User Not Found", result.error || `No profile found for \`${targetId}\``)],
      ephemeral: true
    });
    return true;
  }

  await safeFollowUp(interaction, {
    embeds: [buildProfileEmbed(result.profile, result.blacklistEntry)],
    ephemeral: true
  });
  return true;
}

// ── Interaction Helpers ───────────────────────────────────────────────────────

async function safeReply(interaction, payload) {
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  } catch (_) { /* ignore */ }
  return true;
}

async function safeFollowUp(interaction, payload) {
  try {
    await interaction.followUp(payload);
  } catch (_) { /* ignore */ }
  return true;
}

// ── Module Exports ────────────────────────────────────────────────────────────

module.exports = {
  OWNER_COMMAND_DEFINITIONS,
  OWNER_COMMAND_NAMES,
  registerOwnerCommands,
  handleOwnerCommand,
  buildSuccessEmbed,
  buildErrorEmbed,
  buildProfileEmbed
};
