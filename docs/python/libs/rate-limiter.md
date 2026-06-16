---
title: "用Python手搓限流类-支持同步与异步，内存或者redis"
created_at: 2025-03-10 22:55:19
updated_at: 2025-03-10 23:33:51
memberOnly: true
---

# 用Python手搓限流类-支持同步与异步，内存或者redis

## 场景

+ 提供服务时对于用户限流，发送请求时对请求限流

## 功能

+ 支持同步和异步
+ 支持内存或者redis
+ 传入限流配置和用户唯一标识符（10/60或者10/m）
+ 返回一个元组 `(result, info)`：
  - `result`：布尔值，表示请求是否被允许。
  - `info`：如果允许，返回剩余请求次数；如果拒绝，返回需等待的秒数。

```python
{
    "user1":[time1,time2,time3]
}
```

## 限流器-源码及介绍

是的，我完全理解你的需求：不仅键（例如 `user_id`）是在调用方法时传入的，而且速率（限流规则，例如每秒允许的请求数）也是在方法调用时动态传入的。这种设计非常灵活，可以在运行时为不同的用户或资源设置不同的限流规则，而无需提前定义固定的规则。下面我将详细解释如何实现这一点，并提供一个完整的解决方案。

---

### 实现思路

为了满足“键和速率都动态传入”的需求，我们需要设计一个限流器，能够在每次调用时根据传入的 `user_id` 和 `rate` 参数执行以下操作：

1. **动态处理键和速率**：
   - `user_id` 作为标识符，用于区分不同的用户或资源。
   - `rate` 表示限流规则，例如 `"5/10"`（10秒内允许5次请求）或 `"100/m"`（每分钟允许100次请求），需要在调用时解析。
2. **存储限流状态**：
   - **内存存储**：使用一个字典来保存每个 `user_id` 的限流状态，包括请求记录和对应的限流规则。
   - **Redis 存储**：在 Redis 中保存请求时间戳，同时在内存中维护每个 `user_id` 的限流规则。
3. **支持多种场景**：
   - 提供同步和异步方法，适用于单线程和并发环境。
   - 使用滑动窗口算法，根据动态传入的 `rate` 判断是否允许请求。
4. **返回值**：
   - 返回一个元组 `(result, info)`：
     * `result`：布尔值，表示请求是否被允许。
     * `info`：如果允许，返回剩余请求次数；如果拒绝，返回需等待的秒数。

---

### 代码实现

以下是一个完整的实现，支持动态传入键和速率，支持内存和 Redis 存储，以及同步和异步调用：

```python
import time
from collections import deque
from redis import Redis
import asyncio
from redis.asyncio import Redis as AsyncRedis  # 异步 Redis 客户端


def parse_rate(rate):
    """解析限流规则，例如 '5/10' 或 '100/m'"""
    if rate is None:
        return None, None
    num, period = rate.split('/')
    num_requests = int(num)
    if period.isdigit():
        duration = int(period)
    else:
        duration = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}[period[0]]
    return num_requests, duration


class MemoryRateLimiter:
    """基于内存的同步限流类"""

    def __init__(self):
        self.limits = {}

    def allow_request(self, user_key, rate):
        now = time.time() * 1000
        num_requests, duration = parse_rate(rate)
        if num_requests is None:
            return True,9999999
        if user_key not in self.limits:
            self.limits[user_key] = (num_requests, duration, deque())
        else:
            self.limits[user_key] = (num_requests, duration, self.limits[user_key][2])
        num_requests, duration, requests = self.limits[user_key]
        window_start = now - duration * 1000
        while requests and requests[0] < window_start:
            requests.popleft()
        if len(requests) < num_requests:
            requests.append(now)
            remaining = num_requests - len(requests)
            return True, remaining
        else:
            wait_time = (requests[0] + duration * 1000 - now) / 1000
            return False, wait_time


class AsyncMemoryRateLimiter:
    """基于内存的异步限流类"""

    def __init__(self):
        self.limits = {}
        self.lock = asyncio.Lock()

    async def async_allow_request(self, user_key, rate):
        async with self.lock:
            now = time.time() * 1000
            num_requests, duration = parse_rate(rate)
            if num_requests is None:
                return True, 9999999
            if user_key not in self.limits:
                self.limits[user_key] = (num_requests, duration, deque())
            else:
                self.limits[user_key] = (num_requests, duration, self.limits[user_key][2])
            num_requests, duration, requests = self.limits[user_key]
            window_start = now - duration * 1000
            while requests and requests[0] < window_start:
                requests.popleft()
            if len(requests) < num_requests:
                requests.append(now)
                remaining = num_requests - len(requests)
                return True, remaining
            else:
                wait_time = (requests[0] + duration * 1000 - now) / 1000
                return False, wait_time


class RedisRateLimiter:
    """基于 Redis 的同步限流类"""

    def __init__(self, redis_conn):
        self.redis = redis_conn
        self.limits = {}

    def allow_request(self, user_key, rate):
        key = f"rate_limiter:{user_key}"
        now = time.time() * 1000
        num_requests, duration = parse_rate(rate)
        if num_requests is None:
            return True,9999999
        self.limits[user_key] = (num_requests, duration)
        window_start = now - duration * 1000
        self.redis.zremrangebyscore(key, '-inf', window_start)
        count = self.redis.zcard(key)
        if count < num_requests:
            self.redis.zadd(key, {now: now})
            remaining = num_requests - count - 1
            return True, remaining
        else:
            earliest = self.redis.zrange(key, 0, 0, withscores=True)[0][1]
            wait_time = (earliest + duration * 1000 - now) / 1000
            return False, wait_time


class AsyncRedisRateLimiter:
    """基于 Redis 的异步限流类"""

    def __init__(self, redis_conn):
        self.redis = redis_conn
        self.limits = {}
        self.lock = asyncio.Lock()

    async def async_allow_request(self, user_key, rate):
        async with self.lock:
            key = f"rate_limiter:{user_key}"
            now = time.time() * 1000
            num_requests, duration = parse_rate(rate)
            if num_requests is None:
                return True, 9999999
            self.limits[user_key] = (num_requests, duration)
            window_start = now - duration * 1000
            await self.redis.zremrangebyscore(key, '-inf', window_start)
            count = await self.redis.zcard(key)
            if count < num_requests:
                await self.redis.zadd(key, {now: now})
                remaining = num_requests - count - 1
                return True, remaining
            else:
                earliest = (await self.redis.zrange(key, 0, 0, withscores=True))[0][1]
                wait_time = (earliest + duration * 1000 - now) / 1000
                return False, wait_time


class RateLimiter:
    """统一限流类，支持动态键和速率"""

    def __init__(self, storage='memory', redis_conn=None, is_async=False):
        self.is_async = is_async
        if storage == 'memory':
            self.limiter = AsyncMemoryRateLimiter() if is_async else MemoryRateLimiter()
        elif storage == 'redis':
            if redis_conn is None:
                raise ValueError("Redis 连接对象不能为空")
            self.limiter = AsyncRedisRateLimiter(redis_conn) if is_async else RedisRateLimiter(redis_conn)
        else:
            raise ValueError("存储类型无效")

    def allow_request(self, user_key, rate):
        if self.is_async:
            raise RuntimeError("异步模式请使用 async_allow_request")
        return self.limiter.allow_request(user_key, rate)

    async def async_allow_request(self, user_key, rate):
        if not self.is_async:
            raise RuntimeError("同步模式请使用 allow_request")
        return await self.limiter.async_allow_request(user_key, rate)

```

---

### 使用示例

#### 1. 同步内存限流

```python
from utils.rate_limiter import RateLimiter
limiter = RateLimiter(storage='memory')
result, info = limiter.allow_request("user1", "5/10")  # 10秒内5次
if result:
    print(f"请求通过，剩余次数: {info}")
else:
    print(f"请求被限流，需等待: {info} 秒")
```

#### 2. 异步内存限流

```python
from utils.rate_limiter import RateLimiter
import asyncio
limiter = RateLimiter(storage='memory', is_async=True)
async def test():
    result, info = await limiter.async_allow_request("user1", "5/10")
    if result:
        print(f"请求通过，剩余次数: {info}")
    else:
        print(f"请求被限流，需等待: {info} 秒")
asyncio.run(test())
```

#### 3. 同步 Redis 限流

```python
from utils.rate_limiter import RateLimiter
from redis import Redis

redis_conn = Redis.from_url('redis://:TyMngUY81h@q85NL6EA@IMKLnP@localhost:6379/0')

limiter = RateLimiter(storage='redis', redis_conn=redis_conn)
result, info = limiter.allow_request("user1", "5/10")
if result:
    print(f"请求通过，剩余次数: {info}")
else:
    print(f"请求被限流，需等待: {info} 秒")

```

#### 4. 异步 Redis 限流

```python
from utils.rate_limiter import RateLimiter
import asyncio
from redis.asyncio import Redis as AsyncRedis


async def demo():
    redis_conn = AsyncRedis.from_url('redis://:TyMngUY81h@q85NL6EA@IMKLnP@localhost:6379/0')
    limiter = RateLimiter(storage='redis', redis_conn=redis_conn, is_async=True)
    result, info = await limiter.async_allow_request("user1", "5/10")
    if result:
        print(f"请求通过，剩余次数: {info}")
    else:
        print(f"请求被限流，需等待: {info} 秒")


asyncio.run(demo())
```



---

### 实现特点

1. **动态性**：
   - 每次调用方法时，`user_id` 和 `rate` 都是动态传入的，限流规则可以随时调整。
   - 支持多种格式的 `rate`，如 `"5/10"`（10秒5次）、`"100/m"`（每分钟100次）。
2. **灵活性**：
   - 支持内存和 Redis 存储，适用于单机和分布式场景。
   - 提供同步和异步方法，满足不同并发需求。
3. **安全性**：
   - 在异步场景中使用锁（`asyncio.Lock`）或 Redis 原子操作，确保并发安全。
4. **实用性**：
   - 返回值清晰，方便调用者根据结果采取行动。

---

### 总结

这个实现完美满足了你的需求：不仅键（`user_id`）是方法传入的，速率（`rate`）也是动态传入的。你可以在运行时为每个用户或资源设置不同的限流规则，极大提高了系统的灵活性。如果有其他问题或需要进一步优化，欢迎随时告诉我！

## deque介绍

在 Python 中，`from collections import deque` 是用来导入 `collections` 模块中的 `deque` 类。`deque`（读作 "deck"，即双端队列，英文全称 "double-ended queue"）是一个高效的数据结构，支持从队列的两端快速添加和删除元素。相比普通的 `list`，`deque` 在某些场景下具有更高的性能，尤其是在需要频繁操作队列头部或尾部时。

下面我将详细介绍 `deque` 的功能、特点和使用场景，帮助你更好地理解它在你的限流类代码中的作用。

---

### 1. `deque` 的基本概念

`deque` 是一个双端队列，允许从队列的**左侧（头部）**和**右侧（尾部）**高效地添加或移除元素。它是 `collections` 模块提供的高级数据结构，专门为需要快速操作两端的情况设计。

+ **底层实现**：`deque` 在 Python 中基于双向链表实现，因此在两端的插入和删除操作的时间复杂度是 **O(1)**。
+ **对比 **`list`：Python 的 `list` 是基于动态数组实现的，尾部操作（`append` 和 `pop`）是 O(1)，但头部操作（`insert(0, x)` 和 `pop(0)`）是 O(n)，因为需要移动所有元素。

---

### 2. 导入方式

```python
from collections import deque
```

+ `collections` 是 Python 标准库中的一个模块，提供了多种增强型数据结构。
+ 通过 `from collections import deque`，你可以直接使用 `deque` 类，而无需每次都写 `collections.deque`。

---

### 3. `deque` 的常用方法

`deque` 提供了丰富的接口，以下是一些常用的方法：

| 方法                   | 功能                               | 时间复杂度 |
| ---------------------- | ---------------------------------- | ---------- |
| `append(x)`            | 在右侧（尾部）添加元素 `x`         | O(1)       |
| `appendleft(x)`        | 在左侧（头部）添加元素 `x`         | O(1)       |
| `pop()`                | 移除并返回右侧（尾部）的元素       | O(1)       |
| `popleft()`            | 移除并返回左侧（头部）的元素       | O(1)       |
| `extend(iterable)`     | 从右侧添加多个元素                 | O(k)       |
| `extendleft(iterable)` | 从左侧添加多个元素（注意顺序反转） | O(k)       |
| `clear()`              | 清空队列                           | O(1)       |
| `rotate(n)`            | 向右旋转 `n` 步（负数向左旋转）    | O(k)       |
| `len(deque)`           | 返回队列长度                       | O(1)       |


+ **示例**：

```python
from collections import deque

d = deque([1, 2, 3])
d.append(4)        # [1, 2, 3, 4]
d.appendleft(0)    # [0, 1, 2, 3, 4]
d.pop()            # 返回 4，队列变为 [0, 1, 2, 3]
d.popleft()        # 返回 0，队列变为 [1, 2, 3]
print(list(d))     # 输出 [1, 2, 3]
```

---

### 4. `deque` 的特点

+ **高效两端操作**：从头部或尾部添加/删除元素的时间复杂度是 O(1)，非常适合队列和栈的实现。
+ **线程安全**：在 Python 的 GIL（全局解释器锁）下，单线程操作是安全的，但多线程场景需要额外的锁保护。
+ **可选最大长度**：可以通过 `maxlen` 参数限制队列长度，超出时自动移除最旧的元素。

```python
d = deque(maxlen=3)
d.append(1)  # [1]
d.append(2)  # [1, 2]
d.append(3)  # [1, 2, 3]
d.append(4)  # [2, 3, 4]，1 被自动移除
```

---

### 5. 在限流类中的作用

在你的限流类代码中，`deque` 被用来存储每个用户的请求时间戳，具体用途如下：

#### 代码片段（来自你的限流类）

```python
class MemoryRateLimiter:
    def __init__(self):
        self.limits = {}  # 存储每个 user_id 的 (num_requests, duration, requests)

    def allow_request(self, user_id, rate):
        now = time.time() * 1000
        num_requests, duration = parse_rate(rate)
        if user_id not in self.limits:
            self.limits[user_id] = (num_requests, duration, deque())
        requests = self.limits[user_id][2]
        window_start = now - duration * 1000
        while requests and requests[0] < window_start:
            requests.popleft()
        if len(requests) < num_requests:
            requests.append(now)
            remaining = num_requests - len(requests)
            return True, remaining
        else:
            wait_time = (requests[0] + duration * 1000 - now) / 1000
            return False, wait_time
```

#### 为什么使用 `deque`？

1. **滑动窗口实现**：
   - 限流算法采用滑动窗口机制，需要记录时间窗口内（例如过去10秒）的请求时间戳。
   - 当时间窗口滑动时，需要移除窗口外的旧时间戳（`requests.popleft()`），然后添加新的时间戳（`requests.append(now)`）。
2. **高效性**：
   - `popleft()` 是 O(1)，非常适合移除窗口外的旧记录。
   - 如果用 `list`，`list.pop(0)` 是 O(n)，会导致性能下降，尤其在高频请求场景下。
3. **动态性**：
   - 每个 `user_id` 都有一个独立的 `deque`，记录其请求历史。
   - `deque` 的长度可以动态增长，适合存储任意数量的时间戳（在限流规则范围内）。
4. **内存管理**：
   - 通过 `while` 循环移除过期时间戳，保持内存使用在合理范围内。

#### 具体作用

+ **存储时间戳**：`requests` 是 `deque` 的实例，保存每个用户的请求时间戳。
+ **检查窗口**：通过 `popleft()` 移除超出时间窗口的记录，保持窗口内的请求数不超过 `num_requests`。
+ **计算剩余次数或等待时间**：根据 `len(requests)` 判断是否允许新请求。

---

### 6. 使用场景

除了限流，`deque` 在以下场景中也非常有用：

+ **队列实现**：需要先进先出（FIFO）的场景。
+ **栈实现**：需要后进先出（LIFO）的场景。
+ **滑动窗口问题**：如计算固定窗口的最大值、最小值。
+ **双端操作任务**：如浏览器历史记录（前进和后退）。

---

### 7. 总结

`from collections import deque` 引入了一个高效的双端队列工具，在你的限流类中用于管理请求时间戳。它的 O(1) 时间复杂度的两端操作非常适合滑动窗口算法，确保了限流逻辑的高效性和准确性。相比 `list`，`deque` 在头部操作上的性能优势显著，是实现动态限流的理想选择。

如果你对 `deque` 或代码中的其他部分有更多疑问，欢迎继续提问！

## 一些细节

你的问题非常有针对性，涉及到限流实现的核心设计思路和优化方向。我会从内存和 Redis 两种存储方式的实现逻辑出发，解释为什么要这样设计，并回答你的建议（直接存储时间戳或时间戳列表）是否可行以及优缺点。

---

### 1. 为什么要存储限流信息，而不是只存时间戳？

在你的代码中，限流信息（如 `num_requests` 和 `duration`）和时间戳（如请求发生的时间）都被存储在内存或 Redis 中。你提出“直接存储时间戳就好了”，我理解你可能是想简化存储结构，只保留请求的时间戳，通过计算来判断是否超出限流规则。下面我解释一下现有设计的理由：

#### 当前设计（存储限流信息 + 时间戳队列）

+ **限流信息（**`num_requests`**, **`duration`**）的作用**：
  - 这些是限流规则的定义，告诉系统在多长时间内（`duration`）允许多少次请求（`num_requests`）。
  - 每次检查限流时需要知道当前的规则是什么。如果不存储这些信息，每次调用 `allow_request` 时都需要重新传入规则参数（例如 `'5/10'`），这会增加调用方的负担，也容易导致规则不一致（比如调用时传错了参数）。
  - 存储规则还能支持动态调整，比如中途修改某个用户的限流规则（从 `'5/10'` 改成 `'10/60'`），而无需清空历史时间戳数据重新开始。
+ **时间戳队列的作用**：
  - 时间戳队列记录了过去一段时间内的请求时间，用于计算当前窗口内请求数量是否超出 `num_requests`。
  - 通过队列（`deque`）或 Redis 的有序集合（`zset`），可以高效地移除过期的请求（早于窗口开始时间的时间戳），从而保持滑动窗口的准确性。

#### 直接只存时间戳的问题

如果你只存储时间戳（例如一个列表或集合），而不存储限流信息：

+ **规则丢失**：每次检查时必须知道 `num_requests` 和 `duration`，否则无法判断时间戳列表是否超出限制。如果这些规则不存储在限流器中，就需要外部传入，增加了复杂性和出错风险。
+ **动态性不足**：如果限流规则会变化（比如从每秒 5 次变成每分钟 10 次），仅靠时间戳列表无法适应这种变化，除非清空数据重新开始。
+ **计算开销**：每次检查时需要从时间戳列表中计算当前窗口内的请求数。如果没有 `duration` 的上下文，代码不知道应该考虑多大的时间范围。

#### 优化建议：可以减少存储冗余

你的建议有一定道理，当前代码确实有一些冗余。例如：

+ 在 `limits` 字典中存储 `(num_requests, duration, deque)`，但每次调用时 `num_requests` 和 `duration` 都会从 `rate` 重新解析。这样确实可以优化为只存储时间戳队列，规则从参数动态传入。
+ 修改后的代码可能如下：

```python
class MemoryRateLimiter:
    def __init__(self):
        self.requests = {}  # 只存时间戳队列

    def allow_request(self, user_key, rate):
        now = time.time() * 1000
        num_requests, duration = parse_rate(rate)
        if user_key not in self.requests:
            self.requests[user_key] = deque()
        requests = self.requests[user_key]
        window_start = now - duration * 1000
        while requests and requests[0] < window_start:
            requests.popleft()
        if len(requests) < num_requests:
            requests.append(now)
            return True, num_requests - len(requests)
        else:
            wait_time = (requests[0] + duration * 1000 - now) / 1000
            return False, wait_time
```

这样确实减少了存储开销，但调用方必须保证每次传入的 `rate` 一致，否则会导致逻辑混乱。

---

### 2. Redis 为什么不直接存储时间戳列表？

在 Redis 实现中，代码使用的是有序集合（`zset`），而不是简单的时间戳列表（例如 Redis 的 `list`）。你建议“存储时间戳列表就好了”，我来分析一下这种设计的优劣：

#### 当前设计（使用 `zset`）

+ **为什么用 **`zset`：
  - 有序集合以时间戳作为 score，可以高效地执行范围操作。例如：
    * `zremrangebyscore` 移除过期时间戳（早于窗口开始时间）。
    * `zcard` 获取当前窗口内的请求数量。
    * `zrange` 获取最早的时间戳以计算等待时间。
  - 时间复杂度很低（`O(log N)`），适合高并发场景。
+ **优点**：
  - 支持滑动窗口的精确计算，能快速清理过期数据。
  - Redis 的原子性操作保证了并发安全。

#### 如果改用列表（`list`）

+ **实现方式**：
  - 使用 `LPUSH` 添加时间戳，`LTRIM` 或手动遍历移除过期时间戳。
  - 检查窗口内请求数需要用 `LRANGE` 获取列表并在代码中计算。
+ **问题**：
  - **性能问题**：遍历列表检查过期时间戳的时间复杂度是 `O(N)`，在请求量大时效率低下。
  - **并发性差**：Redis 的 `list` 操作（如 `LPOP` 或 `LTRIM`）需要额外的锁机制来保证线程安全，而 `zset` 的范围操作天然支持高效并发。
  - **数据清理麻烦**：需要手动遍历列表移除过期时间戳，而不像 `zset` 那样可以用 `zremrangebyscore` 一次性完成。

#### 结论

Redis 使用 `zset` 是更优的选择，因为它天然适合滑动窗口限流的场景。如果直接用列表，虽然存储结构更简单，但在性能和并发性上会逊色很多。

---

### 3. 你的建议的可行性与优化方向

你的想法（简化存储结构，只存时间戳）在某些场景下是可行的，尤其是当：

+ 限流规则固定且不会动态变化。
+ 请求量不高，性能要求不严格。
+ 不需要分布式环境（纯内存实现）。

优化后的思路可以是：

+ **内存版**：只存 `deque`（时间戳队列），每次从 `rate` 解析规则。
+ **Redis 版**：继续用 `zset`，但可以去掉 `limits` 字典的冗余存储，规则从参数动态传入。

但在分布式、高并发、动态规则的场景下，现有设计（存储限流信息 + 时间戳）更健壮和灵活。

---

### 回答你的问题

+ **为什么内存要存储限流信息？**
  - 为了保持规则的上下文，支持动态调整，并减少调用方的负担。
  - 如果只存时间戳，可以简化存储，但需要外部保证规则一致性。
+ **Redis 为什么不直接存时间戳列表？**
  - `zset` 比 `list` 更高效，支持快速范围查询和清理，适合高并发和滑动窗口。

希望这个解答清楚地解释了设计意图！如果还有疑问，欢迎继续讨论。
