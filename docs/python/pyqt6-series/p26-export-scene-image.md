---
title: "P26-图片场景输出为图片"
created_at: 2024-12-20 21:42:58
updated_at: 2024-12-20 21:42:58
---

# P26-图片场景输出为图片

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

### 按照场景内容的大小输出图片
**<font style="color:rgb(15, 15, 15);">itemsBoundingRect()</font>**<font style="color:rgb(15, 15, 15);"> 获取的场景内容的外接矩形。然后，使用 </font>**<font style="color:rgb(15, 15, 15);">image_size</font>**<font style="color:rgb(15, 15, 15);"> 变量来确定导出的图片的大小。</font>

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
