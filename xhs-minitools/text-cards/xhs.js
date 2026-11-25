(function () {
  "use strict";

  var storageQueues = Object.create(null);
  var initialized = false;
  var windowRequest = 0;
  var resizeTimer;

  function platform() {
    return window.xhs && window.xhs.miniTool;
  }

  async function clientVersion() {
    var xhs = window.xhs;
    var options = xhs && xhs.launchOptions;
    var build = options && options.miniToolEnv && options.miniToolEnv.buildVersion;
    var miniTool = platform();
    if (!Number(build) && miniTool && typeof miniTool.getLaunchOptions === "function") {
      try {
        options = await miniTool.getLaunchOptions();
        build = options && options.miniToolEnv && options.miniToolEnv.buildVersion;
      } catch (error) {
        return 0;
      }
    }
    return Math.floor((Number(build) || 0) / 1000);
  }

  function positive(value) {
    return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  async function updateSafeArea() {
    var request = ++windowRequest;
    var miniTool = platform();
    if (!miniTool || typeof miniTool.getWindowInfo !== "function") return;
    var version = await clientVersion();
    if (version && version < 9490) return;
    try {
      var info = await miniTool.getWindowInfo();
      if (request !== windowRequest || !info) return;
      var safe = info.safeArea || {};
      var width = positive(info.windowWidth) || window.innerWidth;
      var height = positive(info.windowHeight) || window.innerHeight;
      var top = positive(safe.top);
      var buttons = info.menuButtons || {};
      [buttons.back, buttons.me, buttons.share].forEach(function (button) {
        if (button) top = Math.max(top, positive(button.bottom));
      });
      var insets = {
        top: Math.min(top, height),
        right: typeof safe.right === "number" ? Math.max(0, width - safe.right) : 0,
        bottom: typeof safe.bottom === "number" ? Math.max(0, height - safe.bottom) : 0,
        left: Math.min(positive(safe.left), width)
      };
      Object.keys(insets).forEach(function (side) {
        document.documentElement.style.setProperty("--tool-safe-" + side, positive(insets[side]) + "px");
      });
    } catch (error) {
      // Keep the CSS safe-area fallback when the container cannot provide dimensions.
    }
  }

  async function init() {
    if (!initialized) {
      initialized = true;
      var onResize = function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateSafeArea, 100);
      };
      window.addEventListener("resize", onResize);
      if (window.visualViewport && typeof window.visualViewport.addEventListener === "function") {
        window.visualViewport.addEventListener("resize", onResize);
      }
    }
    await updateSafeArea();
  }

  function errorMessage(error) {
    var message = error && (error.errMsg || error.message);
    if (!message) return "操作未完成，请稍后重试";
    if (/permission|authorize|auth deny|denied|拒绝|授权/i.test(message)) {
      return "未获得相册或平台授权，请允许相应权限后重试";
    }
    if (/cancel|取消/i.test(message)) return "操作已取消，可再次尝试";
    return String(message).slice(0, 140);
  }

  function limitText(value, maximum) {
    var text = String(value || "");
    return text.slice(0, maximum).replace(/[\uD800-\uDBFF]$/, "");
  }

  async function exportPlatform(kind) {
    var miniTool = platform();
    if (!miniTool) {
      throw new Error("当前是浏览器预览，图片已生成。请在小红书小工具中使用存相册和发笔记");
    }
    var methods = ["writeTempFile", kind === "save" ? "saveImageToPhotosAlbum" : "postNote"];
    methods.forEach(function (method) {
      if (typeof miniTool[method] !== "function") {
        throw new Error("当前小红书版本暂不支持图片导出，请更新客户端");
      }
    });
    var version = await clientVersion();
    if (kind === "save" && version && version < 9420) {
      throw new Error("存相册需要小红书 9.42 或更高版本，请更新客户端");
    }
    return { api: miniTool, version: version };
  }

  async function temporaryImage(miniTool, image) {
    if (typeof image !== "string" || !/^data:image\/(png|jpeg|webp|gif);base64,/.test(image)) {
      throw new Error("图片数据无效，请重新生成图片");
    }
    var result = await miniTool.writeTempFile({ data: image });
    if (!result || typeof result.filePath !== "string" || !result.filePath) {
      throw new Error("平台未返回临时图片路径，请重试");
    }
    return result.filePath;
  }

  function bindExport(options) {
    var images = [];
    var revision = 0;
    var saved = 0;
    var group = 0;
    var busy = false;
    var saveLabel = options.saveButton.textContent;
    var postLabel = options.postButton.textContent;

    function message(text) {
      options.status.textContent = text;
    }

    function renderButtons() {
      options.saveButton.disabled = busy || images.length === 0;
      options.postButton.disabled = busy || images.length === 0;
      options.saveButton.textContent = saved > 0 && saved < images.length
        ? "继续保存（" + saved + "/" + images.length + "）"
        : saved > 0 ? "再次保存全部" : saveLabel;
      options.postButton.textContent = images.length > 18
        ? "带第 " + (group + 1) + " 组发笔记"
        : postLabel;
      Array.prototype.forEach.call(options.groupContainer.children, function (button, index) {
        button.disabled = busy;
        button.classList.toggle("is-active", index === group);
        button.setAttribute("aria-pressed", index === group ? "true" : "false");
      });
    }

    function renderGroups() {
      options.groupContainer.textContent = "";
      var count = Math.ceil(images.length / 18);
      options.groupContainer.hidden = count <= 1;
      for (var index = 0; index < count && count > 1; index += 1) {
        (function (groupIndex) {
          var button = document.createElement("button");
          button.type = "button";
          button.className = "chip export-group";
          button.textContent = "第 " + (groupIndex + 1) + " 组 · " + (groupIndex * 18 + 1) + "–" + Math.min((groupIndex + 1) * 18, images.length);
          button.addEventListener("click", function () {
            if (busy) return;
            group = groupIndex;
            renderButtons();
            message("已选择第 " + (group + 1) + " 组，每篇笔记最多带 18 张图片");
          });
          options.groupContainer.appendChild(button);
        }(index));
      }
    }

    function refresh() {
      var current = options.getImages();
      if (!Array.isArray(current)) current = [];
      var changed = images.length !== current.length || images.some(function (image, index) {
        return image !== current[index];
      });
      if (changed) {
        images = current.slice();
        revision += 1;
        saved = 0;
        group = 0;
        renderGroups();
        if (busy) message("结果已更新，正在结束上一次导出");
      }
      renderButtons();
    }

    async function runExport(kind) {
      if (busy) return;
      refresh();
      if (!images.length) {
        message("请先生成图片");
        return;
      }
      busy = true;
      var activeRevision = revision;
      var snapshot = images.slice();
      var selectedGroup = group;
      if (kind === "save" && saved === snapshot.length) saved = 0;
      renderButtons();
      try {
        var title = kind === "post" ? limitText(options.getTitle ? options.getTitle() : "我的图片作品", 20) : "";
        var content = kind === "post" ? limitText(options.getContent ? options.getContent() : "", 1000) : "";
        var target = await exportPlatform(kind);
        if (activeRevision !== revision) return;
        if (kind === "save") {
          while (saved < snapshot.length && activeRevision === revision) {
            message("正在保存第 " + (saved + 1) + "/" + snapshot.length + " 张");
            var filePath = await temporaryImage(target.api, snapshot[saved]);
            if (activeRevision !== revision) return;
            await target.api.saveImageToPhotosAlbum({ filePath: filePath });
            if (activeRevision !== revision) return;
            saved += 1;
          }
          message("已按顺序保存 " + saved + " 张图片到相册");
        } else {
          var start = selectedGroup * 18;
          var selected = snapshot.slice(start, start + 18);
          var resources = [];
          for (var index = 0; index < selected.length; index += 1) {
            message("正在准备第 " + (index + 1) + "/" + selected.length + " 张笔记图片");
            resources.push({ url: await temporaryImage(target.api, selected[index]) });
            if (activeRevision !== revision) return;
          }
          var payload = {
            title: title,
            content: content,
            mediaInfo: { image_resources: resources }
          };
          if (target.version >= 9430) payload.pageType = "photo_publish";
          await target.api.postNote(payload);
          if (activeRevision !== revision) return;
          message("笔记流程已返回，请在小红书确认发布及审核状态" + (snapshot.length > 18 ? "。其余组可分别发送" : ""));
        }
      } catch (error) {
        if (activeRevision === revision) {
          var progress = kind === "save" && saved > 0 ? "已保存 " + saved + "/" + snapshot.length + " 张。" : "";
          message(progress + errorMessage(error) + (kind === "save" && saved > 0 ? "，点击继续保存可从失败项重试" : ""));
        }
      } finally {
        busy = false;
        if (activeRevision !== revision) message(images.length ? "新结果已就绪，可导出新图片" : "请先生成图片");
        renderButtons();
      }
    }

    options.saveButton.addEventListener("click", function () { runExport("save"); });
    options.postButton.addEventListener("click", function () { runExport("post"); });
    document.addEventListener("minitool:results", refresh);
    refresh();
    return { refresh: refresh, isBusy: function () { return busy; } };
  }

  function checkKey(key) {
    if (typeof key !== "string" || !key) throw new Error("缓存名称不能为空");
  }

  function serialize(data) {
    var serialized;
    try {
      serialized = JSON.stringify(data);
    } catch (error) {
      throw new Error("该内容无法保存为本地历史");
    }
    if (typeof serialized !== "string") throw new Error("该内容无法保存为本地历史");
    if (new Blob([serialized]).size > 1024 * 1024) throw new Error("该条历史超过 1MB，请缩短内容后再保存");
    return serialized;
  }

  function parseStored(value) {
    if (value === null || typeof value === "undefined") return null;
    if (typeof value !== "string") throw new Error("本地历史格式无效");
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error("本地历史已损坏，当前工具仍可继续使用");
    }
  }

  function queueStorage(key, operation) {
    var previous = storageQueues[key] || Promise.resolve();
    var pending = previous.catch(function () {}).then(operation);
    storageQueues[key] = pending;
    return pending;
  }

  async function storageTarget(method) {
    var miniTool = platform();
    var version = await clientVersion();
    if (miniTool && version >= 9460) {
      if (typeof miniTool[method] !== "function") throw new Error("当前平台暂不支持历史缓存");
      return miniTool;
    }
    return null;
  }

  async function storageRead(key) {
    checkKey(key);
    return queueStorage(key, async function () {
      var miniTool = await storageTarget("getStorage");
      if (!miniTool) {
        try {
          return parseStored(window.localStorage.getItem(key));
        } catch (error) {
          throw new Error("读取本地历史失败。" + errorMessage(error));
        }
      }
      var result;
      try {
        result = await miniTool.getStorage({ key: key });
      } catch (error) {
        throw new Error("读取平台历史失败。" + errorMessage(error));
      }
      if (!result || !Object.prototype.hasOwnProperty.call(result, "data")) {
        throw new Error("平台历史返回格式无效");
      }
      if (result.data !== null && typeof result.data !== "undefined") return parseStored(result.data);
      var legacy;
      try {
        legacy = window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
      if (legacy === null) return null;
      var parsed = parseStored(legacy);
      if (typeof miniTool.setStorage !== "function") throw new Error("旧历史迁移暂不可用，请更新客户端");
      try {
        await miniTool.setStorage({ key: key, data: serialize(parsed) });
      } catch (error) {
        throw new Error("旧历史迁移失败。" + errorMessage(error));
      }
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        // The platform now owns the data even when the browser copy cannot be removed.
      }
      return parsed;
    });
  }

  async function storageWrite(key, data) {
    checkKey(key);
    var serialized = serialize(data);
    return queueStorage(key, async function () {
      var miniTool = await storageTarget("setStorage");
      try {
        if (miniTool) {
          await miniTool.setStorage({ key: key, data: serialized });
        } else {
          window.localStorage.setItem(key, serialized);
        }
      } catch (error) {
        throw new Error("保存历史失败，当前结果已保留。" + errorMessage(error));
      }
      return true;
    });
  }

  window.MiniTool = {
    init: init,
    bindExport: bindExport,
    storageRead: storageRead,
    storageWrite: storageWrite
  };
}());
