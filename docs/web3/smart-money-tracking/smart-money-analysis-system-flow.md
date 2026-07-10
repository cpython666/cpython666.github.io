---
title: "P17-聪明钱分析系统的运行流程"
description: "记录聪明钱分析系统的数据采集流程，包括 Hyperdash 胜率数据、Hyperliquid 持仓信息和代理池测试配置。"
created_at: 2026-07-10 00:00:00
updated_at: 2026-07-10 00:00:00
keywords: "聪明钱分析系统,Hyperdash,Hyperliquid,代理池,链上数据,数据采集"
memberOnly: true
---

# P17-聪明钱分析系统的运行流程

采集 hyperdash 的数据：胜率、交易次数、已实现盈利。

采集 hyperliquid：持仓、浮动盈亏。

代理池：可配置测试哪个站点的代理。

![](/imgs/web3/smart-money-tracking/smart-money-analysis-system-flow/flow-1.png)

![](/imgs/web3/smart-money-tracking/smart-money-analysis-system-flow/flow-2.png)

## 代码仓库

- [hyperliquid_trader_stats](https://github.com/cpython666/hyperliquid_trader_stats)
- [IPProxyPoolPro](https://github.com/cpython666/IPProxyPoolPro)
