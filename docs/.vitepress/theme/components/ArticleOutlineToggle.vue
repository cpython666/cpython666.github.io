<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'article-reading-outline-visible'

const mounted = ref(false)
const outlineVisible = ref(true)

const applyOutlineState = () => {
  if (typeof document === 'undefined') return
  document.body.classList.toggle('article-reading-outline-hidden', !outlineVisible.value)
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
  saveOutlineState()
}

onMounted(() => {
  readOutlineState()
  applyOutlineState()
  mounted.value = true
})

onBeforeUnmount(() => {
  document.body.classList.remove('article-reading-outline-hidden')
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
      <svg v-if="outlineVisible" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.75" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 3 18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.2 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a9 9 0 0 0 3-.5M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </svg>
    </button>
  </div>
</template>

<style>
.article-outline-toggle {
  display: none;
}

@media (min-width: 960px) {
  .VPDoc .aside-container {
    overflow-x: clip;
  }

  .VPDoc .aside-content {
    position: relative;
    min-width: 0;
  }

  .article-outline-toggle {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 40;
    display: block;
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

  .article-outline-toggle__button svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .article-outline-toggle__button:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
  }

  .VPDocAsideOutline .content {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-right: 32px;
    transition:
      border-color 0.2s ease,
      opacity 0.2s ease;
  }

  .VPDocAsideOutline .VPDocOutlineItem,
  .VPDocAsideOutline .outline-link {
    box-sizing: border-box;
    max-width: 100%;
    min-width: 0;
  }

  .VPDocAsideOutline .content::after {
    pointer-events: none;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content {
    border-left-color: transparent;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .outline-title,
  body.article-reading-outline-hidden .VPDocAsideOutline .outline-link {
    position: relative;
    color: transparent !important;
    pointer-events: none;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .outline-title::after,
  body.article-reading-outline-hidden .VPDocAsideOutline .outline-link::after {
    position: absolute;
    top: 50%;
    left: 0;
    width: 48px;
    height: 3px;
    content: '';
    background: color-mix(in srgb, var(--vp-c-text-3) 35%, transparent);
    border-radius: 999px;
    transform: translateY(-50%);
    transition: opacity 0.18s ease;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline li:nth-child(3n + 1) > .outline-link::after {
    width: 32px;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline li:nth-child(3n + 2) > .outline-link::after {
    width: 40px;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .outline-marker {
    opacity: 0.9 !important;
    background: var(--vp-c-text-1);
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover {
    border-left-color: var(--vp-c-divider);
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-title {
    color: var(--vp-c-text-1) !important;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-link {
    color: var(--vp-c-text-2) !important;
    pointer-events: auto;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-link.active {
    color: var(--vp-c-text-1) !important;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-title::after,
  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-link::after {
    opacity: 0;
  }

  body.article-reading-outline-hidden .VPDocAsideOutline .content:hover .outline-marker {
    background: var(--vp-c-brand-1);
  }
}

@media print {
  .article-outline-toggle {
    display: none;
  }
}
</style>
