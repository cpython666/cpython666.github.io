---
layout: home
sidebar: false
---

<style>
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
  height: 300px; /* 每个分类卡片固定高度 */
}
.hub-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--el-box-shadow);
  border-color: var(--el-color-primary);
}
.hub-card h3 { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
.hub-card .links { flex: 1; overflow-y: auto; padding-right: 4px; }
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
</style>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
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

// 侧边栏双/三层结构自动判断
const sidebarGroups = computed(() => {
  const sb = (theme.value && theme.value.sidebar) || {}

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
  return groups.sort((a, b) => a.name.localeCompare(b.name))
})

const sidebarTotal = computed(() => sidebarGroups.value.reduce((s, g) => s + g.items.length + g.sections.reduce((ss, sec) => ss + sec.items.length, 0), 0))
const groupCount = (g) => g.items.length + g.sections.reduce((s, sec) => s + sec.items.length, 0)
</script>

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

<div class="nav-hub" v-if="navCards.length">
  <div class="hub-card" v-for="card in navCards" :key="card.title">
    <h3>{{ card.title }}</h3>
    <div class="links">
      <a v-for="lnk in card.links" :key="lnk.link" :href="lnk.link">{{ lnk.text }}</a>
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
