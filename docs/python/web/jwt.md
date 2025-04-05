### **JWT（JSON Web Token）详解**

#### **1. 什么是 JWT？**

JWT（JSON Web Token）是一种用于 **身份验证（Authentication）** 和 **信息安全传输** 的开放标准（RFC 7519）。它通过 JSON 形式存储声明信息（claims），并使用 **数字签名** 保证数据完整性。

JWT 主要用于：

+ **用户身份验证**（如 OAuth 授权）
+ **API 认证**（如 RESTful API 访问）
+ **信息安全传输**（如在微服务间传递认证信息）

---

#### **2. JWT 的结构**

JWT 由 **三部分** 组成，每部分之间用 `.` 分隔：

```plain
Header.Payload.Signature
```

这三部分分别是：

+ **Header（头部）**：说明使用的算法和 token 类型
+ **Payload（载荷）**：存储用户信息和声明（Claims）
+ **Signature（签名）**：用于验证 JWT 的真实性

##### **示例 JWT**

```plain
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MTMwNjgwMCwiZXhwIjoxNjkxMzEwNDAwfQ.OjR1mI5fBItMdXsH2fF2p5Aj54PkbOSmCFEwC_Qw1tE
```

**分解后：**

1. **Header（Base64编码）**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload（Base64编码）**

```json
{
  "user_id": 123,
  "role": "admin",
  "iat": 1691306800,
  "exp": 1691310400
}
```

3. **Signature（HMAC SHA256 计算）**

```python
HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret
)
```

---

#### **3. JWT 如何工作？**

1. **用户登录**
   - 用户使用账号密码登录，服务器验证成功后生成 JWT 并返回给用户。
2. **用户请求 API**
   - 之后，用户每次请求 API 时，都在 `Authorization` 头中携带 `Bearer <JWT>` 访问受保护资源。
3. **服务器验证 JWT**
   - 服务器端使用 **签名密钥** 解析 JWT，验证合法性，并检查 `exp` 是否过期。

---

### **4. Python 实现 JWT**

Python 中可以使用 `PyJWT` 进行 JWT 生成和解析。

#### **4.1 安装 **`PyJWT`

```bash
pip install PyJWT
```

#### **4.2 生成 JWT**

```python
import jwt
import datetime

# 定义密钥（务必妥善保存）
SECRET_KEY = "mysecretkey"

# 生成 Token
def create_jwt(user_id: int, role: str):
    payload = {
        "user_id": user_id,
        "role": role,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # 1小时后过期
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

# 示例
token = create_jwt(123, "admin")
print("JWT Token:", token)
```

---

#### **4.3 解析 JWT**

```python
def decode_jwt(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        return "Token 已过期"
    except jwt.InvalidTokenError:
        return "无效 Token"

# 示例
decoded_data = decode_jwt(token)
print("解析后的数据:", decoded_data)
```

---

### **5. JWT 进阶**

#### **5.1 使用 RSA 非对称加密**

在上面的示例中，我们使用了 `HS256`（对称加密），这意味着服务器端需要同一个密钥来生成和验证 JWT。

如果需要**更高的安全性**，可以使用 **RSA（非对称加密）**，客户端用公钥加密，服务器用私钥解密：

```python
# 生成 RSA 私钥和公钥（仅需一次）
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

# 转换为可存储格式
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# 生成 RSA JWT
def create_rsa_jwt(user_id: int):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, private_pem, algorithm="RS256")
    return token

# 解析 RSA JWT
def decode_rsa_jwt(token: str):
    try:
        decoded = jwt.decode(token, public_pem, algorithms=["RS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return "Token 已过期"
    except jwt.InvalidTokenError:
        return "无效 Token"

# 测试
rsa_token = create_rsa_jwt(123)
print("RSA JWT Token:", rsa_token)
print("解析 RSA JWT:", decode_rsa_jwt(rsa_token))
```

---

### **6. JWT 安全性注意事项**

1. **不要存储敏感信息**  
   JWT 可以被解码，因此不要在 `payload` 里存储密码或重要机密数据。
2. **使用短生命周期**  
   令牌应有一个较短的 `exp` 过期时间，并结合 **刷新 Token 机制** 避免滥用。
3. **采用 HTTPS 传输**  
   JWT 包含身份信息，必须使用 HTTPS 进行安全传输，防止中间人攻击。
4. **尽量使用 **`RS256`** 非对称加密**  
   使用 `RS256` 避免密钥泄露风险，公钥可安全公开，私钥则妥善存储。

---

### **7. 总结**

+ JWT 是一种安全、无状态的身份认证机制。
+ 由 **Header、Payload、Signature** 三部分组成。
+ **HS256** 适合对称加密，**RS256** 适合非对称加密。
+ Python 可使用 `jwt` 库进行生成和解析。
+ 需要注意 **安全性**，避免敏感数据泄露。

