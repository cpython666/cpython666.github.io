---
title: "P9-代码-鼠标环形文字旋转动画特效"
created_at: 2024-12-20 23:06:52
updated_at: 2024-12-20 23:06:52
---

# P9-代码-鼠标环形文字旋转动画特效

```python
import pygame
import math

# 初始化Pygame，设置窗口尺寸和标题，定义背景颜色
pygame.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("编程启航")
white = (255, 255, 255)

# 获取文本渲染所需的矩形
def get_text_rect(text, font):
    text_surface,rect = font.render(text, (0, 0, 0))
    return text_surface, text_surface.get_rect()

running = True
clock = pygame.time.Clock()
font = pygame.freetype.Font('./assets/fonts/铁蒺藜体/Tiejili Regular.ttf', 36)
angle = 0
radius = 150

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 清屏
    screen.fill(white)

    # 获取鼠标位置
    mouse_x, mouse_y = pygame.mouse.get_pos()

    angle += 0.02  # 每帧增加的角度
    num_points = 5

    for i in range(num_points):
        angle_offset = i * (2 * math.pi / num_points)
        x = int(mouse_x + radius * math.cos(angle + angle_offset))
        y = int(mouse_y + radius * math.sin(angle + angle_offset))

        text = "编程启航"
        text_surface, text_rect = get_text_rect(text, font)
        text_rect.center = (x, y)

        screen.blit(text_surface, text_rect)

    pygame.display.flip()
    clock.tick(60)

# 退出Pygame
pygame.quit()
```
