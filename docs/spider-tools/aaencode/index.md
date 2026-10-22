---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: AAencode 编码解码在线工具
description: 将 JavaScript 文本转换为颜文字形式的 AAencode 代码，提供编码与解码操作、简单往返示例和适用范围说明。
keywords: AAencode,AAencode解码,颜文字编码,JavaScript混淆
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="aaencode">

## 使用方法

把 JavaScript 源文本粘贴到输入框，点击「编码」，结果会转换为包含颜文字表达式的 AAencode 形式。点击「解码」则尝试还原输入框中的 AAencode 内容。

## 往返示例

1. 在输入框填入 `1 + 2`，点击「编码」。
2. 将生成的完整结果复制回输入框，不要省略开头或结尾。
3. 点击「解码」，还原的源文本应为 `1 + 2`。

这里展示的是代码文本的转换；还原源文本与计算表达式得到 `3` 是不同操作。

## 适用范围

AAencode 适合观察 JavaScript 颜文字编码方式和对自己生成的代码做转换实验。编码后的内容通常更长，不适合作为代码压缩方案，也不能保护代码中的密钥。

当前解码器会在浏览器中求值输入，请仅对自己生成、明确了解内容的样例使用「解码」，不要将陌生脚本当作普通文本粘贴解码。

相关工具：[JJencode 编码解码](/spider-tools/jjencode/) · [Base64 文本编码解码](/spider-tools/base64/)

</SpiderTools>
