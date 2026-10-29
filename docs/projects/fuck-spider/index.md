---
title: "FuckSpider：反爬策略与代码示例"
description: "FuckSpider 收录网页内容防复制、无限 debugger、扣代码、JS 混淆、SVG 映射、XPath 盲区和常见 Hook 等反爬主题的讲解与代码示例。"
keywords: "FuckSpider,反爬虫,JS混淆,无限debugger,Hook,SVG反爬,XPath"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/fuck-spider.jpeg"
project: true
repository: "https://github.com/cpython666/FuckSpider"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['反爬', 'JavaScript', 'Hook', '逆向']
const facts = [
  { label: '类型', value: '反爬学习仓库' },
  { label: '内容', value: '前端反爬 / JS' },
  { label: '形式', value: '文档 + 代码' },
  { label: '配套', value: '视频讲解' },
]
const description = '把常见的反爬手段拆开讲：页面内容防复制、无限 debugger、扣代码、JS 混淆、SVG 映射、XPath 盲区和常见 Hook，每个主题尽量配可运行的代码。'
</script>

<ProjectDetail
  title="FuckSpider"
  english="反爬策略合集"
  eyebrow="开源项目 · 反爬学习"
  tagline="看懂页面是怎么拦你的，再决定怎么绕。"
  :description="description"
  image="/imgs/app/fuck-spider.jpeg"
  :image-width="1024"
  :image-height="1024"
  image-alt="FuckSpider 反爬策略项目封面"
  image-caption="项目封面。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/FuckSpider"
  quick-start="#start"
>

## 包含哪些主题

<div class="feature-grid">
  <div class="feature-card">
    <h3>内容防复制</h3>
    <p>页面禁止选中、右键、复制，或者用 CSS / 遮罩干扰阅读的常见做法与破解思路。</p>
  </div>
  <div class="feature-card">
    <h3>无限 debugger</h3>
    <p>用 debugger 语句拖慢调试的手段，以及条件断点、禁用断点等处理方式。</p>
  </div>
  <div class="feature-card">
    <h3>扣代码 / 关机</h3>
    <p>把关键 JS 逻辑从页面里拆出来单独运行，减少反复在浏览器里跟踪的成本。</p>
  </div>
  <div class="feature-card">
    <h3>JS 混淆</h3>
    <p>变量名、控制流、字符串数组等混淆方式，以及还原和调试的基本路径。</p>
  </div>
  <div class="feature-card">
    <h3>SVG 映射反爬</h3>
    <p>把文字拆成 SVG 路径或映射表，让页面源码里拿不到可直接读取的文本。</p>
  </div>
  <div class="feature-card">
    <h3>XPath 盲区与 Hook</h3>
    <p>页面结构上的解析陷阱，以及用 Hook 观察函数调用、参数和返回值的思路。</p>
  </div>
</div>

## 怎么用 {#start}

每个主题是一个独立目录，里面有说明、示例代码和配套视频入口。建议按“先手动复现拦截 → 再看代码 → 最后自己改一版”的顺序看：

1. 打开对应目录的 README，确认演示页面和运行方式。
2. 在浏览器里手动触发一次反爬行为，观察网络、DOM 和断点。
3. 对照仓库里的代码，理解它是怎么检测、怎么拦截的。
4. 改一个参数或换一种写法，确认自己真的理解了。

仓库没有统一的启动入口，不同目录可能是静态 HTML、浏览器脚本或 Node 代码；按各自目录里的说明运行。

## 使用边界

这些内容只适合在授权范围内做安全研究、爬虫学习和前端调试。不要用它们绕过付费墙、窃取隐私数据或对没有授权的站点做压力测试。技术本身没有立场，使用场景有。

## 相关入口

- [FuckSpider 仓库](https://github.com/cpython666/FuckSpider)
- [LearnSpider：爬虫刷题靶场](/projects/learn-spider/)
- [Spider-Project：爬虫实操项目合集](/projects/spider-project/)
- [返回项目列表](/projects/)

</ProjectDetail>
