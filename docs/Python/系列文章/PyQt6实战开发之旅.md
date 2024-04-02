<a name="Ahs9C"></a>

# PyQt6实战开发之旅-代码均可运行

<a name="Nchsb"></a>

# ![PyQt6实战开发之旅.png](https://cdn.nlark.com/yuque/0/2023/png/38536969/1700992326629-1751928f-a81b-4a11-b416-b3cfab22c329.png#averageHue=%23141f2f&clientId=u445f37d0-f369-4&from=drop&id=u2b8770dd&originHeight=1440&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=2352480&status=done&style=none&taskId=u95f201a3-045b-4313-9be8-a3eb3f3bf84&title=)

# 视频教程

该专栏教程附带免费视频教程：[PyQt6实战开发之旅专栏](https://space.bilibili.com/1909782963/channel/collectiondetail?sid=1874891)

<a name="tu089"></a>

# 学习感悟

由于官方文档是英文的，所以学习起来不是很直观。<br />网上的中文教程也都有点偏重就轻，去从头学习细枝末节不是很必要。假如每个控件组件讲十分钟，几百个控件可想而知。<br />最关键的是有python基础，能理解类与继承，函数调用这些东西。所有教程都过分强调信号与槽这个东西，很大可能他面向的学习对象是零基础的学生，但是你有基础的话一看就明白了，无非就是某些事件发出个信号然后调用函数的过程。<br />所以我的学习方法就是弄清楚，PyQt6中有哪些模块，每个模块中有哪些组件，每个组件是什么功能，体现在软件上是什么样，有一个直观的认识之后。<br />就怼着一个目标开始我们的编程。开始设计一款自己的软件，怼着那些厉害的软件模仿功能，我这里就直接模仿者vscode来做了，过程中整理记录好笔记，等软件做出来，自己肯定收获不小。<br />不然你从头到尾看完教程，才开始实战，这个时候前面学的又忘光了，很消耗人的。<br />所以说不要一开始就在认知不清楚的时候盲目看教程，很可能看个标签，按钮什么的各种都敲一敲。其实每个细节你都不用太细究，你只需要有个清晰的整体认知，需要使用的时候直接搜索查询拿来使用就好了。
<a name="bK82v"></a>

# 简介

<a name="xEO0n"></a>

## 本合集特点特色

大家可以发现，我在这个合集会讲解一些非常简单的小的功能。<br />为什么这样呢？其实对于新手来说，我来就做一些很大的项目可能会导致没有耐心看下去，从另一个方面讲，我们一个大的项目就是由很多的小的功能凑起来的，我将这些小的功能拆分出来，这样大家哪个功能点做不出来就可以快速学习案例，然后应用到自己的项目中。没有必要长篇大论。

在本合集中，只讲有用的，保证高效开发一个软件。

<a name="Akgzu"></a>

## 为什么要学习PyQt6?

**为什么要学桌面开发？**<br />最近在干什么，突然又想用pyqt了。因为平时可能自己写代码的话只能自己用一下，但是发给别人用的话别人需要有点Python基础，这就下入了一个尴尬的循环。有python基础的不需要我的代码，没有python基础的拿到我的代码也跑不起来。<br />所以说不如送佛送到西，直接将代码打包成软件。所以<br />对于桌面程序的理解，开发过程就像前端一样。原型设计好后剩下的就是实现。<br />**为什么是PyQt6？**<br />首先，Python简单易学<br />其次，Qt强大<br />Python+Qt
<a name="gfllK"></a>

## PyQt6组成模块及功能

```python
QtCore
QtGui
QtWidgets
QtDBus
QtNetwork
QtHelp
QtXml
QtSvg
QtSql
QtTest
```

- QtCore：这个模块提供了一些基本的功能，如时间处理、文件和目录处理、数据类型、流、属性系统、元对象系统等。
- QtGui：这个模块是PyQt6中的图形用户界面(GUI)工具集，它提供了一些窗口系统、事件处理、2D图形和基本的图像类等功能。
- QtWidgets：这个模块是建立在QtGui之上的一套新的控件，它提供了一套丰富的控件集合，例如按钮、文本框、列表框、复选框等。
- QtDBus：这个模块实现了DBus的底层访问，使得应用程序可以通过DBus进行通信。
- QtNetwork：这个模块提供了实现网络编程的类和方法，如网络请求和响应、SSL安全连接等。
- QtHelp：这个模块用于创建帮助文件，支持多种格式，如HTML、XML等。
- QtXml：这个模块实现了解析和生成XML文档的功能。
- QtSvg：这个模块提供了将SVG文件转换为QPainter绘图的命令。
- QtSql：这个模块实现了SQL数据库的访问功能，可以执行SQL语句以及获取查询结果。
- QtTest：这个模块包含了一些测试工具，用于单元测试和集成测试。
  <a name="AAWwA"></a>

## 模块所处位置

```python
from PyQt6.QtWidgets import QApplication, QMainWindow, QMenu
from PyQt6.QtGui import QAction,QIcon

import sys
from PyQt6.QtWidgets import (QApplication, QGraphicsView, QGraphicsScene,QWidget,QHBoxLayout,QVBoxLayout,QLabel,
                             QGraphicsPixmapItem, QGraphicsRectItem, QMainWindow,QFormLayout,QSpinBox,QDoubleSpinBox,
                             QGraphicsTextItem, QPushButton,QInputDialog,QFontComboBox,QComboBox,
                             QSlider,QVBoxLayout,QFileDialog,QColorDialog,QTextEdit,QDialog,QLineEdit)
from PyQt6.QtCore import Qt, QRectF, Qt,QSettings
from PyQt6.QtGui import (QGuiApplication,QPixmap, 
                         QPainter, QImage, QFont, 
                         QKeySequence,QShortcut,QFont, 
                         QFontDatabase,QColor,QIcon)


```

<a name="KHscR"></a>

## 版本信息

```python
# QT_VERSION_STR 可以显示 Qt 的版本信息，PYQT_VERSION_STR 可以显示 PyQt 的版本信息
from PyQt6.QtCore import QT_VERSION_STR
from PyQt6.QtCore import PYQT_VERSION_STR

print(QT_VERSION_STR)
print(PYQT_VERSION_STR)
```

<a name="z4t7n"></a>

# 程序实战

<a name="pRkl3"></a>

## 第一个程序-Hello,PyQt6~

大家好，这一集我们来一起完成我们的第一个PyQt6程序，Hello，PyQt6。<br />在学习每一种语言，我们都会运行这样的一个hello，world程序。这不仅仅是一种仪式感，更是因为我们要保证环境或者三方库已经成功安装。不然可能会键盘一顿输出，一堆报错，找半天问题最后发现环境都没有装好。<br />好了，正文开始。<br />首先我们可以看下运行效果，运行成功后会出现这样一个窗口。有着我们自己的图标与标题。在窗口上显示着，Hello，PyQt6的字符。<br />当然，程序也有着一些默认的功能，比如最大化最小化，拖动窗口等，这就是我们使用成熟三方库或者框架的好处。<br />下面我们来看看具体的代码，<br />在第一行，我们导入sys模块，用于处理命令行参数和退出程序。<br />在第二行，我们从PyQt6.QtWidgets模块中导入QApplication、QMainWindow和QLabel类<br />在第三行，我们从PyQt6.QtGui模块中导入QIcon类<br />在第六行，我们创建一个QApplication对象，传入命令行参数列表。需要注意的是QApplication是Qt库中的一个关键类，它使用用户的桌面设置进行初始化，负责处理应用程序的初始化和结束<br />在第七行我们创建一个QMainWindow对象，表示主窗口<br />第八行我们设置主窗口的位置和大小，参数分别为x坐标、y坐标、宽度和高度，所以我们设置的参数意思就是在屏幕100,100位置绘制一个长300，宽200的窗口。<br />第九与第十行我们设置主窗口的标题为派森斗罗，并且设置主窗口的图标为logo.png文件。<br />第十二行我们在主窗口上创建一个QLabel对象，显示文本"Hello, PyQt6!"<br />第十四行显示主窗口，<br /> 	在第十五行，进入事件循环，等待用户操作，然后退出程序<br />没错，就这样简单。短短几行代码我们就可以在桌面创建一个小软件。并且由于Qt的可移植性，代码可以在Windows 、Mac OS，Linux等多种不同的平台中。<br />好了，本集内容到此结束，我们下集再见。

```python
import sys  # 导入sys模块，用于处理命令行参数和退出程序
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel  # 从PyQt6.QtWidgets模块中导入QApplication、QMainWindow和QLabel类
from PyQt6.QtGui import QIcon  # 从PyQt6.QtGui模块中导入QIcon类

def main():
    app = QApplication(sys.argv)  # 创建一个QApplication对象，传入命令行参数列表
    window = QMainWindow()  # 创建一个QMainWindow对象，表示主窗口
    window.setGeometry(100, 100, 300, 200)  # 设置主窗口的位置和大小，参数分别为x坐标、y坐标、宽度和高度
    window.setWindowTitle("派森斗罗")  # 设置主窗口的标题为"派森斗罗"
    window.setWindowIcon(QIcon('logo.png'))  # 设置主窗口的图标为'logo.png'文件

    QLabel("Hello, PyQt6!", window)  # 在主窗口上创建一个QLabel对象，显示文本"Hello, World!"

    window.show()  # 显示主窗口
    sys.exit(app.exec())  # 进入事件循环，等待用户操作，然后退出程序

if __name__ == "__main__":
    main()
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel
from PyQt6.QtGui import QIcon

def main():
    app = QApplication(sys.argv)
    window = QMainWindow()
    window.setGeometry(100, 100, 300, 200)
    window.setWindowTitle("派森斗罗")
    window.setWindowIcon(QIcon('logo.png'))

    QLabel("Hello, PyQt6!", window)

    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
```

<a name="e9JyR"></a>

## 居中显示窗口

-  self.frameGeometry() 返回一个 QRect 对象，该对象表示小组件相对于其父级的几何图形，包括任何窗口框架。
-  QGuiApplication.primaryScreen().availableGeometry().center() 返回一个 QPoint 对象，该对象表示主屏幕的可用几何图形的中心点。
-  此线移动矩形 （ qr ） 的左上角，使其中心位于指定的中心点 （ cp ）。
-  rectangle.self.move(qr.topLeft()) ：此行将小组件移动到矩形 （ qr ） 的左上角。 qr.topLeft() 返回表示矩形左上角的 A QPoint 。

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtGui import QScreen, QGuiApplication
from PyQt6.QtGui import QIcon

class MyApplication(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(0, 0, 300, 200)  # Set window size
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))

        self.center()  # Center the window on the screen
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    ex.show()
    sys.exit(app.exec())
```

<a name="n4FV6"></a>

## PyQt6-初探QMainWindow-各模块的学习方法

**QMainWindow**是Qt框架中的一个类，用于创建主窗口应用程序。它提供了一个具有一般应用程序框架的主窗口，包括菜单栏、工具栏、状态栏和中央工作区域。<br />以下是**QMainWindow**的一些主要特性：

1. **菜单栏（Menu Bar）：QMainWindow**允许你添加菜单栏，通过菜单栏你可以创建各种菜单，包括文件、编辑、视图等。
2. **工具栏（Tool Bar）：** 你可以在主窗口上添加工具栏，工具栏通常包含一些常用的工具按钮，例如打开、保存、剪切、复制等。
3. **状态栏（Status Bar）：QMainWindow**还提供了一个状态栏，用于显示应用程序的状态信息或者当前操作的相关信息。
4. **中央工作区域（Central Widget）：** 主要的应用程序界面通常放置在中央工作区域，这是一个可以包含其他Qt小部件的区域，例如文本编辑器、图形视图等。
5. **Dock小部件（Dock Widgets）：QMainWindow**支持将一些小部件作为停靠窗口，可以通过拖拽将它们放置在主窗口的边缘。
6. **窗口管理功能：** 包括最大化、最小化、关闭等窗口管理功能。

下面是一个简单的例子，演示如何创建一个基本的**QMainWindow**：

```python
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel

class MyMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # 设置主窗口标题
        self.setWindowTitle('My Main Window')

        # 添加标签到中央工作区域
        central_widget = QLabel("Hello, QMainWindow!")
        self.setCentralWidget(central_widget)

        # 添加菜单栏
        menubar = self.menuBar()
        file_menu = menubar.addMenu('File')
        file_menu.addAction('Open')
        file_menu.addAction('Save')

        # 添加工具栏
        toolbar = self.addToolBar('Tools')
        toolbar.addAction('Cut')
        toolbar.addAction('Copy')
        toolbar.addAction('Paste')

        # 添加状态栏
        statusbar = self.statusBar()
        statusbar.showMessage('Ready')

if __name__ == '__main__':
    app = QApplication([])
    window = MyMainWindow()
    window.show()
    app.exec_()
```

这个例子创建了一个简单的主窗口，包括一个标签作为中央工作区域，一个简单的菜单栏，一个工具栏和一个状态栏。这只是一个入门示例，你可以根据你的应用程序需求自定义和扩展**QMainWindow**。
<a name="tweIF"></a>

## 多页面切换实例

在PyQt6中，可以使用`QTabWidget`和`QWidget`来实现多页面切换。<br />当然你也可以自定义组件来实现这样的功能。在这里我们使用`QTabWidget`和`QWidget`<br />以下是一个简单的示例：

```python
import sys
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QVBoxLayout, QPushButton, QWidget
from PyQt6.QtGui import QIcon

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("派森斗罗")
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(100, 100, 800, 600)

        self.tab_widget = QTabWidget()
        self.setCentralWidget(self.tab_widget)

        self.page1 = QWidget()
        self.page2 = QWidget()

        self.tab_widget.addTab(self.page1, "页面1")
        self.tab_widget.addTab(self.page2, "页面2")

        layout = QVBoxLayout()
        button1 = QPushButton("切换到页面2")
        button1.clicked.connect(lambda: self.switch_page(2))
        layout.addWidget(button1)

        button2 = QPushButton("切换到页面1")
        button2.clicked.connect(lambda: self.switch_page(1))
        layout.addWidget(button2)

        self.page1.setLayout(layout)
        self.page2.setLayout(layout)

    def switch_page(self, index):
        self.tab_widget.setCurrentIndex(index - 1)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec())
```

在这个示例中，我们创建了一个`QMainWindow`，并设置了一个`QTabWidget`作为其中心部件。然后，我们创建了两个`QWidget`（`page1`和`page2`），并将它们添加到`QTabWidget`中。我们还添加了两个按钮，分别用于在两个页面之间切换。当点击这些按钮时，会调用`switch_page`方法来切换当前选中的页面。

```python
import sys
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QVBoxLayout, QPushButton, QWidget,QStackedWidget,QLabel
from PyQt6.QtGui import QIcon

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("派森斗罗")
        self.setWindowIcon(QIcon('logo.png'))
        self.setGeometry(100, 100, 800, 600)

        self.initStackWeight()
        self.initTabWeight()

    def initStackWeight(self):
        self.stacked_widget = QStackedWidget()
        page1 = QWidget()
        page2 = QWidget()
        label1 = QLabel('这是页面 1')
        label2 = QLabel('这是页面 2')
        page1.layout = QVBoxLayout(page1)
        page2.layout = QVBoxLayout(page2)
        page1.layout.addWidget(label1)
        page2.layout.addWidget(label2)
        self.stacked_widget.addWidget(page1)
        self.stacked_widget.addWidget(page2)
        button1 = QPushButton('显示页面 1')
        button1.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(0))
        button2 = QPushButton('显示页面 2')
        button2.clicked.connect(lambda: self.stacked_widget.setCurrentIndex(1))

        # 显示按钮和堆栈式布局
        mainWindow=QWidget()
        layout = QVBoxLayout()
        layout.addWidget(button1)
        layout.addWidget(button2)
        layout.addWidget(self.stacked_widget)
        mainWindow.setLayout(layout)
        self.setCentralWidget(mainWindow)

    def initTabWeight(self):
        self.tab_widget = QTabWidget()
        print(self.stacked_widget.widget(1).layout.addWidget(self.tab_widget))
        self.page1 = QWidget()
        self.page2 = QWidget()
        self.tab_widget.addTab(self.page1, "页面1")
        self.tab_widget.addTab(self.page2, "页面2")

        layout1 = QVBoxLayout()
        button1 = QPushButton("切换到标签页2")
        button1.clicked.connect(lambda: self.switch_page(2))
        layout1.addWidget(button1)
        self.page1.setLayout(layout1)

        layout2 = QVBoxLayout()
        button2 = QPushButton("切换到标签页1")
        button2.clicked.connect(lambda: self.switch_page(1))
        layout2.addWidget(button2)
        self.page2.setLayout(layout2)

    def switch_page(self, index):
        self.tab_widget.setCurrentIndex(index - 1)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec())
```

<a name="jp5XC"></a>

## 顶部菜单栏实例

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

<a name="OTUGb"></a>

## 多种栏示例

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow,QPushButton,QLabel, QToolBar, QStatusBar, QTabWidget, QVBoxLayout, QWidget
from PyQt6.QtGui import QAction,QIcon

class MyApplication(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        # 创建一个退出动作
        exitAction = QAction('退出', self)
        exitAction.setShortcut('Ctrl+Q')
        exitAction.triggered.connect(self.close)

        # 创建一个新建动作
        newAction = QAction('新建', self)

        # 创建一个打开动作
        openAction = QAction('打开', self)

        # 创建菜单栏
        menubar = self.menuBar()
        fileMenu = menubar.addMenu('文件')
        fileMenu.addAction(newAction)
        fileMenu.addAction(openAction)
        fileMenu.addSeparator()
        fileMenu.addAction(exitAction)

        # 创建工具栏
        toolbar = QToolBar()
        toolbar.addAction(newAction)
        toolbar.addAction(openAction)
        toolbar.addAction(exitAction)
        self.addToolBar(toolbar)

        # 创建状态栏
        statusbar = QStatusBar()
        self.setStatusBar(statusbar)
        statusbar.showMessage('这是状态栏',1000)

        btn=QPushButton('显示消息',self)
        btn.move(100,0)
        # 查看定义类
        btn.clicked.connect(lambda x:statusbar.showMessage('您好~',1000))

        # 创建标签栏
        tab_widget = QTabWidget()
        tab1 = QWidget()
        tab2 = QWidget()
        tab_widget.addTab(tab1, '标签1')
        tab_widget.addTab(tab2, '标签2')
        layout = QVBoxLayout()
        tab1.setLayout(layout)
        layout.addWidget(QWidget())  # 向标签1添加内容
        self.setCentralWidget(tab_widget)

        # 创建侧栏
        sidebar = QToolBar('侧栏')
        sidebar.addWidget(QLabel('这是侧边栏'))  # 向侧栏添加内容
        self.addToolBar(sidebar)

        # 创建工具箱栏
        toolbox = QToolBar('工具箱')
        toolbox.addWidget(QLabel('这是工具箱'))  # 向工具箱添加内容
        self.addToolBar(toolbox)

        # 设置主窗口属性
        self.setGeometry(100, 100, 600, 400)
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    sys.exit(app.exec())
```

<a name="t40e0"></a>

## 左侧菜单控制右侧多页面切换

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QHBoxLayout, QListWidget, QWidget, QStackedWidget,QLabel,QListWidgetItem
from PyQt6.QtGui import QIcon,QAction
from PyQt6.QtCore import Qt

class MyApplication(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('多页面切换示例')

        # 创建一个主窗口部件
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # 创建左侧导航栏
        nav_list = QListWidget()

        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/game.svg'),'游戏'))
        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/login.png'),'登录'))
        nav_list.addItem(QListWidgetItem(QIcon('./assets/imgs/icons/setting.png'),'设置'))
        nav_list.setFixedWidth(100)
        # nav_list.setViewMode(QListWidget.IconMode)
        nav_list.currentItemChanged.connect(self.switchPage)

        # 创建右侧多页面容器
        page_container = QStackedWidget()
        page1 = QWidget()
        QLabel('这是页面 1',page1)
        page1.setWindowTitle('页面 1')
        page2 = QWidget()
        page2.setWindowTitle('页面 2')
        QLabel('这是页面 2',page2)
        page_container.addWidget(page1)
        page_container.addWidget(page2)
        # page_container.setFixedWidth(500)

        # 创建布局管理器
        layout = QHBoxLayout()
        layout.addWidget(nav_list)
        layout.addWidget(page_container)

        central_widget.setLayout(layout)

    def switchPage(self, current, previous):
        if current:
            selected_index = self.centralWidget().layout().itemAt(0).widget().currentRow()
            self.centralWidget().layout().itemAt(1).widget().setCurrentIndex(selected_index)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    ex.show()
    sys.exit(app.exec())
```

<a name="Q2ANu"></a>

## pyqt6中如何实现多页面切换？

在 PyQt6 中实现多页面切换通常有多种方法，其中两种主要方法是使用 `QStackedWidget` 和 `QTabWidget`。以下是如何使用这两种方法实现多页面切换的总结：

1.  **使用 QStackedWidget**： 
    - 创建一个 `QStackedWidget` 对象来托管多个页面。
    - 为每个页面创建一个独立的 `QWidget` 子类，包括该页面的内容和控件。
    - 使用 `addWidget` 方法将这些页面部件添加到 `QStackedWidget` 中，每个页面都有一个索引。
    - 使用 `setCurrentIndex` 方法切换页面，通过指定页面的索引。
    - 适用于需要程序控制多页面切换的情况。

示例代码： 

```python
stacked_widget = QStackedWidget()
page1 = QWidget()
page2 = QWidget()
stacked_widget.addWidget(page1)
stacked_widget.addWidget(page2)
stacked_widget.setCurrentIndex(0)  # 切换到第一个页面
```

2.  **使用 QTabWidget**： 
    - 创建一个 `QTabWidget` 对象，它提供了选项卡式的多页面切换。
    - 为每个标签页创建一个独立的 `QWidget` 子类，包括页面的内容和控件。
    - 使用 `addTab` 方法将这些页面部件添加到 `QTabWidget`，同时指定标签页的标题。
    - 用户可以通过点击标签页来切换页面。
    - 适用于以选项卡形式显示多个页面的情况。

示例代码： 

```python
tab_widget = QTabWidget()
tab1 = QWidget()
tab2 = QWidget()
tab_widget.addTab(tab1, "页面 1")
tab_widget.addTab(tab2, "页面 2")
```

根据您的项目需求和个人喜好，您可以选择使用其中一种或两种方法来实现多页面切换。无论您选择哪种方法，都可以根据需要自定义和扩展页面的内容。

<a name="jgoIg"></a>

## QTabweight与Qstackweight的区别

在 PyQt 中，`QTabWidget` 和 `QStackedWidget` 是用于处理多页面（或多视图）的两个不同的部件。它们有一些区别，主要在于它们的设计和用途。
<a name="c731f18f"></a>

### QTabWidget:

1. **标签页式布局：** `QTabWidget` 提供了一个标签页式的用户界面，允许用户通过选项卡（标签页）来切换不同的页面。
2. **导航和可见性：** 用户可以通过点击选项卡切换页面。每个选项卡上通常有一个相关的标题，并且用户可以通过点击标题来选择相应的页面。
3. **集成标签栏：** `QTabWidget` 自动提供了一个标签栏，用于容纳选项卡。标签栏通常位于部件的顶部。
4. **适用于多个页面场景：** 当您有一组相关的页面，希望以标签页的形式进行切换时，`QTabWidget` 是一个很好的选择。

```python
from PyQt6.QtWidgets import QApplication, QWidget, QTabWidget, QVBoxLayout, QLabel

app = QApplication([])

# 创建 QTabWidget
tab_widget = QTabWidget()

# 添加标签页
tab_page1 = QWidget()
label1 = QLabel('这是标签页 1')
tab_page1.layout = QVBoxLayout(tab_page1)
tab_page1.layout.addWidget(label1)
tab_page1.setLayout(tab_page1.layout)
tab_widget.addTab(tab_page1, '标签页 1')

tab_page2 = QWidget()
label2 = QLabel('这是标签页 2')
tab_page2.layout = QVBoxLayout(tab_page2)
tab_page2.layout.addWidget(label2)
tab_page2.setLayout(tab_page2.layout)
tab_widget.addTab(tab_page2, '标签页 2')

tab_widget.show()
app.exec()
```

<a name="416b9391"></a>

### QStackedWidget:

1. **堆栈式布局：** `QStackedWidget` 提供了一个堆栈式的用户界面，允许用户通过推入和弹出页面来切换。
2. **程序控制切换：** 切换页面通常是由程序控制的，而不是用户通过点击标签页来触发的。
3. **没有集成标签栏：** `QStackedWidget` 不提供内置的标签栏。相反，您需要使用其他部件（例如按钮、菜单）来触发页面切换。
4. **适用于单个页面显示：** 当您有多个页面，但同一时间只显示其中一个页面时，`QStackedWidget` 是一个很好的选择。

```python
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton, QStackedWidget

app = QApplication([])

# 创建 QStackedWidget
stacked_widget = QStackedWidget()

# 添加页面
page1 = QWidget()
label1 = QLabel('这是页面 1')
page1.layout = QVBoxLayout(page1)
page1.layout.addWidget(label1)
page1.setLayout(page1.layout)
stacked_widget.addWidget(page1)

page2 = QWidget()
label2 = QLabel('这是页面 2')
page2.layout = QVBoxLayout(page2)
page2.layout.addWidget(label2)
page2.setLayout(page2.layout)
stacked_widget.addWidget(page2)

# 创建按钮用于切换页面
button1 = QPushButton('显示页面 1')
button1.clicked.connect(lambda: stacked_widget.setCurrentIndex(0))

button2 = QPushButton('显示页面 2')
button2.clicked.connect(lambda: stacked_widget.setCurrentIndex(1))

# 显示按钮和堆栈式布局
layout = QVBoxLayout()
layout.addWidget(button1)
layout.addWidget(button2)
layout.addWidget(stacked_widget)

# 设置堆栈式布局为窗口布局
window = QWidget()
window.setLayout(layout)
window.show()

app.exec()
```

总体而言，`QTabWidget` 适用于标签页式导航，而 `QStackedWidget` 适用于以堆栈形式切换页面的场景。您可以根据具体需求选择使用哪一个。
<a name="Ft5dc"></a>

## Qframe与Qweight的区别

在 PyQt 中，`QFrame` 和 `QWidget` 是两个不同的类，它们用于创建界面上的可视化组件，但有一些区别。

1. `**QFrame**`** 类：** 
   - `QFrame` 是 `QWidget` 的子类，因此 `QFrame` 可以包含在其他 `QWidget` 内或作为 `QMainWindow` 的中心部件。
   - `QFrame` 是一个简单的容器，通常用于包含其他小部件或进行布局管理。
   - `QFrame` 通常用于创建矩形框架，比如创建边框、背景或者一些特殊的辅助图形元素。

```python
from PyQt6.QtWidgets import QFrame
frame = QFrame()
```

2. `**QWidget**`** 类：** 
   - `QWidget` 是一个通用的用户界面对象，也是 `QFrame` 的基类。
   - `QWidget` 通常用于创建应用程序的主窗口或作为主窗口中的中心部件。
   - 与 `QFrame` 相比，`QWidget` 是更通用的界面元素，可以包含其他小部件，并提供更多的功能。

```python
from PyQt6.QtWidgets import QWidget
widget = QWidget()
```

总的来说，`QFrame` 更专注于创建框架和辅助图形，而 `QWidget` 是一个更通用的界面元素，可以包含其他小部件并提供更广泛的功能。在实际使用中，你可以根据需求选择使用 `QWidget` 或 `QFrame`。
<a name="DCaPy"></a>

## 先显示登陆页面，登陆成功后显示主页面

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QPushButton, QLabel
from PyQt6 import QtCore
from PyQt6.QtGui import QIcon

class LoginWindow(QWidget):
    loginSuccessSignal = QtCore.pyqtSignal()  # 登录成功的信号

    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        layout = QVBoxLayout(self)

        self.username_input = QLineEdit(self)
        self.password_input = QLineEdit(self)
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)

        login_button = QPushButton('Login', self)
        login_button.clicked.connect(self.login)

        layout.addWidget(QLabel('Username:'))
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel('Password:'))
        layout.addWidget(self.password_input)
        layout.addWidget(login_button)

        self.setGeometry(300, 300, 400, 200)
        self.setWindowTitle('Login Window')

    def login(self):
        # 在实际应用中，这里应该有登录验证的逻辑
        # 这里简化为判断用户名和密码是否为正确
        if self.username_input.text() == '1' and self.password_input.text() == '1':
            self.loginSuccessSignal.emit()  # 发送登录成功信号
            self.close()

class YourMainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.login_window = LoginWindow()
        self.login_window.loginSuccessSignal.connect(self.showMainWindow)

    def showMainWindow(self):
        self.setGeometry(300, 300, 400, 200)
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)

    main_window = YourMainWindow()
    main_window.login_window.show()

    sys.exit(app.exec())
```

<a name="qlBHE"></a>

## 窗口渐显与渐隐

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

<a name="xuigX"></a>

## 窗口居中变大出现

我最开始想的是从小变到大，绘制之后再不断调用居中函数，最后发现窗口在左上角和中间不断闪动，于是我认真思考了一下想到了其实可以计算出初始状态和末状态的位置大小信息。<br />如何查看QPropertyAnimation类的方法以及信号。<br />可以优化一下出场，免去最开始的闪烁一下。

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        # self.setGeometry(300, 300, 200, 100)
        self.setWindowTitle('变大窗口')
        self.scaleIn()

    def scaleIn(self):
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(100,100,0,0))
        self.animation.setEndValue(QRect(100,100,200,300))
        self.animation.setDuration(1000)
        self.animation.valueChanged.connect(self.center)
        self.animation.setEasingCurve(QEasingCurve.Type.OutQuad)  # Use QEasingCurve.Type.OutQuad
        self.animation.start()
    
    def center(self):
        self.hide()
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(0, 0, 800, 600)
        self.setWindowTitle('变大窗口')
        self.center()
        self.scaleIn()

    def scaleIn(self):
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr=self.frameGeometry()
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(cp.x(),cp.y(),0,0))
        self.animation.setEndValue(qr)
        self.animation.setDuration(1000)
        # self.animation.setDuration(3000)
        self.animation.setEasingCurve(QEasingCurve.Type.Linear)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutQuint)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutBack)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutElastic)
        self.animation.start()
    
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
from PyQt6.QtCore import QPropertyAnimation, QEasingCurve,QRect
from PyQt6.QtGui import QGuiApplication

class ScaleWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setWindowTitle('变大窗口')
        self.scaleIn()

    def scaleIn(self):
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr=self.center()
        self.animation = QPropertyAnimation(self, b"geometry")
        self.animation.setStartValue(QRect(cp.x(),cp.y(),0,0))
        self.animation.setEndValue(qr)
        self.animation.setDuration(1000)
        # self.animation.setDuration(3000)
        self.animation.setEasingCurve(QEasingCurve.Type.Linear)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutQuint)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutBack)
        # self.animation.setEasingCurve(QEasingCurve.Type.OutElastic)
        self.animation.start()
    
    def center(self):
        qr=QRect(0, 0, 800, 600)
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        return qr

if __name__ == '__main__':
    app = QApplication(sys.argv)

    scale_window = ScaleWindow()
    scale_window.show()

    sys.exit(app.exec())
```

<a name="rRQFK"></a>

## 最小化窗口到托盘，右键菜单，窗口恢复

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

<a name="sHlFP"></a>

## 背景运动及模糊滤镜

> Steam登陆界面复现-PyQt6-Python-运动背景图三种实现方式

最开始使用的是重写paintEvent方法，但是后来发现加上模糊的时候窗口内容也模糊了。使用QLabel堆叠实现背景就不会造成窗口内容也模糊了。

```python
import sys
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPainter, QPixmap
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget,QGraphicsBlurEffect,QLabel

class MovingBackgroundWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setGeometry(100, 100, 800, 600)
        self.initBg()
        self.initUI()

    def initUI(self):
        label = QLabel('啊哈哈哈哈哈', self)
        label.setGeometry(100, 100, 100, 30)

    def initBg(self):
        # 设置背景图片
        self.background_pixmap = QPixmap("bg.jpg")
        # 暂存当前现实背景图片
        self.background_pixmap_tmp=QPixmap("bg.jpg")
        self.tmp_x=0
        self.tmp_y=0
        # 设置定时器，每隔一段时间触发重绘事件
        self.bg_timer = QTimer(self)
        self.bg_timer.timeout.connect(self.update_background)
        self.bg_timer.start(50)  # 调整移动速度，单位为毫秒
        # 添加毛玻璃模糊滤镜
        blur_effect = QGraphicsBlurEffect()
        blur_effect.setBlurRadius(10)
        self.setGraphicsEffect(blur_effect)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.drawPixmap(0, 0, self.background_pixmap_tmp)

    def update_background(self):
        self.tmp_x+=2
        self.tmp_y+=1
        self.background_pixmap_tmp = self.background_pixmap.copy(self.tmp_x, self.tmp_y,self.background_pixmap.width()-self.tmp_x, self.background_pixmap.height()-self.tmp_y)
        # 强制重绘
        self.update()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    widget = MovingBackgroundWidget()
    
    # 将 widget 设置为主窗口的中央部件
    main_window = QMainWindow()
    main_window.setCentralWidget(widget)

    main_window.setGeometry(100, 100, 800, 600)
    main_window.show()

    sys.exit(app.exec())
```

```python
import sys
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPainter, QPixmap,QFont
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget,QLabel,
    QGraphicsBlurEffect
    ,QHBoxLayout,QVBoxLayout)
from PyQt6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QHBoxLayout, QGridLayout, QCheckBox, QGraphicsOpacityEffect
from PyQt6.QtCore import Qt, QRect, QPropertyAnimation, QParallelAnimationGroup,QSize
from PyQt6.QtGui import QPixmap, QMovie
class LoginWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setFixedSize(880,550)
        self.setWindowFlag(Qt.WindowType.FramelessWindowHint,True)
        # self.initStyle()
        self.initBg()
        self.initUI()

    def initUI(self):
        # 创建布局和部件
        main_layout = QVBoxLayout(self)
        close_layout = QHBoxLayout()
        top_layout = QHBoxLayout()
        center_layout = QVBoxLayout()
        bottom_layout=QHBoxLayout()

        logo_label = QLabel(self)
        logo_pixmap = QPixmap("logo.png").scaled(70,70)
        logo_label.setPixmap(logo_pixmap)
        logo_label.setAlignment(Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignLeft)

        software_label = QLabel("派森斗罗", self)
        software_label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)
        software_label.setStyleSheet("font-size: 20px; font-weight: bold; color: white;")

        close_button = QPushButton("×", self)
        close_button.setFixedSize(50,50)
        close_button.setStyleSheet("QPushButton {background-color: rgba(0, 0, 0, 0); color: #616F77;font-size:25px;}\
                                   QPushButton:hover {background-color: #E22A27; color: white;}")
        close_button.clicked.connect(self.close)

        username_label = QLabel("账号:", self)
        password_label = QLabel("密码:", self)
        username_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")
        password_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")

        username_input = QLineEdit(self)
        password_input = QLineEdit(self)
        username_input.setFixedSize(180,30)
        password_input.setFixedSize(180,30)
        username_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(0, 0, 0, 100);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 50);}")

        password_input.setEchoMode(QLineEdit.EchoMode.Password)
        password_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(0, 0, 0, 100);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 50);}")

        remember_me_checkbox = QCheckBox("记住密码", self)
        remember_me_checkbox.setStyleSheet("color:white;")

        login_button = QPushButton("登录", self)
        login_button.setFixedSize(100,25)
        login_button.setStyleSheet("QPushButton{border:0;color:white;background-color:rgba(0, 0, 255, 150);font-weight:bold;}\
                                     QPushButton:hover{background-color:rgba(0, 0, 255, 80);}")
        login_button.clicked.connect(lambda x:print('登录'))

        register_label = QLabel("还没有账号?  ", self)
        register_label.setStyleSheet("color:white;")
        register_button = QPushButton("去注册", self)
        font=register_button.font()
        font.setUnderline(True)
        register_button.setFont(font)
        register_button.setStyleSheet("border:0;color:white;")

        register_button.clicked.connect(lambda x:print('注册'))

        # 添加部件到布局
        close_layout.addStretch(1)
        close_layout.addWidget(close_button)

        top_layout.addWidget(logo_label)
        top_layout.addWidget(software_label)
        top_layout.addStretch(1)

        center_layout.addWidget(username_label)
        center_layout.addWidget(username_input)
        center_layout.addWidget(password_label)
        center_layout.addWidget(password_input)
        center_layout.addWidget(remember_me_checkbox)
        center_layout.addWidget(login_button, alignment=Qt.AlignmentFlag.AlignCenter)
        center_layout.setAlignment(Qt.AlignmentFlag.AlignHCenter|Qt.AlignmentFlag.AlignVCenter)

        bottom_layout.addStretch(10)
        bottom_layout.addWidget(register_label)
        bottom_layout.addWidget(register_button)
        bottom_layout.addStretch(1)

        main_layout.addLayout(close_layout)
        main_layout.addLayout(top_layout)
        main_layout.addStretch(1)
        main_layout.addLayout(center_layout)
        main_layout.addStretch(5)
        main_layout.addLayout(bottom_layout)
        main_layout.addStretch(3)

    def mousePressEvent(self, event):
        # 鼠标按压
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)

    def mouseMoveEvent(self, event):
        # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
        if self.dragging:
            self.move(self.mapToGlobal(event.pos()) - self.dis)

    def mouseReleaseEvent(self, event):
        # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
        if event.button() == Qt.MouseButton.LeftButton and self.dragging:
            self.dragging = False
            self.setCursor(Qt.CursorShape.OpenHandCursor)
        
    def initStyle(self):
        self.font=QFont('./assets/fonts/1.ttf')
        self.font.setPointSize(32)
        self.font.setBold(True)
        self.font.setStyle(QFont.Style.StyleNormal)

    def initBg(self):
        self.bg_label=QLabel(self)
        # 设置背景图片
        self.background_pixmap = QPixmap("bg1.jpg").scaled(880+500,550+250)
        # 暂存当前现实背景图片
        self.background_pixmap_tmp=QPixmap("bg1.jpg")
        self.tmp_x=0
        self.tmp_y=0
        self.dx=2
        self.dy=1
        # 设置定时器，每隔一段时间触发重绘事件
        self.bg_timer = QTimer(self)
        self.bg_timer.timeout.connect(self.update_background)
        self.bg_timer.start(50)  # 调整移动速度，单位为毫秒
        # 添加毛玻璃模糊滤镜
        blur_effect = QGraphicsBlurEffect()
        blur_effect.setBlurRadius(20)
        self.bg_label.setGraphicsEffect(blur_effect)

    def update_background(self):
        self.bg_label.setGeometry(self.rect())
        self.bg_label.setPixmap(self.background_pixmap_tmp)
        if self.tmp_x<0 or self.tmp_x>self.background_pixmap.width()-880:
            self.dx,self.dy=-self.dx,-self.dy
        self.tmp_x+=self.dx
        self.tmp_y+=self.dy
        self.background_pixmap_tmp = self.background_pixmap.copy(self.tmp_x,self.background_pixmap.height()-550-self.tmp_y,880,550)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    widget = LoginWidget()
    widget.show()
    sys.exit(app.exec())
```

```python
from PyQt6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QHBoxLayout, QGridLayout, QCheckBox, QGraphicsOpacityEffect
from PyQt6.QtCore import Qt, QRect, QPropertyAnimation, QParallelAnimationGroup,QSize
from PyQt6.QtGui import QPixmap, QMovie
class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Login")        
        self.initBg()
        self.initUI()

    def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            print(self.mapToGlobal(event.pos()),event.pos(),self.pos(),self.dis)
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
    def mouseMoveEvent(self, event):
        # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
        if self.dragging:
            # self.move(event.pos()-self.dis)
            self.move(self.mapToGlobal(event.pos()) - self.dis)
    def mouseReleaseEvent(self, event):
        # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
        if event.button() == Qt.MouseButton.LeftButton and self.dragging:
            self.dragging = False
            self.setCursor(Qt.CursorShape.OpenHandCursor)

    def initBg(self):
        # 设置背景图片
        self.setFixedSize(880, 550)
        background_label = QLabel(self)
        background_label.setGeometry(self.rect())
        movie = QMovie("./assets/imgs/bg/bg.gif")
        movie.setScaledSize(QSize(880,550))
        background_label.setMovie(movie)
        movie.start()

    def initUI(self):
        self.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        # 创建布局和部件
        main_layout = QVBoxLayout(self)
        close_layout = QHBoxLayout()
        top_layout = QHBoxLayout()
        center_layout = QVBoxLayout()
        bottom_layout=QHBoxLayout()

        logo_label = QLabel(self)
        logo_pixmap = QPixmap("logo.png").scaled(70,70)
        logo_label.setPixmap(logo_pixmap)
        logo_label.setAlignment(Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignLeft)

        software_label = QLabel("派森斗罗", self)
        software_label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)
        software_label.setStyleSheet("font-size: 20px; font-weight: bold; color: white;")

        close_button = QPushButton("×", self)
        close_button.setFixedSize(50,50)
        close_button.setStyleSheet("QPushButton {background-color: rgba(0, 0, 0, 0); color: #616F77;font-size:25px;}\
                                   QPushButton:hover {background-color: #E22A27; color: white;}")
        close_button.clicked.connect(self.close)

        username_label = QLabel("账号:", self)
        password_label = QLabel("密码:", self)
        username_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")
        password_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")

        username_input = QLineEdit(self)
        password_input = QLineEdit(self)
        username_input.setFixedSize(180,30)
        password_input.setFixedSize(180,30)
        username_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(0, 0, 0, 100);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 50);}")

        password_input.setEchoMode(QLineEdit.EchoMode.Password)
        password_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(0, 0, 0, 100);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 50);}")

        remember_me_checkbox = QCheckBox("记住密码", self)
        remember_me_checkbox.setStyleSheet("color:white;")

        login_button = QPushButton("登录", self)
        login_button.setFixedSize(100,25)
        login_button.setStyleSheet("QPushButton{border:0;color:white;background-color:rgba(0, 0, 255, 150);font-weight:bold;}\
                                     QPushButton:hover{background-color:rgba(0, 0, 255, 80);}")
        login_button.clicked.connect(lambda x:print('登录'))

        register_label = QLabel("还没有账号?  ", self)
        register_label.setStyleSheet("color:white;")
        register_button = QPushButton("去注册", self)
        font=register_button.font()
        font.setUnderline(True)
        register_button.setFont(font)
        register_button.setStyleSheet("border:0;color:white;")

        register_button.clicked.connect(lambda x:print('注册'))

        # 添加部件到布局
        close_layout.addStretch(1)
        close_layout.addWidget(close_button)

        top_layout.addWidget(logo_label)
        top_layout.addWidget(software_label)
        top_layout.addStretch(1)

        center_layout.addWidget(username_label)
        center_layout.addWidget(username_input)
        center_layout.addWidget(password_label)
        center_layout.addWidget(password_input)
        center_layout.addWidget(remember_me_checkbox)
        center_layout.addWidget(login_button, alignment=Qt.AlignmentFlag.AlignCenter)
        center_layout.setAlignment(Qt.AlignmentFlag.AlignHCenter|Qt.AlignmentFlag.AlignVCenter)

        bottom_layout.addStretch(10)
        bottom_layout.addWidget(register_label)
        bottom_layout.addWidget(register_button)
        bottom_layout.addStretch(1)

        main_layout.addLayout(close_layout)
        main_layout.addLayout(top_layout)
        main_layout.addStretch(1)
        main_layout.addLayout(center_layout)
        main_layout.addStretch(5)
        main_layout.addLayout(bottom_layout)
        main_layout.addStretch(3)

if __name__ == '__main__':
    app = QApplication([])
    login_window = LoginWindow()
    login_window.show()
    app.exec()
```

<a name="LiTPU"></a>

## 窗口自定义拖拽功能

```python
def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            print(self.mapToGlobal(event.pos()),event.pos(),self.pos(),self.dis)
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
def mouseMoveEvent(self, event):
    # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
    if self.dragging:
        # self.move(event.pos()-self.dis)
        self.move(self.mapToGlobal(event.pos()) - self.dis)
def mouseReleaseEvent(self, event):
    # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
    if event.button() == Qt.MouseButton.LeftButton and self.dragging:
        self.dragging = False
        self.setCursor(Qt.CursorShape.OpenHandCursor)
```

```python
import sys
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtGui import QScreen, QGuiApplication,QIcon
from PyQt6.QtCore import Qt, QRect, QPropertyAnimation, QParallelAnimationGroup,QSize
class MyApplication(QWidget):
    def __init__(self):
        super().__init__()

        self.initUI()
    def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            print(self.mapToGlobal(event.pos()),event.pos(),self.pos(),self.dis)
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
    def mouseMoveEvent(self, event):
        # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
        if self.dragging:
            # self.move(event.pos()-self.dis)
            self.move(self.mapToGlobal(event.pos()) - self.dis)
    def mouseReleaseEvent(self, event):
        # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
        if event.button() == Qt.MouseButton.LeftButton and self.dragging:
            self.dragging = False
            self.setCursor(Qt.CursorShape.OpenHandCursor)

    def initUI(self):
        self.setGeometry(0, 0, 300, 200)  # Set window size
        self.setWindowTitle('派森斗罗')
        self.setWindowIcon(QIcon('logo.png'))

        self.center()  # Center the window on the screen
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApplication()
    ex.show()
    sys.exit(app.exec())
```

<a name="zoCzu"></a>

## 窗口双击更换背景

```python
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

class LoginWindow(QWidget):
    loginSuccessSignal = pyqtSignal()  # 登录成功的信号

    def __init__(self):
        super().__init__()
        self.configSize=(880,550)
        self.configBg=['bg.gif','bg1.gif','bg2.gif','bg3.gif','bg4.gif','bg5.gif',]

        self.initBg()
        self.initUI()
        self.center()
        self.fadeIn()

    def changeBg(self):
        movie_path='./assets/imgs/bg/'+self.configBg[
        (self.configBg.index(
            self.background_label.movie().fileName().split('/')[-1]
        )+1)
        %len(self.configBg)
        ]
        print(movie_path)
        movie=QMovie(movie_path)
        self.background_label.setMovie(movie)
        movie.setScaledSize(QSize(*self.configSize))
        movie.start()

    def mouseDoubleClickEvent(self,event):
        self.changeBg()
    def initBg(self):
        # 设置窗口无框架，设置大小
        self.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        self.setFixedSize(*self.configSize)
        # 设置背景
        self.background_label = QLabel(self)
        self.background_label.setGeometry(self.rect())
        movie = QMovie('./assets/imgs/bg/'+self.configBg[0])
        # movie = QMovie("bg.gif")
        movie.setScaledSize(QSize(*self.configSize))
        self.background_label.setMovie(movie)
        movie.start()

    def mousePressEvent(self, event):
        # 鼠标按压，判断是否是鼠标左键并且点击点在窗口内
        if event.button() == Qt.MouseButton.LeftButton and self.geometry().contains(self.mapToGlobal(event.pos())):
            self.dis = self.mapToGlobal(event.pos()) - self.pos()
            self.dragging = True
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
    def mouseMoveEvent(self, event):
        # 鼠标移动的时候判断是否是拖拽状态，如果是的话就移动窗口
        if self.dragging:
            self.move(self.mapToGlobal(event.pos()) - self.dis)
    def mouseReleaseEvent(self, event):
        # 鼠标释放的时候接触拖拽状态并且改变鼠标样式
        if event.button() == Qt.MouseButton.LeftButton and self.dragging:
            self.dragging = False
            self.setCursor(Qt.CursorShape.OpenHandCursor)

    def initUI(self):
        # 创建布局和部件
        main_layout = QVBoxLayout(self)
        close_layout = QHBoxLayout()
        top_layout = QHBoxLayout()
        center_layout = QVBoxLayout()
        bottom_layout=QHBoxLayout()

        logo_label = QLabel(self)
        logo_pixmap = QPixmap("logo.png").scaled(70,70)
        logo_label.setPixmap(logo_pixmap)
        logo_label.setAlignment(Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignLeft)

        software_label = QLabel("派森斗罗", self)
        software_label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)
        software_label.setStyleSheet("font-size: 20px; font-weight: bold; color: white;")

        close_button = QPushButton("×", self)
        close_button.setFixedSize(50,50)
        close_button.setStyleSheet("QPushButton {background-color: rgba(0, 0, 0, 0); color: #616F77;font-size:25px;}\
                                   QPushButton:hover {background-color: #E22A27; color: white;}")
        close_button.clicked.connect(self.close)

        username_label = QLabel("账号:", self)
        password_label = QLabel("密码:", self)
        username_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")
        password_label.setStyleSheet("color:white;font-weight:bold;font-size:15px;")

        username_input = QLineEdit(self)
        password_input = QLineEdit(self)
        username_input.setFixedSize(180,30)
        password_input.setFixedSize(180,30)
        username_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(80,100,100,150);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 100);}")

        password_input.setEchoMode(QLineEdit.EchoMode.Password)
        password_input.setStyleSheet("QLineEdit{border:0;background-color:rgba(80,100,100,150);padding:5px;color:white;font-weight:bold;}\
                                     QLineEdit:hover{background-color:rgba(0, 0, 0, 100);}")

        remember_me_checkbox = QCheckBox("记住密码", self)
        remember_me_checkbox.setStyleSheet("color:white;")

        login_button = QPushButton("登录", self)
        login_button.setFixedSize(100,25)
        login_button.setStyleSheet("QPushButton{border:0;color:white;background-color:rgba(0, 0, 255, 150);font-weight:bold;}\
                                     QPushButton:hover{background-color:rgba(0, 0, 255, 80);}")
        login_button.clicked.connect(self.login)
        # login_button.clicked.connect(lambda x:print('登录'))

        register_label = QLabel("还没有账号?  ", self)
        register_label.setStyleSheet("color:white;")
        register_button = QPushButton("去注册", self)
        font=register_button.font()
        font.setUnderline(True)
        register_button.setFont(font)
        register_button.setStyleSheet("border:0;color:white;")

        register_button.clicked.connect(lambda x:print('注册'))

        # 添加部件到布局
        close_layout.addStretch(1)
        close_layout.addWidget(close_button)

        top_layout.addWidget(logo_label)
        top_layout.addWidget(software_label)
        top_layout.addStretch(1)

        center_layout.addWidget(username_label)
        center_layout.addWidget(username_input)
        center_layout.addWidget(password_label)
        center_layout.addWidget(password_input)
        center_layout.addWidget(remember_me_checkbox)
        center_layout.addWidget(login_button, alignment=Qt.AlignmentFlag.AlignCenter)
        center_layout.setAlignment(Qt.AlignmentFlag.AlignHCenter|Qt.AlignmentFlag.AlignVCenter)

        bottom_layout.addStretch(10)
        bottom_layout.addWidget(register_label)
        bottom_layout.addWidget(register_button)
        bottom_layout.addStretch(1)

        main_layout.addLayout(close_layout)
        main_layout.addLayout(top_layout)
        main_layout.addStretch(1)
        main_layout.addLayout(center_layout)
        main_layout.addStretch(5)
        main_layout.addLayout(bottom_layout)
        main_layout.addStretch(3)

        self.setWindowOpacity(0.0)

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
        self.animation.finished.connect(self.quit)
        self.animation.start()
    
    def quit(self):
        self.loginSuccessSignal.emit()  # 发送登录成功信号
        self.close()
    
    def center(self):
        qr=self.frameGeometry()
        cp=QGuiApplication.primaryScreen().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

    def login(self):
        self.fadeOut()
        # if self.username_input.text() == '1' and self.password_input.text() == '1':
        #     self.fadeOut()
```

<a name="keSHN"></a>

## 多软件图标排布

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

<a name="oirtU"></a>

## 点击按钮打开新页面

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

<a name="V8cgO"></a>

## 窗口中画一个框

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget
from PyQt6.QtGui import QPainter, QBrush, QPen
from PyQt6.QtCore import Qt, QRect, QPoint


class DrawingApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('Draw Rectangle')

        self.canvas = DrawingCanvas(self)
        self.setCentralWidget(self.canvas)

        self.show()


class DrawingCanvas(QWidget):
    def __init__(self, parent):
        super().__init__(parent)
        self.setGeometry(0, 0, parent.width(), parent.height())

        self.origin = QPoint(0, 0)  # 初始化为 (0, 0)
        self.end = QPoint(0, 0)     # 初始化为 (0, 0)

    def paintEvent(self, event):
        painter = QPainter(self)
        # 设置绘制选项，启用抗锯齿。
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        rect = QRect(self.origin, self.end)
        painter.drawRect(rect)

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.origin = event.pos()
            self.end = event.pos()

    def mouseMoveEvent(self, event):
        if event.buttons() & Qt.MouseButton.LeftButton:
            self.end = event.pos()
            self.update()

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.end = event.pos()
            self.update()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = DrawingApp()
    sys.exit(app.exec())
```

<a name="nvZrP"></a>

## 介绍一下QGraphicsScene和QGraphicsView

`QGraphicsScene` 和 `QGraphicsView` 是 PyQt 中用于创建图形用户界面的两个关键类，它们一起协同工作，提供了一种灵活的图形表示方法。以下是它们的主要介绍：
<a name="QGraphicsScene"></a>

### QGraphicsScene

`QGraphicsScene` 是一个二维图形场景，它允许你在其中添加、移动和交互多个 2D 图形项（`QGraphicsItem`）。图形项可以是简单的图形元素，如矩形、椭圆和文本，也可以是自定义的图形元素。`QGraphicsScene` 提供了以下主要功能：

1.  **管理图形项：** `QGraphicsScene` 维护了一个图形项的列表，你可以在其中添加、移除和操纵图形项。 
2.  **场景坐标系：** 每个图形项都有自己的局部坐标系，而 `QGraphicsScene` 提供了一个全局坐标系，使你能够在场景中的不同图形项之间执行坐标转换。 
3.  **事件处理：** `QGraphicsScene` 可以接收鼠标、键盘和其他事件，你可以通过重写相应的事件处理方法来响应这些事件。 
4.  **图形项选择：** 你可以选择一个或多个图形项，执行相应的操作，比如拖动、删除等。 
    <a name="QGraphicsView"></a>

### QGraphicsView

`QGraphicsView` 是用于在窗口中显示 `QGraphicsScene` 的视图类。它提供了以下主要功能：

1.  **显示场景：** `QGraphicsView` 提供一个用于显示 `QGraphicsScene` 内容的视图窗口。你可以在一个窗口中显示多个 `QGraphicsView`，每个视图显示同一个或不同的场景。 
2.  **视图变换：** 通过视图变换，你可以对场景进行平移、缩放、旋转等操作。这使得你可以轻松地实现图形的缩放和平移效果。 
3.  **视图更新：** 当场景中的图形项发生变化时，`QGraphicsView` 负责更新视图，以便反映这些变化。 
4.  **事件转发：** `QGraphicsView` 接收鼠标、键盘等事件，并将它们传递给场景中的图形项进行处理。 
5.  **交互支持：** `QGraphicsView` 提供了一些方便的方法来支持用户的交互，比如启用鼠标拖拽、缩放等。 

通过将 `QGraphicsScene` 和 `QGraphicsView` 结合使用，你可以创建出富有交互性的图形界面，用于显示和操作图形元素。这对于图形编辑器、CAD 应用、数据可视化等领域非常有用。

<a name="eR4tU"></a>

## 图片浏览，可以放大缩小拖拽

```python
import sys
from PyQt6.QtWidgets import QApplication, QGraphicsView, QGraphicsScene, QGraphicsPixmapItem, QMainWindow
from PyQt6.QtCore import Qt, QPointF
from PyQt6.QtGui import QPixmap, QWheelEvent, QPainter


class ImageViewer(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('Image Viewer')

        self.scene = QGraphicsScene(self)
        self.view = GraphicsView(self.scene, self)
        self.setCentralWidget(self.view)

        # Load an example image
        image_path = 'letter.png'  # Replace with the actual path to your image
        pixmap = QPixmap(image_path)
        item = QGraphicsPixmapItem(pixmap)
        self.scene.addItem(item)

        self.show()


class GraphicsView(QGraphicsView):
    def __init__(self, scene, parent):
        super().__init__(scene, parent)
        self.setRenderHint(QPainter.RenderHint.Antialiasing, True)
        self.setStyleSheet('GraphicsView{background-color:#FDF6E3;}')

        self.setDragMode(QGraphicsView.DragMode.ScrollHandDrag)  # Enable hand-drag mode

    def wheelEvent(self, event: QWheelEvent):
        modifiers = event.modifiers()
        if modifiers == Qt.KeyboardModifier.ControlModifier:
            # Zoom only if Ctrl key is pressed
            factor = 1.2  # Zoom factor
            if event.angleDelta().y() < 0:
                factor = 1.0 / factor  # Zoom out for a negative wheel event

            self.scale(factor, factor)

def main():
    app = QApplication(sys.argv)
    viewer = ImageViewer()
    sys.exit(app.exec())


if __name__ == '__main__':
    main()
```

<a name="f1EX6"></a>

## 图片浏览，ctrl+滚轮放大缩小，左键按压拖拽，右键按压画框，框显示坐标信息

```python
import sys
from PyQt6.QtWidgets import QApplication, QGraphicsView, QGraphicsScene, QGraphicsPixmapItem, QGraphicsRectItem, QMainWindow, QGraphicsTextItem
from PyQt6.QtCore import Qt, QRectF
from PyQt6.QtGui import QPixmap, QPainter, QFont

class ImageViewer(QMainWindow):
    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 800, 600)
        self.setWindowTitle('Image Viewer')

        self.scene = QGraphicsScene(self)
        self.view = GraphicsView(self.scene, self)
        self.setCentralWidget(self.view)

        # Load an example image
        image_path = 'letter.png'  # Replace with the actual path to your image
        pixmap = QPixmap(image_path)
        item = QGraphicsPixmapItem(pixmap)
        self.scene.addItem(item)

        self.show()

class GraphicsView(QGraphicsView):
    def __init__(self, scene, parent):
        super().__init__(scene, parent)
        
        self.setStyleSheet('GraphicsView{background-color:#FDF6E3;}')
        self.setRenderHint(QPainter.RenderHint.Antialiasing, True)
        self.setDragMode(QGraphicsView.DragMode.ScrollHandDrag)  # 启用拖拽模式

        self.drawing_rect = None
        self.origin = None
        self.is_drawing = False
        self.coordinate_text_items = {}  # 存储坐标信息的字典，以矩形为键

    def wheelEvent(self, event):
        modifiers = event.modifiers()
        if modifiers == Qt.KeyboardModifier.ControlModifier:
            # 只有在按下 Ctrl 键时才缩放
            factor = 1.2  # 缩放因子
            if event.angleDelta().y() < 0:
                factor = 1.0 / factor  # 对于负的滚轮事件进行缩小

            self.scale(factor, factor)

    def mouseDoubleClickEvent(self, event):
        super().mouseDoubleClickEvent(event)

        if event.button() == Qt.MouseButton.LeftButton:
            # 获取鼠标双击的位置
            double_click_position = event.pos()

            # 获取双击位置相对于原图的像素位置
            double_click_scene_position = self.mapToScene(double_click_position)

            # 获取点击位置相对于原图的像素位置
            item = self.scene().itemAt(double_click_scene_position, self.transform())
            if isinstance(item, QGraphicsRectItem):
                # 删除被点击的矩形的坐标信息
                rect_key = id(item)
                if rect_key in self.coordinate_text_items:
                    self.removeCoordinateTextItems(self.coordinate_text_items[rect_key])

                # 删除被点击的矩形
                self.scene().removeItem(item)

    def mouseMoveEvent(self, event):
        super().mouseMoveEvent(event)

        if event.buttons() & Qt.MouseButton.RightButton:
            if self.is_drawing and self.origin is not None:
                # 获取鼠标当前位置
                current_position = event.pos()

                # 获取当前位置相对于原图的像素位置
                current_scene_position = self.mapToScene(current_position)

                # 更新矩形的大小
                self.drawing_rect.setRect(QRectF(self.origin, current_scene_position))

        # 实时显示图像
        scene_rect = self.sceneRect()
        self.setSceneRect(scene_rect)

    def mouseReleaseEvent(self, event):
        super().mouseReleaseEvent(event)

        if event.button() == Qt.MouseButton.RightButton:
            if self.is_drawing and self.origin is not None:
                self.is_drawing = False

                # 获取鼠标释放的位置
                release_position = event.pos()

                # 获取释放位置相对于原图的像素位置
                release_scene_position = self.mapToScene(release_position)

                # 更新矩形的大小
                self.drawing_rect.setRect(QRectF(self.origin, release_scene_position))

                # 显示矩形的坐标信息
                self.showRectCoordinates(self.drawing_rect)

    def mousePressEvent(self, event):
        super().mousePressEvent(event)

        if event.button() == Qt.MouseButton.RightButton:
            if not self.is_drawing:
                # 获取鼠标点击的位置
                click_position = event.pos()

                # 获取点击位置相对于原图的像素位置
                scene_position = self.mapToScene(click_position)
                self.origin = scene_position
                self.is_drawing = True

                # 创建一个新的矩形
                self.drawing_rect = QGraphicsRectItem(QRectF(self.origin, self.origin))
                self.scene().addItem(self.drawing_rect)

    def showRectCoordinates(self, rect_item):
        # 获取矩形的左上角和右下角相对于图片的坐标
        rect_top_left = rect_item.rect().topLeft()
        rect_bottom_right = rect_item.rect().bottomRight()

        # 将坐标转换为整数
        rect_top_left = rect_top_left.toPoint()
        rect_bottom_right = rect_bottom_right.toPoint()

        # 在矩形的左上角显示坐标信息
        text_item_top_left = QGraphicsTextItem(f"({rect_top_left.x()}, {rect_top_left.y()})")
        text_item_top_left.setPos(rect_top_left.x(), rect_top_left.y() - 15)
        self.scene().addItem(text_item_top_left)

        # 在矩形的右下角显示坐标信息
        text_item_bottom_right = QGraphicsTextItem(f"({rect_bottom_right.x()}, {rect_bottom_right.y()})")
        text_item_bottom_right.setPos(rect_bottom_right.x() - 60, rect_bottom_right.y() + 5)
        self.scene().addItem(text_item_bottom_right)

        # 存储矩形和坐标信息的关联
        rect_key = id(rect_item)
        self.coordinate_text_items[rect_key] = [text_item_top_left, text_item_bottom_right]

    def removeCoordinateTextItems(self, items):
        # 删除与矩形关联的坐标信息
        for item in items:
            self.scene().removeItem(item)

def main():
    app = QApplication(sys.argv)
    viewer = ImageViewer()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
```

```python
给出这样一个pyqt6程序，左边是刚才的窗口，窗口右边有按钮和输入框，分别可以输入：
背景图像选择框，字体选择框，字体大小，字体颜色设置，文字区域左顶点，
右顶点，字间隔，行间距，行间距随机扰动值，字体大小随机扰动值，字间距随机扰动值
    font=ImageFont.truetype("hand.ttf", size=100),
    line_spacing=150,
    fill=0,  # 字体“颜色”
    left_margin=100,
    top_margin=100,
    right_margin=100,
    bottom_margin=100,
    word_spacing=15,
    # line_spacing_sigma=6,  # 行间距随机扰动
    line_spacing_sigma=0,  # 行间距随机扰动
    # font_size_sigma=20,  # 字体大小随机扰动
    # font_size_sigma=2,  # 字体大小随机扰动
    font_size_sigma=0,  # 字体大小随机扰动
    word_spacing_sigma=0,  # 字间距随机扰动
    # word_spacing_sigma=3,  # 字间距随机扰动
    start_chars="“（[<",  # 特定字符提前换行，防止出现在行尾
    end_chars="，。",  # 防止特定字符因排版算法的自动换行而出现在行首
    perturb_x_sigma=0,  # 笔画横向偏移随机扰动
    # perturb_x_sigma=4,  # 笔画横向偏移随机扰动
    perturb_y_sigma=0,  # 笔画纵向偏移随机扰动
    # perturb_y_sigma=4,  # 笔画纵向偏移随机扰动
    perturb_theta_sigma=0,  # 笔画旋转偏移随机扰动
```

<a name="UuFRA"></a>

## 图片场景输出为图片

<a name="RPUQl"></a>

### 按照区域大的输出：

```python
def exportSceneToImage(self):
    # 获取场景的范围
    scene_rect = self.sceneRect()
     # 弹出输入对话框获取用户输入的文件名，默认为"img_1.png"
    file_name, _ = QInputDialog.getText(self, '导出图片', '输入文件名', text='img_1.png')
    # 如果用户取消了输入，则返回
    if not file_name:
        return
    # 创建一个QImage对象
    image = QImage(scene_rect.size().toSize(), QImage.Format.Format_ARGB32)
    image.fill(Qt.GlobalColor.white)
    # 创建一个QPainter对象
    painter = QPainter(image)
    # 将场景渲染到QImage中
    self.scene().render(painter, QRectF(image.rect()), scene_rect)
    # 结束绘制
    painter.end()
    # 保存QImage为图片文件
    image.save(file_name)
    QMessageBox.information(self, '提示', '图片已保存在当前目录下！', QMessageBox.StandardButton.Ok)
```

<a name="nqN2G"></a>

### 按照场景内容的大小输出图片

**itemsBoundingRect()** 获取的场景内容的外接矩形。然后，使用 **image_size** 变量来确定导出的图片的大小。

```python
def exportSceneToImage(self):
    # 获取场景的范围
    scene_rect = self.sceneRect()
    # 获取场景内容的大小
    content_rect = self.scene().itemsBoundingRect()
    # 使用场景内容的大小来确定导出图片的大小
    image_size = content_rect.size().toSize()
    # 弹出输入对话框获取用户输入的文件名，默认为"img_1.png"
    file_name, _ = QInputDialog.getText(self, '导出图片', '输入文件名', text='img_1.png')
    # 如果用户取消了输入，则返回
    if not file_name:
        return
    # 创建一个QImage对象
    image = QImage(image_size, QImage.Format.Format_ARGB32)
    image.fill(Qt.GlobalColor.white)
    # 创建一个QPainter对象
    painter = QPainter(image)
    # 将场景渲染到QImage中，以内容的大小为主
    self.scene().render(painter, QRectF(image.rect()), content_rect)
    # 结束绘制
    painter.end()
    # 保存QImage为图片文件
    image.save(file_name)
    QMessageBox.information(self, '提示', '图片已保存在当前目录下！', QMessageBox.StandardButton.Ok)
```

<a name="JkECO"></a>

## 浮点数滑块

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

<a name="OyqmB"></a>

## QListWidget中添加Widget

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

<a name="ON2gU"></a>

### PyQt6敲木鱼程序

<a name="UzuXw"></a>

## 更换主题

 【PyQt/PySide界面美化】qt-material极简上手！<br />我们在自己开发程序的过程中，如果不是非常必要的话我们必要将时间花费在界面的样式上，因为我们是程序员不是UI设计师，我们不是专业去设计那些样式的，很可能一番努力后做出来个四不像，样式不怎末好看，程序最后也没做好。<br />所以这里我发现一个样式表是`qt-material`也是直接使用起来，使用方法还是非常简单的。

```python
from qt_material import apply_stylesheet,list_themes
menubar = self.menuBar()
# 创建主题菜单，切换主题
themeMenu = menubar.addMenu('主题')
for theme_name in list_themes():
    theme_tmp = QAction(theme_name, self)
    theme_tmp.triggered.connect(self.changeTheme)
    themeMenu.addAction(theme_tmp)

def changeTheme(self):
    action=self.sender()
    theme_name=action.text()
    apply_stylesheet(app, theme=theme_name)
```

<a name="o8b1h"></a>

## 多选列表

```python
self.hobbies_list = QListWidget()
self.hobbies_list.setSelectionMode(QListWidget.SelectionMode.MultiSelection)
hobbies_items = ["旅行", "阅读", "音乐", "电影", "运动", "美食"]
for item in hobbies_items:
    list_item = QListWidgetItem(item)
    self.hobbies_list.addItem(list_item)
```

<a name="NbVjR"></a>

##  在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，如何强制处理事件循环中的待处理事件，以更新 GUI

在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，直到任务完成。在这种情况下，你可以使用 **QApplication.processEvents()** 方法来强制处理事件循环中的待处理事件，以便更新 GUI。<br />在不使用多线程的情况下，GUI 的状态更新通常需要在事件循环中执行。如果在主线程中执行耗时的任务，GUI 将被阻塞，用户界面将无法更新，直到任务完成。在这种情况下，你可以使用 `QApplication.processEvents()` 方法来强制处理事件循环中的待处理事件，以便更新 GUI。<br />以下是一个示例代码，演示了如何在主线程中执行一个耗时的任务并实时更新 GUI：

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

请注意，`QApplication.processEvents()` 的使用是为了手动处理事件循环，这允许 GUI 在任务执行期间更新。但是，这种方法可能不够理想，因为它强制处理所有待处理的事件，包括用户输入等。这可能导致应用程序在任务执行期间对用户的响应变慢。
<a name="dTcXx"></a>

## 单独线程处理任务

在PyQt中，如果有耗时的操作阻塞主线程，会导致GUI冻结，因为GUI运行在同一个线程上。为了保持GUI在这些操作期间仍然响应，应该将耗时的任务移到单独的线程中。PyQt提供了`QThread`类来实现这个目的。<br />以下是一个简单的示例，演示如何使用`QThread`在后台运行耗时的任务，同时保持GUI响应：

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

在这个例子中，`WorkerThread`类是`QThread`的子类，负责运行耗时的任务。当任务完成时，它发射一个信号（`finished_signal`）。`MainWindow`类在点击“开始任务”按钮时创建`WorkerThread`的实例，将其信号连接到槽（`task_completed`），然后启动线程。<br />记住正确处理信号和槽，并确保GUI更新发生在主线程中。如果需要从工作线程更新GUI，请使用`pyqtSignal`发射信号，并将它们连接到主线程中的槽。
<a name="IBMfD"></a>

## 实时更新单独线程中任务执行的进度到窗口中

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

在这个例子中，`WorkerThread`类在运行期间使用了一个循环来模拟耗时任务，并通过定期发射`progress_signal`信号来更新主线程的进度条。主线程中的`update_progress`槽连接到这个信号，以更新GUI中的进度条。<br />请注意，这里使用了一个简单的定时器，实际情况中可能需要根据任务的性质和进度更新的频率选择合适的方案。
<a name="JprcX"></a>

## 防锯齿选项

这段代码定义了一个枚举类 `RenderHint`，它是一个标志（flag）枚举，用于表示图形渲染的一些选项。这里使用了Python的`enum`模块。<br />每个枚举成员都对应一个图形渲染选项，其实际值是`QPainter.RenderHint`类型，这是PyQt中用于指定绘制选项的一种枚举类型。这些选项用于设置 QPainter 的渲染行为，以影响如何处理图形的绘制和呈现。<br />以下是对每个成员的简要解释：

- `Antialiasing`: 启用抗锯齿，使图形边缘更加平滑。
- `TextAntialiasing`: 启用文本抗锯齿，使文本边缘更加平滑。
- `SmoothPixmapTransform`: 启用平滑的 pixmap 变换，可以提高 pixmap 的绘制质量。
- `LosslessImageRendering`: 在图像渲染时尽量保持无损。
- `VerticalSubpixelPositioning`: 启用垂直子像素定位，提高垂直方向的文本渲染精度。
- `NonCosmeticBrushPatterns`: 禁用化妆品级别的笔刷模式，即使在缩放时，图案也不会被调整。

这些选项可以通过设置 `QPainter.setRenderHint` 方法来应用到绘图上下文中，从而影响后续的绘图操作。例如：

```python
painter = QPainter()
painter.setRenderHint(RenderHint.Antialiasing)
painter.drawEllipse(10, 10, 50, 50)
```

这会启用抗锯齿效果，使绘制的椭圆边缘更加平滑。
<a name="k0vWs"></a>

## 配置相关QSettings

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

<a name="dNnJ0"></a>

## 【自定义磨砂动态背景】前端及pyqt6实现

![](https://cdn.nlark.com/yuque/0/2023/jpeg/38536969/1703518332788-d1b87444-f625-47f8-9977-b0627b20f13f.jpeg#averageHue=%23d0e0d9&clientId=u0cfaab1b-8444-4&from=paste&id=u305e3618&originHeight=2160&originWidth=3644&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=uad2bb042-6a75-4991-b172-910b3482523&title=)<br />如何实现一个自定义的磨砂动态背景呢？<br />这种效果看起来特别的高端，很新颖美观。<br />具体的效果可以看这里的演示：[https://www.bilibili.com/video/BV1zj411H7wd/](https://www.bilibili.com/video/BV1zj411H7wd/)<br />其实原理就是底层有多个多彩多边形在移动，然后再盖上一层模糊滤镜。<br />前端的话css比较强大可以控制多边形的颜色同时变化，效果更好点。但是我用pyqt6实现的效果自我感觉也不赖。<br />我这里封装了两个类，给出了一个使用的demo，大家可以研究一下。如果有帮到你，希望给出一个免费的三连。
<a name="n7fJx"></a>

### 自定义磨砂动态背景代码

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget,QGraphicsBlurEffect
from PyQt6.QtGui import QPainter, QBrush, QColor,QIcon,QPolygonF
from PyQt6.QtCore import Qt, QRectF, QPropertyAnimation, QEasingCurve,QRect,QPointF
class BlurredLabel(QLabel):
    def __init__(self, parent=None,items=[]):
        super().__init__(parent)
        self.setGeometry(0,0,parent.width(),parent.height())
        for item in items:
            type=item.get('type',11)
            color=item.get('color','red')
            last_time=item.get('last_time',3)
            shape=item.get('shape',1)
            # beisaier=item.get('beisaier',)
            MoveLabel(self,type=type,color=color,last_time=last_time,shape=shape)
        print(parent.size())
        print(self.size())

        blur_effect = QGraphicsBlurEffect()
        blur_effect.setBlurRadius(300)
        self.setGraphicsEffect(blur_effect)
class MoveLabel(QLabel):
    def __init__(self, parent=None,type=11,shape=0,color='blue',last_time=5,beisaier=None):
        super().__init__(parent)
        self.side_width = min(parent.width(), parent.height()) // 2  # 设置半径为父类宽高最小值的一半
        self.setGeometry(0,0,self.side_width,self.side_width)
        self.shape=shape
        self.last_time = last_time
        self.color = color
        if type==11:
            self.start_rect = QRectF(0, 0, self.width(), self.height())
            self.end_rect = QRectF(self.parent().width() - self.side_width, self.parent().height() -self.side_width,self.side_width, self.side_width)
        elif type==12:
            self.start_rect = QRectF(parent.width() - self.side_width, parent.height() - self.side_width,self.side_width, self.side_width)
            self.end_rect = QRectF(0, 0, self.width(), self.height())
        elif type==21:
            self.start_rect=QRectF((parent.width()-self.side_width)//2,0,self.side_width, self.side_width)
            self.end_rect=QRectF((parent.width()-self.side_width)//2,parent.height()-self.side_width,self.side_width, self.side_width)
        elif type==22:
            self.start_rect = QRectF((parent.width()-self.side_width)//2,parent.height()-self.side_width,self.side_width, self.side_width)
            self.end_rect = QRectF((parent.width()-self.side_width)//2,0,self.side_width, self.side_width)
        elif type==31:
            self.start_rect = QRectF(parent.width()-self.side_width,0,self.side_width, self.side_width)
            self.end_rect =  QRectF(0,parent.height()-self.side_width,self.side_width, self.side_width)
        elif type==32:
            self.start_rect = QRectF(0,parent.height()-self.side_width,self.side_width, self.side_width)
            self.end_rect = QRectF(parent.width()-self.side_width,0,self.side_width, self.side_width)
        elif type==41:
            self.start_rect = QRectF(parent.width()-self.side_width,(parent.height()-self.side_width)//2,self.side_width, self.side_width)
            self.end_rect = QRectF(0,(parent.height()-self.side_width)//2,self.side_width, self.side_width)
        elif type==42:
            self.start_rect = QRectF(0,(parent.height()-self.side_width)//2,self.side_width, self.side_width)
            self.end_rect = QRectF(parent.width()-self.side_width,(parent.height()-self.side_width)//2,self.side_width, self.side_width)
        self.animation = QPropertyAnimation(self, b'geometry')
        self.animation.finished.connect(self.toggleAnimation)
        self.startAnimation()
    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        if self.shape==1:
            # 计算圆的位置
            rect = self.rect().adjusted(1, 1, -1, -1)
            # 设置刷子
            brush = QBrush(QColor(self.color))  # 刷子颜色为半透明红色
            painter.setBrush(brush)
            # 绘制圆
            painter.drawEllipse(rect)
        elif self.shape==2:
            painter.fillRect(0, 0, self.side_width, self.side_width, QColor(self.color))  # 使用红色填充正方形
        elif self.shape==3:
            # 计算三角形的顶点坐标
            p1 = QPointF(self.width() / 2, (self.height() - self.side_width * 0.866) / 2)  # 0.866 为 sqrt(3)/2，即等边三角形的高度
            p2 = QPointF((self.width() - self.side_width) / 2, (self.height() + self.side_width * 0.866) / 2)
            p3 = QPointF((self.width() + self.side_width) / 2, (self.height() + self.side_width * 0.866) / 2)

            triangle = QPolygonF([p1, p2, p3])

            painter.setBrush(QBrush(QColor(0, 0, 255)))  # 使用蓝色填充三角形
            painter.drawPolygon(triangle)
    def toggleAnimation(self):
        # 切换动画的起始值和结束值
        a,b=self.animation.startValue(),self.animation.endValue()
        a,b=b,a
        self.animation.setStartValue(a)
        self.animation.setEndValue(b)
        self.animation.start()
    def startAnimation(self):
        self.animation.setStartValue(self.start_rect)
        self.animation.setEndValue(self.end_rect)
        self.animation.setDuration(self.last_time*1000)
        self.animation.setEasingCurve(QEasingCurve.Type.InOutQuad)  # 设置缓动曲线
        self.animation.start()
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setGeometry(300,100,800,600)
        self.initUI()
    def initUI(self):
        self.setWindowIcon(QIcon('logo.png'))
        central_widget = QWidget(self)
        layout = QVBoxLayout(central_widget)
        # f, parent = None, type = 11, shape = 0, color = 'blue', last_time = 5, beisaier = None):
        shapes=[
            {'type':11,'shape':1,'color':'#FF416C','last_time':6},
            {'type':21,'shape':3,'color':'#12c2e9','last_time':5},
            {'type':31,'shape':1,'color':'#c471ed','last_time':7},
            {'type':41,'shape':2,'color':'#f64f59','last_time':8},
            {'type':12,'shape':1,'color':'#7303c0','last_time':9},
            {'type':22,'shape':1,'color':'#fdeff9','last_time':4},
            # {'type':32,'shape':1,'color':'pink','last_time':4},
            # {'type':42,'shape':1,'color':'pink','last_time':4},
        ]
        label = BlurredLabel(self,shapes)
        layout.addWidget(label)

        self.setCentralWidget(central_widget)
        self.setWindowTitle('磨砂动态背景')
        label_=QLabel('type参数两位数，第一位1，2，3，4表示直线，\n第二位1表示正向，2表示反向',self)
        label_.adjustSize()  # 调整标签大小以适应内容
        # label_.setWordWrap(True)
def main():
    app = QApplication(sys.argv)
    mainWindow = MainWindow()
    mainWindow.show()
    sys.exit(app.exec())
if __name__ == '__main__':
    main()
```

<a name="BfJKR"></a>

### 参数说明：

type参数说明：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/38536969/1703518883205-4a0cf819-429d-410a-9337-4269001a6031.png#averageHue=%23eedada&clientId=u0cfaab1b-8444-4&from=paste&height=612&id=u2ad74cc3&originHeight=765&originWidth=516&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=97683&status=done&style=none&taskId=u7e024163-2684-4f54-a015-33da1399f66&title=&width=412.8)