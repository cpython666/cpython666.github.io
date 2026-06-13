---
title: "drf限流模块-源码翻译及解读【django】"
created_at: 2024-12-20 23:22:18
updated_at: 2024-12-20 23:22:18
---

# drf限流模块-源码翻译及解读【django】

drf-限流源码解读

发邮箱的频率，上传头像的频率

不知道是我的问题还是文档的问题，看不懂用法，尝试了很多最后失败告终，所以结果就是自己重新实现一个或者是看它的源码尝试理解



两百多行，直接全部发给gpt翻译并且加上中文注释

发现翻译成中文注释之后真的好像打开了一片新天地，原来密密麻麻的天数原来表达的意思是这么简单。

下面我们就一起来看看它的源码。



```python
"""
提供各种限流策略。
"""
import time

from django.core.cache import cache as default_cache  # 使用 Django 默认的缓存机制
from django.core.exceptions import ImproperlyConfigured  # 导入配置异常
from rest_framework.settings import api_settings  # 导入 DRF 的全局设置


class BaseThrottle:
    """
    请求的限流基类。
    """

    def allow_request(self, request, view):
        """
        如果允许该请求，则返回 `True`，否则返回 `False`。
        此方法必须被子类重写。
        """
        raise NotImplementedError('.allow_request() 必须被重写')

    def get_ident(self, request):
        """
        通过解析 HTTP_X_FORWARDED_FOR 来识别请求来源的机器，
        如果代理数量大于 0 则使用代理地址。
        否则，使用 REMOTE_ADDR。
        """
        xff = request.META.get('HTTP_X_FORWARDED_FOR')  # 获取客户端真实 IP
        remote_addr = request.META.get('REMOTE_ADDR')  # 获取远程地址
        num_proxies = api_settings.NUM_PROXIES  # 获取代理数设置

        if num_proxies is not None:
            if num_proxies == 0 or xff is None:
                return remote_addr
            addrs = xff.split(',')
            client_addr = addrs[-min(num_proxies, len(addrs))]
            return client_addr.strip()

        return ''.join(xff.split()) if xff else remote_addr  # 如果有 XFF，则使用

    def wait(self):
        """
        可选地，返回推荐的等待时间（秒）。
        可以被子类重写提供限流失败时的等待时间。
        """
        return None


class SimpleRateThrottle(BaseThrottle):
    """
    一个简单的基于缓存的限流实现，只需重写 `.get_cache_key()` 方法。

    限流速率通过 `rate` 属性设置，格式为 '请求数/时间'。

    时间单位可以是：('s', 'sec', 'm', 'min', 'h', 'hour', 'd', 'day')。

    先前的请求信息存储在缓存中，用于限流判断。
    """
    cache = default_cache  # 使用 Django 缓存
    timer = time.time  # 使用系统时间戳
    cache_format = 'throttle_%(scope)s_%(ident)s'  # 缓存键的格式
    scope = None  # 限流范围，具体子类中定义
    THROTTLE_RATES = api_settings.DEFAULT_THROTTLE_RATES  # 从设置中获取限流速率

    def __init__(self):
        # 初始化时，解析限流速率
        if not getattr(self, 'rate', None):
            self.rate = self.get_rate()
        self.num_requests, self.duration = self.parse_rate(self.rate)

    def get_cache_key(self, request, view):
        """
        返回用于限流的唯一缓存键。
        必须被重写。

        如果不进行限流，返回 `None`。
        """
        raise NotImplementedError('.get_cache_key() 必须被重写')

    def get_rate(self):
        """
        获取允许的请求速率。
        """
        if not getattr(self, 'scope', None):
            msg = ("必须为 '%s' 限流器设置 `.scope` 或 `.rate`" %
                   self.__class__.__name__)
            raise ImproperlyConfigured(msg)

        try:
            return self.THROTTLE_RATES[self.scope]
        except KeyError:
            msg = "'%s' 范围没有设置默认的限流速率" % self.scope
            raise ImproperlyConfigured(msg)

    def parse_rate(self, rate):
        """
        解析请求速率字符串，返回一个二元组：
        <允许的请求数>, <时间周期（秒）>
        """
        if rate is None:
            return (None, None)
        num, period = rate.split('/')
        num_requests = int(num)
        duration = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}[period[0]]
        return (num_requests, duration)

    def allow_request(self, request, view):
        """
        检查请求是否应该被限流。

        成功时调用 `throttle_success`。
        失败时调用 `throttle_failure`。
        """
        if self.rate is None:
            return True

        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        self.history = self.cache.get(self.key, [])  # 从缓存获取历史请求记录
        self.now = self.timer()  # 获取当前时间戳

        # 移除已超过限流时长的请求记录
        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()
        if len(self.history) >= self.num_requests:
            return self.throttle_failure()  # 超出限流，限流失败
        return self.throttle_success()  # 请求成功

    def throttle_success(self):
        """
        将当前请求的时间戳和键插入缓存。
        """
        self.history.insert(0, self.now)
        self.cache.set(self.key, self.history, self.duration)
        return True

    def throttle_failure(self):
        """
        请求由于限流而失败时调用。
        """
        return False

    def wait(self):
        """
        返回建议的下一次请求时间（秒）。
        """
        if self.history:
            remaining_duration = self.duration - (self.now - self.history[-1])
        else:
            remaining_duration = self.duration

        available_requests = self.num_requests - len(self.history) + 1
        if available_requests <= 0:
            return None

        return remaining_duration / float(available_requests)


class AnonRateThrottle(SimpleRateThrottle):
    """
    限制匿名用户的 API 调用速率。

    请求的 IP 地址将用作唯一的缓存键。
    """
    scope = 'anon'  # 范围为 'anon' 表示匿名用户限流

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None  # 只对未认证的请求进行限流

        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)  # 使用 IP 作为唯一标识
        }


class UserRateThrottle(SimpleRateThrottle):
    """
    限制已登录用户的 API 调用速率。

    对于已认证用户，使用用户 ID 作为缓存键。
    对于匿名请求，使用请求的 IP 地址。
    """
    scope = 'user'  # 范围为 'user' 表示用户限流

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            ident = request.user.pk  # 认证用户使用用户 ID 作为唯一标识
        else:
            ident = self.get_ident(request)  # 未认证用户使用 IP

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }


class ScopedRateThrottle(SimpleRateThrottle):
    """
    根据 API 的不同部分限制 API 调用速率。
    任何具有 `throttle_scope` 属性的视图都会受到限流。
    缓存键将由用户 ID 和视图的限流范围组成。
    """
    scope_attr = 'throttle_scope'  # 从视图中获取限流范围

    def __init__(self):
        # 重写 SimpleRateThrottle 的初始化，因为在被视图调用之前不能确定速率
        pass

    def allow_request(self, request, view):
        # 只有在视图调用时我们才能确定 scope
        self.scope = getattr(view, self.scope_attr, None)

        # 如果视图没有 `throttle_scope` 属性，则总是允许请求
        if not self.scope:
            return True

        # 通过 `get_rate` 获取允许的请求速率
        self.rate = self.get_rate()
        self.num_requests, self.duration = self.parse_rate(self.rate)

        # 继续执行父类的 `allow_request` 逻辑
        return super().allow_request(request, view)

    def get_cache_key(self, request, view):
        """
        如果视图没有 `throttle_scope`，则不应用限流。

        否则通过将用户 ID 与视图的限流范围组合生成唯一的缓存键。
        """
        if request.user and request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }

```

## 真实ip

>  xff = request.META.get('HTTP_X_FORWARDED_FOR') # 获取客户端真实 IP remote_addr = request.META.get('REMOTE_ADDR') # 获取远程地址 num_proxies = api_settings.NUM_PROXIES # 获取代理数设置 这三者的区别  

这三者的区别在于它们获取的 IP 地址来源不同，具体来说：

1. `HTTP_X_FORWARDED_FOR`:
   - `HTTP_X_FORWARDED_FOR` 是一个 HTTP 头字段，用于记录客户端经过代理服务器或负载均衡时的真实 IP 地址。代理服务器通常会将客户端的 IP 地址添加到该字段中。如果有多个代理，IP 地址会以逗号分隔，按顺序记录每个代理传递的 IP 地址。
   - **用途**：在有代理或负载均衡的情况下，用来获取客户端的原始 IP 地址，而不是代理服务器的 IP。
2. `REMOTE_ADDR`:
   - `REMOTE_ADDR` 是直接从 TCP 连接获取的远程 IP 地址，它表示与服务器建立连接的客户端的 IP，通常是代理服务器或负载均衡器的 IP 地址，而不是客户端的真实 IP。
   - **用途**：用于没有代理或负载均衡情况下获取请求的来源 IP 地址。
3. `NUM_PROXIES`:
   - `NUM_PROXIES` 是一个配置项，用于指定服务器在处理 `X-Forwarded-For` 头字段时，应该忽略多少个代理。它决定服务器应该读取从右到左的第几个 IP 作为客户端的真实 IP。
   - **用途**：用于确保即使请求经过多个代理或负载均衡，依然能准确地获取客户端的真实 IP 地址。

> while self.history and self.history\[-1\] <= self.now - self.duration: self.history.pop()
>
> 这里不是有删除的操作吗，再设置有效期是不是重复了

确实，在限流代码中存在一个移除历史记录的操作：

```python
while self.history and self.history[-1] <= self.now - self.duration:
    self.history.pop()
```

这段代码的作用是：**清除超过限流时间段的请求历史记录**。它遍历 `self.history`，并删除那些时间戳早于当前时间减去限流时间段 `self.duration` 的记录。

而紧接着的缓存设置操作是：

```python
self.cache.set(self.key, self.history, self.duration)
```

这一步是将最新的 `self.history` 列表缓存起来，并且设置缓存的有效期 `self.duration`。

看起来这两者似乎有点重复，但实际上它们的目标是不同的：

1. **移除历史记录（pop 操作）**：它是为了确保 `self.history` 中只保留在限流时间段内的请求时间戳，以便准确地判断用户的请求是否超出限额。即这个操作是为了清理无效的历史请求。
2. **设置缓存有效期**：这一步的目的是将新的 `self.history` 列表保存到缓存中，并且设置其有效期为 `self.duration` 秒。这样可以确保在缓存中存储的记录会在一段时间后自动失效。

因此，**删除历史记录**和**设置缓存有效期**其实并不冲突：

+ **删除历史记录** 是为了让 `self.history` 中的请求信息始终保持在有效的限流时间范围内。
+ **设置缓存有效期** 是为了确保缓存中的数据在 `self.duration` 时间后自动过期，防止无限制存储。

它们是限流机制中相辅相成的两部分，分别从不同的角度处理时间过期问题。
