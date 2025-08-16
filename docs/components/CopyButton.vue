<script setup>
import copy_text from '../utils/copy.js'
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: "比特币地址："
  },
  text: {
    type: String,
    required: true
  }
})

const copied = ref(false)
// 用来存放客户端导入的 alertify
let alertify = null

// 仅在浏览器端加载 alertifyjs
onMounted(async () => {
  alertify = (await import('alertifyjs')).default
})

const handleCopy = () => {
  copy_text(props.text)
    .then(() => {
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
      console.log('复制成功:', props.text)
      if (alertify) alertify.success('复制成功！')
    })
    .catch(() => {
      if (alertify) alertify.warning('复制失败～')
    })
}
</script>

<template>
  <div class="copy-container">
    <span class="label">{{ props.label }}</span>
    <code class="copy-text">{{ props.text }}</code>
    <button class="copy-btn" @click="handleCopy">
      {{ copied ? "✅ 已复制" : "📋 点击复制" }}
    </button>
  </div>
</template>

<style scoped>
.copy-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: bold;
  color: #444;
}

.copy-text {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.copy-btn {
  padding: 4px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #f0f0f0;
}

.copy-btn:active {
  background: #e0e0e0;
}
</style>
