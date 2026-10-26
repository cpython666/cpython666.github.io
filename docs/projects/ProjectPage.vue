<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { projects, sortProjects } from './data.js'

const GH_USER = 'cpython666'
const CACHE_KEY = 'stardream:github-stars:v1'
const CACHE_TTL = 6 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 8000

const defaultImg = '/imgs/app/default.svg'
const query = ref('')
const activeCategory = ref('全部')
const controls = ref(null)
const resultsStart = ref(null)
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

const selectCategory = async (category) => {
  if (activeCategory.value === category) return
  activeCategory.value = category
  await nextTick()
  const offset = parseFloat(getComputedStyle(controls.value).top) + controls.value.offsetHeight + 16
  window.scrollTo({
    top: window.scrollY + resultsStart.value.getBoundingClientRect().top - offset,
    behavior: 'instant',
  })
}

const featuredIndex = ref(0)
const autoplay = ref(true)
const hovered = ref(false)
const focused = ref(false)
const pageHidden = ref(true)
const reducedMotion = ref(true)
let carouselTimer
let motionPreference

const featuredProjects = computed(() => {
  const seen = new Set()
  const unique = githubProjects.value.filter(project => {
    const key = parseRepoFromUrl(project.url).key
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const ranked = unique.filter(project => Number.isFinite(project.stars))
  // ponytail: reuse the existing Stars cache; no separate ranking request.
  return (ranked.length ? ranked.sort((a, b) => b.stars - a.stars) : unique).slice(0, 5)
})
const featuredProject = computed(() => featuredProjects.value[featuredIndex.value])
const rotationRunning = computed(() => autoplay.value && !hovered.value && !focused.value &&
  !pageHidden.value && !reducedMotion.value && featuredProjects.value.length > 1)

const selectFeatured = (index) => {
  const count = featuredProjects.value.length
  if (count) featuredIndex.value = (index + count) % count
}
const updateVisibility = () => { pageHidden.value = document.hidden }
const updateMotionPreference = () => { reducedMotion.value = motionPreference.matches }
const onFeaturedFocusOut = (event) => {
  focused.value = event.currentTarget.contains(event.relatedTarget)
}

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

watch(featuredProjects, () => { featuredIndex.value = 0 })
watch([rotationRunning, featuredIndex], () => {
  clearInterval(carouselTimer)
  if (rotationRunning.value) {
    carouselTimer = setInterval(() => selectFeatured(featuredIndex.value + 1), 6000)
  }
})

const formatStars = (value) => {
  if (!Number.isFinite(value)) return '—'
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  return String(value)
}

const isStarCount = (value) => Number.isSafeInteger(value) && value >= 0

const readStarCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (!cache?.stars || typeof cache.stars !== 'object' || Array.isArray(cache.stars)) return null
    const stars = Object.fromEntries(Object.entries(cache.stars).filter(([, value]) => isStarCount(value)))
    if (!Object.keys(stars).length) return null
    const time = Number.isFinite(cache.time) && cache.time > 0 && cache.time <= Date.now() ? cache.time : 0
    return { time, stars }
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
    if (!Array.isArray(data)) throw new Error('GitHub API 返回格式异常')
    if (!data.length) break

    data.forEach(repo => {
      if (typeof repo?.full_name === 'string' && isStarCount(repo.stargazers_count)) {
        map[repo.full_name.toLowerCase()] = repo.stargazers_count
      }
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

  const uniqueRepos = [...new Map(repos.map(repo => [repo.key, repo])).values()]
  await Promise.all(uniqueRepos.map(async repo => {
    try {
      const res = await fetchWithTimeout(`https://api.github.com/repos/${repo.owner}/${repo.repo}`)
      if (!res.ok) return
      const data = await res.json()
      if (isStarCount(data?.stargazers_count)) map[repo.key] = data.stargazers_count
    } catch (_) {}
  }))

  return map
}

const loadStars = async () => {
  const cached = readStarCache()
  const cachedCount = applyStars(cached?.stars)
  if (cachedCount) {
    starStatus.value = 'cached'
    starMessage.value = `Stars 来自缓存，已匹配 ${cachedCount}/${githubProjects.value.length} 个仓库`
    if (Date.now() - cached.time < CACHE_TTL) return
    starMessage.value = 'Stars 已显示缓存，正在后台更新'
  } else {
    starStatus.value = 'loading'
    starMessage.value = '正在从 GitHub API 获取 Stars'
  }

  try {
    const userMap = await fetchUserRepoStars()
    const fetchedMap = await fetchOtherRepoStars(userMap)
    if (!Object.keys(fetchedMap).length) throw new Error('GitHub API 未返回有效 Stars')
    const fullMap = { ...cached?.stars, ...fetchedMap }
    const count = applyStars(fullMap)
    writeStarCache(fullMap)
    starStatus.value = 'ready'
    starMessage.value = `Stars 已更新，匹配 ${count}/${githubProjects.value.length} 个仓库`
  } catch (error) {
    starStatus.value = cachedCount ? 'cached' : 'error'
    starMessage.value = cachedCount
      ? 'Stars 暂未更新，继续显示缓存，稍后访问时重试'
      : `Stars 获取失败：${error?.message || 'GitHub API 暂不可用'}`
  }
}

const onImgErr = (event) => {
  const img = event?.target
  if (!img) return
  if (img.getAttribute('src') !== defaultImg) img.src = defaultImg
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference()
  updateVisibility()
  motionPreference.addEventListener('change', updateMotionPreference)
  document.addEventListener('visibilitychange', updateVisibility)
  loadStars()
})
onBeforeUnmount(() => {
  clearInterval(carouselTimer)
  motionPreference?.removeEventListener('change', updateMotionPreference)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <main class="projects-page">
    <h1 class="sr-only">项目</h1>

    <section
      v-if="featuredProject"
      class="featured"
      aria-label="热门项目轮播"
      aria-roledescription="轮播"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @focusin="focused = true"
      @focusout="onFeaturedFocusOut"
      @keydown.left.prevent="selectFeatured(featuredIndex - 1)"
      @keydown.right.prevent="selectFeatured(featuredIndex + 1)"
    >
      <div class="featured-copy" :aria-live="rotationRunning ? 'off' : 'polite'" aria-atomic="true">
        <div class="featured-label">
          <span>{{ loadedStars ? '热门项目 · 按 Stars 排序' : '精选项目' }}</span>
          <span>{{ featuredIndex + 1 }} / {{ featuredProjects.length }}</span>
        </div>
        <h2>{{ featuredProject.title }}</h2>
        <p>{{ featuredProject.description }}</p>
        <div class="featured-actions">
          <a :href="featuredProject.url" class="btn primary" target="_blank" rel="noopener noreferrer">查看项目</a>
          <span class="star-pill">★ {{ formatStars(featuredProject.stars) }}</span>
        </div>
      </div>
      <a :href="featuredProject.url" class="featured-image" target="_blank" rel="noopener noreferrer">
        <img :key="featuredProject.id" class="no-zoom" :src="featuredProject.image || defaultImg" :alt="featuredProject.title" @error="onImgErr" />
      </a>
      <div v-if="featuredProjects.length > 1" class="carousel-controls">
        <div class="carousel-dots" aria-label="选择展示项目">
          <button
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            type="button"
            class="carousel-dot"
            :class="{ active: index === featuredIndex }"
            :aria-label="`查看项目：${project.title}`"
            :aria-current="index === featuredIndex ? 'true' : undefined"
            @click="selectFeatured(index)"
          ><span /></button>
        </div>
        <div class="carousel-actions">
          <button type="button" class="carousel-button" aria-label="上一个项目" @click="selectFeatured(featuredIndex - 1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button
            v-if="!reducedMotion"
            type="button"
            class="carousel-button"
            :aria-label="autoplay ? '暂停自动轮播' : '开启自动轮播'"
            @click="autoplay = !autoplay"
          >
            <svg v-if="autoplay" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>
          </button>
          <button type="button" class="carousel-button" aria-label="下一个项目" @click="selectFeatured(featuredIndex + 1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>

    <section ref="controls" class="controls" aria-label="项目筛选">
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
          :aria-pressed="activeCategory === category"
          type="button"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <div ref="resultsStart" class="status-row">
      <div class="project-stats" aria-label="项目统计">
        <span class="result-count">当前展示 {{ filteredItems.length }} / {{ viewItems.length }} 个项目</span>
        <span>{{ githubProjects.length }} 个仓库</span>
        <span>{{ formatStars(totalStars) }} Stars</span>
      </div>
      <span class="star-status" :class="starStatus">{{ starMessage }}<template v-if="loadedStars">（{{ loadedStars }} 个已显示）</template></span>
    </div>

    <section v-if="filteredItems.length" class="cards">
      <article v-for="project in filteredItems" :key="project.id" class="card">
        <a :href="project.url" class="image" target="_blank" rel="noopener noreferrer">
          <img
            class="no-zoom"
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

.featured h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 22px;
  line-height: 1.15;
  min-height: 2.3em;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.featured-copy p,
.sub {
  color: var(--vp-c-text-2);
}

.featured {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 22px;
  align-items: stretch;
  margin: 0;
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
  overflow-wrap: anywhere;
}

.featured-copy p {
  margin: 12px 0 0;
  line-height: 1.8;
  min-height: 5.4em;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.featured-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.featured-label span:first-child {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.carousel-controls,
.carousel-dots,
.carousel-actions {
  display: flex;
  align-items: center;
}

.carousel-controls {
  grid-column: 1 / -1;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

.carousel-actions {
  gap: 4px;
}

.carousel-button,
.carousel-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 36px;
  cursor: pointer;
}

.carousel-button {
  width: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.carousel-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.carousel-dot {
  width: 24px;
}

.carousel-dot span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--vp-c-text-3);
  transition: width 0.2s ease, background 0.2s ease;
}

.carousel-dot.active span {
  width: 18px;
  background: var(--vp-c-brand-1);
}

.carousel-button:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.carousel-button:focus-visible,
.carousel-dot:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.featured-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.featured-image {
  position: relative;
  display: block;
  align-self: center;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
}

.featured-image img,
.image img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.controls {
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  margin-top: 24px;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
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

.project-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr;
  min-width: 0;
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
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--vp-c-bg-mute);
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
  overflow-wrap: anywhere;
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

@media (max-width: 959px) {
  .controls {
    top: 0;
  }
}

@media (max-width: 860px) {
  .projects-page {
    width: min(100% - 24px, 1180px);
  }

  .status-row {
    align-items: stretch;
    flex-direction: column;
  }

  .featured {
    grid-template-columns: 1fr;
  }

  .controls {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-dot span {
    transition: none;
  }
}
</style>
