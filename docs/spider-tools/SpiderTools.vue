<template>
  <div class="tools-page">
    <header class="tools-hero">
      <div>
        <span class="eyebrow">SPIDER TOOLBOX</span>
        <h1>在线开发工具箱</h1>
        <p>为爬虫与日常开发准备的轻量工具，所有处理均在浏览器本地完成。</p>
      </div>
      <div class="hero-mark" aria-hidden="true">&lt;/&gt;</div>
    </header>

    <div class="tools-layout">
      <aside class="navbar">
        <div class="nav-label">工具列表</div>
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
            <a :href="'#' + item.pageId" @click="selectPanel(item, $event)">
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
        <div class="panel-card" id="curl-requests" v-show="curPageId === 'curl-requests'">
          <PanelCurlRequests />
        </div>
        <div class="panel-card" id="url" v-show="curPageId === 'url'">
          <PanelUrl />
        </div>
        <div class="panel-card" id="base64" v-show="curPageId === 'base64'">
          <PanelBase64 />
        </div>
        <div class="panel-card" id="aaencode" v-show="curPageId === 'aaencode'">
          <PanelAaencode />
        </div>
        <div class="panel-card" id="jjencode" v-show="curPageId === 'jjencode'">
          <PanelJjencode />
        </div>
        <div class="panel-card" id="imagesplit" v-show="curPageId === 'imagesplit'">
          <PanelImagesplit />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import PanelBase64 from './components/PanelBase64.vue'
import PanelUrl from './components/PanelUrl.vue'
import PanelAaencode from './components/PanelAaencode.vue'
import PanelJjencode from './components/PanelJjencode.vue'
import PanelImagesplit from './components/PanelImagesplit.vue'
import PanelCurlRequests from './components/PanelCurlRequests.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const curPageId = ref('curl-requests')
const q = ref('')

const toolList = ref([
  { name: 'cURL 转 Requests', pageId: 'curl-requests', icon: '↗', badge: 'NEW' },
  { name: 'URL 编码解码', pageId: 'url', icon: '%' },
  { name: 'Base64 编码解码', pageId: 'base64', icon: '64' },
  { name: 'AAencode 编码解码', pageId: 'aaencode', icon: 'AA' },
  { name: 'JJencode 编码解码', pageId: 'jjencode', icon: 'JJ' },
  { name: '图片分割', pageId: 'imagesplit', icon: '▦' },
])

const visibleTools = computed(() => {
  const kw = q.value.trim().toLowerCase()
  if (!kw) return toolList.value
  return toolList.value.filter(t => t.name.toLowerCase().includes(kw))
})

function applyHash() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    if (toolList.value.some((item) => item.pageId === hash)) {
      curPageId.value = hash
    }
  }
}

onMounted(() => {
  applyHash()
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', applyHash)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('hashchange', applyHash)
  }
})

function selectPanel(item, event) {
  event?.preventDefault()
  curPageId.value = item.pageId
  if (typeof window !== 'undefined') {
    window.location.hash = item.pageId
  }
}
</script>

<style scoped>
.tools-page {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 64px);
  padding: 52px 24px 72px;
  background:
    radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent), transparent 28rem),
    var(--vp-c-bg);
}

.tools-hero {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
}

.tools-hero h1 {
  margin: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.15;
  letter-spacing: -.035em;
}

.tools-hero p {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.hero-mark {
  flex: none;
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  border-radius: 22px;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 22px;
  font-weight: 700;
  transform: rotate(3deg);
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
  min-height: 560px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 28px;
  background: var(--vp-c-bg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, .055);
}

@media (max-width: 768px) {
  .tools-page {
    padding: 32px 16px 50px;
  }

  .hero-mark {
    display: none;
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
}

@media (max-width: 460px) {
  .nav-list {
    grid-template-columns: 1fr;
  }
}
</style>
