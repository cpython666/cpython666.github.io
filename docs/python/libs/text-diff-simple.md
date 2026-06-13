---
title: "文本差异对比如此简单！"
created_at: 2025-01-21 22:58:26
updated_at: 2025-01-21 22:58:26
---

# 文本差异对比如此简单！

如何比较出两段文本的不同。一句话我们或许可以使用肉眼快速地看出来。但是如果有数以万计的几千行文本。再依靠人工去寻找差异和变化就不是明智的选择。

这一集我们就来看下如何使用Python来快速找出两段文本的变化和差异。

非常的简单，使用的是我们的difflib模块。

下面的代码会比较两段文本并且输出为html。可以借此实现一个网页服务。

```python
import difflib

text1 = '''1. Beautiful is better than ugly.
2. Explicit is better than implicit.
3. Simple is better than complex.
4. Complex is better than complicated.
'''.splitlines(keepends=True)

text2 = '''1. Beautiful is better than ugly.
3. Simple is better than complex.
4. Complicated is better than complex.
5. Flat is better than nested.
'''.splitlines(keepends=True)

html_diff = difflib.HtmlDiff()
html_output = html_diff.make_file(text1, text2)

with open('diff_output.html', 'w') as f:
    f.write(html_output)
```

但是这样的话对于我们观察确实是直观了。但是如要精细化控制变化的字符片段，定制化显示效果的话，上面的方法就不再好用，我们可以用下面的方法。它可以实现什么样的效果呢？就是将一大段文本变化的删除的不变的分割成一片一片的。当然传如参数也可以是一个字符串列表。

```python
import difflib

before = "\nThe quick brown fox jumped over the lazy dog"
after = "The fast brown fox jumped quickly over the lazy dog"

# before = ["The quick brown fox", "jumped over", "the lazy dog"]
# after = ["The fast brown fox", "jumps over", "the lazy dog"]

cruncher = difflib.SequenceMatcher(a=before, b=after, isjunk=lambda x: x in " \t\n")
for tag, alo, ahi, blo, bhi in cruncher.get_opcodes():
    print(tag, alo, ahi, blo, bhi)
```

## isjunk参数解读

文档：[https://docs.python.org/zh-cn/3.13/library/difflib.html](https://docs.python.org/zh-cn/3.13/library/difflib.html)

> 为什么isjunk传入了\n依旧会检测\n的变化

在 `difflib.SequenceMatcher` 中，`isjunk` 参数的作用是标记哪些字符可以被视为“无关紧要的垃圾字符”，以便在匹配过程中可以被跳过。但是，这并不意味着这些字符会被完全忽略或从输入中移除，而是 SequenceMatcher 在比较时可能会优先跳过它们，以更好地识别有意义的差异。

### 解释为什么 `\n` 仍然被检测到：

1. **字符仍然存在于字符串中：**  
   `isjunk` 函数只是提示 SequenceMatcher 可以跳过这些字符的匹配，而不是直接从输入中删除它们。因此，`\n` 虽然被标记为“垃圾”，但在比较时依然会被记录。
2. **匹配算法的行为：**  
   当 `isjunk` 指定某个字符（如 `\n`），SequenceMatcher 仅会在计算“长公共子序列”时尽可能避开这些字符，但它依旧会出现在最终的比较结果中。如果字符串的结构发生变化，比如 `\n` 的位置不同，它仍然会被记录为差异。
3. **“垃圾”字符的主要作用：**  
   其主要用途是帮助提高匹配的性能，减少对这些字符的关注，但 SequenceMatcher 仍然会在输出中精确地报告字符串的不同部分。

### 你的示例解析：

```python
before = "\nThe quick brown fox jumped over the lazy dog"
after = "The fast brown fox jumped quickly over the lazy dog"

cruncher = difflib.SequenceMatcher(a=before, b=after, isjunk=lambda x: x in " \t\n")
for tag, alo, ahi, blo, bhi in cruncher.get_opcodes():
    print(tag, alo, ahi, blo, bhi)
```

可能的输出：

```plain
replace 1 10 0 9
equal 10 19 9 18
replace 19 19 18 26
equal 19 43 26 50
```

尽管 `\n` 被标记为垃圾字符，它仍然在 `replace` 操作中被报告。SequenceMatcher 仍然会将其视为“文本内容”的一部分，而不是直接忽略它。

### 如何真正忽略 `\n`：

如果你希望完全忽略 `\n`，可以在传入 `difflib.SequenceMatcher` 之前手动去除它，例如：

```python
before = before.replace("\n", "")
after = after.replace("\n", "")
```

这样 `\n` 就不会在比较中出现，而不仅仅是被标记为垃圾字符。

---

**总结：**  
`isjunk` 不会移除字符，而是告诉算法尽量在匹配过程中忽略它们，但它们仍然会在最终的差异输出中被考虑。如果需要完全忽略某些字符，应在输入阶段手动处理。
