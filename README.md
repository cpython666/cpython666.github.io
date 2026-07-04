# StarDream-VitePress
星梦启航，Python斗罗的博客

## X 备份采集

备份 X 博主帖子到博客的命令：

```bash
npm run backup:x -- --handle wufantouzi
```

首次使用时，先打开脚本专用 Chrome 登录 X：

```bash
npm run backup:x -- --handle wufantouzi --login-only
```

常用命令：

```bash
# 只采集单条帖子，适合测试
npm run backup:x -- --handle wufantouzi --post https://x.com/wufantouzi/status/1975171860573655100

# 限制从主页发现并采集的帖子数量
npm run backup:x -- --handle wufantouzi --profile-max-posts 40

# 只保存文本和远程图片地址，不下载图片
npm run backup:x -- --handle wufantouzi --skip-media

# 自定义评论屏蔽词，用英文逗号分隔
npm run backup:x -- --handle wufantouzi --comment-blocklist 固炮,炮友,破处

# 不重新采集，只根据 index.json 重新生成 Markdown
npm run backup:x -- --handle wufantouzi --render-md-only

# 清空该账号归档并保留空 index.json，适合重新备份前使用
npm run backup:x -- --handle wufantouzi --reset
```

说明：

- 输出目录：`docs/public/backups/x/<handle>/`
- 展示页面：`/backup/`
- 预览页面先读取轻量 `index.json`，再按需加载 `posts/<post-id>.json` 详情，避免几千条帖子都塞进一个大 JSON。
- Markdown 是附加导出文件，删除 `.md` 不会影响页面展示。
- 目前只备份正文、图片和可见评论流，不备份视频。
- 脚本会增量采集，已存在且不是翻译态的帖子不会重复进入详情页。
- 如果 X 因 IP 或语言设置展示英文翻译，脚本会尝试点击 `Show original` / `显示原文`，最终只保存中文原文。
- 默认会过滤明显机器人评论，匹配评论人昵称、handle 和正文里的屏蔽词，例如 `固炮`、`炮友`、`破处`。

如果对你有启发，可以请我喝杯咖啡

<div style="display: flex; justify-content: space-around;">
  <img src="./docs/public/support/wx.jpg" alt="图片1" width="200">
  <img src="./docs/public/support/zfb.jpg" alt="图片2" width="200">
</div>
