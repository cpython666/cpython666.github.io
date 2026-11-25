# 九宫格切图

原生离线小红书小工具。支持本地选图、3×3／1×3／2×2、自定义行列、实时分割线、PNG 切片、顺序保存相册与带图发笔记。

## 文件

- `index.html` 为唯一入口。
- `styles.css` 为手机优先样式。
- `app.js` 处理选图、预览和切图，复用原站 `PanelImagesplit.vue` 的行列与 Canvas 思路。
- `xhs.js` 处理平台导出、安全区与兼容降级。
- 本 README 仅保留在源码目录。

## 本地预览

在本目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，浏览器打开 `http://127.0.0.1:8765/`。也可直接打开 `index.html`。普通浏览器可完整选图、切图和查看结果，相册与笔记操作会提示在小红书中使用。

每项行列为 1–12，最多 36 张。输入文件最大 20MB／6400 万像素。输出整图边长最大 4096、总像素最大 1200 万，超出时等比缩小并显示实际尺寸。按左到右、上到下编号，相册显示顺序由操作系统决定。超过 18 张时选择分组发笔记。

## 校验与打包

在 `xhs-minitools` 目录运行 `node scripts/check.mjs`、`python3 scripts/pack.py`。ZIP 根目录直接包含入口与资源。

可重复执行的回归检查另有 `node scripts/smoke.mjs`、`node scripts/image-check.mjs`、`node scripts/renderer-check.mjs`，均从 `xhs-minitools` 运行。

本地浏览器及 Mock 结果用于本地流程与参数验证。上传后须用创服模拟器、Android 和 iOS 真机扫码验证相册权限、顺序、安全区及笔记发布页。Chrome 61 真实内核与真机性能仍待实测。
