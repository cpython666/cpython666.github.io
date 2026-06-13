---
title: "P20-多软件图标排布"
created_at: 2024-12-20 21:41:05
updated_at: 2024-12-20 21:41:05
---

# P20-多软件图标排布

```python
from PyQt6 import QtGui
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QScrollArea, QLabel, QGridLayout, QPushButton
from PyQt6.QtGui import QPixmap
import sys
import typing
from PyQt6.QtWidgets import QApplication, QMainWindow,QSystemTrayIcon,QMenu,QFrame,QHBoxLayout,QVBoxLayout,QLineEdit, QPushButton, QLabel,QListWidget, QMenuBar, QWidget, QStackedWidget,QLabel,QListWidgetItem
from PyQt6.QtGui import (QIcon,QAction,QScreen, QGuiApplication,QColor,QResizeEvent,QDragMoveEvent,QMoveEvent,
                         QPixmap, QMovie)
from PyQt6.QtCore import (Qt,pyqtSignal,QRect,QPropertyAnimation,
                          QParallelAnimationGroup, QSequentialAnimationGroup, QPauseAnimation, QEasingCurve,QSize)
from PyQt6.QtWidgets import (QApplication, QWidget, QLabel, QLineEdit, QPushButton,QCheckBox,
                             QVBoxLayout, QHBoxLayout, QGridLayout,
                             QGraphicsOpacityEffect)
class SoftwareWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()
        self.initSoftList()

    def initUI(self):
        self.setWindowTitle('多软件窗口')
        self.setGeometry(100, 100, 700, 100)
        self.show()

    def initSoftList(self):
        # 模拟软件数据
        self.software_data = [
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
            {"name": "软件1", "icon_path": "assets/imgs/icons/sun.png"},
        ]
        self.setSoftBoxs(con=self)

    def setSoftBoxs(self,con,box_width=120,box_height=160):
        # 创建包含软件图标和名称的布局
        layout = QGridLayout()
        print(con.width())
        row, col = 0, 0  # 行和列的起始位置
        # 能够容纳的行
        row_allow=self.width()//120
        for software in self.software_data:
            icon_path = software["icon_path"]
            name = software["name"]
            des='这是软件一ahhah哈哈哈哈哈'
            box=self.getSoftBox(name,icon_path,des,box_width=box_width,box_height=box_height)
            layout.addWidget(box, row, col)
            col += 1
            if col == row_allow:
                col = 0
                row += 1
        con.setLayout(layout)

    def getSoftBox(self,name,logo_path,des,box_width,box_height):
        box=QWidget()
        box.setFixedSize(box_width,box_height)
        box.setToolTip(des)
        # box.setStyleSheet("QWidget{background-color:pink}")
        box.setStyleSheet("QWidget{border:1px solid black;background-color:#FDF6E3;}")
        layout=QVBoxLayout()
        logo_label=QLabel()
        logo_label.setPixmap(QPixmap(logo_path).scaledToWidth(50))
        logo_label.setFixedSize(50,50)
        name_label=QLabel(name)
        des_label=QLabel(des)
        btn=QPushButton('打开')
        layout.addWidget(logo_label)
        layout.addWidget(name_label)
        layout.addWidget(des_label)
        layout.addWidget(btn)
        layout.setAlignment(logo_label,Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)

        box.setLayout(layout)
        return box


if __name__ == '__main__':
    app = QApplication([])
    ex = SoftwareWindow()
    app.exec()
```
