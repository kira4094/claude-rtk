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
const G = "\x1b[32m";  // green
const C = "\x1b[36m";  // cyan
const Y = "\x1b[33m";  // yellow
const M = "\x1b[35m";  // magenta
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
      G + "rtk:active" + N,
      C + "cmd:" + s.cmdCount + N,
      Y + "-" + fmt(s.estimatedSaved) + N,
    ];

    if (s.totalOriginal > 0) {
      const ratio = Math.round((1 - s.totalCompressed / s.totalOriginal) * 100);
      parts.push(M + "~" + ratio + "%" + N);
    }

    process.stdout.write(parts.join(" · "));
  } catch {
    // rtk installed but no stats yet
    process.stdout.write(G + "rtk:active" + N);
  }
}

main();
