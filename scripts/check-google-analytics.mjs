// Artificial VitePress pages only; every Google request is intercepted.
// Run: node scripts/check-google-analytics.mjs
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright'
import { createServer as createVitePressServer } from 'vitepress'

const root = resolve(import.meta.dirname, '..')
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'google-analytics-check-')))
const productionOrigin = 'https://cpython666.github.io'
let browser, server, devServer
try {
  await mkdir(join(fixture, '.vitepress/theme'), { recursive: true })
  await copyFile(join(root, 'docs/.vitepress/theme/googleAnalytics.js'), join(fixture, '.vitepress/theme/googleAnalytics.js'))
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, '.vitepress/theme/index.js'), `
import DefaultTheme from 'vitepress/theme'
import { useGoogleAnalytics } from './googleAnalytics.js'
export default { extends: DefaultTheme, setup() { useGoogleAnalytics() } }
`)
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: 'Analytics fixture', vite: { server: { hmr: false } },
    themeConfig: { googleAnalyticsId: 'G-FIXTURE123', nav: [
      { text: 'Home', link: '/' }, { text: 'Alpha', link: '/a' }, { text: 'Beta', link: '/b' },
    ] },
  })}`)
  for (const [path, title] of [['index', 'Home'], ['a', 'Alpha'], ['b', 'Beta']]) {
    await writeFile(join(fixture, `${path}.md`), `# ${title}\n\nArtificial content, never collected.\n`)
  }
  const theme = await readFile(join(root, 'docs/.vitepress/theme/index.js'), 'utf8')
  assert.match(theme, /import \{ useGoogleAnalytics \} from '\.\/googleAnalytics\.js'/)
  assert.match(theme, /setup\(\) \{\s*useGoogleAnalytics\(\)/, 'the production theme installs the tested hook')
  await promisify(execFile)(process.execPath, [join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', fixture], { cwd: root })
  const output = join(fixture, '.vitepress/dist')
  server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const name = pathname.endsWith('/') ? `${pathname}index.html` : extname(pathname) ? pathname : `${pathname}.html`
    const file = resolve(output, `.${name}`)
    if (!file.startsWith(output + '/')) return res.writeHead(403).end()
    try {
      const body = await readFile(file)
      res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' })[extname(file)] || 'application/octet-stream')
      res.end(body)
    } catch { res.writeHead(404).end() }
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const localOrigin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })
  const errors = []
  async function openPage(origin, sourceOrigin) {
    const context = await browser.newContext({ serviceWorkers: 'block' })
    let googleScripts = 0
    const forbiddenRequests = []
    await context.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin === origin) {
        const response = await route.fetch({ url: sourceOrigin + url.pathname + url.search })
        return route.fulfill({ response })
      }
      if (url.origin === 'https://www.googletagmanager.com' && url.pathname === '/gtag/js') {
        googleScripts++
        return route.fulfill({ contentType: 'text/javascript', body: 'window.__googleFixtureLoaded = true' })
      }
      forbiddenRequests.push(url.origin)
      return route.abort()
    })
    const page = await context.newPage()
    page.setDefaultTimeout(10000)
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(origin + '/?password=not-for-analytics#private', { waitUntil: 'networkidle', referer: 'https://referrer.example/path?token=private' })
    return { page, context, googleScripts: () => googleScripts, forbiddenRequests }
  }
  const test = await openPage(productionOrigin, localOrigin)
  const { page } = test
  const commands = () => page.evaluate(() => (window.dataLayer || []).map(command => Array.from(command)))
  const pageViews = async () => (await commands()).filter(command => command[0] === 'event' && command[1] === 'page_view')
  const expectViews = async (count, path, title, referrer) => {
    await page.waitForFunction(count => (window.dataLayer || []).filter(command => command[0] === 'event' && command[1] === 'page_view').length === count, count)
    const last = (await pageViews()).at(-1)[2]
    assert.deepEqual(last, { page_title: title + ' | Analytics fixture', page_location: productionOrigin + path, page_referrer: referrer, send_to: 'G-FIXTURE123' })
    assert.deepEqual((await commands()).filter(command => command[0] === 'set').at(-1)[1], {
      page_title: last.page_title, page_location: last.page_location, page_referrer: last.page_referrer,
    }, 'automatic events inherit sanitized page metadata')
  }
  await expectViews(1, '/', 'Home', 'https://referrer.example')
  assert.equal(test.googleScripts(), 1)
  const config = (await commands()).filter(command => command[0] === 'config')
  assert.equal(config.length, 1)
  assert.equal(config[0][2].send_page_view, false)
  const navigation = await page.evaluate(() => performance.timeOrigin)
  await page.getByRole('link', { name: 'Alpha', exact: true }).click()
  await expectViews(2, '/a.html', 'Alpha', productionOrigin + '/')
  await page.getByRole('link', { name: 'Beta', exact: true }).click()
  await expectViews(3, '/b.html', 'Beta', productionOrigin + '/a.html')
  await page.goBack()
  await expectViews(4, '/a.html', 'Alpha', productionOrigin + '/b.html')
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '/a.html?token=private#private'
    document.body.append(link); link.click(); link.remove()
  })
  await page.waitForURL('**/a.html?token=private#private')
  await page.waitForLoadState('networkidle')
  assert.equal((await pageViews()).length, 4, 'query/hash navigation does not add a page view')
  assert.equal(await page.evaluate(() => performance.timeOrigin), navigation, 'route checks use SPA navigation')
  assert.equal(test.googleScripts(), 1)
  assert.ok(!JSON.stringify(await commands()).match(/private|password|token|Artificial content/), 'no input, query, hash or body reaches gtag')
  assert.deepEqual(test.forbiddenRequests, [])
  await test.context.close()
  const local = await openPage(localOrigin, localOrigin)
  assert.equal(await local.page.evaluate(() => typeof window.dataLayer), 'undefined', 'production build on localhost does not initialize GA')
  assert.equal(local.googleScripts(), 0)
  await local.context.close()
  devServer = await createVitePressServer(fixture, { host: '127.0.0.1', port: 0, hmr: false })
  await devServer.listen()
  const devOrigin = `http://127.0.0.1:${devServer.httpServer.address().port}`
  const dev = await openPage(productionOrigin, devOrigin)
  assert.equal(await dev.page.evaluate(() => typeof window.dataLayer), 'undefined', 'development build does not initialize GA even on the production origin')
  assert.equal(dev.googleScripts(), 0)
  await dev.context.close()
  assert.deepEqual(errors, [])
  console.log('PASS: SSR build; single initial/SPA/back page views and script; correct titles/referrers; query/hash/body exclusion; localhost and dev disabled; no real Google requests or browser errors.')
} finally {
  await browser?.close()
  await devServer?.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
