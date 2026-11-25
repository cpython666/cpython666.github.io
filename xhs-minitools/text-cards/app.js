(function () {
  'use strict';
  var source = document.getElementById('source');
  var status = document.getElementById('status');
  var generate = document.getElementById('generate');
  var preview = document.getElementById('card-preview');
  var images = [];
  var layout = null;
  var pageIndex = 0;
  var mode = 'portrait';
  var theme = 'cream';
  var format = 'markdown';
  var revision = 0;
  var rendering = false;
  var previewTimer = 0;
  var previewCanvas = document.createElement('canvas');
  var noteTitle = '收集生活里的小小美好';
  var aiButton = document.getElementById('ai-polish');
  var aiBusy = false;
  var sample = '# 把日子过成喜欢的样子\n\n不必等一场盛大的旅行。生活里的光，常常藏在很小的地方。\n\n## 今天的小小美好\n\n- 一杯刚好温热的咖啡 ☕\n- 回家路上，抬头看了一眼晚霞\n- 把心里的想法认真写下来\n\n> 慢慢来，也是在向前走。\n\n给自己留一点空白，也给新的故事留一点位置。';

  function invalidateResults() {
    revision += 1;
    images = [];
    document.getElementById('ai-review').hidden = true;
    document.getElementById('char-count').textContent = source.value.length + ' / 30000 字符';
    document.dispatchEvent(new Event('minitool:results'));
  }

  function renderPreview() {
    window.clearTimeout(previewTimer);
    if (!source.value.trim()) {
      layout = null;
      pageIndex = 0;
      preview.removeAttribute('src');
      document.getElementById('result-panel').hidden = true;
      document.getElementById('page-number').textContent = '';
      document.getElementById('previous').disabled = true;
      document.getElementById('next').disabled = true;
      status.textContent = '写一点文字，就能看到实时预览。';
      return;
    }
    try {
      layout = CardRenderer.layout(source.value, { mode: mode, theme: theme, format: format, width: 540, fontSize: 20 });
      pageIndex = Math.min(pageIndex, layout.pages.length - 1);
      noteTitle = source.value.split(/\r?\n/)[0].replace(/^#+\s*/, '').trim() || '我的文字卡片';
      document.getElementById('result-panel').hidden = false;
      showPage();
      status.textContent = '实时预览已更新，共 ' + layout.pages.length + ' 页。点击下方按钮生成全部高清图片后即可导出。';
    } catch (error) {
      layout = null;
      preview.removeAttribute('src');
      document.getElementById('result-panel').hidden = true;
      status.textContent = error.message || '预览失败，请调整正文后重试。';
    }
  }

  function schedulePreview() {
    invalidateResults();
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(renderPreview, 100);
  }

  function showPage() {
    if (!layout || !layout.pages.length) return;
    CardRenderer.draw(previewCanvas, layout, pageIndex);
    var data = previewCanvas.toDataURL('image/png');
    previewCanvas.width = 1;
    previewCanvas.height = 1;
    if (data === 'data:,') throw new Error('当前设备无法生成预览图片，请改用 3:4 分页。');
    preview.src = data;
    preview.alt = '第 ' + (pageIndex + 1) + ' 张，共 ' + layout.pages.length + ' 张文字卡片';
    document.getElementById('page-number').textContent = (pageIndex + 1) + ' / ' + layout.pages.length;
    document.getElementById('previous').disabled = pageIndex === 0;
    document.getElementById('next').disabled = pageIndex === layout.pages.length - 1;
    var page = layout.pages[pageIndex];
    document.getElementById('result-size').textContent = Math.round(page.width * 2) + ' × ' + Math.round(page.height * 2) + ' px';
  }

  function bindOptions(id, attribute, setValue) {
    document.getElementById(id).addEventListener('click', function (event) {
      var selected = event.target.closest('button');
      if (!selected) return;
      var value = selected.getAttribute(attribute);
      var buttons = selected.parentNode.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i += 1) buttons[i].setAttribute('aria-pressed', String(buttons[i] === selected));
      setValue(value);
      schedulePreview();
    });
  }
  bindOptions('sizes', 'data-mode', function (value) { mode = value; });
  bindOptions('themes', 'data-theme', function (value) { theme = value; });
  bindOptions('formats', 'data-format', function (value) { format = value; });
  source.addEventListener('input', schedulePreview);
  document.getElementById('sample').addEventListener('click', function () { source.value = sample; schedulePreview(); });
  document.getElementById('clear-sample').addEventListener('click', function () { source.value = ''; schedulePreview(); });
  document.getElementById('previous').addEventListener('click', function () { if (pageIndex > 0) { pageIndex -= 1; showPage(); } });
  document.getElementById('next').addEventListener('click', function () { if (layout && pageIndex < layout.pages.length - 1) { pageIndex += 1; showPage(); } });

  generate.addEventListener('click', async function () {
    if (rendering) return;
    renderPreview();
    if (!layout) { status.textContent = '先写一点文字，或点击「试试示例」。'; return; }
    var token = revision;
    var exportLayout = layout;
    rendering = true;
    generate.disabled = true;
    var canvas = document.createElement('canvas');
    try {
      var nextImages = [];
      for (var i = 0; i < exportLayout.pages.length; i += 1) {
        if (token !== revision) return;
        CardRenderer.draw(canvas, exportLayout, i);
        var data = canvas.toDataURL('image/png');
        if (data === 'data:,') throw new Error('当前设备无法生成这张图片，请改用 3:4 分页。');
        nextImages.push(data);
        status.textContent = '正在准备第 ' + (i + 1) + ' / ' + exportLayout.pages.length + ' 张高清图片…';
        await new Promise(function (resolve) { setTimeout(resolve, 0); });
      }
      if (token !== revision) return;
      images = nextImages;
      status.textContent = '已准备 ' + images.length + ' 张高清图片，可以保存或发笔记。';
      document.dispatchEvent(new Event('minitool:results'));
    } catch (error) { status.textContent = error.message || '生成失败，请精简内容后重试。'; }
    finally { canvas.width = 1; canvas.height = 1; rendering = false; generate.disabled = false; }
  });

  aiButton.addEventListener('click', async function () {
    if (aiBusy) return;
    var text = source.value.trim();
    if (!text) { status.textContent = '先输入要润色的文字。'; return; }
    if (text.length > 10000) { status.textContent = 'AI 润色支持 10000 字符以内，请先精简正文。'; return; }
    var original = source.value;
    aiBusy = true;
    aiButton.disabled = true;
    document.getElementById('ai-review').hidden = true;
    status.textContent = '正在生成标题与文案建议…';
    try {
      var ai = window.xhs && window.xhs.AI;
      if (!ai || typeof ai.createModel !== 'function') { aiButton.hidden = true; throw new Error('当前环境暂时没有 AI 润色能力。'); }
      var model = ai.createModel('deepseek-v4-flash');
      var response = await model.generateText({ messages: [{ role: 'system', content: '你是一位文案编辑。保留原文事实和作者语气，润色为自然简洁的小红书文案。第一行生成20字以内标题，随后空一行给出正文。只返回纯文本，不虚构经历。' }, { role: 'user', content: text }], max_output_tokens: 1600, temperature: 0.6 });
      var choices = response && response.choices;
      var result = choices && choices[0] && choices[0].message && choices[0].message.content;
      if (typeof result !== 'string' || !result.trim()) throw new Error('这次没有生成有效文案，可以稍后重试。');
      if (source.value !== original) { status.textContent = '正文已在润色期间修改，请根据当前正文重新润色。'; return; }
      document.getElementById('ai-result').value = result;
      document.getElementById('ai-review').hidden = false;
      status.textContent = '文案建议已就绪，核对后点击应用。';
    } catch (error) {
      var code = String(error && (error.code || error.errCode || error.errMsg || error.message) || '');
      if (code.indexOf('AI_NOT_ALLOWED') >= 0) { aiButton.hidden = true; status.textContent = '当前小工具尚未开通 AI，可以继续手动编辑并生成卡片。'; }
      else if (code.indexOf('AI_QUOTA_EXCEEDED') >= 0) status.textContent = '今日 AI 额度已用完，可以继续手动编辑。';
      else if (code.indexOf('AI_CONTENT_BLOCKED') >= 0) status.textContent = '这次文案未通过 AI 内容检查，请调整后重试。';
      else status.textContent = error.message || 'AI 暂时不可用，可以继续手动编辑。';
    } finally { aiBusy = false; aiButton.disabled = false; }
  });
  document.getElementById('ai-apply').addEventListener('click', function () {
    var text = document.getElementById('ai-result').value;
    if (!text.trim() || text.length > 30000) { status.textContent = '请将建议调整为 1–30000 字符后再应用。'; return; }
    source.value = text;
    document.getElementById('ai-review').hidden = true;
    schedulePreview();
  });
  document.getElementById('ai-dismiss').addEventListener('click', function () { document.getElementById('ai-review').hidden = true; });
  var ai = window.xhs && window.xhs.AI;
  aiButton.hidden = !ai || typeof ai.createModel !== 'function';
  MiniTool.init();
  MiniTool.bindExport({ saveButton: document.getElementById('save'), postButton: document.getElementById('post'), groupContainer: document.getElementById('export-groups'), status: status, getImages: function () { return images; }, getTitle: function () { return noteTitle; }, getContent: function () { return '把认真写下的想法，装进一张卡片里。'; } });
  source.value = sample;
  renderPreview();
}());
