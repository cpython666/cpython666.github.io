---
title: "P24-图片浏览，可以放大缩小拖拽"
description: "基于 QGraphicsView 做一个支持滚轮缩放和鼠标拖拽的 PyQt6 图片浏览器，附完整可运行代码。"
keywords: "PyQt6,图片浏览器,QGraphicsView,缩放,拖拽"
created_at: 2024-12-20 21:42:18
updated_at: 2024-12-20 21:42:18
---

# P24-图片浏览，可以放大缩小拖拽

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
