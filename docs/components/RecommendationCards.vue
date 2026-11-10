<script setup>
import { computed } from 'vue'
import { recommendationGroups } from './recommendations.js'

const props = defineProps({
  groups: { type: Array, default: () => ['sponsors', 'products', 'opensource'] },
  relayOnly: Boolean,
  hideHeading: Boolean,
})
const sections = computed(() => recommendationGroups
  .filter(group => props.groups.includes(group.id))
  .map(group => ({ ...group, items: props.relayOnly ? group.items.filter(item => item.kind === 'relay') : group.items })))
const imageSource = logo => logo.startsWith('/') ? logo : `/imgs/recommendations/${logo}`
</script>

<template>
  <div class="recommendations">
    <section v-for="section in sections" :key="section.id" class="recommendation-section" :class="`section-${section.id}`" :aria-label="section.title">
      <header v-if="!hideHeading" class="section-heading">
        <div><span class="section-label">{{ section.label }}</span><h2 :id="`recommendation-${section.id}`">{{ relayOnly ? '中转站推荐' : section.title }}</h2></div>
        <p>{{ section.description }}</p>
      </header>
      <div class="recommendation-grid">
        <a v-for="item in section.items" :key="item.name" :href="item.link" class="recommendation-card" :class="[{ featured: item.featured }, item.tone]" target="_blank" :rel="section.id === 'opensource' ? 'noopener noreferrer' : 'sponsored noopener noreferrer'">
          <div class="card-heading">
            <span class="brand-icon" :class="{ 'brand-wide': item.wide }">
              <img v-if="item.logo" class="no-zoom" :src="imageSource(item.logo)" alt="" :width="item.wide ? 80 : 44" height="44" loading="lazy" decoding="async" />
              <span v-else aria-hidden="true">{{ item.mark }}</span>
            </span>
            <span v-if="item.badge" class="card-badge">{{ item.badge }}</span>
            <span v-else class="card-category">{{ item.category }}</span>
          </div>
          <h3>{{ item.name }}</h3>
          <span v-if="item.badge" class="badge-category">{{ item.category }}</span>
          <p class="card-description">{{ item.description }}</p>
          <p v-if="item.note" class="card-note">{{ item.note }}</p>
          <div class="card-footer"><span class="card-tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></span><span class="card-cta">{{ item.cta }}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span></div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.recommendations { display: grid; gap: 44px; margin: 24px 0; }
.section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.section-label { color: var(--vp-c-text-2); font-size: 11px; letter-spacing: .12em; }
.section-heading h2 { border: 0; margin: 5px 0 0; padding: 0; font-size: 25px; line-height: 1.4; letter-spacing: -.6px; color: var(--vp-c-text-1); }
.section-heading p { text-indent: 0; margin: 0 0 3px; max-width: 370px; font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.recommendation-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.section-products .recommendation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.recommendation-card { --accent: #386296; --tint: #eff5fc; min-width: 0; display: flex; flex-direction: column; padding: 23px; color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 18px; background: var(--vp-c-bg); text-decoration: none; box-shadow: 0 3px 12px #13233b04; transition: border-color .2s, transform .2s, box-shadow .2s; }
.recommendation-card:hover { color: var(--vp-c-text-1); border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 10px 24px #13233b0a; }
.recommendation-card:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
.featured { --accent: #9d4b1b; --tint: #fff0df; border-color: #e6c9a7; background: linear-gradient(135deg, var(--vp-c-bg) 45%, var(--tint)); }
.violet { --accent: #7354a1; --tint: #f4eefc; }
.section-opensource .recommendation-card { --accent: #2b7460; --tint: #edf7f1; }
.card-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 44px; margin-bottom: 18px; }
.brand-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 12px; overflow: hidden; background: var(--tint); }
.brand-icon img { display: block; width: 44px; height: 44px; max-width: 100%; margin: 0; object-fit: contain; }
.brand-icon > span { font-size: 25px; font-weight: 750; color: var(--accent); }
.brand-wide { width: 80px; border-radius: 6px; background: #fff; }
.brand-wide img { width: 80px; }
.card-badge { color: var(--accent); background: var(--tint); border: 1px solid currentColor; border-radius: 20px; font-size: 11px; line-height: 1.5; padding: 3px 9px; white-space: nowrap; }
.card-category, .badge-category { font-size: 11px; line-height: 1.6; color: var(--vp-c-text-2); }
.badge-category { margin-top: 4px; }
.recommendation-card h3 { margin: 0; padding: 0; font-size: 20px; line-height: 1.4; letter-spacing: -.4px; font-weight: 650; }
.card-description { text-indent: 0; margin: 12px 0 20px; font-size: 14px; line-height: 1.85; color: var(--vp-c-text-2); }
.card-note { text-indent: 0; margin: -7px 0 20px; padding: 10px 12px; border-radius: 8px; background: var(--tint); color: var(--accent); font-size: 11px; line-height: 1.8; }
.card-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 15px; border-top: 1px solid var(--vp-c-divider); }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px; color: var(--vp-c-text-2); }
.card-tags span { padding: 2px 6px; border-radius: 4px; background: var(--vp-c-bg-soft); }
.card-cta { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--accent); white-space: nowrap; }
.card-cta svg { width: 15px; height: 15px; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.dark .recommendation-card { --accent: #a2c0ea; --tint: #253145; }
.dark .featured { --accent: #eeb889; --tint: #372a21; border-color: #70513b; }
.dark .violet { --accent: #cbb1ee; --tint: #30283f; }
.dark .section-opensource .recommendation-card { --accent: #91c9b1; --tint: #24382f; }
@media (max-width: 960px) { .recommendation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) {
  .recommendations { gap: 32px; }
  .section-heading { display: block; }
  .section-heading p { margin-top: 8px; }
  .recommendation-grid, .section-products .recommendation-grid { grid-template-columns: minmax(0, 1fr); }
  .recommendation-card { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) { .recommendation-card { transition: none; } .recommendation-card:hover { transform: none; } }
</style>
