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
| 首页展示与打字效果 | `docs/index/IndexPage.vue` | Typed 与 resize 监听需随组件卸载清理 |
| 文章工具、目录开关、阅读量 | `docs/.vitepress/theme/components/` | 优先复用现有组件 |
| 复制文本 | `docs/utils/copy.js` | 提示词等调用此工具，调用方处理成功/失败反馈 |
| 资源导航 | `docs/nav/NavPage.vue`、`docs/nav/data.js` | 与文章导航是两个不同页面 |
| 项目和工具 | `docs/projects/ProjectPage.vue`、`docs/spider-tools/SpiderTools.vue` | 页面已有独立组件 |
| 全局特效和样式 | `docs/public/js/`、`docs/public/css/index.css` | 脚本由站点 head 引入 |
| 发布流程 | `.github/workflows/static.yml` | 构建产物目录为 `docs/.vitepress/dist` |

## 配置关系

- 文章导航遍历 `theme.sidebar`，结合 `blogNavInclude`、`blogNavExclude` 和 `blogNavTitles` 生成分组与标题；不要再维护第二份文章目录。
- 站内搜索采用 VitePress local search，中文分词逻辑在配置内。
- SEO 已有 canonical、description、Open Graph、Twitter 卡片、JSON-LD 与 sitemap 生成逻辑；按缺陷修订，不重复接入一套方案。
- `themeConfig.lastUpdated` 在当前 VitePress 版本仍有兼容处理，不能仅凭位置断言更新时间失效。

## 文章写作约定

- 新文章放在对应目录的 Markdown 文件，frontmatter 写 `title`、`description`、`keywords`，并在 `config.mjs` 对应侧边栏数组登记；图片放 `docs/public/imgs/<目录>/<文章>/`。
- 软件教程截图用演示数据替换真实账号、订阅、余额等信息，不做大面积打码；文中注明“演示数据”。
- 嵌入 B 站视频用 `player.bilibili.com/player.html?bvid=...&autoplay=0` 的 iframe，外层 16:9 相对定位容器，并在下方附视频直链（首例：`docs/life/cc-switch-guide.md`）。
