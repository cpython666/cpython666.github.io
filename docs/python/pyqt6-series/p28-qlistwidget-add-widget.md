---
title: "P28-QListWidget中添加Widget"
created_at: 2024-12-20 21:43:40
updated_at: 2024-12-20 21:43:40
---

# P28-QListWidget中添加Widget

```python
from PyQt5.QtWidgets import QApplication, QListWidget, QListWidgetItem, QLabel, QWidget, QVBoxLayout
import sys

class CustomWidget(QWidget):
    def __init__(self, text):
        super().__init__()
        layout = QVBoxLayout()
        label = QLabel(text)
        layout.addWidget(label)
        self.setLayout(layout)

app = QApplication(sys.argv)

list_widget = QListWidget()

# 创建一个包含QWidget的QListWidgetItem
item_widget = QListWidgetItem()

widget = CustomWidget("Custom Widget 1")
item_widget.setSizeHint(widget.sizeHint())
list_widget.addItem(item_widget)

list_widget.setItemWidget(item_widget, widget)


# 添加更多项
item_text = ["Item 2", "Item 3", "Item 4"]
for text in item_text:
    item = QListWidgetItem(text)
    list_widget.addItem(item)

list_widget.show()
sys.exit(app.exec_())
```
