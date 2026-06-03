#!/usr/bin/env node
/**
 * cc-rtk statusline.
 * One-shot script: reads per-session or global stats, outputs colored status line.
 * Chainable via cc-statusline.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const RTK_DIR = path.join(os.homedir(), ".rtk");
const STATS_DIR = path.join(RTK_DIR, "stats");
const GLOBAL_FILE = path.join(RTK_DIR, ".cc-rtk-stats.json");
const CUR_SESSION_FILE = path.join(os.homedir(), ".claude-memory", "current-session");

// ANSI colors
const B = "\x1b[34m";  // blue
const G = "\x1b[32m";  // green (ON)
const R = "\x1b[31m";  // red (OFF)
const N = "\x1b[0m";   // reset

function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "k";
  return String(n);
}

function readStats(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function getCurrentSessionId() {
  try {
    return fs.readFileSync(CUR_SESSION_FILE, "utf8").trim();
  } catch { return null; }
}

function main() {
  // Prefer per-session stats, fall back to global
  let s = null;
  const sid = getCurrentSessionId();
  if (sid) {
    const sesFile = path.join(STATS_DIR, sid + ".json");
    s = readStats(sesFile);
  }
  if (!s) s = readStats(GLOBAL_FILE);

  if (s) {
    const parts = [
      "[" + B + "rtk" + N + "[" + G + "ON" + N + "]]",
      "cmd:" + s.cmdCount,
      "-" + fmt(s.estimatedSaved),
    ];

    if (s.totalOriginal > 0) {
      const ratio = Math.round((1 - s.totalCompressed / s.totalOriginal) * 100);
      parts.push("~" + ratio + "%");
    }

    if (sid) parts.push("ses");
    process.stdout.write(parts.join(" | "));
  } else {
    process.stdout.write("[" + B + "rtk" + N + "[" + R + "OFF" + N + "]]");
  }
}

main();
