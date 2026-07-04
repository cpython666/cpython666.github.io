<script setup>
import { computed, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  archive: {
    type: Object,
    required: true,
  },
})

const selectedId = ref(props.archive.posts?.[0]?.id || '')

const posts = computed(() => props.archive.posts || [])
const selectedSummary = computed(() => posts.value.find((post) => post.id === selectedId.value) || posts.value[0])
const detailCache = ref({})
const loadingDetail = ref(false)
const detailError = ref('')
const selectedPost = computed(() => {
  if (!selectedSummary.value) return null
  return detailCache.value[selectedSummary.value.id] || selectedSummary.value
})
const selectedIndex = computed(() => {
  const index = posts.value.findIndex((post) => post.id === selectedSummary.value?.id)
  return index >= 0 ? index + 1 : 0
})
const totalComments = computed(() => posts.value.reduce((total, post) => total + (post.commentCount ?? post.comments?.length ?? 0), 0))

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const mediaUrl = (image) => {
  if (image.publicPath) return withBase(image.publicPath)
  return image.url
}

const textBlocks = (value = '') => String(value)
  .split(/\n{2,}/)
  .map((block) => block.trim())
  .filter(Boolean)

const postText = (post) => post?.text || post?.excerpt || ''
const postCommentCount = (post) => post?.commentCount ?? post?.comments?.length ?? 0
const postImageCount = (post) => post?.imageCount ?? post?.images?.length ?? 0

const loadPostDetail = async (summary) => {
  if (!summary?.id || detailCache.value[summary.id] || !summary.detailPath) return
  loadingDetail.value = true
  detailError.value = ''

  try {
    const response = await fetch(withBase(`/backups/x/${props.archive.source?.handle}/posts/${summary.id}.json`))
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    const detail = await response.json()
    detailCache.value = {
      ...detailCache.value,
      [summary.id]: detail,
    }
  } catch (error) {
    detailError.value = `详情加载失败：${error.message}`
  } finally {
    loadingDetail.value = false
  }
}

watch(selectedSummary, (summary) => {
  loadPostDetail(summary)
}, { immediate: true })
</script>

<template>
  <div class="x-backup">
    <div class="x-backup__summary">
      <div>
        <p class="x-backup__eyebrow">X Archive</p>
        <h2>@{{ archive.source?.handle }}</h2>
      </div>
      <dl>
        <div>
          <dt>帖子</dt>
          <dd>{{ posts.length }}</dd>
        </div>
        <div>
          <dt>评论</dt>
          <dd>{{ totalComments }}</dd>
        </div>
        <div>
          <dt>当前</dt>
          <dd>{{ selectedIndex }}/{{ posts.length }}</dd>
        </div>
      </dl>
    </div>

    <p v-if="!posts.length" class="x-backup__empty">
      还没有归档内容。运行采集命令后，这里会自动展示帖子、图片和可见评论流。
    </p>

    <div v-else class="x-backup__reader">
      <aside class="x-backup__list" aria-label="备份帖子列表">
        <button
          v-for="post in posts"
          :key="post.id"
          type="button"
          class="x-backup__item"
          :class="{ 'x-backup__item--active': post.id === selectedPost?.id }"
          @click="selectedId = post.id"
        >
          <span class="x-backup__date">{{ formatDate(post.createdAt) }}</span>
          <span class="x-backup__excerpt">{{ post.text }}</span>
          <span class="x-backup__meta">
            <span>{{ postCommentCount(post) }} 条评论</span>
            <span v-if="postImageCount(post)">{{ postImageCount(post) }} 张图</span>
          </span>
        </button>
      </aside>

      <article v-if="selectedPost" class="x-backup__detail">
        <header class="x-backup__header">
          <p class="x-backup__eyebrow">Archived Post</p>
          <a class="x-backup__source" :href="selectedPost.url" target="_blank" rel="noreferrer">查看原帖</a>
        </header>

        <div class="x-backup__author">
          <div class="x-backup__avatar">{{ selectedPost.author.name?.slice(0, 1) }}</div>
          <div>
            <h2>{{ selectedPost.author.name }}</h2>
            <a :href="selectedPost.author.profileUrl" target="_blank" rel="noreferrer">
              @{{ selectedPost.author.handle }}
            </a>
          </div>
        </div>

        <p class="x-backup__time">{{ formatDate(selectedPost.createdAt) }}</p>
        <p v-if="loadingDetail" class="x-backup__loading">正在加载帖子详情...</p>
        <p v-if="detailError" class="x-backup__error">{{ detailError }}</p>
        <div class="x-backup__text">
          <p v-for="block in textBlocks(postText(selectedPost))" :key="block">{{ block }}</p>
        </div>

        <div v-if="selectedPost.images?.length" class="x-backup__media">
          <a
            v-for="image in selectedPost.images"
            :key="image.url"
            :href="mediaUrl(image)"
            target="_blank"
            rel="noreferrer"
          >
            <img :src="mediaUrl(image)" :alt="image.alt || 'X post media'" loading="lazy">
          </a>
        </div>

        <section v-if="selectedPost.comments?.length" class="x-backup__comments">
          <div class="x-backup__section-head">
            <h3>可见评论流</h3>
            <span>{{ selectedPost.comments.length }} 条</span>
          </div>

          <div
            v-for="comment in selectedPost.comments"
            :key="comment.id"
            class="x-backup__comment"
            :class="{ 'x-backup__comment--author': comment.relation === 'author-visible-reply' }"
          >
            <div class="x-backup__comment-head">
              <a :href="comment.author.profileUrl" target="_blank" rel="noreferrer">
                <strong>{{ comment.author.name }}</strong>
                <span>@{{ comment.author.handle }}</span>
              </a>
              <a :href="comment.url" target="_blank" rel="noreferrer">{{ formatDate(comment.createdAt) }}</a>
            </div>
            <div class="x-backup__comment-text">
              <p v-for="block in textBlocks(comment.text)" :key="block">{{ block }}</p>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped>
.x-backup {
  width: 100%;
  margin-top: 24px;
}

.x-backup__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  padding: 16px 20px;
}

.x-backup__summary h2 {
  margin: 2px 0 0;
  font-size: 26px;
  line-height: 1.2;
}

.x-backup__eyebrow {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.x-backup__summary dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(72px, 1fr));
  gap: 10px;
  margin: 0;
  min-width: 260px;
}

.x-backup__summary dl div {
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 14px;
}

.x-backup__summary dt {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.x-backup__summary dd {
  margin: 2px 0 0;
  color: var(--vp-c-text-1);
  font-size: 22px;
  font-weight: 700;
}

.x-backup__empty {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  margin: 18px 0 0;
  padding: 28px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.x-backup__loading,
.x-backup__error {
  border-radius: 8px;
  margin: 14px 0 0;
  padding: 10px 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.x-backup__error {
  color: var(--vp-c-danger-1);
}

.x-backup__reader {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.x-backup__list {
  display: grid;
  grid-auto-columns: minmax(240px, 320px);
  grid-auto-flow: column;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 10px;
  scroll-snap-type: x proximity;
}

.x-backup__item {
  display: grid;
  gap: 8px;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  scroll-snap-align: start;
  transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
}

.x-backup__item:hover {
  border-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.x-backup__item--active {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, var(--vp-c-bg));
}

.x-backup__date,
.x-backup__meta,
.x-backup__time,
.x-backup__comment-head span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.x-backup__date {
  font-weight: 600;
}

.x-backup__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.x-backup__meta span {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 2px 8px;
  background: var(--vp-c-bg-soft);
}

.x-backup__excerpt {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.55;
}

.x-backup__detail {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  padding: 20px 24px 26px;
}

.x-backup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 14px;
}

.x-backup__author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.x-backup__avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 20px;
  font-weight: 800;
}

.x-backup__author h2 {
  margin: 0 0 2px;
  font-size: 22px;
  line-height: 1.25;
}

.x-backup__source {
  flex: 0 0 auto;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 5px 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.x-backup__text p,
.x-backup__comment-text p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.9;
}

.x-backup__text {
  margin-top: 16px;
  font-size: 16px;
}

.x-backup__text p + p,
.x-backup__comment-text p + p {
  margin-top: 1.15em;
}

.x-backup__media {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin: 18px 0;
}

.x-backup__media img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.x-backup__comments {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 28px;
  padding-top: 20px;
}

.x-backup__section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.x-backup__section-head h3 {
  margin: 0;
}

.x-backup__section-head span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.x-backup__comment {
  position: relative;
  border-left: 2px solid var(--vp-c-divider);
  padding: 12px 0 12px 16px;
}

.x-backup__comment::before {
  content: "";
  position: absolute;
  top: 20px;
  left: -5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
}

.x-backup__comment--author {
  border-left-color: var(--vp-c-brand-1);
  background: linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-soft) 60%, transparent), transparent 62%);
}

.x-backup__comment--author::before {
  border-color: var(--vp-c-brand-1);
}

.x-backup__comment-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 14px;
}

.x-backup__comment-head a {
  text-decoration: none;
}

@media (max-width: 760px) {
  .x-backup__summary {
    align-items: start;
    flex-direction: column;
  }

  .x-backup__summary dl {
    width: 100%;
  }

  .x-backup__list {
    grid-auto-columns: minmax(220px, 82%);
  }

  .x-backup__detail {
    padding: 18px 16px 22px;
  }
}
</style>
