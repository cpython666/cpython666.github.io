---
title: "xpath简介及常用语法"
created_at: 2024-11-10 16:15:02
updated_at: 2024-11-10 17:47:33
---

# xpath简介及常用语法

最开始学数据采集的时候，网页解析经常会卡很久，原因就是xpath不熟练，经常解析不到内容

平时我在工作的时候也经常会使用到xpath，有时候会有些生疏的去问gpt或者是翻自己记的笔记，因为最开始的笔记比较乱，还是影响效率，所以我准备再整理一下，然后顺便分享出来，如果有我没有讲到的大家也可以做补充。

<h2 id="l4zxf">基础了解</h2>

XPath（XML Path Language）是一种在 XML 文档中查找节点的语言，常用于 XML 数据解析比如说网页解析。以下是一些常用的 XPath 定位方法和示例：

<h3 id="Z1AyT">示例使用</h3>

```python
html_text = '''
<title>标题</title>
'''

from lxml import html

tree = html.fromstring(html_text)
print(tree.xpath('//title/text()'))
```

<h3 id="nm4Eu">1. **基本节点定位**</h3>

+ `/` 表示从根节点开始。

+ `//` 表示从文档的任意位置查找符合条件的节点。

+ ./ 从当前节点开始寻找

  **示例：**

+ `/html/body/div`：定位到根节点下的 `div` 标签。

+ `//div`：查找文档中所有的 `div` 节点。

<h3 id="b2k0l">2. **通过标签定位**</h3>

+ `//tag_name`：定位到所有指定的标签名节点。

  **示例：**

+ `//a`：定位到文档中的所有 `a` 标签。

<h3 id="oO9EH">3. **通过属性定位**</h3>

+ `[@attribute='value']`：根据属性及其值进行定位。

  **示例：**

+ `//input[@type='text']`：定位所有 `type="text"` 的 `input` 标签。

+ `//div[@class='container']`：定位 `class="container"` 的 `div` 标签。

<h3 id="fVG1T">4. **通过文本内容定位**</h3>

+ `//tag_name[text()='content']`：查找指定标签中包含精确文本的节点。

+ `contains(text(),'部分内容')`：模糊匹配文本内容。

  **示例：**

+ `//p[text()='Hello World']`：找到所有文本为“Hello World”的 `p` 标签。

+ `//span[contains(text(),'部分内容')]`：找到包含“部分内容”字符串的 `span` 标签。

<h3 id="irHpY">5. **通过层级关系定位**</h3>

+ `/` 表示直接子节点关系。

+ `//` 表示不论层级的后代节点。

  **示例：**

+ `//div/span`：查找所有在 `div` 标签下的 `span` 标签。

+ `//ul/li/a`：查找 `ul` 标签下的 `li` 的所有 `a` 标签。

<h3 id="GjvEw">6. **位置索引**</h3>

+ `[index]`：使用索引进行精确定位，索引从 `1` 开始。

  **示例：**

+ `//div[1]`：定位第一个 `div` 标签。

+ `//ul/li[2]`：定位 `ul` 标签下的第二个 `li` 标签。

<h3 id="eVSfK">7. **通过多个条件组合定位**</h3>

+ 使用 `and` 和 `or` 组合多个条件。

  **示例：**

+ `//a[@class='link' and @href='#']`：查找 `class="link"` 且 `href="#"` 的 `a` 标签。

<h3 id="xlf3q">8. **通配符**</h3>

+ `*`：表示任意节点。

  **示例：**

+ `//div/*`：查找 `div` 标签下的所有直接子节点。

+ `//*[@id='unique']`：定位 `id="unique"` 的任意标签。

掌握这些基本的 XPath 定位语法，你可以更加高效地查找并获取目标数据。

<h2 id="Sja4X">常用语法</h2>

```python
子级：/
子级及所有后代：//

根据文本查找
含有Hello的a链接
response.xpath('//a[contains(text(), "Hello")]')
response.css('a:contains("Hello")')

根据属性查找
类名精确查找
response.xpath('//li[@class="tab__nav__item"]')
类名包含
response.xpath('//ul[contains(@class, "rlist")]/li[@class="tab__nav__item"]')

第几个
倒数第一个
//ul/li[last()]
#倒数第二个
//span/ul//li[last()-1]

以什么开始：starts-with
//iframe[starts-with(@src,"/abcd/efg/ivrflow/page/ivrFlow.jsp")]
以什么结束：ends-with
f、部分属性值匹配
//input[starts-with(@id,'fuck')]"));//匹配id以fuck开头的元素，id='fuckyou'
//input[ends-with(@id,'fuck')]"));//匹配id以fuck结尾的元素，id='youfuck'
//input[contains(@id,'fuck')]"));//匹配id中含有fuck的元素，id='youfuckyou'
    
运算符and，or，not，!=
//标签名[@元素名称='元素值' and @元素名称='元素值']
//input[@id='kw' and @class='s_ipt']
// 标签名[@元素名称='元素值' or @元素名称='元素值']
//input[@id='kw' or @class='s_t']
//标签名称[@元素名称 != '元素值']
//input[@class!='1111']

这里没有找到合适的场景，意思就是查找year内容不为2005的内容 注：“.”就等于text()
//标签名[not(.='元素值')
//year[not(.=2005)]

模糊匹配
//div[not(@id="tab-AndroidVersions")]
//标签名[contains(text(), "内容"]
//div[contains(text(), "更新")]

精准匹配
//标签名[(text()='内容')]
//div[(text()='更新文案')]

由某个td元素找到最近祖先table元素
//td[text()='表格数据文本']/ancestor::table
# 使用XPath查找包含“您好”的所有节点的父亲节点
parent_nodes = tree.xpath("//*[contains(text(), '您好')]/..")


rows = tree.xpath("//table//tr[position()>1]")

target_tr = response.xpath('//tr[td[contains(text(), "水果排名")]]')
# 获取target_tr之前的tr节点
previous_tr = target_tr.xpath('preceding-sibling::tr[1]')
# 获取target_tr之后的tr节点
next_tr = target_tr.xpath('following-sibling::tr[1]')

查找包含“您好”的所有节点的父亲节点
//*[contains(text(), '啦啦')]/..

#选择 ID 为 myDiv 的 <div> 后面的第一个 <h3> 兄弟节点。
//div[@id='myDiv']/following-sibling::h3[1]
选择 ID 为 myDiv 的 <div> 的所有后续兄弟节点。
//div[@id='myDiv']/following-sibling::*

# 提取链接
//div[@class="td-wrap"]/a/@href
# 提取名称
//div[@class="td-wrap"]/a/text()

创建节点
new_td = etree.Element("td")
new_td.set("align", "left")
new_td.text = td_text
next_tr.insert(j, new_td)
detail_rows = detail_table_lxml.xpath('.//td[@align="left"]')
print(len(detail_rows), detail_rows)
modified_html = etree.tostring(detail_table_lxml, pretty_print=True, encoding='unicode')
print(modified_html)
# 设置
root = etree.Element('root', language='中文')  # 创建节点时创建属性
root.set('hello', 'python')  # 使用set方法为root节点添加属性
# 获取属性
print(root.get('language'))  # 使用get方法获取属性
print(root['language'])
print(root.keys())
print(root.values())
print(root.items())
# 修改属性
root['language'] = 'English'
```

<h2 id="Jjhhm">更多进阶</h2>

你的XPath语法总结得非常完整了！下面是一些其他的高级用法和少见的定位技巧，或许可以帮助你进一步掌握XPath。

<h3 id="i6e7w">1. **基于轴定位**</h3>

   轴（Axis）用于从当前节点出发定位相关节点。常用轴包括：

+ `ancestor`：所有祖先节点（父节点、祖父节点等）。

+ `ancestor-or-self`：包含当前节点及所有祖先节点。

+ `descendant`：当前节点的所有后代节点（子节点、孙子节点等）。

+ `descendant-or-self`：包含当前节点及所有后代节点。

+ `preceding-sibling`：当前节点之前的兄弟节点。

+ `following-sibling`：当前节点之后的兄弟节点。

+ `child`：当前节点的直接子节点。

+ `parent`：直接父节点。

  **示例：**

+ `//span/ancestor::div`：查找包含 `span` 的所有祖先 `div` 节点。

+ `//table//tr[td[contains(text(), '关键字')]]/following-sibling::tr[1]`：找到包含“关键字”的 `tr` 节点，并选择其后第一个 `tr` 兄弟节点。

<h3 id="x9hA0">2. **位置过滤**</h3>

   你可以使用位置表达式 `position()` 进行更多的定位：

+ `//ul/li[position() mod 2 = 1]`：查找 `ul` 列表中的所有奇数位置的 `li` 节点。
+ `//ul/li[position() mod 2 = 0]`：查找 `ul` 列表中的所有偶数位置的 `li` 节点。
+ `//table//tr[position()>2 and position()<5]`：查找第3到第4个 `tr` 节点。

<h3 id="uIAvl">3. **复合条件筛选**</h3>

   使用 `and` 和 `or` 组合多个属性条件：

+ `//input[@type='text' and contains(@class, 'required')]`：选择 `type="text"` 且 `class` 中包含 `required` 的 `input` 元素。
+ `//img[@alt or @title]`：查找 `alt` 或 `title` 属性存在的 `img` 标签。

<h3 id="mxJlC">4. **选择多个元素**</h3>

   XPath支持同时选择多个标签类型：

+ `//div | //span`：选择所有的 `div` 和 `span` 标签。
+ `//ul/li[1] | //ol/li[1]`：选择所有 `ul` 和 `ol` 列表中的第一个 `li` 元素。

<h3 id="I2W8V">5. **条件逻辑和反向选择**</h3>

   使用 `not()` 逻辑函数进行反向选择：

+ `//div[not(@class='exclude')]`：查找所有 `class` 属性不是 `exclude` 的 `div` 节点。
+ `//input[not(@disabled)]`：选择未被禁用的 `input` 元素。

<h3 id="h7RmD">6. **高级祖先和兄弟节点选择**</h3>

   查找某节点的最近祖先或后续兄弟节点：

+ `//span[contains(text(), '查找')]/ancestor::div[1]`：找到包含“查找”的 `span` 节点的最近父级 `div`。
+ `//p[contains(text(), '内容')]/preceding-sibling::*[1]`：查找包含“内容”的 `p` 元素的最近上一个兄弟节点。

<h3 id="cJPAT">7. **提取属性值**</h3>

   可以直接提取属性值，例如：

+ `//a[contains(@href, 'example')]/@href`：提取 `href` 属性包含 `example` 的所有 `a` 标签的链接。
+ `//img[@src]/@src`：提取所有含 `src` 属性的 `img` 标签的链接。

<h3 id="bWz8X">8. **条件嵌套**</h3>

   当有多个条件时，可以嵌套使用 `[` `]` 表示：

+ `//ul/li[span[contains(@class, 'selected')] and @data-active='true']`：查找包含 `span` 且 `class` 中包含 `selected` 的 `li` 节点，并且 `li` 的 `data-active` 属性为 `true`。

<h3 id="PPR6y">9. **结合正则表达式（部分XPath库支持）**</h3>

   某些库（如 lxml）支持 `matches()` 函数，可以结合正则表达式使用。比如，匹配以 `abc` 开头的 `id`：

```plain
//div[matches(@id, '^abc')]
```

这些补充技巧和灵活运用能帮你在数据提取和定位时更加准确和高效。希望对你有帮助！
