import DefaultTheme from 'vitepress/theme'
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import 'alertifyjs/build/css/alertify.min.css'
import 'photoswipe/style.css';
import { computed, h, onMounted, watch, nextTick } from 'vue';

import ArticleTools from './components/ArticleTools.vue'
import ArticleOutlineToggle from './components/ArticleOutlineToggle.vue'
import VipBtn from './components/VipBtn.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'aside-outline-before': () => h(ArticleOutlineToggle),
    'layout-bottom': () => h(ArticleTools),
  }),
  async enhanceApp({ app }) {
    app.component('VipBtn', VipBtn);
    if (!import.meta.env.SSR && window.location.pathname === '/') {
      const { loadOml2d } = await import('oh-my-live2d');
      loadOml2d({
        models: [
          {
            path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json'
          }
        ]
      });
    }
  },
  setup() {
    const { frontmatter, theme } = useData();
    const route = useRoute();
    const commentHiddenPrefixes = [
      '/backup/',
      '/nav/',
      '/navigation/',
      '/projects/',
      '/spider-tools/',
      '/vip/',
      '/web-intro/',
      '/index/',
    ];
    const commentFrontmatter = computed(() => ({
      ...frontmatter.value,
      comment: route.path !== '/'
        && frontmatter.value.layout !== 'home'
        && frontmatter.value.comment !== false
        && !commentHiddenPrefixes.some((prefix) => route.path.startsWith(prefix)),
    }));
    giscusTalk(
      {
        repo: 'cpython666/cpython666.github.io',
        repoId: 'R_kgDOKKcFRg',
        category: 'Announcements',
        categoryId: 'DIC_kwDOKKcFRs4Cesp-',
        mapping: 'pathname',
        inputPosition: 'bottom',
        lang: 'zh-CN',
      },
      { frontmatter: commentFrontmatter, route },
      false
    );

    const zoomImageSelector = ".vp-doc img:not(.no-zoom):not(.site-icon), .x-backup__media img";
    const imageUrlPattern = /\.(avif|gif|jpe?g|png|svg|webp)([?#].*)?$/i;
    const getImageSrc = (img) => {
      const link = img.closest("a")?.href || "";
      if (imageUrlPattern.test(link)) return link;
      return img.currentSrc || img.src;
    };
    const getZoomItems = () => Array.from(document.querySelectorAll(zoomImageSelector))
      .filter((img) => img.currentSrc || img.src)
      .map((img) => {
        const width = img.naturalWidth || img.width || 1600;
        const height = img.naturalHeight || img.height || Math.round(width * 0.625);
        return {
          src: getImageSrc(img),
          msrc: img.currentSrc || img.src,
          width,
          height,
          alt: img.alt || img.title || "image",
          element: img,
        };
      });
    const openPhotoSwipe = async (target) => {
      const items = getZoomItems();
      const index = items.findIndex((item) => item.element === target);
      if (index < 0) return;
      const { default: PhotoSwipe } = await import("photoswipe");
      const gallery = new PhotoSwipe({
        dataSource: items,
        index,
        bgOpacity: 0.88,
        paddingFn: () => ({ top: 56, bottom: 64, left: 16, right: 16 }),
        showHideAnimationType: "fade",
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
        wheelToZoom: true,
      });
      gallery.on("uiRegister", () => {
        gallery.ui.registerElement({
          name: "download",
          order: 8,
          isButton: true,
          tagName: "a",
          html: "↓",
          title: "下载图片",
          onInit: (el, pswp) => {
            const update = () => {
              if (!pswp.currSlide) return;
              el.href = pswp.currSlide.data.src;
              el.download = "";
              el.target = "_blank";
              el.rel = "noreferrer";
            };
            pswp.on("change", update);
            update();
          },
        });
        gallery.ui.registerElement({
          name: "original",
          order: 9,
          isButton: true,
          tagName: "a",
          html: "↗",
          title: "打开原图",
          onInit: (el, pswp) => {
            const update = () => {
              if (!pswp.currSlide) return;
              el.href = pswp.currSlide.data.src;
              el.target = "_blank";
              el.rel = "noreferrer";
            };
            pswp.on("change", update);
            update();
          },
        });
        gallery.ui.registerElement({
          name: "caption",
          appendTo: "root",
          order: 20,
          isButton: false,
          html: '<div class="pswp-caption"></div>',
          onInit: (el, pswp) => {
            const caption = el.querySelector(".pswp-caption");
            const update = () => {
              if (!pswp.currSlide) return;
              const text = pswp.currSlide.data.alt || "";
              caption.textContent = text;
              el.hidden = !text;
            };
            pswp.on("change", update);
            update();
          },
        });
      });
      gallery.init();
    };
    const initZoom = () => {
      if (import.meta.env.SSR) return;
      document.querySelectorAll(zoomImageSelector).forEach((img) => img.classList.add("is-zoomable"));
    };
    if (!import.meta.env.SSR) {
      document.addEventListener("click", (event) => {
        const target = event.target.closest?.(zoomImageSelector);
        if (!target) return;
        event.preventDefault();
        openPhotoSwipe(target);
      });
    }
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
    const gateId = 'member-gate-overlay';
    const removeGate = () => {
      const ov = document.getElementById(gateId);
      if (ov) ov.remove();
      const docEl = document.querySelector('.VPDoc') || document.querySelector('.main .content') || document.querySelector('.main');
      if (docEl) docEl.classList.remove('member-lock-blur');
    };
    const sha256 = async (s) => {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    };
    const applyGate = async () => {
      const fm = frontmatter.value || {};
      const need = fm.memberOnly === true || fm.memberOnly === 'true';
      if (!need) {
        removeGate();
        return;
      }
      const themeCfg = theme.value || {};
      const globalPass = themeCfg.memberPassword ?? (typeof __VIP_PASSWORD__ !== 'undefined' ? __VIP_PASSWORD__ : undefined);
      const globalHash = themeCfg.memberHash ?? (typeof __VIP_HASH__ !== 'undefined' ? __VIP_HASH__ : undefined);
      const globalActs = themeCfg.vipActivationHashes ?? (typeof __VIP_ACTIVATION_HASHES__ !== 'undefined' ? __VIP_ACTIVATION_HASHES__ : undefined);
      const actList = Array.isArray(globalActs) ? globalActs : (typeof globalActs === 'string' ? [globalActs] : []);
      const key = 'vp_member_unlock:*';
      const unlocked = localStorage.getItem(key) === '1';
      if (unlocked) {
        removeGate();
        return;
      }
      const docEl = document.querySelector('.VPDoc') || document.querySelector('.main .content') || document.querySelector('.main');
      if (docEl) docEl.classList.add('member-lock-blur');
      let overlay = document.getElementById(gateId);
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = gateId;
        overlay.className = 'member-gate-overlay';
        const title = fm.memberTitle || '会员内容已锁定';
        overlay.innerHTML = `
          <div class="member-gate-dialog">
            <h3>${title}</h3>
            <p>这篇内容属于会员专属，输入会员密码后即可继续阅读。</p>
            <div class="row">
              <input type="password" placeholder="输入密码" />
              <div class="member-gate-error"></div>
              <button class="member-gate-primary" type="button" data-action="unlock">确认解锁</button>
              <div class="member-gate-actions">
                <a href="/vip/">了解/开通会员</a>
                <button type="button" data-action="back">返回上一页</button>
              </div>
            </div>
          </div>
        `;
        const input = overlay.querySelector('input');
        const btn = overlay.querySelector('[data-action="unlock"]');
        const backBtn = overlay.querySelector('[data-action="back"]');
        const err = overlay.querySelector('.member-gate-error');
        const submitUnlock = async () => {
          const v = (input?.value || '').trim();
          let ok = false;
          if (globalPass !== undefined && globalPass !== null) {
            const sp = String(globalPass);
            const isHex64 = /^[0-9a-fA-F]{64}$/.test(sp);
            if (isHex64) {
              const h = await sha256(v);
              ok = h.toLowerCase() === sp.toLowerCase();
            } else {
              ok = v === sp;
            }
          } else if (globalHash) {
            const h = await sha256(v);
            ok = h.toLowerCase() === String(globalHash).toLowerCase();
          } else if (actList.length > 0) {
            const items = actList.map(s => String(s));
            const allHex = items.every(x => /^[0-9a-fA-F]{64}$/.test(x));
            if (allHex) {
              const h = await sha256(v);
              ok = items.map(x => x.toLowerCase()).includes(h.toLowerCase());
            } else {
              ok = items.includes(v);
            }
          }
          if (ok) {
            localStorage.setItem(key, '1');
            removeGate();
          } else if (err) {
            err.textContent = '密码错误';
            input?.focus();
          }
        };
        btn.addEventListener('click', submitUnlock);
        input?.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') submitUnlock();
        });
        backBtn?.addEventListener('click', () => {
          if (history.length > 1) {
            history.back();
          } else {
            location.href = '/';
          }
        });
        document.body.appendChild(overlay);
      }
    };
    onMounted(() => {
      applyGate();
    });
    watch(
      () => route.path,
      () => nextTick(() => applyGate())
    );
  }
}
