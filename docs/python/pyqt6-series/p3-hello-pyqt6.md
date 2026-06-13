---
title: "P3-第一个程序-Hello,PyQt6~"
created_at: 2024-12-20 21:32:18
updated_at: 2024-12-20 21:32:18
---

# P3-第一个程序-Hello,PyQt6~

大家好，这一集我们来一起完成我们的第一个PyQt6程序，Hello，PyQt6。

在学习每一种语言，我们都会运行这样的一个hello，world程序。这不仅仅是一种仪式感，更是因为我们要保证环境或者三方库已经成功安装。不然可能会键盘一顿输出，一堆报错，找半天问题最后发现环境都没有装好。

好了，正文开始。

首先我们可以看下运行效果，运行成功后会出现这样一个窗口。有着我们自己的图标与标题。在窗口上显示着，Hello，PyQt6的字符。

当然，程序也有着一些默认的功能，比如最大化最小化，拖动窗口等，这就是我们使用成熟三方库或者框架的好处。

下面我们来看看具体的代码，

在第一行，我们导入sys模块，用于处理命令行参数和退出程序。

在第二行，我们从PyQt6.QtWidgets模块中导入QApplication、QMainWindow和QLabel类

在第三行，我们从PyQt6.QtGui模块中导入QIcon类

在第六行，我们创建一个QApplication对象，传入命令行参数列表。需要注意的是<font style="color:rgb(7, 19, 62);">QApplication是Qt库中的一个关键类，它使用用户的桌面设置进行初始化，负责处理应用程序的初始化和结束</font>

在第七行我们创建一个QMainWindow对象，表示主窗口

第八行我们设置主窗口的位置和大小，参数分别为x坐标、y坐标、宽度和高度，所以我们设置的参数意思就是在屏幕100,100位置绘制一个长300，宽200的窗口。

第九与第十行我们设置主窗口的标题为派森斗罗，并且设置主窗口的图标为logo.png文件。

第十二行我们在主窗口上创建一个QLabel对象，显示文本"Hello, PyQt6!"

第十四行显示主窗口，

 	在第十五行，进入事件循环，等待用户操作，然后退出程序

没错，就这样简单。短短几行代码我们就可以在桌面创建一个小软件。并且由于Qt的可移植性，代码可以在<font style="color:rgb(77, 77, 77);">Windows 、Mac OS，Linux等多种不同的平台中。</font>

<font style="color:rgb(77, 77, 77);">好了，本集内容到此结束，我们下集再见。</font>

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
