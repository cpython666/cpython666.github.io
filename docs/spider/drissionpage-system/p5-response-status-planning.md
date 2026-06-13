---
title: "P5-增加响应状态码-后续系统功能规划【自动化采集系统代码】"
created_at: 2025-03-09 22:30:35
updated_at: 2025-03-09 22:37:52
---

# P5-增加响应状态码-后续系统功能规划【自动化采集系统代码】

## 功能说明

+ 状态码，200为正常，其他为异常

## 功能规划：

+ 使用中间件+redis实现用户权限校验
+ 接口限流
+ 进程数控制

## 源码：

```python
'''
增加响应码
'''
from urllib.parse import urlparse, urlunparse

import asyncio
from pathlib import Path
from functools import wraps
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.responses import HTMLResponse, Response, JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html
from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Union
from DrissionPage import ChromiumOptions, Chromium

from pydantic import BaseModel
from typing import Optional, Any

def get_request_url(url):
    parsed = urlparse(url)
    cleaned = parsed._replace(fragment="")
    return urlunparse(cleaned).strip('/')


class ChromiumManager:
    def __init__(self):
        self.chromium: Optional[Chromium] = None  # Chromium 实例
        self.last_request_time: Optional[float] = None  # 记录最后一次请求时间
        self.lock = asyncio.Lock()  # 确保线程安全
        self.shutdown_timer: Optional[asyncio.Task] = None  # 定时器任务
        self.active_tasks = 0  # 活跃任务计数器
        self.BROWSER_IDLE_TIMEOUT = 120  # 浏览器空闲多久（秒）后关闭
        self.CHECK_INTERVAL = 10  # 检查间隔（秒）

    async def start_chromium(self):
        if self.chromium is None:
            co = ChromiumOptions().auto_port()
            co.ignore_certificate_errors(True)
            self.chromium = Chromium(addr_or_opts=co)
            self.chromium.set.auto_handle_alert(True)
            print("Chromium 已启动")

    async def stop_chromium(self):
        if self.chromium is not None:
            await asyncio.to_thread(self.chromium.quit)
            self.chromium = None
            print("Chromium 已关闭")

    async def monitor_inactivity(self):
        while True:
            await asyncio.sleep(self.CHECK_INTERVAL)
            async with self.lock:
                if (
                    self.active_tasks == 0
                    and self.last_request_time
                    and (asyncio.get_event_loop().time() - self.last_request_time)
                    > self.BROWSER_IDLE_TIMEOUT
                ):
                    await self.stop_chromium()
                    self.shutdown_timer = None
                    break

    async def reset_timer(self):
        self.last_request_time = asyncio.get_event_loop().time()
        async with self.lock:
            if self.shutdown_timer is None:
                self.shutdown_timer = asyncio.create_task(self.monitor_inactivity())

    def chromium_task(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.chromium and not self.chromium.states.is_alive:
                self.chromium = None

            async with self.lock:
                if self.chromium is None:
                    await self.start_chromium()

            async with self.lock:
                self.active_tasks += 1

            try:
                return await func(*args, **kwargs)
            finally:
                async with self.lock:
                    self.active_tasks -= 1
                if self.chromium and not self.chromium.states.is_alive:
                    self.chromium = None

        return wrapper


class ResponseData(BaseModel):
    code: int  # 状态码
    msg: str  # 提示信息
    data: Optional[Union[str, bytes]] = (
        None  # data 字段可以是字符串（HTML）或字节（图片）
    )


class RequestData(BaseModel):
    r_type: Optional[bool] = Field(True, description="是否以json格式返回，否的话会根据接口返回html或者图片字节")
    url: HttpUrl = Field(default="http://localhost:8001/", description="目标网址")
    dp_timeout: Optional[int] = Field(
        10, description="等待页面加载的最大时间（秒）", ge=0, le=30
    )
    dp_sleep: Optional[float] = Field(
        0.1, description="等待页面加载的最大时间（秒）", ge=0, le=10
    )
    dp_wait_for: Optional[str] = Field(description="等待页面元素的xpath选择器")
    dp_retry: Optional[int] = Field(1, description="请求页面的重试次数", ge=0, le=3)


# 初始化 Chromium 管理器
chromium_manager = ChromiumManager()

# 获取 HTML 页面
@chromium_manager.chromium_task
async def get_html(url, dp_timeout, dp_sleep, dp_wait_for, dp_retry):

    new_tab = await asyncio.to_thread(chromium_manager.chromium.new_tab)
    listen_url = get_request_url(url)
    await asyncio.to_thread(
        new_tab.listen.start,
        targets=listen_url,
        method="GET",
        res_type="Document",
    )
    await asyncio.to_thread(new_tab.get, url=url, timeout=dp_timeout, retry=dp_retry)
    res = await asyncio.to_thread(new_tab.listen.wait, timeout=dp_timeout-0.5)
    if isinstance(res, bool):
        """
        https://drissionpage.cn/browser_control/listener#-listenwait
        """
        await asyncio.to_thread(new_tab.close)
        print('未监听到网络链接', url)
        return 505, "数据采集中间系统 未监听到与链接相同的响应"
    status_code = res.response.status
    await asyncio.sleep(0.1)  # 等待数据插入页面，处理人机校验
    html: str = await asyncio.to_thread(lambda: new_tab.html)
    await asyncio.to_thread(new_tab.close)
    return status_code, html


# 获取 Screenshot
@chromium_manager.chromium_task
async def get_screenshot(url: str, dp_timeout, dp_sleep, dp_wait_for, dp_retry):
    new_tab = await asyncio.to_thread(chromium_manager.chromium.new_tab)
    listen_url = get_request_url(url)
    await asyncio.to_thread(
        new_tab.listen.start,
        targets=listen_url,
        method="GET",
        res_type="Document",
    )
    await asyncio.to_thread(new_tab.get, url=url, timeout=dp_timeout, retry=dp_retry)
    res = await asyncio.to_thread(new_tab.listen.wait, timeout=dp_timeout - 0.5)
    print(res)
    if isinstance(res, bool):
        """
        https://drissionpage.cn/browser_control/listener#-listenwait
        """
        await asyncio.to_thread(new_tab.close)
        print('未监听到网络链接', url)
        return 505, "数据采集中间系统 未监听到与链接相同的响应"
    status_code = res.response.status
    await asyncio.sleep(0.1)  # 等待数据插入页面，处理人机校验
    screenshot = await asyncio.to_thread(new_tab.get_screenshot, as_bytes="png", full_page=True)
    await asyncio.to_thread(new_tab.close)
    return status_code, screenshot

# 创建 FastAPI 应用
app = FastAPI(
    title="自动化采集中间系统",
    description="FastAPI + DrissionPage 实现的自动化采集中间系统，功能多样，体验丝滑，还有一丢丢智能~",
    version="1.0.0",
    docs_url=None,
)
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

router = APIRouter()

@router.post(
    "/fetch_html/",
    summary="获取html源码",
    description="返回目标网址源代码，HTML格式的响应",
    response_model=ResponseData,
)
async def fetch_html(data: RequestData):
    url = str(data.url)
    dp_timeout = data.dp_timeout
    dp_sleep = data.dp_sleep
    dp_wait_for = data.dp_wait_for
    dp_retry = data.dp_retry

    await chromium_manager.reset_timer()  # 更新请求时间，重置定时器
    try:
        status_code,result = await get_html(
            url=url,
            dp_timeout=dp_timeout,
            dp_sleep=dp_sleep,
            dp_wait_for=dp_wait_for,
            dp_retry=dp_retry,
        )
        return HTMLResponse(content=result, status_code=status_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/fetch_screenshot/",
    summary="获取网页截图",
    description="返回目标网站截图，图片格式的响应",
)
async def fetch_screenshot(data: RequestData):
    url = str(data.url)
    dp_timeout = data.dp_timeout
    dp_sleep = data.dp_sleep
    dp_wait_for = data.dp_wait_for
    dp_retry = data.dp_retry
    await chromium_manager.reset_timer()  # 更新请求时间，重置定时器
    status_code,image_data = await get_screenshot(
        url=url,
        dp_timeout=dp_timeout,
        dp_sleep=dp_sleep,
        dp_wait_for=dp_wait_for,
        dp_retry=dp_retry,
    )
    if status_code != 505:
        return Response(content=image_data, media_type="image/png")
    else:
        return Response(content=image_data, status_code=status_code)


app.include_router(router, tags=["网页采集"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8010)
```
