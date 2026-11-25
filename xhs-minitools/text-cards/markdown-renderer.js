(function () {
  'use strict';

  // Reuses the original Markdown tool's local parsing, text measurement and Canvas model.
  var SANS = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';
  var MONO = 'SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
  var THEMES = {
    cream: { background: '#fff6e9', text: '#493a31', muted: '#a18470', accent: '#c26b50', line: '#e6d3bd', code: '#f3e6d3', chip: '#f2e0c8', quote: '#d89d76', padding: 44 },
    white: { background: '#ffffff', text: '#292b2f', muted: '#8b8e91', accent: '#dd5d65', line: '#e7e8e9', code: '#f3f4f5', chip: '#eceef0', quote: '#d9a3a6', padding: 48 },
    night: { background: '#23282f', text: '#f1eadd', muted: '#a5a6a3', accent: '#e6bb85', line: '#474c51', code: '#2e343d', chip: '#3a4149', quote: '#b09370', padding: 44 }
  };
  var HEADING_SCALE = [1.9, 1.5, 1.25, 1.1, 1, 1];
  var INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(~~[^~]+~~)|(!?\[[^\]]*\]\([^)]*\))/g;
  var measureContext = null;

  function isExtension(point) {
    return (point >= 0x0300 && point <= 0x036f) ||
      (point >= 0x1ab0 && point <= 0x1aff) ||
      (point >= 0x1dc0 && point <= 0x1dff) ||
      (point >= 0x20d0 && point <= 0x20ff) ||
      (point >= 0xfe00 && point <= 0xfe0f) ||
      (point >= 0xfe20 && point <= 0xfe2f) ||
      (point >= 0x1f3fb && point <= 0x1f3ff) ||
      (point >= 0xe0020 && point <= 0xe007f) ||
      (point >= 0xe0100 && point <= 0xe01ef) || point === 0x20e3;
  }

  function isRegional(point) { return point >= 0x1f1e6 && point <= 0x1f1ff; }

  function graphemes(text) {
    var points = Array.from(String(text));
    var groups = [];
    var regionalCount = 0;
    for (var i = 0; i < points.length; i += 1) {
      var char = points[i];
      var point = char.codePointAt(0);
      var previous = i ? points[i - 1].codePointAt(0) : 0;
      var join = groups.length && (isExtension(point) || point === 0x200d || previous === 0x200d || (point === 10 && previous === 13));
      if (isRegional(point)) {
        if (regionalCount % 2 === 1) join = groups.length > 0;
        regionalCount += 1;
      } else if (!isExtension(point)) {
        regionalCount = 0;
      }
      if (join) groups[groups.length - 1] += char;
      else groups.push(char);
    }
    return groups;
  }

  function fontFor(size, run) {
    run = run || {};
    return (run.italic ? 'italic ' : '') + (run.bold ? '700 ' : '') + size + 'px ' + (run.code ? MONO : SANS);
  }

  function browserMeasure(text, font) {
    if (!measureContext) {
      if (typeof document === 'undefined') throw new Error('本地排版检查需要提供 measure 函数。');
      measureContext = document.createElement('canvas').getContext('2d');
    }
    if (!measureContext) throw new Error('当前环境无法测量文字，请换个浏览器预览。');
    measureContext.font = font;
    return measureContext.measureText(text).width;
  }

  function parseInline(text) {
    var runs = [];
    var last = 0;
    var match;
    INLINE.lastIndex = 0;
    while ((match = INLINE.exec(text))) {
      if (match.index > last) runs.push({ text: text.slice(last, match.index) });
      var token = match[0];
      if (token.charAt(0) === '`') runs.push({ text: token.slice(1, -1), code: true });
      else if (token.slice(0, 2) === '**' || token.slice(0, 2) === '__') runs.push({ text: token.slice(2, -2), bold: true });
      else if (token.slice(0, 2) === '~~') runs.push({ text: token.slice(2, -2), strike: true });
      else if (token.charAt(0) === '[' || token.slice(0, 2) === '![') {
        var link = token.match(/^(!?)\[([^\]]*)\]\(([^)]*)\)/);
        runs.push({ text: (link[1] ? '[图片] ' : '') + (link[2] || link[3]), link: true });
      } else runs.push({ text: token.slice(1, -1), italic: true });
      last = match.index + token.length;
    }
    if (last < text.length) runs.push({ text: text.slice(last) });
    return runs;
  }

  function isBlockStart(line) {
    return /^\s*(?:#{1,6}\s|>|(?:[-*+]|\d+[.)])\s+|`{3,}|~{3,}|(?:-{3,}|\*{3,}|_{3,})\s*$)/.test(line);
  }

  function parseMarkdown(source, plain) {
    var lines = source.split('\n');
    var blocks = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      i += 1; // Every branch consumes its first line, including unsupported syntax.
      if (plain) { blocks.push({ type: 'plain', text: line }); continue; }
      if (!line.trim()) { blocks.push({ type: 'space' }); continue; }
      var fence = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (fence) {
        var code = [];
        while (i < lines.length) {
          var closing = lines[i].match(/^\s*(`{3,}|~{3,})\s*$/);
          if (closing && closing[1].charAt(0) === fence[1].charAt(0) && closing[1].length >= fence[1].length) { i += 1; break; }
          code.push(lines[i]);
          i += 1;
        }
        blocks.push({ type: 'code', text: code.join('\n') });
        continue;
      }
      var heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
      if (heading) { blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] }); continue; }
      if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { blocks.push({ type: 'hr' }); continue; }
      var quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) { blocks.push({ type: 'quote', text: quote[1] }); continue; }
      var list = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
      if (list) { blocks.push({ type: 'list', marker: /\d/.test(list[1]) ? list[1] : '•', text: list[2] }); continue; }
      var parts = [line];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
        parts.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'paragraph', text: parts.join(' ') });
    }
    return blocks;
  }

  function copyRun(run, text, width) {
    return { text: text, width: width, bold: !!run.bold, italic: !!run.italic, code: !!run.code, strike: !!run.strike, link: !!run.link };
  }

  function wrapRuns(runs, maxWidth, size, measure) {
    var lines = [];
    var current = [];
    var width = 0;
    function flush() {
      lines.push({ runs: current, width: width });
      current = [];
      width = 0;
    }
    for (var i = 0; i < runs.length; i += 1) {
      var run = runs[i];
      var chars = graphemes(run.text);
      var font = fontFor(size, run);
      for (var j = 0; j < chars.length; j += 1) {
        var char = chars[j];
        var previous = current[current.length - 1];
        var sameRun = previous && previous.sourceIndex === i;
        var combined = sameRun ? previous.text + char : char;
        var combinedWidth = measure(combined, font);
        var increment = combinedWidth - (sameRun ? previous.width : 0);
        if (current.length && width + increment > maxWidth - 6) {
          flush();
          previous = null;
          sameRun = false;
          combined = char;
          combinedWidth = measure(char, font);
          increment = combinedWidth;
        }
        if (sameRun) { previous.text = combined; previous.width = combinedWidth; }
        else {
          var piece = copyRun(run, combined, combinedWidth);
          piece.sourceIndex = i;
          current.push(piece);
        }
        width += increment;
      }
    }
    if (current.length || !lines.length) flush();
    return lines;
  }

  function makeRows(blocks, context) {
    var rows = [];
    var padding = context.padding;
    var contentWidth = context.width - padding * 2;
    var baseSize = context.fontSize;
    for (var i = 0; i < blocks.length; i += 1) {
      var block = blocks[i];
      if (block.type === 'space') { rows.push({ type: 'space', height: Math.round(baseSize * .55) }); continue; }
      if (block.type === 'hr') { rows.push({ type: 'hr', height: baseSize * 1.8 }); continue; }
      var size = block.type === 'heading' ? Math.round(baseSize * HEADING_SCALE[block.level - 1]) : baseSize;
      if (block.type === 'code') size = Math.round(baseSize * .86);
      var lineHeight = Math.round(size * (block.type === 'heading' ? 1.42 : 1.75));
      var indent = 0;
      if (block.type === 'quote' || block.type === 'code') indent = 16;
      if (block.type === 'list') indent = Math.max(25, context.measure(block.marker, fontFor(size)) + 10);
      var runs = block.type === 'plain' || block.type === 'code' ? [{ text: block.text, code: block.type === 'code' }] : parseInline(block.text);
      if (block.type === 'heading') {
        for (var r = 0; r < runs.length; r += 1) runs[r].bold = true;
      }
      var lines = [];
      if (block.type === 'code') {
        var codeLines = block.text.replace(/\t/g, '  ').split('\n');
        for (var c = 0; c < codeLines.length; c += 1) {
          var wrapped = wrapRuns([{ text: codeLines[c], code: true }], contentWidth - indent * 2, size, context.measure);
          for (var w = 0; w < wrapped.length; w += 1) lines.push(wrapped[w]);
        }
      } else lines = wrapRuns(runs, contentWidth - indent, size, context.measure);
      if (block.type === 'heading' && rows.length) rows.push({ type: 'space', height: Math.round(baseSize * .55) });
      for (var l = 0; l < lines.length; l += 1) {
        rows.push({ type: 'text', kind: block.type, runs: lines[l].runs, x: padding + indent, size: size, height: lineHeight, heading: block.type === 'heading', first: l === 0, marker: block.type === 'list' && l === 0 ? block.marker : '', block: i });
      }
      if (block.type !== 'plain') rows.push({ type: 'space', height: Math.round(baseSize * (block.type === 'heading' ? .42 : .45)) });
    }
    return rows;
  }

  function layout(source, options) {
    options = options || {};
    source = String(source === null || source === undefined ? '' : source).replace(/\r\n?/g, '\n');
    if (!source.trim()) throw new Error('先写下一点文字，再生成卡片吧。');
    if (source.length > 30000) throw new Error('文字超过 30000 字符，请分成几次生成。');
    var width = Number(options.width) || 540;
    var fontSize = Number(options.fontSize) || 20;
    if (width < 320 || width > 900 || fontSize < 12 || fontSize > 32) throw new Error('卡片宽度须为 320–900，字号须为 12–32。');
    var theme = THEMES[options.theme] ? options.theme : 'cream';
    var colors = THEMES[theme];
    var padding = Math.round(colors.padding * width / 540);
    var mode = options.mode === 'square' || options.mode === 'long' ? options.mode : 'portrait';
    var pageHeight = mode === 'long' ? 2048 : Math.round(width * (mode === 'square' ? 1 : 4 / 3));
    var top = Math.round(94 * width / 540);
    var bottom = Math.round(66 * width / 540);
    var measure = typeof options.measure === 'function' ? options.measure : browserMeasure;
    var rows = makeRows(parseMarkdown(source, options.format === 'plain'), { padding: padding, width: width, fontSize: fontSize, measure: measure });
    var pages = [];
    var page = { width: width, height: pageHeight, rows: [] };
    var y = top;
    function pushPage() {
      if (mode === 'long') page.height = Math.max(Math.round(width * 4 / 3), Math.ceil(y + bottom));
      pages.push(page);
      if (pages.length > 80) throw new Error('已超过 80 张卡片，请精简文字或分成几次生成。');
      page = { width: width, height: pageHeight, rows: [] };
      y = top;
    }
    for (var i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      var required = row.height;
      if (row.heading && row.first) {
        var next = i + 1;
        while (next < rows.length && rows[next].type === 'space') next += 1;
        if (next < rows.length) required += rows[next].height;
      }
      if (page.rows.length && y + required > pageHeight - bottom) pushPage();
      if (row.height > pageHeight - bottom - top) throw new Error('当前字号无法完整排版，请调小字号后重试。');
      row.top = y;
      page.rows.push(row);
      y += row.height;
    }
    if (page.rows.length) pushPage();
    return { pages: pages, theme: theme, colors: colors, mode: mode, padding: padding, fontSize: fontSize, sourceLength: source.length };
  }

  function roundedRect(context, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function line(context, x1, y1, x2, y2, color) {
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
  }

  function draw(canvas, result, index) {
    var page = result.pages[index || 0];
    if (!page) throw new Error('这张卡片暂时不存在，请重新生成。');
    canvas.width = Math.round(page.width * 2);
    canvas.height = Math.round(page.height * 2);
    var context = canvas.getContext('2d');
    if (!context) throw new Error('当前环境无法绘图，请换个浏览器预览。');
    context.setTransform(2, 0, 0, 2, 0, 0);
    var colors = result.colors;
    var padding = result.padding;
    var unit = page.width / 540;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, page.width, page.height);
    if (result.theme === 'cream') {
      context.fillStyle = '#f1dfc5';
      context.fillRect(page.width - padding - 21 * unit, 35 * unit, 26 * unit, 8 * unit);
      context.fillStyle = '#eac9b3';
      context.fillRect(page.width - padding - 31 * unit, 47 * unit, 23 * unit, 5 * unit);
    }
    context.textBaseline = 'alphabetic';
    context.font = fontFor(10 * unit, { bold: true });
    context.fillStyle = colors.muted;
    context.fillText('星梦启航  /  灵感手记', padding, 43 * unit);
    line(context, padding, 60 * unit, page.width - padding, 60 * unit, colors.line);
    for (var i = 0; i < page.rows.length; i += 1) {
      var row = page.rows[i];
      if (row.type === 'space') continue;
      if (row.type === 'hr') { line(context, padding, row.top + row.height / 2, page.width - padding, row.top + row.height / 2, colors.line); continue; }
      if (row.kind === 'code') {
        context.fillStyle = colors.code;
        context.fillRect(padding, row.top, page.width - padding * 2, row.height + .5);
      }
      if (row.kind === 'quote') {
        context.fillStyle = colors.quote;
        context.fillRect(padding + 1, row.top + 3, 3, row.height - 6);
      }
      var baseline = row.top + (row.height - row.size) / 2 + row.size * .8;
      if (row.marker) {
        context.font = fontFor(row.size);
        context.fillStyle = colors.accent;
        context.fillText(row.marker, padding, baseline);
      }
      var x = row.x;
      for (var r = 0; r < row.runs.length; r += 1) {
        var run = row.runs[r];
        context.font = fontFor(row.size, run);
        if (run.code && row.kind !== 'code') {
          context.fillStyle = colors.chip;
          roundedRect(context, x - 2, baseline - row.size * .93, run.width + 4, row.size * 1.3, 3);
          context.fill();
        }
        context.fillStyle = row.heading || run.link ? colors.accent : row.kind === 'quote' ? colors.muted : colors.text;
        context.fillText(run.text, x, baseline);
        if (run.strike) line(context, x, baseline - row.size * .32, x + run.width, baseline - row.size * .32, context.fillStyle);
        if (run.link) line(context, x, baseline + 3, x + run.width, baseline + 3, colors.accent);
        x += run.width;
      }
    }
    var footerY = page.height - 30 * unit;
    line(context, padding, footerY - 19 * unit, page.width - padding, footerY - 19 * unit, colors.line);
    context.font = fontFor(9 * unit);
    context.fillStyle = colors.muted;
    context.fillText('把文字，留给喜欢的瞬间。', padding, footerY);
    var pageNumber = String((index || 0) + 1).padStart(2, '0') + ' / ' + String(result.pages.length).padStart(2, '0');
    context.textAlign = 'right';
    context.fillStyle = colors.accent;
    context.fillText(pageNumber, page.width - padding, footerY);
    context.textAlign = 'left';
    return page;
  }

  window.CardRenderer = { layout: layout, draw: draw, graphemes: graphemes };
}());
