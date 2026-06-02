# claude-rtk

Token optimization plugin for Claude Code — intercepts Bash commands and reduces output by 60-90% via [rtk](https://github.com/rtk-ai/rtk).

Based on [rtk](https://github.com/rtk-ai/rtk) (Apache 2.0) — this is a plugin wrapper only.

## Prerequisites

rtk binary must be installed:

```bash
curl -fsSL https://rtk.sh/install.sh | bash
```

Verify: `rtk --version`

## Install

```
/plugin marketplace add kira4094/cc-rtk
/plugin install cc-rtk              # or: cc-rtk@cc-rtk
/reload-plugins
```

## What it does

Intercepts every Bash command and pipes it through rtk's compression before sending to the LLM:

| Command | Token savings |
|---------|:------------:|
| git status/diff | 75-80% |
| grep/rg | 80% |
| cargo/npm test output | 90% |
| ls/cat | 70-80% |

## License

MIT. Plugin wrapper for [rtk](https://github.com/rtk-ai/rtk) (Apache 2.0).
