---
title: "P11-QTabweight与Qstackweight的区别"
created_at: 2024-12-20 21:37:04
updated_at: 2024-12-20 21:37:04
---

# P11-QTabweight与Qstackweight的区别

在 PyQt 中，`QTabWidget` 和 `QStackedWidget` 是用于处理多页面（或多视图）的两个不同的部件。它们有一些区别，主要在于它们的设计和用途。

### QTabWidget:
1. **标签页式布局：** `QTabWidget` 提供了一个标签页式的用户界面，允许用户通过选项卡（标签页）来切换不同的页面。
2. **导航和可见性：** 用户可以通过点击选项卡切换页面。每个选项卡上通常有一个相关的标题，并且用户可以通过点击标题来选择相应的页面。
3. **集成标签栏：** `QTabWidget` 自动提供了一个标签栏，用于容纳选项卡。标签栏通常位于部件的顶部。
4. **适用于多个页面场景：** 当您有一组相关的页面，希望以标签页的形式进行切换时，`QTabWidget` 是一个很好的选择。

```python
from PyQt6.QtWidgets import QApplication, QWidget, QTabWidget, QVBoxLayout, QLabel

app = QApplication([])

# 创建 QTabWidget
tab_widget = QTabWidget()

# 添加标签页
tab_page1 = QWidget()
label1 = QLabel('这是标签页 1')
tab_page1.layout = QVBoxLayout(tab_page1)
tab_page1.layout.addWidget(label1)
tab_page1.setLayout(tab_page1.layout)
tab_widget.addTab(tab_page1, '标签页 1')

tab_page2 = QWidget()
label2 = QLabel('这是标签页 2')
tab_page2.layout = QVBoxLayout(tab_page2)
tab_page2.layout.addWidget(label2)
tab_page2.setLayout(tab_page2.layout)
tab_widget.addTab(tab_page2, '标签页 2')

tab_widget.show()
app.exec()
```

### QStackedWidget:
1. **堆栈式布局：** `QStackedWidget` 提供了一个堆栈式的用户界面，允许用户通过推入和弹出页面来切换。
2. **程序控制切换：** 切换页面通常是由程序控制的，而不是用户通过点击标签页来触发的。
3. **没有集成标签栏：** `QStackedWidget` 不提供内置的标签栏。相反，您需要使用其他部件（例如按钮、菜单）来触发页面切换。
4. **适用于单个页面显示：** 当您有多个页面，但同一时间只显示其中一个页面时，`QStackedWidget` 是一个很好的选择。

```python
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton, QStackedWidget

app = QApplication([])

# 创建 QStackedWidget
stacked_widget = QStackedWidget()

# 添加页面
page1 = QWidget()
label1 = QLabel('这是页面 1')
page1.layout = QVBoxLayout(page1)
page1.layout.addWidget(label1)
page1.setLayout(page1.layout)
stacked_widget.addWidget(page1)

page2 = QWidget()
label2 = QLabel('这是页面 2')
page2.layout = QVBoxLayout(page2)
page2.layout.addWidget(label2)
page2.setLayout(page2.layout)
stacked_widget.addWidget(page2)

# 创建按钮用于切换页面
button1 = QPushButton('显示页面 1')
button1.clicked.connect(lambda: stacked_widget.setCurrentIndex(0))

button2 = QPushButton('显示页面 2')
button2.clicked.connect(lambda: stacked_widget.setCurrentIndex(1))

# 显示按钮和堆栈式布局
layout = QVBoxLayout()
layout.addWidget(button1)
layout.addWidget(button2)
layout.addWidget(stacked_widget)

# 设置堆栈式布局为窗口布局
window = QWidget()
window.setLayout(layout)
window.show()

app.exec()
```

总体而言，`QTabWidget` 适用于标签页式导航，而 `QStackedWidget` 适用于以堆栈形式切换页面的场景。您可以根据具体需求选择使用哪一个。
