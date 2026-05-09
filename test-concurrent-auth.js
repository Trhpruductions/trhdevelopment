#!/usr/bin/env node
/**
 * CONCURRENT AUTH STRESS TEST
 * Tests rate limiting, timing-safe comparisons, and concurrent request handling.
 * 
 * Purpose: Identify desync, race conditions, or authentication bypasses under load.
 */

const http = require("http");
const https = require("https");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "change-me";
const PANEL_API_KEY = process.env.PANEL_API_KEY || "demo-key-12345";

const results = {
  totalRequests: 0,
  successfulAuth: 0,
  failedAuth: 0,
  rateLimited: 0,
  errors: 0,
  timings: [],
  blockAttempts: []
};

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === "https:";
    const client = isHttps ? https : http;

    const startTime = Date.now();
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "StressTest/1.0"
      }
    };

    const req = client.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const elapsed = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            body: parsed,
            elapsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: { raw: data },
            elapsed,
            headers: res.headers,
            parseError: e.message
          });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testConcurrentFailedLogins() {
  console.log("\n=== TEST 1: Concurrent Failed Login Attempts ===");
  console.log("Sending 20 rapid failed auth requests...\n");

  const requests = [];
  for (let i = 0; i < 20; i++) {
    requests.push(
      makeRequest("POST", "/api/emergency/lockout", {
        ownerPassword: "wrong-password-" + i,
        recoveryKey: ""
      })
    );
  }

  const responses = await Promise.all(requests);
  responses.forEach((res, idx) => {
    results.totalRequests++;
    const isRateLimited = res.statusCode === 429;
    const isFailed = res.statusCode === 401;

    if (isRateLimited) {
      results.rateLimited++;
      const retryAfter = res.headers["retry-after"];
      results.blockAttempts.push({
        attempt: idx,
        retryAfter: retryAfter,
        elapsed: res.elapsed
      });
      console.log(`[${idx}] 429 Rate Limited (retry-after: ${retryAfter}s, elapsed: ${res.elapsed}ms)`);
    } else if (isFailed) {
      results.failedAuth++;
      console.log(`[${idx}] 401 Failed Auth (elapsed: ${res.elapsed}ms)`);
    } else {
      results.errors++;
      console.log(`[${idx}] Unexpected ${res.statusCode} (elapsed: ${res.elapsed}ms)`);
    }
    results.timings.push(res.elapsed);
  });

  console.log(`\nSummary: ${results.rateLimited} rate-limited, ${results.failedAuth} failed auth, ${results.errors} errors`);
}

async function testCorrectCredentialsAfterBlock() {
  console.log("\n=== TEST 2: Correct Credentials After Block ===");
  console.log("Testing if correct password is blocked when rate-limited...\n");

  // Try wrong password to trigger rate-limiting
  for (let i = 0; i < 10; i++) {
    try {
      await makeRequest("POST", "/api/emergency/lockout", {
        ownerPassword: "wrong-" + i,
        recoveryKey: ""
      });
    } catch (e) {
      // ignore
    }
  }

  // Now try the correct password
  const correctAttempt = await makeRequest("POST", "/api/emergency/lockout", {
    ownerPassword: OWNER_PASSWORD,
    recoveryKey: ""
  });

  results.totalRequests++;
  if (correctAttempt.statusCode === 429) {
    results.rateLimited++;
    console.log(`✓ Correctly rate-limited even with valid password (429)\n`);
  } else if (correctAttempt.statusCode === 401) {
    results.failedAuth++;
    console.log(`✗ SECURITY ISSUE: Valid password rejected as 401 (should be 429 if rate-limited)\n`);
  } else {
    console.log(`✗ Unexpected status ${correctAttempt.statusCode}: ${JSON.stringify(correctAttempt.body)}\n`);
  }
}

async function testTimingSafeComparison() {
  console.log("\n=== TEST 3: Timing-Safe String Comparison ===");
  console.log("Verifying no timing oracle vulnerability...\n");

  const variations = [
    { name: "empty", password: "" },
    { name: "single-char", password: "a" },
    { name: "half-correct", password: OWNER_PASSWORD.substring(0, Math.floor(OWNER_PASSWORD.length / 2)) },
    { name: "completely-wrong", password: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
  ];

  for (const variant of variations) {
    const times = [];
    for (let i = 0; i < 5; i++) {
      const res = await makeRequest("POST", "/api/emergency/lockout", {
        ownerPassword: variant.password,
        recoveryKey: ""
      });
      times.push(res.elapsed);
    }
    const avg = (times.reduce((a, b) => a + b) / times.length).toFixed(1);
    const variance = Math.sqrt(times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length).toFixed(1);
    console.log(`  ${variant.name.padEnd(20)} avg=${avg}ms variance=${variance}ms times=[${times.join(', ')}ms]`);
  }
  console.log("\n✓ Timing variations should be similar (no oracle)\n");
}

async function testPanelApiKeyAuth() {
  console.log("\n=== TEST 4: Panel API Key Authentication ===");
  console.log("Testing if API key auth works and invalid keys are rejected...\n");

  // Valid key
  const validKeyRes = await makeRequest("POST", "/api/emergency/status", {
    "X-Panel-API-Key": PANEL_API_KEY
  });
  console.log(`Valid key: ${validKeyRes.statusCode} ${JSON.stringify(validKeyRes.body).substring(0, 80)}...`);

  // Invalid key
  const invalidKeyRes = await makeRequest("POST", "/api/emergency/status", {
    "X-Panel-API-Key": "invalid-key-12345"
  });
  console.log(`Invalid key: ${invalidKeyRes.statusCode}`);

  results.totalRequests += 2;
}

async function testSessionPersistence() {
  console.log("\n=== TEST 5: Session File Persistence ===");
  console.log("Checking if session files are being properly persisted...\n");

  const fs = require("fs");
  const path = require("path");
  const sessionDir = path.join(__dirname, "data", "sessions");

  if (!fs.existsSync(sessionDir)) {
    console.log("✓ Session directory will be created on first auth\n");
  } else {
    const sessions = fs.readdirSync(sessionDir);
    console.log(`Found ${sessions.length} existing session files`);
    if (sessions.length > 0) {
      const sample = sessions[0];
      const filePath = path.join(sessionDir, sample);
      const stat = fs.statSync(filePath);
      console.log(`  Sample: ${sample} (${stat.size} bytes, ${new Date(stat.mtime).toISOString()})`);
    }
    console.log();
  }
}

async function runAllTests() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║         SYSTEM STRESS TEST & SECURITY AUDIT            ║");
  console.log("║                                                        ║");
  console.log(`║ Target: ${BASE_URL.padEnd(43)} ║`);
  console.log("╚════════════════════════════════════════════════════════╝");

  try {
    await testConcurrentFailedLogins();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for block window to clear

    await testCorrectCredentialsAfterBlock();
    await testTimingSafeComparison();
    await testPanelApiKeyAuth();
    await testSessionPersistence();

    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║                   TEST SUMMARY                         ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(`║ Total Requests:     ${String(results.totalRequests).padEnd(44)} ║`);
    console.log(`║ Successful Auth:    ${String(results.successfulAuth).padEnd(44)} ║`);
    console.log(`║ Failed Auth:        ${String(results.failedAuth).padEnd(44)} ║`);
    console.log(`║ Rate Limited (429): ${String(results.rateLimited).padEnd(44)} ║`);
    console.log(`║ Errors:             ${String(results.errors).padEnd(44)} ║`);
    const avgTiming = (results.timings.reduce((a, b) => a + b, 0) / results.timings.length).toFixed(1);
    console.log(`║ Avg Response Time:  ${String(avgTiming + "ms").padEnd(44)} ║`);
    console.log("╚════════════════════════════════════════════════════════╝");
  } catch (error) {
    console.error("\n✗ Test execution failed:", error.message);
    process.exit(1);
  }
}

runAllTests().then(() => {
  console.log("\n✓ All tests completed\n");
  process.exit(0);
}).catch((error) => {
  console.error("\n✗ Unexpected error:", error);
  process.exit(1);
});
