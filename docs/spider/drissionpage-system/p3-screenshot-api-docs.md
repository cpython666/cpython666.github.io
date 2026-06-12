---
title: "P3-自动化采集系统功能丰富-支持截图，接口文档描述完善"
date: "2025-01-15 23:57:47.495858"
updated: "2025-01-15 23:57:47.495926"
privacy: "会员可见"
visit_count: 2
legacy_id: 110
legacy_unique_id: "ztQ40"
---

# P3-自动化采集系统功能丰富-支持截图，接口文档描述完善

+ 传递参数丰富：睡眠时间，截图功能，等待元素
+ FastAPI接口文档无法显示问题
+ 接口文档界面完善


## 文档显示

[swagger-ui.css](https://www.yuque.com/attachments/yuque/0/2025/css/38536969/1736933800488-1a43b4f2-c898-41c6-a291-f3e29f42565b.css)

[swagger-ui-bundle.js](https://www.yuque.com/attachments/yuque/0/2025/js/38536969/1736933801974-de240297-45bb-4373-8834-67216600c0e4.js)

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
from fastapi.openapi.docs import (
    get_swagger_ui_html,
)
# app = FastAPI()
app = FastAPI(docs_url=None)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="接口文档",
        oauth2_redirect_url="/docs/oauth2-redirect",
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )
    
@app.get("/home", tags=["这是home测试接口"],
         summary="这是一个测试接口的总结，测试home接口",
         description="这是测试接口的详情描述",
         response_description="这是响应的详情描述",
         deprecated=False)
def home():
    return {"user_id": 1001}

if __name__ == '__main__':
    uvicorn.run(app, reload=True)
```

## 源码

```python
import asyncio
from pathlib import Path

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, HttpUrl, Field
from fastapi.responses import HTMLResponse, FileResponse, Response
from DrissionPage import ChromiumOptions, Chromium
from typing import Optional
from functools import wraps
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import (
    get_swagger_ui_html,
)

token_user_mapping = {"abc": "页面请求"}
# 配置变量
BROWSER_IDLE_TIMEOUT = 120  # 浏览器空闲多久（秒）后关闭
CHECK_INTERVAL = 10  # 检查间隔（秒）
# 全局变量管理 Chromium 和定时器
chromium: Optional[Chromium] = None  # Chromium 实例
last_request_time: Optional[float] = None  # 记录最后一次请求时间
lock = asyncio.Lock()  # 确保线程安全
shutdown_timer: Optional[asyncio.Task] = None  # 定时器任务
active_tasks = 0  # 活跃任务计数器


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    if token in token_user_mapping:
        return token_user_mapping[token]
    else:
        raise HTTPException(status_code=401, detail="无效的 token")


class RequestData(BaseModel):
    url: HttpUrl = Field(default='http://localhost:8001/', description="目标网址")
    dp_timeout: Optional[int] = Field(10, description="等待页面加载的最大时间（秒）", ge=0, le=30)  # 默认10秒
    dp_sleep: Optional[float] = Field(0.1, description="等待页面加载的最大时间（秒）", ge=0, le=10)  # 默认0.1秒
    dp_wait_for: Optional[str] = Field(description="等待页面元素的xpath选择器")  # 默认0.1秒
    dp_retry: Optional[int] = Field(description="请求页面的重试次数", ge=0, le=3)


# 启动 Chromium
async def start_chromium():
    global chromium
    if chromium is None:
        co = ChromiumOptions().auto_port()
        co.ignore_certificate_errors(True)
        chromium = Chromium(addr_or_opts=co)
        chromium.set.auto_handle_alert(True)
        print("Chromium 已启动")


# 关闭 Chromium
async def stop_chromium():
    global chromium
    if chromium is not None:
        await asyncio.to_thread(chromium.quit)
        chromium = None
        print("Chromium 已关闭")


# 定时关闭任务
async def monitor_inactivity():
    global last_request_time, shutdown_timer, active_tasks
    while True:
        await asyncio.sleep(CHECK_INTERVAL)
        async with lock:
            if (
                    active_tasks == 0
                    and last_request_time
                    and (
                    asyncio.get_event_loop().time() - last_request_time
                    > BROWSER_IDLE_TIMEOUT
            )
            ):
                await stop_chromium()
                shutdown_timer = None
                break


# 记录请求时间并启动定时器
async def reset_timer():
    global last_request_time, shutdown_timer
    last_request_time = asyncio.get_event_loop().time()
    async with lock:  # 确保对 shutdown_timer 的操作是线程安全的
        if shutdown_timer is None:
            shutdown_timer = asyncio.create_task(monitor_inactivity())


# 装饰器：用于处理前置和后置操作
def chromium_task(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        global chromium, active_tasks

        # 前置操作：检查 Chromium 是否存活
        if chromium and not chromium.states.is_alive:
            chromium = None

        async with lock:
            if chromium is None:
                await start_chromium()

        # 增加活跃任务计数
        async with lock:
            active_tasks += 1

        try:
            # 执行实际操作
            result = await func(*args, **kwargs)
            return result
        finally:
            # 后置操作：任务结束时减少活跃任务计数
            async with lock:
                active_tasks -= 1
            # 关闭 Chromium（如果需要）
            if chromium and not chromium.states.is_alive:
                chromium = None

    return wrapper


# 获取 HTML 页面
async def get_html_from_tab(tab, url: str, dp_timeout, dp_sleep, dp_wait_for, dp_retry) -> str:
    await asyncio.to_thread(tab.get, url=url, timeout=dp_timeout, retry=dp_retry)
    await asyncio.sleep(dp_sleep)  # 等待页面加载完成
    return await asyncio.to_thread(lambda: tab.html)


# 获取 Screenshot
async def get_screenshot_from_tab(tab, url, dp_timeout, dp_sleep, dp_wait_for, dp_retry) -> bytes:
    await asyncio.to_thread(tab.get, url=url, timeout=dp_timeout, retry=dp_retry)
    await asyncio.sleep(dp_sleep)  # 等待页面加载完成

    return await asyncio.to_thread(tab.get_screenshot, as_bytes='png', full_page=True)


# 获取 HTML 页面
@chromium_task
async def get_html(url, dp_timeout, dp_sleep, dp_wait_for, dp_retry):
    new_tab = await asyncio.to_thread(chromium.new_tab)
    try:
        return await get_html_from_tab(new_tab, url, dp_timeout, dp_sleep, dp_wait_for, dp_retry)
    finally:
        await asyncio.to_thread(new_tab.close)


# 获取 Screenshot
@chromium_task
async def get_screenshot(url: str, dp_timeout, dp_sleep, dp_wait_for, dp_retry):
    new_tab = await asyncio.to_thread(chromium.new_tab)
    try:
        return await get_screenshot_from_tab(new_tab, url, dp_timeout, dp_sleep, dp_wait_for, dp_retry)
    finally:
        await asyncio.to_thread(new_tab.close)


app = FastAPI(
    title="自动化采集中间系统",
    description="FastAPI + DrissionPage 实现的自动化采集中间系统，功能多样，体验丝滑，还有一丢丢智能~",
    version="1.0.0",  # API文档的版本号,
    docs_url=None,
)
app.mount("/static", StaticFiles(directory="static"), name="static")
router = APIRouter()


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="接口文档",
        oauth2_redirect_url="/docs/oauth2-redirect",
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@router.post(
    "/fetch_html/",
    summary="获取html源码",
    description="返回目标网址源代码，HTML格式的响应",
)
async def fetch_html(data: RequestData):
    """
    返回目标网址源代码

    - HTML格式的响应
    """
    url = str(data.url)
    dp_timeout = data.dp_timeout
    dp_sleep = data.dp_sleep
    dp_wait_for = data.dp_wait_for
    dp_retry = data.dp_retry

    await reset_timer()  # 更新请求时间，重置定时器
    try:
        result: str = await get_html(url=url, dp_timeout=dp_timeout, dp_sleep=dp_sleep, dp_wait_for=dp_wait_for,
                                     dp_retry=dp_retry)
        return HTMLResponse(content=result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fetch_screenshot/",
             summary="获取网页截图",
             description="返回目标网站截图，图片格式的响应", )
async def fetch_screenshot(data: RequestData):
    url = str(data.url)
    dp_timeout = data.dp_timeout
    dp_sleep = data.dp_sleep
    dp_wait_for = data.dp_wait_for
    dp_retry = data.dp_retry
    await reset_timer()  # 更新请求时间，重置定时器
    image_data = await get_screenshot(url=url, dp_timeout=dp_timeout, dp_sleep=dp_sleep, dp_wait_for=dp_wait_for,
                                      dp_retry=dp_retry)
    return Response(content=image_data, media_type="image/png")


app.include_router(router, tags=["网页采集"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8010)
```
