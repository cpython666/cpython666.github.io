<template>
  <div id="app" class="tools-layout">
    <aside class="navbar">
      <div class="nav-header">
        <input
          v-model="q"
          class="search"
          type="text"
          placeholder="搜索工具..."
        />
      </div>
      <ul class="nav-list">
        <li
          v-for="item in visibleTools"
          :key="item.pageId"
          :class="{ active: curPageId === item.pageId }"
        >
          <a :href="'#' + item.pageId" @click="selectPanel(item)">{{ item.name }}</a>
        </li>
      </ul>
    </aside>

    <section class="panel">
      <div class="panel-card" id="url" v-show="curPageId === 'url'">
        <h3 class="panel-title">URL编码解码</h3>
        <PanelUrl />
      </div>
      <div class="panel-card" id="base64" v-show="curPageId === 'base64'">
        <h3 class="panel-title">Base64编码解码</h3>
        <PanelBase64 />
      </div>
      <div class="panel-card" id="aaencode" v-show="curPageId === 'aaencode'">
        <h3 class="panel-title">AAencode编码解码</h3>
        <PanelAaencode />
      </div>
      <div class="panel-card" id="jjencode" v-show="curPageId === 'jjencode'">
        <h3 class="panel-title">JJencode编码解码</h3>
        <PanelJjencode />
      </div>
      <div class="panel-card" id="imagesplit" v-show="curPageId === 'imagesplit'">
        <h3 class="panel-title">图片分割</h3>
        <PanelImagesplit />
      </div>

      <div class="panel-card" id="md5" v-show="curPageId === 'md5'">
        <h3 class="panel-title">MD5加密</h3>
        <!-- 在这里添加 MD5 相关的功能 -->
      </div>
      <!-- 其他面板 -->
    </section>
  </div>
</template>

<script setup>
import PanelBase64 from './components/PanelBase64.vue'
import PanelUrl from './components/PanelUrl.vue'
import PanelAaencode from './components/PanelAaencode.vue'
import PanelJjencode from './components/PanelJjencode.vue'
import PanelImagesplit from './components/PanelImagesplit.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const curPageId = ref('aaencode')
const q = ref('')

// 工具列表
const toolList = ref([
  { name: 'URL编码解码', pageId: 'url' },
  { name: 'Base64编码解码', pageId: 'base64' },
  { name: 'AAencode编码解码', pageId: 'aaencode' },
  { name: 'JJencode编码解码', pageId: 'jjencode' },
  { name: '图片分割', pageId: 'imagesplit' },
  { name: 'MD5加密[开发中]', pageId: 'md5' },
  { name: 'json格式化[开发中]', pageId: 'json' },
  { name: 'header格式化[开发中]', pageId: 'header' },
])

// 搜索过滤
const visibleTools = computed(() => {
  const kw = q.value.trim().toLowerCase()
  if (!kw) return toolList.value
  return toolList.value.filter(t => t.name.toLowerCase().includes(kw))
})

function applyHash() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    if (hash) curPageId.value = hash
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

function selectPanel(item) {
  curPageId.value = item.pageId
  if (typeof window !== 'undefined') {
    window.location.hash = item.pageId
  }
}
</script>

<style scoped>
/* 布局 */
#app {
  margin: 16px auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 12px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
}

/* 侧栏 */
.navbar {
  position: sticky;
  top: 88px;
  align-self: start;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 12px;
}
.nav-header { margin-bottom: 8px; }
.search {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  outline: none;
  background: var(--el-bg-color);
}
.nav-list { list-style: none; padding: 0; margin: 8px 0 0; display: flex; flex-direction: column; gap: 6px; }
.nav-list li { border-radius: 8px; overflow: hidden; }
.nav-list li a {
  display: block;
  padding: 8px 10px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-9);
  transition: background .2s ease, transform .2s ease;
}
.nav-list li a:hover { transform: translateY(-1px); background: var(--el-color-primary-light-8); }
.nav-list li.active a { background: var(--el-color-primary); color: #fff; }

/* 面板区域 */
.panel {
  border: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 12px;
}
.panel-card {
  border: 1px dashed var(--el-border-color);
  border-radius: 10px;
  padding: 12px;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.panel-card + .panel-card { margin-top: 12px; }
.panel-title { margin: 0 0 10px; font-size: 16px; font-weight: 600; }

/* 响应式 */
@media (max-width: 768px) {
  #app { grid-template-columns: 1fr; }
  .navbar { position: static; }
}
</style>