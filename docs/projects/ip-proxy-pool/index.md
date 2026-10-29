---
title: "IPProxyPool：Redis + FastAPI 爬虫代理池"
description: "IPProxyPool 是一个轻量级爬虫代理池：采集公开代理、用 Redis 评分、定时检测可用性，并通过 FastAPI 提供查询接口；支持按测试域名分池和多种检测客户端。"
keywords: "IPProxyPool,代理池,爬虫代理,Redis,FastAPI,免费代理"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/ipproxy.jpeg"
project: true
repository: "https://github.com/cpython666/IPProxyPoolPro"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['代理池', 'Redis', 'FastAPI', '爬虫基础设施']
const facts = [
  { label: '类型', value: '爬虫代理池' },
  { label: '存储', value: 'Redis sorted set' },
  { label: '接口', value: 'FastAPI' },
  { label: '检测', value: '定时检测 + 评分' },
]
const description = '从公开代理源采集候选，按可用性评分存进 Redis，定时检测并在失败时扣分；最后用 FastAPI 把满分代理提供给采集程序。'
</script>

<ProjectDetail
  title="IPProxyPool"
  english="代理池"
  eyebrow="开源项目 · 爬虫基础设施"
  tagline="把免费代理变成可查询、可评分的池子。"
  :description="description"
  image="/imgs/app/ipproxy.jpeg"
  :image-width="1024"
  :image-height="1024"
  image-alt="IPProxyPool 爬虫代理池项目封面"
  image-caption="项目封面。查询接口返回的代理示例见下方截图。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/IPProxyPoolPro"
  quick-start="#start"
>

## 它解决什么问题

免费代理列表最麻烦的不是“找不到”，而是“不知道哪个还能用”。这个项目把采集、入库、检测和查询拆成几个可以独立启动的部分：先抓取公开代理源，预测试后写入 Redis；后台定时全量检测，成功的代理置为满分，失败的按步长扣分，扣到 0 就删除。

采集程序只需要向 API 要当前可用的代理，不用自己维护一堆失效地址。

## 主要能力

<div class="feature-grid">
  <div class="feature-card">
    <h3>采集与预测试</h3>
    <p>按配置的代理源采集，入库前先请求测试站点；支持国内 / 国外 / 全部来源。</p>
  </div>
  <div class="feature-card">
    <h3>Redis 评分</h3>
    <p>新代理初始 50 分，检测成功置为 100，失败扣分，分数归零后从池中删除。</p>
  </div>
  <div class="feature-card">
    <h3>按域名分池</h3>
    <p>代理按“用哪个测试域名测通”分开存储，例如 <code>proxies:baidu.com</code> 与 <code>proxies:httpbin.org</code>。</p>
  </div>
  <div class="feature-card">
    <h3>多种检测客户端</h3>
    <p>支持 requests、curl_cffi、requests_go；可以按网络情况调整采集和预测试并发。</p>
  </div>
  <div class="feature-card">
    <h3>HTTP API</h3>
    <p>提供满分代理、全部代理、统计信息和单代理测试接口，FastAPI 自带 `/docs` 文档。</p>
  </div>
  <div class="feature-card">
    <h3>重启不丢数据</h3>
    <p>代理保存在 Redis，重新启动后会在已有数据上继续采集和检测。</p>
  </div>
</div>

<figure class="project-figure">
  <img src="/imgs/projects/ip-proxy-pool/api.webp" alt="IPProxyPool 查询接口返回的代理列表截图" width="595" height="403" loading="lazy" decoding="async" />
  <figcaption>查询接口返回的代理列表示例；实际输出以你的 Redis 数据为准。</figcaption>
</figure>

## 快速开始 {#start}

先准备 Python 3.10+ 和 Redis，然后：

```bash
git clone https://github.com/cpython666/IPProxyPoolPro.git
cd IPProxyPoolPro
pip install -r requirements.txt
# 启动 Redis 后，一键启动 Web、采集和检测
python run.py
```

也可以拆开跑：

```bash
python run.py web       # 只启动 FastAPI
python run.py spider    # 只采集代理
python run.py test      # 只检测 Redis 里已有代理
```

默认 API 监听 `0.0.0.0:8000`，打开 `http://localhost:8000/docs` 可以看接口文档。代理源、Redis、测试站点、并发数等配置在 `config.py` 和 `.env` 中维护，完整说明见仓库 README。

## 安全边界

免费代理是不可信输入：它们可能窃听明文流量、篡改响应、记录凭据，也可能随时失效。不要通过免费代理传输账号、Cookie、令牌、隐私数据或生产机密。

当前公开仓库是 IPProxyPoolPro，页面和卡片的 GitHub 按钮都指向这里；原来的 IPProxyPool 仓库地址已不可访问。这个仓库是早期版本，同作者还有一个持续重构的安全加固版 [IP-Proxy-Pool](https://github.com/cpython666/IP-Proxy-Pool)，需要更完整的鉴权、限流和反馈机制时可以从那边开始。

另外，免费代理源和页面结构经常变化，`config.py` 里的解析规则可能失效；抓不到代理时先检查目标源是否还能访问。

## 相关入口

- [IPProxyPoolPro 仓库](https://github.com/cpython666/IPProxyPoolPro)
- [IP-Proxy-Pool 安全加固版](https://github.com/cpython666/IP-Proxy-Pool)
- [Spider-Project：爬虫实操项目合集](/projects/spider-project/)
- [LearnSpider：爬虫刷题靶场](/projects/learn-spider/)
- [返回项目列表](/projects/)

</ProjectDetail>
