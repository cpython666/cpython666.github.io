---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: O10 编码解码在线工具（标准版与 Pro 版）
description: 支持标准 O10（数字 0、1 与大写 O）和 Pro（大写 I、小写 l 与数字 1）双模式文本编码解码，支持中文与 emoji，兼容 Python 原版，附两种模式示例。
keywords: O10编码,O10解码,O10Encode,01编码,Pro编码,Python文本编码
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="o10">

## 使用方法

选择「标准 O10」或「Pro」模式，输入原文后点击「编码」。解码时选择生成编码时使用的模式，粘贴完整编码，再点击「解码」。也可以点击「结果用作输入」验证往返转换。

## 两种模式的示例

以下两种编码都对应原文 `AB`：

| 模式 | 编码结果 | 字符含义 |
| --- | --- | --- |
| 标准 O10 | `1000001O1000010` | 数字 `0`、`1` 表示二进制，大写字母 `O` 分隔字符 |
| Pro | `IlllllI1IllllIl` | 大写 `I` 表示 1，小写 `l` 表示 0，数字 `1` 分隔字符 |

标准版按每个字符的 Unicode 码点转换为二进制，不额外补齐位数，再用大写 `O` 连接。Pro 版在此基础上替换字符，规则与原 Python 函数一致，中文和 emoji 也可以往返转换。

## 常见问题

**为什么看起来一样却解码失败？** 请区分数字 `0` 和大写字母 `O`，以及大写 `I`、小写 `l` 和数字 `1`。编码中不要插入空格、换行或连续分隔符。

**O10 是加密吗？** 它是可逆文本编码，没有密钥；适合编码演示和文本转换，不能作为保密方案。Pro 模式改变的是字符外观，不增加密码学保护。

相关工具：[Base64 编码解码](/tools/base64/) · [URL 编码解码](/tools/url/)

</SpiderTools>
