// Builds an isolated fixture with synthetic pages; never scans repository articles.
// Run: node scripts/check-prompt-sharing.mjs
// Preview after checks: node scripts/check-prompt-sharing.mjs --preview
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, extname } from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'prompt-sharing-check-')))
let server
let browser
try {
  for (const path of ['.vitepress', 'navigation', 'utils']) await mkdir(join(fixture, path))
  for (const path of ['navigation/NavIndex.vue', 'utils/copy.js']) {
    await copyFile(join(root, 'docs', path), join(fixture, path))
  }
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, 'navigation/member.data.mjs'), 'export default { load: () => [] }\n')
  await writeFile(join(fixture, 'index.md'), '# 分享测试首页\n\n[提示词定位](/navigation/#prompt-video-cover)\n')
  await writeFile(join(fixture, 'navigation/index.md'), '---\nlayout: home\n---\n<script setup>\nimport NavIndex from "./NavIndex.vue"\n</script>\n<NavIndex />\n')
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: '提示词测试', ignoreDeadLinks: true,
    themeConfig: {
      nav: [{ text: '测试首页', link: '/' }, { text: '文章导航', link: '/navigation/' }],
      sidebar: { '/sample/': [{ text: '人工测试文章', link: '/sample/example' }] },
    },
  })}\n`)
  await promisify(execFile)(process.execPath, [join(root, 'node_modules/vitepress/bin/vitepress.js'), 'build', fixture], { cwd: root })
  const output = join(fixture, '.vitepress/dist')
  server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = resolve(output, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`)
    if (!file.startsWith(output + '/')) return res.writeHead(403).end()
    try {
      const content = await readFile(file)
      res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json' })[extname(file)] || 'application/octet-stream')
      res.end(content)
    } catch { res.writeHead(404).end() }
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const base = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.text().includes('Hydration')) errors.push(message.text()) })
  const ids = ['video-cover', 'video-cover-codex', 'subtitle-correction', 'subtitle-from-script', 'training-cutoff', 'cycling-pelican-svg', 'cycling-girl-svg', 'project-knowledge-skill']
  const dialog = page.locator('.prompt-dialog')
  const openPrompt = async id => {
    const card = page.locator(`#prompt-${id}`)
    await card.getByRole('button', { name: /^查看完整提示词/ }).click()
    await dialog.waitFor({ state: 'visible' })
    assert.equal(await dialog.locator('.prompt-full-text').textContent(), await card.locator('.prompt-text').textContent())
    assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)), 'dialog receives keyboard focus')
  }
  const expectDialogClosed = async id => {
    await dialog.waitFor({ state: 'hidden' })
    await page.waitForFunction(id => document.getElementById(`prompt-${id}`)
      ?.querySelector('[aria-label^="查看完整提示词："]') === document.activeElement, id)
  }
  const expectTarget = async id => {
    await page.waitForFunction(id => document.activeElement?.id === `prompt-${id}`, id)
    assert.equal(await page.locator('#nav-tab-prompts').getAttribute('aria-selected'), 'true')
    const card = page.locator(`#prompt-${id}`)
    assert.ok((await card.getAttribute('class')).includes('is-linked'))
    const bounds = await card.boundingBox()
    assert.ok(bounds.y >= 60 && bounds.y < 1000, 'card visible below fixed navigation')
    assert.equal(await page.locator('.prompt-dialog[open]').count(), 0, 'deep links preserve card navigation')
  }
  await page.goto(`${base}/navigation/`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('#nav-tab-articles').getAttribute('aria-selected'), 'true')
  await page.locator('#nav-tab-prompts').click()
  assert.equal(new URL(page.url()).hash, '#prompts')
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('#nav-tab-prompts').getAttribute('aria-selected'), 'true')
  for (const id of ids) {
    const card = page.locator(`#prompt-${id}`)
    const title = await card.locator('h3').textContent()
    const shareText = `${title}\nhttps://cpython666.github.io/navigation/#prompt-${id}`
    await openPrompt(id)
    if (id === 'video-cover') {
      await dialog.getByRole('textbox', { name: '视频标题' }).fill('本地标题，不应出现在分享链接')
      assert.ok((await dialog.locator('.prompt-full-text').textContent()).includes('视频标题是：本地标题，不应出现在分享链接'))
    }
    await dialog.getByRole('button', { name: /^复制提示词/ }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await dialog.locator('.prompt-full-text').textContent())
    await dialog.getByRole('button', { name: /^分享提示词/ }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), shareText)
    await dialog.getByRole('button', { name: '关闭完整提示词' }).click()
    await expectDialogClosed(id)
    await card.getByRole('button', { name: /^复制提示词/ }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await card.locator('.prompt-text').textContent())
    await card.getByRole('button', { name: /^分享提示词/ }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), shareText)
    assert.equal(await page.locator('.copy-toast').innerText(), '分享链接已复制！')
  }
  const cardHeights = await page.locator('.prompt-card').evaluateAll(cards => cards.map(card => card.getBoundingClientRect().height))
  assert.ok(Math.max(...cardHeights) - Math.min(...cardHeights) <= 1, 'short and long prompts use equal-height summary cards')
  assert.ok(await page.locator('#prompt-project-knowledge-skill .prompt-text').evaluate(el => el.scrollHeight > el.clientHeight), 'long card text is summarized visually')
  await openPrompt('project-knowledge-skill')
  await page.keyboard.press('Escape')
  await expectDialogClosed('project-knowledge-skill')
  await openPrompt('training-cutoff')
  await page.mouse.click(2, 2)
  await expectDialogClosed('training-cutoff')
  // Direct entry and refresh work for every generated link.
  for (const id of ids) {
    await page.goto(`${base}/navigation/#prompt-${id}`, { waitUntil: 'networkidle' })
    await expectTarget(id)
    await page.reload({ waitUntil: 'networkidle' })
    await expectTarget(id)
  }
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: '提示词定位' }).click()
  await expectTarget('video-cover')
  // A query change takes VitePress's same-component route path, not hashchange.
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '/navigation/?source=test#prompt-training-cutoff'
    document.body.appendChild(link)
    link.click()
    link.remove()
  })
  await expectTarget('training-cutoff')
  await page.goBack()
  await expectTarget('video-cover')
  await page.goForward()
  await expectTarget('training-cutoff')
  await page.locator('#nav-tab-articles').click()
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('#nav-tab-articles').getAttribute('aria-selected'), 'true')
  await page.goto(`${base}/navigation/#prompt-unknown`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.prompt-card.is-linked').count(), 0)
  assert.equal(await page.locator('#nav-tab-articles').getAttribute('aria-selected'), 'true')
  await page.locator('#nav-tab-prompts').click()
  await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('test rejection')) })
  await page.locator('.prompt-card').first().getByRole('button', { name: /^分享提示词/ }).click()
  await page.waitForFunction(() => document.querySelector('.copy-toast')?.textContent.includes('复制失败'))
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(`${base}/navigation/#prompt-project-knowledge-skill`, { waitUntil: 'networkidle' })
    await expectTarget('project-knowledge-skill')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.equal(await page.locator('.prompt-card').evaluateAll(cards => cards.every(card => {
      const bounds = card.getBoundingClientRect()
      return [...card.querySelectorAll('button')].every(button => button.getBoundingClientRect().right <= bounds.right)
    })), true)
    await openPrompt('project-knowledge-skill')
    assert.ok(await dialog.evaluate(el => {
      const bounds = el.getBoundingClientRect()
      return bounds.x >= 0 && bounds.y >= 0 && bounds.right <= innerWidth && bounds.bottom <= innerHeight
        && el.scrollWidth <= el.clientWidth
    }), 'full prompt dialog fits narrow viewport without horizontal overflow')
    await dialog.getByRole('button', { name: '关闭完整提示词' }).click()
    await expectDialogClosed('project-knowledge-skill')
  }
  assert.deepEqual(errors, [])
  console.log('PASS: isolated build, equal-height summaries, full-text dialogs, close/Escape/backdrop and focus return, complete copy, title-and-link sharing without private inputs, direct entry, refresh, SPA, history, unknown ID, error feedback, mobile layout, no hydration errors.')
  if (process.argv.includes('--preview')) {
    await browser.close()
    browser = undefined
    console.log(`Preview: ${base}/navigation/#prompt-project-knowledge-skill`)
    console.log('Press Ctrl+C to stop the preview and remove the temporary fixture.')
    await new Promise(done => {
      process.once('SIGINT', done)
      process.once('SIGTERM', done)
    })
  }
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
  await rm(fixture, { recursive: true, force: true })
}
