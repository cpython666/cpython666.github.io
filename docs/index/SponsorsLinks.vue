<template>
  <div class="sponsors-section">
    <h2 class="section-title">赞助商</h2>
    <div class="grid-container sponsors-grid">
      <a
          v-for="(sponsor, index) in sponsors"
          :key="'sponsor-' + index"
          :href="sponsor.link"
          class="card"
          :class="{ 'card-relay': sponsor.description, 'card-featured': sponsor.featured }"
          rel="sponsored noopener noreferrer"
          target="_blank"
      >
        <div v-if="sponsor.description" class="relay-card">
          <div class="relay-heading">
            <img class="no-zoom" alt="" :src="sponsor.logo" loading="lazy" decoding="async"/>
            <div class="relay-brand">
              <span class="relay-eyebrow">AI 编程中转</span>
              <strong>{{ sponsor.name }}</strong>
            </div>
            <span v-if="sponsor.featured" class="relay-badge">优先推荐</span>
          </div>
          <p class="relay-description">{{ sponsor.description }}</p>
          <div class="relay-footer">
            <span class="relay-features">{{ sponsor.features }}</span>
            <span class="relay-cta">立即体验 <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
          </div>
        </div>
        <div v-else class="card-inner">
          <img class="no-zoom" :alt="sponsor.name" :src="sponsor.logo" loading="lazy" decoding="async"/>
        </div>
      </a>
    </div>

    <h2 class="section-title">友情链接</h2>
    <div class="grid-container">
      <a
          v-for="(link, index) in friends"
          :key="'friend-' + index"
          :href="link.link"
          class="card"
          rel="noopener noreferrer"
          target="_blank"
      >
        <div class="card-inner">
          <img class="no-zoom" :alt="link.name" :src="link.logo" loading="lazy" decoding="async"/>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
const sponsors = [
  {
    name: '莱卡云',
    logo: '/imgs/sponsors/lky_logo.png',
    link: 'https://www.lcayun.com/aff/DECEDOZS',
  },
  {
    name: '猿人学',
    logo: '/imgs/sponsors/yrx_logo.png',
    link: 'https://match.yuanrenxue.cn/',
  },
  {
    name: '青果网络',
    logo: '/imgs/sponsors/qgwl_logo.png',
    link: 'https://www.qg.net/product/proxyip.html?source=star',
  },
  {
    name: 'XFastAPI',
    logo: '/imgs/sponsors/xfastapi_logo.svg',
    description: 'Codex / Claude Code，轻松补充编程额度',
    features: '无需翻墙 · 低价额度 · 日常编程',
    link: 'https://xfastapi.ai/register?aff=8XQ944ESTPWY',
    featured: true,
  },
  {
    name: 'HeyRoute',
    logo: '/imgs/sponsors/heyroute_logo.png',
    description: '稳定、快速、低价的 AI 模型入口',
    features: '一个 API Key，接入 Codex、Claude Code',
    link: 'https://heyroute.ai/stardream',
  },
]

const friends = [
  {
    name: '星梦起航',
    logo: '/imgs/friends/stardream_logo.png',
    link: 'http://www.stardream.vip/',
  },
  {
    name: '爬虫百战成神',
    logo: '/imgs/friends/learnspider_logo.png',
    link: 'http://www.learnspider.vip/',
  },
]
</script>

<style scoped>
.sponsors-section {
  padding: 2rem max(1rem, calc((100% - 1120px) / 2));
  background-color: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 2rem 0 1rem;
  color: var(--vp-c-text-1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.sponsors-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.sponsors-grid .card {
  grid-column: span 2;
}

.sponsors-grid .card-relay {
  grid-column: span 3;
}

.card {
  min-width: 0;
  display: block;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
  outline-offset: 4px;
}

.card-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  aspect-ratio: 12 / 5;
  background-color: #fefefe;
}

.card-inner img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.card-relay {
  --relay-accent: #3459b3;
  --relay-soft: #eef3ff;
  background: linear-gradient(120deg, var(--vp-c-bg) 45%, var(--relay-soft));
}

.card-featured {
  --relay-accent: #a74613;
  --relay-soft: #fff1df;
  border-color: #e8c6a1;
}

.relay-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  padding: 24px;
}

.relay-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.relay-heading img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 12px;
}

.relay-brand {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.relay-eyebrow {
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.3;
}

.relay-brand strong {
  color: var(--vp-c-text-1);
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.relay-badge {
  margin-left: auto;
  padding: 5px 9px;
  border-radius: 6px;
  background: var(--relay-soft);
  color: var(--relay-accent);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.relay-description {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.relay-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.relay-features {
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.relay-cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--relay-accent);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.relay-cta svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dark .card-relay {
  --relay-accent: #a9c1ff;
  --relay-soft: #252f48;
}

.dark .card-featured {
  --relay-accent: #ffc18b;
  --relay-soft: #3b2b21;
  border-color: #725039;
}

@media (max-width: 640px) {
  .sponsors-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sponsors-grid .card {
    grid-column: span 1;
  }

  .sponsors-grid .card-relay {
    grid-column: 1 / -1;
  }

  .relay-card {
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover,
  .card:focus-visible {
    transform: none;
  }
}
</style>
