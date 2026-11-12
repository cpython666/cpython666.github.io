---
title: "crawlab-demo：Docker 一键启动 Crawlab"
description: "crawlab-demo 提供 Crawlab + MongoDB 的 docker-compose 配置和持久化目录，一条命令启动爬虫管理平台，适合本地试用和部署参考。"
keywords: "crawlab-demo,Crawlab,Docker Compose,MongoDB,爬虫管理平台"
layout: home
markdownStyles: false
sidebar: false
image: "/imgs/app/crawlab-demo.png"
project: true
repository: "https://github.com/cpython666/crawlab-demo"
---

<script setup>
import ProjectDetail from '../ProjectDetail.vue'

const tags = ['Docker', 'Crawlab', 'MongoDB', '爬虫管理']
const facts = [
  { label: '类型', value: 'Docker 部署示例' },
  { label: '服务', value: 'Crawlab + MongoDB' },
  { label: '端口', value: '8080' },
  { label: '数据', value: '本地卷持久化' },
]
const description = '一个可以直接参考的 Crawlab 部署示例：用 docker compose 同时拉起 Crawlab 主节点和 MongoDB，把元数据、任务日志和数据库挂到本地目录，打开 8080 就能用。'
</script>

<ProjectDetail
  title="crawlab-demo"
  english="Crawlab 示例"
  eyebrow="开源项目 · 部署示例"
  tagline="一条 docker compose，把爬虫管理平台跑起来。"
  :description="description"
  image="/imgs/app/crawlab-demo.png"
  :image-width="1536"
  :image-height="1024"
  image-alt="Crawlab Demo 项目封面"
  image-caption="Crawlab Demo 封面。"
  :tags="tags"
  :facts="facts"
  github="https://github.com/cpython666/crawlab-demo"
  quick-start="#start"
>

## 包含什么

`docker-compose.yml` 里定义了两个服务：

- `master`：Crawlab 主节点，暴露 `8080`，通过环境变量连接 MongoDB。
- `mongo`：MongoDB 4.2，数据持久化到 `./data/db`。

Crawlab 的元数据、任务数据和日志分别挂载到本地目录，容器重启后不会丢。仓库里还带了一个占位的 `main.py` 和已经跑过的 `crawlab/`、`data/` 目录，方便直接对照目录结构。

## 启动 {#start}

```bash
docker compose up -d
```

然后打开 `http://localhost:8080`。停止并保留数据：

```bash
docker compose down
```

如果要连数据一起清掉，再删除 `data/` 和 `.crawlab/`；删除前确认里面没有还要用的任务和数据库。

## 部署前要改的地方

- 把 `Mongo` 的默认用户名、密码和环境变量里的连接信息换掉，不要直接使用示例值。
- 生产环境建议固定 Crawlab 和 MongoDB 的镜像版本，不要长期使用浮动 tag。
- 配置里的 `platform: linux/amd64` 是为了在 Apple Silicon 上跑 amd64 镜像；如果你在 x86 服务器上部署，可以删掉或按实际架构调整。
- 8080 和 27017 默认映射到宿主机；对外网开放前加防火墙或反向代理，不要直接把数据库端口暴露出去。

这个仓库是“能跑起来的示例”，不是完整运维方案。真正上线还要考虑备份、日志轮转、资源限制和升级路径。

## 相关入口

- [crawlab-demo 仓库](https://github.com/cpython666/crawlab-demo)
- [Crawlab 官方仓库](https://github.com/crawlab-team/crawlab)
- [Spider-Project：爬虫实操项目合集](/projects/spider-project/)
- [返回项目列表](/projects/)

</ProjectDetail>
