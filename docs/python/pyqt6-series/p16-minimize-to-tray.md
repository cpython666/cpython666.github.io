---
title: "P16-最小化窗口到托盘，右键菜单，窗口恢复"
created_at: 2024-12-20 21:39:17
updated_at: 2024-12-20 21:39:17
---

# P16-最小化窗口到托盘，右键菜单，窗口恢复

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QSystemTrayIcon, QMenu
from PyQt6.QtGui import QIcon, QAction

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setWindowTitle('PyQt6 托盘示例')
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(300, 300, 300, 200)

        # 创建系统托盘图标
        self.tray_icon = QSystemTrayIcon(self)
        self.tray_icon.setIcon(QIcon('logo.png'))
        # 创建托盘图标菜单
        tray_menu = QMenu(self)
        action1 = tray_menu.addAction('设置一')
        action2 = tray_menu.addAction('设置二')
        tray_menu.addSeparator()
        action3 = tray_menu.addAction('打开主面板(未实现)')
        tray_menu.addSeparator()
        restore_action = QAction(QIcon('./assets/imgs/icons/recover.svg'),'还原', self)
        restore_action.triggered.connect(self.showNormal)
        exit_action = QAction(QIcon('./assets/imgs/icons/quit.svg'),'退出', self)
        exit_action.triggered.connect(app.quit)

        tray_menu.addAction(restore_action)
        tray_menu.addAction(exit_action)

        self.tray_icon.setContextMenu(tray_menu)
        # 托盘图标点击事件
        self.tray_icon.activated.connect(self.tray_icon_activated)
        self.tray_icon.show()
        
        # self.tray_icon.showMessage("托盘图标示例", "程序已最小化到托盘")


    def tray_icon_activated(self, reason):
        if reason == QSystemTrayIcon.ActivationReason.Trigger:
            if self.isHidden():
                self.showNormal()
                self.raise_()


    def closeEvent(self, event):
        # 重写窗口关闭事件，实现最小化到托盘
        event.ignore()
        self.hide()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MyWindow()
    window.show()
    sys.exit(app.exec())
```
