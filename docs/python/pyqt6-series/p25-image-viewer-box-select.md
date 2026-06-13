---
title: "P25-图片浏览，ctrl+滚轮放大缩小，左键按压拖拽，右键按压画框，框显示坐标信息"
created_at: 2024-12-20 21:42:41
updated_at: 2024-12-20 21:42:41
---

# P25-图片浏览，ctrl+滚轮放大缩小，左键按压拖拽，右键按压画框，框显示坐标信息

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
