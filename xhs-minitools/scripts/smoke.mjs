#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = process.argv.length > 2
  ? process.argv.slice(2).map(value => path.resolve(value))
  : ['image-split', 'text-cards', 'text-codec'].map(name => path.join(root, name, 'xhs.js'))
const source = fs.readFileSync(files[0], 'utf8')
files.forEach(file => assert.equal(fs.readFileSync(file, 'utf8'), source, `桥接副本不同 ${file}`))

class Element {
  constructor(text = '') {
    this.children = []
    this.listeners = {}
    this.attributes = {}
    this.disabled = false
    this.hidden = false
    this._text = text
    this.classList = { toggle() {} }
  }
  set textContent(value) { this._text = value; this.children = [] }
  get textContent() { return this._text }
  addEventListener(name, listener) { (this.listeners[name] ||= []).push(listener) }
  appendChild(child) { this.children.push(child) }
  setAttribute(name, value) { this.attributes[name] = value }
  getAttribute(name) { return this.attributes[name] }
  removeAttribute(name) { delete this.attributes[name] }
  querySelectorAll() { return this.children }
  click() { (this.listeners.click || []).forEach(listener => listener()) }
}

function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

async function settle(condition, message = '异步操作未结束') {
  for (let index = 0; index < 100; index += 1) {
    if (condition()) return
    await new Promise(resolve => setImmediate(resolve))
  }
  assert.fail(message)
}

function environment({ version = 9490000, platform = true } = {}) {
  const calls = { writes: [], saves: [], notes: [], storage: [], windows: 0 }
  const localData = new Map()
  const platformData = new Map()
  const safeStyles = {}
  const document = new Element()
  document.documentElement = { style: { setProperty(name, value) { safeStyles[name] = value } } }
  document.createElement = () => new Element()
  const api = {
    async writeTempFile(payload) {
      assert.deepEqual(Object.keys(payload), ['data'])
      assert.match(payload.data, /^data:image\//)
      calls.writes.push(payload.data)
      return { filePath: 'tmp://image-' + calls.writes.length + '.png' }
    },
    async saveImageToPhotosAlbum(payload) {
      assert.deepEqual(Object.keys(payload), ['filePath'])
      assert.match(payload.filePath, /^tmp:\/\/image-\d+\.png$/)
      calls.saves.push(payload.filePath)
    },
    async postNote(payload) {
      const images = payload.mediaInfo.image_resources
      assert.ok(images.length > 0 && images.length <= 18)
      images.forEach(image => {
        assert.deepEqual(Object.keys(image), ['url'])
        assert.match(image.url, /^tmp:\/\/image-\d+\.png$/)
      })
      assert.ok(payload.title.length <= 20 && payload.content.length <= 1000)
      calls.notes.push(JSON.parse(JSON.stringify(payload)))
    },
    async getStorage(payload) {
      assert.deepEqual(Object.keys(payload), ['key'])
      calls.storage.push(['get', payload.key])
      return { data: platformData.has(payload.key) ? platformData.get(payload.key) : null }
    },
    async setStorage(payload) {
      assert.deepEqual(Object.keys(payload).sort(), ['data', 'key'])
      assert.equal(typeof payload.data, 'string')
      JSON.parse(payload.data)
      calls.storage.push(['set', payload.key, payload.data])
      platformData.set(payload.key, payload.data)
    },
    async getWindowInfo() {
      calls.windows += 1
      return { windowWidth: 375, windowHeight: 812, safeArea: { top: 44, right: 375, bottom: 778, left: 0 }, menuButtons: { back: { bottom: 76 }, me: null, share: { bottom: 70 } } }
    },
    async getLaunchOptions() { return { miniToolEnv: { buildVersion: version } } }
  }
  const window = new Element()
  Object.assign(window, {
    innerWidth: 375,
    innerHeight: 812,
    setTimeout,
    clearTimeout,
    localStorage: {
      getItem(key) { return localData.has(key) ? localData.get(key) : null },
      setItem(key, value) { localData.set(key, value) },
      removeItem(key) { localData.delete(key) }
    }
  })
  if (platform) window.xhs = { launchOptions: { miniToolEnv: { buildVersion: version } }, miniTool: api }
  vm.runInNewContext(source, { window, document, Blob, console }, { filename: files[0] })
  function exporter(images) {
    const options = {
      saveButton: new Element('存相册'),
      postButton: new Element('发笔记'),
      groupContainer: new Element(),
      status: new Element(),
      getImages: () => images,
      getTitle: () => '作品标题 😄'.repeat(8),
      getContent: () => '正文 😄'.repeat(400)
    }
    const binding = window.MiniTool.bindExport(options)
    return {
      ...options,
      binding,
      setImages(value) { images = value; binding.refresh() },
      async click(kind) {
        options[kind === 'save' ? 'saveButton' : 'postButton'].click()
        await settle(() => !binding.isBusy())
      }
    }
  }
  return { api, miniTool: window.MiniTool, window, document, calls, localData, platformData, safeStyles, exporter }
}

const images = Array.from({ length: 37 }, (_, index) => 'data:image/png;base64,' + Buffer.from('image-' + index).toString('base64'))

async function testExports() {
  const preview = environment({ platform: false })
  const previewExport = preview.exporter([images[0]])
  await preview.miniTool.init()
  await previewExport.click('save')
  assert.match(previewExport.status.textContent, /浏览器预览/)
  assert.equal(preview.calls.saves.length, 0)

  const current = environment()
  const grouping = current.exporter(images)
  assert.equal(grouping.groupContainer.children.length, 3)
  await grouping.click('post')
  assert.equal(current.calls.notes[0].mediaInfo.image_resources.length, 18)
  assert.equal(current.calls.notes[0].pageType, 'photo_publish')
  grouping.groupContainer.children[2].click()
  await grouping.click('post')
  assert.equal(current.calls.notes[1].mediaInfo.image_resources.length, 1)
  assert.equal(current.calls.writes[18], images[36])

  const retry = environment()
  const originalSave = retry.api.saveImageToPhotosAlbum
  let attempts = 0
  retry.api.saveImageToPhotosAlbum = async payload => {
    attempts += 1
    if (attempts === 2) throw { errMsg: 'saveImageToPhotosAlbum:fail permission denied' }
    return originalSave(payload)
  }
  const saving = retry.exporter(images.slice(0, 3))
  await saving.click('save')
  assert.match(saving.status.textContent, /已保存 1\/3/)
  assert.match(saving.saveButton.textContent, /继续保存/)
  await saving.click('save')
  assert.deepEqual(retry.calls.writes, [images[0], images[1], images[1], images[2]])
  assert.deepEqual(retry.calls.saves, ['tmp://image-1.png', 'tmp://image-3.png', 'tmp://image-4.png'])
  assert.match(saving.status.textContent, /按顺序保存 3 张/)

  const stale = environment()
  const pending = deferred()
  let pendingWrites = 0
  stale.api.writeTempFile = () => { pendingWrites += 1; return pending.promise }
  const interrupted = stale.exporter([images[0]])
  interrupted.saveButton.click()
  interrupted.saveButton.click()
  await settle(() => pendingWrites === 1)
  interrupted.setImages([images[1]])
  pending.resolve({ filePath: 'tmp://image-1.png' })
  await settle(() => !interrupted.binding.isBusy())
  assert.equal(pendingWrites, 1)
  assert.equal(stale.calls.saves.length, 0)
  assert.match(interrupted.status.textContent, /新结果已就绪/)

  const invalid = environment()
  invalid.api.writeTempFile = async () => ({})
  const broken = invalid.exporter([images[0]])
  await broken.click('save')
  assert.match(broken.status.textContent, /临时图片路径/)
  assert.equal(invalid.calls.saves.length, 0)

  const old = environment({ version: 9419000 })
  const oldExport = old.exporter([images[0]])
  await oldExport.click('save')
  assert.match(oldExport.status.textContent, /9.42/)
  assert.equal(old.calls.writes.length, 0)
  await oldExport.click('post')
  assert.ok(!('pageType' in old.calls.notes[0]))
  const empty = current.exporter([])
  assert.ok(empty.saveButton.disabled && empty.postButton.disabled)
}

async function testStorage() {
  const current = environment()
  const data = [{ text: '中文 😄', time: 1 }]
  await current.miniTool.storageWrite('history', data)
  assert.deepEqual(JSON.parse(JSON.stringify(await current.miniTool.storageRead('history'))), data)
  assert.equal(current.localData.size, 0)
  assert.equal(await current.miniTool.storageRead('missing'), null)
  await assert.rejects(current.miniTool.storageWrite('too-large', '中'.repeat(400000)), /超过 1MB/)
  current.platformData.set('corrupt', '{')
  await assert.rejects(current.miniTool.storageRead('corrupt'), /损坏/)

  current.localData.set('legacy', JSON.stringify(data))
  assert.deepEqual(JSON.parse(JSON.stringify(await current.miniTool.storageRead('legacy'))), data)
  assert.ok(!current.localData.has('legacy'))
  assert.equal(current.platformData.get('legacy'), JSON.stringify(data))

  const failure = environment()
  failure.api.setStorage = async () => { throw { errMsg: 'quota exceeded' } }
  await assert.rejects(failure.miniTool.storageWrite('history', data), /当前结果已保留/)
  assert.equal(failure.localData.size, 0)
  failure.api.setStorage = async payload => { failure.platformData.set(payload.key, payload.data) }
  await failure.miniTool.storageWrite('history', data)
  assert.equal(failure.platformData.get('history'), JSON.stringify(data))

  const legacy = environment({ version: 9450000 })
  await legacy.miniTool.storageWrite('history', data)
  assert.equal(legacy.calls.storage.length, 0)
  assert.deepEqual(JSON.parse(JSON.stringify(await legacy.miniTool.storageRead('history'))), data)
  legacy.window.localStorage.setItem = () => { throw new Error('storage unavailable') }
  await assert.rejects(legacy.miniTool.storageWrite('history', data), /当前结果已保留/)

  const ordered = environment()
  const firstWrite = deferred()
  const values = []
  ordered.api.setStorage = async payload => {
    values.push(JSON.parse(payload.data))
    if (values.length === 1) await firstWrite.promise
  }
  const one = ordered.miniTool.storageWrite('history', 1)
  const two = ordered.miniTool.storageWrite('history', 2)
  await settle(() => values.length === 1)
  assert.deepEqual(values, [1])
  firstWrite.resolve()
  await Promise.all([one, two])
  assert.deepEqual(values, [1, 2])
}

async function testSafeArea() {
  const current = environment()
  await current.miniTool.init()
  assert.deepEqual(current.safeStyles, { '--tool-safe-top': '76px', '--tool-safe-right': '0px', '--tool-safe-bottom': '34px', '--tool-safe-left': '0px' })
  current.api.getWindowInfo = async () => ({ windowWidth: 375, windowHeight: 812, safeArea: { top: 44, right: 375, bottom: 778, left: 0 }, menuButtons: null })
  await current.miniTool.init()
  assert.equal(current.safeStyles['--tool-safe-top'], '44px')
  const old = environment({ version: 9489000 })
  await old.miniTool.init()
  assert.equal(old.calls.windows, 0)
  const asynchronous = environment()
  delete asynchronous.window.xhs.launchOptions
  await asynchronous.miniTool.init()
  assert.equal(asynchronous.calls.windows, 1)
}

async function testCodec() {
  const codecSource = fs.readFileSync(path.join(root, 'text-codec', 'app.js'), 'utf8')
  const context = { window: {}, btoa, atob }
  vm.runInNewContext(codecSource, context)
  const convert = context.window.TextCodec.convert
  for (const type of ['base64', 'url', 'html']) {
    for (const text of ['', '你好 😄 👨‍👩‍👧‍👦\n第二行\n\n', '&<>"\'\u00a0', '\0\t🚩']) assert.equal(convert(convert(text, type, 'encode'), type, 'decode'), text)
    assert.throws(() => convert('\ud800', type, 'encode'), /Unicode/)
  }
  for (const mode of ['standard', 'pro']) {
    for (const text of ['', '你好 😄 👨‍👩‍👧‍👦\n第二行']) assert.equal(convert(convert(text, 'o10', 'encode', mode), 'o10', 'decode', mode), text)
  }
  assert.equal(convert('1000001O1100001', 'o10', 'decode'), 'Aa')
  assert.equal(convert('IlllllI1IIllllI', 'o10', 'decode', 'pro'), 'Aa')
  assert.throws(() => convert('0O', 'o10', 'decode'), /分隔符/)
  assert.throws(() => convert('l1', 'o10', 'decode', 'pro'), /分隔符/)
  assert.throws(() => convert('1101100000000000', 'o10', 'decode'), /代理字符/)
  assert.throws(() => convert('1111111111111111111111', 'o10', 'decode'), /Unicode 范围/)
  assert.equal(convert('\u{10ffff}'.repeat(1500), 'o10', 'encode').length, 32999)
  assert.equal(convert('\uffff'.repeat(3000), 'o10', 'encode').length, 50999)
  assert.equal(convert('Z g\n==', 'base64', 'decode'), 'f')
  assert.equal(convert('Zg', 'base64', 'decode'), 'f')
  assert.equal(convert('a+b%20c', 'url', 'decode'), 'a+b c')
  assert.equal(convert('&#128516;&#x4F60;&#10;&amp;lt; &copy;', 'html', 'decode'), '😄你\n&lt; &copy;')
  for (const text of ['a', 'A===', 'A=AA', 'Zg=', 'Zh==', 'Zm9=', 'Zg===', 'Zg-', '/w==', '8J+Y']) assert.throws(() => convert(text, 'base64', 'decode'), undefined, text)
  for (const text of ['%', '%FF', '%E4%BD', '%2', '%GG']) assert.throws(() => convert(text, 'url', 'decode'), undefined, text)
  for (const text of ['&#0;', '&#xD800;', '&#x110000;', '&#-1;', '&#xZZ;']) assert.throws(() => convert(text, 'html', 'decode'), undefined, text)
  assert.equal(convert('中'.repeat(3000), 'url', 'encode').length, 27000)
  assert.throws(() => convert('中'.repeat(3001), 'url', 'encode'), /3000/)

  const document = new Element()
  const elements = new Map()
  document.getElementById = id => {
    if (!elements.has(id)) {
      const element = new Element()
      element.value = ''
      elements.set(id, element)
    }
    return elements.get(id)
  }
  document.createElement = () => new Element()
  document.dispatchEvent = () => {}
  const historyRead = deferred()
  const writes = []
  const firstWrite = deferred()
  const miniTool = {
    init() {},
    bindExport() {},
    storageRead() { return historyRead.promise },
    async storageWrite(key, data) {
      writes.push(JSON.parse(JSON.stringify(data)))
      if (writes.length === 1) await firstWrite.promise
    }
  }
  vm.runInNewContext(codecSource, { window: { confirm: () => true }, document, MiniTool: miniTool, btoa, atob, Event, setTimeout })
  const input = document.getElementById('source')
  const output = document.getElementById('output')
  const button = document.getElementById('convert')
  assert.equal(input.value, '你好，世界 😄')
  assert.equal(output.value, convert(input.value, 'o10', 'encode', 'standard'))
  assert.equal(document.getElementById('output-panel').hidden, false)
  document.getElementById('o10-modes').listeners.click[0]({ target: { closest: () => ({ getAttribute: () => 'pro' }) } })
  assert.equal(output.value, convert(input.value, 'o10', 'encode', 'pro'))
  assert.match(document.getElementById('o10-mode-hint').textContent, /^Pro/)
  input.value = 'one'
  document.getElementById('types').listeners.click[0]({ target: { closest: () => ({ getAttribute: () => 'base64' }) } })
  button.click()
  assert.equal(output.value, 'b25l')
  assert.equal(writes.length, 0, '读取历史完成前不得写空缓存')
  const proInput = '你好，世界 😄'
  const proOutput = convert(proInput, 'o10', 'encode', 'pro')
  historyRead.resolve([
    { input: proInput, output: proOutput, type: 'o10', direction: 'encode', o10Mode: 'pro', time: 2 },
    { input: 'old', output: 'b2xk', type: 'base64', direction: 'encode', time: 1 }
  ])
  await settle(() => writes.length === 1)
  assert.ok(document.getElementById('history-list').children.some(item => item.children[0].textContent === 'O10 Pro · 编码'))
  assert.deepEqual(writes[0].map(entry => entry.input), ['one', proInput, 'old'])
  document.getElementById('history-list').children.find(item => item.children[0].textContent === 'O10 Pro · 编码').click()
  assert.equal(input.value, proInput)
  assert.equal(output.value, proOutput, '历史恢复保留 O10 Pro 结果')
  document.getElementById('types').listeners.click[0]({ target: { closest: () => ({ getAttribute: () => 'base64' }) } })
  input.value = 'two'
  button.click()
  input.value = 'three'
  button.click()
  assert.equal(output.value, 'dGhyZWU=')
  assert.equal(writes.length, 1, '历史写入必须串行')
  firstWrite.resolve()
  await settle(() => writes.length === 3)
  assert.deepEqual(writes[2].map(entry => entry.input), ['three', 'two', 'one', proInput, 'old'])
  assert.equal(output.value, 'dGhyZWU=', '旧历史写回不能覆盖新转换结果')
  input.value = 'edited'
  document.getElementById('source').listeners.input[0]()
  assert.equal(output.value, '')
  document.getElementById('clear-input').click()
  assert.equal(input.value, '')
  assert.equal(document.getElementById('output-panel').hidden, true)
  console.log('PASS TextCodec Unicode, strict decode, length boundary and history startup/ordering')
}

await testExports()
await testStorage()
await testSafeArea()
await testCodec()
console.log(`PASS MiniTool strict VM smoke (${files.length} identical adapter copies)`)
