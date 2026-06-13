---
title: "P5-数字粒子消散"
created_at: 2024-12-20 23:03:53
updated_at: 2024-12-20 23:03:53
---

# P5-数字粒子消散

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
pygame.display.set_caption("数字粒子逐渐消散效果")

# 字体设置
font = pygame.font.Font(None, 200)
text_surface = font.render("5", True, (0, 0, 0))

# 粒子类
class Particle:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color
        self.radius = 3
        self.speed_x = random.uniform(-1, 1)
        self.speed_y = random.uniform(-1, 1)
        self.alpha = 255

    def update(self):
        self.x += self.speed_x
        self.y += self.speed_y
        self.alpha -= 1

    def draw(self):
        self.color = (self.color[0], self.color[1], self.color[2], self.alpha)
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)

clock = pygame.time.Clock()

particles = []
exploded = False

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.MOUSEBUTTONDOWN and not exploded:
            exploded = True
            for x in range(text_surface.get_width()):
                for y in range(text_surface.get_height()):
                    color = text_surface.get_at((x, y))
                    if color.a != 0:
                        particle = Particle(screen_width // 2 + x - text_surface.get_width() // 2,
                                            screen_height // 2 + y - text_surface.get_height() // 2,
                                            color)
                        particles.append(particle)

    # 填充背景色
    screen.fill((255, 255, 255))

    # 更新和绘制粒子
    for particle in particles:
        particle.update()
        particle.draw()

    # 更新屏幕
    pygame.display.flip()

    clock.tick(60)  # 控制帧率

pygame.quit()
```
