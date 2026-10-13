// Isolated resource/project checks: no article files or content loaders are read.
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
  for (const path of ['.vitepress', 'nav', 'projects', 'public/css', 'screenshots']) {
    await mkdir(join(fixture, path), { recursive: true })
  }
  for (const path of ['nav/NavPage.vue', 'nav/WebLink.vue', 'nav/data.js', 'projects/ProjectPage.vue', 'projects/data.js']) {
    await copyFile(join(source, path), join(fixture, path))
  }
  // Both data modules are plain exports, with no article loaders or imports.
  const loadData = async path => import(`data:text/javascript;base64,${Buffer.from(await readFile(join(fixture, path))).toString('base64')}`)
  const { navigationData } = await loadData('nav/data.js')
  const { projects } = await loadData('projects/data.js')
  const resources = navigationData.flatMap(group => group.items.map(site => ({ ...site, section: group.title })))
  const assets = new Set(['/icons/github.svg', '/imgs/app/default.svg', '/imgs/ads/qgwl.jpeg'])
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
  await writeFile(join(fixture, 'index.md'), '---\nlayout: home\n---\n# 隔离页面检查\n\n[资源导航](/nav/) · [项目](/projects/)\n')
  for (const [folder, component] of [['nav', 'NavPage'], ['projects', 'ProjectPage']]) {
    await writeFile(join(fixture, folder, 'index.md'), `---\nlayout: home\n---\n<script setup>\nimport ${component} from './${component}.vue'\n</script>\n<${component} />\n`)
  }
  // Keep the retained preview offline too, not just Playwright's routed requests.
  const fixtureFetch = `const fetchOriginal = window.fetch.bind(window); window.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    return fetchOriginal(url.hostname === 'api.github.com' ? '/__fixture/github' + url.pathname + url.search : input, init);
  };`
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: '资源与项目检查', ignoreDeadLinks: true,
    head: [['link', { rel: 'stylesheet', href: '/css/index.css' }], ['script', {}, fixtureFetch]],
    themeConfig: { nav: [{ text: '测试首页', link: '/' }, { text: '资源导航', link: '/nav/' }, { text: '项目', link: '/projects/' }] },
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
  if (process.argv.includes('--preview')) {
    await browser.close()
    browser = undefined
    console.log(`Preview: ${base}/nav/ and ${base}/projects/ (artificial GitHub Stars; third-party requests blocked)`)
    console.log('Press Ctrl+C to stop the preview and remove the temporary fixture.')
    await new Promise(done => { process.once('SIGINT', done); process.once('SIGTERM', done) })
  }
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
