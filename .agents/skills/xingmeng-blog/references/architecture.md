# 架构与入口

本文件中的源码路径均相对仓库根目录。

## 项目事实

- 站点名称：星梦启航；正式地址：`https://cpython666.github.io`。
- 基础栈：VitePress 1.6 系列、Vue 单文件组件、npm；依赖版本以 `package.json` 和锁文件为准。
- 默认主题扩展位于 `docs/.vitepress/theme/`，没有独立业务后端。
- GitHub Pages 工作流在 `master` 推送或手动触发后安装依赖、构建并部署；流程定义不等于 AI 获得执行全站构建或推送的授权。

## 代码地图

| 任务 | 源码入口 | 约束或关系 |
| --- | --- | --- |
| 站点、顶部导航、侧边栏、SEO、搜索 | `docs/.vitepress/config.mjs` | 导航目录来自配置，已有侧边栏目标路径存在性检查 |
| 文章导航与提示词 | `docs/navigation/NavIndex.vue` | `/navigation/` 内通过文章 / 提示词 Tab 区分 |
| 导航会员标记数据 | `docs/navigation/member.data.mjs` | 使用全站内容加载器，AI 不直接执行；隔离测试替换为人工 fixture |
| 主题插槽、评论、图片查看、会员遮罩、Live2D | `docs/.vitepress/theme/index.js` | 按本次功能限定修改范围 |
| 评论（giscus + Waline 并存） | `docs/.vitepress/theme/comment.js`、`components/WalineComment.vue` | 两者共用 `useCommentEnabled` 显示规则；Waline 在 `doc-after` 插槽、位于 giscus 之上，服务端 `https://cpython666-waline.vercel.app`（Vercel + Neon，图片默认 base64 存库），`walineServerURL` 留空时不渲染；`@waline/client` 锁在 3.13（3.14 起要求 Node 22，CI 仍是 Node 20） |
| 首页展示与打字效果 | `docs/index.md`、`docs/index/IndexPage.vue` | 首页设 `markdownStyles: false` 保留全宽展示；组件样式必须 scoped，旋转背景在首页容器内裁切；Typed 与 resize 监听需随组件卸载清理 |
| 文章工具、目录开关、阅读量 | `docs/.vitepress/theme/components/` | 优先复用现有组件 |
| 复制文本 | `docs/utils/copy.js` | 提示词等调用此工具，调用方处理成功/失败反馈 |
| 资源导航 | `docs/nav/NavPage.vue`、`docs/nav/WebLink.vue`、`docs/nav/data.js` | 与文章导航是两个不同页面；`navigationData` 按 `title` / `items` 分组，“AI模型检测”收录 ModelTrace；NavPage 负责搜索、分类和分批展示，WebLink 接收筛选后的 `items` 渲染卡片；顶部采用紧凑布局，桌面左侧标题/统计/简介、右侧搜索等宽，760px 及以下改为上下排列 |
| 项目和工具 | `docs/projects/ProjectPage.vue`、`docs/spider-tools/SpiderTools.vue` | 项目封面使用独立 16:9 容器与 `object-fit: contain`，完整保留不同比例原图；不要恢复 `cover` 裁切或让图片百分比高度撑高网格 |
| 备份展示与会员介绍 | `docs/components/XBackupList.vue`、`docs/vip/index.md` | 备份统计栏在手机端取消 260px 最小宽度，三列允许收缩；会员介绍表格允许长链接任意位置换行 |
| 全局特效和样式 | `docs/public/js/`、`docs/public/css/index.css` | 脚本由站点 head 引入 |
| 发布流程 | `.github/workflows/static.yml` | 构建产物目录为 `docs/.vitepress/dist` |

## 配置关系

- 文章导航遍历 `theme.sidebar`，结合 `blogNavInclude`、`blogNavExclude` 和 `blogNavTitles` 生成分组与标题；不要再维护第二份文章目录。
- 站内搜索采用 VitePress local search，中文分词逻辑在配置内。
- SEO 已有 canonical、description、Open Graph、Twitter 卡片、JSON-LD 与 sitemap 生成逻辑；按缺陷修订，不重复接入一套方案。
- `themeConfig.lastUpdated` 在当前 VitePress 版本仍有兼容处理，不能仅凭位置断言更新时间失效。
- 项目页五个教程合集（DrissionPage、Pygame、Django、Scrapy、PyQt6）的独立封面位于 `docs/public/imgs/app/<小写技术名>-tutorial.webp`，由 `docs/projects/data.js` 引用；统一为 1280×720（16:9）WebP，约 46–66 KiB，使用深色等距插画、英文技术名与中文主题。更换封面时保持图片比例，并检查“合集”筛选下五张图片实际加载及手机端标题完整性。
- 资源导航广告图、项目精选/卡片封面和图片分割预览使用 `no-zoom`；否则主题会将其加入 PhotoSwipe，并受到 `.vp-doc img.is-zoomable` 的 520px 最大宽度及上下 16px 外边距影响，外链点击也会被图片查看器拦截。
- 不在首页组件中使用全局 `.container`、`.content`、`*` 或 `.VPNavBarMenu` 覆盖。原 `.container { margin: 0 !important; padding: 0 !important; }` 曾同时破坏导航和项目页的大屏居中；构建后的首页 CSS 也可能影响直接访问其他页面。依赖 VitePress 原有容器居中规则，验证时包含真实首页组件及首页到项目页的 SPA 跳转。
- 普通文章/分类目录页以侧栏之外的可用内容区为居中基准，不能强行按整个视口平移正文。检查文章阅读模式退出和路由切换时的 body 类清理。
- 工具面板窄屏约束：JJencode 输入框限制最大宽度；cURL 编辑头用最小高度并允许换行，按钮文字不折行。图片分割的覆盖画布使用实际匹配的 `.preview-overlay`，空态隐藏预览，`ResizeObserver` 随图片尺寸同步网格并在卸载时断开，不能只在上传时计算一次。

## 文章写作约定

- 修改文章前核对 frontmatter 标题和页面用途，不能仅凭文件名定位。`docs/breakthrough-notes/resource-treasure-manual.md` 是《找资源宝典》的公开说明页，不设会员限制、不列入 `vipPosts`，套餐权益保留“查看说明”链接。正式正文是 `docs/breakthrough-notes/resource-treasure-guide.md`，保留 `memberOnly: true`；说明页、侧边栏与 VIP 文章列表均链接到它，资源条目应加在正式正文。
- 宝典原始数据在本机 SQL 备份的 `sd_blog` 表中：`id=103` / `bNExJ` 为公开说明，`id=104` / `xiYpj` 才是会员正文。`stardream-2024-10-19.sql` 与 `stardream-2025-05-12.sql` 的正式正文一致，2026-10-16 已按用户授权恢复并追加吾爱破解条目。旧 VIP 权益里的 `/blog/bNExJ` 本来也是说明入口，不能把它当作正文旧地址。仓库历史查不到文章时，应按用户授权继续检查原 SQL/迁移输入；备份文件名日期可能不反映内容更新时间，应核对记录时间及多份备份。
- 新文章放在对应目录的 Markdown 文件，frontmatter 写 `title`、`description`、`keywords`，并在 `config.mjs` 对应侧边栏数组登记；图片放 `docs/public/imgs/<目录>/<文章>/`。
- 软件教程截图用演示数据替换真实账号、订阅、余额等信息，不做大面积打码；文中注明“演示数据”。
- 截图标注统一风格：红色圆角框圈住目标，红底白字胶囊标签带白圈编号，红色箭头指向目标，正文按编号逐条说明；图片宽度 1200px。
- 服务端软件教程（如 Jenkins）用临时本地实例 + 演示任务截真实界面，Playwright 截图前把页面里的本机路径、系统用户名替换成通用值（如 `/var/jenkins_home`），完成后停掉实例并删除临时数据。本机 Docker Desktop 拉 Docker Hub 镜像曾卡住，可改用 shell 代理下载官方 war/二进制直接运行。
- 命令行 / 框架类教程（如 `docs/backend/go-zero.md`）没有界面可截：先在临时环境把演示项目真实跑通，命令输出按实际结果写；配图用 HTML 还原终端窗口、架构图，再用 Playwright 渲染成 1200px 宽 PNG，红色标注风格同上；文中写明所用版本。
- 嵌入 B 站视频用 `player.bilibili.com/player.html?bvid=...&autoplay=0` 的 iframe，外层 16:9 相对定位容器，并在下方附视频直链（首例：`docs/life/cc-switch-guide.md`）。
