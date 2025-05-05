# aiohttp
`aiohttp` 是一个用于 Python 的异步 HTTP 客户端/服务器框架，基于 `asyncio`，非常适合需要高并发网络请求的场景，例如爬虫、API 调用等。下面我会介绍 `aiohttp` 的基本用法，包括安装、发送异步请求、处理响应，以及常见的使用场景。

---

### 1. **安装 `aiohttp`**
首先，确保你已安装 `aiohttp`：
```bash
pip install aiohttp
```

如果需要加速（可选），可以安装 `aiodns` 和 `cchardet`：
```bash
pip install aiodns cchardet
```

---

### 2. **基本用法：发送异步 HTTP 请求**

`aiohttp` 使用 `asyncio` 的事件循环，必须在异步函数中使用。下面是一个简单的示例，展示如何发送一个 GET 请求并获取响应：

```python
import aiohttp
import asyncio

async def fetch_data(url):
    # 创建一个 ClientSession
    async with aiohttp.ClientSession() as session:
        # 发送 GET 请求
        async with session.get(url) as response:
            # 检查状态码
            if response.status != 200:
                print(f"Error: Status {response.status}")
                return None
            # 读取响应内容（文本）
            data = await response.text()
            return data

async def main():
    url = "https://api.example.com/data"
    result = await fetch_data(url)
    print(result)

# 运行事件循环
if __name__ == "__main__":
    asyncio.run(main())
```

---

### 3. **核心概念**

#### (1) **`ClientSession`**
- `ClientSession` 是 `aiohttp` 的核心对象，用于管理 HTTP 连接。
- 建议在一个请求会话中重用 `ClientSession`，而不是为每个请求创建新会话。
- 使用 `async with` 确保正确关闭会话。

#### (2) **请求方法**
`aiohttp.ClientSession` 支持多种 HTTP 方法：
- `session.get(url)`：GET 请求
- `session.post(url, data)`：POST 请求
- `session.put(url, data)`：PUT 请求
- `session.delete(url)`：DELETE 请求

#### (3) **响应处理**
- `response.status`：获取状态码。
- `await response.text()`：读取响应内容为字符串。
- `await response.json()`：读取 JSON 格式的响应。
- `await response.read()`：读取原始字节数据。

---

### 4. **发送 POST 请求**

以下是一个发送 POST 请求的示例，适用于需要提交数据的场景（如登录、表单提交）：

```python
import aiohttp
import asyncio

async def post_data(url, payload):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as response:
            if response.status != 200:
                print(f"Error: Status {response.status}")
                return None
            data = await response.json()
            return data

async def main():
    url = "https://api.example.com/submit"
    payload = {"username": "user", "password": "pass"}
    result = await post_data(url, payload)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

---

### 5. **并发请求**

`aiohttp` 的最大优势是支持并发请求，可以显著提高效率。以下是一个并发获取多个 URL 的示例：

```python
import aiohttp
import asyncio

async def fetch_data(session, url):
    async with session.get(url) as response:
        if response.status != 200:
            return None
        return await response.text()

async def main():
    urls = [
        "https://api.example.com/data1",
        "https://api.example.com/data2",
        "https://api.example.com/data3"
    ]
    
    async with aiohttp.ClientSession() as session:
        # 使用 asyncio.gather 并发执行多个请求
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for url, result in zip(urls, results):
            if result:
                print(f"Data from {url}: {result[:100]}...")
            else:
                print(f"Failed to fetch {url}")

if __name__ == "__main__":
    asyncio.run(main())
```

---

### 6. **设置请求头和超时**

你可以通过参数设置请求头、超时等：

```python
import aiohttp
import asyncio

async def fetch_with_headers(url):
    # 设置超时（总超时 10 秒，连接超时 5 秒）
    timeout = aiohttp.ClientTimeout(total=10, connect=5)
    
    # 设置请求头
    headers = {
        "User-Agent": "MyApp/1.0",
        "Authorization": "Bearer your-token"
    }
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url, headers=headers) as response:
            if response.status != 200:
                print(f"Error: Status {response.status}")
                return None
            return await response.json()

async def main():
    url = "https://api.example.com/protected"
    result = await fetch_with_headers(url)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

---

### 7. **错误处理**

异步请求可能会遇到网络错误、超时等，需要妥善处理：

```python
import aiohttp
import asyncio

async def fetch_with_error_handling(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()  # 抛出异常如果状态码不是 200
                return await response.json()
    except aiohttp.ClientError as e:
        print(f"Client error: {e}")
        return None
    except asyncio.TimeoutError:
        print("Request timed out")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

async def main():
    url = "https://invalid-url.example.com"
    result = await fetch_with_error_handling(url)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

---

### 8. **常见使用场景**

#### (1) **爬虫**
- 使用 `aiohttp` 并发爬取多个网页，效率远高于同步请求（例如 `requests`）。

#### (2) **API 调用**
- 调用 RESTful API，发送 GET、POST 等请求，获取 JSON 数据。

#### (3) **文件下载**
- 使用 `response.read()` 下载文件：
  ```python
  async def download_file(url, filename):
      async with aiohttp.ClientSession() as session:
          async with session.get(url) as response:
              with open(filename, 'wb') as f:
                  f.write(await response.read())
  ```

#### (4) **Web 服务器**
- `aiohttp` 也可以用作服务器框架，创建异步 Web 应用：
  ```python
  from aiohttp import web

  async def handle(request):
      return web.Response(text="Hello, world!")

  app = web.Application()
  app.add_routes([web.get('/', handle)])
  web.run_app(app, port=8080)
  ```

---

### 9. **注意事项**

1. **事件循环**：
   - 必须在 `asyncio.run()` 或事件循环中运行异步函数。
   - 不要在 Jupyter Notebook 中直接使用 `asyncio.run()`，而是使用 `await` 或 `loop.run_until_complete()`。

2. **连接管理**：
   - 始终使用 `async with` 确保 `ClientSession` 正确关闭。
   - 避免创建过多的 `ClientSession`，尽量重用。

3. **并发限制**：
   - 并发请求过多可能导致服务器拒绝（429 Too Many Requests）。
   - 使用 `aiohttp.TCPConnector` 限制并发：
     ```python
     connector = aiohttp.TCPConnector(limit=50)  # 限制最大并发为 50
     async with aiohttp.ClientSession(connector=connector) as session:
         # ...
     ```

4. **性能优化**：
   - 使用 `aiodns` 加速 DNS 解析。
   - 使用 `cchardet` 加速字符编码检测。

---

### 总结

- **安装**：`pip install aiohttp`
- **核心**：`ClientSession` 用于管理请求，`async/await` 实现异步。
- **功能**：支持 GET、POST 等请求，处理 JSON、文本等响应。
- **优势**：高并发，适合爬虫、API 调用等场景。
- **注意**：正确管理事件循环和连接，避免资源泄漏。

