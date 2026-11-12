---
title: "cpython666.github.io：星梦启航博客源码"
description: "星梦启航是使用 VitePress + Vue 搭建、部署在 GitHub Pages 的个人博客：文章导航、项目展示、在线工具箱、提示词、评论、搜索和访问统计都在同一套站点里。"
keywords: "cpython666.github.io,星梦启航,VitePress,Vue,个人博客,GitHub Pages"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/cpython666.png"
project: true
repository: "https://github.com/cpython666/cpython666.github.io"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['VitePress', 'Vue', '个人博客', 'GitHub Pages']
const facts = [
  { label: '类型', value: '个人博客 / 知识库' },
  { label: '技术', value: 'VitePress + Vue' },
  { label: '部署', value: 'GitHub Pages' },
  { label: '内容', value: '文章 / 项目 / 工具' },
]
const description = '你现在看到的这个站点。用 VitePress 和 Vue 搭起来，文章、项目、提示词、在线工具和资源导航都在同一套代码里，推送到 GitHub 后由 Actions 构建并部署到 Pages。'
</script>

<ProjectDetail
  title="cpython666.github.io"
  english="星梦启航"
  eyebrow="开源项目 · 本站源码"
  tagline="一个持续生长的个人知识库。"
  :description="description"
  image="/imgs/app/cpython666.png"
  :image-width="2050"
  :image-height="1226"
  image-alt="星梦启航博客封面"
  image-caption="站点封面：文章、项目与工具都收在同一处。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/cpython666.github.io"
  quick-start="#start"
>

## 站点包含什么

<div class="feature-grid">
  <div class="feature-card">
    <h3>文章与导航</h3>
    <p>按爬虫、Python、Web3、AI 工具、程序员成长等方向整理文章，导航从侧边栏配置自动生成。</p>
  </div>
  <div class="feature-card">
    <h3>项目展示</h3>
    <p>开源项目和教程合集放在一起，按分类筛选、搜索，并实时读取 GitHub Stars。</p>
  </div>
  <div class="feature-card">
    <h3>在线工具箱</h3>
    <p>cURL 转 Requests、URL / Base64 编解码、O10、图片分割等工具，全部在浏览器本地处理。</p>
  </div>
  <div class="feature-card">
    <h3>提示词与资源</h3>
    <p>独立提示词库和资源导航，支持分类、搜索、复制和分享定位。</p>
  </div>
  <div class="feature-card">
    <h3>搜索与评论</h3>
    <p>VitePress local search 做站内搜索，giscus 与 Waline 按页面规则挂载评论。</p>
  </div>
  <div class="feature-card">
    <h3>统计与主题</h3>
    <p>GA4 页面浏览、hits.sh 本页计数、明暗主题、自定义首页和图片查看器。</p>
  </div>
</div>

## 本地运行 {#start}

需要 Node.js 24 系列（工作流当前固定 `24.22.1`）和 npm：

```bash
npm ci
npm run docs:dev -- --host 127.0.0.1 --strictPort
```

默认开发地址是 `http://127.0.0.1:8080`。构建产物输出到 `docs/.vitepress/dist`：

```bash
npm run docs:build
```

## 目录结构

- `docs/`：文章、页面和公开静态资源。
- `docs/.vitepress/config.mjs`：顶部导航、侧边栏、搜索、SEO、sitemap 和重定向。
- `docs/.vitepress/theme/`：主题扩展、评论、访问统计、图片查看器和吉祥物。
- `docs/projects/`：项目展示和项目详情页。
- `docs/tools/`：在线工具页面和面板。
- `scripts/`：内容生成、SEO 和页面回归检查。

这个仓库包含作者自己的文章、会员内容和站点配置，不是通用博客模板。想拿它做自己的站点，建议只参考组件和配置方式，不要把文章内容一起复制走。

## 相关入口

- [GitHub 仓库](https://github.com/cpython666/cpython666.github.io)
- [关于站长](/web-intro/)
- [文章导航](/navigation/)
- [在线工具箱](/tools/)
- [返回项目列表](/projects/)

</ProjectDetail>
