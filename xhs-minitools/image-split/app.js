(function () {
  'use strict';
  var input = document.getElementById('photo-input');
  var rowInput = document.getElementById('rows');
  var colInput = document.getElementById('cols');
  var preview = document.getElementById('preview');
  var status = document.getElementById('status');
  var generate = document.getElementById('generate');
  var results = document.getElementById('results');
  var photo = null;
  var images = [];
  var revision = 0;
  var selection = 0;
  var busy = false;

  function dimensions() {
    var rows = Number(rowInput.value);
    var cols = Number(colInput.value);
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows > 12 || cols > 12 || rows * cols > 36) {
      throw new Error('行列请填 1–12 的整数，总数最多 36 格。');
    }
    if (photo && (rows > photo.naturalHeight || cols > photo.naturalWidth)) {
      throw new Error('图片太小，请减少行列数量。');
    }
    return { rows: rows, cols: cols };
  }

  function invalidate() {
    revision += 1;
    images = [];
    results.textContent = '';
    document.getElementById('result-panel').hidden = true;
    document.dispatchEvent(new Event('minitool:results'));
  }

  function updatePreview() {
    generate.disabled = !photo || busy;
    var grid;
    try { grid = dimensions(); } catch (error) {
      status.textContent = error.message;
      generate.disabled = true;
      return;
    }
    var buttons = document.querySelectorAll('#presets button');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute('aria-pressed', String(Number(buttons[i].getAttribute('data-rows')) === grid.rows && Number(buttons[i].getAttribute('data-cols')) === grid.cols));
    }
    if (!photo) return;
    var ratio = Math.min(1, 1000 / Math.max(photo.naturalWidth, photo.naturalHeight));
    preview.width = Math.max(1, Math.round(photo.naturalWidth * ratio));
    preview.height = Math.max(1, Math.round(photo.naturalHeight * ratio));
    var context = preview.getContext('2d');
    if (!context) { status.textContent = '当前环境无法绘图，请换个浏览器预览。'; return; }
    context.drawImage(photo, 0, 0, preview.width, preview.height);
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    context.shadowColor = 'rgba(50,25,25,.6)';
    context.shadowBlur = 3;
    for (var row = 1; row < grid.rows; row += 1) {
      context.beginPath(); context.moveTo(0, row * preview.height / grid.rows); context.lineTo(preview.width, row * preview.height / grid.rows); context.stroke();
    }
    for (var col = 1; col < grid.cols; col += 1) {
      context.beginPath(); context.moveTo(col * preview.width / grid.cols, 0); context.lineTo(col * preview.width / grid.cols, preview.height); context.stroke();
    }
    preview.hidden = false;
    document.getElementById('preview-empty').hidden = true;
    status.textContent = '已预览 ' + grid.rows + ' × ' + grid.cols + '，点击生成获得 ' + (grid.rows * grid.cols) + ' 张切片。';
  }

  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    if (!file) return;
    invalidate();
    selection += 1;
    photo = null;
    document.getElementById('photo-info').textContent = '照片准备好后，就能预览切割效果。';
    preview.hidden = true;
    document.getElementById('preview-empty').hidden = false;
    generate.disabled = true;
    if (file.size > 20 * 1024 * 1024) { status.textContent = '照片超过 20MB，请先缩小再选择。'; input.value = ''; return; }
    var token = selection;
    var url = URL.createObjectURL(file);
    var next = new Image();
    status.textContent = '正在打开照片…';
    next.addEventListener('load', function () {
      URL.revokeObjectURL(url);
      if (token !== selection) return;
      if (!next.naturalWidth || next.naturalWidth * next.naturalHeight > 64000000) {
        status.textContent = '照片像素过大，请缩小到 6400 万像素以内。';
        return;
      }
      photo = next;
      document.getElementById('photo-info').textContent = next.naturalWidth + ' × ' + next.naturalHeight + ' px · 按原图比例均分';
      updatePreview();
    });
    next.addEventListener('error', function () {
      URL.revokeObjectURL(url);
      if (token !== selection) return;
      status.textContent = '这张图片暂时无法读取，请试试 JPG、PNG 或 WebP。';
      input.value = '';
    });
    next.src = url;
  });

  function changeGrid() { invalidate(); updatePreview(); }
  rowInput.addEventListener('input', changeGrid);
  colInput.addEventListener('input', changeGrid);
  document.getElementById('presets').addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) return;
    rowInput.value = button.getAttribute('data-rows');
    colInput.value = button.getAttribute('data-cols');
    changeGrid();
  });

  generate.addEventListener('click', async function () {
    if (!photo || busy) return;
    var grid;
    try { grid = dimensions(); } catch (error) { status.textContent = error.message; return; }
    invalidate();
    var token = revision;
    var original = photo;
    busy = true;
    generate.disabled = true;
    var scale = Math.min(1, 4096 / Math.max(original.naturalWidth, original.naturalHeight), Math.sqrt(12000000 / (original.naturalWidth * original.naturalHeight)));
    var width = Math.floor(original.naturalWidth * scale);
    var height = Math.floor(original.naturalHeight * scale);
    var canvas = document.createElement('canvas');
    var created = [];
    var fragment = document.createDocumentFragment();
    try {
      if (width < grid.cols || height < grid.rows) {
        throw new Error('照片过于狭长，请减少行列数量，或先裁剪照片。');
      }
      for (var row = 0; row < grid.rows; row += 1) {
        for (var col = 0; col < grid.cols; col += 1) {
          if (token !== revision) return;
          var x = Math.floor(col * width / grid.cols);
          var y = Math.floor(row * height / grid.rows);
          canvas.width = Math.floor((col + 1) * width / grid.cols) - x;
          canvas.height = Math.floor((row + 1) * height / grid.rows) - y;
          var context = canvas.getContext('2d');
          if (!context) throw new Error('当前环境无法绘图。');
          context.drawImage(original, col * original.naturalWidth / grid.cols, row * original.naturalHeight / grid.rows, original.naturalWidth / grid.cols, original.naturalHeight / grid.rows, 0, 0, canvas.width, canvas.height);
          var data = canvas.toDataURL('image/png');
          if (data === 'data:,') throw new Error('图片生成失败，请换一张较小的图片。');
          created.push(data);
          var figure = document.createElement('figure');
          figure.className = 'slice';
          var image = document.createElement('img');
          image.src = data;
          image.alt = '第 ' + created.length + ' 张切片';
          var caption = document.createElement('figcaption');
          caption.textContent = String(created.length).padStart(2, '0');
          figure.appendChild(image); figure.appendChild(caption); fragment.appendChild(figure);
          status.textContent = '正在生成 ' + created.length + ' / ' + (grid.rows * grid.cols) + '…';
          await new Promise(function (resolve) { setTimeout(resolve, 0); });
        }
      }
      if (token !== revision) return;
      images = created;
      results.appendChild(fragment);
      results.style.gridTemplateColumns = 'repeat(' + Math.min(grid.cols, 6) + ', minmax(0, 1fr))';
      document.getElementById('result-panel').hidden = false;
      document.getElementById('result-count').textContent = images.length + ' 张，已就绪';
      status.textContent = '切好了！' + images.length + ' 张切片已按顺序排好。' + (scale < 1 ? '为控制内存，整图已等比缩至 ' + width + ' × ' + height + ' px。' : '可以存相册，或带图发笔记。');
      document.dispatchEvent(new Event('minitool:results'));
    } catch (error) { status.textContent = error.message || '生成失败，请重试。'; }
    finally { canvas.width = 1; canvas.height = 1; busy = false; updateGenerate(); }
  });
  function updateGenerate() { generate.disabled = !photo; try { dimensions(); } catch (error) { generate.disabled = true; } }
  MiniTool.init();
  MiniTool.bindExport({ saveButton: document.getElementById('save'), postButton: document.getElementById('post'), groupContainer: document.getElementById('export-groups'), status: status, getImages: function () { return images; }, getTitle: function () { return '把喜欢的瞬间拼成九宫格'; }, getContent: function () { return '用星梦启航九宫格切图，收集生活里的小美好。'; } });
}());
