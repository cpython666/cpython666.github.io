---
title: "看似最简单，实则很难的验证码【爬虫反爬】"
created_at: 2025-03-30 16:53:04
updated_at: 2025-03-30 16:53:04
---

# 看似最简单，实则很难的验证码【爬虫反爬】

## 验证码种类

### 无感验证码

展示或者不展示，不需要用户进行交互，对于用户是没有感觉的

![](/imgs/spider/anti-crawler-game/captcha-example-overview.png)

### 交互类验证码

![](/imgs/spider/anti-crawler-game/captcha-slider-track.png)

![](/imgs/spider/anti-crawler-game/captcha-image-processing.png)

![](/imgs/spider/anti-crawler-game/captcha-request-flow.png)

![](/imgs/spider/anti-crawler-game/captcha-verification-demo.png)

### 字符图片问题类验证码

[http://www.stardream.vip/captcha](http://www.stardream.vip/captcha)

![](/imgs/spider/anti-crawler-game/captcha-final-result.png)

![](/imgs/spider/anti-crawler-game/captcha-background-image.png)

![](/imgs/spider/anti-crawler-game/captcha-gap-detection-1.png)

![](/imgs/spider/anti-crawler-game/captcha-gap-detection-2.png)

![](/imgs/spider/anti-crawler-game/captcha-gap-detection-3.png)

### 滑块验证码




## 看似简单的验证码

复杂的ocr，要理解问题的语义，执行操作

监测轨迹，监测环境

寻找体验和效果之间的平衡，（也可能考虑一点点成本）

x和gpt的注册验证码，手指朝向（体验不好，难度大，但大平台可以忽略这些缺点）

有了上面的小总结之后，就可以开始今天的主题了，就是看似最简单，实则很难的验证码，其实就是我们可能最开始接触的一种验证码就是字符验证码，识别字符输入即可，那么我们为什么又说他实则很难呢？就是我们可以将刚才那些其他类型的验证码的思路加到字符验证码里，比如说轨迹识别，输入验证码答案的时候我们也可以监听键盘事件，tab键没有按或者是鼠标没有点击输入框怎么会获取焦点呢，键盘都没有按怎么会输入字符呢？去点击登录按钮的时候我们也可以获取鼠标轨迹。

所以最简单的字符类也可以：限流+环境监测+行为监测（键盘事件+鼠标轨迹）+难度大的验证码
