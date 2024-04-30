# Scrapy简介-快速开始-项目实战-注意事项-踩坑之路
# Scrapy简介
## **Scrapy是什么？**

- Scrapy是一个健壮的爬虫框架，可以从网站中提取需要的数据。是一个快速、简单、并且可扩展的方法。Scrapy使用了异步网络框架来处理网络通讯，可以获得较快的下载速度，因此，我们不需要去自己实现异步框架。并且，Scrapy包含了各种中间件接口，可以灵活的完成各种需求。所以我们只需要定制开发几个模块就可以轻松的实现一个爬虫，用来抓取网页上的各种内容。
- Scrapy并不是一个爬虫，它只是一个“**解决方案**”，也就是说，如果它访问到一个“一无所知”的网站，是什么也做不了的。Scrapy是用于提取结构化信息的工具，即需要人工的介入来配置合适的XPath或者CSS表达式。Scrapy也不是数据库，它并不会储存数据，也不会索引数据，它只能从一堆网页中**抽取数据**，但是我们却可以将抽取的数据插入到数据库中。
## **Scrapy架构**
![](https://cdn.nlark.com/yuque/0/2023/png/38536969/1693470792580-cba18008-b5af-4593-8c31-631a008aa27b.png#averageHue=%23f9f0ea&clientId=u305090e7-b9e0-4&from=paste&id=uc1ea57bf&originHeight=494&originWidth=700&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5f27b93e-77e6-4edf-8a0a-759a0e2d327&title=)

**Scrapy Engine (引擎):** 是框架的核心，负责Spider、ItemPipeline、Downloader、Scheduler中间的通讯，信号、数据传递等。并在发生相应的动作时触发事件。<br /><br />**Scheduler (调度器): **它负责接受引擎发送过来的Request请求，并按照一定的方式进行整理排列，入队，当引擎需要时，提供给引擎。<br /><br />**Downloader (下载器)：**负责下载引擎发送的所有Requests请求，并将其获取到的Responses交还给引擎。<br /><br />**Spider (爬虫）：**负责处理由下载器返回的Responses，并且从中分析提取数据，获取Item字段需要的数据，并将需要跟进的URL提交给Scrapy Engine，并且再次进入Scheduler。<br /><br />**Item Pipeline (项目管道)：**它负责处理Spider中获取到的Item，并进行进行后期处理（清理、验证、持久化存储）的地方.<br /><br />**Downloader Middlewares (下载中间件)：**引擎与下载器间的特定钩子，一个可以自定义扩展下载功能的组件。处理下载器传递给引擎的Response。<br /><br />**Spider Middlewares（爬虫中间件)：**引擎和Spider间的特定钩子，（处理进入Spider的Responses，和从Spider出去的Requests）
# 快速开始-项目实战
> 我们这里以某新闻网站新闻推送为例编写项目，仅用于学习，请勿恶意使用

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

- `scrapy.cfg`: 项目的配置文件
- `HuxiuSpider/`: 该项目的python模块。之后您将在此加入代码。
- `HuxiuSpider/items.py`: 项目中的item文件.
- `HuxiuSpider/pipelines.py`: 项目中的pipelines文件.
- `HuxiuSpider/settings.py`: 项目的设置文件.
- `HuxiuSpider/spiders/`: 放置spider代码的目录.
## 更改设置

- 注释robotstxt_obey
```python
# 第21行
# Obey robots.txt rules
# ROBOTSTXT_OBEY = True
```

- 设置User-Agent
```python
# 第18行
# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "HuxiuSpider (+http://www.yourdomain.com)"
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
```

- 设置访问延迟
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
Spider是用户编写用于从单个网站(或者一些网站)爬取数据的类。<br /><br />其包含了一个用于下载的初始URL，如何跟进网页中的链接以及如何分析页面中的内容， 提取生成 `item` 的方法。<br /><br />为了创建一个Spider，您必须继承 `scrapy.Spider` 类， 且定义以下三个属性:

- `name`: 用于区别Spider。 该名字必须是唯一的，您不可以为不同的Spider设定相同的名字。
- `start_urls`: 包含了Spider在启动时进行爬取的url列表。 因此，第一个被获取到的页面将是其中之一。 后续的URL则从初始的URL获取到的数据中提取。（也可以删除此变量，但要重写`start_requests`方法）
- `parse()` 是spider的一个方法。 被调用时，每个初始URL完成下载后生成的 `Response `对象将会作为唯一的参数传递给该函数。 该方法负责解析返回的数据(response data)，提取数据(生成`item`)以及生成需要进一步处理的URL的 `Request `对象。

以下为我们的第一个Spider代码，保存在 `HuxiuSpider/spiders` 目录下的 `huxiu_article.py` 文件中:<br /><br />我们对于此段代码进行必要的解释：<br /><br />向一个url发送post请求，发送一个时间戳，可以获取这个时间戳以后的新闻推送，然后就是推送数据，关于数据提取等操作可以点开链接页自行观察，太过简单。
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
`Item` 是保存爬取到的数据的容器；其使用方法和`python`字典类似， 并且提供了额外保护机制来避免拼写错误导致的未定义字段错误。<br /><br />类似在ORM中做的一样，您可以通过创建一个 `scrapy.Item` 类， 并且定义类型为 `scrapy.Field` 的类属性来定义一个Item。 (如果不了解ORM, 不用担心，您会发现这个步骤非常简单)（ORM其实就是使用类的方式与数据库进行交互）<br /><br />首先根据需要从`huxiu.com`获取到的数据对`item`进行建模。 我们需要从`dmoz`中获取名字，`url`，以及网站的描述。 对此，在`item`中定义相应的字段。编辑 `HuxiuSpider` 目录中的 `items.py` 文件:
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

## 注意事项
### 自定义spider起始方式
也可以是查询数据库的结果，但要注意数据统一性，因为scrapy是异步爬取
### 自定义item类型与有无
spider爬取的结果封装到item对象中，再提交给pipeline持久化，那么当然也可以忽略item对象，传递你想要的数据格式直接到pipeline。
### item与pipeline对应关系
item的意思是数据实例，一个item提交后，会经过所有的pipeline，pipeline的意思是管道，就是对数据的一系列操作，设置中的管道优先级就是管道处理数据的顺序，比如日志操作等。<br /><br />如果要让某一个pipeline只处理某些类型的item，可以在item进入pipelne的时候判断一下是否是你想要处理的item类型。示例如下：
```python
class doubanPipeline(object):
    def process_item(self, item, spider):
        #判断item是否为Item1类型
        if isinstance(item,doubanTextItem):
            # 操作item
        return item
```
### scrapy是异步执行的

### 同时运行多个爬虫
```python
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

settings = get_project_settings()

crawler = CrawlerProcess(settings)

crawler.crawl('exercise')
crawler.crawl('ua')

crawler.start()
crawler.start()
```
### post表单数据传输需要是字符串
忘记当时为啥这样写了，留个坑<br /><br />//TODO
### 自定义请求头
```python
import scrapy

class AddHeadersSpider(scrapy.Spider):
    name = 'add_headers'
    allowed_domains = ['sina.com']
    start_urls = ['https://www.sina.com.cn']
    headers = {
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate",
        'Content-Length': '0',
        "Connection": "keep-alive"
    }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, headers=self.headers, callback=self.parse)
            
    def parse(self,response):
        print("---------------------------------------------------------")
        print("response headers: %s" % response.headers)
        print("request headers: %s" % response.request.headers)
        print("---------------------------------------------------------")
```
### scrapy的FormRequest发送的是表单数据类型，如果要发送json类型需要使用Request
```python
ts = round(time.time() * 1000)
form_data = {
    "nodeId": id_str,
    "excludeContIds": [],
    "pageSize": '20',
    "startTime": str(ts),
    "pageNum": '1'
}
yield scrapy.Request(url=self.url,method='POST',headers=self.headers,
                     body=json.dumps(form_data), callback=self.parse,
                     meta={'id_str': id_str})
```
### scrapy请求headers是首字母大写的。这个作为特征被识别了，有没有老铁找到方法，解决这个问题。
> 未测试

在使用 Scrapy 进行网络爬虫时，确实可能会遇到一些网站对爬虫进行特殊的检测和防护，比如通过检查 HTTP 请求头（headers）的格式来判断是否为爬虫。在 HTTP 标准中，请求头字段是大小写不敏感的，但不同的客户端和库可能会使用不同的大小写格式，而 Scrapy 默认的请求头可能会使用首字母大写的格式，这有可能成为一种被服务器用来识别爬虫的特征。<br /><br />为了解决这个问题，可以通过自定义 Scrapy 的中间件（Middleware）来修改发出的每个请求的 headers，使之更接近普通浏览器的行为。这里有一个具体的例子，展示如何在 Scrapy 项目中实现这个中间件：
#### 1. 创建自定义中间件
首先，在你的 Scrapy 项目中创建一个新的 Python 文件，比如命名为 `middlewares.py`，然后在其中定义一个中间件类，用来修改每个请求的 headers：
```python
from scrapy import signals

class NormalizeHeadersMiddleware:
    def process_request(self, request, spider):
        # 将 headers 中的键统一转换为全小写
        request.headers = {k.lower(): v for k, v in request.headers.items()}
```
这个中间件会将所有的请求头键转换为小写，如果你想模仿特定浏览器的行为（比如全部小写或其他格式），你可以在这里进行相应的调整。
#### 2. 启用中间件
接下来，需要在 Scrapy 项目的设置文件 `settings.py` 中启用这个中间件。在 `settings.py` 文件中找到 `DOWNLOADER_MIDDLEWARES` 配置项，然后添加或修改如下：
```python
DOWNLOADER_MIDDLEWARES = {
    # 确保使用正确的类路径
    'myproject.middlewares.NormalizeHeadersMiddleware': 543,
}
```
这里的 `'myproject.middlewares.NormalizeHeadersMiddleware'` 应该根据你的项目名称和文件结构进行替换，`543` 是这个中间件的优先级，根据需要你可以设置不同的数值（数值越小，优先级越高）。
#### 3. 测试中间件
部署这个中间件后，你的 Scrapy 项目中发出的每个请求都会经过这个中间件的处理，其请求头中的键会被转换为小写或其他你指定的格式，这可以帮助减少被服务器通过请求头格式识别为爬虫的风险。<br /><br />通过这种方式，可以有效地调整 Scrapy 的请求以更贴近普通浏览器的行为，从而绕过一些基于请求头分析的反爬虫措施。当然，还应注意遵守目标网站的 `robots.txt` 文件和其他爬虫政策，以合法合规地进行数据采集。
