# claude-rtk ⚡

[English](README.md)

[![GitHub stars](https://img.shields.io/github/stars/kira4094/cc-rtk?style=social)](https://github.com/kira4094/cc-rtk) <sub>⭐ 去 GitHub 点个 Star 吧！</sub>

**Token 优化 + statusLine 统计。** 每条 Bash 命令输出节省 60–90%，还能在状态栏看到实时数据。

```
[rtk[active]] | cmd:42 | -252k | ~75%
```

配合 [cc-statusline](https://github.com/kira4094/cc-statusline) 食用更佳 —— 扔进盒子里，和 claude-hud 以及其他插件和平共处。

## 它能干嘛

一个插件，两件事：

### 1. Token 压缩

每条 Bash 命令都被 [rtk](https://github.com/rtk-ai/rtk) 拦截压缩后才发给 LLM。那些一堆乱七八糟的输出？没了。

| 命令 | Token 节省 |
|------|:----------:|
| git status/diff | 75-80% |
| grep/rg | 80% |
| cargo/npm test 输出 | 90% |
| ls/cat | 70-80% |

### 2. 状态栏实时统计

嗯，它会计数。拦截了多少命令、省了多少 token —— 就在底部状态栏里。

```
[rtk[active]] | cmd:127 | -762k | ~75%
```

蓝色 **rtk**，绿色 **active**，数据部分用默认色。不花哨。

可以单独用，也可以作为 cc-statusline 的链来源 —— 聚合器会自动识别。

## 前提条件

```bash
curl -fsSL https://rtk.sh/install.sh | bash
rtk --version
```

## 安装

两种方式，选一种：

### 方式一：插件安装（推荐）

```bash
/plugin marketplace add kira4094/cc-rtk
/plugin install cc-rtk
/reload-plugins
```

重启 Claude Code，搞定。

### 方式二：npm 安装

```bash
npm install -g cc-rtk
cc-rtk install
```

**重要：装完后必须重启 Claude Code，插件才会生效。**

## 卸载

### 插件方式卸载
```bash
/plugin uninstall cc-rtk
/reload-plugins
```

### npm 方式卸载
```bash
cc-rtk uninstall --purge   # 卸载插件 + 删除数据
npm uninstall -g cc-rtk
```

重启 Claude Code。

## 看效果

配合 [cc-statusline](https://github.com/kira4094/cc-statusline) 看完整效果 —— claude-hud、cc-rtk、还有你扔进去的其他东西，全部在一条状态栏里。

```
[↪▨] [deepseek-v4-flash[1M]] ██████░░░░ 55% | git:(master*) | tok: ...
 ⏵⏵ accept edits on (shift+tab to cycle)
[rtk[active]] | cmd:127 | -762k | ~75%
```

## 协议

MIT。基于 [rtk](https://github.com/rtk-ai/rtk) (Apache 2.0) 的插件封装。
