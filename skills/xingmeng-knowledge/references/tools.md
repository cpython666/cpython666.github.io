# 在线开发工具箱

来自 https://cpython666.github.io/tools/ ，共 8 个工具，全部在浏览器本地运行。

| 工具 | 作用 | 网页直达 | 在本 Skill 中怎么用 |
| --- | --- | --- | --- |
| cURL 转 Requests | 将 cURL 命令转换为 Python Requests 代码，支持请求头、Cookie、JSON 和表单。 | https://cpython666.github.io/tools/curl-requests/ | `node scripts/curl-to-requests.mjs` |
| URL 编码解码 | 在线转换 URL 百分号编码，处理中文、空格与特殊字符。 | https://cpython666.github.io/tools/url/ | 用 Python 标准库或打开网页 |
| Base64 编码解码 | 将文本转换为 Base64，或将 Base64 还原为文本，支持中文。 | https://cpython666.github.io/tools/base64/ | 用 Python 标准库或打开网页 |
| O10 编码解码 | 支持标准 O10（数字 0、1 与大写 O）和 Pro（大写 I、小写 l 与数字 1）双模式文本编码解码，兼容 Python 原版。 | https://cpython666.github.io/tools/o10/ | `node scripts/o10.mjs` |
| AAencode 编码解码 | 将 JavaScript 转换为颜文字形式的 AAencode 编码，并提供解码。 | https://cpython666.github.io/tools/aaencode/ | 用 Python 标准库或打开网页 |
| JJencode 编码解码 | 将 JavaScript 转换为符号形式的 JJencode 编码，并提供解码。 | https://cpython666.github.io/tools/jjencode/ | 用 Python 标准库或打开网页 |
| 图片分割 | 按行列切分图片，在浏览器内预览并下载切片。 | https://cpython666.github.io/tools/imagesplit/ | 用 Python 标准库或打开网页 |
| Markdown 转图片 | 把 Markdown 渲染成 PNG 图片，支持标题、列表、代码块、引用和链接，可切换明暗主题与图片宽度。 | https://cpython666.github.io/tools/markdown-image/ | 用 Python 标准库或打开网页 |

## 本地脚本

脚本与网页共用同一份函数，只依赖 Node 18+，从 Skill 根目录运行。

### cURL 转 Python Requests

```bash
# 命令作为参数，或从标准输入读入（适合浏览器“复制为 cURL”的长命令）
node scripts/curl-to-requests.mjs "curl 'https://httpbin.org/post' -H 'Content-Type: application/json' --data-raw '{\"a\":1}'"
pbpaste | node scripts/curl-to-requests.mjs
```

支持 `-X`、`-H`、`-b`、`-d` / `--data-raw` / `--data-binary` / `--data-urlencode` / `--json`、`-F`、`-u`、`-A`、`-e`、`-x`、`-G`、`-I`、`-k`。JSON 请求体输出为 `json=`，`-F name=@file` 输出为 `files=`。

### O10 编码解码

```bash
node scripts/o10.mjs encode "你好"         # 标准模式：0/1 组合，大写 O 分隔
node scripts/o10.mjs encode --pro "你好"   # Pro 模式：I/l 组合，数字 1 分隔
node scripts/o10.mjs decode "<编码>"       # 加 --pro 解码 Pro 编码
```

O10 按 Unicode 码点转二进制，与站长的 Python 原版兼容。
