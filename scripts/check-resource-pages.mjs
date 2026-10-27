// Isolated public-page checks: no article files or real content loaders are read.
// Run: node scripts/check-resource-pages.mjs [--preview] [--tools-only | --projects-only]
// Compare a saved code-only snapshot: --baseline /path/to/snapshot
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, open, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

// Read one byte at a time so no member body can enter a read buffer.
async function readFrontmatter(file) {
  const byte = Buffer.alloc(1)
  const lines = []
  let line = []
  for (let offset = 0; offset < 65536; offset++) {
    const { bytesRead } = await file.read(byte, 0, 1, null)
    assert.ok(bytesRead, 'frontmatter must have a closing delimiter')
    if (byte[0] !== 10) { line.push(byte[0]); continue }
    const value = Buffer.from(line).toString('utf8').replace(/\r$/, '')
    line = []
    if (!lines.length) assert.equal(value, '---', 'page has frontmatter')
    else if (value === '---') return lines.slice(1).join('\n')
    lines.push(value)
  }
  throw new Error('frontmatter exceeds safety limit')
}
for (const newline of ['\n', '\r\n']) {
  const header = ['---', 'memberOnly: true', '---', ''].join(newline)
  const data = Buffer.from(header + 'BODY MUST NOT BE READ')
  let offset = 0
  const frontmatter = await readFrontmatter({ read: async buffer => {
    assert.ok(offset < Buffer.byteLength(header), 'frontmatter reader stops before body')
    buffer[0] = data[offset++]
    return { bytesRead: 1 }
  } })
  assert.equal(frontmatter, 'memberOnly: true')
  assert.equal(offset, Buffer.byteLength(header))
}

const root = resolve(import.meta.dirname, '..')
const toolsOnly = process.argv.includes('--tools-only')
const toolPageIds = ['curl-requests', 'url', 'base64', 'o10', 'aaencode', 'jjencode', 'imagesplit']
const projectsOnly = process.argv.includes('--projects-only')
const baselineIndex = process.argv.indexOf('--baseline')
if (baselineIndex >= 0) assert.ok(process.argv[baselineIndex + 1], '--baseline needs a code snapshot directory')
assert.ok(!toolsOnly || baselineIndex < 0, '--tools-only cannot be combined with --baseline')
assert.ok(!projectsOnly || (!toolsOnly && baselineIndex < 0), '--projects-only cannot be combined with --tools-only or --baseline')
const source = baselineIndex < 0 ? join(root, 'docs') : resolve(process.argv[baselineIndex + 1])
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'resource-pages-check-')))
let server
let browser
try {
  for (const path of ['.vitepress/theme', 'index', 'nav', 'projects', 'navigation', 'prompts', 'tools', 'sample', 'backup', 'public/css', 'screenshots']) {
    await mkdir(join(fixture, path), { recursive: true })
  }
  const homeComponents = ['index/IndexPage.vue', 'index/SponsorsLinks.vue']
  const otherComponents = ['navigation/NavIndex.vue', 'prompts/PromptPage.vue', 'prompts/prompts.js', 'utils/copy.js', 'components/SiteSelect.vue', 'components/ConfigArticleList.vue', 'components/XBackupList.vue', '.vitepress/theme/components/ArticleTools.vue', '.vitepress/theme/components/ArticleHits.vue', '.vitepress/theme/components/ArticleOutlineToggle.vue', 'tools/SpiderTools.vue', 'tools/LegacyToolRedirect.vue', 'tools/legacyRedirect.mjs', 'tools/utils/curlToRequests.js', 'tools/utils/o10.js', ...['CurlRequests', 'Url', 'Base64', 'O10', 'Aaencode', 'Jjencode', 'Imagesplit'].map(panel => `tools/components/Panel${panel}.vue`)]
  for (const path of [...homeComponents, 'nav/NavPage.vue', 'nav/WebLink.vue', 'nav/data.js', 'projects/ProjectPage.vue', 'projects/data.js', ...otherComponents]) {
    await mkdir(dirname(join(fixture, path)), { recursive: true })
    await copyFile(join(otherComponents.includes(path) ? join(root, 'docs') : source, path), join(fixture, path))
  }
  // Data modules are plain exports, with no article loaders or imports.
  const loadData = async path => import(`data:text/javascript;base64,${Buffer.from(await readFile(join(fixture, path))).toString('base64')}`)
  const { navigationData } = await loadData('nav/data.js')
  const { projects } = await loadData('projects/data.js')
  const { prompts } = await loadData('prompts/prompts.js')
  const resources = navigationData.flatMap(group => group.items.map(site => ({ ...site, section: group.title })))
  const assets = new Set(['/icons/github.svg', '/imgs/app/default.svg', '/imgs/ads/qgwl.jpeg'])
  for (const path of homeComponents) {
    const component = await readFile(join(fixture, path), 'utf8')
    for (const [, asset] of component.matchAll(/['"](\/?(?:imgs\/[^'"]+|logo_super\.svg))['"]/g)) {
      assets.add('/' + asset.replace(/^\//, ''))
    }
  }
  for (const item of [...resources, ...projects, ...prompts]) {
    for (const key of ['icon', 'image', 'qrcode', 'preview']) {
      if (typeof item[key] === 'string' && /^\/(?!\/)/.test(item[key])) assets.add(item[key])
    }
  }
  const publicRoot = join(root, 'docs/public')
  let copiedAssets = 0
  for (const asset of assets) {
    if (!/\.(svg|png|jpe?g|webp|gif|ico|avif)$/i.test(asset)) continue
    const file = resolve(publicRoot, `.${asset}`)
    assert.ok(file.startsWith(publicRoot + '/'), 'image path stays inside public')
    const destination = join(fixture, 'public', asset)
    await mkdir(dirname(destination), { recursive: true })
    try { await copyFile(file, destination); copiedAssets += 1 } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  await copyFile(join(publicRoot, 'css/index.css'), join(fixture, 'public/css/index.css'))
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, 'index.md'), '---\nlayout: home\nmarkdownStyles: false\n---\n<script setup>\nimport IndexPage from "./index/IndexPage.vue"\n</script>\n<IndexPage />\n')
  for (const [folder, component] of [['nav', 'NavPage'], ['projects', 'ProjectPage'], ['navigation', 'NavIndex'], ['prompts', 'PromptPage'], ['tools', 'SpiderTools']]) {
    const markdownStyles = ['navigation', 'prompts'].includes(folder) ? 'markdownStyles: false\n' : ''
    await writeFile(join(fixture, folder, 'index.md'), `---\nlayout: home\n${markdownStyles}---\n<script setup>\nimport ${component} from './${component}.vue'\n</script>\n<${component} />\n`)
  }
  // Only these explicitly selected public tool pages enter the fixture.
  for (const id of toolPageIds) {
    const path = join(root, 'docs/tools', id, 'index.md')
    const file = await open(path, 'r')
    let frontmatter
    try { frontmatter = await readFrontmatter(file) } finally { await file.close() }
    assert.ok(!/memberOnly:\s*['"]?true|privacy:[^\n]*会员可见/.test(frontmatter), `${id} is public`)
    await mkdir(join(fixture, 'tools', id), { recursive: true })
    await copyFile(path, join(fixture, 'tools', id, 'index.md'))
  }
  // Copy only the eight public redirect shells, after the same frontmatter guard.
  for (const id of ['', ...toolPageIds]) {
    const path = join(root, 'docs/spider-tools', id, 'index.md')
    const file = await open(path, 'r')
    let frontmatter
    try { frontmatter = await readFrontmatter(file) } finally { await file.close() }
    assert.ok(!/memberOnly:\s*['"]?true|privacy:[^\n]*会员可见/.test(frontmatter), `legacy ${id || 'root'} is public`)
    assert.match(frontmatter, /^redirect: /m, 'legacy pages declare their redirect')
    await mkdir(join(fixture, 'spider-tools', id), { recursive: true })
    await copyFile(path, join(fixture, 'spider-tools', id, 'index.md'))
  }
  await writeFile(join(fixture, 'navigation/member.data.mjs'), 'export default { load: () => [] }\n')
  await writeFile(join(fixture, 'sample/index.md'), '# 人工分类目录\n\n<script setup>\nimport ConfigArticleList from "../components/ConfigArticleList.vue"\n</script>\n<ConfigArticleList prefix="/sample/" />\n')
  await writeFile(join(fixture, 'sample/article.md'), '# 人工文章布局\n\n只使用人工文本检查布局。\n\n## 第一节\n\n这里是人工段落。\n\n## 第二节\n\n[返回首页](/)\n')
  const author = { name: '测试作者', handle: 'fixture', profileUrl: 'https://example.invalid/fixture' }
  const longURL = 'https://example.invalid/' + 'long-path-'.repeat(30)
  const archive = { source: { handle: 'fixture' }, posts: Array.from({ length: 3 }, (_, index) => ({ id: `test-${index}`, createdAt: '2026-10-01T12:00:00Z', text: `人工备份 ${index + 1}\n\n${longURL}`, url: 'https://example.invalid/post', author, comments: [{ id: `comment-${index}`, author, text: longURL, createdAt: '2026-10-01T13:00:00Z', url: 'https://example.invalid/comment' }] })) }
  await writeFile(join(fixture, 'backup/index.md'), `# 人工备份页面\n\n<script setup>\nimport XBackupList from '../components/XBackupList.vue'\nconst archive = ${JSON.stringify(archive)}\n</script>\n<XBackupList :archive="archive" />\n`)
  await writeFile(join(fixture, '.vitepress/theme/index.js'), `import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import ArticleTools from './components/ArticleTools.vue'
import ArticleHits from './components/ArticleHits.vue'
import ArticleOutlineToggle from './components/ArticleOutlineToggle.vue'
export default { extends: DefaultTheme, Layout: () => h(DefaultTheme.Layout, null, {
  'layout-bottom': () => [h(ArticleHits), h(ArticleTools)],
  'aside-outline-before': () => h(ArticleOutlineToggle),
}) }
`)
  // Keep the retained preview offline too, not just Playwright's routed requests.
  const fixtureFetch = `const fetchOriginal = window.fetch.bind(window); window.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    return fetchOriginal(url.hostname === 'api.github.com' ? '/__fixture/github' + url.pathname + url.search : input, init);
  };`
  await writeFile(join(fixture, '.vitepress/config.mjs'), `import productionConfig from ${JSON.stringify(pathToFileURL(join(root, 'docs/.vitepress/config.mjs')).href)}\nconst config = ${JSON.stringify({
    title: '首页、资源与项目检查', ignoreDeadLinks: true,
    head: [['link', { rel: 'stylesheet', href: '/css/index.css' }], ['script', {}, fixtureFetch]],
    themeConfig: {
      nav: [{ text: '测试首页', link: '/' }, { text: '资源导航', link: '/nav/' }, { text: '项目', link: '/projects/' }, { text: '文章导航', link: '/navigation/' }, { text: '提示词', link: '/prompts/' }, { text: '工具', link: '/tools/' }, { text: '目录', link: '/sample/' }, { text: '备份', link: '/backup/' }],
      sidebar: { '/sample/': [{ text: '人工分类', items: [{ text: '人工文章', link: '/sample/article' }] }], '/backup/': [{ text: '人工备份', link: '/backup/' }] },
    },
  })}
config.transformHead = context => context.pageData.frontmatter.redirect
  ? productionConfig.transformHead({ ...context, pageData: { ...context.pageData, frontmatter: { ...context.pageData.frontmatter, date: '2026-10-27' } } })
  : []
export default config\n`)
  await promisify(execFile)(process.execPath, [join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', fixture], { cwd: root })
  // Keep the duplicate Spider-Project entries near the top to exercise repository deduplication.
  const fixtureStars = { CoolBgs: 900, 'Spider-Project': 800, 'scrapy-drissionpage': 700, HandwritingGenerator: 600, LearnSpider: 500 }
  const repos = [...new Set(projects.map(project => project.url.match(/^https:\/\/(?:www\.)?github\.com\/([^/]+\/[^/#?]+)/)?.[1]).filter(Boolean))]
    .map((full_name, index) => ({ full_name, stargazers_count: fixtureStars[full_name.split('/')[1]] ?? 20 + index }))
  const output = join(fixture, '.vitepress/dist')
  if (baselineIndex < 0 && !projectsOnly) {
    const titles = new Set()
    const descriptions = new Set()
    for (const id of toolPageIds) {
      const html = await readFile(join(output, 'tools', id, 'index.html'), 'utf8')
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
      assert.ok(title && description, `${id} has static title and description`)
      titles.add(title)
      descriptions.add(description)
      assert.match(html, /class="[^"]*tool-guide/, `${id} guide is present before JavaScript runs`)
      assert.match(html, /使用|操作/, `${id} includes static usage instructions`)
      assert.match(html, /示例/, `${id} includes a static example`)
      assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, `${id} has one server-rendered h1`)
      for (const target of toolPageIds) assert.ok(html.includes(`href="/tools/${target}/"`), `${id} exposes a crawlable link to ${target}`)
      if (id !== 'o10') assert.ok(!html.includes('id="o10-input"'), `${id} does not render the unrelated O10 form`)
      if (id !== 'curl-requests') assert.ok(!html.includes('class="curl-converter"'), `${id} does not render the unrelated cURL form`)
    }
    assert.equal(titles.size, toolPageIds.length, 'tool pages have distinct static titles')
    assert.equal(descriptions.size, toolPageIds.length, 'tool pages have distinct static descriptions')
    for (const id of ['', ...toolPageIds]) {
      const html = await readFile(join(output, 'spider-tools', id, 'index.html'), 'utf8')
      assert.ok(!html.includes('class="article-hits"'), 'old redirect shells never render a hits counter')
    }
    console.log(`PASS: ${toolPageIds.length} static tool pages contain unique metadata, their own tool, crawlable links, usage instructions and examples.`)
  }
  server = createServer(async (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'")
    let pathname
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { return res.writeHead(400).end() }
    if (pathname.startsWith('/__fixture/github/')) {
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(pathname.includes('/users/') ? repos : { stargazers_count: 100 }))
    }
    const file = resolve(output, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`)
    if (!file.startsWith(output + '/')) return res.writeHead(403).end()
    try {
      const content = await readFile(file)
      res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.avif': 'image/avif' })[extname(file)] || 'application/octet-stream')
      res.end(content)
    } catch { res.writeHead(404).end() }
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const base = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', bypassCSP: true })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin === base) return route.continue()
    if (url.origin === 'https://hits.sh') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="20"/>' })
    return route.abort()
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()) })
  const countCards = async count => page.waitForFunction(count => document.querySelectorAll('.site').length === count, count)
  const noOverflow = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), label)
  const loadNextBatch = async () => {
    const before = await page.evaluate(() => {
      document.querySelector('a.site-link')?.focus({ preventScroll: true })
      const trigger = document.querySelector('.load-trigger')
      window.scrollTo({ top: scrollY + trigger.getBoundingClientRect().top - innerHeight - 200, behavior: 'instant' })
      return { count: document.querySelectorAll('.site').length, scrollY }
    })
    await countCards(Math.min(before.count + 36, resources.length))
    await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
    const after = await page.evaluate(() => ({ scrollY, sameFocus: document.activeElement === document.querySelector('a.site-link') }))
    assert.ok(after.sameFocus, 'automatic loading does not steal keyboard focus')
    assert.ok(Math.abs(after.scrollY - before.scrollY) <= 1, 'automatic loading does not move the scroll position')
  }
  // Match the real theme's selector without loading its unrelated services.
  const markZoomImages = () => page.evaluate(() => document.querySelectorAll('.vp-doc img:not(.no-zoom):not(.site-icon), .x-backup__media img').forEach(img => img.classList.add('is-zoomable')))
  const expectFeedback = async (target, message, kind = 'success') => {
    await target.waitForFunction(message => document.querySelector('.feedback-message')?.textContent === message, message)
    assert.equal(await target.locator(`.feedback-card.kind-${kind}`).count(), 1, 'feedback distinguishes success and failure')
    assert.equal(await target.locator('.tool-feedback').getAttribute('role'), 'status', 'feedback is announced without moving focus')
    const box = await target.locator('.feedback-card').boundingBox()
    const { width, height } = target.viewportSize()
    assert.ok(box && box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height < height / 2,
      `feedback is fully visible near the top of the viewport: ${JSON.stringify(box)}`)
  }
  const checkSelectKeyboard = async (target, label, outside) => {
    const trigger = target.getByRole('combobox', { name: label, exact: true })
    const list = target.getByRole('listbox', { name: label, exact: true })
    assert.equal(await target.locator('select, datalist').count(), 0, 'no browser-native dropdown remains')
    await trigger.focus()
    const original = await trigger.textContent()
    await trigger.press('Space')
    await list.waitFor()
    const options = list.getByRole('option')
    const count = await options.count()
    assert.ok(count > 1)
    const active = async index => assert.equal(await trigger.getAttribute('aria-activedescendant'), await options.nth(index).getAttribute('id'))
    await trigger.press('End'); await active(count - 1)
    await trigger.press('ArrowUp'); await active(count - 2)
    await trigger.press('Home'); await active(0)
    await trigger.press('ArrowDown'); await active(1)
    await trigger.press('Escape')
    assert.equal(await list.count(), 0, 'Escape dismisses the menu')
    assert.equal(await trigger.textContent(), original, 'Escape does not select the highlighted option')
    assert.ok(await trigger.evaluate(element => document.activeElement === element), 'Escape keeps the trigger focused')
    await trigger.press('Enter')
    await trigger.press('Home')
    await trigger.press('ArrowDown')
    const chosen = (await options.nth(1).textContent()).trim()
    await trigger.press('Enter')
    assert.equal((await trigger.textContent()).trim(), chosen, 'Enter selects the highlighted option')
    assert.equal(await list.count(), 0)
    assert.ok(await trigger.evaluate(element => document.activeElement === element), 'selection returns focus to the trigger')
    await trigger.press('ArrowUp')
    await list.waitFor()
    await trigger.press('Tab')
    assert.equal(await list.count(), 0, 'Tab dismisses without trapping focus')
    assert.ok(await trigger.evaluate(element => document.activeElement !== element))
    await trigger.click()
    await outside.click()
    assert.equal(await list.count(), 0, 'outside click dismisses')
    await trigger.click()
    await options.first().click()
    assert.ok(await trigger.evaluate(element => document.activeElement === element), 'pointer selection returns focus')
  }
  const toolIds = []
  if (baselineIndex < 0 && !projectsOnly) {
    const toolPage = await context.newPage()
    toolPage.setDefaultTimeout(10000)
    toolPage.on('pageerror', error => errors.push(error.message))
    toolPage.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()) })
    await toolPage.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async text => {
          if (window.__failCopy) throw new Error('fixture clipboard failure')
          window.__copiedText = text
        },
      } })
    })
    await toolPage.goto(base + '/tools/', { waitUntil: 'networkidle' })
    const tools = await toolPage.locator('.nav-list a').evaluateAll(links => links.map(link => ({
      id: link.pathname.split('/').filter(Boolean).at(-1), name: link.querySelectorAll('span')[1].textContent.trim(),
    })))
    toolIds.push(...tools.map(tool => tool.id))
    assert.deepEqual(toolIds, toolPageIds, 'each tool has a unique crawlable page link')
    for (const id of ['curl-requests', 'url', 'base64', 'o10', 'aaencode', 'jjencode', 'imagesplit']) {
      assert.ok(toolIds.includes(id), `${id} remains available`)
    }
    const expectTool = async (id, standalone = true) => {
      await toolPage.waitForFunction(({ id, standalone }) => {
        const panel = document.querySelector('.panel-card')
        return panel?.id === id && document.querySelector('.nav-list li.active a')?.pathname === `/tools/${id}/`
          && (!standalone || location.pathname === `/tools/${id}/`)
      }, { id, standalone })
      assert.equal(await toolPage.locator('.panel-card').count(), 1, 'one active tool panel is rendered')
      assert.equal(await toolPage.locator('select, datalist').count(), 0, `${id} has no native dropdown`)
      assert.equal(await toolPage.locator('.tools-page h1').count(), 1, 'tool pages have one accessible h1')
      await toolPage.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
      if (standalone) assert.ok(await toolPage.locator('.tool-guide').textContent(), `${id} has a rendered guide`)
      if (standalone && toolPage.viewportSize().width <= 768) {
        const bounds = await toolPage.locator('.panel-card').boundingBox()
        const navBottom = await toolPage.locator('.VPNav').evaluate(nav => getComputedStyle(nav).position === 'fixed' ? nav.getBoundingClientRect().bottom : 0)
        assert.ok(bounds?.y >= navBottom - 1 && bounds.y < toolPage.viewportSize().height, `${id} mobile entry is visible below navigation: ${JSON.stringify({ bounds, navBottom })}`)
      }
    }
    const followToolLink = href => toolPage.evaluate(href => {
      const link = document.createElement('a')
      link.href = href
      document.body.appendChild(link)
      link.click()
      link.remove()
    }, href)
    for (const tool of tools) {
      await toolPage.locator(`.nav-list a[href="/tools/${tool.id}/"]`).click()
      await expectTool(tool.id)
      const description = (await toolPage.locator('.tool-description').textContent()).trim()
      assert.ok(description, `${tool.id} has a share description`)
      tool.description = description
      if (tool.id === 'curl-requests') {
        await toolPage.getByRole('textbox', { name: 'cURL 命令', exact: true }).fill("curl 'https://example.com/tool-route-check' -H 'Accept: application/json'")
        await toolPage.getByRole('button', { name: /立即转换/ }).click()
        assert.match(await toolPage.locator('.code-output').textContent(), /https:\/\/example\.com\/tool-route-check/)
        assert.match(await toolPage.locator('.code-output').textContent(), /import requests/)
      }
      assert.equal(new URL(await toolPage.locator('.article-hits img').getAttribute('src')).pathname,
        `/cpython666.github.io/spider-tools/${tool.id}.svg`, 'new URL keeps its historical hits counter')
      if (tool.id === 'url') await toolPage.locator('.panel-card textarea:visible').first().fill('private-fixture-input')
      const share = `${tool.name}\n${description}\nhttps://cpython666.github.io/tools/${tool.id}/`
      await toolPage.getByRole('button', { name: `分享工具：${tool.name}`, exact: true }).click()
      await toolPage.waitForFunction(text => window.__copiedText === text, share)
      await expectFeedback(toolPage, '工具简介和直达链接已复制！')
      assert.equal(share.split('\n').length, 3, 'sharing contains only name, description and canonical URL')
      await toolPage.goto('about:blank')
      await toolPage.goto(`${base}/tools/${tool.id}/`, { waitUntil: 'networkidle' })
      await expectTool(tool.id)
      await toolPage.goto(`${base}/tools/?source=legacy#${tool.id}`, { waitUntil: 'networkidle' })
      await expectTool(tool.id)
      assert.equal(new URL(toolPage.url()).search, '?source=legacy', 'legacy link preserves the query')
      assert.equal(new URL(toolPage.url()).hash, '', 'legacy tool hash is removed')
      await toolPage.reload({ waitUntil: 'networkidle' })
      await expectTool(tool.id)
    }
    // Old physical URLs must work both before hydration and through VitePress navigation.
    for (const id of ['', ...toolPageIds]) {
      const suffix = id ? `${id}/` : ''
      const target = `/tools/${suffix}`
      const expectedId = id || toolPageIds[0]
      const hash = id ? '#usage-guide' : '#unknown-tool'
      await toolPage.goto(`${base}/spider-tools/${suffix}?source=old-direct${hash}`, { waitUntil: 'networkidle' })
      await toolPage.waitForURL(`${base}${target}?source=old-direct${hash}`)
      await expectTool(expectedId, !!id)
      await toolPage.goto(`${base}/sample/article.html`, { waitUntil: 'networkidle' })
      await followToolLink(`/spider-tools/${suffix}?source=old-spa${hash}`)
      await toolPage.waitForURL(`${base}${target}?source=old-spa${hash}`)
      await expectTool(expectedId, !!id)
      await toolPage.goBack()
      await toolPage.waitForURL(`${base}/sample/article.html`)
      await toolPage.goto(`${base}/spider-tools/${suffix}index.html?source=old-alias${hash}`, { waitUntil: 'networkidle' })
      await toolPage.waitForURL(`${base}${target}?source=old-alias${hash}`)
      await expectTool(expectedId, !!id)
    }
    for (const id of toolPageIds) {
      await toolPage.goto(`${base}/spider-tools/?source=old-hash#${id}`, { waitUntil: 'networkidle' })
      await toolPage.waitForURL(`${base}/tools/${id}/?source=old-hash`)
      await expectTool(id)
    }
    await toolPage.goto(`${base}/sample/article.html`, { waitUntil: 'networkidle' })
    await followToolLink('/spider-tools/index.html?source=old-spa-hash#url')
    await toolPage.waitForURL(`${base}/tools/url/?source=old-spa-hash`)
    await expectTool('url')
    // The static meta refresh remains usable when JavaScript is disabled.
    const noJs = await browser.newContext({ javaScriptEnabled: false })
    await noJs.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    const noJsPage = await noJs.newPage()
    for (const id of ['', toolPageIds[0]]) {
      const suffix = id ? `${id}/` : ''
      await noJsPage.goto(`${base}/spider-tools/${suffix}`, { waitUntil: 'domcontentloaded' })
      await noJsPage.waitForURL(`${base}/tools/${suffix}`)
      await noJsPage.locator('.tools-page').waitFor()
    }
    await noJs.close()
    await toolPage.evaluate(() => { window.__failCopy = true })
    await toolPage.locator('.share-tool').click()
    await expectFeedback(toolPage, '复制失败，请重试。', 'error')
    await toolPage.evaluate(() => { window.__failCopy = false })
    const fallbackCopy = await context.newPage()
    fallbackCopy.on('pageerror', error => errors.push(error.message))
    await fallbackCopy.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
      document.execCommand = command => {
        if (command !== 'copy') return false
        window.__copiedText = document.activeElement.value
        return true
      }
    })
    await fallbackCopy.goto(`${base}/tools/#${tools[0].id}`, { waitUntil: 'networkidle' })
    await fallbackCopy.locator('.share-tool').click()
    assert.equal(await fallbackCopy.evaluate(() => window.__copiedText), `${tools[0].name}\n${tools[0].description}\nhttps://cpython666.github.io/tools/${tools[0].id}/`, 'legacy clipboard fallback preserves all three lines')
    await fallbackCopy.close()
    await toolPage.goto(`${base}/tools/#${toolIds[0]}`, { waitUntil: 'networkidle' })
    for (const id of toolIds.slice(1, 3)) {
      await toolPage.locator(`.nav-list a[href="/tools/${id}/"]`).click()
      await expectTool(id)
    }
    await toolPage.goBack()
    await expectTool(toolIds[1])
    await toolPage.goForward()
    await expectTool(toolIds[2])
    await toolPage.goto(base + '/tools/#unknown-tool', { waitUntil: 'networkidle' })
    await expectTool(toolIds[0], false)
    // Same-component query navigation uses pushState and emits no native hashchange.
    await toolPage.goto(`${base}/tools/`, { waitUntil: 'networkidle' })
    await followToolLink('/tools/?source=same-page#o10')
    await expectTool('o10')
    assert.equal(new URL(toolPage.url()).search, '?source=same-page', 'same-component legacy navigation preserves query')
    assert.equal(new URL(toolPage.url()).hash, '', 'same-component legacy navigation replaces the old hash')
    await toolPage.goBack()
    await toolPage.waitForURL(`${base}/tools/`)
    // Independent page heading anchors remain local, including after a SPA query update.
    await toolPage.goto(`${base}/tools/o10/`, { waitUntil: 'networkidle' })
    await expectTool('o10')
    const guideId = await toolPage.locator('.tool-guide h2').nth(1).getAttribute('id')
    assert.ok(guideId, 'guide headings expose linkable anchors')
    const guideURL = `${base}/tools/o10/?source=guide#${encodeURIComponent(guideId)}`
    const guideTimeOrigin = await toolPage.evaluate(() => performance.timeOrigin)
    await followToolLink(guideURL)
    await toolPage.waitForURL(guideURL)
    await expectTool('o10')
    assert.equal(await toolPage.evaluate(() => performance.timeOrigin), guideTimeOrigin, 'guide anchor/query updates stay in the same document')
    await toolPage.reload({ waitUntil: 'networkidle' })
    await expectTool('o10')
    assert.equal(decodeURIComponent(new URL(toolPage.url()).hash.slice(1)), guideId, 'guide anchor survives a direct reload')
    await toolPage.goto(`${base}/spider-tools/o10/?source=old-guide#${encodeURIComponent(guideId)}`, { waitUntil: 'networkidle' })
    await toolPage.waitForURL(`${base}/tools/o10/?source=old-guide#${encodeURIComponent(guideId)}`)
    await expectTool('o10')
    // A recognized legacy tool ID must not redirect away from an independent tool page.
    await followToolLink('/tools/o10/?source=guide#base64')
    await toolPage.waitForURL(`${base}/tools/o10/?source=guide#base64`)
    await expectTool('o10')
    // An old bookmarked hash is replaced, so Back returns to the previous real page.
    await toolPage.goto(`${base}/sample/article.html`, { waitUntil: 'networkidle' })
    await followToolLink(`/tools/?source=fixture#${toolIds.at(-1)}`)
    await expectTool(toolIds.at(-1))
    await toolPage.goBack()
    await toolPage.waitForURL(`${base}/sample/article.html`)
    await toolPage.goForward()
    await expectTool(toolIds.at(-1))
    const timeOrigin = await toolPage.evaluate(() => performance.timeOrigin)
    await toolPage.getByRole('textbox', { name: '搜索工具', exact: true }).fill('no-matching-tool')
    await followToolLink('/tools/url/?source=fixture')
    await expectTool('url')
    assert.equal(await toolPage.getByRole('textbox', { name: '搜索工具', exact: true }).inputValue(), '', 'opening another tool clears the old search')
    assert.equal(await toolPage.locator('.nav-list a').count(), tools.length)
    assert.equal(await toolPage.evaluate(() => performance.timeOrigin), timeOrigin, 'tool links use SPA navigation')
    await toolPage.locator('.share-tool').click()
    const sharedTool = tools.find(tool => tool.id === 'url')
    await toolPage.waitForFunction(text => window.__copiedText === text, `${sharedTool.name}\n${sharedTool.description}\nhttps://cpython666.github.io/tools/url/`)
    const urlInput = toolPage.locator('#url-input')
    const urlEncoded = toolPage.locator('#url-encoded')
    const urlDecoded = toolPage.locator('#url-decoded')
    const copyEncoded = toolPage.getByRole('button', { name: '复制编码结果', exact: true })
    const copyDecoded = toolPage.getByRole('button', { name: '复制解码结果', exact: true })
    const initialUrlInput = await urlInput.inputValue()
    assert.ok(initialUrlInput, 'URL tool starts with a useful example')
    assert.equal(await urlEncoded.inputValue(), encodeURIComponent(initialUrlInput), 'initial URL encoding is populated')
    assert.equal(await urlDecoded.inputValue(), decodeURIComponent(initialUrlInput), 'initial URL decoding is populated')
    assert.equal(await urlEncoded.evaluate(element => element.readOnly), true)
    assert.equal(await urlDecoded.evaluate(element => element.readOnly), true)
    const urlText = '你好😀\nA+B &/=?#'
    const urlPercentText = '%E4%BD%A0%E5%A5%BD%F0%9F%98%80%0AA%2BB%20%26%2F%3D%3F%23'
    await urlInput.fill(urlText)
    assert.equal(await urlEncoded.inputValue(), urlPercentText, 'URL encoding handles Unicode, newlines and reserved characters')
    assert.equal(await urlDecoded.inputValue(), urlText, 'plain text and plus signs stay intact while decoding')
    await urlInput.fill(urlPercentText)
    assert.equal(await urlDecoded.inputValue(), urlText, 'URL decoding restores Unicode and newlines')
    for (const [button, result, message] of [
      [copyEncoded, encodeURIComponent(urlPercentText), '编码结果已复制到剪贴板'],
      [copyDecoded, urlText, '解码结果已复制到剪贴板'],
    ]) {
      const readyLabel = (await button.textContent()).trim()
      await button.click()
      await toolPage.waitForFunction(text => window.__copiedText === text, result)
      await expectFeedback(toolPage, message)
      assert.match(await button.textContent(), /已复制/, 'URL copy button confirms success')
      await toolPage.evaluate(() => { window.__failCopy = true })
      await button.click()
      await expectFeedback(toolPage, '复制失败，请选中结果手动复制。', 'error')
      assert.match(await button.textContent(), /复制失败/, 'URL copy button confirms failure')
      await toolPage.evaluate(() => { window.__failCopy = false })
      await urlInput.fill(urlPercentText + '%21')
      assert.equal((await button.textContent()).trim(), readyLabel, 'editing resets URL copy feedback on the button')
      await urlInput.fill(urlPercentText)
    }
    const errorsBeforeInvalidUrl = errors.length
    for (const invalid of ['%', '%2', '%GG', '%FF', '%E4%B8']) {
      await urlInput.fill(invalid)
      assert.equal(await urlDecoded.inputValue(), '', `invalid URL input ${invalid} clears the old decoding`)
      assert.equal(await copyDecoded.isDisabled(), true, 'an invalid decoding cannot be copied')
      assert.ok((await toolPage.locator('#url-decode-error').textContent()).trim(), 'invalid URL encoding has a visible explanation')
      assert.equal(await urlEncoded.inputValue(), encodeURIComponent(invalid), 'encoding remains usable when decoding fails')
      assert.equal(await copyEncoded.isDisabled(), false)
      await urlInput.fill('a+b%20c')
      assert.equal(await urlDecoded.inputValue(), 'a+b c', 'corrected URL input recovers and preserves literal plus signs')
      assert.equal(await copyDecoded.isDisabled(), false)
      assert.equal(await toolPage.locator('#url-decode-error').count(), 0, 'correcting input removes the error')
    }
    assert.equal(errors.length, errorsBeforeInvalidUrl, 'invalid URL input does not throw a browser error')
    await urlInput.fill('')
    assert.equal(await urlEncoded.inputValue(), '')
    assert.equal(await urlDecoded.inputValue(), '')
    assert.equal(await copyEncoded.isDisabled(), true)
    assert.equal(await copyDecoded.isDisabled(), true)
    assert.equal(await toolPage.locator('#url-encode-error, #url-decode-error').count(), 0, 'empty URL input clears errors')
    await toolPage.locator('.nav-list a[href="/tools/o10/"]').click()
    await expectTool('o10')
    const o10 = toolPage.locator('.o10-tool')
    await checkSelectKeyboard(toolPage, '编码模式', toolPage.locator('.tool-description'))
    for (const [mode, encoded, separator] of [['standard', '1000001O1000010', 'O'], ['pro', 'IlllllI1IllllIl', '1']]) {
      await o10.getByRole('combobox', { name: '编码模式' }).click()
      await o10.getByRole('option', { name: mode === 'pro' ? /^Pro/ : /^标准 O10/ }).click()
      await o10.locator('#o10-input').fill('AB')
      await o10.getByRole('button', { name: '编码', exact: true }).click()
      assert.equal(await o10.locator('#o10-output').inputValue(), encoded, `${mode} UI encodes AB`)
      await o10.getByRole('button', { name: '复制结果', exact: true }).click()
      await toolPage.waitForFunction(text => window.__copiedText === text, encoded)
      await expectFeedback(toolPage, '处理结果已复制到剪贴板')
      assert.equal(await o10.getByRole('button', { name: '复制结果', exact: true }).textContent(), '已复制 ✓')
      await o10.getByRole('button', { name: '结果用作输入', exact: true }).click()
      assert.equal(await o10.locator('#o10-input').inputValue(), encoded)
      assert.equal(await o10.locator('#o10-output').inputValue(), '')
      assert.equal(await o10.getByRole('button', { name: '复制结果', exact: true }).textContent(), '复制结果', 'editing/reusing resets the button')
      await o10.getByRole('button', { name: '解码', exact: true }).click()
      assert.equal(await o10.locator('#o10-output').inputValue(), 'AB', `${mode} UI decodes reused output`)
      await o10.locator('#o10-input').fill(encoded + separator)
      await o10.getByRole('button', { name: '解码', exact: true }).click()
      assert.equal(await o10.locator('#o10-output').inputValue(), '', 'invalid input cannot leave a stale result')
      assert.match(await o10.locator('.notice').textContent(), /不能有空分段/)
      assert.equal(await o10.getByRole('button', { name: '复制结果', exact: true }).isDisabled(), true)
    }
    await o10.locator('#o10-input').fill('failure-check')
    await o10.getByRole('button', { name: '编码', exact: true }).click()
    await toolPage.evaluate(() => { window.__failCopy = true })
    await o10.getByRole('button', { name: '复制结果', exact: true }).click()
    await expectFeedback(toolPage, '复制失败，请选中结果手动复制。', 'error')
    assert.equal(await o10.getByRole('button', { name: '复制结果', exact: true }).textContent(), '复制失败')
    await toolPage.evaluate(() => { window.__failCopy = false })
    await toolPage.getByRole('button', { name: '关闭提示' }).click()
    assert.equal(await toolPage.locator('.feedback-card').count(), 0, 'feedback can be dismissed')
    // Timers are isolated from all other page clocks and layout checks.
    const timingContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    await timingContext.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    const timed = await timingContext.newPage()
    timed.on('pageerror', error => errors.push(error.message))
    await timed.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } }))
    await timed.goto(`${base}/tools/o10/`, { waitUntil: 'networkidle' })
    await timed.clock.install()
    await timed.locator('.share-tool').click()
    await expectFeedback(timed, '工具简介和直达链接已复制！')
    await timed.clock.runFor(3000)
    await timed.locator('.share-tool').click()
    await timed.clock.runFor(1500)
    assert.equal(await timed.locator('.feedback-card').count(), 1, 'repeated clicks restart the notice timer without stacking')
    await timed.clock.runFor(2501)
    assert.equal(await timed.locator('.feedback-card').count(), 0, 'success feedback expires after four seconds')
    await timed.locator('.share-tool').click()
    const closeFeedback = timed.getByRole('button', { name: '关闭提示' })
    await closeFeedback.focus()
    await timed.clock.runFor(5000)
    assert.equal(await timed.locator('.feedback-card').count(), 1, 'focused feedback stays available beyond its expiry')
    await closeFeedback.press('Enter')
    assert.equal(await timed.locator('.feedback-card').count(), 0, 'keyboard activation dismisses feedback')
    assert.ok(await timed.locator('.share-tool').evaluate(element => document.activeElement === element), 'keyboard dismissal restores the triggering button')
    await timed.locator('.share-tool').click()
    await closeFeedback.focus()
    await closeFeedback.press('Tab')
    assert.ok(await timed.locator('.tool-feedback').evaluate(element => !element.contains(document.activeElement)), 'Tab leaves feedback without trapping focus')
    await timed.clock.runFor(4001)
    assert.equal(await timed.locator('.feedback-card').count(), 0, 'feedback expires after focus leaves')
    await timed.locator('.nav-list a[href="/tools/curl-requests/"]').click()
    await timed.locator('.copy-button').click()
    await expectFeedback(timed, 'Python 代码已复制到剪贴板')
    assert.match(await timed.locator('.copy-button').textContent(), /已复制/)
    await timingContext.close()
    for (const width of [320, 390]) {
      await toolPage.setViewportSize({ width, height: 844 })
      await toolPage.goto(`${base}/tools/o10/`, { waitUntil: 'networkidle' })
      await expectTool('o10')
      for (const tool of tools) {
        await toolPage.locator(`.nav-list a[href="/tools/${tool.id}/"]`).click()
        await expectTool(tool.id)
        const layout = await toolPage.locator('.tool-sharebar').evaluate(bar => {
          const bounds = bar.getBoundingClientRect()
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clipped: [...bar.children].some(child => {
              const box = child.getBoundingClientRect()
              return box.left < bounds.left - 1 || box.right > bounds.right + 1
                || box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1 || child.scrollWidth > child.clientWidth + 1
            }),
          }
        })
        assert.ok(layout.scrollWidth <= width && !layout.clipped, `${tool.id} share bar fits at ${width}px`)
        if (tool.id === 'o10') {
          for (const dark of [false, true]) {
            await toolPage.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark)
            await o10.getByRole('combobox', { name: '编码模式' }).click()
            const menu = await o10.getByRole('listbox').boundingBox()
            assert.ok(menu && menu.x >= 0 && menu.x + menu.width <= width && menu.y >= 0 && menu.y + menu.height <= 844,
              `O10 ${dark ? 'dark' : 'light'} menu fits the ${width}px viewport`)
            await o10.getByRole('option', { name: /^Pro/ }).click()
          }
          await o10.getByRole('button', { name: '编码', exact: true }).click()
          await o10.getByRole('button', { name: '复制结果', exact: true }).click()
          await expectFeedback(toolPage, '处理结果已复制到剪贴板')
          assert.equal(await o10.evaluate(element => {
            const panel = element.getBoundingClientRect()
            return [...element.querySelectorAll('select, textarea, button')].some(control => {
              const bounds = control.getBoundingClientRect()
              return bounds.left < panel.left - 1 || bounds.right > panel.right + 1
            })
          }), false, `O10 controls fit at ${width}px`)
        }
      }
      await toolPage.locator('.share-tool').click()
      await expectFeedback(toolPage, '工具简介和直达链接已复制！')
      const notice = await toolPage.locator('.feedback-card').boundingBox()
      assert.ok(notice?.x >= 0 && notice.x + notice.width <= width, `share feedback fits at ${width}px`)
    }
    await toolPage.setViewportSize({ width: 320, height: 844 })
    await toolPage.goto(`${base}/nav/`, { waitUntil: 'networkidle' })
    await checkSelectKeyboard(toolPage, '资源分类', toolPage.locator('.resource-stats'))
    for (const dark of [false, true]) {
      await toolPage.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark)
      const trigger = toolPage.getByRole('combobox', { name: '资源分类' })
      await trigger.click()
      await trigger.press('End')
      const menu = toolPage.getByRole('listbox', { name: '资源分类' })
      const bounds = await menu.boundingBox()
      assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 320 && bounds.y >= 0 && bounds.y + bounds.height <= 844, 'long category menu fits mobile viewport')
      const scroll = await menu.evaluate(element => ({ top: element.scrollTop, height: element.clientHeight, total: element.scrollHeight }))
      assert.ok(scroll.top > 0 && scroll.total > scroll.height, 'End scrolls long menu to the last option')
      const last = await menu.getByRole('option').last().boundingBox()
      assert.ok(last && last.y >= bounds.y - 1 && last.y + last.height <= bounds.y + bounds.height + 1, 'last category is visible')
      await trigger.press('Home')
      await trigger.press('Space')
      assert.equal(await menu.count(), 0)
    }
    await toolPage.close()
    assert.deepEqual(errors, [])
    console.log(`PASS: ${tools.length} tools; three-line canonical sharing without user input; clipboard success/failure/legacy fallback; independent direct links and reload; old namespace direct/SPA/index aliases, preserved query/hash and no-JS redirects; SPA navigation/history; legacy hash replacement/query preservation, same-component query/hash navigation, guide anchor preservation and unknown fallback; O10 standard/Pro encoding, copying, output reuse/decoding and invalid-input feedback; custom selection keyboard/focus/outside-click and long-list controls; light/dark 320/390px controls, share bars and visible feedback; copy errors, repeat/dismiss/expiry and safe frontmatter-only reads.`)
  }
  if (!toolsOnly && !projectsOnly) await page.goto(`${base}/nav/`, { waitUntil: 'networkidle' })
  const initial = toolsOnly || projectsOnly ? null : await page.evaluate(() => ({
    cards: document.querySelectorAll('.site').length,
    elements: document.querySelectorAll('*').length,
    cardCheckboxes: document.querySelectorAll('.site input[type="checkbox"]').length,
    tooltips: document.querySelectorAll('.tooltip').length,
  }))
  if (!toolsOnly && !projectsOnly) console.log(`${baselineIndex < 0 ? 'Current' : 'Baseline'} initial resource DOM: ${JSON.stringify(initial)}; data: ${resources.length} resources / ${navigationData.length} categories; copied ${copiedAssets} referenced images.`)
  if (baselineIndex < 0 && !toolsOnly) {
    const detection = navigationData.find(group => group.title === 'AI模型检测')
    if (!projectsOnly) {
      assert.equal(initial.cards, Math.min(36, resources.length))
      assert.equal(await page.locator('.load-more').count(), 0, 'supported browsers load without a button')
      await loadNextBatch()
      const search = page.getByRole('searchbox', { name: '搜索资源' })
      // Each query exercises a distinct supported field using real public resource metadata.
      for (const query of ['ModelTrace', '生成挑战提取输出指纹', '模型归因', 'github.com/xqy2006/ModelTrace', 'PYTHON']) {
        const matches = resources.filter(site => [site.section, site.title, site.desc, site.link, ...(site.categories || [])].join(' ').toLowerCase().includes(query.toLowerCase()))
        assert.ok(matches.length > 0, `query has a fixture match: ${query}`)
        await search.fill(query)
        await countCards(Math.min(36, matches.length))
        assert.deepEqual(await page.locator('a.site-link').evaluateAll(links => links.map(link => link.getAttribute('href'))), matches.slice(0, 36).map(site => site.link))
      }
      await search.fill('resource-that-does-not-exist-319c')
      await countCards(0)
      await page.getByRole('button', { name: '清除筛选' }).click()
      await countCards(Math.min(36, resources.length))
      await page.locator('.resource-sidebar .category-button').filter({ hasText: 'AI模型检测' }).click()
      await countCards(detection.items.length)
      assert.equal(decodeURIComponent(new URL(page.url()).hash), '#AI模型检测')
      await search.fill('Python')
      assert.equal(new URL(page.url()).hash, '', 'typing searches all categories')
      for (const hash of ['AI模型检测', '站长推荐', 'unknown-category']) {
        await page.goto(`${base}/nav/#${encodeURIComponent(hash)}`, { waitUntil: 'networkidle' })
        await countCards(hash === 'AI模型检测' ? detection.items.length : hash === '站长推荐' ? 0 : Math.min(36, resources.length))
        if (hash === '站长推荐') assert.equal(await page.locator('.sponsor-banner').count(), 1)
        await page.reload({ waitUntil: 'networkidle' })
        await countCards(hash === 'AI模型检测' ? detection.items.length : hash === '站长推荐' ? 0 : Math.min(36, resources.length))
      }
      await page.goto(`${base}/nav/`, { waitUntil: 'networkidle' })
      for (let count = 36; count < resources.length; count += 36) {
        await loadNextBatch()
      }
      assert.equal(await page.locator('.load-trigger').count(), 0, 'last batch exhausts all resources')
      await search.fill('ModelTrace')
      await page.getByRole('button', { name: '清除搜索', exact: true }).click()
      await countCards(Math.min(36, resources.length))
      await page.locator('.site-icon').first().evaluate(img => { img.src = '/__fixture/broken-icon.png' })
      await page.waitForFunction(() => {
        const img = document.querySelector('.site-icon')
        return img?.getAttribute('src') === '/icons/github.svg' && img.naturalWidth > 0
      })
      const fallback = await context.newPage()
      fallback.on('pageerror', error => errors.push(error.message))
      await fallback.addInitScript(() => { window.IntersectionObserver = undefined })
      await fallback.goto(`${base}/nav/`, { waitUntil: 'networkidle' })
      assert.equal(await fallback.locator('.site').count(), Math.min(36, resources.length))
      await fallback.locator('.load-more').focus()
      await fallback.keyboard.press('Enter')
      await fallback.waitForFunction(() => document.activeElement === document.querySelectorAll('a.site-link')[36])
      assert.equal(await fallback.locator('.site').count(), Math.min(72, resources.length), 'manual keyboard fallback works without IntersectionObserver')
      await fallback.close()
    }
    await page.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await page.locator('.star-status.ready').waitFor()
    assert.equal(await page.locator('.cards .card').count(), projects.length)
    const topProjects = ['CoolBgs', 'IPProxyPool', 'scrapy-drissionpage', 'HandwritingGenerator', 'LearnSpider']
      .map(title => projects.find(project => project.title === title))
    assert.ok(topProjects.every(Boolean), 'ranked fixtures refer to existing public project metadata')
    const checkSlide = async (target, project) => {
      assert.equal(await target.locator('.featured h2').textContent(), project.title)
      assert.equal(await target.locator('.featured-actions .btn.primary').getAttribute('href'), project.url)
      assert.equal(await target.locator('.featured-image').getAttribute('href'), project.url)
      assert.equal(await target.locator('.featured-image img').getAttribute('src'), project.image)
      assert.equal(await target.locator('.featured-image img').getAttribute('alt'), project.title)
    }
    const cacheKey = 'stardream:github-stars:v1'
    const cachedStars = Object.fromEntries(repos.map(repo => [repo.full_name.toLowerCase(), repo.stargazers_count]))
    cachedStars['cpython666/coolbgs'] = 950
    const staleCache = { time: Date.now() - 7 * 60 * 60 * 1000, stars: cachedStars }
    const cachePage = async (cache, storageFailure) => {
      const target = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
      target.setDefaultTimeout(10000)
      target.on('pageerror', error => errors.push(error.message))
      await target.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
      await target.goto(`${base}/sample/`, { waitUntil: 'networkidle' })
      if (cache !== undefined) await target.evaluate(({ key, value }) => localStorage.setItem(key, value), {
        key: cacheKey, value: typeof cache === 'string' ? cache : JSON.stringify(cache),
      })
      if (storageFailure) await target.addInitScript(({ key, method }) => {
        const original = Storage.prototype[method]
        Storage.prototype[method] = function (name, ...args) {
          if (name === key) throw new DOMException('Storage disabled for this check', 'SecurityError')
          return original.call(this, name, ...args)
        }
      }, { key: cacheKey, method: storageFailure })
      return target
    }
    const readCache = target => target.evaluate(key => localStorage.getItem(key), cacheKey)
    const cardStars = (target, title) => target.locator('.cards .card')
      .filter({ has: target.getByRole('heading', { name: title, exact: true }) }).locator('.star-pill').textContent()

    const freshCache = { ...staleCache, time: Date.now() }
    const fresh = await cachePage(freshCache)
    let freshRequests = 0
    await fresh.route('**/__fixture/github/**', route => { freshRequests += 1; return route.continue() })
    await fresh.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await fresh.locator('.star-status.cached').waitFor()
    assert.equal(await cardStars(fresh, 'CoolBgs'), '★ 950', 'fresh cache renders without requesting GitHub')
    await fresh.reload({ waitUntil: 'networkidle' })
    await fresh.locator('.star-status.cached').waitFor()
    const freshOrigin = await fresh.evaluate(() => performance.timeOrigin)
    await fresh.locator('.VPNavBar').getByRole('link', { name: '目录', exact: true }).click()
    await fresh.waitForURL(`${base}/sample/`)
    await fresh.locator('.VPNavBar').getByRole('link', { name: '项目', exact: true }).click()
    await fresh.locator('.star-status.cached').waitFor()
    assert.equal(await fresh.evaluate(() => performance.timeOrigin), freshOrigin, 'cache also works after SPA remount')
    assert.equal(freshRequests, 0, 'fresh cache suppresses all Stars API requests across reload and SPA navigation')
    assert.deepEqual(JSON.parse(await readCache(fresh)), freshCache, 'cache reads do not extend its lifetime')
    await fresh.close()

    const stale = await cachePage(staleCache)
    let releaseRefresh
    const refreshGate = new Promise(resolve => { releaseRefresh = resolve })
    await stale.route('**/__fixture/github/**', async route => { await refreshGate; await route.continue() })
    const refreshRequest = stale.waitForRequest('**/__fixture/github/**')
    await stale.goto(`${base}/projects/`, { waitUntil: 'domcontentloaded' })
    await refreshRequest
    await stale.locator('.star-status.cached').waitFor()
    assert.equal(await cardStars(stale, 'CoolBgs'), '★ 950', 'expired count remains visible while refresh is pending')
    await checkSlide(stale, topProjects[0])
    assert.deepEqual(await stale.getByRole('button', { name: /^查看项目：/ }).evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label'))),
      topProjects.map(project => `查看项目：${project.title}`), 'expired cache still supplies the carousel ranking')
    assert.deepEqual(JSON.parse(await readCache(stale)), staleCache, 'pending refresh does not extend cache time')
    releaseRefresh()
    await stale.locator('.star-status.ready').waitFor()
    assert.equal(await cardStars(stale, 'CoolBgs'), '★ 900', 'successful background refresh updates the visible count')
    const refreshedCache = JSON.parse(await readCache(stale))
    assert.equal(refreshedCache.stars['cpython666/coolbgs'], 900)
    assert.ok(refreshedCache.time > staleCache.time, 'successful refresh persists a new timestamp')
    await stale.reload({ waitUntil: 'networkidle' })
    await stale.locator('.star-status.cached').waitFor()
    assert.equal(await cardStars(stale, 'CoolBgs'), '★ 900', 'refreshed data survives reload')
    await stale.close()

    for (const failure of ['http', 'schema', 'counts']) {
      const failed = await cachePage(staleCache)
      await failed.route('**/__fixture/github/**', route => route.fulfill({
        status: failure === 'http' ? 503 : 200, contentType: 'application/json',
        body: JSON.stringify(failure === 'counts' && new URL(route.request().url()).pathname.includes('/users/')
          ? repos.map(repo => ({ full_name: repo.full_name, stargazers_count: -1 }))
          : { message: 'Invalid repository response' }),
      }))
      await failed.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
      await failed.locator('.star-status.cached').waitFor()
      assert.equal(await cardStars(failed, 'CoolBgs'), '★ 950', 'failed or invalid refresh preserves visible cached values')
      assert.deepEqual(JSON.parse(await readCache(failed)), staleCache, 'failed or invalid refresh preserves cache and timestamp')
      await failed.close()
    }

    const partial = await cachePage(staleCache)
    let missingRepoRequests = 0
    await partial.route('**/__fixture/github/**', route => {
      if (new URL(route.request().url()).pathname.includes('/users/')) return route.fulfill({
        contentType: 'application/json', body: JSON.stringify(repos.filter(repo => !repo.full_name.endsWith('/Spider-Project'))),
      })
      missingRepoRequests += 1
      return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
    })
    await partial.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await partial.locator('.star-status.ready').waitFor()
    assert.equal(missingRepoRequests, 1, 'duplicate project entries share one missing-repository request')
    assert.equal(await cardStars(partial, 'CoolBgs'), '★ 900')
    assert.equal(await cardStars(partial, 'IPProxyPool'), '★ 800', 'failed repository keeps its previous count')
    assert.equal(JSON.parse(await readCache(partial)).stars['cpython666/spider-project'], 800, 'partial refresh keeps failed repository in persistent cache')
    await partial.close()

    for (const [cache, storageFailure] of [
      ['{broken json'],
      [{ time: 'invalid', stars: cachedStars }],
      [undefined, 'getItem'],
      [undefined, 'setItem'],
    ]) {
      const recovered = await cachePage(cache, storageFailure)
      await recovered.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
      await recovered.locator('.star-status.ready').waitFor()
      assert.equal(await cardStars(recovered, 'CoolBgs'), '★ 900', 'corrupt cache or unavailable storage does not block API data')
      await recovered.close()
    }
    const invalidCounts = await cachePage({ ...freshCache, stars: {
      ...cachedStars, 'cpython666/coolbgs': -1, 'cpython666/learnspider': 1.5, 'cpython666/handwritinggenerator': '600', 'cpython666/fuckspider': 0,
    } })
    await invalidCounts.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await invalidCounts.locator('.star-status.cached').waitFor()
    for (const title of ['CoolBgs', 'LearnSpider', 'HandwritingGenerator']) {
      assert.equal(await cardStars(invalidCounts, title), '★ —', 'invalid cached counts are not displayed as Stars')
    }
    assert.equal(await cardStars(invalidCounts, 'FuckSpider'), '★ 0', 'zero is a valid cached Stars count')
    await invalidCounts.close()
    console.log('PASS: Stars cache across reload/SPA without API requests; stale values/ranking during delayed refresh; persistent updates; failure/invalid response preserves old values and timestamp; partial refresh with repository deduplication; corrupt cache and storage errors; invalid count filtering.')
    // page.clock affects its entire context; keep timed checks separate from layout checks.
    const carousel = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })
    await carousel.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    carousel.on('pageerror', error => errors.push(error.message))
    await carousel.clock.install()
    await carousel.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await carousel.locator('.star-status.cached, .star-status.ready').waitFor()
    assert.deepEqual(await carousel.getByRole('button', { name: /^查看项目：/ }).evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label'))),
      topProjects.map(project => `查看项目：${project.title}`), 'carousel shows the five highest-star distinct repositories')
    await checkSlide(carousel, topProjects[0])
    const next = carousel.getByRole('button', { name: '下一个项目', exact: true })
    const previous = carousel.getByRole('button', { name: '上一个项目', exact: true })
    for (let index = 1; index <= topProjects.length; index += 1) {
      await next.focus()
      await carousel.keyboard.press('Enter')
      await checkSlide(carousel, topProjects[index % topProjects.length])
    }
    await previous.focus()
    await carousel.keyboard.press('Enter')
    await checkSlide(carousel, topProjects.at(-1))
    const selectFirstSlide = async () => {
      await carousel.getByRole('button', { name: `查看项目：${topProjects[0].title}`, exact: true }).focus()
      await carousel.keyboard.press('Enter')
    }
    const leaveCarousel = async () => {
      await carousel.locator('.search-box input').focus()
      await carousel.mouse.move(0, 0)
    }
    await selectFirstSlide()
    await checkSlide(carousel, topProjects[0])
    await carousel.clock.pauseAt(new Date(Date.now() + 60000))
    await leaveCarousel()
    await carousel.clock.runFor(5999)
    await checkSlide(carousel, topProjects[0])
    await carousel.clock.runFor(1)
    await checkSlide(carousel, topProjects[1])
    for (const reason of ['hover', 'focus', 'hidden']) {
      await selectFirstSlide()
      await leaveCarousel()
      if (reason === 'hover') {
        const bounds = await carousel.locator('.featured').boundingBox()
        await carousel.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
      } else if (reason === 'focus') {
        await carousel.locator('.featured-actions .btn.primary').focus()
      } else {
        await carousel.evaluate(() => {
          Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
          Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
          document.dispatchEvent(new Event('visibilitychange'))
        })
      }
      await carousel.clock.runFor(12000)
      await checkSlide(carousel, topProjects[0])
      await leaveCarousel()
      if (reason === 'hidden') {
        await carousel.evaluate(() => {
          delete document.hidden
          delete document.visibilityState
          document.dispatchEvent(new Event('visibilitychange'))
        })
      }
      await carousel.clock.runFor(6000)
      await checkSlide(carousel, topProjects[1])
    }
    await carousel.getByRole('button', { name: '暂停自动轮播', exact: true }).focus()
    await carousel.keyboard.press('Enter')
    await leaveCarousel()
    await carousel.clock.runFor(12000)
    await checkSlide(carousel, topProjects[1])
    await carousel.getByRole('button', { name: '开启自动轮播', exact: true }).focus()
    await carousel.keyboard.press('Enter')
    await leaveCarousel()
    await carousel.clock.runFor(6000)
    await checkSlide(carousel, topProjects[2])
    await carousel.close()
    const reducedCarousel = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })
    await reducedCarousel.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    reducedCarousel.on('pageerror', error => errors.push(error.message))
    await reducedCarousel.emulateMedia({ reducedMotion: 'reduce' })
    await reducedCarousel.clock.install()
    await reducedCarousel.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await reducedCarousel.locator('.star-status.cached, .star-status.ready').waitFor()
    await reducedCarousel.clock.pauseAt(new Date(Date.now() + 60000))
    await checkSlide(reducedCarousel, topProjects[0])
    await reducedCarousel.clock.runFor(12000)
    await checkSlide(reducedCarousel, topProjects[0])
    await reducedCarousel.getByRole('button', { name: '下一个项目', exact: true }).focus()
    await reducedCarousel.keyboard.press('Enter')
    await checkSlide(reducedCarousel, topProjects[1])
    await reducedCarousel.close()
    const noStars = await context.newPage()
    noStars.on('pageerror', error => errors.push(error.message))
    await noStars.emulateMedia({ reducedMotion: 'reduce' })
    await noStars.addInitScript(() => localStorage.removeItem('stardream:github-stars:v1'))
    await noStars.route('**/__fixture/github/**', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }))
    await noStars.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await noStars.locator('.star-status.error').waitFor()
    const fallbackTitle = await noStars.locator('.featured h2').textContent()
    const fallbackProject = projects.find(project => project.title === fallbackTitle)
    assert.ok(fallbackProject, 'failed Stars requests retain a usable featured project')
    await checkSlide(noStars, fallbackProject)
    await noStars.close()
    await page.locator('.image img').first().evaluate(img => { img.src = '/__fixture/broken-project.png' })
    await page.waitForFunction(() => {
      const img = document.querySelector('.image img')
      return img?.getAttribute('src') === '/imgs/app/default.svg' && img.naturalWidth > 0
    })
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 })
      for (const route of projectsOnly ? ['projects'] : ['nav', 'projects']) {
        await page.goto(`${base}/${route}/`, { waitUntil: 'networkidle' })
        await markZoomImages()
        await noOverflow(`${route} has no horizontal overflow at ${width}px`)
        if (route === 'nav') {
          await countCards(Math.min(36, resources.length))
          if (width < 760) {
            await loadNextBatch()
            await page.getByRole('combobox', { name: '资源分类' }).click()
            await page.getByRole('option', { name: /^AI模型检测 ·/ }).click()
            await countCards(detection.items.length)
            await page.getByRole('combobox', { name: '资源分类' }).click()
            await page.getByRole('option', { name: /^全部资源 ·/ }).click()
            await countCards(Math.min(36, resources.length))
            await noOverflow(`selected categories fit ${width}px`)
          }
        } else {
          await page.locator('.star-status.cached, .star-status.ready').waitFor()
          const carouselControls = page.locator('.featured button')
          for (const control of await carouselControls.all()) {
            const bounds = await control.boundingBox()
            assert.ok(bounds && bounds.width >= 24 && bounds.height >= 24 && bounds.x >= 0 && bounds.x + bounds.width <= width,
              `carousel controls remain visible and usable at ${width}px`)
          }
          await page.getByRole('button', { name: `查看项目：${topProjects[2].title}`, exact: true }).click()
          await checkSlide(page, topProjects[2])
          const dimensions = await page.locator('.image, .featured-image').evaluateAll(images => images.map(image => {
            const bounds = image.getBoundingClientRect()
            const img = image.querySelector('img')
            const style = getComputedStyle(img)
            return { width: bounds.width, height: bounds.height, fit: style.objectFit, position: style.position }
          }))
          assert.equal(dimensions.length, projects.length + 1)
          for (const image of dimensions) {
            assert.ok(image.width > 0 && Math.abs(image.height - image.width * 9 / 16) < 1, `16:9 project frame at ${width}px`)
            assert.equal(image.fit, 'contain')
            assert.equal(image.position, 'absolute')
          }
          assert.equal(await page.locator('.image img.is-zoomable, .featured-image img.is-zoomable').count(), 0, 'project covers stay outside article image zoom')
          await page.evaluate(() => scrollTo({
            top: scrollY + document.querySelector('.controls').getBoundingClientRect().top + 600, behavior: 'instant',
          }))
          await page.waitForFunction(top => Math.abs(document.querySelector('.controls').getBoundingClientRect().top - top) < 1,
            width >= 960 ? 64 : 0)
          const stickyBounds = await page.locator('.controls').boundingBox()
          assert.ok(stickyBounds.x >= 0 && stickyBounds.x + stickyBounds.width <= width, `sticky filters fit ${width}px`)
          await page.locator('.controls').getByRole('button', { name: '爬虫', exact: true }).click()
          await page.waitForFunction(() => {
            const filters = document.querySelector('.controls').getBoundingClientRect()
            const card = document.querySelector('.cards .card').getBoundingClientRect()
            return card.top >= filters.bottom && card.top < innerHeight
          })
          assert.equal(await page.locator('.cards .card').count(), projects.filter(project => project.category.includes('爬虫')).length,
            `sticky category selection updates results at ${width}px`)
          await noOverflow(`sticky category results have no overflow at ${width}px`)
          await page.locator('.controls').getByRole('button', { name: '全部', exact: true }).click()
          await page.waitForFunction(count => document.querySelectorAll('.cards .card').length === count, projects.length)
        }
        await page.evaluate(() => scrollTo(0, 0))
        if (process.argv.includes('--preview')) {
          const screenshot = join(fixture, 'screenshots', `${route}-${width}.png`)
          await page.screenshot({ path: screenshot })
          console.log(`Screenshot: ${screenshot}`)
          await page.emulateMedia({ colorScheme: 'light' })
          await page.waitForFunction(() => !document.documentElement.classList.contains('dark'))
          const lightScreenshot = join(fixture, 'screenshots', `${route}-${width}-light.png`)
          await page.screenshot({ path: lightScreenshot })
          console.log(`Screenshot: ${lightScreenshot}`)
          if (route === 'projects' && width < 760) {
            const card = page.locator('.cards .card').first()
            await card.scrollIntoViewIfNeeded()
            await page.waitForFunction(() => document.querySelector('.cards .card img')?.naturalWidth > 0)
            const cardScreenshot = join(fixture, 'screenshots', `projects-card-${width}-light.png`)
            await card.screenshot({ path: cardScreenshot })
            console.log(`Screenshot: ${cardScreenshot}`)
          }
          await page.emulateMedia({ colorScheme: 'dark' })
          await page.waitForFunction(() => document.documentElement.classList.contains('dark'))
        }
      }
    }
    assert.deepEqual(errors, [])
    if (!projectsOnly) console.log('PASS: automatic 36-card resource batches without focus/scroll jumps; keyboard fallback without IntersectionObserver; title/description/tag/URL search; category, empty/reset, hash/refresh; all resources reachable; icon fallback.')
    console.log('PASS: isolated build; artificial GitHub Stars; top-five carousel sorting/deduplication, manual wraparound, synchronized links/covers, 6-second playback, hover/focus/hidden/manual pause, reduced motion and unavailable-Stars fallback; project image fallback; 16:9 contained project images; 320/390/1440 layouts; no hydration errors. Counts describe this local fixture, not live-site performance.')
  }
  const screenshot = async name => {
    if (!process.argv.includes('--preview')) return
    await page.waitForFunction(() => [...document.images].every(img => {
      const bounds = img.getBoundingClientRect()
      return bounds.bottom <= 0 || bounds.top >= innerHeight || img.complete
    }))
    const path = join(fixture, 'screenshots', `${name}.png`)
    await page.screenshot({ path })
    console.log(`Screenshot: ${path}`)
  }
  const checkProjectCenter = async (width, navigation) => {
    await page.locator('.projects-page').waitFor()
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      centers: ['.projects-page', '.VPHome > .vp-doc.container', '.VPNavBar .container'].map(selector => {
        const bounds = document.querySelector(selector).getBoundingClientRect()
        return { selector, width: bounds.width, offset: bounds.left + bounds.width / 2 - innerWidth / 2 }
      }),
    }))
    console.log(`${baselineIndex < 0 ? 'Current' : 'Baseline'} projects ${width}px ${navigation}: ${JSON.stringify(layout)}`)
    if (baselineIndex < 0) {
      assert.ok(layout.scrollWidth <= layout.viewport, `projects ${navigation} has no overflow at ${width}px`)
      for (const item of layout.centers) {
        assert.ok(item.width > 0 && Math.abs(item.offset) < 1, `${item.selector} is centered after ${navigation} at ${width}px: ${item.offset}px`)
      }
    }
    await screenshot(`projects-${width}-${navigation}`)
  }
  const checkHome = async width => {
    await page.locator('#index-logo').waitFor()
    await page.waitForFunction(() => document.querySelector('#index-logo')?.naturalWidth > 0)
    await page.locator('.sponsors-section').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll('.sponsors-section img')]
      return images.length > 0 && images.every(img => img.naturalWidth > 0)
    })
    // Exercise an overflow-prone rotated state without waiting for its animation.
    await page.locator('#small-bg').evaluate(bg => { bg.style.animation = 'none'; bg.style.transform = 'rotate(45deg)' })
    if (baselineIndex < 0) {
      await noOverflow(`home and rotated background have no horizontal overflow at ${width}px`)
      for (const selector of ['#index-logo', '.sponsors-section']) {
        const bounds = await page.locator(selector).boundingBox()
        assert.ok(bounds?.width > 0 && bounds.height > 0 && bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${selector} fits at ${width}px`)
      }
    }
    await page.evaluate(() => scrollTo(0, 0))
    await screenshot(`home-${width}`)
  }
  for (const width of toolsOnly || projectsOnly ? [] : [1440, 1920, 2560, 3840]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await checkProjectCenter(width, 'direct')
    const timeOrigin = await page.evaluate(() => performance.timeOrigin)
    await page.locator('.VPNavBar').getByRole('link', { name: '测试首页', exact: true }).click()
    await checkHome(width)
    await page.locator('.VPNavBar').getByRole('link', { name: '项目', exact: true }).click()
    await checkProjectCenter(width, 'via-home')
    assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin, 'home → projects uses SPA navigation')
  }
  for (const width of toolsOnly || projectsOnly ? [] : [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(base, { waitUntil: 'networkidle' })
    await checkHome(width)
  }
  if (baselineIndex < 0 && !toolsOnly && !projectsOnly) {
    await page.setViewportSize({ width: 768, height: 1000 })
    await page.goto(base + '/nav/', { waitUntil: 'networkidle' })
    const hamburger = page.getByRole('button', { name: 'mobile navigation', exact: true })
    await hamburger.click()
    await page.locator('.VPNavScreen').waitFor({ state: 'visible' })
    await noOverflow('tablet navigation menu fits')
    await page.locator('.VPNavScreen').getByRole('link', { name: '提示词', exact: true }).click()
    await page.locator('.prompts-page').waitFor()
    await page.locator('.VPNavScreen').waitFor({ state: 'detached' })
    assert.equal(new URL(page.url()).pathname, '/prompts/', 'tablet menu reaches independent prompts')
    await hamburger.click()
    await page.waitForFunction(() => getComputedStyle(document.body).overflow === 'hidden')
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.locator('.VPNavScreen').waitFor({ state: 'detached' })
    await page.waitForFunction(() => getComputedStyle(document.body).overflow !== 'hidden')
    assert.equal(await hamburger.isVisible(), false, 'desktop navigation replaces the tablet hamburger')
    assert.equal(await page.locator('.VPNavBarMenu').isVisible(), true)
    await page.mouse.wheel(0, 200)
    await page.waitForFunction(() => scrollY > 0)
    await noOverflow('desktop navigation fits after closing the tablet menu')
    for (const width of [320, 390, 768, 1024, 1279, 1280, 1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const [path, selector] of [['/nav/', '.resources-page'], ['/navigation/', '.nav-page'], ['/prompts/', '.prompts-page'], ['/tools/', '.tools-layout'], ['/sample/', '.VPDoc > .container'], ['/sample/article.html', '.VPDoc > .container'], ['/backup/', '.VPDoc > .container']]) {
        await page.goto(base + path, { waitUntil: 'networkidle' })
        await page.locator(selector).waitFor()
        const layout = await page.locator(selector).evaluate(element => {
          const bounds = element.getBoundingClientRect()
          const parent = element.closest('.VPDoc')
          const parentBounds = parent?.getBoundingClientRect()
          const style = parent && getComputedStyle(parent)
          const center = parent ? (parentBounds.left + parseFloat(style.paddingLeft) + parentBounds.right - parseFloat(style.paddingRight)) / 2 : innerWidth / 2
          return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, offset: bounds.left + bounds.width / 2 - center }
        })
        console.log(`Layout ${path} ${width}px: ${JSON.stringify(layout)}`)
        assert.ok(layout.scrollWidth <= width, `${path} fits at ${width}px`)
        assert.ok(Math.abs(layout.offset) < 1, `${path} is centered in available space at ${width}px`)
        if (path === '/navigation/') {
          assert.equal(await page.locator('.prompt-card, [role=tab]').count(), 0, 'article navigation has no prompt tab or cards')
        }
        if (path === '/prompts/') {
          assert.equal(await page.locator('.prompt-card').count(), prompts.length, 'independent prompt page renders all public templates')
        }
        if (path === '/backup/') {
          const details = await page.evaluate(() => {
            const summary = document.querySelector('.x-backup__summary').getBoundingClientRect()
            const stats = document.querySelector('.x-backup__summary dl').getBoundingClientRect()
            const detail = document.querySelector('.x-backup__detail').getBoundingClientRect()
            const text = [...document.querySelectorAll('.x-backup__text p, .x-backup__comment-text p')]
            return { statsOverhang: stats.right - summary.right, textOverflow: Math.max(...text.map(node => Math.max(node.scrollWidth - node.clientWidth, node.getBoundingClientRect().right - detail.right))) }
          })
          console.log(`Backup contents ${width}px: ${JSON.stringify(details)}`)
          assert.ok(details.statsOverhang <= 0 && details.textOverflow <= 1, `backup contents fit their cards at ${width}px`)
        }
        if (path === '/tools/') {
          for (const panel of toolIds) {
            await page.locator(`.nav-list a[href="/tools/${panel}/"]`).click()
            await noOverflow(`${panel} fits at ${width}px`)
            const clipped = await page.locator(`#${panel} input, #${panel} .editor-header button`).evaluateAll(controls => controls.some(control => {
              const bounds = control.getBoundingClientRect()
              const parent = control.closest('.editor-header, .panel-card').getBoundingClientRect()
              return bounds.width > 0 && (bounds.left < parent.left - 1 || bounds.right > parent.right + 1 || bounds.bottom > parent.bottom + 1)
            }))
            assert.equal(clipped, false, `${panel} controls fit at ${width}px`)
          }
        }
        await screenshot(`${path.replaceAll('/', '-').replace('.html', '')}-${width}`)
      }
    }
    await page.setViewportSize({ width: 2560, height: 1000 })
    await page.goto(base + '/sample/article.html', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: '沉浸式阅读', exact: true }).click()
    await page.waitForFunction(() => document.body.classList.contains('article-reading-mode'))
    await noOverflow('reading mode fits')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.body.classList.contains('article-reading-mode'))
    await page.getByRole('button', { name: '沉浸式阅读', exact: true }).click()
    await page.getByRole('link', { name: '返回首页', exact: true }).click()
    await page.waitForFunction(() => !document.body.classList.contains('article-reading-mode'))
    for (const name of ['文章导航', '备份', '目录', '资源导航', '工具']) {
      await page.locator('.VPNavBar').getByRole('link', { name, exact: true }).click()
      await noOverflow(`${name} after SPA navigation fits`)
    }
    await page.locator('.nav-list a[href="/tools/imagesplit/"]').click()
    await page.locator('#controls input[type="file"]').setInputFiles({ name: 'fixture.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#88aaff"/></svg>') })
    await page.waitForFunction(() => document.querySelector('#preview img')?.naturalWidth === 1200)
    await markZoomImages()
    assert.equal(await page.locator('#preview img.is-zoomable').count(), 0, 'image split preview stays outside article zoom')
    for (const width of [320, 390, 769, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.waitForFunction(() => {
        const image = document.querySelector('#preview img').getBoundingClientRect()
        const overlay = document.querySelector('#preview canvas').getBoundingClientRect()
        return ['x', 'y', 'width', 'height'].every(key => Math.abs(image[key] - overlay[key]) < 1)
      })
      await noOverflow(`image split preview and overlay fit at ${width}px`)
    }
    console.log(`PASS: resource/article navigation, prompt cards, ${toolIds.length} tool panels, category index, ordinary article and synthetic backup layouts at 320–3840px; tablet menu navigation and desktop scroll restoration; reading mode cleanup; uploaded image/grid alignment on resize.`)
  }
  if (baselineIndex < 0 && !toolsOnly && !projectsOnly) {
    assert.deepEqual(errors, [])
    console.log('PASS: real home components; loaded home logo/sponsors; mobile rotating background stays contained; centered project/nav containers at 1440/1920/2560/3840px on direct loads and after home → projects SPA navigation.')
  }
  if (process.argv.includes('--preview')) {
    await browser.close()
    browser = undefined
    console.log(`Internal preview: ${base}/ (home, resources, projects, article navigation, prompts, tools, synthetic articles/backups; use the complete local site for user review)`)
    console.log('Press Ctrl+C to stop the preview and remove the temporary fixture.')
    await new Promise(done => { process.once('SIGINT', done); process.once('SIGTERM', done) })
  }
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
