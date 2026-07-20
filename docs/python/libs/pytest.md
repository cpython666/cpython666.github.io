# Pytest 从基础到精通：面向 Python 开发与自动化采集

> 目标：从零开始，最终能为普通 Python 项目和自动化数据采集项目设计、编写、调试和维护可靠的测试。

## 目录

1. [先建立正确认识](#1-先建立正确认识)
2. [安装与第一个测试](#2-安装与第一个测试)
3. [pytest 如何发现测试](#3-pytest-如何发现测试)
4. [断言与异常测试](#4-断言与异常测试)
5. [fixture：pytest 的核心](#5-fixturepytest-的核心)
6. [参数化：少写重复测试](#6-参数化少写重复测试)
7. [临时文件、日志与输出](#7-临时文件日志与输出)
8. [monkeypatch 与 mock](#8-monkeypatch-与-mock)
9. [数据采集项目实战](#9-数据采集项目实战)
10. [标记、筛选与跳过](#10-标记筛选与跳过)
11. [测试组织和配置](#11-测试组织和配置)
12. [调试失败测试](#12-调试失败测试)
13. [进阶能力与插件](#13-进阶能力与插件)
14. [测试设计方法](#14-测试设计方法)
15. [常见误区](#15-常见误区)
16. [完整练习项目](#16-完整练习项目)
17. [学习路线与速查表](#17-学习路线与速查表)

---

## 1. 先建立正确认识

### 1.1 测试到底是什么

自动化测试就是一段会自动验证另一段代码的代码：

```python
def add(a, b):
    return a + b


def test_add():
    assert add(1, 2) == 3
```

如果结果正确，测试通过；否则 pytest 会告诉你实际值、期望值和失败位置。

pytest 是一个测试框架，它主要替你完成：

- 自动寻找测试；
- 执行测试并展示友好的失败信息；
- 准备与清理测试数据；
- 批量生成相似测试；
- 隔离文件、网络、时间、环境变量等外部依赖；
- 通过插件扩展覆盖率、异步测试、并行执行等能力。

### 1.2 测试的三个层次

| 层次       | 验证对象         | 特点                   | 例子                         |
| ---------- | ---------------- | ---------------------- | ---------------------------- |
| 单元测试   | 函数、类等小单元 | 快、隔离外部依赖       | 测试 HTML 解析函数           |
| 集成测试   | 多个组件的协作   | 较慢、使用部分真实依赖 | 访问本地测试服务器并写数据库 |
| 端到端测试 | 完整业务流程     | 最慢、最接近用户行为   | 启动采集任务并验证最终产物   |

推荐结构是：大量快速单元测试，少量集成测试，更少的端到端测试。

### 1.3 AAA 测试结构

写测试时使用 AAA：

1. **Arrange**：准备数据；
2. **Act**：调用被测代码；
3. **Assert**：验证结果。

```python
def test_total_price():
    # Arrange
    prices = [10, 20, 30]

    # Act
    result = sum(prices)

    # Assert
    assert result == 60
```

简单测试不必真的写注释，但思路要清楚。

---

## 2. 安装与第一个测试

### 2.1 创建隔离环境

```bash
python -m venv .venv
source .venv/bin/activate       # macOS / Linux
# .venv\Scripts\activate        # Windows PowerShell

python -m pip install -U pytest
pytest --version
```

建议使用 `python -m pytest` 运行测试。它能确保 pytest 使用当前 Python 环境，并把当前目录放入模块搜索路径。

### 2.2 最小项目

```text
demo/
├── calculator.py
└── test_calculator.py
```

`calculator.py`：

```python
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("除数不能为 0")
    return a / b
```

`test_calculator.py`：

```python
from calculator import divide


def test_divide():
    assert divide(6, 2) == 3
```

运行：

```bash
python -m pytest
python -m pytest -v             # 显示每个测试名
python -m pytest -q             # 精简输出
```

常见结果：

- `.`：通过；
- `F`：断言失败；
- `E`：准备或清理阶段发生错误；
- `s`：跳过；
- `x`：预期失败。

---

## 3. pytest 如何发现测试

默认发现规则：

- 文件名：`test_*.py` 或 `*_test.py`；
- 函数名：`test_*`；
- 类名：`Test*`，且类通常不要定义 `__init__`；
- 类内方法名：`test_*`。

```python
def test_function_style():
    assert True


class TestUser:
    def test_name(self):
        assert "alice".upper() == "ALICE"
```

精确运行：

```bash
python -m pytest tests/test_user.py
python -m pytest tests/test_user.py::TestUser
python -m pytest tests/test_user.py::TestUser::test_name
python -m pytest -k "user and not slow"
```

`-k` 按测试名称表达式筛选；路径和 `::` 按节点精确定位。

---

## 4. 断言与异常测试

### 4.1 直接使用 assert

pytest 不要求学习 `assertEqual` 一类 API，直接写 Python 的 `assert`：

```python
def test_user_data():
    user = {"name": "Alice", "roles": ["admin", "editor"]}

    assert user["name"] == "Alice"
    assert "admin" in user["roles"]
    assert len(user["roles"]) == 2
```

推荐让一个断言只表达一个清楚的事实。可以有多个断言，但第一个失败后，本测试中后续断言不会执行。

### 4.2 浮点数

二进制浮点数存在精度问题：

```python
import pytest


def test_float():
    assert 0.1 + 0.2 == pytest.approx(0.3)
    assert 100 == pytest.approx(101, rel=0.02)  # 允许约 2% 相对误差
```

### 4.3 验证异常

```python
import pytest

from calculator import divide


def test_divide_by_zero():
    with pytest.raises(ValueError, match="除数不能"):
        divide(1, 0)
```

需要检查异常对象时：

```python
def test_exception_details():
    with pytest.raises(ValueError) as exc_info:
        int("not-a-number")

    assert "invalid literal" in str(exc_info.value)
```

不要只写 `pytest.raises(Exception)`，应尽量验证具体异常类型和关键消息。

---

## 5. fixture：pytest 的核心

fixture 是测试所需的“前置数据或资源”。测试函数在参数中声明 fixture 名，pytest 自动调用并注入结果。

### 5.1 最简单的 fixture

```python
import pytest


@pytest.fixture
def user():
    return {"name": "Alice", "active": True}


def test_active_user(user):
    assert user["active"] is True
```

这是依赖注入：测试不手动调用 `user()`，pytest 根据参数名找到它。

### 5.2 setup 和 teardown

使用 `yield` 前准备，`yield` 后清理：

```python
import pytest


@pytest.fixture
def opened_file(tmp_path):
    path = tmp_path / "data.txt"
    file = path.open("w+", encoding="utf-8")
    yield file
    file.close()


def test_write(opened_file):
    opened_file.write("hello")
    opened_file.seek(0)
    assert opened_file.read() == "hello"
```

即使测试失败，`yield` 后的清理代码通常仍会执行。能用 `with` 管理的资源优先使用上下文管理器。

### 5.3 fixture 作用域

```python
@pytest.fixture(scope="module")
def expensive_resource():
    return object()
```

| scope        | 生命周期                     |
| ------------ | ---------------------------- |
| `function` | 每个测试一次，默认且隔离最好 |
| `class`    | 每个测试类一次               |
| `module`   | 每个测试文件一次             |
| `package`  | 每个测试包一次               |
| `session`  | 整次测试运行一次             |

先用默认 `function`。只有资源创建确实昂贵、且共享不会造成测试互相污染时才扩大作用域。

### 5.4 fixture 依赖 fixture

```python
@pytest.fixture
def raw_user():
    return {"name": " Alice "}


@pytest.fixture
def clean_user(raw_user):
    return {"name": raw_user["name"].strip()}


def test_clean_name(clean_user):
    assert clean_user["name"] == "Alice"
```

fixture 应以资源和业务概念命名，如 `db_connection`、`sample_html`，不要叫模糊的 `setup`。

### 5.5 conftest.py

多个测试文件共用 fixture 时放进 `conftest.py`：

```text
tests/
├── conftest.py
├── test_parser.py
└── test_storage.py
```

pytest 自动发现 `conftest.py`，测试文件不需要也不应该 `import conftest`。

### 5.6 autouse：谨慎使用

```python
@pytest.fixture(autouse=True)
def no_production(monkeypatch):
    monkeypatch.setenv("APP_ENV", "test")
```

`autouse=True` 会自动作用于范围内所有测试，适合强制安全隔离；普通数据准备最好显式声明，避免隐藏依赖。

---

## 6. 参数化：少写重复测试

### 6.1 基本参数化

```python
import pytest


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("  hello ", "hello"),
        ("", ""),
        ("中文", "中文"),
    ],
)
def test_strip(text, expected):
    assert text.strip() == expected
```

每组数据会成为一个独立测试：一组失败不影响其他组，报告也能定位具体输入。

### 6.2 可读的参数 ID

```python
@pytest.mark.parametrize(
    ("status", "retry"),
    [(200, False), (429, True), (500, True)],
    ids=["success", "rate-limited", "server-error"],
)
def test_should_retry(status, retry):
    assert (status in {429, 500}) is retry
```

### 6.3 fixture 参数化

```python
@pytest.fixture(params=["json", "csv"])
def output_format(request):
    return request.param


def test_supported_format(output_format):
    assert output_format in {"json", "csv"}
```

普通输入输出表优先用 `parametrize`；需要为每个参数创建并清理资源时再用参数化 fixture。

---

## 7. 临时文件、日志与输出

### 7.1 tmp_path

`tmp_path` 提供每个测试独立的 `pathlib.Path` 临时目录：

```python
import json


def test_save_json(tmp_path):
    output = tmp_path / "result.json"
    output.write_text(json.dumps({"count": 2}), encoding="utf-8")

    assert json.loads(output.read_text(encoding="utf-8")) == {"count": 2}
```

不要让测试在项目目录里留下 `test.json`、`output.csv` 等垃圾文件。

### 7.2 capsys：捕获 print

```python
def greet(name):
    print(f"Hello, {name}")


def test_greet(capsys):
    greet("Alice")
    captured = capsys.readouterr()
    assert captured.out == "Hello, Alice\n"
    assert captured.err == ""
```

### 7.3 caplog：捕获日志

```python
import logging


def fetch_or_warn(found):
    if not found:
        logging.getLogger(__name__).warning("item not found")


def test_warning_log(caplog):
    with caplog.at_level(logging.WARNING):
        fetch_or_warn(False)

    assert "item not found" in caplog.text
```

通常验证日志级别和关键语义，不要死扣包含时间、模块路径的完整格式。

---

## 8. monkeypatch 与 mock

外部依赖会让测试变慢、不稳定或危险。单元测试应把网络、系统时间、环境变量、随机数等替换为可控实现。

### 8.1 修改环境变量

```python
import os


def get_api_url():
    return os.environ.get("API_URL", "https://example.com")


def test_api_url_from_env(monkeypatch):
    monkeypatch.setenv("API_URL", "http://localhost:8000")
    assert get_api_url() == "http://localhost:8000"
```

测试结束后 pytest 自动恢复修改。

### 8.2 替换函数

被测代码 `crawler.py`：

```python
import requests


def get_title(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()["title"]
```

测试：

```python
import crawler


class FakeResponse:
    def raise_for_status(self):
        pass

    def json(self):
        return {"title": "pytest guide"}


def test_get_title(monkeypatch):
    def fake_get(url, timeout):
        assert url == "https://example.test/item/1"
        assert timeout == 10
        return FakeResponse()

    monkeypatch.setattr(crawler.requests, "get", fake_get)
    assert crawler.get_title("https://example.test/item/1") == "pytest guide"
```

关键原则：**在被测模块查找该对象的位置替换它**。这里 `crawler` 使用 `crawler.requests.get`，所以替换这个位置。

### 8.3 unittest.mock

标准库 `unittest.mock` 适合验证调用次数和参数：

```python
from unittest.mock import Mock


def notify(sender, message):
    sender.send(message)


def test_notify():
    sender = Mock()
    notify(sender, "done")
    sender.send.assert_called_once_with("done")
```

优先验证最终结果或状态；只有“是否调用某协作者”本身就是重要行为时，才验证调用细节。过度 mock 会把测试绑死在实现细节上。

### 8.4 patch 在哪里

假设：

```python
# service.py
from time import sleep

def wait():
    sleep(1)
```

应替换 `service.sleep`，而不是 `time.sleep`：

```python
import service


def test_wait(monkeypatch):
    calls = []
    monkeypatch.setattr(service, "sleep", lambda seconds: calls.append(seconds))
    service.wait()
    assert calls == [1]
```

---

## 9. 数据采集项目实战

### 9.1 把 I/O 和纯逻辑分开

采集程序最容易测试的结构是：

```text
下载 HTML（I/O） → 解析 HTML（纯逻辑） → 清洗数据（纯逻辑） → 保存（I/O）
```

纯逻辑直接输入输出，测试快速稳定；只在边缘隔离少量 I/O。

```python
# parser.py
from html.parser import HTMLParser


class TitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.parts.append(data)


def parse_title(html):
    parser = TitleParser()
    parser.feed(html)
    return "".join(parser.parts).strip()
```

```python
# test_parser.py
import pytest
from parser import parse_title


@pytest.mark.parametrize(
    ("html", "expected"),
    [
        ("<title>Hello</title>", "Hello"),
        ("<title>  中文标题  </title>", "中文标题"),
        ("<html></html>", ""),
        ("<title>Hello <b>World</b></title>", "Hello World"),
    ],
)
def test_parse_title(html, expected):
    assert parse_title(html) == expected
```

实际项目若已使用 BeautifulSoup、lxml 等库，就直接测试现有解析器；不要为了测试重写实现。

### 9.2 用真实样本做回归测试

```text
tests/
├── fixtures/
│   ├── normal.html
│   ├── empty.html
│   └── changed_layout.html
└── test_parser.py
```

```python
from pathlib import Path
import pytest


@pytest.fixture
def fixture_dir():
    return Path(__file__).parent / "fixtures"


def test_real_page_sample(fixture_dir):
    html = (fixture_dir / "normal.html").read_text(encoding="utf-8")
    assert "商品标题" in html
```

样本应小而有代表性，并移除 Cookie、Token、手机号等敏感数据。只保留能复现解析问题的最小 HTML，避免提交几 MB 的完整网页。

### 9.3 测试重试逻辑

被测代码：

```python
def fetch_with_retry(get, url, attempts=3):
    last_error = None
    for _ in range(attempts):
        try:
            return get(url)
        except TimeoutError as error:
            last_error = error
    raise last_error
```

测试先失败后成功：

```python
def test_retry_then_success():
    calls = 0

    def flaky_get(url):
        nonlocal calls
        calls += 1
        if calls < 3:
            raise TimeoutError
        return "ok"

    assert fetch_with_retry(flaky_get, "https://example.test") == "ok"
    assert calls == 3
```

测试耗尽次数：

```python
import pytest


def test_retry_exhausted():
    def always_timeout(url):
        raise TimeoutError("timeout")

    with pytest.raises(TimeoutError, match="timeout"):
        fetch_with_retry(always_timeout, "https://example.test", attempts=2)
```

让函数接收 `get` 这样的协作者，是轻量且容易测试的依赖注入。生产代码如果已经直接导入请求库，用 `monkeypatch` 即可，无须为了测试建立复杂框架。

### 9.4 网络测试的原则

单元测试默认不要访问公网，因为公网会受到断网、限流、验证码、页面变更和服务故障影响。可分为：

- 单元测试：假响应，无公网；
- 集成测试：本地 HTTP 测试服务器或专用测试环境；
- 少量冒烟测试：显式标记后访问真实站点。

```python
import os
import pytest


@pytest.mark.live
@pytest.mark.skipif(
    os.getenv("RUN_LIVE_TESTS") != "1",
    reason="需要显式启用真实网络测试",
)
def test_live_endpoint():
    ...
```

执行：

```bash
RUN_LIVE_TESTS=1 python -m pytest -m live
```

绝不要在测试代码中提交真实密钥，也不要让默认测试对生产环境执行写操作。

### 9.5 测试数据库或存储

原则：每个测试拥有独立数据，并在测试结束后清理。轻量场景可使用内存 SQLite：

```python
import sqlite3
import pytest


@pytest.fixture
def db():
    connection = sqlite3.connect(":memory:")
    connection.execute("create table items (id integer, title text)")
    yield connection
    connection.close()


def test_save_item(db):
    db.execute("insert into items values (?, ?)", (1, "Book"))
    row = db.execute("select * from items").fetchone()
    assert row == (1, "Book")
```

如果生产使用 PostgreSQL 特有语法或行为，SQLite 不能证明兼容性；这时增加使用真实 PostgreSQL 测试实例的集成测试。

---

## 10. 标记、筛选与跳过

### 10.1 自定义标记

```python
import pytest


@pytest.mark.slow
def test_large_import():
    ...
```

```bash
python -m pytest -m slow
python -m pytest -m "not slow"
python -m pytest -m "integration and not live"
```

在 `pyproject.toml` 注册，避免未知标记警告：

```toml
[tool.pytest.ini_options]
markers = [
  "slow: 运行时间较长的测试",
  "integration: 集成测试",
  "live: 访问真实外部服务的测试",
]
```

### 10.2 skip 和 skipif

```python
import sys
import pytest


@pytest.mark.skip(reason="功能尚未在该平台实现")
def test_future_feature():
    ...


@pytest.mark.skipif(sys.platform == "win32", reason="仅支持类 Unix 系统")
def test_unix_behavior():
    ...
```

### 10.3 xfail

已知缺陷暂时不能修复时：

```python
@pytest.mark.xfail(reason="issue #42", strict=True)
def test_known_bug():
    assert buggy_function() == "correct"
```

`strict=True` 意味着它意外通过时也会提醒你，防止修复后测试一直被当成预期失败。不要用 xfail 掩盖不稳定测试。

---

## 11. 测试组织和配置

### 11.1 推荐项目结构

```text
my_project/
├── pyproject.toml
├── src/
│   └── my_crawler/
│       ├── __init__.py
│       ├── client.py
│       └── parser.py
└── tests/
    ├── conftest.py
    ├── fixtures/
    ├── test_client.py
    └── test_parser.py
```

安装当前项目后测试：

```bash
python -m pip install -e .
python -m pytest
```

不要在测试里到处修改 `sys.path`。可编辑安装能让导入行为更接近真实使用。

### 11.2 pyproject.toml 配置

```toml
[tool.pytest.ini_options]
addopts = "-ra --strict-markers"
testpaths = ["tests"]
markers = [
  "slow: 慢速测试",
  "integration: 集成测试",
  "live: 真实网络测试",
]
```

- `-ra`：在结尾显示跳过、预期失败等摘要；
- `--strict-markers`：拼错标记时直接失败；
- `testpaths`：限制测试搜索目录。

配置也可以放在 `pytest.ini`。已有 `pyproject.toml` 时通常没必要新增一个配置文件。

### 11.3 测试命名

名称应该描述行为：

```python
def test_retry_stops_after_first_success(): ...
def test_parser_returns_empty_string_when_title_missing(): ...
```

比 `test_1`、`test_parser_ok` 更容易在 CI 失败报告中理解。

### 11.4 不要让测试互相依赖

每个测试都必须能单独运行，顺序不应影响结果：

```bash
python -m pytest tests/test_parser.py::test_one_case
```

若单独运行失败，通常说明共享了全局状态、数据库数据或文件。

---

## 12. 调试失败测试

常用命令：

```bash
python -m pytest -x             # 第一次失败就停
python -m pytest --maxfail=2    # 最多失败两次
python -m pytest -vv            # 更详细
python -m pytest -s             # 不捕获 print（临时调试）
python -m pytest --pdb          # 失败时进入调试器
python -m pytest --lf           # 只运行上次失败项
python -m pytest --ff           # 上次失败项优先
python -m pytest --tb=short     # 缩短 traceback
python -m pytest --durations=10 # 显示最慢的 10 个测试阶段
python -m pytest --fixtures     # 查看可用 fixture
python -m pytest --collect-only # 只查看收集到的测试
```

排错顺序：

1. 先读失败断言的实际值与期望值；
2. 单独运行失败测试；
3. 用 `-vv` 查看参数化输入；
4. 区分产品代码错误、测试预期错误、测试环境错误；
5. 必要时用 `--pdb`，不要长期保留调试 `print`。

### 12.1 F 和 E 的区别

- **FAILURE**：测试执行到了断言，但结果不符合预期；
- **ERROR**：fixture、导入、setup/teardown 等阶段出错，测试主体可能根本没执行。

### 12.2 不稳定测试（flaky test）

常见原因：

- 依赖真实网络；
- 依赖当前时间或随机数；
- 使用固定端口；
- 多个测试共享全局状态；
- 使用 `sleep()` 猜异步任务完成时间；
- 数据库或文件未清理。

正确做法是消除根因，而不是盲目自动重跑。重跑会把真实缺陷藏起来。

---

## 13. 进阶能力与插件

先熟练 pytest 内置功能，再按需要安装插件。

### 13.1 覆盖率 pytest-cov

```bash
python -m pip install pytest-cov
python -m pytest --cov=my_crawler --cov-report=term-missing
```

覆盖率只表示“代码被执行过”，不表示断言正确或边界情况完整。不要为了 100% 写没有价值的测试；优先覆盖核心业务、异常分支和曾经出现的缺陷。

可在 CI 设置合理门槛：

```bash
python -m pytest --cov=my_crawler --cov-fail-under=80
```

### 13.2 异步测试 pytest-asyncio

```bash
python -m pip install pytest-asyncio
```

```python
import pytest


async def async_fetch():
    return {"status": "ok"}


@pytest.mark.asyncio
async def test_async_fetch():
    result = await async_fetch()
    assert result["status"] == "ok"
```

### 13.3 并行 pytest-xdist

```bash
python -m pip install pytest-xdist
python -m pytest -n auto
```

只有测试套件明显变慢时再加。并行要求测试相互独立；共享端口、固定文件路径或同一数据库记录会产生冲突。

### 13.4 命令行参数和钩子

`conftest.py` 可扩展 pytest：

```python
def pytest_addoption(parser):
    parser.addoption("--base-url", default="http://localhost:8000")


import pytest


@pytest.fixture
def base_url(request):
    return request.config.getoption("--base-url")
```

```bash
python -m pytest --base-url=https://test.example.com
```

钩子能力很强，但只应解决真实需求。能用 fixture 和 marker 完成时，不要急着写插件或复杂钩子。

### 13.5 CI 中运行

GitHub Actions 最小示例：

```yaml
name: tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip
      - run: python -m pip install -e . pytest
      - run: python -m pytest
```

如果项目有开发依赖配置，应安装项目定义的测试依赖，而不是在 CI 重复维护一长串版本。

---

## 14. 测试设计方法

### 14.1 等价类与边界值

以分页参数为例：

- 正常值：1、2；
- 边界值：1、最大页；
- 非法值：0、负数、字符串、`None`；
- 极端值：非常大的整数。

```python
import pytest


def normalize_page(page):
    if not isinstance(page, int) or isinstance(page, bool) or page < 1:
        raise ValueError("page must be a positive integer")
    return page


@pytest.mark.parametrize("page", [1, 2, 10_000])
def test_valid_pages(page):
    assert normalize_page(page) == page


@pytest.mark.parametrize("page", [0, -1, "1", None, True])
def test_invalid_pages(page):
    with pytest.raises(ValueError):
        normalize_page(page)
```

### 14.2 状态转换

重试器、任务队列、登录流程等有状态逻辑，应验证关键转换：

- 初始 → 成功；
- 初始 → 失败 → 重试 → 成功；
- 初始 → 连续失败 → 终止；
- 取消后不再执行。

### 14.3 回归测试

发现 bug 后：

1. 先写一个能稳定重现 bug 的失败测试；
2. 修复根因；
3. 确认新测试和原有测试全部通过；
4. 永久保留该测试，防止复发。

### 14.4 测行为，不测内部实现

脆弱测试：

```python
def test_parser_internal_steps(parser):
    assert parser._normalize.call_count == 2
```

更稳健的测试：

```python
def test_parser_normalizes_title():
    assert parse_title("<title>  Hello  </title>") == "Hello"
```

只要外部行为没变，内部重构不应导致大量测试失败。

### 14.5 测试也要评审

检查清单：

- 测试名是否说明场景和结果？
- 失败时能否快速看懂？
- 是否能独立、重复运行？
- 是否误访问真实生产资源？
- 是否覆盖正常、边界和错误路径？
- 是否 mock 了过多内部实现？
- fixture 是否过大或隐藏了关键数据？

---

## 15. 常见误区

### 误区 1：一个测试验证整个系统

问题：失败后难定位，准备复杂，运行慢。拆成纯逻辑单元测试和少量集成测试。

### 误区 2：复制粘贴 setup

相同资源准备出现多次时提取 fixture；但仅出现一两次、每处略有不同，不必为了“复用”制造抽象。

### 误区 3：fixture 返回巨型万能对象

一个 fixture 同时创建用户、数据库、网络客户端、文件和配置，会隐藏因果关系。拆成可组合的小 fixture，并让测试只请求所需资源。

### 误区 4：测试中使用 if

```python
if result:
    assert result["ok"]
```

当 `result` 为空时，这个测试什么都没验证却会通过。直接断言：

```python
assert result
assert result["ok"]
```

### 误区 5：捕获异常后不验证

不要这样：

```python
try:
    dangerous_call()
except ValueError:
    pass
```

如果没有抛异常，测试仍然通过。应使用 `pytest.raises`。

### 误区 6：真实时间和 sleep

把“当前时间”作为参数或可替换协作者传入，比在测试里等待更快、更稳定。

### 误区 7：盲目追求 100% 覆盖率

行覆盖率无法发现错误断言、漏掉的输入组合、并发问题或真实系统集成差异。覆盖率是提示仪表，不是质量证明。

### 误区 8：生产代码难测就堆 mock

大量 patch 往往说明 I/O 和业务逻辑混在一起。先把纯转换逻辑提成普通函数，再在边缘隔离 I/O，测试会自然变简单。

---

## 16. 完整练习项目

下面的项目涵盖解析、参数化、异常、fixture、临时文件和 monkeypatch。

### 16.1 目录

```text
price_project/
├── price_service.py
└── tests/
    ├── conftest.py
    └── test_price_service.py
```

### 16.2 生产代码

`price_service.py`：

```python
import json
from pathlib import Path
from urllib.request import urlopen


def parse_price(payload: str) -> float:
    data = json.loads(payload)
    price = float(data["price"])
    if price < 0:
        raise ValueError("price cannot be negative")
    return price


def fetch_price(url: str) -> float:
    with urlopen(url, timeout=5) as response:
        payload = response.read().decode("utf-8")
    return parse_price(payload)


def save_price(path: Path, price: float) -> None:
    path.write_text(f"{price:.2f}\n", encoding="utf-8")
```

### 16.3 测试代码

`tests/conftest.py`：

```python
import pytest


@pytest.fixture
def valid_payload():
    return '{"price": "19.90"}'
```

`tests/test_price_service.py`：

```python
import pytest

import price_service
from price_service import fetch_price, parse_price, save_price


def test_parse_valid_price(valid_payload):
    assert parse_price(valid_payload) == pytest.approx(19.9)


@pytest.mark.parametrize(
    "payload",
    [
        "{}",
        '{"price": "not-number"}',
        "not-json",
    ],
)
def test_parse_invalid_payload(payload):
    with pytest.raises((KeyError, ValueError)):
        parse_price(payload)


def test_negative_price():
    with pytest.raises(ValueError, match="negative"):
        parse_price('{"price": -1}')


def test_save_price(tmp_path):
    output = tmp_path / "price.txt"
    save_price(output, 19.9)
    assert output.read_text(encoding="utf-8") == "19.90\n"


class FakeResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        pass

    def read(self):
        return b'{"price": 8.5}'


def test_fetch_price_without_network(monkeypatch):
    def fake_urlopen(url, timeout):
        assert url == "https://example.test/price"
        assert timeout == 5
        return FakeResponse()

    monkeypatch.setattr(price_service, "urlopen", fake_urlopen)

    assert fetch_price("https://example.test/price") == pytest.approx(8.5)
```

运行：

```bash
cd price_project
python -m pip install pytest
python -m pytest -v
```

### 16.4 练习任务

按顺序完成，不要直接看答案：

1. 为 `parse_price` 增加价格为 0 的测试；
2. 明确规定布尔值是否允许作为价格，并写测试；
3. 修改 `fetch_price` 处理非 UTF-8 内容，并写异常测试；
4. 给 `save_price` 增加父目录不存在的场景；
5. 实现超时重试，使用假函数验证最多请求次数；
6. 给真实网络测试增加 `live` marker 和环境变量开关；
7. 安装 `pytest-cov`，找出尚未执行的代码行。

完成标准：任何测试都能单独运行，默认测试不访问公网，不在项目目录残留文件。

---

## 17. 学习路线与速查表

### 17.1 四阶段路线

**阶段一：入门（1～2 天）**

- 会写 `test_*` 函数；
- 掌握 `assert`、`pytest.raises`、`pytest.approx`；
- 会按路径和名称运行测试；
- 为自己现有代码写 10 个小测试。

**阶段二：熟练（3～7 天）**

- 掌握 fixture、`yield` 清理和 `conftest.py`；
- 掌握参数化、`tmp_path`、`capsys`、`caplog`；
- 用 monkeypatch 隔离 HTTP 请求、环境变量和时间；
- 把一个采集流程拆成下载、解析、清洗、保存四部分测试。

**阶段三：工程化（1～2 周）**

- 区分单元、集成和端到端测试；
- 配置 marker、覆盖率和 CI；
- 建立真实但脱敏的 HTML 回归样本；
- 学会定位和消除 flaky test。

**阶段四：精通（持续实践）**

- 根据风险选择测试层次和边界；
- 设计易测试的代码，而不是事后堆 mock；
- 能评审测试的有效性、可读性和隔离性；
- 用失败测试重现 bug，再修复根因；
- 能平衡覆盖率、速度和维护成本。

“精通”不是背完 pytest API，而是能用最少但高价值的测试，对代码行为建立可信反馈。

### 17.2 常用内置 fixture

| fixture          | 用途                                   |
| ---------------- | -------------------------------------- |
| `tmp_path`     | 独立临时目录，返回`Path`             |
| `monkeypatch`  | 临时修改属性、字典、环境变量、工作目录 |
| `capsys`       | 捕获 Python stdout/stderr              |
| `capfd`        | 捕获文件描述符级 stdout/stderr         |
| `caplog`       | 捕获日志                               |
| `request`      | 获取当前测试和 fixture 上下文、参数    |
| `pytestconfig` | 读取 pytest 配置与命令行选项           |
| `cache`        | 跨测试运行保存少量状态                 |

### 17.3 高频命令

```bash
python -m pytest                         # 全部测试
python -m pytest -q                      # 精简输出
python -m pytest -v                      # 详细测试名
python -m pytest tests/test_api.py       # 指定文件
python -m pytest path.py::test_name      # 指定测试
python -m pytest -k "retry"              # 按名称筛选
python -m pytest -m "not slow"           # 按标记筛选
python -m pytest -x                      # 首次失败停止
python -m pytest --lf                    # 上次失败项
python -m pytest --pdb                   # 失败后调试
python -m pytest --collect-only          # 查看收集结果
python -m pytest --durations=10          # 找慢测试
```

### 17.4 API 速查

```python
assert actual == expected
assert value == pytest.approx(expected)

with pytest.raises(ValueError, match="message"):
    call()

@pytest.fixture
def resource():
    value = create()
    yield value
    cleanup(value)

@pytest.mark.parametrize("input,expected", [(1, 2), (2, 4)])
def test_double(input, expected):
    assert input * 2 == expected

monkeypatch.setenv("KEY", "value")
monkeypatch.setattr(module, "function", fake_function)
```

### 17.5 你是否真正掌握了 pytest

如果你能独立完成下面这些事，就已经具备实际项目能力：

- 看见一个函数，能列出正常、边界、错误输入；
- 不访问公网就能测试 HTTP 采集逻辑；
- 用 fixture 准备资源并可靠清理；
- 用参数化覆盖多组案例；
- 从失败报告快速定位问题；
- 让所有测试相互独立且可重复；
- 在 CI 自动运行，并正确理解覆盖率；
- 面对难测代码，能识别并分离纯逻辑与 I/O；
- 新 bug 出现时，先留下一个稳定的回归测试。

最后一个建议：现在就选择你已有采集项目中的一个“HTML 解析函数”，为它准备正常页面、字段缺失、空页面、结构变化四个输入。实际写完这四个测试，比继续阅读更多 API 更接近真正掌握 pytest。
