---
title: "P2-合集简介"
created_at: 2024-12-20 21:31:44
updated_at: 2024-12-20 21:31:44
---

# P2-合集简介

## 本合集特点特色

大家可以发现，我在这个合集会讲解一些非常简单的小的功能。

为什么这样呢？其实对于新手来说，我来就做一些很大的项目可能会导致没有耐心看下去，从另一个方面讲，我们一个大的项目就是由很多的小的功能凑起来的，我将这些小的功能拆分出来，这样大家哪个功能点做不出来就可以快速学习案例，然后应用到自己的项目中。没有必要长篇大论。



在本合集中，只讲有用的，保证高效开发一个软件。



## 为什么要学习PyQt6?

**为什么要学桌面开发？**

最近在干什么，突然又想用pyqt了。因为平时可能自己写代码的话只能自己用一下，但是发给别人用的话别人需要有点Python基础，这就下入了一个尴尬的循环。有python基础的不需要我的代码，没有python基础的拿到我的代码也跑不起来。

所以说不如送佛送到西，直接将代码打包成软件。所以

对于桌面程序的理解，开发过程就像前端一样。原型设计好后剩下的就是实现。

**为什么是PyQt6？**

首先，Python简单易学

其次，Qt强大

Python+Qt

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

+ <font style="color:rgb(7, 19, 62) !important;">QtCore：这个模块提供了一些基本的功能，如时间处理、文件和目录处理、数据类型、流、属性系统、元对象系统等。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtGui：这个模块是PyQt6中的图形用户界面(GUI)工具集，它提供了一些窗口系统、事件处理、2D图形和基本的图像类等功能。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtWidgets：这个模块是建立在QtGui之上的一套新的控件，它提供了一套丰富的控件集合，例如按钮、文本框、列表框、复选框等。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtDBus：这个模块实现了DBus的底层访问，使得应用程序可以通过DBus进行通信。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtNetwork：这个模块提供了实现网络编程的类和方法，如网络请求和响应、SSL安全连接等。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtHelp：这个模块用于创建帮助文件，支持多种格式，如HTML、XML等。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtXml：这个模块实现了解析和生成XML文档的功能。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtSvg：这个模块提供了将SVG文件转换为QPainter绘图的命令。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtSql：这个模块实现了SQL数据库的访问功能，可以执行SQL语句以及获取查询结果。</font>
+ <font style="color:rgb(7, 19, 62) !important;">QtTest：这个模块包含了一些测试工具，用于单元测试和集成测试。</font>

## <font style="color:rgb(7, 19, 62) !important;">模块所处位置</font>

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

## 版本信息

```python
# QT_VERSION_STR 可以显示 Qt 的版本信息，PYQT_VERSION_STR 可以显示 PyQt 的版本信息
from PyQt6.QtCore import QT_VERSION_STR
from PyQt6.QtCore import PYQT_VERSION_STR

print(QT_VERSION_STR)
print(PYQT_VERSION_STR)
```
