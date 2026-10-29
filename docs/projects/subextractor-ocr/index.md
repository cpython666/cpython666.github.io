---
title: "SubExtractor-OCR：视频字幕提取器"
description: "SubExtractor-OCR 用抽帧、字幕区域裁剪和 OCR 把视频里的硬字幕提取成 SRT/TXT，提供 Qt 桌面界面、批量文件列表、进度和日志。"
keywords: "SubExtractor-OCR,视频字幕提取,OCR,字幕识别,SRT,TXT,UMI-OCR"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/subtitle-ocr.png"
project: true
repository: "https://github.com/cpython666/SubExtractor-OCR"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['OCR', '字幕提取', 'Qt 桌面', '视频']
const facts = [
  { label: '类型', value: '桌面字幕提取工具' },
  { label: '技术', value: 'Python + Qt/PySide6 + OpenCV' },
  { label: '输出', value: 'SRT / TXT' },
  { label: 'OCR', value: '本地 UMI-OCR 接口' },
]
const description = '把视频里有硬字幕的画面抽帧、裁出字幕区域，再交给 OCR 识别并合并成 SRT/TXT。不用再暂停视频一行行抄，适合整理课程、访谈和口播视频的文案。'
</script>

<ProjectDetail
  title="SubExtractor-OCR"
  english="视频字幕提取器"
  eyebrow="开源项目 · OCR 桌面工具"
  tagline="不用再暂停视频，一行行抄字幕。"
  :description="description"
  image="/imgs/app/subtitle-ocr.png"
  :image-width="788"
  :image-height="628"
  image-alt="SubExtractor-OCR 字幕提取器 2.0 界面"
  image-caption="字幕提取器 2.0 界面：批量文件、三段进度和运行日志。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/SubExtractor-OCR"
  quick-start="#start"
>

## 工作流程

1. 选择视频文件，可以一次加入多个。
2. 按设定频率抽帧，只保留画面。
3. 量取字幕所在的高度区间，作为裁剪区域。
4. 把裁剪出的字幕图片交给 OCR 识别。
5. 合并识别结果，输出 `SRT` 和 `TXT`。

适合字幕直接烧在画面里的视频。视频文件自带软字幕轨时，优先用播放器或 `ffmpeg` 直接提取字幕，速度和准确率都更好。

## 主要功能

<div class="feature-grid">
  <div class="feature-card">
    <h3>批量文件</h3>
    <p>2.0 界面支持把多个视频加入列表，逐个处理并在日志里显示进度。</p>
  </div>
  <div class="feature-card">
    <h3>可调抽帧</h3>
    <p>按每秒抽帧数控制采样密度；字幕变化越快，需要的采样越密。</p>
  </div>
  <div class="feature-card">
    <h3>字幕区域裁剪</h3>
    <p>只把字幕所在的高度区间送去 OCR，减少画面其他文字和背景干扰。</p>
  </div>
  <div class="feature-card">
    <h3>繁简转换</h3>
    <p>可选把识别结果从繁体转成简体，方便后续整理文案。</p>
  </div>
  <div class="feature-card">
    <h3>进度与日志</h3>
    <p>抽帧、识别、合并三段进度分开显示，出错时先看日志定位是哪一步。</p>
  </div>
  <div class="feature-card">
    <h3>本地 OCR</h3>
    <p>默认调用本机 UMI-OCR 的 HTTP 接口，不把视频或截图上传到云端。</p>
  </div>
</div>

## 本地运行 {#start}

先准备 Python 3.10+，安装依赖：

```bash
pip install PySide6 opencv-python qt_material numpy python-dotenv opencc
```

然后启动本机 UMI-OCR 的 HTTP 服务（默认地址 `http://127.0.0.1:1224/api/ocr`），再运行：

```bash
python main.py
```

如果 OCR 服务不在默认地址，用环境变量覆盖：

```bash
UMI_OCR_URL=http://127.0.0.1:1224/api/ocr python main.py
```

仓库里也有 `dist/` 打包目录和 `requirements.txt`；想直接下载安装包，可以先看仓库 Releases，没有现成包时再按源码运行。

## 使用边界

OCR 的准确率取决于字幕字体、背景、分辨率和视频压缩。字幕区域裁不准、字体太花或画面抖动时，识别结果会变差；批量处理前建议先拿一个视频试跑，确认字幕高度区间。

1.0 版本仍有一些限制：不同视频的字幕位置可能不同，批量化需要逐个确认区域；处理是单线程的，长视频会比较慢。仓库 README 里也列了后续改进方向。

## 相关入口

- [SubExtractor-OCR 仓库](https://github.com/cpython666/SubExtractor-OCR)
- [PyQt6_Apps：PyQt6 桌面小软件合集](/projects/pyqt6-apps/)
- [PyQt6 实战开发系列](/python/pyqt6-series/)
- [返回项目列表](/projects/)

</ProjectDetail>
