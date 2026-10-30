<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SiteSelect from '../../components/SiteSelect.vue'
import { drawMarkdown, parseMarkdown } from '../utils/markdownImage.js'

const sample = [
  '# 星梦启航 · Markdown 转图片',
  '',
  '把 **Markdown** 文本渲染成一张干净的 PNG 图片，全部在浏览器本地完成，内容不会上传。',
  '',
  '## 支持的语法',
  '',
  '- 标题（`#` 到 `######`）',
  '- 粗体、斜体、~~删除线~~、`行内代码` 和 [链接](https://cpython666.github.io)',
  '- 有序与无序列表、引用块、分隔线',
  '- 代码块，长行自动折行',
  '',
  '> 宽度和明暗主题在上方切换，改完即时重新渲染。',
  '',
  '```js',
  "const message = 'Hello, Markdown!'",
  'console.log(message)',
  '```',
].join('\n')

const source = ref(sample)
const theme = ref('light')
const width = ref('900')
const notice = ref('')
const ready = ref(false)
const size = ref({ width: 0, height: 0 })
const canvasRef = ref(null)
let renderTimer

const themeOptions = [
  { value: 'light', label: '浅色（白底深字）' },
  { value: 'dark', label: '深色（深底浅字）' },
]
const widthOptions = [
  { value: '720', label: '720 px（窄图）' },
  { value: '900', label: '900 px（默认）' },
  { value: '1080', label: '1080 px（宽图）' },
]

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  if (!source.value.trim()) {
    ready.value = false
    size.value = { width: 0, height: 0 }
    notice.value = '请输入 Markdown 内容。'
    return
  }
  try {
    const layout = drawMarkdown(canvas, parseMarkdown(source.value), {
      width: Number(width.value),
      theme: theme.value,
      padding: 48,
      fontSize: 16,
      scale: 2,
    })
    size.value = { width: layout.width, height: layout.height }
    ready.value = true
    notice.value = layout.truncated
      ? `内容过长，只渲染了前 ${layout.height} px，建议拆成多张图。`
      : `已生成 ${layout.width} × ${layout.height} 的 PNG，可下载保存。`
  } catch (error) {
    ready.value = false
    notice.value = `生成失败：${error.message}`
  }
}

function scheduleRender() {
  clearTimeout(renderTimer)
  renderTimer = setTimeout(render, 300)
}

async function download() {
  const canvas = canvasRef.value
  if (!ready.value || !canvas) return
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) {
    notice.value = '导出失败，请重试或换一个浏览器。'
    return
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `markdown-${size.value.width}x${size.value.height}-${theme.value}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  notice.value = `已导出 ${size.value.width} × ${size.value.height} 的 PNG。`
}

watch(source, scheduleRender)
watch([theme, width], render)

onMounted(render)
onBeforeUnmount(() => clearTimeout(renderTimer))
</script>

<template>
  <section class="md-image">
    <h3>Markdown 转图片</h3>
    <div class="options">
      <div class="field">
        <label for="md-image-theme">主题</label>
        <SiteSelect id="md-image-theme" v-model="theme" label="主题" :options="themeOptions" />
      </div>
      <div class="field">
        <label for="md-image-width">图片宽度</label>
        <SiteSelect id="md-image-width" v-model="width" label="图片宽度" :options="widthOptions" />
      </div>
      <div class="buttons">
        <button type="button" class="primary" @click="render">生成图片</button>
        <button type="button" :disabled="!ready" @click="download">下载 PNG</button>
      </div>
    </div>

    <label for="md-image-input">Markdown 内容</label>
    <textarea
      id="md-image-input"
      v-model="source"
      rows="10"
      spellcheck="false"
      placeholder="在这里粘贴 Markdown，支持标题、列表、代码块、引用和链接"
    ></textarea>

    <p class="notice" role="status">{{ notice }}</p>

    <div v-show="ready" class="preview">
      <canvas ref="canvasRef" class="preview-canvas" role="img" aria-label="Markdown 渲染出的图片预览"></canvas>
    </div>
    <p class="hint">图片按 2 倍分辨率渲染，导出后放大也清晰；表格和图片语法不在支持范围内。</p>
  </section>
</template>

<style scoped>
.md-image { min-width: 0; }
.md-image h3 { margin: 0 0 20px; }
.options { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px; margin-bottom: 18px; }
.field { display: flex; flex-direction: column; gap: 6px; width: 220px; max-width: 100%; }
.field label { color: var(--vp-c-text-2); font-size: 13px; }
.field :deep(.site-select) { width: 100%; }
.buttons { display: flex; flex-wrap: wrap; gap: 10px; }
.md-image textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.7;
  resize: vertical;
}
.md-image button {
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.md-image .primary { background: var(--vp-c-brand-1); color: white; }
.md-image button:disabled { opacity: .5; cursor: default; }
.notice { min-height: 22px; margin: 12px 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.7; }
.preview { max-height: 560px; overflow: auto; padding: 12px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.preview-canvas { display: block; width: 100%; height: auto; border-radius: 6px; box-shadow: 0 8px 28px rgba(0, 0, 0, .12); }
.hint { margin: 12px 0 0; color: var(--vp-c-text-3); font-size: 12px; line-height: 1.7; }
@media (max-width: 768px) {
  .field { width: 100%; }
  .buttons { width: 100%; }
  .buttons button { flex: 1 1 0; }
  .preview { max-height: 420px; padding: 8px; }
}
</style>
