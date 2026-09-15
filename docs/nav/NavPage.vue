<script setup>
import { navigationData } from './data.js';
import WebLink from './WebLink.vue'
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import copyText from '../utils/copy.js'

// import {WebLink} from 'vitepress/theme'

const activeAnchor = ref('')
const searchText = ref('')
const prompts = [
  {
    title: '生成视频封面的',
    text: '以上面图片为素材，给出视频封面\n封面比例4:3\n视频标题是：{{视频标题}}\n封面上只需要有重点的几个字\n不需要有很多小文字，适当加点插画就可以\n风格：使用手写体或仿手写字体。大量使用简笔画、小图标、箭头、对话框、分隔线等手绘元素来辅助表达。色彩丰富活泼，常用荧光笔、彩铅效果。布局自由随性，充满个性和趣味性。'
  },
  {
    title: '矫正视频字幕的',
    text: '修复下这个字幕：\n里面可能提到了gpt-5.6-sol\nblender\ngodot，gdscript\n这些术语\n【可选】可参考视频文案是：'
  },
]
const copiedPrompt = ref('')
const videoTitle = ref('')
const filteredNav = computed(() => {
  const q = searchText.value.trim()
  if (!q) return navigationData
  return navigationData.filter((s) => s.title.includes(q))
})

const handleScroll = () => {
  const navHeight = document.querySelector('header')?.offsetHeight || 0
  const fromTop = window.scrollY + navHeight + 12
  let current = ''
  for (const s of navigationData) {
    const el = document.getElementById(s.title)
    if (!el) continue
    if (el.offsetTop <= fromTop) {
      current = '#' + s.title
    } else {
      break
    }
  }
  if (current) activeAnchor.value = current
}

const scrollToAnchor = (id) => {
  const target = document.getElementById(id)
  if (target) {
    // 使用 scrollIntoView，使滚动更加稳定；配合内容区的 scroll-margin-top 避免被头部遮挡
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeAnchor.value = '#' + id
  }
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const promptText = (prompt) => prompt.text.replaceAll('{{视频标题}}', videoTitle.value || '{{视频标题}}')
const copyPrompt = async (prompt) => {
  try {
    await copyText(promptText(prompt))
    copiedPrompt.value = prompt.title
    window.setTimeout(() => { copiedPrompt.value = '' }, 1500)
  } catch (_) {}
}

onMounted(() => {
  nextTick(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <button class="backtop" type="button" aria-label="回到顶部" @click="scrollToTop">UP</button>
  <div class="page">
    <div class="my-nav">
      <div class="nav-card">
        <div class="nav-search">
          <input v-model="searchText" class="nav-input" placeholder="搜索分类" type="search" />
        </div>
          <div class="nav-scroll">
            <a
              v-for="(sites, index) in filteredNav"
              :key="index"
              class="nav-link"
              :class="{ 'is-active': activeAnchor === '#' + sites.title }"
              :title="sites.title"
              href="#"
              @click.prevent="scrollToAnchor(sites.title)"
            >
              {{ sites.title }}
            </a>
          </div>
      </div>
    </div>
    <div>
      <section class="prompt-panel" aria-labelledby="prompt-title">
        <div class="prompt-heading">
          <div id="prompt-title" class="h2">常用提示词</div>
          <span>点击按钮一键复制</span>
        </div>
        <div class="prompt-list">
          <article v-for="prompt in prompts" :key="prompt.title" class="prompt-card">
            <h3>{{ prompt.title }}</h3>
            <label v-if="prompt.title === '生成视频封面的'" class="prompt-variable">
              视频标题
              <input v-model="videoTitle" type="text" placeholder="输入视频标题" />
            </label>
            <p>{{ promptText(prompt) }}</p>
            <button type="button" @click="copyPrompt(prompt)">
              {{ copiedPrompt === prompt.title ? '已复制' : '复制提示词' }}
            </button>
          </article>
        </div>
      </section>
      <WebLink :datalist="navigationData"></WebLink>
      <div class="source-note">
        资源链接来源于
        <a href="https://spiderbox.cn/" target="_blank" rel="noopener noreferrer">《虫盒》</a>
        <span class="note-updating">持续更新中</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-nav {
  padding: 8px;
  position: sticky;
  top: 8px;
  align-self: flex-start;
  z-index: 20;
}

.nav-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-2);
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 20;
  box-sizing: border-box;
  width: 150px;
  /* 居中内部内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.nav-search { padding: 6px 8px 0; }

.nav-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.nav-scroll {
  max-height: 100vh;
  overflow: auto;
  width: 100%;
}

.nav-link {
  display: block;
  margin: 3px 6px;
  padding: 6px 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
  border-radius: 10px;
  border: none;
  text-align: center;
  min-width: 5em;
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
  transform: translateX(2px);
}

.nav-link.is-active {
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
}

.page {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 1120px;
  margin: 16px auto;
  padding: 0 12px;
}

.source-note {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 12px 0 0;
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.prompt-panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
}
.prompt-heading { display: flex; align-items: baseline; gap: 10px; }
.prompt-heading .h2 { font-size: 24px; }
.prompt-heading span { color: var(--vp-c-text-2); font-size: 13px; }
.prompt-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 12px; }
.prompt-card { padding: 14px; border-radius: 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.prompt-card h3 { margin: 0 0 8px; font-size: 16px; }
.prompt-card p { margin: 0 0 12px; color: var(--vp-c-text-2); line-height: 1.6; font-size: 13px; white-space: pre-line; }
.prompt-variable { display: block; margin-bottom: 10px; color: var(--vp-c-text-2); font-size: 13px; }
.prompt-variable input { display: block; width: 100%; box-sizing: border-box; margin-top: 4px; padding: 6px 8px; color: var(--vp-c-text-1); background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 6px; }
.prompt-card button { border: 0; border-radius: 6px; padding: 6px 10px; color: #fff; background: var(--vp-c-brand-1); cursor: pointer; }
.source-note a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.source-note a:hover { text-decoration: underline; }
.source-note .note-updating {
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-left: 8px;
}

.backtop {
  position: fixed;
  right: 24px;
  bottom: 100px;
  z-index: 50;
  width: 40px;
  height: 40px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  box-shadow: var(--vp-shadow-2);
}
</style>
