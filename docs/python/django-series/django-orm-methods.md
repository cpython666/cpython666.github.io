---
title: "django-orm常用的方法函数【django】"
created_at: 2024-12-20 23:24:47
updated_at: 2024-12-20 23:24:47
---

# django-orm常用的方法函数【django】

Django ORM（对象关系映射）提供了许多常用的方法和函数，用于查询和操作数据库中的数据。以下是一些常见的 Django ORM 方法和函数：

### 1. **模型实例方法**

+ `save()`: 保存模型实例到数据库中。
+ `delete()`: 从数据库中删除模型实例。

### 2. **查询集方法**

+ `all()`: 返回所有记录的查询集。
+ `filter(**kwargs)`: 根据指定条件过滤记录，返回满足条件的查询集。
+ `exclude(**kwargs)`: 返回排除指定条件的查询集。
+ `get(**kwargs)`: 返回满足指定条件的单个对象。如果没有对象或有多个对象满足条件，会抛出异常。
+ `first()`: 返回查询集中的第一个对象。
+ `last()`: 返回查询集中的最后一个对象。
+ `count()`: 返回查询集中的记录数量。
+ `exists()`: 检查查询集是否有任何结果，返回布尔值。
+ `order_by(*fields)`: 对查询集进行排序，参数为字段名称，可以加`-`表示降序。
+ `distinct()`: 返回去重后的查询集。

### 3. **聚合函数**

+ `aggregate()`: 用于执行聚合操作（如求和、平均值等）。
  - 示例: `aggregate(Sum('field_name'))`
+ `annotate()`: 在查询集上添加聚合值作为额外字段。

### 4. **字段查找器（Field Lookups）**

+ `exact`: 精确匹配，如 `filter(age__exact=25)`。
+ `iexact`: 不区分大小写的精确匹配。
+ `contains`: 包含指定内容，如 `filter(name__contains='John')`。
+ `icontains`: 不区分大小写的包含。
+ `in`: 是否在给定的集合内，如 `filter(id__in=[1, 2, 3])`。
+ `gt`: 大于，如 `filter(age__gt=18)`。
+ `gte`: 大于等于。
+ `lt`: 小于。
+ `lte`: 小于等于。
+ `startswith` / `istartswith`: 以指定内容开头。
+ `endswith` / `iendswith`: 以指定内容结尾。

### 5. **关系查找**

+ `select_related()`: 使用外键或一对一关系进行查询时，减少查询数量。
+ `prefetch_related()`: 用于处理多对多关系或反向外键关系，减少查询次数。

### 6. **更新与创建**

+ `update(**kwargs)`: 批量更新查询集中的对象。
+ `create(**kwargs)`: 创建并保存新对象。
+ `bulk_create()`: 批量创建对象，减少数据库的交互次数。

### 7. **事务管理**

+ `transaction.atomic`: 用于确保一组数据库操作在一个事务中完成。
+ `transaction.commit`: 手动提交事务。
+ `transaction.rollback`: 手动回滚事务。

这些方法和函数构成了 Django ORM 的核心，能帮助开发者高效地进行数据库操作。如果你需要更详细的使用示例或具体问题的解答，可以进一步说明。
