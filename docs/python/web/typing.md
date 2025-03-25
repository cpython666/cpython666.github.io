[![](/imgs/ads/lky.png)](https://www.lcayun.com/aff/DECEDOZS)


Python 的 `typing` 模块是在 Python 3.5 中引入的，主要用于支持类型注解（Type Hints），帮助开发者在代码中声明变量、函数参数和返回值的类型。虽然 Python 是一门动态类型语言，类型注解并不会在运行时强制检查类型，但它可以显著提升代码的可读性、可维护性，并与静态类型检查工具（如 `mypy`）配合使用，发现潜在的类型错误。

以下是对 `typing` 模块的详细介绍：

---

### 1. **基本作用**
`typing` 模块提供了一系列工具，用于在代码中添加类型提示。这些提示可以在开发过程中帮助 IDE（比如 PyCharm、VS Code）提供更好的代码补全、错误检测，同时也方便团队协作时明确接口的预期类型。

例如：

```python
def add(a: int, b: int) -> int:
    return a + b
```

+ `a: int` 和 `b: int` 表示参数 `a` 和 `b` 应该是整数。
+ `-> int` 表示函数返回值的类型是整数。

---

### 2. **常用类型**
`typing` 模块提供了一些内置类型的别名和工具，以下是常见的类型和用法：

#### 基本类型
直接使用 Python 的内置类型（如 `int`, `str`, `float`, `bool`, `list` 等）即可：

```python
name: str = "Alice"
age: int = 25
```

#### 容器类型
`typing` 提供了泛型支持，用于指定容器内的元素类型：

+ `List`: 列表
+ `Dict`: 字典
+ `Set`: 集合
+ `Tuple`: 元组

示例：

```python
from typing import List, Dict, Set, Tuple

numbers: List[int] = [1, 2, 3]
scores: Dict[str, float] = {"Alice": 95.5, "Bob": 88.0}
unique: Set[int] = {1, 2, 3}
pair: Tuple[str, int] = ("Alice", 25)
```

#### 可选类型和联合类型
+ `Optional`: 表示一个值可以是某种类型或 `None`。
+ `Union`: 表示一个值可以是多种类型之一。

示例：

```python
from typing import Optional, Union

def get_name(id: int) -> Optional[str]:
    return "Alice" if id > 0 else None

def process(value: Union[int, str]) -> str:
    return str(value)
```

> **注意**：从 Python 3.10 开始，可以直接用 `|` 替代 `Union`，比如 `int | str`。
>

#### Any 类型
+ `Any`: 表示任意类型，适用于无法确定具体类型的情况。

```python
from typing import Any

data: Any = 42  # 可以是任何值
```

#### Callable
+ `Callable`: 用于函数或可调用对象的类型注解。

```python
from typing import Callable

def apply(func: Callable[[int], str], x: int) -> str:
    return func(x)
```

---

### 3. **高级用法**
#### 类型别名（Type Alias）
可以用 `typing` 创建自定义类型名称，提升代码可读性：

```python
from typing import List

Vector = List[float]

def scale(scalar: float, vector: Vector) -> Vector:
    return [scalar * x for x in vector]
```

#### NewType
+ `NewType`: 创建一个“新类型”，用于区分相同基础类型的不同含义。

```python
from typing import NewType

UserId = NewType("UserId", int)
OrderId = NewType("OrderId", int)

def get_user(id: UserId) -> str:
    return f"User {id}"

user_id = UserId(123)
order_id = OrderId(456)
# get_user(order_id)  # mypy 会报错，因为类型不匹配
```

#### Generic（泛型）
支持定义泛型类或函数：

```python
from typing import TypeVar, Generic

T = TypeVar("T")  # 类型变量

class Box(Generic[T]):
    def __init__(self, item: T):
        self.item = item

    def get(self) -> T:
        return self.item

int_box: Box[int] = Box(42)
str_box: Box[str] = Box("hello")
```

---

### 4. **Python 版本演进**
+ **Python 3.5**: 引入 `typing` 模块。
+ **Python 3.9**: 支持直接用内置类型（如 `list[int]`）替代 `List[int]`。
+ **Python 3.10**: 引入 `|` 操作符替代 `Union`，如 `int | str`。
+ **Python 3.11+**: 进一步改进类型系统，支持更多高级特性。

示例（Python 3.9+）：

```python
# 旧写法
from typing import List
def func(items: List[int]) -> None:
    pass

# 新写法
def func(items: list[int]) -> None:
    pass
```

---

### 5. **与工具结合**
`typing` 模块通常与静态类型检查工具（如 `mypy`）一起使用。例如：

```bash
pip install mypy
mypy your_script.py
```

如果类型注解与实际代码不符，`mypy` 会报错，帮助开发者尽早发现问题。

---

### 6. **实际应用场景**
+ **大型项目**: 类型注解使代码更易于理解和维护。
+ **API 设计**: 明确函数的输入输出类型。
+ **团队协作**: 减少因类型假设错误导致的 bug。

---

总结来说，`typing` 模块是 Python 现代化过程中的重要一环，它让动态类型的 Python 也能享受到静态类型的一些好处，同时保持了语言的灵活性。

