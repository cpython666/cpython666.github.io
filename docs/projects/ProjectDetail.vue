<script setup>
defineProps({
  title: { type: String, required: true },
  english: { type: String, default: '' },
  eyebrow: { type: String, default: '开源项目' },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  imageWidth: { type: [Number, String], default: 1200 },
  imageHeight: { type: [Number, String], default: 820 },
  imageCaption: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  facts: { type: Array, default: () => [] },
  github: { type: String, required: true },
  quickStart: { type: String, default: '' },
})
</script>

<template>
  <main class="project-detail">
    <nav class="breadcrumb" aria-label="面包屑">
      <a href="/projects/">项目</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ title }}</span>
    </nav>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>
          {{ title }}
          <span v-if="english" class="repo">{{ english }}</span>
        </h1>
        <p v-if="tagline" class="tagline">{{ tagline }}</p>
        <p class="lede">{{ description }}</p>

        <div class="hero-actions">
          <a class="btn primary" :href="github" target="_blank" rel="noopener noreferrer">
            查看 GitHub
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
          </a>
          <a class="btn secondary" v-if="quickStart" :href="quickStart">快速开始</a>
        </div>

        <ul v-if="tags.length" class="tags" aria-label="项目特点">
          <li v-for="tag in tags" :key="tag">{{ tag }}</li>
        </ul>
      </div>

      <figure class="hero-media">
        <img
          :src="image"
          :alt="imageAlt || title"
          :width="imageWidth"
          :height="imageHeight"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
        <figcaption v-if="imageCaption">{{ imageCaption }}</figcaption>
      </figure>
    </section>

    <dl v-if="facts.length" class="facts">
      <div v-for="fact in facts" :key="fact.label">
        <dt>{{ fact.label }}</dt>
        <dd>{{ fact.value }}</dd>
      </div>
    </dl>

    <div class="project-body vp-doc">
      <slot />
    </div>

    <section class="closing" aria-label="项目入口">
      <div>
        <p class="closing-kicker">开源项目</p>
        <h2>喜欢这页纸，就去 GitHub 点个 Star。</h2>
        <p>问题、建议或想要的功能，欢迎在仓库里提 Issue。</p>
      </div>
      <a class="btn primary" :href="github" target="_blank" rel="noopener noreferrer">
        打开 GitHub
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
      </a>
    </section>
  </main>
</template>

<style scoped>
.project-detail {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto 48px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.breadcrumb a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumb a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
  border-radius: 4px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.94fr);
  gap: 40px;
  align-items: center;
  margin-top: 16px;
  padding: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background:
    radial-gradient(circle at 8% 0%, var(--vp-c-brand-soft), transparent 42%),
    var(--vp-c-bg-soft);
}

.hero-copy {
  min-width: 0;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.hero h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.repo {
  display: inline-block;
  margin-left: 10px;
  color: var(--vp-c-text-3);
  font-size: 0.32em;
  font-weight: 600;
  letter-spacing: 0.01em;
  vertical-align: middle;
}

.tagline {
  margin: 14px 0 0;
  color: var(--vp-c-text-1);
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-weight: 600;
  line-height: 1.6;
}

.lede {
  max-width: 56ch;
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease, filter 0.16s ease;
}

.btn svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.btn.primary:hover {
  filter: brightness(1.08);
}

.btn.secondary {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.2;
}

.hero-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  margin: 0;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  box-shadow: 0 14px 34px rgb(0 0 0 / 8%);
}

.hero-media img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 380px;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
}

.hero-media figcaption {
  width: 100%;
  margin: 10px 2px 2px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}

.facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 16px 0 0;
  padding: 18px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.facts > div {
  min-width: 0;
  padding: 0 18px;
  border-left: 1px solid var(--vp-c-divider);
}

.facts > div:first-child {
  padding-left: 4px;
  border-left: 0;
}

.facts dt {
  margin: 0 0 5px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.facts dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.project-body {
  width: min(100%, 860px);
  margin: 40px auto 0;
}

.project-body :deep(h2) {
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 16px);
}

.project-body :deep(h3) {
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 16px);
}

.project-body :deep(img) {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.project-body :deep(.project-figure) {
  margin: 24px 0;
}

.project-body :deep(.project-figure figcaption) {
  margin-top: 9px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.project-body :deep(.project-figure--paper) {
  max-width: 520px;
  margin: 28px auto;
}

.project-body :deep(.feature-grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 28px;
}

.project-body :deep(.feature-card) {
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.project-body :deep(.feature-card h3) {
  margin: 0 0 6px;
  padding-top: 0;
  border-top: 0;
  font-size: 15px;
  line-height: 1.5;
}

.project-body :deep(.feature-card p) {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.project-body :deep(.quick-note) {
  margin: 20px 0;
  padding: 14px 16px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 8px 8px 0;
  background: var(--vp-c-brand-soft);
  font-size: 14px;
  line-height: 1.75;
}

.project-body :deep(.quick-note p) {
  margin: 0;
}

.closing {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(100%, 860px);
  margin: 48px auto 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.closing-kicker {
  margin: 0 0 4px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.closing h2 {
  margin: 0 0 6px;
  padding: 0;
  border: 0;
  font-size: 20px;
  line-height: 1.5;
}

.closing p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 26px;
    padding: 26px;
  }

  .hero-media {
    max-width: 680px;
  }
}

@media (max-width: 760px) {
  .project-detail {
    width: min(100% - 24px, 1180px);
  }

  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 0;
  }

  .facts > div {
    padding: 0 12px;
  }

  .facts > div:nth-child(odd) {
    padding-left: 4px;
    border-left: 0;
  }

  .project-body {
    margin-top: 32px;
  }

  .project-body :deep(.feature-grid) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 639px) {
  .project-body :deep(div[class*='language-']) {
    margin-right: 0;
    margin-left: 0;
    border-radius: 8px;
  }

  .project-body :deep(.vp-code-group .tabs) {
    margin-right: 0;
    margin-left: 0;
    border-radius: 8px 8px 0 0;
  }

  .project-body :deep(.vp-code-group div[class*='language-']) {
    border-radius: 0 0 8px 8px;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 20px 16px;
    border-radius: 12px;
  }

  .repo {
    display: block;
    margin: 8px 0 0;
    font-size: 0.38em;
  }

  .hero-media img {
    max-height: 300px;
  }

  .hero-actions .btn {
    flex: 1 1 auto;
  }

  .closing {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 16px;
  }
}
</style>
