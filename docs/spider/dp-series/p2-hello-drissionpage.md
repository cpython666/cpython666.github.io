---
title: "P2-Hello～DrissionPage，开端即巅峰，专栏可以结束了"
date: "2024-11-27 22:01:29.082913"
updated: "2024-11-27 22:01:29.082967"
privacy: "登录可见"
visit_count: 8
legacy_id: 30
legacy_unique_id: "30"
---

# P2-Hello～DrissionPage，开端即巅峰，专栏可以结束了

为什么标题要这样说呢，因为如果这集的内容大家可以很好地理解的话，那么80%的数据采集需求就可以很好的解决了。

对于新手来说，直接刚开始学习就修成正果了。到底这节课会讲什么内容呢，下面开始正题。

首先我们要清晰思路，爬虫也就是数据采集主要分为两类：

+ 第一种就是逆向接口用协议请求
+ 第二种就是自动化数据采集，也就是我们这个合集会主要讲的内容。

然后呢，自动化采集其实我们还可以分为两种：

+ 一种是用js动态请求返回的数据然后渲染在页面中的
+ 还有一种呢是返回的数据直接嵌入在html中的。

对于第一种我们可以直接截取接口返回的数据（刚好drissionpage就提供了这一强大的功能），对于第二种我们需要利用解析工具去页面中提取出数据。当然，对于第一种接口返回数据的情况，我们也可以不去截取数据包，直接等数据渲染到页面了再去提取数据，也就是变成了第二种情况。

下面我们分别来看看这两种情况是怎样的。

数据采集如何实现采集这两种情况呢？非常的简单。

对于第一种接口返回数据的页面，使用下面的代码。

```python
# 导入
from DrissionPage import Chromium
# 连接浏览器
browser = Chromium()
# 获取标签页对象
tab = browser.latest_tab
# 访问网页
tab.listen.start('ajax/')  # 开始监听，指定获取包含该文本的数据包
tab.get('http://localhost:8001/page/ajax/')  # 访问网址
res = tab.listen.wait()  # 等待并获取一个数据包
print(res.url)  # 打印数据包url
from pprint import pprint
pprint(res.response.body)  # 打印数据包url
```

对于第二种情况静态页面使用下面的代码。

```python
# 导入
from DrissionPage import Chromium

# 连接浏览器
browser = Chromium()
# 获取标签页对象
tab = browser.latest_tab
# 访问网页
tab.get('http://localhost:8001/page/ajax/')
html=tab.html
print(html)

from lxml import etree
tree=etree.HTML(html)
print(tree.xpath('//h5/text()'))
```

这两种情况已经可以覆盖很多场景了，比如说评论，弹幕，各种数据接口，静态页面，说80%的场景完全不夸张，如果大家能够听懂我这集在说什么的话，自动化数据采集学起来一定很轻松。
