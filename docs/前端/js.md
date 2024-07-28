# JS



## 获取cookie

```
document.cookie
```

格式化输出下

```js
function getCookie(name) {
    var cookieArr = document.cookie.split(";");

    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        console.log(cookiePair[0],cookiePair[1]);
    }

    // 如果没有找到，返回 null
    return null;
}

// 获取 'timestamp' Cookie 的值
var timestampValue = getCookie();
```

寻找某个名称的cookie

```js
function getCookie(name) {
    var cookieArr = document.cookie.split(";");

    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        // 删除 cookie 名称前的空格并比较
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // 如果没有找到，返回 null
    return null;
}

// 获取 'timestamp' Cookie 的值
var timestampValue = getCookie('timestamp');
if (timestampValue) {
    console.log('Timestamp Cookie value:', timestampValue);
} else {
    console.log('Timestamp Cookie not found or expired.');
}
```



## 获取一个元素并且设置高度

```js
    const header = document.querySelector('header');
	const bg = document.querySelector('#big-bg');
	console.log(header.clientHeight)
	const headerHeight = header.clientHeight;
	console.log(headerHeight)
	bg.style.height = `calc(100vh - ${headerHeight}px)`;
```


## js显示当前时间

```js
var t = null;
t = setTimeout(time, 1000); //開始运行
function time() {
    clearTimeout(t); //清除定时器
    dt = new Date();
    var y = dt.getFullYear();
    var mt = dt.getMonth() + 1;
    var day = dt.getDate();
    var h = dt.getHours(); //获取时
    var m = dt.getMinutes(); //获取分
    var s = dt.getSeconds(); //获取秒
    document.querySelector(".showTime").innerHTML =
        "当前时间：" +
        y +
        "年" +
        mt +
        "月" +
        day +
        "-" +
        h +
        "时" +
        m +
        "分" +
        s +
        "秒";
    t = setTimeout(time, 1000); //设定定时器，循环运行
}
```

## 距离某个时间过了多久

```js
function runtime(){
        // 初始时间，日/月/年 时:分:秒
        X = new Date("3/10/2022 15:32:00");
        Y = new Date();
        T = (Y.getTime()-X.getTime());
        M = 24*60*60*1000;
        a = T/M;
        A = Math.floor(a);
        b = (a-A)*24;
        B = Math.floor(b);
        c = (b-B)*60;
        C = Math.floor((b-B)*60);
        D = Math.floor((c-C)*60);
        //信息写入到DIV中
        document.getElementById("runtime").innerHTML = "星梦已启航: "+"<font style='color:#FFA500;font-weight:bold'>"+A+"</font>"+"天"+"<font style='color:#8A2BE2;font-weight:bold'>"+B+"</font>"+"小时<font style='color:#1DBF97;font-weight:bold'>"+C+"</font>分<font style='color:#007EC6;font-weight:bold'>"+D+"</font>秒"
    }
    setInterval(runtime, 1000);
```

## js列表操作

```js
//添加元素
l1.push()
//反转列表，无返回值
l1.reverse()
```

## 获取当前页面链接



```javascript
var url=window.location.href
```



## 获取某个元素并点击



```javascript
var login=document.getElementById('loginClose')
login.click()
```

### 生成列表中随机一个元素



```javascript
var arrStr = ['Mehvish', 'Tahir', 'John', 'Sania', 'Thomas']
var randElement = arrStr[Math.floor(Math.random() * arrStr.length)];
console.log(randElement);
```

## 匿名立即执行函数



```javascript
(function (){console.log("我是正常的函数。。。JK");})();
```



## 无参数匿名立即执行箭头函数



```plain
(() => { console.log("无参数的箭头函数。。。");})();
```

## JS数组排序



```javascript
list.sort((a, b) => {
  return a - b // 升序
})
```

### 回到顶部
```javascript
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
```

### 锚点
```javascript
const scrollToAnchor = (anchor) => {
	const target = document.querySelector(anchor);
	if (target) {
		target.scrollIntoView({ behavior: 'smooth' });
	}
}
```
### 锚点被导航栏覆盖
```javascript
const scrollToAnchor = (anchor) => {
    const target = document.querySelector(anchor);
    if (target) {
        const navHeight = document.querySelector('header').offsetHeight; // 获取导航栏的高度
        const offset = target.getBoundingClientRect().top - navHeight; // 计算滚动偏移量
        window.scrollTo({ top: offset, behavior: 'smooth' }); // 滚动到目标位置
    }
}
```