(function () {
  'use strict';

  var labels = { o10: 'O10', base64: 'Base64', url: 'URL', html: 'HTML 实体' };
  var entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
  var escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;', '\u00a0': '&nbsp;' };

  function validUnicode(text) {
    for (var index = 0; index < text.length; index += 1) {
      var code = text.charCodeAt(index);
      if (code >= 0xd800 && code <= 0xdbff) {
        var next = text.charCodeAt(index + 1);
        if (!(next >= 0xdc00 && next <= 0xdfff)) throw new Error('输入包含不完整的 Unicode 字符，请重新粘贴原文。');
        index += 1;
      } else if (code >= 0xdc00 && code <= 0xdfff) {
        throw new Error('输入包含不完整的 Unicode 字符，请重新粘贴原文。');
      }
    }
  }

  function encodeBase64(text) {
    var bytes = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
    return btoa(bytes);
  }

  function decodeBase64(text) {
    var value = text.replace(/[ \t\r\n\f]/g, '');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 === 1 || (value.indexOf('=') >= 0 && value.length % 4 !== 0)) {
      throw new Error('这段 Base64 格式不完整，请检查字符和末尾等号。');
    }
    while (value.length % 4) value += '=';
    var bytes;
    try { bytes = atob(value); }
    catch (error) { throw new Error('这段 Base64 无法解码，请检查字符和末尾等号。'); }
    if (btoa(bytes) !== value) throw new Error('Base64 末尾的数据位无效，请检查是否漏字或改动了字符。');
    var percent = '';
    for (var index = 0; index < bytes.length; index += 1) percent += '%' + ('0' + bytes.charCodeAt(index).toString(16)).slice(-2);
    try { return decodeURIComponent(percent); }
    catch (error) { throw new Error('Base64 中的内容不是完整的 UTF-8 文字，可能是图片或其他二进制文件。'); }
  }

  function decodeEntities(text) {
    return text.replace(/&([^;\s&]*);/g, function (match, name) {
      if (Object.prototype.hasOwnProperty.call(entities, name)) return entities[name];
      if (name.charAt(0) !== '#') return match;
      if (!/^#(?:\d+|[xX][0-9a-fA-F]+)$/.test(name)) throw new Error('数字实体格式有误，请使用 &#数字; 或 &#x十六进制;。');
      var hexadecimal = name.charAt(1).toLowerCase() === 'x';
      var code = parseInt(name.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      if (!Number.isFinite(code) || code < 1 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
        throw new Error('数字实体不在有效的 Unicode 字符范围内。');
      }
      return String.fromCodePoint(code);
    });
  }

  function encodeO10(text, pro) {
    var encoded = Array.from(text, function (character) { return character.codePointAt(0).toString(2); }).join('O');
    return pro ? encoded.replace(/[10O]/g, function (character) { return { '1': 'I', '0': 'l', O: '1' }[character]; }) : encoded;
  }

  function decodeO10(text, pro) {
    if (!text) return '';
    var pattern = pro ? /^[Il]+(?:1[Il]+)*$/ : /^[01]+(?:O[01]+)*$/;
    if (!pattern.test(text)) {
      throw new Error(pro
        ? 'Pro 编码只能包含大写 I、小写 l 和分隔符数字 1，不能有空分段。'
        : 'O10 编码只能包含数字 0、1 和分隔符大写 O，不能有空分段。');
    }
    var binary = pro ? text.replace(/[Il1]/g, function (character) { return { I: '1', l: '0', '1': 'O' }[character]; }) : text;
    return binary.split('O').map(function (part) {
      var point = parseInt(part, 2);
      if (point > 0x10ffff) throw new Error('编码中存在超出 Unicode 范围的字符。');
      if (point >= 0xd800 && point <= 0xdfff) throw new Error('编码中存在无效的 Unicode 代理字符。');
      return String.fromCodePoint(point);
    }).join('');
  }

  function convert(text, type, direction, o10Mode) {
    if (typeof text !== 'string') throw new Error('请输入需要转换的文字。');
    if (text.length > 3000) throw new Error('每次最多转换 3000 字符，请分成几次处理。');
    if (!Object.prototype.hasOwnProperty.call(labels, type) || (direction !== 'encode' && direction !== 'decode') || (type === 'o10' && o10Mode && o10Mode !== 'standard' && o10Mode !== 'pro')) throw new Error('请选择有效的编码类型和转换方向。');
    validUnicode(text);
    if (type === 'o10') {
      var usePro = o10Mode === 'pro';
      return direction === 'encode' ? encodeO10(text, usePro) : decodeO10(text, usePro);
    }
    if (type === 'base64') return direction === 'encode' ? encodeBase64(text) : decodeBase64(text);
    if (type === 'html') return direction === 'encode' ? text.replace(/[&<>"'\u00a0]/g, function (character) { return escapes[character]; }) : decodeEntities(text);
    try { return direction === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text); }
    catch (error) { throw new Error('URL 编码有误，请检查百分号后是否为两位十六进制数，以及 UTF-8 文字是否完整。'); }
  }

  window.TextCodec = { convert: convert };
  if (typeof document === 'undefined') return;

  var source = document.getElementById('source');
  var output = document.getElementById('output');
  var status = document.getElementById('status');
  var generate = document.getElementById('generate');
  var preview = document.getElementById('card-preview');
  var historyNotice = document.getElementById('history-notice');
  var historyList = document.getElementById('history-list');
  var clearHistory = document.getElementById('clear-history');
  var type = 'o10';
  var direction = 'encode';
  var o10Mode = 'standard';
  var revision = 0;
  var images = [];
  var imageLayout = null;
  var pageIndex = 0;
  var rendering = false;
  var history = [];
  var historyReady = false;
  var historyKnown = false;
  var historyQueue = Promise.resolve();
  var storageKey = 'stardream-codec-history-v1';
  var historyLoaded;
  var defaultSample = '你好，世界 😄';
  var hints = {
    o10: 'O10 将每个 Unicode 字符转成二进制，并用大写 O 分隔；Pro 使用 I、l 和数字 1。',
    base64: 'Base64 使用 UTF-8 文字。解码支持缺省末尾等号，并检查编码是否完整。',
    url: '转换 URL 中的单个参数值。空格编码为 %20，解码时加号 + 保持原意。',
    html: '支持 &amp;、&lt;、&gt;、&quot;、&apos;、&nbsp; 与合法数字实体，其他命名实体保留原文。'
  };

  function reset() {
    revision += 1;
    output.value = '';
    images = [];
    imageLayout = null;
    preview.removeAttribute('src');
    document.getElementById('output-panel').hidden = true;
    document.getElementById('result-panel').hidden = true;
    document.getElementById('char-count').textContent = source.value.length + ' / 3000 字符';
    generate.disabled = true;
    document.getElementById('image-hint').textContent = '图片按 2 倍清晰度绘制，长结果自动分页。文字框保留完整结果和换行。';
    document.dispatchEvent(new Event('minitool:results'));
  }

  function typeLabel() {
    return labels[type] + (type === 'o10' && o10Mode === 'pro' ? ' Pro' : '');
  }

  function setResult(text) {
    output.value = text;
    document.getElementById('output-panel').hidden = false;
    document.getElementById('output-size').textContent = text.length + ' 字符';
    var imageTitle = typeLabel() + ' · ' + (direction === 'encode' ? '编码结果' : '解码结果') + '\n\n';
    var canRenderImage = imageTitle.length + text.length <= 30000;
    generate.disabled = rendering || text.length === 0 || !canRenderImage;
    if (!canRenderImage) document.getElementById('image-hint').textContent = '结果文字较长，已完整保留在文本框中；请缩短后再生成图片。';
    return canRenderImage;
  }

  function updateOptions() {
    ['types', 'directions'].forEach(function (id) {
      var attribute = id === 'types' ? 'data-type' : 'data-direction';
      var selected = id === 'types' ? type : direction;
      var buttons = document.getElementById(id).querySelectorAll('button');
      for (var index = 0; index < buttons.length; index += 1) buttons[index].setAttribute('aria-pressed', String(buttons[index].getAttribute(attribute) === selected));
    });
    document.getElementById('type-hint').textContent = hints[type];
    document.getElementById('o10-mode-panel').hidden = type !== 'o10';
    var modeButtons = document.getElementById('o10-modes').querySelectorAll('button');
    for (var modeIndex = 0; modeIndex < modeButtons.length; modeIndex += 1) modeButtons[modeIndex].setAttribute('aria-pressed', String(modeButtons[modeIndex].getAttribute('data-o10-mode') === o10Mode));
    document.getElementById('o10-mode-hint').textContent = o10Mode === 'pro'
      ? 'Pro 用大写 I 和小写 l 表示二进制位，以数字 1 分隔字符。支持中文和 emoji。'
      : '字符转为二进制，以大写字母 O 分隔。支持中文和 emoji。';
  }

  function renderHistory() {
    historyList.textContent = '';
    clearHistory.disabled = !historyReady;
    history.forEach(function (entry) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'history-item';
      var title = document.createElement('span');
      title.className = 'history-title';
      title.textContent = labels[entry.type] + (entry.type === 'o10' && entry.o10Mode === 'pro' ? ' Pro' : '') + ' · ' + (entry.direction === 'encode' ? '编码' : '解码');
      var excerpt = document.createElement('span');
      excerpt.className = 'history-preview';
      excerpt.textContent = entry.input.slice(0, 72).replace(/\s+/g, ' ');
      button.appendChild(title);
      button.appendChild(excerpt);
      button.addEventListener('click', function () {
        source.value = entry.input;
        type = entry.type;
        direction = entry.direction;
        o10Mode = entry.o10Mode || 'standard';
        updateOptions();
        reset();
        setResult(entry.output);
        status.textContent = '已恢复这条历史，可以继续编辑或生成结果图片。';
      });
      historyList.appendChild(button);
    });
  }

  function validateHistory(data) {
    if (!Array.isArray(data)) throw new Error('本地历史格式无效。');
    return data.slice(0, 10).map(function (entry) {
      var mode = entry && entry.o10Mode === 'pro' ? 'pro' : 'standard';
      if (!entry || typeof entry.input !== 'string' || typeof entry.output !== 'string' || entry.output.length > 52000 || convert(entry.input, entry.type, entry.direction, mode) !== entry.output) throw new Error('本地历史中存在损坏的记录。');
      return { input: entry.input, output: entry.output, type: entry.type, direction: entry.direction, o10Mode: mode, time: typeof entry.time === 'number' ? entry.time : 0 };
    });
  }

  async function loadHistory() {
    try {
      var saved = await MiniTool.storageRead(storageKey);
      history = saved === null ? [] : validateHistory(saved);
      historyKnown = true;
      historyNotice.textContent = history.length ? '仅保存在本地，点击记录可恢复。' : '转换后的最近 10 条记录会保存在本地。';
    } catch (error) {
      historyNotice.textContent = (error.message || '历史读取失败。') + ' 新记录暂留在本次页面，清空历史后可重新建立缓存。';
    } finally {
      historyReady = true;
      renderHistory();
    }
  }

  function remember(entry) {
    historyQueue = historyQueue.catch(function () {}).then(async function () {
      await historyLoaded;
      history = [entry].concat(history.filter(function (item) {
        return item.input !== entry.input || item.type !== entry.type || item.direction !== entry.direction || item.o10Mode !== entry.o10Mode;
      })).slice(0, 10);
      renderHistory();
      if (!historyKnown) return;
      try {
        await MiniTool.storageWrite(storageKey, history);
        historyNotice.textContent = '仅保存在本地，点击记录可恢复。';
      } catch (error) {
        historyNotice.textContent = (error.message || '历史保存失败。') + ' 当前转换结果和页面内记录仍可使用。';
      }
    });
  }

  function convertInput(record) {
    reset();
    if (!source.value.length) { status.textContent = '先输入一段文字，或点击「试试示例」。'; return false; }
    try {
      var text = convert(source.value, type, direction, o10Mode);
      var canRenderImage = setResult(text);
      status.textContent = text.length
        ? (canRenderImage ? '转换完成，结果可选中，也可以生成高清图片。' : '转换完成，结果可选中；图片暂不支持这么长的内容。')
        : '转换完成，结果为空文字。';
      if (record) remember({ input: source.value, output: text, type: type, direction: direction, o10Mode: o10Mode, time: Date.now() });
      return true;
    } catch (error) {
      status.textContent = error.message || '转换失败，请检查输入内容。';
      return false;
    }
  }

  source.addEventListener('input', function () { reset(); status.textContent = '输入已更新，点击转换查看新结果。'; });
  ['types', 'directions'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      if (id === 'types') type = button.getAttribute('data-type');
      else direction = button.getAttribute('data-direction');
      updateOptions();
      reset();
      status.textContent = '转换方式已更新，点击转换查看结果。';
    });
  });
  document.getElementById('o10-modes').addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) return;
    o10Mode = button.getAttribute('data-o10-mode');
    updateOptions();
    convertInput(false);
  });
  document.getElementById('sample').addEventListener('click', function () {
    var plain = type === 'html' ? '<今天> & "小小美好" 😄\n明天也继续。' : defaultSample;
    source.value = direction === 'decode' ? convert(plain, type, 'encode', o10Mode) : plain;
    convertInput(true);
    status.textContent = '示例已放入，结果已转换。';
  });
  document.getElementById('clear-input').addEventListener('click', function () {
    source.value = '';
    reset();
    status.textContent = '示例已清空，写一段新的文字吧。';
  });
  document.getElementById('convert').addEventListener('click', function () { convertInput(true); });

  clearHistory.addEventListener('click', function () {
    if (!historyReady || !window.confirm('清空最近 10 条转换历史？当前输入和结果会保留。')) return;
    historyQueue = historyQueue.catch(function () {}).then(async function () {
      await historyLoaded;
      try {
        await MiniTool.storageWrite(storageKey, []);
        history = [];
        historyKnown = true;
        renderHistory();
        historyNotice.textContent = '历史已清空，下一次转换会重新记录。';
      } catch (error) {
        historyNotice.textContent = (error.message || '清空历史失败。') + ' 页面内记录已保留，可稍后重试。';
      }
    });
  });

  function showPage() {
    if (!images.length) return;
    preview.src = images[pageIndex];
    preview.alt = '第 ' + (pageIndex + 1) + ' 张，共 ' + images.length + ' 张编解码结果图片';
    document.getElementById('page-number').textContent = (pageIndex + 1) + ' / ' + images.length;
    document.getElementById('previous').disabled = pageIndex === 0;
    document.getElementById('next').disabled = pageIndex === images.length - 1;
    var page = imageLayout.pages[pageIndex];
    document.getElementById('result-size').textContent = Math.round(page.width * 2) + ' × ' + Math.round(page.height * 2) + ' px';
  }
  document.getElementById('previous').addEventListener('click', function () { if (pageIndex > 0) { pageIndex -= 1; showPage(); } });
  document.getElementById('next').addEventListener('click', function () { if (pageIndex < images.length - 1) { pageIndex += 1; showPage(); } });
  generate.addEventListener('click', async function () {
    if (rendering || !output.value.length) return;
    rendering = true;
    generate.disabled = true;
    var token = revision;
    var text = typeLabel() + ' · ' + (direction === 'encode' ? '编码结果' : '解码结果') + '\n\n' + output.value;
    var canvas = document.createElement('canvas');
    try {
      var nextLayout = CardRenderer.layout(text, { format: 'plain', theme: 'white', mode: 'portrait', fontSize: 18, width: 540 });
      var nextImages = [];
      for (var index = 0; index < nextLayout.pages.length; index += 1) {
        if (token !== revision) return;
        CardRenderer.draw(canvas, nextLayout, index);
        var image = canvas.toDataURL('image/png');
        if (image === 'data:,') throw new Error('当前设备无法生成图片，请稍后重试。');
        nextImages.push(image);
        status.textContent = '正在生成第 ' + (index + 1) + ' / ' + nextLayout.pages.length + ' 张结果图片…';
        await new Promise(function (resolve) { setTimeout(resolve, 0); });
      }
      if (token !== revision) return;
      images = nextImages;
      imageLayout = nextLayout;
      pageIndex = 0;
      document.getElementById('result-panel').hidden = false;
      showPage();
      status.textContent = '已生成 ' + images.length + ' 张高清图片，转换结果已完整排入。';
      document.dispatchEvent(new Event('minitool:results'));
    } catch (error) {
      if (token === revision) status.textContent = error.message || '图片生成失败，文字结果仍可使用。';
    } finally {
      canvas.width = 1;
      canvas.height = 1;
      rendering = false;
      generate.disabled = output.value.length === 0;
    }
  });

  updateOptions();
  source.value = defaultSample;
  document.getElementById('char-count').textContent = source.value.length + ' / 3000 字符';
  MiniTool.init();
  MiniTool.bindExport({ saveButton: document.getElementById('save'), postButton: document.getElementById('post'), groupContainer: document.getElementById('export-groups'), status: status, getImages: function () { return images; }, getTitle: function () { return typeLabel() + '文字转换结果'; }, getContent: function () { return '把字符理清楚，把结果留成一张卡片。'; } });
  historyLoaded = loadHistory();
  convertInput(false);
}());
