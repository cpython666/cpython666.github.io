---
title: "反爬之行为检测-鼠标与按钮位置匹配"
created_at: 2025-01-21 00:26:18
updated_at: 2025-01-21 00:26:18
---

# 反爬之行为检测-鼠标与按钮位置匹配

前面的反爬视频我们略微提到过一嘴行为监测，提到过一个比如说点击按钮触发的事件，如果你点击按钮的时候鼠标不在按钮附近就说明是异常行为，那么就可以不执行按钮调用的函数。或者是给你记录下来。

这里我们简单实现了一个小例子。

这里我们来看下效果。



原理其实就是看鼠标的位置是不是在按钮的范围中，如果在那就是合理的，不然就是不合理的。

但是有一个问题是鼠标的位置其实是电脑层面的，浏览器页面获取鼠标的位置只能是基于鼠标的移动事件获取，点击也是获取的点击事件。

所以说单纯获取点击事件是不行的。点击事件肯定是在按钮范围的。所以我想了下又判断了下鼠标是否移动过，也就是说如果你自动化打开页面但是你的鼠标都没有在页面动过，就点击按钮触发了事件的话的话，那么你可能就不是真人的行为。

当然你点击按钮的之前，鼠标的移动事件的位置应该也是在按钮位置的，这里我们就没有做这一层校验了。只是在这里说下大家知道就好了。

这可以应对什么情况呢？就是只会使用自动化打开页面的那种，如果你使用逆向请求接口的话这个行为监测其实是不影响你的。

所以自动化怎么应对呢？可以真正的拖动鼠标到按钮的位置然后点一下，就是使用pyautogui。

### demo页面

```python
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mouse Click Detection</title>
  <style>
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <button id="clickButton">Click Me!</button>
  <p id="message"></p>

  <script>
    const button = document.getElementById('clickButton');
    const message = document.getElementById('message');
    
    // 获取按钮位置
    const buttonRect = button.getBoundingClientRect();

    button.addEventListener('click', (event) => {
      // 获取鼠标点击位置
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // 检查鼠标位置与按钮位置是否匹配
      const isRealClick = mouseX >= buttonRect.left && mouseX <= buttonRect.right &&
                          mouseY >= buttonRect.top && mouseY <= buttonRect.bottom;

      if (isRealClick) {
        message.textContent = '真人点击成功!';
      } else {
        message.textContent = '按钮未被真人点击!';
      }
    });
  </script>
</body>
</html>
```

### 加上鼠标移动检测

```python
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mouse Click Detection with Movement</title>
  <style>
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <button id="clickButton">Click Me!</button>
  <p id="message"></p>

  <script>
    const button = document.getElementById('clickButton');
    const message = document.getElementById('message');

    let mouseMoved = false;

    // 监听鼠标移动事件
    document.addEventListener('mousemove', () => {
      mouseMoved = true;
    });

    // 获取按钮的位置
    const buttonRect = button.getBoundingClientRect();

    button.addEventListener('click', (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const isRealClick = mouseX >= buttonRect.left && mouseX <= buttonRect.right &&
                          mouseY >= buttonRect.top && mouseY <= buttonRect.bottom;

      if (isRealClick) {
        if (mouseMoved) {
          message.textContent = '真人点击成功!';
        } else {
          message.textContent = '鼠标没有移动，可能是模拟点击!';
        }
      } else {
        message.textContent = '按钮未被真人点击!';
      }

      // 重置鼠标是否移动的状态
      mouseMoved = false;
    });
  </script>
</body>
</html>
```

### 点击按钮

```python
// 模拟点击事件
const event = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: window
});
document.querySelector('button').dispatchEvent(event);
```

## dp点击按钮

```python
from DrissionPage import Chromium

broswer=Chromium()
tab=broswer.new_tab()
tab.get('http://127.0.0.1:5500/click-btn-demo.html')
tab.ele('text:Click M').click()
```
