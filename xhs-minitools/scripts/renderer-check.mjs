#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'text-cards', 'markdown-renderer.js')
const source = fs.readFileSync(sourcePath, 'utf8')
const context = vm.createContext({ window: {} })
vm.runInContext(source, context, { timeout: 1000, filename: sourcePath })
const renderer = context.window.CardRenderer
const codecCopy = path.join(root, 'text-codec', 'text-image.js')
if (fs.existsSync(codecCopy)) assert.equal(fs.readFileSync(codecCopy, 'utf8'), source, '两个工具的文字图片渲染器应同源一致')

function measure(text, font) {
  const size = Number(font.match(/([\d.]+)px/)[1])
  return Array.from(text).length * size * .6
}

function textOf(layout) {
  return layout.pages.flatMap(page => page.rows)
    .filter(row => row.type === 'text')
    .map(row => row.runs.map(run => run.text).join('')).join('')
}

function assertBounds(layout) {
  assert(layout.pages.length >= 1 && layout.pages.length <= 80)
  for (const page of layout.pages) {
    const top = Math.round(94 * page.width / 540)
    const bottom = Math.round(66 * page.width / 540)
    assert(page.height <= 2048, '长图逻辑高度最多 2048')
    let previousBottom = top
    for (const row of page.rows) {
      assert(row.top >= previousBottom, '同页文字行顺序连续且不重叠')
      assert(row.top >= top, '文字应位于顶部装饰下方')
      assert(row.top + row.height <= page.height - bottom, '完整文字行应位于页脚预留区域上方')
      previousBottom = row.top + row.height
    }
  }
}

const plainSamples = [
  '你好👨‍👩‍👧‍👦世界e\u0301👍🏽🇨🇳',
  Array.from({ length: 600 }, (_, index) => `第${index}个字`).join(''),
  'a'.repeat(1600),
  '甲\r\n\r\n乙\n丙\t丁',
  '<img src="https://example.com/a.png"> & 文本',
]
for (const mode of ['portrait', 'square', 'long']) {
  for (const text of plainSamples) {
    const layout = renderer.layout(text, { mode, format: 'plain', measure })
    assert.equal(textOf(layout), text.replace(/\r\n?/g, '\n').replace(/\n/g, ''), '纯文字应完整覆盖，不能遗漏或重复')
    assertBounds(layout)
  }
}

for (const emoji of ['👨‍👩‍👧‍👦', 'e\u0301', '👍🏽', '🇨🇳', '🏳️‍🌈', '1️⃣', '字\u{e0100}']) {
  assert.equal(renderer.graphemes(emoji).length, 1, `应保持组合字符完整 ${emoji}`)
}
assert.equal(renderer.graphemes('🇨🇳🇺🇸').length, 2, '相邻旗帜应各自配对')
assert.equal(renderer.graphemes('A\r\nB').length, 3, 'CRLF 应保持一组')
const family = '👨‍👩‍👧‍👦'
const familyLayout = renderer.layout(('文字' + family).repeat(90), { format: 'plain', width: 320, measure })
assertBounds(familyLayout)
for (const page of familyLayout.pages) {
  for (const row of page.rows) {
    if (row.type !== 'text') continue
    const text = row.runs.map(run => run.text).join('')
    for (const group of renderer.graphemes(text)) {
      if (group.includes('\u200d')) assert.equal(group, family, '换行应保留完整 ZWJ 组合')
    }
  }
}

const markdown = '# 标题\n\n**强调** 和 *斜体* ~~删除~~ `代码` [链接](https://example.com)\n\n- 列表\n> 引用\n```js extra\nconst a = 1;\n```\n尾部'
context.testMarkdown = markdown
const marked = vm.runInContext('window.CardRenderer.layout(testMarkdown, {measure: function(text) {return Array.from(text).length * 12;}})', context, { timeout: 1000 })
assert.equal(textOf(marked), '标题强调 和 斜体 删除 代码 链接列表引用const a = 1;尾部')
assertBounds(marked)
for (const invalidFence of ['```js extra', '~~~ extra info', '```', '```\n未关闭的正文', '```a\n内部\n~~~\n尾部']) {
  context.testMarkdown = invalidFence
  const layout = vm.runInContext('window.CardRenderer.layout(testMarkdown, {measure: function(text) {return Array.from(text).length * 12;}})', context, { timeout: 1000 })
  assertBounds(layout)
}

const codeBody = Array.from({ length: 900 }, (_, index) => `line_${index}=中文👨‍👩‍👧‍👦;`).join('\n')
const codeLayout = renderer.layout('```js extra\n' + codeBody + '\n```\n最后一行', { measure })
assert(codeLayout.pages.length > 18, '应覆盖超过单次发笔记张数的分页')
assert.equal(textOf(codeLayout), codeBody.replace(/\n/g, '') + '最后一行', '长代码跨页应无重复无缺字')
assertBounds(codeLayout)

const exactLimit = renderer.layout('字'.repeat(30000), { format: 'plain', measure: text => text.length })
assert.equal(textOf(exactLimit).length, 30000)
assert.throws(() => renderer.layout('字'.repeat(30001), { measure }), /30000/)
assert.throws(() => renderer.layout('   \n', { measure }), /文字/)
const eightyPages = renderer.layout(Array(320).fill('字').join('\n'), { format: 'plain', mode: 'square', width: 320, fontSize: 32, measure })
assert.equal(eightyPages.pages.length, 80)
assertBounds(eightyPages)
assert.throws(() => renderer.layout(Array(321).fill('字').join('\n'), { format: 'plain', mode: 'square', width: 320, fontSize: 32, measure }), /80/)

function drawSpy() {
  const calls = []
  const state = {}
  const context = new Proxy(state, {
    get(target, key) {
      if (key in target) return target[key]
      return (...args) => calls.push([key, ...args])
    },
    set(target, key, value) { target[key] = value; return true },
  })
  return { canvas: { getContext: () => context }, calls }
}

for (const theme of ['cream', 'white', 'night']) {
  for (const mode of ['portrait', 'square', 'long']) {
    const layout = renderer.layout('# 标题\n\n正文 **加粗** 和 `代码`\n\n> 引用\n\n- 条目', { theme, mode, measure })
    assertBounds(layout)
    for (let index = 0; index < layout.pages.length; index += 1) {
      const spy = drawSpy()
      const page = renderer.draw(spy.canvas, layout, index)
      assert.equal(spy.canvas.width, Math.round(page.width * 2))
      assert.equal(spy.canvas.height, Math.round(page.height * 2))
      assert(spy.calls.some(call => call[0] === 'setTransform' && call[1] === 2 && call[4] === 2))
      const pageNumber = String(index + 1).padStart(2, '0') + ' / ' + String(layout.pages.length).padStart(2, '0')
      assert(spy.calls.some(call => call[0] === 'fillText' && call[1] === pageNumber), '页脚应绘制当前页码与总页数')
      assert(spy.calls.some(call => call[0] === 'fillText' && call[1] === '正文 '))
    }
  }
}

const longLayout = renderer.layout('文字'.repeat(10000), { mode: 'long', format: 'plain', measure })
assert(longLayout.pages.length > 1)
assertBounds(longLayout)
for (const index of [0, longLayout.pages.length - 1]) {
  const spy = drawSpy()
  renderer.draw(spy.canvas, longLayout, index)
  assert(spy.canvas.height <= 4096, '2× 长图高度应控制在 4096 像素以内')
}
assert.throws(() => renderer.draw(drawSpy().canvas, longLayout, -1), /不存在/)

console.log(`文字渲染检查通过 · 3 种尺寸／3 套主题／${codeLayout.pages.length} 页长代码／80 页边界／组合字符／2× 绘制`)
