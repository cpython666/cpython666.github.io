---
title: 页面特效设置
description: 控制网站飞翔的小鸟和点击爆炸特效是否关闭
---

<script setup>
import { computed, onMounted, ref } from 'vue'

const effectKeys = {
  birdFly: 'cpython666:disable-birdfly',
  mouseTrail: 'cpython666:disable-mouse-trail',
  fireworks: 'cpython666:disable-fireworks',
}

const birdFlyDisabled = ref(false)
const mouseTrailDisabled = ref(false)
const fireworksDisabled = ref(false)
const loaded = ref(false)
const saveText = ref('')
let saveTimer

const birdFlyStatus = computed(() => birdFlyDisabled.value ? '已关闭' : '飞行中')
const mouseTrailStatus = computed(() => mouseTrailDisabled.value ? '已关闭' : '已开启')
const fireworksStatus = computed(() => fireworksDisabled.value ? '已关闭' : '已开启')

function readSetting(key) {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(key) === '1'
  } catch (error) {
    return false
  }
}

function writeSetting(key, disabled) {
  if (typeof window === 'undefined') return

  try {
    if (disabled) {
      window.localStorage.setItem(key, '1')
    } else {
      window.localStorage.removeItem(key)
    }
  } catch (error) {}
}

function loadSettings() {
  birdFlyDisabled.value = readSetting(effectKeys.birdFly)
  mouseTrailDisabled.value = readSetting(effectKeys.mouseTrail)
  fireworksDisabled.value = readSetting(effectKeys.fireworks)
  loaded.value = true
}

function applySettings() {
  if (typeof window === 'undefined') return

  writeSetting(effectKeys.birdFly, birdFlyDisabled.value)
  writeSetting(effectKeys.mouseTrail, mouseTrailDisabled.value)
  writeSetting(effectKeys.fireworks, fireworksDisabled.value)

  window.dispatchEvent(new CustomEvent('cpython666-effects-change', {
    detail: {
      birdFlyDisabled: birdFlyDisabled.value,
      mouseTrailDisabled: mouseTrailDisabled.value,
      fireworksDisabled: fireworksDisabled.value,
    },
  }))

  window.CPython666Effects?.applyBirdFlySetting?.()
  window.CPython666Effects?.applyMouseTrailSetting?.()
  window.CPython666Effects?.applyFireworkSetting?.()

  saveText.value = '已保存到当前浏览器'
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveText.value = ''
  }, 1800)
}

function resetSettings() {
  birdFlyDisabled.value = false
  mouseTrailDisabled.value = false
  fireworksDisabled.value = false
  applySettings()
}

onMounted(loadSettings)
</script>

# 页面特效设置

这里可以控制网站上的两个装饰特效，设置会保存在当前浏览器里，刷新页面后也会继续生效。

<div class="effect-settings" :class="{ 'is-loaded': loaded }">
  <section class="effect-row">
    <div>
      <h2>飞翔的小鸟</h2>
      <p>控制页面里从右向左飞过的小鸟动画。</p>
    </div>
    <div class="effect-control">
      <span class="effect-status">{{ birdFlyStatus }}</span>
      <label class="switch">
        <input
          v-model="birdFlyDisabled"
          type="checkbox"
          aria-label="关闭飞翔的小鸟"
          @change="applySettings"
        >
        <span class="slider"></span>
      </label>
      <span class="switch-label">关闭</span>
    </div>
  </section>

  <section class="effect-row">
    <div>
      <h2>鼠标拖尾</h2>
      <p>控制鼠标移动时跟随指针的彩色轨迹线条。</p>
    </div>
    <div class="effect-control">
      <span class="effect-status">{{ mouseTrailStatus }}</span>
      <label class="switch">
        <input
          v-model="mouseTrailDisabled"
          type="checkbox"
          aria-label="关闭鼠标拖尾"
          @change="applySettings"
        >
        <span class="slider"></span>
      </label>
      <span class="switch-label">关闭</span>
    </div>
  </section>

  <section class="effect-row">
    <div>
      <h2>点击爆炸特效</h2>
      <p>控制鼠标点击页面时出现的彩色粒子爆炸效果。</p>
    </div>
    <div class="effect-control">
      <span class="effect-status">{{ fireworksStatus }}</span>
      <label class="switch">
        <input
          v-model="fireworksDisabled"
          type="checkbox"
          aria-label="关闭点击爆炸特效"
          @change="applySettings"
        >
        <span class="slider"></span>
      </label>
      <span class="switch-label">关闭</span>
    </div>
  </section>

  <div class="effect-actions">
    <button type="button" class="reset-btn" @click="resetSettings">恢复全部特效</button>
    <span class="save-text" aria-live="polite">{{ saveText }}</span>
  </div>
</div>

<style scoped>
.effect-settings {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.effect-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.effect-row h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 20px;
}

.effect-row p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.effect-control {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
  min-width: 184px;
  justify-content: flex-end;
}

.effect-status {
  min-width: 56px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: right;
}

.switch {
  position: relative;
  display: inline-flex;
  width: 48px;
  height: 28px;
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  cursor: pointer;
  transition: background-color .2s ease, border-color .2s ease;
}

.slider::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
  transition: transform .2s ease;
}

.switch input:checked + .slider {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.switch input:focus-visible + .slider {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.switch-label {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.effect-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 36px;
}

.reset-btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: border-color .2s ease, color .2s ease;
}

.reset-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.save-text {
  color: var(--vp-c-brand-1);
  font-size: 14px;
}

@media (max-width: 640px) {
  .effect-row {
    display: grid;
    gap: 18px;
  }

  .effect-control {
    justify-content: flex-start;
    min-width: 0;
  }

  .effect-status {
    text-align: left;
  }
}
</style>
