<script setup>
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

const mascot = shallowRef(null)
let idleTask
let timer
let disposed = false
let loading = false
let failed = false
let loaded

function cancel() {
  if (idleTask !== undefined) window.cancelIdleCallback(idleTask)
  if (timer !== undefined) window.clearTimeout(timer)
  idleTask = timer = undefined
}
async function load() {
  idleTask = timer = undefined
  if (disposed || document.hidden || loading || failed) return
  loading = true
  try {
    loaded = (await import('./StarFishMascot.vue')).default
    if (!disposed && !document.hidden) mascot.value = loaded
  } catch {
    failed = true // Optional decoration must not block the page or retry indefinitely.
  } finally {
    loading = false
  }
}
function schedule() {
  cancel()
  if (disposed || mascot.value || failed || document.hidden || document.readyState !== 'complete') return
  if (loaded) { mascot.value = loaded; return }
  if (loading) return
  if (typeof window.requestIdleCallback === 'function') {
    idleTask = window.requestIdleCallback(load, { timeout: 4000 })
  } else {
    timer = window.setTimeout(load, 1500)
  }
}
onMounted(() => {
  window.addEventListener('load', schedule, { once: true })
  document.addEventListener('visibilitychange', schedule)
  schedule()
})
onBeforeUnmount(() => {
  disposed = true
  cancel()
  window.removeEventListener('load', schedule)
  document.removeEventListener('visibilitychange', schedule)
})
</script>

<template>
  <component :is="mascot" v-if="mascot" />
</template>
