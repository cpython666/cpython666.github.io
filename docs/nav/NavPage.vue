<script setup>
import { navigationData } from './data.js';
import { ElBacktop, ElScrollbar, ElLink, ElInput } from 'element-plus'
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

let headingEls = []

const collectHeadingEls = () => {
  headingEls = navigationData
    .map((s) => document.getElementById(s.title))
    .filter(Boolean)
}

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

onMounted(() => {
  nextTick(() => {
    collectHeadingEls()
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <el-backtop :bottom="100">
    <div style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      ">
      UP
    </div>
  </el-backtop>
  <div class="page">
    <div class="my-nav">
      <div class="nav-card">
        <div class="nav-search">
          <el-input v-model="searchText" placeholder="搜索分类" clearable size="small" />
        </div>
          <el-scrollbar height="100vh">
            <el-link
              v-for="(sites, index) in filteredNav"
              :key="index"
              type="primary"
              :underline="false"
              :class="{ 'is-active': activeAnchor === '#' + sites.title }"
              :title="sites.title"
              href="#"
              @click.prevent="scrollToAnchor(sites.title)"
            >
              {{ sites.title }}
            </el-link>
          </el-scrollbar>
      </div>
    </div>
    <div>
<!--              <el-link type="primary" href="https://www.qg.net/product/proxyip.html?source=star" target="_blank">-->
<!--          <img style="width: 450px" src="/imgs/ads/green.jpg"/>-->
<!--        </el-link>-->
<!--      <div class="flex-grow justify-center w-100" style="display: flex; justify-content: center; align-items: center;">-->
<!--        <el-link type="primary" href="https://www.qg.net/product/proxyip.html?source=star" target="_blank">-->
<!--          <img style="width: 450px" src="/imgs/ads/green.jpg"/>-->
<!--        </el-link>-->
<!--      </div>-->


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
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  padding: 10px;
  border: 1px solid var(--el-border-color-light);
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

.el-scrollbar {
  overflow: visible !important;
  width: 100%;
}

.el-link {
  display: block;
  margin: 3px 6px;
  padding: 6px 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 10px;
  border: none;
  text-align: center;
}

.el-link__inner {
  display: block;
  min-width: 5em;
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-link:hover {
  background: var(--el-color-primary);
  color: #fff;
  transform: translateX(2px);
}

.el-link.is-active {
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}

.page {
  display: flex;
  gap: 12px;
}

.source-note {
  background: var(--el-color-primary-light-9);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 12px 0 0;
  color: var(--el-text-color-primary);
  font-weight: 600;
}
.source-note a {
  color: var(--el-text-color-primary);
  text-decoration: none;
}
.source-note a:hover { text-decoration: underline; }
.source-note .note-updating {
  font-weight: 500;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}
</style>