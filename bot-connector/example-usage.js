const { TrhControlPanelClient } = require("./trhControlPanelClient");
const { enforceCommand, createLockoutGuard } = require("./discordCommandGuard");

const panelClient = new TrhControlPanelClient({
  baseUrl: process.env.PANEL_BASE_URL || "http://localhost:3000",
  botToken: process.env.BOT_WS_TOKEN || "",
  signingSecret: process.env.BOT_SIGNING_SECRET || ""
});

// Optional: start polling so the bot gets notified of lockout changes without
// waiting for the next command attempt.
panelClient.startLockoutPolling(
  (status) => {
    console.warn(`[TRH] Lockout activated (level=${status.level}) — blocking all commands.`);
  },
  () => {
    console.log("[TRH] Lockout lifted — commands resuming.");
  },
  10000 // poll every 10s
);

// Optional: create a pre-bound guard with fail-closed for premium commands.
const premiumGuard = createLockoutGuard(panelClient, { commandTier: "premium", failMode: "closed" });

async function runExample() {
  await panelClient.sendTelemetry({
    botOnline: true,
    guildCount: 42,
    usersServed: 150003,
    economyBalance: 980120
  });

  await panelClient.sendEconomyTransaction({
    txId: `txn-${Date.now()}-daily`,
    delta: 250,
    reason: "daily_reward"
  });

  const mockInteraction = {
    commandName: "daily",
    user: {
      id: "1234567890",
      username: "buyer",
      discriminator: "1234"
    },
    member: {
      email: "buyer@example.com"
    },
    deferred: false,
    replied: false,
    async reply(payload) {
      console.log("Mock reply:", payload.content);
    },
    async followUp(payload) {
      console.log("Mock followUp:", payload.content);
    }
  };

  // --- Standard enforcement (fail-open on network error) ---
  const gate = await enforceCommand(mockInteraction, panelClient, {
    commandTier: "premium"
  });

  if (!gate.allow) {
    console.log("Command blocked:", gate.enforcement && gate.enforcement.state);
    return;
  }

  if (gate.warning) {
    console.log("Warning from enforcement:", gate.warning);
  }

  console.log("Command allowed by enforcement.");

  // --- Pre-bound premium guard example ---
  const gate2 = await premiumGuard(mockInteraction);
  if (!gate2.allow) {
    console.log("Premium guard blocked command.");
    return;
  }

  console.log("TRH panel sync complete.");
}

runExample()
  .catch((error) => {
    console.error("TRH panel sync failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    panelClient.stopLockoutPolling();
  });

