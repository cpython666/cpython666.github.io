<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue', 'change'])
const root = ref(null)
const trigger = ref(null)
const listbox = ref(null)
const expanded = ref(false)
const activeIndex = ref(0)
const opensAbove = ref(false)
const menuHeight = ref(320)
const selected = computed(() => props.options.find(option => option.value === props.modelValue))
let search = ''
let lastTypedAt = 0

function close() {
  expanded.value = false
  search = ''
}

async function highlight(index) {
  activeIndex.value = Math.max(0, Math.min(props.options.length - 1, index))
  await nextTick()
  const option = listbox.value?.children[activeIndex.value]
  if (option && listbox.value) {
    // Scroll only the menu; scrollIntoView can move the surrounding page.
    const top = option.offsetTop
    const bottom = top + option.offsetHeight
    if (top < listbox.value.scrollTop) listbox.value.scrollTop = top
    else if (bottom > listbox.value.scrollTop + listbox.value.clientHeight) listbox.value.scrollTop = bottom - listbox.value.clientHeight
  }
}

function open(index = props.options.findIndex(option => option.value === props.modelValue)) {
  if (!props.options.length) return
  const rect = trigger.value.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom - 12
  const above = rect.top - 12
  opensAbove.value = below < Math.min(240, props.options.length * 44 + 12) && above > below
  menuHeight.value = Math.max(44, Math.min(320, opensAbove.value ? above : below))
  expanded.value = true
  highlight(index)
}

function choose(index) {
  const option = props.options[index]
  if (!option) return
  close()
  trigger.value?.focus({ preventScroll: true })
  if (option.value !== props.modelValue) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
  }
}

function onKeydown(event) {
  if (event.key === 'Tab') { close(); return }
  if (event.key === 'Escape') {
    if (expanded.value) { event.preventDefault(); event.stopPropagation(); close() }
    return
  }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'Home') { expanded.value ? highlight(0) : open(0) }
    else if (event.key === 'End') { expanded.value ? highlight(props.options.length - 1) : open(props.options.length - 1) }
    else if (!expanded.value) open()
    else if (event.key === 'ArrowDown') highlight(activeIndex.value + 1)
    else if (event.key === 'ArrowUp') highlight(activeIndex.value - 1)
    else choose(activeIndex.value)
    return
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const now = Date.now()
    search = (now - lastTypedAt > 700 ? '' : search) + event.key.toLowerCase()
    lastTypedAt = now
    const index = props.options.findIndex(option => option.label.toLowerCase().startsWith(search))
    if (index >= 0) { event.preventDefault(); expanded.value ? highlight(index) : open(index) }
  }
}

watch(expanded, (isOpen, _, onCleanup) => {
  if (!isOpen) return
  const outside = event => { if (!root.value?.contains(event.target)) close() }
  document.addEventListener('pointerdown', outside)
  document.addEventListener('focusin', outside)
  window.addEventListener('resize', close)
  onCleanup(() => {
    document.removeEventListener('pointerdown', outside)
    document.removeEventListener('focusin', outside)
    window.removeEventListener('resize', close)
  })
})
</script>

<template>
  <div ref="root" class="site-select" :class="{ 'is-open': expanded }">
    <button :id="id" ref="trigger" class="site-select-trigger" type="button" role="combobox"
      :aria-label="label" aria-haspopup="listbox" :aria-expanded="expanded" :aria-controls="`${id}-listbox`"
      :aria-activedescendant="expanded ? `${id}-option-${activeIndex}` : undefined"
      @click="expanded ? close() : open()" @keydown="onKeydown">
      <span>{{ selected?.label || '请选择' }}</span>
      <svg class="site-select-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
    </button>
    <div v-if="expanded" :id="`${id}-listbox`" ref="listbox" class="site-select-menu" :class="{ 'opens-above': opensAbove }"
      role="listbox" :aria-label="label" :style="{ maxHeight: `${menuHeight}px` }">
      <div v-for="(option, index) in options" :id="`${id}-option-${index}`" :key="option.value"
        class="site-select-option" :class="{ 'is-active': index === activeIndex, 'is-selected': option.value === modelValue }"
        role="option" :aria-selected="option.value === modelValue"
        @pointerdown.prevent @pointermove="activeIndex = index" @click="choose(index)">
        <span>{{ option.label }}</span>
        <svg v-if="option.value === modelValue" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-select { position: relative; min-width: 0; max-width: 100%; font-size: 14px; line-height: 1.5; }
.site-select.is-open { z-index: 30; }
.site-select-trigger { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: inherit; text-align: left; cursor: pointer; }
.site-select-trigger span, .site-select-option span { min-width: 0; overflow-wrap: anywhere; }
.site-select-trigger:hover, .is-open .site-select-trigger { border-color: var(--vp-c-brand-1); }
.site-select-trigger:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.site-select svg { flex: none; width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.site-select-chevron { color: var(--vp-c-text-2); }
.is-open .site-select-chevron { transform: rotate(180deg); }
.site-select-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; padding: 5px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-elv, var(--vp-c-bg)); box-shadow: 0 12px 36px rgb(0 0 0 / 24%); scrollbar-width: thin; }
.site-select-menu.opens-above { top: auto; bottom: calc(100% + 6px); }
.site-select-option { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 44px; padding: 9px 10px; border-radius: 7px; color: var(--vp-c-text-1); cursor: pointer; }
.site-select-option.is-active { background: var(--vp-c-brand-soft); }
.site-select-option.is-selected { color: var(--vp-c-brand-1); font-weight: 600; }
</style>
