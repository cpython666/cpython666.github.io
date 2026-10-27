<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import copyText from '../../utils/copy.js'

const emit = defineEmits(['feedback'])
const inputText = ref('你好 world 😄')
const copyTarget = ref('')
const copyState = ref('')
let copyTimer
let copyVersion = 0

const results = computed(() => [
  { id: 'encoded', label: '编码结果', transform: encodeURIComponent, errorId: 'url-encode-error', error: '输入包含不完整的 Unicode 字符，请检查后重试。' },
  { id: 'decoded', label: '解码结果', transform: decodeURIComponent, errorId: 'url-decode-error', error: '无法解码：请检查百分号后是否为两位十六进制数，且内容是完整的 UTF-8 编码，例如 %E4%BD%A0。' },
].map(result => {
  try {
    return { ...result, value: result.transform(inputText.value), error: '' }
  } catch {
    return { ...result, value: '' }
  }
}))

function resetCopy() {
  copyVersion += 1
  clearTimeout(copyTimer)
  copyTarget.value = ''
  copyState.value = ''
}

async function copyResult(result) {
  resetCopy()
  const version = copyVersion
  try {
    await copyText(result.value)
    if (version !== copyVersion) return
    copyState.value = 'success'
    emit('feedback', { message: `${result.label}已复制到剪贴板`, kind: 'success' })
  } catch {
    if (version !== copyVersion) return
    copyState.value = 'error'
    emit('feedback', { message: '复制失败，请选中结果手动复制。', kind: 'error' })
  }
  copyTarget.value = result.id
  copyTimer = setTimeout(resetCopy, 4000)
}

watch(inputText, resetCopy, { flush: 'sync' })
onBeforeUnmount(resetCopy)
</script>

<template>
  <section class="url-tool">
    <h3>URL 编码解码</h3>
    <p id="url-hint" class="hint">实时转换 URL 参数值，支持中文、emoji 和换行。空格编码为 %20，加号 + 保持原意。</p>
    <label for="url-input">输入内容</label>
    <textarea id="url-input" v-model="inputText" class="tool-textarea" rows="5" spellcheck="false" aria-describedby="url-hint" placeholder="输入要编码的文字或要解码的百分号编码"></textarea>
    <div class="output-container">
      <div v-for="result in results" :key="result.id" class="result">
        <div class="output-label">
          <label :for="`url-${result.id}`">{{ result.label }}</label>
          <button type="button" :aria-label="`复制${result.label}`" :class="{ 'copy-success': copyTarget === result.id && copyState === 'success', 'copy-error': copyTarget === result.id && copyState === 'error' }" :disabled="!result.value || !!result.error" @click="copyResult(result)">
            {{ copyTarget === result.id ? (copyState === 'success' ? '已复制 ✓' : '复制失败') : '复制结果' }}
          </button>
        </div>
        <textarea :id="`url-${result.id}`" :value="result.value" class="tool-textarea output" rows="7" readonly spellcheck="false" :aria-describedby="result.error ? result.errorId : undefined" :placeholder="`${result.label}会显示在这里`"></textarea>
        <div class="notice" role="status" aria-live="polite">
          <p v-if="result.error" :id="result.errorId">{{ result.error }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.url-tool, .result { min-width: 0; }
.url-tool h3 { margin: 0 0 12px; }
.hint { margin: 0 0 20px; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.7; }
.tool-textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  resize: vertical;
}
.output-container { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 20px; }
.output-label { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.url-tool button { padding: 7px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.url-tool .copy-success { color: var(--vp-c-green-1); border-color: currentColor; background: var(--vp-c-green-soft); }
.url-tool .copy-error { color: var(--vp-c-red-1); border-color: currentColor; background: var(--vp-c-red-soft); }
.url-tool button:disabled { opacity: .5; cursor: default; }
.notice { color: var(--vp-c-red-1); font-size: 13px; line-height: 1.7; overflow-wrap: anywhere; }
.notice p { margin: 8px 0 0; }
@media (max-width: 680px) { .output-container { grid-template-columns: minmax(0, 1fr); } }
</style>
