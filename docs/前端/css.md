# CSS

## 首行缩进

```html
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>段落缩进</title>
<style>
    .p1{text-indent: 40px;}
    .p2{text-indent: 3em;}
</style>
</head>
<body>
    <p class="p1">斯蒂芬·库里（Stephen Curry），1988年3月14日出生于美国俄亥俄州阿克伦（Akron,Ohio），美国职业篮球运动员，司职控球后卫，效力于NBA金州勇士队。</p>
    <p class="p2">斯蒂芬·库里于2009年通过选秀进入NBA后一直效力于勇士队，新秀赛季入选最佳新秀第一阵容；2014-15、2016-17、2017-18赛季三次随勇士队获得NBA总冠军；两次当选常规赛MVP，两次入选最佳阵容第一阵容，5次入选全明星赛西部首发阵容。</p>
</body>
</html>
```

## 隐藏页面滚动条

```css
::-webkit-scrollbar {
  display: none;
}
```
## 年度色

```css
2023
#AB2542	#6768A7	#939597	#F3DD69	#214E7E	#EF7A68	#5A4F87	#8FB058
```

## 设置按钮悬浮旋转点击缩小动画
```css
#setting{
    width: 50px;
    height: 50px;
    position: fixed;
    right: 10px;
    top: 10px;
    transition: all ease 0.5s;
    
    z-index: 1;
}
#setting:hover{
    cursor: pointer;
    transform:rotate(180deg);
}
#setting:active{
    transform: scale(0.8);
}
```
## 发光

```css
box-shadow: 0 0 5px #03e9f4,
0 0 25px #03e9f4,
0 0 50px #03e9f4,
0 0 100px #03e9f4;
```

内凹阴影 

```
内凹阴影
box-shadow: inset 0.2rem 0.2rem 0.5rem #c8d0e7, inset -0.2rem -0.2rem 0.5rem #FFFFFF;

外凸阴影
box-shadow: 0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #FFFFFF;

logo悬浮效果
margin:0.5px;opacity:0.5;

3D盒子翻转父亲
transition: all 0.3s;transform-style: preserve-3d;

底部
transform: translateY(17.5px) rotateX(-90deg);

```

外凸 `box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);`

内凹阴影：`box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;`
内凹聚焦（更凹）：`box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;`
圆形外凸box-shadow: `0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #FFFFFF;`


未登录不能访问 `<% if(session.getAttribute("flag")==null){response.sendRedirect("error.jsp");}%>`

颜色:`root { --primary-light: #8abdff; --primary: #6d5dfc; --primary-dark: #5b0eeb; --white: #FFFFFF; --greyLight-1: #E4EBF5; --greyLight-2: #c8d0e7; --greyLight-3: #bec8e4; --greyDark: #9baacf; }`



## 输入框去掉边框



```css
input{
    outline: none;
    border: none;
}
```

## 禁止文字元素被选中

```css
user-select:none;
```

### 去掉ul样式

```css
list-style-type: none;
```

### 文字超出div用省略号表示

```css
.d-elip {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}
```

## 鼠标悬浮前后阴影

```css
box-shadow: 0 0 1px rgba(0, 0, 0, 0);
box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
```

### div太长或太宽添加滚动条

```css
overflow: auto;

隐藏滚动条
::-webkit-scrollbar{width:0;}
```

