// Markdown 转图片：解析与排版是纯计算，可以在 Node 里单独测试；绘制部分才接触 canvas。
// 只支持常用语法子集：标题、段落、粗体/斜体/删除线/行内代码、链接、列表、引用、代码块、分隔线。

const SANS = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, "Segoe UI", system-ui, sans-serif'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'

export const THEMES = {
  light: {
    background: '#ffffff',
    text: '#1f2328',
    muted: '#59636e',
    border: '#d1d9e0',
    codeBackground: '#f6f8fa',
    codeChip: '#eff2f5',
    codeBorder: '#e4e8ed',
    codeText: '#24292f',
    link: '#0969da',
    quote: '#d1d9e0',
  },
  dark: {
    background: '#0d1117',
    text: '#e6edf3',
    muted: '#9198a1',
    border: '#3d444d',
    codeBackground: '#151b23',
    codeChip: '#21262d',
    codeBorder: '#262c36',
    codeText: '#e6edf3',
    link: '#4493f8',
    quote: '#3d444d',
  },
}

const HEADING_SCALE = [2, 1.5, 1.25, 1.1, 1, 0.95]
const CJK = /[\u2E80-\u9FFF\u3000-\u303F\uFF00-\uFFEF\u3040-\u30FF\uAC00-\uD7AF]/
const BLOCK_START = /^(?:#{1,6}\s|>|\s*(?:[-*+]|\d+[.)])\s+|```|~~~|(?:---+|\*\*\*+|___+)\s*$)/

function fontFor(size, run = {}) {
  const family = run.code ? MONO : SANS
  const weight = run.bold ? '600 ' : ''
  const style = run.italic ? 'italic ' : ''
  return `${style}${weight}${size}px ${family}`
}

export function parseMarkdown(source) {
  const lines = String(source ?? '').replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    const fence = line.match(/^\s*(```+|~~~+)\s*([\w+#.-]*)\s*$/)
    if (fence) {
      const marker = fence[1][0].repeat(3)
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith(marker)) {
        code.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push({ type: 'code', lang: fence[2] || '', text: code.join('\n') })
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() })
      i += 1
      continue
    }
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'hr' })
      i += 1
      continue
    }
    if (/^\s*>/.test(line)) {
      const parts = []
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        parts.push(lines[i].replace(/^\s*>\s?/, ''))
        i += 1
      }
      blocks.push({ type: 'quote', text: parts.join(' ').trim() })
      continue
    }
    const listItem = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/)
    if (listItem) {
      const items = []
      while (i < lines.length) {
        const match = lines[i].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/)
        if (!match) break
        items.push({ marker: /\d/.test(match[1]) ? match[1] : '•', text: match[2] })
        i += 1
      }
      blocks.push({ type: 'list', items })
      continue
    }
    const parts = []
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) {
      parts.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'paragraph', text: parts.join(' ') })
  }
  return blocks
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(~~[^~]+~~)|(\[[^\]]*\]\([^)]*\))/g

export function parseInline(text) {
  const runs = []
  let last = 0
  for (const match of String(text).matchAll(INLINE)) {
    if (match.index > last) runs.push({ text: text.slice(last, match.index) })
    const token = match[0]
    if (token.startsWith('`')) runs.push({ text: token.slice(1, -1), code: true })
    else if (token.startsWith('**') || token.startsWith('__')) runs.push({ text: token.slice(2, -2), bold: true })
    else if (token.startsWith('~~')) runs.push({ text: token.slice(2, -2), strike: true })
    else if (token.startsWith('[')) {
      const link = token.match(/^\[([^\]]*)\]\(([^)]*)\)/)
      runs.push({ text: link[1] || link[2], link: true })
    } else runs.push({ text: token.slice(1, -1), italic: true })
    last = match.index + token.length
  }
  if (last < text.length) runs.push({ text: text.slice(last) })
  return runs.filter(run => run.text)
}

function splitAtoms(text) {
  const atoms = []
  let buffer = ''
  for (const char of text) {
    if (CJK.test(char)) {
      if (buffer) atoms.push(buffer)
      buffer = ''
      atoms.push(char)
    } else if (char === ' ' || char === '\t') {
      atoms.push(`${buffer} `)
      buffer = ''
    } else {
      buffer += char
    }
  }
  if (buffer) atoms.push(buffer)
  return atoms
}

function mergeAtoms(atoms) {
  const runs = []
  for (const atom of atoms) {
    const previous = runs.at(-1)
    if (previous && previous.source === atom.run) {
      previous.text += atom.text
      previous.width += atom.width
      continue
    }
    runs.push({ ...atom.run, text: atom.text, width: atom.width, source: atom.run })
  }
  return runs.map(({ source, ...run }) => run)
}

function wrapRuns(runs, maxWidth, size, measure) {
  const lines = []
  let current = []
  let width = 0
  const flush = () => {
    lines.push({ runs: mergeAtoms(current), width })
    current = []
    width = 0
  }
  for (const run of runs) {
    const font = fontFor(size, run)
    for (const atom of splitAtoms(run.text)) {
      const atomWidth = measure(atom, font)
      if (atomWidth > maxWidth) {
        for (const char of atom) {
          const charWidth = measure(char, font)
          if (width + charWidth > maxWidth && current.length) flush()
          current.push({ text: char, run, width: charWidth })
          width += charWidth
        }
        continue
      }
      if (width + atomWidth > maxWidth && current.length) {
        flush()
        if (!atom.trim()) continue
      }
      current.push({ text: atom, run, width: atomWidth })
      width += atomWidth
    }
  }
  if (current.length) flush()
  return lines.length ? lines : [{ runs: [], width: 0 }]
}

function textOps(lines, { x, top, size, lineHeight, color, chip = true }) {
  const ops = []
  lines.forEach((line, index) => {
    if (!line.runs.length) return
    const baseline = top + index * lineHeight + (lineHeight - size) / 2 + size * 0.78
    ops.push({ type: 'text', x, y: baseline, runs: line.runs, size, color, chip })
  })
  return ops
}

function renderBlock(block, context, first) {
  const { contentWidth, padding, fontSize, colors, measure } = context
  const gap = (value) => Math.round(fontSize * value)

  if (block.type === 'heading') {
    const size = Math.round(fontSize * HEADING_SCALE[block.level - 1])
    const lineHeight = Math.round(size * 1.45)
    const before = first ? 0 : gap(block.level <= 2 ? 0.95 : 0.75)
    const after = gap(0.45)
    const runs = parseInline(block.text).map(run => ({ ...run, bold: true }))
    const lines = wrapRuns(runs, contentWidth, size, measure)
    const ops = textOps(lines, { x: padding, top: before, size, lineHeight, color: colors.text })
    return { ops, height: before + lines.length * lineHeight + after }
  }

  if (block.type === 'paragraph') {
    const size = fontSize
    const lineHeight = Math.round(size * 1.8)
    const before = first ? 0 : gap(0.25)
    const after = gap(0.9)
    const lines = wrapRuns(parseInline(block.text), contentWidth, size, measure)
    const ops = textOps(lines, { x: padding, top: before, size, lineHeight, color: colors.text })
    return { ops, height: before + lines.length * lineHeight + after }
  }

  if (block.type === 'quote') {
    const size = fontSize
    const lineHeight = Math.round(size * 1.8)
    const indent = 18
    const before = first ? 0 : gap(0.35)
    const after = gap(0.9)
    const lines = wrapRuns(parseInline(block.text), contentWidth - indent, size, measure)
    const ops = [
      { type: 'rect', x: padding + 2, y: before, w: 3, h: lines.length * lineHeight, fill: colors.quote, radius: 2 },
      ...textOps(lines, { x: padding + indent, top: before, size, lineHeight, color: colors.muted }),
    ]
    return { ops, height: before + lines.length * lineHeight + after }
  }

  if (block.type === 'list') {
    const size = fontSize
    const lineHeight = Math.round(size * 1.8)
    const indent = 22
    const before = first ? 0 : gap(0.25)
    const ops = []
    let top = before
    for (const item of block.items) {
      const lines = wrapRuns(parseInline(item.text), contentWidth - indent, size, measure)
      ops.push({ type: 'text', x: padding, y: top + (lineHeight - size) / 2 + size * 0.78, runs: [{ text: item.marker, width: 0 }], size, color: colors.muted })
      ops.push(...textOps(lines, { x: padding + indent, top, size, lineHeight, color: colors.text }))
      top += lines.length * lineHeight + gap(0.25)
    }
    return { ops, height: top + gap(0.55) }
  }

  if (block.type === 'code') {
    const size = Math.round(fontSize * 0.88)
    const lineHeight = Math.round(size * 1.7)
    const inset = 16
    const before = first ? 0 : gap(0.3)
    const after = gap(1)
    const text = block.text.replace(/\t/g, '  ')
    const lines = text.split('\n').flatMap(line => wrapRuns([{ text: line, code: true }], contentWidth - inset * 2, size, measure))
    const boxHeight = lines.length * lineHeight + inset * 2
    const ops = [
      { type: 'rect', x: padding, y: before, w: contentWidth, h: boxHeight, fill: colors.codeBackground, radius: 10, stroke: colors.codeBorder },
      ...textOps(lines, { x: padding + inset, top: before + inset, size, lineHeight, color: colors.codeText, chip: false }),
    ]
    return { ops, height: before + boxHeight + after }
  }

  if (block.type === 'hr') {
    const before = first ? 0 : gap(0.4)
    const after = gap(1)
    const y = before + gap(0.6)
    return { ops: [{ type: 'line', x1: padding, y1: y, x2: padding + contentWidth, y2: y, color: colors.border, width: 1 }], height: y + after }
  }

  return { ops: [], height: 0 }
}

function shiftOp(op, offset) {
  if (op.type === 'line') return { ...op, y1: op.y1 + offset, y2: op.y2 + offset }
  return { ...op, y: op.y + offset }
}

export function layoutMarkdown(blocks, options = {}) {
  const {
    width = 900,
    padding = 48,
    fontSize = 16,
    theme = 'light',
    maxHeight = 16000,
    measure,
  } = options
  if (typeof measure !== 'function') throw new Error('layoutMarkdown 需要 measure 函数')
  const colors = THEMES[theme] || THEMES.light
  const context = { width, padding, contentWidth: width - padding * 2, fontSize, colors, measure }
  const ops = []
  let y = padding
  let truncated = false
  for (const [index, block] of blocks.entries()) {
    const rendered = renderBlock(block, context, index === 0)
    if (!rendered.height) continue
    if (y + rendered.height + padding > maxHeight) {
      truncated = true
      break
    }
    for (const op of rendered.ops) ops.push(shiftOp(op, y))
    y += rendered.height
  }
  return { width, height: Math.round(Math.min(maxHeight, y + padding)), ops, colors, truncated }
}

function roundRectPath(ctx, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2)
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawText(ctx, op, colors) {
  let x = op.x
  for (const run of op.runs) {
    ctx.font = fontFor(op.size, run)
    if (run.code && op.chip !== false) {
      ctx.fillStyle = colors.codeChip
      roundRectPath(ctx, x - 3, op.y - op.size * 0.92, run.width + 6, op.size * 1.28, 4)
      ctx.fill()
    }
    ctx.fillStyle = run.link ? colors.link : run.code ? colors.codeText : (op.color || colors.text)
    ctx.fillText(run.text, x, op.y)
    if (run.link) {
      ctx.strokeStyle = colors.link
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, op.y + 3)
      ctx.lineTo(x + run.width, op.y + 3)
      ctx.stroke()
    }
    if (run.strike) {
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, op.y - op.size * 0.3)
      ctx.lineTo(x + run.width, op.y - op.size * 0.3)
      ctx.stroke()
    }
    x += run.width
  }
}

function drawOp(ctx, op, colors) {
  if (op.type === 'rect') {
    roundRectPath(ctx, op.x, op.y, op.w, op.h, op.radius || 0)
    ctx.fillStyle = op.fill
    ctx.fill()
    if (op.stroke) {
      ctx.strokeStyle = op.stroke
      ctx.lineWidth = 1
      ctx.stroke()
    }
    return
  }
  if (op.type === 'line') {
    ctx.strokeStyle = op.color
    ctx.lineWidth = op.width || 1
    ctx.beginPath()
    ctx.moveTo(op.x1, op.y1)
    ctx.lineTo(op.x2, op.y2)
    ctx.stroke()
    return
  }
  drawText(ctx, op, colors)
}

// 把 Markdown 画到 canvas 上，返回布局信息（尺寸、是否截断）。
export function drawMarkdown(canvas, blocks, options = {}) {
  const scale = options.scale || 2
  const context = canvas.getContext('2d')
  if (!context) throw new Error('当前浏览器不支持 canvas')
  const measure = (text, font) => {
    context.font = font
    return context.measureText(text).width
  }
  const layout = layoutMarkdown(blocks, { ...options, measure })
  canvas.width = Math.max(1, Math.round(layout.width * scale))
  canvas.height = Math.max(1, Math.round(layout.height * scale))
  const ctx = canvas.getContext('2d')
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.fillStyle = layout.colors.background
  ctx.fillRect(0, 0, layout.width, layout.height)
  ctx.textBaseline = 'alphabetic'
  for (const op of layout.ops) drawOp(ctx, op, layout.colors)
  return layout
}

export function renderMarkdownImage(canvas, source, options = {}) {
  return drawMarkdown(canvas, parseMarkdown(source), options)
}
