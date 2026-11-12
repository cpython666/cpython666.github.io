---
title: "LearnSpider 爬虫百战成神：Django 爬虫刷题靶场"
description: "LearnSpider（爬虫百战成神）是一个用 Django + DRF 搭建的爬虫练习网站：题目由易到难，每题配套示例代码、文档讲解和视频演示，覆盖 requests、Scrapy、Selenium、DrissionPage 与常见反爬。"
keywords: "LearnSpider,爬虫百战成神,爬虫练习网站,爬虫靶场,Django,DRF,反爬"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/learn-spider.jpeg"
project: true
repository: "https://github.com/cpython666/LearnSpider"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['爬虫靶场', 'Django', '一题多解', '从零到进阶']
const facts = [
  { label: '类型', value: '练习网站 / 刷题靶场' },
  { label: '技术栈', value: 'Django + DRF + jQuery' },
  { label: '题库', value: '初级到高级' },
  { label: '形态', value: 'Web 应用' },
]
const description = '一个用 Django + DRF 搭起来的爬虫练习网站：题目由易到难，每题配套示例代码、文档讲解和视频演示，覆盖 requests、Scrapy、Selenium、DrissionPage 与常见反爬。'
</script>

<ProjectDetail
  title="LearnSpider"
  english="爬虫百战成神"
  eyebrow="开源项目 · 爬虫刷题靶场"
  tagline="在刷题里学会爬虫，而不是看完就忘。"
  :description="description"
  image="/imgs/app/learn-spider.jpeg"
  :image-width="1024"
  :image-height="1024"
  image-alt="LearnSpider 爬虫百战成神项目封面"
  image-caption="题库、示例和讲解放在同一个站点里。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/LearnSpider"
  quick-start="#deploy"
>

## 为什么做这个靶场

只看教程很容易有一种“学会了”的错觉，过几天想动手又不知道从哪开始。LearnSpider 把爬虫知识点做成了可以刷的题目：每道题都有目标页面、难度和练习方向，做完再对照示例代码与讲解。

它的目标不是把某个框架讲全，而是让你在一次次请求、解析、调试和绕过限制的过程里，形成自己的排查顺序。

## 题库覆盖什么

<div class="feature-grid">
  <div class="feature-card">
    <h3>请求与解析</h3>
    <p>从 requests、lxml 到接口请求、静态页面解析，先把“拿到数据”这件事跑通。</p>
  </div>
  <div class="feature-card">
    <h3>自动化工具</h3>
    <p>Selenium、DrissionPage 的等待、点击、截图和页面状态判断，用来处理浏览器里才有的数据。</p>
  </div>
  <div class="feature-card">
    <h3>反爬专题</h3>
    <p>接口加密、JS 混淆、SVG / CSS / 雪碧图反爬和 WASM 等主题，按题目逐步拆。</p>
  </div>
  <div class="feature-card">
    <h3>一题多解</h3>
    <p>同一道题尽量给出多种实现，配合文档和视频演示，方便比较不同工具的边界。</p>
  </div>
</div>

## 本地跑起来 {#deploy}

```bash
git clone https://github.com/cpython666/LearnSpider.git
cd LearnSpider
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

浏览器打开 `http://127.0.0.1:8000`。数据库连接和题目数据按仓库 `README` 与 `LearnSpider/settings.py` 的说明配置；如果在线上部署，记得修改默认账号和密钥。

## 适合谁

- 学完 Python 基础，想找题目练手的学生或转行者。
- 正在学 requests、Scrapy、Selenium、DrissionPage，需要真实页面练手的人。
- 想要一个可以自己部署、自己加题的爬虫练习环境的人。

项目仅用于学习和交流，请遵守目标站点的规则与相关法律法规。

## 相关入口

- [LearnSpider 仓库](https://github.com/cpython666/LearnSpider)
- [Spider-Project：爬虫实操项目合集](/projects/spider-project/)
- [FuckSpider：反爬策略与代码示例](/projects/fuck-spider/)
- [DrissionPage 自动化数据采集系列](/spider/dp-series/)
- [返回项目列表](/projects/)

</ProjectDetail>
