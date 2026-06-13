---
title: "P32-单独线程处理任务"
created_at: 2024-12-20 21:46:02
updated_at: 2024-12-20 21:46:22
---

# P32-单独线程处理任务

在PyQt中，如果有耗时的操作阻塞主线程，会导致GUI冻结，因为GUI运行在同一个线程上。为了保持GUI在这些操作期间仍然响应，应该将耗时的任务移到单独的线程中。PyQt提供了`QThread`类来实现这个目的。

以下是一个简单的示例，演示如何使用`QThread`在后台运行耗时的任务，同时保持GUI响应：

```python
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget
from PyQt6.QtCore import Qt, QThread, pyqtSignal
import time

class WorkerThread(QThread):
    finished_signal = pyqtSignal(str)

    def run(self):
        # 模拟耗时任务
        time.sleep(5)
        self.finished_signal.emit("任务完成！")

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('耗时任务示例')

        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)

        layout = QVBoxLayout(central_widget)

        self.label = QLabel('等待任务完成...', self)
        layout.addWidget(self.label)

        self.start_button = QPushButton('开始任务', self)
        self.start_button.clicked.connect(self.start_task)
        layout.addWidget(self.start_button)

    def start_task(self):
        self.label.setText('任务进行中...')
        
        # 创建并启动工作线程
        self.worker_thread = WorkerThread(self)
        self.worker_thread.finished_signal.connect(self.task_completed)
        self.worker_thread.start()

    def task_completed(self, result):
        self.label.setText(result)

if __name__ == '__main__':
    app = QApplication([])
    main_win = MainWindow()
    main_win.show()
    app.exec()
```

在这个例子中，`WorkerThread`类是`QThread`的子类，负责运行耗时的任务。当任务完成时，它发射一个信号（`finished_signal`）。`MainWindow`类在点击“开始任务”按钮时创建`WorkerThread`的实例，将其信号连接到槽（`task_completed`），然后启动线程。

记住正确处理信号和槽，并确保GUI更新发生在主线程中。如果需要从工作线程更新GUI，请使用`pyqtSignal`发射信号，并将它们连接到主线程中的槽。

## <font style="color:rgb(55, 65, 81);">实时更新单独线程中任务执行的进度到窗口中</font>
要实时更新任务执行的进度到窗口中，可以通过在工作线程中使用定时器定期发射信号来更新主线程的进度。下面是一个简单的示例：

```python
# -*- coding: utf-8 -*-
# @Time    : 2023/12/7 22:04
# @QQ  : 2942581284
# @File    : 多线程-实时更新.py
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget, QProgressBar
from PyQt6.QtCore import Qt, QThread, pyqtSignal, QTimer
import time

class WorkerThread(QThread):
    progress_signal = pyqtSignal(int)
    finished_signal = pyqtSignal(str)

    def run(self):
        for i in range(1, 101):
            self.progress_signal.emit(i)
            time.sleep(0.1)  # 模拟耗时任务
        self.finished_signal.emit("任务完成！")


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

        # 创建并启动工作线程
        self.worker_thread = WorkerThread(self)
        self.worker_thread.progress_signal.connect(self.update_progress)
        self.worker_thread.finished_signal.connect(self.task_completed)
        self.worker_thread.start()

    def update_progress(self, value):
        self.progress_bar.setValue(value)

    def task_completed(self, result):
        self.label.setText(result)


if __name__ == '__main__':
    app = QApplication([])
    main_win = MainWindow()
    main_win.show()
    app.exec()
```

在这个例子中，`WorkerThread`类在运行期间使用了一个循环来模拟耗时任务，并通过定期发射`progress_signal`信号来更新主线程的进度条。主线程中的`update_progress`槽连接到这个信号，以更新GUI中的进度条。

请注意，这里使用了一个简单的定时器，实际情况中可能需要根据任务的性质和进度更新的频率选择合适的方案。
