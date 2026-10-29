---
title: "PyQt6_Apps：PyQt6 桌面小软件合集"
description: "PyQt6_Apps 收录多个 PyQt6 小软件：纯色/渐变图片生成器、自我介绍生成器、帅哥验证器、磨砂动态背景等，每个应用独立目录、可直接运行。"
keywords: "PyQt6_Apps,PyQt6,桌面应用,Python,GUI,渐变图片生成器"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/projects/pyqt6-apps/gradient.webp"
project: true
repository: "https://github.com/cpython666/PyQt6_Apps"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['PyQt6', '桌面应用', 'Python', '练习']
const facts = [
  { label: '类型', value: '桌面应用合集' },
  { label: '技术', value: 'Python + PyQt6' },
  { label: '内容', value: '8+ 个小软件' },
  { label: '运行', value: '每个目录独立' },
]
const description = '把学习 PyQt6 过程中做的小软件集中在一起：纯色图片、渐变图片、自我介绍、帅哥验证器、磨砂动态背景等。每个应用一个目录，适合直接拿来用，也适合拆开看界面和信号槽怎么写。'
</script>

<ProjectDetail
  title="PyQt6_Apps"
  english="PyQt6 小软件合集"
  eyebrow="开源项目 · 桌面应用练习"
  tagline="用一个个小工具，把 PyQt6 学会。"
  :description="description"
  image="/imgs/projects/pyqt6-apps/gradient.webp"
  :image-width="1252"
  :image-height="809"
  image-alt="PyQt6_Apps 渐变图片生成器界面"
  image-caption="渐变图片生成器：参数、色标和实时预览。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/PyQt6_Apps"
  quick-start="#start"
>

## 包含哪些软件

- **渐变图片生成器**：设置尺寸、角度、颜色和百分比，实时预览并导出渐变图。
- **纯色图片生成器**：选颜色、透明度、尺寸，生成纯色背景图。
- **自我介绍生成器**：把个人信息和样式套进固定模板，生成介绍图片。
- **帅哥验证器**：带点娱乐性质的 PyQt6 小工具。
- **磨砂动态背景**：用 Qt 绘制动态磨砂/光线背景的实验。
- **手写字体图片生成器**：后来独立成 [星笺 / HandwritingGenerator](/projects/handwriting-generator/)。
- **字幕提取器**：后来独立成 [SubExtractor-OCR](/projects/subextractor-ocr/)。

仓库里还有计算器、任务清单、图片浏览器等未完成目录，适合拿来继续练手，不要当成成品。

<figure class="project-figure project-figure--paper">
  <img src="/imgs/projects/pyqt6-apps/image-creator.webp" alt="PyQt6_Apps 纯色图片生成器界面" width="377" height="414" loading="lazy" decoding="async" />
  <figcaption>纯色图片生成器：颜色、透明度、尺寸和创建按钮。</figcaption>
</figure>

## 运行方式 {#start}

```bash
git clone https://github.com/cpython666/PyQt6_Apps.git
cd PyQt6_Apps
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install PyQt6
python GradientGenerator/GradientGenerator.py
```

每个应用的启动文件在各自目录里，例如 `ImageCreator/ImageCreator.py`、`磨砂动态背景/main.py`。部分应用需要额外依赖（如 OpenCV、NumPy、Pillow），先看对应目录的 `requirements.txt` 或导入语句再装。

## 说明

这些代码是学习过程中的产物，界面风格和工程结构不统一：有的直接用绝对定位，有的把逻辑全写在窗口类里，有的功能还没收尾。拿来学“一个窗口 + 布局 + 信号槽 + 文件对话框”是够的；要做正式桌面产品，建议再补配置管理、异常处理、打包和测试。

## 相关入口

- [PyQt6_Apps 仓库](https://github.com/cpython666/PyQt6_Apps)
- [星笺 HandwritingGenerator](/projects/handwriting-generator/)
- [SubExtractor-OCR 字幕提取器](/projects/subextractor-ocr/)
- [PyQt6 实战开发系列](/python/pyqt6-series/)
- [返回项目列表](/projects/)

</ProjectDetail>
