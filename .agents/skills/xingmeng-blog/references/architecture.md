# 架构与入口

本文件中的源码路径均相对仓库根目录。

## 项目事实

- 站点名称：星梦启航；正式地址：`https://cpython666.github.io`。
- 基础栈：VitePress 1.6 系列、Vue 单文件组件、npm；依赖版本以 `package.json` 和锁文件为准。
- 默认主题扩展位于 `docs/.vitepress/theme/`，没有独立业务后端。
- GitHub Pages 工作流在 `master` 推送或手动触发后安装依赖、构建并部署；流程定义不等于 AI 获得执行全站构建或推送的授权。
- 发展目标：用户希望把博客发展为垂直领域有影响力的网站，并适应 AI 时代的内容发现和使用方式。已确认同时服务两类读者：用 AI 做项目的开发者、独立创作者，以及用 AI 提升工作效率的非技术用户。最终垂直主线仍待定；“AI 工作流与实用工具”、围绕共同场景提供直接使用与开发改造两层内容，均为待定建议。“AI × Python 自动化实战”可作为技术深度方向，不再假定全站读者都有技术基础；受众确认不构成首页、栏目或商业模式改版授权。
- 网站吉祥物：用户于 2026-10-21 选定截图中蓝发、星饰、披肩的人形角色，命名「小星鱼」，授权实现动画；此次“B”指图库第二个选中形象，即首轮文字编号 A，不能误用鲸鱼造型。参考 `https://nav.linux.do/` 的互动形式，形象围绕「星梦启航」品牌；网站吉祥物不按 ChatGPT Work 宠物流程处理。

## 代码地图

| 任务 | 源码入口 | 约束或关系 |
| --- | --- | --- |
| 站点、顶部导航、侧边栏、SEO、搜索 | `docs/.vitepress/config.mjs` | 顶栏使用 `top_nav_config`，文章导航后提供独立的 `/prompts/` 入口，不显示破局笔记、备份、区块漫步；默认侧栏仍使用完整的 `nav_config`，已有侧边栏目标路径存在性检查 |
| 个人介绍与昵称签名历史 | `docs/web-intro/index.md`、`docs/web-intro/profile-history.md` | 2026-10-23用户要求归档；个人介绍、个性签名及 `web_intro_items` 提供入口。历史页按平台保留实际用过的文字，区分启用日期与留档日期，不把候选文案记成使用历史 |
| 文章导航与提示词 | `docs/navigation/NavIndex.vue`、`docs/prompts/PromptPage.vue`、`docs/prompts/prompts.js` | `/navigation/` 只展示文章目录，`/prompts/` 独立展示提示词并支持分类、搜索、复制与分享；原 `/navigation/` 提示词 hash 入口 replace 跳转，旧 ID 保持兼容 |
| 导航会员标记数据 | `docs/navigation/member.data.mjs` | 使用全站内容加载器，AI 不直接执行；隔离测试替换为人工 fixture |
| 主题插槽、评论、图片查看、会员遮罩 | `docs/.vitepress/theme/index.js` | 按本次功能限定修改范围 |
| 吉祥物小星鱼 | `docs/.vitepress/theme/components/StarFishMascotLoader.vue`、`StarFishMascot.vue` | load 后空闲导入图片帧主体；展开加载 `docs/public/mascot/xiaoxingyu/sprites.webp`，弹跳复用原待机图，首次打招呼加载 `wave.webp`，开心/小憩共用按需 `moods.webp`；原画及停用的 Live2D 工程在被 Git 忽略的 `.local-assets/mascot/xiaoxingyu/` |
| 评论（giscus + Waline 并存） | `docs/.vitepress/theme/comment.js`、`components/WalineComment.vue` | 两者共用 `useCommentEnabled` 显示规则；Waline 在 `doc-after` 插槽、位于 giscus 之上，服务端 `https://cpython666-waline.vercel.app`（Vercel + Neon，图片默认 base64 存库），`walineServerURL` 留空时不渲染；`@waline/client` 保留 `~3.13.0`、锁文件为 3.13.0，Node 构建环境升级不顺带升级评论依赖 |
| 首页展示与打字效果 | `docs/index.md`、`docs/index/IndexPage.vue` | 首页设 `markdownStyles: false` 保留全宽展示；组件样式必须 scoped，旋转背景在首页容器内裁切；Typed 与 resize 监听需随组件卸载清理 |
| 首页赞助商与中转站推荐 | `docs/index/SponsorsLinks.vue`、`docs/life/codex-relay-provider-history-sync.md` | HeyRoute 首页卡片与文章推荐均跳转 `https://heyroute.ai/stardream`，`/console` 仅作为文章中的管理入口；官网图标本地保存于 `docs/public/imgs/sponsors/heyroute_logo.png`。HeyRoute 卡片使用官网主标语及单 API Key 接入 Codex / Claude Code 的特色说明，文章补充 OpenAI 兼容客户端与 Base URL；卡片文案可换行且窄屏不裁切。图片使用 `no-zoom`，链接保留 `sponsored noopener noreferrer` |
| 文章工具、目录开关、阅读量 | `docs/.vitepress/theme/components/` | 优先复用现有组件 |
| 复制文本 | `docs/utils/copy.js` | 提示词等调用此工具，调用方处理成功/失败反馈 |
| 自绘选择控件 | `docs/components/SiteSelect.vue` | O10 模式与手机资源分类共用；`id`、`label`、`modelValue`、`options` 入参，`update:modelValue` / `change` 仅在选项变化时触发；不使用隐藏原生 select |
| 资源导航 | `docs/nav/NavPage.vue`、`docs/nav/WebLink.vue`、`docs/nav/data.js` | 与文章导航是两个不同页面；`navigationData` 按 `title` / `items` 分组，“AI模型检测”收录 ModelTrace 与 lm-detector；NavPage 负责搜索、分类和分批展示，WebLink 接收筛选后的 `items` 渲染卡片；顶部只保留搜索和统计，760px 及以下上下排列，不重复显示页面名和介绍 |
| 项目和工具 | `docs/projects/ProjectPage.vue`、`docs/spider-tools/SpiderTools.vue` | 项目封面使用独立 16:9 容器与 `object-fit: contain`，完整保留不同比例原图；不要恢复 `cover` 裁切或让图片百分比高度撑高网格 |
| 备份展示与会员介绍 | `docs/components/XBackupList.vue`、`docs/vip/index.md` | 备份统计栏在手机端取消 260px 最小宽度，三列允许收缩；会员介绍表格允许长链接任意位置换行 |
| 全局特效和样式 | `docs/public/js/`、`docs/public/css/index.css` | 脚本由站点 head 引入 |
| 发布流程 | `.github/workflows/static.yml` | `actions/setup-node@v7` 配置 Node `24.22.1`，沿用 `npm ci` 和现有锁文件；这是 2026-10-27 核实的最新 LTS 安全版本（当时 26 仍为 Current），固定版本以保证复现，后续安全补丁需重新核实；构建产物目录为 `docs/.vitepress/dist`，源码配置不代表已部署 |
| 对外知识库 Skill | `skills/xingmeng-knowledge/`、`scripts/build-skill.mjs` | `SKILL.md` 和两个 CLI 脚本手写；`references/` 与 `scripts/lib/` 由 `npm run skill:build` 从资源导航、提示词、项目数据、工具箱函数和文章 frontmatter 生成，不手改。文章只读 frontmatter，跳过会员、草稿、`/backup/`、noindex 和首页布局页；改动上述数据源后需重新生成，`npm run skill:check` 检查是否过期 |

## 配置关系

- 顶部社交入口保留原 Bilibili、GitHub、CSDN、语雀，之后依次增加 X、YouTube、抖音，共七项，维护于 `docs/.vitepress/config.mjs` 的 `themeConfig.socialLinks`。X 使用用户确认的 `https://x.com/stardreamfly`，YouTube 使用 `https://www.youtube.com/@stardream666`；抖音使用本轮用户提供的新账号完整链接，与 `docs/nav/data.js`“认识我”中的“SI斗罗”一致；“认识我”中的 B站、公众号、新抖音、小红书、X、YouTube 卡片名称统一为“SI斗罗”，图标使用各平台标识以便区分，不使用相同个人头像；B站复用现有图标，抖音/微信/小红书/X/YouTube 的本地 SVG 位于 `docs/public/logos/`，取自已安装的 Simple Icons，并保留浅色底以兼容深色主题；小红书使用用户确认的 `https://www.xiaohongshu.com/user/profile/63e21026000000002600652d`，公众号保留既有二维码与入口，旧“Python爸爸”卡片及原链接继续保留，并标注旧账号已封禁。各顶栏入口使用内联 SVG 和明确的 `ariaLabel`；GitHub、X、YouTube、抖音图标取自已安装的 `@iconify-json/simple-icons`，沿用主题 20px 尺寸与 `currentColor`。不要恢复字符串图标：VitePress 开发模式可能回退到 `api.iconify.design` 远程蒙版，请求失败会让图标空白；CSDN、语雀继续使用原有内联 SVG。
- 资源收录位置：7-Zip 在 `docs/nav/data.js` 的“其他工具”分类，官网图标存为 `docs/public/logos/7zip.png`；吾爱破解主站已分别收录于“资源”和“交流论坛”，新增时先检查已有链接，避免重复追加。
- 资源分类直接按 `navigationData` 数组排序：Agent、AI聊天对话、AI代码编程、Skill、AI模型检测、AI图像绘画、AI 3D、AI文档办公优先，其余分类保持原相对顺序；桌面分类栏、手机下拉框和全部资源卡片共用此顺序。Agent 收录 DeepSeek Harness、OpenClaw（小龙虾）、WorkBuddy，官网图标存为 `docs/public/logos/` 下的 `deepseek-harness.svg`、`openclaw.svg`、`workbuddy.svg`。
- 文章导航遍历 `theme.sidebar`，结合 `blogNavInclude`、`blogNavExclude` 和 `blogNavTitles` 生成分组与标题；不要再维护第二份文章目录。“区块漫步”作为 `/web3/block-walk/` 的独立分类，放在“币圈入圈指南”之后，复用 `block_walk_items`；其十篇文章从 `/web3/` 父分组移出，避免重复计数，顶部仍不显示该入口。
- 文章导航、提示词、项目、资源导航、工具和会员介绍页直接展示功能内容，不再在顶栏下方重复大页面标题、装饰标签和介绍；必要 h1 视觉隐藏。项目统计并入结果行；项目名称、工具面板标题、文章分组以及归档账号等内容标识保留。禁止用全局隐藏全部 h1 的方式误伤文章正文。
- 访问量统一由 `ArticleHits.vue` 在主题 `layout-bottom` 插槽挂载一次，位于页脚之后、正常文档流底部居中；首页也使用该组件，沿用根路径统计，其余页面按各自路径统计。图片立即请求，不能因放到底部就懒加载而漏掉未触底的访问；保留 `hits: false`、404 和草稿路径排除。不要再在 `doc-before`、`home-features-after` 或 `footer.message` 中另挂访问量标签。
- 站内搜索采用 VitePress local search，中文分词逻辑在配置内。
- SEO 已有 canonical、description、Open Graph、Twitter 卡片、JSON-LD 与 sitemap 生成逻辑；按缺陷修订，不重复接入一套方案。
- Google 接入：`config.mjs` 的 head 已启用一个 `google-site-verification` 标签，2026-10-21 在线首页也确认存在；`robots.txt` 已声明可访问的 `/sitemap.xml`。标签存在只证明网站端已配置，Search Console 账号的所有权验证、站点地图提交与处理结果须在后台核实；代码内旧「未成功」注释不能代替当前状态。Google Analytics/gtag 目前仅保留被注释的 TAG_ID 示例，没有启用；不把它与 Search Console 混淆，也不记录验证码。
- `themeConfig.lastUpdated` 在当前 VitePress 版本仍有兼容处理，不能仅凭位置断言更新时间失效。
- 项目页顶部在 `ProjectPage.vue` 内展示最多 5 个高 Stars GitHub 仓库轮播，按已有 Stars 数据降序、按仓库地址去重，复用现有 API 与 6 小时缓存；未知 Stars 不当作零参与排名，没有任何已知值时回退为“精选项目”。轮播独立于下方搜索/分类，支持前后、指示点和键盘左右键，每 6 秒自动切换；悬停、焦点进入、隐藏页签或减少动态效果时暂停，提供手动播放开关，卸载清理计时器和监听。封面继续使用 16:9 完整展示，不新增轮播依赖。
- 项目页搜索与分类共用 `.controls` 吸顶栏，≥960px 停在导航下方（`--vp-nav-height`），≤959px 顶部为0；沿用主题实色背景、底边框和低于导航的层级。不能只让内部分类列表 sticky，否则会被短父容器限制。切分类后等 DOM 更新，按筛选栏实际高度定位结果起点，首项不被遮挡且焦点留在按钮；点击已选分类不跳滚动。
- 项目页五个教程合集（DrissionPage、Pygame、Django、Scrapy、PyQt6）的独立封面位于 `docs/public/imgs/app/<小写技术名>-tutorial.webp`，由 `docs/projects/data.js` 引用；统一为 1280×720（16:9）WebP，约 46–66 KiB，使用深色等距插画、英文技术名与中文主题。更换封面时保持图片比例，并检查“合集”筛选下五张图片实际加载及手机端标题完整性。
- 资源导航广告图、项目精选/卡片封面和图片分割预览使用 `no-zoom`；否则主题会将其加入 PhotoSwipe，并受到 `.vp-doc img.is-zoomable` 的 520px 最大宽度及上下 16px 外边距影响，外链点击也会被图片查看器拦截。
- 工具总入口 `/spider-tools/` 保留，7 个工具各有 `/spider-tools/<pageId>/index.md` 对应的独立网址 `/spider-tools/<pageId>/`；页面用 `SpiderTools tool-id` 复用布局，只渲染当前工具，默认 slot 放静态 Markdown 使用说明、示例和相关工具链接。标题用 sr-only h1，不增加顶部大标题；手机直接打开时定位操作面板，已有指南锚点优先。工具间导航切换页面，输入不跨页面保存。
- `SpiderTools.vue` 元数据维护名称、简介和稳定 `pageId`；分享复制三行「名称／简介／https://cpython666.github.io/spider-tools/<pageId>/」，不包含用户输入或 query。旧总入口 `#<pageId>` 用 replace 跳到独立页并保留 query，未知 hash 保持总入口；兼容需同时监听 hashchange 和链式 onAfterRouteChange（卸载恢复），因为同页面 query 导航的 pushState 不触发 hashchange。独立页的指南 hash 不参与旧入口跳转。
- 独立工具页 frontmatter 为 `layout: home`、`markdownStyles: false`、`tool: true`，各自维护 title/description；沿用现有 canonical、社交元数据与 sitemap，`tool: true` 输出 WebApplication 和 og:type=website。知识库工具链接同步为独立网址；生成器必须在 frontmatter 结束行停止读取，不能用固定大小缓冲区预读会员正文。
- O10 工具位于 `docs/spider-tools/components/PanelO10.vue`，算法在 `utils/o10.js`，来源为相邻 `Python-Project/O10加解密/O10encode.py`。标准版按 Unicode 码点转二进制、以大写 O 分隔；Pro 版以 I/l 表示 1/0、数字 1 分隔，须保持原版输出兼容，不能按 UTF-16 码元拆开 emoji。网页只接受对应模式的规范编码字符及非空分段，超出 Unicode 范围报错；空输入清空结果并提示，不沿用原 Python 空串解码异常。输入或模式改变时清空旧结果，支持复制结果及结果复用。 页面简介、SEO description 与分享文案须同时写明标准版的数字 0、1／大写 O，以及 Pro 版的大写 I／小写 l／数字 1，避免将两种模式都描述成 O、1、0。
- `SiteSelect.vue` 用按钮 combobox 和自绘 listbox 展示选项，沿用主题颜色；支持方向/Home/End/Enter/Space/Escape/Tab、字母前缀定位、外部点击关闭、选中项标记和菜单内部滚动。展开空间不足时向上打开，resize 关闭；页面选择行为仍由调用方处理，不能破坏资源分类 hash、搜索清空与分批重置。
- 工具分享、O10 结果复制和 cURL 代码复制统一由 `SpiderTools.vue` 的 `feedback` 事件呈现视口顶部提示，使用图标、成功/失败颜色、实色卡片与阴影，成功 4 秒、失败 6 秒并支持手动关闭；连续操作重置计时，提示内获得键盘焦点时暂停倒计时、离开后恢复，关闭时仅在焦点仍位于提示内才还给触发按钮，路由切换/卸载清理。分享和结果复制按钮同步显示已复制状态，O10 输入或模式改变后重置；不要只在结果框下方放提示，避免反馈落到视口外。cURL 复制也调用公共复制函数，保留旧浏览器回退。
- 公用复制函数 `docs/utils/copy.js` 的旧浏览器回退使用 textarea 保留换行，不能用单行 input，否则工具、提示词的多行分享文本会连成一行。
- 完整顶栏在 768–1279px 使用 VitePress 原生折叠菜单（`docs/public/css/index.css`），1280px 以上恢复桌面导航；菜单、主题切换和社交链接仍来自同一主题配置，不复制菜单数据。默认 768px 即展开桌面菜单会被当前八个入口和搜索框撑宽，相关验证需包含开菜单、路由跳转及缩放后的滚动解锁。
- 当前首页由 `docs/index.md` 引入 `IndexPage.vue`，主展示为随机背景、品牌图标、挂载后显示的打字标语和赞助链接；组件内尚无固定的受众/任务说明、学习路线或代表案例入口。若后续调整定位，先确认主线与首页内容，再修改展示；现状不等于已确认改版方案。
- 2026-10-22 用户要求停用Live2D、恢复图片帧并继续补中间动作；当前保留原蓝发人形，规范化原8姿态，挥手16姿态、开心与入睡各8姿态。使用原生Web Animations API离散图集时间线，每步80ms；挥手45步3.6秒、开心26步2.08秒，入睡0.64秒后保持。中立帧直接复用原待机，所有图统一200px格，以最底部4%不透明鞋底确定锚点，避免披风尖端干扰；角色外层固定，已移除全身上下浮动。观感仍以用户验收为准。
- 图片帧动作切换先从当前显示姿态倒放收回中立，再进入最新选择；弹跳则待落地归位再切换。不直接换图，连续点击只保留最新意图。暂停保留currentTime；显式隐藏取消动作及加载。保留拖动、方向键、大小、暂停、隐藏/召回与偏好键 `cpython666:starfish-mascot`；手机首次收起、展开最大120px，桌面默认160px。
- 用户在鞋底对齐修正后仍反馈动作有持续抖动感，并询问Live2D所需软件与MCP、表示可以安装。几何稳定检查不代表形象与动作观感已验收；独立生成各帧仍存在脸型、比例与细节变化。后续转向合格分层原画与Cubism绑定属于评估方向，目前未重新启用Live2D或安装新软件。 用户后续以[以太之尘《异环三小只》](https://www.douyin.com/video/7699311820796698225)作为“Q弹”动作参考；原视频页面标注AI生成，作者有[ComfyUI / AnimateDiff转绘教程](https://www.bilibili.com/video/BV1LC4y1G7JT/)，但本条作品的具体软件与流程未确认，不能称其为Live2D示例。用户已确认沿用小星鱼，重点改善动作弹性；当前新增「弹一下」作为本地动作样例，同一张待机原画完成轻蹲、弹起、落地回弹与收稳，不替换角色设计。用户已确认弹跳流畅，仍反馈其他动作抖动，并要求重新生成尝试。已用内置image_gen重生成挥手与开心/小憩两张16格图集，已完成本地试播，用户于2026-10-26要求分批提交推送；旧图备份位于 `.local-assets/mascot/xiaoxingyu/regeneration-2026-10-23/`。新小憩是站姿双手放腹前、逐渐闭眼，整体较少歪头。新图内部更一致，但原待机切入/返回的脸、胸针比例差仍存在，不能宣称消抖完成；整身图逐帧重绘不是连续变形。头发、披风独立物理摆动及是否重新分层绑定仍待定，不能把本次整体弹性变换称为完成Live2D绑定。
- Live2D 渲染器、公开模型与旧说明已移至 `.local-assets/mascot/xiaoxingyu/live2d-source/archived-web-2026-10-22/` 本地存档；当前网站不导入运行库或请求模型。Linux DO 参考站未取得可核实动画源码，不能把其他桌宠代码归为其实现。
- 不在首页组件中使用全局 `.container`、`.content`、`*` 或 `.VPNavBarMenu` 覆盖。原 `.container { margin: 0 !important; padding: 0 !important; }` 曾同时破坏导航和项目页的大屏居中；构建后的首页 CSS 也可能影响直接访问其他页面。依赖 VitePress 原有容器居中规则，验证时包含真实首页组件及首页到项目页的 SPA 跳转。
- 普通文章/分类目录页以侧栏之外的可用内容区为居中基准，不能强行按整个视口平移正文。检查文章阅读模式退出和路由切换时的 body 类清理。
- 工具面板窄屏约束：JJencode 输入框限制最大宽度；cURL 编辑头用最小高度并允许换行，按钮文字不折行。图片分割的覆盖画布使用实际匹配的 `.preview-overlay`，空态隐藏预览，`ResizeObserver` 随图片尺寸同步网格并在卸载时断开，不能只在上传时计算一次。

## 文章写作约定

- 科技日报专栏（2026-10-20用户确认）：将WechatPilot的公众号内容分期同步到 `docs/tech-daily/YYYY-MM-DD.md`，索引为 `docs/tech-daily/index.md`，封面为 `docs/public/imgs/tech-daily/YYYY-MM-DD/cover.jpg`。001期始于2026-10-16，2026-10-26已补至011期；日期是各期消息窗口日期。博客可完整放官方公告、仓库、报道直链，并在文末列来源索引；公众号维持原有风格，不向其反向增加博客引流或来源索引。普通作者沿用本期公众号母稿；用户2026-10-21更名为SI斗罗，后续新稿使用新名，历史稿保留当时署名（见WechatPilot偏好记录）。frontmatter除既有SEO字段外写 `date / author / image / column / issue`。侧栏 `tech_daily_items` 按期号倒序，`/tech-daily/` 和 `blogNavTitles` 自动提供文章导航分类；顶部仍沿用原八个入口。后续同时更新本期页、索引摘要、侧栏；发布状态以 GitHub Pages 部署结果与线上核验为准，不能把 Git 提交或推送等同于线上生效。公众号来源与发布状态在相邻WechatPilot仓库的同日期 `articles/<日期>_tech-daily/` 和项目 Skill 的 `references/blog-column.md` 维护。
- 上述博客适配中，中文句末标点紧接后文时Markdown的 `**...**` 可能显示为裸星号；局部使用 `<strong>...</strong>`，定向渲染检查。不要为此更改全站Markdown规则或公众号母稿。
- 修改文章前核对 frontmatter 标题和页面用途，不能仅凭文件名定位。`docs/breakthrough-notes/resource-treasure-manual.md` 是《找资源宝典》的公开说明页，不设会员限制、不列入 `vipPosts`，套餐权益保留“查看说明”链接。正式正文是 `docs/breakthrough-notes/resource-treasure-guide.md`，保留 `memberOnly: true`；说明页、侧边栏与 VIP 文章列表均链接到它，资源条目应加在正式正文。
- 宝典原始数据在本机 SQL 备份的 `sd_blog` 表中：`id=103` / `bNExJ` 为公开说明，`id=104` / `xiYpj` 才是会员正文。`stardream-2024-10-19.sql` 与 `stardream-2025-05-12.sql` 的正式正文一致，2026-10-16 已按用户授权恢复并追加吾爱破解条目。旧 VIP 权益里的 `/blog/bNExJ` 本来也是说明入口，不能把它当作正文旧地址。仓库历史查不到文章时，应按用户授权继续检查原 SQL/迁移输入；备份文件名日期可能不反映内容更新时间，应核对记录时间及多份备份。
- 新文章放在对应目录的 Markdown 文件，frontmatter 写 `title`、`description`、`keywords`，并在 `config.mjs` 对应侧边栏数组登记；图片放 `docs/public/imgs/<目录>/<文章>/`。
- 软件教程截图用演示数据替换真实账号、订阅、余额等信息，不做大面积打码；文中注明“演示数据”。
- 截图标注统一风格：红色圆角框圈住目标，红底白字胶囊标签带白圈编号，红色箭头指向目标，正文按编号逐条说明；图片宽度 1200px。
- 服务端软件教程（如 Jenkins）用临时本地实例 + 演示任务截真实界面，Playwright 截图前把页面里的本机路径、系统用户名替换成通用值（如 `/var/jenkins_home`），完成后停掉实例并删除临时数据。本机 Docker Desktop 拉 Docker Hub 镜像曾卡住，可改用 shell 代理下载官方 war/二进制直接运行。
- 命令行 / 框架类教程（如 `docs/backend/go-zero.md`）没有界面可截：先在临时环境把演示项目真实跑通，命令输出按实际结果写；配图用 HTML 还原终端窗口、架构图，再用 Playwright 渲染成 1200px 宽 PNG，红色标注风格同上；文中写明所用版本。
- 视频改写的文章（首例：`docs/life/tesla-roadster-flying.md`，登记在 `life_ai_items`“AI 主题”）：配图用成片截帧，1280px 宽 JPG，放 `docs/public/imgs/life/<文章>/`；开头说明是视频文字版并嵌入 B 站视频，保留片中“示意重绘”“粗估”等标注。
- 嵌入 B 站视频用 `player.bilibili.com/player.html?bvid=...&autoplay=0` 的 iframe，外层 16:9 相对定位容器，并在下方附视频直链（首例：`docs/life/cc-switch-guide.md`）。
