<template>
  <div class="tools-page">
    <h1 class="sr-only">{{ toolId ? activeTool.name : '在线开发工具箱' }}</h1>

    <div class="tools-layout">
      <aside class="navbar">
        <a class="nav-label" href="/spider-tools/">全部工具</a>
        <input
          v-model="q"
          class="search"
          type="text"
          placeholder="搜索工具"
          aria-label="搜索工具"
        />
        <ul v-if="visibleTools.length" class="nav-list">
          <li
            v-for="item in visibleTools"
            :key="item.pageId"
            :class="{ active: curPageId === item.pageId }"
          >
            <a :href="toolPath(item.pageId)" :aria-current="curPageId === item.pageId ? 'page' : undefined">
              <span class="tool-icon">{{ item.icon }}</span>
              <span>{{ item.name }}</span>
              <small v-if="item.badge">{{ item.badge }}</small>
            </a>
          </li>
        </ul>
        <div v-else class="empty-search">没有匹配的工具</div>
        <div class="privacy-note"><span>✓</span> 数据仅在本地处理</div>
      </aside>

      <main class="panel">
        <div class="panel-card" :id="curPageId" tabindex="-1">
          <div class="tool-sharebar">
            <p class="tool-description">{{ activeTool.description }}</p>
            <button type="button" class="share-tool" :aria-label="`分享工具：${activeTool.name}`" @click="shareTool">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2"/></svg>
              {{ shareCopied ? '已复制分享 ✓' : '分享工具' }}
            </button>
          </div>
          <component :is="panels[curPageId]" @feedback="showFeedback" />
        </div>
        <div v-if="$slots.default" class="tool-guide vp-doc"><slot /></div>
      </main>
    </div>
    <div ref="feedbackRegion" class="tool-feedback" role="status" aria-live="polite" aria-atomic="true" @focusin="pauseFeedback" @focusout="scheduleFeedback">
      <div v-if="feedback" :key="feedbackId" class="feedback-card" :class="`kind-${feedback.kind}`">
        <span class="feedback-icon" aria-hidden="true">{{ feedback.kind === 'error' ? '!' : '✓' }}</span>
        <div>
          <strong>{{ feedback.kind === 'error' ? '复制未完成' : '复制成功' }}</strong>
          <p class="feedback-message">{{ feedback.message }}</p>
        </div>
        <button type="button" aria-label="关闭提示" @click="clearFeedback">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PanelBase64 from './components/PanelBase64.vue'
import PanelO10 from './components/PanelO10.vue'
import PanelUrl from './components/PanelUrl.vue'
import PanelAaencode from './components/PanelAaencode.vue'
import PanelJjencode from './components/PanelJjencode.vue'
import PanelImagesplit from './components/PanelImagesplit.vue'
import PanelCurlRequests from './components/PanelCurlRequests.vue'
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vitepress'
import copyText from '../utils/copy.js'

const props = defineProps({ toolId: { type: String, default: '' } })
const router = useRouter()
const curPageId = computed(() => toolList.value.some(tool => tool.pageId === props.toolId) ? props.toolId : 'curl-requests')
const q = ref('')
const feedback = ref(null)
const feedbackRegion = ref(null)
const feedbackId = ref(0)
const shareCopied = ref(false)
let feedbackTimer
let feedbackTrigger
let previousRouteHook
let routeHook
const panels = {
  'curl-requests': PanelCurlRequests,
  url: PanelUrl,
  base64: PanelBase64,
  o10: PanelO10,
  aaencode: PanelAaencode,
  jjencode: PanelJjencode,
  imagesplit: PanelImagesplit,
}
const toolPath = id => `/spider-tools/${id}/`

const toolList = ref([
  { name: 'cURL 转 Requests', pageId: 'curl-requests', icon: '↗', badge: 'NEW', description: '将 cURL 命令转换为 Python Requests 代码，支持请求头、Cookie、JSON 和表单。' },
  { name: 'URL 编码解码', pageId: 'url', icon: '%', description: '在线转换 URL 百分号编码，处理中文、空格与特殊字符。' },
  { name: 'Base64 编码解码', pageId: 'base64', icon: '64', description: '将文本转换为 Base64，或将 Base64 还原为文本，支持中文。' },
  { name: 'O10 编码解码', pageId: 'o10', icon: 'O10', badge: 'NEW', description: '支持标准 O10（数字 0、1 与大写 O）和 Pro（大写 I、小写 l 与数字 1）双模式文本编码解码，兼容 Python 原版。' },
  { name: 'AAencode 编码解码', pageId: 'aaencode', icon: 'AA', description: '将 JavaScript 转换为颜文字形式的 AAencode 编码，并提供解码。' },
  { name: 'JJencode 编码解码', pageId: 'jjencode', icon: 'JJ', description: '将 JavaScript 转换为符号形式的 JJencode 编码，并提供解码。' },
  { name: '图片分割', pageId: 'imagesplit', icon: '▦', description: '按行列切分图片，在浏览器内预览并下载切片。' },
])

const activeTool = computed(() => toolList.value.find(tool => tool.pageId === curPageId.value))
const visibleTools = computed(() => {
  const kw = q.value.trim().toLowerCase()
  if (!kw) return toolList.value
  return toolList.value.filter(t => `${t.name} ${t.description}`.toLowerCase().includes(kw))
})

function clearFeedback() {
  clearTimeout(feedbackTimer)
  const restoreFocus = feedbackRegion.value?.contains(document.activeElement)
  feedback.value = null
  shareCopied.value = false
  if (restoreFocus && feedbackTrigger?.isConnected) feedbackTrigger.focus({ preventScroll: true })
  feedbackTrigger = null
}

function pauseFeedback() {
  clearTimeout(feedbackTimer)
}

function scheduleFeedback(event) {
  clearTimeout(feedbackTimer)
  if (!feedback.value || feedbackRegion.value?.contains(event?.relatedTarget)) return
  feedbackTimer = setTimeout(clearFeedback, feedback.value.kind === 'error' ? 6000 : 4000)
}

function showFeedback(value) {
  clearFeedback()
  feedbackTrigger = document.activeElement
  feedback.value = value
  feedbackId.value += 1
  scheduleFeedback()
}

watch(curPageId, clearFeedback)

async function shareTool() {
  const tool = activeTool.value
  try {
    await copyText(`${tool.name}\n${tool.description}\nhttps://cpython666.github.io${toolPath(tool.pageId)}`)
    showFeedback({ message: '工具简介和直达链接已复制！', kind: 'success' })
    shareCopied.value = true
  } catch {
    showFeedback({ message: '复制失败，请重试。', kind: 'error' })
  }
}

function redirectLegacyLink() {
  if (props.toolId) return
  if (!['/spider-tools/', '/spider-tools', '/spider-tools/index.html'].includes(window.location.pathname)) return
  const hash = window.location.hash.slice(1)
  const target = toolList.value.find(item => item.pageId === hash)
  if (!target) return
  window.location.replace(toolPath(target.pageId) + window.location.search)
}

onMounted(async () => {
  redirectLegacyLink()
  window.addEventListener('hashchange', redirectLegacyLink)
  previousRouteHook = router.onAfterRouteChange
  const previous = previousRouteHook ?? router.onAfterRouteChanged
  routeHook = async href => {
    await previous?.(href)
    redirectLegacyLink()
  }
  router.onAfterRouteChange = routeHook
  if (props.toolId && !window.location.hash && window.matchMedia('(max-width: 768px)').matches) {
    await nextTick()
    const panel = document.getElementById(curPageId.value)
    panel?.scrollIntoView({ block: 'start', behavior: 'instant' })
    panel?.focus({ preventScroll: true })
  }
})

onUnmounted(() => {
  clearFeedback()
  window.removeEventListener('hashchange', redirectLegacyLink)
  if (router.onAfterRouteChange === routeHook) router.onAfterRouteChange = previousRouteHook
})
</script>

<style scoped>
.tools-page {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 64px);
  padding: 20px 24px 72px;
  background:
    radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent), transparent 28rem),
    var(--vp-c-bg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.tools-layout {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 238px minmax(0, 1fr);
  gap: 20px;
}

.navbar {
  position: sticky;
  top: 86px;
  align-self: start;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 14px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .04);
  backdrop-filter: blur(16px);
}

.nav-label {
  display: block;
  margin: 2px 4px 10px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.search {
  width: 100%;
  height: 38px;
  padding: 0 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  outline: none;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 13px;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.search:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.nav-list {
  margin: 13px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  list-style: none;
}

.nav-list li {
  overflow: hidden;
  border-radius: 10px;
}

.nav-list li a {
  min-height: 42px;
  padding: 7px 9px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  transition: color .18s ease, background .18s ease, transform .18s ease;
}

.tool-icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  font-weight: 700;
}

.nav-list small {
  padding: 2px 5px;
  border-radius: 5px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .06em;
}

.nav-list li a:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
  transform: translateX(2px);
}

.nav-list li.active a {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.nav-list li.active .tool-icon {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
  color: #fff;
  background: var(--vp-c-brand-1);
}

.empty-search {
  padding: 28px 6px;
  color: var(--vp-c-text-3);
  text-align: center;
  font-size: 12px;
}

.privacy-note {
  margin: 14px -14px -14px;
  padding: 11px 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  background: color-mix(in srgb, var(--vp-c-bg) 55%, transparent);
  font-size: 11px;
  text-align: center;
}

.privacy-note span {
  margin-right: 4px;
  color: var(--vp-c-green-1);
}

.panel {
  min-width: 0;
}

.panel-card {
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 16px);
  min-height: 560px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 28px;
  background: var(--vp-c-bg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, .055);
}

.tool-guide {
  margin-top: 24px;
  padding: 4px 28px 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  overflow-wrap: anywhere;
}

.tool-guide :deep(h2:first-child) {
  margin-top: 24px;
  border-top: 0;
  padding-top: 0;
}

.tool-sharebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tool-description {
  flex: 1 1 240px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.share-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  white-space: nowrap;
}

.share-tool svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.tool-feedback {
  position: fixed;
  top: calc(var(--vp-nav-height, 64px) + 16px + env(safe-area-inset-top, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  width: min(420px, calc(100vw - 32px));
  pointer-events: none;
}

.feedback-card {
  --feedback-color: var(--vp-c-green-1);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--feedback-color);
  border-left-width: 4px;
  border-radius: 12px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg));
  color: var(--vp-c-text-1);
  box-shadow: 0 12px 36px rgba(0, 0, 0, .25), 0 0 0 4px color-mix(in srgb, var(--feedback-color) 12%, transparent);
  pointer-events: auto;
  animation: feedback-in .18s ease-out;
}
.feedback-card.kind-error { --feedback-color: var(--vp-c-red-1); }
.feedback-icon { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 50%; color: var(--vp-c-bg); background: var(--feedback-color); font-size: 19px; font-weight: 800; }
.feedback-card > div { flex: 1; min-width: 0; }
.feedback-card strong { color: var(--feedback-color); font-size: 15px; }
.feedback-message { margin: 3px 0 0; font-size: 14px; line-height: 1.5; overflow-wrap: anywhere; }
.feedback-card button { flex: none; width: 28px; height: 28px; border-radius: 6px; color: var(--vp-c-text-2); font-size: 24px; cursor: pointer; }
.feedback-card button:hover { background: var(--vp-c-bg-soft); }
.feedback-card button:focus-visible { outline: 2px solid var(--feedback-color); outline-offset: 2px; }
@keyframes feedback-in { from { opacity: 0; translate: 0 -8px; } to { opacity: 1; translate: 0 0; } }
@media (prefers-reduced-motion: reduce) { .feedback-card { animation: none; } }

@media (max-width: 768px) {
  .tools-page {
    padding: 16px 16px 50px;
  }

  .tools-layout {
    grid-template-columns: 1fr;
  }

  .navbar {
    position: static;
  }

  .nav-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panel-card {
    min-height: 0;
    padding: 20px;
  }

  .tool-guide { padding: 0 20px 20px; }
}

@media (max-width: 460px) {
  .nav-list {
    grid-template-columns: 1fr;
  }
}
</style>
