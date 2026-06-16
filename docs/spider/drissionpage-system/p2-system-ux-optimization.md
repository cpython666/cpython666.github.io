---
title: "P2-自动化采集系统-体验优化"
date: "2025-01-14 21:38:38.096414"
updated: "2025-01-14 22:17:06.697637"
privacy: "会员可见"
memberOnly: true
visit_count: 5
legacy_id: 109
legacy_unique_id: "UKWdg"
---

# P2-自动化采集系统-体验优化

本来只是在服务启动的时候呆呆的启动一个浏览器，来请求然后返回页面。

但是如果我们不小心把浏览器关掉了就会出现错误。而且在长时间没有请求的时候这个浏览器一直闲置在这里也同样显得很呆。

于是做了一点点优化：

+ 在有请求的时候才会启动浏览器，长时间不用的时候会关闭浏览器。
+ 在页面没有返回响应的时候不关闭浏览器。
+ 校验传入的url

备注：  
如果看不懂下面两句话，问题不大，源码就是正确无误的。  

可以在创建定时器的时候加锁，保证只有一个关闭浏览器的定时器。这个时候关闭浏览器的时候就不需要加锁。   

如果创建定时器的时候不加锁，这个时候一瞬间大量请求同时发起可能会导致创建了多个关闭浏览器定时器，从而导致关闭浏览器的时候就需要加锁判段浏览器对象是否为空。

## 源码

```python
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, HttpUrl
from fastapi.responses import HTMLResponse
from DrissionPage import ChromiumOptions, Chromium
from typing import Optional

app = FastAPI(debug=True)
token_user_mapping = {"bsgcuajcvgvdcajsa": "页面请求"}

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


class URLRequest(BaseModel):
    url: HttpUrl


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
        await asyncio.sleep(1)  # 每秒检查一次
        async with lock:
            if active_tasks == 0 and last_request_time and (
                    asyncio.get_event_loop().time() - last_request_time > 10
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


# 获取 HTML 页面
async def get_html(url: str):
    global chromium, active_tasks
    if chromium and not chromium.states.is_alive:
        chromium = None

    async with lock:
        if chromium is None:
            await start_chromium()

    # 增加活跃任务计数
    async with lock:
        active_tasks += 1

    try:
        new_tab = await asyncio.to_thread(chromium.new_tab)
        await asyncio.to_thread(new_tab.get, url=url, timeout=10, retry=3)
        await asyncio.sleep(0.1)  # 等待数据插入页面，处理人机校验
        html: str = await asyncio.to_thread(lambda: new_tab.html)
        await asyncio.to_thread(new_tab.close)
        return html
    finally:
        # 任务结束时减少计数
        async with lock:
            active_tasks -= 1


@app.post("/fetch_html_token/")
async def fetch_html_token(request: URLRequest, username: str = Depends(verify_token)):
    print(f"请求备注", username)
    url = str(request.url)
    await reset_timer()  # 更新请求时间，重置定时器
    try:
        result: str = await get_html(url)
        return HTMLResponse(content=result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8010)
```
