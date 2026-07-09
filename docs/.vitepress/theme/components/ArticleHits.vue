<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter, page } = useData()
const route = useRoute()

const noHitsPrefixes = [
  '/草稿箱/',
  '/视频待办列表/',
]
const hitsLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAxNCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGNjZTVhIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMS41IDdzMi4zLTMuOCA2LTMuOCA2IDMuOCA2IDMuOC0yLjMgMy44LTYgMy44LTYtMy44LTYtMy44WiIvPjxjaXJjbGUgY3g9IjcuNSIgY3k9IjciIHI9IjEuNyIvPjwvZz48cmVjdCB4PSIxNiIgeT0iOCIgd2lkdGg9IjMiIGhlaWdodD0iNCIgZmlsbD0iIzRjY2U1YSIvPjxyZWN0IHg9IjIxIiB5PSI1IiB3aWR0aD0iMyIgaGVpZ2h0PSI3IiBmaWxsPSIjNGNjZTVhIi8+PHJlY3QgeD0iMjYiIHk9IjIiIHdpZHRoPSIzIiBoZWlnaHQ9IjEwIiBmaWxsPSIjNGNjZTVhIi8+PC9zdmc+'

const showHits = computed(() => {
  const path = route.path
  return path !== '/'
    && !page.value.isNotFound
    && frontmatter.value.hits !== false
    && !noHitsPrefixes.some((prefix) => path.startsWith(prefix))
})

const hitsUrl = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  const params = new URLSearchParams({
    view: 'today-total',
    label: 'today / total',
    color: '4cce5a',
    logo: hitsLogo,
  })
  return `https://hits.sh/cpython666.github.io${encodeURI(path)}.svg?${params}`
})

const syncHomeFooterHits = () => {
  if (import.meta.env.SSR) return
  nextTick(() => {
    const wrap = document.querySelector('[data-home-hits-wrap]')
    const img = document.querySelector('[data-home-hits]')
    if (!wrap || !img) return
    if (route.path === '/') {
      wrap.style.display = 'inline-flex'
      img.src = img.dataset.src
    } else {
      wrap.style.display = 'none'
      img.removeAttribute('src')
    }
  })
}

onMounted(syncHomeFooterHits)
watch(() => route.path, syncHomeFooterHits)
</script>

<template>
  <p v-if="showHits" class="article-hits">
    <img :src="hitsUrl" alt="今日和总访问量" loading="lazy">
  </p>
</template>

<style scoped>
.article-hits {
  display: flex;
  align-items: center;
  min-height: 20px;
  margin: 0 0 18px;
}

.article-hits img {
  width: auto;
  height: 20px;
}
</style>
