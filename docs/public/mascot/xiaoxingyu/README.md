# 小星鱼图片帧素材

用户选定蓝发、星饰、披肩的人形角色，命名“小星鱼”。2026-10-22 用户要求停用 Live2D、恢复图片帧，并继续优化中间帧。当前采用图片图集和浏览器原生 Web Animations API，不加载 Cubism/Pixi 或 WebGL，不使用逐帧 JavaScript 循环。

## 网站资源

| 文件 | 布局 | 大小 | 加载时机 |
| --- | --- | --- | --- |
| `sprites.webp` | 800×400，4列×2行，原8姿态规范化 | 80,630字节（78.7 KiB） | 页面load后空闲挂载，角色展开时低优先级加载 |
| `wave.webp` | 800×800，4列×4行，16个挥手姿态 | 180,866字节（176.6 KiB） | 首次点击“打招呼” |
| `moods.webp` | 800×800，4列×4行，开心8姿态+入睡8姿态 | 179,668字节（175.5 KiB） | 首次点击“开心”或“小憩”，两者共用 |

- 每格200×200；以178px人物高度标定，动作图共用固定缩放比例178/306，脚底190px、鞋底中心x=100px。不再按每帧轮廓高度分别缩放；锚点仅取人物最底部4%、alpha≥128的不透明鞋底，避免把披风尖端误当脚。三个动作的中立帧直接复用原图待机。
- 每步80ms（12.5帧/秒）；挥手按16姿态组成45步序列，3.6秒完成抬手、腕部挥动和放下；开心26步、2.08秒，包括收手、微笑、停留和退回；入睡8步、0.64秒后保持，唤醒沿相同姿态倒序播放。
- 「弹一下」只用基础第0帧，在脚底50%/95%为原点的内层做1120ms有限弹性变换，最大上移8%、横向放大6%；蓄力、起跳、落地回弹后收稳，不加载新素材。中途选择其他动作时等落地再执行最新意图。
- 图片帧动作中途切换从当前实际显示帧收回到中立，再进入最新选择的动作；连续点击只保留最新意图。加载新图时停在当前姿态，失败收回待机、下次可重试。
- 暂停/后台/阅读/打印/减少动态效果停止时间线，恢复继续原进度；显式隐藏取消当前动作。手机首次默认收起，不请求贴图。待机眨眼约96ms；外层保持固定，不再叠加全身上下浮动。
- “弹一下”复用待机原画，用1120ms有限变换完成轻蹲、弹起、落地和回弹；不请求新素材，中途选择的动作在落地归位后执行。
- 入口为 `StarFishMascotLoader.vue` 和 `StarFishMascot.vue`；验证命令 `node scripts/check-mascot.mjs --screenshots` 只构建人工隔离页面。基础图预算100 KiB，动作图各180 KiB。

## 本地原件与生成

高清原件与中间产物仅在被Git忽略的 `.local-assets/mascot/xiaoxingyu/`，不提交或部署：

- `character-original.png`、`sprites-original.png`：已确认角色与原姿态图。
- `regeneration-2026-10-23/neutral-reference.png`、`wave-original.png`、`moods-original.png`：当前重生成参考和两套16格图集；内置 image_gen 以原待机单帧为参考，保留透明通道。小憩采用双手放腹前、逐渐闭眼的站姿。
- `regeneration-2026-10-23/generation-prompts.json`：当前两条完整提示词；约束保持原脸型、发型、服装、身体比例及脚部位置，逐步改变手臂和表情。未使用CLI图像生成服务。
- `regeneration-2026-10-23/pack-compare.cjs`：当前动作图裁格、清理相邻格残片、固定比例缩放和鞋底定位；`*-candidate-packed.png`为压缩前图集，`*-candidate.webp`为网页候选文件，`metrics.json`与对比图记录新旧差异。旧`*-before.webp`可用于回退。
- `sprite-source/pack-smooth.cjs`、`*-smooth-layout.json`和`smooth-generation-prompts.json`：旧补帧流程，仍用于重建基础图；不要用其旧动作图覆盖当前重生成动作。
- `sprite-source/before-smooth-2026-10-22/`：上一版网页贴图；旧生成图与打包脚本继续保留本地。
- `regeneration-2026-10-23/`：当前动作原图、生成提示词、`pack-compare.cjs`、固定缩放版图集、对比指标及旧版备份。
- `live2d-source/archived-web-2026-10-22/`：已停用的Live2D渲染器、模型与旧说明，不在公开目录。

打包时用alpha≥128的主要连通区域确定人物边界，再去除外部残片并按脚部对齐；低alpha像素可能把上一行鞋底连接到下一行呆毛，直接用全部alpha包围盒会混入悬空短线并影响缩放。此前用底部12%求脚部中心会纳入披风尖端，造成相邻入睡帧鞋底中心从92px跳至110px；现改为底部4%的不透明鞋底锚点。最终须量化每格真实鞋底位置并在白底和实际160px下目视，DOM框固定或单张截图正常不能证明播放稳定。当前新图内部的静止部位更一致，但原待机切入挥手仍有约3px脸部、5px胸针偏差，开心/小憩胸针约5–6px；不能宣称消除了全部抖动。生成源图透明边距不足，鞋底末端有约1–2源像素行跨格或触画布边缘，打包后约0.6–1.2px可能被平切，双鞋主体完整。对比记录在本地 `regeneration-2026-10-23/metrics.json`。

当前重生成图仍有原待机切入动作时的脸型、胸针比例差异，鞋底锚点与DOM边界通过不代表视觉消抖完成。上述1.5px/1px数据为旧版鞋底修正记录；当前图的逐帧指标以 `regeneration-2026-10-23/metrics.json` 为准。

在仓库根目录重建当前动作图（基础图保持原版）：

```sh
node .local-assets/mascot/xiaoxingyu/regeneration-2026-10-23/pack-compare.cjs
cp .local-assets/mascot/xiaoxingyu/regeneration-2026-10-23/wave-candidate.webp docs/public/mascot/xiaoxingyu/wave.webp
cp .local-assets/mascot/xiaoxingyu/regeneration-2026-10-23/moods-candidate.webp docs/public/mascot/xiaoxingyu/moods.webp
```
