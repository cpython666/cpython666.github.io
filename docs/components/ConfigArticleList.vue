<script setup>
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const props = defineProps({
  prefix: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    default: 'articles',
    validator: (value) => ['articles', 'indexes', 'all'].includes(value),
  },
  maxDepth: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
})

const { theme } = useData()
const route = useRoute()

const pathOnly = (link = '') => link.split('#')[0].split('?')[0]
const normalizePath = (link = '') => {
  const path = pathOnly(link).replace(/\.html$/, '')
  return path === '/' ? path : path.replace(/\/$/, '')
}

const sidebarItems = computed(() => {
  const sidebar = theme.value.sidebar
  if (Array.isArray(sidebar)) return sidebar

  const routePath = normalizePath(route.path)
  const sidebarKey = Object.keys(sidebar || {})
    .filter((key) => {
      const normalizedKey = normalizePath(key)
      return normalizedKey === '/'
        || routePath === normalizedKey
        || routePath.startsWith(`${normalizedKey}/`)
    })
    .sort((left, right) => right.length - left.length)[0]

  return sidebarKey ? sidebar[sidebarKey] : []
})

const flattenLinks = (items, links = []) => {
  for (const item of items || []) {
    if (item.link) links.push(item)
    if (Array.isArray(item.items)) flattenLinks(item.items, links)
  }
  return links
}

const articles = computed(() => {
  const prefix = normalizePath(props.prefix)
  const currentPath = normalizePath(route.path)
  const seen = new Set()

  return flattenLinks(sidebarItems.value, []).filter((item) => {
    const itemPath = normalizePath(item.link)
    if (itemPath === currentPath || seen.has(itemPath)) return false
    if (itemPath !== prefix && !itemPath.startsWith(`${prefix}/`)) return false

    const depth = itemPath
      .slice(prefix.length)
      .split('/')
      .filter(Boolean).length
    if (depth > props.maxDepth) return false

    const isIndex = pathOnly(item.link).endsWith('/')
    if (props.kind === 'articles' && isIndex) return false
    if (props.kind === 'indexes' && !isIndex) return false

    seen.add(itemPath)
    return true
  })
})

const resolveHref = (link) => withBase(
  link.endsWith('/') || link.endsWith('.html') ? link : `${link}.html`,
)
</script>

<template>
  <ul>
    <li v-for="article in articles" :key="article.link">
      <a :href="resolveHref(article.link)">{{ article.text }}</a>
    </li>
  </ul>
</template>
