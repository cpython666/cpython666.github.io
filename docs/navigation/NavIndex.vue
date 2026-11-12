<script setup>
import { useData, useRouter } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { data as memberArticlePaths } from './member.data.mjs'

const { theme } = useData()
const router = useRouter()
let previousRouteHook
let routeHook
const redirectLegacyPrompts = () => {
  const url = new URL(window.location.href)
  if (url.hash !== '#prompts' && !url.hash.startsWith('#prompt-')) return
  url.pathname = '/prompts/'
  if (url.hash === '#prompts') url.hash = ''
  window.location.replace(url.href)
}
onMounted(() => {
  redirectLegacyPrompts()
  window.addEventListener('hashchange', redirectLegacyPrompts)
  previousRouteHook = router.onAfterRouteChange
  const previous = previousRouteHook ?? router.onAfterRouteChanged
  routeHook = async (href) => {
    await previous?.(href)
    redirectLegacyPrompts()
  }
  router.onAfterRouteChange = routeHook
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', redirectLegacyPrompts)
  if (router.onAfterRouteChange === routeHook) router.onAfterRouteChange = previousRouteHook
})

const query = ref('')
const activePath = ref('')

const normalizeLink = (link = '') => link.replace(/\/$/, '')
const stripSlash = (value = '') => value.replace(/^\//, '').replace(/\/$/, '')
const normalizeArticlePath = (path = '') => {
  const clean = path.split('#')[0].split('?')[0]
  return clean.endsWith('/') ? clean : normalizeLink(clean)
}

const memberPathSet = new Set()
for (const path of memberArticlePaths || []) {
  memberPathSet.add(path)
  memberPathSet.add(normalizeArticlePath(path))
}

const decodeText = (value = '') => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const fallbackTitle = (path) => {
  const name = stripSlash(path).split('/').filter(Boolean).at(-1) || '其他'
  const readable = {
    backend: '后端',
    life: '人生感悟',
    python: 'Python',
    spider: '爬虫',
    web: '前端',
    web3: 'Web3',
  }
  return readable[name] || decodeText(name)
}

const includeSet = computed(() => {
  const include = theme.value?.blogNavInclude
  return Array.isArray(include) ? new Set(include) : null
})

const excludeSet = computed(() => {
  const exclude = theme.value?.blogNavExclude
  return Array.isArray(exclude) ? new Set(exclude) : new Set()
})

const navTitleMap = computed(() => {
  const map = new Map()
  const walk = (item) => {
    if (!item) return
    if (item.link) map.set(normalizeLink(item.link), item.text)
    if (Array.isArray(item.items)) item.items.forEach(walk)
  }
  ;(theme.value?.nav || []).forEach(walk)
  return map
})

const configuredTitle = (path) => {
  const titles = theme.value?.blogNavTitles || {}
  return titles[path] || titles[normalizeLink(path)] || navTitleMap.value.get(normalizeLink(path)) || fallbackTitle(path)
}

const isMemberArticle = (link = '') => memberPathSet.has(normalizeArticlePath(link)) || memberPathSet.has(link)

const collectArticles = (items, groupText, sectionTrail = []) => {
  const result = []
  const walk = (node, trail) => {
    if (!node) return
    const nextTrail = node.items?.length ? [...trail, node.text].filter(Boolean) : trail
    if (node.link) {
      result.push({
        text: node.text || decodeText(stripSlash(node.link).split('/').at(-1)),
        link: node.link,
        section: trail.filter(Boolean).join(' / '),
        group: groupText,
        memberOnly: isMemberArticle(node.link),
      })
    }
    if (Array.isArray(node.items)) node.items.forEach(child => walk(child, nextTrail))
  }
  ;(items || []).forEach(item => walk(item, sectionTrail))
  return result
}

const navGroups = computed(() => {
  const sidebar = theme.value?.sidebar || {}
  const groups = []

  for (const [path, items] of Object.entries(sidebar)) {
    if (path === '/') continue
    if (includeSet.value && !includeSet.value.has(path)) continue
    if (excludeSet.value.has(path)) continue

    const text = configuredTitle(path)
    const articles = collectArticles(Array.isArray(items) ? items : [], text)
    if (!articles.length) continue

    groups.push({
      path,
      text,
      articles,
    })
  }

  return groups
})

watchEffect(() => {
  if (!navGroups.value.length) {
    activePath.value = ''
    return
  }
  if (!activePath.value || !navGroups.value.some(group => group.path === activePath.value)) {
    activePath.value = navGroups.value[0].path
  }
})

const allArticles = computed(() => navGroups.value.flatMap(group => group.articles.map(item => ({
  ...item,
  groupPath: group.path,
}))))

const totalArticles = computed(() => allArticles.value.length)
const activeGroup = computed(() => navGroups.value.find(group => group.path === activePath.value) || navGroups.value[0])
const activeGroupPath = computed(() => activeGroup.value?.path || '')
const activeGroupText = computed(() => activeGroup.value?.text || '全部文章')
const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const visibleArticles = computed(() => {
  const source = normalizedQuery.value ? allArticles.value : (activeGroup.value?.articles || [])
  if (!normalizedQuery.value) return source

  return source.filter(item => {
    const haystack = `${item.text} ${item.group} ${item.section} ${item.link} ${item.memberOnly ? '会员 vip' : ''}`.toLowerCase()
    return haystack.includes(normalizedQuery.value)
  })
})

const groupedVisibleArticles = computed(() => {
  const map = new Map()
  for (const item of visibleArticles.value) {
    const key = normalizedQuery.value ? item.group : (item.section || '全部文章')
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return Array.from(map.entries()).map(([text, articles]) => ({ text, articles }))
})

const selectGroup = (path) => {
  activePath.value = path
}
</script>

<template>
  <main class="nav-page">
    <h1 class="page-title-sr">文章导航</h1>
    <div v-if="navGroups.length" class="nav-workspace">
      <aside class="category-panel" aria-label="文章分类">
        <button
          v-for="group in navGroups"
          :key="group.path"
          class="category-button"
          :class="{ active: activeGroupPath === group.path && !normalizedQuery }"
          type="button"
          @click="selectGroup(group.path)"
        >
          <span class="category-name">{{ group.text }}</span>
          <span class="category-meta">{{ group.articles.length }}</span>
        </button>
      </aside>

      <section class="article-panel">
        <div class="toolbar">
          <div class="toolbar-summary">
            <h2>{{ normalizedQuery ? '搜索结果' : activeGroupText }}</h2>
            <span>{{ visibleArticles.length }} / {{ totalArticles }} 篇文章</span>
          </div>
          <label class="search-box">
            <span>搜索</span>
            <input v-model="query" type="search" placeholder="输入标题、分类或路径" />
          </label>
        </div>

        <div v-if="groupedVisibleArticles.length" class="article-sections">
          <section v-for="section in groupedVisibleArticles" :key="section.text" class="article-section">
            <div class="section-heading">
              <h3>{{ section.text }}</h3>
              <span>{{ section.articles.length }}</span>
            </div>
            <div class="article-list">
              <a
                v-for="article in section.articles"
                :key="article.link"
                class="article-link"
                :class="{ member: article.memberOnly }"
                :href="article.link"
              >
                <span v-if="article.memberOnly" class="member-badge" aria-label="会员文章">VIP</span>
                <span class="article-title">{{ article.text }}</span>
                <span class="article-path">{{ article.link }}</span>
              </a>
            </div>
          </section>
        </div>

        <div v-else class="empty-state">
          <h3>没有匹配的文章</h3>
          <p>换个关键词试试看。</p>
        </div>
      </section>
    </div>

    <div v-else class="empty-state">
      <h3>暂无文章配置</h3>
      <p>请先在 VitePress 配置里添加 sidebar 项。</p>
    </div>
  </main>
</template>

<style scoped>
.nav-page { width: min(1180px, calc(100% - 32px)); margin: 16px auto 40px; }
.nav-workspace { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 24px; align-items: start; }
.toolbar-summary { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 12px; }
.toolbar-summary span { color: var(--vp-c-text-2); font-size: 13px; }
.category-button:focus-visible, .search-box:focus-within { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
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
.category-panel {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-button {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
}

.category-button:hover,
.category-button.active {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}

.category-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
}

.category-meta {
  min-width: 28px;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  text-align: center;
}

.article-panel {
  min-width: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.toolbar h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

.article-sections {
  display: grid;
  gap: 20px;
}

.article-section {
  padding-top: 2px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.section-heading h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.section-heading span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.article-link {
  position: relative;
  display: flex;
  min-height: 88px;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease;
}

.article-link.member {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 34%, var(--vp-c-divider));
}

.article-link:hover {
  transform: translateY(-1px);
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg-soft);
}

.member-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 20px;
  padding: 0 7px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 750;
  line-height: 1;
}

.article-title {
  display: -webkit-box;
  overflow: hidden;
  padding-right: 42px;
  font-weight: 650;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-path {
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
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


@media (max-width: 860px) {
  .nav-page { width: calc(100% - 24px); }
  .toolbar { align-items: stretch; flex-direction: column; }
  .nav-workspace { grid-template-columns: minmax(0, 1fr); }
  .category-panel { position: static; display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); }
  .search-box { width: 100%; min-width: 0; }
}
</style>
