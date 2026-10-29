---
title: "AwesomeWeb：前端小项目与特效合集"
description: "AwesomeWeb 收录学习前端时做的小项目、Canvas 动画、鼠标特效、轮播、弹幕、网页宠物和 jQuery 插件，适合找灵感或直接拆代码。"
keywords: "AwesomeWeb,前端小项目,Canvas,网页特效,jQuery,弹幕,网页宠物"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/awasomeweb.png"
project: true
repository: "https://github.com/cpython666/AwesomeWeb"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['前端', 'Canvas', '网页特效', '插件']
const facts = [
  { label: '类型', value: '前端练习合集' },
  { label: '技术', value: 'HTML / CSS / JS / Canvas' },
  { label: '内容', value: '30+ 个 demo' },
  { label: '使用', value: '打开对应目录即可' },
]
const description = '学习前端过程中攒下来的小项目：Canvas 动画、鼠标拖尾、弹幕、轮播、网页宠物、提示框插件和几个完整页面。每个目录都能单独打开，适合找灵感或拆代码。'
</script>

<ProjectDetail
  title="AwesomeWeb"
  english="前端小项目合集"
  eyebrow="开源项目 · 前端练习"
  tagline="把好玩的交互，一个个做出来。"
  :description="description"
  image="/imgs/app/awasomeweb.png"
  :image-width="1200"
  :image-height="828"
  image-alt="AwesomeWeb 前端小项目合集封面"
  image-caption="Canvas 粒子 / 爆炸类演示截图。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/AwesomeWeb"
  quick-start="#start"
>

## 里面有什么

<div class="feature-grid">
  <div class="feature-card">
    <h3>Canvas 动画</h3>
    <p>粒子、爆炸、星空、飞鸟和“Canvas 百战成神”系列练习，适合练手绘循环和坐标系。</p>
  </div>
  <div class="feature-card">
    <h3>页面交互</h3>
    <p>鼠标拖尾、点击爆炸、文字出现消失、弹幕、轮播图和提示框插件。</p>
  </div>
  <div class="feature-card">
    <h3>完整页面</h3>
    <p>GitHub 注册页动态星空、商城作业、CSDN 皮肤、ECharts 示例等可以整体参考的页面。</p>
  </div>
  <div class="feature-card">
    <h3>小游戏与实验</h3>
    <p>愤怒的南瓜、网页宠物、量子纠缠标签页通讯、Mac 窗口最小化动画等偏实验的 demo。</p>
  </div>
</div>

## 怎么跑 {#start}

大部分目录是纯静态页面，直接打开 `index.html` 就能看。涉及 `fetch`、模块加载或跨目录资源的 demo，建议在该目录起一个本地静态服务：

```bash
cd AwesomeWeb
python -m http.server 8000
# 打开 http://127.0.0.1:8000
```

部分示例依赖 jQuery、Canvas 或旧版浏览器 API，代码风格也保留了学习过程中的不同阶段。用之前先看对应目录里的文件和说明，按需替换依赖。

## 适合谁

- 前端初学者想找可以运行、可以改的小 demo。
- 需要给页面加一个鼠标特效、粒子背景或弹幕效果的人。
- 正在准备课程作业 / 作品集，想参考页面结构的人。

仓库里部分素材可能来自网络或第三方示例；如果要公开部署或商用，请先确认对应目录里的素材授权。

## 相关入口

- [AwesomeWeb 仓库](https://github.com/cpython666/AwesomeWeb)
- [CoolBgs：炫酷动态网页背景合集](/projects/cool-bgs/)
- [返回项目列表](/projects/)

</ProjectDetail>
