# uv 从基础到精通：给 Conda 用户的实战迁移指南

> 适合读者：有 Python 基础、做过 Python 开发或自动化数据采集、长期使用 Conda，但尚未使用 uv。
>
> 本文按 2026 年 7 月的 uv 官方用法编写。uv 更新较快，文末附有官方文档入口。

## 1. 先用一句话认识 uv

`uv` 是 Astral 使用 Rust 编写的 Python 包与项目管理工具。它可以统一完成：

- 安装和切换 Python；
- 创建虚拟环境；
- 安装、删除、升级依赖；
- 生成跨平台锁文件；
- 运行项目命令；
- 临时或全局运行 Python 命令行工具；
- 构建和发布 Python 包；
- 提供与 `pip` 兼容的低层命令。

你可以先这样理解：

```text
uv ≈ Python 版本管理器 + venv + pip + pip-tools + pipx + 项目锁文件
```

但它并不等于完整的 Conda。

### 1.1 uv 与 Conda 的关键区别

| 能力               | Conda                                  | uv                            |
| ------------------ | -------------------------------------- | ----------------------------- |
| 管理 Python 版本   | 支持                                   | 支持                          |
| 管理 Python 包     | 支持                                   | 支持，主要来自 PyPI           |
| 虚拟环境           | 支持                                   | 支持，默认`.venv`           |
| 锁定依赖           | `environment.yml` 通常不是严格锁文件 | `uv.lock` 是跨平台锁文件    |
| 管理非 Python 软件 | 支持，如 CUDA、GDAL、FFmpeg、编译器    | 不负责系统级软件包            |
| 项目元数据         | `environment.yml`                    | 标准`pyproject.toml`        |
| 命令行工具隔离安装 | 通常手动建环境                         | `uv tool install` / `uvx` |

**判断标准：**

- 纯 Python 项目、Web、脚本、爬虫、数据采集：优先使用 uv；
- 依赖 CUDA、特定系统动态库、复杂科学计算二进制环境：可以保留 Conda，或用系统包管理器/Docker 管理系统依赖，再让 uv 管 Python 依赖；
- 不要为了“迁移干净”而强行卸载 Conda。先让两个工具共存，逐个项目迁移。

---

## 2. 安装 uv

### 2.1 macOS / Linux

官方安装脚本：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

重新打开终端后检查：

```bash
uv --version
```

### 2.2 Windows PowerShell

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

然后新开一个 PowerShell：

```powershell
uv --version
```

### 2.3 其他安装方式

如果你已经有 Python，也可以：

```bash
pipx install uv
```

macOS 使用 Homebrew：

```bash
brew install uv
```

升级 uv：

```bash
uv self update
```

如果 uv 由 Homebrew、pipx 等包管理器安装，应使用对应包管理器升级。

### 2.4 Shell 自动补全

先查看 uv 针对当前版本给出的命令：

```bash
uv generate-shell-completion --help
```

例如 zsh：

```bash
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
```

---

## 3. 第一条最重要的工作流

对于绝大多数项目，你只需先掌握 5 个命令：

```bash
uv init my-project        # 创建项目
cd my-project
uv add requests           # 添加依赖
uv run python main.py     # 在项目环境中运行
uv sync                   # 按锁文件同步环境
```

完整体验：

```bash
uv init uv-demo
cd uv-demo
uv add requests
uv run python -c "import requests; print(requests.get('https://example.com').status_code)"
```

你不必先执行 `activate`。`uv run` 会自动：

1. 找到项目；
2. 创建或更新 `.venv`；
3. 根据 `pyproject.toml` 和 `uv.lock` 准备依赖；
4. 在正确环境中执行命令。

这就是 uv 最推荐的日常心智模型：**声明依赖，然后通过 `uv run` 执行。**

---

## 4. 项目中的三个核心对象

运行 `uv init` 后，重点关注：

```text
my-project/
├── .python-version   # 项目默认 Python 版本（可能存在）
├── .venv/            # 本地虚拟环境，不提交 Git
├── pyproject.toml    # 项目配置与直接依赖，提交 Git
└── uv.lock           # 完整、可复现的依赖锁文件，提交 Git
```

### 4.1 `pyproject.toml`

它描述“项目想要什么”：

```toml
[project]
name = "collector"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "httpx>=0.28.1",
]
```

通常不要手写依赖版本，优先执行：

```bash
uv add httpx
```

### 4.2 `uv.lock`

它记录解析后的完整依赖图、精确版本及校验信息。团队成员和 CI 使用同一锁文件，可以得到一致环境。

一般应把 `uv.lock` 提交到 Git。应用项目尤其应该提交；库项目通常也建议提交，以便开发和 CI 可复现。

不要手工编辑 `uv.lock`。

### 4.3 `.venv`

它是可丢弃的本地缓存结果：

- 不要提交到 Git；
- 损坏时可删除，然后执行 `uv sync` 重建；
- 真正的环境来源是 `pyproject.toml` 与 `uv.lock`。

推荐 `.gitignore` 至少包含：

```gitignore
.venv/
__pycache__/
.pytest_cache/
.env
```

---

## 5. Python 版本管理

### 5.1 查看可用 Python

```bash
uv python list
```

### 5.2 安装 Python

```bash
uv python install 3.12
uv python install 3.11 3.12 3.13
```

uv 安装的 Python 与系统 Python 分离，不需要管理员权限。

### 5.3 为项目固定 Python

```bash
uv python pin 3.12
```

它通常会创建 `.python-version`。检查：

```bash
cat .python-version
uv run python --version
```

### 5.4 临时指定 Python

```bash
uv run --python 3.11 python --version
uv venv --python 3.12
```

### 5.5 两种“版本约束”不要混淆

- `.python-version`：开发时希望 uv 默认使用哪个 Python；
- `project.requires-python`：这个项目允许在哪些 Python 版本上运行。

例如：

```toml
requires-python = ">=3.10,<3.14"
```

项目本地可以 pin 到 `3.12`，但发布的包仍允许用户在 3.10～3.13 使用。

---

## 6. 创建与使用虚拟环境

### 6.1 项目模式：通常不用手动创建

```bash
uv init collector
cd collector
uv add httpx
uv run python main.py
```

uv 会自动管理 `.venv`。

### 6.2 只想要传统 venv

```bash
mkdir experiment
cd experiment
uv venv
```

激活方式与标准 venv 相同：

```bash
# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

退出：

```bash
deactivate
```

激活后可使用兼容 pip 的命令：

```bash
uv pip install requests
```

不过在正式项目中，更推荐 `uv add requests`，因为它会同时更新项目声明和锁文件。

### 6.3 `uv run` 与激活环境怎么选

优先：

```bash
uv run python main.py
uv run pytest
uv run scrapy crawl example
```

只有在 IDE、交互式调试或连续输入大量命令时，才有必要激活 `.venv`。

---

## 7. 依赖管理：日常最常用部分

### 7.1 添加依赖

```bash
uv add requests
uv add "httpx>=0.28"
uv add pandas openpyxl
```

添加 Git 依赖：

```bash
uv add "git+https://github.com/encode/httpx"
```

添加本地包：

```bash
uv add ../shared-lib
```

开发期可编辑安装：

```bash
uv add --editable ../shared-lib
```

### 7.2 删除依赖

```bash
uv remove requests
```

### 7.3 开发依赖

测试、格式化、类型检查等不应成为运行时依赖：

```bash
uv add --dev pytest ruff mypy
```

运行：

```bash
uv run pytest
uv run ruff check .
```

### 7.4 自定义依赖组

复杂项目可以按用途分组：

```bash
uv add --group test pytest pytest-cov
uv add --group lint ruff mypy
```

同步指定组：

```bash
uv sync --group test
uv sync --group lint
uv sync --all-groups
```

只安装生产运行依赖：

```bash
uv sync --no-dev
```

### 7.5 可选功能 extras

如果你的包有用户可选功能，可在 `pyproject.toml` 中定义：

```toml
[project.optional-dependencies]
excel = ["openpyxl>=3.1"]
postgres = ["psycopg[binary]>=3.2"]
```

同步某个 extra：

```bash
uv sync --extra excel
uv sync --all-extras
```

区分：

- dependency group：给开发者使用，例如测试、lint；
- optional dependency / extra：给项目用户选择，例如 `collector[postgres]`。

### 7.6 查看依赖树

```bash
uv tree
```

这对定位“某个间接依赖为什么被安装”非常有用。

---

## 8. 锁定、同步与升级

### 8.1 三个命令的职责

```bash
uv add requests   # 修改直接依赖，并更新锁与环境
uv lock           # 只更新/检查锁文件
uv sync           # 让环境与项目和锁文件一致
```

一般开发时直接使用 `uv add` / `uv remove`；拉取团队代码后使用 `uv sync`。

### 8.2 可复现安装

CI 中应拒绝隐式修改锁文件：

```bash
uv sync --locked
```

如果 `pyproject.toml` 与 `uv.lock` 不一致，命令会失败。

要求锁文件存在且不重新解析，适合更严格的部署：

```bash
uv sync --frozen
```

简单理解：

- `--locked`：验证锁文件是最新的；
- `--frozen`：直接使用现有锁文件，不检查它是否需要更新。

团队 CI 通常优先 `--locked`。

### 8.3 升级依赖

升级单个包：

```bash
uv lock --upgrade-package requests
uv sync
```

升级所有允许升级的包：

```bash
uv lock --upgrade
uv sync
```

注意：版本仍受 `pyproject.toml` 约束。如果写了 `requests<2.33`，升级不会越过上限。

### 8.4 为什么不要每天无脑全量升级

锁文件的价值就是让升级成为一次明确变更。推荐：

1. 修改或升级依赖；
2. 查看 `uv.lock` 变化；
3. 运行测试；
4. 提交代码与锁文件。

---

## 9. 运行 Python、模块和项目命令

```bash
uv run python main.py
uv run python -m collector
uv run pytest -q
uv run ruff format .
uv run scrapy crawl products
```

给命令传环境变量：

```bash
API_URL=https://example.com uv run python main.py
```

项目需要 `.env` 文件时：

```bash
uv run --env-file .env python main.py
```

`.env` 中常含密钥，不要提交到 Git。提交一个 `.env.example` 作为字段模板即可。

如果确定环境已经同步，不希望运行前检查：

```bash
uv run --no-sync python main.py
```

日常不必加它；这是追求启动延迟或受控环境时的高级选项。

---

## 10. 单文件脚本：自动化采集特别实用

有些采集任务只有一个 `.py` 文件，不值得创建完整项目。uv 支持在脚本中记录依赖。

新建脚本：

```bash
uv init --script collect.py --python 3.12
uv add --script collect.py requests beautifulsoup4
```

运行：

```bash
uv run collect.py
```

脚本顶部会出现符合 PEP 723 的元数据，大致如下：

```python
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "beautifulsoup4>=4.13.0",
#     "requests>=2.32.0",
# ]
# ///

import requests
from bs4 import BeautifulSoup

html = requests.get("https://example.com", timeout=20).text
print(BeautifulSoup(html, "html.parser").title.string)
```

任何安装了 uv 的机器都能直接执行这个文件，uv 会自动准备隔离环境。

临时运行且不写入脚本元数据：

```bash
uv run --with requests --with beautifulsoup4 collect.py
```

使用建议：

- 一次性脚本：`uv run --with ...`；
- 要分享、要定时运行的单文件脚本：PEP 723 元数据；
- 文件逐渐增多或需要测试：升级为完整 uv 项目。

---

## 11. 命令行工具：替代 pipx

### 11.1 临时执行 `uvx`

```bash
uvx ruff check .
uvx pycowsay hello
```

`uvx` 等价于 `uv tool run`。工具在隔离环境中运行，不污染项目依赖。

指定版本：

```bash
uvx ruff@0.12.0 check .
```

### 11.2 持久安装工具

```bash
uv tool install ruff
ruff --version
```

管理工具：

```bash
uv tool list
uv tool upgrade ruff
uv tool upgrade --all
uv tool uninstall ruff
```

判断规则：

- 项目必须固定工具版本：`uv add --dev ruff`，再用 `uv run ruff`；
- 偶尔运行一次：`uvx ruff`；
- 希望在所有目录直接调用：`uv tool install ruff`。

---

## 12. `uv pip`：兼容旧式 requirements 工作流

uv 提供高性能的 pip 兼容接口：

```bash
uv venv
uv pip install requests
uv pip uninstall requests
uv pip list
uv pip freeze
uv pip check
```

安装 requirements：

```bash
uv pip install -r requirements.txt
```

让环境严格匹配 requirements（会移除多余包）：

```bash
uv pip sync requirements.txt
```

从输入约束生成固定版本文件：

```bash
uv pip compile requirements.in -o requirements.txt
```

重要区别：

```text
uv add     = 项目级工作流，更新 pyproject.toml 和 uv.lock
uv pip ... = 低层、兼容 pip 的环境操作，不替你管理项目声明
```

新项目优先使用 `uv add`。只有迁移旧项目、兼容已有部署格式或直接操作某个 venv 时，才使用 `uv pip`。

---

## 13. 从 Conda 项目迁移到 uv

### 13.1 迁移前先分类依赖

查看原环境：

```bash
conda env export --from-history > environment-history.yml
conda list
```

把依赖分为两类：

1. Python/PyPI 包：`requests`、`pandas`、`scrapy`、`sqlalchemy` 等；
2. 系统或 Conda 二进制包：`cudatoolkit`、编译器、某些 GDAL/FFmpeg 库等。

第一类交给 uv。第二类交给操作系统包管理器、Docker，或暂时继续使用 Conda。

### 13.2 推荐迁移流程

在原项目根目录：

```bash
uv init
uv python pin 3.12
uv add requests pandas beautifulsoup4
uv add --dev pytest ruff
uv run pytest
```

不要把 `conda list` 的全部内容原样塞进 uv。里面包含大量间接依赖和 Conda 自己的底层包。只添加你的代码**直接 import 或直接依赖**的包，让 uv 解析间接依赖。

### 13.3 从 `requirements.txt` 迁移

如果文件质量较好，可以先：

```bash
uv add -r requirements.txt
```

然后：

```bash
uv run pytest
```

验证通过后，`pyproject.toml` 与 `uv.lock` 成为主要依赖来源。是否保留 `requirements.txt` 取决于部署平台是否仍要求它。

如需为旧平台导出：

```bash
uv export --format requirements-txt --output-file requirements.txt
```

### 13.4 Conda 命令对照表

| Conda 习惯                              | uv 对应方式                                     |
| --------------------------------------- | ----------------------------------------------- |
| `conda create -n app python=3.12`     | `uv init app && cd app && uv python pin 3.12` |
| `conda activate app`                  | 通常无需激活，使用`uv run ...`                |
| `conda install requests`              | `uv add requests`                             |
| `conda remove requests`               | `uv remove requests`                          |
| `conda env update -f environment.yml` | `uv sync`                                     |
| `conda env export`                    | 提交`pyproject.toml` 与 `uv.lock`           |
| `conda list`                          | `uv pip list` 或 `uv tree`                  |
| `conda run -n app python x.py`        | 在项目目录执行`uv run python x.py`            |
| 删除环境                                | 删除`.venv`；下次 `uv sync` 可重建          |

### 13.5 避免 Conda 与 uv 环境串用

如果终端默认显示 `(base)`，建议先：

```bash
conda deactivate
```

可选：关闭 Conda 自动激活 base：

```bash
conda config --set auto_activate_base false
```

然后在 uv 项目中检查：

```bash
uv run python -c "import sys; print(sys.executable)"
```

路径应指向当前项目的 `.venv`，而不是 Conda 环境。

---

## 14. 一个适合数据采集的完整项目

### 14.1 初始化

```bash
uv init web-collector
cd web-collector
uv python pin 3.12
uv add httpx beautifulsoup4 tenacity
uv add --dev pytest ruff
```

### 14.2 编写 `main.py`

```python
import httpx
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=8))
def fetch_title(url: str) -> str:
    response = httpx.get(url, timeout=20, follow_redirects=True)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.title.get_text(strip=True) if soup.title else ""


if __name__ == "__main__":
    print(fetch_title("https://example.com"))
```

### 14.3 运行与检查

```bash
uv run python main.py
uv run ruff check .
uv run pytest
```

### 14.4 团队成员拉取项目

```bash
git clone <仓库地址>
cd web-collector
uv sync --locked
uv run python main.py
```

团队成员不需要知道你的 Conda 环境，也不需要手工逐个安装包。

---

## 15. IDE 配置

### VS Code / Cursor

1. 在项目中先执行一次 `uv sync`；
2. 打开命令面板；
3. 选择 **Python: Select Interpreter**；
4. 选择项目中的 `.venv` Python。

典型路径：

```text
macOS/Linux: <项目>/.venv/bin/python
Windows:     <项目>/.venv/Scripts/python.exe
```

### PyCharm

添加 Existing/Local Interpreter，指向同一 `.venv` 解释器即可。

不要让 IDE 另外再建一个环境，否则终端与 IDE 可能使用不同依赖。

---

## 16. 私有 PyPI 与镜像源

临时指定索引：

```bash
uv add --index https://pypi.example.com/simple internal-package
```

uv 支持在 `pyproject.toml` 中声明索引，并把特定包固定到特定索引。企业项目建议使用 uv 官方的“Package indexes”配置方式，不要只复制 pip 的配置并假设解析策略完全相同。

凭据不要写入 Git。优先使用：

- CI secret；
- 环境变量；
- uv 的认证命令或系统凭据存储；
- 企业提供的短期 token。

排查索引与解析问题时：

```bash
uv add -v some-package
uv lock -v
```

镜像源的可用参数与认证方式可能随基础设施不同，落地时以你使用的镜像服务说明和 uv 官方索引文档为准。

---

## 17. GitHub Actions CI

一个简洁的测试工作流：

```yaml
name: test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
        with:
          enable-cache: true
      - run: uv python install
      - run: uv sync --locked --all-groups
      - run: uv run pytest
```

如果只需默认开发依赖，可省略 `--all-groups`。

关键原则：

- 提交 `uv.lock`；
- CI 使用 `--locked`；
- 缓存 uv 下载缓存，而不是把本地 `.venv` 提交进仓库；
- 测试命令仍通过 `uv run` 执行。

---

## 18. Docker 部署

以下是应用项目的基础示例：

```dockerfile
FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .
RUN uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "main.py"]
```

为什么分两次复制：依赖文件不变时，Docker 可以复用依赖安装层；只修改业务代码不会重新下载所有依赖。

生产建议：

- 正式项目不要长期依赖浮动的 `uv:latest`，应固定已验证的 uv 版本或镜像 digest；
- 使用 `--frozen` 防止构建时改锁；
- 使用 `--no-dev` 排除开发依赖；
- 系统库仍通过 `apt-get`、基础镜像或多阶段构建提供。

---

## 19. Workspace：管理多个相关 Python 包

当一个仓库包含多个相互依赖的包时，可以使用 uv workspace，例如：

```text
repo/
├── pyproject.toml
└── packages/
    ├── collector-core/
    └── collector-cli/
```

根 `pyproject.toml`：

```toml
[tool.uv.workspace]
members = ["packages/*"]
```

workspace 共享一个锁文件，适合 monorepo。

但不要一开始就使用 workspace。只有确实存在多个可独立发布或复用的包时再引入；普通采集项目用一个 `pyproject.toml` 就够了。

---

## 20. 构建与发布 Python 包

创建可发布包：

```bash
uv init --package my-package
cd my-package
uv build
```

产物位于 `dist/`，通常包含 wheel 和源码包。

发布前检查项目元数据、测试，并先考虑 TestPyPI。正式发布：

```bash
uv publish
```

通过环境变量或可信发布配置提供 token，不要把 token 写入 shell 历史、源码或 `pyproject.toml`。

仅在你要把代码作为库/命令行程序分发时才需要本节。普通内部应用无需为了“规范”而发布成包。

---

## 21. 缓存、清理与磁盘空间

uv 会缓存下载和构建结果，因此第二次安装通常很快。

查看缓存目录：

```bash
uv cache dir
```

查看缓存大小：

```bash
uv cache size
```

清理缓存：

```bash
uv cache clean
```

不要把清缓存当作日常步骤；缓存正是 uv 快的原因。只有磁盘紧张或排查疑似缓存损坏时再清理。

---

## 22. 常见问题排查

### 22.1 `uv` 命令找不到

重新打开终端，或检查安装目录是否在 `PATH`：

```bash
command -v uv
echo "$PATH"
```

Windows 使用：

```powershell
Get-Command uv
```

### 22.2 运行的不是预期 Python

```bash
uv run python --version
uv run python -c "import sys; print(sys.executable)"
uv python list
```

必要时：

```bash
uv python pin 3.12
uv sync
```

### 22.3 代码中能 import，IDE 却报红

IDE 选错了解释器。把解释器改为项目 `.venv` 中的 Python。

### 22.4 `ModuleNotFoundError`

先确认依赖是否已声明：

```bash
uv tree
uv add 缺少的包名
uv run python your_script.py
```

不要用系统 `pip install` 临时补包，否则项目声明和实际环境会分叉。

### 22.5 锁文件冲突

Git 合并后优先让 uv 重新生成一致锁文件：

```bash
uv lock
uv sync
```

然后运行测试并提交新锁文件。不要长期手工编辑复杂的 `uv.lock` 冲突内容。

### 22.6 原生扩展构建失败

使用详细日志：

```bash
uv sync -v
```

常见原因不是 uv 本身，而是：

- 当前 Python/平台没有对应 wheel；
- 缺少 C/C++/Rust 编译器；
- 缺少系统头文件或动态库；
- 包尚不支持过新的 Python 版本。

优先尝试受支持的稳定 Python 版本；再根据包文档安装系统依赖。

### 22.7 想彻底重建环境

macOS/Linux：

```bash
rm -rf .venv
uv sync
```

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force .venv
uv sync
```

这不会丢失项目依赖，因为依赖来源在 `pyproject.toml` 和 `uv.lock`。

### 22.8 网络慢或无法访问 PyPI

```bash
uv sync -v
```

检查代理、DNS、证书、企业索引和认证配置。不要通过关闭 TLS 校验来“解决”证书问题。

---

## 23. 最佳实践清单

### 应该做

- 新项目用 `uv init`；
- 依赖用 `uv add` / `uv remove` 管理；
- 命令通过 `uv run` 执行；
- 提交 `pyproject.toml`、`uv.lock`；
- 忽略 `.venv` 与密钥文件；
- CI 使用 `uv sync --locked`；
- 定期、有测试地升级锁文件；
- 系统依赖交给系统包管理器或 Docker。

### 不应该做

- 不要混用 `pip install`、`conda install` 和 `uv add` 去修改同一个环境；
- 不要提交 `.venv`；
- 不要手改 `uv.lock`；
- 不要从 `conda list` 复制全部间接依赖；
- 不要把 API token 写进 `pyproject.toml` 或 Git；
- 不要把 `uv pip` 当作新项目的默认项目管理方式；
- 不要为一个简单项目过早引入 workspace、复杂私有索引或多层依赖组。

---

## 24. 速查表

```bash
# 安装/升级
uv --version
uv self update

# 新项目
uv init my-project
uv init --package my-package
uv init --script task.py

# Python
uv python list
uv python install 3.12
uv python pin 3.12

# 依赖
uv add requests
uv add --dev pytest
uv add --group lint ruff
uv remove requests
uv tree

# 环境与锁
uv sync
uv sync --locked
uv sync --no-dev
uv lock
uv lock --upgrade-package requests
uv lock --upgrade

# 运行
uv run python main.py
uv run pytest
uv run --with requests script.py

# 单文件脚本
uv add --script task.py requests
uv run task.py

# 命令行工具
uvx ruff check .
uv tool install ruff
uv tool list
uv tool upgrade --all

# pip 兼容模式
uv venv
uv pip install -r requirements.txt
uv pip compile requirements.in -o requirements.txt
uv pip sync requirements.txt

# 导出、构建、发布
uv export --format requirements-txt --output-file requirements.txt
uv build
uv publish

# 排查
uv run python -c "import sys; print(sys.executable)"
uv sync -v
uv cache dir
uv cache clean
```

---

## 25. 从入门到熟练的 7 天练习路线

### 第 1 天：完成最小闭环

```bash
uv init demo
cd demo
uv add requests
uv run python main.py
```

目标：理解 `pyproject.toml`、`uv.lock`、`.venv` 的角色。

### 第 2 天：迁移一个小脚本

把一个旧采集脚本改成 PEP 723 单文件脚本：

```bash
uv init --script collect.py --python 3.12
uv add --script collect.py requests beautifulsoup4
uv run collect.py
```

### 第 3 天：迁移一个真实项目

- 只添加直接依赖；
- 添加 pytest 和 ruff 为开发依赖；
- 使用 `uv run pytest` 验证；
- 提交 `pyproject.toml` 与 `uv.lock`。

### 第 4 天：掌握升级与回滚

```bash
uv lock --upgrade-package requests
uv run pytest
git diff uv.lock
```

目标：把依赖升级视为可审查的代码变更。

### 第 5 天：接入 IDE 与 CI

- IDE 选择 `.venv`；
- GitHub Actions 使用 `setup-uv`；
- CI 使用 `uv sync --locked`。

### 第 6 天：部署

- 用 Docker 构建一次；
- 使用 `--frozen --no-dev`；
- 理解系统依赖不归 uv 管。

### 第 7 天：高级能力按需学习

根据真实需求选择：私有索引、workspace、构建发布。没有需求就不学、不配；日常工作流并不需要它们。

---

## 26. 你真正需要形成的心智模型

把 Conda 时代的“维护一个叫某某名字的环境”，转换为：

```text
项目声明（pyproject.toml）
        ↓ 解析并锁定
锁文件（uv.lock）
        ↓ 同步
本地环境（.venv，可随时重建）
        ↓ 执行
uv run <命令>
```

最终你日常真正高频使用的仍然只是：

```bash
uv add <包>
uv remove <包>
uv run <命令>
uv sync
uv lock --upgrade-package <包>
```

先把这五个命令用熟，再根据真实项目需要学习其他能力。这比背完所有参数更接近“精通”：知道默认路径，也知道什么时候不该增加复杂度。

---

## 27. 官方资料

- [uv 官方文档](https://docs.astral.sh/uv/)
- [安装 uv](https://docs.astral.sh/uv/getting-started/installation/)
- [项目管理](https://docs.astral.sh/uv/guides/projects/)
- [Python 版本管理](https://docs.astral.sh/uv/guides/install-python/)
- [运行脚本](https://docs.astral.sh/uv/guides/scripts/)
- [命令行工具](https://docs.astral.sh/uv/guides/tools/)
- [从 pip 迁移](https://docs.astral.sh/uv/guides/migration/pip-to-project/)
- [包索引配置](https://docs.astral.sh/uv/concepts/indexes/)
- [Docker 集成](https://docs.astral.sh/uv/guides/integration/docker/)
- [GitHub Actions 集成](https://docs.astral.sh/uv/guides/integration/github/)
- [命令参考](https://docs.astral.sh/uv/reference/cli/)
