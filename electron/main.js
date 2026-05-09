"use strict";

/**
 * TRH Development Control Panel — Electron Main Process
 *
 * Starts the Express server in-process, then opens a BrowserWindow pointed at
 * localhost so the existing web UI renders as a native desktop application.
 */

const { app, BrowserWindow, Menu, Tray, nativeImage, dialog, shell } = require("electron");
const path = require("path");
const fs   = require("fs");

// ── Single-instance lock ──────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

// ── State ─────────────────────────────────────────────────────────────────────
let mainWindow = null;
let tray       = null;
app.isQuitting = false;

// ── Path resolution ───────────────────────────────────────────────────────────
//   - In dev:      __dirname = .../electron/,  APP_ROOT = project root
//   - In packaged: app.isPackaged = true,       APP_ROOT = resources/app/
const APP_ROOT  = app.isPackaged
  ? path.join(process.resourcesPath, "app")
  : path.join(__dirname, "..");

const ICON_PNG  = path.join(__dirname, "icon.png");
const SERVER_PORT = Number(process.env.PORT || 3000);

// ── Working directory — must be set BEFORE requiring server.js ────────────────
//   server.js uses paths like "./data/users.json"; chdir makes them resolve
//   correctly whether we're in dev or installed via NSIS.
process.chdir(APP_ROOT);
process.env.PORT = String(SERVER_PORT);

// ── Ensure data/sessions directory exists (needed on first run) ───────────────
const dataDir = path.join(APP_ROOT, "data", "sessions");
fs.mkdirSync(dataDir, { recursive: true });

// ── Start Express server ──────────────────────────────────────────────────────
function startServer() {
  return new Promise((resolve, reject) => {
    let serverModule;
    try {
      serverModule = require(path.join(APP_ROOT, "server.js"));
    } catch (err) {
      return reject(new Error(`Failed to load server.js: ${err.message}`));
    }

    const httpServer = serverModule && serverModule.server;
    if (!httpServer || typeof httpServer.listen !== "function") {
      return reject(new Error(
        "server.js did not export a valid HTTP server. " +
        "Ensure the bottom of server.js has: if (require.main === module) { server.listen(...) } else { module.exports = { server }; }"
      ));
    }

    httpServer.listen(SERVER_PORT, "127.0.0.1", (err) => {
      if (err) return reject(err);
      console.log(`[electron] Server listening on http://127.0.0.1:${SERVER_PORT}`);
      resolve();
    });

    httpServer.on("error", (bindErr) => {
      if (bindErr.code === "EADDRINUSE") {
        // Port already taken — likely a standalone server; just connect to it
        console.warn(`[electron] Port ${SERVER_PORT} in use — connecting to existing server`);
        resolve();
      } else {
        reject(bindErr);
      }
    });
  });
}

// ── BrowserWindow ─────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width:      1440,
    height:     940,
    minWidth:   1024,
    minHeight:  700,
    title:      "TRH Development Control Panel",
    icon:       ICON_PNG,
    backgroundColor: "#0f1619",
    show:       false,  // shown after "ready-to-show" to avoid blank flash
    webPreferences: {
      nodeIntegration:           false,
      contextIsolation:          true,
      webSecurity:               true,
      allowRunningInsecureContent: false
    }
  });

  // Remove native menu bar (the panel has its own UI)
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(`http://127.0.0.1:${SERVER_PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // External links → system browser, not inside Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(`http://127.0.0.1:${SERVER_PORT}`)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Close button hides to tray; only app.isQuitting actually closes
  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ── System tray ───────────────────────────────────────────────────────────────
function createTray() {
  const img = nativeImage.createFromPath(ICON_PNG).resize({ width: 16, height: 16 });
  tray = new Tray(img);
  tray.setToolTip("TRH Development Control Panel");

  const ctxMenu = Menu.buildFromTemplate([
    {
      label: "Open Control Panel",
      click() {
        if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
        else createWindow();
      }
    },
    { type: "separator" },
    {
      label: "Quit TRH Control Panel",
      click() {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(ctxMenu);
  tray.on("double-click", () => {
    if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
    else createWindow();
  });
}

// ── Second instance — focus existing window ───────────────────────────────────
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized() || !mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();
  }
});

// ── App ready ─────────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
    createTray();
  } catch (err) {
    dialog.showErrorBox(
      "TRH Control Panel — Startup Error",
      `Could not start the server:\n\n${err.message}\n\nPlease restart the application or contact support.`
    );
    app.quit();
  }
});

// Keep process alive when all windows are closed (live in tray)
app.on("window-all-closed", () => { /* intentionally empty */ });

app.on("activate", () => {
  if (!mainWindow) createWindow();
  else mainWindow.show();
});
