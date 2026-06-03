#!/usr/bin/env node
/**
 * cc-rtk register-statusline.cjs
 * Setup hook: writes our statusline.cjs into settings.json's statusLine.command.
 *
 * cc-statusline's guard detects the change, chains this as a new source,
 * and restores itself. On reinstall/upgrade the identity stays stable,
 * so guard updates the existing chain entry instead of duplicating it.
 *
 * Zero npm dependencies. Never crashes, always exits 0.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const SETTINGS_PATH = path.join(os.homedir(), ".claude", "settings.json");
const STATUSLINE_PATH = path.join(__dirname, "statusline.cjs");
const CMD = `node "${STATUSLINE_PATH}"`;

try {
  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  const current = settings.statusLine?.command || "";

  // Only write if ours isn't already there
  if (!current.includes("cc-rtk") && !current.includes(STATUSLINE_PATH)) {
    settings.statusLine = { type: "command", command: CMD };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
  }
} catch {
  // settings.json missing or invalid — skip silently
}
