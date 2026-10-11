# 性能约定

以下是已确认存在的实现语义，修改时避免退回原有持续空转或阻塞页面的行为；不代表线上性能指标已经量化。

## 全局脚本

- `docs/.vitepress/config.mjs` 给现有 6 个外部 head 脚本添加 `defer`；保持 `anime.min.js` 在 `fireworks.js` 之前执行，不能随意改成不保证顺序的 `async`。
- 飞鸟、鼠标轨迹与烟花保留原效果和开关；设置仍使用 `cpython666:disable-*` 键及 `cpython666-effects-change` 事件，不在每帧轮询存储。
- 三种效果响应设置变化、跨页签存储变化、页面可见性和 `prefers-reduced-motion` 变化。隐藏页面或要求减少动态效果时清理，恢复时按设置重新初始化，不能重复创建画布或飞鸟。

## 各效果生命周期

| 实现 | 应保持的行为 |
| --- | --- |
| `docs/public/js/mouse-trail.js` | 鼠标移动才请求动画帧；轨迹消退后停绘；resize 时重置尺寸并清空轨迹 |
| `docs/public/js/clickjs/fireworks.js` | 点击时绘制，跟踪重叠动画，全部结束后停绘；关闭效果会停止正在进行的动画 |
| `docs/public/js/birdfly.js` | 使用 `translate3d` 和按时间计算的速度移动 6 只鸟，resize 更新边界；可见且启用时仍持续飞行，不能宣称全站空闲时完全没有动画帧 |

## 首页

- `docs/.vitepress/theme/index.js` 的 `enhanceApp` 同步完成组件注册，不能再等待 Live2D 导入后才允许页面挂载。
- Live2D 在挂载后且路由为 `/` 时空闲加载，`requestIdleCallback` 超时 2 秒；无此 API 时用 1 秒定时器回退。
- 离开首页或卸载后，取消排队任务；已经发起的模块导入无法中断，但完成后不再初始化。导入失败不阻断页面；减少动态效果时不初始化。
- 已经初始化的 Live2D 保留原有随站点延续的行为，不把“取消待初始化任务”写成“离开首页销毁模型”。
- `docs/index/IndexPage.vue` 保存 Typed 实例并在卸载时销毁，同时移除 resize 监听。减少动态效果时显示静态标语、关闭背景旋转与 logo 动画；背景高度测量允许 header 不存在。
- `docs/index/SponsorsLinks.vue` 的赞助及友情链接图片使用 `loading="lazy"` 和 `decoding="async"`，避免这些图片争抢首页初始加载与解码。
