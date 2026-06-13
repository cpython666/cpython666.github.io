---
title: "P13-先显示登陆页面，登陆成功后显示主页面"
created_at: 2024-12-20 21:38:17
updated_at: 2024-12-20 21:38:17
---

# P13-先显示登陆页面，登陆成功后显示主页面

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
