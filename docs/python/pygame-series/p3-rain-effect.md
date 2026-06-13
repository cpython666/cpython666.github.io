---
title: "P3-下雨特效"
created_at: 2024-12-20 23:02:38
updated_at: 2024-12-20 23:02:38
---

# P3-下雨特效

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
pygame.display.set_caption("雨滴特效")

# 雨滴数量
num_drops = 100

# 创建雨滴列表
raindrops = []
for _ in range(num_drops):
    raindrop = [random.randint(0, screen_width), random.randint(0, screen_height)]
    raindrops.append(raindrop)

# 定义颜色
white = (255, 255, 255)
blue = (0, 0, 255)

clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # 更新雨滴位置
    for i in range(num_drops):
        raindrops[i][1] += 5  # 垂直向下移动
        if raindrops[i][1] > screen_height:
            raindrops[i][1] = 0  # 重新回到屏幕顶部
            raindrops[i][0] = random.randint(0, screen_width)  # 随机新的水平位置

    # 填充背景色
    screen.fill(white)

    # 绘制雨滴
    for raindrop in raindrops:
        pygame.draw.circle(screen, blue, raindrop, 2)

    # 更新屏幕
    pygame.display.flip()

    clock.tick(60)  # 控制帧率

pygame.quit()
```
