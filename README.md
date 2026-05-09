# TRH Development Bot Control Panel

This project has been placed in this folder and is ready to run:

- d:\Trh development controle pannel

## What is included

- Express backend API
- WebSocket live updates
- Dashboard UI for bot status, guild count, users served, and economy balance
- Action log feed
- Unified logo path for app branding and shortcut icons

## App logo setup

Place your official logo file here:

- `public/assets/trh-logo.svg` (default fallback now included)
- or `public/assets/trh-logo.png` (optional custom override if you switch references)

This single file is used by:

- Header app logo in the control panel
- Browser tab icon (favicon)
- Apple touch icon
- PWA/web shortcut icons via `public/site.webmanifest`

## Run locally

1. Open terminal in this folder.
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` and set at least:
   - `PANEL_ADMIN_PASSWORD`
   - `OWNER_CONTROL_PASSWORD` (or it falls back to panel password)
4. Start panel:
   - `npm run dev`
5. Open:
   - `http://localhost:3000`

### Windows one-command startup

- `npm run start:panel`

This runs `scripts/start-panel.ps1`, loads `.env` into process env vars, validates required auth secrets, and starts the server.

- `npm run start:panel:noenv`

This skips loading `.env` and uses only current shell env vars.

## Release build (Windows)

Use the release script to produce a versioned installer bundle with checksums and GitHub release notes in one run.

1. Build a specific version:
   - `npm run release:build -- -Version 1.0.2`
2. Build with commit range notes from a prior tag:
   - `npm run release:build -- -Version 1.0.3 -FromTag v1.0.2`

Output is generated in a versioned folder:

- `dist-release-v<version>/TRH Development Control Panel Setup <version>.exe`
- `dist-release-v<version>/TRH Development Control Panel Setup <version>.exe.blockmap`
- `dist-release-v<version>/SHA256SUMS.txt`
- `dist-release-v<version>/GITHUB_RELEASE_v<version>.md`

## GitHub release publish (Windows)

After building artifacts, publish from CLI with one command:

1. Requirements:
   - `gh` installed and authenticated (`gh auth login`)
   - `origin` remote configured
   - release tag exists (`v<version>`)
2. Publish:
   - `npm run release:publish -- -Version 1.0.3`
3. Optional flags:
   - draft release: `npm run release:publish -- -Version 1.0.3 -Draft`
   - prerelease: `npm run release:publish -- -Version 1.0.3 -Prerelease`
   - explicit repo: `npm run release:publish -- -Version 1.0.3 -Repo owner/repo`

## Security setup

- `PANEL_ADMIN_PASSWORD`: Required for operator UI login session.
- `OWNER_CONTROL_PASSWORD`: Required for owner elevation flow.
- `PANEL_SESSION_SECRET`: Required for secure session cookies.
- `PANEL_API_KEY`: Optional fallback for programmatic panel access.
- `BOT_WS_TOKEN`: Optional bot token for ingest routes.
- `BOT_SIGNING_SECRET`: Recommended HMAC secret for signed bot webhook ingestion.
- `LOGIN_WINDOW_MS`, `LOGIN_MAX_ATTEMPTS`, `LOGIN_BLOCK_MS`: Brute-force login lockout controls.
- `SESSION_STORE_RETRIES`, `SESSION_STORE_REAP_INTERVAL_SECONDS`: Session file-store stability controls.

## Discord login setup

- The Control Center includes a `Login With Discord` button.
- If Discord OAuth variables are configured, login flow uses Discord OAuth and maps the Discord user ID into the operator session.
- If OAuth is not configured:
   - in non-production mode, the button can log directly into the dashboard via a dev fallback session
   - in production mode, the button falls back to `https://discord.com/login`

Required env vars for OAuth mode:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_OAUTH_REDIRECT_URI` (must exactly match Discord developer portal redirect URL)

Optional:

- `DISCORD_FALLBACK_LOGIN_URL` (default: `https://discord.com/login`)
- `ALLOW_DEV_DISCORD_FALLBACK_LOGIN` (default: `true`, non-production only)

## API routes

- `GET /api/health`
- `GET /api/state`
- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/metrics` (operator session or `x-panel-api-key`)
- `GET /api/bot/economy/ledger?limit=20` (operator session or `x-panel-api-key`)
- `GET /api/audit/export` (operator session or `x-panel-api-key`)
- `POST /api/command` (operator session or `x-panel-api-key`)
- `POST /api/bot/telemetry` (supports `x-bot-token` when `BOT_WS_TOKEN` is set)
- `POST /api/bot/economy/transaction` (supports `x-bot-token` when `BOT_WS_TOKEN` is set)
- `GET /api/store/catalog`
- `POST /api/store/checkout`
- `GET /api/store/orders?limit=30` (operator session or `x-panel-api-key`)
- `GET /api/store/metrics` (operator session or `x-panel-api-key`)
- `GET /api/store/orders/export?format=csv` (operator session or `x-panel-api-key`)
- `POST /api/store/orders/:orderId/provision` (operator session or `x-panel-api-key`)
- `POST /api/store/webhook/stripe`
- `GET /api/store/order-status?orderId=...&email=...`
- `GET /api/client/control-status?email=...&discord=...`
- `POST /api/client/command-check` (bot-signed request recommended)
- `POST /api/owner/auth/elevate` (owner-only panel elevation)
- `GET /api/owner/overview` (owner-only)
- `POST /api/owner/system/action` (owner-only)
- `POST /api/owner/clients/:clientId/action` (owner-only)
- `POST /api/owner/clients/:clientId/financials` (owner-only)

Command payload example:

```json
{
  "command": "setGuildCount",
  "value": 25
}
```

Bot telemetry example:

```json
{
   "botOnline": true,
   "guildCount": 47,
   "usersServed": 120004,
   "economyBalance": 905500
}
```

Economy transaction example:

```json
{
   "txId": "txn-2026-05-05-0001",
   "delta": 250,
   "reason": "daily_reward"
}
```

## Notes

- Panel state is persisted in `data/panel-state.json` and survives restarts.
- Economy transaction `txId` values are deduplicated to reduce replay/duplicate credit issues.
- Economy ledger history is persisted and available via API for operator review.
- Economy transaction ingest includes basic per-IP rate limiting and strict tx validation.
- Full audit snapshots can be exported as JSON from the dashboard or API.
- Operator sessions are persisted in `data/sessions` and survive process restarts.
- Repeated failed operator logins are throttled and temporarily blocked.
- Commerce/order state is persisted in `data/commerce-state.json`.
- Store supports `mock` payment mode out of the box and `stripe` mode when Stripe env vars are configured.
- Customer self-service order lookup is available using order ID and purchase email.

## Payment Play System

The dashboard now includes a full bot purchasing flow:

- Public Bot Marketplace with package catalog and checkout creation
- `mock` checkout for immediate local testing (instant paid + ready)
- `stripe` checkout session creation (when Stripe keys and price IDs are configured)
- Operator order panel for provisioning purchased bots
- Stripe webhook endpoint to mark orders paid automatically

## Bot connector module

Use the included Node connector in `bot-connector/trhControlPanelClient.js` from your Discord bot runtime.

Minimal example:

```js
const { TrhControlPanelClient } = require("./bot-connector/trhControlPanelClient");

const panelClient = new TrhControlPanelClient({
   baseUrl: process.env.PANEL_BASE_URL,
   botToken: process.env.BOT_WS_TOKEN,
   signingSecret: process.env.BOT_SIGNING_SECRET
});

await panelClient.sendTelemetry({
   botOnline: true,
   guildCount: client.guilds.cache.size,
   usersServed: 123456,
   economyBalance: 777000
});

await panelClient.sendEconomyTransaction({
   txId: `txn-${Date.now()}-reward`,
   delta: 250,
   reason: "daily_reward"
});
```

Runnable sample: `bot-connector/example-usage.js`

### Command enforcement middleware (Discord runtime)

Use `bot-connector/discordCommandGuard.js` to enforce payment and owner controls on every command.

```js
const { TrhControlPanelClient } = require("./bot-connector/trhControlPanelClient");
const { enforceCommand } = require("./bot-connector/discordCommandGuard");

const panelClient = new TrhControlPanelClient({
   baseUrl: process.env.PANEL_BASE_URL,
   botToken: process.env.BOT_WS_TOKEN,
   signingSecret: process.env.BOT_SIGNING_SECRET
});

client.on("interactionCreate", async (interaction) => {
   if (!interaction.isChatInputCommand()) {
      return;
   }

   const isPremium = ["tickets", "economy", "advanced"].includes(interaction.commandName);
   const gate = await enforceCommand(interaction, panelClient, {
      commandTier: isPremium ? "premium" : "basic"
   });

   if (!gate.allow) {
      return;
   }

   // Command executes only if enforcement allows it.
});
```

This provides hard lock behavior for maintenance, shutdown, restricted, and suspended states before command execution.
