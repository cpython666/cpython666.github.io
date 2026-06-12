---
title: "P5-DrissionPage监听websocket请求"
date: "2024-12-02 22:37:40.499152"
updated: "2024-12-02 22:37:40.499228"
privacy: "登录可见"
visit_count: 31
legacy_id: 35
legacy_unique_id: "35"
---

# P5-DrissionPage监听websocket请求

欢迎大家来到DrissionPage自动化数据采集第六集，使用DrissionPage监听websocket请求。

之前做视频讲了如何监听http网络请求，然后就有兄弟问如何监听websocket，说实话我也没研究，但是有兄弟问了，我去找了下教程还比较少，于是自己结合网上教程实现了这样的效果。

接下来我们来看下效果：【演示】

如何实现这样的效果呢，这个视频我会带着大家一步一步实现出来。

首先我们要知道，drissionpage是基于cdp协议的，cdp协议就是谷歌浏览器官方支持的控制浏览器的协议。也就是说cdp协议支持的操作都可以实现。drissionpage也提供了执行cdp的方法。这里我们点进这个cdp协议大致看一下。[https://drissionpage.cn/browser_control/page_operation#-run_cdp](https://drissionpage.cn/browser_control/page_operation#-run_cdp)

在最开始，我们的dp是支持监听http的。但是为什么不支持webscoket呢？带着疑惑我们点进了他的监听器源码。

设置监听路径，然后开启网络监听，然后设置回掉函数，我们可以发现这里都是http的，没有websocket的，那也就是说我们加上说不定就可以了。

怎么加加什么呢？我尝试了下报错了，然后直接把这个文件全部发给gpt，复制粘贴运行，直接拿下。这里输出了接收到的数据包，没有输出发出的，有必要可以自己设置个回掉函数即可。

另外我们这里的paket其实没有用。因为没有yield出来数据。感兴趣需要自己实现。


```python
def _set_callback(self):
    self._driver.set_callback('Network.requestWillBeSent', self._requestWillBeSent)
    self._driver.set_callback('Network.requestWillBeSentExtraInfo', self._requestWillBeSentExtraInfo)
    self._driver.set_callback('Network.responseReceived', self._response_received)
    self._driver.set_callback('Network.responseReceivedExtraInfo', self._responseReceivedExtraInfo)
    self._driver.set_callback('Network.loadingFinished', self._loading_finished)
    self._driver.set_callback('Network.loadingFailed', self._loading_failed)


    # WebSocket events callback
    self._driver.set_callback('Network.webSocketCreated', self._webSocketCreated)
    self._driver.set_callback('Network.webSocketFrameReceived', self._webSocketFrameReceived)
    self._driver.set_callback('Network.webSocketFrameError', self._webSocketFrameError)

def _webSocketCreated(self, **kwargs):
    """WebSocket创建事件回调"""
    print("WebSocket created:", kwargs)

def _webSocketFrameReceived(self, **kwargs):
    """WebSocket消息接收事件回调"""
    print("WebSocket frame received:", kwargs)
    # 可以在这里处理接收到的消息
    frame = kwargs.get('response', {})
    if frame.get('payloadData'):
        print("WebSocket Message Payload:", frame['payloadData'])

def _webSocketFrameError(self, **kwargs):
    """WebSocket错误事件回调"""
    print("WebSocket frame error:", kwargs)
```
