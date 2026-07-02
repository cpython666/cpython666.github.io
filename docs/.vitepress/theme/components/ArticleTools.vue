<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowUp, CloseBold, FullScreen, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useData, useRoute } from 'vitepress'

const { frontmatter, page } = useData()
const route = useRoute()

const readingMode = ref(false)
const canScrollTop = ref(false)

const hiddenPrefixes = [
  '/nav/',
  '/navigation/',
  '/projects/',
  '/spider-tools/',
  '/vip/',
  '/web-intro/',
  '/index/',
]

const isArticlePage = computed(() => {
  const path = route.path
  return path !== '/'
    && !page.value.isNotFound
    && frontmatter.value.layout !== 'home'
    && frontmatter.value.articleTools !== false
    && !hiddenPrefixes.some((prefix) => path.startsWith(prefix))
})

const setReadingMode = (enabled) => {
  readingMode.value = enabled
  document.body.classList.toggle('article-reading-mode', enabled)
}

const toggleReadingMode = () => {
  setReadingMode(!readingMode.value)
}

const updateScrollState = () => {
  canScrollTop.value = window.scrollY > 320
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

const copyShareText = async () => {
  const url = new URL(window.location.href)
  url.hash = ''
  const text = `${page.value.title}\n${url.toString()}`

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else if (!fallbackCopy(text)) {
      throw new Error('copy failed')
    }
    ElMessage.success('文章标题和链接已复制')
  } catch {
    ElMessage.error('复制失败，请手动复制地址栏链接')
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && readingMode.value) {
    setReadingMode(false)
  }
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('article-reading-mode')
})

watch(
  () => route.path,
  () => setReadingMode(false),
)

watch(isArticlePage, (visible) => {
  if (!visible && readingMode.value) setReadingMode(false)
})
</script>

<template>
  <nav v-if="isArticlePage" class="article-tools" aria-label="文章阅读工具">
    <el-tooltip content="回到顶部" placement="left">
      <button
        class="article-tool-button"
        type="button"
        aria-label="回到顶部"
        :disabled="!canScrollTop"
        @click="scrollToTop"
      >
        <el-icon :size="19"><ArrowUp /></el-icon>
      </button>
    </el-tooltip>

    <el-tooltip :content="readingMode ? '退出沉浸式阅读' : '沉浸式阅读'" placement="left">
      <button
        class="article-tool-button article-tool-button--reading"
        :class="{ 'is-active': readingMode }"
        type="button"
        :aria-label="readingMode ? '退出沉浸式阅读' : '沉浸式阅读'"
        :aria-pressed="readingMode"
        @click="toggleReadingMode"
      >
        <el-icon :size="18">
          <CloseBold v-if="readingMode" />
          <FullScreen v-else />
        </el-icon>
      </button>
    </el-tooltip>

    <el-tooltip content="复制文章标题和链接" placement="left">
      <button
        class="article-tool-button"
        type="button"
        aria-label="复制文章标题和链接"
        @click="copyShareText"
      >
        <el-icon :size="18"><Share /></el-icon>
      </button>
    </el-tooltip>
  </nav>
</template>

<style>
.article-tools {
  position: fixed;
  top: auto;
  right: 20px;
  bottom: 24px;
  left: auto;
  z-index: 30;
  display: flex;
  width: 42px;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.article-tool-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  box-shadow: var(--vp-shadow-2);
  backdrop-filter: blur(10px);
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.article-tool-button:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.article-tool-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.article-tool-button:disabled {
  cursor: default;
  opacity: 0.38;
}

.article-tool-button.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

@media (min-width: 960px) {
  .VPSidebar,
  .VPContent.has-sidebar {
    transition:
      padding-left 0.22s ease,
      transform 0.22s ease,
      opacity 0.22s ease;
  }

  body.article-reading-mode .VPSidebar {
    pointer-events: none;
    opacity: 0;
    transform: translateX(-100%);
  }

  body.article-reading-mode .VPContent.has-sidebar {
    padding-left: 0 !important;
  }

  body.article-reading-mode .VPDoc .aside {
    display: none;
  }

  body.article-reading-mode .VPDoc .content {
    margin-right: auto;
    margin-left: auto;
  }
}

@media (max-width: 959px) {
  .article-tools {
    right: 12px;
    bottom: 16px;
    width: 40px;
  }

  .article-tool-button {
    width: 40px;
    height: 40px;
  }

  .article-tool-button--reading {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-tool-button,
  .VPSidebar,
  .VPContent.has-sidebar {
    transition: none;
  }
}

@media print {
  .article-tools {
    display: none;
  }
}
</style>
