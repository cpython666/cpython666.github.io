import DefaultTheme from 'vitepress/theme'

import WebLink from './components/WebLink.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app,router,siteData}) {
    // 注册自定义全局组件
    app.component('WebLink',WebLink).use(ElementPlus);
  }
}