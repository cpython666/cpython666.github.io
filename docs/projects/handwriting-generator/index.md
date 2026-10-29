---
title: "星笺 HandwritingGenerator：本地手写图片生成器"
description: "星笺（HandwritingGenerator）是一款本地手写图片生成器：选纸张、字体与墨色，实时预览并导出 PNG、JPEG 或 WebP；提供 Python / PyQt6 与 Rust 版，支持 CLI 和本地 MCP。"
keywords: "星笺,HandwritingGenerator,手写图片生成器,手写文字生成,Python,PyQt6,Rust,本地工具"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/projects/handwriting-generator/desktop.webp"
project: true
repository: "https://github.com/cpython666/HandwritingGenerator"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['本地运行', '无需 API Key', '手写字体', '预设复用']
const facts = [
  { label: '平台', value: 'macOS / Windows' },
  { label: '技术栈', value: 'Python · PyQt6 + Rust' },
  { label: '导出格式', value: 'PNG / JPEG / WebP' },
  { label: '使用入口', value: 'GUI / CLI / MCP' },
]
const description = '把想说的话写成一页有温度的纸笺。选纸张、挑字迹、调墨色与留白，右侧实时预览，最后导出图片；文字与图像都在本地处理，不需要 API Key。'
</script>

<ProjectDetail
  title="星笺"
  english="HandwritingGenerator"
  eyebrow="开源项目 · 本地手写图片生成器"
  tagline="让文字，带一点星光。"
  :description="description"
  image="/imgs/projects/handwriting-generator/desktop.webp"
  image-alt="星笺桌面版界面，左侧是内容、排版和纸张设置，右侧是手写效果实时预览"
  image-caption="桌面版：左侧「内容 / 排版 / 纸张」，右侧实时预览。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/HandwritingGenerator"
  quick-start="#quick-start"
>

## 把一段话，写成一页纸

星笺是一款本地手写图片生成器。输入文字，选一张纸、挑一种笔迹，再调整字号、字距、行距、墨色和留白，右侧会实时预览，最后导出 PNG、JPEG 或 WebP。

写一封信、抄一段诗、做一张日签，或者把一段摘抄变成可以保存的图片。喜欢的排版可以存成预设，下次换一段文字继续用。

文字和图像处理都在本地完成，不需要 API Key，也不会上传正文或图片。仓库同时提供 Python / PyQt6 版和纯 Rust 原生版，两个版本各有 GUI、CLI 与本地 MCP。

## 写出来的效果

纸张、字体、墨色和留白都可以调。下面这张 724 × 1024 的信笺，就是选好内置纸张和手写字体后直接导出的。

<figure class="project-figure project-figure--paper">
  <img src="/imgs/projects/handwriting-generator/sample.webp" alt="星笺导出的手写信笺效果，红色横线纸上写着三行中文" width="724" height="1024" loading="lazy" decoding="async" />
  <figcaption>导出效果：手写字体与红色横线来自本地资源。</figcaption>
</figure>

## 能做什么

<div class="feature-grid">
  <div class="feature-card">
    <h3>纸张与字迹</h3>
    <p>内置多款纸张和手写字体，也可以导入 TTF / OTF / TTC 字体；纯色背景可以直接创建。</p>
  </div>
  <div class="feature-card">
    <h3>排版控制</h3>
    <p>边距、文字区域、字号、字重、字距、行距和墨色都能调，修改后预览立即更新。</p>
  </div>
  <div class="feature-card">
    <h3>画布操作</h3>
    <p>拖动纸张、按住 Ctrl / ⌘ 滚动缩放，支持 1:1、适应窗口、文字边界和右键测量标记。</p>
  </div>
  <div class="feature-card">
    <h3>预设复用</h3>
    <p>把喜欢的版式保存成 JSON 预设，保留文字、资源路径和排版参数，下次换文字继续用。</p>
  </div>
  <div class="feature-card">
    <h3>多格式导出</h3>
    <p>导出 PNG、JPEG 或 WebP，保持背景原始像素尺寸；PNG 可以保留透明背景。</p>
  </div>
  <div class="feature-card">
    <h3>自动化入口</h3>
    <p>CLI 适合批量生成，本地 MCP 让 AI 工具直接调用；默认不覆盖已有文件。</p>
  </div>
</div>

## 快速开始 {#quick-start}

::: code-group

```bash [Python / PyQt6]
uv sync
uv run python main.py
```

```bash [Rust 原生版]
cargo run --manifest-path rust/Cargo.toml --release --locked
```

:::

Python 版需要 Python 3.10+（开发与打包推荐 3.12），依赖 `PyQt6>=6.7,<7`。没有 uv 时，可以用 `venv` 建独立环境后执行 `pip install 'PyQt6>=6.7,<7'`，再运行 `python main.py`。

Rust 版使用 egui/eframe，内置 9 款字体和纸张，不需要 Python、Qt 或 WebView，支持 macOS / Windows 构建。

打包使用 PyInstaller，需要在目标系统上执行；产物会带上 Python、Qt、字体、纸张和图标。完整命令、MCP 配置和打包说明见 [仓库 README](https://github.com/cpython666/HandwritingGenerator#readme)。

## 命令行与 AI 调用

除了桌面界面，星笺也提供命令行和本地 MCP，方便批量生成或让 AI 工具直接调用：

```bash
# 直接生成
uv run python cli.py render --text '你好，星笺！' --output outputs/hello.png

# 复用排版，替换文字
uv run python cli.py render --preset outputs/letter.json --text '新的一封信' --output outputs/next.png
```

命令行参数会覆盖预设；默认拒绝覆盖已有图片或预设，需要时加 `--force`。输出目录会自动创建。

需要让 AI 工具调用时，再安装 MCP 依赖：

```bash
uv sync --extra mcp
uv run --extra mcp python mcp_server.py --output-dir outputs
```

这是 stdio 服务，不会上传正文或图片；输出只能写到 `--output-dir` 指定的目录内。

| 限制 | 数值 |
| --- | --- |
| 图片单边 | 8192 px |
| 总像素 | 3200 万 |
| 正文长度 | 10 万字符 |

## 常见问题

### 需要联网或 API Key 吗？

不需要。渲染、字体和背景都在本地完成；只有安装依赖或访问 GitHub 时需要网络。

### 导出的图片为什么裁掉了部分文字？

导出保持背景原始像素尺寸，超出文字区域的内容会裁切，不会自动分页。可以增大文字区域、减小字号，或者分成多张导出。

### macOS 和 Windows 都能用吗？

源码在两个平台通用，打包需要在目标系统上执行。macOS 产物对应构建机器的 CPU 架构，目前没有做 universal 应用，也没有 Developer ID 签名或公证。

## 相关入口

- [HandwritingGenerator 仓库](https://github.com/cpython666/HandwritingGenerator)
- [PyQt6 实战开发系列](/python/pyqt6-series/)
- [星笺 Starclip](https://github.com/cpython666/starclip)：星绘坊的「月光笺」通过本地 CLI 复用星笺的 Rust 渲染器；安装包尚未捆绑渲染器和字体
- [返回项目列表](/projects/)

<div class="quick-note">
  <p><strong>说明：</strong>本页根据项目 README 与当前界面截图整理，功能和命令以仓库最新说明为准。</p>
</div>

</ProjectDetail>
