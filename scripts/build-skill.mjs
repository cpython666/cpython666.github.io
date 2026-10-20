// 从资源导航、提示词、项目、工具函数和公开文章目录生成对外发布的 Agent Skill。
// 用法：node scripts/build-skill.mjs [--check]
// 文章只读取 frontmatter：会员、草稿、noindex 和他人备份不进入 Skill，也不读取任何正文。
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(ROOT, 'docs')
const SKILL_DIR = join(ROOT, 'skills', 'xingmeng-knowledge')
const SITE_URL = 'https://cpython666.github.io'
const CHECK = process.argv.includes('--check')

const SKIP_DIRS = new Set(['.vitepress', 'public', 'node_modules'])
const SKIP_PREFIXES = ['草稿箱/', '视频待办列表/', 'backup/']
const SECTION_TITLES = {
  'python': 'Python',
  'spider': '爬虫与自动化数据采集',
  'web3': 'Web3 与区块漫步',
  'life': '人生感悟与自媒体',
  'backend': '后端',
  'web': '前端',
  'tech-daily': '科技日报',
  'breakthrough-notes': '普通人的破局笔记',
  'web-intro': '网站与作者',
  '算法': '算法',
  '好文推荐': '好文推荐',
}

// 数据文件是 ESM 但仓库没有 "type": "module"，用 data URL 导入以兼容 Node 20
async function importData(file) {
  const source = readFileSync(join(DOCS, file), 'utf-8')
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`)
}

// 只读取文件开头的 frontmatter 块，读到结束分隔线就停，不碰正文
function readFrontmatter(file) {
  const fd = openSync(file, 'r')
  const buffer = Buffer.alloc(16 * 1024)
  const length = readSync(fd, buffer, 0, buffer.length, 0)
  closeSync(fd)
  const head = buffer.subarray(0, length).toString('utf-8')
  const match = head.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return null

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/)
    if (!pair) continue
    let value = pair[2].trim()
    if (/^\[.*\]$/.test(value)) {
      try { value = JSON.parse(value) } catch { /* 保留原文 */ }
    } else if (/^(["']).*\1$/.test(value)) {
      value = value.slice(1, -1)
    }
    data[pair[1]] = value
  }
  return data
}

function isMemberOnly(frontmatter) {
  return frontmatter.memberOnly === true || frontmatter.memberOnly === 'true' || String(frontmatter.privacy ?? '').includes('会员可见')
}

function listMarkdown(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : listMarkdown(join(dir, entry.name))
    return entry.name.endsWith('.md') ? [join(dir, entry.name)] : []
  })
}

function pageUrl(page) {
  const path = page.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  // 中文路径保持可读，只转义会破坏 Markdown 链接的空格和括号
  return `${SITE_URL}/${path.replace(/[ ()]/g, encodeURIComponent)}`
}

function oneLine(value = '') {
  return String(value).replace(/\s+/g, ' ').trim()
}

function collectArticles() {
  const groups = new Map()
  let memberCount = 0
  for (const file of listMarkdown(DOCS)) {
    const page = relative(DOCS, file).split(sep).join('/')
    if (page === 'index.md' || SKIP_PREFIXES.some((prefix) => page.startsWith(prefix))) continue
    const frontmatter = readFrontmatter(file)
    if (!frontmatter) continue
    if (isMemberOnly(frontmatter)) {
      memberCount += 1
      continue
    }
    if (frontmatter.noindex === 'true' || frontmatter.layout === 'home' || !frontmatter.title) continue

    const section = page.includes('/') ? page.split('/')[0] : '其他'
    if (!groups.has(section)) groups.set(section, [])
    groups.get(section).push({
      page,
      title: oneLine(frontmatter.title),
      description: oneLine(frontmatter.description),
      date: String(frontmatter.date || frontmatter.created_at || '').slice(0, 10),
      url: pageUrl(page),
    })
  }
  return { groups, memberCount }
}

function sectionOrder(section) {
  const index = Object.keys(SECTION_TITLES).indexOf(section)
  return index === -1 ? Infinity : index
}

function renderArticles({ groups }) {
  const sections = [...groups.entries()]
    .sort(([a], [b]) => sectionOrder(a) - sectionOrder(b) || a.localeCompare(b, 'zh-CN'))
    .map(([section, items]) => {
      const lines = items
        .sort((a, b) => a.page.localeCompare(b.page, 'zh-CN'))
        .map((item) => `- [${item.title}](${item.url})${item.date ? `（${item.date}）` : ''}${item.description ? `：${item.description}` : ''}`)
      return `## ${SECTION_TITLES[section] || section}\n\n${lines.join('\n')}`
    })
  const total = [...groups.values()].reduce((sum, items) => sum + items.length, 0)
  return `# 星梦启航公开文章目录\n\n共 ${total} 篇，按栏目分组，每条是“标题（日期）：摘要”。只收公开文章，会员文章和草稿不在其中。需要全文时打开链接阅读。\n\n${sections.join('\n\n')}\n`
}

function renderResources(navigationData) {
  const groups = navigationData.filter((group) => group.items?.length)
  const toc = groups.map((group) => `- ${group.title}（${group.items.length}）`).join('\n')
  const sections = groups.map((group) => {
    const lines = group.items.map((item) => {
      const tags = item.categories?.length ? ` \`${item.categories.join(' / ')}\`` : ''
      return `- [${oneLine(item.title)}](${item.link})：${oneLine(item.desc)}${tags}`
    })
    return `## ${group.title}\n\n${lines.join('\n')}`
  })
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  return `# 资源导航\n\n站长整理的 ${total} 个网站和工具，来自 ${SITE_URL}/nav/ 。每条是“名称：简介 \`标签\`”，同一网站可能出现在多个分类。\n\n## 分类目录\n\n${toc}\n\n${sections.join('\n\n')}\n`
}

function renderPrompts(prompts) {
  const byCategory = new Map()
  for (const prompt of prompts) {
    if (!byCategory.has(prompt.category)) byCategory.set(prompt.category, [])
    byCategory.get(prompt.category).push(prompt)
  }
  const sections = [...byCategory.entries()].map(([category, items]) => {
    const blocks = items.map((item) => {
      const fence = item.text.includes('```') ? '~~~~' : '```'
      return `### ${item.title}\n\n分享链接：${SITE_URL}/prompts/#${item.id}\n\n${fence}text\n${item.text}\n${fence}`
    })
    return `## ${category}\n\n${blocks.join('\n\n')}`
  })
  return `# 提示词库\n\n来自 ${SITE_URL}/prompts/ ，共 ${prompts.length} 条。\`{{变量}}\` 是需要替换的占位符。\n\n${sections.join('\n\n')}\n`
}

function renderProjects(projects) {
  const lines = projects.map((item) => {
    const tags = item.category?.length ? ` \`${item.category.join(' / ')}\`` : ''
    const video = item.video_url ? `，视频：${item.video_url}` : ''
    return `- [${oneLine(item.title)}](${item.url})${item.subtitle ? `｜${oneLine(item.subtitle)}` : ''}：${oneLine(item.description)}${video}${tags}`
  })
  return `# 站长的开源项目与教程合集\n\n来自 ${SITE_URL}/projects/ ，共 ${projects.length} 项。\n\n${lines.join('\n')}\n`
}

// 工具列表直接取自工具箱页面，保证名称、简介、直达链接与网站一致
function renderTools() {
  const source = readFileSync(join(DOCS, 'spider-tools/SpiderTools.vue'), 'utf-8')
  const tools = [...source.matchAll(/\{ name: '([^']+)', pageId: '([^']+)'[^}]*description: '([^']+)' \}/g)]
    .map(([, name, pageId, description]) => ({ name, pageId, description }))
  const scripts = {
    'curl-requests': '`node scripts/curl-to-requests.mjs`',
    'o10': '`node scripts/o10.mjs`',
  }
  const lines = tools.map((tool) => `| ${tool.name} | ${tool.description} | ${SITE_URL}/spider-tools/#${tool.pageId} | ${scripts[tool.pageId] || '用 Python 标准库或打开网页'} |`)
  return `# 在线开发工具箱

来自 ${SITE_URL}/spider-tools/ ，共 ${tools.length} 个工具，全部在浏览器本地运行。

| 工具 | 作用 | 网页直达 | 在本 Skill 中怎么用 |
| --- | --- | --- | --- |
${lines.join('\n')}

## 本地脚本

脚本与网页共用同一份函数，只依赖 Node 18+，从 Skill 根目录运行。

### cURL 转 Python Requests

\`\`\`bash
# 命令作为参数，或从标准输入读入（适合浏览器“复制为 cURL”的长命令）
node scripts/curl-to-requests.mjs "curl 'https://httpbin.org/post' -H 'Content-Type: application/json' --data-raw '{\\"a\\":1}'"
pbpaste | node scripts/curl-to-requests.mjs
\`\`\`

支持 \`-X\`、\`-H\`、\`-b\`、\`-d\` / \`--data-raw\` / \`--data-binary\` / \`--data-urlencode\` / \`--json\`、\`-F\`、\`-u\`、\`-A\`、\`-e\`、\`-x\`、\`-G\`、\`-I\`、\`-k\`。JSON 请求体输出为 \`json=\`，\`-F name=@file\` 输出为 \`files=\`。

### O10 编码解码

\`\`\`bash
node scripts/o10.mjs encode "你好"         # 标准模式：0/1 组合，大写 O 分隔
node scripts/o10.mjs encode --pro "你好"   # Pro 模式：I/l 组合，数字 1 分隔
node scripts/o10.mjs decode "<编码>"       # 加 --pro 解码 Pro 编码
\`\`\`

O10 按 Unicode 码点转二进制，与站长的 Python 原版兼容。
`
}

const STATIC_FILES = {
  'scripts/lib/curl-to-requests.mjs': 'spider-tools/utils/curlToRequests.js',
  'scripts/lib/o10.mjs': 'spider-tools/utils/o10.js',
}

async function build() {
  const [{ navigationData }, { prompts }, { projects, sortProjects }] = await Promise.all([
    importData('nav/data.js'),
    importData('prompts/prompts.js'),
    importData('projects/data.js'),
  ])
  const articles = collectArticles()

  return {
    'references/resources.md': renderResources(navigationData),
    'references/prompts.md': renderPrompts(prompts),
    'references/projects.md': renderProjects(sortProjects ? sortProjects(projects) : projects),
    'references/tools.md': renderTools(),
    'references/articles.md': renderArticles(articles),
    ...Object.fromEntries(Object.entries(STATIC_FILES).map(([target, source]) => [
      target,
      `// 由 scripts/build-skill.mjs 从 docs/${source} 复制，请修改源文件后重新生成\n${readFileSync(join(DOCS, source), 'utf-8')}`,
    ])),
    _memberCount: articles.memberCount,
  }
}

const { _memberCount, ...outputs } = await build()

if (CHECK) {
  const stale = Object.entries(outputs).filter(([file, content]) => {
    const target = join(SKILL_DIR, file)
    return !existsSync(target) || readFileSync(target, 'utf-8') !== content
  })
  if (stale.length) {
    console.error(`Skill 生成文件已过期，请运行 npm run skill:build：\n${stale.map(([file]) => `  ${file}`).join('\n')}`)
    process.exit(1)
  }
  console.log('Skill 生成文件是最新的')
} else {
  rmSync(join(SKILL_DIR, 'references'), { recursive: true, force: true })
  rmSync(join(SKILL_DIR, 'scripts/lib'), { recursive: true, force: true })
  for (const [file, content] of Object.entries(outputs)) {
    const target = join(SKILL_DIR, file)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content, 'utf-8')
  }
  console.log(`已生成 ${Object.keys(outputs).length} 个文件到 ${relative(ROOT, SKILL_DIR)}，跳过会员文章 ${_memberCount} 篇`)
}
