---
title: "P15-窗口居中变大出现"
created_at: 2024-12-20 21:38:56
updated_at: 2024-12-20 21:38:56
---

# P15-窗口居中变大出现

我最开始想的是从小变到大，绘制之后再不断调用居中函数，最后发现窗口在左上角和中间不断闪动，于是我认真思考了一下想到了其实可以计算出初始状态和末状态的位置大小信息。

如何查看QPropertyAnimation类的方法以及信号。

可以优化一下出场，免去最开始的闪烁一下。

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        # self.setGeometry(300, 300, 200, 100)
        self.setWindowTitle('变大窗口')
        self.scaleIn()

    def scaleIn(self):
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(100,100,0,0))
        self.animation.setEndValue(QRect(100,100,200,300))
        self.animation.setDuration(1000)
        self.animation.valueChanged.connect(self.center)
        self.animation.setEasingCurve(QEasingCurve.Type.OutQuad)  # Use QEasingCurve.Type.OutQuad
        self.animation.start()
    
    def center(self):
        self.hide()
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(0, 0, 800, 600)
        self.setWindowTitle('变大窗口')
        self.center()
        self.scaleIn()

    def scaleIn(self):
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr=self.frameGeometry()
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(cp.x(),cp.y(),0,0))
        self.animation.setEndValue(qr)
        self.animation.setDuration(1000)
        # self.animation.setDuration(3000)
        self.animation.setEasingCurve(QEasingCurve.Type.Linear)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutQuint)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutBack)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutElastic)
        self.animation.start()
    
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setWindowTitle('变大窗口')
        self.scaleIn()

    def scaleIn(self):
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr=self.center()
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(cp.x(),cp.y(),0,0))
        self.animation.setEndValue(qr)
        self.animation.setDuration(1000)
        # self.animation.setDuration(3000)
        self.animation.setEasingCurve(QEasingCurve.Type.Linear)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutQuint)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutBack)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutElastic)
        self.animation.start()
    
    def center(self):
        qr=QRect(0, 0, 800, 600)
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        return qr

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```
