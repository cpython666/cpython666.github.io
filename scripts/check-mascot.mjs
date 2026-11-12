// Isolated mascot check: only the loader, mascot component and referenced sprite sheets are copied.
// Run: node scripts/check-mascot.mjs [--screenshots]
import assert from 'node:assert/strict'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { gzipSync } from 'node:zlib'
import { build, preview } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'mascot-check-')))
const waitForSprites = async target => {
  await target.locator('.mascot-sprite').waitFor()
  await target.waitForFunction(() => document.querySelector('.starfish-mascot')?.dataset.renderer === 'sprites')
  assert.equal(await target.locator('canvas').count(), 0, 'sprite playback does not create a canvas')
  assert.equal(await target.evaluate(() => Boolean(window.PIXI || window.Live2DCubismCore)), false, 'no Live2D runtime is initialized')
}
const pose = target => target.evaluate(() => {
  const sprite = document.querySelector('.mascot-sprite')
  if (!sprite) return null
  const style = getComputedStyle(sprite)
  return { image: style.backgroundImage, position: style.backgroundPosition, transform: getComputedStyle(sprite.parentElement).transform }
})
const assertStopped = async (target, label) => {
  await target.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
  const initial = await pose(target)
  await target.waitForTimeout(350)
  assert.deepEqual(await pose(target), initial, label)
  assert.ok(await target.evaluate(() => [...document.querySelectorAll('.starfish-mascot')].flatMap(element => element.getAnimations({ subtree: true })).every(animation => animation.playState !== 'running')), `${label}: no running animation`)
}
let server
let browser
try {
  const componentPath = join(root, 'docs/.vitepress/theme/components/StarFishMascot.vue')
  const component = await readFile(componentPath, 'utf8')
  await copyFile(componentPath, join(fixture, 'StarFishMascot.vue'))
  await copyFile(join(root, 'docs/.vitepress/theme/components/StarFishMascotLoader.vue'), join(fixture, 'StarFishMascotLoader.vue'))
  const publicRoot = join(root, 'docs/public')
  const spritePath = '/mascot/xiaoxingyu/sprites.webp'
  const wavePath = '/mascot/xiaoxingyu/wave.webp'
  const moodsPath = '/mascot/xiaoxingyu/moods.webp'
  const assets = [...new Set([...component.matchAll(/['"`](\/[^'"`]+\.(?:png|webp|svg))['"`]/g)].map(match => match[1]))]
  assert.ok([spritePath, wavePath, moodsPath].every(asset => assets.includes(asset)), 'base poses and both on-demand action atlases are referenced')
  const assetSizes = {}
  for (const asset of assets) {
    const source = resolve(publicRoot, `.${asset}`)
    assert.ok(source.startsWith(publicRoot + '/'), 'artwork stays inside public')
    const destination = join(fixture, 'public', asset)
    await mkdir(dirname(destination), { recursive: true })
    await copyFile(source, destination)
    assetSizes[asset] = (await stat(source)).size
  }
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, 'index.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"><title>小星鱼隔离检查</title><style>
    :root { --vp-c-bg: #fff; --vp-c-bg-soft: #f6f6f7; --vp-c-divider: #ddd; --vp-c-text-1: #333; --vp-c-text-2: #67676c; --vp-c-brand-1: #5d6de8; --vp-c-brand-soft: #eeefff; }
    * { box-sizing: border-box; } body { margin: 0; font: 16px system-ui; } button, input { font: inherit; }
  </style><div id="app"></div><img src="/fixture-load-gate.svg" width="1" height="1" alt=""><script type="module" src="/main.js"></script></html>`)
  await writeFile(join(fixture, 'public/fixture-load-gate.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')
  await writeFile(join(fixture, 'main.js'), `import { createApp, h, ref } from 'vue'
import StarFishMascotLoader from './StarFishMascotLoader.vue'
createApp({ setup() {
  const mounted = ref(true)
  return () => h('main', [
    h('button', { id: 'fixture-mount', onClick: () => { mounted.value = !mounted.value } }, '切换挂载'),
    h('p', '仅供检查的人工页面'), mounted.value ? h(StarFishMascotLoader) : null,
  ])
} }).mount('#app')
`)
  await build({ root: fixture, configFile: false, plugins: [vue()], logLevel: 'error', build: { manifest: true } })
  const manifest = JSON.parse(await readFile(join(fixture, 'dist/.vite/manifest.json'), 'utf8'))
  const bodyChunk = Object.values(manifest).find(entry => entry.src?.endsWith('StarFishMascot.vue'))
  assert.ok(bodyChunk?.isDynamicEntry, 'the mascot body is a separate dynamic production chunk')
  const bodyCode = await readFile(join(fixture, 'dist', bodyChunk.file))
  assert.equal(/cubism|pixi|model3|moc3/i.test(JSON.stringify(manifest)), false, 'no Live2D assets are bundled')
  assert.ok(assetSizes[spritePath] <= 100 * 1024, 'initial pose atlas stays within 100 KiB')
  for (const path of [wavePath, moodsPath]) assert.ok(assetSizes[path] <= 180 * 1024, 'each on-demand action atlas stays within 180 KiB')
  console.log(`Mascot production assets: ${JSON.stringify(assetSizes)}; body JS ${bodyCode.length} bytes / ${gzipSync(bodyCode).length} bytes gzip (isolated Vue fixture).`)
  let releaseLoad
  const loadGate = new Promise(done => { releaseLoad = done })
  let blockInitialLoad = true
  let bodyGate
  let waveGate
  let moodsGate
  let failNextWave = false
  server = await preview({
    root: fixture, configFile: false, logLevel: 'error', preview: { host: '127.0.0.1', port: 0 },
    plugins: [{ name: 'mascot-check-gates', configurePreviewServer(previewServer) {
      // Hold server responses, not Playwright routes: routing disables the browser cache.
      previewServer.middlewares.use(async (request, response, next) => {
        if (request.url === '/fixture-load-gate.svg' && blockInitialLoad) {
          blockInitialLoad = false
          await loadGate
        }
        if (request.url === '/' + bodyChunk.file && bodyGate) {
          const pending = bodyGate
          bodyGate = undefined
          await pending
        }
        if (request.url === wavePath) {
          if (failNextWave) {
            failNextWave = false
            response.writeHead(503, { 'Cache-Control': 'no-store' })
            response.end()
            return
          }
          if (waveGate) {
            const pending = waveGate
            waveGate = undefined
            await pending
          }
        }
        if (request.url === moodsPath && moodsGate) {
          const pending = moodsGate
          moodsGate = undefined
          await pending
        }
        next()
      })
    } }],
  })
  const base = `http://127.0.0.1:${server.httpServer.address().port}`
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  page.setDefaultTimeout(10000)
  const errors = []
  const assertAssetRequests = (requests, count, label, waveCount = 0, moodsCount = 0) => {
    assert.equal(requests.filter(path => path === spritePath).length, count, `${label}: base atlas request count`)
    assert.equal(requests.filter(path => path === wavePath).length, waveCount, `${label}: wave atlas request count`)
    assert.equal(requests.filter(path => path === moodsPath).length, moodsCount, `${label}: happy/sleep atlas request count`)
    assert.equal(requests.some(path => /cubism|pixi|live2d|model3\.json|\.moc3/i.test(path)), false, `${label}: no Live2D request`)
  }
  const screenshot = async (target, name) => {
    if (!process.argv.includes('--screenshots')) return
    const path = `/tmp/xiaoxingyu-${name}.png`
    await target.screenshot({ path })
    console.log(`Screenshot: ${path}`)
  }
  page.on('pageerror', error => errors.push(error.message))
  const deferred = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  deferred.on('pageerror', error => errors.push(error.message))
  const deferredRequests = []
  deferred.on('request', request => deferredRequests.push(new URL(request.url()).pathname))
  await deferred.addInitScript(() => {
    const idle = new Map()
    let id = 0
    window.requestIdleCallback = callback => { idle.set(++id, callback); return id }
    window.cancelIdleCallback = key => idle.delete(key)
    window.__mascotIdleCount = () => idle.size
    window.__flushMascotIdle = () => {
      const callbacks = [...idle.values()]
      idle.clear()
      callbacks.forEach(callback => callback({ didTimeout: false, timeRemaining: () => 50 }))
    }
  })
  const assertDeferred = stage => {
    assert.equal(deferredRequests.includes('/' + bodyChunk.file), false, `${stage}: no mascot body request`)
    assertAssetRequests(deferredRequests, 0, stage)
  }
  await deferred.goto(base, { waitUntil: 'domcontentloaded' })
  await deferred.locator('#fixture-mount').waitFor()
  assertDeferred('before window.load')
  await deferred.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  releaseLoad()
  await deferred.waitForLoadState('load')
  assertDeferred('loaded in a hidden tab')
  assert.equal(await deferred.evaluate(() => window.__mascotIdleCount()), 0)
  await deferred.evaluate(() => {
    delete document.hidden
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await deferred.waitForFunction(() => window.__mascotIdleCount() === 1)
  assertDeferred('before idle callback')
  await deferred.locator('#fixture-mount').click()
  assert.equal(await deferred.evaluate(() => window.__mascotIdleCount()), 0, 'unmount cancels deferred loading')
  await deferred.evaluate(() => window.__flushMascotIdle())
  assertDeferred('after cancelled idle callback')
  await deferred.locator('#fixture-mount').click()
  await deferred.waitForFunction(() => window.__mascotIdleCount() === 1)
  let releaseBody
  bodyGate = new Promise(done => { releaseBody = done })
  const bodyRequest = deferred.waitForRequest(request => new URL(request.url()).pathname === '/' + bodyChunk.file, { timeout: 10000 })
  await deferred.evaluate(() => window.__flushMascotIdle())
  await bodyRequest
  await deferred.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  const bodyResponse = deferred.waitForResponse(response => new URL(response.url()).pathname === '/' + bodyChunk.file)
  releaseBody()
  await bodyResponse
  await deferred.waitForLoadState('networkidle')
  assert.equal(await deferred.locator('.starfish-mascot').count(), 0, 'an import finishing in a background tab does not mount the mascot')
  assertAssetRequests(deferredRequests, 0, 'an import finishing in a background tab does not request artwork')
  await deferred.evaluate(() => {
    delete document.hidden
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await waitForSprites(deferred)
  await deferred.waitForLoadState('networkidle')
  assert.equal(deferredRequests.filter(path => path === '/' + bodyChunk.file).length, 1)
  assertAssetRequests(deferredRequests, 1, 'foreground mounting requests only the base atlas once')
  await deferred.close()
  const desktopRequests = []
  page.on('request', request => desktopRequests.push(new URL(request.url()).pathname))
  await page.goto(base, { waitUntil: 'networkidle' })
  const mascot = page.locator('.starfish-mascot')
  const character = page.getByRole('button', { name: '小星鱼，打开菜单', exact: true })
  const openMenu = async () => {
    if (await character.getAttribute('aria-expanded') !== 'true') await character.click()
  }
  const fits = async label => {
    const bounds = await character.boundingBox()
    const viewport = page.viewportSize()
    assert.ok(bounds && bounds.width > 0 && bounds.height > 0 && bounds.x >= -1 && bounds.y >= -1 &&
      bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1, label)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mascot does not add horizontal overflow')
  }
  await character.waitFor()
  await waitForSprites(page)
  assertAssetRequests(desktopRequests, 1, 'desktop initially requests only the base atlas')
  assert.equal(await page.locator('.mascot-preload').first().getAttribute('fetchpriority'), 'low', 'base atlas uses low fetch priority')
  const sprite = page.locator('.mascot-sprite')
  await fits('initial mascot fits the desktop viewport')
  assert.equal(await mascot.getAttribute('data-motion'), 'running')
  const idleFrames = await sprite.evaluate(element => {
    const animation = element.getAnimations()[0]
    const originalTime = animation.currentTime
    const duration = animation.effect.getTiming().duration
    const positions = animation.effect.getKeyframes().map(frame => {
      animation.currentTime = duration * frame.computedOffset
      return getComputedStyle(element).backgroundPosition
    })
    animation.currentTime = originalTime
    return positions
  })
  assert.ok(new Set(idleFrames).size >= 2, 'idle animation changes the actual atlas frame for blinking')
  assert.equal(await page.locator('.mascot-motion').evaluate(element => getComputedStyle(element).transform), 'none', 'the character wrapper does not translate the whole body')
  assert.equal(await page.locator('.mascot-motion').evaluate(element => element.getAnimations().length), 0, 'the wrapper has no continuous floating timeline')
  await screenshot(page, 'desktop')
  await openMenu()
  await screenshot(page, 'desktop-menu')
  for (const name of ['弹一下', '打招呼', '开心', '小憩']) assert.ok(await page.getByRole('button', { name, exact: true }).isVisible(), `${name} is available`)
  await page.keyboard.press('Escape')
  assert.equal(await character.getAttribute('aria-expanded'), 'false', 'Escape closes the menu')
  const selectAction = async name => {
    await openMenu()
    await page.getByRole('button', { name, exact: true }).click()
  }
  const waitState = (state, phase) => page.waitForFunction(([state, phase]) => {
    const data = document.querySelector('.starfish-mascot')?.dataset
    return data?.state === state && (!phase || data.phase === phase)
  }, [state, phase])
  const sampleTimeline = async () => sprite.evaluate(element => {
    const animation = element.getAnimations().find(item => !item.animationName)
    if (!animation) throw new Error('Expected an active action timeline')
    window.__actionAnimation = animation
    window.__actionSprite = element
    const originalTime = animation.currentTime
    const timing = animation.effect.getTiming()
    const keys = animation.effect.getKeyframes()
    const layouts = []
    const frames = keys.slice(0, -1).map(key => {
      animation.currentTime = timing.duration * key.computedOffset + 1
      const [x, y] = getComputedStyle(element).backgroundPosition.split(' ').map(parseFloat)
      layouts.push(['.starfish-mascot', '.mascot-character', '.mascot-motion', '.mascot-sprite'].map(selector => {
        const node = document.querySelector(selector)
        const { x, y, width, height } = node.getBoundingClientRect()
        return { x, y, width, height, transform: getComputedStyle(node).transform }
      }))
      return Math.round(x / (100 / 3)) + Math.round(y / (100 / 3)) * 4
    })
    animation.currentTime = originalTime
    return { frames, layouts, duration: timing.duration, iterations: timing.iterations, originalTime }
  })
  const assertAdjacent = (sequence, first, last, poses, label) => {
    assert.equal(sequence.frames[0], first, `${label}: begins at the expected pose`)
    assert.equal(sequence.frames.at(-1), last, `${label}: finishes at the expected pose`)
    assert.equal(new Set(sequence.frames).size, poses, `${label}: uses real intermediate poses`)
    assert.ok(sequence.frames.every((frame, index) => index === 0 || Math.abs(frame - sequence.frames[index - 1]) <= 1), `${label}: no pose is skipped`)
    assert.ok(sequence.duration / sequence.frames.length >= 75 && sequence.duration / sequence.frames.length <= 100, `${label}: successive poses display for 75–100ms`)
    assert.equal(sequence.iterations, 1, `${label}: action timeline is finite`)
    for (const layout of sequence.layouts) assert.deepEqual(layout, sequence.layouts[0], `${label}: every pose keeps the same viewport and sprite layout boxes`)
    assert.ok(sequence.layouts[0].every(node => node.transform === 'none'), `${label}: no whole-body translation is added to the frame animation`)
  }
  const sampleBounce = async () => {
    await page.waitForFunction(() => document.querySelector('.mascot-motion')?.getAnimations().length === 1)
    return page.locator('.mascot-motion').evaluate(element => {
      const animation = element.getAnimations()[0]
      window.__bounceAnimation = animation
      const originalTime = animation.currentTime
      const timing = animation.effect.getTiming()
      const keys = animation.effect.getKeyframes()
      const sample = time => {
        animation.currentTime = time
        const style = getComputedStyle(element)
        const matrix = new DOMMatrixReadOnly(style.transform)
        const { x, y, width, height } = element.getBoundingClientRect()
        const spriteStyle = getComputedStyle(element.querySelector('.mascot-sprite'))
        return { matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f],
          bounds: { x, y, width, height }, image: spriteStyle.backgroundImage, position: spriteStyle.backgroundPosition }
      }
      const samples = keys.map(key => sample(timing.duration * key.computedOffset))
      const interval = timing.duration * keys[1].computedOffset
      const between = [sample(interval * .3), sample(interval * .7)]
      animation.currentTime = originalTime
      return { samples, between, duration: timing.duration, iterations: timing.iterations, originalTime }
    })
  }
  const assertBounceBounds = (sequence, label) => {
    const viewport = page.viewportSize()
    for (const { bounds } of [...sequence.samples, ...sequence.between]) assert.ok(
      bounds.x >= -1 && bounds.y >= -1 && bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1,
      `${label}: the transformed drawing stays inside the viewport`)
  }
  await selectAction('暂停动画')
  await selectAction('弹一下')
  await waitState('bounce', 'playing')
  const bounce = await sampleBounce()
  assert.ok(bounce.duration > 0 && bounce.duration <= 1500 && bounce.iterations === 1, 'bounce is a short, finite action')
  assert.deepEqual(bounce.samples[0].matrix, [1, 0, 0, 1, 0, 0], 'bounce begins at the unchanged standing pose')
  assert.deepEqual(bounce.samples.at(-1).matrix, [1, 0, 0, 1, 0, 0], 'bounce settles back to the unchanged standing pose')
  assert.notDeepEqual(bounce.between[0].matrix, bounce.between[1].matrix, 'bounce interpolates between poses instead of stepping between frames')
  assert.ok(bounce.samples.some(({ matrix }) => matrix[0] > 1 && matrix[3] < 1), 'bounce includes a grounded squash')
  assert.ok(bounce.samples.some(({ matrix }) => matrix[0] < 1 && matrix[3] > 1 && matrix[5] < 0), 'bounce stretches during takeoff')
  assert.ok(bounce.samples.some(({ matrix }) => matrix[5] < -5), 'bounce lifts the drawing visibly')
  for (const sample of [...bounce.samples, ...bounce.between]) {
    assert.ok(sample.image.endsWith('/sprites.webp")'), 'bounce preserves the original base drawing')
    assert.deepEqual(sample.position.split(/\s+/).map(parseFloat), [0, 0], 'bounce does not change the character pose or face')
  }
  assertBounceBounds(bounce, 'desktop bounce')
  assertAssetRequests(desktopRequests, 1, 'bounce does not request an action atlas')
  assert.equal(await page.locator('.mascot-action-preload').count(), 0, 'bounce needs no artwork preload')
  await page.evaluate(() => { window.__bounceAnimation.currentTime = 400 })
  await assertStopped(page, 'pausing bounce holds the exact elastic pose')
  await screenshot(page, 'bounce')
  if (process.argv.includes('--screenshots')) {
    for (const [name, progress] of [['crouch', .18], ['takeoff', .31], ['airborne', .44], ['landing', .62], ['rebound', .76]]) {
      await page.evaluate(time => { window.__bounceAnimation.currentTime = time }, bounce.duration * progress)
      await screenshot(page, `bounce-${name}`)
    }
    await page.evaluate(() => { window.__bounceAnimation.currentTime = 400 })
  }
  await selectAction('弹一下')
  assert.ok(await page.evaluate(() => document.querySelector('.mascot-motion').getAnimations()[0] === window.__bounceAnimation && document.querySelector('.starfish-mascot').getAnimations({ subtree: true }).length === 1), 'repeated bounce intent neither restarts nor stacks animation')
  await selectAction('恢复动画')
  await page.waitForTimeout(100)
  assert.ok(await page.evaluate(() => window.__bounceAnimation.currentTime > 400 && document.querySelector('.mascot-motion').getAnimations()[0] === window.__bounceAnimation), 'bounce resumes the same timeline from its paused progress')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await assertStopped(page, 'reduced motion pauses the active bounce without changing its pose')
  const reducedBounceTime = await page.evaluate(() => window.__bounceAnimation.currentTime)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForTimeout(50)
  assert.ok(await page.evaluate(time => window.__bounceAnimation.currentTime > time && document.querySelector('.mascot-motion').getAnimations()[0] === window.__bounceAnimation, reducedBounceTime), 'leaving reduced motion resumes the same bounce')
  await waitState('idle')
  assert.equal(await page.locator('.mascot-motion').evaluate(element => getComputedStyle(element).transform), 'none', 'completed bounce clears the transform')
  assert.equal(await page.locator('.mascot-motion').evaluate(element => element.getAnimations().length), 0, 'completed bounce leaves no floating timeline')
  await selectAction('暂停动画')
  await selectAction('弹一下')
  await sampleBounce()
  await page.evaluate(() => { window.__bounceAnimation.currentTime = 400 })
  await selectAction('隐藏小星鱼')
  assert.equal(await page.locator('.mascot-motion').count(), 0, 'hiding removes an active bounce')
  assert.ok(await page.evaluate(() => window.__bounceAnimation.playState === 'idle' && window.__bounceAnimation.currentTime === null), 'hiding cancels the detached bounce timeline')
  await page.getByRole('button', { name: '召回小星鱼', exact: true }).click()
  await waitForSprites(page)
  assert.equal(await mascot.getAttribute('data-state'), 'idle', 'recall does not restart the cancelled bounce')
  await selectAction('恢复动画')
  let releaseWave
  waveGate = new Promise(done => { releaseWave = done })
  await selectAction('打招呼')
  const preload = page.locator('.mascot-action-preload[data-asset="wave"]')
  await preload.waitFor({ state: 'attached' })
  assert.equal(await preload.getAttribute('fetchpriority'), 'low', 'wave atlas uses low fetch priority')
  assert.equal(await sprite.evaluate(element => element.classList.contains('mascot-wave-sprite')), false, 'loading wave keeps the base pose visible')
  assert.ok((await pose(page)).image.endsWith('/sprites.webp")'), 'base atlas stays visible while the wave loads')
  await assertStopped(page, 'loading an action holds the current pose')
  releaseWave()
  await waitState('wave', 'playing')
  await page.waitForTimeout(350)
  assertAssetRequests(desktopRequests, 1, 'first greeting loads only the wave atlas once', 1)
  await selectAction('暂停动画')
  await assertStopped(page, 'mid-wave pause keeps the displayed frame and body still')
  const waveSequence = await sampleTimeline()
  assertAdjacent(waveSequence, 0, 0, 16, 'wave raises, waves and lowers the arm')
  await page.evaluate(() => { window.__actionAnimation.currentTime = 1150 })
  await screenshot(character, 'wave')
  await page.evaluate(time => { window.__actionAnimation.currentTime = time }, waveSequence.originalTime)
  await selectAction('恢复动画')
  await page.waitForTimeout(150)
  assert.ok(await page.evaluate(time => window.__actionAnimation.currentTime > time && window.__actionSprite === document.querySelector('.mascot-sprite') && document.querySelector('.mascot-sprite').getAnimations().includes(window.__actionAnimation), waveSequence.originalTime), 'resuming continues the same wave timeline and element')
  for (const mode of ['reading', 'print']) {
    if (mode === 'reading') await page.evaluate(() => document.body.classList.add('article-reading-mode'))
    else await page.emulateMedia({ media: 'print' })
    await assertStopped(page, `${mode} pauses the active wave`)
    const heldTime = await page.evaluate(() => window.__actionAnimation.currentTime)
    assert.equal(await mascot.isVisible(), false, `${mode} hides the character`)
    if (mode === 'reading') await page.evaluate(() => document.body.classList.remove('article-reading-mode'))
    else await page.emulateMedia({ media: 'screen' })
    await page.waitForTimeout(100)
    assert.ok(await page.evaluate(time => window.__actionAnimation.currentTime > time && document.querySelector('.mascot-sprite').getAnimations().includes(window.__actionAnimation), heldTime), `${mode} resumes without restarting the wave`)
  }
  await waitState('idle')
  await selectAction('打招呼')
  await waitState('wave', 'playing')
  assertAssetRequests(desktopRequests, 1, 'repeated greeting reuses the loaded wave atlas', 1)
  await selectAction('隐藏小星鱼')
  assert.equal(await sprite.count(), 0, 'hiding cancels the active wave')
  assert.equal(await mascot.getAttribute('data-state'), 'idle')
  await page.getByRole('button', { name: '召回小星鱼', exact: true }).click()
  await waitForSprites(page)
  assert.equal(await mascot.getAttribute('data-state'), 'idle', 'recall does not restart the cancelled wave')
  await selectAction('打招呼')
  await waitState('wave', 'playing')
  await selectAction('暂停动画')
  await sampleTimeline()
  await page.evaluate(() => { window.__actionAnimation.currentTime = 1150 })
  let releaseMoods
  moodsGate = new Promise(done => { releaseMoods = done })
  await selectAction('开心')
  await page.locator('.mascot-action-preload[data-asset="moods"]').waitFor({ state: 'attached' })
  assert.equal(await page.locator('.mascot-action-preload').getAttribute('fetchpriority'), 'low')
  assert.equal(await mascot.getAttribute('data-state'), 'wave', 'loading a new atlas preserves the displayed action')
  await assertStopped(page, 'slow mood loading preserves the exact current wave pose')
  releaseMoods()
  await waitState('wave', 'returning')
  const returning = await sampleTimeline()
  assertAdjacent(returning, 13, 0, 14, 'interrupting a wave retraces the current pose to neutral')
  assertAssetRequests(desktopRequests, 1, 'first mood intent loads the shared mood atlas once', 1, 1)
  await selectAction('小憩')
  await selectAction('打招呼')
  await selectAction('小憩')
  assert.equal(await mascot.getAttribute('data-requested'), 'sleep', 'rapid switches retain the newest intent')
  assert.ok(await page.evaluate(() => document.querySelector('.mascot-sprite').getAnimations().includes(window.__actionAnimation)), 'rapid switches do not restart the in-progress return')
  await selectAction('恢复动画')
  await waitState('sleep', 'hold')
  assertAssetRequests(desktopRequests, 1, 'sleep reuses the already loaded mood atlas', 1, 1)
  await selectAction('暂停动画')
  await selectAction('待机')
  await waitState('sleep', 'returning')
  const waking = await sampleTimeline()
  assertAdjacent(waking, 15, 8, 8, 'waking lowers the hands through the sleep poses in reverse')
  await selectAction('恢复动画')
  await waitState('idle')
  await selectAction('开心')
  await waitState('happy', 'playing')
  await selectAction('暂停动画')
  const happy = await sampleTimeline()
  assertAdjacent(happy, 0, 0, 8, 'happy moves hands together and returns to neutral')
  await page.evaluate(() => { window.__actionAnimation.currentTime = 650 })
  await screenshot(character, 'happy')
  await page.evaluate(time => { window.__actionAnimation.currentTime = time }, happy.originalTime)
  await assertStopped(page, 'happy pause retains its actual middle frame')
  await selectAction('恢复动画')
  await page.waitForTimeout(100)
  assert.ok(await page.evaluate(time => window.__actionAnimation.currentTime > time && document.querySelector('.mascot-sprite').getAnimations().includes(window.__actionAnimation), happy.originalTime), 'happy resumes the same timeline instead of restarting its duration')
  await waitState('idle')
  await selectAction('暂停动画')
  await selectAction('弹一下')
  await sampleBounce()
  await page.evaluate(() => { window.__bounceAnimation.currentTime = 400 })
  for (const name of ['开心', '打招呼', '弹一下', '小憩']) await selectAction(name)
  assert.equal(await mascot.getAttribute('data-state'), 'bounce', 'switching intent lets the in-flight bounce land first')
  assert.equal(await mascot.getAttribute('data-requested'), 'sleep', 'bounce queues only the latest requested action')
  assert.ok(await page.evaluate(() => document.querySelector('.mascot-motion').getAnimations()[0] === window.__bounceAnimation && window.__bounceAnimation.currentTime === 400 && document.querySelector('.starfish-mascot').getAnimations({ subtree: true }).length === 1), 'queued actions keep the current bounce pose and never stack timelines')
  await selectAction('恢复动画')
  await waitState('sleep', 'hold')
  assert.equal(await page.locator('.mascot-motion').evaluate(element => getComputedStyle(element).transform), 'none', 'the queued action starts after bounce returns to its normal transform')
  await selectAction('待机')
  await waitState('idle')
  await selectAction('小憩')
  await waitState('sleep', 'playing')
  await selectAction('暂停动画')
  const sleeping = await sampleTimeline()
  assertAdjacent(sleeping, 8, 15, 8, 'sleep lifts hands and closes eyes gradually')
  await page.evaluate(() => { window.__actionAnimation.currentTime = 600 })
  await screenshot(character, 'sleep')
  await page.evaluate(time => { window.__actionAnimation.currentTime = time }, sleeping.originalTime)
  await selectAction('恢复动画')
  await waitState('sleep', 'hold')
  await page.waitForTimeout(3800)
  assert.equal(await mascot.getAttribute('data-state'), 'sleep', 'sleep remains held beyond finite action duration')
  await selectAction('暂停动画')
  assert.equal(await mascot.getAttribute('data-paused'), 'true')
  assert.equal(await mascot.getAttribute('data-motion'), 'paused')
  await assertStopped(page, 'manual pause stops sprite and body animation')
  const pausedFrame = await character.screenshot()
  await page.waitForTimeout(350)
  assert.ok(pausedFrame.equals(await character.screenshot()), 'paused sprite remains visually still')
  await page.reload({ waitUntil: 'networkidle' })
  await waitForSprites(page)
  assert.equal(await mascot.getAttribute('data-paused'), 'true', 'paused preference survives a reload')
  await assertStopped(page, 'a stored pause displays a still frame')
  await openMenu()
  await page.getByRole('button', { name: '恢复动画', exact: true }).click()
  assert.equal(await mascot.getAttribute('data-paused'), 'false')
  await openMenu()
  const size = page.getByRole('slider', { name: '小星鱼大小', exact: true })
  await size.focus()
  await page.keyboard.press('End')
  const selectedSize = await size.inputValue()
  await page.keyboard.press('Escape')
  const largeWidth = (await character.boundingBox()).width
  await page.reload({ waitUntil: 'networkidle' })
  await openMenu()
  assert.equal(await size.inputValue(), selectedSize, 'size preference survives a reload')
  assert.equal((await character.boundingBox()).width, largeWidth)
  await page.keyboard.press('Escape')
  for (const [x, y] of [[1, 1], [1279, 799]]) {
    const bounds = await character.boundingBox()
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
    await page.mouse.down()
    await page.mouse.move(x, y, { steps: 8 })
    await page.mouse.up()
    assert.equal(await character.getAttribute('aria-expanded'), 'false', 'dragging does not open the menu')
    await fits('dragged mascot is clamped to the viewport')
  }
  const dragged = await character.boundingBox()
  await character.focus()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowUp')
  const moved = await character.boundingBox()
  assert.equal(moved.x, dragged.x - 16, 'keyboard moves the mascot left')
  assert.equal(moved.y, dragged.y - 16, 'keyboard moves the mascot up')
  await page.reload({ waitUntil: 'networkidle' })
  assert.deepEqual(await character.boundingBox(), moved, 'dragged and keyboard position survives a reload')
  await selectAction('暂停动画')
  await selectAction('弹一下')
  await sampleBounce()
  for (const [width, height] of [[549, 664], [390, 700], [320, 700], [320, 240], [1280, 800]]) {
    await page.setViewportSize({ width, height })
    await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
    await fits(`mascot fits after resizing to ${width}px`)
    await openMenu()
    const menuBounds = await page.locator('.mascot-menu').evaluate(element => element.getBoundingClientRect().toJSON())
    assert.ok(menuBounds.left >= 0 && menuBounds.top >= 0 && menuBounds.right <= width && menuBounds.bottom <= height,
      `the entire menu stays inside ${width}x${height}px`)
    for (const [name, paused] of [['恢复动画', 'false'], ['暂停动画', 'true']]) {
      const control = page.getByRole('button', { name, exact: true })
      await control.scrollIntoViewIfNeeded()
      const bounds = await control.boundingBox()
      assert.ok(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= height,
        `${name} remains reachable after scrolling at ${width}x${height}px`)
      await control.click()
      assert.equal(await mascot.getAttribute('data-paused'), paused, `${name} works after scrolling at ${width}x${height}px`)
    }
    const controls = page.getByRole('button', { name: '隐藏小星鱼', exact: true })
    await controls.scrollIntoViewIfNeeded()
    const bounds = await controls.boundingBox()
    assert.ok(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= height,
      `menu controls remain reachable at ${width}x${height}px`)
    await controls.click()
    assert.equal(await character.count(), 0, `hide works after scrolling at ${width}x${height}px`)
    await page.getByRole('button', { name: '召回小星鱼', exact: true }).click()
    await waitForSprites(page)
    await selectAction('弹一下')
    assertBounceBounds(await sampleBounce(), `bounce at ${width}x${height}px`)
    if (width === 320) {
      for (const [targetX, targetY] of [[1, 1], [width - 1, 1], [width - 1, height - 1], [1, height - 1]]) {
        const current = await character.boundingBox()
        await page.mouse.move(current.x + current.width / 2, current.y + current.height / 2)
        await page.mouse.down()
        await page.mouse.move(targetX, targetY, { steps: 3 })
        await page.mouse.up()
        assertBounceBounds(await sampleBounce(), `bounce near ${targetX},${targetY} at ${width}x${height}px`)
      }
    }
  }
  await selectAction('恢复动画')
  await waitState('idle')
  await openMenu()
  await page.getByRole('button', { name: '隐藏小星鱼', exact: true }).click()
  assert.equal(await character.count(), 0)
  await assertStopped(page, 'hiding removes the sprite and its animation')
  assert.equal(await sprite.count(), 0)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await character.count(), 0, 'hidden preference survives a reload')
  await page.getByRole('button', { name: '召回小星鱼', exact: true }).click()
  await waitForSprites(page)
  await fits('recalled mascot remains reachable')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => document.querySelector('.starfish-mascot')?.dataset.motion === 'paused')
  assert.equal(await mascot.getAttribute('data-paused'), 'false', 'system motion preference does not overwrite the user preference')
  await assertStopped(page, 'reduced motion stops sprite and body animation')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForFunction(() => document.querySelector('.starfish-mascot')?.dataset.motion === 'running')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  assert.equal(await mascot.getAttribute('data-motion'), 'paused', 'hidden tabs pause the mascot')
  await assertStopped(page, 'hidden tabs stop sprite and body animation')
  await page.evaluate(() => {
    delete document.hidden
    document.dispatchEvent(new Event('visibilitychange'))
  })
  assert.equal(await mascot.getAttribute('data-motion'), 'running')
  await page.evaluate(() => document.body.classList.add('article-reading-mode'))
  assert.equal(await mascot.isVisible(), false, 'reading mode hides the mascot')
  assert.ok(await page.locator('#fixture-mount').isVisible(), 'reading mode leaves the page body visible')
  await assertStopped(page, 'reading mode stops sprite and body animation')
  await page.evaluate(() => document.body.classList.remove('article-reading-mode'))
  await fits('mascot returns after leaving reading mode')
  await page.emulateMedia({ media: 'print' })
  await assertStopped(page, 'print mode stops sprite and body animation')
  await page.emulateMedia({ media: 'screen' })
  await page.locator('#fixture-mount').click()
  assert.equal(await mascot.count(), 0, 'unmount removes the mascot')
  await assertStopped(page, 'unmount leaves no mascot animation')
  await page.locator('#fixture-mount').click()
  await mascot.waitFor()
  await waitForSprites(page)
  assert.equal(await mascot.count(), 1, 'remount creates only one mascot')
  await fits('remounted mascot fits')
  const mobile = await browser.newPage({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true })
  mobile.on('pageerror', error => errors.push(error.message))
  const mobileRequests = []
  mobile.on('request', request => mobileRequests.push(new URL(request.url()).pathname))
  await mobile.goto(base, { waitUntil: 'networkidle' })
  await mobile.getByRole('button', { name: '召回小星鱼', exact: true }).waitFor()
  assert.equal(await mobile.locator('.mascot-character').count(), 0, 'first mobile visit starts collapsed')
  assertAssetRequests(mobileRequests, 0, 'first mobile visit does not request any atlas')
  await mobile.getByRole('button', { name: '召回小星鱼', exact: true }).tap()
  await waitForSprites(mobile)
  await mobile.waitForLoadState('networkidle')
  assertAssetRequests(mobileRequests, 1, 'mobile recall requests only the base atlas once')
  await screenshot(mobile, 'mobile')
  assert.ok((await mobile.locator('.mascot-character').boundingBox()).width <= 120, 'mobile mascot stays compact')
  await mobile.getByRole('button', { name: '小星鱼，打开菜单', exact: true }).tap()
  assert.ok(await mobile.getByRole('button', { name: '打招呼', exact: true }).isVisible(), 'touch opens the interaction menu')
  await screenshot(mobile, 'mobile-menu')
  await mobile.close()
  const storedHidden = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  storedHidden.on('pageerror', error => errors.push(error.message))
  const hiddenRequests = []
  storedHidden.on('request', request => hiddenRequests.push(new URL(request.url()).pathname))
  await storedHidden.addInitScript(() => {
    window.requestIdleCallback = undefined
    localStorage.setItem('cpython666:starfish-mascot', JSON.stringify({ hidden: true, paused: false, size: 160 }))
  })
  await storedHidden.goto(base, { waitUntil: 'networkidle' })
  await storedHidden.getByRole('button', { name: '召回小星鱼', exact: true }).waitFor()
  assertAssetRequests(hiddenRequests, 0, 'stored hidden preference avoids artwork requests without requestIdleCallback')
  await storedHidden.getByRole('button', { name: '召回小星鱼', exact: true }).click()
  await waitForSprites(storedHidden)
  await storedHidden.waitForLoadState('networkidle')
  assertAssetRequests(hiddenRequests, 1, 'stored-hidden recall requests only the base atlas once')
  await storedHidden.close()
  const failedWave = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  failedWave.on('pageerror', error => errors.push(error.message))
  const failedWaveRequests = []
  failedWave.on('request', request => failedWaveRequests.push(new URL(request.url()).pathname))
  await failedWave.goto(base, { waitUntil: 'networkidle' })
  await waitForSprites(failedWave)
  failNextWave = true
  await failedWave.getByRole('button', { name: '小星鱼，打开菜单', exact: true }).click()
  await failedWave.getByRole('button', { name: '打招呼', exact: true }).click()
  await failedWave.waitForFunction(() => {
    const data = document.querySelector('.starfish-mascot')?.dataset
    return data?.state === 'idle' && data.requested === 'idle' && !document.querySelector('.mascot-action-preload')
  })
  assertAssetRequests(failedWaveRequests, 1, 'failed greeting requests no extra resources', 1)
  assert.equal(await failedWave.locator('.mascot-wave-sprite').count(), 0, 'failed wave loading returns to the base pose')
  await failedWave.getByRole('button', { name: '小星鱼，打开菜单', exact: true }).click()
  await failedWave.getByRole('button', { name: '打招呼', exact: true }).click()
  await failedWave.locator('.mascot-wave-sprite').waitFor()
  assertAssetRequests(failedWaveRequests, 1, 'failed wave loading can be retried', 2)
  await failedWave.close()
  // Inspect the shipped pixels after all atlases have loaded. DOM stability alone
  // cannot detect a sprite packed around a moving cape tip instead of its feet.
  const footAnchors = await page.evaluate(async paths => {
    const result = []
    for (const path of paths) {
      const image = new Image()
      image.src = path
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const frames = []
      for (let row = 0; row < canvas.height / 200; row++) for (let col = 0; col < canvas.width / 200; col++) {
        let left = 200, right = -1, baseline = -1, footPixels = 0
        for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) {
          const alpha = pixels[((row * 200 + y) * canvas.width + col * 200 + x) * 4 + 3]
          if (alpha < 128) continue
          baseline = Math.max(baseline, y)
          if (y >= 183 && y <= 190) {
            left = Math.min(left, x)
            right = Math.max(right, x)
            footPixels++
          }
        }
        frames.push({ frame: row * 4 + col, center: (left + right) / 2, baseline, footPixels })
      }
      result.push({ path, frames })
    }
    return result
  }, [spritePath, wavePath, moodsPath])
  for (const { path, frames } of footAnchors) {
    for (const frame of frames) {
      assert.ok(frame.footPixels >= 15, `${path} frame ${frame.frame}: the foot band contains both shoes`)
      assert.ok(Math.abs(frame.center - 100) <= 1.5, `${path} frame ${frame.frame}: shoe center ${frame.center}px stays at the fixed 100px anchor`)
      assert.ok(frame.baseline >= 188 && frame.baseline <= 190, `${path} frame ${frame.frame}: shoe baseline ${frame.baseline}px stays fixed`)
    }
    const centers = frames.map(frame => frame.center)
    const baselines = frames.map(frame => frame.baseline)
    assert.ok(Math.max(...centers) - Math.min(...centers) <= 2, `${path}: shoe centers do not jump between poses`)
    assert.ok(Math.max(...baselines) - Math.min(...baselines) <= 1, `${path}: shoe baselines do not jump between poses`)
  }
  console.log(`Sprite shoe anchors: ${JSON.stringify(footAnchors.map(({ path, frames }) => ({ path, centers: frames.map(frame => frame.center), baselines: frames.map(frame => frame.baseline) })))}`)
  assert.equal([...desktopRequests, ...deferredRequests, ...mobileRequests, ...hiddenRequests, ...failedWaveRequests].some(path => /cubism|pixi|live2d|model3\.json|\.moc3/i.test(path)), false, 'no tested interaction requests Live2D assets')
  assert.deepEqual(errors, [])
  console.log('PASS: isolated dynamic mascot build; load/idle/visibility gates and cancellation; base atlas <= 100 KiB; no artwork requests for collapsed mobile/stored-hidden visits; base atlas requested once on recall; idle-callback fallback; no Live2D runtime, model requests or canvas; finite continuous bounce keeps the original drawing, pauses/resumes the same timeline, queues the newest intent without stacking, clears on hide and fits narrow viewport corners; idle has no wrapper float; sprite actions keep fixed viewport/sprite layout boxes and stable shoe anchors measured from shipped pixels; on-demand wave/mood atlases with genuine intermediate poses and 75–100ms steps; wave/happy pause preserves timelines; interrupted actions return through actual poses and newest intent wins; sleep enters and wakes through reversible poses; dragging/keyboard movement and viewport clamping; pause/hide/size/position persistence; reduced-motion, hidden-tab, reading and print pause; 320/390/1280px layout; mobile default/touch interaction; unmount/remount; no browser errors.')
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.httpServer.close(done))
  await rm(fixture, { recursive: true, force: true })
}
