<script setup>
import { computed, onMounted, ref } from 'vue'
import { projects, sortProjects } from './data.js'

const GH_USER = 'cpython666'
const CACHE_KEY = 'stardream:github-stars:v1'
const CACHE_TTL = 6 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 8000

const defaultImg = '/imgs/app/default.svg'
const query = ref('')
const activeCategory = ref('全部')
const starStatus = ref('idle')
const starMessage = ref('Stars 等待加载')

const items = sortProjects(projects).map(project => ({
  ...project,
  stars: typeof project.stars === 'number' ? project.stars : null,
}))

const viewItems = ref(items)

const githubProjects = computed(() => viewItems.value.filter(project => parseRepoFromUrl(project.url)))
const totalStars = computed(() => githubProjects.value.reduce((sum, project) => sum + (Number.isFinite(project.stars) ? project.stars : 0), 0))
const loadedStars = computed(() => githubProjects.value.filter(project => Number.isFinite(project.stars)).length)

const categories = computed(() => {
  const names = new Set()
  for (const project of viewItems.value) {
    ;(project.category || []).forEach(item => names.add(item))
  }
  return ['全部', ...Array.from(names).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))]
})

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredItems = computed(() => {
  return viewItems.value.filter(project => {
    const matchCategory = activeCategory.value === '全部' || (project.category || []).includes(activeCategory.value)
    if (!matchCategory) return false
    if (!normalizedQuery.value) return true

    const text = [
      project.title,
      project.subtitle,
      project.description,
      project.url,
      ...(project.category || []),
    ].join(' ').toLowerCase()
    return text.includes(normalizedQuery.value)
  })
})

const featuredProject = computed(() => viewItems.value.find(project => project.title === 'cpython666.github.io') || viewItems.value[0])

const githubUrl = (project) => parseRepoFromUrl(project.url)?.url

const parseRepoFromUrl = (url) => {
  try {
    const parsed = new URL(url, 'https://example.com')
    const host = parsed.hostname.toLowerCase()
    if (host !== 'github.com' && host !== 'www.github.com') return null

    const segments = parsed.pathname.split('/').filter(Boolean)
    if (segments.length < 2) return null

    const owner = segments[0]
    const repo = segments[1].replace(/\.git$/, '')
    return {
      owner,
      repo,
      key: `${owner}/${repo}`.toLowerCase(),
      url: `https://github.com/${owner}/${repo}`,
    }
  } catch (_) {
    return null
  }
}

const formatStars = (value) => {
  if (!Number.isFinite(value)) return '—'
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  return String(value)
}

const readStarCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (!cache || Date.now() - cache.time > CACHE_TTL) return null
    return cache.stars || null
  } catch (_) {
    return null
  }
}

const writeStarCache = (stars) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), stars }))
  } catch (_) {}
}

const fetchWithTimeout = async (url) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    return await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

const applyStars = (starMap) => {
  if (!starMap) return 0
  let count = 0
  viewItems.value = viewItems.value.map(project => {
    const repo = parseRepoFromUrl(project.url)
    if (!repo || !Object.prototype.hasOwnProperty.call(starMap, repo.key)) return project
    count += 1
    return { ...project, stars: starMap[repo.key] }
  })
  return count
}

const fetchUserRepoStars = async () => {
  const map = {}
  let page = 1
  const perPage = 100

  while (page <= 10) {
    const res = await fetchWithTimeout(`https://api.github.com/users/${GH_USER}/repos?per_page=${perPage}&page=${page}`)
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)

    const data = await res.json()
    if (!Array.isArray(data) || !data.length) break

    data.forEach(repo => {
      if (repo?.full_name) map[repo.full_name.toLowerCase()] = repo.stargazers_count || 0
    })
    if (data.length < perPage) break
    page += 1
  }

  return map
}

const fetchOtherRepoStars = async (knownMap) => {
  const map = { ...knownMap }
  const repos = githubProjects.value
    .map(project => parseRepoFromUrl(project.url))
    .filter(repo => repo && !Object.prototype.hasOwnProperty.call(map, repo.key))

  await Promise.all(repos.map(async repo => {
    try {
      const res = await fetchWithTimeout(`https://api.github.com/repos/${repo.owner}/${repo.repo}`)
      if (!res.ok) return
      const data = await res.json()
      map[repo.key] = data.stargazers_count || 0
    } catch (_) {}
  }))

  return map
}

const loadStars = async () => {
  const cached = readStarCache()
  if (cached) {
    const count = applyStars(cached)
    starStatus.value = 'cached'
    starMessage.value = `Stars 来自缓存，已匹配 ${count}/${githubProjects.value.length} 个仓库`
    return
  }

  starStatus.value = 'loading'
  starMessage.value = '正在从 GitHub API 获取 Stars'

  try {
    const userMap = await fetchUserRepoStars()
    const fullMap = await fetchOtherRepoStars(userMap)
    const count = applyStars(fullMap)
    writeStarCache(fullMap)
    starStatus.value = 'ready'
    starMessage.value = `Stars 已更新，匹配 ${count}/${githubProjects.value.length} 个仓库`
  } catch (error) {
    starStatus.value = 'error'
    starMessage.value = `Stars 获取失败：${error?.message || 'GitHub API 暂不可用'}`
  }
}

const onImgErr = (event) => {
  const img = event?.target
  if (!img) return
  if (img.getAttribute('src') !== defaultImg) img.src = defaultImg
}

onMounted(loadStars)
</script>

<template>
  <main class="projects-page">
    <section class="projects-hero">
      <div class="hero-copy">
        <p class="eyebrow">作品集</p>
        <h1>项目</h1>
        <p class="summary">整理我做过的开源项目、小工具和学习合集，方便快速查看代码、演示和相关资料。</p>
      </div>

      <div class="hero-stats" aria-label="项目统计">
        <div>
          <strong>{{ viewItems.length }}</strong>
          <span>项目</span>
        </div>
        <div>
          <strong>{{ githubProjects.length }}</strong>
          <span>仓库</span>
        </div>
        <div>
          <strong>{{ formatStars(totalStars) }}</strong>
          <span>Stars</span>
        </div>
      </div>
    </section>

    <section v-if="featuredProject" class="featured">
      <div class="featured-copy">
        <p class="eyebrow">精选项目</p>
        <h2>{{ featuredProject.title }}</h2>
        <p>{{ featuredProject.description }}</p>
        <div class="featured-actions">
          <a :href="featuredProject.url" class="btn primary" target="_blank" rel="noopener noreferrer">查看项目</a>
          <span class="star-pill">★ {{ formatStars(featuredProject.stars) }}</span>
        </div>
      </div>
      <a :href="featuredProject.url" class="featured-image" target="_blank" rel="noopener noreferrer">
        <img :src="featuredProject.image || defaultImg" :alt="featuredProject.title" @error="onImgErr" />
      </a>
    </section>

    <section class="controls" aria-label="项目筛选">
      <label class="search-box">
        <span>搜索</span>
        <input v-model="query" type="search" placeholder="项目名、描述或分类" />
      </label>

      <div class="category-list">
        <button
          v-for="category in categories"
          :key="category"
          class="category-button"
          :class="{ active: activeCategory === category }"
          type="button"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <div class="status-row">
      <span class="result-count">当前展示 {{ filteredItems.length }} 个项目</span>
      <span class="star-status" :class="starStatus">{{ starMessage }}<template v-if="loadedStars">（{{ loadedStars }} 个已显示）</template></span>
    </div>

    <section v-if="filteredItems.length" class="cards">
      <article v-for="project in filteredItems" :key="project.id" class="card">
        <a :href="project.url" class="image" target="_blank" rel="noopener noreferrer">
          <img
            :src="project.image || defaultImg"
            :alt="project.title"
            loading="lazy"
            decoding="async"
            @error="onImgErr"
          />
        </a>

        <div class="content">
          <div class="card-head">
            <h3 class="title">
              <a :href="project.url" target="_blank" rel="noopener noreferrer">{{ project.title }}</a>
            </h3>
            <span v-if="githubUrl(project)" class="star-pill">★ {{ formatStars(project.stars) }}</span>
          </div>

          <p class="sub">{{ project.subtitle }}</p>
          <p class="desc">{{ project.description }}</p>

          <div class="meta">
            <span v-for="category in project.category" :key="category" class="chip">{{ category }}</span>
          </div>

          <div class="actions">
            <a :href="project.url" class="btn primary" target="_blank" rel="noopener noreferrer">
              {{ githubUrl(project) ? '查看仓库' : '查看详情' }}
            </a>
            <a
              v-if="project.video_url"
              :href="project.video_url"
              class="btn secondary"
              target="_blank"
              rel="noopener noreferrer"
            >视频</a>
          </div>
        </div>
      </article>
    </section>

    <section v-else class="empty-state">
      <h2>没有匹配的项目</h2>
      <p>换个关键词或分类试试看。</p>
    </section>
  </main>
</template>

<style scoped>
.projects-page {
  width: min(1180px, calc(100% - 32px));
  margin: 20px auto 44px;
}

.projects-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.projects-hero h1,
.featured h2 {
  margin: 0;
  line-height: 1.15;
}

.projects-hero h1 {
  font-size: 40px;
}

.summary,
.featured-copy p,
.sub {
  color: var(--vp-c-text-2);
}

.summary {
  max-width: 580px;
  margin: 12px 0 0;
  line-height: 1.8;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 92px);
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

.featured {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 22px;
  align-items: stretch;
  margin-top: 24px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.featured-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}

.featured-copy p {
  margin: 12px 0 0;
  line-height: 1.8;
}

.featured-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.featured-image {
  display: block;
  overflow: hidden;
  min-height: 190px;
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  display: grid;
  grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  margin-top: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
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
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
}

.category-button:hover,
.category-button.active {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.star-status.error {
  color: var(--vp-c-danger-1);
}

.star-status.ready,
.star-status.cached {
  color: var(--vp-c-text-2);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease;
}

.card:hover {
  transform: translateY(-1px);
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg-soft);
}

.image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--vp-c-bg-mute);
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
}

.card-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  font-size: 18px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.title a:hover {
  color: var(--vp-c-brand-1);
}

.star-pill {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  min-height: 28px;
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 650;
}

.sub,
.desc {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  line-height: 1.65;
  -webkit-box-orient: vertical;
}

.sub {
  -webkit-line-clamp: 1;
}

.desc {
  color: var(--vp-c-text-1);
  -webkit-line-clamp: 3;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 5px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}

.btn:hover,
.btn.primary:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn.secondary {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.btn.secondary:hover {
  border-color: var(--vp-c-text-2);
  background: var(--vp-c-text-2);
  color: white;
}

.empty-state {
  padding: 42px 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.empty-state h2 {
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.empty-state p {
  margin: 0;
}

@media (max-width: 860px) {
  .projects-page {
    width: min(100% - 24px, 1180px);
  }

  .projects-hero,
  .status-row {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .featured {
    grid-template-columns: 1fr;
  }

  .featured-image {
    min-height: 160px;
  }

  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
