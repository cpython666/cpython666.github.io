[![](/imgs/ads/lky.png)](https://www.lcayun.com/aff/DECEDOZS)


## 介绍

Celery 是一个开源的分布式任务队列系统，主要用于处理异步任务和定时任务。它是用 Python 编写的，但也可以与其他语言配合使用。Celery 的设计目标是让开发者能够轻松地将耗时的任务（比如发送邮件、处理文件、调用外部 API 等）从主应用程序中分离出来，交给后台异步处理，从而提高应用的响应速度和可扩展性。

### 主要特点
1. **异步任务处理**：可以将任务交给后台执行，不阻塞主程序。
2. **分布式**：支持多个工作进程（worker）运行在不同机器上，适合大规模应用。
3. **定时任务**：通过 Celery Beat，可以实现类似 cron 的定时任务调度。
4. **易于集成**：与 Python 框架（如 Django、Flask）无缝集成，也支持其他语言的客户端。
5. **消息队列支持**：需要配合消息中间件（如 RabbitMQ 或 Redis）来传递任务。

### 基本工作原理
+ **任务生产者**：应用程序将任务发送到消息队列。
+ **消息中间件（Broker）**：如 RabbitMQ 或 Redis，负责存储和分发任务。
+ **工作进程（Worker）**：从队列中取出任务并执行。
+ **结果存储（Backend）**：可选，用于保存任务执行结果（如用 Redis 或数据库）。

### 简单示例（Python）
```python
from celery import Celery

# 创建 Celery 实例，指定消息中间件和结果存储
app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

# 定义一个任务
@app.task
def add(x, y):
    return x + y

# 调用任务（异步执行）
result = add.delay(4, 6)  # 任务被发送到队列，立即返回
print(result.get())  # 获取结果（阻塞等待任务完成）
```

### 典型应用场景
+ **Web 应用**：处理用户上传文件、生成报告等耗时操作。
+ **数据处理**：批量处理数据、爬虫任务。
+ **定时任务**：每天定时发送邮件或清理过期数据。

