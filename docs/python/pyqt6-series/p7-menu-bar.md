---
title: "P7-顶部菜单栏实例"
created_at: 2024-12-20 21:35:21
updated_at: 2024-12-20 21:35:21
---

# P7-顶部菜单栏实例

```python
from PyQt6.QtWidgets import QApplication, QMainWindow, QMenu, QMenuBar
from PyQt6.QtGui import QIcon,QAction
from PyQt6.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        menubar = self.menuBar()
        # 创建文件菜单，里面有二级菜单：打开，保存,设置
        fileMenu = menubar.addMenu('文件')
        openFile = QAction(QIcon('./assets/imgs/icons/open-file.png'),'打开文件', self)
        openFile.setShortcut('Ctrl+O')
        openFile.triggered.connect(self.openFile)
        fileMenu.addAction(openFile)
        openFolder = QAction(QIcon('./assets/imgs/icons/open-folder.png'),'打开文件夹', self)
        openFolder.triggered.connect(self.openFolder)
        fileMenu.addAction(openFolder)
        fileMenu.addSeparator()
        saveFile = QAction(QIcon('./assets/imgs/icons/save.png'),'保存', self)
        saveFile.setShortcut('Ctrl+S')
        saveFile.triggered.connect(self.saveFile)
        fileMenu.addAction(saveFile)
        setting = QAction(QIcon('./assets/imgs/icons/setting.png'),'设置', self)
        setting.triggered.connect(self.setting)
        fileMenu.addAction(setting)
        # 创建帮助菜单
        helpMenu = menubar.addMenu('帮助')
        about = QAction(QIcon('./assets/imgs/icons/about.png'),'关于', self)
        about.triggered.connect(self.about)
        helpMenu.addAction(about)
        helpMenu.addSeparator()
        donation = QAction(QIcon('./assets/imgs/icons/donation.png'),'捐赠', self)
        donation.triggered.connect(self.donation)
        helpMenu.addAction(donation)

        self.setWindowTitle("派森斗罗")
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(300, 300, 400, 200)
        self.show()

    def openFile(self):
        print('打开文件')
    def openFolder(self):
        print('打开文件夹')
    def setting(self):
        print('设置')
    def saveFile(self):
        print('保存文件')
    def about(self):
        print('这是一个顶部菜单栏示例程序')
    def donation(self):
        print('捐赠选项')

if __name__ == '__main__':
    app = QApplication([])
    window = MainWindow()
    app.exec()
```
