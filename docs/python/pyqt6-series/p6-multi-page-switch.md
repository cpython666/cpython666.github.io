---
title: "P6-多页面切换实例"
created_at: 2024-12-20 21:34:34
updated_at: 2024-12-20 21:34:34
---

# P6-多页面切换实例

在PyQt6中，可以使用`QTabWidget`和`QWidget`来实现多页面切换。

当然你也可以自定义组件来实现这样的功能。在这里我们使用`QTabWidget`和`QWidget`

以下是一个简单的示例：

```python
import sys
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QVBoxLayout, QPushButton, QWidget
from PyQt6.QtGui import QIcon

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("派森斗罗")
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(100, 100, 800, 600)

        self.tab_widget = QTabWidget()
        self.setCentralWidget(self.tab_widget)

        self.page1 = QWidget()
        self.page2 = QWidget()

        self.tab_widget.addTab(self.page1, "页面1")
        self.tab_widget.addTab(self.page2, "页面2")

        layout = QVBoxLayout()
        button1 = QPushButton("切换到页面2")
        button1.clicked.connect(lambda: self.switch_page(2))
        layout.addWidget(button1)

        button2 = QPushButton("切换到页面1")
        button2.clicked.connect(lambda: self.switch_page(1))
        layout.addWidget(button2)

        self.page1.setLayout(layout)
        self.page2.setLayout(layout)

    def switch_page(self, index):
        self.tab_widget.setCurrentIndex(index - 1)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec())
```



在这个示例中，我们创建了一个`QMainWindow`，并设置了一个`QTabWidget`作为其中心部件。然后，我们创建了两个`QWidget`（`page1`和`page2`），并将它们添加到`QTabWidget`中。我们还添加了两个按钮，分别用于在两个页面之间切换。当点击这些按钮时，会调用`switch_page`方法来切换当前选中的页面。

```python
import sys
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QVBoxLayout, QPushButton, QWidget,QStackedWidget,QLabel
from PyQt6.QtGui import QIcon

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("派森斗罗")
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(100, 100, 800, 600)

        self.initStackWeight()
        self.initTabWeight()

    def initStackWeight(self):
        self.stacked_widget = QStackedWidget()
        page1 = QWidget()
        page2 = QWidget()
        label1 = QLabel('这是页面 1')
        label2 = QLabel('这是页面 2')
        page1.layout = QVBoxLayout(page1)
        page2.layout = QVBoxLayout(page2)
        page1.layout.addWidget(label1)
        page2.layout.addWidget(label2)
        self.stacked_widget.addWidget(page1)
        self.stacked_widget.addWidget(page2)
        button1 = QPushButton('显示页面 1')
        button1.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(0))
        button2 = QPushButton('显示页面 2')
        button2.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(1))

        # 显示按钮和堆栈式布局
        mainWindow=QWidget()
        layout = QVBoxLayout()
        layout.addWidget(button1)
        layout.addWidget(button2)
        layout.addWidget(self.stacked_widget)
        mainWindow.setLayout(layout)
        self.setCentralWidget(mainWindow)

    def initTabWeight(self):
        self.tab_widget = QTabWidget()
        print(self.stacked_widget.widget(1).layout.addWidget(self.tab_widget))
        self.page1 = QWidget()
        self.page2 = QWidget()
        self.tab_widget.addTab(self.page1, "页面1")
        self.tab_widget.addTab(self.page2, "页面2")

        layout1 = QVBoxLayout()
        button1 = QPushButton("切换到标签页2")
        button1.clicked.connect(lambda: self.switch_page(2))
        layout1.addWidget(button1)
        self.page1.setLayout(layout1)

        layout2 = QVBoxLayout()
        button2 = QPushButton("切换到标签页1")
        button2.clicked.connect(lambda: self.switch_page(1))
        layout2.addWidget(button2)
        self.page2.setLayout(layout2)

    def switch_page(self, index):
        self.tab_widget.setCurrentIndex(index - 1)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec())
```
