FastAPI 是一个现代、高性能的 Python Web 框架，用于快速构建 API（应用程序接口）。它基于 Python 3.6+ 的类型提示功能（type hints），结合了异步编程的支持，旨在提供简单易用、高效且符合现代开发需求的工具。FastAPI 由 Sebastián Ramírez 创建，首次发布于 2018 年，现已成为 Python 生态系统中流行的框架之一，尤其在需要高性能和快速开发的场景中。

### 主要特点
1. **高性能**  
   FastAPI 基于 Starlette（一个异步 Web 框架）和 Pydantic（用于数据验证和序列化），支持异步 I/O 操作，其性能可以媲美 Node.js 和 Go 等框架。根据官方基准测试，它是 Python 中最快的框架之一。

2. **类型提示与自动文档生成**  
   FastAPI 利用 Python 的类型提示来定义 API 的输入和输出模型。结合 Pydantic，它能自动验证请求数据并生成交互式的 API 文档（如 Swagger UI 和 ReDoc），无需开发者手动编写文档。

3. **异步支持**  
   支持 `async` 和 `await` 语法，适合处理高并发场景，例如实时应用或需要大量 I/O 操作的服务。

4. **简单易用**  
   语法简洁，学习曲线平缓，开发者只需几行代码就能搭建一个功能完备的 API。

5. **依赖注入**  
   提供强大的依赖注入系统，可以轻松管理共享资源（如数据库连接）或执行前置检查（如身份验证）。

6. **数据验证**  
   通过 Pydantic 模型，FastAPI 能够自动验证请求数据，并返回详细的错误信息，提升开发体验和 API 的健壮性。

### 一个简单的例子
以下是一个使用 FastAPI 创建的基本 API 示例：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 定义数据模型
class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

# 定义路由
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/items/")
def create_item(item: Item):
    return {"item_name": item.name, "item_price": item.price}
```

运行这个程序（使用 `uvicorn`）后，你可以通过 `http://127.0.0.1:8000/docs` 访问自动生成的交互式文档，并测试 API。

### 安装
可以通过 pip 安装 FastAPI 和必要的运行时（如 uvicorn）：
```bash
pip install fastapi uvicorn
```

然后运行示例代码：
```bash
uvicorn main:app --reload
```

### 适用场景
- 构建 RESTful API 或 GraphQL 服务
- 微服务架构
- 需要高并发处理的应用（如聊天服务、实时通知）
- 快速原型开发

### 总结
FastAPI 结合了性能、易用性和现代特性，是 Python 开发者构建 API 的优秀选择。