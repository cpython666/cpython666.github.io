---
title: "P9-左侧菜单控制右侧多页面切换"
created_at: 2024-12-20 21:36:06
updated_at: 2024-12-20 21:36:06
---

# P9-左侧菜单控制右侧多页面切换

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QHBoxLayout, QListWidget, QWidget, QStackedWidget,QLabel,QListWidgetItem
from PyQt6.QtGui import QIcon,QAction
from PyQt6.QtCore import Qt

class MyApplication(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('多页面切换示例')

        # 创建一个主窗口部件
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # 创建左侧导航栏
        nav_list = QListWidget()

        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/game.svg'),'游戏'))
        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/login.png'),'登录'))
        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/setting.png'),'设置'))
        nav_list.setFixedWidth(100)
        # nav_list.setViewMode(QListWidget.IconMode)
        nav_list.currentItemChanged.connect(self.switchPage)

        # 创建右侧多页面容器
        page_container = QStackedWidget()
        page1 = QWidget()
        QLabel('这是页面 1',page1)
        page1.setWindowTitle('页面 1')
        page2 = QWidget()
        page2.setWindowTitle('页面 2')
        QLabel('这是页面 2',page2)
        page_container.addWidget(page1)
        page_container.addWidget(page2)
        # page_container.setFixedWidth(500)

        # 创建布局管理器
        layout = QHBoxLayout()
        layout.addWidget(nav_list)
        layout.addWidget(page_container)

        central_widget.setLayout(layout)

    def switchPage(self, current, previous):
        if current:
            selected_index = self.centralWidget().layout().itemAt(0).widget().currentRow()
            self.centralWidget().layout().itemAt(1).widget().setCurrentIndex(selected_index)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    ex.show()
    sys.exit(app.exec())
```
