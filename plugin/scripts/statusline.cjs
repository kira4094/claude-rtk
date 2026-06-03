#!/usr/bin/env node
const os = require("os");
/**
 * cc-rtk statusline.
 * One-shot script: reads stats file, outputs colored status line.
 * Chainable via cc-statusline.
 */
const fs = require("fs");
const path = require("path");

const STATS_FILE = path.join(os.homedir(), ".rtk", ".cc-rtk-stats.json");

// ANSI colors
const B = "\x1b[34m";  // blue
const G = "\x1b[32m";  // green
const N = "\x1b[0m";   // reset

function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "k";
  return String(n);
}

function main() {
  try {
    const s = JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));

    const parts = [
      "[" + B + "rtk" + N + "[" + G + "active" + N + "]]",
      "cmd:" + s.cmdCount,
      "-" + fmt(s.estimatedSaved),
    ];

    if (s.totalOriginal > 0) {
      const ratio = Math.round((1 - s.totalCompressed / s.totalOriginal) * 100);
      parts.push("~" + ratio + "%");
    }

    process.stdout.write(parts.join(" | "));
  } catch {
    // rtk installed but no stats yet
    process.stdout.write("[" + B + "rtk" + N + "[" + G + "active" + N + "]]");
  }
}

main();
