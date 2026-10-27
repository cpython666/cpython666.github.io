---
layout: home
markdownStyles: false
sidebar: false
tool: true
title: cURL 转 Python Requests 在线工具
description: 将浏览器复制的 cURL 命令转换为 Python Requests 代码，支持请求头、Cookie、JSON、表单与代理，附转换示例和使用步骤。
keywords: cURL转Python,cURL转Requests,Python请求代码,在线cURL转换
---

<script setup>
import SpiderTools from '../SpiderTools.vue'
</script>

<SpiderTools tool-id="curl-requests">

## 使用方法

将 cURL 命令粘贴到输入框，点击「立即转换」，再复制生成的 Python 代码。可以在浏览器开发者工具的 Network 面板中选中请求，使用 Copy as cURL 获取命令；带单引号、反斜杠换行的 Bash 格式更适合本工具。

转换过程只处理文本，不会发送命令中的请求。运行生成代码时，需要本地 Python 环境并安装 `requests`。

## 转换示例

输入一条带请求头的 GET 命令：

```bash
curl 'https://example.com/api/items?page=1' -H 'Accept: application/json'
```

转换后的代码：

```python
import requests

url = 'https://example.com/api/items?page=1'
headers = {
    'Accept': 'application/json',
}

response = requests.get(
    url,
    headers=headers,
)

print(response.status_code)
print(response.text)
```

这里的 `example.com` 是示例地址。实际使用时换成你有权访问的接口；页面自带的「载入示例」也可以演示 POST 与 JSON 请求体的转换。

## 支持范围

支持常见的请求方法、Header、Cookie、JSON、表单、Basic Auth 和代理参数。工具不是完整的 Shell 或 cURL 运行环境：变量替换、命令替换、复杂脚本及全部 cURL 参数并不保证转换。生成后请核对 URL、请求方法与请求体；分享代码前移除真实 Cookie 和令牌。

相关工具：[URL 编码解码](/tools/url/) · [Base64 编码解码](/tools/base64/)

</SpiderTools>
