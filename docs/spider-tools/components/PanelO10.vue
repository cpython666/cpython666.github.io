<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { o10Encode, o10Decode } from '../utils/o10.js'
import copyText from '../../utils/copy.js'
import SiteSelect from '../../components/SiteSelect.vue'

const mode = ref('standard')
const inputText = ref('你好，世界😄')
const outputText = ref('')
const notice = ref('')
const copyState = ref('')
const emit = defineEmits(['feedback'])
let copyTimer

function resetOutput() {
  outputText.value = ''
  notice.value = ''
  copyState.value = ''
  clearTimeout(copyTimer)
}

function convert(decode = false) {
  resetOutput()
  try {
    outputText.value = (decode ? o10Decode : o10Encode)(inputText.value, mode.value === 'pro')
    if (!inputText.value) notice.value = '请输入要处理的内容。'
  } catch (error) {
    notice.value = error.message
  }
}

function reuseOutput() {
  inputText.value = outputText.value
  resetOutput()
}

async function copyOutput() {
  clearTimeout(copyTimer)
  try {
    await copyText(outputText.value)
    copyState.value = 'success'
    emit('feedback', { message: '处理结果已复制到剪贴板', kind: 'success' })
  } catch {
    copyState.value = 'error'
    emit('feedback', { message: '复制失败，请选中结果手动复制。', kind: 'error' })
  }
  copyTimer = setTimeout(() => { copyState.value = '' }, 4000)
}
onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <section class="o10-tool">
    <h3>O10 编码解码</h3>
    <div class="mode-row">
      <label for="o10-mode">编码模式</label>
      <SiteSelect id="o10-mode" v-model="mode" label="编码模式" :options="[
        { value: 'standard', label: '标准 O10（数字 0、1 / 大写 O）' },
        { value: 'pro', label: 'Pro（大写 I / 小写 l / 数字 1）' },
      ]" @change="resetOutput" />
    </div>
    <p class="mode-hint">
      {{ mode === 'pro' ? '每个字符用 I 和 l 表示，字符之间用数字 1 分隔。' : '每个字符转为二进制，字符之间用大写字母 O 分隔。' }}
      支持中文和 emoji，这是可逆文本编码。
    </p>
    <label for="o10-input">输入内容</label>
    <textarea id="o10-input" v-model="inputText" rows="5" spellcheck="false" placeholder="输入原文或对应模式的编码" @input="resetOutput"></textarea>
    <div class="actions">
      <button type="button" class="primary" @click="convert(false)">编码</button>
      <button type="button" @click="convert(true)">解码</button>
      <button type="button" :disabled="!outputText" @click="reuseOutput">结果用作输入</button>
    </div>
    <div class="output-label">
      <label for="o10-output">处理结果</label>
      <button type="button" aria-label="复制结果" :class="{ 'copy-success': copyState === 'success', 'copy-error': copyState === 'error' }" :disabled="!outputText" @click="copyOutput">{{ copyState === 'success' ? '已复制 ✓' : copyState === 'error' ? '复制失败' : '复制结果' }}</button>
    </div>
    <textarea id="o10-output" :value="outputText" rows="6" readonly spellcheck="false" placeholder="编码或解码的结果会显示在这里"></textarea>
    <p class="notice" role="status">{{ notice }}</p>
  </section>
</template>

<style scoped>
.o10-tool { min-width: 0; }
.o10-tool h3 { margin: 0 0 20px; }
.mode-row, .actions, .output-label { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.mode-row .site-select { width: 340px; }
.mode-hint, .notice { color: var(--vp-c-text-2); font-size: 13px; line-height: 1.7; margin: 12px 0; }
.o10-tool textarea {
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
  resize: vertical;
}
.actions { margin: 12px 0 20px; }
.output-label { justify-content: space-between; }
.o10-tool button {
  padding: 7px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.o10-tool .primary { background: var(--vp-c-brand-1); color: white; }
.o10-tool .copy-success { color: var(--vp-c-green-1); border-color: currentColor; background: var(--vp-c-green-soft); }
.o10-tool .copy-error { color: var(--vp-c-red-1); border-color: currentColor; background: var(--vp-c-red-soft); }
.o10-tool button:disabled { opacity: .5; cursor: default; }
.notice { min-height: 22px; margin-bottom: 0; }
</style>
