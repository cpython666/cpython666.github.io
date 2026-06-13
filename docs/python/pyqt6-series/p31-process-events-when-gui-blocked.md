---
title: "P31-主线程中执行耗时任务时GUI 被阻塞，如何强制处理事件循环中的待处理事件，以更新 GUI"
created_at: 2024-12-20 21:45:47
updated_at: 2024-12-20 21:45:47
---

# P31-主线程中执行耗时任务时GUI 被阻塞，如何强制处理事件循环中的待处理事件，以更新 GUI

## P31-在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，如何强制处理事件循环中的待处理事件，以更新 GUI

<font style="color:rgb(55, 65, 81);">在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，直到任务完成。在这种情况下，你可以使用 </font>**QApplication.processEvents()**<font style="color:rgb(55, 65, 81);"> 方法来强制处理事件循环中的待处理事件，以便更新 GUI。</font>

在不使用多线程的情况下，GUI 的状态更新通常需要在事件循环中执行。如果在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，直到任务完成。在这种情况下，你可以使用 `QApplication.processEvents()` 方法来强制处理事件循环中的待处理事件，以便更新 GUI。

<font style="color:rgb(55, 65, 81);">以下是一个示例代码，演示了如何在主线程中执行一个耗时的任务并实时更新 GUI：</font>

```python
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget, QProgressBar
from PyQt6.QtCore import Qt, QTimer
import time

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('任务进度示例')

        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)

        layout = QVBoxLayout(central_widget)

        self.label = QLabel('等待任务完成...', self)
        layout.addWidget(self.label)

        self.progress_bar = QProgressBar(self)
        layout.addWidget(self.progress_bar)

        self.start_button = QPushButton('开始任务', self)
        self.start_button.clicked.connect(self.start_task)
        layout.addWidget(self.start_button)

    def start_task(self):
        self.label.setText('任务进行中...')
        self.progress_bar.setValue(0)

        for i in range(1, 101):
            # 模拟耗时任务
            time.sleep(0.1)
            
            # 更新进度条
            self.progress_bar.setValue(i)

            # 强制处理事件循环，以便更新 GUI
            QApplication.processEvents()

        self.label.setText('任务完成！')

if __name__ == '__main__':
    app = QApplication([])
    main_win = MainWindow()
    main_win.show()
    app.exec()
```

<font style="color:rgb(55, 65, 81);">请注意，</font>`<font style="color:rgb(55, 65, 81);">QApplication.processEvents()</font>`<font style="color:rgb(55, 65, 81);"> 的使用是为了手动处理事件循环，这允许 GUI 在任务执行期间更新。但是，这种方法可能不够理想，因为它强制处理所有待处理的事件，包括用户输入等。这可能导致应用程序在任务执行期间对用户的响应变慢。</font>
