<script setup>
import RecommendationCards from '../components/RecommendationCards.vue'

const friends = [
  { name: '星梦起航', link: 'http://www.stardream.vip/' },
  { name: '爬虫百战成神', link: 'http://www.learnspider.vip/' },
]
</script>

<template>
  <div class="sponsors-section">
    <div class="sponsors-content">
      <RecommendationCards />
      <div class="friend-links" aria-label="友情链接">
        <span>友情链接</span>
        <a v-for="friend in friends" :key="friend.link" :href="friend.link" target="_blank" rel="noopener noreferrer">{{ friend.name }} <span aria-hidden="true">↗</span></a>
        <a class="all-recommendations" href="/web-intro/">关于站长与推荐 <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sponsors-section { width: 100%; padding: 32px 24px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-alt); }
.sponsors-content { max-width: 1120px; margin: 0 auto; }
.friend-links { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 20px; margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); font-size: 12px; color: var(--vp-c-text-2); }
.friend-links a { color: var(--vp-c-text-1); }
.friend-links a:hover { color: var(--vp-c-brand-1); }
.friend-links a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; border-radius: 2px; }
.all-recommendations { margin-left: auto; }
@media (max-width: 640px) { .sponsors-section { padding: 24px 20px; } .all-recommendations { margin-left: 0; } }
</style>
