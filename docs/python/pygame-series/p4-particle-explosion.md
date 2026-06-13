---
title: "P4-点击后粒子爆炸"
created_at: 2024-12-20 23:03:00
updated_at: 2024-12-20 23:03:00
---

# P4-点击后粒子爆炸

## 点击后粒子爆炸（简陋点）
```python
import pygame
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

class Particle(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((2, 2))
        self.color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        self.image.fill(self.color)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.gravity = 0.02
        self.vel_x = random.uniform(-2, 2)
        self.vel_y = random.uniform(-2, 2)
        self.alpha = 255

    def update(self):
        self.vel_y += self.gravity
        self.rect.x += self.vel_x
        self.rect.y += self.vel_y
        self.alpha -= 5
        if self.alpha <= 0:
            self.kill()
        else:
            self.image.set_alpha(self.alpha)

particles = pygame.sprite.Group()

def create_particles(x, y):
    for _ in range(50):
        p = Particle(x, y)
        particles.add(p)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            create_particles(*event.pos)

    particles.update()

    screen.fill((0, 0, 0))
    particles.draw(screen)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
```

## 点击后粒子爆炸
```python
import pygame
import random
# 初始化 Pygame
pygame.init()
# 设置画布尺寸
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("数字粒子消散")
# 设置字体
font = pygame.font.Font(None, 200)
# 设置颜色
WHITE = (255, 255, 255)
# 定义粒子类
class Particle(pygame.sprite.Sprite):
    def __init__(self, pos):
        super().__init__()
        self.image = pygame.Surface((10, 10))
        self.color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        self.image.fill(self.color)

        self.rect = self.image.get_rect()
        self.rect.center = pos
        self.vx = random.randint(-5, 5)
        self.vy = random.randint(-5, 5)
        self.gravity = 0.1
        self.alpha = 255
    def update(self):
        self.vx *= 0.99
        self.vy += self.gravity
        self.rect.x += self.vx
        self.rect.y += self.vy
        self.alpha -= 5
        self.image.set_alpha(self.alpha)
        if self.alpha <= 0:
            self.kill()
# 主循环
running = True
clock = pygame.time.Clock()
particles = pygame.sprite.Group()
while running:
    clock.tick(60)
    # 处理事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            # 获取鼠标点击位置
            mouse_pos = pygame.mouse.get_pos()

            # 清空之前的粒子
            # particles.empty()

            # 获取当前按下的数字
            number_text = font.render("8", True, WHITE)
            number_rect = number_text.get_rect()

            # 在鼠标点击位置显示数字
            number_rect.center = mouse_pos
            screen.blit(number_text, number_rect)

            # 将数字转换为粒子并添加到粒子组中
            for x in range(number_rect.left, number_rect.right, 10):
                for y in range(number_rect.top, number_rect.bottom, 10):
                    particles.add(Particle((x, y)))
    # 更新粒子
    particles.update()
    # 清空画布
    screen.fill((0, 0, 0))
    # 绘制粒子
    particles.draw(screen)
    # 刷新画布
    pygame.display.flip()
# 退出 Pygame
pygame.quit()
```
