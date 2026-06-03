# claude-rtk ⚡

**Token optimization + statusLine for Claude Code.** Saves 60–90% on every Bash output, and now shows live stats in your status bar.

```
[rtk[active]] | cmd:42 | -252k | ~75%
```

Works with [cc-statusline](https://github.com/kira4094/cc-statusline) — drop it in the box and it plays nice with claude-hud and anything else you've got down there.

## What it does

Two things, one plugin:

### 1. Token compression

Every Bash command gets piped through [rtk](https://github.com/rtk-ai/rtk) before reaching the LLM. All that noisy output? Gone.

| Command | Token savings |
|---------|:------------:|
| git status/diff | 75-80% |
| grep/rg | 80% |
| cargo/npm test output | 90% |
| ls/cat | 70-80% |

### 2. Live stats in your statusLine

Yeah, it counts. Every command intercepted, every token saved — right there in your status bar.

```
[rtk[active]] | cmd:127 | -762k | ~75%
```

Blue **rtk**, green **active**, rest is pure data. No fluff.

Works standalone or as a chain source in cc-statusline — the aggregator picks it up automatically.

## Prerequisites

```bash
curl -fsSL https://rtk.sh/install.sh | bash
rtk --version
```

## Install

```bash
/plugin marketplace add kira4094/cc-rtk
/plugin install cc-rtk              # or: cc-rtk@cc-rtk
/reload-plugins
```

That's it. Every Bash command from now on gets compressed and counted.

## Uninstall

```bash
/plugin uninstall cc-rtk
/reload-plugins
```

## See it in action

Pair with [cc-statusline](https://github.com/kira4094/cc-statusline) to get the full picture — claude-hud, cc-rtk, and whatever else you throw in, all in one status bar.

```
[↪▨] [deepseek-v4-flash[1M]] ██████░░░░ 55% | git:(master*) | tok: ...
 ⏵⏵ accept edits on (shift+tab to cycle)
[rtk[active]] | cmd:127 | -762k | ~75%
```

## License

MIT. Plugin wrapper for [rtk](https://github.com/rtk-ai/rtk) (Apache 2.0).
