#!/usr/bin/env node
"use strict";

const http = require("http");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function request(method, path, { headers } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(
      {
        method,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers: {
          ...(headers || {})
        }
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let parsed = null;
          try {
            parsed = raw ? JSON.parse(raw) : null;
          } catch {
            parsed = null;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            raw,
            body: parsed
          });
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

function pass(label) {
  console.log(`PASS: ${label}`);
}

function fail(label, detail) {
  console.error(`FAIL: ${label}${detail ? ` | ${detail}` : ""}`);
}

(async () => {
  let failed = 0;

  // 1) /api/auth/me must provide a stable auth shape.
  const me = await request("GET", "/api/auth/me");
  if (me.status !== 200 || !me.body || typeof me.body.authenticated !== "boolean") {
    failed += 1;
    fail("/api/auth/me contract invalid", `status=${me.status} body=${me.raw}`);
  } else {
    pass("/api/auth/me contract is valid");
  }

  // 2) OAuth start should redirect to one of safe destinations.
  const start = await request("GET", "/api/auth/discord/start");
  const location = String((start.headers && start.headers.location) || "");
  const safeTarget =
    start.status === 302 &&
    (
      location.startsWith("https://discord.com/oauth2/authorize?") ||
      location.includes("auth=discord-success") ||
      location.includes("auth=discord-rate-limit") ||
      location.includes("discord.com/login")
    );

  if (!safeTarget) {
    failed += 1;
    fail("OAuth start redirect target invalid", `status=${start.status} location=${location}`);
  } else {
    pass("OAuth start redirect target is safe");
  }

  // 3) Callback with bogus code/state must not authenticate silently.
  const callback = await request("GET", "/api/auth/discord/callback?code=fake&state=fake");
  const cbLocation = String((callback.headers && callback.headers.location) || "");
  const callbackSafe =
    callback.status === 302 &&
    (
      cbLocation.includes("auth=discord-failed") ||
      cbLocation.includes("auth=discord-unavailable")
    );

  if (!callbackSafe) {
    failed += 1;
    fail("OAuth callback failure handling invalid", `status=${callback.status} location=${cbLocation}`);
  } else {
    pass("OAuth callback handles invalid state safely");
  }

  if (failed > 0) {
    console.error(`\nRESULT: ${failed} OAuth integrity assertion(s) failed.`);
    process.exit(1);
  }

  console.log("\nRESULT: Discord OAuth integrity checks passed.");
  process.exit(0);
})().catch((error) => {
  console.error(`FAIL: Test execution error | ${error.message}`);
  process.exit(1);
});
