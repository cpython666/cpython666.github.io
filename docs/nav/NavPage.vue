<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { navigationData } from './data.js'
import WebLink from './WebLink.vue'

const PAGE_SIZE = 36
const searchText = ref('')
const activeCategory = ref('')
const visibleCount = ref(PAGE_SIZE)
const loadTrigger = ref(null)
const autoLoadEnabled = ref(false)
let loadObserver
const groups = navigationData.map(group => ({ title: group.title, count: group.items.length }))
const resources = navigationData.flatMap(group => group.items.map((site, index) => ({
  ...site,
  section: group.title,
  key: `${group.title}:${index}:${site.link}`,
  search: [group.title, site.title, site.desc, site.link, ...(site.categories || [])].join(' ').toLowerCase(),
})))
const normalizedQuery = computed(() => searchText.value.trim().toLowerCase())
const filteredItems = computed(() => resources.filter(site =>
  (!activeCategory.value || site.section === activeCategory.value)
  && (!normalizedQuery.value || site.search.includes(normalizedQuery.value)),
))
const visibleItems = computed(() => filteredItems.value.slice(0, visibleCount.value))
const showSponsor = computed(() => !normalizedQuery.value && (!activeCategory.value || activeCategory.value === '站长推荐'))
watch([searchText, activeCategory], () => { visibleCount.value = PAGE_SIZE })

const updateHash = (category) => {
  const url = new URL(window.location.href)
  url.hash = category ? encodeURIComponent(category) : ''
  window.history.replaceState(window.history.state, '', url)
}
const selectCategory = async (category) => {
  activeCategory.value = category
  searchText.value = ''
  updateHash(category)
  await nextTick()
  document.getElementById('resource-results')?.scrollIntoView({ block: 'start', behavior: 'instant' })
}
const searchAll = () => {
  activeCategory.value = ''
  updateHash('')
}
const loadMore = async (focusNewItem = false) => {
  const firstNewIndex = visibleItems.value.length
  if (firstNewIndex >= filteredItems.value.length) return
  visibleCount.value += PAGE_SIZE
  if (focusNewItem) {
    await nextTick()
    document.querySelectorAll('#resource-results .site-link')[firstNewIndex]?.focus()
  }
}
const observeLoadTrigger = () => {
  loadObserver?.disconnect()
  if (loadTrigger.value) loadObserver?.observe(loadTrigger.value)
}
watch([loadTrigger, visibleItems], observeLoadTrigger, { flush: 'post' })
const syncCategoryHash = async () => {
  let category = ''
  try { category = decodeURIComponent(window.location.hash.slice(1)) } catch {}
  activeCategory.value = groups.some(group => group.title === category) ? category : ''
  searchText.value = ''
  if (activeCategory.value) {
    await nextTick()
    document.getElementById('resource-results')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
}
onMounted(() => {
  syncCategoryHash()
  window.addEventListener('hashchange', syncCategoryHash)
  if (typeof IntersectionObserver === 'function') {
    autoLoadEnabled.value = true
    loadObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore()
    }, { rootMargin: '0px 0px 400px 0px' })
    observeLoadTrigger()
  }
})
onBeforeUnmount(() => {
  loadObserver?.disconnect()
  window.removeEventListener('hashchange', syncCategoryHash)
})
</script>

<template>
  <main class="resources-page">
    <h1 class="sr-only">资源导航</h1>
    <header class="resource-toolbar">
      <div class="resource-search">
        <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input v-model="searchText" aria-label="搜索资源" type="search" placeholder="搜索名称、简介、标签或网址" @input="searchAll" />
        <button v-if="searchText" type="button" aria-label="清除搜索" @click="selectCategory('')">清除</button>
      </div>
      <span class="resource-stats">{{ resources.length }} 个资源 · {{ groups.length }} 个分类</span>
    </header>
    <label class="mobile-categories">
      <span>分类</span>
      <select aria-label="资源分类" :value="activeCategory" @change="selectCategory($event.target.value)">
        <option value="">全部资源 · {{ resources.length }}</option>
        <option v-for="group in groups" :key="group.title" :value="group.title">{{ group.title }} · {{ group.count }}</option>
      </select>
    </label>
    <div class="resource-workspace">
      <aside class="resource-sidebar" aria-label="资源分类">
        <p class="sidebar-heading">浏览分类</p>
        <nav>
          <button class="category-button" :class="{ active: !activeCategory }" type="button" :aria-pressed="!activeCategory" @click="selectCategory('')">
            <span>全部资源</span><span class="category-count">{{ resources.length }}</span>
          </button>
          <button v-for="group in groups" :key="group.title" class="category-button" :class="{ active: activeCategory === group.title }" type="button" :aria-pressed="activeCategory === group.title" @click="selectCategory(group.title)">
            <span>{{ group.title }}</span><span class="category-count">{{ group.count }}</span>
          </button>
        </nav>
      </aside>
      <section id="resource-results" class="resource-results" aria-label="资源列表">
        <div class="results-heading">
          <h2 :id="activeCategory || undefined">{{ normalizedQuery ? '搜索结果' : activeCategory || '全部资源' }}</h2>
          <span role="status" aria-live="polite">已显示 {{ visibleItems.length }} / {{ filteredItems.length }}</span>
        </div>
        <a v-if="showSponsor" class="sponsor-banner" href="https://www.qg.net/product/proxyip.html?source=star" target="_blank" rel="noopener noreferrer">
          <img class="no-zoom" src="/imgs/ads/qgwl.jpeg" alt="青果网络代理服务" width="960" height="70" loading="lazy" decoding="async" />
        </a>
        <WebLink v-if="visibleItems.length" :items="visibleItems" />
        <div v-else-if="!showSponsor" class="empty-state">
          <h3>没有找到匹配的资源</h3>
          <p>试试其他关键词，或返回全部资源。</p>
          <button type="button" @click="selectCategory('')">清除筛选</button>
        </div>
        <div v-if="visibleItems.length < filteredItems.length" ref="loadTrigger" class="load-trigger">
          <p v-if="autoLoadEnabled" class="load-hint">继续向下浏览，自动加载更多</p>
          <button v-else class="load-more" type="button" @click="loadMore(true)">加载更多 <span>还有 {{ filteredItems.length - visibleItems.length }} 个</span></button>
        </div>
        <p class="source-note">部分资源整理自 <a href="https://spiderbox.cn/" target="_blank" rel="noopener noreferrer">虫盒</a>，持续补充中。</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.resources-page { width: min(1240px, calc(100% - 40px)); margin: 12px auto 48px; }
.resources-page p { text-indent: 0; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.resource-toolbar { display: flex; align-items: center; gap: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--vp-c-divider); }
.resource-stats { color: var(--vp-c-text-3); font-size: 12px; white-space: nowrap; }
.resource-search { display: flex; flex: 1; min-width: 0; align-items: center; gap: 10px; min-height: 46px; padding: 0 14px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); }
.resource-search:focus-within { border-color: var(--vp-c-brand-1); outline: 2px solid var(--vp-c-brand-soft); }
.resource-search svg { flex: none; width: 20px; height: 20px; fill: none; stroke: var(--vp-c-text-3); stroke-width: 1.8; }
.resource-search input { width: 100%; min-width: 0; padding: 11px 0; outline: none; background: transparent; color: var(--vp-c-text-1); font: inherit; font-size: 14px; }
.resource-search button { flex: none; color: var(--vp-c-brand-1); font-size: 13px; cursor: pointer; }
.resource-workspace { display: grid; grid-template-columns: 192px minmax(0, 1fr); align-items: start; gap: 28px; margin-top: 20px; }
.resource-sidebar { position: sticky; top: calc(var(--vp-nav-height, 64px) + 16px); min-width: 0; }
.sidebar-heading { margin: 0 0 12px; padding-left: 12px; color: var(--vp-c-text-3); font-size: 12px; font-weight: 600; }
.resource-sidebar nav { display: grid; gap: 4px; max-height: calc(100dvh - 160px); overflow-y: auto; scrollbar-width: thin; padding-right: 6px; }
.category-button { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-height: 38px; padding: 8px 12px; border-radius: 8px; color: var(--vp-c-text-2); font-size: 13px; text-align: left; cursor: pointer; }
.category-button:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
.category-button.active { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); font-weight: 600; }
.category-count { font-size: 11px; font-variant-numeric: tabular-nums; opacity: .8; }
.resource-results { min-width: 0; scroll-margin-top: calc(var(--vp-nav-height, 64px) + 20px); }
.results-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.results-heading h2 { margin: 0; padding: 0; border: 0; font-size: 20px; line-height: 1.5; scroll-margin-top: calc(var(--vp-nav-height, 64px) + 20px); }
.results-heading span { flex: none; color: var(--vp-c-text-3); font-size: 12px; }
.sponsor-banner { display: block; margin-bottom: 16px; overflow: hidden; border-radius: 8px; }
.sponsor-banner img { display: block; width: 100%; height: auto; aspect-ratio: 96 / 7; object-fit: contain; }
.load-trigger { margin-top: 24px; }
.load-hint { margin: 0; color: var(--vp-c-text-3); font-size: 13px; text-align: center; }
.load-more { display: block; width: 100%; padding: 14px 20px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); color: var(--vp-c-brand-1); font-size: 14px; font-weight: 600; cursor: pointer; }
.load-more span { margin-left: 8px; color: var(--vp-c-text-3); font-size: 12px; font-weight: 400; }
.load-more:hover { border-color: var(--vp-c-brand-2); }
.source-note { margin: 28px 0 0; color: var(--vp-c-text-3); font-size: 12px; }
.source-note a { color: var(--vp-c-text-2); text-decoration: underline; }
.empty-state { padding: 56px 20px; border: 1px dashed var(--vp-c-divider); border-radius: 12px; text-align: center; }
.empty-state h3 { margin: 0 0 10px; font-size: 18px; }
.empty-state p { color: var(--vp-c-text-2); }
.empty-state button { margin-top: 16px; color: var(--vp-c-brand-1); cursor: pointer; }
.mobile-categories { display: none; }
button:focus-visible, a:focus-visible, select:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
@media (max-width: 760px) {
  .resources-page { width: calc(100% - 24px); margin-top: 12px; }
  .resource-toolbar { align-items: stretch; flex-direction: column; gap: 8px; }
  .resource-search input { font-size: 16px; }
  .resource-sidebar { display: none; }
  .resource-workspace { grid-template-columns: minmax(0, 1fr); margin-top: 20px; }
  .mobile-categories { display: flex; align-items: center; gap: 12px; margin-top: 16px; color: var(--vp-c-text-2); font-size: 14px; }
  .mobile-categories select { flex: 1; min-width: 0; min-height: 42px; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
}
</style>
