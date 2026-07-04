---
title: "备份"
description: "备份我觉得值得长期保存的文章、帖子、图片和评论流。"
---

# 备份

这里用来保存我觉得值得长期留下来的内容。不同平台的数据结构不一样，所以备份会尽量保留原文、媒体、作者、时间、原始链接和评论流，方便以后迁移、检索和复盘。

## X / @wufantouzi

<script setup>
import XBackupList from '../components/XBackupList.vue'
import wufantouziArchive from '../public/backups/x/wufantouzi/index.json'
</script>

<XBackupList :archive="wufantouziArchive" />

::: tip 采集说明
运行 `node scripts/x-backup.mjs --handle wufantouzi` 会使用本地登录态采集 X 页面。首次运行可先执行 `node scripts/x-backup.mjs --handle wufantouzi --login-only` 登录。
:::
