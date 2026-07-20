<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'article-reading-outline-visible'
const PREVIEW_CLASS = 'article-reading-outline-preview'

const mounted = ref(false)
const outlineVisible = ref(true)

const removeOutlinePreview = () => {
  if (typeof document === 'undefined') return
  document.body.classList.remove(PREVIEW_CLASS)
}

const applyOutlineState = () => {
  if (typeof document === 'undefined') return
  document.body.classList.toggle('article-reading-outline-hidden', !outlineVisible.value)
  if (outlineVisible.value) removeOutlinePreview()
}

const readOutlineState = () => {
  if (typeof window === 'undefined') return

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    outlineVisible.value = saved === null ? true : saved === '1'
  } catch {
    outlineVisible.value = true
  }
}

const saveOutlineState = () => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, outlineVisible.value ? '1' : '0')
  } catch {
    // localStorage 不可用时只保留本次页面状态
  }
}

const toggleOutline = () => {
  outlineVisible.value = !outlineVisible.value
  removeOutlinePreview()
  saveOutlineState()
}

const showOutlinePreview = () => {
  if (outlineVisible.value) return
  document.body.classList.add(PREVIEW_CLASS)
}

onMounted(() => {
  readOutlineState()
  applyOutlineState()
  mounted.value = true
})

onBeforeUnmount(() => {
  document.body.classList.remove('article-reading-outline-hidden')
  removeOutlinePreview()
})

watch(outlineVisible, applyOutlineState)
</script>

<template>
  <div v-show="mounted" class="article-outline-toggle">
    <button
      class="article-outline-toggle__button"
      type="button"
      :title="outlineVisible ? '隐藏目录' : '显示目录'"
      :aria-label="outlineVisible ? '隐藏文章目录' : '显示文章目录'"
      :aria-pressed="outlineVisible"
      @pointerdown.stop
      @click.stop.prevent="toggleOutline"
    >
      {{ outlineVisible ? 'o' : 'x' }}
    </button>
    <div
      class="article-outline-preview-zone"
      aria-hidden="true"
      @pointerenter="showOutlinePreview"
      @pointerleave="removeOutlinePreview"
    />
  </div>
</template>

<style>
.article-outline-toggle {
  display: none;
}

@media (min-width: 960px) {
  .VPDoc .aside-content {
    position: relative;
  }

  .article-outline-toggle {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 40;
    display: block;
    pointer-events: auto;
  }

  .article-outline-preview-zone {
    display: none;
  }

  body.article-reading-outline-hidden .article-outline-preview-zone {
    position: absolute;
    top: 34px;
    right: 0;
    z-index: 2;
    display: block;
    width: 112px;
    height: 330px;
    cursor: default;
    pointer-events: auto;
  }

  .article-outline-toggle__button {
    position: relative;
    z-index: 41;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    color: var(--vp-c-text-3);
    cursor: pointer;
    background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
    border: 1px solid transparent;
    border-radius: 999px;
    backdrop-filter: blur(8px);
    pointer-events: auto;
    -webkit-tap-highlight-color: transparent;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .article-outline-toggle__button:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-divider);
    transform: translateY(-1px);
  }

  .article-outline-toggle__button:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
  }

  .VPDocAsideOutline .content {
    padding-right: 32px;
    transition:
      border-color 0.2s ease,
      opacity 0.2s ease;
  }

  .VPDocAsideOutline .content::after {
    pointer-events: none;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content {
    min-height: 340px;
    border-left-color: transparent;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .outline-marker,
  body.article-reading-outline-hidden .VPDocAsideOutline .outline-title,
  body.article-reading-outline-hidden .VPDocAsideOutline nav {
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transition:
      visibility 0.18s ease,
      opacity 0.18s ease;
  }

  body.article-reading-outline-hidden.article-reading-outline-preview .VPDocAsideOutline .content {
    border-left-color: var(--vp-c-divider);
  }

  body.article-reading-outline-hidden.article-reading-outline-preview .VPDocAsideOutline .outline-marker,
  body.article-reading-outline-hidden.article-reading-outline-preview .VPDocAsideOutline .outline-title,
  body.article-reading-outline-hidden.article-reading-outline-preview .VPDocAsideOutline nav {
    pointer-events: auto;
    visibility: visible;
    opacity: 1;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content::after {
    position: absolute;
    top: 44px;
    right: 4px;
    width: 52px;
    height: 280px;
    content: '';
    opacity: 0.72;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 30px,
      color-mix(in srgb, var(--vp-c-text-3) 32%, transparent) 30px,
      color-mix(in srgb, var(--vp-c-text-3) 32%, transparent) 33px,
      transparent 33px,
      transparent 58px
    );
    border-radius: 999px;
    transition: opacity 0.18s ease;
  }

  body.article-reading-outline-hidden.article-reading-outline-preview .VPDocAsideOutline .content::after {
    opacity: 0;
  }
}

@media print {
  .article-outline-toggle {
    display: none;
  }
}
</style>
