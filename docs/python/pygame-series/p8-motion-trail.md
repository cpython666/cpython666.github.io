---
title: "P8-物体运动尾迹拖尾"
created_at: 2024-12-20 23:05:39
updated_at: 2024-12-20 23:05:39
---

# P8-物体运动尾迹拖尾

## 文案-pygame实现物体运动拖尾尾迹
一分钟一个pygame案例，在这两集我们将要学习一下如何使用pygame来实现视频中的物体运动尾迹拖尾效果，非常非常简单。

当然我们这里只是实现了物体本身拖尾，透明度递减的物体拖尾，以及彩色线条拖尾，其实还具有粒子效果拖尾，纹理图拖尾矢量图形拖尾等，后面我们有机会或者大家想看的话也可拿出来讲一讲。

下面我们还是老规矩，先讲效果实现思路，再讲效果的实现代码。

首先，你可以暂停视频五秒钟，思考一下，如果是你，你会如何实现这样的效果。

好了，现在揭晓答案，无论是前面的小球，还是后面的线条，其实他们都是一样的原理，我们快速的移动鼠标可以发现运动尾迹其实就是物体经过的地方依旧绘制有物体图案，然后在一定时间后消失组成的效果。

其实我们可以将这一过程抽象为有一个长度固定的物体数组，将这些物体全部绘制在窗口上，之所以不运动的时候你只看到了一个物体，是因为所有的物体重合了，所以你只能看到一个。而运动的时候所有的物体的坐标不再一致，所以会显示一连串。

没错，就是这么简单，就是画一个圆与多个圆的区别，那么知道这一原理后，我们绘制出透明度逐渐减少的尾迹也只是改变下颜色的问题。但在pygame的主窗口中，是不支持rgba颜色的，所以我们后面也会给出解决方案。

现在，我们先来看绘制多个物体实现尾迹的实现代码。



还是老规矩，我们不再讲那些基础的代码，只讲与本视频知识点有关系的代码。我们在这里定义小球的半径和颜色，在这里定义小球的初始位置和初始速度，然后定义一个列表用于存储多个物体。

在事件的循环中，我们不断获取鼠标的位置，并且根据鼠标位置和小球的位置去更新小球的速度，再根据小球速度去更新小球的位置。然后将小球的位置信息添加进小球数组，这样就实现了记录路径上小球的功能。

然后我们用白色填充屏幕，接着画出列表中每一个小球，最重要的是，我们最多每次取出列表后20个小球，防止小球的无限增长。

好了，代码已经讲解完毕，是不是非常简单。下面我们来看一下运行的效果。

当然，显示的效果这些参数都是可以修改的，比如小球的颜色，大小，乃至小球拖尾的长度。

比如说我们这里将小球大小改为100，颜色改为黑色，拖尾长度改为5个。可以看到这样的效果。

怎么样，是不是很简单。下面几集我们来介绍如何绘制透明度变化的物体拖尾与渐变拖尾。关注阿婆主，获取第一手知识。

## 代码-小球运动尾迹-小球版：
```python
import pygame
import sys

# 初始化并屏幕大小，创建屏幕，设置窗口的标题，即游戏名称
pygame.init()
screen_width, screen_height = 800, 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_icon(pygame.image.load('logo.png').convert())
pygame.display.set_caption('编程启航')

# 小球属性
ball_radius = 20
ball_color = (0, 0, 255)

# 小球的位置和速度
ball_pos = [screen_width // 2, screen_height // 2]
ball_velocity = [0, 0]

# 拖尾效果所需的轨迹点
trail_points = []

# 游戏循环
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 获取鼠标位置
    mouse_pos = pygame.mouse.get_pos()

    # 更新小球速度
    ball_velocity[0] = (mouse_pos[0] - ball_pos[0]) * 0.1
    ball_velocity[1] = (mouse_pos[1] - ball_pos[1]) * 0.1

    # 更新小球位置
    ball_pos[0] += int(ball_velocity[0])
    ball_pos[1] += int(ball_velocity[1])

    # 添加当前位置到轨迹点列表
    trail_points.append(ball_pos.copy())

    # 清空屏幕
    screen.fill((255, 255, 255))

    # 更新和绘制轨迹点
    for i, point in enumerate(trail_points):
        pygame.draw.circle(screen, ball_color, point, ball_radius)
    
    # 控制小球数量
    trail_points = trail_points[-20:]

    # 更新屏幕，控制帧率
    pygame.display.flip()
    pygame.time.Clock().tick(60)

pygame.quit()
sys.exit()
```



## 文案-物体渐隐拖尾实现
上一集我们实现了物体本体形式的拖尾，这一集我们基于上一集来实现物体逐渐变透明到消失的拖尾。

上集我们也说过，逐渐变透明到消失的物体拖尾只不过是给物体添加一个透明度，然后透明度逐渐变化的效果。

那么我们只需要掌握透明度物体绘制方法即可。

如果我们去问gpt，如何在pygame中画一个半透明的圆，它会给你这样的答案，但你真正使用的时候，会发现它不是半透明的。在网上查阅后，我发现原来pygame的屏幕不支持显示rgba颜色。

但是我们可以曲线救国实现这一效果，实现方式如下：我们可以先创建一块支持rgba颜色的区域a，将图形绘制在a上面，再将a绘制在主窗口上。

其实实现起来并不难，我们只需要封装一个支持rgba颜色的绘制函数即可。这里我们给出一个绘制圆的函数，其他图形同理，我会在笔记中给出其他的代码。

我们来看这个用于绘制带有透明度的圆形函数的实现，首先计算一个包含圆形的矩形区域，然后为矩形区域创建带有透明度的Surface，其次是在Surface上绘制圆形，最后将将Surface绘制到主窗口上。

看完这个函数后，我们再来看完整的代码。

如果你看了上一期的视频，那么完整的代码理解起来非常的简单，它与上期代码的唯一不同就在于在记录圆的数组中也记录了每个圆的透明度，绘制圆函数也加了一个透明度的数值，然后在每次绘制的时候去减少圆的透明度，最后我们删掉透明度小于0的物体以防止物体数量的无限增长。

就这样便实现了视频开始的效果，我们来运行一下看看。

同上集一样，我们依旧可以通过改变代码里的参数来实现改变拖尾效果。比如这里我们增大透明度减少的速度，这样拖尾就会消失的更快，这样就相当于缩短了拖尾。

我们就可以看到这样的效果。

其他的参数我们不一一举例，举一反三是编程的必备思维，我们应该去锻炼这种思维。好了，本集内容到此结束。后面还有各种炫酷效果，关注阿婆主不迷路呦~



## 代码-小球运动拖尾-渐隐版
```python
import pygame
import sys

# 初始化，创建屏幕，设置窗口的标题，即游戏名称
pygame.init()
screen = pygame.display.set_mode((600, 400))
pygame.display.set_icon(pygame.image.load('logo.png').convert())
pygame.display.set_caption('编程启航')

# 小球属性
ball_radius = 20
ball_color = (0, 0, 255)

# 小球的位置和速度
ball_pos = [*screen.get_size()]
ball_velocity = [0, 0]

# 拖尾效果所需的轨迹点
trail_points = []

# 定义一个函数，用于绘制带有透明度的圆形
def draw_circle_alpha(surface, color, center, radius):
    # 计算一个包含圆形的矩形区域
    target_rect = pygame.Rect(center, (0, 0)).inflate((radius * 2, radius * 2))
    # 创建带有透明度的Surface
    shape_surf = pygame.Surface(target_rect.size, pygame.SRCALPHA)
    # 在Surface上绘制圆形
    pygame.draw.circle(shape_surf, color, (radius, radius), radius)
    # 将Surface绘制到指定位置
    surface.blit(shape_surf, target_rect)

# 游戏循环
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((255,255,255))

    # 获取鼠标位置
    mouse_pos = pygame.mouse.get_pos()

    # 更新小球速度
    ball_velocity[0] = (mouse_pos[0] - ball_pos[0]) * 0.1
    ball_velocity[1] = (mouse_pos[1] - ball_pos[1]) * 0.1

    # 更新小球位置
    ball_pos[0] += int(ball_velocity[0])
    ball_pos[1] += int(ball_velocity[1])

    # 添加当前位置到轨迹点列表
    trail_points.append((ball_pos.copy(), ball_color,255))  # 初始透明度为255

    # 更新和绘制轨迹点
    for i, (point, color,a) in enumerate(trail_points):
        draw_circle_alpha(screen, (*color,a), point, 20)
        # 尾迹长
        # trail_points[i]=(point, color,a-5)
        # 尾迹短
        trail_points[i]=(point, color,a-50)

    # 删除透明度为0的轨迹点
    trail_points = [p for p in trail_points if p[2] > 0]

    # 更新屏幕
    pygame.display.flip()

    # 控制帧率
    pygame.time.Clock().tick(60)

pygame.quit()
sys.exit()
```



## 代码-小球运动尾迹-瑕疵版：
```python
import pygame
import sys

pygame.init()

# 屏幕大小
screen_width = 800
screen_height = 600

# 颜色
white = (255, 255, 255)
blue = (0, 0, 255)

# 创建屏幕
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Mouse Trail")

# 小球属性
ball_radius = 20
ball_color = blue

# 小球的位置和速度
ball_pos = [screen_width // 2, screen_height // 2]
ball_speed = [0, 0]

# 尾迹属性
trail_length = 50
trail = []

# 游戏循环
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 更新小球位置
    ball_speed = pygame.mouse.get_rel()
    ball_pos[0] += ball_speed[0]
    ball_pos[1] += ball_speed[1]

    # 限制小球在屏幕范围内
    ball_pos[0] = max(min(ball_pos[0], screen_width - ball_radius), ball_radius)
    ball_pos[1] = max(min(ball_pos[1], screen_height - ball_radius), ball_radius)

    # 添加小球当前位置到尾迹
    trail.append(ball_pos.copy())
    if len(trail) > trail_length:
        trail.pop(0)

    # 清空屏幕
    screen.fill(white)

    # 绘制尾迹
    for i in range(len(trail) - 1):
        start_pos = trail[i]
        end_pos = trail[i + 1]
        alpha = int(i / trail_length * 255)
        pygame.draw.line(screen, (ball_color[0], ball_color[1], ball_color[2], alpha), start_pos, end_pos, ball_radius * 2)

    # 更新屏幕
    pygame.display.flip()

    # 控制帧率
    pygame.time.Clock().tick(60)

pygame.quit()
sys.exit()
```



## 代码-小球运动尾迹-渐变色线条：
```python
import pygame
import random

# 初始化Pygame
pygame.init()

# 屏幕尺寸
screen_width = 800
screen_height = 600

# 创建屏幕
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_icon(pygame.image.load('logo.png').convert())
pygame.display.set_caption('编程启航')

# 时钟
clock = pygame.time.Clock()

# 起始和结束颜色
start_color = (255, 0, 0)
end_color = (0, 0, 255)

# 历史轨迹列表
trail = []

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 添加当前鼠标位置到历史轨迹列表
    trail.append(pygame.mouse.get_pos())

    # 限制历史轨迹长度
    if len(trail) > 50:
        trail.pop(0)

    # 渐变色索引
    gradient_index = 0

    # 清空屏幕
    screen.fill((0, 0, 0))

    # 绘制历史轨迹
    for i in range(1, len(trail)):
        start_point = trail[i - 1]
        end_point = trail[i]

        # 计算渐变色
        gradient_ratio = i / len(trail)
        gradient_color = [
            int(start_color[j] * (1 - gradient_ratio) + end_color[j] * gradient_ratio)
            for j in range(3)
        ]

        pygame.draw.line(screen, gradient_color, start_point, end_point, 5)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
```



## 文案-渐变线条拖尾实现
这一集我们用几分钟来实现视频中的渐变线条拖尾效果，

1. 使用粒子效果： 将尾迹看作是粒子，每个粒子代表小球的一个位置。然后，使用粒子系统来管理和绘制这些粒子，创建一个流畅的尾迹效果。
2. 使用渐隐的小球： 类似之前的方法，但绘制的不是线条，而是一系列逐渐透明的小球。每个小球的颜色和透明度与位置相关。
3. 使用纹理图： 创建一个尾迹纹理图，其中包含了一系列逐渐透明的图像，表示小球的位置。然后在每个帧中，更新纹理图的内容，绘制到屏幕上。
4. 使用历史轨迹： 不仅记录当前位置，还记录小球的历史位置。在每个帧中，使用历史位置来绘制一个轨迹线。
5. 使用渐变色的线条： 使用渐变色的线条连接小球的历史位置，使得尾迹的颜色从小球的颜色逐渐过渡到背景色。
6. 使用矢量图形库： 使用支持矢量图形的库，如 SVG，来创建动态的矢量尾迹效果。

哪种方法更好取决于你的目标和项目需求。例如，粒子效果可以实现非常流畅的尾迹，但可能需要更多的计算资源。使用纹理图可能会在一定程度上降低计算量，但需要创建和管理纹理。使用历史轨迹可能较简单，但效果可能相对简单。最终的选择应该根据你想要的视觉效果、项目要求和性能要求来做出。
