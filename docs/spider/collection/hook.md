<a name="ZET0W"></a>

# Hook 通用模板
[该篇文章搬运自：虫盒](https://spiderbox.cn/#)
```javascript
(function () {
    let oldFunc = func;
    func = function (arguments) {
        console.log(arguments);
        return oldFunc.apply(arguments);
    };
})();
```

<a name="OtJi5"></a>

## Hook Cookie

```javascript
(function () {
  let cookieCache = "";
  Object.defineProperty(document, "cookie", {
    set: function (val) {
      console.log("Hook set cookie => ", val);
      if (val.indexOf("pythondouluo") !== -1) {
        debugger;
      }
      cookieCache = val;
      return val;
    },
    get: function () {
      return cookieCache;
    }
  });
})();
```

<a name="jrKip"></a>

## Hook Request Header

```javascript
(function () {
    let headerCache = window.XMLHttpRequest.prototype.setRequestHeader;
    window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        console.log("Hook set header %s => %s", key, value);
        if (key === "pythondouluo") {
            debugger;
        }
        return headerCache.apply(this, arguments);
    };
})();
```

<a name="wRcnw"></a>

## Hook 无限 Debugger

> **提示**
> 无限 debugger 生成的形式比较多样，常见于构造函数、定时器和 eval 里，可根据实际场景进行调整。

<a name="bwEjD"></a>

### constructor

```javascript
(function () {
    let constructorCache = Function.prototype.constructor;
    Function.prototype.constructor = function (string) {
        if (string === "debugger") {
            console.log("Hook constructor debugger!");
            return function () {};
        }
        return constructorCache(string);
    };
})();
```

<a name="EaJGd"></a>

### setInterval

```javascript
(function () {
    let setIntervalCache = setInterval;
    setInterval = function (func, delay) {
        if (func.toString().indexOf("debugger") !== -1) {
            console.log("Hook setInterval debugger!");
            return function () {};
        }
        return setIntervalCache(func, delay);
    };
})();
```

<a name="joFbD"></a>

### setTimeout

```javascript
(function () {
    let setTimeoutCache = setTimeout;
    setTimeout = function (func, delay) {
        if (func.toString().indexOf("debugger") !== -1) {
            console.log("Hook setTimeout debugger!");
            return function () {};
        }
        return setTimeoutCache(func, delay);
    };
})();
```

<a name="E6Szu"></a>

### eval

```javascript
(function () {
    let evalCache = window.eval;
    window.eval = function (string) {
        if (string.includes("debugger")) {
            console.log("Hook eval debugger!");
        }
        return evalCache(string.replace(/debugger\s*;?/g, ""));
    };
    window.eval.toString = function () {
        return evalCache.toString();
    };
})();
```

<a name="ZHY2N"></a>

## Hook XHR

```javascript
(function () {
    let openCache = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        console.log("Hook xhr method => %s, url => %s", method, url);
        if (url.indexOf("pythondouluo") !== -1) {
            debugger;
        }
        return openCache.apply(this, arguments);
    };
})();
```

<a name="Ls4Sy"></a>

## Hook fetch

```javascript
(function () {
    let fetchCache = Object.getOwnPropertyDescriptor(window, "fetch");
    Object.defineProperty(window, "fetch", {
        value: function (url) {
            console.log("Hook fetch url => ", url);
            debugger;
            return fetchCache.value.apply(this, arguments);
        }
    });
})();
```

<a name="koZp9"></a>

## Hook JSON.stringify

```javascript
(function () {
    let stringifyCache = JSON.stringify;
    JSON.stringify = function (params) {
        console.log("Hook JSON.stringify => ", params);
        debugger;
        return stringifyCache(params);
    };
})();
```

<a name="dLlu9"></a>

## Hook JSON.parse

```javascript
(function () {
    let parseCache = JSON.parse;
    JSON.parse = function (params) {
        console.log("Hook JSON.parse => ", params);
        debugger;
        return parseCache(params);
    };
})();
```

<a name="ZlHBI"></a>

## Hook Function

> **提示**
> 以下代码执行后，所有的函数操作都会在控制台打印输出将要执行的 JS 源码。

```javascript
(function () {
    let FunctionCache = window.Function;
    let newFunction = function () {
        let src = arguments[arguments.length - 1];
        console.log("Hook Function => ", src);
        debugger;
        return FunctionCache.apply(this, arguments);
    };
    newFunction.toString = function () {
        return FunctionCache.toString();
    };
})();
```

<a name="KWYDG"></a>

## Hook WebSocket

```javascript
(function () {
    let sendCache = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        console.info("Hook WebSocket send => ", data);
        return sendCache(data);
    };
})();
```

<a name="SZyAx"></a>

## Hook String.prototype.split

```javascript
(function () {
    String.prototype.splitCache = String.prototype.split;
    String.prototype.split = function (separator, limit) {
        console.log("Hook String.prototype.split separator => %s, limit => %s", separator, limit);
        let str = this.toString();
        if(str.includes("pythondouluo")) {
            debugger;
        }
        return str.splitCache(separator, limit)
    };
})();
```

<a name="NlTPW"></a>

## Hook console

```javascript
(function () {
    let consoleCache = console.log;
    console.log = function (msg) {
        consoleCache("Hook console.log =>", msg);
        if(msg === "pythondouluo") {
            debugger;
        }
        consoleCache(msg);
    };
})();
```

<a name="F4pA0"></a>

## Hook eval

```javascript
(function () {
    let evalCache = window.eval;
    window.eval = function (string) {
        console.log("Hook eval =>", string);
        debugger;
        return evalCache(string);
    };
    window.eval.toString = function () {
        return evalCache.toString();
    };
})();
```

<a name="JX9Pc"></a>

## Hook onbeforeunload

> **提示**
> onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。Hook 此事件可阻断跳转，使其留在当前页面，通常用来应对网站打开 F12 就跳转页面的情况。

```javascript
(function () {
    window.onbeforeunload = function () {
        console.log("Hook window.onbeforeunload.");
        debugger;
        return false;
    };
})();
```

<a name="wI6CX"></a>

## Hook RegExp

```javascript
(function () {
    let RegExpCache = RegExp;
    RegExp = function (pattern, flags) {
        console.log("Hook RegExp pattern => %s, flags => %s", pattern, flags);
        debugger;
        return RegExpCache(pattern, flags);
    };
})();
```

<a name="lHjfd"></a>

## Hook Canvas

```javascript
(function () {
    let createElementCache = document.createElement;
    document.createElement = function (tagName) {
        console.info("Hook createElement tagName => ", tagName);
        if(tagName === "canvas") {
            debugger;
        }
        return createElementCache(tagName);
    };
})();
```

<a name="gErWW"></a>

## Hook createElement

```
(function () {
    let createElementCache = document.createElement;
    document.createElement = function (tagName) {
        console.info("Hook createElement tagName => ", tagName);
        if(tagName === "div") {
            debugger;
        }
        return createElementCache(tagName);
    };
})();
```

<a name="ZnywB"></a>

## Hook getElementById

```javascript
(function () {
  let getElementByIdCache = document.getElementById;
  document.getElementById = function (id) {
    console.info("Hook getElementById id => ", id);
    if (id === "pythondouluo") {
      debugger;
    }
    return getElementByIdCache(id);
  };
})();
```

<a name="ns7XT"></a>

## Hook setAttribute

```javascript
(function () {
  let setAttributeCache = window.Element.prototype.setAttribute;
  window.Element.prototype.setAttribute = function (name, value) {
    console.info("Hook setAttribute name => %s, value => %s", name, value);
    if (name === "pythondouluo") {
      debugger;
    }
    return setAttributeCache(name, value);
  };
})();
```

<a name="EH8oe"></a>

## Hook setInterval

```javascript
(function () {
    let setIntervalCache = setInterval;
    setInterval = function (func, delay) {
        console.log("Hook setInterval func => %s, delay => %s", func, delay);
        debugger;
        return setIntervalCache(func, delay);
    };
})();
```

<a name="HCW1D"></a>

## Hook setTimeout

```javascript
(function () {
    let setTimeoutCache = setTimeout;
    setTimeout = function (func, delay) {
        console.log("Hook setTimeout func => %s, delay => %s", func, delay);
        debugger;
        return setTimeoutCache(func, delay);
    };
})();
```

<a name="g4xlk"></a>

## 清除定时器

```javascript
for (let i = 1; i < 99999; i++) window.clearInterval(i);
```

<a name="a1rbr"></a>

## Hook 固定随机变量

**提示**<br />来源于公众号：[y小白的笔记(opens new window)](https://mp.weixin.qq.com/s/8EJt1Wo0c4XS1JN7kC-9DA)

```javascript
(function () {
  Date.now = function now() { return 1661986251253 };
  Date.parse = function () { return 1661986251253 };
  Date.prototype.valueOf = function () { return 1661986251253 };
  Date.prototype.getTime = function () { return 1661986251253 };
  Date.prototype.toString = function () { return 1661986251253 };
  Performance.prototype.now = function now(){ return Number('1661986251253'.slice(8))}

  Math.random = function random() { return 0.08636862211354912 };
  window.crypto.getRandomValues = function getRandomValues(array32, ...args){
    return array32;
  }
})();
```