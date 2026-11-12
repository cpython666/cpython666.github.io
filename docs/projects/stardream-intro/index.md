---
title: "StarDream-Intro：星梦启航品牌介绍页"
description: "StarDream-Intro 是星梦启航的品牌介绍页：Vue 3 + fullPage.js 整页滚动，anime.js 让日月沿 SVG 轨迹运动，Typed.js 打字机标语，背景支持颜色、图片、网页和视频。"
keywords: "StarDream-Intro,星梦启航,介绍页,Vue,fullPage.js,anime.js,Typed.js"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/sd-intro.png"
project: true
repository: "https://github.com/cpython666/StarDream-Intro"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['Vue', '整页滚动', 'SVG 动画', '打字机']
const facts = [
  { label: '类型', value: '品牌介绍页' },
  { label: '技术', value: 'Vue 3 + fullPage.js' },
  { label: '动画', value: 'anime.js / Typed.js' },
  { label: '背景', value: '颜色 / 图片 / 网页 / 视频' },
]
const description = '为「星梦启航」做的品牌介绍页：一屏一屏讲故事，日月沿 SVG 轨迹运动，标语用打字机逐字出现，背景可以是纯色、图片、网页或视频。'
</script>

<ProjectDetail
  title="StarDream-Intro"
  english="星梦启航介绍页"
  eyebrow="开源项目 · 品牌展示页"
  tagline="把「星梦启航」讲成一个可以滚动的故事。"
  :description="description"
  image="/imgs/app/sd-intro.png"
  :image-width="2396"
  :image-height="1378"
  image-alt="StarDream-Intro 首屏：星空、帆船与打字机标语"
  image-caption="首屏：星空、帆船与打字机标语。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/StarDream-Intro"
  quick-start="#start"
>

## 页面结构

介绍页拆成几个全屏 section：欢迎、标语、介绍、服务、联系方式。滚动由 `fullpage.js` 接管，每一屏进入时再触发自己的文字和图形动画。

首屏用 SVG 路径让太阳和月亮绕轨道运动，中心的帆船保持不动；下方标语用 `Typed.js` 循环打字。背景组件支持四种类型：

- `color`：纯色背景
- `image`：图片背景
- `webpage`：用 iframe 嵌入网页
- `video`：循环播放的视频

## 技术栈

- Vue 3 + Vue CLI
- `fullpage.js` 整页滚动
- `anime.js` 路径动画
- `Typed.js` 打字机效果
- `letterize.js` 文字拆分动画

## 本地运行 {#start}

```bash
npm install
npm run serve
```

生产构建：

```bash
npm run build
```

`public/imgs/` 里放着帆船、太阳、月亮等 SVG 资源；背景图片或视频需要自己放进 `public/` 再在页面配置里引用。

## 说明

这是早期的品牌展示页，文案和动画节奏都偏实验；现在的站点已经迁移到 VitePress。想参考整页滚动、SVG 轨迹和打字机组合时，这个仓库仍然是一个完整的例子。

## 相关入口

- [StarDream-Intro 仓库](https://github.com/cpython666/StarDream-Intro)
- [StarDream-v3：iTab 风格导航页](/projects/stardream-v3/)
- [StarDream-1：V1 导航页](/projects/stardream-1/)
- [返回项目列表](/projects/)

</ProjectDetail>
