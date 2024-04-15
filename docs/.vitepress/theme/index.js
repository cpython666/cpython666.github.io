import DefaultTheme from 'vitepress/theme'

import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';

import WebLink from './components/WebLink.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app,router,siteData}) {
    // 注册自定义全局组件
    app.component('WebLink',WebLink).use(ElementPlus);
  },
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
  }
}