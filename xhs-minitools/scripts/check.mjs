#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { parse } = require('@babel/parser')
const { baseParse, parserOptions } = require('@vue/compiler-dom')
const postcss = require('postcss')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const toolNames = ['image-split', 'text-cards', 'text-codec']
const allowedExtensions = new Set(['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.woff', '.woff2', '.json'])
const forbiddenGlobals = new Set(['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'RTCPeerConnection', 'Worker', 'SharedWorker', 'WebAssembly', 'SharedArrayBuffer', 'eval', 'Function', 'Accelerometer', 'Gyroscope', 'Magnetometer', 'DeviceMotionEvent', 'DeviceOrientationEvent', 'PaymentRequest', 'Notification'])
const newerMethods = new Set(['at', 'flat', 'flatMap', 'matchAll', 'replaceAll', 'findLast', 'findLastIndex', 'toSorted', 'toReversed', 'toSpliced', 'hasOwn', 'fromEntries', 'allSettled', 'any', 'withResolvers', 'structuredClone'])
const newerNodes = new Set(['OptionalMemberExpression', 'OptionalCallExpression', 'BigIntLiteral', 'DecimalLiteral', 'PrivateName', 'ClassProperty', 'ClassPrivateProperty', 'ClassPrivateMethod', 'StaticBlock', 'ImportExpression'])

function walk(node, visit, parent = null) {
  if (!node || typeof node !== 'object') return
  if (typeof node.type === 'string') visit(node, parent)
  for (const [key, child] of Object.entries(node)) {
    if (key === 'loc' || key === 'tokens' || key === 'comments') continue
    if (Array.isArray(child)) child.forEach(item => walk(item, visit, node))
    else if (child && typeof child === 'object') walk(child, visit, node)
  }
}

function memberName(node) {
  if (!node) return ''
  if (node.type === 'Identifier') return node.name
  if (node.type === 'ThisExpression') return 'this'
  if (node.type !== 'MemberExpression') return ''
  const name = node.computed ? node.property.value : node.property.name
  return memberName(node.object) + '.' + name
}

function checkTool(directory) {
  const errors = []
  const warnings = []
  const files = []
  const report = (file, line, message) => errors.push(`${path.relative(directory, file)}:${line || 1} ${message}`)
  function collect(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name)
      if (entry.isSymbolicLink()) report(file, 1, '禁止符号链接')
      else if (entry.isDirectory()) collect(file)
      else files.push(file)
    }
  }
  if (!fs.existsSync(directory)) return { errors: ['工具目录不存在'], warnings }
  collect(directory)
  const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html')
  if (htmlFiles.length !== 1 || htmlFiles[0] !== path.join(directory, 'index.html')) errors.push('必须只有一个 HTML，且位于工具根目录 index.html')
  if (!files.includes(path.join(directory, 'README.md'))) errors.push('缺少 README.md')

  function resource(value, file, line, memoryAllowed = false) {
    if (!value || value[0] === '#') return
    if (memoryAllowed && /^(?:data:image\/|blob:)/i.test(value)) return
    if (/^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(value)) {
      report(file, line, `资源必须使用包内相对路径 ${value.slice(0, 80)}`)
      return
    }
    const target = path.resolve(path.dirname(file), value.split(/[?#]/)[0])
    if (!target.startsWith(directory + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      report(file, line, `资源缺失或路径越界 ${value}`)
    } else if (!allowedExtensions.has(path.extname(target).toLowerCase())) {
      report(file, line, `资源类型不允许 ${value}`)
    }
  }

  function checkCss(source, file) {
    let stylesheet
    try { stylesheet = postcss.parse(source, { from: file }) }
    catch (error) { report(file, error.line, error.reason); return }
    stylesheet.walkAtRules(rule => {
      if (['import', 'container', 'layer', 'property'].includes(rule.name.toLowerCase())) report(file, rule.source.start.line, `不允许 @${rule.name}`)
    })
    stylesheet.walkRules(rule => {
      if (rule.parent.type === 'rule' || /:(?:has|is|where|focus-visible)\s*\(/.test(rule.selector) || /:focus-visible\b/.test(rule.selector)) report(file, rule.source.start.line, '选择器超出当前 Chrome 61 基线')
    })
    stylesheet.walkDecls(declaration => {
      const { prop, value } = declaration
      const line = declaration.source.start.line
      if (/^(?:gap|row-gap|column-gap|aspect-ratio|inset(?:-.+)?|margin-(?:inline|block).+|padding-(?:inline|block).+|text-wrap)$/.test(prop) || /^(?:margin|padding)-(?:inline|block)$/.test(prop)) report(file, line, `请使用 Chrome 61 基线属性替代 ${prop}`)
      if (/\b(?:clamp|min|max|color-mix|oklab|oklch)\s*\(|\bsubgrid\b|(?:\d|\.)[sld]v[wh]\b|^clip$/.test(value)) report(file, line, `CSS 值超出当前 Chrome 61 基线 ${value}`)
      for (const match of value.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) resource(match[2], file, line, prop !== 'src')
    })
  }

  function checkHtml(source, file, isEntry = true) {
    let document
    try { document = baseParse(source, { ...parserOptions, parseMode: 'html' }) }
    catch (error) { report(file, error.loc && error.loc.start.line, error.message); return }
    if (isEntry && !/^\s*<!doctype html>/i.test(source)) report(file, 1, '缺少 HTML5 doctype')
    let viewport = false
    function inspect(nodes) {
      for (const node of nodes) {
        if (node.type !== 1) continue
        const tag = node.tag.toLowerCase()
        const attributes = Object.fromEntries(node.props.filter(prop => prop.type === 6).map(prop => [prop.name.toLowerCase(), prop.value ? prop.value.content : '']))
        const line = node.loc.start.line
        if (['iframe', 'object', 'embed', 'base', 'select', 'datalist', 'form'].includes(tag)) report(file, line, `不允许 <${tag}>`)
        for (const attribute of node.props) {
          if ((attribute.type === 6 && /^on/i.test(attribute.name)) || attribute.type === 7) report(file, line, '事件必须通过外置 JS 的 addEventListener 绑定')
        }
        if (tag === 'meta') {
          if (/^(?:content-security-policy|refresh)$/i.test(attributes['http-equiv'] || '')) report(file, line, '禁止自建 CSP 或自动跳转')
          if (attributes.name === 'viewport') viewport = /width=device-width/.test(attributes.content) && /initial-scale=1/.test(attributes.content) && /viewport-fit=cover/.test(attributes.content)
        }
        if (tag === 'script') {
          if (!attributes.src || node.children.some(child => child.content && child.content.trim())) report(file, line, '脚本必须完全外置')
          if (attributes.type && !/^(?:text|application)\/javascript$/i.test(attributes.type)) report(file, line, '必须使用经典 JavaScript 脚本')
          if (attributes.src && path.extname(attributes.src) !== '.js') report(file, line, '脚本必须引用 .js 文件')
        }
        if (tag === 'a' && ('download' in attributes || attributes.target === '_blank')) report(file, line, '禁止下载链接和新窗口')
        for (const name of ['src', 'href', 'xlink:href', 'poster', 'action', 'formaction']) {
          if (attributes[name]) resource(attributes[name], file, line, ['img', 'image'].includes(tag))
        }
        if (attributes.srcset) attributes.srcset.split(',').forEach(item => resource(item.trim().split(/\s+/)[0], file, line))
        if (attributes.style) checkCss(`element {${attributes.style}}`, file)
        if (tag === 'style') checkCss(node.children.map(child => child.content || '').join(''), file)
        inspect(node.children)
      }
    }
    inspect(document.children)
    if (isEntry && !viewport) report(file, 1, 'viewport 必须包含 width=device-width、initial-scale=1 和 viewport-fit=cover')
  }

  function checkJavascript(source, file) {
    let syntax
    try { syntax = parse(source, { sourceType: 'script' }) }
    catch (error) { report(file, error.loc && error.loc.line, `经典脚本语法错误 ${error.message}`); return }
    walk(syntax, (node, parent) => {
      const line = node.loc && node.loc.start.line
      if (newerNodes.has(node.type) || (node.type === 'LogicalExpression' && node.operator === '??') || (node.type === 'AssignmentExpression' && ['&&=', '||=', '??='].includes(node.operator)) || (node.type === 'CatchClause' && !node.param) || (node.type === 'ForOfStatement' && node.await) || (node.async && node.generator)) report(file, line, `语法超出 ES2017 ${node.type}`)
      if ((node.type === 'SpreadElement' && parent.type === 'ObjectExpression') || (node.type === 'RestElement' && parent.type === 'ObjectPattern')) report(file, line, '对象展开或对象 rest 超出 ES2017')
      if (node.type === 'NumericLiteral' && node.extra && node.extra.raw.includes('_')) report(file, line, '数字分隔符超出 ES2017')
      if (node.type === 'RegExpLiteral' && (/[dsv]/.test(node.flags) || /\(\?<|\\[pP]\{/.test(node.pattern))) report(file, line, '正则表达式超出 ES2017')
      if (node.type === 'Identifier' && forbiddenGlobals.has(node.name)) report(file, line, `容器禁用 ${node.name}`)
      if (node.type === 'Import') report(file, line, '禁止动态 import')
      if (node.type === 'MemberExpression') {
        const name = memberName(node)
        if (/\b(?:navigator\.(?:clipboard|geolocation|bluetooth|usb|hid|serial|connection|credentials|locks|serviceWorker)|navigator\.storage\.persist|navigator\.mediaDevices\.(?:enumerateDevices|getDisplayMedia)|window\.(?:open|prompt)|document\.execCommand)\b/.test(name)) report(file, line, `容器禁用 ${name}`)
        if (/\.(?:requestFullscreen|webkitRequestFullscreen|getBattery|sendBeacon)$/.test(name)) report(file, line, `容器禁用 ${name}`)
      }
      if (node.type === 'CallExpression' || node.type === 'NewExpression') {
        const name = memberName(node.callee)
        const method = name.split('.').pop()
        if (newerMethods.has(method)) report(file, line, `运行时 API 超出 ES2017 ${name}`)
        if (/^(?:window\.)?(?:setTimeout|setInterval)$/.test(name) && node.arguments[0] && node.arguments[0].type === 'StringLiteral') report(file, line, '定时器禁止执行字符串')
        if (/\blocation\.(?:assign|replace)$/.test(name)) report(file, line, '禁止页面跳转')
        if (method === 'addEventListener' && node.arguments[0] && /^(?:devicemotion|deviceorientation)$/.test(node.arguments[0].value)) report(file, line, '禁止原生传感器事件')
        if (method === 'setAttribute' && node.arguments.length > 1 && /^(?:src|href|poster)$/i.test(node.arguments[0].value || '') && node.arguments[1].type === 'StringLiteral') resource(node.arguments[1].value, file, line, node.arguments[0].value === 'src')
      }
      if (node.type === 'AssignmentExpression' && node.left.type === 'MemberExpression') {
        const name = memberName(node.left)
        if (/\.on[a-z]+$/i.test(name)) report(file, line, '事件必须通过 addEventListener 绑定')
        if (/\blocation(?:\.href)?$/.test(name)) report(file, line, '禁止页面跳转')
        if (/\.(?:src|href|poster)$/.test(name) && node.right.type === 'StringLiteral') resource(node.right.value, file, line, /\.src$/.test(name))
      }
    })
  }

  let totalTextBytes = 0
  for (const file of files) {
    const extension = path.extname(file).toLowerCase()
    if (!['.html', '.css', '.js', '.json', '.svg'].includes(extension)) continue
    const source = fs.readFileSync(file, 'utf8')
    const bytes = Buffer.byteLength(source)
    totalTextBytes += bytes
    if (bytes > 2 * 1024 * 1024) warnings.push(`${path.relative(directory, file)} 文本超过 2 MiB`)
    for (const match of source.matchAll(/data:[\w/+.-]+;base64,([A-Za-z\d+/=]{128,})/g)) {
      const bytes = Buffer.from(match[1], 'base64').length
      if (bytes > 1024 * 1024) report(file, 1, '静态 Base64 解码后超过 1 MiB')
      else if (bytes > 100 * 1024) warnings.push(`${path.relative(directory, file)} 静态 Base64 超过 100 KiB`)
    }
    if (extension === '.html' || extension === '.svg') checkHtml(source, file, extension === '.html')
    if (extension === '.css') checkCss(source, file)
    if (extension === '.js') checkJavascript(source, file)
    if (extension === '.json') {
      try { JSON.parse(source) } catch (error) { report(file, 1, error.message) }
    }
  }
  if (totalTextBytes > 5 * 1024 * 1024) warnings.push('文本资源合计超过 5 MiB')
  return { errors: [...new Set(errors)], warnings }
}

function selfTest() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'xhs-check-'))
  const html = '<!doctype html><html lang="zh-CN"><head><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><link rel="stylesheet" href="./styles.css"></head><body><textarea>https://example.com</textarea><script src="./app.js"></script></body></html>'
  try {
    fs.writeFileSync(path.join(directory, 'index.html'), html)
    fs.writeFileSync(path.join(directory, 'README.md'), '# Test')
    fs.writeFileSync(path.join(directory, 'styles.css'), '.actions { display:flex; margin:0; }')
    fs.writeFileSync(path.join(directory, 'app.js'), "document.addEventListener('click', function () { var text = 'https://example.com'; });")
    assert.deepEqual(checkTool(directory).errors, [])
    for (const source of ['var x = value?.field', 'var x = {...value}', 'try {} catch {}', 'var x = /(?<=a)b/', 'fetch("./data.json")', 'window["open"]("https://example.com")', 'document.body.onclick = function () {}', 'var x = [1].at(-1)', 'import("./other.js")']) {
      fs.writeFileSync(path.join(directory, 'app.js'), source)
      assert.ok(checkTool(directory).errors.length, `未拦截 ${source}`)
    }
    fs.writeFileSync(path.join(directory, 'app.js'), '')
    for (const change of ['<script>alert(1)</script>', '<img src="https://example.com/a.png">', '<a download href="./app.js">保存</a>', '<button onclick="go()">执行</button>', '<iframe></iframe>']) {
      fs.writeFileSync(path.join(directory, 'index.html'), html.replace('</body>', change + '</body>'))
      assert.ok(checkTool(directory).errors.length, `未拦截 ${change}`)
    }
    fs.writeFileSync(path.join(directory, 'index.html'), html)
    for (const source of ['.a {display:flex; gap:10px}', '.a {width:clamp(1px, 10vw, 20px)}', '.a {background:url(https://example.com/image.png)}']) {
      fs.writeFileSync(path.join(directory, 'styles.css'), source)
      assert.ok(checkTool(directory).errors.length, `未拦截 ${source}`)
    }
    console.log('PASS check.mjs 自检')
  } finally { fs.rmSync(directory, { recursive: true, force: true }) }
}

if (process.argv.includes('--self-test')) selfTest()
else {
  const arguments_ = process.argv.slice(2)
  const directories = arguments_.length ? arguments_.map(value => path.resolve(value)) : toolNames.map(name => path.join(root, name))
  let failed = false
  for (const directory of directories) {
    const result = checkTool(directory)
    console.log(`${result.errors.length ? 'FAIL' : 'PASS'} ${path.basename(directory)}`)
    result.errors.forEach(message => console.error(`  ERROR ${message}`))
    result.warnings.forEach(message => console.warn(`  WARN ${message}`))
    failed ||= result.errors.length > 0
  }
  process.exitCode = failed ? 1 : 0
}
