---
layout: home
sidebar: false
---

<style>
.doc-container {
  width: 100%;
  max-width: 1120px;
  margin: 16px auto;
  padding: 0 12px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
  background: linear-gradient(180deg, var(--el-color-primary-light-9), transparent);
}
.page-header h1 {
  margin: 0 0 6px;
  font-size: 22px;
}
.page-header p {
  margin: 0;
  color: var(--el-text-color-secondary);
}
.page-header .stats { display: flex; align-items: center; gap: 12px; }
.page-header .stat { display: flex; align-items: baseline; gap: 6px; }
.page-header .stat .num { font-weight: 700; font-size: 18px; }
.page-header .stat .label { color: var(--el-text-color-secondary); }
.page-header .divider { width: 1px; height: 18px; background: var(--el-border-color); }

.nav-hub {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.hub-card {
  padding: 14px;
  border-radius: 12px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-light);
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
  display: flex;
  flex-direction: column;
  /* 分栏模式下高度自适应 */
}
.hub-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--el-box-shadow);
  border-color: var(--el-color-primary);
}
.hub-card h3 { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
.hub-card .links { flex: 1; padding-right: 4px; }
.hub-card a {
  display: inline-block;
  margin: 4px 8px 0 0;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
  text-decoration: none;
}
.hub-card a:hover { background: var(--el-color-primary); color: #fff; }

/* 分栏类型布局（列式导航） */
.nav-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.col-block {
  padding: 14px;
  border-radius: 12px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-light);
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.col-block:hover { transform: translateY(-1px); box-shadow: var(--el-box-shadow); border-color: var(--el-color-primary); }
.col-block h3 { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
.col-block .links { display: flex; flex-wrap: wrap; gap: 6px 8px; }
.col-block a { display: inline-block; padding: 4px 8px; border-radius: 8px; background: var(--el-color-primary-light-9); color: var(--el-text-color-primary); text-decoration: none; }
.col-block a:hover { background: var(--el-color-primary); color: #fff; }

.articles { margin-top: 20px; }
.articles details {
  margin: 10px 0;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color);
}
.articles summary {
  cursor: pointer;
  padding: 8px 12px;
  font-weight: 600;
}
.articles ul {
  list-style: none;
  padding: 10px 12px 14px;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}
.articles li { margin: 0; }
.articles a { display: block; padding: 6px 10px; border-radius: 8px; background: var(--el-color-primary-light-9); text-decoration: none; color: var(--el-text-color-primary); }
.articles a:hover { background: var(--el-color-primary); color: #fff; }

/* 顶部分栏切换控件 */
.seg-switch { display: inline-flex; border: 1px solid var(--el-border-color); border-radius: 10px; overflow: hidden; background: var(--el-bg-color); margin-top: 12px; }
.seg-item { padding: 6px 12px; cursor: pointer; color: var(--el-text-color-secondary); user-select: none; }
.seg-item:hover { background: var(--el-color-primary-light-9); color: var(--el-color-primary); }
.seg-item.is-active { background: var(--el-color-primary); color: #fff; }

.columns3 { display: grid; grid-template-columns: 220px 260px 1fr; gap: 14px; margin-top: 16px; }
.col { padding: 14px; border-radius: 12px; background: var(--el-bg-color-overlay); box-shadow: var(--el-box-shadow-light); border: 1px solid var(--el-border-color-light); }
.col-title { margin: 0 0 10px; font-size: 16px; font-weight: 600; }
.list { display: flex; flex-direction: column; gap: 6px; }
.item { padding: 6px 10px; border-radius: 8px; background: var(--el-color-primary-light-9); color: var(--el-text-color-primary); cursor: pointer; }
.list a.item { display: block; }
.item:hover { background: var(--el-color-primary); color: #fff; }
.item.is-active { background: var(--el-color-primary); color: #fff; }
.count { margin-left: 6px; color: var(--el-text-color-secondary); font-size: 12px; }
.col .links { display: flex; flex-wrap: wrap; gap: 6px 8px; }
.col .links a { display: inline-block; padding: 4px 8px; border-radius: 8px; background: var(--el-color-primary-light-9); color: var(--el-text-color-primary); text-decoration: none; }
.col .links a:hover { background: var(--el-color-primary); color: #fff; }
</style>

<script setup>
import { useData } from 'vitepress'
import { computed, ref } from 'vue'
const { site, theme } = useData()

// 自动收集 docs 下的所有 Markdown 页面
const allMd = Object.keys(import.meta.glob('../**/*.md'))
// 过滤当前导航页自身
const filtered = allMd.filter(p => !p.includes('navigation/index.md'))

// 路径转为站点路由
const toRoute = (p) => {
  const clean = p.replace(/^\.\.\//, '')
  let route = '/' + clean.replace(/\.md$/, '')
  route = route.replace(/\/index$/, '/')
  return route
}

// 分组：首层目录
const groups = computed(() => {
  const map = new Map()
  for (const p of filtered) {
    const route = toRoute(p)
    const segs = route.split('/').filter(Boolean)
    const group = segs[0] || '其他'
    if (!map.has(group)) map.set(group, [])
    map.get(group).push({ route, name: segs.at(-1) || group })
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, items]) => ({ name, items: items.sort((a, b) => a.name.localeCompare(b.name)) }))
})

const totalCount = computed(() => filtered.length)

// 基于主题配置（nav + sidebar）构建 route -> 文本 的映射
const linkTextMap = computed(() => {
  const map = new Map()
  const addItem = (it) => {
    if (!it) return
    if (it.link) {
      const key = it.link.replace(/\/$/, '')
      map.set(key, it.text)
    }
    if (Array.isArray(it.items)) it.items.forEach(addItem)
  }
  const nav = (theme.value && theme.value.nav) || []
  nav.forEach(addItem)
  const sidebar = (theme.value && theme.value.sidebar) || {}
  Object.values(sidebar).forEach(arr => {
    if (Array.isArray(arr)) arr.forEach(addItem)
  })
  return map
})

const displayText = (route, fallback) => {
  const key = route.replace(/\/$/, '')
  return linkTextMap.value.get(key) || fallback
}

// 顶部导航卡：基于 theme.sidebar 的分组动态生成（与精简后的头部导航配套）
const navCards = computed(() => {
  const groups = sidebarGroups.value.filter(g => g.path !== '/')
  const titleMap = {
    '/python/': 'Python',
    '/spider/': '爬虫',
    '/web/': '前端',
    '/backend/': '后端',
    '/算法/': '算法',
    '/web-intro/': '网站相关',
    '/好文推荐/': '好文推荐',
    '/web3/': '币圈入圈指南',
    '/python/collection/23-design/': '23种设计模式-Python',
  }
  const toTitle = (path, name) => titleMap[path] || name
  const cards = groups.map(g => {
    const links = [
      ...g.items,
      ...g.sections.flatMap(sec => sec.items)
    ]
    return { title: toTitle(g.path, g.name), links }
  })
  return cards
})

const normalizeNode = (n) => ({
  text: n?.text || '',
  link: n?.link,
  items: Array.isArray(n?.items) ? n.items.map(normalizeNode) : []
})

const sidebarTree = computed(() => {
  const sb = (theme.value && theme.value.sidebar) || {}
  const allow = Array.isArray(theme.value?.blogNavInclude) ? new Set(theme.value.blogNavInclude) : null
  const exclude = Array.isArray(theme.value?.blogNavExclude) ? new Set(theme.value.blogNavExclude) : null
  const groups = []
  for (const [path, arr] of Object.entries(sb)) {
    if (path === '/') continue
    if (allow && !allow.has(path)) continue
    if (exclude && exclude.has(path)) continue
    const name = path.replace(/^\//, '').replace(/\/$/, '') || '其他'
    const nodes = Array.isArray(arr) ? arr.map(normalizeNode) : []
    groups.push({ path, name, nodes })
  }
  return groups.sort((a, b) => a.name.localeCompare(b.name))
})

const activeIndices = ref([0])
const columns = computed(() => {
  const cols = []
  const groups = sidebarTree.value
  cols.push({ title: '一级导航', items: groups.map(g => ({ text: g.name, items: g.nodes })) })
  let nodes = groups[activeIndices.value[0]]?.nodes || []
  let level = 1
  while (nodes && nodes.length) {
    cols.push({ title: level === 1 ? '二级分类' : `${level + 1}级`, items: nodes })
    const ai = activeIndices.value[level] ?? 0
    const chosen = nodes[ai]
    nodes = chosen?.items || []
    level++
    if (level > 8) break
  }
  return cols
})

const onHover = (ci, ni) => {
  const arr = activeIndices.value.slice(0, ci)
  arr[ci] = ni
  activeIndices.value = arr
}

const gridColsStyle = computed(() => {
  const n = columns.value.length
  const extra = Math.max(n - 3, 0)
  const repeat = extra ? '260px '.repeat(extra) : ''
  return { gridTemplateColumns: `220px 260px ${repeat}1fr` }
})

const activeCol = ref(0)
const activeSection = ref(0)

// 侧边栏双/三层结构自动判断
const sidebarGroups = computed(() => {
  const sb = (theme.value && theme.value.sidebar) || {}
  const allow = Array.isArray(theme.value?.blogNavInclude) ? new Set(theme.value.blogNavInclude) : null
  const exclude = Array.isArray(theme.value?.blogNavExclude) ? new Set(theme.value.blogNavExclude) : null

  const collectLeaves = (node) => {
    const res = []
    const walk = (n) => {
      if (!n) return
      if (n.link) res.push({ text: n.text, link: n.link })
      if (Array.isArray(n.items)) n.items.forEach(walk)
    }
    walk(node)
    return res
  }

  const groups = []
  for (const [path, arr] of Object.entries(sb)) {
    // 跳过根路径，将其保留在头部基础入口，不参与文章分组统计
    if (path === '/') continue
    const sections = []
    const items = []
    if (Array.isArray(arr)) {
      arr.forEach(section => {
        if (Array.isArray(section.items) && section.items.length) {
          const title = section.text || path
          sections.push({ text: title, items: collectLeaves(section) })
        } else if (section.link) {
          items.push({ text: section.text, link: section.link })
        }
      })
    }
    const name = path.replace(/^\//, '').replace(/\/$/, '') || '其他'
    groups.push({ path, name, sections, items })
  }
  let filtered = allow ? groups.filter(g => allow.has(g.path)) : groups
  if (exclude && exclude.size) filtered = filtered.filter(g => !exclude.has(g.path))
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const sidebarTotal = computed(() => sidebarGroups.value.reduce((s, g) => s + g.items.length + g.sections.reduce((ss, sec) => ss + sec.items.length, 0), 0))
const groupCount = (g) => g.items.length + g.sections.reduce((s, sec) => s + sec.items.length, 0)
</script>

<div class="doc-container">
<div class="page-header">
  <div>
    <h1>文章导航[待优化...]</h1>
    <p>按类别汇总站内文章，快速到达与检索。</p>
  </div>
  <div class="stats">
    <div class="stat"><span class="num">{{ sidebarGroups.length }}</span><span class="label">分类</span></div>
    <div class="divider"></div>
    <div class="stat"><span class="num">{{ sidebarTotal }}</span><span class="label">文章</span></div>
  </div>
  
</div>

<div class="columns3" :style="gridColsStyle">
  <div class="col" v-for="(col, ci) in columns" :key="ci">
    <h3 class="col-title">{{ col.title }}</h3>
    <div class="list">
      <template v-for="(node, ni) in col.items" :key="(node.link || '') + node.text + ni">
        <a v-if="node.link && (!node.items || !node.items.length)" class="item" :href="node.link">{{ node.text }}</a>
        <div v-else class="item" :class="{ 'is-active': (activeIndices[ci] ?? 0) === ni }" @mouseenter="onHover(ci, ni)">
          {{ node.text }}<span class="count" v-if="node.items && node.items.length">（{{ node.items.length }}）</span>
        </div>
      </template>
    </div>
  </div>
</div>

## 所有文章

<div class="articles">
  <details v-for="g in sidebarGroups" :key="g.path" open>
    <summary>{{ g.name }}（{{ groupCount(g) }}）</summary>
    <!-- 三层：存在分类 -->
    <template v-if="g.sections.length">
      <div class="sections">
        <details v-for="sec in g.sections" :key="sec.text" open>
          <summary>{{ sec.text }}（{{ sec.items.length }}）</summary>
          <ul>
            <li v-for="it in sec.items" :key="it.link">
              <a :href="it.link">{{ it.text }}</a>
            </li>
          </ul>
        </details>
        <details v-if="g.items.length" open>
          <summary>未分组（{{ g.items.length }}）</summary>
          <ul>
            <li v-for="it in g.items" :key="it.link">
              <a :href="it.link">{{ it.text }}</a>
            </li>
          </ul>
        </details>
      </div>
    </template>
    <!-- 两层：只有散叶子链接 -->
    <template v-else>
      <ul>
        <li v-for="it in g.items" :key="it.link">
          <a :href="it.link">{{ it.text }}</a>
        </li>
      </ul>
    </template>
  </details>
</div>

</div>
