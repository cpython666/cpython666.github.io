---
title: "P18-窗口自定义拖拽功能"
created_at: 2024-12-20 21:40:24
updated_at: 2024-12-20 21:40:24
---

# P18-窗口自定义拖拽功能

```python
def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            print(self.mapToGlobal(event.pos()),event.pos(),self.pos(),self.dis)
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
def mouseMoveEvent(self, event):
    # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
    if self.dragging:
        # self.move(event.pos()-self.dis)
        self.move(self.mapToGlobal(event.pos()) - self.dis)
def mouseReleaseEvent(self, event):
    # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
    if event.button() == Qt.MouseButton.LeftButton and self.dragging:
        self.dragging = False
        self.setCursor(Qt.CursorShape.OpenHandCursor)
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtGui import QScreen, QGuiApplication,QIcon
from PyQt6.QtCore import Qt, QRect, QPropertyAnimation, QParallelAnimationGroup,QSize
class MyApplication(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()
    def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            print(self.mapToGlobal(event.pos()),event.pos(),self.pos(),self.dis)
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
    def mouseMoveEvent(self, event):
        # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
        if self.dragging:
            # self.move(event.pos()-self.dis)
            self.move(self.mapToGlobal(event.pos()) - self.dis)
    def mouseReleaseEvent(self, event):
        # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
        if event.button() == Qt.MouseButton.LeftButton and self.dragging:
            self.dragging = False
            self.setCursor(Qt.CursorShape.OpenHandCursor)

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
