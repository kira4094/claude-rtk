#!/usr/bin/env node
/**
 * cc-rtk stats collector.
 * PostToolUse hook — called after every Bash command.
 * Estimates token savings from rtk compression, tracked per-session.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const RTK_DIR = path.join(os.homedir(), ".rtk");
const STATS_DIR = path.join(RTK_DIR, "stats");
const GLOBAL_FILE = path.join(RTK_DIR, ".cc-rtk-stats.json");
const AVG_RAW = 8000;
const AVG_COMPRESSED = 2000;
const EST_SAVED_PER_CMD = AVG_RAW - AVG_COMPRESSED;

function ensureDir(d) { try { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); } catch {} }

function readStats(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch {
    return { cmdCount: 0, estimatedSaved: 0, totalOriginal: 0, totalCompressed: 0 };
  }
}

function writeStats(p, s) {
  try { ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(s, null, 2) + "\n"); } catch {}
}

// Extract session ID from hook stdin payload
function getSessionId() {
  try {
    const buf = fs.readFileSync(0, "utf8");
    const payload = JSON.parse(buf.trim());
    const tp = payload.transcript_path || payload.transcriptPath || "";
    if (tp) {
      const base = path.basename(tp, ".jsonl");
      return base.replace(/[^\w\-]/g, "_").slice(0, 64) || null;
    }
  } catch {}
  return null;
}

const sessionId = getSessionId();
const inc = { cmdCount: 1, estimatedSaved: EST_SAVED_PER_CMD, totalOriginal: AVG_RAW, totalCompressed: AVG_COMPRESSED };

// Always update global cumulative stats
const global = readStats(GLOBAL_FILE);
global.cmdCount += inc.cmdCount;
global.estimatedSaved += inc.estimatedSaved;
global.totalOriginal += inc.totalOriginal;
global.totalCompressed += inc.totalCompressed;
writeStats(GLOBAL_FILE, global);

// Also update per-session stats if we have a session ID
if (sessionId) {
  const sesFile = path.join(STATS_DIR, sessionId + ".json");
  const ses = readStats(sesFile);
  ses.cmdCount += inc.cmdCount;
  ses.estimatedSaved += inc.estimatedSaved;
  ses.totalOriginal += inc.totalOriginal;
  ses.totalCompressed += inc.totalCompressed;
  writeStats(sesFile, ses);
}
