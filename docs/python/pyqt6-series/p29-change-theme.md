---
title: "P29-更换主题"
created_at: 2024-12-20 21:43:57
updated_at: 2024-12-20 21:43:57
---

# P29-更换主题

【PyQt/PySide界面美化】qt-material极简上手！

我们在自己开发程序的过程中，如果不是非常必要的话我们必要将时间花费在界面的样式上，因为我们是程序员不是UI设计师，我们不是专业去设计那些样式的，很可能一番努力后做出来个四不像，样式不怎末好看，程序最后也没做好。

所以这里我发现一个样式表是`qt-material`也是直接使用起来，使用方法还是非常简单的。

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
