---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: URL 编码解码在线工具
description: 在线进行 URL 百分号编码与解码，支持中文、空格和特殊字符，提供查询参数编码示例与 encodeURIComponent 使用说明。
keywords: URL编码,URL解码,百分号编码,encodeURIComponent,中文URL
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="url">

## 使用方法

在输入框中粘贴文字或百分号编码，下方会同步显示编码和解码结果。编码适合处理 URL 中的单个参数值，例如搜索词、文件名或含中文的路径片段。

## 编码与解码示例

| 操作 | 输入 | 对应结果 |
| --- | --- | --- |
| 编码 | `你好 world` | `%E4%BD%A0%E5%A5%BD%20world` |
| 解码 | `%E4%BD%A0%E5%A5%BD%20world` | `你好 world` |
| 编码加号 | `a+b` | `a%2Bb` |

例如构造搜索地址时，先将搜索词编码，再拼接为 `https://example.com/search?q=%E4%BD%A0%E5%A5%BD%20world`。

## 常见问题

**为什么完整网址中的冒号、斜杠也被编码？** 本工具使用 `encodeURIComponent`，将整个输入视为一个参数值。要保留网址结构，请只编码其中需要处理的参数内容。

**加号会被解码为空格吗？** 不会。此处的加号仍是加号；空格对应 `%20`。HTML 表单使用的加号规则需要另外处理。

**解码输入有什么要求？** 请使用完整且有效的百分号编码，例如 `%20`，不要截断成 `%2` 或只粘贴 `%`。

相关工具：[cURL 转 Python Requests](/spider-tools/curl-requests/) · [Base64 编码解码](/spider-tools/base64/)

</SpiderTools>
