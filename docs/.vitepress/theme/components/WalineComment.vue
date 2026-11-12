<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { useCommentEnabled, walineServerURL } from '../comment.js'

const route = useRoute()
const enabled = useCommentEnabled()
const el = ref(null)
let waline
let initializing

// 开启 cleanUrls 前评论按 /xxx.html 存储，统一成这个格式，旧评论不丢
const commentPath = () => {
  const path = route.path
  return path.endsWith('/') || path.endsWith('.html') ? path : `${path}.html`
}

const mount = async () => {
  if (import.meta.env.SSR || !walineServerURL || !enabled.value) return
  await nextTick()
  if (!el.value) return
  if (waline) {
    waline.update({ path: commentPath() })
    return
  }
  if (initializing) return
  initializing = Promise.all([
    import('@waline/client'),
    import('@waline/client/style'),
  ]).then(([{ init }]) => {
    if (!el.value || !enabled.value) return
    waline = init({
      el: el.value,
      serverURL: walineServerURL,
      path: commentPath(),
      lang: 'zh-CN',
      dark: 'html.dark',
      reaction: false,
      pageview: false,
      comment: false,
    })
  }).catch(() => {
    // 评论服务加载失败不影响阅读。
  }).finally(() => {
    initializing = undefined
  })
}

const unmount = () => {
  waline?.destroy()
  waline = undefined
}

onMounted(mount)
watch(() => route.path, mount)
watch(enabled, (value) => {
  if (!value) unmount()
})
onBeforeUnmount(unmount)
</script>

<template>
  <section v-if="walineServerURL && enabled" class="waline-comment">
    <div ref="el" />
  </section>
</template>

<style scoped>
.waline-comment {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
  --waline-theme-color: var(--vp-c-brand-1);
  --waline-active-color: var(--vp-c-brand-2);
}
</style>
