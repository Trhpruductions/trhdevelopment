/**
 * TRH Development — Discord Role Sync Manager
 *
 * Automatically syncs Discord roles when a user's tier or enforcement state changes.
 *
 * SETUP — configure once at bot startup:
 *
 *   const { RoleSyncManager } = require('./bot-connector/roleSyncManager');
 *
 *   const roleSync = new RoleSyncManager(client, {
 *     guildId: process.env.MAIN_GUILD_ID,
 *     roles: {
 *       free:       process.env.ROLE_FREE       || null,
 *       vip:        process.env.ROLE_VIP        || null,
 *       pro:        process.env.ROLE_PRO        || null,
 *       premium:    process.env.ROLE_PREMIUM    || null,
 *       restricted: process.env.ROLE_RESTRICTED || null,  // blacklisted/frozen
 *       frozen:     process.env.ROLE_FROZEN     || null,  // optional separate frozen role
 *     }
 *   });
 *
 * USAGE after enforcement actions:
 *
 *   // After blacklist:
 *   await roleSync.applyBlacklist(discordId);
 *
 *   // After restore / unblacklist:
 *   await roleSync.applyTier(discordId, 'premium');
 *
 *   // After freeze:
 *   await roleSync.applyFreeze(discordId);
 *
 *   // After payment restored:
 *   await roleSync.applyTier(discordId, 'vip');
 *
 * The manager is safe to call even when guild/member is unavailable — it logs
 * failures and never throws.
 */

"use strict";

const TIER_NAMES = ["free", "vip", "pro", "premium"];

class RoleSyncManager {
  /**
   * @param {import('discord.js').Client} client - Discord.js Client instance
   * @param {Object} options
   * @param {string}   options.guildId       - Discord guild ID to sync roles in
   * @param {Object}   options.roles         - Map of tier/state → role ID
   * @param {string}  [options.roles.free]
   * @param {string}  [options.roles.vip]
   * @param {string}  [options.roles.pro]
   * @param {string}  [options.roles.premium]
   * @param {string}  [options.roles.restricted]  - Applied when blacklisted or frozen
   * @param {string}  [options.roles.frozen]       - Optional separate frozen role
   * @param {boolean} [options.verbose]            - Log role changes (default: true)
   */
  constructor(client, options = {}) {
    this.client = client;
    this.guildId = String(options.guildId || "").trim();
    this.roles = options.roles || {};
    this.verbose = options.verbose !== false;
    this._allTierRoleIds = TIER_NAMES.map((t) => this.roles[t]).filter(Boolean);
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  _log(msg) {
    if (this.verbose) console.log(`[TRH RoleSync] ${msg}`);
  }

  _warn(msg) {
    console.warn(`[TRH RoleSync] ${msg}`);
  }

  /**
   * Fetch guild member, returning null on any error.
   */
  async _getMember(discordId) {
    if (!this.guildId || !discordId) return null;
    try {
      const guild = this.client.guilds.cache.get(this.guildId)
        || await this.client.guilds.fetch(this.guildId).catch(() => null);
      if (!guild) return null;
      return await guild.members.fetch(String(discordId)).catch(() => null);
    } catch (_) {
      return null;
    }
  }

  /**
   * Add a role to a member if they don't already have it.
   */
  async _addRole(member, roleId, reason) {
    if (!roleId || !member) return;
    if (member.roles.cache.has(roleId)) return;
    try {
      await member.roles.add(roleId, reason || "TRH Enforcement");
      this._log(`Added role ${roleId} to ${member.user.tag}`);
    } catch (err) {
      this._warn(`Failed to add role ${roleId} to ${member.user.id}: ${err.message}`);
    }
  }

  /**
   * Remove a role from a member if they have it.
   */
  async _removeRole(member, roleId, reason) {
    if (!roleId || !member) return;
    if (!member.roles.cache.has(roleId)) return;
    try {
      await member.roles.remove(roleId, reason || "TRH Enforcement");
      this._log(`Removed role ${roleId} from ${member.user.tag}`);
    } catch (err) {
      this._warn(`Failed to remove role ${roleId} from ${member.user.id}: ${err.message}`);
    }
  }

  /**
   * Remove all tier roles + enforcement roles from a member (clean slate).
   */
  async _clearAllTrhRoles(member, reason) {
    if (!member) return;
    const allRoleIds = [
      ...this._allTierRoleIds,
      this.roles.restricted,
      this.roles.frozen
    ].filter(Boolean);
    await Promise.all(allRoleIds.map((rid) => this._removeRole(member, rid, reason)));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Sync roles for a tier change (restore or upgrade/downgrade).
   * Removes all other tier roles, removes restriction roles, adds the correct tier role.
   *
   * @param {string} discordId
   * @param {string} tier - "free" | "vip" | "pro" | "premium"
   * @param {string} [reason]
   */
  async applyTier(discordId, tier, reason) {
    const safeTier = TIER_NAMES.includes(String(tier || "").toLowerCase()) ? tier.toLowerCase() : "free";
    const member = await this._getMember(discordId);
    if (!member) {
      this._warn(`applyTier: member ${discordId} not found in guild ${this.guildId}`);
      return { ok: false, reason: "member_not_found" };
    }

    const targetRoleId = this.roles[safeTier];
    const logReason = reason || `TRH tier set to ${safeTier}`;

    // Remove all tier roles
    await Promise.all(
      TIER_NAMES
        .filter((t) => t !== safeTier)
        .map((t) => this._removeRole(member, this.roles[t], logReason))
    );
    // Remove restriction roles
    await this._removeRole(member, this.roles.restricted, logReason);
    await this._removeRole(member, this.roles.frozen, logReason);
    // Add the correct tier role
    if (targetRoleId) await this._addRole(member, targetRoleId, logReason);

    this._log(`Tier sync complete: ${member.user.tag} → ${safeTier.toUpperCase()}`);
    return { ok: true, discordId, tier: safeTier };
  }

  /**
   * Apply blacklist role changes:
   * - Remove all tier roles
   * - Add restricted role
   * - Keep free tier role if free role is configured (downgrade, not removal)
   *
   * @param {string} discordId
   * @param {string} [reason]
   */
  async applyBlacklist(discordId, reason) {
    const member = await this._getMember(discordId);
    if (!member) {
      this._warn(`applyBlacklist: member ${discordId} not found in guild ${this.guildId}`);
      return { ok: false, reason: "member_not_found" };
    }

    const logReason = reason || "TRH blacklist applied";

    // Remove all paid tier roles (vip/pro/premium)
    await Promise.all(
      ["vip", "pro", "premium"].map((t) => this._removeRole(member, this.roles[t], logReason))
    );
    // Remove frozen role if set (blacklist supersedes freeze)
    await this._removeRole(member, this.roles.frozen, logReason);
    // Add free tier role (downgraded, not ejected)
    if (this.roles.free) await this._addRole(member, this.roles.free, logReason);
    // Add restricted role
    if (this.roles.restricted) await this._addRole(member, this.roles.restricted, logReason);

    this._log(`Blacklist sync complete: ${member.user.tag}`);
    return { ok: true, discordId };
  }

  /**
   * Apply freeze role changes:
   * - Remove all tier roles
   * - Add restricted and/or frozen role
   *
   * @param {string} discordId
   * @param {string} [reason]
   */
  async applyFreeze(discordId, reason) {
    const member = await this._getMember(discordId);
    if (!member) {
      this._warn(`applyFreeze: member ${discordId} not found in guild ${this.guildId}`);
      return { ok: false, reason: "member_not_found" };
    }

    const logReason = reason || "TRH account frozen";

    await this._clearAllTrhRoles(member, logReason);
    if (this.roles.frozen) await this._addRole(member, this.roles.frozen, logReason);
    else if (this.roles.restricted) await this._addRole(member, this.roles.restricted, logReason);

    this._log(`Freeze sync complete: ${member.user.tag}`);
    return { ok: true, discordId };
  }

  /**
   * Apply restore — clears all enforcement roles and restores a tier.
   * Equivalent to applyTier but with an explicit "restore" log reason.
   *
   * @param {string} discordId
   * @param {string} tier
   * @param {string} [reason]
   */
  async applyRestore(discordId, tier, reason) {
    return this.applyTier(discordId, tier, reason || "TRH account restored");
  }

  /**
   * Apply payment downgrade — remove paid roles, add restricted + free.
   *
   * @param {string} discordId
   * @param {string} [reason]
   */
  async applyPaymentDowngrade(discordId, reason) {
    return this.applyBlacklist(discordId, reason || "TRH payment downgrade");
  }

  /**
   * Sync a member's roles to match their current enforcement state.
   * Useful for bulk re-sync on bot restart.
   *
   * @param {string} discordId
   * @param {{ tier: string, blacklisted: boolean, frozen: boolean }} state
   */
  async syncFromState(discordId, state) {
    if (state.blacklisted) return this.applyBlacklist(discordId, "TRH bulk sync — blacklisted");
    if (state.frozen) return this.applyFreeze(discordId, "TRH bulk sync — frozen");
    return this.applyTier(discordId, state.tier || "free", "TRH bulk sync");
  }

  /**
   * Bulk re-sync all tracked users.
   * Pass an array of { discordId, tier, blacklisted, frozen } objects.
   * Processes in batches to avoid Discord rate limits.
   *
   * @param {Array<{ discordId: string, tier: string, blacklisted: boolean, frozen: boolean }>} users
   * @param {number} [batchSize=10]
   * @param {number} [delayMs=1000]
   */
  async bulkSync(users, batchSize = 10, delayMs = 1000) {
    if (!Array.isArray(users) || users.length === 0) return { ok: true, synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((u) => this.syncFromState(u.discordId, u).catch(() => ({ ok: false })))
      );
      for (const r of results) {
        if (r && r.ok) synced++;
        else failed++;
      }
      if (i + batchSize < users.length && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    this._log(`Bulk sync complete: ${synced} synced, ${failed} failed`);
    return { ok: true, synced, failed };
  }

  /**
   * Fetch all user profiles from the TRH Control Panel and bulk-sync roles.
   * Call this once on bot startup to ensure roles are consistent with panel state.
   *
   * @param {string} panelBaseUrl  - e.g. "http://localhost:3000"
   * @param {string} ownerKey      - OWNER_CONTROL_PASSWORD value
   * @param {{ batchSize?: number, delayMs?: number, pageSize?: number }} [opts]
   */
  async startupSync(panelBaseUrl, ownerKey, opts = {}) {
    const baseUrl = String(panelBaseUrl || "").replace(/\/$/, "");
    const batchSize = Number(opts.batchSize || 10);
    const delayMs = Number(opts.delayMs !== undefined ? opts.delayMs : 1000);
    // Server-side cap is 100; using a higher value means body.rows.length
    // never equals pageSize even when more pages exist, breaking pagination.
    const pageSize = Math.min(Number(opts.pageSize || 100), 100);

    this._log("Starting startup role sync from panel...");

    let page = 1;
    let totalSynced = 0;
    let totalFailed = 0;
    let hasMore = true;

    while (hasMore) {
      let body;
      try {
        const res = await fetch(`${baseUrl}/api/owner/user-profiles?page=${page}&pageSize=${pageSize}`, {
          headers: { "x-owner-key": ownerKey }
        });
        body = await res.json().catch(() => null);
      } catch (err) {
        this._warn(`startupSync: fetch failed on page ${page}: ${err.message}`);
        break;
      }

      if (!body || !body.ok || !Array.isArray(body.rows)) {
        this._warn(`startupSync: unexpected response on page ${page}`);
        break;
      }

      const { synced, failed } = await this.bulkSync(body.rows, batchSize, delayMs);
      totalSynced += synced;
      totalFailed += failed;

      hasMore = body.rows.length === pageSize;
      page++;
    }

    this._log(`Startup sync complete: ${totalSynced} synced, ${totalFailed} failed across ${page - 1} page(s)`);
    return { ok: true, synced: totalSynced, failed: totalFailed };
  }
}

module.exports = { RoleSyncManager };
