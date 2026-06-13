---
title: "P2-第一个scrapy项目【scrapy教程】"
created_at: 2025-02-20 23:00:23
updated_at: 2025-02-20 23:00:23
---

# P2-第一个scrapy项目【scrapy教程】

+ 安装scrapy
+ 创建scrapy项目
+ 修改基本配置
+ 创建一个爬虫
+ 发送一个请求

```python
pip install scrapy
# Linux/macOS
which scrapy
# windows
where scrapy
# scrapy包安装位置
pip show scrapy
scrapy startproject demo

scrapy genspider hello_scrapy http://localhost:8001/
```
