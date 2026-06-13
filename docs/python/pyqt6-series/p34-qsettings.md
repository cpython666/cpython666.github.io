---
title: "P34-配置相关QSettings"
created_at: 2024-12-20 21:46:55
updated_at: 2024-12-20 21:46:55
---

# P34-配置相关QSettings

```python
# -*- coding: utf-8 -*-


import sys
from PyQt6.QtCore import Qt, QSettings
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget

class MySettingsApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PyQt6配置类使用示例")
        self.setGeometry(100, 100, 400, 200)
        # 初始化字典属性
        self.my_dict = {"键1": "值1", "键2": "值2"}
        # 从文件加载字典到属性中
        self.load_settings()
        # 创建界面
        central_widget = QWidget(self)
        central_layout = QVBoxLayout(central_widget)
        label = QLabel(f"当前键值对: {self.my_dict}", self)
        central_layout.addWidget(label)
        button = QPushButton("改变键值对", self)
        button.clicked.connect(self.change_dictionary)
        central_layout.addWidget(button)
        self.setCentralWidget(central_widget)

    def load_settings(self):
        # 从文件加载字典数据
        settings = QSettings("config.ini", QSettings.Format.IniFormat)
        settings.beginGroup("mapping")
        for key in settings.allKeys():
            self.my_dict[key] = settings.value(key)
        settings.endGroup()

    def save_settings(self):
        # 保存字典数据到文件
        settings = QSettings("config.ini", QSettings.Format.IniFormat)
        settings.beginGroup("mapping")
        for key, value in self.my_dict.items():
            settings.setValue(key, value)
        settings.endGroup()

    def change_dictionary(self):
        # 模拟属性改变
        self.my_dict["key1"] = "哈哈哈"
        self.my_dict["key3"] = "嘿嘿嘿"
        # 保存更新后的字典到文件
        self.save_settings()
        # 更新界面上的标签
        self.centralWidget().layout().itemAt(0).widget().setText(f"当前键值对：{self.my_dict}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MySettingsApp()
    window.show()
    sys.exit(app.exec())
```
