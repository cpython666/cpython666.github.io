// Isolated public-page checks: no article files or real content loaders are read.
// Run: node scripts/check-resource-pages.mjs [--preview]
// Compare a saved code-only snapshot: --baseline /path/to/snapshot
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const baselineIndex = process.argv.indexOf('--baseline')
if (baselineIndex >= 0) assert.ok(process.argv[baselineIndex + 1], '--baseline needs a code snapshot directory')
const source = baselineIndex < 0 ? join(root, 'docs') : resolve(process.argv[baselineIndex + 1])
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'resource-pages-check-')))
let server
let browser
try {
  for (const path of ['.vitepress/theme', 'index', 'nav', 'projects', 'navigation', 'spider-tools', 'sample', 'backup', 'public/css', 'screenshots']) {
    await mkdir(join(fixture, path), { recursive: true })
  }
  const homeComponents = ['index/IndexPage.vue', 'index/SponsorsLinks.vue']
  const otherComponents = ['navigation/NavIndex.vue', 'utils/copy.js', 'components/ConfigArticleList.vue', 'components/XBackupList.vue', '.vitepress/theme/components/ArticleTools.vue', '.vitepress/theme/components/ArticleOutlineToggle.vue', 'spider-tools/SpiderTools.vue', 'spider-tools/utils/curlToRequests.js', ...['CurlRequests', 'Url', 'Base64', 'Aaencode', 'Jjencode', 'Imagesplit'].map(panel => `spider-tools/components/Panel${panel}.vue`)]
  for (const path of [...homeComponents, 'nav/NavPage.vue', 'nav/WebLink.vue', 'nav/data.js', 'projects/ProjectPage.vue', 'projects/data.js', ...otherComponents]) {
    await mkdir(dirname(join(fixture, path)), { recursive: true })
    await copyFile(join(otherComponents.includes(path) ? join(root, 'docs') : source, path), join(fixture, path))
  }
  // Both data modules are plain exports, with no article loaders or imports.
  const loadData = async path => import(`data:text/javascript;base64,${Buffer.from(await readFile(join(fixture, path))).toString('base64')}`)
  const { navigationData } = await loadData('nav/data.js')
  const { projects } = await loadData('projects/data.js')
  const resources = navigationData.flatMap(group => group.items.map(site => ({ ...site, section: group.title })))
  const assets = new Set(['/icons/github.svg', '/imgs/app/default.svg', '/imgs/ads/qgwl.jpeg'])
  for (const path of homeComponents) {
    const component = await readFile(join(fixture, path), 'utf8')
    for (const [, asset] of component.matchAll(/['"](\/?(?:imgs\/[^'"]+|logo_super\.svg))['"]/g)) {
      assets.add('/' + asset.replace(/^\//, ''))
    }
  }
  for (const item of [...resources, ...projects]) {
    for (const key of ['icon', 'image', 'qrcode']) {
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
  for (const [folder, component] of [['nav', 'NavPage'], ['projects', 'ProjectPage'], ['navigation', 'NavIndex'], ['spider-tools', 'SpiderTools']]) {
    await writeFile(join(fixture, folder, 'index.md'), `---\nlayout: home\n---\n<script setup>\nimport ${component} from './${component}.vue'\n</script>\n<${component} />\n`)
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
import ArticleOutlineToggle from './components/ArticleOutlineToggle.vue'
export default { extends: DefaultTheme, Layout: () => h(DefaultTheme.Layout, null, {
  'layout-bottom': () => h(ArticleTools),
  'aside-outline-before': () => h(ArticleOutlineToggle),
}) }
`)
  // Keep the retained preview offline too, not just Playwright's routed requests.
  const fixtureFetch = `const fetchOriginal = window.fetch.bind(window); window.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    return fetchOriginal(url.hostname === 'api.github.com' ? '/__fixture/github' + url.pathname + url.search : input, init);
  };`
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: '首页、资源与项目检查', ignoreDeadLinks: true,
    head: [['link', { rel: 'stylesheet', href: '/css/index.css' }], ['script', {}, fixtureFetch]],
    themeConfig: {
      nav: [{ text: '测试首页', link: '/' }, { text: '资源导航', link: '/nav/' }, { text: '项目', link: '/projects/' }, { text: '文章导航', link: '/navigation/' }, { text: '工具', link: '/spider-tools/' }, { text: '目录', link: '/sample/' }, { text: '备份', link: '/backup/' }],
      sidebar: { '/sample/': [{ text: '人工分类', items: [{ text: '人工文章', link: '/sample/article' }] }], '/backup/': [{ text: '人工备份', link: '/backup/' }] },
    },
  })}\n`)
  await promisify(execFile)(process.execPath, [join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', fixture], { cwd: root })
  const repos = [...new Set(projects.map(project => project.url.match(/^https:\/\/(?:www\.)?github\.com\/([^/]+\/[^/#?]+)/)?.[1]).filter(Boolean))]
    .map((full_name, index) => ({ full_name, stargazers_count: 100 + index }))
  const output = join(fixture, '.vitepress/dist')
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
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()) })
  const countCards = async count => page.waitForFunction(count => document.querySelectorAll('.site').length === count, count)
  const noOverflow = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), label)
  // Match the real theme's selector without loading its unrelated services.
  const markZoomImages = () => page.evaluate(() => document.querySelectorAll('.vp-doc img:not(.no-zoom):not(.site-icon), .x-backup__media img').forEach(img => img.classList.add('is-zoomable')))
  await page.goto(`${base}/nav/`, { waitUntil: 'networkidle' })
  const initial = await page.evaluate(() => ({
    cards: document.querySelectorAll('.site').length,
    elements: document.querySelectorAll('*').length,
    cardCheckboxes: document.querySelectorAll('.site input[type="checkbox"]').length,
    tooltips: document.querySelectorAll('.tooltip').length,
  }))
  console.log(`${baselineIndex < 0 ? 'Current' : 'Baseline'} initial resource DOM: ${JSON.stringify(initial)}; data: ${resources.length} resources / ${navigationData.length} categories; copied ${copiedAssets} referenced images.`)
  if (baselineIndex < 0) {
    assert.equal(initial.cards, Math.min(36, resources.length))
    await page.locator('.load-more').focus()
    await page.keyboard.press('Enter')
    await countCards(Math.min(72, resources.length))
    await page.waitForFunction(() => document.activeElement === document.querySelectorAll('a.site-link')[36])
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
    const detection = navigationData.find(group => group.title === 'AI模型检测')
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
      await page.locator('.load-more').click()
      await countCards(Math.min(count + 36, resources.length))
      await page.waitForFunction(index => document.activeElement === document.querySelectorAll('a.site-link')[index], count)
    }
    assert.equal(await page.locator('.load-more').count(), 0, 'last batch exhausts all resources')
    await search.fill('ModelTrace')
    await page.getByRole('button', { name: '清除搜索', exact: true }).click()
    await countCards(Math.min(36, resources.length))
    await page.locator('.site-icon').first().evaluate(img => { img.src = '/__fixture/broken-icon.png' })
    await page.waitForFunction(() => {
      const img = document.querySelector('.site-icon')
      return img?.getAttribute('src') === '/icons/github.svg' && img.naturalWidth > 0
    })
    await page.goto(`${base}/projects/`, { waitUntil: 'networkidle' })
    await page.locator('.star-status.ready').waitFor()
    assert.equal(await page.locator('.cards .card').count(), projects.length)
    await page.locator('.image img').first().evaluate(img => { img.src = '/__fixture/broken-project.png' })
    await page.waitForFunction(() => {
      const img = document.querySelector('.image img')
      return img?.getAttribute('src') === '/imgs/app/default.svg' && img.naturalWidth > 0
    })
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 })
      for (const route of ['nav', 'projects']) {
        await page.goto(`${base}/${route}/`, { waitUntil: 'networkidle' })
        await markZoomImages()
        await noOverflow(`${route} has no horizontal overflow at ${width}px`)
        if (route === 'nav') {
          await countCards(Math.min(36, resources.length))
          if (width < 760) {
            await page.getByRole('combobox', { name: '资源分类' }).selectOption('AI模型检测')
            await countCards(detection.items.length)
            await page.getByRole('combobox', { name: '资源分类' }).selectOption('')
            await countCards(Math.min(36, resources.length))
            await noOverflow(`selected categories fit ${width}px`)
          }
        } else {
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
    console.log('PASS: isolated build; 36-card batches with keyboard focus on new content; title/description/tag/URL search; category, empty/reset, hash/refresh; all resources reachable; artificial GitHub data; icon/image fallback; 16:9 contained project images; 320/390/1440 layouts; no hydration errors. Counts describe this local fixture, not live-site performance.')
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
  for (const width of [1440, 1920, 2560, 3840]) {
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
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(base, { waitUntil: 'networkidle' })
    await checkHome(width)
  }
  if (baselineIndex < 0) {
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const [path, selector] of [['/nav/', '.resources-page'], ['/navigation/', '.nav-page'], ['/spider-tools/', '.tools-layout'], ['/sample/', '.VPDoc > .container'], ['/sample/article.html', '.VPDoc > .container'], ['/backup/', '.VPDoc > .container']]) {
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
          await page.getByRole('tab', { name: /提示词/ }).click()
          await noOverflow(`prompt cards fit at ${width}px`)
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
        if (path === '/spider-tools/') {
          for (const panel of ['curl-requests', 'url', 'base64', 'aaencode', 'jjencode', 'imagesplit']) {
            await page.locator(`.nav-list a[href="#${panel}"]`).click()
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
    await page.locator('.nav-list a[href="#imagesplit"]').click()
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
    console.log('PASS: resource/article navigation, prompt cards, six tool panels, category index, ordinary article and synthetic backup layouts at 320–3840px; reading mode cleanup; uploaded image/grid alignment on resize.')
  }
  if (baselineIndex < 0) {
    assert.deepEqual(errors, [])
    console.log('PASS: real home components; loaded home logo/sponsors; mobile rotating background stays contained; centered project/nav containers at 1440/1920/2560/3840px on direct loads and after home → projects SPA navigation.')
  }
  if (process.argv.includes('--preview')) {
    await browser.close()
    browser = undefined
    console.log(`Preview: ${base}/ (home, resources, projects, article navigation, tools, synthetic articles/backups; artificial GitHub Stars; third-party requests blocked)`)
    console.log('Press Ctrl+C to stop the preview and remove the temporary fixture.')
    await new Promise(done => { process.once('SIGINT', done); process.once('SIGTERM', done) })
  }
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
