# HTML

## 设置网页logo
```html
<link rel="icon" type="image/x-icon" href="./favicon.ico" />
```
## 引入css文件

```html
<link rel="stylesheet" type="text/css" href="./css/shop.css">
```

## 原始表单登录
```html
<form action="login2.jsp" method=post>
    <input type="text" name="username" placeholder="用户名">
    <input type="password" name="passwd" placeholder="密码">
    <button type="submit">登录</button>
</form>
```

## 页面空格
```html
1. &nbsp; ：一个字符的半角的不断行的空格，如果需要在网页中插入多个空格，可以将“&nbsp;”代码写多遍；

2. &ensp; ：一个字符的半角的空格，也可以将“&ensp;”写多遍来插入多个空格；

3. &emsp; ：两个字符的全角的空格，也可以将“&emsp;”写多遍来插入更多的空格；

4. &thinsp; ：小于一个字符的空格；

```