<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'red' },
  label: { type: String, default: '按钮' },
  width: { type: String, default: 'auto' },
  height: { type: String, default: 'auto' },
  color: { type: String, default: '#fff' }
})

const buttonClass = computed(() => ({
  red: 'btn-1',
  blue: 'btn-2',
  purple: 'btn-3'
}[props.type] || 'btn-1'))
</script>

<template>
  <button class="btn" :class="buttonClass" :style="{ width, height, color }">
    {{ label }}
  </button>
  
</template>

<style scoped>
@keyframes vipAnim {
  0% { background-position: right center; }
  100% { background-position: center left; }
}
.btn {
  padding: 5px 10px;
  border: none;
  transition: all 0.5s ease-out;
  font-weight: 500;
  border-radius: 4px;
  background-size: 200% auto;
  box-shadow: 0 0 15px 0 rgba(0,0,0,0.3);
  cursor: pointer;
  position: relative;
  animation: vipAnim 3s ease-in-out alternate infinite;
}
.btn:hover { transform: scale(1.05); }
.btn-1 {
  background-image: linear-gradient(to right, rgb(255,220,50) 0%, rgb(170,40,120) 51%, rgb(255,220,50) 100%);
}
.btn-2 {
  background-image: linear-gradient(to right, rgb(0,200,255) 0%, rgb(0,40,255) 51%, rgb(0,200,255) 100%);
}
.btn-3 {
  background-image: linear-gradient(to right, rgb(0,40,255) 0%, rgb(230,90,230) 51%, rgb(0,40,255) 100%);
}
</style>

