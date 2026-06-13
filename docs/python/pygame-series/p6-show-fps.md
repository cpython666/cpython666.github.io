---
title: "P6-画面显示fps"
created_at: 2024-12-20 23:04:10
updated_at: 2024-12-20 23:04:10
---

# P6-画面显示fps

```python
import pygame

pygame.init()

# 定义窗口尺寸
screen_width = 800
screen_height = 600

# 创建窗口
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("显示帧率示例")

# 创建Clock对象用于控制帧率
clock = pygame.time.Clock()

# 定义字体和字体大小
font = pygame.font.Font(None, 30)

running = True
while running:
    # 清空屏幕
    screen.fill((0, 0, 0))

    # 计算帧率
    fps = int(clock.get_fps())

    # 将帧率渲染到屏幕上
    text = font.render("FPS: " + str(fps), True, (255, 255, 255))
    screen.blit(text, (10, 10))

    # 更新屏幕
    pygame.display.flip()

    # 控制帧率为 60
    clock.tick(60)

    # 处理退出事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```
