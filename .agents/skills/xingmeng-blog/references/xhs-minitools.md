# 小红书小工具移植

## 任务状态

2026-11-04 用户确认方案并要求开始，已按九宫格、文字卡片、编解码的顺序实现三个独立小红书小工具，完成本地流程、静态检查、严格 Mock、官方包体审计与 ZIP 打包。之后用户明确要求优化文字卡片和编解码并提交平台更新；两个 1.0.1 更新已提交审核，平台显示“审核中”，尚未审核通过或公开上线。创服模拟器实机与 Android／iOS 真机验收仍待进行。

交付要求为原生 HTML/CSS/JS、手机竖屏优先、统一视觉、各工具独立目录与 README、各自可打包 ZIP。浏览器预览须在缺少 `window.xhs` 时完整支持本地核心流程。用户自行上传。可选 AI 须具备无 AI 降级。

源码位于仓库根 `xhs-minitools/`，三个目录为 `image-split/`、`text-cards/`、`text-codec/`，各自自包含且附 README。验证使用独立工具与人工样例。

## 官方规则核验

2026-11-04 通过 Ego 浏览器完整阅读最后更新为 2026-10-30 的[官方能力清单](https://miniapp-sandbox.xiaohongshu.com/minitool/doc)，并用现有登录态进入[创作服务平台小工具上传表单](https://creator.xiaohongshu.com/new/red-app)。首次实现时仅查阅表单与协议；后续按用户明确要求，实际提交文字卡片与编解码的版本更新，平台状态见“官方 Skill 重打包”。

- 上传表单明确 ZIP 单文件最大 10MB。名称、简介各最多 14 字符，版本号使用语义化版本。
- 图标支持 PNG/JPG/JPEG，最大 5MB，推荐 1:1。封面支持同类图片，最大 10MB，固定裁剪 3:4。图标、封面、场景标签与所需权限均为上传资料。
- 表单支持部署后扫码预览。管理页提示审核通过后可在发布页添加到笔记，官方[内测邀请说明](https://fe-video-qc.xhscdn.com/fe-platform-file/104101b8322bpulog7u06f48k3g2740000000016rhrpc6)确认上传配置、提交审核、通过后挂载的流程。当前页面未给出审核时长承诺。
- [《小工具服务协议》](https://agree.xiaohongshu.com/h5/terms/ZXXY20260630004/-1)要求年满 18 周岁、具备完全民事行为能力、使用正常注册账号，代表组织时另需获得组织授权，平台可要求身份或资质补充。由条款判断个人可以使用本服务。当前账号已能进入上传表单，此次核验范围不包含实际提审或最终上架结果。
- 当前上传口令指向 [minitool-zip-builder 1.8.0](https://fe-static.xhscdn.com/minitool/20261015161653/minitool-zip-builder-1.8.0.skill)。开发读取其 SKILL 与全部实现引用，并重新获取在线契约。三个最终 ZIP 均通过该版本官方 `audit_artifact.py`，0 warning。以后上传仍按当时页面口令复核。

## 实现与验收约束

- ZIP 根必须为唯一 `index.html`。仅打包官方允许资源，README、测试与构建文件留在源码目录。
- 使用外置经典 JS 与 `addEventListener`。所有运行资源包内相对引用，交付兼容 Chrome 61 / ES2017，CSS 同样保留基线布局。
- 导出采用 `toDataURL`、`writeTempFile({ data })`、返回的 `filePath`，再调用相册或 `postNote`。逐项保存并记录进度与失败位置。临时路径即用即弃。
- `postNote` 图片字段为 `mediaInfo.image_resources`，单次 1–18 张。超过 18 张时显示分组，由用户选择一组发送，结果全部保留。
- Storage 在客户端 9.46.0+ 使用，`data` 为 JSON 字符串，单 key 最大 1MB、总量 10MB。历史最近 10 条，存储失败须明确呈现且保留当前结果。
- `getWindowInfo` 在客户端 9.49+ 使用，适配 `safeArea` 与可空的 `menuButtons`，返回值为容器坐标系的逻辑像素。
- AI 为可选增强。方法存在仍可能未加白，处理 `AI_NOT_ALLOWED`、配额、审核拦截及空结果，保留原输入。
- 浏览器与严格 Mock 检查用于本地流程、契约及失败路径。创服模拟器、Android 与 iOS 真机验证分别记录。Chrome 61 实际内核、字体度量与真机性能仍待实测，静态基线检查和现代浏览器结果须按范围归因。

## 原有逻辑与已确认问题

2026-11-04 只读审查以下工具代码，并以公开源码的人工输入运行局部检查。

| 工具 | 源码 | 移植注意事项 |
| --- | --- | --- |
| 九宫格 | `docs/tools/components/PanelImagesplit.vue` | 复用行列与 canvas 坐标，替换 JSZip/下载导出，处理 `ResizeObserver` 基线、大图内存及输入校验 |
| 文字卡片 | `docs/tools/components/PanelMarkdownImage.vue`、`docs/tools/utils/markdownImage.js` | 复用 Markdown 子集与 canvas 排版思路，重做逐行分页与 2 倍导出 |
| 编解码 | `docs/tools/components/PanelBase64.vue`、`PanelUrl.vue` | 保持 UTF-8 与 URL 百分号语义，移除复制依赖，非法输入时清空过期结果 |

- 原站 Markdown 渲染在 `maxHeight=16000` 超限时按块停止。移植版改为逐行分页，长段落与代码块可连续跨页。
- 原站 `parseMarkdown` 遇到不规范围栏行如三个反引号后跟 `js extra` 时存在输入游标不前进的循环，500ms 限时检查超时。移植版保证每个分支消费输入，并以限时回归检查覆盖不规范及未闭合围栏。
- 移植版 Base64 对中文、普通 emoji、家庭组合 emoji、换行及 NUL 的往返通过检查，孤立代理项、非法 padding、尾部数据位及无效 UTF-8 会给出错误。
- 移植版换行保护代理对、组合音标、肤色、旗帜与 ZWJ emoji，相关回归通过。

## 当前边界与验证结果

- 九宫格每项行列 1–12、总数最多 36，输入最大 20MB／6400 万像素，输出整图最长边 4096、总像素最多 1200 万。超大图等比缩小并显示尺寸。狭长图在该预算内无法让每格至少 1px 时提示减少行列或裁剪。
- 文字卡片最多 30000 UTF-16 字符／80 页。默认逻辑 540×720、2× 输出 1080×1440。长图逻辑高度最多 2048，超长继续分页。预览单张图片、导出逐页绘制并释放 Canvas。
- 编解码每次输入最多 3000 UTF-16 字符，保证 URL 最坏 27000 字符输出加标题可进入图片排版器。最近 10 条放同一 Storage key，最大输入边界使总量低于单 key 限额。读取失败时保留页面内记录，避免用空历史覆盖未知旧数据。
- 三份 `xhs.js` 完全相同，文字卡片的 `markdown-renderer.js` 与编解码 `text-image.js` 完全相同，持续回归检查核对副本一致性。
- `node xhs-minitools/scripts/check.mjs` 检查经典 ES2017 脚本、禁用能力、资源引用与 CSS 基线，三个目录通过。`--self-test` 通过。
- `smoke.mjs` 覆盖平台方法及参数、18 张分组、拒绝授权、续存、并发取消、Storage 版本／JSON／1MB／迁移／失败及编解码历史并发。`image-check.mjs` 覆盖加载时改行列、连续选图竞态、生成取消、狭长图与 901×607 分格完整覆盖。`renderer-check.mjs` 覆盖逐字符连续性、组合 emoji、51 页长代码、三主题／三尺寸／2× 绘制及 80 页边界。上述命令均从 `xhs-minitools/scripts/` 调用，或在 `xhs-minitools` 下加 `node scripts/` 前缀。
- Ego 实际浏览器完成选图、9／36 张生成、非法行列、浏览器导出提示、3 种卡片尺寸、47 页含组合 emoji 的正文及分组、Base64／URL／HTML 转换、非法输入清旧结果、最近 10 条保存和刷新恢复。三个工具在 320／390／430／768／1280px 检查无横溢及按钮／输入框越界，九宫格、文字卡片与编解码的 390px 页面及导出卡片均经截图目视检查。交互资源记录未见站外请求。
- 浏览器内注入 Mock 验证保存 1 张后拒绝授权、从失败项继续、临时路径带入笔记、安全区 56px／28px、AI 空结果与未加白保留正文、编辑后隐藏旧 AI 建议。此处为 Mock 范围。
- `python3 xhs-minitools/scripts/pack.py` 按允许资源白名单生成确定性 ZIP，`--self-test` 通过。最终包内每个资源逐字核对源码，根入口与 README 排除检查通过。

| 产物 | 字节数 |
| --- | --- |
| `xhs-minitools/dist/image-split.zip` | 11774 |
| `xhs-minitools/dist/text-cards.zip` | 17979 |
| `xhs-minitools/dist/text-codec.zip` | 19457 |

## 上传素材

2026-11-04 为每个工具新增 `assets/icon.png` 与 `assets/cover.png`，供上传表单单独使用，不打进小工具 ZIP。图标为 1024×1024，封面为 1242×1656；六张图均小于 550 KB，48px 缩略图目视仍可辨认。`xhs-minitools/scripts/pack.py` 排除工具目录内的 `assets/`，自检覆盖该规则。

## 官方 Skill 重打包

2026-11-04 下载并完整阅读上传页提供的 `minitool-zip-builder` 1.8.0 包（`SKILL.md`、两个审计脚本及全部 references）。该 Skill 要求根目录唯一 `index.html`、仅包含允许的静态资源、压缩目录内容；不规定或生成 manifest、appId、token、签名、hash 或构建标记。随包审计脚本只检查 ZIP 上限及文本资源体积，不会补写发布元数据。登录后的新建页仅列 ZIP、语义化版本号、名称、简介、图标、封面、场景标签和所需权限；“让 Agent 帮我管理小工具”为可选表单项。

按官方流程将三个运行目录复制到临时 staging，先用 `audit_artifact.py` 审计 staging，再从 staging 根执行 `zip -r` 生成 `dist-official/`，最后审计每个最终 ZIP；目录和 ZIP 审计均为 0 warning。`check.mjs` 与 `smoke.mjs` 通过。新旧包清单相同、每个成员文件 SHA-256 相同，没有新增或修改运行文件；只改变 ZIP 成员顺序及归档元数据，体积变化为 +232／+292／+293 字节。新包：`image-split.zip` 12006 B、`text-cards.zip` 18271 B、`text-codec.zip` 19750 B。

后续用户要求文字卡片与编解码加入默认示例、清空示例，保留“试试示例”；文字卡片编辑时显示实时预览，编解码首页默认 O10，且含标准／Pro 模式。两个工具 README、编解码 smoke 回归及编解码封面同步更新。`node scripts/check.mjs` 与 `node scripts/smoke.mjs` 再次通过。通过既有创服管理页的“更新版本”入口，上传上述官方 ZIP 和编解码新图标／封面，分别使用版本 `1.0.1` 并提交。两个 ZIP 均显示“部署成功”；编解码图片另需分别确认平台裁剪。提交后管理列表显示文字卡片与编解码均为 `V1.0.1 · 审核中`，编解码页面出现“发布新版本成功”。这说明平台已受理审核，不代表审核通过或公开版本已更新；九宫格仍是已发布 `V1.0.0`。因此旧包“无可提审开发包”的原因尚未被证明已解决，待审核结果或平台反馈。

2026-11-05 用户确认：小红书内首次打开小工具时仍显示旧版本，重新打开后更新版本正常加载；本次归因为客户端／容器缓存，不能仅凭第一次打开的旧界面判断上传失败。
