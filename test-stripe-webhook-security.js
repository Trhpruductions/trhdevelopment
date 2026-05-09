#!/usr/bin/env node
"use strict";

const http = require("http");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function request(method, path, { body, headers } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const payload = body ? JSON.stringify(body) : null;

    const req = http.request(
      {
        method,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers: {
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
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
    if (payload) req.write(payload);
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

  // 1) Unsigned webhook must never succeed.
  const unsigned = await request("POST", "/api/store/webhook/stripe", {
    body: { type: "checkout.session.completed", data: { object: {} } }
  });

  if (unsigned.status === 200) {
    failed += 1;
    fail("Unsigned webhook accepted", unsigned.raw);
  } else {
    pass("Unsigned webhook rejected");
  }

  // 2) Behavior is mode-dependent and both secure outcomes are valid.
  // - Unconfigured: 400 + "not configured"
  // - Configured but invalid signature: 400 + "invalid stripe signature"
  const err = String((unsigned.body && unsigned.body.error) || "");
  const secureBranch =
    unsigned.status === 400 &&
    (err.includes("not configured") || err.includes("invalid stripe signature"));

  if (!secureBranch) {
    failed += 1;
    fail("Unexpected Stripe rejection branch", `status=${unsigned.status} error=${err}`);
  } else {
    pass("Stripe rejection branch is secure and expected");
  }

  // 3) Tampered signature should also be rejected.
  const tampered = await request("POST", "/api/store/webhook/stripe", {
    body: { id: "evt_fake", type: "invoice.payment_failed", data: { object: {} } },
    headers: { "stripe-signature": "t=1,v1=deadbeef" }
  });

  if (tampered.status === 200) {
    failed += 1;
    fail("Tampered signature accepted", tampered.raw);
  } else {
    pass("Tampered signature rejected");
  }

  if (failed > 0) {
    console.error(`\nRESULT: ${failed} Stripe security assertion(s) failed.`);
    process.exit(1);
  }

  console.log("\nRESULT: Stripe webhook security checks passed.");
  process.exit(0);
})().catch((error) => {
  console.error(`FAIL: Test execution error | ${error.message}`);
  process.exit(1);
});
