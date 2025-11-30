import DefaultTheme from 'vitepress/theme'
// giscus，评论
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import 'alertifyjs/build/css/alertify.min.css'

// 图片缩放
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';

// import WebLink from './components/WebLink.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VipBtn from './components/VipBtn.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    app.use(ElementPlus);
    app.component('VipBtn', VipBtn);
    if (!import.meta.env.SSR) {
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
    // 添加 giscus 评论系统的 script 标签
  setup() {
    // Get frontmatter and route
    const { frontmatter, theme } = useData();
    const route = useRoute();
    // giscus配置
    giscusTalk({
      repo: 'cpython666/cpython666.github.io', //仓库
      repoId: 'R_kgDOKKcFRg', //仓库ID
      category: 'Announcements', // 讨论分类
      categoryId: 'DIC_kwDOKKcFRs4Cesp-', //讨论分类ID
      mapping: 'pathname',
      inputPosition: 'bottom',
      lang: 'zh-CN',
      }, 
      {
        frontmatter, route
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用,您可以使用“comment:true”序言在页面上单独启用它
      true
    );




    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
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
            <div class="row">
              <input type="password" placeholder="输入密码" />
              <div class="member-gate-error"></div>
              <button type="button">确认</button>
            </div>
          </div>
        `;
        const input = overlay.querySelector('input');
        const btn = overlay.querySelector('button');
        const err = overlay.querySelector('.member-gate-error');
        btn.addEventListener('click', async () => {
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
