import DefaultTheme from 'vitepress/theme'
// giscus，评论
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';

// 图片缩放
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';

// import WebLink from './components/WebLink.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  async enhanceApp() {
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
    const { frontmatter } = useData();
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
  }
}