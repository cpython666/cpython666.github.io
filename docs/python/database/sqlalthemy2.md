# SQLAlchemy 2.0 介绍

SQLAlchemy 2.0 是 Python 编程语言中的一个强大的 SQL 工具包和对象关系映射（ORM）框架。它在 SQLAlchemy 1.x 的基础上进行了重大更新，旨在提升性能、简化 API、增强类型安全性，并更好地支持现代 Python 特性。以下是对 SQLAlchemy 2.0 的详细介绍：

## 主要特性与变化

### 1. **统一的 API**
SQLAlchemy 2.0 将 Core（核心 SQL 操作）和 ORM（对象关系映射）的 API 进行了统一。开发者可以无缝地在 Core 和 ORM 之间切换，使用一致的接口执行 SQL 查询和对象操作，这大大提高了开发的灵活性和便利性。

### 2. **异步支持**
SQLAlchemy 2.0 引入了对异步编程的原生支持。通过使用 Python 的 `async` 和 `await` 关键字，开发者可以编写异步数据库操作代码。这对于构建高并发、高性能的 Web 应用程序尤为重要。

### 3. **类型注解**
SQLAlchemy 2.0 充分利用了 Python 的类型注解功能（Type Hints），提供了更强的类型安全性。这不仅能帮助开发者在编写代码时减少错误，还能提升代码的可读性和可维护性，尤其是在大型项目中。

### 4. **新的查询 API**
SQLAlchemy 2.0 推出了全新的“Select”查询 API，取代了旧版的“Query”API。新 API 设计更直观、更灵活，支持更复杂的查询操作，同时优化了查询性能。

### 5. **性能优化**
SQLAlchemy 2.0 在性能方面进行了大幅改进，包括：
- 更快的 ORM 对象加载速度；
- 更高效的 SQL 语句生成和执行；
- 整体资源占用更低。

### 6. **增强的 ORM 支持**
SQLAlchemy 2.0 改进了 ORM 的功能，包括：
- 更优化的关系加载策略（如 lazy loading、eager loading 等）；
- 增强的对象继承支持；
- 更灵活的映射配置方式。

### 7. **简化配置**
SQLAlchemy 2.0 减少了配置过程中的样板代码，简化了初始化和使用流程。开发者可以更快速地搭建和使用数据库连接，提升开发效率。

### 8. **向后兼容性**
尽管 SQLAlchemy 2.0 带来了许多新特性和变化，但它仍然保持了对 1.x 版本的向后兼容性。开发者可以逐步将现有项目迁移到 2.0，而无需完全重写代码。

## 总结
SQLAlchemy 2.0 是一个功能强大且现代化的数据库工具包，它通过统一的 API、异步支持、类型安全性和性能优化，为 Python 开发者提供了高效、灵活的数据库操作方式。无论是构建小型应用还是大型企业系统，SQLAlchemy 2.0 都能满足现代开发需求，是 Python 生态中不可或缺的工具之一。
# 增删改查
以下是使用 SQLAlchemy 2.0 进行增删改查（CRUD）操作的示例代码。这些示例假设你已经安装了 SQLAlchemy 2.0，并有一个数据库（例如 SQLite）可供使用。

---

### 1. 创建数据库引擎和会话

首先，我们需要创建一个数据库引擎和会话。会话是执行 CRUD 操作的主要接口。

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 创建数据库引擎（以 SQLite 为例）
engine = create_engine('sqlite:///example.db', echo=True)

# 创建会话工厂
Session = sessionmaker(bind=engine)

# 创建会话实例
session = Session()
```

- **`echo=True`**：开启日志输出，便于调试。
- **`Session`**：会话工厂，用于生成会话实例。

---

### 2. 定义模型

在 SQLAlchemy 中，数据库表通过模型类定义。以下是一个简单的 `User` 模型示例：

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'  # 表名
    id = Column(Integer, primary_key=True)  # 主键
    name = Column(String)  # 姓名列
    age = Column(Integer)  # 年龄列
```

- **`declarative_base()`**：创建基类，用于定义模型。
- **`__tablename__`**：指定数据库中的表名。
- **`Column`**：定义表的列及其数据类型。

---

### 3. 创建表

在执行 CRUD 操作之前，需要创建数据库表：

```python
Base.metadata.create_all(engine)
```

这会根据定义的模型在数据库中创建对应的表。

---

### 4. 增（Create）

向数据库中插入新记录：

```python
# 创建一个新用户
new_user = User(name='Alice', age=30)

# 将新用户添加到会话
session.add(new_user)

# 提交会话以保存到数据库
session.commit()
```

- **`session.add()`**：将新记录添加到会话。
- **`session.commit()`**：提交会话，将更改保存到数据库。

---

### 5. 查（Read）

从数据库中查询记录：

```python
# 查询所有用户
users = session.query(User).all()
for user in users:
    print(user.id, user.name, user.age)

# 查询特定用户（例如，ID 为 1 的用户）
user = session.query(User).filter_by(id=1).first()
if user:
    print(user.name, user.age)
```

- **`session.query()`**：创建查询对象。
- **`.all()`**：返回所有结果的列表。
- **`.filter_by()`**：按条件过滤。
- **`.first()`**：返回第一个匹配的结果。

---

### 6. 改（Update）

更新数据库中的记录：

```python
# 查询要更新的用户
user_to_update = session.query(User).filter_by(id=1).first()

if user_to_update:
    # 更新用户的年龄
    user_to_update.age = 31
    # 提交会话以保存更改
    session.commit()
```

- 修改对象属性后，使用 `session.commit()` 提交更改。

---

### 7. 删（Delete）

从数据库中删除记录：

```python
# 查询要删除的用户
user_to_delete = session.query(User).filter_by(id=1).first()

if user_to_delete:
    # 从会话中删除用户
    session.delete(user_to_delete)
    # 提交会话以保存更改
    session.commit()
```

- **`session.delete()`**：从会话中移除记录。
- **`session.commit()`**：提交删除操作。

---

### 完整示例代码

以下是将上述步骤整合的完整代码：

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# 创建数据库引擎
engine = create_engine('sqlite:///example.db', echo=True)

# 创建会话工厂
Session = sessionmaker(bind=engine)

# 创建会话实例
session = Session()

# 定义模型
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)

# 创建表
Base.metadata.create_all(engine)

# 增（Create）
new_user = User(name='Alice', age=30)
session.add(new_user)
session.commit()

# 查（Read）
users = session.query(User).all()
for user in users:
    print(user.id, user.name, user.age)

# 改（Update）
user_to_update = session.query(User).filter_by(id=1).first()
if user_to_update:
    user_to_update.age = 31
    session.commit()

# 删（Delete）
user_to_delete = session.query(User).filter_by(id=1).first()
if user_to_delete:
    session.delete(user_to_delete)
    session.commit()
```

---

### 说明

- **引擎和会话**：引擎负责连接数据库，会话用于执行 CRUD 操作。
- **模型**：通过类定义数据库表结构。
- **增（Create）**：创建实例并提交。
- **查（Read）**：支持多种查询方式。
- **改（Update）**：修改属性后提交。
- **删（Delete）**：删除记录后提交。

这些示例展示了 SQLAlchemy 2.0 的基本 CRUD 操作，你可以根据需求扩展功能，例如添加复杂查询或处理表关系。