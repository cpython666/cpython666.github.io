<script setup>
import { useRouter } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import copyText from '../utils/copy.js'
import { prompts } from './prompts.js'

const router = useRouter()
const promptQuery = ref('')
const activePromptCategory = ref('')
const promptCategories = [...new Set(prompts.map(prompt => prompt.category))]
const filteredPrompts = computed(() => {
  const search = promptQuery.value.trim().toLowerCase()
  return prompts.filter(prompt => (
    (!activePromptCategory.value || prompt.category === activePromptCategory.value)
    && `${prompt.title} ${prompt.text} ${prompt.category}`.toLowerCase().includes(search)
  ))
})
const resetPromptFilters = () => {
  promptQuery.value = ''
  activePromptCategory.value = ''
}
const videoTitle = ref('')
const promptText = (prompt) => prompt.text.replaceAll('{{视频标题}}', videoTitle.value || '{{视频标题}}')
const selectedPrompt = ref(null)
const promptDialog = ref(null)
const openPrompt = async (prompt) => {
  selectedPrompt.value = prompt
  await nextTick()
  promptDialog.value?.showModal()
}
const copyNotice = ref('')
let copyTimer

const copyWithNotice = async (text, success, failure) => {
  clearTimeout(copyTimer)
  copyNotice.value = ''
  try {
    await copyText(text)
    copyNotice.value = success
  } catch {
    copyNotice.value = failure
  } finally {
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copyNotice.value = '' }, 3000)
  }
}

const copyPrompt = (prompt) => copyWithNotice(promptText(prompt), '复制成功！', '复制失败，请选中提示词手动复制。')
const sharePrompt = (prompt) => copyWithNotice(
  `${prompt.title}\nhttps://cpython666.github.io/prompts/#prompt-${prompt.id}`,
  '分享链接已复制！',
  '分享链接复制失败，请重试。',
)

const linkedPrompt = ref('')
let locateFrame
let previousRouteHook
let routeHook

const syncPromptLocation = async () => {
  promptDialog.value?.close()
  cancelAnimationFrame(locateFrame)
  const hash = window.location.hash
  const prompt = prompts.find(item => hash === `#prompt-${item.id}`)
  linkedPrompt.value = prompt?.id || ''
  if (!prompt) return
  resetPromptFilters()
  await nextTick()
  locateFrame = requestAnimationFrame(() => {
    const card = document.getElementById(`prompt-${prompt.id}`)
    card?.scrollIntoView({ block: 'start', behavior: 'instant' })
    card?.focus({ preventScroll: true })
  })
}

const clearPromptLocation = () => {
  cancelAnimationFrame(locateFrame)
  linkedPrompt.value = ''
  const url = new URL(window.location.href)
  url.hash = ''
  window.history.replaceState(window.history.state, '', url)
}

const selectPromptCategory = async (category) => {
  activePromptCategory.value = category
  clearPromptLocation()
  await nextTick()
  document.getElementById(`prompt-${filteredPrompts.value[0]?.id}`)?.scrollIntoView({ block: 'start', behavior: 'instant' })
}

onMounted(() => {
  syncPromptLocation()
  window.addEventListener('hashchange', syncPromptLocation)
  previousRouteHook = router.onAfterRouteChange
  const previous = previousRouteHook ?? router.onAfterRouteChanged
  routeHook = async (href) => {
    await previous?.(href)
    await syncPromptLocation()
  }
  router.onAfterRouteChange = routeHook
})

onBeforeUnmount(() => {
  promptDialog.value?.close()
  clearTimeout(copyTimer)
  cancelAnimationFrame(locateFrame)
  window.removeEventListener('hashchange', syncPromptLocation)
  if (routeHook && router.onAfterRouteChange === routeHook) router.onAfterRouteChange = previousRouteHook
})

</script>

<template>
  <main class="prompts-page">
    <h1 class="page-title-sr">提示词</h1>
    <div class="toolbar prompt-toolbar">
      <p class="prompt-result-count" role="status" aria-live="polite">显示 {{ filteredPrompts.length }} / {{ prompts.length }} 条提示词</p>
      <label class="search-box prompt-search">
        <span>搜索</span>
        <input v-model="promptQuery" type="search" aria-label="搜索提示词" placeholder="标题、内容或分类" @input="clearPromptLocation" />
      </label>
    </div>
    <div class="prompt-filters" role="group" aria-label="提示词分类">
      <button type="button" :aria-pressed="!activePromptCategory" @click="selectPromptCategory('')">全部</button>
      <button
        v-for="category in promptCategories"
        :key="category"
        type="button"
        :aria-pressed="activePromptCategory === category"
        @click="selectPromptCategory(category)"
      >{{ category }}</button>
    </div>
    <div v-if="filteredPrompts.length" class="prompt-list">
      <article
        v-for="prompt in filteredPrompts"
        :id="`prompt-${prompt.id}`"
        :key="prompt.id"
        class="prompt-card"
        :class="{ 'is-linked': linkedPrompt === prompt.id }"
        tabindex="-1"
        :aria-labelledby="`prompt-title-${prompt.id}`"
      >
        <div class="prompt-heading">
          <h3 :id="`prompt-title-${prompt.id}`">{{ prompt.title }}</h3>
          <div class="prompt-actions">
            <button
              class="copy-prompt"
              type="button"
              :aria-label="`复制提示词：${prompt.title}`"
              title="复制完整提示词"
              @click="copyPrompt(prompt)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <button
              class="copy-prompt"
              type="button"
              :aria-label="`分享提示词：${prompt.title}`"
              title="复制标题和分享链接"
              @click="sharePrompt(prompt)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2"/></svg>
            </button>
          </div>
        </div>
        <div class="prompt-meta">
          <span>{{ prompt.category }}</span>
          <span v-if="prompt.preview" class="preview-status" :data-status="prompt.previewStatus" :title="prompt.previewNote">{{ prompt.previewStatus }}</span>
          <span>{{ promptText(prompt).length }} 字</span>
          <span v-if="prompt.text.includes('{{视频标题}}')">可填写标题</span>
        </div>
        <p class="prompt-text">{{ promptText(prompt) }}</p>
        <button class="view-prompt" type="button" :aria-label="`查看完整提示词：${prompt.title}`" @click="openPrompt(prompt)">
          {{ prompt.preview ? '查看提示词与作品' : '查看完整内容' }} <span aria-hidden="true">↗</span>
        </button>
      </article>
    </div>
    <div v-else class="empty-state">
      <h3>没有匹配的提示词</h3>
      <p>换个关键词，或重置分类和搜索。</p>
      <button class="reset-prompt-filters" type="button" @click="resetPromptFilters">重置筛选</button>
    </div>
    <dialog
      ref="promptDialog"
      class="prompt-dialog"
      aria-labelledby="prompt-dialog-title"
      @close="selectedPrompt = null"
      @click.self="promptDialog.close()"
    >
      <template v-if="selectedPrompt">
        <header class="prompt-dialog-header">
          <div>
            <p class="eyebrow">完整提示词</p>
            <h2 id="prompt-dialog-title">{{ selectedPrompt.title }}</h2>
          </div>
          <button class="close-prompt" type="button" aria-label="关闭完整提示词" @click="promptDialog.close()">×</button>
        </header>
        <div class="prompt-dialog-actions">
          <button class="copy-prompt" type="button" :aria-label="`复制提示词：${selectedPrompt.title}`" @click="copyPrompt(selectedPrompt)">复制全文</button>
          <button class="copy-prompt" type="button" :aria-label="`分享提示词：${selectedPrompt.title}`" @click="sharePrompt(selectedPrompt)">分享</button>
          <span>{{ promptText(selectedPrompt).length }} 字</span>
        </div>
        <div class="prompt-dialog-body">
          <label v-if="selectedPrompt.text.includes('{{视频标题}}')" class="prompt-variable">
            视频标题
            <input v-model="videoTitle" type="text" placeholder="输入视频标题" />
          </label>
          <p class="prompt-full-text">{{ promptText(selectedPrompt) }}</p>
          <figure v-if="selectedPrompt.preview" class="prompt-preview">
            <img :src="selectedPrompt.preview" :alt="`${selectedPrompt.title}的 SVG 作品`" />
            <figcaption>
              <span>SVG 作品</span>
              <span class="preview-status" :data-status="selectedPrompt.previewStatus">{{ selectedPrompt.previewStatus }}</span>
              <a :href="selectedPrompt.preview" download>下载 SVG</a>
            </figcaption>
            <p v-if="selectedPrompt.previewNote" class="preview-note">蹬车检查：{{ selectedPrompt.previewNote }}</p>
          </figure>
        </div>
        <div role="status" aria-live="polite">
          <p v-if="copyNotice" class="copy-toast">{{ copyNotice }}</p>
        </div>
      </template>
    </dialog>
    <div v-if="!selectedPrompt" role="status" aria-live="polite">
      <p v-if="copyNotice" class="copy-toast">{{ copyNotice }}</p>
    </div>
  </main>
</template>

<style scoped>
.prompts-page {
  --prompt-sticky-top: var(--vp-nav-height, 64px);
  width: min(1180px, calc(100% - 32px));
  margin: 16px auto 40px;
}
.prompts-page p { text-indent: 0; }
.prompt-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 6px; }
.eyebrow { margin: 0 0 8px; color: var(--vp-c-brand-1); font-size: 13px; font-weight: 700; }
.page-title-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.prompt-filters button:focus-visible,
.reset-prompt-filters:focus-visible,
.prompt-variable input:focus-visible,
.copy-prompt:focus-visible,
.view-prompt:focus-visible,
.close-prompt:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.prompt-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 20px;
}

.prompt-filters {
  position: sticky;
  top: var(--prompt-sticky-top);
  z-index: 20;
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding: 10px 2px;
  overflow-x: auto;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  scrollbar-width: thin;
}

.prompt-filters button {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}

.prompt-filters button:hover,
.prompt-filters button[aria-pressed='true'] {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.prompt-result-count {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.reset-prompt-filters {
  margin-top: 16px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

.prompt-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  scroll-margin-top: calc(var(--prompt-sticky-top) + 80px);
}

.prompt-card:hover {
  border-color: var(--vp-c-brand-2);
}

.prompt-card.is-linked {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.prompt-card h3 {
  min-width: 0;
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
}

.prompt-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  width: 100%;
  min-height: 52px;
}

.prompt-actions {
  display: flex;
  gap: 6px;
}

.prompt-actions .copy-prompt {
  display: grid;
  place-items: center;
  width: 34px;
  min-height: 34px;
  padding: 7px;
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.prompt-actions .copy-prompt:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.prompt-actions svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.prompt-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin: 8px 0 14px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.prompt-variable {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.prompt-variable input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  margin-top: 6px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.prompt-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  width: 100%;
  height: 7.2em;
  margin: 0 0 20px;
  font-size: 14px;
}

.prompt-text,
.prompt-full-text {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  user-select: text;
}

.view-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.view-prompt:hover {
  color: var(--vp-c-brand-2);
}

.view-prompt span {
  font-size: 20px;
}

.prompt-dialog {
  width: min(760px, calc(100% - 32px));
  max-height: calc(100dvh - 48px);
  margin: auto;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-3);
  overflow: hidden;
}

.prompt-dialog[open] {
  display: flex;
  flex-direction: column;
}

.prompt-dialog::backdrop {
  background: rgb(0 0 0 / 55%);
}

:global(html:has(.prompt-dialog[open])) {
  overflow: hidden;
}

.prompt-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 16px;
}

.prompt-dialog-header h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
}

.close-prompt {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 26px;
  cursor: pointer;
}

.close-prompt:hover {
  color: var(--vp-c-text-1);
}

.prompt-dialog-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 24px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.prompt-dialog-actions span {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.prompt-dialog-body {
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.prompt-full-text {
  margin: 0;
  font-size: 15px;
}

.prompt-preview { margin: 24px 0 0; }
.prompt-preview img {
  display: block;
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  border-radius: 12px;
}
.prompt-preview figcaption {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.prompt-preview a { margin-left: auto; color: var(--vp-c-brand-1); }
.preview-note { margin: 10px 0 0; color: var(--vp-c-text-2); font-size: 13px; }
.preview-status {
  padding: 0 8px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.preview-status[data-status='正常'] { color: var(--vp-c-green-1); background: var(--vp-c-green-soft); }
.preview-status[data-status='降智'] { color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }

.copy-prompt {
  flex-shrink: 0;
  min-height: 40px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-brand-2);
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.copy-prompt:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.copy-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  z-index: 200;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100vw - 32px);
  margin: 0;
  padding: 12px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-2);
  font-size: 14px;
  pointer-events: none;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(360px, 100%);
  min-width: 260px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.search-box span {
  flex: 0 0 auto;
  white-space: nowrap;
}

.search-box input {
  flex: 1 1 0;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
}

.prompt-search {
  min-width: 0;
}

.prompt-search:focus-within {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid var(--vp-c-brand-soft);
}

.empty-state {
  padding: 36px 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.empty-state p {
  margin: 0;
}


@media (max-width: 959px) {
  .prompts-page { --prompt-sticky-top: 0px; }
}
@media (max-width: 860px) {
  .prompts-page { width: calc(100% - 24px); }
}
@media (max-width: 600px) {
  .prompt-toolbar { flex-wrap: wrap; gap: 8px; }
  .prompt-search { width: 100%; order: -1; }
}
</style>
