<template>
  <div class="sponsors-section">
    <h2 class="section-title">赞助商</h2>
    <div class="grid-container">
      <a
          v-for="(sponsor, index) in sponsors"
          :key="'sponsor-' + index"
          :href="sponsor.link"
          class="card"
          rel="sponsored noopener noreferrer"
          target="_blank"
      >
        <div class="card-inner" :class="{ 'card-brand': sponsor.description }">
          <img class="no-zoom" :alt="sponsor.description ? '' : sponsor.name" :src="sponsor.logo" loading="lazy" decoding="async"/>
          <div v-if="sponsor.description" class="brand-copy">
            <strong>{{ sponsor.name }}</strong>
            <span>{{ sponsor.description }}</span>
            <small v-if="sponsor.features">{{ sponsor.features }}</small>
          </div>
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
          <img :alt="link.name" :src="link.logo" loading="lazy" decoding="async"/>
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
  padding: 2rem 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 2rem 0 1rem;
  color: #333;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  display: block;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
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

.card-brand {
  display: grid;
  grid-template-columns: 32px auto;
  align-content: center;
  gap: 6px 10px;
  aspect-ratio: auto;
  height: 100%;
  min-height: 132px;
  padding: 12px;
  text-align: center;
  color: #1f2937;
}

.card-brand img {
  width: 32px;
  border-radius: 8px;
}

.brand-copy {
  display: contents;
}

.brand-copy strong {
  justify-self: start;
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.2;
}

.brand-copy span {
  grid-column: 1 / -1;
  font-size: 12px;
  line-height: 1.4;
  color: #334155;
}

.brand-copy small {
  grid-column: 1 / -1;
  font-size: 11px;
  line-height: 1.4;
  color: #64748b;
}
</style>
