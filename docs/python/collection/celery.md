# Celery 从基础到精通：面向 Python 与自动化数据采集开发者

> 适用范围：Python 开发者、自动化采集工程师；以 Celery 5.x + Redis 为主。
> 学习目标：不仅“把任务丢进队列”，还要能设计、部署、监控和排查可靠的异步任务系统。

---

## 0. 先建立正确认识

### 0.1 Celery 是什么

Celery 是 Python 的分布式任务队列。它把一个函数包装成“任务”，由生产者发送消息，再由一个或多个 Worker 进程异步执行。

典型用途：

- 异步执行耗时任务：发邮件、生成报表、图片处理；
- 定时任务：每天抓取、每小时同步；
- 分布式采集：多台机器并行处理 URL；
- 削峰填谷：请求先入队，Worker 按系统承载能力消费；
- 失败重试、任务路由、速率限制和工作流编排。

Celery 不负责：

- 保存你的业务数据；
- 代替 HTTP 客户端或爬虫框架；
- 保证任务“绝对只执行一次”；
- 自动解决幂等、事务、反爬和数据一致性。

### 0.2 核心组件

```text
生产者（Python/Web/Beat）
          │ 发送消息
          ▼
Broker（Redis/RabbitMQ）
          │ 分发消息
          ▼
Worker（执行任务） ──────► 数据库/API/文件
          │ 写入状态或返回值
          ▼
Result Backend（可选，Redis/数据库等）
```

| 组件 | 作用 | 常见选择 |
|---|---|---|
| Producer | 创建并发送任务 | Python 脚本、Django、FastAPI、Celery Beat |
| Broker | 保存和投递任务消息 | Redis、RabbitMQ |
| Worker | 从 Broker 取消息并执行任务 | Celery Worker |
| Result Backend | 保存状态和返回值，可选 | Redis、数据库 |
| Beat | 周期性发送任务 | Celery Beat |
| Flower | Web 监控界面 | Flower |

关键理解：调用 `add.delay(1, 2)` 得到的不是结果 `3`，而是任务句柄 `AsyncResult`。真正的计算发生在 Worker 中。

### 0.3 Broker 如何选择

- **Redis**：上手最简单，适合学习、中小型项目和已有 Redis 的团队。
- **RabbitMQ**：专业消息代理，路由、可靠投递和队列能力更强，适合对消息可靠性要求高的生产系统。

本文先用 Redis。掌握 Celery 后，更换 Broker 主要是配置变化，任务代码通常不用改。

### 0.4 Celery 与其他方案的边界

- 只需一个进程内并发：先考虑 `concurrent.futures` 或 `asyncio`。
- 需要跨进程、跨机器、重试、定时、监控：Celery 合适。
- 需要事件流、海量日志管道：考虑 Kafka 等流系统。
- Celery 的任务应以秒级或更长工作为主；大量微小任务会让消息开销占比过高。

---

## 1. 第一个可运行项目

### 1.1 环境准备

推荐 Linux、macOS 或 WSL。Celery 生产环境不建议原生 Windows。

```bash
python -m venv .venv
source .venv/bin/activate        # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install "celery[redis]"
```

本机需要 Redis。若已有 Docker：

```bash
docker run --name celery-redis -p 6379:6379 -d redis:7-alpine
```

确认 Redis 可用：

```bash
docker exec celery-redis redis-cli ping
# PONG
```

### 1.2 最小任务

新建 `tasks.py`：

```python
from celery import Celery

app = Celery(
    "demo",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)


@app.task
def add(x: int, y: int) -> int:
    return x + y
```

开两个终端，并在同一虚拟环境和目录下操作。

终端 A，启动 Worker：

```bash
celery -A tasks worker --loglevel=INFO
```

终端 B，发送任务：

```bash
python
```

```python
from tasks import add

result = add.delay(10, 20)
result.id
result.ready()       # 是否结束
result.state         # PENDING / STARTED / SUCCESS / FAILURE / RETRY
result.get(timeout=10)  # 30
```

执行链路：

1. `delay()` 把任务名和参数序列化后发到 Redis；
2. Worker 取出消息，根据任务名找到函数；
3. Worker 执行函数；
4. 返回值写入 Result Backend；
5. `result.get()` 从 Backend 读取结果。

### 1.3 `delay()`、`apply_async()` 和直接调用

```python
add(1, 2)                         # 普通同步调用，不经过 Celery
add.delay(1, 2)                   # apply_async(args=(1, 2)) 的快捷形式
add.apply_async(args=(1, 2), countdown=10)  # 10 秒后执行
```

`apply_async()` 支持更多选项：

```python
add.apply_async(
    args=(1, 2),
    queue="math",
    countdown=5,
    expires=60,
)
```

不要在 Celery 任务内部调用另一个任务的 `.get()`，这可能占满 Worker 并造成死锁。需要组合任务时使用 Canvas，后文会讲。

---

## 2. 推荐的项目结构与配置

小项目不必过度拆分，下面的结构已经足够清晰：

```text
myproject/
├── celery_app.py
├── config.py
├── tasks.py
└── send.py
```

`config.py`：

```python
import os

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
timezone = "Asia/Shanghai"
enable_utc = True

task_track_started = True
result_expires = 3600
```

`celery_app.py`：

```python
from celery import Celery

app = Celery("myproject", include=["tasks"])
app.config_from_object("config")
```

`tasks.py`：

```python
from celery_app import app


@app.task
def add(x: int, y: int) -> int:
    return x + y
```

启动：

```bash
celery -A celery_app:app worker -l INFO
```

要点：

- Broker 和密码使用环境变量，不要写死在代码仓库；
- 使用 JSON，避免不可信消息触发 pickle 反序列化风险；
- 生产者和 Worker 必须拥有兼容的任务代码与配置；
- 任务名默认是完整模块路径，例如 `tasks.add`。

---

## 3. Task：任务的核心能力

### 3.1 绑定任务与请求上下文

`bind=True` 会把任务实例作为第一个参数 `self`：

```python
from celery_app import app


@app.task(bind=True)
def inspect_task(self, value: str) -> dict:
    return {
        "task_id": self.request.id,
        "retries": self.request.retries,
        "value": value,
    }
```

常用字段：`self.request.id`、`retries`、`delivery_info`、`headers`。

### 3.2 自动重试

```python
import requests
from celery_app import app


@app.task(
    autoretry_for=(requests.Timeout, requests.ConnectionError),
    retry_backoff=True,
    retry_backoff_max=300,
    retry_jitter=True,
    max_retries=5,
)
def fetch(url: str) -> str:
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    return response.text
```

- `retry_backoff=True`：指数退避，大致按 1、2、4、8……秒增长；
- `retry_jitter=True`：加入随机抖动，避免大量任务同时重试；
- 只重试临时性错误；参数错误、解析规则错误通常不应盲目重试；
- HTTP 429、5xx 可重试；大部分 4xx 不应重试。

手动控制重试：

```python
import requests
from celery_app import app


@app.task(bind=True, max_retries=5)
def fetch_json(self, url: str) -> dict:
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", "30"))
            raise self.retry(countdown=retry_after)
        response.raise_for_status()
        return response.json()
    except (requests.Timeout, requests.ConnectionError) as exc:
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60))
```

### 3.3 超时

```python
@app.task(soft_time_limit=55, time_limit=60)
def slow_job():
    ...
```

- `soft_time_limit`：先抛出 `SoftTimeLimitExceeded`，任务可清理资源；
- `time_limit`：硬终止执行进程，是最后保险；
- 网络请求仍必须设置自身的连接和读取超时。Celery 超时不能替代 `requests.get(..., timeout=...)`。

```python
from celery.exceptions import SoftTimeLimitExceeded


@app.task(soft_time_limit=55, time_limit=60)
def guarded_job():
    try:
        do_work()
    except SoftTimeLimitExceeded:
        cleanup()
        raise
```

### 3.4 任务状态与进度

```python
@app.task(bind=True)
def import_rows(self, rows: list[dict]) -> int:
    total = len(rows)
    for index, row in enumerate(rows, 1):
        save(row)
        self.update_state(
            state="PROGRESS",
            meta={"current": index, "total": total},
        )
    return total
```

查询：

```python
from celery.result import AsyncResult
from celery_app import app

result = AsyncResult(task_id, app=app)
print(result.state, result.info)
```

进度更新会增加 Backend 压力，不要每处理一行就更新；可每 100 条或每 1% 更新一次。

### 3.5 参数必须小而可序列化

推荐传：字符串、数字、列表、字典、业务对象 ID。

不要传：数据库连接、文件句柄、`requests.Session`、大型二进制、ORM 对象、不能 JSON 序列化的自定义实例。

```python
# 好：任务启动后读取最新数据
process_order.delay(order_id)

# 差：对象可能过期、巨大且难以序列化
process_order.delay(order_object)
```

---

## 4. 可靠性：真正的重点

### 4.1 Celery 不是 exactly-once

分布式系统中可能发生：

1. Worker 完成数据库写入；
2. 还未来得及确认消息，Worker 崩溃；
3. Broker 将消息重新投递；
4. 任务再次执行。

所以 Celery 实际上应按“任务可能重复”设计。核心办法是**幂等**：同一个业务动作执行多次，最终结果与执行一次相同。

幂等常用手段：

- 数据库唯一约束；
- Upsert；
- 业务幂等键；
- 执行前检查状态；
- 第三方 API 支持时传 `Idempotency-Key`。

```python
@app.task
def save_article(article: dict) -> None:
    # URL 或站点文章 ID 应有数据库唯一约束
    Article.objects.update_or_create(
        source_id=article["source_id"],
        defaults=article,
    )
```

“先查再插”仍可能有并发竞争，唯一约束才是最后防线。

### 4.2 ACK、崩溃与重新投递

默认情况下，消息通常在任务执行前被确认。若 Worker 执行中崩溃，任务可能丢失。对幂等任务可使用延迟确认：

```python
task_acks_late = True
task_reject_on_worker_lost = True
worker_prefetch_multiplier = 1
```

含义：

- `task_acks_late`：任务执行完成后再 ACK；
- `task_reject_on_worker_lost`：执行子进程异常丢失时让消息重新入队；
- `worker_prefetch_multiplier=1`：减少某个 Worker 提前占住大量长任务。

代价是重复执行概率增加。因此应先保证幂等，再开启延迟确认。

### 4.3 数据库事务与发送任务

危险场景：数据库事务还未提交，就发送了任务；Worker 很快启动，却查不到数据。

Django：

```python
from django.db import transaction

with transaction.atomic():
    order = Order.objects.create(...)
    transaction.on_commit(lambda: process_order.delay(order.id))
```

框架无关的更强方案是 Transactional Outbox：业务记录与“待发送事件”在同一数据库事务中落库，再由独立进程发送。这适合不能接受“数据库已提交但消息未发送”窗口的系统。

### 4.4 不要在任务中吞掉异常

```python
# 错：Celery 会认为任务成功
try:
    do_work()
except Exception:
    logger.exception("failed")

# 对：记录后继续抛出
try:
    do_work()
except Exception:
    logger.exception("failed")
    raise
```

### 4.5 结果 Backend 不是永久数据库

如果不需要任务返回值：

```python
@app.task(ignore_result=True)
def send_metric(...):
    ...
```

结果应设置过期时间。业务结果应该写入业务数据库，而不是长期依赖 Celery Backend。

---

## 5. Canvas：任务工作流编排

Celery 将任务调用描述称为 Signature：

```python
sig = add.s(1, 2)
sig.delay()
```

### 5.1 Chain：串行

前一个任务的结果会作为下一个任务的第一个参数：

```python
from celery import chain

workflow = chain(add.s(1, 2), add.s(10))
result = workflow.delay()  # (1 + 2) + 10 = 13
```

使用 `.si()` 创建 immutable signature，不接收上一步结果。

### 5.2 Group：并行

```python
from celery import group

job = group(add.s(i, i) for i in range(10))
result = job.delay()
result.get(timeout=30)
```

不要一次创建数百万个任务。应分批发送，或让每个任务处理一小批数据。

### 5.3 Chord：并行后汇总

```python
from celery import chord


@app.task
def total(numbers: list[int]) -> int:
    return sum(numbers)


result = chord(
    (add.s(i, i) for i in range(10)),
    total.s(),
).delay()
```

Chord 依赖 Result Backend，且会保存所有头部任务的结果。高任务量时要评估 Backend 压力。

### 5.4 错误回调

```python
task_signature.apply_async(link_error=handle_error.s())
```

复杂流程不要嵌套 `.get()`；使用 Chain、Group、Chord 表达依赖关系。

---

## 6. 队列、路由、优先级与限流

### 6.1 为什么拆队列

若耗时 10 分钟的采集任务和 100 毫秒的通知任务共用一个队列，通知会被长任务阻塞。按资源类型和业务优先级拆分：

```python
task_routes = {
    "tasks.fetch_page": {"queue": "crawl"},
    "tasks.send_email": {"queue": "notifications"},
}
```

分别启动：

```bash
celery -A celery_app:app worker -Q crawl -c 8 -n crawl@%h -l INFO
celery -A celery_app:app worker -Q notifications -c 4 -n notify@%h -l INFO
```

也可发送时指定：

```python
fetch_page.apply_async(args=[url], queue="crawl")
```

### 6.2 速率限制

```python
@app.task(rate_limit="30/m")
def call_api(url: str):
    ...
```

重要：Celery 的 `rate_limit` 通常是**每个 Worker 实例**的限制，而不是整个集群的全局限制。若第三方 API 要求全局每分钟 30 次，可只启动一个专用队列 Worker，或使用 Redis/数据库实现分布式令牌桶。

### 6.3 并发数不是越大越好

- CPU 密集：并发数通常接近 CPU 核数；
- I/O 密集：可适度提高，但要考虑目标站点、连接池、数据库连接数；
- 下游数据库最多 20 个连接，就不要启动 100 个同时写库的任务。

### 6.4 预取

Worker 会预取任务。短任务高吞吐时预取有益；长短任务混合时可能不公平。长任务通常设置：

```python
worker_prefetch_multiplier = 1
```

更好的办法仍是把长短任务放到不同队列。

---

## 7. 定时任务 Celery Beat

配置：

```python
from celery.schedules import crontab

beat_schedule = {
    "fetch-every-5-minutes": {
        "task": "tasks.fetch_index",
        "schedule": 300.0,
        "args": ("https://example.com",),
    },
    "daily-report": {
        "task": "tasks.daily_report",
        "schedule": crontab(hour=2, minute=30),
    },
}
```

启动 Worker 和 Beat：

```bash
celery -A celery_app:app worker -l INFO
celery -A celery_app:app beat -l INFO
```

生产环境保持 **一个 Beat 实例**，否则同一定时任务可能被重复发送。开发环境可用 `worker -B` 合并启动，但生产环境应独立运行。

Beat 只负责按时“发任务”，并不保证上一次任务已经完成。若任务间隔 5 分钟但执行需要 8 分钟，会发生重叠。解决办法：

- 让任务幂等；
- 使用 Redis/数据库分布式锁；
- 或按业务状态判断是否已有执行实例。

锁必须有过期时间，并谨慎处理任务执行时间超过锁租期的问题。

---

## 8. 面向数据采集的实战设计

### 8.1 推荐流水线

```text
seed_index（发现分页）
    └── dispatch_page（提取详情 URL，批量投递）
            └── fetch_detail（请求 + 解析）
                    └── save_item（唯一约束 + Upsert）
```

不要把“发现 100 万 URL”全部放进一个任务，也不要一瞬间发送 100 万个任务。采用有界批次，例如每个任务处理 20～100 个 URL，并根据队列长度实施背压。

### 8.2 一个可复用的采集任务

```python
import requests
from celery_app import app

RETRYABLE_STATUS = {429, 500, 502, 503, 504}


@app.task(
    bind=True,
    acks_late=True,
    reject_on_worker_lost=True,
    max_retries=5,
    soft_time_limit=50,
    time_limit=60,
    rate_limit="60/m",
)
def fetch_page(self, url: str) -> dict:
    try:
        response = requests.get(
            url,
            timeout=(5, 30),
            headers={"User-Agent": "YourCrawler/1.0"},
        )
        if response.status_code in RETRYABLE_STATUS:
            retry_after = int(response.headers.get("Retry-After", "0") or 0)
            delay = retry_after or min(2 ** self.request.retries, 60)
            raise self.retry(countdown=delay)

        response.raise_for_status()
        item = parse_page(response.text, response.url)
        upsert_item(item)  # 数据库必须有唯一约束
        return {"url": url, "status": "saved"}

    except (requests.Timeout, requests.ConnectionError) as exc:
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60))
```

进一步建议：

- 每个进程复用 HTTP Session，但不要把 Session 作为任务参数传递；
- 尊重站点协议、robots、服务条款和访问频率；
- 解析失败与网络失败分开统计；
- 保存原始响应时使用对象存储，不要塞进 Result Backend；
- 按域名拆队列或实施全局限速，避免压垮目标站点；
- 记录 `task_id`、URL、批次 ID、重试次数和耗时，便于追踪。

### 8.3 背压

当生产速度大于消费速度，队列会无限增长。可使用：

- 控制生产批次与间隔；
- 监控队列长度，超过阈值暂停生产；
- 限制每个发现任务生成的下游任务数；
- 增加 Worker 前先确认下游 API 和数据库能承受；
- 为过时任务设置 `expires`。

```python
fetch_page.apply_async(args=[url], expires=600)
```

### 8.4 防止同一资源并发处理

最佳方案通常是数据库唯一约束 + Upsert。如果昂贵操作必须避免重复，可用带 TTL 的分布式锁，但锁不是幂等性的替代品：进程崩溃、网络分区和锁过期都可能带来重复。

---

## 9. Worker 执行模型与性能

### 9.1 默认 prefork

默认 `prefork` 使用多进程，成熟且隔离性较好，通常作为首选：

```bash
celery -A celery_app:app worker --pool=prefork --concurrency=8
```

其他池：

- `solo`：单线程，适合调试；
- `threads`：线程池，某些 I/O 场景可用，但要确认库线程安全；
- eventlet/gevent：需要猴子补丁和兼容库，只有充分理解后再选。

不要为了“I/O 多”就立刻上 gevent。先用 prefork、合理并发、HTTP 连接池和队列拆分，通常更容易维护。

### 9.2 子进程回收

第三方解析库可能缓慢泄漏内存，可让子进程处理一定任务后重启：

```python
worker_max_tasks_per_child = 1000
worker_max_memory_per_child = 512_000  # KB，示例值
```

这不是修复内存泄漏的替代品，但可作为生产保险。

### 9.3 优化原则

吞吐量大致受以下最小值限制：

```text
Worker 执行能力、Broker 吞吐、Backend 吞吐、网络、目标站点、数据库
```

先测量再优化：任务等待时间、执行时间、成功率、重试率、队列长度、内存、CPU、数据库连接和下游错误率。

---

## 10. 监控、日志与运维

### 10.1 命令行检查

```bash
celery -A celery_app:app status
celery -A celery_app:app inspect active
celery -A celery_app:app inspect reserved
celery -A celery_app:app inspect scheduled
celery -A celery_app:app inspect registered
celery -A celery_app:app inspect stats
```

### 10.2 Flower

```bash
python -m pip install flower
celery -A celery_app:app flower --port=5555
```

Flower 可查看 Worker、任务状态和执行时间。生产环境必须添加身份认证并限制网络访问，不能裸露在公网。

### 10.3 日志上下文

```python
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@app.task(bind=True)
def process(self, record_id: int):
    logger.info("processing record_id=%s task_id=%s", record_id, self.request.id)
```

至少监控：

- 队列长度与最老消息等待时间；
- 任务吞吐、P50/P95/P99 执行时间；
- 成功、失败、重试和超时数量；
- Worker 存活、CPU、内存；
- Broker 和 Backend 连接、内存、磁盘；
- 下游 HTTP 429/5xx 和数据库错误。

### 10.4 撤销任务的局限

```python
app.control.revoke(task_id)                 # 尚未执行时跳过
app.control.revoke(task_id, terminate=True) # 尝试终止，风险更高
```

终止任务可能让数据库或文件处于中间状态。更可靠的是“协作式取消”：业务数据库记录取消标志，长任务在安全检查点主动退出。

### 10.5 清空队列很危险

```bash
celery -A celery_app:app purge
```

这会删除等待中的任务。生产环境执行前必须确认队列范围和影响，并做好审计。

---

## 11. 测试

### 11.1 单元测试任务函数

任务函数应尽量薄，把业务逻辑放在普通函数中：

```python
def calculate_price(quantity: int, unit_price: int) -> int:
    return quantity * unit_price


@app.task
def calculate_price_task(quantity: int, unit_price: int) -> int:
    return calculate_price(quantity, unit_price)
```

这样绝大多数测试不需要启动 Celery。

### 11.2 eager 模式

```python
task_always_eager = True
task_eager_propagates = True
```

Eager 模式在当前进程同步执行，适合部分测试，但它不能真实覆盖消息序列化、Broker、Worker 崩溃、并发和 ACK 行为。

### 11.3 集成测试

关键流程至少应有一组真实 Broker + Worker 的集成测试，验证：

- 任务能被发现；
- 参数能序列化；
- 结果和异常正确；
- 重试符合预期；
- 重复执行不会产生重复业务数据。

不要用 `task_always_eager` 冒充完整的 Celery 集成测试。

---

## 12. 与 Django / FastAPI 集成

### 12.1 Django

典型 `project/celery.py`：

```python
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

app = Celery("project")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

`project/__init__.py`：

```python
from .celery import app as celery_app

__all__ = ("celery_app",)
```

`settings.py` 使用 `CELERY_BROKER_URL`、`CELERY_RESULT_BACKEND` 等带命名空间的配置。事务提交后再发任务，参见前文 `transaction.on_commit()`。

### 12.2 FastAPI

Web 接口只负责投递并返回任务 ID：

```python
from fastapi import FastAPI
from celery.result import AsyncResult
from celery_app import app as celery_app
from tasks import generate_report

api = FastAPI()


@api.post("/reports", status_code=202)
def create_report(user_id: int):
    result = generate_report.delay(user_id)
    return {"task_id": result.id}


@api.get("/tasks/{task_id}")
def task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    payload = {"id": task_id, "state": result.state}
    if result.successful():
        payload["result"] = result.result
    elif result.failed():
        payload["error"] = str(result.result)
    return payload
```

不要向不可信客户端直接返回异常堆栈或敏感结果；还应验证任务 ID 是否属于当前用户。

---

## 13. 安全

- Broker 和 Backend 不暴露公网；
- 启用认证、TLS、网络隔离和最小权限；
- 密钥通过环境变量或 Secret 管理系统注入；
- 仅接受 JSON：`accept_content = ["json"]`；
- 不接受不可信 pickle 消息；
- 不把访问令牌、Cookie、完整个人信息放入任务参数和日志；
- Flower、监控端点和远程控制接口必须访问受限；
- Worker 以非 root 用户运行；
- 任务输入即使来自内部队列，也要进行边界验证；
- 生产者与 Worker 的代码发布要兼容，任务参数演进要考虑队列中的旧消息。

任务协议升级可采用版本化名称或兼容参数：

```python
@app.task(name="orders.process.v2")
def process_order_v2(order_id: int, priority: str = "normal"):
    ...
```

---

## 14. 生产配置基线

下面是起点，不是所有系统的标准答案：

```python
import os

broker_url = os.environ["CELERY_BROKER_URL"]
result_backend = os.environ.get("CELERY_RESULT_BACKEND")

task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
timezone = "Asia/Shanghai"
enable_utc = True

task_track_started = True
task_acks_late = True                 # 仅用于幂等任务
task_reject_on_worker_lost = True
worker_prefetch_multiplier = 1        # 偏长任务的保守起点
worker_max_tasks_per_child = 1000

task_soft_time_limit = 270
task_time_limit = 300
result_expires = 3600

broker_connection_retry_on_startup = True
```

上线清单：

- [ ] 每个外部网络调用都有超时；
- [ ] 临时错误采用指数退避和抖动，永久错误不重试；
- [ ] 任务可安全重复执行，数据库有唯一约束；
- [ ] 参数足够小且可 JSON 序列化；
- [ ] 长短任务或不同资源任务已拆队列；
- [ ] 并发数不超过数据库和第三方服务容量；
- [ ] Result Backend 有过期策略，不保存业务永久数据；
- [ ] 定时任务只有一个 Beat 调度器；
- [ ] Broker/Backend/Flower 有认证和网络隔离；
- [ ] Worker 由 systemd、容器编排等进程管理器托管；
- [ ] 部署支持优雅停止，给正在执行的任务留出完成时间；
- [ ] 有队列积压、失败率、重试率、超时和 Worker 离线告警；
- [ ] 做过真实 Broker + Worker 的集成测试；
- [ ] 评估过 Broker 和 Backend 的持久化、备份与故障恢复。

---

## 15. 常见故障排查

### 15.1 `Received unregistered task`

原因：Worker 没导入任务模块，或生产者与 Worker 任务名不一致。

检查：

```bash
celery -A celery_app:app inspect registered
```

确认 `include`、`autodiscover_tasks()`、模块路径和发布版本。

### 15.2 任务一直 `PENDING`

`PENDING` 也可能表示“Backend 没有该 ID”，不一定真的排队中。依次检查：

1. Worker 是否在线；
2. Producer 和 Worker 是否连接同一 Broker/虚拟库；
3. Worker 是否监听任务所在队列；
4. 是否配置了 Result Backend；
5. 是否设置 `ignore_result=True`；
6. 结果是否过期。

### 15.3 Worker 收不到任务

- 查看 Broker 地址、密码、数据库编号；
- 查看 `-Q` 监听队列；
- 查看路由规则；
- 查看 Worker 日志和 Broker 连接；
- 检查任务是否在发送前因事务回滚或代码异常而未发送。

### 15.4 任务重复执行

这是必须预期的情况。检查 Worker 崩溃、ACK 配置、visibility timeout、网络中断和重试逻辑；最终通过幂等与唯一约束保证业务正确。

### 15.5 内存持续增长

- 任务是否返回巨大结果；
- Result Backend 是否未过期；
- 是否一次性加载大列表；
- HTTP 响应和解析对象是否被长期引用；
- 设置子进程回收作为保险，并用分析工具定位根因。

### 15.6 Redis 消息被重复投递

Redis Broker 使用可见性超时语义。若任务运行时间超过 visibility timeout，任务可能被再次投递。应让超时时间覆盖最长任务，或把超长任务拆小；同时仍要保证幂等。具体配置名和行为需按你所用 Celery/Kombu 版本核对官方文档。

### 15.7 定时任务执行两次

常见原因：启动了多个 Beat、任务发生重叠或消息重新投递。确保只有一个 Beat，并对任务做幂等/互斥控制。

---

## 16. 从入门到精通的练习路线

### 阶段 1：基础（1～2 天）

1. 跑通 `add.delay()`；
2. 观察 Worker 日志与 `AsyncResult` 状态；
3. 实践 `countdown`、`expires`、结果过期；
4. 故意抛异常，观察 `FAILURE`；
5. 停掉 Worker 后发任务，再启动 Worker，理解 Broker 的作用。

验收：能独立解释 Producer、Broker、Worker、Backend 的关系。

### 阶段 2：可用（3～5 天）

1. 写一个带网络超时和指数退避的采集任务；
2. 让 HTTP 404 不重试、429/5xx 重试；
3. 使用数据库唯一约束保证重复任务不会产生重复数据；
4. 配置 Beat 每 5 分钟发送任务；
5. 将采集和通知拆为两个队列。

验收：Worker 被强制终止并重启后，数据仍正确。

### 阶段 3：生产（1～2 周）

1. 建立 Flower/指标/日志监控；
2. 压测不同并发数和预取参数；
3. 模拟 Redis 暂时不可用、数据库超时、第三方 429；
4. 验证优雅关闭、发布兼容和任务积压恢复；
5. 建立失败任务的人工补偿流程，而不是无限重试。

验收：能回答“任务会不会丢、会不会重复、积压多久、失败后怎么办”。

### 阶段 4：精通

精通不是记住全部配置，而是能基于语义作出取舍：

- 判断任务边界和粒度；
- 设计幂等、事务与补偿；
- 选择 ACK、预取、并发、队列和路由策略；
- 识别 Broker、Backend 和下游的容量瓶颈；
- 从日志、指标和事件还原一次故障；
- 知道何时 Celery 不再是合适工具。

建议完成一次故障演练：执行中杀掉 Worker 子进程、重启 Redis、让下游返回 429、制造慢数据库，再验证系统是否符合预期。

---

## 17. 一页速查表

```bash
# Worker
celery -A celery_app:app worker -l INFO

# 指定队列与并发
celery -A celery_app:app worker -Q crawl -c 8 -l INFO

# Beat
celery -A celery_app:app beat -l INFO

# Flower
celery -A celery_app:app flower --port=5555

# 检查
celery -A celery_app:app status
celery -A celery_app:app inspect active
celery -A celery_app:app inspect registered
```

```python
task.delay(a, b)
task.apply_async(args=(a, b), kwargs={}, countdown=10, queue="q")

result.id
result.state
result.ready()
result.successful()
result.get(timeout=10)

chain(task1.s(), task2.s()).delay()
group(task.s(x) for x in values).delay()
chord((task.s(x) for x in values), summarize.s()).delay()
```

最重要的十条：

1. 任务可能重复，业务必须幂等；
2. 外部请求必须有超时；
3. 只重试临时错误，并使用退避与抖动；
4. 参数传 ID，不传复杂对象和大数据；
5. 业务结果写业务数据库；
6. 长短任务拆队列；
7. 并发量受下游容量约束；
8. 不在任务中同步 `.get()` 另一个任务；
9. Beat 只运行一个实例，周期任务仍可能重叠；
10. 监控积压、延迟、失败、重试、超时和 Worker 存活。

---

## 18. 下一步学习资料

优先阅读与你当前版本匹配的 Celery 官方文档：

- Getting Started：整体流程；
- Tasks：重试、ACK、任务选项；
- Calling Tasks：`apply_async`；
- Canvas：Chain、Group、Chord；
- Workers：并发、远程控制；
- Periodic Tasks：Beat；
- Monitoring and Management：事件与监控；
- Optimizing：预取、吞吐与延迟；
- Security：序列化、认证与网络安全。

遇到配置问题时先确认 Celery、Kombu、Redis/RabbitMQ 的具体版本，因为部分配置和传输行为会随版本变化。

---

## 结语

Celery 的 API 不难，难点是分布式系统语义。真正可靠的 Celery 系统依靠的不是更多配置，而是：**小而明确的任务边界、幂等、有限重试、事务意识、容量控制和可观测性**。

先跑通最小示例，再把你现有的一个采集函数改造成任务；随后主动制造超时、重复和 Worker 崩溃。经历这一轮，你对 Celery 的理解会从“会调用”进入“能负责生产系统”。
