---
title: "Clash 进阶：把订阅节点提取出来，部署成爬虫可用的代理池"
description: "把 Clash 订阅里的节点导出来，用 Mihomo 给每个节点开一个本机端口并部署到服务器，爬虫按端口轮换节点，失败自动冷却换下一个。以我的聪明钱追踪项目为例讲完整流程。"
keywords: "Clash,Mihomo,订阅节点,代理池,爬虫代理,节点轮换,systemd"
---

# Clash 进阶：把订阅节点提取出来，部署成爬虫可用的代理池

平时用 Clash，是「一个时间只用一个节点」：选好节点，浏览器、软件都从这一个出口出去。

但写爬虫的时候，一个出口往往不够用：同一个 IP 请求多了，目标网站就会限流（返回 429）或者直接封掉。这时候就会想：**订阅里明明有几十上百个节点，能不能让爬虫轮流用？**

可以。思路一句话就能说完：

> **把订阅里的节点一个个拿出来，每个节点开一个本机端口，爬虫想用哪个节点，就请求哪个端口。**

这篇用我自己的「聪明钱追踪」项目为例，讲一遍完整流程。这个项目部署在腾讯云服务器上，要大量请求交易数据接口，就是靠这套方式轮换节点的。

> 前置知识：先会 Clash 的基础用法，可以看 [Clash 使用教程：导入订阅、开启代理、全局模式与规则模式](/spider/collection/clash)。

## 整体流程

```text
 Clash 订阅文件（几十个节点）
          │  ① 提取节点
          ▼
 mihomo.yaml：每个节点一个本机端口      nodes.json：节点名 → 端口
   香港 A → 127.0.0.1:17901              给爬虫看的「节点清单」
   日本 A → 127.0.0.1:17902
   ...
          │  ② 上传到服务器，用 Mihomo 跑起来
          ▼
 服务器上的爬虫 ──请求 http://127.0.0.1:17901──▶ 香港 A ──▶ 目标网站
               ──请求 http://127.0.0.1:17902──▶ 日本 A ──▶ 目标网站
               （某个节点被限流了，就冷却一会儿，换下一个端口）
```

涉及两个东西：

- **Mihomo**：就是 Clash Meta 内核，Clash Verge 底层用的也是它。服务器上没有图形界面，直接跑内核就行
- **nodes.json**：一份「节点名 + 本机端口」的清单，爬虫读它来决定用哪个端口

## 第一步：从订阅里提取节点

订阅链接下载下来，其实就是一个 YAML 配置文件。里面最重要的是 `proxies` 列表，每一项就是一个节点：

```yaml
proxies:
  - name: 香港 A
    type: ss
    server: hk-a.example.com
    port: 443
    cipher: aes-256-gcm
    password: demo-password
  - name: 日本 A
    type: vless
    server: jp-a.example.com
    port: 443
    uuid: 00000000-0000-0000-0000-000000000000
  - name: 剩余流量：100 GB      # 这种是机场的提示条目，不是真节点
    type: ss
    ...
```

在电脑上导入过订阅的话，Clash Verge 已经把订阅文件下载到本地了，不用再请求订阅链接。macOS 上的位置是：

```text
~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/
├── profiles.yaml        # 订阅列表，current 字段是当前在用的订阅
└── profiles/            # 每个订阅下载下来的 YAML 文件
```

提取的时候要做几件事：

1. **去掉提示条目**：名字里带「剩余流量」「到期」「官网」这种的，是机场用来显示信息的，不是能用的节点
2. **按需过滤地区**：比如目标网站不允许某些地区访问，就按名字把这些节点排除掉
3. **多个订阅合并时去重**：连接参数完全一样的节点只保留一个

## 第二步：给每个节点开一个本机端口

Mihomo 有个 `listeners` 功能：**可以开多个入口端口，每个入口固定走一个指定节点**。我们就用它给每个节点分配一个端口。

用 Python 写一个导出脚本，读取订阅文件，生成 `mihomo.yaml` 和 `nodes.json`：

```python
import json
import re
from pathlib import Path

import yaml  # pip install pyyaml

SKIP = re.compile(r"剩余|流量|到期|过期|重置|官网|套餐")
START_PORT = 17901

sub = yaml.safe_load(Path("subscription.yaml").read_text(encoding="utf-8"))
nodes = [p for p in sub["proxies"] if not SKIP.search(p["name"])]

mihomo = {
    "mode": "rule",
    "log-level": "warning",
    "allow-lan": False,        # 不允许局域网连接
    "proxies": nodes,
    "listeners": [
        {
            "name": f"node-{i + 1}",
            "type": "mixed",       # 同时支持 HTTP 和 SOCKS5
            "listen": "127.0.0.1", # 只监听本机
            "port": START_PORT + i,
            "proxy": node["name"], # 这个端口固定走这个节点
        }
        for i, node in enumerate(nodes)
    ],
    "rules": ["MATCH,REJECT"],  # 不走 listeners 的流量一律拒绝
}
Path("mihomo.yaml").write_text(yaml.safe_dump(mihomo, allow_unicode=True), encoding="utf-8")

registry = [
    {"name": node["name"], "url": f"http://127.0.0.1:{START_PORT + i}"}
    for i, node in enumerate(nodes)
]
Path("nodes.json").write_text(json.dumps(registry, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"导出 {len(nodes)} 个节点，端口 {START_PORT}~{START_PORT + len(nodes) - 1}")
```

生成的 `nodes.json` 长这样，爬虫只需要读它：

```json
[
  {"name": "香港 A", "url": "http://127.0.0.1:17901"},
  {"name": "日本 A", "url": "http://127.0.0.1:17902"}
]
```

两个细节值得说一下：

- **`listen: 127.0.0.1`**：端口只给本机程序用，外网连不上，不会变成别人也能蹭的公开代理
- **`rules: MATCH,REJECT`**：只有走指定端口的请求才会出去，没有「找不到节点就直连」的退路，避免爬虫不小心用服务器真实 IP 去请求

> ⚠️ `mihomo.yaml` 里有节点的密码和地址，相当于你的订阅凭据，**不要提交到 Git**，权限设成只有自己能读（`chmod 600`）。`nodes.json` 里只有名字和本机端口，可以放心给程序读。

## 第三步：部署到服务器

服务器上不需要 Clash Verge，只要一个 Mihomo 内核：

1. 从 [Mihomo Releases](https://github.com/MetaCubeX/mihomo/releases) 下载对应系统的版本，比如 Linux 服务器一般选 `linux-amd64`，解压后放到 `/usr/local/bin/mihomo`
2. 把 `mihomo.yaml`、`nodes.json` 上传到服务器，比如 `/etc/myspider/`
3. 用 systemd 让它开机自启、挂了自动重启

systemd 服务文件 `/etc/systemd/system/mihomo-spider.service`：

```ini
[Unit]
Description=Subscription proxy listeners for spider
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/mihomo -d /var/lib/mihomo-spider -f /etc/myspider/mihomo.yaml
Restart=on-failure
RestartSec=5
StateDirectory=mihomo-spider
NoNewPrivileges=true
MemoryMax=256M

[Install]
WantedBy=multi-user.target
```

启动并检查：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mihomo-spider
systemctl status mihomo-spider
```

验证某个节点能不能用，直接用 curl 走对应端口：

```bash
curl -x http://127.0.0.1:17901 https://api.ipify.org
```

能返回一个 IP，而且不是服务器自己的 IP，就说明这个节点通了。换个端口再试，返回的 IP 会不一样。

> 我的项目里，Mihomo 用一个没有登录权限的专用系统用户运行，并用 systemd 限制它能写的目录和内存。个人小项目照上面的最简版就能跑。

## 第四步：爬虫轮换使用节点

最简单的用法，`requests` 里指定代理就行：

```python
import requests

proxy = "http://127.0.0.1:17901"
resp = requests.get("https://example.com/api", proxies={"http": proxy, "https": proxy}, timeout=15)
```

真正用起来，要加一点「轮换 + 冷却」的逻辑：

```python
import json
import time

import requests

nodes = json.load(open("/etc/myspider/nodes.json", encoding="utf-8"))
cooldown_until = {}  # 节点 url -> 冷却到什么时候


def pick_node():
    now = time.time()
    for node in nodes:
        if cooldown_until.get(node["url"], 0) <= now:
            return node
    raise RuntimeError("所有节点都在冷却中")


def fetch(url, max_attempts=5):
    for _ in range(max_attempts):
        node = pick_node()
        proxy = node["url"]
        try:
            resp = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=15)
        except requests.RequestException:
            cooldown_until[proxy] = time.time() + 60    # 连不上：冷却 60 秒
            continue
        if resp.status_code == 429 or resp.status_code >= 500:
            cooldown_until[proxy] = time.time() + 120   # 被限流或服务端出错：冷却 120 秒
            continue
        return resp                                     # 成功：下次继续用这个节点
    raise RuntimeError(f"试了 {max_attempts} 个节点都失败")
```

核心规则就三条：

- **好用的节点一直用**：没出错就不换，减少切换带来的不稳定
- **出错的节点先歇一会儿**：被限流（429）或连接失败，就冷却一段时间，换下一个节点重试
- **普通的业务错误不换节点**：比如 404、参数错误，换节点也没用，直接报错

## 我的聪明钱追踪项目是怎么用的

在这个项目里，上面的流程是这样落地的：

- **节点来源**：在电脑上用导出脚本读取 Clash Verge 里已经下载好的订阅，过滤掉提示条目和不需要的地区，两个订阅合并去重，一共导出了一百多个节点，端口从 `17901` 开始依次排下去
- **服务器部署**：腾讯云上用 systemd 跑一个专用的 Mihomo 服务，只监听 `127.0.0.1`；`mihomo.yaml` 和 `nodes.json` 放在服务器的配置目录里，不进 Git
- **请求节奏**：所有请求共用一个全局节奏，每 0.5 秒最多发起一次请求（跨进程、跨节点合计），失败重试也算在里面，不是「每个节点各 0.5 秒」
- **失败处理**：每个请求最多换 5 个不同节点；限流冷却 120 秒，连接和服务端故障冷却 60 秒，对方返回了更长的重试时间就按对方的来
- **不回退直连**：所有节点都不可用时直接报错，不会偷偷用服务器自己的 IP 去请求
- **多进程共享状态**：网页服务和后台采集是不同进程，节点冷却状态存在一个小的 SQLite 文件里共享，避免一个进程刚把节点打到限流，另一个进程又去用它

订阅更新了怎么办？在电脑上重新导出一遍，把两个文件替换到服务器上，重启 Mihomo 服务就行。

## 注意事项

- **订阅凭据别泄露**：`mihomo.yaml` 相当于把所有节点的账号密码写在一起了，不进 Git、不发给别人
- **只监听本机**：不要把 `listen` 改成 `0.0.0.0`，否则任何人都能用你的节点
- **节点名不等于真实出口**：名字叫「香港」不代表出口一定在香港，有地区要求的话用 curl 实测一下出口 IP
- **控制请求频率**：多节点是为了稳定，不是为了无限加速。合理设置请求间隔，遵守目标网站的使用规则
- **机场的使用条款**：有些机场不允许把订阅用在服务器上或多设备同时使用，用之前先看清楚

复杂的配置，比如按地区分组、自动测速选节点、给不同爬虫分配不同节点组，都可以在这个基础上扩展。不熟悉 Mihomo 配置语法的话，把需求和配置丢给 AI，让它帮你写就行。
