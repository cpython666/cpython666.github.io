// Isolated browser check: serves only effect scripts, never article content.
// Run: node scripts/check-effects.mjs [--baseline /path/to/source-snapshot]
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const baseline = process.argv[2] === '--baseline'
const root = baseline ? resolve(process.argv[3]) : resolve(import.meta.dirname, '..')
const scripts = ['/js/clickjs/anime.min.js', '/js/birdfly.js', '/js/mouse-trail.js', '/js/clickjs/fireworks.js']
const server = createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.end(`<!doctype html><title>Effect check</title><body style="min-height:200vh"><button>Interact</button>${scripts.map(src => `<script defer src="${src}"></script>`).join('')}</body>`)
  } else if (scripts.includes(req.url)) {
    res.setHeader('Content-Type', 'text/javascript')
    res.end(await readFile(resolve(root, `docs/public${req.url}`)))
  } else {
    res.writeHead(204).end()
  }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    window.metrics = { clears: {}, strokes: 0, fills: 0, storageReads: 0 }
    const clear = CanvasRenderingContext2D.prototype.clearRect
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      const key = this.canvas.className
      metrics.clears[key] = (metrics.clears[key] || 0) + 1
      return clear.apply(this, args)
    }
    for (const [method, key] of [['stroke', 'strokes'], ['fill', 'fills']]) {
      const original = CanvasRenderingContext2D.prototype[method]
      CanvasRenderingContext2D.prototype[method] = function (...args) {
        metrics[key]++
        return original.apply(this, args)
      }
    }
    const getItem = Storage.prototype.getItem
    Storage.prototype.getItem = function (...args) {
      metrics.storageReads++
      return getItem.apply(this, args)
    }
  })
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const measureIdle = async () => {
    await page.evaluate(() => { metrics.clears = {}; metrics.storageReads = 0 })
    await page.waitForTimeout(1000)
    return page.evaluate(() => ({ clears: metrics.clears, storageReads: metrics.storageReads }))
  }
  const idle = await measureIdle()
  console.log(JSON.stringify({ mode: baseline ? 'before' : 'after', idleOneSecond: idle }))
  if (!baseline) {
    assert.equal(Object.values(idle.clears).reduce((a, b) => a + b, 0), 0, 'idle canvases must not redraw')
    assert.equal(idle.storageReads, 0, 'no settings polling per frame')
    assert.equal(await page.locator('[data-effect-name="birdfly"]').count(), 6)
    const before = await page.locator('[data-effect-name="birdfly"]').first().evaluate(el => el.style.transform)
    await page.waitForTimeout(100)
    assert.notEqual(await page.locator('[data-effect-name="birdfly"]').first().evaluate(el => el.style.transform), before)
    await page.mouse.move(0, 0)
    await page.mouse.move(320, 180, { steps: 15 })
    await page.waitForTimeout(100)
    assert.ok(await page.evaluate(() => metrics.strokes > 0), 'mouse trail renders')
    await page.waitForTimeout(500)
    const settled = await measureIdle()
    assert.equal(Object.values(settled.clears).reduce((a, b) => a + b, 0), 0, 'trail stops after pointer rests')
    for (let i = 0; i < 3; i++) await page.mouse.click(400 + i * 20, 240)
    await page.waitForTimeout(100)
    assert.ok(await page.evaluate(() => metrics.fills > 0), 'fireworks render')
    await page.waitForTimeout(2100)
    const finished = await measureIdle()
    assert.equal(Object.values(finished.clears).reduce((a, b) => a + b, 0), 0, 'overlapping fireworks finish and stop')
    await page.setViewportSize({ width: 390, height: 844 })
    assert.equal(await page.locator('canvas.fireworks').evaluate(el => el.getBoundingClientRect().width), 390)
    const setDisabled = async disabled => page.evaluate(disabled => {
      for (const name of ['birdfly', 'mouse-trail', 'fireworks']) {
        if (disabled) localStorage.setItem(`cpython666:disable-${name}`, '1')
        else localStorage.removeItem(`cpython666:disable-${name}`)
      }
      window.dispatchEvent(new Event('cpython666-effects-change'))
    }, disabled)
    await page.mouse.click(100, 100)
    await setDisabled(true)
    assert.equal(await page.locator('canvas, [data-effect-name="birdfly"]').count(), 0)
    await page.waitForTimeout(100)
    await setDisabled(false)
    await setDisabled(false)
    assert.equal(await page.locator('canvas').count(), 2, 'settings changes must not duplicate canvases')
    assert.equal(await page.locator('[data-effect-name="birdfly"]').count(), 6)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(100)
    assert.equal(await page.locator('canvas, [data-effect-name="birdfly"]').count(), 0)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.waitForTimeout(100)
    assert.equal(await page.locator('canvas').count(), 2)
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    assert.equal(await page.locator('canvas, [data-effect-name="birdfly"]').count(), 0)
    await page.evaluate(() => {
      delete document.hidden
      document.dispatchEvent(new Event('visibilitychange'))
    })
    assert.equal(await page.locator('canvas').count(), 2)
    assert.deepEqual(errors, [])
    console.log('PASS: idle/active effects, overlapping clicks, disable/resume, resizing, reduced motion, hidden page, no browser errors.')
  }
} finally {
  await browser.close()
  await new Promise(done => server.close(done))
}
