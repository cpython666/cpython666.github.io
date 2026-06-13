---
title: "常用命令总敲错？记不住？让你的命令短起来！-invoke【python三方库】"
created_at: 2025-03-06 20:37:43
updated_at: 2025-03-06 20:44:15
---

# 常用命令总敲错？记不住？让你的命令短起来！-invoke【python三方库】

## 前言

常用命令总敲错？记不住？噼里啪啦一顿敲最后发现前面字母敲错了，骂骂咧咧删掉重新敲，或者是敲着敲着发现单词拼写忘记了。不知道大家有没有遇到过这种烦恼，反正我就是经常遇到上面的烦恼，命令的单词经常拼不出来或者懒得拼或者忘记命令怎么用了，再去翻之前笔记。所以今天就去找了下相关的解决方案，目的是让你的命令短起来，不用像之前一样敲出完整的命令，当然就是有个前提是python项目，不过也会提到linux的方法，别的语言也可以借鉴下比如说制作个工具。

命名docker compose up -d一行命令就可以运行一个系统了，但是有时候还是很懒，当然只是打个比方。

## 缩短命令的办法

> 有了上面的需求和场景，我就带着问题去问万能的ai了。

我来分享几种减少重复输入命令的好方法，这些方法可以显著提高你的开发效率：

1. 使用 shell 别名 (Alias)  
   在 ~/.bashrc 或 ~/.zshrc 中添加别名：

```bash
# Docker 相关
alias dcu="docker compose up -d"
alias dcd="docker compose down"
alias dcr="docker compose restart"
alias dcl="docker compose logs"

# Django 相关
alias pm="python manage.py"
alias pmm="python manage.py migrate"
alias pmk="python manage.py makemigrations"
alias prs="python manage.py runserver"
```

使用方法：

+ 编辑完成后运行 `source ~/.bashrc` 或重启终端
+ 然后直接输入 `dcu` 就相当于 `docker compose up -d`

2. 创建 Makefile  
   在项目根目录创建 Makefile：

```makefile
# Docker 命令
up:
    docker compose up -d
down:
    docker compose down
restart:
    docker compose restart
logs:
    docker compose logs -f

# Django 命令
migrate:
    python manage.py migrate
makemigrations:
    python manage.py makemigrations
run:
    python manage.py runserver
shell:
    python manage.py shell
```

使用方法：

+ `make up` 启动服务
+ `make migrate` 执行迁移
+ 可以用 tab 键自动补全

3. 使用 shell 脚本  
   创建 scripts 目录，在里面添加脚本文件，例如 run.sh：

```bash
#!/bin/bash

case $1 in
    "up")
        docker compose up -d
        ;;
    "down")
        docker compose down
        ;;
    "migrate")
        python manage.py migrate
        ;;
    "make")
        python manage.py makemigrations
        ;;
    "run")
        python manage.py runserver
        ;;
    *)
        echo "Usage: $0 {up|down|migrate|make|run}"
        ;;
esac
```

使用方法：

+ `chmod +x scripts/run.sh` 赋予执行权限
+ `./scripts/run.sh up` 启动服务
+ 可以添加 alias：`alias run='./scripts/run.sh'`

4. 使用 task runner 工具  
   推荐使用 Python 的 `invoke`：

+ 安装：`pip install invoke`
+ 创建 tasks.py：

```python
from invoke import task

@task
def up(c):
    c.run("docker compose up -d")

@task
def down(c):
    c.run("docker compose down")

@task
def migrate(c):
    c.run("python manage.py migrate")

@task
def makemigrations(c):
    c.run("python manage.py makemigrations")

@task
def run(c):
    c.run("python manage.py runserver")
```

使用方法：

+ `inv up` 启动服务
+ `inv migrate` 执行迁移
+ 支持自动补全

5. IDE/终端快捷键

+ VS Code: 设置自定义任务/快捷键
+ PyCharm: 配置 Run/Debug Configurations
+ 终端历史：使用 Ctrl+R 搜索历史命令

我的推荐：

1. 短期使用：shell 别名
   - 优点：简单快速，全局可用
   - 缺点：不方便分享给团队
2. 项目级别：Makefile 或 invoke
   - 优点：可以 git 提交，团队共享
   - 缺点：需要学习基本语法
3. 完整解决方案：结合使用
   - 项目用 Makefile/invoke 定义具体任务
   - 个人用 alias 设置常用快捷方式

额外建议：

+ 把这些配置文件加入 git
+ 为不同项目创建不同前缀的别名，避免冲突
+ 定期备份你的配置
+ 可以使用 `history | grep docker` 查看常用命令作为参考

选择哪种方式取决于你的使用场景和团队协作需求。你可以先从简单的 alias 开始，觉得需要更系统化时再升级到 Makefile 或 invoke。

## invoke介绍

在 Python 中，`invoke` 通常指的是一个名为 `Invoke` 的第三方库，它是一个用于任务管理和命令行工具的 Python 库。它的主要功能是帮助开发者定义和运行任务（类似于 `Makefile` 或 `npm scripts`），特别适合用于自动化脚本、构建流程或项目管理工作。以下是对 `invoke` 的简单介绍：

### 什么是 `invoke`？

`Invoke` 是一个轻量级的 Python 库，由 PyInvoke 团队开发。它允许你通过 Python 代码定义任务（tasks），然后通过命令行调用这些任务。它是 `Fabric`（一个用于远程部署和系统管理的工具）的核心组件之一，但也可以独立使用。

### 安装

你可以通过 `pip` 安装 `invoke`：

```bash
pip install invoke
```

### 基本用法

1. **定义任务**  
   在项目根目录下创建一个名为 `tasks.py` 的文件，然后用 Python 编写任务。例如：

```python
from invoke import task

@task
def hello(ctx):
    print("Hello, world!")

@task
def build(ctx):
    ctx.run("echo Building the project...")
    ctx.run("python -m build")
```

这里：

    - `@task` 是一个装饰器，用于将函数标记为一个可执行的任务。
    - `ctx` 是上下文对象，提供了运行 shell 命令等功能。

2. **运行任务**  
   在命令行中，使用 `invoke` 或简写 `inv` 调用任务：

```bash
inv hello
```

输出：

```plain
Hello, world!
```

或者：

```bash
inv build
```

输出：

```plain
Building the project...
# 运行 python -m build 的结果
```

3. **列出所有任务**  
   如果想查看当前可用的任务，可以运行：

```bash
inv --list
```

输出类似：

```plain
Available tasks:

    build    Build the project
    hello    Say hello
```

### 特性

+ **命令执行**：通过 `ctx.run()` 可以执行 shell 命令，支持参数传递和错误处理。
+ **任务依赖**：可以定义任务之间的依赖关系，例如某个任务在运行前需要先执行另一个任务。

```python
@task
def clean(ctx):
    ctx.run("rm -rf build/")

@task(pre=[clean])
def build(ctx):
    ctx.run("echo Building after cleaning...")
```

+ **参数化**：任务支持命令行参数。

```python
@task
def greet(ctx, name="World"):
    print(f"Hello, {name}!")
```

调用：

```bash
inv greet --name Alice
# 输出: Hello, Alice!
```

### 典型应用场景

+ **项目构建**：自动化编译、打包、测试等流程。
+ **开发工具**：快速运行格式化代码、检查语法等任务。
+ **部署脚本**：结合 `Fabric` 实现远程服务器操作。

### 与其他工具的对比

+ **相比 **`Make`：`invoke` 使用 Python 编写任务，语法更灵活，且跨平台支持更好。
+ **相比 **`Click`** 或 **`Argparse`：`invoke` 更专注于任务管理，而非复杂的 CLI 应用程序。

### 更多信息

如果你需要更深入了解，可以访问官方文档：  
[http://www.pyinvoke.org/](http://www.pyinvoke.org/)

如果你指的是其他与 “invoke” 相关的 Python 功能（比如某个库中的 `invoke` 方法），请提供更多上下文，我会进一步调整回答！

## 文件名不叫tasks可以吗

在使用 Python 的 `invoke` 库时，默认情况下，`invoke` 会查找当前目录下的 `tasks.py` 文件作为任务定义的入口文件。但这并不是强制要求，你完全可以自定义文件名，只需要在运行时通过 `--collection`（或简写 `-c`）选项显式指定任务文件即可。

### 如何使用非 `tasks.py` 的文件名

假设你将任务定义在一个名为 `mytasks.py` 的文件中，比如：

```python
# mytasks.py
from invoke import task

@task
def hello(ctx):
    print("Hello from mytasks!")
```

运行时，你需要告诉 `invoke` 使用这个文件：

```bash
inv -c mytasks hello
```

+ `-c mytasks` 指定了任务集合（collection）的名称，这里是 `mytasks`，对应 `mytasks.py` 文件。
+ 输出将是：

```plain
Hello from mytasks!
```

### 注意事项

1. **文件命名**：
   - 文件名必须是有效的 Python 模块名（例如，不能以数字开头，不能包含特殊字符）。
   - 去掉 `.py` 后缀的部分就是你在 `-c` 中使用的名称。
2. **默认行为**：
   - 如果你不指定 `-c`，`invoke` 默认只加载 `tasks.py`。如果当前目录没有 `tasks.py`，它会报错：

```plain
No idea where to look for tasks! No --collection specified and no 'tasks.py' found.
```

3. **多个任务文件**：
   - 如果你有多个任务文件（比如 `build_tasks.py` 和 `deploy_tasks.py`），可以通过 `-c` 分别调用：

```bash
inv -c build_tasks some_task
inv -c deploy_tasks another_task
```

    - 或者将它们组织成一个命名空间（namespace），但这需要更复杂的配置。

4. **列出任务**：  
   使用自定义文件名时，查看任务列表仍然有效：

```bash
inv -c mytasks --list
```

### 总结

文件名不叫 `tasks.py` 是完全可以的，只要通过 `-c` 选项指定即可。这种灵活性让 `invoke` 非常适合不同项目结构或多人协作的场景。如果你希望避免每次都输入 `-c`，也可以通过配置文件（比如 `.invoke.yaml`）设置默认的集合名称，或者干脆遵循默认约定使用 `tasks.py`。

有其他问题吗？



## invoke教程-博客园

[https://www.cnblogs.com/pythonista/p/12266109.html](https://www.cnblogs.com/pythonista/p/12266109.html)

## <font style="color:rgb(51, 51, 51);">如何用好 invoke？</font>

<font style="color:rgb(51, 51, 51);">介绍完 invoke 的简单用法，我们知道了它所需的几项要素，也大致知道了它的使用步骤，接下来是它的其它用法。</font>

### <font style="color:rgb(51, 51, 51);">添加帮助信息</font>

<font style="color:rgb(51, 51, 51);">在上例中，“inv -l”只能看到任务名称，缺少必要的辅助信息，为了加强可读性，我们可以这样写：</font>

```python
@task(help={'name': 'A param for test'})
def greet(c, name):
    """
    A test for shell command.
    Second line.
    """
    c.run(f"echo {name}加油!")
```

<font style="color:rgb(51, 51, 51);">其中，文档字符串的第一行内容会作为摘录，在“inv -l”的查询结果中展示，而且完整的内容与 @task 的 help 内容，会对应在“inv --help”中展示：</font>

```python
>>> inv -l
Available tasks:

  greet   A test for shell command.
>>> inv --help greet
Usage: inv[oke] [--core-opts] greet [--options] [other tasks here ...]

Docstring:
  A test for shell command.
  Second line.

Options:
  -n STRING, --name=STRING   A param for test
```

### <font style="color:rgb(51, 51, 51);">任务的分解与组合</font>

<font style="color:rgb(51, 51, 51);">通常一个大任务可以被分解成一组小任务，反过来，一系列的小任务也可能被串连成一个大任务。在对任务作分解、抽象与组合时，这里有两种思路：</font>

+ <font style="color:rgb(51, 51, 51);">对内分解，对外统一：只定义一个 @task 的任务，作为总体的任务入口，实际的处理逻辑可以抽象成多个方法，但是外部不感知到它们</font>
+ <font style="color:rgb(51, 51, 51);">多点呈现，单点汇总：定义多个 @task 的任务，外部可以感知并分别调用它们，同时将有关联的任务组合起来，调用某个任务时，也执行其它相关联的任务</font>

<font style="color:rgb(51, 51, 51);">第一种思路很容易理解，实现与使用都很简单，但是其缺点是缺少灵活性，难于单独执行其中的某个/些子任务。适用于相对独立的单个任务，通常也不需要 invoke 就能做到（使用 invoke 的好处是，拥有命令行的支持）。</font>

<font style="color:rgb(51, 51, 51);">第二种思路更加灵活，既方便单一任务的执行，也方便多任务的组合执行。实际上，这种场景才是 invoke 发挥最大价值的场景。</font>

<font style="color:rgb(51, 51, 51);">那么，invoke 如何实现分步任务的组合呢？可以在 @task 装饰器的“pre”与“post”参数中指定，分别表示前置任务与后置任务：</font>

```python
@task
def clean(c):
    c.run("echo clean")

@task
def message(c):
    c.run("echo message")

@task(pre=[clean], post=[message])
def build(c):
    c.run("echo build")
```

<font style="color:rgb(51, 51, 51);">clean 与 message 任务作为子任务，可以单独调用，也可以作为 build 任务的前置与后置任务而组合使用：</font>

```python
>>> inv clean
clean
>>> inv message
message
>>> inv build
clean
build
message
```

<font style="color:rgb(51, 51, 51);">这两个参数是列表类型，即可设置多个任务。另外，在默认情况下，@task 装饰器的位置参数会被视为前置任务，接着上述代码，我们写一个：</font>

```python
@task(clean, message)
def test(c):
    c.run("echo test")
```

<font style="color:rgb(51, 51, 51);">然后执行，会发现两个参数都被视为了前置任务：</font>

```python
>>> inv test
clean
message
test
```
