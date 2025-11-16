<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>项目</h1>
      <p class="subtitle">精选项目与工具合集</p>
    </header>

    <section class="cards">
      <article v-for="p in viewItems" :key="p.id" class="card">
        <a :href="p.url" class="image" target="_blank" rel="noopener noreferrer">
          <img
            :src="p.image || defaultImg"
            :alt="p.title"
            loading="lazy"
            decoding="async"
            @error="onImgErr"
          />
        </a>

        <div class="content">
          <div class="stats stats-top">
            <span class="stat" title="GitHub Stars">
              <span class="icon">⭐</span>
              {{ p.stars ?? '—' }}
            </span>
          </div>
          <h3 class="title">
            <a :href="p.url" target="_blank" rel="noopener noreferrer">{{ p.title }}</a>
          </h3>
          <p class="sub">{{ p.subtitle }}</p>
          <p class="desc">{{ p.description }}</p>

          <div class="meta">
            <span v-for="(c, i) in p.category" :key="i" class="chip">{{ c }}</span>
          </div>

          <div class="actions">
            <a :href="p.url" class="btn" target="_blank" rel="noopener noreferrer">查看仓库</a>
            <a
              v-if="p.video_url"
              :href="p.video_url"
              class="btn secondary"
              target="_blank"
              rel="noopener noreferrer"
            >视频</a>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projects, sortProjects } from './data.js'

// 排序后的项目数据
const items = sortProjects(projects)
// 展示用数据，附加 stars 字段
const viewItems = ref(items.map(p => ({ ...p, stars: null })))

// 你的 GitHub 用户名（批量拉取该用户仓库）
const GH_USER = 'cpython666'

// 从链接解析 GitHub 仓库 owner/repo
const parseRepoFromUrl = (url) => {
  try {
    const u = new URL(url)
    if (u.hostname !== 'github.com') return null
    const segs = u.pathname.split('/').filter(Boolean)
    if (segs.length < 2) return null
    return { owner: segs[0], repo: segs[1] }
  } catch (_) {
    return null
  }
}

// 缓存 stars，减少请求次数
const userRepoStars = ref(new Map())
const otherRepoStars = new Map()

async function fetchUserRepos() {
  try {
    const map = new Map()
    let page = 1
    const per = 100
    while (true) {
      const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=${per}&page=${page}`)
      if (!res.ok) break
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) break
      data.forEach(r => map.set(r.name.toLowerCase(), r.stargazers_count || 0))
      if (data.length < per) break
      page += 1
      if (page > 10) break // 安全上限，避免异常循环
    }
    userRepoStars.value = map
  } catch (_) {}
}

async function fetchRepoStars(owner, repo) {
  const key = `${owner}/${repo}`.toLowerCase()
  if (otherRepoStars.has(key)) return otherRepoStars.get(key)
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    if (!res.ok) { otherRepoStars.set(key, 0); return 0 }
    const j = await res.json()
    const stars = j.stargazers_count || 0
    otherRepoStars.set(key, stars)
    return stars
  } catch (_) {
    otherRepoStars.set(key, 0)
    return 0
  }
}

async function updateStars() {
  for (const p of viewItems.value) {
    const info = parseRepoFromUrl(p.url)
    if (!info) continue
    const { owner, repo } = info
    let stars = 0
    if (owner.toLowerCase() === GH_USER.toLowerCase()) {
      stars = userRepoStars.value.get(repo.toLowerCase()) ?? 0
    } else {
      stars = await fetchRepoStars(owner, repo)
    }
    p.stars = stars
  }
}

onMounted(async () => {
  await fetchUserRepos()
  await updateStars()
})

const defaultImg = '/imgs/app/default.svg'
const onImgErr = (e) => {
  try {
    const img = e?.target
    if (img && img.src !== location.origin + defaultImg && img.src !== defaultImg) {
      img.src = defaultImg
    }
  } catch (_) {}
}
</script>

<style scoped>
.projects-page {
  display: grid;
  gap: 16px;
  width: 100%;
  max-width: 1120px;
  margin: 16px auto;
  padding: 0 12px;
}

.page-header {
  display: grid;
  gap: 6px;
}

.page-header h1 {
  font-size: 24px;
  margin: 0;
}

.page-header .subtitle {
  color: var(--vp-c-text-2);
  margin: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.card:hover {
  border-color: color-mix(in oklab, var(--vp-c-brand-1) 35%, var(--vp-c-divider));
  box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
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
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
  position: relative;
}

.title {
  margin: 0;
  font-size: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.title a:hover {
  color: var(--vp-c-brand-1);
}

.sub {
  margin: 0;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.desc {
  margin: 0;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-size: 12px;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.stats {
  display: flex;
  gap: 8px;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}
.stat .icon { font-size: 14px; }

.stats-top {
  position: absolute;
  top: 14px;
  right: 16px;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 500;
  transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease;
}

.btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-1px);
}

.btn.secondary {
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-2);
  background: transparent;
}

.btn.secondary:hover {
  background: var(--vp-c-text-2);
  color: white;
}
</style>