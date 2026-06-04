#!/usr/bin/env node
/**
 * cc-rtk statusline.
 * One-shot script: reads real rtk compression stats, outputs colored status line.
 * Chainable via cc-statusline.
 */
const { execSync } = require("child_process");

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

function getRtkStats() {
  try {
    const raw = execSync("rtk gain --format json", {
      encoding: "utf8", timeout: 3000, stdio: ["pipe", "pipe", "ignore"]
    });
    return JSON.parse(raw).summary;
  } catch { return null; }
}

function main() {
  const s = getRtkStats();

  if (s) {
    const parts = [
      "[" + B + "rtk" + N + "[" + G + "ON" + N + "]]",
      "cmd:" + s.total_commands,
      "-" + fmt(s.total_saved),
      "~" + Math.round(s.avg_savings_pct) + "%",
    ];

    process.stdout.write(parts.join(" | "));
  } else {
    process.stdout.write("[" + B + "rtk" + N + "[" + R + "OFF" + N + "]]");
  }
}

main();
