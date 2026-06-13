---
title: "P7-画出一个棋盘背景"
created_at: 2024-12-20 23:04:30
updated_at: 2024-12-20 23:04:30
---

# P7-画出一个棋盘背景

## 文案：
	一分钟一个Pygame案例，这一集我们来学习一下如何生成一个视频中的棋盘背景效果，非常非常简单。

当然我们这里是用来做页面的背景，你也可以拿来做别的效果，比如贪吃蛇的地图等。

我们先讲效果实现思路，再讲效果的实现代码。

最开始的开始，我们有一个白色的屏幕，矩形即可，我们这里以一个边长为500的正方形为例，然后我们还有两个颜色的小正方形，我们可以很轻松的发现最终的效果就是这两个小正方形填充进大正方形后的效果。我们最重要的就是这两个不同色矩形按照怎样的规则填充进去。

我们在这里直接将规则展示出来，非常非常简单。

规则就是我们将这些矩形所处的行和列加起来得到的值，每一个奇数上下左右都是偶数，同理每一个偶数上下左右都是奇数。

所以我们只需要用大矩形的长和宽分别除以小矩形的宽，得出行和列，然后进行循环，按照上面所述的规则进行填充进大矩形即可。

好了，思路讲述完毕。下面我们来看看代码。

最基础的代码我们之前的视频已经讲过了。这里只看实现的关键代码。

这行代码我们定义了一些参数，例如背景长宽，棋盘格子的宽，大背景的长和宽，两种小矩形格子的颜色。

然后一个列表生成式，生成每个小矩形的位置和颜色。

根据列表里面的对应信息将小矩形填充进背景矩形。

最后再将背景绘制进主窗口屏幕中。

好了，代码讲解完毕，最后我们再来看一下效果。

## 代码-棋盘背景：
```python
import pygame

pygame.init()
window = pygame.display.set_mode((500, 500))
clock = pygame.time.Clock()

# 定义参数，背景长宽，棋盘格子的宽，长和宽，格子的两种颜色
background, tile_size, w, h, bgcolor1, bgcolor2 = pygame.Surface(window.get_size()), 50, *window.get_size(), (160, 160, 160), (192, 192, 192)

# 创建棋盘格状的背景
tiles = [((x * tile_size, y * tile_size, tile_size, tile_size), bgcolor1 if (x + y) % 2 == 0 else bgcolor2) for x in range((w + tile_size - 1) // tile_size) for y in range((h + tile_size - 1) // tile_size)]

# 为棋盘添加小格子
for rect, color in tiles:
    pygame.draw.rect(background, color, rect)

run = True
while run:
    clock.tick(60)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    # 将棋盘背景绘制到窗口上
    window.blit(background, (0, 0))

    pygame.display.flip()

pygame.quit()
exit()
```
