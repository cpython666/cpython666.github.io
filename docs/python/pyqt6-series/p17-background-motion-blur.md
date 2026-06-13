---
title: "P17-背景运动及模糊滤镜"
created_at: 2024-12-20 21:39:46
updated_at: 2024-12-20 21:39:46
---

# P17-背景运动及模糊滤镜

> Steam登陆界面复现-PyQt6-Python-运动背景图三种实现方式
>

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
