const crypto = require("crypto");

// Sentinel error subclass so callers can distinguish lockout from other failures
class TrhLockoutError extends Error {
  constructor(level) {
    super(`TRH Development Services Temporarily Disabled By Owner (level=${level || "lockout"})`);
    this.name = "TrhLockoutError";
    this.locked = true;
    this.level = level || "lockout";
  }
}

class TrhControlPanelClient {
  constructor(options = {}) {
    this.baseUrl = String(options.baseUrl || "http://localhost:3000").replace(/\/$/, "");
    this.botToken = String(options.botToken || "").trim();
    this.signingSecret = String(options.signingSecret || "").trim();
    this.ownerKey = String(options.ownerKey || "").trim();
    this.defaultTimeoutMs = Number(options.timeoutMs || 8000);

    // Lockout polling state
    this._lockoutCache = null;       // { active, level, activatedAt } | null
    this._lockoutCachedAt = 0;
    this._lockoutCacheTtlMs = Number(options.lockoutCacheTtlMs || 5000);
    this._lockoutPollTimer = null;
  }

  buildHeaders(rawBody, nonce) {
    const headers = {
      "Content-Type": "application/json"
    };

    if (this.botToken) {
      headers["x-bot-token"] = this.botToken;
    }

    if (this.signingSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = `${timestamp}.${rawBody}`;
      const signature = crypto.createHmac("sha256", this.signingSecret).update(payload).digest("hex");

      headers["x-trh-timestamp"] = String(timestamp);
      headers["x-trh-nonce"] = nonce;
      headers["x-trh-signature"] = `sha256=${signature}`;
    }

    return headers;
  }

  async post(path, body) {
    const rawBody = JSON.stringify(body);
    const nonce = crypto.randomBytes(16).toString("hex");
    const headers = this.buildHeaders(rawBody, nonce);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.defaultTimeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers,
        body: rawBody,
        signal: controller.signal
      });

      const payload = await response.json().catch(() => ({ ok: false, error: "invalid json response" }));

      // Propagate lockout state into cache and throw typed error
      if (response.status === 503 && payload.locked) {
        this._cacheLockout({ active: true, level: payload.level || "lockout" });
        throw new TrhLockoutError(payload.level);
      }

      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  async get(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.defaultTimeoutMs);

    const headers = {};
    if (this.botToken) headers["x-bot-token"] = this.botToken;

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "GET",
        headers,
        signal: controller.signal
      });
      return await response.json().catch(() => ({ ok: false, error: "invalid json response", _status: response.status }));
    } finally {
      clearTimeout(timer);
    }
  }

  _cacheLockout(info) {
    this._lockoutCache = {
      active: Boolean((info || {}).active),
      level: (info || {}).level || null,
      activatedAt: (info || {}).activatedAt || null
    };
    this._lockoutCachedAt = Date.now();
  }

  /**
   * Fetch the current lockout status from the panel.
   * This endpoint is always reachable even during an active lockout.
   * Uses a short in-memory cache to avoid hammering the panel.
   */
  async checkLockoutStatus({ force = false } = {}) {
    const now = Date.now();
    if (!force && this._lockoutCache !== null && now - this._lockoutCachedAt < this._lockoutCacheTtlMs) {
      return { ...this._lockoutCache };
    }

    try {
      const body = await this.get("/api/emergency/status");
      if (body.active !== undefined) {
        // Public response (system is locked or unauthorized)
        this._cacheLockout({ active: Boolean(body.active), level: body.level, activatedAt: body.activatedAt });
      } else if (body.lockout) {
        // Owner-authenticated response
        this._cacheLockout(body.lockout);
      } else {
        // Normal — no lockout
        this._cacheLockout({ active: false, level: null });
      }
    } catch (_) {
      // Network failure — don't flip lockout state, return last cached value
    }

    return this._lockoutCache ? { ...this._lockoutCache } : { active: false, level: null };
  }

  /**
   * Returns true if the system is currently locked (uses cache).
   */
  async isLocked({ force = false } = {}) {
    const status = await this.checkLockoutStatus({ force });
    return Boolean(status && status.active);
  }

  /**
   * Start polling for lockout state changes.
   * @param {function} onLockout - called with { level, activatedAt } when lockout activates
   * @param {function} onRestore - called when lockout is lifted
   * @param {number} intervalMs - polling interval (default 10s)
   */
  startLockoutPolling(onLockout, onRestore, intervalMs = 10000) {
    if (this._lockoutPollTimer) this.stopLockoutPolling();

    let lastActive = this._lockoutCache ? this._lockoutCache.active : null;

    const poll = async () => {
      try {
        const status = await this.checkLockoutStatus({ force: true });
        const currentActive = Boolean(status.active);

        if (lastActive !== null) {
          if (currentActive && !lastActive) {
            if (typeof onLockout === "function") onLockout(status);
          } else if (!currentActive && lastActive) {
            if (typeof onRestore === "function") onRestore();
          }
        }

        lastActive = currentActive;
      } catch (_) {}

      this._lockoutPollTimer = setTimeout(poll, intervalMs);
    };

    this._lockoutPollTimer = setTimeout(poll, intervalMs);
  }

  /** Stop lockout polling. */
  stopLockoutPolling() {
    if (this._lockoutPollTimer) {
      clearTimeout(this._lockoutPollTimer);
      this._lockoutPollTimer = null;
    }
  }

  async sendTelemetry({ botOnline, guildCount, usersServed, economyBalance }) {
    return this.post("/api/bot/telemetry", {
      botOnline,
      guildCount,
      usersServed,
      economyBalance
    });
  }

  async sendEconomyTransaction({ txId, delta, reason }) {
    return this.post("/api/bot/economy/transaction", {
      txId,
      delta,
      reason
    });
  }

  async checkCommandAccess({
    clientId,
    email,
    discord,
    commandName,
    commandTier = "basic"
  }) {
    return this.post("/api/client/command-check", {
      clientId,
      email,
      discord,
      commandName,
      commandTier
    });
  }

  /**
   * Ingest a Discord user profile into the panel so it is tracked.
   * Call this whenever a user is seen for the first time or on login.
   */
  async ingestUser({
    discordId,
    username,
    displayName,
    globalName,
    avatarUrl,
    accountCreatedAt,
    guildId,
    guildName
  }) {
    return this.post("/api/users/ingest", {
      discordId,
      username,
      displayName,
      globalName,
      avatarUrl,
      accountCreatedAt,
      guildId,
      guildName
    });
  }

  /**
   * Log a user activity/command to the panel.
   */
  async logActivity({
    discordId,
    username,
    type = "command",
    command,
    guildId,
    guildName,
    serviceAccessed,
    success = true,
    metadata
  }) {
    return this.post("/api/users/activity", {
      discordId,
      username,
      type,
      command,
      guildId,
      guildName,
      serviceAccessed,
      success,
      metadata: metadata || {}
    });
  }

  /**
   * Full enforcement check — combines user blacklist, tier, and payment enforcement.
   * This is the preferred single call to make before processing any command.
   * Returns { allow, state, message, tier, warning }.
   *
   * Falls back gracefully if panel is unreachable (based on failMode).
   */
  async checkEnforcement({
    discordId,
    username,
    commandName = "unknown",
    commandTier = "basic",
    guildId,
    guildName,
    failMode = "open"
  }) {
    try {
      const result = await this.post("/api/enforcement/check", {
        discordId,
        username,
        commandName,
        commandTier,
        guildId,
        guildName
      });
      return result;
    } catch (err) {
      if (err instanceof TrhLockoutError || err.locked) {
        return { allow: false, state: "lockout", message: "TRH Development bot services are temporarily offline.", tier: "none" };
      }
      if (String(failMode).toLowerCase() === "closed") {
        return { allow: false, state: "error", message: "Unable to verify command access. Please try again shortly.", tier: "none" };
      }
      return { allow: true, state: "degraded", warning: "Panel unreachable — command allowed in degraded mode.", tier: "unknown" };
    }
  }

  /**
   * Call an owner enforcement action or query against the panel.
   * Used by ownerCommands.js for slash command handlers.
   *
   * Actions:   blacklist | unblacklist | freeze | restore | set-tier
   * Queries:   get-profile
   *
   * Requires OWNER_CONTROL_PASSWORD set as the botToken on this client instance.
   * The panel expects the x-owner-key header — pass the owner password as botToken
   * OR supply it separately via options.ownerKey.
   *
   * @param {string} action
   * @param {Object} payload
   * @param {{ ownerKey?: string }} opts
   */
  async ownerAction(action, payload, opts = {}) {
    const ownerKey = String(opts.ownerKey || this.ownerKey || "").trim();

    const actionRoutes = {
      "blacklist":    { method: "POST", path: "/api/owner/enforcement/blacklist" },
      "unblacklist":  { method: "POST", path: "/api/owner/enforcement/unblacklist" },
      "freeze":       { method: "POST", path: "/api/owner/enforcement/freeze" },
      "restore":      { method: "POST", path: "/api/owner/enforcement/restore" },
      "set-tier":     { method: "POST", path: "/api/owner/enforcement/set-tier" },
      "get-profile":  { method: "GET",  path: `/api/owner/user-profiles/${encodeURIComponent(String(payload.discordId || ""))}` }
    };

    const route = actionRoutes[action];
    if (!route) return { ok: false, error: `Unknown owner action: ${action}` };

    try {
      if (route.method === "GET") {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.defaultTimeoutMs);
        try {
          const response = await fetch(`${this.baseUrl}${route.path}`, {
            headers: { "x-owner-key": ownerKey, "x-bot-token": this.botToken },
            signal: controller.signal
          });
          return await response.json();
        } finally {
          clearTimeout(timer);
        }
      } else {
        const rawBody = JSON.stringify(payload);
        const nonce = require("crypto").randomBytes(16).toString("hex");
        const headers = this.buildHeaders(rawBody, nonce);
        headers["x-owner-key"] = ownerKey;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.defaultTimeoutMs);
        try {
          const response = await fetch(`${this.baseUrl}${route.path}`, {
            method: "POST",
            headers,
            body: rawBody,
            signal: controller.signal
          });
          return await response.json();
        } finally {
          clearTimeout(timer);
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return { ok: false, error: "Request timed out." };
      return { ok: false, error: err.message };
    }
  }
}

module.exports = {
  TrhControlPanelClient,
  TrhLockoutError
};

