---
title: "P22-窗口中画一个框"
created_at: 2024-12-20 21:41:36
updated_at: 2024-12-20 21:41:36
---

# P22-窗口中画一个框

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget
from PyQt6.QtGui import QPainter, QBrush, QPen
from PyQt6.QtCore import Qt, QRect, QPoint


class DrawingApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('Draw Rectangle')

        self.canvas = DrawingCanvas(self)
        self.setCentralWidget(self.canvas)

        self.show()


class DrawingCanvas(QWidget):
    def __init__(self, parent):
        super().__init__(parent)
        self.setGeometry(0, 0, parent.width(), parent.height())

        self.origin = QPoint(0, 0)  # 初始化为 (0, 0)
        self.end = QPoint(0, 0)     # 初始化为 (0, 0)

    def paintEvent(self, event):
        painter = QPainter(self)
        # 设置绘制选项，启用抗锯齿。
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        rect = QRect(self.origin, self.end)
        painter.drawRect(rect)

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.origin = event.pos()
            self.end = event.pos()

    def mouseMoveEvent(self, event):
        if event.buttons() & Qt.MouseButton.LeftButton:
            self.end = event.pos()
            self.update()

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.end = event.pos()
            self.update()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = DrawingApp()
    sys.exit(app.exec())
```
