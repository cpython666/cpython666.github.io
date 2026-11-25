# 文字编解码

本地转换标准 O10 / O10 Pro、UTF-8 Base64、URL 百分号编码和常用 HTML 实体。首页默认显示一条中文 emoji 的 O10 示例及转换结果；可切换模式、点击「试试示例」或清空示例。输入由用户手动粘贴，输出为可选中的只读文本框。结果可生成 2 倍清晰度的 3:4 图片，长结果按完整文字行分页，并支持存相册和带图发笔记。

## 文件

- `index.html` 为唯一入口。
- `styles.css` 为统一的手机优先界面。
- `app.js` 负责 O10 / Base64 / URL / HTML 编解码、图片预览及最近 10 条历史，公开 `window.TextCodec.convert(text, type, direction, o10Mode)` 供局部检查。O10 模式为 `standard` 或 `pro`。
- `text-image.js` 复用文字卡片的 Canvas 排版与分页。
- `xhs.js` 负责平台导出、安全区、Storage 和浏览器降级。

## 本地预览

在本目录运行 `python3 -m http.server 8767 --bind 127.0.0.1`，打开 `http://127.0.0.1:8767/`，或直接打开 `index.html`。首页默认显示 O10 示例及结果；修改输入、模式或转换类型后点「转换文字」。普通浏览器可完成转换、历史和图片预览，相册与笔记操作需要小红书容器。

每次最多输入 3000 个 UTF-16 字符。这个范围保证 URL 编码的最长结果连同标题可完整生成图片。输出框原样保留换行，历史只保存文字，不保存图片与临时文件路径。历史启动读取完成后串行写入，读写失败会提示，当前结果继续可用。

O10 标准模式用大写 O 分隔 Unicode 码点的二进制，Pro 模式把 0/1/O 映射为 l/I/1；两种模式均支持中文与 emoji，并校验分隔符、码点范围和代理字符。Base64 支持中文和 emoji，严格检查字符、等号位置、末尾数据位及 UTF-8 完整性，允许省略末尾等号和 ASCII 空白。URL 使用 `encodeURIComponent` / `decodeURIComponent`，解码时 `+` 保留为加号。HTML 编码处理 `& < > " '` 与不换行空格，解码仅处理 `amp`、`lt`、`gt`、`quot`、`apos`、`nbsp` 及有效数字实体，其他命名实体保留原文，不执行 HTML。

单次笔记最多带 18 张图片，超出时可选择分组。相册按顺序保存，中途失败可从失败项继续。

## 校验与打包

在 `xhs-minitools` 运行 `node scripts/check.mjs`、`node scripts/smoke.mjs`、`python3 scripts/pack.py`。README 留在源码目录。

可重复执行的回归检查另有 `node scripts/smoke.mjs`、`node scripts/image-check.mjs`、`node scripts/renderer-check.mjs`，均从 `xhs-minitools` 运行。

普通浏览器和 Mock 用于本地流程与参数验证。上传后须在创服模拟器、Android 与 iOS 真机扫码验证同一 ZIP。Chrome 61 真实内核、字体度量与真机性能仍待实测。
