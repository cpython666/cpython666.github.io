---
title: "P27-浮点数滑块"
created_at: 2024-12-20 21:43:23
updated_at: 2024-12-20 21:43:23
---

# P27-浮点数滑块

```python
from PyQt6.QtWidgets import QApplication, QMainWindow, QSlider, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import Qt,pyqtSignal

class FloatSlider(QSlider):
    valueChangedFloat = pyqtSignal(float)
    
    def __init__(self, parent=None):
        super().__init__(Qt.Orientation.Horizontal, parent)
        self._multiplier = 100  # 放大倍数，例如设置为100，就支持两位小数

        self.valueChanged.connect(self.emitFloatValueChanged)

    def setFloatValue(self, floatValue):
        intValue = int(floatValue * self._multiplier)
        self.setValue(intValue)

    def floatValue(self):
        return self.value() / self._multiplier

    def emitFloatValueChanged(self):
        self.valueChangedFloat.emit(self.floatValue())

    def setMultiplier(self, multiplier):
        self._multiplier = multiplier

    def multiplier(self):
        return self._multiplier

class ExampleWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)

        layout = QVBoxLayout(central_widget)

        self.float_label = QLabel('Float Value:', self)
        layout.addWidget(self.float_label)

        self.float_slider = FloatSlider(self)
        self.float_slider.setRange(0, 100 * self.float_slider.multiplier())  # 设置范围
        self.float_slider.setFloatValue(50.0)  # 设置初始值
        self.float_slider.valueChangedFloat.connect(self.updateFloatLabel)
        layout.addWidget(self.float_slider)

    def updateFloatLabel(self, value):
        self.float_label.setText(f'Float Value: {value:.2f}')

if __name__ == '__main__':
    app = QApplication([])
    window = ExampleWindow()
    window.setGeometry(100, 100, 300, 200)
    window.show()
    app.exec()
```
