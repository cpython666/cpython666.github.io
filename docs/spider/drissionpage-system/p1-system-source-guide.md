---
title: "P1-DrissionPage数据采集中间系统【源码及讲解】"
date: "2025-01-12 19:23:50.140484"
updated: "2025-01-15 21:12:59.390942"
privacy: "会员可见"
memberOnly: true
visit_count: 10
legacy_id: 108
legacy_unique_id: "71D1c"
---

# P1-DrissionPage数据采集中间系统【源码及讲解】

在DrissionPage专栏我们有讨论过关于DrissionPage部署服务器的问题，当时分析了各种方案并且给出了我认为好的方案，就是做一个专门用于处理动态渲染页面的系统。

DrissionPage+FastAPI，将爬虫系统封装为一个服务，请求之后返回页面html，以此应对页面数据动态渲染，从而归一化数据输入。相当于给dp加上了远程控制的功能。相当于给我们本地的requests加上了浏览器渲染，显示动态请求数据的功能。

首先我们来演示下效果：

提供账号密码验证和token验证两种方式，但这不是最主要的地方。


这个视频我们就大致构思下制作这样一个系统可以实现哪些功能。

+ ✅接口交互：FastAPI（基于异步，高性能）
+ ✅Token校验
+ ✅DP获取网页源码
+ ✅前三者联系起来实现一个最简单的系统：fastapi接受的参数，校验token，获取网页源码用接口并返回
+ 精细化的参数控制，通过一些参数控制系统不同的行为，实现各种定制化的操作：（截图，监听接口，网页交互）
+ 分布式
+ 。。。待更新

## 使用FastAPI制作后端接口

[https://fastapi.tiangolo.com/zh/](https://fastapi.tiangolo.com/zh/)

```python

```

## 使用DrissionPage进行数据采集

官方文档：[https://drissionpage.cn/](https://drissionpage.cn/)

启动配置项：[https://drissionpage.cn/browser_control/browser_options](https://drissionpage.cn/browser_control/browser_options)

```python

```

## FastAPI+DrissionPage的最简单系统

### 系统完整代码：

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from fastapi.responses import HTMLResponse, JSONResponse
from DrissionPage import ChromiumOptions,Chromium
import asyncio
import secrets

app = FastAPI()

# 定义用户认证
security = HTTPBasic()

# 定义认证用户（这里只是演示用，可以根据需要改成数据库或配置文件）
USER_DATA = {
    "user1": "password1",
    "user2": "password2"
}


# 定义请求模型
class URLRequest(BaseModel):
    url: str


# 验证用户函数
def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = credentials.username
    if correct_username in USER_DATA:
        correct_password = secrets.compare_digest(credentials.password, USER_DATA[correct_username])
        if not (correct_username and correct_password):
            raise HTTPException(status_code=401, detail="用户名或者密码无效", headers={"WWW-Authenticate": "Basic"})
        return credentials.username
    else:
        raise HTTPException(status_code=401, detail="用户名不存在", headers={"WWW-Authenticate": "Basic"})


# 验证 Token 函数
token_user_mapping = {'123': 'user123'}


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    if token in token_user_mapping:
        return token_user_mapping[token]
    else:
        raise HTTPException(status_code=401, detail="无效的 token")


# ChromiumOptions 配置
co = ChromiumOptions().auto_port()
co.ignore_certificate_errors(True)
chromium = Chromium(addr_or_opts=co)
chromium.set.auto_handle_alert(True)

# 获取 HTML 的异步函数
async def get_html(url: str) -> dict:
    new_tab = await asyncio.to_thread(chromium.new_tab)
    await asyncio.to_thread(new_tab.get, url, timeout=10, retry=3)
    await asyncio.sleep(0.1)  # 等待数据插入页面，等待人机校验
    html = await asyncio.to_thread(lambda: new_tab.html)
    await asyncio.to_thread(new_tab.close)
    return {"html": html}


# 创建一个 FastAPI 路由
@app.post("/fetch_html/")
async def fetch_html(request: URLRequest, username: str = Depends(authenticate_user)):
    print(f"请求的用户是，", username)
    url = request.url
    try:
        result = await get_html(url)  # 直接调用异步函数
        return JSONResponse(content=result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/fetch_html_token/")
async def fetch_html_token(request: URLRequest, username: str = Depends(verify_token)):
    print(f"请求的用户是，", username)
    url = request.url
    try:
        result = await get_html(url)  # 直接调用异步函数
        return JSONResponse(content=result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8010)
```

### 账号密码请求

```python
import requests
from requests.auth import HTTPBasicAuth

url = "http://localhost:8010/fetch_html/"
data = {
    "url": "http://localhost:8001/"
}
auth = HTTPBasicAuth('user1', 'password1')

response = requests.post(url, json=data, auth=auth)

print(response.request.headers)
print(response.status_code)
print(response.text)
```

### 密钥请求

```python
import requests

headers = {
    'Authorization': 'Bearer 123'
}
url = "http://localhost:8010/fetch_html_token/"
data = {
    "url": "http://localhost:8001/"
}
response = requests.post(url, json=data, headers=headers)

# 检查响应状态码
if response.status_code == 200:
    print(response.json())  # 如果返回的是JSON数据
else:
    print('请求失败', response.text)
```


### scrapy密钥请求

```python
import scrapy
import json
from scrapy import Selector


class TestApiSpiderSpider(scrapy.Spider):
    name = "test_api_spider"
    start_urls = ["http://localhost:8010/fetch_html_token/"]

    def start_requests(self):
        headers = {
            'Authorization': 'Bearer 123'
        }
        url = "http://localhost:8010/fetch_html_token/"
        data = {
            "url": "http://localhost:8001/"
        }

        yield scrapy.Request(
            url=url,
            method='POST',
            headers=headers,
            body=json.dumps(data),
            callback=self.parse,
            meta={"target_url": target_url},
        )

    def parse(self, response):
        # 使用response.urljoin的时候需要重新设置response.url
        # target_url=response.meta.get('target_url')
        # response._set_url(target_url)
        
        if response.status == 200:
            json_response = json.loads(response.text)
            text = json_response['html']
            selector = Selector(text=text)
            print('解析到数据', selector.xpath('//title/text()').get())
        else:
            self.log(f'请求失败: {response.text}')
```
