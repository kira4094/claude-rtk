#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const os = require('os');

const HOME = os.homedir();
const RTK_DIR = path.join(HOME, '.claude-rtk');
const SETTINGS = path.join(HOME, '.claude', 'settings.json');

const PLUGIN_NAME = 'cc-rtk@cc-rtk';
const MARKETPLACE_KEY = 'cc-rtk';

function log(m) { console.log('[cc-rtk]', m); }
function warn(m) { console.error('[cc-rtk]', m); }

function readJSON(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }
function writeJSON(p, o) { fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); }

function cmdInstall() {
  // 1. Create data directory
  fs.mkdirSync(RTK_DIR, { recursive: true });

  // 2. Register plugin in settings.json
  let s = readJSON(SETTINGS) || {};
  if (!s.enabledPlugins) s.enabledPlugins = {};
  s.enabledPlugins[PLUGIN_NAME] = true;
  if (!s.extraKnownMarketplaces) s.extraKnownMarketplaces = {};
  s.extraKnownMarketplaces[MARKETPLACE_KEY] = {
    source: { source: 'github', repo: 'kira4094/cc-rtk' }
  };
  writeJSON(SETTINGS, s);
  log('Plugin registered in settings.json');

  log('');
  log('Done! Restart Claude Code to activate the plugin.');
  log('');
  log('  IMPORTANT: You MUST restart Claude Code for the plugin to take effect.');
}

function cmdUninstall(purge) {
  let s = readJSON(SETTINGS);
  if (s) {
    if (s.enabledPlugins) delete s.enabledPlugins[PLUGIN_NAME];
    if (s.extraKnownMarketplaces) delete s.extraKnownMarketplaces[MARKETPLACE_KEY];
    writeJSON(SETTINGS, s);
    log('Plugin unregistered from settings.json');
  }
  if (purge) {
    try { fs.rmSync(RTK_DIR, { recursive: true, force: true }); log('Data deleted'); } catch {}
  }
  log('Uninstall complete. Restart Claude Code to apply changes.');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`Usage: cc-rtk <command>

Commands:
  install               Register cc-rtk plugin
  uninstall [--purge]   Unregister plugin and (with --purge) delete all data
`);
    return;
  }
  switch (args[0]) {
    case 'install': cmdInstall(); break;
    case 'uninstall': cmdUninstall(args.includes('--purge')); break;
    default: warn('Unknown command: ' + args[0]);
  }
}

main();
