---
title: "CC Switch 是干嘛的？怎么用？中转站一键导入、一键切换 API 供应商"
description: "CC Switch 图文教程：从中转站一键导入供应商、在 CC Switch 里一键切换 Claude Code 和 Codex 的 API，并用大白话讲清楚切换背后改了哪些配置。"
keywords: "CC Switch,cc-switch,中转站,Claude Code,Codex,API供应商,一键切换"
---

# CC Switch 是干嘛的？怎么用？

用 Claude Code、Codex 的朋友，多半都遇到过这种情况：官方额度用完了想换中转站，或者手里有好几家中转站想来回切。

如果手动改，就要去翻 `~/.claude/settings.json`、`~/.codex/config.toml` 这些配置文件，改地址、改密钥，改错一个逗号工具就启动不了。

CC Switch 就是专门干这件事的：**把各家 API 供应商存起来，点一下就切换**。

这篇是我视频的文字版，视频里有完整的操作动画，喜欢看视频的可以直接看：

<div style="position: relative; width: 100%; padding-top: 56.25%; margin: 16px 0;">
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV12ypg6aEMv&autoplay=0"
    title="CC Switch 是干嘛的？怎么用？一键切换 API 供应商"
    style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 8px;"
    scrolling="no"
    allowfullscreen
  ></iframe>
</div>

视频地址：[CC Switch 是干嘛的？怎么用？一键切换 API 供应商](https://www.bilibili.com/video/BV12ypg6aEMv/)

> 文中截图里的供应商名称、网址、余额都是演示数据，不是真实账号。

## 一句话说明白

CC Switch 是一个开源免费的桌面软件，macOS、Windows、Linux 都能用。它支持 Claude Code、Codex、Gemini CLI 等常见的 AI 编程工具。

你可以把它理解成一个 **API 供应商的收纳盒 + 切换开关**：

- 收纳盒：把官方、中转站 A、中转站 B 的地址和密钥都存在里面
- 切换开关：想用哪家，点一下，它就帮你把配置文件改好

顺带它还能统一管理 MCP、Skills、提示词和用量统计，不过大部分人用它，主要就是为了切换供应商。

下载地址：[CC Switch Releases](https://github.com/farion1231/cc-switch/releases)，按自己的系统下载安装包，安装后打开即可。

## 最常见的用法：中转站一键导入

大部分人第一次用 CC Switch，其实不是自己去填地址和密钥，而是 **在中转站后台点一下「导入到 CC Switch」**。

现在很多中转站在「API 令牌」或「密钥管理」页面，都有一个类似「一键导入 CC Switch」的按钮。操作流程是这样的：

1. 先在电脑上装好 CC Switch
2. 登录中转站，在令牌列表里找到你要用的那个令牌
3. 点这个令牌的「导入到 CCS」（CCS 就是 CC Switch 的缩写，不同中转站叫法略有不同），浏览器会提示是否打开 CC Switch，点允许

![中转站 API 密钥页面的「导入到 CCS」按钮](/imgs/life/cc-switch/relay-import-button.png)

4. CC Switch 会弹出一个确认框，列出要导入的内容

![CC Switch 导入供应商确认框](/imgs/life/cc-switch/import-confirm.png)

确认框里能看到：

- **应用类型**：导入给哪个工具用，比如 Claude（Claude Code）、Codex
- **供应商名称**：在列表里显示的名字
- **API 端点**：请求要发到的地址，也就是中转站的接口地址
- **API 密钥**：你的令牌，这里只显示开头，后面都是星号

核对没问题，点「导入」，这个中转站就出现在 CC Switch 的供应商列表里了。

> 小提示：导入只是把配置 **存进 CC Switch**，并不会马上切过去用。真正生效要做下一步的「切换」。

如果你的中转站没有一键导入按钮，也可以手动添加：点右上角「添加供应商」，选一个预设或者「自定义配置」，填上中转站给的地址和 API Key 就行。

![手动添加供应商](/imgs/life/cc-switch/add-provider.png)

## 在 CC Switch 里切换供应商

导入之后，日常使用就只剩一个动作：**切换**。

![在 CC Switch 中切换供应商](/imgs/life/cc-switch/switch-provider.png)

1. 左侧先选你要管理的工具，比如 Claude Code 或 Codex
2. 中间是供应商卡片列表，**蓝色边框、写着「使用中」的就是当前正在用的**
3. 把鼠标移到想用的那张卡片上，点右边的 ▷「切换」按钮
4. 蓝框移到新卡片上，就切换成功了

切换后要不要重启工具？

- **Claude Code**：一般立即生效，新开的对话就会走新供应商
- **Codex、Gemini CLI**：切换后需要重启一下工具才会生效

另外，CC Switch 在系统菜单栏（托盘）里也有图标，不打开主窗口也能直接选供应商切换，平时用起来更方便。

## 原理：点一下「切换」，到底改了什么？

很多人会担心：这个软件会不会把我的配置搞乱？其实它做的事情很简单。

![切换就是改写配置文件里的几个字段](/imgs/life/cc-switch/principle-env.png)

用大白话讲，就是四步：

1. **先存起来**：你导入或添加的每个供应商，都存在本地的数据库 `~/.cc-switch/cc-switch.db` 里，不上传到任何地方
2. **点切换时**：CC Switch 把目标供应商的「地址」和「密钥」写进工具自己的配置文件。以 Claude Code 为例，就是改 `~/.claude/settings.json` 里 `env` 下面的 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_AUTH_TOKEN` 这两项
3. **其它不动**：你配置好的插件、Hook、权限等内容，原样保留
4. **工具读取新配置**：Claude Code 启动或新开对话时读取配置，请求就发往新的供应商了

打个比方：Claude Code 就像一个快递员，配置文件就是他手里的地址单。CC Switch 不改快递员，也不改包裹，只是帮你把地址单上的收件地址换掉。

不同工具改的文件不一样：

![每个工具改的是哪个文件](/imgs/life/cc-switch/principle-files.png)

| 工具 | 改写的配置文件 |
| --- | --- |
| Claude Code | `~/.claude/settings.json` 的 env 段 |
| Codex | `~/.codex/config.toml` 的 provider 配置 |
| Gemini CLI | `~/.gemini/.env` 和 `settings.json` |
| 供应商列表本身 | `~/.cc-switch/cc-switch.db` |

而且第一次改写之前，CC Switch 会把原来的配置文件备份到 `~/.cc-switch/backups/` 下面，真出了问题也能找回来。

## 顶部的「直连 / 路由 / 聚合」是什么？

供应商列表上方有三个标签，大部分人保持默认的「直连」就够了。

![直连、路由、聚合三种模式](/imgs/life/cc-switch/modes.png)

- **直连（默认）**：工具直接连供应商，切换就是改配置文件，上面讲的就是这种
- **路由**：请求先发到本机的 CC Switch（默认 `127.0.0.1:15721`），再由它转发出去，可以做失败自动换备用供应商
- **聚合**：把多家供应商的模型合成一个列表，在工具里用 `/model` 直接挑

路由和聚合需要 CC Switch 一直开着，进阶玩法，用到再研究也不迟。

## 几个容易踩的坑

- **想长期改 Key，就在 CC Switch 里编辑**：如果你手动改了配置文件，下次在 CC Switch 里一切换，又会被覆盖回去
- **Codex、Gemini CLI 切换后记得重启**：不重启还会用旧配置
- **Codex 换了供应商，历史记录可能不显示**：这是 Codex 按供应商分组保存会话导致的，解决办法可以看我之前写的 [Codex 如何使用中转站？历史记录不显示如何解决？](/life/codex-relay-provider-history-sync)

## 总结

CC Switch 的日常用法其实就三步：

**中转站一键导入 → 在 CC Switch 里点切换 → 工具读取新配置**

它不神秘，本质就是一个帮你改配置文件的小管家。

## 参考链接

- [CC Switch 视频教程（B 站）](https://www.bilibili.com/video/BV12ypg6aEMv/)
- [CC Switch GitHub 仓库](https://github.com/farion1231/cc-switch)
- [CC Switch 下载地址](https://github.com/farion1231/cc-switch/releases)
- [CC Switch 用户手册](https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/zh/README.md)
