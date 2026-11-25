#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'

const sourcePath = new URL('../image-split/app.js', import.meta.url)
const source = fs.readFileSync(sourcePath, 'utf8')

function environment() {
  const nodes = new Map()
  const pendingImages = []
  const timers = []
  const draws = []
  let exporter

  function element(tag = 'div') {
    const node = {
      tag, children: [], listeners: {}, style: {}, attributes: {}, value: '', disabled: false,
      hidden: false, width: 0, height: 0,
      addEventListener(name, listener) { this.listeners[name] = listener },
      fire(name) { return this.listeners[name]({ target: this }) },
      setAttribute(name, value) { this.attributes[name] = value },
      getAttribute(name) { return this.attributes[name] },
      appendChild(child) {
        if (child.tag === 'fragment') this.children.push(...child.children)
        else this.children.push(child)
      },
      getContext() {
        return {
          drawImage(image, ...args) { draws.push({ tag, image, args, width: node.width, height: node.height }) },
          beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}
        }
      },
      toDataURL() { return 'data:image/png;base64,' + Buffer.from(this.width + 'x' + this.height).toString('base64') }
    }
    Object.defineProperty(node, 'textContent', {
      get() { return this.text || '' },
      set(value) { this.text = value; this.children = [] }
    })
    return node
  }

  function get(id) {
    if (!nodes.has(id)) nodes.set(id, element(id === 'preview' ? 'preview' : 'div'))
    return nodes.get(id)
  }
  get('rows').value = '3'
  get('cols').value = '3'
  const document = {
    getElementById: get,
    querySelectorAll() { return [] },
    dispatchEvent() {},
    createElement: element,
    createDocumentFragment() { return element('fragment') }
  }
  class Image {
    constructor() { this.listeners = {}; pendingImages.push(this) }
    addEventListener(name, listener) { this.listeners[name] = listener }
    load(width, height) {
      this.naturalWidth = width
      this.naturalHeight = height
      this.listeners.load()
    }
  }
  vm.runInNewContext(source, {
    document, Image, Event: class {},
    URL: { createObjectURL() { return 'blob:local-test' }, revokeObjectURL() {} },
    setTimeout(callback) { timers.push(callback) },
    MiniTool: { init() {}, bindExport(options) { exporter = options } }
  }, { filename: sourcePath.pathname, timeout: 1000 })

  return {
    get,
    draws,
    images() { return exporter.getImages() },
    select() {
      get('photo-input').files = [{ size: 100 }]
      get('photo-input').fire('change')
      return pendingImages[pendingImages.length - 1]
    },
    grid(rows, cols) {
      get('rows').value = String(rows)
      get('cols').value = String(cols)
      get('rows').fire('input')
    },
    async drain() {
      let count = 0
      while (timers.length) {
        assert(++count <= 100, '生成切片应在有限步骤内结束')
        timers.shift()()
        await Promise.resolve()
      }
    }
  }
}

const loading = environment()
const loadingImage = loading.select()
loading.grid(2, 3)
loadingImage.load(901, 607)
assert.equal(loading.get('generate').disabled, false, '加载期间改行列后仍应接受当前照片')
assert.match(loading.get('status').textContent, /2 × 3/)

const selection = environment()
const oldImage = selection.select()
const latestImage = selection.select()
latestImage.load(800, 600)
oldImage.load(300, 200)
assert.match(selection.get('photo-info').textContent, /^800 × 600/, '旧照片的延迟加载不得覆盖新照片')
assert.equal(selection.draws[selection.draws.length - 1].image, latestImage)

const cancellation = environment()
cancellation.select().load(901, 607)
const cancelledGeneration = cancellation.get('generate').fire('click')
assert.equal(cancellation.draws.filter(draw => draw.tag === 'canvas').length, 1)
cancellation.grid(2, 2)
await cancellation.drain()
await cancelledGeneration
assert.equal(cancellation.images().length, 0, '生成中改配置应丢弃旧结果')
assert.equal(cancellation.get('result-panel').hidden, true)
assert.equal(cancellation.get('generate').disabled, false, '取消后应恢复生成操作')
const nextGeneration = cancellation.get('generate').fire('click')
await cancellation.drain()
await nextGeneration
assert.equal(cancellation.images().length, 4, '取消后应能按新配置生成')

const narrow = environment()
narrow.select().load(30000, 20)
narrow.grid(12, 3)
await narrow.get('generate').fire('click')
assert.match(narrow.get('status').textContent, /狭长.*减少行列|狭长.*裁剪/, '预算内不足每格一像素时应明确提示')
assert.equal(narrow.images().length, 0)
assert.equal(narrow.draws.filter(draw => draw.tag === 'canvas').length, 0, '不能拉伸狭长图凑足行列')

const coverage = environment()
coverage.select().load(901, 607)
const generation = coverage.get('generate').fire('click')
await coverage.drain()
await generation
const slices = coverage.draws.filter(draw => draw.tag === 'canvas')
assert.equal(coverage.images().length, 9)
assert.equal(slices.length, 9)
assert.deepEqual(slices.map(draw => draw.width), [300, 300, 301, 300, 300, 301, 300, 300, 301])
assert.deepEqual(slices.map(draw => draw.height), [202, 202, 202, 202, 202, 202, 203, 203, 203])
for (let index = 0; index < slices.length; index += 1) {
  const draw = slices[index]
  const row = Math.floor(index / 3)
  const col = index % 3
  const [x, y, width, height, dx, dy, dw, dh] = draw.args
  assert(Math.abs(x - col * 901 / 3) < 1e-9)
  assert(Math.abs(y - row * 607 / 3) < 1e-9)
  assert(Math.abs(x + width - (col + 1) * 901 / 3) < 1e-9, '原图列范围应连续覆盖')
  assert(Math.abs(y + height - (row + 1) * 607 / 3) < 1e-9, '原图行范围应连续覆盖')
  assert.deepEqual([dx, dy, dw, dh], [0, 0, draw.width, draw.height])
}
for (let row = 0; row < 3; row += 1) {
  assert.equal(slices.slice(row * 3, row * 3 + 3).reduce((sum, draw) => sum + draw.width, 0), 901)
}
assert.equal(slices[0].height + slices[3].height + slices[6].height, 607)
console.log('PASS 图片加载、选择竞态、生成取消、狭长图预算与 901×607 切片覆盖')
