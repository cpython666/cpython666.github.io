<script setup>
import { useData, useRouter } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { data as memberArticlePaths } from './member.data.mjs'
import copyText from '../utils/copy.js'

const { theme } = useData()
const router = useRouter()

const tabs = [
  { id: 'articles', text: '文章' },
  { id: 'prompts', text: '提示词' },
]
const activeTab = ref('articles')
const prompts = [
  {
    id: 'video-cover',
    title: '生成视频封面的',
    text: '以上面图片为素材，给出视频封面\n封面比例4:3\n视频标题是：{{视频标题}}\n封面上只需要有重点的几个字\n不需要有很多小文字，适当加点插画就可以\n风格：使用手写体或仿手写字体。大量使用简笔画、小图标、箭头、对话框、分隔线等手绘元素来辅助表达。色彩丰富活泼，常用荧光笔、彩铅效果。布局自由随性，充满个性和趣味性。',
  },
  {
    id: 'subtitle-correction',
    title: '矫正视频字幕的',
    text: '修复下这个字幕：\n里面可能提到了gpt-5.6-sol\nblender\ngodot，gdscript\n这些术语\n【可选】可参考视频文案是：',
  },
  { id: 'training-cutoff', title: '训练数据截止时间', text: '你的训练时间截止什么日期？' },
  { id: 'cycling-pelican-svg', title: '骑自行车的鹈鹕', text: '生成一个动态的骑自行车的鹈鹕的svg' },
  { id: 'cycling-girl-svg', title: '骑自行车的小姑娘', text: '生成一个动态的骑自行车的穿渔网袜的小姑娘的svg' },
  {
    id: 'project-knowledge-skill',
    title: '建立并自动维护项目知识库',
    text: '为本项目建立一个项目级 skill，作为之后所有 AI 对话共享的项目知识库，并让它自动维护。\n\n【建立】\n\n- 先了解项目，在 `.agents/skills/<项目名>/SKILL.md` 创建（已有就沿用完善）。SKILL.md 只放项目概览、关键约定和资料索引，细节按主题拆到 `references/`。\n- 在根目录 AGENTS.md 写入规则：处理本项目任务前先读这个 skill；完成一段有结论的工作后，按下面的规则更新它。\n\n【维护规则】\n\n- 不用等我提醒：有新的已确认决策、已核实的实现、踩坑或待办，就顺手更新；没有就不动。\n- 只写事实。讨论中的方案、未验证的猜测标“待定”，不能写成已完成。\n- 就地修改旧内容，不堆叠追加；过时的直接改掉。不复制大段代码，写文件路径即可。\n- 不写密钥和隐私信息；更新文档不代表可以提交、推送或做其他操作。\n- 更新后在回复末尾用一句话说明记了什么。\n\n现在开始：检查项目，建好结构，把以上规则精简地写进 AGENTS.md。',
  },
]
const videoTitle = ref('')
const promptText = (prompt) => prompt.text.replaceAll('{{视频标题}}', videoTitle.value || '{{视频标题}}')
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
  `https://cpython666.github.io/navigation/#prompt-${prompt.id}`,
  '分享链接已复制！',
  '分享链接复制失败，请重试。',
)

const linkedPrompt = ref('')
let locateFrame
let previousRouteHook
let routeHook

const syncPromptLocation = async () => {
  cancelAnimationFrame(locateFrame)
  const hash = window.location.hash
  const prompt = prompts.find(item => hash === `#prompt-${item.id}`)
  linkedPrompt.value = prompt?.id || ''
  activeTab.value = prompt || hash === '#prompts' ? 'prompts' : 'articles'
  if (!prompt) return
  await nextTick()
  locateFrame = requestAnimationFrame(() => {
    const card = document.getElementById(`prompt-${prompt.id}`)
    card?.scrollIntoView({ block: 'start', behavior: 'instant' })
    card?.focus({ preventScroll: true })
  })
}

const selectTab = (id) => {
  cancelAnimationFrame(locateFrame)
  activeTab.value = id
  linkedPrompt.value = ''
  const url = new URL(window.location.href)
  url.hash = id === 'prompts' ? 'prompts' : ''
  window.history.replaceState(window.history.state, '', url)
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
  clearTimeout(copyTimer)
  cancelAnimationFrame(locateFrame)
  window.removeEventListener('hashchange', syncPromptLocation)
  if (routeHook && router.onAfterRouteChange === routeHook) router.onAfterRouteChange = previousRouteHook
})

const handleTabKeydown = (event, index) => {
  let nextIndex
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
  else if (event.key === 'ArrowLeft') nextIndex = (index + tabs.length - 1) % tabs.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = tabs.length - 1
  else return

  event.preventDefault()
  selectTab(tabs[nextIndex].id)
  document.getElementById(`nav-tab-${activeTab.value}`)?.focus()
}

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
const activeGroupArticleCount = computed(() => activeGroup.value?.articles.length || 0)
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
    <section class="nav-hero">
      <div class="hero-copy">
        <p class="eyebrow">站内索引</p>
        <h1>文章导航</h1>
        <p class="summary">按分类浏览站内文章，或切换到提示词，一键复制使用。</p>
      </div>
      <div class="hero-stats" aria-label="内容统计">
        <div>
          <strong>{{ totalArticles }}</strong>
          <span>文章</span>
        </div>
        <div>
          <strong>{{ prompts.length }}</strong>
          <span>提示词</span>
        </div>
      </div>
    </section>

    <div class="content-tabs" role="tablist" aria-label="导航内容">
      <button
        v-for="(tab, index) in tabs"
        :id="`nav-tab-${tab.id}`"
        :key="tab.id"
        class="content-tab"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`nav-panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="selectTab(tab.id)"
        @keydown="handleTabKeydown($event, index)"
      >
        {{ tab.text }}
        <span class="tab-count">{{ tab.id === 'articles' ? totalArticles : prompts.length }}</span>
      </button>
    </div>

    <section
      v-show="activeTab === 'articles'"
      id="nav-panel-articles"
      role="tabpanel"
      aria-labelledby="nav-tab-articles"
      tabindex="0"
    >
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
            <div>
              <p class="panel-kicker">{{ normalizedQuery ? '搜索结果' : activeGroupText }}</p>
              <h2>{{ normalizedQuery ? `找到 ${visibleArticles.length} 篇文章` : `${activeGroupArticleCount} 篇文章` }}</h2>
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

      <div v-else class="empty-state tab-empty-state">
        <h3>暂无文章配置</h3>
        <p>请先在 VitePress 配置里添加 sidebar 项。</p>
      </div>
    </section>

    <section
      v-show="activeTab === 'prompts'"
      id="nav-panel-prompts"
      class="prompt-panel"
      role="tabpanel"
      aria-labelledby="nav-tab-prompts"
      tabindex="0"
    >
      <div class="toolbar">
        <h2>{{ prompts.length }} 条提示词</h2>
      </div>
      <div class="prompt-list">
        <article
          v-for="prompt in prompts"
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
                @click="copyPrompt(prompt)"
              >
                复制
              </button>
              <button
                class="copy-prompt"
                type="button"
                :aria-label="`分享提示词：${prompt.title}`"
                @click="sharePrompt(prompt)"
              >
                分享
              </button>
            </div>
          </div>
          <label v-if="prompt.text.includes('{{视频标题}}')" class="prompt-variable">
            视频标题
            <input v-model="videoTitle" type="text" placeholder="输入视频标题" />
          </label>
          <p class="prompt-text">{{ promptText(prompt) }}</p>
        </article>
      </div>
    </section>
    <div role="status" aria-live="polite">
      <p v-if="copyNotice" class="copy-toast">{{ copyNotice }}</p>
    </div>
  </main>
</template>

<style scoped>
.nav-page {
  width: min(1180px, calc(100% - 32px));
  margin: 20px auto 40px;
}

.nav-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.eyebrow,
.panel-kicker {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.nav-hero h1 {
  margin: 0;
  font-size: 40px;
  line-height: 1.15;
}

.summary {
  max-width: 560px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 96px);
  gap: 10px;
}

.hero-stats div {
  min-height: 74px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.hero-stats strong,
.hero-stats span {
  display: block;
}

.hero-stats strong {
  font-size: 26px;
  line-height: 1;
}

.hero-stats span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.nav-workspace {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;
  margin-top: 24px;
  align-items: start;
}

.content-tabs {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.content-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 4px;
  border-bottom: 2px solid transparent;
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.content-tab:hover,
.content-tab[aria-selected='true'] {
  color: var(--vp-c-brand-1);
}

.content-tab[aria-selected='true'] {
  border-bottom-color: var(--vp-c-brand-1);
}

.tab-count {
  padding: 0 7px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  font-size: 12px;
}

.content-tab:focus-visible,
.prompt-variable input:focus-visible,
.copy-prompt:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.prompt-panel,
.tab-empty-state {
  margin-top: 24px;
}

.prompt-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.prompt-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 16px);
}

.prompt-card.is-linked {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.prompt-card h3 {
  min-width: 0;
  margin: 0;
  font-size: 17px;
}

.prompt-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.prompt-actions {
  display: flex;
  gap: 6px;
}

.prompt-variable {
  width: 100%;
  margin-top: 16px;
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
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  user-select: text;
}

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
  font-size: 24px;
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
  .nav-page {
    width: min(100% - 24px, 1180px);
  }

  .nav-hero,
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nav-workspace {
    grid-template-columns: 1fr;
  }

  .category-panel {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  }

  .search-box {
    width: 100%;
  }
}
</style>
