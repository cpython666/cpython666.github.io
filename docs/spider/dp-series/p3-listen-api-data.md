---
title: "P3-DrissionPage批量监听采集接口数据"
date: "2024-11-28 21:40:43.094588"
updated: "2024-11-28 21:40:43.094622"
privacy: "登录可见"
visit_count: 5
legacy_id: 31
legacy_unique_id: "31"
---

# P3-DrissionPage批量监听采集接口数据

在上一集视频中我们认识了什么是静态页面与动态页面，并且分别演示了如何通过DrissionPage去实现直接监听截取接口响应或者是去页面提取数据。

然后下来之后用兄弟在粉丝群问如何实现批量的采集，比如说有些页面需要点击下一页，或者是滚动到页面底部加载更多数据，或者是点击查看评论之后显示更多评论，其实这样的需求在DrissionPage的官网都有给出，我们来看下官网的例子。

[https://drissionpage.cn/browser_control/listener](https://drissionpage.cn/browser_control/listener)

然后我们再来看一个自己的例子。

```python
# 导入
from DrissionPage import Chromium
# 连接浏览器
browser = Chromium()
# 获取标签页对象
tab = browser.latest_tab
# 访问网页
tab.listen.start('api/pagination1/')  # 开始监听，指定获取包含该文本的数据包
tab.get('http://localhost:8001/page/pagination-1/')  # 访问网址
for _ in range(5):
    res = tab.listen.wait()
    print(res.url,res.response.body)
    tab('下一页').click()
```
