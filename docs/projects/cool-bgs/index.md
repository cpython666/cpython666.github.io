---
title: "CoolBgs：炫酷动态网页背景合集"
description: "CoolBgs 收录 16+ 个可直接嵌入网页的动态背景：粒子、星空、下雨、3D 飞机、流星雨等，提供独立 HTML 演示和 iframe 接入方式。"
keywords: "CoolBgs,动态背景,网页背景,Canvas,粒子效果,前端素材"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/coolbgs.webp"
project: true
repository: "https://github.com/cpython666/CoolBgs"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['动态背景', 'Canvas', '前端', 'iframe']
const facts = [
  { label: '类型', value: '动态背景合集' },
  { label: '数量', value: '16+ 个背景' },
  { label: '技术', value: 'Canvas / CSS / JS' },
  { label: '接入', value: '独立页面或 iframe' },
]
const description = '收录学习前端时收集和整理的动态网页背景：粒子、星空、下雨、3D 飞机、流星雨等。每个背景都是独立页面，可以直接打开看，也可以嵌到自己的站点里。'
</script>

<ProjectDetail
  title="CoolBgs"
  english="炫酷动态背景"
  eyebrow="开源项目 · 前端素材"
  tagline="给页面加一层会动的背景。"
  :description="description"
  image="/imgs/app/coolbgs.webp"
  :image-width="1024"
  :image-height="1024"
  image-alt="CoolBgs 炫酷动态网页背景合集封面"
  image-caption="动态背景合集封面。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/CoolBgs"
  quick-start="#start"
>

## 怎么用 {#start}

每个背景都是独立的 HTML 页面，最省事的接入方式是把它放进一个铺满视口的 iframe，再把自己的内容放在上层：

```html
<iframe src="./bgs/1/index.html" title="动态背景"></iframe>
```

```css
iframe {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  z-index: -1;
}
```

自己的内容需要 `position: relative` 或 `position: absolute`，否则可能被 iframe 盖住。仓库根目录的 `index.html` 是一个带侧边栏的预览页，可以在这里切换不同背景，再打开对应的 `bgs/<编号>/index.html` 单独使用。

## 有哪些背景

- 粒子类：彩色粒子、白色粒子、气泡轨迹、群星飞舞、满天繁星
- 场景类：七彩云雾、旋转魔方、3D 飞机环球飞行、3D 飞机、火箭飞行、火箭升空、流星雨、星海田野、下雨
- 科技类：星空之环、科技六角形

根目录的 `bgs2` 里还有一批后续收集的背景。每个目录都有 `preview.*` 预览图，README 里也给出了 iframe 和固定定位的示例。

## 使用说明

仓库 README 注明：素材均来源于网络，收集整理无意冒犯，如有侵权可联系删除。个人玩或者学习可以直接用；如果要公开部署、商用或放进商业项目，请自己确认素材授权，必要时替换成自己制作的背景。

动态背景会持续跑 Canvas / CSS 动画，手机上更耗电；只想要氛围、不追求强交互时，优先选粒子密度低或帧率温和的效果。

## 相关入口

- [CoolBgs 仓库](https://github.com/cpython666/CoolBgs)
- [AwesomeWeb：前端小项目与特效合集](/projects/awesome-web/)
- [返回项目列表](/projects/)

</ProjectDetail>
