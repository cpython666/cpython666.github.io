---
title: "P5-PyQt6-初探QMainWindow-各模块的学习方法"
created_at: 2024-12-20 21:33:09
updated_at: 2024-12-20 21:33:09
---

# P5-PyQt6-初探QMainWindow-各模块的学习方法

**QMainWindow**是Qt框架中的一个类，用于创建主窗口应用程序。它提供了一个具有一般应用程序框架的主窗口，包括菜单栏、工具栏、状态栏和中央工作区域。

以下是**QMainWindow**的一些主要特性：

1. **菜单栏（Menu Bar）：****QMainWindow**允许你添加菜单栏，通过菜单栏你可以创建各种菜单，包括文件、编辑、视图等。
2. **工具栏（Tool Bar）：** 你可以在主窗口上添加工具栏，工具栏通常包含一些常用的工具按钮，例如打开、保存、剪切、复制等。
3. **状态栏（Status Bar）：****QMainWindow**还提供了一个状态栏，用于显示应用程序的状态信息或者当前操作的相关信息。
4. **中央工作区域（Central Widget）：** 主要的应用程序界面通常放置在中央工作区域，这是一个可以包含其他Qt小部件的区域，例如文本编辑器、图形视图等。
5. **Dock小部件（Dock Widgets）：****QMainWindow**支持将一些小部件作为停靠窗口，可以通过拖拽将它们放置在主窗口的边缘。
6. **窗口管理功能：** 包括最大化、最小化、关闭等窗口管理功能。

下面是一个简单的例子，演示如何创建一个基本的**QMainWindow**：

```python
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel

class MyMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # 设置主窗口标题
        self.setWindowTitle('My Main Window')

        # 添加标签到中央工作区域
        central_widget = QLabel("Hello, QMainWindow!")
        self.setCentralWidget(central_widget)

        # 添加菜单栏
        menubar = self.menuBar()
        file_menu = menubar.addMenu('File')
        file_menu.addAction('Open')
        file_menu.addAction('Save')

        # 添加工具栏
        toolbar = self.addToolBar('Tools')
        toolbar.addAction('Cut')
        toolbar.addAction('Copy')
        toolbar.addAction('Paste')

        # 添加状态栏
        statusbar = self.statusBar()
        statusbar.showMessage('Ready')

if __name__ == '__main__':
    app = QApplication([])
    window = MyMainWindow()
    window.show()
    app.exec_()
```

这个例子创建了一个简单的主窗口，包括一个标签作为中央工作区域，一个简单的菜单栏，一个工具栏和一个状态栏。这只是一个入门示例，你可以根据你的应用程序需求自定义和扩展**QMainWindow**。
