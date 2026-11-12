---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: Base64 编码解码在线工具
description: 在浏览器中将 UTF-8 文本转换为 Base64 或还原原文，支持中文，附输入输出示例及 Base64 与加密的区别说明。
keywords: Base64编码,Base64解码,在线Base64,UTF-8文本,中文Base64
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="base64">

## 使用方法

把文本或 Base64 字符串粘贴到输入框，编码与解码结果会自动更新。原文不是有效 Base64 时，解码栏会显示错误提示，编码栏仍可用于查看文本的编码结果。

## 输入输出示例

| 原始文本 | Base64 编码 |
| --- | --- |
| `Hello` | `SGVsbG8=` |
| `你好` | `5L2g5aW9` |

输入 `你好`，编码结果为 `5L2g5aW9`；再把 `5L2g5aW9` 粘贴到输入框，解码结果还原为 `你好`。中文先转换为 UTF-8 字节，再进行 Base64 编码。

## 常见问题

**能处理图片和二进制文件吗？** 当前页面用于文本转换，不提供文件上传或二进制下载。图片 Data URL 的 `data:image/...;base64,` 前缀也不是 Base64 正文。

**支持 Base64URL 吗？** 当前使用标准 Base64 字符集。含 `-`、`_` 的 Base64URL 不属于此页面的直接输入格式。

**Base64 能隐藏敏感信息吗？** Base64 是可逆编码，没有密钥，不能用来保护密码、令牌或私人内容。

相关工具：[URL 编码解码](/tools/url/) · [O10 编码解码](/tools/o10/)

</SpiderTools>
