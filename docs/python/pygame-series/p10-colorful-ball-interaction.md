---
title: "P10-炫彩小球交互效果-pygame实现"
created_at: 2024-12-20 23:08:34
updated_at: 2024-12-20 23:08:34
---

# P10-炫彩小球交互效果-pygame实现

## 文案-炫彩小球交互效果-pygame实现
这一集我们用几分钟来实现视频中的效果，不要看有那么多的小球，这在我们的代码中只由一个变量所控制。不要看有这么多种颜色，它只是使用了一个随机数。总之就是非常非常简单，你甚至不需要有任何的知识准备。需要声明的是，我们的系列课程中，使用的是pygame这个工具，但这从来不意味着你只能使用pygame能实现这个效果，我们要掌握思维，掌握原理，要明白只要有一张画布，给你操作，你就可以画出来。举一反三，在前端这张画布可以是canvas，在别的语言依旧可以。好了，教程现在开始。

我们先讲效果实现思路，再讲效果的实现代码。下面我们将一步一步演示效果的形成。

依旧是最开始的开始，我们有一个白色的画布，还有一个画笔，我们可以轻易地在画布上画上一个圆，一个圆有什么属性呢？位置，也就是x，y坐标，颜色，大小。

那么如何让圆动起来，无非就是改变圆的位置，当然，你不能随意随机的改变小球的位置，那样会让圆在画布中随机闪烁出现，那么如何让圆合理的运动呢？就是让圆符合我们物理世界的定律，我们的世界中，物体有速度，才会运动。那么我们可以给圆设置一个x轴的速度，圆就可以在水平方向上运动，当圆碰到了边界，我们将圆的x轴速度取相反数，这样就实现了圆碰到边界被反弹的效果。同理，我们可以给圆加上y轴的速度，这样就实现了一个圆在屏幕内运动的效果。

那么要画出多个圆，我们只需要定义一个圆数组，再写一个循环向其中添加圆即可。接下来是如何实现鼠标移动上去圆变大，移走圆变小的效果。

首先我们需要获取鼠标的位置，设定一个范围，作为鼠标的影响半径。我们再给圆设置一个最小半径和最大半径，设置一个增长速度和一个减小速度，因为圆一瞬间变大一瞬间变小会显得突兀。我们可以将圆心在半径中的圆标记为悬浮状态，否则就是未悬浮状态。然后在绘制每一个圆的过程中，判断圆是否处于悬浮状态，如果是，我们可以让圆开始增长，但显然，增长不会超过元的最大半径。缩小同理。

没错，就这样我们便实现了屏幕中的效果。

现在，我们来看看具体的代码：我相信在前面原理的讲解后代码对于你会非常直观且简单。

首先，我们定义了一个球类，在它的初始化函数中，我们定义了他的最大最小半径信息，初始坐标信息，颜色属性，运动速度和是否是鼠标悬浮状态。

然后是球类的更新函数，更新运动后的位置，如果碰到边界就改变相应方向速度，如果是鼠标悬浮状态就改变自己的大小。

在球类的绘制函数中，我们使用的是pygame的防锯齿画法。

之后，我们在程序的开始定义了一个数组，存储指定数量的圆，然后在主程序的循环中，不断获取鼠标的位置，再根据鼠标的位置去改变小球的悬浮状态，然后更新小球信息。

最后画出它们，程序就是这样，是不是很简单，现在我们再来看一下它的效果。

当然，我们在过程中也会发现一些有趣的事情，比如，如果我们没有将圆的颜色设置为它们的固有属性，而是每次绘制都是随机的，那么便会出现这样的效果。

好了，本集内容到此结束，更多内容关注up主~

## 代码片段
### 基础模板
```python
#导入所需的模块
import sys
import pygame

# 使用pygame之前必须初始化
pygame.init()

# 设置主屏窗口
screen = pygame.display.set_mode((400,400))

# 设置窗口的标题，即游戏名称
pygame.display.set_icon(pygame.image.load('1.png').convert())
pygame.display.set_caption('编程启航')


# 固定代码段，实现点击"X"号退出界面的功能，几乎所有的pygame都会使用该段代码
while True:
    # 循环获取事件，监听事件状态
    for event in pygame.event.get():
        # 判断用户是否点了"X"关闭按钮,并执行if代码段
        if event.type == pygame.QUIT:
            #卸载所有模块
            pygame.quit()
            #终止程序，确保退出程序
            sys.exit()
    pygame.display.flip() #更新屏幕内容
```

```python
import pygame

pygame.init()

screen = pygame.display.set_mode((400,400))
pygame.display.set_icon(pygame.image.load('1.png').convert())
pygame.display.set_caption('编程启航')

running=True
while running:
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running=False
            
    pygame.display.flip()
    
pygame.quit()
```

### 弹来弹去的小球
```python
import pygame
import sys

# 初始化Pygame
pygame.init()

# 设置屏幕大小
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("自动移动的小球")

# 小球的初始位置、速度和方向
ball_radius = 20
ball_x = screen_width // 2
ball_y = screen_height // 2
ball_speed_x = 5
ball_speed_y = 3

# 定义颜色
white = (255, 255, 255)
ball_color = (0, 0, 255)

clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 更新小球位置
    ball_x += ball_speed_x
    ball_y += ball_speed_y

    # 碰撞检测，反弹
    if ball_x - ball_radius <= 0 or ball_x + ball_radius >= screen_width:
        ball_speed_x = -ball_speed_x
    if ball_y - ball_radius <= 0 or ball_y + ball_radius >= screen_height:
        ball_speed_y = -ball_speed_y

    # 填充背景色
    screen.fill(white)

    # 绘制小球
    pygame.draw.circle(screen, ball_color, (ball_x, ball_y), ball_radius)

    # 更新屏幕
    pygame.display.flip()

    clock.tick(60)  # 控制帧率

pygame.quit()
```

### 上下左右移动小球
```python
import pygame
import sys

# 初始化Pygame
pygame.init()

# 设置屏幕大小
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("移动的小球")

# 小球的初始位置和速度
ball_radius = 20
ball_x = screen_width // 2
ball_y = screen_height // 2
ball_speed = 5

# 定义颜色
white = (255, 255, 255)
ball_color = (0, 0, 255)

clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 获取键盘输入
    keys = pygame.key.get_pressed()
    
    # 更新小球位置
    if keys[pygame.K_LEFT]:
        ball_x -= ball_speed
    if keys[pygame.K_RIGHT]:
        ball_x += ball_speed
    if keys[pygame.K_UP]:
        ball_y -= ball_speed
    if keys[pygame.K_DOWN]:
        ball_y += ball_speed

    # 确保小球在屏幕范围内
    ball_x = max(ball_radius, min(ball_x, screen_width - ball_radius))
    ball_y = max(ball_radius, min(ball_y, screen_height - ball_radius))

    # 填充背景色
    screen.fill(white)
    
    # 绘制小球
    pygame.draw.circle(screen, ball_color, (ball_x, ball_y), ball_radius)
    
    # 更新屏幕
    pygame.display.flip()
    
    clock.tick(60)  # 控制帧率

pygame.quit()
```

### 鼠标悬浮小球变大
```python
import pygame
import sys
import random

# 初始化Pygame
pygame.init()

# 设置屏幕大小
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("交互小球")

# 小球数量
num_balls = 5

# 创建小球列表
balls = []
for _ in range(num_balls):
    ball = {
        "x": random.randint(0, screen_width),
        "y": random.randint(0, screen_height),
        "radius": 20,
        "color": (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
        "is_hovered": False
    }
    balls.append(ball)

# 定义颜色
white = (255, 255, 255)

clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 获取鼠标位置
    mouse_x, mouse_y = pygame.mouse.get_pos()

    # 更新小球状态
    for ball in balls:
        distance = ((ball["x"] - mouse_x)**2 + (ball["y"] - mouse_y)**2)**0.5
        if distance < ball["radius"]:
            ball["is_hovered"] = True
        else:
            ball["is_hovered"] = False

    # 填充背景色
    screen.fill(white)

    # 绘制小球
    for ball in balls:
        if ball["is_hovered"]:
            ball["radius"] = 30
        else:
            ball["radius"] = 20
        pygame.draw.circle(screen, ball["color"], (ball["x"], ball["y"]), ball["radius"])

    # 更新屏幕
    pygame.display.flip()

    clock.tick(60)  # 控制帧率

pygame.quit()
```

### 鼠标悬浮小球变大运动小球
```python
import pygame
import sys
import random

# 初始化Pygame
pygame.init()

# 设置屏幕大小
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("交互小球")

# 小球数量
num_balls = 5

# 创建小球列表
balls = []
for _ in range(num_balls):
    ball = {
        "x": random.randint(0, screen_width),
        "y": random.randint(0, screen_height),
        "radius": 20,
        "color": (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
        "is_hovered": False,
        "speed_x": random.randint(-3, 3),
        "speed_y": random.randint(-3, 3)
    }
    balls.append(ball)

# 定义颜色
white = (255, 255, 255)

clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 获取鼠标位置
    mouse_x, mouse_y = pygame.mouse.get_pos()

    # 更新小球状态和位置
    for ball in balls:
        distance = ((ball["x"] - mouse_x)**2 + (ball["y"] - mouse_y)**2)**0.5
        if distance < ball["radius"]:
            ball["is_hovered"] = True
        else:
            ball["is_hovered"] = False

        # 更新小球位置
        ball["x"] += ball["speed_x"]
        ball["y"] += ball["speed_y"]

        # 碰撞检测，反弹
        if ball["x"] - ball["radius"] <= 0 or ball["x"] + ball["radius"] >= screen_width:
            ball["speed_x"] = -ball["speed_x"]
        if ball["y"] - ball["radius"] <= 0 or ball["y"] + ball["radius"] >= screen_height:
            ball["speed_y"] = -ball["speed_y"]

    # 填充背景色
    screen.fill(white)

    # 绘制小球
    for ball in balls:
        if ball["is_hovered"]:
            ball["radius"] = 30
        else:
            ball["radius"] = 20
        pygame.draw.circle(screen, ball["color"], (ball["x"], ball["y"]), ball["radius"])

    # 更新屏幕
    pygame.display.flip()

    clock.tick(60)  # 控制帧率

pygame.quit()
```



### 移动变化小球效果改进版（防锯齿）
```python
import pygame
import sys
import random
from pygame import gfxdraw

class Ball:
    def __init__(self):
        self.min_radius = random.randint(3,10)
        self.max_radius=self.min_radius+ random.randint(10,15)
        self.radius = self.min_radius+30
        self.x = random.randint(0+self.radius, screen_width-self.radius)
        self.y = random.randint(0+self.radius, screen_height-self.radius)
        self.color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        self.speed_x = random.uniform(0.1,0.3)*random.choice([-1, 1])
        self.speed_y =random.uniform(0.1,0.3)*random.choice([-1, 1])
        self.is_hovered = False

    def update(self):
        self.x += self.speed_x
        self.y += self.speed_y

        if self.x - self.radius <= 0 or self.x + self.radius >= screen_width:
            self.speed_x = -self.speed_x
        if self.y - self.radius <= 0 or self.y + self.radius >= screen_height:
            self.speed_y = -self.speed_y

        if self.is_hovered:
            self.radius=self.radius+1 if self.radius<self.max_radius else self.radius
        else:
            self.radius=self.radius-1 if self.radius>self.min_radius else self.radius

    def draw(self):
        # 画出抗锯齿的圆
        gfxdraw.aacircle(screen,int(self.x), int(self.y), self.radius,self.color)
        gfxdraw.filled_circle(screen,int(self.x), int(self.y), self.radius,self.color)

        # pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)

# 初始化Pygame，设置屏幕大小，设置窗口的图标及标题
pygame.init()
screen_width = 1000
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_icon(pygame.image.load('logo.png').convert())
pygame.display.set_caption('编程启航')
clock = pygame.time.Clock()

# 生成指定数量的圆
num_balls = 1000
balls = [Ball() for _ in range(num_balls)]

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 获取鼠标位置
    mouse_x, mouse_y = pygame.mouse.get_pos()

    # 更新小球状态
    for ball in balls:
        # 计算鼠标与小球圆心的距离
        distance = ((ball.x - mouse_x)**2 + (ball.y - mouse_y)**2)**0.5
        if distance < ball.radius+50:
            ball.is_hovered = True
        else:
            ball.is_hovered = False

        ball.update()

    # 填充背景色
    screen.fill((255, 255, 255))

    # 绘制小球
    for ball in balls:
        ball.draw()

    pygame.display.flip() # 更新屏幕

    clock.tick(60)  # 控制帧率

pygame.quit()
```
