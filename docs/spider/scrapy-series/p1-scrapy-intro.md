---
title: "P1-Scrapy简介"
date: "2024-12-20 23:41:34.852842"
updated: "2024-12-20 23:41:34.852958"
privacy: "登录可见"
visit_count: 2
legacy_id: 97
legacy_unique_id: "WTcv4"
---

# P1-Scrapy简介

## Scrapy是什么？

+ Scrapy是一个健壮的爬虫框架，可以从网站中提取需要的数据。是一个快速、简单、并且可扩展的方法。Scrapy使用了异步网络框架来处理网络通讯，可以获得较快的下载速度，因此，我们不需要去自己实现异步框架。并且，Scrapy包含了各种中间件接口，可以灵活的完成各种需求。所以我们只需要定制开发几个模块就可以轻松的实现一个爬虫，用来抓取网页上的各种内容。
+ Scrapy并不是一个爬虫，它只是一个“解决方案”，也就是说，如果它访问到一个“一无所知”的网站，是什么也做不了的。Scrapy是用于提取结构化信息的工具，即需要人工的介入来配置合适的XPath或者CSS表达式。Scrapy也不是数据库，它并不会储存数据，也不会索引数据，它只能从一堆网页中抽取数据，但是我们却可以将抽取的数据插入到数据库中。

## Scrapy架构
![](/imgs/spider/scrapy-series/scrapy-architecture.png)  


Scrapy Engine (引擎): 是框架的核心，负责Spider、ItemPipeline、Downloader、Scheduler中间的通讯，信号、数据传递等。并在发生相应的动作时触发事件。

Scheduler (调度器): 它负责接受引擎发送过来的Request请求，并按照一定的方式进行整理排列，入队，当引擎需要时，提供给引擎。

Downloader (下载器)：负责下载引擎发送的所有Requests请求，并将其获取到的Responses交还给引擎。

Spider (爬虫）：负责处理由下载器返回的Responses，并且从中分析提取数据，获取Item字段需要的数据，并将需要跟进的URL提交给Scrapy Engine，并且再次进入Scheduler。

Item Pipeline (项目管道)：它负责处理Spider中获取到的Item，并进行进行后期处理（清理、验证、持久化存储）的地方.

Downloader Middlewares (下载中间件)：引擎与下载器间的特定钩子，一个可以自定义扩展下载功能的组件。处理下载器传递给引擎的Response。

Spider Middlewares（爬虫中间件)：引擎和Spider间的特定钩子，（处理进入Spider的Responses，和从Spider出去的Requests）
