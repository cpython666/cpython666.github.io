---
title: "P23-介绍一下QGraphicsScene和QGraphicsView"
created_at: 2024-12-20 21:42:01
updated_at: 2024-12-20 21:42:01
---

# P23-介绍一下QGraphicsScene和QGraphicsView

`QGraphicsScene` 和 `QGraphicsView` 是 PyQt 中用于创建图形用户界面的两个关键类，它们一起协同工作，提供了一种灵活的图形表示方法。以下是它们的主要介绍：

### <font style="color:rgb(15, 15, 15);">QGraphicsScene</font>
`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 是一个二维图形场景，它允许你在其中添加、移动和交互多个 2D 图形项（</font>`<font style="color:rgb(15, 15, 15);">QGraphicsItem</font>`<font style="color:rgb(15, 15, 15);">）。图形项可以是简单的图形元素，如矩形、椭圆和文本，也可以是自定义的图形元素。</font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 提供了以下主要功能：</font>

1. <font style="color:rgb(15, 15, 15);"> </font>**管理图形项：**<font style="color:rgb(15, 15, 15);"> </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 维护了一个图形项的列表，你可以在其中添加、移除和操纵图形项。 </font>
2. <font style="color:rgb(15, 15, 15);"> </font>**场景坐标系：**<font style="color:rgb(15, 15, 15);"> 每个图形项都有自己的局部坐标系，而 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 提供了一个全局坐标系，使你能够在场景中的不同图形项之间执行坐标转换。 </font>
3. <font style="color:rgb(15, 15, 15);"> </font>**事件处理：**<font style="color:rgb(15, 15, 15);"> </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 可以接收鼠标、键盘和其他事件，你可以通过重写相应的事件处理方法来响应这些事件。 </font>
4. <font style="color:rgb(15, 15, 15);"> </font>**图形项选择：**<font style="color:rgb(15, 15, 15);"> 你可以选择一个或多个图形项，执行相应的操作，比如拖动、删除等。 </font>

### <font style="color:rgb(15, 15, 15);">QGraphicsView</font>
`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 是用于在窗口中显示 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 的视图类。它提供了以下主要功能：</font>

1. <font style="color:rgb(15, 15, 15);"> </font>**显示场景：**<font style="color:rgb(15, 15, 15);"> </font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 提供一个用于显示 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 内容的视图窗口。你可以在一个窗口中显示多个 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);">，每个视图显示同一个或不同的场景。 </font>
2. <font style="color:rgb(15, 15, 15);"> </font>**视图变换：**<font style="color:rgb(15, 15, 15);"> 通过视图变换，你可以对场景进行平移、缩放、旋转等操作。这使得你可以轻松地实现图形的缩放和平移效果。 </font>
3. <font style="color:rgb(15, 15, 15);"> </font>**视图更新：**<font style="color:rgb(15, 15, 15);"> 当场景中的图形项发生变化时，</font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 负责更新视图，以便反映这些变化。 </font>
4. <font style="color:rgb(15, 15, 15);"> </font>**事件转发：**<font style="color:rgb(15, 15, 15);"> </font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 接收鼠标、键盘等事件，并将它们传递给场景中的图形项进行处理。 </font>
5. <font style="color:rgb(15, 15, 15);"> </font>**交互支持：**<font style="color:rgb(15, 15, 15);"> </font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 提供了一些方便的方法来支持用户的交互，比如启用鼠标拖拽、缩放等。 </font>



<font style="color:rgb(15, 15, 15);">通过将 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsScene</font>`<font style="color:rgb(15, 15, 15);"> 和 </font>`<font style="color:rgb(15, 15, 15);">QGraphicsView</font>`<font style="color:rgb(15, 15, 15);"> 结合使用，你可以创建出富有交互性的图形界面，用于显示和操作图形元素。这对于图形编辑器、CAD 应用、数据可视化等领域非常有用。</font>
