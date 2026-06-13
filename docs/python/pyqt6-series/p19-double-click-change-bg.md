---
title: "P19-窗口双击更换背景"
created_at: 2024-12-20 21:40:46
updated_at: 2024-12-20 21:40:46
---

# P19-窗口双击更换背景

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
