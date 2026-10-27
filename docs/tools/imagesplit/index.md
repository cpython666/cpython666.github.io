---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: 在线图片分割工具（按行列切片）
description: 在浏览器中按行数和列数均匀切分图片，实时预览网格并下载 PNG 切片 ZIP，适合九宫格图片和规则精灵图切片。
keywords: 图片分割,在线图片切片,九宫格切图,精灵图分割,PNG切片
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="imagesplit">

## 使用方法

选择本地图片，设置行数 Rows 和列数 Columns，查看红色网格预览。确认分割位置后点击「分割并且下载」，浏览器会生成包含 PNG 切片的 `pieces.zip` 文件。

图片在浏览器内处理，无需上传到服务器。行数和列数请使用大于等于 1 的整数。

## 九宫格示例

选择一张 `900 × 900` 像素的图片，将 Rows 和 Columns 都设置为 `3`。下载的 ZIP 中包含 9 张 `300 × 300` 像素的 PNG：

```text
piece_0_0.png  piece_0_1.png  piece_0_2.png
piece_1_0.png  piece_1_1.png  piece_1_2.png
piece_2_0.png  piece_2_1.png  piece_2_2.png
```

文件名中的两个数字依次表示行和列，从 0 开始计数。`piece_0_0.png` 位于左上角，`piece_2_2.png` 位于右下角。

## 常见问题

**适合什么图片？** 适合等宽等高网格，如九宫格、规则排列的精灵图。若每帧之间有间距或尺寸不同，需要先整理图片；当前不支持自动识别边框或按不规则区域裁剪。

**能拆出 GIF 的每一帧吗？** 此工具按图片空间位置切片，不提供动画时间轴逐帧导出。

**尺寸不能整除行列数怎么办？** 建议选择能整除的尺寸，避免画布转换为整数像素时产生取整差异。

相关工具：[Base64 文本编码解码](/tools/base64/) · [返回全部工具](/tools/)

</SpiderTools>
