<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>项目</h1>
      <p class="subtitle">精选项目与工具合集</p>
    </header>

    <section class="cards">
      <article v-for="p in items" :key="p.id" class="card">
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
import { projects, sortProjects } from './data.js'

const items = sortProjects(projects)

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