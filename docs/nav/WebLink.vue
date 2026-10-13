<script setup>
defineProps({ items: { type: Array, required: true } })
const fallbackIcon = '/icons/github.svg'
const onIconError = (event) => {
  const img = event.target
  if (img.getAttribute('src') !== fallbackIcon) img.src = fallbackIcon
}
</script>

<template>
  <div class="sites">
    <article v-for="site in items" :key="site.key" class="site">
      <a :href="site.link" class="site-link" target="_blank" rel="noopener noreferrer" :title="site.desc">
        <div class="card-head">
          <img :src="site.icon || fallbackIcon" alt="" class="site-icon" width="36" height="36" loading="lazy" decoding="async" @error="onIconError" />
          <div class="card-title"><h3>{{ site.title }}</h3><span>{{ site.section }}</span></div>
          <span class="external-mark" aria-hidden="true">↗</span>
        </div>
        <p class="desc">{{ site.desc }}</p>
      </a>
      <div v-if="site.categories?.length || site.doc_link" class="site-meta">
        <span v-for="tag in site.categories" :key="tag" class="badge">{{ tag }}</span>
        <a v-if="site.doc_link" :href="site.doc_link" class="doc-link" target="_blank" rel="noopener noreferrer">文档 ↗</a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.sites { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 16px; }
.site { display: flex; flex-direction: column; min-width: 0; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); }
.site:hover { border-color: var(--vp-c-brand-2); background: var(--vp-c-bg-soft); }
.site-link { display: block; color: inherit; text-decoration: none; }
.card-head { display: flex; align-items: center; gap: 12px; }
.site-icon { flex: none; width: 36px; height: 36px; object-fit: contain; border-radius: 8px; background: var(--vp-c-bg-soft); }
.card-title { flex: 1; min-width: 0; }
.card-title h3 { overflow: hidden; margin: 0; color: var(--vp-c-text-1); font-size: 15px; font-weight: 600; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.card-title span { color: var(--vp-c-text-3); font-size: 11px; }
.external-mark { color: var(--vp-c-text-3); font-size: 18px; }
.desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; min-height: 5.1em; margin: 14px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.7; text-indent: 0; overflow-wrap: anywhere; }
.site-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 14px; }
.badge { max-width: 100%; padding: 3px 7px; border-radius: 5px; background: var(--vp-c-default-soft); color: var(--vp-c-text-2); font-size: 11px; line-height: 1.4; overflow-wrap: anywhere; }
.doc-link { margin-left: auto; color: var(--vp-c-brand-1); font-size: 12px; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; border-radius: 4px; }
</style>
