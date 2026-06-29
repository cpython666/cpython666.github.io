<template>
  <div class="curl-converter">
    <div class="intro-row">
      <div>
        <h2>cURL 转 Python Requests</h2>
        <p>粘贴浏览器中复制的 cURL 命令，即时生成可运行的 Python 请求代码。</p>
      </div>
      <span class="local-badge">
        <span class="status-dot"></span>
        本地转换
      </span>
    </div>

    <div class="editor-grid">
      <section class="editor-card">
        <div class="editor-header">
          <div>
            <span class="step">01</span>
            <strong>cURL 命令</strong>
          </div>
          <button class="text-button" type="button" @click="loadExample">载入示例</button>
        </div>
        <textarea
          v-model="curlInput"
          class="code-editor"
          spellcheck="false"
          aria-label="cURL 命令"
          placeholder="curl 'https://api.example.com/users' \&#10;  -H 'Content-Type: application/json' \&#10;  --data-raw '{&quot;name&quot;:&quot;Python斗罗&quot;}'"
        ></textarea>
      </section>

      <section class="editor-card output-card">
        <div class="editor-header">
          <div>
            <span class="step">02</span>
            <strong>Python Requests</strong>
          </div>
          <button class="copy-button" type="button" :disabled="!pythonOutput" @click="copyCode">
            {{ copied ? '已复制 ✓' : '复制代码' }}
          </button>
        </div>
        <pre class="code-output" :class="{ empty: !pythonOutput }"><code>{{ pythonOutput || '# 转换后的 Python 代码会显示在这里' }}</code></pre>
      </section>
    </div>

    <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>

    <div class="action-row">
      <span>支持 Header、Cookie、JSON、表单、Basic Auth、代理等常用参数</span>
      <div>
        <button class="clear-button" type="button" @click="clearAll">清空</button>
        <button class="convert-button" type="button" @click="convert">立即转换 <span>→</span></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { curlToRequests } from '../utils/curlToRequests.js'

const example = `curl 'https://httpbin.org/anything?page=1' \\
  -X POST \\
  -H 'Accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -H 'X-Client: spider-tools' \\
  --data-raw '{"keyword":"Python 爬虫","limit":10}'`

const curlInput = ref(example)
const pythonOutput = ref('')
const errorMessage = ref('')
const copied = ref(false)

function convert() {
  copied.value = false
  errorMessage.value = ''
  try {
    pythonOutput.value = curlToRequests(curlInput.value)
  } catch (error) {
    pythonOutput.value = ''
    errorMessage.value = error instanceof Error ? error.message : '转换失败，请检查命令格式'
  }
}

function loadExample() {
  curlInput.value = example
  convert()
}

function clearAll() {
  curlInput.value = ''
  pythonOutput.value = ''
  errorMessage.value = ''
  copied.value = false
}

async function copyCode() {
  if (!pythonOutput.value) return
  try {
    await navigator.clipboard.writeText(pythonOutput.value)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1600)
  } catch {
    errorMessage.value = '复制失败，请手动选择代码复制'
  }
}

convert()
</script>

<style scoped>
.curl-converter {
  min-width: 0;
}

.intro-row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 28px;
}

.intro-row h2 {
  margin: 0 0 8px;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 26px;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.intro-row p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.local-badge {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border: 1px solid color-mix(in srgb, var(--vp-c-green-1) 28%, transparent);
  border-radius: 999px;
  color: var(--vp-c-green-1);
  background: color-mix(in srgb, var(--vp-c-green-soft) 76%, transparent);
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 14%, transparent);
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.editor-card {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.editor-header {
  height: 52px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 72%, transparent);
  font-size: 13px;
}

.editor-header > div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.step {
  color: var(--vp-c-brand-1);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
}

.text-button,
.copy-button,
.clear-button,
.convert-button {
  border: 0;
  cursor: pointer;
  font: inherit;
  transition: transform .18s ease, background .18s ease, opacity .18s ease;
}

.text-button {
  padding: 6px;
  color: var(--vp-c-brand-1);
  background: transparent;
  font-size: 12px;
}

.copy-button {
  padding: 6px 10px;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  font-size: 12px;
}

.copy-button:disabled {
  cursor: not-allowed;
  opacity: .45;
}

.code-editor,
.code-output {
  width: 100%;
  height: 350px;
  margin: 0;
  border: 0;
  border-radius: 0;
  padding: 18px;
  color: var(--vp-c-text-1);
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
  tab-size: 4;
}

.code-editor {
  display: block;
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 32%, transparent);
}

.code-output {
  overflow: auto;
  white-space: pre;
}

.code-output code {
  color: inherit;
}

.code-output.empty {
  color: var(--vp-c-text-3);
}

.error-message {
  margin-top: 14px;
  padding: 10px 13px;
  border: 1px solid color-mix(in srgb, var(--vp-c-danger-1) 30%, transparent);
  border-radius: 9px;
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  font-size: 13px;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
}

.action-row > span {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.action-row > div {
  display: flex;
  gap: 10px;
}

.clear-button,
.convert-button {
  padding: 10px 16px;
  border-radius: 9px;
  font-weight: 600;
}

.clear-button {
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
}

.convert-button {
  color: #fff;
  background: var(--vp-c-brand-1);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.convert-button span {
  margin-left: 6px;
}

.clear-button:hover,
.convert-button:hover,
.copy-button:not(:disabled):hover {
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }

  .code-editor,
  .code-output {
    height: 280px;
  }
}

@media (max-width: 560px) {
  .intro-row,
  .action-row {
    align-items: stretch;
    flex-direction: column;
  }

  .local-badge {
    align-self: flex-start;
  }

  .action-row > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
</style>
