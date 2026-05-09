#!/usr/bin/env node
/**
 * EMERGENCY LOCKOUT SYSTEM STRESS TEST
 * Tests lockout activation, restoration, and edge cases under concurrent load.
 * 
 * Purpose: Verify emergency system integrity, no desync, atomic transitions.
 */

const http = require("http");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "change-me";
const RECOVERY_KEY = process.env.EMERGENCY_RECOVERY_KEY || "";

const testResults = {
  passed: 0,
  failed: 0,
  issues: []
};

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data),
            elapsed: Date.now()
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: { raw: data },
            elapsed: Date.now()
          });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testLockoutActivation() {
  console.log("\n=== TEST 1: Lockout Activation ===");
  
  const res = await makeRequest("POST", "/api/emergency/lockout", {
    ownerPassword: OWNER_PASSWORD,
    recoveryKey: RECOVERY_KEY || undefined,
    level: "lockout",
    silentMode: false
  });

  if (res.statusCode === 200 && res.body.ok) {
    testResults.passed++;
    console.log("✓ Lockout activated successfully");
    console.log(`  Level: ${res.body.level}`);
    console.log(`  Sessions revoked: ${res.body.sessionsRevoked}`);
    console.log(`  WS clients kicked: ${res.body.wsClientsKicked}`);
    return true;
  } else {
    testResults.failed++;
    testResults.issues.push(`Lockout activation failed: ${res.statusCode} ${JSON.stringify(res.body)}`);
    console.log(`✗ Failed with status ${res.statusCode}`);
    return false;
  }
}

async function testLockoutStatus() {
  console.log("\n=== TEST 2: Lockout Status Check (Owner Access) ===");
  
  // Need owner session to see full details; public endpoint returns limited info
  const res = await makeRequest("GET", "/api/emergency/status", null);

  if (res.statusCode === 200) {
    if (res.body.lockout) {
      // Owner-authenticated response includes lockout details
      testResults.passed++;
      console.log("✓ Lockout status accessible");
      console.log(`  Active: ${res.body.lockout.active}`);
      console.log(`  Level: ${res.body.lockout.level || "none"}`);
      return true;
    } else if (res.body.active !== undefined) {
      // Public response for active lockout
      testResults.passed++;
      console.log("✓ Public lockout status accessible");
      console.log(`  Active: ${res.body.active}`);
      return true;
    } else {
      testResults.failed++;
      testResults.issues.push(`Status response missing lockout info`);
      console.log(`✗ Response missing lockout property`);
      return false;
    }
  } else {
    testResults.failed++;
    testResults.issues.push(`Status check failed: ${res.statusCode}`);
    console.log(`✗ Failed: ${res.statusCode}`);
    return false;
  }
}

async function testRestoration() {
  console.log("\n=== TEST 3: Lockout Restoration ===");
  
  const res = await makeRequest("POST", "/api/emergency/restore", {
    ownerPassword: OWNER_PASSWORD,
    recoveryKey: RECOVERY_KEY || undefined
  });

  if (res.statusCode === 200 && res.body.restored) {
    testResults.passed++;
    console.log("✓ Lockout restored successfully");
    console.log(`  Previous level: ${res.body.previousLevel}`);
    return true;
  } else {
    testResults.failed++;
    testResults.issues.push(`Restoration failed: ${res.statusCode}`);
    console.log(`✗ Failed: ${res.statusCode}`);
    return false;
  }
}

async function testMultipleLevels() {
  console.log("\n=== TEST 4: Multiple Lockout Levels ===");
  
  const levels = ["lockout", "shutdown", "nuclear"];
  
  for (const level of levels) {
    // Activate
    const activateRes = await makeRequest("POST", "/api/emergency/lockout", {
      ownerPassword: OWNER_PASSWORD,
      level: level
    });

    if (activateRes.statusCode === 200) {
      // Verify (may not have owner session, so check status endpoint response)
      const statusRes = await makeRequest("GET", "/api/emergency/status", null);
      const lockoutLevel = statusRes.body.lockout?.level || statusRes.body.level;
      
      if (lockoutLevel === level) {
        testResults.passed++;
        console.log(`✓ Level "${level}" activated and verified`);
      } else {
        testResults.failed++;
        testResults.issues.push(`Level mismatch: activated ${level}, got ${lockoutLevel}`);
        console.log(`✗ Level mismatch for "${level}"`);
      }

      // Restore
      const restoreRes = await makeRequest("POST", "/api/emergency/restore", {
        ownerPassword: OWNER_PASSWORD
      });
      
      if (restoreRes.statusCode === 200) {
        testResults.passed++;
        console.log(`✓ Level "${level}" restored`);
      } else {
        testResults.failed++;
        console.log(`✗ Failed to restore level "${level}"`);
      }
    } else {
      testResults.failed++;
      console.log(`✗ Failed to activate level "${level}": ${activateRes.statusCode}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function testWrongCredentialsRejected() {
  console.log("\n=== TEST 5: Wrong Credentials Rejection ===");
  
  const res = await makeRequest("POST", "/api/emergency/lockout", {
    ownerPassword: "wrong-password-123",
    level: "lockout"
  });

  if (res.statusCode === 401) {
    testResults.passed++;
    console.log("✓ Wrong credentials correctly rejected (401)");
  } else {
    testResults.failed++;
    testResults.issues.push(`Wrong credentials not rejected: got ${res.statusCode}`);
    console.log(`✗ Expected 401, got ${res.statusCode}`);
  }
}

async function testSilentMode() {
  console.log("\n=== TEST 6: Silent Mode Flag ===");
  
  const res = await makeRequest("POST", "/api/emergency/lockout", {
    ownerPassword: OWNER_PASSWORD,
    level: "lockout",
    silentMode: true
  });

  if (res.statusCode === 200 && res.body.silentMode === true) {
    testResults.passed++;
    console.log("✓ Silent mode activated correctly");
    
    // Restore
    await makeRequest("POST", "/api/emergency/restore", {
      ownerPassword: OWNER_PASSWORD
    });
  } else {
    testResults.failed++;
    console.log(`✗ Silent mode failed`);
  }
}

async function testConcurrentStatusChecks() {
  console.log("\n=== TEST 7: Concurrent Status Checks ===");
  
  // Activate lockout
  await makeRequest("POST", "/api/emergency/lockout", {
    ownerPassword: OWNER_PASSWORD,
    level: "lockout"
  });

  // Fire 10 concurrent status checks
  const promises = Array(10).fill(null).map(() =>
    makeRequest("GET", "/api/emergency/status", null)
  );

  const results = await Promise.all(promises);
  const allActive = results.every(r => 
    (r.body.lockout && r.body.lockout.active) || 
    (r.body.active === true)
  );
  
  if (allActive) {
    testResults.passed++;
    console.log(`✓ All 10 concurrent checks reported lockout active`);
  } else {
    testResults.failed++;
    const inactiveCount = results.filter(r => 
      !(r.body.lockout?.active || r.body.active === true)
    ).length;
    testResults.issues.push(`Lockout state desync: ${inactiveCount}/10 reported inactive`);
    console.log(`✗ State desync detected: ${inactiveCount}/10 reported inactive`);
  }

  // Restore
  await makeRequest("POST", "/api/emergency/restore", {
    ownerPassword: OWNER_PASSWORD
  });
}

async function runAllTests() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║      EMERGENCY LOCKOUT SYSTEM STRESS TEST              ║");
  console.log("║                                                        ║");
  console.log(`║ Target: ${BASE_URL.padEnd(43)} ║`);
  console.log("╚════════════════════════════════════════════════════════╝");

  try {
    await testLockoutActivation();
    await testLockoutStatus();
    await testRestoration();
    await testMultipleLevels();
    await testWrongCredentialsRejected();
    await testSilentMode();
    await testConcurrentStatusChecks();

    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║                   TEST RESULTS                         ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(`║ Passed:  ${String(testResults.passed).padEnd(45)} ║`);
    console.log(`║ Failed:  ${String(testResults.failed).padEnd(45)} ║`);
    
    if (testResults.issues.length > 0) {
      console.log("╠════════════════════════════════════════════════════════╣");
      console.log("║ ISSUES DETECTED:                                       ║");
      testResults.issues.forEach(issue => {
        const wrapped = issue.substring(0, 52);
        console.log(`║ • ${wrapped.padEnd(52)} ║`);
      });
    }
    
    console.log("╚════════════════════════════════════════════════════════╝");

    if (testResults.failed === 0) {
      console.log("\n✓ ALL TESTS PASSED\n");
    } else {
      console.log(`\n✗ ${testResults.failed} TEST(S) FAILED\n`);
    }
  } catch (error) {
    console.error("\n✗ Test execution failed:", error.message);
    process.exit(1);
  }
}

runAllTests().then(() => {
  process.exit(testResults.failed > 0 ? 1 : 0);
}).catch((error) => {
  console.error("\n✗ Unexpected error:", error);
  process.exit(1);
});
