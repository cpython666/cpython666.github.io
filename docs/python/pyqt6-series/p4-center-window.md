---
title: "P4-居中显示窗口"
created_at: 2024-12-20 21:32:41
updated_at: 2024-12-20 21:32:41
---

# P4-居中显示窗口

+  self.frameGeometry() 返回一个 QRect 对象，该对象表示小组件相对于其父级的几何图形，包括任何窗口框架。
+  QGuiApplication.primaryScreen().availableGeometry().center() 返回一个 QPoint 对象，该对象表示主屏幕的可用几何图形的中心点。
+  此线移动矩形 （ qr ） 的左上角，使其中心位于指定的中心点 （ cp ）。
+  rectangle.self.move(qr.topLeft()) ：此行将小组件移动到矩形 （ qr ） 的左上角。 qr.topLeft() 返回表示矩形左上角的 A QPoint 。

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtGui import QScreen, QGuiApplication
from PyQt6.QtGui import QIcon

class MyApplication(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(0, 0, 300, 200)  # Set window size
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))

        self.center()  # Center the window on the screen
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    ex.show()
    sys.exit(app.exec())
```
