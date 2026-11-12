---
name: xingmeng-knowledge
description: 星梦启航（cpython666.github.io，Python斗罗）的知识库：500 多条 AI 工具与开发资源导航、提示词库、开源项目、公开文章目录，以及可直接运行的 cURL 转 Python Requests、O10 编解码脚本。用户找 AI 工具、开发网站或资源推荐，要现成提示词，把浏览器复制的 cURL 转成 requests 代码，做 O10 编解码，或想了解 Python 爬虫、DrissionPage、Web3、程序员成长等站长文章时使用。
---

# 星梦启航知识库

星梦启航是 Python斗罗（cpython666）的个人博客，地址 https://cpython666.github.io 。本 Skill 把网站上能直接用的内容整理成参考文件和脚本，由仓库的 `scripts/build-skill.mjs` 从网站源数据自动生成，内容与网站保持一致。

## 按需求找参考文件

参考文件较大，先用关键词搜索（如 `grep -n "关键词" references/resources.md`），只读取命中的分类或条目，不要整份读入。

| 用户想要 | 读取 | 内容 |
| --- | --- | --- |
| 推荐 AI 工具、开发网站、素材、学习资源 | [references/resources.md](references/resources.md) | 资源导航，按分类列出名称、链接、简介和标签 |
| 现成的提示词（视频封面、字幕矫正、写作等） | [references/prompts.md](references/prompts.md) | 提示词全文，`{{变量}}` 需要替换 |
| cURL 转 Requests、URL/Base64/O10 编解码、图片分割 | [references/tools.md](references/tools.md) | 在线工具箱说明、网页直达链接和本地脚本用法 |
| 站长的开源项目和教程合集 | [references/projects.md](references/projects.md) | 项目名称、仓库链接、简介 |
| 站长写过的文章（Python、爬虫、Web3、人生感悟、科技日报等） | [references/articles.md](references/articles.md) | 公开文章标题、链接、日期和摘要 |

## 可运行脚本

脚本只依赖 Node 18+，在本 Skill 根目录运行：

- `node scripts/curl-to-requests.mjs "<curl 命令>"`：把浏览器开发者工具“复制为 cURL”的命令转成 Python Requests 代码，长命令可从标准输入传入。
- `node scripts/o10.mjs encode|decode [--pro] <文本>`：O10 编码与解码。

用户只想在网页上操作时，给出 `references/tools.md` 中的直达链接。

## 使用约定

- 推荐资源时给出名称、链接和一句话理由，优先选标签与需求最贴近的条目；资源导航是站长的收藏，不代表对第三方服务的担保。
- 引用文章时附上原文链接，并注明来自星梦启航。文章目录只有标题和摘要，需要细节时打开链接阅读原文。
- 本 Skill 不包含会员文章和草稿。用户问到会员内容时，说明需要在网站上开通会员阅读（https://cpython666.github.io/vip/ ），不要编造正文。
- 站长的各平台账号：B 站、公众号“Python斗罗”，GitHub `cpython666`，CSDN `codefly`，语雀 `python666`。
