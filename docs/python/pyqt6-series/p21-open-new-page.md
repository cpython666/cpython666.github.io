---
title: "P21-点击按钮打开新页面"
created_at: 2024-12-20 21:41:22
updated_at: 2024-12-20 21:41:22
---

# P21-点击按钮打开新页面

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QDialog, QVBoxLayout, QLabel

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # 创建主窗口
        self.setWindowTitle("派森斗罗")
        self.setGeometry(100, 100, 400, 200)

        # 创建按钮并连接点击信号与槽
        self.button = QPushButton("打开新窗口", self)
        self.button.clicked.connect(self.open_dialog)

    def open_dialog(self):
        # 创建对话框
        self.dialog = MyDialog()
        self.dialog.show()
        self.dialog.exec()

class MyDialog(QDialog):
    def __init__(self):
        super().__init__()

        # 创建对话框中的控件
        layout = QVBoxLayout(self)
        label = QLabel("这是新窗口！", self)
        layout.addWidget(label)

        self.setWindowTitle("派森斗罗")
        self.setGeometry(200, 200, 300, 150)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
```
