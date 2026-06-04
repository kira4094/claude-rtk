#!/usr/bin/env node
/**
 * cc-rtk statusline.
 * One-shot script: reads per-session stats + real compression ratio.
 * Chainable via cc-statusline.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const STATS_DIR = path.join(os.homedir(), ".rtk", "stats");
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

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function getRealRatio() {
  try {
    const raw = execSync("rtk gain --format json", {
      encoding: "utf8", timeout: 3000, stdio: ["pipe", "pipe", "ignore"]
    });
    return JSON.parse(raw).summary.avg_savings_pct;
  } catch { return null; }
}

function getSessionStats() {
  try {
    const sid = fs.readFileSync(CUR_SESSION_FILE, "utf8").trim();
    if (!sid) return null;
    return readJson(path.join(STATS_DIR, sid + ".json"));
  } catch { return null; }
}

function main() {
  const ses = getSessionStats();
  const ratio = getRealRatio();

  if (ses) {
    const parts = [
      "[" + B + "rtk" + N + "[" + G + "ON" + N + "]]",
      "cmd:" + ses.cmdCount,
      "-" + fmt(ses.estimatedSaved),
      "~" + (ratio !== null ? Math.round(ratio) + "%" : Math.round((1 - ses.totalCompressed / ses.totalOriginal) * 100) + "%"),
    ];
    process.stdout.write(parts.join(" | "));
  } else {
    process.stdout.write("[" + B + "rtk" + N + "[" + R + "OFF" + N + "]]");
  }
}

main();
