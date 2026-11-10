<script setup>
import { computed } from 'vue'
import RecommendationVisual from './RecommendationVisual.vue'
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
          <div v-if="item.visual" class="card-cover">
            <RecommendationVisual :variant="item.visual" />
            <span v-if="item.badge" class="card-badge">{{ item.badge }}</span>
          </div>
          <div class="card-content">
            <div class="card-heading">
              <span v-if="section.id === 'sponsors'" class="sponsor-mark" aria-hidden="true">{{ item.mark }}</span>
              <img v-else-if="item.logo" class="brand-icon no-zoom" :src="imageSource(item.logo)" alt="" width="28" height="28" loading="lazy" decoding="async" />
              <span v-else class="brand-letter" aria-hidden="true">{{ item.mark }}</span>
              <h3>{{ item.name }}</h3>
              <span v-if="section.id === 'sponsors'" class="sponsor-arrow" aria-hidden="true">↗</span>
            </div>
            <span class="card-category">{{ item.category }}</span>
            <p class="card-description">{{ item.description }}</p>
            <div class="card-footer"><span class="card-tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></span><span class="card-cta">{{ item.cta }}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span></div>
          </div>
        </a>
      </div>
      <p v-for="item in section.items.filter(item => item.note)" :key="item.name" class="referral-note">{{ item.name }} 邀请说明：{{ item.note }}</p>
    </section>
  </div>
</template>

<style scoped>
.recommendations { container-type: inline-size; display: grid; gap: 40px; margin: 8px 0 24px; }
.section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 18px; }
.section-label { color: var(--vp-c-text-2); font-size: 11px; letter-spacing: .12em; }
.section-heading h2 { scroll-margin-top: 88px; border: 0; margin: 4px 0 0; padding: 0; font-size: 25px; line-height: 1.4; letter-spacing: -.6px; color: var(--vp-c-text-1); }
.section-heading p { text-indent: 0; margin: 0 0 3px; max-width: 370px; font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.recommendation-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.section-products .recommendation-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.recommendation-card { --accent: #43668d; --tint: #edf2f8; min-width: 0; display: flex; flex-direction: column; overflow: hidden; color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg); text-decoration: none; box-shadow: 0 2px 5px #15243903; transition: transform .2s, box-shadow .2s, border-color .2s; }
.recommendation-card:hover { color: var(--vp-c-text-1); transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 12px 24px #1524390d; }
.recommendation-card:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
.featured { --accent: #9d552b; --tint: #fcf1e5; border-color: #dec6ab; }
.violet { --accent: #77558e; --tint: #f4eef8; }
.section-opensource .recommendation-card { --accent: #3c7965; --tint: #edf5f1; }
.card-cover { position: relative; }
.card-badge { position: absolute; z-index: 2; top: 12px; right: 12px; color: var(--accent); background: #fffef7f2; box-shadow: 0 2px 6px #00000005; border: 1px solid #ffffffc0; border-radius: 5px; font-size: 10px; line-height: 1.5; padding: 4px 7px; white-space: nowrap; }
.card-content { display: flex; flex: 1; flex-direction: column; padding: 20px; }
.card-heading { display: flex; align-items: center; gap: 9px; min-height: 28px; }
.brand-icon, .brand-letter { width: 28px; height: 28px; flex-shrink: 0; border-radius: 7px; object-fit: contain; margin: 0; }
.brand-letter { display: inline-flex; align-items: center; justify-content: center; background: var(--tint); font-size: 16px; font-weight: 700; color: var(--accent); }
.recommendation-card h3 { margin: 0; padding: 0; color: var(--vp-c-text-1); font-size: 19px; line-height: 1.4; letter-spacing: -.5px; font-weight: 650; }
.card-category { margin-top: 6px; font-size: 11px; line-height: 1.6; color: var(--vp-c-text-2); }
.card-description { text-indent: 0; margin: 10px 0 18px; font-size: 14px; line-height: 1.8; color: var(--vp-c-text-2); }
.card-footer { display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 13px; border-top: 1px solid var(--vp-c-divider); }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; color: var(--vp-c-text-2); font-size: 11px; line-height: 1.6; }
.card-tags span + span::before { content: '·'; margin-right: 6px; opacity: .5; }
.card-cta { display: inline-flex; align-items: center; gap: 5px; color: var(--accent); font-size: 12px; font-weight: 600; white-space: nowrap; }
.card-cta svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.referral-note { text-indent: 0; margin: 12px 0 0; padding: 0; font-size: 11px; line-height: 1.8; color: var(--vp-c-text-2); }
.section-sponsors .card-content { padding: 18px 20px; }
.sponsor-mark { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; flex-shrink: 0; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 7px; color: var(--vp-c-text-2); font: 600 12px/1 var(--vp-font-family-base); }
.sponsor-arrow { margin-left: auto; color: var(--vp-c-text-3); font-size: 17px; }
.section-sponsors .card-category { display: none; }
.section-sponsors .card-description { margin: 10px 0 0; font-size: 12px; line-height: 1.7; }
.section-sponsors .card-footer { display: none; }
.dark .recommendation-card { --accent: #a6bedb; --tint: #283345; }
.dark .featured { --accent: #e6b38e; --tint: #392c22; border-color: #71533e; }
.dark .violet { --accent: #cbb1df; --tint: #342b3e; }
.dark .section-opensource .recommendation-card { --accent: #a0cabb; --tint: #283b32; }
/* The covers keep their illustration palette in both themes, like a product screenshot. */
.dark .card-badge { color: #70502d; }
.dark .violet .card-badge { color: #77558e; }
@container (max-width: 1100px) { .section-products .recommendation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (max-width: 820px) { .recommendation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (max-width: 540px) {
  .section-heading { display: block; }
  .section-heading p { margin-top: 7px; }
  .recommendation-grid, .section-products .recommendation-grid { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .section-sponsors .recommendation-grid { gap: 10px; }
  .section-sponsors .card-content { padding: 14px 16px; }
  .section-heading h2 { font-size: 23px; }
}
@media (prefers-reduced-motion: reduce) { .recommendation-card { transition: none; } .recommendation-card:hover { transform: none; } }
</style>
