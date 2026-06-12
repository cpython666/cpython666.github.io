---
title: "P6-快速、精准、优雅提取网页大部分表格数据-DrissionPage自动化数据采集"
date: "2024-12-03 23:26:22.691351"
updated: "2024-12-03 23:42:05.061475"
privacy: "登录可见"
visit_count: 26
legacy_id: 36
legacy_unique_id: "36"
---

# P6-快速、精准、优雅提取网页大部分表格数据-DrissionPage自动化数据采集

在数据采集的过程中我们经常会遇到表格数据的场景。应对方法也比较简单，从最无脑的写xpath提取拼接数据列表，到直接获取接口数据再使用pandas转为excel。

+ 直接返回没有加密的json数据：自动化监听/直接请求接口+pandas转换为excel
+ 返回全部页面html，静态页面提取
+ 接口返回部分html/加密后的数据，数据插入页面之后（监听到接口等零点几秒），静态页面提取

归一化：成第三种情况  
下面代码比逆向好的地方在于，直接复制粘贴，换个网站只需要改几个参数即可无缝运行。

```python
import io

from DrissionPage import Chromium
import pandas as pd
from time import sleep

tab = Chromium().latest_tab
# 开始监听，指定获取包含该文本的数据包
tab.listen.start('pagination_table')
# 访问网址
tab.get('http://localhost:8001/page/pagination-table/')
all_tables = []
i = 0
for packet in tab.listen.steps():
    print(packet.url)  # 打印数据包url
    sleep(0.3)
    table_html = tab('x://table').html
    # 使用 io.StringIO 将 HTML 字符串包装成一个类文件对象
    table_io = io.StringIO(table_html)
    table = pd.read_html(table_io)[0]
    print(table)
    # # 将每一页的表格添加到 all_tables 列表中
    all_tables.append(table)
    tab('下一页').click()  # 点击下一页
    i += 1
    if i == 5:
        break
# 将所有抓取到的表格拼接成一个 DataFrame
final_table = pd.concat(all_tables, ignore_index=True)

# 打印最终拼接的表格
print(final_table)
```
