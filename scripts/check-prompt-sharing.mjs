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
  for (const path of ['.vitepress', 'navigation', 'prompts', 'utils']) await mkdir(join(fixture, path))
  for (const path of ['navigation/NavIndex.vue', 'prompts/PromptPage.vue', 'prompts/prompts.js', 'utils/copy.js']) {
    await copyFile(join(root, 'docs', path), join(fixture, path))
  }
  const { prompts } = await import(`data:text/javascript;base64,${Buffer.from(await readFile(join(fixture, 'prompts/prompts.js'))).toString('base64')}`)
  const ids = prompts.map(prompt => prompt.id)
  const categories = [...new Set(prompts.map(prompt => prompt.category))]
  for (const prompt of prompts.filter(prompt => prompt.preview)) {
    assert.match(prompt.preview, /^\/prompt-examples\/[a-z0-9-]+\.svg$/)
    assert.ok(['正常', '降智', '待标注'].includes(prompt.previewStatus))
    const destination = join(fixture, 'public', prompt.preview)
    await mkdir(join(fixture, 'public/prompt-examples'), { recursive: true })
    await copyFile(join(root, 'docs/public', prompt.preview), destination)
  }
  assert.equal(new Set(ids).size, ids.length, 'prompt IDs are unique')
  assert.ok(prompts.every(prompt => prompt.id && prompt.title && prompt.text && prompt.category), 'all prompts have content and a category')
  for (const id of ['video-cover', 'video-cover-codex', 'subtitle-correction', 'subtitle-from-script', 'training-cutoff', 'cycling-pelican-svg', 'cycling-girl-svg', 'project-knowledge-skill']) {
    assert.ok(ids.includes(id), `legacy prompt ${id} remains available`)
  }
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, 'navigation/member.data.mjs'), 'export default { load: () => [] }\n')
  await writeFile(join(fixture, 'index.md'), '# 分享测试首页\n\n[提示词定位](/prompts/#prompt-video-cover)\n')
  await writeFile(join(fixture, 'navigation/index.md'), '---\nlayout: home\nmarkdownStyles: false\n---\n<script setup>\nimport NavIndex from "./NavIndex.vue"\n</script>\n<NavIndex />\n')
  await writeFile(join(fixture, 'prompts/index.md'), '---\nlayout: home\nmarkdownStyles: false\n---\n<script setup>\nimport PromptPage from "./PromptPage.vue"\n</script>\n<PromptPage />\n')
  await writeFile(join(fixture, '.vitepress/config.mjs'), `export default ${JSON.stringify({
    title: '提示词测试', ignoreDeadLinks: true,
    themeConfig: {
      nav: [{ text: '测试首页', link: '/' }, { text: '文章导航', link: '/navigation/' }, { text: '提示词', link: '/prompts/' }],
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
      res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml' })[extname(file)] || 'application/octet-stream')
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
  const dialog = page.locator('.prompt-dialog')
  const promptSearch = page.getByRole('searchbox', { name: '搜索提示词' })
  const promptCategories = page.getByRole('group', { name: '提示词分类' })
  const followLink = href => page.evaluate(href => {
    const link = document.createElement('a')
    link.href = href
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, href)
  const expectPrompts = async expected => {
    const expectedIds = expected.map(prompt => `prompt-${prompt.id}`)
    await page.waitForFunction(expectedIds => JSON.stringify([...document.querySelectorAll('.prompt-card')].map(card => card.id)) === JSON.stringify(expectedIds), expectedIds)
    assert.equal(await page.locator('.prompt-result-count').textContent(), `显示 ${expected.length} / ${prompts.length} 条提示词`)
  }
  const openPrompt = async id => {
    const card = page.locator(`#prompt-${id}`)
    await card.getByRole('button', { name: /^查看完整提示词/ }).click()
    await dialog.waitFor({ state: 'visible' })
    assert.equal(await dialog.locator('.prompt-full-text').textContent(), await card.locator('.prompt-text').textContent())
    assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)), 'dialog receives keyboard focus')
    const prompt = prompts.find(prompt => prompt.id === id)
    if (prompt.preview) {
      await page.waitForFunction(() => document.querySelector('.prompt-preview img')?.naturalWidth > 0)
      assert.equal(await dialog.locator('.preview-status').textContent(), prompt.previewStatus)
      assert.equal(await card.locator('.preview-status').textContent(), prompt.previewStatus)
      assert.equal(await dialog.getByRole('link', { name: '下载 SVG' }).getAttribute('href'), prompt.preview)
      assert.notEqual(await dialog.getByRole('link', { name: '下载 SVG' }).getAttribute('download'), null)
    } else {
      assert.equal(await dialog.locator('.prompt-preview').count(), 0)
    }
  }
  const expectDialogClosed = async id => {
    await dialog.waitFor({ state: 'hidden' })
    await page.waitForFunction(id => document.getElementById(`prompt-${id}`)
      ?.querySelector('[aria-label^="查看完整提示词："]') === document.activeElement, id)
  }
  const expectTarget = async id => {
    await page.waitForFunction(id => document.activeElement?.id === `prompt-${id}`, id)
    assert.equal(new URL(page.url()).pathname, '/prompts/')
    const card = page.locator(`#prompt-${id}`)
    assert.ok((await card.getAttribute('class')).includes('is-linked'))
    const bounds = await card.boundingBox()
    const filters = await promptCategories.boundingBox()
    assert.ok(bounds.y >= filters.y + filters.height && bounds.y < page.viewportSize().height, 'shared card is visible below the sticky categories')
    assert.equal(await page.locator('.prompt-dialog[open]').count(), 0, 'deep links preserve card navigation')
  }
  await page.goto(`${base}/navigation/`, { waitUntil: 'networkidle' })
  await page.locator('.nav-page').waitFor()
  assert.equal(await page.locator('.prompt-card, [role=tab]').count(), 0, 'article navigation is independent of prompts')
  await page.getByRole('link', { name: '提示词', exact: true }).click()
  await promptSearch.waitFor()
  assert.equal(new URL(page.url()).pathname, '/prompts/')
  await page.reload({ waitUntil: 'networkidle' })
  await expectPrompts(prompts)
  assert.deepEqual(await promptCategories.getByRole('button').allTextContents(), ['全部', ...categories])
  for (const category of categories) {
    await promptCategories.getByRole('button', { name: category, exact: true }).click()
    await expectPrompts(prompts.filter(prompt => prompt.category === category))
    assert.equal(await promptCategories.getByRole('button', { name: category, exact: true }).getAttribute('aria-pressed'), 'true')
  }
  await promptCategories.getByRole('button', { name: '全部', exact: true }).click()
  for (const search of ['训练数据截止时间', ' GDSCRIPT ', '视频创作']) {
    await promptSearch.fill(search)
    await expectPrompts(prompts.filter(prompt => `${prompt.title} ${prompt.text} ${prompt.category}`.toLowerCase().includes(search.trim().toLowerCase())))
  }
  await promptCategories.getByRole('button', { name: '视频创作', exact: true }).click()
  await promptSearch.fill('文案')
  await expectPrompts(prompts.filter(prompt => prompt.category === '视频创作' && `${prompt.title} ${prompt.text} ${prompt.category}`.includes('文案')))
  await promptSearch.fill('__no_prompt_match__')
  await expectPrompts([])
  assert.equal(await page.getByRole('heading', { name: '没有匹配的提示词' }).count(), 1)
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await expectPrompts(prompts)
  assert.equal(await promptSearch.inputValue(), '')
  assert.equal(await promptCategories.getByRole('button', { name: '全部', exact: true }).getAttribute('aria-pressed'), 'true')
  // A shared hash reveals its card even when both filters exclude it.
  await promptCategories.getByRole('button', { name: '视频创作', exact: true }).click()
  await promptSearch.fill('__no_prompt_match__')
  await page.evaluate(() => { location.hash = '#prompt-training-cutoff' })
  await expectTarget('training-cutoff')
  await expectPrompts(prompts)
  assert.equal(await promptSearch.inputValue(), '')
  assert.equal(await promptCategories.getByRole('button', { name: '全部', exact: true }).getAttribute('aria-pressed'), 'true')
  // Filtering retires the old target hash so opening the same share link works again.
  await promptCategories.getByRole('button', { name: '视频创作', exact: true }).click()
  await promptSearch.fill('__no_prompt_match__')
  assert.equal(new URL(page.url()).hash.startsWith('#prompt-'), false, 'filtering clears the previous target hash')
  await followLink('/prompts/#prompt-training-cutoff')
  await expectTarget('training-cutoff')
  await expectPrompts(prompts)
  for (const id of ids) {
    const card = page.locator(`#prompt-${id}`)
    const title = await card.locator('h3').textContent()
    const shareText = `${title}\nhttps://cpython666.github.io/prompts/#prompt-${id}`
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
  await page.locator('.prompt-card').last().scrollIntoViewIfNeeded()
  assert.ok(await promptCategories.evaluate(el => {
    const bounds = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    return style.position === 'sticky' && Math.abs(bounds.top - parseFloat(style.top)) < 1
      && bounds.height < 80 && bounds.left >= 0 && bounds.right <= innerWidth
  }), 'desktop categories remain in one sticky row')
  await openPrompt('project-knowledge-skill')
  await page.keyboard.press('Escape')
  await expectDialogClosed('project-knowledge-skill')
  await openPrompt('training-cutoff')
  await page.mouse.click(2, 2)
  await expectDialogClosed('training-cutoff')
  // Direct entry and refresh work for every generated link.
  for (const id of ids) {
    await page.goto(`${base}/prompts/#prompt-${id}`, { waitUntil: 'networkidle' })
    await expectTarget(id)
    await page.reload({ waitUntil: 'networkidle' })
    await expectTarget(id)
  }
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: '提示词定位' }).click()
  await expectTarget('video-cover')
  // A query change takes VitePress's same-component route path, not hashchange.
  await followLink('/prompts/?source=test#prompt-training-cutoff')
  await expectTarget('training-cutoff')
  await expectPrompts(prompts)
  assert.equal(await promptSearch.inputValue(), '')
  await page.goBack()
  await expectTarget('video-cover')
  await page.goForward()
  await expectTarget('training-cutoff')
  await promptCategories.getByRole('button', { name: '视频创作', exact: true }).click()
  await promptSearch.fill('__no_prompt_match__')
  await followLink('/prompts/?source=filtered#prompt-project-knowledge-skill')
  await expectTarget('project-knowledge-skill')
  await expectPrompts(prompts)
  assert.equal(await promptSearch.inputValue(), '')
  await page.getByRole('link', { name: '文章导航', exact: true }).click()
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(new URL(page.url()).pathname, '/navigation/')
  assert.equal(await page.locator('.prompt-card, [role=tab]').count(), 0)
  await page.goto(`${base}/prompts/#prompt-unknown`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.prompt-card.is-linked').count(), 0)
  await expectPrompts(prompts)
  // Old entry points retain their target/query and replace the legacy route.
  await page.goto(`${base}/navigation/#prompts`, { waitUntil: 'networkidle' })
  await page.waitForURL(url => url.pathname === '/prompts/')
  await expectPrompts(prompts)
  await page.goto(`${base}/navigation/?source=legacy#prompt-project-knowledge-skill`, { waitUntil: 'networkidle' })
  await expectTarget('project-knowledge-skill')
  assert.equal(new URL(page.url()).search, '?source=legacy')
  await page.goto(`${base}/navigation/`, { waitUntil: 'networkidle' })
  await followLink('/navigation/#prompt-video-cover')
  await expectTarget('video-cover')
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await followLink('/navigation/#prompt-training-cutoff')
  await expectTarget('training-cutoff')
  await page.goBack()
  await page.waitForURL(base + '/')
  assert.equal(await page.locator('.prompt-card').count(), 0, 'back skips the replaced legacy route')
  await page.goto(`${base}/prompts/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('test rejection')) })
  await page.locator('.prompt-card').first().getByRole('button', { name: /^分享提示词/ }).click()
  await page.waitForFunction(() => document.querySelector('.copy-toast')?.textContent.includes('复制失败'))
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(`${base}/prompts/#prompt-project-knowledge-skill`, { waitUntil: 'networkidle' })
    await expectTarget('project-knowledge-skill')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.ok(await page.locator('.prompt-search').evaluate(el => {
      const bounds = el.getBoundingClientRect()
      return bounds.left >= 0 && bounds.right <= innerWidth && el.scrollWidth <= el.clientWidth
        && [...el.querySelectorAll('button, input')].every(control => control.getBoundingClientRect().right <= bounds.right)
    }), 'prompt search fits the narrow viewport')
    assert.ok(await promptCategories.evaluate(el => {
      const bounds = el.getBoundingClientRect()
      return bounds.left >= 0 && bounds.right <= innerWidth && bounds.height < 80
        && getComputedStyle(el).position === 'sticky' && Math.abs(bounds.top) < 1
        && getComputedStyle(el).overflowX === 'auto'
    }), 'mobile categories stick to the viewport top in a compact scrollable row')
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
    await openPrompt('cycling-erlang-svg')
    assert.ok(await dialog.locator('.prompt-preview img').evaluate(el => {
      const bounds = el.getBoundingClientRect()
      return bounds.width > 0 && bounds.left >= 0 && bounds.right <= innerWidth
    }), 'SVG preview fits the mobile dialog')
    await dialog.getByRole('button', { name: '关闭完整提示词' }).click()
    await expectDialogClosed('cycling-erlang-svg')
    await promptCategories.getByRole('button', { name: categories.at(-1), exact: true }).click()
    await expectPrompts(prompts.filter(prompt => prompt.category === categories.at(-1)))
    const lastCategory = await promptCategories.getByRole('button', { name: categories.at(-1), exact: true }).boundingBox()
    assert.ok(lastCategory.x >= 0 && lastCategory.x + lastCategory.width <= width, 'last category remains reachable on mobile')
    await promptCategories.getByRole('button', { name: '全部', exact: true }).click()
    await page.locator('.prompt-card').last().scrollIntoViewIfNeeded()
    await promptCategories.getByRole('button', { name: '编程与项目', exact: true }).click()
    await expectPrompts(prompts.filter(prompt => prompt.category === '编程与项目'))
    const firstCard = await page.locator('.prompt-card').first().boundingBox()
    const filterBounds = await promptCategories.boundingBox()
    assert.ok(firstCard.y >= filterBounds.y + filterBounds.height && firstCard.y < 200, 'switching a sticky category starts at the first result')
  }
  assert.deepEqual(errors, [])
  console.log(`PASS: independent /prompts/ page with ${prompts.length} prompts across ${categories.length} dynamic categories; legacy route replacement, title/content/category search, combined filters, result count, empty-state reset, shared-link filter reset, equal-height summaries, full-text dialogs, close/Escape/backdrop and focus return, complete copy, canonical title-and-link sharing without private inputs, direct entry, refresh, SPA, history, unknown ID, error feedback, sticky categories, mobile layout, no hydration errors.`)
  if (process.argv.includes('--preview')) {
    await browser.close()
    browser = undefined
    console.log(`Internal preview: ${base}/prompts/ (use the complete local site for user review)`)
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
