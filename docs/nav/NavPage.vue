<script setup>
import { navigationData } from './data.js';
import WebLink from './WebLink.vue'
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

// import {WebLink} from 'vitepress/theme'

const activeAnchor = ref('')
const searchText = ref('')
const filteredNav = computed(() => {
  const q = searchText.value.trim()
  if (!q) return navigationData
  return navigationData.filter((s) => s.title.includes(q))
})

const handleScroll = () => {
  const navHeight = document.querySelector('header')?.offsetHeight || 0
  const fromTop = window.scrollY + navHeight + 12
  let current = ''
  for (const s of navigationData) {
    const el = document.getElementById(s.title)
    if (!el) continue
    if (el.offsetTop <= fromTop) {
      current = '#' + s.title
    } else {
      break
    }
  }
  if (current) activeAnchor.value = current
}

const scrollToAnchor = (id) => {
  const target = document.getElementById(id)
  if (target) {
    // 使用 scrollIntoView，使滚动更加稳定；配合内容区的 scroll-margin-top 避免被头部遮挡
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeAnchor.value = '#' + id
  }
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  nextTick(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <button class="backtop" type="button" aria-label="回到顶部" @click="scrollToTop">UP</button>
  <div class="page">
    <div class="my-nav">
      <div class="nav-card">
        <div class="nav-search">
          <input v-model="searchText" class="nav-input" placeholder="搜索分类" type="search" />
        </div>
          <div class="nav-scroll">
            <a
              v-for="(sites, index) in filteredNav"
              :key="index"
              class="nav-link"
              :class="{ 'is-active': activeAnchor === '#' + sites.title }"
              :title="sites.title"
              href="#"
              @click.prevent="scrollToAnchor(sites.title)"
            >
              {{ sites.title }}
            </a>
          </div>
      </div>
    </div>
    <div>
      <WebLink :datalist="navigationData"></WebLink>
      <div class="source-note">
        资源链接来源于
        <a href="https://spiderbox.cn/" target="_blank" rel="noopener noreferrer">《虫盒》</a>
        <span class="note-updating">持续更新中</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-nav {
  padding: 8px;
  position: sticky;
  top: 8px;
  align-self: flex-start;
  z-index: 20;
}

.nav-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-2);
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 20;
  box-sizing: border-box;
  width: 150px;
  /* 居中内部内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.nav-search { padding: 6px 8px 0; }

.nav-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.nav-scroll {
  max-height: 100vh;
  overflow: auto;
  width: 100%;
}

.nav-link {
  display: block;
  margin: 3px 6px;
  padding: 6px 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
  border-radius: 10px;
  border: none;
  text-align: center;
  min-width: 5em;
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
  transform: translateX(2px);
}

.nav-link.is-active {
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
}

.page {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 1120px;
  margin: 16px auto;
  padding: 0 12px;
}

.source-note {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 12px 0 0;
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.source-note a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.source-note a:hover { text-decoration: underline; }
.source-note .note-updating {
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-left: 8px;
}

.backtop {
  position: fixed;
  right: 24px;
  bottom: 100px;
  z-index: 50;
  width: 40px;
  height: 40px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  box-shadow: var(--vp-shadow-2);
}
</style>
