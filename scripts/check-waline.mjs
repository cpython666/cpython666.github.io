// Build real Waline imports against artificial pages; never read repository articles.
// Run: node scripts/check-waline.mjs (requires Playwright Chromium).
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'waline-check-')))
let server
let browser
try {
  await mkdir(join(fixture, '.vitepress/theme/components'), { recursive: true })
  for (const file of ['comment.js', 'components/WalineComment.vue']) {
    await copyFile(join(root, 'docs/.vitepress/theme', file), join(fixture, '.vitepress/theme', file))
  }
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, '.vitepress/theme/index.js'), `
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import WalineComment from './components/WalineComment.vue'
export default { extends: DefaultTheme, Layout: () => h(DefaultTheme.Layout, null, {
  'doc-after': () => h(WalineComment),
}) }
`)
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: 'Waline compatibility fixture',
    themeConfig: { nav: [
      { text: '首页', link: '/' }, { text: '文章甲', link: '/article-a' },
      { text: '文章乙', link: '/article-b' }, { text: '关闭评论', link: '/disabled' },
    ] },
  })}`)
  for (const name of ['index', 'article-a', 'article-b', 'disabled']) {
    await writeFile(join(fixture, `${name}.md`),
      `${name === 'disabled' ? '---\ncomment: false\n---\n' : ''}# 人工页面 ${name}\n\n仅测试评论组件。\n`)
  }
  await promisify(execFile)(process.execPath, [join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', fixture], { cwd: root })
  console.log('PASS: VitePress SSR and client build with real Waline JavaScript/CSS imports.')
  const output = join(fixture, '.vitepress/dist')
  server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const filename = pathname.endsWith('/') ? `${pathname}index.html` : extname(pathname) ? pathname : `${pathname}.html`
    const file = resolve(output, `.${filename}`)
    if (!file.startsWith(output + '/')) return res.writeHead(403).end()
    try {
      const body = await readFile(file)
      res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' })[extname(file)] || 'application/octet-stream')
      res.end(body)
    } catch { res.writeHead(404).end() }
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const base = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ serviceWorkers: 'block' })
  const requests = []
  const forbiddenWrites = []
  await context.route('**/*', route => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.origin === base) return route.continue()
    if (request.method() !== 'GET') {
      forbiddenWrites.push(`${request.method()} ${url.pathname}`)
      return route.abort()
    }
    if (url.pathname === '/api/comment') {
      requests.push(url.searchParams.get('path'))
      return route.fulfill({ json: { errno: 0, data: { count: 0, data: [], totalPages: 0 } } })
    }
    // Emoji metadata is artificial too; no external request leaves the browser.
    if (url.pathname.endsWith('/info.json')) {
      return route.fulfill({ json: { name: 'fixture', icon: 'empty', type: 'png', items: [] } })
    }
    return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' || /hydration/i.test(message.text())) errors.push(message.text())
  })
  await page.goto(`${base}/article-a.html`, { waitUntil: 'networkidle' })
  const editor = page.locator('.waline-comment .wl-editor')
  await editor.waitFor()
  assert.ok(requests.includes('/article-a.html'), 'Waline requests the initial article path')
  assert.ok(await page.evaluate(() => [...document.styleSheets].some(sheet =>
    [...sheet.cssRules].some(rule => rule.cssText.includes('.wl-editor')))), 'Waline stylesheet is loaded')
  await editor.fill('本地人工草稿，不提交')
  assert.equal(await editor.inputValue(), '本地人工草稿，不提交')
  await page.evaluate(() => { window.__walineSmokeNavigation = true })
  await page.getByRole('link', { name: '文章乙', exact: true }).click()
  await page.waitForURL('**/article-b.html')
  await page.waitForLoadState('networkidle')
  await editor.waitFor()
  assert.equal(await page.evaluate(() => window.__walineSmokeNavigation), true, 'navigation stays in the SPA')
  assert.ok(requests.includes('/article-b.html'), 'Waline updates its path after SPA navigation')
  assert.equal(await editor.count(), 1, 'SPA navigation does not duplicate the editor')
  await page.getByRole('link', { name: '关闭评论', exact: true }).click()
  await page.waitForURL('**/disabled.html')
  await page.locator('.waline-comment').waitFor({ state: 'detached' })
  await page.getByRole('link', { name: '首页', exact: true }).click()
  await page.waitForURL(base + '/')
  await page.waitForLoadState('networkidle')
  assert.equal(await page.locator('.waline-comment').count(), 0, 'home page hides comments')
  assert.ok(!requests.includes('/disabled.html') && !requests.includes('/'), 'hidden pages do not request comments')
  assert.deepEqual(forbiddenWrites, [], 'no comment, login or counter writes')
  assert.deepEqual(errors, [], 'no browser, hydration or Waline errors')
  console.log('PASS: Waline editor/CSS, SPA path update, comment:false/home hiding, zero external writes and browser errors.')
} finally {
  await browser?.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
