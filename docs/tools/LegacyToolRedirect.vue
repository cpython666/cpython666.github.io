<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { redirectLegacyTool } from './legacyRedirect.mjs'

const { frontmatter } = useData()
onMounted(() => redirectLegacyTool(frontmatter.value.redirect))
</script>

<template>
  <p class="tool-redirect">工具网址已更新，<a :href="frontmatter.redirect">点击打开新页面</a>。</p>
</template>

<style scoped>
.tool-redirect { padding: 48px 24px; text-align: center; }
.tool-redirect a { color: var(--vp-c-brand-1); text-decoration: underline; }
</style>
