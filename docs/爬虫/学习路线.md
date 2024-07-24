# 爬虫学习路线
:::tip 路线从哪里来的？
哪有什么学习路线？
不过是大佬们水群吹牛的附带产物罢了~

大佬每水群一句，我就copy一句，于是有了这篇学习路线
:::
:::tip 《吹》
我把大佬们的聊天记录反复观看，仔细揣摩

歪歪扭扭，话外有话，

怎么面试？

吹就完了
:::
道高一尺，毛高一丈。
有的视频播放软件弄个摄像机怼着电脑照样能录，检测截屏肯定也有原理，只要知道监测点，就可以规避。上面只是我猜的，莫要笑话，可指点，谢。


## 待整理



### dp【DrissionPage】

DP是基于cdp的，学习cdp可以看官方文档，配合沉浸式翻译。

https://chromedevtools.github.io/devtools-protocol/

dp目前没有检测办法吧，就相当于手动控制台调试

硬要检测的话，我觉得不是不可以，cdp协议本身没有鉴权，只要开了就能直接访问到



指纹检测网站：

https://www.browserscan.net/



frida hook原理 Xposed的hook原理.

in line hook 是干啥的.

搞了什么App 干了什么js 

App 现在有什么常用的 检测方案 反调试方案 

ptrace
TracerPid
特征检测  什么几个 frida 关键字啊  端口啊

然后常用的几个汇编指令   B指令 add治理  bl指令 BX指令
然后吹一吹 unidbg 是吧.
ida的快捷键



简历 主要写你会的

1，不可替代性
说白了，不是开源的，是你自己折腾的，然后还能在实战中运用上的

2，通用性
常态的东西，别人会，你也会。也就是知识面光不光

3，项目驱动性。
开发项目中，遇到啥问题，问题的体现在什么方面。然后找到解决方案，或者自己提出的解决方案。。

好像没了，就这么多，当然了。像zhang总那样，丢个开源项目，那更加完美

JavaScript是一种[脚本语言](https://www.zhihu.com/search?q=脚本语言&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})，通常用于在Web浏览器中编写交互式前端应用程序。它是一种解释性语言，可以在客户端（浏览器）和服务器端（Node.js）上运行。

JavaScript可以用于创建动态网页、Web应用程序、游戏、移动应用程序等。它是一种[弱类型语言](https://www.zhihu.com/search?q=弱类型语言&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})，意味着变量的类型可以在运行时动态更改。JavaScript具有丰富的内置函数和库，可以轻松地与HTML和CSS集成，使其成为Web开发的重要组成部分。

### 本系列将从九个方面讲解JavaScript逆向专题

### 1.浏览器调试

- js作用域
- 浏览器对象属性
- 浏览器控制台

### 2.国标[哈希算法](https://www.zhihu.com/search?q=哈希算法&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})

- sha1算法
- sha256算法
- sha512算法
- md5
- hmac算法
- python和JavaScript实现

### 3.国标对称加密

- DES算法
- AES算法
- crypto-js模块使用
- pycryptodome

### 4. 国标[非对称加密](https://www.zhihu.com/search?q=非对称加密&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})

- RAS算法原理
- 非对称特征
- JavaScript算法还原
- ras模块
- jesencrypt

### 5.webpack模块打包

- webpack打包原理
- webpack构造形式
- 全局导出加密函数

### 6.JS混淆

- JavaScript压缩 混淆原理
- OB混淆特性
- OB混淆JavaScript

### 7.cookie反爬处理

- cookie加解密原理
- cookie和session机制
- cookie hook技巧
- acw_sc_v2调试

### 9.AST[抽象语法树](https://www.zhihu.com/search?q=抽象语法树&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})

- AST 技术介绍
- 字符串和编码还原
- evaluate方法学习
- JavaScript实战解混淆

### 10.JS安全产品攻防

- 瑞数
- acw_sc_v2

![img](https://picx.zhimg.com/80/v2-79eee832f5c91885757e5052eca4f5cf_720w.webp?source=1def8aca)

### 第一章：浏览器调试

JavaScript是一种在浏览器中运行的脚本语言，它可以通过浏览器对象来访问和操作浏览器的各种属性和方法。在进行JavaScript逆向分析时，了解浏览器对象的属性和方法是非常重要的。

### 1.JS作用域

在JavaScript中，作用域是指变量和函数的可访问范围。JavaScript中有两种作用域：全局作用域和局部作用域。

全局作用域是指在整个JavaScript程序中都可以访问的变量和函数，而局部作用域是指只能在函数内部访问的变量和函数。

### 2.浏览器对象属性

在JavaScript中，浏览器对象是指浏览器提供的一些对象，可以通过这些对象来访问和操作浏览器的各种属性和方法。以下是一些常用的浏览器对象属性：

- window：表示当前浏览器窗口或标签页。
- document：表示当前文档对象。
- location：表示当前文档的URL。
- navigator：表示当前浏览器的信息。
- history：表示当前浏览器的历史记录。

### 3.浏览器控制台

浏览器控制台是开发者工具中的一个重要组成部分，可以用来调试JavaScript代码、查看网络请求、分析页面性能等。以下是一些常用的浏览器控制台命令：

- `console.log()`：用于输出日志信息。
- `console.dir()`：用于输出对象的属性和方法。
- `console.error()`：用于输出错误信息。
- `console.warn()`：用于输出警告信息。
- `console.clear()`：用于清空控制台。
  示例代码：

```text
// 输出日志信息
console.log("Hello, world!");

// 输出对象的属性和方法
var obj = {name: "Tom", age: 18};
console.dir(obj);

// 输出错误信息
console.error("Something went wrong!");

// 输出警告信息
console.warn("This is a warning!");

// 清空控制台
console.clear();
```

以上是JavaScript逆向专题之浏览器介绍的一些基础知识，对于进行JavaScript逆向分析的开发者来说，了解这些知识是非常重要的。

### 第二章：国标哈希算法

国标哈希算法是一种将任意长度的消息压缩成固定长度摘要的算法，常用于数据完整性校验、[数字签名](https://www.zhihu.com/search?q=数字签名&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})等领域。本文将从sha1算法、sha256算法、sha512算法、md5算法、hmac算法以及Python和JavaScript实现六个方向详细介绍国标哈希算法。

### 1.sha1算法

sha1算法是一种安全性较高的哈希算法，将任意长度的消息压缩成160位的摘要。以下是Python实现sha1算法的示例代码：

```text
import hashlib

def sha1(data):
    sha1 = hashlib.sha1()
    sha1.update(data.encode('utf-8'))
    return sha1.hexdigest()
```

以下是JavaScript实现sha1算法的示例代码：

```text
function sha1(data) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(data);
  return sha1.digest('hex');
}
```

### 2.sha256算法

sha256算法是一种更安全的哈希算法，将任意长度的消息压缩成256位的摘要。以下是Python实现sha256算法的示例代码：

```text
import hashlib

def sha256(data):
    sha256 = hashlib.sha256()
    sha256.update(data.encode('utf-8'))
    return sha256.hexdigest()
```

以下是JavaScript实现sha256算法的示例代码：

```text
function sha256(data) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(data);
  return sha256.digest('hex');
}
```

### 3.sha512算法

sha512算法是一种更安全的哈希算法，将任意长度的消息压缩成512位的摘要。以下是Python实现sha512算法的示例代码：

```text
import hashlib

def sha512(data):
    sha512 = hashlib.sha512()
    sha512.update(data.encode('utf-8'))
    return sha512.hexdigest()
```

以下是JavaScript实现sha512算法的示例代码：

```text
function sha512(data) {
  const sha512 = crypto.createHash('sha512');
  sha512.update(data);
  return sha512.digest('hex');
}
```

### 4.md5算法

md5算法是一种较为常用的哈希算法，将任意长度的消息压缩成128位的摘要。以下是Python实现md5算法的示例代码：

```text
import hashlib

def md5(data):
    md5 = hashlib.md5()
    md5.update(data.encode('utf-8'))
    return md5.hexdigest()
```

以下是JavaScript实现md5算法的示例代码：

```text
function md5(data) {
  const md5 = crypto.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
}
```

### 5.hmac算法

hmac算法是一种基于哈希函数和密钥的[消息认证码](https://www.zhihu.com/search?q=消息认证码&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})算法，常用于数据完整性校验和数字签名。以下是Python实现hmac算法的示例代码：

```text
import hmac
import hashlib

def hmac_sha256(key, data):
    hmac_sha256 = hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha256)
    return hmac_sha256.hexdigest()
```

以下是JavaScript实现hmac算法的示例代码：

```text
function hmac_sha256(key, data) {
  const hmac_sha256 = crypto.createHmac('sha256', key);
  hmac_sha256.update(data);
  return hmac_sha256.digest('hex');
}
```

### 6.Python和JavaScript实现

以下是Python和JavaScript实现sha256算法的示例代码：

**Python**：

```text
import hashlib

def sha256(data):
    sha256 = hashlib.sha256()
    sha256.update(data.encode('utf-8'))
    return sha256.hexdigest()
```

**JavaScript**：

```text
javascript
function sha256(data) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(data);
  return sha256.digest('hex');
}
```

以上是国标哈希算法的介绍，包括sha1算法、sha256算法、sha512算法、md5算法、hmac算法以及Python和JavaScript实现。在实际应用中，需要根据具体需求选择合适的哈希算法。

### 第三章：国标对称加密

国标[对称加密算法](https://www.zhihu.com/search?q=对称加密算法&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})是指由中国国家密码管理局发布的加密算法标准，包括DES算法、AES算法等。在JavaScript逆向中，了解这些算法的原理和使用方法是非常重要的。

### 1.DES算法

DES算法是一种对称加密算法，密钥长度为56位，分为加密和解密两个过程。在JavaScript中，可以使用crypto-js模块进行DES加密和解密操作。

**加密示例代码**：

```text
var key = CryptoJS.enc.Utf8.parse("1234567890123456");
var iv = CryptoJS.enc.Utf8.parse("1234567890123456");
var encrypted = CryptoJS.DES.encrypt("Hello World", key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
console.log(encrypted.toString());
```

**解密示例代码**：

```text
var key = CryptoJS.enc.Utf8.parse("1234567890123456");
var iv = CryptoJS.enc.Utf8.parse("1234567890123456");
var decrypted = CryptoJS.DES.decrypt(encrypted, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
console.log(decrypted.toString(CryptoJS.enc.Utf8));
```

### 2.AES算法

AES算法是一种对称加密算法，密钥长度可以是128位、192位或256位，分为加密和解密两个过程。在JavaScript中，可以使用crypto-js模块进行AES加密和解密操作。

**加密示例代码**：

```text
var key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");
var iv = CryptoJS.enc.Utf8.parse("1234567890123456");
var encrypted = CryptoJS.AES.encrypt("Hello World", key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
console.log(encrypted.toString());
```

**解密示例代码**：

```text
var key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");
var iv = CryptoJS.enc.Utf8.parse("1234567890123456");
var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
console.log(decrypted.toString(CryptoJS.enc.Utf8));
```

### 3.crypto-js模块使用

crypto-js是一个JavaScript加密库，支持多种加密算法，包括DES、AES、SHA-1、SHA-256等。在使用之前，需要先引入crypto-js库。

```text
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
```

### 4.pycryptodome

pycryptodome是一个Python加密库，支持多种加密算法，包括DES、AES、SHA-1、SHA-256等。在使用之前，需要先安装pycryptodome库。

```text
pip install pycryptodome
```

使用示例：

```text
from Crypto.Cipher import AES

key = b'1234567890123456'
iv = b'1234567890123456'
cipher = AES.new(key, AES.MODE_CBC, iv)
msg = b'Hello World'
encrypted = cipher.encrypt(msg)
print(encrypted)

cipher = AES.new(key, AES.MODE_CBC, iv)
decrypted = cipher.decrypt(encrypted)
print(decrypted)
```

### 第四章：国标非对称加密

### 1.RSA算法原理：

RSA算法是一种[非对称加密算法](https://www.zhihu.com/search?q=非对称加密算法&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})，它的安全性基于大数分解的困难性。RSA算法的核心是选择两个大质数p和q，计算它们的乘积n=pq，然后选择一个整数e，使得1<e<φ(n)且e与φ(n)互质，其中φ(n)=(p-1)(q-1)。接着计算d，使得d*e mod φ(n)=1，d称为e的[模反元素](https://www.zhihu.com/search?q=模反元素&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})。公钥为(n,e)，私钥为(n,d)。

### 2.非对称特征：

非对称加密算法有两个密钥，一个是公钥，一个是私钥。公钥可以公开，任何人都可以使用公钥对数据进行加密，但只有私钥的持有者才能解密。非对称加密算法的安全性基于数学难题，如大数分解、[离散对数](https://www.zhihu.com/search?q=离散对数&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})等，这些问题在计算机领域内是非常困难的。

### 3.JavaScript算法还原：

在JavaScript中，可以使用BigInt类型来处理大数运算。首先，需要实现一个函数来判断一个数是否为质数：

```text
function isPrime(n) {
  if (n <= 1) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

接着，可以实现一个函数来生成大质数：

```text
function generatePrime(bits) {
  let p;
  do {
    p = BigInt(Math.floor(Math.random() * 2 ** bits));
  } while (!isPrime(p));
  return p;
}
```

然后，可以实现一个函数来计算两个数的最大公约数：

```text
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}
```

接着，可以实现一个函数来计算两个数的模反元素：

```text
function modInverse(a, m) {
  let [x, y, u, v] = [0n, 1n, 1n, 0n];
  while (a !== 0n) {
    let q = m / a;
    let r = m % a;
    let m1 = x - u * q;
    let m2 = y - v * q;
    m = a;
    a = r;
    x = u;
    y = v;
    u = m1;
    v = m2;
  }
  return x < 0n ? x + m : x;
}
```

最后，可以实现一个函数来生成RSA密钥对：

```text
function generateRSAKeyPair(bits) {
  let p = generatePrime(bits / 2);
  let q = generatePrime(bits / 2);
  let n = p * q;
  let phi = (p - 1n) * (q - 1n);
  let e = 65537n;
  let d = modInverse(e, phi);
  return {
    publicKey: [n, e],
    privateKey: [n, d],
  };
}
```

### 4.ras模块

在Node.js中，可以使用crypto模块来实现RSA加密和解密。首先，需要生成RSA密钥对：

```text
const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});
```

接着，可以使用公钥对数据进行加密：

```text
const crypto = require('crypto');

const data = 'hello world';
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
console.log(encrypted.toString('base64'));
```

使用私钥对数据进行解密：

```text
const decrypted = crypto.privateDecrypt(privateKey, encrypted);
console.log(decrypted.toString());
```

### 5.jesencrypt

jesencrypt是一个基于JavaScript实现的RSA加密库，可以在浏览器中使用。它的使用方法与Node.js中的crypto模块类似。首先，需要生成RSA密钥对：

```text
const { generateKeyPair } = require('jesencrypt');

generateKeyPair().then(({ publicKey, privateKey }) => {
  console.log(publicKey);
  console.log(privateKey);
});
```

接着，可以使用公钥对数据进行加密：

```text
const { encrypt } = require('jesencrypt');

const data = 'hello world';
encrypt(data, publicKey).then((encrypted) => {
  console.log(encrypted);
});
```

使用私钥对数据进行解密：

```text
const { decrypt } = require('jesencrypt');

const encrypted = '...';
decrypt(encrypted, privateKey).then((decrypted) => {
  console.log(decrypted);
});
```

### 第五章：webpack模块打包

### 1.webpack打包原理

Webpack是一个模块打包工具，它可以将多个模块打包成一个文件，以便于在浏览器中使用。Webpack的打包原理是将所有的模块打包成一个或多个bundle文件，这些文件可以是JavaScript、CSS、图片等资源文件。

**Webpack的打包过程分为三个阶段**：

- **解析模块**：Webpack会从入口文件开始，递归地解析所有的依赖模块，形成一个依赖树。
- **编译模块**：Webpack会将每个模块编译成一个可执行的JavaScript代码块。
- **输出文件**：Webpack会将所有的JavaScript代码块合并成一个或多个bundle文件，以便于在浏览器中使用。

### 2.webpack构造形式

**Webpack的构造形式分为两种**：

**1）命令行形式**：通过命令行输入webpack命令，可以将所有的模块打包成一个或多个bundle文件。

**2）[配置文件](https://www.zhihu.com/search?q=配置文件&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})形式**：通过配置文件`webpack.config.js`，可以对Webpack进行更加详细的配置，包括入口文件、输出文件、模块解析规则、插件等。

### 3.全局导出加密函数

在Webpack中，可以通过全局导出加密函数来保护JavaScript代码的安全性。全局导出加密函数的原理是将JavaScript代码通过加密算法进行加密，然后将加密后的代码作为一个函数的返回值，这个函数可以在全局范围内调用，从而实现对JavaScript代码的保护。

**全局导出加密函数的实现步骤如下**：

- 1）将需要加密的JavaScript代码通过加密算法进行加密。
- 2）将加密后的代码作为一个函数的返回值。
- 3）将这个函数通过`module.exports`导出，从而可以在全局范围内调用。

示例代码如下：

```text
const encrypt = require('encrypt');

const code = 'console.log("Hello, World!");';

const encryptedCode = encrypt(code);

module.exports = function() {
  return eval(encryptedCode);
};
```

在上面的代码中，encrypt函数是一个加密函数，它将JavaScript代码进行加密，并返回加密后的代码。然后，将这个加密后的代码通过`module.exports`导出，从而可以在全局范围内调用。最后，通过eval函数执行加密后的代码。

### 第六章：JS混淆

JavaScript混淆是一种将JavaScript代码进行压缩和混淆的技术，旨在增加代码的复杂度和难度，使得代码难以被[逆向工程师](https://www.zhihu.com/search?q=逆向工程师&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})或黑客破解和篡改。下面从JavaScript压缩混淆原理、OB混淆特性和OB混淆JavaScript三个方向详细介绍。

### 1.JavaScript压缩混淆原理

JavaScript压缩混淆的目的是为了减小文件体积，提高加载速度，同时也可以增加代码的安全性，防止被恶意篡改或者盗用。JavaScript压缩混淆的原理主要是通过删除无用的空格、注释、换行符等来减小文件体积，同时通过重命名变量、函数名等来增加代码的难度，使得代码难以被理解和修改。

### 2.OB混淆特性

OB混淆是一种常见的JavaScript混淆方式，它的特点是将JavaScript代码中的变量、函数名等进行随机重命名，使得代码难以被理解和修改。OB混淆的主要特性包括：

- 变量、函数名随机重命名：OB混淆会将JavaScript代码中的变量、函数名等进行随机重命名，使得代码难以被理解和修改。
- 字符串加密：OB混淆会将JavaScript代码中的字符串进行加密，使得代码难以被理解和修改。
- 代码结构混淆：OB混淆会将JavaScript代码中的结构进行混淆，使得代码难以被理解和修改。

### 3.OB混淆JavaScript三个方向详解

**变量、函数名随机重命名**

OB混淆会将JavaScript代码中的变量、函数名等进行随机重命名，使得代码难以被理解和修改。这个过程可以通过以下步骤实现：

- 遍历JavaScript代码，获取所有的变量、函数名等标识符。
- 生成随机的标识符名称，并将原有的标识符名称替换为随机名称。
- 更新代码中所有引用该标识符的地方，将其替换为新的随机名称。

**字符串加密**

OB混淆会将JavaScript代码中的字符串进行加密，使得代码难以被理解和修改。这个过程可以通过以下步骤实现：

- 遍历JavaScript代码，获取所有的字符串。
- 将字符串进行加密，可以使用常见的加密算法，如Base64、AES等。
- 更新代码中所有引用该字符串的地方，将其替换为加密后的字符串。

**代码结构混淆**

OB混淆会将JavaScript代码中的结构进行混淆，使得代码难以被理解和修改。这个过程可以通过以下步骤实现：

- 将JavaScript代码进行分块，将每个块中的代码进行随机排序。
- 将每个块中的代码进行随机组合，生成新的代码结构。
- 更新代码中所有引用该块的地方，将其替换为新的代码结构。

总之，OB混淆是一种常见的JavaScript混淆方式，可以有效地增加代码的安全性，防止被恶意篡改或者盗用。但是，OB混淆也会增加代码的复杂度和维护成本，因此需要在实际应用中进行权衡。

### 第七章：cookie反爬处理

在爬虫领域，网站通常会使用cookie来进行反爬处理，以识别爬虫并限制其访问。因此，了解cookie反爬处理的原理和技巧对于爬虫开发者来说非常重要。

### 1.cookie加解密原理

在HTTP协议中，cookie是通过Set-Cookie和Cookie头来传递的。网站通常会对cookie进行加密或者编码，以防止被恶意篡改或者窃取。常见的加密方式包括Base64、MD5、SHA1等。

### 2.cookie和session机制

cookie和session是Web开发中常用的两种机制。cookie是一种存储在客户端的小型文本文件，用于存储用户的身份信息、浏览历史等。而session则是一种在服务器端存储的数据结构，用于存储用户的会话信息。通常情况下，服务器会将session ID存储在cookie中，以便在后续的请求中识别用户身份。

### 3.cookie hook技巧

cookie hook是一种常用的反爬技巧，它可以通过修改cookie的值来绕过网站的反爬机制。常见的cookie hook技巧包括：

- 修改cookie的值，以绕过网站的限制。
- 删除cookie，以避免被网站识别为爬虫。
- 伪造cookie，以模拟正常用户的行为。

### 4.acw_sc_v2调试

在进行cookie反爬处理时，经常会遇到acw_sc_v2这个参数。这个参数是阿里云CDN的一种反爬机制，用于检测请求是否来自于正常的浏览器。如果请求中没有正确的acw_sc_v2参数，CDN会返回[403错误](https://www.zhihu.com/search?q=403错误&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})。

为了解决这个问题，我们需要了解acw_sc_v2的生成方式和调试方法。

**acw_sc_v2的生成方式**
acw_sc_v2参数的生成方式比较复杂，需要使用一些加密算法。一般来说，生成acw_sc_v2参数需要以下步骤：

- 获取当前时间戳，单位为毫秒。
- 将时间戳转换为16进制字符串，并在前面补0，使其长度为13位。
- 将13位时间戳字符串和一个随机字符串拼接起来，得到一个新的字符串。
- 对新字符串进行MD5加密，得到一个32位的字符串。
- 将32位字符串的前6位和后6位分别取出来，得到两个6位的字符串。
- 将两个6位字符串拼接起来，得到12位的字符串，即为acw_sc_v2参数的值。

**acw_sc_v2的调试方法**
在进行cookie反爬处理时，我们需要调试acw_sc_v2参数的生成过程，以便正确地生成该参数。下面介绍几种调试方法：

- 使用浏览器开发者工具

在浏览器中打开目标网站，按下F12键打开开发者工具。在Network选项卡中找到一个请求，查看该请求的请求头信息。一般来说，acw_sc_v2参数会出现在请求头的Cookie字段中。将该Cookie字段复制下来，然后使用MD5加密算法对其进行加密，得到32位的字符串。最后按照上述步骤，将32位字符串转换为acw_sc_v2参数的值。

- 使用Python脚本

使用Python脚本可以自动化生成acw_sc_v2参数。下面是一个Python脚本示例：

```text
import time
import random
import hashlib

def generate_acw_sc_v2():
    timestamp = str(int(time.time() * 1000))
    random_str = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz0123456789', 6))
    new_str = timestamp + random_str
    md5_str = hashlib.md5(new_str.encode('utf-8')).hexdigest()
    acw_sc_v2 = md5_str[:6] + md5_str[-6:]
    return acw_sc_v2
```

该脚本会生成一个随机的acw_sc_v2参数值。

- 使用在线工具

在网上可以找到一些在线工具，可以帮助我们生成acw_sc_v2参数

### 第八章：AST抽象语法树

AST（Abstract Syntax Tree）抽象语法树是一种将代码转换为树形结构的数据结构，它可以帮助我们更好地理解代码的结构和含义。在JavaScript中，AST可以用于代码分析、[代码优化](https://www.zhihu.com/search?q=代码优化&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})、代码混淆等方面。

下面从AST技术介绍、字符串和编码还原、evaluate方法学习、JavaScript实战解混淆几个方向详细介绍AST的应用。

### 1.AST技术介绍

AST是一种将代码转换为树形结构的数据结构，它可以帮助我们更好地理解代码的结构和含义。在JavaScript中，AST可以用于代码分析、代码优化、代码混淆等方面。

AST的生成过程一般分为三个步骤：[词法分析](https://www.zhihu.com/search?q=词法分析&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})、语法分析和AST构建。词法分析将代码分解为一个个的词法单元，语法分析将词法单元组合成语法树，AST构建则是将语法树转换为AST。

### 2.字符串和编码还原

在JavaScript中，代码经过压缩和混淆后，常常会将变量名、函数名等替换为无意义的字符串或者编码。这时候，我们需要将这些字符串和编码还原为原来的变量名、函数名等。

字符串还原可以通过[正则表达式](https://www.zhihu.com/search?q=正则表达式&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A3035253242})或者字符串替换的方式实现。编码还原则需要根据具体的编码方式进行解码，常见的编码方式有Unicode编码、Base64编码等。

AST字符串和编码还原是指将AST转换为字符串形式，并将字符串还原为AST的过程。这个过程在JavaScript代码混淆和反混淆中非常重要。

下面是一个简单的示例，展示如何将AST转换为字符串：

```text
const esprima = require('esprima');

const code = 'function add(a, b) { return a + b; }';
const ast = esprima.parseScript(code);

const astString = JSON.stringify(ast, null, 2);
console.log(astString);
```

在这个示例中，我们使用了esprima库将代码解析为AST。然后，我们使用JSON.stringify方法将AST转换为字符串，并将其打印到控制台上。

输出结果如下：

```text
{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier",
        "name": "add"
      },
      "params": [
        {
          "type": "Identifier",
          "name": "a"
        },
        {
          "type": "Identifier",
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ReturnStatement",
            "argument": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "type": "Identifier",
                "name": "a"
              },
              "right": {
                "type": "Identifier",
                "name": "b"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}
```

我们可以看到，AST被转换为了一个JSON字符串，其中每个节点都有一个type属性，用于表示节点的类型。例如，FunctionDeclaration表示函数声明，Identifier表示标识符，BinaryExpression表示二元表达式等等。

接下来，我们将介绍如何将字符串还原为AST。

```text
const esprima = require('esprima');

const astString = `{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier",
        "name": "add"
      },
      "params": [
        {
          "type": "Identifier",
          "name": "a"
        },
        {
          "type": "Identifier",
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ReturnStatement",
            "argument": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "type": "Identifier",
                "name": "a"
              },
              "right": {
                "type": "Identifier",
                "name": "b"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}`;

const ast = JSON.parse(astString);
console.log(ast);
```

在这个示例中，我们将AST字符串直接赋值给一个变量。然后，我们使用JSON.parse方法将字符串转换为AST对象，并将其打印到控制台上。

输出结果与之前的示例相同，不再赘述。

总的来说，AST字符串和编码还原是JavaScript代码混淆和反混淆中非常重要的一环。掌握这个技术可以帮助我们更好地理解和处理混淆代码。

### 3.evaluate方法学习

evaluate方法是JavaScript中的一个内置函数，它可以将字符串作为代码执行。在AST中，我们可以通过evaluate方法执行AST节点中的代码。

evaluate方法的使用非常简单，只需要将AST节点中的代码转换为字符串，然后传入evaluate方法即可。需要注意的是，由于evaluate方法会执行任意的代码，因此在使用时需要谨慎，避免执行恶意代码。

### 4.JavaScript解混淆

在实际开发中，我们常常会遇到代码混淆的情况。代码混淆可以通过将代码压缩、变量名替换、字符串编码等方式实现，从而使代码难以阅读和理解。

在解混淆过程中，AST可以帮助我们更好地理解代码的结构和含义，从而更容易地还原出原始代码。常见的解混淆方法包括字符串和编码还原、变量名还原、函数还原等。

总之，AST是一种非常有用的技术，它可以帮助我们更好地理解和处理JavaScript代码。在实际开发中，我们可以通过AST实现代码分析、代码优化、代码混淆等功能，从而提高代码的质量和安全性。

### 第九章：JS安全产品攻防

### 1.瑞数

### 2.acw_sc_v2

**这两个模块，之前出了视频，就不在赘述了，建议找到视频自己观看**

**专题文章较长，建议关注+收藏，以免找不到**

https://www.zhihu.com/question/569831850/answer/3362952205



# js
问js  就吹一下 ast啊

然后看看vpm啊

分布式爬虫啊..

日采集 几百万 几千万数据什么的.

阿卡麦 PX 这种的吧.

5S   阿卡麦 3年前就写成纯C代码了

点选验证码的地址有时候是点选，有时候会变成旋转，估计是异常等级不同导致的

浏览器指纹，指纹浏览器

安卓逆向面试题汇总 技术篇
面试官经常问的几个问题如下：

常见的加固手段有哪些
安卓反调试一般有哪些手段，怎么去防范
arm汇编 b bl bx blx 这些指令是什么意思
ida xx操作的快捷键是哪个？
Xposed hook 原理 frida hook 原理
inline hook原理
ollvm 代码混淆你了解吗？要怎么去处理





# JS逆向目录

::: tip

下面的所有技术，名词，你最好要深入思考，为什么要有这项技术，它的好处是什么，想要解决什么问题？又要如何应对,你会应对吗.

:::



## 前言





## 科普



### 所见即所得





## 基础环境搭建



## JS/NodeJs



## 前端

#### url编码

URL编码（也称为百分号编码或URL转义）是一种用于在URL中表示特殊字符和非ASCII字符的编码方式。由于URL只允许特定的字符，因此如果要包含特殊字符或非ASCII字符（例如空格、问号、斜杠、中文字符等），就需要对其进行编码，以便在URL中安全地传输和解析。

URL编码的原理是将要编码的字符转换为 `%` 符号后跟两位十六进制数的形式。例如，空格字符会被编码为 `%20`，问号字符会被编码为 `%3F`，而中文字符会被分解为其UTF-8编码的字节序列，然后每个字节以 `%` 符号后跟两位十六进制数的形式进行编码。

例如，假设我们要将字符串 "Hello World?" 编码为URL编码形式，那么编码后的结果将会是 "Hello%20World%3F"。

URL编码通常使用在Web开发中，例如在GET请求中传递参数时，或者在构建动态URL时。在Python中，可以使用`urllib.parse`模块进行URL编码和解码的操作。

示例：

```python
from urllib.parse import quote, unquote

original_url = "https://www.example.com/search?q=hello world?"

# URL编码
encoded_url = quote(original_url)
print("Encoded URL:", encoded_url)  # 输出：https%3A//www.example.com/search%3Fq%3Dhello%20world%3F

# URL解码
decoded_url = unquote(encoded_url)
print("Decoded URL:", decoded_url)  # 输出：https://www.example.com/search?q=hello world?
```

这个示例演示了如何使用Python中的`urllib.parse.quote()`函数对URL进行编码，以及使用`urllib.parse.unquote()`函数对URL进行解码。

```javascript
var originalUrl = "https://www.example.com/search?q=hello world?";
var encodedUrl = encodeURIComponent(originalUrl);
console.log("Encoded URL:", encodedUrl);
// 输出：https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dhello%20world%3F
```

```javascript
var encodedUrl = "https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dhello%20world%3F";
var decodedUrl = decodeURIComponent(encodedUrl);
console.log("Decoded URL:", decodedUrl);
// 输出：https://www.example.com/search?q=hello world?
```

url编码

## 数据库



### mysql

### mongodb







#### 自执行函数





#### base64编码
##### 概念
Base64是一种用于将二进制数据编码为文本的编码方式。它的名称来源于它使用的字符集，该字符集由64个字符组成，包括大写字母、小写字母、数字和两个额外的符号。
##### 组成
Base64编码使用的字符集包括：

1. 大写字母 A-Z（共26个字符）
2. 小写字母 a-z（共26个字符）
3. 数字 0-9（共10个字符）
4. 加号 "+" 和斜杠 "/"（共2个字符）

通常情况下，Base64编码还会使用一个额外的符号来表示填充（padding），通常是等号 "="。这些字符共同构成了Base64编码所用的64个字符。
##### 用途
Base64编码通常用于在网络传输或存储中表示二进制数据，例如在电子邮件附件中传输二进制文件或在URL中传输数据。

Base64编码通过将3个字节的二进制数据编码为4个ASCII字符，因此它的编码长度总是4的倍数。如果原始数据的长度不是3的倍数，Base64编码器将在末尾添加一个或两个额外的字符（通常是等号），以使编码后的字符串长度成为4的倍数。

当将3个字节的二进制数据编码为4个ASCII字符时，Base64编码器会将这3个字节的数据划分为四组，每组6个比特。然后，每个6比特的值将被映射到Base64字符集中的相应字符。这样，每组6比特将被映射为一个Base64字符。

例如，假设我们有这样的3个字节的二进制数据：01011010 11001101 10101000。将其分成四组6比特，得到：

010110 (二进制为 22，对应Base64字符集中的字符为 'W')
101101 (二进制为 45，对应Base64字符集中的字符为 't')
101101 (二进制为 45，对应Base64字符集中的字符为 't')
010110 (二进制为 22，对应Base64字符集中的字符为 'W')
然后，将这四个Base64字符连接起来，就得到了最终的Base64编码字符串，即 "WttW"。

总结来说，将3个字节的二进制数据编码为4个ASCII字符的过程是将原始数据划分为4组6比特，然后根据这些6比特值在Base64字符集中找到对应的字符。

学习了base64，为什么是三个字节转化为4个字符，因为一个字节八位，64个字符可以代表6位，八和六的最小公倍数是24。妙啊！！！

Base64编码的主要特点是它可以将二进制数据转换为纯文本形式，这使得它在许多不支持二进制数据传输的环境中非常有用。它也是许多网络协议和数据存储格式的一部分，如HTTP、SMTP、JSON等。

Base64编码虽然能够将二进制数据转换为文本，但它并不是加密算法，因为Base64编码可以被轻松地解码还原为原始的二进制数据。因此，不应该将Base64编码用于敏感数据的加密或安全传输。

在浏览器中和Python中都可以使用内置的函数或库来进行Base64编码和解码操作。

在浏览器中，可以使用JavaScript的内置函数`btoa()`进行Base64编码，以及`atob()`进行解码。

示例：

```javascript
// Base64编码
var encodedData = btoa("Hello, world!");
console.log(encodedData); // 输出： "SGVsbG8sIHdvcmxkIQ=="

// Base64解码
var decodedData = atob(encodedData);
console.log(decodedData); // 输出： "Hello, world!"
```

在Python中，可以使用内置的`base64`模块进行Base64编码和解码操作。

示例：

```python
import base64

# Base64编码
encoded_data = base64.b64encode(b"Hello, world!")
print(encoded_data)  # 输出： b'SGVsbG8sIHdvcmxkIQ=='

# Base64解码
decoded_data = base64.b64decode(encoded_data)
print(decoded_data.decode("utf-8"))  # 输出： "Hello, world!"
```

这些示例演示了在浏览器中使用JavaScript和在Python中使用`base64`模块进行Base64编码和解码的方法。

一般情况下，图片通常会被转换成Base64编码形式。这种转换将图片的二进制数据编码成纯文本形式，以便在网页中直接嵌入或者在数据传输中以文本的形式进行传递。在前端开发中，可以将图片转换为Base64编码以减少HTTP请求次数，从而提高网页加载速度。

例如，可以使用以下Python代码将图片转换为Base64编码：

```python
import base64

with open("image.jpg", "rb") as image_file:
    base64_image = base64.b64encode(image_file.read()).decode("utf-8")

print(base64_image)
```

在这个示例中，"image.jpg" 是图片文件的路径。`b64encode()`函数将图片的二进制数据编码为Base64编码，然后使用`.decode("utf-8")`将字节串转换为字符串形式。

在前端开发中，可以直接使用HTML的`<img>`标签，并将Base64编码的图片数据直接嵌入到`src`属性中，如下所示：

```html
<img src="data:image/jpeg;base64,<base64_image_data_here>" alt="Image">
```

其中 `<base64_image_data_here>` 是图片的Base64编码数据。

作用，缘由，做什么，为什么要做

## python

### requests


### xpath/lxml,bs4,re


### 协程







## 浏览器开发者工具





#### 开发者工具检测



#### 打开开发者工具页面重定向/关闭





## 自动化/rpc
### Selenium





### 验证码识别

数字验证码

计算题验证码

轨迹【画一个对号等】

旋转【旋转圆形风景图片为正】

滑块【拖动小图形填充进缺口】



无感验证码




## JS逆向-Hook





## JS逆向-加密算法





### md5

### aes



## webpack





## 混淆





### 方法与目标



#### 变量名混淆

减少代码可读性，隐藏掉语义化的变量名，函数名







### 工具



## 浏览器指纹



## 蜜罐



## 风控







## 脱混淆/ast





## wasm





## 简历写法，面试技巧







## 副业接单经验





# 借鉴

### 专栏大纲：爬虫从入门到精通

#### 第1部分：爬虫基础
1. **介绍网络爬虫**
   - 爬虫的定义和主要功能
   - 爬虫在业界的应用实例
   - 法律和道德问题：遵守robots.txt协议

2. **HTML/CSS/JavaScript基础**
   - 理解网页的结构
   - 常用的HTML标签和属性
   - CSS选择器的使用
   - JavaScript在网页中的作用

3. **开发环境设置**
   - Python基础
   - 安装Python和相关库（如requests, BeautifulSoup, Selenium）
   - 使用IDE和其他工具的介绍

4. **初级爬虫项目**
   - 使用requests获取网页内容
   - BeautifulSoup入门：解析HTML
   - 简单的数据提取实例

#### 第2部分：进阶爬虫技术
1. **处理JavaScript渲染的页面**
   - 理解浏览器渲染过程
   - 使用Selenium模拟浏览器操作
   - 处理动态加载数据

2. **数据存储方案**
   - 保存数据到文本文件
   - 使用数据库：SQL与NoSQL选型和使用
   - 数据清洗和格式化

3. **避免爬虫被封**
   - 用户代理（User-Agent）和IP轮换技术
   - 理解频率限制及其规避策略
   - 使用代理服务器

4. **中级爬虫项目**
   - 爬取电子商务网站的产品信息
   - 实现一个天气数据爬虫
   - 新闻网站的内容抓取和存储

#### 第3部分：高级爬虫开发
1. **爬虫框架Scrapy**
   - Scrapy框架的架构和优势
   - 创建Scrapy项目和爬虫
   - 数据提取和管道处理

2. **分布式爬虫**
   - 分布式爬虫的原理和实现
   - 使用Scrapy-Redis实现分布式爬虫

3. **爬虫的监控和维护**
   - 监控爬虫的运行状态
   - 日志记录和错误处理
   - 爬虫的维护和更新策略

4. **高级爬虫项目**
   - 社交媒体数据的自动抓取和分析
   - 实时航班信息爬虫
   - 大规模电商网站的定期数据抓取

#### 第4部分：专栏总结
1. **爬虫项目的最佳实践**
2. **未来爬虫技术的发展趋势**
3. **如何将爬虫技能转化为职业优势**

这个大纲为读者提供了从基础知识到高级技能的全面学习路径，不仅帮助新手快速入门，还能让有经验的开发者进一步提高他们的技术水平。每部分结束后可以包括一个实际项目，使读者能够通过实践进一步巩固和深化所学知识。





