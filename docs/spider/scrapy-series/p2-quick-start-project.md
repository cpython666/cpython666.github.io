---
title: "P2-快速开始-项目实战"
date: "2024-12-20 23:42:24.029234"
updated: "2024-12-20 23:42:24.029265"
privacy: "登录可见"
visit_count: 1
legacy_id: 98
legacy_unique_id: "jx1Zk"
---

# P2-快速开始-项目实战

> 我们这里以某新闻网站新闻推送为例编写项目，仅用于学习，请勿恶意使用
>

## 安装 Scrapy
```python
pip install Scrapy
```

## 创建项目
```python
scrapy startproject 项目名
```

```python
HuxiuSpider/
    scrapy.cfg
    HuxiuSpider/
        __init__.py
        items.py
        pipelines.py
        settings.py
        spiders/
            __init__.py
            ...
```

这些文件分别是:

+ `scrapy.cfg`: 项目的配置文件
+ `HuxiuSpider/`: 该项目的python模块。之后您将在此加入代码。
+ `HuxiuSpider/items.py`: 项目中的item文件.
+ `HuxiuSpider/pipelines.py`: 项目中的pipelines文件.
+ `HuxiuSpider/settings.py`: 项目的设置文件.
+ `HuxiuSpider/spiders/`: 放置spider代码的目录.

## 更改设置
+ 注释robotstxt_obey

```python
# 第21行
# Obey robots.txt rules
# ROBOTSTXT_OBEY = True
```

+ 设置User-Agent

```python
# 第18行
# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "HuxiuSpider (+http://www.yourdomain.com)"
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
```

+ 设置访问延迟

```python
# 第29行
# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 3
```

开启pipline

```python
# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   "HuxiuSpider.pipelines.HuxiuspiderPipeline": 300,
}
```

开启cookie（无需操作）（可选操作）

```python
# Disable cookies (enabled by default)
#COOKIES_ENABLED = False
```

设置频率（可不操作）

```python
# The download delay setting will honor only one of:
# 定义了每个域名同时发送的请求数量
CONCURRENT_REQUESTS_PER_DOMAIN = 2
# 定义了每个IP同时发送的请求数量
#CONCURRENT_REQUESTS_PER_IP = 16
```

## 命令行快速生成模板：
```python
scrapy genspider huxiu_article api-article.huxiu.com
```

Spider是用户编写用于从单个网站(或者一些网站)爬取数据的类。

其包含了一个用于下载的初始URL，如何跟进网页中的链接以及如何分析页面中的内容， 提取生成 `item` 的方法。

为了创建一个Spider，您必须继承 `scrapy.Spider` 类， 且定义以下三个属性:

+ `name`: 用于区别Spider。 该名字必须是唯一的，您不可以为不同的Spider设定相同的名字。
+ `start_urls`: 包含了Spider在启动时进行爬取的url列表。 因此，第一个被获取到的页面将是其中之一。 后续的URL则从初始的URL获取到的数据中提取。（也可以删除此变量，但要重写`start_requests`方法）
+ `parse()` 是spider的一个方法。 被调用时，每个初始URL完成下载后生成的 `Response `对象将会作为唯一的参数传递给该函数。 该方法负责解析返回的数据(response data)，提取数据(生成`item`)以及生成需要进一步处理的URL的 `Request `对象。

以下为我们的第一个Spider代码，保存在 `HuxiuSpider/spiders` 目录下的 `huxiu_article.py` 文件中:

我们对于此段代码进行必要的解释：

向一个url发送post请求，发送一个时间戳，可以获取这个时间戳以后的新闻推送，然后就是推送数据，关于数据提取等操作可以点开链接页自行观察，太过简单。

## 爬虫程序模板：
新闻列表页爬虫

```python
import json
import time

import scrapy

from HuxiuSpider.items import HuxiuspiderItem


class HuxiuArticleSpider(scrapy.Spider):
    def __init__(self):
        # 'https://www.huxiu.com/article/'
        self.url = 'https://api-article.huxiu.com/web/article/articleList'

    name = "huxiu_article"
    allowed_domains = ["api-article.huxiu.com"]

    def start_requests(self):
        timestamp = str(int(time.time()))
        form_data = {
            "platform": "www",
            "recommend_time": timestamp,
            "pagesize": "22"
        }
        yield scrapy.FormRequest(url=self.url, formdata=form_data, callback=self.parse)

    def parse(self, response):
        item = HuxiuspiderItem()
        res = response.json()
        success = res['success']
        print(res)
        if success:
            data = res['data']
            is_have_next_page = data['is_have_next_page']
            last_dateline = data['last_dateline']
            total_page = data['total_page']
            dataList = data['dataList']

            for data_obj in dataList:
                item['url'] = 'https://www.huxiu.com/article/' + data_obj['aid'] + '.html'
                item['title'] = data_obj['title']
                item['author'] = data_obj['user_info']['username']
                item['allinfo'] = json.dumps(data_obj, ensure_ascii=False)

                item['visited'] = False
                yield item

            if is_have_next_page:
                form_data = {
                    "platform": "www",
                    "recommend_time": str(last_dateline),
                    "pagesize": "22"
                }
                yield scrapy.FormRequest(url=self.url, formdata=form_data, callback=self.parse)
        else:
            raise Exception('请求新闻列表的时候失败了~')
```

## `Item`模板：
`Item` 是保存爬取到的数据的容器；其使用方法和`python`字典类似， 并且提供了额外保护机制来避免拼写错误导致的未定义字段错误。

类似在ORM中做的一样，您可以通过创建一个 `scrapy.Item` 类， 并且定义类型为 `scrapy.Field` 的类属性来定义一个Item。 (如果不了解ORM, 不用担心，您会发现这个步骤非常简单)（ORM其实就是使用类的方式与数据库进行交互）

首先根据需要从`huxiu.com`获取到的数据对`item`进行建模。 我们需要从`dmoz`中获取名字，`url`，以及网站的描述。 对此，在`item`中定义相应的字段。编辑 `HuxiuSpider` 目录中的 `items.py` 文件:

```python
import scrapy

class HuxiuspiderItem(scrapy.Item):
    url = scrapy.Field()
    title = scrapy.Field()
    author = scrapy.Field()
    # 存储尽量多的信息是必要的，以应对需求变更
    allinfo=scrapy.Field()

    visited=scrapy.Field()
```

一开始这看起来可能有点复杂，但是通过定义item， 您可以很方便的使用Scrapy的其他方法。而这些方法需要知道您的item的定义。

## piplines模板：
```python
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

class HuxiuspiderPipeline:
    def __init__(self):
        self.client=MongoClient('localhost',
                      username='spiderdb',
                      password='password',
                      authSource='spiderdb',
                      authMechanism='SCRAM-SHA-1')
        self.db = self.client['spiderdb']
        self.collection = self.db['huxiu_links']

        self.collection.create_index("url", unique=True)

    def process_item(self, item, spider):
        item = dict(item)

        try:
            self.collection.insert_one(item)
        except DuplicateKeyError as e:
            pass

        return item

    def close_spider(self, spider):
        self.client.close()
```

## 运行爬虫
进入项目的根目录，执行下列命令启动`spider`:

```python
scrapy crawl huxiu_article
# scrapy crawl huxiu_article -o dmoz.csv
```

## 完善项目-多层爬取
```python
yield scrapy.Request(item['url'], meta={'item': item}, callback=self.detail_parse)
```

[https://blog.csdn.net/ygc123189/article/details/79160146](https://blog.csdn.net/ygc123189/article/details/79160146)
