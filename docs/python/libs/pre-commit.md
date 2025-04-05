[https://blog.csdn.net/irving512/article/details/108701017](https://blog.csdn.net/irving512/article/details/108701017)

## pre-commit

`pre-commit` 是一个 Git 钩子管理工具，它可以在 `git commit` 之前自动运行代码检查、格式化等任务，确保提交的代码符合规范，避免低级错误。它支持 `black`、`flake8`、`isort`、`mypy` 等多种工具。

---

## **1. 安装 **`pre-commit`

```shell
pip install pre-commit
```

或者添加到 `requirements.txt` 里：

```shell
echo "pre-commit" >> requirements.txt
```

---

## **2. 初始化 **`pre-commit`** 配置**

在项目根目录创建 `.pre-commit-config.yaml`，示例如下：

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0  # 指定版本
    hooks:
      - id: trailing-whitespace  # 删除行尾多余空格
      - id: end-of-file-fixer  # 确保文件以空行结尾
      - id: check-yaml  # 检查 YAML 语法
  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black  # 代码格式化
  - repo: https://github.com/pycqa/flake8
    rev: 6.1.0
    hooks:
      - id: flake8  # 代码规范检查
  - repo: https://github.com/asottile/pyupgrade
    rev: v3.15.0
    hooks:
      - id: pyupgrade  # 升级 Python 语法
        args: ["--py38-plus"]
```

这里配置了：

+ **基本代码清理**（删除多余空格、检查 YAML）
+ `black`** 代码格式化**
+ `flake8`** 代码规范检查**
+ `pyupgrade`** 让代码升级到 Python 3.8+ 语法**

---

## **3. 安装 **`pre-commit`** 钩子**

运行以下命令，将 `pre-commit` 钩子安装到 Git 仓库：

```shell
pre-commit install
```

之后，每次 `git commit` 时都会自动运行 `.pre-commit-config.yaml` 中的检查。

---

## **4. 手动运行 **`pre-commit`

如果你想在提交前手动检查代码，可以运行：

```shell
pre-commit run --all-files
```

如果有多个 hook，可以指定运行某一个：

```shell
pre-commit run black --all-files
```

---

## **5. 在 CI/CD 中使用**

在 CI/CD（比如 GitHub Actions）中，可以添加：

```yaml
- name: Run pre-commit checks
  run: |
    pip install pre-commit
    pre-commit run --all-files
```

---

## **6. 如何跳过 **`pre-commit`**？**

如果某次提交不想运行 `pre-commit`，可以使用：

```shell
git commit -m "skip checks" --no-verify
```

---

## **7. 更新 **`pre-commit`** 钩子**

如果你修改了 `.pre-commit-config.yaml`，需要运行：

```shell
pre-commit autoupdate  # 更新到最新的 hooks 版本
```

---

### **总结**

1. **安装** `pre-commit`
2. **创建** `.pre-commit-config.yaml`
3. **运行 **`pre-commit install` 绑定 Git 钩子
4. **提交代码时自动检查**，不符合规范会报错
5. **可手动运行 **`pre-commit run --all-files`
6. **可跳过检查 **`--no-verify`
7. **定期更新 **`pre-commit autoupdate`

这样，每次提交代码时都能自动检查格式，减少人工 Review 的负担，代码质量也会更高！🚀

## 文件解读

```python
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: check-executables-have-shebangs
      - id: check-toml
      - id: check-yaml
      - id: end-of-file-fixer
        types: [python]
      - id: trailing-whitespace
      - id: requirements-txt-fixer

  - repo: https://github.com/MarcoGorelli/auto-walrus
    rev: 0.3.4
    hooks:
      - id: auto-walrus

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.11.2
    hooks:
      - id: ruff
      - id: ruff-format

  - repo: https://github.com/codespell-project/codespell
    rev: v2.4.1
    hooks:
      - id: codespell
        additional_dependencies:
          - tomli

  - repo: https://github.com/tox-dev/pyproject-fmt
    rev: "v2.5.1"
    hooks:
      - id: pyproject-fmt

  - repo: https://github.com/abravalheri/validate-pyproject
    rev: v0.24.1
    hooks:
      - id: validate-pyproject

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.15.0
    hooks:
      - id: mypy
        args:
          - --explicit-package-bases
          - --ignore-missing-imports
          - --install-types # See mirrors-mypy README.md
          - --non-interactive
        additional_dependencies: [types-requests]

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: "v4.0.0-alpha.8"
    hooks:
      - id: prettier
        types_or: [toml, yaml]
```

这个 `.pre-commit-config.yaml` 文件配置了一些代码检查和格式化的 `pre-commit` 钩子，下面我们逐项解读：

---

## **1. 通用检查 (**`pre-commit-hooks`**)**

```yaml
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: check-executables-have-shebangs
      - id: check-toml
      - id: check-yaml
      - id: end-of-file-fixer
        types: [python]
      - id: trailing-whitespace
      - id: requirements-txt-fixer
```

**目的**：基本代码质量检查，确保文件格式和语法正确。

**钩子解析：**

+ `check-executables-have-shebangs`  
  - 确保可执行文件以 `#!/usr/bin/env python3` 这样的 shebang 头部开头。
+ `check-toml`  
  - 检查 `*.toml` 文件的语法是否合法（如 `pyproject.toml`）。
+ `check-yaml`  
  - 检查 `*.yaml` / `*.yml` 文件的语法是否正确。
+ `end-of-file-fixer`  
  - 确保 Python 文件以空行结尾（符合 PEP 8 规范）。
+ `trailing-whitespace`  
  - 移除代码中的多余空格，避免不必要的代码变更。
+ `requirements-txt-fixer`  
  - 规范化 `requirements.txt`，按字母顺序排序，并删除重复项。

---

## **2. **`auto-walrus`**（自动优化 Python 代码）**

```yaml
  - repo: https://github.com/MarcoGorelli/auto-walrus
    rev: 0.3.4
    hooks:
      - id: auto-walrus
```

**目的**：自动转换可以使用海象运算符 `:=`（Python 3.8+）的代码，优化可读性和性能。例如：

```python
# Before
match = re.match(r"\d+", text)
if match:
    print(match.group())
    
# After auto-walrus
if match := re.match(r"\d+", text):
    print(match.group())
```

---

## **3. **`ruff`**（静态分析 + 代码格式化）**

```yaml
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.11.2
    hooks:
      - id: ruff
      - id: ruff-format
```

**目的**：使用 `ruff` 进行 Python 代码检查（替代 `flake8` + `isort` + `pylint`），同时进行代码格式化。

**钩子解析：**

+ `ruff`  
  - 进行静态分析，检查 Python 代码是否有错误（如未使用的变量、未导入的模块）。
+ `ruff-format`  
  - 自动格式化 Python 代码（类似 `black`）。

---

## **4. **`codespell`**（拼写检查）**

```yaml
  - repo: https://github.com/codespell-project/codespell
    rev: v2.4.1
    hooks:
      - id: codespell
        additional_dependencies:
          - tomli
```

**目的**：检测代码和文档中的拼写错误，防止低级拼写错误（如 `recieve -> receive`）。

+ `additional_dependencies: [tomli]`  
  - 这里 `tomli` 用于解析 `pyproject.toml`，确保 `codespell` 能正确处理 TOML 格式。

---

## **5. **`pyproject-fmt`**（格式化 **`pyproject.toml`** 文件）**

```yaml
  - repo: https://github.com/tox-dev/pyproject-fmt
    rev: "v2.5.1"
    hooks:
      - id: pyproject-fmt
```

**目的**：自动格式化 `pyproject.toml`，确保其结构清晰、可读性强。

---

## **6. **`validate-pyproject`**（检查 **`pyproject.toml`** 配置合法性）**

```yaml
  - repo: https://github.com/abravalheri/validate-pyproject
    rev: v0.24.1
    hooks:
      - id: validate-pyproject
```

**目的**：验证 `pyproject.toml` 是否符合规范，避免配置错误导致工具无法正常工作。

---

## **7. **`mypy`**（静态类型检查）**

```yaml
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.15.0
    hooks:
      - id: mypy
        args:
          - --explicit-package-bases
          - --ignore-missing-imports
          - --install-types # See mirrors-mypy README.md
          - --non-interactive
        additional_dependencies: [types-requests]
```

**目的**：使用 `mypy` 进行 Python 代码的静态类型检查，确保类型安全。

**钩子解析：**

+ `--explicit-package-bases`  
  - 需要显式指定包的根目录，防止 `mypy` 误解析。
+ `--ignore-missing-imports`  
  - 忽略找不到类型信息的外部依赖，否则 `mypy` 可能会报错。
+ `--install-types`  
  - 自动安装缺失的类型提示包。
+ `--non-interactive`  
  - 禁止 `mypy` 运行时交互，确保 `pre-commit` 可以自动执行。
+ `additional_dependencies: [types-requests]`  
  - 安装 `requests` 库的类型提示支持，避免 `mypy` 报错。

---

## **8. **`prettier`**（格式化 **`TOML`** / **`YAML`**）**

```yaml
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: "v4.0.0-alpha.8"
    hooks:
      - id: prettier
        types_or: [toml, yaml]
```

**目的**：使用 `prettier` 自动格式化 `toml` 和 `yaml` 文件，确保配置文件格式统一。

---

## **总结**

| 钩子                              | 作用                          |
| --------------------------------- | ----------------------------- |
| `check-executables-have-shebangs` | 确保可执行文件有 `#!` 头部    |
| `check-toml` / `check-yaml`       | 确保 TOML / YAML 文件语法正确 |
| `end-of-file-fixer`               | 确保文件结尾有空行            |
| `trailing-whitespace`             | 移除多余空格                  |
| `requirements-txt-fixer`          | 规范 `requirements.txt`       |
| `auto-walrus`                     | 代码优化，使用 `:=` 语法      |
| `ruff` / `ruff-format`            | 静态分析和代码格式化          |
| `codespell`                       | 拼写检查                      |
| `pyproject-fmt`                   | `pyproject.toml` 格式化       |
| `validate-pyproject`              | `pyproject.toml` 语法检查     |
| `mypy`                            | 进行 Python 静态类型检查      |
| `prettier`                        | 格式化 `toml` 和 `yaml` 文件  |


这个 `pre-commit` 配置已经非常全面，涵盖了代码规范、格式化、静态分析、拼写检查等多个方面，可以极大提升代码质量和团队协作效率！🚀

