---
title: "scrapy-drissionpage：Scrapy 的 DrissionPage 中间件"
description: "scrapy-drissionpage 把 DrissionPage 接进 Scrapy 的下载流程：用浏览器打开页面并返回渲染后的 HTML，适合需要执行 JavaScript 才能拿到数据的站点。"
keywords: "scrapy-drissionpage,Scrapy,DrissionPage,爬虫中间件,动态页面"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/scrapy-drissionpage.webp"
project: true
repository: "https://github.com/cpython666/scrapy-drissionpage"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['Scrapy', 'DrissionPage', '中间件', '动态页面']
const facts = [
  { label: '类型', value: 'Scrapy 下载中间件' },
  { label: '请求类', value: 'DrissionPageRequest' },
  { label: '场景', value: 'JS 动态页面' },
  { label: '状态', value: '早期实现' },
]
const description = '一个把 DrissionPage 接进 Scrapy 的下载中间件：Scrapy 继续负责调度和解析，真正取页面时交给浏览器，返回渲染后的 HTML。'
</script>

<ProjectDetail
  title="scrapy-drissionpage"
  english="Scrapy × DrissionPage"
  eyebrow="开源项目 · 爬虫中间件"
  tagline="让 Scrapy 的调度器，接到浏览器渲染后的 HTML。"
  :description="description"
  image="/imgs/app/scrapy-drissionpage.webp"
  :image-width="1024"
  :image-height="1024"
  image-alt="scrapy-drissionpage 项目封面"
  image-caption="项目封面。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/scrapy-drissionpage"
  quick-start="#usage"
>

## 解决什么问题

Scrapy 默认的下载器拿到的是服务器返回的原始响应。遇到 Vue / React 渲染、接口加密或必须执行一段 JavaScript 才有数据的页面时，`response.text` 里往往只有空壳。

这个项目把请求换成 `DrissionPageRequest`，由中间件用 DrissionPage 打开浏览器页面，等页面产生内容后把 HTML 包成 `HtmlResponse` 交给 Scrapy 的 callback。调度、去重、Item Pipeline 仍然由 Scrapy 负责。

## 接入方式 {#usage}

先安装依赖，并确保仓库里的 `scrapy_drissionpage` 包在 Python 可导入路径中：

```bash
pip install scrapy DrissionPage
```

然后在 Spider 里使用新的请求类和中间件：

```python
from scrapy_drissionpage.request import DrissionPageRequest

request_cls = DrissionPageRequest

custom_settings = {
    "DOWNLOADER_MIDDLEWARES": {
        "scrapy_drissionpage.middlewares.DrissionPageMiddleware": 560,
    }
}

yield self.request_cls(
    url=url,
    callback=self.parse,
    meta=meta,
    dont_filter=True,
)
```

中间件会复用同一个 `ChromiumPage`，每个请求开一个新标签页，读取 HTML 后关闭，再把响应交回 Scrapy。

## 当前实现的边界

仓库是早期版本，代码比 README 里的能力清单小：目前主要是“用浏览器取页面”的最小闭环。README 里列的等待、超时、自动处理弹窗、执行脚本、截图、代理和隧道代理，属于后续要补的方向，不能直接当成已经完成的能力。

实际使用时建议自己补上：

- 明确的元素等待和超时，而不是固定等待。
- 失败重试、标签页回收和浏览器异常处理。
- 代理 / 无头模式和登录态管理。
- 对目标站点访问频率和 robots 规则的尊重。

## 相关入口

- [scrapy-drissionpage 仓库](https://github.com/cpython666/scrapy-drissionpage)
- [DrissionPage 自动化数据采集系列](/spider/dp-series/)
- [Scrapy 爬虫系列](/spider/scrapy-series/)
- [返回项目列表](/projects/)

</ProjectDetail>
