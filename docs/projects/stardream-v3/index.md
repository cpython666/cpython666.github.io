---
title: "StarDream-v3：iTab 风格导航起始页"
description: "StarDream-v3 是星梦启航 V3 版本：Vue 3 + Vite + Vue Router 搭的 iTab 风格起始页，包含分类卡片、搜索跳转、时钟、自定义弹窗和动态背景。"
keywords: "StarDream-v3,星梦启航,导航页,iTab,Vue,Vite,起始页"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/sd-3.png"
project: true
repository: "https://github.com/cpython666/StarDream-v3"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['Vue', 'iTab', '导航页', '动态背景']
const facts = [
  { label: '类型', value: '导航起始页' },
  { label: '技术', value: 'Vue 3 + Vite' },
  { label: '路由', value: 'Vue Router（hash）' },
  { label: '模块', value: '应用 / 代码 / 设计 / 摸鱼' }
]
const description = '星梦启航 V3：模仿 iTab 的卡片式起始页，左侧是应用、代码、设计、摸鱼分类，中间是时钟和搜索框，背景可以换成图片或视频。'
</script>

<ProjectDetail
  title="StarDream-v3"
  english="星梦启航 V3"
  eyebrow="开源项目 · 导航起始页"
  tagline="把常用站点和工具，收进一张会呼吸的桌面。"
  :description="description"
  image="/imgs/app/sd-3.png"
  :image-width="2840"
  :image-height="1434"
  image-alt="StarDream-v3 首页：时钟、搜索框、分类侧栏和动态壁纸"
  image-caption="V3 首页：时钟、搜索、分类侧栏与动态壁纸。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/StarDream-v3"
  quick-start="#start"
>

## 页面组成

V3 把起始页拆成几个可以互相切换的模块：

- **AppList**：应用卡片，按网格排列，带搜索。
- **CodeList**：常用代码/工具入口。
- **DesignList**：设计资源分类。
- **PlayList**：摸鱼和娱乐入口。

还有搜索栏、时钟、每日一句、侧边栏、应用卡片和自定义弹窗。路由使用 hash 模式，切换分类时地址会变成 `#/code`、`#/design`、`#/Play` 这样的形式。

## 交互与视觉

- iTab 风格的卡片网格和分类侧栏。
- 搜索框可以直接跳转到搜索引擎。
- 自定义弹窗和过渡动画。
- 背景支持图片 / 视频，窗口大小变化时重新计算应用列数。
- 深色背景搭配半透明面板，适合做个人浏览器起始页。

## 本地运行 {#start}

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

技术栈是 Vue 3 + Vite + Vue Router + ECharts + jQuery。项目没有单独的 README，部分应用数据仍是占位内容；想改成自己的导航页，先看 `src/components/` 和 `src/router/index.js`，把数据源和链接替换掉。

## 说明

这是星梦启航早期的 V3 实验版本，当前站点已经迁移到 VitePress。它更适合作为“iTab 风格起始页”的代码参考，不建议直接当成成熟产品部署；尤其是登录、数据持久化和移动端适配都需要自己补。

## 相关入口

- [StarDream-v3 仓库](https://github.com/cpython666/StarDream-v3)
- [StarDream-1：V1 导航页](/projects/stardream-1/)
- [StarDream-Intro：品牌介绍页](/projects/stardream-intro/)
- [返回项目列表](/projects/)

</ProjectDetail>
