---
title: "StarDream-1：星梦启航 V1 导航页"
description: "StarDream-1 是星梦启航最早的导航页版本：从静态 HTML/CSS 到 jQuery + Node.js，保留搜索、网站合集、卡片开关和多个迭代目录。"
keywords: "StarDream-1,星梦启航,导航页,jQuery,Node.js,早期版本"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/sd-1.png"
project: true
repository: "https://github.com/cpython666/StarDream-1"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['导航页', 'jQuery', 'Node.js', '早期版本']
const facts = [
  { label: '类型', value: '导航起始页' },
  { label: '技术', value: 'HTML / CSS / jQuery / Node.js' },
  { label: '版本', value: 'V1' },
  { label: '内容', value: '7 个迭代目录' },
]
const description = '星梦启航最早的版本。从一张静态的网址导航页开始，逐步加上搜索、按钮、卡片开关、拖拽和 Node.js 数据，最后演进到后来的 V3。'
</script>

<ProjectDetail
  title="StarDream-1"
  english="星梦启航 V1"
  eyebrow="开源项目 · 早期版本"
  tagline="一切从一张静态导航页开始。"
  :description="description"
  image="/imgs/app/sd-1.png"
  :image-width="2104"
  :image-height="1298"
  image-alt="StarDream-1 V1 搜索页：双翼飞机与搜索框"
  image-caption="V1 搜索页：双翼飞机与搜索框。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/StarDream-1"
  quick-start="#start"
>

## 迭代过程

仓库把每个阶段都保留成一个独立目录，可以直接对照它是怎么一步步长出来的：

1. `01.网站导航-无按钮1.0`：静态导航页。
2. `02.网站导航-有按钮1.1`：加上按钮和基础交互。
3. `03.网站导航-有checked`：加入选中状态。
4. `04.网站导航-非拟态`：换掉拟态风格。
5. `05.网站导航-加name前`：继续调整卡片结构。
6. `06.可拖拽前`：拖拽和布局调整。
7. `07.网站导航-可视化-nodejs`：用 Node.js 提供数据，页面开始动态化。

<figure class="project-figure">
  <img src="/imgs/projects/stardream-1/card.webp" alt="StarDream-1 卡片式网站合集页面截图" width="1797" height="823" loading="lazy" decoding="async" />
  <figcaption>卡片式网站合集：分类侧栏、搜索和开关。</figcaption>
</figure>

## 当时做了什么

- 搜索引擎切换和关键词搜索。
- 网站合集按分类展示，卡片可以开关。
- 自定义背景、双翼飞机装饰和拟态/非拟态两套视觉。
- 后期用 Node.js 提供数据，页面不再写死链接。
- README 里保留了“图片没有用精灵图、仓库因视频素材过大”等当时的自我复盘。

## 怎么跑 {#start}

静态版本直接进入对应目录打开 `index.html`：

```text
StarDream-1/
├── 01.网站导航-无按钮1.0/
├── 02.网站导航-有按钮1.1/
├── ...
└── 07.网站导航-可视化-nodejs/
```

用浏览器打开对应目录的 `index.html` 即可。

Node.js 版本需要进入 `07.网站导航-可视化-nodejs`，按目录里的 `package.json` 安装依赖后启动。老项目依赖的 Node 版本较旧，直接在新版本 Node 上跑可能需要小改。

## 说明

这是历史版本，里面的外链、样式和浏览器兼容性都停留在当时。保留它的意义主要是看一个个人站点从静态页到动态数据的演进过程；当前博客已经迁移到 VitePress，不再使用这套导航页。

## 相关入口

- [StarDream-1 仓库](https://github.com/cpython666/StarDream-1)
- [StarDream-v3：iTab 风格导航页](/projects/stardream-v3/)
- [StarDream-Intro：品牌介绍页](/projects/stardream-intro/)
- [cpython666.github.io：当前博客源码](/projects/cpython666-github-io/)
- [返回项目列表](/projects/)

</ProjectDetail>
