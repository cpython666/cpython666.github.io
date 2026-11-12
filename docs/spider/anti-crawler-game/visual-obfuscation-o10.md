---
title: "大眼瞪小眼编码，视觉层面混淆-O10编码解码"
description: "O10 编码是一种视觉层面的混淆：人眼看着正常，复制出来却是另一回事。讲解这种前端反采集编码的原理与解码方法。"
keywords: "O10编码,视觉混淆,前端反爬,编码解码,字符混淆"
created_at: 2024-10-27 21:28:01
updated_at: 2024-10-27 21:28:01
---

# 大眼瞪小眼编码，视觉层面混淆-O10编码解码

```python
input_str = "你好，世界😄"


def O10Encode(input_str):
    return "O".join([bin(ord(c)).replace("0b", "") for c in input_str])
def O10Decode(input_str):
    return "".join([chr(int(b, 2)) for b in input_str.split("O")])
x = O10Encode(input_str)
print(x)
print(O10Decode(x))
def O10EncodePro(input_str):
    res = O10Encode(input_str)
    tmp = [
        ("1", "I"),
        ("O", "1"),
        ("0", "l"),
    ]
    for old, new in tmp:
        res = res.replace(old, new)
    return res

def O10DecodePro(input_str):
    tmp = [
        ("1", "I"),
        ("O", "1"),
        ("0", "l"),
    ][::-1]
    for old, new in tmp:
        input_str = input_str.replace(new, old)
    return O10Decode(input_str)

# 1lI
x = O10EncodePro(input_str)
print(x)
print(O10DecodePro(x))
```
