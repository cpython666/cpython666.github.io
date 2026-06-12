---
title: "P3-注意事项【Scrapy】"
date: "2024-12-20 23:44:51.731912"
updated: "2024-12-20 23:44:51.731962"
privacy: "登录可见"
visit_count: 1
legacy_id: 99
legacy_unique_id: "ejHuQ"
---

# P3-注意事项【Scrapy】

## 自定义spider起始方式
也可以是查询数据库的结果，但要注意数据统一性，因为scrapy是异步爬取

## 自定义item类型与有无
spider爬取的结果封装到item对象中，再提交给pipeline持久化，那么当然也可以忽略item对象，传递你想要的数据格式直接到pipeline。

## item与pipeline对应关系
item的意思是数据实例，一个item提交后，会经过所有的pipeline，pipeline的意思是管道，就是对数据的一系列操作，设置中的管道优先级就是管道处理数据的顺序，比如日志操作等。

如果要让某一个pipeline只处理某些类型的item，可以在item进入pipelne的时候判断一下是否是你想要处理的item类型。

建议使用custom_settings参数在每个爬虫配置item类

示例如下：

```python
class doubanPipeline(object):
    def process_item(self, item, spider):
        #判断item是否为Item1类型
        if isinstance(item,doubanTextItem):
            # 操作item
        return item
```

## scrapy是异步执行的
## 同时运行多个爬虫
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

## 发送图像数据
在 Scrapy 中发送图像或文件可以使用 `scrapy.FormRequest` 和 `scrapy.Request`，并设置适当的 `Content-Type` 头和请求体。发送图像或文件时，通常需要使用 `multipart/form-data` 格式。

以下是如何在 Scrapy 中发送图像或文件的示例：

### 使用 `scrapy.FormRequest` 发送图像或文件
`FormRequest` 可以方便地用于发送 `multipart/form-data` 格式的请求。

示例代码：

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'my_spider'
    start_urls = ['https://example.com']

    def parse(self, response):
        # 创建一个FormRequest用于发送图像或文件
        with open('path/to/your/image.jpg', 'rb') as f:
            return scrapy.FormRequest(
                url='https://example.com/upload',
                formdata={
                    'field_name': 'field_value',  # 其他表单字段
                    'file_field': ('filename.jpg', f, 'image/jpeg')  # 文件字段
                },
                callback=self.after_upload
            )

    def after_upload(self, response):
        # 处理上传后的响应
        self.log("Upload succeeded!")
```

1. FormRequest 示例：
    - 使用 `scrapy.FormRequest` 发送 `multipart/form-data` 请求。
    - `formdata` 参数包含表单字段和文件字段。文件字段的值是一个包含文件名、文件对象和 MIME 类型的元组。

### post表单数据传输需要是字符串
忘记当时为啥这样写了，留个坑

想起来了，发送数据

 在 Scrapy 中发送 JSON 格式化的 POST 请求时，需要设置请求头中的 Content-Type 为 application/json，并使用 json.dumps 来格式化请求体。  

```plain
        yield Request(
            url,
            callback=self.parse_page,
        method='POST',
            headers={'Content-Type': 'application/json'},
            body=json.dumps(body)
        )
```

//TODO

在 Scrapy 中发送 POST 请求可以使用 `scrapy.FormRequest` 或 `scrapy.Request`，具体取决于你的需求。`scrapy.FormRequest` 专门用于发送表单数据，而 `scrapy.Request` 则可以发送任意类型的请求，包括 POST 请求。

## Get请求传参
直接写在请求的url中是最优雅的

## POST请求
### 使用 `scrapy.FormRequest`
`FormRequest` 类用于发送带有表单数据的 POST 请求。

> formdata的值只能是字符串<不确定>
>

示例代码：

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'my_spider'
    start_urls = ['https://example.com']

    def parse(self, response):
        return scrapy.FormRequest(
            url='https://example.com/login',
            formdata={'username': 'your_username', 'password': 'your_password'},
            callback=self.after_login
        )

    def after_login(self, response):
        # 处理登录后的响应
        if "authentication failed" in response.text:
            self.log("Login failed")
            return

        # 登录成功后的逻辑
        self.log("Login succeeded!")
        # 继续爬取其他页面
        yield scrapy.Request(url='https://example.com/another_page', callback=self.parse_page)

    def parse_page(self, response):
        # 处理其他页面
        self.log("Parsing another page")
```

### 使用 `scrapy.Request`
如果你需要发送更复杂的 POST 请求，可以使用 `scrapy.Request` 并设置 `method` 和 `body`。

示例代码：

```python
import scrapy
import json

class MySpider(scrapy.Spider):
    name = 'my_spider'
    start_urls = ['https://example.com']

    def parse(self, response):
        data = {
            'username': 'your_username',
            'password': 'your_password'
        }
        headers = {
            'Content-Type': 'application/json'
        }
        yield scrapy.Request(
            url='https://example.com/login',
            method='POST',
            headers=headers,
            body=json.dumps(data),
            callback=self.after_login
        )

    def after_login(self, response):
        # 处理登录后的响应
        if "authentication failed" in response.text:
            self.log("Login failed")
            return

        # 登录成功后的逻辑
        self.log("Login succeeded!")
        # 继续爬取其他页面
        yield scrapy.Request(url='https://example.com/another_page', callback=self.parse_page)

    def parse_page(self, response):
        # 处理其他页面
        self.log("Parsing another page")
```

### 示例说明
1. FormRequest 示例：
    - `scrapy.FormRequest` 用于发送表单数据。`formdata` 参数是一个字典，包含表单字段和对应的值。
    - `callback` 参数指定处理响应的回调函数。
2. Request 示例：
    - `scrapy.Request` 用于发送任意类型的请求。`method` 参数指定请求方法（如 `POST`）。
    - `headers` 参数设置请求头（如 `Content-Type`）。
    - `body` 参数设置请求体，可以是 JSON 格式或其他格式的数据。

这两种方法都可以用于在 Scrapy 中发送 POST 请求，选择哪种方法取决于具体的需求。如果你需要发送表单数据，`FormRequest` 更为简便。如果你需要发送复杂的 JSON 数据或其他类型的数据，`Request` 更为灵活。

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
yield scrapy.FormRequest(
    url=self.start_urls[0],
    formdata=self.data,
    headers=self.headers,
    callback=self.parse,
    cookies=self.cookies,
    dont_filter=True,  # 禁止过滤，保证所有请求都被处理
    meta={'field_name': field_name}
)
```

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
>

在使用 Scrapy 进行网络爬虫时，确实可能会遇到一些网站对爬虫进行特殊的检测和防护，比如通过检查 HTTP 请求头（headers）的格式来判断是否为爬虫。在 HTTP 标准中，请求头字段是大小写不敏感的，但不同的客户端和库可能会使用不同的大小写格式，而 Scrapy 默认的请求头可能会使用首字母大写的格式，这有可能成为一种被服务器用来识别爬虫的特征。

为了解决这个问题，可以通过自定义 Scrapy 的中间件（Middleware）来修改发出的每个请求的 headers，使之更接近普通浏览器的行为。这里有一个具体的例子，展示如何在 Scrapy 项目中实现这个中间件：

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
部署这个中间件后，你的 Scrapy 项目中发出的每个请求都会经过这个中间件的处理，其请求头中的键会被转换为小写或其他你指定的格式，这可以帮助减少被服务器通过请求头格式识别为爬虫的风险。

通过这种方式，可以有效地调整 Scrapy 的请求以更贴近普通浏览器的行为，从而绕过一些基于请求头分析的反爬虫措施。当然，还应注意遵守目标网站的 `robots.txt` 文件和其他爬虫政策，以合法合规地进行数据采集。

## 常用参数
```plain
yield Request(
    self.url,
    method="POST",
    body=json.dumps(data),
    callback=self.parse_total_page,
    meta={"year": year},
    headers=self.headers,
    dont_filter=True
)
```
