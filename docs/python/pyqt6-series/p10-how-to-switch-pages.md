---
title: "P10-pyqt6中如何实现多页面切换？"
created_at: 2024-12-20 21:36:43
updated_at: 2024-12-20 21:36:43
---

# P10-pyqt6中如何实现多页面切换？

在 PyQt6 中实现多页面切换通常有多种方法，其中两种主要方法是使用 `QStackedWidget` 和 `QTabWidget`。以下是如何使用这两种方法实现多页面切换的总结：

1.  **使用 QStackedWidget**： 
    - 创建一个 `QStackedWidget` 对象来托管多个页面。
    - 为每个页面创建一个独立的 `QWidget` 子类，包括该页面的内容和控件。
    - 使用 `addWidget` 方法将这些页面部件添加到 `QStackedWidget` 中，每个页面都有一个索引。
    - 使用 `setCurrentIndex` 方法切换页面，通过指定页面的索引。
    - 适用于需要程序控制多页面切换的情况。

示例代码： 

```python
stacked_widget = QStackedWidget()
page1 = QWidget()
page2 = QWidget()
stacked_widget.addWidget(page1)
stacked_widget.addWidget(page2)
stacked_widget.setCurrentIndex(0)  # 切换到第一个页面
```

2.  **使用 QTabWidget**： 
    - 创建一个 `QTabWidget` 对象，它提供了选项卡式的多页面切换。
    - 为每个标签页创建一个独立的 `QWidget` 子类，包括页面的内容和控件。
    - 使用 `addTab` 方法将这些页面部件添加到 `QTabWidget`，同时指定标签页的标题。
    - 用户可以通过点击标签页来切换页面。
    - 适用于以选项卡形式显示多个页面的情况。

示例代码： 

```python
tab_widget = QTabWidget()
tab1 = QWidget()
tab2 = QWidget()
tab_widget.addTab(tab1, "页面 1")
tab_widget.addTab(tab2, "页面 2")
```

根据您的项目需求和个人喜好，您可以选择使用其中一种或两种方法来实现多页面切换。无论您选择哪种方法，都可以根据需要自定义和扩展页面的内容。
