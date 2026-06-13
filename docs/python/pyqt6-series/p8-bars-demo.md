---
title: "P8-多种栏示例"
created_at: 2024-12-20 21:35:41
updated_at: 2024-12-20 21:35:41
---

# P8-多种栏示例

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow,QPushButton,QLabel, QToolBar, QStatusBar, QTabWidget, QVBoxLayout, QWidget
from PyQt6.QtGui import QAction,QIcon

class MyApplication(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        # 创建一个退出动作
        exitAction = QAction('退出', self)
        exitAction.setShortcut('Ctrl+Q')
        exitAction.triggered.connect(self.close)

        # 创建一个新建动作
        newAction = QAction('新建', self)

        # 创建一个打开动作
        openAction = QAction('打开', self)

        # 创建菜单栏
        menubar = self.menuBar()
        fileMenu = menubar.addMenu('文件')
        fileMenu.addAction(newAction)
        fileMenu.addAction(openAction)
        fileMenu.addSeparator()
        fileMenu.addAction(exitAction)

        # 创建工具栏
        toolbar = QToolBar()
        toolbar.addAction(newAction)
        toolbar.addAction(openAction)
        toolbar.addAction(exitAction)
        self.addToolBar(toolbar)

        # 创建状态栏
        statusbar = QStatusBar()
        self.setStatusBar(statusbar)
        statusbar.showMessage('这是状态栏',1000)

        btn=QPushButton('显示消息',self)
        btn.move(100,0)
        # 查看定义类
        btn.clicked.connect(lambda x:statusbar.showMessage('您好~',1000))

        # 创建标签栏
        tab_widget = QTabWidget()
        tab1 = QWidget()
        tab2 = QWidget()
        tab_widget.addTab(tab1, '标签1')
        tab_widget.addTab(tab2, '标签2')
        layout = QVBoxLayout()
        tab1.setLayout(layout)
        layout.addWidget(QWidget())  # 向标签1添加内容
        self.setCentralWidget(tab_widget)

        # 创建侧栏
        sidebar = QToolBar('侧栏')
        sidebar.addWidget(QLabel('这是侧边栏'))  # 向侧栏添加内容
        self.addToolBar(sidebar)

        # 创建工具箱栏
        toolbox = QToolBar('工具箱')
        toolbox.addWidget(QLabel('这是工具箱'))  # 向工具箱添加内容
        self.addToolBar(toolbox)

        # 设置主窗口属性
        self.setGeometry(100, 100, 600, 400)
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    sys.exit(app.exec())
```
