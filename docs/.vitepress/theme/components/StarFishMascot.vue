<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const storageKey = 'cpython666:starfish-mascot'
const spriteUrl = '/mascot/xiaoxingyu/sprites.webp'
const waveUrl = '/mascot/xiaoxingyu/wave.webp'
const moodsUrl = '/mascot/xiaoxingyu/moods.webp'
const frameMs = 80
const ready = ref(false)
const root = ref(null)
const character = ref(null)
const recall = ref(null)
const menu = ref(null)
const menuOpen = ref(false)
const hidden = ref(false)
const paused = ref(false)
const reducedMotion = ref(false)
const pageHidden = ref(false)
const readingMode = ref(false)
const printing = ref(false)
const failedImage = ref(false)
const imageReady = ref(false)
const sprite = ref(null)
const motion = ref(null)
const actionPreload = ref(null)
const loadingAsset = ref(null)
const loadedAssets = { wave: false, moods: false }
const size = ref(160)
const x = ref(16)
const y = ref(16)
const viewport = ref({ width: 1280, height: 800 })
const state = ref('idle')
const requested = ref('idle')
const phase = ref('idle')
const dragging = ref(false)
const labels = { idle: '陪你探索每一颗星', bounce: '蓄一点力，轻轻弹起来！', wave: '你好呀，很高兴见到你', happy: '今天也有新的收获！', sleep: '歇一会儿，再出发' }
const actualSize = computed(() => Math.max(64, Math.min(size.value, viewport.value.width < 600 ? 120 : 200, viewport.value.height - 104, viewport.value.width - 24)))
const stopped = computed(() => paused.value || reducedMotion.value || pageHidden.value || hidden.value || dragging.value || readingMode.value || printing.value || !imageReady.value || Boolean(loadingAsset.value))
const spriteStyle = computed(() => ({
  backgroundImage: `url(${state.value === 'wave' ? waveUrl : state.value === 'happy' || state.value === 'sleep' ? moodsUrl : spriteUrl})`,
  backgroundSize: state.value === 'idle' || state.value === 'bounce' ? '400% 200%' : '400% 400%',
}))
const rootStyle = computed(() => hidden.value
  ? { left: 'max(12px, env(safe-area-inset-left))', bottom: 'max(12px, env(safe-area-inset-bottom))' }
  : { left: `${x.value}px`, top: `${y.value}px`, '--mascot-size': `${actualSize.value}px` })
const menuStyle = computed(() => {
  const width = Math.min(232, viewport.value.width - 24)
  const right = x.value + actualSize.value + 10
  const left = right + width <= viewport.value.width - 12 ? right : x.value - width - 10
  const top = Math.max(72, Math.min(y.value, viewport.value.height - 360))
  return {
    left: `${Math.max(12, Math.min(left, viewport.value.width - width - 12))}px`,
    top: `${top}px`,
    width: `${width}px`, maxHeight: `${Math.max(0, viewport.value.height - top - 12)}px`,
  }
})
let media
let printMedia
let readingObserver
let animation
let frames = []
let poseFrame = 0
let transitionId = 0
let dragStart
let suppressClick = false
let disposed = false

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ hidden: hidden.value, paused: paused.value, size: size.value, x: x.value, y: y.value })) } catch { /* Storage is optional. */ }
}
function clampPosition() {
  const maxY = Math.max(12, viewport.value.height - actualSize.value - 34)
  x.value = Math.max(12, Math.min(x.value, viewport.value.width - actualSize.value - 12))
  y.value = Math.max(Math.min(72, maxY), Math.min(y.value, maxY))
}
function resize() {
  viewport.value = { width: window.innerWidth, height: window.innerHeight }
  clampPosition()
}
function closeMenu(focus = false) {
  menuOpen.value = false
  if (focus) character.value?.focus({ preventScroll: true })
}
async function toggleMenu(event) {
  if (suppressClick && event.detail !== 0) { suppressClick = false; return }
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    await nextTick()
    menu.value?.querySelector('button')?.focus({ preventScroll: true })
  }
}
const range = (from, to) => Array.from({ length: Math.abs(to - from) + 1 }, (_, index) => from + index * Math.sign(to - from))
const actionFrames = {
  wave: [0, ...range(0, 15), ...range(14, 9), ...range(10, 15), ...range(14, 0), 0],
  happy: [...range(0, 7), ...Array(10).fill(7), ...range(6, 0), 0],
  sleep: range(8, 15),
}
function assetFor(action) { return action === 'wave' ? 'wave' : action === 'happy' || action === 'sleep' ? 'moods' : null }
function position(frame) { return `${(frame % 4) * 100 / 3}% ${Math.floor(frame / 4) * 100 / 3}%` }
function currentFrame() {
  if (!animation || !frames.length) return poseFrame
  const index = Math.max(0, Math.min(frames.length - 1, Math.floor(Number(animation.currentTime || 0) / frameMs)))
  return frames[index]
}
function cancelAnimation() {
  transitionId++
  animation?.cancel()
  animation = null
  frames = []
}
function cancelActionLoad(cancelRequest = false) {
  if (cancelRequest) actionPreload.value?.removeAttribute('src')
  loadingAsset.value = null
}
function act(action) {
  requested.value = action
  const asset = assetFor(action)
  if (asset && !loadedAssets[asset]) {
    if (loadingAsset.value !== asset) {
      cancelActionLoad()
      loadingAsset.value = asset
    }
  } else {
    cancelActionLoad()
    settleRequest()
  }
  closeMenu(true)
}
function actionLoaded(event) {
  const asset = event.currentTarget.dataset.asset
  if (disposed || hidden.value || event.currentTarget !== actionPreload.value || asset !== loadingAsset.value) return
  loadedAssets[asset] = true
  loadingAsset.value = null
  settleRequest()
}
function actionFailed(event) {
  if (disposed || event.currentTarget !== actionPreload.value) return
  loadingAsset.value = null
  requested.value = 'idle'
  settleRequest()
}
function baseLoaded() {
  if (disposed) return
  imageReady.value = true
  settleRequest()
}
async function playFrames(sequence, complete) {
  cancelAnimation()
  const id = transitionId
  frames = sequence
  poseFrame = sequence[0]
  await nextTick()
  if (disposed || hidden.value || id !== transitionId || !sprite.value) return
  sprite.value.style.backgroundPosition = position(poseFrame)
  const keyframes = sequence.map((frame, index) => ({ backgroundPosition: position(frame), offset: index / sequence.length, easing: 'steps(1, end)' }))
  keyframes.push({ backgroundPosition: position(sequence.at(-1)), offset: 1 })
  const active = sprite.value.animate(keyframes, { duration: sequence.length * frameMs, fill: 'forwards' })
  animation = active
  if (stopped.value) active.pause()
  active.onfinish = () => {
    if (animation !== active || id !== transitionId) return
    poseFrame = sequence.at(-1)
    sprite.value.style.backgroundPosition = position(poseFrame)
    cancelAnimation()
    complete()
  }
}
function neutral() {
  state.value = 'idle'
  phase.value = 'idle'
  poseFrame = 0
  sprite.value?.style.removeProperty('background-position')
  settleRequest()
}
async function bounce() {
  cancelAnimation()
  const id = transitionId
  poseFrame = 0
  await nextTick()
  if (disposed || hidden.value || id !== transitionId || !motion.value) return
  sprite.value?.style.removeProperty('background-position')
  // Keep the original drawing; compress around the feet and let each rebound settle.
  const active = motion.value.animate([
    { offset: 0, transform: 'translateY(0%) scale(1, 1)', easing: 'cubic-bezier(.4, 0, .8, 1)' },
    { offset: .18, transform: 'translateY(0%) scale(1.06, .93)', easing: 'cubic-bezier(.2, .7, .3, 1)' },
    { offset: .31, transform: 'translateY(-5.5%) scale(.97, 1.04)', easing: 'cubic-bezier(.2, .6, .3, 1)' },
    { offset: .44, transform: 'translateY(-8%) scale(1, 1)', easing: 'cubic-bezier(.55, 0, .85, .45)' },
    { offset: .62, transform: 'translateY(0%) scale(1.05, .95)', easing: 'cubic-bezier(.2, .7, .3, 1)' },
    { offset: .76, transform: 'translateY(-1.5%) scale(.99, 1.015)', easing: 'ease-in-out' },
    { offset: .88, transform: 'translateY(0%) scale(1.015, .985)', easing: 'ease-out' },
    { offset: 1, transform: 'translateY(0%) scale(1, 1)' },
  ], { duration: 1120, fill: 'forwards' })
  animation = active
  if (stopped.value) active.pause()
  active.onfinish = () => {
    if (animation !== active || id !== transitionId) return
    cancelAnimation()
    if (requested.value === 'bounce') requested.value = 'idle'
    neutral()
  }
}
function startAction(action) {
  state.value = action
  phase.value = 'playing'
  if (action === 'bounce') { bounce(); return }
  playFrames(actionFrames[action], () => {
    if (action === 'sleep') {
      phase.value = 'hold'
      settleRequest()
    } else {
      if (requested.value === action) requested.value = 'idle'
      neutral()
    }
  })
}
function settleRequest() {
  if (disposed || hidden.value || !imageReady.value || loadingAsset.value || phase.value === 'returning') return
  if (requested.value === state.value) return
  if (state.value === 'idle') {
    if (requested.value !== 'idle') startAction(requested.value)
    return
  }
  // Land before consuming the latest intent, so switching never snaps out of midair.
  if (state.value === 'bounce') return
  // Return from the displayed pose before switching; keep only the newest intent.
  const from = currentFrame()
  const to = state.value === 'sleep' ? 8 : 0
  phase.value = 'returning'
  playFrames(range(from, to), neutral)
}
function togglePaused() { paused.value = !paused.value; save() }
function updateSize(event) { size.value = Number(event.target.value); clampPosition(); save() }
async function hide() {
  cancelActionLoad(true)
  cancelAnimation()
  hidden.value = true
  requested.value = 'idle'
  state.value = 'idle'
  phase.value = 'idle'
  poseFrame = 0
  closeMenu()
  save()
  await nextTick()
  recall.value?.focus({ preventScroll: true })
}
async function show() {
  hidden.value = false
  clampPosition()
  save()
  await nextTick()
  character.value?.focus({ preventScroll: true })
}
function pointerDown(event) {
  if (event.button !== 0 || !event.isPrimary) return
  suppressClick = false
  dragStart = { id: event.pointerId, x: event.clientX, y: event.clientY, left: x.value, top: y.value }
  event.currentTarget.setPointerCapture(event.pointerId)
}
function pointerMove(event) {
  if (!dragStart || event.pointerId !== dragStart.id) return
  const dx = event.clientX - dragStart.x
  const dy = event.clientY - dragStart.y
  if (!dragging.value && Math.hypot(dx, dy) < 5) return
  dragging.value = true
  suppressClick = true
  closeMenu()
  x.value = dragStart.left + dx
  y.value = dragStart.top + dy
  clampPosition()
}
function pointerEnd(event) {
  if (!dragStart || event.pointerId !== dragStart.id) return
  if (dragging.value) save()
  dragStart = null
  dragging.value = false
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
}
function keydown(event) {
  if (event.key === 'Escape') closeMenu(true)
  if (event.target !== character.value) return
  const delta = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[event.key]
  if (!delta) return
  event.preventDefault()
  x.value += delta[0]; y.value += delta[1]
  clampPosition(); save()
}
function outside(event) { if (!root.value?.contains(event.target)) closeMenu() }
function visibility() { pageHidden.value = document.hidden }
function motionPreference() { reducedMotion.value = media.matches }
function readingPreference() { readingMode.value = document.body.classList.contains('article-reading-mode') }
function printPreference() { printing.value = printMedia.matches }

// Browser timelines retain their current frame while paused; no per-frame JS loop.
watch(stopped, value => {
  if (!animation) return
  if (value) animation.pause()
  else animation.play()
})
onMounted(() => {
  viewport.value = { width: window.innerWidth, height: window.innerHeight }
  hidden.value = window.innerWidth < 600
  y.value = window.innerHeight - actualSize.value - 40
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (saved && typeof saved === 'object') {
      if (typeof saved.hidden === 'boolean') hidden.value = saved.hidden
      if (typeof saved.paused === 'boolean') paused.value = saved.paused
      if (Number.isFinite(saved.size)) size.value = Math.max(100, Math.min(200, saved.size))
      if (Number.isFinite(saved.x)) x.value = saved.x
      if (Number.isFinite(saved.y)) y.value = saved.y
    }
  } catch { /* Ignore unavailable or malformed saved preferences. */ }
  clampPosition()
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  printMedia = window.matchMedia('print')
  motionPreference(); visibility(); printPreference(); readingPreference()
  readingObserver = new MutationObserver(readingPreference)
  readingObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  media.addEventListener('change', motionPreference)
  printMedia.addEventListener('change', printPreference)
  document.addEventListener('visibilitychange', visibility)
  document.addEventListener('pointerdown', outside)
  window.addEventListener('resize', resize)
  ready.value = true
})
onBeforeUnmount(() => {
  disposed = true
  cancelActionLoad(true)
  cancelAnimation()
  media?.removeEventListener('change', motionPreference)
  printMedia?.removeEventListener('change', printPreference)
  readingObserver?.disconnect()
  document.removeEventListener('visibilitychange', visibility)
  document.removeEventListener('pointerdown', outside)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <aside v-if="ready" ref="root" class="starfish-mascot" :class="{ 'is-dragging': dragging }" :style="rootStyle"
    aria-label="小星鱼陪伴" :data-state="state" :data-paused="paused" :data-motion="stopped ? 'paused' : 'running'"
    :data-requested="requested" :data-phase="phase"
    :data-renderer="imageReady && !failedImage ? 'sprites' : 'loading'" @keydown="keydown">
    <button v-if="hidden" ref="recall" class="mascot-recall" type="button" aria-label="召回小星鱼" title="召回小星鱼" @click="show">✦</button>
    <template v-else>
      <button ref="character" class="mascot-character" type="button" aria-label="小星鱼，打开菜单"
        :aria-expanded="menuOpen" aria-controls="xiaoxingyu-menu" aria-describedby="xiaoxingyu-hint"
        @click="toggleMenu" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerEnd" @pointercancel="pointerEnd" @lostpointercapture="pointerEnd">
        <span ref="motion" class="mascot-motion" aria-hidden="true">
          <span v-if="imageReady && !failedImage" ref="sprite" class="mascot-sprite" :class="{ 'mascot-wave-sprite': state === 'wave', 'mascot-moods-sprite': state === 'happy' || state === 'sleep' }"
            :style="spriteStyle"></span>
          <span v-else class="mascot-fallback">✦</span>
          <span v-if="state === 'sleep'" class="mascot-zzz">z Z</span>
          <span v-if="state === 'happy'" class="mascot-sparkles">✧　✦</span>
        </span>
        <img class="mascot-preload no-zoom" :src="spriteUrl" alt="" fetchpriority="low" decoding="async" draggable="false" @load="baseLoaded" @error="failedImage = true" />
        <img v-if="loadingAsset" :key="loadingAsset" ref="actionPreload" class="mascot-preload mascot-action-preload no-zoom"
          :data-asset="loadingAsset" :src="loadingAsset === 'wave' ? waveUrl : moodsUrl" alt="" fetchpriority="low" decoding="async" draggable="false" @load="actionLoaded" @error="actionFailed" />
      </button>
      <span class="mascot-name">小星鱼 <span aria-hidden="true">✧</span></span>
      <span id="xiaoxingyu-hint" class="mascot-sr">点击互动，按住拖动，也可用方向键移动。</span>
      <section v-if="menuOpen" id="xiaoxingyu-menu" ref="menu" class="mascot-menu" :style="menuStyle" aria-label="小星鱼互动">
        <div class="mascot-menu-heading"><strong>小星鱼</strong><button type="button" aria-label="关闭小星鱼菜单" @click="closeMenu(true)">×</button></div>
        <p class="mascot-greeting">{{ labels[state] }}</p>
        <div class="mascot-actions">
          <button class="mascot-bounce" type="button" :aria-pressed="requested === 'bounce'" @click="act('bounce')"><span aria-hidden="true">↟</span>弹一下</button>
          <button type="button" :aria-pressed="requested === 'wave'" @click="act('wave')"><span aria-hidden="true">👋</span>打招呼</button>
          <button type="button" :aria-pressed="requested === 'happy'" @click="act('happy')"><span aria-hidden="true">♡</span>开心</button>
          <button type="button" :aria-pressed="requested === 'sleep'" @click="act('sleep')"><span aria-hidden="true">☾</span>小憩</button>
          <button type="button" :aria-pressed="requested === 'idle'" @click="act('idle')"><span aria-hidden="true">✧</span>待机</button>
        </div>
        <label class="mascot-size">大小 <input type="range" aria-label="小星鱼大小" min="100" max="200" step="10" :value="size" @input="updateSize" /></label>
        <p v-if="reducedMotion" class="mascot-hint">已跟随系统减少动态效果</p>
        <div class="mascot-controls">
          <button type="button" :aria-pressed="paused" @click="togglePaused">{{ paused ? '恢复动画' : '暂停动画' }}</button>
          <button type="button" @click="hide">隐藏小星鱼</button>
        </div>
        <p class="mascot-hint">按住角色可拖动 · 方向键也能移动</p>
      </section>
    </template>
  </aside>
</template>

<style scoped>
.starfish-mascot { position: fixed; z-index: 25; width: max-content; pointer-events: none; color: var(--vp-c-text-1); font: 13px/1.5 var(--vp-font-family-base, system-ui); }
.starfish-mascot button, .mascot-menu { pointer-events: auto; }
.starfish-mascot button { font: inherit; color: inherit; cursor: pointer; }
.starfish-mascot button:focus-visible, .mascot-size input:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.mascot-character { display: block; width: var(--mascot-size); height: var(--mascot-size); border: 0; padding: 0; background: none; touch-action: none; user-select: none; cursor: grab !important; border-radius: 20px; }
.is-dragging .mascot-character { cursor: grabbing !important; }
.mascot-motion, .mascot-sprite { display: block; width: 100%; height: 100%; }
.mascot-motion { position: relative; transform-origin: 50% 95%; }
.mascot-sprite { background-repeat: no-repeat; background-position: 0 0; }
[data-state="idle"] .mascot-sprite { animation: mascot-idle 4.8s steps(1, end) infinite; }
[data-motion="paused"] .mascot-motion, [data-motion="paused"] .mascot-sprite { animation-play-state: paused; }
@keyframes mascot-idle { 0%, 92%, 96%, 100% { background-position: 0% 0%; } 94% { background-position: 33.333333% 0%; } }
.mascot-name { display: table; margin: -3px auto 0; padding: 2px 10px; color: var(--vp-c-text-2); background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent); border: 1px solid var(--vp-c-divider); border-radius: 20px; font-size: 11px; }
.mascot-name span { color: var(--vp-c-brand-1); }
.mascot-preload { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.mascot-fallback { position: absolute; inset: 0; display: grid; place-items: center; height: 100%; font-size: 64px; color: var(--vp-c-brand-1); }
.mascot-zzz, .mascot-sparkles { position: absolute; top: 5%; right: 5%; color: var(--vp-c-brand-1); font-size: 20px; font-weight: 700; text-shadow: 0 1px 3px var(--vp-c-bg); }
.mascot-menu { position: fixed; padding: 14px; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg); box-shadow: var(--vp-shadow-3, 0 8px 28px #0002); overflow-y: auto; overscroll-behavior: contain; }
.mascot-menu-heading { display: flex; align-items: center; justify-content: space-between; }
.mascot-menu-heading strong { font-size: 15px; }
.mascot-menu-heading button { width: 28px; height: 28px; padding: 0; border: 0; border-radius: 6px; background: var(--vp-c-bg-soft); font-size: 20px; }
.mascot-greeting { margin: 2px 0 12px; font-size: 12px; color: var(--vp-c-text-2); }
.mascot-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.mascot-actions button { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 38px; padding: 5px 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); border-radius: 8px; }
.mascot-actions button span { font-size: 18px; color: var(--vp-c-brand-1); }
.mascot-actions .mascot-bounce { grid-column: 1 / -1; border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.mascot-actions button:hover, .mascot-actions button[aria-pressed="true"] { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.mascot-size { display: flex; align-items: center; gap: 12px; margin: 14px 0; font-size: 12px; }
.mascot-size input { flex: 1; min-width: 0; accent-color: var(--vp-c-brand-1); }
.mascot-controls { display: flex; gap: 8px; border-top: 1px solid var(--vp-c-divider); padding-top: 10px; }
.mascot-controls button { flex: 1; min-height: 32px; padding: 4px; border: 0; border-radius: 6px; background: var(--vp-c-bg-soft); font-size: 12px; }
.mascot-hint { margin: 8px 0 0; font-size: 10px; color: var(--vp-c-text-2); }
.mascot-recall { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-brand-1) !important; font-size: 24px !important; box-shadow: var(--vp-shadow-2); }
.mascot-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
:global(body.article-reading-mode .starfish-mascot) { visibility: hidden; }
@media print { .starfish-mascot { visibility: hidden; } }
</style>
