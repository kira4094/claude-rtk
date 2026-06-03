#!/usr/bin/env node
/**
 * cc-rtk stats collector.
 * PostToolUse hook — called after every Bash command.
 * Estimates token savings from rtk compression and tracks counts.
 */
const fs = require("fs");
const path = require("path");

const STATS_FILE = path.join(os.homedir(), ".rtk", ".cc-rtk-stats.json");

function readStats() {
  try { return JSON.parse(fs.readFileSync(STATS_FILE, "utf8")); } catch {
    return { cmdCount: 0, estimatedSaved: 0, totalOriginal: 0, totalCompressed: 0 };
  }
}

function writeStats(s) {
  try {
    const d = path.dirname(STATS_FILE);
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(STATS_FILE, JSON.stringify(s, null, 2) + "\n");
  } catch {}
}

// Estimate savings: assume ~75% compression for typical Bash output
// Rough: each command output averages ~8KB raw → ~2KB compressed
const AVG_RAW = 8000;
const AVG_COMPRESSED = 2000;
const EST_SAVED_PER_CMD = AVG_RAW - AVG_COMPRESSED;

const stats = readStats();
stats.cmdCount++;
stats.estimatedSaved += EST_SAVED_PER_CMD;
stats.totalOriginal += AVG_RAW;
stats.totalCompressed += AVG_COMPRESSED;
writeStats(stats);
