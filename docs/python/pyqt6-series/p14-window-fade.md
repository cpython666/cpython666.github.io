---
title: "P14-窗口渐显与渐隐"
created_at: 2024-12-20 21:38:35
updated_at: 2024-12-20 21:38:35
---

# P14-窗口渐显与渐隐

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation

class FadeWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(300, 300, 400, 200)
        self.setWindowTitle('派森斗罗')

        layout = QVBoxLayout(self)

        fade_out_button = QPushButton('Fade Out', self)
        fade_out_button.clicked.connect(self.fadeOut)

        fade_in_button = QPushButton('Fade In', self)
        fade_in_button.clicked.connect(self.fadeIn)

        layout.addWidget(fade_out_button)
        layout.addWidget(fade_in_button)

        # Set initial opacity to 0
        self.setWindowOpacity(0.0)
        self.fadeIn()

    def fadeIn(self):
        self.animation = QPropertyAnimation(self, b"windowOpacity")
        self.animation.setStartValue(0.0)
        self.animation.setEndValue(1.0)
        self.animation.setDuration(1000)
        self.animation.start()

    def fadeOut(self):
        self.animation = QPropertyAnimation(self, b"windowOpacity")
        self.animation.setStartValue(1.0)
        self.animation.setEndValue(0.0)
        self.animation.setDuration(1000)
        self.animation.finished.connect(self.close)
        self.animation.start()

if __name__ == '__main__':
    app = QApplication(sys.argv)

    fade_window = FadeWindow()
    fade_window.show()

    sys.exit(app.exec())
```
