---
title: "Spider-Project：Python 爬虫实操项目合集"
description: "Spider-Project 收录 20+ 个 Python 爬虫练习：B站弹幕词云、抖音视频、公众号文章、知乎评论、七猫榜单可视化、wallhaven、问卷星等，代码和分析放在一起。"
keywords: "Spider-Project,爬虫项目,Python爬虫,数据采集,词云,可视化"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/spider-project.jpeg"
project: true
repository: "https://github.com/cpython666/Spider-Project"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['爬虫实战', 'Python', '数据采集', '可视化']
const facts = [
  { label: '类型', value: '爬虫案例合集' },
  { label: '技术', value: 'requests / Selenium / lxml / pandas' },
  { label: '难度', value: '入门友好' },
  { label: '内容', value: '20+ 个小项目' },
]
const description = '把自己学习过程中做过的爬虫项目整理在一起：B站弹幕、抖音视频、公众号文章、知乎评论、七猫榜单、wallhaven、问卷星等，尽量用简单的代码把需求跑通。'
</script>

<ProjectDetail
  title="Spider-Project"
  english="爬虫实操合集"
  eyebrow="开源项目 · 爬虫案例"
  tagline="从一个小需求开始，把爬虫跑通。"
  :description="description"
  image="/imgs/app/spider-project.jpeg"
  :image-width="1024"
  :image-height="1024"
  image-alt="Spider-Project 爬虫实操项目合集封面"
  image-caption="七猫小说排行榜爬取与可视化输出。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/Spider-Project"
  quick-start="#start"
>

## 适合什么样的学习

这个仓库刻意避开了 Scrapy 框架和多线程：每个小项目基本都是 `requests` / `Selenium` 加解析和存储，逻辑直白，适合刚开始做完整爬虫、或者需要交课程作业的人。

它不追求工程化，重点在于“看到一个页面，知道从哪里开始拆”。项目多了以后，你会发现自己反复用的其实是同一套流程：找数据来源、模拟请求、解析字段、保存、做一点分析。

## 收录的项目

- 视频与弹幕：B站弹幕词云、何同学视频弹幕词云、一键获取热点事件弹幕、虎牙视频
- 内容平台：抖音无水印视频、公众号文章、知乎评论、每日一文、七猫小说排行榜
- 图片与工具：wallhaven 图片、问卷星批量填写、一言生成短语、中国省份城市映射表
- 数据与分析：澎湃新闻标题、虎嗅新闻标题、原子回声问答对，以及七猫榜单的可视化

<figure class="project-figure">
  <img src="/imgs/projects/spider-project/qimao.webp" alt="七猫小说排行榜爬取后生成的柱状图" width="640" height="480" loading="lazy" decoding="async" />
  <figcaption>七猫小说排行榜爬取后生成的可视化结果。</figcaption>
</figure>

## 怎么跑 {#start}

```bash
git clone https://github.com/cpython666/Spider-Project.git
cd Spider-Project
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install requests selenium lxml pandas
```

每个项目在独立目录里，进入对应目录运行其中的脚本即可。需要浏览器的项目要准备好 Chrome / ChromeDriver；需要登录态的项目，按脚本里的注释替换 Cookie 或账号配置。

## 使用边界

目标网站会改版，几年前的代码不能保证今天还能直接跑；遇到 404、字段为空或验证码，先检查页面结构再改解析。所有项目仅用于学习和技术交流，请遵守目标站点的 robots 规则、服务条款和当地法律，不要用于批量抓取隐私数据或商业侵权。

## 相关入口

- [Spider-Project 仓库](https://github.com/cpython666/Spider-Project)
- [LearnSpider：爬虫刷题靶场](/projects/learn-spider/)
- [FuckSpider：反爬策略与代码示例](/projects/fuck-spider/)
- [IPProxyPool：爬虫代理池](/projects/ip-proxy-pool/)
- [返回项目列表](/projects/)

</ProjectDetail>
