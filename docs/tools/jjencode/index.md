---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: JJencode 编码解码在线工具
description: 在线生成符号形式的 JJencode JavaScript 代码，支持设置全局变量名及尝试解码，附 ASCII 示例与中文解码限制说明。
keywords: JJencode,JJencode解码,JavaScript编码,JavaScript混淆,符号编码
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="jjencode">

## 使用方法

输入 JavaScript 文本，设置生成代码使用的「全局变量名」，再点击「编码」。解码时将完整的 JJencode 结果粘贴到输入框，并点击「解码」。

## 编码示例

1. 输入简单的 ASCII 文本 `1 + 2`。
2. 将全局变量名设置为 `$`，点击「编码」。
3. 输出会以 `$=~[];` 开头，并使用该变量构造后续表达式。
4. 若要尝试还原，将完整输出复制回输入框，再点击「解码」。

全局变量名属于生成代码的一部分，建议采用简单、有效的 JavaScript 标识符，避免空格或标点组合。

## 当前限制

本页面已禁用回文模式。中文内容可以编码，但当前解码器处理汉字时可能出错；需要可靠的中文文本往返转换时，可以使用下方的 Base64 或 O10 工具。

JJencode 改变代码的表示形式，不提供密钥保护，也不等于压缩。请保留原始源码，使用短小、已知内容的样例核对转换结果。

相关工具：[AAencode 编码解码](/tools/aaencode/) · [O10 编码解码](/tools/o10/)

</SpiderTools>
